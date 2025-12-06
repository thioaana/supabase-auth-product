"use client";

import Link from "next/link";
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

      <div className="d-flex ms-auto">
        <ul className="navbar-nav align-items-center gap-3">
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
