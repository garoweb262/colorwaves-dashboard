"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { faqsAPI } from "@/lib/api";

interface Faq {
  _id?: string;
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FaqFormModalProps {
  faq?: Faq | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Faq) => void;
}

export function FaqFormModal({ faq, isOpen, onClose, onSave }: FaqFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    question: "",
    answer: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer
      });
    } else {
      setFormData({
        question: "",
        answer: ""
      });
    }
    setErrors({});
  }, [faq, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const faqData = {
        question: formData.question,
        answer: formData.answer
      };

      let savedFaq: Faq;

      if (faq) {
        // Update existing FAQ
        const response = await faqsAPI.updateFaq(faq.id, faqData);
        if (response.success) {
          savedFaq = response.data;
          addToast({
            variant: "success",
            title: "FAQ Updated",
            description: "FAQ has been updated successfully.",
            duration: 4000
          });
        } else {
          throw new Error("Failed to update FAQ");
        }
      } else {
        // Create new FAQ
        const response = await faqsAPI.createFaq(faqData);
        if (response.success) {
          savedFaq = response.data;
          addToast({
            variant: "success",
            title: "FAQ Created",
            description: "FAQ has been created successfully.",
            duration: 4000
          });
        } else {
          throw new Error("Failed to create FAQ");
        }
      }

      onSave(savedFaq!);
      onClose();
    } catch (error: any) {
      console.error("Error saving FAQ:", error);
      
      addToast({
        variant: "error",
        title: faq ? "Update Failed" : "Creation Failed",
        description: error.response?.data?.message || (faq 
          ? "Failed to update FAQ. Please try again."
          : "Failed to create FAQ. Please try again."),
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={faq ? "Edit FAQ" : "Add New FAQ"}>
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <Input
            label="Question"
            placeholder="Enter the question"
            value={formData.question}
            onChange={(e) => handleInputChange("question", e.target.value)}
            error={errors.question}
            required
            fullWidth
          />

          {/* Answer */}
          <Textarea
            label="Answer"
            placeholder="Enter the answer"
            value={formData.answer}
            onChange={(e) => handleInputChange("answer", e.target.value)}
            error={errors.answer}
            required
            rows={4}
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
              {faq ? "Update FAQ" : "Create FAQ"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
