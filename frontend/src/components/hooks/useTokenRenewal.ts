import { useEffect } from "react";
const tokenExpiryInSeconds = import.meta.env
  .VITE_ACCESS_TOKEN_EXPIRY_IN_SECONDS;

const useTokenRenewal = (isAuthenticated: boolean) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    const renewToken = async () => {
      await fetch("/api/auth/renew-token", {
        method: "POST",
        credentials: "include",
      });
    };

    const interval = setInterval(() => {
      renewToken();
    }, tokenExpiryInSeconds * 1000 - parseInt(tokenExpiryInSeconds) / 10);

    return () => clearInterval(interval);
  }, [isAuthenticated]);
};

export default useTokenRenewal;
