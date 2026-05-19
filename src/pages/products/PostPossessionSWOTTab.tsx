import React from "react";

type SWOTItem = {
  id: string;
  title: string;
  detail: string;
};

type SWOTQuadrant = {
  key: string;
  title: string;
  items: SWOTItem[];
  tone: {
    header: string;
    panel: string;
    border: string;
    badge: string;
    title: string;
  };
};

const splitItem = (id: string, value: string): SWOTItem => {
  const [title, ...detailParts] = value.split(": ");

  return {
    id,
    title,
    detail: detailParts.join(": "),
  };
};

const swotQuadrants: SWOTQuadrant[] = [
  {
    key: "strengths",
    title: "Strengths",
    tone: {
      header: "bg-[#E8F5E9] text-[#1B5E20]",
      panel: "bg-[#F7FCF8]",
      border: "border-[#B7D9BC]",
      badge: "bg-[#1B5E20] text-white",
      title: "text-[#1B5E20]",
    },
    items: [
      splitItem(
        "S1",
        "Data Sovereignty Architecture: The only community management platform in India where all resident data is stored exclusively on the client's own servers - an absolute competitive moat that no competitor can replicate without rebuilding their infrastructure."
      ),
      splitItem(
        "S2",
        "White-Label App Exclusivity: Genuine white-label Android and iOS apps carrying the developer's brand. No India competitor offers white-label at equivalent feature depth. This is a RFP-winning differentiator in every enterprise developer tender."
      ),
      splitItem(
        "S3",
        "Goods Movement Tracing Module: A unique feature with no equivalent in any competing platform. Digital inward and outward goods tracking with item-level records is a premium community differentiator that creates strong demo moments."
      ),
      splitItem(
        "S4",
        "Permit-to-Work Module: PTW capability is available only in enterprise FM platforms at 5-10x our price. Our inclusion at community management pricing opens the FM compliance market that generic community platforms cannot address."
      ),
      splitItem(
        "S5",
        "End-to-End Operational Coverage: Gate management through billing through community engagement in one platform. Replacing 6-10 tools simultaneously is a cost and complexity reduction story that resonates with IFM operations directors."
      ),
      splitItem(
        "S6",
        "Full CAM Billing with Accounting Structure: Group, subgroup, and ledger-level accounting with ERP export, GST compliance, defaulter flagging, and automated invoice generation at a price point that basic billing tools cannot match."
      ),
      splitItem(
        "S7",
        "Fitout Workflow Digitisation: A unique module covering the critical 3-12 month period between possession and occupation when developer-resident interactions are highest. Replaces entirely manual processes with a digital audit trail."
      ),
      splitItem(
        "S8",
        "Guard Patrolling with QR Checkpoints: Security operations capability that is absent from all consumer-grade community platforms. Enables us to replace security-specific software in addition to community management tools."
      ),
      splitItem(
        "S9",
        "Household Staff Management Depth: Community-wide blacklist, background check facilitation hooks, selfie attendance, and daily pay recording at a depth that exceeds even MyGate's household staff offering."
      ),
      splitItem(
        "S10",
        "Self-Hosted DPDP Act Compliance Story: In the context of DPDP Act 2023 enforcement from 2025, our architecture converts a product feature into a legal compliance solution. No amount of marketing spend can replicate regulatory urgency as a sales catalyst."
      ),
    ],
  },
  {
    key: "weaknesses",
    title: "Weaknesses",
    tone: {
      header: "bg-[#FFEBEE] text-[#B71C1C]",
      panel: "bg-[#FFF8F9]",
      border: "border-[#F0B9C0]",
      badge: "bg-[#B71C1C] text-white",
      title: "text-[#B71C1C]",
    },
    items: [
      splitItem(
        "W1",
        "No Native Developer Leadership Dashboard: The single most cited gap in enterprise RFPs. Developer CXOs and board members want a community health score per property. Absence costs us 40-60% of enterprise deals in current pipeline."
      ),
      splitItem(
        "W2",
        "No Standard ANPR Integration at Tier Pricing: ANPR is a deal-closing requirement for premium gated communities. NoBrokerHood bundles hardware. Our absence of a standard ANPR offering costs us premium community deals every quarter."
      ),
      splitItem(
        "W3",
        "No AI Predictive Maintenance: First mover opportunity not yet captured. Competitors are beginning to signal AI roadmaps. Window to be first in India category is 12-18 months before a well-funded competitor launches."
      ),
      splitItem(
        "W4",
        "No Freemium or Self-Service Entry Path: All community onboarding requires implementation support. Cannot scale to smaller communities (under 200 units) without a cost-prohibitive CAC relative to deal value."
      ),
      splitItem(
        "W5",
        "No Multi-Language Support: English-only interface locks us out of Tier 2 and Tier 3 India markets, affordable housing projects, and government housing contracts where Hindi and regional language support is mandatory."
      ),
      splitItem(
        "W6",
        "No Dedicated Biometric Attendance Integration: Government housing and REIT contracts increasingly require biometric proof of FM staff hours. Selfie-based attendance is insufficient for regulated contracts."
      ),
      splitItem(
        "W7",
        "No Resident-Facing Vendor Marketplace: MyGate's most-praised feature is absent. High-frequency resident service discovery happens through the competing platform, not ours. This reduces daily active usage in service-heavy communities."
      ),
      splitItem(
        "W8",
        "Implementation-Heavy Go-Live Process: Each new community requires significant setup time. Without a self-service onboarding flow, sales and implementation capacity becomes the growth bottleneck above 50+ communities."
      ),
      splitItem(
        "W9",
        "Brand Awareness Below MyGate and NoBrokerHood: In the RWA and mid-market segment, resident-driven platform selection often defaults to brands they recognise from peers. Low consumer brand awareness is a barrier in non-developer-led sales."
      ),
      splitItem(
        "W10",
        "Dependency on Client IT Infrastructure for Self-Hosting: Self-hosted architecture is our moat but also our friction point. Some smaller developers lack the IT capability to set up and maintain their own server environment, adding implementation complexity."
      ),
    ],
  },
  {
    key: "opportunities",
    title: "Opportunities",
    tone: {
      header: "bg-[#FFF3E0] text-[#E65100]",
      panel: "bg-[#FFFCF7]",
      border: "border-[#F3C28A]",
      badge: "bg-[#E65100] text-white",
      title: "text-[#E65100]",
    },
    items: [
      splitItem(
        "O1",
        "DPDP Act 2023 Enforcement from 2025: First significant Indian data privacy law with meaningful penalties for data fiduciaries. Creates externally driven urgency for developer clients to move off third-party-hosted platforms. This is the largest single market catalyst available to us."
      ),
      splitItem(
        "O2",
        "8,500+ Active Residential Developers Without Structured Post-Possession Platform: The addressable market in India is almost entirely unserved. Even capturing 1% of 4.2 million units delivered in 5 years generates INR 34-100 crore ARR at our pricing."
      ),
      splitItem(
        "O3",
        "IFM Channel Multiplier: 3 national IFM company partnerships each managing 30-50 properties would deploy Post Possession across 15,000-25,000 additional units without proportional sales headcount increase."
      ),
      splitItem(
        "O4",
        "REIT ESG Reporting Mandate Under SEBI BRSR: Listed REITs and developer companies now face mandatory ESG disclosures. Post Possession's meter management, waste tracking, and compliance modules position us as the only community management platform with native ESG data collection."
      ),
      splitItem(
        "O5",
        "UAE and UK Market Entry via PDPL and GDPR Compliance: Indian developer groups have cross-border portfolios in UAE (PDPL active 2024) and UK (GDPR). One DPDP Act-compliant architecture with localised variants opens both markets without a ground-up rebuild."
      ),
      splitItem(
        "O6",
        "Co-Living and Senior Living Growth in India: Co-living occupancy in India grew 28% in 2024 (JLL India). Senior living pipeline is 50,000+ units planned through 2027. Both segments have high resident turnover that makes automated onboarding and billing critical."
      ),
      splitItem(
        "O7",
        "Developer Premium on Resident Retention Data: Developers who understand LTV are beginning to invest in post-possession engagement to increase repeat purchases and referrals. Post Possession converts the resident app into a sales and marketing channel for new launches."
      ),
      splitItem(
        "O8",
        "Competitor Data Scandal Risk: Any major data breach at MyGate, ApnaComplex, or NoBrokerHood would accelerate enterprise developer migration to self-hosted platforms. We should be the ready alternative when this moment occurs."
      ),
      splitItem(
        "O9",
        "Government Smart City and PMAY Digital Layer Requirements: Smart City Mission and Affordable Housing projects increasingly specify digital community management in tender documents. A government-approved deployment record would open a massive tender-driven segment."
      ),
      splitItem(
        "O10",
        "Fragmented Global Community Management Market: No single platform dominates the global residential community management category. Our self-hosted, white-label, full-stack architecture would be differentiated in Singapore, Malaysia, and GCC markets without major product changes."
      ),
    ],
  },
  {
    key: "threats",
    title: "Threats",
    tone: {
      header: "bg-[#FFF8E1] text-[#E65100]",
      panel: "bg-[#FFFDF5]",
      border: "border-[#EAD487]",
      badge: "bg-[#E65100] text-white",
      title: "text-[#E65100]",
    },
    items: [
      splitItem(
        "T1",
        "MyGate Enterprise Expansion (2024): MyGate launched a direct enterprise offering targeting large developer groups with centralised portfolio dashboards. They are moving up-market aggressively with VC backing and an established resident base. This is the most acute near-term competitive threat."
      ),
      splitItem(
        "T2",
        "ApnaComplex + NoBroker Post-Acquisition Integration: NoBroker's acquisition of ApnaComplex creates a platform with combined resident reach of 15M+ users, financial services integration, and potential cross-sell of property transaction data. The combined entity has capital to improve product depth rapidly."
      ),
      splitItem(
        "T3",
        "NoBrokerHood Shield Hardware Bundling: NoBrokerHood's CCTV + ANPR hardware bundle (2024) is creating an expectation in premium communities that the community management platform includes security hardware. Without an ANPR integration standard offer, we risk losing premium community deals."
      ),
      splitItem(
        "T4",
        "DPDP Act Enforcement Delay Risk: If DPDP Act enforcement is delayed or weakened through 2025-2026, the primary urgency driver for our compliance-led enterprise sales motion weakens. Our entire sales narrative is partly contingent on regulatory enforcement timing."
      ),
      splitItem(
        "T5",
        "Tata Crest Entering Competitive Pricing Territory: Tata Crest is expanding from Tata group projects to third-party developer clients, signalling pricing pressure. Their brand credibility with large listed developers could displace us in enterprise deals where procurement risk aversion is high."
      ),
      splitItem(
        "T6",
        "Free Google Workspace Tools as Functional Substitute: For RWAs and small IFM companies, Google Forms, Google Sheets, and Google Meet already provide a zero-cost alternative for basic community management. Price-sensitive RWAs may never upgrade to paid platforms."
      ),
      splitItem(
        "T7",
        "Smartly.io and Global PropTech AI Features: Singapore-based Smartly.io and global PropTech players are deploying AI community insights and predictive maintenance 18-24 months ahead of India-specific platforms. If they enter India directly, they enter with a feature lead."
      ),
      splitItem(
        "T8",
        "Developer Consolidation Reducing Addressable Market: India's top 50 developers now account for 60%+ of new supply. If 3-4 of these large developers develop proprietary platforms (as Tata did with Tata Crest), the enterprise segment could partially close to third-party platforms."
      ),
      splitItem(
        "T9",
        "Implementation Complexity Limiting Growth Velocity: Each new community deployment requires significant implementation resources. If implementation throughput cannot scale with sales velocity, we create a backlog that leads to delayed go-lives and client satisfaction risk."
      ),
      splitItem(
        "T10",
        "Macroeconomic Slowdown in India Real Estate: A sustained housing market correction would reduce new possession deliveries, compress developer budgets for post-possession technology, and increase price sensitivity in RWA renewal conversations. External macro risk to revenue growth."
      ),
    ],
  },
];

