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

  // Cargar SIEMPRE las ventas desde Supabase al montar la app
  React.useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("ventas")                // 👈 tu tabla real
          .select("crudo, fecha")        // leemos el json `crudo`
          .order("fecha", { ascending: false });

        if (error) {
          console.error("Error cargando ventas desde Supabase:", error);
          return;
        }

        // data es un array de filas con { crudo, fecha }
        const remoteSales: Sale[] = (data || [])
          .map((row: any) => row.crudo as Sale)
          .filter((s) => !!s && !!s.id);

        console.log("Ventas desde Supabase:", remoteSales);

        // SIEMPRE pisamos el estado local con lo que venga de Supabase (aunque esté vacío)
        setSales(remoteSales);
        saveSales(remoteSales);
      } catch (e) {
        console.error("Error inesperado cargando ventas:", e);
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
