"use client";
import { ColumnDef } from "@tanstack/react-table";
import customerPlaceholder from "@/app/assets/img/icon/customer-placeholder.webp";
import moment from "moment";
import Link from "next/link";
import { ClientStoreUserType } from "@/app/lib/types/store_user_type";
import { ImageWithFallback } from "@/app/lib/components/ImageWithFallback";

const membershipContentGenerator = (membershipId: string) => {
  switch (membershipId.toLowerCase()) {
    case "membership_01":
      return (
        <p className="w-40 rounded-md bg-teal-400 px-2 py-1 text-center text-xs font-medium text-white">
          Member Rentalaja
        </p>
      );
    case "staff_membership":
      return (
        <p className="w-40 rounded-md bg-blue-800 px-2 py-1 text-center text-xs font-medium text-white">
          Staff Rentalaja
        </p>
      );
    default:
      return (
        <p className="w-40 rounded-md bg-yellow-500 px-2 py-1 text-center text-xs font-medium text-white">
          Non Member
        </p>
      );
  }
};

export const getColumns = (): ColumnDef<ClientStoreUserType>[] => {
  return [
    {
      accessorKey: "number",
      header: () => {
        return <p className="text-center text-xs">No.</p>;
      },
      cell: ({ row }) => {
        const value = row.index + 1;
        return <p className="text-center text-xs">{value}</p>;
      },
    },
    {
      accessorKey: "userFullname",
      header: () => {
        return <p className="text-xs">Nama User</p>;
      },
      cell: ({ row }) => {
        const userFullname = `${row.original.globalUserDetails?.firstName} ${row.original.globalUserDetails?.lastName}`;
        const createdAt = row.original.globalUserDetails?.createdAt;
        const profileImg = row.original.globalUserDetails?.profilePic?.link;
        return (
          <div className="flex flex-row gap-2 text-xs">
            <ImageWithFallback
              alt="profile"
              src={profileImg as string}
              fallbackSrc={customerPlaceholder.src}
              width={50}
              height={50}
            />

            <div className="flex flex-col items-start justify-center">
              <Link
                href={`./user/${row.original._id}`}
                target="__blank"
                className="cursor-pointer font-semibold text-blue-400 underline"
              >
                {userFullname}
              </Link>
              <p className="text-[10px] text-slate-600">
                <span>Dibuat:</span>{" "}
                <span className="italic">
                  {moment(createdAt).format("DD MMMM YYYY")}
                </span>
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => {
        return <p className="text-xs">Email</p>;
      },
      cell: ({ row }) => {
        const value = `${row.original.globalUserDetails?.email}`;
        return <p className="text-xs">{value}</p>;
      },
    },
    {
      accessorKey: "telephone",
      header: () => {
        return <p className="text-xs">Telepon</p>;
      },
      cell: ({ row }) => {
        const value = `${row.original.globalUserDetails?.telephone}`;
        return <p className="text-xs">{value}</p>;
      },
    },
    {
      accessorKey: "membershipId",
      header: () => {
        return <p className="text-xs">Membership</p>;
      },
      cell: ({ row }) => {
        const value = `${row.original.globalUserDetails?.membershipId}`;
        return membershipContentGenerator(value);
      },
    },
  ];
};
