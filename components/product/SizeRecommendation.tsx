"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserMeasurements, SizeRecommendation as SizeRec } from "@/types";
import {
  calculateSizeRecommendation,
  getSizeChart,
  saveUserMeasurements,
  loadUserMeasurements,
} from "@/lib/sizeCalculator";

/**
 * NOWIHT Size Recommendation Modal
 * 
 * Smart size finder with:
 * - Interactive sliders (height, weight)
 * - Body type & fit preference selection
 * - Real-time size chart
 * - AI-powered recommendation
 * - Saved preferences
 * - Mobile-first responsive
 * - Luxury minimal design
 */

interface SizeRecommendationProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onSelectSize: (size: string) => void;
}

export default function SizeRecommendation({
  isOpen,
  onClose,
  category,
  onSelectSize,
}: SizeRecommendationProps) {
  // Load saved measurements or use defaults
  const savedMeasurements = loadUserMeasurements();

  const [measurements, setMeasurements] = useState<UserMeasurements>(
    savedMeasurements || {
      height: 165,
      weight: 60,
      bodyType: "average",
      fitPreference: "regular",
    }
  );

  const [recommendation, setRecommendation] = useState<SizeRec | null>(null);
  const [showResult, setShowResult] = useState(false);

  const sizeChart = getSizeChart(category);

  // Calculate recommendation
  const handleCalculate = () => {
    const result = calculateSizeRecommendation(measurements, category);
    setRecommendation(result);
    setShowResult(true);
    saveUserMeasurements(measurements);
  };

  // Select recommended size and close
  const handleSelectSize = () => {
    if (recommendation) {
      onSelectSize(recommendation.recommendedSize);
      onClose();
    }
  };

  // Reset and close
  const handleClose = () => {
    setShowResult(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg md:text-2xl font-bold">Find Your Perfect Size</h2>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                AI-powered size recommendation
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-full"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* LEFT: Your Measurements */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
                  Your Measurements
                </h3>

                <div className="space-y-6">
                  {/* Height Slider */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Height: <span className="font-bold text-lg">{measurements.height} cm</span>
                    </label>
                    <input
                      type="range"
                      min="140"
                      max="200"
                      value={measurements.height}
                      onChange={(e) =>
                        setMeasurements({ ...measurements, height: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>140 cm</span>
                      <span>200 cm</span>
                    </div>
                  </div>

                  {/* Weight Slider */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Weight: <span className="font-bold text-lg">{measurements.weight} kg</span>
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="120"
                      value={measurements.weight}
                      onChange={(e) =>
                        setMeasurements({ ...measurements, weight: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>40 kg</span>
                      <span>120 kg</span>
                    </div>
                  </div>

                  {/* Body Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Body Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["slim", "average", "athletic", "curvy"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setMeasurements({ ...measurements, bodyType: type })}
                          className={`px-4 py-3 text-sm font-medium border-2 transition-all capitalize ${measurements.bodyType === type
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fit Preference */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Fit Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["tight", "regular", "loose"] as const).map((fit) => (
                        <button
                          key={fit}
                          onClick={() =>
                            setMeasurements({ ...measurements, fitPreference: fit })
                          }
                          className={`px-4 py-3 text-sm font-medium border-2 transition-all capitalize ${measurements.fitPreference === fit
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                            }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <button
                    onClick={handleCalculate}
                    className="w-full px-8 py-4 bg-black text-white text-sm md:text-base font-medium uppercase tracking-wider hover:bg-gray-900 transition-all"
                  >
                    Calculate My Size
                  </button>

                  {/* Info Badge */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>90% accuracy based on thousands of data points</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Size Chart & Results */}
              <div>
                {/* Size Chart */}
                <div className="mb-6">
                  <h3 className="text-base md:text-lg font-semibold mb-4">
                    Size Chart (inches)
                  </h3>
                  <div className="border border-gray-200 overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Size</th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Bust</th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Waist</th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold">Hips</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChart.map((size, index) => (
                          <tr
                            key={size.size}
                            className={`border-t border-gray-200 ${recommendation?.recommendedSize === size.size
                              ? "bg-black text-white"
                              : ""
                              }`}
                          >
                            <td className="px-3 py-2 md:px-4 md:py-3 font-medium">{size.size}</td>
                            <td className="px-3 py-2 md:px-4 md:py-3">{size.bust}</td>
                            <td className="px-3 py-2 md:px-4 md:py-3">{size.waist}</td>
                            <td className="px-3 py-2 md:px-4 md:py-3">{size.hips}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recommendation Result */}
                <AnimatePresence>
                  {showResult && recommendation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border-2 border-black p-4 md:p-6 space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white flex items-center justify-center rounded-full">
                          <Check className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wider">
                            Recommended Size
                          </p>
                          <p className="text-3xl md:text-4xl font-bold">
                            {recommendation.recommendedSize}
                          </p>
                        </div>
                      </div>

                      {/* Confidence */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${recommendation.confidence}%` }}
                            className="h-full bg-green-600"
                          />
                        </div>
                        <span className="text-sm font-medium">{recommendation.confidence}%</span>
                      </div>

                      {/* Reason */}
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        {recommendation.reason}
                      </p>

                      {/* Alternatives */}
                      {recommendation.alternatives.length > 0 && (
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 mb-2">
                            You may also try:{" "}
                            <span className="font-semibold text-black">
                              {recommendation.alternatives.join(" or ")}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Select Button */}
                      <button
                        onClick={handleSelectSize}
                        className="w-full px-6 py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-all"
                      >
                        Select Size {recommendation.recommendedSize}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}