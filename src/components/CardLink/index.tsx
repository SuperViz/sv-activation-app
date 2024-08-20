import {IActivation} from "../../../types";
import Link from "next/link";

interface ILinkProps {
  activation: IActivation
}
export default function CardLink({ activation }: ILinkProps) {
  
  
  return (
    <Link
      href={activation.link}
      className="mt-5 p-5 w-full rounded-2xl bg-[#C9C4D11A] flex flex-col justify-center items-center">
      <span className="h-0 w-[40px] border-t-[5px] mb-2" style={{borderColor: `#${activation.color}`}}>{''}</span>
      <p className="text-white text-2xl font-bold">{activation.description}</p>
      <p className="text-2xl font-bold" style={{color: `#${activation.color}`}}>{activation.activationWord}</p>
      {activation.subtext && (
        <p className="mt-1 text-white text-base font-bold">{`${activation.subtext.description} `}
        <span className="text-base font-bold" style={{color: `#${activation.color}`}}>{activation.subtext.activationWord}</span></p>
  )
}
</Link>
)
}