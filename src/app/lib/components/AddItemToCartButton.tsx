import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import moment from "moment";

type AddItemToCartButtonProps = {
  isUsingDashboard?: boolean;
  handleAddCartItemToCheckout?: (orderItemData: StoreOrderItemType) => void;
  orderItemData: StoreOrderItemType;
  handleAddItemToCart: (orderItemData: StoreOrderItemType) => void;
};

const AddItemToCartButton: FC<AddItemToCartButtonProps> = ({
  isUsingDashboard = false,
  handleAddCartItemToCheckout,
  orderItemData,
  handleAddItemToCart,
}) => {
  const [open, setOpen] = useState(false);

  const needsReview =
    !!orderItemData.rentalDetails?.rentalStartDate ||
    !!orderItemData.rentalDetails?.rentalEndDate;

  const handleConfirm = () => {
    if (isUsingDashboard && handleAddCartItemToCheckout) {
      handleAddCartItemToCheckout(orderItemData);
    }
    handleAddItemToCart(orderItemData);
    setOpen(false);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Button
        className="w-full rounded-md bg-teal-400 px-4 py-2 font-semibold text-white shadow"
        onClick={() => {
          if (needsReview) {
            setOpen(true);
          } else {
            handleAddItemToCart(orderItemData);
          }
        }}
      >
        Tambahkan Ke Cart
      </Button>

      {needsReview && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Item</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Item:</span>{" "}
                {orderItemData.itemName}
              </p>
              <p>
                <span className="font-semibold">Paket Sewa:</span>{" "}
                {orderItemData.itemVariation.variationName}
              </p>
              <p>
                <span className="font-semibold">Rental Mulai:</span>{" "}
                {moment(
                  orderItemData.rentalDetails.rentalStartInLocaleMs,
                ).format("DD MMMM YYYY, HH:mm")}
              </p>
              <p>
                <span className="font-semibold">Rental Berakhir:</span>{" "}
                {moment(orderItemData.rentalDetails.rentalEndInLocaleMs).format(
                  "DD MMMM YYYY, HH:mm",
                )}
              </p>
              <p>
                <span className="font-semibold">Jumlah Item:</span>{" "}
                {orderItemData.itemAmount}
              </p>
            </div>

            <DialogFooter className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button
                className="bg-teal-400 text-white"
                onClick={handleConfirm}
              >
                Konfirmasi & Tambahkan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AddItemToCartButton;
