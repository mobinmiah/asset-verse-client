import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/authPages/Login/Login";
import RegisterEmployee from "../pages/authPages/Register/RegisterEmployee";
import RegisterHR from "../pages/authPages/Register/RegisterHR";
import PrivateRoute from "../routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome/DashboardHome";
import AddAsset from "../pages/dashboard/AddAsset/AddAsset";
import AssetList from "../pages/dashboard/AssetList/AssetList";
import UpgradePackage from "../pages/dashboard/UpgradePackage/UpgradePackage";
import AllRequests from "../pages/dashboard/AllRequests/AllRequests";
import AllEmployees from "../pages/dashboard/AllEmployees/AllEmployees";
import HrRoute from "./HrRoute";
import EmployeeRoute from "./EmployeeRoute";
import AdminRoute from "./AdminRoute";
import RequestAnAsset from "../pages/dashboard/RequestAnAsset/RequestAnAsset";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import MyProfile from "../pages/dashboard/MyProfile/MyProfile";
import PaymentSuccess from "../pages/dashboard/PaymentSuccess/PaymentSuccess";
import PaymentCancelled from "../pages/dashboard/PaymentCancelled/PaymentCancelled";
import MyAssets from "../pages/dashboard/MyAssets/MyAssets";
import MyTeam from "../pages/dashboard/MyTeam/MyTeam";
import AllAssets from "../pages/AllAssets/AllAssets";
import AssetDetails from "../pages/AssetDetails/AssetDetails";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Help from "../pages/Help/Help";
import AdminDashboard from "../pages/dashboard/DashboardHome/AdminDashboard";
import AdminUsers from "../pages/dashboard/AdminUsers/AdminUsers";
import AdminOrganizations from "../pages/dashboard/AdminOrganizations/AdminOrganizations";
import AllAssetList from "../pages/dashboard/AllAssetList/AllAssetList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "assets",
        element: (
          <PrivateRoute>
            <AllAssets />
          </PrivateRoute>
        ),
      },
      {
        path: "asset/:id",
        element: (
          <PrivateRoute>
            <AssetDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register-employee",
        element: <RegisterEmployee />,
      },
      {
        path: "register-hr",
        element: <RegisterHR />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      // HR Routes
      {
        path: "add-asset",
        element: (
          <HrRoute>
            <AddAsset />
          </HrRoute>
        ),
      },
      {
        path: "asset-list",
        element: (
          <HrRoute>
            <AssetList />
          </HrRoute>
        ),
      },
      {
        path: "all-requests",
        element: (
          <HrRoute>
            <AllRequests />
          </HrRoute>
        ),
      },
      {
        path: "my-employees",
        element: (
          <HrRoute>
            <AllEmployees />
          </HrRoute>
        ),
      },
      {
        path: "upgrade-package-hr",
        element: (
          <HrRoute>
            <UpgradePackage />
          </HrRoute>
        ),
      },
      // Employee Routes
      {
        path: "my-assets",
        element: (
          <EmployeeRoute>
            <MyAssets />
          </EmployeeRoute>
        ),
      },
      {
        path: "request-asset",
        element: (
          <EmployeeRoute>
            <RequestAnAsset />
          </EmployeeRoute>
        ),
      },
      {
        path: "my-team",
        element: (
          <EmployeeRoute>
            <MyTeam />
          </EmployeeRoute>
        ),
      },
      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/assets",
        element: (
          <AdminRoute>
            <AllAssetList />
          </AdminRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/organizations",
        element: (
          <AdminRoute>
            <AdminOrganizations />
          </AdminRoute>
        ),
      },
      // Shared Routes
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
    ],
  },
]);
