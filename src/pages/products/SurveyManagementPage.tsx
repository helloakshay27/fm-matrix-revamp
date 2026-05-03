import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useProductSecurity } from "./useProductSecurity";
import { SecurityOverlays } from "./SecurityOverlays";

// ── Import research JSX files directly as React components ───────────────────
import SurveyFeatureListContent from "../../../24_04_26_Survey_Research_Doc/feature_list.jsx";
import SurveyFeaturesAndPricingContent from "../../../24_04_26_Survey_Research_Doc/features_and_pricing.jsx";
import SurveyEnhancementRoadmapContent from "../../../24_04_26_Survey_Research_Doc/enhancement_roadmap.jsx";
import SurveyBusinessPlanContent from "../../../24_04_26_Survey_Research_Doc/business_plan_builder.jsx";
import SurveyGtmStrategyContent from "../../../24_04_26_Survey_Research_Doc/gtm_strategy.jsx";
import SurveyMarketAnalysisContent from "../../../24_04_26_Survey_Research_Doc/market_analysis.jsx";
import SurveyMetricsContent from "../../../24_04_26_Survey_Research_Doc/Metrics.jsx";
import SurveyProductRoadmapContent from "../../../24_04_26_Survey_Research_Doc/Product_Roadmap.jsx";
import SurveyProductSummaryContent from "../../../24_04_26_Survey_Research_Doc/product_summary.jsx";
import SurveySwotAnalysisContent from "../../../24_04_26_Survey_Research_Doc/swot_analysis.jsx";
import SurveyUseCasesContent from "../../../24_04_26_Survey_Research_Doc/use_cases.jsx";

// ── Tab metadata ─────────────────────────────────────────────────────────────
const TAB_LABELS: Record<string, string> = {
  features: "Feature List",
  pricing: "Features & Pricing",
  enhancements: "Enhancement Roadmap",
  business: "Business Plan Builder",
  gtm: "GTM Strategy",
  market: "Market Analysis",
  metrics: "Metrics",
  roadmap: "Product Roadmap",
  summary: "Product Summary",
  swot: "SWOT Analysis",
  usecases: "Use Cases",
};

const TAB_ORDER = [
  "summary",
  "features",
  "pricing",
  "enhancements",
  "business",
  "gtm",
  "market",
  "metrics",
  "roadmap",
  "swot",
  "usecases",
];

