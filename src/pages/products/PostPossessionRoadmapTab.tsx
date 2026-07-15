import React from "react";

type RoadmapItem = {
  initiative: string;
  whatItIs: string;
  whyItMatters: string;
  segment: string;
  dealRisk: string;
  priority: string;
  marketSignal: string;
};

type RoadmapPhase = {
  title: string;
  note: string;
  summary: string;
  items: RoadmapItem[];
};

const roadmapPhases: RoadmapPhase[] = [
  {
    "title": "PHASE 1 - IMMEDIATE (0-3 MONTHS) - Stop losing deals we should be winning",
    "note": "These features and fixes are needed right now. Each one is actively costing us deals in current pipeline.",
    "summary": "PHASE 1 SUMMARY - 5 items | Segments unlocked: Enterprise developers, premium gated communities, IFM portfolio accounts, REIT-grade residential | Estimated revenue impact: INR 2-4 crore in pipeline unblocked per quarter after delivery",
    "items": [
      {
        "initiative": "Native Developer Leadership Dashboard with Community Health Score",
        "whatItIs": "A real-time dashboard accessible to developer leadership showing one community health score per property, ticket SLA compliance %, billing collection rate, resident app adoption %, and gate activity volumes. No operational drilldown required.",
        "whyItMatters": "Cited in 40-60% of enterprise developer RFPs as a deal-blocking requirement. Developer CEOs and CXOs want a single-number health score per property, not raw operational reports.",
        "segment": "Enterprise real estate developers (500+ unit projects)",
        "dealRisk": "2-5 enterprise deals lost per quarter until delivered",
        "priority": "P1",
        "marketSignal": "MyGate Enterprise launched similar feature in 2024. Tata Crest includes it. Absence makes us look operational-only, not executive-ready."
      },
      {
        "initiative": "ANPR Camera Integration at Standard Tier",
        "whatItIs": "Out-of-the-box ANPR camera integration that enables automatic vehicle recognition at gate without custom implementation work. Should support top 3 ANPR hardware brands deployed in India residential.",
        "whyItMatters": "Required for premium gated communities and township projects as a gate management standard. NoBrokerHood bundles hardware. MyGate offers it on request. We have no standard offering.",
        "segment": "Premium gated communities, township developers, REIT-grade residential assets",
        "dealRisk": "Premium community deals lost to NoBrokerHood hardware bundle. Estimated 3-8 deals per quarter.",
        "priority": "P1",
        "marketSignal": "NoBrokerHood Shield (2024) bundles ANPR + camera. This is becoming a standard expectation in deals above INR 2,000/unit/year."
      },
      {
        "initiative": "AI Predictive Maintenance Alerting - Phase 1",
        "whatItIs": "ML model that analyses meter consumption patterns, checklist completion history, and asset maintenance records to predict equipment failure risk and generate proactive maintenance alerts for FM teams.",
        "whyItMatters": "First mover in India community management category. No competitor has deployed predictive maintenance. Strong ROI story: 20-30% reduction in emergency repair costs. IFM clients and REIT asset managers need this for contract renewal differentiation.",
        "segment": "IFM companies, REIT-grade residential, premium communities with high MEP complexity",
        "dealRisk": "Not a deal-blocker today but will become one in 12-18 months as awareness grows. Risk of ApnaComplex or NoBrokerHood announcing AI features first.",
        "priority": "P1",
        "marketSignal": "Smartly.io (Singapore) has launched AI community insights. Global PropTech trend toward predictive operations is 18 months ahead of India market."
      },
      {
        "initiative": "Biometric Attendance Integration for Staff",
        "whatItIs": "Integration with fingerprint and face recognition biometric devices for household staff and facility staff attendance tracking, replacing selfie-based attendance with tamper-proof biometric records.",
        "whyItMatters": "IFM contract renewals increasingly require biometric proof of service hours. Current selfie-based attendance is disputed by some clients. Biometric integration removes dispute risk and qualifies us for government-housing and REIT contracts requiring biometric compliance.",
        "segment": "IFM companies with government housing contracts, REIT-grade residential, premium communities with 24-hour security requirements",
        "dealRisk": "Government housing and REIT contracts require biometric attendance. Estimated 2-4 deals blocked per quarter without this.",
        "priority": "P2",
        "marketSignal": "Government housing projects (PMAY, CIDCO, MHADA) increasingly mandate biometric FM staff attendance in contract SLAs."
      },
      {
        "initiative": "Vendor and Service Provider Marketplace",
        "whatItIs": "Curated in-app marketplace within the resident-facing app where pre-vetted service providers can list services for resident booking. Includes home repairs, home maintenance, professional cleaning, and local food delivery.",
        "whyItMatters": "Creates a revenue-sharing stream from service provider commissions on top of the base SaaS license fee. Resident stickiness driver - frequent marketplace users are 3x less likely to request app change to a competing platform.",
        "segment": "All segments - resident experience enhancement applicable to all community types",
        "dealRisk": "Not a near-term deal-blocker but reduces long-term NPS and creates a platform for developer loyalty programs if delivered.",
        "priority": "P2",
        "marketSignal": "MyGate vendor marketplace is the most frequently praised resident-facing feature in community App Store reviews. Absence noted in resident feedback at deployed clients."
      }
    ]
  },
  {
    "title": "PHASE 2 - SHORT-TERM (3-6 MONTHS) - Expand addressable market and move up-market",
    "note": "These features open new segments, increase ACV, and move from mid-market to enterprise positioning.",
    "summary": "PHASE 2 SUMMARY - 5 items | Segments unlocked: Tier 2 / Tier 3 residential, REITs, institutional investors, enterprise developers with CRM-led sales, premium communities requiring integrated security | Estimated revenue impact: INR 4-8 crore incremental ARR",
    "items": [
      {
        "initiative": "Multi-Language Support (Hindi, Tamil, Telugu, Kannada, Marathi)",
        "whatItIs": "Resident app and admin console support for India's top 5 residential languages in addition to English. Language preference saved per user, not per project.",
        "whyItMatters": "Opens Tier 2 and Tier 3 city markets where English-only apps have low adoption. Bharat residential development is growing faster than Tier 1 cities. Government housing and affordable housing projects require Hindi support.",
        "segment": "Tier 2 and Tier 3 city developers, affordable housing projects, government housing (PMAY, CIDCO)",
        "dealRisk": "Tier 2 market locked until delivered. Estimated 30-40% of India residential market inaccessible without regional language support.",
        "priority": "P1",
        "marketSignal": "NoBrokerHood supports Hindi and Kannada. ApnaComplex supports Tamil. Language gap is noted in South India and Tier 2 market feedback."
      },
      {
        "initiative": "CCTV and Surveillance Dashboard Integration",
        "whatItIs": "Web console dashboard showing live and recorded CCTV feeds from community cameras alongside gate management and security incident reports. Integration with top 3 CCTV brands deployed in India residential.",
        "whyItMatters": "Security monitoring in one interface alongside operations increases platform stickiness for security administrators. Premium communities and township developers require integrated security monitoring.",
        "segment": "Premium gated communities, township developers, commercial office parks requiring physical security management",
        "dealRisk": "Security-focused deals deferred until CCTV integration available. NoBrokerHood Shield direct competitor feature.",
        "priority": "P1",
        "marketSignal": "NoBrokerHood Shield CCTV integration (2024) and Envision IoT security integration signal that security technology integration is becoming a baseline expectation in premium segments."
      },
      {
        "initiative": "CRM Integration - Salesforce and HubSpot MCP",
        "whatItIs": "Bi-directional integration between the Post Possession referral and lead module and developer sales team CRM. Referral leads from resident app flow directly into developer CRM with source attribution, resident contact, and unit details.",
        "whyItMatters": "Converts Post Possession from an operations platform into a revenue-generating tool for developer sales teams. Referral lead integration creates measurable ROI for the developer marketing and sales budget, not just the FM or CX budget.",
        "segment": "Enterprise real estate developers with CRM-led sales processes (Salesforce, HubSpot, Zoho CRM)",
        "dealRisk": "Marketing-led procurement at enterprise developers blocked until CRM integration proven. Estimated 2-4 enterprise deals require this as a pre-condition.",
        "priority": "P2",
        "marketSignal": "Yardi and Buildium have Salesforce integrations as standard. India platforms have none. First to deliver wins enterprise developer sales team as champion."
      },
      {
        "initiative": "ESG Reporting Module",
        "whatItIs": "Pre-built ESG reporting module aggregating waste generation data, meter consumption trends, water usage, energy consumption, and compliance records into ESG-formatted reports aligned to GRESB and GRI standards.",
        "whyItMatters": "REIT listing requirements under SEBI now include ESG disclosures. PE funds with green-linked financing need ESG data from their residential assets. No India community platform provides this.",
        "segment": "REITs, institutional investors, PE funds with ESG-linked debt covenants, premium developers seeking green building certifications",
        "dealRisk": "REIT and institutional investor segment entirely inaccessible without ESG reporting capability.",
        "priority": "P1",
        "marketSignal": "SEBI BRSR requirements for listed entities (including listed REITs and developer companies) now mandate ESG disclosures. Regulatory tailwind is clear."
      },
      {
        "initiative": "Loyalty Engine and Resident Rewards Program",
        "whatItIs": "Configurable resident loyalty module enabling developers to award points for app engagement, on-time bill payments, event participation, and referral submissions. Points redeemable for facility credits, service vouchers, or partner offers.",
        "whyItMatters": "Developer's single best tool for reducing resident churn to competing platforms and increasing referral conversion. Loyalty-engaged residents generate 3-5x more referral leads and have higher NPS scores.",
        "segment": "All segments - applicable to all community types as a resident experience enhancement",
        "dealRisk": "Resident retention and referral revenue opportunity delayed. Not a deal-blocker but creates measurable LTV increase when deployed.",
        "priority": "P2",
        "marketSignal": "MyGate does not have a loyalty program. First mover in India community management loyalty programs creates a resident-facing competitive advantage."
      }
    ]
  },
  {
    "title": "PHASE 3 - MEDIUM-TERM (6-18 MONTHS) - Build the long-term moat",
    "note": "These capabilities become structural advantages that are difficult to copy and expand the total addressable market.",
    "summary": "PHASE 3 SUMMARY - 4 items | Segments unlocked: UAE / UK / Southeast Asia, AI-native enterprise deals, vendor marketplace network, financial services cross-sell | Estimated revenue impact: INR 10-20 crore ARR at full deployment",
    "items": [
      {
        "initiative": "Global Edition - GDPR and PDPL Compliance Architecture",
        "whatItIs": "Platform variant configured for GDPR (UK/EU) and PDPL (UAE) compliance with data residency controls, consent management, and localised billing currency support in GBP and AED.",
        "whyItMatters": "Unlocks UAE, UK, and Southeast Asia markets for Indian developers with cross-border portfolios. PDPL (UAE Personal Data Protection Law effective 2024) creates the same urgency in UAE that DPDP Act creates in India.",
        "segment": "UAE-based developer clients, UK property managers, Indian developer groups with international portfolios",
        "dealRisk": "International expansion blocked until global compliance architecture delivered. Secondary market potential represents 20-30% of total TAM.",
        "priority": "P1",
        "marketSignal": "UAE PDPL enforcement began in 2024. UK GDPR enforcement has been active since 2018. Both markets have Indian developer presence looking for compliant platforms."
      },
      {
        "initiative": "AI Community Assistant - Resident-Facing Chatbot",
        "whatItIs": "LLM-powered in-app assistant that answers resident queries about billing, maintenance status, facility availability, community rules, and complaint status without human intervention. Trained on property-specific data stored on client servers.",
        "whyItMatters": "Reduces resident support tickets by 30-40% by resolving common queries instantly. Differentiates Post Possession from all India competitors as the first AI-native community platform. Data privacy is maintained because the LLM operates on-premise on client servers.",
        "segment": "All segments - highest value in large communities (1,000+ units) where FM team handles high query volumes",
        "dealRisk": "First mover advantage. No India community platform has deployed a resident-facing AI assistant.",
        "priority": "P2",
        "marketSignal": "Smartly.io (2024) and global PropTech players are investing in AI assistants. India market is 18-24 months behind but developer awareness is growing rapidly."
      },
      {
        "initiative": "Property Management Marketplace - Third-Party Vendors",
        "whatItIs": "Marketplace within the admin console where certified IFM vendors, AMC service providers, and specialist facility contractors list their services. Developers and RWAs can discover, compare, and onboard vendors directly from the platform.",
        "whyItMatters": "Revenue stream from vendor marketplace commissions. Platform stickiness for admin users increases when vendor discovery and procurement happens within the platform. Reduces developer time spent sourcing and onboarding FM vendors.",
        "segment": "Enterprise developers, IFM companies managing large portfolios, REIT asset managers requiring standardised vendor management",
        "dealRisk": "Vendor marketplace creates a defensible revenue stream that pure SaaS pricing cannot replicate. Competitive moat deepens as vendor network grows.",
        "priority": "P2",
        "marketSignal": "MyGate vendor marketplace is its highest-rated feature. Becoming a vendor distribution network creates a platform business model on top of SaaS."
      },
      {
        "initiative": "Financial Services Integration - Insurance and Loans for Residents",
        "whatItIs": "Partnered financial services layer enabling residents to access home insurance, appliance insurance, personal loans, and moving services directly through the resident app with the developer brand as the trust anchor.",
        "whyItMatters": "Non-SaaS revenue stream sharing with financial services partners. Developer brand association with premium financial services increases resident loyalty. NoBrokerHood already monetises this - we need a developer-branded equivalent.",
        "segment": "All residential segments - highest value in premium and luxury communities where financial services cross-sell is relevant",
        "dealRisk": "NoBrokerHood's financial services integration is their primary revenue diversification play. Not responding cedes this revenue stream entirely.",
        "priority": "P3",
        "marketSignal": "NoBrokerHood and ApnaComplex post-NoBroker acquisition are building financial services into community apps. This is an inevitable platform evolution in this category."
      }
    ]
  }
];

