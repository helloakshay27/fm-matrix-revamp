import React from "react";
import BaseProductPage, { ProductData } from "./BaseProductPage";
import { Globe, Smartphone, FileText, Monitor } from "lucide-react";

const customerAppData: ProductData = {
  name: "Customer App",
  description:
    "A customer lifecycle management mobile app used by Real Estate Developers to manage customers across the entire cycle from booking to handover, extendable to community management.",
  brief:
    "White-labeled customer app with CRM vault, demand notes, construction updates, referrals, loyalty, and post-possession modules built for data sovereignty and branded CX.",
  excelLikeSummary: false,
  excelLikeFeatures: false,
  excelLikeMarket: false,
  excelLikePricing: false,
  excelLikeSwot: false,
  excelLikeRoadmap: false,
  excelLikeBusinessPlan: false,
  excelLikeGtm: false,
  excelLikeMetrics: false,
  excelLikePostPossession: false,
  excelFeatureRowStart: 31,
  userStories: [
    {
      title: "1. CRM",
      items: [
        "SSO user registration",
        "Buyer purchase details across units with the developer",
        "Real-time demand notes and construction updates",
        "Smart NCF form acceptance before registration",
        "Registration scheduling",
        "TDS tutorials",
        "Rule-engine gamification for early collections and handover readiness",
      ],
    },
    {
      title: "2. Loyalty",
      items: [
        "Referral sales",
        "Gamified rewards for referral, site visit and booking",
        "Offers for existing customers for new purchase",
        "Redemption marketplace",
      ],
    },
    {
      title: "3. Post Possession",
      items: ["Club, visitor and helpdesk", "Referral and marketing for new launches"],
    },
  ],
  industries: "Real Estate Developers",
  usps: [
    "Experience with 20+ large real estate players",
    "Integrated platform across the journey with no fragmented tools",
    "Data security via developer-owned database",
    "Customized look and feel aligned to brand guidelines",
  ],
  includes: ["White Labeled Mobile App", "CMS"],
  upSelling: [
    "Loyalty Rule Engine",
    "Redemption Market Place",
    "Appointments (Handover Scheduling)",
    "Hi Society (Community Management)",
  ],
  integrations: [
    "SFDC (CRM)",
    "SAP (ERP)",
    "Internal Upselling Modules",
    "Website",
    "Payment portals",
  ],
  decisionMakers: ["CRM", "Sales", "Loyalty", "IT"],
  keyPoints: [
    "Customization of Look and Feel",
    "Data security",
    "Partner experience",
    "Referral Journey and Payout",
  ],
  roi: ["4 sales per year can make platform effectively free", "Reduce CP cost by 50%", "Reduce support cost by 20%"],
  assets: [
    {
      type: "Link",
      title: "Detailed Feature List",
      url: "https://docs.google.com/spreadsheets/d/1OKiPeGtxJrqmr6Eo6swvSjR0YMdQ3Qc6ASSYBW8Hn2Q/edit?gid=158265630#gid=158265630",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "IA and UX",
      url: "https://www.figma.com/proto/OknmpA5Mbtklh2Idf75kXG/Kalpataru?page-id=0%3A1&node-id=2188-1927&viewport=-863%2C5209%2C0.17&t=oGwsVmrtuhylp4Hi-1&scaling=min-zoom&content-scaling=fixed",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "One Pager",
      url: "https://www.canva.com/design/DAGKb5frjWw/lVjVzJpdosLQE3KRY_FDjg/watch?utm_content=DAGKb5frjWw&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha02a3a6ce3",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Live Product CMS Login Credentials",
      url: "https://ui-kalpataru.lockated.com/login",
      id: "demo@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Live Product App Login Credentials",
      url: "App Store / Play Store",
      id: "9987676203",
      pass: "999999 (OTP)",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Kshitij Rasal",
  ownerImage: "/assets/product_owner/kshitij_rasal.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Customer App" },
        { field: "Description", detail: "White-labeled customer lifecycle app for real estate developers." },
        { field: "Target Market", detail: "Tier 1 and Tier 2 real estate developers; luxury and large-scale portfolios." },
        { field: "Key Outcome", detail: "Reduced customer follow-ups with self-serve status, documents, and updates." },
      ],
      problemSolves: [
        { painPoint: "Customer anxiety and lack of transparency", solution: "Live updates, demand notes, and document vault." },
        { painPoint: "Low referral conversion", solution: "In-app referral with gamified loyalty and rewards." },
      ],
      whoItIsFor: [
        {
          role: "CX / CRM Head",
          useCase: "Reduce inbound queries and improve transparency",
          frustration: "Manual follow-ups across teams",
          gain: "Self-serve customer journey and audit trail",
        },
        {
          role: "Buyer",
          useCase: "Track payments, documents, milestones",
          frustration: "Scattered communication and missing proofs",
          gain: "Single app for the entire ownership journey",
        },
      ],
      today: [
        { dimension: "Adoption", state: "Deployed with multiple developers as white-labeled apps." },
        { dimension: "USP", state: "Developer-owned data plus brand-aligned look and feel." },
      ],
    },
    detailedFeatures: [
      {
        module: "CRM Vault",
        feature: "Document Repository",
        subFeatures: "E-receipts, agreements, demand notes",
        works: "Automated sync from ERP and CRM into a buyer vault",
        userType: "Buyer",
        usp: true,
      },
      {
        module: "CRM Vault",
        feature: "Unit / Purchase Details",
        subFeatures: "Inventory, allotment, payment plan, milestones",
        works: "Displays purchase information across units owned with the developer",
        userType: "Buyer",
        usp: true,
      },
      {
        module: "CRM Vault",
        feature: "Demand Notes & Receipts",
        subFeatures: "Auto-generated demand notes, paid receipts, ledger view",
        works: "Pulls financial artifacts from ERP and makes them searchable for buyers",
        userType: "Buyer",
        usp: true,
      },
      {
        module: "Collections",
        feature: "Payment Reminders & Nudges",
        subFeatures: "Push notifications, due-date nudges, collection milestones",
        works: "Configurable reminder rules to reduce late payments and inbound calls",
        userType: "Buyer",
        usp: false,
      },
      {
        module: "Construction Updates",
        feature: "Milestone Timeline",
        subFeatures: "Stage-wise progress, expected vs actual dates",
        works: "Shows progress timeline and release notes for each stage",
        userType: "Buyer",
        usp: false,
      },
      {
        module: "Construction Updates",
        feature: "Media Updates",
        subFeatures: "Site photos, videos, newsletters",
        works: "CMS-driven updates to reassure and reduce anxiety during build phase",
        userType: "Buyer",
        usp: false,
      },
      {
        module: "CRM",
        feature: "NCF / Forms Acceptance",
        subFeatures: "Smart forms, e-sign acceptance, audit trail",
        works: "Captures acceptance before registration with timestamped proof",
        userType: "Buyer",
        usp: true,
      },
      {
        module: "Registration",
        feature: "Registration Scheduling",
        subFeatures: "Slot booking, document checklist, reminders",
        works: "Enables buyer to schedule and prepare for registration from app",
        userType: "Buyer",
        usp: false,
      },
      {
        module: "Support",
        feature: "Helpdesk / Ticketing",
        subFeatures: "Create tickets, attachments, SLA updates",
        works: "Self-serve issue creation with status tracking and deflection",
        userType: "Buyer",
        usp: false,
      },
      {
        module: "Support",
        feature: "Knowledge Base",
        subFeatures: "FAQs, guides, policies, tutorials",
        works: "Reduces repetitive queries via searchable content",
        userType: "Buyer",
        usp: false,
      },
      {
        module: "Engagement",
        feature: "Broadcasts & Announcements",
        subFeatures: "Targeted messaging, segment broadcasts",
        works: "One-to-many comms to reduce WhatsApp fragmentation",
        userType: "Developer / CX",
        usp: false,
      },
      {
        module: "Engagement",
        feature: "Appointments",
        subFeatures: "Handover scheduling, site visit scheduling",
        works: "Book and manage appointment workflows with reminders",
        userType: "Buyer / CX",
        usp: true,
      },
      {
        module: "Loyalty",
        feature: "Referral Engine",
        subFeatures: "Points, tiers, rewards marketplace",
        works: "Share referrals, track status, and redeem rewards in-app",
        userType: "Buyer / Member",
        usp: true,
      },
      {
        module: "Loyalty",
        feature: "Campaigns & Offers",
        subFeatures: "Personalized offers, limited-time deals",
        works: "Retention loops that re-engage customers for upsell and referrals",
        userType: "Buyer / Member",
        usp: false,
      },
      {
        module: "Loyalty",
        feature: "Rewards Marketplace",
        subFeatures: "Catalog, redemption rules, fulfillment tracking",
        works: "Marketplace to redeem points with rule-engine eligibility",
        userType: "Buyer / Member",
        usp: true,
      },
      {
        module: "Post Possession",
        feature: "Visitor Management",
        subFeatures: "Invite guests, gate approvals, logs",
        works: "Post-handover daily utility to drive adoption and retention",
        userType: "Resident",
        usp: false,
      },
      {
        module: "Post Possession",
        feature: "Society / Community Modules",
        subFeatures: "Events, clubs, polls, groups",
        works: "Community engagement layer after possession to reduce churn",
        userType: "Resident / Community Ops",
        usp: true,
      },
      {
        module: "Post Possession",
        feature: "Services",
        subFeatures: "Housekeeping, maintenance requests, vendor coordination",
        works: "Service workflows integrated into the same branded app",
        userType: "Resident / Community Ops",
        usp: false,
      },
    ],
    detailedMarketAnalysis: {
      marketMatrixSubtitle:
        "How buyer behavior changes by segment: readiness, incumbent stack, budget tolerance, and highest-conversion entry wedge.",
      marketMatrixRows: [
        {
          segment: "Residential Real Estate Developer (Tier 1)",
          whoToday: "Large portfolios across metro cities; brand-sensitive and referral driven.",
          subsector: "Luxury / Premium Housing",
          budget: "INR 20L-60L annual platform budget per business unit.",
          purchasePattern: "Head office led; pilot at 1-2 projects, then portfolio rollout.",
          incumbents: "CRM + ERP + manual Excel sheets + scattered WhatsApp workflows.",
          readiness: "High when leadership is focused on post-sales NPS and referral growth.",
          trigger: "Escalating handover complaints and low referral conversion quality.",
          payoff: "Clear demand note visibility, support deflection, better retention and referral velocity.",
          risk: "Internal IT dependency and integration delays with ERP systems.",
          entryWedge: "Launch with CRM vault + payment visibility + support case management.",
          opportunity: "High-value multi-project expansion once one flagship project is stabilized.",
        },
        {
          segment: "Mid-Market Developer (Tier 2)",
          whoToday: "Growing developers in regional cities with lean customer experience teams.",
          subsector: "Mid-income Residential",
          budget: "INR 8L-20L annual with modular adoption preferences.",
          purchasePattern: "Founder / Director decision; shorter decision cycle and cost-focused.",
          incumbents: "Call center plus spreadsheets and broker-led communication chains.",
          readiness: "Medium-high if deployment is fast and measurable in under 90 days.",
          trigger: "Rising support volume post-booking and delayed customer communication.",
          payoff: "Reduced support burden with self-serve updates and structured communication.",
          risk: "Price sensitivity and hesitation on feature-heavy enterprise bundles.",
          entryWedge: "Start with white-labeled app + notification workflows and phased modules.",
          opportunity: "Strong upsell path into loyalty, referral engine, and community modules.",
        },
        {
          segment: "Enterprise Group with Mixed Portfolio",
          whoToday: "Multiple project categories with separate sales and post-sales teams.",
          subsector: "Residential + Township + Mixed Use",
          budget: "INR 50L+ where governance and reporting consistency are mandatory.",
          purchasePattern: "Cross-functional committee (CRM, Sales, IT, Finance) with compliance checks.",
          incumbents: "Fragmented stack across SFDC, SAP, legacy portals, and internal apps.",
          readiness: "High if data ownership and brand control are guaranteed.",
          trigger: "Need for a unified ownership journey with auditable data trails.",
          payoff: "Single customer journey layer with integration to existing enterprise systems.",
          risk: "Long procurement cycle and multi-team alignment requirements.",
          entryWedge: "Pilot one BU with tight integration and quantified support-cost reduction.",
          opportunity: "Large contract value and high stickiness after enterprise rollout.",
        },
        {
          segment: "Developer with Strong Channel Partner Network",
          whoToday: "Sales growth dependent on channel partners and repeat customer trust.",
          subsector: "High-volume Residential Sales",
          budget: "INR 15L-35L tied directly to conversion and retention outcomes.",
          purchasePattern: "Commercial lens first; platform approved when referral economics are clear.",
          incumbents: "Broker CRM tooling + manual payout and referral tracking processes.",
          readiness: "Medium-high where referral-led sales is a key growth engine.",
          trigger: "Need transparent referral journey, reward automation, and payout trust.",
          payoff: "Higher referral conversion and better retention with loyalty-driven engagement loops.",
          risk: "Complex referral policy mapping and payout exception handling.",
          entryWedge: "Activate loyalty + referral engine with real-time status and reward visibility.",
          opportunity: "Compounding revenue impact through repeat and referral-led acquisition.",
        },
      ],
    },
    detailedPricing: {
      pricingMatrixSubtitle:
        "Compare current post-sales product depth against what the market expects, where Customer App is already strong, and where sharper packaging will improve win rate.",
      pricingFeatureRows: [
        {
          capability: "Developer-branded customer app",
          currentState: "Strong white-labeled app with brand identity, customer communication, and modular journey support.",
          marketNeed: "Developers want a branded ownership layer instead of generic service portals.",
          impact: "Helps us anchor value above support tools and position as branded CX infrastructure.",
          status: "AHEAD",
          recommendation: "Keep leading with white-label control and show visual brand ownership in demos.",
        },
        {
          capability: "Demand notes and payment visibility",
          currentState: "Real-time demand note access and payment-related updates available within the customer app.",
          marketNeed: "Payment clarity is a high-frequency pain point post-booking.",
          impact: "Directly reduces support calls and improves trust across the ownership journey.",
          status: "AHEAD",
          recommendation: "Package this as support-cost reduction plus collections enablement, not just information access.",
        },
        {
          capability: "Construction updates",
          currentState: "Project progress and milestone communication supported in-app.",
          marketNeed: "Buyers expect regular updates and visual reassurance post-booking.",
          impact: "Supports transparency narrative and strengthens retention before possession.",
          status: "AT PAR",
          recommendation: "Improve storytelling with milestone visuals and push-based engagement examples.",
        },
        {
          capability: "Referral and loyalty engine",
          currentState: "Referral journeys, rewards, and gamified engagement can be layered into the app.",
          marketNeed: "Developers increasingly want repeat and referral revenue from existing buyers.",
          impact: "Major commercial differentiator because it ties CX to measurable topline outcomes.",
          status: "AHEAD",
          recommendation: "Lead with revenue upside, not only engagement metrics, when presenting this module.",
        },
        {
          capability: "Document vault / CRM vault",
          currentState: "Buyer-facing access to agreements, receipts, and demand notes is available via CRM vault.",
          marketNeed: "Centralized document access is expected in premium and enterprise projects.",
          impact: "Reduces repetitive support dependency and raises perceived platform maturity.",
          status: "AHEAD",
          recommendation: "Show document retrieval use cases and support deflection impact in demos.",
        },
        {
          capability: "Community and post-possession services",
          currentState: "Expandable into club, visitor, helpdesk, and community modules after possession.",
          marketNeed: "Developers want continuity beyond handover without switching platforms.",
          impact: "Strong stickiness driver but only lands if roadmap and module boundaries are explained well.",
          status: "AT PAR",
          recommendation: "Clarify phased rollout from booking to community, so buyers see one connected journey.",
        },
        {
          capability: "Enterprise data control",
          currentState: "Developer-owned data and integration alignment are part of the pitch.",
          marketNeed: "Large groups want strong control over customer and transaction data.",
          impact: "Important trust and IT decision-maker lever for enterprise groups.",
          status: "STRONG",
          recommendation: "Bring this earlier into enterprise conversations alongside SFDC and SAP integration proofs.",
        },
        {
          capability: "Advanced analytics / manager cockpit",
          currentState: "Basic visibility is implied, but executive-facing measurement is not yet packaged sharply.",
          marketNeed: "Leadership expects measurable CX, retention, and referral business outcomes.",
          impact: "Can weaken positioning if commercial reporting value is not articulated cleanly.",
          status: "GAP",
          recommendation: "Frame a manager cockpit around NPS proxy, support deflection, and referral conversion metrics.",
        },
      ],
      pricingSummaryRows: [
        {
          label: "Where we are ahead",
          detail: "Brand-led white-label experience, CRM vault, payment transparency, loyalty and referral monetization, and enterprise data control.",
          tone: "green",
        },
        {
          label: "Where we are at par",
          detail: "Construction updates and post-possession continuity are strong, but need clearer packaging and proof-led storytelling.",
          tone: "yellow",
        },
        {
          label: "Gaps that will cost us deals",
          detail: "Executive analytics, commercial ROI framing, and a sharper manager-facing control narrative need to be more explicit.",
          tone: "red",
        },
      ],
      pricingCurrentRows: [
        {
          label: "How we charge",
          detail: "Best positioned as an annual platform fee with modular add-ons for loyalty, referral, post-possession services, and enterprise integrations.",
        },
        {
          label: "Best entry plan",
          detail: "Core Customer App with CRM vault, demand notes, payment visibility, and construction updates as the base bundle.",
        },
        {
          label: "Upsell path",
          detail: "Loyalty engine, referral journeys, redemption marketplace, appointments, and community management should be phased add-ons.",
        },
        {
          label: "Commercial logic",
          detail: "Base fee should be justified through support deflection and CX transparency; add-ons should be justified through referral and retention revenue impact.",
        },
        {
          label: "Where to avoid discounting",
          detail: "Do not commoditize white-label control, CRM vault, or loyalty-led revenue modules by bundling them as generic mobile app features.",
        },
      ],
      pricingPositioningRows: [
        {
          question: "Why this product is hard to ignore",
          answer: "It is not just a customer app. It becomes the branded post-sales operating layer for developers across payments, updates, documents, referrals, and community experience.",
          note: "Lead with branded ownership plus measurable support reduction, not just mobile presence.",
        },
        {
          question: "What makes this different from a portal",
          answer: "A normal portal gives static information. Customer App creates an ongoing lifecycle journey with engagement, monetization, and long-tail post-possession continuity.",
          note: "This distinction matters for enterprise CX and commercial buyers.",
        },
        {
          question: "What makes pricing believable",
          answer: "Pricing becomes believable when tied to lower inbound support, higher referral sales, stronger collections visibility, and increased brand stickiness.",
          note: "Always connect price to measurable business outcomes rather than feature count.",
        },
      ],
      pricingImprovementRows: [
        {
          currentProp: "White-labeled mobile app for customers",
          suggestedFix: "Reframe around branded ownership journey infrastructure.",
          improvedFraming: "A developer-owned customer operating layer from booking to community living.",
          whyItWins: "Moves perception from app vendor to strategic CX platform partner.",
        },
        {
          currentProp: "Referral and loyalty features",
          suggestedFix: "Anchor in revenue growth and repeat sales outcomes.",
          improvedFraming: "Convert existing customers into a measurable referral and retention growth channel.",
          whyItWins: "Commercial teams buy growth levers faster than engagement features.",
        },
        {
          currentProp: "Demand notes and construction updates",
          suggestedFix: "Position as support deflection and trust engine.",
          improvedFraming: "Reduce inbound follow-up load while improving buyer confidence with self-serve visibility.",
          whyItWins: "Helps CRM and CX heads justify rollout with operational savings.",
        },
        {
          currentProp: "Post-possession modules available",
          suggestedFix: "Show phased continuity instead of disconnected add-ons.",
          improvedFraming: "Extend one customer journey platform from booking through possession and community engagement.",
          whyItWins: "Improves expansion logic and makes long-term platform value obvious.",
        },
      ],
    },
    detailedSWOT: {
      strengths: [
        {
          headline: "White-labeled, developer-branded ownership layer",
          explanation:
            "The app becomes the developer’s branded post-sales operating layer, not a generic portal. This improves adoption, retention, and trust across the entire journey.",
        },
        {
          headline: "Full lifecycle coverage from booking to community",
          explanation:
            "Covers documents, payments, updates, possession scheduling, and post-possession modules—creating multiple referral trigger moments and reducing tool fragmentation.",
        },
        {
          headline: "Data sovereignty and enterprise integration readiness",
          explanation:
            "Developer-owned data + integrations with SFDC/SAP and internal modules makes it enterprise-friendly and defensible in IT-led evaluations.",
        },
      ],
      weaknesses: [
        {
          headline: "ERP/CRM data quality dependency",
          explanation:
            "Experience depends on accuracy and timeliness of SAP/SFDC data; weak upstream hygiene can hurt buyer trust even if the app UX is strong.",
        },
        {
          headline: "Executive ROI narrative not always packaged",
          explanation:
            "Without a strong manager cockpit (NPS proxy, support deflection, referral conversion), CX and Finance stakeholders may see it as 'just an app'.",
        },
      ],
      opportunities: [
        {
          headline: "Referral economics as a primary growth lever",
          explanation:
            "Developers already see 30–40% bookings from repeat/referral in many segments. Productizing and measuring this can compound revenue at very low CAC.",
        },
        {
          headline: "Home loan commission as net-new P&L line",
          explanation:
            "Structured in-app home loan journeys can unlock recurring commission revenue for developers—an upsell wedge that resonates with CFO/MD stakeholders.",
        },
      ],
      threats: [
        {
          headline: "Competitors bundling loyalty into broader CRM suites",
          explanation:
            "Large CRM/ERP ecosystems can add lightweight post-sales modules and bundle pricing, creating procurement friction if our differentiation isn't explicit.",
        },
        {
          headline: "Implementation delays perceived as product weakness",
          explanation:
            "Integration-heavy deployments can be slow; delays can be interpreted as lack of product readiness unless phased rollout and quick wins are showcased.",
        },
      ],
    },
    detailedBusinessPlan: {
      planQuestions: [
        {
          question: "1. What is the product and why does it exist?",
          answer:
            "Customer App is a developer-branded ownership journey layer that manages the buyer lifecycle from booking to possession to community living. It exists to reduce customer anxiety, deflect inbound support, and convert customers into a measurable referral growth channel.",
          flag: "Ready",
        },
        {
          question: "2. Who is the ideal customer profile (ICP)?",
          answer:
            "Tier 1/Tier 2 residential developers with 500–3,000 active buyers per portfolio and a strong need for post-sales transparency, document control, and referral-led sales. Decision makers include CX/CRM Head, Sales Head, IT, and CFO (for ROI framing).",
          flag: "Ready",
        },
        {
          question: "3. What core problem does it solve?",
          answer:
            "It solves the 'post-booking trust gap' where buyers chase teams for payments, documents, and updates. It also solves the 'referral leakage' where developers have organic referrals but no structured digital engine to amplify, measure, and reward them.",
          flag: "Ready",
        },
        {
          question: "4. What is the main value proposition in one line?",
          answer:
            "Turn buyers into advocates while reducing support load through a developer-owned, branded customer operating layer.",
          flag: "Ready",
        },
        {
          question: "5. What is the differentiation vs competitors/portals?",
          answer:
            "Unlike static portals, Customer App is lifecycle-driven and monetization-ready: CRM vault + payments + verified updates + referral & loyalty loops + post-possession modules, with enterprise data sovereignty and integrations.",
          flag: "Ready",
        },
        {
          question: "6. What are the main revenue/ROI levers for the developer?",
          answer:
            "- Support deflection (fewer RM calls)\n- Higher referral conversion and lower cost-of-sales\n- Better collections visibility and fewer disputes\n- Home-loan commission as net-new revenue stream (roadmap)\n- Renewal stickiness driven by dashboards & measurable outcomes",
          flag: "Ready",
        },
        {
          question: "7. What are the key risks or blockers?",
          answer:
            "Upstream ERP/CRM data quality, long integration timelines, and unclear executive cockpit packaging can weaken perceived ROI. Mitigation: phased rollout, fast MVP bundle, and measurable dashboards.",
          flag: "Ready",
        },
      ],
    },
    detailedGTM: {
      targetGroups: [
        {
          title: "Section 1 — GTM Motion (Year 1)",
          components: [
            {
              component: "Motion",
              detail:
                "Direct enterprise sales: founder-led → 1 enterprise AE (India) by Month 4 → GCC partner/sales head by Month 8.\nNo PLG in Year 1; enterprise relationships require founder-level credibility.",
            },
            {
              component: "Meeting",
              detail:
                "Target: VP Sales + Head of Loyalty + Head of Home Loans in one meeting.\nThree buyers, one pitch, three ROI stories (support deflection, referral economics, home-loan commission).",
            },
            {
              component: "Proof",
              detail:
                "Price to win initial logos; onboard white-glove; measure obsessively; publish results as internal case studies + external references.",
            },
          ],
          summaryBox:
            "Year 1 is about reference clients and measurable outcomes; sell as a revenue + trust platform, not a CX cost center.",
        },
        {
          title: "Section 2 — Target Segments to Prioritise",
          components: [
            {
              component: "Segment 1",
              detail:
                "Mid-to-large Indian residential developers (500–3,000 active buyers): high urgency, referral pain, SFDC integration readiness. ACV ₹20–40L.",
            },
            {
              component: "Segment 2",
              detail:
                "Luxury developers (₹2Cr+ unit value): highest referral ticket value, NRI network leverage. ACV ₹30–60L.",
            },
            {
              component: "Segment 3",
              detail:
                "GCC (opportunistic): pursue after 5 India references; Dubai-first for NRI referral market and compliance needs.",
            },
          ],
          summaryBox:
            "Start India mid-market for volume + case studies; pursue luxury for highest ROI; expand to GCC after proof base is established.",
        },
        {
          title: "Section 3 — Positioning & Messaging",
          components: [
            {
              component: "Stop",
              detail:
                "Stop: “Improve buyer experience.” (cost-center frame)\nStop: “Reduce RM calls by 60%.” (benefit, not promise)\nStop: Competing on CRM integration as primary positioning (table stakes).",
            },
            {
              component: "Start",
              detail:
                "Start: “Make your customers your brand advocates. Reduce cost of sales by 75%. Create a home loan commission revenue stream you’ve never tracked before.”",
            },
          ],
          summaryBox:
            "Revenue-centric framing wins; cost savings are supporting proof. Lead with referral economics + home-loan P&L narrative.",
        },
      ],
    },
    detailedMetrics: {
      clientImpact: [
        { metric: "Referral share rate", baseline: "2–3%", withSnag: "8–15%", claim: "3–6× increase in referral submissions via gamified referral hub + propensity nudges." },
        { metric: "Inbound RM queries (payments/docs/updates)", baseline: "High (manual follow-ups)", withSnag: "↓ 40–70%", claim: "Self-serve vault + payment visibility + verified updates reduces repetitive queries." },
        { metric: "Collections visibility", baseline: "Fragmented (ERP + calls)", withSnag: "Real-time", claim: "Demand notes + statements + receipts in-app improves trust and reduces disputes." },
        { metric: "NPS at possession", baseline: "Variable", withSnag: "↑ 10–20 points", claim: "Transparency during construction increases buyer confidence and advocacy at possession." },
      ],
      businessTargets: [
        { metric: "Support Deflection", definition: "% reduction in common inbound queries", d30Current: "0%", d30Phase1: "30%", m3Current: "0%", m3Phase1: "60%" },
        { metric: "Referral Conversion", definition: "% buyers submitting referrals per month", d30Current: "2%", d30Phase1: "6%", m3Current: "3%", m3Phase1: "10%" },
        { metric: "Monthly Active Buyers", definition: "% buyers active in app monthly", d30Current: "20%", d30Phase1: "45%", m3Current: "25%", m3Phase1: "60%" },
        { metric: "Document Self-Serve", definition: "% document requests resolved in-app", d30Current: "10%", d30Phase1: "40%", m3Current: "15%", m3Phase1: "70%" },
      ],
    },
    detailedRoadmap: {
      structuredRoadmap: [
        {
          timeframe: "Phase 1",
          headline: "Foundation (0-3 months)",
          colorContext: "red",
          items: [
            {
              whatItIs: "Core customer journey layer (booking → possession) with vault + payments + updates",
              whyItMatters: "Establishes trust and reduces inbound follow-ups early in the lifecycle.",
              unlockedSegment: "Tier 1 & Tier 2 residential developers who need quick CX wins.",
              effort: "6–8 weeks",
              owner: "Product + Eng",
            },
            {
              whatItIs: "Document vault + legal acceptance workflow",
              whyItMatters: "Creates auditable trails and reduces disputes; improves perceived maturity.",
              unlockedSegment: "Premium projects with strong compliance / RERA sensitivity.",
              effort: "4–6 weeks",
              owner: "Engineering",
            },
          ],
        },
        {
          timeframe: "Phase 2",
          headline: "Engagement (3-6 months)",
          colorContext: "yellow",
          items: [
            {
              whatItIs: "Construction milestone storytelling with verified media + notifications",
              whyItMatters: "Builds confidence in high-anxiety periods and increases engagement touchpoints.",
              unlockedSegment: "Large portfolios where buyer trust drives NPS and referrals.",
              effort: "6–10 weeks",
              owner: "Product",
            },
            {
              whatItIs: "Referral hub + loyalty tiers (gamification)",
              whyItMatters: "Turns organic referral behavior into a measurable, compounding growth engine.",
              unlockedSegment: "Sales-led orgs seeking lower cost-of-sales and higher repeat bookings.",
              effort: "8–12 weeks",
              owner: "Product + Growth",
            },
          ],
        },
        {
          timeframe: "Phase 3",
          headline: "Monetization (6-12 months)",
          colorContext: "green",
          items: [
            {
              whatItIs: "Home loan commission workflow + partner matching + reconciliation",
              whyItMatters: "Unlocks a net-new revenue line item and a CFO-friendly ROI story.",
              unlockedSegment: "Developers with 500–3,000 active buyers and home loan uptake.",
              effort: "10–14 weeks",
              owner: "AI + Eng",
            },
            {
              whatItIs: "Executive cockpit: analytics + AI weekly digest",
              whyItMatters: "Makes outcomes visible, drives renewals, and strengthens enterprise narrative.",
              unlockedSegment: "Enterprise groups with IT and leadership governance requirements.",
              effort: "6–8 weeks",
              owner: "Engineering",
            },
          ],
        },
      ],
      enhancementRoadmap: [
        {
          featureName: "Home Loan Eligibility & Commission Tracking",
          currentStatus:
            "Home-loan referrals are typically informal; there is no end-to-end tracking of eligibility, application status, or commission payout visibility.",
          enhancedVersion:
            "In-app home loan enquiry funnel + bank partner matching + application status tracking + commission dashboard + monthly reconciliation for the developer team.",
          integrationType: "MCP (Bank/CRM)",
          effort: "Med",
          impact: "High",
          priority: "P1",
          owner: "Product",
        },
        {
          featureName: "Developer Analytics Dashboard",
          currentStatus:
            "Manual reporting with delayed visibility into referral pipeline, loyalty distribution, and conversion outcomes.",
          enhancedVersion:
            "Real-time self-serve analytics across referrals, loyalty, home-loan funnel, NPS trend and payment adherence + AI-generated weekly digest.",
          integrationType: "MCP (BI)",
          effort: "Low",
          impact: "High",
          priority: "P1",
          owner: "Engineering",
        },
        {
          featureName: "Personalized Buyer Journey Dashboard",
          currentStatus:
            "One-size-fits-all updates and notifications; buyers receive generic journeys without lifecycle personalization.",
          enhancedVersion:
            "AI-driven journey personalization that adapts nudges, updates, and CTAs by lifecycle stage, engagement signals, and referral propensity.",
          integrationType: "AI + Rules",
          effort: "High",
          impact: "High",
          priority: "P2",
          owner: "AI Team",
        },
        {
          featureName: "Construction Progress Updates (Verified Media)",
          currentStatus:
            "Updates often happen via PDFs or WhatsApp photos; engagement is low and trust is inconsistent across the construction phase.",
          enhancedVersion:
            "Developer-published milestone updates with verified images/videos + reactions/comments + loyalty triggers + contextual referral CTA moments.",
          integrationType: "Media + CMS",
          effort: "Med",
          impact: "High",
          priority: "P2",
          owner: "Product",
        },
        {
          featureName: "Events & Community Engagement",
          currentStatus:
            "Community touchpoints are fragmented; event engagement is inconsistent and not tied to loyalty outcomes.",
          enhancedVersion:
            "In-app event discovery, RSVP, reminders, and engagement loops tied to loyalty tiers + campaign studio to run activations.",
          integrationType: "Campaigns",
          effort: "Low",
          impact: "Med",
          priority: "P3",
          owner: "Growth",
        },
        {
          featureName: "Gamified Referral Hub",
          currentStatus:
            "Referral flows are often manual, with weak status visibility and slow/opaque rewards.",
          enhancedVersion:
            "Gamified referral hub with shareable cards, tier-based rewards, auto-disbursement, and a transparent referral journey tracker.",
          integrationType: "Rules Engine",
          effort: "Med",
          impact: "High",
          priority: "P1",
          owner: "Product",
        },
      ],
    },
  },
};

const CustomerAppPage: React.FC = () => {
  return <BaseProductPage productData={customerAppData} />;
};

export default CustomerAppPage;
