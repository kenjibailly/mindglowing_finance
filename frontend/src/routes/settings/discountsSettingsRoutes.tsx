import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import Nav from "../../components/Nav";
import SettingsNav from "../../components/SettingsNav";
import Header from "../../components/header/Header";
import NotFound from "../../components/NotFound";
import Discounts from "../../components/settings/discounts/Discounts";
import Discount from "../../components/settings/discounts/Discount";
import CreateDiscount from "../../components/settings/discounts/CreateDiscount";
import EditDiscount from "../../components/settings/discounts/EditDiscount";

const discountsSettingsRoutes: RouteObject[] = [
  {
    path: "/settings/discounts",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Discounts" />
          <Discounts />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/discounts/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Discount" />
          <Discount />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/discounts/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Create Discount" />
          <CreateDiscount />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/settings/discounts/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <SettingsNav />
          <Header title="Edit Discount" />
          <EditDiscount />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default discountsSettingsRoutes;
