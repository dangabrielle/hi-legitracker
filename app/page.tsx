const legiscanKey = process.env.LEGISCAN_KEY;
import { Suspense } from "react";
import BillResults from "./bill-results";

import SkeletonCard from "@/components/skeleton-card";

import { neon } from "@neondatabase/serverless";

type BillType = {
  relevance: number;
  state: string;
  bill_number: string;
  bill_id: number;
  change_hash: string;
  url: string;
  text_url: string;
  research_url: string;
  last_action_date: string;
  last_action: string;
  title: string;
};
async function getData() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    const response = await sql`SELECT * FROM bills`;

    return response;
  } catch (error) {
    console.error("Error fetching bills from db", error);
    return [];
  }
}

async function checkIfExists(bill_number: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    const storedBill =
      await sql`SELECT EXISTS (SELECT 1 FROM bills WHERE bill_number = ${bill_number}) AS exists;`;
    console.log(storedBill[0].exists);
    return storedBill[0].exists;
  } catch (error) {
    console.error(error);
  }
}

async function createBillEntry(bill: BillType) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const {
    bill_id,
    bill_number,
    change_hash,
    last_action,
    last_action_date,
    relevance,
    research_url,
    state,
    text_url,
    title,
    url,
  } = bill;

  await sql`INSERT INTO bills (bill_id, bill_number, change_hash, last_action, last_action_date, relevance, research_url, state, text_url, title, url) VALUES (${bill_id}, ${bill_number}, ${change_hash}, ${last_action}, ${last_action_date}, ${relevance}, ${research_url}, ${state},  ${text_url}, ${title}, ${url})
`;
}

async function getBillsFromLegiscan() {
  try {
    // called every 24 hrs
    const data = await fetch(
      `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=UHERO%20OR%20task%20force%20OR%20%20economic%20research%20organization%20OR%working%group`,
      { next: { revalidate: 86400 } }
    );

    const results = await data.json();
    const bills = await results.searchresult;

    const billsArray: BillType[] = Object.values(bills);
    billsArray.pop();
    for (const bill of billsArray) {
      const billStatus = await checkIfExists(bill.bill_number);
      if (!billStatus) {
        await createBillEntry(bill);
      }
    }
    // console.log(billsArray);
    // console.log(bills);

    /* TO-DO Map through the each object and check if it exists (based on bill_id). if not, add it to the db. If the hash changed, update the information */

    // console.log(bill);
    return billsArray;
  } catch (error) {
    console.log(error);
  }
}

export default async function Home() {
  const checkNewBills = await getBillsFromLegiscan();
  const currentBills = await getData();
  console.log("current bills " + typeof currentBills);
  // const billsFromDB = await getBillsFromDB();

  return (
    <>
      {/*TO-DO: FIX SUSPENSE CARD SIZING*/}
      <Suspense fallback={<SkeletonCard />}>
        <BillResults results={currentBills} />
      </Suspense>
    </>
  );
}
