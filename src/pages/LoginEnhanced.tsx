// src/pages/LoginEnhanced.tsx
import React from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";

import logo3 from "../assets/logo3.png";


export function LoginEnhanced({ onLogin }: { onLogin: (u: User) => void }) {
  const [cedula, setCedula] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Llamada a la función de Supabase por CÉDULA
      const { data, error } = await supabase.rpc("app_login_cedula", {
        p_cedula: cedula,
        p_password: password,
      });

      if (error) throw new Error(error.message);

      const row: any = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error("Credenciales inválidas");

      const role =
        row.role === "ADMIN" ? "admin" : row.role === "BACK" ? "back" : "asesor";

      onLogin({
        id: row.id,
        role,
        name: row.fullName || "Usuario",
        email: `${row.cedula || cedula}@dcc.local`,
        password: "",
        sala: "0",
      });
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="auth">
    <div className="auth-card">
      {/* Columna izquierda (solo texto, sin logo) */}
     <div className="auth-left">
  <div className="brand">

    <img src={logo3} alt="Digital Contact Center Colombia" />
    
   
  </div>

  <div className="auth-left-footer">
    <div className="dots">
      <span className="dot y" />
      <span className="dot b" />
      <span className="dot r" />
    </div>
    <span>
      © {new Date().getFullYear()} DCC Colombia. Todos los derechos
      reservados.
    </span>
  </div>
</div>


      {/* Columna derecha (logo + formulario, como antes) */}
      <div className="auth-right">
        <div className="auth-logo">
          
        </div>

        <h1 className="auth-title">Bienvenido de nuevo</h1>
        <p className="auth-subtitle">
          Ingresa tus credenciales para continuar
        </p>

        <form className="auth-form" onSubmit={submit}>
          <div>
            <label className="label" htmlFor="cedula">
              Cédula
            </label>
            <input
              id="cedula"
              className="input"
              inputMode="numeric"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
              placeholder="Solo números"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="btn primary auth-button"
            disabled={loading || !cedula || !password}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  </div>
);

}
