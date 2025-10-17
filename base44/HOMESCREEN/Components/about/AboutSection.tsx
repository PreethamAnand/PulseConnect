import React from "react";
import { motion } from "framer-motion";
import { Brain, MapPin, Shield, Zap, Network, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Smart algorithms match donors with patients in real-time",
    },
    {
      icon: MapPin,
      title: "Geolocation Network",
      description: "Find nearby donors and blood banks instantly",
    },
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Secure, transparent, and tamper-proof donation records",
    },
    {
      icon: Zap,
      title: "Emergency Response",
      description: "Immediate alerts for critical blood requirements",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            What is PulseConnect?
          </h2>
          <p className="text-xl text-[#7F8C8D] max-w-3xl mx-auto">
            A revolutionary platform that bridges the gap between life-saving donors
            and those in critical need
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-[#FF6B6B]/10 to-[#FFD166]/10 rounded-3xl p-8 backdrop-blur-sm">
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                {/* Central Hub */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="60"
                  fill="url(#gradient1)"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  viewport={{ once: true }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B6B" />
                    <stop offset="100%" stopColor="#FFD166" />
                  </linearGradient>
                </defs>

                {/* Network Nodes */}
                {[
                  { cx: 100, cy: 100, delay: 0.5 },
                  { cx: 300, cy: 100, delay: 0.6 },
                  { cx: 100, cy: 300, delay: 0.7 },
                  { cx: 300, cy: 300, delay: 0.8 },
                ].map((node, i) => (
                  <g key={i}>
                    <motion.line
                      x1="200"
                      y1="200"
                      x2={node.cx}
                      y2={node.cy}
                      stroke="#FF6B6B"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ delay: node.delay, duration: 0.8 }}
                      viewport={{ once: true }}
                    />
                    <motion.circle
                      cx={node.cx}
                      cy={node.cy}
                      r="30"
                      fill="#27AE60"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: node.delay, type: "spring" }}
                      viewport={{ once: true }}
                    />
                  </g>
                ))}

                {/* Icons */}
                <g transform="translate(175, 175)">
                  <Network stroke="white" strokeWidth="3" width="50" height="50" />
                </g>
              </svg>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg"
              >
                <Database className="w-6 h-6 text-[#FF6B6B]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, delay: 1, repeat: Infinity }}
                className="absolute bottom-4 left-4 bg-white rounded-full p-3 shadow-lg"
              >
                <Shield className="w-6 h-6 text-[#27AE60]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-[#2C3E50] leading-relaxed">
              PulseConnect is an innovative healthcare platform that leverages
              artificial intelligence, geolocation technology, and blockchain
              verification to create a seamless ecosystem connecting blood donors,
              plasma donors, blood banks, hospitals, and patients in need.
            </p>
            <p className="text-lg text-[#7F8C8D] leading-relaxed">
              Our mission is to eliminate the barriers that prevent timely access to
              life-saving blood and plasma donations. Through smart matching
              algorithms and real-time emergency alerts, we ensure that every drop
              counts and reaches those who need it most.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD166] hover:from-[#ff5252] hover:to-[#ffc34d] text-white"
            >
              Learn More About Our Vision
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#FFD166] rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#7F8C8D]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}