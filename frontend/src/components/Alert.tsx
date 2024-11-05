// Alert.tsx
import { useEffect, useRef, useState } from "react";
import "../stylesheets/alert.css";

interface AlertProps {
  message: string | null;
  type: string;
  scroll: boolean;
}

const Alert = ({ message, type, scroll }: AlertProps) => {
  const alertRef = useRef<HTMLDivElement | null>(null);
  const [prevMessage, setPrevMessage] = useState<string | null>(null);
  useEffect(() => {
    // Only scroll if the message changes
    if (message !== prevMessage && alertRef.current && scroll) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
      setPrevMessage(message); // Update previous message to current one
    }
  }, [message, prevMessage]);

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
    <div ref={alertRef} id="alert" className="wrapper">
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
