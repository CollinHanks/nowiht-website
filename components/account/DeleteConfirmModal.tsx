// components/account/DeleteConfirmModal.tsx
// Confirmation modal for deleting addresses

"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  addressLabel: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  addressLabel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center pt-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium tracking-wide mb-3">
              Delete Address
            </h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this address?
            </p>
            <p className="text-sm font-medium text-gray-900">
              "{addressLabel}"
            </p>
            <p className="text-sm text-gray-500 mt-4">
              This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-red-600 text-white text-sm font-medium tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>DELETING...</span>
                </>
              ) : (
                <span>DELETE</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}