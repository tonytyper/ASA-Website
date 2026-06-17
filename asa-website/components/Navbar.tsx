"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
        <a href="#hero" className="nav-logo">
            <Image
                src="/ASA_logo.png"
                alt="Armenian Student Association at UNLV logo"
                width={379}
                height={384}
            />
            <span className="nav-logo-text">ASA of UNLV</span>
        </a>
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