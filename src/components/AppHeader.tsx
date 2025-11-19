import React from "react";
import { User } from "../types";
import logo3 from "../assets/logo3.1.png"; // 👈 usamos logo3

export function AppHeader({
  currentUser,
  onLogout,
}: {
  currentUser: User | null;
  onLogout: () => void;
}) {
  return (
    <header className="app-header">
      <div className="container header-grid">
        <div className="brand">
          <img src={logo3} alt="Digital Contact Center Colombia" />
          <span>DIGITAL CONTACT CENTER S.A.S</span>
        </div>

        <div className="header-actions">
          {currentUser && (
            <>
              <span>
                {currentUser.name} — {String(currentUser.role).toUpperCase()}
              </span>
              <button className="btn" onClick={onLogout}>
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
