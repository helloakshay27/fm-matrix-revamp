// Lease Management - Use Cases Tab Component
import React, { useState } from "react";
import { useCases } from "../data";
import {
  Target,
  Star,
  Briefcase,
  Building2,
  Warehouse,
  ShoppingBag,
  Landmark,
  Factory,
  GraduationCap,
  Hospital,
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  UserCheck,
  User,
} from "lucide-react";

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

const industryIcons: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  "Retail Chains and Organised Retail": ShoppingBag,
  "Commercial Real Estate Occupiers (BFSI and IT)": Building2,
  "Property Management Companies": Briefcase,
  "Industrial and Logistics": Warehouse,
  "Healthcare and Diagnostics": Hospital,
  Education: GraduationCap,
  "Government and PSUs": Landmark,
  Manufacturing: Factory,
  Hospitality: Home,
  "Co-working Operators": Users,
};

export const UseCasesTab: React.FC = () => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const sortedUseCases = [...useCases].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <Target className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Industry Use Cases
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Ranked by market fit and implementation potential
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            {useCases.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Industries Covered
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
            Top 5
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            High Priority
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
            Multi
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Lease Types
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#0D9488" }}>
            India
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Focus Market
          </p>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {sortedUseCases.map((useCase, index) => {
          const IconComponent = industryIcons[useCase.industry] || Briefcase;
          const isTopRanked = (useCase.rank || 99) <= 3;
          const isExpanded = expandedCards.has(index);

          return (
            <div
              key={index}
              className="rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-md"
              style={{
                borderColor: isTopRanked
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Card Header */}
              <div
                className="px-5 py-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(index)}
                style={{
                  backgroundColor: isTopRanked
                    ? BRAND_COLORS.primaryLight
                    : BRAND_COLORS.background,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: isTopRanked
                        ? BRAND_COLORS.primary
                        : BRAND_COLORS.primaryLight,
                    }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{
                        color: isTopRanked
                          ? BRAND_COLORS.white
                          : BRAND_COLORS.primary,
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-semibold"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {useCase.industry}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {useCase.rank && (
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}
                      style={{
                        backgroundColor: isTopRanked
                          ? BRAND_COLORS.primary
                          : BRAND_COLORS.background,
                        color: isTopRanked
                          ? BRAND_COLORS.white
                          : BRAND_COLORS.textSecondary,
                      }}
                    >
                      {isTopRanked && <Star className="w-3 h-3" />}#
                      {useCase.rank}
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp
                      className="w-4 h-4"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-4 h-4"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    />
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-4">
                {/* How Relevant */}
                {useCase.howRelevant && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-1"
                      style={{ color: BRAND_COLORS.primary }}
                    >
                      How It Helps
                    </h4>
                    <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
                      {isExpanded
                        ? useCase.howRelevant
                        : useCase.howRelevant.slice(0, 150) + "..."}
                    </p>
                  </div>
                )}

                {/* Ideal Profile */}
                {useCase.idealProfile && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-1"
                      style={{ color: BRAND_COLORS.secondaryGreen }}
                    >
                      Ideal Profile
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {isExpanded
                        ? useCase.idealProfile
                        : useCase.idealProfile.slice(0, 100) + "..."}
                    </p>
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && (
                  <>
                    {/* Urgency */}
                    {useCase.urgency && (
                      <div className="flex items-start gap-2">
                        <Clock
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: "#D97706" }}
                        />
                        <div>
                          <h4
                            className="text-sm font-semibold mb-1"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            Urgency
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          >
                            {useCase.urgency}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Primary Buyer */}
                    {useCase.primaryBuyer && (
                      <div className="flex items-start gap-2">
                        <UserCheck
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: BRAND_COLORS.primary }}
                        />
                        <div>
                          <h4
                            className="text-sm font-semibold mb-1"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            Primary Buyer
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          >
                            {useCase.primaryBuyer}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Primary User */}
                    {useCase.primaryUser && (
                      <div className="flex items-start gap-2">
                        <User
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: BRAND_COLORS.secondaryGreen }}
                        />
                        <div>
                          <h4
                            className="text-sm font-semibold mb-1"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            Primary User
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          >
                            {useCase.primaryUser}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Market Fit Indicator */}
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className="text-xs"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    Market Fit:
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            i < 6 - (useCase.rank || 5)
                              ? BRAND_COLORS.primary
                              : BRAND_COLORS.cardBorder,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="rounded-xl border p-6"
        style={{
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primaryLight,
        }}
      >
        <h3
          className="font-semibold mb-4 flex items-center gap-2"
          style={{ color: BRAND_COLORS.text }}
        >
          <Target className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          Implementation Priority
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: BRAND_COLORS.primary }}
            >
              Top Priority
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Retail Chains, BFSI/IT Occupiers, Property Management
            </p>
          </div>
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: BRAND_COLORS.secondaryGreen }}
            >
              High Potential
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Industrial/Logistics, Healthcare, Education
            </p>
          </div>
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: "#0D9488" }}
            >
              Emerging
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Government/PSUs, Manufacturing, Hospitality, Co-working
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCasesTab;
