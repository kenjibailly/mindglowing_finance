import { Link } from "react-router-dom";
import "../../stylesheets/navigation/profile_overlay.css";
import { useRef } from "react";

interface Props {
  setIsVisible: (visible: boolean) => void;
}

const ProfileOverlay: React.FC<Props> = ({ setIsVisible }) => {
  const profileOverlay = useRef<HTMLDivElement>(null);
  const closeOverlay = () => {
    setIsVisible(false);
  };
  return (
    <div ref={profileOverlay} className="profile-overlay-wrapper">
      <div className="blur" onClick={closeOverlay}></div>
      <div className="profile-overlay-content">
        <p className="close" onClick={closeOverlay}>
          X
        </p>
        <h1>Profile</h1>
        <div>
          <Link to="/logout" key="logout">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;
