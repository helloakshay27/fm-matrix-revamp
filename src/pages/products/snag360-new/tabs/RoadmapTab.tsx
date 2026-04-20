// Snag360 New - Roadmap Tab Component
import React, { useState } from "react";
import { roadmapPhases } from "../data";
import { Map, CheckCircle, Clock, Calendar, ChevronRight } from "lucide-react";

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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return BRAND_COLORS.success;
    case "in progress":
      return BRAND_COLORS.warning;
    case "planned":
    default:
      return BRAND_COLORS.info;
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    case "in progress":
      return <Clock className="w-4 h-4" />;
    case "planned":
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

export const RoadmapTab: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <Map className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
        </div>
        <h2
          className="text-xl font-semibold"
          style={{
            color: BRAND_COLORS.text,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Product Roadmap
        </h2>
      </div>

      {/* Phase Timeline */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-0">
        {roadmapPhases.map((phase, index) => (
          <button
            key={index}
            className={`flex-1 p-4 rounded-lg md:rounded-none ${
              index === 0
                ? "md:rounded-l-lg"
                : index === roadmapPhases.length - 1
                  ? "md:rounded-r-lg"
                  : ""
            } transition-all`}
            style={{
              backgroundColor:
                activePhase === index
                  ? BRAND_COLORS.primary
                  : BRAND_COLORS.background,
              color:
                activePhase === index ? BRAND_COLORS.white : BRAND_COLORS.text,
            }}
            onClick={() => setActivePhase(index)}
          >
            <div className="text-sm font-medium">{phase.phase}</div>
            <div
              className="text-xs mt-1"
              style={{
                color:
                  activePhase === index
                    ? "rgba(255,255,255,0.8)"
                    : BRAND_COLORS.textSecondary,
              }}
            >
              {phase.timeline}
            </div>
          </button>
        ))}
      </div>

      {/* Active Phase Details */}
      {roadmapPhases[activePhase] && (
        <div
          className="rounded-lg border p-6"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: BRAND_COLORS.text }}
              >
                {roadmapPhases[activePhase].phase}
              </h3>
              <p
                className="text-sm"
                style={{ color: BRAND_COLORS.textSecondary }}
              >
                {roadmapPhases[activePhase].focus}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{
                backgroundColor: `${getStatusColor(
                  roadmapPhases[activePhase].status
                )}15`,
                color: getStatusColor(roadmapPhases[activePhase].status),
              }}
            >
              {getStatusIcon(roadmapPhases[activePhase].status)}
              {roadmapPhases[activePhase].status}
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <h4
              className="text-sm font-semibold uppercase"
              style={{ color: BRAND_COLORS.textSecondary }}
            >
              Key Deliverables
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {roadmapPhases[activePhase].deliverables.map(
                (deliverable, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: BRAND_COLORS.background }}
                  >
                    <ChevronRight
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.primary }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {deliverable}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Roadmap View */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: BRAND_COLORS.text }}
        >
          Complete Roadmap Overview
        </h3>
        <div className="space-y-6">
          {roadmapPhases.map((phase, index) => (
            <div key={index} className="flex gap-4">
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getStatusColor(phase.status) }}
                >
                  {index + 1}
                </div>
                {index < roadmapPhases.length - 1 && (
                  <div
                    className="w-0.5 flex-1 my-2"
                    style={{ backgroundColor: BRAND_COLORS.cardBorder }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className="flex-1 rounded-lg border p-4 mb-2"
                style={{
                  borderColor: BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {phase.phase}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      {phase.focus}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: BRAND_COLORS.background,
                        color: BRAND_COLORS.textSecondary,
                      }}
                    >
                      {phase.timeline}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${getStatusColor(phase.status)}15`,
                        color: getStatusColor(phase.status),
                      }}
                    >
                      {phase.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {phase.deliverables.slice(0, 4).map((deliverable, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${BRAND_COLORS.primary}10`,
                        color: BRAND_COLORS.primary,
                      }}
                    >
                      {deliverable}
                    </span>
                  ))}
                  {phase.deliverables.length > 4 && (
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: BRAND_COLORS.background,
                        color: BRAND_COLORS.textSecondary,
                      }}
                    >
                      +{phase.deliverables.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
