import React from "react";

type FeatureComparisonRow = { featureArea: string; marketStandard: string; ourProduct: string; status: string; strategicImpact: string; };
type SummaryRow = { category: string; detail: string; implication: string; };
type PricingModelRow = { question: string; detail: string; };
type PriceRangeRow = { tier: string; indiaPrice: string; indiaFor: string; globalPrice: string; globalFor: string; };
type PlanFeatureRow = { feature: string; starter: string; professional: string; enterprise: string; };
type RecommendedPricingRow = { stage: string; indiaEntry: string; indiaMid: string; globalEntry: string; globalMid: string; notes: string; };
type PositioningRow = { prompt: string; recommendation: string; };
type ValuePropRow = { current: string; resonatesWith: string; weakness: string; improved: string; };

const featureComparisonRows: FeatureComparisonRow[] = [
  {
    "featureArea": "White-Label App",
    "marketStandard": "No competitor offers true white-label. MyGate, ApnaComplex, and NoBrokerHood are always branded as their own product.",
    "ourProduct": "Full white-label Android and iOS apps with client name, logo, and colour palette. Developer brand is the only brand residents see.",
    "status": "AHEAD",
    "strategicImpact": "Developer enterprise accounts require white-label as a mandatory RFP criterion. This single feature eliminates 3 of the top 4 competitors from consideration."
  },
  {
    "featureArea": "Data Sovereignty Architecture",
    "marketStandard": "All India competitors store resident data on their own central servers. No competitor offers self-hosted architecture at equivalent feature depth.",
    "ourProduct": "Every byte of resident data stored exclusively on the client's own servers. Lockated infrastructure holds no resident data from any deployed client.",
    "status": "AHEAD",
    "strategicImpact": "DPDP Act 2023 enforcement from 2025. Developer fiduciary obligation creates regulatory urgency. Zero competing platform offers this combination of depth and self-hosting."
  },
  {
    "featureArea": "Visitor Management",
    "marketStandard": "Gate approval via app notification. Pre-registration of expected visitors. Basic visitor log. Standard features across MyGate, NoBrokerHood.",
    "ourProduct": "OTP, IVR, push, digital intercom, visit codes, digital gate passes, group visitors, frequent visitors, cab pre-approvals, leave-at-gate, overstay alerts, offline guard mode.",
    "status": "AHEAD",
    "strategicImpact": "Visitor management is the primary daily use case for residents. Our depth creates higher daily active usage which drives overall platform stickiness and retention."
  },
  {
    "featureArea": "Household Staff Management",
    "marketStandard": "MyGate has a community-level staff database. Most platforms limited to basic entry/exit logging.",
    "ourProduct": "Resident-controlled add/associate/rate/block/red-flag workflow. Staff attendance with selfie verification, roster management, access schedules, community blacklist, daily pay recording.",
    "status": "AHEAD",
    "strategicImpact": "Household staff management drives daily resident engagement. Community-level blacklist is a safety feature that generates strong resident endorsement and word-of-mouth."
  },
  {
    "featureArea": "Goods Movement Tracing",
    "marketStandard": "No competitor has a dedicated goods movement module. Usually handled via visitor management or a paper-based process.",
    "ourProduct": "Full inward and outward goods movement tracking with item-level descriptions, images, approval workflows, registered/guest goods classification, and complete digital audit trail.",
    "status": "AHEAD",
    "strategicImpact": "Unique feature with no equivalent in competing platforms. Appeals to premium communities and IFM companies managing move-in/move-out workflows. Strong demo moment."
  },
  {
    "featureArea": "CAM Billing and Accounting",
    "marketStandard": "ApnaComplex has strong billing. MyGate billing is basic. Most platforms offer invoice generation and online payment but not full accounting ledger management.",
    "ourProduct": "Full accounting structure with group, subgroup, ledger creation, CAM charge configuration, automated invoice generation, GST compliance, ERP export, defaulter flagging, and service restriction controls.",
    "status": "AHEAD",
    "strategicImpact": "Billing is the primary reason RWAs and IFM companies switch platforms. Full accounting capability in one platform removes the need for a separate accounting tool."
  },
  {
    "featureArea": "Fitout Workflow Management",
    "marketStandard": "No competitor has a dedicated digital fitout workflow module. Handled via email or WhatsApp by most developers.",
    "ourProduct": "Resident-initiated fitout requests with admin approval, deviation tracking, SOP and manual storage, labour entry management, and deposit payment integration.",
    "status": "AHEAD",
    "strategicImpact": "Unique feature for post-possession developers. Significant time period between possession and occupation generates high fitout activity. Digitalising fitout reduces FM team overhead and creates a developer-controlled audit trail."
  },
  {
    "featureArea": "Permit to Work (PTW)",
    "marketStandard": "No consumer-grade community management platform has a PTW module. PTW is only available in enterprise FM platforms at 5-10x the price.",
    "ourProduct": "Full PTW workflow including hazardous area configuration, work type definition, scope and risk capture, multi-level authorization, supervisor and worker assignment, and training confirmation.",
    "status": "AHEAD",
    "strategicImpact": "Safety compliance differentiator for IFM companies and REIT-grade properties. PTW capability allows us to serve the FM operations layer, not just the resident experience layer."
  },
  {
    "featureArea": "Native Analytics Dashboard for Developer Leadership",
    "marketStandard": "MyGate and ApnaComplex have basic reporting. NoBrokerHood has some dashboard views. None offer a developer portfolio-level community health score dashboard.",
    "ourProduct": "Function-wise BI reports with chart views and data download exist. A native, real-time community health score dashboard for developer management teams is not yet available.",
    "status": "GAP",
    "strategicImpact": "Largest single gap cited in developer enterprise RFPs. Developer leadership teams want a single-number community health score per property without going into operational reports."
  },
  {
    "featureArea": "ANPR / Automatic Number Plate Recognition Integration",
    "marketStandard": "NoBrokerHood bundles camera hardware with ANPR. MyGate integrates with ANPR on request. Both competitors have this as a standard enterprise offering.",
    "ourProduct": "API integration with access control systems exists. Dedicated ANPR camera integration at standard tier pricing is not yet available out-of-the-box.",
    "status": "GAP",
    "strategicImpact": "ANPR is a deal-closing requirement for premium gated communities and township developers. Absence of standard ANPR integration costs us deals in the premium residential segment."
  },
  {
    "featureArea": "AI Predictive Maintenance Alerts",
    "marketStandard": "No India competitor has deployed AI predictive maintenance. This is a global gap across the community management category.",
    "ourProduct": "Asset maintenance scheduling and checklist management exist. AI-driven anomaly detection and predictive maintenance alerting based on consumption and maintenance patterns is not yet built.",
    "status": "GAP",
    "strategicImpact": "First mover opportunity in India. Predictive maintenance reduces emergency repair costs by 20-30% in managed communities. A compelling ROI story for IFM clients."
  },
  {
    "featureArea": "Facility Booking",
    "marketStandard": "MyGate has basic facility booking. ApnaComplex has a similar level. Standard booking with slot selection and payment.",
    "ourProduct": "Full facility booking with instant or request-based booking, capacity management, sub-facility structures, club membership management, usage-based automated charges, and multiple payment modes.",
    "status": "AHEAD",
    "strategicImpact": "Facility booking drives daily resident app opens. Deep booking configuration enables revenue generation for premium facilities."
  },
  {
    "featureArea": "Guard Patrolling and Security Audits",
    "marketStandard": "No consumer community management platform has a QR-based guard patrolling module. This capability exists only in enterprise security management platforms.",
    "ourProduct": "Full QR-based patrolling with scheduled checkpoints, digital completion logs, parking audits, no-honking zone audits, vehicle movement audits, and exception reporting.",
    "status": "AHEAD",
    "strategicImpact": "Security capability differentiates us from resident experience-only platforms. Enables us to replace security-specific software in addition to community management tools."
  },
  {
    "featureArea": "Operational Audit and Compliance Tracker",
    "marketStandard": "Basic checklists available in MyGate and ApnaComplex. Full operational audit management with approval workflows is absent in all direct competitors.",
    "ourProduct": "Full operational audit setup, scheduling, assignment, completion, approval, and report download. Compliance tracker with automated deadline alerts for AMC, PPM, and statutory compliance.",
    "status": "AHEAD",
    "strategicImpact": "IFM companies and REIT-grade properties require auditable compliance records. This feature opens the FM compliance market that generic community platforms cannot address."
  },
  {
    "featureArea": "Concierge and Service Booking",
    "marketStandard": "MyGate has a services marketplace. ApnaComplex has basic service directory. Both require third-party integration for fulfilment.",
    "ourProduct": "Full concierge booking module with service configuration, slot scheduling, cancellation rules, payment options, service reminders, invoice download, and feedback. F&B restaurant management with table booking and food ordering.",
    "status": "AHEAD",
    "strategicImpact": "Revenue-generating feature for developers who want to monetise community services. Resident stickiness driver when high-quality services are available within the app."
  }
];
const competitiveSummaryRows: SummaryRow[] = [
  {
    "category": "WHERE WE ARE AHEAD OF THE MARKET",
    "detail": "White-label app, data sovereignty architecture, goods movement tracing, household staff management, PTW module, fitout workflow, guard patrolling, full CAM billing with ERP export, operational audit and compliance tracker",
    "implication": "8 of 15 features are AHEAD of the market standard. Data sovereignty and white-label are absolute moats - no competitor can offer them without rebuilding their architecture. These two features alone justify price premium and win enterprise RFPs where compliance is the primary criterion."
  },
  {
    "category": "WHERE WE ARE AT PAR",
    "detail": "Facility booking, concierge services, community communication, events and polls, BI reporting with data download",
    "implication": "Core resident experience features are competitive. Investment should maintain parity rather than chase differentiation here. These features are table stakes that prevent deal loss but do not win deals on their own."
  },
  {
    "category": "WHERE WE HAVE GAPS THAT WILL COST US DEALS",
    "detail": "Native developer leadership dashboard with community health scores, ANPR camera integration at standard tier, AI predictive maintenance alerting",
    "implication": "These 3 gaps are cited in 40-60% of enterprise RFPs. Each gap costs approximately 2-5 enterprise deals per year. Priority investment in Q1-Q2 roadmap should close all three before the next CREDAI enterprise sales cycle."
  }
];
const pricingModelRows: PricingModelRow[] = [
  {
    "question": "What pricing models are standard in this category?",
    "detail": "Per-unit per-year (dominant in India - INR 600-3,600 depending on tier and module set). Per-unit per-month (dominant globally - USD 0.80-8). Flat community fee (used by some India platforms for small communities under 100 units). Managed service fee including platform plus operations team (Strata model - INR 150-300 per unit per month). Hardware plus SaaS hybrid (Envision, NoBrokerHood - hardware bundled at INR 3,000-8,000 per unit plus recurring SaaS fee). Freemium (none of the primary competitors use freemium successfully in this category - community management requires onboarding support that cannot scale with self-serve)."
  },
  {
    "question": "Which model dominates at entry level?",
    "detail": "Per-unit per-year at INR 600-1,200 with a core module bundle covering visitor management, helpdesk, communication, and basic billing. Entry-level deals are typically RWA-driven or small IFM contracts (under 500 units). Annual billing is preferred over monthly billing in India due to long sales cycles and high implementation effort relative to deal size."
  },
  {
    "question": "Which model dominates at enterprise level?",
    "detail": "Per-unit per-year negotiated enterprise pricing with a comprehensive module bundle. Enterprise deals (1,000+ units) include an implementation fee, a customisation budget, dedicated support SLA, and a data migration commitment. Enterprise pricing ranges from INR 1,800-3,600 per unit per year for full-stack deployments. Multi-property enterprise contracts carry a volume discount of 15-25% off list pricing."
  }
];
const priceRangeRows: PriceRangeRow[] = [
  {
    "tier": "Free / Freemium",
    "indiaPrice": "Not applicable in this category",
    "indiaFor": "No major India platform operates a sustainable freemium tier. Basic community WhatsApp groups substitute for free-tier adoption.",
    "globalPrice": "Not applicable",
    "globalFor": "Self-managed tools like Google Forms and WhatsApp Business serve as de facto freemium substitutes globally."
  },
  {
    "tier": "Entry / Starter",
    "indiaPrice": "INR 600-1,200",
    "indiaFor": "RWAs under 500 units, small IFM contracts, pilot deployments. Core modules only: visitor management, communication, basic helpdesk, simple billing.",
    "globalPrice": "USD 0.80-1.50 / unit / month",
    "globalFor": "Small property management companies in US and UK managing under 200 residential units. Core maintenance request and payment features."
  },
  {
    "tier": "Mid / Professional",
    "indiaPrice": "INR 1,200-2,400",
    "indiaFor": "Mid-market developers (200-1,000 units per project), IFM companies managing 10-50 properties, RWAs above 500 units with active operations team. Full module set including gate management, full billing, club booking.",
    "globalPrice": "USD 2-5 / unit / month",
    "globalFor": "Property management companies and residential REITs managing 200-2,000 units. Full resident lifecycle management, accounting integration, compliance tools."
  },
  {
    "tier": "Enterprise",
    "indiaPrice": "INR 2,400-3,600+",
    "indiaFor": "Large developers with 1,000+ units per project, multi-property IFM portfolios, REIT-grade residential assets. Full module set plus white-label, self-hosting, custom integrations, enterprise SLA.",
    "globalPrice": "USD 5-12 / unit / month",
    "globalFor": "Institutional residential operators, global REITs, large IFM companies. Custom API integrations, BI dashboard, portfolio-level reporting, dedicated support."
  }
];
const planFeatureRows: PlanFeatureRow[] = [
  {
    "feature": "Visitor Management - Basic Gate Approval",
    "starter": "Yes (MyGate, NoBrokerHood)",
    "professional": "Yes",
    "enterprise": "Yes"
  },
  {
    "feature": "Household Staff Management",
    "starter": "Basic (MyGate community DB)",
    "professional": "Full (most competitors)",
    "enterprise": "Full + API integrations"
  },
  {
    "feature": "Club Facility Booking",
    "starter": "Limited or not included",
    "professional": "Full booking with payment",
    "enterprise": "Full + membership management"
  },
  {
    "feature": "CAM Billing - Invoice Generation",
    "starter": "Not included in entry tier",
    "professional": "Basic invoice + online payment",
    "enterprise": "Full accounting + ERP export + GST"
  },
  {
    "feature": "Helpdesk / Ticketing",
    "starter": "Basic ticket creation",
    "professional": "SLA tracking + escalation",
    "enterprise": "Full CAPA + root cause + role-based access"
  },
  {
    "feature": "White-Label App",
    "starter": "Not available at any tier (competitors)",
    "professional": "Not available at any tier (competitors)",
    "enterprise": "Our platform only - available at all tiers"
  },
  {
    "feature": "Data Sovereignty / Self-Hosted",
    "starter": "Not available at any tier (competitors)",
    "professional": "Not available at any tier (competitors)",
    "enterprise": "Our platform only - available at all tiers"
  },
  {
    "feature": "Guard Patrolling and Audit",
    "starter": "Not available (competitors)",
    "professional": "Not available (competitors)",
    "enterprise": "Our platform - available from professional tier"
  },
  {
    "feature": "Permit to Work",
    "starter": "Not available in community platforms",
    "professional": "Not available in community platforms",
    "enterprise": "Our platform only - available at enterprise tier"
  },
  {
    "feature": "BI Reporting with Download",
    "starter": "Basic stats only",
    "professional": "Module-wise reports",
    "enterprise": "Full BI with chart views, data download, management reporting"
  },
  {
    "feature": "IoT / Access Control Integration",
    "starter": "Not included",
    "professional": "API integration on request",
    "enterprise": "Full integration package as standard"
  },
  {
    "feature": "Community Communication + Events + Polls",
    "starter": "Yes (all competitors)",
    "professional": "Yes with delivery reports",
    "enterprise": "Yes with targeted group messaging and analytics"
  }
];
const recommendedPricingRows: RecommendedPricingRow[] = [
  {
    "stage": "Now - Launch Pricing",
    "indiaEntry": "INR 800-1,200 per unit per year (core modules: visitor, helpdesk, communication, basic billing)",
    "indiaMid": "INR 1,600-2,400 per unit per year (full module set including gate management, club booking, full billing)",
    "globalEntry": "USD 1.20-2.00 per unit per month (core modules)",
    "globalMid": "USD 2.50-4.00 per unit per month (full module set)",
    "notes": "Launch pricing should be below market to build reference clients. Minimum 3 referenceable clients before raising to market rate."
  },
  {
    "stage": "6 Months",
    "indiaEntry": "INR 1,000-1,500 per unit per year (add analytics dashboard to entry module set after roadmap delivery)",
    "indiaMid": "INR 2,000-2,800 per unit per year (add ANPR integration and community health score dashboard to mid-market tier)",
    "globalEntry": "USD 1.50-2.50 per unit per month",
    "globalMid": "USD 3.00-5.00 per unit per month",
    "notes": "Price increase justified by analytics dashboard and ANPR integration delivery. Position as a feature upgrade, not a price increase."
  },
  {
    "stage": "18 Months - Market Leadership Play",
    "indiaEntry": "INR 1,200-1,800 per unit per year (expand entry to include loyalty module and AI maintenance alerts)",
    "indiaMid": "INR 2,400-3,600 per unit per year (full stack with AI predictive maintenance, advanced ESG reporting, Salesforce MCP integration)",
    "globalEntry": "USD 2.00-3.50 per unit per month",
    "globalMid": "USD 4.00-7.00 per unit per month",
    "notes": "18-month pricing reflects market leadership positioning. At this tier our pricing should be 10-20% below Tata Crest while offering superior feature depth and data sovereignty."
  }
];
const positioningRows: PositioningRow[] = [
  {
    "prompt": "Our single most defensible position right now",
    "recommendation": "The only self-hosted, white-label community management platform in India - meaning your brand, your data, your control."
  },
  {
    "prompt": "The 2-3 customer segments to prioritise this year and why",
    "recommendation": "1. Enterprise real estate developers (1,000+ units) - DPDP Act urgency, large deal size, referenceable clients create sales flywheel. 2. IFM companies managing 10+ properties - platform replaces 6-10 tools simultaneously, deal size multiplied by portfolio scale. 3. REIT-grade residential asset managers - ESG and compliance reporting requirements create urgency that generic platforms cannot address."
  },
  {
    "prompt": "The one competitor we should be displacing most aggressively and how",
    "recommendation": "MyGate. Approach: Lead with a DPDP Act compliance audit showing that MyGate's data storage makes the developer legally liable as a data fiduciary with zero control. Follow with white-label demonstration. Close with data migration commitment showing the developer exactly how historical data will be preserved during transition. MyGate's zero white-label and centralized data are permanent weaknesses they cannot fix without rebuilding their architecture."
  },
  {
    "prompt": "What we should STOP saying or doing",
    "recommendation": "Stop competing on price against MyGate and ApnaComplex in the RWA segment. Stop leading with feature lists in demos. Stop using the word 'platform' in sales conversations - it is abstract. Start saying 'your branded resident app' and 'your data on your servers' in every conversation."
  },
  {
    "prompt": "Recommended GTM motion for Year 1",
    "recommendation": "Direct enterprise sales to large developers (INR 1,000+ unit projects) led by a DPDP Act compliance conversation. Parallel IFM channel partnership with 2-3 national IFM companies who become resellers. Developer client referrals to expand within their portfolio and to peer developers. Events: CREDAI and NAREDCO annual conferences as primary lead generation channels."
  }
];
const valuePropRows: ValuePropRow[] = [
  {
    "current": "We are a white-label community management platform",
    "resonatesWith": "Developer VPs who already know they need white-label",
    "weakness": "Too feature-led. Does not explain why white-label matters or what outcome it creates for the developer.",
    "improved": "Residents will know your brand for the 20 years they live in your home, not ours. Every notification, every bill, every visitor approval carries your identity."
  },
  {
    "current": "We are the only self-hosted platform in this category",
    "resonatesWith": "CTOs and compliance officers who understand data sovereignty",
    "weakness": "Too technical for business decision-makers. Most developer VPs do not know what self-hosted means.",
    "improved": "Under DPDP Act 2023, you are legally responsible for your residents' data. If you use MyGate or ApnaComplex, their servers hold your data and you have no control. Our platform stores everything on your servers. Your data fiduciary obligation is actually fulfilled."
  },
  {
    "current": "One platform replacing 6-10 disconnected tools",
    "resonatesWith": "IFM operations directors looking to reduce tool sprawl",
    "weakness": "Claim is generic - every platform says this. Needs specificity.",
    "improved": "Your FM team today runs: a paper visitor register, a WhatsApp complaints group, Excel billing sheets, a separate booking app, and a physical staff register. We replace all five with one app your residents and team already know how to use."
  },
  {
    "current": "Full community management from gate to billing in one stack",
    "resonatesWith": "Facility managers and finance teams",
    "weakness": "Too broad. Does not name the pain point it solves or the outcome it creates.",
    "improved": "Your maintenance billing currently takes 30-45 days to collect because invoices are manual and payments are by bank transfer. Our platform generates invoices automatically and collects UPI payment from residents in under 72 hours."
  },
  {
    "current": "Trusted by developers across India",
    "resonatesWith": "Prospects evaluating credibility",
    "weakness": "Vague without numbers. 'Trusted' is claimed by every B2B SaaS vendor.",
    "improved": "Deployed across [X] communities managing [Y] lakh sq ft of residential space. Ask us for a 30-minute call with one of our deployed clients before you make any decision."
  }
];

