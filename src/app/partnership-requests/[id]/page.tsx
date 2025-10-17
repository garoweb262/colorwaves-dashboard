"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { ArrowLeft, Mail, Phone, Calendar, Handshake, Reply, User, Clock, Building } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useToast } from "@/amal-ui/components/ToastProvider";
import * as API from "@/lib/api";

interface PartnershipRequest {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  partnershipType: string;
  message?: string;
  description?: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface PartnershipRequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function PartnershipRequestDetailPage({ params }: PartnershipRequestDetailPageProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [request, setRequest] = useState<PartnershipRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setIsLoading(true);
        const response = await API.partnershipRequestsAPI.getRequest(params.id);
        if (response.success) {
          setRequest(response.data);
        }
      } catch (error) {
        console.error('Failed to load partnership request:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [params.id]);

  const handleReply = async () => {
    if (!replyText.trim() || !request) return;

    try {
      setIsReplying(true);
      const response = await API.partnershipRequestsAPI.replyToRequest(request.id, {
        reply: replyText,
        status: 'accepted'
      });

      if (response.success) {
        setRequest(response.data);
        setReplyText("");
        addToast({
          variant: 'success',
          title: 'Reply Sent',
          description: 'Your reply has been sent successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to reply to request:', error);
      addToast({
        variant: 'error',
        title: 'Reply Failed',
        description: 'Failed to send reply. Please try again.',
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!request) return;

    try {
      setIsUpdatingStatus(true);
      const response = await API.partnershipRequestsAPI.updateStatus(request.id, status);
      
      if (response.success) {
        setRequest(response.data);
        addToast({
          variant: 'success',
          title: 'Status Updated',
          description: `Partnership request status updated to ${status}.`,
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      addToast({
        variant: 'error',
        title: 'Update Failed',
        description: 'Failed to update partnership request status. Please try again.',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-violet"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Request Not Found</h2>
            <p className="text-white/70 mb-4">The partnership request you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/partnership-requests')}>
              Back to Partnership Requests
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/partnership-requests')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Partnership Request</h1>
              <p className="text-white/70">Partnership request from {request.fullName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              color={
                request.status === 'replied' ? "green" : 
                request.status === 'pending' ? "yellow" : "gray"
              }
              size="lg"
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Partnership Details */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Handshake className="h-5 w-5 mr-2" />
                Partnership Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Partnership Type</label>
                  <p className="text-lg font-semibold text-white">{request.partnershipType}</p>
                </div>
                
                {request.message && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Message</label>
                    <div className="glass-panel rounded-md p-4">
                      <p className="text-white whitespace-pre-wrap">{request.message}</p>
                    </div>
                  </div>
                )}

                {request.description && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                    <div className="glass-panel rounded-md p-4">
                      <p className="text-white whitespace-pre-wrap">{request.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Section */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Reply className="h-5 w-5 mr-2" />
                Reply to Request
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Reply Message
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="glass-textarea w-full px-3 py-2 rounded-md"
                    placeholder="Type your reply here..."
                  />
                </div>
                <Button
                  onClick={handleReply}
                  loading={isReplying}
                  disabled={!replyText.trim() || isReplying}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">{request.fullName}</p>
                    <p className="text-xs text-white/60">Full Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">{request.companyName}</p>
                    <p className="text-xs text-white/60">Company</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">{request.email}</p>
                    <p className="text-xs text-white/60">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">{request.phoneNumber}</p>
                    <p className="text-xs text-white/60">Phone</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status Management</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">Current Status</span>
                  <Badge
                    color={
                      request.status === 'replied' ? "green" : 
                      request.status === 'pending' ? "yellow" : "gray"
                    }
                    size="sm"
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('accepted')}
                    loading={isUpdatingStatus}
                    disabled={request.status === 'accepted'}
                    className="w-full"
                  >
                    Mark as Under Review
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('accepted')}
                    loading={isUpdatingStatus}
                    disabled={request.status === 'accepted'}
                    className="w-full"
                  >
                    Accept Partnership
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('declined')}
                    loading={isUpdatingStatus}
                    disabled={request.status === 'declined'}
                    className="w-full"
                  >
                    Decline Partnership
                  </Button>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timestamps
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">Created</p>
                    <p className="text-xs text-white/60">{formatDate(request.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">Last Updated</p>
                    <p className="text-xs text-white/60">{formatDate(request.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
