import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { UserProvider } from "./contexts/UserContext";
import { CooperativeProvider } from "./contexts/CooperativeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "./components/UI/Toast";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Cooperatives } from "./pages/cooperatives";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <UserProvider>
            <CooperativeProvider>
              <div className="min-h-screen bg-gray-100">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cooperatives"
                    element={
                      <ProtectedRoute>
                        <Cooperatives />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
                <ToastContainer />
              </div>
            </CooperativeProvider>
          </UserProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
