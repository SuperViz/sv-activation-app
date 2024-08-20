import Link from "next/link";

interface IButtonProps {
  text: string
  type: 'button' | 'link'
  linkTo?: string
  onClick?: () => void
}

export default function Button({ text, linkTo, type, onClick }: IButtonProps) {
  if (type === 'link' && linkTo) {
    return (
      <Link 
        href={linkTo} 
        className="w-full mb-6 py-5 rounded-full bg-[#6210CC] text-white font-bold flex justify-center text-xl"
      >
        {text}
      </Link>
      
    )
  }
  
  return (
    <button 
      onClick={onClick}
      className="w-full mb-6 py-5 rounded-full bg-[#6210CC] text-white font-bold flex justify-center text-xl"
    >
      {text}
    </button>
  )
} 