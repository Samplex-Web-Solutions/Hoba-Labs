import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function OnboardingSlide({ slide, selectedData, onSelectOption }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center h-full px-6 py-4 max-w-md mx-auto text-center w-full"
    >
      {/* Badge */}
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-3">
        {slide.badge}
      </span>

      {/* Title & Description */}
      <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
        {slide.title}
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
        {slide.description}
      </p>

      {/* Slide 1 & 6: Custom Loader Graphic */}
      {(slide.type === 'welcome' || slide.type === 'ready') && (
        <div className="w-full flex flex-col items-center justify-center my-6 py-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <div className="w-16 h-16 text-orange-600 mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1">
                <animate id="spinner_w36s" begin="0;spinner_5GfT.end-0.25s" attributeName="x" dur="0.75s" values="4;14;4"></animate>
                <animate begin="0;spinner_5GfT.end-0.25s" attributeName="y" dur="0.75s" values="4;14;4"></animate>
              </rect>
              <rect x="4" y="14" width="6" height="6" rx="1">
                <animate begin="spinner_w36s.end-0.5s" attributeName="x" dur="0.75s" values="4;14;4"></animate>
                <animate begin="spinner_w36s.end-0.5s" attributeName="y" dur="0.75s" values="14;4;14"></animate>
              </rect>
              <rect x="14" y="4" width="6" height="6" rx="1">
                <animate begin="spinner_w36s.end-0.625s" attributeName="x" dur="0.75s" values="14;4;14"></animate>
                <animate begin="spinner_w36s.end-0.625s" attributeName="y" dur="0.75s" values="4;14;4"></animate>
              </rect>
              <rect x="14" y="14" width="6" height="6" rx="1">
                <animate id="spinner_5GfT" begin="spinner_w36s.end-0.375s" attributeName="x" dur="0.75s" values="14;4;14"></animate>
                <animate begin="spinner_w36s.end-0.375s" attributeName="y" dur="0.75s" values="14;4;14"></animate>
              </rect>
            </svg>
          </div>
          <span className="text-xs font-mono tracking-widest text-orange-500 uppercase">Hoba Labs Engine</span>
        </div>
      )}

      {/* Slide 2, 3, 4: Interactive Options */}
      {slide.options && (
        <div className="w-full space-y-2.5 my-2">
          {slide.options.map((opt) => {
            const isSelected = slide.multiSelect 
              ? (selectedData[slide.type] || []).includes(opt)
              : selectedData[slide.type] === opt;

            return (
              <button
                key={opt}
                onClick={() => onSelectOption(slide.type, opt, slide.multiSelect)}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-between transition-all border ${
                  isSelected 
                    ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/10' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'bg-orange-500 border-orange-500 text-slate-950' : 'border-slate-700'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Slide 5: Animated Chart Performance Card (Branded with Orange Theme) */}
      {slide.type === 'animated_chart' && (
        <div className="w-full bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-5 my-2 shadow-2xl relative overflow-hidden text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-orange-400 uppercase font-semibold">Live Performance</span>
              <h3 className="text-xl font-extrabold text-white font-mono mt-0.5">$742,540,918.00</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-400 shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Animated Bar Chart Graphic matching app theme */}
          <div className="h-28 flex items-end justify-between pt-6 px-1 space-x-2">
            {[35, 65, 45, 85, 60, 95, 75].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: "20%" }}
                animate={{ height: [`${height}%`, `${Math.max(20, height - 25)}%`, `${height}%`] }}
                transition={{
                  duration: 2.2 + i * 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="w-full bg-gradient-to-t from-orange-500/20 via-orange-500/50 to-amber-400 rounded-t-md border-t border-amber-400/50"
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}