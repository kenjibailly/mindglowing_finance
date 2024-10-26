// src/components/Header/Header.tsx
import "../../stylesheets/navigation/header.css";
import Search from "./Search";
import ProfileButton from "./ProfileButton";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
      <div className="right">
        <Search />
        <ProfileButton />
      </div>
    </header>
  );
};

export default Header;
