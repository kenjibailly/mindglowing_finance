// ProtectedRoute.tsx
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/logout");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return null;

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
