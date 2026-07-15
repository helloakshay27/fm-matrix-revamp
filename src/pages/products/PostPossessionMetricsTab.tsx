import React from "react";

type ClientImpactMetric = {
  id: string;
  metricName: string;
  measures: string;
  impactRange: string;
  feature: string;
  cause: string;
  claim: string;
};

type LaunchMetric = {
  id: string;
  metric: string;
  measures: string;
  activationDefinition: string;
  current30Day: string;
  phase130Day: string;
  current3Month: string;
  phase13Month: string;
  whyItMatters: string;
  successSignal: string;
  phase1UpliftReason: string;
};

type LabelValue = {
  label: string;
  value: string;
};

const metricsMeta = {
  title: "Post Possession - Metrics",
  subtitle:
    "Section 1: Client impact metrics (landing page proof points) | Section 2: Product launch tracking (30-day and 3-month, with and without Phase 1 roadmap)",
};

const clientImpactSection = {
  title:
    "SECTION 1 - CLIENT IMPACT METRICS (What to track after go-live - Landing page proof points)",
  description:
    "These 10 metrics measure real-world business impact at client companies. Track from Day 30 with every client. Use the best results as landing page social proof and enterprise RFP evidence.",
  columns: [
    "#",
    "Metric Name",
    "What it measures",
    "Impact range",
    "Feature driving the impact",
    "How the impact is caused",
    "Example landing page claim",
  ],
  rows: [
    {
      id: "1",
      metricName: "Maintenance Collection Cycle Reduction",
      measures:
        "Reduction in average days from invoice generation to full payment receipt per billing cycle",
      impactRange: "30-50% reduction in days to collect",
      feature:
        "Automated Invoice and Receipt Generation + Resident Bill Payment (UPI/Card)",
      cause:
        "Automated invoice delivery with direct UPI payment link removes 3-4 steps (manual invoice, bank account lookup, NEFT transfer, confirmation) from the payment process",
      claim:
        "Communities using Post Possession reduce their maintenance collection cycle by 35% in the first 60 days.",
    },
    {
      id: "2",
      metricName: "Helpdesk Ticket Resolution Time",
      measures:
        "Average hours from ticket creation by resident to ticket closure confirmation",
      impactRange: "35-50% reduction in average resolution time",
      feature:
        "Ticket Creation and Complaint Management + TAT Configuration + Auto-Assignment",
      cause:
        "Auto-assignment routes tickets to the correct service engineer immediately. TAT alerts escalate overdue tickets before they breach SLA. No manual routing or follow-up needed.",
      claim:
        "Facility teams resolve resident complaints 40% faster after moving from WhatsApp to our helpdesk.",
    },
    {
      id: "3",
      metricName: "Gate Processing Time per Visitor",
      measures:
        "Average minutes from visitor arrival at gate to entry completion",
      impactRange:
        "3-5 minutes reduced to under 60 seconds for pre-registered visitors",
      feature: "Visitor Management + Digital Gate Pass + OTP/Push Approval",
      cause:
        "Pre-registered visitors get a digital gate pass the resident creates in advance. Guard scans the pass on arrival. Approval is instant, not a phone call to the resident.",
      claim:
        "Pre-registered visitors enter the community in under 60 seconds. No phone call to the resident, no paper log.",
    },
    {
      id: "4",
      metricName: "Resident App Monthly Active Rate",
      measures:
        "Percentage of registered residents who use the app at least once per month (MAR%)",
      impactRange:
        "60-80% MAR within 90 days of go-live in well-onboarded communities",
      feature:
        "Visitor Management + Resident Bill Payment + Club Facility Booking + Notice Board",
      cause:
        "Visitor approval push notifications create daily app opens. Bill payment reminders create monthly engagement. Facility booking drives weekly usage in active communities.",
      claim:
        "8 out of 10 registered residents actively use the app within 90 days of possession.",
    },
    {
      id: "5",
      metricName: "Tool Consolidation Score",
      measures:
        "Number of previously separate operational tools replaced by Post Possession at the FM team level",
      impactRange: "Average 6-10 tools replaced per property",
      feature:
        "All FM modules: Helpdesk, Gate Management, CAM Billing, Checklist, Asset Management, Audit, Compliance Tracker",
      cause:
        "Single platform covers all FM operational functions previously handled by separate tools: ticketing software, visitor register, billing app, Excel attendance, paper checklists, compliance calendar.",
      claim:
        "One platform replaces an average of 8 disconnected tools at every property we deploy.",
    },
    {
      id: "6",
      metricName: "Referral Lead Capture Rate",
      measures:
        "Number of qualified leads submitted by residents per 1,000 residents per quarter via Referral Marketing module",
      impactRange:
        "3-8 referral leads per 1,000 residents per quarter in active communities",
      feature: "Referral Marketing + New Lead Generation + Marketing Analytics",
      cause:
        "Referral campaign push notifications prompt residents to submit contact details of interested buyers. Each referral is tracked with source attribution. Developer sales team receives structured lead data, not informal WhatsApp messages.",
      claim:
        "Developers using our referral module capture 5 qualified resident referrals per 1,000 units every quarter.",
    },
    {
      id: "7",
      metricName: "Compliance Deadline Miss Rate",
      measures:
        "Percentage of scheduled compliance deadlines (AMC, PPM, statutory inspections) missed per quarter",
      impactRange: "15-30% miss rate reduced to under 3% in first 6 months",
      feature:
        "Compliance Tracker + Digital Checklist + Automated Compliance Alerts",
      cause:
        "Automated alerts sent to FM team, vendors, and AMC partners 30/14/7 days before each compliance deadline. Checklist task auto-assignment ensures responsible owner is assigned before deadline approaches.",
      claim:
        "Our compliance tracker reduces missed FM deadlines from 1 in 5 to fewer than 1 in 30.",
    },
    {
      id: "8",
      metricName: "Defaulter Recovery Rate",
      measures:
        "Percentage of defaulter accounts that clear outstanding dues within 30 days of defaulter status being triggered",
      impactRange:
        "60-70% of defaulters clear dues within 30 days when service restriction is active",
      feature:
        "Defaulter Status and Service Restriction + Payment Reminders + Resident Bill Payment",
      cause:
        "Defaulter flag triggers automated payment reminders. Service restriction on facility booking creates a direct consequence for non-payment. UPI payment link in reminder message removes friction from the payment action.",
      claim:
        "6 out of 10 maintenance defaulters clear their dues within 30 days when our automated reminder and restriction system is activated.",
    },
    {
      id: "9",
      metricName: "Security Traceability Coverage",
      measures:
        "Percentage of gate entry and exit events that have a digital audit record with timestamp, identity, and approver",
      impactRange:
        "100% digital audit coverage from Day 1 of go-live (vs. 0% with paper registers)",
      feature:
        "Visitor Management + Vehicle Entry / Exit Management + Goods In / Out Movement Tracing + Staff Attendance",
      cause:
        "Every visitor, vehicle, and goods movement is logged in the guard app with timestamp and resident approval record. Paper register has no recovery mechanism if a page is lost or damaged.",
      claim:
        "Every entry and exit at your gate is digitally logged with a timestamp and resident approval from Day 1.",
    },
    {
      id: "10",
      metricName: "Post-Ticket Resident CSAT Score Improvement",
      measures:
        "Resident satisfaction score after ticket closure (star rating out of 5) compared to pre-platform baseline",
      impactRange:
        "Average CSAT improvement of 0.8-1.2 stars out of 5 within 90 days",
      feature:
        "Ticket Reopen and Feedback + Notification and Escalation Matrix + CAPA Module",
      cause:
        "Residents receive push notifications at every ticket status change, eliminating the 'no update' frustration. Escalation matrix prevents tickets from going cold. CAPA reduces repeat complaints. All three reduce resident frustration.",
      claim:
        "Resident satisfaction scores for maintenance requests improve by over 30% in the first 90 days after deployment.",
    },
  ],
} as {
  title: string;
  description: string;
  columns: string[];
  rows: ClientImpactMetric[];
};

