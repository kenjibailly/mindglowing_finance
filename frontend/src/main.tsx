import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Setup from "./components/Setup";
import Dashboard from "./components/Dashboard";
import Customers from "./components/customers/Customers";
import Nav from "./components/Nav";
import Header from "./components/header/Header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./stylesheets/style.css";
import NotFound from "./components/NotFound";
import Security from "./components/Security";
import { AuthProvider } from "./components/context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Security />
        <App />
      </>
    ),
    errorElement: (
      <>
        <NotFound />,
        <Security />
      </>
    ),
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: (
      <>
        <NotFound />,
        <Security />
      </>
    ),
  },
  {
    path: "/logout",
    element: (
      <>
        <Security />
        <Logout />
      </>
    ),
    errorElement: (
      <>
        <NotFound />,
        <Security />
      </>
    ),
  },
  {
    path: "/setup",
    element: (
      <div className="dashboard-outer-wrapper">
        <Security />
        <Setup />
      </div>
    ),
    errorElement: (
      <>
        <NotFound />,
        <Security />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <div className="dashboard-outer-wrapper">
        <Security />
        <Nav />
        <Header title="Dashboard" />
        <Dashboard />
      </div>
    ),
    errorElement: (
      <>
        <NotFound />,
        <Security />
      </>
    ),
  },
  {
    path: "/customers",
    element: (
      <div className="dashboard-outer-wrapper">
        <Security />
        <Nav />
        <Header title="Customers" />
        <Customers />
      </div>
    ),
    errorElement: (
      <>
        <NotFound />,
        <Security />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      {/* <AuthTestComponent /> */}
    </AuthProvider>
  </StrictMode>
);
