"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 md:py-5 flex items-center justify-between text-left group hover:text-gray-600 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-medium pr-8 leading-relaxed">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 pb-4 md:pb-5" : "max-h-0"
        )}
      >
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}