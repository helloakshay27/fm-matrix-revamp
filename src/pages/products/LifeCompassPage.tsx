import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  List,
  Briefcase,
  BarChart3,
  DollarSign,
  Compass,
  Map,
  Megaphone,
  Rocket,
  Building2,
  LineChart,
  Presentation,
  Search,
  Star,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  XCircle,
  Download,
  X,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { SecurityOverlays } from "./SecurityOverlays";
import { useProductSecurity } from "./useProductSecurity";
import { canViewProduct } from "./productVisibility";
import {
  LcBlock,
  lifeCompassBlocks,
  lifeCompassEnhancements,
  lifeCompassFeatures,
  lifeCompassSwot,
  lifeCompassTitles,
} from "./lifeCompassData";

const PRODUCT_NAME = "Life Compass";
const PRODUCT_TAGLINE =
  "An AI-powered life companion (software + hardware) that unifies career, finance, health, relationships and personal wellbeing into a single personalised operating system, built on a data-sovereign foundation.";

const PITCH_DECK_URL = "/life-compass/Life_Blueprint_Pitch_Deck.pptx";

const TAB_ORDER = [
  "summary",
  "features",
  "usecases",
  "market",
  "pricing",
  "swot",
  "roadmap",
  "gtm",
  "enhancements",
  "vc",
  "fundraise",
  "deck",
] as const;

const TAB_LABELS: Record<string, string> = {
  summary: "Product Summary",
  features: "Feature List",
  usecases: "Use Cases",
  market: "Market Analysis",
  pricing: "Features & Pricing",
  swot: "SWOT Analysis",
  roadmap: "Product Roadmap",
  gtm: "GTM Strategy",
  enhancements: "Enhancement Roadmap",
  vc: "VC & Family Office",
  fundraise: "Fundraise Strategy",
  deck: "Fundraise Deck Brief",
};

const TAB_ICONS: Record<string, React.ReactNode> = {
  summary: <Target className="w-4 h-4" />,
  features: <List className="w-4 h-4" />,
  usecases: <Briefcase className="w-4 h-4" />,
  market: <BarChart3 className="w-4 h-4" />,
  pricing: <DollarSign className="w-4 h-4" />,
  swot: <Compass className="w-4 h-4" />,
  roadmap: <Map className="w-4 h-4" />,
  gtm: <Megaphone className="w-4 h-4" />,
  enhancements: <Rocket className="w-4 h-4" />,
  vc: <Building2 className="w-4 h-4" />,
  fundraise: <LineChart className="w-4 h-4" />,
  deck: <Presentation className="w-4 h-4" />,
};

// ============== SHARED PRESENTATION PIECES ==============

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
    <h2 className="text-xl font-semibold tracking-tight font-poppins uppercase">
      {PRODUCT_NAME} - {title}
    </h2>
    {subtitle && (
      <p className="text-[10px] font-medium text-[#2C2C2C]/50 tracking-widest mt-1 uppercase">
        {subtitle}
      </p>
    )}
  </div>
);

const BandHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[#DA7756] text-white border border-[#C4B89D] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
    {children}
  </div>
);

const NoteLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="bg-white border border-[#D3D1C7] px-4 py-3 text-[12px] leading-[1.6] text-[#2C2C2C]/70 italic font-medium font-poppins">
    {children}
  </p>
);

