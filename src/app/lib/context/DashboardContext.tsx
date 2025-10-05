import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAPIContext } from "./ApiContext";
import { BookingOverdueNotificationType } from "../types/store_booking_overdue_type";

export type DashboardContextType = {
  notificationLength: number;
  setNotificationLength: Dispatch<SetStateAction<number>>;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

const DashboardContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const { APIEndpoint } = useAPIContext();

  const [notificationLength, setNotificationLength] = useState(0);

  useQuery({
    queryKey: ["notification"],
    queryFn: async (): Promise<BookingOverdueNotificationType[] | []> => {
      try {
        const response = await axios.get(
          `${APIEndpoint}/notification/overdue_bookings`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-store-id": localStorage.getItem("STORE_ID"),
            },
          },
        );
        setNotificationLength(response.data.overdueBookingNotifications.length);
        return response.data.overdueBookingNotifications;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    refetchInterval: 60 * 1000,
  });

  return (
    <DashboardContext.Provider
      value={{
        notificationLength,
        setNotificationLength,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardContextProvider",
    );
  }
  return context;
};

export { DashboardContextProvider, useDashboardContext };
