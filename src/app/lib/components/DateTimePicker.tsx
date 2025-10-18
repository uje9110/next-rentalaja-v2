"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useState } from "react";
import moment from "moment-timezone";
import clsx from "clsx";

type DateTimePickerProps = {
  date: Date | undefined; // now string instead of Date
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  textSize?: string;
};

export function DateTimePicker({
  date,
  setDate,
  textSize = "",
}: DateTimePickerProps) {
  const newDate = new Date(date ?? "");
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(() => {
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    if (newDate) {
      return `${hours}:${minutes}`;
    }
    return `07:00`;
  });

  // Combine date + time → return string
  const combineDateTime = (
    selectedDate: Date | undefined,
    timeString: string,
  ) => {
    if (!selectedDate) return undefined;
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);

    // ✅ format as DD-MM-YYYY HH:mm:ss
    return newDate;
  };

  return (
    <div className={"flex gap-4"}>
      {/* Date Picker */}
      <div className="flex w-[48%] flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="phone:text-xs lg:phone:sm w-[48%]">
            <Button
              variant="outline"
              id="date-picker"
              className={clsx(
                "w-full justify-between border border-slate-400/50 font-normal",
                textSize,
              )}
            >
              {date
                ? moment(date).tz("Asia/Jakarta").format("DD MMM YYYY")
                : "Pilih Tanggal"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              captionLayout="dropdown"
              onSelect={(selected) => {
                const newDateTime = combineDateTime(selected, time);
                setDate(newDateTime);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex w-[48%] flex-col gap-3">
        <Input
          min="07:00:00"
          max="21:00:00"
          lang="en-GB"
          type="time"
          step="60"
          id="time-picker"
          value={time}
          onChange={(e) => {
            const newTime = e.target.value;
            setTime(newTime);
            const parsedDate = date
              ? moment(date, "DD-MM-YYYY HH:mm:ss").toDate()
              : undefined;
            const newDateTime = combineDateTime(parsedDate, newTime);
            setDate(newDateTime);
          }}
          className={clsx(
            "bg-background phone:text-xs lg:phone:sm appearance-none border border-slate-400/50",
            textSize,
          )}
        />
      </div>
    </div>
  );
}
