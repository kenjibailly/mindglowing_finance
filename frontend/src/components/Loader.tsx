import React from "react";
import "../stylesheets/loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <ul className="loader">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};

export default Loader;
