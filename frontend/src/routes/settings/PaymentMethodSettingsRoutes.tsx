import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import Nav from "../../components/Nav";
import SettingsNav from "../../components/SettingsNav";
import Header from "../../components/header/Header";
import NotFound from "../../components/NotFound";
import PaymentMethods from "../../components/settings/payment-methods/PaymentMethods";
import EditPaymentMethod from "../../components/settings/payment-methods/EditPaymentMethod";
import PaymentMethod from "../../components/settings/payment-methods/PaymentMethod";
import CreatePaymentMethod from "../../components/settings/payment-methods/CreatePaymentMethod";

const PaymentMethodSettingsRoutes: RouteObject[] = [
  {
    path: "/settings/payment-methods",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Payment Methods" />
          <PaymentMethods />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/payment-methods/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Edit Payment Method" />
          <EditPaymentMethod />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/payment-methods/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Payment Method" />
          <PaymentMethod />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/payment-methods/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Create Payment Method" />
          <CreatePaymentMethod />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default PaymentMethodSettingsRoutes;
