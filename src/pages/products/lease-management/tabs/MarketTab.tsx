// Lease Management - Market Tab Component
import React, { useState } from "react";
import {
  targetAudiences,
  companyPainPoints,
  marketCompetitors,
  competitorSummaryLessee,
  lessorTargetAudiences,
  lessorCompetitors,
  competitorSummaryLessor,
} from "../data";

// Lockated Brand Colors
const BRAND_COLORS = {
  primary: "#DA7756",
  darkBg: "#1e293b",
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

const SubSectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="px-4 py-2 font-semibold text-white text-sm"
    style={{ backgroundColor: BRAND_COLORS.primary }}
  >
    {children}
  </div>
);

export const MarketTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");

  return (
    <div className="space-y-6">
      {/* Perspective Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setPerspective("lessee")}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              perspective === "lessee"
                ? BRAND_COLORS.darkBg
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
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            backgroundColor:
              perspective === "lessor"
                ? BRAND_COLORS.darkBg
                : BRAND_COLORS.white,
            color:
              perspective === "lessor" ? BRAND_COLORS.white : BRAND_COLORS.text,
            border: `1px solid ${BRAND_COLORS.cardBorder}`,
          }}
        >
          Lessor Perspective
        </button>
      </div>

      {perspective === "lessee" ? (
        <div className="space-y-8">
          {/* SECTION 1 - TARGET AUDIENCE */}
          <div>
            <SectionTitle>SECTION 1 — TARGET AUDIENCE</SectionTitle>
            <SubSectionTitle>
              PART A — TARGET AUDIENCE (Geographies: India, Global)
            </SubSectionTitle>
            <div
              className="overflow-x-auto border"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table
                className="w-full text-xs"
                style={{ color: BRAND_COLORS.text }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: BRAND_COLORS.darkBg,
                      color: BRAND_COLORS.white,
                    }}
                  >
                    <th className="px-3 py-2 text-left font-semibold">
                      Audience Segment
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Demographics
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Industry and Company Profile
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Key Pain Points (3 per segment)
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      What happens if pain points are NOT solved
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      What good enough looks like to them
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Urgency
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Primary Buyer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {targetAudiences.map((audience, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      <td className="px-3 py-2 font-medium">
                        {audience.segment}
                      </td>
                      <td className="px-3 py-2">{audience.demographics}</td>
                      <td className="px-3 py-2">{audience.industryProfile}</td>
                      <td className="px-3 py-2">
                        {audience.painPoints?.map((p, i) => (
                          <div key={i}>
                            {i + 1}. {p}
                          </div>
                        ))}
                      </td>
                      <td className="px-3 py-2">{audience.unsolved}</td>
                      <td className="px-3 py-2">{audience.goodEnough}</td>
                      <td className="px-3 py-2">{audience.urgency}</td>
                      <td className="px-3 py-2">{audience.buyerTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PART B - COMPANY-LEVEL PAIN POINTS */}
          <div>
            <SubSectionTitle>
              PART B — COMPANY-LEVEL PAIN POINTS (India and Global)
            </SubSectionTitle>
            <div
              className="overflow-x-auto border"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table
                className="w-full text-xs"
                style={{ color: BRAND_COLORS.text }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: BRAND_COLORS.darkBg,
                      color: BRAND_COLORS.white,
                    }}
                  >
                    <th className="px-3 py-2 text-left font-semibold">
                      Company Type and Size
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Pain Point 1
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Pain Point 2
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Pain Point 3
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Cost / Risk if unsolved
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companyPainPoints.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      <td className="px-3 py-2 font-medium">
                        {item.companyType}
                      </td>
                      <td className="px-3 py-2">{item.painPoint1}</td>
                      <td className="px-3 py-2">{item.painPoint2}</td>
                      <td className="px-3 py-2">{item.painPoint3}</td>
                      <td className="px-3 py-2">{item.costRisk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2 - COMPETITOR MAPPING */}
          <div>
            <SectionTitle>
              SECTION 2 — COMPETITOR MAPPING (10 Competitors, India and Global)
            </SectionTitle>
            <p
              className="text-xs px-3 py-2 italic"
              style={{
                color: BRAND_COLORS.textSecondary,
                backgroundColor: BRAND_COLORS.background,
              }}
            >
              India-specific and global competitors. Pricing in INR for India
              competitors, USD for global. All pricing approximate as of Q1
              2026.
            </p>
            <div
              className="overflow-x-auto border"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table
                className="w-full text-xs"
                style={{ color: BRAND_COLORS.text }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: BRAND_COLORS.darkBg,
                      color: BRAND_COLORS.white,
                    }}
                  >
                    <th className="px-3 py-2 text-left font-semibold w-8">#</th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Competitor
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Primary Target Customer
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Pricing Model and Approx Price (India INR / Global USD)
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      How buyers discover them
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Their 3 Strongest Features
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Their 3 Key Weaknesses
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Market Gap they leave open
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Recent product or marketing innovation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {marketCompetitors.map((comp, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      <td className="px-3 py-2 font-medium">{index + 1}</td>
                      <td className="px-3 py-2 font-medium">
                        {comp.competitor}
                      </td>
                      <td className="px-3 py-2">
                        {comp.primaryTargetCustomer}
                      </td>
                      <td className="px-3 py-2">{comp.pricingModel}</td>
                      <td className="px-3 py-2">{comp.howBuyersDiscover}</td>
                      <td className="px-3 py-2">{comp.strongestFeatures}</td>
                      <td className="px-3 py-2">{comp.keyWeaknesses}</td>
                      <td className="px-3 py-2">{comp.marketGap}</td>
                      <td className="px-3 py-2">{comp.recentInnovation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMPETITOR SUMMARY */}
          <div>
            <SectionTitle>COMPETITOR SUMMARY</SectionTitle>
            <div
              className="px-4 py-3 text-sm"
              style={{
                backgroundColor: BRAND_COLORS.background,
                color: BRAND_COLORS.text,
                borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
              }}
            >
              {competitorSummaryLessee}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* LESSOR - SECTION 1 — TARGET AUDIENCE */}
          <div>
            <SectionTitle>SECTION 1 — TARGET AUDIENCE (LESSOR)</SectionTitle>
            <SubSectionTitle>
              PART A — TARGET AUDIENCE FOR LESSOR USE CASE (Geographies: India,
              Global)
            </SubSectionTitle>
            <div
              className="overflow-x-auto border"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table
                className="w-full text-xs"
                style={{ color: BRAND_COLORS.text }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: BRAND_COLORS.darkBg,
                      color: BRAND_COLORS.white,
                    }}
                  >
                    <th className="px-3 py-2 text-left font-semibold">
                      Audience Segment
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Who They Are
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Size of Segment
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Primary Pain Point
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      What They Need Most
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Decision Maker
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Budget Range
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessorTargetAudiences.map((audience, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      <td className="px-3 py-2 font-medium">
                        {audience.segment}
                      </td>
                      <td className="px-3 py-2">{audience.whoTheyAre}</td>
                      <td className="px-3 py-2">{audience.sizeOfSegment}</td>
                      <td className="px-3 py-2">{audience.primaryPainPoint}</td>
                      <td className="px-3 py-2">{audience.whatTheyNeedMost}</td>
                      <td className="px-3 py-2">{audience.decisionMaker}</td>
                      <td className="px-3 py-2">{audience.budgetRange}</td>
                      <td className="px-3 py-2">{audience.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LESSOR - SECTION 2: COMPETITOR MAPPING */}
          <div>
            <SectionTitle>
              SECTION 2 — COMPETITOR MAPPING (LESSOR PERSPECTIVE)
            </SectionTitle>
            <p
              className="text-xs px-3 py-2 italic"
              style={{
                color: BRAND_COLORS.textSecondary,
                backgroundColor: BRAND_COLORS.background,
              }}
            >
              How the same 10 competitors position for the LESSOR use case
            </p>
            <div
              className="overflow-x-auto border"
              style={{ borderColor: BRAND_COLORS.cardBorder }}
            >
              <table
                className="w-full text-xs"
                style={{ color: BRAND_COLORS.text }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: BRAND_COLORS.darkBg,
                      color: BRAND_COLORS.white,
                    }}
                  >
                    <th className="px-3 py-2 text-left font-semibold w-8">#</th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Competitor
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Lessor Use Case Coverage
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Key Lessor Features
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Pricing (Lessor)
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Lessor Market Position
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      India Lessor Fit
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Our Advantage vs This Competitor
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Threat Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessorCompetitors.map((comp, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? BRAND_COLORS.white
                            : BRAND_COLORS.background,
                        borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
                      }}
                    >
                      <td className="px-3 py-2 font-medium">{index + 1}</td>
                      <td className="px-3 py-2 font-medium">
                        {comp.competitor}
                      </td>
                      <td className="px-3 py-2">
                        {comp.lessorUseCaseCoverage}
                      </td>
                      <td className="px-3 py-2">{comp.keyLessorFeatures}</td>
                      <td className="px-3 py-2">{comp.pricing}</td>
                      <td className="px-3 py-2">{comp.lessorMarketPosition}</td>
                      <td className="px-3 py-2">{comp.indiaLessorFit}</td>
                      <td className="px-3 py-2">{comp.ourAdvantage}</td>
                      <td className="px-3 py-2">{comp.threatLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMPETITOR SUMMARY — LESSOR */}
          <div>
            <SectionTitle>COMPETITOR SUMMARY — LESSOR</SectionTitle>
            <div
              className="px-4 py-3 text-sm"
              style={{
                backgroundColor: BRAND_COLORS.background,
                color: BRAND_COLORS.text,
                borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
              }}
            >
              {competitorSummaryLessor}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketTab;
