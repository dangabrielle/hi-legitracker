import React from "react";
import SkeletonCard from "@/components/skeleton-card";
import { Suspense } from "react";
import BillResults from "./bill-results";
import { Bill, NewBill, UpdatedBillFields } from "@/lib/types";

type BillTracker = {
  dbBills: Bill[];
  newBills: NewBill[];
  updatedBills: UpdatedBillFields[];
};

const BillTracker = ({ dbBills, newBills, updatedBills }: BillTracker) => {
  return (
    <div className="h-full">
      {/*TO-DO: FIX SUSPENSE CARD SIZING*/}
      <Suspense fallback={<SkeletonCard />}>
        <BillResults
          results={dbBills}
          newBills={newBills}
          updatedBills={updatedBills}
        />
      </Suspense>
    </div>
  );
};

export default BillTracker;
