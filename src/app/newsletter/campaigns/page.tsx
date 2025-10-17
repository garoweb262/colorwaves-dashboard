"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Trash2, Search, ChevronUp, ChevronDown, ChevronsUpDown, Mail, Calendar, CheckCircle, XCircle, Eye, Edit } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DeleteConfirmModal } from "@/components/newsletter/DeleteConfirmModal";
import { useToast } from "@/amal-ui/components/ToastProvider";
import { newsletterAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

interface NewsletterCampaign {
  id: string;
  _id?: string;
  subject: string;
  messageContent: string;
  headerImageUrl?: string;
  fileUrls: string[];
  status: 'draft' | 'sending' | 'sent' | 'failed';
  sentAt?: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterCampaignsPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<NewsletterCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sending' | 'sent' | 'failed'>('all');
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<NewsletterCampaign | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "Campaigns" }
  ];

  // Load campaigns from API
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await newsletterAPI.getCampaigns();

        if (response.success) {
          setCampaigns(response.data);
          setFilteredCampaigns(response.data);
        }
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        addToast({
          variant: 'error',
          title: 'Error',
          description: 'Failed to load newsletter campaigns.',
        });
        setCampaigns([]);
        setFilteredCampaigns([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [addToast]);

  // Normalize values for safe sorting across different column types
  const getComparableValue = (item: NewsletterCampaign, key: string): number | string => {
    switch (key) {
      case 'subject':
        return (item.subject || '').toLowerCase();
      case 'status':
        return (item.status || '').toString();
      case 'totalRecipients':
        return Number(item.totalRecipients || 0);
      case 'sentCount':
        return Number(item.sentCount || 0);
      case 'failedCount':
        return Number(item.failedCount || 0);
      case 'createdAt':
        return new Date(item.createdAt).getTime() || 0;
      case 'updatedAt':
        return new Date(item.updatedAt).getTime() || 0;
      case 'sentAt':
        return item.sentAt ? new Date(item.sentAt).getTime() : 0;
      default:
        return '';
    }
  };

  // Filter and sort campaigns
  useEffect(() => {
    let filtered = [...campaigns];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.messageContent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = getComparableValue(a, sortBy);
      const bValue = getComparableValue(b, sortBy);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setFilteredCampaigns(filtered);
    setCurrentPage(1);
  }, [campaigns, searchTerm, statusFilter, sortBy, sortOrder]);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      sending: { variant: 'warning' as const, label: 'Sending' },
      sent: { variant: 'success' as const, label: 'Sent' },
      failed: { variant: 'error' as const, label: 'Failed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // API handler functions
  const handleDeleteCampaign = async () => {
    if (!selectedCampaign) return;
    
    try {
      const response = await newsletterAPI.deleteCampaign(selectedCampaign.id || selectedCampaign._id!);
      if (response.success) {
        setCampaigns(prev => prev.filter(campaign => (campaign.id || campaign._id) !== (selectedCampaign.id || selectedCampaign._id)));
        addToast({
          variant: 'success',
          title: 'Campaign Deleted',
          description: 'Campaign has been deleted successfully.',
        });
        setIsDeleteModalOpen(false);
        setSelectedCampaign(null);
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      addToast({
        variant: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete campaign. Please try again.',
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Newsletter Campaigns</h1>
            <p className="text-sm text-white/70 mt-1">
              Manage your newsletter campaigns and view their performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.push('/newsletter/send')}
              leftIcon={<Mail className="h-4 w-4" />}
            >
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="glass-select w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-white/30"
              >
                <option value="all" className="bg-gray-800 text-white">All Status</option>
                <option value="draft" className="bg-gray-800 text-white">Draft</option>
                <option value="sending" className="bg-gray-800 text-white">Sending</option>
                <option value="sent" className="bg-gray-800 text-white">Sent</option>
                <option value="failed" className="bg-gray-800 text-white">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="glass-table">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30"></div>
            </div>
          ) : currentCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No campaigns found</h3>
              <p className="text-white/60 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? "No campaigns match your current filters." 
                  : "Get started by creating your first newsletter campaign."}
              </p>
              <Button onClick={() => router.push('/newsletter/send')}>
                Create Campaign
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader className="glass-table-header">
                  <TableRow className="glass-table-row">
                    <TableHead 
                      className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                      onClick={() => handleSort('subject')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Subject</span>
                        {getSortIcon('subject')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                      onClick={() => handleSort('totalRecipients')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Recipients</span>
                        {getSortIcon('totalRecipients')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                      onClick={() => handleSort('sentCount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sent</span>
                        {getSortIcon('sentCount')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created</span>
                        {getSortIcon('createdAt')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="glass-table-header-cell cursor-pointer hover:bg-white/10 px-6 py-4"
                      onClick={() => handleSort('sentAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sent At</span>
                        {getSortIcon('sentAt')}
                      </div>
                    </TableHead>
                    <TableHead className="glass-table-header-cell text-right px-6 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCampaigns.map((campaign) => (
                    <TableRow key={campaign.id || campaign._id} className="glass-table-row">
                      <TableCell className="glass-table-cell font-medium px-6 py-4">
                        <div className="max-w-xs truncate" title={campaign.subject}>
                          {campaign.subject}
                        </div>
                      </TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span>{campaign.totalRecipients}</span>
                          <Mail className="h-4 w-4 text-white/60" />
                        </div>
                      </TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-green-400">{campaign.sentCount}</span>
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                      </TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-white/60" />
                          <span className="text-sm">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="glass-table-cell px-6 py-4">
                        {campaign.sentAt ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-white/60" />
                            <span className="text-sm">
                              {new Date(campaign.sentAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </TableCell>
                      <TableCell className="glass-table-cell text-right px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/newsletter/campaigns/${campaign.id || campaign._id}`)}
                            title="View Campaign"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Edit campaign
                                console.log('Edit campaign:', campaign);
                              }}
                              title="Edit Campaign"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                            title="Delete Campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    totalItems={filteredCampaigns.length}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCampaign(null);
          }}
          onConfirm={() => { void handleDeleteCampaign(); }}
          subscriberEmail={selectedCampaign?.subject || ''}
        />
      </div>
    </DashboardLayout>
  );
}
