"use client";

import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CheckoutBillingProp = {
  hasAccount: string | null;
  setHasAccount: Dispatch<SetStateAction<"yes" | "no" >>;
  handleCheckoutBillingChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const CheckoutBilling: FC<CheckoutBillingProp> = ({
  hasAccount,
  setHasAccount,
  handleCheckoutBillingChange,
}) => {
  return (
    <Card className="border-accent-custom w-full gap-0 overflow-hidden rounded-md py-0 shadow-sm">
      <CardHeader className="gap-0 bg-sky-100 px-4 py-2">
        <CardTitle className="text-sm">Informasi Akun</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        {/* Langkah 1: Tanya apakah sudah punya akun */}
        <div className="space-y-2">
          <Label>Apakah Anda sudah memiliki akun?</Label>
          <RadioGroup
            onValueChange={(val) => setHasAccount(val as "yes" | "no")}
            value={hasAccount ?? ""}
            className="flex gap-3"
          >
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  "cursor-pointer rounded-sm border px-4 py-1 text-sm font-medium transition-all",
                  "flex items-center justify-center gap-2",
                  hasAccount === option.value
                    ? "border-teal-400 bg-teal-400 text-white shadow-md"
                    : "border-accent-custom bg-white hover:bg-teal-50",
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="hidden"
                />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Langkah 2a: Jika sudah punya akun */}
        {hasAccount === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="email">Akun Terdaftar</Label>
            <Input
              id="email"
              name="email"
              placeholder="Masukkan email terdaftar Anda"
              className="border-accent-custom text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-sky-200"
              onChange={(e) => {
                handleCheckoutBillingChange(e);
              }}
            />
          </div>
        )}

        {/* Langkah 2b: Jika belum punya akun */}
        {hasAccount === "no" && (
          <div className="space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <Label htmlFor="firstName">Nama Depan</Label>
              <Input
                onChange={(e) => {
                  handleCheckoutBillingChange(e);
                }}
                className="border-accent-custom text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-sky-200"
                id="firstName"
                name="firstName"
                placeholder="Budi"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="lastName">Nama Belakang</Label>
              <Input
                onChange={(e) => {
                  handleCheckoutBillingChange(e);
                }}
                className="border-accent-custom text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-sky-200"
                id="lastName"
                name="lastName"
                placeholder="Santoso"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={(e) => {
                  handleCheckoutBillingChange(e);
                }}
                className="border-accent-custom text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-sky-200"
                id="email"
                name="email"
                type="email"
                placeholder="anda@email.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="telephone">Nomor Telepon</Label>
              <Input
                onChange={(e) => {
                  handleCheckoutBillingChange(e);
                }}
                className="border-accent-custom text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-sky-200"
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="+62 812-3456-7890"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="socialMedia">Media Sosial</Label>
              <Input
                onChange={(e) => {
                  handleCheckoutBillingChange(e);
                }}
                className="border-accent-custom text-sm focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-sky-200"
                id="socialMedia"
                name="socialMedia"
                placeholder="@username"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
