import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import Products from "../components/products/Products";
import Product from "../components/products/Product";
import NotFound from "../components/NotFound";
import CreateProduct from "../components/products/CreateProduct";
import EditProduct from "../components/products/EditProduct";

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
  {
    path: "/products/create",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Product" />
          <CreateProduct />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/products/edit/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Product" />
          <EditProduct />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
];

export default productRoutes;
