import React from "react";
import BaseProductPage, { ProductData } from "./BaseProductPage";
import { Globe, Smartphone, FileText, Monitor } from "lucide-react";

const customerAppData: ProductData = {
  name: "Customer post sales",
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
  userStories: [
    {
      title: "Referral & Loyalty Engine",
      items: ["Gamified referral hub with tier-based rewards (Silver/Gold/Platinum), wallet & points system, shareable referral cards for WhatsApp/Instagram, AI referral propensity engine, real-time reward tracking, leaderboard. [Core USP]"],
    },
    {
      title: "Home Loan Commission Module",
      items: ["In-app home loan enquiry, bank partner matching, application status tracking, commission dashboard for developer's Home Loans team, monthly revenue reconciliation. [Core USP]"],
    },
    {
      title: "Developer Campaign Studio",
      items: ["Self-serve campaign management for developer's loyalty team: buyer segmentation, referral bonus campaigns, tier-upgrade communications, A/B testing, real-time performance dashboard. [Core USP]"],
    },
    {
      title: "Developer Analytics Dashboard",
      items: ["Real-time referral pipeline, loyalty tier distribution, home loan funnel conversion, NPS trend, payment adherence, with AI-generated weekly digest. [Revenue Critical]"],
    },
    {
      title: "Customer Journey & Dashboard",
      items: ["Lifecycle engine: booking → registration → possession milestones with guided next actions, progress tracking, and referral prompts at each completion milestone. [⭐ USP]"],
    },
    {
      title: "Legal Workflow Digitization",
      items: ["NCF management, stamp duty UTR upload, sales deed digital acceptance, franking status tracking, registration scheduling, fully in-app. [⭐ USP]"],
    },
    {
      title: "Financial Management",
      items: ["Payment schedule, demand letters, account statement, receipts, cost sheet, EMI calculator, online payment gateway, complete financial transparency. [Core]"],
    },
    {
      title: "Document Repository",
      items: ["Centralized vault for all legal and financial documents, accessible 24/7, version-controlled, with digital acceptance audit trail. [⭐ USP]"],
    },
    {
      title: "Construction Progress",
      items: ["Developer-published milestone updates with images and videos; buyer community reaction layer; triggers loyalty points for engagement. [Core]"],
    },
    {
      title: "Support & Case Management",
      items: ["CRM-integrated case management (Salesforce sync), CSAT capture, RM call and video, buyer-initiated, tracked, measurable. [Core]"],
    },
    {
      title: "Services Marketplace",
      items: ["Post-possession curated marketplace: interior, home loan, moving, smart home. AI-curated by possession timeline. GMV commission revenue. [Add-on Revenue]"],
    },
    {
      title: "Discovery & Engagement",
      items: ["Property listings, map view, virtual walkthroughs, drone preview, events calendar, news feed, brand partner showcase, personalized notifications. [Engagement Layer]"],
    },
  ],
  industries: "Real Estate Developers",
  usps: [
    "USP 1: Referral is the North Star - Every feature is designed to end in a referral. Journey milestones trigger referral prompts. Loyalty points motivate engagement that leads to sharing. Construction updates create shareable moments. The chatbot surfaces referral opportunities proactively. No other platform in Indian real estate is built around referral velocity as the primary output.",
    "USP 2: Home Loan Commission Revenue - Post Sales is the only homebuyer platform with a structured home loan commission tracking and disbursement module, creating a direct, measurable P&L line for the developer's Home Loans team. Banks and NBFCs pay ₹8,000–30,000+ per disbursed loan. At scale, this revenue alone covers the platform cost.",
    "USP 3: Developer's Loyalty Team Gets a Real Tool - The self-serve Campaign Studio lets the developer's loyalty team run referral bonus campaigns, tier-upgrade communications, and engagement activations in minutes, without depending on the vendor. Team adoption creates platform stickiness that drives renewal certainty.",
    "USP 4: Full Lifecycle Coverage, Not Just Loyalty - Competitors like Reloy focus on loyalty and referrals post-possession. Post Sales covers the entire journey from booking through registration, construction, and possession, with referral and loyalty integrated at every milestone. The relationship starts from Day 1 of booking, not Day 1 of possession.",
    "USP 5: Revenue Story, Not a Cost Story - Post Sales sells as a revenue generator, not a cost-reduction tool. The pitch: 'This platform will pay for itself in Year 1 from home loan commissions. Everything after is referral savings and broker cost reduction.' The developer's CFO approves it, not just the CX Head.",
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
  roi: [
    "4 sales per year can make platform effectively free",
    "Reduce CP cost by 50%",
    "Reduce support cost by 20%",
  ],
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
        {
          field: "Description",
          detail:
            "White-labeled customer lifecycle app for real estate developers.",
        },
        {
          field: "Target Market",
          detail:
            "Tier 1 and Tier 2 real estate developers; luxury and large-scale portfolios.",
        },
        {
          field: "Key Outcome",
          detail:
            "Reduced customer follow-ups with self-serve status, documents, and updates.",
        },
      ],
      problemSolves: [
        {
          painPoint: "The Fundamental Insight",
          solution:
            "Industry data shows: top Indian developers already get 30–40% of bookings from repeat and referral buyers. Yet most have no structured digital system to amplify this. Post Sales is the infrastructure that takes an existing organic behavior and turns it into a predictable, measurable, compounding revenue channel.",
        },
        {
          painPoint: "Cost of Sales Math (1,000-buyer developer)",
          solution:
            "Current model: 4% broker commission on ₹1Cr avg unit. 100 new bookings → ₹4Cr in broker cost.\nPost Sales model: 8% referral share rate on 1,000 buyers = 80 referral submissions → 15 referral bookings (20% conversion) → 15 bookings at ₹0 broker cost.\nResult: 15% of bookings from referrals → ₹60L in broker commission saved → Post Sales platform pays for itself 3× over.",
        },
        {
          painPoint: "Home Loan Revenue Math",
          solution:
            "1,000 buyers × 60% home loan uptake × ₹15,000 avg commission = ₹90L/year in structured home loan commission for developer's Home Loans team. This is a net-new revenue line that did not exist before Post Sales.",
        },
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
        {
          dimension: "Adoption",
          state: "Deployed with multiple developers as white-labeled apps.",
        },
        {
          dimension: "USP",
          state: "Developer-owned data plus brand-aligned look and feel.",
        },
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
        works:
          "Displays purchase information across units owned with the developer",
        userType: "Buyer",
        usp: true,
      },
      {
        module: "CRM Vault",
        feature: "Demand Notes & Receipts",
        subFeatures: "Auto-generated demand notes, paid receipts, ledger view",
        works:
          "Pulls financial artifacts from ERP and makes them searchable for buyers",
        userType: "Buyer",
        usp: true,
      },
      {
        module: "Collections",
        feature: "Payment Reminders & Nudges",
        subFeatures:
          "Push notifications, due-date nudges, collection milestones",
        works:
          "Configurable reminder rules to reduce late payments and inbound calls",
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
        works:
          "CMS-driven updates to reassure and reduce anxiety during build phase",
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
        works:
          "Enables buyer to schedule and prepare for registration from app",
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
        works:
          "Retention loops that re-engage customers for upsell and referrals",
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
      marketSize: [
        {
          segment: "Real Estate Developers, India",
          val2425: "500-5,000 active homebuyers",
          val26: "Sales budget: ₹10-100Cr",
          forecast: "Sales cost 3-7% of revenue",
          cagr: "HIGH",
          driver: "No digital referral or loyalty infrastructure. Home loan commissions uncaptured.",
          india: "Mumbai, Pune, Bengaluru, NCR"
        }
      ],
      targetAudience: [
        {
          segment: "Real Estate Developer, India\n500-5,000 active homebuyers\nMid-to-large residential developers\nMumbai, Pune, Bengaluru, Hyderabad, NCR\nAnnual sales budget: ₹10-100Cr",
          painPoints: "1. Cost of sales is 3-7% of revenue, largely broker and channel partner commissions, with no structured, measurable alternative.\n2. No digital referral or loyalty infrastructure. Satisfied buyers refer informally, but the developer has no tool to track, reward, amplify, or time these referrals systematically.\n3. Home loan commissions are uncaptured. Developers refer buyers to banks informally and receive no structured revenue share, leaving ₹50L–2Cr/year per developer on the table.",
          notSolved: "Broker cost remains fixed or increases as competition for channel partner attention grows. Referral potential compounds negatively, buyers never activated become detractors over time. Home loan commission revenue opportunity disappears as bank DSA networks disintermediate the developer entirely.",
          goodEnough: "WhatsApp groups for buyer communication + Salesforce CRM for backend tracking + Excel for referral tracking phone calls for home loan referrals. 'It works well enough' until they run a quantitative cost-of-sales analysis.",
          revenueOpportunity: "Platform ACV ₹20–50L/year. Home loan commission rev-share ₹10–30L/year. Referral-sourced bookings reducing broker cost ₹50L–5Cr/year. Developer ROI positive in Month 3.",
          urgencySignal: "HIGH , RERA market maturation + Increasing broker commission costs + luxury segment growth creating urgency for structured referral infrastructure."
        },
        {
          segment: "Luxury Developer, India\n₹2Cr+ average unit value\n200-2,000 active buyers\nMumbai, Bengaluru, Delhi NCR, Hyderabad\nNRI buyer base significant (20-40% of sales)",
          painPoints: "1. NRI referral network is the most valuable sales asset, untapped. NRI buyers have concentrated networks of similar-income individuals across UK, US, UAE, Singapore. No digital tool to activate this network systematically.\n2. Loyalty program is either absent or a WhatsApp group. High-net-worth buyers expect a brand experience, not a generic rewards app. The gap between their expectation and reality damages brand equity.\n3. Broker commissions at ₹2Cr+ unit values are enormous (2–5% = ₹4L–10L per booking). 10 referral bookings replacing 10 broker bookings = ₹40L–1Cr in commission saved.",
          notSolved: "Luxury brand perception erodes if post-purchase experience is generic. NRI buyers who feel under-engaged refer competitors to their networks, turning the developer's most valuable marketing asset into a competitor advantage.",
          goodEnough: "Dedicated concierge RM team for VIP buyers + WhatsApp groups for NRI investors + periodic events without a structured loyalty framework.",
          revenueOpportunity: "Platform ACV ₹30–60L/year. NRI referral bookings: ₹10–50Cr in revenue with ₹0 broker cost per referral. Home loan NRI module: ₹20,000–50,000 commission per GCC bank NRI loan disbursal.",
          urgencySignal: "HIGH , NRI buyer segment growing + luxury market expanding + brand differentiation pressure increasing."
        },
        {
          segment: "Real Estate Developer, GCC\n200-2,000 active buyers (NRI + GCC locals)\nDubai primary, Abu Dhabi, Riyadh secondary\nFreehold residential projects > AED 1M/unit\nNRI buyers (South Asian) = 40-60% of base",
          painPoints: "1. RERA-Dubai mandates structured buyer communication and SPA milestone documentation. Non-compliance risk is real (penalties up to AED 1M per project), but manual compliance management is error-prone.\n2. NRI referral network (UK, US, Canada, India diaspora in GCC) is globally the highest-value referral source for Indian and UAE property. No platform systematically activates this network.\n3. Multilingual buyer experience (Arabic + English) is expected by premium buyers. Most developer portals are English-only with Arabic as an afterthought.",
          notSolved: "RERA penalties, buyer disputes over documentation gaps, and NRI referrals going to competitors who offer a better buyer experience. Once an NRI buyer recommends a competitor to their network, the developer has lost not one but five to ten potential buyers.",
          goodEnough: "Bilingual WhatsApp group + PDF milestones emailed to buyers + RM phone calls for NRI communication + informal bank referrals to Mashreq or Emirates NBD.",
          revenueOpportunity: "Platform ACV AED 250K–700K/year (₹55–155L). NRI referral bookings at AED 1M+ unit values: AED 500K–5M+ in referral-sourced sales per 90-day campaign. GCC bank home loan commission: AED 2,000–8,000 per disbursal.",
          urgencySignal: "HIGH , RERA compliance pressure + premium NRI buyer expectations + greenfield market (no dominant loyalty+referral platform in UAE real estate)."
        }
      ],
      companyPainPoints: [
        {
          companyType: "Mid-Market Indian Developer\n500-2,000 active buyers/year\nAll India metros\nAnnual CX budget: ₹30-60L\n2-5 active projects",
          pain1: "Broker commission: 2-4% of unit value. On ₹60Cr annual sales, that's ₹1.2-2.4Cr/year going to brokers. No structured referral alternative. Channel partner activation cost for every new launch.",
          pain2: "Buyer communication is WhatsApp groups managed by RMs. No loyalty program. No structured engagement between booking and possession. Buyers who should be advocates are becoming detractors by possession day.",
          pain3: "Home loan enquiries handled by RM via phone. No structured bank partnership. No commission tracking. ₹30-60L/year in home loan commissions informally lost.",
          goodEnough: "Salesforce CRM for backend + WhatsApp for buyer communication + Excel for referral tracking. 'Works fine' until a quantitative cost-of-sales review is done.",
          willingToPay: "₹20-35L/year for a platform that demonstrably reduces cost of sales and adds home loan revenue. ROI case must be clear in the first 90 days."
        },
        {
          companyType: "Luxury Indian Developer\n₹2Cr+ unit value, 200-1,000 active buyers\nMumbai, Bengaluru, Hyderabad\nAnnual CX budget: ₹50-1.5Cr\nNRI buyer base 20-40%",
          pain1: "Broker commissions at ₹2Cr+ units = ₹4L-10L per booking. 50 broker bookings/year = ₹2-5Cr in commissions. 10 referral bookings replacing 10 broker bookings = instant ₹40L-1Cr cost saving.",
          pain2: "No premium loyalty program that matches the brand. VIP buyers receive the same generic treatment as standard buyers. NPS among high-value buyers is lower than it should be , these are the buyers whose networks are worth the most.",
          pain3: "NRI buyers refer to bank DSAs outside the developer's ecosystem. Developer receives zero revenue share. At ₹20,000+ commission per NRI loan disbursal, this is a significant lost revenue stream.",
          goodEnough: "Dedicated RM team + WhatsApp VIP group + periodic investor events. 'Premium experience' delivered via people, not platform. Unscalable and undifferentiated.",
          willingToPay: "₹30-60L/year. Will pay more for a white-label, brand-matched loyalty program that makes VIP buyers feel exclusive , not like they're using the same app as everyone else."
        },
        {
          companyType: "GCC Freehold Developer\n200-1,000 active buyers (NRI + local)\nDubai primary, Abu Dhabi secondary\nAED CX budget: 500K-2M/year",
          pain1: "Broker commissions: 2-4% AED on off-plan properties. AED 1M unit with 4% commission = AED 40,000/booking. 50 bookings/year = AED 2M in broker cost. 10 referral bookings from NRI network = AED 400K saved.",
          pain2: "No Arabic-native loyalty program. Multilingual buyer base (Arabic, English, Hindi) expects a culturally appropriate digital experience. Generic English-only apps create a perceived quality gap in the premium GCC market.",
          pain3: "GCC bank home loan partnerships (Mashreq, Emirates NBD, FAB) pay AED 2,000-8,000 per disbursal to structured referral partners. No developer in GCC has a structured in-app home loan referral workflow yet.",
          goodEnough: "Bilingual WhatsApp + PDF reports + RM calls + periodic site visits. RERA compliance managed manually. 'Good enough' until a RERA audit or a buyer dispute exposes the documentation gaps.",
          willingToPay: "AED 250K-500K/year (₹55-110L). Value framing: RERA compliance + NRI referral activation + home loan commission revenue. Will pay significantly more if UAE data residency and Arabic interface are production ready."
        }
      ],
      competitorMapping: [
        {
          name: "Reloy (formerly Loyalie)",
          isPrimary: true,
          location: "Mumbai, India",
          targetCustomer: "Mid-to-large Indian residential developers - Godrej, Piramal, Mahindra, K Raheja, Shapoorji as named clients - 14 cities - India primary",
          pricing: "Annual SaaS license per developer. Not publicly disclosed. Estimated ₹15-40L/year based on buyer base size and features. Performance-linked pilot structures available.",
          discovery: "Developer industry events (CREDAI, PropTech India) - Founder-led direct sales - Word-of-mouth from Godrej/Piramal reference clients - PropTech media coverage",
          strongestFeatures: "Established referral sales track record (5% -> 15% referral rate for one client in 10 months)\n• ConnectRE (buyer loyalty) + WinnRE (channel partner) dual-product ,covers both sides of sales ecosystem\n• ₹28.5Cr revenue (FY25), targeting ₹45-50Cr FY26\n• HDFC Capital-backed (credibility signal)",
          weakness: "No home loan commission module or structured bank partnership revenue\n• No full lifecycle coverage (primarily post-possession; does not own booking -> registration journey)\n• No developer campaign studio for loyalty team self-serve\n• Developer relationship is transactional / API-level , not a revenue story",
          marketGaps: "Post Sales covers the full buyer lifecycle from booking Day 1 , not just post-possession. We add home loan commission revenue as a direct P&L line. Our AI propensity engine makes referrals proactive, not passive. We are the first platform to give the loyalty team a self-service campaign studio.",
          threats: "Reloy's dual-product strategy (buyer + channel partner) could evolve into a full sales CRM replacement , threat if they add booking-to-possession lifecycle tracking. Their HDFC Capital backing gives them capital to build fast.",
          pricingRisk: "MEDIUM",
          threatLevel: "HIGH"
        },
        {
          name: "NoBrokerHood / MyGate",
          location: "India (post-possession community apps)",
          targetCustomer: "Housing societies and gated community residents - RWAs (Resident Welfare Associations) - India urban metros - Post-possession only",
          pricing: "Free for residents. Freemium/paid for society management features. Developer API integrations as paid add-ons. No developer SaaS pricing.",
          discovery: "App store organic - Housing society committee referrals - Word-of-mouth in gated communities",
          strongestFeatures: "Dominant post-possession community engagement: visitor management, maintenance payments, community board\n• Large installed base (500,000+ societies claimed)\n• Brand recognition among residents",
          weakness: "No pre-possession coverage (booking -> construction -> possession is a gap they don't own)\n• No loyalty + referral engine for developers\n• Developer relationship is transactional/API-level , not a developer revenue story",
          marketGaps: "Post Sales owns the pre-possession journey that NoBrokerHood ignores. By the time possession happens, our buyers are already loyal advocates who have referred friends. We extend into post-possession with the community layer , NoBrokerHood encroaching backward is our primary medium-term threat to defend against.",
          threats: "NoBrokerHood could add a developer-facing loyalty + referral module and push backward into pre-possession. Well-funded (NoBroker raised $210M+). This is the most likely copycat threat in 12–24 months.",
          pricingRisk: "LOW",
          threatLevel: "MEDIUM"
        },
        {
          name: "Salesforce CRM (+ WhatsApp + Email)",
          location: "Global (used by Indian developers as status quo)",
          targetCustomer: "Enterprise real estate developers with existing Salesforce licenses - CRM-managed post-sales workflows - India and GCC mid-to-large developers",
          pricing: "Salesforce: ₹3,500–12,000/user/month + implementation ₹10–50L+ - Total cost of Salesforce + WhatsApp + Excel + manual workflows: ₹20–60L/year equivalent",
          discovery: "Already embedded in developer IT infrastructure - Not a 'competitor' in the traditional sense , it is the incumbent status quo we are displacing",
          strongestFeatures: "Deep CRM functionality\n• Executive familiarity and existing licences\n• Integration with finance and ERP systems",
          weakness: "No buyer-facing mobile app\n• No referral or loyalty program\n• No home loan commission tracking\n• No gamification or engagement layer\n• Developer teams operate it; buyers are completely excluded from the experience",
          marketGaps: "The displacement pitch: 'You already pay for Salesforce. Post Sales sits on top of it , we connect your buyers to your CRM data and add a referral and loyalty layer that Salesforce can never provide.' Integration, not replacement.",
          threats: "Salesforce adding a homebuyer-facing module through a PropTech ISV partner is possible. Their App Exchange ecosystem could theoretically produce a competing product.",
          pricingRisk: "HIGH",
          threatLevel: "LOW-MEDIUM"
        },
        {
          name: "BuilderSoft / PropSoft (India Real Estate ERP)",
          targetCustomer: "Indian residential developers managing inventory, payments, and sales · Small-to-mid developers (50–500 buyers/year) · One-time license model",
          pricing: "One-time license ₹5–25L + AMC ₹1–5L/year. SaaS pricing not standard. No per-buyer volume pricing.",
          discovery: "Real estate developer conferences (CREDAI, NAREDCO) · Builder community referrals · Regional sales teams",
          strongestFeatures: "Deep ERP functionality (inventory, payment tracking, construction cost management)\n• Long-standing developer relationships in smaller developer market",
          weakness: "No buyer-facing app or mobile experience\n• No loyalty, referral, or advocacy features\n• No home loan commission module\n• Backend-only; buyers are completely invisible to this product\n• Technology stack is dated",
          marketGaps: "Small developer market (50–300 buyers) is an addressable expansion target for Post Sales once mid-market case studies are established. BuilderSoft's ERP-only positioning creates a complete gap in buyer experience, loyalty, and referral - the exact value Post Sales delivers.",
          threats: "Unlikely to evolve rapidly. Technology and capital constraints limit their ability to build a modern buyer-facing product.",
          pricingRisk: "LOW",
          threatLevel: "LOW. Not a direct competitive threat."
        },
        {
          name: "Bayut / Property Finder (GCC Real Estate Portals)",
          location: "UAE, Saudi Arabia, Qatar",
          targetCustomer: "Property buyers and sellers in GCC markets · Real estate agencies and developers for lead generation · Dubai primary",
          pricing: "Lead generation model (pay-per-lead or subscription). No post-sales product revenue. Developer listings as primary product.",
          discovery: "Google search dominance for UAE property keywords · Social media (Instagram, LinkedIn) · Developer-agency relationships",
          strongestFeatures: "Dominant buyer discovery platforms in GCC\n• Arabic-first user experience\n• Deep developer and agency relationships\n• Bayut: backed by Emerging Markets Property Group (OLX parent)",
          weakness: "No post-sales homebuyer experience. Listing ends at enquiry\n• No loyalty or referral program for developers\n• No home loan commission module\n• Post-purchase buyer engagement is completely absent",
          marketGaps: "GCC portal market is entirely pre-purchase. There is no post-purchase loyalty + referral platform in UAE real estate - Post Sales is the first. Bayut and Property Finder could become white-label API partners for our developer tools.",
          threats: "Bayut could add a post-sales module to their developer dashboard. Given their developer relationships and Arabic-native UX, they would be a credible white-label platform competitor if they moved into this space.",
          pricingRisk: "MEDIUM (GCC)",
          threatLevel: "MEDIUM (GCC). Not a current competitor but a potential threat."
        }
      ],
      competitorSummary: "Customer App correctly occupies the 'Full-Lifecycle' quadrant by offering a unified booking-to-possession experience. Reloy lacks the home loan commission tracking, and backend CRMs like Salesforce lack the essential buyer-facing interface. We secure unmatched ROI by addressing core revenue leakage points (Brokers, DSA Networks)."
    },
    detailedPricing: {
      featuresVsMarket: [
        {
          featureArea: "Developer-branded customer app",
          marketStandard: "Developers want a branded ownership layer instead of generic service portals.",
          ourProduct: "Strong white-labeled app with brand identity, customer communication, and modular journey support.",
          status: "AHEAD",
          summary: "Helps us anchor value above support tools and position as branded CX infrastructure."
        },
        {
          featureArea: "Demand notes and payment visibility",
          marketStandard: "Payment clarity is a high-frequency pain point post-booking.",
          ourProduct: "Real-time demand note access and payment-related updates available within the app.",
          status: "AHEAD",
          summary: "Directly reduces support calls and improves trust across the ownership journey."
        },
        {
          featureArea: "Construction updates",
          marketStandard: "Buyers expect regular updates and visual reassurance post-booking.",
          ourProduct: "Project progress and milestone communication supported in-app.",
          status: "AT PAR",
          summary: "Supports transparency narrative and strengthens retention before possession."
        },
        {
          featureArea: "Referral and loyalty engine",
          marketStandard: "Developers increasingly want repeat and referral revenue from existing buyers.",
          ourProduct: "Referral journeys, rewards, and gamified engagement can be layered into the app.",
          status: "AHEAD",
          summary: "Major commercial differentiator because it ties CX to measurable topline outcomes."
        },
        {
          featureArea: "Document vault / CRM vault",
          marketStandard: "Centralized document access is expected in premium and enterprise projects.",
          ourProduct: "Buyer-facing access to agreements, receipts, and demand notes via CRM vault.",
          status: "AHEAD",
          summary: "Reduces repetitive support dependency and raises perceived platform maturity."
        }
      ],
      comparisonSummary: {
        ahead: "Brand-led white-label experience, CRM vault, payment transparency, loyalty and referral monetization, and enterprise data control.",
        atPar: "Construction updates and post-possession continuity are strong, but need clearer packaging.",
        gaps: "Executive analytics, commercial ROI framing, and a sharper manager-facing control narrative."
      },
      pricingLandscape: [
        {
          tier: "Core Customer Bundle",
          model: "CRM vault, demand notes, payment visibility, and construction updates.",
          india: "₹20–35L/year",
          global: "USD 25-45k/year"
        },
        {
          tier: "Expansion Modules",
          model: "Loyalty engine, referral journeys, redemption marketplace, and appointments.",
          india: "₹10–20L add-on",
          global: "USD 12-25k add-on"
        }
      ],
      positioning: [
        {
          category: "Value Proposition",
          description: "It becomes the branded post-sales operating layer for developers across payments, updates, documents, referrals, and community experience."
        },
        {
          category: "Differentiation",
          description: "Unlike static portals, Customer App creates an ongoing lifecycle journey with engagement, monetization, and long-tail post-possession continuity."
        }
      ],
      valuePropositions: [
        {
          currentProp: "White-labeled mobile app",
          segment: "Enterprise developers",
          weakness: "Reframe around branded ownership journey infrastructure.",
          sharpened: "A developer-owned customer operating layer from booking to community living."
        },
        {
          currentProp: "Referral and loyalty features",
          segment: "Sales teams",
          weakness: "Anchor in revenue growth and repeat sales outcomes.",
          sharpened: "Convert existing customers into a measurable referral and retention growth channel."
        }
      ]
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
          question:
            "6. What are the main revenue/ROI levers for the developer?",
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
        {
          metric: "Referral share rate",
          baseline: "2–3%",
          withSnag: "8–15%",
          claim:
            "3–6× increase in referral submissions via gamified referral hub + propensity nudges.",
        },
        {
          metric: "Inbound RM queries (payments/docs/updates)",
          baseline: "High (manual follow-ups)",
          withSnag: "↓ 40–70%",
          claim:
            "Self-serve vault + payment visibility + verified updates reduces repetitive queries.",
        },
        {
          metric: "Collections visibility",
          baseline: "Fragmented (ERP + calls)",
          withSnag: "Real-time",
          claim:
            "Demand notes + statements + receipts in-app improves trust and reduces disputes.",
        },
        {
          metric: "NPS at possession",
          baseline: "Variable",
          withSnag: "↑ 10–20 points",
          claim:
            "Transparency during construction increases buyer confidence and advocacy at possession.",
        },
      ],
      businessTargets: [
        {
          metric: "Support Deflection",
          definition: "% reduction in common inbound queries",
          d30Current: "0%",
          d30Phase1: "30%",
          m3Current: "0%",
          m3Phase1: "60%",
        },
        {
          metric: "Referral Conversion",
          definition: "% buyers submitting referrals per month",
          d30Current: "2%",
          d30Phase1: "6%",
          m3Current: "3%",
          m3Phase1: "10%",
        },
        {
          metric: "Monthly Active Buyers",
          definition: "% buyers active in app monthly",
          d30Current: "20%",
          d30Phase1: "45%",
          m3Current: "25%",
          m3Phase1: "60%",
        },
        {
          metric: "Document Self-Serve",
          definition: "% document requests resolved in-app",
          d30Current: "10%",
          d30Phase1: "40%",
          m3Current: "15%",
          m3Phase1: "70%",
        },
      ],
    },
    detailedUseCases: {
      industryUseCases: [
        {
          rank: "1",
          industry: "Real Estate Developers & Housing Companies (Primary — Core Buyer)",
          features: "Referral Hub · Loyalty Tier System · Campaign Studio · Home Loan Commission Dashboard · Developer Analytics · Push Notifications",
          useCase: "This is the product's home. The developer's Loyalty Team uses the Referral Hub and Campaign Studio to drive referral bookings. The Home Loans Team tracks commission revenue through the home loan dashboard. The Sales Team watches referral bookings reduce broker cost. Marketing runs gamified referral bonus campaigns. The developer moves from broker-dependent to advocate-powered.",
          profile: "Mid-to-large Indian residential developers - 500-5,000 active homebuyers - Mumbai, Pune, Bengaluru, Hyderabad, NCR - Luxury and premium segments. Currently: WhatsApp + Salesforce + Excel for post-sales",
          currentTool: "Primary Buyer: VP Sales / Head of Loyalty / Head of Home Loans. Urgency: HIGH.",
          outcome: "Primary revenue opportunity. Referral bookings reduce broker cost by ₹50L–₹5Cr/year. Home loan commissions add ₹80L–₹3Cr/year. ROI payback in Month 3."
        },
        {
          rank: "2",
          industry: "Luxury Real Estate Developers (₹2Cr+ Average Unit Value)",
          features: "Loyalty Tier (branded ambassador program) · Referral Hub with luxury reward catalog · Home Loan NRI module · Personalization engine · Developer Analytics",
          useCase: "Luxury buyers are high-net-worth individuals with social networks of similar wealth. One referred luxury buyer = ₹2-10Cr in sales. The loyalty program must match the brand — exclusive tiers, premium rewards, invitation-only early access. The developer's ambassador program is a brand asset as much as a sales channel. NRI buyers in this segment are the highest-value referral network globally.",
          profile: "Luxury residential developers - 200-2,000 active buyers - Mumbai, Bengaluru, Hyderabad, Delhi NCR, Dubai - Currently: CRM + concierge teams + WhatsApp groups for VIP buyers",
          currentTool: "Primary Buyer: MD / CEO / VP Sales. Urgency: HIGH.",
          outcome: "Luxury referral bookings convert at 25-40%. A 10-buyer referral program yielding 3 bookings at ₹5Cr avg = ₹15Cr in referral-sourced sales at near-zero cost."
        },
        {
          rank: "3",
          industry: "GCC Freehold Developers (UAE, Saudi Arabia — NRI buyer base)",
          features: "NRI Referral Module · Multi language support (Arabic + English) · Home Loan GCC Bank integration · RERA compliance documentation · Loyalty Tier · Campaign Studio",
          useCase: "GCC developers with South Asian buyer bases are sitting on the world's most powerful real estate referral network. NRI buyers from UK, US, Canada, and GCC who purchase Indian or UAE property have concentrated social networks with similar income and investment profiles. RERA-Dubai compliance + premium buyer expectations + NRI referral velocity = highest ACV opportunity globally.",
          profile: "Freehold residential developers - Dubai primary, Abu Dhabi secondary - 200-2,000 active buyers (mix of NRI and local). Currently: bilingual WhatsApp + email + CRM for buyer management",
          currentTool: "Primary Buyer: GM Customer Experience / VP Sales / MD. Urgency: HIGH.",
          outcome: "NRI referral bookings in luxury real estate convert at 30-40%. GCC ACV ₹90-200L/year. Single NRI buyer referral = ₹4-10Cr in sales."
        },
        {
          rank: "4",
          industry: "Housing Finance Companies (HFCs) & Banks",
          features: "Home Loan Enquiry module · Commission tracking dashboard · Bank API integration · Buyer verification data feed (consent-based)",
          useCase: "Post Sales creates a structured, in-app home loan enquiry pipeline from verified homebuyers — the highest-intent home loan prospects that exist. Banks and NBFCs pay ₹8,000-30,000+ per disbursed loan to structured referral partners. This is a revenue share partnership opportunity, not a sales opportunity. Banks become co-beneficiaries of Post Sales' buyer base.",
          profile: "Mid-to-large HFCs and private banks with retail home loan books - HDFC, ICICI, Axis, SBI, Bajaj Housing Finance (India) - Mashreq, Emirates NBD, FAB (GCC). Currently: DSA networks and developer referral calls for pipeline",
          currentTool: "Primary Buyer: Head of Retail Home Loans / Digital Partnerships Head. Urgency: MEDIUM-HIGH.",
          outcome: "Revenue share: ₹8,000-30,000+ per disbursed loan. At 1,000 buyers/developer * 60% uptake * 10 developer clients = potentially ₹50Cr+ in annual loan disbursals flowing through the platform."
        },
        {
          rank: "5",
          industry: "PropTech Platforms & Real Estate Portals (MagicBricks, 99acres, NoBroker type)",
          features: "API licensing: Referral Hub + Loyalty Engine + Home Loan Module · White-label deployment under platform brand · Developer analytics feed",
          useCase: "PropTech platforms want to expand beyond listing to own the post-purchase buyer relationship. Post Sales' loyalty + referral + home loan engine can be white-labeled as their 'developer post-sales product' — giving them a new developer retention tool without building it internally. API licensing creates a new B2B revenue stream for the platform and exponential distribution for Post Sales.",
          profile: "Series B-D PropTech platforms or established portals - MagicBricks, 99acres, Housing.com, NoBroker (India) - Bayut, Property Finder (GCC). Currently: listing + lead generation model with no post-purchase product",
          currentTool: "Primary Buyer: CPO / VP Product / VP Partnerships. Urgency: MEDIUM.",
          outcome: "API licensing: ₹40-80L/year per platform or GMV revenue share. One platform deal = access to 100-1,000 developer clients instantly."
        },
        {
          rank: "6",
          industry: "Real Estate Investment & Portfolio Management Firms",
          features: "Investor Loyalty Tier (early access + exclusive benefits) · Portfolio view (multi-unit) · Referral Hub with high-value reward catalog · Developer Analytics",
          useCase: "Investors who own multiple units in the same project (common in luxury and commercial real estate) are high-frequency referral sources. They know other investors. Post Sales' loyalty tier system with investor-specific early-access benefits and portfolio management tools creates a structured retention and upsell engine for developers targeting repeat investors.",
          profile: "HNI real estate investors, family offices, NRI investor groups - 5-100 units owned across developer portfolios - India and UAE. Currently: managed via dedicated RM calls and WhatsApp groups",
          currentTool: "Primary Buyer: Head of Investor Relations / VP Sales. Urgency: MEDIUM.",
          outcome: "Investor referrals convert at 35-50%. An investor referring 2 fellow HNIs can generate ₹10-30Cr in bookings. Investor loyalty programs have the highest ROI per buyer in the entire referral ecosystem."
        },
        {
          rank: "7",
          industry: "Construction & Project Delivery Companies",
          features: "Construction Progress module · Milestone scheduling · Media upload · Notification triggers to buyers",
          useCase: "Construction companies use Post Sales as the structured buyer communication channel for their development clients. The Construction Progress module gives site teams a digital publishing tool that builds buyer trust, reduces inbound calls, and creates engagement moments that the developer's loyalty team converts into referral triggers.",
          profile: "EPC contractors and construction management firms - 10-50 active projects - Pan-India. Currently: PDF reports emailed monthly + WhatsApp photos to developer RM teams",
          currentTool: "Primary Buyer: Project Director / Construction Head. Urgency: MEDIUM.",
          outcome: "Construction transparency is a referral trigger. Buyers who trust the developer refer earlier — before possession. Structured updates reduce post-possession snag complaints by 40-60%."
        },
        {
          rank: "8",
          industry: "Interior Design & Home Improvement Firms",
          features: "Services Marketplace · Possession Timeline trigger · AI recommendation engine · In-app booking and inquiry",
          useCase: "Interior designers are a natural post-possession marketplace partner. Post Sales surfaces their services to buyers at the exact moment of maximum relevance — 30-80 days before possession. AI-curated recommendations by unit size and style create conversion rates far higher than cold outreach. Developers earn GMV commission from marketplace transactions.",
          profile: "Organized interior design chains and D2C home improvement brands - 50-2,000 employees. Currently: developer referrals via WhatsApp, brochures at site office, or word-of-mouth",
          currentTool: "Primary Buyer: Head of Partnerships / Marketing Director. Urgency: MEDIUM.",
          outcome: "Interior firms that join the marketplace get verified buyer leads at possession moment — highest conversion window in home improvement. Developer earns 5-15% GMV commission."
        },
        {
          rank: "9",
          industry: "Moving & Relocation Services",
          features: "Services Marketplace · Possession Scheduling · Push Notification at possession countdown",
          useCase: "Moving companies benefit from the possession scheduling module — it gives them a verified window of buyer move-in dates. Post Sales surfaces relocation services to buyers in the possession countdown period. Automated reminders 30-15 days before possession with in-app booking create a high-conversion pipeline for organized movers.",
          profile: "Organized moving companies and app-based relocation platforms - 10-500 employees. Currently: listings on Google, JustDial, word-of-mouth, or social media",
          currentTool: "Primary Buyer: BD Head / Partnerships Manager. Urgency: LOW-MEDIUM.",
          outcome: "Verified possession-date leads are worth 5-10x the value of cold leads for moving companies. Developer earns GMV commission."
        },
        {
          rank: "10",
          industry: "Smart Home & Home Automation Companies",
          features: "Services Marketplace · Unit Details & Floor Plans for product recommendations · Possession trigger · AI recommendation",
          useCase: "Smart home vendors benefit from placement in the marketplace at the possession stage — when buyers are making decisions about their new home setup. Unit details and floor plans in the platform inform product recommendations. AI recommendation at possession creates a high-quality buyer pipeline that smart home brands cannot reach through any other channel.",
          profile: "Smart home product companies and installation firms - 20-500 employees. Currently: builder partnerships, word-of-mouth, Google Ads",
          currentTool: "Primary Buyer: Channel Sales Head / Enterprise BD. Urgency: LOW-MEDIUM.",
          outcome: "Smart home installation per unit in India: ₹50,000-5,00,000. GCC: AED 5,000-50,000. Developer earns marketplace commission on all marketplace-initiated installations."
        }
      ],
      internalTeamUseCases: [
        {
          team: "Loyalty & CX Team (Primary power user — owns the platform)",
          features: "Campaign Studio · Loyalty Tier management · Referral Hub oversight · Developer Analytics Dashboard · Push notification rules · Event management",
          process: "This team's entire job is Post Sales. They run referral bonus campaigns, manage tier upgrades, track buyer engagement, send milestone celebrations, and measure referral conversion.",
          benefit: "Increase referral booking rate from 2-5% baseline to 8-15%. Reduce dependency on paid marketing for new launch activation. Build a compounding buyer advocacy base.",
          frequency: "Daily"
        },
        {
          team: "Home Loans Team (Revenue co-owner — earns commission)",
          features: "Home Loan Commission Dashboard · Bank partner API integration · Buyer enquiry pipeline · Monthly commission reconciliation · Notification to buyers on loan status",
          process: "The Home Loans Team accesses the in-app enquiry pipeline and the commission dashboard. They see which buyers have expressed home loan interest, track application status with partner banks, and monitor monthly commission earned.",
          benefit: "Generate ₹80L-₹3Cr in annual home loan commission revenue for the developer. Build structured bank/NBFC partnerships.",
          frequency: "Daily"
        },
        {
          team: "Sales & Marketing Team (Referral campaign activation)",
          features: "Referral pipeline view · Campaign Studio for referral bonus campaigns · Analytics Dashboard · Event management · Dynamic banners · Launch roadblock screens",
          process: "Sales team benefits from referral-sourced leads. Marketing team uses the Campaign Studio to run referral bonus campaigns, loyalty tier promotions, and event activations.",
          benefit: "Reduce broker dependency for new launch activation. Increase referral sourced booking % from existing buyer base. Activate buyer community before a new launch.",
          frequency: "Weekly"
        },
        {
          team: "Construction & Delivery Team (Transparency engine — trust builder)",
          features: "Construction Progress module · Milestone scheduling · Media upload · Notification triggers · Possession Scheduling · Pre-possession checklist",
          process: "Construction team publishes verified milestone updates (photos, videos, reports) through the platform — replacing the chaos of WhatsApp groups and email forwards.",
          benefit: "Reduce buyer inbound calls about construction status by 40-80%. Build buyer trust during the construction phase — the highest-anxiety period — through verified, timestamped updates.",
          frequency: "Weekly"
        },
        {
          team: "Leadership / CXO (Oversight + ROI visibility)",
          features: "Developer Analytics Dashboard · AI weekly digest · Referral pipeline summary · Home loan commission P&L view · NPS trend · Payment adherence heatmap",
          process: "CEO, MD, and VP-level leadership use the Developer Analytics Dashboard to see referral velocity, loyalty tier distribution, home loan commission revenue, buyer NPS trend, and payment adherence in real time.",
          benefit: "Visible, measurable ROI from the Post Sales platform investment. Monthly board-level metric: referral bookings sourced, broker cost saved, home loan commission earned.",
          frequency: "Monthly"
        },
        {
          team: "IT / Technology Team (Integration owner)",
          features: "Salesforce CRM integration (read-only API) · OTP authentication · Payment gateway (PCI-DSS compliant) · Data residency configuration · Push notification infrastructure",
          process: "IT team manages the CRM integration (Salesforce), payment gateway configuration, and data security compliance. Post Sales provides a read-only API integration model that does not alter existing CRM data structure.",
          benefit: "Ensure secure, compliant integration without disrupting existing systems. Maintain DPDPA (India) and PDPL (GCC) compliance for buyer PII handling.",
          frequency: "Monthly"
        },
        {
          team: "Legal & Compliance Team (Documentation + regulatory assurance)",
          features: "Document Repository (legal vault) · NCF Management · Stamp Duty tracking · Sales Deed digital acceptance · Architect certificate access · KYC verification audit trail",
          process: "Legal team relies on Post Sales' document repository and digital acceptance workflows to maintain audit trails for NCF, stamp duty, sales deed, and possession documentation.",
          benefit: "Maintain legally defensible audit trails for all buyer-developer documentation. Reduce document-related disputes and RERA compliance risk.",
          frequency: "Monthly"
        }
      ]
    },
    detailedRoadmap: {
      structuredRoadmap: [
        {
          timeframe: "Phase 1",
          headline: "Foundation (0-3 months)",
          colorContext: "red",
          items: [
            {
              whatItIs:
                "Core customer journey layer (booking → possession) with vault + payments + updates",
              whyItMatters:
                "Establishes trust and reduces inbound follow-ups early in the lifecycle.",
              unlockedSegment:
                "Tier 1 & Tier 2 residential developers who need quick CX wins.",
              effort: "6–8 weeks",
              owner: "Product + Eng",
            },
            {
              whatItIs: "Document vault + legal acceptance workflow",
              whyItMatters:
                "Creates auditable trails and reduces disputes; improves perceived maturity.",
              unlockedSegment:
                "Premium projects with strong compliance / RERA sensitivity.",
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
              whatItIs:
                "Construction milestone storytelling with verified media + notifications",
              whyItMatters:
                "Builds confidence in high-anxiety periods and increases engagement touchpoints.",
              unlockedSegment:
                "Large portfolios where buyer trust drives NPS and referrals.",
              effort: "6–10 weeks",
              owner: "Product",
            },
            {
              whatItIs: "Referral hub + loyalty tiers (gamification)",
              whyItMatters:
                "Turns organic referral behavior into a measurable, compounding growth engine.",
              unlockedSegment:
                "Sales-led orgs seeking lower cost-of-sales and higher repeat bookings.",
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
              whatItIs:
                "Home loan commission workflow + partner matching + reconciliation",
              whyItMatters:
                "Unlocks a net-new revenue line item and a CFO-friendly ROI story.",
              unlockedSegment:
                "Developers with 500–3,000 active buyers and home loan uptake.",
              effort: "10–14 weeks",
              owner: "AI + Eng",
            },
            {
              whatItIs: "Executive cockpit: analytics + AI weekly digest",
              whyItMatters:
                "Makes outcomes visible, drives renewals, and strengthens enterprise narrative.",
              unlockedSegment:
                "Enterprise groups with IT and leadership governance requirements.",
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
