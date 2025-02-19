/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  handleLegiscanData,
  getData,
  checkIfExists,
  handleNewQuery,
} from "./server-actions";
import {
  sortBillsByRelevance,
  sortBillsByID,
  sortBillsByDate,
  handleBillQuery,
} from "@/lib/utils";

import { BillType, UpdatedBillFields, NewBill } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BillResults = ({
  results,
  newBills,
  updatedBills,
}: {
  results: BillType[];
  newBills: NewBill[];
  updatedBills: UpdatedBillFields[];
}) => {
  const terms = [
    "UHERO",
    "economic research organization",
    "task force",
    "working group",
  ];
  const [billArrangement, setBillArrangement] = useState<BillType[]>(results);
  const [currentBtnView, setCurrentBtnView] = useState("");
  const [searchTerms, setSearchTerms] = useState(terms);
  const [isMinus, setIsMinus] = useState<{ [key: string]: boolean }>({});
  const [billsPerPage, setBillsPerPage] = useState<BillType[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(billArrangement.length / itemsPerPage)
  );

  const fetchBills = async (newSearchTerms: string[]) => {
    console.log(searchTerms);
    const queryString = handleNewQueryString(newSearchTerms);
    console.log(queryString);
    if (newSearchTerms.length === 1) return;
    if (newSearchTerms.length === terms.length) {
      const db_data = await getData();
      setBillArrangement(db_data as BillType[]);
    } else if (newSearchTerms.length > 1) {
      const api_data = await handleLegiscanData(queryString);
      const checkedBills = await crossCheckBills(api_data as BillType[]);

      setBillArrangement(checkedBills as BillType[]);
      // crossCheckBills(api_data as BillType[]);
    }
  };

  const crossCheckBills = async (bills: BillType[]) => {
    let billResults = [];
    for (const bill of bills) {
      const result = await handleNewQuery(bill);
      billResults.push(result);
    }
    // const newBills = bills.map(async (bill) => {
    //   return result;
    // });
    return billResults;
  };

  const handleNewQueryString = (searchTerms: string[]) => {
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

  useEffect(() => {
    setTotalPages(Math.ceil(billArrangement.length / itemsPerPage));
    const startIdx = (page - 1) * itemsPerPage;
    const currentBills = billArrangement.slice(
      startIdx,
      startIdx + itemsPerPage
    );
    setBillsPerPage(currentBills);
    window.scrollTo({ top: 0 });
  }, [page, currentBtnView, itemsPerPage, billArrangement]);

  const sortbydate = (results: BillType[]) => {
    const billsByLatest = sortBillsByDate(results);
    setBillArrangement(billsByLatest);
    setCurrentBtnView("date");
    setPage(1);
  };

  const sortByRelevance = (results: BillType[]) => {
    const billsByRelevance = sortBillsByRelevance(results);
    setCurrentBtnView("relevance");
    setBillArrangement(billsByRelevance);
    setPage(1);
  };

  const sortByBillNum = (results: BillType[]) => {
    const billsByBillNum = sortBillsByID(results);
    setCurrentBtnView("billID");
    setBillArrangement(billsByBillNum);
    setPage(1);
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredBills = handleBillQuery(results, e);
    window.scrollTo({ top: 0 });
    setBillArrangement(filteredBills);
    setPage(1);
  };

  const handleSearch = async (term: string) => {
    console.log(term);
    if (searchTerms.includes(term)) {
      const newTerms = searchTerms.filter((originalTerm) => {
        return term !== originalTerm;
      });
      console.log(newTerms);
      await fetchBills(newTerms);
      setSearchTerms(newTerms);
    } else {
      searchTerms.push(term);
      console.log(searchTerms);
      await fetchBills(searchTerms);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="z-10 pt-4 pb-1  w-screen text-xs from-white via-white to-white/90  bg-gradient-to-b sticky top-0 flex flex-col items-center justify-center space-x-5">
        <div className="grid grid-cols-[1fr,2fr,1fr] md:grid-cols-3 p-5 h-fit w-screen md:w-fit justify-center gap-x-3 ">
          <Button
            className={cn(
              "text-xs md:text-sm shrink",
              currentBtnView === "date" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortbydate(billArrangement)}
          >
            View latest
          </Button>
          <Button
            className={cn(
              "text-xs md:text-sm grow",
              currentBtnView === "relevance" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortByRelevance(billArrangement)}
          >
            View by Relevance
          </Button>
          <Button
            className={cn(
              "text-xs md:text-sm shrink",
              currentBtnView === "billID" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortByBillNum(billArrangement)}
          >
            View by Bill ID
          </Button>
        </div>
        <div className="w-full max-w-xl md:w-1/2 px-10 md:pt-2">
          <Label
            className="pl-1 text-gray-500 font-semibold text-xs md:text-sm"
            htmlFor="search"
          >
            Search bills:
          </Label>
          <Input
            className=" text-xs md:text-sm"
            type="search"
            onChange={(e) => handleQuery(e)}
            placeholder="Search "
          />
        </div>
      </div>
      <div className="w-full items-center justify-center flex flex-col gap-y-2 px-3 py-1 mt-5">
        <p className="font-bold text-gray-500 text-xs md:text-sm">
          Current search terms:
        </p>
        <div className="md:flex-row md:flex grid grid-cols-[1fr,auto] gap-y-2 md:gap-y-0 gap-x-3">
          {terms.map((term, idx) => (
            <div
              className={cn(
                isMinus[term]
                  ? "bg-slate-100/50 text-gray-600/50"
                  : "opacity-100 bg-slate-100 text-gray-600",
                "px-2  text-xs py-1 w-fit rounded-lg flex items-center"
              )}
              key={idx}
            >
              <button
                onClick={async () => {
                  handleSearch(term);

                  {
                    setIsMinus((prev) => ({
                      ...prev,
                      [term]: !prev[term],
                    }));
                  }
                }}
                className={cn(
                  isMinus[term] ? "font-normal" : "font-semibold",
                  searchTerms.length === 1 && !isMinus[term]
                    ? "pointer-events-none"
                    : "pointer-events-auto",
                  "pr-2 text-xs left-0  text-gray-500 py-0 hover:scale-105"
                )}
              >
                {isMinus[term] ? "+" : "x"}
              </button>
              {term}
            </div>
          ))}
        </div>
      </div>
      <div className="w-fit max-w-md min-w-60 md:min-w-96 md:max-w-xl flex flex-col p-3 mt-5 gap-y-1  rounded-lg bg-slate-100">
        <h1 className="text-gray-500 text-xs md:text-sm left-0">
          <span className="font-semibold">Results: </span>
          {billArrangement.length}
        </h1>
        <div className="text-gray-500 text-xs md:text-sm left-0 w-full flex flex-wrap items-center gap-x-1">
          <span className="font-semibold">
            New Bills {newBills.length > 0 ? `(${newBills.length}) ` : ""}
          </span>

          {newBills.length > 0
            ? newBills.map((newBill) => (
                <Link
                  className=" hover:font-bold mx-1 text-xs md:text-sm rounded-md"
                  key={newBill[0]}
                  href={`${newBill[1]}`}
                  target="_blank"
                >
                  {newBill[0]}{" "}
                </Link>
              ))
            : "N/A"}
        </div>
        <div className="text-gray-500 text-xs md:text-sm left-0 w-full flex flex-wrap items-center gap-x-1">
          <span className="font-semibold">
            Updated Bills{" "}
            {updatedBills.length > 0 ? ` (${updatedBills.length}) ` : ""}
          </span>

          {updatedBills.length > 0
            ? updatedBills.map((updatedBill) => (
                <Link
                  className="hover:bg-white px-1 py-0 text-xs md:text-sm rounded-md"
                  key={updatedBill.bill_id}
                  href={`${updatedBill.url}`}
                  target="_blank"
                >
                  {updatedBill.bill_number}
                </Link>
              ))
            : "N/A"}
        </div>
      </div>
      <main className="relative p-5 w-full md:max-w-screen-lg pb-10 flex flex-col items-start md:items-stretch md:grid md:grid-cols-2 md:gap-x-5">
        {billsPerPage.map((val: BillType, idx: number) => (
          <div
            key={idx}
            className="text-xs md:text-sm gap-y-3 rounded-lg w-full items-start md:border justify-start text-left p-5 flex flex-col m-3 "
          >
            <div className="flex w-full space-x-5 justify-between">
              <h1 className="font-bold">{val.title}</h1>
              <div className="right-0 top-0 flex gap-x-1">
                <Button variant="outline">
                  <Link
                    href={`${val.text_url}`}
                    className="font-bold text-xs text-cyan-900 rounded-lg"
                    target="_blank"
                  >
                    View bill
                  </Link>
                </Button>
                <Button variant="outline">
                  <Link
                    className="font-bold text-xs text-cyan-900  rounded-lg"
                    href={`${val.research_url}`}
                    target="_blank"
                  >
                    Info
                  </Link>
                </Button>
              </div>
            </div>
            <p>
              <span className="font-bold text-gray-500">Relevance: </span>
              {val.relevance}
            </p>
            <p>
              <span className="font-bold text-gray-500">Last action date:</span>{" "}
              {val.last_action_date}
            </p>
            <p>
              <span className="font-bold text-gray-500">Bill Number: </span>
              {val.bill_number}
            </p>
            <p>
              <span className="font-bold text-gray-500">Bill ID: </span>{" "}
              {val.bill_id}
            </p>

            <p>
              <span className="font-bold text-gray-500">Last action:</span>{" "}
              {val.last_action}
            </p>
            <p>
              <span className="font-bold text-gray-500">
                {val.created_at ? "Created at:" : ""}
              </span>{" "}
              {val.created_at ? (
                val.created_at.toLocaleString("en-US", {
                  timeZone: "Pacific/Honolulu",
                })
              ) : (
                <button>add to db</button>
              )}
            </p>
            <p>
              <span className="font-bold text-gray-500">
                {val.last_updated ? "Last updated:" : ""}
              </span>{" "}
              {val.last_updated &&
                val.last_updated.toLocaleString("en-US", {
                  timeZone: "Pacific/Honolulu",
                })}
            </p>
          </div>
        ))}
      </main>
      <footer className="sticky bg-gradient-to-t from-white to-0% rounded-lg justify-center md:pl-5 bg-white py-2 bottom-0  gap-y-4 items-center w-full md:w-fit flex flex-col md:grid  md:grid-cols-[1fr,2fr] max-w-xl md:gap-x-3">
        <div className="flex items-center gap-x-3 justify-center shrink">
          <Label className="text-xs md:text-sm text-gray-600">
            Bills per page
          </Label>
          <Select
            onValueChange={(e) => {
              setItemsPerPage(Number(e));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-fit px-3 text-xs ">
              <SelectValue className="" placeholder="24" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="24">
                24
              </SelectItem>
              <SelectItem value="50">50 </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination className="grow">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  "cursor-pointer text-xs md:text-sm",
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "pointer-events-auto opacity-100"
                )}
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>
            <PaginationItem className={cn(page === 1 ? "hidden" : "")}>
              <PaginationLink
                className="text-xs md:text-sm"
                onClick={() => setPage(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              className={cn(
                "text-xs md:text-sm",
                page === 1 ? "hidden" : "block"
              )}
            >
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className="border text-xs md:text-sm">
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis
                className={cn(
                  "text-xs md:text-sm",
                  page === totalPages ? "hidden" : ""
                )}
              />
            </PaginationItem>
            <PaginationItem
              className={cn(page === totalPages ? "hidden" : "block")}
            >
              <PaginationLink
                className="text-xs md:text-sm"
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={cn(
                  "cursor-pointer text-xs md:text-sm",
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "pointer-events-auto opacity-100"
                )}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </div>
  );
};

export default BillResults;
