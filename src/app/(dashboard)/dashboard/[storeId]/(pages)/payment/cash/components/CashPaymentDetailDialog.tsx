import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

type Props = {
  data: ClientStoreOrderPaymentType;
};

export function CashPaymentDetailDialog({ data }: Props) {
  const order = data?.orderDetail;
  const item = order?.items?.[0];

  return (
    <div className="space-y-4 text-xs">
      <DialogHeader>
        <DialogTitle>Payment & Order Details</DialogTitle>
        <DialogDescription>
          Payment ID: <span className="font-medium">{data._id}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-y-4">
        {/* Payment Summary */}
        <section className="space-y-1">
          <h3 className="text-lg font-semibold">Payment Info</h3>
          <p>
            <strong>Order ID:</strong> {data.orderID}
          </p>
          <p>
            <strong>Type:</strong> {data.type}
          </p>
          <p>
            <strong>Payment Amount:</strong> Rp
            {data.paymentAmount.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Method:</strong> {data.paymentMethod}
          </p>
          <p>
            <strong>Type:</strong> {data.paymentType}
          </p>
          <p>
            <strong>Description:</strong> {data.paymentDesc}
          </p>
        </section>

        {/* Store Info */}
        {order?.storeDetail && (
          <section className="space-y-1">
            <h3 className="text-lg font-semibold">Store Info</h3>
            <p>
              <strong>Name:</strong> {order.storeDetail.storeName}
            </p>
            <p>
              <strong>Address:</strong> {order.storeDetail.storeAddress.address}
              , {order.storeDetail.storeAddress.district},{" "}
              {order.storeDetail.storeAddress.city},{" "}
              {order.storeDetail.storeAddress.province}
            </p>
            <Image
              width={100}
              height={100}
              src={order.storeDetail.storeImage.link}
              alt="Store"
              className="w-32 rounded border"
            />
          </section>
        )}

        {/* Item Info */}
        {item && (
          <section className="space-y-1">
            <h3 className="text-lg font-semibold">Item Info</h3>
            <p>
              <strong>Name:</strong> {item.itemName}
            </p>
            <p>
              <strong>Variation:</strong> {item.itemVariation.variationName}
            </p>
            <p>
              <strong>Price:</strong> Rp
              {item.itemVariation.variationPrice.toLocaleString("id-ID")}
            </p>
            <p>
              <strong>Amount:</strong> {item.itemAmount}
            </p>
            <p>
              <strong>Subtotal:</strong> Rp{item.itemSubtotal}
            </p>
          </section>
        )}

        {/* Rental Info */}
        {item?.rentalDetails && (
          <section className="space-y-1">
            <h3 className="text-lg font-semibold">Rental Period</h3>
            <p>
              <strong>Start:</strong> {item.rentalDetails.rentalStartDate}{" "}
              {item.rentalDetails.rentalStartTime}
            </p>
            <p>
              <strong>End:</strong> {item.rentalDetails.rentalEndDate}{" "}
              {item.rentalDetails.rentalEndTime}
            </p>
          </section>
        )}

        {/* Billing Info */}
        {order?.billing && (
          <section className="space-y-1">
            <h3 className="text-lg font-semibold">Customer Billing</h3>
            <p>
              <strong>Name:</strong> {order.billing.firstName}{" "}
              {order.billing.lastName}
            </p>
            <p>
              <strong>Phone:</strong> {order.billing.telephone}
            </p>
            <p>
              <strong>Email:</strong> {order.billing.email}
            </p>
            <p>
              <strong>Address:</strong> {order?.billing?.address?.street},{" "}
              {order?.billing?.address?.district},{" "}
              {order?.billing?.address?.city},{" "}
              {order?.billing?.address?.province}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
