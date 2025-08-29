import React from "react";

const CardSkeleton = () => {
  return (
    <div className="skeleton-card flex w-[48%] shrink-0 animate-pulse flex-col gap-1 rounded-xl border-2 border-gray-300 bg-gray-200 shadow-md lg:w-1/6">
      <div className="aspect-square w-full rounded-t-xl bg-gray-300"></div>
      <div className="flex flex-col p-2">
        <div className="mb-2 h-4 w-full rounded-md bg-gray-300"></div>
        <div className="mb-2 h-4 w-[60%] rounded-md bg-gray-300"></div>
        <div className="mb-2 h-6 w-full rounded-md bg-gray-300"></div>
        <div className="h-8 w-full rounded-md bg-gray-300"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
