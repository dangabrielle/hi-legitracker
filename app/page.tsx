import BillTracker from "./bill-tracker";
import { getData, handleBill, handleLegiscanData } from "./server-actions";
import { UpdatedBillFields, NewBill } from "@/lib/types";
import { queryTerms, handleQueryString } from "@/lib/utils";

export default async function Home() {
  const newBills: NewBill[] = [];
  const updatedBills: UpdatedBillFields[] = [];

  const queryString = handleQueryString(queryTerms);
  const billsArray = await handleLegiscanData(queryString);
  if (billsArray) {
    await handleBill(billsArray, newBills, updatedBills);
  }

  const dbBills = await getData();

  console.log(newBills);
  console.log(updatedBills);

  return (
    <BillTracker
      dbBills={dbBills}
      newBills={newBills}
      updatedBills={updatedBills}
    />
  );
}
