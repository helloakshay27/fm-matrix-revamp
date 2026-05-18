import React from "react";

type IndustryUseCaseRow = {
  rank: string;
  industry: string;
  relevance: string;
  profile: string;
  urgency: string;
  buyer: string;
  user: string;
};

type TeamUseCaseRow = {
  team: string;
  relevance: string;
  modules: string;
  benefit: string;
  dailyUse: string;
  frequency: string;
};

const industryUseCaseRows: IndustryUseCaseRow[] = [
  {
    "rank": "1",
    "industry": "Residential Real Estate Development",
    "relevance": "White-Label Mobile App gives developers a branded resident channel for the lifetime of the property. Workflow: Developer customises app with their brand > residents download app on possession day > Ticket Creation and Complaint Management module replaces WhatsApp complaints > Referral Marketing module captures referrals from satisfied residents > New Project Updates push-notifies existing residents about new launches. Automated Invoice and Receipt Generation replaces Excel billing cycles. Developer brand is present in every daily resident interaction.",
    "profile": "Developers with 200-5,000+ units delivered per year. Currently using: MyGate for gate management + WhatsApp for complaints + Excel or Tally for billing + emails for communication. Zero integrated post-possession channel.",
    "urgency": "HIGH",
    "buyer": "VP Customer Experience measured on NPS score, referral lead volume, and resident retention/resale velocity",
    "user": "Head of Post Sales managing complaints, fitout queries, and billing disputes manually across multiple channels"
  },
  {
    "rank": "2",
    "industry": "IFM / Property Management Company",
    "relevance": "CAM Billing and Accounting module replaces Excel and standalone accounting software across all managed properties. Workflow: IFM company deploys platform at 10+ properties > Digital Checklist module schedules PPM and AMC tasks > Ticket Creation and Complaint Management tracks helpdesk SLA compliance > Operational Audit module generates auditable compliance records for client reporting > Guard Patrolling and Security Audits provides digital proof of security rounds. One console replaces 6-10 disconnected tools per property.",
    "profile": "IFM companies managing 10-200 residential properties across Tier 1 and Tier 2 India cities. Currently using: separate FM software for ticketing, Excel for billing, WhatsApp for communication, paper attendance registers, physical visitor books.",
    "urgency": "HIGH",
    "buyer": "Operations Director measured on SLA compliance scores, contract renewal rate, and cost per property under management",
    "user": "Facility Manager juggling 6-10 tools per property with no unified view of ticket status, billing, or compliance"
  },
  {
    "rank": "3",
    "industry": "RWA / Apartment Owners Association",
    "relevance": "Resident Bill Payment module enables online CAM collection replacing bank transfer and cash collection cycles. Workflow: RWA committee configures CAM charges > Automated Invoice and Receipt Generation creates invoices on billing cycle > residents pay via UPI or card in-app > Defaulter Status and Service Restriction flags overdue accounts > Visitor Management replaces paper visitor register with digital gate approval. Collection cycle reduces from 30-50 days to under 7 days in most deployments.",
    "profile": "RWAs managing 200-5,000 unit communities, typically formed 1-3 years after possession. Currently using: bank transfer for billing, paper or WhatsApp for visitor management, physical notice board for communication, Excel or no tool for complaints.",
    "urgency": "MEDIUM-HIGH",
    "buyer": "RWA President measured on collection rate, community satisfaction, and security incidents",
    "user": "RWA Secretary managing complaints, billing disputes, and visitor issues manually without any digital tools"
  },
  {
    "rank": "4",
    "industry": "Real Estate PE / REIT / Institutional Investor",
    "relevance": "BI Reporting module provides portfolio-level operational data for investor reporting. Workflow: Asset manager deploys platform across portfolio properties > Meter Management and Reading Logs tracks utility consumption for ESG reporting > Waste Generation Tracking module provides mandatory waste data > Operational Audit module generates compliance documentation > BI Reports export data for LP reporting and board review. Self-hosted architecture meets DPDP Act fiduciary requirements for listed entities.",
    "profile": "PE funds with residential portfolios of INR 500 crore+, REITs with residential assets, institutional investors managing 5-50 properties. Currently using: manual IFM reports for compliance, consultants for ESG data collection.",
    "urgency": "MEDIUM-HIGH",
    "buyer": "Asset Manager measured on NOI per property, ESG score, and regulatory compliance status",
    "user": "Portfolio Operations Head compiling quarterly reports from 10 different IFM teams with no standard data format"
  },
  {
    "rank": "5",
    "industry": "Co-Living and Serviced Residence",
    "relevance": "Tenant Profiling module manages short-tenure residents with agreement validity and expiry alerts. Workflow: Operator creates tenant profile with move-in date and agreement duration > Automated Invoice and Receipt Generation bills weekly or monthly > Convenience Services / Concierge Bookings module enables residents to book housekeeping, laundry, and food services > Club Facility Booking module manages gym, co-working space, and lounge access > Family Member Addition and OTP Login provides instant secure onboarding for new residents. High resident turnover makes digital onboarding and automated billing critical.",
    "profile": "Co-living operators managing 50-5,000 beds across Tier 1 India cities - OYO Life, Stanza Living, WeLive India. Currently using: manual booking systems, Excel billing, WhatsApp for service requests, paper visitor logs.",
    "urgency": "HIGH",
    "buyer": "VP Operations measured on occupancy rate, NPS score, and revenue per bed",
    "user": "Property Manager handling daily check-ins, billing disputes, and maintenance requests without a digital tool"
  },
  {
    "rank": "6",
    "industry": "Senior Living and Retirement Communities",
    "relevance": "Priority and Golden Ticket Identification module flags complaints from elderly residents for priority resolution. Workflow: Admin marks elderly or differently-abled residents as priority users > all their helpdesk tickets are auto-flagged as golden tickets > SLA for golden tickets is half the standard TAT > Emergency Directory provides one-tap access to medical emergency numbers > Panic Button / Security Alert enables immediate security escalation. Community communication and events management supports active engagement programs for senior residents.",
    "profile": "Senior living operators managing 100-1,000 unit communities in Tier 1 India cities - Antara Senior Living, Covai Care, Columbia Pacific. Currently using: manual call-based complaint handling, paper visitor registers, WhatsApp groups for community events.",
    "urgency": "MEDIUM",
    "buyer": "Community Manager measured on resident wellbeing score, incident response time, and family satisfaction",
    "user": "Facility team managing health-sensitive residents without digital complaint prioritisation or emergency alert capability"
  },
  {
    "rank": "7",
    "industry": "Commercial Real Estate / Office Parks",
    "relevance": "Permit to Work module manages contractor and vendor safety compliance for office park operations. Workflow: Contractor submits PTW request via app > Safety Team reviews scope and risk > multi-level authorization workflow approves or rejects > Supervisor and Worker Assignment records all personnel on site for the hazardous activity > Operational Audit module tracks compliance across multiple buildings. Asset Management module tracks MEP and building equipment with warranty alerts and maintenance scheduling.",
    "profile": "Office park operators and commercial building management companies managing 500,000 sq ft+ of commercial space. Currently using: email-based PTW, paper checklists, separate FM software for maintenance tracking.",
    "urgency": "MEDIUM",
    "buyer": "Building Manager measured on statutory compliance scores, tenant satisfaction, and building operating cost",
    "user": "Facilities Engineer managing contractor compliance and equipment maintenance without a digital safety management system"
  },
  {
    "rank": "8",
    "industry": "Hospitality / Branded Residences",
    "relevance": "White-Label Mobile App gives hotel brands a named resident app matching their hospitality brand identity. Workflow: Branded residence deploys white-label app with hotel brand > Food and Beverage Restaurant Management module enables room service and restaurant booking from the app > Convenience Services / Concierge Bookings module provides luxury concierge services > Club Facility Booking enables spa, gym, and private lounge reservations > Goods In / Out Movement Tracing manages valet, luggage, and delivery services. Data Sovereignty architecture keeps guest data on hotel servers, not a third-party community platform.",
    "profile": "Branded residence operators and hotel-affiliated residential developments - Marriott Residences, Oberoi Residences, ITC One. Currently using: hotel PMS systems not designed for residential community management, separate apps for different services.",
    "urgency": "MEDIUM",
    "buyer": "General Manager measured on resident satisfaction score, amenity utilisation rate, and retention of long-term residents",
    "user": "Concierge team coordinating service requests across multiple channels with no unified digital interface"
  },
  {
    "rank": "9",
    "industry": "Township and Smart City Development",
    "relevance": "Project and Unit Configuration module manages complex multi-phase township structures with multiple towers, zones, and unit types. Workflow: Developer configures township hierarchy across 10-20 towers and 5,000+ units > Visitor Management handles township-level gate security across multiple entry points > Meter Management tracks utility consumption across DG, electricity, and water meters > Compliance Tracker monitors all township-level statutory compliance obligations > BI Reporting provides portfolio-wide operational data for township management. IoT Integration capability connects with BMS, SCADA, and smart building infrastructure.",
    "profile": "Township developers managing 2,000+ unit projects across 50+ acres - Godrej Properties township projects, DLF Cyber City residential, Prestige Smart City. Currently using: multiple disconnected tools per zone or tower with no central management layer.",
    "urgency": "HIGH",
    "buyer": "Project Director measured on operational efficiency score, resident NPS, and township management cost per unit",
    "user": "Township Operations Manager coordinating across 5-10 IFM vendors without a central operational dashboard"
  },
  {
    "rank": "10",
    "industry": "Student Housing and Campus Accommodation",
    "relevance": "OTP Login with CRM verification enables student onboarding linked to university registration data. Workflow: University administrator bulk-uploads student unit allocations > Students receive OTP login credentials > Mailroom Management module handles parcel and courier deliveries > Digital Checklist module schedules hostel room inspections > Community Communication Notice Board distributes academic calendar notices and campus events > Visitor Management controls campus access with student-resident approval workflows. Household Staff Management manages housekeeping and maintenance staff access to student blocks.",
    "profile": "University accommodation operators and private student housing companies - Stanza Living, My Gate (student housing vertical), Manipal University Accommodation. Currently using: manual room allocation systems, paper visitor registers, email-based communication, cash for maintenance fees.",
    "urgency": "MEDIUM",
    "buyer": "Accommodation Manager measured on occupancy rate, complaint resolution time, and room inspection compliance",
    "user": "Hostel Warden managing student complaints, parcel deliveries, and visitor management manually without any digital tools"
  }
];

