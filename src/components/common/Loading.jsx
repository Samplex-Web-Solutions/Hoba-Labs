import React from 'react'

const Loading = () => {
  return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          {/* Animated Spinner Icon - Enlarged */}
          <div className="w-16 h-16 text-hobaAccent">
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

          {/* Brand Text & Slogan */}
          <div className="text-center space-y-1">
            <h2 className="text-[18px] font-bold tracking-wider text-white">Hoba Labs</h2>
            <p className="text-[16px] text-slate-400">Automated Forex Signal Engine</p>
          </div>
        </div>
      </div>
  )
}

export default Loading