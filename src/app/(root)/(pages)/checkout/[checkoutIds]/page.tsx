import { StoreOrderHandler } from "@/app/lib/utils/StoreOrderHandler";
import React from "react";
import { CheckoutDetail } from "./components/CheckoutDetail";

type PageProps = {
  params: Promise<{ checkoutIds: string }>;
};

const page = async ({ params }: PageProps) => {
  const { checkoutIds } = await params;
  const checkoutIdsArray = Array.isArray(checkoutIds)
    ? checkoutIds
    : checkoutIds.split(",");

  const orderPromises = checkoutIdsArray.map(async (id: string) => {
    const [storeId, orderId] = decodeURIComponent(id).split(":");
    const order = await StoreOrderHandler.getOneStoreOrder(orderId, storeId);
    return order;
  });

  const orders = await Promise.all(orderPromises);

  return (
    <main className="checkout-page bg-defaultBackground relative flex h-full w-full flex-col items-center gap-6 p-4 pt-5 pb-40 lg:h-full">
      {orders.length > 0
        ? orders.map((orderData, index) => {
            return (
              <div className="flex flex-col gap-4" key={orderData._id}>
                <p className="text-center">
                  Pesanan di <b>{orderData.storeDetail.storeName}</b>
                </p>
                <CheckoutDetail
                  key={index}
                  orderData={orderData}
                  index={index}
                />
              </div>
            );
          })
        : ""}
    </main>
  );
};

export default page;
