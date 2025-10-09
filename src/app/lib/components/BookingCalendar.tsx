import { Calendar1, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import React, { FC } from "react";
import { daysArr, monthArr } from "../const/MonthAndDays";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";
import { ClientStoreProductType } from "../types/store_product_type";
import moment from "moment";

type BookingCalendarProps = {
  selectedDate: string;
  defaultStartDate?: string;
  storeProduct: ClientStoreProductType | undefined;
  currMonth: number;
  currYear: number;
  datesOfMonth: (number | null)[];
  handleDecreaseMonth: () => void;
  handleIncreaseMonth: () => void;
  handleDecreaseYear: () => void;
  handleIncreaseYear: () => void;
  openBookingCalendarHours: () => void;
  handleBookingCalendarDateChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  isDateValid: (date: number) => boolean;
  checkAnyDateAvailability: (
    dateHoursInMs: number[],
    stockData: ClientStoreProductStockType[],
  ) => boolean;
  checkEveryDateAvailability: (
    dateHoursInMs: number[],
    stockData: ClientStoreProductStockType[],
  ) => boolean;
};

const BookingCalendar: FC<BookingCalendarProps> = ({
  selectedDate,
  storeProduct,
  currMonth,
  currYear,
  datesOfMonth,
  handleDecreaseMonth,
  handleIncreaseMonth,
  handleDecreaseYear,
  handleIncreaseYear,
  openBookingCalendarHours,
  handleBookingCalendarDateChange,
  isDateValid,
  checkAnyDateAvailability,
  checkEveryDateAvailability,
}) => {
  if (!storeProduct) return;

  return (
    <div className="flex flex-col gap-2 lg:h-full lg:w-full">
      <div className="flex items-center gap-2">
        <Calendar1 size={18} />
        <h3 className="subheader-custom">Pilih Tanggal Booking</h3>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border-accent-custom w-full rounded-md bg-white p-4 pb-2 shadow-lg">
          {/* ---- Date Navigation ---- */}
          <div className="date-navigation-wrapper mb-2 flex flex-row items-center justify-between rounded-lg bg-sky-100 p-3 shadow-sm">
            {/* Month Navigation */}
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={handleDecreaseMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:bg-sky-100"
              >
                <ChevronLeft size={18} className="text-sky-700" />
              </button>
              <p className="text-lg font-semibold text-sky-900">
                {monthArr[currMonth]}
              </p>
              <button
                onClick={handleIncreaseMonth}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:bg-sky-100"
              >
                <ChevronRight size={18} className="text-sky-700" />
              </button>
            </div>

            {/* Year Navigation */}
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={handleDecreaseYear}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:bg-sky-100"
              >
                <ChevronLeft size={18} className="text-sky-700" />
              </button>
              <p className="text-lg font-semibold text-sky-900">{currYear}</p>
              <button
                onClick={handleIncreaseYear}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:bg-sky-100"
              >
                <ChevronRight size={18} className="text-sky-700" />
              </button>
            </div>
          </div>

          {/* ---- Name Of Days ---- */}
          <div className="name-of-days-wrapper mb-3 grid grid-cols-7 rounded-md bg-sky-100 py-2 text-sm font-semibold text-sky-800 shadow-inner">
            {daysArr.map((day) => (
              <p key={day} className="text-center">
                {day}
              </p>
            ))}
          </div>

          {/* ---- Dates ---- */}
          <div className="calendar-info-wrapper flex h-fit flex-row flex-wrap pt-2 text-center">
            {datesOfMonth.map((date, index) => {
              // Handle empty (padding) dates
              if (date === null) {
                return (
                  <div
                    key={index}
                    className="relative mb-4 flex grow-2 flex-col items-center justify-center p-4"
                    style={{ width: `${100 / 7}%` }}
                  >
                    <span className="text-slate-400">
                      <Circle />
                    </span>
                  </div>
                );
              }

              // Helpers
              const thisDateInputValueInMS = new Date(
                currYear,
                currMonth,
                date,
              ).getTime();
              const hoursArr = Array.from({ length: 24 }, (_, h) => h).filter(
                (h) => h >= 7 && h < 21,
              );

              const thisDateHoursInMs = hoursArr.map(
                (h) => thisDateInputValueInMS + h * 3600000,
              );

              // Format value YYYY-MM-DD
              const formattedValue = `${currYear}-${
                currMonth < 9 ? `0${currMonth + 1}` : currMonth + 1
              }-${date < 10 ? `0${date}` : date}`;

              return (
                <div
                  key={index}
                  className="relative mb-4 flex flex-col items-center justify-center p-4"
                  style={{ width: `${100 / 7}%` }}
                >
                  <input
                    id={`input-${date}`}
                    name="rentalDate"
                    type="radio"
                    required
                    checked={selectedDate === formattedValue}
                    value={formattedValue}
                    className="peer absolute top-1/2 left-1/2 z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-0"
                    onChange={(e) => handleBookingCalendarDateChange(e)}
                    onClick={() => openBookingCalendarHours()}
                    disabled={
                      isDateValid(thisDateInputValueInMS)
                        ? true
                        : checkEveryDateAvailability(
                              thisDateHoursInMs,
                              storeProduct.stocksDetails,
                            ) &&
                            checkAnyDateAvailability(
                              thisDateHoursInMs,
                              storeProduct.stocksDetails,
                            )
                          ? true
                          : false
                    }
                  />
                  <label
                    htmlFor={`input-${date}`}
                    className="dateBookingLabel hover:text-colorPrimary absolute z-10 flex h-8 w-8 items-center justify-center rounded-full peer-checked:bg-teal-400 peer-checked:text-white peer-disabled:text-slate-400 hover:border-2 hover:border-blue-500 hover:bg-sky-100"
                  >
                    {date}
                  </label>

                  {/* Availability indicator dot */}
                  <span
                    style={
                      !isDateValid(thisDateInputValueInMS)
                        ? checkEveryDateAvailability(
                            thisDateHoursInMs,
                            storeProduct.stocksDetails,
                          ) &&
                          checkAnyDateAvailability(
                            thisDateHoursInMs,
                            storeProduct.stocksDetails,
                          )
                          ? { background: "#FF0000" }
                          : !checkEveryDateAvailability(
                                thisDateHoursInMs,
                                storeProduct.stocksDetails,
                              ) &&
                              checkAnyDateAvailability(
                                thisDateHoursInMs,
                                storeProduct.stocksDetails,
                              )
                            ? { background: "#26AF0E" }
                            : { opacity: 0 }
                        : { opacity: 0 }
                    }
                    className="absolute -bottom-1 h-1 w-1 rounded-full"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex w-full items-center justify-center p-2">
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-teal-400">
              <span className="text-black">---</span>
              <span>
                Waktu Mulai: {moment(selectedDate).format("DD MMMM YYYY")}
              </span>
              <span className="text-black">---</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
