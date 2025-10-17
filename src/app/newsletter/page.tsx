"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Trash2, Search, ChevronUp, ChevronDown, ChevronsUpDown, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DeleteConfirmModal } from "@/components/newsletter/DeleteConfirmModal";
import { useToast } from "@/amal-ui/components/ToastProvider";
import { newsletterAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

interface NewsletterSubscriber {
  id: string;
  _id?: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalCampaigns: number;
  sentCampaigns: number;
}

export default function NewsletterPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stats, setStats] = useState<NewsletterStats | null>(null);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Newsletter" }
  ];

  // Load subscribers from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [subscribersResponse, statsResponse] = await Promise.all([
          newsletterAPI.getSubscribers(),
          newsletterAPI.getStats()
        ]);

        if (subscribersResponse.success) {
          setSubscribers(subscribersResponse.data);
          setFilteredSubscribers(subscribersResponse.data);
        }

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Failed to load newsletter data:', error);
        addToast({
          variant: 'error',
          title: 'Error',
          description: 'Failed to load newsletter subscribers.',
        });
        setSubscribers([]);
        setFilteredSubscribers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [addToast]);

  // Filter and sort subscribers
  useEffect(() => {
    let filtered = subscribers.filter(subscriber => subscriber != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(subscriber => {
        const email = (subscriber.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return email.includes(searchLower);
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subscriber => {
        if (statusFilter === 'active') return subscriber.isActive;
        if (statusFilter === 'inactive') return !subscriber.isActive;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof NewsletterSubscriber] || '';
      const bValue = b[sortBy as keyof NewsletterSubscriber] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSubscribers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [subscribers, searchTerm, statusFilter, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sorting functionality
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  // API handler functions
  const handleDeleteSubscriber = async () => {
    if (!selectedSubscriber) return;
    
    try {
      const response = await newsletterAPI.deleteSubscriber(selectedSubscriber.id || selectedSubscriber._id!);
      if (response.success) {
        setSubscribers(prev => prev.filter(sub => (sub.id || sub._id) !== (selectedSubscriber.id || selectedSubscriber._id)));
        addToast({
          variant: 'success',
          title: 'Subscriber Deleted',
          description: 'Subscriber has been removed from the newsletter.',
        });
        setIsDeleteModalOpen(false);
        setSelectedSubscriber(null);
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      addToast({
        variant: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete subscriber. Please try again.',
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Newsletter Subscribers</h1>
            <p className="text-sm text-white/70 mt-1">
              Manage your newsletter subscribers and view statistics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push('/newsletter/campaigns')}
              leftIcon={<Calendar className="h-4 w-4" />}
            >
              View Campaigns
            </Button>
            <Button
              onClick={() => window.open('/newsletter/send', '_blank')}
              leftIcon={<Mail className="h-4 w-4" />}
            >
              Send Newsletter
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSubscribers}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Active Subscribers</p>
                  <p className="text-2xl font-bold text-green-400">{stats.activeSubscribers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Total Campaigns</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCampaigns}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Sent Campaigns</p>
                  <p className="text-2xl font-bold text-white">{stats.sentCampaigns}</p>
                </div>
                <Mail className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="glass-select px-4 py-2 rounded-md focus:ring-2 focus:ring-white/30"
              >
                <option value="all" className="bg-gray-800 text-white">All Status</option>
                <option value="active" className="bg-gray-800 text-white">Active</option>
                <option value="inactive" className="bg-gray-800 text-white">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-table">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="glass-table-header">
                <TableRow className="glass-table-row">
                  <TableHead 
                    className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </TableHead>
                  <TableHead className="glass-table-header-cell px-6 py-4">Status</TableHead>
                  <TableHead className="glass-table-header-cell px-6 py-4">Verified</TableHead>
                  <TableHead 
                    className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                    onClick={() => handleSort('subscribedAt')}
                  >
                    <div className="flex items-center gap-2">
                      Subscribed At
                      {getSortIcon('subscribedAt')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="glass-table-header-cell text-right px-6 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="glass-table-row">
                    <TableCell colSpan={6} className="glass-table-cell text-center py-8 px-6">
                      Loading subscribers...
                    </TableCell>
                  </TableRow>
                ) : currentSubscribers.length === 0 ? (
                  <TableRow className="glass-table-row">
                    <TableCell colSpan={6} className="glass-table-cell text-center py-8 px-6">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id || subscriber._id} className="glass-table-row">
                      <TableCell className="glass-table-cell font-medium px-6 py-4">{subscriber.email}</TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        <Badge variant={subscriber.isActive ? "success" : "default"}>
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        {subscriber.isVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="glass-table-cell text-sm px-6 py-4">
                        {formatDate(subscriber.subscribedAt)}
                      </TableCell>
                      <TableCell className="glass-table-cell text-sm px-6 py-4">
                        {formatDate(subscriber.createdAt)}
                      </TableCell>
                      <TableCell className="glass-table-cell text-right px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubscriber(subscriber);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && filteredSubscribers.length > 0 && (
            <div className="border-t border-white/10 px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showInfo={true}
                totalItems={filteredSubscribers.length}
                pageSize={pageSize}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSubscriber(null);
        }}
        onConfirm={handleDeleteSubscriber}
        subscriberEmail={selectedSubscriber?.email || ''}
      />
    </DashboardLayout>
  );
}
