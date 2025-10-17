import React from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Shield, Clock, Zap, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PlasmaTherapySection() {
  const benefits = [
    {
      icon: Shield,
      title: "Dengue Recovery",
      description: "Critical for severe dengue patients with low platelet counts",
    },
    {
      icon: Zap,
      title: "COVID Recovery",
      description: "Helps post-COVID patients build immunity and recover faster",
    },
    {
      icon: Award,
      title: "Antibody Rich",
      description: "Contains proteins and antibodies that fight infections",
    },
  ];

  const donationCycle = [
    { step: "Eligibility Check", time: "5 min", icon: Shield },
    { step: "Blood Collection", time: "10 min", icon: Sparkles },
    { step: "Plasma Extraction", time: "45 min", icon: RefreshCw },
    { step: "Recovery Period", time: "14 days", icon: Clock },
  ];

  const precautions = [
    "Must have recovered from illness for at least 28 days",
    "Weight should be above 55 kg",
    "Age between 18-60 years",
    "No chronic health conditions",
    "Well-hydrated before donation",
    "Avoid heavy meals 2 hours before",
  ];

  return (
    <section id="plasma" className="py-20 md:py-32 bg-gradient-to-b from-amber-50/30 to-orange-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFD166]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FFD166]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD166] to-[#FFB84D] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Plasma Therapy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            What is Plasma Therapy?
          </h2>
          <p className="text-xl text-[#7F8C8D] max-w-3xl mx-auto">
            Healing through life-rich plasma — a powerful treatment for critical
            illnesses
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Explanation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-amber-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                  How Plasma Donation Works
                </h3>
                <p className="text-[#7F8C8D] leading-relaxed mb-4">
                  Plasma is the liquid portion of blood that carries cells and proteins
                  throughout the body. During plasma donation, blood is drawn from your
                  arm and passed through a special machine that separates plasma from
                  other components.
                </p>
                <p className="text-[#7F8C8D] leading-relaxed">
                  The red blood cells and platelets are returned to your body, while
                  the plasma is collected for medical use. This process, called
                  plasmapheresis, is safe and typically takes about 45-60 minutes.
                </p>
              </CardContent>
            </Card>

            {/* Benefits Cards */}
            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFD166] to-[#FFB84D] rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-[#7F8C8D]">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Infographic */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Donation Cycle */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">
                  Donation Cycle
                </h3>
                <div className="space-y-4">
                  {donationCycle.map((cycle, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FFD166] to-[#FFB84D] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <cycle.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#2C3E50]">{cycle.step}</h4>
                          <p className="text-sm text-[#7F8C8D]">{cycle.time}</p>
                        </div>
                      </div>
                      {index < donationCycle.length - 1 && (
                        <div className="ml-6 mt-2 mb-2 h-8 border-l-2 border-dashed border-[#FFD166]" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl"
                >
                  <p className="text-sm text-[#2C3E50] font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    You can donate plasma every 14 days
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Precautions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD166] to-[#FFB84D] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-[#2C3E50]">
              Precautions & Eligibility
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {precautions.map((precaution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-transparent rounded-xl border border-amber-100"
              >
                <div className="w-2 h-2 bg-[#FFD166] rounded-full flex-shrink-0 mt-2" />
                <span className="text-[#2C3E50]">{precaution}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}