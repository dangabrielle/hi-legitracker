import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bill } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryTerms = [
  "UHERO",
  "economic research organization",
  "task force",
  "working group",
];

export function sortBillsByRelevance(results: Bill[]): Bill[] {
  const billsByRelevance = results.sort((a, b) => b.relevance - a.relevance);
  window.scrollTo({ top: 0 });
  return billsByRelevance;
}

export function sortBillsByID(results: Bill[]): Bill[] {
  const billsByBillNum = results.sort((a, b) => a.bill_id - b.bill_id);
  window.scrollTo({ top: 0 });
  return billsByBillNum;
}

export function sortBillsByDate(results: Bill[]): Bill[] {
  const billsByLatest = results.sort(
    (a, b) =>
      new Date(b.last_action_date).getTime() -
      new Date(a.last_action_date).getTime()
  );
  window.scrollTo({ top: 0 });
  return billsByLatest;
}

export function handleBillQuery(
  results: Bill[],
  e: React.ChangeEvent<HTMLInputElement>
): Bill[] {
  const filteredBills = results.filter((bill: Bill) => {
    return Object.values(bill).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(e.target.value.toLowerCase())
    );
  });
  // window.scrollTo({ top: 0 });
  return filteredBills;
}

export const handleQueryString = (searchTerms: string[]) => {
  let queryString = "";
  searchTerms.forEach((item, idx) => {
    const formattedQuery = item.replaceAll(" ", "+");
    if (idx !== searchTerms.length - 1) {
      queryString += `"${formattedQuery}"+OR+`;
    } else {
      queryString += `"${formattedQuery}"`;
    }
  });
  return queryString;
};
