import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import Nav from "../../components/Nav";
import SettingsNav from "../../components/SettingsNav";
import Header from "../../components/header/Header";
import NotFound from "../../components/NotFound";
import ShippingCompanies from "../../components/settings/shipping-companies/ShippingCompanies";
import EditShippingCompany from "../../components/settings/shipping-companies/EditShippingCompany";
import ShippingCompany from "../../components/settings/shipping-companies/ShippingCompany";
import CreateShippingCompany from "../../components/settings/shipping-companies/CreateShippingCompany";

const ShippingCompanySettingsRoutes: RouteObject[] = [
  {
    path: "/settings/shipping-companies",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Shipping Companies" />
          <ShippingCompanies />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/shipping-companies/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Edit Shipping Company" />
          <EditShippingCompany />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/shipping-companies/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Shipping Company" />
          <ShippingCompany />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/shipping-companies/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Create Shipping Company" />
          <CreateShippingCompany />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default ShippingCompanySettingsRoutes;
