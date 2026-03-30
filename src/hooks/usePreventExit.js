import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const usePreventExit = (fallbackPath = "/home") => {
  const navigate = useNavigate();

  useEffect(() => {
    // Push a duplicate history entry so back stays in app
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event) => {
      // When back is pressed, go to fallback instead of exiting
      window.history.pushState(null, "", window.location.href);
      navigate(fallbackPath);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, fallbackPath]);
};
