import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import Index from "../components/Index";
import Dashboard from "../components/Dashboard";

import NotFound from "../components/NotFound";
import Setup from "../components/Setup";

const customerRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Index />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Dashboard" />
          <Dashboard />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/setup",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Setup />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default customerRoutes;
