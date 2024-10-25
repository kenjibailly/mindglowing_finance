import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTokenRenewal from "./hooks/useTokenRenewal";

const Security = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Navigate based on auth status
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/logout");
      }
    }
  }, [loading, isAuthenticated, navigate]);

  // Use token renewal if authenticated
  useTokenRenewal(isAuthenticated); // Call it directly within the component

  return null; // No UI needed
};

export default Security;
