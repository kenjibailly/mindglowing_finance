import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import Nav from "../../components/Nav";
import SettingsNav from "../../components/SettingsNav";
import Header from "../../components/header/Header";
import Customization from "../../components/settings/customization/Customization";
import NotFound from "../../components/NotFound";

const CustomizationSettingsRoutes: RouteObject[] = [
  {
    path: "/settings/customization",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Customization" />
          <Customization />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default CustomizationSettingsRoutes;
