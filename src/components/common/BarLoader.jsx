import React from 'react';

const BarLoader = ({ className = "w-6 h-6 text-current" }) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="6" width="2.8" height="12" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.1s" />
      </rect>
      <rect x="6" y="6" width="2.8" height="12" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.2s" />
      </rect>
      <rect x="11" y="6" width="2.8" height="12" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.3s" />
      </rect>
      <rect x="16" y="6" width="2.8" height="12" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.4s" />
      </rect>
      <rect x="21" y="6" width="2.8" height="12" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="0.5s" />
      </rect>
    </svg>
  );
}

export default BarLoader;