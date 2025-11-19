import React from "react";
import { usePersistentState } from "./hooks/usePersistentState";
import { Sale, User } from "./types";
import { Login } from "./pages/Login";
import { AppHeader } from "./components/AppHeader";
import { AsesorView } from "./pages/AsesorView";
import { BackOfficeView } from "./pages/BackOfficeView";
import { USERS } from "./data/users";
import { loadSales, saveSales } from "./lib/sales";

import "./app.css";

const LS_USER = "dcc_user_v1";
const LS_SALES = "dcc_sales_v2";

export default function App() {
  const [currentUser, setCurrentUser] = usePersistentState<User | null>(
    LS_USER,
    null
  );
  const [sales, setSales] = usePersistentState<Sale[]>(LS_SALES, loadSales);

  const logout = () => setCurrentUser(null);

  return (
    <div>
      <AppHeader currentUser={currentUser} onLogout={logout} />
      {!currentUser ? (
        <Login onLogin={setCurrentUser} />
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