import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BillType } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortBillsByRelevance(results: BillType[]): BillType[] {
  const billsByRelevance = results.sort((a, b) => b.relevance - a.relevance);
  window.scrollTo({ top: 0 });
  return billsByRelevance;
}

export function sortBillsByID(results: BillType[]): BillType[] {
  const billsByBillNum = results.sort((a, b) => a.bill_id - b.bill_id);
  window.scrollTo({ top: 0 });
  return billsByBillNum;
}

export function sortBillsByDate(results: BillType[]): BillType[] {
  const billsByLatest = results.sort(
    (a, b) =>
      new Date(b.last_action_date).getTime() -
      new Date(a.last_action_date).getTime()
  );
  window.scrollTo({ top: 0 });
  return billsByLatest;
}

export function handleBillQuery(
  results: BillType[],
  e: React.ChangeEvent<HTMLInputElement>
): BillType[] {
  const filteredBills = results.filter((bill: BillType) => {
    return Object.values(bill).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(e.target.value.toLowerCase())
    );
  });
  window.scrollTo({ top: 0 });
  return filteredBills;
}
