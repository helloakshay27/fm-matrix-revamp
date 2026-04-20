// Lease Management - Roadmap Tab Component
import React, { useState } from "react";
import { roadmapLessee, roadmapLessor } from "../data";
import {
  Map,
  Calendar,
  ChevronRight,
  Rocket,
  Target,
  Zap,
  AlertTriangle,
  Users,
  TrendingUp,
  Flag,
  Building,
  Briefcase,
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

const phaseIcons: Record<
  number,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  1: Rocket,
  2: Target,
  3: Zap,
};

const priorityColors: Record<string, { bg: string; text: string }> = {
  P1: { bg: "#FEE2E2", text: "#DC2626" },
  P2: { bg: `${BRAND_COLORS.warning}40`, text: "#D97706" },
  P3: { bg: `${BRAND_COLORS.success}40`, text: "#059669" },
};

export const RoadmapTab: React.FC = () => {
  const [perspective, setPerspective] = useState<"lessee" | "lessor">("lessee");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const roadmapData = perspective === "lessee" ? roadmapLessee : roadmapLessor;

  const toggleItem = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const totalItems = roadmapData.reduce(
    (acc, phase) => acc + phase.items.length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Perspective Toggle */}
      <div
        className="flex items-center justify-center gap-4 p-4 rounded-xl"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: BRAND_COLORS.text }}
        >
          View as:
        </span>
        <div
          className="inline-flex gap-1 p-1 rounded-full border"
          style={{
            backgroundColor: BRAND_COLORS.white,
            borderColor: BRAND_COLORS.cardBorder,
          }}
        >
          <button
            onClick={() => setPerspective("lessee")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                perspective === "lessee" ? BRAND_COLORS.primary : "transparent",
              color:
                perspective === "lessee"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.textSecondary,
            }}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Lessee (Tenant)
          </button>
          <button
            onClick={() => setPerspective("lessor")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                perspective === "lessor" ? BRAND_COLORS.primary : "transparent",
              color:
                perspective === "lessor"
                  ? BRAND_COLORS.white
                  : BRAND_COLORS.textSecondary,
            }}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Lessor (Owner)
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <Map className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Product Roadmap
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            {perspective === "lessee" ? "Lessee" : "Lessor"}-focused development
            timeline
          </p>
        </div>
      </div>

      {/* Progress Stats */}
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
            {roadmapData.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Phases
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
            {totalItems}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Features
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#D97706" }}>
            Immediate
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            to {perspective === "lessee" ? "18" : "24"} Months
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
            India
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Focus Market
          </p>
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-4">
        {roadmapData.map((phase, phaseIndex) => {
          const PhaseIcon = phaseIcons[phaseIndex + 1] || Rocket;
          const isExpanded = expandedPhase === phaseIndex + 1;

          return (
            <div
              key={phaseIndex}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {/* Phase Header */}
              <button
                onClick={() =>
                  setExpandedPhase(isExpanded ? null : phaseIndex + 1)
                }
                className="w-full px-5 py-4 flex items-center justify-between transition-colors hover:bg-gray-50"
                style={{ backgroundColor: BRAND_COLORS.background }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                  >
                    <PhaseIcon
                      className="w-5 h-5"
                      style={{ color: BRAND_COLORS.primary }}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className="font-semibold"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {phase.phase}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar
                        className="w-3 h-3"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {phase.timeline}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        •
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {phase.items.length} items
                      </span>
                    </div>
                    {phase.focus && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        Focus: {phase.focus}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  style={{ color: BRAND_COLORS.textSecondary }}
                />
              </button>

              {/* Phase Items */}
              {isExpanded && (
                <div
                  className="border-t divide-y"
                  style={{ borderColor: BRAND_COLORS.cardBorder }}
                >
                  {phase.items.map((item, itemIndex) => {
                    const itemKey = `${phaseIndex}-${itemIndex}`;
                    const isItemExpanded = expandedItems.has(itemKey);
                    const priorityConfig =
                      priorityColors[item.priority || "P2"] ||
                      priorityColors.P2;

                    return (
                      <div key={itemIndex} className="px-5 py-4">
                        <div
                          className="flex items-start gap-4 cursor-pointer"
                          onClick={() => toggleItem(itemKey)}
                        >
                          <div
                            className="p-1.5 rounded-full mt-0.5"
                            style={{
                              backgroundColor: BRAND_COLORS.primaryLight,
                            }}
                          >
                            <Flag
                              className="w-4 h-4"
                              style={{ color: BRAND_COLORS.primary }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4
                              className="font-medium"
                              style={{ color: BRAND_COLORS.text }}
                            >
                              {item.feature || item.item}
                            </h4>
                            {item.description && (
                              <p
                                className="text-sm mt-1"
                                style={{ color: BRAND_COLORS.textSecondary }}
                              >
                                {isItemExpanded
                                  ? item.description
                                  : item.description.slice(0, 100) + "..."}
                              </p>
                            )}
                          </div>
                          {item.priority && (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: priorityConfig.bg,
                                color: priorityConfig.text,
                              }}
                            >
                              {item.priority}
                            </span>
                          )}
                        </div>

                        {/* Expanded Details */}
                        {isItemExpanded && (
                          <div className="mt-4 ml-10 space-y-3">
                            {item.whyMatters && (
                              <div className="flex items-start gap-2">
                                <TrendingUp
                                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                                  style={{ color: BRAND_COLORS.primary }}
                                />
                                <div>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: BRAND_COLORS.text }}
                                  >
                                    Why It Matters:
                                  </span>
                                  <p
                                    className="text-xs mt-0.5"
                                    style={{
                                      color: BRAND_COLORS.textSecondary,
                                    }}
                                  >
                                    {item.whyMatters}
                                  </p>
                                </div>
                              </div>
                            )}
                            {item.segmentUnlocked && (
                              <div className="flex items-start gap-2">
                                <Users
                                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                                  style={{ color: BRAND_COLORS.secondaryGreen }}
                                />
                                <div>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: BRAND_COLORS.text }}
                                  >
                                    Segments Unlocked:
                                  </span>
                                  <p
                                    className="text-xs mt-0.5"
                                    style={{
                                      color: BRAND_COLORS.textSecondary,
                                    }}
                                  >
                                    {item.segmentUnlocked}
                                  </p>
                                </div>
                              </div>
                            )}
                            {item.dealRisk && (
                              <div className="flex items-start gap-2">
                                <AlertTriangle
                                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                                  style={{ color: "#D97706" }}
                                />
                                <div>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: BRAND_COLORS.text }}
                                  >
                                    Deal Risk:
                                  </span>
                                  <p
                                    className="text-xs mt-0.5"
                                    style={{
                                      color: BRAND_COLORS.textSecondary,
                                    }}
                                  >
                                    {item.dealRisk}
                                  </p>
                                </div>
                              </div>
                            )}
                            {item.marketSignal && (
                              <div className="flex items-start gap-2">
                                <Target
                                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                                  style={{ color: "#0D9488" }}
                                />
                                <div>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: BRAND_COLORS.text }}
                                  >
                                    Market Signal:
                                  </span>
                                  <p
                                    className="text-xs mt-0.5"
                                    style={{
                                      color: BRAND_COLORS.textSecondary,
                                    }}
                                  >
                                    {item.marketSignal}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="rounded-lg border p-4 flex flex-wrap gap-4 justify-center"
        style={{
          borderColor: BRAND_COLORS.cardBorder,
          backgroundColor: BRAND_COLORS.background,
        }}
      >
        {Object.entries(priorityColors).map(([priority, config]) => (
          <div key={priority} className="flex items-center gap-2">
            <div
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: config.bg, color: config.text }}
            >
              {priority}
            </div>
            <span className="text-xs" style={{ color: BRAND_COLORS.text }}>
              {priority === "P1"
                ? "Critical"
                : priority === "P2"
                  ? "Important"
                  : "Nice to Have"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapTab;
