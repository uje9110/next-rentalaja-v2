import axios from "axios";
import React from "react";
import { Session } from "next-auth";
import { MessageCircleWarning } from "lucide-react";

type IsUserVerifiedInfoType = {
  session: Session;
  AuthEndpoint: string;
};

const IsUserVerifiedInfo: React.FC<IsUserVerifiedInfoType> = ({
  session,
  AuthEndpoint,
}) => {
  // SEND VERIFICATION EMAIL
  const handleRequestVerification = async () => {
    const emailVerificationLink = `${AuthEndpoint}/sendverificationemail?email=${session.user.email}`;
    try {
      const emailRes = await axios.get(emailVerificationLink);
      if (emailRes.status === 200) {
        window.alert(emailRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full gap-2 rounded-lg border-2 border-green-200 bg-green-200/70 p-2 text-sm">
      <span className="flex items-center justify-center text-2xl">
        <MessageCircleWarning size={14} />
      </span>
      <p>
        Email kamu belum terverifikasi, klik&nbsp;
        <span
          className="cursor-pointer font-semibold text-blue-700"
          onClick={handleRequestVerification}
        >
          di sini
        </span>
        &nbsp; untuk memverifikasi email kamu.
      </p>
    </div>
  );
};

export default IsUserVerifiedInfo;
