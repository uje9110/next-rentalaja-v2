import {
  ScrollText,
  Box,
  UserRound,
  Ticket,
  Banknote,
  ChartArea,
  BadgeDollarSign,
  LucideIcon,
  Bell,
} from "lucide-react";

export type MenuItem = {
  title: string;
  link: string;
  icon: LucideIcon;
  isActive: boolean;
  subItems?: {
    title: string;
    link: string;
    isActive: boolean;
  }[];
};

export function useDashboardSidebar({ storeId }: { storeId: string }) {
  const SidebarMenuAdmin: MenuItem[] = [
    {
      title: `dashboard`,
      link: `/dashboard/${storeId}/.`,
      isActive: true,
      icon: Bell,
    },
    {
      title: `order`,
      link: `/dashboard/${storeId}/order`,
      isActive: true,
      icon: ScrollText,
      subItems: [
        {
          title: `tambah order`,
          link: `/dashboard/${storeId}/order/add`,
          isActive: false,
        },
      ],
    },
    {
      title: `product`,
      link: `/dashboard/${storeId}/product`,
      isActive: true,
      icon: Box,
      subItems: [
        {
          title: `tambah produk`,
          link: `/dashboard/${storeId}/product/add`,
          isActive: false,
        },
      ],
    },
    {
      title: `user`,
      link: `/dashboard/${storeId}/user`,
      isActive: true,
      icon: UserRound,
    },
    {
      title: `coupon`,
      link: `/dashboard/${storeId}/coupon`,
      isActive: true,
      icon: Ticket,
    },
    {
      title: `payment`,
      link: `/dashboard/${storeId}/payment`,
      isActive: true,
      icon: Banknote,
      subItems: [
        {
          title: `Non Cash`,
          link: `/dashboard/${storeId}/payment/noncash`,
          isActive: false,
        },
        {
          title: `Cash`,
          link: `/dashboard/${storeId}/payment/cash`,
          isActive: false,
        },
      ],
    },
    {
      title: `sales`,
      link: `/dashboard/${storeId}/sales`,
      isActive: true,
      icon: BadgeDollarSign,
    },
    {
      title: `analytic`,
      link: `/dashboard/${storeId}/analytic`,
      isActive: true,
      icon: ChartArea,
    },
  ];

  const SidebarMenuCashier: MenuItem[] = [
    {
      title: `dashboard`,
      link: `/dashboard/${storeId}/${storeId}/.`,
      isActive: true,
      icon: Bell,
    },
    {
      title: `order`,
      link: `/dashboard/${storeId}/${storeId}/order`,
      isActive: true,
      icon: ScrollText,
      subItems: [
        {
          title: `tambah order`,
          link: `/dashboard/${storeId}/order/add`,
          isActive: false,
        },
      ],
    },
    {
      title: `products`,
      link: `/dashboard/${storeId}/products`,
      isActive: true,
      icon: Box,
      subItems: [
        {
          title: `tambah produk`,
          link: `/dashboard/${storeId}/product/add`,
          isActive: false,
        },
      ],
    },
    {
      title: `user`,
      link: `/dashboard/${storeId}/user`,
      isActive: true,
      icon: UserRound,
    },
    {
      title: `payment`,
      link: `/dashboard/${storeId}/payment`,
      isActive: true,
      icon: Banknote,
    },
  ];

  const SidebarMenuCustomerService: MenuItem[] = [
    {
      title: `dashboard`,
      link: `/dashboard/${storeId}/${storeId}/.`,
      isActive: true,
      icon: Bell,
    },
    {
      title: `order`,
      link: `/dashboard/${storeId}/${storeId}/order`,
      isActive: true,
      icon: ScrollText,
      subItems: [
        {
          title: `tambah order`,
          link: `/dashboard/${storeId}/order/add`,
          isActive: false,
        },
      ],
    },
    {
      title: `products`,
      link: `/dashboard/${storeId}/products`,
      isActive: true,
      icon: Box,
      subItems: [
        {
          title: `tambah produk`,
          link: `/dashboard/${storeId}/product/add`,
          isActive: false,
        },
      ],
    },
    {
      title: `user`,
      link: `/dashboard/${storeId}/user`,
      isActive: true,
      icon: UserRound,
    },
  ];

  return { SidebarMenuAdmin, SidebarMenuCashier, SidebarMenuCustomerService };
}
