"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

interface NavBarClientProps {
  isLoggedIn: boolean;
}

export function NavBarClient({ isLoggedIn }: NavBarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-md navbar-dark px-3" style={{ backgroundColor: "#343a40" }}>
      <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
        <Image src="/logo.png" alt="Agro Logo" width={32} height={32} />
        Agro
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="navbar-collapse"
        id="navbarNav"
        style={{
          display: isOpen ? 'flex' : undefined,
        }}
      >
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          <li className="nav-item">
            <Link href="/new-proposal" className="nav-link" style={{ color: "white" }} onClick={() => setIsOpen(false)}>
              New Proposal
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/dashboard" className="nav-link" style={{ color: "white" }} onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button>Login</Button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
