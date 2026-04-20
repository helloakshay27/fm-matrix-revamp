// Snag360 New - Enhancements Tab Component
import React, { useState } from "react";
import { enhancements } from "../data";
import {
  Lightbulb,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Zap,
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

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "#E53935";
    case "medium":
      return BRAND_COLORS.warning;
    case "low":
    default:
      return BRAND_COLORS.info;
  }
};

export const EnhancementsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedItem, setExpandedItem] = useState<number | null>(0);

  // Get unique categories and priorities
  const categories = ["all", ...new Set(enhancements.map((e) => e.category))];
  const priorities = ["all", ...new Set(enhancements.map((e) => e.priority))];

  const filteredEnhancements = enhancements.filter((enhancement) => {
    const matchesSearch =
      enhancement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enhancement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || enhancement.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "all" || enhancement.category === categoryFilter;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <Lightbulb
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
          Future Enhancements
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search enhancements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border text-sm pl-10"
            style={{
              borderColor: BRAND_COLORS.cardBorder,
              color: BRAND_COLORS.text,
            }}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: BRAND_COLORS.textSecondary }}
          />
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            color: BRAND_COLORS.text,
          }}
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority === "all" ? "All Priorities" : `${priority} Priority`}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            color: BRAND_COLORS.text,
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.primary }}
          >
            {enhancements.length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Enhancements
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <div className="text-2xl font-bold" style={{ color: "#E53935" }}>
            {enhancements.filter((e) => e.priority === "High").length}
          </div>
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
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.warning }}
          >
            {enhancements.filter((e) => e.priority === "Medium").length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Medium Priority
          </p>
        </div>
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            backgroundColor: BRAND_COLORS.white,
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.info }}
          >
            {categories.length - 1}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Categories
          </p>
        </div>
      </div>

      {/* Enhancements List */}
      <div className="space-y-4">
        {filteredEnhancements.length === 0 ? (
          <div
            className="text-center py-8 rounded-lg"
            style={{ backgroundColor: BRAND_COLORS.background }}
          >
            <Lightbulb
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: BRAND_COLORS.textSecondary }}
            />
            <p style={{ color: BRAND_COLORS.textSecondary }}>
              No enhancements found matching your criteria
            </p>
          </div>
        ) : (
          filteredEnhancements.map((enhancement, index) => {
            const originalIndex = enhancements.indexOf(enhancement);
            return (
              <div
                key={originalIndex}
                className="rounded-lg border overflow-hidden"
                style={{
                  borderColor:
                    expandedItem === originalIndex
                      ? BRAND_COLORS.primary
                      : BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                {/* Enhancement Header */}
                <button
                  className="w-full p-4 flex items-start justify-between text-left"
                  onClick={() =>
                    setExpandedItem(
                      expandedItem === originalIndex ? null : originalIndex
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${getPriorityColor(
                          enhancement.priority
                        )}15`,
                      }}
                    >
                      <Zap
                        className="w-5 h-5"
                        style={{
                          color: getPriorityColor(enhancement.priority),
                        }}
                      />
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {enhancement.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${getPriorityColor(
                              enhancement.priority
                            )}15`,
                            color: getPriorityColor(enhancement.priority),
                          }}
                        >
                          {enhancement.priority} Priority
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: BRAND_COLORS.background,
                            color: BRAND_COLORS.textSecondary,
                          }}
                        >
                          {enhancement.category}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded flex items-center gap-1"
                          style={{
                            backgroundColor: `${BRAND_COLORS.info}10`,
                            color: BRAND_COLORS.info,
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          {enhancement.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedItem === originalIndex ? (
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

                {/* Expanded Content */}
                {expandedItem === originalIndex && (
                  <div
                    className="px-4 pb-4 border-t"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    <div className="mt-4 space-y-4">
                      {/* Description */}
                      <div>
                        <h4
                          className="text-xs font-semibold uppercase mb-2"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          Description
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {enhancement.description}
                        </p>
                      </div>

                      {/* Benefit */}
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${BRAND_COLORS.success}10` }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Target
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.success }}
                          />
                          <h4
                            className="text-xs font-semibold uppercase"
                            style={{ color: BRAND_COLORS.success }}
                          >
                            Expected Benefit
                          </h4>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {enhancement.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Results Summary */}
      {filteredEnhancements.length > 0 && (
        <div
          className="text-center text-sm"
          style={{ color: BRAND_COLORS.textSecondary }}
        >
          Showing {filteredEnhancements.length} of {enhancements.length}{" "}
          enhancements
        </div>
      )}
    </div>
  );
};