const PostPossessionPricingTab: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    section: { backgroundColor: "#DA7756", color: "#ffffff", fontFamily: "inherit", fontSize: "11pt", fontWeight: "bold", letterSpacing: "0.05em", padding: "12px 12px", textAlign: "left", textTransform: "uppercase", verticalAlign: "middle", whiteSpace: "normal" },
    subSection: { backgroundColor: "#F6F4EE", borderBottom: "2px solid #DA7756", color: "#DA7756", fontFamily: "inherit", fontSize: "12pt", fontWeight: "bold", padding: "16px 12px", textAlign: "left", verticalAlign: "middle", whiteSpace: "normal" },
    headerCell: { backgroundColor: "#F6F4EE", borderBottom: "2px solid #C4B89D", borderRight: "1px solid rgba(196,184,157,0.5)", color: "#1f1f1f", fontFamily: "inherit", fontSize: "10pt", fontWeight: "bold", letterSpacing: "0.05em", padding: "12px 8px", textAlign: "left", textTransform: "uppercase", verticalAlign: "middle", whiteSpace: "normal" },
    cell: { backgroundColor: "#ffffff", borderBottom: "1px solid rgba(196,184,157,0.35)", borderRight: "1px solid rgba(196,184,157,0.35)", color: "#1f1f1f", fontFamily: "inherit", fontSize: "10pt", lineHeight: 1.55, padding: "12px 8px", textAlign: "left", verticalAlign: "top", whiteSpace: "normal", wordWrap: "break-word" },
    altCell: { backgroundColor: "#F6F4EE", borderBottom: "1px solid rgba(196,184,157,0.35)", borderRight: "1px solid rgba(196,184,157,0.35)", color: "#1f1f1f", fontFamily: "inherit", fontSize: "10pt", lineHeight: 1.55, padding: "12px 8px", textAlign: "left", verticalAlign: "top", whiteSpace: "normal", wordWrap: "break-word" },
    statusAhead: { backgroundColor: "#F6F4EE", borderBottom: "1px solid rgba(196,184,157,0.35)", borderRight: "1px solid rgba(196,184,157,0.35)", color: "#217346", fontFamily: "inherit", fontSize: "10pt", fontWeight: "bold", lineHeight: 1.55, padding: "12px 8px", textAlign: "left", verticalAlign: "top" },
    statusGap: { backgroundColor: "#FCE4D6", borderBottom: "1px solid rgba(196,184,157,0.35)", borderRight: "1px solid rgba(196,184,157,0.35)", color: "#9b1c1c", fontFamily: "inherit", fontSize: "10pt", fontWeight: "bold", lineHeight: 1.55, padding: "12px 8px", textAlign: "left", verticalAlign: "top" },
  };

  const getCellStyle = (index: number) => (index % 2 === 0 ? styles.altCell : styles.cell);
  const statusStyle = (status: string) => (status === "GAP" ? styles.statusGap : styles.statusAhead);
  const renderCells = (values: string[], index: number) => values.map((value, valueIndex) => (
    <td key={valueIndex} style={{ ...getCellStyle(index), fontWeight: valueIndex === 0 ? "bold" : "normal", color: valueIndex === 0 ? "#DA7756" : "#1f1f1f" }}>{value}</td>
  ));

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">POST POSSESSION - FEATURES AND PRICING</h2>
          <p className="text-xs opacity-70 italic mt-2 font-medium">Section 1: Feature comparison vs market standard | Section 2: Pricing landscape | Section 3: Positioning | Section 4: Value propositions</p>
        </div>
      </div>
      <div className="space-y-8">
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1450px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "220px" }} /><col style={{ width: "330px" }} /><col style={{ width: "330px" }} /><col style={{ width: "130px" }} /><col style={{ width: "390px" }} /></colgroup><tbody><tr><td style={styles.section} colSpan={5}>Section 1 - Current Features vs Market Standard</td></tr><tr>{["Feature Area", "Market Standard (what most products offer)", "Our Product - What we offer", "Status", "Why it matters to target revenue / strategy"].map((header) => <td key={header} style={styles.headerCell}>{header}</td>)}</tr>{featureComparisonRows.map((row, index) => <tr key={row.featureArea} className="align-top"><td style={{ ...getCellStyle(index), fontWeight: "bold", color: "#DA7756" }}>{row.featureArea}</td><td style={getCellStyle(index)}>{row.marketStandard}</td><td style={getCellStyle(index)}>{row.ourProduct}</td><td style={statusStyle(row.status)}>{row.status}</td><td style={getCellStyle(index)}>{row.strategicImpact}</td></tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1200px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "280px" }} /><col style={{ width: "430px" }} /><col style={{ width: "490px" }} /></colgroup><tbody><tr><td style={styles.section} colSpan={3}>Summary - Competitive Position and Pricing Model Impact</td></tr><tr>{["Category", "Detail", "Implication"].map((header) => <td key={header} style={styles.headerCell}>{header}</td>)}</tr>{competitiveSummaryRows.map((row, index) => <tr key={row.category} className="align-top">{renderCells([row.category, row.detail, row.implication], index)}</tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1100px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "300px" }} /><col style={{ width: "780px" }} /></colgroup><tbody><tr><td style={styles.section} colSpan={2}>Section 2 - Pricing Landscape and Recommended Pricing</td></tr><tr><td style={styles.subSection} colSpan={2}>2A - Standard Pricing Models in This Category</td></tr>{pricingModelRows.map((row, index) => <tr key={row.question} className="align-top">{renderCells([row.question, row.detail], index)}</tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1400px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "190px" }} /><col style={{ width: "230px" }} /><col style={{ width: "370px" }} /><col style={{ width: "230px" }} /><col style={{ width: "370px" }} /></colgroup><tbody><tr><td style={styles.subSection} colSpan={5}>2B - Typical Price Ranges (India vs Global)</td></tr><tr>{["Tier", "India - Per Unit Per Year", "India - Who is this tier for?", "Global - Per Unit Per Year", "Global - Who is this tier for?"].map((header) => <td key={header} style={styles.headerCell}>{header}</td>)}</tr>{priceRangeRows.map((row, index) => <tr key={row.tier} className="align-top">{renderCells([row.tier, row.indiaPrice, row.indiaFor, row.globalPrice, row.globalFor], index)}</tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1050px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "300px" }} /><col style={{ width: "250px" }} /><col style={{ width: "250px" }} /><col style={{ width: "250px" }} /></colgroup><tbody><tr><td style={styles.subSection} colSpan={4}>2C - How Competitors Categorise Features Across Plans</td></tr><tr>{["Feature", "Free / Starter", "Professional / Growth", "Enterprise"].map((header) => <td key={header} style={styles.headerCell}>{header}</td>)}</tr>{planFeatureRows.map((row, index) => <tr key={row.feature} className="align-top">{renderCells([row.feature, row.starter, row.professional, row.enterprise], index)}</tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1500px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "230px" }} /><col style={{ width: "270px" }} /><col style={{ width: "270px" }} /><col style={{ width: "230px" }} /><col style={{ width: "230px" }} /><col style={{ width: "300px" }} /></colgroup><tbody><tr><td style={styles.subSection} colSpan={6}>2D - Recommended Pricing: Now / 6 Months / 18 Months</td></tr><tr>{["Pricing Stage", "India - Entry Tier", "India - Mid Market", "Global - Entry Tier", "Global - Mid Market", "Notes"].map((header) => <td key={header} style={styles.headerCell}>{header}</td>)}</tr>{recommendedPricingRows.map((row, index) => <tr key={row.stage} className="align-top">{renderCells([row.stage, row.indiaEntry, row.indiaMid, row.globalEntry, row.globalMid, row.notes], index)}</tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1200px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "340px" }} /><col style={{ width: "840px" }} /></colgroup><tbody><tr><td style={styles.section} colSpan={2}>Section 3 - How to Position Ourselves</td></tr>{positioningRows.map((row, index) => <tr key={row.prompt} className="align-top">{renderCells([row.prompt, row.recommendation], index)}</tr>)}</tbody></table></section>
        <section className="overflow-x-auto"><table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1450px", backgroundColor: "white" }} cellSpacing={0} cellPadding={0}><colgroup><col style={{ width: "280px" }} /><col style={{ width: "260px" }} /><col style={{ width: "330px" }} /><col style={{ width: "560px" }} /></colgroup><tbody><tr><td style={styles.section} colSpan={4}>Section 4 - Value Propositions and Suggested Improvements</td></tr><tr>{["Value Proposition (Current)", "Who it resonates with", "What is weak about it", "Improved Value Proposition (sharper, outcome-led, specific)"].map((header) => <td key={header} style={styles.headerCell}>{header}</td>)}</tr>{valuePropRows.map((row, index) => <tr key={row.current} className="align-top">{renderCells([row.current, row.resonatesWith, row.weakness, row.improved], index)}</tr>)}</tbody></table></section>
      </div>
    </div>
  );
};

export default PostPossessionPricingTab;
