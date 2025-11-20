import React from "react";
import { usePersistentState } from "./hooks/usePersistentState";
import { Sale, User } from "./types";
import { LoginEnhanced } from "./pages/LoginEnhanced";
import { AppHeader } from "./components/AppHeader";
import { AsesorView } from "./pages/AsesorView";
import { BackOfficeView } from "./pages/BackOfficeView";
import { USERS } from "./data/users";
import { saveSales } from "./lib/sales";
import { supabase } from "./lib/supabase";

import "./app.css";

const LS_USER = "dcc_user_v1";
const LS_SALES = "dcc_sales_v2";

export default function App() {
  const [currentUser, setCurrentUser] = usePersistentState<User | null>(
    LS_USER,
    null
  );

  const [sales, setSales] = usePersistentState<Sale[]>(LS_SALES, []);

  // Efecto para cargar las ventas y suscribirse a cambios.
  // Se ejecuta solo cuando `currentUser` cambia y no es nulo.
  React.useEffect(() => {
    // No hacer nada si no hay un usuario logueado.
    if (!currentUser) {
      setSales([]); // Opcional: limpiar las ventas al desloguear.
      return;
    }

    const fetchSales = async () => {
      try {
        const { data, error, status } = await supabase
          .from("ventas")
          .select("*")
          .order("fecha", { ascending: false });

        if (error) {
          console.error("Error cargando ventas desde Supabase:", error, "Status:", status);
          // Si el error es por RLS o auth, podría ser señal de una sesión inválida.
          if (error.code === 'PGRST301' || status === 401) {
             console.log("Sesión inválida detectada, deslogueando.");
             setCurrentUser(null);
          }
          return;
        }

        console.log("Ventas desde Supabase:", data);
        const remoteSales = (data ?? []) as Sale[];
        setSales(remoteSales);
      } catch (e) {
        console.error("Error inesperado cargando ventas:", e);
      }
    };

    fetchSales(); // Carga inicial porque ya sabemos que hay un usuario.

    const channel = supabase
      .channel('realtime-ventas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ventas' },
        (payload) => {
          console.log('Cambio detectado en ventas, recargando...');
          fetchSales(); // Recargar ventas cuando hay un cambio.
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Limpiar la suscripción.
    };
  }, [currentUser, setSales, setCurrentUser]);

  const logout = () => setCurrentUser(null);

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
