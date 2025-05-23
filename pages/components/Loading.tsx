import React from "react";

const Loading: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="mb-4">
      <svg
        className="animate-spin h-10 w-10 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
    <span className="text-xl font-semibold">Buscando...</span>
  </div>
);

export default Loading;
