"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge, useToast } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TeamFormModal } from "@/components/teams/TeamFormModal";
import { teamsAPI } from "@/lib/api";

interface Team {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
  order?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPage() {
  const { addToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const response = await teamsAPI.getTeams();
        if (response.success) {
          setTeams(response.data);
          setFilteredTeams(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch team members",
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to fetch team members",
          duration: 5000
        });
        // Fallback to empty array
        setTeams([]);
        setFilteredTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [addToast]);

  // Filter and sort teams
  useEffect(() => {
    let filtered = teams.filter(team => team != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(team => {
        const firstName = (team.firstName || '').toLowerCase();
        const lastName = (team.lastName || '').toLowerCase();
        const position = (team.position || '').toLowerCase();
        const bio = (team.bio || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return firstName.includes(searchLower) ||
               lastName.includes(searchLower) ||
               position.includes(searchLower) ||
               bio.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(team => {
          if (key === 'status') return team.status === value.toUpperCase();
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Team] || '';
      const bValue = b[sortBy as keyof Team] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTeams(filtered);
  }, [teams, searchTerm, filters, sortBy, sortOrder]);

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsFormModalOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleAddTeam = () => {
    setEditingTeam(null);
    setIsFormModalOpen(true);
  };

  const handleTeamSaved = async (savedTeam: Team) => {
    if (!savedTeam) return;
    
    try {
      if (editingTeam) {
        // Update existing team member in local state
        setTeams(prev => prev.map(team => team.id === savedTeam.id ? savedTeam : team));
      } else {
        // Add new team member to local state
        setTeams(prev => [...prev, savedTeam]);
      }
    } catch (error) {
      console.error("Error updating team list:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update team list",
        duration: 5000
      });
    } finally {
      setIsFormModalOpen(false);
      setEditingTeam(null);
    }
  };

  const handleTeamDeleted = async (teamId: string) => {
    if (!teamId) return;
    
    try {
      await teamsAPI.deleteTeam(teamId);
      setTeams(prev => prev.filter(team => team.id !== teamId));
      addToast({
        variant: "success",
        title: "Success",
        description: "Team member deleted successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting team member:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to delete team member",
        duration: 5000
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedTeam(null);
    }
  };

  const handleUpdateStatus = (team: Team) => {
    if (!team) return;
    
    setSelectedTeam(team);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (teamId: string, status: string) => {
    try {
      const response = await teamsAPI.updateStatus(teamId, status);
      if (response.success) {
        setTeams(prev => prev.map(t => 
          t.id === teamId ? { ...t, status: status.toUpperCase() } : t
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: "Team member status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating team member status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update team member status",
        duration: 5000
      });
    } finally {
      setIsStatusModalOpen(false);
      setSelectedTeam(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
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

  // Pagination
  const totalPages = Math.ceil(filteredTeams.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredTeams.slice(startIndex, endIndex);

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Team Members</h1>
            <p className="text-white/70">Manage your team members and their information</p>
          </div>
          <Button
            onClick={handleAddTeam}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Team Member
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 glass-form-section rounded-md">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((team) => (
            <div key={team.id} className="glass-card hover:glass-card-hover transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    team.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                  }`}>
                    {team.status === 'ACTIVE' ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {team.image ? (
                      <img 
                        src={team.image} 
                        alt={`${team.firstName} ${team.lastName}`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-medium text-white">
                        {team.firstName.charAt(0)}{team.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {team.firstName} {team.lastName}
                  </h3>
                  <p className="text-sm text-white/70">{team.position}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-white/70 line-clamp-3">
                    {team.bio}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <span>Created: {formatDate(team.createdAt)}</span>
                  {team.order && <span>Order: {team.order}</span>}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTeam(team)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit Team Member"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(team)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title={team.status === 'ACTIVE' ? "Deactivate" : "Activate"}
                  >
                    {team.status === 'ACTIVE' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeam(team)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete Team Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-white/70">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/40 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No team members found</h3>
            <p className="text-white/70 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first team member"}
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <Button onClick={handleAddTeam} leftIcon={<Plus className="h-4 w-4" />}>
                Add Team Member
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <TeamFormModal
        team={editingTeam}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTeam(null);
        }}
        onSave={handleTeamSaved}
      />
    </DashboardLayout>
  );
}