import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Nav from "../components/Nav";
import Header from "../components/header/Header";
import Invoice from "../components/invoices/Invoice";
// import CreateInvoice from "../components/invoices/CreateInvoice";
// import EditInvoice from "../components/invoices/EditInvoice";
import NotFound from "../components/NotFound";
import Invoices from "../components/invoices/Invoices";

const InvoicesRoutes: RouteObject[] = [
  {
    path: "/invoices",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Invoices" />
          <Invoices />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/invoices/:id",
    element: (
      <ProtectedRoute>
        <div className="dashboard-outer-wrapper">
          <Nav />
          <Header title="Invoice" />
          <Invoice />
        </div>
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  // {
  //   path: "/invoices/create",
  //   element: (
  //     <ProtectedRoute>
  //       <div className="dashboard-outer-wrapper">
  //         <Nav />
  //         <Header title="Create Invoice" />
  //         <CreateInvoice />
  //       </div>
  //     </ProtectedRoute>
  //   ),
  //   errorElement: <NotFound />,
  // },
  // {
  //   path: "/invoices/edit/:id",
  //   element: (
  //     <ProtectedRoute>
  //       <div className="dashboard-outer-wrapper">
  //         <Nav />
  //         <Header title="Edit Invoice" />
  //         <EditInvoice />
  //       </div>
  //     </ProtectedRoute>
  //   ),
  //   errorElement: <NotFound />,
  // },
];

export default InvoicesRoutes;
