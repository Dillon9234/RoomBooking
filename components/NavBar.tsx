'use client'

import { usePathname, useRouter } from "next/navigation"


const NavBar = () => {
    const router = useRouter()
    const curPath = usePathname()

    const handleOnClick = () => {
        router.push('./')
    }

  return (
    <nav className='bg-[#282828] w-full h-16 flex item-center'>
        {
            curPath === '/' ? 
            <></> :
            <div className='bg-yellow-400 rounded-md p-2 font-mono absolute top-3 left-3 cursor-pointer'
            onClick={handleOnClick}>
            Back
        </div>
        }
        
    </nav>
  )
}

export default NavBar