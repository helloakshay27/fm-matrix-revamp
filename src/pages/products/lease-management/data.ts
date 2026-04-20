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
    industry: "Commercial Real Estate Occupiers (BFSI and IT)",
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
    industry: "Property Management Companies",
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
    industry: "Industrial and Logistics",
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
    industry: "Government and Public Sector Undertakings",
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
    industry: "Corporate Enterprises and Conglomerates",
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
    industry: "Hospitality and Food and Beverage",
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

// ==================== TAB 6: PRODUCT ROADMAP ====================

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
    question: "Why does your company exist? What impact are you here to make?",
    suggestedAnswer:
      "We exist because large Indian organisations - retail chains, conglomerates, BFSI companies, and PSUs - are managing their most significant fixed cost (real estate) on Excel spreadsheets. A Head of Real Estate at a 300-store retail chain cannot tell you in real time how many leases expire this quarter, what your total rent liability is, or whether you are overpaying rent because your escalation clause was not tracked. We are here to fix that. Lockated's Lease Management gives these organisations the command-centre visibility and operational structure they need to stop overpaying rent, pass every audit, and negotiate renewals from a position of data. Our longer-term impact: we believe India's Rs 340 billion commercial real estate market cannot professionalise without enterprise-grade software built specifically for India's regulatory reality - IND AS 116, GST compliance, Indian compliance documents - and India's data sovereignty requirements.",
    source:
      "Tab 1 (Product Summary - Core Mission, The Problem It Solves, Competitive Moat Today) and Tab 3 (Market Analysis - Target Audience pain points)",
    founderNote:
      "Ready to use as-is. Founder may wish to personalise the opening with a specific client story or personal motivating experience.",
  },
];

// ==================== TAB 8: GTM STRATEGY ====================

export const gtmTargetGroups: GTMTargetGroup[] = [
  {
    name: "Retail Chains (100+ Stores)",
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
        element: "Champion (Internal Advocate)",
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