// ── Scoped CSS — Lockated brand — enhanced manipulative table styling ─────────
const MANIPULATIVE_CSS = `
  /* ══════════════════════════════════════════════════════════════════
     SURVEY MANAGEMENT — ENHANCED MANIPULATIVE CSS
     • Card-wrapped tables with drop shadow
     • 32px gap between stacked table sections
     • Richer color hierarchy: s0-s13
     • Orange accent stripe on section headers
     • Smooth per-row hover tint
     • Refined scrollbar
  ══════════════════════════════════════════════════════════════════ */

  /* ── Hide Google Sheets chrome ───────────────────────────────────── */
  .survey-mgmt-page .row-headers-background,
  .survey-mgmt-page .column-headers-background,
  .survey-mgmt-page .row-header-wrapper,
  .survey-mgmt-page .freezebar-origin-ltr,
  .survey-mgmt-page tbody tr th,
  .survey-mgmt-page thead tr > th:first-child { display: none !important; }

  /* ── TABLE CARD WRAPPER — gap + shadow + rounded ─────────────────── */
  .survey-mgmt-page .ritz.grid-container {
    overflow-x: auto !important;
    width: 100% !important;
    background: #ffffff !important;
    margin-bottom: 32px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(196,184,157,0.45) !important;
    box-shadow:
      0 1px 3px rgba(44,44,44,0.06),
      0 4px 18px rgba(44,44,44,0.05),
      0 0 0 1px rgba(218,119,86,0.06) !important;
  }

  /* ── Table reset ─────────────────────────────────────────────────── */
  .survey-mgmt-page .ritz .waffle {
    width: 100% !important;
    border-collapse: collapse !important;
    table-layout: auto !important;
  }
  .survey-mgmt-page .ritz .waffle col,
  .survey-mgmt-page .ritz .waffle thead th {
    width: auto !important;
    min-width: 80px !important;
  }

  /* ── Clean top/bottom edges for card look ────────────────────────── */
  .survey-mgmt-page .ritz .waffle tbody tr:first-child td,
  .survey-mgmt-page .ritz .waffle thead tr:first-child th { border-top: none !important; }
  .survey-mgmt-page .ritz .waffle tbody tr:last-child td { border-bottom: none !important; }

  /* ── Base cell: Poppins 12px, generous padding, soft border ─────── */
  .survey-mgmt-page .ritz td,
  .survey-mgmt-page .ritz th {
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
  .survey-mgmt-page .ritz .s0 {
    background: linear-gradient(135deg, #DA7756 0%, #C9624A 100%) !important;
    color: #ffffff !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
    padding: 15px 16px !important;
    vertical-align: middle !important;
    border-bottom: 2px solid rgba(255,255,255,0.15) !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
  }

  /* ── s1  Italic subtitle — warm cream with muted text ───────────── */
  .survey-mgmt-page .ritz .s1 {
    background-color: #FAF8F3 !important;
    color: rgba(58,53,48,0.55) !important;
    font-style: italic !important;
    font-size: 11px !important;
    padding: 8px 16px !important;
    vertical-align: middle !important;
    border-bottom: 1px solid #EDE9E1 !important;
  }

  /* ── s2  Spacer / section label — branded cream divider ─────────── */
  .survey-mgmt-page .ritz .s2 {
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
  .survey-mgmt-page .ritz .s3 {
    background-color: #FDFCF9 !important;
    color: #2C2C2C !important;
    font-weight: 400 !important;
  }

  /* ── s4  Data row B — clean white ───────────────────────────────── */
  .survey-mgmt-page .ritz .s4 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 400 !important;
  }

  /* ── s5  Column header — Snag360-style: orange bg, white text ───── */
  .survey-mgmt-page .ritz .s5 {
    background-color: #DA7756 !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 10.5px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.07em !important;
    padding: 11px 14px !important;
    border-bottom: none !important;
    border-top: none !important;
    vertical-align: middle !important;
    text-shadow: 0 1px 1px rgba(0,0,0,0.12) !important;
  }

  /* ── s6  Alternating row A — warm parchment ─────────────────────── */
  .survey-mgmt-page .ritz .s6 {
    background-color: #FAF8F3 !important;
    color: #2C2C2C !important;
    vertical-align: top !important;
  }

  /* ── s7  Alternating row B — pure white ─────────────────────────── */
  .survey-mgmt-page .ritz .s7 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    vertical-align: top !important;
  }

  /* ── s8  Status / badge — warm amber pill ───────────────────────── */
  .survey-mgmt-page .ritz .s8 {
    background-color: #FEF3C7 !important;
    color: #92400E !important;
    font-weight: 600 !important;
    font-size: 11px !important;
    text-align: center !important;
    vertical-align: middle !important;
    border-left: 3px solid #F59E0B !important;
  }

  /* ── s9  Section header — DARK charcoal + orange left accent ───── */
  .survey-mgmt-page .ritz .s9 {
    background-color: #2C2C2C !important;
    color: #F6F4EE !important;
    font-weight: 700 !important;
    font-size: 10.5px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.08em !important;
    padding: 10px 14px 10px 16px !important;
    vertical-align: middle !important;
    border-left: 4px solid #DA7756 !important;
    border-top: none !important;
    text-shadow: none !important;
  }

  /* ── s10 Bold label — parchment bg, strong Lockated text ─────────── */
  .survey-mgmt-page .ritz .s10 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    border-right: 2px solid #C4B89D !important;
  }

  /* ── s11 Centered bold label — parchment bg ─────────────────────── */
  .survey-mgmt-page .ritz .s11 {
    background-color: #F6F4EE !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    text-align: center !important;
  }

  /* ── s12 Centered bold white — white bg ─────────────────────────── */
  .survey-mgmt-page .ritz .s12 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
    text-align: center !important;
  }

  /* ── s13 Bold white — white bg ──────────────────────────────────── */
  .survey-mgmt-page .ritz .s13 {
    background-color: #ffffff !important;
    color: #2C2C2C !important;
    font-weight: 600 !important;
  }

  /* ── Row hover — Lockated warm orange tint ───────────────────────── */
  .survey-mgmt-page .ritz tbody tr:hover td {
    background-color: rgba(218,119,86,0.05) !important;
    transition: background-color 0.15s ease !important;
  }
  .survey-mgmt-page .ritz tbody tr:hover td.s9 {
    background-color: #3a3a3a !important;
  }
  .survey-mgmt-page .ritz tbody tr:hover td.s0,
  .survey-mgmt-page .ritz tbody tr:hover td.s5 {
    filter: brightness(1.05) !important;
  }

  /* ── Scrollbar ───────────────────────────────────────────────────── */
  .survey-mgmt-page .ritz.grid-container::-webkit-scrollbar { height: 5px; }
  .survey-mgmt-page .ritz.grid-container::-webkit-scrollbar-track {
    background: #F0EDE5;
    border-radius: 10px;
  }
  .survey-mgmt-page .ritz.grid-container::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #DA7756, #C4B89D);
    border-radius: 10px;
  }
  .survey-mgmt-page .ritz.grid-container::-webkit-scrollbar-thumb:hover {
    background: #DA7756;
  }
`;

