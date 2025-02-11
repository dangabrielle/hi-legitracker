/* eslint-disable */
"use client";
import React, { ChangeEvent, useState } from "react";
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
};

// type BillQuery = {
//   [key: string]: BillType;
// };

const BillResults = ({ results }: any) => {
  const [billArrangement, setBillArrangement] = useState(results);
  const [currentBtnView, setCurrentBtnView] = useState("");

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
    console.log(billsByBillNum);
    window.scrollTo({ top: 0 });
    setCurrentBtnView("billID");
    setBillArrangement(billsByBillNum);
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredBills = results.filter((bill: BillType) =>
      bill?.title?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    window.scrollTo({ top: 0 });
    setBillArrangement(filteredBills);
  };

  return (
    <div className="min-h-screen flex flex-col md:m-10">
      <header className="w-full gap-y-5 flex flex-col items-center justify-center">
        <Image
          src={"/UHEROLogo-Color_HighRes.png"}
          height={250}
          width={250}
          alt="logo"
        />
        <h1 className="md:text-3xl text-xl mb-5 font-bold">
          Hawaii Legislation Bill Tracker
        </h1>
      </header>
      <div className="w-full z-10 pt-7 pb-5 from-white via-white to-white/90  bg-gradient-to-b sticky top-0  flex flex-col items-center justify-center space-x-5">
        <div className="flex w-full h-fit justify-center gap-x-5">
          <Button
            className={cn(
              currentBtnView === "date" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortbydate(results)}
          >
            View latest
          </Button>
          <Button
            className={cn(
              currentBtnView === "relevance" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortByRelevance(results)}
          >
            View by Relevance
          </Button>
          <Button
            className={cn(
              currentBtnView === "billID" ? "bg-slate-100" : "bg-white"
            )}
            variant="outline"
            onClick={() => sortByBillNum(results)}
          >
            View by Bill ID
          </Button>
        </div>
        <div className="w-full max-w-xl md:w-1/2 px-10 pt-5">
          <Label className="pl-1 text-gray-500 font-semibold" htmlFor="search">
            Search by title:
          </Label>
          <Input
            type="search"
            onChange={(e) => handleQuery(e)}
            placeholder="Search"
          />
        </div>
      </div>
      {/* <h1>results: {Object.keys(bill).length - 1}</h1> */}
      <main className="relative  w-full pb-10 flex flex-col lg:grid lg:grid-cols-3  ">
        {billArrangement.map((val: BillType, idx: number) => (
          <div
            key={idx}
            className="hover:scale-105 transition-transform ease-in-out delay-100 bg-slate-100 text-xs md:text-sm gap-y-3 rounded-lg items-start justify-start text-left p-5 flex flex-col m-3 "
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
              {val.last_action_date.toLocaleString()}
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
          </div>
        ))}
      </main>
    </div>
  );
};

export default BillResults;
