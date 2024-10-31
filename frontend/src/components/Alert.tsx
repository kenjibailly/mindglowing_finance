// Alert.tsx
import { useEffect } from "react";
import "../stylesheets/alert.css";

interface AlertProps {
  message: string | null;
  type: string;
}

const Alert = ({ message, type }: AlertProps) => {
  useEffect(() => {
    const alertElement = document.getElementById("alert");
    if (alertElement) {
      alertElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []); // Run only once when the component mounts

  const formatAlertMessage = (alertMessage: string | null) => {
    if (!alertMessage) return null;

    // Split the error message by newline and map to paragraph elements
    return alertMessage.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < alertMessage.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div id="alert" className="wrapper">
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
