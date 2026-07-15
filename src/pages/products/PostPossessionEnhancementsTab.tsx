import React from "react";

type Enhancement = {
  id: number;
  module: string;
  feature: string;
  current: string;
  enhanced: string;
  integrationType: string;
  impactLevel: string;
  outcome: string;
  effort: string;
  impact: string;
  priority: string;
  owner: string;
};

const enhancements: Enhancement[] = [
  {
    id: 1,
    module: "Helpdesk",
    feature: "AI Ticket Routing and Categorisation",
    current:
      "Tickets are manually routed by admin to service engineers or vendors based on category. Admin intervention required for every ticket assignment.",
    enhanced:
      "LLM analyses ticket description, images, and location to auto-classify category, sub-category, and urgency, then routes to the optimal assignee based on current workload, skill set, and availability. No admin touchpoint required for 80%+ of tickets.",
    integrationType: "AI - LLM",
    impactLevel: "High",
    outcome:
      "35-50% reduction in ticket-to-assignment time. 15-20% improvement in first-time resolution rate. Reduces FM admin workload by 2-3 hours per day per property. Key IFM contract SLA improvement story.",
    effort: "High",
    impact: "High",
    priority: "P1",
    owner: "AI Team",
  },
  {
    id: 2,
    module: "Accounting and Billing",
    feature: "AI Collections Propensity Scoring",
    current:
      "All defaulters receive the same automated reminder sequence regardless of their payment likelihood or behavioural history.",
    enhanced:
      "ML model analyses each resident's payment history, app engagement, unit type, and previous default patterns to generate a propensity-to-pay score. High-propensity defaulters receive automated digital reminders. Low-propensity defaulters are flagged for personal follow-up by the finance team.",
    integrationType: "AI - Predictive",
    impactLevel: "High",
    outcome:
      "Collection rate improvement from 72% to 88%+ in 90 days. Reduces finance team time spent on manual follow-up calls by 60%. Quantifiable ROI story for RWA and IFM clients.",
    effort: "High",
    impact: "High",
    priority: "P1",
    owner: "AI Team",
  },
  {
    id: 3,
    module: "Asset Management",
    feature: "AI Predictive Maintenance Engine",
    current:
      "Asset maintenance is scheduled on fixed intervals regardless of actual equipment condition. Emergency repairs occur when fixed-schedule maintenance misses an actual failure event.",
    enhanced:
      "ML model ingests meter consumption data, maintenance history, checklist completion gaps, and manufacturer lifecycle data to predict failure probability for each critical asset. FM team receives alerts 7-14 days before predicted failure with recommended maintenance action.",
    integrationType: "AI - Predictive",
    impactLevel: "High",
    outcome:
      "20-30% reduction in emergency repair costs. 15-25% reduction in annual maintenance capex through optimised scheduling. Strong ROI anchor for IFM company contract renewals.",
    effort: "High",
    impact: "High",
    priority: "P1",
    owner: "AI Team",
  },
  {
    id: 4,
    module: "e-Marketing",
    feature: "Salesforce CRM MCP Integration for Referral Lead Routing",
    current:
      "Referral leads captured in the resident app are stored in the platform database. Developer sales team manually exports leads to their CRM for follow-up.",
    enhanced:
      "MCP server connects Post Possession referral module directly to developer's Salesforce CRM. Each referral lead creates a Salesforce lead record with full attribution data - referring resident, unit, project, and referral campaign ID - in real time.",
    integrationType: "MCP",
    impactLevel: "High",
    outcome:
      "Referral leads reach developer sales team in under 5 minutes of submission vs. 24-48 hours with manual export. Sales team measures referral conversion rate in Salesforce. Post Possession becomes measurable revenue contribution to developer sales pipeline.",
    effort: "Medium",
    impact: "High",
    priority: "P1",
    owner: "BD",
  },
  {
    id: 5,
    module: "Meter Management",
    feature: "AI Anomalous Consumption Detection",
    current:
      "Consumption reports show readings over time. Anomalous readings require manual review by FM team to identify unusual patterns.",
    enhanced:
      "AI model sets dynamic consumption baselines per meter type, location, and season. Deviations beyond 2 standard deviations from baseline trigger an anomaly alert to the FM team with probable cause classification - equipment malfunction, data entry error, or theft - and recommended action.",
    integrationType: "AI - Predictive",
    impactLevel: "High",
    outcome:
      "Prevents 8-15% utility cost overruns caused by undetected equipment malfunction or data entry error. Early detection of water leaks, electrical faults, and DG overconsumption. Sustainability and ESG reporting benefit.",
    effort: "Medium",
    impact: "High",
    priority: "P1",
    owner: "AI Team",
  },
  {
    id: 6,
    module: "Helpdesk",
    feature: "NLP Resident Sentiment Monitoring",
    current:
      "Resident satisfaction is measured only through post-ticket CSAT scores submitted voluntarily by residents. No passive monitoring of overall resident mood.",
    enhanced:
      "NLP model analyses text from resident ticket descriptions, feedback comments, survey responses, and poll submissions to generate a community sentiment score updated weekly. FM team and developer leadership see sentiment trends by tower, issue category, and time period.",
    integrationType: "AI - NLP",
    impactLevel: "Medium",
    outcome:
      "Early detection of escalating community dissatisfaction before it becomes a churn signal. FM teams can address trend patterns proactively. Developer client receives a weekly sentiment pulse without manual analysis.",
    effort: "High",
    impact: "High",
    priority: "P2",
    owner: "AI Team",
  },
  {
    id: 7,
    module: "Community Management",
    feature: "Tally ERP MCP Integration for CAM Billing Export",
    current:
      "CAM billing data is exported manually from the platform in CSV or Excel format for import into Tally or other ERP systems. Manual export is done by finance team on a weekly or monthly cycle.",
    enhanced:
      "MCP server creates a real-time two-way sync between Post Possession CAM billing module and the client's Tally ERP instance. Invoice records, payment receipts, and ledger entries are posted to Tally automatically on each billing event.",
    integrationType: "MCP",
    impactLevel: "High",
    outcome:
      "Eliminates double-entry between platform and Tally. Finance team recovers 4-8 hours per week per property previously spent on manual export and import. IFM companies managing 20+ properties recover 80-160 hours per month.",
    effort: "Medium",
    impact: "High",
    priority: "P1",
    owner: "Engineering",
  },
  {
    id: 8,
    module: "Gate Management",
    feature: "WhatsApp Business API MCP for Visitor Notifications",
    current:
      "Visitor approval notifications are delivered via push notification through the resident app. Residents who have not downloaded the app or have push notifications disabled miss visitor arrival alerts.",
    enhanced:
      "MCP server connects to WhatsApp Business API. Residents who are not app-active receive visitor arrival notifications and approve or reject via WhatsApp message reply. Expands approval reach to 100% of registered residents regardless of app download status.",
    integrationType: "MCP",
    impactLevel: "High",
    outcome:
      "Visitor approval reach increases from app-active residents (60-65% MAR) to 100% of registered residents. Reduces gate wait time for visitors whose residents have not yet downloaded the app. Critical for early go-live phases when MAR% is still building.",
    effort: "Medium",
    impact: "High",
    priority: "P1",
    owner: "Engineering",
  },
  {
    id: 9,
    module: "Document Repository",
    feature: "AI Document Classification and Auto-Tagging",
    current:
      "Admins manually categorise and tag each document uploaded to the digital repository. Tagging accuracy depends on admin attention and consistency.",
    enhanced:
      "LLM analyses uploaded document content, extracts metadata (document type, unit number, date, issuing authority), and automatically assigns category, sub-category, and relevant tags. Documents become instantly searchable by content rather than requiring manual tag lookup.",
    integrationType: "AI - LLM",
    impactLevel: "Medium",
    outcome:
      "FM team and residents find documents 5x faster. Admin time spent on document management reduced by 70%. Supports compliance audits where documents must be retrieved quickly by category or date.",
    effort: "Medium",
    impact: "Medium",
    priority: "P2",
    owner: "AI Team",
  },
  {
    id: 10,
    module: "Community Management",
    feature: "AI Community Newsletter Generation",
    current:
      "Community newsletters and event summaries are written manually by the admin team. The process is time-consuming and inconsistent across different admin users.",
    enhanced:
      "LLM pulls data from recent event attendances, poll results, ticket resolution highlights, new facility bookings, and community announcements to auto-draft a monthly community newsletter. Admin reviews and approves before sending. Tone and content customised to developer brand voice.",
    integrationType: "AI - LLM",
    impactLevel: "Medium",
    outcome:
      "Admin team saves 3-5 hours per newsletter per community per month. Newsletter quality and consistency improves. Resident engagement with community communication increases through more regular, relevant content.",
    effort: "Low",
    impact: "Medium",
    priority: "P2",
    owner: "AI Team",
  },
  {
    id: 11,
    module: "Club Facility Booking",
    feature: "Dynamic Slot Pricing Engine",
    current:
      "Facility booking fees are fixed regardless of demand, time of day, or day of week. Peak slots are overbooked while off-peak slots go unused.",
    enhanced:
      "Pricing algorithm adjusts facility booking fees dynamically based on historical demand patterns, current slot occupancy, and time to booking. Peak slots priced higher; off-peak slots offered at discount. Increases total facility revenue and distributes usage across time.",
    integrationType: "Native",
    impactLevel: "Medium",
    outcome:
      "15-25% increase in total facility revenue. Better facility utilisation reduces maintenance cost per booking. Premium communities can monetise high-demand slots at market rate.",
    effort: "Medium",
    impact: "High",
    priority: "P2",
    owner: "Product",
  },
  {
    id: 12,
    module: "Gate Management",
    feature: "AI-Powered Suspicious Behaviour Detection (CCTV Integration)",
    current:
      "CCTV footage is reviewed manually by security supervisors during incidents. No proactive monitoring of unusual patterns.",
    enhanced:
      "Computer vision model integrated with CCTV feeds flags suspicious behaviour patterns - loitering, tailgating, unattended packages - and sends real-time alerts to security supervisor via the guard app. Alert includes camera ID, timestamp, and event classification.",
    integrationType: "AI - Predictive",
    impactLevel: "High",
    outcome:
      "Proactive security capability that currently requires a full-time CCTV monitoring team. Reduces response time to security events from 10-15 minutes to under 2 minutes. Premium safety story for REIT-grade and township developer clients.",
    effort: "High",
    impact: "High",
    priority: "P3",
    owner: "AI Team",
  },
  {
    id: 13,
    module: "Accounting and Billing",
    feature: "Razorpay and PayU Reconciliation Automation MCP",
    current:
      "Payment gateway settlement reports from Razorpay or PayU are downloaded manually and matched against platform payment records. Reconciliation is a weekly or monthly manual process.",
    enhanced:
      "MCP server pulls settlement data from payment gateway APIs in real time. Each settlement is automatically matched to the corresponding invoice record in the billing module. Unmatched transactions are flagged for finance team review with suggested resolution.",
    integrationType: "MCP",
    impactLevel: "High",
    outcome:
      "Finance team recovers 8-12 hours per month per property on payment reconciliation. Eliminates end-of-month reconciliation backlog. Reduces billing dispute resolution from 3-5 days to same day.",
    effort: "Medium",
    impact: "High",
    priority: "P2",
    owner: "Engineering",
  },
  {
    id: 14,
    module: "Fitout Workflow Management",
    feature: "Cross-Platform Vendor Integration for Fitout Approvals",
    current:
      "Fitout requests are managed within the platform but vendor coordination is handled manually through calls, email, and WhatsApp outside the system.",
    enhanced:
      "Vendor-side approval links allow contractors, interior vendors, and fitout partners to submit documents, safety declarations, payment confirmations, and work status updates without full admin access. The workflow keeps fitout evidence, vendor communication, and approval status inside the resident and FM context.",
    integrationType: "Cross-Platform",
    impactLevel: "Medium",
    outcome:
      "Reduces approval delays for fitout work by 25-40%. Improves resident move-in experience and gives the developer a cleaner post-possession service story.",
    effort: "Medium",
    impact: "Medium",
    priority: "P2",
    owner: "Product",
  },
  {
    id: 15,
    module: "Inventory Management",
    feature: "AI Stock Reorder Forecasting",
    current:
      "Low stock alerts are triggered when item quantities fall below fixed minimum thresholds configured by the admin or store team.",
    enhanced:
      "AI analyses consumption history, seasonality, asset maintenance schedules, and lead times to recommend reorder quantities before stockouts occur. Suggested purchase requests can be generated for admin review.",
    integrationType: "AI - Predictive",
    impactLevel: "Medium",
    outcome:
      "Reduces emergency procurement and prevents downtime caused by unavailable spares. Improves procurement planning for IFM teams managing multiple properties.",
    effort: "Medium",
    impact: "Medium",
    priority: "P2",
    owner: "AI Team",
  },
  {
    id: 16,
    module: "Operational Audit",
    feature: "AI Audit Finding Summarisation",
    current:
      "Audit reports are downloaded with findings and evidence, but management teams manually read long reports to identify recurring issues and priority risks.",
    enhanced:
      "LLM summarises audit findings into executive-ready insights, recurring issue clusters, risk themes, and recommended corrective actions. Summaries are generated after audit approval.",
    integrationType: "AI - LLM",
    impactLevel: "Medium",
    outcome:
      "Cuts management review time and improves follow-up quality. Helps IFM teams convert audit data into action instead of static compliance reports.",
    effort: "Low",
    impact: "Medium",
    priority: "P2",
    owner: "AI Team",
  },
  {
    id: 17,
    module: "Compliance Tracker",
    feature: "Automated Regulatory Calendar",
    current:
      "Compliance reminders are configured manually for each item, vendor, or AMC responsibility.",
    enhanced:
      "A central regulatory calendar template allows admins to activate region-specific compliance schedules for fire safety, lifts, DG sets, STP, waste, and statutory AMC renewals. Templates can be localised by project and state.",
    integrationType: "Native",
    impactLevel: "High",
    outcome:
      "Improves compliance readiness and reduces missed statutory renewals. Strong enterprise value for large developers and IFM companies operating across states.",
    effort: "Medium",
    impact: "High",
    priority: "P1",
    owner: "Product",
  },
  {
    id: 18,
    module: "Gate Management",
    feature: "ANPR and Boom Barrier Standard Pack",
    current:
      "Boom barrier and RFID integrations are supported as project-specific API integrations rather than a standard packaged offering.",
    enhanced:
      "Create a standard ANPR, RFID, and boom barrier integration package with certified hardware partners, installation checklist, testing protocol, and go-live support playbook.",
    integrationType: "Hardware Integration",
    impactLevel: "High",
    outcome:
      "Improves win rate in premium residential and township deals where automated vehicle access is expected. Converts a custom integration into a repeatable sales package.",
    effort: "High",
    impact: "High",
    priority: "P1",
    owner: "Engineering",
  },
  {
    id: 19,
    module: "BI Reporting",
    feature: "Developer Leadership Dashboard",
    current:
      "Function-wise BI reports are available, but leadership needs to open multiple reports to understand portfolio-wide community health.",
    enhanced:
      "A CEO and CXO dashboard aggregates community health, app adoption, ticket SLA, payment collection, referral leads, resident sentiment, and facility usage across all projects in one view.",
    integrationType: "Native",
    impactLevel: "High",
    outcome:
      "Makes the platform directly useful to developer leadership, not only operations teams. Strengthens renewal and enterprise upsell conversations.",
    effort: "Medium",
    impact: "High",
    priority: "P1",
    owner: "Product",
  },
  {
    id: 20,
    module: "Community Management",
    feature: "Resident App Adoption Booster",
    current:
      "Residents receive app access after onboarding, but sustained activation depends on manual communication by the FM or developer team.",
    enhanced:
      "Automated adoption journeys nudge residents to complete profile setup, add vehicles, add family members, enable notifications, and try high-value modules such as visitor approval, bill payment, and facility booking.",
    integrationType: "Native",
    impactLevel: "Medium",
    outcome:
      "Raises monthly active resident adoption and improves ROI visibility for developers. Higher adoption directly improves gate approvals, billing payment rates, and service request digitisation.",
    effort: "Low",
    impact: "Medium",
    priority: "P2",
    owner: "Product",
  },
];

