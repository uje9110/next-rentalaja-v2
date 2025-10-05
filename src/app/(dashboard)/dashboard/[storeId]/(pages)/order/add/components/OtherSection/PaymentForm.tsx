/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import PaymentDialog from "./PaymentDialog";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreOrderType } from "@/app/lib/types/store_order_type";
import { GlobalCouponType } from "@/app/lib/types/global_coupon_type";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { StoreOrderBillingType } from "@/app/lib/types/store_order_billing_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

type PaymentFormTypes = {
  orderData: StoreOrderType;
  setOrderData: Dispatch<SetStateAction<StoreOrderType>>;
  billingData: StoreOrderBillingType;
};

// const paymentMethods = [
//   {
//     title: "Transfer Bank",
//     value: "Transfer Bank Langsung",
//     desc: "Transfer ke akun di bawah ini dengan jumlah total yang tertera di atas, no rekening akan tertera pada email setelah melakukan checkout",
//   },
//   {
//     title: "Bayar di Toko",
//     value: "Pembayaran di Toko",
//     desc: "Silahkan bayar biaya sewa saat pengambilan barang di toko kami",
//   },
// ];

const PaymentForm: FC<PaymentFormTypes> = ({
  orderData,
  setOrderData,
  billingData,
}) => {
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();
  if (!session) return;

  const [paymentData, setPaymentData] = useState({
    paymentAmount: 0,
    paymentMethod: "",
    paymentType: "",
  });

  const [couponString, setCouponString] = useState<string>("");
  const [coupons, setCoupons] = useState<GlobalCouponType[]>([]);

  const [membershipData, setMembershipData] = useState({
    membershipName: "",
    membershipDesc: "",
    membershipDiscount: "",
  });

  const handleManualPaymentChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "paymentAmount" && paymentData.paymentType !== "Denda") {
      const maxValue = orderData.total;

      // Ensure the value is numeric before applying Math.min
      const numericValue = Number(value);

      // Ensure the value does not exceed the max or fall below the min
      const newValue = Math.min(Math.max(numericValue, 0), maxValue); // Also ensures value doesn't go below 0
      setPaymentData((prevState) => {
        return {
          ...prevState,
          [name]: newValue,
        };
      });
    } else {
      setPaymentData((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  const handleAddPaymentToOrder = async () => {
    setOrderData((prevState) => {
      return {
        ...prevState,
        paymentRequest: paymentData,
      };
    });
  };

  const addDiscount = (couponsData: GlobalCouponType) => {
    const isDiscountExist = coupons.some(
      (couponObj) => couponObj._id === couponsData._id,
    );

    // Check if there is already a discount with availableWithOther = false
    const isNonStackableDiscountExist = coupons.some(
      (couponObj) => !couponObj.isAvailableWithOther,
    );

    // Don't add if the discount already exists
    if (isDiscountExist) {
      return; // No need to update state if discount is already present
    }

    // If the new discount has availableWithOther = false, replace all coupons with this one
    if (!couponsData.isAvailableWithOther) {
      setCoupons([couponsData]);
      return; // We replace all coupons and stop here
    }

    // If there's an existing non-stackable discount, prevent adding new coupons
    if (isNonStackableDiscountExist) {
      return; // Don't add the new discount
    }

    // Check if the new discount is still valid (based on couponExpire)
    const TodayDateInMS = Date.now();
    const couponExpireDateInMS = Number(couponsData.couponExpire);

    if (TodayDateInMS < couponExpireDateInMS) {
      setCoupons([...coupons, couponsData]); // Add new discount if it is still valid
    } else {
      setCoupons([...coupons]); // Just set current coupons (no new discount added)
    }
  };

  const handleCouponInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCouponString(value);
  };

  const handleCouponSubmit = async () => {
    try {
      const couponResponse = await axios.get(
        `${APIEndpoint}/all/coupon/${couponString}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        },
      );
      const couponData = couponResponse.data;
      if (couponResponse.status === 200) {
        addDiscount(couponData);
      } else {
        toast.warning(`Kupon tidak bisa digunakan`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error dalam penggunaan kupon`);
    }
  };

  const membershipDiscountValue = async () => {
    const couponResponse = await axios.get(
      `${APIEndpoint}/coupon/${membershipData.membershipDiscount}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
          "x-store-id": localStorage.getItem("STORE_ID"),
        },
      },
    );
    const couponData = couponResponse.data.coupon;
    addDiscount(couponData);
  };

  const getMembership = async () => {
    const membershipEndpoint = `${APIEndpoint}/membership/${billingData.membershipId}`;
    const response = await axios.get(membershipEndpoint, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "x-store-id": localStorage.getItem("STORE_ID"),
      },
    });
    setMembershipData(response.data.membership);
  };

  useEffect(() => {
    if (!billingData.membershipId) {
      return;
    }
    getMembership();
  }, [billingData]);

  useEffect(() => {
    if (!billingData.membershipId) {
      return;
    }
    membershipDiscountValue();
  }, [membershipData]);

  return (
    <div className="flex h-fit w-full flex-col gap-6 rounded-lg border border-slate-400/50 bg-white p-4">
      <h3 className="font text-lg font-semibold">3. Informasi Pembayaran</h3>

      {/* COUPON INPUT */}
      {/* <div className="row-wrapper flex w-full flex-col justify-between gap-2">
        <h3 className="text-md font-semibold">Tambah Coupon</h3>
        <div className="row-wrapper flex w-full flex-col justify-between gap-2">
          <div className="flex w-full flex-col justify-between gap-2">
            <label className="text-sm text-slate-500" htmlFor="paymentMethod">
              Kode Kupon
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                id="paymentMethod"
                name="paymentMethod"
                onChange={(e) => handleCouponInputChange(e)}
                className="border-colorPrimary/40 w-3/4 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
              />
              <button
                className="bg-colorSecondary w-1/4 rounded-lg font-semibold text-white"
                onClick={() => handleCouponSubmit()}
              >
                Gunakan
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* PAYMENTS */}
      {/* <div className="row-wrapper flex w-full flex-col justify-between gap-2">
        <h3 className="font text-sm font-semibold">Pembayaran</h3>
        <div className="flex flex-wrap gap-4">
          <div
            className="flex w-1/3 flex-col items-center justify-center gap-4 rounded-lg border-2 border-blue-400 p-4"
            onClick={handleOpenPaymentModal}
          >
            <span className="text-2xl">
              <Plus size={14} />
            </span>
            <p className="text-xs">Tambahkan Pembayaran</p>
          </div>
        </div>
      </div> */}

      {/* <PaymentDialog
        orderData={orderData}
        setOrderData={setOrderData}
        handleManualPaymentChange={handleManualPaymentChange}
        paymentData={paymentData}
        session={session}
      /> */}
      <div className="modalBody h-full">
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="inputs-wrapper flex flex-col gap-4">
            <div className="item-input-wrapper flex flex-row items-center justify-between gap-2">
              <label htmlFor="paymentMethod" className="w-[48%] font-semibold">
                Metode Pembayaran
              </label>
              <select
                defaultValue=""
                name="paymentMethod"
                id="paymentMethod"
                className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
                onChange={(e) => {
                  handleManualPaymentChange(e);
                }}
              >
                <option value="">Pilih Metode Pembayaran</option>
                <option value="Cash">Cash</option>
                {/* <option value="BCA_VA">BCA Virtual Account</option> */}
                <option value="QRIS">QRIS</option>
              </select>
            </div>
            <div className="item-input-wrapper flex flex-row items-center justify-between gap-2">
              <label htmlFor="paymentType" className="w-[48%] font-semibold">
                Tipe Pembayaran
              </label>
              <select
                defaultValue=""
                name="paymentType"
                id="paymentType"
                className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
                onChange={(e) => {
                  handleManualPaymentChange(e);
                }}
              >
                <option value="">Pilih Tipe Pembayaran</option>
                <option value="partial-payment">Uang Muka</option>
                <option value="full-payment">Pelunasan</option>
              </select>
            </div>
            <div className="item-input-wrapper flex flex-row items-center justify-between gap-2">
              <label htmlFor="paymentAmount" className="w-[48%] font-semibold">
                Nominal
              </label>
              <div className="relative w-full bg-white">
                <input
                  placeholder="Contoh: Rp.20.000"
                  required
                  min={0}
                  max={orderData?.total}
                  value={paymentData.paymentAmount}
                  name="paymentAmount"
                  id="paymentAmount"
                  type="number"
                  className="w-full rounded-md border-2 px-2 py-1 text-white"
                  onChange={(e) => handleManualPaymentChange(e)}
                />
                <span className="absolute top-1/2 left-2 -translate-y-1/2 text-black">
                  {paymentData.paymentAmount
                    ? CurrencyHandlers.changeToLocaleCurrency(
                        paymentData.paymentAmount,
                      )
                    : ""}
                </span>
              </div>
            </div>
          </div>

          <button
            className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white"
            onClick={() => {
              handleAddPaymentToOrder();
            }}
          >
            Tambahkan Cash In
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
