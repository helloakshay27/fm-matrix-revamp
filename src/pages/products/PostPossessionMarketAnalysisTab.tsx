import React from "react";

type TargetAudienceRow = {
  segment: string;
  demographics: string;
  profile: string;
  painPoints: string;
  consequence: string;
  goodEnough: string;
  urgency: string;
  buyer: string;
};

type CompanyPainRow = {
  company: string;
  pain1: string;
  pain2: string;
  pain3: string;
  cost: string;
};

type CompetitorRow = {
  competitor: string;
  customer: string;
  pricing: string;
  discovery: string;
  strengths: string;
  weaknesses: string;
  gap: string;
  risk: string;
};

const targetAudienceRows: TargetAudienceRow[] = [
  {
    "segment": "Real Estate Developer",
    "demographics": "Companies with 500-5,000 employees; VP / Head of Customer Experience; 35-55 years; B2B decision-maker; Tier 1 and Tier 2 India cities; increasingly global portfolios in UAE and UK",
    "profile": "Residential real estate development companies with active post-possession portfolios of 500 to 50,000+ units. Segment includes listed developers (DLF, Prestige, Godrej) and mid-market regional developers with 3-15 active residential projects.",
    "painPoints": "1. No structured resident engagement channel after handover. 2. Third-party app stores all resident data outside developer control creating DPDP Act 2023 risk. 3. Zero visibility on referral leads or NPS from existing residents.",
    "consequence": "Developer loses brand equity in their own properties. Residents associate their daily living experience with MyGate or ApnaComplex instead of the developer. Regulatory fines under DPDP Act 2023 enforcement from 2025 onwards. Referral revenue lost to informal channels.",
    "goodEnough": "A WhatsApp group managed by the RWA committee + MyGate for gate management + an Excel sheet for billing. Considered acceptable until a regulatory or reputational incident forces a change.",
    "urgency": "HIGH - DPDP Act 2023 enforcement now active. 4.2 million units delivered in last 5 years without a compliant post-possession platform.",
    "buyer": "VP Customer Experience / Head of Post Sales / CXO"
  },
  {
    "segment": "IFM / Property Management Company",
    "demographics": "Companies with 200-2,000 FM staff; Operations Director / VP Operations; managing 10-200 residential properties simultaneously; pan-India and Southeast Asia presence",
    "profile": "Integrated Facility Management companies contracted by developers or RWAs to manage operations. Examples: Jones Lang LaSalle Facilities, CBRE India Residential, Knight Frank India FM, Colliers India. Manage multiple properties under one central operations team.",
    "painPoints": "1. Juggling 6-10 disconnected tools - paper registers, Excel billing, WhatsApp complaints, separate booking apps. 2. No unified view of SLA performance across portfolio. 3. Staff attendance and compliance tracked manually with no digital audit trail.",
    "consequence": "IFM contract renewal at risk if SLA scores deteriorate. Client developer or RWA demands data they cannot produce. Staff accountability gaps create liability exposure in safety and compliance incidents.",
    "goodEnough": "A mix of a legacy FM software for ticketing, Excel for billing, WhatsApp groups for communication, and paper visitor logs. IFM managers consider this normal until a developer client demands a better reporting pack.",
    "urgency": "HIGH - IFM companies winning new contracts must now demonstrate digital capability as part of RFP scoring.",
    "buyer": "Operations Director / VP FM Operations / Account Manager"
  },
  {
    "segment": "RWA / Apartment Owners Association",
    "demographics": "Elected resident committees of 5-15 members; voluntary role; mix of retired professionals and active business owners; managing 200-5,000 unit communities; Tier 1 and Tier 2 India cities",
    "profile": "Resident Welfare Associations and Apartment Owners Associations formed after possession in communities without developer-managed operations. Self-governed, usually operating under state apartment ownership act provisions.",
    "painPoints": "1. Maintenance collection is manual with low recovery rates and no automated reminder system. 2. Visitor management done through paper or WhatsApp with no audit trail for security incidents. 3. No central platform for community communication, event management, and billing.",
    "consequence": "Community management quality declines as RWA committee members burn out managing everything manually. Security incidents with no digital audit trail create legal exposure. Collection defaults compound over months, reducing corpus fund available for maintenance.",
    "goodEnough": "A WhatsApp group for announcements + cash or bank transfer for billing + a physical visitor register at the gate. Considered workable by most RWAs until a security incident or billing dispute forces escalation.",
    "urgency": "MEDIUM - Pain is strong but procurement authority and budget approval timeline is longer due to democratic decision-making structure.",
    "buyer": "RWA President / Secretary / Treasurer"
  },
  {
    "segment": "Real Estate Private Equity / REIT / Institutional Investor",
    "demographics": "Portfolio managers and asset managers at PE funds and REITs; managing residential assets worth INR 500 crore to INR 5,000 crore+; ESG reporting obligations; India-focused and cross-border institutional investors",
    "profile": "PE funds with residential asset portfolios, REITs with residential or mixed-use assets, and institutional investors requiring portfolio-level reporting and ESG compliance documentation across their residential holdings.",
    "painPoints": "1. No consolidated view of resident satisfaction or operational KPIs across portfolio assets. 2. ESG reporting requires waste, energy, and sustainability data that no platform currently collects from residential communities. 3. Data stored on third-party servers creates fiduciary risk and DPDP Act exposure for funds with listed entities.",
    "consequence": "Portfolio assets underperform on resident retention and resale value due to poor post-possession management. ESG scores suffer, affecting access to green-linked capital. Regulatory exposure increases as DPDP Act enforcement tightens.",
    "goodEnough": "Quarterly reports prepared manually by IFM managers using Excel and email. ESG data collected through consultants rather than platform-generated feeds. Considered a reporting overhead until ESG compliance becomes mandatory for access to institutional financing.",
    "urgency": "MEDIUM-HIGH - ESG compliance and DPDP Act create growing urgency for institutionalised post-possession platforms.",
    "buyer": "Asset Manager / Portfolio Director / Head of Residential Operations"
  }
];

