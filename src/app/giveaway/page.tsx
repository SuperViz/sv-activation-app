'use client'

import Button from "@/components/Button";
import React from "react";
import {sortWinner} from "@/app/services/sortWinner";
import Image from "next/image";
import fenderImg from "../../../public/fender-lego-right.png";
import winnerBadge from "../../../public/winner-badge.png";
import './Giveaway.scss'

enum giveAwayStatus {
  UNSORTED,
  SORTING,
  SORTED
}

export default function Sorter() {
  const [ giveAway, setGiveAway ] = React.useState(giveAwayStatus.UNSORTED)
  const [ winner, setWinner] = React.useState({
    user: '',
    coupon: '',
  })
  
  const handleClick = async () => {
    setGiveAway(giveAwayStatus.SORTING)
    const response = await sortWinner()
    
    setWinner({
      user: response.user.name,
      coupon: response.coupon.activation,
    })
  }
  
  const handleVideoEnd = () => {
    setGiveAway(giveAwayStatus.SORTED)
  }
  
  return (
    <div className={`bgTv w-full h-screen grid grid-cols-2`}>
      <div className={`col-span-1 h-screen flex flex-col relative justify-center items-center`}>
        <Image src="/logo-sm.svg" width={108} height={20} alt="Logo Superviz" className="w-[13.5rem] object-contain absolute top-[7.5rem] left-[7.5rem]" />
      {giveAway !== giveAwayStatus.SORTED && (
        <div className={`flex flex-col justify-center items-center`}>
          <h1 className="font-black text-[12.25rem] leading-[13.5rem] mb-[10rem] text-center">
            Sorteio <br/>LEGO<span className="text-[6rem] leading-[13.5rem] align-super">®  </span>
            Fender<span className="text-[6rem] leading-[13.5rem] align-super">®</span>
          </h1>
          {giveAway === giveAwayStatus.UNSORTED && (
            <Button text={`Sortear`} type={`button`} classes={`text-[4.5rem] py-[5rem] leading-[5.75rem]`}
                    onClick={handleClick}/>
          )}
          {giveAway === giveAwayStatus.SORTING && (
            <video autoPlay width={`580`} onEnded={handleVideoEnd}>
              <source src={`/contador-v3.mp4`} type={`video/mp4`} />
            </video>
          )}
        </div>
      )}
      {giveAway === giveAwayStatus.SORTED && (
       <div className={`flex flex-col justify-center items-center giveaway`}>
         <p className={`text-[4rem] font-bold mb-[4rem]`}>Parabéns!</p>
         <Image src={winnerBadge} alt={`Badge de ganhador`} />
         <div className={'flex items-center'}>
           <p className={`mt-[4.5rem] text-[9.7rem] text-[#957AFF] font-black break-words max-w-[100rem] text-center`}>
             {`{  `}
             <span className={`text-[8.75rem] text-white`}>{winner.user}</span> 
             {`  }`}
           </p>
         </div>
         <p className={'font-bold text-[4rem] mt-[7.5rem]'}>🎟️  Cupom sorteado: {winner.coupon}</p>
       </div> 
      )}
      </div>
      <div className={`bg-[#957AFF] col-span-1 m-10 rounded-[4rem] relative`}>
        <Image src={fenderImg} alt="Imagem de um Lego da Fender" className="absolute top-0 right-0 object-contain" />
      </div>
    </div>
  )
}