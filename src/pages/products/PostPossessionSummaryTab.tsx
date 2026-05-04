import React from 'react';

const PostPossessionSummaryTab: React.FC = () => {
  // ── Style objects mapped 1:1 from HTML CSS classes ────────────────────────
  const s0: React.CSSProperties = { borderBottom: '1px solid #C4B89D/50', borderRight: '1px solid #C4B89D/50', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '13pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '6px 12px' };
  const s1: React.CSSProperties = { borderBottom: '1px solid #C4B89D/50', borderRight: '1px solid #C4B89D/50', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '13pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '6px 12px' };
  const s2: React.CSSProperties = { borderBottom: '1px solid #C4B89D/50', borderRight: '1px solid #C4B89D/50', backgroundColor: '#ffffff', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '8px' };
  const s3: React.CSSProperties = { borderBottom: '1px solid #C4B89D/50', borderRight: '1px solid #C4B89D/50', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '8px' };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] mb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          POST POSSESSION — PRODUCT SUMMARY  |  Lockated Product Suite
        </h2>
      </div>
      <table
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', minWidth: '1070px', backgroundColor: 'white' }}
        cellSpacing={0}
        cellPadding={0}
      >
        <colgroup>
          {/* We emulate the 8 columns from HTML, though everything is merged into colspan=8 */}
          <col style={{ width: '195px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '125px' }} />
          <col style={{ width: '125px' }} />
        </colgroup>
        <tbody>

          {/* ── WHAT IT IS ─────────────────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>WHAT IT IS</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Post Possession is a white-labelled, mobile-first Community &amp; Gate Management platform built for real estate developers. It delivers a single post-handover digital layer connecting residents, facility managers, and developers. The product is part of the Lockated B2B SaaS suite. All client data is stored exclusively on the client's own servers — Lockated holds zero resident or community data.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Delivered as white-labelled Android and iOS apps, an Admin Console, and a Guard App, the platform replaces fragmented property-management tools with one integrated interface covering daily living, security, operations, and brand engagement.</td>
          </tr>

          {/* ── WHO IT'S FOR ───────────────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>WHO IT'S FOR</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Primary buyer: Real estate developers (India, GCC, Southeast Asia, UK, US, Europe) who want to maintain a branded relationship with residents after possession.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Primary users: Residents (daily utility), Facility Managers (operations &amp; compliance), Developer CRM / Loyalty teams (engagement, referrals, new launches).</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Secondary: Gated community RWAs, co-living operators, township developers, commercial-to-residential hybrid properties.</td>
          </tr>

          {/* ── PROBLEM IT SOLVES ──────────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>PROBLEM IT SOLVES</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>1. Post-possession engagement gap: Once keys are handed over, most developers lose contact with buyers. No channel for upsell, referral, or loyalty exists.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>2. Operational fragmentation: Facility teams juggle 6–10 disconnected tools (visitor registers, WhatsApp groups, Excel billing, paper checklists) — causing errors, delays, and resident frustration.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>3. Unauthorised vendor &amp; data leakage risk: Residents use unvetted third-party apps, exposing community data and bypassing developer-curated service ecosystems.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>4. Referral leakage: Satisfied residents who would refer are never formally captured or rewarded, losing the developer's highest-ROI lead source.</td>
          </tr>

          {/* ── WHERE IT IS TODAY ──────────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>WHERE IT IS TODAY</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>5+ years in production. Deployed by Godrej Properties, Runwal Enterprises, Piramal Realty, and Panchshil Realty — among India's top real estate developers.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Established leader in the white-labelled community management segment in India. Expanding to GCC, Southeast Asia, UK, US, and Europe.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Proven ROI benchmarks: ~50% reduction in channel-partner (CP) acquisition cost via referral; ~20% reduction in helpdesk support overhead.</td>
          </tr>

          {/* ── FEATURE SUMMARY ────────────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>FEATURE SUMMARY (by module)</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Security &amp; Gate Management: Visitor management (pre-authorised + unexpected), OTP/IVR approval, digital gate pass, goods movement, guard patrolling (QR), vehicle management, ANPR integration, boom-barrier API, computer vision (tailgating, face mask, social distancing).</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Helpdesk &amp; Ticket Management: Multi-mode ticket raising, 5-layer escalation matrix, CAPA reporting, Golden Ticket (senior/differently-abled/pregnant), TAT management, vendor assignment, root cause analysis.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Accounting &amp; Payments: CAM charges, GST/tax config, auto invoices, part/full payment, prepaid meter integration, ERP export, defaulter blocking, offline reconciliation.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Facility &amp; Asset Management: Asset tagging (QR), PPM/AMC digital checklists, soft services scheduling, meter management, inventory (PO/WO/GRN), permit-to-work, cost approval, vendor evaluation.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Community &amp; Communication: Notices, events, polls, gallery, announcements, resident directory, wellness programs, collaboration (chat + video), MoM with auto tasks.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Resident Convenience: Facility booking, F&amp;B ordering, on-premise services marketplace, hyper-local directory, fitout management, digital document repository, parking allocation.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Developer Engagement: White-label app, e-marketing, referral management, new project promotion, lead generation, customer loyalty program, BI reporting.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Advanced / Optional Modules: Space management, transport management, lease management, mailroom, compliance tracker, IoT/IT integration, computer vision surveillance, AQI monitoring.</td>
          </tr>

          {/* ── KEY USPs ───────────────────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>KEY USPs</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>1. White-label sovereignty: App appears as the developer's own brand. Resident data never leaves the developer's servers.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>2. Full customer lifecycle: Pre-possession to post-possession in one platform — CRM, community, loyalty, referral.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>3. Integrated stack: Community management + property management + CAM + visitor management in a single login.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>4. Zero unauthorised vendors: Curated marketplace — no third-party app diversion, no unvetted service providers.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>5. Referral engine: Turns satisfied residents into a formal lead generation channel, cutting CP cost by up to 50%.</td>
          </tr>

          {/* ── TRACTION / MILESTONES ──────────────────────────────────────── */}
          <tr style={{ height: '32px' }}>
            <td style={s1} colSpan={8}>TRACTION / MILESTONES</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Deployed across major Indian developers: Godrej Properties, Runwal Enterprises, Piramal Realty, Panchshil Realty.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>5+ years of live production usage — battle-tested at scale in high-density gated communities.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Proven cost impact: ~50% CP acquisition cost reduction; ~20% support cost reduction.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s2} colSpan={8}>Expanding internationally: GCC, Southeast Asia, UK, US, Europe — pipeline active.</td>
          </tr>
          <tr style={{ minHeight: '55px' }}>
            <td style={s3} colSpan={8}>Recognised as a leader in India's white-labelled community management ecosystem.</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default PostPossessionSummaryTab;

