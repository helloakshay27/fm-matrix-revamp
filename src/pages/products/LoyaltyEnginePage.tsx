import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { 
  FileText, 
  Settings,
} from "lucide-react";

/**
 * Loyalty Engine Product Data
 * ID: 13
 */
const loyaltyEngineData: ProductData = {
  name: "Loyalty Engine",
  description: "A configurable system designed to automatically apply loyalty rewards, points, or benefits based on predefined business rules, without requiring code changes.",
  brief: "Evaluates user actions like payments, referrals, and bookings using logical operatives to trigger automated rewards and custom business logic.",
  excelLikeSummary: true,
  excelLikeFeatures: true,
  excelLikeMarket: true,
  excelLikePricing: false,
  excelLikeBusinessPlan: true,
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
      summarySubtitle: "Investor & Partner Brief | Readable in under 5 minutes",
      identity: [
        { field: "Product", detail: "Loyalty Rule Engine" },
        { field: "Type", detail: "B2B SaaS - configurable loyalty and rewards management platform" },
        { field: "Core function", detail: "Enables businesses to design, automate, and manage end-to-end customer loyalty programmes through configurable business rules." },
        { field: "Deployment model", detail: "Cloud-hosted SaaS; integrates with existing CRM (Salesforce), accounting systems, and third-party APIs." }
      ],
      whoItIsFor: [
        {
          role: "Primary buyer",
          useCase: "Chief Marketing Officer, VP Marketing, Head of Customer Experience, VP Sales",
          frustration: "Loyalty initiatives remain fragmented across marketing, CRM, and finance tools.",
          gain: "One configurable system to launch and scale reward logic across the business."
        },
        {
          role: "Primary user",
          useCase: "Marketing / CRM teams, loyalty programme managers, finance operations",
          frustration: "Teams rely on spreadsheets and manual coordination to run schemes and redemptions.",
          gain: "Centralised rule design, wallet accounting, redemption control, and reporting."
        },
        {
          role: "Company profile",
          useCase: "Mid-to-large enterprises in transaction-heavy or high-value-purchase industries like real estate and retail",
          frustration: "High-value journeys need precise reward logic, but current systems are rigid or disconnected.",
          gain: "Flexible loyalty orchestration without replacing the existing CRM or finance stack."
        },
        {
          role: "Geography",
          useCase: "India (primary); Global (secondary - markets with mature loyalty programme adoption)",
          frustration: "Cross-market programme rollouts are slowed by bespoke logic and integration effort.",
          gain: "A reusable rule-driven platform with localisation through configuration instead of rebuilds."
        }
      ],
      problemSolves: [
        {
          painPoint: "Pain 1",
          solution: "Loyalty programmes in complex industries like real estate, banking, and retail are managed in spreadsheets or disconnected systems."
        },
        {
          painPoint: "Pain 2",
          solution: "Businesses cannot close the loop between earning and redemption. Points sit idle, customers disengage, and programme value falls." 
        },
        {
          painPoint: "Pain 3",
          solution: "Finance teams have no safe mechanism to manage the liability of outstanding loyalty points, especially when rewards map to escrow-like balances."
        },
        {
          painPoint: "Pain 4",
          solution: "Marketing campaigns are batch-and-blast. There is no system to trigger personalised rewards based on transactions, behaviour, milestones, or segments."
        }
      ],
      today: [
        { dimension: "Live deployments", state: "1 major real estate developer - fully live in production as of 2026" },
        { dimension: "Pipeline", state: "2 additional clients in active pipeline across adjacent industries not yet disclosed" },
        { dimension: "Integrations built", state: "Salesforce CRM (bi-directional), third-party reward partner APIs, mobile app SDK" },
        { dimension: "Stage", state: "Early commercial - product is proven, reference client exists, now scaling GTM" }
      ],
      summaryFeatureModules: [
        { label: "Set Up", detail: "Tier management (Bronze / Silver / Gold or custom tiers based on spend, points, or engagement)" },
        { label: "Rules Engine", detail: "User actions, transaction events, time-based events, user demographics and segments, and engagement-based triggers" },
        { label: "Wallet", detail: "Cold wallet for long-term point storage, transaction ledger, full audit trail of all point activity, and earn logic" },
        { label: "Redemption Store", detail: "Personalised mobile redemption page with vouchers, lounge access, experiences, travel, ticketing, and other reward options" },
        { label: "Admin", detail: "Escrow wallet for finance liability buffer, mark-to-market liability view, account statement, and admin controls" },
        { label: "Integrations", detail: "CRM integration (Salesforce) and accounting integration for financial data sync across points cost and liability" }
      ],
      summaryUsps: [
        { label: "No-code rule builder", detail: "7-dimensional rules engine across actions, transactions, time, segments, behaviour, milestones, and tiers." },
        { label: "Escrow / liability", detail: "Built-in 25% float escrow wallet with mark-to-market balance, tailored for regulated or finance-sensitive industries." },
        { label: "Cold wallet", detail: "Long-term point storage separates liability from active redemption pool and gives better control over redemption velocity." },
        { label: "Full redemption catalogue", detail: "7 redemption types including vouchers, experiences, travel, merchandise, lounge access, enchantment, and personalised rewards." },
        { label: "Transaction-event triggers", detail: "Points logic fires directly from payment and transaction events including amount, timing, and instalment stage." },
        { label: "CRM-native integration", detail: "Built for Salesforce-first organisations, so the loyalty layer sits on top of the existing stack without rip-and-replace." }
      ],
      tractionMilestones: [
        { label: "Live client", detail: "1 major real estate developer using the full platform with live redemption in 2026" },
        { label: "Rules in production", detail: "Across 6 categories: possession, collections, referrals, sales and booking, marketing engagement, and app usage" },
        { label: "Redemption active", detail: "Enchantment and featured product redemption live, with customers actively redeeming points against real rewards" },
        { label: "Pipeline", detail: "2 clients in commercial discussion - pipeline value not disclosed" },
        { label: "Next milestone", detail: "Sign client #2 and expand into one adjacent vertical such as hospitality or banking" }
      ],
    },
    detailedFeatures: [
      {
        module: "Set Up",
        feature: "Tier Management",
        subFeatures: "",
        works: "Create and configure multi-level membership tiers such as Bronze, Silver, and Gold based on customer spend, points earned, or engagement milestones. Tier thresholds, benefits, and upgrade or downgrade logic are fully configurable within the system.",
        userType: "Marketing / CRM Admin",
        usp: false,
        status: "Live",
        priority: "P1",
        notes: "Foundation of the programme; all rules and rewards reference tier level. Supports unlimited tiers."
      },
      {
        module: "Set Up",
        feature: "Membership Management",
        subFeatures: "",
        works: "Manages the full membership lifecycle with member registration, unique ID assignment, status updates, benefits assignment, and access control within the loyalty programme. Supports auto-enrolment on first purchase or referral.",
        userType: "CRM Admin / Ops",
        usp: false,
        status: "Live",
        priority: "P1",
        notes: "Auto-assigns membership tier on registration. Syncs with CRM member records bidirectionally."
      },
      {
        module: "Rules Engine",
        feature: "User Actions - Rules",
        subFeatures: "",
        works: "Define rules that trigger rewards, points credits, tier changes, or notifications when a customer performs a specific action such as app download, site visit, registration, or feedback submission. Multi-condition logic supported.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: No-code action-to-reward mapping. Covers app, CRM, and web-triggered events simultaneously."
      },
      {
        module: "Rules Engine",
        feature: "Transaction Events - Rules",
        subFeatures: "",
        works: "Configure rules that fire on specific payment or purchase events, for example reward points per INR 1,000 spent, reward early payment within N days of demand note, or penalise delayed payments. Supports instalment-stage-specific logic.",
        userType: "Marketing / Finance",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Direct integration with payment events, demand note, lock-in payment, full payment, and more. Critical for high-value, long-cycle purchases like real estate or auto."
      },
      {
        module: "Rules Engine",
        feature: "Time-Based Events - Rules",
        subFeatures: "",
        works: "Automate time-sensitive reward triggers such as homeownership anniversaries, festive season bonuses, point expiry warnings, and promotional windows. Rules fire automatically based on date conditions.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Fully automated, no manual campaign execution needed. Handles recurring and one-off date triggers."
      },
      {
        module: "Rules Engine",
        feature: "User Demographics / Segments - Rules",
        subFeatures: "",
        works: "Target distinct customer groups with differentiated reward rules based on demographic attributes such as age, location, gender, income band, or behavioural segments. Enables personalised reward logic without manual list management.",
        userType: "Marketing / CRM",
        usp: true,
        status: "Live",
        priority: "P2",
        notes: "USP: Segment-level rule configuration reduces blanket reward spend and improves campaign ROI."
      },
      {
        module: "Rules Engine",
        feature: "Engagement / Behaviour - Rules",
        subFeatures: "",
        works: "Track and respond to customer engagement signals such as app logins, browsing patterns, email open events, chatbot interactions, social media activity, and usage frequency. Trigger rewards or notifications based on behaviour thresholds.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P2",
        notes: "USP: Bridges offline and digital behaviour into a unified reward trigger, unlike most loyalty platforms that cover only transactional triggers."
      },
      {
        module: "Rules Engine",
        feature: "Milestones - Rules",
        subFeatures: "",
        works: "Award automatic rewards when customers hit predefined achievement milestones such as number of purchases, total lifetime spend, number of referrals closed, or specific interaction counts. Milestone logic is configurable per programme.",
        userType: "Marketing Team",
        usp: true,
        status: "Live",
        priority: "P2",
        notes: "USP: Milestone engine drives long-term engagement and gamification, not just transactional loyalty."
      },
      {
        module: "Rules Engine",
        feature: "Tier-Based - Rules",
        subFeatures: "",
        works: "Create differentiated reward rules that apply only to customers in specific tiers. Higher-tier customers can earn more points per transaction, unlock exclusive redemption categories, and receive priority benefits automatically.",
        userType: "Marketing / Product",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Multi-level tier-based differentiation across 7 rule dimensions is a significant technical and UX advantage over single-tier loyalty systems."
      },
      {
        module: "Wallet",
        feature: "Cold Wallet",
        subFeatures: "",
        works: "A secure, separate storage pool for loyalty points that are not immediately redeemable. Points in the cold wallet are held for future use, controlling the pace at which customers can redeem and protecting the company cash flow and redemption liability.",
        userType: "Finance / Admin",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Cold wallet is a unique mechanism for managing redemption velocity, particularly valuable for high-liability programmes in real estate and finance."
      },
      {
        module: "Wallet",
        feature: "Transaction Ledger",
        subFeatures: "",
        works: "A full digital audit trail of every loyalty point movement including points earned, redeemed, transferred, expired, and adjusted. Provides transparency to both customers and business administrators. Exportable for accounting reconciliation.",
        userType: "Finance / Admin / Customer",
        usp: false,
        status: "Live",
        priority: "P1",
        notes: "Critical for compliance and financial reconciliation. Feeds into accounting integration. Customer-facing view available."
      },
      {
        module: "Redemption Store",
        feature: "Personalised Mobile Redemption Page",
        subFeatures: "",
        works: "A dynamically personalised redemption interface served to each customer via mobile app. Content, offers, and available rewards are tailored based on the customer's tier, point balance, purchase history, and preferences.",
        userType: "Customer / Marketing",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Personalised redemption instead of a catalogue-for-all approach drives significantly higher redemption rates and customer satisfaction."
      },
      {
        module: "Redemption Store",
        feature: "Vouchers",
        subFeatures: "",
        works: "Issue and manage digital vouchers redeemable for discounts, complimentary services, or partner offers. Vouchers are generated by the rule engine based on customer actions or tier status, and can be redeemed digitally.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P1",
        notes: "Supports branded and partner vouchers. Expiry, usage limits, and eligibility rules configurable."
      },
      {
        module: "Redemption Store",
        feature: "Lounge Access",
        subFeatures: "",
        works: "Grant premium experience rewards such as airport lounge access, members-only spaces, or partner VIP areas to qualifying customers based on tier or point balance. Access is triggered automatically by the rule engine.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes: "Differentiating reward for high-tier customers. Requires third-party lounge partnership agreements."
      },
      {
        module: "Redemption Store",
        feature: "Experiences",
        subFeatures: "",
        works: "Enable customers to redeem points for unique non-product experiences such as spa treatments, hotel stays, international sightseeing, curated events, and premium experiences. Expands the perceived value of the loyalty programme beyond discounts.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes: "Particularly effective for premium and luxury brand segments. Requires curation and partner relationships."
      },
      {
        module: "Redemption Store",
        feature: "Travel & Ticketing",
        subFeatures: "",
        works: "Allow customers to redeem points for travel-related rewards including flight tickets, hotel bookings, train or bus tickets, event and concert tickets, and travel packages. Integrates with travel booking partners.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes: "High aspirational value for customers. Drives higher programme engagement. Requires travel API integration."
      },
      {
        module: "Redemption Store",
        feature: "Merchandise",
        subFeatures: "",
        works: "Physical product redemption including consumer electronics, branded merchandise, watches, gifting articles, and lifestyle products. Products are managed in the redemption store catalogue and fulfilled via logistics partners.",
        userType: "Customer / Marketing",
        usp: false,
        status: "Live",
        priority: "P2",
        notes: "Catalogue management and logistics fulfilment need operational setup. High perceived reward value."
      },
      {
        module: "Redemption Store",
        feature: "Encashment",
        subFeatures: "",
        works: "Convert accumulated loyalty points directly into cash credited to the customer's bank account or as a monetary offset on outstanding dues. Provides maximum flexibility for customers who prefer cash over product rewards.",
        userType: "Customer / Finance",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Cash encashment is the highest-value and most flexible redemption mechanism, particularly powerful in real estate where customers have large outstanding payments."
      },
      {
        module: "Admin",
        feature: "Escrow Wallet",
        subFeatures: "",
        works: "A holding account that maintains a mandatory 25% float of total outstanding loyalty points as a financial buffer. The master account must maintain a mark-to-market balance in the float to cover uncompleted or pending redemption transactions, ensuring financial safety and compliance.",
        userType: "Finance / CFO / Admin",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Built-in financial controls for loyalty liability management. Unique feature with strong appeal to CFOs and finance teams in regulated industries. No comparable open-market loyalty platform offers this."
      },
      {
        module: "Admin",
        feature: "Account Statement",
        subFeatures: "",
        works: "Administrators can view, filter, export, and reconcile comprehensive account statements for any customer, showing points earned, redeemed, adjusted, and current balance across any time period. Supports audit, dispute resolution, and customer service operations.",
        userType: "Admin / Finance / Customer Service",
        usp: false,
        status: "Live",
        priority: "P1",
        notes: "Essential for operations and compliance. Supports both customer-level and programme-level reporting."
      },
      {
        module: "Integrations",
        feature: "CRM Integration (Salesforce)",
        subFeatures: "",
        works: "Bidirectional sync between the loyalty platform and Salesforce CRM. Customer profile updates, transaction events, demand notes, payment records, referral data, and membership status flow automatically between systems, eliminating manual data entry and ensuring real-time rule execution and customer experience.",
        userType: "CRM / IT / Marketing Ops",
        usp: true,
        status: "Live",
        priority: "P1",
        notes: "USP: Deep Salesforce integration, not surface-level. Supports 12+ API endpoints covering members, demand notes, payments, referrals, home loan, testimonial surveys, and more."
      },
      {
        module: "Integrations",
        feature: "Accounting Integration",
        subFeatures: "",
        works: "Connects the loyalty platform to accounting software such as Tally, SAP, or equivalent. Automatically transfers financial data including cost of rewards issued, points liability, redemption transactions, and escrow balance into the company's general ledger for accurate P&L and balance sheet management.",
        userType: "Finance / Accounts",
        usp: false,
        status: "Roadmap",
        priority: "P2",
        notes: "Critical for CFO buy-in. Accurate cost accounting of loyalty liability is a common blocker in enterprise sales. API structure is in place; accounting connector to be completed."
      }
    ],
    detailedUseCases: {
      industryUseCases: [
        {
          rank: "1",
          industry: "Real Estate & Property Development",
          features: "AI modules fully applicable.\nTeams: Sales, CRM, Collections, Marketing, Finance.\nFeatures: Transaction Events (demand note/payment triggers), Milestones, Tier Management, Encashment, Escrow Wallet, CRM Integration, Referral rules, Time-Based Events.",
          useCase: "Incentivise customers to pay demand notes early, refer new buyers, book registrations through app, give feedback, complete digital documentation, and attend possession on time. Rule engine fires on each payment event with configured point awards. Points are encashed against outstanding dues or redeemed for rewards.",
          profile: "India: Mid-to-large developers with 500+ units/year, 200 Cr+ revenue, Tier 1/2 cities, Salesforce or similar CRM in use.\nGlobal: Developer groups in GCC, SEA, and UK with loyalty or referral programmes.",
          companyProfile: "India: Mid-to-large developers with 500+ units/year, 200 Cr+ revenue, Tier 1/2 cities, Salesforce or similar CRM in use.\nGlobal: Developer groups in GCC, SEA, and UK with loyalty or referral programmes.",
          currentTool: "Manual Excel tracking, basic CRM loyalty modules, or no system. Some use Xoxoday / Plum for vouchers only.",
          urgency: "HIGH - Referral and early-payment incentives directly impact collections TAT and sales velocity. No comparable vertical tool exists for real estate.",
          primaryBuyer: "Buyer: VP Sales / CMO - measured on referral lead volume, collections TAT, NPS.",
          primaryUser: "User: CRM Manager / Collections Team - daily frustration: manually tracking who paid early and following up.",
        },
        {
          rank: "2",
          industry: "Banking, Financial Services & Insurance (BFSI)",
          features: "Rules Engine (Transaction events, milestones, segment-based), Wallet, Redemption Store, Admin (escrow), CRM Integration.\nTeams: Retail banking, credit cards, insurance renewals, wealth management.",
          useCase: "Banks push loyalty on EMI payment on time, SIP top-ups, insurance renewal, app transactions, and cross-sell product uptake. Segment rules target HNI vs mass retail separately. Milestones reward relationship depth, such as a 5-year banking anniversary. Escrow wallet provides RBI-compliant liability buffer.",
          profile: "India: Private/mid-size banks, NBFCs, insurance companies with 50,000+ customers and a digital-first strategy.\nGlobal: Challenger banks, fintech lenders, digital-first insurers in UK, SEA, and Middle East.",
          companyProfile: "India: Private/mid-size banks, NBFCs, insurance companies with 50,000+ customers and a digital-first strategy.\nGlobal: Challenger banks, fintech lenders, digital-first insurers in UK, SEA, and Middle East.",
          currentTool: "Proprietary in-house loyalty systems, Fiserv, Comviva, or Salesforce Financial Services Cloud with basic loyalty modules.",
          urgency: "HIGH - RBI and IRDAI are pushing financial institutions to improve customer retention metrics. Loyalty drives cross-sell and reduces churn on high-margin products.",
          primaryBuyer: "Buyer: Chief Customer Officer / Head of Retail Banking - measured on AUM growth, NPS, product cross-sell rate.",
          primaryUser: "User: Digital Banking / Loyalty Team - daily frustration: configuring different rules for segment-specific rewards vs referral campaigns.",
        },
        {
          rank: "3",
          industry: "Automotive (New & Pre-Owned Vehicles)",
          features: "Transaction Events (purchase milestones), Time-Based Events (service reminders, anniversary), Milestones, Tier Management, Vouchers, Experiences, Merchandise.\nTeams: Sales, Aftersales/Service, CRM.",
          useCase: "Award points on vehicle purchase, service visits, accessory purchases, insurance renewal through dealership, test-drive completion, and buyer referrals. Tier-based rules unlock service perks such as free pick-and-drop and priority service bay. Time-based triggers push service reminders and bonus points if service is booked within 7 days.",
          profile: "India: OEMs with dealer networks (500+ dealerships) or large multi-brand dealer groups.\nGlobal: OEM loyalty programmes in EU, USA, and GCC, especially EV brands building long-term owner relationships.",
          companyProfile: "India: OEMs with dealer networks (500+ dealerships) or large multi-brand dealer groups.\nGlobal: OEM loyalty programmes in EU, USA, and GCC, especially EV brands building long-term owner relationships.",
          currentTool: "Salesforce Automotive Cloud, CDK Global, Dealertrack, or basic CRM with manual rewards.",
          urgency: "HIGH - Aftersales revenue is the highest-margin revenue stream for dealers. Loyalty directly drives repeat service visits and reduces attrition to independents.",
          primaryBuyer: "Buyer: Head of Aftersales / CMO at OEM or dealer group - measured on service revenue per vehicle retained.",
          primaryUser: "User: CRM / Service Advisor - daily frustration: no automated way to reward loyal service customers or flag service anniversaries.",
        },
        {
          rank: "4",
          industry: "Hospitality (Hotels, Resorts & Clubs)",
          features: "Tier Management, Transaction Events (stay value), Time-Based Events (anniversary stays, seasonal promos), Experiences, Lounge, Travel & Ticketing, Personalised Mobile Redemption.\nTeams: Front Office, Revenue, Marketing.",
          useCase: "Classic points-per-night stay, with rule engine adding bonus points for direct booking vs OTA, tier upgrades on stay frequency, time-based double-points weekends, and milestone rewards for the 10th stay. Mobile redemption shows personalised offers at check-in. Lounge and experience redemption drive ancillary spend.",
          profile: "India: Hotel chains (50+ properties) or premium standalone resorts and clubs. International tourist resort brands.\nGlobal: Boutique hotel groups in EU/UK and luxury resort chains in SEA and GCC.",
          companyProfile: "India: Hotel chains (50+ properties) or premium standalone resorts and clubs. International tourist resort brands.\nGlobal: Boutique hotel groups in EU/UK and luxury resort chains in SEA and GCC.",
          currentTool: "Oracle Hospitality OPERA Loyalty, Alijsys LMS, or major chain proprietary systems (Marriott Bonvoy, IHG One).",
          urgency: "MEDIUM - Most large chains have loyalty; the opportunity is mid-market hotels that cannot afford enterprise platforms but lose direct booking to OTA.",
          primaryBuyer: "Buyer: VP Revenue / Director of Marketing - measured on direct booking share, RevPAR, repeat guest rate.",
          primaryUser: "User: CRM / Front Office Manager - daily frustration: loyalty rules are locked in legacy PMS and cannot be adjusted for campaigns.",
        },
        {
          rank: "5",
          industry: "Retail (Organised & E-Commerce)",
          features: "Transaction Events (purchase amount triggers), User Demographics/Segments, Engagement/Behaviour, Milestones, Vouchers, Merchandise, Personalised Mobile Redemption.\nTeams: Marketing, Category, Digital, CRM.",
          useCase: "Capitalise on repeat purchase behaviour, VIP member perks, and personalised mobile offers based on cart value, category browsing, abandoned cart, and D2C brand loyalty. App-based rewards can drive repeat purchases, while personalised vouchers and flash deals inside the redemption store auto-activate for Diwali, EOSS, and category campaigns.",
          profile: "India: Organised retail chains (100+ stores), D2C brands with 100K+ customers, omni-channel retailers.\nGlobal: Mid-market retail groups in UK, USA, and SEA building postcode and first-party-data loyalty.",
          companyProfile: "India: Organised retail chains (100+ stores), D2C brands with 100K+ customers, omni-channel retailers.\nGlobal: Mid-market retail groups in UK, USA, and SEA building postcode and first-party-data loyalty.",
          currentTool: "Capillary Technologies, LoyaltyLion, Yotpo, or Salesforce Loyalty Management.",
          urgency: "MEDIUM - Large retailers already have loyalty. The opportunity is mid-market retailers and D2C brands that outgrow basic loyalty plugins but cannot afford full-suite enterprise platforms.",
          primaryBuyer: "Buyer: CMO / Head of CRM - measured on repeat purchase rate, CLV, points liability vs redemption rate.",
          primaryUser: "User: CRM Manager - daily frustration: cannot configure rules for different product categories without IT help.",
        },
        {
          rank: "6",
          industry: "Healthcare & Wellness",
          features: "Time-Based Events (appointment reminders + bonus), User Demographics/Segments, Milestones, Engagement/Behaviour, Vouchers, Experiences.\nTeams: Patient Experience, Marketing, Operations.",
          useCase: "Reward patients for annual health-check attendance, gym and wellness-centre visits, health-app engagement, medication adherence for chronic disease management, and referral of family members. Time-based rules trigger anniversary bonuses on policy or membership renewal date. Segment rules target different age groups with relevant health rewards.",
          profile: "India: Hospital chains (Apollo, Max, Fortis scale), wellness-centre chains, health-insurance companies, pharmacies.\nGlobal: Health-insurance loyalty (UK: Vitality model), wellness chains in USA and GCC.",
          companyProfile: "India: Hospital chains (Apollo, Max, Fortis scale), wellness-centre chains, health-insurance companies, pharmacies.\nGlobal: Health-insurance loyalty (UK: Vitality model), wellness chains in USA and GCC.",
          currentTool: "Basic in-house CRM modules, Salesforce Health Cloud with limited loyalty functionality.",
          urgency: "MEDIUM - Preventive healthcare engagement is a regulatory and commercial priority. Loyalty drives adherence and repeat visits, but messaging and compliance make current systems rigid.",
          primaryBuyer: "Buyer: Chief Patient Experience Officer / Head of Marketing - measured on appointment attendance rate and preventive-care uptake.",
          primaryUser: "User: Patient Engagement / CRM Team - daily frustration: appointment reminders and wellness campaigns are manual, low-personalisation, and hard to tie to reward logic.",
        },
        {
          rank: "7",
          industry: "Education (Higher Education & EdTech)",
          features: "Milestones, Engagement/Behaviour, Time-Based Events, User Demographics/Segments, Vouchers, Experiences.\nTeams: Admissions, Student Success, Alumni Relations.",
          useCase: "Award points to students for course-completion milestones, assignment submissions, peer mentoring, event attendance, and alumni referrals. EdTech platforms reward course purchases, review submissions, and community engagement. Alumni programmes use milestones and tier-based rules to drive donations or mentor referrals.",
          profile: "India: Top-tier private universities, EdTech platforms (100K+ active learners), professional certification bodies.\nGlobal: Online learning platforms (US, UK) and university alumni programmes.",
          companyProfile: "India: Top-tier private universities, EdTech platforms (100K+ active learners), professional certification bodies.\nGlobal: Online learning platforms (US, UK) and university alumni programmes.",
          currentTool: "Manual alumni CRM, Salesforce Education Cloud, or Gainsight for student success.",
          urgency: "MEDIUM - EdTech is fighting high drop-off rates. Loyalty mechanics such as streaks, milestones, and rewards improve course completion and alumni giving.",
          primaryBuyer: "Buyer: VP Student Experience / Head of Alumni Relations - measured on course-completion rate, NPS, and alumni-giving rate.",
          primaryUser: "User: Student Success / Community Manager - daily frustration: no automated way to reward referrals or learning milestones.",
        },
        {
          rank: "8",
          industry: "Telecommunications",
          features: "Transaction Events (recharge/top-up), Time-Based Events (plan anniversary), Milestones, Segments, Vouchers, Merchandise.\nTeams: Retention, CRM, Digital.",
          useCase: "Points on recharge value and frequency, upgrades for long-tenure subscribers, time-based double points on recharge anniversaries, and milestone rewards for 2-year and 5-year subscriber anniversaries. Segment-based rules deploy retention offers to churn-prone prepaid/postpaid users and high-ARPU users.",
          profile: "India: Regional telcos and MVNOs, Airtel/Vi/BSNL partners.\nGlobal: MVNOs in UK/EU and telecom operators in GCC and SEA building differentiation beyond price.",
          companyProfile: "India: Regional telcos and MVNOs, Airtel/Vi/BSNL partners.\nGlobal: MVNOs in UK/EU and telecom operators in GCC and SEA building differentiation beyond price.",
          currentTool: "Comviva Mobility / proprietary BSS/OSS loyalty modules.",
          urgency: "LOW-MEDIUM - Future opportunity as regional operators and MVNOs look to increase engagement for high-value postpaid users and reduce churn.",
          primaryBuyer: "Buyer: Chief Marketing / Retention Head - measured on churn rate, ARPU, NPS.",
          primaryUser: "User: Retention Team - daily frustration: cannot trigger personalised retention offers based on tenure, spend, and customer segment.",
        },
        {
          rank: "9",
          industry: "Airlines & Travel",
          features: "Transaction Events (ticket value), Tier Management, Time-Based Events, Milestones, Travel & Ticketing, Lounge, Experiences.\nTeams: Loyalty, Revenue, Marketing.",
          useCase: "Classic FFP-style engine with bonus miles on premium-cabin booking, tier-status upgrades, time-based promotion miles, and milestone rewards for the 50th flight. Rule engine allows promo configuration without IT. Mobile redemption supports companion tickets, lounge access, and partner travel offers.",
          profile: "India: Regional carriers, charter airlines, travel aggregators with membership programmes.\nGlobal: LCCs in SEA and GCC building differentiated loyalty on limited budgets.",
          companyProfile: "India: Regional carriers, charter airlines, travel aggregators with membership programmes.\nGlobal: LCCs in SEA and GCC building differentiated loyalty on limited budgets.",
          currentTool: "Comarch Loyalty, Cendyn, or proprietary airline PSS loyalty modules.",
          urgency: "LOW - Major airlines have entrenched loyalty platforms. Opportunity is LCCs, charter operators, and travel aggregators that need configurable rewards at smaller scale.",
          primaryBuyer: "Buyer: Head of Loyalty / CCO - measured on redemption rate and partner revenue per customer.",
          primaryUser: "User: Loyalty Operations Manager - daily frustration: promotional rule changes take weeks without IT.",
        },
        {
          rank: "10",
          industry: "FMCG & Consumer Goods",
          features: "Engagement/Behaviour, Milestones, User Demographics/Segments, Vouchers, Merchandise, Personalised Mobile Redemption.\nTeams: Trade Marketing, D2C, CRM.",
          useCase: "B2C programmes reward end consumers via app for purchase scans, brand engagement, referrals, and social sharing. B2B programmes reward retailers and distributors for volume milestones, early payment, and compliance with planogram or brand standards. One rule engine can run both customer and channel-partner loyalty from a single platform.",
          profile: "India: FMCG companies with D2C ambition or modern-trade loyalty programmes and 100 Cr+ annual marketing spend.\nGlobal: Consumer-goods companies in SEA and Africa building direct consumer relationships.",
          companyProfile: "India: FMCG companies with D2C ambition or modern-trade loyalty programmes and 100 Cr+ annual marketing spend.\nGlobal: Consumer-goods companies in SEA and Africa building direct consumer relationships.",
          currentTool: "Salesforce Loyalty Management, Capillary, or custom-built channel-partner loyalty tools.",
          urgency: "LOW-MEDIUM - D2C loyalty for FMCG is still nascent in India. B2B channel loyalty is under-served and highly rule-complexity-dependent.",
          primaryBuyer: "Buyer: Head of Trade Marketing / D2C Head - measured on sell-through rate, retailer NPS, and D2C repeat-purchase rate.",
          primaryUser: "User: Trade Marketing Manager - daily frustration: distributor incentive calculations are done in Excel and are prone to dispute.",
        }
      ],
      internalTeamUseCases: [
        {
          team: "Marketing / CRM",
          features: "Rules engine (all 7 sub-modules), Tier Management, Personalised Mobile Redemption Page, Time-Based Events, Segments.",
          relevantFeatures: "Rules engine (all 7 sub-modules), Tier Management, Personalised Mobile Redemption Page, Time-Based Events, Segments.",
          process: "Configures earning rules for every campaign without raising an IT ticket. Builds segment-specific rules targeting different customer groups with personalised multiples. Schedules time-based promotions for festive seasons and anniversaries. Reviews rule performance in the admin dashboard.",
          howTheyUse: "Configures earning rules for every campaign without raising an IT ticket. Builds segment-specific rules targeting different customer groups with personalised multiples. Schedules time-based promotions for festive seasons and anniversaries. Reviews rule performance in the admin dashboard.",
          benefit: "Eliminates IT dependency for campaign execution. Personalised reward logic replaces batch-and-blast promotions. Faster campaign go-live from weeks to hours.",
          frequency: "Daily - campaign managers interact with the rule engine every working day.",
          keyPainWithoutTool: "Rules managed in spreadsheets or CRM without automation - manual errors, delayed execution, and no personalisation.",
          collaborationWith: "Sales, Product, IT",
          successMetric: "Redemption rate, points issued per campaign, campaign go-live time"
        },
        {
          team: "Sales Team",
          features: "User Actions (referral rules), Milestones (booking milestones), Transaction Events (token/booking/investment), CRM Integration.",
          relevantFeatures: "User Actions (referral rules), Milestones (booking milestones), Transaction Events (token/booking/investment), CRM Integration.",
          process: "Tracks referral programme performance, including which customers referred and whether the referral converted. Monitors milestone-based incentives for repeat buyers. Uses CRM integration to see loyalty-points status of a prospect before a sales meeting.",
          howTheyUse: "Tracks referral programme performance, including which customers referred and whether the referral converted. Monitors milestone-based incentives for repeat buyers. Uses CRM integration to see loyalty-points status of a prospect before a sales meeting.",
          benefit: "Referral programme drives warm leads with lower paid-acquisition cost. Milestone incentives motivate repeat purchase. Loyalty data provides personalised talking points in sales conversations.",
          frequency: "Daily - sales reps check referral status and point balance during customer follow-up.",
          keyPainWithoutTool: "No visibility into which customers are eligible for referral bonuses or which milestone rewards are about to unlock.",
          collaborationWith: "CRM, Marketing, Finance",
          successMetric: "Referral conversion rate, repeat purchase rate"
        },
        {
          team: "Collections / Finance",
          features: "Transaction Events (demand note / payment date triggers), Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration.",
          relevantFeatures: "Transaction Events (demand note / payment date triggers), Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration.",
          process: "Configures rules that reward customers for paying demand notes within N days. Monitors escrow wallet balance to ensure the 25% float is maintained. Reviews the transaction ledger for reconciliation with accounting records. Generates account statements for dispute resolution.",
          howTheyUse: "Configures rules that reward customers for paying demand notes within N days. Monitors escrow wallet balance to ensure the 25% float is maintained. Reviews the transaction ledger for reconciliation with accounting records. Generates account statements for dispute resolution.",
          benefit: "Incentivised early payment reduces collections TAT and reduces the need for manual follow-up calls. Escrow wallet provides real-time liability visibility for cash-flow planning.",
          frequency: "Daily (transaction events), Weekly (escrow review), Monthly (account statements)",
          keyPainWithoutTool: "No automated incentive mechanism for early payment - collections team manually calls every overdue customer.",
          collaborationWith: "CRM, Finance, IT",
          successMetric: "Collections TAT, % customers paying before due date, escrow balance vs total liability"
        },
        {
          team: "Customer Experience / Service",
          features: "Transaction Ledger, Account Statement, Personalised Mobile Redemption Page, Vouchers, Cold Wallet.",
          relevantFeatures: "Transaction Ledger, Account Statement, Personalised Mobile Redemption Page, Vouchers, Cold Wallet.",
          process: "Resolves customer queries about point balances, missing point credits, and redemption eligibility by accessing the transaction ledger and account statement. Guides customers through the redemption process. Escalates technical issues to IT.",
          howTheyUse: "Resolves customer queries about point balances, missing point credits, and redemption eligibility by accessing the transaction ledger and account statement. Guides customers through the redemption process. Escalates technical issues to IT.",
          benefit: "Self-service account statement and ledger access reduces inbound call volume. Clear audit trail enables fast dispute resolution without escalation.",
          frequency: "Daily - frontline service team queries the ledger multiple times per day.",
          keyPainWithoutTool: "No single source of truth for point transactions - service team checks multiple systems and often cannot resolve queries.",
          collaborationWith: "Marketing, IT, Finance",
          successMetric: "Query resolution time, first-contact resolution rate, customer satisfaction score"
        },
        {
          team: "Integration Team",
          features: "CRM Integration (Salesforce API), Accounting Integration, AI API endpoints.",
          relevantFeatures: "CRM Integration (Salesforce API), Accounting Integration, AI API endpoints.",
          process: "Manages API connections between the loyalty platform and CRM, accounting software, and third-party reward partners. Monitors data-sync health. Implements new integration points as new business rules are added. Supports onboarding of new loyalty programme modules.",
          howTheyUse: "Manages API connections between the loyalty platform and CRM, accounting software, and third-party reward partners. Monitors data-sync health. Implements new integration points as new business rules are added. Supports onboarding of new loyalty programme modules.",
          benefit: "Pre-built API structure with 12+ endpoints reduces custom development effort significantly. Bi-directional CRM sync is production-proven and reduces integration-maintenance burden.",
          frequency: "Weekly (routine monitoring), On-demand (for new rule deployment or integration changes)",
          keyPainWithoutTool: "Building loyalty integrations from scratch on each project - weeks of custom development for each new rule trigger.",
          collaborationWith: "CRM, Marketing, Finance, Product",
          successMetric: "API uptime, sync error rate, integration deployment time"
        },
        {
          team: "Finance / CFO Office",
          features: "Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration, Cold Wallet.",
          relevantFeatures: "Escrow Wallet, Transaction Ledger, Account Statement, Accounting Integration, Cold Wallet.",
          process: "Reviews total loyalty liability against the escrow buffer. Approves point-issuance limits per campaign. Uses accounting integration to ensure loyalty costs are captured in the P&L. Reviews mark-to-market escrow balance monthly for balance-sheet accuracy.",
          howTheyUse: "Reviews total loyalty liability against the escrow buffer. Approves point-issuance limits per campaign. Uses accounting integration to ensure loyalty costs are captured in the P&L. Reviews mark-to-market escrow balance monthly for balance-sheet accuracy.",
          benefit: "Escrow wallet with mandatory 25% float removes the risk of uncontrolled loyalty liability. Real-time liability visibility enables accurate financial planning and prevents cash-flow surprises.",
          frequency: "Monthly (financial review), Quarterly (audit and reconciliation)",
          keyPainWithoutTool: "No controlled mechanism for loyalty liability - uncapped point issuance creates unquantified balance-sheet risk.",
          collaborationWith: "Collections, IT, Marketing",
          successMetric: "Escrow buffer coverage ratio, total loyalty liability vs budget, P&L accuracy of loyalty cost"
        },
        {
          team: "Product / Technology Team",
          features: "All modules - end-to-end product ownership.",
          relevantFeatures: "All modules - end-to-end product ownership.",
          process: "Owns the roadmap for new rule types, redemption categories, and integrations. Configures new modules for each client deployment. Tests rule logic in staging before go-live. Monitors platform performance and resolves bugs. Works with IT and Marketing to translate business requirements into a loyalty-engine configuration.",
          howTheyUse: "Owns the roadmap for new rule types, redemption categories, and integrations. Configures new modules for each client deployment. Tests rule logic in staging before go-live. Monitors platform performance and resolves bugs. Works with IT and Marketing to translate business requirements into a loyalty-engine configuration.",
          benefit: "No-code rule engine reduces engineering load for each new client configuration. Modular architecture allows rapid addition of new redemption types or rule dimensions.",
          frequency: "Daily",
          keyPainWithoutTool: "Each new loyalty requirement requires engineering resources - no self-service configuration layer.",
          collaborationWith: "All teams",
          successMetric: "Time-to-deploy per new client, rule-engine uptime, number of rule types live"
        },
        {
          team: "HR / People Team (for employee referral use)",
          features: "User Actions (employee referral rules), Milestones, Tier Management, Vouchers, Merchandise.",
          relevantFeatures: "User Actions (employee referral rules), Milestones, Tier Management, Vouchers, Merchandise.",
          process: "Uses the loyalty engine to run employee incentive programmes. Awards points to employees who refer candidates that are successfully hired. Configures milestone rewards for work anniversaries, performance milestones, and training completions. Manages reward catalogue for employee redemptions.",
          howTheyUse: "Uses the loyalty engine to run employee incentive programmes. Awards points to employees who refer candidates that are successfully hired. Configures milestone rewards for work anniversaries, performance milestones, and training completions. Manages reward catalogue for employee redemptions.",
          benefit: "Automates employee recognition and referral incentives without manual tracking. Scales recognition across the organisation without proportional HR headcount increase.",
          frequency: "Weekly (programme monitoring), Monthly (milestone awards)",
          keyPainWithoutTool: "Employee referral incentives are tracked manually in Excel - errors in payout, delays in recognition, low participation.",
          collaborationWith: "Sales, Marketing, IT",
          successMetric: "Employee referral hire rate, recognition programme participation rate"
        }
      ]
    },
    detailedRoadmap: {
      structuredRoadmap: [
        {
          timeframe: "Immediate | 0-3 Months",
          headline: "Stop losing deals we should be winning",
          colorContext: "red",
          phaseDescription: "Prioritised by deal impact, market gap, and competitive urgency. Features already fully shipped are excluded.",
          items: [
            {
              whatItIs: "Analytics & Reporting Dashboard - Phase 1",
              whyItMatters: "CMO and VP Marketing buyers ask for programme ROI visibility in every evaluation. Without a dashboard showing redemption rate, points issued vs redeemed, campaign uplift, and top earners/redeemers, we lose to Capillary and Antavo in the final stage of every enterprise deal. Phase 1 = basic dashboard with 10 KPI tiles.",
              unlockedSegment: "All verticals - every enterprise buyer. Immediate impact: real estate, BFSI, automotive. Unlocks CMO-level approval that is currently blocked by this gap.",
              successMetric: "Dashboard live in admin panel. Reduces analytics gap objections in >80% of demos. Enables 2+ deals currently stalled.",
              effort: "Medium (4-6 weeks)",
              priority: "P0 - Critical",
              owner: "Product + Engineering"
            },
            {
              whatItIs: "Accounting / ERP Integration - Tally & SAP Basic Connector",
              whyItMatters: "Finance teams in real estate, BFSI, and enterprise retail require loyalty costs to flow automatically into the GL. Without this, CFO approval takes 2-4 extra months of manual process justification. The API structure is in place - this is a connector build, not a new platform.",
              unlockedSegment: "Real estate developers (Tally-heavy), NBFCs and banks (SAP/Oracle). Directly unlocks enterprise deals where CFO is the final approver. Estimated deal value at risk: Rs30-60L per client.",
              successMetric: "Accounting connector live for at least one ERP (Tally priority). CFO sign-off time reduced by 6-8 weeks per deal.",
              effort: "Medium (5-7 weeks)",
              priority: "P0 - Critical",
              owner: "Engineering + Finance Ops"
            },
            {
              whatItIs: "Rule Engine - Condition Preview & Test Mode",
              whyItMatters: "When a marketing manager configures a complex multi-condition rule, they currently cannot simulate what would happen before going live. A 'test mode' that runs the rule against historical customer data and shows projected point awards prevents costly live misconfigurations.",
              unlockedSegment: "All clients - this is an internal UX improvement that accelerates every client's time-to-value and reduces support tickets. Also a strong demo differentiator against platforms that require IT to validate rules.",
              successMetric: "Rule test mode live. Reduction in post-go-live rule correction tickets by >50%. Faster client onboarding (target: 2 weeks -> 1 week).",
              effort: "Low-Medium (2-3 weeks)",
              priority: "P1",
              owner: "Product + Engineering"
            },
            {
              whatItIs: "Mobile App SDK - Android & iOS Push Notification for Rule Triggers",
              whyItMatters: "When a rule fires (e.g., points awarded, tier upgraded, milestone reached), customers currently receive no real-time notification. Without push notification, the emotional impact of earning rewards is lost - customers discover points passively rather than experiencing a reward moment. This is table stakes for any modern loyalty app and directly improves redemption frequency.",
              unlockedSegment: "All B2C clients - real estate, retail, hospitality. Particularly high impact for mobile-first programmes where the redemption page is already live on mobile.",
              successMetric: "Push notification delivery rate >85%. Redemption rate uplift post-notification implementation (baseline vs 60 days post-launch).",
              effort: "Medium (4-5 weeks)",
              priority: "P1",
              owner: "Mobile + Engineering"
            },
            {
              whatItIs: "Client Onboarding Playbook & Self-Serve Configuration Guide",
              whyItMatters: "Currently, every new client requires hands-on engineering support to configure the first set of rules. A documented onboarding playbook with vertical-specific rule templates (real estate, BFSI, auto) reduces onboarding time, reduces engineering dependency per client, and allows the team to onboard 3-4 clients simultaneously.",
              unlockedSegment: "Pipeline clients #2 and #3. Enables the team to scale from 1 to 5 clients without proportional engineering headcount increase.",
              successMetric: "Onboarding time reduced from 8-12 weeks to 4-6 weeks. Engineering hours per client onboarding reduced by 40%.",
              effort: "Low (2-3 weeks)",
              priority: "P1",
              owner: "Product + Customer Success"
            }
          ]
        },
        {
          timeframe: "Short-Term | 3-6 Months",
          headline: "Expand addressable market and move up-market",
          colorContext: "yellow",
          items: [
            {
              whatItIs: "Analytics Dashboard - Phase 2: Campaign ROI & Cohort Analysis",
              whyItMatters: "Phase 1 gives the basics; Phase 2 adds the metrics that move loyalty from a marketing expense to a measured business investment: campaign ROI (points cost vs incremental revenue), cohort retention curves, segment-level redemption behaviour, and programme P&L.",
              unlockedSegment: "BFSI (NPA and retention metrics), automotive (aftersales revenue per customer), retail (CLV and repeat purchase rate). Enables up-market enterprise deals where CMO and CFO both need to sign off.",
              successMetric: "At least one client using analytics dashboard for monthly programme review. One published ROI case study with Rs impact numbers.",
              effort: "High (8-10 weeks)",
              priority: "P1",
              owner: "Product + Data Engineering"
            },
            {
              whatItIs: "BFSI Vertical Module - Compliance-Ready Features",
              whyItMatters: "Banking and NBFC clients require: (a) RBI-compliant data storage and audit trail, (b) KYC-linked member management, (c) points expiry in compliance with RBI prepaid instrument guidelines, (d) enhanced escrow reporting for regulatory submissions. Building a BFSI-specific module shortens the compliance validation cycle.",
              unlockedSegment: "Private banks, NBFCs, digital lenders, insurance companies. India BFSI loyalty market is Rs800Cr+ and growing 18% YoY. Unlocks a vertical we cannot credibly enter today.",
              successMetric: "First BFSI pilot signed. Compliance checklist completed and signed off by one bank's legal team.",
              effort: "High (10-12 weeks)",
              priority: "P1",
              owner: "Product + Legal + Engineering"
            },
            {
              whatItIs: "Gamification Module - Streaks, Badges & Challenges",
              whyItMatters: "Engagement-based loyalty (streaks for consecutive app logins, badges for milestone achievements, challenges for completing a set of actions in a time window) drives 30-40% higher programme engagement vs transactional-only loyalty. Required to serve EdTech, healthcare, and consumer apps credibly.",
              unlockedSegment: "EdTech (course completion streaks), healthcare (appointment adherence challenges), retail (seasonal purchase challenges), automotive (service visit streaks). Opens 3 new verticals.",
              successMetric: "Gamification module live. First non-real-estate client using gamification features.",
              effort: "Medium-High (6-8 weeks)",
              priority: "P2",
              owner: "Product + Engineering"
            },
            {
              whatItIs: "Multi-Language & Multi-Currency Support",
              whyItMatters: "GCC and SEA expansion requires Arabic language support and AED/SAR/SGD currency handling. India expansion into Tier 2-3 cities benefits from Hindi and regional language support in the customer-facing redemption page. Without this, every international deal requires custom engineering.",
              unlockedSegment: "GCC real estate and hospitality (UAE, Saudi, Qatar). SEA retail and banking. India regional tier expansion.",
              successMetric: "Arabic and Hindi language support live in redemption page. First GCC client signed.",
              effort: "Medium (5-7 weeks)",
              priority: "P2",
              owner: "Engineering + Product"
            },
            {
              whatItIs: "Partner / Channel Loyalty Module",
              whyItMatters: "Many clients (real estate brokers, auto dealers, FMCG distributors) need to run a parallel loyalty programme for their channel partners alongside their consumer programme. A channel partner module with separate rule sets, separate wallets, and separate redemption catalogues doubles the revenue per enterprise client.",
              unlockedSegment: "Real estate (broker loyalty alongside homebuyer loyalty), automotive (dealer partner programme), FMCG (distributor incentive programme). Significant increase in ACV per client.",
              successMetric: "First client using both consumer and partner loyalty modules simultaneously. Partner module ACV contribution tracked.",
              effort: "High (10-12 weeks)",
              priority: "P2",
              owner: "Product + Engineering"
            },
            {
              whatItIs: "Redemption Fulfilment API - Third-Party Catalogue Expansion",
              whyItMatters: "Expanding the redemption catalogue through open API that connects to third-party reward catalogues (Amazon, Flipkart, flight booking APIs, hotel booking APIs) without requiring custom integration per partner. This moves the catalogue from curated to scalable - clients can offer 10,000+ redemption options instead of a limited manual catalogue.",
              unlockedSegment: "All B2C verticals - retail, hospitality, BFSI, real estate. High-volume programmes need catalogue depth to drive redemption rates above 40%.",
              successMetric: "Third-party catalogue API live with at least 3 partners integrated. Redemption SKU count increases from <100 to >1,000.",
              effort: "Medium (6-8 weeks)",
              priority: "P2",
              owner: "Engineering + Partnerships"
            }
          ]
        },
        {
          timeframe: "Medium-Term | 6-18 Months",
          headline: "Build the long-term competitive moat",
          colorContext: "green",
          items: [
            {
              whatItIs: "AI Reward Optimisation Engine",
              whyItMatters: "Replace static, human-configured rule logic with a machine learning layer that learns which reward types, point amounts, and trigger timings drive the highest engagement and redemption rates for each customer segment. The AI engine runs alongside the existing rule engine - rules remain human-controlled, AI recommends optimisations.",
              unlockedSegment: "Enterprise BFSI, retail, and hospitality clients with large member bases (100K+) where manual rule optimisation is impractical. Unlocks CMO budgets that currently go to personalisation vendors.",
              successMetric: "AI-optimised campaigns show >15% higher redemption rate vs manually configured campaigns in A/B tests.",
              effort: "Very High (16-20 weeks)",
              priority: "P1 at 6mo",
              owner: "ML Engineering + Product"
            },
            {
              whatItIs: "Predictive Churn & Re-engagement Engine",
              whyItMatters: "Use transaction and engagement data to predict which members are at risk of disengaging (no activity in 60+ days, declining earn rate, milestone stall) and automatically trigger a personalised re-engagement rule before they churn. This closes the gap between having loyalty data and using it to drive proactive engagement.",
              unlockedSegment: "BFSI (loan repayment churn), hospitality (lapsed loyalty members), retail (inactive customers with unredeemed points), EdTech (at-risk learners).",
              successMetric: "Churn prediction model accuracy >75%. Re-engagement campaign triggered before member goes inactive. Measurable reduction in loyalty programme lapse rate.",
              effort: "Very High (14-18 weeks)",
              priority: "P1 at 9mo",
              owner: "ML Engineering + Data"
            },
            {
              whatItIs: "Coalition / Multi-Brand Loyalty",
              whyItMatters: "Enable a single loyalty programme to span multiple brands, properties, or business units under one parent organisation. A real estate group with residential and commercial divisions, a hospitality group with hotels and clubs, or a retail conglomerate with multiple banners can run a unified loyalty experience - with points issuance, redemption, and governance managed centrally.",
              unlockedSegment: "Real estate groups with multiple project brands, retail conglomerates, hospitality groups with mixed portfolio (hotels + resorts + clubs), FMCG companies with multiple consumer brands.",
              successMetric: "First multi-brand deployment live. Programme spans at least 2 distinct brands under one loyalty wallet.",
              effort: "Very High (16-20 weeks)",
              priority: "P2 at 9mo",
              owner: "Product + Engineering"
            },
            {
              whatItIs: "White-Label & Client Branding Engine",
              whyItMatters: "Full white-label capability: every customer-facing element (mobile redemption page, notification templates, loyalty app interface, emails) is configurable to the client's brand identity without engineering involvement. Currently, client branding requires custom work. This is critical for reseller and channel partner model.",
              unlockedSegment: "All verticals - every enterprise client wants their loyalty programme to look like their own product, not a third-party SaaS. Critical for reseller and channel partner model.",
              successMetric: "New client branding deployment time reduced from 3-4 weeks to 2-3 days. First reseller or white-label partnership signed.",
              effort: "High (10-14 weeks)",
              priority: "P1 at 12mo",
              owner: "Product + Engineering"
            },
            {
              whatItIs: "Loyalty Programmes API - Open Platform for Developer Ecosystem",
              whyItMatters: "Publish a well-documented public API that allows third-party developers, Salesforce ISV partners, and system integrators to build loyalty integrations and extensions on top of our platform. This transforms the product from a standalone SaaS into a platform - creating a partner ecosystem that expands distribution.",
              unlockedSegment: "Salesforce implementation partners, HR tech integrators, ERP consultants, and vertical-specific ISVs. Unlocks a channel-led growth model that multiplies GTM reach without proportional headcount.",
              successMetric: "First Salesforce AppExchange listing. Partner-sourced pipeline contributes >20% of new ARR by month 18.",
              effort: "High (12-16 weeks)",
              priority: "P2 at 12mo",
              owner: "Engineering + Partnerships"
            },
            {
              whatItIs: "Advanced Escrow & Liability Reporting for Regulated Industries",
              whyItMatters: "Extend the escrow wallet into a full regulatory-grade liability management module: automated mark-to-market reporting, regulatory submission templates (RBI for BFSI, SEBI for listed companies), liability ageing analysis, and stress-test scenarios (what if 30% of members redeem simultaneously?). This turns the liability model from a finance/compliance feature into a buying reason, not just a nice-to-have.",
              unlockedSegment: "Listed real estate companies (SEBI disclosure requirements), NBFCs and banks (RBI audit requirements), insurance companies (IRDAI compliance). Makes regulatory compliance a buying reason, not just a nice-to-have.",
              successMetric: "First regulatory submission completed using platform data. Statutory auditor validates escrow reporting as compliant.",
              effort: "High (10-12 weeks)",
              priority: "P1 at 12mo",
              owner: "Engineering + Legal + Finance"
            },
            {
              whatItIs: "Global Deployment Infrastructure - GCC & SEA",
              whyItMatters: "Data residency compliance (UAE PDPL, Singapore PDPA), local payment gateway integrations for redemption encashment, Arabic/Bahasa language support, and a regional support structure for GCC and SEA markets. Without this, international deals require custom onboarding and expose the business to expansion bottlenecks.",
              unlockedSegment: "GCC real estate (UAE, Saudi, Qatar), SEA banking and retail (Singapore, Malaysia, Indonesia). International revenue diversification reduces India-only concentration risk.",
              successMetric: "First GCC or SEA client signed. Data residency compliance certified for UAE or Singapore.",
              effort: "Very High (18-24 weeks)",
              priority: "P2 at 15mo",
              owner: "Engineering + Legal + Ops"
            }
          ]
        }
      ]
    },
    detailedPricing: {
      pricingSummaryRows: [
        {
          label: "Where We Are Ahead",
          detail: "Rule engine depth (7 dimensions), no-code configuration, cold wallet, escrow liability management, redemption breadth (7 types), personalised mobile redemption, CRM integration depth (12+ Salesforce endpoints). These are genuine, defensible advantages - especially escrow and cold wallet, which have no comparable feature in the market.",
          tone: "green"
        },
        {
          label: "Where We Are At Par",
          detail: "Tier management and membership management. Solid functionality that meets market expectations. No gap, but also no differentiation. Do not lead with these in sales conversations.",
          tone: "yellow"
        },
        {
          label: "Gaps That Will Cost Us Deals",
          detail: "Analytics and reporting dashboard (cost deals with CMO-level buyers), AI/ML personalisation (growing expectation from enterprise buyers), accounting/ERP integration (blocks CFO sign-off), and gamification (needed for EdTech, healthcare, and consumer engagement use cases). Address reporting and accounting integration first - these are deal-blockers today.",
          tone: "red"
        }
      ],
      featuresVsMarket: [
        {
          featureArea: "Rule Engine - Trigger Types",
          marketStandard: "3-5 trigger types (purchase, birthday, signup). Most platforms fall back to earn-and-burn. Antavo: 50+ triggers. Capillary: 20+.",
          ourProduct: "7 rule dimensions: User Actions, Transaction Events, Time-Based, Segments, Engagement/Behaviour, Milestones, Tier-Based. Multi-condition AND/OR logic.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "AHEAD of India competitors (Capillary, Vinculum). At par with global leaders (Antavo). Seven-dimensional engine is our #1 technical differentiator for high-value verticals.",
          summary: "AHEAD of India competitors (Capillary, Vinculum). At par with global leaders (Antavo). Seven-dimensional engine is our #1 technical differentiator for high-value verticals."
        },
        {
          featureArea: "No-Code Rule Configuration",
          marketStandard: "Most platforms require CRM admin or IT involvement. Antavo and Salesforce have visual builders but still require technical training.",
          ourProduct: "Business-user configurable rule engine - marketing team can build and deploy rules without raising IT tickets.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "AHEAD in Indian mid-market. Speed-to-deploy advantage: rule changes in hours vs weeks. Key selling point against Salesforce Loyalty Management.",
          summary: "AHEAD in Indian mid-market. Speed-to-deploy advantage: rule changes in hours vs weeks. Key selling point against Salesforce Loyalty Management."
        },
        {
          featureArea: "Wallet & Point Storage",
          marketStandard: "Standard: single active wallet. Advanced: tiered point types (bonus, base, expiring). Most platforms: no cold wallet mechanism.",
          ourProduct: "Cold wallet (long-term storage) plus active wallet. Redemption velocity control built in.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "AHEAD - cold wallet is a unique feature with no direct equivalent in competing platforms. Critical for high-liability programmes.",
          summary: "AHEAD - cold wallet is a unique feature with no direct equivalent in competing platforms. Critical for high-liability programmes."
        },
        {
          featureArea: "Escrow / Liability Management",
          marketStandard: "Not available in any standard loyalty SaaS. Enterprise players (Comarch) have finance modules but not loyalty-specific escrow.",
          ourProduct: "Built-in 25% float escrow wallet with mandatory mark-to-market balance. Full financial controls for CFO confidence.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "SIGNIFICANTLY AHEAD - no comparable feature found in market. This is our strongest CFO-level differentiator, especially for BFSI and real estate.",
          summary: "SIGNIFICANTLY AHEAD - no comparable feature found in market. This is our strongest CFO-level differentiator, especially for BFSI and real estate."
        },
        {
          featureArea: "Redemption Catalogue Breadth",
          marketStandard: "Standard: vouchers plus basic merchandise. Advanced (Antavo, Comarch): travel, experiences, partner rewards. Most India platforms: limited to vouchers.",
          ourProduct: "7 redemption types: vouchers, lounge, experiences, travel and ticketing, merchandise, personalised mobile page, encashment.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "AHEAD in India market. At par with global enterprise platforms. Encashment (cash-out) is a differentiation not commonly offered as a first-class feature.",
          summary: "AHEAD in India market. At par with global enterprise platforms. Encashment (cash-out) is a differentiation not commonly offered as a first-class feature."
        },
        {
          featureArea: "Personalised Mobile Redemption",
          marketStandard: "Most platforms: generic catalogue for all users. Antavo and Capillary have basic personalisation. True real-time personalisation is rare.",
          ourProduct: "Personalised mobile redemption page tailored to each customer's tier, point balance, history, and preferences - served in real time.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "AHEAD in India market. Drives higher redemption rates. Key UX differentiator in client demos.",
          summary: "AHEAD in India market. Drives higher redemption rates. Key UX differentiator in client demos."
        },
        {
          featureArea: "CRM Integration Depth",
          marketStandard: "Most: webhook or basic API. Salesforce Loyalty: native, but requires full Salesforce stack. Capillary: strong retail POS integration.",
          ourProduct: "12+ bidirectional Salesforce API endpoints covering members, payments, demand notes, referrals, home loans, surveys, testimonials. Production-proven.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AHEAD",
          dealImpact: "AHEAD for Salesforce-first organisations. Deep integration is a moat - replicating this takes 6-12 months for a competitor.",
          summary: "AHEAD for Salesforce-first organisations. Deep integration is a moat - replicating this takes 6-12 months for a competitor."
        },
        {
          featureArea: "Tier Management",
          marketStandard: "Standard: 3-5 tiers with fixed rules. Advanced: dynamic tier upgrades or downgrades based on rolling spend. Most India platforms: basic tier logic.",
          ourProduct: "Configurable tiers with custom names, thresholds, benefits, and rule associations. Supports unlimited tiers.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AT PAR",
          dealImpact: "AT PAR with Antavo and Capillary. No major gap. Further differentiation possible through AI-driven dynamic tier thresholds (roadmap).",
          summary: "AT PAR with Antavo and Capillary. No major gap. Further differentiation possible through AI-driven dynamic tier thresholds (roadmap)."
        },
        {
          featureArea: "Membership Management",
          marketStandard: "Standard: registration plus ID. Advanced: lifecycle management, auto-enrolment, lapsed member re-engagement.",
          ourProduct: "Member registration, unique ID, status lifecycle, auto-tier assignment on registration. CRM sync.",
          status: "Live",
          liveStatus: "Live",
          whereWeStand: "AT PAR",
          dealImpact: "AT PAR with market. No significant gap. Lapsed-member automated re-engagement rules can be built using existing behaviour triggers - no product gap, but no sales differentiator.",
          summary: "AT PAR with market. No significant gap. Lapsed-member automated re-engagement rules can be built using existing behaviour triggers - no product gap, but no sales differentiator."
        },
        {
          featureArea: "Analytics & Reporting",
          marketStandard: "Standard: basic dashboard - points issued, redeemed, balance. Advanced (Antavo, Capillary): cohort analysis, campaign ROI, predictive churn.",
          ourProduct: "Admin account statements and transaction ledger. No advanced analytics dashboard currently.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact: "GAP - will cost deals against Antavo and Capillary when CMO-level buyers ask for programme ROI reporting. Must address in 3-6 months.",
          summary: "GAP - will cost deals against Antavo and Capillary when CMO-level buyers ask for programme ROI reporting. Must address in 3-6 months."
        },
        {
          featureArea: "AI / ML Personalisation",
          marketStandard: "Antavo AI Loyalty Cloud: auto-optimises rewards offers using ML. Capillary Insight+: predictive next-best-action. Yotpo: smart segmentation.",
          ourProduct: "No AI/ML layer currently. Rule logic is human-configured.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact: "GAP - growing expectation from enterprise buyers. Not a deal-killer today for mid-market, but will be at 12-18 months. Prioritise AI reward optimisation roadmap.",
          summary: "GAP - growing expectation from enterprise buyers. Not a deal-killer today for mid-market, but will be at 12-18 months. Prioritise AI reward optimisation roadmap."
        },
        {
          featureArea: "Accounting / ERP Integration",
          marketStandard: "Standard: manual export. Advanced: direct GL posting via SAP/Tally/QuickBooks. Most loyalty SaaS: no accounting integration.",
          ourProduct: "API structure in place. Direct accounting connector not yet shipped.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact: "GAP - blocks CFO sign-off in BFSI and large enterprise deals. Finance team needs automated liability posting. Must close this gap to move up-market.",
          summary: "GAP - blocks CFO sign-off in BFSI and large enterprise deals. Finance team needs automated liability posting. Must close this gap to move up-market."
        },
        {
          featureArea: "White-Label / Multi-Brand",
          marketStandard: "Standard SaaS: single-brand programme. Enterprise: multi-brand coalition loyalty (Antavo, Comarch).",
          ourProduct: "Single-brand programme per deployment. Multi-brand coalition not yet supported.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact: "GAP - relevant for retail groups, FMCG conglomerates, and hospitality chains with multiple sub-brands. Not urgent for current ICP but needed for expansion.",
          summary: "GAP - relevant for retail groups, FMCG conglomerates, and hospitality chains with multiple sub-brands. Not urgent for current ICP but needed for expansion."
        },
        {
          featureArea: "Gamification (Streaks, Challenges, Badges)",
          marketStandard: "Antavo: full gamification suite. Loyalty programmes with app-native gamification see 30-40% higher engagement.",
          ourProduct: "Milestones and tier progression are partially gamified but no explicit streaks, badges, or challenges.",
          status: "Roadmap",
          liveStatus: "Roadmap",
          whereWeStand: "GAP",
          dealImpact: "GAP - important for EdTech, healthcare, and consumer engagement use cases. Adds stickiness to the programme beyond transactional loyalty.",
          summary: "GAP - important for EdTech, healthcare, and consumer engagement use cases. Adds stickiness to the programme beyond transactional loyalty."
        }
      ],
      currentPricingMarket: [
        {
          category: "Standard pricing models in this category",
          description: "1. Per-seat SaaS (admin users): common for SMB loyalty tools\n2. Revenue / transaction volume % (e.g. 0.1-0.5% of GMV): common for retail loyalty\n3. Annual platform license plus implementation fee: common for enterprise\n4. Hybrid: base licence plus per-redemption or per-active-member fee\n5. Usage-based: points issued or members enrolled"
        },
        {
          category: "India - Entry / Mid / Enterprise pricing range",
          description: "Entry (SMB, <50K members): Rs3L-Rs8L/year (basic earn-and-burn, limited rule types)\nMid-market (50K-500K members, complex rules): Rs12L-Rs60L/year\nEnterprise (500K+ members, full integrations): Rs60L-Rs3Cr+/year"
        },
        {
          category: "Global - Entry / Mid / Enterprise pricing range",
          description: "Key India benchmarks: Capillary Rs25L-Rs2Cr+ | Xoxoday Rs5L-Rs50L plus margin | Salesforce Loyalty Rs30L-Rs3Cr+\nEntry: $5,000-$20,000/year (LoyaltyLion, Yotpo)\nMid-market: $25,000-$150,000/year (Antavo lower tiers, Open Loyalty enterprise)\nEnterprise: $150,000-$1M+/year (Antavo top tier, Comarch, Salesforce Loyalty enterprise)"
        },
        {
          category: "How competitors categorise features across tiers",
          description: "Note: Indian pricing is typically 30-50% below global equivalents for comparable feature sets\nTier 1 (Entry): basic earn-and-burn, single earn rule type, voucher redemption only, limited integrations, no wallet management\nTier 2 (Mid): multiple rule types, segment targeting, 3-5 redemption categories, CRM integration, basic analytics\nTier 3 (Enterprise): full rule engine, AI personalisation, all redemption types, escrow/financial controls, multi-brand, SLA and dedicated support"
        },
        {
          category: "What to charge NOW (2026) - and why",
          description: "Recommended: Rs15L-Rs40L/year for mid-market India clients (50K-300K members, full platform access)\nRationale: Price below Capillary and Salesforce Loyalty but with reference clients. Include: all rule engine modules, wallet (cold plus ledger), 5 redemption types, Salesforce CRM integration, admin panel, escrow wallet.\nExclude from base price: accounting integration (charge as add-on Rs3-Rs5L), advanced analytics (charge as add-on Rs3-Rs8L once built)."
        },
        {
          category: "What to charge at 6 MONTHS - and why",
          description: "Recommended: Rs20L-Rs60L/year\nRationale: By 6 months, a second reference client validates the product. Add analytics dashboard to core offering. Introduce usage-based top-up pricing for programmes above 500K members or 1M+ points transactions/month. Begin pricing for accounting integration as standard add-on."
        },
        {
          category: "What to charge at 18 MONTHS - and why",
          description: "Recommended: Rs40L-Rs2Cr/year (tiered by member count and rule complexity)\nRationale: With 5+ clients, a vertical-specific pricing model becomes defensible. Introduce AI personalisation tier as premium add-on. Global pricing: $30,000-$200,000/year for international clients in GCC/SEA. Consider a 'Starter' tier at $5-8L/year for SMBs to expand top of funnel."
        },
        {
          category: "One pricing risk to watch",
          description: "RISK: Pricing too low to win reference clients and then struggling to reprice existing clients upward as features improve. Establish contractual annual price escalation clauses (8-12% p.a.) from Day 1. Also watch for Capillary or Salesforce dropping their India entry pricing to block mid-market penetration - be prepared to justify ROI in rupees rather than competing purely on price."
        }
      ],
      positioning: [
        {
          category: "Our single most defensible position right now",
          description: "The only loyalty rule engine built for high-value, low-frequency purchase industries - with built-in financial controls that your CFO will not reject.\n\nWhy defensible: No competitor combines (a) a 7-dimensional no-code rule engine with (b) escrow liability management with (c) deep Salesforce CRM integration. This triple combination is unique and takes 18-24 months for a competitor to replicate."
        },
        {
          category: "2-3 customer segments to prioritise in Year 1 - and why",
          description: "1. REAL ESTATE DEVELOPERS (India) - We have a live reference client, 30+ business rules in production, and proven CRM integration. Fastest sales cycle because we can show the exact product they will buy. Target: 5-10 developers with Rs200Cr+ revenue in FY26.\n\n2. BFSI - NBFC and private bank segment (India) - High loyalty programme urgency, escrow wallet is a native sell for finance-regulated businesses, and CRM integration story is strong. Target: 3-5 NBFCs and digital lenders in FY26."
        },
        {
          category: "The one competitor to displace most aggressively - and how",
          description: "TARGET: Xoxoday / Plum\n\nWhy: Xoxoday is the current default 'loyalty tool' in India across industries. Clients use it for voucher fulfilment but it is NOT a loyalty programme - it has no rule engine, no wallet, no tiers, no escrow.\n\nHow: Position Xoxoday as the fulfilment layer and us as the intelligence layer. Message: 'Your team already uses Xoxoday for vouchers. We are what sits behind it - the rules engine that decides who gets what, when, and why.'"
        },
        {
          category: "What to STOP doing or saying - it is diluting our position",
          description: "STOP: Positioning as a 'loyalty platform' generically - this puts us in the same category as Capillary and Salesforce Loyalty where we cannot win on brand or scale.\n\nSTOP: Leading with the redemption catalogue - it is a feature, not a position. Competitors also have redemption catalogues.\n\nSTOP: Talking about 'earning points' - this is table stakes. Lead with the rule engine complexity, the escrow controls, and the CRM integration depth."
        },
        {
          category: "Recommended GTM motion for Year 1",
          description: "MOTION: Direct Sales + Reference-Led Selling\n\nYear 1 is not a PLG or channel year - the product requires configuration and the deal size justifies direct sales."
        }
      ],
      valuePropositions: [
        {
          rank: "1",
          currentProp: "No-code rule engine - configure loyalty rules without IT",
          communicatesToday: "Speed and autonomy for marketing teams",
          weakness: "Does not quantify the time saved or the cost of IT dependency",
          sharpened: "Launch a loyalty campaign in 2 hours, not 2 weeks - without a single IT ticket. Quantify: average IT ticket for a rule change = 3-5 days delay x 4 campaigns/month = 12-20 days lost marketing execution time.",
          proofPoint: "Time-to-deploy comparison from live client: days vs competitor weeks",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        },
        {
          rank: "2",
          currentProp: "7-dimensional rule engine covering actions, transactions, time, segments, behaviour, milestones, and tiers",
          communicatesToday: "Feature richness and configurability",
          weakness: "Too feature-focused - buyers do not shop for dimensions, they shop for outcomes",
          sharpened: "Reward the right customer, at the right moment, for the right behaviour - automatically. Back this with a specific scenario: when a customer pays their demand note 10 days early and it is their 3rd instalment, the rule engine can trigger the precise reward without manual intervention.",
          proofPoint: "Demo the multi-condition rule builder live in every sales meeting",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        },
        {
          rank: "3",
          currentProp: "Built-in escrow wallet with 25% float and mark-to-market liability management",
          communicatesToday: "Financial control and CFO confidence",
          weakness: "Not being positioned to the right buyer - this is a CFO and finance message, not a marketing message",
          sharpened: "The only loyalty platform where your CFO can see the liability in real time, control it, and sleep at night. Reframe: this feature removes loyalty programmes as a balance sheet risk - turning a finance objection into a finance advantage.",
          proofPoint: "Quantify: for a Rs500Cr real estate developer with Rs10Cr loyalty liability, unmanaged exposure = significant audit risk. Escrow removes it.",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        },
        {
          rank: "4",
          currentProp: "Encashment - customers can convert points to cash",
          communicatesToday: "Maximum flexibility for customers",
          weakness: "Not connected to the business outcome for the company - why does encashment benefit the developer or business?",
          sharpened: "Turn outstanding dues into loyalty currency - customers redeem points against their next instalment, improving collections without a single call. Reframe encashment as a collections acceleration tool, not just a customer delight feature.",
          proofPoint: "Show encashment redemption volume from live client as proof of engagement",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        },
        {
          rank: "5",
          currentProp: "Personalised mobile redemption page",
          communicatesToday: "Better customer experience vs generic catalogue",
          weakness: "Vague - 'personalised' is overused and under-proven in SaaS marketing",
          sharpened: "Every customer sees only the rewards they can afford and are most likely to want - increasing redemption rates by surfacing relevant offers, not a generic catalogue of 10,000 items they will ignore.",
          proofPoint: "Redemption rate comparison: personalised page vs generic catalogue - gather from live client data",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        },
        {
          rank: "6",
          currentProp: "Deep Salesforce CRM integration (12+ API endpoints)",
          communicatesToday: "No rip-and-replace - works with existing tech stack",
          weakness: "12 endpoints sounds technical - buyers do not know what this means in practice",
          sharpened: "Your CRM already knows when a customer pays, refers someone, or books a site visit - we make every one of those moments a loyalty moment automatically, without any manual data entry. Make the integration your proof of closed-loop loyalty.",
          proofPoint: "Show the data flow diagram: Salesforce -> Loyalty Engine -> Reward in real time",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        },
        {
          rank: "7",
          currentProp: "Cold wallet - separate long-term point storage",
          communicatesToday: "Controls redemption velocity and cash flow impact",
          weakness: "Cold wallet is an internal feature name - customers do not understand what it means without a story",
          sharpened: "Protect your cash flow while keeping loyalty liability in a controlled reserve account until you choose to release it for redemption. No surprise redemption spikes. Position as a financial risk management tool, not just a wallet design.",
          proofPoint: "Show escrow + cold wallet together as the 'CFO package' - two features that eliminate the #1 finance objection to loyalty programmes",
          segment: "",
          proposition: "",
          quantifiedBenefit: "",
          targetBuyer: ""
        }
      ],
      comparisonSummary: {
        ahead: "Rule engine depth (7 dimensions), no-code configuration, cold wallet, escrow liability management, redemption breadth (7 types), personalised mobile redemption, CRM integration depth (12+ Salesforce endpoints).",
        atPar: "Tier management and membership management. Solid functionality that meets market expectations. No gap, but also no differentiation.",
        gaps: "Analytics and reporting dashboard, AI/ML personalisation, accounting/ERP integration, white-label / multi-brand support, and gamification."
      }
    },
    detailedBusinessPlan: {
      planQuestions: [
        {
          id: "Q1",
          question: "What problem are you solving, for whom, and why does it need solving now?",
          answer: "I am solving the complete absence of configurable, financially controlled loyalty programme infrastructure for businesses in high-value, low-frequency purchase industries - specifically real estate developers, banks and NBFCs, and automotive dealer groups.\n\nThe problem has three layers:\n\nFirst, these companies have no automated way to reward customers for behaviours that directly improve their business metrics - paying a demand note early, referring a buyer, returning for an aftersales service visit, or completing digital onboarding. They manage referral programmes on Excel, pay incentives manually weeks after the event, and have no rule engine that can translate a business condition (paid within 5 days of demand note) into an automated reward.\n\nSecond, the loyalty platforms that exist - Capillary, Salesforce Loyalty Management, Antavo - are built for retail. They have no understanding of a demand note, no concept of a possession TAT incentive, no escrow wallet for loyalty liability management. A real estate developer trying to use Capillary is fitting a round peg into a square hole, and paying Rs1Cr+ per year for the privilege.\n\nThird, there is a genuine financial control gap. Every loyalty programme creates a liability - unredeemed points are a balance-sheet obligation. No loyalty SaaS in the market offers a structured escrow wallet with a mandatory float and mark-to-market balance. CFOs at our target clients are either blocking loyalty programmes because of unquantified liability risk, or running them with no financial visibility at all.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "blue"
        },
        {
          id: "Q2",
          question: "What is your solution, and how does it work?",
          answer: "We are a B2B SaaS loyalty rule engine - the intelligence layer that sits between a company's CRM and their customers, turning every meaningful customer behaviour into an automated, personalised reward.\n\nHere is how it works:\n\nA business configures their loyalty programme through our no-code admin interface. They define tiers (Bronze, Silver, Gold), earning rules (pay demand note within 5 days = 6,000 points), and redemption options (encash points against outstanding dues, redeem for travel, merchandise, or experiences). Rules span 7 dimensions: user actions, transaction events, time-based events, customer segments, engagement behaviour, milestones, and tier-based conditions.\n\nWhen a customer does something that meets a rule's conditions - Salesforce sends us the event via API, we evaluate the rule in real time, credit the customer's wallet, and notify them via push notification. The entire loop - behaviour to reward - happens in seconds, not weeks.\n\nThe money sits in a structured escrow wallet: 25% of total outstanding loyalty liability is maintained as a float, mark-to-market. The CFO can see the exact liability exposure at any time.\n\nWhen customers want to redeem, they open the personalised mobile redemption page - which shows only the rewards they can afford and are most likely to want. They can redeem for vouchers, experiences, travel, merchandise, lounge access, or cash (direct bank transfer). Points that are not yet redeemable sit in a cold wallet - controlling redemption velocity and protecting cash flow.\n\nUnderneath all of this, the CRM integration is the backbone. We already have 12+ Salesforce API endpoints in production. This is not a generic loyalty layer - it is a domain-configured infrastructure product with the CRM and finance controls already built for enterprise deployment.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "teal"
        },
        {
          id: "Q3",
          question: "Who is your target customer, and what does their ideal profile look like?",
          answer: "My primary target customer is a mid-to-large enterprise in one of three verticals: real estate development, banking and financial services (specifically NBFCs and private banks), or automotive dealer groups.\n\nThe ideal profile across all three:\n\nCompany size: Rs200Cr-Rs5,000Cr revenue. Large enough to have a CRM (typically Salesforce), a marketing or CRM team, and a budget for customer retention software. Small enough that they cannot build this in-house and cannot afford Capillary or Comarch pricing.\n\nCRM: Salesforce or a comparable enterprise CRM already in use. Our integrations are built on Salesforce - clients who are already on Salesforce have zero integration friction.\n\nCustomer base: 5,000-500,000 members. Below 5,000, loyalty ROI is marginal. Above 500,000, we need additional infrastructure (which is on the roadmap).\n\nGeography: India Tier 1-2 cities in Year 1. GCC expansion in Year 2.\n\nThe buyer: CMO or VP Marketing (owns the loyalty programme mandate), co-signed by the CFO (escrow wallet and liability management story) and Head of IT (Salesforce integration story). All three must be addressed - our sales motion runs three parallel tracks.\n\nThe user: CRM Manager or Loyalty Programme Manager. They configure rules, monitor performance, and manage the redemption catalogue. They are our champions because we eliminate their IT dependency for every rule change.\n\nMy beachhead is the real estate vertical - we have a live reference client, proven rules in production, and no meaningful competition. BFSI is the second priority (higher ACV, longer sales cycle). Automotive is third (high ROI story but OEM complexity adds friction).",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "purple"
        },
        {
          id: "Q4",
          question: "What is your business model, and how do you make money?",
          answer: "We generate revenue through annual SaaS subscription contracts, priced primarily by member count and rule complexity.\n\nPricing tiers:\n- Starter: Rs5-8L/year (up to 10,000 members, 5 rule types, basic CRM integration) - for SMBs and pilots\n- Professional: Rs15-35L/year (up to 100,000 members, all 7 rule dimensions, full redemption catalogue, Salesforce integration, escrow wallet) - our primary ICP tier\n- Enterprise: Rs40-150L/year (unlimited members, AI personalisation on roadmap, accounting integration, multi-brand, dedicated CSM, SLA guarantee) - for large BFSI and automotive groups\n\nRevenue structure:\n- 80% platform subscription (recurring)\n- 15% implementation and onboarding fee (one-time per client, Rs2-5L)\n- 5% optional add-ons: advanced analytics module, accounting integration, AI personalisation layer (once built)\n\nPayment terms: 50% upfront, 50% at 90 days for Year 1. Annual renewal with a 10-12% price escalation clause from Year 2 onwards.\n\nUnit economics (target):\n- CAC: Rs4-8L per enterprise client (direct sales model)\n- LTV (3-year): Rs60-180L per client (Rs20-60L ACV x 3 years x 10-12% expansion)\n- LTV:CAC ratio: 8-18x - well within healthy enterprise SaaS range\n- Gross margin: 72-80% (SaaS + cloud infrastructure; low COGS)\n- Payback period: 8-14 months per client\n\nAt 10 clients in Year 1 at an average ACV of Rs22L, we reach Rs2.2Cr ARR. At 25 clients by Month 24 with average ACV expansion to Rs30L, we reach Rs7.5Cr ARR - the threshold for Series A relevance in Indian B2B SaaS.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "red"
        },
        {
          id: "Q5",
          question: "Who are your competitors, and what is your competitive advantage?",
          answer: "My direct competitors are Capillary Technologies (India), Salesforce Loyalty Management (global enterprise), Antavo (global enterprise), and Xoxoday/Plum (India - voucher fulfilment, not a true loyalty platform).\n\nHere is how I think about each:\n\nCapillary: The incumbent India loyalty leader. Built for retail - deep POS integration, strong analytics, large client base. Cannot serve real estate, BFSI, or automotive without heavy customisation. Priced at Rs25L-2Cr+ for features I have built for Rs15-35L. My advantage: vertical depth, escrow wallet, and 60% lower price for non-retail clients.\n\nSalesforce Loyalty Management: Available only to companies on the full Salesforce stack, and priced at Rs30L-Rs3Cr+ annually. Requires a Salesforce consultant to configure rules - marketing teams cannot self-serve. My advantage: no-code rule engine, 8x faster deployment, vertical-specific rule templates, and escrow controls that Salesforce does not offer at any price.\n\nAntavo: The Gartner Leader for enterprise loyalty globally. EUR80,000-650,000+/year. No India presence, no escrow wallet, 9-18 month deployment cycles. My advantage: India pricing, India vertical knowledge, 8-12 week deployment, and the escrow wallet.\n\nXoxoday/Plum: The default 'loyalty tool' in India. It is not a loyalty platform - it is a reward fulfilment platform. No rule engine, no wallet, no tiers, no escrow. My strategy: position Xoxoday as our fulfilment partner, not our competitor. We are what sits above Xoxoday - the intelligence layer that decides who earns what and when.\n\nMy three defensible advantages:\n1. The only platform combining a 7-dimension no-code rule engine + escrow liability management + production-proven Salesforce integration - no competitor has all three.\n2. Vertical depth: 30+ rules in production for real estate - a competitor would need 12-18 months to replicate the domain knowledge embedded in our rule templates and integrations.\n3. India execution advantage: I can deploy in 8-12 weeks at one-third the cost of enterprise global players.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "blue"
        },
        {
          id: "Q6",
          question: "What is your go-to-market strategy for the first 12 months?",
          answer: "Year 1 is a direct sales and reference-led motion. I am not trying to build a PLG engine or a channel network in Year 1 - I am trying to close 8-10 enterprise clients and build the case study infrastructure that makes Month 13 onwards scalable.\n\nMy 12-month GTM in three tracks:\n\nTrack 1 - Real Estate (Months 1-6, primary focus):\nEntry point: collections TAT problem. Every discovery call leads with: 'What is your average days-to-payment after a demand note? We can reduce that by 35-45% with one rule.' This single data point justifies the ACV before any product demonstration. I am using our live reference client as the centrepiece - every prospect gets a 30-minute call with the reference client's CRM manager before signing.\n\nTrack 2 - BFSI (Months 3-9, parallel):\nEntry point: EMI on-time payment incentive + RBI compliance framing. The escrow wallet is the CFO and compliance unlock. I publish the RBI loyalty liability compliance guide in Month 1 - this gets me into compliance officer conversations that no standard sales motion reaches.\n\nTrack 3 - Automotive (Months 5-12, later start):\nEntry point: aftersales revenue retention - first-service capture rate is the metric. I approach FADA (Federation of Automobile Dealers Associations) for a knowledge partner role in Month 2. Speaking at one FADA event converts to 5-10 qualified meetings.\n\nAcross all three: I am building one Salesforce SI partner relationship per quarter. Each SI partner is worth 3-8 qualified referrals per year from their existing BFSI / real estate client base.\n\nYear 1 commercial target: Rs1.8-2.5Cr ARR from 7-10 signed clients. Year 1 operating goal: 2 reference clients with published, named case studies.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "green"
        },
        {
          id: "Q7",
          question: "What does your financial model look like for the first 3 years?",
          answer: "My financial projections are built on conservative assumptions with specific milestones that gate each growth phase.\n\nYear 1 (FY2026-27):\n- Clients: 3-4 signed (1 real estate reference already live)\n- Average ACV: Rs20-22L\n- ARR: Rs60-88L\n- Revenue (recognised): Rs45-70L (accounting for 50/50 payment split and contract timing)\n- Team: 4 people (2 founders + 1 senior seller hire in Month 2 + 1 CS hire in Month 4)\n- Burn: Rs60-75L (salaries, cloud infra, events, Salesforce partnership fees)\n- Net: Break-even to slightly negative; funded by existing capital or first round\n\nYear 2 (FY2027-28):\n- Clients: 10-15 total (7-12 new in Year 2)\n- Average ACV: Rs25-30L (ACV expansion from existing clients + higher entry point for new clients)\n- ARR: Rs2.5-4.5Cr\n- Revenue: Rs2-3.5Cr\n- Team: 8-10 people (add ML engineer for AI roadmap, 1 marketing hire, 1 sales hire)\n- Burn: Rs1.8-2.5Cr\n- Net: Cash-flow positive by Q3 Year 2\n\nYear 3 (FY2028-29):\n- Clients: 25-40 total (including first GCC client)\n- Average ACV: Rs35-50L\n- ARR: Rs8-15Cr\n- Revenue: Rs7-12Cr\n- Team: 18-24 people\n- Burn: Rs4-6Cr\n- Net: Profitable. Series A ready with Rs10Cr+ ARR as target\n\nKey assumptions: 0% client churn in Year 1 (reference client stickiness), 10% annual ACV expansion from existing clients, 90-day average sales cycle for new enterprise deals, 8-week average onboarding time reducing to 4 weeks by Year 2 with the playbook.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "yellow"
        },
        {
          id: "Q8",
          question: "What are the key risks, and how do you plan to manage them?",
          answer: "I see five material risks:\n\nRisk 1 - Long sales cycles create cash flow pressure.\nEnterprise B2B deals take 3-8 months to close. With a small team and one reference client, a 3-month pipeline drought could be existential.\nMitigation: The 90-day paid pilot (Rs3-5L) compresses the decision timeline. It also generates early cash and a data-rich case study simultaneously. I never pitch a full ACV before offering a pilot - it lowers the activation energy of every decision.\n\nRisk 2 - Single vertical concentration risk.\nIf real estate developers stop buying (regulatory change, market slowdown), we have no fallback revenue in Year 1.\nMitigation: BFSI track launches in parallel from Month 3. The product is genuinely vertical-agnostic - it is our sales focus that is vertical-specific. Diversification is built into the GTM plan, not an afterthought.\n\nRisk 3 - Capillary or Salesforce drops pricing to block mid-market penetration.\nBoth have the scale to price us out if they choose to.\nMitigation: Our moat is not price - it is vertical depth and the escrow wallet. Neither Capillary nor Salesforce can ship a demand-note rule trigger, a mark-to-market escrow wallet, and a production-proven Salesforce integration in less than 12-18 months. We use that window to sign 5-8 reference clients and build switching cost.\n\nRisk 4 - Key person dependency.\nIn a 4-person team, losing one technical co-founder or the sales lead would be material.\nMitigation: Document every integration, every rule template, and every client configuration in the onboarding playbook from Day 1. The business should not live in anyone's head. Vesting cliffs and ESOP structures are in place.\n\nRisk 5 - Regulatory change in BFSI loyalty (RBI guideline tightening).\nRBI has issued guidance on prepaid instruments that could affect how loyalty points are classified.\nMitigation: The escrow wallet is our hedge - it is designed to be RBI-compatible. I publish the compliance guide and engage with FIDC/MFIN to stay ahead of regulatory development. Being the 'compliant loyalty platform' is a feature, not a burden.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "orange"
        },
        {
          id: "Q9",
          question: "What does your team look like, and what capabilities do you need to build?",
          answer: "Current team: 2 technical founders with product and engineering depth, supported by the go-to-market work being validated now.\n\nWe have built and deployed a production-grade loyalty rule engine with 12+ Salesforce API endpoints, a multi-tier wallet system, a full redemption store, and an escrow wallet - all in a single live deployment. This is not a prototype. This is a product that handles real money and real customer data for a major enterprise client.\n\nCapability gaps and hiring plan:\n\nMonth 2 - Senior Sales Hire (Priority: Critical):\nSomeone who has sold enterprise B2B SaaS into real estate or BFSI in India. They must be able to navigate a buying committee (CMO, CFO, IT) and close deals at Rs20-40L ACV independently. This hire frees the founding team from sales calls and allows us to pursue three verticals simultaneously.\n\nMonth 4 - Customer Success Manager (Priority: High):\nAs we onboard clients 2 and 3, the founding team cannot be the onboarding resource. The CS Manager owns onboarding time reduction and client health metrics. They run the playbook, configure the first rule set with the client, and track MAU and redemption rates month-on-month.\n\nMonth 6 - Marketing / Content Hire (Priority: Medium):\nTo sustain LinkedIn content velocity and manage event logistics. The founding team's time is better spent in sales and product at this stage - but the content engine must not stop.\n\nMonth 10-12 - ML Engineer (Priority: Medium):\nTo begin building the AI reward optimisation engine. This is the 6-18 month roadmap item - hiring ahead of it allows a 3-4 month research and prototyping phase before production.\n\nAdvisory board: I am building a 3-person advisory board: (1) a former CXO at a large Indian real estate developer who can open doors and validate the product, (2) a BFSI compliance expert who can advise on RBI loyalty guidelines, and (3) a Salesforce ecosystem leader who can accelerate partner relationships.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "blue"
        },
        {
          id: "Q10",
          question: "What is your vision for this company in 5 years, and what does success look like?",
          answer: "In 5 years, I want to be the default loyalty infrastructure for high-value customer relationships in emerging markets - starting in India, expanding to GCC and SEA.\n\nThe 5-year vision has three layers:\n\nLayer 1 - Category ownership in India (Years 1-3):\nWe become the obvious answer when a CFO at an Indian real estate developer, NBFC, or automotive group asks 'how do we build a loyalty programme?' Not because we outspent Capillary on marketing - but because we have the deepest vertical knowledge, the most specific product, and the most published proof points in each category. 40+ clients in India across 5 verticals, Rs15-25Cr ARR.\n\nLayer 2 - GCC expansion (Years 3-4):\nThe GCC (UAE, Saudi, Qatar, Bahrain) has identical verticals to India - real estate groups, Islamic banks, automotive dealerships - and a far higher willingness to pay for loyalty infrastructure. A single UAE real estate group deployment at Rs200,000 ACV equals 5 Indian clients. We expand with a small regional sales presence and a data residency-compliant infrastructure. Rs40-70Cr ARR.\n\nLayer 3 - Platform and ecosystem (Years 4-5):\nWe open our API to third-party developers and Salesforce ISV partners. The Loyalty Rule Engine becomes an infrastructure layer - not just a product. ISVs build vertical-specific extensions on top of us. We take a platform fee. This is the Stripe/Twilio model for loyalty - infrastructure that others build on. Rs100Cr+ ARR with 60%+ gross margins.\n\nWhat success looks like to me in 5 years:\n- 80-120 enterprise clients across India and GCC\n- Rs80-120Cr ARR with 70%+ gross margin\n- NRR of 120%+ - clients expanding, not churning\n- The escrow wallet is an industry standard - other platforms copy it\n- One IPO-ready balance sheet or a strategic acquisition by a global loyalty or CRM player at 8-12x revenue\n\nThe north star has not changed: every client's customers should feel genuinely rewarded for the behaviours that matter most to the business - and every client's CFO should sleep soundly knowing exactly what their loyalty liability is. If we achieve both at scale, we have built something worth building.",
          source: "Founder's Answer",
          flag: "Founder draft - review before external use",
          colorContext: "teal"
        }
      ]
    },
    detailedMarketAnalysis: {
      targetAudience: [
        {
          segment: "Mid-to-Large Real Estate Developers",
          demographics: "Industry: Residential and commercial real estate\nCompany size: Rs 200Cr-Rs 5,000Cr revenue, 500-10,000 units/year\nBuyer: VP Sales, CRM, L&D Head",
          geography: "India (Tier 1-2 cities: Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad)",
          industry: "Real Estate",
          painPoints: "1. Collections TAT is 30-60 days on average; demand notes go unpaid without aggressive follow-up and there is no automated incentive mechanism to reward early payment.\n2. Referral programmes run on Excel with no real-time tracking, incentives paid late, and channel conflict between broker and customer referrals.\n3. No loyalty data layer exists, so every buyer is treated the same with no tiering, segmentation, or behaviour-led rewards.",
          notSolved: "1. Each day of delayed collection costs 0.05-0.1% interest on outstanding receivables; at Rs 500Cr collections book, one extra day can mean Rs 25-50L interest cost.\n2. Without referral programme automation, warm leads are lost to broker commission leakage, often 1-2% of transaction value.\n3. Repeat-buyer potential across second, third, and fourth asset purchases is not leveraged.",
          goodEnough: "Collections team calls daily.\nExcel-tracked referral bonuses paid quarterly.\nBasic Xoxoday vouchers issued manually for milestones.\nNo tier structure and no rule automation.",
          triggerToSwitch: "Lost a deal to a competitor that offered an integrated loyalty programme to their sales team as a differentiator; or CFO asks for liability management around outstanding loyalty points."
        },
        {
          segment: "Private Banks, NBFCs and Digital Lenders",
          demographics: "Industry: Banking and financial services\nCompany size: Rs 1,000Cr-Rs 50,000Cr AUM, 50,000-5M customers\nBuyer: Chief Customer Officer, Lending Product Head",
          geography: "India (national private banks, regional co-operative banks, NBFCs); Global (digital-first banks in SEA, GCC, UK)",
          industry: "BFSI",
          painPoints: "1. Standard loyalty points on card spend are not differentiated, so customers have zero reason to choose one bank over another based on loyalty alone.\n2. Cross-sell loyalty, where a customer is rewarded for taking a second product, requires IT development each time and marketing cannot self-configure the rules.\n3. Relationship banking and app journeys need variable bonus logic across lifetime value, risk, tenure, and product mix.",
          notSolved: "1. Undifferentiated loyalty accelerates churn to competitors offering better rewards; cost to acquire a new CASA customer can be Rs 2,000-Rs 8,000 versus roughly Rs 500 to retain.\n2. Cross-sell rates remain at industry average 1.8 products per customer; well-executed loyalty can push this to 2.5-3.0, creating significant revenue uplift.\n3. Premium customer experience remains generic while liability exposure on points keeps growing.",
          goodEnough: "Comviva or in-house rule engine that is 2-5 years old and unscalable.\nSalesforce Loyalty Management for a few enterprises, but expensive and complex.\nPoints redeemable for Flipkart or Amazon vouchers with low perceived value.\nRules changed quarterly via IT tickets.",
          triggerToSwitch: "RBI circular on customer service standards; competitive pressure from a new entrant offering superior loyalty; internal audit flags uncapped loyalty liability."
        },
        {
          segment: "Automotive OEMs and Dealer Groups",
          demographics: "Industry: Passenger vehicles (new and pre-owned)\nCompany size: OEMs with 500+ dealerships; dealer groups with Rs 500Cr+ revenue\nBuyer: Head of Aftersales, CMO, Dealer Experience Head",
          geography: "India (all major OEMs and franchise dealer networks); Global (OEMs in EU and GCC building owner loyalty programmes)",
          industry: "Automotive",
          painPoints: "1. Aftersales loyalty is still paper-based or a basic app stamp card with no connection between service revenue and a configurable reward rule engine.\n2. Test drive, insurance renewal, and accessory purchase events are not tracked or incentivised in any automated way, causing revenue leakage.\n3. No segment differentiation exists for repeat owners, service loyalists, or high-value customers across the ownership lifecycle.",
          notSolved: "1. Multi-brand workshops capture 35-40% of out-of-warranty service revenue that should stay in the dealer network.\n2. Insurance renewal through the dealership versus direct generates 8-12% commission, and without an incentive programme many customers renew direct.\n3. Repeat vehicle purchase share drops when there is no lifecycle loyalty programme.",
          goodEnough: "Manual stamp cards or basic CRM loyalty.\nCDK or Dealertrack with limited loyalty modules.\nWhatsApp broadcasts for service reminders.\nNo points wallet and no redemption catalogue.",
          triggerToSwitch: "New EV brand launches with a digital-native loyalty programme; competitor dealer group shows measurable aftersales revenue uplift from loyalty programme ROI."
        },
        {
          segment: "Organised Retail Chains and D2C Brands",
          demographics: "Industry: Fashion, electronics, grocery, beauty, home\nCompany size: 50-500 stores or Rs 100Cr+ D2C revenue; 100K+ active customers\nBuyer: CMO, CRM Head, Category Head",
          geography: "India (Tier 1 organised retail, growing D2C brands); Global (mid-market retail in UK, SEA, and MENA adopting basic loyalty SaaS)",
          industry: "Retail and D2C",
          painPoints: "1. Points programmes are flat and undifferentiated, so every customer earns the same rate regardless of spend level, engagement, or brand affinity.\n2. Redemption experience is broken; points wallets exist but redemption pages are generic and irrelevant to the individual customer.\n3. Personalised loyalty is not connected to browsing, cart, repeat purchase, or store-visit signals.",
          notSolved: "1. A 5% improvement in retention rate can increase profit by 25-95%, but current loyalty does not drive meaningful behaviour change.\n2. Unredeemed points remain unresolved liability on the balance sheet and create audit exposure when active redemption is weak.\n3. CAC remains high because loyalty fails to increase repeat purchase or AOV.",
          goodEnough: "Basic loyalty SaaS such as LoyaltyLion or Smile.io.\nTeam-run WhatsApp campaigns for reactivation.\nManual voucher issuance for VIP customers.\nNo behaviour-triggered rules.",
          triggerToSwitch: "CAC rises above sustainable threshold; board asks for CLV improvement plan; competitor D2C brand launches a tier-based loyalty programme that drives press coverage."
        },
        {
          segment: "Hospitality Groups (Hotels, Resorts, Clubs)",
          demographics: "Industry: Hospitality and leisure\nCompany size: 10-200 properties, Rs 100Cr-Rs 2,000Cr revenue\nBuyer: VP Revenue Management, Loyalty Head, CX Head",
          geography: "India (premium standalone hotels, resort chains, members clubs); Global (boutique hotel groups in EU, GCC, SEA)",
          industry: "Hospitality",
          painPoints: "1. Loyalty programme rules are locked inside the PMS, so marketing cannot make rule changes without vendor intervention and the turnaround is slow.\n2. Direct booking share erodes to OTAs because OTA rewards feel better than the hotel's own loyalty proposition.\n3. Loyalty data sits across stays, dining, spa, and events with no unified customer view.",
          notSolved: "1. OTA commission on displaced direct booking is 15-25% of room revenue, creating major leakage.\n2. Loyal guests spend more per stay and are cheaper to retain than OTA-acquired guests, but that value remains invisible without a functional loyalty programme.\n3. Member acquisition cost through OTAs keeps rising year after year.",
          goodEnough: "Basic PMS loyalty module such as Opera or IDS Next.\nManual tier upgrade process.\nEmail newsletter with generic voucher.\nNo mobile personalised redemption.",
          triggerToSwitch: "Losing direct bookings to a competitor hotel that launched a digital loyalty app; OTA commission costs flagged by CFO; a new GM with loyalty programme experience joins."
        },
        {
          segment: "Global: Mid-Market SaaS and Subscription Businesses",
          demographics: "Industry: SaaS, subscription services, professional services\nCompany size: $5M-$100M ARR; 1,000-100,000 customers\nBuyer: Head of Customer Success, VP Growth",
          geography: "Global (US, UK, EU, Australia) - not India-primary; international expansion opportunity",
          industry: "SaaS and Subscriptions",
          painPoints: "1. Renewal and upsell behaviour is still driven entirely by account managers; there is no automated loyalty mechanic that rewards product engagement or usage milestones.\n2. Net Revenue Retention improvement requires reducing logo churn or loyalty-based milestone rewards for power users, but most teams still run manual programmes.\n3. Referral-sourced customers have higher LTV than outbound-sourced customers, yet referral loyalty remains disconnected from CRM and lifecycle automation.",
          notSolved: "1. Logo churn of even 1% compounds into significant ARR replacement pressure every year.\n2. Referral-sourced customers have materially higher LTV, so without an automated referral engine that value is left on the table.\n3. Product adoption and expansion signals do not connect to a reward programme, so renewal momentum is lost.",
          goodEnough: "Manual CSM outreach for renewals.\nBasic referral SaaS with no CRM integration.\nSwag-store tooling such as Printfection or Sendoso for milestone gifts.\nNo rule engine connecting behaviour to reward.",
          triggerToSwitch: "NRR drops below 100% for the first time; board asks for a retention improvement plan; competitor SaaS announces a loyalty programme as a GTM differentiator."
        }
      ],
      competitorMapping: [
        {
          name: "Capillary Technologies (India SaaS - loyalty platform)",
          location: "India Competitor",
          targetCustomer: "Mid-to-large retailers and consumer brands in India and SEA. Primary verticals: fashion, grocery, QSR, beauty. Typical client: Rs 500Cr+ revenue brand.",
          pricing: "SaaS subscription plus transaction pricing. India: roughly Rs 25L-Rs 2Cr+ per year depending on volume.",
          discovery: "Direct sales, industry events, LinkedIn ABM, and retail ecosystem referrals.",
          strongestFeatures: "- Industry-leading retail loyalty engine with deep POS integration.\n- Strong analytics and segmentation.\n- Omni-channel online plus offline unified loyalty.\n- Strong reference network in retail and SEA.",
          weakness: "- Heavy and expensive for non-retail verticals.\n- Poor fit for high-value, low-frequency purchases such as real estate, auto, and BFSI.\n- No escrow or liability management feature.\n- Long implementation cycles and significant IT involvement.",
          marketGaps: "Gap: Capillary is retail-centric and cannot serve real estate, BFSI, or auto deeply.\nExploit: Lead with vertical depth, escrow wallet, transaction-event engine, and CRM-native integration built for those sectors.",
          threats: "AI-powered personalisation and auto-optimised reward offers could outpace us if Capillary expands vertically.",
          threatLevel: "HIGH"
        },
        {
          name: "Xoxoday / Plum (India rewards and voucher platform)",
          location: "India Competitor",
          targetCustomer: "HR teams, employee rewards teams, marketing campaign teams, and sales incentive programmes across industries.",
          pricing: "Pay-per-redemption plus SaaS subscription. India: roughly Rs 5L-Rs 50L per year plus redemption margin.",
          discovery: "Google Ads, HR SaaS marketplaces, referrals, partner ecosystem, and brand recall in incentives.",
          strongestFeatures: "- Massive catalogue with global reward options.\n- Fast setup with voucher campaigns live in days.\n- Strong in employee rewards and sales incentives.\n- Good API for basic CRM integration.\n- Recognised brand in India incentive market.",
          weakness: "- Not a true loyalty engine; it is a reward fulfilment platform.\n- No tier management, no wallet, no escrow.\n- Cannot configure complex multi-condition rules.\n- No financial controls or liability management.\n- Better as a campaign tool than a long-term programme.",
          marketGaps: "Gap: Xoxoday is today's good-enough workaround for vouchers, not loyalty infrastructure.\nExploit: Position as the upgrade path with rules plus wallet, while still integrating Xoxoday as a reward partner if needed.",
          threats: "Workflow automation and deeper CRM integrations could move Xoxoday closer to loyalty territory and threaten our mid-market positioning.",
          threatLevel: "MEDIUM"
        },
        {
          name: "Salesforce Loyalty Management (Global SaaS - enterprise CRM add-on)",
          location: "India and Global Competitor",
          targetCustomer: "Enterprise Salesforce customers in retail, BFSI, and consumer goods. Typical client: Fortune 500 or Indian unicorn already on a full Salesforce stack.",
          pricing: "Sold as a Salesforce add-on. India: roughly Rs 30L-Rs 3Cr+ per year on top of Salesforce licensing.",
          discovery: "Salesforce account executives, Dreamforce, AppExchange, SI partners, and the Salesforce ecosystem.",
          strongestFeatures: "- Native Salesforce integration with no external sync needed.\n- Enterprise-grade security and compliance.\n- Rich analytics via Salesforce CRM Analytics.\n- Strong for retail and consumer goods use cases.\n- Massive global support ecosystem.",
          weakness: "- Extremely expensive for SME and mid-market clients.\n- Requires full Salesforce stack in place and is not standalone.\n- Complex to configure and often needs a consultant.\n- No escrow or liability management.",
          marketGaps: "Gap: Too expensive and too stack-dependent for most mid-market buyers.\nExploit: Position as CRM-connected, faster to deploy, and far more practical for real-world loyalty use cases with specialised liability controls.",
          threats: "Einstein AI and Data Cloud investment could make Salesforce stronger if pricing and deployment become simpler for mid-market.",
          threatLevel: "HIGH"
        },
        {
          name: "MartJack / Vinculum (India retail tech)",
          location: "India Competitor",
          targetCustomer: "Omnichannel retailers in India with e-commerce plus physical store presence. Typical client: Rs 100Cr-Rs 1,000Cr revenue retail brand.",
          pricing: "SaaS subscription plus implementation fees. India: roughly Rs 8L-Rs 80L per year.",
          discovery: "Retail trade events, digital marketing, partner channel, and unified commerce buying cycles.",
          strongestFeatures: "- Strong order management and inventory sync.\n- Basic loyalty module bundled with retail OMS.\n- Good for brands needing unified commerce.\n- Lower cost than Capillary for mid-market retail.",
          weakness: "- Loyalty is an add-on, not the core product.\n- Limited rule engine depth.\n- No tier-based differential logic or complex multi-condition rules.\n- No wallet or escrow management.\n- Weak analytics on loyalty performance.",
          marketGaps: "Gap: The bundled loyalty layer is basic and serious programmes outgrow it.\nExploit: Partner or displace as the specialist loyalty engine for Vinculum clients needing depth beyond earn-and-burn.",
          threats: "Shopify and quick-commerce integrations could expand Vinculum into D2C loyalty, a segment we also target.",
          threatLevel: "MEDIUM"
        },
        {
          name: "LoyaltyPlus / In-house Custom Builds (India proprietary legacy systems)",
          location: "India Competitor",
          targetCustomer: "Large enterprises in BFSI, telecom, and retail that built custom loyalty systems 5-10 years ago and still run them internally.",
          pricing: "No external price. Initial IT cost often Rs 1Cr-Rs 10Cr+ with annual maintenance of Rs 50L-Rs 2Cr in internal resources.",
          discovery: "Existing IT relationships and incumbent internal systems.",
          strongestFeatures: "- Deeply customised to specific business rules.\n- Full control with no vendor dependency.\n- Already integrated with internal systems.\n- No recurring SaaS fee.",
          weakness: "- Cannot adapt quickly to new rule requirements because every change needs an IT sprint.\n- No modern redemption catalogue.\n- Escrow and financial controls are usually absent.\n- Cannot leverage modern API ecosystems or AI.\n- High real TCO once internal IT cost is counted.",
          marketGaps: "Gap: These systems are brittle and expensive but feel hard to replace.\nExploit: Lead with a modernisation-without-migration story and coexist alongside legacy systems while new orchestration moves to us.",
          threats: "The main threat is inertia: internal teams keep extending legacy systems and delay the modernisation decision.",
          threatLevel: "MEDIUM"
        },
        {
          name: "Antavo (Global enterprise loyalty SaaS)",
          location: "Global Competitor",
          targetCustomer: "Enterprise retail, FMCG, and airline loyalty programmes globally. Primary markets: EU, UK, USA, MENA. Typical client: EUR 200M+ revenue brand.",
          pricing: "Enterprise SaaS. Global: roughly EUR 80,000-EUR 500,000+ per year.",
          discovery: "Gartner Magic Quadrant, Forrester Wave, partner ecosystem, analyst mentions, and enterprise discovery.",
          strongestFeatures: "- Recognised Gartner leader in loyalty management.\n- Deep rule engine with many trigger types.\n- Strong enterprise integrations.\n- In-store plus digital loyalty unified.\n- Sustainability and CSR loyalty mechanics.",
          weakness: "- Very expensive and out of reach for SME and mid-market.\n- Long sales cycle.\n- No India presence or vertical depth for real estate or BFSI.\n- No escrow or financial liability management.\n- Heavy implementation effort.",
          marketGaps: "Gap: Antavo does not serve India's high-growth mid-market because pricing and complexity exclude most buyers.\nExploit: Use Antavo's feature set as a roadmap benchmark while undercutting on price, speed, and finance controls.",
          threats: "Antavo's AI Loyalty Cloud can predict churn and auto-optimise rewards. That is a feature gap we need in the next 12-18 months.",
          threatLevel: "HIGH"
        },
        {
          name: "Comarch Loyalty Management (Global enterprise loyalty plus airline and travel)",
          location: "Global Competitor",
          targetCustomer: "Airlines, banking, telecom, and large retail loyalty programmes globally, especially in EU and GCC.",
          pricing: "Enterprise licence plus implementation. Global: roughly EUR 150,000-EUR 1M+ per year.",
          discovery: "Aviation trade events, banking technology conferences, direct enterprise sales, and telecom buying cycles.",
          strongestFeatures: "- Strong frequent-flyer and airline loyalty depth.\n- Banking and financial services modules.\n- Highly configurable for large-scale programmes.\n- Strong EU data compliance and governance.",
          weakness: "- Very expensive and complex.\n- No India office or India-specific compliance layer.\n- Not suited for SME or fast-growth buyers.\n- Slow to deploy.\n- No escrow or financial liability feature.\n- Legacy UI and weak mobile experience.",
          marketGaps: "Gap: Overkill for any company under roughly Rs 500M revenue.\nExploit: Serve BFSI and travel in India that need depth at a fraction of Comarch's cost, with modern UX and India-specific integrations.",
          threats: "Composable loyalty architecture and modular APIs could lower Comarch's entry price and threaten us in BFSI and telecom.",
          threatLevel: "HIGH"
        },
        {
          name: "Yotpo Loyalty and Referrals (Global D2C and e-commerce focused)",
          location: "Global Competitor",
          targetCustomer: "D2C brands and e-commerce companies globally, especially Shopify and BigCommerce brands with $1M-$50M revenue.",
          pricing: "SaaS subscription. Global: about $300-$2,000 per month from SMB to mid-market.",
          discovery: "Shopify App Store, Google Ads, D2C communities, and Yotpo partner ecosystem.",
          strongestFeatures: "- Tight Shopify and WooCommerce integration.\n- Fast setup.\n- Strong referral engine.\n- SMS and email loyalty built in.\n- Good reviews integration.\n- Strong brand in D2C loyalty.",
          weakness: "- Flat earn-and-burn with minimal rule engine depth.\n- No tier-based complex rules.\n- No wallet, no escrow, and no financial controls.\n- Not suited for high-value or non-e-commerce verticals.\n- Limited India presence.",
          marketGaps: "Gap: Yotpo is the default for Shopify loyalty but remains surface-level.\nExploit: Target Indian D2C brands that outgrow it and need segmentation, milestones, and a richer redemption value ladder.",
          threats: "Yotpo's SMS marketing plus loyalty integration creates a strong channel-native experience. If it adds rule-engine depth and launches properly in India, it becomes a direct D2C threat.",
          threatLevel: "MEDIUM"
        },
        {
          name: "LoyaltyLion (Global e-commerce loyalty)",
          location: "Global Competitor",
          targetCustomer: "E-commerce brands on Shopify, Magento, and WooCommerce. Primary markets: UK, US, EU. Typical client: D2C brand with GBP 1M-GBP 50M revenue.",
          pricing: "SaaS subscription. Global: about GBP 300-GBP 1,500+ per month.",
          discovery: "Shopify App Store, Klaviyo integrations, e-commerce communities, and product-led discovery.",
          strongestFeatures: "- Strong Klaviyo and email integration.\n- Engagement rewards for social, reviews, and referrals.\n- Simple setup with good merchant UX.\n- Good e-commerce analytics.\n- Strong in subscription and membership loyalty.",
          weakness: "- Very limited rule engine and mostly earn-and-burn.\n- No financial controls or wallet management.\n- Not suitable outside e-commerce.\n- No India product or pricing.",
          marketGaps: "Gap: LoyaltyLion is e-commerce only and UK/US-centric with low relevance to India's dominant verticals.\nExploit: Its engagement-reward playbook is useful, but we can apply that thinking to real estate, BFSI, and automotive.",
          threats: "Deep Klaviyo integration is a distribution advantage in email-led D2C markets. Stronger CRM integrations could let LoyaltyLion move upstream into mid-market.",
          threatLevel: "MEDIUM"
        },
        {
          name: "Open Loyalty (Global headless and API-first loyalty)",
          location: "Global Competitor",
          targetCustomer: "Enterprise and scale-up tech companies building custom loyalty experiences, especially in EU and USA with strong engineering teams.",
          pricing: "Open-source core plus enterprise licensing. Global: from free core to $20,000+ per year enterprise packages.",
          discovery: "GitHub, developer communities, product-led SEO, and composable commerce ecosystems.",
          strongestFeatures: "- Fully headless and API-first.\n- Open-source core reduces vendor lock-in concerns.\n- Strong developer experience and documentation.\n- Highly configurable rule engine.\n- Modern composable architecture.",
          weakness: "- Requires significant engineering effort to implement.\n- No out-of-box UI for business users.\n- No pre-built vertical use cases for real estate or BFSI.\n- No managed-service layer for India.\n- No escrow or financial control model.",
          marketGaps: "Gap: Open Loyalty assumes an engineering-heavy operating model that most Indian mid-market companies do not have.\nExploit: We are the managed, business-user-configurable alternative with no open-source overhead.",
          threats: "Composable architecture and open-source appeal could attract funded startups to build wrappers on top of it, creating indirect competitors.",
          threatLevel: "MEDIUM"
        }
      ]
    }
  }
};

const LoyaltyEnginePage: React.FC = () => {
  return <BaseProductPage productData={loyaltyEngineData} />;
};

export default LoyaltyEnginePage;