const companyPainRows: CompanyPainRow[] = [
  {
    "company": "Large Developer (1,000+ units/year, listed or unlisted)",
    "pain1": "Resident data stored on third-party servers violates DPDP Act 2023 obligations; developer is legally the data fiduciary but has no control over data handling",
    "pain2": "Post-possession brand equity erodes as residents associate their daily experience with MyGate or ApnaComplex rather than the developer",
    "pain3": "Referral marketing potential from 50,000+ satisfied residents is completely unmonetised due to absence of a structured referral capture layer",
    "cost": "INR 1-5 crore regulatory exposure per incident under DPDP Act; brand erosion reduces pre-launch bookings from referrals by estimated 15-30%"
  },
  {
    "company": "Mid-Market Developer (200-1,000 units/year, regional)",
    "pain1": "No structured post-possession engagement tool within budget; off-the-shelf tools are not white-label capable and do not offer self-hosted architecture",
    "pain2": "CAM billing is managed through Excel or basic accounting software with manual invoice generation leading to 30-45 day collection cycle delays",
    "pain3": "Visitor management done through paper registers with no digital audit trail, creating liability if a security incident is investigated",
    "cost": "Lost collection efficiency costs INR 15-40 lakh per year in delayed receipt; security liability exposure in absence of digital visitor records"
  },
  {
    "company": "IFM Company (Pan-India, 50+ properties)",
    "pain1": "SLA performance data is spread across disconnected tools making it impossible to produce a real-time portfolio-wide performance dashboard for developer clients",
    "pain2": "Staff attendance tracked manually with no digital proof; IFM companies vulnerable to contract disputes about actual service hours delivered",
    "pain3": "Compliance deadlines for AMC, PPM, and statutory inspections missed due to no centralised tracker; missed compliance is a contract penalty trigger in most IFM SLAs",
    "cost": "Contract loss risk if developer clients adopt a platform standard; estimated 20-40% of IFM contracts now require digital platform capability at RFP stage"
  },
  {
    "company": "RWA / AOA (Existing community, 500-5,000 units)",
    "pain1": "Maintenance collection rate below 70% due to absence of automated reminders, online payment option, and defaulter flagging; community corpus fund under pressure",
    "pain2": "Resident communication handled through multiple WhatsApp groups with no read-receipt tracking; critical notices often missed by large segments of the community",
    "pain3": "Household staff management done informally with no background check facilitation, no entry/exit log, and no community-wide blacklist for flagged individuals",
    "cost": "Collection shortfall forces RWA to defer maintenance, reducing property values; security incidents from unverified household staff create legal and insurance liability"
  }
];

