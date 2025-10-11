import React from "react";
import OrderBillingInfo from "./components/MainComponents/OrderBillingInfo";
import { StoreOrderHandler } from "@/app/lib/utils/api-call/StoreOrderHandler";
import { OrdeStatusInfo } from "./components/MainComponents/OrdeStatusInfo";
import OrderLineItems from "./components/MainComponents/OrderLineItems";
import { StoreUserHandler } from "@/app/lib/utils/api-call/StoreUserHandler";
import ResponsiveSidebar from "./components/SidebarComponents/ResponsiveSidebar";

const Page = async ({
  params,
}: {
  params: Promise<{ storeId: string; orderId: string }>;
}) => {
  const { storeId, orderId } = await params;

  const order = await StoreOrderHandler.getOneStoreOrder({
    orderId,
    storeId,
    isFromClient: false,
  });
  const { globalUserDetails } = await StoreUserHandler.getSingleStoreUser({
    userId: order.customerID as string,
    storeId,
    isFromClient: false,
  });

  return (
    <main className="phone:flex-col phone:gap-0 flex flex-row gap-2 lg:flex lg:h-full lg:flex-row lg:gap-2">
      {/* Sidebar */}
      <ResponsiveSidebar orderData={order} />
      {/* Main Section */}
      <div
        id="single-order-div"
        className={`phone:gap-2 phone:p-2 phone:text-xs relative flex w-full flex-col gap-2 text-sm lg:p-0`}
      >
        <div className="phone:h-full phone:w-full phone:flex-col phone:items-start phone:justify-start phone:gap-2 flex h-fit w-full flex-row gap-2 lg:flex lg:h-fit lg:flex-row">
          {/* BILLING INFO */}
          <OrderBillingInfo customerData={globalUserDetails} />

          {/* ORDER STATUSES INFO */}
          <OrdeStatusInfo orderData={order} customerData={globalUserDetails} />
        </div>

        {/* LINE ITEMS */}
        <OrderLineItems orderData={order} />
      </div>
    </main>
  );
};

export default Page;
