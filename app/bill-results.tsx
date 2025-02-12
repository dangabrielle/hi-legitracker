/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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
  url?: string;
  text_url?: string;
  research_url?: string;
  last_action_date?: string;
  last_action?: string;
  title?: string;
};

type NewBill = [bill_number: string, url: string];

const BillResults = ({
  results,
  newBills,
  updatedBills,
}: {
  results: BillType[];
  newBills: NewBill[];
  updatedBills: UpdatedBillFields[];
}) => {
  const [billArrangement, setBillArrangement] = useState(results);
  const [currentBtnView, setCurrentBtnView] = useState("");

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

  return (
    <div className="min-h-screen w-screen mt-5 flex flex-col items-center justify-center md:m-10">
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
      <div className="z-10 md:pt-7 md:pb-5 w-screen text-xs from-white via-white to-white/90  bg-gradient-to-b sticky top-0  flex flex-col items-center justify-center space-x-5">
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
      <div className="w-3/4 max-w-md flex flex-col px-3 py-1 mt-5 md:mt-0 rounded-lg bg-slate-100">
        <h1 className="text-gray-500 text-xs md:text-sm left-0">
          <span className="font-semibold">Results: </span>
          {results.length}
        </h1>
        <h1 className="text-gray-500 text-xs md:text-sm left-0">
          <span className="font-semibold">New Bills: </span>
          {newBills.length > 0
            ? newBills.map((val) => (
                <Link key={val[0]} href={`${val[1]}`}>
                  {val[0]}
                </Link>
              ))
            : "N/A"}
        </h1>
        <h1 className="text-gray-500 text-xs md:text-sm left-0">
          <span className="font-semibold">Updated Bills: </span>
          {updatedBills.length > 0
            ? updatedBills.map((val, idx) => (
                <>
                  <Link key={idx} href={`${val.url}`}>
                    {val.bill_number}
                  </Link>
                </>
              ))
            : "N/A"}
        </h1>
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
              <span className="font-bold text-gray-500">Last saved:</span>{" "}
              {val.created_at.toLocaleString()}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default BillResults;
