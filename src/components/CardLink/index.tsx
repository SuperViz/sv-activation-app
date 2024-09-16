"use client";

import { createActivation } from "@/app/services/createActivation";
import { IActivation, IUser, IUserActivation } from "../../../types";
import ProgressIndicator from "@/components/CardLink/ProgressIndicator";
import { ActivationType, ActivationTypePage } from "@/global/global.types";

interface ILinkProps {
  activation: IActivation;
  userActivation: IUserActivation | undefined;
  user: IUser;
  page: ActivationTypePage;
  setPage: (page: ActivationTypePage) => void;
}
export default function CardLink({
  activation,
  userActivation,
  user,
  setPage,
  page,
}: ILinkProps) {
  const userCompletedActivation = userActivation
    ? userActivation.completed
    : false;

  const handleClick = () => {
    if (userCompletedActivation) return;

    createActivation({
      name: activation.id,
      userEmail: user.email,
    }).then(() => {
      if (page === ActivationTypePage.HACKATHON) {
        const url = "https://47xzvrbdgjk.typeform.com/to/cqzci1gD"
        const newWindow = window.open(url, "_blank");

        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          window.location.href = url;
        }

        return;
      }

      if (page === ActivationTypePage.GITHUB) {
        const url = "https://github.com/SuperViz/superviz"
        const newWindow = window.open(url, "_blank");

        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          window.location.href = url;
        }

        return;
      }

      setPage(activation.page);
    });
  };

  const completedCheckmark = () => {
    return (
      <div>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill={`#${activation.color}`} />
          <rect
            width="22.6667"
            height="22.6667"
            transform="translate(4.66504 4.66406)"
            fill={`#${activation.color}`}
          />
          <path
            d="M10.2973 14.6066L13.837 18.3579L21.3926 10.332L23.2532 12.0811L13.837 22.0753L8.44238 16.35L10.2973 14.6066Z"
            fill="black"
            stroke="black"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`mt-5 p-5 w-full rounded-2xl flex justify-between items-center ${userCompletedActivation ? "bg-[#C9C4D108]" : "bg-[#C9C4D11A]"
        }`}
    >
      <div
        className={`${userCompletedActivation ? "opacity-15" : "opacity-1"
          } text-left`}
      >
        <p className="text-white text-2xl font-bold">
          {activation.description}
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: `#${activation.color}` }}
        >
          {activation.activationWord}
        </p>
        {activation.subtext && (
          <p className="mt-1 text-white text-base font-bold">
            {`${activation.subtext.description} `}
            <span
              className="text-base font-bold"
              style={{ color: `#${activation.color}` }}
            >
              {activation.subtext.activationWord}
            </span>
          </p>
        )}
      </div>
      {userCompletedActivation ? (
        completedCheckmark()
      ) : activation.id === ActivationType.GAME && userActivation ? (
        <ProgressIndicator
          quantity={userActivation.quantity || 0}
          color={activation.color}
        />
      ) : (
        <></>
      )}
    </button>
  );
}
