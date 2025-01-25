'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const LandingOptions = ({text, redirect}:{text:string, redirect:string}) => {

    const router = useRouter()

    const handleOnClick = () => {
        router.push(redirect)
    }

  return (
    <div className="bg-[#282828] 
      h-40 
      w-40 
      text-white
      rounded-md
      flex
      flex-col
      items-center
      justify-center
      font-mono
      cursor-pointer"
      onClick={handleOnClick}
      >
        {text}
    </div>
  )
}

export default LandingOptions