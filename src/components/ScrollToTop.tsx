import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  // Use useLayoutEffect to scroll before paint
  useLayoutEffect(() => {
    if (hash) {
      // Wait for the page to render, then scroll to the element
      const timer = setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Scroll to top immediately for regular navigation
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash, key]);

  return null;
}
