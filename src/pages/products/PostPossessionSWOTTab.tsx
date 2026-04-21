import React from "react";

const swotData = {
  strengths: [
    {
      id: "S1",
      title: "White-label + data sovereignty",
      detail: "White-label + data sovereignty is a unique global combination. No competitor offers both. Critical for GDPR (UK/EU), PDPL (GCC), and DPDP (India) compliance. This is a structural moat — not a feature."
    },
    {
      id: "S2",
      title: "Proven social proof",
      detail: "5+ years of production deployment with India's top developers (Godrej, Piramal, Runwal, Panchshil). This is social proof that eliminates 'unproven startup' objection in enterprise sales."
    },
    {
      id: "S3",
      title: "Revenue-enabling modules",
      detail: "Developer-side engagement module (referral, loyalty, new project marketing) is a category no competitor occupies. It repositions the product from 'cost' to 'revenue enabler' in the developer's P&L."
    },
    {
      id: "S4",
      title: "FM operations depth",
      detail: "FM operations depth (PPM, CAPA, 5-layer escalation, permit-to-work, vendor evaluation) matches or exceeds standalone FM tools — while being bundled with community and security. No rival offers this combination at one price point."
    },
    {
      id: "S5",
      title: "Visitor management breadth",
      detail: "Visitor management breadth (25+ features including offline mode, child safety, voice command, e-intercom) is best-in-class globally at this price point."
    },
    {
      id: "S6",
      title: "Lownd-cost CV & ANPR",
      detail: "Computer vision and ANPR integration at community-level pricing is a significant differentiator — these capabilities are typically priced 3–5x higher in standalone security platforms."
    },
    {
      id: "S7",
      title: "Integrated accounting & billing",
      detail: "Integrated accounting module with GST, ERP export, and direct bank settlement eliminates a separate billing tool. Most competitors require Tally/SAP alongside their platform."
    },
    {
      id: "S8",
      title: "Proven ROI metrics",
      detail: "Proven ROI metrics: ~50% CP cost reduction, ~20% support cost reduction. These are quantified commercial outcomes that convert budget conversations from IT spend to business ROI."
    },
    {
      id: "S9",
      title: "PropTech 2.0 readiness",
      detail: "IoT/OPC/Historian integration capability positions the product for smart building and PropTech 2.0 conversations that most community apps cannot enter."
    },
    {
      id: "S10",
      title: "Single-platform architecture",
      detail: "Single-platform architecture replacing 6–10 fragmented tools reduces vendor management overhead for developers — a compelling enterprise procurement argument."
    },
    {
      id: "S11",
      title: "Operational offline resilience",
      detail: "Guard app offline mode is a unique operational feature critical for basement parking, perimeter zones, and low-connectivity sites — frequently cited as a pain point by FM managers."
    },
    {
      id: "S12",
      title: "Cross-sell potential",
      detail: "Part of Lockated B2B SaaS suite — potential for cross-sell to workplace management, hot-desking, and corporate FM clients expanding into residential mixed-use."
    }
  ],
  weaknesses: [
    {
      id: "W1",
      title: "UI/UX design polish",
      detail: "UI/UX design quality is functional but below consumer-grade standards expected in UK, US, and GCC luxury markets. This creates first-impression disadvantage against newer competitors with polished interfaces."
    },
    {
      id: "W2",
      title: "Multi-language gap",
      detail: "Multi-language support (Arabic for GCC, Bahasa for SE Asia, Thai for Thailand, French for Europe) is not confirmed as a standard feature — a critical gap for international expansion."
    },
    {
      id: "W3",
      title: "Closed ecosystem perception",
      detail: "No public integration marketplace or API documentation portal. Enterprise buyers and system integrators expect a published connector library. Absence creates perception of a closed, inflexible system."
    },
    {
      id: "W4",
      title: "High-touch sales model",
      detail: "Sales motion is likely enterprise direct — no self-serve onboarding or freemium tier exists. This limits reach into mid-market communities where a lower-touch model could capture volume."
    },
    {
      id: "W5",
      title: "International brand awareness",
      detail: "Brand awareness outside India is near-zero. International expansion requires significant investment in brand building, localisation, and regional partnerships before pipeline materialises."
    },
    {
      id: "W6",
      title: "Implementation complexity",
      detail: "Product complexity (130+ features across 40+ modules) creates long implementation timelines and high onboarding friction — risk of deals stalling post-signature."
    },
    {
      id: "W7",
      title: "Developer activation dependency",
      detail: "Dependency on developer clients for resident activation — if a developer deploys the app poorly (low communication, no incentive), resident adoption suffers and product value is undermined."
    },
    {
      id: "W8",
      title: "Lack of published ROI benchmarks",
      detail: "No verified published case studies with quantified ROI benchmarks (e.g., 'Piramal reduced CP costs by 48% in 12 months'). These are needed to shorten enterprise sales cycles."
    },
    {
      id: "W9",
      title: "Module-segment mismatch",
      detail: "F&B module and some advanced modules (transport, space management) appear better suited to township/co-living than standard gated communities — unclear if these add confusion in core sales motion."
    },
    {
      id: "W10",
      title: "Outcome execution risk",
      detail: "Referral and loyalty module effectiveness depends on developer adoption quality. If developers don't promote the program to residents, the commercial differentiation does not materialise."
    },
    {
      id: "W11",
      title: "Opaque pricing",
      detail: "Pricing structure not publicly documented — likely requires custom quoting for most deals. This slows mid-market sales and makes digital demand generation harder."
    },
    {
      id: "W12",
      title: "Support & success function",
      detail: "No mention of a customer success or onboarding function — large feature sets with poor post-sale support lead to churn and negative word of mouth."
    }
  ],
  opportunities: [
    {
      id: "O1",
      title: "India DPDP Act 2023",
      detail: "Enforcement of data protection law in India forces developers to auditPropTech stacks. Post Possession's client-server architecture is a compliance-ready rip-and-replace opportunity."
    },
    {
      id: "O2",
      title: "GCC PropTech boom",
      detail: "Expansion in UAE, Qatar, and Saudi requires digital maintenance records. Entry now, before US/EU PropTech localises, is a first-mover opportunity."
    },
    {
      id: "O3",
      title: "UK Build-to-Rent growth",
      detail: "BTR sector in UK projected to double by 2030. Operators need GDPR-compliant, white-label resident experience platforms. Post Possession is structurally positioned to win."
    },
    {
      id: "O4",
      title: "CP cost reduction focus",
      detail: "As Indian real estate market tightens and CP costs rise, a referral platform saving ₹3–10 lakh per conversion becomes a commercial mandate."
    },
    {
      id: "O5",
      title: "Smart building convergence",
      detail: "IoT/ANPR capabilities position it as the front-end of a smart building stack — a segment growing at 25%+ CAGR globally."
    },
    {
      id: "O6",
      title: "Senior living expansion",
      detail: "Golden Ticket, health features, and wellness programs are purpose-built for the growing senior living market in India and GCC."
    },
    {
      id: "O7",
      title: "Township development boom",
      detail: "Mixed-use developments (5,000+ units) need F&B, transport, and loyalty modules — segments no current competitor serves effectively."
    },
    {
      id: "O8",
      title: "SE Asia management boom",
      detail: "Co-living and managed housing boom in Singapore/Vietnam. Partnership with regional operators could unlock the market rapidly."
    },
    {
      id: "O9",
      title: "Performance-based pricing",
      detail: "Introducing a pay-per-converted-lead model transforms the commercial conversation and unlocks sales budgets, being near-impossible for others to replicate."
    },
    {
      id: "O10",
      title: "PropTech consolidation winner",
      detail: "As smaller players exit or are acquired, enterprise developers will consolidate onto stable, deep platforms like Post Possession."
    },
    {
      id: "O11",
      title: "AI-powered FM automation",
      detail: "Predictive maintenance and NLP complaint classification create a defensible AI-enabled FM layer that simple community apps cannot match."
    },
    {
      id: "O12",
      title: "Marketplace GMV revenue",
      detail: "A 5–10% take rate on in-app household services (cleaning, laundry) creates a recurring, scaling non-SaaS revenue stream."
    }
  ],
  threats: [
    {
      id: "T1",
      title: "MyGate developer entry",
      detail: "If MyGate launches a white-label or referral product, their distribution advantage is massive. Mitigation: Move faster on loyalty/sovereignty features they cannot offer."
    },
    {
      id: "T2",
      title: "Yardi/AppFolio localization",
      detail: "If global enterprise players localise for India (GST, banking), they bring massive credibility. Mitigation: Deepen developer relationships and publish case studies now."
    },
    {
      id: "T3",
      title: "US PropTech international expansion",
      detail: "US platforms (Knock, Amenify) with superior UX and massive funding could win design-sensitive luxury segments. Mitigation: Accelerate UI/UX investment."
    },
    {
      id: "T4",
      title: "In-house developer builds",
      detail: "Large developers might build proprietary apps. Mitigation: Demonstrate that TCO of building + maintaining exceeds ₹5–15Cr vs SaaS cost."
    },
    {
      id: "T5",
      title: "ERP player consolidation",
      detail: "Salesforce or SAP acquiring a PropTech player would give them a single-vendor IT argument. Mitigation: Proactively integrate to become a complement."
    },
    {
      id: "T6",
      title: "Free tier price erosion",
      detail: "Freemium apps (NoBrokerHood) anchor price expectations low. Mitigation: Never compete on price; always sell measurable outcomes like CP savings."
    },
    {
      id: "T7",
      title: "Sovereignty as a double-edged sword",
      detail: "Client-server architecture creates deployment complexity. Mitigation: Offer hybrid cloud options that preserve sovereignty without hardware requirements."
    },
    {
      id: "T8",
      title: "Resident app fatigue",
      detail: "Multiple app touchpoints cause fatigue. Mitigation: Invest in gamification and rewards that drive daily habit formation."
    },
    {
      id: "T9",
      title: "GCC localization mandates",
      detail: "Saudi/UAE data mandates are evolving. Mitigation: Build compliance roadmap with local legal partners and monitor Saudi PDPL/UAE PDPA."
    },
    {
      id: "T10",
      title: "R&D gap vs US competitors",
      detail: "Venture-funded US players have massive velocity. Mitigation: Focus R&D on areas like local compliance where budget matters less than domain expertise."
    },
    {
      id: "T11",
      title: "PE-backed price compression",
      detail: "Aggressive pricing from PE-backed players to gain share. Mitigation: Deepen integration and customer success to raise switching costs."
    },
    {
      id: "T12",
      title: "AI replacement of manual workflows",
      detail: "Predictive AI making manual checklists/escalations obsolete. Mitigation: Build AI into the FM module ahead of the technology shift."
    }
  ]
};

const PostPossessionSWOTTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins">
      {/* Header */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — SWOT Analysis
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* STRENGTHS */}
        <div className="space-y-4">
          <div className="bg-[#2e7d32] text-white px-4 py-3 rounded-lg text-[13px] font-bold tracking-widest uppercase shadow-sm flex items-center justify-between">
            <span>STRENGTHS (Internal / Positive)</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">12 Points</span>
          </div>
          <div className="overflow-hidden border border-[#D3D1C7] rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-[#D3D1C7]">
                  <th className="p-3 text-center w-[12%]">#</th>
                  <th className="p-3 text-left">Strength — Detail & Market Relevance</th>
                </tr>
              </thead>
              <tbody>
                {swotData.strengths.map((item) => (
                  <tr key={item.id} className="border-b border-[#D3D1C7] last:border-0 hover:bg-green-50/10">
                    <td className="p-3 text-center font-bold text-[#2e7d32] bg-green-50/20">{item.id}</td>
                    <td className="p-3 text-gray-700 font-medium">
                      <span className="text-[#1f3864] font-bold block mb-0.5">{item.title}</span>
                      {item.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WEAKNESSES */}
        <div className="space-y-4">
          <div className="bg-[#c62828] text-white px-4 py-3 rounded-lg text-[13px] font-bold tracking-widest uppercase shadow-sm flex items-center justify-between">
            <span>WEAKNESSES (Internal / Negative)</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">12 Points</span>
          </div>
          <div className="overflow-hidden border border-[#D3D1C7] rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-[#D3D1C7]">
                  <th className="p-3 text-center w-[12%]">#</th>
                  <th className="p-3 text-left">Weakness — Detail & Market Relevance</th>
                </tr>
              </thead>
              <tbody>
                {swotData.weaknesses.map((item) => (
                  <tr key={item.id} className="border-b border-[#D3D1C7] last:border-0 hover:bg-red-50/10">
                    <td className="p-3 text-center font-bold text-[#c62828] bg-red-50/20">{item.id}</td>
                    <td className="p-3 text-gray-700 font-medium">
                      <span className="text-[#1f3864] font-bold block mb-0.5">{item.title}</span>
                      {item.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OPPORTUNITIES */}
        <div className="space-y-4 lg:mt-6">
          <div className="bg-[#1565c0] text-white px-4 py-3 rounded-lg text-[13px] font-bold tracking-widest uppercase shadow-sm flex items-center justify-between">
            <span>OPPORTUNITIES (External / Positive)</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">12 Points</span>
          </div>
          <div className="overflow-hidden border border-[#D3D1C7] rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-[#D3D1C7]">
                  <th className="p-3 text-center w-[12%]">#</th>
                  <th className="p-3 text-left">Opportunity — Detail & How to Exploit</th>
                </tr>
              </thead>
              <tbody>
                {swotData.opportunities.map((item) => (
                  <tr key={item.id} className="border-b border-[#D3D1C7] last:border-0 hover:bg-blue-50/10">
                    <td className="p-3 text-center font-bold text-[#1565c0] bg-blue-50/20">{item.id}</td>
                    <td className="p-3 text-gray-700 font-medium">
                      <span className="text-[#1f3864] font-bold block mb-0.5">{item.title}</span>
                      {item.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* THREATS */}
        <div className="space-y-4 lg:mt-6">
          <div className="bg-[#e65100] text-white px-4 py-3 rounded-lg text-[13px] font-bold tracking-widest uppercase shadow-sm flex items-center justify-between">
            <span>THREATS (External / Negative)</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">12 Points</span>
          </div>
          <div className="overflow-hidden border border-[#D3D1C7] rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-[#D3D1C7]">
                  <th className="p-3 text-center w-[12%]">#</th>
                  <th className="p-3 text-left">Threat — Detail & Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {swotData.threats.map((item) => (
                  <tr key={item.id} className="border-b border-[#D3D1C7] last:border-0 hover:bg-orange-50/10">
                    <td className="p-3 text-center font-bold text-[#e65100] bg-orange-50/20">{item.id}</td>
                    <td className="p-3 text-gray-700 font-medium">
                      <span className="text-[#1f3864] font-bold block mb-0.5">{item.title}</span>
                      {item.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic Footer Card */}
      <div className="bg-white border-2 border-[#D3D1C7] rounded-2xl p-6 shadow-md mt-12">
        <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <div className="bg-[#1f3864] text-white p-4 rounded-xl font-bold text-center min-w-[140px]">
            <div className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Strategic Moat</div>
            <div className="text-xl">DATA SOVEREIGNTY</div>
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-gray-700 leading-relaxed italic">
              "Post Possession holds a unique globally defensible position by being the only platform that combines white-label developer branding with full data sovereignty. As global privacy laws tighten, this structural advantage becomes the primary driver for enterprise rip-and-replace deals."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPossessionSWOTTab;
