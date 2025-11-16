"use client";

import { useState } from "react";
import Link from "next/link";
import { Ruler, Info, Calculator } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SizeGuidePage() {
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    hips: "",
  });
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const calculateSize = () => {
    const bust = parseFloat(measurements.bust);
    const waist = parseFloat(measurements.waist);
    const hips = parseFloat(measurements.hips);

    if (!bust || !waist || !hips) return;

    // Convert to cm if in inches
    const bustCm = unit === "in" ? bust * 2.54 : bust;
    const waistCm = unit === "in" ? waist * 2.54 : waist;
    const hipsCm = unit === "in" ? hips * 2.54 : hips;

    // Size calculation logic
    if (bustCm <= 84 && waistCm <= 66 && hipsCm <= 91) {
      setRecommendedSize("XS");
    } else if (bustCm <= 89 && waistCm <= 71 && hipsCm <= 96) {
      setRecommendedSize("S");
    } else if (bustCm <= 94 && waistCm <= 76 && hipsCm <= 101) {
      setRecommendedSize("M");
    } else if (bustCm <= 99 && waistCm <= 81 && hipsCm <= 106) {
      setRecommendedSize("L");
    } else {
      setRecommendedSize("XL");
    }
  };

  const sizeChart = {
    XS: { eu: "32-34", us: "0-2", tr: "34-36", bust: "78-84", waist: "60-66", hips: "85-91" },
    S: { eu: "36-38", us: "4-6", tr: "38-40", bust: "85-89", waist: "67-71", hips: "92-96" },
    M: { eu: "40-42", us: "8-10", tr: "42-44", bust: "90-94", waist: "72-76", hips: "97-101" },
    L: { eu: "44-46", us: "12-14", tr: "46-48", bust: "95-99", waist: "77-81", hips: "102-106" },
    XL: { eu: "48-50", us: "16-18", tr: "50-52", bust: "100-105", waist: "82-87", hips: "107-112" },
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-black">
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6">FIT & SIZING</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">Size Guide</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Find your perfect fit with our interactive size calculator</p>
          </div>
        </section>

        {/* Fit Info Banner */}
        <section className="py-16 bg-blue-50 border-b border-blue-200">
          <div className="max-w-4xl mx-auto px-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium mb-2 text-blue-900">NOWIHT Fit Philosophy</h3>
              <p className="text-sm text-blue-800">Our designs feature a contemporary, relaxed fit designed for all-day comfort. Organic cotton naturally breathes and moves with you. If between sizes, size up for a relaxed fit or down for a more tailored look.</p>
            </div>
          </div>
        </section>

        {/* Interactive Size Calculator */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Calculator className="w-6 h-6" />
                <h2 className="text-3xl font-light">Size Calculator</h2>
              </div>
              <p className="text-gray-600">Enter your measurements to find your perfect size</p>
            </div>

            <div className="bg-white p-8 md:p-12 border-2 border-gray-200 shadow-lg">
              {/* Unit Toggle */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setUnit("cm")}
                  className={`px-6 py-2 font-medium transition-all ${
                    unit === "cm"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Centimeters (cm)
                </button>
                <button
                  onClick={() => setUnit("in")}
                  className={`px-6 py-2 font-medium transition-all ${
                    unit === "in"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Inches (in)
                </button>
              </div>

              {/* Input Fields */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bust {unit === "cm" ? "(cm)" : "(in)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.bust}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, bust: e.target.value })
                    }
                    placeholder={unit === "cm" ? "85" : "33.5"}
                    className="w-full p-3 border-2 border-gray-300 focus:border-black focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Waist {unit === "cm" ? "(cm)" : "(in)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.waist}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, waist: e.target.value })
                    }
                    placeholder={unit === "cm" ? "67" : "26.5"}
                    className="w-full p-3 border-2 border-gray-300 focus:border-black focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hips {unit === "cm" ? "(cm)" : "(in)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measurements.hips}
                    onChange={(e) =>
                      setMeasurements({ ...measurements, hips: e.target.value })
                    }
                    placeholder={unit === "cm" ? "92" : "36"}
                    className="w-full p-3 border-2 border-gray-300 focus:border-black focus:outline-none text-lg"
                  />
                </div>
              </div>

              <button
                onClick={calculateSize}
                className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-all font-medium tracking-wider text-lg"
              >
                CALCULATE MY SIZE
              </button>

              {/* Result */}
              {recommendedSize && (
                <div className="mt-8 p-6 bg-green-50 border-2 border-green-600">
                  <h3 className="text-2xl font-medium text-center mb-4">
                    Your Recommended Size: <span className="text-green-600">{recommendedSize}</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-medium mb-1">EU Size</div>
                      <div className="text-lg">{sizeChart[recommendedSize as keyof typeof sizeChart].eu}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">US Size</div>
                      <div className="text-lg">{sizeChart[recommendedSize as keyof typeof sizeChart].us}</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">TR Size</div>
                      <div className="text-lg">{sizeChart[recommendedSize as keyof typeof sizeChart].tr}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to Measure */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Ruler className="w-6 h-6" />
              <h2 className="text-3xl font-light">How to Measure</h2>
            </div>
            <p className="text-gray-600">Use a soft measuring tape for accurate results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                name: "Bust",
                desc: "Measure around the fullest part of your bust, keeping the tape parallel to the floor. Wear a non-padded bra for accuracy.",
              },
              {
                step: "2",
                name: "Waist",
                desc: "Find your natural waistline (the narrowest part of your torso, usually just above your belly button). Measure comfortably, not too tight.",
              },
              {
                step: "3",
                name: "Hips",
                desc: "Measure around the fullest part of your hips, approximately 8-9 inches below your waist. Stand with feet together.",
              },
            ].map((measure) => (
              <div key={measure.step} className="text-center p-6 border border-gray-200 bg-white">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                  {measure.step}
                </div>
                <h3 className="font-medium mb-2 text-xl">{measure.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{measure.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Complete Size Chart */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-3xl font-light mb-8 text-center">Complete Size Chart</h3>
            <div className="overflow-x-auto bg-white border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-4 text-left font-medium">NOWIHT</th>
                    <th className="p-4 text-left font-medium">EU</th>
                    <th className="p-4 text-left font-medium">US</th>
                    <th className="p-4 text-left font-medium">TR</th>
                    <th className="p-4 text-left font-medium">Bust (cm)</th>
                    <th className="p-4 text-left font-medium">Waist (cm)</th>
                    <th className="p-4 text-left font-medium">Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeChart).map(([size, data]) => (
                    <tr key={size} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-medium text-lg">{size}</td>
                      <td className="p-4">{data.eu}</td>
                      <td className="p-4">{data.us}</td>
                      <td className="p-4">{data.tr}</td>
                      <td className="p-4">{data.bust}</td>
                      <td className="p-4">{data.waist}</td>
                      <td className="p-4">{data.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Fit Tips */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-light mb-8 text-center">Fit Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Between Sizes?", tip: "If your measurements fall between two sizes, we recommend sizing up for optimal comfort in our relaxed-fit designs." },
              { title: "Tracksuits & Sets", tip: "Designed for all-day comfort with natural stretch. Most customers find their regular size provides the perfect fit." },
              { title: "Organic Cotton", tip: "Our organic cotton fabrics breathe beautifully and soften with each wash, conforming gently to your shape." },
              { title: "Body Type", tip: "Different body proportions? Use your largest measurement as the guide and consider alterations if needed." },
            ].map((tip, i) => (
              <div key={i} className="p-6 bg-gray-50 border-l-4 border-black">
                <h4 className="font-medium mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-black text-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-light mb-4">Still Unsure About Your Size?</h2>
            <p className="text-gray-400 mb-8">Our customer care team is here to help you find the perfect fit</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3.5 border border-white hover:bg-white hover:text-black transition-all">
                CONTACT US
              </Link>
              <Link href="/shop" className="px-8 py-3.5 bg-white text-black hover:bg-gray-200 transition-all">
                START SHOPPING
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}