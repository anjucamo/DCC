// src/App.tsx
import React, { useEffect } from "react";
import { usePersistentState } from "./hooks/usePersistentState";
import { Sale, User } from "./types";

import { LoginEnhanced } from "./pages/LoginEnhanced";
import { AppHeader } from "./components/AppHeader";
import { AsesorView } from "./pages/AsesorView";
import { BackOfficeView } from "./pages/BackOfficeView";
import { USERS } from "./data/users";

import { supabase } from "./lib/supabase";
import { saveSales, fetchSalesFromSupabase } from "./lib/sales";

import "./app.css";

const LS_USER = "dcc_user_v1";
const LS_SALES = "dcc_sales_v2";

export default function App() {
  const [currentUser, setCurrentUser] = usePersistentState<User | null>(
    LS_USER,
    null
  );

  const [sales, setSales] = usePersistentState<Sale[]>(LS_SALES, []);

  /**
   * Cargar ventas desde Supabase y suscribirse a cambios en tiempo real.
   * Se ejecuta cada vez que cambia `currentUser`.
   */
  useEffect(() => {
    if (!currentUser) {
      // Si no hay usuario, limpiamos ventas y salimos
      setSales([]);
      saveSales([]);
      return;
    }

    const fetchRemoteSales = async () => {
      try {
        const remoteSales = await fetchSalesFromSupabase();
        setSales(remoteSales);
        saveSales(remoteSales);
        console.log("Ventas cargadas desde Supabase:", remoteSales);
      } catch (e) {
        console.error("Error cargando ventas (fetchRemoteSales):", e);
      }
    };

    // Carga inicial
    fetchRemoteSales();

    // Suscripción a cambios en la tabla ventas
    const channel = supabase
      .channel("realtime-ventas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ventas" },
        (payload) => {
          console.log("Cambio detectado en ventas, recargando...", payload);
          fetchRemoteSales();
        }
      )
      .subscribe();

    // Cleanup: quitar suscripción cuando cambia el usuario o se desmonta
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, setSales]);

  const logout = () => {
    setCurrentUser(null);
    setSales([]);
    saveSales([]);
  };

  return (
    <div>
      {currentUser && <AppHeader currentUser={currentUser} onLogout={logout} />}

      {!currentUser ? (
        <LoginEnhanced onLogin={setCurrentUser} />
      ) : currentUser.role === "asesor" ? (
        <AsesorView
          user={currentUser}
          sales={sales}
          setSales={(updater) => setSales((prev) => updater(prev))}
          saveSales={saveSales}
        />
      ) : (
        <BackOfficeView
          sales={sales}
          setSales={(updater) => setSales((prev) => updater(prev))}
          users={USERS}
          saveSales={saveSales}
        />
      )}
    </div>
  );
}
