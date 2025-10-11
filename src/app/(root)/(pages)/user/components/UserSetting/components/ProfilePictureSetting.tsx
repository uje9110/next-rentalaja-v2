import axios from "axios";
import { Plus } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

type ProfileSettingType = {
  session: Session;
  profilePic: string | null;
  setProfilePic: Dispatch<SetStateAction<string | null>>;
  APIEndpoint: string;
};

const ProfileSetting: React.FC<ProfileSettingType> = ({
  session,
  profilePic,
  setProfilePic,
  APIEndpoint,
}) => {
  const router = useRouter();
  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return; // Prevent errors if no file is selected

    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);

    setProfilePic(objectUrl);

    // Clean up old object URLs when a new one is set
    return () => URL.revokeObjectURL(objectUrl);
  };

  const uploadProfilePic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = document.getElementById("uploadProfile") as HTMLFormElement;
      const formData = new FormData(form);
      const response = await axios.patch(
        `${APIEndpoint}/user/changeprofile/${session.user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        },
      );
      if (response.status === 200) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      window.alert("error");
    }
  };

  const openImageInput = () => {
    const imageInput = document.getElementById("profilePic");
    if (!imageInput) {
      return;
    }
    imageInput.click();
  };

  return (
    <form
      id="uploadProfile"
      onSubmit={(e) => uploadProfilePic(e)}
      className="transition-opacity duration-500"
    >
      <div className="input-wrapper relative flex w-full flex-col justify-between gap-4">
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-cover"
          id="profilePicPreview"
        >
          <input
            onChange={(e) => handleProfilePic(e)}
            type="file"
            name="profilePic"
            id="profilePic"
            className="profilePic border-colorPrimary/40 hidden rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <div
            style={{ backgroundImage: `url(${profilePic})` }}
            className="flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-sky-400/50 bg-cover"
            onClick={() => openImageInput()}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/50">
              <span className="text-white">
                <Plus size={14} />
              </span>
            </span>
            <span className="text-center text-xs">
              Upload Gambar <br /> Profile
            </span>
          </div>
          <button
            type="submit"
            className="bg-colorSecondary flex flex-row items-center justify-center gap-2 rounded-md p-2 text-white"
          >
            <Plus size={14} /> Upload Foto Profile
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileSetting;
