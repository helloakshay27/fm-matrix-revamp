// Snag360 New - Assets Tab Component
import React, { useState } from "react";
import { assets, credentials } from "../data";
import {
  FolderOpen,
  Search,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Link,
  Video,
  Image,
  Key,
  Eye,
  EyeOff,
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

const getAssetIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "document":
      return FileText;
    case "video":
      return Video;
    case "image":
      return Image;
    case "link":
    default:
      return Link;
  }
};

export const AssetsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{
    [key: number]: boolean;
  }>({});

  // Get unique types
  const types = ["all", ...new Set(assets.map((a) => a.type))];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (index: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
        >
          <FolderOpen
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
          Assets & Resources
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search assets..."
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

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm"
          style={{
            borderColor: BRAND_COLORS.cardBorder,
            color: BRAND_COLORS.text,
          }}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type}
            </option>
          ))}
        </select>
      </div>

      {/* Assets Grid */}
      <section>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: BRAND_COLORS.text }}
        >
          Available Assets
        </h3>
        {filteredAssets.length === 0 ? (
          <div
            className="text-center py-8 rounded-lg"
            style={{ backgroundColor: BRAND_COLORS.background }}
          >
            <FolderOpen
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: BRAND_COLORS.textSecondary }}
            />
            <p style={{ color: BRAND_COLORS.textSecondary }}>
              No assets found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset, index) => {
              const Icon = getAssetIcon(asset.type);
              return (
                <div
                  key={index}
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: BRAND_COLORS.cardBorder,
                    backgroundColor: BRAND_COLORS.white,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: BRAND_COLORS.primary }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold truncate"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {asset.name}
                      </h4>
                      <p
                        className="text-xs mt-1"
                        style={{ color: BRAND_COLORS.textSecondary }}
                      >
                        {asset.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: BRAND_COLORS.background,
                            color: BRAND_COLORS.textSecondary,
                          }}
                        >
                          {asset.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-3 pt-3 border-t flex gap-2"
                    style={{ borderColor: BRAND_COLORS.cardBorder }}
                  >
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: BRAND_COLORS.primary,
                        color: BRAND_COLORS.white,
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                    <button
                      onClick={() => handleCopy(asset.url, `asset-${index}`)}
                      className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        color: BRAND_COLORS.text,
                      }}
                    >
                      {copiedId === `asset-${index}` ? (
                        <Check
                          className="w-4 h-4"
                          style={{ color: BRAND_COLORS.success }}
                        />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Credentials Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${BRAND_COLORS.warning}15` }}
          >
            <Key className="w-5 h-5" style={{ color: BRAND_COLORS.warning }} />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ color: BRAND_COLORS.text }}
          >
            Demo Credentials
          </h3>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: `${BRAND_COLORS.warning}05`,
            borderColor: BRAND_COLORS.warning,
          }}
        >
          <p
            className="text-sm mb-4"
            style={{ color: BRAND_COLORS.textSecondary }}
          >
            Use these credentials for demo and testing purposes only.
          </p>
          <div className="space-y-4">
            {credentials.map((cred, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
                style={{
                  borderColor: BRAND_COLORS.cardBorder,
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4
                    className="font-semibold"
                    style={{ color: BRAND_COLORS.text }}
                  >
                    {cred.environment}
                  </h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor:
                        cred.role === "Admin"
                          ? `${BRAND_COLORS.primary}15`
                          : BRAND_COLORS.background,
                      color:
                        cred.role === "Admin"
                          ? BRAND_COLORS.primary
                          : BRAND_COLORS.textSecondary,
                    }}
                  >
                    {cred.role}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {/* Username */}
                  <div>
                    <label
                      className="text-xs font-medium block mb-1"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      Username
                    </label>
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded border"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor: BRAND_COLORS.background,
                      }}
                    >
                      <span
                        className="flex-1 text-sm"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {cred.username}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(cred.username, `username-${index}`)
                        }
                      >
                        {copiedId === `username-${index}` ? (
                          <Check
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.success }}
                          />
                        ) : (
                          <Copy
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Password */}
                  <div>
                    <label
                      className="text-xs font-medium block mb-1"
                      style={{ color: BRAND_COLORS.textSecondary }}
                    >
                      Password
                    </label>
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded border"
                      style={{
                        borderColor: BRAND_COLORS.cardBorder,
                        backgroundColor: BRAND_COLORS.background,
                      }}
                    >
                      <span
                        className="flex-1 text-sm font-mono"
                        style={{ color: BRAND_COLORS.text }}
                      >
                        {showPasswords[index] ? cred.password : "••••••••"}
                      </span>
                      <button onClick={() => togglePasswordVisibility(index)}>
                        {showPasswords[index] ? (
                          <EyeOff
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          />
                        ) : (
                          <Eye
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(cred.password, `password-${index}`)
                        }
                      >
                        {copiedId === `password-${index}` ? (
                          <Check
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.success }}
                          />
                        ) : (
                          <Copy
                            className="w-4 h-4"
                            style={{ color: BRAND_COLORS.textSecondary }}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg"
        style={{ backgroundColor: BRAND_COLORS.background }}
      >
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.primary }}
          >
            {assets.length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Total Assets
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.info }}
          >
            {types.length - 1}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Asset Types
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.warning }}
          >
            {credentials.length}
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Credentials
          </p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.success }}
          >
            Active
          </div>
          <p className="text-xs" style={{ color: BRAND_COLORS.textSecondary }}>
            Status
          </p>
        </div>
      </div>
    </div>
  );
};