// ── Main page component ───────────────────────────────────────────────────────
const SurveyManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="survey-mgmt-page min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300"
      style={{ filter: security.isBlurred ? "blur(20px)" : "none" }}
    >
      {/* Scoped CSS */}
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
            Survey
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            Capture real-time customer feedback at every touchpoint. QR-based
            surveys with auto-ticket creation on negative responses,
            location-level CSAT analytics, and a full helpdesk integration for
            closed-loop complaint resolution.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          <div
            ref={tabsScrollRef}
            className="overflow-x-auto no-scrollbar mb-8"
          >
            <div className="flex justify-start pb-2 px-1">
              <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5 h-auto items-center justify-start">
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
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Complete Feature List
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Star USP features highlighted. Modules: Question Setup, Survey
                Mapping, Survey Response, Dashboard &amp; Analytics, Admin
                Portal.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyFeatureListContent />
            </div>
          </TabsContent>

          {/* Features & Pricing */}
          <TabsContent value="pricing" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Features vs Market &amp; Pricing
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Feature comparison vs market | Pricing landscape | Competitive
                positioning | Value propositions.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyFeaturesAndPricingContent />
            </div>
          </TabsContent>

          {/* Enhancement Roadmap */}
          <TabsContent value="enhancements" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Feature Enhancement Roadmap
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Future-state innovations: AI sentiment, multi-language, offline
                mode, NPS, advanced analytics. Blue rows = P1 high-impact.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyEnhancementRoadmapContent />
            </div>
          </TabsContent>

          {/* Business Plan Builder */}
          <TabsContent value="business" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Business Plan Builder
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Investor-ready Q&amp;A blocks: market size, competitive moat,
                revenue model, GTM, and growth projections.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyBusinessPlanContent />
            </div>
          </TabsContent>

          {/* GTM Strategy */}
          <TabsContent value="gtm" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — GTM Strategy
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Go-to-market playbook: target segments, channels, positioning,
                launch phasing, and growth levers.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyGtmStrategyContent />
            </div>
          </TabsContent>

          {/* Market Analysis */}
          <TabsContent value="market" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Market Analysis
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Target audience segments, company-level pain points, and
                competitor mapping (India &amp; Global).
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyMarketAnalysisContent />
            </div>
          </TabsContent>

          {/* Metrics */}
          <TabsContent value="metrics" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Metrics
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Key performance indicators, CSAT benchmarks, response rates, and
                operational success metrics.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyMetricsContent />
            </div>
          </TabsContent>

          {/* Product Roadmap */}
          <TabsContent value="roadmap" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Product Roadmap
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Phase-by-phase delivery plan: MVP → Growth → Scale. Timelines,
                ownership, and success criteria.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyProductRoadmapContent />
            </div>
          </TabsContent>

          {/* Product Summary */}
          <TabsContent value="summary" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Product Summary
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                One-page executive overview: product vision, core value
                proposition, target users, and differentiation.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyProductSummaryContent />
            </div>
          </TabsContent>

          {/* SWOT Analysis */}
          <TabsContent value="swot" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — SWOT Analysis
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Strengths, Weaknesses, Opportunities, and Threats mapped for the
                Survey product.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveySwotAnalysisContent />
            </div>
          </TabsContent>

          {/* Use Cases */}
          <TabsContent value="usecases" className="animate-fade-in">
            <div className="bg-white border border-[#C4B89D] p-4 rounded-t-xl border-l-4 border-l-[#DA7756] mb-0">
              <h2 className="text-xl font-semibold font-poppins text-[#2C2C2C]">
                Survey — Use Cases
              </h2>
              <p className="text-[11px] text-[#2C2C2C]/50 italic mt-1 font-poppins">
                Real-world deployment scenarios: retail, hospitality, corporate
                campuses, healthcare, and FM operators.
              </p>
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 border-[#C4B89D] overflow-hidden">
              <SurveyUseCasesContent />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SurveyManagementPage;
