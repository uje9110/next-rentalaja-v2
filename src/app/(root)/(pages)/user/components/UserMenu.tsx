import { ImageWithFallback } from "@/app/lib/components/ImageWithFallback";
import { Session } from "next-auth";
import ImagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";
import { UserMenuData } from "../const/UserMenuData";

type UserMenuProps = {
  session: Session;
  handleMenu: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UserMenu: React.FC<UserMenuProps> = ({ session, handleMenu }) => {
  return (
    <div className="shadow-defaultShadow w-full rounded-lg bg-white p-4 lg:w-[90%]">
      <div className="flex h-20 w-full flex-row gap-4">
        <ImageWithFallback
          alt={session.user.firstName}
          src={session.user.profilePic.link}
          width={100}
          height={100}
          className="aspect-square h-14 w-14 rounded-full object-cover"
          fallbackSrc={ImagePlaceholder.src}
        />
        <div className="flex h-14 w-full flex-col">
          <span className="text-colorPrimary text-lg font-semibold">
            Hey {session.user.firstName}
          </span>
          <span className="text-sm text-gray-400">
            Rentalaja lagi ada promo lho!
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-2 lg:flex lg:flex-col lg:justify-center">
        {UserMenuData.map((menu, index) => {
          const { title, link, icon } = menu;
          return (
            <a
              key={index}
              href={link}
              className="relative flex w-full flex-row justify-start gap-2 lg:w-full"
            >
              <input
                type="radio"
                value={title}
                name="menu"
                id={`menu-${index}`}
                className="peer absolute top-[50%] left-[50%] z-10 -translate-x-[50%] -translate-y-[50%] opacity-0"
                onChange={(e) => handleMenu(e)}
              />
              <label
                htmlFor={`menu-${index}`}
                className="user-menu peer-checked:border-colorPrimary lg:peer-checked:bg-colorPrimary relative z-20 flex w-full cursor-pointer flex-row justify-center gap-2 p-2 peer-checked:border-b-2 peer-checked:*:block lg:w-full lg:justify-start lg:rounded-md lg:peer-checked:text-white"
              >
                <span className="flex-col items-center justify-center text-2xl">
                  {icon}
                </span>
                <p className="hidden self-center text-sm lg:block">{title}</p>
              </label>
            </a>
          );
        })}
      </div>
    </div>
  );
};
