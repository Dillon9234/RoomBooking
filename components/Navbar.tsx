import Link from 'next/link'
import React from 'react'
import LogoutForm from './LogoutForm'
import { getSession } from '@/utils/actions'

const Navbar = async () => {
    const session = await getSession()
  return (
    <div>
        <Link href="/admin/building">Buildings</Link>
        <Link href="/admin/room">Rooms</Link>
        <Link href="/admin/login">Login</Link>
        {session.isLoggedIn && <LogoutForm/>}
    </div>
  )
}

export default Navbar