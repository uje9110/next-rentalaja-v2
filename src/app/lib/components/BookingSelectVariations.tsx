import React, { ChangeEvent } from "react";
import { StoreProductVariationType } from "@/app/lib/types/store_product_variation_type";
import { CalendarClock } from "lucide-react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";
import { ClientStoreProductType } from "../types/store_product_type";
import moment from "moment";

type BookingSelectVariationProps = {
  storeProduct: ClientStoreProductType | undefined;
  orderItemData: StoreOrderItemType;
  variationsDetails: StoreProductVariationType[] | undefined;
  handleBookingVariation: (
    e: ChangeEvent<HTMLInputElement>,
    variationTimeValueInMs: number,
  ) => void;
  checkBookingVariantAvailability: (
    selectedDateTime: number,
    bookingDuration: number,
    stocksData: ClientStoreProductStockType[],
  ) => boolean;
};

const BookingSelectVariation: React.FC<BookingSelectVariationProps> = ({
  storeProduct,
  orderItemData,
  variationsDetails,
  handleBookingVariation,
  checkBookingVariantAvailability,
}) => {
  if (!storeProduct || !variationsDetails) return;

  const rentalStartInMs = orderItemData?.rentalDetails.rentalStartInLocaleMs;

  return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 phone:gap-1">
          <CalendarClock className="phone:w-4" />
          <h3 className="subheader-custom phone:text-sm">Pilih Paket Sewa</h3>
        </div>
        <div className="flex flex-row flex-wrap justify-between gap-4 w-full phone:gap-2">
          {variationsDetails
            .sort((a, b) => a.hoursValue - b.hoursValue)
            .map((item, index: number) => {
              const {
                _id,
                variationTitle,
                variationPrice,
                hoursValue,
                variationBonus,
              } = item;

              const variationTimeValueInMs =
                (hoursValue + variationBonus.hoursValue) * 3600000;

              const bookingEndInMs = rentalStartInMs + variationTimeValueInMs;

              return (
                <div
                  key={_id}
                  className="relative w-[48%] max-w-[49%] min-w-[45%] phone:w-[48.5%] phone:gap-0"
                >
                  {/* hidden input */}
                  <input
                    required
                    type="radio"
                    id={`variation-${index}`}
                    data-variation_title={variationTitle}
                    data-variation_id={_id}
                    data-hoursvalue={hoursValue}
                    data-variationbonustitle={variationBonus.title}
                    data-variationbonushoursvalue={variationBonus.hoursValue}
                    name="productVariation"
                    value={variationPrice}
                    disabled={checkBookingVariantAvailability(
                      rentalStartInMs,
                      variationTimeValueInMs,
                      storeProduct.stocksDetails,
                    )}
                    onChange={(e) => {
                      handleBookingVariation(e, variationTimeValueInMs);
                      //   setThisEndBookingDateTimeInMs(bookingEndDate.getTime());
                    }}
                    className="peer hidden"
                  />

                  {/* visible card */}
                  <label
                    htmlFor={`variation-${index}`}
                    className="border-accent-custom flex cursor-pointer flex-col rounded-md bg-white p-4 shadow-sm transition-all peer-checked:bg-sky-100 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-200 hover:shadow-md phone:gap-0"
                  >
                    {/* Title + Bonus */}
                    <p className="text-sm font-semibold phone:text-xs">
                      {variationTitle}
                      {variationBonus?.title && (
                        <span className="ml-1 text-xs font-light">
                          ({variationBonus.title})
                        </span>
                      )}
                    </p>

                    {/* Rental End Date */}
                    <p className="mt-2 text-xs">
                      <span className="block font-light text-gray-400">Waktu kembali:</span>
                      <span className="block font-medium text-teal-400">
                        {moment(bookingEndInMs).format("DD MMM YYYY, HH:mm")}
                      </span>
                    </p>

                    {/* Price */}
                    <span className="mt-3 text-base font-bold text-sky-800 phone:text-sm">
                      {variationPrice.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </label>
                </div>
              );
            })}
        </div>
      </div>
  );
};

export default BookingSelectVariation;
