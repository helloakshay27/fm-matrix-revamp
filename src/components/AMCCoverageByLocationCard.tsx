import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  MapPin,
  ChevronRight,
  ChevronDown,
  Building2,
  Home,
  Map,
} from "lucide-react";
import { AMCLocationCoverageNode } from "@/services/amcAnalyticsAPI";

interface AMCCoverageByLocationCardProps {
  data: AMCLocationCoverageNode[] | null;
  onDownload: () => Promise<void>;
  colorPalette?: {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryLight: string;
    secondaryLight: string;
    tertiaryLight: string;
  };
  headerClassName?: string;
}

interface ExpandedNodes {
  [key: string]: boolean;
}

export function AMCCoverageByLocationCard({
  data,
  onDownload,
  colorPalette,
  headerClassName,
}: AMCCoverageByLocationCardProps) {
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});

  const palette = colorPalette || {
    primary: "#C4B99D",
    secondary: "#DAD6CA",
    tertiary: "#D5DBDB",
    primaryLight: "#DDD4C4",
    secondaryLight: "#E8E5DD",
    tertiaryLight: "#E5E9E9",
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Safely map level to an icon (handles undefined/null)
  const getLocationIcon = (level?: string) => {
    const l = String(level || "").toLowerCase();
    switch (l) {
      case "site":
        return (
          <Building2
            className="w-4 h-4"
            style={{ color: palette.primaryLight }}
          />
        );
      case "building":
        return <Home className="w-4 h-4" style={{ color: palette.primary }} />;
      case "floor":
        return <Map className="w-4 h-4" style={{ color: palette.secondary }} />;
      default:
        return (
          <MapPin className="w-4 h-4" style={{ color: palette.tertiary }} />
        );
    }
  };

  // Safely compute coverage color
  const getCoverageColor = (coveragePercentage?: number) => {
    const p = Number(coveragePercentage ?? 0);
    if (p >= 80) return "text-green-600 bg-green-50";
    if (p >= 60) return "text-yellow-600 bg-yellow-50";
    if (p >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const renderLocationNode = (
    node: AMCLocationCoverageNode,
    level: number = 0,
    parentId: string = ""
  ) => {
    const nodeId = `${parentId}-${String((node as any)?.name ?? "node")}-${level}`;
    const isExpanded = expandedNodes[nodeId];
    const hasChildren =
      Array.isArray((node as any)?.children) &&
      (node as any).children.length > 0;

    // Safe numeric values
    const total = Number((node as any)?.total ?? 0);
    const covered = Number((node as any)?.covered ?? 0);
    const percent = Number.isFinite(Number((node as any)?.percent))
      ? Number((node as any)?.percent)
      : total > 0
        ? (covered / total) * 100
        : 0;

    return (
      <div key={nodeId} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${
            level === 0
              ? "bg-blue-50 border-l-4 border-blue-200"
              : level === 1
                ? "bg-green-50 border-l-4 border-green-200 ml-4"
                : "bg-purple-50 border-l-4 border-purple-200 ml-8"
          }`}
          onClick={() => hasChildren && toggleNode(nodeId)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              {hasChildren &&
                (isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                ))}
              {getLocationIcon((node as any)?.level)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {(node as any)?.name ?? "—"}
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {(node as any)?.level ?? "location"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Assets</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{covered}</div>
              <div className="text-xs text-gray-500">Under AMC</div>
            </div>
            <div className="text-center">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCoverageColor(percent)}`}
              >
                {percent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {(node as any).children!.map(
              (child: AMCLocationCoverageNode, idx: number) => (
                <React.Fragment key={`${nodeId}-${idx}`}>
                  {renderLocationNode(child, level + 1, nodeId)}
                </React.Fragment>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  // Calculate summary statistics safely
  const totalLocations = Array.isArray(data) ? data.length : 0;
  const totalAssets = (Array.isArray(data) ? data : []).reduce(
    (sum, location: any) => sum + Number(location?.total ?? 0),
    0
  );
  const totalAssetsUnderAMC = (Array.isArray(data) ? data : []).reduce(
    (sum, location: any) => sum + Number(location?.covered ?? 0),
    0
  );
  const overallCoverage =
    totalAssets > 0 ? (totalAssetsUnderAMC / totalAssets) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3
          className="text-base font-semibold text-gray-900 flex items-center gap-2"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          <MapPin className="w-4 h-4 text-[#C72030]" />
          Coverage by Location
        </h3>
        <Download
          data-no-drag="true"
          className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDownload();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ pointerEvents: "auto" }}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden p-5">
        {/* Summary stat cards — guideline colors */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Locations",
              val: totalLocations,
              bg: "#EFEFFB",
              num: "#6B5EA8",
              Icon: Building2,
            },
            {
              label: "Total Assets",
              val: totalAssets,
              bg: "rgba(183,220,212,0.30)",
              num: "#2E7D6B",
              Icon: Home,
            },
            {
              label: "Under AMC",
              val: totalAssetsUnderAMC,
              bg: "rgba(133,189,246,0.20)",
              num: "#85BDF6",
              Icon: MapPin,
            },
            {
              label: "Coverage",
              val: `${overallCoverage.toFixed(1)}%`,
              bg: "rgba(227,144,144,0.15)",
              num: "#D97655",
              Icon: Map,
            },
          ].map(({ label, val, bg, num, Icon }) => (
            <div
              key={label}
              className="rounded-2xl px-4 py-5 text-center"
              style={{ backgroundColor: bg }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: num, fontFamily: "Work Sans, sans-serif" }}
              >
                {val}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <Icon className="w-3 h-3" style={{ color: num }} />
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Coverage Legend */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700">
            Coverage Levels:
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-xs text-gray-600">80%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span className="text-xs text-gray-600">60-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span className="text-xs text-gray-600">40-59%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span className="text-xs text-gray-600">&lt;40%</span>
          </div>
        </div>

        {/* Location Tree */}
        <div className="flex-1 overflow-y-auto" style={{ height: "400px" }}>
          {!data || (Array.isArray(data) ? data.length === 0 : false) ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  No location coverage data available
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {(() => {
                const list = Array.isArray(data)
                  ? data
                  : data
                    ? [data as any]
                    : [];
                return list.map((location, idx) => (
                  <React.Fragment key={`root-${idx}`}>
                    {renderLocationNode(location as any)}
                  </React.Fragment>
                ));
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
