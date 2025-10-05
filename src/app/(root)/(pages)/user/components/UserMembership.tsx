"use client";

import { createTimeline, stagger } from "animejs";
import axios from "axios";
import { Session } from "next-auth";
import React, { Dispatch, SetStateAction, useEffect } from "react";

type UserMembershipType = {
  membership: Record<string, string>;
  setMembership: Dispatch<SetStateAction<Record<string, string>>>;
  text: string[];
  setText: Dispatch<SetStateAction<string[]>>;
  APIEndpoint: string;
  session: Session;
};

const UserMembership: React.FC<UserMembershipType> = ({
  membership,
  setMembership,
  text,
  setText,
  APIEndpoint,
  session,
}) => {
  useEffect(() => {
    const fetchMembership = async () => {
      const response = await axios.get(
        `${APIEndpoint}/membership/${session.user.membershipId}`,
        { headers: { Authorization: `Bearer ${session.user.token}` } },
      );
      setMembership(response.data.membership);
    };
    fetchMembership();
  }, []);

  useEffect(() => {
    createTimeline({ loop: true, alternate: true }).add(".item", {
      translateY: [
        { value: -10, easing: "easeOutSine", duration: 250 },
        { value: 0, easing: "easeOutQuad", duration: 500 },
      ],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: stagger(100),
    });
  }, [text]);

  useEffect(() => {
    setText(membership.membershipName.split(""));
  }, [membership]);

  return membership._id === "NO-MEMBERSHIP" ? (
    <div className="flex h-48 w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-xl">
      <h3 className="text-center">
        Kamu tidak memiliki langganan membership rentalaja
      </h3>
    </div>
  ) : (
    <div className="flex h-48 w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-xl">
      <div className="flex flex-row justify-between border-b-2 border-orange-400 pb-2">
        <div
          className="membershipName gap-0.4 relative flex text-3xl leading-none text-orange-400 uppercase"
          style={{ fontFamily: "'Jersey 15', 'sans-serif'" }}
        >
          {text.map((item, index) => {
            if (item === " ") {
              return (
                <div
                  key={`${index}-${item}`}
                  className="item px-1"
                  data-index={index}
                >
                  {item}
                </div>
              );
            }
            return (
              <div key={`${index}-${item}`} className="item" data-index={index}>
                {item}
              </div>
            );
          })}
        </div>
        <div
          className="flex flex-row items-end pb-1 text-xs uppercase"
          style={{ fontFamily: "Noto Sans Mono" }}
        >
          <span>ID:</span>
          {membership._id}
        </div>
      </div>
      <div>
        <p className="text-sm" style={{ fontFamily: "Noto Sans Mono" }}>
          {membership.membershipDesc}
        </p>
      </div>
    </div>
  );
};

export default UserMembership;
