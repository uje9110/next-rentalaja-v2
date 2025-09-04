import Image from "next/image";
import emptyCart from "@/app/assets/img/Element/empty-cart.webp";

const EmptyCart = () => {
  return (
    <div className="bg-defaultBackground relative flex h-screen w-full flex-col items-center justify-center gap-4 p-4 pb-40">
      <div className="flex flex-col justify-center">
        <Image
          width={100}
          height={100}
          src={emptyCart}
          alt="Keranjang Kosong"
          className="w-[200px] self-center"
        />
        <h1 className="text-center text-lg font-semibold">
          Keranjang kamu kosong...
        </h1>
        <p className="text-md text-center font-light text-gray-400">
          Silahkan pilih item terlebih dahulu
        </p>
      </div>
    </div>
  );
};

export default EmptyCart;
