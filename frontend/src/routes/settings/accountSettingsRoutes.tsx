import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import Nav from "../../components/Nav";
import SettingsNav from "../../components/SettingsNav";
import Header from "../../components/header/Header";
import Account from "../../components/settings/account/Account";
import NotFound from "../../components/NotFound";

const accountSettingsRoutes: RouteObject[] = [
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

export default accountSettingsRoutes;
