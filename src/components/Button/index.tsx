import Link from "next/link";

interface IButtonProps {
  text: string
  type: 'button' | 'link'
  disabled?: boolean
  linkTo?: string
  onClick?: () => void
  classes?: string
}

export default function Button({ text, linkTo, disabled, type, onClick, classes }: IButtonProps) {
  if (type === 'link' && linkTo) {
    return (
      <Link
        href={linkTo}
        className={`w-full py-5 rounded-full bg-[#6210CC] text-white font-bold flex justify-center text-xl ${classes}`}
      >
        {text}
      </Link>

    )
  }

  return (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      className={`w-full py-5 rounded-full bg-[#6210CC] text-white font-bold flex justify-center text-xl disabled:opacity-50 stick bottom-3 ${classes}`}
    >
      {text}
    </button>
  )
} 