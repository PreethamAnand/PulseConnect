
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Users, MapPin, Phone, Shield, Clock, Droplet, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Homepage() {
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
    { name: "Home", path: "/" },
    { name: "About", path: "#about" },
    { name: "Blood Donation", path: "#blood-info" },
    { name: "Plasma Therapy", path: "#plasma" },
    { name: "FAQ", path: "#faq" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
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
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
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
              <Link to="/auth">
                <Button className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white">Join Now</Button>
              </Link>
              <Link to="/auth/hospital-portal">
                <Button variant="outline" className={`${scrolled ? 'text-[#2C3E50] border-[#2C3E50]' : 'text-white border-white'} hover:bg-white/10`}>Hospital Login</Button>
              </Link>
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
              <Link to="/auth">
                <Button className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white">Join Now</Button>
              </Link>
              <Link to="/auth/hospital-portal">
                <Button variant="outline" className="w-full border-[#2C3E50] text-[#2C3E50] hover:bg-gray-50">Hospital Login</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-[#FF6B6B]/10 via-[#FFD166]/5 to-[#27AE60]/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 bg-[#FF6B6B]/10 text-[#FF6B6B] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Verified on Blockchain
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2C3E50]">
              Save Lives with <span className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD166] bg-clip-text text-transparent">PulseConnect</span>
            </h1>
            <p className="text-xl text-[#7F8C8D] mb-8 max-w-3xl mx-auto">
              AI-powered blood and plasma donation platform connecting donors with those in need. Join our community of life-savers and make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-3">Become a Donor</Button>
              </Link>
              <Link to="/request?type=blood">
                <Button size="lg" variant="outline" className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white px-8 py-3">Request Blood</Button>
              </Link>
              <Link to="/request?type=plasma">
                <Button size="lg" className="bg-gradient-to-r from-[#FFD166] to-[#FFA500] text-[#2C3E50] hover:from-[#FFA500] hover:to-[#FF8C00] px-8 py-3">Request Plasma</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">How PulseConnect Works</h2>
              <p className="text-xl text-[#7F8C8D] max-w-3xl mx-auto">Our AI-powered platform makes blood and plasma donation simple, safe, and efficient</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-[#FF6B6B]" />
                  </div>
                  <CardTitle className="text-[#2C3E50]">Find Donors</CardTitle>
                  <CardDescription>AI-powered matching system connects you with compatible donors in your area</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#FFD166]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-[#FFD166]" />
                  </div>
                  <CardTitle className="text-[#2C3E50]">Location-Based</CardTitle>
                  <CardDescription>Real-time tracking and location services for quick response times</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-[#27AE60]" />
                  </div>
                  <CardTitle className="text-[#2C3E50]">Emergency Support</CardTitle>
                  <CardDescription>24/7 emergency response system with instant notifications</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Blood Donation Section */}
        <section id="blood-info" className="py-20 px-4 bg-[#FAFAF9]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-[#2C3E50] mb-6">Why Blood Donation Matters</h3>
                <div className="space-y-4 text-[#7F8C8D]">
                  <p className="text-lg">Blood donation saves lives in surgeries, trauma, and chronic conditions. Every donation can help up to 3 people.</p>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#2C3E50] mb-3">Precautions & Guidelines</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-[#FF6B6B] mb-2">Before Donation</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Hydrate well (8+ glasses water)</li>
                          <li>• Eat iron-rich foods</li>
                          <li>• Get adequate sleep</li>
                          <li>• Avoid alcohol 24hrs prior</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-[#FF6B6B] mb-2">After Donation</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Rest for 15-20 minutes</li>
                          <li>• Avoid strenuous activity</li>
                          <li>• Keep bandage for 4-6 hours</li>
                          <li>• Drink extra fluids</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#2C3E50] mb-3">Benefits of Donation</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]" />Free health screening and blood pressure check</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]" />Reduces risk of heart disease and cancer</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]" />Helps maintain healthy iron levels</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]" />Sense of fulfillment and community impact</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h4 className="text-2xl font-bold text-[#2C3E50] mb-6 text-center">Blood vs Plasma Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-[#FF6B6B]/20">
                        <th className="py-3 text-[#2C3E50] font-semibold">Aspect</th>
                        <th className="py-3 text-[#FF6B6B] font-semibold">Blood</th>
                        <th className="py-3 text-[#FFD166] font-semibold">Plasma</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100"><td className="py-3 text-[#7F8C8D]">Duration</td><td className="py-3 text-[#2C3E50]">8-12 minutes</td><td className="py-3 text-[#2C3E50]">45-60 minutes</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-3 text-[#7F8C8D]">Cooldown Period</td><td className="py-3 text-[#2C3E50]">56 days (8 weeks)</td><td className="py-3 text-[#2C3E50]">14 days (2 weeks)</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-3 text-[#7F8C8D]">Primary Use</td><td className="py-3 text-[#2C3E50]">Transfusions</td><td className="py-3 text-[#2C3E50]">Therapies & Treatments</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-3 text-[#7F8C8D]">Volume</td><td className="py-3 text-[#2C3E50]">450-500ml</td><td className="py-3 text-[#2C3E50]">600-800ml</td></tr>
                      <tr><td className="py-3 text-[#7F8C8D]">Recovery Time</td><td className="py-3 text-[#2C3E50]">24-48 hours</td><td className="py-3 text-[#2C3E50]">2-4 hours</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plasma Therapy Section */}
        <section id="plasma" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-[#FAFAF9] rounded-xl p-8">
                <h3 className="text-3xl font-bold text-[#2C3E50] mb-6">Plasma Donation & Therapy</h3>
                <div className="space-y-4 text-[#7F8C8D]">
                  <p className="text-lg">Plasma supports critical treatments for clotting disorders, immune deficiencies, and post-COVID recovery.</p>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#2C3E50] mb-3">Plasma Donation Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3"><div className="w-6 h-6 bg-[#FFD166] rounded-full flex items-center justify-center text-xs font-bold text-[#2C3E50]">1</div><p className="text-sm">Blood is drawn and separated using a centrifuge</p></div>
                      <div className="flex items-start gap-3"><div className="w-6 h-6 bg-[#FFD166] rounded-full flex items-center justify-center text-xs font-bold text-[#2C3E50]">2</div><p className="text-sm">Plasma is collected while red cells are returned</p></div>
                      <div className="flex items-start gap-3"><div className="w-6 h-6 bg-[#FFD166] rounded-full flex items-center justify-center text-xs font-bold text-[#2C3E50]">3</div><p className="text-sm">Process takes 45-60 minutes with minimal discomfort</p></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-[#2C3E50] mb-3">Therapeutic Uses</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2"><Droplet className="w-4 h-4 text-[#FFD166]" />Treatment for bleeding disorders (Hemophilia)</li>
                      <li className="flex items-center gap-2"><Droplet className="w-4 h-4 text-[#FFD166]" />Immune deficiency treatments</li>
                      <li className="flex items-center gap-2"><Droplet className="w-4 h-4 text-[#FFD166]" />Post-COVID recovery therapy</li>
                      <li className="flex items-center gap-2"><Droplet className="w-4 h-4 text-[#FFD166]" />Burn and trauma patient care</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-[#2C3E50] mb-6">Join Our Plasma Drive</h4>
                <p className="text-[#7F8C8D] mb-8">Be part of our community plasma drives and help hospitals maintain critical inventories for life-saving treatments.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#FFD166]/10 rounded-lg"><Clock className="w-8 h-8 text-[#FFD166]" /><div><h5 className="font-semibold text-[#2C3E50]">Quick Recovery</h5><p className="text-sm text-[#7F8C8D]">Return to normal activities in 2-4 hours</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#27AE60]/10 rounded-lg"><Zap className="w-8 h-8 text-[#27AE60]" /><div><h5 className="font-semibold text-[#2C3E50]">Frequent Donations</h5><p className="text-sm text-[#7F8C8D]">Donate every 14 days (vs 56 for blood)</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#FF6B6B]/10 rounded-lg"><Heart className="w-8 h-8 text-[#FF6B6B]" /><div><h5 className="font-semibold text-[#2C3E50]">Maximum Impact</h5><p className="text-sm text-[#7F8C8D]">Help multiple patients with each donation</p></div></div>
                </div>
                <div className="mt-8 space-x-4">
                  <Link to="/request?type=blood"><Button className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white">Request Blood</Button></Link>
                  <Link to="/request?type=plasma"><Button variant="outline" className="border-[#FFD166] text-[#FFD166] hover:bg-[#FFD166] hover:text-[#2C3E50]">Request Plasma</Button></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C3E50] mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-[#7F8C8D]">Everything you need to know about blood and plasma donation</p>
            </div>
            <div className="space-y-6">
              <Card><CardHeader><CardTitle className="text-[#2C3E50]">How often can I donate blood?</CardTitle><CardDescription className="text-[#7F8C8D]">You can donate whole blood every 56 days (8 weeks). For plasma, you can donate every 14 days (2 weeks).</CardDescription></CardHeader></Card>
              <Card><CardHeader><CardTitle className="text-[#2C3E50]">Is blood donation safe?</CardTitle><CardDescription className="text-[#7F8C8D]">Yes, blood donation is extremely safe. All equipment is sterile and used only once. Our AI system ensures compatibility matching.</CardDescription></CardHeader></Card>
              <Card><CardHeader><CardTitle className="text-[#2C3E50]">What are the eligibility requirements?</CardTitle><CardDescription className="text-[#7F8C8D]">You must be 18-65 years old, weigh at least 50kg, be in good health, and meet hemoglobin requirements.</CardDescription></CardHeader></Card>
              <Card><CardHeader><CardTitle className="text-[#2C3E50]">How does blockchain verification work?</CardTitle><CardDescription className="text-[#7F8C8D]">Every donation is recorded on the Polygon blockchain, creating an immutable record of your contribution.</CardDescription></CardHeader></Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2C3E50] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFD166] rounded-full flex items-center justify-center mr-3"><Heart className="h-6 w-6 text-white" fill="white" /></div>
                  <div><h3 className="text-xl font-bold">PulseConnect</h3><p className="text-sm text-gray-400">AI-Powered Care</p></div>
                </div>
                <p className="text-gray-400">Connecting lives through blood and plasma donation. Every drop counts, every donation matters.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/auth" className="hover:text-white transition-colors">Become a Donor</Link></li>
                  <li><Link to="/request?type=blood" className="hover:text-white transition-colors">Request Blood</Link></li>
                  <li><Link to="/request?type=plasma" className="hover:text-white transition-colors">Request Plasma</Link></li>
                  <li><Link to="/emergency" className="hover:text-white transition-colors">Emergency</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Emergency: 108</li>
                  <li>Support: +91-1800-BLOOD</li>
                  <li>Email: help@pulseconnect.org</li>
                  <li>Chat: Available 24/7</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                  <li>Blockchain Privacy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 PulseConnect. All rights reserved. Powered by AI & Blockchain.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
