import Image from "next/image";
import Button from "@/components/Button";
import fenderImg from "../../../public/fender-lego.png";
import React from "react";
import {activations, users} from "@/data/activationsData";
import CardLink from "@/components/CardLink";
import User from "@/components/User";

export default function Activations() {


  return (
    <>
      <div className="my-5 pb-5 w-screen border-b border-[#ffffff1a]">
        <User user={users[0]} withActivations={true} withUsername={true} withStar={false} />
      </div>
      <p className="w-full text-center font-normal text-lg">Escolha uma ativação para participar</p>
      {activations.map(activation => (
        <div key={activation.color} className="w-full">
          <CardLink activation={activation} />
        </div>
      ))}
    </>
  )
}