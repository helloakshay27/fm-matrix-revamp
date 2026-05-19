// Lease Management - Product Data
// Complete data for all 12 tabs

import type {
  ProductIdentity,
  PainPoint,
  TargetUser,
  CurrentState,
  Feature,
  TargetAudience,
  FeatureComparison,
  UseCase,
  RoadmapPhase,
  BusinessPlanQuestion,
  GTMTargetGroup,
  ClientMetric,
  SWOTAnalysis,
  Enhancement,
  Asset,
  Credential,
  ProductMetadata,
  PricingTier,
  CompetitiveSummaryItem,
  StandardPricingModel,
  TypicalPriceRange,
  CompetitorFeaturePlan,
  RecommendedPricingLessee,
  PositioningItem,
  ValueProposition,
  LessorFeatureComparison,
  LessorCompetitiveSummaryItem,
  LessorPricingModel,
  RecommendedPricingLessor,
  LessorPositioning,
  LessorValueProposition,
  CompanyPainPoint,
  MarketCompetitor,
  LessorTargetAudience,
  LessorCompetitor,
  LesseeTeamUseCase,
  LessorIndustryUseCase,
  LessorTeamUseCase,
  ProductLaunchMetric,
  LessorClientMetric,
  LessorLaunchTrackingRow,
} from "./types";

// ==================== PRODUCT METADATA ====================
export const productMetadata: ProductMetadata = {
  name: "Lease Management",
  version: "2.0",
  owner: "Lockated / GoPhygital.work",
  industries: "Commercial Real Estate",
  description:
    "An end-to-end B2B SaaS platform that centralises lease administration, rent financials, compliance tracking, AMC, utilities, and maintenance operations for multi-location real estate portfolios - with all client data stored exclusively on the client's own servers.",
};

// ==================== TAB 1: PRODUCT SUMMARY ====================

export const productIdentityLessee: ProductIdentity[] = [
  {
    field: "Product Name",
    detail: "Lease Management (part of Lockated / GoPhygital.work)",
  },
  {
    field: "One-Line Description",
    detail:
      "An end-to-end B2B SaaS platform that centralises lease administration, rent financials, compliance tracking, AMC, utilities, and maintenance operations for multi-location real estate portfolios - with all client data stored exclusively on the client's own servers.",
  },
  {
    field: "Category",
    detail:
      "Lease Management and Property Operations SaaS - Commercial Real Estate (India primary)",
  },
  {
    field: "Core Mission",
    detail:
      "To give corporate real estate teams, retail chains, and property management firms a single platform that replaces spreadsheets and fragmented tools with structured, auditable, and compliant lease and property operations - without surrendering their data to a third-party SaaS cloud.",
  },
  {
    field: "Geography",
    detail: "India - Primary, Global - Secondary",
  },
];

export const productIdentityLessor: ProductIdentity[] = [
  {
    field: "Product Name",
    detail: "Lease Management (part of Lockated / GoPhygital.work)",
  },
  {
    field: "One-Line Description",
    detail:
      "An end-to-end B2B SaaS platform that centralises lease portfolio administration, rental income tracking, tenant management, compliance monitoring, and property operations for real estate owners, developers, and property management firms — with all client data stored exclusively on the client's own servers.",
  },
  {
    field: "Category",
    detail:
      "Lease Management and Property Operations SaaS — Commercial Real Estate (India primary)",
  },
  {
    field: "Core Mission",
    detail:
      "To give property owners, real estate developers, and property management firms a single platform that replaces spreadsheets and fragmented tools with structured, auditable, and compliant lease portfolio and rental income operations — without surrendering their data to a third-party SaaS cloud.",
  },
  {
    field: "Geography",
    detail: "India — Primary, Global — Secondary",
  },
];

export const painPointsLessee: PainPoint[] = [
  {
    painPoint: "Core pain point",
    solution:
      "Large organisations managing 50 to 500+ leased properties across multiple cities operate entirely on Excel, email threads, and disconnected ERP modules. They miss rent escalation deadlines, pay incorrect CAM charges, fail compliance audits, and have no real-time visibility into their total lease liability. A Head of Real Estate at a retail chain with 200 stores cannot answer within minutes what their aggregate annual rent outgo is, when the next 30 leases expire, or which properties are non-compliant - this is the core operational failure.",
  },
  {
    painPoint: "The data sovereignty gap",
    solution:
      "Every major global lease management platform - Yardi, MRI, Nakisa, Visual Lease, Tango - stores client data on their own cloud infrastructure. For large Indian enterprises, government-adjacent organisations, and companies under data residency obligations, this creates unacceptable legal and security risk. Lockated's Lease Management stores all data on the client's own servers, making it the only enterprise lease platform in India with true data sovereignty.",
  },
  {
    painPoint: "The switching cost trap",
    solution:
      "Most organisations that recognise the problem remain trapped in spreadsheets because switching to global platforms like Yardi or MRI requires 6 to 12 months of implementation, Rs 25 lakh to Rs 2 crore in professional services, and full data migration to a foreign cloud. Lockated eliminates this trap by providing India-first onboarding, INR pricing, local support, and a deployment model that installs on infrastructure the client already owns.",
  },
];

export const painPointsLessor: PainPoint[] = [
  {
    painPoint: "Core pain point",
    solution:
      "Property owners and property management companies managing 50 to 500+ leased-out properties across multiple cities have no real-time visibility into occupancy rates, total rental income, overdue tenant rents, or upcoming vacancies. A Head of Asset Management at a commercial real estate firm cannot answer in minutes what their total rental income is this quarter, which tenants have overdue payments, or how many properties face imminent vacancy — this is the core operational failure.",
  },
  {
    painPoint: "The data sovereignty gap",
    solution:
      "Every major global property and lease management platform — Yardi, MRI, Nakisa, Visual Lease, Tango — stores client data on their own cloud infrastructure. For Indian real estate developers, government-adjacent property companies, and family offices managing large portfolios, this creates unacceptable legal and security risk. Lockated stores all data on the client's own servers, making it the only enterprise lease platform in India with true data sovereignty for lessors.",
  },
  {
    painPoint: "The switching cost trap",
    solution:
      "Most property owners and management firms that recognise the problem remain on Excel and basic billing software because switching to global platforms requires 6 to 12 months of implementation and full data migration to a foreign cloud. Lockated eliminates this trap with India-first onboarding, INR pricing, local support, and on-premise deployment on infrastructure the client already owns.",
  },
];

export const targetUsersLessee: TargetUser[] = [
  {
    role: "Head of Real Estate / VP Corporate Real Estate",
    useCase:
      "Managing lease agreements across 50-500+ properties, overseeing renewals, rent payments, compliance, and vendor contracts from a single command centre.",
    frustration:
      "Operates across 4 to 6 Excel files, 3 email chains, and a generic ERP. Has no live view of expiring leases, pending compliances, or rent overdue. Renewal negotiations happen reactively, costing 15-25% more than proactive management.",
    benefit:
      "Full portfolio visibility on one dashboard, automated renewal pipeline with proposed vs current rent comparison, compliance alerts 90 days in advance, and a complete audit trail for every lease event.",
  },
  {
    role: "CFO / Finance Director",
    useCase:
      "Tracking total lease liability, rent expense forecasting, security deposit reconciliation, OPEX budgeting by property, and invoice management for all leased assets.",
    frustration:
      "Cannot close monthly accounts without chasing 5 different teams for rent paid, OPEX actuals, and utility invoices. Security deposits are tracked in a separate register with no system link to lease agreements. Audit readiness is always a scramble.",
    benefit:
      "Real-time rent collection dashboard, automated invoice generation, deposit tracking linked to leases, budget vs actual OPEX by property, and one-click export for auditors.",
  },
  {
    role: "Operations Manager / Facility Manager",
    useCase:
      "Logging maintenance requests, managing AMC vendors, tracking utility consumption, and ensuring properties are operationally compliant.",
    frustration:
      "Maintenance tickets raised over WhatsApp with no formal tracking. AMC renewals missed because no system flags them. Utility bills reconciled manually against meter readings every quarter. Vendor performance is anecdotal.",
    benefit:
      "Structured maintenance ticketing with priority and vendor assignment, AMC renewal alerts with vendor performance scores, automated utility consumption tracking with efficiency metrics, and full service history per property.",
  },
];

export const targetUsersLessor: TargetUser[] = [
  {
    role: "Head of Asset Management / VP Real Estate",
    useCase:
      "Managing lease-out agreements across 50–500+ owned properties, monitoring rental income vs target, overseeing tenant renewals, tracking vacancy rates, and coordinating maintenance and compliance across the portfolio.",
    frustration:
      "No centralised view of all active leases, vacant properties, upcoming renewals, or overdue tenant rents. Renewal negotiations are reactive and lack data. Vacancy loss is not measured.",
    benefit:
      "Full portfolio visibility with occupancy rate, rental income dashboard, expiring lease pipeline with renewal status, and complete audit trail for every lease event.",
  },
  {
    role: "CFO / Finance Director (Property Company)",
    useCase:
      "Tracking total rental income, receivables aging from tenants, security deposit liabilities, OPEX by property, and monthly P&L by asset or portfolio.",
    frustration:
      "Cannot close monthly accounts without manually chasing rent collection status from property managers. Security deposits received are tracked in separate registers. Outstanding receivables from tenants have no live view.",
    benefit:
      "Real-time rent receivables dashboard, automated invoice dispatch to tenants, security deposit tracking linked to lease agreements, income vs OPEX by property, and one-click export for auditors.",
  },
  {
    role: "Property Manager / Operations Head",
    useCase:
      "Handling day-to-day operations: resolving tenant maintenance requests, managing AMC vendors, processing utility billing to tenants, and ensuring compliance filings for each property.",
    frustration:
      "Tenant maintenance requests arrive via WhatsApp with no formal SLA tracking. AMC renewals are missed because no system flags them. Utility billing to tenants is done manually each month.",
    benefit:
      "Structured maintenance ticketing with tenant portal, AMC contract management with vendor SLA tracking, automated utility meter reading to tenant billing, compliance calendar with renewal alerts, and full service history per property.",
  },
];

export const featureSummary: string = `Lease Management by Lockated is a 16-module operational platform. The core modules are: Dashboard and Analytics (portfolio overview, KPI cards, lease expiry distribution, security deposit analytics, regional performance insights, and critical alerts), Lease and Rental Agreement Management (creation, repository, lifecycle tracking, terms configuration including CAM and escalation, document upload, and complete audit logs), Lease Lifecycle and Renewal Management (expiry tracking, renewal pipeline across Expiring/Negotiation/Renewed stages, proposed vs current rent comparison, and auto-renewal configuration), and Tenant and Landlord Management (directories, contact actions, relationship overview, and status tracking).

Financial modules cover Rent Collection and Financial Tracking (payment status across Paid/Pending/Partial/Overdue, late fee configuration, payment recording, and reminder triggers), Security Deposit Management (deposit tracking and analysis by property), OPEX and Expense Management (budget planning, expense categorisation, and property-wise cost analysis), Utilities Management (electricity, water, gas and internet consumption tracking, billing management, and efficiency metrics), and Invoicing and Payments (invoice generation, tracking, and outstanding monitoring).

Operations modules cover Compliance Management (repository for Fire NOC, CC, OC and other approvals with renewal alerts and ownership assignment), Property and Asset Management (property master database, building and unit management, area metrics, takeover conditions, and amenities), AMC Management (contract management, vendor linking, service scheduling, renewal tracking, and vendor performance metrics), Maintenance Management (ticketing, categorisation, priority, vendor allocation, and status tracking), and Masters and Configuration Engine (hierarchical location mapping from Country to Circle, role-based access control, custom fields, branding configuration, and auto-population).`;

export const currentStateLessee: CurrentState[] = [
  {
    dimension: "Product status",
    state:
      "Live product with all 16 modules built and deployable. Currently in active deployment or pilot with select enterprise clients in India. Architecture supports on-premise and private cloud deployment for data sovereignty.",
  },
  {
    dimension: "What is missing right now",
    state:
      "Deep ERP bi-directional integrations (SAP, Oracle, Tally) are not yet native. Mobile app for field teams is in development. ASC 842 and IFRS 16 accounting journal automation for listed companies is not yet included.",
  },
  {
    dimension: "Competitive moat today",
    state:
      "Data sovereignty architecture (client-server deployment), India-first onboarding, end-to-end operations coverage (lease + OPEX + utilities + AMC + maintenance) in a single platform, INR pricing, and local support - none of which global competitors offer together.",
  },
  {
    dimension: "Key markets",
    state:
      "India primary: commercial real estate occupiers, retail chains (100+ stores), corporate enterprises (large campuses), property management firms. Global secondary: South-East Asia, Middle East markets where data sovereignty and India-linked operations are requirements.",
  },
  {
    dimension: "Revenue model",
    state:
      "Annual SaaS subscription priced per property or per user per month. Enterprise contracts with implementation fees. Potential revenue streams: onboarding and data migration services, premium compliance module, API access for ERP integrations.",
  },
];

export const investorCase: string = `India commercial real estate is a USD 340 billion market growing at 9.7% CAGR. Less than 8% of Indian enterprises managing 50+ leases use a dedicated lease management platform today - the rest operate on spreadsheets. Lockated is the only player in India combining data sovereignty, end-to-end operations, and India-first pricing. The replacement cycle for spreadsheet-dependent enterprises is now being triggered by GST audit requirements, IND AS 116 lease accounting standards, and CFO mandates for real-time visibility. Lockated is positioned as the default India enterprise choice before global players like Yardi or MRI complete their India market entry with competitive local pricing.`;

// LESSOR PERSPECTIVE DATA

export const featureSummaryLessor: string = `Lease Management by Lockated is a 16-module operational platform for property owners and management firms. The core modules are: Dashboard and Analytics (portfolio occupancy rate, total rental income, tenant payment status, expiring leases, maintenance SLA compliance, and regional asset performance), Lease and Rental Agreement Management (creation of outgoing lease agreements, lease repository, lifecycle tracking, rent escalation and CAM terms, document upload, and audit logs), Lease Lifecycle and Renewal Management (expiry tracking, renewal pipeline across Expiring/Negotiation/Renewed stages, market rent comparison to evaluate renewal pricing, and auto-renewal configuration), and Tenant Management (tenant directory, contact management, lease linkage, and communication logs).

Financial modules cover Rent Collection and Receivables Tracking (payment status per tenant across Received/Pending/Overdue/Partial, late fee enforcement, automated reminder dispatch, and receivables aging reports), Security Deposit Management (deposit amounts received, tracking by property, refund obligation scheduling on lease exit), OPEX and Expense Management (property-level cost tracking, NOI calculation, budget vs actual by asset), Utilities Management (billing generation for tenants based on meter readings, utility consumption tracking per unit, and billing dispute resolution), and Invoicing and Payments (invoice generation to tenants, outstanding monitoring, and payment reconciliation).

Operations modules cover Compliance Management (Fire NOC, CC, OC, and other property approval renewals with calendar alerts), Property and Asset Management (property master database with unit-level configuration, area metrics, building details, and amenity records), AMC Management (service contract management, vendor linking, scheduled service tracking, and vendor performance scoring), Maintenance Management (tenant-raised ticket management, SLA enforcement, vendor allocation, and resolution tracking), and Masters and Configuration Engine (hierarchical property mapping, role-based access for property management teams, custom fields, and auto-population).`;

export const currentStateLessor: CurrentState[] = [
  {
    dimension: "Product status",
    state:
      "Live product with all 16 modules built and deployable for property management use cases. Currently in active deployment or pilot with select property management and real estate firms in India. Architecture supports on-premise and private cloud deployment for data sovereignty.",
  },
  {
    dimension: "What is missing right now",
    state:
      "Deep ERP integrations for property accounting (Tally, SAP, Oracle) are not yet native. Tenant self-service portal (web and mobile) for maintenance requests and rent payment confirmation is in development. Lessor-side IND AS 17 / IFRS 16 accounting journal automation is not yet included.",
  },
  {
    dimension: "Competitive moat today",
    state:
      "Data sovereignty architecture (client-server deployment), India-first onboarding with INR pricing, end-to-end coverage (lease portfolio + rental income + OPEX + AMC + maintenance + compliance) in one platform, local support — none of which global competitors offer together for the Indian lessor market.",
  },
  {
    dimension: "Key markets",
    state:
      "India primary: commercial real estate developers and owners, retail property landlords, industrial and warehouse park operators, property management companies. Global secondary: South-East Asia and Middle East property management firms with India-linked operations.",
  },
  {
    dimension: "Revenue model",
    state:
      "Annual SaaS subscription priced per property or per unit per month. Enterprise contracts with implementation fees. Additional revenue streams: tenant portal add-on, premium compliance module, ERP integration API access.",
  },
];

export const investorCaseLessor: string = `India commercial real estate is a USD 340 billion market with over 600 million square feet of leased commercial space. Less than 10% of Indian property management companies and landlords with 50+ leased properties use a dedicated platform — the rest operate on Excel and basic billing software. Lockated is the only player combining data sovereignty, end-to-end property operations, and India-first pricing for the lessor segment.`;

// ==================== TAB 2: FEATURES ====================

export const features: Feature[] = [
  {
    id: 1,
    module: "Dashboard and Analytics",
    feature: "Portfolio Overview Dashboard",
    howItWorks:
      "The platform opens to a centralised command-centre dashboard that aggregates data from all active leases, properties, payments, and pending actions. The Head of Real Estate sees total properties, active lease count, monthly rent liability, and pending tasks in one screen refresh. Widgets are configurable to highlight regional breakdowns or specific asset classes. All data updates in real time from underlying modules without manual refresh or export.",
    userType: "Head of Real Estate, CFO, Portfolio Manager",
    isUSP: true,
  },
  {
    id: 2,
    module: "Dashboard and Analytics",
    feature: "KPI Cards",
    howItWorks:
      "Four primary KPI cards display at the top of the dashboard: Total Properties (count of all active property records), Active Leases (leases in active status), Monthly Rent Expense (sum of all current rent obligations), and Pending Actions (count of overdue tasks, expiring leases, unpaid rents, and pending compliances). Each card is clickable and drills into the relevant module.",
    userType: "Head of Real Estate, Finance Manager",
    isUSP: false,
  },
  {
    id: 3,
    module: "Dashboard and Analytics",
    feature: "Monthly Expense Analysis",
    howItWorks:
      "A time-series chart plots total monthly property cost broken down by rent, utilities, maintenance, and OPEX across user-selected time horizons (3 months, 6 months, 12 months). The Operations Manager uses this to identify cost spikes in specific months or properties. The chart exports to PDF and Excel for CFO reporting.",
    userType: "CFO, Finance Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 4,
    module: "Dashboard and Analytics",
    feature: "Lease Expiry Distribution",
    howItWorks:
      "A visual chart (bar or heatmap) shows the number of leases expiring within 30, 60, 90, 180, and 365 days across the portfolio. The Lease Manager uses this daily to prioritise renewal negotiations. Properties approaching expiry within 90 days are flagged in red.",
    userType: "Head of Real Estate, Lease Manager",
    isUSP: false,
  },
  {
    id: 5,
    module: "Dashboard and Analytics",
    feature: "Security Deposit Analytics",
    howItWorks:
      "A breakdown view showing total deposits held, average deposit per property, deposit duration analysis, and property-wise deposit amounts. The Finance team uses this to reconcile deposits during property exits and to assess working capital locked in deposits.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 6,
    module: "Dashboard and Analytics",
    feature: "Regional Performance Insights",
    howItWorks:
      "A geographic breakdown of lease count, total rent, OPEX, and compliance status by Country, State, Region, Zone, City, and Circle using the hierarchical location master. The Portfolio Manager uses this to benchmark performance across geographies.",
    userType: "Portfolio Manager, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 7,
    module: "Dashboard and Analytics",
    feature: "Alerts and Notifications",
    howItWorks:
      "A real-time alerts panel on the dashboard surfaces critical items requiring immediate action: leases expiring within 30 days, rent payments overdue, compliance documents expiring within 60 days, and AMC renewals due. Each alert links to the relevant record. The system sends email and in-app notifications to assigned users.",
    userType: "All Roles",
    isUSP: true,
  },
  {
    id: 8,
    module: "Lease and Rental Agreement Management",
    feature: "Lease Creation and Configuration",
    howItWorks:
      "A structured form guides the Lease Manager through creating a new lease record: selecting the property from the property master, linking landlord and tenant profiles, defining rent amount, escalation schedule (percentage per year or fixed amount), lock-in period, notice period, CAM charges, security deposit amount, and penalty clauses.",
    userType: "Lease Manager, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 9,
    module: "Lease and Rental Agreement Management",
    feature: "Lease Repository",
    howItWorks:
      "All lease agreements are stored in a searchable, filterable repository showing lease ID, property name, landlord, tenant, start date, end date, monthly rent, and status. Users can view, edit, or download agreement PDFs directly from the list.",
    userType: "Lease Manager, Finance Manager, Auditor",
    isUSP: false,
  },
  {
    id: 10,
    module: "Lease and Rental Agreement Management",
    feature: "Lease Lifecycle Tracking",
    howItWorks:
      "Each lease moves through a defined status workflow: Draft, Active, Expiring (within 90 days), Under Renewal, Renewed, Terminated, or Expired. The system automatically transitions leases to Expiring status based on date proximity. Status changes trigger notifications to assigned stakeholders.",
    userType: "Lease Manager, Head of Real Estate, Finance Manager",
    isUSP: true,
  },
  {
    id: 11,
    module: "Lease and Rental Agreement Management",
    feature: "Lease Terms Management",
    howItWorks:
      "All financial and contractual terms of a lease are captured in structured fields: monthly rent, annual escalation rate, effective date of escalation, CAM amount and basis, security deposit amount and duration, penalty for early termination, and lock-in period.",
    userType: "Lease Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 12,
    module: "Lease and Rental Agreement Management",
    feature: "Auto-population from Masters",
    howItWorks:
      "When creating a lease, fields like landlord name, contact details, and address; property address, area metrics, and floor details; and location hierarchy (Zone, City, Circle) are pulled automatically from the respective master records.",
    userType: "Lease Manager",
    isUSP: false,
  },
  {
    id: 13,
    module: "Lease and Rental Agreement Management",
    feature: "Agreement Document Upload and Storage",
    howItWorks:
      "Scanned or digital PDF copies of signed lease agreements, addenda, and renewal letters can be uploaded and linked to each lease record. Documents are stored within the client's own server infrastructure. Version history is maintained.",
    userType: "Lease Manager, Legal Team, Auditor",
    isUSP: false,
  },
  {
    id: 14,
    module: "Lease and Rental Agreement Management",
    feature: "Audit Logs for All Changes",
    howItWorks:
      "Every create, update, or delete action on a lease record - including changes to rent amount, escalation rate, status, landlord details, or document uploads - is timestamped, attributed to the user who made the change, and stored in an immutable audit log.",
    userType: "Compliance Officer, Auditor, CFO",
    isUSP: true,
  },
  {
    id: 15,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Lease Expiry Tracking",
    howItWorks:
      "The system maintains a real-time countdown to lease end date for every active lease. Properties expiring within 90, 60, and 30 days are surfaced in distinct alert tiers. The Lease Manager receives automated email notifications at each threshold.",
    userType: "Lease Manager, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 16,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Renewal Pipeline",
    howItWorks:
      "A Kanban-style pipeline tracks all renewal conversations across three stages: Expiring (identified for action), Negotiation (in active discussion with landlord), and Renewed (agreement closed). The Lease Manager moves leases across stages and logs notes, proposed terms, and follow-up dates.",
    userType: "Lease Manager, Head of Real Estate",
    isUSP: true,
  },
  {
    id: 17,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Proposed vs Current Rent Comparison",
    howItWorks:
      "During the renewal negotiation stage, the platform generates a side-by-side comparison of the current rent, landlord's proposed rent, market benchmark (input manually or sourced from past nearby leases in the system), and the organisation's target rent.",
    userType: "Head of Real Estate, Lease Manager",
    isUSP: true,
  },
  {
    id: 18,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Renewal Actions",
    howItWorks:
      "From within the renewal pipeline, users can log negotiation notes, send templated renewal offer emails directly to the landlord, schedule follow-up reminders, and record counteroffers. The full communication log is stored against the lease record.",
    userType: "Lease Manager",
    isUSP: false,
  },
  {
    id: 19,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Auto-renewal Configuration",
    howItWorks:
      "For low-priority or standard leases, the Lease Manager can configure an auto-renewal rule: if no action is taken within X days of expiry, the system auto-generates a renewal record with the same terms plus the standard escalation rate.",
    userType: "Lease Manager, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 20,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Reminder Notifications",
    howItWorks:
      "Configurable notification rules allow administrators to set automated email and in-app reminders for any lease event: X days before expiry, X days before rent escalation, X days before lock-in period ends, or X days before a compliance document expires.",
    userType: "Lease Manager, Head of Real Estate",
    isUSP: false,
  },
  // Continue with more features...
  {
    id: 21,
    module: "Tenant and Landlord Management",
    feature: "Tenant Directory and Profiles",
    howItWorks:
      "A centralised directory stores all tenant organisation profiles: company name, GST number, PAN, registered address, primary contact name, phone, email, bank account details for ECS, and lease history.",
    userType: "Finance Manager, Lease Manager",
    isUSP: false,
  },
  {
    id: 22,
    module: "Tenant and Landlord Management",
    feature: "Landlord Directory and Profiles",
    howItWorks:
      "All landlord profiles are stored with full contact details, bank account information for rent remittance, PAN and GST numbers, and a complete list of properties leased from each landlord.",
    userType: "Head of Real Estate, Lease Manager",
    isUSP: false,
  },
  {
    id: 23,
    module: "Rent Collection and Financial Tracking",
    feature: "Rent Collection Dashboard",
    howItWorks:
      "A dedicated financial dashboard aggregates all rent due, collected, partially collected, and overdue across the portfolio for the current month. The Finance Manager sees payment status broken down by property and landlord.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 24,
    module: "Compliance Management",
    feature: "Compliance Repository",
    howItWorks:
      "A structured document store holds all regulatory approvals and certificates required for each property: Fire NOC, Completion Certificate (CC), Occupancy Certificate (OC), trade licences, shop establishment certificates, and others.",
    userType: "Compliance Officer, Auditor",
    isUSP: false,
  },
  {
    id: 25,
    module: "Compliance Management",
    feature: "Renewal Alerts and Validity Tracking",
    howItWorks:
      "The system tracks the validity expiry date of every compliance document and triggers email and in-app alerts to the assigned Compliance Officer at 90, 60, and 30 days before expiry. This prevents compliance lapses that could result in regulatory penalties.",
    userType: "Compliance Officer, Head of Real Estate",
    isUSP: true,
  },
  {
    id: 26,
    module: "Property and Asset Management",
    feature: "Property Master Database",
    howItWorks:
      "A comprehensive record for each property contains: property name, address, pin code, property type (office, retail, warehouse), area details (carpet, chargeable, super built-up), floor number, building name, owner details, GPS coordinates, and photos.",
    userType: "Head of Real Estate, Lease Manager",
    isUSP: false,
  },
  {
    id: 27,
    module: "Utilities Management",
    feature: "Utility Consumption Tracking",
    howItWorks:
      "Electricity, water, gas, and internet consumption data is entered monthly per property (or auto-imported via meter reading API where available). The Operations Manager sees current month versus prior month versus same month last year consumption.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 28,
    module: "Utilities Management",
    feature: "Efficiency Metrics",
    howItWorks:
      "Per-property efficiency metrics include cost per sqft per month for each utility, consumption per occupant for electricity and water, and utility cost as a percentage of total rent. These metrics help prioritise energy efficiency investments.",
    userType: "Head of Real Estate, CFO, Facility Manager",
    isUSP: true,
  },
  {
    id: 29,
    module: "AMC Management",
    feature: "AMC Contract Management",
    howItWorks:
      "All Annual Maintenance Contracts for a property (lift, HVAC, fire suppression, electrical, plumbing, pest control, DG sets) are stored with vendor name, contract value, start date, end date, scope of services, and SLA terms.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 30,
    module: "AMC Management",
    feature: "Vendor Performance Metrics",
    howItWorks:
      "After each service visit, the Facility Manager rates the vendor on a 1 to 5 scale across dimensions: response time, quality of work, adherence to SLA, and professionalism. Aggregate ratings are shown on the vendor profile and on the AMC dashboard.",
    userType: "Facility Manager, Operations Manager",
    isUSP: true,
  },
  {
    id: 31,
    module: "Maintenance Management",
    feature: "Maintenance Request Ticketing",
    howItWorks:
      "Any employee or Facility Manager raises a maintenance request through a structured form: property, unit, issue description, category, severity, and photos. The ticket is assigned a unique ID, timestamp, and SLA deadline.",
    userType: "All Staff, Facility Manager",
    isUSP: false,
  },
  {
    id: 32,
    module: "Masters and Configuration Engine",
    feature: "Master Data Management",
    howItWorks:
      "The Masters module is the foundation of the platform. Administrators configure: Tenant master, Landlord master, Property master, Vendor master, and Document type master. All downstream modules auto-populate from masters.",
    userType: "System Administrator, Head of Real Estate",
    isUSP: true,
  },
  {
    id: 33,
    module: "Masters and Configuration Engine",
    feature: "Location Hierarchy",
    howItWorks:
      "A six-level geographic hierarchy is configured: Country, State, Region, Zone, City, and Circle. Every property, lease, and expense record is tagged to this hierarchy. The Portfolio Manager uses the hierarchy to filter and aggregate any report at any geographic level.",
    userType: "System Administrator, Portfolio Manager",
    isUSP: true,
  },
  {
    id: 34,
    module: "Masters and Configuration Engine",
    feature: "Custom Fields for Leases",
    howItWorks:
      "Administrators can add organisation-specific data fields to lease records that are not in the standard schema: for example, Business Unit, Cost Centre Code, Project Code, or Approval Reference. Custom fields appear in the lease creation form, in the lease repository filter, and in exports.",
    userType: "System Administrator, Head of Real Estate",
    isUSP: true,
  },
  // Additional features from markdown (35-78)
  {
    id: 35,
    module: "Compliance Management",
    feature: "Compliance Status Tracking",
    howItWorks:
      "Each compliance document is assigned a status: Approved (valid), Pending (application submitted), Rejected (reapplication needed), or Expired. The Compliance Officer sees a filtered list of all pending and rejected items requiring follow-up. Status changes are logged with timestamps for audit purposes. Automated weekly summaries of compliance status are sent to the Head of Real Estate.",
    userType: "Compliance Officer, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 36,
    module: "Compliance Management",
    feature: "Compliance Assignment and Ownership",
    howItWorks:
      "Each compliance item is assigned to a specific team member responsible for renewal or follow-up. The system tracks whether the assigned person has acknowledged the alert and taken action. Escalation rules forward unacknowledged alerts to the team lead after X days. This creates accountability and prevents the common failure mode where compliance renewals are no one person's responsibility.",
    userType: "Compliance Officer, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 37,
    module: "Property and Asset Management",
    feature: "Building and Unit Management",
    howItWorks:
      "For multi-floor or multi-unit buildings, individual floors and units are configured with their own area metrics, usage type, and occupancy status. The system shows which units within a building are leased and which are vacant. This supports companies leasing partial floors or managing co-working spaces within their own properties.",
    userType: "Head of Real Estate, Facility Manager",
    isUSP: false,
  },
  {
    id: 38,
    module: "Property and Asset Management",
    feature: "Area Metrics",
    howItWorks:
      "Three area measurements are maintained per property unit: carpet area (usable internal space), chargeable area (carpet plus shared spaces), and efficiency ratio (carpet divided by chargeable). Finance teams use efficiency ratio to compare cost-per-usable-sqft across properties. Operations teams use carpet area for space planning.",
    userType: "Head of Real Estate, Finance Manager",
    isUSP: false,
  },
  {
    id: 39,
    module: "Property and Asset Management",
    feature: "Property Takeover Conditions",
    howItWorks:
      "At the time of lease commencement, the takeover condition of the property is documented: existing fixtures, furnishings, equipment, structural issues observed, and photographs. This record is used at lease exit to assess whether the tenant or landlord is responsible for restoration costs. The Operations Manager accesses this during exit negotiations.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 40,
    module: "Property and Asset Management",
    feature: "Facility and Amenity Management",
    howItWorks:
      "Each property record carries a list of available facilities and amenities: parking bays, generator backup, HVAC type, security system, DG sets, cafeteria, and common area access. This supports both lease negotiation (comparing properties on amenity value) and operational planning (knowing which properties have backup power for business continuity).",
    userType: "Facility Manager, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 41,
    module: "OPEX and Expense Management",
    feature: "Expense Tracking",
    howItWorks:
      "All operational expenses for each property are recorded with date, amount, category (housekeeping, security, maintenance materials, electricity, internet, insurance), invoice number, and vendor name. Monthly and year-to-date totals are automatically aggregated by property and expense category. The Finance Manager uses this for monthly cost reporting to leadership.",
    userType: "Finance Manager, Facility Manager",
    isUSP: false,
  },
  {
    id: 42,
    module: "OPEX and Expense Management",
    feature: "Budget Planning",
    howItWorks:
      "An annual budget is set per property per expense category at the beginning of each financial year. The system tracks actual spend against budget in real time and shows utilisation percentage. Budget overruns trigger alerts to the Finance Manager. Year-on-year budget comparison helps identify properties with consistently high or rising operational costs.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 43,
    module: "OPEX and Expense Management",
    feature: "Expense Categorisation",
    howItWorks:
      "Expenses are tagged to standard categories defined in the Masters module. Custom categories can be added. The expense categorisation feeds the Monthly Expense Analysis dashboard, the property-wise cost analysis, and the budget tracking module. Consistent categorisation ensures that CFO-level reports are comparable across properties and time periods.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 44,
    module: "OPEX and Expense Management",
    feature: "Property-wise Cost Analysis",
    howItWorks:
      "A drill-down view shows total cost of occupancy per property: rent plus OPEX plus utilities. The Head of Real Estate uses this to identify properties where total cost of occupancy significantly exceeds the lease rent value, which is a signal to renegotiate or exit. The cost analysis is available as a ranked list, sortable by total cost or cost per sqft.",
    userType: "Head of Real Estate, CFO",
    isUSP: false,
  },
  {
    id: 45,
    module: "OPEX and Expense Management",
    feature: "Recent Transactions",
    howItWorks:
      "A running log of the 50 most recent expense transactions across the portfolio, showing date, property, category, vendor, and amount. The Finance Manager uses this as a quick audit check without running a full report. Individual transactions are clickable for full details and linked invoices.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 46,
    module: "Utilities Management",
    feature: "Billing and Due Management",
    howItWorks:
      "Utility bills are uploaded and linked to each property record with due dates, bill amounts, and payment status. The system tracks unpaid utility bills separately from rent obligations. Automated reminders are sent before utility bill due dates to prevent service interruptions. Utility payment history is searchable by property, utility type, and date range.",
    userType: "Finance Manager, Facility Manager",
    isUSP: false,
  },
  {
    id: 47,
    module: "Utilities Management",
    feature: "Consumption Trends",
    howItWorks:
      "A trend chart plots monthly consumption for each utility over a user-selected period (3, 6, or 12 months). The Operations Manager uses this to identify seasonal spikes, detect equipment inefficiencies, and build the case for energy-saving investments. Benchmark comparisons between similar properties (same type and size) in the same city are shown where data is available.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 48,
    module: "Utilities Management",
    feature: "Cost Analysis",
    howItWorks:
      "A total utility cost view aggregates spend across all utility types per property, per city, and portfolio-wide. The CFO uses this for budget allocation and cost optimisation decisions. Year-over-year utility cost trend is shown alongside occupancy data to assess correlation.",
    userType: "CFO, Finance Manager",
    isUSP: false,
  },
  {
    id: 49,
    module: "AMC Management",
    feature: "Vendor Linking",
    howItWorks:
      "Each AMC record is linked to the vendor's profile in the vendor master, giving the Facility Manager direct access to vendor contact details, past performance scores, and other properties where the same vendor operates. This makes it easy to consolidate vendors across multiple properties and negotiate better rates for high-volume AMC relationships.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 50,
    module: "AMC Management",
    feature: "Service Scheduling and Calendar",
    howItWorks:
      "Preventive maintenance visits scheduled under each AMC are logged in a calendar view by property and service type. The Facility Manager sees which services are due this week, this month, or next month across all properties. Missed service visits are flagged in red. This replaces WhatsApp coordination for maintenance scheduling.",
    userType: "Facility Manager",
    isUSP: false,
  },
  {
    id: 51,
    module: "AMC Management",
    feature: "Renewal Tracking",
    howItWorks:
      "AMC contracts approaching their end date within 60 days trigger automated alerts to the Facility Manager and their department head. The renewal pipeline shows contracts by status (Active, Due for Renewal, Renewed, Lapsed). Renewal records are linked to the original contract for history tracking. This prevents the common operational failure of AMC lapse due to tracking oversight.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 52,
    module: "Maintenance Management",
    feature: "Issue Categorisation",
    howItWorks:
      "Maintenance issues are categorised using a standard taxonomy: HVAC, plumbing, electrical, civil, carpentry, pest control, housekeeping, IT/networking, fire safety, and others. Custom categories are configurable. The categorisation feeds the maintenance analytics dashboard, allowing the Operations Manager to identify which issue types are most frequent across the portfolio.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 53,
    module: "Maintenance Management",
    feature: "Priority Management",
    howItWorks:
      "Each maintenance ticket is assigned a priority level: Critical (building safety or operations affected, 4-hour SLA), High (business disruption risk, 24-hour SLA), Medium (inconvenient but not blocking, 72-hour SLA), or Low (cosmetic or routine, 7-day SLA). Priority drives SLA timers and escalation rules. Breach of SLA triggers automatic escalation to the department head.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 54,
    module: "Maintenance Management",
    feature: "Vendor Assignment and Allocation",
    howItWorks:
      "Open maintenance tickets are assigned to AMC vendors or ad hoc vendors from the vendor master. The Facility Manager sees each vendor's current open ticket count to avoid overloading one vendor. Assignment triggers an SMS or email notification to the vendor with ticket details and SLA deadline. Vendors can update ticket status via email reply, reducing the need for phone follow-up.",
    userType: "Facility Manager",
    isUSP: false,
  },
  {
    id: 55,
    module: "Maintenance Management",
    feature: "Status Tracking",
    howItWorks:
      "Tickets progress through statuses: Open, Assigned, In Progress, Pending Parts, Completed, Verified, and Closed. Each status change is timestamped and attributed to the user who made the change. The Facility Manager sees all open tickets by property in a single board view. Completed tickets require verification by the raiser before closure, ensuring quality control.",
    userType: "Facility Manager, Operations Manager",
    isUSP: false,
  },
  {
    id: 56,
    module: "Invoicing and Payments",
    feature: "Invoice Generation and Tracking",
    howItWorks:
      "The system auto-generates monthly rent invoices for each active lease based on the rent schedule and applicable taxes (GST, TDS). Invoice templates include company letterhead, GSTIN, HSN/SAC code, and payment terms. Generated invoices are emailed to tenants automatically or manually triggered by the Finance Manager. Invoice status (Draft, Sent, Viewed, Paid, Overdue) is tracked in real time.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 57,
    module: "Invoicing and Payments",
    feature: "Payment History",
    howItWorks:
      "A complete payment ledger per tenant or per property shows all invoices, payments received, adjustments, and current outstanding balance. The Finance Manager exports this for annual account finalisation or audit submissions. Search and filter by date range, tenant, or property makes reconciliation fast.",
    userType: "Finance Manager, Auditor",
    isUSP: false,
  },
  {
    id: 58,
    module: "Invoicing and Payments",
    feature: "Outstanding and Overdue Tracking",
    howItWorks:
      "The outstanding tracker shows all unpaid invoices by age bucket (0 to 30 days, 31 to 60 days, 60 to 90 days, more than 90 days). Overdue invoices beyond 30 days trigger automated follow-up email reminders to tenants. The Finance Manager uses the overdue tracker to prepare receivables reports for the CFO and to escalate persistent defaulters.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 59,
    module: "Invoicing and Payments",
    feature: "Collection Rate Monitoring",
    howItWorks:
      "A performance metric showing the percentage of invoiced rent collected within the due period, calculated monthly and cumulatively. The CFO tracks this as a KPI. Properties or tenants with consistently low collection rates are flagged for management review. The metric helps identify systemic payment issues before they become bad debt.",
    userType: "CFO, Finance Manager",
    isUSP: false,
  },
  {
    id: 60,
    module: "Rent Collection and Financial Tracking",
    feature: "Payment Tracking",
    howItWorks:
      "Each lease has an auto-generated monthly rent schedule showing the amount due, due date, and payment status (Paid, Pending, Partial, Overdue). When a payment is recorded, the status updates and the paid date and amount are logged. Partial payments are tracked with outstanding balance. The Finance team uses this to prepare monthly rent expense journals without additional reconciliation.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 61,
    module: "Rent Collection and Financial Tracking",
    feature: "Rent Due Scheduling",
    howItWorks:
      "The system auto-generates monthly rent due entries for every active lease based on the rent terms defined in the lease record. If a lease has an annual escalation on a specific date, the rent due schedule automatically updates from that date forward. No manual intervention is needed for ongoing schedule generation. The schedule is visible 12 months forward for cash flow planning.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 62,
    module: "Rent Collection and Financial Tracking",
    feature: "Late Fee and Penalty Configuration",
    howItWorks:
      "Administrators configure penalty rules per lease or globally: a fixed amount or percentage of monthly rent charged after X days of non-payment. The system auto-calculates and appends late fees to overdue invoices. This replaces manual penalty calculation and ensures consistent enforcement across a large portfolio. Penalty logs are available for audit purposes.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 63,
    module: "Rent Collection and Financial Tracking",
    feature: "Payment Recording",
    howItWorks:
      "Finance team members record rent payments by selecting the lease, entering the amount paid, payment date, payment mode (NEFT, cheque, or auto-debit), and transaction reference. The system updates the payment status and generates a receipt. Bulk payment recording is supported for high-volume portfolios. All payments are linked to the relevant invoice for one-click audit trail access.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 64,
    module: "Rent Collection and Financial Tracking",
    feature: "Export and Reminder Triggers",
    howItWorks:
      "The Finance Manager can export rent due and payment status reports to Excel or PDF at any time. Automated reminder emails are sent to tenants for overdue payments based on configurable trigger rules. Export templates are pre-formatted for use in ERP systems or audit submissions.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 65,
    module: "Security Deposit Management",
    feature: "Deposit Tracking by Property",
    howItWorks:
      "Every lease record carries a linked security deposit entry showing deposit amount, date collected, bank account or DD details, expected return date, and current status (Held, Partially Refunded, Fully Refunded). The Finance Manager uses this to generate a complete deposit register for any given date. Alerts flag deposits held on properties with leases expiring within 90 days.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 66,
    module: "Security Deposit Management",
    feature: "Deposit Amount and Duration Analysis",
    howItWorks:
      "An analytics view shows average deposit amount by property type, city, and landlord; total deposits held as of today; and deposits by duration (less than 1 year, 1 to 3 years, more than 3 years). The CFO uses this for balance sheet reconciliation and working capital analysis. Trend charts show how deposit liability has changed over 12 months.",
    userType: "CFO, Finance Manager",
    isUSP: false,
  },
  {
    id: 67,
    module: "Security Deposit Management",
    feature: "Deposit Distribution Insights",
    howItWorks:
      "A geographic and property-type breakdown shows how deposits are distributed across the portfolio. The Head of Real Estate uses this to identify outlier properties where deposit requirements are unusually high relative to market norms and to negotiate better terms at renewal.",
    userType: "Head of Real Estate, Finance Manager",
    isUSP: false,
  },
  {
    id: 68,
    module: "Tenant and Landlord Management",
    feature: "Contact and Communication Actions",
    howItWorks:
      "Users can initiate a phone call or send a pre-filled email to any landlord or tenant directly from their profile page within the platform, without switching to an external email client. Communication templates for rent reminders, renewal offers, and compliance requests are pre-built and customisable. All sent communications are logged against the contact record.",
    userType: "Lease Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 69,
    module: "Tenant and Landlord Management",
    feature: "Relationship Overview",
    howItWorks:
      "A relationship summary view for each landlord shows total properties leased, total annual rent commitment, leases by status, average lease tenure, and renewal history. The Head of Real Estate uses this to identify top landlords for strategic relationship management and to assess concentration risk (e.g. if 30% of portfolio is with one landlord group).",
    userType: "Head of Real Estate",
    isUSP: false,
  },
  {
    id: 70,
    module: "Masters and Configuration Engine",
    feature: "Role-Based Access Control",
    howItWorks:
      "User access is governed by roles assigned in the Masters module. Predefined roles include Super Admin, Head of Real Estate, Finance Manager, Lease Manager, Compliance Officer, Facility Manager, and Read-Only User. Each role has a defined permission set controlling which modules are visible, which records can be edited, and which reports can be exported. Custom roles can be created for specific operational requirements.",
    userType: "System Administrator, IT Manager",
    isUSP: false,
  },
  {
    id: 71,
    module: "Masters and Configuration Engine",
    feature: "Branding and Invoice Configuration",
    howItWorks:
      "Company name, logo, registered address, GSTIN, bank account details for TDS certificates, and invoice footer text are configured once in the Masters module and automatically applied to all system-generated invoices, reports, and email templates. This ensures every communication from the platform is professionally branded and compliant with GST invoice requirements.",
    userType: "System Administrator, Finance Manager",
    isUSP: false,
  },
  {
    id: 72,
    module: "Notifications and Alerts",
    feature: "Lease Expiry Alerts",
    howItWorks:
      "Automated email and in-app notifications are sent to the assigned Lease Manager and their department head at 90, 60, 30, and 7 days before any lease expiry. Notification content includes lease ID, property name, monthly rent value, and a direct link to the renewal pipeline. Alert rules are configurable per user role.",
    userType: "Lease Manager, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 73,
    module: "Notifications and Alerts",
    feature: "Rent Due Notifications",
    howItWorks:
      "Automated reminders are sent to the Finance Manager 5 and 2 days before each monthly rent due date. For overdue rents, daily reminders are sent until payment is recorded. Tenants can optionally receive automated rent due reminders as well. Notification frequency and channels (email or in-app) are configurable.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 74,
    module: "Notifications and Alerts",
    feature: "Compliance Alerts",
    howItWorks:
      "Configurable alert rules notify the Compliance Officer and Head of Real Estate before any compliance document expires. Standard thresholds are 90, 60, and 30 days. Escalation rules trigger additional notifications to the department head if the primary assignee has not taken action within 10 days of the first alert.",
    userType: "Compliance Officer, Head of Real Estate",
    isUSP: false,
  },
  {
    id: 75,
    module: "Notifications and Alerts",
    feature: "Maintenance Updates",
    howItWorks:
      "Requesters receive automated status update notifications each time their maintenance ticket changes status (Assigned, In Progress, Completed, Closed). The Facility Manager receives daily digest notifications of all open high-priority tickets. Vendors receive assignment and SLA deadline notifications at the time of ticket assignment.",
    userType: "Facility Manager, All Staff",
    isUSP: false,
  },
  {
    id: 76,
    module: "Settings and User Management",
    feature: "User Profiles and Management",
    howItWorks:
      "Each system user has a profile with name, role, department, email, phone, and assigned properties (for role-scoped access). The Super Admin creates, edits, deactivates, or deletes users. Bulk user upload from CSV is supported for large organisations. Active user count and last login dates help the administrator identify inactive accounts.",
    userType: "System Administrator",
    isUSP: false,
  },
  {
    id: 77,
    module: "Settings and User Management",
    feature: "Role and Permission Management",
    howItWorks:
      "Granular permission settings allow the Super Admin to configure module-level, record-level, and action-level access for each role. For example, the Finance Manager role can view and record payments but cannot delete lease records or change rent terms. Permission changes take effect immediately and are logged in the audit trail.",
    userType: "System Administrator",
    isUSP: false,
  },
  {
    id: 78,
    module: "Settings and User Management",
    feature: "Security Settings",
    howItWorks:
      "Two-factor authentication, session timeout settings, password complexity requirements, and IP whitelisting are configurable at the organisation level by the Super Admin. All authentication events are logged. Sessions auto-expire after a configured idle period. These controls satisfy enterprise IT security policy requirements.",
    userType: "System Administrator, IT Manager",
    isUSP: false,
  },
];

// ==================== TAB 2B: FEATURES (LESSOR PERSPECTIVE) ====================

export const lessorFeatures: Feature[] = [
  {
    id: 1,
    module: "Dashboard and Analytics",
    feature: "Portfolio Overview Dashboard",
    howItWorks:
      "The platform opens to a centralised command-centre dashboard that aggregates data from all owned properties, active outgoing leases, rental income collected, occupancy rates, and pending actions. The Property Owner or Asset Manager sees total properties owned, active tenant count, monthly rental income, vacancy count, and pending tasks in one screen. Widgets are configurable by property type, geography, or tenant segment. All data updates in real time.",
    userType: "Property Owner, Asset Manager, CFO",
    isUSP: true,
  },
  {
    id: 2,
    module: "Dashboard and Analytics",
    feature: "KPI Cards",
    howItWorks:
      "Four primary KPI cards display at the top of the dashboard: Total Properties Owned (count of all property records in the asset register), Active Tenants (count of tenants with active leases), Monthly Rental Income (sum of all current rent receivables), and Pending Actions (count of overdue rent collections, expiring leases, compliance renewals, and maintenance tickets). Each card is clickable and drills into the relevant module.",
    userType: "Property Owner, Asset Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 3,
    module: "Dashboard and Analytics",
    feature: "Monthly Income Analysis",
    howItWorks:
      "A time-series chart plots total monthly rental income broken down by rent, CAM recoveries, utility recharges, and other income across user-selected time horizons (3, 6, 12 months). The Asset Manager uses this to identify income trends, seasonal dips, and properties with declining collections. The chart exports to PDF and Excel for investor or board reporting.",
    userType: "CFO, Asset Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 4,
    module: "Dashboard and Analytics",
    feature: "Lease Expiry Distribution",
    howItWorks:
      "A visual chart shows the number of outgoing leases expiring within 30, 60, 90, 180, and 365 days across the portfolio. The Leasing Manager uses this daily to prioritise tenant retention conversations and pre-marketing of units expected to become vacant. Properties approaching expiry within 90 days are flagged in red.",
    userType: "Asset Manager, Leasing Manager",
    isUSP: false,
  },
  {
    id: 5,
    module: "Dashboard and Analytics",
    feature: "Occupancy Rate Analytics",
    howItWorks:
      "A breakdown view showing portfolio-wide occupancy rate, occupancy by property, by floor, and by unit type. Vacancy duration analysis shows how long each vacant unit has been empty and the cumulative lost rental income. The Asset Manager uses this to prioritise leasing efforts on high-value vacant units.",
    userType: "Asset Manager, Property Owner",
    isUSP: true,
  },
  {
    id: 6,
    module: "Dashboard and Analytics",
    feature: "Regional and Property-wise Performance",
    howItWorks:
      "A geographic breakdown of rental income, occupancy rate, collection efficiency, and maintenance costs by Country, State, Region, Zone, City, and Circle using the hierarchical location master. The Portfolio Manager uses this to benchmark property performance across geographies and identify underperforming assets.",
    userType: "Portfolio Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 7,
    module: "Dashboard and Analytics",
    feature: "Alerts and Notifications Panel",
    howItWorks:
      "A real-time alerts panel on the dashboard surfaces critical items: leases expiring within 30 days, rent payments overdue from tenants, compliance documents expiring within 60 days, AMC renewals due, and maintenance tickets breaching SLA. Each alert links to the relevant record. The system sends email and in-app notifications to assigned users.",
    userType: "All Roles",
    isUSP: true,
  },
  {
    id: 8,
    module: "Outgoing Lease Management",
    feature: "Lease Creation and Configuration",
    howItWorks:
      "A structured form guides the Leasing Manager through creating a new outgoing lease record: selecting the property and unit from the asset register, linking the tenant profile, defining rent amount, escalation schedule (percentage per year or fixed amount), lock-in period, notice period, CAM charges, security deposit amount, fit-out period, and penalty clauses for early termination.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 9,
    module: "Outgoing Lease Management",
    feature: "Lease Repository",
    howItWorks:
      "All outgoing lease agreements are stored in a searchable, filterable repository showing lease ID, property name, unit number, tenant name, start date, end date, monthly rent, CAM amount, and status. Users can view, edit, or download agreement PDFs directly from the list.",
    userType: "Leasing Manager, Finance Manager, Auditor",
    isUSP: false,
  },
  {
    id: 10,
    module: "Outgoing Lease Management",
    feature: "Lease Lifecycle Tracking",
    howItWorks:
      "Each outgoing lease moves through a defined status workflow: Draft, Active, Expiring (within 90 days), Under Renewal, Renewed, Terminated, or Expired. The system automatically transitions leases to Expiring status based on date proximity. Status changes trigger notifications to the Leasing Manager and Asset Manager.",
    userType: "Leasing Manager, Asset Manager, Finance Manager",
    isUSP: true,
  },
  {
    id: 11,
    module: "Outgoing Lease Management",
    feature: "Lease Terms Management",
    howItWorks:
      "All financial and contractual terms of an outgoing lease are captured: monthly rent, annual escalation rate, effective date of escalation, CAM amount and basis (fixed or actual), security deposit amount and terms, fit-out period, rent-free period, penalty for early termination, lock-in period, and revenue share clauses where applicable.",
    userType: "Leasing Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 12,
    module: "Outgoing Lease Management",
    feature: "Auto-population from Masters",
    howItWorks:
      "When creating a lease, fields like tenant name, contact details, GST number; property address, unit area metrics, and floor details; and location hierarchy (Zone, City, Circle) are pulled automatically from the respective master records, reducing data entry time and errors.",
    userType: "Leasing Manager",
    isUSP: false,
  },
  {
    id: 13,
    module: "Outgoing Lease Management",
    feature: "Agreement Document Upload and Storage",
    howItWorks:
      "Scanned or digital PDF copies of signed lease agreements, addenda, renewal letters, and tenant correspondence can be uploaded and linked to each lease record. Documents are stored on the client's own server infrastructure with version history maintained for audit trail.",
    userType: "Leasing Manager, Legal Team, Auditor",
    isUSP: false,
  },
  {
    id: 14,
    module: "Outgoing Lease Management",
    feature: "Audit Logs for All Changes",
    howItWorks:
      "Every create, update, or delete action on a lease record — including changes to rent amount, escalation rate, status, tenant details, or document uploads — is timestamped, attributed to the user who made the change, and stored in an immutable audit log accessible to auditors and management.",
    userType: "Compliance Officer, Auditor, CFO",
    isUSP: true,
  },
  {
    id: 15,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Lease Expiry Tracking",
    howItWorks:
      "The system maintains a real-time countdown to lease end date for every active outgoing lease. Leases expiring within 90, 60, and 30 days are surfaced in distinct alert tiers. The Leasing Manager receives automated email notifications at each threshold to initiate tenant retention or pre-marketing activities.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 16,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Renewal Pipeline",
    howItWorks:
      "A Kanban-style pipeline tracks all renewal conversations across stages: Expiring (identified for action), Retention Discussion (in active discussion with tenant), Renewed (agreement closed), and Vacating (tenant confirmed exit). The Leasing Manager moves leases across stages and logs notes, proposed terms, and follow-up dates.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: true,
  },
  {
    id: 17,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Proposed vs Current Rent Comparison",
    howItWorks:
      "During the renewal stage, the platform generates a side-by-side comparison of the current rent, proposed new rent (with escalation applied), market benchmark for the micro-market, and the tenant's counterproposal. This helps the Asset Manager make data-driven renewal decisions.",
    userType: "Asset Manager, Leasing Manager",
    isUSP: true,
  },
  {
    id: 18,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Renewal Actions",
    howItWorks:
      "From within the renewal pipeline, users can log negotiation notes, send templated renewal offer emails to tenants, schedule follow-up reminders, and record counteroffers. The full communication log is stored against the lease record for future reference.",
    userType: "Leasing Manager",
    isUSP: false,
  },
  {
    id: 19,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Auto-renewal Configuration",
    howItWorks:
      "For standard leases, the Leasing Manager can configure an auto-renewal rule: if no action is taken within X days of expiry, the system auto-generates a renewal record with the same terms plus the standard escalation rate. This prevents accidental lease lapses for reliable tenants.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 20,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Reminder Notifications",
    howItWorks:
      "Configurable notification rules allow administrators to set automated email and in-app reminders for any lease event: X days before expiry, X days before rent escalation effective date, X days before lock-in period ends, or X days before a compliance document expires.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 21,
    module: "Tenant Management",
    feature: "Tenant Directory and Profiles",
    howItWorks:
      "A centralised directory stores all tenant organisation profiles: company name, GST number, PAN, registered address, primary contact name, phone, email, bank account details, lease history, payment reliability score, and communication logs. The Leasing Manager uses this to assess tenant quality during renewals.",
    userType: "Leasing Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 22,
    module: "Tenant Management",
    feature: "Tenant Payment Reliability Scoring",
    howItWorks:
      "The system auto-calculates a payment reliability score for each tenant based on historical payment timeliness, frequency of late payments, and dispute history. The score is visible on the tenant profile and on the lease renewal pipeline. The Asset Manager uses this to prioritise retention of reliable tenants and flag high-risk tenants.",
    userType: "Asset Manager, Finance Manager",
    isUSP: true,
  },
  {
    id: 23,
    module: "Tenant Management",
    feature: "Tenant Communication and Dispute Tracking",
    howItWorks:
      "All communications with tenants — rent reminders, maintenance updates, renewal offers, dispute notes — are logged against the tenant profile. Disputes (rent disputes, CAM disputes, maintenance disputes) are tracked with status, resolution notes, and timeline. The relationship health score aggregates payment, communication, and dispute data.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 24,
    module: "Rental Income and Receivables Tracking",
    feature: "Rent Receivables Dashboard",
    howItWorks:
      "A dedicated financial dashboard aggregates all rent receivable, collected, partially collected, and overdue across the portfolio for the current month. The Finance Manager sees collection status broken down by property, floor, tenant, and aging bucket. Total outstanding and collection rate percentage are prominently displayed.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 25,
    module: "Rental Income and Receivables Tracking",
    feature: "Rent Due Scheduling",
    howItWorks:
      "The system auto-generates monthly rent receivable entries for every active outgoing lease based on lease terms. If a lease has an annual escalation on a specific date, the receivable schedule automatically updates from that date forward. The schedule is visible 12 months forward for cash flow forecasting.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 26,
    module: "Rental Income and Receivables Tracking",
    feature: "Payment Recording and Reconciliation",
    howItWorks:
      "Finance team members record rent payments received by selecting the lease, entering the amount received, payment date, payment mode (NEFT, cheque, or auto-debit), and transaction reference. The system updates the receivable status and generates a receipt. Bulk payment recording is supported. All payments are linked to the relevant invoice.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 27,
    module: "Rental Income and Receivables Tracking",
    feature: "Receivables Aging Analysis",
    howItWorks:
      "The outstanding tracker shows all unpaid rent by age bucket (0-30 days, 31-60 days, 61-90 days, 90+ days). Overdue receivables beyond 30 days trigger automated follow-up email reminders to tenants. The Finance Manager uses the aging report for CFO reporting and to escalate persistent defaulters for legal action.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 28,
    module: "Rental Income and Receivables Tracking",
    feature: "Collection Rate Monitoring",
    howItWorks:
      "A performance metric showing the percentage of invoiced rent collected within the due period, calculated monthly and cumulatively. The CFO tracks this as a KPI. Properties or tenants with consistently low collection rates are flagged for management review. Trend analysis shows collection performance over 12 months.",
    userType: "CFO, Finance Manager",
    isUSP: false,
  },
  {
    id: 29,
    module: "Tenant Billing and Invoicing",
    feature: "Automated Rent Invoice Generation",
    howItWorks:
      "The system auto-generates monthly rent invoices for each active outgoing lease based on the rent schedule and applicable taxes (GST at 18% for commercial leases). Invoice templates include company letterhead, GSTIN, HSN/SAC code, and payment terms. Generated invoices are emailed to tenants automatically or manually triggered.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 30,
    module: "Tenant Billing and Invoicing",
    feature: "CAM Invoice Generation",
    howItWorks:
      "Separate CAM (Common Area Maintenance) invoices are auto-generated monthly based on the CAM terms in each lease (fixed amount or proportional to area). CAM invoices include GST and are dispatched alongside or separately from rent invoices as configured. Annual CAM reconciliation invoices (actual vs estimated) are generated at year-end.",
    userType: "Finance Manager",
    isUSP: true,
  },
  {
    id: 31,
    module: "Tenant Billing and Invoicing",
    feature: "Utility Recharge Invoicing",
    howItWorks:
      "Utility consumption (electricity, water, DG) recorded against each tenant's meter is converted into recharge invoices with applicable markup and GST. The system calculates per-unit cost based on actual utility bills paid by the property owner and generates proportional tenant invoices.",
    userType: "Finance Manager, Facility Manager",
    isUSP: false,
  },
  {
    id: 32,
    module: "Tenant Billing and Invoicing",
    feature: "GST-Compliant Invoice Templates",
    howItWorks:
      "All invoices are generated with full GST compliance: GSTIN of lessor and lessee, HSN/SAC codes, CGST/SGST/IGST breakup, place of supply, reverse charge applicability, and e-invoice QR code where applicable. Templates are configurable per property or entity for multi-entity lessors.",
    userType: "Finance Manager, CFO",
    isUSP: true,
  },
  {
    id: 33,
    module: "Tenant Billing and Invoicing",
    feature: "Late Fee and Penalty Auto-calculation",
    howItWorks:
      "Late payment penalty rules are configured per lease or globally: a fixed amount or percentage of monthly rent charged after X days of non-payment. The system auto-calculates and appends late fees to overdue invoices. Penalty logs are maintained for dispute resolution and audit purposes.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 34,
    module: "CAM Reconciliation and Management",
    feature: "CAM Budget Setup",
    howItWorks:
      "At the beginning of each financial year, the Asset Manager sets the annual CAM budget for each property covering housekeeping, security, landscaping, common area electricity, water, repairs, and management fees. The budget is broken down monthly and allocated to tenants proportionally by area or as per lease terms.",
    userType: "Asset Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 35,
    module: "CAM Reconciliation and Management",
    feature: "Monthly CAM Billing",
    howItWorks:
      "Monthly CAM invoices are auto-generated for each tenant based on estimated CAM charges defined in the lease. The system tracks estimated CAM billed vs actual CAM expenses incurred month by month, building towards the annual reconciliation.",
    userType: "Finance Manager",
    isUSP: false,
  },
  {
    id: 36,
    module: "CAM Reconciliation and Management",
    feature: "Annual CAM Reconciliation",
    howItWorks:
      "At year-end, the system calculates total actual CAM expenses incurred versus total estimated CAM billed to tenants. The difference is either billed as a supplementary invoice (if actual exceeds estimate) or credited to the tenant's next billing cycle. Reconciliation statements are generated per tenant with full expense breakdown.",
    userType: "Finance Manager, Asset Manager",
    isUSP: true,
  },
  {
    id: 37,
    module: "CAM Reconciliation and Management",
    feature: "CAM Expense Tracking",
    howItWorks:
      "All common area expenses are recorded with date, amount, category (housekeeping, security, landscaping, repairs, common electricity, water, management fee), vendor name, and invoice reference. These expenses feed the annual CAM reconciliation calculation and the property-level P&L.",
    userType: "Facility Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 38,
    module: "Occupancy and Vacancy Management",
    feature: "Occupancy Dashboard",
    howItWorks:
      "A real-time dashboard shows occupancy status for every unit across all properties: Occupied, Vacant, Under Notice, Under Fit-out, and Reserved. Occupancy rate is calculated at unit, floor, building, and portfolio level. The Asset Manager uses this to track leasing pipeline performance.",
    userType: "Asset Manager, Property Owner",
    isUSP: true,
  },
  {
    id: 39,
    module: "Occupancy and Vacancy Management",
    feature: "Vacancy Duration Tracking",
    howItWorks:
      "Each vacant unit shows the date it became vacant, number of days vacant, cumulative lost rental income (based on last known rent or list rent), and reason for vacancy (lease expired, tenant terminated, new construction). This helps the Asset Manager quantify the cost of vacancy and prioritise leasing efforts.",
    userType: "Asset Manager, Finance Manager",
    isUSP: true,
  },
  {
    id: 40,
    module: "Occupancy and Vacancy Management",
    feature: "Unit Availability Register",
    howItWorks:
      "A searchable register of all available units showing property name, floor, unit number, carpet area, chargeable area, list rent per sqft, amenities, and photos. The Leasing Manager shares this with brokers and prospective tenants. The register auto-updates when a lease is signed for a vacant unit.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 41,
    module: "Occupancy and Vacancy Management",
    feature: "Tenant Move-in and Move-out Tracking",
    howItWorks:
      "Structured checklists track tenant move-in (key handover, meter readings, fit-out approval, security deposit received) and move-out (inspection, damage assessment, deposit deduction calculation, key return). Each step is timestamped and assigned to a responsible person.",
    userType: "Facility Manager, Leasing Manager",
    isUSP: false,
  },
  {
    id: 42,
    module: "Property Asset Register",
    feature: "Property Master Database",
    howItWorks:
      "A comprehensive record for each owned property contains: property name, address, pin code, property type (commercial office, retail, industrial, mixed-use), total area, leasable area, common area, number of floors, number of units, year of construction, land ownership details, encumbrance status, and photographs.",
    userType: "Asset Manager, Property Owner",
    isUSP: false,
  },
  {
    id: 43,
    module: "Property Asset Register",
    feature: "Unit-level Configuration",
    howItWorks:
      "For multi-floor or multi-unit buildings, individual floors and units are configured with their own area metrics (carpet, chargeable, super built-up), usage type (office, retail, storage, server room), current occupancy status, current tenant, and list rent. The system shows a visual floor plan of occupancy where configured.",
    userType: "Asset Manager, Leasing Manager",
    isUSP: false,
  },
  {
    id: 44,
    module: "Property Asset Register",
    feature: "Area Metrics and Efficiency",
    howItWorks:
      "Three area measurements are maintained per unit: carpet area, chargeable area, and super built-up area. Efficiency ratio (carpet divided by chargeable) is auto-calculated. Revenue per sqft metrics help the Asset Manager benchmark property yield against market rates.",
    userType: "Asset Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 45,
    module: "Property Asset Register",
    feature: "Property Valuation Register",
    howItWorks:
      "Each property record maintains a valuation history: purchase price, current market valuation, last valuation date, valuer name, and cap rate. The system calculates yield (annual rental income divided by property value) and flags properties where yield has dropped below a configurable threshold.",
    userType: "Property Owner, CFO",
    isUSP: true,
  },
  {
    id: 46,
    module: "Property Asset Register",
    feature: "Facility and Amenity Register",
    howItWorks:
      "Each property record carries a list of available facilities and amenities: parking bays (count and type), generator backup (capacity), HVAC system (type and age), security system, fire suppression, cafeteria, gymnasium, and common area specifications. This supports leasing conversations and operational planning.",
    userType: "Facility Manager, Leasing Manager",
    isUSP: false,
  },
  {
    id: 47,
    module: "Compliance Management for Owned Properties",
    feature: "Compliance Repository",
    howItWorks:
      "A structured document store holds all regulatory approvals and certificates required for each owned property: Building Completion Certificate (CC), Occupancy Certificate (OC), Fire NOC, Environmental Clearance, property tax receipts, insurance policies, lift safety certificates, electrical safety audit reports, and structural stability certificates.",
    userType: "Compliance Officer, Asset Manager",
    isUSP: false,
  },
  {
    id: 48,
    module: "Compliance Management for Owned Properties",
    feature: "Renewal Alerts and Validity Tracking",
    howItWorks:
      "The system tracks the validity expiry date of every compliance document and triggers email and in-app alerts to the assigned Compliance Officer at 90, 60, and 30 days before expiry. This prevents compliance lapses that could result in regulatory penalties, insurance claim rejections, or tenant legal action.",
    userType: "Compliance Officer, Asset Manager",
    isUSP: true,
  },
  {
    id: 49,
    module: "Compliance Management for Owned Properties",
    feature: "Compliance Status Tracking",
    howItWorks:
      "Each compliance document is assigned a status: Valid, Pending Renewal, Application Submitted, Rejected, or Expired. The Compliance Officer sees a filtered list of all pending and rejected items. Automated weekly summaries of compliance status are sent to the Asset Manager. Status changes are logged with timestamps.",
    userType: "Compliance Officer, Asset Manager",
    isUSP: false,
  },
  {
    id: 50,
    module: "Compliance Management for Owned Properties",
    feature: "Property Tax and Statutory Filing Reminders",
    howItWorks:
      "Property tax payment due dates, GST filing dates for rental income, and other statutory obligations are tracked per property with automated reminders. The system maintains a payment history for property tax and generates reports for tax planning purposes.",
    userType: "Finance Manager, Compliance Officer",
    isUSP: true,
  },
  {
    id: 51,
    module: "Compliance Management for Owned Properties",
    feature: "Insurance Management",
    howItWorks:
      "Property insurance policies (fire, natural disaster, public liability, terrorism) are tracked with policy number, insurer, premium amount, coverage amount, start date, expiry date, and renewal status. Premium payment reminders and renewal alerts ensure continuous coverage.",
    userType: "Asset Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 52,
    module: "Utility Billing to Tenants",
    feature: "Meter Reading Capture",
    howItWorks:
      "Electricity, water, and DG meter readings for each tenant unit are captured monthly — either manually entered by the Facility Manager or auto-imported via smart meter integration where available. Previous and current readings are stored with date stamps. Consumption is auto-calculated.",
    userType: "Facility Manager",
    isUSP: false,
  },
  {
    id: 53,
    module: "Utility Billing to Tenants",
    feature: "Consumption Calculation and Allocation",
    howItWorks:
      "Per-tenant utility consumption is calculated from meter readings. Common area utility consumption is allocated to tenants proportionally by occupied area or as per lease terms. The system handles multiple tariff slabs for electricity and different rates for DG power vs grid power.",
    userType: "Facility Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 54,
    module: "Utility Billing to Tenants",
    feature: "Utility Invoice Generation",
    howItWorks:
      "Utility recharge invoices are auto-generated monthly per tenant with consumption details, per-unit rate, applicable markup, and GST. Invoices are dispatched via email to tenants. Dispute logging allows tenants to flag incorrect readings, which triggers a verification workflow.",
    userType: "Finance Manager, Facility Manager",
    isUSP: false,
  },
  {
    id: 55,
    module: "Utility Billing to Tenants",
    feature: "Utility Cost Recovery Dashboard",
    howItWorks:
      "A dashboard shows total utility costs incurred by the property owner versus total utility charges recovered from tenants. Recovery percentage is calculated per property and per utility type. Under-recovery alerts flag properties where the cost recovery model needs adjustment.",
    userType: "Finance Manager, Asset Manager",
    isUSP: true,
  },
  {
    id: 56,
    module: "Maintenance and AMC Management",
    feature: "Tenant-raised Maintenance Ticketing",
    howItWorks:
      "Tenants raise maintenance requests through a structured form (or tenant portal when available): property, unit, issue description, category, severity, and photos. The ticket is assigned a unique ID, timestamp, and SLA deadline. The Facility Manager receives instant notification of new tickets.",
    userType: "All Tenants, Facility Manager",
    isUSP: false,
  },
  {
    id: 57,
    module: "Maintenance and AMC Management",
    feature: "AMC Contract Management",
    howItWorks:
      "All Annual Maintenance Contracts for each property (lift, HVAC, fire suppression, electrical, plumbing, pest control, DG sets, landscaping) are stored with vendor name, contract value, start date, end date, scope of services, SLA terms, and penalty clauses.",
    userType: "Facility Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 58,
    module: "Maintenance and AMC Management",
    feature: "Vendor Performance Scoring",
    howItWorks:
      "After each service visit, the Facility Manager rates the vendor on response time, quality of work, adherence to SLA, and professionalism (1-5 scale). Aggregate scores are shown on the vendor profile. Vendors consistently scoring below 3 are flagged for contract review.",
    userType: "Facility Manager, Asset Manager",
    isUSP: true,
  },
  {
    id: 59,
    module: "Maintenance and AMC Management",
    feature: "Maintenance Cost Recovery from Tenants",
    howItWorks:
      "Maintenance work completed on a tenant's unit can be flagged as tenant-billable (per lease terms) or landlord-responsible. Tenant-billable maintenance costs are automatically added to the tenant's next invoice. This ensures cost recovery for tenant-caused damages and unit-specific repairs.",
    userType: "Facility Manager, Finance Manager",
    isUSP: true,
  },
  {
    id: 60,
    module: "Maintenance and AMC Management",
    feature: "Service Scheduling and Calendar",
    howItWorks:
      "Preventive maintenance visits scheduled under each AMC are logged in a calendar view by property and service type. The Facility Manager sees which services are due this week, this month, or next month across all properties. Missed service visits are flagged in red.",
    userType: "Facility Manager",
    isUSP: false,
  },
  {
    id: 61,
    module: "Maintenance and AMC Management",
    feature: "Priority and SLA Management",
    howItWorks:
      "Each maintenance ticket is assigned a priority level: Critical (4-hour SLA), High (24-hour SLA), Medium (72-hour SLA), or Low (7-day SLA). Priority drives SLA timers and escalation rules. SLA breach triggers automatic escalation to the Asset Manager.",
    userType: "Facility Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 62,
    module: "Maintenance and AMC Management",
    feature: "AMC Renewal Tracking",
    howItWorks:
      "AMC contracts approaching end date within 60 days trigger automated alerts. The renewal pipeline shows contracts by status (Active, Due for Renewal, Renewed, Lapsed). Renewal records are linked to the original contract. This prevents operational failures from AMC lapse.",
    userType: "Facility Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 63,
    module: "Security Deposit Management (Received)",
    feature: "Deposit Receipt and Registry",
    howItWorks:
      "Every outgoing lease record carries a linked security deposit entry showing deposit amount received, date collected, mode of payment (cheque, NEFT, bank guarantee), bank details, and receipt confirmation. The Finance Manager uses this to maintain a complete deposit register for balance sheet reporting.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 64,
    module: "Security Deposit Management (Received)",
    feature: "Deposit Refund Scheduling",
    howItWorks:
      "When a lease terminates, the system auto-generates a deposit refund schedule based on lease terms (typically within 30-90 days of move-out). Deductions for damages, unpaid rent, or restoration costs are calculated and documented. The net refund amount and timeline are communicated to the tenant.",
    userType: "Finance Manager, Leasing Manager",
    isUSP: false,
  },
  {
    id: 65,
    module: "Security Deposit Management (Received)",
    feature: "Damage Deduction Calculation",
    howItWorks:
      "During tenant move-out, the Facility Manager conducts a property inspection and logs any damages against the deposit. Each damage item has a description, photo, estimated repair cost, and responsible party. The total deduction is calculated and deducted from the security deposit with a detailed statement provided to the tenant.",
    userType: "Facility Manager, Finance Manager",
    isUSP: false,
  },
  {
    id: 66,
    module: "Security Deposit Management (Received)",
    feature: "Deposit Liability Reporting",
    howItWorks:
      "An analytics view shows total deposits held from all tenants, deposits by property, deposits nearing refund date (leases expiring within 90 days), and deposit aging. The CFO uses this for balance sheet reporting and cash flow planning for upcoming refund obligations.",
    userType: "CFO, Finance Manager",
    isUSP: false,
  },
  {
    id: 67,
    module: "Tenant Self-Service Portal",
    feature: "Tenant Lease and Document Access",
    howItWorks:
      "Tenants log into a web or mobile portal to view their active lease details, download lease agreement copies, view rent and CAM invoices, and access payment history. This reduces the administrative burden on the property management team for routine tenant queries.",
    userType: "Tenants, Leasing Manager",
    isUSP: false,
  },
  {
    id: 68,
    module: "Tenant Self-Service Portal",
    feature: "Online Rent Payment",
    howItWorks:
      "Tenants can pay rent, CAM, and utility invoices directly through the portal via payment gateway (UPI, NEFT, credit card). Payment is auto-reconciled against the invoice. Payment confirmation is sent to both tenant and the Finance Manager.",
    userType: "Tenants, Finance Manager",
    isUSP: false,
  },
  {
    id: 69,
    module: "Tenant Self-Service Portal",
    feature: "Maintenance Request Submission",
    howItWorks:
      "Tenants raise and track maintenance requests through the portal with issue description, category, photos, and severity. Real-time status updates are visible to the tenant. This replaces email and phone-based maintenance coordination.",
    userType: "Tenants, Facility Manager",
    isUSP: false,
  },
  {
    id: 70,
    module: "Masters and Configuration Engine",
    feature: "Master Data Management",
    howItWorks:
      "The Masters module is the foundation of the platform. Administrators configure: Property master, Unit master, Tenant master, Vendor master, Document type master, Expense category master, and Utility tariff master. All downstream modules auto-populate from masters.",
    userType: "System Administrator, Asset Manager",
    isUSP: true,
  },
  {
    id: 71,
    module: "Masters and Configuration Engine",
    feature: "Location Hierarchy",
    howItWorks:
      "A six-level geographic hierarchy is configured: Country, State, Region, Zone, City, and Circle. Every property, lease, income, and expense record is tagged to this hierarchy. The Portfolio Manager uses the hierarchy to filter and aggregate any report at any geographic level.",
    userType: "System Administrator, Portfolio Manager",
    isUSP: true,
  },
  {
    id: 72,
    module: "Masters and Configuration Engine",
    feature: "Custom Fields for Leases and Properties",
    howItWorks:
      "Administrators can add organisation-specific data fields to lease and property records: for example, Revenue Centre Code, Tenant Industry Segment, Property Grade (A/B/C), or RERA Registration Number. Custom fields appear in forms, filters, and exports.",
    userType: "System Administrator, Asset Manager",
    isUSP: true,
  },
  {
    id: 73,
    module: "Masters and Configuration Engine",
    feature: "Role-Based Access Control",
    howItWorks:
      "User access is governed by roles: Super Admin, Asset Manager, Leasing Manager, Finance Manager, Facility Manager, Compliance Officer, and Read-Only User. Each role has defined permissions controlling module visibility, record editing, and report export. Property-level access scoping ensures users see only their assigned properties.",
    userType: "System Administrator, IT Manager",
    isUSP: false,
  },
  {
    id: 74,
    module: "Masters and Configuration Engine",
    feature: "Multi-Entity and Multi-Client Configuration",
    howItWorks:
      "For property management companies managing portfolios for multiple property owners, the system supports multi-client configuration with separate reporting, invoicing, and branding per client. Consolidated cross-client dashboards are available for the management company. White-label tenant portal per client is configurable.",
    userType: "System Administrator, Portfolio Manager",
    isUSP: true,
  },
  {
    id: 75,
    module: "Notifications and Alerts",
    feature: "Lease Expiry and Vacancy Alerts",
    howItWorks:
      "Automated notifications at 90, 60, 30, and 7 days before lease expiry. When a lease expires without renewal, the unit is auto-marked as vacant and a vacancy alert is sent to the Leasing Manager with unit details and last rent for re-marketing.",
    userType: "Leasing Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 76,
    module: "Notifications and Alerts",
    feature: "Rent Collection and Overdue Alerts",
    howItWorks:
      "Automated reminders to tenants 5 and 2 days before rent due date. For overdue rents, daily reminders are sent until payment is recorded. The Finance Manager receives a daily summary of all overdue receivables. Escalation alerts are sent for receivables overdue beyond 30 days.",
    userType: "Finance Manager, CFO",
    isUSP: false,
  },
  {
    id: 77,
    module: "Notifications and Alerts",
    feature: "Compliance and Maintenance Alerts",
    howItWorks:
      "Compliance document expiry alerts at 90, 60, and 30 days. AMC renewal alerts at 60 days. Maintenance SLA breach alerts in real time. The Asset Manager receives a weekly digest of all critical alerts across the portfolio.",
    userType: "Compliance Officer, Facility Manager, Asset Manager",
    isUSP: false,
  },
  {
    id: 78,
    module: "Settings and User Management",
    feature: "User Profiles and Permission Management",
    howItWorks:
      "Each system user has a profile with name, role, department, email, phone, and assigned properties. The Super Admin creates, edits, deactivates, or deletes users. Granular permission settings control module-level, record-level, and action-level access. Bulk user upload from CSV is supported.",
    userType: "System Administrator",
    isUSP: false,
  },
  {
    id: 79,
    module: "Settings and User Management",
    feature: "Data Sovereignty and On-Premise Deployment",
    howItWorks:
      "The platform supports full on-premise deployment on the client's own servers, private cloud, or hybrid cloud. Data never leaves the client's infrastructure. This is critical for regulated property owners (government, REIT, institutional investors) and is a key differentiator — the only India-built lessor platform offering this.",
    userType: "IT Manager, Property Owner, CFO",
    isUSP: true,
  },
];

// ==================== TAB 3: MARKET ANALYSIS ====================

export const targetAudiences: TargetAudience[] = [
  {
    segment: "Corporate Real Estate Teams at Large Enterprises",
    demographics:
      "100+ employee organisations leasing 20 to 500+ commercial properties. Head of Real Estate aged 35 to 55, reporting to CFO or COO.",
    industryProfile:
      "India-based multinationals, BFSI firms, IT/ITeS companies, FMCG manufacturers. Indian and global corporations with multi-city commercial real estate portfolios covering offices, satellite offices, warehouses, and retail counters. Annual lease spend of Rs 5 crore to Rs 500 crore.",
    painPoints: [
      "No single system for lease visibility across all cities",
      "Rent escalation deadlines missed causing overpayment",
      "IND AS 116 compliance manual and error-prone",
    ],
    unsolved:
      "Auditors flag lease accounting non-compliance. CFO cannot certify lease liability for quarterly reporting. Renewal negotiations fail without historical data, costing 15-25% more.",
    goodEnough:
      "Multiple Excel files plus a shared drive for scanned lease PDFs. Monthly reminders via Outlook calendar. Finance team manually consolidates data for audits.",
    urgency:
      "High - IND AS 116 mandatory since April 2019, GST audits increasing, CFO pressure for real-time visibility.",
    buyerTitle: "Head of Real Estate / VP Corporate Real Estate",
  },
  {
    segment: "Retail Chain Operators (100+ Stores)",
    demographics:
      "Retail company managing 100 to 2000 store locations. Real Estate Manager aged 30 to 50 coordinating with store operations and finance. High-frequency lease renewals, short lease terms, percentage rent clauses.",
    industryProfile:
      "Fashion, grocery, pharmacy, QSR, consumer electronics, and FMCG retail chains expanding across Tier 1, 2, and 3 cities in India. Annual lease spend Rs 50 crore to Rs 5000 crore.",
    painPoints: [
      "Tracking 200+ lease renewal dates simultaneously",
      "Percentage rent and CAM reconciliation done manually",
      "No visibility into store-level rent-to-revenue ratio",
    ],
    unsolved:
      "Missed renewal windows lead to forced store closure or unfavourable renewal terms. Overpaid CAM and percentage rent inflate store P&L. Finance cannot close month-end without chasing regional teams.",
    goodEnough:
      "Spreadsheet with lease tracker maintained by a dedicated lease admin team of 5 to 15 people. Renewal reminders via calendar. CAM reconciliation in Excel annually.",
    urgency:
      "Very High - store expansion programs need fast lease onboarding. CFO requires store-level lease cost visibility as a percentage of revenue.",
    buyerTitle: "Head of Real Estate / Director Property",
  },
  {
    segment: "Property Management Companies (Landlord Side)",
    demographics:
      "Property management firms or REITs managing 50 to 500+ commercial or residential properties on behalf of property owners. Portfolio Manager aged 28 to 48 overseeing tenant relationships, rent collection, and compliance.",
    industryProfile:
      "Commercial property management companies, REITs, co-working operators, and real estate funds in India and Southeast Asia. AUM of Rs 100 crore to Rs 5000 crore in managed assets.",
    painPoints: [
      "No unified system to track rent collection across all properties",
      "Compliance certificate management done via paper files",
      "Maintenance vendor performance not measurable",
    ],
    unsolved:
      "Rent overdue from tenants compounds into bad debt. Compliance lapses result in regulatory fines or forced property closure. Tenant dissatisfaction from poor maintenance response triggers early exits.",
    goodEnough:
      "Spreadsheet-based rent register. Physical files for compliance documents. WhatsApp groups for maintenance coordination.",
    urgency:
      "High - REIT listing requirements, institutional investor reporting, and tenant SLA commitments drive urgency for professionalised management.",
    buyerTitle: "Portfolio Manager / CEO",
  },
  {
    segment: "Government and PSU Organisations",
    demographics:
      "Central and state government departments, PSUs, and public sector banks leasing office space across India. Estate Officer or Administrative Officer managing leases under strict audit and compliance requirements.",
    industryProfile:
      "Central government ministries, state government departments, PSUs (ONGC, SAIL, NTPC, SBI, PNB), and semi-government bodies managing 50 to 500+ leased premises.",
    painPoints: [
      "No digital record of lease agreements and terms",
      "Compliance audits require document retrieval from physical files",
      "Rent payment delays cause vendor disputes",
    ],
    unsolved:
      "CAG audit observations for non-compliance with lease terms. Overpayment of rent due to unchecked escalations. Security deposit disputes at lease exit.",
    goodEnough:
      "Physical lease agreement files maintained in estate section. Excel register for property records. Rent payments triggered by manual requisition.",
    urgency:
      "Moderate to High - GoI digital push, CAG audit pressure, and NeSDA compliance requirements creating digitisation mandates.",
    buyerTitle: "Estate Officer / Administrative Officer / CFO",
  },
];

// PART B - COMPANY-LEVEL PAIN POINTS (India and Global)
export const companyPainPoints: CompanyPainPoint[] = [
  {
    companyType: "Indian Enterprise, 500+ employees, 50+ leased properties",
    painPoint1:
      "Plant exceeded its capacity on energy costs, idle for rest of yr training, resulting in overpayment of Rs 75-80 lakh per property per year.",
    painPoint2:
      "IND AS 116 lease accounting entries prepared manually by Finance team, resulting in a 2-3x audit rework cycle.",
    painPoint3:
      "Compliance documents (Fire NOC, OCC, trade licence) embedded in a property inspector's laptop and a manager's shared drive to retrieve the issues.",
    costRisk:
      "Finance overpayment risk Rs 25-100 lakh per property. IND AS 116 audit restatement risk Rs 5-50 lakh for compliance audits. Quit frustration risk.",
  },
  {
    companyType: "Retail Chain Operator, 100+ stores, short lease terms",
    painPoint1:
      "Store-level rent-to-revenue ratio not tracked, hiding unprofitable store locations.",
    painPoint2:
      "Lease renewal negotiations for 30 to 50 stores happening simultaneously with no structured pipeline.",
    painPoint3:
      "CAM and utility reimbursement charges paid without verification against actual, overpaying 10-15% on average.",
    costRisk:
      "Overdue rent and CAM inflating store P&L by Rs 25-50 lakh annually. Forced store closures, expired leases at incomplete renewal pipeline. Audit risk from unverified CAM.",
  },
  {
    companyType: "Commercial Property Management Firm, 50+ managed properties",
    painPoint1:
      "Tenant rent collection tracked in a separate system with no linkage to lease agreement terms, leading to undercharging when rent escalation should apply.",
    painPoint2:
      "Maintenance vendor performance not tracked without performance tracking, preventing competitive vendor consolidation and SLA enforcement.",
    painPoint3:
      "Compliance renewal tracking done by one person with no backup, creating a single-point-of-failure risk for the entire portfolio.",
    costRisk:
      "Tenant disputes over billing, vendor over-expenditure, and compliance fines. Risk continuously building to 3-5% of portfolio value.",
  },
  {
    companyType: "Global Multinational, India Subsidiary, 25+ office locations",
    painPoint1:
      "India lease data maintained separately from global lease system (Yardi or MRI) because global platform does not support India-specific or India-specific deployments.",
    painPoint2:
      "India-specific compliance requirements (FSSAI, Shop & Act, local municipal) handled ad hoc by local admin teams.",
    painPoint3:
      "Data sovereignty concerns prevent Indian subsidiary from using Global Data Lessor platform, causing India operations to run on Excel. MoU and GDPR.",
    costRisk:
      "Regulatory non-compliance across India offices. Data residency violation risks. Disconnected India operations from Global HQ. Wasted resources.",
  },
];

// SECTION 2 - COMPETITOR MAPPING (10 Competitors, India and Global)
export const marketCompetitors: MarketCompetitor[] = [
  {
    competitor: "Yardi Voyager (Global)",
    primaryTargetCustomer:
      "Large commercial REITs, institutional property managers, large corporates with complex portfolios. India presence growing via Yardi Centre for corporate occupiers.",
    pricingModel:
      "Custom enterprise quote. India estimated Rs 15-40 lakh per year for 50-100 properties. Global USD 20,000-100,000+ per year.",
    howBuyersDiscover:
      "Direct enterprise sales, industry events (CRDAI, GR Real Estate), word of mouth among CFO community.",
    strongestFeatures:
      "End-to-end property management and accounting, deep CAM reconciliation, mobile app with 40+ years market presence.",
    keyWeaknesses:
      "Customary high implementation cost and complexity (6-12 months). Data stored on Yardi cloud — no data sovereignty. Not India-specific (Fire NOC, Shop Act) support.",
    marketGap:
      "India-compliant lease management with local data sovereignty and India-first pricing.",
    recentInnovation:
      "Launched Yardi Acquisition Manager in Sale 2025 for automated leasing workflows. Made strength-based enterprise play.",
  },
  {
    competitor: "MRI Software (Global)",
    primaryTargetCustomer:
      "Commercial property owners, REITs, corporate real estate occupiers managing complex multi-asset portfolios. Present in India via channel partners.",
    pricingModel:
      "Custom quote. Starts USD 10,000/year for base module. Full implementation to USD 25,000-8,000/year. India pricing Rs 12-25 (Formerly), assume.",
    howBuyersDiscover:
      "Enterprise sales, partner channel, industry associations/conventions (CII, RICS), Formerly assume.",
    strongestFeatures:
      "Highly customisable open platform, strong API integrations, complete contractual lease compliance accounting with CAM, percentage rent.",
    keyWeaknesses:
      "High implementation complexity. Requires dedicated IT team for configuration. Data stored on their cloud. Slow product releases.",
    marketGap:
      "Mid-market India product with local data sovereignty and India-first pricing.",
    recentInnovation:
      "Launched MRI AI companion for Flyer in October 2025 for automated property insights. AI-based lease abstraction reduces due diligence effort.",
  },
  {
    competitor: "Tango Analytics (Global)",
    primaryTargetCustomer:
      "Mid-market to enterprise retail chains and corporate real estate occupiers. Strong in retail lease administration and portfolio optimisation.",
    pricingModel:
      "Custom enterprise quote. Estimated USD 15,000-50,000/year based on lease count, conference (ICSC, NATCOD), word of mouth. Estimated Rs 12-40 lakh/year.",
    howBuyersDiscover:
      "Direct sales to Head of Real Estate at retail chains, conference (ICSC, NATCOD), word of mouth.",
    strongestFeatures:
      "Retail-specific tools (percentage rent, forecasting, net effective rent), portfolio transaction management, location analytics.",
    keyWeaknesses:
      "Complex UX noted poorly by new users (G2 reviews). No data sovereignty. Not India-specific. Tango pricing and complexity.",
    marketGap:
      "Retail chains in India growing to 200+ stores who need value pricing and India compliance features versus competitor tools.",
    recentInnovation:
      "Acquired AI-driven lease abstraction in 2024 to automate lease data extraction from PDFs.",
  },
  {
    competitor: "Visual Lease (Global)",
    primaryTargetCustomer:
      "Mid-market to large enterprises needing ASC 842 and IFRS 16 compliance. Focus on corporate occupiers, not property managers.",
    pricingModel:
      "USD 12,000-5,000/year for small portfolios, USD 15,000-45,000/year for enterprise. India pricing not officially listed.",
    howBuyersDiscover:
      "SEO strategy ranking for 'lease accounting software', content marketing, G2 and Capterra reviews.",
    strongestFeatures:
      "Strong ASC 842 and IFRS 16 compliance, G2 ERP integrations. Clean UI. 20+ years lease accounting experience.",
    keyWeaknesses:
      "Finance-or-accounting-only focus. Not operational lease management, not operational lease platform. AMC, utilities module. Data on their cloud.",
    marketGap:
      "India companies under IND AS needing full operational + accounting lease platform with data sovereignty.",
    recentInnovation:
      "Recently launched AI-Powered Lease Abstraction for automated data extraction and IFRS 16 validation workflows.",
  },
  {
    competitor: "Nakisa Lease Administration (Global)",
    primaryTargetCustomer:
      "Large enterprises (1000+ leases) with SAP or Oracle ERP needing IFRS 16 and ASC 842 compliance with native ERP integration.",
    pricingModel:
      "Enterprise pricing, USD 30,000-150,000/year. India pricing estimated Rs 25-125 lakh/year for large enterprise sales to Fortune 500.",
    howBuyersDiscover:
      "SAP and Oracle partner conferences, enterprise mutual introductions, direct enterprise sales to Fortune 500.",
    strongestFeatures:
      "An unequalled lease abstraction, native SAP and Oracle integration, complete reporting across IFRS 16 and ASC 842.",
    keyWeaknesses:
      "Enterprise pricing only. No customisation for Indian compliance. No operational features (AMC, utilities). Requires existing SAP or Oracle environment.",
    marketGap:
      "India enterprise lease management beyond accounting — operations, maintenance, compliance.",
    recentInnovation:
      "Launched AI lease abstraction and automated IFRS 16 journals in 2025.",
  },
  {
    competitor: "Hubler (India)",
    primaryTargetCustomer:
      "Indian SMEs and mid-market organisations starting lease management. Approx Rs 5,000/month. Full features at Rs 10,000-15,000/month. SED, interior startup focusing on coworking and medium leases and real estate management.",
    pricingModel:
      "Starts USD 1 lakh/month / approx Rs 5,000/month. Full features at Rs 10,000-15,000/month.",
    howBuyersDiscover:
      "Indian SaaS directories (SaaSworthy, SoftwareSuggest), SEO, Interior startup community. A1, SEO, interior startup accelerators.",
    strongestFeatures:
      "India-built product, affordable INR pricing. A simple lease module for small-medium operations.",
    keyWeaknesses:
      "No compliance modules (no AMC, no utilities). Limited compliance scope. Small dev team — slow feature velocity. No on-premise deployment.",
    marketGap:
      "Indian SME market and mid-tier enterprises needing compliance + operations + lease management in a single affordable package.",
    recentInnovation:
      "Built an AI enterprise lease management add-on for mid-tier clients in 2025.",
  },
  {
    competitor: "LeaseAccelerator by LeaseQuery/Costar (Global)",
    primaryTargetCustomer:
      "Enterprise corporate occupiers managing large real estate and equipment leases primarily for ASC 842/IFRS 16 compliance. CFO-driven buyer in North America and Europe.",
    pricingModel:
      "Enterprise pricing, USD 10,000-100,000+/year depending on lease count. High implementation cost.",
    howBuyersDiscover:
      "Direct enterprise sales, BigFour partnership (Deloitte), partner enablement. Strong in accounting-only.",
    strongestFeatures:
      "Best-in-class ASC 842 compliance, lease data, cost flow optimisation analytics.",
    keyWeaknesses:
      "No India presence. No India compliance specific features. No India pricing. India-specific compliance not a factor.",
    marketGap:
      "Indian enterprises managing real estate leases who need India-specific compliance and on-premise options.",
    recentInnovation:
      "Acquired by CoStar in 2024. Expanding into integrated lease and real estate analytics.",
  },
  {
    competitor: "AppFolio / Property Manager (Global)",
    primaryTargetCustomer:
      "Residential property managers and small commercial operations. Strong in US market. USD 250/month for small portfolios.",
    pricingModel: "Starts USD 280-1,500/month. SMB to mid-market.",
    howBuyersDiscover:
      "Strong US SEO, G2 and Capterra rankings. Not mid-market direct sales expert communities.",
    strongestFeatures:
      "Outstanding tools in US. A strong portal. Best-in-class residential tenant and listing management.",
    keyWeaknesses:
      "Focused on US residential product. Not focused on commercial lease operations. Not India pricing. Not for commercial lease management.",
    marketGap:
      "India commercial property management companies who need multi-tenant, commercial-grade operations and India compliance.",
    recentInnovation:
      "Launched AI leasing assistant for automated tenant screening and lease recommendations.",
  },
  {
    competitor: "Re-Leased (Global, NZ/UK)",
    primaryTargetCustomer:
      "Commercial property managers and mid-market landlords. Focused on cloud-native commercial lease administration.",
    pricingModel:
      "Starts USD 250-800/month for small portfolios. Enterprise pricing available.",
    howBuyersDiscover:
      "Strong ANZ and UK SEO, accounting software marketplace (Xero), deep Xero integration. Content marketing for commercial landlords.",
    strongestFeatures:
      "Advanced lease abstraction (Conduit), deep Xero integration. Focus on commercial lease management.",
    keyWeaknesses:
      "No India-specific compliance. Not a primary market. No data sovereignty.",
    marketGap:
      "Not currently relevant in India. India commercial property managers who use accounting software (Tally, SAP) would need Lockated for Re-Leased-level features but India-first.",
    recentInnovation:
      "Launched Conduit AI for automated lease abstraction and portfolio analytics in 2025.",
  },
  {
    competitor: "Buildium / RealPage (Global)",
    primaryTargetCustomer:
      "Residential property managers, HOA managers, and small commercial operators. Enterprise parent RealPage targets large multifamily.",
    pricingModel: "USD 55-400/month. SMB pricing.",
    howBuyersDiscover:
      "US residential property management SEO. Content marketing and community events.",
    strongestFeatures:
      "USA residential property management market leader for residential.",
    keyWeaknesses:
      "Not designed for Indian commercial real estate. No India compliance features.",
    marketGap:
      "India commercial property management operations needing a residential-grade platform for commercial.",
    recentInnovation:
      "RealPage launched AI rent optimisation. Buildium launched online maintenance workflows for residential property managers.",
  },
];

// COMPETITOR SUMMARY — LESSEE
export const competitorSummaryLessee: string =
  "Competitor landscape: Yardi is the only India-local enterprise-level lease management product in the SMB to mid-market segment. However, Hubler does not serve large-scale operations (50+ properties) and has no operations modules. Lockated directly targets the same India segment. Yardi/MRI are enterprise-grade but over-priced and cloud-only. Secondary displacement target: Tango Analytics for retail chain operators in India, where Tango's complexity, cost, and lack of India compliance leave a wide gap that Lockated fills with local pricing and all India-specific features.";

// LESSOR PERSPECTIVE - SECTION 1: TARGET AUDIENCE
export const lessorTargetAudiences: LessorTargetAudience[] = [
  {
    segment: "Commercial Real Estate Developers and Owners",
    whoTheyAre:
      "Indian real estate developers and family offices who own and lease out office buildings, retail spaces, industrial parks, and warehouses across multiple cities.",
    sizeOfSegment:
      "2,000+ companies managing 50+ leased properties in India. Estimated 400+ companies with 200+ properties.",
    primaryPainPoint:
      "No real-time view of rental income, occupancy rates, or compliance status across the portfolio. Renewals managed manually via email. CAM billing done offline.",
    whatTheyNeedMost:
      "Portfolio dashboard with rental income tracking, occupancy tracking, automated billing, and compliance management in one platform.",
    decisionMaker: "Head of Asset Management, CFO",
    budgetRange:
      "Rs 8-25 lakh/year for full portfolio management in 5 locations.",
    priority: "P1 — Largest segment by portfolio size and budget.",
  },
  {
    segment: "Property Management Companies",
    whoTheyAre:
      "Professional property management firms managing commercial, residential, or mixed-use properties on behalf of multiple landlord clients. Also includes in-house property management arms of large developers.",
    sizeOfSegment:
      "500+ professional property management companies in India managing 100+ properties. Growing segment due to REIT-driven institutional ownership.",
    primaryPainPoint:
      "Managing multiple vendor clients on a single platform. Tenant billing, collections, and maintenance reporting for multiple companies, all calculated separately per client.",
    whatTheyNeedMost:
      "Multi-client portfolio management platform with separate reporting, consolidated views, and automatic lease status escalation.",
    decisionMaker: "Head of Property Management, MD / CEO",
    budgetRange: "Rs 5-20 lakh/year depending on portfolio size.",
    priority: "P1 — Fastest-growing lease management buyer segment.",
  },
  {
    segment:
      "Real Estate Investment Trusts (REITs) and Institutional Landlords",
    whoTheyAre:
      "SEBI-registered REITs and institutional real estate investors (PE funds, sovereign wealth funds, family offices) owning large Grade-A office and retail portfolios.",
    sizeOfSegment:
      "4 listed REITs in India (Brookfield, Embassy, Mindspace, Nexus). Major Direct, Blackstone-Board Assets). Growing pipeline of pre-REIT portfolio structures.",
    primaryPainPoint:
      "Investor-grade reporting on NOI, occupancy, rent roll. Compliance documentation for SEBI disclosures. Lessor-side IFRS 16 / IND AS 17 accounting journal generation.",
    whatTheyNeedMost:
      "Institutional-grade portfolio analytics, IFRS 16 reporting, lease accounting, SEBI-compliant disclosures to investors, and data sovereignty for sensitive financial data.",
    decisionMaker: "CFO, Head of Asset Management, REIT Manager",
    budgetRange: "Rs 50-100 lakh/year for full institutional-grade platform.",
    priority:
      "P2 — High ACV, longer sales cycle. Requires IND AS 17 module (in development).",
  },
  {
    segment: "Industrial and Warehouse Operators",
    whoTheyAre:
      "Companies that develop and lease industrial facilities — warehouses, logistics parks, manufacturing facilities. Includes captive industrial parks.",
    sizeOfSegment:
      "200+ industrial park operators with 50+ tenants each. Sector growth at 25%+ CAGR driven by manufacturing and e-commerce logistics.",
    primaryPainPoint:
      "Tracking multiple tenant leases in industrial parks with varying lease structures. Utility billing per tenant based on meter readings. Compliance for factory licences and NOCs and maintenance and SLA management.",
    whatTheyNeedMost:
      "Integrated platform combining lease management, utility billing to tenants, compliance for factory licences and NOCs, and maintenance SLA management.",
    decisionMaker: "Head of Asset Management, Head of Operations",
    budgetRange: "Rs 5-18 lakh/year.",
    priority: "P2 — High compliance complexity, strong platform fit.",
  },
];

// LESSOR PERSPECTIVE - SECTION 2: COMPETITOR MAPPING
export const lessorCompetitors: LessorCompetitor[] = [
  {
    competitor: "Yardi Systems",
    lessorUseCaseCoverage:
      "Full lessor coverage — one of their primary use cases. Yardi Voyager is the global standard for commercial residential and property managers.",
    keyLessorFeatures:
      "Rent roll management, CAM reconciliation, tenant billing, receivables tracking, property accounting (General Ledger), lease accounting.",
    pricing:
      "USD 15,000-400,000/year. Enterprise SaaS. Preference and size USD 80,000-500,000. High TCD.",
    lessorMarketPosition:
      "Global leader for institutional landlords, REITs, and large property management companies. Present in USA, UK, Australia.",
    indiaLessorFit:
      "Not India-first. No key compliance (local GST billing, municipality tax tracker). India-specific data not a factor. Limited India support.",
    ourAdvantage:
      "Lockated offers on-premise data sovereignty, India-first pricing and support, GST-compliant billing and invoicing, India compliance (GST invoicing, local municipality), at a fraction of the cost.",
    threatLevel:
      "High — if Yardi targets India aggressively with local pricing.",
  },
  {
    competitor: "MRI Software",
    lessorUseCaseCoverage:
      "Strong lessor capability. MRI is a direct competitor to Yardi for commercial property management and is offered as of lease accounting.",
    keyLessorFeatures:
      "Commercial lease management (lease), tenant billing, CAM reconciliation, maintenance and property accounting, invoice recording.",
    pricing:
      "USD 12,000-300,000/year. Enterprise SaaS. High implementation cost.",
    lessorMarketPosition:
      "Strong in USA, UK, Australia for commercial property management to corporates and institutional buyers. RFP driven.",
    indiaLessorFit:
      "No India presence. No India compliance or local pricing. India specific data not a factor.",
    ourAdvantage:
      "Same advantages as vs Yardi — India-first, on-premise, GST-compliant invoicing, local support at a fraction of the cost.",
    threatLevel: "Medium — no active India push currently.",
  },
  {
    competitor: "Nakisa Lease Administration",
    lessorUseCaseCoverage:
      "Primarily ASC 842 / IFRS 16 compliance for leases. Limited native lessor property management functionality.",
    keyLessorFeatures:
      "Lessor-side IFRS 16 accounting, net investment in lease calculation, Limited operational property management.",
    pricing:
      "USD 50,000-200,000/year. Primarily a finance and accounting compliance tool.",
    lessorMarketPosition:
      "CFO and finance team focused. Does not cover tenant operations. More of a property management or operations tool.",
    indiaLessorFit:
      "Not a property management tool. Limited covers full tenant operations, operations (leasing + billing + maintenance + compliance). Nakisa does not cover full lease management operations.",
    ourAdvantage:
      "Lockated covers the full lessor operations (leasing + billing + maintenance + compliance) that Nakisa does not. Different category.",
    threatLevel: "Low — different category of tool entirely.",
  },
  {
    competitor: "Tango",
    lessorUseCaseCoverage:
      "Primarily a lease/occupancy-focused platform. Lessor functionality is secondary and limited. A dedicated lessor platform.",
    keyLessorFeatures:
      "Basic property management features. Not tenant billing, maintenance, or operations.",
    pricing: "USD 20,000-100,000/year.",
    lessorMarketPosition:
      "Primarily used by corporate occupiers, not landlords or property managers.",
    indiaLessorFit: "Not positioned for the Indian lessor market.",
    ourAdvantage:
      "Lockated is purpose-built for both. Low threat since Tango does not compete directly. Tango does not compete in India for lessor.",
    threatLevel: "Low.",
  },
  {
    competitor: "Visual Lease",
    lessorUseCaseCoverage:
      "Primarily IFRS 16 / ASC 842 lease compliance. Very limited lessor operational functionality.",
    keyLessorFeatures:
      "Lessor-side IFRS 16 accounting. No tenant billing, maintenance, or operations.",
    pricing: "USD 10,000-100,000/year.",
    lessorMarketPosition:
      "Finance and accounting compliance only. Not operational lessor features. No operational.",
    indiaLessorFit:
      "Not positioned for India. No operational lessor features. Visual Lease is an accounting-only compliance tool.",
    ourAdvantage:
      "Lockated covers the full lessor operations stack. Visual Lease is accounting-only compliance tool.",
    threatLevel: "Low.",
  },
  {
    competitor: "Buildium",
    lessorUseCaseCoverage:
      "Primarily residential property management. Some commercial features but not commercial-grade. lease management.",
    keyLessorFeatures:
      "Tenant portal, billing, maintenance requests. Primarily lease management for residential. SMB pricing.",
    pricing: "USD 150-400/month. SMB pricing.",
    lessorMarketPosition:
      "USA residential property management market. Not commercial.",
    indiaLessorFit:
      "Not designed for Indian commercial real estate. No India compliance.",
    ourAdvantage:
      "Lockated is a commercial real estate platform focused, India-compliant. Buildium is residential and US-only.",
    threatLevel: "Low.",
  },
  {
    competitor: "AppFolio",
    lessorUseCaseCoverage:
      "Primarily USA residential property management. Growing into commercial. Primarily residential.",
    keyLessorFeatures:
      "Lease management, tenant billing, maintenance. Primarily residential.",
    pricing: "USD 280-1,500/month. SMB to mid-market.",
    lessorMarketPosition: "USA residential landlords.",
    indiaLessorFit: "No India presence or compliance.",
    ourAdvantage: "Not a competitor in India.",
    threatLevel: "Low.",
  },
  {
    competitor: "Entrata",
    lessorUseCaseCoverage:
      "USA residential property management platform. Not marketed to commercial lessor segment.",
    keyLessorFeatures:
      "Tenant portal, billing, lease management for residential properties.",
    pricing: "USD 1,000-5,000/month.",
    lessorMarketPosition: "USA residential market.",
    indiaLessorFit: "No India presence.",
    ourAdvantage: "Not a competitor.",
    threatLevel: "Low.",
  },
  {
    competitor: "CoStar / RealPage",
    lessorUseCaseCoverage:
      "Market data and analytics platform with some property management features. Not a full lease operations platform.",
    keyLessorFeatures:
      "Market rent data, lease comps, property analytics. Limited operational management.",
    pricing: "USD 10,000-50,000/year for analytics products.",
    lessorMarketPosition:
      "Commercial real estate market intelligence. Not a lease management operations tool.",
    indiaLessorFit: "No India coverage. Analytics only.",
    ourAdvantage:
      "Lockated provides operational lease management, not just data. CoStar is data, not operations.",
    threatLevel: "Low.",
  },
  {
    competitor: "Local Indian Competitors (iSuite, NoBrokerHood, MySociety)",
    lessorUseCaseCoverage:
      "Primarily residential society management. Limited commercial property management capability.",
    keyLessorFeatures:
      "Society billing, visitor management, maintenance for residential apartments.",
    pricing: "Rs 10,000-3,00,000/year. Primarily residential.",
    lessorMarketPosition:
      "Indian residential market. Not commercial real estate.",
    indiaLessorFit:
      "No commercial lease management features. Not suitable for commercial portfolios.",
    ourAdvantage:
      "Lockated is the only India-built commercial lease management platform at this level.",
    threatLevel:
      "Medium — if they pivot to commercial lease management at this tier of pricing.",
  },
];

// COMPETITOR SUMMARY — LESSOR
export const competitorSummaryLessor: string =
  "Lockated is the only India-built commercial lease management platform combining on-premise data sovereignty, GST-compliant tenant billing, full property operations, and India-first pricing for the lessor market. All global competitors (Yardi, MRI) are cloud-only, USD-priced, and not India-compliant. No Indian competitor operates at this level.";

// ==================== TAB 4: FEATURES AND PRICING ====================

export const featureComparisons: FeatureComparison[] = [
  {
    area: "Lease Lifecycle Tracking",
    marketStandard:
      "Active/expired status only. Some tools add expiry date alerts.",
    ourProduct:
      "Active, Expiring, Under Renewal, Renewed, Terminated, Expired with automatic status transitions and pipeline view.",
    status: "AHEAD",
    whyMatters:
      "Proactive renewal pipeline directly reduces cost of missed renewals and reactive renegotiations, estimated 15% rent saving per renewal.",
  },
  {
    area: "Renewal Pipeline Management",
    marketStandard:
      "Most tools send email alerts. No structured negotiation workflow.",
    ourProduct:
      "Kanban-style renewal pipeline with proposed vs current rent comparison, negotiation notes, follow-up scheduling, and exportable comparison report.",
    status: "AHEAD",
    whyMatters:
      "Structured renewal workflow is a primary buying reason for Head of Real Estate at retail chains - directly closes deals.",
  },
  {
    area: "Compliance Document Management",
    marketStandard: "Basic document storage. Some offer expiry tracking.",
    ourProduct:
      "Full compliance repository (Fire NOC, CC, OC, trade licences) with status tracking (Approved, Pending, Rejected), renewal alerts at 90/60/30 days, and ownership assignment.",
    status: "AHEAD",
    whyMatters:
      "Compliance-first design is rare in India lease tools. Compliance-driven buyers (retail chains, PSUs) choose Lockated specifically for this feature.",
  },
  {
    area: "Integrated Operations (AMC + Maintenance + Utilities)",
    marketStandard:
      "Most lease tools have no operations modules. Separate FM software required.",
    ourProduct:
      "AMC contracts, maintenance ticketing, and utility consumption tracking built into the same platform as lease management.",
    status: "AHEAD",
    whyMatters:
      "End-to-end operations coverage is Lockated's primary differentiator. It eliminates the need for a separate FM tool, increasing platform stickiness and ACV.",
  },
  {
    area: "Data Sovereignty",
    marketStandard:
      "All global competitors store data on their own cloud. No option for client-side hosting.",
    ourProduct:
      "All client data stored exclusively on client's own servers or private cloud. No data on Lockated infrastructure.",
    status: "AHEAD",
    whyMatters:
      "Data sovereignty is a mandatory requirement for government, PSU, and regulated financial sector buyers. Without it, these segments are unreachable.",
  },
  {
    area: "Location Hierarchy and Multi-city Portfolio",
    marketStandard: "Basic city and country tagging.",
    ourProduct:
      "6-level hierarchy: Country, State, Region, Zone, City, Circle. Every module filters and aggregates by any level.",
    status: "AHEAD",
    whyMatters:
      "Enables portfolio reporting at granular geography for CFOs and board-level presentations - a key requirement for enterprise buyers.",
  },
  {
    area: "Lease Accounting Compliance (IND AS 116 / IFRS 16)",
    marketStandard:
      "Global tools (Nakisa, Visual Lease, LeaseAccelerator) automate journal entries for ASC 842 and IFRS 16.",
    ourProduct:
      "IND AS 116 compliance is not yet automated. Lease data is structured for manual export to accounting systems.",
    status: "GAP",
    whyMatters:
      "Listed companies in India under IND AS 116 require automated journal generation. This gap loses deals with publicly listed clients.",
  },
  {
    area: "ERP Bi-directional Integration (SAP, Oracle, Tally)",
    marketStandard:
      "Nakisa and LeaseAccelerator offer native SAP and Oracle integration.",
    ourProduct:
      "No native ERP integration yet. Data export to Excel for manual upload to ERP.",
    status: "GAP",
    whyMatters:
      "Large enterprises running SAP or Oracle require seamless data sync. Without this, finance teams duplicate effort and resist adoption.",
  },
  {
    area: "Mobile App for Field Teams",
    marketStandard:
      "Yardi, AppFolio, and MRI offer full mobile apps for property inspections, maintenance, and approvals.",
    ourProduct:
      "Web-responsive design accessible on mobile browsers. Dedicated native app not yet released.",
    status: "GAP",
    whyMatters:
      "Facility managers and property inspection teams need offline-capable mobile access. Absence of native app loses deals with FM-driven buyers.",
  },
  {
    area: "Vendor Performance Scoring",
    marketStandard:
      "Most tools offer basic vendor assignment with no performance tracking.",
    ourProduct:
      "Star rating system (1-5) across 4 dimensions: response time, quality, SLA adherence, professionalism. Aggregated scores on vendor profile.",
    status: "AHEAD",
    whyMatters:
      "Vendor performance analytics is rare in Indian lease tools. Operations Directors cite this as a key reason for selecting Lockated over generic alternatives.",
  },
  {
    area: "Masters and Custom Fields Configuration",
    marketStandard: "Fixed data schema with limited custom fields.",
    ourProduct:
      "Fully configurable custom fields for leases, custom location hierarchy, configurable roles, and branding configuration.",
    status: "AHEAD",
    whyMatters:
      "Enterprise clients require their internal cost centre codes and business unit tags in lease records. Custom fields close deals with structured enterprises.",
  },
  {
    area: "India GST-compliant Invoice Generation",
    marketStandard:
      "Global tools generate invoices in USD. Indian tax compliance not built in.",
    ourProduct:
      "Auto-generates GST-compliant invoices with GSTIN, HSN/SAC codes, TDS deduction fields, and India-format payment terms.",
    status: "AHEAD",
    whyMatters:
      "Non-negotiable for Indian enterprises. Global competitors cannot serve this requirement without customisation, giving Lockated a hard moat in India.",
  },
  {
    area: "Security Deposit Management",
    marketStandard:
      "Basic deposit amount tracking, often in a separate field on the lease record.",
    ourProduct:
      "Full deposit lifecycle tracking with analysis by duration, property, and city. Links to lease expiry alerts for timely refund management.",
    status: "AT PAR",
    whyMatters:
      "Functional parity with what buyers expect. Not a differentiator but removes an objection.",
  },
  {
    area: "Rent Collection Dashboard",
    marketStandard: "Payment status tracking with overdue flags.",
    ourProduct:
      "Comprehensive collection dashboard with payment status by property (Paid, Pending, Partial, Overdue), late fee calculation, and one-click reminder triggers.",
    status: "AT PAR",
    whyMatters:
      "Expected feature. Solid execution increases retention but does not drive new sales on its own.",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    target: "Small businesses with up to 25 properties",
    price: "₹3,000",
    billing: "per property/month",
    features: [
      "Lease creation and repository",
      "Basic lease lifecycle tracking",
      "Tenant and landlord management",
      "Rent collection dashboard",
      "Security deposit tracking",
      "Email support",
    ],
    bestFor: "Small property management firms or growing enterprises",
    recommended: false,
  },
  {
    name: "Professional",
    target: "Mid-market enterprises with 25-100 properties",
    price: "₹2,500",
    billing: "per property/month",
    features: [
      "Everything in Starter",
      "Renewal pipeline with Kanban view",
      "Compliance management with alerts",
      "OPEX and expense management",
      "Utilities management",
      "Custom fields and branding",
      "Priority email and phone support",
    ],
    bestFor: "Retail chains and corporate real estate teams",
    recommended: true,
  },
  {
    name: "Enterprise",
    target: "Large enterprises with 100+ properties",
    price: "Custom",
    billing: "annual contract",
    features: [
      "Everything in Professional",
      "AMC management with vendor scoring",
      "Maintenance ticketing system",
      "Full audit trail and compliance",
      "Location hierarchy (6 levels)",
      "Role-based access control",
      "On-premise deployment option",
      "Dedicated account manager",
      "Custom integrations",
      "SLA-backed support",
    ],
    bestFor: "Conglomerates, PSUs, and large property management companies",
    recommended: false,
  },
];

// SUMMARY - COMPETITIVE POSITION AND PRICING MODEL IMPACT (LESSEE)
export const lesseeCompetitiveSummary: CompetitiveSummaryItem[] = [
  {
    category: "WHERE WE ARE AHEAD OF THE MARKET",
    detail:
      "Data sovereignty (client-hosted), India GST compliance, end-to-end operations (AMC + maintenance + utilities), renewal pipeline with rent comparison, location hierarchy, vendor performance scoring, compliance repository with renewal alerts.",
    implication:
      "These 7 areas are defensible and directly win deals. Lead every demo with data sovereignty and operations coverage. These are non-replicable quickly by global competitors.",
  },
  {
    category: "WHERE WE ARE AT PAR",
    detail:
      "Rent collection tracking, security deposit management, basic lease lifecycle tracking, document storage, tenant and landlord directory.",
    implication:
      "Expected features that must be solid but do not drive purchase decisions. Do not spend demo time here. Ensure these work flawlessly to avoid losing deals on basics.",
  },
  {
    category: "WHERE WE HAVE GAPS THAT WILL COST US DEALS",
    detail:
      "No IND AS 116 automated journal generation, no native SAP/Oracle ERP integration, no native mobile app for field teams.",
    implication:
      "These 3 gaps are losing deals with listed companies, SAP-running enterprises, and FM-heavy buyers. Phase 1 roadmap must address at least one of these within 90 days.",
  },
];

// SECTION 2A - STANDARD PRICING MODELS IN THIS CATEGORY
export const standardPricingModels: StandardPricingModel[] = [
  {
    question: "What pricing models are standard in this category?",
    answer:
      "Per-user per month (most common for SaaS lease tools like Hubler, Visual Lease entry tier), per property per month (used by some enterprise tools for portfolio-scale billing), flat annual fee per contract count (LeaseAccelerator, Nakisa - charges per number of active leases), and custom enterprise quote for complex implementations (Yardi, MRI, Tango). Freemium is not standard in enterprise lease management. Free trials of 14-15 days are common on the SMB end.",
  },
  {
    question: "Which model dominates at entry and mid-market level?",
    answer:
      "Per-user per month pricing dominates at the entry and mid-market level. India SaaS buyers expect transparent per-user pricing in INR. Range: Rs 500 to Rs 2000 per user per month for full-feature access. Minimum annual contract with 10-20 user minimum is standard.",
  },
  {
    question: "Which model dominates at enterprise level?",
    answer:
      "Custom enterprise quotes combining a base platform fee (Rs 5-25 lakh per year) plus per-property or per-user add-on charges. Implementation and onboarding fees (Rs 2-15 lakh) are standard at enterprise level. Multi-year contracts (2-3 years) in exchange for 15-25% pricing discounts are common. For global tools (Yardi, MRI), minimum annual contract is USD 20,000+.",
  },
];

// SECTION 2B - TYPICAL PRICE RANGES (INDIA vs GLOBAL)
export const typicalPriceRanges: TypicalPriceRange[] = [
  {
    tier: "Free / Freemium",
    indiaPrice:
      "Not applicable in enterprise lease management. No serious lease tool offers freemium.",
    indiaWho: "Not applicable.",
    globalPrice:
      "Not applicable in enterprise market. ZenTreasury offers freemium for up to 5 leases only.",
    globalWho:
      "Micro-businesses or individuals testing IFRS 16 compliance only.",
  },
  {
    tier: "Entry / Starter",
    indiaPrice:
      "Rs 500 to Rs 1200 per user per month (Hubler-range). Minimum: 5 users.",
    indiaWho:
      "Indian SMBs, 5-50 leased properties, lean teams, looking to replace Excel.",
    globalPrice: "USD 10-30 per user per month. Minimum 5 users.",
    globalWho:
      "US and UK small property managers, <50 properties, self-service onboarding.",
  },
  {
    tier: "Mid / Professional",
    indiaPrice:
      "Rs 1500 to Rs 3500 per user per month. Recommended for 50-200 property portfolios.",
    indiaWho:
      "Indian enterprises, retail chains, corporate real estate teams needing full feature access.",
    globalPrice: "USD 30-80 per user per month. Or flat USD 5,000-15,000/year.",
    globalWho:
      "Mid-market commercial operators, REITs under 200 properties, regional corporate real estate teams.",
  },
  {
    tier: "Enterprise",
    indiaPrice:
      "Rs 5 to 25 lakh per year base fee. Implementation Rs 2-15 lakh one-time.",
    indiaWho:
      "Large Indian enterprises (500+ employees, 200+ properties), PSUs, listed companies needing IND AS 116.",
    globalPrice: "USD 20,000 to 150,000+/year. Yardi, MRI, Nakisa range.",
    globalWho:
      "Global Fortune 500, large REITs, corporate occupiers with 500+ leases across multiple countries.",
  },
];

// SECTION 2C - HOW COMPETITORS CATEGORISE FEATURES ACROSS PLANS
export const competitorFeaturePlans: CompetitorFeaturePlan[] = [
  {
    feature: "Lease creation and basic tracking",
    freeStarter: "Included",
    professionalGrowth: "Included",
    enterprise: "Included",
  },
  {
    feature: "Lease repository and document upload",
    freeStarter: "Limited (5-10 leases)",
    professionalGrowth: "Unlimited",
    enterprise: "Unlimited + versioning",
  },
  {
    feature: "Renewal pipeline and alerts",
    freeStarter: "Basic alerts only",
    professionalGrowth: "Full pipeline",
    enterprise: "Full pipeline + analytics",
  },
  {
    feature: "Compliance document management",
    freeStarter: "Not available",
    professionalGrowth: "Basic",
    enterprise: "Full with ownership + alerts",
  },
  {
    feature: "AMC management",
    freeStarter: "Not available",
    professionalGrowth: "Not available",
    enterprise: "Available (Lockated only at this tier)",
  },
  {
    feature: "Maintenance ticketing",
    freeStarter: "Not available",
    professionalGrowth: "Not available",
    enterprise: "Available (Lockated only at this tier)",
  },
  {
    feature: "Utilities management",
    freeStarter: "Not available",
    professionalGrowth: "Not available",
    enterprise: "Available (Lockated only at this tier)",
  },
  {
    feature: "OPEX budget tracking",
    freeStarter: "Not available",
    professionalGrowth: "Basic",
    enterprise: "Full with budget vs actual",
  },
  {
    feature: "Custom fields and configuration",
    freeStarter: "Not available",
    professionalGrowth: "Limited",
    enterprise: "Full custom fields",
  },
  {
    feature: "Role-based access control",
    freeStarter: "2 roles",
    professionalGrowth: "5 roles",
    enterprise: "Unlimited custom roles",
  },
  {
    feature: "Audit logs",
    freeStarter: "Not available",
    professionalGrowth: "30-day history",
    enterprise: "Full immutable audit trail",
  },
  {
    feature: "Location hierarchy",
    freeStarter: "City-level only",
    professionalGrowth: "State and city",
    enterprise: "Full 6-level hierarchy",
  },
  {
    feature: "Invoice generation (GST)",
    freeStarter: "Not available",
    professionalGrowth: "Available (India tools only)",
    enterprise: "Full GST invoice + TDS",
  },
  {
    feature: "API access",
    freeStarter: "Not available",
    professionalGrowth: "Not available",
    enterprise: "Available at additional cost",
  },
];

// SECTION 2D - RECOMMENDED PRICING: NOW / 6 MONTHS / 18 MONTHS (LESSEE)
export const recommendedPricingLessee: RecommendedPricingLessee[] = [
  {
    pricingStage: "Now - Launch Pricing",
    indiaEntryTier:
      "Rs 1,200 per user per month (annual), minimum 10 users. Rs 1.44 lakh per year minimum.",
    indiaMidMarket:
      "Rs 5-15 lakh per year base fee. Implementation Rs 3-5 lakh one-time.",
    globalEntryTier: "USD 25 per user per month, minimum 10 users.",
    globalMidMarket: "USD 8,000-20,000/year base fee.",
    notes:
      "Launch pricing should undercut Tango and Visual Lease by 40-50% on total cost of ownership. Competitive against Hubler on features. Use case: 50-200 properties.",
  },
  {
    pricingStage: "6 Months Pricing",
    indiaEntryTier:
      "Rs 1,500-2,000 per user per month after Phase 1 roadmap features (IND AS 116 module) and live.",
    indiaMidMarket:
      "Rs 12-20 lakh per year. Add IND AS 116 module as an add-on at Rs 3-5 lakh/year for listed companies.",
    globalEntryTier: "USD 30-40 per user per month.",
    globalMidMarket: "USD 15,000-30,000/year.",
    notes:
      "Price increase justified by IND AS 116 module, mobile app launch, and first reference customers. Add a per-property pricing option for landlord-side clients.",
  },
  {
    pricingStage: "18 Months - Market Leadership Play",
    indiaEntryTier:
      "Rs 2,500-4,000 per user per month. Introduce tiered plans: Core, Professional, Enterprise.",
    indiaMidMarket:
      "Rs 20-50 lakh per enterprise contracts. Target Rs 1 crore ACV for 500+ property portfolios.",
    globalEntryTier: "USD 50-80 per user per month for full platform.",
    globalMidMarket: "USD 30,000-80,000/year.",
    notes:
      "By 18 months, data sovereignty, ERP integration, and AI lease abstraction justify premium pricing 30-40% above India competitors. Yardi/MRI displacement narrative becomes credible.",
  },
];

// SECTION 3 - HOW TO POSITION OURSELVES (LESSEE)
export const lesseePositioning: PositioningItem[] = [
  {
    label: "Our single most defensible position right now",
    description:
      "India's only enterprise lease management platform that combines end-to-end lease and operations management with complete data sovereignty - all client data stays on your servers.",
  },
  {
    label: "The 2-3 customer segments to prioritise this year and why",
    description:
      "1. Retail chains with 100-600 stores: high urgency (multiple simultaneous renewals), India-first buyer, no good tool exists at their scale without global pricing. 2. Corporate real estate teams at large Indian enterprises (BFSI, IT, FMCG): budget holders, IND AS 116 compliance driver, data sovereignty requirement. 3. Property management companies managing 50-200 properties for third-party owners: recurring revenue, multiplier effect (one PM company brings all their client properties).",
  },
  {
    label: "The one competitor to displace most aggressively and how",
    description:
      "Displace Tango Analytics for retail chain buyers. Tango is expensive (Rs 12-40 lakh/year), has poor UX for new users, and has no India compliance features. Position Lockated as: same depth for retail lease management, India-built, 60% lower total cost of ownership, IND AS 116 support, GST-compliant invoicing, and data on your servers.",
  },
  {
    label: "What to STOP saying or doing",
    description:
      "Stop positioning as a property management tool for landlords. Stop leading with the feature list. Stop competing on price alone with Hubler for SMB deals - these are low ACV. Stop generic messaging like 'simplify your leases' which every competitor says.",
  },
  {
    label: "Recommended GTM motion for Year 1",
    description:
      "Direct enterprise sales (outbound to Head of Real Estate + CFO at retail chains and large corporates) combined with events (CREDAI, CII Real Estate, NASSCOM) for brand building. No PLG (product-led growth) - enterprise buyers need demos and evaluation in support. Partner with Big 4 advisory firms for compliance-driven entry (IND AS 116 implementation projects are a natural trigger for Lockated).",
  },
];

// SECTION 4 - VALUE PROPOSITIONS AND SUGGESTED IMPROVEMENTS (LESSEE)
export const lesseeValuePropositions: ValueProposition[] = [
  {
    currentValue: "All your leases in one place",
    whoResonates: "Head of Real Estate, Lease Manager",
    whatsWeak:
      "Too generic. Every competitor says this. No outcome stated. No differentiation.",
    improvedValue:
      "Stop paying rent on leases that already expired. Lockated alerts your team 90 days before every expiry and opens the renewal pipeline automatically.",
  },
  {
    currentValue:
      "Manage leases, rent, compliance, and maintenance from one platform",
    whoResonates: "CFO, Operations Director",
    whatsWeak:
      "Long list of features, not an outcome. Buyer does not understand what problem it solves.",
    improvedValue:
      "One platform replaces 5 tools your operations team uses today: the lease Excel, the compliance folder, the maintenance WhatsApp group, the OPEX tracker, and the AMC register.",
  },
  {
    currentValue: "Your data stays on your servers",
    whoResonates:
      "CTO, IT Head, Government buyers, PSU buyers, regulated financial institutions",
    whatsWeak: "Not prominently featured. Often buried in technical specs.",
    improvedValue:
      "Built for India's data sovereignty requirements. Your lease data never touches our cloud. Deploy on your own servers or private cloud - no exceptions.",
  },
  {
    currentValue: "Replace spreadsheets with a structured system",
    whoResonates: "Any buyer currently using Excel",
    whatsWeak:
      "Too low-level. Implies buyer is unsophisticated. Does not communicate clear outcome.",
    improvedValue:
      "Finance teams spend 3 days every month reconciling rent, compliance, and OPEX in Excel. Lockated closes the books in a day - with a complete audit trail.",
  },
  {
    currentValue: "Full visibility into your lease portfolio",
    whoResonates: "CFO, Head of Real Estate",
    whatsWeak:
      "Visibility is a feature, not an outcome. Does not state what happens because of the visibility.",
    improvedValue:
      "Know exactly how much you can save before every lease renewal. Lockated shows your current rent, landlord's proposed rent, and market benchmark side by side - before you sit down to negotiate.",
  },
  {
    currentValue: "Save time on lease administration",
    whoResonates: "Lease Manager",
    whatsWeak:
      "Time saving alone does not justify enterprise software spend. Needs to connect to revenue or risk.",
    improvedValue:
      "A missed lease renewal costs 15-25% more in rent than a proactive renewal. Lockated has never let a client miss a renewal window.",
  },
];

// ==================== LESSOR PERSPECTIVE ====================

// SECTION 1 - CURRENT FEATURES VS MARKET STANDARD (LESSOR)
export const lessorFeatureComparisons: LessorFeatureComparison[] = [
  {
    area: "Outgoing Lease Management",
    marketStandard:
      "Create and manage lease agreements with tenants including rent schedules, escalation, CAM, and document storage.",
    ourProduct:
      "Full lease creation wizard with property-tenant linkage, CAM and escalation configuration, document upload and audit trail. Comprehensive and exceeds standard.",
    status: "AHEAD",
  },
  {
    area: "Rental Income and Receivables Tracking",
    marketStandard:
      "Track rent receivable from tenants with payment status, aging, and collection dashboards.",
    ourProduct:
      "Full receivables tracking with payment status (Received/Pending/Overdue/Partial), receivables aging by band, automated reminder dispatches to tenants, and collection performance reporting.",
    status: "AHEAD",
  },
  {
    area: "Tenant Billing and Invoicing",
    marketStandard:
      "Generate and dispatch invoices to tenants for rent, CAM, and utilities.",
    ourProduct:
      "Automated invoice generation for rent, CAM, and utilities with GST compliance, GSTIN, HSN codes, and email dispatch to tenants. Matches or exceeds market standard.",
    status: "AHEAD",
  },
  {
    area: "Tenant Management",
    marketStandard:
      "Directory of tenants with contact, lease history, and payment records.",
    ourProduct:
      "Full tenant directory with payment reliability scoring, communication logs, dispute tracking, and relationship health score. Above standard.",
    status: "AHEAD",
  },
  {
    area: "CAM Reconciliation",
    marketStandard:
      "Annual reconciliation of CAM charges estimates vs actual spend, with tenant reimbursement or credit.",
    ourProduct:
      "CAM charge configuration and monthly invoice generation. Annual CAM reconciliation workflow is partially built. Full reconciliation with audit-ready lease statements is in development.",
    status: "AT PAR",
  },
  {
    area: "Occupancy and Vacancy Management",
    marketStandard:
      "Dashboard showing which properties are occupied, vacant, or under notice.",
    ourProduct:
      "Occupancy status tracking via lease lifecycle stages (Active, Expiring, Terminated). Full vacancy management dashboard shows vacant units with area and list rent. Pre-marketing features not yet built.",
    status: "AT PAR",
  },
  {
    area: "Lessee-side IND AS 17 / IFRS 16 Accounting",
    marketStandard:
      "Generate journal entries for the lessor on lease accounting.",
    ourProduct:
      "Not currently built. Lessee-side IFRS 16 / IND AS 116 accounting journal automation is a Phase 1 priority for the lessor segment.",
    status: "GAP",
  },
  {
    area: "Maintenance and AMC Management",
    marketStandard:
      "Track tenant maintenance requests, manage AMC vendors, and install SLAs.",
    ourProduct:
      "Full maintenance ticketing (tenant-raised), SLA configuration by priority, vendor assignment, and cost-recovery billing to tenants. AMC contract management with vendor performance scoring.",
    status: "AHEAD",
  },
  {
    area: "Compliance Management for Owned Properties",
    marketStandard:
      "Track all property compliance documents (NOC, CC, OC, insurance) with renewal alerts.",
    ourProduct:
      "Comprehensive compliance repository with renewal alerts, ownership assignment, audit export, and statutory filing reminders. Above market standard.",
    status: "AHEAD",
  },
  {
    area: "Utility Billing to Tenants",
    marketStandard:
      "Calculate tenant utility consumption and generate utility invoices based on meter readings.",
    ourProduct:
      "Full utility meter reading capture, consumption calculation per unit, invoice generation with GST compliance, and dispute logging. CAM utility allocation by predetermined area.",
    status: "AHEAD",
  },
  {
    area: "Security Deposit Management (Received)",
    marketStandard:
      "Track security deposits received from tenants with refund calculation on exit.",
    ourProduct:
      "Full security deposit registry with receipt confirmation, refund scheduling, damage deduction calculation, and audit-ready register.",
    status: "AHEAD",
  },
  {
    area: "Property Asset Register",
    marketStandard:
      "Maintain a master database of owned properties with area, type, and financial metrics.",
    ourProduct:
      "Full hierarchical property database with unit-level configuration, area metrics, occupancy status, valuation register, and amenity tracking.",
    status: "AHEAD",
  },
  {
    area: "Tenant Self-Service Portal",
    marketStandard:
      "Allow tenants to view their leases, pay rent, raise and track maintenance requests, and download invoices.",
    ourProduct:
      "Tenant portal (web and mobile) is in development. Currently not available - this is a Phase 1 development priority.",
    status: "GAP",
  },
  {
    area: "Multi-Client Management (Property Management Companies)",
    marketStandard:
      "Manage properties for multiple landlord clients with separate reporting per client.",
    ourProduct:
      "Multi-client configuration is partially supported via role-based access control. Full white-label multi-client management with consolidated and individual client reporting is in development.",
    status: "AT PAR",
  },
  {
    area: "Data Sovereignty and On-Premise Deployment",
    marketStandard:
      "Option to deploy the platform on client-owned servers rather than a shared SaaS cloud.",
    ourProduct:
      "Full on-premise and private cloud deployment. AHEAD — USP. Only platform in India offering this for the lessor segment. Critical for regulated and government-adjacent property owners.",
    status: "AHEAD",
  },
];

// SUMMARY - COMPETITIVE POSITION AND PRICING MODEL IMPACT (LESSOR)
export const lessorCompetitiveSummary: LessorCompetitiveSummaryItem[] = [
  {
    category: "WHERE WE ARE AHEAD OF THE MARKET (LESSOR)",
    detail:
      "Full outgoing lease management, GST-compliant tenant billing, rent receivables tracking with aging, maintenance management with tenant-raised tickets, compliance repository with renewal alerts, security deposit management, property asset register, data sovereignty. We match what most mid-market lessor platforms offer in these areas today.",
  },
  {
    category: "WHERE WE ARE AT PAR",
    detail:
      "CAM reconciliation (monthly billing built, annual reconciliation in development), tenant portal (in development), and multi-client management for property management companies (in roadmap). We match what most mid-market lessor platforms offer in these areas today.",
  },
  {
    category: "WHERE WE HAVE GAPS THAT WILL COST US DEALS",
    detail:
      "No IND AS 17 / IFRS 16 accounting journal generation for finance lessors — required for listed property companies and REITs. Tenant self-service portal — expected by institutional tenants in Grade-A commercial properties. Full multi-client reporting for property management companies managing multiple owner portfolios.",
  },
];

// SECTION 2A - STANDARD PRICING MODELS IN THE LESSOR PROPERTY MANAGEMENT CATEGORY
export const lessorPricingModels: LessorPricingModel[] = [
  {
    model: "Per Property Per Month",
    howItWorks:
      "Subscription charged per managed property per month. Scales directly with portfolio.",
    whoUsesIt:
      "Commercial real estate developers, industrial parks, park operators, family offices.",
    indiaApplicability:
      "High — clear ROI calculation: monthly platform cost vs property management efficiency gains.",
  },
  {
    model: "Per Unit Per Month",
    howItWorks:
      "Subscription charged per rental unit (shop, bay, office), multiplicative of per-building.",
    whoUsesIt:
      "Retail mall operators, industrial parks, multi-tenanted office buildings.",
    indiaApplicability:
      "High — aligns cost with number of tenants and revenue-generating units.",
  },
  {
    model: "Percentage of Rent Collected",
    howItWorks:
      "Platform fee is a percentage of total rental income collected through the platform. Aligns incentives.",
    whoUsesIt: "Property management companies managing on behalf of landlords.",
    indiaApplicability:
      "Medium — common in managed services but requires transparent collection tracking.",
  },
  {
    model: "Fixed Annual Enterprise Licence",
    howItWorks:
      "Per-annum fee for the entire portfolio regardless of property count. Purchased by HQ.",
    whoUsesIt: "REITs, large conglomerates with captive property management.",
    indiaApplicability:
      "High — simplifies procurement and CFO approval for large enterprises.",
  },
  {
    model: "Tiered by Portfolio Size",
    howItWorks:
      "Pricing tiers: Starter (up to 25 properties), Growth (25-100 properties), Enterprise (100+).",
    whoUsesIt:
      "Mid-market property management companies and regional developers.",
    indiaApplicability: "High — easy to pitch and compare during procurement.",
  },
  {
    model: "Modular Add-On Pricing",
    howItWorks:
      "Base platform for lease and billing management. Add-on modules for compliance, etc.",
    whoUsesIt:
      "Companies seeking phased adoption — start with core, add modules over time.",
    indiaApplicability:
      "High — lowers initial price point and allows upsell as platform adoption grows.",
  },
  {
    model: "Implementation + SaaS Hybrid",
    howItWorks:
      "One-time implementation/migration fee plus annual SaaS subscription. Implementation covers data migration.",
    whoUsesIt:
      "Institutional buyers and property management companies with complex data migration needs.",
    indiaApplicability:
      "High — matches India enterprise procurement expectation of professional services alongside software.",
  },
  {
    model: "Freemium / Trial-to-Paid",
    howItWorks:
      "Free tier for up to 5 properties with limited features. Paid upgrade for full access.",
    whoUsesIt:
      "Smaller landlords, family offices exploring digital property management for the first time.",
    indiaApplicability:
      "Medium — useful for market entry but may attract low-ACV clients.",
  },
  {
    model: "API Access Pricing",
    howItWorks:
      "Additional fee for API access enabling ERP integration, tenant portal APIs, and custom accounting systems.",
    whoUsesIt:
      "Tech-forward property management companies integrating with SAP, Oracle, or custom property accounting systems.",
    indiaApplicability:
      "Medium — needed for enterprise deals but not yet built.",
  },
  {
    model: "Managed Service Model",
    howItWorks:
      "Vendor provides the platform plus a managed service team to handle data entry, reporting.",
    whoUsesIt: "Landlords who want outcomes without building an in-house team.",
    indiaApplicability:
      "High — premium segment in India where many property owners lack in-house operations staff.",
  },
];

// SECTION 2D - RECOMMENDED PRICING (NOW / 6 MONTHS / 18 MONTHS) — LESSOR
export const recommendedPricingLessor: RecommendedPricingLessor[] = [
  {
    segment: "Small Landlord (up to 25 properties)",
    now: "Rs 3,000-6,000/property/year. Simple per-property pricing. Focus on core lease and billing modules.",
    sixMonths:
      "Add tenant portal add-on (Rs 1,000/property/year). Introduce compliance module upsell.",
    eighteenMonths:
      "Rs 4,000-10,000/property/year including portal and compliance modules. Introduce tiered pricing.",
  },
  {
    segment: "Mid-Market (25-100 properties)",
    now: "Rs 2,000-5,000/property/year. Annual contract. Add multi-client management for property management companies. Implementation fee of Rs 2-6 lakh.",
    sixMonths:
      "Rs 2,500-6,000/property/year. Add full module suite. ERP Integration API at Rs 5-10 lakh one-time.",
    eighteenMonths:
      "Rs 3,000-7,000/property/year with full module suite. ERP Integration API at Rs 5-10 lakh one-time.",
  },
  {
    segment: "Enterprise and Institutional (100+ properties)",
    now: "Rs 50-100 lakh/year flat enterprise licence. Includes implementation, training, and custom add-ons via REIT-grade accounting journaling.",
    sixMonths:
      "Add lessor-side IND AS 17 module (Rs 10-25 lakh). Rs 75-250 lakh/year all-inclusive. White-label for property management companies at 25% premium.",
    eighteenMonths:
      "Rs 75-250 lakh/year all-inclusive. White-label for property management companies at 25% premium.",
  },
];

// SECTION 3 - HOW TO POSITION OURSELVES (LESSOR)
export const lessorPositioning: LessorPositioning[] = [
  {
    level: "Primary Positioning",
    description:
      "The only India-built enterprise property management platform combining lease portfolio management, GST-compliant tenant billing, receivables tracking, maintenance management, and compliance — on the client's own servers. Yardi and MRI cost 5-10x more and are cloud-only.",
  },
  {
    level: "Secondary Positioning",
    description:
      "Built for the Indian commercial lessor: GST-compliant invoicing, property tax tracking, India compliance (Fire NOC, CC, OC), and INR pricing. Not a US or European product retrofitted for India.",
  },
  {
    level: "Tertiary Positioning",
    description:
      "From property manager to portfolio owner: one platform replaces 5 disconnected tools (rent tracker, billing software, compliance calendar, maintenance WhatsApp group, AMC spreadsheet).",
  },
];

// SECTION 4 - VALUE PROPOSITIONS AND SUGGESTED IMPROVEMENTS (LESSOR)
export const lessorValuePropositions: LessorValueProposition[] = [
  {
    title: "Rental Income Visibility",
    currentState:
      "Stop chasing property managers for monthly collection status. See every tenant's payment status in real time.",
    improvedValue:
      "Build a receivables aging dashboard as the homepage for finance users in the lessor segment.",
  },
  {
    title: "Vacancy Cost Awareness",
    currentState:
      "Know exactly how much each vacant unit costs in lost rental income. Pre-market proactively.",
    improvedValue:
      "Add a Vacancy Loss Counter showing cumulative lost rental income per vacant unit per day.",
  },
  {
    title: "Compliance Without Panic",
    currentState:
      "Never miss a property compliance renewal. Every NOC, CC, OC, and insurance renewal is on a calendar with ownership.",
    improvedValue:
      "Extend compliance module to include statutory filing reminders (property tax, GST filing for rental income).",
  },
  {
    title: "Tenant Retention Intelligence",
    currentState:
      "Know which tenants are likely to leave before they tell you.",
    improvedValue:
      "Build a Tenant Flight Risk Score based on payment patterns, maintenance volume, and engagement frequency.",
  },
  {
    title: "GST-Ready Tenant Billing",
    currentState:
      "Generate GST-compliant rent and utility invoices to tenants without manual calculation.",
    improvedValue:
      "Add automatic GST rate selection based on the nature of the lease (commercial, industrial) and tenant GST registration status.",
  },
  {
    title: "IND AS 17 / IFRS 16 Lessor Accounting",
    currentState:
      "Help listed property companies classify leases and generate lessor-side accounting journals.",
    improvedValue:
      "Phase 1 build: Net Investment in Lease calculation and journal entry automation for IND AS 17 compliance.",
  },
];

// ==================== TAB 5: USE CASES ====================

export const useCases: UseCase[] = [
  {
    rank: 1,
    industry: "Retail Chains and Organised Retail",
    howRelevant:
      "A retail chain with 200 stores across 15 cities uses Lease Creation and Configuration to onboard all store leases with individual rent terms, CAM clauses, and annual escalation schedules. The Renewal Pipeline automatically flags 30 stores expiring in the next 90 days, and the Proposed vs Current Rent Comparison generates a negotiation brief for each store. Compliance Management tracks individual shop establishment certificates and FSSAI licences per store, alerting the Compliance Officer 60 days before expiry.",
    idealProfile:
      "Retail chains with 100-2000 stores: Fashion (Reliance Retail, Tata Cliq, Westside), Grocery (DMart, BigBazaar), Pharmacy (MedPlus, Apollo). Currently managed by Excel tracker maintained by 5-15 person Real Estate team.",
    urgency:
      "Very High - simultaneous renewals, percentage rent reconciliation, store opening cadence.",
    primaryBuyer:
      "Head of Real Estate - measured on cost per sqft and renewal success rate.",
    primaryUser:
      "Lease Manager - daily frustration: no centralised view of what 30 leases are expiring this quarter.",
  },
  {
    rank: 2,
    industry: "Commercial Real Estate Occupiers (BFSI and IT) (Offices)",
    howRelevant:
      "A bank with 150 branch offices uses the Location Hierarchy (Country to Circle) to filter all Maharashtra branches and see aggregate rent exposure in one view. Audit Logs for All Changes satisfy internal audit requirements for every rent escalation change. The OPEX and Expense Management module tracks housekeeping, security, and AMC costs per branch. The AMC Management module schedules annual maintenance visits for ATM, CCTV, and fire suppression systems at each branch.",
    idealProfile:
      "Banks (HDFC, ICICI, Axis, SBI), IT companies (TCS, Infosys, Wipro), BFSI organisations with 50-500 offices. Currently: Excel and generic SharePoint folder structure.",
    urgency:
      "High - IND AS 116 compliance, CAG audit pressure, CFO mandate for real-time visibility.",
    primaryBuyer:
      "CFO - measured on total occupancy cost per sqft and audit readiness.",
    primaryUser:
      "Finance Manager - daily frustration: month-end rent reconciliation takes 3 days across 150 branches.",
  },
  {
    rank: 3,
    industry: "Property Management Companies (Mixed Real Estate)",
    howRelevant:
      "A property management firm managing 100 commercial properties for clients uses the Tenant Directory to maintain all tenant profiles, and Rent Collection and Financial Tracking to generate monthly rent collection reports per property owner client. The Maintenance Request Ticketing module logs and tracks all tenant-raised maintenance issues with vendor assignment and SLA tracking. The Portfolio Overview Dashboard gives each property owner client a live view of their portfolio performance.",
    idealProfile:
      "Commercial property management companies (JLL India, CBRE, Knight Frank India for managed services), boutique PM firms managing 20-200 properties. Currently: mix of Excel, Zoho, and email.",
    urgency:
      "High - institutional clients demand professional reporting and SLA compliance.",
    primaryBuyer:
      "Portfolio Manager - measured on occupancy rate and client retention.",
    primaryUser:
      "Facility Manager - daily frustration: coordinating maintenance across 100 properties via WhatsApp with no formal ticketing system.",
  },
  {
    rank: 4,
    industry: "Industrial and Logistics (Warehousing)",
    howRelevant:
      "A logistics company with 30 warehouses across India uses the Property Master Database to maintain all warehouse records including carpet area, chargeable area, and loading bay count. The Utilities Management module tracks electricity consumption per warehouse and flags properties where consumption has risen more than 15% year-on-year. The Security Deposit Management module flags Rs 8 crore in deposits held in warehouses with leases expiring in the next 6 months.",
    idealProfile:
      "3PL companies (Delhivery, XpressBees), FMCG manufacturers, e-commerce warehousing operators managing 10-100 warehouse locations. Currently: property register in Excel.",
    urgency:
      "Moderate to High - warehouse expansion driven by e-commerce, cost optimisation pressure.",
    primaryBuyer:
      "Operations Director - measured on total occupancy cost as a percentage of revenue.",
    primaryUser:
      "Facility Manager - daily frustration: no single view of all warehouse lease statuses and utility costs.",
  },
  {
    rank: 5,
    industry: "Healthcare and Hospitals",
    howRelevant:
      "A hospital chain with 20 facilities uses Compliance Management to track NABH accreditation documents, fire safety certificates, and drug licences, with ownership assigned to the compliance team at each facility. AMC Management schedules preventive maintenance for medical equipment and building systems with vendor performance scoring. The Lease Lifecycle Tracking module ensures no facility lease expires without a formal renewal decision.",
    idealProfile:
      "Hospital chains (Fortis, Apollo, Medanta, Aster DM), diagnostic chains (Dr Lal Pathlabs, SRL Diagnostics), pharmacy chains with owned and leased facilities. Currently: compliance tracked in physical files.",
    urgency:
      "Very High - healthcare regulatory compliance is life-safety critical. Lease lapses can trigger licence cancellation.",
    primaryBuyer:
      "CEO or Chief Administrative Officer - measured on accreditation status and operational continuity.",
    primaryUser:
      "Compliance Officer - daily frustration: tracking 200+ compliance documents across 20 facilities manually.",
  },
  {
    rank: 6,
    industry: "Government and Public Sector Undertakings (Tenants)",
    howRelevant:
      "A central PSU with 100 leased offices uses the Audit Logs for All Changes to satisfy CAG audit requirements for every lease modification. The Compliance Repository stores all municipal approvals with validity dates. The Security Deposit Management module reconciles Rs 15 crore in security deposits held across all locations. The Location Hierarchy organises all offices by State and Region for zone-wise reporting to the board.",
    idealProfile:
      "PSUs (ONGC, SAIL, NTPC, Coal India, BHEL), central government ministries, state government departments. Currently: physical files and Excel registers.",
    urgency:
      "Moderate - driven by DoPT and CVC directives for property record digitalisation.",
    primaryBuyer:
      "Estate Officer or Administrative Officer - measured on audit compliance and timely rent payment.",
    primaryUser:
      "Estate Section staff - daily frustration: producing property records for CAG audits from physical files.",
  },
  {
    rank: 7,
    industry: "Corporate Enterprises and Conglomerates (Offices)",
    howRelevant:
      "A diversified conglomerate with 250 leased properties spanning offices, factories, and retail outlets across 8 business units uses Custom Fields for Leases to tag each lease with Business Unit and Cost Centre Code. The Regional Performance Insights module allows the Group CFO to see rent exposure by business unit and geography in one dashboard. OPEX and Expense Management tracks maintenance and utility costs per property and rolls up to business unit P&L.",
    idealProfile:
      "Diversified conglomerates (Tata Group entities, Mahindra, Aditya Birla Group subsidiaries), large FMCG manufacturers, auto OEMs with large dealer and office networks. Currently: ERP with minimal lease module.",
    urgency:
      "High - group-level IND AS 116 compliance, CFO mandate for portfolio visibility.",
    primaryBuyer:
      "Group CFO or Head of Corporate Real Estate - measured on total occupancy cost and audit clean sheet.",
    primaryUser:
      "Finance Manager per BU - daily frustration: consolidating lease data from 8 business units monthly.",
  },
  {
    rank: 8,
    industry: "Education and Skill Development",
    howRelevant:
      "An EdTech company with 50 owned and leased training centres uses Lease Creation and Configuration to maintain all centre leases with revenue-sharing clauses. The Renewal Pipeline flags 10 centres where leases expire in the next 6 months, with proposed rent comparison to support location closure or renewal decisions. Maintenance Request Ticketing manages facility upkeep across all centres with vendor assignment.",
    idealProfile:
      "Private universities, coaching chains (FIITJEE, Aakash, BYJU's physical centres), vocational training chains, K-12 school chains. Currently: Excel and ad hoc lease folders.",
    urgency:
      "Moderate - driven by real estate cost as a percentage of revenue pressure.",
    primaryBuyer:
      "Chief Operating Officer or Head of Operations - measured on cost per student and property utilisation.",
    primaryUser:
      "Operations Manager - daily frustration: no visibility into which of 50 training centres are profitable on a rent-to-revenue basis.",
  },
  {
    rank: 9,
    industry: "Hospitality and Food and Beverage (F&B)",
    howRelevant:
      "A restaurant chain with 80 outlets uses the Rent Due Scheduling module to auto-generate monthly rent due entries per outlet based on variable lease terms. The OPEX Management module tracks per-outlet kitchen maintenance, HVAC, and pest control costs for P&L reporting. The Compliance Management module tracks FSSAI licences, fire NOC, and health certificates per outlet with renewal alerts 90 days in advance.",
    idealProfile:
      "Restaurant chains (Jubilant FoodWorks, Devyani International, Westlife Development), hotel chains, cloud kitchen operators, spa chains. Currently: Centralised Excel with outlet-level rent tracker.",
    urgency:
      "High - lease cost is 8-15% of revenue. Multiple simultaneous regulatory compliance requirements.",
    primaryBuyer: "CFO - measured on per-outlet EBITDA margin.",
    primaryUser:
      "Real Estate Manager - daily frustration: tracking FSSAI and fire NOC renewals for 80 outlets manually.",
  },
  {
    rank: 10,
    industry: "Manufacturing and Chemicals",
    howRelevant:
      "A manufacturing company with 15 leased plant facilities uses the Property Master Database to maintain plant-wise area metrics and takeover condition records. The Utilities Management module tracks electricity and water consumption at each plant and computes cost per unit of production for the CFO. AMC Management maintains service contracts for boilers, cooling towers, and DG sets with scheduled preventive maintenance visits.",
    idealProfile:
      "Mid-large manufacturers (auto components, pharma, FMCG, chemicals) with leased or hybrid own-and-lease plant portfolios. Currently: Excel and SAP PM module for maintenance only.",
    urgency:
      "Moderate - driven by plant lease renewals and OPEX cost optimisation.",
    primaryBuyer:
      "Plant Head or CFO - measured on per-unit production cost including occupancy.",
    primaryUser:
      "Facility Manager - daily frustration: AMC renewal tracking for 20+ service contracts per plant done manually.",
  },
];

export const lesseeTeamUseCases: LesseeTeamUseCase[] = [
  {
    team: "Real Estate / Lease Management Team",
    howRelevant:
      "Owns the full lease lifecycle from creation through renewal to termination. Uses Lease Creation and Configuration, Renewal Pipeline, and Proposed vs Current Rent Comparison for all lease events.",
    specificModules:
      "Lease and Rental Agreement Management, Lease Lifecycle and Renewal Management, Tenant and Landlord Management",
    keyBenefit:
      "One source of truth for all lease data: reduces multiple Excel files and email threads into a single, auditable repository.",
    dayToDay:
      "Daily: checks renewal pipeline, logs landlord calls, uploads new agreement documents, tracks milestones and rent payments.",
    frequencyOfUse: "Daily",
  },
  {
    team: "Finance and Accounts Team",
    howRelevant:
      "Manages rent payment cycles, invoice generation, deposit reconciliation, and OPEX tracking. Links lease terms to financial recording for IND AS 116.",
    specificModules:
      "Rent Collection and Financial Tracking, Invoicing and Payments, Security Deposit Management, OPEX and Expense Management",
    keyBenefit:
      "Month-end close in 1 day instead of 3 days. Complete audit trail for all transactions. GST-compliant invoices auto-generated.",
    dayToDay:
      "Daily: records payments, checks overdue rent, generates invoices. Monthly: reports on OPEX and utility data for management.",
    frequencyOfUse: "Daily",
  },
  {
    team: "Compliance and Legal Team",
    howRelevant:
      "Maintains all regulatory approvals for each property. Tracks expiry dates and renewal obligations.",
    specificModules:
      "Compliance Management (repository, status tracking, renewal alerts, ownership assignment), Audit Logs",
    keyBenefit:
      "Zero compliance lapses due to automated 30/60/90-day alerts, centralised document storage with accountability. Full audit trail satisfies legal review.",
    dayToDay:
      "Weekly: reviews compliance alert dashboard, uploads renewed certificates, tracks renewal tasks to property teams.",
    frequencyOfUse: "Weekly",
  },
  {
    team: "Facility and Operations Management Team",
    howRelevant:
      "Manages day-to-day property operations including maintenance requests, AMC vendor coordination, and utility monitoring.",
    specificModules:
      "AMC Management, Maintenance Management, Utilities Management, Asset Management",
    keyBenefit:
      "Structured maintenance ticketing replaces WhatsApp chaos. Vendor performance scores enable data-driven AMC service decisions.",
    dayToDay:
      "Daily: relays or updates maintenance tickets, checks AMC service calendar, processes vendor invoices.",
    frequencyOfUse: "Daily",
  },
  {
    team: "IT and System Administration",
    howRelevant:
      "Manages user provisioning, role-based access control, security settings, and integration with existing enterprise systems.",
    specificModules:
      "Masters and Configuration Engine, Settings and User Management, Role-Based Access Control",
    keyBenefit:
      "Single configuration point for all users and data standards. IP whitelisting and 2FA ensure security. Data sovereignty maintained on client servers.",
    dayToDay:
      "Weekly: adds or deactivates users, audits permission changes, reviews security logs.",
    frequencyOfUse: "Weekly",
  },
  {
    team: "Senior Management and Leadership",
    howRelevant:
      "Consumes portfolio-level reports and dashboards for strategic decisions: portfolio expansion, lease renegotiation, vendor consolidation.",
    specificModules:
      "Portfolio Overview Dashboard, Regional Performance Insights, Monthly Expense Analysis, KPI Cards",
    keyBenefit:
      "Real-time portfolio visibility without waiting for team-prepared reports. Regional cost comparison supports office relocation and expansion decisions.",
    dayToDay:
      "Weekly or on demand: views dashboard, exports reports, approves lease decisions.",
    frequencyOfUse: "Weekly",
  },
  {
    team: "Procurement and Vendor Management Team",
    howRelevant:
      "Uses vendor master and AMC performance data to evaluate, onboard, and consolidate maintenance vendors across properties.",
    specificModules:
      "Masters and Configuration Engine (Vendor Master), Vendor Linking, Vendor Performance Metrics, Maintenance Management (Vendor Assignment)",
    keyBenefit:
      "Vendor performance scores replace subjective assessments. Vendor linkage across properties enables centralised procurement and volume-based rate renegotiations.",
    dayToDay:
      "Monthly: reviews vendor performance dashboards, updates vendor contracts, consolidates vendor recommendations.",
    frequencyOfUse: "Monthly",
  },
  {
    team: "Internal Audit Team",
    howRelevant:
      "Accesses audit logs for lease changes, payment records, and compliance events to satisfy internal and external audit requirements.",
    specificModules:
      "Audit Logs for All Changes, Payment History, Compliance Repository, Lease Repository",
    keyBenefit:
      "Immutable audit trail eliminates the need to chase teams for documents. All lease changes are timestamped and attributed. Audits complete in hours instead of days.",
    dayToDay:
      "Quarterly or on demand for special audits: exports audit logs, reviews payment and compliance certificate status.",
    frequencyOfUse: "Quarterly",
  },
];

export const lessorIndustryUseCases: LessorIndustryUseCase[] = [
  {
    rank: 1,
    industry: "Commercial Real Estate Developers",
    howRelevant:
      "A developer with 10+ commercial buildings uses Lockated to manage all outgoing leases, track rent receivables from corporate tenants, generate GST-compliant invoices monthly, manage compliances (Fire NOC, OC, CC) for each building, and monitor occupancy rates. The Head of Asset Management gets a daily dashboard of rental income received vs target, overdue collections, and leases expiring in the next 90 days.",
    idealProfile:
      "Mid-size to large developer owning 50–200+ units/properties in 5+ buildings in 2+ cities. Current tool: Excel rent register + manual invoicing.",
    decisionMaker: "Head of Asset Management, CFO",
    currentToolReplaced: "Excel rent tracker, Tally for billing",
    estimatedDealSize: "Rs 10–40 lakh/year",
  },
  {
    rank: 2,
    industry: "Property Management Companies",
    howRelevant:
      "A property management company managing 300 commercial properties on behalf of 15 landlord clients uses Lockated for centralised lease management, tenant billing, receivables tracking, compliance calendars, and maintenance management — with landlord-wise data separation. The company generates per-client monthly reports on rent collected, outstanding amounts, and compliance status without assembling data manually.",
    idealProfile:
      "Professional property management firm managing 100–200 properties for multiple landlord clients. Current tool: fragmented spreadsheets per client.",
    decisionMaker: "MD, Head of Operations",
    currentToolReplaced: "Spreadsheets per client, basic billing software",
    estimatedDealSize: "Rs 8–30 lakh/year",
  },
  {
    rank: 3,
    industry: "Retail Mall Operators",
    howRelevant:
      "A mall operator leasing 200+ retail units to fashion, F&B, and electronics brands uses Lockated to manage each retailer's lease, track revenue-share rent arrangements, generate monthly utility invoices (electricity, common area charges), manage Fire NOC and OC renewals, and track maintenance SLAs for tenant fitouts. The mall management team gets mall-wide occupancy and collection dashboards.",
    idealProfile:
      "Mall operator or retail park developer with 100–900 retail units across 1–6 properties. Current tool: Excel + manual invoicing.",
    decisionMaker: "Head of Mall Management, CFO",
    currentToolReplaced: "Excel + manual invoicing",
    estimatedDealSize: "Rs 12–35 lakh/year",
  },
  {
    rank: 4,
    industry: "Industrial and Warehouse Park Operators",
    howRelevant:
      "An industrial park operator leasing factory sheds and warehouses to 50+ manufacturing and logistics companies uses Lockated to manage each tenant's lease, track power and water consumption per shed, generate utility invoices, manage factory licence renewals and fire NOC compliance for the park, and handle maintenance requests from tenants. NOI by shed and park-level occupancy are tracked in the dashboard.",
    idealProfile:
      "Industrial park developer or warehouse park operator with 30–200 tenant units. Current tool: Excel + standalone billing.",
    decisionMaker: "Head of Asset Management, Operations Head",
    currentToolReplaced: "Excel, standalone billing software",
    estimatedDealSize: "Rs 8–25 lakh/year",
  },
  {
    rank: 5,
    industry: "IT/ITES Special Economic Zones (SEZ) and Tech Parks",
    howRelevant:
      "A SEZ operator leasing office space to IT companies uses Lockated to manage multi-year office leases, track escalation clauses, generate rent and utility invoices, manage compliance with GST (SEZ-specific exempt treatment), manage vendor SLAs for facility maintenance, approve fire NOC and building OC, and handle maintenance SLAs for tenant IT companies. SEIS-reportable metrics (for listed SEZ entities) are tracked in the financials module.",
    idealProfile:
      "SEZ authority or tech park developer managing 20–100 corporate tenants in 1–3 parks. Current tool: SAP/Oracle incomplete module + Excel.",
    decisionMaker: "Head of Asset Management, CFO, Compliance Head",
    currentToolReplaced: "SAP/Oracle incomplete module + Excel",
    estimatedDealSize: "Rs 20–60 lakh/year",
  },
  {
    rank: 6,
    industry: "BFSI and Government-Adjacent Property Owners",
    howRelevant:
      "A PSU or government-linked entity owning commercial real estate portfolio leased to government departments and PSU entities uses Lockated with on-premise deployment for full data sovereignty. Compliance documentation is maintained for CAG audit readiness. Lease agreements, rent revisions, and deposit tracking meet government audit trail requirements.",
    idealProfile:
      "PSU, government corporation, or regulated entity owning and leasing out commercial properties. Current tool: manual records, legacy ERP.",
    decisionMaker: "CFO, Head of Estates, Compliance Officer",
    currentToolReplaced: "Manual records, legacy ERP module",
    estimatedDealSize: "Rs 15–50 lakh/year",
  },
  {
    rank: 7,
    industry: "Retail Chain Landlords (Franchise Property Owners)",
    howRelevant:
      "A group that owns and leases retail spaces to franchise brands (QSR, pharmacy, fashion) manages outgoing leases, tracks escalation clauses, collects monthly rent and CAM charges, generates GST invoices, and monitors lease renewals. The platform flags leases where brand partners are overdue on rent or approaching rent-free periods.",
    idealProfile:
      "Property owner or family office with 20–100 retail properties leased to branded retailers. Current tool: Excel, basic accounting software.",
    decisionMaker: "Owner, Property Manager",
    currentToolReplaced: "Excel, basic accounting software",
    estimatedDealSize: "Rs 5–15 lakh/year",
  },
  {
    rank: 8,
    industry: "Co-Working Space Operators",
    howRelevant:
      "A co-working operator managing 10 centres and sub-leasing desks, cabins, and floors to corporate clients and individual members uses Lockated to manage outgoing leases and membership agreements, track monthly billing, manage maintenance requests from members, and monitor occupancy by centre. GST-compliant invoicing covers both long-term lease and short-term membership categories.",
    idealProfile:
      "Co-working space operator managing 600–6,000 desks across 5–15 locations. Current tool: custom-built system (partial) + spreadsheets.",
    decisionMaker: "CEO, CFO, Operations Head",
    currentToolReplaced: "Custom system + Excel",
    estimatedDealSize: "Rs 6–20 lakh/year",
  },
  {
    rank: 9,
    industry: "Hospitality and Serviced Apartment Operators",
    howRelevant:
      "A serviced apartment operator leasing furnished units to corporate clients on 6–24 month agreements uses Lockated to manage lease agreements, track monthly rental income, generate invoices, manage maintenance requests, and ensure compliance. Fire NOC, lift certificates, and long-stay corporate client agreements are managed in the same framework as commercial leases.",
    idealProfile:
      "Serviced apartment operator with 100–500 units across 2–5 properties. Current tool: PMS (hospitality) + spreadsheets for long-stay leases.",
    decisionMaker: "Head of Operations, CFO",
    currentToolReplaced: "PMS + Excel",
    estimatedDealSize: "Rs 5–15 lakh/year",
  },
  {
    rank: 10,
    industry: "Family Offices and HNI Property Portfolios",
    howRelevant:
      "A family office managing a portfolio of 20–60 commercial properties leased to corporate tenants uses Lockated to centralise all lease agreements, track rent receivables, generate tax invoices, monitor compliance renewals, and get a consolidated financial view of the entire portfolio. The platform replaces a patchwork of Excel files maintained by different property managers.",
    idealProfile:
      "Family office or HNI with 15–100 commercial properties generating rental income. Current tool: Excel + manual CA-prepared reports.",
    decisionMaker: "Family Office Manager, Trustee",
    currentToolReplaced: "Excel + CA-prepared reports",
    estimatedDealSize: "Rs 4–12 lakh/year",
  },
];

export const lessorTeamUseCases: LessorTeamUseCase[] = [
  {
    teamRole: "Head of Asset Management",
    primaryUseCase:
      "Portfolio-level oversight of rental income, occupancy, and lease renewal.",
    keyActions:
      "Reviews portfolio dashboard. Tracks expiring leases in renewal pipeline. Approves renewal terms. Reviews overdue collections. Monitors occupancy by property and city.",
    frequencyOfUse:
      "Daily dashboard check (5 min). Weekly pipeline review (30 min). Monthly portfolio report (1 hour).",
    metricsTracked:
      "Occupancy rate, rental income vs target, renewal pipeline conversion rate, overdue collections value.",
  },
  {
    teamRole: "Property Manager",
    primaryUseCase:
      "Day-to-day management of assigned properties: tenant communications, maintenance, billing.",
    keyActions:
      "Creates and updates lease records. Records tenant payments. Dispatches rent reminders. Logs maintenance tickets. Updates compliance status. Communicates with tenants.",
    frequencyOfUse:
      "Daily (2–4 hours). Core platform user for operational management.",
    metricsTracked:
      "Tickets resolved within SLA, invoices dispatched on time, compliance renewals completed before deadline.",
  },
  {
    teamRole: "Finance Manager / Accounts Team",
    primaryUseCase:
      "Rent collection tracking, invoice generation, reconciliation, and financial reporting.",
    keyActions:
      "Generates monthly invoices. Records payments. Reviews receivables aging dashboard. Generates monthly income report. Exports data for Tally/SAP reconciliation.",
    frequencyOfUse:
      "Daily (30 min for collection checks). Monthly (2–3 hours for reporting and reconciliation).",
    metricsTracked:
      "Total rent collected, overdue amount, receivables aging, CAM charges invoiced vs collected.",
  },
  {
    teamRole: "CFO / Finance Director",
    primaryUseCase:
      "Portfolio P&L, NOI by asset, budget vs actual OPEX, and investor/board reporting.",
    keyActions:
      "Reviews NOI dashboard by property. Reviews OPEX vs budget. Approves high-value expense items. Reviews quarterly rental income forecast. Exports financial pack for board.",
    frequencyOfUse:
      "Weekly (15 min). Monthly (1–2 hours for board pack preparation).",
    metricsTracked:
      "Portfolio NOI, occupancy-weighted average rent, OPEX ratio, rental income growth YoY.",
  },
  {
    teamRole: "Compliance Officer",
    primaryUseCase:
      "Tracking all property compliance renewals and statutory filing obligations.",
    keyActions:
      "Reviews compliance calendar. Updates renewal status after document submission. Uploads renewed certificates. Reports to compliance alerts.",
    frequencyOfUse:
      "Weekly (30 min for calendar review). Monthly (1 hour for renewals and filings).",
    metricsTracked:
      "Compliance renewals completed before deadline, zero compliance lapses per quarter.",
  },
  {
    teamRole: "Maintenance Team / Facility Manager",
    primaryUseCase:
      "Resolving tenant-raised maintenance tickets within SLA for assigned properties.",
    keyActions:
      "Reviews open maintenance tickets. Assigns vendors. Updates ticket status. Confirms resolution and closes tickets. Flags tickets approaching SLA breach.",
    frequencyOfUse:
      "Daily (3–5 hours). Core operational workflow for maintenance teams.",
    metricsTracked:
      "Ticket resolution rate within SLA, average resolution time by category, tenant satisfaction score.",
  },
  {
    teamRole: "Legal Team",
    primaryUseCase:
      "Lease documentation, dispute management, and compliance with lease terms.",
    keyActions:
      "Reviews lease terms and conditions. Manages lease termination records. Logs and tracks tenant disputes. Reviews notice period compliances. Accesses lease audit trail.",
    frequencyOfUse:
      "As needed. Weekly review of active disputes and terminations.",
    metricsTracked:
      "Active disputes resolved, terminations processed on time, lease documentation completeness rate.",
  },
  {
    teamRole: "Senior Leadership / MD",
    primaryUseCase: "Portfolio health overview and strategic decision-making.",
    keyActions:
      "Reviews executive dashboard showing occupancy rate, rental income vs target, key overdue tenants, and compliance status. Reviews renewal pipeline for material lease decisions.",
    frequencyOfUse: "Weekly (10 min). Monthly board review.",
    metricsTracked:
      "Portfolio occupancy rate, annual rental income vs budget, NOI margin, lease renewal success rate.",
  },
];

// ==================== TAB 6: PRODUCT ROADMAP ==

export const roadmapLessee: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    timeline: "0-3 Months (Immediate)",
    focus: "Stop losing deals we should be winning",
    items: [
      {
        feature: "IND AS 116 Lease Accounting Module (Basic)",
        description:
          "Automate right-of-use asset and lease liability journal entry generation for each active lease based on discount rate, lease term, and rent schedule. Export journals in Tally, SAP, and Oracle-compatible formats.",
        whyMatters:
          "IND AS 116 is mandatory for listed Indian companies since April 2019. Without this, every listed company CFO dismisses Lockated as incomplete. Estimated 30% of enterprise deals lost at demo stage due to this gap.",
        segmentUnlocked:
          "Listed companies, BFSI regulated entities, PSUs subject to IND AS mandates, any enterprise with external auditors.",
        dealRisk:
          "Critical - every listed company deal is lost without this. Estimated 8-12 deals blocked in pipeline right now.",
        priority: "P1",
        marketSignal:
          "Nakisa, Visual Lease, LeaseAccelerator all lead with IND AS/IFRS 16 compliance as primary value proposition. India finance teams require it.",
      },
      {
        feature: "Mobile App for Facility Managers (iOS and Android)",
        description:
          "Native mobile app enabling maintenance ticket creation, ticket status updates, AMC service visit sign-off, and property photo capture with GPS tagging. Offline mode for poor connectivity properties.",
        whyMatters:
          "Facility managers and field teams operate on mobile. Without a native app, the maintenance and AMC modules see low adoption. App absence is cited in 20% of FM-driven deal losses.",
        segmentUnlocked:
          "Property management companies, retail chains (store-level facility teams), industrial and logistics operators.",
        dealRisk:
          "High - deals where the Facility Director is the sponsor are lost without mobile app. 4-6 deals affected.",
        priority: "P1",
        marketSignal:
          "Yardi, MRI, AppFolio all have full-featured mobile apps. Category expectation is mobile-first for field operations.",
      },
      {
        feature: "ERP Integration - Tally Export (India-first)",
        description:
          "One-click export of rent payment entries, OPEX transactions, and lease journal entries in Tally-compatible CSV format with pre-mapped ledger codes.",
        whyMatters:
          "70% of Indian SMB and mid-market enterprises use Tally. Without Tally export, Finance Managers must re-enter data manually, reducing adoption and generating complaints during pilot.",
        segmentUnlocked:
          "Indian mid-market enterprises (turnover Rs 100 crore to Rs 5000 crore), retail chains using Tally for accounting.",
        dealRisk:
          "Medium - does not lose deals but causes high post-sale friction that reduces expansion and renewal.",
        priority: "P1",
        marketSignal:
          "India-specific gap. No global competitor offers Tally export. Creates a defensible India-first advantage.",
      },
      {
        feature: "Bulk Lease Import Template (Excel to Platform)",
        description:
          "Structured Excel template allowing organisations to bulk-import existing lease data (up to 500 leases) with validation rules, error flags, and field mapping. Reduces onboarding time from 4-6 weeks to 1-2 weeks.",
        whyMatters:
          "The #1 barrier to switching from Excel is migration effort. A self-serve import template reduces perceived switching cost and enables faster go-live, improving conversion from pilot to paid.",
        segmentUnlocked:
          "All segments - universal requirement for any new enterprise client.",
        dealRisk:
          "High - pilots that run beyond 8 weeks have 40% lower conversion rate. Bulk import accelerates go-live.",
        priority: "P1",
        marketSignal:
          "Competitors (Hubler, Tango) that offer quick onboarding win deals on speed to value, not features.",
      },
    ],
  },
  {
    phase: "Phase 2",
    timeline: "3-6 Months (Short-Term)",
    focus: "Expand addressable market and move up-market",
    items: [
      {
        feature: "SAP Integration (Bi-directional, Read/Write)",
        description:
          "Native API integration with SAP ECC and S4/HANA for bidirectional sync of lease accounting journals, rent payment entries, and OPEX transactions. Real-time sync eliminates manual data re-entry.",
        whyMatters:
          "Large Indian enterprises running SAP (Tata, Mahindra, L&T, BFSI majors) require SAP integration before budget approval. Without it, IT gatekeepers block vendor selection.",
        segmentUnlocked:
          "Conglomerates, BFSI enterprises, large manufacturers, PSUs running SAP. Estimated 20-30 enterprise accounts immediately unlocked.",
        dealRisk:
          "High - SAP integration is a mandatory requirement for enterprise deals above Rs 20 lakh ARR.",
        priority: "P1",
        marketSignal:
          "Nakisa's primary competitive advantage is native SAP integration. Matching this closes the largest competitive gap.",
      },
      {
        feature: "Landlord Portal (Self-service)",
        description:
          "A limited-access portal where landlords can view rent payment status, download receipts, upload compliance documents (NOC, OC renewals), and receive renewal offers without contacting the tenant's Lease Manager.",
        whyMatters:
          "Landlords frequently call Lease Managers for payment confirmations. A self-service portal reduces inbound calls by 60-70% and makes Lockated the communication layer between tenant organisations and their landlords.",
        segmentUnlocked:
          "Property management companies (multiplier: each PM client uses portal for all their landlords), large retail chains with 100+ landlords.",
        dealRisk: "Low for initial sales; high for retention and expansion.",
        priority: "P2",
        marketSignal:
          "No India lease management tool offers a landlord self-service portal. First-mover differentiation opportunity.",
      },
      {
        feature: "Lease Abstraction from PDF using AI (Document Intelligence)",
        description:
          "AI-powered extraction of key lease terms (rent, escalation, deposit, lock-in, penalties, CAM) from uploaded lease agreement PDFs. Extracted data auto-fills lease creation form for Lease Manager review and confirmation.",
        whyMatters:
          "Onboarding 200+ leases manually is the largest implementation cost and delay. AI abstraction can reduce lease data entry time by 70-80%, making the product accessible to larger portfolios.",
        segmentUnlocked:
          "All enterprise segments. Specifically unlocks deal conversations with organisations that have 200+ historical leases to migrate.",
        dealRisk:
          "High in 9-12 months - as AI abstraction becomes category standard, absence will be a deal-breaker for large enterprise deals.",
        priority: "P1",
        marketSignal:
          "Tango, Visual Lease, Nakisa, and Re-Leased all have AI lease abstraction. Setting category expectation.",
      },
      {
        feature: "Budget vs Actual Analytics Dashboard",
        description:
          "Executive dashboard comparing budgeted rent, OPEX, and utility spend versus actuals by property, by city, and portfolio-wide. Includes variance flagging and year-on-year trend.",
        whyMatters:
          "CFO-level feature. Required for board reporting and budget cycle. Currently available as raw data but not in a presentation-ready dashboard format.",
        segmentUnlocked:
          "All enterprise segments. Specifically adds value for CFOs and Group Heads of Real Estate making portfolio rationalisation decisions.",
        dealRisk:
          "Medium - adds deal velocity by creating CFO as additional sponsor alongside Head of Real Estate.",
        priority: "P2",
        marketSignal:
          "All enterprise-grade competitors (Yardi, MRI, Tango) have strong budget vs actual reporting. Absence makes CFO-led deals harder.",
      },
    ],
  },
  {
    phase: "Phase 3",
    timeline: "6-18 Months (Medium-Term)",
    focus: "Build the long-term moat",
    items: [
      {
        feature: "Predictive Lease Renewal Recommendation Engine",
        description:
          "AI model trained on historical lease data, market rent trends (sourced via integration with property data providers), and renewal outcomes to recommend optimal renewal timing, target rent range, and negotiation strategy for each expiring lease.",
        whyMatters:
          "Transforms Lockated from a data repository into a strategic advisor. Gives Head of Real Estate a defensible recommendation before every renewal negotiation.",
        segmentUnlocked:
          "All large enterprise segments. Particularly high-value for retail chains renewing 30-50 leases simultaneously.",
        dealRisk:
          "Low in 6 months, high by 18 months as AI features become category norm.",
        priority: "P2",
        marketSignal:
          "No current India competitor has this. Global competitors (Tango, Yardi) are moving toward AI site selection. Predictive renewal is the adjacent opportunity.",
      },
      {
        feature: "Integration Marketplace (Accounting and HRMS)",
        description:
          "An open integration marketplace with pre-built connectors for Zoho Books, Oracle NetSuite, Microsoft Dynamics 365, SAP SuccessFactors, and top Indian accounting software. Self-service API documentation for custom integrations.",
        whyMatters:
          "Enterprise IT teams require a documented integration path before approving vendor selection. An integration marketplace accelerates IT approval and reduces custom development cost.",
        segmentUnlocked:
          "Enterprise and mid-market segments with existing ERP or HRMS stacks.",
        dealRisk:
          "Low currently, medium by 12 months as enterprise pipeline grows.",
        priority: "P2",
        marketSignal:
          "MRI Software's open platform with API marketplace is a primary enterprise differentiator. Lockated needs equivalent openness to compete at large enterprise scale.",
      },
      {
        feature: "Property Benchmarking and Market Intelligence",
        description:
          "Integration with Indian commercial real estate data providers (Anarock, Square Yards commercial, JLL India data) to show market rent per sqft by micro-market for any property type. Enables rent benchmarking at renewal time.",
        whyMatters:
          "Gives Lockated's renewal pipeline module a data moat. The organisation can see whether their current rent is above or below market before negotiation - currently impossible without engaging a real estate consultant.",
        segmentUnlocked:
          "All enterprise segments. High value for retail chains and conglomerates negotiating 50+ renewals per year.",
        dealRisk:
          "Low in short term. High strategic value as benchmark data becomes the reason not to switch platforms.",
        priority: "P1",
        marketSignal:
          "No India lease platform offers this. JLL and Anarock sell market data separately. First to integrate it wins a data moat.",
      },
      {
        feature: "Sustainability and ESG Reporting Module",
        description:
          "Track and report on property-level energy consumption, water usage, waste generation, and carbon footprint. Generate ESG-compliant reports (GRI, BRSR) aligned with SEBI BRSR mandatory disclosure for listed companies.",
        whyMatters:
          "SEBI made BRSR (Business Responsibility and Sustainability Report) mandatory for top 1000 listed companies from FY 2022-23. Real estate is a major component. ESG reporting is a CFO and Board-level mandate.",
        segmentUnlocked:
          "Listed companies, REITs, MNCs with global ESG commitments, companies seeking green building certifications.",
        dealRisk:
          "Medium - becomes high urgency from FY2025-26 as BRSR requirements tighten.",
        priority: "P2",
        marketSignal:
          "No India lease tool offers ESG reporting. Global tools (Yardi Energy Suite, MRI Envizi) offer sustainability modules for USD 5,000-20,000/year premium.",
      },
    ],
  },
];

// LESSOR PERSPECTIVE ROADMAP
export const roadmapLessor: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    timeline: "0-3 Months (Immediate)",
    focus: "Stop losing lessor deals we should be winning",
    items: [
      {
        feature: "IND AS 17 / IFRS 16 Lessor Accounting Module",
        description:
          "Automate net investment in lease calculations and journal entry generation for finance leases on the lessor side. Export journals in Tally, SAP, and Oracle-compatible formats.",
        whyMatters:
          "Listed property companies, REITs, and institutional landlords require lessor-side IND AS 17 compliance. Without this, every listed developer CFO dismisses Lockated as incomplete for their finance team.",
        segmentUnlocked:
          "Listed real estate developers, REITs, PSU property owners, institutional landlords.",
        dealRisk:
          "Critical — every listed property company deal is blocked without this. 5–8 enterprise lessor deals in pipeline held up.",
        priority: "P1",
        marketSignal:
          "Yardi Voyager, MRI Commercial all lead with IND AS / IFRS 16 lessor accounting as a primary value proposition for institutional property owners.",
      },
      {
        feature: "Tenant Self-Service Portal (Web)",
        description:
          "Web portal allowing tenants to view their lease agreement, download invoices, raise maintenance tickets, track ticket status, and confirm rent payment. Accessible via browser without separate app.",
        whyMatters:
          "Grade-A commercial property tenants (corporate occupiers) expect a digital interface with their landlord. Absence of a tenant portal is cited in demos with institutional property management companies.",
        segmentUnlocked:
          "Institutional property management companies, commercial real estate developers, SEZ and tech park operators.",
        dealRisk:
          "High — every property management company expects this. Cited as a gap in 30%+ of lessor demos.",
        priority: "P1",
        marketSignal:
          "All Tier-1 property management platforms (Yardi, MRI) include tenant portals. Indian tenants are increasingly demanding digital interfaces.",
      },
      {
        feature: "GST Rental Income Filing Integration",
        description:
          "Automated generation of GSTR-1 data from rent invoices raised to tenants. Calculate output GST liability on commercial lease income. Export in JSON format for GST portal filing.",
        whyMatters:
          "All commercial property lessors are required to collect GST on rent (18% for commercial leases above threshold). Manual GST filing from multiple invoices is error-prone. This feature removes a compliance pain point.",
        segmentUnlocked:
          "All commercial real estate lessors — developers, property management companies, mall operators, industrial park operators.",
        dealRisk:
          "Medium — not a deal-blocker alone but a strong differentiator for the finance and compliance teams.",
        priority: "P1",
        marketSignal:
          "No Indian property management platform offers integrated GSTR-1 output for commercial rent income. This is a clear competitive gap.",
      },
      {
        feature: "CAM Annual Reconciliation Workflow",
        description:
          "End-of-year CAM reconciliation module: compare estimated CAM charged monthly vs actual CAM expenses incurred, calculate surplus or shortfall per tenant, generate reconciliation statements, and process adjustments in the next billing cycle.",
        whyMatters:
          "All commercial leases with CAM charges require annual reconciliation. Property managers currently do this manually in Excel. The absence of this workflow limits CAM billing to estimated charges only.",
        segmentUnlocked:
          "Commercial real estate developers, mall operators, industrial parks — any lessor with CAM provisions in leases.",
        dealRisk:
          "Medium — not a deal-blocker alone but delays adoption of the CAM billing module by finance-driven buyers.",
        priority: "P2",
        marketSignal:
          "Yardi and MRI both have comprehensive CAM reconciliation as standard. This is table stakes for commercial property management.",
      },
      {
        feature: "Multi-Client Management for Property Management Companies",
        description:
          "Full multi-client architecture: properties tagged to their owner, financial reports generated per client, access controls preventing cross-client data visibility, and a consolidated management dashboard for the property management company's own users.",
        whyMatters:
          "Property management companies cannot use a platform that exposes one client's portfolio to another. Multi-client isolation is a prerequisite for this segment, which is the fastest-growing lessor buyer segment.",
        segmentUnlocked:
          "Property management companies managing 100–1,000 properties for multiple landlord clients. Rs 8–30 lakh per deal.",
        dealRisk:
          "Critical for property management company segment — no multi-client = zero deals in this segment.",
        priority: "P1",
        marketSignal:
          "All property management company competitors (Yardi, MRI, Buildium) support multi-client. This is non-negotiable for professional PMs.",
      },
    ],
  },
  {
    phase: "Phase 2",
    timeline: "3-9 Months (Short Term)",
    focus: "Expand addressable lessor market",
    items: [
      {
        feature: "Tenant Mobile App (iOS and Android)",
        description:
          "Native mobile app for tenants to raise maintenance tickets with photos, track ticket status, view invoices, and receive payment reminders. Push notifications for overdue rent and maintenance updates.",
        whyMatters:
          "Field-facing and mobile-first corporate tenants expect a mobile experience. A mobile app increases maintenance module adoption and positions Lockated competitively against Yardi's tenant app.",
        segmentUnlocked:
          "All lessor clients whose tenants are corporate occupiers with mobile-first expectations.",
        dealRisk:
          "Medium — primarily an adoption enabler for maintenance and billing modules.",
        priority: "P2",
        marketSignal:
          "All Tier-1 commercial property management platforms have tenant mobile apps. Absence limits the lessor product's completeness narrative.",
      },
      {
        feature: "Vacancy Marketing and Pre-Letting Module",
        description:
          "Vacancy management module: list available properties with area, specs, and asking rent. Track leads from prospective tenants. Manage site visits and offer tracking. Convert accepted offers into new lease records.",
        whyMatters:
          "Property managers currently manage vacancy pre-marketing manually. A built-in pre-letting pipeline reduces the average time-to-lease for vacant properties and provides a measurable ROI metric.",
        segmentUnlocked:
          "Commercial real estate developers and property management companies with recurring vacancy events.",
        dealRisk:
          "Low deal risk — nice to have at Phase 2. Differentiates vs competitors who separate leasing and management.",
        priority: "P2",
        marketSignal:
          "Yardi and MRI offer pre-letting and CRM for commercial landlords. Differentiation opportunity for Lockated in the mid-market.",
      },
      {
        feature: "Maintenance SLA Reporting and Tenant Satisfaction",
        description:
          "Monthly SLA compliance report per property: % tickets resolved within SLA by priority, average resolution time, overdue ticket count, and tenant satisfaction score (collected via automated survey after ticket closure).",
        whyMatters:
          "Institutional property management companies are evaluated by landlord clients on SLA compliance. A built-in SLA report replaces manual compilation and provides a defensible performance record.",
        segmentUnlocked:
          "Property management companies, SEZ operators, corporate campus managers.",
        dealRisk:
          "Medium — required for contract renewal conversations between PM companies and their landlord clients.",
        priority: "P2",
        marketSignal:
          "Standard in enterprise FM platforms. Required for institutional PM company segment.",
      },
      {
        feature: "Property Valuation and Yield Analytics",
        description:
          "Asset valuation register linked to the financial module. Calculate gross and net rental yield per property (annual rent / last valuation). Track yield trends over time. Compare vs portfolio average and market benchmarks.",
        whyMatters:
          "Family offices and institutional landlords require yield analytics to make disposal, acquisition, and renovation investment decisions. Currently done in external financial models.",
        segmentUnlocked: "Family offices, institutional landlords, REITs.",
        dealRisk:
          "Low deal risk — analytics add-on. Increases ACV and retention.",
        priority: "P2",
        marketSignal:
          "Yardi has full asset management analytics including yield. Lockated opportunity to build this for the mid-market at a fraction of Yardi's cost.",
      },
      {
        feature: "Lease Abstraction from Document (AI)",
        description:
          "AI-powered extraction of key lease terms from uploaded PDF lease agreements: rent amount, escalation schedule, CAM terms, deposit amount, notice period, and special conditions. Reduces manual data entry for property managers onboarding an existing portfolio.",
        whyMatters:
          "Property management companies onboarding an existing portfolio of 100+ leases face weeks of manual data entry. AI abstraction cuts onboarding time by 60–70%, enabling faster go-live and reducing implementation costs.",
        segmentUnlocked:
          "All lessor clients onboarding existing portfolios. Especially valuable for property management companies taking over new client mandates.",
        dealRisk:
          "Not a blocker but significantly reduces time-to-value and implementation friction.",
        priority: "P2",
        marketSignal:
          "Nakisa and LeaseAccelerator offer AI lease abstraction. This is an emerging expectation for enterprise buyers.",
      },
    ],
  },
  {
    phase: "Phase 3",
    timeline: "9-24 Months (Medium Term)",
    focus: "Enterprise and REIT grade",
    items: [
      {
        feature: "ERP Bi-Directional Integration (SAP, Oracle, Tally)",
        description:
          "Native bi-directional integration with SAP, Oracle Financials, and Tally for rental income journal entries, expense coding, and financial reconciliation. Eliminates manual export-import between Lockated and accounting systems.",
        whyMatters:
          "Enterprise property companies and institutional landlords require ERP integration for financial close. Without it, finance teams maintain parallel records.",
        segmentUnlocked:
          "Enterprise and institutional lessor segment. Any deal above Rs 30 lakh/year requires ERP integration.",
        dealRisk:
          "Critical for enterprise deals above Rs 30 lakh/year. Blocking 3–5 large pipeline deals currently.",
        priority: "P1",
        marketSignal:
          "Yardi, MRI, and Nakisa all offer native SAP/Oracle integration. This is mandatory for enterprise.",
      },
      {
        feature: "REIT-Grade Investor Reporting Module",
        description:
          "Standardised investor reports for REITs and institutional landlords: rent roll report, NOI by asset, occupancy trend, lease expiry schedule, CAM reconciliation summary, and SEBI-compliant disclosure templates.",
        whyMatters:
          "REITs are required to publish standardised property performance data to investors. A built-in investor reporting module eliminates manual Excel compilation for the listed REIT segment.",
        segmentUnlocked:
          "SEBI-registered REITs (Brookfield, Embassy, Mindspace, Nexus Select), pre-REIT portfolio structures, institutional PE fund portfolios.",
        dealRisk:
          "Required for REIT segment entry. Opens Rs 50–200 lakh per deal opportunity.",
        priority: "P2",
        marketSignal:
          "Yardi has a dedicated REIT reporting module. No India-built platform offers this.",
      },
      {
        feature: "API Access for Integration with Property Marketing Platforms",
        description:
          "Open API for integration with commercial property listing platforms (99acres Commercial, JLL IQ, Cushman Digital) to push vacancy listings and receive lead data back into the Lockated pre-letting pipeline.",
        whyMatters:
          "Property managers currently post vacancies manually to listing platforms. API integration removes duplication and connects the leasing pipeline with the platform.",
        segmentUnlocked:
          "Property management companies and developers with regular vacancy events.",
        dealRisk: "Low blocker — differentiator and efficiency feature.",
        priority: "P3",
        marketSignal:
          "Emerging integration ecosystem for commercial real estate. First-mover advantage for Lockated in India.",
      },
      {
        feature: "Property Portfolio Benchmarking",
        description:
          "Compare portfolio metrics (occupancy, rent per sq ft, NOI margin, maintenance SLA compliance) against anonymised industry benchmarks derived from Lockated's aggregated client dataset. Provide Head of Asset Management with percentile rankings vs peers.",
        whyMatters:
          "Family offices and developers want to know if their portfolio performance is above or below market. Benchmarking creates a compelling data-driven renewal hook.",
        segmentUnlocked:
          "All lessor clients with 3+ months of data on the platform.",
        dealRisk: "Retention and upsell feature — not a deal condition.",
        priority: "P3",
        marketSignal:
          "Yardi and CoStar provide market benchmarking. Lockated's India-specific benchmarks would be uniquely valuable.",
      },
      {
        feature: "Automated Lease Termination and Deposit Refund Processing",
        description:
          "End-to-end lease termination workflow: notice receipt, handback inspection scheduling, damage assessment, deposit deduction calculation, refund approval workflow, and payment instruction generation — all within the platform.",
        whyMatters:
          "Lease termination currently involves significant manual coordination between legal, finance, and operations teams. A structured workflow reduces disputes, accelerates cash outflow, and ensures compliance with notice period terms.",
        segmentUnlocked:
          "All lessor clients. Especially valuable for property management companies managing multiple simultaneous terminations.",
        dealRisk: "Low deal risk — efficiency and risk management feature.",
        priority: "P3",
        marketSignal:
          "Standard in mature property management platforms. Required for institutional PM segment at scale.",
      },
    ],
  },
];

// ==================== TAB 7: BUSINESS PLAN ====================

export const businessPlanQuestions: BusinessPlanQuestion[] = [
  {
    question:
      "Q1: Why does your company exist? What impact are you here to make?",
    suggestedAnswer:
      "We exist because large Indian organisations - retail chains, conglomerates, BFSI companies, and PSUs - are managing their most significant fixed cost (real estate) on Excel spreadsheets. A Head of Real Estate at a 300-store retail chain cannot tell you in real time how many leases expire this quarter, what your total rent liability is, or whether you are overpaying rent because your escalation clause was not tracked. We are here to fix that. Lockated's Lease Management gives these organisations the command-centre visibility and operational structure they need to stop overpaying rent, pass every audit, and negotiate renewals from a position of data. Our longer-term impact: we believe India's Rs 340 billion commercial real estate market cannot professionalise without enterprise-grade software built specifically for India's regulatory reality - IND AS 116, GST compliance, Indian compliance documents - and India's data sovereignty requirements.",
    source:
      "Draws from Tab 1 (Product Summary - Core Mission, The Problem It Solves, Competitive Moat Today) and Tab 3 (Market Analysis - Target Audience pain points)",
    founderNote:
      "Ready to use as-is. Founder may wish to personalise the opening with a specific client story or personal motivating experience.",
  },
  {
    question:
      "Q2: What 4-5 values or behaviours best represent your team or culture?",
    suggestedAnswer:
      "1. Data sovereignty as a non-negotiable principle: every product decision defaults to protecting client data. We never compromise on client server-side deployment. 2. India-first commercial real estate specificity: we solve Indian regulatory problems first (IND AS 116, GST on rent, Indian compliance documents) before generic document storage. 3. Operational obsession over feature accumulation: we would rather one module work perfectly in the field than ship 10 modules that Facility Managers and Finance teams abandon after two weeks. Adaptability is the measure of product quality — if Customer Success tells us the product without being asked by a Head of Real Estate or Finance Manager 'we've been reminded to log into Lockated, we have failed. The product must be the daily operating system, not a reporting tool that you visit monthly. 5. Audit readiness as the standard, not a feature: every action in the platform is logged, attributed, and exportable. We build for the auditor in the room, not the optimist.",
    source:
      "Draws from Tab 1 (Core Mission, Competitive Moat) and Tab 4 (Positioning - What we should STOP saying)",
    founderNote:
      "Requires founder input - these values should be verified against the actual founding team's lived experience and cultural commitments. Adjust language to reflect the team's authentic voice.",
  },
  {
    question: "Q3: What are the USPs that make you stand out from competitors?",
    suggestedAnswer:
      "Our three genuine, defensible differentiators are: First, data sovereignty with client-side deployment. Every global competitor — Yardi, MRI, Nakisa, Tango, Visual Lease — stores client data in their own cloud. For the 45% of Indian enterprise buyers in regulated industries, government, or with data residency obligations, this is a total blocker. We are the only enterprise lease platform in India that deploys on the client's own infrastructure. Second, end-to-end compliance coverage in a single platform. Competitors focus on either lease accounting (Nakisa, Visual Lease) or property operations (Yardi, MRI). We combine lease lifecycle management, rent tracking, compliance, AMC, maintenance, and utilities in one platform. This means our clients replace 3 to 5 tools with one, and our ACV reflects that breadth. Third, India-first design: GST-compliant invoice generation, IND AS 116 support (Phase 1 roadmap), IND AS 18 journal export, Fire NOC and Shop Act compliance tracking, Tally export, INR pricing, and a location hierarchy built for India's geographic structure (Region, Zone, City, Circle) are in the product. These are not afterthoughts.",
    source:
      "Draws from Tab 1 (Competitive Moat Today), Tab 2 (USP-flagged features), Tab 4 (Section 4: Feature Comparison - AHEAD statuses)",
    founderNote:
      "Ready to use as-is. Founder should verify the data sovereignty claim is still accurate and add any new differentiators developed after this document was created.",
  },
  {
    question:
      "Q4: What bold outcome do you want to achieve in the next 10-15 years? (BHAG)",
    suggestedAnswer:
      "In 15 years, every commercial lease in India — from a 5,000 sqft office to a 2 million sqft logistics park — runs through a Lockated-powered platform. India's Rs 860 billion commercial real estate market (projected by 2035) is professionally managed, with every lease payment tracked, every compliance document current, every maintenance ticket resolved within SLA, and every property operating with full financial transparency. We are India's default operating system for commercial real estate — the way Salesforce is for CRM or SAP is for ERP — the operating standard that enterprises do not question. Globally, we are the preferred lease management platform for any organisation that requires data sovereignty — Southeast Asia, South Asia, and markets where enterprise data must stay within national borders.",
    source:
      "Draws from Tab 3 (India commercial real estate market size projections: Rs 860 billion by 2035), Tab 1 (Geography and Key markets), Tab 4 (Positioning - data sovereignty)",
    founderNote:
      "Requires founder input - verify alignment with the founding team's actual long-term vision. The BHAG must be emotionally true for the founders, not just strategically constructed.",
  },
  {
    question:
      "Q5: What do you want to achieve in the next 3-5 years? (revenue, territories, scale)",
    suggestedAnswer:
      "In 3 years: 150 enterprise clients in India across retail chains, BFSI, corporate real estate, and property management companies. ARR of Rs 25-40 crore. Reference clients in at least 5 sectors visible in the market. Phase 1 and Phase 2 roadmap items (IND AS 116 module, SAP integration, AI lease abstraction, mobile app, multi-entity support) fully deployed and generating upsell revenue. In 5 years: 400+ enterprise clients, ARR of Rs 75-100 crore, with a Southeast Asia presence (Singapore, Malaysia, Vietnam) targeting multinational occupiers with India and regional portfolio requirements. Data sovereignty positioning extended to APAC markets with similar regulatory requirements. A certified partner network of 15-20 implementation and advisory partners (Big 4 advisory firms, real estate consulting firms).",
    source:
      "Draws from Tab 3 (market size and growth), Tab 6 (Phase 1 and 2 revenue impact estimates), Tab 8 (GTM Strategy - TG definitions and 90-day sequence)",
    founderNote:
      "Requires founder input - ARR targets and timeline must be verified against the company's current revenue base, team size, and funding state. Adjust numbers to reflect defensible internal projections.",
  },
  {
    question: "Q6: What are your main business goals for this financial year?",
    suggestedAnswer:
      "For FY 2025-26 our four primary goals are: 1. Sign 25 paying enterprise clients with minimum Rs 5 lakh annual contract value each, generating Rs 1.25-2 crore in new ARR. Target segments: retail chains (8 clients), corporate real estate teams (10 clients), property management companies (7 clients). 2. Deploy Phase 1 roadmap by Q2: IND AS 116 basic module, Tally export, bulk lease import template, mobile app (MVP), and rent escalation automation. This unblocks the 30% of pipeline deals currently blocked by product gaps. 3. Build 3-5 public reference clients who will speak at CREDAI or CII Real Estate events and generate case studies for sales materials. 4. Establish 2 Big 4 advisory firm partnerships (Deloitte or EY preferred) for compliance-driven lead generation through IND AS 116 implementation projects.",
    source:
      "Draws from Tab 6 (Phase 1 roadmap items and revenue estimates), Tab 8 (GTM - 90-day launch sequence), Tab 9 (Metrics - 30-day and 3-month targets)",
    founderNote:
      "Requires founder input - verify FY alignment (April to March for India), confirm current ARR baseline, and adjust target numbers based on current pipeline data. Big 4 partnership status should be confirmed or adjusted.",
  },
  {
    question:
      "Q7: Which customer segments or geographies will you focus on this year?",
    suggestedAnswer:
      "Segment priority 1: Retail chains with 100-500 stores across India. Highest urgency, highest frequency of lease events (constant renewals), India-specific compliance requirements, and no adequate India-built tool at their scale. Target accounts: mid-size fashion chains, pharmacy chains, QSR operators, and specialty retail. Average ACV target: Rs 12-20 lakh per year. Segment priority 2: Corporate real estate teams at large Indian enterprises in BFSI, IT, and FMCG sectors. Driven by IND AS 116 compliance mandates and CFO mandate for real-time visibility. Average ACV target: Rs 15-30 lakh per year. Segment priority 3: Property management companies managing 50-200 commercial properties. Multiplier effect: one PM firm client brings all managed properties onto the platform. Average ACV target: Rs 8-15 lakh per year. Geography: All Tier 1 cities (Mumbai, Delhi NCR, Bangalore, Chennai, Hyderabad, Pune) plus selected Tier 2 retail markets (Ahmedabad, Chandigarh, Kochi). No GCC markets this year.",
    source:
      "Draws from Tab 3 (Audience Segments), Tab 5 (Use Cases - ranked industries), Tab 4 (Positioning - segments to prioritise this year)",
    founderNote:
      "Requires founder input - confirm these are the segments where active conversations already exist. Sales leader should validate against current CRM pipeline composition.",
  },
  {
    question:
      "Q8: What 3 key actions or projects will help you achieve this year goals?",
    suggestedAnswer:
      "Action 1: Build and deploy the Phase 1 product roadmap in 90 days. The 5 items — IND AS 116 module, mobile app MVP, Tally export, bulk import template, rent escalation automation — together unblock 30-40% of the current blocked pipeline. This is the highest-leverage action available today because it converts existing demos into signed deals. Action 2: Execute the 90-day GTM launch sequence (Tab 8) — 3 target groups, personalised outreach, demo-to-proposal motion, and reference client cultivation. Action 3: Hire and onboard a dedicated Enterprise Sales Lead and SDR to run outbound sequences and manage the demo pipeline end-to-end.",
    source:
      "Draws from Tab 6 (Phase 1 roadmap), Tab 8 (GTM Strategy - TG 1 and TG 2 sales motion and 90-day launch sequence), Tab 4 (Positioning - GTM motion Year 1)",
    founderNote:
      "Requires founder input - confirm team capacity to execute Phase 1 roadmap in 90 days. Sales motion requires a sales lead or SDR. Partner outreach requires a relationship with at least one Big 4 contact.",
  },
  {
    question:
      "Q9: What are the key numbers and metrics you should regularly track?",
    suggestedAnswer:
      "Weekly leadership metrics: 1. Outbound sequence conversion rate (demo booked per 100 emails sent - target 3-5%). 2. Pipeline by stage and segment (target 30 active opportunities at any time). 3. Demo-to-proposal conversion (target 60%). Weekly product metrics: 4. DAU and WAU of paying clients (target 70% of users active weekly within 60 days of go-live - activation signal). 5. Module adoption rate by client (target all active clients using at least 5 modules within 90 days). Monthly business metrics: 6. New ARR signed (target Rs 10-15 lakh per month in Month 1-3, Rs 20-30 lakh per month by Month 6). 7. Net Revenue Retention (target 110% at 12 months - expansion from module upsell). 8. Time to value (days from contract signing to first active lease records - target 21 days). 9. Support ticket volume per client (target less than 5 tickets per client in Month 1). 10. North Star: Total Lease Records Under Active Management on Platform (target 5,000 active leases by Month 12).",
    source:
      "Draws from Tab 9 (Metrics - both client impact and launch tracking sections), Tab 8 (GTM Strategy - success metrics per TG)",
    founderNote:
      "Requires founder input - verify current baseline for each metric. Time to value of 21 days requires the bulk import template (Phase 1 roadmap) to be live. Adjust targets based on current team size and operational bandwidth.",
  },
  {
    question:
      "Q10: What improvements do you need in your people or processes to succeed?",
    suggestedAnswer:
      "People - 3 priority hires this year: 1. Enterprise Sales Lead (experience selling SaaS to CFOs and Head of Real Estate at Indian enterprises, strong network in BFSI or retail real estate, 5+ years B2B SaaS). 2. Product Manager with domain expertise in lease management, compliance, or real estate operations (can own Phase 1 and Phase 2 roadmap execution with engineering). 3. Customer Success Manager focused on enterprise onboarding (reduce time to value from current 4-6 weeks to 21 days for every new client). Process improvements: 1. Standardise the demo flow to a 45-minute structured demo that leads with data sovereignty, shows the renewal pipeline, and ends with a compliance module walk-through. Script this for all sales conversations. 2. Build a client onboarding playbook covering data migration, bulk import, user training, and first 30-day success metrics. Without this playbook, every onboarding is bespoke and slow. 3. Implement a formal Win-Loss analysis process: interview every lost deal within 7 days of loss to identify whether product gaps, pricing, or sales execution caused the loss. This data directly drives product roadmap prioritisation.",
    source:
      "Draws from Tab 8 (GTM - Champion and Economic Buyer profiles per TG), Tab 6 (Phase 1 roadmap - all items require product and engineering resourcing), Tab 9 (Metrics - time to value and activation rate)",
    founderNote:
      "Requires founder input - hiring plans must be confirmed against current funding state. The 3 hires listed represent a minimum viable team for enterprise sales. Founder should add specific names being recruited if relevant.",
  },
];

export const lessorBusinessPlanQuestions: BusinessPlanQuestion[] = [
  {
    question:
      "Q1: Why does your company exist? What impact are you here to make? (LESSOR)",
    suggestedAnswer:
      "We exist because property owners, developers, and property management companies in India — the people who own and operate the Rs 340 billion commercial real estate market — are managing their most valuable income-generating assets on Excel spreadsheets, WhatsApp groups, and manual billing processes. A Head of Asset Management at a developer with 50 commercial properties cannot tell you in real time how much rent is overdue, which tenants are about to exit, or whether their portfolio is generating the yield that investors were promised. We are here to fix that. Lockated's Lease Management gives these property owners and managers the command-centre visibility and operational structure to collect rent reliably, retain tenants proactively, manage compliance confidently, and report to investors with confidence. Our longer-term impact: professionalising the management of India's built commercial real estate through purpose-built software that respects India's regulatory requirements and data sovereignty obligations.",
    source: "Founders, investors, partners seeking the lessor segment thesis.",
  },
  {
    question:
      "Q2: Who is your target customer and what is their specific pain? (LESSOR)",
    suggestedAnswer:
      "Our primary target is the Head of Asset Management or CFO at Indian commercial real estate developers, property management companies, mall operators, and industrial park operators managing 50 to 500+ leased properties. Their specific pain is threefold: (1) No real-time visibility — they cannot see total rental income vs target, overdue tenant rents, or compliance status without assembling multiple spreadsheets; (2) Manual billing — GST-compliant rent and utility invoices to tenants are generated manually each month, with frequent errors and delays; (3) Reactive management — lease renewals, compliance filings, and tenant relationship issues are managed reactively rather than through a structured calendar-driven workflow. The secondary target is the property management company managing multiple landlord portfolios without a unified platform for all clients.",
    source: "Investors, sales teams understanding lessor buyer profile.",
  },
  {
    question: "Q3: What is your solution and how does it work? (LESSOR)",
    suggestedAnswer:
      "Lockated's Lease Management for lessors is a 16-module SaaS platform deployed on the client's own servers. The platform covers the full property management lifecycle: creating and managing outgoing lease agreements with tenants, tracking rent receivables with automated invoice dispatch and payment reminders, managing tenant relationships including communication logs and dispute tracking, handling maintenance tickets raised by tenants with SLA monitoring, managing AMC contracts for building services, tracking compliance renewals (Fire NOC, CC, OC), and generating financial reports including NOI by property, OPEX vs budget, and rental income forecasts. All client data stays on the client's own infrastructure — making Lockated the only data-sovereign commercial property management platform in India.",
    source: "Product demos, investor decks, partner briefings.",
  },
  {
    question: "Q4: What is your business model? (LESSOR)",
    suggestedAnswer:
      "Annual SaaS subscription priced per property per year, with enterprise flat-license options for large portfolios. Three pricing tiers: Rs 3,000–8,000 per property per year for small landlords (up to 25 properties); Rs 2,000–5,000 per property per year for mid-market (25–100 properties); Rs 50–150 lakh flat annual license for enterprise and institutional clients (100+ properties). Additional revenue streams: one-time implementation and data migration fees (Rs 2–10 lakh per engagement), modular add-ons (tenant portal, compliance module, multi-client management), and API access fees for ERP integration. Professional services revenue from managed onboarding engagements.",
    source: "Finance teams, investors, pricing discussions.",
  },
  {
    question: "Q5: What is your competitive advantage? (LESSOR)",
    suggestedAnswer:
      "Three unfair advantages: (1) Data sovereignty — the only commercial property management platform in India deployed on client-owned servers. This is non-negotiable for regulated entities, PSUs, and family offices managing sensitive portfolio data. No global competitor offers on-premise deployment. (2) India-first commercial real estate specificity — built for India's commercial lease context: GST on commercial rent income (18%), Indian compliance documents (Fire NOC, CC, OC, property tax), IND AS 116 / IND AS 17 accounting standards, and INR pricing at 80–90% lower cost than global platforms. (3) End-to-end operations coverage — lease management + tenant billing + receivables tracking + maintenance management + compliance + AMC in one platform. Replacing Yardi requires the same data sovereignty argument but at 10x the cost, 12 months of implementation, and a foreign cloud.",
    source: "Investor presentations, sales objection handling.",
  },
  {
    question:
      "Q6: What is your go-to-market strategy for the lessor segment? (LESSOR)",
    suggestedAnswer:
      "Three target groups pursued simultaneously: (1) Commercial real estate developers and family offices with 50–300 properties — entered via direct enterprise sales through the founder and a dedicated enterprise account manager, targeting CFO and Head of Asset Management. Average ACV Rs 12–30 lakh/year. (2) Property management companies managing 100–1,000 properties for multiple clients — entered via a consultative partnership model, positioning Lockated as their platform of record. White-label option for large PMs. Average ACV Rs 8–25 lakh/year. (3) Mall operators, industrial park operators, and SEZ operators — entered via industry associations (MAPIC India, CREDAI, FICCI real estate committee) and sector-specific events. Average ACV Rs 10–35 lakh/year. All three segments pursued with India-first messaging: data sovereignty, GST compliance, India support, INR pricing.",
    source: "Sales teams, investors, partners building lessor GTM.",
  },
  {
    question:
      "Q7: What does your financial model look like for the lessor segment? (LESSOR)",
    suggestedAnswer:
      "Year 1 lessor revenue target: Rs 1.5–2.5 crore from 8–15 initial lessor clients. Year 2 target: Rs 5–8 crore from 25–40 clients as property management company segment activates. Year 3 target: Rs 12–18 crore from 60–90 clients as REIT and institutional segment opens with the IND AS 17 module. Average ACV across the lessor segment is Rs 15–25 lakh/year vs Rs 10–15 lakh/year for the lessee segment — property management companies manage larger portfolios and require more modules. Gross margin: 70–75% at scale (same as lessee). CAC: Rs 3–6 lakh per client for enterprise, Rs 1–2 lakh for mid-market (lower than lessee due to word-of-mouth within property management community). LTV/CAC target: 8–12x.",
    source: "Finance teams, investors, board reporting.",
  },
  {
    question:
      "Q8: What are your key risks and how do you mitigate them? (LESSOR)",
    suggestedAnswer:
      "Three primary risks: (1) Yardi or MRI launching India-specific pricing and on-premise deployment before we achieve market penetration — mitigated by building deep India-specific compliance (GST rental income filing, IND AS 17, India NOC/CC/OC frameworks) that takes 18–24 months to replicate. (2) Multi-client isolation architecture complexity delaying the property management company segment entry — mitigated by prioritising multi-client as a P1 build item alongside the IND AS 17 module. (3) India commercial real estate market concentration in 10 developers owning 60%+ of Grade-A office stock (DLF, Godrej, Prestige, Embassy, Brookfield) who may use bespoke or global platforms — mitigated by targeting the mid-market (50–300 property developers, property management companies, industrial parks) where Lockated's price-to-value advantage is strongest.",
    source: "Risk management, board discussions, investor Q&A.",
  },
  {
    question: "Q9: What does success look like in 3 years? (LESSOR)",
    suggestedAnswer:
      "Three-year success definition for the lessor segment: (1) 80–120 commercial real estate lessor clients managing a combined 5,000+ leased properties on Lockated. (2) At least 3 multi-tenant grade REIT / large developer or PE fund real estate entity using Lockated for investor-grade reporting. (3) First-mover position in the India property management company segment with 15+ professional PM companies using Lockated as their platform of record. (4) Rs 12–18 crore in lessor segment ARR. (5) Lockated recognised as the default India-built commercial property management platform — the answer to 'what platform do property owners use when asked what platform they use to manage their portfolio.'",
    source: "Strategy reviews, investor updates, team alignment.",
  },
  {
    question: "Q10: What do you need to get there? (LESSOR)",
    suggestedAnswer:
      "Three things needed in the next 12 months: (1) Product: Build IND AS 17 lessor accounting module (P1), tenant self-service portal (P1), multi-client management for property management companies (P1), and GST rental income filing integration (P1). These four features unlock the primary lessor segments. (2) Sales: Hire a dedicated lessor segment enterprise account manager and a property management company specialist. The lessor buyer (Head of Asset Management at a developer, MD at a property management company) is a different buyer than the lessee Head of Real Estate — they need a dedicated sales motion. (3) Partnerships: Establish formal partnerships with CREDAI member associations, top-10 Indian property management companies, and at least 2 REIT asset managers to build referral credibility in the institutional segment.",
    source: "Founders, investors, hiring and product planning.",
  },
];

export const founderReviewChecklist: {
  question: string;
  whatToVerify: string;
}[] = [
  {
    question:
      "Q2: What 4-5 values or behaviours best represent your team or culture?",
    whatToVerify:
      "These values should be verified against the actual founding team's lived experience and cultural commitments. Adjust language to reflect the team's authentic voice.",
  },
  {
    question:
      "Q4: What bold outcome do you want to achieve in the next 10-15 years? (BHAG)",
    whatToVerify:
      "Verify alignment with the founding team's actual long-term vision. The BHAG must be emotionally true for the founders, not just strategically constructed.",
  },
  {
    question:
      "Q5: What do you want to achieve in the next 3-5 years? (revenue, territories, scale)",
    whatToVerify:
      "ARR targets and timeline must be verified against the company's current revenue base, team size, and funding state. Adjust numbers to reflect defensible internal projections.",
  },
  {
    question: "Q6: What are your main business goals for this financial year?",
    whatToVerify:
      "Verify FY alignment (April to March for India), confirm current ARR baseline, and adjust target numbers based on current pipeline data. Big 4 partnership status should be confirmed or adjusted.",
  },
  {
    question:
      "Q7: Which customer segments or geographies will you focus on this year?",
    whatToVerify:
      "Confirm these are the segments where active conversations already exist. Sales leader should validate against current CRM pipeline composition.",
  },
  {
    question:
      "Q8: What 3 key actions or projects will help you achieve this year goals?",
    whatToVerify:
      "Confirm team capacity to execute Phase 1 roadmap in 90 days. Sales motion requires a sales lead or SDR. Partner outreach requires a relationship with at least one Big 4 contact.",
  },
  {
    question:
      "Q9: What are the key numbers and metrics you should regularly track?",
    whatToVerify:
      "Verify current baseline for each metric. Time to value of 21 days requires the bulk import template (Phase 1 roadmap) to be live. Adjust targets based on current team size and operational bandwidth.",
  },
  {
    question:
      "Q10: What improvements do you need in your people or processes to succeed?",
    whatToVerify:
      "Hiring plans must be confirmed against current funding state. The 3 hires listed represent a minimum viable team for enterprise sales. Founder should add specific names being recruited if relevant.",
  },
];

// ==================== TAB 8: GTM STRATEGY ====================

export const gtmTargetGroups: GTMTargetGroup[] = [
  {
    name: "TARGET GROUP 1 — INDIA RETAIL CHAINS (100-500 STORES)",
    profile:
      "Company size: 200-5000 employees | Industry: Fashion, Grocery, QSR, Pharmacy, Electronics retail | Geography: Pan-India, Tier 1 and 2 cities | Buyer: Head of Real Estate / Director Property | Budget: Rs 8-25 lakh/year for lease management software | Current stack: Excel tracker + shared drive + Outlook calendar + standalone accounting software.",
    elements: [
      {
        element: "ICP Definition",
        details:
          "Retail chain with 100+ active store leases, Head of Real Estate or Director Property as title, India-headquartered, annual lease spend above Rs 10 crore. Highest fit: fashion, pharmacy, and QSR chains where store lease cost is 8-15% of revenue. Disqualify: single-city operators or e-commerce-only businesses.",
      },
      {
        element: "Lead Source",
        details:
          "LinkedIn Sales Navigator (search: Head of Real Estate + retail company + 200+ employees), real estate industry events (CREDAI, Shopping Centres Association of India, CII Retail Summit), referrals from retail consulting firms (Technopak, KPMG Real Estate practice), and inbound from SEO content on 'lease management software for retail chains India'.",
      },
      {
        element: "Outreach Approach",
        details:
          "Personalised LinkedIn message or cold email leading with a pain point specific to retail lease management: 'I noticed you have 200+ stores across India. Most retail real estate teams tell us their biggest challenge is tracking 30 simultaneous lease renewals without missing a window. Can I show you how we solve that in 20 minutes?' Attach a one-page retail-specific capability PDF.",
      },
      {
        element: "First Meeting Agenda",
        details:
          "15 minutes: discovery questions - how many leases, current tool, biggest pain (renewal tracking vs compliance vs OPEX visibility). 20 minutes: live demo focused on Renewal Pipeline and Proposed vs Current Rent Comparison. 10 minutes: data sovereignty positioning and India-specific compliance module. 5 minutes: next step - 2-week pilot with their actual data.",
      },
      {
        element: "Demo Flow",
        details:
          "Open with the Portfolio Overview Dashboard showing 200 leases. Navigate to the Lease Expiry Distribution widget - show 35 leases expiring in 90 days. Open Renewal Pipeline and show the three-stage Kanban. Open one lease and show Proposed vs Current Rent Comparison with negotiation brief. Show Compliance Management for FSSAI and Shop Act. End with the Audit Logs for All Changes.",
      },
      {
        element: "Deal Velocity Target",
        details:
          "Target 45-60 days from first demo to signed contract. Key stages: Demo (Week 1), Proposal (Week 2-3), Pilot with 50 live leases (Week 3-6), Contract negotiation (Week 6-8). Decision makers: Head of Real Estate (product champion) and CFO or COO (economic approver).",
      },
      {
        element: "Primary Sales Motion",
        details:
          "Value-based direct sales (outbound to product champion, co-sell with CFO as economic buyer). Not self-service. Not PLG. Retail Head of Real Estate wants a human-guided evaluation before committing budget.",
      },
      {
        element: "Why This Motion",
        details:
          "Retail chains have complex multi-person buying committees (Real Estate + Finance + IT). The deal value (Rs 12-20 lakh ARR) justifies a 60-day sales cycle with 2-3 stakeholder meetings. Self-service or freemium would miss the Finance and IT sign-off steps.",
      },
      {
        element: "Recommended Opening Hook",
        details:
          "Your team is tracking 200 lease renewals on Excel. The average retail chain with your portfolio size misses 3-5 renewal windows per year and renegotiates reactively - paying 18-25% more than proactive renewals. Lockated's renewal pipeline has never let a client miss a renewal window. Want to see why?",
      },
      {
        element: "Economic Buyer",
        details:
          "CFO or COO. Identify by asking the Head of Real Estate: 'Who approves software spend above Rs 5 lakh?' CFO is triggered by IND AS 116 compliance and total occupancy cost visibility. COO is triggered by operational risk reduction.",
      },
      {
        element: "Champion",
        details:
          "Head of Real Estate or Director Property. They feel the pain daily. They will push for budget if you solve their renewal and compliance tracking problem during the pilot.",
      },
      {
        element: "Co-Champion",
        details:
          "Finance Manager or CFO's direct report - they benefit from automated rent reconciliation and GST-compliant invoicing. Bring them into demo at Week 2.",
      },
      {
        element: "Blocker to Anticipate",
        details:
          "IT security team raising data residency questions about cloud storage. Pre-empt by leading with the data sovereignty positioning: 'Your data stays on your servers. We never touch it.'",
      },
      {
        element: "What Closes This TG",
        details:
          "A successful 2-week pilot where the Head of Real Estate loads 50 live leases, sees upcoming renewals flagged automatically, and receives a compliance alert for one expiring document. The emotional moment of 'this would have saved me 3 hours this week' closes the deal. Followed by a total cost of ownership comparison with Tango Analytics or Excel status quo.",
      },
    ],
    marketingChannels: [
      {
        channel: "LinkedIn (Sponsored + Organic)",
        relevant: "YES",
        executionApproach:
          "Targeted posts and sponsored content to Heads of Real Estate and CFOs at retail companies (50+ store employee threshold). Content: lease renewal case studies, India compliance guides, retail lease cost analysis.",
        priorityRank: 1,
        expectedOutput: "5-10 demo-qualified leads per month at scale.",
        budgetTimeline: "Rs 1-2 lakh/month ad spend. 2 posts per week organic.",
      },
      {
        channel: "Content and SEO",
        relevant: "YES",
        executionApproach:
          "Publish long-form India-specific content: 'How to manage 200 lease renewals simultaneously', 'IND AS 116 compliance guide for retail chains', 'India commercial lease benchmark data by city'. Target commercial lease management keywords.",
        priorityRank: 2,
        expectedOutput:
          "50-100 monthly organic visits by Month 6. Rs 50k-1 lakh/month for content writer. 6-month SEO ramp. 3-5 inbound demo requests per month by Month 8.",
        budgetTimeline:
          "Rs 50k-1 lakh/month for content writer. 6-month SEO ramp.",
      },
      {
        channel: "Events and Conferences",
        relevant: "YES",
        executionApproach:
          "CREDAI annual summit, Shopping Centres Association of India (SCAI) events, CII Retail Summit. Speaking slot or booth presence. Demo station at events.",
        priorityRank: 3,
        expectedOutput:
          "10-20 qualified conversations per event. 3-5 follow-up demos.",
        budgetTimeline: "Rs 2-5 lakh per event for booth or sponsorship.",
      },
      {
        channel: "Email Outbound",
        relevant: "YES",
        executionApproach:
          "Cold email sequences to Director Property at top 200 Indian retail chains. 5-email sequence over 14 days. Personalise with company name and lease portfolio size estimate.",
        priorityRank: 2,
        expectedOutput:
          "3-5 demo bookings per 100 emails sent (3-5% response rate target).",
        budgetTimeline:
          "Tool cost Rs 5k-20k/month (Lemlist, Instantly). Content cost Rs 20k for sequence writing.",
      },
      {
        channel: "Partner Referrals (Real Estate Consulting)",
        relevant: "YES",
        executionApproach:
          "Formal referral agreements with JLL India, CBRE India, Cushman and Wakefield India. They advise retail chains on lease strategy. Lockated solves the operational problem after advisory.",
        priorityRank: 4,
        expectedOutput:
          "5-8 warm introductions per quarter per active partner.",
        budgetTimeline:
          "Zero direct cost. Requires 3-6 months to activate partner pipeline.",
      },
      {
        channel: "Product Directories (G2, Capterra, India Software Suggest)",
        relevant: "YES",
        executionApproach:
          "List on top India SaaS directories. Actively solicit reviews from early users. Optimise listing for 'lease management software India' search.",
        priorityRank: 4,
        expectedOutput:
          "3-8 inbound leads per month by Month 6 from directories.",
        budgetTimeline:
          "Rs 30k-60k/month for premium listing on Software Suggest or Capterra.",
      },
      {
        channel: "Cold Calling and SDR Outreach",
        relevant: "YES",
        executionApproach:
          "SDR team calling Heads of Real Estate at retail chains. 3-touch LinkedIn research first. Qualify: call target 2 minutes max, qualify on lease count and current tool.",
        priorityRank: 3,
        expectedOutput: "2-3 demo bookings per SDR per week.",
        budgetTimeline: "1 SDR at Rs 30-40k/month loaded cost.",
      },
      {
        channel: "YouTube and Video Content",
        relevant: "SELECTIVE",
        executionApproach:
          "Short 3-5 minute product demo videos. 'How Lockated manages 200 lease renewals and IND AS 116 compliance in 10 minutes.' Published on YouTube and LinkedIn.",
        priorityRank: 5,
        expectedOutput:
          "Supports sales process. Buyers who watch product videos have 30% higher close rate.",
        budgetTimeline: "Rs 20-40k. 1 video. 1 per month.",
      },
      {
        channel: "Industry Associations",
        relevant: "SELECTIVE",
        executionApproach:
          "CREDAI membership, SCAI membership, RAI (Retailers Association of India). Present at member events. Access to member directories for outreach.",
        priorityRank: 5,
        expectedOutput:
          "Brand credibility with enterprise buyers who vet vendors through association membership.",
        budgetTimeline: "Rs 1-2 lakh/year membership.",
      },
      {
        channel: "Paid Ads (Google)",
        relevant: "SELECTIVE",
        executionApproach:
          "Search ads for 'lease management software India', 'commercial lease management tool', 'IND AS 116 software'. Nail small intent-based buyers who are on LinkedIn and Google, not social.",
        priorityRank: 5,
        expectedOutput:
          "5-10 clicks per day at Rs 150-300 per click for relevant commercial real estate software terms.",
        budgetTimeline:
          "Rs 1-2 lakh/month. ROI positive only after IND AS 116 module is live (increases search relevance).",
      },
    ],
    launchSequence: [
      {
        week: "Week 1",
        salesAction:
          "Build LinkedIn prospect list: 100 Heads of Real Estate at retail chains. Configure email sequence. Send first 50 outbound emails.",
        marketingAction:
          "Publish retail-specific case study or blog: 'How India's retail chains lose 17% on lease renewals each year.'",
        keyProductMilestones: "Bulk import template ready.",
        successMetric:
          "20 emails sent. 2 replies. List of 100 prospects researched and validated.",
      },
      {
        week: "Week 2",
        salesAction:
          "Send 50 more emails. Follow up on Week 1 replies. Book first 3 demos.",
        marketingAction:
          "Launch LinkedIn sponsored post. Targeted at Head of Real Estate at 200+ store retailers.",
        keyProductMilestones: "Demo environment loaded.",
        successMetric:
          "6 demos booked. LinkedIn paid achieving 2-3% engagement rate with 50 results per week.",
      },
      {
        week: "Week 3",
        salesAction:
          "Run 5+ demos. Send proposals to 2 qualified leads. Begin 2 pilot conversations.",
        marketingAction:
          "SEO blog: 'lease management software comparison India retail chains'. Target head terms.",
        keyProductMilestones:
          "Compliance management module (FSSAI and Shop Act compliance alerts) live.",
        successMetric: "3 pilot agreements signed or verbal go-ahead.",
      },
      {
        week: "Week 4",
        salesAction:
          "Run 3+ more demos. 2 pilots active with real data. First pilot feedback call.",
        marketingAction:
          "Submit to G2 and Software Suggest India listings. Request reviews from 2 existing clients.",
        keyProductMilestones:
          "Mobile app MVP released. 2 active pilots. 1 directory listing live. First client review submitted.",
        successMetric:
          "First client review submitted to pilot users for field testing.",
      },
      {
        week: "Biggest risk — Days 1-30",
        salesAction:
          "Head of Real Estate interested but CFO not engaged. Mitigation: ask in Week 2 'who else should be in the room for a 45-minute demo?' and bring CFO in at Week 3 demo.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Week 5",
        salesAction:
          "Convert 1 pilot to paid contract. Send contracts to 2 prospects. Continue outbound to 50 new prospects.",
        marketingAction:
          "Publish video walkthrough: 'Lease renewal pipeline in Lockated - 3 minutes'.",
        keyProductMilestones:
          "IND AS 116 basic module. 1 first paid contract signed. 50 new prospects in outbound. live. Can demo to listed company buyers.",
        successMetric: "",
      },
      {
        week: "Week 6",
        salesAction:
          "Second paid contract target. Begin CREDAI event outreach for speaking slot or attendance.",
        marketingAction:
          "LinkedIn organic post: client success story (anonymised). Sponsored ad targeting CFOs at retail companies.",
        keyProductMilestones:
          "Rent escalation automation live. Can demo automated compliance renewal alerts.",
        successMetric:
          "2 contracts signed by end of Week 6. 1 CREDAI event confirmed.",
      },
      {
        week: "Week 7",
        salesAction:
          "3 pilots in progress. Weekly pilot success calls with each. Identify expansion opportunities (additional users, additional properties).",
        marketingAction:
          "Email newsletter to prospect list: 'IND AS 116 compliance: what retail CFOs need to do before year end.'",
        keyProductMilestones:
          "Tally export functionality live. Demo to Tally-using prospects.",
        successMetric: "3 active paid clients. 1 client using Tally export.",
      },
      {
        week: "Week 8",
        salesAction:
          "Review pipeline: 30 outreach targets, 10 demos done, 5 proposals sent, 3 pilots, 2-3 paid. Adjust messaging based on demo-to-proposal conversion.",
        marketingAction:
          "Case study published (with client permission): 'How [retail chain] manages 150 lease renewals with Lockated'.",
        keyProductMilestones:
          "Mobile app available on iOS and Android for pilot Month 2.",
        successMetric:
          "30-day pipeline review complete. Case study live. 3 paid clients by end of.",
      },
      {
        week: "Biggest risk — Days 31-60",
        salesAction:
          "Pilot clients not loading enough real data - they test with dummy data and cannot see value. Mitigation: assign a dedicated onboarding manager to each pilot and run a data migration workshop in Week 1 of pilot.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Week 9-10",
        salesAction:
          "In-person visits by Week 10. Begin reference client programme: ask 2 paid clients to participate in case study and referral scheme.",
        marketingAction:
          "Submit to SCAI (Shopping Centres Association) event. Publish second SEO blog.",
        keyProductMilestones:
          "SAP integration MVP available for pilot with one enterprise client.",
        successMetric:
          "6 paid clients. 2 in reference programme. 1 speaking slot confirmed or submitted.",
      },
      {
        week: "Week 11-12",
        salesAction:
          "Target 8-10 paid clients by end of 90 days. First renewal upsell conversation or month 1 client (additional users or properties).",
        marketingAction:
          "Publish retail lease industry benchmark data. Average rent per sq ft data by city. Heavy LinkedIn organic distribution.",
        keyProductMilestones:
          "Budget vs actual analytics dashboard available for pilot. Industry benchmark content published.",
        successMetric:
          "8-10 paid clients by Day 90. First upsell conversation completed.",
      },
      {
        week: "Week 13 (Day 93 Review)",
        salesAction:
          "Conduct 91-day retrospective: what worked in sales, what did not, which messaging resonated, what objections were hardest.",
        marketingAction:
          "90-day content performance review: which blog post or LinkedIn content drove the most demo requests.",
        keyProductMilestones:
          "Phase 1 roadmap fully delivered. Roadmap Phase 2 planning begins.",
        successMetric:
          "10 paid clients. ARR Rs 60 lakh to Rs 1.5 crore from TG1. 3 reference clients. Selling to clients of all types.",
      },
      {
        week: "Biggest risk — Days 61-90",
        salesAction:
          "Paying clients not adopting the full platform - using Lease Repository but not Compliance or AMC modules. Mitigation: 30-day and 60-day client success reviews with module adoption checklist. Create an onboarding incentive for activating 6+ modules.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
    ],
    partnerships: [
      {
        element: "Timing for partnerships",
        details:
          "Month 1-3: sign first partner agreements. Month 4-6: first partner-generated lead in pipeline. Month 6-12: 20-25% of new leads from partner channel. Do not rely on partners for first 10 clients - direct sales must close those.",
      },
      {
        element: "Partner Type 1: Real Estate Consulting Firms",
        details:
          "Who: JLL India, CBRE India, Anarock, Cushman and Wakefield India. What we offer: 5-10% referral fee on first-year ARR, co-branded collateral, free platform licenses for their internal lease tracking. India profile: JLL and CBRE India are leading real estate advisors to Fortune 500 India and retail chains. Their advisory projects create natural hand-offs to Lockated for operational execution. Global profile: JLL and CBRE globally are already recommending enterprise lease platforms. Red flag to avoid: partners who want exclusivity or reseller rights - Lockated works direct and partners refer only.",
      },
      {
        element: "Partner Type 2: Big 4 Advisory Firms (IND AS 116 Practices)",
        details:
          "Who: Deloitte India, EY India, KPMG India (Real Estate and Finance advisory). What we offer: Lockated as the recommended operational platform for IND AS 116 implementation projects. Revenue share on platform licences placed through advisory engagement. India profile: These firms run IND AS 116 adoption projects for listed companies and PSUs. The CFO has already approved budget for compliance. Lockated adds operational execution alongside compliance accounting. Global profile: Not applicable in Year 1. Red flag to avoid: Big 4 firms wanting to build competing products using Lockated's architecture.",
      },
      {
        element: "Year 1 Partnership Structure",
        details:
          "3-5 active referral partners. No reseller or white-label arrangements in Year 1. Partner agreement: non-exclusive referral, 7-10% referral fee on first-year ARR, 2-year partnership term renewable. Partner onboarding: 2-hour platform briefing, co-branded whitepaper, access to demo environment, dedicated partner contact at Lockated.",
      },
    ],
    onePageSummary: {
      "Best sales motion":
        "Direct outbound to Head of Real Estate + CFO co-sell. 45-minute structured demo. 2-week pilot with live data. 45-60 day sales cycle.",
      "Top 2 marketing channels":
        "LinkedIn sponsored and organic content targeting Head of Real Estate. Referral partnerships with JLL and CBRE India.",
      "90-day goal":
        "10 paid clients from retail chain segment. ARR Rs 60 lakh to Rs 1.5 crore. 3 reference clients in programme.",
      "Key partner type": "Real estate consulting firms.",
      "Most important Week 1 action":
        "Build a researched list of 100 Heads of Real Estate at India's top retail chains and send the first 50 personalised outbound emails by Day 5.",
      "Biggest risk to watch":
        "Pilot clients not loading real data. Monitor data migration progress in Week 1 of every pilot. Assign onboarding manager per pilot.",
      "What closes this TG":
        "A live pilot where the Head of Real Estate sees renewal pipeline with 30 expiring leases and a compliance alert for one actual document. The emotional realisation that this saves them 3 hours this week.",
    },
    tgSummary:
      "TG 1 SUMMARY: Retail chains are the highest-priority target group because they have the most urgent and frequent lease management need (constant renewals across 100-500 stores), the clearest India-specific compliance requirement (FSSAI, Shop Act), and the shortest time to demonstrated value in a 2-week pilot.",
  },
  {
    name: "TARGET GROUP 2 — CORPORATE REAL ESTATE TEAMS AT LARGE INDIAN ENTERPRISES (BFSI, IT, FMCG)",
    profile:
      "Company size: 1000+ employees | Industry: BFSI (banks, NBFCs, insurance), IT/ITES (TCS, Infosys, HCL), FMCG manufacturers, Pharma | Geography: Pan-India headquarters in Mumbai, Delhi NCR, Bangalore | Buyer: Head of Corporate Real Estate, VP Real Estate, CFO | Budget: Rs 15-40 lakh/year | Current stack: SAP or Oracle for rent accounting, Excel for lease tracking, SharePoint for documents.",
    elements: [
      {
        element: "ICP Definition",
        details:
          "Indian enterprise with 50-300 leased commercial properties across multiple cities, listed or unlisted, with mandatory IND AS 116 compliance requirements. Head of Corporate Real Estate or equivalent title. Budget gatekeeper is CFO or Group CFO. IT team must approve data sovereignty architecture.",
      },
      {
        element: "Lead Source",
        details:
          "LinkedIn Sales Navigator (title: Head of Corporate Real Estate, VP Real Estate, Chief Administrative Officer at BFSI and IT companies with 1000+ employees), inbound from IND AS 116 SEO content, Big 4 advisory firm referrals from IND AS 116 implementation projects.",
      },
      {
        element: "Outreach Approach",
        details:
          "LinkedIn message to Head of Corporate Real Estate: 'Your IND AS 116 compliance process for 100+ leases - is it still manual?' We have built the only India-first platform that automates ROU asset calculation and keeps your data on your own servers. 20-minute demo? Follow up with email to CFO's direct report if Head of Real Estate does not respond.",
      },
      {
        element: "First Meeting Agenda",
        details:
          "10 minutes: discover ERP environment (SAP or Oracle), lease count, IND AS 116 current process (manual vs automated), data sovereignty requirements. 25 minutes: demo starting with Portfolio Overview Dashboard, Audit Logs for All Changes (audit trail appeal), IND AS 116 module (P1S appeal), and Location Hierarchy (geography-based reporting). 10 minutes: data sovereignty, architecture discussion. 5 minutes: next steps - IT security review and CFO briefing.",
      },
      {
        element: "Demo Flow",
        details:
          "Start with Regional Performance Insights showing portfolio by State and Region. Open Audit Logs and show immutable change history (auditor appeal). Show IND AS 116 journal generation preview. Show Custom Fields for Leases with Cost Centre Code and Business Unit tags. End with data sovereignty architecture diagram.",
      },
      {
        element: "Deal Velocity Target",
        details:
          "60-90 days. IT security review adds 3-4 weeks. Procurement process adds 2-3 weeks. Total cycle: 12-16 weeks from first contact to a signed contract at large enterprises.",
      },
      {
        element: "Primary Sales Motion",
        details:
          "Consultative direct sales. Multiple stakeholder meetings (Head of Real Estate, CFO, IT security, procurement). RFP response required for deals above Rs 20 lakh.",
      },
      {
        element: "Why This Motion",
        details:
          "Enterprise procurement requires documented vendor evaluation. IT security requires architecture review for data hosting. Procurement requires comparative quotes. Self-service or trial does not work here.",
      },
      {
        element: "Recommended Opening Hook",
        details:
          "Most BFSI and IT companies with 100+ offices are producing IND AS 116 journals manually in Excel, with their lease data on a public cloud. Lockated automates the journals and keeps every byte of lease data on your own servers. Which CFO in your organisation would find 5 minutes for that?",
      },
      {
        element: "Economic Buyer",
        details:
          "CFO or Group CFO. Triggered by IND AS 116 compliance cost reduction and audit risk elimination. Budget pre-allocated for compliance software in many enterprises.",
      },
      {
        element: "Champion",
        details:
          "Head of Corporate Real Estate - daily pain of managing 100+ office leases without a dedicated platform.",
      },
      {
        element: "Co-Champion",
        details:
          "Head of Internal Audit or Chief Compliance Officer - benefits directly from Audit Logs and immutable change tracking.",
      },
      {
        element: "Blocker to Anticipate",
        details:
          "IT security team requiring VAPT (Vulnerability Assessment and Penetration Testing) report and ISO 27001 certification from Lockated. Prepare security documentation and offer a dedicated security briefing with client's CISO.",
      },
      {
        element: "What Closes This TG",
        details:
          "A successful IT security review clearing the data sovereignty architecture, followed by a CFO-level demo showing IND AS 116 journal automation. Contract closes when CFO sees the time saving (8 working days per quarter for their finance team) and audit risk reduction as justifying Rs 25-50 lakh/year annual spend.",
      },
    ],
    marketingChannels: [
      {
        channel: "LinkedIn",
        relevant: "YES",
        executionApproach:
          "Thought leadership content: IND AS 116 compliance guides, 'Why your lease data should stay in India', CPO-targeted posts on real estate cost visibility.",
        priorityRank: 1,
        expectedOutput: "5-12 enterprise demos per month at scale.",
        budgetTimeline: "Rs 1.5-2.5 lakh/month.",
      },
      {
        channel: "Big 4 Advisory Partnerships",
        relevant: "YES",
        executionApproach:
          "Co-present at Deloitte or EY IND AS 116 client workshops. Sponsor content: 'Your IND AS 116 deadline is approaching - here is how to operationalise your lease management.'",
        priorityRank: 1,
        expectedOutput:
          "5-8 warm enterprise introductions per quarter per partner.",
        budgetTimeline: "Zero direct cost.",
      },
      {
        channel: "Content and SEO",
        relevant: "YES",
        executionApproach:
          "IND AS 116 deep-dive content, 'Data sovereignty in enterprise software' guides, 'lease accounting software India' keyword targeting.",
        priorityRank: 2,
        expectedOutput: "30-50 high-intent monthly visits by Month 8.",
        budgetTimeline: "Rs 60k-80k/month.",
      },
      {
        channel: "Industry Events",
        relevant: "YES",
        executionApproach:
          "CII Finance Summit, NASSCOM Real Estate track, FICCI BFSI Summit. Speaking slots on IND AS 116 compliance and data sovereignty in real estate.",
        priorityRank: 3,
        expectedOutput: "15-25 qualified conversations per event.",
        budgetTimeline: "Rs 3-6 lakh per event.",
      },
      {
        channel: "CXO Direct Email Outreach",
        relevant: "YES",
        executionApproach:
          "Personalised emails to CFOs and Heads of Corporate Real Estate at top 100 Indian BFSI and IT companies. Reference IND AS 116 deadline and offer a compliance readiness audit report.",
        priorityRank: 2,
        expectedOutput: "2-4 demo bookings per 60 CFO emails sent.",
        budgetTimeline: "Rs 20-30k for data and tooling.",
      },
      {
        channel: "Paid Ads (Google)",
        relevant: "SELECTIVE",
        executionApproach:
          "IND AS 116 software search terms. High commercial intent, lower volume.",
        priorityRank: 4,
        expectedOutput: "5-10 clicks per day from high-intent search.",
        budgetTimeline: "Rs 80k-1.2 lakh/month.",
      },
    ],
    launchSequence: [
      {
        week: "Days 1-30 Focus",
        salesAction:
          "Build prospect list of 50 Head of Corporate Real Estate at BFSI and IT companies. Launch IND AS 116-focused outbound campaign. Identify 1 Big 4 partner contact. Target: 5 demos booked by Day 30.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Days 31-60 Focus",
        salesAction:
          "IT security review process for 2 prospects (prepare architecture documentation). First CFO-level demos. Submit for Big 4 co-presentation at upcoming event. Target: 1 paid contract or advanced procurement stage by Day 61.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Days 61-90 Focus",
        salesAction:
          "3-5 active enterprise evaluations. First enterprise contract signed (Rs 15-25 lakh ARR). Reference client case study with BFSI or IT sector name. Big 4 partnership agreement signed. Target: 2 enterprise signed by Day 90.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Biggest risk",
        salesAction:
          "IT security review delays extending the sales cycle beyond 60 days. Mitigation: prepare a comprehensive security briefing pack (architecture diagram, data flow documentation, VAPT scope, ISO 27001 status) and offer CISO-level briefing in Week 1 of evaluation.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
    ],
    partnerships: [
      {
        element: "Partner Type 1: Big 4 Advisory (IND AS 116)",
        details:
          "Deloitte India, EY India, KPMG India. These firms run IND AS 116 adoption projects. Lockated is positioned as the operational layer (post-compliance setup). Partner benefit: adds tangible product recommendation to their consulting engagement with budget already allocated.",
      },
      {
        element: "Partner Type 2: SAP Implementation Partners",
        details:
          "Wipro SAP Practice, Accenture SAP India, IBM SAP. These partners implement SAP for BFSI and IT enterprises. Lockated's forthcoming SAP integration (Phase 2 roadmap) makes this partnership viable from Month 6. In the meantime, position Lockated as a complementary lease operations tool alongside SAP, not a replacement.",
      },
    ],
    onePageSummary: {
      "Best sales motion":
        "Consultative direct sales to Head of Corporate Real Estate and CFO co-sell. 60-90 day cycle. IT security review is a mandatory stage. RFP responses required for deals above Rs 20 lakh.",
      "Top 2 marketing channels":
        "Big 4 advisory partnerships for warm enterprise introductions. LinkedIn thought leadership content targeting CFOs and Real Estate Heads at BFSI and IT companies.",
      "90-day goal":
        "2 signed enterprise contracts at Rs 15-25 lakh ARR each. 1 Big 4 partner agreement signed. 5 active pipeline opportunities.",
      "Biggest risk to watch":
        "IT security review extending sales cycle beyond 90 days. Have architecture documentation, data flow diagrams, and VAPT reports ready before first demo.",
      "Most important Week 1 action":
        "Identify and contact one Deloitte India or EY India real estate advisory partner for a co-presentation opportunity. Prepare the security briefing pack for IT security reviews.",
      "What closes this TG":
        "CFO seeing IND AS 116 journal automation saving 8 working days per quarter and audit team accepting data sovereignty. Data sovereignty is the emotional closer.",
    },
    tgSummary:
      "TG 2 SUMMARY: Corporate real estate teams at large Indian enterprises are the highest-ACV target group (Rs 15-40 lakh each) but have a longer 60-90 day sales cycle due to IT security review and enterprise procurement. The key assumption is that IND AS 116 compliance requirement creates pre-allocated CFO budget for lease management software, reducing the need to justify new spend. The one metric that tells us if it is working: IT security approval rate above 80%, within 4 weeks of first security briefing - if this is consistently below 80%, the security documentation must be improved.",
  },
  {
    name: "TARGET GROUP 3 — PROPERTY MANAGEMENT COMPANIES (MANAGING 50-200 COMMERCIAL PROPERTIES FOR THIRD-PARTY OWNERS)",
    profile:
      "Company size: 20-500 employees | Industry: Commercial property management, REIT management, co-working operators | Geography: Mumbai, Delhi NCR, Bangalore, Hyderabad | Budget: Rs 6-18 lakh/year | Current stack: Excel rent register, physical compliance files, WhatsApp for maintenance, Tally for accounting.",
    elements: [
      {
        element: "ICP Definition",
        details:
          "Property management company managing 50-200 commercial or mixed-use properties for third-party property owners. Revenue model: management fee (1-2% of rent collected) or fixed fee per property. CEO or Portfolio Manager as primary contact. Currently managing tenant communication and maintenance via WhatsApp and email.",
      },
      {
        element: "Lead Source",
        details:
          "CREDAI PM member directory, RICS India member network, LinkedIn (title: Property Manager, Portfolio Manager, Head of Property Management at companies with 20-500 employees), referrals from existing clients who know peer PM companies.",
      },
      {
        element: "Outreach Approach",
        details:
          "LinkedIn message: 'Managing 100 commercial properties across 15 clients on Excel and WhatsApp - the margin erosion from tenant disputes over rent, missed compliance renewals, and maintenance SLA failures is significant. Lockated gives you a professional platform that makes you look like a Yardi-level operation at 10% of Yardi's cost. Can I show you in 30 minutes?'",
      },
      {
        element: "Demo Flow",
        details:
          "Start with the Rent Collection Dashboard showing 100 properties with payment status. Show Maintenance Request Ticketing with vendor assignment and SLA tracking. Show Compliance Management with 60-day expiry alert. Show the future Landlord Portal (Phase 2 roadmap) as a preview of white-label tenant and owner reporting.",
      },
      {
        element: "Deal Velocity Target",
        details:
          "30-45 days. CEO of a PM company makes decisions faster than enterprise procurement. Single decision maker plus accountant sign-off.",
      },
      {
        element: "Primary Sales Motion",
        details:
          "Direct outbound plus event-based networking. CEO-level conversations. Quick demo to paid pilot in 2-3 weeks.",
      },
      {
        element: "Recommended Opening Hook",
        details:
          "Your biggest competitor is a PM company that uses professional software and charges the same management fee. Lockated helps you look as professional as CoStar's clients without CoStar's cost. And your clients' data stays on their server, not ours.",
      },
      {
        element: "Economic Buyer",
        details:
          "CEO or MD of the PM company. Decision is often made in 1-2 meetings for deals under Rs 10 lakh/year.",
      },
      {
        element: "Champion",
        details:
          "CEO or Portfolio Manager - they feel the WhatsApp maintenance chaos and the Excel rent reconciliation pain personally.",
      },
      {
        element: "Blocker to Anticipate",
        details:
          "Concern that clients (property owners) will not pay for a software upgrade. Mitigation: position Lockated as a competitive advantage the PM company uses to win new mandates and retain existing clients, not an add-on cost passed to clients.",
      },
      {
        element: "What Closes This TG",
        details:
          "A 30-minute demo where the CEO sees their biggest pain solved: maintenance tickets tracked with SLA, rent collection dashboard per property owner, and compliance certificates auto-expiry management. The insight that 'this makes their team look professional' is the emotional closer.",
      },
    ],
    marketingChannels: [
      {
        channel: "LinkedIn outbound",
        relevant: "YES",
        executionApproach:
          "Targeted to PM company CEOs and Portfolio Managers. CREDAI PM network events. Referral from existing PM company clients.",
        priorityRank: 1,
        expectedOutput:
          "Direct outreach. Real estate industry WhatsApp groups (ROX zonal, high roads). Software Suggest and Capterra India listing with PM-specific positioning.",
        budgetTimeline: "",
      },
    ],
    launchSequence: [
      {
        week: "Days 1-30",
        salesAction: "15 demos to PM company CEOs. 3 paid pilots.",
        marketingAction: "",
        keyProductMilestones:
          "Days 31-60: 5 paid PM company clients. Referrals programme active.",
        successMetric:
          "Days 61-90: 8 paid PM company clients. First client generating referral. ARR target Rs 50-80 lakh from TG3 by Day 90.",
      },
    ],
    partnerships: [
      {
        element: "Marketing channels",
        details:
          "LinkedIn outbound to PM company CEOs and Portfolio Managers. CREDAI PM network events. Referral from existing PM company clients. Real estate industry WhatsApp groups (ROX zonal, high roads). Software Suggest and Capterra India listing with PM-specific positioning.",
      },
      {
        element: "60-day goal",
        details:
          "Days 1-30: 15 demos to PM company CEOs. 3 paid pilots. Days 31-60: 5 paid PM company clients. Referrals programme active. Days 61-90: 8 paid PM company clients. First client generating referral. ARR target Rs 50-80 lakh from TG3 by Day 90.",
      },
      {
        element: "Partnership strategy",
        details:
          "CREDAI PM committee membership for credibility and network access. RICS India partnership for professional certification signal. No formal referral partners needed for TG3 - direct relationships with PM company networks are more effective. Consider PM industry WhatsApp community management to establish thought leadership.",
      },
    ],
    tgSummary:
      "TG 3 SUMMARY: Property management companies are the fastest-closing target group (30-45 day sales cycle, single decision maker) and the highest multiplier target (one PM company client brings all their managed properties onto the platform). The key assumption is that a PM company CEO will see Lockated as a competitive advantage in winning new mandates rather than as an incremental cost. The one metric that tells us if it is working: average properties under management per PM company client above 50 by 90 days post go-live. If clients onboard fewer than 20 properties, the multiplier effect is not activating.",
  },
];

export const gtmTargetGroupsLessor: GTMTargetGroup[] = [
  {
    name: "TARGET GROUP 1 — COMMERCIAL REAL ESTATE DEVELOPERS AND OWNERS (50-500 PROPERTIES)",
    profile:
      "Company size: 100-5,000 employees | Industry: Real estate development, family office real estate arms, industrial park developers | Geography: Pan-India, Tier 1 and 2 cities | Buyer: Head of Asset Management / CFO | Budget: Rs 10-35 lakh/year for property management software | Current stack: Excel rent register + manual billing + WhatsApp maintenance + compliance calendar in Outlook.",
    elements: [
      {
        element: "Primary motion",
        details:
          "Direct enterprise sales. Founder-led for first 5 clients. Hire dedicated lessor enterprise AE by Month 3. Sales cycle: 60-90 days for mid-market developers, 90-150 days for large developers with procurement.",
      },
      {
        element: "Entry point",
        details:
          "CFO or Head of Asset Management intro through CREDAI chapter event, reference from existing lessee client in the same conglomerate, or inbound from LinkedIn content on rent receivables and data sovereignty.",
      },
      {
        element: "Discovery focus",
        details:
          "How many properties do you manage? What is your total annual rental income? How do you track overdue collections today? How long does it take to close monthly books? Have you ever faced a compliance gap (missed NOC renewal, overdue property tax)?",
      },
      {
        element: "Demo script",
        details:
          "Open with portfolio dashboard showing rental income vs target and overdue tenant collections. Walk through lease creation → invoice dispatch → payment tracking → receivables aging. Show compliance calendar with alert. Close with data sovereignty architecture slide.",
      },
      {
        element: "Objection — 'We already use Excel'",
        details:
          "Excel does not send automatic rent reminders, flag compliance renewals 60 days in advance, or give you a real-time NOI per property. Show the 3-minute demo of what it looks like when a tenant goes overdue and the platform auto-escalates.",
      },
      {
        element: "Objection — 'Yardi does this'",
        details:
          "Yardi stores your portfolio data on their cloud in the USA. Does your CFO know that? Yardi costs Rs 25-100 lakh/year plus 12 months of implementation. Lockated deploys on your servers, goes live in 6-8 weeks, and costs a fraction.",
      },
      {
        element: "Pilot structure",
        details:
          "90-day pilot on 10-25 properties. Track: rent collection rate, invoices dispatched on time, compliance renewals addressed before deadline. Measure time saved per property manager per week.",
      },
      {
        element: "Close",
        details:
          "Annual enterprise contract. Implementation fee of Rs 2-5 lakh for data migration. Signature by CFO or MD. Reference client programme offer for 15% discount in Year 2.",
      },
    ],
    marketingChannels: [
      {
        channel: "LinkedIn content",
        relevant: "YES",
        executionApproach:
          "Weekly posts from the founder on: overdue rent collection challenges, compliance failures in Indian commercial real estate, case studies of portfolio digitisation, data sovereignty for property owners. Target: CFOs and Heads of Asset Management at developers.",
        priorityRank: 1,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "CREDAI and developer association events",
        relevant: "YES",
        executionApproach:
          "CREDAI National, CREDAI MahaRERA, CREDAI Pune Metro. Present at panel sessions on PropTech, portfolio digitisation, and REIT readiness. Sponsor 1-2 tier events per year.",
        priorityRank: 2,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "Case study content",
        relevant: "YES",
        executionApproach:
          "Detailed case studies showing: time to close monthly books reduced by X days, rent collection rate improved by Y%, compliance lapses eliminated. Publish on LinkedIn and website. Use in ABM campaigns.",
        priorityRank: 2,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "Account-based marketing",
        relevant: "YES",
        executionApproach:
          "Top 50 commercial real estate developers in India. Custom outreach with portfolio analysis and benchmarking data. LinkedIn InMail + personalised email from founder.",
        priorityRank: 3,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "Referral programme",
        relevant: "YES",
        executionApproach:
          "Lessee clients (corporate occupiers) who also have a property arm refer the lessor product. Cross-sell within Lockated's existing client base where the same corporate group has both lessee and lessor operations.",
        priorityRank: 4,
        expectedOutput: "",
        budgetTimeline: "",
      },
    ],
    launchSequence: [
      {
        week: "Days 1-30 — Foundation",
        salesAction:
          "Identify top 30 commercial real estate developers in target cities (Mumbai, Bangalore, Delhi NCR, Hyderabad, Pune). Research Head of Asset Management and CFO contacts. Build personalised outreach using portfolio size data. Send 10 personalised LinkedIn outreach messages per week from founder. Schedule 5 discovery calls.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Days 31-60 — Demos and Pilots",
        salesAction:
          "Convert discovery calls to demos. Run 3 demos per week. Target: 2 pilot sign-ups in Month 2. Set up pilot on client's own server infrastructure (or private cloud for a fast start). Track: invoices dispatched on time, overdue collections surfaced, compliance alerts triggered.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Days 61-90 — Reference",
        salesAction:
          "Convert pilots to paid contracts. Request a case study or LinkedIn testimonial from the pilot client. Use reference client to book 3 warm introductions to developer peers. Present at 1 CREDAI event with pilot client endorsement. Aim for 3 paid clients by end of Day 90.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
    ],
    partnerships: [
      {
        element: "CREDAI partnership",
        details:
          "Formal technology partnership with CREDAI chapters to offer Lockated at member-discounted rates. Co-present at annual PropTech Forum. Access to CREDAI member directory for ABM.",
      },
      {
        element: "CA and audit firm partnerships",
        details:
          "Partner with top CA firms advising real estate developer clients on IND AS 116/117 compliance and GST on rental income. CA firms recommend Lockated as the compliance-ready platform.",
      },
      {
        element: "Valuation firm partnerships",
        details:
          "JLL, CBRE, Colliers, Knight Frank India — partner with their asset management advisory practices to recommend Lockated as part of portfolio digitisation engagements.",
      },
    ],
    tgSummary:
      "TARGET GROUP 1 SUMMARY (LESSOR) — Commercial real estate developers and owners are the anchor lessor client. Average ACV Rs 12-30 lakh/year. Sales cycle 60-120 days. Entered via CREDAI ecosystem, founder-led enterprise sales, and cross-sell from lessee client base. PM on 10-25 properties. Key proof points: time to close monthly books, rent collection rate, compliance zero-lapse.",
  },
  {
    name: "TARGET GROUP 2 — PROPERTY MANAGEMENT COMPANIES (MANAGING 100-1,000 PROPERTIES FOR MULTIPLE CLIENTS)",
    profile:
      "Company size: 20-500 employees | Industry: Professional property management, FM companies with PM arms | Geography: Pan-India, metro cities | Buyer: MD / Head of Operations | Budget: Rs 5-20 lakh/year for platform software | Current stack: Fragmented spreadsheets per client, basic billing software (QuickBooks, Tally), WhatsApp for maintenance.",
    elements: [
      {
        element: "Primary motion",
        details:
          "Consultative partnership sales. Position Lockated as the platform of record for property management companies. Multi-client architecture and white-label capability are the primary selling point.",
      },
      {
        element: "Entry point",
        details:
          "Direct outreach to MD of top property management companies in India (Jones Lang LaSalle India PM, Knight Frank PM India, CBRE PM India for enterprise, 500+ independent PMs for mid-market). Industry association (IFMA India, RICS India) engagement.",
      },
      {
        element: "Discovery focus",
        details:
          "How many client portfolios do you manage? How do you separate client data today? How much time does your team spend on monthly reporting per client? How do you handle maintenance SLA reporting to your landlord clients?",
      },
      {
        element: "Demo script",
        details:
          "Open with multi-client portfolio dashboard. Show client-level data separation. Walk through tenant billing workflow, maintenance SLA reporting, and a customised monthly reports per client. Emphasise white-label option.",
      },
      {
        element: "Pilot structure",
        details:
          "Start with 1 landlord client's portfolio (50-100 properties) in a 90-day pilot. Measure: monthly report generation time, invoices dispatched on time, maintenance SLA compliance rate.",
      },
      {
        element: "Close",
        details:
          "Annual contract per property under management, or flat fee per landlord client managed. White-label licence fee for branded deployment.",
      },
    ],
    marketingChannels: [
      {
        channel: "IFMA and RICS India events",
        relevant: "YES",
        executionApproach:
          "International Facility Management Association India chapter and RICS India PropTech events. Property management company decision-makers attend these. Present on portfolio digitisation and operational efficiency.",
        priorityRank: 1,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "Direct outreach to top 50 Indian PMs",
        relevant: "YES",
        executionApproach:
          "Identify top 50 independent and institutional property management companies. Personalised outreach with a portfolio digitisation benchmark report specific to their segment.",
        priorityRank: 1,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "Case studies on multi-client management",
        relevant: "YES",
        executionApproach:
          "Publish detailed case study on how a property management company reduced monthly reporting time from 3 days to 3 hours per client using Lockated. Circulate in IFMA and CREDAI PM committee networks.",
        priorityRank: 2,
        expectedOutput: "",
        budgetTimeline: "",
      },
      {
        channel: "Referral from lessee clients",
        relevant: "YES",
        executionApproach:
          "Lessee corporate clients whose properties are managed by a PM company refer the PM company to Lockated. Incentivise with a referral credit.",
        priorityRank: 3,
        expectedOutput: "",
        budgetTimeline: "",
      },
    ],
    launchSequence: [
      {
        week: "Days 1-30",
        salesAction:
          "Identify top 30 Indian property management companies. Map MD and Head of Operations contacts. Send 15 personalised LinkedIn outreach messages per week. Schedule 5 discovery calls. Present to 1 IFMA India chapter meeting.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Days 31-60",
        salesAction:
          "Run 3 demos per week. Pilot a group target: 2 PM companies. Set up multi-client demo environment. Prioritise companies managing 200-600 properties for maximum platform value demonstration.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
      {
        week: "Days 61-90",
        salesAction:
          "Convert 1 pilot to a paid multi-client contract. Request a case study on monthly report time reduction. Use as a reference to book 3 introductions to peer PM companies. Target: 2 PM company clients by Day 90.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
    ],
    partnerships: [
      {
        element: "IFMA India formal technology partner",
        details:
          "Official technology partner status for IFMA India. Member discount for Lockated. Co-present at Annual FM Conclave.",
      },
      {
        element: "White-label reseller programme",
        details:
          "Allow large PM companies (Jones Lang LaSalle PM India, Knight Frank PM India) to white-label Lockated under their brand for client deployment. Revenue share model.",
      },
    ],
    tgSummary:
      "TARGET GROUP 2 SUMMARY (LESSOR) — Property management companies are the fastest-growing lessor segment and have a multiplier effect (each PM company brings 5-20 landlord clients' portfolios). Average ACV Rs 8-25 lakh/year. Sales cycle 60-120 days. Key features required: multi-client architecture, white-label, consolidated and individual client reporting. Priority build item.",
  },
  {
    name: "TARGET GROUP 3 — MALL OPERATORS, INDUSTRIAL PARKS, AND SEZ OPERATORS",
    profile:
      "Company size: 50-2,000 employees | Industry: Retail mall operations, industrial/logistics park operations, SEZ development | Geography: Pan-India | Buyer: Head of Mall Management / Head of Asset Management / Operations Head | Budget: Rs 10-40 lakh/year | Current stack: Excel + manual billing + ERP module (partial).",
    elements: [
      {
        element: "Primary motion",
        details:
          "Direct enterprise sales targeting CXO and Head of Asset Management at mall developers (DLF, Phoenix Mills, Nexus Malls, Lulu Group), industrial park operators (Mahajan Ors, IndoSpace, ESR India), and SEZ operators (MEPZ, Mahindra World City).",
      },
      {
        element: "Entry point",
        details:
          "MAPIC India (retail property trade event), CII Industrial Parks Summit, NASSCOM / SEEPZ SEZ forums.",
      },
      {
        element: "Discovery focus",
        details:
          "How do you currently generate monthly rent and utility invoices to 100+ tenants? How do you manage Fire NOC and OC renewals for 3-5 properties? How do you track maintenance SLAs for tenant requests?",
      },
      {
        element: "Demo script",
        details:
          "Show utility billing workflows — meter reading capture → consumption calculation → invoice dispatch. Walk through compliance calendar for Fire NOC, CC, and OC renewals. Show tenant maintenance ticket workflow with SLA tracking.",
      },
      {
        element: "Pilot",
        details:
          "90-day pilot on one mall or park. Track: utility invoice dispatch accuracy, compliance renewals addressed, maintenance SLA compliance.",
      },
    ],
    marketingChannels: [
      {
        channel: "Marketing",
        relevant: "YES",
        executionApproach:
          "MAPIC India, CII Industrial Parks events, SEZ operators conferences. Content on GST compliance for commercial rent, fire NOC renewal management, and utility billing automation for large properties.",
        priorityRank: 1,
        expectedOutput: "",
        budgetTimeline: "",
      },
    ],
    launchSequence: [
      {
        week: "Launch Sequence",
        salesAction:
          "Days 1-30: identify 20 mall operators, 20 industrial parks, 10 SEZ operators. Days 31-60: 3 demos/week, 1 pilot sign-up. Days 61-90: convert pilot, request reference, 2 paid clients target.",
        marketingAction: "",
        keyProductMilestones: "",
        successMetric: "",
      },
    ],
    partnerships: [
      {
        element: "Partnerships",
        details:
          "MAPIC India official technology partner. CII National Committee on Real Estate and Housing. SEZ Developers Association India.",
      },
    ],
    tgSummary:
      "TARGET GROUP 3 SUMMARY (LESSOR) — Mall operators, industrial parks, and SEZ operators have high complexity (utility billing, CAM, multi-zone compliance) and high ACV (Rs 15-40 lakh/year). They are differentiated from commercial developers by the maturity of tenant operations management and utility billing requirements. Entered via sector trade events and direct enterprise sales.",
  },
];

// ==================== TAB 9: METRICS ====================

export const clientMetrics: ClientMetric[] = [
  {
    id: 1,
    name: "Rent Overpayment Reduction",
    whatMeasures:
      "Amount of rent overpaid due to missed escalation dates or incorrect CAM charges that is identified and corrected after using Lockated.",
    impactRange:
      "Rs 2-15 lakh per property per year savings identified in first 6 months",
    featureDriving:
      "Lease Terms Management, Rent Due Scheduling, Audit Logs for All Changes",
    howCaused:
      "Automated escalation triggers catch date-specific rent increases that were missed manually. Audit logs reveal when escalations were applied incorrectly.",
    landingClaim:
      "Clients identify an average of Rs 8 lakh per year in rent overpayments in their first 3 months with Lockated.",
  },
  {
    id: 2,
    name: "Lease Renewal Window Capture Rate",
    whatMeasures:
      "Percentage of expiring leases where renewal action was initiated more than 60 days before expiry, enabling proactive negotiation.",
    impactRange: "Increases from 30-40% (Excel-based) to 90-95% (Lockated)",
    featureDriving:
      "Lease Expiry Tracking, Renewal Pipeline, Reminder Notifications",
    howCaused:
      "Automated alerts at 90, 60, and 30 days ensure no lease falls through. Renewal pipeline creates structured follow-through.",
    landingClaim:
      "98% of client leases renewed proactively. Zero reactive renewals in 12 months for clients using Lockated.",
  },
  {
    id: 3,
    name: "Month-End Rent Reconciliation Time",
    whatMeasures:
      "Hours spent by the Finance team reconciling rent payments, deposits, and invoices at month-end.",
    impactRange: "Reduces from 3-5 days to 4-8 hours",
    featureDriving:
      "Rent Collection Dashboard, Invoicing and Payments, Security Deposit Management",
    howCaused:
      "All rent payment data is structured, searchable, and exportable. No manual consolidation from multiple sources needed.",
    landingClaim:
      "Finance teams cut month-end rent close from 4 days to half a day. Every month, without exception.",
  },
  {
    id: 4,
    name: "Compliance Document Lapse Rate",
    whatMeasures:
      "Number of compliance documents (Fire NOC, OC, trade licences) that expired without renewal action across the portfolio.",
    impactRange:
      "From 15-25 lapses per year (unmanaged) to 0 lapses in first 12 months",
    featureDriving:
      "Compliance Management, Renewal Alerts and Validity Tracking, Compliance Assignment",
    howCaused:
      "90/60/30-day alerts with ownership assignment ensure every document has a responsible person and a deadline.",
    landingClaim:
      "Zero compliance lapses in the first 12 months for every Lockated client. Auditors confirmed.",
  },
  {
    id: 5,
    name: "Maintenance SLA Breach Rate",
    whatMeasures:
      "Percentage of maintenance tickets where the resolution time exceeded the configured SLA (Critical: 4 hours, High: 24 hours, Medium: 72 hours).",
    impactRange: "Reduces from 40-60% breach rate to below 15%",
    featureDriving:
      "Maintenance Request Ticketing, Priority Management, Vendor Assignment",
    howCaused:
      "Automated SLA timers and escalation rules ensure breaches are flagged in real time. Vendor accountability increases with performance tracking.",
    landingClaim:
      "Maintenance SLA breach rates dropped by 70% within 90 days for property management company clients.",
  },
  {
    id: 6,
    name: "Utility Cost Savings Identified",
    whatMeasures:
      "Reduction in utility spend identified through Lockated's consumption trend alerts and efficiency metric tracking.",
    impactRange: "5-18% annual utility cost reduction per property",
    featureDriving:
      "Utilities Management (Consumption Trends, Efficiency Metrics), Property and Asset Management",
    howCaused:
      "Year-on-year consumption comparisons and per-sqft benchmarks identify properties with abnormally high utility costs, triggering investigation and correction.",
    landingClaim:
      "Clients identify an average of Rs 4 lakh per property in annual utility savings within 6 months of tracking consumption in Lockated.",
  },
  {
    id: 7,
    name: "Security Deposit Recovery Rate",
    whatMeasures:
      "Percentage of security deposits successfully recovered at lease exit without dispute, attributed to structured documentation of takeover conditions.",
    impactRange:
      "Increases from 65-75% (undocumented) to 90-95% (Lockated-documented)",
    featureDriving:
      "Security Deposit Management, Property Takeover Conditions, Audit Logs",
    howCaused:
      "Takeover condition documentation with photos and logs creates a defensible baseline for exit dispute resolution.",
    landingClaim:
      "92% of Lockated clients recover their full security deposit at lease exit, compared to an industry average of 71%.",
  },
  {
    id: 8,
    name: "Finance Team Time Saving (Annual)",
    whatMeasures:
      "Total hours saved annually by the Finance team across rent reconciliation, invoice generation, audit preparation, and OPEX reporting.",
    impactRange: "150-400 hours per year per Finance team member",
    featureDriving:
      "All financial modules: Rent Collection, Invoicing, OPEX, Deposits, Audit Logs",
    howCaused:
      "Automation across all financial modules eliminates manual data entry, consolidation, and report preparation that Finance teams previously did in Excel.",
    landingClaim:
      "Finance teams save an average of 250 hours per year per person after deploying Lockated across the full financial module stack.",
  },
  {
    id: 9,
    name: "Audit Completion Time",
    whatMeasures:
      "Time taken to produce all lease-related documentation for an internal or external audit.",
    impactRange: "Reduces from 3-5 days to 2-4 hours",
    featureDriving:
      "Audit Logs for All Changes, Lease Repository, Compliance Repository, Payment History",
    howCaused:
      "All changes are timestamped, attributed, and searchable. Auditors can access complete history without chasing team members for documentation.",
    landingClaim:
      "Clients complete lease audits in under 4 hours. Audit documentation that previously took a week is now generated in one click.",
  },
  {
    id: 10,
    name: "AMC Vendor Consolidation Savings",
    whatMeasures:
      "Cost reduction achieved by consolidating AMC vendors across properties based on performance data from Lockated's vendor rating system.",
    impactRange: "8-20% AMC cost reduction through vendor consolidation",
    featureDriving:
      "AMC Management, Vendor Performance Metrics, Vendor Linking",
    howCaused:
      "Multi-property vendor performance data identifies underperforming vendors and enables negotiation for volume discounts with high-performing vendors.",
    landingClaim:
      "Clients with 20+ properties consolidate AMC vendors by an average of 30% and reduce AMC spend by Rs 12 lakh per year using Lockated's vendor performance data.",
  },
];

// --- LESSEE: Section 2 - Product Launch Tracking (North Star + Top 10) ---

export const lesseeNorthStarMetric = {
  name: "Total Active Lease Records Under Management on Lockated Platform (across all paying clients)",
  why: "Total active lease records is the single metric that captures product adoption depth (clients loading all their leases, not just testing), portfolio breadth (clients with large portfolios generating more value), and revenue health (ACV is directly correlated to lease count). If this metric is growing, it means clients are adopting the platform fully, expanding their usage, and the platform is becoming operationally essential. Target: 1,000 active leases by Month 3, 5,000 by Month 12, 25,000 by Month 36.",
};

export const lesseeProductLaunchMetrics: ProductLaunchMetric[] = [
  {
    id: 1,
    metric: "New Signups / Trials",
    whatMeasures:
      "Number of enterprise organisations starting a paid trial or pilot per month.",
    activationDefinition:
      "An organisation is counted as a signup when at least 1 user has logged in and created at least 1 lease record.",
    thirtyDayCurrent: "5 new organisations",
    thirtyDayWithPhase1: "8 new organisations",
    threeMonthCurrent: "20 organisations",
    threeMonthWithPhase1: "35 organisations",
    whyItMatters:
      "Leading indicator of top-of-funnel health and brand awareness.",
    successSignal:
      "Consistent week-over-week growth, not spikes from single campaigns.",
    upliftFromPhase1:
      "IND AS 116 module and mobile app attract listed companies and FM-driven buyers, expanding the total addressable market by 40%.",
  },
  {
    id: 2,
    metric: "Activated Users",
    whatMeasures:
      "Users who have completed the activation milestone: created a lease record, linked a property from master, and set a renewal alert.",
    activationDefinition:
      "Activation = user has created 1+ lease record AND 1+ compliance document AND set 1+ renewal alert within 14 days of account creation.",
    thirtyDayCurrent: "40% activation rate (2 of 5 trial users)",
    thirtyDayWithPhase1: "55% activation rate",
    threeMonthCurrent: "60% of all users in paying clients are active weekly",
    threeMonthWithPhase1: "75% of all users are active weekly",
    whyItMatters:
      "An unactivated user provides zero retention. High activation predicts expansion.",
    successSignal:
      "Activation rate above 50% by Day 14 for all new organisations.",
    upliftFromPhase1:
      "Bulk import template (Phase 1) reduces time-to-activation from 2 weeks to 3 days.",
  },
  {
    id: 3,
    metric: "Paid Conversions (Trial to Paid)",
    whatMeasures:
      "Percentage of trial organisations converting to paid contracts within 45 days of trial start.",
    activationDefinition:
      "Paid = signed annual contract and first invoice raised.",
    thirtyDayCurrent: "25% conversion rate (1-2 of 5 trials convert)",
    thirtyDayWithPhase1: "35% conversion rate",
    threeMonthCurrent: "35% cumulative over 3 months",
    threeMonthWithPhase1: "50% cumulative",
    whyItMatters:
      "Primary revenue driver metric. Validates that demo and trial experience is compelling.",
    successSignal: "3+ paid contracts per month by Month 2.",
    upliftFromPhase1:
      "IND AS 116 module removes the primary objection from listed company buyers ('we need compliance, not just tracking').",
  },
  {
    id: 4,
    metric: "Feature Adoption Rate (Compliance Module)",
    whatMeasures:
      "Percentage of paying clients actively using 5+ compliance documents, Compliance Management module (uploading compliance documents and responding to alerts).",
    activationDefinition:
      "Adoption = client has 5+ compliance documents uploaded AND at least 1 alert responded to within first 30 days.",
    thirtyDayCurrent: "40% of clients using compliance module",
    thirtyDayWithPhase1: "55% by Day 60",
    threeMonthCurrent: "60% of clients",
    threeMonthWithPhase1: "85% of all clients",
    whyItMatters:
      "Compliance module is the strongest retention anchor. Clients using 5 of its modules have 1.5x retention compared to those using 1 module.",
    successSignal: "Compliance adoption by Month 3 above 60%.",
    upliftFromPhase1:
      "Phase 1 automates compliance renewal notifications and adds pre-populated Fire NOC and Shop Act template documents, reducing setup from 4 hours to 30 minutes.",
  },
  {
    id: 5,
    metric: "NPS Proxy (First 90 Day Survey)",
    whatMeasures:
      "Net Promoter Score collected via an in-app 1-question survey at Day 30: 'How likely are you to recommend Lockated to a colleague in real estate management? (0-10)'",
    activationDefinition: "NPS = % Promoters (9-10) minus % Detractors (0-6).",
    thirtyDayCurrent: "NPS >30 (early adopter bias)",
    thirtyDayWithPhase1: "NPS >30",
    threeMonthCurrent: "NPS >40",
    threeMonthWithPhase1: "NPS >45",
    whyItMatters:
      "NPS above +40 indicates referral programme viability and case study collection. Below +20 requires product and case study collection.",
    successSignal: "NPS above +40 by Month 3 from at least 15 respondents.",
    upliftFromPhase1:
      "Mobile app (Phase 1) improves NPS by 5-10 points via convenience. IND AS 116 module adds 'can't live without' compliance and case study functionality.",
  },
  {
    id: 6,
    metric: "Support Ticket Volume",
    whatMeasures:
      "Average number of support tickets per new client per month in their first 3 months (proxy for intuitive UX and quality of onboarding).",
    activationDefinition:
      "A ticket is any query submitted via in-app help, email, or chat requiring a response from the Lockated team.",
    thirtyDayCurrent: "Less than 8 tickets per client per month in Month 1",
    thirtyDayWithPhase1: "Below 6 per month in Month 1",
    threeMonthCurrent: "Below 6 per month by Month 3",
    threeMonthWithPhase1: "Below 3 per month by Month 3",
    whyItMatters:
      "High ticket volume signals UX issues, confusing UI, or gaps in onboarding completeness and signals that need remediation.",
    successSignal:
      "Ticket volume declining month-over-month for each client cohort. Phase 1 template and in-app support reducing tickets.",
    upliftFromPhase1:
      "Bulk import templates and in-app tutorials (Phase 1 items) reduce onboarding confusion — the #1 source of tickets.",
  },
  {
    id: 7,
    metric: "Monthly Churn Rate",
    whatMeasures:
      "Percentage of paying clients who cancel or do not renew their annual contract, measured monthly.",
    activationDefinition:
      "A churn event is a client who has paid at least 1 invoice and was deactivated within the last 30 days.",
    thirtyDayCurrent:
      "Less than 3% monthly churn target (less than 36% annual - high because product is early)",
    thirtyDayWithPhase1: "Below 2% monthly",
    threeMonthCurrent: "Below 1.5% monthly",
    threeMonthWithPhase1: "Below 1% monthly",
    whyItMatters:
      "Churn above 2% monthly means the product-market fit or onboarding is weak. Below 1% is enterprise SaaS benchmark.",
    successSignal:
      "Zero churns at first 3 and in first year should not be hard if IND AS and compliance features create lock-in from Month 1.",
    upliftFromPhase1:
      "IND AS 116 and loading real data, and embedded compliance creates switching cost. 500 records loaded = virtually zero churn.",
  },
  {
    id: 8,
    metric: "Active Lease Records (Lease Management)",
    whatMeasures:
      "Total number of lease records in Active status across all paying client accounts. This is the North Star metric.",
    activationDefinition:
      "A record is active when it is in Active or Expiring status and was accessed within the last 90 days.",
    thirtyDayCurrent: "500 active lease records by Day 30",
    thirtyDayWithPhase1: "700 by Day 30",
    threeMonthCurrent: "2,500 by Month 3",
    threeMonthWithPhase1: "4,000 by Month 3",
    whyItMatters:
      "This is the North Star metric. Growth of active lease records is the strongest predictor of retention and revenue health.",
    successSignal:
      "Any client loading 50+ active lease records within 30 days is highly likely to renew and expand.",
    upliftFromPhase1:
      "Bulk import automates loading. IND AS 116 requires all leases to be loaded, incentivising 100% portfolio onboarding.",
  },
  {
    id: 9,
    metric: "Module Breadth per Client (Average Modules Active)",
    whatMeasures:
      "Average number of distinct feature modules each paying client is actively using (at least 1 action taken in the module in the past 30 days).",
    activationDefinition:
      "Active = at least 1 distinct feature action taken within the module in the past 30 days.",
    thirtyDayCurrent: "Average 4 modules active per client by Day 30",
    thirtyDayWithPhase1: "Average 5 modules by Day 30",
    threeMonthCurrent: "Average 6 modules by Month 3",
    threeMonthWithPhase1: "Average 8 modules by Month 3",
    whyItMatters:
      "Breadth of module usage is the strongest predictor of renewal and revenue growth.",
    successSignal:
      "Any client using 7+ modules within 30 days has near-zero churn probability.",
    upliftFromPhase1:
      "3 new modules (IND AS 116, mobile, automation) increase the ceiling from 8 to 11 accessible modules.",
  },
  {
    id: 10,
    metric: "Time to Value (Days from Contract to First Active Lease Record)",
    whatMeasures:
      "Number of days from contract signing to the first active lease record being created by the client.",
    activationDefinition:
      "Value = client has created and activated 10+ lease records with complete terms (rent, dates).",
    thirtyDayCurrent: "21 days without bulk import template",
    thirtyDayWithPhase1: "10 days with bulk import template (Phase 1)",
    threeMonthCurrent: "Median 14 days across all Month 1-3 clients",
    threeMonthWithPhase1: "Median 7 days across all Month 1-3 clients",
    whyItMatters:
      "Time to value predicts activation and churn. Clients who reach value in 14 days have 3x lower 12-month churn.",
    successSignal:
      "Any client reaching 10+ active lease records within 14 days triggers a 1 Year+ for improving time.",
    upliftFromPhase1:
      "Bulk import feature is the single biggest Phase 1 item for improving time to value. 2-3 new module users upload via template on Day 1.",
  },
];

export const lesseeMetricsSummary = {
  northStar:
    "Total Active Lease Records Under Management on Platform. This single number captures adoption depth (clients loading real data), portfolio breadth (large portfolio clients), and revenue health (ACV correlates to lease count). Target: 5,000 active leases by Month 12.",
  threeLeadingIndicators:
    "1. Activation rate target 65%+ by Day 14 - predicts whether clients will find value and renew. 2. Compliance module adoption rate target 60%+ by Day 60 - predicts churn, as compliance-embedded clients do not leave. 3. Time to value target 10 days with Phase 1 bulk import - predicts NPS and expansion.",
  phase1InvestmentPayback:
    "Expected return: Phase 1 deployment (estimated Rs 30-50 lakh engineering investment) unlocks 30% of currently blocked pipeline. At average ACV of Rs 12 lakh per deal, 4 unblocked deals pay back Phase 1 investment. Total ARR impact of Phase 1 roadmap by Month 12 estimated at Rs 1.5-4 crore. ROI on Phase 1 investment: 3x-6x within 12 months of deployment.",
};

// --- LESSOR: Section 1 - Client Impact Metrics ---

export const lessorClientMetrics: LessorClientMetric[] = [
  {
    id: 1,
    name: "Rent Collection Rate",
    whatMeasures:
      "% of monthly rent receivable collected within 7 days of due date across the portfolio.",
    howToTrack:
      "Payment module: monthly receivables report. Collected vs overdue. Received vs Overdue on Day 15-23 days.",
    baselineBefore:
      "60-75% collected on time. Rest collected after manual follow-up over 15-23 days.",
    targetAfter90Days: "85-95% collected within 7 days of due date",
    landingPageHeadline:
      "Rent collection rate improved from 65% to 90% in 6 days.",
    howToPresent:
      "Before/after collection rate per property. Show total overdue amount eliminated.",
    portfolioImpact:
      "Rs 50-500 lakh improvement in cash flow timing per year for the portfolio.",
    revenueImpact:
      "Direct rent collection working capital required to fund operations while waiting.",
    clientROILogic: "",
  },
  {
    id: 2,
    name: "Days to Close Monthly Books",
    whatMeasures:
      "Number of working days after month-end to finalise rental income, receivables, and OPEX report.",
    howToTrack:
      "Measure from Day 1 of the month to the date the Finance Manager confirms the monthly income report is complete monthly.",
    baselineBefore:
      "5-15 working days to close monthly books due to manual collection status chasing.",
    targetAfter90Days:
      "2-3 working days — automated collection status, invoice, dispatch, and payment reconciling eliminates manual chase.",
    landingPageHeadline:
      "Monthly book closure reduced from 12 days to 2-3 days.",
    howToPresent:
      "Time series chart of closing days per month before and after Lockated.",
    portfolioImpact: "Finance team time reclaimed: 5-8 working days per month.",
    revenueImpact:
      "Quarterly: as timely book closure enables faster management reporting and strategy. Typically Rs 2-5 lakh in Stagnation portfolio.",
    clientROILogic: "",
  },
  {
    id: 3,
    name: "Overdue Tenant Collections Covered",
    whatMeasures:
      "Total value (Rs) of overdue tenant rent recovered within 30 days of going live on platform.",
    howToTrack:
      "Receivables aging dashboard: sort of overdue amount on Day 0 vs Day 90.",
    baselineBefore:
      "Leverage portfolio has 8-18% of monthly rent outstanding in Ageing 30 days due to ad hoc manual follow-up.",
    targetAfter90Days:
      "Reduce overdue balance by 70-85% within 90 days via real-time receivable reminders and escalation.",
    landingPageHeadline:
      "Cleared Rs 48 lakh in overdue rent collections in 60 days.",
    howToPresent:
      "Rs value of overdue rent cleared. Before/after portfolio the Rs value of the aging analysis chart.",
    portfolioImpact:
      "Cash flow improvement — the Rs value of overdue recovery = Rs 10 lakh on a 50 property portfolio, Rs 50 lakh on 200 property portfolio.",
    revenueImpact: "",
    clientROILogic: "",
  },
  {
    id: 4,
    name: "Compliance Renewals (Zero Lapse Rate)",
    whatMeasures:
      "% of property compliance documents (Fire NOC, OC, trade licences) renewed before expiry date.",
    howToTrack:
      "Compliance module: count of renewals completed before deadline vs total renewals due in the period.",
    baselineBefore:
      "25-40% of compliance documents renewed before deadline. Most renewed after expiry or forgotten. Manual reminder system.",
    targetAfter90Days:
      "100% renewals completed before expiry. Zero compliance lapses across 120 property portfolio in 6 months.",
    landingPageHeadline: "Zero compliance lapses across the portfolio.",
    howToPresent:
      "Count of compliance lapses before and after. Identify penalty or commercial cost of each historical lapse.",
    portfolioImpact:
      "Eliminates regulatory risk: Fire NOCs, MoEFs, OCs across entire the portfolio.",
    revenueImpact:
      "Avoids Rs 10,000-1,00,000+ compliance fines per lapse. Multiple per year in a manual system.",
    clientROILogic: "",
  },
  {
    id: 5,
    name: "Tenant Maintenance SLA Compliance Rate",
    whatMeasures:
      "% of tenant-raised maintenance requests resolved within the configured SLA per priority category.",
    howToTrack:
      "Maintenance module: SLA compliance rate — tickets resolved within SLA vs total raised. Formal SLA measurement in place.",
    baselineBefore:
      "40-60% of maintenance requests resolved within SLA. No formal SLA tracking. Emergency tickets: 30%+ within 24-48 SLA.",
    targetAfter90Days: "80-90% within SLA.",
    landingPageHeadline:
      "Maintenance SLA compliance improved from 52% to 87% in 90 days.",
    howToPresent:
      "Before/after SLA rate by category. Show reduced tenant escalations. Show cost savings from proactive vs emergency resolution.",
    portfolioImpact:
      "SLA compliance rate improvement reduces tenant escalation, improves retention and reduces emergency maintenance spend.",
    revenueImpact:
      "Rs 2-5 lakh per property from avoided emergency repair surcharges. Direct saving.",
    clientROILogic: "",
  },
  {
    id: 6,
    name: "Invoicing Accuracy and On-Time Dispatch Rate",
    whatMeasures:
      "% of monthly invoices (rent, utility, CAM) dispatched to tenant on/before due date without manual correction.",
    howToTrack:
      "Invoicing module: count of invoices dispatched by due time. 10-25% require correction or after-the-fact dispatch. Count of re-invoices due to error and correction.",
    baselineBefore:
      "60-75% of invoices dispatched on time, error-free, on the correct payment date.",
    targetAfter90Days:
      "98%+ invoices dispatched on time — the auto-calculated billing pays off.",
    landingPageHeadline:
      "Tenant invoicing accuracy improved to 99% — zero manual correction needed.",
    howToPresent:
      "Invoice error rate before/after. Show reduced dispute timeline. Accelerate payments and reduce time saved by finance.",
    portfolioImpact:
      "Direct cash flow accelerator. Correct invoicing reduces disputes, delays, and legal spend.",
    revenueImpact: "",
    clientROILogic: "",
  },
  {
    id: 7,
    name: "Occupancy Rate Visibility",
    whatMeasures:
      "Real-time view of occupied vs vacant properties and units across the portfolio updated automatically.",
    howToTrack:
      "Portfolio dashboard: real-time occupancy rate. Head of Asset Management views on activity reports from property managers. Updated on lease status.",
    baselineBefore:
      "No real-time occupancy view. Manual updating required from property managers.",
    targetAfter90Days:
      "Real-time occupancy dashboard updated continuously. Reports for every lease status on every lease change.",
    landingPageHeadline:
      "Portfolio occupancy rate now visible in real-time — from weekly manual to instant.",
    howToPresent:
      "Show the time lag between reporting before and after. Annual vacancy cost per property (for a 100 property portfolio, even 1% vacancy visibility improvement leads to Rs 50 lakh plus per year).",
    portfolioImpact:
      "Faster vacancy identification enables immediate re-leasing. Revenue per vacancy per quarter.",
    revenueImpact: "",
    clientROILogic: "",
  },
  {
    id: 8,
    name: "Rental Income vs Target Tracking",
    whatMeasures:
      "Monthly comparison of actual rental income received vs budget/target across the portfolio.",
    howToTrack:
      "Financial module: monthly lease income report — actual vs target. Portfolio performance; revenue quarterly vs quarterly reporting. Revenue collected for lease, by property and across entire.",
    baselineBefore:
      "No systematic tracking of income vs target. Collected and reported in Board meetings with 3-4 weeks lag.",
    targetAfter90Days:
      "Monthly income vs target report generated automatically. Head of Asset Management reviews weekly.",
    landingPageHeadline:
      "First time in 8 years we have monthly income vs budget at 98% accuracy.",
    howToPresent:
      "Before/after: comparison of income reporting frequency and accuracy.",
    portfolioImpact: "Enables proactive rent renegotiation or forecasting.",
    revenueImpact:
      "Even 2% improvement in rental income is Rs 25+ lakh per year on a Rs 12 crore portfolio.",
    clientROILogic: "",
  },
  {
    id: 9,
    name: "Time Saved on Monthly Tenant Reporting (Property Management Companies)",
    whatMeasures:
      "Hours saved per month by property management company team in compiling monthly client reports.",
    howToTrack:
      "Measure: hours taken to compile monthly client reports before Lockated vs after auto-generated reports.",
    baselineBefore:
      "2-4 days per client per month for manual report compilation (invoices, maintenance, compliance).",
    targetAfter90Days:
      "Auto-generated monthly client reports cut from 3 days to 15 minutes per client.",
    landingPageHeadline:
      "Monthly client reporting reduced from 3 days to 15 minutes per portfolio.",
    howToPresent:
      "Before/after time comparison for 1 client, scaled to all client base.",
    portfolioImpact: "For a PM company with 25-30 working days per month.",
    revenueImpact:
      "Staff savings: 25-50% reduction in admin headcount per Rs 50,000-Rs 1 lakh/month per admin (Rs 6-12 lakh/year).",
    clientROILogic: "",
  },
  {
    id: 10,
    name: "Security Deposit Regular Compliance",
    whatMeasures:
      "% of active leases with security deposit amount in Deposit record vs total active leases.",
    howToTrack:
      "Security deposit module: count of leases with Deposit record vs total active leases. Fixed: CA accounts. Tallied calculations done manually.",
    baselineBefore:
      "40-60% of deposits tracked systematically. Rest in separate records, manual or no separate calculation or review.",
    targetAfter90Days:
      "100% of active leases with deposit tracked. Refund and TDS auto-calculated vs manual.",
    landingPageHeadline:
      "Security deposit register 100% complete — no more manual calculation or review exit.",
    howToPresent:
      "Compliance rate before/after. Show value at risk (deposits, reimburse, advances, reimbursements).",
    portfolioImpact:
      "Eliminates deposit disputes, amnesia, and recovery failures on tenant exit.",
    revenueImpact: "One deposit dispute avoided = legal cost of Rs 2-15 lakh.",
    clientROILogic: "",
  },
];

export const lessorNorthStarMetric = {
  name: "MONTHLY RENTAL INCOME COLLECTED ON TIME",
  definition:
    "% of total contracted monthly rent received within 7 days of due date across all client portfolios on the platform. This metric captures collection efficiency, platform adoption, and client value delivered in a single number. Target: 90%+ for all clients within 90 days of go-live.",
};

export const lessorLaunchTracking: LessorLaunchTrackingRow[] = [
  {
    metric: "Lessor clients onboarded",
    baselinePreLaunch: "0",
    thirtyDayTarget: "1-2 pilot clients (10-25 properties each)",
    ninetyDayTarget: "3-5 paying lessor clients",
  },
  {
    metric: "Properties managed on platform (lessor)",
    baselinePreLaunch: "0",
    thirtyDayTarget: "25-50 properties across pilots",
    ninetyDayTarget: "150-300 properties across 3-5 clients",
  },
  {
    metric: "Tenant invoices dispatched through platform",
    baselinePreLaunch: "0",
    thirtyDayTarget: "100% of invoices for pilot properties",
    ninetyDayTarget: "100% of invoices for all active lessor clients",
  },
  {
    metric: "Rent collection rate for platform properties",
    baselinePreLaunch: "Manual: 65-75% on time",
    thirtyDayTarget: "75-85% on time with automated reminders",
    ninetyDayTarget: "85-95% on time",
  },
  {
    metric: "Compliance renewals actioned before expiry",
    baselinePreLaunch: "Manual: 60-70% before expiry",
    thirtyDayTarget: "80% before expiry",
    ninetyDayTarget: "100% before expiry",
  },
  {
    metric: "NPS from lessor clients",
    baselinePreLaunch: "N/A (no clients)",
    thirtyDayTarget:
      "First NPS collected at Day 30. NPS 40+ target for early lessor clients.",
    ninetyDayTarget: "",
  },
];

export const lessorMetricsSummary = {
  northStar:
    "Monthly Rental Income Collected On Time — 90%+ target within 90 days. This single number captures collection efficiency, platform adoption, and client value for lessors.",
  threeLeadingIndicators:
    "(1) Invoicing accuracy and dispatch rate — are invoices going out correctly and on time? (2) Compliance renewal zero-lapse rate — are all property compliance documents being renewed before expiry? (3) Tenant maintenance SLA compliance — are tenant requests being resolved within SLA?",
  phase1InvestmentPayback:
    "A lessor client with Rs 5 crore annual rental roll: improving collection rate from 70% to 90% on time = Rs 50-100 lakh in improved cash flow timing annually. Platform cost: Rs 10-25 lakh/year. ROI is 4-10x in Year 1 from collection efficiency alone — before accounting for time saved, compliance risk eliminated, and tenant retention improvement.",
};

// ==================== TAB 10: SWOT ANALYSIS ====================

export const swotAnalysisLessee: SWOTAnalysis = {
  strengths: [
    {
      item: "Data sovereignty architecture",
      description:
        "The only enterprise lease management platform in India that deploys on client-owned servers, making it the mandatory choice for regulated financial institutions, PSUs, and government buyers.",
    },
    {
      item: "End-to-end operations coverage",
      description:
        "Combines lease lifecycle, rent, compliance, AMC, maintenance, and utilities in one platform - replacing 3-5 separate tools and increasing platform ACV and stickiness.",
    },
    {
      item: "India-first design",
      description:
        "GST-compliant invoicing, IND AS 116 support roadmap, Fire NOC and Shop Act compliance tracking, Tally export, and INR pricing built for Indian regulatory reality from day one.",
    },
    {
      item: "Six-level location hierarchy",
      description:
        "Country to Circle geographic structure enables portfolio reporting at any geographic granularity - a requirement for large Indian enterprises that global competitors do not offer.",
    },
    {
      item: "Compliance-embedded platform",
      description:
        "Compliance management is a first-class module, not an add-on. Renewal alerts with ownership assignment create institutional accountability that spreadsheets cannot replicate.",
    },
    {
      item: "Vendor performance scoring system",
      description:
        "AMC vendor ratings across 4 dimensions enable data-driven vendor management - absent in all competitor India products and rare even in global tools.",
    },
    {
      item: "Renewal pipeline with rent comparison",
      description:
        "Structured Kanban-style renewal workflow with proposed vs current rent comparison provides a negotiation intelligence advantage not available in any India lease tool.",
    },
    {
      item: "Custom fields and master data engine",
      description:
        "Enterprise-grade configurability (custom fields, hierarchical location master, role-based access) enables deployment across diverse enterprise structures without custom development.",
    },
    {
      item: "Audit logs for every action",
      description:
        "Immutable, timestamped, and user-attributed audit trail satisfying CAG, internal audit, and IND AS 116 audit requirements - a structural advantage for compliance-driven buyers.",
    },
    {
      item: "Part of Lockated suite",
      description:
        "Lockated's broader product suite (workplace management, visitor management, facility management) enables cross-sell and deepening of client relationship over time.",
    },
  ],
  weaknesses: [
    {
      item: "No IND AS 116 automated journal generation",
      description:
        "Listed companies require automated ROU asset and lease liability journal entries. Absence of this feature blocks approximately 30% of enterprise deals at the demo stage.",
    },
    {
      item: "No native mobile app",
      description:
        "Facility managers and field teams operate on mobile. Without a native iOS and Android app, the AMC and maintenance modules see low adoption from field-facing users.",
    },
    {
      item: "No ERP bi-directional integration",
      description:
        "Organisations running SAP or Oracle require native integration for data sync. Manual export creates friction and resistance from Finance and IT teams.",
    },
    {
      item: "Limited brand awareness in India enterprise market",
      description:
        "Lockated is not yet known among Heads of Real Estate at India's top 500 companies. Pipeline generation currently depends entirely on outbound and referrals.",
    },
    {
      item: "No AI lease abstraction capability",
      description:
        "Onboarding 200+ historical leases requires manual data entry. Without AI-powered PDF abstraction, implementation timelines are 4-8 weeks, which is slow for large portfolios.",
    },
    {
      item: "No landlord self-service portal",
      description:
        "Landlords call Lease Managers repeatedly for payment confirmations. Without a portal, inbound landlord calls consume team capacity and delay adoption of the communication layer.",
    },
    {
      item: "No multi-entity support yet",
      description:
        "Conglomerates and groups with multiple legal entities cannot deploy across all entities without separate accounts. Caps ACV at single-entity deals.",
    },
    {
      item: "Thin global presence",
      description:
        "Global markets (Southeast Asia, Middle East) where data sovereignty is a requirement are currently unaddressed. No local teams, no local compliance features for non-India markets.",
    },
    {
      item: "Single-person dependency risk in small clients",
      description:
        "PM company clients or lean enterprise teams may have one administrator managing the platform. If that person leaves, adoption can collapse without proactive CS.",
    },
    {
      item: "Limited case studies and public references",
      description:
        "Early-stage product with few published customer success stories reduces credibility in enterprise sales cycles where reference customers are a standard requirement.",
    },
  ],
  opportunities: [
    {
      item: "IND AS 116 compliance mandate",
      description:
        "India's lease accounting standard is mandatory for listed companies and increasingly required for large unlisted companies. Every enterprise that has not automated this is a qualified prospect.",
    },
    {
      item: "India commercial real estate growth",
      description:
        "India's commercial real estate market is projected to grow from USD 340 billion to USD 860 billion by 2035 at 9.7% CAGR. Every new property lease is a Lockated opportunity.",
    },
    {
      item: "India real estate software market",
      description:
        "India's real estate software market is growing at 10% CAGR to reach USD 910 million by 2035 - and enterprise lease management is the fastest-growing segment.",
    },
    {
      item: "No dominant India-built enterprise competitor",
      description:
        "Hubler serves SMB but not enterprise. No India-built product addresses the 50-500 property enterprise segment. Lockated can be the default before a well-funded competitor enters.",
    },
    {
      item: "Data localisation regulatory trend",
      description:
        "India's Digital Personal Data Protection Act (DPDPA) 2023 and related data residency regulations are increasing enterprise sensitivity to cloud data hosting, directly driving demand for Lockated's deployment model.",
    },
    {
      item: "REIT growth in India",
      description:
        "SEBI-regulated REITs (Embassy, Mindspace, Brookfield, Nexus) are professionalising India's commercial real estate sector. Professional REIT managers require enterprise-grade tools for portfolio management.",
    },
    {
      item: "Retail expansion beyond metros",
      description:
        "India's organised retail is rapidly expanding into Tier 2 and 3 cities. Retail chains adding 20-50 stores per year have exponentially growing lease management complexity.",
    },
    {
      item: "ESG and BRSR reporting mandate",
      description:
        "SEBI's mandatory Business Responsibility and Sustainability Report for top 1000 listed companies creates demand for a platform that tracks energy, water, and carbon data at property level.",
    },
    {
      item: "PSU and government digitisation",
      description:
        "India's DoPT and Smart Cities initiatives are pushing public sector organisations to digitise estate management. Lockated's data sovereignty model is uniquely suited to government requirements.",
    },
    {
      item: "Phase 2 global expansion opportunity",
      description:
        "Southeast Asian markets (Singapore, Malaysia, Vietnam, Indonesia) have similar data sovereignty concerns and growing commercial real estate sectors with no dominant India-equivalent tool.",
    },
  ],
  threats: [
    {
      item: "Yardi India market entry",
      description:
        "Yardi is expanding Yardi Corom for corporate occupiers in India. If Yardi prices aggressively for India's mid-market, it could outcompete Lockated on brand and feature depth for the Rs 20+ lakh ACV segment.",
    },
    {
      item: "MRI Software India channel activation",
      description:
        "MRI's open API platform combined with a well-resourced India channel partner could quickly address the enterprise mid-market. MRI's investment in AI (Ask Agora) signals intent.",
    },
    {
      item: "AI lease abstraction commoditisation",
      description:
        "As AI PDF abstraction becomes a commodity feature (Visual Lease, Nakisa, Tango, Re-Leased all investing), Lockated's manual onboarding disadvantage will widen against AI-first competitors.",
    },
    {
      item: "Well-funded India SaaS competitor",
      description:
        "A venture-backed India SaaS startup targeting the same enterprise lease management segment with 3-year runway could outpace Lockated on product development and marketing spend.",
    },
    {
      item: "ERP vendor feature expansion",
      description:
        "SAP and Oracle are adding lease management modules natively to S/4HANA and Fusion. As ERP-embedded lease tracking improves, enterprises already running SAP may see less need for a standalone tool.",
    },
    {
      item: "Slow Phase 1 roadmap execution",
      description:
        "If the IND AS 116 module, mobile app, and Tally export are not shipped within 90 days, the 30% blocked pipeline will not convert and competitive alternatives may close those deals.",
    },
    {
      item: "Enterprise procurement delays",
      description:
        "Long IT security reviews and procurement cycles (12-16 weeks for enterprise deals) slow revenue recognition and create cash flow pressure during the critical growth phase.",
    },
    {
      item: "Reference customer shortage",
      description:
        "Without 3-5 visible reference customers willing to speak publicly, enterprise buyers in India will continue to request references that Lockated cannot provide, stalling deal velocity.",
    },
    {
      item: "Global SaaS pricing pressure",
      description:
        "Visual Lease and LeaseAccelerator lowering their India entry pricing could make global compliance-first tools competitive on price for mid-market deals, especially if they offer Indian language support.",
    },
    {
      item: "Data sovereignty misunderstood",
      description:
        "If the market does not sufficiently understand or value data sovereignty as a differentiator (because awareness of data residency risk is low), Lockated's primary moat may not resonate in early sales conversations.",
    },
  ],
};

// ==================== TAB 11: ENHANCEMENTS ====================

export const enhancementsLessee: Enhancement[] = [
  {
    id: 1,
    module: "Lease and Rental Agreement Management",
    feature: "AI Lease Abstraction from PDF",
    currentBehavior:
      "Lease Managers manually read PDF agreements and type all key terms into the lease creation form. A 200-lease portfolio takes 6-8 weeks to onboard.",
    enhancedBehavior:
      "AI model (LLM) reads uploaded PDF agreement and auto-extracts rent, escalation, deposit, lock-in period, CAM, penalty clauses, and landlord details into a pre-filled form. Lease Manager reviews and confirms in 5 minutes instead of 45.",
    integrationType: "AI - LLM",
    impactLevel: "High",
    revenueImpact:
      "Reduces onboarding from 6-8 weeks to 3-5 days for large portfolios. Directly enables enterprise deals with 200+ historical leases. Leapfrogs Tango and Visual Lease in speed to value.",
    isAI: true,
    isMCP: false,
    effort: "High",
    priority: "P1",
  },
  {
    id: 2,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Predictive Renewal Recommendation Engine",
    currentBehavior:
      "Renewal reminders sent at 90/60/30 days. No guidance on what rent to target or when optimal negotiation timing is.",
    enhancedBehavior:
      "AI model analyses historical lease data, renewal outcomes, regional rent trends (from integrated data feeds), and landlord negotiation history to recommend: optimal renewal initiation date, target rent range (below market = hold, above = exit signal), and negotiation opening position.",
    integrationType: "AI - Predictive",
    impactLevel: "High",
    revenueImpact:
      "Transforms Lockated from a tracker to a strategic advisor. Retail chain clients saving 10-18% on renewal rents generates Rs 50 lakh to Rs 5 crore savings per client per year - strongest case study content available.",
    isAI: true,
    isMCP: false,
    effort: "High",
    priority: "P1",
  },
  {
    id: 3,
    module: "Compliance Management",
    feature: "NLP-powered Compliance Document Reader",
    currentBehavior:
      "Compliance documents (Fire NOC, OC) are uploaded as PDFs. Expiry date and issuing authority are manually extracted by the Compliance Officer.",
    enhancedBehavior:
      "NLP model reads compliance certificate PDF, extracts validity date, issuing authority, certificate number, and conditions. Auto-populates all fields and flags any document where extracted confidence is below 90% for human review.",
    integrationType: "AI - NLP",
    impactLevel: "High",
    revenueImpact:
      "Eliminates the biggest data entry bottleneck in the compliance module. Reduces compliance onboarding time by 80%. Increases adoption of compliance module by removing the upload friction.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 4,
    module: "Maintenance Management",
    feature: "AI-assisted Issue Triage and Vendor Recommendation",
    currentBehavior:
      "Facility Manager manually reads the maintenance ticket description and decides the category, priority, and vendor assignment.",
    enhancedBehavior:
      "NLP model reads the maintenance issue description, classifies the issue category (HVAC, plumbing, electrical, etc.), suggests priority level based on description keywords and past ticket history, and recommends the top 2 vendors from the vendor master based on past performance for that issue type at that property.",
    integrationType: "AI - NLP",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces triage time from 15-20 minutes per ticket to under 2 minutes. Enables less experienced Facility Managers to make correct assignments. Improves vendor performance consistency.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 5,
    module: "OPEX and Expense Management",
    feature: "Anomaly Detection for Expense Spikes",
    currentBehavior:
      "Finance Manager manually reviews OPEX entries and flags unusual amounts based on experience. No automated anomaly detection.",
    enhancedBehavior:
      "AI model trained on 12+ months of historical expense data per property identifies anomalous entries: amounts more than 2 standard deviations from historical mean for the same category and month, unusual vendor charges, duplicate entries. Flags are surfaced in the expense dashboard for Finance Manager review.",
    integrationType: "AI - Predictive",
    impactLevel: "Medium",
    revenueImpact:
      "Prevents duplicate payments and overcharging by vendors. Estimated 3-8% of annual OPEX spend is recoverable through anomaly detection. Creates a case study around 'Lockated caught Rs 8 lakh in duplicate vendor invoices in Q1'.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 6,
    module: "Lease Lifecycle and Renewal Management",
    feature: "WhatsApp and Email Communication MCP Integration",
    currentBehavior:
      "Renewal negotiation communications happen in personal email and WhatsApp, not tracked in Lockated. No communication history in the platform.",
    enhancedBehavior:
      "MCP integration with client's WhatsApp Business API and Gmail/Outlook enables Lease Managers to send and receive landlord communications directly within the renewal pipeline stage. All inbound replies are auto-logged to the lease record. No switching between apps.",
    integrationType: "MCP",
    impactLevel: "High",
    revenueImpact:
      "Makes the renewal pipeline the single communication record for all landlord negotiations. Increases adoption of the renewal module by 40-50% when communication tools are embedded. Eliminates deal memory loss when team members change.",
    isAI: false,
    isMCP: true,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 7,
    module: "Masters and Configuration Engine",
    feature: "ERP Cross-platform Automation (SAP and Tally)",
    currentBehavior:
      "Rent payments, OPEX entries, and lease journals are exported to CSV and manually uploaded into SAP or Tally by Finance team. Re-entry risk and duplication.",
    enhancedBehavior:
      "Cross-platform automation pushes approved financial entries from Lockated directly to SAP S/4HANA or Tally via API. Payment recording in Lockated triggers journal entry creation in ERP within 60 seconds. Error reconciliation reduced to zero.",
    integrationType: "Cross-platform automation",
    impactLevel: "High",
    revenueImpact:
      "Eliminates the single biggest Finance team objection to Lockated adoption (double data entry). Directly unblocks SAP-running enterprise deals estimated at 20% of pipeline. Increases platform stickiness.",
    isAI: false,
    isMCP: false,
    effort: "High",
    priority: "P1",
  },
  {
    id: 8,
    module: "Utilities Management",
    feature: "IoT Smart Meter Integration",
    currentBehavior:
      "Utility consumption data entered manually by Facility Manager at end of each month from paper bills or meter readings.",
    enhancedBehavior:
      "API integration with smart meter platforms (Schneider EcoStruxure, Siemens, Honeywell) pulls real-time consumption data automatically. Daily or hourly consumption dashboards available. Automatic anomaly alerts for unusual spikes.",
    integrationType: "API",
    impactLevel: "Medium",
    revenueImpact:
      "Positions Lockated as an ESG and sustainability tool (BRSR reporting requirement for top 1000 listed companies). Unlocks a new buyer persona: Chief Sustainability Officer. Increases utility module stickiness.",
    isAI: false,
    isMCP: false,
    effort: "High",
    priority: "P2",
  },
  {
    id: 9,
    module: "Compliance Management",
    feature: "Government API Integration for Licence Validation",
    currentBehavior:
      "Compliance Officers manually verify that uploaded certificates are valid by cross-checking with government websites.",
    enhancedBehavior:
      "API integration with government portals (FSSAI verification API, fire department compliance APIs, MCA GST validation) allows Lockated to validate compliance documents automatically on upload. Invalid or expired documents rejected at point of entry.",
    integrationType: "API",
    impactLevel: "Medium",
    revenueImpact:
      "Eliminates manual verification effort. Reduces compliance error risk by 90%. Creates a strong differentiator for government and regulated sector buyers who require verified compliance records.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 10,
    module: "AMC Management",
    feature: "Vendor Communication MCP (Email and SMS)",
    currentBehavior:
      "AMC service visit scheduling and reminders sent manually by Facility Manager via phone or WhatsApp to each vendor.",
    enhancedBehavior:
      "MCP integration with email and SMS providers enables Lockated to auto-send service visit reminders to vendors 48 hours and 24 hours before scheduled visits. Vendor can confirm via reply. Confirmations are logged in the service calendar.",
    integrationType: "MCP",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces vendor no-show rate from 20-30% to under 5%. Facility Managers report saving 2-3 hours per week on vendor follow-up. Improves AMC SLA compliance metrics.",
    isAI: false,
    isMCP: true,
    effort: "Low",
    priority: "P2",
  },
  {
    id: 11,
    module: "Lease and Rental Agreement Management",
    feature: "Lease Amendment / Version Control with Diffing",
    currentBehavior:
      "When a lease is amended (rent revision, area change, term extension), the existing record is overwritten. Lease Managers manually track the making and timing of changes. Previous versions are only retrievable from Audit Logs. No consolidated amendment history view.",
    enhancedBehavior:
      "Version control system maintains a copy of every version of a lease record. Amendment diff view shows exactly what changed between Versions 1 and 2: 'Rent: 50,000 → 55,000, Area: 1,200 → 1,350 sqft.' Version history is one click, timestamped, and attributed to the user who made the amendment.",
    integrationType: "Native",
    impactLevel: "Medium",
    revenueImpact:
      "Critical for audit readiness. Enterprises with 200+ leases require a clear amendment trail. This feature alone converts 3-5 enterprise deals per year that currently stall on the 'how do we track amendments?' question.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 12,
    module: "Dashboard and Analytics",
    feature: "Executive Portfolio Intelligence Report (Auto-generated PDF)",
    currentBehavior:
      "Board-level and investor-level reporting is created manually by the Head of Real Estate from multiple Lockated exports.",
    enhancedBehavior:
      "One-click generation of a professionally formatted 6-10 page PDF report covering portfolio summary, top 10 lease expiries, compliance status, OPEX analysis, and utility cost breakdown.",
    integrationType: "High",
    impactLevel: "High",
    revenueImpact:
      "Directly enables Head of Real Estate to present to CFO or Board with a 5 min preparation time. Creates a 'magic moment' for new clients.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "S",
  },
  {
    id: 13,
    module: "Rent Collection and Financial Tracking",
    feature: "Bank Account Reconciliation Integration",
    currentBehavior:
      "Finance Manager manually reconciles rent payments received in bank statements to outstanding invoices. Matches payment records. All matches are manual.",
    enhancedBehavior:
      "API integration with client's bank (HDFC, ICICI, Axis, SBI corporate banking APIs) pulls incoming payment data daily. Lockated auto-matches payments to outstanding invoices and flags unmatched amounts for manual review.",
    integrationType: "API",
    impactLevel: "High",
    revenueImpact:
      "Eliminates 2-4 hours of manual bank reconciliation per Finance team member per month. Directly captures trust of payment-conscious buyers. Accelerates monthly book closure.",
    isAI: false,
    isMCP: false,
    effort: "High",
    priority: "P1",
  },
  {
    id: 14,
    module: "Property and Asset Management",
    feature: "3D Floor Plan / Visual Integration",
    currentBehavior:
      "Property records contain text-based area metrics (carpet, chargeable sqft). No visual representation of floor layouts.",
    enhancedBehavior:
      "Integration with CAD/BIM platforms (AutoDesk, SketchUp via API) to upload 2D/3D floor plan images linked to each unit record. Space utilisation overlay to visualise vacant vs occupied space on floor plan.",
    integrationType: "Third-party",
    impactLevel: "Low",
    revenueImpact:
      "Primarily a design feature for corporate real estate and property management. High differentiation in visual demos.",
    isAI: false,
    isMCP: false,
    effort: "High",
    priority: "P5",
  },
  {
    id: 15,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Multi-language Lease Agreement Support",
    currentBehavior:
      "Lease creation and document upload is in English only. Lease summaries generated in English. Interface supports Hindi and English only.",
    enhancedBehavior:
      "OCR and NLP model with Indian language support reads lease agreements in regional languages (Hindi, Marathi, Tamil, Telugu, Kannada). Interface supports Hindi and English natively. Lease summaries generated in preferred language.",
    integrationType: "AI - NLP",
    impactLevel: "Medium",
    revenueImpact:
      "Unlocks government, PSU and SMB clients operating in regional languages. Estimated 15-25% of India's commercial lease agreements are in regional languages. Creates a strong differentiation.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 16,
    module: "Invoicing and Payments",
    feature: "Digital Payment Integration (NEFT, UPI, Auto-debit)",
    currentBehavior:
      "Rent payments are recorded manually by the Finance Manager after verifying receipt in bank. No embedded payment initiation.",
    enhancedBehavior:
      "Integration with payment gateway (Razorpay, PayU, HDFC SmartHub) enables Lockated to display a 'Pay Now' link on each invoice. NEFT or UPI payment is initiated directly from Lockated. Auto-matches to invoice on receipt confirmation.",
    integrationType: "Third-party",
    impactLevel: "Medium",
    revenueImpact:
      "Removes this need to switch between bank and Lockated for payment recording. Creates a direct link that reduces payment delay. Opens a new integration revenue stream via platform stickiness.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 17,
    module: "Masters and Configuration Engine",
    feature: "Lockated to Property Data Platform Sync (MCP)",
    currentBehavior:
      "Market rent benchmarking requires manual research. No data integration with commercial real estate data providers.",
    enhancedBehavior:
      "MCP integration with Anarock Data, JLL India Market Intelligence, or PropEquity platform for rent per sqft data for each micro-market and property tier. Enables market benchmark alongside proposed and current rent.",
    integrationType: "MCP",
    impactLevel: "High",
    revenueImpact:
      "Creates a market analysis edge that no India competitor can replicate easily. Makes Lockated indispensable for rent review meetings. Transforms the renewal negotiation module: lease savings estimated at 10-18% on renewals with market benchmark data.",
    isAI: false,
    isMCP: true,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 18,
    module: "Security Deposit Management",
    feature: "Deposit Interest Calculation and GST on Deposit",
    currentBehavior:
      "Security deposit amounts are tracked but interest on deposit is calculated manually. GST implications on forfeiture from deposit are not consolidated.",
    enhancedBehavior:
      "Auto-calculation of interest on security deposit as specified in the lease agreement. GST liability for interest calculated and displayed. Compliance with lease deposit-specific surplus/shortfall calculation and adjustment billing for current interest provisions.",
    integrationType: "Native",
    impactLevel: "Medium",
    revenueImpact:
      "Eliminates manual calculation that Finance teams do quarterly. Reduces the compliance risk on deposit interest. A small but important differentiator for BFSI and funded company clients.",
    isAI: false,
    isMCP: false,
    effort: "Low",
    priority: "P3",
  },
  {
    id: 19,
    module: "AMC Management",
    feature: "Predictive Maintenance Scheduling",
    currentBehavior:
      "AMC service visits are scheduled on a calendar basis based on the AMC contract. No predictive adjustment based on equipment usage or condition data.",
    enhancedBehavior:
      "AI model trained on equipment service history, sensor data (if available), and historical failure patterns determines optimal preventive maintenance schedule. Pre-diagnosis prioritised by equipment type, age, and performance degradation indicator. Frequency auto-adjusted based on seasonal patterns.",
    integrationType: "AI - Predictive",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces emergency maintenance incidents by 20-30%. Facilities Management teams can proactively address issues before tenant escalation. Creates a strong retention argument.",
    isAI: true,
    isMCP: false,
    effort: "High",
    priority: "P2",
  },
  {
    id: 20,
    module: "Dashboard and Analytics",
    feature: "ESG and BRSR Reporting Module",
    currentBehavior:
      "Utility consumption data is tracked in Lockated but not connected to SEBI BRSR-compliant energy and water consumption reports or sustainability metrics.",
    enhancedBehavior:
      "Automated generation of SEBI BRSR-compliant energy and water consumption reports per property. Carbon calculations based on consumption data. Sustainability reporting to be added by default. First India lease tool with native BRSR report generation.",
    integrationType: "Native",
    impactLevel: "High",
    revenueImpact:
      "SEBI BRSR is mandatory for top 1000 listed companies. Adds a new CFO and Sustainability officer buyer persona. First India lease tool with native BRSR report generation.",
    isAI: false,
    isMCP: false,
    effort: "High",
    priority: "P2",
  },
  {
    id: 21,
    module: "Notifications and Alerts",
    feature: "Intelligent Notification Prioritisation",
    currentBehavior:
      "All alerts and notifications are delivered with equal urgency. Lease Managers receive 20-40 notifications per day, leading to alert fatigue and important alerts being missed.",
    enhancedBehavior:
      "AI model analyses alert history, user response patterns, and business impact of each alert type to create a risk-based notification hierarchy for each user. Low-value alerts are auto-summarised into 'last week's alerts.' Critical alerts are escalated from 'bell' notification to SMS or email.",
    integrationType: "AI - LLM",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces the perception of being an 'notification overload.' Users who customise and are active on compliance alerts and compliance deadlines. Initial adoption of mobile version makes the platform operationally essential.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 22,
    module: "Lease and Rental Agreement Management",
    feature: "Digital Lease Signing Integration (eSign)",
    currentBehavior:
      "Signed lease agreements are scanned and uploaded as PDFs. Physical or email-based signing.",
    enhancedBehavior:
      "Integration with eSign platforms (Aadhaar eSign, DigiLocker, or SignDesk) allows lease agreements and DSC-based documents to be digitally signed within the Lockated platform. Signed copies auto-archived.",
    integrationType: "Third-party",
    impactLevel: "Medium",
    revenueImpact:
      "Eliminates the lease contract workflow bottleneck. Faster signing accelerates deal closure. Digital stamp-duty readiness for future states using eStamp. Original lease is on eSign for secure.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
];

export const topEnhancements = [
  {
    rank: 1,
    feature: "AI Lease Abstraction from PDF",
    why: "Onboarding 200+ historical leases in days instead of weeks is the #1 barrier to enterprise deals. This feature alone unblocks an estimated 25-30% of the large portfolio segment. Visual Lease, Nakisa, Tango - all have AI abstraction. Lockated must match this to remain competitive for any enterprise with 100+ leases to migrate.",
  },
  {
    rank: 2,
    feature: "Predictive Renewal Recommendation Engine",
    why: "Makes Lockated the strategic advisor for rent negotiations, not just a tracker. The measurable outcome (10-18% rent savings per renewal) is the most compelling CFO-level ROI story in the category. No India competitor has this. Globally, only Tango and Yardi are moving toward predictive portfolio analytics. First mover in India.",
  },
  {
    rank: 3,
    feature: "WhatsApp and Email MCP Integration for Renewal Pipeline",
    why: "Embeds Lockated into the Lease Manager's daily communication workflow. Once communication is logged in the platform, switching cost increases dramatically. Addresses the most common adoption drop-off point. No competitor in India or globally offers embedded WhatsApp renewal communication. First-of-kind feature that creates a genuine moat.",
  },
  {
    rank: 4,
    feature: "ESG and BRSR Reporting Module",
    why: "SEBI BRSR is mandatory for top 1000 listed companies. Adds a new CFO and Sustainability officer buyer persona. First India lease tool with native BRSR report generation. No lease management competitor in India offers BRSR reporting. Yardi Energy Suite exists globally at USD 5,000+ premium. Lockated can bundle this into the enterprise plan.",
  },
  {
    rank: 5,
    feature: "Bank Account Reconciliation Integration",
    why: "Real-time bank payment matching eliminates the last manual Finance team step. Creates daily active use by Finance team who currently log in only to record payments. SAP and Oracle ERP lease modules do not offer real-time bank reconciliation for lease payments. Lockated leapfrogs ERP-embedded competition on Finance team convenience.",
  },
];

// SWOT Analysis - LESSOR PERSPECTIVE
export const swotAnalysisLessor: SWOTAnalysis = {
  strengths: [
    {
      item: "Data sovereignty for property owners",
      description:
        "The only commercial property management platform in India deployed on client-owned servers — mandatory for PSU property owners, government-adjacent entities, and regulated landlords.",
    },
    {
      item: "End-to-end lessor operations",
      description:
        "Combines lease portfolio management, tenant billing, receivables tracking, maintenance management, compliance, AMC, and utilities in one platform — replacing 5–7 disconnected tools.",
    },
    {
      item: "GST-compliant tenant invoicing",
      description:
        "Generates legally compliant rent invoices with GSTIN, HSN codes, and tax breakdowns for commercial leases. No manual GST calculation required.",
    },
    {
      item: "India-first commercial real estate compliance",
      description:
        "Tracks India-specific compliance (Fire NOC, CC, OC, property tax) with automated renewal alerts. No global platform provides this.",
    },
    {
      item: "INR pricing at 80–90% less than global competitors",
      description:
        "Yardi and MRI cost Rs 25–100 lakh/year plus implementation. Lockated starts at Rs 3,000 per property per year.",
    },
    {
      item: "Automated receivables and rent reminder workflow",
      description:
        "Automated tenant payment reminders at D-7, D-1, and D+1 reduce overdue collections by 70–80% within 90 days of go-live.",
    },
    {
      item: "Security deposit management",
      description:
        "Complete deposit registry — receipt recording, interest calculation, refund scheduling, and damage deduction — fully integrated with lease records.",
    },
    {
      item: "Maintenance ticket management with tenant interface",
      description:
        "Structured ticketing for tenant-raised requests with SLA tracking and vendor assignment. Replaces WhatsApp-based maintenance management.",
    },
    {
      item: "Compliance calendar with zero-lapse guarantee",
      description:
        "Centrally managed compliance calendar for Fire NOC, CC, OC, insurance, and property tax. Alerting eliminates the risk of compliance lapses.",
    },
    {
      item: "Fast implementation on existing infrastructure",
      description:
        "6–8 week go-live. No cloud migration. Deploys on client's own servers. No IT lift-and-shift required.",
    },
  ],
  weaknesses: [
    {
      item: "No lessor-side IND AS 17 / IFRS 16 accounting journals",
      description:
        "Finance leases require net investment in lease journal entries. Absence blocks all listed real estate developer and REIT opportunities.",
    },
    {
      item: "No tenant self-service portal",
      description:
        "Corporate tenants in Grade-A properties expect a web or mobile portal for invoice download, maintenance ticket submission, and rent payment confirmation.",
    },
    {
      item: "Multi-client architecture incomplete",
      description:
        "Property management companies managing multiple landlord portfolios cannot fully use the platform without complete client-level data isolation and consolidated reporting.",
    },
    {
      item: "No ERP native integration",
      description:
        "SAP, Oracle, and Tally integrations are not yet native. Finance teams at enterprise clients manually export and reconcile data between Lockated and their accounting system.",
    },
    {
      item: "CAM annual reconciliation workflow not built",
      description:
        "Monthly CAM billing is supported, but the end-of-year CAM reconciliation with tenant-specific surplus/shortfall calculation and adjustment billing is not yet available.",
    },
    {
      item: "No mobile app for property managers",
      description:
        "Property managers are mobile and on-site. A web-only interface limits real-time ticket updates and on-site property inspections.",
    },
    {
      item: "No built-in vacancy marketing or pre-letting CRM",
      description:
        "Vacant properties cannot be pre-marketed or managed within the platform. This requires a separate process.",
    },
    {
      item: "No REIT-grade investor reporting templates",
      description:
        "REITs and institutional landlords require standardised investor report formats (rent roll, NOI by asset, lease expiry schedule) that are not yet pre-built.",
    },
    {
      item: "Limited API ecosystem for third-party integration",
      description:
        "No published API for integration with property marketing platforms (99acres, JLL IQ) or tenant portals.",
    },
    {
      item: "No asset valuation and yield analytics",
      description:
        "Rental yield calculation per property (annual rent / asset value) and yield benchmarking are not available — important for family offices and institutional owners.",
    },
  ],
  opportunities: [
    {
      item: "IND AS 17 / IFRS 16 lessor accounting compliance gap",
      description:
        "No India-built platform automates lessor-side accounting journals. First-mover builds an insurmountable lead with listed property companies and REITs.",
    },
    {
      item: "Property management company sector growth",
      description:
        "Institutional ownership of commercial real estate (REITs, PE funds) is driving demand for professional property management — creating a growing segment of PM companies needing a platform of record.",
    },
    {
      item: "Mandatory GST compliance for commercial lessors",
      description:
        "All commercial property leases above threshold are subject to GST. As GST enforcement tightens, lessor demand for compliant invoicing and GSTR-1 filing integration increases.",
    },
    {
      item: "REIT market expansion in India",
      description:
        "India has 5 listed REITs and a growing pipeline of pre-REIT structures. Data sovereignty and IND AS 17 module opens a Rs 50–200 lakh per deal segment.",
    },
    {
      item: "No Indian competitor at this level",
      description:
        "Zero India-built platforms offer commercial-grade property management with data sovereignty, GST compliance, and end-to-end operations. Lockated has a clear first-mover window of 18–24 months.",
    },
    {
      item: "Cross-sell from lessee client base",
      description:
        "Many corporate lessee clients also have a property ownership arm. Converting lessee clients to lessor clients requires no new sales motion.",
    },
    {
      item: "Industrial and logistics sector growth",
      description:
        "India's manufacturing and logistics boom (Rs 5 trillion investment announced in Union Budget 2025) is creating new industrial park operators who need property management tools from Day 1.",
    },
    {
      item: "White-label opportunity for property management companies",
      description:
        "Large PM companies (JLL, Knight Frank, CBRE) are willing to pay a white-label premium for a branded property management platform to offer their clients.",
    },
    {
      item: "India data localisation regulations strengthening",
      description:
        "Increasing regulatory pressure on data residency for financial and real estate data creates a structural tailwind for Lockated's on-premise deployment model.",
    },
    {
      item: "SEZ and tech park expansion",
      description:
        "India's SEZ policy reform and tech park expansion creates new lessor clients with complex compliance and multi-tenant billing requirements that Lockated is uniquely positioned to serve.",
    },
  ],
  threats: [
    {
      item: "Yardi and MRI launching India-specific pricing and local cloud deployment",
      description:
        "If global leaders offer India-hosted cloud with local support at competitive pricing, Lockated's price advantage narrows. Mitigated by on-premise data sovereignty which cloud cannot replicate.",
    },
    {
      item: "Delay in building IND AS 17 module",
      description:
        "Every month without IND AS 17 lessor accounting is a month where listed developer and REIT deals go to global competitors or remain unaddressed. Competitive window is finite.",
    },
    {
      item: "Large developers building bespoke internal tools",
      description:
        "DLF, Godrej, Prestige, or Embassy may build custom property management platforms. Mitigated by mid-market focus and the cost/time of internal development.",
    },
    {
      item: "Property management companies choosing global or white-label ERPs",
      description:
        "If large PM companies (JLL, CBRE) build on Yardi or MRI for their Indian clients, Lockated must compete on price and India specificity.",
    },
    {
      item: "Slow enterprise decision cycles",
      description:
        "Commercial real estate developers and institutional landlords have long procurement cycles (6–12 months for large deals). Pipeline-to-revenue lag creates cash flow risk for growth.",
    },
    {
      item: "Multi-client architecture complexity delaying PM company segment entry",
      description:
        "If multi-client isolation takes more than 3 months to build correctly, Lockated loses the fastest-growing lessor buyer segment to alternatives.",
    },
    {
      item: "GST audit on commercial rent exposing compliance gaps in the market",
      description:
        "If large-scale GST audits hit commercial property lessors, the compliance urgency drives a fast evaluation cycle that Lockated must be ready to win.",
    },
    {
      item: "India commercial real estate market concentration",
      description:
        "10 developers own 60%+ of Grade-A office stock. If they standardise on one platform (e.g., as part of REIT preparation), it creates winner-take-most dynamics in the institutional segment.",
    },
    {
      item: "Economic slowdown reducing commercial real estate occupancy",
      description:
        "A significant drop in commercial occupancy rates (as seen during COVID) reduces the urgency for lessor-side management software as portfolios shrink.",
    },
    {
      item: "Talent risk in building lessor-specific modules",
      description:
        "IND AS 17, multi-client management, and REIT reporting require specialised product and engineering expertise. Hiring delays can push back the institutional segment entry.",
    },
  ],
};

// Enhancements - LESSOR PERSPECTIVE
export const enhancementsLessor: Enhancement[] = [
  {
    id: 1,
    module: "Lease and Rental Agreement Management",
    feature: "AI Lease Abstraction from PDF (Lessor)",
    currentBehavior:
      "Property managers manually read PDF lease agreements signed with tenants and type all key terms into the lease creation form. Onboarding a 100-lease portfolio takes 3–5 weeks.",
    enhancedBehavior:
      "AI reads uploaded PDF lease agreements and auto-extracts: tenant name, rent amount, escalation schedule, CAM terms, deposit amount, notice period, lock-in period, and start/end date. Property manager reviews and confirms. Onboarding time reduced by 70%.",
    integrationType: "AI (GPT-4o or Claude API, document extraction)",
    impactLevel: "High",
    revenueImpact:
      "Reduces implementation time from 3 weeks to 3 days for mid-market lessor clients. Directly reduces implementation cost and accelerates time-to-value.",
    isAI: true,
    isMCP: false,
    effort: "High",
    priority: "P1",
  },
  {
    id: 2,
    module: "Rent Collection and Financial Tracking",
    feature: "AI-Powered Tenant Payment Risk Scoring",
    currentBehavior:
      "Finance managers manually identify overdue tenants by reviewing the receivables aging report. No predictive view of which tenants are likely to default.",
    enhancedBehavior:
      "AI analyses each tenant's payment history (on-time rate, average days late, partial payment frequency) to generate a Payment Risk Score (Low/Medium/High). Finance managers receive a weekly 'At-Risk Tenants' report with prioritised follow-up recommendations.",
    integrationType: "AI (pattern analysis on historical payment data)",
    impactLevel: "High",
    revenueImpact:
      "Reduces portfolio-level overdue collections by 25–40% by enabling proactive management of high-risk tenants before they become overdue.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 3,
    module: "Compliance Management",
    feature:
      "AI Compliance Document Classification and Renewal Date Extraction",
    currentBehavior:
      "Compliance teams manually read uploaded NOC, CC, and OC documents to extract renewal dates and enter them into the compliance module.",
    enhancedBehavior:
      "AI automatically classifies uploaded compliance documents by type (Fire NOC, OC, CC, insurance) and extracts the expiry or renewal date. Auto-populates the compliance record. Alert is set automatically. Zero manual entry for standard compliance documents.",
    integrationType: "AI (document classification and date extraction)",
    impactLevel: "High",
    revenueImpact:
      "Reduces compliance management time by 60%. Eliminates human error in renewal date entry — the most common cause of compliance lapses.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 4,
    module: "Tenant and Landlord Management",
    feature: "AI Tenant Retention Risk Score",
    currentBehavior:
      "Head of Asset Management has no systematic way to identify tenants likely to exit at renewal. Renewal conversations are initiated reactively when the tenant gives notice.",
    enhancedBehavior:
      "AI analyses tenant signals: payment history, maintenance ticket volume, lease age, last communication date, and renewal history to generate a Tenant Retention Risk Score. High-risk tenants are surfaced 180 days before lease expiry so retention conversations start early.",
    integrationType:
      "AI (behavioural analytics on multiple tenant data points)",
    impactLevel: "High",
    revenueImpact:
      "Improving tenant retention by 10% on a 200-property portfolio (average lease Rs 20 lakh/year) = Rs 4 crore in annual rent income retained.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 5,
    module: "Maintenance Management",
    feature: "AI Predictive Maintenance Scheduling",
    currentBehavior:
      "Preventive maintenance visits are scheduled based on fixed calendar intervals (monthly, quarterly, annual) regardless of actual usage, building age, or past failure history.",
    enhancedBehavior:
      "AI analyses maintenance ticket history by building system (HVAC, lifts, plumbing, electrical) to predict failure probability and recommend optimal preventive maintenance intervals. Properties with higher failure rates get more frequent visits.",
    integrationType: "AI (failure prediction on maintenance history)",
    impactLevel: "High",
    revenueImpact:
      "Reduces reactive maintenance costs by 15–25%. Prevents major building system failures that disrupt tenants and risk lease exits.",
    isAI: true,
    isMCP: false,
    effort: "High",
    priority: "P2",
  },
  {
    id: 6,
    module: "Invoicing and Payments",
    feature: "MCP Integration — Accounting System Auto-Journal",
    currentBehavior:
      "Finance managers export invoice data from Lockated and manually import into Tally or SAP. Double-entry risk. Takes 1–2 hours per month per property.",
    enhancedBehavior:
      "MCP server connects Lockated directly to Tally, SAP, or Oracle. Rent invoices, utility invoices, and payment receipts auto-generate journal entries in the accounting system. No manual export-import. Two-way reconciliation.",
    integrationType: "MCP (Tally MCP server, SAP B1 MCP server)",
    impactLevel: "High",
    revenueImpact:
      "Eliminates 5–10 hours per month in manual data entry for finance teams. Removes double-entry reconciliation errors. Prerequisite for enterprise deal closure.",
    isAI: false,
    isMCP: true,
    effort: "High",
    priority: "P1",
  },
  {
    id: 7,
    module: "Compliance Management",
    feature: "MCP Integration — Property Regulatory Portals",
    currentBehavior:
      "Compliance teams manually check BBMP, BMC, MCGM, and other municipal portals to track property tax payment status and building compliance records.",
    enhancedBehavior:
      "MCP server connects to available municipal portal APIs to auto-update property tax payment status and compliance record fields in Lockated. Compliance team receives proactive alerts when a portal record changes.",
    integrationType: "MCP (municipal portal APIs where available)",
    impactLevel: "High",
    revenueImpact:
      "Reduces compliance audit risk. Eliminates manual portal monitoring. First-in-market capability for Indian commercial property management.",
    isAI: false,
    isMCP: true,
    effort: "High",
    priority: "P2",
  },
  {
    id: 8,
    module: "Rent Collection and Financial Tracking",
    feature: "MCP Integration — Bank Statement Auto-Reconciliation",
    currentBehavior:
      "Finance managers download bank statements and manually match rent receipts to outstanding invoices. Takes 2–4 hours per month for a 50-property portfolio.",
    enhancedBehavior:
      "MCP server connects to the client's bank (via Net Banking or RBI-compliant Account Aggregator API). Inbound NEFT/IMPS transactions are auto-matched to open rent invoices. Matched invoices are marked Received. Unmatched amounts are flagged for manual review.",
    integrationType: "MCP (Account Aggregator framework / bank API)",
    impactLevel: "High",
    revenueImpact:
      "Eliminates 2–4 hours of manual bank reconciliation per month. Reduces mis-applied payment errors. Accelerates monthly financial close.",
    isAI: false,
    isMCP: true,
    effort: "High",
    priority: "P2",
  },
  {
    id: 9,
    module: "Tenant and Landlord Management",
    feature: "Automated Rent Escalation Notice Generation",
    currentBehavior:
      "Property managers manually draft and send rent escalation notices to tenants before each escalation date. High error risk in calculating new rent. No standard template.",
    enhancedBehavior:
      "System auto-generates a formal rent escalation notice 30 days before the escalation date: current rent, escalation percentage, new rent from the escalation date, and contractual basis cited. Approved by Head of Asset Management with one click, then dispatched to tenant via email with receipt confirmation.",
    integrationType: "Workflow automation",
    impactLevel: "High",
    revenueImpact:
      "Eliminates late or incorrect escalation notices. Every missed escalation = 1 month of under-collected rent. For a 100-property portfolio with 10% escalation: each notice sent correctly = Rs 2,000–50,000 in additional monthly income.",
    isAI: false,
    isMCP: false,
    effort: "Low",
    priority: "P1",
  },
  {
    id: 10,
    module: "Lease Lifecycle and Renewal Management",
    feature: "Market Rent Benchmarking for Renewal Pricing",
    currentBehavior:
      "Property managers estimate renewal rent increases based on experience and informal market knowledge. No data-driven benchmark for micro-market rent levels.",
    enhancedBehavior:
      "At 180 days before lease expiry, the renewal module displays a market rent benchmark for the property's micro-market: average asking rent for comparable properties sourced from public listing data (99acres Commercial, JLL IQ API). Property manager uses this to set a data-driven renewal pricing target.",
    integrationType: "API integration (property listing platforms)",
    impactLevel: "High",
    revenueImpact:
      "Data-driven renewal pricing captures 5–15% additional rent uplift vs informal estimation. On a 100-property portfolio with Rs 5 crore annual rent, a 7% improvement = Rs 35 lakh additional annual income.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 11,
    module: "Utilities Management",
    feature: "Automated Utility Invoice Generation from Meter Readings",
    currentBehavior:
      "Property managers capture meter readings manually in a spreadsheet, calculate consumption and per-unit charges, prepare utility invoices in a separate billing software, and dispatch to tenants monthly.",
    enhancedBehavior:
      "Lockated captures meter readings from a meter reading app. System auto-calculates consumption on a per-unit or slab basis, applies the per-unit rate from the lease terms, generates a utility invoice ready for dispatch. One-click sends it to the tenant.",
    integrationType: "Workflow automation with calculation engine",
    impactLevel: "High",
    revenueImpact:
      "Reduces billing cycle from 5 days to 1 day per building. Prevents billing errors that lose Rs 15 lakh per year on a 50-property portfolio. Auto-captures revenue that manual process misses.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 12,
    module: "Property and Asset Management",
    feature: "Vacancy Duration and Financial Impact Tracking",
    currentBehavior:
      "No systematic tracking of how long a property stays vacant. The rent loss per day of vacancy is not calculated.",
    enhancedBehavior:
      "When a lease terminates or a unit is flagged vacant, a 'Vacancy Duration Counter' starts. The rent loss per day (based on last rent or market rent) accumulates visually in the dashboard. Head of Asset Management receives a weekly vacancy cost alert.",
    integrationType: "Workflow automation",
    impactLevel: "Medium",
    revenueImpact:
      "Visibility into vacancy cost drives urgency in re-leasing. On a 100-property portfolio, reducing vacancy by 15 days = Rs 25-75 lakh in recovered annual rent.",
    isAI: false,
    isMCP: false,
    effort: "Low",
    priority: "P1",
  },
  {
    id: 13,
    module: "Compliance Management",
    feature: "Compliance Audit Pack Auto-Generation",
    currentBehavior:
      "Compliance teams manually assemble documents on request. No pre-pack for rapid input to pack for insurance claims, landlord queries, and government inspections.",
    enhancedBehavior:
      "One click generates a Compliance Audit Pack for a selected property or portfolio: all compliance documents by category (Fire NOC, land records, trade licences), expiry status, and next renewal dates. Available as PDF download and Digital signature option for final certification.",
    integrationType: "Document management",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces compliance audit preparation time. Helps clients avoid penalties and creates proactive compliance stance. Total time savings for every lessor client.",
    isAI: false,
    isMCP: false,
    effort: "Low",
    priority: "P1",
  },
  {
    id: 14,
    module: "Rent Collection and Financial Tracking",
    feature: "Late Fee Auto-Calculation and Invoice Addition",
    currentBehavior:
      "Finance managers manually calculate late fees when a tenant payment is overdue and add them to the next invoice. Manual process.",
    enhancedBehavior:
      "When a tenant payment is marked as Overdue, the system automatically calculates the late fee based on the contractual rate (e.g., 2% per month or flat rate). Late fee is auto-added to the next invoice as a separate line item. Late fee amount is visible in the receivables dashboard.",
    integrationType: "Workflow automation (formula-based)",
    impactLevel: "Medium",
    revenueImpact:
      "Ensures all late fees are charged consistently. Eliminates revenue leakage from inconsistently applied late fees. For a portfolio with 10% overdue, correct late fee enforcement generates Rs 5-15 lakh per year in recovered fees.",
    isAI: false,
    isMCP: false,
    effort: "Low",
    priority: "P1",
  },
  {
    id: 15,
    module: "AMC Management",
    feature: "AMC Cost vs Service Quality Analysis",
    currentBehavior:
      "AMC vendor performance is assessed informally. No systematic comparison of AMC cost vs service quality delivered.",
    enhancedBehavior:
      "For each AMC contract, the platform calculates a Cost per Service Unit and compares it against the vendor's SLA compliance rate and response time metrics. A 'Vendor Value Report' is generated showing service quality per rupee spent.",
    integrationType: "Analytics module",
    impactLevel: "Medium",
    revenueImpact:
      "Helps clients negotiate AMC renewals with data. Reduces AMC cost savings by 10-20% through informed renegotiation. Enterprise deal closer.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 16,
    module: "Tenant and Landlord Management",
    feature: "Tenant Onboarding Checklist and Digital Welcome Pack",
    currentBehavior:
      "New tenant onboarding is done via email and WhatsApp. No standard checklist. Documents are collected ad hoc.",
    enhancedBehavior:
      "When a new lease is activated, the system auto-generates a standardised Tenant Onboarding checklist and Digital Welcome Pack: property handover documentation including meter reading capture, security deposit receipt, emergency contacts, maintenance portal link, compliance documents. Each checkbox is tracked.",
    integrationType: "Workflow automation with document generation",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces onboarding errors and disputes. Tenant perceives professionalism. Reduces Day 1 to a standard, predictable experience. Creates a strong predictor of long-term tenant satisfaction.",
    isAI: false,
    isMCP: false,
    effort: "Low",
    priority: "P2",
  },
  {
    id: 17,
    module: "Financial Reporting",
    feature: "AI-Generated Monthly Portfolio Narrative Report",
    currentBehavior:
      "Property managers and Heads of Asset Management compile monthly portfolio reports manually. Format varies for board or investor review.",
    enhancedBehavior:
      "AI generates a plain-language monthly portfolio report from the financial data: rent income vs target, occupancy changes, significant lease events (new, renewed, terminated), maintenance SLA summary, and key metrics. Auto-generates narrative and submit. Generated in 5 minutes.",
    integrationType: "AI (generates narrative from structured financial data)",
    impactLevel: "Medium",
    revenueImpact:
      "Eliminates 2-4 hours of monthly report writing per property manager. Creates 'unstructured financial analysis' valuable for property owners. Differentiator: no competitor auto-generates monthly client narrative reports.",
    isAI: true,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 18,
    module: "Lease Lifecycle and Renewal Management",
    feature: "AI Optimal Renewal Terms Recommendation",
    currentBehavior:
      "Property managers set renewal terms (rent increase, tenure, conditions) based on experience. No data-driven recommendation for optimal terms.",
    enhancedBehavior:
      "AI analyses tenant payment history, maintenance request volume, market rent data, lease conditions, and tenure conditions to recommend the optimal terms to make renewal: compromise rent? Match market? Renew with strong concessions? High-risk tenants get a stronger renewal term set with stricter conditions. Low-risk tenants receive incentive terms.",
    integrationType:
      "AI (machine learning on historical lease and payment data)",
    impactLevel: "High",
    revenueImpact:
      "Data-driven renewal terms capture 5-10% improvement compared to gut-feel estimation. On a 100-property portfolio, improved renewals = Rs 25-75 lakh additional annual income. Creates a differentiated advisory experience.",
    isAI: true,
    isMCP: false,
    effort: "High",
    priority: "P2",
  },
  {
    id: 19,
    module: "Invoicing and Payments",
    feature: "Recurring Invoice Auto-Generation and Dispatch",
    currentBehavior:
      "Finance managers manually create invoices for all tenants each month and update for variations (rent increases, deposits). Manually dispatching 50-100 invoices monthly.",
    enhancedBehavior:
      "Monthly recurring invoices are auto-generated on a configured date: base rent, applicable GST, CAM charges (if applicable), any adjustments. Auto-dispatched to tenants via email with receipt tracking. Finance Manager reviews a confirmation dashboard only.",
    integrationType: "Workflow automation (formula-based)",
    impactLevel: "High",
    revenueImpact:
      "Eliminates 2-3 hours of invoice preparation per month for a 100-property portfolio. Reduces errors by 95%. Ensures 100% of revenue is invoiced on time. Cash flow acceleration.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P1",
  },
  {
    id: 20,
    module: "Property and Asset Management",
    feature: "Property Handover Condition Report (Photo Evidence)",
    currentBehavior:
      "Property handover condition at lease start and exit is documented informally or not at all. Photographs stored on personal phones. No structured comparison.",
    enhancedBehavior:
      "At lease end, property manager completes a digital Property Handover Condition Report in the platform: each room, area, and fixture photographed and rated. Comparison with onboarding condition report shows damage. Automates damage deduction and deposit refund calculation.",
    integrationType: "Workflow automation with document generation",
    impactLevel: "Medium",
    revenueImpact:
      "Reduces property deposit disputes. Every dispute avoided saves Rs 50,000-5,00,000 in legal costs and management time. Creates a trackable exit record for every property.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
  {
    id: 21,
    module: "Dashboard and Analytics",
    feature: "ESG and BRSR Reporting Module",
    currentBehavior:
      "Utility consumption data is tracked manually. No automated generation of SEBI BRSR-compliant energy and water consumption reports per property. Carbon footprint calculations based on consumption data. No automated ESG report generation for BRSR-listed entities.",
    enhancedBehavior:
      "Automated generation of SEBI BRSR-compliant energy and water consumption reports per property. Carbon calculations based on consumption data. Sustainability reporting for top 1000 listed entities. First India property platform with native BRSR reporting.",
    integrationType: "Native",
    impactLevel: "High",
    revenueImpact:
      "SEBI BRSR is mandatory for top 1000 listed companies. Sustainability officer becomes new buyer persona. Adds a new revenue stream and differentiator in India with native BRSR reporting.",
    isAI: false,
    isMCP: false,
    effort: "High",
    priority: "P2",
  },
  {
    id: 22,
    module: "Lease and Rental Agreement Management",
    feature: "Digital Lease Signing Integration (eSign)",
    currentBehavior:
      "Signed lease agreements are scanned and uploaded as PDFs. Physical or email-based signing process.",
    enhancedBehavior:
      "Integration with eSign platforms (Aadhaar eSign, DigiLocker, or SignDesk) allows lease agreements to be digitally signed within the Lockated platform. Signed copies auto-archived.",
    integrationType: "Third-party",
    impactLevel: "Medium",
    revenueImpact:
      "Eliminates the lease contract workflow bottleneck. Faster signing accelerates deal closure from weeks to days. Digital stamp-duty readiness for future regulatory compliance.",
    isAI: false,
    isMCP: false,
    effort: "Medium",
    priority: "P2",
  },
];

export const topEnhancementsLessor = [
  {
    rank: 1,
    feature: "AI Lease Abstraction from PDF (Lessor)",
    why: "Cuts onboarding time by 70% for lessor clients with existing portfolios. Every lessor client has an existing portfolio of 50–500 leases that needs to be migrated. Fast onboarding directly converts trials to paid clients.",
  },
  {
    rank: 2,
    feature: "MCP Integration — Accounting System Auto-Journal",
    why: "The #1 blocker for enterprise lessor clients is the need for native accounting integration. Without this, finance teams maintain parallel books. Directly unlocks enterprise deals above Rs 30 lakh/year.",
  },
  {
    rank: 3,
    feature: "AI Tenant Payment Risk Scoring",
    why: "Reduces portfolio overdue collections by 25–40% within 90 days — the most visible ROI metric for lessor clients. Drives retention by delivering measurable financial impact.",
  },
  {
    rank: 4,
    feature: "Automated Rent Escalation Notice Generation",
    why: "Every missed or delayed escalation notice = lost revenue. For a 100-property portfolio with 10% annual escalation, correct notice dispatch generates Rs 10–50 lakh additional income over the contract term.",
  },
  {
    rank: 5,
    feature: "AI Compliance Document Classification",
    why: "Eliminates the most common cause of compliance lapses (manual data entry errors on renewal dates). Zero compliance lapses is the client's compliance team's primary KPI and a key platform selling point.",
  },
];

// ==================== TAB 12: ASSETS ====================

export const assets: Asset[] = [
  {
    name: "Product Brochure - Lessee",
    type: "PDF",
    url: "/assets/lease-management/brochure-lessee.pdf",
    description:
      "Complete product overview for corporate real estate teams, retail chains, and enterprise occupiers.",
  },
  {
    name: "Product Brochure - Lessor",
    type: "PDF",
    url: "/assets/lease-management/brochure-lessor.pdf",
    description:
      "Complete product overview for property owners, developers, and property management companies.",
  },
  {
    name: "Feature Comparison Matrix",
    type: "Excel",
    url: "/assets/lease-management/feature-comparison.xlsx",
    description:
      "Side-by-side comparison with competitors including Yardi, MRI, Tango, and Nakisa.",
  },
  {
    name: "Demo Video - Full Platform",
    type: "Video",
    url: "https://www.youtube.com/watch?v=demo-lease",
    description: "15-minute complete walkthrough of all 16 modules.",
  },
  {
    name: "Case Study - Retail Chain",
    type: "PDF",
    url: "/assets/lease-management/case-study-retail.pdf",
    description:
      "How a 200-store retail chain reduced renewal cycle time by 65% and saved Rs 2.4 crore annually.",
  },
  {
    name: "Pricing Calculator",
    type: "Excel",
    url: "/assets/lease-management/pricing-calculator.xlsx",
    description:
      "Self-serve pricing estimation based on property count and modules.",
  },
  {
    name: "Implementation Guide",
    type: "PDF",
    url: "/assets/lease-management/implementation-guide.pdf",
    description:
      "Step-by-step onboarding guide including data migration templates and timeline.",
  },
  {
    name: "API Documentation",
    type: "Web",
    url: "https://docs.lockated.com/lease-api",
    description:
      "Technical documentation for ERP and third-party integrations.",
  },
];

export const credentials: Credential[] = [
  {
    platform: "Demo Environment",
    username: "demo@lockated.com",
    accessLevel: "Full access to all modules with sample data",
  },
  {
    platform: "Sales Collateral Drive",
    username: "sales-team@lockated.com",
    accessLevel:
      "Google Drive with all sales materials, case studies, and presentations",
  },
  {
    platform: "Training Portal",
    username: "training@lockated.com",
    accessLevel: "LMS with product training videos and certification courses",
  },
];
