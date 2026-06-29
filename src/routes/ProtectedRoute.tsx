import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  if (!token || !expiry || Date.now() > Number(expiry)) {
    localStorage.clear();
    return <Navigate to="admin/login" replace />;
  }

  return <Outlet />;
}