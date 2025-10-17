import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: createPageUrl("Home") },
    { name: "About", path: "#about" },
    { name: "Blood Donation", path: "#blood-info" },
    { name: "Plasma Therapy", path: "#plasma" },
    { name: "FAQ", path: "#faq" },
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <style>{`
        :root {
          --primary-red: #FF6B6B;
          --plasma-gold: #FFD166;
          --life-green: #27AE60;
          --text-dark: #2C3E50;
          --text-light: #7F8C8D;
        }
      `}</style>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFD166] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${scrolled ? 'text-[#2C3E50]' : 'text-white'}`}>
                  PulseConnect
                </h1>
                <p className={`text-xs ${scrolled ? 'text-[#7F8C8D]' : 'text-white/80'}`}>
                  AI-Powered Care
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-[#FF6B6B] ${
                    scrolled ? "text-[#2C3E50]" : "text-white"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <Button className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white">
                Join Now
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={scrolled ? "text-[#2C3E50]" : "text-white"} />
              ) : (
                <Menu className={scrolled ? "text-[#2C3E50]" : "text-white"} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <nav className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="block px-4 py-2 text-[#2C3E50] hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
              <Button className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white">
                Join Now
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}