const launchTrackingSection = {
  title: "SECTION 2 - PRODUCT LAUNCH TRACKING METRICS (North Star + Top 10)",
  northStarTitle: "NORTH STAR METRIC",
  northStarName: {
    label: "North Star Metric Name:",
    value:
      "Monthly Active Residents per Deployed Community (MAR%) - Percentage of all registered residents who open and interact with the app at least once in a 30-day period",
  },
  northStarWhy: {
    label: "Why this is the North Star:",
    value:
      "MAR% is the single number that predicts everything else: resident engagement, platform stickiness, referral lead quality, billing collection efficiency, and contract renewal probability. If MAR% is above 65%, the platform is embedded in resident daily life and churn risk is minimal. If MAR% falls below 40%, no other module performance metric matters - the platform is at risk of abandonment. Target: 65%+ by Day 90 post go-live at every deployed community.",
  },
  columns: [
    "#",
    "Metric",
    "What it measures",
    "Activation definition",
    "30-day target - current",
    "30-day target - Phase 1",
    "3-month target - current",
    "3-month target - Phase 1",
    "Why it matters",
    "Success signal",
    "Phase 1 uplift reason",
  ],
  rows: [
    {
      id: "1",
      metric: "New Community Signups",
      measures:
        "Number of new communities (projects) go-live per month. Counts from first resident login at the community.",
      activationDefinition:
        "First resident OTP login at a new community project",
      current30Day: "2-3 new communities per month",
      phase130Day:
        "3-5 new communities per month (analytics dashboard accelerates enterprise deal close)",
      current3Month: "8-12 communities total",
      phase13Month: "15-20 communities total",
      whyItMatters:
        "Top-line growth metric. Rate of new community go-lives predicts ARR trajectory.",
      successSignal:
        "3+ new go-lives per month sustained for 2 consecutive months",
      phase1UpliftReason:
        "Analytics dashboard removes last deal-blocker for enterprise accounts, increasing close rate.",
    },
    {
      id: "2",
      metric: "Activated Residents per Community",
      measures:
        "Percentage of residents who complete first meaningful action: create first helpdesk ticket, approve first visitor, or complete first bill payment within 7 days of app download",
      activationDefinition:
        "First meaningful action completed within 7 days of OTP login: ticket created, visitor approved, or bill paid",
      current30Day: "45% activated within Day 7 of go-live",
      phase130Day:
        "55% activated within Day 7 (better onboarding with dashboard-driven community manager review)",
      current3Month: "65% activated by Day 30",
      phase13Month: "75% activated by Day 30",
      whyItMatters:
        "Activation predicts long-term MAR%. Low Day-7 activation means the onboarding sequence needs improvement.",
      successSignal:
        "55%+ activation by Day 7 across 3 consecutive communities",
      phase1UpliftReason:
        "Phase 1 dashboard gives community manager real-time activation visibility to intervene on low-activation units.",
    },
    {
      id: "3",
      metric: "Monthly Active Residents (MAR%) - North Star",
      measures:
        "Percentage of registered residents interacting with app monthly",
      activationDefinition:
        "At least 1 app session per month (visitor approval, bill payment, ticket, or booking)",
      current30Day: "50% MAR at Day 30",
      phase130Day:
        "55% MAR at Day 30 (ANPR integration increases gate app opens)",
      current3Month: "65% MAR at Day 90",
      phase13Month: "72% MAR at Day 90",
      whyItMatters:
        "The North Star. Predicts churn, referral quality, and contract renewal probability.",
      successSignal: "65%+ MAR at Day 90 across all live communities",
      phase1UpliftReason:
        "ANPR integration drives gate-related daily opens. AI maintenance alerts create new notification-driven opens.",
    },
    {
      id: "4",
      metric: "Billing Collection Rate",
      measures:
        "Percentage of invoices fully paid within 30 days of generation",
      activationDefinition:
        "Invoice generated + resident payment confirmed within 30 days",
      current30Day: "72% collection within 30 days at launch",
      phase130Day:
        "75% collection (same - billing module unchanged in Phase 1)",
      current3Month: "82% collection by Month 3",
      phase13Month: "85% collection by Month 3",
      whyItMatters:
        "Primary FM team KPI. Developer and RWA clients measure success by collection rate improvement.",
      successSignal:
        "85%+ collection rate within 90 days across all billed communities",
      phase1UpliftReason:
        "No Phase 1 change to billing module. Improvement driven by increased MAR% and resident payment habit formation.",
    },
    {
      id: "5",
      metric: "Helpdesk SLA Compliance Rate",
      measures: "Percentage of tickets resolved within configured SLA window",
      activationDefinition:
        "Ticket closed within defined response + resolution TAT",
      current30Day:
        "70% within SLA at launch (baseline from manual process replacement)",
      phase130Day: "73% within SLA",
      current3Month: "82% within SLA by Month 3",
      phase13Month: "88% within SLA with AI routing (Phase 2)",
      whyItMatters:
        "IFM contract SLA performance metric. Below 80% creates contract renewal risk.",
      successSignal: "85%+ SLA compliance at all IFM-managed communities",
      phase1UpliftReason:
        "Phase 1 does not include AI ticket routing. Phase 2 AI routing improvement estimated at +8-12% SLA compliance.",
    },
    {
      id: "6",
      metric: "Feature Adoption - Visitor Management",
      measures:
        "Percentage of resident profiles with at least 1 visitor pre-registration completed in the first 30 days",
      activationDefinition:
        "At least 1 expected visitor pre-registered by resident in first 30 days",
      current30Day: "55% resident visitor pre-registration by Day 30",
      phase130Day:
        "60% (ANPR integration makes gate experience faster, motivating visitor pre-registration)",
      current3Month: "75% by Month 3",
      phase13Month: "80% by Month 3",
      whyItMatters:
        "Visitor management daily active use is the primary driver of MAR%. If visitor pre-registration is not adopted, MAR% will not reach 65%.",
      successSignal: "75%+ resident visitor pre-registration rate by Day 90",
      phase1UpliftReason:
        "ANPR integration makes the value of pre-registration tangible - faster gate entry - increasing motivation to adopt.",
    },
    {
      id: "7",
      metric: "NPS Proxy - Post-Ticket Resident CSAT",
      measures:
        "Average resident CSAT score (1-5 stars) collected at ticket closure across all active communities",
      activationDefinition: "Any completed CSAT response after ticket closure",
      current30Day: "3.4/5 average CSAT at launch (baseline from first cohort)",
      phase130Day: "3.5/5 (same - no helpdesk change in Phase 1)",
      current3Month:
        "4.0/5 by Month 3 (improvement as teams learn SLA management)",
      phase13Month: "4.1/5 with AI-prioritised escalation (Phase 2)",
      whyItMatters:
        "Resident experience quality indicator. Below 3.5 signals onboarding or FM team training problem.",
      successSignal:
        "4.0+ average CSAT across all communities for 2 consecutive months",
      phase1UpliftReason:
        "Phase 2 AI ticket routing and escalation prediction improve resolution quality, driving CSAT above 4.0.",
    },
    {
      id: "8",
      metric: "Support Ticket Volume (Platform Onboarding Friction)",
      measures:
        "Number of support tickets raised by client admin teams to Lockated support team per community per month",
      activationDefinition:
        "Any support ticket raised to Lockated technical or customer success team",
      current30Day:
        "15-25 tickets per community in Month 1 (high during onboarding)",
      phase130Day:
        "12-18 tickets (analytics dashboard reduces admin confusion about where to view data)",
      current3Month: "Under 8 tickets per community per month by Month 3",
      phase13Month: "Under 6 tickets per month by Month 3 with Phase 1",
      whyItMatters:
        "Measures platform complexity and onboarding quality. High ticket volume signals training or UX improvement needed.",
      successSignal:
        "Under 8 support tickets per community per month sustained from Month 2 onwards",
      phase1UpliftReason:
        "Community health dashboard reduces admin navigation confusion - primary driver of onboarding support tickets.",
    },
    {
      id: "9",
      metric: "Monthly Churn Rate (Community Level)",
      measures:
        "Percentage of deployed communities that do not renew their annual contract",
      activationDefinition: "Contract non-renewal or cancellation request",
      current30Day:
        "Target under 2% monthly churn from Month 4 onwards (0% in first 12 months due to annual contracts)",
      phase130Day:
        "Target under 1.5% monthly churn (analytics dashboard creates executive-level stickiness at developer accounts)",
      current3Month: "Under 2% annualised churn by end of Month 12",
      phase13Month:
        "Under 1.5% annualised churn with Phase 1 (executive dashboard creates board-level buy-in)",
      whyItMatters:
        "Retention metric. Community-level churn above 5% annually signals product-market fit issue or competitive displacement risk.",
      successSignal:
        "Under 2% annualised community churn through first 18 months of operation",
      phase1UpliftReason:
        "Executive dashboard creates a second buyer persona (developer CXO) who is sticky regardless of FM team change.",
    },
    {
      id: "10",
      metric: "Referral Lead Conversion Rate",
      measures:
        "Percentage of resident-submitted referral leads that convert to a sales-qualified lead (SQL) in the developer's pipeline",
      activationDefinition:
        "Referral lead submitted in app + developer sales team confirms contact made within 7 days",
      current30Day:
        "3-5 referrals per 1,000 residents per quarter; 15-20% SQL conversion rate",
      phase130Day:
        "4-6 referrals per 1,000 (loyalty module in Phase 2 will increase referral motivation)",
      current3Month: "5-8 referrals per 1,000 by Month 3; 20% SQL conversion",
      phase13Month:
        "8-12 referrals per 1,000 with loyalty module (Phase 2); 25% SQL conversion",
      whyItMatters:
        "Revenue-generating metric for developer clients. Quantifies the ROI of Post Possession as a sales channel, not just an operations tool.",
      successSignal:
        "Developer sales team books 5+ meetings per quarter from resident referral leads",
      phase1UpliftReason:
        "Phase 2 loyalty engine creates incentive-backed referral campaigns that increase referral submission rate by 40-60%.",
    },
  ],
  note: {
    label: "Note:",
    value:
      "White columns = current product without Phase 1 roadmap | Blue-shaded Phase 1 columns = projections after analytics dashboard, ANPR integration, and AI predictive maintenance delivery | All ranges are realistic targets, not guarantees - actual results depend on community size, resident demographics, and implementation quality.",
  },
} as {
  title: string;
  northStarTitle: string;
  northStarName: LabelValue;
  northStarWhy: LabelValue;
  columns: string[];
  rows: LaunchMetric[];
  note: LabelValue;
};

