import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Setup from "./components/Setup";
import Dashboard from "./components/Dashboard";
import Nav from "./components/Nav";
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
      <>
        <Security />
        <Logout />
      </>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/setup",
    element: (
      <div className="dashboard-outer-wrapper">
        <Security />
        <Setup />
      </div>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <div className="dashboard-outer-wrapper">
        <Security />
        <Nav />
        <Dashboard />
      </div>
    ),
    errorElement: <NotFound />,
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
