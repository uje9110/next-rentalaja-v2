import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircleWarning, X } from "lucide-react";
import React, { Dispatch, FC, SetStateAction } from "react";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";
import { ClientStoreProductType } from "../types/store_product_type";
import { cn } from "@/lib/utils";

type BookingCalendarHoursProps = {
  bookingHourAndMinute: Record<string, string>;
  defaultStartHour?: string;
  storeProduct: ClientStoreProductType | undefined;
  hoursArr: number[];
  minutesArr: number[];
  currDateInMs: number;
  isBookingCalendarHourOpen: boolean;
  setIsBookingCalendarHourOpen: Dispatch<SetStateAction<boolean>>;
  setBookingHourAndMinute: Dispatch<SetStateAction<Record<string, string>>>;
  checkHourAvaibilty: (
    hourInMs: number,
    stocksData: ClientStoreProductStockType[],
  ) => boolean;
  getSelectedDateValueInMs: () => number;
};

const BookingCalendarHours: FC<BookingCalendarHoursProps> = ({
  bookingHourAndMinute,
  storeProduct,
  hoursArr,
  minutesArr,
  isBookingCalendarHourOpen,
  setIsBookingCalendarHourOpen,
  setBookingHourAndMinute,
  checkHourAvaibilty,
  getSelectedDateValueInMs,
}) => {
  const handleClose = () => {
    setIsBookingCalendarHourOpen(false);
  };

  if (!storeProduct) return;

  return (
    <Dialog open={isBookingCalendarHourOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[80%] max-w-2xl overflow-hidden rounded-2xl p-0">
        <DialogHeader className="relative border-b bg-sky-100 p-4 text-sky-800">
          <DialogTitle className="text-lg font-semibold">
            Pilih Waktu Sewa
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/40"
          >
            <X size={16} />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-4 pt-0">
          {/* Hours & Minutes Section */}
          <p className="flex items-center justify-center gap-2 rounded-md phone:text-xs border-2 border-dashed border-yellow-300 bg-yellow-100 py-2 text-center lg:text-sm">
            <MessageCircleWarning className="lg:text-sm phone:text-xs"/>
            <span>Minimal jam sewa 7.30 dan maksimal jam sewa 21.00</span>
          </p>
          <div className="flex gap-6">
            {/* Hours */}
            <div className="flex w-1/2 flex-col items-center">
              <p className="border-colorPrimary mb-2 w-full border-b-2 py-1 text-center font-semibold text-sky-800">
                JAM
              </p>
              <div className="flex h-72 w-full flex-col gap-2 overflow-auto">
                {hoursArr.map((item) => {
                  const selectedBookingDateInMs = getSelectedDateValueInMs();
                  const currHourInMs =
                    selectedBookingDateInMs + item * 3600 * 1000;
                  const formattedValue = item < 10 ? `0${item}` : `${item}`;

                  return (
                    <div
                      key={`bookingHour-${item}`}
                      className="relative flex justify-center"
                    >
                      <input
                        checked={bookingHourAndMinute.hour === formattedValue}
                        type="radio"
                        id={`bookingHour-${item}`}
                        name="bookingHour"
                        value={formattedValue}
                        onChange={(e) =>
                          setBookingHourAndMinute((prevState) => {
                            return {
                              ...prevState,
                              hour: e.target.value,
                            };
                          })
                        }
                        disabled={checkHourAvaibilty(
                          currHourInMs,
                          storeProduct.stocksDetails,
                        )}
                        className="peer hidden"
                      />
                      <label
                        htmlFor={`bookingHour-${item}`}
                        className="peer-checked:border-accent-custom peer-checked:border-accent-custom border-accent-custom flex h-10 w-4/5 cursor-pointer items-center justify-center rounded-full bg-white text-sm shadow-sm transition-all peer-checked:bg-sky-100 peer-checked:text-sky-800 peer-disabled:cursor-not-allowed peer-disabled:bg-slate-100 peer-disabled:text-slate-400 hover:bg-sky-50"
                      >
                        {item < 10 ? `0${item}` : item}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex w-1/2 flex-col items-center">
              <p className="border-colorPrimary mb-2 w-full border-b-2 py-1 text-center font-semibold text-sky-800">
                MENIT
              </p>
              <div className="flex h-72 w-full flex-col gap-2 overflow-auto">
                {minutesArr.map((item) => {
                  const isLessThirty = item < 30;
                  const isDisabled =
                    bookingHourAndMinute.hour === "07" && isLessThirty
                      ? true
                      : false;
                  const formattedValue = item < 10 ? `0${item}` : `${item}`;
                  return (
                    <div
                      key={`bookingMinute-${item}`}
                      className={"relative flex justify-center"}
                    >
                      <input
                        disabled={isDisabled}
                        checked={bookingHourAndMinute.minute === formattedValue}
                        type="radio"
                        id={`bookingMinute-${item}`}
                        name="bookingMinute"
                        value={formattedValue}
                        onChange={(e) =>
                          setBookingHourAndMinute((prevState) => {
                            return {
                              ...prevState,
                              minute: e.target.value,
                            };
                          })
                        }
                        className="peer hidden"
                      />
                      <label
                        htmlFor={`bookingMinute-${item}`}
                        className={cn(
                          "peer-checked:border-accent-custom border-accent-custom flex h-10 w-4/5 items-center justify-center rounded-full bg-white text-sm shadow-sm transition-all peer-checked:border-2 peer-checked:bg-sky-100 peer-checked:text-sky-800 hover:bg-sky-50 disabled:bg-gray-300",
                          isDisabled
                            ? "cursor-not-allowed bg-gray-300 hover:bg-gray-300"
                            : "cursor-pointer bg-white",
                        )}
                      >
                        {formattedValue}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit */}
          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={() => handleClose()}
              className="w-full rounded-full bg-sky-200 text-sky-800 shadow-md hover:opacity-90"
            >
              Pilih Jam
            </Button>
            {/* {isHourInvalid && (
              <p className="text-center text-xs text-red-500">
                Tolong pilih jam dan menit!
              </p>
            )} */}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingCalendarHours;