const columns = [
  "#",
  "Module",
  "Feature",
  "How It Currently Works",
  "Enhanced Version",
  "Integration Type",
  "Impact Level",
  "Revenue / Relationship Outcome",
  "Effort",
  "Impact",
  "Priority",
  "Owner",
];

const gridTemplate =
  "56px 160px 230px 300px 500px 150px 110px 380px 90px 90px 95px 130px";

const getTypeTone = (type: string) => {
  const normalized = type.toLowerCase();

  if (normalized.includes("ai")) {
    return "bg-[#FFF4EC] text-[#B45309] border-[#FED7AA]";
  }

  if (normalized.includes("mcp") || normalized.includes("cross-platform")) {
    return "bg-[#ECFDF3] text-[#166534] border-[#BBF7D0]";
  }

  if (normalized.includes("hardware")) {
    return "bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]";
  }

  return "bg-[#F6F4EE] text-[#5E554B] border-[#D3D1C7]";
};

const getPriorityTone = (priority: string) => {
  if (priority === "P1") return "bg-[#DA7756] text-white";
  if (priority === "P2") return "bg-[#F0B36A] text-[#3D2A16]";
  return "bg-[#5E554B] text-white";
};

const PostPossessionEnhancementsTab: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-8 font-poppins">
      <div className="border-l-4 border-l-[#DA7756] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#2C2C2C]">
          Post Possession - Feature Enhancement Roadmap
        </h2>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-[#6B6257]">
          Each row shows: current behaviour - enhanced behaviour with
          integration type - revenue or relationship impact. Minimum 20
          enhancements. At least 5 AI-driven. At least 3 MCP or cross-platform.
          High-impact rows highlighted.
        </p>
      </div>

      <div className="overflow-x-auto border border-[#D3D1C7] bg-white shadow-sm">
        <div className="min-w-[2290px]">
          <div
            className="grid border-b border-[#D3D1C7] bg-[#DA7756] text-[10px] font-bold uppercase tracking-[0.08em] text-white"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((column) => (
              <div
                key={column}
                className="border-r border-white/15 px-3 py-4 last:border-r-0"
              >
                {column}
              </div>
            ))}
          </div>

          <div className="divide-y divide-[#D3D1C7]">
            {enhancements.map((item) => {
              const isHighImpact = item.impactLevel === "High";

              return (
                <div
                  key={item.id}
                  className={`grid text-[12px] leading-5 text-[#2C2C2C] ${
                    isHighImpact ? "bg-[#FFF4EC]" : "bg-white"
                  }`}
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  <div className="border-r border-[#E7E0D4] px-3 py-4 text-right font-bold text-[#DA7756]">
                    {item.id}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 font-semibold">
                    {item.module}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 font-bold text-[#2C2C2C]">
                    {item.feature}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 text-[#6B6257]">
                    {item.current}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 font-medium">
                    {item.enhanced}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4">
                    <span
                      className={`inline-flex border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${getTypeTone(
                        item.integrationType
                      )}`}
                    >
                      {item.integrationType}
                    </span>
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 font-bold">
                    {item.impactLevel}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4">
                    {item.outcome}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 font-semibold">
                    {item.effort}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4 font-semibold">
                    {item.impact}
                  </div>
                  <div className="border-r border-[#E7E0D4] px-3 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-[10px] font-black ${getPriorityTone(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="px-3 py-4 font-semibold text-[#6B6257]">
                    {item.owner}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPossessionEnhancementsTab;
