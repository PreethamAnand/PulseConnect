import React from "react";
import { motion } from "framer-motion";
import { Droplet, Heart, CheckCircle, AlertCircle, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BloodDonationInfo() {
  const infoCards = [
    {
      icon: Droplet,
      title: "What is Blood Donation?",
      description:
        "Blood donation is the voluntary process of giving blood which can be used for transfusions or made into medications. One donation can save up to three lives.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: AlertCircle,
      title: "Precautions",
      description:
        "Eat iron-rich foods before donation, stay hydrated, avoid alcohol 24 hours prior, get adequate sleep, and avoid heavy lifting after donation.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Heart,
      title: "Health Benefits",
      description:
        "Reduces risk of heart disease, stimulates blood cell production, helps maintain healthy liver, reveals health conditions, and provides free health screening.",
      color: "from-green-500 to-green-600",
    },
  ];

  const requirements = [
    "Age between 18-65 years",
    "Weight above 50 kg (110 lbs)",
    "Hemoglobin level above 12.5 g/dL",
    "No recent illness or infection",
    "Not on antibiotics or medication",
    "3 months gap between donations",
  ];

  return (
    <section id="blood-info" className="py-20 md:py-32 bg-gradient-to-b from-white to-red-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#FF6B6B] px-6 py-3 rounded-full mb-6">
            <Droplet className="w-5 h-5" />
            <span className="font-semibold">Blood Donation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
            Understanding Blood Donation
          </h2>
          <p className="text-xl text-[#7F8C8D] max-w-3xl mx-auto">
            Everything you need to know about giving the gift of life
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {infoCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-none overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                    {card.title}
                  </h3>
                  <p className="text-[#7F8C8D] leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#ff5252] rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-[#2C3E50]">
              Who Can Donate Blood?
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-transparent rounded-xl"
              >
                <Activity className="w-5 h-5 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                <span className="text-[#2C3E50] font-medium">{req}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl border-l-4 border-[#FF6B6B]"
          >
            <p className="text-[#2C3E50] font-medium">
              <strong>Important:</strong> Always consult with a healthcare professional
              before donating blood to ensure you meet all health requirements and can
              safely donate.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}