import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import Products from "../components/products/Products";
import Product from "../components/products/Product";
import NotFound from "../components/NotFound";

const productRoutes: RouteObject[] = [
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Products" />
          <Products />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
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
];

export default productRoutes;
