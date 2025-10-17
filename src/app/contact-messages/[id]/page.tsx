"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, Reply, User, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useToast } from "@/amal-ui/components/ToastProvider";
import * as API from "@/lib/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  phone?: string;
  company?: string;
  replyTitle?: string;
  replyMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessageDetailPageProps {
  params: {
    id: string;
  };
}

export default function ContactMessageDetailPage({ params }: ContactMessageDetailPageProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadMessage = async () => {
      try {
        setIsLoading(true);
        const response = await API.contactMessagesAPI.getMessage(params.id);
        if (response.success) {
          setMessage(response.data);
        }
      } catch (error) {
        console.error('Failed to load contact message:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessage();
  }, [params.id]);

  const handleReply = async () => {
    if (!replyText.trim() || !message) return;

    try {
      setIsReplying(true);
      const response = await API.contactMessagesAPI.replyToMessage(message.id, {
        reply: replyText,
        status: 'replied'
      });

      if (response.success) {
        setMessage(response.data);
        setReplyText("");
        addToast({
          variant: 'success',
          title: 'Reply Sent',
          description: 'Your reply has been sent successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to reply to message:', error);
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
    if (!message) return;

    try {
      setIsUpdatingStatus(true);
      const response = await API.contactMessagesAPI.updateStatus(message.id, status);
      
      if (response.success) {
        setMessage(response.data);
        addToast({
          variant: 'success',
          title: 'Status Updated',
          description: `Contact message status updated to ${status}.`,
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      addToast({
        variant: 'error',
        title: 'Update Failed',
        description: 'Failed to update contact message status. Please try again.',
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

  if (!message) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center glass-panel p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Message Not Found</h2>
            <p className="text-white/70 mb-4">The contact message you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/contact-messages')}>
              Back to Contact Messages
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
              onClick={() => router.push('/contact-messages')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Contact Message Details</h1>
              <p className="text-white/70">View and manage contact message</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              color={message.status === 'replied' ? "green" : message.status === 'pending' ? "yellow" : "gray"}
              size="lg"
            >
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Details */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Message Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Subject</label>
                  <p className="text-lg font-semibold text-white">{message.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Message</label>
                  <div className="glass-panel rounded-md p-4">
                    <p className="text-white whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Section */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Reply className="h-5 w-5 mr-2" />
                Reply to Message
              </h2>
              
              {message.replyMessage ? (
                <div className="space-y-4">
                  <div className="glass-panel bg-green-500/10 border-green-500/20 rounded-md p-4">
                    <h3 className="font-medium text-green-300 mb-2">Previous Reply</h3>
                    <p className="text-green-200 whitespace-pre-wrap">{message.replyMessage}</p>
                  </div>
                </div>
              ) : (
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
              )}
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
                    <p className="text-sm font-medium text-white">{message.name}</p>
                    <p className="text-xs text-white/60">Name</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">{message.email}</p>
                    <p className="text-xs text-white/60">Email</p>
                  </div>
                </div>
                
                {message.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-white/50" />
                    <div>
                      <p className="text-sm font-medium text-white">{message.phone}</p>
                      <p className="text-xs text-white/60">Phone</p>
                    </div>
                  </div>
                )}
                
                {message.company && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-white/50" />
                    <div>
                      <p className="text-sm font-medium text-white">{message.company}</p>
                      <p className="text-xs text-white/60">Company</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Management */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status Management</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">Current Status</span>
                  <Badge
                    color={message.status === 'replied' ? "green" : message.status === 'pending' ? "yellow" : "gray"}
                    size="sm"
                  >
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('replied')}
                    loading={isUpdatingStatus}
                    disabled={message.status === 'replied'}
                    className="w-full"
                  >
                    Mark as Replied
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('accepted')}
                    loading={isUpdatingStatus}
                    disabled={message.status === 'accepted'}
                    className="w-full"
                  >
                    Mark as Accepted
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('declined')}
                    loading={isUpdatingStatus}
                    disabled={message.status === 'declined'}
                    className="w-full"
                  >
                    Mark as Declined
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
                    <p className="text-xs text-white/60">{formatDate(message.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">Last Updated</p>
                    <p className="text-xs text-white/60">{formatDate(message.updatedAt)}</p>
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
