import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { onboardingSlides } from './onboardingData';
import OnboardingSlide from './OnboardingSlide';

export default function Onboarding({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    experience: '',
    markets: [],
    timeframes: '',
  });

  const handleSelectOption = (type, value, multiSelect) => {
    if (multiSelect) {
      const current = selectedData[type] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      setSelectedData({ ...selectedData, [type]: updated });
    } else {
      setSelectedData({ ...selectedData, [type]: value });
    }
  };

  const handleNext = async () => {
    if (currentIndex < onboardingSlides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        onComplete();
      } catch (err) {
        console.error("Onboarding completion failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen w-full bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Header / Skip Option */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Hoba Labs Engine</span>
        </div>
        <button 
          onClick={onComplete}
          className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <OnboardingSlide 
            key={onboardingSlides[currentIndex].id} 
            slide={onboardingSlides[currentIndex]} 
            selectedData={selectedData}
            onSelectOption={handleSelectOption}
          />
        </AnimatePresence>
      </div>

      {/* Bottom Navigation & Pagination Dots */}
      <div className="px-6 pb-8 pt-4 space-y-6 max-w-md mx-auto w-full">
        <div className="flex justify-center space-x-2">
          {onboardingSlides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="py-3.5 px-4 rounded-xl font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{currentIndex === onboardingSlides.length - 1 ? 'Enter Dashboard →' : 'Next Step'}</span>
                {currentIndex === onboardingSlides.length - 1 ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}