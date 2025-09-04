import BookingCalendar from "@/app/lib/components/BookingCalendar";
import BookingCalendarHours from "@/app/lib/components/BookingCalendarHours";
import BookingItemAmount from "@/app/lib/components/BookingItemAmount";
import BookingPeriodeDetail from "@/app/lib/components/BookingPeriodeDetail";
import BookingSelectVariation from "@/app/lib/components/BookingSelectVariations";
import { useBooking } from "@/app/lib/hooks/useBooking";
import { useBookingCalendar } from "@/app/lib/hooks/useBookingCalendar";
import { useBookingCalendarHours } from "@/app/lib/hooks/useBookingCalendarHours";
import { useBookingItemAmount } from "@/app/lib/hooks/useBookingItemAmount";
import { useBookingSelectVariation } from "@/app/lib/hooks/useBookingSelectVariation";
import { useOrder } from "@/app/lib/hooks/useOrder";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import React, { FC } from "react";
import AddItemToCartButton from "./AddItemToCartButton";
import { useCartContext } from "@/app/lib/context/CartContext";
import { useAddItemToCartButton } from "../hooks/useAddItemToCartButton";

type BookingSectionProp = {
  storeProduct: ClientStoreProductType;
};

const ProductBookingSection: FC<BookingSectionProp> = ({ storeProduct }) => {
  // USE BOOKING
  const {
    currMonth,
    setCurrMonth,
    currYear,
    setCurrYear,
    currDateInMs,
    datesOfMonth,
    hoursArr,
    minutesArr,
    handleDecreaseMonth,
    handleIncreaseMonth,
    handleDecreaseYear,
    handleIncreaseYear,
  } = useBooking();

  // USE ORDER
  const { orderItemData, setOrderItemData } = useOrder({ storeProduct });

  // USE BOOKING CALENDAR HOUR
  const {
    isBookingCalendarHourOpen,
    setIsBookingCalendarHourOpen,
    setBookingHourAndMinute,
    checkHourAvaibilty,
    getSelectedDateValueInMs,
  } = useBookingCalendarHours({ setOrderItemData, orderItemData });

  // USE BOOKING CALENDAR
  const {
    openBookingCalendarHours,
    handleBookingCalendarDateChange,
    isDateValid,
    checkAnyDateAvailability,
    checkEveryDateAvailability,
  } = useBookingCalendar({
    setIsBookingCalendarHourOpen,
    setOrderItemData,
    currDateInMs,
  });

  // USE BOOKING VARIATION
  const { handleBookingVariation, checkBookingVariantAvailability } =
    useBookingSelectVariation({
      orderItemData,
      setOrderItemData,
    });

  // USE BOOKING ITEM AMOUNT
  const { availableStocks, handleItemAmountChange } = useBookingItemAmount({
    storeProduct,
    orderItemData,
    setOrderItemData,
  });

  // CART CONTEXT
  const { cart, setCart } = useCartContext();

  // ADD ITEM TO CART
  const { handleAddItemToCart } = useAddItemToCartButton({ cart, setCart });

  console.log("order item data =>", orderItemData);

  return (
    <div className="mx-4 flex flex-col gap-6">
      <BookingCalendar
        storeProduct={storeProduct}
        isDateValid={isDateValid}
        checkAnyDateAvailability={checkAnyDateAvailability}
        checkEveryDateAvailability={checkEveryDateAvailability}
        currMonth={currMonth}
        currYear={currYear}
        datesOfMonth={datesOfMonth}
        handleDecreaseMonth={handleDecreaseMonth}
        handleIncreaseMonth={handleIncreaseMonth}
        handleDecreaseYear={handleDecreaseYear}
        handleIncreaseYear={handleIncreaseYear}
        openBookingCalendarHours={openBookingCalendarHours}
        handleBookingCalendarDateChange={handleBookingCalendarDateChange}
      />
      <BookingCalendarHours
        getSelectedDateValueInMs={getSelectedDateValueInMs}
        storeProduct={storeProduct}
        hoursArr={hoursArr}
        minutesArr={minutesArr}
        currDateInMs={currDateInMs}
        isBookingCalendarHourOpen={isBookingCalendarHourOpen}
        setIsBookingCalendarHourOpen={setIsBookingCalendarHourOpen}
        setBookingHourAndMinute={setBookingHourAndMinute}
        checkHourAvaibilty={checkHourAvaibilty}
      />
      <BookingSelectVariation
        checkBookingVariantAvailability={checkBookingVariantAvailability}
        storeProduct={storeProduct}
        handleBookingVariation={handleBookingVariation}
        orderItemData={orderItemData}
        variationsDetails={storeProduct.variationsDetails}
      />
      <BookingPeriodeDetail orderItemData={orderItemData} />
      <BookingItemAmount
        availableStocks={availableStocks}
        handleItemAmountChange={handleItemAmountChange}
      />
      <AddItemToCartButton
        orderItemData={orderItemData}
        handleAddItemToCart={handleAddItemToCart}
      />
    </div>
  );
};

export default ProductBookingSection;
