// components/FilterSelect.tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterSelectProps = {
  value: string;
  placeholder: string;
  icon?: React.ReactNode;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
};

export default function ProductFilterSelect({
  value,
  placeholder,
  icon,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-colorSecondary/50 phone:text-xs lg:phone:sm flex w-full items-center gap-2 rounded-md border-2 px-2 py-1 text-sm">
        {
          <>
            {icon}
            <SelectValue placeholder={placeholder} />
          </>
        }
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
