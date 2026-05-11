import React from "react";

type SummaryRow = {
  label: string;
  detail: React.ReactNode;
};

type AudienceRow = {
  role: string;
  useCase: string;
  frustration: string;
  gain: string;
};

const whatItIsRows: SummaryRow[] = [
  {
    label: "Product Name",
    detail: "Post Possession - Community and Gate Management Platform",
  },
  {
    label: "One-Line Description",
    detail:
      "A white-labelled, mobile-first community management platform that keeps real estate developers connected to residents after possession - covering daily living, gate security, operations, billing, and brand engagement in a single integrated stack.",
  },
  {
    label: "Category",
    detail: "B2B SaaS - PropTech / Community Management / Resident Experience Platform",
  },
  {
    label: "Core Mission",
    detail:
      "Eliminate the post-possession engagement gap by giving real estate developers a fully branded, data-sovereign digital layer between the developer, facility managers, and residents - replacing fragmented tools with one integrated platform the developer owns and controls.",
  },
  {
    label: "Geography",
    detail: "India - Primary, Global - Secondary",
  },
];

const problemRows: SummaryRow[] = [
  {
    label: "Core pain point",
    detail:
      "Once keys are handed over, the developer-resident relationship collapses. Residents migrate to third-party apps like MyGate or ApnaComplex, community operations fragment across WhatsApp groups, Excel sheets, paper visitor registers, and disconnected billing tools. The developer loses brand visibility, upsell channels, referral capture, and all operational insight into their own properties. There is no structured post-possession digital layer in 94% of India's residential developments.",
  },
  {
    label: "The data sovereignty gap",
    detail:
      "Mainstream community platforms store all resident data - names, contacts, gate entries, payment histories, complaint records - on their own central servers. Developers deploying these tools transfer custodianship of their resident data to a third party, creating regulatory risk under the DPDP Act 2023 in India, GDPR in Europe, and fiduciary exposure in all markets. Post Possession is the only platform in this category where every byte of resident data is stored exclusively on the client's own servers - never on Lockated infrastructure.",
  },
  {
    label: "The switching cost trap",
    detail:
      "Most developers who have deployed a competing platform cannot exit easily - resident data is locked in the vendor's infrastructure, historical complaint and billing records are inaccessible on migration, and residents resist re-onboarding. Post Possession's self-hosted model removes this trap entirely. The developer holds the data, chooses the hosting environment, and is never dependent on Lockated's uptime or data policies to run their community.",
  },
];

const audienceRows: AudienceRow[] = [
  {
    role: "Real Estate Developer (Primary Buyer)",
    useCase:
      "Maintaining brand presence post-possession, capturing referral leads, upselling new launches, monitoring community satisfaction, running loyalty programs",
    frustration:
      "Zero structured channel to engage buyers post-handover. Satisfied residents are invisible to sales teams. Referral leads are informal and untracked. No data on how residents actually use the community.",
    gain:
      "A branded resident-facing channel that persists for the lifetime of the property. Structured referral capture. Push channels for new launches. Loyalty program integration. Full operational visibility without holding any data themselves.",
  },
  {
    role: "Facility Manager / IFM Company",
    useCase:
      "Managing visitor access, household staff, gate security, helpdesk tickets, club bookings, CAM billing, and compliance documentation from one interface",
    frustration:
      "Juggling 6-10 disconnected tools simultaneously - paper registers, Excel billing, WhatsApp for complaints, separate apps for booking. Every handoff between systems creates errors and delay.",
    gain:
      "One integrated operations console replacing all fragmented tools. Automated billing cycles, digital gate management, real-time visitor approval, complaint tracking with SLA visibility, and staff attendance logs.",
  },
  {
    role: "Resident (Primary Daily User)",
    useCase:
      "Raising complaints, approving visitors, booking club facilities, paying maintenance bills, receiving notices, managing household staff and tenants",
    frustration:
      "No single app for all community needs. WhatsApp groups flood with irrelevant messages. Visitor approval is manual and slow. Payment reminders come via phone calls. No visibility on complaint status.",
    gain:
      "One white-labelled app from their developer that handles all daily community interactions - visitor approvals by push notification, digital bill payments, facility bookings, real-time complaint tracking, and community events.",
  },
];

