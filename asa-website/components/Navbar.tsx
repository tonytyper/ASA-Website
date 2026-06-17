"use client"

import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
        <div className="nav-logo">ASA of UNLV<span></span></div>
        <ul className={isOpen ? "nav-links open" : "nav-links"} id="navLinks">
            <li><a href="#about">About</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#officers">Officers</a></li>
            <li><a href="#contact">Join Us</a></li>
        </ul>
        <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span></span><span></span><span></span>
        </div>
    </nav>
  )
}