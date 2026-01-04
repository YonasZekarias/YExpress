"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Menu, X } from "lucide-react";
import Hero from "../components/landing/hero";
import Brand from "../components/landing/brand";
import Feature from "../components/landing/feature";
import Promo from "../components/landing/promo";
import Footer from "../components/landing/footer";
import Testimonials from "@/components/landing/testimonials";
import Demo from "@/components/landing/demo";
import useAuthStore from "@/store/authStore";
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const role = useAuthStore((state) => state.role);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "user") {
      router.replace("/users/overview");
    }
  }, [role, isLoggedIn, router]);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- Navigation --- */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">
                YExpress
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-indigo-600 font-medium transition"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-slate-600 hover:text-indigo-600 font-medium transition"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-slate-600 hover:text-indigo-600 font-medium transition"
              >
                Stories
              </a>
              <button
                onClick={() => {
                  router.push("/auth/signin");
                }}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-600 transition-colors duration-300 shadow-lg shadow-indigo-500/20"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-slate-600 hover:text-indigo-600"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="text-slate-600 font-medium p-2"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-slate-600 font-medium p-2"
              onClick={toggleMenu}
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 font-medium p-2"
              onClick={toggleMenu}
            >
              Stories
            </a>
            <button className="bg-indigo-600 text-white w-full py-3 rounded-xl font-medium">
              Get Started
            </button>
          </div>
        )}
      </nav>

      <Hero />
      <Brand />
      <Feature />
      <Demo />
      <Testimonials />
      <Promo />
      <Footer />
    </div>
  );
}
