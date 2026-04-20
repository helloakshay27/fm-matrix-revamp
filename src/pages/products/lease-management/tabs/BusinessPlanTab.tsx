// Lease Management - Business Plan Tab Component
import React from "react";
import { businessPlanQuestions } from "../data";
import {
  FileText,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  primaryLight: "rgba(218, 119, 86, 0.1)",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
  success: "#89F7E7",
  warning: "#EDC488",
  secondaryGreen: "#798C5E",
  secondaryTeal: "#9EC8BA",
};

export const BusinessPlanTab: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <FileText
            className="w-5 h-5"
            style={{ color: BRAND_COLORS.primary }}
          />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Business Plan Q&A
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Investor and stakeholder questions addressed
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.primary }}
          >
            {businessPlanQuestions.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Key Questions
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.secondaryGreen }}
          >
            Comprehensive
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Coverage
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.text }}
          >
            B2B SaaS
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Business Model
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {businessPlanQuestions.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="rounded-xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor: isExpanded
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-5 py-4 flex items-start gap-3 text-left transition-colors hover:bg-gray-50"
              >
                <div
                  className="p-1.5 rounded-lg mt-0.5 flex-shrink-0"
                  style={{
                    backgroundColor: isExpanded
                      ? BRAND_COLORS.primary
                      : BRAND_COLORS.primaryLight,
                  }}
                >
                  <HelpCircle
                    className="w-4 h-4"
                    style={{
                      color: isExpanded
                        ? BRAND_COLORS.white
                        : BRAND_COLORS.primary,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <span
                    className="font-medium"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  style={{ color: BRAND_COLORS.textSecondary }}
                />
              </button>

              {/* Answer */}
              {isExpanded && (
                <div
                  className="px-5 pb-5 border-t"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  <div
                    className="mt-4 p-4 rounded-lg"
                    style={{ backgroundColor: BRAND_COLORS.background }}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: BRAND_COLORS.secondaryGreen }}
                      />
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {item.suggestedAnswer || item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tip Section */}
      <div
        className="rounded-xl border p-5 flex items-start gap-4"
        style={{
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primaryLight,
        }}
      >
        <Lightbulb
          className="w-6 h-6 flex-shrink-0"
          style={{ color: BRAND_COLORS.primary }}
        />
        <div>
          <h4
            className="font-semibold mb-2"
            style={{ color: BRAND_COLORS.text }}
          >
            Pro Tip for Stakeholders
          </h4>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            These business plan questions form the foundation of our product
            strategy and market positioning. They are regularly updated based on
            market feedback, customer interviews, and competitive analysis to
            ensure our approach remains relevant and compelling.
          </p>
        </div>
      </div>

      {/* Expand/Collapse All */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setExpandedIndex(null)}
          className="px-4 py-2 rounded-lg text-sm border transition-all hover:bg-gray-50"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            color: BRAND_COLORS.textSecondary,
          }}
        >
          Collapse All
        </button>
      </div>
    </div>
  );
};

export default BusinessPlanTab;
