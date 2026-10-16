import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigation } from "react-router-dom";

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    setVisible(false);
    setBooting(true);
    const delay = location.key === "default" ? 2500 : 380;
    const timer = setTimeout(() => {
      setVisible(true);
      setBooting(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [location.key]);

  return (
    <>
      <div
        className={`transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-40"}`}
      >
        {children}
      </div>
      {(booting || navigation.state !== "idle") && (
        <div className="route-loading" role="status" aria-live="polite">
          <span className="route-spinner" aria-hidden="true" />
          <span>Menyiapkan ruang kolaborasi…</span>
        </div>
      )}
    </>
  );
};

export const NavigationProgress = () => {
  const navigation = useNavigation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (navigation.state !== "idle") {
      setActive(true);
      return;
    }
    const timer = setTimeout(() => setActive(false), 450);
    return () => clearTimeout(timer);
  }, [navigation.state]);

  if (!active) return null;
  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
      aria-hidden="true"
    >
      <div className="nav-progress-bar h-full bg-primary" />
    </div>
  );
};