/** Renders a generic sheet table with wrapping cells. */
const BlockTable: React.FC<{ header: string[] | null; rows: string[][] }> = ({
  header,
  rows,
}) => {
  const colCount = header?.length || rows[0]?.length || 1;
  // Two-column sheets read as label/value pairs, so pin the label column.
  const isKeyValue = colCount === 2;

  return (
    <div className="bg-[#F6F4EE] overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm font-poppins min-w-[720px]">
        {header && (
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              {header.map((h, i) => (
                <th
                  key={i}
                  className="border border-[#C4B89D]/50 p-3 text-left align-top font-poppins"
                  style={{ width: isKeyValue && i === 0 ? "26%" : undefined }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={`border border-[#C4B89D]/50 p-3 whitespace-pre-line align-top font-poppins ${
                    ci === 0
                      ? "font-semibold text-[#2C2C2C] bg-[#F6F4EE]"
                      : "text-[#2C2C2C]/80 font-medium leading-relaxed bg-white"
                  }`}
                  style={{ width: isKeyValue && ci === 0 ? "26%" : undefined }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Renders a whole sheet from its extracted blocks. */
const BlockSheet: React.FC<{ sheet: string }> = ({ sheet }) => {
  const blocks: LcBlock[] = lifeCompassBlocks[sheet] || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title={TAB_LABELS[sheet]}
        subtitle={lifeCompassTitles[sheet]}
      />
      {blocks.map((b, i) => {
        if (b.kind === "heading") {
          return <BandHeading key={i}>{b.text}</BandHeading>;
        }
        if (b.kind === "note") {
          return <NoteLine key={i}>{b.text}</NoteLine>;
        }
        return <BlockTable key={i} header={b.header} rows={b.rows} />;
      })}
    </div>
  );
};

// ============== FEATURES TAB ==============

const FeaturesTab: React.FC = () => {
  const [query, setQuery] = useState("");
  const [module, setModule] = useState("All");
  const [uspOnly, setUspOnly] = useState(false);

  const modules = useMemo(
    () => Array.from(new Set(lifeCompassFeatures.map((f) => f.module))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lifeCompassFeatures.filter((f) => {
      if (module !== "All" && f.module !== module) return false;
      if (uspOnly && !f.usp) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.module.toLowerCase().includes(q)
      );
    });
  }, [query, module, uspOnly]);

  const uspCount = lifeCompassFeatures.filter((f) => f.usp).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Feature List"
        subtitle={`${lifeCompassFeatures.length} features across ${modules.length} modules - ${uspCount} marked as USP`}
      />

      <div className="flex flex-wrap items-center gap-3 bg-white border border-[#D3D1C7] p-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features..."
            className="w-full border border-[#C4B89D]/60 bg-white pl-9 pr-3 py-2 text-[12px] font-poppins text-[#2C2C2C] outline-none focus:border-[#DA7756]"
          />
        </div>
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="border border-[#C4B89D]/60 bg-white px-3 py-2 text-[12px] font-poppins text-[#2C2C2C] outline-none focus:border-[#DA7756]"
        >
          <option value="All">All modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setUspOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 border px-3 py-2 text-[12px] font-semibold font-poppins transition-colors ${
            uspOnly
              ? "bg-[#DA7756] text-white border-[#DA7756]"
              : "bg-white text-[#2C2C2C]/70 border-[#C4B89D]/60 hover:border-[#DA7756]"
          }`}
        >
          <Star className="w-3.5 h-3.5" /> USP only
        </button>
        <span className="text-[11px] font-medium text-[#2C2C2C]/50 font-poppins">
          Showing {filtered.length} of {lifeCompassFeatures.length}
        </span>
      </div>

      <div className="bg-[#F6F4EE] overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-[12px] font-poppins min-w-[900px]">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-[6%]">
                Sr. No.
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-left w-[20%]">
                Feature Name
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-left w-[44%]">
                Description
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-[8%]">
                USP?
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-left w-[22%]">
                Module / Page
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr
                key={f.sr}
                className={
                  f.usp
                    ? "bg-[#DA7756]/10"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#C4B89D]/50 p-3 text-center align-top font-semibold text-[#2C2C2C]/70">
                  {f.sr}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 align-top whitespace-pre-line font-semibold text-[#DA7756]">
                  {f.name}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 align-top whitespace-pre-line text-[#2C2C2C]/80 font-medium leading-relaxed">
                  {f.description}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-center align-top font-semibold">
                  {f.usp ? (
                    <span className="text-[#DA7756]">Yes</span>
                  ) : (
                    <span className="text-[#2C2C2C]/40">No</span>
                  )}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 align-top whitespace-pre-line text-[#2C2C2C]/70 font-medium">
                  {f.module}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="border border-[#C4B89D]/50 p-6 text-center text-[#2C2C2C]/50 bg-white"
                >
                  No features match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== ENHANCEMENTS TAB ==============

const integrationTone = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("mcp") && t.includes("ai"))
    return "bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]";
  if (t.includes("mcp")) return "bg-[#ECFDF3] text-[#166534] border-[#BBF7D0]";
  if (t.includes("ai")) return "bg-[#FFF4EC] text-[#B45309] border-[#FED7AA]";
  return "bg-[#F6F4EE] text-[#5E554B] border-[#D3D1C7]";
};

const EnhancementsTab: React.FC = () => {
  const [query, setQuery] = useState("");
  const [integration, setIntegration] = useState("All");

  const integrations = useMemo(
    () =>
      Array.from(
        new Set(lifeCompassEnhancements.map((e) => e.integration))
      ).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lifeCompassEnhancements.filter((e) => {
      if (integration !== "All" && e.integration !== integration) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.current.toLowerCase().includes(q) ||
        e.enhanced.toLowerCase().includes(q)
      );
    });
  }, [query, integration]);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle
        title="Enhancement Roadmap"
        subtitle={`${lifeCompassEnhancements.length} enhancements - current behaviour to enhanced behaviour with integration type`}
      />

      <div className="flex flex-wrap items-center gap-3 bg-white border border-[#D3D1C7] p-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enhancements..."
            className="w-full border border-[#C4B89D]/60 bg-white pl-9 pr-3 py-2 text-[12px] font-poppins text-[#2C2C2C] outline-none focus:border-[#DA7756]"
          />
        </div>
        <select
          value={integration}
          onChange={(e) => setIntegration(e.target.value)}
          className="border border-[#C4B89D]/60 bg-white px-3 py-2 text-[12px] font-poppins text-[#2C2C2C] outline-none focus:border-[#DA7756]"
        >
          <option value="All">All integration types</option>
          {integrations.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-[11px] font-medium text-[#2C2C2C]/50 font-poppins">
          Showing {filtered.length} of {lifeCompassEnhancements.length}
        </span>
      </div>

      <div className="bg-[#F6F4EE] overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-[12px] font-poppins min-w-[1100px]">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-[5%]">
                Sr. No.
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-left w-[17%]">
                Feature Name
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-left w-[31%]">
                How It Currently Works
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-left w-[35%]">
                Enhanced Version
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-[12%]">
                Integration Type
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr
                key={e.sr}
                className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
              >
                <td className="border border-[#C4B89D]/50 p-3 text-center align-top font-semibold text-[#2C2C2C]/70">
                  {e.sr}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 align-top whitespace-pre-line font-semibold text-[#DA7756]">
                  {e.name}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 align-top whitespace-pre-line text-[#2C2C2C]/70 font-medium leading-relaxed">
                  {e.current}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 align-top whitespace-pre-line text-[#2C2C2C]/80 font-medium leading-relaxed">
                  {e.enhanced}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-center align-top">
                  <span
                    className={`inline-flex border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${integrationTone(
                      e.integration
                    )}`}
                  >
                    {e.integration}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="border border-[#C4B89D]/50 p-6 text-center text-[#2C2C2C]/50 bg-white"
                >
                  No enhancements match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== SWOT TAB ==============

const SwotQuadrant: React.FC<{
  title: string;
  items: string[];
  icon: React.ReactNode;
  tone: string;
}> = ({ title, items, icon, tone }) => (
  <div className="border border-[#C4B89D] bg-white">
    <div
      className={`flex items-center gap-2 px-4 py-3 font-semibold uppercase text-sm font-poppins ${tone}`}
    >
      {icon}
      {title}
    </div>
    <ul className="p-4 space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-[12px] leading-relaxed text-[#2C2C2C]/80 font-medium font-poppins"
        >
          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#DA7756]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SwotTab: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <SectionTitle title="SWOT Analysis" subtitle={lifeCompassTitles.swot} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SwotQuadrant
        title="Strengths"
        items={lifeCompassSwot.strengths}
        icon={<CheckCircle className="w-4 h-4" />}
        tone="bg-[#ECFDF3] text-[#166534]"
      />
      <SwotQuadrant
        title="Weaknesses"
        items={lifeCompassSwot.weaknesses}
        icon={<XCircle className="w-4 h-4" />}
        tone="bg-[#FEF2F2] text-[#B91C1C]"
      />
      <SwotQuadrant
        title="Opportunities"
        items={lifeCompassSwot.opportunities}
        icon={<Lightbulb className="w-4 h-4" />}
        tone="bg-[#FFF4EC] text-[#B45309]"
      />
      <SwotQuadrant
        title="Threats"
        items={lifeCompassSwot.threats}
        icon={<AlertTriangle className="w-4 h-4" />}
        tone="bg-[#F5F3FF] text-[#5B21B6]"
      />
    </div>
  </div>
);

// ============== PITCH DECK VIEWER ==============

const PitchDeckButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed right-6 top-44 z-50 inline-flex items-center gap-1.5 rounded-full border border-[#DA7756]/30 bg-[#DA7756] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#DA7756]/20 transition-all hover:bg-[#C9684B] focus:outline-none focus:ring-2 focus:ring-[#DA7756]/30"
  >
    <Presentation className="w-3.5 h-3.5" /> Pitch Deck
  </button>
);

// Office Online's free embed viewer has no SLA: its own "fetching your
// file..." loader can hang forever with zero error surfaced (blocked
// crawler UA, transient WOPI failures, etc), all outside our control. We
// can't detect success/failure inside the cross-origin iframe, so after a
// timeout we assume it failed and fall back to a guaranteed-working
// download path instead of leaving the user staring at a dead spinner.
const PREVIEW_TIMEOUT_MS = 9000;

const PitchDeckModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [attempt, setAttempt] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const officeViewerSrc = useMemo(() => {
    const absoluteUrl = `${window.location.origin}${PITCH_DECK_URL}`;
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      absoluteUrl
    )}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  React.useEffect(() => {
    setTimedOut(false);
    const timer = setTimeout(() => setTimedOut(true), PREVIEW_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [attempt]);

  const retry = () => setAttempt((a) => a + 1);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F6F4EE] px-5 py-3">
          <div className="flex items-center gap-2">
            <Presentation className="w-4 h-4 text-[#DA7756]" />
            <span className="text-sm font-semibold text-[#2C2C2C] font-poppins">
              Life Compass - Pitch Deck
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={PITCH_DECK_URL}
              download
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C4B89D]/60 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#2C2C2C]/80 transition-colors hover:border-[#DA7756] hover:text-[#DA7756]"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-[#2C2C2C]/50 transition-colors hover:bg-[#F6F4EE] hover:text-[#2C2C2C]"
              aria-label="Close pitch deck viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="relative flex-1 bg-[#F6F4EE]">
          {!timedOut && (
            <iframe
              key={attempt}
              title="Life Compass Pitch Deck"
              src={officeViewerSrc}
              className="absolute inset-0 h-full w-full border-0"
            />
          )}
          {timedOut && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DA7756]/10">
                <Presentation className="h-7 w-7 text-[#DA7756]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2C2C2C] font-poppins">
                  Preview isn&apos;t loading
                </p>
                <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-[#2C2C2C]/60 font-poppins">
                  The online preview service didn&apos;t respond in time.
                  This is a limitation on its end, not the file - download
                  it to view the slides, or try the preview again.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={PITCH_DECK_URL}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#DA7756] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#C9684B]"
                >
                  <Download className="w-3.5 h-3.5" /> Download Pitch Deck
                </a>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C4B89D]/60 bg-white px-4 py-2 text-[12px] font-semibold text-[#2C2C2C]/80 transition-colors hover:border-[#DA7756] hover:text-[#DA7756]"
                >
                  Try preview again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============== MAIN PAGE ==============

const LifeCompassPage: React.FC = () => {
  const navigate = useNavigate();
  const security = useProductSecurity();
  const allowed = canViewProduct("life-compass");
  const [showPitchDeck, setShowPitchDeck] = useState(false);

  React.useEffect(() => {
    if (!allowed) navigate("/products", { replace: true });
  }, [allowed, navigate]);

  if (!allowed) return null;

  return (
    <div
      className="min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300"
      style={{
        filter: security.isBlurred ? "blur(20px)" : "none",
        transition: "filter 0.3s ease",
      }}
    >
      <SecurityOverlays security={security} />

      <PitchDeckButton onClick={() => setShowPitchDeck(true)} />
      {showPitchDeck && (
        <PitchDeckModal onClose={() => setShowPitchDeck(false)} />
      )}

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
            Personal Productivity &amp; Wellbeing
          </div>
          <h1 className="text-4xl font-semibold text-[#2C2C2C] mb-4 tracking-tight lg:text-5xl font-poppins">
            {PRODUCT_NAME}
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            {PRODUCT_TAGLINE}
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          <div className="mb-8">
            <div className="flex justify-start pb-2 px-1">
              <TabsList className="flex flex-wrap gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-2xl p-1.5 h-auto items-center justify-start">
                {TAB_ORDER.map((tabId) => (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-normal break-words text-center bg-transparent"
                  >
                    {TAB_ICONS[tabId]}
                    {TAB_LABELS[tabId]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value="summary" className="space-y-6">
            <BlockSheet sheet="summary" />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <FeaturesTab />
          </TabsContent>

          <TabsContent value="usecases" className="space-y-6">
            <BlockSheet sheet="usecases" />
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <BlockSheet sheet="market" />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <BlockSheet sheet="pricing" />
          </TabsContent>

          <TabsContent value="swot" className="space-y-6">
            <SwotTab />
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <BlockSheet sheet="roadmap" />
          </TabsContent>

          <TabsContent value="gtm" className="space-y-6">
            <BlockSheet sheet="gtm" />
          </TabsContent>

          <TabsContent value="enhancements" className="space-y-6">
            <EnhancementsTab />
          </TabsContent>

          <TabsContent value="vc" className="space-y-6">
            <BlockSheet sheet="vc" />
          </TabsContent>

          <TabsContent value="fundraise" className="space-y-6">
            <BlockSheet sheet="fundraise" />
          </TabsContent>

          <TabsContent value="deck" className="space-y-6">
            <BlockSheet sheet="deck" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LifeCompassPage;
