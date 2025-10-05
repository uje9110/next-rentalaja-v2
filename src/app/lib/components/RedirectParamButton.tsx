"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type RedirectWithParamsButton = {
  link: string;
};

export function RedirectWithParamsButton({ link }: RedirectWithParamsButton) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRedirect = () => {
    // Convert current searchParams to string
    const params = searchParams.toString();
    // Redirect to target page with existing params
    router.push(`/${link}?${params}`);
  };

  return <Button onClick={handleRedirect}>Go to New Page</Button>;
}
