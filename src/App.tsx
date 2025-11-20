import React from "react";
import { usePersistentState } from "./hooks/usePersistentState";
import { Sale, User } from "./types";
import { LoginEnhanced } from "./pages/LoginEnhanced";
import { AppHeader } from "./components/AppHeader";
import { AsesorView } from "./pages/AsesorView";
import { BackOfficeView } from "./pages/BackOfficeView";
import { USERS } from "./data/users";
import { fetchSalesFromSupabase, saveSales } from "./lib/sales";

import "./app.css";

const LS_USER = "dcc_user_v1";
const LS_SALES = "dcc_sales_v2";

export default function App() {
  const [currentUser, setCurrentUser] = usePersistentState<User | null>(
    LS_USER,
    null
  );

  // Arrancamos con lo que haya en localStorage (por si no hay internet)
  const [sales, setSales] = usePersistentState<Sale[]>(LS_SALES, []);

  // Cargar SIEMPRE las ventas desde Supabase al montar la app
  React.useEffect(() => {
    (async () => {
      try {
        const remoteSales = await fetchSalesFromSupabase();

        console.log("Ventas cargadas desde Supabase:", remoteSales.length);

        // Si Supabase devolvió algo, sobreescribimos el estado local
        if (remoteSales.length > 0) {
          setSales(remoteSales);
          saveSales(remoteSales); // actualizamos cache localStorage
        }
      } catch (e) {
        console.error("Error cargando ventas desde Supabase:", e);
      }
    })();
  }, [setSales]);

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
