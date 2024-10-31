import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          credentials: "include", // Include cookies for session management
        });

        if (response.ok) {
          setUser(null);
          // Redirect to login or home page after successful logout
          navigate("/login"); // Use navigate to navigate
        } else {
          // Handle logout failure
          navigate("/login");
        }
      } catch (error) {
        console.error("An error occurred while logging out:", error);
        // Redirect to login in case of error
        navigate("/login");
      }
    };

    handleLogout(); // Call the logout function
  }, [navigate]); // Dependency array includes navigate to avoid lint warnings

  return null; // Optionally return null as there is no UI to display
};

export default Logout;
