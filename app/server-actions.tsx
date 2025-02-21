"use server";

import { neon } from "@neondatabase/serverless";
import { Bill, UpdatedBillFields, NewBill } from "@/lib/types";

const legiscanKey = process.env.LEGISCAN_KEY;
const sql = neon(`${process.env.DATABASE_URL}`);

export async function getData(): Promise<Bill[]> {
  try {
    const dbBills = await sql`SELECT * FROM bills`;
    return dbBills as Bill[];
  } catch (error) {
    console.error("Error fetching bills from db", error);
    return [];
  }
}

// initial page load cross checks current db bills with fetched bills from API
// adds new bills and updates existing bills if hash property changed
export async function handleBill(
  bills: Bill[],
  newBills: NewBill[],
  updatedBills: UpdatedBillFields[]
): Promise<void> {
  try {
    // check if bill exists in db
    const [existingBills, billSet] = await checkIfExists(bills);
    // O(1) lookup operation
    const existingBillsMap = new Map(
      existingBills.map((bill) => [bill.bill_id, bill])
    );

    // if exists, check if hash changed + update as necessary
    // else add it to the db
    for (const bill of bills) {
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

      if (!billSet.has(bill_id)) {
        // await sql`INSERT INTO bills (bill_id, bill_number, change_hash, last_action, last_action_date, relevance, research_url, state, text_url, title, url) VALUES (${bill_id}, ${bill_number}, ${change_hash}, ${last_action}, ${last_action_date}, ${relevance}, ${research_url}, ${state},  ${text_url}, ${title}, ${url})`;

        await createBillEntry(bill);
        newBills.push([bill_number, url]);
      } else {
        const dbBill = existingBillsMap.get(bill_id);
        if (dbBill && dbBill?.change_hash !== change_hash) {
          // for debugging purposes, distinguishes what fields have changed
          updatedBills.push({
            bill_id: bill_id,
            bill_number: bill_number,
            relevance:
              relevance !== dbBill.relevance ? relevance.toString() : "",

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
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function createBillEntry(bill: Bill): Promise<string> {
  try {
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

    await sql`INSERT INTO bills (bill_id, bill_number, change_hash, last_action, last_action_date, relevance, research_url, state, text_url, title, url) VALUES (${bill_id}, ${bill_number}, ${change_hash}, ${last_action}, ${last_action_date}, ${relevance}, ${research_url}, ${state},  ${text_url}, ${title}, ${url})`;
    console.log(`Bill ${bill_number} successfully added.`);
    return "OK";
  } catch (error) {
    console.error("Error creating bill entry", error);
    return "ERROR";
  }
}

export async function handleLegiscanData(queryString: string): Promise<Bill[]> {
  try {
    // fetch data every 24 hrs
    const data = await fetch(
      `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=${queryString}`,
      { next: { revalidate: 86400 } }
    );

    if (data.ok) {
      const results = await data.json();

      const bills = await results.searchresult;

      // clean up response data, reformat to an array
      const billsArray: Bill[] = Object.values(bills);

      billsArray.pop();

      return billsArray;
    }
  } catch (error) {
    console.error("Error pulling from API", error);
  }
  return [];
}

// checks if data from API exists in db and returns existing bills that match
export async function checkIfExists(
  bills: Bill[]
): Promise<[Bill[], Set<number>]> {
  const bill_IDs = bills.map((bill) => bill.bill_id);
  try {
    const existingBills =
      await sql`SELECT * FROM bills WHERE bill_id = ANY(${bill_IDs})`;

    // Stores existing bill ID's in a set for lookup operations
    const billSet = new Set(existingBills.map((bill) => bill.bill_id));
    return [existingBills as Bill[], billSet];
  } catch (error) {
    console.error("error checking across db", error);
  }
  return [[], new Set()];
}

// called if user adjusts search terms
export async function handleNewQuery(bills: Bill[]): Promise<Bill[]> {
  try {
    const [existingBills, billSet] = await checkIfExists(bills);

    // if bill does not exist in db, add it to returning array
    // UI will have the option to add specific bill to db if desired
    for (const bill of bills) {
      if (!billSet.has(bill.bill_id)) {
        existingBills.push(bill);
      }
    }

    return existingBills;
  } catch (error) {
    console.error("error checking across db", error);
  }
  return [];
}
