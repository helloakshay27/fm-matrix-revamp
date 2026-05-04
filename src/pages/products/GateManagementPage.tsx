import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useProductSecurity } from "./useProductSecurity";
import { SecurityOverlays } from "./SecurityOverlays";
import AssetsTab from "./tabs/AssetsTab";
import { ProductData } from "./types";

// ── Import research JSX files directly as React components ───────────────────
import GateFeatureListContent from "../../../24_06_24_Gate_Management_Research_Doc/feature_list.jsx";
import GateFeaturesAndPricingContent from "../../../24_06_24_Gate_Management_Research_Doc/features_and_pricing.jsx";
import GateEnhancementRoadmapContent from "../../../24_06_24_Gate_Management_Research_Doc/enhancement_roadmap.jsx";
import GateBusinessPlanContent from "../../../24_06_24_Gate_Management_Research_Doc/business_plan_builder.jsx";
import GateGtmStrategyContent from "../../../24_06_24_Gate_Management_Research_Doc/gtm_strategy.jsx";
import GateMarketAnalysisContent from "../../../24_06_24_Gate_Management_Research_Doc/market_analysis.jsx";
import GateMetricsContent from "../../../24_06_24_Gate_Management_Research_Doc/Metrics.jsx";
import GateProductRoadmapContent from "../../../24_06_24_Gate_Management_Research_Doc/Product_Roadmap.jsx";
import GateProductSummaryContent from "../../../24_06_24_Gate_Management_Research_Doc/product_summary.jsx";
import GateSwotAnalysisContent from "../../../24_06_24_Gate_Management_Research_Doc/swot_analysis.jsx";
import GateUseCasesContent from "../../../24_06_24_Gate_Management_Research_Doc/use_cases.jsx";

// ── Tab metadata ─────────────────────────────────────────────────────────────
const TAB_LABELS: Record<string, string> = {
  features: "Feature List",
  pricing: "Features and Pricing",
  enhancements: "Enhancement Roadmap",
  business: "Business Plan Builder",
  gtm: "GTM Strategy",
  market: "Market Analysis",
  metrics: "Metrics",
  roadmap: "Product Roadmap",
  summary: "Product Summary",
  swot: "SWOT Analysis",
  usecases: "Use Cases",
  assets: "Assets",
};

const TAB_ORDER = [
  "summary",
  "features",
  "market",
  "pricing",
  "usecases",
  "roadmap",
  "business",
  "gtm",
  "metrics",
  "swot",
  "enhancements",
  "assets",
];

const ASSETS_TAB_DATA: ProductData = {
  name: "Gate Management",
  description:
    "Smart Secure & QuikGate — Digitise and control access for visitors, vehicles, contractors, and materials.",
  brief: "",
  industries: "Residential · Commercial · Industrial · Hospitality",
  userStories: [],
  usps: [],
  includes: [],
  upSelling: [],
  integrations: [],
  decisionMakers: [],
  keyPoints: [],
  roi: [],
  assets: [],
  credentials: [],
  owner: "",
  ownerImage: "",
  extendedContent: {
    productSummaryNew: {
      identity: [],
      problemSolves: [],
      whoItIsFor: [],
      today: [],
    },
    detailedFeatures: [],
  },
};

