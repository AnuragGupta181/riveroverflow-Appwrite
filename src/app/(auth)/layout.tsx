"use client";

import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation";
import React from "react";
import { Ripple } from "@/components/magicui/ripple"; 

const Layout = ({children}: {children: React.ReactNode}) => {
  const {session} = useAuthStore();
  const router = useRouter()

  React.useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session, router])

  if (session) {
    return null
  }

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        Ripple
      </p>
      <Ripple />
    </div>
  )
}


export default Layout