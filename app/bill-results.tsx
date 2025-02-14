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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  last_updated?: Date;
};

type UpdatedBillFields = {
  bill_id: number;
  bill_number: string;
  relevance?: string;
  state?: string;
  change_hash: string;
  url?: string;
  text_url?: string;
  research_url?: string;
  last_action_date?: string;
  last_action?: string;
  title?: string;
};

type NewBill = [bill_number: string, url: string];

const BillResults = ({
  totalPages,
  results,
  newBills,
  updatedBills,
}: {
  totalPages: number;
  results: BillType[];
  newBills: NewBill[];
  updatedBills: UpdatedBillFields[];
}) => {
  const [billArrangement, setBillArrangement] = useState<BillType[]>([]);
  const [currentBtnView, setCurrentBtnView] = useState("");
  const [searchTerms, setSearchTerms] = useState([
    "UHERO",
    "economic research organization",
    "task force",
    "working group",
  ]);

  const [page, setPage] = useState(1);

  // useEffect(() => {
  //   const billChanges = updatedBills.map((bill, idx) => {
  //     Object.keys(bill).forEach((val) => {
  //       if (bill[val] === "") {
  //         delete bill[val];
  //       }
  //     });
  //   });
  //   console.log("bill changes " + billChanges);
  // }, []);

  useEffect(() => {
    const startIdx = (page - 1) * 25;
    const currentBills = results.slice(startIdx, startIdx + 25);
    setBillArrangement(currentBills);
  }, [page]);

  const sortbydate = (results: BillType[]) => {
    const billsByLatest = results.sort(
      (a, b) =>
        new Date(b.last_action_date).getTime() -
        new Date(a.last_action_date).getTime()
    );
    window.scrollTo({ top: 0 });
    setBillArrangement(billsByLatest);
    setCurrentBtnView("date");
  };

  const sortByRelevance = (results: BillType[]) => {
    const billsByRelevance = results.sort((a, b) => b.relevance - a.relevance);
    window.scrollTo({ top: 0 });
    setCurrentBtnView("relevance");
    setBillArrangement(billsByRelevance);
  };

  const sortByBillNum = (results: BillType[]) => {
    const billsByBillNum = results.sort((a, b) => a.bill_id - b.bill_id);

    window.scrollTo({ top: 0 });
    setCurrentBtnView("billID");
    setBillArrangement(billsByBillNum);
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredBills = results.filter((bill: BillType) => {
      return Object.values(bill).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    window.scrollTo({ top: 0 });
    setBillArrangement(filteredBills);
  };

  const handleSearch = (term: string) => {
    if (searchTerms.length == 1) return;
    console.log(term);
    const newTerms = searchTerms.filter((originalTerm) => {
      return term !== originalTerm;
    });
    console.log(newTerms);
    setSearchTerms(newTerms);
  };

  return (
    <div className="min-h-screen  mt-5 flex flex-col items-center justify-center md:m-10">
      <header className="gap-y-5 flex flex-col items-center justify-center">
        <Image
          src={"/UHEROLogo-Color_HighRes.png"}
          height={250}
          width={250}
          alt="logo"
        />
        <h1 className="md:text-3xl text-xl font-bold">
          Hawaii Legislation Bill Tracker
        </h1>
      </header>
      <div className="z-10 pt-4 pb-1  w-screen text-xs from-white via-white to-white/90  bg-gradient-to-b sticky top-0 flex flex-col items-center justify-center space-x-5">
        <div className="grid grid-cols-[1fr,2fr,1fr] md:grid-cols-3 p-5 h-fit w-screen md:w-fit justify-center gap-x-3 ">
          <Button
            className={cn(
              "text-xs md:text-sm shrink",
              currentBtnView === "date" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortbydate(results)}
          >
            View latest
          </Button>
          <Button
            className={cn(
              "text-xs md:text-sm grow",
              currentBtnView === "relevance" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortByRelevance(results)}
          >
            View by Relevance
          </Button>
          <Button
            className={cn(
              "text-xs md:text-sm shrink",
              currentBtnView === "billID" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortByBillNum(results)}
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
          Currently searched terms:
        </p>
        <div className="md:flex-row md:flex grid grid-cols-[1fr,auto] gap-y-2 md:gap-y-0 gap-x-3">
          {searchTerms.map((term, idx) => (
            <div
              className="px-2 text-gray-600 text-xs py-1 w-fit bg-slate-100 rounded-lg flex items-center"
              key={idx}
            >
              <button
                onClick={() => handleSearch(term)}
                className="pr-2 text-xs left-0 font-semibold text-gray-600 py-0 hover:scale-105"
              >
                x
              </button>
              {term}
            </div>
          ))}
        </div>
      </div>
      <div className="w-fit max-w-md md:min-w-96 md:max-w-xl flex flex-col p-3 mt-5 gap-y-1  rounded-lg bg-slate-100">
        <h1 className="text-gray-500 text-xs md:text-sm left-0">
          <span className="font-semibold">Results: </span>
          {results.length}
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
        {billArrangement.map((val: BillType, idx: number) => (
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
              <span className="font-bold text-gray-500">Created at:</span>{" "}
              {val.created_at.toLocaleString("en-US", {
                timeZone: "Pacific/Honolulu",
              })}
            </p>
            <p>
              <span className="font-bold text-gray-500">Last updated:</span>{" "}
              {val.last_updated
                ? val.last_updated.toLocaleString("en-US", {})
                : val.created_at.toLocaleString("en-US", {})}
            </p>
          </div>
        ))}
      </main>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                page === 1
                  ? "pointer-events-none opacity-50"
                  : "pointer-events-auto opacity-100"
              )}
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
                console.log("clicked");
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => setPage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={cn(
                page === totalPages
                  ? "pointer-events-none opacity-50"
                  : "pointer-events-auto opacity-100"
              )}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BillResults;
