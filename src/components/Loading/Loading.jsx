import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
      <span className="loading loading-bars loading-lg text-primary"></span>
      <span className="text-secondary font-medium tracking-[0.2em] uppercase animate-pulse text-sm">
        loading
      </span>
    </div>
  );
};

export default Loading;
