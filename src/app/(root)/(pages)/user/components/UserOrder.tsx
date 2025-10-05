/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { Session } from "next-auth";
import { OrderByUserType } from "@/app/lib/types/store_order_type";
import { ChevronDown, Store } from "lucide-react";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

interface UserOrderType {
  session: Session;
  APIEndpoint: string;
  userOrders: OrderByUserType | [];
  setUserOrders: Dispatch<SetStateAction<OrderByUserType | []>>;
}

const UserOrder: React.FC<UserOrderType> = ({
  userOrders,
  setUserOrders,
  APIEndpoint,
  session,
}) => {
  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await axios.get(
        `${APIEndpoint}/order/user/${session.user.email}`,
        {
          headers: {
            authorization: `Bearer ${session.user.token}`,
          },
        },
      );
      const orderData = response.data.orders;
      setUserOrders(orderData);
    };

    fetchOrderData();
  }, []);
  return (
    <div className="bg-defaultBackground flex w-full flex-col gap-4 lg:gap-6">
      {userOrders.map((order) => {
        const { storeDetail, orders } = order;
        return (
          <div key={`${storeDetail.storeId}`}>
            <p className="flex items-center gap-2 border-b-2 p-4 py-2">
              <span className="text-colorSecondary">
                <Store size={14} />
              </span>
              <span className="font-semibold">{storeDetail.storeName}</span>
            </p>
            <div className="flex w-full flex-col gap-4">
              {orders.map((thisOrder) => {
                const { createdAt, items, status, subtotal, _id } = thisOrder;
                const orderDate = new Date(createdAt as Date);
                return (
                  <div
                    className="flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md"
                    key={`${storeDetail.storeId}-${_id}`}
                  >
                    <div className="flex flex-row justify-between gap-2 border-b-[1px] border-gray-300 pb-3">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-light text-gray-500">
                          Status
                        </span>
                        <h3 className="font-semibold uppercase">{status}</h3>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-light text-gray-500">
                          Tanggal Order
                        </span>
                        <p className="text-sm text-gray-400">{`${moment(orderDate).format("DD MMMM YYYY, HH:mm")}`}</p>
                      </div>
                    </div>
                    <div className="flex w-full flex-row justify-between">
                      <p>{items.length} Items</p>
                      <p>{CurrencyHandlers.changeToLocaleCurrency(subtotal)}</p>
                    </div>
                    <div
                      className="hidden py-2"
                      id={`order-detail-${storeDetail.storeId}-${_id}`}
                    >
                      <table className="w-full table-auto text-sm">
                        <tbody>
                          {items.map((item, index) => {
                            const { itemName, itemAmount, itemSubtotal } = item;
                            return (
                              <tr key={index}>
                                <td>
                                  <p>{index + 1}.</p>
                                </td>
                                <td>{itemName}</td>
                                <td>x{itemAmount}</td>
                                <td className="text-end">
                                  {CurrencyHandlers.changeToLocaleCurrency(
                                    itemSubtotal,
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* DETAIL BUTTON */}
                    <a
                      className="flex w-full flex-row items-center justify-center gap-2"
                      href={`/checkout/${storeDetail.storeId}:${_id}`}
                      target="__blank"
                      // onClick={() => handleOrderDetail(`${storeDetail.storeId}-${_id}`)}
                    >
                      <p className="cursor-pointer text-xs text-blue-500">
                        Lihat Detail{" "}
                      </p>
                      <ChevronDown
                        size={14}
                        className="cursor-pointer text-xs text-blue-500"
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserOrder;
