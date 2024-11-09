import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import Customers from "../components/customers/Customers";
import Customer from "../components/customers/Customer";
import CreateCustomer from "../components/customers/CreateCustomer";
import EditCustomer from "../components/customers/EditCustomer";
import NotFound from "../components/NotFound";

const CustomerRoutes: RouteObject[] = [
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Customers" />
          <Customers />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/customers/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Customer" />
          <Customer />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/customers/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Create Customer" />
          <CreateCustomer />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/customers/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Edit Customer" />
          <EditCustomer />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default CustomerRoutes;
