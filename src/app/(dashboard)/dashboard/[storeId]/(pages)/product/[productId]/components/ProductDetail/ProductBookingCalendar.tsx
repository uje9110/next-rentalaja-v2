import "./ProductBookingCalendar.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { ClientStoreProductStockType } from "@/app/lib/types/store_product_stock_type";
import { StoreProductBookingType } from "@/app/lib/types/store_product_booking_type";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";

const customColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A1FF33",
  "#33A1FF",
  "#FF9A33",
  "#9A33FF",
  "#33FF9A",
  "#FF3333",
];

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jum'at",
  "Sabtu",
];

const getColorForStock = (stockTitle: string) => {
  const colorIndex =
    Math.abs(
      stockTitle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
    ) % customColors.length;
  return customColors[colorIndex];
};

const getStatusStyle = (value: string) => {
  switch (value?.toLowerCase()) {
    case "completed":
      return "p-1 rounded-md bg-green-200 text-slate-600";
    case "canceled":
      return "p-1 rounded-md bg-red-200 text-slate-600";
    case "pending":
      return "p-1 rounded-md bg-yellow-200 text-slate-600";
    case "processing":
      return "p-1 rounded-md bg-blue-200 text-slate-600";
    case "confirmed":
      return "p-1 rounded-md bg-purple-200 text-slate-600";
    case "fully-paid":
      return "p-1 rounded-md bg-green-200 text-slate-600";
    case "unpaid":
      return "p-1 rounded-md bg-red-200 text-slate-600";
    case "partially-paid":
      return "p-1 rounded-md bg-yellow-200 text-slate-600";
    default:
      return "";
  }
};

