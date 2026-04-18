import React from "react";
import { ProductData } from "./types";

export const getTagPillClasses = (tag: string) => {
  const t = tag.trim().toLowerCase();
  if (t.includes("core")) return "border-[#4B5563] text-[#4B5563] bg-gray-200/10";
  if (t.includes("today")) return "border-[#0E7490] text-[#0E7490] bg-[#CFFAFE]";
  if (t.includes("economics")) return "border-[#6B7280] text-[#6B7280] bg-gray-100/20";
  if (t.includes("module")) return "border-[#798C5E] text-[#798C5E] bg-gray-100/20";
  if (t.includes("usp")) return "border-gray-300 text-gray-700 bg-gray-100";
  return "border-[#D3D1C7] text-[#2C2C2C] bg-transparent";
};

export const getModuleTone = (moduleName: string) => {
  const name = moduleName.toLowerCase();
  if (name.includes("crm") || name.includes("support")) return "bg-gray-200/15 text-[#4B5563]";
  if (name.includes("activit")) return "bg-[#DFF6FB] text-[#0E7490]";
  if (name.includes("discover") || name.includes("search")) return "bg-gray-200/10 text-[#4B5563]";
  if (name.includes("engag") || name.includes("brand") || name.includes("media")) return "bg-gray-100/20 text-[#798C5E]";
  if (name.includes("service") || name.includes("value")) return "bg-gray-100/20 text-[#6B7280]";
  if (name.includes("loyal")) return "bg-gray-100 text-gray-700";
  return "bg-transparent text-[#2C2C2C]";
};

export const buildModuleIndexMap = (features: ProductData["extendedContent"]["detailedFeatures"]) => {
  const map = new globalThis.Map<string, number>();
  let currentIndex = 1;
  features?.forEach((item) => {
    const key = item.module.trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, currentIndex);
      currentIndex += 1;
    }
  });
  return map;
};

export const getDisplayModule = (moduleName: string, moduleIndexMap: Map<string, number>) => {
  if (/^\d+[.)\s-]/.test(moduleName.trim())) return moduleName;
  const index = moduleIndexMap.get(moduleName.trim().toLowerCase());
  return index ? `${index}. ${moduleName}` : moduleName;
};

export const buildSummarySheetRows = (productData: ProductData) => {
  const rows: { kind: "section" | "data"; label: string; detail: string; tag?: string }[] = [];
  const summaryData = productData.extendedContent?.productSummaryNew;
  const summaryFeatureModules =
    summaryData?.summaryFeatureModules?.map((item) => ({
      label: item.label,
      detail: item.detail,
    })) ??
    productData.userStories?.map((story) => ({
      label: story.title,
      detail: story.items.join(" | "),
    })) ?? [];
  const summaryUsps =
    summaryData?.summaryUsps?.map((item) => ({
      label: item.label,
      detail: item.detail,
    })) ??
    productData.usps?.map((usp, index) => ({
      label: `USP ${index + 1}`,
      detail: usp,
    })) ?? [];

  if (summaryData?.identity?.length) {
    rows.push({ kind: "section", label: "WHAT IT IS", detail: "", tag: "" });
  }
  summaryData?.identity?.forEach((item) => {
    rows.push({ kind: "data", label: item.field, detail: item.detail, tag: "Core" });
  });

  if (summaryData?.whoItIsFor?.length) {
    rows.push({ kind: "section", label: "WHO IT IS FOR", detail: "", tag: "" });
  }
  summaryData?.whoItIsFor?.forEach((item) => {
    rows.push({
      kind: "data",
      label: item.role,
      detail: item.useCase,
      tag: "Core",
    });
  });

  if (summaryData?.problemSolves?.length) {
    rows.push({ kind: "section", label: "PROBLEM IT SOLVES", detail: "", tag: "" });
  }
  summaryData?.problemSolves?.forEach((item) => {
    rows.push({ kind: "data", label: item.painPoint, detail: item.solution, tag: "Economics" });
  });

  if (summaryData?.today?.length) {
    rows.push({ kind: "section", label: "WHERE IT IS TODAY", detail: "", tag: "" });
  }
  summaryData?.today?.forEach((item) => {
    rows.push({ kind: "data", label: item.dimension, detail: item.state, tag: "Today" });
  });

  if (summaryFeatureModules.length) {
    rows.push({ kind: "section", label: "FEATURE SUMMARY BY MODULE", detail: "", tag: "" });
  }
  summaryFeatureModules.forEach((item) => {
    rows.push({ kind: "data", label: item.label, detail: item.detail, tag: "Module" });
  });

  if (summaryUsps.length) {
    rows.push({ kind: "section", label: "KEY USPs", detail: "", tag: "" });
  }
  summaryUsps.forEach((item) => {
    rows.push({ kind: "data", label: item.label, detail: item.detail, tag: "USP" });
  });

  if (summaryData?.tractionMilestones?.length) {
    rows.push({ kind: "section", label: "TRACTION AND MILESTONES", detail: "", tag: "" });
  }
  summaryData?.tractionMilestones?.forEach((item) => {
    rows.push({ kind: "data", label: item.label, detail: item.detail, tag: "Today" });
  });

  return rows;
};
