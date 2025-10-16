"use client";
import React, { useEffect } from "react";
import EmptyCart from "./components/EmptyCart";
import { CartItem } from "./components/CartItem";
import { useCartContext } from "@/app/lib/context/CartContext";
import { CartSummary } from "./components/CartSummary";
import { useCart } from "./hooks/useCart";

const Page = () => {
  const { cart, checkout, setCheckout } = useCartContext();
  const {
    bookingConflicts,
    bookingValidationLoading,
    handleAddCartItemToCheckout,
    checkIsItemAlreadyExistInCheckout,
    validateBookings,
    removeItemFromCart,
  } = useCart({
    checkout,
    setCheckout,
  });

  useEffect(() => {
    validateBookings();
  }, [cart]);

  const isThereBookingConflict = Object.entries(bookingConflicts).some(
    ([, conflicts]) => {
      return conflicts === true;
    },
  );

  return (
    <main className="checkout-page bg-defaultBackground relative flex max-h-fit min-h-screen w-full flex-col items-center gap-4 p-4 pt-5 pb-40 lg:h-screen lg:flex-row lg:items-start lg:justify-center">
      {cart.length > 0 ? (
        <div className="phone:phone-display flex w-full flex-col gap-4 lg:flex lg:w-[60%] lg:flex-row">
          {isThereBookingConflict && (
            <div className="mt-8 flex w-full flex-col gap-2 rounded-lg border-2 bg-white p-4">
              <p className="text-base font-semibold text-slate-600">
                <span className="text-3xl">⚠️</span> Mengapa ada alat yang
                kadaluarsa?
              </p>
              <p className="text-xs text-slate-500">
                Alat dapat kadaluarsa apabila alat disimpan dalam keranjang
                dalam waktu yang lama tanpa kunjung dicheckout. Hal tersebut
                terjadi karena dimungkinkan ada orang lain yang mendahului
                checkout alat yang sama di jadwal yang sama juga dari kamu.
              </p>
            </div>
          )}
          {/* ITEMS */}
          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <CartItem
              removeItemFromCart={removeItemFromCart}
              cart={cart}
              bookingConflicts={bookingConflicts}
              bookingValidationLoading={bookingValidationLoading}
              handleAddCartItemToCheckout={handleAddCartItemToCheckout}
              checkIsItemAlreadyExistInCheckout={
                checkIsItemAlreadyExistInCheckout
              }
            />
          </div>

          {/* ITEMS SUMMARY */}
          <CartSummary checkout={checkout} />
        </div>
      ) : (
        <EmptyCart />
      )}
    </main>
  );
};

export default Page;
