import React, { useState } from "react";

const postPossessionUseCases = {
  industryLevel: [
    {
      rank: "1",
      industry: "Residential Real Estate Developers",
      relevantFeatures:
        "All modules; CRM team (referral, loyalty), FM team (maintenance, security), Sales (leads)",
      howTheyUseIt:
        "White-label app deployed at every project post-handover; FM uses Admin Console daily; developer CRM tracks referrals and loyalty",
      idealCompanyProfile:
        "India/GCC/SE Asia; mid-large developers; 500–50,000 units; mature IT adoption",
      currentToolUsed: "Fragmented: WhatsApp, Excel, MyGate, Tally, email",
      urgency: "High — Post-possession experience is now a buyer evaluation criterion",
      primaryBuyer:
        "VP-CRM / Head of Customer Experience — measured on NPS, referral conversion, repeat purchase",
      primaryUser:
        "CRM Manager — manually tracking referrals across WhatsApp and Excel; no attribution",
    },
    {
      rank: "2",
      industry: "Township & Integrated Development Operators",
      relevantFeatures:
        "Full platform: F&B, transport mgmt, space mgmt, services marketplace, facility booking, security",
      howTheyUseIt:
        "Single app for all services across a 200–5,000 acre township; replaces 10+ disparate systems",
      idealCompanyProfile:
        "India/GCC; large townships with retail, hospitality, residential; 2,000+ units",
      currentToolUsed:
        "Multiple point solutions; no single integrated platform exists for townships",
      urgency: "High — Scale demands integration; current fragmentation causes resident complaints",
      primaryBuyer:
        "CEO/COO of township management entity — measured on resident satisfaction and cost efficiency",
      primaryUser:
        "Township FM Head — managing complaints from 10 different inboxes simultaneously",
    },
    {
      rank: "3",
      industry: "Gated Community RWAs (Resident Welfare Associations)",
      relevantFeatures:
        "Security, helpdesk, accounting (CAM), communication, facility booking",
      howTheyUseIt:
        "RWA uses platform to replace paper registers, WhatsApp billing, and manual complaint logging",
      idealCompanyProfile:
        "India primary; 100–2,000 units; RWAs with collected CAM > ₹5L/month",
      currentToolUsed: "MyGate (security only), WhatsApp (communication), Tally (accounting)",
      urgency: "High — CAM collection compliance and security are immediate pain points",
      primaryBuyer:
        "RWA Treasurer/Secretary — measured on CAM collection rate and complaint closure",
      primaryUser:
        "RWA Committee Member — spends evenings resolving resident WhatsApp complaints",
    },
    {
      rank: "4",
      industry: "Luxury & Ultra-Luxury Residential Projects",
      relevantFeatures:
        "White-label app, services marketplace, F&B, e-intercom, concierge, loyalty, computer vision",
      howTheyUseIt:
        "Brand experience extension post-possession; residents expect five-star service via app",
      idealCompanyProfile:
        "India (Mumbai, Delhi, Bengaluru), GCC (Dubai, Abu Dhabi); developers of ₹3Cr+ units",
      currentToolUsed:
        "Hospitality-grade PMS (Salesforce, custom apps); no community-specific solution",
      urgency: "High — Luxury brand experience post-handover is now a competitive differentiator",
      primaryBuyer:
        "Chief Experience Officer / Brand Head — measured on resident NPS and brand reviews",
      primaryUser:
        "Resident Relations Manager — manually coordinating concierge requests via phone",
    },
    {
      rank: "5",
      industry: "Co-Living & Managed Residential Operators",
      relevantFeatures:
        "Space management, transport, mailroom, services marketplace, staff management, billing",
      howTheyUseIt:
        "Operator manages bookings, billing, housekeeping, and community across multiple properties",
      idealCompanyProfile:
        "India/SE Asia/UK; 50–5,000 beds per operator; fast-growing segment",
      currentToolUsed: "Custom-built portals, Stayca, NestAway dashboard — none are comprehensive",
      urgency: "Medium — Market growing rapidly; operators seeking scale tools",
      primaryBuyer:
        "Operations Head — measured on occupancy rate and operating cost per bed",
      primaryUser:
        "Property Manager — manually coordinating check-ins, complaints, billing across properties",
    },
    {
      rank: "6",
      industry: "Commercial Real Estate Developers (Workplace/Tech Parks)",
      relevantFeatures:
        "Space management, transport, visitor management, helpdesk, facility booking, AQI, IoT",
      howTheyUseIt:
        "Tenant experience app for office parks; facility management and compliance for FM teams",
      idealCompanyProfile:
        "India (Bengaluru, Pune, Hyderabad), GCC; Grade A office parks; 200,000+ sq ft",
      currentToolUsed:
        "ServiceMax, Archibus, FM systems; no resident-engagement equivalent for CRE",
      urgency: "Medium — CRE developers entering residential are an expansion segment",
      primaryBuyer:
        "Asset Manager / Facility Director — measured on tenant retention and OPEX",
      primaryUser:
        "Facility Manager — logging maintenance requests manually while managing multiple buildings",
    },
    {
      rank: "7",
      industry: "Affordable Housing / Government Schemes (PMAY)",
      relevantFeatures:
        "Security, helpdesk, CAM billing, communication, digital documents",
      howTheyUseIt:
        "Government-issued or developer-built affordable housing needs low-cost digital management",
      idealCompanyProfile:
        "India; 200–5,000 units; PMAY-linked developers; price-sensitive",
      currentToolUsed:
        "Manual registers, WhatsApp, basic apps with no billing integration",
      urgency: "Medium — Government digitisation push; low budget but high volume opportunity",
      primaryBuyer:
        "Project Director / State Housing Board Officer — measured on complaint resolution rate",
      primaryUser:
        "Resident — no channel to raise complaints; no transparency on CAM billing",
    },
    {
      rank: "8",
      industry: "Senior Living & Retirement Communities",
      relevantFeatures:
        "Golden Ticket, health declaration, wellness programs, e-intercom, emergency alerts, visitor management",
      howTheyUseIt:
        "Safety-first feature set for elderly residents; family members monitor via app",
      idealCompanyProfile:
        "India/GCC/UK; 50–500 unit senior living facilities; premium segment",
      currentToolUsed: "Basic nurse-call systems; no integrated digital community platform",
      urgency: "Medium — Growing segment with acute safety and communication needs",
      primaryBuyer:
        "CEO/MD of senior living operator — measured on resident safety incidents and family satisfaction",
      primaryUser:
        "Warden/Facility Manager — manually tracking daily health checks and visitor records",
    },
    {
      rank: "9",
      industry: "Real Estate Developers Entering GCC / SEA Markets",
      relevantFeatures:
        "White-label, visitor management, CAM billing, communication, e-marketing, referral",
      howTheyUseIt:
        "Indian developers expanding to Dubai, Singapore, Malaysia; need localised platform with Arabic/English UI",
      idealCompanyProfile:
        "GCC (UAE, Saudi, Qatar), SE Asia (Singapore, Malaysia); developers with 500–10,000 units",
      currentToolUsed:
        "Building custom apps or using local point solutions; no integrated white-label platform",
      urgency: "Medium — GCC market growing; lack of mature local competitors is an opportunity",
      primaryBuyer:
        "Head of International Business — measured on activation rate and referral pipeline",
      primaryUser:
        "Community Manager — managing multi-nationality residents with language and process barriers",
    },
    {
      rank: "10",
      industry: "Mixed-Use Developers (Retail + Residential)",
      relevantFeatures:
        "F&B, services marketplace, facility booking, convenience/hyper-local, loyalty, e-marketing, BI",
      howTheyUseIt:
        "Single app serves mall/retail ground floor and residential tower; cross-sell opportunities via loyalty",
      idealCompanyProfile:
        "India/GCC; 500+ units with integrated retail; large township or high-street developments",
      currentToolUsed:
        "Separate apps for retail (loyalty) and residential (community); no integration",
      urgency: "Low-Medium — High potential but complex integration; long sales cycle",
      primaryBuyer:
        "Business Head (Mixed-Use) — measured on retail footfall from residential base",
      primaryUser:
        "Marketing Manager — running separate campaigns for retail and residential with no data link",
    },
  ],
  internalTeamsLevel: [
    {
      teamName: "CRM Team (Developer)",
      relevantFeatures:
        "Referral marketing, loyalty program, new project updates, lead generation, marketing analytics, customer profiling",
      dayToDayUsage:
        "Tracks referral submissions daily; sends new launch communications; monitors loyalty point redemptions; exports lead data to sales CRM",
      primaryBenefit:
        "Single channel to engage existing customers post-possession; measures referral ROI and campaign reach",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "Sales Team (Developer)",
      relevantFeatures:
        "Referral lead pipeline, new project banners, lead generation reports",
      dayToDayUsage:
        "Views inbound referral leads; follows up on warm leads generated from existing residents; tracks conversion",
      primaryBenefit:
        "Reduces dependence on channel partners; warmer leads with higher conversion probability",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "Loyalty / Brand Team (Developer)",
      relevantFeatures:
        "Loyalty program, rolling banners, wellness programs, offers/coupons, events, brand content",
      dayToDayUsage:
        "Designs and deploys in-app loyalty campaigns; runs resident engagement programs; tracks participation rates",
      primaryBenefit: "Keeps brand alive post-possession; builds advocacy and NPS",
      frequencyOfUse: "Weekly",
    },
    {
      teamName: "Facility Management Team",
      relevantFeatures:
        "Helpdesk, PPM checklists, asset management, soft services, meter management, compliance tracker, inventory, vendor evaluation, BI reports",
      dayToDayUsage:
        "Assigns and tracks maintenance tickets; runs daily checklists; manages AMC compliance; tracks asset health; approves R&M costs",
      primaryBenefit:
        "Replaces paper-based FM operations with a fully digital, auditable system",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "Security / Guard Team",
      relevantFeatures:
        "Visitor management (all features), vehicle entry/exit, guard patrolling (QR), goods management, panic button",
      dayToDayUsage:
        "Logs visitor entries via app; approves unexpected visitors; patrols checkpoints via QR scan; manages vehicle access",
      primaryBenefit:
        "Eliminates paper visitor logs; real-time alerts reduce security response time",
      frequencyOfUse: "Continuous (24/7)",
    },
    {
      teamName: "Finance / Accounts Team",
      relevantFeatures:
        "CAM billing, payment gateway, invoices, receipts, ERP export, defaulter management, income/expense reports",
      dayToDayUsage:
        "Generates monthly CAM invoices; tracks payments; reconciles offline transactions; exports to ERP (Tally/SAP)",
      primaryBenefit:
        "Eliminates manual billing and follow-up; auto-invoice reduces errors and disputes",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "Admin / Operations Team",
      relevantFeatures:
        "Project setup, user setup, BI reporting, communication, polls, events, document repository",
      dayToDayUsage:
        "Configures the platform per project; manages resident database; sends notices; generates operational reports",
      primaryBenefit:
        "Single dashboard for all operational tasks; reduces admin overhead significantly",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "IT Team (Developer)",
      relevantFeatures:
        "White-label configuration, IoT/API integrations, ANPR, boom barrier integration, access control",
      dayToDayUsage:
        "Deploys and maintains integrations with building systems; configures API endpoints; manages white-label branding",
      primaryBenefit:
        "Single integration point for all building tech systems; reduces bespoke development",
      frequencyOfUse: "Weekly / On-demand",
    },
    {
      teamName: "Resident Relations / Customer Experience Team",
      relevantFeatures:
        "Helpdesk escalation, golden ticket, events, feedback, communication, fitout management",
      dayToDayUsage:
        "Monitors open tickets; escalates critical issues; organises community events; manages fitout requests",
      primaryBenefit:
        "Proactive issue resolution before escalation; improves resident satisfaction scores",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "Legal / Compliance Team",
      relevantFeatures:
        "Permit to work, compliance tracker, vendor evaluation, lease management, fitout deviation notices",
      dayToDayUsage:
        "Tracks all statutory deadlines (fire NOC, lift AMC, etc.); manages permit-to-work approvals; reviews vendor evaluations",
      primaryBenefit:
        "Never misses a compliance deadline; audit-ready documentation always available",
      frequencyOfUse: "Weekly",
    },
    {
      teamName: "Property Management / Site Team",
      relevantFeatures:
        "Project setup, occupancy status, parking allocation, space management, fitout",
      dayToDayUsage:
        "Manages unit occupancy data; handles parking disputes; oversees fitout process",
      primaryBenefit: "Ground-level operations become data-driven rather than ad hoc",
      frequencyOfUse: "Daily",
    },
    {
      teamName: "Procurement Team",
      relevantFeatures:
        "Inventory management (PO/WO/GRN), procurement approval workflow, cost approval",
      dayToDayUsage:
        "Raises and approves purchase orders; tracks stock levels; generates GRN on delivery",
      primaryBenefit: "Formalises procurement; reduces maverick spending and stock-outs",
      frequencyOfUse: "Daily / Weekly",
    },
  ],
};