const competitorRows: CompetitorRow[] = [
  {
    "competitor": "MyGate (India)",
    "customer": "RWAs, developers, and IFM companies managing gated residential communities; strong in Bengaluru, Hyderabad, Delhi NCR; 25,000+ communities",
    "pricing": "Per-community flat fee + per-unit fee: INR 1,200-2,400 per unit per year for core plan; enterprise pricing negotiated separately; no self-hosted option at any tier",
    "discovery": "Strong SEO for 'apartment management app', viral resident referrals within gated communities, CREDAI event presence, developer partnerships at launch stage",
    "strengths": "1. Best-in-class guard app UX with very high resident adoption. 2. Household staff community-level database with background check integrations. 3. Vendor marketplace for community services.",
    "weaknesses": "1. All resident data stored on MyGate servers - DPDP Act 2023 compliance risk for developers. 2. Zero white-label capability - always MyGate-branded. 3. Billing and helpdesk modules are weak compared to full-stack FM platforms.",
    "gap": "Developer clients who need a white-label app and data sovereignty cannot use MyGate at all. We target developer enterprise accounts with a compliance-first displacement pitch citing DPDP Act fiduciary obligations.",
    "risk": "MyGate launched MyGate Enterprise in 2024 targeting large developer groups directly with centralised dashboards. This is a direct threat to our enterprise segment - they are moving upmarket aggressively."
  },
  {
    "competitor": "ApnaComplex (India)",
    "customer": "RWAs and apartment communities; strong in South India; 3,500+ communities; growing in Tier 2 cities",
    "pricing": "INR 600-1,800 per unit per year depending on modules; recently acquired by NoBroker which may affect pricing strategy going forward",
    "discovery": "Google Search for 'apartment management software India', App Store reviews, word-of-mouth in South India RWA networks, NoBroker cross-sell post-acquisition",
    "strengths": "1. Strong CAM billing module with tally export. 2. Good resident-facing communication features. 3. Post-NoBroker acquisition brings deeper property transaction data integration.",
    "weaknesses": "1. No white-label option - always ApnaComplex-branded. 2. Post-NoBroker acquisition, data flows to NoBroker infrastructure - increased third-party data exposure risk. 3. Gate management and guard app functionality is limited compared to MyGate.",
    "gap": "RWAs concerned about data going to NoBroker after the acquisition are actively seeking alternatives. We approach NoBroker-acquired community clients with a data sovereignty audit offer showing exactly what data is now accessible to NoBroker.",
    "risk": "NoBroker-ApnaComplex integration is being used to cross-sell rental and resale services to residents - this transforms ApnaComplex from a management tool into a commerce platform, which may alienate RWAs wanting a neutral platform."
  },
  {
    "competitor": "NoBrokerHood (India)",
    "customer": "Residential gated communities; primarily Bengaluru, Mumbai, Pune; 12,000+ communities claimed; targeting both RWAs and developer-delivered communities",
    "pricing": "INR 1,000-2,000 per unit per year; bundled pricing with NoBroker financial services; gate management hardware often bundled",
    "discovery": "NoBroker's 30M+ user base drives cross-sell; Google Ads for apartment management keywords; resident-facing acquisition through NoBroker property search",
    "strengths": "1. Massive resident base from NoBroker creates instant resident adoption. 2. Hardware bundling (IP camera, gate tablet) reduces implementation friction. 3. Financial services cross-sell (insurance, loans) generates ancillary revenue from resident base.",
    "weaknesses": "1. Financial services cross-sell creates conflict of interest with neutral community management. 2. Resident data feeds into NoBroker commercial platform - highest third-party data exposure risk in the category. 3. Enterprise white-label capability absent.",
    "gap": "NoBrokerHood's commercial data usage of resident information is the strongest DPDP Act risk in the category. We build a comparison document showing exactly which resident data types flow to NoBroker commercial teams and use it in developer enterprise sales.",
    "risk": "NoBrokerHood launched NoBrokerHood Shield (security camera integration) in 2024, positioning hardware as a moat. We need an ANPR and camera integration roadmap to neutralise this advantage in security-sensitive enterprise deals."
  },
  {
    "competitor": "Tata Crest (India)",
    "customer": "Premium residential developers and luxury community management; Tata brand gives enterprise credibility; limited deployment scale compared to MyGate or ApnaComplex",
    "pricing": "INR 1,800-3,000 per unit per year; primarily enterprise developer contracts; implementation-heavy with longer sales cycles",
    "discovery": "Tata brand relationships in developer community; direct enterprise sales through Tata Realty relationships; CREDAI and NAREDCO developer conferences",
    "strengths": "1. Tata brand credibility reduces procurement risk perception for large developers. 2. Enterprise-grade support and SLA commitments. 3. Integration with Tata group ecosystem (Tata Capital, Tata AIG) for resident financial services.",
    "weaknesses": "1. Very high cost relative to feature parity with mid-market competitors. 2. Limited ability to customise for non-Tata developer clients. 3. Slow product iteration cycle compared to VC-backed competitors.",
    "gap": "Large developers who want Tata-level enterprise credibility but cannot justify Tata Crest pricing are an ideal target. We position self-hosted architecture as a superior data governance story and offer enterprise SLAs comparable to Tata Crest at lower cost.",
    "risk": "Tata Crest is expanding beyond Tata group residential projects to third-party developers, which signals a revenue pressure-driven expansion. Their entry into competitive pricing territory could affect mid-market positioning."
  },
  {
    "competitor": "Envision IoT / Smartworld (India)",
    "customer": "Large township developers and smart city projects; IoT hardware integration is the primary entry point; community management software is secondary",
    "pricing": "INR 3,000-8,000 per unit implementation cost including hardware; SaaS recurring fee INR 1,200-2,400 per unit per year on top of hardware",
    "discovery": "Developer conference presentations, smart city RFPs, direct relationships with large township developers; limited online presence",
    "strengths": "1. Native IoT hardware integration with BMS, access control, CCTV, and energy management. 2. Single vendor for hardware and software simplifies procurement for large projects. 3. Smart city and RERA compliance reporting built into platform.",
    "weaknesses": "1. Very high total cost of ownership due to hardware dependency. 2. Software module depth for resident experience is shallow compared to resident-first platforms. 3. Implementation timelines of 6-18 months delay go-live.",
    "gap": "Township developers who want smart city features but cannot afford Envision's hardware-led pricing are a target. We offer software-only architecture with open API for hardware integration, which is faster and cheaper to deploy.",
    "risk": "Envision is partnering with Jio and BSNL for connected community infrastructure in large township projects. IoT connectivity partnerships could give them an advantage in smart city tenders that require telco-integrated infrastructure."
  },
  {
    "competitor": "Yardi Breeze / Yardi Voyager (Global)",
    "customer": "Property management companies, REITs, and institutional residential operators in US, UK, Australia, and Southeast Asia; minimal India presence",
    "pricing": "USD 1-4 per unit per month for Breeze; Voyager enterprise pricing at USD 5-15 per unit per month; no India-specific product or pricing in INR",
    "discovery": "US property management industry events (NAA, NMHC), Google Ads for property management software, integration marketplace partnerships",
    "strengths": "1. Industry-leading accounting and financial reporting for institutional investors. 2. Deep lease management and resident lifecycle tracking. 3. Large integration ecosystem with 100+ third-party property tech tools.",
    "weaknesses": "1. No India market support or INR pricing. 2. No guard app or gate management module suited for Indian residential security norms. 3. DPDP Act compliance architecture not addressed; data stored on Yardi US servers.",
    "gap": "Indian PE funds and REITs with US or global investor bases sometimes consider Yardi for their India portfolios. We target these accounts by showing that our self-hosted India architecture solves both DPDP Act and data localisation requirements that Yardi cannot address.",
    "risk": "Yardi acquired Rent Cafe in India in 2023 to gain foothold in India resident-facing applications. Yardi has capital to localise quickly if India PropTech market signals are strong enough."
  },
  {
    "competitor": "Buildium / RealPage (Global)",
    "customer": "Small and mid-market property managers in North America and UK; primarily single-family and multifamily residential; minimal India presence",
    "pricing": "USD 0.82-1.40 per unit per month for Buildium; RealPage at USD 1-5 per unit per month depending on module set; no INR pricing",
    "discovery": "Google Ads for property management software USA, content marketing targeting US property managers, App Store and Play Store discovery",
    "strengths": "1. Strong maintenance request and vendor management workflow. 2. Resident portal with online payment and communication tools. 3. Good accounting integration with QuickBooks and Xero.",
    "weaknesses": "1. No gate management or guard app capability - not designed for Indian gated community security norms. 2. No India market support or DPDP Act compliance architecture. 3. Community management features are basic compared to India-specific platforms.",
    "gap": "US-educated Indian property investors managing Indian properties sometimes evaluate Buildium because they know it from abroad. We convert these leads by demonstrating that Buildium cannot address Indian gated community needs - no guard app, no household staff management, no India billing compliance.",
    "risk": "RealPage acquisition by Thoma Bravo in 2021 has slowed product innovation. Buildium is growing through SMB acquisition which keeps them in the US market; India entry not yet signalled."
  },
  {
    "competitor": "MRI Software / Angus Systems (Global)",
    "customer": "Commercial and residential property managers and REITs in UK, Australia, and Singapore; institutional asset management teams",
    "pricing": "USD 2-8 per unit per month for residential modules; enterprise contracts negotiated; no India presence or INR pricing",
    "discovery": "Commercial real estate industry events (MIPIM, SIMA), direct enterprise sales, commercial broker network partnerships",
    "strengths": "1. Best-in-class compliance and lease management for commercial and institutional residential. 2. Strong FM work order management module. 3. Deep integration with financial systems including Yardi and SAP.",
    "weaknesses": "1. Primarily commercial real estate focus; residential community management features are thin. 2. No resident mobile app at the depth of India-specific platforms. 3. No gate management, visitor management, or household staff management for Indian residential norms.",
    "gap": "Indian PE funds and REITs who use MRI for their commercial assets look for a comparable platform for residential. We position as the India residential equivalent - enterprise-grade, self-hosted, with all residential-specific modules that MRI lacks.",
    "risk": "MRI acquired Rockend in Australia in 2022, deepening Asia-Pacific presence. Southeast Asia expansion may lead to India market evaluation given India REIT growth trajectory."
  },
  {
    "competitor": "Strata / CBRE Residential Management (India)",
    "customer": "Premium RWAs and developer communities with professional property management contracts; Bengaluru, Mumbai, Hyderabad; 300+ communities",
    "pricing": "INR 150-300 per unit per month as a managed service fee including platform and operations team; not a pure SaaS play",
    "discovery": "Developer referrals for post-possession management contracts, premium community word-of-mouth, LinkedIn targeting of RWA committees in premium communities",
    "strengths": "1. Managed service model - Strata provides the platform AND the operations team, reducing RWA committee burden. 2. Professional FM team trained on their own platform. 3. Premium resident experience positioning matches luxury community expectations.",
    "weaknesses": "1. Managed service model means the developer loses control of the resident relationship and platform branding. 2. Pricing is 2-5x higher than SaaS-only alternatives due to managed service component. 3. Not a white-label product - always Strata-branded.",
    "gap": "Developers who want a branded platform and operational control rather than outsourcing to Strata are a direct target. We position as 'your brand, your data, your control' versus Strata's 'outsource everything' model.",
    "risk": "Strata is expanding into Tier 2 cities (Pune, Hyderabad, Ahmedabad) and launching a lighter-touch SaaS product targeting smaller communities. SaaS entry could shift them into our mid-market pricing territory."
  },
  {
    "competitor": "Smartly.io / BuildingLink (Southeast Asia / Global)",
    "customer": "Condominium management companies and property developers in Singapore, Malaysia, and Thailand; limited India presence",
    "pricing": "USD 15-40 per unit per year for BuildingLink; Smartly.io at SGD 2-5 per unit per month; no INR pricing or India deployment",
    "discovery": "Condominium management association networks in Singapore, developer referrals in Malaysia, App Store discovery by resident committees",
    "strengths": "1. Strong resident communication and event management for Southeast Asian condominium culture. 2. Parcel and delivery management tailored for high-rise urban communities. 3. Multilingual support for Singapore and Malaysian resident demographics.",
    "weaknesses": "1. No gate management or household staff management relevant to Indian community norms. 2. No CAM billing with GST compliance for India. 3. No self-hosted architecture for DPDP Act compliance.",
    "gap": "Indian developer groups with Southeast Asia projects sometimes evaluate Smartly.io for consistency across markets. We target these groups with a multi-country deployment offer - single platform, self-hosted in each jurisdiction, meeting local compliance requirements.",
    "risk": "Smartly.io is adding AI-based community insights and predictive maintenance features as differentiators for the institutional condominium management segment. Their AI roadmap is ahead of most India-specific platforms including ours."
  }
];

