import React from "react";
import BaseProductPage from "./BaseProductPage";
import PostSalesSummaryTab from "./PostSalesSummaryTab";
import PostSalesFeaturesTab from "./PostSalesFeaturesTab";
import PostSalesUseCasesTab from "./PostSalesUseCasesTab";
import PostSalesMarketAnalysisTab from "./PostSalesMarketAnalysisTab";
import PostSalesPricingTab from "./PostSalesPricingTab";
import PostSalesSWOTTab from "./PostSalesSWOTTab";
import PostSalesRoadmapTab from "./PostSalesRoadmapTab";
import PostSalesEnhancementsTab from "./PostSalesEnhancementsTab";
import PostSalesMetricsTab from "./PostSalesMetricsTab";
import PostSalesBusinessPlanTab from "./PostSalesBusinessPlanTab";
import PostSalesGTMTab from "./PostSalesGTMTab";
import { ProductData } from "./types";
import { Globe, Smartphone, FileText, Monitor } from "lucide-react";

export const postSalesData: ProductData = {
  name: "Post Sales",
  description:
    "The referral and loyalty infrastructure for real estate developers, turning satisfied homebuyers into brand advocates and reducing cost of sales by up to 75%.",
  brief:
    "Post Sales is an enterprise SaaS platform for real estate developers that transforms the homebuyer relationship from a transactional cost to a recurring revenue channel through AI-driven loyalty, structured referrals, and home loan commission tracking.",

  // Tab configuration
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
  ],

  // Basic Info for Header
  industries: "Real Estate Developers (India & GCC)",
  usps: [
    "Referral is the North Star: Every feature is designed to end in a referral.",
    "Home Loan Commission Revenue: Direct P&L line for the developer.",
    "Full Lifecycle Coverage: From Booking to Possession, not just post-handover.",
    "Revenue Story, Not a Cost Story: Pays for itself via commissions and broker savings.",
  ],
  includes: ["White Labeled Mobile App", "Developer Campaign Studio", "CRM Integration Hub"],
  upSelling: ["AI Referral Propensity Engine", "GCC Market Expansion Pack", "Home Loan Commission Module"],
  integrations: ["Salesforce / SAP / Oracle CRM", "Payment Gateways (India/GCC)", "WhatsApp Business API"],
  decisionMakers: ["VP Sales", "Head of Loyalty", "CFO", "MD"],
  keyPoints: ["Referral Velocity", "Home Loan Revenue", "Buyer Trust", "Operational Efficiency"],
  roi: ["ROI payback in Year 1", "75% Reduction in broker commission cost", "Net-new Home Loan revenue"],

  // Assets & Credentials
  assets: [
    {
      type: "Link",
      title: "Product Deck",
      url: "#",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "API Documentation",
      url: "#",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Staging CMS",
      url: "https://staging.lockated.com",
      id: "admin@postsales.com",
      pass: "Referral2024!",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Mobile App Demo",
      url: "App Store / Play Store",
      id: "9876543210",
      pass: "OTP",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ],
  extendedContent: {
    productSummaryNew: {
      summarySubtitle: "Briefing for investors, partners & senior stakeholders | Read time: under 5 minutes | India primary · Global secondary",
      perspectives: [
        {
          title: "Product Briefing",
          identity: [
            { field: "Product Name", detail: "Post Sales" },
            { field: "One-Line Description", detail: "The referral and loyalty infrastructure for real estate developers, turning satisfied homebuyers into brand advocates and reducing cost of sales by up to 75%." },
            { field: "Category", detail: "PropTech · Homebuyer Loyalty & Referral Platform · Revenue Generation for Real Estate Developers" },
            { field: "Core Mission", detail: "Transform real estate from a transactional business into a relationship-driven one. Make your customers your brand advocates. Reduce your cost of sales by 75% through referrals." },
            { field: "Geography", detail: "India (primary) · Global NRI markets (opportunity)" }
          ],
          whoItIsFor: [
            { role: "Primary Buyer (Pays)", useCase: "Real estate developers in India, specifically the VP Sales, Head of Loyalty, and Head of Home Loans who are measured on referral booking rate, cost of sales %, and home loan commission revenue." },
            { role: "Primary Teams Inside Developer", useCase: "1. Loyalty & CX Team (runs the referral and rewards program) | 2. Home Loans Team (earns commission from in-app home loan referrals) | 3. Sales Team (benefits from referral bookings that replace broker-sourced leads) | 4. Marketing Team (runs engagement and referral bonus campaigns via the Campaign Studio)" },
            { role: "End User (Uses the App)", useCase: "Homebuyers who have booked a residential unit, from booking confirmation through registration, construction, and possession. Their delight is the mechanism through which the developer generates referrals." },
            { role: "Secondary Opportunity", useCase: "Banks & NBFCs (home loan revenue share partners) · PropTech platforms (white-label API licensing) · GCC developers with NRI buyer bases (highest-value referral network in real estate)" }
          ],
          problemSolves: [
            { painPoint: "Core Problem (Commercial)", solution: "Indian real estate developers spend 3–7% of every unit's value on broker commissions to generate new sales. After the booking is signed, the buyer is largely forgotten—no structured relationship, no referral system, no loyalty program. The developer's single most valuable sales asset (a satisfied homebuyer) is sitting idle, unengaged, and un-monetized." },
            { painPoint: "Pain Point 1: High Cost of Sales", solution: "Broker and channel partner commissions represent ₹3–7Cr per ₹100Cr project in outbound sales cost. Every new launch requires the developer to activate the broker network again—expensive, unpredictable, and not compounding. Referrals from existing buyers cost 95% less per booking." },
            { painPoint: "Pain Point 2: No Loyalty Infrastructure", solution: "Developers have no structured digital tool to reward, engage, and retain homebuyers post-booking. The absence of a loyalty program means no repeat purchase incentive for investors, no NPS-building engagement during construction, and no referral activation at possession—the highest-delight moment in the buyer journey." },
            { painPoint: "Pain Point 3: Home Loan Revenue Left on the Table", solution: "Developers informally refer buyers to banks and earn nothing structured in return. Banks pay ₹8,000–30,000+ per disbursed home loan to structured referral partners. A developer with 1,000 active buyers at 60% home loan uptake is leaving ₹50L–1.8Cr/year in commission revenue uncaptured, every year." },
            { painPoint: "What Happens Without It", solution: "Developers stay trapped in a high-cost, broker-dependent, transactional sales model. Each new launch costs the same amount in commissions. No referral flywheel. No loyalty equity. No home loan revenue. And a satisfied buyer who could have referred 2 friends, said nothing to anyone." }
          ],
          today: [
            { dimension: "Stage", state: "Live. Native iOS and Android app deployed. Full feature set active across all modules." },
            { dimension: "Core Capability Live", state: "Loyalty & Referral Engine (gamified tiers, wallet, points, referral hub) · Home Loan Enquiry & Commission Tracking · Full buyer lifecycle management (booking → possession) · Developer Analytics Dashboard · Campaign Studio for loyalty team · Push notification automation · Multi-language support" },
            { dimension: "Key Integrations", state: "Salesforce CRM (real-time sync) · Payment gateway (in-app property payments) · Bank/NBFC home loan partner APIs · WhatsApp Share API for referral distribution" },
            { dimension: "Revenue Model", state: "1. Developer SaaS license (annual, per-buyer-volume bands) | 2. Home loan commission revenue share (bank/NBFC partnerships) | 3. Services marketplace GMV commission (post-possession) | 4. Premium analytics & campaign studio tier (add-on SKU)" }
          ]
        },
        {
          title: "Referral Economics",
          identity: [
            { field: "The Fundamental Insight", detail: "Industry data shows: top Indian developers already get 30–40% of bookings from repeat and referral buyers. Yet most have no structured digital system to amplify this. Post Sales is the infrastructure that takes an existing organic behavior and turns it into a predictable, measurable, compounding revenue channel." },
            { field: "Cost of Sales Math (1,000-buyer developer)", detail: "Current model: 4% broker commission on ₹1Cr avg unit. 100 new bookings → ₹4Cr in broker cost.\nPost Sales model: 8% referral share rate on 1,000 buyers = 80 referral submissions → 15 referral bookings (20% conversion) → 15 bookings at ₹0 broker cost.\nResult: 15% of bookings from referrals → ₹60L in broker commission saved → Post Sales platform pays for itself 3× over." },
            { field: "Home Loan Revenue Math", detail: "1,000 buyers × 60% home loan uptake × ₹15,000 avg commission = ₹90L/year in structured home loan commission for developer's Home Loans team. This is a net-new revenue line that did not exist before Post Sales." }
          ]
        },
        {
          title: "Feature Summary",
          summaryFeatureModules: [
            { label: "Referral & Loyalty Engine", detail: "Gamified referral hub with tier-based rewards (Silver/Gold/Platinum), wallet & points system, shareable referral cards for WhatsApp/Instagram, AI referral propensity engine, real-time reward tracking, leaderboard." },
            { label: "Home Loan Commission Module", detail: "In-app home loan enquiry, bank partner matching, application status tracking, commission dashboard for developer's Home Loans team, monthly revenue reconciliation." },
            { label: "Developer Campaign Studio", detail: "Self-serve campaign management for developer's loyalty team: buyer segmentation, referral bonus campaigns, tier-upgrade communications, A/B testing, real-time performance dashboard." },
            { label: "Developer Analytics Dashboard", detail: "Real-time referral pipeline, loyalty tier distribution, home loan funnel conversion, NPS trend, payment adherence, with AI-generated weekly digest." },
            { label: "Customer Journey & Dashboard", detail: "Lifecycle engine: booking → registration → possession milestones with guided next actions, progress tracking, and referral prompts at each completion milestone." },
            { label: "Legal Workflow Digitization", detail: "NCF management, stamp duty UTR upload, sales deed digital acceptance, franking status tracking, registration scheduling, fully in-app." },
            { label: "Financial Management", detail: "Payment schedule, demand letters, account statement, receipts, cost sheet, EMI calculator, online payment gateway, complete financial transparency." },
            { label: "Document Repository", detail: "Centralized vault for all legal and financial documents, accessible 24/7, version-controlled, with digital acceptance audit trail." },
            { label: "Construction Progress", detail: "Developer-published milestone updates with images and videos; buyer community reaction layer; triggers loyalty points for engagement." },
            { label: "Support & Case Management", detail: "CRM-integrated case management (Salesforce sync), CSAT capture, RM call and video, buyer-initiated, tracked, measurable." },
            { label: "Services Marketplace", detail: "Post-possession curated marketplace: interior, home loan, moving, smart home. AI-curated by possession timeline. GMV commission revenue." },
            { label: "Discovery & Engagement", detail: "Property listings, map view, virtual walkthroughs, drone preview, events calendar, news feed, brand partner showcase, personalized notifications." }
          ]
        },
        {
          title: "Key USPs",
          summaryUsps: [
            { label: "USP 1: Referral is the North Star", detail: "Every feature is designed to end in a referral. Journey milestones trigger referral prompts. Loyalty points motivate engagement that leads to sharing. Construction updates create shareable moments. The chatbot surfaces referral opportunities proactively. No other platform in Indian real estate is built around referral velocity as the primary output." },
            { label: "USP 2: Home Loan Commission Revenue", detail: "Post Sales is the only homebuyer platform with a structured home loan commission tracking and disbursement module, creating a direct, measurable P&L line for the developer's Home Loans team. Banks and NBFCs pay ₹8,000–30,000+ per disbursed loan. At scale, this revenue alone covers the platform cost." },
            { label: "USP 3: Developer's Loyalty Team Gets a Real Tool", detail: "The self-serve Campaign Studio lets the developer's loyalty team run referral bonus campaigns, tier-upgrade communications, and engagement activations in minutes, without depending on the vendor. Team adoption creates platform stickiness that drives renewal certainty." },
            { label: "USP 4: Full Lifecycle Coverage, Not Just Loyalty", detail: "Competitors like Reloy focus on loyalty and referrals post-possession. Post Sales covers the entire journey from booking through registration, construction, and possession, with referral and loyalty integrated at every milestone. The relationship starts from Day 1 of booking, not Day 1 of possession." },
            { label: "USP 5: Revenue Story, Not a Cost Story", detail: "Post Sales sells as a revenue generator, not a cost-reduction tool. The pitch: 'This platform will pay for itself in Year 1 from home loan commissions. Everything after is referral savings and broker cost reduction.' The developer's CFO approves it, not just the CX Head." }
          ]
        }
      ]
    },
    detailedFeatures: [
      { module: "1. Onboarding & Access", feature: "Login (OTP Authentication)", works: "Secure login via mobile or email OTP with CRM validation to identify and authenticate existing customers.", usp: false },
      { module: "1. Onboarding & Access", feature: "User Registration (CRM-Based Access)", works: "New users register with basic details; access is granted post CRM validation and developer-issued invite.", usp: false },
      { module: "1. Onboarding & Access", feature: "App Onboarding Tutorial", works: "Step-by-step in-app walkthrough for first-time users covering key features and navigation flows.", usp: false },
      { module: "2. Customer Journey & Account", feature: "Customer Journey Dashboard (My Account)", works: "Centralized lifecycle dashboard guiding users from booking to possession with task lists, milestone statuses, and recommended next steps.", usp: true },
      { module: "2. Customer Journey & Account", feature: "Project Selection (Multi-Project View)", works: "Allows users with multiple bookings to switch between projects seamlessly within a single account.", usp: false },
      { module: "3. Booking to Registration", feature: "Booking Details Management", works: "View unit details, booking summary, key dates, and complete transaction history in one place.", usp: false },
      { module: "3. Booking to Registration", feature: "NCF (Name Confirmation Form) Management", works: "Review, accept, or raise discrepancies in customer details recorded before agreement finalization.", usp: false },
      { module: "3. Booking to Registration", feature: "Stamp Duty Payment & UTR Upload", works: "Upload proof of stamp duty payment and track verification and acknowledgement status in real time.", usp: false },
      { module: "3. Booking to Registration", feature: "Sales Deed Digital Acceptance", works: "Secure, paperless review and acceptance of legal sale agreements entirely within the app, no physical signing required.", usp: true },
      { module: "3. Booking to Registration", feature: "Franking Status Tracking", works: "Monitor document validation and stamp duty completion status with timestamped updates.", usp: false },
      { module: "3. Booking to Registration", feature: "Registration Scheduling & Rescheduling", works: "Book, view, and manage appointment slots for property sub-registrar visits directly in-app.", usp: false },
      { module: "3. Booking to Registration", feature: "Registration Workflow Management", works: "End-to-end digitization of the legal registration journey including NCF, stamp duty, sales deed, and appointment management.", usp: true },
      { module: "4. Registration to Possession", feature: "Payment Schedule & Status Tracking", works: "View full payment schedule with due dates, amounts, and status (paid / pending / overdue) in a clear timeline.", usp: false },
      { module: "4. Registration to Possession", feature: "Online Payments", works: "Make secure property payments directly in-app via integrated payment gateway, no redirection to external portals.", usp: false },
      { module: "4. Registration to Possession", feature: "Construction Progress Updates", works: "Access real-time construction updates with images, videos, and progress reports for complete build-stage transparency.", usp: true },
      { module: "4. Registration to Possession", feature: "Unit Details (My Home / My Unit)", works: "Comprehensive view of the purchased unit including layout, specifications, floor, facing, and booking history.", usp: false },
      { module: "4. Registration to Possession", feature: "Handover & Possession Scheduling", works: "Schedule and manage the final possession appointment with developer coordination and pre-possession checklist support.", usp: true },
      { module: "5. Financial Management", feature: "Account Statement", works: "Detailed ledger of all financial transactions, credit notes, and adjustments related to the property purchase.", usp: false },
      { module: "5. Financial Management", feature: "Payment Receipts Management", works: "Download and access official payment receipts for all completed transactions at any time.", usp: false },
      { module: "5. Financial Management", feature: "Demand Letters Management", works: "View official payment demand letters issued by the developer with due dates and outstanding amounts.", usp: false },
      { module: "5. Financial Management", feature: "Cost Sheet Access", works: "Transparent breakdown of total property pricing, charges, taxes, and add-ons in a structured cost sheet.", usp: false },
      { module: "5. Financial Management", feature: "EMI Calculator", works: "Estimate home loan EMIs based on loan amount, tenure, and interest rate, supports financial planning pre-disbursement.", usp: false },
      { module: "5. Financial Management", feature: "TDS Knowledge Support", works: "Educational resources and guidance on TDS applicability and deduction processes in Indian real estate transactions.", usp: false },
      { module: "6. Document & Legal Mgmt", feature: "Centralized Document Repository", works: "Single, secure vault for all legal and financial documents (agreements, certificates, letters), accessible 24/7 from the app.", usp: true },
      { module: "6. Document & Legal Mgmt", feature: "Agreement for Sale Access", works: "View and download the registered or draft sale agreement at any stage of the transaction.", usp: false },
      { module: "6. Document & Legal Mgmt", feature: "Allotment Letter Management", works: "Access and manage the official unit allotment letter issued by the developer post-booking.", usp: false },
      { module: "6. Document & Legal Mgmt", feature: "Welcome Letter", works: "Formal onboarding communication delivered digitally post-purchase confirmation.", usp: false },
      { module: "6. Document & Legal Mgmt", feature: "Architect Certificates Access", works: "View compliance, occupancy, and structural certification documents issued by registered architects.", usp: false },
      { module: "7. Profile & Compliance", feature: "Profile Management", works: "Update and manage personal information, contact details, and communication preferences.", usp: false },
      { module: "7. Profile & Compliance", feature: "Applicant & Co-Applicant Management", works: "Maintain and update details of all buyers and co-buyers involved in the property transaction.", usp: false },
      { module: "7. Profile & Compliance", feature: "KYC Verification Workflow", works: "Structured digital KYC update process with document upload, RM validation, and audit trail, fully case-managed.", usp: true },
      { module: "8. Support & CRM Integration", feature: "Case Management System", works: "Raise, track, and resolve support issues with real-time CRM (Salesforce) synchronization and RM-assigned workflows.", usp: true },
      { module: "8. Support & CRM Integration", feature: "Case Resolution Feedback (CSAT)", works: "Post-resolution satisfaction survey to capture customer feedback and measure support quality.", usp: false },
      { module: "8. Support & CRM Integration", feature: "Relationship Manager (RM) Calling", works: "One-tap access to directly call the assigned Relationship Manager for personalized assistance.", usp: false },
      { module: "8. Support & CRM Integration", feature: "Video Call with RM", works: "Scheduled or on-demand video call with RM for walkthroughs, document guidance, and query resolution.", usp: false },
      { module: "8. Support & CRM Integration", feature: "Chatbot Integration", works: "AI-powered conversational assistant for 24/7 query resolution, document retrieval, and status updates.", usp: true },
      { module: "9. Activities", feature: "My Activities Dashboard", works: "Consolidated view of all ongoing and completed activities across enquiries, site visits, favorites, and referrals.", usp: false },
      { module: "9. Activities", feature: "Enquiries Tracking", works: "Track status and responses to all pre-sales and post-sales enquiries submitted through the platform.", usp: false },
      { module: "9. Activities", feature: "Favorites Management", works: "Save and manage shortlisted properties or units of interest for easy reference.", usp: false },
      { module: "9. Activities", feature: "Site Visit Scheduling", works: "Book and manage on-site property visits with developer-coordinated slot management.", usp: false },
      { module: "9. Activities", feature: "Referral Tracking", works: "Track referral submissions, reward status, and conversion outcomes through the loyalty-linked referral system.", usp: false },
      { module: "10. Discovery", feature: "Property Listings & Exploration", works: "Browse available units and projects with filters for location, size, budget, and configuration.", usp: false },
      { module: "10. Discovery", feature: "Interactive Map View", works: "Explore projects and nearby amenities on an interactive geo-map for location-based decision-making.", usp: false },
      { module: "10. Discovery", feature: "Virtual Walkthroughs", works: "360-degree immersive virtual tours of units and common areas to evaluate the property remotely.", usp: false },
      { module: "10. Discovery", feature: "Drone-Based Property Preview", works: "Aerial drone footage providing an overview of the project site, surroundings, and infrastructure connectivity.", usp: false },
      { module: "10. Discovery", feature: "Layouts & Floor Plans", works: "Detailed floor plan views with unit dimensions, room configurations, and layout variants.", usp: false },
      { module: "10. Discovery", feature: "Gallery & Video Content", works: "Curated image gallery and promotional video content for each project and unit type.", usp: false },
      { module: "10. Discovery", feature: "Featured Projects", works: "Highlighted developer projects with priority positioning for high-demand or newly launched properties.", usp: false },
      { module: "10. Discovery", feature: "Upcoming Launches", works: "Pre-launch information and registration of interest for upcoming projects.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Marketing Collaterals Access", works: "In-app access to brochures, fact sheets, and sales kits for informed decision-making.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Dynamic Marketing Banners", works: "Personalized and campaign-driven banners surfaced within the app based on user profile and lifecycle stage.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Launch Roadblock Screens", works: "Full-screen promotional screens at launch events or campaign moments to drive immediate engagement.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Events & Updates", works: "In-app calendar and notifications for developer events, project milestones, and community announcements.", usp: false },
      { module: "11. Marketing & Engagement", feature: "News Feed", works: "Real estate news, market trends, and developer updates curated for the user's portfolio and interests.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Customer Testimonials", works: "Verified homebuyer reviews and success stories displayed to build social proof for prospective buyers.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Press Releases", works: "Official developer press announcements and media coverage accessible from within the app.", usp: false },
      { module: "11. Marketing & Engagement", feature: "Brand Partner Showcase", works: "Featured listings of strategic brand partners including banks, interior firms, and lifestyle service providers.", usp: false },
      { module: "12. Value-Added Services", feature: "Home Loan Enquiry", works: "Submit home loan interest enquiries linked to preferred banking partners, with in-app status tracking.", usp: false },
      { module: "12. Value-Added Services", feature: "Support Services Marketplace", works: "Integrated marketplace for post-possession services: interiors, movers, smart home, maintenance, and more.", usp: true },
      { module: "13. Loyalty & Rewards", feature: "Wallet & Points System", works: "Earn and redeem in-app points for referrals, on-time payments, and engagement activities, linked to partner benefits.", usp: true },
      { module: "13. Loyalty & Rewards", feature: "Loyalty Program Integration", works: "Structured loyalty tier system rewarding long-term engagement, repeat purchases, and referral-driven acquisitions.", usp: true },
      { module: "14. Knowledge Hub", feature: "FAQs", works: "Categorized frequently asked questions covering legal, financial, registration, and possession topics.", usp: false },
      { module: "14. Knowledge Hub", feature: "Contact / Lead Submission", works: "In-app contact form and lead capture for queries, callbacks, and escalations not covered by standard support.", usp: false },
      { module: "14. Knowledge Hub", feature: "Legal Information (T&C, Privacy Policy)", works: "Easy access to platform terms of service, privacy policy, and applicable legal disclosures.", usp: false },
      { module: "15. Personalization", feature: "Personalized Greetings", works: "Context-aware welcome and milestone messages (booking anniversary, possession countdown) for a premium user feel.", usp: false },
      { module: "15. Personalization", feature: "Notifications & Preferences", works: "Granular notification controls for payment reminders, construction updates, document alerts, and RM messages.", usp: false },
      { module: "15. Personalization", feature: "Theme Customization", works: "User-selectable app themes and display preferences for a personalized visual experience.", usp: false }
    ],
    marketAnalysis: {
      overview: "The real estate market is pivoting from broker-led acquisition to advocate-led community growth. Post Sales addresses the unmet demand for a standardized, revenue-positive buyer lifecycle platform.",
      segments: [
        {
          name: "Enterprise Residential Developers",
          target: "VP Sales, Head of CRM, CX Leaders",
          pain: "High broker cost dependence (3-7% commission), manual referral tracking via WhatsApp.",
          solution: "Standardized Referral & Loyalty OS sitting on top of their existing CRM.",
          statusQuo: "WhatsApp groups, RM calls, isolated referral bonus announcements."
        },
        {
          name: "Luxury Residential Developers",
          target: "MD/CEO, Branding Head, VIP RM",
          pain: "Luxury buyers demand high-touch post-sales; referral is the only credible lead source.",
          solution: "Exclusive branded loyalty tiers with white-glove service requests.",
          statusQuo: "VIP Relationship Managers doing informal manual outreach."
        }
      ],
      competitors: [
        {
          name: "Reloy (Loyalie)",
          strengths: "Early mover, established referrals narrative, strong VC backing.",
          weaknesses: "No home loan commission module, limited analytics.",
          pitch: "Post Sales owns the whole journey from Booking to Handover; Reloy is mostly post-possession.",
          threat: "High"
        },
        {
          name: "NoBrokerHood / MyGate",
          strengths: "Dominant post-possession footprint.",
          weaknesses: "No pre-possession ownership, no loyalty-revenue engine.",
          pitch: "Post Sales starts relationship Day 1 of booking; MyGate starts after move-in.",
          threat: "Medium"
        }
      ]
    },
    marketAnalysis1A: [
      {
        profile: "Real Estate Developer ,India\n500-5,000 active homebuyers\nMid-to-large residential developers\nMumbai, Pune, Bengaluru, Hyderabad, NCR\nAnnual sales budget: ₹10-100Cr",
        painPoints: "1. Cost of sales is 3-7% of revenue ,largely broker and channel partner commissions ,with no structured, measurable alternative. Every new launch resets the outbound spend.\n2. No digital referral or loyalty infrastructure. Satisfied buyers refer informally, but the developer has no tool to track, reward, amplify, or time these referrals systematically.\n3. Home loan commissions are uncaptured. Developers refer buyers to banks informally and receive no structured revenue share, leaving ₹50L-2Cr/year per developer on the table.",
        impact: "Broker cost remains fixed or increases as competition for channel partner attention grows. Referral potential compounds negatively ,buyers never activated become detractors over time. Home loan commission revenue opportunity disappears as bank DSA networks disintermediate the developer entirely.",
        statusQuo: "WhatsApp groups for buyer communication + Salesforce CRM for backend tracking + Excel for referral tracking + phone calls for home loan referrals. 'It works well enough' until they run a quantitative cost-of-sales analysis.",
        opportunity: "Platform ACV ₹20-50L/year. Home loan commission rev-share ₹10-30L/year. Referral-sourced bookings reducing broker cost ₹50L-5Cr/year. Developer ROI positive in Month 3.",
        urgency: "HIGH ,RERA market maturation + increasing broker commission costs + luxury segment growth creating urgency for structured referral infrastructure."
      },
      {
        profile: "Luxury Developer ,India\n₹2Cr+ average unit value\n200-2,000 active buyers\nMumbai, Bengaluru, Delhi NCR, Hyderabad\nNRI buyer base significant (20-40% of sales)",
        painPoints: "1. NRI referral network is the most valuable sales asset ,untapped. NRI buyers have concentrated networks of similar-income individuals across UK, US, UAE, Singapore. No digital tool to activate this network systematically.\n2. Loyalty program is either absent or a WhatsApp group. High-net-worth buyers expect a brand experience ,not a generic rewards app. The gap between their expectation and reality damages brand equity.\n3. Broker commissions at ₹2Cr+ unit values are enormous (2-5% = ₹4L-10L per booking). 10 referral bookings replacing 10 broker bookings = ₹40L-1Cr in commission saved.",
        impact: "Luxury brand perception erodes if post-purchase experience is generic. NRI buyers who feel under-engaged refer competitors to their networks ,turning the developer's most valuable marketing asset into a competitor advantage.",
        statusQuo: "Dedicated concierge RM team for VIP buyers + WhatsApp groups for NRI investors + periodic events without a structured loyalty framework.",
        opportunity: "Platform ACV ₹30-60L/year. NRI referral bookings ₹10-50Cr in revenue with ₹0 broker cost per referral. Home loan NRI module: ₹20,000-50,000 commission per GCC bank NRI loan disbursal.",
        urgency: "HIGH ,NRI buyer segment growing + luxury market expanding + brand differentiation pressure increasing."
      },
      {
        profile: "Real Estate Developer ,GCC\n200-2,000 active buyers (NRI + GCC locals)\nDubai primary, Abu Dhabi, Riyadh secondary\nFreehold residential projects ≥ AED 1M/unit\nNRI buyers (South Asian) = 40-60% of base",
        painPoints: "1. RERA-Dubai mandates structured buyer communication and SPA milestone documentation. Non-compliance risk is real (penalties up to AED 1M per project) ,but manual compliance management is error-prone.\n2. NRI referral network (UK, US, Canada, India diaspora in GCC) is globally the highest-value referral source for Indian and UAE property. No platform systematically activates this network.\n3. Multilingual buyer experience (Arabic + English) is expected by premium buyers. Most developer portals are English-only with Arabic as an afterthought.",
        impact: "RERA penalties, buyer disputes over documentation gaps, and NRI referrals going to competitors who offer a better buyer experience. Once an NRI buyer recommends a competitor to their network, the developer has lost not one but five to ten potential buyers.",
        statusQuo: "Bilingual WhatsApp group + PDF milestones emailed to buyers + RM phone calls for NRI communication + informal bank referrals to Mashreq or Emirates NBD.",
        opportunity: "Platform ACV AED 250K-700K/year (₹55-155L). NRI referral bookings at AED 1M+ unit values: AED 500K-5M+ in referral-sourced sales per 90-day campaign. GCC bank home loan commission: AED 2,000-8,000 per disbursal.",
        urgency: "HIGH ,RERA compliance pressure + premium NRI buyer expectations + greenfield market (no dominant loyalty-referral platform in UAE real estate)."
      }
    ],
    marketAnalysis1B: [
      {
        profile: "Mid-Market Indian Developer\n500-2,000 active buyers/year\nAll India metros\nAnnual CX budget: ₹30-80L\n2-5 active projects",
        pain1: "Broker commission: 2-4% of unit value. On ₹600Cr annual sales, that's ₹12-2.4Cr/year going to brokers. No structured referral alternative. Channel partner activation cost for every new launch.",
        pain2: "Buyer communication is WhatsApp groups managed by RMs. No loyalty program. No structured engagement between booking and possession. Buyers who should be advocates are becoming detractors by possession day.",
        pain3: "Home loan enquiries handled by RM via phone. No structured bank partnership. No commission tracking. ₹30-60L/year in home loan commissions informally lost.",
        statusQuo: "Salesforce CRM for backend + WhatsApp for buyer communication + Excel for referral tracking. 'Works fine' until a quantitative cost-of-sales review is done.",
        price: "₹20-35L/year for a platform that demonstrably reduces cost of sales and adds home loan revenue. ROI case must be clear in the first 90 days."
      },
      {
        profile: "Luxury Indian Developer\n₹2Cr+ unit value, 200-1,000 active buyers\nMumbai, Bengaluru, Hyderabad\nAnnual CX budget: ₹50-1.5Cr\nNRI buyer base 20-40%",
        pain1: "Broker commissions at ₹2Cr+ units = ₹4L-10L per booking. 50 broker bookings/year = ₹2-5Cr in commissions. 10 referral bookings replacing 10 broker bookings = instant ₹40L-1Cr cost saving.",
        pain2: "No premium loyalty program that matches the brand. VIP buyers receive the same generic treatment as standard buyers. NPS among high-value buyers is lower than it should be ,these are the buyers whose networks are worth the most.",
        pain3: "NRI buyers refer to bank DSAs outside the developer's ecosystem. Developer receives zero revenue share. At ₹20,000+ commission per NRI loan disbursal, this is a significant lost revenue stream.",
        statusQuo: "Dedicated RM team + WhatsApp VIP groups + periodic site visits. RERA compliance managed manually. 'Good enough' until a RERA audit or a buyer dispute exposes the documentation gaps.",
        price: "₹30-60L/year. Will pay more for a white-label, brand-matched loyalty program that makes VIP buyers feel exclusive ,not like they're using the same app as everyone else."
      },
      {
        profile: "GCC Freehold Developer\n200-1,000 active buyers (NRI + local)\nDubai primary, Abu Dhabi secondary\nAED CX budget: 500K-2M/year",
        pain1: "Broker commissions: 2-4% AED on off-plan properties. AED 1M unit with 4% commission = AED 40,000/booking. 50 bookings/year = AED 2M in broker cost. 10 referral bookings from NRI network = AED 400K saved.",
        pain2: "No Arabic native loyalty program. Multilingual buyer base (Arabic, English, Hindi) expects a culturally appropriate digital experience. Generic English-only apps create a perceived quality gap in the premium GCC market.",
        pain3: "GCC bank home loan partnerships (Mashreq, Emirates NBD, FAB) pay AED 2,000-8,000 per disbursal to structured referral partners. No developer in GCC has a structured in-app home loan referral workflow yet.",
        statusQuo: "Bilingual WhatsApp + PDF reports + RM calls + periodic site visits. RERA compliance managed manually. 'Good enough' until a RERA audit or a buyer dispute exposes the documentation gaps.",
        price: "AED 250K-500K/year (₹55-110L). Value framing: RERA compliance + NRI referral activation + home loan commission revenue. Will pay significantly more if UAE data residency and Arabic interface are production-ready."
      }
    ],
    marketAnalysisSection2: [
      {
        name: "Reloy (formerly Loyalie)\n★ Primary Direct Competitor\n📍 Mumbai, India",
        target: "Mid-to-large Indian residential developers - Lodha, Godrej, Piramal, Mahindra, K Raheja, Shapoorji as named clients - 14 cities - India primary",
        pricing: "Annual SaaS license per developer. Not publicly disclosed. Estimated ₹15-40L/year based on buyer base size and features. Performance-linked plot structures available.",
        discovery: "Developer Industry events (CREDAI, PropTech India) - Founder-led direct sales - Word-of-mouth from Piramal reference clients - PropTech media coverage",
        strengths: "• Established referral sales track record (6% → 15% referral rate for one client in 10 months)\n• ConnectRE (buyer loyalty) + WinnRE (channel partner) dual-product covers both sides of sales ecosystem\n• ₹28.5Cr revenue (FY25), targeting ₹45-50Cr FY26\n• HDFC Capital-backed (credibility signal)",
        weaknesses: "• No home loan commission module or structured bank partnership revenue\n• No full lifecycle coverage (primarily post-possession; does not own booking → registration journey)\n• No developer campaign studio for loyalty team self-serve",
        gap: "Post Sales covers the full buyer lifecycle from booking Day 1 ,not just post-possession. We add home loan commission revenue as a direct P&L line. Our AI propensity engine makes referrals proactive, not passive. We are the first platform to give the loyalty team a self-serve campaign studio.",
        innovations: "Reloy's dual-product strategy (buyer + channel partner) could evolve into a full sales CRM replacement threat if they add booking-to-possession lifecycle coverage. Their HDFC Capital backing gives them capital to build fast.",
        risk: "They are the benchmark. Enterprise developers will compare us to Reloy directly. Our pricing must be defensible against their existing pricing, and our differentiation on home loan revenue + full lifecycle must be concretely demonstrated.",
        threat: "HIGH ,Primary incumbent to displace. Know their pitch. Know their case studies. Know every gap."
      },
      {
        name: "NoBrokerHood / MyGate\n📍 India (post-possession community apps)",
        target: "Housing societies and gated community residents - RWAs (Resident Welfare Associations) - India urban metros - Post-possession only",
        pricing: "Free for residents. Freemium/paid for society management features. Developer API integrations as paid add-ons. No developer SaaS pricing.",
        discovery: "App store organic - Housing society committee referrals - Word-of-mouth in gated communities",
        strengths: "• Dominant post-possession community engagement: visitor management, maintenance payments, community board\n• Large installed base (500,000+ societies claimed)\n• Brand recognition among residents",
        weaknesses: "• No pre-possession coverage (booking → construction → possession is a gap they don't own)\n• No loyalty + referral engine for developers\n• No home loan module\n• Developer relationship is transactional/API-level ,not a developer revenue story\n• No developer campaign studio",
        gap: "Post Sales owns the pre-possession journey that NoBrokerHood ignores. By the time possession happens, our buyers are already loyal advocates who have referred friends. We extend into post-possession with the community layer ,NoBrokerHood encroaching backward is our primary medium-term threat to defend against.",
        innovations: "NoBrokerHood could add a developer-facing loyalty + referral module and push backward into pre-possession. Well-funded (NoBroker raised $500M+). This is the most likely copycat threat in 12–24 months.",
        risk: "They own the post-possession mindshare. Developers who already use NoBrokerHood for society management may resist adding another post-possession app.",
        threat: "MEDIUM ,Not competing now, but a credible future threat if they move pre-possession."
      },
      {
        name: "Salesforce CRM\n(+ WhatsApp + Email)\n🌏 Global (used by Indian developers as status quo)",
        target: "Enterprise real estate developers with existing Salesforce licenses - CRM-managed post-sales workflows - India and GCC mid-to-large developers",
        pricing: "Salesforce: ₹3,500-12,000/user/month + implementation ₹10-50L+ - Total cost of Salesforce + WhatsApp + Excel + manual workflows: ₹20-60L/year equivalent",
        discovery: "Already embedded in developer IT infrastructure - Not a 'competitor' in the traditional sense ,it is the incumbent status quo we are displacing",
        strengths: "• Deep CRM functionality\n• Executive familiarity and existing licences\n• Integration with finance and ERP systems",
        weaknesses: "• No buyer-facing mobile app\n• No referral or loyalty program\n• No home loan commission tracking\n• No gamification or engagement layer\n• Developer teams operate it; buyers are completely excluded from the experience\n• WhatsApp + Excel layer is unscalable and unmeasurable",
        gap: "The displacement pitch: 'You already pay for Salesforce. Post Sales sits on top of it ,we connect your buyers to your CRM data and add a referral and loyalty layer that Salesforce can never provide.' Integration, not replacement.",
        innovations: "Salesforce adding a homebuyer-facing module through a PropTech ISV partner is possible. Their App Exchange ecosystem could theoretically produce a competing product.",
        risk: "IT Head objection: 'We already have Salesforce ,why do we need another platform?' Counter: Post Sales adds buyer-facing capability (loyalty + referral + home loans) that Salesforce will never build. It is additive, not duplicative.",
        threat: "LOW-MEDIUM ,Not a direct competitor but the conversation anchor for every enterprise IT objection."
      },
      {
        name: "BuilderSoft / PropSoft\n(India Real Estate ERP)",
        target: "Indian residential developers managing inventory, payments, and sales - Small-to-mid developers (50-500 buyers/year) - One-time license model",
        pricing: "One-time license ₹5-25L + AMC ₹1-5L/year. SaaS pricing not standard. No per-buyer-volume pricing.",
        discovery: "Real estate developer conferences (CREDAI, NAREDCO) - Builder community referrals - Regional sales teams",
        strengths: "• Deep ERP functionality (inventory, payment tracking, construction cost management)\n• Long-standing developer relationships in smaller developer market",
        weaknesses: "• No buyer-facing app or mobile experience\n• No loyalty, referral, or advocacy features\n• No home loan commission module\n• Backend-only ,buyers are completely invisible to this product\n• Technology stack is dated",
        gap: "Small developer market (50-500 buyers) is an addressable expansion target for Post Sales once mid-market case studies are established. BuilderSoft's ERP-only positioning creates a complete gap in buyer experience, loyalty, and referral ,the exact value Post Sales delivers.",
        innovations: "Unlikely to evolve rapidly. Technology and capital constraints limit their ability to build a modern buyer-facing product.",
        risk: "They compete only in the small developer segment. Risk is low unless they partner with a consumer-facing app builder.",
        threat: "LOW ,Not a direct competitive threat. Potential adjacent displacement opportunity in Tier-2 developer market."
      },
      {
        name: "Bayut / Property Finder\n(GCC Real Estate Portals)\n📍 UAE, Saudi Arabia, Qatar",
        target: "Property buyers and sellers in GCC markets - Real estate agencies and developers for lead generation - Dubai primary",
        pricing: "Lead generation model (pay-per-lead or subscription). No post-sales product revenue. Developer listings as primary product.",
        discovery: "Google search dominance for UAE property keywords - Social media (Instagram, LinkedIn) - Developer-agency relationships",
        strengths: "• Dominant buyer discovery platforms in GCC\n• Arabic-first user experience\n• Deep developer and agency relationships\n• Bayut: backed by Emerging Markets Property Group (OLX parent)",
        weaknesses: "• No post-sales homebuyer experience ,listing ends at enquiry\n• No loyalty or referral program for developers\n• No home loan commission module\n• Post-purchase buyer engagement is completely absent",
        gap: "GCC portal market is entirely pre-purchase. There is no post-purchase loyalty + referral platform in UAE real estate ,Post Sales is the first. Bayut and Property Finder could become white-label API partners for our developer tools.",
        innovations: "Bayut could add a post-sales module to their developer dashboard. Given their developer relationships and Arabic-native UX, they would be a credible white-label platform competitor if they moved into this space.",
        risk: "GCC entry price must be competitive vs. manual/informal status quo. AED 200-350K/year is the target pilot range ,below the cost of a dedicated post-sales RM team.",
        threat: "MEDIUM (GCC) ,Not a current competitor but a potential threat if they add post-purchase features. Also a potential partner."
      }
    ],
    pricing: {
      features: [
        { feature: "White-Label Brand App", starter: true, pro: true, enterprise: true },
        { feature: "Referral Hub v1", starter: true, pro: true, enterprise: true },
        { feature: "Campaign Studio", starter: false, pro: true, enterprise: true },
        { feature: "Home Loan Commission Engine", starter: false, pro: true, enterprise: true },
        { feature: "AI Referral Propensity Scoring", starter: false, colSpan: 2, custom: "Enterprise Only" }
      ],
      pricingTiers: [
        {
          tier: "Starter",
          price: "₹1,25,000 /mo",
          description: "For mid-size developers focusing on core referral automation.",
          unitLimit: "Up to 1,000 Units",
          implementation: "4 Weeks"
        },
        {
          tier: "Professional",
          price: "₹3,50,000 /mo",
          description: "Our most popular tier including Home Loan & Campaign modules.",
          unitLimit: "Up to 5,000 Units",
          implementation: "6-8 Weeks",
          popular: true
        },
        {
          tier: "Enterprise",
          price: "Custom",
          description: "Full suite for large developers with multiple projects.",
          unitLimit: "Unlimited",
          implementation: "12 Weeks+"
        }
      ]
    }
  },
  owner: "Kshitij Rasal",
  ownerImage: "/assets/product_owner/kshitij_rasal.jpeg",
};

const CustomerAppPage: React.FC = () => {
  return (
    <BaseProductPage
      productData={postSalesData}
      customTabContent={{
        summary: <PostSalesSummaryTab productData={postSalesData} />,
        features: <PostSalesFeaturesTab productData={postSalesData} />,
        usecases: <PostSalesUseCasesTab />,
        market: <PostSalesMarketAnalysisTab productData={postSalesData} />,
        pricing: <PostSalesPricingTab />,
        swot: <PostSalesSWOTTab />,
        roadmap: <PostSalesRoadmapTab />,
        enhancements: <PostSalesEnhancementsTab />,
        metrics: <PostSalesMetricsTab />,
        business: <PostSalesBusinessPlanTab />,
        gtm: <PostSalesGTMTab />,
      }}
    />
  );
};

export default CustomerAppPage;