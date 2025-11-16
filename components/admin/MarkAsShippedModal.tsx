// components/admin/MarkAsShippedModal.tsx
// ═══════════════════════════════════════════════════════════════
// 📦 NOWIHT - MARK AS SHIPPED MODAL
// Phase 10: Email System Integration
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { X, Truck } from 'lucide-react';

interface MarkAsShippedModalProps {
  orderId: string;
  orderNumber: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MarkAsShippedModal({
  orderId,
  orderNumber,
  onClose,
  onSuccess,
}: MarkAsShippedModalProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('UPS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const carriers = ['UPS', 'FedEx', 'DHL', 'USPS', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError('Tracking number is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          carrier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark as shipped');
      }

      console.log('✅ Order marked as shipped:', data);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Shipping error:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark as shipped');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-md rounded-none border border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5" />
            <h2 className="text-xl font-light tracking-wide">MARK AS SHIPPED</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Number */}
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
              Order Number
            </label>
            <p className="text-sm font-mono">{orderNumber}</p>
          </div>

          {/* Carrier */}
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
              Carrier *
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
              required
            >
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking Number */}
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
              Tracking Number *
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="1Z999AA10123456784"
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm font-mono"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 text-sm text-gray-700">
            <p className="font-medium mb-1">📧 Email Notification</p>
            <p className="text-xs">
              Customer will automatically receive a shipping notification email with tracking details.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
            >
              {isSubmitting ? 'Marking...' : 'Mark as Shipped'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}