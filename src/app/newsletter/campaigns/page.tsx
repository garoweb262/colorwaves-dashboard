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
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Campaigns</h1>
            <p className="text-sm text-gray-500 mt-1">
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-violet"></div>
            </div>
          ) : currentCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-4">
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
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('subject')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Subject</span>
                        {getSortIcon('subject')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('totalRecipients')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Recipients</span>
                        {getSortIcon('totalRecipients')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('sentCount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sent</span>
                        {getSortIcon('sentCount')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created</span>
                        {getSortIcon('createdAt')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('sentAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sent At</span>
                        {getSortIcon('sentAt')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCampaigns.map((campaign) => (
                    <TableRow key={campaign.id || campaign._id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate" title={campaign.subject}>
                          {campaign.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{campaign.totalRecipients}</span>
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-green-600">{campaign.sentCount}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign.sentAt ? (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(campaign.sentAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
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
                            className="text-red-600 hover:text-red-700"
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
                <div className="px-6 py-4 border-t border-gray-200">
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
