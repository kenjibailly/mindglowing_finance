import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import NotFound from "../components/NotFound";
import Account from "../components/settings/Account";
import SettingsNav from "../components/SettingsNav";

const settingsRoutes: RouteObject[] = [
  {
    path: "/settings/account",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Account" />
          <Account />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default settingsRoutes;
