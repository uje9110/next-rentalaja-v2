import React, { FC } from "react";
import CustomerPlaceholder from "@/app/assets/img/icon/customer-placeholder.webp";
import { ImageWithFallback } from "@/app/lib/components/ImageWithFallback";
import { GlobalUserType } from "@/app/lib/types/global_user_type";

type OrderBillingInfoProps = {
  customerData: GlobalUserType;
};

const OrderBillingInfo: FC<OrderBillingInfoProps> = async ({
  customerData,
}) => {
  return (
    <div className="phone:order-2 flex h-32 w-full flex-col items-center justify-center rounded-lg border border-slate-400/50 bg-white p-4 shadow lg:order-1">
      <div className="flex h-full w-full flex-row items-center gap-4">
        <ImageWithFallback
          alt=""
          width={100}
          height={100}
          src={customerData?.profilePic?.link as string}
          fallbackSrc={CustomerPlaceholder.src}
          className="phone:h-14 phone:w-14 aspect-square h-20 w-20 rounded-full border-2 object-cover"
        />
        <div className="flex w-5/6 flex-col items-start justify-center gap-0">
          <div className="phone:flex phone:flex-row phone:justify-between phone:w-full flex gap-2 pb-1 text-sm font-semibold">
            <p>
              {customerData?.firstName} {customerData?.lastName}
            </p>
            <p className="phone:text-[10px] flex items-center rounded-sm bg-teal-400 px-2 text-xs font-normal text-white">
              <span className="my-0">{customerData?.membershipId}</span>
            </p>
          </div>
          <div className="phone:text-[10px] w-full text-xs lg:text-xs">
            <p className="flex w-full justify-between text-black/60">
              <span className="font-semibold">Social Media:</span>
              <span className="text-right">
                {customerData?.socialMedia || "Belum Terisi"}
              </span>
            </p>
            <p className="flex w-full justify-between text-black/60">
              <span className="font-semibold">Email:</span>
              <span className="text-right">{customerData?.email}</span>
            </p>
            <p className="flex w-full justify-between text-black/60 capitalize">
              <span className="font-semibold">Telpon:</span>
              <span className="text-right">{customerData?.telephone}</span>
            </p>
            <p className="flex w-full justify-between text-black/60 capitalize">
              <span className="font-semibold">Alamat:</span>
              <span className="text-right">
                {customerData?.address?.street}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBillingInfo;
