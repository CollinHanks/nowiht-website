// components/admin/SearchableMultiSelect.tsx
// LUXURY: Shopify-like searchable multi-select for MetaObjects
// Louis Vuitton aesthetic, minimal and elegant

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import type { MetaObject, MetaObjectType } from '@/types';

interface SearchableMultiSelectProps {
  type: MetaObjectType;
  label: string;
  placeholder?: string;
  selected: string[]; // Array of selected names
  onChange: (selected: string[]) => void;
  options: MetaObject[]; // All available options
  showColorDots?: boolean; // Show color dots for colors
  maxHeight?: string;
  disabled?: boolean;
}

export default function SearchableMultiSelect({
  type,
  label,
  placeholder = 'Search or add...',
  selected,
  onChange,
  options,
  showColorDots = false,
  maxHeight = 'max-h-60',
  disabled = false,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<MetaObject[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOptions(options);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = options.filter(option =>
        option.name.toLowerCase().includes(query)
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Toggle selection
  const handleToggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter(item => item !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  // Remove selected item
  const handleRemove = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== name));
  };

  // Get color hex for selected item
  const getColorHex = (name: string): string | undefined => {
    return options.find(opt => opt.name === name)?.value;
  };

  // Check if option is selected
  const isSelected = (name: string): boolean => {
    return selected.includes(name);
  };

  // Get label for "Add new" button
  const getAddNewLabel = (): string => {
    const typeLabels: Record<MetaObjectType, string> = {
      color: 'Add Color',
      size: 'Add Size',
      material: 'Add Material',
      fabric: 'Add Fabric',
    };
    return typeLabels[type];
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>

      {/* Main Container */}
      <div
        ref={dropdownRef}
        className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Selected Items + Input */}
        <div
          onClick={() => !disabled && setIsOpen(true)}
          className={`min-h-[44px] w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-text transition-all ${isOpen ? 'border-black ring-1 ring-black' : 'hover:border-gray-400'
            } ${disabled ? 'cursor-not-allowed bg-gray-50' : ''}`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {/* Selected Tags */}
            {selected.map(name => (
              <div
                key={name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-900 text-xs font-medium rounded-md"
              >
                {/* Color Dot (if color type) */}
                {showColorDots && type === 'color' && getColorHex(name) && (
                  <div
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorHex(name) }}
                  />
                )}
                <span>{name}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(name, e)}
                  disabled={disabled}
                  className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => !disabled && setIsOpen(true)}
              placeholder={selected.length === 0 ? placeholder : ''}
              disabled={disabled}
              className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
            />

            {/* Search Icon */}
            {!searchQuery && selected.length === 0 && (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {/* Options List */}
            <div className={`overflow-y-auto ${maxHeight}`}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggle(option.name)}
                    className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${isSelected(option.name) ? 'bg-gray-50' : ''
                      }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${isSelected(option.name)
                          ? 'bg-black border-black'
                          : 'border-gray-300'
                        }`}
                    >
                      {isSelected(option.name) && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>

                    {/* Color Dot */}
                    {showColorDots && type === 'color' && option.value && (
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.value }}
                      />
                    )}

                    {/* Name */}
                    <span className={`text-sm ${isSelected(option.name) ? 'font-medium' : ''}`}>
                      {option.name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>

            {/* Add New Button (Future Enhancement) */}
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={() => {
                  // TODO: Open modal to add new metaobject
                  console.log(`Add new ${type}`);
                }}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{getAddNewLabel()}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {selected.length > 0 && (
        <p className="text-xs text-gray-500">
          {selected.length} {type}(s) selected
        </p>
      )}
    </div>
  );
}