const teamUseCaseRows: TeamUseCaseRow[] = [
  {
    "team": "Facility Management Team",
    "relevance": "The FM team is the primary operational user of the platform. They create and manage helpdesk tickets, assign service engineers, monitor SLA compliance, schedule PPM and AMC checklists, manage soft services scheduling, conduct operational audits, and review BI reports for operational performance.",
    "modules": "Ticket Creation and Complaint Management, Digital Checklist, Soft Services Scheduling, Operational Audit, Asset Management, Guard Patrolling, Compliance Tracker",
    "benefit": "Single console replacing 6-10 disconnected tools. Real-time visibility of ticket status, SLA breach alerts, and compliance deadlines without manual coordination.",
    "dailyUse": "Opens console daily to review ticket queue, assign escalated tickets, check checklist completion rates, review compliance alerts, and generate weekly operational reports for client.",
    "frequency": "Daily"
  },
  {
    "team": "Finance and Billing Team",
    "relevance": "Finance team configures CAM charges, reviews invoice generation, tracks payment receipts, reconciles transactions, manages defaulter lists, and exports data to ERP systems.",
    "modules": "CAM Billing and Accounting, Automated Invoice and Receipt Generation, Resident Bill Payment, Transaction and Reconciliation Management, Payment and Financial Reports, ERP Export, Defaulter Status and Service Restriction",
    "benefit": "Collection cycle reduces from 30-45 days to under 7 days. Automated invoice generation eliminates manual billing. ERP export eliminates double-entry.",
    "dailyUse": "Monitors daily payment receipts, reviews outstanding invoices, processes offline payment entries, updates defaulter list, and downloads monthly financial reports for management review.",
    "frequency": "Daily"
  },
  {
    "team": "Security and Gate Management Team",
    "relevance": "Security team manages all gate entry and exit operations, household staff onboarding and attendance, vehicle movement logging, guard patrolling, and security incident reporting.",
    "modules": "Visitor Management, Household Staff Management, Staff Attendance and Access Management, Vehicle Entry / Exit Management, Guard Patrolling and Security Audits, Goods In / Out Movement Tracing, Child Safety and Exit Control",
    "benefit": "Complete digital gate management replacing paper visitor register and manual attendance tracking. Digital audit trail for all gate events supports security incident investigation.",
    "dailyUse": "Gate staff use guard app continuously for visitor approvals, household staff check-ins, vehicle logging, and goods movement. Security supervisors review patrolling completion and incident reports at shift end.",
    "frequency": "Continuous"
  },
  {
    "team": "Community Management and Administration Team",
    "relevance": "Admin team manages community communication, notices, events, polls, and serves as the primary console user for resident-facing operations and configuration.",
    "modules": "Communication Notice Board, Events Management, Polls, Feedback and Survey-Linked Action, News / Announcements / Broadcasts, Rolling Banners, Marketing Analytics, Referral Marketing",
    "benefit": "Structured communication channels replace WhatsApp groups. Read-receipt tracking confirms critical notices reached residents. Referral capture converts resident satisfaction into lead generation for developer sales team.",
    "dailyUse": "Creates weekly notices, publishes event announcements, sends billing reminders, reviews feedback scores, monitors referral lead pipeline, and responds to resident communication inquiries.",
    "frequency": "Daily"
  },
  {
    "team": "Developer Marketing and Sales Team",
    "relevance": "Marketing team uses resident engagement data, referral leads, and loyalty analytics to plan new project outreach campaigns to existing resident base.",
    "modules": "Marketing Analytics, Referral Marketing, New Project Updates, New Lead Generation, Customer Loyalty, Personalised Greetings",
    "benefit": "Resident app becomes a direct marketing channel for new project launches. Referral leads from satisfied residents have higher conversion rates than cold outreach. Loyalty program increases resident tenure and repeat purchase intent.",
    "dailyUse": "Reviews referral lead pipeline weekly, sends new project update notifications to eligible residents, monitors campaign performance in marketing analytics, and coordinates loyalty offer configuration with admin team.",
    "frequency": "Weekly"
  },
  {
    "team": "Procurement and Store Team",
    "relevance": "Procurement team manages inventory requests, purchase order tracking, goods receipt notes, and stock level monitoring for maintenance consumables and spare parts.",
    "modules": "PO / WO Tracking, Spares and Consumables Tracking, Inventory Consumption Tracking and Reports, GRN / GDN Tracking, Insufficient Stock Alerts, Procurement Approval Process",
    "benefit": "Digital inventory management replaces Excel-based store tracking. Insufficient stock alerts prevent maintenance delays. GRN tracking eliminates disputes between store team and vendors about quantities received.",
    "dailyUse": "Processes daily inventory issue requests from FM team, creates GRNs on material receipt, reviews stock levels for low-quantity alerts, processes procurement approval requests, and downloads monthly consumption reports.",
    "frequency": "Daily"
  },
  {
    "team": "Safety and Compliance Team",
    "relevance": "Safety team manages permit-to-work workflows for hazardous activities, conducts operational audits, tracks compliance deadlines, and manages incident reporting.",
    "modules": "Permit to Work, Operational Audit, Compliance Tracker, Incident Reporting, CAPA and Root Cause Analysis",
    "benefit": "Digital PTW eliminates paper-based permit tracking and creates an auditable safety record. Automated compliance alerts prevent missed deadline fines. Incident reports with photo evidence improve insurance claim outcomes.",
    "dailyUse": "Reviews and approves PTW requests daily, schedules audit assignments, monitors compliance deadline alerts, and reviews CAPA status on open incidents.",
    "frequency": "Daily"
  },
  {
    "team": "Resident Services and Concierge Team",
    "relevance": "Concierge team manages service booking fulfillment, restaurant operations, mailroom management, and provides residents with a structured service request experience.",
    "modules": "Convenience Services / Concierge Bookings, Food and Beverage Restaurant Management, Mailroom Inward and Outward Management, Service Slot Scheduling, Service Feedback, Hyperlocal and Important Directory",
    "benefit": "Structured booking system replaces WhatsApp service requests. Digital mailroom tracking eliminates parcel loss disputes. Service feedback enables continuous service quality improvement.",
    "dailyUse": "Manages daily service booking queue, confirms restaurant reservations, processes incoming parcel notifications, assigns service providers to bookings, and reviews feedback scores at end of day.",
    "frequency": "Daily"
  }
];