const todayRows: SummaryRow[] = [
  {
    label: "Product status",
    detail:
      "Live product with deployed client base in India. Android and iOS apps, Admin Console, and Guard App are production-ready. Core modules including visitor management, helpdesk, club bookings, CAM billing, gate management, household staff, and community communications are fully operational.",
  },
  {
    label: "What's missing right now",
    detail:
      "Native analytics dashboard for developer leadership (community health scores, engagement rates, ticket SLA compliance). AI-driven predictive maintenance alerting. IoT/hardware integrations for ANPR, boom barriers, and biometric attendance at standard tier. Marketplace for curated third-party vendors within the resident app. Deeper loyalty program engine beyond current integration hooks.",
  },
  {
    label: "Competitive moat today",
    detail:
      "Data sovereignty architecture with client data hosted exclusively on client servers - the only platform in this category with self-hosted architecture at full feature depth. White-label delivery giving developers a fully branded resident channel. End-to-end coverage from gate management through billing through community engagement. No competing India platform offers all three simultaneously.",
  },
  {
    label: "Key markets",
    detail:
      "India - Tier 1 and Tier 2 cities: Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Delhi NCR, Ahmedabad. Secondary: UAE, UK, Southeast Asia (Singapore, Malaysia) for developer groups with cross-border portfolios.",
  },
  {
    label: "Revenue model",
    detail:
      "B2B SaaS per-unit annual license fee paid by the developer or property management company. INR 800 to INR 2,400 per apartment per year depending on module set and project size. Implementation and onboarding fee on project go-live. Optional revenue share on payment gateway collections.",
  },
  {
    label: "The investor and partner case",
    detail:
      "India has 8,500+ active residential developers and over 4.2 million apartment units delivered in the last five years that lack a structured post-possession digital layer. The DPDP Act 2023 enforcement cycle is creating urgency among larger developers to move away from third-party-hosted platforms. Post Possession is the only self-hosted, white-labelled platform with full-stack community management at production depth - making it the only viable compliance-first alternative to MyGate and ApnaComplex for enterprise developers.",
  },
];

const featureSummary = (
  <div className="space-y-4">
    <p>
      Post Possession is delivered as white-labelled Android and iOS apps, an Admin Console,
      and a Guard App. The platform covers six major operational domains.
    </p>
    <p>
      <strong>Onboarding and Setup:</strong> OTP-based resident login with developer CRM
      verification, guided onboarding screens, project and unit configuration with tower and
      flat type mapping, user access control with role-based permissions, owner and tenant
      profiling with document management, family member addition with credential issuance,
      and primary/secondary user classification.
    </p>
    <p>
      <strong>Community Management and Gate Operations:</strong> Admin-created notices
      distributed to all residents or selected groups with push notification delivery;
      resident-visible events with RSVP and feedback; live polls; full helpdesk ticketing
      with image attachments, SLA tracking, comment threads, golden-ticket flagging for
      senior or differently-abled residents; club facility booking with slot management and
      multiple payment options; concierge-style service request module for salon,
      housekeeping, pest control, and fitout bookings; restaurant and food and beverage
      management; parking allocation management; digital visitor management with
      OTP/IVR/push approval; household staff management with blacklist, entry/exit alerts,
      and attendance tracking; goods movement tracing for move-in and move-out with digital
      audit logs; child safety exit controls; and QR-based guard patrolling.
    </p>
    <p>
      <strong>Accounting and Billing:</strong> Full CAM billing with group, subgroup, and
      ledger creation; automated invoice generation; maintenance bill presentment with PDF
      download; payment gateway supporting UPI, cards, net banking, wallets, and EMI;
      defaulter tracking with service restriction controls.
    </p>
    <p>
      <strong>Operations and Compliance:</strong> Asset management with QR tagging and
      warranty alerts; soft services scheduling; meter management with consumption
      reporting; digital checklists for PPM and AMC; permit-to-work workflows for hazardous
      activities; operational audit management; incident reporting; MOM creation with auto
      task generation; and compliance tracker with automated alerts.
    </p>
    <p>
      <strong>Document Repository:</strong> Community-level and flat-level document storage
      with access control - covering manuals, fitout guides, bills, warranties, and
      unit-specific records.
    </p>
  </div>
);

