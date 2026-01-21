import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import FloatingAI from "./FloatingAI";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen relative">
        <Outlet />
        <FloatingAI />
      </div>
      <Footer />
    </>
  );
}
