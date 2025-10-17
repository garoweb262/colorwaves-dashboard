"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriberEmail: string;
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  subscriberEmail 
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="Delete Subscriber">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Delete Subscriber</h3>
            <p className="text-sm text-white/70">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-white/80 mb-6">
          Are you sure you want to delete the subscriber <strong className="text-white">{subscriberEmail}</strong>? 
          This will permanently remove them from your newsletter list.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete Subscriber
          </Button>
        </div>
      </div>
    </Modal>
  );
}