const PostPossessionSWOTTab: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 font-poppins">
      <div className="border-l-4 border-l-[#DA7756] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DA7756]">
          Post Possession
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#2C2C2C]">
          SWOT Analysis
        </h2>
        <p className="mt-2 text-sm text-[#6B6257]">
          10 items per quadrant, aligned from the sheet into direct columns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {swotQuadrants.map((quadrant) => (
          <section
            key={quadrant.key}
            className={`overflow-hidden border bg-white shadow-sm ${quadrant.tone.border}`}
          >
            <div
              className={`flex items-center justify-between gap-4 px-5 py-4 ${quadrant.tone.header}`}
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.16em]">
                {quadrant.title}
              </h3>
              <span className="text-xs font-semibold">
                {quadrant.items.length} points
              </span>
            </div>

            <div className={`divide-y ${quadrant.tone.border}`}>
              {quadrant.items.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-[52px_minmax(0,1fr)] ${quadrant.tone.panel}`}
                >
                  <div className="flex items-start justify-center border-r border-black/10 px-2 py-4">
                    <span
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-bold ${quadrant.tone.badge}`}
                    >
                      {item.id}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <h4 className={`text-sm font-bold ${quadrant.tone.title}`}>
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[13px] leading-6 text-[#2C2C2C]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PostPossessionSWOTTab;
