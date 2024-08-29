import {IActivation, IUserActivation} from "../../../types";
import Link from "next/link";
import ProgressIndicator from "@/components/CardLink/ProgressIndicator";

interface ILinkProps {
  activation: IActivation
  userActivation: IUserActivation | undefined
}
export default function CardLink({ activation, userActivation }: ILinkProps) {
  const userCompletedActivation = userActivation ? userActivation.completed : false
  console.log('activation', activation)
  console.log('userActivation', userActivation)
  
  
  const completedCheckmark = () => {
    return (
      <div>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill={`#${activation.color}`}/>
          <rect width="22.6667" height="22.6667" transform="translate(4.66504 4.66406)" fill={`#${activation.color}`}/>
          <path
            d="M10.2973 14.6066L13.837 18.3579L21.3926 10.332L23.2532 12.0811L13.837 22.0753L8.44238 16.35L10.2973 14.6066Z"
            fill="black" stroke="black" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  }
  
  return (
    <Link
      href={activation.page}
      className={`mt-5 p-5 w-full rounded-2xl flex justify-between items-center ${userCompletedActivation ? 'bg-[#C9C4D108]' : 'bg-[#C9C4D11A]'}`}>
      <div className={`${userCompletedActivation ? 'opacity-15' : 'opacity-1'}`}>
        <p className="text-white text-2xl font-bold">{activation.description}</p>
        <p className="text-2xl font-bold" style={{color: `#${activation.color}`}}>{activation.activationWord}</p>
        {activation.subtext && (
          <p className="mt-1 text-white text-base font-bold">{`${activation.subtext.description} `}
            <span className="text-base font-bold"
                  style={{color: `#${activation.color}`}}>{activation.subtext.activationWord}</span></p>
        )}
      </div>
      {userCompletedActivation ?
        completedCheckmark() :
        userActivation?.quantity ?
          <ProgressIndicator quantity={userActivation.quantity} color={activation.color} /> :
          <></>
      }
    </Link>
  )
}