import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

type CartSummaryProps = {
  checkout: ClientCheckoutType;
};

export const CartSummary: React.FC<CartSummaryProps> = ({ checkout }) => {
  return (
    <div className="w-full lg:flex lg:w-1/2 lg:flex-col lg:gap-4">
      {/* CHECKOUT SUMMARY */}
      <div className="border-accent-custom flex h-fit w-full flex-col gap-2 overflow-hidden rounded-md bg-white shadow-sm">
        <h3 className="text-md bg-sky-100 px-4 py-2 font-semibold phone:text-sm">
          Rangkuman Penyewaan
        </h3>

        <div className="flex flex-col gap-2 px-4 py-2">
          {/* ITEMS */}
          {checkout.checkoutCartItems.map((cartItem) => {
            const { items } = cartItem;

            return items.map((item) => {
              const { itemName, itemVariation, itemAmount, itemSubtotal } =
                item;
              return (
                <div
                  className="row-wrapper flex w-full flex-row justify-between text-sm"
                  key={itemName}
                >
                  <p className="flex w-[60%] flex-col">
                    <span className="font-semibold text-slate-600">
                      {itemName}
                    </span>
                    <span className="text-slate-400">
                      {itemVariation.variationName}
                    </span>
                  </p>
                  <p className="flex w-[10%] items-center text-gray-400">
                    x {itemAmount}
                  </p>
                  <p className="flex w-[30%] items-center justify-end text-gray-400">
                    {CurrencyHandlers.changeToLocaleCurrency(itemSubtotal)}
                  </p>
                </div>
              );
            });
          })}

          {/* SUBTOTAL */}
          <div className="row-wrapper flex w-full flex-row justify-between text-sm">
            <p className="text-gray-400">Subtotal</p>
            <p className="text-gray-400">
              {checkout.subtotal.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* CHECKOT BAR */}
      <div className="fixed bottom-[64px] left-0 z-20 flex h-16 w-full flex-row items-center gap-2 rounded-t-xl border border-slate-400/50 bg-sky-100 px-2 text-sm shadow-sm lg:relative lg:bottom-0 lg:rounded-lg">
        {checkout.checkoutCartItems.length < 1 ? (
          <span className="flex w-8/12 flex-col justify-center">
            Tidak ada item yang dipilih
          </span>
        ) : (
          <div className="flex w-8/12 flex-col justify-center">
            <span>
              [
              {checkout.checkoutCartItems.reduce((totalItem, currItem) => {
                return currItem.items.reduce((total, curr) => {
                  return total + curr.itemAmount;
                }, totalItem);
              }, 0)}
              ] item akan dicheckout
            </span>
            <span>
              {CurrencyHandlers.changeToLocaleCurrency(checkout.subtotal)}
            </span>
          </div>
        )}
        <a
          href={"/checkout"}
          className="bg-colorSecondary flex h-[32px] w-3/12 items-center justify-center rounded-full text-white"
        >
          Checkout
        </a>
      </div>
    </div>
  );
};
