import BillTracker from "./bill-tracker";
import {
  getData,
  handleBill,
  handleLegiscanData,
  createMessage,
} from "./server-actions";
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

  if (newBills.length > 0 || updatedBills.length > 0) {
    let message = `Updates as of ${new Date().toDateString()}:\n\n`;
    if (updatedBills.length > 0) {
      updatedBills.forEach((bill) => {
        const { title, bill_number, url } = bill;
        message += `${title} (${bill_number}): ${url}\n\n`;
      });
    }

    if (newBills.length > 0) {
      message += "New Bills:\n";
      newBills.forEach((bill) => {
        const [bill_number, url, title] = bill;
        message += `${title} (${bill_number}): ${url}\n\n`;
      });
    }
    await createMessage(message);
  }
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
