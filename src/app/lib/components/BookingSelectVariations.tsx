import React, { ChangeEvent } from "react";
import { StoreProductVariationType } from "@/app/lib/types/store_product_variation_type";
import { CalendarClock } from "lucide-react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";
import { ClientStoreProductType } from "../types/store_product_type";

type BookingSelectVariationProps = {
  storeProduct: ClientStoreProductType;
  orderItemData: StoreOrderItemType;
  variationsDetails: StoreProductVariationType[];
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
  const rentalStartInMs = orderItemData?.rentalDetails.rentalStartInLocaleMs;

  return (
    <div
      id="variation-inputs-wrapper"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CalendarClock size={18} />
          <h3 className="subheader-custom">Pilih Paket Sewa</h3>
        </div>
        <div className="flex flex-row flex-wrap justify-between gap-4">
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

              return (
                <div
                  key={_id}
                  className="relative w-[48%] max-w-[49%] min-w-[45%]"
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
                    className="border-accent-custom flex cursor-pointer flex-col rounded-md bg-white p-4 shadow-sm transition-all peer-checked:bg-sky-100 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-200 hover:shadow-md"
                  >
                    {/* Title + Bonus */}
                    <span className="text-sm font-semibold">
                      {variationTitle}
                      {variationBonus?.title && (
                        <span className="ml-1 text-xs font-light">
                          ({variationBonus.title})
                        </span>
                      )}
                    </span>

                    {/* Rental End Date */}
                    <p className="mt-2 text-xs">
                      <span className="block font-light">Waktu kembali:</span>
                      {/* <span className="block font-medium">
                    {thisStartBookingDateTimeInMs
                      ? moment(bookingEndDate).format("DD MMM YYYY, HH:mm")
                      : "---"}
                  </span> */}
                    </p>

                    {/* Price */}
                    <span className="mt-3 text-base font-bold text-sky-800">
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
    </div>
  );
};

export default BookingSelectVariation;
