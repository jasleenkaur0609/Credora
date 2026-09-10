import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/home/Home";
// import Login from "../pages/auth/Login";
// import Dashboard from "../pages/dashboard/Dashboard";
// import DashboardLayout from "../layouts/DashboardLayout";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* </Route> */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}