const PostPossessionUseCasesTab: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    section: {
      backgroundColor: "#DA7756",
      color: "#ffffff",
      fontFamily: "inherit",
      fontSize: "11pt",
      fontWeight: "bold",
      letterSpacing: "0.05em",
      padding: "12px 12px",
      textAlign: "left",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    headerCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "2px solid #C4B89D",
      borderRight: "1px solid rgba(196,184,157,0.5)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      letterSpacing: "0.05em",
      padding: "12px 8px",
      textAlign: "left",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    cell: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    altCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    numberCell: {
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#DA7756",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "right",
      verticalAlign: "top",
      whiteSpace: "normal",
    },
  };

  const getCellStyle = (index: number) => (index % 2 === 0 ? styles.altCell : styles.cell);
  const urgencyStyle = (urgency: string, index: number) => ({
    ...getCellStyle(index),
    color: urgency.includes("HIGH") ? "#9b1c1c" : "#1f1f1f",
    fontWeight: "bold",
  });

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            POST POSSESSION - USE CASES
          </h2>
          <p className="text-xs opacity-70 italic mt-2 font-medium">
            Part 1: Industry-level use cases (10 industries from Market Analysis, same order) | Part 2: Internal team-level use cases
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="overflow-x-auto">
          <table
            style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1650px", backgroundColor: "white" }}
            cellSpacing={0}
            cellPadding={0}
          >
            <colgroup>
              <col style={{ width: "60px" }} />
              <col style={{ width: "240px" }} />
              <col style={{ width: "440px" }} />
              <col style={{ width: "330px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "230px" }} />
              <col style={{ width: "230px" }} />
            </colgroup>
            <tbody>
              <tr>
                <td style={styles.section} colSpan={7}>Part 1 - Industry-Level Use Cases (Ranked by relevance)</td>
              </tr>
              <tr>
                {["#", "Industry", "How it is relevant (specific features and workflows)", "Ideal Company Profile and current tool", "Urgency", "Primary Buyer (what they are measured on)", "Primary User (daily frustration)"].map((header) => (
                  <td key={header} style={styles.headerCell}>{header}</td>
                ))}
              </tr>
              {industryUseCaseRows.map((row, index) => {
                const cellStyle = getCellStyle(index);
                const numberStyle = { ...styles.numberCell, backgroundColor: index % 2 === 0 ? "#F6F4EE" : "#ffffff" };

                return (
                  <tr key={row.rank} className="align-top">
                    <td style={numberStyle}>{row.rank}</td>
                    <td style={{ ...cellStyle, fontWeight: "bold", color: "#DA7756" }}>{row.industry}</td>
                    <td style={cellStyle}>{row.relevance}</td>
                    <td style={cellStyle}>{row.profile}</td>
                    <td style={urgencyStyle(row.urgency, index)}>{row.urgency}</td>
                    <td style={cellStyle}>{row.buyer}</td>
                    <td style={cellStyle}>{row.user}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="overflow-x-auto">
          <table
            style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth: "1450px", backgroundColor: "white" }}
            cellSpacing={0}
            cellPadding={0}
          >
            <colgroup>
              <col style={{ width: "240px" }} />
              <col style={{ width: "320px" }} />
              <col style={{ width: "320px" }} />
              <col style={{ width: "270px" }} />
              <col style={{ width: "270px" }} />
              <col style={{ width: "130px" }} />
            </colgroup>
            <tbody>
              <tr>
                <td style={styles.section} colSpan={6}>Part 2 - Internal Team-Level Use Cases</td>
              </tr>
              <tr>
                {["Team", "How it is relevant (features and processes)", "Specific modules used", "Key benefit for this team", "How they use it day-to-day", "Frequency of use"].map((header) => (
                  <td key={header} style={styles.headerCell}>{header}</td>
                ))}
              </tr>
              {teamUseCaseRows.map((row, index) => {
                const cellStyle = getCellStyle(index);

                return (
                  <tr key={row.team} className="align-top">
                    <td style={{ ...cellStyle, fontWeight: "bold", color: "#DA7756" }}>{row.team}</td>
                    <td style={cellStyle}>{row.relevance}</td>
                    <td style={cellStyle}>{row.modules}</td>
                    <td style={cellStyle}>{row.benefit}</td>
                    <td style={cellStyle}>{row.dailyUse}</td>
                    <td style={{ ...cellStyle, fontWeight: "bold" }}>{row.frequency}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default PostPossessionUseCasesTab;