const summarySection = {
  title: "METRICS SUMMARY - KEY TAKEAWAYS FOR LEADERSHIP REVIEW",
  rows: [
    {
      label: "THE NORTH STAR METRIC:",
      value:
        "Monthly Active Residents per Deployed Community (MAR%) - Target 65%+ by Day 90. This is the only metric that predicts platform health, churn risk, and referral quality simultaneously. Every other metric is downstream of MAR%.",
    },
    {
      label: "THE THREE LEADING INDICATORS OF PLATFORM HEALTH:",
      value:
        "1. Day-7 Activation Rate (target 55%+) - predicts whether the community will reach 65% MAR by Day 90. 2. Billing Collection Rate (target 82%+ by Month 3) - developer and RWA clients' primary commercial metric. 3. Helpdesk SLA Compliance Rate (target 82%+ by Month 3) - IFM client contract renewal metric.",
    },
    {
      label: "THE PHASE 1 INVESTMENT PAYBACK LOGIC:",
      value:
        "Expected return: Phase 1 delivery (community health dashboard, ANPR integration, AI maintenance alerting) unlocks 40-60% of blocked enterprise pipeline. At INR 1,600-2,400 per unit per year and average deal size of 1,000+ units, each unblocked enterprise deal generates INR 16-24 lakh in new ARR. Phase 1 investment payback at 3 unlocked enterprise deals = INR 50-70 lakh new ARR vs. estimated Phase 1 build cost of INR 40-60 lakh. Net positive within 6 months of delivery.",
    },
  ],
} as {
  title: string;
  rows: LabelValue[];
};

