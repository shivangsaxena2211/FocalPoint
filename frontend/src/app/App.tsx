import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import DetectionDashboard from "../pages/DetectionDashboard";
import EnhancementDashboard from "../pages/EnhancementDashboard";
import LandingPage from "../pages/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <DetectionDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enhance"
            element={
              <ProtectedRoute>
                <EnhancementDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
