import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Dashboard } from "../pages/Dashboard";
import { Services } from "../pages/Services";
import { ServiceDetail } from "../pages/ServiceDetail";
import { DeployLogs } from "../pages/DeployLogs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/services/:id",
        element: <ServiceDetail />,
      },
      {
        path: "/deploy-logs",
        element: <DeployLogs />,
      },
    ],
  },
]);
