import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Skip scrolling for Clerk auth pages
    if (
      location.pathname.startsWith("/sign-in") ||
      location.pathname.startsWith("/sign-up")
    ) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

  }, [location]);

  return null;
}

export default ScrollToTop;