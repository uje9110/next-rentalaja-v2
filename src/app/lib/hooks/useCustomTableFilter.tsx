"use client";
import { useUpdateSearchParam } from "@/app/(root)/hooks/useUpdateSearchParam";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomTableFilterProps } from "../components/CustomTableFilters";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, FilterX } from "lucide-react";
import { DateTimePicker } from "../components/DateTimePicker";
import moment from "moment-timezone";
import { usePathname, useRouter } from "next/navigation";

export function useCustomTableFilter({
  defaultFilters,
}: {
  defaultFilters: Record<string, string | Date>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<
    Record<string, string | Date | undefined>
  >(() => {
    if (typeof window === "undefined") return {};
    // Load existing URL params
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string | Date> = {};
    params.forEach((value, key) => {
      const decoded = decodeURIComponent(value);
      obj[key] = decoded;
    });

    // Merge defaults → query params override defaults
    return { ...defaultFilters, ...obj };
  });

  const updateQuery = useCallback(
    (queryObj: Record<string, string | Date | undefined>) => {
      const str = Object.entries(queryObj)
        .filter(([_, value]) => value != null && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&");

      const newUrl = `${pathname}?${str}`;
      const current = window.location.search
        ? `${pathname}${window.location.search}`
        : pathname;

      // Avoid redundant navigation
      if (newUrl === current) return;

      router.replace(newUrl, { scroll: false });
    },
    [filters, pathname, router],
  );

  useEffect(() => {
    updateQuery(filters);
  }, [filters, updateQuery]);

  const resetFilter = () => {
    setFilters({});
  };

  const filterBuilderHelper = (
    filter: CustomTableFilterProps,
    classname: string,
  ) => {
    switch (filter.filterType) {
      case "reset":
        return (
          <button
            key={filter.filterName}
            className="flex w-10 cursor-pointer items-center justify-center rounded-md bg-red-500 text-white"
            onClick={() => {
              resetFilter();
            }}
          >
            <FilterX />
          </button>
        );
      case "search":
        return (
          <div
            key={filter.filterTitle}
            className={`flex h-9 flex-row items-center justify-center gap-2 rounded-md border border-slate-400/50 pl-3 shadow ${classname}`}
          >
            <filter.filterIcon size={16} />
            <Input
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [filter.filterName]: e.target.value,
                }))
              }
              value={filters.search ? (filters.search as string) : ""}
              placeholder={filter.filterTitle}
              className="border-none px-1 text-xs shadow-none placeholder:text-xs focus-visible:ring-0"
            />
          </div>
        );
      case "select":
        return (
          <Select
            key={filter.filterTitle}
            value={
              filters[filter.filterName]
                ? (filters[filter.filterName] as string)
                : ""
            }
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                [filter.filterName]: value,
              }))
            }
          >
            <SelectTrigger
              className={`flex w-fit gap-2 border text-xs shadow ${classname}`}
            >
              <filter.filterIcon size={16} strokeWidth={1} />
              <SelectValue placeholder={filter.filterTitle} />
            </SelectTrigger>
            <SelectContent>
              {filter.filterValues.map((value) => (
                <SelectItem
                  key={value.label}
                  value={value.value}
                  className="text-xs"
                >
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "dateTimePicker":
        return (
          <Popover key={filter.filterTitle}>
            <PopoverTrigger asChild className={classname ? classname : `w-fit`}>
              <button
                className={`flex h-9 flex-row items-center justify-between gap-1 rounded-md border-[1px] border-slate-400/50 px-3 shadow`}
              >
                <CalendarIcon size={16} strokeWidth={1} />
                <span className="text-xs">
                  {filters.dateStart ? (
                    filters.dateEnd ? (
                      <>
                        {moment(filters.dateStart)
                          .tz("Asia/Jakarta")
                          .format("DD MMM YYYY")}{" "}
                        -{" "}
                        {moment(filters.dateEnd)
                          .tz("Asia/Jakarta")
                          .format("DD MMM YYYY")}
                      </>
                    ) : (
                      moment(filters.dateStart)
                        .tz("Asia/Jakarta")
                        .format("DD MMM YYYY")
                    )
                  ) : (
                    <span>Pilih Tanggal</span>
                  )}
                </span>
                <ChevronDown size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex flex-col gap-2 p-2">
                <DateTimePicker
                  name="dateStart"
                  date={filters.dateStart as Date}
                  setDate={setFilters}
                  textSize="text-xs md:text-xs"
                />
                <DateTimePicker
                  name="dateEnd"
                  date={filters.dateEnd as Date}
                  setDate={setFilters}
                  textSize="text-xs md:text-xs"
                />
              </div>
            </PopoverContent>
          </Popover>
        );
    }
  };

  return { filterBuilderHelper };
}
