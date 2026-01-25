import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FloatingAI from "./FloatingAI";

export default function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Navbar onOpenChat={() => setIsChatOpen(true)} />
      <div className="min-h-screen relative">
        <Outlet />
        <FloatingAI isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
      <Footer />
    </>
  );
}
