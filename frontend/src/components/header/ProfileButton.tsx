import React, { useState } from "react";
import placeholder from "../../assets/placeholder.webp";
import ProfileOverlay from "./ProfileOverlay";

const ProfileButton: React.FC = () => {
  const [isProfileOverlayVisible, setIsProfileOverlayVisible] =
    useState<boolean>(false);
  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const openProfileOverlay = () => {
    setIsProfileOverlayVisible(true);
  };

  return (
    <>
      <button className="right" onClick={openProfileOverlay}>
        {cachedUser.picture ? (
          <img
            src={`/uploads/resized/${cachedUser.picture}`}
            height="40px"
            alt="User Profile"
          />
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
