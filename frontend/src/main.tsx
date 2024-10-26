import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Setup from "./components/Setup";
import Dashboard from "./components/Dashboard";
import Customers from "./components/customers/Customers";
import Nav from "./components/Nav";
import Header from "./components/header/Header";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";
import "./stylesheets/style.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/logout",
    element: (
      <ProtectedRoute>
        <Logout />
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
