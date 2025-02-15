import React from "react";
import { Skeleton } from "./ui/skeleton";
const SkeletonCard = () => {
  return (
    <div className="flex size-full flex-col mt-5 space-y-3">
      <Skeleton className="h-[125px] max-w-screen-md w-screen rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-20 w-screen max-w-screen-md" />
        <Skeleton className="h-8 w-screen max-w-screen-md" />
        <Skeleton className="h-8 w-screen max-w-screen-md" />
      </div>
    </div>
  );
};

export default SkeletonCard;
