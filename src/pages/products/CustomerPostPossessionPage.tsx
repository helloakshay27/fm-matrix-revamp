import React from "react";
import BaseProductPage, { ProductData } from "./BaseProductPage";
import { Globe, Smartphone, FileText, Monitor } from "lucide-react";

const customerPostPossessionData: ProductData = {
  name: "Customer Post Possession",
  description:
    "Post-possession customer journey modules focused on community, service, engagement, and retention—delivered in a developer-branded customer app experience.",
  brief:
    "A structured post-possession layer that drives community engagement, support efficiency, and repeat/referral outcomes through resident-first journeys and measurable adoption.",

  // Keep the same overall sheet style as Customer App
  excelLikeSummary: true,
  excelLikeFeatures: true,
  excelLikeMarket: true,
  excelLikePricing: true,
  excelLikeSwot: true,
  excelLikeRoadmap: true,
  excelLikeBusinessPlan: true,
  excelLikeGtm: true,
  excelLikeMetrics: true,
  excelLikePostPossession: true,
  excelFeatureRowStart: 31,

  userStories: [
    {
      title: "1. Community",
      items: ["Communications", "Events", "Engagement", "Resident Directory"],
    },
    {
      title: "2. Services",
      items: ["Helpdesk", "Visitor & Security", "Amenities/Club", "Payments & Receipts"],
    },
    {
      title: "3. Retention & Advocacy",
      items: ["Loyalty tiers", "Referral journeys", "Campaign studio"],
    },
  ],
  industries: "Real Estate Developers",
  usps: [
    "Post-possession engagement + service workflows in one branded layer",
    "Modular adoption with analytics-ready measurement",
    "Integrates with existing society/FMS systems where needed",
    "Designed to improve renewals, referrals, and community NPS",
  ],
  includes: ["White Labeled Mobile App", "CMS"],
  upSelling: ["Community Modules", "Visitor Management", "Helpdesk Automation", "Loyalty Engine"],
  integrations: ["Internal Modules", "Payment Gateways", "WhatsApp/Notifications"],
  decisionMakers: ["CX", "CRM", "Community Ops", "IT"],
  keyPoints: ["Engagement", "Support efficiency", "Retention", "Brand advocacy"],
  roi: ["Higher resident engagement", "Support deflection", "Higher referrals post possession"],
  assets: [
    {
      type: "Link",
      title: "Reference Sheet",
      url: "#",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "IA and UX",
      url: "#",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Demo CMS",
      url: "#",
      id: "demo@lockated.com",
      pass: "123456",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Demo App",
      url: "App Store / Play Store",
      id: "9987676203",
      pass: "OTP",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  owner: "Kshitij Rasal",
  ownerImage: "/assets/product_owner/kshitij_rasal.jpeg",
  extendedContent: {
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Customer Post Possession" },
        { field: "Description", detail: "Post-possession community + services + advocacy layer for residents." },
        { field: "Target Market", detail: "Developers managing townships / societies post handover." },
        { field: "Key Outcome", detail: "Higher resident engagement + reduced support load + measurable advocacy." },
      ],
      problemSolves: [
        { painPoint: "Drop in engagement after handover", solution: "Events, communication, and loyalty loops built into the app." },
        { painPoint: "High service requests and manual coordination", solution: "Helpdesk + workflows + transparency to reduce noise and repeat queries." },
      ],
      whoItIsFor: [
        { role: "Community Ops", useCase: "Drive participation + reduce friction", frustration: "Low adoption", gain: "Engagement loops + campaigns" },
        { role: "Residents", useCase: "Services + events + updates", frustration: "Fragmented touchpoints", gain: "Single app for community life" },
      ],
      today: [
        { dimension: "Rollout", state: "Phased adoption from communication → services → loyalty." },
        { dimension: "Measure", state: "Engagement + ticket deflection + referral impact tracked." },
      ],
    },
    detailedUseCases: {
      industryUseCases: [
        {
          rank: "1",
          industry: "Large township / mixed-use developer",
          features: "Broadcasts, Events, Visitor Mgmt, Helpdesk SLAs, Amenity booking, Loyalty tiers",
          useCase:
            "Run post-handover community engagement + services in one app; reduce WhatsApp chaos and improve resident NPS",
          profile: "Sell to CX + Community Ops: adoption + ticket deflection + brand advocacy outcomes in 90 days",
          currentTool: "WhatsApp groups + manual registers + disparate society tools",
        },
        {
          rank: "2",
          industry: "Premium residential communities",
          features: "Amenity booking, Events, Directory, Service workflows, Campaign studio",
          useCase: "Drive participation and premium experience while reducing service coordination friction",
          profile: "Sell to brand/CX: premium experience + faster service closure + measurable engagement",
          currentTool: "Front-desk calls + spreadsheets + email / WhatsApp",
        },
        {
          rank: "3",
          industry: "Developers with outsourced facility ops",
          features: "Helpdesk routing, Vendor coordination, SLA dashboards, Resident updates",
          useCase: "Standardize service workflows across vendors and provide residents transparent status",
          profile: "Sell to ops: SLA compliance + escalation automation + reduced repeat tickets",
          currentTool: "Vendor calls + ticketing tools without resident visibility",
        },
        {
          rank: "4",
          industry: "Multi-project developer portfolio",
          features: "Segmentation, Broadcasts, Campaigns, Analytics-ready engagement tracking",
          useCase: "Operate consistent post-possession playbooks across multiple communities",
          profile: "Sell to leadership: portfolio-wide engagement benchmarks + retention/referral loops",
          currentTool: "Multiple local tools per society; no unified metrics",
        },
      ],
      internalTeamUseCases: [
        {
          team: "Community Ops",
          features: "Broadcasts, Events, Polls, Directory",
          process: "Plan weekly communication + events calendar, collect RSVPs, run polls, and track engagement",
          benefit: "Higher adoption and participation with less manual coordination",
          frequency: "Daily",
        },
        {
          team: "Support / Helpdesk",
          features: "Ticketing, SLA, Routing, Escalations",
          process: "Receive structured tickets, route to vendors/teams, update status, auto-escalate on SLA",
          benefit: "Faster closure and fewer repeat queries",
          frequency: "Daily",
        },
        {
          team: "Security",
          features: "Visitor management, Staff registry",
          process: "Verify entries, manage approvals/logs, coordinate resident notifications",
          benefit: "Better safety with auditable logs and reduced manual registers",
          frequency: "Daily",
        },
        {
          team: "Growth / Retention",
          features: "Loyalty tiers, Referral journeys, Campaign studio",
          process: "Run engagement campaigns, incentivize referrals, measure conversion and MAU impact",
          benefit: "Compounding retention + advocacy loops post possession",
          frequency: "Weekly",
        },
      ],
    },
    detailedMarketAnalysis: {
      marketMatrixSubtitle:
        "Post-possession market view: who buys, why they buy, what they use today, and how to position the post-handover app layer.",
      targetAudience: [
        {
          segment: "Township / large community (500+ homes)",
          demographics: "Residents + community ops across multiple towers; high daily engagement needs",
          industry: "Community Ops Head / CX Head",
          painPoints:
            "WhatsApp chaos • low adoption after handover • high service load • no unified engagement calendar",
          notSolved:
            "Lower NPS, more escalations, higher churn in engagement, weak advocacy/referral outcomes",
          goodEnough:
            "WhatsApp groups + manual registers + occasional events with no measurement",
        },
        {
          segment: "Premium residential (amenities-heavy)",
          demographics: "Club/amenity bookings, events, concierge-style experience expectations",
          industry: "Brand / CX + Community Ops",
          painPoints:
            "Amenity booking conflicts • poor event participation • fragmented service coordination",
          notSolved:
            "Experience degrades, complaints rise, staff time wasted in coordination and exceptions",
          goodEnough:
            "Front-desk calls + spreadsheets + static notices; no self-serve transparency",
        },
        {
          segment: "Outsourced facility ops (multiple vendors)",
          demographics: "Vendor-driven service closures; residents need visibility and SLAs",
          industry: "Facility / Community Ops + Support Manager",
          painPoints:
            "Vendor follow-ups • no SLA transparency • repeated tickets • escalation management manual",
          notSolved:
            "Support cost increases and closure times slip; residents lose trust in operations",
          goodEnough:
            "Ticketing tools without resident visibility + phone follow-ups",
        },
        {
          segment: "Multi-project developer portfolio",
          demographics: "Different local processes per society; leadership wants consistent playbooks",
          industry: "Leadership / CX Head / Ops Excellence",
          painPoints:
            "No comparable metrics across projects • hard to roll out engagement playbooks • siloed tools",
          notSolved:
            "Inconsistent experience, weak governance, limited upsell/advocacy loops post possession",
          goodEnough:
            "Local society tools per project + manual reporting to leadership",
        },
      ],
      competitorMapping: [
        {
          name: "MyGate / NoBrokerHood (Society apps)",
          targetCustomer: "RWAs / residents; some developer-adjacent use",
          pricing: "Per flat / per month; freemium + upsells",
          discovery: "Resident referrals, app stores, society committees",
          strongestFeatures: "Visitor mgmt, society ops workflows, resident engagement basics",
          weakness: "Not developer-branded; limited enterprise customization and integration governance",
          marketGaps: "Developer-branded CX + analytics + cross-project governance + post-sales linkage",
          threats: "Deepening services marketplace and operational tooling",
        },
        {
          name: "Local security/visitor tools",
          targetCustomer: "Societies focused on security",
          pricing: "Low-cost annual contracts",
          discovery: "On-ground sales to societies",
          strongestFeatures: "Simple gate workflows",
          weakness: "No engagement, no helpdesk depth, no resident journey layer",
          marketGaps: "Unified community + services + retention loops beyond gate-only tooling",
          threats: "Bundling into larger society platforms",
        },
        {
          name: "Generic ticketing (Freshdesk/Jira Service)",
          targetCustomer: "Support teams; not resident-first",
          pricing: "Per agent / per month",
          discovery: "IT procurement",
          strongestFeatures: "Ticket workflows and SLAs",
          weakness: "Poor resident UX; no community modules; low adoption for residents",
          marketGaps: "Resident-first self-serve + community adoption loops + app-based engagement",
          threats: "Better portals + WhatsApp integrations",
        },
      ],
    },
    detailedPricing: {
      pricingMatrixSubtitle:
        "Post-possession pricing view: feature depth vs market expectations + the pricing landscape across India and GCC.",
      pricingFeatureRows: [
        {
          capability: "Community engagement (broadcasts, events, polls)",
          currentState: "Core engagement modules with segmentation and scheduling.",
          marketNeed: "Societies want predictable participation and reduced WhatsApp chaos.",
          impact: "Higher adoption + better communication governance.",
          status: "AHEAD",
          recommendation: "Position as engagement + governance layer; show adoption metrics in pilot.",
        },
        {
          capability: "Helpdesk workflows + SLA",
          currentState: "Structured ticketing, routing, escalations, resident status visibility.",
          marketNeed: "Most tools solve internal ops; resident transparency is missing.",
          impact: "Deflects calls and improves closure time.",
          status: "AHEAD",
          recommendation: "Sell as support-cost reduction + SLA credibility for residents.",
        },
        {
          capability: "Visitor management",
          currentState: "Invite + approvals + logs (basic).",
          marketNeed: "Strong expectation; table stakes in society apps.",
          impact: "Safety + daily usage driver.",
          status: "AT PAR",
          recommendation: "Bundle with community + services; avoid competing on gate-only.",
        },
        {
          capability: "Amenity / club booking",
          currentState: "Bookings with rules and confirmations.",
          marketNeed: "Premium societies expect smooth booking flows.",
          impact: "High engagement and stickiness.",
          status: "AT PAR",
          recommendation: "Differentiate via branding + integrated comms + analytics.",
        },
        {
          capability: "Loyalty + advocacy loops",
          currentState: "Tier progression + referral journeys + campaigns.",
          marketNeed: "Most society apps lack growth loops for developers.",
          impact: "Retention + advocacy + referrals after possession.",
          status: "AHEAD",
          recommendation: "Pitch as developer growth engine post-handover.",
        },
        {
          capability: "Portfolio governance (multi-project)",
          currentState: "Segmentation + standardized playbooks + analytics-ready structure.",
          marketNeed: "Developers want consistent experience across societies.",
          impact: "Cross-project adoption and operational consistency.",
          status: "GAP",
          recommendation: "Ship portfolio dashboards + benchmarking to win enterprise rollouts.",
        },
      ],
      pricingSummaryRows: [
        {
          label: "WHERE WE ARE AHEAD",
          detail:
            "Resident-first helpdesk transparency + engagement governance + loyalty/advocacy loops tied to developer outcomes.",
          tone: "green",
        },
        {
          label: "WHERE WE ARE AT PAR",
          detail: "Visitor management and amenity booking are table stakes; we must bundle, not compete feature-to-feature.",
          tone: "yellow",
        },
        {
          label: "GAPS THAT WILL COST DEALS",
          detail:
            "Portfolio-level governance dashboards + deeper integration playbooks for large outsourced ops ecosystems.",
          tone: "red",
        },
      ],
      pricingCurrentRows: [
        { label: "India Pricing Model", detail: "Per home per month (tiered), with setup + optional integrations." },
        { label: "GCC Pricing Model", detail: "Per home per month, higher support and integrations; annual contracts common." },
        { label: "Bundling", detail: "Bundle community + services; add loyalty/campaigns as growth tier." },
      ],
      pricingPositioningRows: [
        {
          question: "Why buy?",
          answer: "Reduce WhatsApp chaos, improve resident NPS, and cut support load with measurable adoption.",
          note: "Lead with outcomes, not modules.",
        },
        {
          question: "Why us vs society apps?",
          answer: "Developer-branded experience + engagement governance + service workflows + advocacy loops.",
          note: "We’re not just gate management.",
        },
        {
          question: "What proof wins deals?",
          answer: "Pilot metrics: MAU, event RSVP, ticket deflection, closure time, referral conversions.",
          note: "Show 30/60/90-day plan.",
        },
      ],
      pricingImprovementRows: [
        {
          currentProp: "Society management app",
          suggestedFix: "Position as post-possession engagement + services layer for developers",
          improvedFraming: "Developer-branded community + service OS that increases NPS and deflects support",
          whyItWins: "Moves away from commodity gate tools and anchors on measurable outcomes",
        },
        {
          currentProp: "Visitor + tickets + events",
          suggestedFix: "Bundle as daily utility + governance + adoption loops",
          improvedFraming: "Daily resident utility with governance workflows and adoption measurement",
          whyItWins: "Differentiates through consistency, segmentation, and analytics-ready execution",
        },
      ],
      currentPricingMarket: [
        {
          category: "MyGate / NoBrokerHood",
          description:
            "Freemium + per-flat pricing; strong society features, weaker developer-brand control and enterprise governance.",
        },
        {
          category: "Local visitor tools",
          description:
            "Low-cost gate-only tools; limited beyond security workflows and no engagement/service depth.",
        },
        {
          category: "Generic ticketing",
          description:
            "Per-agent pricing; internal workflows strong but resident UX and adoption weak for community engagement.",
        },
      ],
    },
    detailedSWOT: {
      strengths: [
        {
          headline: "Developer-branded resident layer (not RWA-owned)",
          explanation:
            "Positions the app as a continuation of the developer experience post handover, enabling governance and consistency across communities.",
        },
        {
          headline: "Resident-first helpdesk transparency",
          explanation:
            "Ticket status + SLAs visible to residents reduces repeat follow-ups and increases trust in operations.",
        },
        {
          headline: "Engagement loops (events, polls, campaigns) in one place",
          explanation:
            "A single engagement hub improves participation and reduces fragmented communication across WhatsApp and notices.",
        },
        {
          headline: "Modular rollout (comms → services → loyalty)",
          explanation:
            "Phased adoption reduces change friction and improves time-to-value in the first 30–90 days.",
        },
        {
          headline: "Analytics-ready measurement of adoption",
          explanation:
            "MAU, RSVP rates, ticket deflection, and closure time can be used as proof points for renewal and expansion.",
        },
      ],
      weaknesses: [
        {
          headline: "Deep integrations vary by community stack",
          explanation:
            "Different society/FMS vendors create integration complexity; rollout can slow if governance isn’t clear.",
        },
        {
          headline: "Commoditized expectations for visitor management",
          explanation:
            "Gate workflows are table stakes; competing on visitor features alone can pressure pricing.",
        },
        {
          headline: "Adoption risk if daily utility is not prioritized",
          explanation:
            "If comms is the only module used, engagement can plateau; need services + bookings to lock in habits.",
        },
        {
          headline: "Operational dependency on community team execution",
          explanation:
            "Events, polls, and campaigns require consistent ops cadence; without it, engagement outcomes may underperform.",
        },
      ],
      opportunities: [
        {
          headline: "Portfolio governance for multi-project developers",
          explanation:
            "Create benchmarking dashboards across societies to win enterprise rollouts and long-term contracts.",
        },
        {
          headline: "Monetizable services marketplace (future)",
          explanation:
            "Add value-added services (home services, bookings, partner offers) to increase engagement and revenue share.",
        },
        {
          headline: "Retention and advocacy loops tied to new launches",
          explanation:
            "Use loyalty + referrals post possession to drive repeat purchase and launch conversion efficiency.",
        },
        {
          headline: "Premium experience tier for amenities-heavy communities",
          explanation:
            "Differentiate with concierge-like workflows, event programming, and branded UX for premium developers.",
        },
      ],
      threats: [
        {
          headline: "Society apps expanding into developer programs",
          explanation:
            "Platforms like MyGate/NoBrokerHood may add developer partnerships and deeper services bundling.",
        },
        {
          headline: "Gate-only tools bundling into larger suites",
          explanation:
            "Security vendors can bundle visitor + staff modules, making it harder to justify price on those features alone.",
        },
        {
          headline: "Procurement pushback on pricing vs ‘free’ apps",
          explanation:
            "Freemium society apps can anchor low price expectations; need outcome-based positioning and pilot proof.",
        },
        {
          headline: "Fragmented decision-making (RWA vs Developer vs Ops)",
          explanation:
            "If ownership of post-possession tools is unclear, deals can stall; requires stakeholder mapping early.",
        },
      ],
    },
    detailedRoadmap: {
      structuredRoadmap: [
        {
          timeframe: "IMMEDIATE (0–3 MONTHS)",
          headline: "Stop losing deals we should be winning",
          colorContext: "red",
          items: [
            {
              whatItIs: "Portfolio analytics dashboard (MAU, tickets, RSVP, NPS)",
              whyItMatters:
                "Large developers need proof of adoption + service impact across communities to justify pricing and renewal.",
              unlockedSegment: "Large township developers; multi-project portfolios",
              effort: "High (8–12 weeks)",
              owner: "Product",
              impact: "Very high",
              priority: "P0",
            },
            {
              whatItIs: "Helpdesk SLA + escalation automation",
              whyItMatters:
                "Fixes the biggest daily pain: repeat follow-ups. Makes service credible with transparent SLAs.",
              unlockedSegment: "All segments — especially outsourced ops communities",
              effort: "Medium (4–8 weeks)",
              owner: "CX/Support",
              impact: "Very high",
              priority: "P0",
            },
            {
              whatItIs: "Amenity booking rules + deposits",
              whyItMatters:
                "Premium communities expect smooth booking. Avoids conflicts and drives recurring app usage.",
              unlockedSegment: "Premium residential communities",
              effort: "Medium (4–6 weeks)",
              owner: "Product",
              impact: "High",
              priority: "P1",
            },
          ],
        },
        {
          timeframe: "SHORT-TERM (3–6 MONTHS)",
          headline: "Expand addressable market + move upmarket",
          colorContext: "yellow",
          items: [
            {
              whatItIs: "Vendor coordination workflows",
              whyItMatters:
                "Standardizes multi-vendor operations; reduces exceptions and improves closure quality.",
              unlockedSegment: "Communities with outsourced facility operations",
              effort: "Medium (6–10 weeks)",
              owner: "Ops",
              impact: "High",
              priority: "P1",
            },
            {
              whatItIs: "Campaign studio v1 (targeting + CTR tracking)",
              whyItMatters:
                "Enables measurable engagement loops: broadcasts → RSVP → participation improvements.",
              unlockedSegment: "Townships + premium communities",
              effort: "Medium (6–8 weeks)",
              owner: "Growth",
              impact: "High",
              priority: "P1",
            },
            {
              whatItIs: "Visitor + staff lite improvements",
              whyItMatters:
                "Keeps daily utility strong while we differentiate on governance + engagement.",
              unlockedSegment: "Security-led buyers",
              effort: "Low (2–4 weeks)",
              owner: "Security",
              impact: "Medium",
              priority: "P2",
            },
          ],
        },
        {
          timeframe: "MEDIUM-TERM (6–12 MONTHS)",
          headline: "Build long-term competitive moat",
          colorContext: "blue",
          items: [
            {
              whatItIs: "Cross-project benchmarking + governance",
              whyItMatters:
                "Lets leadership compare communities, replicate winning playbooks, and standardize experience.",
              unlockedSegment: "Enterprise multi-project developers",
              effort: "High (10–14 weeks)",
              owner: "Product",
              impact: "Very high",
              priority: "P0",
            },
            {
              whatItIs: "Loyalty tiers + referral journeys v2",
              whyItMatters:
                "Turns post-possession into a growth engine for new launches and repeat purchases.",
              unlockedSegment: "Developers focused on referrals and new launches",
              effort: "Medium (6–10 weeks)",
              owner: "Growth",
              impact: "High",
              priority: "P1",
            },
            {
              whatItIs: "Services marketplace (future layer)",
              whyItMatters:
                "Adds recurring value and monetization; keeps engagement high even after stabilization.",
              unlockedSegment: "Large, amenities-heavy communities",
              effort: "High (12–16 weeks)",
              owner: "BizOps",
              impact: "Medium",
              priority: "P2",
            },
          ],
        },
      ],
      enhancementRoadmap: [
        {
          featureName: "Broadcast targeting & scheduling",
          currentStatus: "Basic broadcasts; limited targeting and audit trail",
          enhancedVersion: "Segment targeting (tower/wing), scheduling, pinned posts, engagement analytics",
          integrationType: "CMS + Notifications",
          effort: "M (3–5w)",
          impact: "High",
          priority: "P0",
          owner: "Product & Ops",
        },
        {
          featureName: "Helpdesk SLA + escalations",
          currentStatus: "Tickets with basic status updates",
          enhancedVersion: "SLA timers, auto-escalations, resident-facing transparency, closure quality checks",
          integrationType: "Workflow engine",
          effort: "M (4–6w)",
          impact: "Very high",
          priority: "P0",
          owner: "CX/Support",
        },
        {
          featureName: "Vendor coordination workflows",
          currentStatus: "Manual vendor follow-ups; exceptions handled on calls",
          enhancedVersion: "Vendor assignment, checklists, escalation ladder, performance dashboards",
          integrationType: "Vendor module / API",
          effort: "M (6–8w)",
          impact: "High",
          priority: "P1",
          owner: "Ops",
        },
        {
          featureName: "Amenity booking rules & deposits",
          currentStatus: "Simple bookings; conflicts handled manually",
          enhancedVersion: "Rules, deposits, cancellation policy, conflict prevention, automated refunds",
          integrationType: "Payments + Rules",
          effort: "M (4–6w)",
          impact: "High",
          priority: "P1",
          owner: "Product",
        },
        {
          featureName: "Visitor + staff lite improvements",
          currentStatus: "Basic approvals and logs",
          enhancedVersion: "Pre-approval templates, staff passes, guard shift notes, incident flags",
          integrationType: "Security module",
          effort: "S (2–3w)",
          impact: "Medium",
          priority: "P2",
          owner: "Security",
        },
        {
          featureName: "Campaign studio v1",
          currentStatus: "Manual announcements; no campaign measurement",
          enhancedVersion: "Campaign templates, targeting, CTR tracking, RSVP funnels, adoption nudges",
          integrationType: "Analytics + CMS",
          effort: "M (6–8w)",
          impact: "High",
          priority: "P1",
          owner: "Growth",
        },
        {
          featureName: "Portfolio benchmarking dashboard",
          currentStatus: "No cross-community metrics; manual reporting",
          enhancedVersion: "Benchmarks by community, adoption leaderboards, playbook insights, alerts",
          integrationType: "Analytics + BI",
          effort: "L (10–14w)",
          impact: "Very high",
          priority: "P0",
          owner: "Product",
        },
      ],
    },
    detailedBusinessPlan: {
      planQuestions: [
        {
          question: "Q1 — What is the product and why does it exist (post possession)?",
          answer:
            "Customer Post Possession is a developer-branded resident layer that runs community engagement (broadcasts, events, polls), services (helpdesk workflows, SLAs, vendor coordination), and retention/advocacy loops (loyalty + referrals). It exists to reduce WhatsApp chaos and operational noise, improve resident NPS, and create measurable adoption after handover.",
          flag: "Ready",
        },
        {
          question: "Q2 — Who is this for and who pays?",
          answer:
            "Primary buyers: CX Head / Community Ops Head at real estate developers or township operators. Influencers: facility ops leaders, security leads, vendor managers. End users: residents + security + ops. Payment is typically developer-led (portfolio governance) or community-led in some cases; we win when developer wants consistency + measurable outcomes across communities.",
          flag: "Ready",
        },
        {
          question: "Q3 — What outcomes do we promise in 30/60/90 days?",
          answer:
            "30 days: broadcasts + events calendar live, resident onboarding > 50% of active users. 60 days: helpdesk workflows + SLA live; measurable ticket deflection begins. 90 days: sustained MAU growth, improved closure time, higher event participation; baseline NPS improvement signals and early referral activation (if enabled).",
          flag: "Ready",
        },
        {
          question: "Q4 — What’s the wedge (where do we start)?",
          answer:
            "Start with communication governance (broadcasts, announcements) + one daily utility (helpdesk or amenity booking). Then expand to vendor workflows and retention loops. The wedge is adoption-first: something residents use weekly and ops can measure.",
          flag: "Ready",
        },
        {
          question: "Q5 — What makes us different from society apps?",
          answer:
            "We are developer-branded and built for post-handover outcomes: portfolio governance, adoption measurement, and retention/advocacy loops tied to developer growth. Society apps often optimize for RWA needs and gate workflows; we win by bundling engagement + services + measurable governance.",
          flag: "Ready",
        },
        {
          question: "Q6 — What are the key modules (MVP vs phase 1)?",
          answer:
            "MVP: broadcasts, events/RSVP, helpdesk intake + status, visitor approvals (basic), onboarding. Phase 1: SLA + escalations, vendor coordination workflows, amenity booking rules, campaign studio v1, analytics dashboard, loyalty tiers + referral journeys.",
          flag: "Ready",
        },
        {
          question: "Q7 — What are the biggest risks and mitigations?",
          answer:
            "Risks: low adoption if daily utility missing; integration delays across vendor stacks; fragmented decision-making (developer vs RWA). Mitigations: phased rollout with one daily utility; integration playbooks; stakeholder mapping; pilot KPIs and weekly governance cadence.",
          flag: "Ready",
        },
        {
          question: "Q8 — How do we measure success?",
          answer:
            "North-star: MAU/WAU adoption and resident satisfaction lift. Supporting metrics: ticket deflection %, closure time, event participation rate, broadcast CTR/read rate, amenity booking utilization, referral conversions (when enabled).",
          flag: "Ready",
        },
      ],
    },
    detailedGTM: {
      targetGroups: [],
      sheet: {
        title: "POST POSSESSION — GO-TO-MARKET STRATEGY | Top 3 Target Groups",
        targetGroups: [
          {
            title: "TARGET GROUP 1 — LARGE INDIAN RESIDENTIAL DEVELOPERS (Top 50)",
            sections: [
              {
                title: "COMPONENT 1 — SALES MOTION",
                columns: ["Component", "Detail"],
                rows: [
                  [
                    "ICP Definition",
                    "Large township / multi-project developers with 500+ homes per community and high post-handover service load.\nDecision makers: CX Head, Community Ops Head, IT.\nSuccess KPI: MAU, ticket deflection, closure time, NPS lift.",
                  ],
                  [
                    "Lead Sources",
                    "Existing relationships (sales/CX), partner intros, enterprise referrals.\nTarget: 10–15 qualified accounts/month.",
                  ],
                  [
                    "Data Points / Proof",
                    "Pilot metrics: onboarding %, MAU/WAU, broadcast CTR, RSVP participation, ticket deflection %, closure time improvement.\nCase-style narrative: before vs after.",
                  ],
                  [
                    "First Meeting Agenda",
                    "1) Map current comms + service stack\n2) Identify 1 daily utility + 1 engagement loop\n3) Agree pilot KPIs + governance cadence\n4) Confirm integration constraints",
                  ],
                  [
                    "Demo Flow",
                    "Resident journey: onboarding → broadcasts → events RSVP → helpdesk ticket → status/SLA.\nOps journey: segmentation → campaign → vendor routing → dashboard metrics.",
                  ],
                  [
                    "Objection Handling",
                    "“We already have a society app” → we’re developer-branded + portfolio governance.\n“Pricing” → outcome-based: support cost deflection + NPS lift.\n“Integration” → phased rollout + playbooks.",
                  ],
                  [
                    "Deal Velocity Target",
                    "Pilot: 2–4 weeks to start.\nConversion: 60–90 days based on KPI proof.\nRollout: portfolio expansion post success.",
                  ],
                  [
                    "Win Condition",
                    "Signed pilot with clear KPI dashboard + expansion plan to 2–3 communities if outcomes met.",
                  ],
                ],
              },
              {
                title: "COMPONENT 2 — MARKETING CHANNELS",
                columns: ["Channel", "Tactic", "Expected Output", "Budget / Timeline"],
                rows: [
                  ["ICP / Content", "Playbook content: post-handover adoption + SLA transparency", "2–3 inbound leads/week", "Low | 4–6 weeks"],
                  ["LinkedIn", "CX/Community Ops targeted posts + case snippets", "10–20 warm conversations/month", "Low | Ongoing"],
                  ["Events", "Invite-only roundtables for CX + ops leaders", "5–8 qualified meetings/event", "Medium | Monthly"],
                  ["Partnerships", "FMS / security / payment partners", "Co-sell pipeline", "Medium | 6–10 weeks"],
                  ["PR / Media", "Outcome-led stories: support deflection + NPS lift", "Trust + top-funnel", "Medium | Quarterly"],
                ],
              },
              {
                title: "COMPONENT 3 — 10-DAY LAUNCH SEQUENCE",
                columns: ["Week", "Sales Activities", "Marketing Activities", "Product Milestones", "Success Metrics"],
                rows: [
                  ["W1", "Account mapping + stakeholder outreach", "Publish playbook + 2 ICP posts", "Demo environment ready", "5 discovery calls"],
                  ["W2–3", "Discovery → pilot scope", "Roundtable invites + partner intros", "Pilot KPIs defined", "2 pilots signed"],
                  ["W4–6", "Pilot reviews + expansion plan", "Publish mini case study", "Dashboard v1 live", "KPI uplift visible"],
                  ["W7–12", "Portfolio rollout pitching", "Co-sell with partners", "Governance + benchmarking", "Expansion to 2–3 sites"],
                ],
              },
              {
                title: "COMPONENT 4 — PARTNERSHIP STRATEGY (FY26)",
                columns: ["Partner Type", "What they bring", "What we offer", "Activation Approach", "Revenue Share"],
                rows: [
                  ["FMS / Facility Ops", "Enterprise access + ops trust", "Resident layer + adoption analytics", "Joint pilots, co-sell", "10–15%"],
                  ["Security vendors", "Visitor mgmt footprint", "Engagement + helpdesk + governance", "Bundle + upsell motion", "5–10%"],
                  ["Payment partners", "Billing + receipts integration", "Amenity booking + transparency", "Integration + referrals", "5–10%"],
                  ["CRM / CX consultants", "Discovery + positioning", "Implementation playbooks", "Referral agreements", "10–20%"],
                ],
              },
            ],
            summary:
              "Lead with adoption + governance outcomes. Start with broadcasts + one daily utility (helpdesk/booking), prove metrics, then expand to portfolio governance and retention loops.",
            keyAssumptions:
              "1) Developer wants brand control post handover\n2) Pilot can be launched with minimal integrations\n3) KPI dashboard is available in 30–60 days",
          },
        ],
      },
    },
    detailedMetrics: {
      clientImpact: [],
      businessTargets: [],
      sheet: {
        title: "POST POSSESSION — METRICS | Client impact + Product launch tracking",
        sections: [
          {
            title: "SECTION 1 — CLIENT IMPACT METRICS (POST GO-LIVE TRACKING)",
            tone: "blue",
            columns: [
              "#",
              "Metric",
              "Traditional baseline",
              "Target (without phase 1)",
              "Target (with phase 1)",
              "How the impact is caused",
              "Example / landing page / proof",
            ],
            rows: [
              [
                "1",
                "Resident lead conversion (post handover)",
                "Manual follow-ups; low engagement",
                "5–10% activation",
                "15–25% activation",
                "Broadcasts + events + daily utility (helpdesk/booking) drives habits and adoption",
                "Onboarding funnel + MAU dashboard screenshot",
              ],
              [
                "2",
                "Resident helpdesk response time (TAT)",
                "Calls/WhatsApp; no SLA visibility",
                "24–48 hours avg",
                "8–24 hours avg",
                "Structured tickets + routing + SLA + escalations reduces repeat follow-ups",
                "SLA timer + escalation audit trail",
              ],
              [
                "3",
                "Ticket deflection (repeat queries reduced)",
                "High repeat queries; manual updates",
                "10–15% reduction",
                "25–40% reduction",
                "Resident status transparency + proactive updates prevents calls",
                "Before/after call volume trend",
              ],
              [
                "4",
                "Event participation rate",
                "Low turnout; manual coordination",
                "5–8% RSVP",
                "12–20% RSVP",
                "Calendar + RSVP + reminders + campaigns increases participation",
                "RSVP funnel metrics",
              ],
              [
                "5",
                "Broadcast engagement (read/CTR)",
                "WhatsApp unread; no analytics",
                "10–15% CTR",
                "20–35% CTR",
                "Targeting + scheduling + pinned posts + analytics improves relevance",
                "Campaign report snapshot",
              ],
            ],
          },
          {
            title: "SECTION 2 — PRODUCT LAUNCH TRACKING",
            tone: "blue",
            columns: ["Timeline", "Target (without phase 1)", "Target (with phase 1)", "Why the difference"],
            rows: [
              ["30-day post-launch targets", "", "", ""],
              ["Onboarding completion", "40–55%", "60–75%", "Better onboarding + daily utility modules increase habit formation"],
              ["MAU (resident)", "20–30% of homes", "35–50% of homes", "Broadcasts + events + helpdesk create weekly usage"],
              ["Avg ticket closure time", "24–48 hrs", "8–24 hrs", "SLA routing + escalations reduce delays"],
              ["Event RSVP rate", "5–8%", "12–20%", "Reminders + campaigns improve participation"],
              ["3-month post-launch targets", "", "", ""],
              ["Sustained MAU", "30–40%", "50–65%", "Campaign studio + governance playbooks sustain engagement"],
              ["Ticket deflection", "10–15%", "25–40%", "Status transparency + proactive comms reduce repeats"],
              ["NPS lift signal", "+2 to +4", "+5 to +8", "Better closure + engagement improves sentiment"],
              ["Referral activation (if enabled)", "1–2%", "3–6%", "Loyalty tiers + referral journeys accelerate advocacy"],
            ],
          },
        ],
      },
    },
    detailedFeatures: [
      {
        module: "Community",
        feature: "Broadcasts & Announcements",
        subFeatures: "Segment broadcasts, scheduling, pin important updates",
        works: "Community ops can publish targeted updates by tower/wing/interest groups with engagement tracking",
        userType: "Community Ops / Resident",
        usp: true,
      },
      {
        module: "Community",
        feature: "Events & RSVP",
        subFeatures: "Event discovery, RSVP, reminders, attendance",
        works: "Residents RSVP in-app, get reminders, and organizers see participation metrics",
        userType: "Resident / Community Ops",
        usp: false,
      },
      {
        module: "Community",
        feature: "Resident Directory",
        subFeatures: "Opt-in directory, role tags, search",
        works: "Helps residents connect and reduces admin dependency while respecting privacy controls",
        userType: "Resident",
        usp: false,
      },
      {
        module: "Community",
        feature: "Polls & Feedback",
        subFeatures: "Surveys, quick polls, sentiment",
        works: "Collects feedback with segmentation and produces action-ready insights for ops teams",
        userType: "Resident / Community Ops",
        usp: true,
      },
      {
        module: "Services",
        feature: "Helpdesk / Ticketing",
        subFeatures: "Ticket intake, attachments, SLA, status",
        works: "Structured service requests with visibility reduces repeat queries and improves closure time",
        userType: "Resident / Support",
        usp: false,
      },
      {
        module: "Services",
        feature: "Service Categories & Workflows",
        subFeatures: "Templates, routing, escalation rules",
        works: "Configurable workflows route tickets to right teams/vendors and auto-escalate on SLA breaches",
        userType: "Support / Community Ops",
        usp: true,
      },
      {
        module: "Security",
        feature: "Visitor Management",
        subFeatures: "Invite guests, approvals, logs",
        works: "Residents approve visitors; security gets a real-time list and audit trail",
        userType: "Resident / Security",
        usp: false,
      },
      {
        module: "Security",
        feature: "Staff Management (Lite)",
        subFeatures: "Staff registry, entry permissions, duty notes",
        works: "Provides a basic staff directory and access controls to reduce manual registers",
        userType: "Security / Community Ops",
        usp: false,
      },
      {
        module: "Amenities",
        feature: "Club / Amenity Booking",
        subFeatures: "Slot booking, rules, deposits",
        works: "Residents book amenities with configurable rules and confirmations to reduce conflicts",
        userType: "Resident / Community Ops",
        usp: true,
      },
      {
        module: "Payments",
        feature: "Bills & Receipts",
        subFeatures: "Invoices, receipts, statement view",
        works: "Central view of society charges and payment receipts (where integrated) for transparency",
        userType: "Resident",
        usp: false,
      },
      {
        module: "Retention & Advocacy",
        feature: "Loyalty Tiers",
        subFeatures: "Tier progression, points, rewards",
        works: "Engagement actions (events participation, referrals) drive points and tier benefits",
        userType: "Resident / Growth",
        usp: true,
      },
      {
        module: "Retention & Advocacy",
        feature: "Referral Journeys",
        subFeatures: "Share referrals, status, rewards",
        works: "Tracks referral intent → conversion with transparent status and reward outcomes",
        userType: "Resident / Growth",
        usp: true,
      },
      {
        module: "Retention & Advocacy",
        feature: "Campaign Studio",
        subFeatures: "Create campaigns, targeting, CTR tracking",
        works: "Ops teams run engagement campaigns and measure adoption improvements over time",
        userType: "Community Ops / Growth",
        usp: false,
      },
    ],
    detailedPostPossession: {
      title: "Post Possession - Full Table",
      sections: [
        {
          title: "Section A — Engagement & Community (Green)",
          tone: "green",
          columns: ["Module", "What it is", "How it works", "Why it matters"],
          rows: [
            ["Community Broadcasts", "Targeted announcements", "Segment residents by tower/wing; schedule posts", "Drives adoption and reduces confusion"],
            ["Events & RSVP", "Event discovery + RSVP", "In-app RSVP, reminders, attendee insights", "Increases participation and retention"],
          ],
        },
        {
          title: "Section B — Services & Helpdesk (Red)",
          tone: "red",
          columns: ["Module", "Current state", "Enhanced workflow", "Impact"],
          rows: [
            ["Helpdesk", "Calls/WhatsApp tickets", "Structured ticket intake + SLA + status tracking", "Support deflection + faster closure"],
            ["Visitor Management", "Manual registers", "Digital approvals + logs + security view", "Safety + better resident experience"],
          ],
        },
        {
          title: "Section C — Retention & Advocacy (Blue)",
          tone: "blue",
          columns: ["Module", "Mechanic", "KPIs", "Owner"],
          rows: [
            ["Loyalty Tiers", "Tier progression + rewards", "MAU, referrals, retention", "Growth"],
            ["Campaign Studio", "Self-serve campaigns", "CTR, conversion, engagement", "Community Ops"],
          ],
        },
      ],
    },
  },
};

const CustomerPostPossessionPage: React.FC = () => {
  return <BaseProductPage productData={customerPostPossessionData} tabsVariant="snag360" />;
};

export default CustomerPostPossessionPage;

