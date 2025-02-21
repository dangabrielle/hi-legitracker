import React from "react";
import { cn } from "@/lib/utils";
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
import { Label } from "@/components/ui/label";

type PaginationFooter = {
  page: number;
  totalPages: number;
  handleBillsPerPage: (e: string) => void;
  handlePageSelection: (page: number, action: string) => void;
};

const PaginationFooter = ({
  page,
  totalPages,
  handleBillsPerPage,
  handlePageSelection,
}: PaginationFooter) => {
  return (
    <>
      <div className="flex items-center gap-x-3 justify-center shrink">
        <Label className="text-xs md:text-sm text-gray-600">
          Bills per page
        </Label>
        <Select onValueChange={(e) => handleBillsPerPage(e)}>
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
                handlePageSelection(1, "prev");
              }}
            />
          </PaginationItem>
          <PaginationItem className={cn(page === 1 ? "hidden" : "")}>
            <PaginationLink
              className="text-xs md:text-sm"
              onClick={() => handlePageSelection(1, "start")}
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
              onClick={() => handlePageSelection(totalPages, "end")}
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
              onClick={() => handlePageSelection(totalPages, "next")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default PaginationFooter;
