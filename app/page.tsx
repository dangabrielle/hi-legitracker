import Link from "next/link";
const legiscanKey = process.env.LEGISCAN_KEY;

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

type BillQuery = {
  [key: string]: BillType;
};

export default async function Home() {
  const data = await fetch(
    `https://api.legiscan.com/?key=${legiscanKey}&op=getSearch&state=HI&query=UHERO&quer=economic%20research%20organization&query=task%20force`
  );
  const results = await data.json();
  const bill: BillQuery = results.searchresult;

  return (
    <>
      <div className="h-screen md:m-20">
        <h1>Hawaii Legislation Tracker</h1>
        <h1>Economics Results</h1>
        <h1>results: {Object.keys(bill).length - 1}</h1>
        <main className="size-full flex flex-col lg:grid lg:grid-cols-3  ">
          {Object.entries(bill).map(
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
    </>
  );
}
