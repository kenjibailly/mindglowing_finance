import { useEffect, useRef, useState } from "react";
import "../stylesheets/alert.css";

interface AlertProps {
  message: string | null;
  type: string;
  scroll: boolean;
}

const Alert = ({ message, type, scroll }: AlertProps) => {
  const alertRef = useRef<HTMLDivElement | null>(null);
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (message) {
      setFade(false); // Reset fade when a new message appears
      setHidden(false);

      // Only scroll if the message changes
      if (alertRef.current && scroll) {
        alertRef.current.scrollIntoView({ behavior: "smooth" });
      }

      // Start fade-out effect after 5 seconds
      const fadeTimeout = setTimeout(() => setFade(true), 5000);

      // Add hidden class after fade-out duration (e.g., 1 second)
      const hideTimeout = setTimeout(() => setHidden(true), 6000);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [message, scroll]);

  const formatAlertMessage = (alertMessage: string | null) => {
    if (!alertMessage) return null;

    return alertMessage.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < alertMessage.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      ref={alertRef}
      id="alert"
      className={`wrapper ${fade ? "fade-out" : ""} ${hidden ? "hidden" : ""}`}
    >
      <div className="alert">
        <div className={`alert-message ${type}`}>
          <h1>{type.toUpperCase()}</h1>
          <div>
            <p>{formatAlertMessage(message)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
