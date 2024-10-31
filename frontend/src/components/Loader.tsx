import "../stylesheets/loader.css";

interface LoaderProps {
  fullPage: boolean;
}

const Loader = ({ fullPage }: LoaderProps) => {
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
