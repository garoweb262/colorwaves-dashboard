"use client";

import React, { useState } from "react";
import { Button, Checkbox, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, Mail, Users, Send } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTemplate } from "@/components/PageTemplate";
import { useCRUD } from "@/hooks/useCRUD";
import { useRouter } from "next/navigation";

interface NewsletterSubscriber {
  _id?: string;
  id: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    items: subscribers,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage,
    hasPrevPage,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    queryParams,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    updateStatus,
    bulkDelete,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    setQueryParams,
    setError,
    goToNextPage,
    goToPrevPage,
    goToPage
  } = useCRUD<NewsletterSubscriber>({
    endpoint: '/newsletter/subscribers',
    pageSize: 10,
    initialFilters: { status: 'all' }
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFilter = (key: string, value: any) => {
    setFilters((prev: Record<string, any>) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const isEmpty = subscribers.length === 0;

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === subscribers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(subscribers.map(subscriber => subscriber.id));
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} subscribers?`)) {
        const success = await bulkDelete(ids);
        if (success) {
          setSelectedItems([]);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filtersContent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => {
            const value = e.target.value === 'all' ? null : e.target.value;
            handleFilter('status', value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
        <select
          value={filters.verified || 'all'}
          onChange={(e) => {
            const value = e.target.value === 'all' ? null : e.target.value;
            handleFilter('verified', value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <PageTemplate
        title="Newsletter Management"
        description="Manage newsletter subscribers and send campaigns"
        actionButton={
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.push('/newsletter/send')}
              leftIcon={<Send className="h-4 w-4" />}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              Send Newsletter
            </Button>
            <Button
              onClick={() => router.push('/newsletter/campaigns')}
              leftIcon={<Mail className="h-4 w-4" />}
              variant="outline"
            >
              View Campaigns
            </Button>
          </div>
        }
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search subscribers..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filtersContent={filtersContent}
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage="No subscribers found"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPrevPage={goToPrevPage}
        onRefresh={fetchItems}
      >
        {/* Subscribers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Subscriber Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {subscriber.email}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={selectedItems.includes(subscriber.id)}
                    onChange={() => handleSelectItem(subscriber.id)}
                  />
                </div>

                {/* Status Badges */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscriber.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscriber.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscriber.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                {/* Subscription Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subscribed:</span>
                    <span className="text-gray-700">{formatDate(subscriber.subscribedAt)}</span>
                  </div>
                  {subscriber.unsubscribedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Unsubscribed:</span>
                      <span className="text-gray-700">{formatDate(subscriber.unsubscribedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => router.push(`/newsletter/subscribers/${subscriber.id}`)}
                    className="flex-1 bg-primary hover:bg-primary-600 text-primary-foreground"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/newsletter/subscribers/${subscriber.id}/edit`)}
                      className="text-palette-gold-600 hover:text-palette-gold-700"
                      title="Edit Subscriber"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${subscriber.email}?`)) {
                          deleteItem(subscriber.id);
                        }
                      }}
                      className="text-destructive hover:text-destructive-600"
                      title="Delete Subscriber"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedItems.length} subscriber(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete', selectedItems)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageTemplate>
    </DashboardLayout>
  );
}
