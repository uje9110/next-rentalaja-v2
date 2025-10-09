import React, { FC } from "react";
import axios from "axios";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { useOrder } from "@/app/lib/hooks/useOrder";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useBooking } from "@/app/lib/hooks/useBooking";
import { useBookingCalendarHours } from "@/app/lib/hooks/useBookingCalendarHours";
import { useBookingCalendar } from "@/app/lib/hooks/useBookingCalendar";
import { useBookingSelectVariation } from "@/app/lib/hooks/useBookingSelectVariation";
import { useBookingItemAmount } from "@/app/lib/hooks/useBookingItemAmount";
import BookingCalendar from "@/app/lib/components/BookingCalendar";
import BookingSelectVariation from "@/app/lib/components/BookingSelectVariations";
import BookingItemAmount from "@/app/lib/components/BookingItemAmount";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import BookingCalendarHours from "@/app/lib/components/BookingCalendarHours";
import AddItemToCartButton from "@/app/lib/components/AddItemToCartButton";
import { useAddItemToCartButton } from "@/app/lib/hooks/useAddItemToCartButton";
import { useCartContext } from "@/app/lib/context/CartContext";
import { useCart } from "@/app/(root)/(pages)/cart/hooks/useCart";

interface ItemFormItemModalTypes {
  currentItem: StoreOrderItemType;
  defaultValue: {
    bookingStart?: string;
    bookingEnd?: string;
  };
}

const ItemFormItemModal: FC<ItemFormItemModalTypes> = ({
  currentItem,
  defaultValue,
}) => {
  const { APIEndpoint } = useAPIContext();
  const params = useParams();
  const { storeId } = params;

  const [defaultStartDate, defaultStartHour] = defaultValue.bookingStart?.split(
    "T",
  ) ?? ["", ""];

  const { data: storeProduct } = useQuery({
    queryKey: ["storeProducts"],
    queryFn: async (): Promise<ClientStoreProductType | undefined> => {
      try {
        const response = await axios.get(
          `${APIEndpoint}/product/${currentItem.itemID}`,
          {
            headers: {
              "x-store-id": storeId,
            },
          },
        );
        return response.data.json;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    enabled: !!currentItem?.itemID, // ✅ only run when itemID is truthy
  });

  const { cart, setCart, checkout, setCheckout } = useCartContext();

  // USE ORDER
  const { orderItemData, setOrderItemData } = useOrder({ storeProduct });

  const { handleAddCartItemToCheckout } = useCart({
    checkout,
    setCheckout,
  });

  const {
    currMonth,
    currYear,
    currDateInMs,
    datesOfMonth,
    hoursArr,
    minutesArr,
    handleDecreaseMonth,
    handleIncreaseMonth,
    handleDecreaseYear,
    handleIncreaseYear,
  } = useBooking();

  // USE BOOKING CALENDAR HOUR
  const {
    bookingHourAndMinute,
    isBookingCalendarHourOpen,
    setIsBookingCalendarHourOpen,
    setBookingHourAndMinute,
    checkHourAvaibilty,
    getSelectedDateValueInMs,
  } = useBookingCalendarHours({
    setOrderItemData,
    orderItemData,
    defaultStartHour,
  });

  // USE BOOKING CALENDAR
  const {
    selectedDate,
    openBookingCalendarHours,
    handleBookingCalendarDateChange,
    isDateValid,
    checkAnyDateAvailability,
    checkEveryDateAvailability,
  } = useBookingCalendar({
    setIsBookingCalendarHourOpen,
    setOrderItemData,
    currDateInMs,
    defaultStartDate,
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

  const { handleAddItemToCart } = useAddItemToCartButton({ cart, setCart });

  return (
    <div
      id="add-item-dialog"
      className="phone:h-120 phone:overflow-auto phone:w-full w-2/3 rounded-lg"
    >
      <div
        className={`modalContainer phone:h-auto flex h-5/6 w-full flex-col justify-start gap-4 overflow-auto rounded-lg bg-white`}
      >
        <div className="modalBody phone:h-auto h-full">
          <div
            key={currentItem._id as string}
            className="flex h-full flex-col justify-between gap-4"
          >
            <div className="phone:h-full phone:flex-col flex h-full flex-row gap-4 lg:flex lg:flex-row">
              <div className="phone:w-full flex h-full w-1/2 flex-col lg:w-1/2">
                <BookingCalendar
                  isDateValid={isDateValid}
                  checkAnyDateAvailability={checkAnyDateAvailability}
                  checkEveryDateAvailability={checkEveryDateAvailability}
                  openBookingCalendarHours={openBookingCalendarHours}
                  selectedDate={selectedDate}
                  storeProduct={storeProduct}
                  currMonth={currMonth}
                  currYear={currYear}
                  datesOfMonth={datesOfMonth}
                  handleDecreaseMonth={handleDecreaseMonth}
                  handleBookingCalendarDateChange={
                    handleBookingCalendarDateChange
                  }
                  handleDecreaseYear={handleDecreaseYear}
                  handleIncreaseMonth={handleIncreaseMonth}
                  handleIncreaseYear={handleIncreaseYear}
                  defaultStartDate={defaultStartDate}
                />
                <BookingCalendarHours
                  bookingHourAndMinute={bookingHourAndMinute}
                  getSelectedDateValueInMs={getSelectedDateValueInMs}
                  storeProduct={storeProduct}
                  hoursArr={hoursArr}
                  minutesArr={minutesArr}
                  currDateInMs={currDateInMs}
                  isBookingCalendarHourOpen={isBookingCalendarHourOpen}
                  setIsBookingCalendarHourOpen={setIsBookingCalendarHourOpen}
                  setBookingHourAndMinute={setBookingHourAndMinute}
                  checkHourAvaibilty={checkHourAvaibilty}
                  defaultStartHour={defaultStartHour}
                />
              </div>

              <div className="phone:w-full flex h-full flex-col gap-4 lg:w-1/2">
                {/* RENTAL VARIATIONS SELECT */}
                <BookingSelectVariation
                  storeProduct={storeProduct}
                  orderItemData={orderItemData}
                  variationsDetails={storeProduct?.variationsDetails}
                  handleBookingVariation={handleBookingVariation}
                  checkBookingVariantAvailability={
                    checkBookingVariantAvailability
                  }
                />
                <BookingItemAmount
                  availableStocks={availableStocks}
                  handleItemAmountChange={handleItemAmountChange}
                />

                <AddItemToCartButton
                  isUsingDashboard={true}
                  handleAddCartItemToCheckout={handleAddCartItemToCheckout}
                  orderItemData={orderItemData}
                  handleAddItemToCart={handleAddItemToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemFormItemModal;
