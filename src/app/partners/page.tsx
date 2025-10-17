"use client";

import React, { useEffect, useState } from "react";
import { Button, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { partnersAPI } from "@/lib/api";
import { PartnerFormModal } from "@/components/partners/PartnerFormModal";

interface Partner {
  _id?: string;
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PartnersPage() {
  const { addToast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filtered, setFiltered] = useState<Partner[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const res = await partnersAPI.getPartners();
        if (res.success) {
          setPartners(res.data);
          setFiltered(res.data);
        }
      } catch (e) {
        addToast({ variant: "error", title: "Error", description: "Failed to fetch partners" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, [addToast]);

  useEffect(() => {
    let list = partners;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(s));
    }
    list = [...list].sort((a, b) => {
      const av = (a as any)[sortBy] || '';
      const bv = (b as any)[sortBy] || '';
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFiltered(list);
  }, [partners, search, sortBy, sortOrder]);

  const handleAdd = () => { setEditing(null); setIsFormOpen(true); };
  const handleEdit = (p: Partner) => { setEditing(p); setIsFormOpen(true); };

  const handleSaved = (saved: Partner) => {
    if (editing) {
      setPartners(prev => prev.map(p => p.id === saved.id ? saved : p));
    } else {
      setPartners(prev => [...prev, saved]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await partnersAPI.deletePartner(id);
      setPartners(prev => prev.filter(p => p.id !== id));
      addToast({ variant: "success", title: "Deleted", description: "Partner deleted successfully" });
    } catch (e) {
      addToast({ variant: "error", title: "Error", description: "Failed to delete partner" });
    }
  };

  const handleUpdateStatus = async (p: Partner) => {
    try {
      const newStatus = p.status === 'ACTIVE' ? 'inactive' : 'active';
      const res = await partnersAPI.updateStatus(p.id, newStatus);
      if (res.success) {
        setPartners(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus.toUpperCase() } : x));
        addToast({ variant: "success", title: "Status Updated", description: "Partner status updated" });
      }
    } catch (e) {
      addToast({ variant: "error", title: "Error", description: "Failed to update status" });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(column); setSortOrder('asc'); }
  };

  const sortIcon = (column: string) => sortBy !== column
    ? <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    : (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Partners</h1>
            <p className="text-white/70">Manage partners and their logos</p>
          </div>
          <Button onClick={handleAdd} leftIcon={<Plus className="h-4 w-4" />} className="bg-primary hover:bg-primary-600 text-primary-foreground">
            Add Partner
          </Button>
        </div>

        <div className="glass-card p-4">
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="glass-card hover:glass-card-hover transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'}`}>
                    {p.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-center mb-4">
                  <div className="w-28 h-28 mx-auto mb-3 bg-white/20 flex items-center justify-center overflow-hidden rounded-md">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl font-medium text-white">{p.name?.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="text-palette-gold-600 hover:text-palette-gold-700" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(p)} className="text-palette-blue-600 hover:text-palette-blue-700" title={p.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                    {p.status === 'ACTIVE' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive-600" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <PartnerFormModal
          partner={editing}
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setEditing(null); }}
          onSave={handleSaved}
        />
      </div>
    </DashboardLayout>
  );
}


