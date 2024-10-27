// Error.tsx
import React from "react";
import "../stylesheets/error.css";

interface ErrorProps {
  error: string | null;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <div className="wrapper">
      <div className="error">
        <div className="error-message">
          <h1>Error</h1>
          <div>
            <p>
              Something went wrong, please contact your administrator or try
              again later.
            </p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