// ── Scoped CSS — Lockated brand — enhanced manipulative table styling ─────────
const MANIPULATIVE_CSS = `
  /* ══════════════════════════════════════════════════════════════════
     GATE MANAGEMENT — ENHANCED MANIPULATIVE CSS
     • Card-wrapped tables with drop shadow
     • 32px gap between stacked table sections
     • Richer color hierarchy: s0-s13
     • Orange accent stripe on section headers
     • Smooth per-row hover tint
     • Refined scrollbar
  ══════════════════════════════════════════════════════════════════ */

  /* ── Hide Google Sheets chrome ───────────────────────────────────── */
  .gate-mgmt-page .row-headers-background,
  .gate-mgmt-page .column-headers-background,
  .gate-mgmt-page .row-header-wrapper,
  .gate-mgmt-page .freezebar-origin-ltr,
  .gate-mgmt-page tbody tr th,
  .gate-mgmt-page thead tr > th:first-child { display: none !important; }

  /* ── TABLE CARD WRAPPER — gap + shadow + rounded ─────────────────── */
  .gate-mgmt-page .ritz.grid-container {
    overflow-x: auto !important;
    width: 100% !important;
    background: #ffffff !important;
    margin-bottom: 24px !important;
    border-radius: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  /* ── Table reset ─────────────────────────────────────────────────── */
  .gate-mgmt-page .ritz .waffle {
    width: 100% !important;
    border-collapse: collapse !important;
    table-layout: auto !important;
  }
  .gate-mgmt-page .ritz .waffle col,
  .gate-mgmt-page .ritz .waffle thead th {
    width: auto !important;
    min-width: 80px !important;
  }

  /* ── Clean top/bottom edges for card look ────────────────────────── */
  .gate-mgmt-page .ritz .waffle tbody tr:first-child td,
  .gate-mgmt-page .ritz .waffle thead tr:first-child th { border-top: none !important; }
  .gate-mgmt-page .ritz .waffle tbody tr:last-child td { border-bottom: none !important; }

  /* ── Base cell: Poppins 12px, generous padding, soft border ─────── */
  .gate-mgmt-page .ritz td,
  .gate-mgmt-page .ritz th {
    font-family: 'Poppins', sans-serif !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: #3A3530 !important;
    background-color: #ffffff !important;
    vertical-align: top !important;
    padding: 10px 14px !important;
    border: 1px solid #EDE9E1 !important;
    line-height: 1.7 !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    transition: background-color 0.12s ease !important;
  }

  /* ── s0  Title bar — warm terracotta gradient ────────────────────── */
  .gate-mgmt-page .ritz .s0 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
    padding: 15px 16px !important;
    vertical-align: middle !important;
    border-bottom: 2px solid rgba(255,255,255,0.15) !important;
    text-shadow: none !important;
  }

  /* ── s1  Italic subtitle — warm cream with muted text ───────────── */
  .gate-mgmt-page .ritz .s1 {
    background-color: #FAF8F3 !important;
    color: rgba(58,53,48,0.55) !important;
    font-style: italic !important;
    font-size: 11px !important;
    padding: 8px 16px !important;
    vertical-align: middle !important;
    border-bottom: 1px solid #EDE9E1 !important;
  }

  /* ── s2  Spacer / section label — branded cream divider ─────────── */
  .gate-mgmt-page .ritz .s2 {
    background-color: #EDE8DF !important;
    color: #7A6A5A !important;
    font-size: 10.5px !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    padding: 5px 14px !important;
    border-top: 2px solid #D5CDBE !important;
    border-bottom: 1px solid #D5CDBE !important;
  }

  /* ── s3  Data row A — very light warm cream ──────────────────────── */
  .gate-mgmt-page .ritz .s3 {
    background-color: #FDFCF9 !important;
    color: #2C2C2C !important;
    font-weight: 400 !important;
  }

  /* ── s4  Data row B — clean white ───────────────────────────────── */
  .gate-mgmt-page .ritz .s4 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 400 !important;
  }

  /* ── s5  Column header — Snag360-style: orange bg, white text ───── */
  .gate-mgmt-page .ritz .s5 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 700 !important;
    font-size: 10.5px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.07em !important;
    padding: 11px 14px !important;
    border-bottom: none !important;
    border-top: none !important;
    vertical-align: middle !important;
    text-shadow: none !important;
  }

  /* ── s6  Alternating row A — warm parchment ─────────────────────── */
  .gate-mgmt-page .ritz .s6 {
    background-color: #FAF8F3 !important;
    color: #2C2C2C !important;
    vertical-align: top !important;
  }

  /* ── s7  Alternating row B — pure white ─────────────────────────── */
  .gate-mgmt-page .ritz .s7 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    vertical-align: top !important;
  }

  /* ── s8  Status / badge — warm amber pill ───────────────────────── */
  .gate-mgmt-page .ritz .s8 {
    background-color: #FEF3C7 !important;
    color: #92400E !important;
    font-weight: 600 !important;
    font-size: 11px !important;
    text-align: center !important;
    vertical-align: middle !important;
    border-left: 3px solid #F59E0B !important;
  }

  /* ── s9  Section header — DARK charcoal + orange left accent ───── */
  .gate-mgmt-page .ritz .s9 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 700 !important;
    font-size: 10.5px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    padding: 10px 14px 10px 16px !important;
    vertical-align: middle !important;
    border-left: 0 !important;
    border-top: none !important;
    text-shadow: none !important;
  }

  /* ── s10 Bold label — parchment bg, strong Lockated text ─────────── */
  .gate-mgmt-page .ritz .s10 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    border-right: 2px solid #C4B89D !important;
  }

  /* ── s11 Centered bold label — parchment bg ─────────────────────── */
  .gate-mgmt-page .ritz .s11 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    text-align: center !important;
  }

  /* ── s12 Centered bold white — white bg ─────────────────────────── */
  .gate-mgmt-page .ritz .s12 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    text-align: center !important;
  }

  /* ── s13 Bold white — white bg ──────────────────────────────────── */
  .gate-mgmt-page .ritz .s13 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
  }

  /* ── Row hover — Lockated warm orange tint ───────────────────────── */
  /* ── Scrollbar ───────────────────────────────────────────────────── */
  .gate-mgmt-page .ritz.grid-container::-webkit-scrollbar { height: 5px; }
  .gate-mgmt-page .ritz.grid-container::-webkit-scrollbar-track {
    background: #F0EDE5;
    border-radius: 10px;
  }
  .gate-mgmt-page .ritz.grid-container::-webkit-scrollbar-thumb {
    background: #C4B89D;
    border-radius: 10px;
  }
`;

