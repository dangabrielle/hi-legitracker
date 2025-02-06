const legiscanKey = process.env.LEGISCAN_KEY;
import { Suspense } from "react";
import BillResults from "./bill-results";

import SkeletonCard from "@/components/skeleton-card";
// type BillType = {
//   relevance: number;
//   state: string;
//   bill_number: string;
//   bill_id: number;
//   change_hash: string;
//   url: string;
//   text_url: string;
//   research_url: string;
//   last_action_date: string;
//   last_action: string;
//   title: string;
// };

// type BillQuery = {
//   [key: string]: BillType;
// };

// const bill = {
//   "28": {
//     last_action_date: "2025-01-30",
//     title: "Bill 28",
//   },
//   "29": {
//     last_action_date: "2025-02-01",
//     title: "Bill 29",
//   },
//   "30": {
//     last_action_date: "2025-01-28",
//     title: "Bill 30",
//   },
// };

async function getData() {
  try {
    const data = await fetch(
      `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=UHERO&query=economic%20research%20organization&query=task%20force`
    );
    const results = await data.json();
    const bill = await results.searchresult;
    // console.log(bill);
    return bill;
  } catch (error) {
    console.log(error);
  }
}

export default async function Home() {
  const results = await getData();

  return (
    <>
      {/*TO-DO: FIX SUSPENSE CARD SIZING*/}
      <Suspense fallback={<SkeletonCard />}>
        <BillResults results={results} />
      </Suspense>
    </>
  );
}
