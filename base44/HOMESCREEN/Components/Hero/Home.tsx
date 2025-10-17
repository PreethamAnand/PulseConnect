import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Users, Building2, ArrowRight } from "lucide-react";
import ParticleBackground from "./ParticleBackground";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Particle Background */}
      <ParticleBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/90 via-[#FF6B6B]/80 to-[#FFD166]/70 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <span className="text-sm font-medium">AI-Powered Blood & Plasma Network</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              One Drop,
              <br />
              <span className="text-[#FFD166]">Many Lives.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-4 text-white/90"
            >
              Connecting donors, hospitals, and patients through AI-driven care.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg mb-8 text-white/80"
            >
              Donate, request, and save lives — all in one secure platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-[#FF6B6B] hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Join as Donor
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD166] hover:from-[#ff5252] hover:to-[#ffc34d] text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Request Help
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#FF6B6B] transition-all duration-300"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Hospital Login
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Connection Illustration */}
              <svg
                viewBox="0 0 500 400"
                className="w-full h-auto drop-shadow-2xl"
              >
                {/* Connection Lines */}
                <motion.path
                  d="M 100 200 Q 250 100 400 200"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M 100 200 Q 250 300 400 200"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                />

                {/* Donor Circle */}
                <motion.circle
                  cx="100"
                  cy="200"
                  r="40"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                />
                <Heart
                  x="70"
                  y="170"
                  className="w-16 h-16"
                  fill="#FF6B6B"
                  stroke="#FF6B6B"
                />

                {/* Central Heart */}
                <motion.circle
                  cx="250"
                  cy="200"
                  r="60"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                />
                <motion.g
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <circle cx="250" cy="200" r="45" fill="#FFD166" />
                  <Heart
                    x="215"
                    y="165"
                    className="w-20 h-20"
                    fill="white"
                    stroke="white"
                  />
                </motion.g>

                {/* Patient Circle */}
                <motion.circle
                  cx="400"
                  cy="200"
                  r="40"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                />
                <Users
                  x="370"
                  y="170"
                  className="w-16 h-16"
                  stroke="#27AE60"
                  fill="#27AE60"
                />

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={150 + i * 40}
                    cy={100 + (i % 2) * 200}
                    r="4"
                    fill="white"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-white/70 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}