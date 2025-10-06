"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Faq {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (faq) {
        // For edit, only send the editable fields
        const updateData = {
          question: formData.question,
          answer: formData.answer
        };
        onSave(updateData as Faq);
      } else {
        // For create, send all fields
        const savedFaq: Faq = {
          id: Date.now().toString(),
          question: formData.question,
          answer: formData.answer,
          status: "active", // Default to active
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onSave(savedFaq);
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {faq ? "Edit FAQ" : "Add New FAQ"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => handleInputChange("question", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.question ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter the question"
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">{errors.question}</p>
            )}
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer *
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => handleInputChange("answer", e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.answer ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter the answer"
            />
            {errors.answer && (
              <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
            )}
          </div>


          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
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
