"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Badge, useToast } from "@/amal-ui";
import { DashboardLayout } from "@/components/DashboardLayout";
import { newsletterAPI } from "@/lib/api";
import { ArrowLeft, Calendar, CheckCircle, Mail, XCircle, Paperclip, Image as ImageIcon } from "lucide-react";

interface NewsletterCampaign {
  id?: string;
  _id?: string;
  subject: string;
  messageContent: string;
  headerImageUrl?: string;
  fileUrls: string[];
  status: "draft" | "sending" | "sent" | "failed";
  sentAt?: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [campaign, setCampaign] = useState<NewsletterCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await newsletterAPI.getCampaign(id);
        if (response.success) {
          setCampaign(response.data);
        }
      } catch (error) {
        console.error("Failed to load campaign:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to load campaign details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [id, addToast]);

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      sending: { variant: "warning" as const, label: "Sending" },
      sent: { variant: "success" as const, label: "Sent" },
      failed: { variant: "error" as const, label: "Failed" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/newsletter/campaigns")}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Campaign Details</h1>
              <p className="text-sm text-white/70 mt-1">View campaign content and delivery stats</p>
            </div>
          </div>
          <div>
            {getStatusBadge(campaign?.status)}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30" />
          </div>
        )}

        {!isLoading && campaign && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subject */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Subject</h2>
                <p className="text-white/80">{campaign.subject}</p>
              </div>

              {/* Header Image */}
              {campaign.headerImageUrl && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-white/60" /> Header Image
                  </h2>
                  <img
                    src={campaign.headerImageUrl}
                    alt="Header"
                    className="w-full max-h-80 object-cover rounded-md border border-white/20"
                  />
                </div>
              )}

              {/* Content */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Content</h2>
                <div
                  className="prose max-w-none text-white/80"
                  dangerouslySetInnerHTML={{ __html: campaign.messageContent }}
                />
              </div>

              {/* Attachments */}
              {campaign.fileUrls?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-white/60" /> Attachments
                  </h2>
                  <ul className="space-y-2">
                    {campaign.fileUrls.map((url, index) => (
                      <li key={index} className="flex items-center justify-between glass-panel p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-white/60" />
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-400 hover:underline truncate max-w-md"
                            title={url}
                          >
                            {url.split("/").pop() || `Attachment ${index + 1}`}
                          </a>
                        </div>
                        <span className="text-xs text-white/60">Download</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Stats */}
            <div className="space-y-6">
              {/* Delivery Stats */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Delivery Statistics</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Recipients</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{campaign.totalRecipients}</span>
                      <Mail className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Sent</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-400">{campaign.sentCount}</span>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Failed</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-red-400">{campaign.failedCount}</span>
                      <XCircle className="h-4 w-4 text-red-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Created</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <span className="font-medium text-white">{new Date(campaign.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Sent At</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <span className="font-medium text-white">{campaign.sentAt ? new Date(campaign.sentAt).toLocaleString() : '-'}</span>
                    </div>
                  </div>
                  {campaign.errorMessage && (
                    <div className="pt-2 text-sm text-red-400">{campaign.errorMessage}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