// ── Main page component ───────────────────────────────────────────────────────
const GateManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="gate-mgmt-page min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300"
      style={{ filter: security.isBlurred ? "blur(20px)" : "none" }}
    >
      {/* Manipulative CSS – scoped to this page */}
      <style>{MANIPULATIVE_CSS}</style>

      <SecurityOverlays security={security} />

      {/* Header */}
      <div className="relative mb-4 flex flex-col items-center bg-[#F6F4EE] pt-4">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-4">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-[#2C2C2C] border border-[#C4B89D]/50 px-3 py-1.5 rounded-full hover:bg-[#DA7756]/8 hover:border-[#DA7756]/30 hover:text-[#DA7756] transition-all font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
          <div className="inline-block px-4 py-1.5 bg-[#DA7756]/10 text-[#DA7756] text-[10px] font-semibold rounded-full mb-3 tracking-[0.15em] uppercase border border-[#DA7756]/20">
            Residential · Commercial · Industrial · Hospitality
          </div>
          <h1 className="text-4xl font-semibold text-[#2C2C2C] mb-4 tracking-tight lg:text-5xl font-poppins">
            Gate Management
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            Smart Secure &amp; QuikGate — Digitise and control access for
            visitors, vehicles, contractors, and materials. Replace paper
            registers and WhatsApp approvals with a complete real-time digital
            audit trail.
          </p>
        </div>
      </div>

      {/* Tabs — exact Snag360Page structure */}
      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          <div
            ref={tabsScrollRef}
            className="overflow-x-auto no-scrollbar mb-8"
          >
            <div className="flex justify-start pb-2 px-1">
              <TabsList className="inline-flex min-w-max gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5 h-auto items-center justify-start">
                {TAB_ORDER.map((tabId) => (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                  >
                    {TAB_LABELS[tabId]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Feature List */}
          <TabsContent value="features" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Complete Feature List
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Blue rows = ★ USP features. Modules: Visitor Control, Delivery,
                Guest, Staff, Vehicle, Goods Movement, Patrolling, Incident,
                Parcel, Access Control, Multi-site, Analytics, Offline,
                Emergency, Valet.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateFeatureListContent />
            </div>
          </TabsContent>

          {/* Features & Pricing */}
          <TabsContent value="pricing" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Features vs Market &amp; Pricing
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Section 1: Feature comparison vs market | Section 2: Pricing
                landscape | Section 3: Competitive positioning | Section 4:
                Value propositions
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateFeaturesAndPricingContent />
            </div>
          </TabsContent>

          {/* Enhancement Roadmap */}
          <TabsContent value="enhancements" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Feature Enhancement Roadmap
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Future-state innovations only. AI-driven, MCP/cross-platform,
                and core enhancements. Blue rows = P1 high-impact.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateEnhancementRoadmapContent />
            </div>
          </TabsContent>

          {/* Business Plan Builder */}
          <TabsContent value="business" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Business Plan Builder
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                10 investor-ready Q&amp;A blocks. Each block: Question |
                Suggested answer | Source tab | Founder review flag.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateBusinessPlanContent />
            </div>
          </TabsContent>

          {/* GTM Strategy */}
          <TabsContent value="gtm" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — GTM Strategy
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Go-to-market playbook: target segments, channels, positioning,
                launch phasing, and growth levers.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateGtmStrategyContent />
            </div>
          </TabsContent>

          {/* Market Analysis */}
          <TabsContent value="market" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Market Analysis
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Target audience segments, company-level pain points, and
                10-competitor mapping (India &amp; Global).
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateMarketAnalysisContent />
            </div>
          </TabsContent>

          {/* Metrics */}
          <TabsContent value="metrics" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Metrics
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Key performance indicators, success metrics, and operational
                benchmarks.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateMetricsContent />
            </div>
          </TabsContent>

          {/* Product Roadmap */}
          <TabsContent value="roadmap" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Product Roadmap
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Phased delivery plan: current capabilities, near-term releases,
                and long-term vision.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateProductRoadmapContent />
            </div>
          </TabsContent>

          {/* Product Summary */}
          <TabsContent value="summary" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Product Summary
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                One-page product overview: identity, problem, solution, target
                market, and defensible position.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateProductSummaryContent />
            </div>
          </TabsContent>

          {/* SWOT Analysis */}
          <TabsContent value="swot" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — SWOT Analysis
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Strengths, Weaknesses, Opportunities, and Threats with strategic
                action items.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateSwotAnalysisContent />
            </div>
          </TabsContent>

          {/* Use Cases */}
          <TabsContent value="usecases" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Gate Management — Use Cases
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Industry-wise use cases ranked by urgency, buyer profile, and
                current tool displacement.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <GateUseCasesContent />
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-8">
            <AssetsTab productData={ASSETS_TAB_DATA} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GateManagementPage;
