"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Textarea } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContactMessageReplyModalProps {
  message?: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (messageId: string, replyData: { reply: string; status: string }) => void;
}

export function ContactMessageReplyModal({ message, isOpen, onClose, onReply }: ContactMessageReplyModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    replyMessage: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      setFormData({
        replyMessage: message.replyMessage || ""
      });
    } else {
      setFormData({
        replyMessage: ""
      });
    }
    setErrors({});
  }, [message, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.replyMessage.trim()) {
      newErrors.replyMessage = "Reply message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !message) return;

    setIsSubmitting(true);

    try {
      onReply(message.id, {
        reply: formData.replyMessage,
        status: 'replied'
      });
      
      // Show success toast
      addToast({
        variant: "success",
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
        duration: 4000
      });
      
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: "Reply Failed",
        description: "Failed to send reply. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Reply to Contact Message">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        {message && (
          <div className="space-y-6">
            {/* Original Message */}
            <div className="glass-form-section p-4">
              <h3 className="font-medium text-white mb-3">Original Message</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/80"><strong className="text-white">From:</strong> {message.name} ({message.email})</p>
                <p className="text-white/80"><strong className="text-white">Subject:</strong> {message.subject}</p>
                <p className="text-white/80"><strong className="text-white">Message:</strong></p>
                <div className="glass-card p-3 rounded border-l-4 border-purple-500/50">
                  <p className="whitespace-pre-wrap text-white/90">{message.message}</p>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                label="Reply Message"
                placeholder="Type your reply here..."
                value={formData.replyMessage}
                onChange={(e) => handleInputChange("replyMessage", e.target.value)}
                error={errors.replyMessage}
                required
                rows={6}
                fullWidth
              />

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
}
