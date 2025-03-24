'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import LogoutForm from './LogoutForm';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark border-bottom">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">Room Booking</Link>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleMenu} 
                    aria-controls="navbarNav" 
                    aria-expanded={isOpen}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-white" href="/">Dashboard</Link>
                        </li>

                        {(true) ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" href="/admin/buildings">Buildings</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" href="/admin/rooms">Rooms</Link>
                                </li>
                                <li className="nav-item">
                                    <LogoutForm />
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link text-white" href="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
