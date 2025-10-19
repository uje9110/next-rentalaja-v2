"use client";
import { Eye, Filter, FilterX, LucideIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Table } from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCustomTableFilter } from "../hooks/useCustomTableFilter";
import { usePathname, useRouter } from "next/navigation";

// Shared
interface BaseFilterProps {
  filterName: string;
  filterTitle: string;
  filterIcon: LucideIcon;
  defaultValue?: string | Record<string, string>;
}

// Specific filters
interface SearchFilter extends BaseFilterProps {
  filterType: "search";
}

interface SelectFilter extends BaseFilterProps {
  filterType: "select";
  filterValues: {
    label: string;
    value: string;
  }[];
}

interface dateTimePickerFilter extends BaseFilterProps {
  filterType: "dateTimePicker";
  dateFilterValues?: DateRange;
}
interface resetFilter extends BaseFilterProps {
  filterType: "reset";
}

// Final union
export type CustomTableFilterProps =
  | resetFilter
  | SearchFilter
  | SelectFilter
  | dateTimePickerFilter;

export const CustomTableFilter = <TData,>({
  filterData,
  pageTitle,
  table,
}: {
  filterData: CustomTableFilterProps[];
  pageTitle: string;
  table?: Table<TData>;
}) => {
  const { filterBuilderHelper } = useCustomTableFilter(filterData);

  return (
    <div className="flex w-full flex-row justify-between">
      <div>
        {/* Mobile version */}
        <div className="flex gap-2 sm:hidden">
          <Sheet>
            <SheetTrigger>
              <p className="ml-auto flex gap-2 rounded-md border border-slate-400/50 p-2 text-xs text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-600">
                <Filter size={16} />
                Buka Filter
              </p>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-start">
                  Filter {pageTitle}
                </SheetTitle>
                <SheetDescription className="text-start">
                  Gunakan filter untuk mencari order dengan ketentuan tertentu
                </SheetDescription>
                <div className="flex flex-col gap-2">
                  {filterData.map((filter) =>
                    filterBuilderHelper(filter, "w-[240px]"),
                  )}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop version */}
        <div className="hidden flex-row justify-start gap-2 sm:flex lg:flex-row">
          {filterData.map((filter) => filterBuilderHelper(filter, ""))}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto border border-slate-400/50 text-xs text-slate-500 shadow hover:bg-slate-100 hover:text-slate-600"
          >
            <Eye />
            Kolom
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table &&
            table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    <span className="text-xs capitalize">{column.id}</span>
                  </DropdownMenuCheckboxItem>
                );
              })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
