// Lease Management - Assets Tab Component
import React, { useState } from "react";
import { assets, credentials } from "../data";
import {
  FileBox,
  ExternalLink,
  Key,
  Copy,
  CheckCircle,
  FileText,
  Video,
  Presentation,
  Image,
  FileSpreadsheet,
  File,
  Lock,
  Unlock,
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

const assetTypeIcons: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  document: FileText,
  video: Video,
  presentation: Presentation,
  image: Image,
  spreadsheet: FileSpreadsheet,
  default: File,
};

const getAssetTypeIcon = (
  type: string
): React.FC<{ className?: string; style?: React.CSSProperties }> => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("doc") || lowerType.includes("pdf")) return FileText;
  if (lowerType.includes("video") || lowerType.includes("demo")) return Video;
  if (
    lowerType.includes("ppt") ||
    lowerType.includes("presentation") ||
    lowerType.includes("deck")
  )
    return Presentation;
  if (lowerType.includes("image") || lowerType.includes("screenshot"))
    return Image;
  if (
    lowerType.includes("excel") ||
    lowerType.includes("sheet") ||
    lowerType.includes("csv")
  )
    return FileSpreadsheet;
  return File;
};

export const AssetsTab: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Group assets by category
  const groupedAssets = assets.reduce(
    (acc, asset) => {
      const category = asset.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(asset);
      return acc;
    },
    {} as Record<string, typeof assets>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.primaryLight }}
        >
          <FileBox
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
            Product Assets & Credentials
          </h2>
          <p className="text-sm" style={{ color: BRAND_COLORS.textSecondary }}>
            Resources, documents, and access information
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
            {assets.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Assets
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
            {Object.keys(groupedAssets).length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Categories
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
            {credentials.length}
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Credentials
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
            Ready
          </p>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Status
          </p>
        </div>
      </div>

      {/* Assets Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileBox
            className="w-5 h-5"
            style={{ color: BRAND_COLORS.primary }}
          />
          <h3
            className="text-lg font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Product Assets
          </h3>
        </div>

        {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
          <div key={category} className="mb-6">
            <h4
              className="text-sm font-semibold mb-3 px-2"
              style={{ color: BRAND_COLORS.primary }}
            >
              {category}
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {categoryAssets.map((asset, index) => {
                const Icon = getAssetTypeIcon(asset.type);
                return (
                  <div
                    key={index}
                    className="rounded-xl border p-4 transition-all duration-300 hover:shadow-md"
                    style={{
                      borderColor: BRAND_COLORS.cardBorder,
                      backgroundColor: BRAND_COLORS.white,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: BRAND_COLORS.primary }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5
                          className="font-medium truncate"
                          style={{ color: BRAND_COLORS.text }}
                        >
                          {asset.name}
                        </h5>
                        <p
                          className="text-sm mt-1 line-clamp-2"
                          style={{ color: BRAND_COLORS.textSecondary }}
                        >
                          {asset.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: BRAND_COLORS.background,
                              color: BRAND_COLORS.textSecondary,
                            }}
                          >
                            {asset.type}
                          </span>
                          {asset.url && (
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
                              style={{ color: BRAND_COLORS.primary }}
                            >
                              Open
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Credentials Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5" style={{ color: BRAND_COLORS.primary }} />
          <h3
            className="text-lg font-semibold"
            style={{
              color: BRAND_COLORS.text,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Access Credentials
          </h3>
        </div>
        <div
          className="rounded-xl border p-4 mb-4"
          style={{
            borderColor: "#D97706",
            backgroundColor: `${BRAND_COLORS.warning}20`,
          }}
        >
          <p className="text-sm" style={{ color: "#92400E" }}>
            ⚠️ These credentials are for demo and testing purposes only. Keep
            them secure and do not share publicly.
          </p>
        </div>
        <div className="space-y-4">
          {credentials.map((cred, index) => (
            <div
              key={index}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: BRAND_COLORS.cardBorder,
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              <div
                className="px-5 py-3 flex items-center gap-3"
                style={{ backgroundColor: BRAND_COLORS.background }}
              >
                <Key
                  className="w-5 h-5"
                  style={{ color: BRAND_COLORS.primary }}
                />
                <h4
                  className="font-semibold"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {cred.platform}
                </h4>
              </div>
              <div className="p-5 space-y-4">
                {/* Username */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label
                      className="text-xs font-medium"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      Username / Email
                    </label>
                    <p
                      className="text-sm mt-1 font-mono"
                      style={{ color: BRAND_COLORS.text }}
                    >
                      {cred.username}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(cred.username, `user-${index}`)
                    }
                    className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    {copiedField === `user-${index}` ? (
                      <CheckCircle
                        className="w-4 h-4"
                        style={{ color: BRAND_COLORS.secondaryGreen }}
                      />
                    ) : (
                      <Copy
                        className="w-4 h-4"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      />
                    )}
                  </button>
                </div>

                {/* Access Level */}
                <div>
                  <label
                    className="text-xs font-medium"
                    style={{ color: BRAND_COLORS.textSecondary }}
                  >
                    Access Level
                  </label>
                  <p
                    className="text-sm mt-1 p-3 rounded-lg"
                    style={{
                      backgroundColor: BRAND_COLORS.background,
                      color: BRAND_COLORS.text,
                    }}
                  >
                    {cred.accessLevel}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Summary */}
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
          <FileBox
            className="w-5 h-5"
            style={{ color: BRAND_COLORS.primary }}
          />
          Asset Usage Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: BRAND_COLORS.primary }}
            >
              For Sales Teams
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Use product decks, demo videos, and case studies for client
              presentations. Always use the latest versions from this
              repository.
            </p>
          </div>
          <div>
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: BRAND_COLORS.primary }}
            >
              For Support Teams
            </h4>
            <p className="text-sm" style={{ color: BRAND_COLORS.text }}>
              Access credentials are environment-specific. Never share
              production credentials externally. Use demo environment for
              customer training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsTab;
