import React from "react";
import "./app.css";
import { Login } from "./pages/Login";

type Role = "asesor" | "back" | "admin";
type User = { id:string; name:string; role:Role };


export default function AppShell({
  currentUser,
  onLogout,
  active = "inicio",
  onNavigate,
  children
}:{
  currentUser: User | null;
  onLogout: ()=>void;
  active?: "inicio"|"reportes"|"recursos";
  onNavigate?: (to:"inicio"|"reportes"|"recursos")=>void;
  children: React.ReactNode;
}){
  const roleClass =
    currentUser?.role === "admin" ? "role-admin" :
    currentUser?.role === "back"  ? "role-back"  : "role-asesor";

  return (
    <>
      <header className="app-header">
        <div className="header-grid container">
          <div className="brand">
            <span>DCC</span>
            <div className="dots" aria-hidden>
              <span className="dot y"></span>
              <span className="dot b"></span>
              <span className="dot r"></span>
            </div>
          </div>

          <nav className="header-nav">
            <a className={active==="inicio" ? "active": ""}  href="#" onClick={(e)=>{e.preventDefault();onNavigate?.("inicio")}}>Inicio</a>
            <a className={active==="reportes" ? "active": ""} href="#" onClick={(e)=>{e.preventDefault();onNavigate?.("reportes")}}>Reportes</a>
            <a className={active==="recursos" ? "active": ""} href="#" onClick={(e)=>{e.preventDefault();onNavigate?.("recursos")}}>Recursos</a>
          </nav>

          <div className="header-actions">
            {currentUser && (
              <>
                <span className={`role-badge ${roleClass}`}>{currentUser.role.toUpperCase()}</span>
                <span className="badge">
                  <span className="avatar">{currentUser.name?.[0] || "U"}</span>
                  {currentUser.name}
                </span>
                <button className="btn small" onClick={onLogout}>Salir</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        {children}
      </main>
    </>
  );
}
