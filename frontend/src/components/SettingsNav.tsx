import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useToggleNav from "./hooks/useToggleNav";

const SettingsNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { toggleNav, navState } = useToggleNav("settings-sidebar");

  const toggleSidebar = () => {
    toggleNav();
  };

  useEffect(() => {
    const cachedNavState = localStorage.getItem("navState_main-sidebar");
    if (cachedNavState) return;
    localStorage.setItem("navState_main-sidebar", "closed");
  }, []);

  const links = [
    {
      href: "/settings/account",
      label: "Account",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      href: "/settings/customization/",
      label: "Customization",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      href: "/settings/payment-methods/",
      label: "Payment Methods",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      href: "/settings/discounts/",
      label: "Discounts",
      icon: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",
    },
    {
      href: "/settings/shipping-companies/",
      label: "Shipping Companies",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      href: "/settings/taxes/",
      label: "Taxes",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  useEffect(() => {
    const isActive = (href: string) => currentPath.startsWith(href);

    links.map((link) => ({
      ...link,
      isActive: isActive(link.href),
    }));

    // Additional logic for specific path handling can be added here
  }, [currentPath]);
  return (
    <nav className={`sidebar settings-sidebar ${navState}`}>
      <ul>
        {links.map((link) => (
          <Link key={link.href} to={link.href}>
            <li
              key={link.href}
              className={currentPath.startsWith(link.href) ? "active" : ""}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={link.icon}
                />
              </svg>
              <p>{link.label}</p>
            </li>
          </Link>
        ))}
        <Link to={"#"} onClick={toggleSidebar}>
          <li>
            {navState === "open" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 17l-5-5 5-5M18 17l-5-5 5-5"
                  />
                </svg>
                <p>Close</p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 17l5-5-5-5M6 17l5-5-5-5"
                  />
                </svg>
                <p>Open</p>
              </>
            )}
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default SettingsNav;
