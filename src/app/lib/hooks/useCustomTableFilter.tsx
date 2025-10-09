import { useUpdateSearchParam } from "@/app/(root)/hooks/useUpdateSearchParam";
import { useEffect, useState } from "react";
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
import { CalendarIcon, ChevronDown } from "lucide-react";
import { DateTimePicker } from "../components/DateTimePicker";
import moment from "moment";

export function useCustomTableFilter(filterData: CustomTableFilterProps[]) {
  const { searchParams, updateSearchParam, updateSearchParams } =
    useUpdateSearchParam();

  const [filters, setFilters] = useState<Record<string, string | Date>>({});
  // console.log(filters);

  const [dateStart, setDateStart] = useState<Date | undefined>(() => {
    const dateString = searchParams.get("dateStart");
    if (dateString) {
      return new Date(dateString);
    }
    return undefined;
  });

  const [dateEnd, setDateEnd] = useState<Date | undefined>(() => {
    const dateString = searchParams.get("dateEnd");
    if (dateString) {
      return new Date(dateString);
    }
    return undefined;
  });

  useEffect(() => {
    const defaultFilter: Record<string, string | Date> = {};
    filterData.forEach((filter) => {
      if (filter.defaultValue) {
        if (filter.filterName === "dateRange") {
          Object.entries(filter.defaultValue as object).forEach(
            ([key, value]) => {
              defaultFilter[key] = new Date(value);
            },
          );
        } else {
          defaultFilter[filter.filterName] = filter.defaultValue as string;
        }
      }
    });
    setFilters(defaultFilter);
  }, [filterData]);

  // Initialize from searchParams on first mount
  useEffect(() => {
    const startString = searchParams.get("dateStart");
    const endString = searchParams.get("dateEnd");

    if (startString) {
      setDateStart(new Date(startString));
    }
    if (endString) {
      setDateEnd(new Date(endString));
    }
  }, [searchParams]);

  // 🟢 Safe useEffect for filters
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      updateSearchParams(filters);
    }
  }, [filters, updateSearchParams]);

  // // 🟢 Date effects
  useEffect(() => {
    if (dateStart) {
      const isoStart = moment(dateStart).format("YYYY-MM-DDTHH:mm:ss");
      updateSearchParam("dateStart", isoStart);
    }
  }, [dateStart, updateSearchParam]);

  useEffect(() => {
    if (dateEnd) {
      const isoEnd = moment(dateEnd).format("YYYY-MM-DDTHH:mm:ss");
      updateSearchParam("dateEnd", isoEnd);
    }
  }, [dateEnd, updateSearchParam]);

  const filterBuilderHelper = (
    filter: CustomTableFilterProps,
    classname: string,
  ) => {
    switch (filter.filterType) {
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
              value={(filters.search as string) ?? ""}
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
              (filters[filter.filterName] as string) ??
              filter.defaultValue ??
              ""
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
                  {dateStart ? (
                    dateEnd ? (
                      <>
                        {moment(dateStart).format("DD MMM YYYY")} -{" "}
                        {moment(dateEnd).format("DD MMM YYYY")}
                      </>
                    ) : (
                      moment(dateStart).format("DD MMM YYYY")
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
                  date={dateStart}
                  setDate={setDateStart}
                  textSize="text-xs md:text-xs"
                />
                <DateTimePicker
                  date={dateEnd}
                  setDate={setDateEnd}
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
