
import React from "react";
import { User } from "../types";

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
        <div className="brand">DCC</div>
        <div style={{ flex: 1 }} />
        {currentUser && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>
              {currentUser.name} — {String(currentUser.role).toUpperCase()}
            </span>
            <button className="btn" onClick={onLogout}>
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
