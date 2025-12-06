"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/logout-button";

interface NavBarClientProps {
  isLoggedIn: boolean;
}

export function NavBarClient({ isLoggedIn }: NavBarClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-md navbar-dark px-3" style={{ backgroundColor: "#343a40" }}>
      <Link href="/" className="navbar-brand fw-bold">
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

      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto align-items-center gap-2">
          <li className="nav-item">
            <Link href="/new-proposal" className="nav-link" onClick={() => setIsOpen(false)}>
              New Proposal
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link href="/auth/login" className="nav-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
