'use client'

import React from "react";
import { useRouter } from "next/navigation";
import SupervizProvider from "@/app/userPage/SupervizProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;
const queryClient = new QueryClient()

export default function Activations() {
  const [ userEmail, setUserEmail ] = React.useState<string>()
  const router = useRouter()
  
  React.useEffect(() => {
    if(window) {
      const storedEmail = localStorage.getItem(USERDATA_KEY)
      if(storedEmail === null) return
      
      setUserEmail(JSON.parse(storedEmail))
    }
  }, [])


  return userEmail !== undefined ? (
    <QueryClientProvider client={queryClient}>
      <SupervizProvider userEmail={userEmail} />
    </QueryClientProvider>
  ) : 
  (
    <></>
  )
}