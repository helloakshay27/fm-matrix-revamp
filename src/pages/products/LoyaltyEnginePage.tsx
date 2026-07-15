import React from "react";
import BaseProductPage, { ProductData } from "./BaseProductPage";
import { FileText, Settings, ExternalLink, Lock, User } from "lucide-react";

/**
 * Loyalty Engine Product Data
 * ID: 13
 */
const loyaltyEngineData: ProductData = {
  name: "Loyalty Management & Cold Wallet",
  description:
    "A configurable system designed to automatically apply loyalty rewards, points, or benefits based on predefined business rules, without requiring code changes.",
  brief:
    "Evaluates user actions like payments, referrals, and bookings using logical operatives to trigger automated rewards and custom business logic.",
  tabOrder: [
    "summary",
    "features",
    "market",
    "pricing",
    "usecases",
    "roadmap",
    "business",
    "gtm",
    "metrics",
    "swot",
    "enhancements",
    "assets",
  ] as (
    | "summary"
    | "features"
    | "usecases"
    | "market"
    | "pricing"
    | "swot"
    | "roadmap"
    | "enhancements"
    | "metrics"
    | "business"
    | "gtm"
    | "assets"
  )[],
  excelLikeSummary: true,
  excelLikeFeatures: true,
  excelLikeMarket: true,
  excelLikePricing: false,
  excelLikeBusinessPlan: true,
  excelLikeGtm: true,
  excelLikeSwot: true,
  excelLikeMetrics: true,
  userStories: [
    {
      title: "Core Rule Capabilities",
      items: [
        "Commission calculation based on performance rules.",
        "Incentive eligibility verification for partners and employees.",
        "Lead routing automation based on predefined logic.",
        "Partner tier upgrades triggered by achievement milestones.",
      ],
    },
    {
      title: "Operational Workflows",
      items: [
        "Access control logic for feature gating.",
        "Campaign targeting based on user behavior and segment rules.",
        "Automated approval workflows for internal processes.",
        "Penalty and risk rules for compliance monitoring.",
      ],
    },
  ],
  industries: "CRM, Referral & Loyalty Programs, Sales & Finance.",
  usps: [
    "Automation of Complex Business Logic (No code required).",
    "High Flexibility and Scalability for evolving rules.",
    "Built-in Compliance & Risk Management.",
    "Enhanced Reporting & Real-time Analytics.",
  ],
  includes: [
    "Configurable Rule Engine Core",
    "Real-time Logic Evaluation",
    "Audit Trail & Version Control",
    "Custom Operatives (Equals, Greater than, etc.)",
  ],
  upSelling: ["Loyalty (Wallet) App, CRM Suite"],
  integrations: ["CRM Systems, Store / POS Systems, Referral Portals"],
  decisionMakers: ["Business Heads, Sales Operations, Finance, Legal"],
  keyPoints: [
    "Consistency in decision-making across the platform.",
    "Transparency and auditability of applied rules.",
    "Ability to adapt rules quickly to market changes.",
    "Stakeholder trust through data-driven logic.",
  ],
  roi: [
    "Reduced dependency on developers for rule changes.",
    "Improved accuracy in payouts and rewards (Zero manual errors).",
    "Faster time-to-market for new campaigns.",
  ],
  assets: [
    {
      type: "Link",
      title: "Engine Documentation",
      url: "#",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Rule Builder Dashboard",
      url: "https://rules.lockated.com",
      id: "admin.rules@lockated.com",
      pass: "Logic#Safe@1",
      icon: <Settings className="w-5 h-5" />,
    },
  ],
  owner: "Duhita",
  ownerImage: "/assets/product_owner/duhita.jpeg",
  extendedContent: {
    productSummaryNew: {
      summarySubtitle:
        "Investor & Partner Brief  |  Readable in under 5 minutes",
      identity: [
        { field: "Product", detail: "Loyalty Rule Engine" },
        {
          field: "Type",
          detail:
            "B2B SaaS — configurable loyalty and rewards management platform",
        },
        {
          field: "Core function",
          detail:
            "Enables businesses to design, automate, and manage end-to-end customer loyalty programmes through a no-code rule engine, multi-tier wallet system, and a full redemption store — without dependency on engineering teams.",
        },
        {
          field: "Deployment model",
          detail:
            "Cloud-hosted SaaS; integrates with existing CRM (Salesforce), accounting systems, and third-party reward partners via API",
        },
      ],
      whoItIsFor: [
        {
          role: "Primary buyer",
          useCase:
            "Chief Marketing Officer, VP Marketing, Head of Customer Experience, VP Sales",
          frustration:
            "Loyalty initiatives remain fragmented across marketing, CRM, and finance tools.",
          gain: "One configurable system to launch and scale reward logic across the business.",
        },
        {
          role: "Primary user",
          useCase:
            "Marketing / CRM teams, loyalty programme managers, finance ops",
          frustration:
            "Teams rely on spreadsheets and manual coordination to run schemes and redemptions.",
          gain: "Centralised rule design, wallet accounting, redemption control, and reporting.",
        },
        {
          role: "Company profile",
          useCase:
            "Mid-to-large enterprises in transaction-heavy or high-value-purchase industries — real estate, retail, banking, hospitality, automotive, healthcare — with 5,000+ customers and a need to increase retention, repeat purchase, or referral volume",
          frustration:
            "High-value journeys need precise reward logic, but current systems are rigid or disconnected.",
          gain: "Flexible loyalty orchestration without replacing the existing CRM or finance stack.",
        },
        {
          role: "Geography",
          useCase:
            "India (primary); Global (secondary — markets with mature loyalty programme adoption)",
          frustration:
            "Cross-market programme rollouts are slowed by bespoke logic and integration effort.",
          gain: "A reusable rule-driven platform with localisation through configuration instead of rebuilds.",
        },
      ],
      problemSolves: [
        {
          painPoint: "Pain 1",
          solution:
            "Loyalty programmes in complex industries (real estate, banking, auto) are managed in spreadsheets or rigid CRM modules — there is no flexible rule engine that can handle multi-condition, time-sensitive, segment-specific reward logic without code.",
        },
        {
          painPoint: "Pain 2",
          solution:
            "Businesses cannot close the loop between earning and redemption. Points sit idle, customers disengage, and the company loses referral and repeat revenue.",
        },
        {
          painPoint: "Pain 3",
          solution:
            "Finance teams have no safe mechanism to manage the liability of outstanding loyalty points — no escrow controls, no audit trail, no real-time mark-to-market reconciliation.",
        },
        {
          painPoint: "Pain 4",
          solution:
            "Marketing campaigns are batch-and-blast. There is no system to trigger personalised rewards based on real-time customer behaviour, lifecycle stage, or transaction event.",
        },
      ],
      today: [
        {
          dimension: "Live deployments",
          state:
            "1 major real estate developer — fully live in production as of 2026",
        },
        {
          dimension: "Pipeline",
          state:
            "2 additional clients in active pipeline (industries not disclosed)",
        },
        {
          dimension: "Integrations built",
          state:
            "Salesforce CRM (bi-directional), third-party reward partner APIs, mobile app SDK",
        },
        {
          dimension: "Stage",
          state:
            "Early commercial — product is proven, reference client exists, now scaling GTM",
        },
      ],
      summaryFeatureModules: [
        {
          label: "Set Up",
          detail:
            "Tier Management (Bronze / Silver / Gold or custom tiers based on spend / points / engagement) · Membership Management (member registration, ID assignment, status lifecycle)",
        },
        {
          label: "Rules Engine",
          detail:
            "User Actions · Transaction Events · Time-Based Events · User Demographics & Segments · Engagement / Behaviour Tracking · Milestones · Tier-Based Rules — 7 sub-modules enabling fully configurable, multi-condition reward logic with no code",
        },
        {
          label: "Wallet",
          detail:
            "Cold Wallet (long-term point storage) · Transaction Ledger (full audit trail of all point activity — earn, redeem, transfer)",
        },
        {
          label: "Redemption Store",
          detail:
            "Personalised Mobile Redemption Page · Vouchers · Lounge Access · Experiences · Travel & Ticketing · Merchandise · Encashment (cash-out of points) — 7 redemption categories covering digital and physical rewards",
        },
        {
          label: "Admin",
          detail:
            "Escrow Wallet (25% float maintained as liability buffer, mark-to-market) · Account Statement (admin view of all customer loyalty activity)",
        },
        {
          label: "Integrations",
          detail:
            "CRM Integration (Salesforce) · Accounting Integration (financial data sync for points cost and liability) — bidirectional sync",
        },
      ],
      summaryUsps: [
        {
          label: "No-code rule builder",
          detail:
            "7-dimensional rules engine (actions, transactions, time, segments, behaviour, milestones, tiers) — marketing teams configure complex logic without engineering dependency",
        },
        {
          label: "Escrow / liability management",
          detail:
            "Built-in 25% float escrow wallet with mark-to-market balance — unique in the market for regulated or high-value-transaction industries",
        },
        {
          label: "Cold wallet",
          detail:
            "Long-term point storage separates liability from active redemption pool — controls redemption velocity and cash flow impact",
        },
        {
          label: "Full redemption catalogue",
          detail:
            "7 redemption types (vouchers, experiences, travel, merchandise, lounge, encashment, personalised mobile page) — not just discounts",
        },
        {
          label: "Transaction-event triggers",
          detail:
            "Points logic fires directly on payment events (amount, timing, instalment stage) — critical for industries with long purchase cycles",
        },
        {
          label: "CRM-native integration",
          detail:
            "Built for Salesforce-first organisations — no rip-and-replace; loyalty layer sits on top of existing stack",
        },
      ],
      tractionMilestones: [
        {
          label: "Live client",
          detail:
            "1 major real estate developer — full platform deployed and transacting in 2026",
        },
        {
          label: "Rules in production",
          detail:
            "Across 6 categories: Possession, Collections, Referrals, Sales & Booking, Marketing Engagement, App Adoption — 30+ distinct business rules configured and live",
        },
        {
          label: "Redemption active",
          detail:
            "Encashment and featured product redemption live; customers actively redeeming points against real transactions",
        },
        {
          label: "Pipeline",
          detail:
            "2 clients in commercial discussion — pipeline value not disclosed",
        },
        {
          label: "Next milestone",
          detail:
            "Signed client #2, expand into one adjacent vertical (hospitality or banking)",
        },
      ],
    },
    detailedFeatures: [
      {
        module: "Set Up",
        feature: "Tier Management",
        subFeatures: "",
        works:
          "Create and configure multi-level membership tiers such as Bronze, Silver, and Gold based on customer spend, points earned, or engagement milestones. Tier thresholds, benefits, and upgrade or downgrade logic are fully configurable within the system.",
        userType: "Marketing / CRM Admin",
        usp: false,
        status: "Live",
        priority: "P1",
        notes:
          "Foundation of the programme; all rules and rewards reference tier level. Supports unlimited tiers.",
      },
      {
        module: "Set Up",
        feature: "Membership Management",
        subFeatures: "",
        works:
          "Manages the full membership lifecycle with member registration, unique ID assignment, status updates, benefits assignment, and access control within the loyalty programme. Supports auto-enrolment on first purchase or referral.",
        userType: "CRM Admin / Ops",
        usp: false,
        status: "Live",
        priority: "P1",
        notes:
          "Auto-assigns membership tier on registration. Syncs with CRM member records bidirectionally.",
      },
      {
        module: "Rules Engine",
        feature: "User Actions - Rules",
        subFeatures: "",
        works:
          "Define rules that trigger rewards, points credits, tier changes, or notifications when a customer performs a specific action such as app download, site visit, registration, or feedback submission. Multi-condition logic supported.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: No-code action-to-reward mapping. Covers app, CRM, and web-triggered events simultaneously.",
      },
      {
        module: "Rules Engine",
        feature: "Transaction Events - Rules",
        subFeatures: "",
        works:
          "Configure rules that fire on specific payment or purchase events, for example reward points per INR 1,000 spent, reward early payment within N days of demand note, or penalise delayed payments. Supports instalment-stage-specific logic.",
        userType: "Marketing / Finance",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Direct integration with payment events, demand note, lock-in payment, full payment, and more. Critical for high-value, long-cycle purchases like real estate or auto.",
      },
      {
        module: "Rules Engine",
        feature: "Time-Based Events - Rules",
        subFeatures: "",
        works:
          "Automate time-sensitive reward triggers such as homeownership anniversaries, festive season bonuses, point expiry warnings, and promotional windows. Rules fire automatically based on date conditions.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Fully automated, no manual campaign execution needed. Handles recurring and one-off date triggers.",
      },
      {
        module: "Rules Engine",
        feature: "User Demographics / Segments - Rules",
        subFeatures: "",
        works:
          "Target distinct customer groups with differentiated reward rules based on demographic attributes such as age, location, gender, income band, or behavioural segments. Enables personalised reward logic without manual list management.",
        userType: "Marketing / CRM",
        usp: true,
        status: "Live",
        priority: "P2",
        notes:
          "USP: Segment-level rule configuration reduces blanket reward spend and improves campaign ROI.",
      },
      {
        module: "Rules Engine",
        feature: "Engagement / Behaviour - Rules",
        subFeatures: "",
        works:
          "Track and respond to customer engagement signals such as app logins, browsing patterns, email open events, chatbot interactions, social media activity, and usage frequency. Trigger rewards or notifications based on behaviour thresholds.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P2",
        notes:
          "USP: Bridges offline and digital behaviour into a unified reward trigger, unlike most loyalty platforms that cover only transactional triggers.",
      },
      {
        module: "Rules Engine",
        feature: "Milestones - Rules",
        subFeatures: "",
        works:
          "Award automatic rewards when customers hit predefined achievement milestones such as number of purchases, total lifetime spend, number of referrals closed, or specific interaction counts. Milestone logic is configurable per programme.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P2",
        notes:
          "USP: Milestone engine drives long-term engagement and gamification, not just transactional loyalty.",
      },
      {
        module: "Rules Engine",
        feature: "Tier-Based - Rules",
        subFeatures: "",
        works:
          "Create differentiated reward rules that apply only to customers in specific tiers. Higher-tier customers can earn more points per transaction, unlock exclusive redemption categories, and receive priority benefits automatically.",
        userType: "Marketing / Product",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Multi-level tier-based differentiation across 7 rule dimensions is a significant technical and UX advantage over single-tier loyalty systems.",
      },
      {
        module: "Wallet",
        feature: "Cold Wallet",
        subFeatures: "",
        works:
          "A secure, separate storage pool for loyalty points that are not immediately redeemable. Points in the cold wallet are held for future use, controlling the pace at which customers can redeem and protecting the company cash flow and redemption liability.",
        userType: "Finance / Admin",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Cold wallet is a unique mechanism for managing redemption velocity, particularly valuable for high-liability programmes in real estate and finance.",
      },
      {
        module: "Wallet",
        feature: "Transaction Ledger",
        subFeatures: "",
        works:
          "A full digital audit trail of every loyalty point movement including points earned, redeemed, transferred, expired, and adjusted. Provides transparency to both customers and business administrators. Exportable for accounting reconciliation.",
        userType: "Finance / Admin / Customer",
        usp: false,
        status: "Live",
        priority: "P1",
        notes:
          "Critical for compliance and financial reconciliation. Feeds into accounting integration. Customer-facing view available.",
      },
      {
        module: "Redemption Store",
        feature: "Personalised Mobile Redemption Page",
        subFeatures: "",
        works:
          "A dynamically personalised redemption interface served to each customer via mobile app. Content, offers, and available rewards are tailored based on the customer's tier, point balance, purchase history, and preferences.",
        userType: "Customer / Marketing",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Personalised redemption instead of a catalogue-for-all approach drives significantly higher redemption rates and customer satisfaction.",
      },
      {
        module: "Redemption Store",
        feature: "Vouchers",
        subFeatures: "",
        works:
          "Issue and manage digital vouchers redeemable for discounts, complimentary services, or partner offers. Vouchers are generated by the rule engine based on customer actions or tier status, and can be redeemed digitally.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P1",
        notes:
          "Supports branded and partner vouchers. Expiry, usage limits, and eligibility rules configurable.",
      },
      {
        module: "Redemption Store",
        feature: "Lounge Access",
        subFeatures: "",
        works:
          "Grant premium experience rewards such as airport lounge access, members-only spaces, or partner VIP areas to qualifying customers based on tier or point balance. Access is triggered automatically by the rule engine.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes:
          "Differentiating reward for high-tier customers. Requires third-party lounge partnership agreements.",
      },
      {
        module: "Redemption Store",
        feature: "Experiences",
        subFeatures: "",
        works:
          "Enable customers to redeem points for unique non-product experiences such as spa treatments, hotel stays, international sightseeing, curated events, and premium experiences. Expands the perceived value of the loyalty programme beyond discounts.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes:
          "Particularly effective for premium and luxury brand segments. Requires curation and partner relationships.",
      },
      {
        module: "Redemption Store",
        feature: "Travel & Ticketing",
        subFeatures: "",
        works:
          "Allow customers to redeem points for travel-related rewards including flight tickets, hotel bookings, train or bus tickets, event and concert tickets, and travel packages. Integrates with travel booking partners.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes:
          "High aspirational value for customers. Drives higher programme engagement. Requires travel API integration.",
      },
      {
        module: "Redemption Store",
        feature: "Merchandise",
        subFeatures: "",
        works:
          "Physical product redemption including consumer electronics, branded merchandise, watches, gifting articles, and lifestyle products. Products are managed in the redemption store catalogue and fulfilled via logistics partners.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes:
          "Catalogue management and logistics fulfilment need operational setup. High perceived reward value.",
      },
      {
        module: "Redemption Store",
        feature: "Encashment",
        subFeatures: "",
        works:
          "Convert accumulated loyalty points directly into cash credited to the customer's bank account or as a monetary offset on outstanding dues. Provides maximum flexibility for customers who prefer cash over product rewards.",
        userType: "Customer / Finance",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Cash encashment is the highest-value and most flexible redemption mechanism, particularly powerful in real estate where customers have large outstanding payments.",
      },
      {
        module: "Admin",
        feature: "Escrow Wallet",
        subFeatures: "",
        works:
          "A holding account that maintains a mandatory 25% float of total outstanding loyalty points as a financial buffer. The master account must maintain a mark-to-market balance in the float to cover uncompleted or pending redemption transactions, ensuring financial safety and compliance.",
        userType: "Finance / CFO / Admin",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Built-in financial controls for loyalty liability management. Unique feature with strong appeal to CFOs and finance teams in regulated industries. No comparable open-market loyalty platform offers this.",
      },
      {
        module: "Admin",
        feature: "Account Statement",
        subFeatures: "",
        works:
          "Administrators can view, filter, export, and reconcile comprehensive account statements for any customer, showing points earned, redeemed, adjusted, and current balance across any time period. Supports audit, dispute resolution, and customer service operations.",
        userType: "Admin / Finance / Customer Service",
        usp: false,
        status: "Live",
        priority: "P1",
        notes:
          "Essential for operations and compliance. Supports both customer-level and programme-level reporting.",
      },
      {
        module: "Integrations",
        feature: "CRM Integration (Salesforce)",
        subFeatures: "",
        works:
          "Bidirectional sync between the loyalty platform and Salesforce CRM. Customer profile updates, transaction events, demand notes, payment records, referral data, and membership status flow automatically between systems, eliminating manual data entry and ensuring real-time rule execution and customer experience.",
        userType: "CRM / IT / Marketing Ops",
        usp: true,
        status: "Live",
        priority: "P1",
        notes:
          "USP: Deep Salesforce integration, not surface-level. Supports 12+ API endpoints covering members, demand notes, payments, referrals, home loan, testimonial surveys, and more.",
      },
      {
        module: "Integrations",
        feature: "Accounting Integration",
        subFeatures: "",
        works:
          "Connects the loyalty platform to accounting software such as Tally, SAP, or equivalent. Automatically transfers financial data including cost of rewards issued, points liability, redemption transactions, and escrow balance into the company's general ledger for accurate P&L and balance sheet management.",
        userType: "Finance / Accounts",
        usp: false,
        status: "Roadmap",
        priority: "P2",
        notes:
          "Critical for CFO buy-in. Accurate cost accounting of loyalty liability is a common blocker in enterprise sales. API structure is in place; accounting connector to be completed.",
      },
    ],
    featureBenchmark: [
      {
        featureArea: "Rule Engine — Trigger Types",
        marketStandard:
          "3–5 trigger types (purchase, birthday, signup). Most platforms: flat earn-and-burn. Antavo: 50+ triggers. Capillary: 20+.",
        ourProduct:
          "7 rule dimensions: User Actions, Transaction Events, Time-Based, Segments, Engagement/Behaviour, Milestones, Tier-Based. Multi-condition AND/OR logic.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "AHEAD of India competitors (Capillary, Vinculum). At par with global leaders (Antavo). 7-dimension multi-condition engine is our #1 technical differentiator for high-value verticals.",
      },
      {
        featureArea: "No-Code Rule Configuration",
        marketStandard:
          "Most platforms require CRM admin or IT involvement. Antavo and Salesforce have visual builders but still require technical training.",
        ourProduct:
          "Business-user configurable rule engine — marketing team can build and deploy rules without raising IT tickets.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "AHEAD in Indian mid-market. Speed-to-deploy advantage: rule changes in hours vs weeks. Key selling point against Salesforce Loyalty Management.",
      },
      {
        featureArea: "Wallet & Point Storage",
        marketStandard:
          "Standard: single active wallet. Advanced: tiered point types (bonus, base, expiring). Most platforms: no cold wallet mechanism.",
        ourProduct:
          "Cold Wallet (long-term storage) + active wallet. Redemption velocity control built in.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "AHEAD — Cold wallet is a unique feature with no direct equivalent in competing platforms. Critical for high-liability programmes.",
      },
      {
        featureArea: "Escrow / Liability Management",
        marketStandard:
          "Not available in any standard loyalty SaaS. Enterprise players (Comarch) have finance modules but not loyalty-specific escrow.",
        ourProduct:
          "Built-in 25% float escrow wallet with mandatory mark-to-market balance. Full financial controls for CFO confidence.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "SIGNIFICANTLY AHEAD — No comparable feature found in market. This is our strongest CFO-level differentiator, especially for BFSI and real estate.",
      },
      {
        featureArea: "Redemption Catalogue Breadth",
        marketStandard:
          "Standard: vouchers + basic merchandise. Advanced (Antavo, Comarch): travel, experiences, partner rewards. Most India platforms: limited to vouchers.",
        ourProduct:
          "7 redemption types: Vouchers, Lounge, Experiences, Travel & Ticketing, Merchandise, Personalised Mobile Page, Encashment.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "AHEAD of India market. At par with global enterprise platforms. Encashment (cash-out) is a differentiator not commonly offered as a first-class feature.",
      },
      {
        featureArea: "Personalised Mobile Redemption",
        marketStandard:
          "Most platforms: generic catalogue for all users. Antavo and Capillary have basic personalisation. True real-time personalisation is rare.",
        ourProduct:
          "Personalised mobile redemption page tailored to each customer's tier, point balance, history, and preferences — served in real time.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "AHEAD in India market. Drives higher redemption rates. Key UX differentiator in client demos.",
      },
      {
        featureArea: "CRM Integration Depth",
        marketStandard:
          "Most: webhook or basic API. Salesforce Loyalty: native (but requires full Salesforce stack). Capillary: strong retail POS integration.",
        ourProduct:
          "12+ bidirectional Salesforce API endpoints covering members, payments, demand notes, referrals, home loans, surveys, testimonials. Production-proven.",
        status: "Live",
        whereWeStand: "AHEAD",
        dealImpact:
          "AHEAD for Salesforce-first organisations. Deep integration is a moat — replicating this takes 6–12 months for a competitor.",
      },
      {
        featureArea: "Tier Management",
        marketStandard:
          "Standard: 3–5 tiers with fixed rules. Advanced: dynamic tier upgrades/downgrades based on rolling spend. Most India platforms: basic tier logic.",
        ourProduct:
          "Configurable tiers with custom names, thresholds, benefits, and rule associations. Supports unlimited tiers.",
        status: "Live",
        whereWeStand: "AT PAR",
        dealImpact:
          "AT PAR with Antavo and Capillary. No gap here. Further differentiation possible through AI-driven dynamic tier thresholds (roadmap).",
      },
      {
        featureArea: "Membership Management",
        marketStandard:
          "Standard: registration + ID. Advanced: lifecycle management, auto-enrolment, lapsed member re-engagement.",
        ourProduct:
          "Member registration, unique ID, status lifecycle, auto-tier assignment on registration. CRM sync.",
        status: "Live",
        whereWeStand: "AT PAR",
        dealImpact:
          "AT PAR with market. No significant gap. Lapsed member automated re-engagement rules can be built using existing behaviour triggers — document this as a use case.",
      },
      {
        featureArea: "Analytics & Reporting",
        marketStandard:
          "Standard: basic dashboard — points issued, redeemed, balance. Advanced (Antavo, Capillary): cohort analysis, campaign ROI, predictive churn.",
        ourProduct:
          "Admin account statements and transaction ledger. No advanced analytics dashboard currently.",
        status: "Roadmap",
        whereWeStand: "GAP",
        dealImpact:
          "GAP — Will cost deals against Antavo and Capillary when CMO-level buyers ask for programme ROI reporting. Must address in 3–6 months.",
      },
      {
        featureArea: "AI / ML Personalisation",
        marketStandard:
          "Antavo AI Loyalty Cloud: auto-optimises reward offers using ML. Capillary Insights+: predictive next-best-action. Yotpo: smart segmentation.",
        ourProduct: "No AI/ML layer currently. Rule logic is human-configured.",
        status: "Roadmap",
        whereWeStand: "GAP",
        dealImpact:
          "GAP — Growing expectation from enterprise buyers. Not a deal-killer today for mid-market, but will be at 12–18 months. Prioritise AI reward optimisation on roadmap.",
      },
      {
        featureArea: "Accounting / ERP Integration",
        marketStandard:
          "Standard: manual export. Advanced: direct GL posting via SAP/Tally/QuickBooks. Most loyalty SaaS: no accounting integration.",
        ourProduct:
          "API structure in place. Direct accounting connector not yet shipped.",
        status: "Roadmap",
        whereWeStand: "GAP",
        dealImpact:
          "GAP — Blocks CFO sign-off in BFSI and large enterprise deals. Finance team needs automated liability posting. Must close this gap to move up-market.",
      },
      {
        featureArea: "White-Label / Multi-Brand",
        marketStandard:
          "Standard SaaS: single-brand programme. Enterprise: multi-brand coalition loyalty (Antavo, Comarch).",
        ourProduct:
          "Single-brand programme per deployment. Multi-brand coalition not yet supported.",
        status: "Roadmap",
        whereWeStand: "GAP",
        dealImpact:
          "GAP — Relevant for retail groups, FMCG conglomerates, and hospitality chains with multiple sub-brands. Not urgent for current ICP but needed for expansion.",
      },
      {
        featureArea: "Gamification (Streaks, Challenges, Badges)",
        marketStandard:
          "Antavo: full gamification suite. Loyalty programmes with app-native gamification see 30–40% higher engagement.",
        ourProduct:
          "Milestones and tier progression are partially gamified but no explicit streaks, badges, or challenges.",
        status: "Roadmap",
        whereWeStand: "GAP",
        dealImpact:
          "GAP — Important for EdTech, healthcare, and consumer engagement use cases. Adds stickiness to the programme beyond transactional loyalty.",
      },
    ],
    valuePropositions: [
      {
        num: "1",
        current: "No-code rule engine — configure loyalty rules without IT",
        communicates: "Speed and autonomy for marketing teams",
        weakness:
          "Does not quantify the time saved or the cost of IT dependency",
        sharpened:
          '"Launch a loyalty campaign in 2 hours, not 2 weeks — without a single IT ticket." Quantify: average IT ticket for a rule change = 3–5 days delay × 4 campaigns/month = 12–20 days lost marketing execution time per month.',
        proofPoint:
          "Time-to-deploy comparison from live client: days vs competitor weeks",
      },
      {
        num: "2",
        current:
          "7-dimensional rule engine covering actions, transactions, time, segments, behaviour, milestones, and tiers",
        communicates: "Feature richness and configurability",
        weakness:
          "Too feature-focused — buyers do not shop for dimensions, they shop for outcomes",
        sharpened:
          "\"Reward the right customer, at the right moment, for the right behaviour — automatically.\" Back this with a specific scenario: 'When a customer pays their demand note 10 days early AND it is their 3rd payment, award 6,000 points and move them to Gold tier — all triggered automatically.'",
        proofPoint:
          "Demo the multi-condition rule builder live in every sales meeting",
      },
      {
        num: "3",
        current:
          "Built-in escrow wallet with 25% float and mark-to-market liability management",
        communicates: "Financial control and CFO confidence",
        weakness:
          "Not being positioned to the right buyer — this is a CFO and finance message, not a marketing message",
        sharpened:
          '"The only loyalty platform where your CFO can see the liability in real time, control it, and sleep at night." Reframe: this feature removes loyalty programmes as a balance sheet risk — turning a finance objection into a finance advantage.',
        proofPoint:
          "Quantify: for a ₹500Cr real estate developer with ₹10Cr loyalty liability, unmanaged exposure = significant audit risk. Escrow removes it.",
      },
      {
        num: "4",
        current: "Encashment — customers can convert points to cash",
        communicates: "Maximum flexibility for customers",
        weakness:
          "Not connected to the business outcome for the company — why does encashment benefit the developer/business?",
        sharpened:
          '"Turn outstanding dues into loyalty currency — customers redeem points against their next instalment, improving collections without a single call." Reframe encashment as a collections acceleration tool, not just a customer flexibility feature.',
        proofPoint:
          "Show encashment redemption volume from live client as proof of engagement",
      },
      {
        num: "5",
        current: "Personalised mobile redemption page",
        communicates: "Better customer experience vs generic catalogue",
        weakness:
          "'Personalised' is overused and under-proven in SaaS marketing",
        sharpened:
          '"Every customer sees only the rewards they can afford and are most likely to want — increasing redemption rates by surfacing relevant offers, not a generic catalogue of 10,000 items they will ignore." Tie personalisation to redemption rate uplift.',
        proofPoint:
          "Redemption rate comparison: personalised page vs generic catalogue — gather from live client data",
      },
      {
        num: "6",
        current: "Deep Salesforce CRM integration (12+ API endpoints)",
        communicates: "No rip-and-replace — works with existing tech stack",
        weakness:
          "12 endpoints sounds technical — buyers do not know what this means in practice",
        sharpened:
          '"Your CRM already knows when a customer pays, refers someone, or books a site visit — we make every one of those moments a loyalty moment automatically, without any manual data entry." Make the integration story about eliminating manual work, not about API count.',
        proofPoint:
          "Show the data flow diagram: Salesforce → Loyalty Engine → Reward in real time",
      },
      {
        num: "7",
        current: "Cold wallet — separate long-term point storage",
        communicates: "Controls redemption velocity and cash flow impact",
        weakness:
          "Cold wallet is an internal feature name — customers do not understand what it means without explanation",
        sharpened:
          '"Protect your cash flow — keep loyalty liability in a controlled reserve account until you choose to release it for redemption. No surprise redemption spikes." Position as a financial risk management tool, not just a wallet feature.',
        proofPoint:
          "Show escrow + cold wallet together as the 'CFO package' — two features that eliminate the #1 finance objection to loyalty programmes",
      },
    ],
    pricingData: [
      {
        label: "Standard pricing models in this category",
        detail:
          "1. Per-seat SaaS (admin users): common for SMB loyalty tools\n2. Revenue / transaction volume % (e.g., 0.1–0.5% of GMV): common for retail loyalty\n3. Annual platform license + implementation fee: common for enterprise\n4. Hybrid: base license + per-redemption or per-active-member fee\n5. Usage-based: points issued or members enrolled",
        highlight: "info",
      },
      {
        label: "India — Entry / Mid / Enterprise pricing range",
        detail:
          "Entry (SMB, <50K members): ₹3L–₹8L/year (basic earn-and-burn, limited rule types)\nMid-market (50K–500K members, complex rules): ₹12L–₹60L/year\nEnterprise (500K+ members, full integrations): ₹60L–₹3Cr+/year\nKey India benchmarks: Capillary ₹25L–₹2Cr+ | Xoxoday ₹5L–₹50L + margin | Salesforce Loyalty ₹30L–₹3Cr+",
        highlight: "info",
      },
      {
        label: "Global — Entry / Mid / Enterprise pricing range",
        detail:
          "Entry: $5,000–$20,000/year (LoyaltyLion, Yotpo)\nMid-market: $25,000–$150,000/year (Antavo lower tiers, Open Loyalty enterprise)\nEnterprise: $150,000–$1M+/year (Antavo top tier, Comarch, Salesforce Loyalty enterprise)\nNote: Indian pricing is typically 30–50% below global equivalents for comparable feature sets",
        highlight: "info",
      },
      {
        label: "How competitors categorise features across tiers",
        detail:
          "Tier 1 (Entry): Basic earn-and-burn, single earn rule type, voucher redemption only, limited integrations, no wallet management\nTier 2 (Mid): Multiple rule types, segment targeting, 3–5 redemption categories, CRM integration, basic analytics\nTier 3 (Enterprise): Full rule engine, AI personalisation, all redemption types, escrow/financial controls, multi-brand, SLA and dedicated support",
        highlight: "info",
      },
      {
        label: "What to charge NOW (2026) — and why",
        detail:
          "Recommended: ₹15L–₹40L/year for mid-market India clients (50K–300K members, full platform access)\nRationale: Price below Capillary and Salesforce Loyalty to win reference clients. Include: all rule engine modules, wallet (cold + ledger), 5 redemption types, Salesforce CRM integration, admin panel, escrow wallet.\nExclude from base price: accounting integration (charge as add-on ₹3–5L), advanced analytics (charge as add-on ₹3–8L once built).",
        highlight: "now",
      },
      {
        label: "What to charge at 6 MONTHS — and why",
        detail:
          "Recommended: ₹20L–₹60L/year\nRationale: By 6 months, a second reference client validates the product. Add analytics dashboard to core offering. Introduce usage-based top-up pricing for programmes above 500K members or 1M+ points transactions/month. Begin pricing for accounting integration as standard add-on.",
        highlight: "future",
      },
      {
        label: "What to charge at 18 MONTHS — and why",
        detail:
          "Recommended: ₹40L–₹2Cr/year (tiered by member count and rule complexity)\nRationale: With 5+ clients, a vertical-specific pricing model becomes defensible. Introduce AI personalisation tier as premium add-on. Global pricing: $30,000–$200,000/year for international clients in GCC/SEA. Consider a 'Starter' tier at ₹5–8L/year for SMBs to expand top of funnel.",
        highlight: "future",
      },
      {
        label: "One pricing risk to watch",
        detail:
          "RISK: Pricing too low to win reference clients and then struggling to reprice existing clients upward as features improve. Establish contractual annual price escalation clauses (8–12% p.a.) from Day 1. Also watch for Capillary or Salesforce dropping their India entry pricing to block mid-market penetration — be prepared to justify ROI in ₹ terms rather than competing purely on price.",
        highlight: "risk",
      },
    ],
    positioningData: [
      {
        question: "Our single most defensible position right now",
        answer:
          '"The only loyalty rule engine built for high-value, low-frequency purchase industries — with built-in financial controls that your CFO will not reject."\nWhy defensible: No competitor combines (a) a 7-dimension no-code rule engine with (b) escrow liability management with (c) deep Salesforce CRM integration. This triple combination is unique and takes 18–24 months for a competitor to replicate.',
      },
      {
        question: "2–3 customer segments to prioritise in Year 1 — and why",
        answer:
          "1. REAL ESTATE DEVELOPERS (India) — We have a live reference client, 30+ business rules in production, and proven CRM integration. Fastest sales cycle because we can show the exact product they will buy. Target: 5–10 developers with ₹200Cr+ revenue in FY26.\n2. BFSI — NBFC and private bank segment (India) — High loyalty programme urgency, escrow wallet is a native sell for finance-regulated businesses, and CRM integration story is strong. Target: 3–5 NBFCs and digital lenders in FY26.\n3. AUTOMOTIVE DEALER GROUPS (India) — Aftersales loyalty is underserved, transaction-event triggers map directly to service booking and payment events, and no Indian competitor has a vertical-specific automotive loyalty product.",
      },
      {
        question: "The one competitor to displace most aggressively — and how",
        answer:
          "TARGET: Xoxoday / Plum\nWhy: Xoxoday is the current default 'loyalty tool' in India across industries. Clients use it for voucher fulfilment but it is NOT a loyalty programme — it has no rule engine, no wallet, no tiers, no escrow.\nHow: Position Xoxoday as the fulfilment layer and us as the intelligence layer. Message: 'Your team already uses Xoxoday for vouchers. We are what sits behind it — the rules engine that decides who gets what, when, and why.' Offer a joint integration story where we power the rules and Xoxoday fulfils the reward. This turns their installed base into our pipeline.",
      },
      {
        question: "What to STOP doing or saying — it is diluting our position",
        answer:
          "STOP: Positioning as a 'loyalty platform' generically — this puts us in the same category as Capillary and Salesforce Loyalty where we cannot win on brand or scale.\nSTOP: Leading with the redemption catalogue — it is a feature, not a position. Competitors also have redemption catalogues.\nSTOP: Talking about 'earning points' — this is table stakes. Lead with the rule engine complexity, the escrow controls, and the CRM integration depth.\nSTART: Leading with the financial risk angle — 'What is your current loyalty liability, and how are you managing it?' This opens the CFO door.",
      },
      {
        question: "Recommended GTM motion for Year 1",
        answer:
          "MOTION: Direct Sales + Reference-Led Selling\nYear 1 is not a PLG or channel year — the product requires configuration and the deal size justifies direct sales.\nPlaybook:\n1. Use the live reference client as the centrepiece of every sales conversation — offer a site visit / demo with the client's team.\n2. Target CRM-adjacent consultants and Salesforce implementation partners as channel referral sources — they encounter loyalty programme requirements in every client engagement.\n3. Attend 2–3 vertical-specific events per quarter (real estate: CREDAI, NAREDCO; BFSI: FIBAC; auto: SIAM)\n4. Produce one vertical-specific ROI case study per quarter — translate product features into ₹ impact (collections TAT improvement, referral cost reduction, etc.)",
      },
    ],
    detailedUseCases: {
      industryUseCases: [
        {
          rank: "1",
          industry: "Real Estate Development",
          features:
            "AI modules fully applicable.\nTeams: Sales, CRM, Collections, Marketing, Finance.\nFeatures: Transaction Events (demand note/payment triggers), Milestones, Tier Management, Encashment, Escrow Wallet, CRM Integration, Referral rules, Time-Based Events.",
          useCase:
            "Incentivise customers to pay demand notes early, refer new buyers, book registrations through app, give feedback, complete digital documentation, and attend possession on time. Rule engine fires on each payment event with configured point awards. Points are encashed against outstanding dues or redeemed for rewards.",
          profile:
            "India: Mid-to-large developers with 500+ units/year, 200 Cr+ revenue, Tier 1/2 cities, Salesforce or similar CRM in use.\nGlobal: Developer groups in GCC, SEA, and UK with loyalty or referral programmes.",
          companyProfile:
            "India: Mid-to-large developers with 500+ units/year, 200 Cr+ revenue, Tier 1/2 cities, Salesforce or similar CRM in use.\nGlobal: Developer groups in GCC, SEA, and UK with loyalty or referral programmes.",
          currentTool:
            "Manual Excel tracking, basic CRM loyalty modules, or no system. Some use Xoxoday / Plum for vouchers only.",
          urgency:
            "HIGH - Referral and early-payment incentives directly impact collections TAT and sales velocity. No comparable vertical tool exists for real estate.",
          primaryBuyer:
            "Buyer: VP Sales / CMO - measured on referral lead volume, collections TAT, NPS.",
          primaryUser:
            "User: CRM Manager / Collections Team - daily frustration: manually tracking who paid early and following up.",
        },
        {
          rank: "2",
          industry: "Banking, Financial Services & Insurance (BFSI)",
          features:
            "Rules Engine (Transaction events, milestones, segment-based), Wallet, Redemption Store, Admin (escrow), CRM Integration.\nTeams: Retail banking, credit cards, insurance renewals, wealth management.",
          useCase:
            "Banks push loyalty on EMI payment on time, SIP top-ups, insurance renewal, app transactions, and cross-sell product uptake. Segment rules target HNI vs mass retail separately. Milestones reward relationship depth, such as a 5-year banking anniversary. Escrow wallet provides RBI-compliant liability buffer.",
          profile:
            "India: Private/mid-size banks, NBFCs, insurance companies with 50,000+ customers and a digital-first strategy.\nGlobal: Challenger banks, fintech lenders, digital-first insurers in UK, SEA, and Middle East.",
          companyProfile:
            "India: Private/mid-size banks, NBFCs, insurance companies with 50,000+ customers and a digital-first strategy.\nGlobal: Challenger banks, fintech lenders, digital-first insurers in UK, SEA, and Middle East.",
          currentTool:
            "Proprietary in-house loyalty systems, Fiserv, Comviva, or Salesforce Financial Services Cloud with basic loyalty modules.",
          urgency:
            "HIGH - RBI and IRDAI are pushing financial institutions to improve customer retention metrics. Loyalty drives cross-sell and reduces churn on high-margin products.",
          primaryBuyer:
            "Buyer: Chief Customer Officer / Head of Retail Banking - measured on AUM growth, NPS, product cross-sell rate.",
          primaryUser:
            "User: Digital Banking / Loyalty Team - daily frustration: configuring different rules for segment-specific rewards vs referral campaigns.",
        },
        {
          rank: "3",
          industry: "Automotive (New & Pre-Owned Vehicles)",
          features:
            "Transaction Events (purchase milestones), Time-Based Events (service reminders, anniversary), Milestones, Tier Management, Vouchers, Experiences, Merchandise.\nTeams: Sales, Aftersales/Service, CRM.",
          useCase:
            "Award points on vehicle purchase, service visits, accessory purchases, insurance renewal through dealership, test-drive completion, and buyer referrals. Tier-based rules unlock service perks such as free pick-and-drop and priority service bay. Time-based triggers push service reminders and bonus points if service is booked within 7 days.",
          profile:
            "India: OEMs with dealer networks (500+ dealerships) or large multi-brand dealer groups.\nGlobal: OEM loyalty programmes in EU, USA, and GCC, especially EV brands building long-term owner relationships.",
          companyProfile:
            "India: OEMs with dealer networks (500+ dealerships) or large multi-brand dealer groups.\nGlobal: OEM loyalty programmes in EU, USA, and GCC, especially EV brands building long-term owner relationships.",
          currentTool:
            "Salesforce Automotive Cloud, CDK Global, Dealertrack, or basic CRM with manual rewards.",
          urgency:
            "HIGH - Aftersales revenue is the highest-margin revenue stream for dealers. Loyalty directly drives repeat service visits and reduces attrition to independents.",
          primaryBuyer:
            "Buyer: Head of Aftersales / CMO at OEM or dealer group - measured on service revenue per vehicle retained.",
          primaryUser:
            "User: CRM / Service Advisor - daily frustration: no automated way to reward loyal service customers or flag service anniversaries.",
        },
        {
          rank: "4",
          industry: "Hospitality (Hotels, Resorts & Clubs)",
          features:
            "Tier Management, Transaction Events (stay value), Time-Based Events (anniversary stays, seasonal promos), Experiences, Lounge, Travel & Ticketing, Personalised Mobile Redemption.\nTeams: Front Office, Revenue, Marketing.",
          useCase:
            "Classic points-per-night stay, with rule engine adding bonus points for direct booking vs OTA, tier upgrades on stay frequency, time-based double-points weekends, and milestone rewards for the 10th stay. Mobile redemption shows personalised offers at check-in. Lounge and experience redemption drive ancillary spend.",
          profile:
            "India: Hotel chains (50+ properties) or premium standalone resorts and clubs. International tourist resort brands.\nGlobal: Boutique hotel groups in EU/UK and luxury resort chains in SEA and GCC.",
          companyProfile:
            "India: Hotel chains (50+ properties) or premium standalone resorts and clubs. International tourist resort brands.\nGlobal: Boutique hotel groups in EU/UK and luxury resort chains in SEA and GCC.",
          currentTool:
            "Oracle Hospitality OPERA Loyalty, Alijsys LMS, or major chain proprietary systems (Marriott Bonvoy, IHG One).",
          urgency:
            "MEDIUM - Most large chains have loyalty; the opportunity is mid-market hotels that cannot afford enterprise platforms but lose direct booking to OTA.",
          primaryBuyer:
            "Buyer: VP Revenue / Director of Marketing - measured on direct booking share, RevPAR, repeat guest rate.",
          primaryUser:
            "User: CRM / Front Office Manager - daily frustration: loyalty rules are locked in legacy PMS and cannot be adjusted for campaigns.",
        },
        {
          rank: "5",
          industry: "Retail (Organised & E-Commerce) (Retail Chain)",
          features:
            "Transaction Events (purchase amount triggers), User Demographics/Segments, Engagement/Behaviour, Milestones, Vouchers, Merchandise, Personalised Mobile Redemption.\nTeams: Marketing, Category, Digital, CRM.",
          useCase:
            "Capitalise on repeat purchase behaviour, VIP member perks, and personalised mobile offers based on cart value, category browsing, abandoned cart, and D2C brand loyalty. App-based rewards can drive repeat purchases, while personalised vouchers and flash deals inside the redemption store auto-activate for Diwali, EOSS, and category campaigns.",
          profile:
            "India: Organised retail chains (100+ stores), D2C brands with 100K+ customers, omni-channel retailers.\nGlobal: Mid-market retail groups in UK, USA, and SEA building postcode and first-party-data loyalty.",
          companyProfile:
            "India: Organised retail chains (100+ stores), D2C brands with 100K+ customers, omni-channel retailers.\nGlobal: Mid-market retail groups in UK, USA, and SEA building postcode and first-party-data loyalty.",
          currentTool:
            "Capillary Technologies, LoyaltyLion, Yotpo, or Salesforce Loyalty Management.",
          urgency:
            "MEDIUM - Large retailers already have loyalty. The opportunity is mid-market retailers and D2C brands that outgrow basic loyalty plugins but cannot afford full-suite enterprise platforms.",
          primaryBuyer:
            "Buyer: CMO / Head of CRM - measured on repeat purchase rate, CLV, points liability vs redemption rate.",
          primaryUser:
            "User: CRM Manager - daily frustration: cannot configure rules for different product categories without IT help.",
        },
        {
          rank: "6",
          industry: "Healthcare",
          features:
            "Time-Based Events (appointment reminders + bonus), User Demographics/Segments, Milestones, Engagement/Behaviour, Vouchers, Experiences.\nTeams: Patient Experience, Marketing, Operations.",
          useCase:
            "Reward patients for annual health-check attendance, gym and wellness-centre visits, health-app engagement, medication adherence for chronic disease management, and referral of family members. Time-based rules trigger anniversary bonuses on policy or membership renewal date. Segment rules target different age groups with relevant health rewards.",
          profile:
            "India: Hospital chains (Apollo, Max, Fortis scale), wellness-centre chains, health-insurance companies, pharmacies.\nGlobal: Health-insurance loyalty (UK: Vitality model), wellness chains in USA and GCC.",
          companyProfile:
            "India: Hospital chains (Apollo, Max, Fortis scale), wellness-centre chains, health-insurance companies, pharmacies.\nGlobal: Health-insurance loyalty (UK: Vitality model), wellness chains in USA and GCC.",
          currentTool:
            "Basic in-house CRM modules, Salesforce Health Cloud with limited loyalty functionality.",
          urgency:
            "MEDIUM - Preventive healthcare engagement is a regulatory and commercial priority. Loyalty drives adherence and repeat visits, but messaging and compliance make current systems rigid.",
          primaryBuyer:
            "Buyer: Chief Patient Experience Officer / Head of Marketing - measured on appointment attendance rate and preventive-care uptake.",
          primaryUser:
            "User: Patient Engagement / CRM Team - daily frustration: appointment reminders and wellness campaigns are manual, low-personalisation, and hard to tie to reward logic.",
        },
        {
          rank: "7",
          industry: "Education (Higher Education & EdTech)",
          features:
            "Milestones, Engagement/Behaviour, Time-Based Events, User Demographics/Segments, Vouchers, Experiences.\nTeams: Admissions, Student Success, Alumni Relations.",
          useCase:
            "Award points to students for course-completion milestones, assignment submissions, peer mentoring, event attendance, and alumni referrals. EdTech platforms reward course purchases, review submissions, and community engagement. Alumni programmes use milestones and tier-based rules to drive donations or mentor referrals.",
          profile:
            "India: Top-tier private universities, EdTech platforms (100K+ active learners), professional certification bodies.\nGlobal: Online learning platforms (US, UK) and university alumni programmes.",
          companyProfile:
            "India: Top-tier private universities, EdTech platforms (100K+ active learners), professional certification bodies.\nGlobal: Online learning platforms (US, UK) and university alumni programmes.",
          currentTool:
            "Manual alumni CRM, Salesforce Education Cloud, or Gainsight for student success.",
          urgency:
            "MEDIUM - EdTech is fighting high drop-off rates. Loyalty mechanics such as streaks, milestones, and rewards improve course completion and alumni giving.",
          primaryBuyer:
            "Buyer: VP Student Experience / Head of Alumni Relations - measured on course-completion rate, NPS, and alumni-giving rate.",
          primaryUser:
            "User: Student Success / Community Manager - daily frustration: no automated way to reward referrals or learning milestones.",
        },
        {
          rank: "8",
          industry: "Telecommunications",
          features:
            "Transaction Events (recharge/top-up), Time-Based Events (plan anniversary), Milestones, Segments, Vouchers, Merchandise.\nTeams: Retention, CRM, Digital.",
          useCase:
            "Points on recharge value and frequency, upgrades for long-tenure subscribers, time-based double points on recharge anniversaries, and milestone rewards for 2-year and 5-year subscriber anniversaries. Segment-based rules deploy retention offers to churn-prone prepaid/postpaid users and high-ARPU users.",
          profile:
            "India: Regional telcos and MVNOs, Airtel/Vi/BSNL partners.\nGlobal: MVNOs in UK/EU and telecom operators in GCC and SEA building differentiation beyond price.",
          companyProfile:
            "India: Regional telcos and MVNOs, Airtel/Vi/BSNL partners.\nGlobal: MVNOs in UK/EU and telecom operators in GCC and SEA building differentiation beyond price.",
          currentTool:
            "Comviva Mobility / proprietary BSS/OSS loyalty modules.",
          urgency:
            "LOW-MEDIUM - Future opportunity as regional operators and MVNOs look to increase engagement for high-value postpaid users and reduce churn.",
          primaryBuyer:
            "Buyer: Chief Marketing / Retention Head - measured on churn rate, ARPU, NPS.",
          primaryUser:
            "User: Retention Team - daily frustration: cannot trigger personalised retention offers based on tenure, spend, and customer segment.",
        },
        {
          rank: "9",
          industry: "Airlines & Travel (Hospitality)",
          features:
            "Transaction Events (ticket value), Tier Management, Time-Based Events, Milestones, Travel & Ticketing, Lounge, Experiences.\nTeams: Loyalty, Revenue, Marketing.",
          useCase:
            "Classic FFP-style engine with bonus miles on premium-cabin booking, tier-status upgrades, time-based promotion miles, and milestone rewards for the 50th flight. Rule engine allows promo configuration without IT. Mobile redemption supports companion tickets, lounge access, and partner travel offers.",
          profile:
            "India: Regional carriers, charter airlines, travel aggregators with membership programmes.\nGlobal: LCCs in SEA and GCC building differentiated loyalty on limited budgets.",
          companyProfile:
            "India: Regional carriers, charter airlines, travel aggregators with membership programmes.\nGlobal: LCCs in SEA and GCC building differentiated loyalty on limited budgets.",
          currentTool:
            "Comarch Loyalty, Cendyn, or proprietary airline PSS loyalty modules.",
          urgency:
            "LOW - Major airlines have entrenched loyalty platforms. Opportunity is LCCs, charter operators, and travel aggregators that need configurable rewards at smaller scale.",
          primaryBuyer:
            "Buyer: Head of Loyalty / CCO - measured on redemption rate and partner revenue per customer.",
          primaryUser:
            "User: Loyalty Operations Manager - daily frustration: promotional rule changes take weeks without IT.",
        },
        {
          rank: "10",
          industry: "FMCG & Consumer Goods",
          features:
            "Engagement/Behaviour, Milestones, User Demographics/Segments, Vouchers, Merchandise, Personalised Mobile Redemption.\nTeams: Trade Marketing, D2C, CRM.",
          useCase:
            "B2C programmes reward end consumers via app for purchase scans, brand engagement, referrals, and social sharing. B2B programmes reward retailers and distributors for volume milestones, early payment, and compliance with planogram or brand standards. One rule engine can run both customer and channel-partner loyalty from a single platform.",
          profile:
            "India: FMCG companies with D2C ambition or modern-trade loyalty programmes and 100 Cr+ annual marketing spend.\nGlobal: Consumer-goods companies in SEA and Africa building direct consumer relationships.",
          companyProfile:
            "India: FMCG companies with D2C ambition or modern-trade loyalty programmes and 100 Cr+ annual marketing spend.\nGlobal: Consumer-goods companies in SEA and Africa building direct consumer relationships.",
          currentTool:
            "Salesforce Loyalty Management, Capillary, or custom-built channel-partner loyalty tools.",
          urgency:
            "LOW-MEDIUM - D2C loyalty for FMCG is still nascent in India. B2B channel loyalty is under-served and highly rule-complexity-dependent.",
          primaryBuyer:
            "Buyer: Head of Trade Marketing / D2C Head - measured on sell-through rate, retailer NPS, and D2C repeat-purchase rate.",
          primaryUser:
            "User: Trade Marketing Manager - daily frustration: distributor incentive calculations are done in Excel and are prone to dispute.",
        },
      ],
      internalTeamUseCases: [
        {
          team: "Marketing / CRM",
          features:
            "Rules engine (all 7 sub-modules), Tier Management, Personalised Mobile Redemption Page, Time-Based Events, Segments.",
          relevantFeatures:
            "Rules engine (all 7 sub-modules), Tier Management, Personalised Mobile Redemption Page, Time-Based Events, Segments.",
          process:
            "Configures earning rules for every campaign without raising an IT ticket. Builds segment-specific rules targeting different customer groups with personalised multiples. Schedules time-based promotions for festive seasons and anniversaries. Reviews rule performance in the admin dashboard.",
          howTheyUse:
            "Configures earning rules for every campaign without raising an IT ticket. Builds segment-specific rules targeting different customer groups with personalised multiples. Schedules time-based promotions for festive seasons and anniversaries. Reviews rule performance in the admin dashboard.",
          benefit:
            "Eliminates IT dependency for campaign execution. Personalised reward logic replaces batch-and-blast promotions. Faster campaign go-live from weeks to hours.",
          frequency:
            "Daily - campaign managers interact with the rule engine every working day.",
          keyPainWithoutTool:
            "Rules managed in spreadsheets or CRM without automation - manual errors, delayed execution, and no personalisation.",
          collaborationWith: "Sales, Product, IT",
          successMetric:
            "Redemption rate, points issued per campaign, campaign go-live time",
        },
        {
          team: "Sales Team",
          features:
            "User Actions (referral rules), Milestones (booking milestones), Transaction Events (token/booking/investment), CRM Integration.",
          relevantFeatures:
            "User Actions (referral rules), Milestones (booking milestones), Transaction Events (token/booking/investment), CRM Integration.",
          process:
            "Tracks referral programme performance, including which customers referred and whether the referral converted. Monitors milestone-based incentives for repeat buyers. Uses CRM integration to see loyalty-points status of a prospect before a sales meeting.",
          howTheyUse:
            "Tracks referral programme performance, including which customers referred and whether the referral converted. Monitors milestone-based incentives for repeat buyers. Uses CRM integration to see loyalty-points status of a prospect before a sales meeting.",
          benefit:
            "Referral programme drives warm leads with lower paid-acquisition cost. Milestone incentives motivate repeat purchase. Loyalty data provides personalised talking points in sales conversations.",
          frequency:
            "Daily - sales reps check referral status and point balance during customer follow-up.",
          keyPainWithoutTool:
            "No visibility into which customers are eligible for referral bonuses or which milestone rewards are about to unlock.",
          collaborationWith: "CRM, Marketing, Finance",
          successMetric: "Referral conversion rate, repeat purchase rate",
        },
        {
          team: "Collections / Finance",
          features:
            "Transaction Events (demand note / payment date triggers), Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration.",
          relevantFeatures:
            "Transaction Events (demand note / payment date triggers), Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration.",
          process:
            "Configures rules that reward customers for paying demand notes within N days. Monitors escrow wallet balance to ensure the 25% float is maintained. Reviews the transaction ledger for reconciliation with accounting records. Generates account statements for dispute resolution.",
          howTheyUse:
            "Configures rules that reward customers for paying demand notes within N days. Monitors escrow wallet balance to ensure the 25% float is maintained. Reviews the transaction ledger for reconciliation with accounting records. Generates account statements for dispute resolution.",
          benefit:
            "Incentivised early payment reduces collections TAT and reduces the need for manual follow-up calls. Escrow wallet provides real-time liability visibility for cash-flow planning.",
          frequency:
            "Daily (transaction events), Weekly (escrow review), Monthly (account statements)",
          keyPainWithoutTool:
            "No automated incentive mechanism for early payment - collections team manually calls every overdue customer.",
          collaborationWith: "CRM, Finance, IT",
          successMetric:
            "Collections TAT, % customers paying before due date, escrow balance vs total liability",
        },
        {
          team: "Customer Experience / Service",
          features:
            "Transaction Ledger, Account Statement, Personalised Mobile Redemption Page, Vouchers, Cold Wallet.",
          relevantFeatures:
            "Transaction Ledger, Account Statement, Personalised Mobile Redemption Page, Vouchers, Cold Wallet.",
          process:
            "Resolves customer queries about point balances, missing point credits, and redemption eligibility by accessing the transaction ledger and account statement. Guides customers through the redemption process. Escalates technical issues to IT.",
          howTheyUse:
            "Resolves customer queries about point balances, missing point credits, and redemption eligibility by accessing the transaction ledger and account statement. Guides customers through the redemption process. Escalates technical issues to IT.",
          benefit:
            "Self-service account statement and ledger access reduces inbound call volume. Clear audit trail enables fast dispute resolution without escalation.",
          frequency:
            "Daily - frontline service team queries the ledger multiple times per day.",
          keyPainWithoutTool:
            "No single source of truth for point transactions - service team checks multiple systems and often cannot resolve queries.",
          collaborationWith: "Marketing, IT, Finance",
          successMetric:
            "Query resolution time, first-contact resolution rate, customer satisfaction score",
        },
        {
          team: "Integration Team",
          features:
            "CRM Integration (Salesforce API), Accounting Integration, AI API endpoints.",
          relevantFeatures:
            "CRM Integration (Salesforce API), Accounting Integration, AI API endpoints.",
          process:
            "Manages API connections between the loyalty platform and CRM, accounting software, and third-party reward partners. Monitors data-sync health. Implements new integration points as new business rules are added. Supports onboarding of new loyalty programme modules.",
          howTheyUse:
            "Manages API connections between the loyalty platform and CRM, accounting software, and third-party reward partners. Monitors data-sync health. Implements new integration points as new business rules are added. Supports onboarding of new loyalty programme modules.",
          benefit:
            "Pre-built API structure with 12+ endpoints reduces custom development effort significantly. Bi-directional CRM sync is production-proven and reduces integration-maintenance burden.",
          frequency:
            "Weekly (routine monitoring), On-demand (for new rule deployment or integration changes)",
          keyPainWithoutTool:
            "Building loyalty integrations from scratch on each project - weeks of custom development for each new rule trigger.",
          collaborationWith: "CRM, Marketing, Finance, Product",
          successMetric:
            "API uptime, sync error rate, integration deployment time",
        },
        {
          team: "Finance / CFO Office",
          features:
            "Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration, Cold Wallet.",
          relevantFeatures:
            "Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration, Cold Wallet.",
          process:
            "Reviews total loyalty liability against the escrow buffer. Approves point-issuance limits per campaign. Uses accounting integration to ensure loyalty costs are captured in the P&L. Reviews mark-to-market escrow balance monthly for balance-sheet accuracy.",
          howTheyUse:
            "Reviews total loyalty liability against the escrow buffer. Approves point-issuance limits per campaign. Uses accounting integration to ensure loyalty costs are captured in the P&L. Reviews mark-to-market escrow balance monthly for balance-sheet accuracy.",
          benefit:
            "Escrow wallet with mandatory 25% float removes the risk of uncontrolled loyalty liability. Real-time liability visibility enables accurate financial planning and prevents cash-flow surprises.",
          frequency:
            "Monthly (financial review), Quarterly (audit and reconciliation)",
          keyPainWithoutTool:
            "No controlled mechanism for loyalty liability - uncapped point issuance creates unquantified balance-sheet risk.",
          collaborationWith: "Collections, IT, Marketing",
          successMetric:
            "Escrow buffer coverage ratio, total loyalty liability vs budget, P&L accuracy of loyalty cost",
        },
        {
          team: "Product / Technology Team",
          features: "All modules - end-to-end product ownership.",
          relevantFeatures: "All modules - end-to-end product ownership.",
          process:
            "Owns the roadmap for new rule types, redemption categories, and integrations. Configures new modules for each client deployment. Tests rule logic in staging before go-live. Monitors platform performance and resolves bugs. Works with IT and Marketing to translate business requirements into a loyalty-engine configuration.",
          howTheyUse:
            "Owns the roadmap for new rule types, redemption categories, and integrations. Configures new modules for each client deployment. Tests rule logic in staging before go-live. Monitors platform performance and resolves bugs. Works with IT and Marketing to translate business requirements into a loyalty-engine configuration.",
          benefit:
            "No-code rule engine reduces engineering load for each new client configuration. Modular architecture allows rapid addition of new redemption types or rule dimensions.",
          frequency: "Daily",
          keyPainWithoutTool:
            "Each new loyalty requirement requires engineering resources - no self-service configuration layer.",
          collaborationWith: "All teams",
          successMetric:
            "Time-to-deploy per new client, rule-engine uptime, number of rule types live",
        },
        {
          team: "HR / People Team (for employee referral use)",
          features:
            "User Actions (employee referral rules), Milestones, Tier Management, Vouchers, Merchandise.",
          relevantFeatures:
            "User Actions (employee referral rules), Milestones, Tier Management, Vouchers, Merchandise.",
          process:
            "Uses the loyalty engine to run employee incentive programmes. Awards points to employees who refer candidates that are successfully hired. Configures milestone rewards for work anniversaries, performance milestones, and training completions. Manages reward catalogue for employee redemptions.",
          howTheyUse:
            "Uses the loyalty engine to run employee incentive programmes. Awards points to employees who refer candidates that are successfully hired. Configures milestone rewards for work anniversaries, performance milestones, and training completions. Manages reward catalogue for employee redemptions.",
          benefit:
            "Automates employee recognition and referral incentives without manual tracking. Scales recognition across the organisation without proportional HR headcount increase.",
          frequency:
            "Weekly (programme monitoring), Monthly (milestone awards)",
          keyPainWithoutTool:
            "Employee referral incentives are tracked manually in Excel - errors in payout, delays in recognition, low participation.",
          collaborationWith: "Sales, Marketing, IT",
          successMetric:
            "Employee referral hire rate, recognition programme participation rate",
        },
      ],
    },
    detailedRoadmap: {
      structuredRoadmap: [
        {
          timeframe: "Immediate | 0-3 Months",
          headline: "Stop losing deals we should be winning",
          colorContext: "red",
          phaseDescription:
            "Prioritised by deal impact, market gap, and competitive urgency. Features already fully shipped are excluded.",
          items: [
            {
              whatItIs: "Analytics & Reporting Dashboard - Phase 1",
              whyItMatters:
                "CMO and VP Marketing buyers ask for programme ROI visibility in every evaluation. Without a dashboard showing redemption rate, points issued vs redeemed, campaign uplift, and top earners/redeemers, we lose to Capillary and Antavo in the final stage of every enterprise deal. Phase 1 = basic dashboard with 10 KPI tiles.",
              unlockedSegment:
                "All verticals - every enterprise buyer. Immediate impact: real estate, BFSI, automotive. Unlocks CMO-level approval that is currently blocked by this gap.",
              successMetric:
                "Dashboard live in admin panel. Reduces analytics gap objections in >80% of demos. Enables 2+ deals currently stalled.",
              effort: "Medium (4-6 weeks)",
              priority: "P0 - Critical",
              owner: "Product + Engineering",
            },
            {
              whatItIs:
                "Accounting / ERP Integration - Tally & SAP Basic Connector",
              whyItMatters:
                "Finance teams in real estate, BFSI, and enterprise retail require loyalty costs to flow automatically into the GL. Without this, CFO approval takes 2-4 extra months of manual process justification. The API structure is in place - this is a connector build, not a new platform.",
              unlockedSegment:
                "Real estate developers (Tally-heavy), NBFCs and banks (SAP/Oracle). Directly unlocks enterprise deals where CFO is the final approver. Estimated deal value at risk: Rs30-60L per client.",
              successMetric:
                "Accounting connector live for at least one ERP (Tally priority). CFO sign-off time reduced by 6-8 weeks per deal.",
              effort: "Medium (5-7 weeks)",
              priority: "P0 - Critical",
              owner: "Engineering + Finance Ops",
            },
            {
              whatItIs: "Rule Engine - Condition Preview & Test Mode",
              whyItMatters:
                "When a marketing manager configures a complex multi-condition rule, they currently cannot simulate what would happen before going live. A 'test mode' that runs the rule against historical customer data and shows projected point awards prevents costly live misconfigurations.",
              unlockedSegment:
                "All clients - this is an internal UX improvement that accelerates every client's time-to-value and reduces support tickets. Also a strong demo differentiator against platforms that require IT to validate rules.",
              successMetric:
                "Rule test mode live. Reduction in post-go-live rule correction tickets by >50%. Faster client onboarding (target: 2 weeks -> 1 week).",
              effort: "Low-Medium (2-3 weeks)",
              priority: "P1",
              owner: "Product + Engineering",
            },
            {
              whatItIs:
                "Mobile App SDK - Android & iOS Push Notification for Rule Triggers",
              whyItMatters:
                "When a rule fires (e.g., points awarded, tier upgraded, milestone reached), customers currently receive no real-time notification. Without push notification, the emotional impact of earning rewards is lost - customers discover points passively rather than experiencing a reward moment. This is table stakes for any modern loyalty app and directly improves redemption frequency.",
              unlockedSegment:
                "All B2C clients - real estate, retail, hospitality. Particularly high impact for mobile-first programmes where the redemption page is already live on mobile.",
              successMetric:
                "Push notification delivery rate >85%. Redemption rate uplift post-notification implementation (baseline vs 60 days post-launch).",
              effort: "Medium (4-5 weeks)",
              priority: "P1",
              owner: "Mobile + Engineering",
            },
            {
              whatItIs:
                "Client Onboarding Playbook & Self-Serve Configuration Guide",
              whyItMatters:
                "Currently, every new client requires hands-on engineering support to configure the first set of rules. A documented onboarding playbook with vertical-specific rule templates (real estate, BFSI, auto) reduces onboarding time, reduces engineering dependency per client, and allows the team to onboard 3-4 clients simultaneously.",
              unlockedSegment:
                "Pipeline clients #2 and #3. Enables the team to scale from 1 to 5 clients without proportional engineering headcount increase.",
              successMetric:
                "Onboarding time reduced from 8-12 weeks to 4-6 weeks. Engineering hours per client onboarding reduced by 40%.",
              effort: "Low (2-3 weeks)",
              priority: "P1",
              owner: "Product + Customer Success",
            },
          ],
        },
        {
          timeframe: "Short-Term | 3-6 Months",
          headline: "Expand addressable market and move up-market",
          colorContext: "yellow",
          items: [
            {
              whatItIs:
                "Analytics Dashboard - Phase 2: Campaign ROI & Cohort Analysis",
              whyItMatters:
                "Phase 1 gives the basics; Phase 2 adds the metrics that move loyalty from a marketing expense to a measured business investment: campaign ROI (points cost vs incremental revenue), cohort retention curves, segment-level redemption behaviour, and programme P&L.",
              unlockedSegment:
                "BFSI (NPA and retention metrics), automotive (aftersales revenue per customer), retail (CLV and repeat purchase rate). Enables up-market enterprise deals where CMO and CFO both need to sign off.",
              successMetric:
                "At least one client using analytics dashboard for monthly programme review. One published ROI case study with Rs impact numbers.",
              effort: "High (8-10 weeks)",
              priority: "P1",
              owner: "Product + Data Engineering",
            },
            {
              whatItIs: "BFSI Vertical Module - Compliance-Ready Features",
              whyItMatters:
                "Banking and NBFC clients require: (a) RBI-compliant data storage and audit trail, (b) KYC-linked member management, (c) points expiry in compliance with RBI prepaid instrument guidelines, (d) enhanced escrow reporting for regulatory submissions. Building a BFSI-specific module shortens the compliance validation cycle.",
              unlockedSegment:
                "Private banks, NBFCs, digital lenders, insurance companies. India BFSI loyalty market is Rs800Cr+ and growing 18% YoY. Unlocks a vertical we cannot credibly enter today.",
              successMetric:
                "First BFSI pilot signed. Compliance checklist completed and signed off by one bank's legal team.",
              effort: "High (10-12 weeks)",
              priority: "P1",
              owner: "Product + Legal + Engineering",
            },
            {
              whatItIs: "Gamification Module - Streaks, Badges & Challenges",
              whyItMatters:
                "Engagement-based loyalty (streaks for consecutive app logins, badges for milestone achievements, challenges for completing a set of actions in a time window) drives 30-40% higher programme engagement vs transactional-only loyalty. Required to serve EdTech, healthcare, and consumer apps credibly.",
              unlockedSegment:
                "EdTech (course completion streaks), healthcare (appointment adherence challenges), retail (seasonal purchase challenges), automotive (service visit streaks). Opens 3 new verticals.",
              successMetric:
                "Gamification module live. First non-real-estate client using gamification features.",
              effort: "Medium-High (6-8 weeks)",
              priority: "P2",
              owner: "Product + Engineering",
            },
            {
              whatItIs: "Multi-Language & Multi-Currency Support",
              whyItMatters:
                "GCC and SEA expansion requires Arabic language support and AED/SAR/SGD currency handling. India expansion into Tier 2-3 cities benefits from Hindi and regional language support in the customer-facing redemption page. Without this, every international deal requires custom engineering.",
              unlockedSegment:
                "GCC real estate and hospitality (UAE, Saudi, Qatar). SEA retail and banking. India regional tier expansion.",
              successMetric:
                "Arabic and Hindi language support live in redemption page. First GCC client signed.",
              effort: "Medium (5-7 weeks)",
              priority: "P2",
              owner: "Engineering + Product",
            },
            {
              whatItIs: "Partner / Channel Loyalty Module",
              whyItMatters:
                "Many clients (real estate brokers, auto dealers, FMCG distributors) need to run a parallel loyalty programme for their channel partners alongside their consumer programme. A channel partner module with separate rule sets, separate wallets, and separate redemption catalogues doubles the revenue per enterprise client.",
              unlockedSegment:
                "Real estate (broker loyalty alongside homebuyer loyalty), automotive (dealer partner programme), FMCG (distributor incentive programme). Significant increase in ACV per client.",
              successMetric:
                "First client using both consumer and partner loyalty modules simultaneously. Partner module ACV contribution tracked.",
              effort: "High (10-12 weeks)",
              priority: "P2",
              owner: "Product + Engineering",
            },
            {
              whatItIs:
                "Redemption Fulfilment API - Third-Party Catalogue Expansion",
              whyItMatters:
                "Expanding the redemption catalogue through open API that connects to third-party reward catalogues (Amazon, Flipkart, flight booking APIs, hotel booking APIs) without requiring custom integration per partner. This moves the catalogue from curated to scalable - clients can offer 10,000+ redemption options instead of a limited manual catalogue.",
              unlockedSegment:
                "All B2C verticals - retail, hospitality, BFSI, real estate. High-volume programmes need catalogue depth to drive redemption rates above 40%.",
              successMetric:
                "Third-party catalogue API live with at least 3 partners integrated. Redemption SKU count increases from <100 to >1,000.",
              effort: "Medium (6-8 weeks)",
              priority: "P2",
              owner: "Engineering + Partnerships",
            },
          ],
        },
        {
          timeframe: "Medium-Term | 6-18 Months",
          headline: "Build the long-term competitive moat",
          colorContext: "green",
          items: [
            {
              whatItIs: "AI Reward Optimisation Engine",
              whyItMatters:
                "Replace static, human-configured rule logic with a machine learning layer that learns which reward types, point amounts, and trigger timings drive the highest engagement and redemption rates for each customer segment. The AI engine runs alongside the existing rule engine - rules remain human-controlled, AI recommends optimisations.",
              unlockedSegment:
                "Enterprise BFSI, retail, and hospitality clients with large member bases (100K+) where manual rule optimisation is impractical. Unlocks CMO budgets that currently go to personalisation vendors.",
              successMetric:
                "AI-optimised campaigns show >15% higher redemption rate vs manually configured campaigns in A/B tests.",
              effort: "Very High (16-20 weeks)",
              priority: "P1 at 6mo",
              owner: "ML Engineering + Product",
            },
            {
              whatItIs: "Predictive Churn & Re-engagement Engine",
              whyItMatters:
                "Use transaction and engagement data to predict which members are at risk of disengaging (no activity in 60+ days, declining earn rate, milestone stall) and automatically trigger a personalised re-engagement rule before they churn. This closes the gap between having loyalty data and using it to drive proactive engagement.",
              unlockedSegment:
                "BFSI (loan repayment churn), hospitality (lapsed loyalty members), retail (inactive customers with unredeemed points), EdTech (at-risk learners).",
              successMetric:
                "Churn prediction model accuracy >75%. Re-engagement campaign triggered before member goes inactive. Measurable reduction in loyalty programme lapse rate.",
              effort: "Very High (14-18 weeks)",
              priority: "P1 at 9mo",
              owner: "ML Engineering + Data",
            },
            {
              whatItIs: "Coalition / Multi-Brand Loyalty",
              whyItMatters:
                "Enable a single loyalty programme to span multiple brands, properties, or business units under one parent organisation. A real estate group with residential and commercial divisions, a hospitality group with hotels and clubs, or a retail conglomerate with multiple banners can run a unified loyalty experience - with points issuance, redemption, and governance managed centrally.",
              unlockedSegment:
                "Real estate groups with multiple project brands, retail conglomerates, hospitality groups with mixed portfolio (hotels + resorts + clubs), FMCG companies with multiple consumer brands.",
              successMetric:
                "First multi-brand deployment live. Programme spans at least 2 distinct brands under one loyalty wallet.",
              effort: "Very High (16-20 weeks)",
              priority: "P2 at 9mo",
              owner: "Product + Engineering",
            },
            {
              whatItIs: "White-Label & Client Branding Engine",
              whyItMatters:
                "Full white-label capability: every customer-facing element (mobile redemption page, notification templates, loyalty app interface, emails) is configurable to the client's brand identity without engineering involvement. Currently, client branding requires custom work. This is critical for reseller and channel partner model.",
              unlockedSegment:
                "All verticals - every enterprise client wants their loyalty programme to look like their own product, not a third-party SaaS. Critical for reseller and channel partner model.",
              successMetric:
                "New client branding deployment time reduced from 3-4 weeks to 2-3 days. First reseller or white-label partnership signed.",
              effort: "High (10-14 weeks)",
              priority: "P1 at 12mo",
              owner: "Product + Engineering",
            },
            {
              whatItIs:
                "Loyalty Programmes API - Open Platform for Developer Ecosystem",
              whyItMatters:
                "Publish a well-documented public API that allows third-party developers, Salesforce ISV partners, and system integrators to build loyalty integrations and extensions on top of our platform. This transforms the product from a standalone SaaS into a platform - creating a partner ecosystem that expands distribution.",
              unlockedSegment:
                "Salesforce implementation partners, HR tech integrators, ERP consultants, and vertical-specific ISVs. Unlocks a channel-led growth model that multiplies GTM reach without proportional headcount.",
              successMetric:
                "First Salesforce AppExchange listing. Partner-sourced pipeline contributes >20% of new ARR by month 18.",
              effort: "High (12-16 weeks)",
              priority: "P2 at 12mo",
              owner: "Engineering + Partnerships",
            },
            {
              whatItIs:
                "Advanced Escrow & Liability Reporting for Regulated Industries",
              whyItMatters:
                "Extend the escrow wallet into a full regulatory-grade liability management module: automated mark-to-market reporting, regulatory submission templates (RBI for BFSI, SEBI for listed companies), liability ageing analysis, and stress-test scenarios (what if 30% of members redeem simultaneously?). This turns the liability model from a finance/compliance feature into a buying reason, not just a nice-to-have.",
              unlockedSegment:
                "Listed real estate companies (SEBI disclosure requirements), NBFCs and banks (RBI audit requirements), insurance companies (IRDAI compliance). Makes regulatory compliance a buying reason, not just a nice-to-have.",
              successMetric:
                "First regulatory submission completed using platform data. Statutory auditor validates escrow reporting as compliant.",
              effort: "High (10-12 weeks)",
              priority: "P1 at 12mo",
              owner: "Engineering + Legal + Finance",
            },
            {
              whatItIs: "Global Deployment Infrastructure - GCC & SEA",
              whyItMatters:
                "Data residency compliance (UAE PDPL, Singapore PDPA), local payment gateway integrations for redemption encashment, Arabic/Bahasa language support, and a regional support structure for GCC and SEA markets. Without this, international deals require custom onboarding and expose the business to expansion bottlenecks.",
              unlockedSegment:
                "GCC real estate (UAE, Saudi, Qatar), SEA banking and retail (Singapore, Malaysia, Indonesia). International revenue diversification reduces India-only concentration risk.",
              successMetric:
                "First GCC or SEA client signed. Data residency compliance certified for UAE or Singapore.",
              effort: "Very High (18-24 weeks)",
              priority: "P2 at 15mo",
              owner: "Engineering + Legal + Ops",
            },
          ],
        },
      ],
      enhancementRoadmap: [
        // MODULE: SET UP
        {
          rowId: "1",
          module: "Set Up",
          featureName: "Tier Management",
          currentStatus:
            "Administrators manually define tier names, thresholds (e.g., spend ≥ ₹5L = Gold), and associated benefits. Tier upgrades and downgrades are rule-triggered but threshold values are static and set at programme launch.",
          enhancedVersion:
            "AI-powered dynamic tier thresholds that adjust automatically based on cohort behaviour. If 40% of members reach Gold within 3 months, the system flags tier inflation and suggests threshold recalibration. A visual tier health dashboard shows distribution across tiers and projected movement over the next 90 days. Admin can approve AI suggestions in one click.",
          integrationType: "AI (anomaly detection + cohort analysis)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "Product + ML Eng",
        },
        {
          rowId: "2",
          module: "Set Up",
          featureName: "Membership Management",
          currentStatus:
            "Members are registered via CRM sync or manual entry. Unique ID is assigned. Tier is auto-assigned based on registration rules. Member profile updates sync bidirectionally with Salesforce.",
          enhancedVersion:
            "AI-assisted duplicate detection at registration: flags probable duplicates using fuzzy name + phone + email matching before they are added. Progressive profiling: system identifies missing demographic fields and triggers a personalised in-app prompt to complete profile in exchange for bonus points — improving data quality without a form. MCP integration with WhatsApp Business API for instant membership welcome message with QR-code loyalty card.",
          integrationType: "AI (fuzzy matching) + MCP (WhatsApp Business)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "Engineering + Product",
        },
        // MODULE: RULES ENGINE
        {
          rowId: "3",
          module: "Rules Engine",
          featureName: "User Actions — Rules",
          currentStatus:
            "Admins define trigger actions (e.g., app download, site visit, referral submission) and link them to outcomes (points, tier change, notification). Rules are configured manually through the admin UI. Multi-condition AND/OR logic is supported.",
          enhancedVersion:
            "Natural language rule builder: admin types 'Give 500 points to Gold members who refer a friend within 7 days of their purchase anniversary' and AI translates it into a structured rule configuration, which the admin reviews and approves. Eliminates the need to understand the rule engine's configuration UI. MCP integration with Zapier/Make to trigger rules from external tools (Google Forms, Typeform, calendar events).",
          integrationType: "AI (NLP rule parser) + MCP (Zapier / Make)",
          effort: "High",
          impact: "Very High",
          priority: "P0",
          owner: "ML Eng + Product",
        },
        {
          rowId: "4",
          module: "Rules Engine",
          featureName: "Transaction Events — Rules",
          currentStatus:
            "Rules fire on payment events sourced from Salesforce: demand note raised, payment received, payment date vs due date comparison. Points are awarded based on configurable conditions (e.g., paid within 5 days of demand = 6,000 points). Instalment-stage logic is supported.",
          enhancedVersion:
            "Real-time transaction stream processing: instead of batch CRM sync, payments trigger loyalty rules within seconds of the bank confirmation, using a webhook from the payment gateway (Razorpay, PayU, HDFC). Admin gets a live transaction feed showing every rule fire in real time. AI flags unusual patterns (e.g., sudden spike in early payments that may indicate gaming) and pauses suspicious rule fires for review.",
          integrationType:
            "AI (anomaly detection) + MCP (Payment Gateway webhooks — Razorpay/PayU)",
          effort: "High",
          impact: "Very High",
          priority: "P0",
          owner: "Engineering + ML Eng",
        },
        {
          rowId: "5",
          module: "Rules Engine",
          featureName: "Time-Based Events — Rules",
          currentStatus:
            "Rules fire on calendar-based conditions: birthdays, anniversaries, festive dates, programme milestones. Configured manually with fixed dates or relative date offsets. Rules run on a scheduled batch process (daily or hourly).",
          enhancedVersion:
            "Predictive timing optimisation: AI analyses each customer's historical engagement patterns and identifies the optimal time of day and day of week to deliver a time-based reward notification — maximising open and redemption rates. Birthday rules are augmented with a 'birthday week' extension that auto-personalises the reward amount based on the member's tier and recent spend trajectory. MCP integration with Google Calendar API for enterprise clients who want loyalty triggers synced to internal event calendars.",
          integrationType:
            "AI (send-time optimisation) + MCP (Google Calendar API)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "ML Eng + Engineering",
        },
        {
          rowId: "6",
          module: "Rules Engine",
          featureName: "User Demographics / Segments — Rules",
          currentStatus:
            "Admins define segments manually based on demographic attributes (age, location, gender, income band). Rules are applied to fixed segments. Segment membership is updated on a scheduled sync from CRM.",
          enhancedVersion:
            "AI-generated micro-segments: instead of manually defined demographic buckets, the AI clusters members by behavioural similarity (purchase cadence, engagement score, redemption preference, tier trajectory) and surfaces 5–8 automatically generated segments for the admin to review and name. Each AI segment comes with a recommended rule configuration. MCP integration with Meta Ads API to sync high-value loyalty segments as custom audiences for retargeting — closing the loop between loyalty and paid media.",
          integrationType:
            "AI (unsupervised clustering) + MCP (Meta Ads API / Google Ads API)",
          effort: "High",
          impact: "Very High",
          priority: "P1",
          owner: "ML Eng + Product",
        },
        {
          rowId: "7",
          module: "Rules Engine",
          featureName: "Engagement / Behaviour — Rules",
          currentStatus:
            "Tracks customer interactions: app logins, browsing, email opens, chatbot use, amenity visits. Rules fire when behaviour thresholds are met (e.g., 3 app logins in 7 days = 50 bonus points). Behaviour data comes from app SDK and CRM events.",
          enhancedVersion:
            "Behavioural propensity scoring: AI assigns each member a daily engagement score (0–100) based on recency, frequency, and diversity of interactions. Rules can now target 'members whose engagement score dropped >20 points in the last 14 days' — enabling proactive re-engagement before explicit inactivity. MCP integration with Mixpanel or Amplitude for product analytics events to flow directly into the loyalty engine as behavioural triggers, without manual API mapping.",
          integrationType:
            "AI (propensity scoring / RFM modelling) + MCP (Mixpanel / Amplitude)",
          effort: "High",
          impact: "Very High",
          priority: "P1",
          owner: "ML Eng + Engineering",
        },
        {
          rowId: "8",
          module: "Rules Engine",
          featureName: "Milestones — Rules",
          currentStatus:
            "Admins configure milestone thresholds (e.g., 10th purchase, ₹10L cumulative spend, 5th referral closed). Rules award points or tier upgrades when thresholds are crossed. Milestones are fixed at programme setup.",
          enhancedVersion:
            "Dynamic milestone personalisation: AI analyses each member's trajectory and sets a personalised next milestone that is achievable but stretching — similar to how fitness apps set the next step goal just above current performance. Members see their personalised 'next reward unlock' progress bar in the mobile app. Admin sets only the reward catalogue; AI configures the milestone threshold per member. MCP integration with the mobile app via deep link to drive users directly to the action needed to complete their next milestone.",
          integrationType:
            "AI (personalised goal-setting) + MCP (Mobile deep link / push API)",
          effort: "High",
          impact: "Very High",
          priority: "P1",
          owner: "ML Eng + Mobile",
        },
        {
          rowId: "9",
          module: "Rules Engine",
          featureName: "Tier-Based — Rules",
          currentStatus:
            "Rules apply differentiated point multipliers and benefits based on the member's current tier. Tier rules are configured by admins and apply uniformly to all members in a tier. Tier status is recalculated on a scheduled basis.",
          enhancedVersion:
            "Tier benefit personalisation within tiers: AI identifies which specific tier benefit (lounge vs travel vs merchandise) each Gold member is most likely to value, and surfaces that benefit prominently on their redemption page — even within the same tier. 'Soft tier protection': AI detects members at risk of tier downgrade and auto-triggers a personalised save offer (bonus points or a grace period) before the downgrade happens, reducing perceived tier loss and improving retention.",
          integrationType:
            "AI (preference prediction + churn propensity) + MCP (push notification API)",
          effort: "High",
          impact: "High",
          priority: "P2",
          owner: "ML Eng + Product",
        },
        // MODULE: WALLET
        {
          rowId: "10",
          module: "Wallet",
          featureName: "Cold Wallet",
          currentStatus:
            "Points are stored in the cold wallet when they are not yet eligible for redemption (e.g., during a lock-in period or pending verification). Admin manually configures when points move from cold to active wallet. Customers see their cold wallet balance separately.",
          enhancedVersion:
            "Automated cold-to-active wallet release triggers: instead of manual admin configuration, rules define the conditions under which cold wallet points become redeemable (e.g., final payment received, possession completed, 90-day lock-in elapsed). AI monitors cold wallet balance across all members and forecasts the expected redemption liability for the next 30/60/90 days — giving finance teams predictive cash flow visibility. Customers receive a push notification the moment their cold points unlock.",
          integrationType:
            "AI (liability forecasting) + MCP (push notification / finance reporting API)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "Engineering + ML Eng",
        },
        {
          rowId: "11",
          module: "Wallet",
          featureName: "Transaction Ledger",
          currentStatus:
            "A complete audit trail of every point movement: earned, redeemed, transferred, expired, adjusted. Accessible to admins through the account statement view. Exportable as CSV.",
          enhancedVersion:
            "Real-time ledger with natural language query: admin types 'show me all members who earned more than 10,000 points in February but have not redeemed any' and the system returns filtered results instantly. MCP integration with Google Sheets / Excel for one-click ledger export into live-updating spreadsheets without manual CSV handling. AI flags unusual ledger patterns (point farming, rule gaming, suspiciously rapid accumulation) and raises an alert for admin review.",
          integrationType:
            "AI (NL query + anomaly detection) + MCP (Google Sheets API / Excel API)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "Engineering + ML Eng",
        },
        // MODULE: REDEMPTION STORE
        {
          rowId: "12",
          module: "Redemption Store",
          featureName: "Personalised Mobile Redemption Page",
          currentStatus:
            "Each customer's redemption page is tailored based on their tier, point balance, and purchase history. Relevant reward categories are surfaced. The page is served through the mobile app and updates when the customer's profile changes.",
          enhancedVersion:
            "Real-time AI recommendation engine on the redemption page: 'Customers like you redeemed this next' — a collaborative filtering model that surfaces rewards based on similar members' choices, improving discoverability of the catalogue. A/B testing framework for admins: test two versions of the redemption page layout/content for a segment and auto-select the winner after 500 visits. MCP integration with the client's CMS (Contentful, Strapi) so marketing teams can update redemption page banners and featured rewards without touching the loyalty platform.",
          integrationType:
            "AI (collaborative filtering + A/B testing) + MCP (CMS API — Contentful/Strapi)",
          effort: "High",
          impact: "Very High",
          priority: "P1",
          owner: "ML Eng + Product",
        },
        {
          rowId: "13",
          module: "Redemption Store",
          featureName: "Vouchers",
          currentStatus:
            "Digital vouchers are generated by the rule engine and issued to customers based on eligibility. Customers can view and apply vouchers through the mobile app. Voucher codes have configurable expiry and usage limits.",
          enhancedVersion:
            "Dynamic voucher value: instead of fixed-value vouchers, AI adjusts the voucher amount based on the member's likelihood to redeem — offering a slightly higher-value voucher to a member showing lapse signals vs a standard voucher to an active member. This optimises the cost of retention vs engagement. MCP integration with WhatsApp Business API to deliver voucher codes via WhatsApp message with a single-tap redemption link — eliminating the need to open the app.",
          integrationType:
            "AI (dynamic offer optimisation) + MCP (WhatsApp Business API)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "ML Eng + Engineering",
        },
        {
          rowId: "14",
          module: "Redemption Store",
          featureName: "Lounge Access",
          currentStatus:
            "Gold-tier members are automatically granted lounge access entitlement based on tier status. Access is triggered by the rule engine and communicated to the customer via the app. Third-party lounge partnerships are managed manually.",
          enhancedVersion:
            "Digital lounge pass with QR code generated in real time and delivered to the customer's mobile app. MCP integration with lounge booking APIs (DragonPass, Priority Pass, or partner-specific APIs) to check lounge availability and auto-book the customer's next visit based on their travel itinerary if connected. Push notification reminder 2 hours before a scheduled lounge visit.",
          integrationType:
            "MCP (DragonPass / Priority Pass API + push notification)",
          effort: "Medium",
          impact: "Medium",
          priority: "P2",
          owner: "Engineering + Partnerships",
        },
        {
          rowId: "15",
          module: "Redemption Store",
          featureName: "Experiences",
          currentStatus:
            "Customers redeem points for experiences (spa, hotels, events). Available experiences are listed in the admin-managed catalogue. Redemption is a manual process — the customer selects an experience and the ops team fulfils it.",
          enhancedVersion:
            "AI-curated experience recommendations based on the member's location, tier, redemption history, and seasonal context. MCP integration with booking APIs (MakeMyTrip, Thomas Cook, local spa aggregators) to enable real-time availability check and instant booking confirmation within the loyalty app — eliminating the manual fulfilment step. Customers see 'Book Now' instead of 'Request Redemption'.",
          integrationType:
            "AI (personalised curation) + MCP (MakeMyTrip / Booking.com / spa aggregator APIs)",
          effort: "High",
          impact: "High",
          priority: "P2",
          owner: "Engineering + Partnerships",
        },
        {
          rowId: "16",
          module: "Redemption Store",
          featureName: "Travel & Ticketing",
          currentStatus:
            "Customers redeem points for travel rewards: flights, hotels, event tickets. Available in the redemption catalogue as redemption categories. Fulfilment requires manual coordination with travel partners.",
          enhancedVersion:
            "Live inventory integration: MCP connections to flight and hotel search APIs (Amadeus, Skyscanner, MakeMyTrip B2B) surface real-time availability and allow members to book directly within the loyalty app using points as currency. AI price-sensitivity model: suggests to the admin the optimal points-to-cash ratio for travel redemptions based on current market prices — ensuring the loyalty programme stays competitive without over-subsidising travel rewards.",
          integrationType:
            "AI (price optimisation) + MCP (Amadeus / Skyscanner / MakeMyTrip B2B APIs)",
          effort: "Very High",
          impact: "High",
          priority: "P2",
          owner: "Engineering + Partnerships",
        },
        {
          rowId: "17",
          module: "Redemption Store",
          featureName: "Merchandise",
          currentStatus:
            "Physical products available in the redemption catalogue. Managed by admin: product listing, stock levels, point value. Redemption triggers a manual fulfilment process with a logistics partner.",
          enhancedVersion:
            "Dropship integration: MCP connection to merchandise fulfilment APIs (Printfection, Qwikcilver, or Amazon Business) for automated order placement and tracking the moment a member redeems. Live stock sync — products automatically deactivated when inventory hits zero. AI catalogue optimisation: surfaces which merchandise items generate the highest redemption-to-engagement ratio and recommends removing low-performing items from the catalogue quarterly.",
          integrationType:
            "AI (catalogue optimisation) + MCP (Amazon Business / Printfection / Qwikcilver APIs)",
          effort: "High",
          impact: "High",
          priority: "P2",
          owner: "Engineering + Partnerships",
        },
        {
          rowId: "18",
          module: "Redemption Store",
          featureName: "Encashment",
          currentStatus:
            "Customers submit an encashment request with bank details. Admin reviews and processes the payout manually. Request status (Requested / Completed) is tracked in the admin panel. Points are debited from the wallet on encashment approval.",
          enhancedVersion:
            "Automated encashment processing: MCP integration with RazorpayX or Cashfree Payouts API for same-day automated bank transfer on admin approval — eliminating manual payout processing. AI fraud detection: flags encashment requests that show unusual patterns (e.g., rapid accumulation followed by immediate encashment, multiple bank account changes) for manual review before processing. Customers receive real-time transaction status updates via push and SMS.",
          integrationType:
            "AI (fraud detection) + MCP (RazorpayX / Cashfree Payouts API + SMS gateway)",
          effort: "Medium",
          impact: "Very High",
          priority: "P0",
          owner: "Engineering + ML Eng",
        },
        // MODULE: ADMIN
        {
          rowId: "19",
          module: "Admin",
          featureName: "Escrow Wallet",
          currentStatus:
            "A 25% float is maintained in the escrow wallet against total outstanding loyalty points. The master account is required to maintain a mark-to-market balance. Admin monitors escrow balance through the admin panel. Alerts are manual.",
          enhancedVersion:
            "Automated escrow health monitoring: AI tracks the escrow ratio in real time and sends an alert to the finance team when the buffer drops below the 25% threshold, with a recommended top-up amount. Monthly escrow report auto-generated as a PDF in the format required for board-level or regulatory review. MCP integration with the company's accounting system (Tally/SAP) to auto-post the escrow movement as a journal entry — eliminating manual finance reconciliation.",
          integrationType:
            "AI (real-time monitoring + reporting) + MCP (Tally / SAP / accounting API)",
          effort: "Medium",
          impact: "Very High",
          priority: "P0",
          owner: "Engineering + Finance Ops",
        },
        {
          rowId: "20",
          module: "Admin",
          featureName: "Account Statement",
          currentStatus:
            "Admins generate account statements for individual customers: points earned, redeemed, adjusted, and current balance over a selected period. Exportable as CSV. Used for dispute resolution and customer service.",
          enhancedVersion:
            "Self-service customer account statement: members can download their own statement directly from the mobile app — reducing customer service inbound queries. AI-powered insights overlay: the statement includes auto-generated insights ('You earned 3x more points in Q4 than Q3 — here's why') that are both informative and engagement-driving. MCP integration with the client's customer service platform (Zendesk, Freshdesk) so support agents can pull loyalty account statements directly within a support ticket without switching tools.",
          integrationType:
            "AI (insights generation) + MCP (Zendesk / Freshdesk API)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "Engineering + ML Eng",
        },
        // MODULE: INTEGRATIONS
        {
          rowId: "21",
          module: "Integrations",
          featureName: "CRM Integration (Salesforce)",
          currentStatus:
            "12+ bidirectional API endpoints sync member data, payment events, demand notes, referrals, home loans, testimonials, and surveys between Salesforce and the loyalty platform. Sync is event-driven and production-proven.",
          enhancedVersion:
            "Visual data flow monitoring dashboard: admin sees a live map of which Salesforce events are flowing into the loyalty engine, last sync timestamp, and any failed events with one-click retry. AI-powered field mapping assistant: when a new Salesforce object or custom field needs to be mapped to a loyalty trigger, AI suggests the most likely mapping based on field name and data type — reducing integration maintenance time. MCP integration with Salesforce Flow to allow Salesforce admins to trigger loyalty rules directly from Salesforce automation — without needing to use the loyalty platform's admin UI.",
          integrationType:
            "AI (field mapping assistant) + MCP (Salesforce Flow / Salesforce Admin API)",
          effort: "Medium",
          impact: "High",
          priority: "P1",
          owner: "Engineering + Product",
        },
        {
          rowId: "22",
          module: "Integrations",
          featureName: "Accounting Integration",
          currentStatus:
            "API structure in place. Direct accounting connector not yet shipped. Currently requires manual export and reconciliation for GL posting of loyalty costs.",
          enhancedVersion:
            "Automated GL posting: every points issuance, redemption, and escrow movement is posted as a journal entry to the client's accounting software in real time. MCP integration with Tally Prime API, SAP Business One API, and QuickBooks API as the first three connectors. AI-generated loyalty P&L report: monthly auto-summary of total points issued (at cost), redeemed (at cost), expired (liability released), and net programme P&L — ready to paste into the management accounts without any manual calculation.",
          integrationType:
            "AI (P&L summarisation) + MCP (Tally Prime / SAP B1 / QuickBooks APIs)",
          effort: "High",
          impact: "Very High",
          priority: "P0",
          owner: "Engineering + Finance Ops",
        },
      ],
    },
    detailedPricing: {
      pricingSummaryRows: [
        {
          label: "Where We Are Ahead",
          detail:
            "Rule engine depth (7 dimensions), no-code configuration, cold wallet, escrow liability management, redemption breadth (7 types), personalised mobile redemption, CRM integration depth (12+ Salesforce endpoints). These are genuine, defensible advantages - especially escrow and cold wallet, which have no comparable feature in the market.",
          tone: "green",
        },
        {
          label: "Where We Are At Par",
          detail:
            "Tier management and membership management. Solid functionality that meets market expectations. No gap, but also no differentiation. Do not lead with these in sales conversations.",
          tone: "yellow",
        },
        {
          label: "Gaps That Will Cost Us Deals",
          detail:
            "Analytics and reporting dashboard (cost deals with CMO-level buyers), AI/ML personalisation (growing expectation from enterprise buyers), accounting/ERP integration (blocks CFO sign-off), and gamification (needed for EdTech, healthcare, and consumer engagement use cases). Address reporting and accounting integration first - these are deal-blockers today.",
          tone: "red",
        },
      ],
      featuresVsMarket: [
        {
          featureArea: "Rule Engine - Trigger Types",
          marketStandard:
            "3-5 trigger types (purchase, birthday, signup). Most platforms fall back to earn-and-burn. Antavo: 50+ triggers. Capillary: 20+.",
          ourProduct:
            "7 rule dimensions: User Actions, Transaction Events, Time-Based, Segments, Engagement/Behaviour, Milestones, Tier-Based. Multi-condition AND/OR logic.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "AHEAD of India competitors (Capillary, Vinculum). At par with global leaders (Antavo). Seven-dimensional engine is our #1 technical differentiator for high-value verticals.",
          summary:
            "AHEAD of India competitors (Capillary, Vinculum). At par with global leaders (Antavo). Seven-dimensional engine is our #1 technical differentiator for high-value verticals.",
        },
        {
          featureArea: "No-Code Rule Configuration",
          marketStandard:
            "Most platforms require CRM admin or IT involvement. Antavo and Salesforce have visual builders but still require technical training.",
          ourProduct:
            "Business-user configurable rule engine - marketing team can build and deploy rules without raising IT tickets.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "AHEAD in Indian mid-market. Speed-to-deploy advantage: rule changes in hours vs weeks. Key selling point against Salesforce Loyalty Management.",
          summary:
            "AHEAD in Indian mid-market. Speed-to-deploy advantage: rule changes in hours vs weeks. Key selling point against Salesforce Loyalty Management.",
        },
        {
          featureArea: "Wallet & Point Storage",
          marketStandard:
            "Standard: single active wallet. Advanced: tiered point types (bonus, base, expiring). Most platforms: no cold wallet mechanism.",
          ourProduct:
            "Cold wallet (long-term storage) plus active wallet. Redemption velocity control built in.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "AHEAD - cold wallet is a unique feature with no direct equivalent in competing platforms. Critical for high-liability programmes.",
          summary:
            "AHEAD - cold wallet is a unique feature with no direct equivalent in competing platforms. Critical for high-liability programmes.",
        },
        {
          featureArea: "Escrow / Liability Management",
          marketStandard:
            "Not available in any standard loyalty SaaS. Enterprise players (Comarch) have finance modules but not loyalty-specific escrow.",
          ourProduct:
            "Built-in 25% float escrow wallet with mandatory mark-to-market balance. Full financial controls for CFO confidence.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "SIGNIFICANTLY AHEAD - no comparable feature found in market. This is our strongest CFO-level differentiator, especially for BFSI and real estate.",
          summary:
            "SIGNIFICANTLY AHEAD - no comparable feature found in market. This is our strongest CFO-level differentiator, especially for BFSI and real estate.",
        },
        {
          featureArea: "Redemption Catalogue Breadth",
          marketStandard:
            "Standard: vouchers plus basic merchandise. Advanced (Antavo, Comarch): travel, experiences, partner rewards. Most India platforms: limited to vouchers.",
          ourProduct:
            "7 redemption types: vouchers, lounge, experiences, travel and ticketing, merchandise, personalised mobile page, encashment.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "AHEAD in India market. At par with global enterprise platforms. Encashment (cash-out) is a differentiation not commonly offered as a first-class feature.",
          summary:
            "AHEAD in India market. At par with global enterprise platforms. Encashment (cash-out) is a differentiation not commonly offered as a first-class feature.",
        },
        {
          featureArea: "Personalised Mobile Redemption",
          marketStandard:
            "Most platforms: generic catalogue for all users. Antavo and Capillary have basic personalisation. True real-time personalisation is rare.",
          ourProduct:
            "Personalised mobile redemption page tailored to each customer's tier, point balance, history, and preferences - served in real time.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "AHEAD in India market. Drives higher redemption rates. Key UX differentiator in client demos.",
          summary:
            "AHEAD in India market. Drives higher redemption rates. Key UX differentiator in client demos.",
        },
        {
          featureArea: "CRM Integration Depth",
          marketStandard:
            "Most: webhook or basic API. Salesforce Loyalty: native, but requires full Salesforce stack. Capillary: strong retail POS integration.",
          ourProduct:
            "12+ bidirectional Salesforce API endpoints covering members, payments, demand notes, referrals, home loans, surveys, testimonials. Production-proven.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact:
            "AHEAD for Salesforce-first organisations. Deep integration is a moat - replicating this takes 6-12 months for a competitor.",
          summary:
            "AHEAD for Salesforce-first organisations. Deep integration is a moat - replicating this takes 6-12 months for a competitor.",
        },
        {
          featureArea: "Tier Management",
          marketStandard:
            "Standard: 3-5 tiers with fixed rules. Advanced: dynamic tier upgrades or downgrades based on rolling spend. Most India platforms: basic tier logic.",
          ourProduct:
            "Configurable tiers with custom names, thresholds, benefits, and rule associations. Supports unlimited tiers.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AT PAR",
          dealImpact:
            "AT PAR with Antavo and Capillary. No major gap. Further differentiation possible through AI-driven dynamic tier thresholds (roadmap).",
          summary:
            "AT PAR with Antavo and Capillary. No major gap. Further differentiation possible through AI-driven dynamic tier thresholds (roadmap).",
        },
        {
          featureArea: "Membership Management",
          marketStandard:
            "Standard: registration plus ID. Advanced: lifecycle management, auto-enrolment, lapsed member re-engagement.",
          ourProduct:
            "Member registration, unique ID, status lifecycle, auto-tier assignment on registration. CRM sync.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AT PAR",
          dealImpact:
            "AT PAR with market. No significant gap. Lapsed-member automated re-engagement rules can be built using existing behaviour triggers - no product gap, but no sales differentiator.",
          summary:
            "AT PAR with market. No significant gap. Lapsed-member automated re-engagement rules can be built using existing behaviour triggers - no product gap, but no sales differentiator.",
        },
        {
          featureArea: "Analytics & Reporting",
          marketStandard:
            "Standard: basic dashboard - points issued, redeemed, balance. Advanced (Antavo, Capillary): cohort analysis, campaign ROI, predictive churn.",
          ourProduct:
            "Admin account statements and transaction ledger. No advanced analytics dashboard currently.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact:
            "GAP - will cost deals against Antavo and Capillary when CMO-level buyers ask for programme ROI reporting. Must address in 3-6 months.",
          summary:
            "GAP - will cost deals against Antavo and Capillary when CMO-level buyers ask for programme ROI reporting. Must address in 3-6 months.",
        },
        {
          featureArea: "AI / ML Personalisation",
          marketStandard:
            "Antavo AI Loyalty Cloud: auto-optimises rewards offers using ML. Capillary Insight+: predictive next-best-action. Yotpo: smart segmentation.",
          ourProduct:
            "No AI/ML layer currently. Rule logic is human-configured.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact:
            "GAP - growing expectation from enterprise buyers. Not a deal-killer today for mid-market, but will be at 12-18 months. Prioritise AI reward optimisation roadmap.",
          summary:
            "GAP - growing expectation from enterprise buyers. Not a deal-killer today for mid-market, but will be at 12-18 months. Prioritise AI reward optimisation roadmap.",
        },
        {
          featureArea: "Accounting / ERP Integration",
          marketStandard:
            "Standard: manual export. Advanced: direct GL posting via SAP/Tally/QuickBooks. Most loyalty SaaS: no accounting integration.",
          ourProduct:
            "API structure in place. Direct accounting connector not yet shipped.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact:
            "GAP - blocks CFO sign-off in BFSI and large enterprise deals. Finance team needs automated liability posting. Must close this gap to move up-market.",
          summary:
            "GAP - blocks CFO sign-off in BFSI and large enterprise deals. Finance team needs automated liability posting. Must close this gap to move up-market.",
        },
        {
          featureArea: "White-Label / Multi-Brand",
          marketStandard:
            "Standard SaaS: single-brand programme. Enterprise: multi-brand coalition loyalty (Antavo, Comarch).",
          ourProduct:
            "Single-brand programme per deployment. Multi-brand coalition not yet supported.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact:
            "GAP - relevant for retail groups, FMCG conglomerates, and hospitality chains with multiple sub-brands. Not urgent for current ICP but needed for expansion.",
          summary:
            "GAP - relevant for retail groups, FMCG conglomerates, and hospitality chains with multiple sub-brands. Not urgent for current ICP but needed for expansion.",
        },
        {
          featureArea: "Gamification (Streaks, Challenges, Badges)",
          marketStandard:
            "Antavo: full gamification suite. Loyalty programmes with app-native gamification see 30-40% higher engagement.",
          ourProduct:
            "Milestones and tier progression are partially gamified but no explicit streaks, badges, or challenges.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact:
            "GAP - important for EdTech, healthcare, and consumer engagement use cases. Adds stickiness to the programme beyond transactional loyalty.",
          summary:
            "GAP - important for EdTech, healthcare, and consumer engagement use cases. Adds stickiness to the programme beyond transactional loyalty.",
        },
      ],
      currentPricingMarket: [
        {
          category: "Standard pricing models in this category",
          description:
            "1. Per-seat SaaS (admin users): common for SMB loyalty tools\n2. Revenue / transaction volume % (e.g. 0.1-0.5% of GMV): common for retail loyalty\n3. Annual platform license plus implementation fee: common for enterprise\n4. Hybrid: base licence plus per-redemption or per-active-member fee\n5. Usage-based: points issued or members enrolled",
        },
        {
          category: "India - Entry / Mid / Enterprise pricing range",
          description:
            "Entry (SMB, <50K members): Rs3L-Rs8L/year (basic earn-and-burn, limited rule types)\nMid-market (50K-500K members, complex rules): Rs12L-Rs60L/year\nEnterprise (500K+ members, full integrations): Rs60L-Rs3Cr+/year",
        },
        {
          category: "Global - Entry / Mid / Enterprise pricing range",
          description:
            "Key India benchmarks: Capillary Rs25L-Rs2Cr+ | Xoxoday Rs5L-Rs50L plus margin | Salesforce Loyalty Rs30L-Rs3Cr+\nEntry: $5,000-$20,000/year (LoyaltyLion, Yotpo)\nMid-market: $25,000-$150,000/year (Antavo lower tiers, Open Loyalty enterprise)\nEnterprise: $150,000-$1M+/year (Antavo top tier, Comarch, Salesforce Loyalty enterprise)",
        },
        {
          category: "How competitors categorise features across tiers",
          description:
            "Note: Indian pricing is typically 30-50% below global equivalents for comparable feature sets\nTier 1 (Entry): basic earn-and-burn, single earn rule type, voucher redemption only, limited integrations, no wallet management\nTier 2 (Mid): multiple rule types, segment targeting, 3-5 redemption categories, CRM integration, basic analytics\nTier 3 (Enterprise): full rule engine, AI personalisation, all redemption types, escrow/financial controls, multi-brand, SLA and dedicated support",
        },
        {
          category: "What to charge NOW (2026) - and why",
          description:
            "Recommended: Rs15L-Rs40L/year for mid-market India clients (50K-300K members, full platform access)\nRationale: Price below Capillary and Salesforce Loyalty but with reference clients. Include: all rule engine modules, wallet (cold plus ledger), 5 redemption types, Salesforce CRM integration, admin panel, escrow wallet.\nExclude from base price: accounting integration (charge as add-on Rs3-Rs5L), advanced analytics (charge as add-on Rs3-Rs8L once built).",
        },
        {
          category: "What to charge at 6 MONTHS - and why",
          description:
            "Recommended: Rs20L-Rs60L/year\nRationale: By 6 months, a second reference client validates the product. Add analytics dashboard to core offering. Introduce usage-based top-up pricing for programmes above 500K members or 1M+ points transactions/month. Begin pricing for accounting integration as standard add-on.",
        },
        {
          category: "What to charge at 18 MONTHS - and why",
          description:
            "Recommended: Rs40L-Rs2Cr/year (tiered by member count and rule complexity)\nRationale: With 5+ clients, a vertical-specific pricing model becomes defensible. Introduce AI personalisation tier as premium add-on. Global pricing: $30,000-$200,000/year for international clients in GCC/SEA. Consider a 'Starter' tier at $5-8L/year for SMBs to expand top of funnel.",
        },
        {
          category: "One pricing risk to watch",
          description:
            "RISK: Pricing too low to win reference clients and then struggling to reprice existing clients upward as features improve. Establish contractual annual price escalation clauses (8-12% p.a.) from Day 1. Also watch for Capillary or Salesforce dropping their India entry pricing to block mid-market penetration - be prepared to justify ROI in rupees rather than competing purely on price.",
        },
      ],
      positioning: [
        {
          category: "Our single most defensible position right now",
          description:
            "The only loyalty rule engine built for high-value, low-frequency purchase industries - with built-in financial controls that your CFO will not reject.\n\nWhy defensible: No competitor combines (a) a 7-dimensional no-code rule engine with (b) escrow liability management with (c) deep Salesforce CRM integration. This triple combination is unique and takes 18-24 months for a competitor to replicate.",
        },
        {
          category: "2-3 customer segments to prioritise in Year 1 - and why",
          description:
            "1. REAL ESTATE DEVELOPERS (India) - We have a live reference client, 30+ business rules in production, and proven CRM integration. Fastest sales cycle because we can show the exact product they will buy. Target: 5-10 developers with Rs200Cr+ revenue in FY26.\n\n2. BFSI - NBFC and private bank segment (India) - High loyalty programme urgency, escrow wallet is a native sell for finance-regulated businesses, and CRM integration story is strong. Target: 3-5 NBFCs and digital lenders in FY26.",
        },
        {
          category:
            "The one competitor to displace most aggressively - and how",
          description:
            "TARGET: Xoxoday / Plum\n\nWhy: Xoxoday is the current default 'loyalty tool' in India across industries. Clients use it for voucher fulfilment but it is NOT a loyalty programme - it has no rule engine, no wallet, no tiers, no escrow.\n\nHow: Position Xoxoday as the fulfilment layer and us as the intelligence layer. Message: 'Your team already uses Xoxoday for vouchers. We are what sits behind it - the rules engine that decides who gets what, when, and why.'",
        },
        {
          category:
            "What to STOP doing or saying - it is diluting our position",
          description:
            "STOP: Positioning as a 'loyalty platform' generically - this puts us in the same category as Capillary and Salesforce Loyalty where we cannot win on brand or scale.\n\nSTOP: Leading with the redemption catalogue - it is a feature, not a position. Competitors also have redemption catalogues.\n\nSTOP: Talking about 'earning points' - this is table stakes. Lead with the rule engine complexity, the escrow controls, and the CRM integration depth.",
        },
        {
          category: "Recommended GTM motion for Year 1",
          description:
            "MOTION: Direct Sales + Reference-Led Selling\n\nYear 1 is not a PLG or channel year - the product requires configuration and the deal size justifies direct sales.",
        },
      ],
      valuePropositions: [
        {
          rank: "1",
          currentProp:
            "No-code rule engine - configure loyalty rules without IT",
          communicatesToday: "Speed and autonomy for marketing teams",
          weakness:
            "Does not quantify the time saved or the cost of IT dependency",
          sharpened:
            "Launch a loyalty campaign in 2 hours, not 2 weeks - without a single IT ticket. Quantify: average IT ticket for a rule change = 3-5 days delay x 4 campaigns/month = 12-20 days lost marketing execution time.",
          proofPoint:
            "Time-to-deploy comparison from live client: days vs competitor weeks",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
        {
          rank: "2",
          currentProp:
            "7-dimensional rule engine covering actions, transactions, time, segments, behaviour, milestones, and tiers",
          communicatesToday: "Feature richness and configurability",
          weakness:
            "Too feature-focused - buyers do not shop for dimensions, they shop for outcomes",
          sharpened:
            "Reward the right customer, at the right moment, for the right behaviour - automatically. Back this with a specific scenario: when a customer pays their demand note 10 days early and it is their 3rd instalment, the rule engine can trigger the precise reward without manual intervention.",
          proofPoint:
            "Demo the multi-condition rule builder live in every sales meeting",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
        {
          rank: "3",
          currentProp:
            "Built-in escrow wallet with 25% float and mark-to-market liability management",
          communicatesToday: "Financial control and CFO confidence",
          weakness:
            "Not being positioned to the right buyer - this is a CFO and finance message, not a marketing message",
          sharpened:
            "The only loyalty platform where your CFO can see the liability in real time, control it, and sleep at night. Reframe: this feature removes loyalty programmes as a balance sheet risk - turning a finance objection into a finance advantage.",
          proofPoint:
            "Quantify: for a Rs500Cr real estate developer with Rs10Cr loyalty liability, unmanaged exposure = significant audit risk. Escrow removes it.",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
        {
          rank: "4",
          currentProp: "Encashment - customers can convert points to cash",
          communicatesToday: "Maximum flexibility for customers",
          weakness:
            "Not connected to the business outcome for the company - why does encashment benefit the developer or business?",
          sharpened:
            "Turn outstanding dues into loyalty currency - customers redeem points against their next instalment, improving collections without a single call. Reframe encashment as a collections acceleration tool, not just a customer delight feature.",
          proofPoint:
            "Show encashment redemption volume from live client as proof of engagement",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
        {
          rank: "5",
          currentProp: "Personalised mobile redemption page",
          communicatesToday: "Better customer experience vs generic catalogue",
          weakness:
            "Vague - 'personalised' is overused and under-proven in SaaS marketing",
          sharpened:
            "Every customer sees only the rewards they can afford and are most likely to want - increasing redemption rates by surfacing relevant offers, not a generic catalogue of 10,000 items they will ignore.",
          proofPoint:
            "Redemption rate comparison: personalised page vs generic catalogue - gather from live client data",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
        {
          rank: "6",
          currentProp: "Deep Salesforce CRM integration (12+ API endpoints)",
          communicatesToday:
            "No rip-and-replace - works with existing tech stack",
          weakness:
            "12 endpoints sounds technical - buyers do not know what this means in practice",
          sharpened:
            "Your CRM already knows when a customer pays, refers someone, or books a site visit - we make every one of those moments a loyalty moment automatically, without any manual data entry. Make the integration your proof of closed-loop loyalty.",
          proofPoint:
            "Show the data flow diagram: Salesforce -> Loyalty Engine -> Reward in real time",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
        {
          rank: "7",
          currentProp: "Cold wallet - separate long-term point storage",
          communicatesToday:
            "Controls redemption velocity and cash flow impact",
          weakness:
            "Cold wallet is an internal feature name - customers do not understand what it means without a story",
          sharpened:
            "Protect your cash flow while keeping loyalty liability in a controlled reserve account until you choose to release it for redemption. No surprise redemption spikes. Position as a financial risk management tool, not just a wallet design.",
          proofPoint:
            "Show escrow + cold wallet together as the 'CFO package' - two features that eliminate the #1 finance objection to loyalty programmes",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: "",
        },
      ],
      comparisonSummary: {
        ahead:
          "Rule engine depth (7 dimensions), no-code configuration, cold wallet, escrow liability management, redemption breadth (7 types), personalised mobile redemption, CRM integration depth (12+ Salesforce endpoints).",
        atPar:
          "Tier management and membership management. Solid functionality that meets market expectations. No gap, but also no differentiation.",
        gaps: "Analytics and reporting dashboard, AI/ML personalisation, accounting/ERP integration, white-label / multi-brand support, and gamification.",
      },
    },
    detailedBusinessPlan: {
      planQuestions: [
        {
          id: "Q1",
          question:
            "What problem are you solving, for whom, and why does it need solving now?",
          answer:
            "I am solving the complete absence of configurable, financially controlled loyalty programme infrastructure for businesses in high-value, low-frequency purchase industries - specifically real estate developers, banks and NBFCs, and automotive dealer groups.\n\nThe problem has three layers:\n\nFirst, these companies have no automated way to reward customers for behaviours that directly improve their business metrics - paying a demand note early, referring a buyer, returning for an aftersales service visit, or completing digital onboarding. They manage referral programmes on Excel, pay incentives manually weeks after the event, and have no rule engine that can translate a business condition (paid within 5 days of demand note) into an automated reward.\n\nSecond, the loyalty platforms that exist - Capillary, Salesforce Loyalty Management, Antavo - are built for retail. They have no understanding of a demand note, no concept of a possession TAT incentive, no escrow wallet for loyalty liability management. A real estate developer trying to use Capillary is fitting a round peg into a square hole, and paying Rs1Cr+ per year for the privilege.\n\nThird, there is a genuine financial control gap. Every loyalty programme creates a liability - unredeemed points are a balance-sheet obligation. No loyalty SaaS in the market offers a structured escrow wallet with a mandatory float and mark-to-market balance. CFOs at our target clients are either blocking loyalty programmes because of unquantified liability risk, or running them with no financial visibility at all.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "blue",
        },
        {
          id: "Q2",
          question: "What is your solution, and how does it work?",
          answer:
            "We are a B2B SaaS loyalty rule engine - the intelligence layer that sits between a company's CRM and their customers, turning every meaningful customer behaviour into an automated, personalised reward.\n\nHere is how it works:\n\nA business configures their loyalty programme through our no-code admin interface. They define tiers (Bronze, Silver, Gold), earning rules (pay demand note within 5 days = 6,000 points), and redemption options (encash points against outstanding dues, redeem for travel, merchandise, or experiences). Rules span 7 dimensions: user actions, transaction events, time-based events, customer segments, engagement behaviour, milestones, and tier-based conditions.\n\nWhen a customer does something that meets a rule's conditions - Salesforce sends us the event via API, we evaluate the rule in real time, credit the customer's wallet, and notify them via push notification. The entire loop - behaviour to reward - happens in seconds, not weeks.\n\nThe money sits in a structured escrow wallet: 25% of total outstanding loyalty liability is maintained as a float, mark-to-market. The CFO can see the exact liability exposure at any time.\n\nWhen customers want to redeem, they open the personalised mobile redemption page - which shows only the rewards they can afford and are most likely to want. They can redeem for vouchers, experiences, travel, merchandise, lounge access, or cash (direct bank transfer). Points that are not yet redeemable sit in a cold wallet - controlling redemption velocity and protecting cash flow.\n\nUnderneath all of this, the CRM integration is the backbone. We already have 12+ Salesforce API endpoints in production. This is not a generic loyalty layer - it is a domain-configured infrastructure product with the CRM and finance controls already built for enterprise deployment.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "teal",
        },
        {
          id: "Q3",
          question:
            "Who is your target customer, and what does their ideal profile look like?",
          answer:
            "My primary target customer is a mid-to-large enterprise in one of three verticals: real estate development, banking and financial services (specifically NBFCs and private banks), or automotive dealer groups.\n\nThe ideal profile across all three:\n\nCompany size: Rs200Cr-Rs5,000Cr revenue. Large enough to have a CRM (typically Salesforce), a marketing or CRM team, and a budget for customer retention software. Small enough that they cannot build this in-house and cannot afford Capillary or Comarch pricing.\n\nCRM: Salesforce or a comparable enterprise CRM already in use. Our integrations are built on Salesforce - clients who are already on Salesforce have zero integration friction.\n\nCustomer base: 5,000-500,000 members. Below 5,000, loyalty ROI is marginal. Above 500,000, we need additional infrastructure (which is on the roadmap).\n\nGeography: India Tier 1-2 cities in Year 1. GCC expansion in Year 2.\n\nThe buyer: CMO or VP Marketing (owns the loyalty programme mandate), co-signed by the CFO (escrow wallet and liability management story) and Head of IT (Salesforce integration story). All three must be addressed - our sales motion runs three parallel tracks.\n\nThe user: CRM Manager or Loyalty Programme Manager. They configure rules, monitor performance, and manage the redemption catalogue. They are our champions because we eliminate their IT dependency for every rule change.\n\nMy beachhead is the real estate vertical - we have a live reference client, proven rules in production, and no meaningful competition. BFSI is the second priority (higher ACV, longer sales cycle). Automotive is third (high ROI story but OEM complexity adds friction).",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "purple",
        },
        {
          id: "Q4",
          question: "What is your business model, and how do you make money?",
          answer:
            "We generate revenue through annual SaaS subscription contracts, priced primarily by member count and rule complexity.\n\nPricing tiers:\n- Starter: Rs5-8L/year (up to 10,000 members, 5 rule types, basic CRM integration) - for SMBs and pilots\n- Professional: Rs15-35L/year (up to 100,000 members, all 7 rule dimensions, full redemption catalogue, Salesforce integration, escrow wallet) - our primary ICP tier\n- Enterprise: Rs40-150L/year (unlimited members, AI personalisation on roadmap, accounting integration, multi-brand, dedicated CSM, SLA guarantee) - for large BFSI and automotive groups\n\nRevenue structure:\n- 80% platform subscription (recurring)\n- 15% implementation and onboarding fee (one-time per client, Rs2-5L)\n- 5% optional add-ons: advanced analytics module, accounting integration, AI personalisation layer (once built)\n\nPayment terms: 50% upfront, 50% at 90 days for Year 1. Annual renewal with a 10-12% price escalation clause from Year 2 onwards.\n\nUnit economics (target):\n- CAC: Rs4-8L per enterprise client (direct sales model)\n- LTV (3-year): Rs60-180L per client (Rs20-60L ACV x 3 years x 10-12% expansion)\n- LTV:CAC ratio: 8-18x - well within healthy enterprise SaaS range\n- Gross margin: 72-80% (SaaS + cloud infrastructure; low COGS)\n- Payback period: 8-14 months per client\n\nAt 10 clients in Year 1 at an average ACV of Rs22L, we reach Rs2.2Cr ARR. At 25 clients by Month 24 with average ACV expansion to Rs30L, we reach Rs7.5Cr ARR - the threshold for Series A relevance in Indian B2B SaaS.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "red",
        },
        {
          id: "Q5",
          question:
            "Who are your competitors, and what is your competitive advantage?",
          answer:
            "My direct competitors are Capillary Technologies (India), Salesforce Loyalty Management (global enterprise), Antavo (global enterprise), and Xoxoday/Plum (India - voucher fulfilment, not a true loyalty platform).\n\nHere is how I think about each:\n\nCapillary: The incumbent India loyalty leader. Built for retail - deep POS integration, strong analytics, large client base. Cannot serve real estate, BFSI, or automotive without heavy customisation. Priced at Rs25L-2Cr+ for features I have built for Rs15-35L. My advantage: vertical depth, escrow wallet, and 60% lower price for non-retail clients.\n\nSalesforce Loyalty Management: Available only to companies on the full Salesforce stack, and priced at Rs30L-Rs3Cr+ annually. Requires a Salesforce consultant to configure rules - marketing teams cannot self-serve. My advantage: no-code rule engine, 8x faster deployment, vertical-specific rule templates, and escrow controls that Salesforce does not offer at any price.\n\nAntavo: The Gartner Leader for enterprise loyalty globally. EUR80,000-650,000+/year. No India presence, no escrow wallet, 9-18 month deployment cycles. My advantage: India pricing, India vertical knowledge, 8-12 week deployment, and the escrow wallet.\n\nXoxoday/Plum: The default 'loyalty tool' in India. It is not a loyalty platform - it is a reward fulfilment platform. No rule engine, no wallet, no tiers, no escrow. My strategy: position Xoxoday as our fulfilment partner, not our competitor. We are what sits above Xoxoday - the intelligence layer that decides who earns what and when.\n\nMy three defensible advantages:\n1. The only platform combining a 7-dimension no-code rule engine + escrow liability management + production-proven Salesforce integration - no competitor has all three.\n2. Vertical depth: 30+ rules in production for real estate - a competitor would need 12-18 months to replicate the domain knowledge embedded in our rule templates and integrations.\n3. India execution advantage: I can deploy in 8-12 weeks at one-third the cost of enterprise global players.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "blue",
        },
        {
          id: "Q6",
          question:
            "What is your go-to-market strategy for the first 12 months?",
          answer:
            "Year 1 is a direct sales and reference-led motion. I am not trying to build a PLG engine or a channel network in Year 1 - I am trying to close 8-10 enterprise clients and build the case study infrastructure that makes Month 13 onwards scalable.\n\nMy 12-month GTM in three tracks:\n\nTrack 1 - Real Estate (Months 1-6, primary focus):\nEntry point: collections TAT problem. Every discovery call leads with: 'What is your average days-to-payment after a demand note? We can reduce that by 35-45% with one rule.' This single data point justifies the ACV before any product demonstration. I am using our live reference client as the centrepiece - every prospect gets a 30-minute call with the reference client's CRM manager before signing.\n\nTrack 2 - BFSI (Months 3-9, parallel):\nEntry point: EMI on-time payment incentive + RBI compliance framing. The escrow wallet is the CFO and compliance unlock. I publish the RBI loyalty liability compliance guide in Month 1 - this gets me into compliance officer conversations that no standard sales motion reaches.\n\nTrack 3 - Automotive (Months 5-12, later start):\nEntry point: aftersales revenue retention - first-service capture rate is the metric. I approach FADA (Federation of Automobile Dealers Associations) for a knowledge partner role in Month 2. Speaking at one FADA event converts to 5-10 qualified meetings.\n\nAcross all three: I am building one Salesforce SI partner relationship per quarter. Each SI partner is worth 3-8 qualified referrals per year from their existing BFSI / real estate client base.\n\nYear 1 commercial target: Rs1.8-2.5Cr ARR from 7-10 signed clients. Year 1 operating goal: 2 reference clients with published, named case studies.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "green",
        },
        {
          id: "Q7",
          question:
            "What does your financial model look like for the first 3 years?",
          answer:
            "My financial projections are built on conservative assumptions with specific milestones that gate each growth phase.\n\nYear 1 (FY2026-27):\n- Clients: 3-4 signed (1 real estate reference already live)\n- Average ACV: Rs20-22L\n- ARR: Rs60-88L\n- Revenue (recognised): Rs45-70L (accounting for 50/50 payment split and contract timing)\n- Team: 4 people (2 founders + 1 senior seller hire in Month 2 + 1 CS hire in Month 4)\n- Burn: Rs60-75L (salaries, cloud infra, events, Salesforce partnership fees)\n- Net: Break-even to slightly negative; funded by existing capital or first round\n\nYear 2 (FY2027-28):\n- Clients: 10-15 total (7-12 new in Year 2)\n- Average ACV: Rs25-30L (ACV expansion from existing clients + higher entry point for new clients)\n- ARR: Rs2.5-4.5Cr\n- Revenue: Rs2-3.5Cr\n- Team: 8-10 people (add ML engineer for AI roadmap, 1 marketing hire, 1 sales hire)\n- Burn: Rs1.8-2.5Cr\n- Net: Cash-flow positive by Q3 Year 2\n\nYear 3 (FY2028-29):\n- Clients: 25-40 total (including first GCC client)\n- Average ACV: Rs35-50L\n- ARR: Rs8-15Cr\n- Revenue: Rs7-12Cr\n- Team: 18-24 people\n- Burn: Rs4-6Cr\n- Net: Profitable. Series A ready with Rs10Cr+ ARR as target\n\nKey assumptions: 0% client churn in Year 1 (reference client stickiness), 10% annual ACV expansion from existing clients, 90-day average sales cycle for new enterprise deals, 8-week average onboarding time reducing to 4 weeks by Year 2 with the playbook.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "yellow",
        },
        {
          id: "Q8",
          question:
            "What are the key risks, and how do you plan to manage them?",
          answer:
            "I see five material risks:\n\nRisk 1 - Long sales cycles create cash flow pressure.\nEnterprise B2B deals take 3-8 months to close. With a small team and one reference client, a 3-month pipeline drought could be existential.\nMitigation: The 90-day paid pilot (Rs3-5L) compresses the decision timeline. It also generates early cash and a data-rich case study simultaneously. I never pitch a full ACV before offering a pilot - it lowers the activation energy of every decision.\n\nRisk 2 - Single vertical concentration risk.\nIf real estate developers stop buying (regulatory change, market slowdown), we have no fallback revenue in Year 1.\nMitigation: BFSI track launches in parallel from Month 3. The product is genuinely vertical-agnostic - it is our sales focus that is vertical-specific. Diversification is built into the GTM plan, not an afterthought.\n\nRisk 3 - Capillary or Salesforce drops pricing to block mid-market penetration.\nBoth have the scale to price us out if they choose to.\nMitigation: Our moat is not price - it is vertical depth and the escrow wallet. Neither Capillary nor Salesforce can ship a demand-note rule trigger, a mark-to-market escrow wallet, and a production-proven Salesforce integration in less than 12-18 months. We use that window to sign 5-8 reference clients and build switching cost.\n\nRisk 4 - Key person dependency.\nIn a 4-person team, losing one technical co-founder or the sales lead would be material.\nMitigation: Document every integration, every rule template, and every client configuration in the onboarding playbook from Day 1. The business should not live in anyone's head. Vesting cliffs and ESOP structures are in place.\n\nRisk 5 - Regulatory change in BFSI loyalty (RBI guideline tightening).\nRBI has issued guidance on prepaid instruments that could affect how loyalty points are classified.\nMitigation: The escrow wallet is our hedge - it is designed to be RBI-compatible. I publish the compliance guide and engage with FIDC/MFIN to stay ahead of regulatory development. Being the 'compliant loyalty platform' is a feature, not a burden.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "orange",
        },
        {
          id: "Q9",
          question:
            "What does your team look like, and what capabilities do you need to build?",
          answer:
            "Current team: 2 technical founders with product and engineering depth, supported by the go-to-market work being validated now.\n\nWe have built and deployed a production-grade loyalty rule engine with 12+ Salesforce API endpoints, a multi-tier wallet system, a full redemption store, and an escrow wallet - all in a single live deployment. This is not a prototype. This is a product that handles real money and real customer data for a major enterprise client.\n\nCapability gaps and hiring plan:\n\nMonth 2 - Senior Sales Hire (Priority: Critical):\nSomeone who has sold enterprise B2B SaaS into real estate or BFSI in India. They must be able to navigate a buying committee (CMO, CFO, IT) and close deals at Rs20-40L ACV independently. This hire frees the founding team from sales calls and allows us to pursue three verticals simultaneously.\n\nMonth 4 - Customer Success Manager (Priority: High):\nAs we onboard clients 2 and 3, the founding team cannot be the onboarding resource. The CS Manager owns onboarding time reduction and client health metrics. They run the playbook, configure the first rule set with the client, and track MAU and redemption rates month-on-month.\n\nMonth 6 - Marketing / Content Hire (Priority: Medium):\nTo sustain LinkedIn content velocity and manage event logistics. The founding team's time is better spent in sales and product at this stage - but the content engine must not stop.\n\nMonth 10-12 - ML Engineer (Priority: Medium):\nTo begin building the AI reward optimisation engine. This is the 6-18 month roadmap item - hiring ahead of it allows a 3-4 month research and prototyping phase before production.\n\nAdvisory board: I am building a 3-person advisory board: (1) a former CXO at a large Indian real estate developer who can open doors and validate the product, (2) a BFSI compliance expert who can advise on RBI loyalty guidelines, and (3) a Salesforce ecosystem leader who can accelerate partner relationships.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "blue",
        },
        {
          id: "Q10",
          question:
            "What is your vision for this company in 5 years, and what does success look like?",
          answer:
            "In 5 years, I want to be the default loyalty infrastructure for high-value customer relationships in emerging markets - starting in India, expanding to GCC and SEA.\n\nThe 5-year vision has three layers:\n\nLayer 1 - Category ownership in India (Years 1-3):\nWe become the obvious answer when a CFO at an Indian real estate developer, NBFC, or automotive group asks 'how do we build a loyalty programme?' Not because we outspent Capillary on marketing - but because we have the deepest vertical knowledge, the most specific product, and the most published proof points in each category. 40+ clients in India across 5 verticals, Rs15-25Cr ARR.\n\nLayer 2 - GCC expansion (Years 3-4):\nThe GCC (UAE, Saudi, Qatar, Bahrain) has identical verticals to India - real estate groups, Islamic banks, automotive dealerships - and a far higher willingness to pay for loyalty infrastructure. A single UAE real estate group deployment at Rs200,000 ACV equals 5 Indian clients. We expand with a small regional sales presence and a data residency-compliant infrastructure. Rs40-70Cr ARR.\n\nLayer 3 - Platform and ecosystem (Years 4-5):\nWe open our API to third-party developers and Salesforce ISV partners. The Loyalty Rule Engine becomes an infrastructure layer - not just a product. ISVs build vertical-specific extensions on top of us. We take a platform fee. This is the Stripe/Twilio model for loyalty - infrastructure that others build on. Rs100Cr+ ARR with 60%+ gross margins.\n\nWhat success looks like to me in 5 years:\n- 80-120 enterprise clients across India and GCC\n- Rs80-120Cr ARR with 70%+ gross margin\n- NRR of 120%+ - clients expanding, not churning\n- The escrow wallet is an industry standard - other platforms copy it\n- One IPO-ready balance sheet or a strategic acquisition by a global loyalty or CRM player at 8-12x revenue\n\nThe north star has not changed: every client's customers should feel genuinely rewarded for the behaviours that matter most to the business - and every client's CFO should sleep soundly knowing exactly what their loyalty liability is. If we achieve both at scale, we have built something worth building.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "teal",
        },
      ],
    },
    detailedMarketAnalysis: {
      targetAudience: [
        {
          segment: "Mid-to-Large Real Estate Developers",
          demographics:
            "Industry: Residential and commercial real estate\nCompany size: Rs 200Cr-Rs 5,000Cr revenue, 500-10,000 units/year\nBuyer: VP Sales, CRM, CMO, head CRM, \n User: CRM Manager, collection team",
          geography:
            "India (Tier 1-2 cities: Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad)",
          industry: "Real Estate",
          painPoints:
            "1. Collections TAT is 30-60 days on average; demand notes go unpaid without aggressive follow-up and there is no automated incentive mechanism to reward early payment.\n2. Referral programmes run on Excel with no real-time tracking, incentives paid late, and channel conflict between broker and customer referrals.\n3. No loyalty data layer exists, so every buyer is treated the same with no tiering, segmentation, or behaviour-led rewards.",
          notSolved:
            "1. Each day of delayed collection costs 0.05-0.1% interest on outstanding receivables; at Rs 500Cr collections book, one extra day can mean Rs 25-50L interest cost.\n2. Without referral programme automation, warm leads are lost to broker commission leakage, often 1-2% of transaction value.\n3. Repeat-buyer potential across second, third, and fourth asset purchases is not leveraged.",
          goodEnough:
            "Collections team calls daily.\nExcel-tracked referral bonuses paid quarterly.\nBasic Xoxoday vouchers issued manually for milestones.\nNo tier structure and no rule automation.",
          triggerToSwitch:
            "Lost a deal to a competitor that offered an integrated loyalty programme to their sales team as a differentiator; or CFO asks for liability management around outstanding loyalty points.",
        },
        {
          segment: "Private Banks, NBFCs and Digital Lenders",
          demographics:
            "Industry: Banking and financial services\nCompany size: Rs 1,000Cr-Rs 50,000Cr AUM, 50,000-5M customers\nBuyer: Chief Customer Officer, Lending Product Head Reatil Bankung User:Loyalty /CRM Team, DIgital Banking",
          geography:
            "India (national private banks, regional co-operative banks, NBFCs); Global (digital-first banks in SEA, GCC, UK)",
          industry: "BFSI",
          painPoints:
            "1. Standard loyalty points on card spend are not differentiated, so customers have zero reason to choose one bank over another based on loyalty alone.\n2. Cross-sell loyalty, where a customer is rewarded for taking a second product, requires IT development each time and marketing cannot self-configure the rules.\n3. Relationship banking and app journeys need variable bonus logic across lifetime value, risk, tenure, and product mix.",
          notSolved:
            "1. Undifferentiated loyalty accelerates churn to competitors offering better rewards; cost to acquire a new CASA customer can be Rs 2,000-Rs 8,000 versus roughly Rs 500 to retain.\n2. Cross-sell rates remain at industry average 1.8 products per customer; well-executed loyalty can push this to 2.5-3.0, creating significant revenue uplift.\n3. Premium customer experience remains generic while liability exposure on points keeps growing.",
          goodEnough:
            "Comviva or in-house rule engine that is 2-5 years old and unscalable.\nSalesforce Loyalty Management for a few enterprises, but expensive and complex.\nPoints redeemable for Flipkart or Amazon vouchers with low perceived value.\nRules changed quarterly via IT tickets.",
          triggerToSwitch:
            "RBI circular on customer service standards; competitive pressure from a new entrant offering superior loyalty; internal audit flags uncapped loyalty liability.",
        },
        {
          segment: "Automotive OEMs and Dealer Groups",
          demographics:
            "Industry: Passenger vehicles (new and pre-owned)\nCompany size: OEMs with 500+ dealerships; dealer groups with Rs 500Cr+ revenue\nBuyer: Head Aftersales, CMO at OEM User: CRM Manager, Service Advisor",
          geography:
            "India (all major OEMs and franchise dealer networks); Global (OEMs in EU and GCC building owner loyalty programmes)",
          industry: "Automotive",
          painPoints:
            "1. Aftersales loyalty is still paper-based or a basic app stamp card with no connection between service revenue and a configurable reward rule engine.\n2. Test drive, insurance renewal, and accessory purchase events are not tracked or incentivised in any automated way, causing revenue leakage.\n3. No segment differentiation exists for repeat owners, service loyalists, or high-value customers across the ownership lifecycle.",
          notSolved:
            "1. Multi-brand workshops capture 35-40% of out-of-warranty service revenue that should stay in the dealer network.\n2. Insurance renewal through the dealership versus direct generates 8-12% commission, and without an incentive programme many customers renew direct.\n3. Repeat vehicle purchase share drops when there is no lifecycle loyalty programme.",
          goodEnough:
            "Manual stamp cards or basic CRM loyalty.\nCDK or Dealertrack with limited loyalty modules.\nWhatsApp broadcasts for service reminders.\nNo points wallet and no redemption catalogue.",
          triggerToSwitch:
            "New EV brand launches with a digital-native loyalty programme; competitor dealer group shows measurable aftersales revenue uplift from loyalty programme ROI.",
        },
        {
          segment: "Organised Retail Chains and D2C Brands",
          demographics:
            "Industry: Fashion, electronics, grocery, beauty, home\nCompany size: 50-500 stores or Rs 100Cr+ D2C revenue; 100K+ active customers\nBuyer: CMO, CRM Head, Category Head",
          geography:
            "India (Tier 1 organised retail, growing D2C brands); Global (mid-market retail in UK, SEA, and MENA adopting basic loyalty SaaS)",
          industry: "Retail and D2C",
          painPoints:
            "1. Points programmes are flat and undifferentiated, so every customer earns the same rate regardless of spend level, engagement, or brand affinity.\n2. Redemption experience is broken; points wallets exist but redemption pages are generic and irrelevant to the individual customer.\n3. Personalised loyalty is not connected to browsing, cart, repeat purchase, or store-visit signals.",
          notSolved:
            "1. A 5% improvement in retention rate can increase profit by 25-95%, but current loyalty does not drive meaningful behaviour change.\n2. Unredeemed points remain unresolved liability on the balance sheet and create audit exposure when active redemption is weak.\n3. CAC remains high because loyalty fails to increase repeat purchase or AOV.",
          goodEnough:
            "Basic loyalty SaaS such as LoyaltyLion or Smile.io.\nTeam-run WhatsApp campaigns for reactivation.\nManual voucher issuance for VIP customers.\nNo behaviour-triggered rules.",
          triggerToSwitch:
            "CAC rises above sustainable threshold; board asks for CLV improvement plan; competitor D2C brand launches a tier-based loyalty programme that drives press coverage.",
        },
        {
          segment: "Hospitality Groups (Hotels, Resorts, Clubs)",
          demographics:
            "Industry: Hospitality and leisure\nCompany size: 10-200 properties, Rs 100Cr-Rs 2,000Cr revenue\nBuyer: VP Revenue Management, Director of Marketing User: Front Office CRM, Revenue Manager",
          geography:
            "India (premium standalone hotels, resort chains, members clubs); Global (boutique hotel groups in EU, GCC, SEA)",
          industry: "Hospitality",
          painPoints:
            "1. Loyalty programme rules are locked inside the PMS, so marketing cannot make rule changes without vendor intervention and the turnaround is slow.\n2. Direct booking share erodes to OTAs because OTA rewards feel better than the hotel's own loyalty proposition.\n3. Loyalty data sits across stays, dining, spa, and events with no unified customer view.",
          notSolved:
            "1. OTA commission on displaced direct booking is 15-25% of room revenue, creating major leakage.\n2. Loyal guests spend more per stay and are cheaper to retain than OTA-acquired guests, but that value remains invisible without a functional loyalty programme.\n3. Member acquisition cost through OTAs keeps rising year after year.",
          goodEnough:
            "Basic PMS loyalty module such as Opera or IDS Next.\nManual tier upgrade process.\nEmail newsletter with generic voucher.\nNo mobile personalised redemption.",
          triggerToSwitch:
            "Losing direct bookings to a competitor hotel that launched a digital loyalty app; OTA commission costs flagged by CFO; a new GM with loyalty programme experience joins.",
        },
        {
          segment: "Global: Mid-Market SaaS and Subscription Businesses",
          demographics:
            "Industry: SaaS, subscription services, professional services\nCompany size: $5M-$100M ARR; 1,000-100,000 customers\nBuyer: Head of Customer Success CMO, User: Customer Success Manager, Growth Team",
          geography:
            "Global (US, UK, EU, Australia) - not India-primary; international expansion opportunity",
          industry: "SaaS and Subscriptions",
          painPoints:
            "1. Renewal and upsell behaviour is still driven entirely by account managers; there is no automated loyalty mechanic that rewards product engagement or usage milestones.\n2. Net Revenue Retention improvement requires reducing logo churn or loyalty-based milestone rewards for power users, but most teams still run manual programmes.\n3. Referral-sourced customers have higher LTV than outbound-sourced customers, yet referral loyalty remains disconnected from CRM and lifecycle automation.",
          notSolved:
            "1. Logo churn of even 1% compounds into significant ARR replacement pressure every year.\n2. Referral-sourced customers have materially higher LTV, so without an automated referral engine that value is left on the table.\n3. Product adoption and expansion signals do not connect to a reward programme, so renewal momentum is lost.",
          goodEnough:
            "Manual CSM outreach for renewals.\nBasic referral SaaS with no CRM integration.\nSwag-store tooling such as Printfection or Sendoso for milestone gifts.\nNo rule engine connecting behaviour to reward.",
          triggerToSwitch:
            "NRR drops below 100% for the first time; board asks for a retention improvement plan; competitor SaaS announces a loyalty programme as a GTM differentiator.",
        },
      ],
      competitorMapping: [
        {
          name: "Capillary Technologies (India SaaS - loyalty platform)",
          location: "India Competitor",
          targetCustomer:
            "Mid-to-large retailers and consumer brands in India and SEA. Primary verticals: fashion, grocery, QSR, beauty. Typical client: Rs 500Cr+ revenue brand.",
          pricing:
            "SaaS subscription plus transaction pricing. India: roughly Rs 25L-Rs 2Cr+ per year depending on volume.",
          discovery:
            "Direct sales, industry events, LinkedIn ABM, and retail ecosystem referrals.",
          strongestFeatures:
            "- Industry-leading retail loyalty engine with deep POS integration.\n- Strong analytics and segmentation.\n- Omni-channel online plus offline unified loyalty.\n- Strong reference network in retail and SEA.",
          weakness:
            "- Heavy and expensive for non-retail verticals.\n- Poor fit for high-value, low-frequency purchases such as real estate, auto, and BFSI.\n- No escrow or liability management feature.\n- Long implementation cycles and significant IT involvement.",
          marketGaps:
            "Gap: Capillary is retail-centric and cannot serve real estate, BFSI, or auto deeply.\nExploit: Lead with vertical depth, escrow wallet, transaction-event engine, and CRM-native integration built for those sectors.",
          threats:
            "AI-powered personalisation and auto-optimised reward offers could outpace us if Capillary expands vertically.",
          threatLevel: "HIGH",
        },
        {
          name: "Xoxoday / Plum (India rewards and voucher platform)",
          location: "India Competitor",
          targetCustomer:
            "HR teams, employee rewards teams, marketing campaign teams, and sales incentive programmes across industries.",
          pricing:
            "Pay-per-redemption plus SaaS subscription. India: roughly Rs 5L-Rs 50L per year plus redemption margin.",
          discovery:
            "Google Ads, HR SaaS marketplaces, referrals, partner ecosystem, and brand recall in incentives.",
          strongestFeatures:
            "- Massive catalogue with global reward options.\n- Fast setup with voucher campaigns live in days.\n- Strong in employee rewards and sales incentives.\n- Good API for basic CRM integration.\n- Recognised brand in India incentive market.",
          weakness:
            "- Not a true loyalty engine; it is a reward fulfilment platform.\n- No tier management, no wallet, no escrow.\n- Cannot configure complex multi-condition rules.\n- No financial controls or liability management.\n- Better as a campaign tool than a long-term programme.",
          marketGaps:
            "Gap: Xoxoday is today's good-enough workaround for vouchers, not loyalty infrastructure.\nExploit: Position as the upgrade path with rules plus wallet, while still integrating Xoxoday as a reward partner if needed.",
          threats:
            "Workflow automation and deeper CRM integrations could move Xoxoday closer to loyalty territory and threaten our mid-market positioning.",
          threatLevel: "MEDIUM",
        },
        {
          name: "Salesforce Loyalty Management (Global SaaS - enterprise CRM add-on)",
          location: "India and Global Competitor",
          targetCustomer:
            "Enterprise Salesforce customers in retail, BFSI, and consumer goods. Typical client: Fortune 500 or Indian unicorn already on a full Salesforce stack.",
          pricing:
            "Sold as a Salesforce add-on. India: roughly Rs 30L-Rs 3Cr+ per year on top of Salesforce licensing.",
          discovery:
            "Salesforce account executives, Dreamforce, AppExchange, SI partners, and the Salesforce ecosystem.",
          strongestFeatures:
            "- Native Salesforce integration with no external sync needed.\n- Enterprise-grade security and compliance.\n- Rich analytics via Salesforce CRM Analytics.\n- Strong for retail and consumer goods use cases.\n- Massive global support ecosystem.",
          weakness:
            "- Extremely expensive for SME and mid-market clients.\n- Requires full Salesforce stack in place and is not standalone.\n- Complex to configure and often needs a consultant.\n- No escrow or liability management.",
          marketGaps:
            "Gap: Too expensive and too stack-dependent for most mid-market buyers.\nExploit: Position as CRM-connected, faster to deploy, and far more practical for real-world loyalty use cases with specialised liability controls.",
          threats:
            "Einstein AI and Data Cloud investment could make Salesforce stronger if pricing and deployment become simpler for mid-market.",
          threatLevel: "HIGH",
        },
        {
          name: "MartJack / Vinculum (India retail tech)",
          location: "India Competitor",
          targetCustomer:
            "Omnichannel retailers in India with e-commerce plus physical store presence. Typical client: Rs 100Cr-Rs 1,000Cr revenue retail brand.",
          pricing:
            "SaaS subscription plus implementation fees. India: roughly Rs 8L-Rs 80L per year.",
          discovery:
            "Retail trade events, digital marketing, partner channel, and unified commerce buying cycles.",
          strongestFeatures:
            "- Strong order management and inventory sync.\n- Basic loyalty module bundled with retail OMS.\n- Good for brands needing unified commerce.\n- Lower cost than Capillary for mid-market retail.",
          weakness:
            "- Loyalty is an add-on, not the core product.\n- Limited rule engine depth.\n- No tier-based differential logic or complex multi-condition rules.\n- No wallet or escrow management.\n- Weak analytics on loyalty performance.",
          marketGaps:
            "Gap: The bundled loyalty layer is basic and serious programmes outgrow it.\nExploit: Partner or displace as the specialist loyalty engine for Vinculum clients needing depth beyond earn-and-burn.",
          threats:
            "Shopify and quick-commerce integrations could expand Vinculum into D2C loyalty, a segment we also target.",
          threatLevel: "MEDIUM",
        },
        {
          name: "LoyaltyPlus / In-house Custom Builds (India proprietary legacy systems)",
          location: "India Competitor",
          targetCustomer:
            "Large enterprises in BFSI, telecom, and retail that built custom loyalty systems 5-10 years ago and still run them internally.",
          pricing:
            "No external price. Initial IT cost often Rs 1Cr-Rs 10Cr+ with annual maintenance of Rs 50L-Rs 2Cr in internal resources.",
          discovery:
            "Existing IT relationships and incumbent internal systems.",
          strongestFeatures:
            "- Deeply customised to specific business rules.\n- Full control with no vendor dependency.\n- Already integrated with internal systems.\n- No recurring SaaS fee.",
          weakness:
            "- Cannot adapt quickly to new rule requirements because every change needs an IT sprint.\n- No modern redemption catalogue.\n- Escrow and financial controls are usually absent.\n- Cannot leverage modern API ecosystems or AI.\n- High real TCO once internal IT cost is counted.",
          marketGaps:
            "Gap: These systems are brittle and expensive but feel hard to replace.\nExploit: Lead with a modernisation-without-migration story and coexist alongside legacy systems while new orchestration moves to us.",
          threats:
            "The main threat is inertia: internal teams keep extending legacy systems and delay the modernisation decision.",
          threatLevel: "MEDIUM",
        },
        {
          name: "Antavo (Global enterprise loyalty SaaS)",
          location: "Global Competitor",
          targetCustomer:
            "Enterprise retail, FMCG, and airline loyalty programmes globally. Primary markets: EU, UK, USA, MENA. Typical client: EUR 200M+ revenue brand.",
          pricing:
            "Enterprise SaaS. Global: roughly EUR 80,000-EUR 500,000+ per year.",
          discovery:
            "Gartner Magic Quadrant, Forrester Wave, partner ecosystem, analyst mentions, and enterprise discovery.",
          strongestFeatures:
            "- Recognised Gartner leader in loyalty management.\n- Deep rule engine with many trigger types.\n- Strong enterprise integrations.\n- In-store plus digital loyalty unified.\n- Sustainability and CSR loyalty mechanics.",
          weakness:
            "- Very expensive and out of reach for SME and mid-market.\n- Long sales cycle.\n- No India presence or vertical depth for real estate or BFSI.\n- No escrow or financial liability management.\n- Heavy implementation effort.",
          marketGaps:
            "Gap: Antavo does not serve India's high-growth mid-market because pricing and complexity exclude most buyers.\nExploit: Use Antavo's feature set as a roadmap benchmark while undercutting on price, speed, and finance controls.",
          threats:
            "Antavo's AI Loyalty Cloud can predict churn and auto-optimise rewards. That is a feature gap we need in the next 12-18 months.",
          threatLevel: "HIGH",
        },
        {
          name: "Comarch Loyalty Management (Global enterprise loyalty plus airline and travel)",
          location: "Global Competitor",
          targetCustomer:
            "Airlines, banking, telecom, and large retail loyalty programmes globally, especially in EU and GCC.",
          pricing:
            "Enterprise licence plus implementation. Global: roughly EUR 150,000-EUR 1M+ per year.",
          discovery:
            "Aviation trade events, banking technology conferences, direct enterprise sales, and telecom buying cycles.",
          strongestFeatures:
            "- Strong frequent-flyer and airline loyalty depth.\n- Banking and financial services modules.\n- Highly configurable for large-scale programmes.\n- Strong EU data compliance and governance.",
          weakness:
            "- Very expensive and complex.\n- No India office or India-specific compliance layer.\n- Not suited for SME or fast-growth buyers.\n- Slow to deploy.\n- No escrow or financial liability feature.\n- Legacy UI and weak mobile experience.",
          marketGaps:
            "Gap: Overkill for any company under roughly Rs 500M revenue.\nExploit: Serve BFSI and travel in India that need depth at a fraction of Comarch's cost, with modern UX and India-specific integrations.",
          threats:
            "Composable loyalty architecture and modular APIs could lower Comarch's entry price and threaten us in BFSI and telecom.",
          threatLevel: "HIGH",
        },
        {
          name: "Yotpo Loyalty and Referrals (Global D2C and e-commerce focused)",
          location: "Global Competitor",
          targetCustomer:
            "D2C brands and e-commerce companies globally, especially Shopify and BigCommerce brands with $1M-$50M revenue.",
          pricing:
            "SaaS subscription. Global: about $300-$2,000 per month from SMB to mid-market.",
          discovery:
            "Shopify App Store, Google Ads, D2C communities, and Yotpo partner ecosystem.",
          strongestFeatures:
            "- Tight Shopify and WooCommerce integration.\n- Fast setup.\n- Strong referral engine.\n- SMS and email loyalty built in.\n- Good reviews integration.\n- Strong brand in D2C loyalty.",
          weakness:
            "- Flat earn-and-burn with minimal rule engine depth.\n- No tier-based complex rules.\n- No wallet, no escrow, and no financial controls.\n- Not suited for high-value or non-e-commerce verticals.\n- Limited India presence.",
          marketGaps:
            "Gap: Yotpo is the default for Shopify loyalty but remains surface-level.\nExploit: Target Indian D2C brands that outgrow it and need segmentation, milestones, and a richer redemption value ladder.",
          threats:
            "Yotpo's SMS marketing plus loyalty integration creates a strong channel-native experience. If it adds rule-engine depth and launches properly in India, it becomes a direct D2C threat.",
          threatLevel: "MEDIUM",
        },
        {
          name: "LoyaltyLion (Global e-commerce loyalty)",
          location: "Global Competitor",
          targetCustomer:
            "E-commerce brands on Shopify, Magento, and WooCommerce. Primary markets: UK, US, EU. Typical client: D2C brand with GBP 1M-GBP 50M revenue.",
          pricing:
            "SaaS subscription. Global: about GBP 300-GBP 1,500+ per month.",
          discovery:
            "Shopify App Store, Klaviyo integrations, e-commerce communities, and product-led discovery.",
          strongestFeatures:
            "- Strong Klaviyo and email integration.\n- Engagement rewards for social, reviews, and referrals.\n- Simple setup with good merchant UX.\n- Good e-commerce analytics.\n- Strong in subscription and membership loyalty.",
          weakness:
            "- Very limited rule engine and mostly earn-and-burn.\n- No financial controls or wallet management.\n- Not suitable outside e-commerce.\n- No India product or pricing.",
          marketGaps:
            "Gap: LoyaltyLion is e-commerce only and UK/US-centric with low relevance to India's dominant verticals.\nExploit: Its engagement-reward playbook is useful, but we can apply that thinking to real estate, BFSI, and automotive.",
          threats:
            "Deep Klaviyo integration is a distribution advantage in email-led D2C markets. Stronger CRM integrations could let LoyaltyLion move upstream into mid-market.",
          threatLevel: "MEDIUM",
        },
        {
          name: "Open Loyalty (Global headless and API-first loyalty)",
          location: "Global Competitor",
          targetCustomer:
            "Enterprise and scale-up tech companies building custom loyalty experiences, especially in EU and USA with strong engineering teams.",
          pricing:
            "Open-source core plus enterprise licensing. Global: from free core to $20,000+ per year enterprise packages.",
          discovery:
            "GitHub, developer communities, product-led SEO, and composable commerce ecosystems.",
          strongestFeatures:
            "- Fully headless and API-first.\n- Open-source core reduces vendor lock-in concerns.\n- Strong developer experience and documentation.\n- Highly configurable rule engine.\n- Modern composable architecture.",
          weakness:
            "- Requires significant engineering effort to implement.\n- No out-of-box UI for business users.\n- No pre-built vertical use cases for real estate or BFSI.\n- No managed-service layer for India.\n- No escrow or financial control model.",
          marketGaps:
            "Gap: Open Loyalty assumes an engineering-heavy operating model that most Indian mid-market companies do not have.\nExploit: We are the managed, business-user-configurable alternative with no open-source overhead.",
          threats:
            "Composable architecture and open-source appeal could attract funded startups to build wrappers on top of it, creating indirect competitors.",
          threatLevel: "MEDIUM",
        },
      ],
    },
    detailedGTM: {
      targetGroups: [],
      sheet: {
        title: "GTM STRATEGY — LOYALTY RULE ENGINE",
        targetGroups: [
          {
            title:
              "TARGET GROUP 1 · REAL ESTATE DEVELOPERS\nMid-to-large residential developers · ₹200Cr–₹5,000Cr revenue · Tier 1–2 cities · Salesforce CRM · 500–10,000 units/year",
            sections: [
              {
                title: "🎯 COMPONENT 1: SALES MOTION",
                columns: [
                  "Sales Element",
                  "Detail",
                  "Rationale / Insight",
                  "Objection to Handle",
                  "Objection Response",
                  "Owner",
                  "Timeline",
                  "KPI",
                ],
                rows: [
                  [
                    "Primary motion",
                    "Direct enterprise sales led by a senior relationship manager. Outbound prospecting targeting VP Sales, CMO, and Head of CRM at developers with ₹200Cr+ revenue and a Salesforce CRM deployment.",
                    "Real estate deals are relationship-driven. The buying committee includes CMO (loyalty ROI), Head Collections (TAT improvement), CFO (liability management), and IT (integration). A senior RM who can navigate all four is essential.",
                    "'We already have Xoxoday for vouchers — why do we need another tool?'",
                    "Xoxoday is a voucher fulfilment tool — it has no rule engine, no wallet, no escrow. Show side-by-side: Xoxoday can deliver the reward, but only we can decide who earns it, when, and why. Offer to integrate with Xoxoday.",
                    "Founder / Head of Sales",
                    "Ongoing",
                    "Meetings booked / week",
                  ],
                  [
                    "Deal entry point",
                    "Enter the conversation through the collections or CRM team — not marketing. The collections TAT problem (early-payment incentives) is the fastest path to a signed PO because it has a measurable ₹ ROI that can be quantified in the first meeting.",
                    "Collections TAT is a CFO-visible metric. A 10-day improvement in average payment time on a ₹500Cr receivables book = ₹2.5–5Cr annual interest saving. This single data point justifies the entire annual contract value.",
                    "'How do we know this will actually improve collections TAT?'",
                    "Reference the live deployment: the existing client configured 6 demand-note payment rules in week 1 and saw measurable TAT reduction within 60 days. Offer a 90-day pilot with a specific TAT improvement target agreed upfront.",
                    "Head of Sales + CS",
                    "Month 1–2",
                    "Pilot agreements signed",
                  ],
                  [
                    "Proof of value — pilot structure",
                    "Offer a 90-day paid pilot at ₹3–5L (credited against full ACV if converted). Pilot scope: 3 rules configured (one collection TAT rule, one referral rule, one app-adoption rule). Weekly reporting on points issued, redemption rate, and TAT delta.",
                    "A paid pilot filters serious buyers from browsers. The 3-rule scope is achievable in 2 weeks and produces measurable data within 30 days. Proof of TAT improvement in the pilot becomes the primary case study for the next 5 prospects.",
                    "'We don't have budget for a pilot right now.'",
                    "Reframe: 'A ₹3L pilot that proves ₹2Cr in annual interest savings is not a cost — it is the cheapest due diligence you will ever run.' Offer deferred payment: pilot fee payable at 60 days.",
                    "Head of Sales",
                    "Month 1–3",
                    "Pilots converted to full ACV",
                  ],
                  [
                    "Buying committee strategy",
                    "Run parallel tracks: (a) CMO/Marketing: redemption catalogue, personalised mobile page, referral programme ROI; (b) CFO/Finance: escrow wallet, liability management, accounting integration; (c) CRM/IT: Salesforce integration depth, API documentation, zero-rip-and-replace.",
                    "Real estate enterprise deals stall when one committee member is unsatisfied. Addressing CFO concerns (escrow) and IT concerns (Salesforce integration) in parallel with the marketing story prevents the deal from dying after a marketing champion leaves.",
                    "'Our IT team says the integration will take 6 months.'",
                    "Show the API documentation and the live integration map: 12 Salesforce endpoints, tested and production-proven. The client's IT team reviews the docs — typical integration timeline is 4–6 weeks, not 6 months.",
                    "Head of Sales + Product",
                    "Month 2–4",
                    "Committee sign-offs per deal",
                  ],
                  [
                    "Pricing & commercial",
                    "Year 1 ACV: ₹20–35L for a developer with 5,000–20,000 active members. Includes: all rule engine modules, wallet (cold + ledger), 5 redemption types, Salesforce integration, escrow wallet, admin panel. Payment: 50% upfront + 50% at 90 days. Annual renewal with 10% price escalation clause.",
                    "₹20–35L ACV is below Salesforce Loyalty Management and Capillary — positioning us as the specialist alternative with better vertical fit and faster deployment. The 10% escalation clause is non-negotiable and positions us for ₹25–40L in Year 2.",
                    "'Capillary quoted us ₹15L — can you match that?'",
                    "Capillary at ₹15L is the retail module — they do not have escrow, cold wallet, or Salesforce demand-note integration. Ask: 'Did their quote include the escrow wallet? The accounting integration? The CRM integration for 12 event types?' The comparison breaks down on scope.",
                    "Head of Sales",
                    "Month 1 onwards",
                    "ACV per deal, win rate",
                  ],
                ],
              },
              {
                title: "📣 COMPONENT 2: MARKETING CHANNELS",
                columns: [
                  "Channel",
                  "Tactic / Format",
                  "Content Theme",
                  "Target Persona",
                  "Frequency",
                  "Budget Allocation",
                  "Expected Output",
                  "Measurement",
                ],
                rows: [
                  [
                    "Vertical content — LinkedIn",
                    "Long-form posts and articles authored by the founding team: 'How we reduced collections TAT by 22 days using a loyalty rule engine' · 'The ₹5Cr liability your loyalty programme is hiding from your CFO' · 'Why Xoxoday is not a loyalty programme'",
                    "Financial impact of loyalty. CFO-level risk framing. Competitive positioning vs voucher tools.",
                    "VP Sales, CMO, Head CRM at real estate companies. Also CFOs who follow fintech / proptech content.",
                    "3 posts/week. 1 long-form article/month.",
                    "15% of marketing budget",
                    "500–2,000 impressions per post. 2–4 inbound enquiries/month from LinkedIn.",
                    "Impressions, follower growth, inbound demo requests sourced from LinkedIn",
                  ],
                  [
                    "Industry events — CREDAI & NAREDCO",
                    "Speaking slot or panel participation at CREDAI Natcon, NAREDCO national conference, and regional CREDAI chapter events. Topic: 'The loyalty programme your homebuyers actually want (and what it does to your collections)'. Booth presence at 2 events/year.",
                    "Collections TAT improvement. Referral programme ROI. Customer lifetime value in real estate.",
                    "Founders and heads of sales / marketing at real estate companies. Decision-makers who are actively looking for operational improvement tools.",
                    "2 major events/year + 3–4 chapter events/year.",
                    "25% of marketing budget",
                    "50–100 qualified conversations per event. 5–10 sales meetings booked per event.",
                    "Meetings booked from event. Pipeline generated per event (₹ ACV)",
                  ],
                  [
                    "Case study & ROI calculator",
                    "One published case study from the live client (anonymised or named with permission): specific metrics — collections TAT improvement (days), referral volume (leads generated), points issued vs redeemed ratio, escrow buffer maintained. Accompanied by an interactive ROI calculator ('Enter your receivables book size — we show you what a 10-day TAT improvement is worth').",
                    "Proof of ROI. Specific ₹ impact from a live Indian real estate deployment.",
                    "CMO and CFO who are evaluating the business case. Also used by sales team in every pitch deck.",
                    "Publish once. Update quarterly with new data.",
                    "20% of marketing budget",
                    "Case study viewed by >80% of prospects in pipeline. ROI calculator completed by 30%+ of website visitors.",
                    "Case study downloads. ROI calculator completions. Attribution to closed deals.",
                  ],
                  [
                    "Salesforce partner channel",
                    "Register as a Salesforce ISV partner. List on Salesforce AppExchange. Build relationships with the top 10 Salesforce implementation partners in India (Deloitte Digital, Infosys Salesforce, Accenture, local boutique SIs). Offer a partner referral fee (10–15% of Year 1 ACV) for qualified introductions.",
                    "Salesforce-native loyalty solution. Zero rip-and-replace. Pre-certified integration.",
                    "Salesforce project managers and solution architects at SI firms who recommend tools to real estate clients.",
                    "Partner outreach: monthly. AppExchange: evergreen listing.",
                    "20% of marketing budget",
                    "3–5 partner introductions per quarter by Month 6.",
                    "Partner-sourced pipeline (₹ ACV). AppExchange listing views and demo requests.",
                  ],
                  [
                    "Email nurture — targeted outbound",
                    "Personalised outbound email sequence to a curated list of 200 real estate developers (sourced from CREDAI membership, LinkedIn, MakaanIQ data). Sequence: Email 1 (collections TAT framing) → Email 2 (referral ROI) → Email 3 (CFO risk — escrow) → Email 4 (case study) → Email 5 (demo invite). 5-email sequence over 6 weeks.",
                    "Each email leads with a specific ₹ impact framing — not product features. Subject lines reference known pain points: 'Your collections TAT is costing you ₹X/day'.",
                    "Head of CRM, VP Sales, CMO at target developer companies.",
                    "One sequence per prospect. Ongoing enrichment of list.",
                    "20% of marketing budget",
                    "8–12% reply rate. 3–5% demo conversion from sequence.",
                    "Open rate, reply rate, demo bookings from sequence",
                  ],
                ],
              },
              {
                title: "🗓 COMPONENT 3: 90-DAY LAUNCH SEQUENCE",
                columns: [
                  "Phase",
                  "Days",
                  "Key Activities",
                  "Sales Actions",
                  "Marketing Actions",
                  "Milestone / Gate",
                  "Owner",
                  "Success Signal",
                ],
                rows: [
                  [
                    "Phase 1 — Foundation",
                    "Days 1–30",
                    "· Finalise ICP list of 50 target developers\n· Build ROI calculator and collections TAT one-pager\n· Set up LinkedIn company page and post first 4 articles\n· Identify and brief 2 Salesforce SI partners\n· Register for one CREDAI chapter event in Month 2",
                    "· Book 10 discovery calls with VP Sales / Head CRM at target developers\n· Run collections TAT framing in every call\n· Close at least 1 pilot agreement",
                    "· Publish 3 LinkedIn articles\n· Launch 5-email outbound sequence to 100 prospects\n· Publish ROI calculator on website",
                    "1 pilot agreement signed by Day 30",
                    "Founder + Head Sales",
                    "Pipeline of ₹1Cr+ ACV in active discussion",
                  ],
                  [
                    "Phase 2 — Momentum",
                    "Days 31–60",
                    "· Onboard pilot client — configure 3 rules (collection TAT, referral, app adoption)\n· Begin collecting pilot data (points issued, TAT delta)\n· Attend CREDAI chapter event\n· Publish anonymised pilot early results as a LinkedIn post\n· Begin partner onboarding with 1 Salesforce SI",
                    "· Use pilot data to open 5 new conversations\n· Present pilot progress to 2 prospects who are in evaluation\n· Close 1 full ACV deal from pipeline",
                    "· Share pilot early results as social proof\n· Launch second outbound sequence to 100 new prospects\n· Submit CREDAI Natcon speaking application",
                    "1 full deal signed. Pilot showing measurable TAT improvement.",
                    "Head Sales + CS",
                    "First paying client #2 signed",
                  ],
                  [
                    "Phase 3 — Proof & Scale",
                    "Days 61–90",
                    "· Complete pilot and publish full case study with metrics\n· Present case study at CREDAI event (if speaking slot secured)\n· Activate Salesforce AppExchange listing\n· Onboard first Salesforce SI partner with signed referral agreement\n· Build pipeline to ₹3Cr ACV by Day 90",
                    "· Use case study in every active deal\n· Convert pilot to full ACV\n· Open 3 new deals from partner referrals\n· Target: 3 signed clients and 5+ active evaluations by Day 90",
                    "· Publish full case study (PDF + LinkedIn)\n· Submit AppExchange listing\n· Pitch at CREDAI event\n· PR outreach: PropTech press coverage of case study",
                    "₹3Cr+ pipeline. 1 published case study. 1 SI partner active.",
                    "Founder + Head Sales + Marketing",
                    "2–3 signed clients. SI partner generating first referral.",
                  ],
                ],
              },
              {
                title: "🤝 COMPONENT 4: PARTNERSHIP STRATEGY",
                columns: [
                  "Partner Type",
                  "Specific Partners (Examples)",
                  "What We Offer Them",
                  "What They Offer Us",
                  "Engagement Model",
                  "Revenue Share",
                  "Priority",
                  "90-Day Action",
                ],
                rows: [
                  [
                    "Salesforce Implementation Partners",
                    "Deloitte Digital, Infosys Salesforce Practice, Accenture, Persistent Systems, local boutique SIs (Manras, Sage, Cyntexa)",
                    "A pre-built, production-proven loyalty layer for real estate clients. Reduces their custom development scope. Makes their Salesforce proposal more complete. Adds a recurring SaaS revenue line they can resell.",
                    "Introductions to their real estate developer clients who are already on Salesforce and asking 'what can we do for loyalty'. Credibility via Salesforce partner ecosystem membership.",
                    "Referral agreement: SI introduces us to a qualified prospect. We manage the sale and onboarding. SI receives referral fee on deal close.",
                    "10–15% of Year 1 ACV as referral fee",
                    "P0 — Highest priority",
                    "Sign referral agreements with 2 SIs by Day 45",
                  ],
                  [
                    "PropTech & CRM Consultants",
                    "Independent Salesforce consultants, real estate tech advisors, CRM implementation freelancers who work with mid-size developers",
                    "An additional revenue stream for every real estate client engagement — loyalty is a natural add-on recommendation after CRM implementation. Sales training and co-marketing support.",
                    "Warm introductions at the right moment in a developer's tech journey (post-CRM implementation is the ideal loyalty programme entry point). Trusted voice with the client.",
                    "Referral or white-label arrangement. Consultant recommends us; we manage product and delivery.",
                    "10% of Year 1 ACV",
                    "P1",
                    "Identify 10 target consultants and brief them by Day 60",
                  ],
                  [
                    "Xoxoday / Plum (Reward Fulfilment Partner)",
                    "Xoxoday, Qwikcilver, Pine Labs Rewards, Amazon Business Rewards",
                    "A demand-generation engine: every client who uses us needs a reward fulfilment partner. We recommend and integrate with them — they get new B2B clients from our pipeline.",
                    "Marketplace listing, co-marketing, and a joint 'intelligence + fulfilment' story that positions both products as complementary — turning potential competitive positioning into a distribution advantage.",
                    "Technology integration partnership. Joint GTM: we power the rules, they fulfil the reward. Co-branded one-pager for developer prospects.",
                    "No revenue share — strategic distribution play",
                    "P1",
                    "Approach Xoxoday partnership team by Day 30",
                  ],
                  [
                    "CREDAI & NAREDCO (Industry Associations)",
                    "CREDAI National, CREDAI Mumbai, CREDAI Pune, CREDAI Bengaluru, NAREDCO",
                    "Educational content for their members: webinars on collections TAT improvement, referral programme ROI, loyalty for real estate. We appear as a knowledge partner, not a vendor.",
                    "Access to their member database (2,000+ developers). Speaking slots at national and chapter events. Credibility as an endorsed knowledge partner in the real estate ecosystem.",
                    "Knowledge partner / associate member arrangement. Host 2 webinars/year for CREDAI members. Sponsor one chapter event annually.",
                    "Association membership fee + event sponsorship (₹2–5L/year total)",
                    "P1",
                    "Contact CREDAI chapter heads by Day 20",
                  ],
                ],
              },
              {
                title: "★ TG SUMMARY — REAL ESTATE DEVELOPERS",
                columns: ["Metric", "Detail"],
                rows: [
                  [
                    "ICP in one sentence",
                    "Mid-to-large Indian residential real estate developers (₹200Cr–₹5,000Cr revenue, Tier 1–2 cities, Salesforce CRM, 500–10,000 units/year) who have a collections TAT problem, a referral programme running on Excel, and no loyalty infrastructure.",
                  ],
                  [
                    "Primary entry point",
                    "Collections TAT improvement — quantifiable ₹ ROI in the first meeting. Secondary entry: referral programme automation. CFO story: escrow wallet as liability management.",
                  ],
                  [
                    "90-day goal",
                    "2 signed clients. 1 published case study with specific TAT improvement metrics. ₹3Cr+ active pipeline. 1 Salesforce SI partner generating referrals. Speaking slot at one CREDAI event.",
                  ],
                  [
                    "Year 1 revenue target",
                    "₹60–80L ARR from 3–4 signed real estate clients at ₹15–25L ACV each. Reference client base that unlocks BFSI and automotive conversations.",
                  ],
                  [
                    "Biggest risk",
                    "Long sales cycles (3–6 months) and large buying committees slow revenue recognition. Mitigate: offer a fast-start paid pilot at ₹3–5L to compress the decision timeline.",
                  ],
                  [
                    "Competitive moat for this TG",
                    "No other Indian loyalty SaaS has built demand-note / payment-event rule triggers, escrow wallet, and production-proven Salesforce integration for real estate. This vertical is ours to own — if we move fast enough.",
                  ],
                ],
              },
            ],
          },
          {
            title:
              "TARGET GROUP 2 · BFSI — NBFCs & PRIVATE BANKS\nDigital lenders, housing finance companies, private banks · ₹1,000Cr–₹50,000Cr AUM · 50K–5M customers · Salesforce or SAP CRM",
            sections: [
              {
                title: "🎯 COMPONENT 1: SALES MOTION",
                columns: [
                  "Sales Element",
                  "Detail",
                  "Rationale / Insight",
                  "Objection to Handle",
                  "Objection Response",
                  "Owner",
                  "Timeline",
                  "KPI",
                ],
                rows: [
                  [
                    "Primary motion",
                    "Direct enterprise sales targeting Chief Customer Officer, Head of Retail Banking, and Head of Digital at NBFCs and mid-size private banks. Entry via the retention / collections problem — same financial rigour as real estate, different product context.",
                    "BFSI has the largest loyalty programme budgets in India but the most rigid procurement processes. Entering through a retention or collections efficiency story (not 'we are a loyalty platform') cuts through the vendor noise and reaches the right buyer faster.",
                    "'We already have a loyalty programme through our card partnership / rewards platform.'",
                    "Ask: 'Does your loyalty programme fire rules on EMI payment timing? Does it have a compliance-grade escrow wallet? Can marketing configure a new rule without an IT ticket?' The answer to all three is almost always no — which is the gap we fill.",
                    "Founder + Senior Sales",
                    "Month 2–4",
                    "Discovery calls booked with CCO/Head Digital",
                  ],
                  [
                    "Deal entry point",
                    "Enter through the Head of Collections or the Head of Digital — not the CMO. The EMI on-time payment incentive rule has an immediate, measurable ROI (reduced delinquency rate) that can be quantified before a contract is signed.",
                    "Delinquency reduction of 1% on a ₹5,000Cr loan book = ₹50Cr in reduced NPA provisioning requirement. This is a CFO and MD-level number that dwarfs the platform cost and accelerates approval.",
                    "'Our risk / compliance team will block this — loyalty programmes have regulatory implications for NBFCs.'",
                    "This is where the escrow wallet becomes a selling feature, not a compliance problem. Escrow provides a RBI-aligned liability buffer. Offer to join a compliance call with their legal team — bring escrow documentation and data residency specs.",
                    "Head Sales + Legal support",
                    "Month 2–5",
                    "Compliance team sign-offs per deal",
                  ],
                  [
                    "Proof of value — pilot structure",
                    "BFSI pilot: 60-day paid pilot at ₹4–6L (credited against ACV). Scope: 2 rules configured (EMI on-time reward + app-adoption reward). Track: on-time payment rate delta, app transaction rate delta. Weekly reporting dashboard shared with the sponsor.",
                    "BFSI buyers need quantified proof before committing. A 60-day pilot is fast enough to show statistically significant payment behaviour change in a loan cohort of 5,000+ accounts. This data becomes the deal-closing evidence.",
                    "'We need 6 months of data before we can commit to a full deployment.'",
                    "Propose a staged commitment: pilot → 6-month limited deployment (1 product line) → full roll-out. Each stage has a signed agreement. This gives the client risk-controlled expansion and us a contractual pipeline.",
                    "Head Sales + CS",
                    "Month 3–6",
                    "Pilots converted to staged agreements",
                  ],
                  [
                    "Buying committee strategy",
                    "Four-track approach: (a) CCO/CMO: retention metrics, NPS improvement, cross-sell rate uplift; (b) CFO/Finance: escrow wallet, RBI-aligned liability management, accounting integration; (c) Risk/Compliance: data residency, escrow documentation, audit trail; (d) IT/Digital: API integration with core banking (Finacle, Nucleus), data security.",
                    "BFSI deals die in compliance and IT more often than in commercial negotiations. The escrow wallet and transaction ledger are the primary tools for unlocking Risk/Compliance. The Salesforce/API integration story unlocks IT.",
                    "'Our IT has a 12-month integration backlog — we can't prioritise this.'",
                    "Position as a parallel-track integration: our API sits alongside the existing core banking system — we do not require integration into the CBS. We integrate with the CRM (Salesforce / SAP) layer, which IT already manages. Estimated integration effort: 6–8 weeks.",
                    "Head Sales + Technical Lead",
                    "Month 3–6",
                    "IT sign-offs per deal",
                  ],
                  [
                    "Pricing & commercial — BFSI",
                    "Year 1 ACV: ₹30–80L for an NBFC with 100K–1M members. Includes: full rule engine, wallet, redemption catalogue (5 types), Salesforce/SAP CRM integration, escrow wallet, compliance reporting. Payment: 40% upfront + 30% at 90 days + 30% at 12 months. Annual renewal with 12% price escalation.",
                    "BFSI clients have longer procurement cycles but larger budgets and multi-year relationships. The 3-tranche payment structure aligns with their budget approval timelines. Higher escalation rate (12%) reflects the regulatory value of the escrow and compliance features.",
                    "'Comviva quoted us ₹1.5Cr for a full loyalty platform — you seem much cheaper.'",
                    "Comviva is an enterprise telco platform requiring 18 months to deploy and a dedicated team to operate. We deploy in 8–12 weeks with the client's existing CRM team managing rules. Ask: 'What is your total cost of ownership on the Comviva proposal, including implementation and ongoing IT support?'",
                    "Head Sales",
                    "Month 2 onwards",
                    "ACV per deal, procurement cycle length",
                  ],
                ],
              },
              {
                title: "📣 COMPONENT 2: MARKETING CHANNELS",
                columns: [
                  "Channel",
                  "Tactic / Format",
                  "Content Theme",
                  "Target Persona",
                  "Frequency",
                  "Budget Allocation",
                  "Expected Output",
                  "Measurement",
                ],
                rows: [
                  [
                    "Thought leadership — BFSI-specific",
                    "LinkedIn articles and whitepapers authored by the founding team targeting BFSI pain: '₹50Cr in NPA provisioning your loyalty programme could have prevented' · 'Why your EMI reminder costs more than an EMI incentive' · 'The RBI-aligned loyalty programme: how the escrow wallet changes everything'",
                    "NPA delinquency risk. RBI compliance as a loyalty design principle. Cross-sell rate improvement through loyalty.",
                    "CCO, Head of Retail Banking, Head of Collections, CFO at private banks and NBFCs.",
                    "2 articles/month. 1 whitepaper/quarter.",
                    "20% of marketing budget",
                    "1,000–3,000 LinkedIn impressions per article. 2–3 inbound enquiries/month.",
                    "LinkedIn impressions. Whitepaper downloads. Inbound demo requests.",
                  ],
                  [
                    "BFSI industry events — FIBAC & IBA",
                    "Speaking or panel participation at FIBAC (Federation of Indian Chambers of Commerce & Industry Banking Conference), IBA Annual Banking Technology Conference, and NBFC Summit. Topic: 'Loyalty as a delinquency reduction tool: a data-led approach'.",
                    "Delinquency reduction ROI. RBI compliance of loyalty programmes. Digital banking engagement through loyalty.",
                    "CXO-level BFSI decision-makers who attend industry conferences for peer learning.",
                    "2–3 events/year.",
                    "30% of marketing budget",
                    "30–60 qualified conversations per event. 3–6 sales meetings booked per event.",
                    "Meetings from event. Pipeline (₹ ACV) generated per event.",
                  ],
                  [
                    "Regulatory angle — RBI compliance content",
                    "A dedicated content series: 'Loyalty liability and RBI compliance — what NBFCs need to know before they launch a loyalty programme.' Distributed via LinkedIn, email to NBFC compliance officers, and submitted to NBFC regulatory forums. Positions us as the only loyalty platform that has thought through regulatory compliance.",
                    "RBI prepaid instrument guidelines. Loyalty liability as a balance sheet item. Escrow as compliance infrastructure.",
                    "Chief Compliance Officer, CFO, Head of Risk at NBFCs and cooperative banks.",
                    "1 compliance guide published. Updated annually when RBI guidelines change.",
                    "15% of marketing budget",
                    "Downloads from compliance and risk teams who are typically not reachable via standard sales outreach.",
                    "Compliance guide downloads. Risk/compliance team introductions triggered by content.",
                  ],
                  [
                    "Fintech ecosystem partnerships & PR",
                    "Get featured in Inc42, Fintech Street, and MoneyControl Pro as the loyalty platform designed for regulated financial services. Pitch story: 'The startup solving NBFC loyalty liability with an escrow wallet' — this is a genuinely novel angle in fintech press.",
                    "Product innovation. Regulatory compliance. Financial inclusion through better customer retention.",
                    "BFSI decision-makers who consume fintech media. Also reaches VC and PE investors who influence tech stack decisions at portfolio NBFCs.",
                    "2 PR pitches/month. Target 1 feature placement/quarter.",
                    "15% of marketing budget",
                    "1 major feature placement/quarter. Inbound enquiries from fintech-media-reading BFSI buyers.",
                    "Media placements. Inbound enquiries attributed to PR.",
                  ],
                  [
                    "Direct email — NBFC & bank targeting",
                    "Curated outreach to 300 NBFCs and private banks sourced from RBI registered NBFC list, BSE/NSE listed NBFC filings, and LinkedIn. 6-email sequence over 8 weeks: Email 1 (delinquency framing) → 2 (cross-sell ROI) → 3 (escrow compliance angle) → 4 (whitepaper) → 5 (case study) → 6 (demo invite).",
                    "Each email leads with a regulatory or financial risk framing — compliance officers and CFOs respond to risk language, not feature lists.",
                    "CCO, CFO, Head of Collections, Head of Digital at NBFCs and private banks.",
                    "One sequence per prospect. Ongoing list enrichment.",
                    "20% of marketing budget",
                    "6–10% reply rate. 2–4% demo conversion.",
                    "Open rate, reply rate, demo bookings, pipeline attributed to email.",
                  ],
                ],
              },
              {
                title: "🗓 COMPONENT 3: 90-DAY LAUNCH SEQUENCE",
                columns: [
                  "Phase",
                  "Days",
                  "Key Activities",
                  "Sales Actions",
                  "Marketing Actions",
                  "Milestone / Gate",
                  "Owner",
                  "Success Signal",
                ],
                rows: [
                  [
                    "Phase 1 — Compliance & Credibility Setup",
                    "Days 1–30",
                    "· Draft RBI compliance guide for NBFC loyalty programmes\n· Build BFSI-specific pitch deck (delinquency framing + escrow angle)\n· Identify 50 target NBFCs from RBI registered list\n· Map Salesforce SI partners who serve BFSI clients\n· Register for FIBAC or IBA event",
                    "· Book 5–8 discovery calls with CCO / Head Collections at target NBFCs\n· Lead every call with EMI on-time payment ROI framing\n· Qualify 2 deals for pilot discussion",
                    "· Publish RBI compliance guide on LinkedIn and website\n· Launch 6-email outbound sequence to 150 NBFC prospects\n· Submit FIBAC speaking application",
                    "RBI compliance guide published. 2 BFSI prospects in pilot discussion by Day 30.",
                    "Founder + Head Sales + Legal",
                    "2 BFSI prospects in active pilot discussion",
                  ],
                  [
                    "Phase 2 — First BFSI Pilot",
                    "Days 31–60",
                    "· Onboard first BFSI pilot client — configure EMI on-time rule + app-adoption rule\n· Set up compliance reporting for escrow wallet\n· Begin collecting pilot cohort data\n· Present at FIBAC or IBA event if slot secured\n· Build BFSI-specific integration documentation",
                    "· Use pilot agreement as credibility in 3 new BFSI conversations\n· Target: 1 additional pilot signed by Day 60\n· Open conversations with 2 BFSI-focused Salesforce SIs",
                    "· Publish LinkedIn post: 'We just configured our first EMI loyalty rule for an NBFC — here is what we learned'\n· Submit PR pitch to Inc42 and Fintech Street\n· Publish BFSI integration documentation publicly",
                    "First BFSI pilot live and generating data. PR pitch submitted.",
                    "Head Sales + CS + Engineering",
                    "First BFSI pilot generating data. Second pilot discussion open.",
                  ],
                  [
                    "Phase 3 — Proof & Vertical Expansion",
                    "Days 61–90",
                    "· Complete pilot and extract delinquency + app-adoption data\n· Present pilot results to 3 prospects in pipeline\n· Publish anonymised BFSI case study (with compliance angle)\n· Target: 1 full BFSI deal signed by Day 90\n· Build pipeline to ₹4Cr BFSI ACV",
                    "· Use pilot data in every active BFSI deal\n· Convert pilot to full ACV\n· Open 3 new deals via SI partner referrals\n· Begin outreach to private banks (larger ACV target)",
                    "· Publish BFSI case study\n· PR feature in Inc42 / Fintech Street live\n· Submit content to NBFC compliance forums\n· LinkedIn article on pilot results (anonymised metrics)",
                    "1 BFSI full deal signed. Case study published. ₹4Cr pipeline.",
                    "Founder + Head Sales + Marketing",
                    "1 signed BFSI client. Fintech press coverage. SI partner active.",
                  ],
                ],
              },
              {
                title: "🤝 COMPONENT 4: PARTNERSHIP STRATEGY",
                columns: [
                  "Partner Type",
                  "Specific Partners (Examples)",
                  "What We Offer Them",
                  "What They Offer Us",
                  "Engagement Model",
                  "Revenue Share",
                  "Priority",
                  "90-Day Action",
                ],
                rows: [
                  [
                    "Core Banking & NBFC Tech Vendors",
                    "Nucleus Software, Intellect Design Arena, Finacus, Artoo (NBFC origination), LoanTap (fintech)",
                    "A loyalty layer that their NBFC clients ask for but they do not build. A co-sell story: 'Our platform + your core banking system = complete customer retention infrastructure.'",
                    "Access to their NBFC client base at the point of platform implementation — the optimal loyalty entry moment. Credibility as a technology partner in the NBFC ecosystem.",
                    "Technology integration partnership + referral agreement. Co-marketing: joint case studies and event appearances.",
                    "10% referral fee on Year 1 ACV",
                    "P0",
                    "Contact Nucleus and Finacus partnership teams by Day 20",
                  ],
                  [
                    "Salesforce BFSI Practice Partners",
                    "Deloitte Salesforce Financial Services, Infosys Finacle-Salesforce practice, Accenture BFSI",
                    "A pre-built loyalty module for their BFSI Salesforce deployments. Reduces custom development scope. Adds a differentiated offering to their BFSI practice.",
                    "Introductions to BFSI clients implementing Salesforce Financial Services Cloud — the ideal moment to introduce loyalty infrastructure.",
                    "Referral agreement. Joint solution brief for BFSI Salesforce deployments.",
                    "12% referral fee on Year 1 ACV",
                    "P0",
                    "Brief BFSI Salesforce practice leads at 2 SIs by Day 40",
                  ],
                  [
                    "Payment Gateway Partners",
                    "Razorpay, PayU, Cashfree, CCAvenue",
                    "A loyalty trigger layer on top of their payment events — every payment processed through their gateway can now automatically trigger a loyalty rule. This makes their gateway stickier for NBFC clients.",
                    "Webhook-level payment event integration that allows real-time loyalty rule triggering (EMI on-time rules, payment milestone rules) without CRM dependency. Also: access to their NBFC merchant network as a lead source.",
                    "Technology integration partnership. Co-market to their NBFC merchant base as 'loyalty powered by [Gateway] payment events'.",
                    "No revenue share — strategic data access play",
                    "P1",
                    "Approach Razorpay and Cashfree fintech partnerships by Day 30",
                  ],
                  [
                    "NBFC Industry Bodies (FIDC, MFIN)",
                    "Finance Industry Development Council (FIDC), Microfinance Institutions Network (MFIN), Sa-Dhan",
                    "Educational content and webinars for their member NBFCs: 'How loyalty programmes can reduce NBFC delinquency rates — and stay RBI-compliant.' Knowledge partner positioning.",
                    "Access to FIDC/MFIN member database (500+ NBFCs). Speaking at member events. Regulatory credibility by association with industry bodies.",
                    "Knowledge partner / associate member. Host 1 webinar/quarter for members. Publish 1 compliance guide annually.",
                    "Membership fee (₹1–2L/year)",
                    "P1",
                    "Contact FIDC and MFIN secretariat by Day 25",
                  ],
                ],
              },
              {
                title: "★ TG SUMMARY — BFSI — NBFCs & PRIVATE BANKS",
                columns: ["Metric", "Detail"],
                rows: [
                  [
                    "ICP in one sentence",
                    "NBFCs and private banks with ₹1,000Cr–₹50,000Cr AUM, 50K–5M customers, a delinquency rate they are actively trying to reduce, and a compliance team that will scrutinise every vendor — solved by the escrow wallet.",
                  ],
                  [
                    "Primary entry point",
                    "EMI on-time payment incentive rule — directly reducible to ₹ NPA provisioning saving. Secondary: cross-sell product uptake. CFO/compliance entry: escrow wallet as RBI-aligned liability management.",
                  ],
                  [
                    "90-day goal",
                    "1 signed BFSI pilot (NBFC). 1 published RBI compliance guide. Fintech press coverage in 1 publication. 2 BFSI-focused Salesforce SI partners briefed. ₹4Cr+ active BFSI pipeline.",
                  ],
                  [
                    "Year 1 revenue target",
                    "₹80–150L ARR from 2–3 BFSI clients at ₹30–60L ACV each. BFSI contracts are longer-term (3-year preferred) and higher ACV than real estate — prioritise this vertical once real estate reference is in hand.",
                  ],
                  [
                    "Biggest risk",
                    "Compliance and legal review extends sales cycles to 6–9 months. Mitigate: publish the RBI compliance guide in Month 1, have escrow documentation ready for Day 1 of any compliance review, and offer a staged commitment structure.",
                  ],
                  [
                    "Competitive moat for this TG",
                    "No Indian loyalty platform has positioned on RBI-compliant escrow wallet + delinquency reduction ROI. This framing is unique and defensible. The risk: Comviva or a BSS vendor could add loyalty features — but their 18-month deployment timelines make them non-competitive for NBFCs who want results in 90 days.",
                  ],
                ],
              },
            ],
          },
          {
            title:
              "TARGET GROUP 3 · AUTOMOTIVE DEALER GROUPS\nOEM franchise dealer networks & large multi-brand dealer groups · ₹500Cr+ dealer revenue · 500+ vehicles/year · CDK/Dealertrack DMS",
            sections: [
              {
                title: "🎯 COMPONENT 1: SALES MOTION",
                columns: [
                  "Sales Element",
                  "Detail",
                  "Rationale / Insight",
                  "Objection to Handle",
                  "Objection Response",
                  "Owner",
                  "Timeline",
                  "KPI",
                ],
                rows: [
                  [
                    "Primary motion",
                    "Two-track approach: (a) Top-down via OEM corporate — if the OEM mandates or recommends a loyalty platform, their entire dealer network becomes the target market simultaneously; (b) Bottom-up via large dealer groups — a single dealer group with 20–50 dealerships is an enterprise account worth ₹20–40L ACV.",
                    "The OEM track has a long runway (12–18 months to influence) but exponential scale. The dealer group track is faster (3–5 months) and generates earlier revenue. Run both in parallel from Day 1 — do not wait for OEM mandate before approaching dealer groups.",
                    "'The OEM has their own loyalty programme / manufacturer warranty.'",
                    "OEM manufacturer warranty is not a loyalty programme — it is a contractual obligation. Our platform sits alongside it: we incentivise service visits, upsells, insurance renewals, and referrals. Ask: 'Does your OEM loyalty programme fire a rule when a customer pays for accessories on delivery day? Ours does.'",
                    "Founder + Head Sales",
                    "Month 1–6",
                    "OEM introductions + dealer group deals",
                  ],
                  [
                    "Deal entry point",
                    "Enter through the Head of Aftersales or the Dealer Principal — not the sales manager. Aftersales revenue (service + parts + insurance) has 30–40% gross margin vs 3–5% on vehicle sales. A loyalty programme that brings customers back for service is the highest-ROI investment a dealership can make.",
                    "A dealer who loses a service customer to a multi-brand workshop loses ₹5,000–15,000 per service visit. At 500 customers/month, even a 10% retention improvement = ₹2.5–7.5L additional monthly aftersales revenue. This justifies the platform cost in the first month.",
                    "'We already have an OEM loyalty card / stamp card for service.'",
                    "OEM loyalty cards are paper-based or basic app-stamp — they do not have a rule engine, a wallet, or a redemption catalogue. Ask: 'Can your current loyalty system automatically give a customer 2,000 points when they bring in their car on time for the first service AND book through your app? Ours does.' Stamp cards do not trigger rules.",
                    "Head Sales + CS",
                    "Month 1–4",
                    "Dealer group pilot agreements",
                  ],
                  [
                    "Proof of value — pilot structure",
                    "Automotive pilot: 90-day paid pilot at ₹3–5L. Scope: 2 rules (first-service capture rule + app-based booking rule). Track: first-service visit capture rate (% of new vehicle buyers who return to the dealer for first service), app booking adoption rate. Compare to pre-pilot baseline.",
                    "First-service capture rate is a metric every dealership tracks — and most know it is below 50%. A loyalty programme that provably improves it from 45% to 60% in 90 days generates ₹3–8L additional aftersales revenue per month — a clear positive ROI for the pilot fee.",
                    "'We don't have a mobile app for customers — how would the loyalty programme reach them?'",
                    "We provide the mobile redemption interface — the dealer does not need to build an app. We deploy a lightweight progressive web app (PWA) or integrate with an existing dealer app within 2–3 weeks. This is not a blocker.",
                    "Head Sales + Product",
                    "Month 2–5",
                    "First-service capture rate delta in pilot",
                  ],
                  [
                    "Buying committee — automotive",
                    "Three-track: (a) Dealer Principal / CEO: ROI on aftersales revenue retention, total programme cost vs revenue uplift; (b) Head of Aftersales: first-service capture, service booking adoption, CSI improvement; (c) IT/DMS Admin: DMS integration (CDK/Dealertrack), data sync requirements.",
                    "Dealer Principals are P&L owners — they respond to revenue and margin, not features. Head of Aftersales is the day-to-day champion. IT/DMS Admin is the integration gatekeeper — pre-building DMS integration documentation removes the last technical objection.",
                    "'Our DMS (CDK/Dealertrack) doesn't have an API for loyalty integration.'",
                    "We integrate at the CRM layer (Salesforce/SAP), not the DMS layer — we pull service job card events from the CRM, which the DMS already syncs to. This bypasses the DMS integration question entirely. If the dealer uses a modern DMS with REST APIs, we can connect directly — show the API documentation.",
                    "Head Sales + Technical Lead",
                    "Month 3–6",
                    "DMS integration sign-offs",
                  ],
                  [
                    "Pricing — automotive",
                    "Dealer group (20–50 dealerships): ₹15–30L ACV. OEM-level deployment (500+ dealerships): ₹80–200L ACV. Single-dealer pilot: ₹3–5L. Annual renewal with 10% price escalation. Volume discount: 15% off ACV for groups with 50+ dealerships.",
                    "Automotive dealer groups are price-sensitive but ROI-driven. Anchor on the aftersales revenue uplift (₹2–7L/month) vs the platform cost (₹1.5–2.5L/month). The ROI case is 2–3x in Month 1 — make this the opening number in every commercial conversation.",
                    "'This seems expensive for what is essentially a loyalty card.'",
                    "A loyalty card costs ₹50K/year to print and manage and generates zero data, no rule triggers, and no redemption intelligence. Our platform costs ₹1.5–2.5L/month and generates ₹2–7L additional aftersales revenue per month. Ask: 'Would you like to see the ROI model?'",
                    "Head Sales",
                    "Month 2 onwards",
                    "ACV per dealer group, pilot conversion rate",
                  ],
                ],
              },
              {
                title: "📣 COMPONENT 2: MARKETING CHANNELS",
                columns: [
                  "Channel",
                  "Tactic / Format",
                  "Content Theme",
                  "Target Persona",
                  "Frequency",
                  "Budget Allocation",
                  "Expected Output",
                  "Measurement",
                ],
                rows: [
                  [
                    "LinkedIn — aftersales ROI content",
                    "Articles and posts authored by the founding team: 'The 40% gross margin revenue your dealership is losing to multi-brand workshops — and how to stop it' · 'Why a stamp card is not a loyalty programme' · 'First-service capture: the metric that predicts your 5-year aftersales revenue'",
                    "Aftersales revenue retention. Multi-brand workshop attrition. CSI improvement through loyalty.",
                    "Dealer Principals, Heads of Aftersales, OEM regional managers, auto industry analysts.",
                    "3 posts/week. 1 long-form article/month.",
                    "15% of marketing budget",
                    "800–2,500 impressions per post. 1–3 inbound enquiries/month from automotive decision-makers.",
                    "LinkedIn impressions, follower growth from auto sector, inbound demo requests.",
                  ],
                  [
                    "Automotive industry events — SIAM, FADA, Auto Expo",
                    "Speaking slot at FADA (Federation of Automobile Dealers Associations) annual dealer conference and SIAM annual convention. Topic: 'Loyalty as a first-service capture tool: data from the field.' Booth at Auto Expo (even-year). Regional FADA chapter events.",
                    "First-service capture rate improvement. Aftersales revenue retention. Dealer digital transformation.",
                    "Dealer Principals and Heads of Aftersales who attend FADA events. OEM product / aftersales heads at SIAM.",
                    "2 major events/year + 3 regional events/year.",
                    "30% of marketing budget",
                    "40–80 qualified conversations per event. 4–8 sales meetings booked.",
                    "Meetings booked. Pipeline (₹ ACV) per event.",
                  ],
                  [
                    "DMS and auto tech vendor co-marketing",
                    "Co-author a joint guide with a DMS or auto CRM vendor: 'The complete aftersales technology stack for a modern dealership — DMS + CRM + loyalty.' Distribute through their dealer network newsletter and at joint events.",
                    "Technology integration story. End-to-end dealer tech ecosystem. Loyalty as the missing layer.",
                    "IT managers and DMS administrators at large dealer groups who influence technology purchase decisions.",
                    "1 joint guide published. Updated annually.",
                    "15% of marketing budget",
                    "Reaches IT and DMS admin personas who are otherwise hard to reach via sales. Positions us as ecosystem player, not standalone vendor.",
                    "Guide downloads. Dealer introductions from DMS vendor.",
                  ],
                  [
                    "OEM regional manager outreach",
                    "Identify OEM regional and zonal managers who oversee dealer performance metrics (CSI, aftersales revenue per dealer, market share). Brief them on the platform's ability to improve CSI scores and first-service capture — two metrics that OEM regional managers are measured on.",
                    "OEM performance metrics improvement. How loyalty drives CSI score uplift. Dealer network competitive differentiation.",
                    "OEM Regional Sales Manager, OEM Aftersales Head, OEM Customer Experience Manager.",
                    "Monthly outreach to 5–10 OEM regional contacts.",
                    "20% of marketing budget",
                    "OEM regional manager endorsement can trigger dealer group adoption across an entire region. 1 OEM champion = access to 50–200 dealers.",
                    "OEM regional manager meetings. OEM-endorsed dealer introductions.",
                  ],
                  [
                    "Automotive trade press — AutoPunditz, Autocar Pro",
                    "Pitch a bylined article or media feature: 'The dealership loyalty platform designed around first-service capture — not just points.' Target Autocar Pro, ET Auto, and AutoPunditz which are read by both dealer principals and OEM product teams.",
                    "Product innovation in automotive retail. Aftersales technology modernisation. Digital transformation of dealer loyalty.",
                    "Dealer Principals and OEM decision-makers who consume trade press.",
                    "2 PR pitches/month. Target 1 feature/quarter.",
                    "20% of marketing budget",
                    "1 major feature/quarter. Inbound from media-reading automotive buyers.",
                    "Media placements. Inbound demo requests attributed to press.",
                  ],
                ],
              },
              {
                title: "🗓 COMPONENT 3: 90-DAY LAUNCH SEQUENCE",
                columns: [
                  "Phase",
                  "Days",
                  "Key Activities",
                  "Sales Actions",
                  "Marketing Actions",
                  "Milestone / Gate",
                  "Owner",
                  "Success Signal",
                ],
                rows: [
                  [
                    "Phase 1 — Vertical Setup",
                    "Days 1–30",
                    "· Build automotive-specific pitch deck (aftersales revenue ROI framing)\n· Build first-service capture rate ROI calculator\n· Identify 30 large dealer groups (20+ dealerships) via FADA member list\n· Identify 3 target OEMs for top-down approach\n· Register for FADA annual dealer conference",
                    "· Book 8–10 discovery calls with Dealer Principals and Heads of Aftersales\n· Lead every call with aftersales revenue retention framing\n· Qualify 2 dealer groups for pilot discussion",
                    "· Publish first LinkedIn article on first-service capture\n· Launch outbound email sequence to 100 dealer group contacts\n· Submit FADA speaking application",
                    "2 dealer groups in pilot discussion by Day 30. FADA speaking application submitted.",
                    "Founder + Head Sales",
                    "2 dealer groups in active pilot discussion",
                  ],
                  [
                    "Phase 2 — First Automotive Pilot",
                    "Days 31–60",
                    "· Onboard first dealer group pilot — configure first-service capture rule + app booking rule\n· Begin tracking first-service visit rate vs pre-pilot baseline\n· Attend FADA regional event and present\n· Brief 1 OEM regional manager on the platform\n· Build DMS integration documentation",
                    "· Use pilot progress to open 3 new dealer group conversations\n· Target: 1 additional pilot or LOI signed by Day 60\n· Begin OEM top-down outreach (1 OEM zonal manager meeting booked)",
                    "· Publish LinkedIn post on pilot early observations (anonymised)\n· Pitch Autocar Pro / ET Auto media feature\n· Publish DMS integration guide on website",
                    "First automotive pilot live. Media pitch submitted. OEM meeting booked.",
                    "Head Sales + CS + Engineering",
                    "Pilot generating data. Media interest. OEM conversation open.",
                  ],
                  [
                    "Phase 3 — Proof & Dealer Network Expansion",
                    "Days 61–90",
                    "· Complete pilot and publish first-service capture rate improvement data\n· Present at FADA event (if speaking slot confirmed)\n· Target: 1 full dealer group deal signed\n· Open conversation with 1 OEM aftersales head\n· Build automotive pipeline to ₹3Cr ACV",
                    "· Convert pilot to full dealer group ACV\n· Open 3 new deals from OEM regional referrals\n· Target: 2 signed dealer groups and 1 OEM conversation active by Day 90",
                    "· Publish automotive case study\n· PR feature in Autocar Pro or ET Auto live\n· FADA event presentation delivered\n· OEM co-marketing brief proposed",
                    "1 dealer group full deal signed. Case study published. OEM conversation active.",
                    "Founder + Head Sales + Marketing",
                    "1 signed dealer group client. Press coverage. OEM interest confirmed.",
                  ],
                ],
              },
              {
                title: "🤝 COMPONENT 4: PARTNERSHIP STRATEGY",
                columns: [
                  "Partner Type",
                  "Specific Partners (Examples)",
                  "What We Offer Them",
                  "What They Offer Us",
                  "Engagement Model",
                  "Revenue Share",
                  "Priority",
                  "90-Day Action",
                ],
                rows: [
                  [
                    "DMS & Dealer CRM Vendors",
                    "CDK Global India, Dealertrack, DealersApp, AutosoftDMS, Tata Motors' proprietary dealer system",
                    "A loyalty layer that complements their DMS — service job card closures become loyalty triggers. Their DMS clients get a retention tool they are asking for but that the DMS does not provide.",
                    "Access to their dealer client network at the moment of DMS upgrade or implementation. Co-sell positioning: 'Complete dealer tech stack: DMS + loyalty.'",
                    "Technology integration + referral partnership. Joint marketing: co-authored dealer tech guide. Revenue share on referrals.",
                    "10% referral fee on Year 1 ACV",
                    "P0",
                    "Contact CDK India and DealersApp partnership teams by Day 20",
                  ],
                  [
                    "OEM Aftersales & Digital Teams",
                    "Maruti Suzuki True Value, Hyundai Motor India Aftersales, Tata Motors Connected Vehicles, Mahindra Automotive, Honda Cars India",
                    "A configurable loyalty platform that the OEM can recommend or mandate for dealer network aftersales improvement — improving OEM-level CSI scores across the dealer network without the OEM building the platform themselves.",
                    "OEM mandate or recommendation reaches their entire dealer network simultaneously — 500–3,000 dealerships. OEM credibility dramatically shortens individual dealer sales cycles.",
                    "OEM partnership: pilot with 5 dealers, OEM-approved platform status, inclusion in OEM dealer technology toolkit. Not an exclusive arrangement.",
                    "Revenue share: 5% of dealer ACV paid to OEM foundation / CSR fund (not to OEM directly — avoids regulatory issues)",
                    "P0 — Long runway, highest scale",
                    "Book meeting with OEM Aftersales Digital Head at 2 OEMs by Day 40",
                  ],
                  [
                    "Insurance Partners — Dealer Channel",
                    "HDFC Ergo, Bajaj Allianz, ICICI Lombard, Tata AIG (all with strong dealer channel networks for motor insurance)",
                    "A loyalty integration that turns insurance renewal into a dealership loyalty rule — every insurance renewal through the dealer earns the customer loyalty points. This makes dealer-channel insurance renewal more attractive vs direct renewal.",
                    "Access to their dealer partner network for co-marketing the loyalty-insurance renewal integration. Potential co-branded campaign: 'Renew through your dealer — earn loyalty points.'",
                    "Co-marketing partnership. Shared campaign for 'renew through dealer + earn points'. No revenue share — mutual distribution benefit.",
                    "No revenue share — joint distribution play",
                    "P1",
                    "Contact HDFC Ergo and Bajaj Allianz dealer partnership teams by Day 35",
                  ],
                  [
                    "FADA (Federation of Automobile Dealers Associations)",
                    "FADA National, FADA State Chapters (Maharashtra, Karnataka, Tamil Nadu)",
                    "Educational webinars and content for FADA member dealers: 'How loyalty drives first-service capture and aftersales revenue — data from Indian dealerships.' Knowledge partner positioning.",
                    "Access to 15,000+ FADA member dealerships. Speaking at FADA national and chapter events. Credibility as an industry-endorsed knowledge partner.",
                    "Knowledge partner / associate member. 1 webinar/quarter for FADA members. Sponsorship at 1 chapter event/year.",
                    "FADA membership + sponsorship (₹2–4L/year)",
                    "P1",
                    "Contact FADA national secretariat by Day 15",
                  ],
                ],
              },
              {
                title: "★ TG SUMMARY — AUTOMOTIVE DEALER GROUPS",
                columns: ["Metric", "Detail"],
                rows: [
                  [
                    "ICP in one sentence",
                    "Automotive dealer groups with 20–50 dealerships or ₹500Cr+ annual revenue where the Head of Aftersales is losing 35–40% of service revenue to multi-brand workshops and has no automated loyalty mechanism to bring customers back.",
                  ],
                  [
                    "Primary entry point",
                    "First-service capture rate improvement — framed as ₹2–7L additional aftersales revenue per month. Secondary: insurance renewal through dealer channel. OEM track: CSI score improvement across the dealer network.",
                  ],
                  [
                    "90-day goal",
                    "1 signed dealer group (20+ dealerships). 1 first-service capture case study with before/after data. FADA speaking slot secured. 1 OEM regional manager conversation open. ₹3Cr+ automotive pipeline.",
                  ],
                  [
                    "Year 1 revenue target",
                    "₹50–80L ARR from 2–3 dealer group clients at ₹15–30L ACV each. OEM-level deal (if signed) would contribute ₹80–200L ACV and be the largest single deal in Year 1.",
                  ],
                  [
                    "Biggest risk",
                    "OEM mandate is slow and uncertain — if we wait for an OEM deal, we delay revenue by 12–18 months. Dealer groups are the primary revenue target. OEM is the scale multiplier — treat it as a bonus, not a plan.",
                  ],
                  [
                    "Competitive moat for this TG",
                    "No Indian loyalty SaaS has built aftersales-specific rule triggers (first-service capture, DMS job card closure, insurance renewal through dealer). The automotive vertical is as unaddressed as real estate was — and the aftersales ROI story is equally compelling. First-mover advantage here is a 12–18 month window before a larger platform notices.",
                  ],
                ],
              },
            ],
          },
          {
            title: "MASTER GTM SUMMARY — YEAR 1 TARGETS ACROSS ALL 3 TGs",
            sections: [
              {
                title: "Master GTM Summary",
                columns: ["Metric", "Detail"],
                rows: [
                  [
                    "Combined Year 1 ARR target",
                    "₹1.8–3.0Cr ARR from 7–10 signed clients across 3 verticals: Real Estate (3–4 clients, ₹60–80L), BFSI (2–3 clients, ₹80–150L), Automotive (2–3 dealer groups, ₹50–80L). OEM automotive deal if secured adds ₹80–200L.",
                  ],
                  [
                    "Priority sequencing",
                    "Month 1–3: Double down on Real Estate (fastest sales cycle, strongest product fit, live reference). Month 3–6: Open BFSI in parallel. Month 4–8: Launch automotive. Do not spread sales effort across all 3 verticals in Month 1.",
                  ],
                  [
                    "Shared GTM infrastructure",
                    "All 3 TGs share: (a) Salesforce SI partner channel — the same SI partners serve all three verticals; (b) LinkedIn thought leadership — vertical-specific content from one founding team voice; (c) ROI calculator template — adapted per vertical; (d) Escrow wallet as the CFO-level differentiator across all 3 verticals.",
                  ],
                  [
                    "Single most important GTM action in Month 1",
                    "Publish one ROI case study from the live real estate client — with specific ₹ metrics (collections TAT improvement, referral leads generated, points issued vs redeemed). This single asset will be used in every sales conversation, every LinkedIn post, every event pitch, and every partner brief across all 3 TGs for the next 6 months.",
                  ],
                  [
                    "Year 1 hiring implication",
                    "GTM requires: 1 senior sales hire (enterprise B2B, ideally with BFSI or real estate vertical experience) by Month 2; 1 customer success hire by Month 3 (to free the founding team from onboarding); 1 marketing/content hire by Month 4 (to sustain content velocity). Do not hire before revenue validates the channel.",
                  ],
                ],
              },
            ],
          },
        ],
      },
    },
    detailedMetrics: {
      clientImpact: [
        {
          metric: "Collections TAT (Days to Payment)",
          baseline: "28–45 days average after demand note raised",
          withSnag: "14–25 days average with incentivised early payment",
          claim: "35–45% reduction in TAT (e.g., 38 days → 22 days)",
        },
        {
          metric: "Referral Lead Volume",
          baseline:
            "3–8% of total leads from referrals (manual, Excel-tracked, slow to pay out)",
          withSnag:
            "12–22% of total leads from referrals (automated, real-time, instant point credit)",
          claim:
            "150–200% increase in referral lead volume (e.g., 15 leads/month → 38 leads/month)",
        },
        {
          metric: "EMI / Payment On-Time Rate",
          baseline:
            "62–72% of customers pay on or before due date (without incentive)",
          withSnag:
            "78–88% pay on or before due date (with tiered early-payment incentive)",
          claim: "+12–18 percentage points improvement (e.g., 68% → 84%)",
        },
        {
          metric: "App Adoption Rate (Digital Channel Shift)",
          baseline:
            "18–28% of customers use the app for transactions (without incentive)",
          withSnag:
            "45–65% of customers use the app within 90 days of loyalty launch",
          claim:
            "+25–35 percentage points app adoption (e.g., 22% → 54% in 90 days)",
        },
        {
          metric: "Loyalty Programme Redemption Rate",
          baseline:
            "8–18% redemption rate (without personalised redemption and mobile page)",
          withSnag:
            "35–55% redemption rate (with personalised mobile redemption page and encashment)",
          claim: "+200–300% improvement in redemption rate (e.g., 12% → 44%)",
        },
        {
          metric: "Customer Referral Conversion Rate",
          baseline:
            "18–25% conversion rate on referral leads (untracked, manually managed)",
          withSnag:
            "32–45% conversion rate on loyalty-programme referral leads",
          claim:
            "+60–80% improvement in referral conversion rate (e.g., 20% → 34%)",
        },
        {
          metric:
            "Aftersales Revenue Per Vehicle (Automotive — Service Retention)",
          baseline: "₹8,000–₹14,000 per vehicle per year (without loyalty)",
          withSnag:
            "₹13,000–₹22,000 per vehicle per year (with loyalty-driven service retention)",
          claim:
            "+55–65% increase in aftersales revenue per vehicle (e.g., ₹11,000 → ₹18,000/vehicle/year)",
        },
        {
          metric: "Cross-Sell Product Uptake Rate (BFSI)",
          baseline:
            "8–14% of customers take a second product within 12 months (without incentive)",
          withSnag:
            "18–28% of customers take a second product within 12 months (with cross-sell loyalty rule)",
          claim: "+80–100% improvement in cross-sell rate (e.g., 11% → 22%)",
        },
        {
          metric: "NPS Score Improvement",
          baseline:
            "NPS of 28–42 (industry average for real estate and BFSI without active loyalty)",
          withSnag:
            "NPS of 52–68 (with structured loyalty programme active for 6+ months)",
          claim: "+20–30 NPS points improvement (e.g., NPS 35 → NPS 58)",
        },
        {
          metric: "Customer Lifetime Value (CLV) Uplift",
          baseline:
            "CLV baseline: ₹2.5L–₹8L (real estate); ₹45,000–₹1.8L (BFSI); ₹18,000–₹55,000 (automotive aftersales)",
          withSnag:
            "CLV with loyalty: +25–40% above baseline across all verticals",
          claim:
            "+25–40% CLV improvement (e.g., ₹3.2L → ₹4.5L per homebuyer; ₹65,000 → ₹88,000 per NBFC customer)",
        },
      ],
      businessTargets: [
        {
          metric: "Monthly Active Loyalty Members (MALMs) [NORTH STAR] ★",
          definition:
            "Members who earn or redeem ≥1 point in the month. The headline metric of programme health.",
          d30Current:
            "500–1,000 per client (driven by CRM-synced member creation + manual rule triggering)",
          d30Phase1:
            "1,200–2,000 per client (push notifications drive activation; onboarding playbook accelerates member creation)",
          m3Current:
            "2,000–4,500 per client (organic growth as word spreads and referral rules activate more members)",
          m3Phase1:
            "4,500–8,000 per client (analytics dashboard shows which rules drive MALMs → admin doubles down on what works)",
        },
        {
          metric: "New Members Enrolled",
          definition:
            "Total new loyalty programme members registered in the period. Measures programme onboarding velocity.",
          d30Current: "200–600 (manual CRM sync; limited by onboarding speed)",
          d30Phase1:
            "500–1,200 (onboarding playbook reduces setup time by 40%; more members enrolled in first batch)",
          m3Current:
            "800–2,500 (referral rules kick in; members recruit members)",
          m3Phase1:
            "1,800–4,000 (analytics shows which referral rules work; admin doubles down; push notifications accelerate referral action)",
        },
        {
          metric: "Activation Rate (% of enrolled who earn first points)",
          definition:
            "Percentage of enrolled members who earn their first loyalty points within 14 days of enrolment.",
          d30Current:
            "35–55% (no push notification; members forget the programme exists)",
          d30Phase1:
            "60–78% (push notification on enrolment + rule-fire notification drives first earn within 48 hours)",
          m3Current:
            "45–65% (stabilises as programme matures; some enrolled members are slow starters)",
          m3Phase1:
            "68–82% (analytics identifies low-activation segments; admin creates targeted rules to activate them)",
        },
        {
          metric: "Rules Configured & Live",
          definition:
            "Total number of active loyalty rules in the system per client. More rules = more earning moments = more reasons to engage.",
          d30Current:
            "3–6 rules (limited by manual onboarding; no test mode; admin cautious about untested rules)",
          d30Phase1:
            "6–10 rules (rule test mode removes fear of live errors; onboarding playbook provides templates)",
          m3Current:
            "8–15 rules (as admin gains confidence; vertical rule templates fully used)",
          m3Phase1:
            "12–20 rules (analytics shows which rules drive MALMs; admin adds rules confidently based on data)",
        },
        {
          metric: "Points Issued per Member per Month",
          definition:
            "Average loyalty points earned per active member per month. Measures whether the earning mechanics are set at the right level.",
          d30Current:
            "800–2,500 pts/member/month (depends on transaction frequency and rule density)",
          d30Phase1:
            "1,200–3,200 pts/member/month (more rules = more earning moments per member)",
          m3Current:
            "1,500–4,000 pts/member/month (milestones and time-based rules add to base transaction earn)",
          m3Phase1:
            "2,000–5,500 pts/member/month (analytics shows earn rate by segment; admin optimises for highest-value segments)",
        },
        {
          metric: "Redemption Rate (Points Redeemed / Points Issued)",
          definition:
            "Percentage of issued points that are redeemed in the same period. Target: 30–50%. Health indicator of redemption side.",
          d30Current:
            "15–28% (redemption catalogue is live but no personalisation analytics)",
          d30Phase1:
            "22–38% (onboarding playbook helps admin configure more relevant redemption items from Day 1)",
          m3Current:
            "28–45% (members discover the catalogue; encashment drives high redemption)",
          m3Phase1:
            "38–55% (analytics shows which redemption items are used; admin curates a higher-relevance catalogue)",
        },
        {
          metric: "Monthly Recurring Revenue (MRR) [Internal]",
          definition:
            "Our recurring software subscription revenue per month. Primary commercial health metric.",
          d30Current: "₹1.5–3L (1 client at ₹18–36L ACV = ₹1.5–3L/month)",
          d30Phase1:
            "₹1.5–3L (same first client; Phase 1 roadmap does not add revenue in first 30 days)",
          m3Current:
            "₹4–8L (2–3 clients signed by Month 3; pilots converting to full ACV)",
          m3Phase1:
            "₹6–12L (faster pilot conversion because analytics proves ROI faster; client #3 signs sooner)",
        },
        {
          metric: "Customer Acquisition Cost (CAC) [Internal]",
          definition:
            "Total sales and marketing cost to acquire one signed client. Target: ₹3–8L CAC in Year 1.",
          d30Current:
            "₹5–12L per client (high founder time; no case study; every deal starts from cold)",
          d30Phase1:
            "₹4–9L per client (onboarding playbook reduces CS time per deal; partner channel begins contributing)",
          m3Current:
            "₹3–7L per client (reference client provides social proof; fewer calls to close)",
          m3Phase1:
            "₹2–5L per client (analytics dashboard creates publishable ROI report, accelerating deal cycles)",
        },
        {
          metric:
            "Client Onboarding Time (Days from contract to first rule live)",
          definition:
            "Calendar days from signed contract to first live loyalty rule generating points. Target: ≤21 days.",
          d30Current:
            "28–45 days (no playbook; engineering-heavy; each client requires custom configuration effort)",
          d30Phase1:
            "14–22 days (onboarding playbook provides templates; rule test mode allows faster admin configuration)",
          m3Current:
            "25–40 days (no playbook; complexity grows as more rules are added; engineering bottlenecks)",
          m3Phase1:
            "12–18 days (playbook matures; templates cover 80% of common rule configurations; admin self-serves most of setup)",
        },
        {
          metric: "Net Revenue Retention (NRR) [Internal]",
          definition:
            "Revenue retained from existing clients after accounting for expansion, contraction, and churn. Target: 110–125% NRR.",
          d30Current:
            "Unable to measure (only 1 client; no renewal data yet; 30 days is too early)",
          d30Phase1:
            "Unable to measure (insufficient data in 30 days regardless of Phase 1 status)",
          m3Current:
            "90–105% projected NRR (first renewal approaching; some expansion possible)",
          m3Phase1:
            "100–115% projected NRR (analytics dashboard gives client proof of ROI before renewal)",
        },
        {
          metric: "Escrow Coverage Ratio (Client financial health metric)",
          definition:
            "Ratio of client's escrow wallet balance to 25% of total outstanding loyalty points liability. Must stay ≥1.0x at all times.",
          d30Current:
            "1.0–1.3x (admin manually monitors; no automated alert; risk of dipping below 1.0x)",
          d30Phase1:
            "1.2–1.5x (onboarding playbook trains admin on escrow management; better initial setup)",
          m3Current:
            "1.0–1.2x (as more points are issued, maintaining the ratio requires active monitoring)",
          m3Phase1:
            "1.3–1.8x (automated escrow health monitoring — alert fires when ratio approaches 1.1x; admin tops up proactively)",
        },
      ],
      sheet: {
        title: "LOYALTY RULE ENGINE — METRICS",
        sections: [
          {
            title:
              "PART A — CLIENT IMPACT METRICS | 10 metrics your clients track after going live | For landing pages and business case",
            columns: [],
            rows: [],
          },
          {
            title:
              "Purpose: These are the metrics clients measure to prove ROI of the loyalty programme — and the numbers we publish on landing pages to demonstrate product impact. Figures are representative ranges based on industry benchmarks and the product's live deployment data.",
            columns: [],
            rows: [],
          },
          {
            title: "Client Impact Metrics",
            columns: [
              "Metric Name",
              "What It Measures (One-liner)",
              "Before (Baseline)",
              "After (With Platform)",
              "Impact Range",
              "Feature That Drove It & How",
              "Vertical",
              "Tracking Frequency",
            ],
            rows: [
              [
                "Collections TAT\n(Days to Payment)",
                "Average number of days between a demand note being raised and the customer making full payment. Directly impacts cash flow and interest costs on outstanding receivables.",
                "28–45 days average after demand note raised",
                "14–25 days average with incentivised early payment",
                "35–45% reduction in TAT\n(e.g., 38 days → 22 days)",
                "Transaction Events Rules — rules fire the moment a demand note is raised and award tiered points (6,000 / 5,000 / 4,000) for payment within 5 / 10 / 20 days. The time-sensitive incentive creates urgency that phone calls cannot. Every ₹10Cr outstanding = ₹1.5–2.5L interest saving per day of TAT improvement.",
                "Real Estate",
                "Weekly",
              ],
              [
                "Referral Lead Volume",
                "Number of new sales leads generated through the existing customer referral programme per month. Measures the loyalty programme's ability to turn satisfied customers into an active sales channel.",
                "3–8% of total leads from referrals (manual, Excel-tracked, slow to pay out)",
                "12–22% of total leads from referrals (automated, real-time, instant point credit)",
                "150–200% increase in referral lead volume\n(e.g., 15 leads/month → 38 leads/month)",
                "User Actions Rules (Referral triggers) — points are credited automatically when a referral is logged, when the referred person visits the site, and when they book. Three-stage tracking removes friction and delays that suppressed referral participation.",
                "Real Estate / Automotive",
                "Monthly",
              ],
              [
                "EMI / Payment On-Time Rate",
                "Percentage of customers who make their instalment payment on or before the due date. A 1% improvement on a ₹5,000Cr loan book reduces NPA provisioning requirements by ~₹50Cr.",
                "62–72% of customers pay on or before due date (without incentive)",
                "78–88% pay on or before due date (with tiered early-payment incentive)",
                "+12–18 percentage points improvement\n(e.g., 68% → 84%)",
                "Transaction Events Rules — EMI on-time reward rules fire on payment reconciliation. Time-Based Events provide a 3-day pre-due-date reminder with current points balance displayed. The combination of anticipation (reminder) and reward (immediate credit) creates a Pavlovian payment habit.",
                "BFSI / Real Estate",
                "Monthly",
              ],
              [
                "App Adoption Rate\n(Digital Channel Shift)",
                "Percentage of customers who complete at least one transaction through the mobile app — as opposed to branch, phone, or offline. Higher app adoption reduces operational cost per transaction by 60–80%.",
                "18–28% of customers use the app for transactions (without incentive)",
                "45–65% of customers use the app within 90 days of loyalty launch",
                "+25–35 percentage points app adoption\n(e.g., 22% → 54% in 90 days)",
                "User Actions Rules (app download + first app transaction rewards) — a bonus of 1,000–1,500 points for downloading the app AND making the first transaction through it creates a double incentive that moves customers from passive downloaders to active users.",
                "All Verticals",
                "Weekly (first 90 days), Monthly thereafter",
              ],
              [
                "Loyalty Programme Redemption Rate",
                "Percentage of issued loyalty points that are actually redeemed by customers. Low redemption = programme failure and growing unrealised liability. Target range of 35–55% indicates a healthy, engaging programme.",
                "8–18% redemption rate (without personalised redemption and mobile page)",
                "35–55% redemption rate (with personalised mobile redemption page and encashment)",
                "+200–300% improvement in redemption rate\n(e.g., 12% → 44%)",
                "Personalised Mobile Redemption Page — each customer sees only the rewards they can afford and are most likely to want. Encashment (cash-out option) activates customers who would otherwise not redeem. Cold Wallet release notifications trigger redemption moments.",
                "All Verticals",
                "Monthly",
              ],
              [
                "Customer Referral Conversion Rate",
                "Percentage of referred leads who complete a purchase or booking. Referred leads have higher intent and trust — this metric isolates the quality of referral-generated pipeline.",
                "18–25% conversion rate on referral leads (untracked, manually managed)",
                "32–45% conversion rate on loyalty-programme referral leads",
                "+60–80% improvement in referral conversion rate\n(e.g., 20% → 34%)",
                "User Actions Rules (structured referral tracking) + User Demographics/Segments (tier-based referral incentives for Gold members who earn 2x points) — structured tracking ensures every referral is logged, attributed, and followed up.",
                "Real Estate / Automotive / BFSI",
                "Monthly",
              ],
              [
                "Aftersales Revenue Per Vehicle\n(Automotive — Service Retention)",
                "Average annual service, parts, and accessories revenue generated per vehicle sold — a direct measure of customer stickiness to the dealership's workshop rather than defection to multi-brand workshops.",
                "₹8,000–₹14,000 per vehicle per year (without loyalty)",
                "₹13,000–₹22,000 per vehicle per year (with loyalty-driven service retention)",
                "+55–65% increase in aftersales revenue per vehicle\n(e.g., ₹11,000 → ₹18,000/vehicle/year)",
                "Milestones (consecutive service visit streak rewards) + Time-Based Events (service anniversary reminder 30 days before, with bonus points offer) + Transaction Events (points per service invoice value) — three overlapping incentive mechanisms make the loyalty dealership the obvious choice.",
                "Automotive",
                "Quarterly",
              ],
              [
                "Cross-Sell Product Uptake Rate\n(BFSI)",
                "Percentage of single-product customers who take a second financial product within 12 months. The industry average is 1.8 products per customer — loyalty can push this to 2.3–2.8.",
                "8–14% of customers take a second product within 12 months (without incentive)",
                "18–28% of customers take a second product within 12 months (with cross-sell loyalty rule)",
                "+80–100% improvement in cross-sell rate\n(e.g., 11% → 22%)",
                "Transaction Events Rules (cross-sell activation trigger: new product activated = 3,000–4,000 points) + Time-Based Events (offer delivered 90 days after first product activation) + Tier-Based Rules (Gold members get a personalised cross-sell offer with a 30-day bonus window).",
                "BFSI",
                "Monthly",
              ],
              [
                "NPS Score Improvement",
                "Net Promoter Score — the percentage of customers who would actively recommend the brand minus those who would not. A loyalty programme that delivers personalised rewards directly drives NPS.",
                "NPS of 28–42 (industry average for real estate and BFSI without active loyalty)",
                "NPS of 52–68 (with structured loyalty programme active for 6+ months)",
                "+20–30 NPS points improvement\n(e.g., NPS 35 → NPS 58)",
                "Time-Based Events (birthday rewards, anniversary recognition) + Milestones (milestone celebration messages) + Personalised Mobile Redemption Page (relevant rewards at the right moment) — collectively these features shift customers from transactional to emotionally connected.",
                "All Verticals",
                "Quarterly",
              ],
              [
                "Customer Lifetime Value (CLV) Uplift",
                "The total net revenue a business can expect from a single customer account over their entire relationship. Loyalty programmes increase CLV through higher retention rate, higher purchase frequency, and higher average transaction value per visit.",
                "CLV baseline: ₹2.5L–₹8L (real estate); ₹45,000–₹1.8L (BFSI); ₹18,000–₹55,000 (automotive aftersales)",
                "CLV with loyalty: +25–40% above baseline across all verticals",
                "+25–40% CLV improvement\n(e.g., ₹3.2L → ₹4.5L per homebuyer; ₹65,000 → ₹88,000 per NBFC customer)",
                "Tier Management (tier-based customers spend 30–45% more) + Milestones (repeat purchase milestones extend the active relationship period) + Engagement/Behaviour Rules (re-engagement rules prevent the CLV clock from stopping) + Cold Wallet (controlled redemption velocity extends the active loyalty period).",
                "All Verticals",
                "Quarterly / Annually",
              ],
            ],
          },
          {
            title:
              "PART B — PRODUCT LAUNCH METRICS | North Star + Top 10 Internal Metrics | Current Launch vs Phase 1 Roadmap-Enhanced Launch",
            columns: [],
            rows: [],
          },
          {
            title:
              "Current Launch = launching today with existing features (no roadmap changes). Phase 1 Roadmap Launch = launching after implementing the 0–3 month roadmap items: Analytics Dashboard, Accounting Integration, Rule Test Mode, Push Notifications, Onboarding Playbook.",
            columns: [],
            rows: [],
          },
          {
            title:
              "★ NORTH STAR METRIC: Monthly Active Loyalty Members (MALMs) — the number of loyalty programme members who earn OR redeem at least 1 point in a calendar month. This single metric captures programme health, engagement, and value delivery simultaneously.",
            columns: [],
            rows: [],
          },
          {
            title: "Product Launch Metrics",
            columns: [
              "#",
              "Metric Name",
              "What It Measures",
              "First 30 Days\nCurrent Launch",
              "First 30 Days\nPhase 1 Launch",
              "3 Months\nCurrent Launch",
              "3 Months\nPhase 1 Launch",
              "Why the Gap Between Columns",
            ],
            rows: [
              [
                "★",
                "Monthly Active Loyalty Members (MALMs)\n[NORTH STAR]",
                "Members who earn or redeem ≥1 point in the month. The headline metric of programme health.",
                "500–1,000 per client\n(driven by CRM-synced member creation + manual rule triggering)",
                "1,200–2,000 per client\n(push notifications drive activation; onboarding playbook accelerates member creation)",
                "2,000–4,500 per client\n(organic growth as word spreads and referral rules activate more members)",
                "4,500–8,000 per client\n(analytics dashboard shows which rules drive MALMs → admin doubles down on what works)",
                "Phase 1 adds push notifications (rule-fire awareness → activation) and the analytics dashboard (data-led rule optimisation). Both directly drive more members into active status faster.",
              ],
              [
                "1",
                "New Members Enrolled",
                "Total new loyalty programme members registered in the period. Measures programme onboarding velocity.",
                "200–600\n(manual CRM sync; limited by onboarding speed)",
                "500–1,200\n(onboarding playbook reduces setup time by 40%; more members enrolled in first batch)",
                "800–2,500\n(referral rules kick in; members recruit members)",
                "1,800–4,000\n(analytics shows which referral rules work; admin doubles down; push notifications accelerate referral action)",
                "The onboarding playbook (Phase 1) directly accelerates the first member batch. Analytics shows which acquisition channels work — enabling faster iteration.",
              ],
              [
                "2",
                "Activation Rate\n(% of enrolled who earn first points)",
                "Percentage of enrolled members who earn their first loyalty points within 14 days of enrolment.",
                "35–55%\n(no push notification; members forget the programme exists)",
                "60–78%\n(push notification on enrolment + rule-fire notification drives first earn within 48 hours)",
                "45–65%\n(stabilises as programme matures; some enrolled members are slow starters)",
                "68–82%\n(analytics identifies low-activation segments; admin creates targeted rules to activate them)",
                "Push notifications (Phase 1) are the single biggest activation driver — the moment a member earns their first point and receives a notification, activation probability jumps from 35% to 78%.",
              ],
              [
                "3",
                "Rules Configured & Live",
                "Total number of active loyalty rules in the system per client. More rules = more earning moments. Benchmark: 8–15 active rules.",
                "3–6 rules\n(limited by manual onboarding; no test mode; admin cautious)",
                "6–10 rules\n(rule test mode removes fear of live errors; onboarding playbook provides templates)",
                "8–15 rules\n(as admin gains confidence; vertical rule templates fully used)",
                "12–20 rules\n(analytics shows which rules drive MALMs; admin adds rules confidently based on data)",
                "Rule test mode (Phase 1) is the key unlock: admins who can simulate a rule before going live configure 2x more rules in the first 30 days.",
              ],
              [
                "4",
                "Points Issued per Member per Month",
                "Average loyalty points earned per active member per month. Too low = disengagement; too high = unmanageable liability.",
                "800–2,500 pts/member/month\n(depends on transaction frequency and rule density)",
                "1,200–3,200 pts/member/month\n(more rules = more earning moments per member)",
                "1,500–4,000 pts/member/month\n(milestones and time-based rules add to base transaction earn)",
                "2,000–5,500 pts/member/month\n(analytics shows earn rate by segment; admin optimises for highest-value segments)",
                "More rules (enabled by test mode) directly increase earning moments per member. Analytics then lets the admin identify under-earning segments and add targeted rules.",
              ],
              [
                "5",
                "Redemption Rate\n(Points Redeemed / Points Issued)",
                "Percentage of issued points redeemed in the same period. Target: 30–50%. Below 20% = catalogue irrelevance. Above 60% = liability pressure.",
                "15–28%\n(redemption catalogue is live but no personalisation analytics)",
                "22–38%\n(onboarding playbook helps admin configure more relevant redemption items from Day 1)",
                "28–45%\n(members discover the catalogue; encashment drives high redemption)",
                "38–55%\n(analytics shows which redemption items are used; admin curates a higher-relevance catalogue)",
                "The analytics dashboard (Phase 1) is the key driver: knowing which redemption categories are used vs ignored allows the admin to curate a higher-relevance catalogue.",
              ],
              [
                "6",
                "Monthly Recurring Revenue (MRR)\n[Internal — our metric]",
                "Our recurring software subscription revenue per month. Target: ₹2–3L MRR by Month 3 from first client; ₹10–15L MRR by Month 12 from 4–5 clients.",
                "₹1.5–3L\n(1 client at ₹18–36L ACV = ₹1.5–3L/month)",
                "₹1.5–3L\n(same first client; Phase 1 roadmap does not add revenue in first 30 days)",
                "₹4–8L\n(2–3 clients signed by Month 3; pilots converting to full ACV)",
                "₹6–12L\n(faster pilot conversion because analytics proves ROI faster; client #3 signs sooner)",
                "Phase 1 roadmap does not directly add MRR in 30 days — but the analytics dashboard shortens pilot-to-full-ACV conversion from 90 days to 45–60 days.",
              ],
              [
                "7",
                "Customer Acquisition Cost (CAC)\n[Internal — our metric]",
                "Total sales and marketing cost to acquire one signed client. Target: ₹3–8L CAC in Year 1. Acceptable LTV:CAC ratio is 5:1+.",
                "₹5–12L per client\n(high founder time; no case study; every deal starts from cold)",
                "₹4–9L per client\n(onboarding playbook reduces CS time per deal; partner channel begins contributing)",
                "₹3–7L per client\n(reference client provides social proof; fewer calls to close; partner referrals)",
                "₹2–5L per client\n(analytics dashboard creates publishable ROI report, accelerating deal cycles)",
                "The analytics dashboard (Phase 1) creates a virtuous cycle: client data → publishable ROI report → next deal closes faster → lower CAC. Compounds from Month 2 onwards.",
              ],
              [
                "8",
                "Client Onboarding Time\n(Days from contract to first rule live)",
                "Calendar days from signed contract to first live loyalty rule generating points for real members. Target: ≤21 days.",
                "28–45 days\n(no playbook; engineering-heavy; each client requires custom configuration)",
                "14–22 days\n(onboarding playbook provides templates; rule test mode allows faster admin configuration)",
                "25–40 days\n(no playbook; complexity grows as more rules are added; engineering bottlenecks)",
                "12–18 days\n(playbook matures; templates cover 80% of common rule configurations; admin self-serves)",
                "The onboarding playbook (Phase 1) is the primary driver — it eliminates the blank-page problem for new client admins and reduces engineering dependency from 60% to 20%.",
              ],
              [
                "9",
                "Net Revenue Retention (NRR)\n[Internal — our metric]",
                "Revenue retained from existing clients after accounting for expansion, contraction, and churn. Target: 110–125% NRR. NRR >100% means we grow from existing base.",
                "Unable to measure\n(only 1 client; no renewal data yet; 30 days is too early)",
                "Unable to measure\n(insufficient data in 30 days regardless of Phase 1 status)",
                "90–105% projected NRR\n(first renewal approaching; some expansion possible)",
                "100–115% projected NRR\n(analytics dashboard gives client proof of ROI before renewal; accounting integration removes CFO friction)",
                "The analytics dashboard and accounting integration (Phase 1) together transform the renewal conversation from 'we think it is working' to 'here is the P&L impact.'",
              ],
              [
                "10",
                "Escrow Coverage Ratio\n(Client financial health metric)",
                "Ratio of client's escrow wallet balance to 25% of total outstanding loyalty points liability. Must stay ≥1.0x at all times.",
                "1.0–1.3x\n(admin manually monitors; no automated alert; risk of dipping below 1.0x)",
                "1.2–1.5x\n(onboarding playbook trains admin on escrow management; better initial setup)",
                "1.0–1.2x\n(as more points are issued, maintaining the ratio requires active monitoring)",
                "1.3–1.8x\n(automated escrow health monitoring — alert fires when ratio approaches 1.1x; admin tops up proactively)",
                "This metric does not exist in any other loyalty platform. Phase 1 accounting integration and automated escrow alerts change this from a manual compliance task to an automated financial control.",
              ],
            ],
          },
          {
            title:
              "LEGEND: Blue columns = Current Launch (no roadmap changes) | Green columns = Phase 1 Roadmap Launch (Analytics Dashboard + Accounting Integration + Rule Test Mode + Push Notifications + Onboarding Playbook) | ★ = North Star Metric",
            columns: [],
            rows: [],
          },
        ],
      },
    },
    detailedSWOT: {
      strengths: [
        {
          headline: "S1 — 7-Dimension No-Code Rule Engine",
          explanation:
            "The most technically differentiated feature in the Indian mid-market. No competitor combines 7 rule dimensions with a business-user-configurable interface. This directly addresses the #1 pain of marketing teams: IT dependency for every rule change. Proven in production with 30+ business rules live across 6 categories.",
        },
        {
          headline: "S2 — Escrow Wallet with Financial Controls",
          explanation:
            "No other loyalty SaaS in India or globally offers a built-in 25% float escrow with mark-to-market liability management as a first-class feature. This is a genuine moat — it converts loyalty from a balance sheet risk into a managed financial instrument. Opens doors to CFOs and finance-regulated industries (BFSI, real estate).",
        },
        {
          headline: "S3 — Cold Wallet for Redemption Velocity Control",
          explanation:
            "Unique mechanism to separate long-term point storage from active redemption pool. Controls the rate at which loyalty liability converts to cash outflow — a feature that no comparable platform offers as standard. Directly addresses cash flow risk concerns in high-liability programmes.",
        },
        {
          headline: "S4 — Production-Proven in a High-Complexity Vertical",
          explanation:
            "Live deployment for a major real estate developer with 30+ rules across demand notes, collections, referrals, registrations, and marketing engagement. This is the most complex loyalty programme vertical (long purchase cycles, high transaction values, regulatory sensitivity) — success here is proof of concept for every adjacent industry.",
        },
        {
          headline: "S5 — Deep, Bidirectional Salesforce Integration",
          explanation:
            "12+ API endpoints covering the full customer lifecycle: member creation, demand notes, payments, referrals, site visits, home loans, testimonials, surveys. This is not a webhook connector — it is a production-grade integration that took months to build and cannot be replicated quickly. Salesforce is the CRM of choice for mid-to-large enterprises in India.",
        },
        {
          headline:
            "S6 — Full Redemption Catalogue (7 Types including Encashment)",
          explanation:
            "Encashment (cash-out of points) is a best-in-class redemption mechanism for high-value purchase industries where customers have outstanding payment obligations. Combined with 6 other redemption types, the catalogue competes with global enterprise platforms at a fraction of their cost.",
        },
        {
          headline: "S7 — Vertical Specificity as a Feature",
          explanation:
            "Purpose-built for industries with complex, high-value, long-cycle customer relationships. This vertical depth is a feature, not a limitation — generic loyalty platforms cannot replicate the domain-specific rule templates, integration patterns, and financial controls that come from deep vertical focus.",
        },
      ],
      weaknesses: [
        {
          headline: "W1 — No Analytics or Reporting Dashboard",
          explanation:
            "CMO and marketing leadership buyers evaluate loyalty platforms on programme ROI visibility — redemption rates, campaign uplift, cohort analysis. The absence of an analytics layer is a deal-blocker when competing against Antavo and Capillary. Every enterprise evaluation will surface this gap within 30 minutes of a product demo.",
        },
        {
          headline: "W2 — Accounting / ERP Integration Not Yet Shipped",
          explanation:
            "Finance teams in BFSI and enterprise real estate require loyalty cost to flow automatically into the general ledger. The API structure exists but the accounting connector is not complete. This gap prolongs the CFO approval process and adds implementation cost for the client.",
        },
        {
          headline: "W3 — No AI or ML Personalisation Layer",
          explanation:
            "Antavo's AI Loyalty Cloud and Capillary's Insights+ already use machine learning to auto-optimise reward offers and predict churn. Our rule engine is human-configured — sophisticated but not self-learning. As enterprise buyers mature, the expectation for AI-driven personalisation will become standard.",
        },
        {
          headline: "W4 — Single Reference Client",
          explanation:
            "One production deployment is proof of concept but not proof of scale. Enterprise buyers in BFSI and automotive will ask for vertical-specific references — a real estate deployment does not fully de-risk a bank's decision. Until we have 3–5 clients across 2 verticals, the reference story is thin.",
        },
        {
          headline: "W5 — Limited Brand Awareness",
          explanation:
            "Capillary, Antavo, and Salesforce Loyalty are Gartner-recognised and discoverable through analyst channels. We are not yet. Buyers who are actively researching loyalty platforms will not find us through standard channels. This means every deal starts with a credibility conversation, not a product conversation.",
        },
        {
          headline: "W6 — No Gamification Module",
          explanation:
            "Streaks, badges, challenges, and leaderboards are increasingly expected in loyalty programmes targeting younger demographics and high-engagement industries (EdTech, healthcare, consumer apps). Without gamification, we cannot credibly serve these verticals.",
        },
        {
          headline: "W7 — Accounting Integration on Roadmap",
          explanation:
            "For finance-regulated industries (BFSI, NBFCs, listed real estate companies), the inability to auto-post loyalty costs to the GL is a compliance friction point. This forces manual reconciliation and weakens our story to CFO-level buyers.",
        },
      ],
      opportunities: [
        {
          headline: "O1 — India's Loyalty Market is Nascent and Underserved",
          explanation:
            "Organised loyalty programme adoption among Indian mid-market companies (₹100Cr–₹2,000Cr revenue) is below 20%. Most companies either have no programme or use a basic voucher tool like Xoxoday. The entire mid-market is a greenfield opportunity — we do not need to displace an incumbent, we need to make the category case.",
        },
        {
          headline:
            "O2 — Real Estate Loyalty is Completely Unaddressed by Existing SaaS",
          explanation:
            "No Indian or global loyalty SaaS has built a purpose-specific product for real estate developers. This is a ₹50,000Cr+ industry in India with complex loyalty needs (demand notes, possession incentives, referral programmes) and zero vertical-specific software. We own this category today.",
        },
        {
          headline: "O3 — BFSI Regulatory Push Creates Urgency",
          explanation:
            "RBI and IRDAI guidelines are increasingly linking customer experience and retention metrics to compliance. Banks and NBFCs are under pressure to improve NPS and reduce attrition. A loyalty programme with escrow controls and CRM integration is a natural solution — and the escrow wallet aligns directly with financial regulators' expectations of liability management.",
        },
        {
          headline:
            "O4 — Salesforce Partner Ecosystem as a Distribution Channel",
          explanation:
            "Salesforce has 500+ implementation partners in India. Every Salesforce partner encounters clients who need a loyalty programme but cannot afford or implement Salesforce Loyalty Management. We are the loyalty engine those partners can recommend — with a pre-built Salesforce integration as our primary proof point.",
        },
        {
          headline: "O5 — GCC and SEA as Expansion Markets",
          explanation:
            "The Gulf Cooperation Council (UAE, Saudi Arabia, Qatar) has a high density of real estate developers, retail groups, and banking clients who are actively investing in loyalty programmes. Our vertical depth and financial controls translate directly to these markets. A single GCC real estate deployment opens a significant expansion opportunity.",
        },
        {
          headline: "O6 — AI Enhancement Layer is a Near-Term Differentiator",
          explanation:
            "Adding AI-powered rule optimisation and predictive churn detection to the existing rule engine would immediately upgrade us from 'sophisticated but manual' to 'intelligent and self-optimising' — matching the roadmap of Antavo and Capillary while retaining our vertical and financial control advantages.",
        },
        {
          headline: "O7 — Xoxoday's Installed Base as Our Pipeline",
          explanation:
            "Every company that currently uses Xoxoday for vouchers is a potential upgrade customer. Xoxoday is a reward fulfilment tool — our rule engine is what they are missing. A joint integration story (we power the rules; they fulfil the reward) turns Xoxoday's 5,000+ India client base into our top-of-funnel.",
        },
      ],
      threats: [
        {
          headline: "T1 — Capillary Expanding Beyond Retail",
          explanation:
            "Capillary is the dominant India loyalty platform and has the engineering resources to build vertical-specific modules for real estate and BFSI. If they ship a transaction-event trigger for demand notes or a financial controls module, they can compete in our primary vertical with brand, scale, and existing client relationships.",
        },
        {
          headline: "T2 — Salesforce Dropping Mid-Market Pricing",
          explanation:
            "Salesforce Loyalty Management is currently too expensive for the mid-market. If Salesforce introduces a lower-priced tier or simplifies implementation for mid-market clients, they would immediately pressure our positioning — they already have the Salesforce CRM integration advantage.",
        },
        {
          headline: "T3 — Antavo's AI Loyalty Cloud Setting a New Benchmark",
          explanation:
            "Antavo's machine-learning reward optimisation is increasingly cited by enterprise buyers as a baseline expectation. If AI personalisation becomes the standard minimum, our rule engine — however sophisticated — is positioned as a manual tool. This is a 12–18 month risk, not immediate.",
        },
        {
          headline: "T4 — Xoxoday Building a Rule Engine Layer",
          explanation:
            "Xoxoday has a large India installed base, significant funding, and is expanding into workflow automation. If they ship a basic rule engine and CRM integration, they would be 'good enough' for the majority of the mid-market and displace our primary positioning.",
        },
        {
          headline: "T5 — Enterprise Clients Building In-House",
          explanation:
            "Large enterprises with IT teams (banks, large developers) may choose to build a custom loyalty engine rather than buy — especially if they perceive our platform as limited in analytics or AI. The 'build vs buy' objection is persistent in BFSI. Every deal requires a compelling TCO argument.",
        },
        {
          headline: "T6 — Slow Sales Cycles Stall Revenue",
          explanation:
            "Enterprise B2B loyalty is a 3–9 month sales cycle. With a small team and two clients, a slowdown in pipeline velocity could create cash flow pressure before the product reaches the scale required for inbound demand. Over-reliance on a few large deals is a concentration risk.",
        },
        {
          headline: "T7 — Talent Risk in a Niche Product Category",
          explanation:
            "Loyalty programme engineering and product management talent is scarce in India. Building the analytics, AI, and accounting integration layers requires specialised skills. Losing a key technical contributor during the critical scaling phase could delay roadmap execution by 6–12 months.",
        },
      ],
    },
  },
};

// ============== CUSTOM TAB COMPONENTS (Snag360-style UI) ==============

const LESummaryTab: React.FC = () => {
  const summary = loyaltyEngineData.extendedContent?.productSummaryNew;
  const identity = summary?.identity || [];
  const problemSolves = summary?.problemSolves || [];
  const whoItIsFor = summary?.whoItIsFor || [];
  const featureModules = summary?.summaryFeatureModules || [];
  const usps = summary?.summaryUsps || [];
  const traction = summary?.tractionMilestones || [];
  const today = summary?.today || [];

  return (
    <div className="space-y-8 animate-fade-in overflow-x-auto">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-2xl font-semibold tracking-tight font-poppins">
          {loyaltyEngineData.name} - Product Identity
        </h2>
        <p className="text-[10px] font-medium text-[#2C2C2C]/40 tracking-widest mt-1">
          {summary?.summarySubtitle || "Investor & Partner Brief"}
        </p>
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-4 text-center w-1/4 font-poppins">
                Field
              </th>
              <th className="border border-[#C4B89D]/50 p-4 text-center font-poppins">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {identity.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.field}
                </td>
                <td className="border border-[#C4B89D]/50 p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white border border-[#C4B89D] p-4 font-semibold text-sm rounded-t-xl font-poppins">
        The Problem It Solves
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-4 text-center w-1/3 font-poppins">
                Pain Point
              </th>
              <th className="border border-[#C4B89D]/50 p-4 text-center font-poppins">
                How {loyaltyEngineData.name} Solves It
              </th>
            </tr>
          </thead>
          <tbody>
            {problemSolves.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.painPoint}
                </td>
                <td className="border border-[#C4B89D]/50 p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.solution}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white border border-[#C4B89D] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
        Who It Is For
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/5 font-poppins">
                Role
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                What They Use It For
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                Key Frustration Today
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                What They Gain
              </th>
            </tr>
          </thead>
          <tbody>
            {whoItIsFor.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.role}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.useCase}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/70 font-medium leading-relaxed italic font-poppins bg-white">
                  {r.frustration}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.gain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
        Feature Modules
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                Module
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center font-poppins">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {featureModules.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.label}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
        Unique Selling Propositions
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                USP
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center font-poppins">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {usps.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.label}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
        Traction & Milestones
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                Milestone
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center font-poppins">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {traction.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.label}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
        Where We Are Today
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center w-1/4 font-poppins">
                Dimension
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center w-3/4 font-poppins">
                Current State
              </th>
            </tr>
          </thead>
          <tbody>
            {today.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.dimension}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LEFeaturesTab: React.FC = () => {
  const features = loyaltyEngineData.extendedContent?.detailedFeatures || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Feature List
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        All features from product brief. USP rows highlighted in orange. Star
        denotes unique competitive advantage.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Module
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Feature
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                How It Currently Works
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                User Type
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Status
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                Priority
              </th>
              <th className="border border-[#C4B89D]/50 p-3 text-center">
                USP
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr
                key={i}
                className={
                  f.usp
                    ? "bg-[#DA7756]/10"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C] font-medium">
                  {f.module}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-3 ${f.usp ? "font-semibold text-[#DA7756]" : "text-[#2C2C2C]"}`}
                >
                  {f.feature}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80">
                  {f.works}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80">
                  {f.userType}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-center text-[#2C2C2C]/80">
                  {f.status}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-center text-[#2C2C2C]/80">
                  {f.priority}
                </td>
                <td className="border border-[#C4B89D]/50 p-3 text-center font-semibold text-[#DA7756]">
                  {f.usp ? "★ USP" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LEMarketTab: React.FC = () => {
  const targetAudience =
    loyaltyEngineData.extendedContent?.detailedMarketAnalysis?.targetAudience ||
    [];
  const competitors =
    loyaltyEngineData.extendedContent?.detailedMarketAnalysis
      ?.competitorMapping || [];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Market Analysis
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Target Audience | Section 2: Competitor Mapping
      </p>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Target Audience
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Segment
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Demographics & Industry
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Geography
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Pain Points
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Not Solved Today
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Good Enough Today
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Trigger to Switch
              </th>
            </tr>
          </thead>
          <tbody>
            {targetAudience.map((t, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {t.segment}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.demographics}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.geography}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.painPoints}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.notSolved}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.goodEnough}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.triggerToSwitch}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 2: Competitor Mapping
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Competitor
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Location
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Target Customer
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Pricing
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Key Strengths
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Key Weakness
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Market Gaps
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center">
                Threat Level
              </th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {c.name}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {c.location}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {c.targetCustomer}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {c.pricing}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#798C5E] font-bold whitespace-pre-line">
                  {c.strongestFeatures}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#b91c1c] font-bold whitespace-pre-line">
                  {c.weakness}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#4B5563] font-bold whitespace-pre-line">
                  {c.marketGaps}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center font-semibold whitespace-pre-line ${c.threatLevel === "HIGH" ? "text-red-600" : c.threatLevel === "MEDIUM" ? "text-[#D97706]" : "text-green-600"}`}
                >
                  {c.threatLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LEPricingTab: React.FC = () => {
  const benchmark = loyaltyEngineData.extendedContent?.featureBenchmark || [];
  const pricingData = loyaltyEngineData.extendedContent?.pricingData || [];
  const positioningData =
    loyaltyEngineData.extendedContent?.positioningData || [];
  const valueProps = loyaltyEngineData.extendedContent?.valuePropositions || [];

  const getStandBadge = (stand: string) => {
    if (stand === "AHEAD") return "bg-[#d4edda] text-[#155724] font-bold";
    if (stand === "AT PAR") return "bg-[#fff3cd] text-[#856404] font-bold";
    if (stand === "GAP") return "bg-[#f8d7da] text-[#721c24] font-bold";
    return "text-[#2C2C2C]";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Live") return "bg-[#d4edda] text-[#155724]";
    if (status === "Roadmap") return "bg-[#cce5ff] text-[#004085]";
    return "text-[#2C2C2C]";
  };

  const getPricingRowStyle = (highlight?: string) => {
    if (highlight === "now") return "bg-[#e2efda]";
    if (highlight === "future") return "bg-[#DA7756]/10";
    if (highlight === "risk") return "bg-[#fce4d6]";
    return "";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Features & Pricing
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Part A: Feature Benchmarking vs Market | Part B: Pricing — Current
        Market & Recommendations | Part C: Positioning | Part D: Value
        Propositions & How to Sharpen Them
      </p>

      {/* PART A — FEATURE BENCHMARKING */}
      {benchmark.length > 0 && (
        <>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D]">
            Part A — Current Features vs Market Standard
          </div>
          <div className="grid grid-cols-3 gap-3 px-1">
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold">
              <span className="inline-block px-2 py-1 rounded bg-[#d4edda] text-[#155724]">
                AHEAD
              </span>
              <span className="text-[#2C2C2C]/70">
                — We lead the market on this feature
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold">
              <span className="inline-block px-2 py-1 rounded bg-[#fff3cd] text-[#856404]">
                AT PAR
              </span>
              <span className="text-[#2C2C2C]/70">
                — Solid, meets market expectation
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold">
              <span className="inline-block px-2 py-1 rounded bg-[#f8d7da] text-[#721c24]">
                GAP
              </span>
              <span className="text-[#2C2C2C]/70">
                — Below market; may cost deals
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[15%]">
                    Feature Area
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[22%]">
                    Market Standard
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[22%] bg-[#DA7756] text-white">
                    Our Product
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[7%]">
                    Status
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[9%]">
                    Where We Stand
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[25%]">
                    Deal Impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmark.map((b, i) => (
                  <tr
                    key={i}
                    className={
                      b.whereWeStand === "AHEAD"
                        ? "bg-[#e2efda]"
                        : b.whereWeStand === "GAP"
                          ? "bg-[#fce4d6]"
                          : i % 2 === 0
                            ? "bg-white"
                            : "bg-[#F6F4EE]"
                    }
                  >
                    <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#DA7756]">
                      {b.featureArea}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/75 leading-relaxed">
                      {b.marketStandard}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/85 font-medium leading-relaxed bg-[#DA7756]/10">
                      {b.ourProduct}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-semibold ${getStatusBadge(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-[10px] ${getStandBadge(b.whereWeStand)}`}
                      >
                        {b.whereWeStand}
                      </span>
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 leading-relaxed">
                      {b.dealImpact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PART B — PRICING */}
      {pricingData.length > 0 && (
        <>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] mt-4">
            Part B — Pricing: Current Market & Recommendations
          </div>
          <div className="flex gap-4 px-1 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold">
              <span className="inline-block w-3 h-3 rounded bg-[#e2efda]"></span>
              <span className="text-[#2C2C2C]/70">Recommended NOW</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold">
              <span className="inline-block w-3 h-3 rounded bg-[#DA7756]/10"></span>
              <span className="text-[#2C2C2C]/70">Future pricing</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-poppins font-semibold">
              <span className="inline-block w-3 h-3 rounded bg-[#fce4d6]"></span>
              <span className="text-[#2C2C2C]/70">Risk to watch</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-3 text-left w-[28%]">
                    Topic
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-left">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      getPricingRowStyle(row.highlight) ||
                      (i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]")
                    }
                  >
                    <td className="border border-[#C4B89D]/50 p-3 font-semibold text-[#DA7756] align-top">
                      {row.label}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PART C — POSITIONING */}
      {positioningData.length > 0 && (
        <>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] mt-4">
            Part C — Positioning
          </div>
          <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
            Strategic positioning, target segments, competitor displacement, and
            GTM motion for Year 1.
          </p>
          <div className="space-y-4">
            {positioningData.map((item, i) => (
              <div
                key={i}
                className="border border-[#C4B89D]/50 rounded-lg overflow-hidden"
              >
                <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2 font-semibold text-[12px] font-poppins">
                  {item.question}
                </div>
                <div className="bg-white px-4 py-3 text-[11px] text-[#2C2C2C]/85 leading-relaxed font-poppins whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PART D — VALUE PROPOSITIONS */}
      {valueProps.length > 0 && (
        <>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] mt-4">
            Part D — Value Propositions & How to Sharpen Them
          </div>
          <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
            Current messaging, its weakness, the sharpened version, and proof
            points to add.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[3%]">
                    #
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[16%]">
                    Current Value Proposition
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[14%]">
                    What It Communicates Today
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[14%]">
                    Weakness / What It's Missing
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[28%]">
                    Sharpened / Expanded Version
                  </th>
                  <th className="border border-[#C4B89D]/50 p-3 text-center w-[25%]">
                    Proof Point to Add
                  </th>
                </tr>
              </thead>
              <tbody>
                {valueProps.map((v, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                  >
                    <td className="border border-[#C4B89D]/50 p-3 text-center font-semibold text-[#DA7756]">
                      {v.num}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C] font-medium leading-relaxed">
                      {v.current}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 leading-relaxed">
                      {v.communicates}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#b91c1c]/90 leading-relaxed italic">
                      {v.weakness}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#155724] font-medium leading-relaxed bg-[#f0fff4]">
                      {v.sharpened}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 leading-relaxed">
                      {v.proofPoint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const LEUseCasesTab: React.FC = () => {
  const industryUseCases =
    loyaltyEngineData.extendedContent?.detailedUseCases?.industryUseCases || [];
  const teamUseCases =
    loyaltyEngineData.extendedContent?.detailedUseCases?.internalTeamUseCases ||
    [];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Use Cases
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Industry Use Cases | Section 2: Internal Team Use Cases
      </p>

      <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins rounded-t-xl">
        Section 1: Industry Use Cases
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[50px]">
                Rank
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[140px]">
                Industry
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[160px]">
                Relevant Features & Teams
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[160px]">
                How They Use It
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[160px]">
                Ideal Company Profile
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[140px]">
                Current Tool
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[100px]">
                Urgency
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center min-w-[160px]">
                Primary Buyer & User
              </th>
            </tr>
          </thead>
          <tbody>
            {industryUseCases.map((u, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#2C2C2C]">
                  {u.rank}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#DA7756] break-words">
                  {u.industry}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {u.features}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {u.useCase}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {u.companyProfile || u.profile}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  {u.currentTool}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center font-semibold ${u.urgency?.startsWith("HIGH") ? "text-red-600" : "text-[#D97706]"}`}
                >
                  {u.urgency}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 break-words">
                  <div className="font-semibold text-[#DA7756] mb-1">
                    {u.primaryBuyer}
                  </div>
                  <div className="text-[#2C2C2C]/70">{u.primaryUser}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teamUseCases.length > 0 && (
        <>
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8 rounded-t-xl">
            Section 2: Internal Team Use Cases
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Team
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Features Used
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    How They Use It
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Benefit
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Frequency
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center">
                    Success Metric
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamUseCases.map((t, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                  >
                    <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#DA7756] whitespace-pre-line">
                      {t.team}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {t.features}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {t.howTheyUse}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {t.benefit}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80 whitespace-pre-line">
                      {t.frequency}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {t.successMetric}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const LERoadmapTab: React.FC = () => {
  const phases =
    loyaltyEngineData.extendedContent?.detailedRoadmap?.structuredRoadmap || [];
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Product Roadmap
        </h2>
      </div>
      {phases.map((phase, pi) => (
        <div key={pi} className="space-y-4">
          <div
            className={`px-4 py-3 font-semibold text-sm font-poppins rounded-t-xl border border-[#C4B89D] ${phase.colorContext === "red" ? "bg-[#C72030] text-white" : phase.colorContext === "yellow" ? "bg-[#D97706] text-white" : "bg-[#DA7756] text-white"}`}
          >
            {phase.timeframe} — {phase.headline}
          </div>
          {phase.phaseDescription && (
            <p className="text-[11px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
              {phase.phaseDescription}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[15%]">
                    What It Is
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[30%]">
                    Why It Matters
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                    Unlocked Segment
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[15%]">
                    Success Metric
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[8%]">
                    Effort
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[6%]">
                    Priority
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[6%]">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {phase.items.map((item, ii) => (
                  <tr
                    key={ii}
                    className={ii % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                  >
                    <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#DA7756] whitespace-pre-line">
                      {item.whatItIs}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {item.whyItMatters}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {item.unlockedSegment}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                      {item.successMetric}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80">
                      {item.effort}
                    </td>
                    <td
                      className={`border border-[#C4B89D]/50 p-2 text-center font-semibold ${item.priority?.includes("P0") ? "text-[#C72030]" : item.priority?.includes("P1") ? "text-[#D97706]" : "text-[#6B21A8]"}`}
                    >
                      {item.priority}
                    </td>
                    <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80 whitespace-pre-line">
                      {item.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const LEBusinessPlanTab: React.FC = () => {
  const questions =
    loyaltyEngineData.extendedContent?.detailedBusinessPlan?.planQuestions ||
    [];
  const colorMap: Record<string, string> = {
    red: "bg-[#A52A1A]",
    green: "bg-[#0F5B2A]",
    yellow: "bg-[#B79000]",
    orange: "bg-[#D97706]",
    purple: "bg-[#6B2D84]",
    teal: "bg-[#006B5E]",
    blue: "bg-[#1F4E79]",
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Business Plan
        </h2>
      </div>
      {questions.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <div
            className={`${colorMap[q.colorContext || ""] || "bg-[#1F4E79]"} text-white px-4 py-3 font-semibold text-sm font-poppins rounded-t-xl`}
          >
            {q.id}: {q.question}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[60%]">
                    Answer
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                    Context / Source
                  </th>
                  <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/80 whitespace-pre-line leading-relaxed">
                    {q.answer}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-3 text-[#2C2C2C]/60 whitespace-pre-line">
                    {q.source || "—"}
                  </td>
                  <td className="border border-[#C4B89D]/50 p-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-[10px] font-semibold ${q.flag === "Ready" ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-900"}`}
                    >
                      {q.flag || "—"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const LEGTMTab: React.FC = () => {
  const sheet = loyaltyEngineData.extendedContent?.detailedGTM?.sheet;
  const targetGroups = sheet?.targetGroups || [];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {sheet?.title || `${loyaltyEngineData.name} - GTM Strategy`}
        </h2>
      </div>
      {targetGroups.map((tg, tgi) => (
        <div key={tgi} className="space-y-6">
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins whitespace-pre-line">
            {tg.title}
          </div>
          {tg.sections.map((sec, si) => (
            <div key={si} className="space-y-2">
              <div className="bg-[#F6F4EE] text-[#DA7756] px-4 py-2 font-semibold text-[12px] font-poppins">
                {sec.title}
              </div>
              {sec.columns.length > 0 && sec.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[10px] font-poppins">
                    <thead>
                      <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                        {sec.columns.map((col, ci) => (
                          <th
                            key={ci}
                            className="border border-[#C4B89D]/50 p-2 text-center"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className={ri % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`border border-[#C4B89D]/50 p-2 whitespace-pre-line ${ci === 0 ? "font-semibold text-[#2C2C2C]" : "text-[#2C2C2C]/80"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-[#C4B89D]/50 p-3 text-[11px] text-[#2C2C2C]/60 italic font-poppins bg-white">
                  {sec.title}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const LEMetricsTab: React.FC = () => {
  const clientImpact =
    loyaltyEngineData.extendedContent?.detailedMetrics?.clientImpact || [];
  const businessTargets =
    loyaltyEngineData.extendedContent?.detailedMetrics?.businessTargets || [];
  const sheet = loyaltyEngineData.extendedContent?.detailedMetrics?.sheet;
  const sections = sheet?.sections || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {sheet?.title || `${loyaltyEngineData.name} - Metrics`}
        </h2>
      </div>

      {sections.length > 0 ? (
        sections.map((sec, si) => (
          <div key={si} className="space-y-2">
            {sec.columns.length > 0 && sec.rows.length > 0 ? (
              <>
                <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins whitespace-pre-line">
                  {sec.title}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[10px] font-poppins">
                    <thead>
                      <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                        {sec.columns.map((col, ci) => (
                          <th
                            key={ci}
                            className="border border-[#C4B89D]/50 p-2 text-center"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className={ri % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`border border-[#C4B89D]/50 p-2 whitespace-pre-line ${ci === 0 ? "font-semibold text-[#2C2C2C]" : "text-[#2C2C2C]/80"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div
                className={`px-4 py-3 font-semibold text-sm font-poppins whitespace-pre-line ${sec.title.includes("LEGEND") || sec.title.includes("★") ? "bg-[#DA7756]/10 text-[#2C2C2C] border border-[#C4B89D]/50" : "bg-[#DA7756]/80 text-white/90 italic"}`}
              >
                {sec.title}
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          {clientImpact.length > 0 && (
            <>
              <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
                Client Impact Metrics
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11px] font-poppins">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        Metric
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        Baseline
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        With Platform
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        Impact Claim
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientImpact.map((m, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                      >
                        <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                          {m.metric}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#E49191] italic">
                          {m.baseline}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#108C72] font-semibold">
                          {m.withSnag}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80">
                          {m.claim}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {businessTargets.length > 0 && (
            <>
              <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
                Business Growth Targets
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px] font-poppins">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        Metric
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        Definition
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        D30 Current
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        D30 Phase 1
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        M3 Current
                      </th>
                      <th className="border border-[#C4B89D]/50 p-2 text-center">
                        M3 Phase 1
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessTargets.map((b, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                      >
                        <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                          {b.metric}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                          {b.definition}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                          {b.d30Current}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#108C72] font-medium whitespace-pre-line">
                          {b.d30Phase1}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                          {b.m3Current}
                        </td>
                        <td className="border border-[#C4B89D]/50 p-2 text-[#108C72] font-medium whitespace-pre-line">
                          {b.m3Phase1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const LESWOTTab: React.FC = () => {
  const swot = loyaltyEngineData.extendedContent?.detailedSWOT;
  const strengths = swot?.strengths || [];
  const weaknesses = swot?.weaknesses || [];
  const opportunities = swot?.opportunities || [];
  const threats = swot?.threats || [];
  const maxSW = Math.max(strengths.length, weaknesses.length);
  const maxOT = Math.max(opportunities.length, threats.length);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - SWOT Analysis
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr>
              <th
                colSpan={3}
                className="bg-[#798C5E]/15 text-[#798C5E] border border-[#C4B89D]/50 p-3 text-center font-bold text-sm"
              >
                STRENGTHS
              </th>
              <th
                colSpan={3}
                className="bg-[#E49191]/15 text-[#C72030] border border-[#C4B89D]/50 p-3 text-center font-bold text-sm"
              >
                WEAKNESSES
              </th>
            </tr>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[6%]">
                ID
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                Headline
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[24%]">
                Detail
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[6%]">
                ID
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                Headline
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[24%]">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxSW }).map((_, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#798C5E]">
                  {strengths[i] ? `S${i + 1}` : ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {strengths[i]?.headline || ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {strengths[i]?.explanation || ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#C72030]">
                  {weaknesses[i] ? `W${i + 1}` : ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {weaknesses[i]?.headline || ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {weaknesses[i]?.explanation || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr>
              <th
                colSpan={3}
                className="bg-[#DA7756]/10 text-[#DA7756] border border-[#C4B89D]/50 p-3 text-center font-bold text-sm"
              >
                OPPORTUNITIES
              </th>
              <th
                colSpan={3}
                className="bg-[#EDC488]/20 text-[#B8860B] border border-[#C4B89D]/50 p-3 text-center font-bold text-sm"
              >
                THREATS
              </th>
            </tr>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[6%]">
                ID
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                Headline
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[24%]">
                Detail
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[6%]">
                ID
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[20%]">
                Headline
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[24%]">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxOT }).map((_, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#DA7756]">
                  {opportunities[i] ? `O${i + 1}` : ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {opportunities[i]?.headline || ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {opportunities[i]?.explanation || ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#B8860B]">
                  {threats[i] ? `T${i + 1}` : ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {threats[i]?.headline || ""}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {threats[i]?.explanation || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LEEnhancementsTab: React.FC = () => {
  const enhancementRoadmap =
    loyaltyEngineData.extendedContent?.detailedRoadmap?.enhancementRoadmap ||
    [];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Enhancement Roadmap
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Each row shows: current behaviour → enhanced behaviour with integration
        type. AI/MCP innovations highlighted.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#F6F4EE] text-[#DA7756] font-semibold">
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[3%]">
                #
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[8%]">
                Module
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[10%]">
                Feature
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[22%]">
                How It Currently Works
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[25%]">
                Enhanced Version
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[12%]">
                Integration Type
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[5%]">
                Effort
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[5%]">
                Impact
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[5%]">
                Priority
              </th>
              <th className="border border-[#C4B89D]/50 p-2 text-center w-[5%]">
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {enhancementRoadmap.map((item, idx) => (
              <tr
                key={idx}
                className={
                  item.priority === "P0"
                    ? "bg-[#DA7756]/10"
                    : idx % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center ${item.priority === "P0" ? "font-semibold" : ""}`}
                >
                  {item.rowId}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 font-semibold text-[#2C2C2C]">
                  {item.module}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 ${item.priority === "P0" ? "font-semibold text-[#DA7756]" : "text-[#2C2C2C] font-medium"}`}
                >
                  {item.featureName}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {item.currentStatus}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {item.enhancedVersion}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center font-semibold text-[#DA7756] whitespace-pre-line">
                  {item.integrationType}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80">
                  {item.effort}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80 font-medium">
                  {item.impact}
                </td>
                <td
                  className={`border border-[#C4B89D]/50 p-2 text-center font-semibold ${item.priority === "P0" ? "text-[#C72030]" : item.priority === "P1" ? "text-[#D97706]" : "text-[#6B21A8]"}`}
                >
                  {item.priority}
                </td>
                <td className="border border-[#C4B89D]/50 p-2 text-center text-[#2C2C2C]/80 whitespace-pre-line">
                  {item.owner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LEAssetsTab: React.FC = () => {
  const assets = loyaltyEngineData.assets || [];
  const credentials = loyaltyEngineData.credentials || [];
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {loyaltyEngineData.name} - Assets & Credentials
        </h2>
      </div>

      {assets.length > 0 && (
        <div className="space-y-4">
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins">
            Product Assets
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset, i) => (
              <a
                key={i}
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-[#C4B89D]/50 rounded-xl p-4 bg-white hover:bg-[#F6F4EE] transition-all group"
              >
                <div className="text-[#DA7756]">{asset.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-[#2C2C2C] text-sm font-poppins">
                    {asset.title}
                  </p>
                  <p className="text-[10px] text-[#2C2C2C]/50 font-poppins">
                    {asset.type}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[#2C2C2C]/30 group-hover:text-[#DA7756] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {credentials.length > 0 && (
        <div className="space-y-4">
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins flex items-center gap-2">
            <Lock className="w-4 h-4" /> Secure Access Credentials
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((cred, i) => (
              <div
                key={i}
                className="border border-[#C4B89D]/50 rounded-xl p-4 bg-white space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="text-[#DA7756]">{cred.icon}</div>
                  <p className="font-semibold text-[#2C2C2C] text-sm font-poppins">
                    {cred.title}
                  </p>
                </div>
                <div className="text-[11px] font-poppins space-y-1">
                  <p>
                    <span className="text-[#2C2C2C]/50">URL:</span>{" "}
                    <span className="text-[#DA7756]">{cred.url}</span>
                  </p>
                  <p>
                    <span className="text-[#2C2C2C]/50">ID:</span>{" "}
                    <span className="text-[#2C2C2C]/80 font-medium">
                      {cred.id}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#2C2C2C]/50">Pass:</span>{" "}
                    <span className="text-[#2C2C2C]/80 font-medium">
                      {cred.pass}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loyaltyEngineData.owner && (
        <div className="space-y-4">
          <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm font-poppins flex items-center gap-2">
            <User className="w-4 h-4" /> Product Owner
          </div>
          <div className="border border-[#C4B89D]/50 rounded-xl p-4 bg-white flex items-center gap-4">
            {loyaltyEngineData.ownerImage && (
              <img
                src={loyaltyEngineData.ownerImage}
                alt={loyaltyEngineData.owner}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#C4B89D]/50"
              />
            )}
            <div>
              <p className="font-semibold text-[#2C2C2C] text-lg font-poppins">
                {loyaltyEngineData.owner}
              </p>
              <p className="text-[11px] text-[#2C2C2C]/50 font-poppins">
                Product Owner — {loyaltyEngineData.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== MAIN PAGE COMPONENT ==============

const LoyaltyEnginePage: React.FC = () => {
  return (
    <BaseProductPage
      productData={loyaltyEngineData}
      tabsVariant="snag360"
      customTabContent={{
        summary: <LESummaryTab />,
        features: <LEFeaturesTab />,
        market: <LEMarketTab />,
        pricing: <LEPricingTab />,
        usecases: <LEUseCasesTab />,
        roadmap: <LERoadmapTab />,
        business: <LEBusinessPlanTab />,
        gtm: <LEGTMTab />,
        metrics: <LEMetricsTab />,
        swot: <LESWOTTab />,
        enhancements: <LEEnhancementsTab />,
        assets: <LEAssetsTab />,
      }}
    />
  );
};

export default LoyaltyEnginePage;
