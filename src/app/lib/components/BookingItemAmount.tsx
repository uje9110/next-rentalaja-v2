"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers2 } from "lucide-react";

export type BookingItemAmountProps = {
  availableStocks: string[];
  handleItemAmountChange: (value: string) => void;
};

const BookingItemAmount: React.FC<BookingItemAmountProps> = ({
  availableStocks,
  handleItemAmountChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="phone:gap-1 flex items-center gap-2">
        <Layers2 className="phone:w-4" />
        <h3 className="subheader-custom phone:text-sm">Pilih Tanggal Booking</h3>
      </div>
      <div className="flex flex-col gap-1">
        <Select
          onValueChange={(value) => {
            handleItemAmountChange(value);
          }}
        >
          <SelectTrigger className="border-colorPrimary/40 rounded-mdborder-2 border-accent-custom w-full bg-white text-sm shadow-sm">
            <SelectValue
              placeholder={
                availableStocks.length > 0
                  ? "Pilih Jumlah Item Yang Akan Disewa"
                  : "Item Tidak Tersedia Untuk Tanggal Yang Dipilih"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: availableStocks.length }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="pl-1 text-xs text-gray-500">
          Maks. (<span className="font-semibold">{availableStocks.length}</span>
          ) Unit bisa disewa dalam periode sewa yang dipilih.
        </p>
      </div>
    </div>
  );
};

export default BookingItemAmount;
