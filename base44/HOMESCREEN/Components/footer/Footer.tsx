import React from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Request", href: "#" },
    { name: "Donate", href: "#" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#FF6B6B] to-[#ff5252] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 - Logo & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" fill="white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">PulseConnect</h3>
                <p className="text-sm text-white/80">AI-Powered Care</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              Connecting life-saving donors with those in need through technology,
              compassion, and trust. Every drop counts, every life matters.
            </p>
          </motion.div>

          {/* Column 2 - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full group-hover:bg-white transition-colors duration-200" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <div className="space-y-4">
              <a
                href="mailto:support@pulseconnect.com"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <span>support@pulseconnect.com</span>
              </a>
              <a
                href="tel:+1800PULSE"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                  <Phone className="w-5 h-5" />
                </div>
                <span>1-800-PULSE (24/7 Helpline)</span>
              </a>

              {/* Social Links */}
              <div className="pt-4">
                <p className="text-sm text-white/80 mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-200"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/20 text-center"
        >
          <p className="text-white/80">
            © 2025 PulseConnect. All Rights Reserved. Saving lives, one connection at
            a time.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}