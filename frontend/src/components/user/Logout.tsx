import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Logout: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          credentials: "include", // Include cookies for session management
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Logout successful:", data);
          // Redirect to login or home page after successful logout
          navigate("/login"); // Use navigate to navigate
        } else {
          console.error("Logout failed:", data);
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