const PostPossessionRoadmapTab: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    section: {
      backgroundColor: "#DA7756",
      color: "#ffffff",
      fontFamily: "inherit",
      fontSize: "11pt",
      fontWeight: "bold",
      letterSpacing: "0.05em",
      padding: "12px 12px",
      textAlign: "left",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    note: {
      backgroundColor: "#F6F4EE",
      borderBottom: "2px solid #DA7756",
      color: "#DA7756",
      fontFamily: "inherit",
      fontSize: "11pt",
      fontWeight: "bold",
      padding: "14px 12px",
      textAlign: "left",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    headerCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "2px solid #C4B89D",
      borderRight: "1px solid rgba(196,184,157,0.5)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      letterSpacing: "0.05em",
      padding: "12px 8px",
      textAlign: "left",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    cell: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    altCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    summary: {
      backgroundColor: "#DA7756",
      border: "1px solid #C4B89D",
      color: "#ffffff",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      lineHeight: 1.6,
      padding: "14px 12px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
    },
  };

  const getCellStyle = (index: number) => (index % 2 === 0 ? styles.altCell : styles.cell);
  const priorityStyle = (priority: string, index: number) => ({
    ...getCellStyle(index),
    color: priority === "P1" ? "#9b1c1c" : priority === "P2" ? "#DA7756" : "#1f1f1f",
    fontWeight: "bold",
    textAlign: "center" as const,
  });

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            POST POSSESSION - PRODUCT ROADMAP
          </h2>
          <p className="text-xs opacity-70 italic mt-2 font-medium">
            Purpose: Prioritised feature roadmap grounded in market gaps, competitive weaknesses, and deal-loss analysis.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {roadmapPhases.map((phase) => (
          <section key={phase.title} className="overflow-x-auto">
            <table
              style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1650px", backgroundColor: "white" }}
              cellSpacing={0}
              cellPadding={0}
            >
              <colgroup>
                <col style={{ width: "240px" }} />
                <col style={{ width: "330px" }} />
                <col style={{ width: "330px" }} />
                <col style={{ width: "260px" }} />
                <col style={{ width: "230px" }} />
                <col style={{ width: "90px" }} />
                <col style={{ width: "320px" }} />
              </colgroup>
              <tbody>
                <tr>
                  <td style={styles.section} colSpan={7}>{phase.title}</td>
                </tr>
                <tr>
                  <td style={styles.note} colSpan={7}>{phase.note}</td>
                </tr>
                <tr>
                  {["Feature / Initiative", "What it is", "Why it matters", "Customer segment it unlocks", "Deal risk if delayed", "Priority", "Market Signal"].map((header) => (
                    <td key={header} style={styles.headerCell}>{header}</td>
                  ))}
                </tr>
                {phase.items.map((item, index) => {
                  const cellStyle = getCellStyle(index);

                  return (
                    <tr key={item.initiative} className="align-top">
                      <td style={{ ...cellStyle, fontWeight: "bold", color: "#DA7756" }}>{item.initiative}</td>
                      <td style={cellStyle}>{item.whatItIs}</td>
                      <td style={cellStyle}>{item.whyItMatters}</td>
                      <td style={cellStyle}>{item.segment}</td>
                      <td style={cellStyle}>{item.dealRisk}</td>
                      <td style={priorityStyle(item.priority, index)}>{item.priority}</td>
                      <td style={cellStyle}>{item.marketSignal}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td style={styles.summary} colSpan={7}>{phase.summary}</td>
                </tr>
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PostPossessionRoadmapTab;
