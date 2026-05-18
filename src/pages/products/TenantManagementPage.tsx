import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useProductSecurity } from "./useProductSecurity";
import { SecurityOverlays } from "./SecurityOverlays";
import AssetsTab from "./tabs/AssetsTab";
import { ProductData } from "./types";

import TenantFeatureListContent from "../../../24_04_26_TenantManagement_Research/feature_list.jsx";
import TenantFeaturesAndPricingContent from "../../../24_04_26_TenantManagement_Research/features_and_pricing.jsx";
import TenantEnhancementRoadmapContent from "../../../24_04_26_TenantManagement_Research/enhancement_roadmap.jsx";
import TenantBusinessPlanContent from "../../../24_04_26_TenantManagement_Research/business_plan_builder.jsx";
import TenantGtmStrategyContent from "../../../24_04_26_TenantManagement_Research/gtm_strategy.jsx";
import TenantMarketAnalysisContent from "../../../24_04_26_TenantManagement_Research/market_analysis.jsx";
import TenantMetricsContent from "../../../24_04_26_TenantManagement_Research/Metrics.jsx";
import TenantProductRoadmapContent from "../../../24_04_26_TenantManagement_Research/Product_Roadmap.jsx";
import TenantProductSummaryContent from "../../../24_04_26_TenantManagement_Research/product_summary.jsx";
import TenantSwotAnalysisContent from "../../../24_04_26_TenantManagement_Research/swot_analysis.jsx";
import TenantUseCasesContent from "../../../24_04_26_TenantManagement_Research/use_cases.jsx";

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
  name: "Tenant Management",
  description:
    "End-to-end tenant lifecycle management — onboarding, lease tracking, rent collection, maintenance requests, notices, and move-out.",
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
     TENANT MANAGEMENT — ENHANCED MANIPULATIVE CSS
     • Card-wrapped tables with drop shadow
     • 32px gap between stacked table sections
     • Richer color hierarchy: s0-s13
     • Orange accent stripe on section headers
     • Smooth per-row hover tint
     • Refined scrollbar
  ══════════════════════════════════════════════════════════════════ */

  /* ── Hide Google Sheets chrome ───────────────────────────────────── */
  .tenant-mgmt-page .row-headers-background,
  .tenant-mgmt-page .column-headers-background,
  .tenant-mgmt-page .row-header-wrapper,
  .tenant-mgmt-page .freezebar-origin-ltr,
  .tenant-mgmt-page tbody tr th,
  .tenant-mgmt-page thead tr > th:first-child { display: none !important; }

  /* ── TABLE CARD WRAPPER — gap + shadow + rounded ─────────────────── */
  .tenant-mgmt-page .ritz.grid-container {
    overflow-x: auto !important;
    width: 100% !important;
    background: #ffffff !important;
    margin-bottom: 24px !important;
    border-radius: 0 !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  /* ── Table reset ─────────────────────────────────────────────────── */
  .tenant-mgmt-page .ritz .waffle {
    width: 100% !important;
    border-collapse: collapse !important;
    table-layout: auto !important;
  }
  .tenant-mgmt-page .ritz .waffle col,
  .tenant-mgmt-page .ritz .waffle thead th {
    width: auto !important;
    min-width: 80px !important;
  }

  /* ── Clean top/bottom edges for card look ────────────────────────── */
  .tenant-mgmt-page .ritz .waffle tbody tr:first-child td,
  .tenant-mgmt-page .ritz .waffle thead tr:first-child th { border-top: none !important; }
  .tenant-mgmt-page .ritz .waffle tbody tr:last-child td { border-bottom: none !important; }

  /* ── Base cell: Poppins 12px, generous padding, soft border ─────── */
  .tenant-mgmt-page .ritz td,
  .tenant-mgmt-page .ritz th {
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
  .tenant-mgmt-page .ritz .s0 {
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
  .tenant-mgmt-page .ritz .s1 {
    background-color: #FAF8F3 !important;
    color: rgba(58,53,48,0.55) !important;
    font-style: italic !important;
    font-size: 11px !important;
    padding: 8px 16px !important;
    vertical-align: middle !important;
    border-bottom: 1px solid #EDE9E1 !important;
  }

  /* ── s2  Spacer / section label — branded cream divider ─────────── */
  .tenant-mgmt-page .ritz .s2 {
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
  .tenant-mgmt-page .ritz .s3 {
    background-color: #FDFCF9 !important;
    color: #2C2C2C !important;
    font-weight: 400 !important;
  }

  /* ── s4  Data row B — clean white ───────────────────────────────── */
  .tenant-mgmt-page .ritz .s4 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 400 !important;
  }

  /* ── s5  Column header — Snag360-style: orange bg, white text ───── */
  .tenant-mgmt-page .ritz .s5 {
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
  .tenant-mgmt-page .ritz .s6 {
    background-color: #FAF8F3 !important;
    color: #2C2C2C !important;
    vertical-align: top !important;
  }

  /* ── s7  Alternating row B — pure white ─────────────────────────── */
  .tenant-mgmt-page .ritz .s7 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    vertical-align: top !important;
  }

  /* ── s8  Status / badge — warm amber pill ───────────────────────── */
  .tenant-mgmt-page .ritz .s8 {
    background-color: #FEF3C7 !important;
    color: #92400E !important;
    font-weight: 600 !important;
    font-size: 11px !important;
    text-align: center !important;
    vertical-align: middle !important;
    border-left: 3px solid #F59E0B !important;
  }

  /* ── s9  Section header — DARK charcoal + orange left accent ───── */
  .tenant-mgmt-page .ritz .s9 {
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
  .tenant-mgmt-page .ritz .s10 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    border-right: 2px solid #C4B89D !important;
  }

  /* ── s11 Centered bold label — parchment bg ─────────────────────── */
  .tenant-mgmt-page .ritz .s11 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    text-align: center !important;
  }

  /* ── s12 Centered bold white — white bg ─────────────────────────── */
  .tenant-mgmt-page .ritz .s12 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    text-align: center !important;
  }

  /* ── s13 Bold white — white bg ──────────────────────────────────── */
  .tenant-mgmt-page .ritz .s13 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
  }

  /* ── Row hover — Lockated warm orange tint ───────────────────────── */
  /* ── Scrollbar ───────────────────────────────────────────────────── */
  .tenant-mgmt-page .ritz.grid-container::-webkit-scrollbar { height: 5px; }
  .tenant-mgmt-page .ritz.grid-container::-webkit-scrollbar-track {
    background: #F0EDE5;
    border-radius: 10px;
  }
  .tenant-mgmt-page .ritz.grid-container::-webkit-scrollbar-thumb {
    background: #C4B89D;
    border-radius: 10px;
  }
