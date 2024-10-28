import React from "react";
import "../stylesheets/loader.css";

interface LoaderProps {
  fullPage: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullPage }) => {
  return (
    <div className={`loader-container ${fullPage ? "full-page" : ""}`}>
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
