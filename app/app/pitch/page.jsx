"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Download, Mail } from "lucide-react";
import { HeroSection } from "@/components/Pitch/HeroSection";
import { ProblemSection } from "@/components/Pitch/ProblemSection";
import { SolutionSection } from "@/components/Pitch/SolutionSection";
import { MarketOpportunitySection } from "@/components/Pitch/MarketOpportunitySection";
import { BusinessModelSection } from "@/components/Pitch/BusinessModelSection";
import { FinancialProjections } from "@/components/Pitch/FinancialProjections";
import { PreLaunchValidation } from "@/components/Pitch/PreLaunchValidation";
import { CompetitiveAdvantageSection } from "@/components/Pitch/CompetitiveAdvantageSection";
import { GoToMarketSection } from "@/components/Pitch/GoToMarketSection";
import { TheAskSection } from "@/components/Pitch/TheAskSection";
import { VisionSection } from "@/components/Pitch/VisionSection";

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const preLaunchStats = {
    waitlistSignups: 2847,
    campusInterest: 45,
    pilotProviders: 156,
    marketValidation: 89,
    monthlySignupGrowth: 450,
    avgIntentValue: 850,
  };

  const slides = [
    {
      id: "hero",
      title: "GRAPPER",
      component: <HeroSection preLaunchStats={preLaunchStats} slideMode />,
    },
    {
      id: "problem",
      title: "The Problem",
      subtitle: "A $50B Pain Point",
      component: <ProblemSection />,
    },
    {
      id: "solution",
      title: "The Solution",
      subtitle: "Grapper: The Campus Economy Ecosystem",
      component: <SolutionSection />,
    },
    {
      id: "market",
      title: "Market Opportunity",
      subtitle: "Riding Multiple Mega-Trends",
      component: <MarketOpportunitySection />,
    },
    {
      id: "business",
      title: "Business Model",
      subtitle: "Multiple Revenue Streams, Strong Unit Economics",
      component: <BusinessModelSection />,
    },
    {
      id: "financials",
      title: "Financial Projections",
      subtitle: "Path to $100M ARR",
      component: <FinancialProjections />,
    },
    {
      id: "validation",
      title: "Pre-Launch Validation",
      subtitle: "Strong Market Demand Proven",
      component: <PreLaunchValidation stats={preLaunchStats} />,
    },
    {
      id: "competitive",
      title: "Competitive Advantage",
      subtitle: "Why Grapper Wins",
      component: <CompetitiveAdvantageSection />,
    },
    {
      id: "gtm",
      title: "Go-to-Market Strategy",
      subtitle: "Viral Campus Growth",
      component: <GoToMarketSection />,
    },
    {
      id: "ask",
      title: "The Ask",
      subtitle: "Fuel Global Expansion",
      component: <TheAskSection />,
    },
    {
      id: "vision",
      title: "Vision",
      subtitle: "Building the Future of Campus Commerce",
      component: <VisionSection />,
    },
    {
      id: "contact",
      title: "Let's Build Together",
      component: (
        <div className="flex items-center justify-center min-h-screen px-8">
          <div className="text-center max-w-4xl">
            <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Thank You
            </h2>
            <p className="text-2xl text-gray-300 mb-12">
              Ready to transform campus commerce together?
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
                <Mail className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
                <p className="text-gray-400 mb-4">investors@grapper.com</p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
                <Download className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Download Deck</h3>
                <button className="mt-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  Get Full Deck
                </button>
              </div>
            </div>

            <div className="text-gray-500 text-sm">
              <p>© 2026 Grapper. Confidential & Proprietary.</p>
              <p className="mt-2">
                For investor use only. Not for redistribution.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentSlide(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden relative">
      {/* Slide Container */}
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden pb-48"
          >
            {/* Slide Header - except for hero slide */}
            {currentSlide !== 0 && (
              <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-white/10 px-8 py-6">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                      GRAPPER
                    </div>
                    <div className="text-center flex-1">
                      <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                        {slides[currentSlide].title}
                      </h2>
                      {slides[currentSlide].subtitle && (
                        <p className="text-gray-400 text-sm mt-1">
                          {slides[currentSlide].subtitle}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      PRE-LAUNCH • SEED ROUND
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide Content */}
            <div className={currentSlide === 0 ? "" : "py-12 px-8"}>
              <div className={currentSlide === 0 ? "" : "max-w-7xl mx-auto"}>
                {slides[currentSlide].component}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-20 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
              <span className="hidden md:inline">Previous</span>
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className="group relative"
                  title={slide.title}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-gradient-to-r from-emerald-400 to-purple-400 scale-125"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 border border-white/20 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {slide.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all"
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Slide {currentSlide + 1} of {slides.length}
            <span className="mx-3">•</span>
            <span className="text-gray-600">
              Use arrow keys or click to navigate
            </span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed top-4 right-4 z-40 bg-black/50 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-400">
        <span className="hidden md:inline">← → Space</span>
        <span className="md:hidden">Swipe or tap arrows</span>
      </div>
    </div>
  );
}
