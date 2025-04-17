'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import LogoutForm from './LogoutForm';
import { useAuth } from './AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const { authenticated } = useAuth();

    return (
        <nav className="border-b bg-black border-[#575757] bg-opacity-50">
            <div className="max-w-screen-xl flex flex-wrap mx-auto p-4 justify-between items-center">
                <Link href="/">Room Booking</Link>

                <button 
                    onClick={toggleMenu} 
                    type="button" 
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-transparent focus:ring-gray-600" 
                    aria-controls="navbar-default" 
                    aria-expanded={isOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>

                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-opacity-50 bg-black md:bg-black border-gray-700">
                        <li>
                            <Link href="/" className="block py-2 px-3 rounded-sm md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                                Dashboard
                            </Link>
                        </li>
                        
                        {(authenticated)?<>
                            <li>
                                <Link href="/admin/buildings" className="block py-2 px-3 rounded-sm md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                                    Buildings
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/rooms" className="block py-2 px-3 rounded-sm md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                                    Rooms
                                </Link>
                            </li>
                            <li><LogoutForm/></li>
                        </>:
                        <li>
                            <Link href="/login" className="block py-2 px-3 rounded-sm md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">
                                Login
                            </Link>
                        </li>}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;