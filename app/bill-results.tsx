"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const BillResults = ({ results }) => {
  const [billArrangement, setBillArrangement] = useState(results);

  const sortbydate = (results) => {
    const testing = Object.values(results).sort(
      (a, b) => new Date(b.last_action_date) - new Date(a.last_action_date)
    );
    console.log(testing);
    setBillArrangement(testing);
  };

  return (
    <div>
      <div className="h-screen md:m-20">
        <h1>Hawaii Legislation Tracker</h1>
        <h1>Economics Results</h1>
        <button onClick={() => sortbydate(results)}>sort</button>
        {/* <h1>results: {Object.keys(bill).length - 1}</h1> */}
        <main className="size-full flex flex-col lg:grid lg:grid-cols-3  ">
          {Object.entries(billArrangement).map(
            ([key, val]) =>
              key !== "summary" && (
                <div
                  key={key}
                  className=" bg-slate-100 text-xs md:text-sm gap-y-3 rounded-lg items-start justify-start text-left p-5 flex flex-col m-3 "
                >
                  <h1 className="font-bold">{val.title}</h1>
                  <p>Last action date: {val.last_action_date}</p>
                  <p>Bill Number: {val.bill_number}</p>
                  <p>Bill ID: {val.bill_id}</p>
                  <Link href={`${val.text_url}`}>View bill</Link>
                  <Link href={`${val.research_url}`}>View research URL</Link>
                  <p>Last action: {val.last_action}</p>
                </div>
              )
          )}
        </main>
      </div>
    </div>
  );
};

export default BillResults;
