import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Setup from "./components/Setup";
import Index from "./components/Index";
import Dashboard from "./components/Dashboard";
import Customers from "./components/customers/Customers";
import Customer from "./components/customers/Customer";
import Nav from "./components/Nav";
import Header from "./components/header/Header";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";
import "./stylesheets/style.css";
import EditCustomer from "./components/customers/EditCustomer";
import CreateCustomer from "./components/customers/CreateCustomer";
import Products from "./components/products/Products";
import Product from "./components/products/Product";

const router = createBrowserRouter([
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
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/logout",
    element: <Logout />,
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
  },
  {
    path: "/products/",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Products" />
          <Products />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Product" />
          <Product />
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
