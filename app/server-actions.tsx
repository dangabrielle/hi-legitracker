"use server";

import { neon } from "@neondatabase/serverless";
import { BillType, UpdatedBillFields, NewBill } from "@/lib/types";

const legiscanKey = process.env.LEGISCAN_KEY;
const sql = neon(`${process.env.DATABASE_URL}`);

export async function getData() {
  try {
    const dbBills = await sql`SELECT * FROM bills`;
    return dbBills as BillType[];
  } catch (error) {
    console.error("Error fetching bills from db", error);
    return [];
  }
}

export async function handleBill(
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
    const billStatus = await checkIfExists(bill_id, bill_number);
    console.log(billStatus);
    // if exists, check if hash changed + update as necessary
    // else add it to the db
    if (billStatus) {
      const response =
        await sql`SELECT * FROM bills WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}`;
      const dbBill = response[0];
      const dB_hash = dbBill.change_hash;

      if (change_hash !== dB_hash) {
        // for debugging purposes, distinguishes what fields have changed
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
          updatedDate: new Date(),
        });
        // updates bill accordingly
        await sql`UPDATE bills SET change_hash = ${change_hash}, last_action=${last_action}, last_action_date=${last_action_date}, relevance=${relevance}, research_url=${research_url}, state=${state}, text_url=${text_url}, title=${title}, url=${url}, last_updated=now() WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}`;
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

export async function handleLegiscanData(queryString: string) {
  try {
    const data = await fetch(
      `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=${queryString}`,
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

export async function checkIfExists(bill_id: number, bill_number: string) {
  //   const { bill_id, bill_number } = bill;
  try {
    const billStatus =
      await sql`SELECT EXISTS (SELECT 1 FROM bills WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}) AS exists;`;
    return billStatus[0].exists;
  } catch (error) {
    console.error("error checking across db", error);
  }
}

export async function handleNewQuery(bill: BillType) {
  try {
    const { bill_id, bill_number } = bill;
    const billStatus = await checkIfExists(bill_id, bill_number);
    if (billStatus) {
      const response =
        await sql`SELECT * FROM bills WHERE (bill_number = ${bill_number}) AND bill_id = ${bill_id}`;
      const dbBill = response[0];
      return dbBill;
    } else return bill;
  } catch (error) {
    console.error("error checking across db", error);
  }
}
