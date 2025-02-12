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
  created_at: Date;
};

type UpdatedBillFields = {
  bill_id: number;
  bill_number: string;
  relevance?: string;
  state?: string;
  change_hash: string;
  url: string;
  text_url?: string;
  research_url?: string;
  last_action_date?: string;
  last_action?: string;
  title?: string;
};

type NewBill = [bill_number: string, url: string];

const legiscanKey = process.env.LEGISCAN_KEY;
const sql = neon(`${process.env.DATABASE_URL}`);

async function getData() {
  try {
    const response = await sql`SELECT * FROM bills`;
    return response as BillType[];
  } catch (error) {
    console.error("Error fetching bills from db", error);
    return [];
  }
}

async function handleBill(
  bill: BillType,
  newBills: NewBill[],
  updatedBills: UpdatedBillFields[]
) {
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

  try {
    // check if bill exists in db
    const billStatus =
      await sql`SELECT EXISTS (SELECT 1 FROM bills WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}) AS exists;`;
    console.log(billStatus);
    // if exists, check if hash changed + update as necessary
    // else add it to the db
    if (billStatus[0].exists) {
      const response =
        await sql`SELECT * FROM bills WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}`;
      const dbBill = response[0];
      const dB_hash = dbBill.change_hash;

      if (change_hash !== dB_hash) {
        // for UI purposes, distinguishes what fields have changed
        updatedBills.push({
          bill_id: bill_id,
          bill_number: bill_number,
          relevance: relevance !== dbBill.relevance ? relevance.toString() : "",

          change_hash: change_hash,
          url: url,
          text_url: text_url !== dbBill.text_url ? text_url : "",
          research_url:
            research_url !== dbBill.research_url ? research_url : "",
          last_action_date:
            last_action_date !== dbBill.last_action_date
              ? last_action_date
              : "",
          last_action: last_action !== dbBill.last_action ? last_action : "",
          title: title !== dbBill.title ? title : "",
        });
        // updates bill accordingly
        await sql`UPDATE bills SET change_hash = ${change_hash}, last_action=${last_action}, last_action_date=${last_action_date}, relevance=${relevance}, research_url=${research_url}, state=${state}, text_url=${text_url}, title=${title}, url=${url} WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}`;
        console.log("hash changed");
      }
    } else {
      await sql`INSERT INTO bills (bill_id, bill_number, change_hash, last_action, last_action_date, relevance, research_url, state, text_url, title, url) VALUES (${bill_id}, ${bill_number}, ${change_hash}, ${last_action}, ${last_action_date}, ${relevance}, ${research_url}, ${state},  ${text_url}, ${title}, ${url})`;

      newBills.push([bill_number, url]);
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleLegiscanData() {
  try {
    // called every 24 hrs
    const data = await fetch(
      `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=UHERO+OR+"task+force"+OR+"economic+research+organization"+OR+"working+group"`,
      { next: { revalidate: 86400 } }
    );

    if (data.ok) {
      const results = await data.json();

      const bills = await results.searchresult;

      // clean up response data, reformat to an array
      const billsArray: BillType[] = Object.values(bills);

      billsArray.pop();

      return billsArray;
    }
  } catch (error) {
    console.error("Error pulling from API", error);
  }
}

export default async function Home() {
  const newBills: NewBill[] = [];
  const updatedBills: UpdatedBillFields[] = [];

  const billsArray = await handleLegiscanData();

  if (billsArray) {
    for (const bill of billsArray) {
      await handleBill(bill, newBills, updatedBills);
    }
  }

  const currentBills = await getData();
  // console.log(currentBills);
  console.log(newBills);
  console.log(updatedBills);

  return (
    <>
      {/*TO-DO: FIX SUSPENSE CARD SIZING*/}
      <Suspense fallback={<SkeletonCard />}>
        <BillResults
          results={currentBills}
          newBills={newBills}
          updatedBills={updatedBills}
        />
      </Suspense>
    </>
  );
}
