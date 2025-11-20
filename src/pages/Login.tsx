
import React from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";


export function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [cedula, setCedula] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Llama a tu función de Supabase por CÉDULA
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="cedula">Cédula</label>
            <input
              id="cedula"
              className="input"
              inputMode="numeric"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
              placeholder="Solo números"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
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
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
