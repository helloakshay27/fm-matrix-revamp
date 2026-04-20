// Snag360 New - Business Plan Tab Component
import React, { useState } from "react";
import { businessPlanQuestions } from "../data";
import { FileText, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

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

export const BusinessPlanTab: React.FC = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = businessPlanQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const categories = [...new Set(businessPlanQuestions.map((q) => q.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
          >
            <FileText
              className="w-5 h-5"
              style={{ color: BRAND_COLORS.primary }}
            />
          </div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Business Plan Q&A
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg border text-sm pl-10"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              color: BRAND_COLORS.text,
            }}
          />
          <HelpCircle
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: BRAND_COLORS.textSecondary }}
          />
        </div>
      </div>

      {/* Category Quick Nav */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              backgroundColor: BRAND_COLORS.background,
              color: BRAND_COLORS.text,
            }}
            onClick={() => {
              const firstInCategory = businessPlanQuestions.findIndex(
                (q) => q.category === category
              );
              setExpandedQuestion(firstInCategory);
              // Scroll to element
              document
                .getElementById(`question-${firstInCategory}`)
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Q&A List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div
            className="text-center py-8 rounded-lg"
            style={{ backgroundColor: BRAND_COLORS.background }}
          >
            <HelpCircle
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: BRAND_COLORS.textSecondary }}
            />
            <p style={{ color: BRAND_COLORS.textSecondary }}>
              No questions found matching "{searchTerm}"
            </p>
          </div>
        ) : (
          filteredQuestions.map((item, index) => {
            const originalIndex = businessPlanQuestions.indexOf(item);
            return (
              <div
                key={originalIndex}
                id={`question-${originalIndex}`}
                className="rounded-lg border overflow-hidden"
                style={{
                  borderColor:
                    expandedQuestion === originalIndex
                      ? BRAND_COLORS.primary
                      : BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                {/* Question Header */}
                <button
                  className="w-full p-4 flex items-start justify-between text-left"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === originalIndex ? null : originalIndex
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS.primary }}
                    >
                      {originalIndex + 1}
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {item.question}
                      </h3>
                      <span
                        className="inline-block mt-1 text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: BRAND_COLORS.background,
                          color: BRAND_COLORS.textSecondary,
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {expandedQuestion === originalIndex ? (
                    <ChevronUp
                      className="w-5 h-5 flex-shrink-0 ml-2"
                      style={{ color: BRAND_COLORS.primary }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 ml-2"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    />
                  )}
                </button>

                {/* Answer */}
                {expandedQuestion === originalIndex && (
                  <div
                    className="px-4 pb-4 border-t"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    <div
                      className="mt-4 p-4 rounded-lg"
                      style={{ backgroundColor: BRAND_COLORS.background }}
                    >
                      <p
                        className="text-sm whitespace-pre-wrap"
                        style={{ color: BRAND_COLORS.text, lineHeight: 1.7 }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Card */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: BRAND_COLORS.cardBorder,
          backgroundColor: BRAND_COLORS.white,
        }}
      >
        <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.text }}>
          Business Plan Summary
        </h4>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.primary }}
            >
              {businessPlanQuestions.length}
            </div>
            <p
              className="text-xs"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Total Questions
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.success }}
            >
              {categories.length}
            </div>
            <p
              className="text-xs"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Categories
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.info }}
            >
              100%
            </div>
            <p
              className="text-xs"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Covered
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.warning }}
            >
              Ready
            </div>
            <p
              className="text-xs"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Investment Status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
