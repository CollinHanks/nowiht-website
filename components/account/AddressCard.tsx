// components/account/AddressCard.tsx
// Display address card with edit/delete actions

"use client";

import { MapPin, Edit2, Trash2, Check } from "lucide-react";
import type { Address } from "@/types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="relative border border-gray-200 p-6 hover:border-black transition-colors group">
      {/* Default Badge */}
      {address.is_default && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-black text-white text-xs font-medium tracking-wider">
          <Check className="w-3 h-3" />
          <span>DEFAULT</span>
        </div>
      )}

      {/* Label */}
      <div className="flex items-start gap-3 mb-4">
        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-medium tracking-wide mb-1">{address.label}</h3>
          <p className="text-sm text-gray-600">
            {address.first_name} {address.last_name}
          </p>
        </div>
      </div>

      {/* Address Details */}
      <div className="ml-8 space-y-1 text-sm text-gray-600">
        <p>{address.street}</p>
        {address.street_line2 && <p>{address.street_line2}</p>}
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
        <p>{address.country}</p>
        {address.phone && <p className="mt-2">Phone: {address.phone}</p>}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onEdit(address)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm font-medium tracking-wider hover:border-black transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          <span>EDIT</span>
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 text-sm font-medium tracking-wider hover:border-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>DELETE</span>
        </button>
      </div>
    </div>
  );
}