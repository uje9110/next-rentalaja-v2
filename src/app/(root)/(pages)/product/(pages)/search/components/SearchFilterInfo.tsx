// app/product/search/components/FilterInfo.tsx
"use client";

import React from "react";

type SearchFilterInfoProps = {
  filters: {
    bookingStart?: string;
    bookingEnd?: string;
    categoriesIds?: string[] | string;
    storeId?: string;
  };
};

// Simple date formatter → "12 September 2025"
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

const SearchFilterInfo: React.FC<SearchFilterInfoProps> = ({ filters }) => {
  const { bookingStart, bookingEnd, categoriesIds, storeId } = filters;

  const parts: string[] = [];

  if (bookingStart && bookingEnd) {
    parts.push(
      `Menampilkan produk yang tersedia dari ${formatDate(
        bookingStart,
      )} sampai ${formatDate(bookingEnd)}`,
    );
  }

  if (
    categoriesIds &&
    (Array.isArray(categoriesIds) ? categoriesIds.length : true)
  ) {
    const categoriesText = Array.isArray(categoriesIds)
      ? categoriesIds.join(", ")
      : categoriesIds;
    parts.push(`dengan kategori: ${categoriesText}`);
  }

  if (storeId) {
    const storeName = storeId
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    parts.push(`di ${storeName}`);
  }

  if (parts.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Menampilkan semua produk yang tersedia.
      </p>
    );
  }

  return <p className="text-sm text-gray-500">{parts.join(", ")}.</p>;
};

export default SearchFilterInfo;
