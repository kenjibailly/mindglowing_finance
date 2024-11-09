import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import Nav from "../../components/Nav";
import SettingsNav from "../../components/SettingsNav";
import Header from "../../components/header/Header";
import NotFound from "../../components/NotFound";
import Taxes from "../../components/settings/taxes/Taxes";
import EditTax from "../../components/settings/taxes/EditTax";
import Tax from "../../components/settings/taxes/Tax";
import CreateTax from "../../components/settings/taxes/CreateTax";

const TaxSettingsRoutes: RouteObject[] = [
  {
    path: "/settings/taxes",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Taxes" />
          <Taxes />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/taxes/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Edit Tax" />
          <EditTax />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/taxes/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Tax" />
          <Tax />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/taxes/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Create Tax" />
          <CreateTax />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default TaxSettingsRoutes;