const PostPossessionUseCasesTab: React.FC = () => {
  const industryTotal = postPossessionUseCases.industryLevel.length;
  const teamsTotal = postPossessionUseCases.internalTeamsLevel.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Industry Level Section */}
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            Part 1 — Industry Level (Residential Real Estate)
          </h2>
        </div>

        <div className="border border-[#D3D1C7] bg-white rounded-b-xl overflow-x-auto shadow-sm">
          <table className="min-w-[1200px] w-full table-fixed border-collapse text-[13px] leading-relaxed font-poppins">
            <thead>
              <tr className="bg-[#bdd7ee] text-[#2C2C2C] border-b border-[#D3D1C7] font-bold uppercase text-[10px] text-center sticky top-0">
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[4%]">Rank</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[12%]">Industry (Ranked)</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[15%]">Relevant Features & Teams Used</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[15%]">How They Will Use It</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[12%]">Ideal Company Profile</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[12%]">Current Tool Used</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[10%]">Urgency</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[10%]">Primary Buyer (Measured On)</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[10%]">Primary User (Daily Frustration)</th>
              </tr>
            </thead>
            <tbody>
              {postPossessionUseCases.industryLevel.map((useCase, i) => {
                const isHighUrgency = useCase.urgency.includes("High");
                const bgClass = isHighUrgency ? "bg-[#fef5f2]" : "bg-white";
                return (
                  <tr key={`industry-${i}`} className={`${bgClass} align-top border-b border-[#D3D1C7]`}>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-center font-bold text-[#1f3864]">
                      {useCase.rank}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal font-semibold">
                      {useCase.industry}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                      {useCase.relevantFeatures}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                      {useCase.howTheyUseIt}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                      {useCase.idealCompanyProfile}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                      {useCase.currentToolUsed}
                    </td>
                    <td className={`border border-[#d9d9d9] px-2 py-2 text-[11px] break-words whitespace-normal font-bold ${isHighUrgency ? "text-[#c5504f]" : "text-[#666]"
                      }`}>
                      {useCase.urgency}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                      {useCase.primaryBuyer}
                    </td>
                    <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                      {useCase.primaryUser}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Teams Section */}
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part 2 — Internal Teams Level
        </div>

        <div className="border border-[#D3D1C7] bg-white rounded-lg overflow-x-auto shadow-sm">
          <table className="min-w-[1200px] w-full table-fixed border-collapse text-[13px] leading-relaxed font-poppins">
            <thead>
              <tr className="bg-[#bdd7ee] text-[#2C2C2C] border-b border-[#D3D1C7] font-bold uppercase text-[10px] text-center sticky top-0">
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[15%]">Team Name</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[18%]">Relevant Features & Processes</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[20%]">How They Use It Day-to-Day</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-left w-[27%]">Primary Benefit to This Team</th>
                <th className="border border-[#d9d9d9] px-2 py-2 text-center w-[12%]">Frequency of Use</th>
              </tr>
            </thead>
            <tbody>
              {postPossessionUseCases.internalTeamsLevel.map((team, i) => (
                <tr key={`team-${i}`} className="bg-white align-top border-b border-[#D3D1C7]">
                  <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal font-semibold text-[11px]">
                    {team.teamName}
                  </td>
                  <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                    {team.relevantFeatures}
                  </td>
                  <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                    {team.dayToDayUsage}
                  </td>
                  <td className="border border-[#d9d9d9] px-2 py-2 text-[#1f1f1f] break-words whitespace-normal text-[11px]">
                    {team.primaryBenefit}
                  </td>
                  <td className="border border-[#d9d9d9] px-2 py-2 text-center text-[#1f1f1f] text-[11px]">
                    {team.frequencyOfUse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend / Disclaimer */}
      <div className="bg-[#f9f9f9] border border-[#D3D1C7] rounded-xl p-3">
        <p className="text-[11px] text-[#666] font-poppins">
          ◆ <strong>Industry Table:</strong> Ranked by commercial relevance. High-urgency use cases highlighted.
          <br />
          ◆ <strong>Teams Table:</strong> Internal organizational roles showing how teams use the platform
          daily across developer organizations.
        </p>
      </div>
    </div>
  );
};

export default PostPossessionUseCasesTab;
