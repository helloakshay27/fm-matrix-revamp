import React from "react";

const postPossessionRoadmap = {
  sections: [
    {
      timeframe: "IMMEDIATE (0–3 MONTHS)",
      headline: "Stop Losing Deals We Should Be Winning",
      colorContext: "red",
      items: [
        {
          whatItIs: "UI/UX Overhaul — Resident App & Admin Console",
          whyItMatters: "Current UI is functional but below consumer-grade standards expected in GCC luxury, UK BTR, and premium Indian developers. Every UK/GCC demo loss is partly a design loss. This is the single highest-leverage action to stop deal leakage in international markets.",
          unlockedSegment: "GCC (Dubai luxury), UK BTR, Indian premium developers (₹3Cr+ properties)",
          effort: "High (8–12 weeks design + dev)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Publish ROI Calculator & Case Study (Godrej / Piramal)",
          whyItMatters: "Sales team loses deals at CFO/CRM Head stage because there is no quantified proof. A single published case study with specific numbers (CP cost reduction %, referral conversions, ticket SLA improvement) is worth more than 20 feature demos. Without this, every deal requires a leap of faith.",
          unlockedSegment: "All enterprise segments; immediately relevant for every active deal in pipeline",
          effort: "Low (2–4 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Multi-Language Support — Arabic (GCC) and Bahasa (SE Asia)",
          whyItMatters: "Every GCC developer prospect requires Arabic UI. Every SE Asia prospect requires Bahasa Melayu/Indonesia. Without this, GCC and SE Asia deals cannot close regardless of feature depth. This is a structural blocker for international expansion.",
          unlockedSegment: "GCC (UAE, Saudi, Qatar), SE Asia (Malaysia, Indonesia, Singapore)",
          effort: "Medium (6–10 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Public API Documentation + Integration Catalogue",
          whyItMatters: "Enterprise CIOs and IT heads ask 'what can this integrate with?' before signing. Without published API docs and a connector list, deals stall at technical evaluation. Yardi, Fixflo, and AppFolio all have public integration catalogues. This is table stakes for enterprise credibility.",
          unlockedSegment: "Enterprise developers with existing ERP/BMS/CRM systems; all international segments",
          effort: "Medium (4–6 weeks)",
          impact: "High",
          priority: "P0",
        },
        {
          whatItIs: "Onboarding Playbook + Customer Success Framework",
          whyItMatters: "130+ features with no structured onboarding creates post-signature churn risk. A formal customer success process (90-day activation playbook, health score, QBR template) protects existing revenue and generates referenceability for new deals.",
          unlockedSegment: "All segments — existing and new customers",
          effort: "Low-Medium (3–5 weeks)",
          impact: "High",
          priority: "P0",
        },
        {
          whatItIs: "Referral Payout Automation (Resident-to-Developer)",
          whyItMatters: "Referral module exists but if payout to resident is manual or opaque, residents stop referring. An automated payout workflow (UPI direct credit, wallet credit, voucher) closes the referral loop and drives word-of-mouth adoption of the feature itself.",
          unlockedSegment: "Indian developers with active referral programs; GCC developers targeting NRI buyer segment",
          effort: "Medium (6–8 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Pricing Page + Self-Serve Demo Request on Website",
          whyItMatters: "Without a public pricing page or an easy demo request flow, mid-market leads that find the product through content/word-of-mouth drop off. Even a 'Start from ₹X/unit/month — get a demo' page converts passive interest into pipeline.",
          unlockedSegment: "Mid-market Indian developers (500–2,000 units), GCC developers exploring options",
          effort: "Low (1–2 weeks)",
          impact: "Medium",
          priority: "P1",
        },
      ],
    },
    {
      timeframe: "SHORT-TERM (3–6 MONTHS)",
      headline: "Expand Addressable Market & Move Up-Market",
      colorContext: "orange",
      items: [
        {
          whatItIs: "AI-Powered Ticket Classification & Routing",
          whyItMatters: "Today, ticket categorisation and routing relies on admin configuration. AI-based NLP classification of complaint text (e.g., 'water leaking from ceiling' → auto-categorised as plumbing, auto-routed to plumbing vendor) eliminates configuration overhead and reduces wrong-routing by 60–70%. This is a meaningful operational upgrade that existing FM tools cannot easily replicate.",
          unlockedSegment: "All developer segments with high complaint volumes; enterprise FM operators",
          effort: "Medium-High (10–14 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Predictive Asset Maintenance (ML-based)",
          whyItMatters: "Using meter readings, asset age, maintenance history, and usage patterns to predict failure before it happens. Transforms the FM module from reactive to proactive. This is a board-level conversation for developers managing large asset portfolios (lifts, DG sets, STP/ETP plants). No community app competitor offers this.",
          unlockedSegment: "Large township developers, senior living operators, GCC institutional property managers",
          effort: "High (12–18 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "GDPR / DPDP Compliance Dashboard",
          whyItMatters: "As India's DPDP Act 2023 enforcement ramps up and UK/EU GDPR audits intensify, developer IT and legal teams need a compliance dashboard showing data residency, consent management, and audit logs. Building this as a visible feature (not just architecture) turns data sovereignty from a sales claim into a demonstrable compliance tool.",
          unlockedSegment: "UK BTR operators, European developers, large Indian developers with listed entity status",
          effort: "Medium (8–12 weeks)",
          impact: "High",
          priority: "P1",
        },
        {
          whatItIs: "Resident Engagement Score & Loyalty Analytics Dashboard",
          whyItMatters: "Developer CRM teams need to see which residents are most engaged, most likely to refer, and most at risk of disengagement. A resident-level engagement score (based on app activity, events attended, service usage, referrals made) gives CRM teams an actionable churn-prevention and referral-activation tool.",
          unlockedSegment: "Developer CRM/Loyalty teams; large Indian and GCC developers with formal loyalty programs",
          effort: "Medium (8–10 weeks)",
          impact: "High",
          priority: "P1",
        },
        {
          whatItIs: "UK / GCC Localisation Package (Legal, Banking, Tax)",
          whyItMatters: "UK: Bank account integration (Faster Payments, CHAPS), UK lease templates, service charge (Section 20) compliance. GCC: VAT configuration for UAE/Saudi, Arabic RTL UI, Emirates ID integration for visitor management. This package makes the product legally and operationally usable in these markets.",
          unlockedSegment: "UK BTR operators and developers; GCC developers and property managers",
          effort: "High (14–20 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Marketplace Commission Engine",
          whyItMatters: "As on-premise services marketplace grows, the platform needs a configurable commission engine (% take-rate per service category, vendor settlement, tax on commission). This creates a second revenue stream for Lockated and a monetisation tool for developer clients who run curated vendor ecosystems.",
          unlockedSegment: "Large Indian developers and township operators with active on-premise services; GCC operators",
          effort: "Medium (8–12 weeks)",
          impact: "High",
          priority: "P1",
        },
        {
          whatItIs: "EV Charging Management Integration",
          whyItMatters: "Electric vehicle adoption in India and GCC is accelerating. Integrating EV charging slot booking, billing (per kWh), and reporting into the platform adds a high-visibility, future-facing feature that developer sales teams can showcase. Directly tied to parking and billing modules.",
          unlockedSegment: "Premium Indian developers, GCC luxury developers, UK BTR with sustainability commitments",
          effort: "Medium (8–10 weeks)",
          impact: "High",
          priority: "P1",
        },
        {
          whatItIs: "Self-Serve Mid-Market Onboarding (Community < 500 Units)",
          whyItMatters: "A simplified, guided self-serve setup flow for smaller communities (RWA, small developers) reduces sales and onboarding cost for mid-market. Capture this segment via inbound rather than enterprise sales — significantly expanding TAM without proportional headcount growth.",
          unlockedSegment: "Mid-market RWAs and small developers; India Tier-2/Tier-3 cities; SE Asia",
          effort: "High (12–16 weeks)",
          impact: "Medium",
          priority: "P1",
        },
      ],
    },
    {
      timeframe: "MEDIUM-TERM (6–18 MONTHS)",
      headline: "Build Long-Term Competitive Moat",
      colorContext: "blue",
      items: [
        {
          whatItIs: "AI FM Copilot — Conversational FM Assistant",
          whyItMatters: "A natural language AI assistant embedded in the Admin Console that lets FM managers ask questions ('Show me all overdue PPM tasks in Tower B', 'Which vendors have the lowest resolution scores this quarter?') and receive instant answers without navigating dashboards. This reduces FM cognitive load and creates a moat that is extremely hard for competitors to replicate quickly.",
          unlockedSegment: "All developer and FM segments; particularly high value for multi-site FM operators managing 5+ communities",
          effort: "Very High (20–30 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Open Integration Marketplace (100+ Connectors)",
          whyItMatters: "Build and publish a formal integration marketplace (Zapier-style or MCP-based) connecting Post Possession to ERP (SAP, Tally, Oracle), CRM (Salesforce, HubSpot), HR (Darwinbox, SAP SuccessFactors), smart building (Siemens, Honeywell BMS), and Indian payment rails. Makes the platform an open hub rather than a closed system — a critical enterprise procurement requirement.",
          unlockedSegment: "Enterprise developers with complex IT stacks; all international segments",
          effort: "Very High (24–36 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Developer Revenue Intelligence Platform",
          whyItMatters: "Aggregate anonymised data across all deployed communities to give developer CRM teams benchmarked intelligence: 'Your referral conversion rate is 4.2% vs industry average of 6.1%'. 'Communities with weekly wellness events have 22% higher app engagement.' This turns Post Possession from an operational tool into a strategic intelligence platform — impossible to replicate without scale.",
          unlockedSegment: "Large enterprise developers with 5+ projects on the platform; developer CEOs and CRMs",
          effort: "Very High (20–28 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "Computer Vision — Full Suite Expansion",
          whyItMatters: "Expand current CV capabilities to include: (1) Automated lift/escalator malfunction detection via CCTV feed analysis, (2) Parking spot occupancy AI (real-time availability without sensors), (3) Perimeter breach detection. These add-ons create a premium security and smart building tier that commands 2–3x higher pricing.",
          unlockedSegment: "Premium/luxury developers, GCC smart city developments, large township operators",
          effort: "Very High (24–32 weeks)",
          impact: "High",
          priority: "P1",
        },
        {
          whatItIs: "Resident Lifetime Value (LTV) Model for Developer CRM",
          whyItMatters: "A proprietary LTV model per resident that combines engagement data, referral history, payment behaviour, and community tenure to predict: (1) likelihood of referral in next 6 months, (2) likelihood of buying developer's next project, (3) churn risk. This gives developer CRM teams AI-driven prioritisation of who to activate with offers/outreach.",
          unlockedSegment: "Developer CRM/Loyalty/Sales teams; large developers with 10,000+ residents on platform",
          effort: "Very High (20–26 weeks)",
          impact: "Very High",
          priority: "P0",
        },
        {
          whatItIs: "US Market Entry — HOA & Multifamily Module",
          whyItMatters: "US-specific module: HOA violation management, ACH payment integration (US bank rails), ADA accessibility compliance tracker, state-specific lease management (CA, TX, NY). This unlocks the $4B US HOA/multifamily software market where no white-label + data-sovereign solution currently exists.",
          unlockedSegment: "US gated community developers, HOA management companies, Class A multifamily operators",
          effort: "Very High (30–40 weeks)",
          impact: "Very High",
          priority: "P1",
        },
        {
          whatItIs: "Carbon & Sustainability Dashboard",
          whyItMatters: "Track and report community-level carbon footprint: energy consumption (DG, grid), water usage, waste generation, EV charging vs petrol vehicles. Configurable ESG reporting for developer annual reports. As ESG compliance becomes mandatory for listed developers and institutional property funds, this becomes a board-level requirement.",
          unlockedSegment: "Listed developers (Godrej, Lodha, Prestige), UK/European BTR funds, GCC sovereign wealth-backed developers",
          effort: "Medium-High (14–20 weeks)",
          impact: "High",
          priority: "P1",
        },
        {
          whatItIs: "Hyperlocal Commerce Ecosystem (Resident Marketplace App-in-App)",
          whyItMatters: "Build a fully native hyperlocal commerce layer within the resident app: grocery (Blinkit/Zepto integration API), pharmacy, doctor consultation, home services (Urban Company integration). Revenue share with platform partners. Turns the app into a daily-use lifestyle platform rather than a maintenance-utility — dramatically improving resident DAU and making uninstall effectively impossible.",
          unlockedSegment: "Large Indian developers and townships with captive resident base of 2,000+ units; GCC luxury communities",
          effort: "Very High (24–32 weeks)",
          impact: "High",
          priority: "P1",
        },
      ],
    },
  ],
};

const PostPossessionRoadmapTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins">
      {/* Strategic Header */}
      <div className="bg-[#1f3864] text-white p-4 rounded-t-xl shadow-sm">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — Strategic Product Roadmap
        </h2>
      </div>

      <div className="space-y-16 mt-8">
        {postPossessionRoadmap.sections.map((section, idx) => {
          return (
            <div key={idx} className="space-y-4">
              <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
                {section.timeframe} — {section.headline}
              </div>

              <div className="overflow-hidden border border-[#D3D1C7] rounded-xl shadow-sm">
                <table className="w-full border-collapse table-fixed text-[12px] leading-relaxed">
                  <thead>
                    <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[10px] tracking-wider">
                      <th className="border-r border-[#D3D1C7] px-4 py-3 text-left w-[22%]">Feature / Initiative</th>
                      <th className="border-r border-[#D3D1C7] px-4 py-3 text-left w-[33%]">Strategic Rationale (The 'Why')</th>
                      <th className="border-r border-[#D3D1C7] px-4 py-3 text-left w-[20%]">Unlocked Segment</th>
                      <th className="border-r border-[#D3D1C7] px-4 py-3 text-center w-[10%]">Effort</th>
                      <th className="border border-white/20 px-4 py-3 text-center w-[8%]">Impact</th>
                      <th className="border border-white/20 px-4 py-3 text-center w-[7%]">Prior.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, i) => (
                      <tr key={i} className="align-top bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                        <td className="border border-gray-100 px-4 py-4 font-bold text-[#1f3864]">
                          {item.whatItIs}
                        </td>
                        <td className="border border-gray-100 px-4 py-4 text-gray-600 italic">
                          {item.whyItMatters}
                        </td>
                        <td className="border border-gray-100 px-4 py-4 font-medium text-gray-700">
                          {item.unlockedSegment}
                        </td>
                        <td className="border border-gray-100 px-4 py-4 text-center font-medium text-gray-500 text-[11px]">
                          {item.effort}
                        </td>
                        <td className="border border-gray-100 px-4 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                            item.impact === "Very High" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {item.impact}
                          </span>
                        </td>
                        <td className="border border-gray-100 px-4 py-4 text-center font-black text-[#A52A1A]">
                          {item.priority}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Footer */}
      <div className="bg-white border border-[#D3D1C7] rounded-xl p-4 shadow-sm border-l-4 border-l-[#1f3864]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#1f3864] mb-2">Roadmap Philosophy</h4>
        <p className="text-[11px] text-[#666] leading-relaxed italic">
          This roadmap focuses on removing technical blockers for high-margin international markets while building a deep 
          AI-driven operational moat that point-solutions cannot replicate. Every initiative is tied to a specific 
          commercial outcome: expansion, retention, or monetisation.
        </p>
      </div>
    </div>
  );
};

export default PostPossessionRoadmapTab;
