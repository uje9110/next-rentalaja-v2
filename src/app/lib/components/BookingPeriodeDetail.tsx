import React from "react";
import moment from "moment-timezone";
import { StoreOrderItemType } from "../types/store_order_item_type";

type BookingPeriodeDetailProps = {
  orderItemData: StoreOrderItemType;
};

const BookingPeriodeDetail: React.FC<BookingPeriodeDetailProps> = ({
  orderItemData,
}) => {
  return (
    <div id="booking-info-wrapper" className="flex w-full flex-col gap-2">
      <h3 className="text-md self-start font-semibold">Periode Sewa</h3>
      <div className="border-accent-custom flex w-full gap-2 rounded-md bg-sky-100 p-2 shadow-sm">
        <div className="flex w-1/2 flex-col">
          <h4 className="text-center text-sm font-semibold text-green-500">
            Mulai
          </h4>
          <p className="phone:text-[10px] flex flex-col items-center justify-center text-center text-xs">
            <span>
              {orderItemData.rentalDetails.rentalStartInLocaleMs === 0
                ? "Silahkan pilih tanggal sewa"
                : moment(orderItemData.rentalDetails.rentalStartInLocaleMs)
                    .tz("Asia/Jakarta")
                    .format("DD MMMM YYYY")}
            </span>
            <span>
              {orderItemData.rentalDetails.rentalStartInLocaleMs === 0
                ? "---"
                : moment(orderItemData.rentalDetails.rentalStartInLocaleMs)
                    .tz("Asia/Jakarta")
                    .format("HH:mm")}
            </span>
          </p>
        </div>
        <div className="flex w-1/2 flex-col">
          <h4 className="text-center text-sm font-semibold text-red-500">
            Selesai
          </h4>
          <p className="phone:text-[10px] flex flex-col items-center justify-center text-center text-xs">
            <span>
              {orderItemData.rentalDetails.rentalEndInLocaleMs === 0
                ? "Silahkan pilih paket sewa"
                : moment(orderItemData.rentalDetails.rentalEndInLocaleMs)
                    .tz("Asia/Jakarta")
                    .format("DD MMMM YYYY")}
            </span>
            <span>
              {orderItemData.rentalDetails.rentalEndInLocaleMs === 0
                ? "---"
                : moment(orderItemData.rentalDetails.rentalEndInLocaleMs)
                    .tz("Asia/Jakarta")
                    .format("HH:mm")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPeriodeDetail;
