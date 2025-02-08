const legiscanKey = process.env.LEGISCAN_KEY;
import { Suspense } from "react";
import BillResults from "./bill-results";

import SkeletonCard from "@/components/skeleton-card";

import { neon } from "@neondatabase/serverless";

async function getData() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT * FROM playing_with_neon`;
  console.log(response);
  return response;
}

async function getBillsFromLegiscan() {
  try {
    // called every 24 hrs
    const data = await fetch(
      `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=UHERO%20OR%20task%20force%20OR%20%20economic%20research%20organization%20OR%working%group`,
      { next: { revalidate: 86400 } }
    );

    const results = await data.json();
    const bill = await results.searchresult;

    /* TO-DO Map through the each object and check if it exists (based on bill_id). if not, add it to the db. If the hash changed, update the information */

    // console.log(bill);
    return bill;
  } catch (error) {
    console.log(error);
  }
}

export default async function Home() {
  const results = await getBillsFromLegiscan();
  // const billsFromDB = await getBillsFromDB();
  const neon = await getData();
  return (
    <>
      {/*TO-DO: FIX SUSPENSE CARD SIZING*/}
      <Suspense fallback={<SkeletonCard />}>
        <BillResults results={results} />
      </Suspense>
    </>
  );
}
