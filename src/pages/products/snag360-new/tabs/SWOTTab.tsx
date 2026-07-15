// Snag360 New - SWOT Tab Component
import React, { useState } from "react";
import {
  swotStrengths,
  swotWeaknesses,
  swotOpportunities,
  swotThreats,
} from "../data";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#4CAF50",
  warning: "#FFC107",
  info: "#2196F3",
};

type SWOTCategory = "strengths" | "weaknesses" | "opportunities" | "threats";

const categoryConfig = {
  strengths: {
    title: "Strengths",
    icon: Shield,
    color: BRAND_COLORS.success,
    bgColor: `${BRAND_COLORS.success}10`,
    data: swotStrengths,
  },
  weaknesses: {
    title: "Weaknesses",
    icon: AlertTriangle,
    color: "#E53935",
    bgColor: "#FFEBEE",
    data: swotWeaknesses,
  },
  opportunities: {
    title: "Opportunities",
    icon: TrendingUp,
    color: BRAND_COLORS.info,
    bgColor: `${BRAND_COLORS.info}10`,
    data: swotOpportunities,
  },
  threats: {
    title: "Threats",
    icon: AlertCircle,
    color: BRAND_COLORS.warning,
    bgColor: `${BRAND_COLORS.warning}10`,
    data: swotThreats,
  },
};

export const SWOTTab: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<SWOTCategory>("strengths");

  const categories: SWOTCategory[] = [
    "strengths",
    "weaknesses",
    "opportunities",
    "threats",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <Shield className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <h2
          className="text-xl font-semibold"
          style={{
            color: BRAND_COLORS.text,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          SWOT Analysis
        </h2>
      </div>

      {/* SWOT Grid Overview */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          return (
            <button
              key={category}
              className="p-4 rounded-lg border text-left transition-all"
              style={{
                borderColor:
                  activeCategory === category
                    ? config.color
                    : BRAND_COLORS.cardBorder,
                backgroundColor:
                  activeCategory === category
                    ? config.bgColor
                    : BRAND_COLORS.white,
              }}
              onClick={() => setActiveCategory(category)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5" style={{ color: config.color }} />
                <h3
                  className="font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {config.title}
                </h3>
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: config.color }}
              >
                {config.data.length}
              </div>
              <p
                className="text-xs"
                style={{ color: BRAND_COLORS.textSecondary }}
              >
                Identified Items
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Category Details */}
      <div
        className="rounded-lg border p-6"
        style={{
          borderColor: categoryConfig[activeCategory].color,
          backgroundColor: BRAND_COLORS.white,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          {React.createElement(categoryConfig[activeCategory].icon, {
            className: "w-5 h-5",
            style: { color: categoryConfig[activeCategory].color },
          })}
          <h3
            className="text-lg font-semibold"
            style={{ color: BRAND_COLORS.text }}
          >
            {categoryConfig[activeCategory].title}
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {categoryConfig[activeCategory].data.map((item, index) => (
            <div
              key={index}
              className="rounded-lg p-4"
              style={{
                backgroundColor: categoryConfig[activeCategory].bgColor,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{
                    backgroundColor: categoryConfig[activeCategory].color,
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <h4
                    className="font-medium mb-1"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.item}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full SWOT Matrix */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: BRAND_COLORS.text }}
        >
          Complete SWOT Matrix
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: BRAND_COLORS.success,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <Shield
                className="w-4 h-4"
                style={{ color: BRAND_COLORS.success }}
              />
              <h4
                className="font-semibold"
                style={{ color: BRAND_COLORS.success }}
              >
                Strengths (Internal +)
              </h4>
            </div>
            <ul className="space-y-2">
              {swotStrengths.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: BRAND_COLORS.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: "#E53935",
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: "#E53935" }} />
              <h4 className="font-semibold" style={{ color: "#E53935" }}>
                Weaknesses (Internal -)
              </h4>
            </div>
            <ul className="space-y-2">
              {swotWeaknesses.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#E53935" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: BRAND_COLORS.info,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <TrendingUp
                className="w-4 h-4"
                style={{ color: BRAND_COLORS.info }}
              />
              <h4
                className="font-semibold"
                style={{ color: BRAND_COLORS.info }}
              >
                Opportunities (External +)
              </h4>
            </div>
            <ul className="space-y-2">
              {swotOpportunities.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: BRAND_COLORS.info }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: BRAND_COLORS.warning,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2 border-b"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <AlertCircle
                className="w-4 h-4"
                style={{ color: BRAND_COLORS.warning }}
              />
              <h4
                className="font-semibold"
                style={{ color: BRAND_COLORS.warning }}
              >
                Threats (External -)
              </h4>
            </div>
            <ul className="space-y-2">
              {swotThreats.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: BRAND_COLORS.warning }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
