"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { FC } from "react";
import { ClientCheckoutType } from "../types/client_checkout_type";

type CheckoutBillingPreviewProps = {
  checkout: ClientCheckoutType;
};

const fieldLabels: Record<string, string> = {
  isAccountAlreadyMade: "Sudah Punya Akun",
  firstName: "Nama Depan",
  lastName: "Nama Belakang",
  email: "Email",
  telephone: "Nomor Telepon",
  socialMedia: "Media Sosial",
};

const CheckoutBillingPreview: FC<CheckoutBillingPreviewProps> = ({
  checkout,
}) => {
  const billing = checkout.billing;

  return (
    <Card className="border-accent-custom w-full overflow-hidden rounded-md p-0 pb-4 shadow-sm">
      <CardHeader className="gap-0 bg-sky-100 px-4 py-2">
        <CardTitle className="text-sm">Order Billing</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-xs">
        {Object.entries(billing).map(([key, value]) => {
          if (!value) return null;
          return (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{fieldLabels[key] ?? key}</span>
              <span className="text-muted-foreground text-right">{value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CheckoutBillingPreview;