const NavigatorButton = ({
  onClick,
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
    aria-label={label}
  >
    {icon}
  </div>
);

const DateNavigator = ({
  currMonth,
  currYear,
  onMonthChange,
  onYearChange,
}: {
  currMonth: number;
  currYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}) => (
  <div className="date-navigation-wrapper mb-4 flex flex-row justify-between border-b-2 border-sky-800 pb-2">
    <div className="flex w-1/6 flex-row items-center justify-between gap-2">
      <NavigatorButton
        onClick={() => onMonthChange(-1)}
        label="Previous month"
        icon={<ChevronLeft />}
      />
      <p className="bg-colorPrimary rounded-full px-4 py-1 text-sm text-white">
        {monthNames[currMonth]}
      </p>
      <NavigatorButton
        onClick={() => onMonthChange(1)}
        label="Next month"
        icon={<ChevronRight />}
      />
    </div>
    <p className="font-semibold">Kalender Booking</p>
    <div className="flex w-1/6 flex-row items-center justify-between gap-2">
      <NavigatorButton
        onClick={() => onYearChange(-1)}
        label="Previous year"
        icon={<ChevronLeft />}
      />
      <p className="bg-colorPrimary rounded-full px-4 py-1 text-sm text-white">
        {currYear}
      </p>
      <NavigatorButton
        onClick={() => onYearChange(1)}
        label="Next year"
        icon={<ChevronRight />}
      />
    </div>
  </div>
);

const DateCell = ({
  date,
  currYear,
  currMonth,
  stocksDetail,
  checkDate,
  openBookingDetail,
  closeBookingDetail,
}: {
  date: number;
  currYear: number;
  currMonth: number;
  stocksDetail: ClientStoreProductStockType[];
  checkDate: (
    stocksArray: ClientStoreProductStockType[],
    dateInput: number,
  ) => StoreProductBookingType[] | { belongToStockId: string }[];
  openBookingDetail: (
    e: MouseEvent<HTMLElement>,
    bookingData: StoreProductBookingType,
  ) => void;
  closeBookingDetail: (bookingData: StoreProductBookingType) => void;
}) => {
  if (date === null) {
    return <div style={{ width: `${100 / 7}%` }}></div>;
  }

  const hours = Array.from({ length: 15 }, (_, i) => i + 7);

  const renderBookedStocks = (
    bookedStocks: StoreProductBookingType[] | { belongToStockId: string }[],
  ): ReactNode => {
    if (bookedStocks.length === 0) {
      return <span className="w-8 text-center text-gray-400">-</span>;
    }

    // @ts-nocheck
    const isBookingType = <T,>(
      stock: T,
    ): stock is T & StoreProductBookingType => {
      return (
        typeof stock === "object" &&
        stock !== null &&
        "fromOrderId" in stock &&
        stock.fromOrderId !== "DEFAULT_0"
      );
    };

    const elemn = bookedStocks.map((stock, index) => {
      return (
        <div
          key={index}
          data-orderid={isBookingType(stock) ? stock.fromOrderId : "DEFAULT_0"}
          className="booked-stock-title flex w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-0 text-center text-white"
          style={
            isBookingType(stock)
              ? {
                  backgroundColor: getColorForStock(
                    stock.belongToStockId as string,
                  ),
                }
              : undefined
          }
          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
            isBookingType(stock) ? openBookingDetail(e, stock) : undefined
          }
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
            isBookingType(stock) ? openBookingDetail(e, stock) : undefined
          }
          onMouseLeave={() =>
            isBookingType(stock) ? closeBookingDetail(stock) : undefined
          }
        >
          {stock?.belongToStockId?.split("_")[2] ||
            stock?.belongToStockId?.split("_")[1]}
        </div>
      );
    });

    return elemn;
  };

  return (
    <div
      className="border-box relative flex grow-2 flex-col items-start justify-start overflow-auto overflow-y-hidden border-[1px] bg-white hover:bg-gray-100"
      style={{ width: `${100 / 7}%` }}
    >
      <span
        id={`input-${date}`}
        className="bg-colorPrimary flex w-full items-center justify-center p-1 text-center text-sm font-semibold text-white"
      >
        {date}
      </span>

      <div className="flex w-full flex-row text-[10px]">
        {/* Hour Labels */}
        <div className="flex w-fit flex-shrink-0 flex-col gap-[1px]">
          {hours.map((hour) => (
            <p key={hour} className="w-8 flex-shrink-0 border-[1px]">
              {hour}:00
            </p>
          ))}
        </div>

        {/* Booked Stocks */}
        <div className="scrollbar-none flex w-full flex-col gap-[1px] overflow-auto text-[10px]">
          {hours.map((hour) => {
            const thisDateInMS = new Date(
              currYear,
              currMonth,
              date,
              hour,
            ).getTime();
            const bookedStocks = checkDate(stocksDetail, thisDateInMS);
            return (
              <div key={hour} className="flex h-full w-full gap-[2px]">
                {renderBookedStocks(bookedStocks)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DialogSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-center text-sm font-semibold">{title}</p>
    <div className="flex flex-col gap-1">{children}</div>
  </div>
);

const DialogRow = ({
  label,
  value,
}: {
  label: string | undefined;
  value: string | undefined;
}) => (
  <p className="flex flex-row justify-between capitalize">
    <span className="text-slate-600">{label}</span>
    <span className={`${getStatusStyle(value as string)} text-right`}>
      {value}
    </span>
  </p>
);

const BookingDetailDialog = ({
  bookingDetailProps,
  onClose,
}: {
  bookingDetailProps: {
    isOpen: boolean;
    orderId: string;
    bookingData: StoreProductBookingType | null;
  };
  onClose: () => void;
}) => {
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["orderData", bookingDetailProps.orderId],
    queryFn: async (): Promise<ClientStoreOrderType | undefined> => {
      if (!bookingDetailProps.orderId) {
        return;
      }
      try {
        const { data } = await axios.get(
          `${APIEndpoint}/order/${bookingDetailProps.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-store-id": localStorage.getItem("STORE_ID"),
            },
          },
        );
        return data.order[0];
      } catch (error) {
        console.error("Error fetching order data:", error);
        return;
      }
    },
    enabled: !!bookingDetailProps.orderId,
  });

  return (
    <div
      id="booking-detail-dialog"
      className={`${bookingDetailProps.orderId || bookingDetailProps.isOpen ? "flex" : "hidden"} border-colorPrimary absolute flex h-fit w-[300px] flex-col gap-4 rounded-lg border-2 bg-white p-2 text-xs shadow-lg`}
    >
      <button
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        &times;
      </button>
      {isLoading ? (
        <p className="flex gap-2">
          <span className="animate-spin">
            {/* <AiOutlineLoading3Quarters /> */}
          </span>
          <span>Loading...</span>
        </p>
      ) : (
        <>
          <DialogSection title="Data Penyewa">
            <DialogRow
              label="Nama:"
              value={`${orderData?.billing?.firstName} ${orderData?.billing?.lastName}`}
            />
            <DialogRow label="Email:" value={orderData?.billing?.email} />
            <DialogRow
              label="Alamat:"
              value={`${orderData?.billing?.address?.street}, ${orderData?.billing?.address?.district}, ${orderData?.billing?.address?.city}`}
            />
          </DialogSection>
          <DialogSection title="Data Order">
            <DialogRow label="ID:" value={orderData?._id} />
            <DialogRow label="Status Order:" value={orderData?.status} />
            <DialogRow
              label="Status Pembayaran:"
              value={orderData?.paymentStatus}
            />

            <p className="flex flex-row justify-between capitalize">
              <span className="text-slate-600">Durasi Sewa:</span>
              <span className={`text-right`}>
                {moment
                  .duration(bookingDetailProps?.bookingData?.duration)
                  .asDays()}{" "}
                Hari
              </span>
            </p>
            <p className="flex flex-row justify-between capitalize">
              <span className="text-slate-600">Tanggal Mulai Sewa</span>
              <span className={`text-right`}>
                {moment(bookingDetailProps?.bookingData?.dateStart).format(
                  "DD MMMM YYYY",
                )}
              </span>
            </p>
            <p className="flex flex-row justify-between capitalize">
              <span className="text-slate-600">Tanggal Berakhir Sewa</span>
              <span className={`text-right`}>
                {moment(bookingDetailProps?.bookingData?.dateEnd).format(
                  "DD MMMM YYYY",
                )}
              </span>
            </p>
          </DialogSection>
        </>
      )}
    </div>
  );
};

const ProductBookingCalendar = ({
  stocksDetail,
}: {
  stocksDetail: ClientStoreProductStockType[];
}) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [bookingDetailProps, setBookingDetailProps] = useState<{
    isOpen: boolean;
    orderId: string;
    bookingData: StoreProductBookingType | null;
  }>({
    isOpen: false,
    orderId: "",
    bookingData: null,
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  const currMonth = currDate.getMonth();
  const currYear = currDate.getFullYear();

  const handleMonthChange = (step: number) => {
    setCurrDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + step);
      return newDate;
    });
  };

  const handleYearChange = (step: number) => {
    setCurrDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(newDate.getFullYear() + step);
      return newDate;
    });
  };

  const datesOfMonth = useMemo(() => {
    const lastDate = new Date(currYear, currMonth + 1, 0).getDate();
    const startDay = new Date(currYear, currMonth, 1).getDay();
    return [
      ...Array(startDay).fill(null),
      ...Array.from({ length: lastDate }, (_, i) => i + 1),
    ];
  }, [currMonth, currYear]);

  const checkDate = useCallback(
    (
      stocksArray: ClientStoreProductStockType[],
      dateInput: number,
    ): StoreProductBookingType[] => {
      if (!stocksArray) return [];

      return stocksArray.flatMap((stock) => {
        const { stockBookingDetails } = stock;

        if (!stockBookingDetails) {
          // Return a default object if stockBookingDetails is missing
          return [
            {
              belongToStockId: "DEFAULT_0",
              _id: "",
              dateEnd: 0,
              dateStart: 0,
              duration: 0,
            },
          ];
        }

        const filteredDetails = stockBookingDetails.filter(
          ({ dateStart, dateEnd }) =>
            dateInput >= dateStart && dateInput <= dateEnd,
        );

        // If no details match the filter, return a default object
        if (filteredDetails.length === 0) {
          return [
            {
              belongToStockId: "DEFAULT_0",
              _id: "",
              dateEnd: 0,
              dateStart: 0,
              duration: 0,
            },
          ];
        }

        return filteredDetails;
      });
    },
    [],
  );

  const openBookingDetail = (
    e: MouseEvent<HTMLElement>,
    bookingData: StoreProductBookingType,
  ) => {
    e.preventDefault();
    const sameOrderElements = document.querySelectorAll(
      `[data-orderid='${bookingData.fromOrderId}']`,
    );
    sameOrderElements.forEach((el) => el.classList.add("highlight-border"));

    setBookingDetailProps({
      isOpen: true,
      orderId: bookingData.fromOrderId as string,
      bookingData,
    });

    const target = e.target as HTMLElement;
    const targetRect = target.getBoundingClientRect();
    const calendar = calendarRef.current;
    const bookingDialog = document.getElementById("booking-detail-dialog");

    if (!calendar || !bookingDialog) return;

    const parentRect = calendar.getBoundingClientRect();

    const left = targetRect.left - parentRect.left + 50;
    const top = targetRect.top - parentRect.top + 95;

    bookingDialog.style.position = "absolute";
    bookingDialog.style.left = `${left}px`;
    bookingDialog.style.top = `${top}px`;
  };

  const closeBookingDetail = () => {
    const highlightedElements = document.querySelectorAll(".highlight-border");
    highlightedElements.forEach((el) =>
      el.classList.remove("highlight-border"),
    );
    setBookingDetailProps({ isOpen: false, orderId: "", bookingData: null });
  };

  return (
    <div className="phone:w-[180%] relative h-full rounded-lg bg-white p-4 shadow-lg">
      {/* DATE NAVIGATOR */}
      <DateNavigator
        currMonth={currMonth}
        currYear={currYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />

      {/* DAYS NAMES */}
      <div className="name-of-days-wrapper text-colorPrimary flex flex-row justify-between py-1 font-semibold">
        {dayNames.map((day) => (
          <p key={day} style={{ width: `${100 / 7}%` }} className="text-center">
            {day}
          </p>
        ))}
      </div>

      {/* CALENDAR */}
      <div
        ref={calendarRef}
        className="calendar relative flex h-full flex-row flex-wrap pt-2 text-center"
      >
        {datesOfMonth.map((date, index) => (
          <DateCell
            key={index}
            date={date}
            currYear={currYear}
            currMonth={currMonth}
            stocksDetail={stocksDetail}
            checkDate={checkDate}
            openBookingDetail={openBookingDetail}
            closeBookingDetail={closeBookingDetail}
          />
        ))}
      </div>
      <BookingDetailDialog
        bookingDetailProps={bookingDetailProps}
        onClose={closeBookingDetail}
      />
    </div>
  );
};

export default ProductBookingCalendar;