const PostPossessionSummaryTab: React.FC = () => {
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
    label: {
      backgroundColor: "#F6F4EE",
      borderBottom: "1px solid rgba(196,184,157,0.5)",
      borderRight: "1px solid rgba(196,184,157,0.5)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      padding: "12px 12px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    cell: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.6,
      padding: "12px 12px",
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
      lineHeight: 1.6,
      padding: "12px 12px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
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
    spacer: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid rgba(196,184,157,0.3)",
      padding: "10px 0",
    },
  };

  const renderSectionRows = (rows: SummaryRow[]) =>
    rows.map((row, index) => (
      <tr key={row.label} className="align-top">
        <td style={styles.label}>{row.label}</td>
        <td style={index % 2 === 0 ? styles.altCell : styles.cell} colSpan={4}>
          {row.detail}
        </td>
      </tr>
    ));

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            POST POSSESSION - PRODUCT SUMMARY
          </h2>
          <p className="text-xs opacity-70 italic mt-2 font-medium">
            Briefing document for investors, partners, and senior stakeholders. Estimated
            reading time: 4 minutes.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          style={{
            borderCollapse: "collapse",
            tableLayout: "fixed",
            width: "100%",
            minWidth: "1100px",
            backgroundColor: "white",
          }}
          cellSpacing={0}
          cellPadding={0}
        >
          <colgroup>
            <col style={{ width: "230px" }} />
            <col style={{ width: "270px" }} />
            <col style={{ width: "220px" }} />
            <col style={{ width: "270px" }} />
            <col style={{ width: "270px" }} />
          </colgroup>
          <tbody>
            <tr>
              <td style={styles.section} colSpan={5}>
                What It Is
              </td>
            </tr>
            {renderSectionRows(whatItIsRows)}

            <tr>
              <td style={styles.spacer} colSpan={5} />
            </tr>
            <tr>
              <td style={styles.section} colSpan={5}>
                The Problem It Solves
              </td>
            </tr>
            {renderSectionRows(problemRows)}

            <tr>
              <td style={styles.spacer} colSpan={5} />
            </tr>
            <tr>
              <td style={styles.section} colSpan={5}>
                Who It Is For
              </td>
            </tr>
            <tr>
              <td style={styles.headerCell}>Role</td>
              <td style={styles.headerCell}>What they use it for</td>
              <td style={styles.headerCell}>Their key frustration today</td>
              <td style={styles.headerCell} colSpan={2}>
                What they gain
              </td>
            </tr>
            {audienceRows.map((row, index) => {
              const cellStyle = index % 2 === 0 ? styles.altCell : styles.cell;

              return (
                <tr key={row.role} className="align-top">
                  <td style={{ ...cellStyle, fontWeight: "bold" }}>{row.role}</td>
                  <td style={cellStyle}>{row.useCase}</td>
                  <td style={cellStyle}>{row.frustration}</td>
                  <td style={cellStyle} colSpan={2}>
                    {row.gain}
                  </td>
                </tr>
              );
            })}

            <tr>
              <td style={styles.spacer} colSpan={5} />
            </tr>
            <tr>
              <td style={styles.section} colSpan={5}>
                Feature Summary (What's Built)
              </td>
            </tr>
            <tr>
              <td style={styles.cell} colSpan={5}>
                {featureSummary}
              </td>
            </tr>

            <tr>
              <td style={styles.spacer} colSpan={5} />
            </tr>
            <tr>
              <td style={styles.section} colSpan={5}>
                Where We Are Today
              </td>
            </tr>
            {renderSectionRows(todayRows)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostPossessionSummaryTab;
