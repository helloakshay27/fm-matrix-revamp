import React from "react";

const PostPossessionMarketAnalysisTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins pb-10">
      {/* Header */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — Market Analysis
        </h2>
      </div>

      {/* Part A: Target Audience */}
      <section className="space-y-4">
        <div className="bg-[#DA7756] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part A — Target Audience (India, GCC, SE Asia, UK, US, Europe)
        </div>
        <div className="overflow-x-auto border border-[#D3D1C7] rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-[11px] leading-relaxed border-collapse">
            <thead className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border border-[#E5E7EB] w-[15%]">
                  Audience Segment
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[15%]">
                  Demographics
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[10%]">
                  Industry
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[20%]">
                  Pain Points (3 per segment)
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[20%]">
                  If NOT Solved (Risk/Cost)
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[20%]">
                  What 'Good Enough' Looks Like Today
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  segment:
                    "Large Indian Real Estate Developers (e.g., Godrej, Lodha, DLF, Sobha)",
                  demo: "B2B; India-based; 3,000–50,000 units delivered; listed or large-private; CRM, FM, Sales decision-makers",
                  industry: "Residential Real Estate",
                  pains:
                    "1. No standardised post-possession engagement channel.\n2. FM operations run on WhatsApp + Excel.\n3. Referral sales not formally tracked — high CP dependency.",
                  notSolved:
                    "1. Lose 30-40% repeat buyer opportunity.\n2. FM compliance failures create legal liability.\n3. Every untracked referral costs ₹3–10L in commission.",
                  goodEnough:
                    "MyGate for security + WhatsApp + Tally for billing + manual tasks.",
                  tone: "bg-[#F6F4EE]",
                },
                {
                  segment:
                    "Mid-Market Indian Developers (500–5,000 units; Tier-1 and Tier-2 cities)",
                  demo: "B2B; India-based; regional developers; cost-sensitive; less mature IT stack; FM outsourced",
                  industry: "Residential Real Estate",
                  pains:
                    "1. Post-possession relationship management is non-existent.\n2. Outsourced FM teams use paper checklists; no visibility.\n3. Low CAM collection rates (60–75%).",
                  notSolved:
                    "1. Resident churn to competitors; no loyalty.\n2. CAM shortfall leads to maintenance crises.\n3. Brand perception suffers due to poor service quality.",
                  goodEnough:
                    "Basic society apps (NoBrokerHood, Adda) + manual FM + phone reminders.",
                  tone: "bg-white",
                },
                {
                  segment:
                    "GCC Real Estate Developers & Property Managers (UAE, Saudi Arabia, Qatar)",
                  demo: "B2B; GCC-based; 200–10,000 units; high-value properties; multinational residents",
                  industry: "Residential / Property Mgmt",
                  pains:
                    "1. Fragmented PropTech landscape.\n2. Requires multi-language support (Arabic, English, Hindi).\n3. Regulatory compliance (RERA UAE, DLD) requires audit-ready docs.",
                  notSolved:
                    "1. Non-compliance leading to fines and licence risk.\n2. 1-star reviews in luxury segment impact future sales.\n3. Missing referrals from high-net-worth residents.",
                  goodEnough:
                    "Locally built portals; Yardi (large operators); no white-label community app.",
                  tone: "bg-[#F6F4EE]",
                },
                {
                  segment:
                    "Southeast Asia (Singapore, Malaysia, Thailand, Vietnam)",
                  demo: "B2B; SE Asia-based; 200–5,000 units; condo/serviced resonance developers",
                  industry: "Residential / Co-Living",
                  pains:
                    "1. Post-handover engagement is near-zero.\n2. Maintenance management uses legacy CMMS systems.\n3. Residents expect seamless app experience but receive none.",
                  notSolved:
                    "1. No warm channel for next project expansion.\n2. High FM staff overhead due to legacy systems.\n3. Missed upsell of premium on-premise services.",
                  goodEnough:
                    "BMS/CMMS for FM; no resident app; email and phone communication.",
                  tone: "bg-white",
                },
                {
                  segment: "UK & European Build-to-Rent (BTR) Operators",
                  demo: "B2B; UK/Europe-based; 100–5,000 units; institutional investors",
                  industry: "Build-to-Rent / Co-Living / PRS (Co-living)",
                  pains:
                    "1. Need resident platforms to compete with homeownership.\n2. Maintenance tools lack community engagement.\n3. GDPR compliance is non-negotiable.",
                  notSolved:
                    "1. Resident retention below 80% = 3–5% revenue loss.\n2. GDPR breach risk = fine up to 4% of global turnover.\n3. Inability to cross-sell services (gym, parking).",
                  goodEnough:
                    "Fixflo (maintenance) + Spike Living (community) + separate billing; fragmented stack.",
                  tone: "bg-[#F6F4EE]",
                },
                {
                  segment: "US Multifamily & HOA Operators",
                  demo: "B2B; US-based; 100–10,000 units; property management companies; HOA boards",
                  industry:
                    "Multifamily / HOA Management (Community Management)",
                  pains:
                    "1. HOA management is highly fragmented.\n2. Security relies on legacy software with no community layer.\n3. Resident engagement is a growing retention driver.",
                  notSolved:
                    "1. HOA delinquency above 15% creates cash flow crises.\n2. Security incidents create legal liability.\n3. Class A renter churn costs $4,000–7,000 per unit.",
                  goodEnough:
                    "AppFolio/Yardi (PM) + Smartwebs (HOA) + Verkada (security) + Slack; all disconnected.",
                  tone: "bg-white",
                },
              ].map((item, idx) => (
                <tr key={idx} className={item.tone}>
                  <td className="p-3 border border-gray-200 font-bold text-[#DA7756]">
                    {item.segment}
                  </td>
                  <td className="p-3 border border-gray-200 text-gray-700">
                    {item.demo}
                  </td>
                  <td className="p-3 border border-gray-200 font-medium">
                    {item.industry}
                  </td>
                  <td className="p-3 border border-gray-200 whitespace-pre-line">
                    {item.pains}
                  </td>
                  <td className="p-3 border border-gray-200 whitespace-pre-line text-[#9b1c1c] font-medium">
                    {item.notSolved}
                  </td>
                  <td className="p-3 border border-gray-200 italic">
                    {item.goodEnough}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Part B: Competitor Mapping */}
      <section className="space-y-4">
        <div className="bg-[#DA7756] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part B — Competitor Mapping (Global Landscape)
        </div>
        <div className="overflow-x-auto border border-[#D3D1C7] rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-[11px] leading-relaxed border-collapse">
            <thead className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border border-[#E5E7EB] w-[12%]">
                  Competitor
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[12%]">
                  Target Customer
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[12%]">
                  Pricing Model
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[12%]">
                  Discovery Channel
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[15%]">USPs</th>
                <th className="p-3 border border-[#E5E7EB] w-[12%]">
                  Weaknesses
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[15%]">
                  Our Opportunity
                </th>
                <th className="p-3 border border-[#E5E7EB] w-[10%]">Threats</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "MyGate",
                  customer: "Gated communities, RWAs, small developers (India)",
                  price: "Freemium to ₹2–5/unit/month",
                  discovery: "Word-of-mouth; App Store; gate guard adoption",
                  usp: "Best-in-class visitor mgmt; massive network effect",
                  weakness:
                    "No white-label; no developer loyalty; weak accounting; no data sovereignty",
                  opp: "Position as 'MyGate for developers who own their brand'. Target CRM teams needing referral modules.",
                  threat:
                    "Consumer brand recognition; free tier makes switching cost very low",
                  tone: "bg-[#F6F4EE]",
                },
                {
                  name: "NoBrokerHood",
                  customer: "RWAs and mid-size gated communities (India)",
                  price: "Free (cross-subsidised by classifieds)",
                  discovery: "NoBroker platform upsell; agent referrals",
                  usp: "Free to use; large user base; integrated rental services",
                  weakness:
                    "No white-label; no developer module; FM ops absent; no computer vision",
                  opp: "Target developers who have moved beyond 'free but basic' and need accountability.",
                  threat:
                    "Free model is a disruptor; rental services threaten referral revenue",
                  tone: "bg-white",
                },
                {
                  name: "Yardi / RENTCafé",
                  customer: "Institutional multifamily, REITs, BTR (US/UK/GCC)",
                  price: "$20–60/unit/month + impl. fees",
                  discovery: "Industry events (NMHC, MIPIM); consultants",
                  usp: "Full property mgmt stack; 30+ years brand equity",
                  weakness:
                    "Not white-label; 6–18 month implementation; no community engagement",
                  opp: "Offer faster deployment (weeks), white-label branding, and better engagement.",
                  threat: "AI capabilities; market dominance in US BTR",
                  tone: "bg-[#F6F4EE]",
                },
                {
                  name: "Fixflo / Plentific",
                  customer: "UK/EU BTR, housing associations, FM firms",
                  price: "£2–8/unit/month (modular)",
                  discovery:
                    "UK property conferences; partners (CBRE, Savills)",
                  usp: "Strong maintenance workflow; compliance tracking",
                  weakness:
                    "No community engagement; no white-label; no visitor management",
                  opp: "Replace Fixflo + separate community apps with one platform including billing.",
                  threat:
                    "Marketplace model connecting landlords to contractors",
                  tone: "bg-white",
                },
                {
                  name: "Engrain / Amenify",
                  customer: "US Class A multifamily; lifestyle properties",
                  price: "$5–15/unit/month (modular)",
                  discovery:
                    "US multifamily conferences; PropTech accelerators",
                  usp: "Strong UI/UX; resident-centric; lifestyle focus",
                  weakness:
                    "US-only; no FM/ops; no security; no billing; no white-label",
                  opp: "Position as 'ops + engagement in one platform' vs their lifestyle-only niche.",
                  threat: "Consumer-grade design sets a very high UX bar",
                  tone: "bg-[#F6F4EE]",
                },
                {
                  name: "Building Link",
                  customer: "HOA boards, condo associations (US/Canada)",
                  price: "$1–4/unit/month",
                  discovery: "HOA conferences; online search",
                  usp: "Purpose-built for HOA; violations mgmt; doc storage",
                  weakness:
                    "No white-label; no developer module; legacy UI; no computer vision",
                  opp: "Position as only white-label developer-branded platform for new gated communities.",
                  threat:
                    "Low price point creates price anchoring for developers",
                  tone: "bg-white",
                },
              ].map((comp, i) => (
                <tr
                  key={i}
                  className={`${comp.tone} hover:bg-indigo-50 transition-colors`}
                >
                  <td className="p-3 border border-gray-200 font-bold uppercase text-[10px] text-[#DA7756]">
                    {comp.name}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {comp.customer}
                  </td>
                  <td className="p-3 border border-gray-200 font-medium">
                    {comp.price}
                  </td>
                  <td className="p-3 border border-gray-200 italic">
                    {comp.discovery}
                  </td>
                  <td className="p-3 border border-gray-200 text-gray-700">
                    {comp.usp}
                  </td>
                  <td className="p-3 border border-gray-200 text-red-700">
                    {comp.weakness}
                  </td>
                  <td className="p-3 border border-gray-200 font-bold text-[#DA7756]">
                    {comp.opp}
                  </td>
                  <td className="p-3 border border-gray-200 italic text-gray-600">
                    {comp.threat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PostPossessionMarketAnalysisTab;
