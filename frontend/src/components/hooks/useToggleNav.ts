import { useState } from "react";

const useToggleNav = (element: string) => {
  const cachedNavState = localStorage.getItem("navState_" + element) || "open";
  const [navState, setNavState] = useState<string>(cachedNavState);

  const toggleNav = () => {
    const navSateToggle = navState === "open" ? "closed" : "open";
    setNavState(navSateToggle);
    localStorage.setItem("navState_" + element, navSateToggle);
  };

  return { toggleNav, navState };
};

export default useToggleNav;
