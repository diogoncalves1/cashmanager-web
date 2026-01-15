import React from "react";

interface ProgressBarProps {
  progress: number;
  isCompleted: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isCompleted }) => {
  return (
    <div className="mb-8 relative z-10">
      <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isCompleted
              ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"
          }`}
          style={{
            width: `${progress}%`,
            boxShadow: isCompleted
              ? "0 0 20px 2px rgba(16, 185, 129, 0.4)"
              : "0 0 15px 1px rgba(59, 130, 246, 0.35)",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
