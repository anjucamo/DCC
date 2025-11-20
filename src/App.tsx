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

  // 👉 Ya NO usamos loadSales: arrancamos vacío y cargamos desde Supabase
  const [sales, setSales] = usePersistentState<Sale[]>(LS_SALES, []);

  // 👉 Cargar SIEMPRE las ventas desde Supabase al montar la app
  React.useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("sales")          // nombre de tu tabla en Supabase
          .select("*")
          .order("fecha", { ascending: false });

        if (error) {
          console.error("Error cargando ventas desde Supabase:", error);
          return;
        }

        if (data) {
          setSales(data as Sale[]);
        }
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
