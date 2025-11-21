import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChooseRole from "./pages/ChooseRole";

import DonorDashboard from "./pages/donor/DonorDashboard";
import RecipientDashboard from "./pages/recipient/RecipientDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Route that checks userRole and redirects */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <RoleRoute />
              </PrivateRoute>
            }
          />
          {/* Protected Dashboards */}
          <Route
            path="/donor-dashboard"
            element={
              <PrivateRoute>
                <DonorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipient-dashboard"
            element={
              <PrivateRoute>
                <RecipientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/volunteer-dashboard"
            element={
              <PrivateRoute>
                <VolunteerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* If user has no role */}
          <Route path="/choose-role" element={<ChooseRole />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