`;

const TenantManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="tenant-mgmt-page min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300"
      style={{ filter: security.isBlurred ? "blur(20px)" : "none" }}
    >
      <style>{MANIPULATIVE_CSS}</style>
      <SecurityOverlays security={security} />

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
            GoPhygital.work (Tenants Building)
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            End-to-end tenant lifecycle management — onboarding, lease tracking,
            rent collection, maintenance requests, notices, and move-out. One
            platform for landlords, property managers, and tenants to
            communicate and transact seamlessly.
          </p>
        </div>
      </div>

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

          <TabsContent value="features" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Complete Feature List
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Star USP features highlighted. Modules: Onboarding, Lease, Rent,
                Maintenance, Communication, Move-out, Analytics.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantFeatureListContent />
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Features vs Market &amp; Pricing
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Feature comparison vs market | Pricing landscape | Competitive
                positioning | Value propositions.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantFeaturesAndPricingContent />
            </div>
          </TabsContent>

          <TabsContent value="enhancements" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Feature Enhancement Roadmap
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Future-state innovations: AI rent prediction, smart lease
                renewal, digital signatures, WhatsApp integration. Blue rows =
                P1 high-impact.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantEnhancementRoadmapContent />
            </div>
          </TabsContent>

          <TabsContent value="business" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Business Plan Builder
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Investor-ready Q&amp;A blocks: market size, competitive moat,
                revenue model, GTM, and growth projections.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantBusinessPlanContent />
            </div>
          </TabsContent>

          <TabsContent value="gtm" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — GTM Strategy
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Go-to-market playbook: target segments, channels, positioning,
                launch phasing, and growth levers.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantGtmStrategyContent />
            </div>
          </TabsContent>

          <TabsContent value="market" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Market Analysis
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Target audience segments, company-level pain points, and
                competitor mapping (India &amp; Global).
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantMarketAnalysisContent />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Metrics
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Key performance indicators: occupancy rates, rent collection
                efficiency, maintenance TAT, and tenant satisfaction scores.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantMetricsContent />
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Product Roadmap
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Phase-by-phase delivery plan: MVP → Growth → Scale. Timelines,
                ownership, and success criteria.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantProductRoadmapContent />
            </div>
          </TabsContent>

          <TabsContent value="summary" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Product Summary
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                One-page executive overview: product vision, core value
                proposition, target users, and differentiation.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantProductSummaryContent />
            </div>
          </TabsContent>

          <TabsContent value="swot" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — SWOT Analysis
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Strengths, Weaknesses, Opportunities, and Threats mapped for the
                Tenant Management product.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantSwotAnalysisContent />
            </div>
          </TabsContent>

          <TabsContent value="usecases" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Tenant Management — Use Cases
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Real-world deployment: residential complexes, commercial
                offices, co-working spaces, retail malls, and industrial parks.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <TenantUseCasesContent />
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

export default TenantManagementPage;