const impactGridTemplate =
  "56px minmax(190px, 0.9fr) minmax(220px, 1fr) minmax(180px, 0.8fr) minmax(230px, 1fr) minmax(320px, 1.35fr) minmax(320px, 1.35fr)";
const launchGridTemplate =
  "56px minmax(190px, 0.85fr) minmax(230px, 1fr) minmax(230px, 1fr) minmax(190px, 0.85fr) minmax(230px, 1fr) minmax(190px, 0.85fr) minmax(220px, 1fr) minmax(260px, 1.1fr) minmax(240px, 1fr) minmax(280px, 1.15fr)";

const PostPossessionMetricsTab: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in font-poppins text-[#2C2C2C]">
      <section className="rounded-t-xl border border-[#C4B89D] border-l-4 border-l-[#DA7756] bg-white p-6">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          {metricsMeta.title}
        </h2>
        <p className="mt-2 text-sm italic leading-relaxed text-[#4f4a43]">
          {metricsMeta.subtitle}
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#D3D1C7] bg-white shadow-sm">
        <div className="border-b border-[#D3D1C7] bg-[#DA7756] px-4 py-3 text-white">
          <h3 className="text-sm font-bold uppercase tracking-wide">
            {clientImpactSection.title}
          </h3>
        </div>
        <p className="border-b border-[#D3D1C7] bg-[#FFF7F1] px-4 py-3 text-[12px] font-medium leading-relaxed text-[#1A1A2E]">
          {clientImpactSection.description}
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[1680px] text-[12px] leading-relaxed">
            <div
              className="grid bg-[#A24A2A] text-left text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ gridTemplateColumns: impactGridTemplate }}
            >
              {clientImpactSection.columns.map((column) => (
                <div key={column} className="border border-[#D3D1C7] px-3 py-3">
                  {column}
                </div>
              ))}
            </div>

            {clientImpactSection.rows.map((row, index) => (
              <div
                key={row.id}
                className={
                  "grid " + (index % 2 === 0 ? "bg-[#FFF7F1]" : "bg-white")
                }
                style={{ gridTemplateColumns: impactGridTemplate }}
              >
                <div className="border border-[#D3D1C7] px-3 py-3 text-right font-bold text-[#7A3A20]">
                  {row.id}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#7A3A20]">
                  {row.metricName}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.measures}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 font-semibold text-[#1A1A2E]">
                  {row.impactRange}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.feature}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.cause}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 font-semibold italic text-[#1A1A2E]">
                  {row.claim}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#D3D1C7] bg-white shadow-sm">
        <div className="border-b border-[#D3D1C7] bg-[#DA7756] px-4 py-3 text-white">
          <h3 className="text-sm font-bold uppercase tracking-wide">
            {launchTrackingSection.title}
          </h3>
        </div>

        <div className="border-b border-[#D3D1C7] bg-[#FFF7F1] p-4">
          <h4 className="mb-3 inline-block bg-[#A24A2A] px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-white">
            {launchTrackingSection.northStarTitle}
          </h4>
          <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="border border-[#D3D1C7] bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A3A20]">
              {launchTrackingSection.northStarName.label}
            </div>
            <div className="border border-[#D3D1C7] bg-white px-4 py-3 text-[14px] font-bold leading-relaxed text-[#1A1A2E]">
              {launchTrackingSection.northStarName.value}
            </div>
            <div className="border border-[#D3D1C7] bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A3A20]">
              {launchTrackingSection.northStarWhy.label}
            </div>
            <div className="border border-[#D3D1C7] bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-[#1A1A2E]">
              {launchTrackingSection.northStarWhy.value}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[2300px] text-[12px] leading-relaxed">
            <div
              className="grid bg-[#A24A2A] text-left text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ gridTemplateColumns: launchGridTemplate }}
            >
              {launchTrackingSection.columns.map((column) => (
                <div key={column} className="border border-[#D3D1C7] px-3 py-3">
                  {column}
                </div>
              ))}
            </div>

            {launchTrackingSection.rows.map((row, index) => (
              <div
                key={row.id}
                className={
                  "grid " + (index % 2 === 0 ? "bg-[#FFF7F1]" : "bg-white")
                }
                style={{ gridTemplateColumns: launchGridTemplate }}
              >
                <div className="border border-[#D3D1C7] px-3 py-3 text-right font-bold text-[#7A3A20]">
                  {row.id}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 font-bold text-[#7A3A20]">
                  {row.metric}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.measures}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.activationDefinition}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.current30Day}
                </div>
                <div className="border border-[#D3D1C7] bg-[#FFF1E8] px-3 py-3 font-semibold text-[#7A3A20]">
                  {row.phase130Day}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.current3Month}
                </div>
                <div className="border border-[#D3D1C7] bg-[#FFF1E8] px-3 py-3 font-semibold text-[#7A3A20]">
                  {row.phase13Month}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.whyItMatters}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 font-medium text-[#1A1A2E]">
                  {row.successSignal}
                </div>
                <div className="border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E]">
                  {row.phase1UpliftReason}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid border-t border-[#D3D1C7] bg-white md:grid-cols-[180px_minmax(0,1fr)]">
          <div className="border-r border-[#D3D1C7] bg-[#FFF7F1] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A3A20]">
            {launchTrackingSection.note.label}
          </div>
          <div className="px-4 py-3 text-[12px] font-medium leading-relaxed text-[#1A1A2E]">
            {launchTrackingSection.note.value}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#D3D1C7] bg-white shadow-sm">
        <h3 className="border-b border-[#D3D1C7] bg-[#DA7756] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
          {summarySection.title}
        </h3>
        <div>
          {summarySection.rows.map((row, index) => (
            <div
              key={row.label}
              className={
                "grid border-b border-[#D3D1C7] last:border-b-0 md:grid-cols-[260px_minmax(0,1fr)] " +
                (index % 2 === 0 ? "bg-[#FFF7F1]" : "bg-white")
              }
            >
              <div className="border-r border-[#D3D1C7] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A3A20]">
                {row.label}
              </div>
              <div className="px-4 py-4 text-[13px] font-medium leading-relaxed text-[#1A1A2E]">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostPossessionMetricsTab;
