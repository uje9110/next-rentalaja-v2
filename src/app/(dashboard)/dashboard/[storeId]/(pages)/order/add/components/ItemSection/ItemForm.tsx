/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ItemFormItemModal from "./ItemFormItemModal";
import { StoreOrderType } from "@/app/lib/types/store_order_type";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreProductType } from "@/app/lib/types/store_product_type";
import { Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ItemFormType {
  itemData: StoreOrderItemType;
  setOrderData: Dispatch<SetStateAction<StoreOrderType>>;
}

const ItemForm: FC<ItemFormType> = ({ setOrderData, itemData }) => {
  const { APIEndpoint } = useAPIContext();
  const { storeId } = useParams();
  const { data: session } = useSession();
  if (!session) return;

  const [isItemDialogOpen, setIsItemDialogOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<StoreProductType[]>([]);
  const [currentItem, setCurrentItem] = useState<StoreOrderItemType>(itemData);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [itemDetail, setItemDetail] = useState<
    StoreProductType | null | undefined
  >();

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const productEndpoint = `${APIEndpoint}/product/store?search=${searchTerm}`;
    const getProducts = async () => {
      const response = await axios.get(productEndpoint, {
        headers: {
          "x-store-id": storeId,
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      const data = response.data;
      setProducts(data.products);
    };
    getProducts();
  };

  const handleResetSearchTerm = () => {
    setSearchTerm("");
    const productEndpoint = `${APIEndpoint}/products`;
    const getProducts = async () => {
      const response = await axios.get(productEndpoint);
      const data = response.data;
      setProducts(data.products);
    };
    getProducts();
  };

  const handleItemModal = (itemID: string, itemName: string) => {
    setIsItemDialogOpen(true);
    setCurrentItem({ ...currentItem, itemID: itemID, itemName: itemName });
  };

  const getProducts = async () => {
    const response = await axios.get(`${APIEndpoint}/product?limit=4`, {
      headers: {
        "x-store-id": storeId,
        Authorization: `Bearer ${session.user.token}`,
      },
    });
    setProducts(response.data.json);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="border-accent-custom flex h-fit w-full flex-col rounded-md border bg-white">
      <h3 className="bg-sky-100 px-4 py-2 text-sm font-semibold">Pilih Item</h3>
      <div
        className={`phone:flex phone:gap-2 flex w-full flex-row flex-wrap gap-4 overflow-auto px-4 py-2`}
      >
        <div className="search-input flex h-fit w-full items-center gap-1">
          <form onSubmit={(e) => handleSearchSubmit(e)} className="w-full">
            <div className="relative w-full">
              <input
                type="text"
                onChange={(e) => handleSearchInput(e)}
                value={searchTerm}
                className="border-accent-custom w-full rounded-full border bg-white px-4 py-2 text-sm shadow-sm"
              />
              <button
                className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs text-white"
                type="submit"
              >
                <Search size={14} />
              </button>
            </div>
          </form>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-lg text-white"
            onClick={handleResetSearchTerm}
          >
            <X size={14} />
          </button>
        </div>
        <div className="grid w-full grid-cols-2 gap-2">
          {products.map((product) => {
            const { primaryImage, title, _id } = product;
            return (
              <div
                key={_id}
                style={{
                  backgroundImage: `url("${primaryImage.link}")`,
                  backgroundSize: "cover",
                  height: "16rem",
                }}
                className="phone:h-32 relative flex h-64 grow flex-col items-start justify-end overflow-hidden rounded-lg object-cover p-4 shadow-lg after:absolute after:top-0 after:left-0 after:z-10 after:h-full after:w-full after:bg-gradient-to-b after:from-blue-200/10 after:via-slate-500/10 after:to-slate-900"
                onClick={() => handleItemModal(_id, title)}
              >
                <h3 className="relative z-20 font-semibold text-white">
                  {title}
                </h3>
              </div>
            );
          })}
        </div>
        <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
          <DialogContent className="w-4/6">
            <DialogTitle>{currentItem.itemName}</DialogTitle>
            <ItemFormItemModal
              currentItem={currentItem}
              itemDetail={itemDetail}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ItemForm;