const competitorSummary = "COMPETITOR SUMMARY - Competitor to displace first: MyGate. Reason: MyGate has the largest installed base in our target markets (25,000+ communities), no white-label capability, and all resident data stored on MyGate servers - creating a direct DPDP Act 2023 compliance exposure for developer clients. Their enterprise expansion (MyGate Enterprise 2024) signals they are moving upmarket, which means developer accounts are now actively evaluating alternatives. Our displacement pitch is a compliance-led conversation: any developer using MyGate is legally the data fiduciary under DPDP Act but has zero control over how MyGate stores and uses that data. This is the conversation that creates urgency for switching regardless of feature satisfaction.";

const PostPossessionMarketAnalysisTab: React.FC = () => {
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
    subSection: {
      backgroundColor: "#F6F4EE",
      borderBottom: "2px solid #DA7756",
      color: "#DA7756",
      fontFamily: "inherit",
      fontSize: "12pt",
      fontWeight: "bold",
      padding: "16px 12px",
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
      lineHeight: 1.65,
      padding: "16px 14px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
    },
  };

  const renderCells = (values: string[], index: number) => {
    const cellStyle = index % 2 === 0 ? styles.altCell : styles.cell;

    return values.map((value, valueIndex) => (
      <td
        key={valueIndex}
        style={{
          ...cellStyle,
          fontWeight: valueIndex === 0 ? "bold" : "normal",
          color: valueIndex === 0 ? "#DA7756" : "#1f1f1f",
        }}
      >
        {value}
      </td>
    ));
  };

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            POST POSSESSION - MARKET ANALYSIS
          </h2>
          <p className="text-xs opacity-70 italic mt-2 font-medium">
            Geography focus: India (Primary) and Global (Secondary) | Section 1: Target Audience | Section 2: Competitor Mapping (10 Competitors)
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="overflow-x-auto">
          <table
            style={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "100%",
              minWidth: "2100px",
              backgroundColor: "white",
            }}
            cellSpacing={0}
            cellPadding={0}
          >
            <colgroup>
              <col style={{ width: "190px" }} />
              <col style={{ width: "310px" }} />
              <col style={{ width: "330px" }} />
              <col style={{ width: "320px" }} />
              <col style={{ width: "350px" }} />
              <col style={{ width: "310px" }} />
              <col style={{ width: "260px" }} />
              <col style={{ width: "260px" }} />
            </colgroup>
            <tbody>
              <tr>
                <td style={styles.section} colSpan={8}>Section 1 - Target Audience</td>
              </tr>
              <tr>
                <td style={styles.subSection} colSpan={8}>Part A - Target Audience (Geographies: India, Global)</td>
              </tr>
              <tr>
                {[
                  "Audience Segment",
                  "Demographics",
                  "Industry and Company Profile",
                  "Key Pain Points (3 per segment)",
                  "What happens if pain points are NOT solved",
                  "What good enough looks like to them today",
                  "Urgency",
                  "Primary Buyer Title",
                ].map((header) => (
                  <td key={header} style={styles.headerCell}>{header}</td>
                ))}
              </tr>
              {targetAudienceRows.map((row, index) => (
                <tr key={row.segment} className="align-top">
                  {renderCells([
                    row.segment,
                    row.demographics,
                    row.profile,
                    row.painPoints,
                    row.consequence,
                    row.goodEnough,
                    row.urgency,
                    row.buyer,
                  ], index)}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="overflow-x-auto">
          <table
            style={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "100%",
              minWidth: "1300px",
              backgroundColor: "white",
            }}
            cellSpacing={0}
            cellPadding={0}
          >
            <colgroup>
              <col style={{ width: "240px" }} />
              <col style={{ width: "260px" }} />
              <col style={{ width: "260px" }} />
              <col style={{ width: "260px" }} />
              <col style={{ width: "320px" }} />
            </colgroup>
            <tbody>
              <tr>
                <td style={styles.subSection} colSpan={5}>Part B - Company-Level Pain Points (India and Global)</td>
              </tr>
              <tr>
                {["Company Type and Size", "Pain Point 1", "Pain Point 2", "Pain Point 3", "Cost / Risk if unsolved"].map((header) => (
                  <td key={header} style={styles.headerCell}>{header}</td>
                ))}
              </tr>
              {companyPainRows.map((row, index) => (
                <tr key={row.company} className="align-top">
                  {renderCells([row.company, row.pain1, row.pain2, row.pain3, row.cost], index)}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="overflow-x-auto">
          <table
            style={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "100%",
              minWidth: "2200px",
              backgroundColor: "white",
            }}
            cellSpacing={0}
            cellPadding={0}
          >
            <colgroup>
              <col style={{ width: "220px" }} />
              <col style={{ width: "300px" }} />
              <col style={{ width: "270px" }} />
              <col style={{ width: "270px" }} />
              <col style={{ width: "300px" }} />
              <col style={{ width: "300px" }} />
              <col style={{ width: "330px" }} />
              <col style={{ width: "330px" }} />
            </colgroup>
            <tbody>
              <tr>
                <td style={styles.section} colSpan={8}>Section 2 - Competitor Mapping (10 Competitors, India and Global)</td>
              </tr>
              <tr>
                <td style={styles.subSection} colSpan={8}>India competitors priced in INR. Global competitors priced in USD. Real pricing from published sources and market intelligence.</td>
              </tr>
              <tr>
                {[
                  "Competitor",
                  "Primary Target Customer",
                  "Pricing Model and Approx Price",
                  "How buyers discover them",
                  "Their 3 Strongest Features",
                  "Their 3 Key Weaknesses",
                  "Market Gap they leave open - How we capitalise",
                  "Recent product or marketing innovation - Risk to us",
                ].map((header) => (
                  <td key={header} style={styles.headerCell}>{header}</td>
                ))}
              </tr>
              {competitorRows.map((row, index) => (
                <tr key={row.competitor} className="align-top">
                  {renderCells([
                    row.competitor,
                    row.customer,
                    row.pricing,
                    row.discovery,
                    row.strengths,
                    row.weaknesses,
                    row.gap,
                    row.risk,
                  ], index)}
                </tr>
              ))}
              <tr>
                <td style={styles.summary} colSpan={8}>{competitorSummary}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default PostPossessionMarketAnalysisTab;
