import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function MainLayout() {
  const location = useLocation();
  const isChatPage = location.pathname.replace(/\/$/, '') === '/ai-chat';

  useEffect(() => {
    if (!isChatPage) return undefined;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [isChatPage]);

  // Chat page owns its own navbar inside AIChat — full viewport shell only
  if (isChatPage) {
    return (
      <div
        id="ai-chat-root-shell"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100dvh',
          maxHeight: '100dvh',
          overflow: 'hidden',
          zIndex: 40,
          background: '#fdf8f6',
        }}
      >
        <Outlet />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
