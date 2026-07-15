// Lease Management - Business Plan Builder Tab Component
import React, { useState } from "react";
import {
  businessPlanQuestions,
  lessorBusinessPlanQuestions,
  founderReviewChecklist,
} from "../data";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  darkBg: "#DA7756",
  background: "#F6F4EE",
  text: "#2C2C2C",
  textSecondary: "#5A5A5A",
  cardBorder: "#C4B89D",
  white: "#FFFFFF",
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-4 py-3 font-bold text-white text-sm"
    style={{ backgroundColor: BRAND_COLORS.darkBg }}
  >
    {children}
  </div>
);

const QuestionHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-4 py-2 font-semibold text-white text-sm"
    style={{ backgroundColor: "#DA7756" }}
  >
    {children}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td
    className="px-4 py-2 font-semibold align-top"
    style={{
      color: BRAND_COLORS.primary,
      backgroundColor: "#F6F4EE",
      borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
      borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
      width: 160,
      minWidth: 140,
    }}
  >
    {children}
  </td>
);

export const BusinessPlanTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  const questions =
    perspective === "lessee"
      ? businessPlanQuestions
      : lessorBusinessPlanQuestions;

  return (
    <div className="space-y-6">
      {/* Perspective Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setPerspective("lessee")}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor:
              perspective === "lessee"
                ? BRAND_COLORS.primary
                : BRAND_COLORS.white,
            color:
              perspective === "lessee" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessee Perspective
        </button>
        <button
          onClick={() => setPerspective("lessor")}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor:
              perspective === "lessor"
                ? BRAND_COLORS.primary
                : BRAND_COLORS.white,
            color:
              perspective === "lessor" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessor Perspective
        </button>
      </div>

      {/* Title Section */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: BRAND_COLORS.cardBorder }}
      >
        <SectionTitle>
          Business Plan Builder —{" "}
          {perspective === "lessee" ? "LESSEE" : "LESSOR"} PERSPECTIVE
        </SectionTitle>
        <div
          className="px-4 py-2 text-sm"
          style={{
            color: BRAND_COLORS.textSecondary,
            backgroundColor: BRAND_COLORS.background,
          }}
        >
          Purpose: Pre-filled answers to all 10 business plan questions, written
          in first-person as the founder, grounded in all data from Tabs 1–6.
          India primary, Global secondary.
        </div>
      </div>

      {/* Questions */}
      {questions.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <QuestionHeader>{item.question}</QuestionHeader>
          <table
            className="w-full text-sm border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <tbody>
              {/* Suggested Answer */}
              <tr>
                <FieldLabel>SUGGESTED ANSWER</FieldLabel>
                <td
                  className="px-4 py-3"
                  style={{
                    color: BRAND_COLORS.text,
                    backgroundColor: BRAND_COLORS.white,
                    borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                    lineHeight: 1.6,
                  }}
                >
                  {item.suggestedAnswer || item.answer}
                </td>
              </tr>
              {/* Source */}
              {item.source && (
                <tr>
                  <td
                    className="px-4 py-2 font-semibold align-top"
                    style={{
                      color: BRAND_COLORS.text,
                      backgroundColor: BRAND_COLORS.background,
                      borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                    }}
                  >
                    Source:
                  </td>
                  <td
                    className="px-4 py-2"
                    style={{
                      color: BRAND_COLORS.textSecondary,
                      backgroundColor: BRAND_COLORS.background,
                      borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                    }}
                  >
                    {item.source}
                  </td>
                </tr>
              )}
              {/* Founder Review */}
              {item.founderNote && (
                <tr>
                  <td
                    className="px-4 py-2 font-semibold align-top"
                    style={{
                      color: BRAND_COLORS.text,
                      backgroundColor: BRAND_COLORS.white,
                      borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                    }}
                  >
                    Founder review:
                  </td>
                  <td
                    className="px-4 py-2"
                    style={{
                      color: BRAND_COLORS.textSecondary,
                      backgroundColor: BRAND_COLORS.white,
                      borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                    }}
                  >
                    {item.founderNote}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}

      {/* Founder Review Checklist - only show for lessee */}
      {perspective === "lessee" && (
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: BRAND_COLORS.cardBorder }}
        >
          <SectionTitle>
            FOUNDER REVIEW CHECKLIST — Items requiring personal founder input
            before use
          </SectionTitle>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm border-collapse"
              style={{ minWidth: 800 }}
            >
              <thead>
                <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                  {[
                    "Checkbox",
                    "Question",
                    "What to verify or personalise",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left font-semibold"
                      style={{
                        color: BRAND_COLORS.text,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                        borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {founderReviewChecklist.map((item, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor:
                        i % 2 === 0
                          ? BRAND_COLORS.white
                          : BRAND_COLORS.background,
                    }}
                  >
                    <td
                      className="px-4 py-2 text-center"
                      style={{
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                        borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                        width: 80,
                      }}
                    >
                      [ ]
                    </td>
                    <td
                      className="px-4 py-2 font-medium"
                      style={{
                        color: BRAND_COLORS.text,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                        borderRight: `1px solid ${BRAND_COLORS.cardBorder}`,
                        minWidth: 250,
                      }}
                    >
                      {item.question}
                    </td>
                    <td
                      className="px-4 py-2"
                      style={{
                        color: BRAND_COLORS.textSecondary,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      {item.whatToVerify}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanTab;
