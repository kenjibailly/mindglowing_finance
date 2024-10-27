import React, { useState, useEffect } from "react";
import placeholder from "../../assets/placeholder.webp";
import ProfileOverlay from "./ProfileOverlay";

const ProfileButton: React.FC = () => {
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isProfileOverlayVisible, setIsProfileOverlayVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const user = await response.json();
        if (user.picture) {
          const user_picture = "/uploads/resized/" + user.picture;
          setUserPicture(user_picture);
        }
      } catch (error) {
        setError("Problem loading user");
      }
    };

    fetchUserData();
  }, []);

  const openProfileOverlay = () => {
    setIsProfileOverlayVisible(true);
  };

  if (error) {
    return <p className="error">{error}</p>; // Display error message if any
  }

  return (
    <>
      <button className="right" onClick={openProfileOverlay}>
        {userPicture ? (
          <img src={userPicture} height="40px" alt="User Profile" />
        ) : (
          <img src={placeholder} height="40px" alt="User Profile" />
        )}
      </button>
      {isProfileOverlayVisible && (
        <ProfileOverlay setIsVisible={setIsProfileOverlayVisible} />
      )}
    </>
  );
};

export default ProfileButton;
