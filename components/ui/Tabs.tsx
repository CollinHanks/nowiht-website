// components/ui/Tabs.tsx
// Reusable tab navigation component

"use client";

import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      {/* Desktop Tabs */}
      <div className="hidden md:flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-4 text-sm font-medium tracking-wider transition-colors",
              activeTab === tab.id
                ? "text-black"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Mobile Tabs (Scrollable) */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 min-w-max px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative pb-4 px-2 text-sm font-medium tracking-wider whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "text-black"
                  : "text-gray-500 active:text-gray-900"
              )}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}