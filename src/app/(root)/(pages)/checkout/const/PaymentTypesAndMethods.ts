export const paymentMethods = [
  // {
  //   title: "BCA Virtual Account",
  //   value: "BCA_VA",
  //   desc: "Pembayaran menggunakan BCA Virtual Account akan dikenakan biaya sebesar Rp. 4.500",
  // },
  {
    title: "QRIS",
    value: "QRIS",
    desc: "Pembayaran menggunakan code QRIS",
  },
  {
    title: "Pembayaran di Toko",
    value: "Cash",
    desc: "Silahkan bayar biaya sewa saat pengambilan barang di toko kami",
  },
] as const;

export const paymentTypes = [
  {
    title: "Pembayaran lunas",
    value: "full-payment",
    desc: "Anda langsung melunasi semua biaya pesanan.",
  },
  {
    title: "Pembayaran Booking",
    value: "partial-payment",
    desc: "Pembayaran booking akan dikenakan biaya sebesar 20% dari jumlah total booking. ",
  },
] as const;
