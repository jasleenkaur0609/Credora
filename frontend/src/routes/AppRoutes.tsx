import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes will be added later */}
      <Route
        path="/dashboard"
        element={
          <main>
            <h1>Dashboard</h1>
            <p>Protected dashboard coming next.</p>
          </main>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <main>
            <h1>404</h1>
            <p>Page not found.</p>
          </main>
        }
      />
    </Routes>
  );
}

export default AppRoutes;