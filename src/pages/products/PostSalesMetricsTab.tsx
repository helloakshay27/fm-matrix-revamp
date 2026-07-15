import React from 'react';

const PostSalesMetricsTab: React.FC = () => {
  // ── Style objects mapped 1:1 from HTML CSS classes ────────────────────────
  const s0: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '16pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s1: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#F6F4EE', textAlign: 'center', fontStyle: 'italic', color: '#666666', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s2: React.CSSProperties = { borderBottom: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '10pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s3: React.CSSProperties = { backgroundColor: '#ffffff', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '11pt', verticalAlign: 'bottom', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s4: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s5: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s6: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#1b5e20', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s7: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#5c3a1e', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s8: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s9: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s10: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s11: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#e8f5e9', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s12: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff8e1', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s13: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#DA7756', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s14: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s15: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s16: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s17: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#ffffff', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '11pt', verticalAlign: 'bottom', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s18: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '10pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s19: React.CSSProperties = { borderBottom: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', fontStyle: 'italic', color: '#666666', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s20: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s21: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s22: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#1b5e20', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s23: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff9c4', textAlign: 'left', fontWeight: 'bold', color: '#5c3a00', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s24: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff9c4', textAlign: 'left', color: '#5c3a00', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s25: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff3cd', textAlign: 'center', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s26: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff3cd', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s27: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#d4edda', textAlign: 'center', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s28: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#e8f5e9', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s29: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff3cd', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s30: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s31: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fffde7', textAlign: 'center', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s32: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#e8f5e9', textAlign: 'center', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s33: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#eef9f0', textAlign: 'left', color: '#1b5e20', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s34: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff0e0', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s35: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s36: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] text-xl font-bold mb-4">
        Post Sales  ·  Metrics
      </div>

      <table
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', minWidth: '1350px', backgroundColor: 'white' }}
        cellSpacing={0}
        cellPadding={0}
      >
        <colgroup>
          <col style={{ width: '27px' }} />
          <col style={{ width: '195px' }} />
          <col style={{ width: '209px' }} />
          <col style={{ width: '153px' }} />
          <col style={{ width: '195px' }} />
          <col style={{ width: '167px' }} />
          <col style={{ width: '257px' }} />
          <col style={{ width: '181px' }} />
          <col style={{ width: '167px' }} />
        </colgroup>
        <tbody>

          {/* ── Row 2: Subtitle ───────────────────────────────── */}
          <tr style={{ height: '25px' }}>
            <td style={s1} colSpan={9}>Section 1: Impact metrics you create at developer's business (for case studies &amp; landing pages)  |  Section 2: Post Sales launch success metrics</td>
          </tr>

          {/* ════════════════════════════════════════════════════
               SECTION 1 — DEVELOPER IMPACT METRICS
          ═══════════════════════════════════════════════════ */}
          <tr style={{ height: '28px' }}>
            <td style={s2} colSpan={7}>&nbsp; SECTION 1 , DEVELOPER IMPACT METRICS  |  Track these at each client. Use in QBRs, case studies, and landing page claims.</td>
            <td style={s3}></td>
            <td style={s3}></td>
          </tr>

          {/* Column Headers – Section 1 */}
          <tr style={{ height: '36px' }}>
            <td style={s4}>#</td>
            <td style={s4}>Metric Name</td>
            <td style={s5}>What It Measures</td>
            <td style={s6}>Impact Range</td>
            <td style={s7}>Feature Responsible</td>
            <td style={s4}>How Impact Is Created</td>
            <td style={s4}>Landing Page Claim (Template)</td>
            <td style={s3}></td>
            <td style={s3}></td>
          </tr>

          {/* Metric 1 */}
          <tr style={{ height: '85px' }}>
            <td style={s8}>1</td>
            <td style={s9}>Referral Booking Rate</td>
            <td style={s10}>% of new bookings in a launch period that are sourced from existing homebuyer referrals vs. broker or paid channels</td>
            <td style={s11}>Increase from 2–5% baseline → 10–20% referral booking rate</td>
            <td style={s12}>Referral Hub + Loyalty Program + AI Propensity Engine + Gamified Tier System</td>
            <td style={s10}>Buyers with active loyalty tier status and visible reward progress share referral links at 4–6× the rate of passive buyers. AI propensity engine sends referral nudge at the highest-likelihood moment , typically within 7 days of a positive milestone (possession confirmation, construction update, on-time payment reward).</td>
            <td style={s13}>[Developer Name] generated 18% of bookings from existing homebuyer referrals within 6 months of deploying Post Sales , reducing broker dependency by ₹1.8Cr in a single launch.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 2 */}
          <tr style={{ height: '85px' }}>
            <td style={s14}>2</td>
            <td style={s15}>Cost-of-Sales Reduction (Broker Commission Saved)</td>
            <td style={s16}>Rupee value of broker/channel partner commission saved as referral bookings replace broker-sourced sales</td>
            <td style={s11}>₹50L–₹5Cr saved per developer per year (dependent on project size and unit value)</td>
            <td style={s12}>Referral Hub + Loyalty Rewards + AI Referral Engine</td>
            <td style={s16}>Every referral booking replaces a broker-sourced booking that would have cost 2–5% of unit value in commission. At ₹1Cr average unit value with 50 referral bookings per year, the developer saves ₹1–2.5Cr in broker commissions alone , before counting home loan revenue.</td>
            <td style={s13}>[Developer Name] reduced cost of sales from 4.5% to 1.8% of revenue within 9 months , saving ₹2.2Cr in Year 1 broker commissions across 2 active projects.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 3 */}
          <tr style={{ height: '85px' }}>
            <td style={s8}>3</td>
            <td style={s9}>Home Loan Commission Revenue</td>
            <td style={s10}>Total commission earned by developer's home loans team from buyer home loan disbursals facilitated through the platform</td>
            <td style={s11}>₹80L–₹5Cr+ per developer per year (varies by buyer base size and average unit value)</td>
            <td style={s12}>Home Loan Enquiry + Commission Dashboard + Bank Partner Integration</td>
            <td style={s10}>Structured in-app home loan funnel converts untracked informal referrals into a commission-earning, audit-trailed revenue stream. At 1,000 buyers with 60% home loan uptake at ₹8,000–25,000 commission per disbursal, the developer's home loans team earns ₹50L–1.5Cr annually , a net-new P&amp;L line.</td>
            <td style={s13}>[Developer Name]'s home loans team generated ₹1.1Cr in home loan commission revenue in Year 1 through Post Sales , a revenue stream that did not exist before.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 4 */}
          <tr style={{ height: '85px' }}>
            <td style={s14}>4</td>
            <td style={s15}>Buyer NPS (Net Promoter Score)</td>
            <td style={s16}>Net Promoter Score of homebuyers , measures likelihood to recommend developer brand to family and friends</td>
            <td style={s11}>NPS improvement of 15–25 points within 6 months of deployment</td>
            <td style={s12}>Customer Journey Dashboard + Construction Progress + Loyalty Program + Personalization</td>
            <td style={s16}>Buyers who feel recognized, rewarded, and kept informed through the app give significantly higher NPS. High NPS buyers refer 3× more frequently than detractors. Every point of NPS improvement is a measurable referral pipeline multiplier.</td>
            <td style={s13}>[Developer Name] NPS increased from 32 to 54 within 6 months , directly correlating with a 3× increase in unprompted referral submissions.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 5 */}
          <tr style={{ height: '85px' }}>
            <td style={s8}>5</td>
            <td style={s9}>Referral Share Rate (Active Participants)</td>
            <td style={s10}>% of registered homebuyers who actively share a referral link at least once per month</td>
            <td style={s11}>8–18% monthly referral share rate (vs. industry average 2–3% for passive programs)</td>
            <td style={s12}>Gamified Referral Hub + AI Propensity Nudge + Loyalty Points for Referral</td>
            <td style={s10}>Gamification (tier progress, reward countdowns, leaderboard) combined with AI-timed nudges converts passive buyers into active referral participants. The difference between a 3% and 15% share rate on a 1,000-buyer base = 120 additional referral shares per month = 15–30 new qualified leads.</td>
            <td style={s13}>[Developer Name] achieved a 14% monthly referral share rate within 90 days of deploying the gamified referral hub , generating 42 qualified buyer leads in a single month at near-zero cost.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 6 */}
          <tr style={{ height: '85px' }}>
            <td style={s14}>6</td>
            <td style={s15}>Repeat Investment Buyer Rate</td>
            <td style={s16}>% of existing buyers who make a second property purchase with the same developer, driven by loyalty program early access and member benefits</td>
            <td style={s11}>Repeat buyer rate increase from 8–12% → 18–30% among loyalty-engaged buyers</td>
            <td style={s12}>Loyalty Tier Program + Early Project Access + Investor Circle Benefits</td>
            <td style={s16}>Loyalty tier members receive first access to new project launches before broker channels, at early-bird pricing. This creates a financial incentive for investors to repeat-purchase that is exclusive to the platform , unavailable through any broker.</td>
            <td style={s13}>[Developer Name] saw 24% of their loyalty-tier Platinum members purchase in the next project launch, generating ₹15Cr in pre-launch bookings before any broker activation.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 7 */}
          <tr style={{ height: '85px' }}>
            <td style={s8}>7</td>
            <td style={s9}>Developer Sales Team Efficiency</td>
            <td style={s10}>Hours per week spent by developer's sales and CX team on buyer servicing tasks that are now self-served through the app</td>
            <td style={s11}>30–50% reduction in buyer service administrative hours for developer's internal team</td>
            <td style={s12}>Case Management + Journey Dashboard + Document Repository + Notification Automation</td>
            <td style={s10}>Digital self-service for documents, payments, case tracking, and construction updates eliminates the most time-consuming manual tasks for the developer's ops team , freeing them to focus on new sales activities and referral program management.</td>
            <td style={s13}>[Developer Name]'s post-sales team reduced buyer servicing hours by 40%, redirecting 3 full-time equivalents from reactive support to proactive loyalty engagement campaigns.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 8 */}
          <tr style={{ height: '85px' }}>
            <td style={s14}>8</td>
            <td style={s15}>Post-Possession App Retention Rate</td>
            <td style={s16}>% of buyers who remain active on the app 6 months after possession handover</td>
            <td style={s11}>65–80% retention at 6 months post-possession</td>
            <td style={s12}>Services Marketplace + Loyalty Program + Community Layer + Post-Possession Rewards</td>
            <td style={s16}>Marketplace service recommendations (interior, movers, home loan balance transfer, maintenance), loyalty points from services spend, and resident community board keep buyers engaged after possession , extending the developer's relationship and referral surface area indefinitely.</td>
            <td style={s13}>80% of [Developer Name] buyers remained active on Post Sales 6 months after possession , enabling 3 successful 'refer for new launch' campaigns to existing residents generating ₹8Cr in bookings.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 9 */}
          <tr style={{ height: '85px' }}>
            <td style={s8}>9</td>
            <td style={s9}>Referral Lead Quality (Conversion Rate)</td>
            <td style={s10}>% of referral leads submitted by buyers that convert to a confirmed booking, vs. broker-sourced lead conversion</td>
            <td style={s11}>Referral lead conversion 25–40% vs. broker lead conversion 8–15%</td>
            <td style={s12}>Referral Hub + Loyalty-Validated Referrers + AI Referral Quality Score</td>
            <td style={s10}>Referral leads from trust-network (friends and family of satisfied buyers) convert at 2–3× the rate of broker-generated leads. They require fewer site visits, less price negotiation, and shorter decision cycles , reducing developer sales cost per booking even beyond the commission savings.</td>
            <td style={s13}>[Developer Name] found referral leads converted at 32% vs. 11% for broker leads , making each referral lead worth ₹3× the value of a broker lead in closed sales efficiency.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Metric 10 */}
          <tr style={{ height: '85px' }}>
            <td style={s14}>10</td>
            <td style={s15}>Home Loan Team Productivity</td>
            <td style={s16}>Number of home loan applications initiated and disbursed per month through the platform vs. informal/offline methods</td>
            <td style={s11}>3–5× increase in structured home loan applications tracked vs. pre-platform baseline</td>
            <td style={s12}>Home Loan Enquiry + Commission Dashboard + Bank Partner Integration + Notification Automation</td>
            <td style={s16}>In-app home loan funnel with automated application tracking and status updates replaces the developer's informal bank referral process , creating a structured pipeline that the home loans team can manage, track, and be measured on for the first time.</td>
            <td style={s13}>[Developer Name]'s home loans team processed 68 structured loan applications in Month 1 after deploying Post Sales , vs. an estimated 12–15 per month before, with no commission tracking. Monthly commission tracking went from ₹0 to ₹8L in Month 1.</td>
            <td style={s3}></td><td style={s3}></td>
          </tr>

          {/* Spacer row */}
          <tr style={{ height: '12px' }}>
            {[...Array(9)].map((_, i) => <td key={i} style={s17}></td>)}
          </tr>

          {/* ════════════════════════════════════════════════════
               SECTION 2 — LAUNCH SUCCESS METRICS
          ═══════════════════════════════════════════════════ */}
          <tr style={{ height: '28px' }}>
            <td style={s18} colSpan={9}>&nbsp; SECTION 2 , LAUNCH SUCCESS METRICS  |  North Star (referrals) + Top 10 KPIs | 30-Day &amp; 3-Month Targets | With &amp; Without Phase 1 Roadmap</td>
          </tr>
          <tr style={{ height: '25px' }}>
            <td style={s19} colSpan={9}>Columns 1–6: metric with current-state benchmarks. Columns 7–9: revised benchmarks if Phase 1 roadmap (AI referral engine, gamified tiers, home loan dashboard, developer campaign studio) shipped before launch.</td>
          </tr>

          {/* Column Headers – Section 2 */}
          <tr style={{ height: '41px' }}>
            <td style={s20}>Metric</td>
            <td style={s20}>Type</td>
            <td style={s20}>Definition</td>
            <td style={s21}>30-Day<br />(Current)</td>
            <td style={s21}>3-Month<br />(Current)</td>
            <td style={s20}>Success Signal</td>
            <td style={s22}>30-Day<br />(Post Phase 1)</td>
            <td style={s22}>3-Month<br />(Post Phase 1)</td>
            <td style={s22}>Uplift Reason</td>
          </tr>

          {/* North Star */}
          <tr style={{ height: '47px' }}>
            <td style={s23}>⭐ NORTH STAR , Monthly Referral Submissions per Developer Client</td>
            <td style={s23}>Referral</td>
            <td style={s24}>Number of unique referral submissions made by buyers in the app per calendar month per developer account. This is the single number that proves the platform's value.</td>
            <td style={s25}>15–30 referral submissions/month<br />(1 pilot client, 200–500 buyer cohort)</td>
            <td style={s25}>80–200 submissions/month<br />(3 live clients cumulative, referral program gaining momentum)</td>
            <td style={s26}>≥8% of registered buyers submitting ≥1 referral per month = healthy</td>
            <td style={s27}>25–50 submissions/month<br />(AI propensity nudge increases share rate from Month 1)</td>
            <td style={s27}>150–350 submissions/month<br />(gamified tiers + campaign studio accelerate growth)</td>
            <td style={s28}>AI propensity engine + gamified tiers create 2–3× referral velocity vs. passive program</td>
          </tr>

          {/* KPI 1: MRR */}
          <tr style={{ height: '72px' }}>
            <td style={s9}>MRR (Monthly Recurring Revenue)</td>
            <td style={s29}>Commercial</td>
            <td style={s30}>Total contracted ARR / 12 from all live developer clients</td>
            <td style={s31}>₹1.5–3L/month<br />(1 client ×₹18–36L ACV)</td>
            <td style={s25}>₹5–12L/month<br />(3 clients)</td>
            <td style={s30}>MRR growing MoM, 0 churn</td>
            <td style={s32}>₹2–4.5L/month<br />(Phase 1 demo ROI clarity shortens sales cycle by 4 wks)</td>
            <td style={s27}>₹8–18L/month<br />(home loan rev-share contracts accelerate close)</td>
            <td style={s33}>Home loan revenue story closes deals faster → earlier MRR</td>
          </tr>

          {/* KPI 2: Referral Booking Conversion */}
          <tr style={{ height: '72px' }}>
            <td style={s15}>Referral Booking Conversion (Pilot Client)</td>
            <td style={s34}>Referral</td>
            <td style={s35}>Number of Post Sales referral submissions that result in a confirmed booking at developer during the period</td>
            <td style={s31}>2–5 referral bookings from 15–30 submissions (13–15% conversion rate)</td>
            <td style={s25}>10–25 referral bookings cumulative across 3 clients</td>
            <td style={s35}>≥1 referral booking in Month 1 = proof-of-concept milestone</td>
            <td style={s32}>4–8 referral bookings in Month 1 (AI propensity = higher quality referrals)</td>
            <td style={s27}>20–50 referral bookings cumulative</td>
            <td style={s33}>AI propensity engine identifies higher-intent referrers = 2× conversion rate</td>
          </tr>

          {/* KPI 3: Home Loan Applications */}
          <tr style={{ height: '72px' }}>
            <td style={s9}>Home Loan Applications Initiated (through platform)</td>
            <td style={s11}>Revenue</td>
            <td style={s30}>Number of home loan enquiries submitted in-app that enter structured bank pipeline</td>
            <td style={s31}>20–50 applications/month<br />(1 developer, ~500 buyer cohort)</td>
            <td style={s25}>100–300 applications/month<br />(3 developer clients)</td>
            <td style={s30}>≥20 applications in Month 1 = home loan channel live</td>
            <td style={s32}>40–80/month<br />(home loan dashboard makes funnel trackable → team incentivized)</td>
            <td style={s27}>200–500/month</td>
            <td style={s33}>Dashboard creates team accountability → applications volume jumps when home loans team can see their own pipeline</td>
          </tr>

          {/* KPI 4: Loyalty Activation Rate */}
          <tr style={{ height: '72px' }}>
            <td style={s15}>Loyalty Program Activation Rate</td>
            <td style={s36}>Product</td>
            <td style={s35}>% of registered buyers who earn their first loyalty points within 14 days of onboarding</td>
            <td style={s31}>30–45%<br />(passive program, low awareness in first weeks)</td>
            <td style={s25}>45–60%</td>
            <td style={s35}>≥40% = healthy activation in Month 1</td>
            <td style={s32}>55–70%<br />(gamified onboarding prompts immediate point-earning action)</td>
            <td style={s27}>70–82%</td>
            <td style={s33}>Gamified tier entry celebration + first-action bonus points drive immediate activation</td>
          </tr>

          {/* KPI 5: Referral Share Rate */}
          <tr style={{ height: '72px' }}>
            <td style={s9}>Referral Share Rate (Monthly Active)</td>
            <td style={s34}>Referral</td>
            <td style={s30}>% of registered buyers who share a referral link at least once in the month</td>
            <td style={s31}>3–6%<br />(standard referral program, no AI nudge)</td>
            <td style={s25}>5–10%</td>
            <td style={s30}>≥5% = above industry average (2–3%)</td>
            <td style={s32}>7–12%<br />(AI propensity nudge identifies right buyer at right moment)</td>
            <td style={s27}>12–20%</td>
            <td style={s33}>AI propensity + gamified sharing tools are the single biggest referral rate drivers</td>
          </tr>

          {/* KPI 6: Campaign Studio Usage */}
          <tr style={{ height: '72px' }}>
            <td style={s15}>Developer Campaign Studio Usage</td>
            <td style={s36}>Product</td>
            <td style={s35}>Number of campaigns launched by developer's loyalty team per month using self-serve studio</td>
            <td style={s31}>1–2 campaigns/month<br />(developer team learning the tool)</td>
            <td style={s25}>4–6 campaigns/month</td>
            <td style={s35}>≥3 campaigns/month = team adopted the tool</td>
            <td style={s32}>3–4 campaigns/month from Month 1<br />(studio is intuitive from Phase 1 design)</td>
            <td style={s27}>6–10 campaigns/month</td>
            <td style={s33}>Better UX from Phase 1 design investment → faster loyalty team adoption → more referral campaigns</td>
          </tr>

          {/* KPI 7: Buyer App MAU */}
          <tr style={{ height: '72px' }}>
            <td style={s9}>Buyer App MAU / Registered Ratio</td>
            <td style={s36}>Product</td>
            <td style={s30}>Monthly active users ÷ total registered users. Measures sustained engagement beyond onboarding</td>
            <td style={s31}>35–50%<br />(strong early engagement from onboarding novelty)</td>
            <td style={s25}>40–55%</td>
            <td style={s30}>≥40% = sticky product with repeat visit behavior</td>
            <td style={s32}>48–60%<br />(gamification + push notifications create habit loop from Day 1)</td>
            <td style={s27}>55–68%</td>
            <td style={s33}>Loyalty tier progress bars and notification automation create daily return triggers</td>
          </tr>

          {/* KPI 8: Cost-of-Sales Reduction */}
          <tr style={{ height: '72px' }}>
            <td style={s15}>Cost-of-Sales Reduction (per developer)</td>
            <td style={s11}>Revenue</td>
            <td style={s35}>Estimated ₹ value of broker commissions displaced by referral bookings in the period (tracked per client)</td>
            <td style={s31}>₹10–40L cost savings (2–5 referral bookings × broker commission per unit)</td>
            <td style={s25}>₹80L–3Cr cumulative savings across 3 clients</td>
            <td style={s35}>≥1 documented referral booking in Month 1 = cost-of-sales ROI story begun</td>
            <td style={s32}>₹25–80L savings in Month 1 (more referral bookings from AI propensity)</td>
            <td style={s27}>₹1.5–5Cr cumulative</td>
            <td style={s33}>More referral bookings = more measurable savings = stronger renewal/expansion story</td>
          </tr>

          {/* KPI 9: NRR */}
          <tr style={{ height: '72px' }}>
            <td style={s9}>Net Revenue Retention (NRR)</td>
            <td style={s29}>Commercial</td>
            <td style={s30}>Revenue from existing clients in current period vs. prior period including expansions. Not applicable Month 1.</td>
            <td style={s31}>N/A , Month 1</td>
            <td style={s25}>105–115%<br />(buyer volume growth + home loan add-on uptake)</td>
            <td style={s30}>NRR ≥100% at 3 months = no value leakage</td>
            <td style={s32}>N/A</td>
            <td style={s27}>108–120%<br />(Phase 1 features unlock premium tiers and home loan rev-share expansion faster)</td>
            <td style={s33}>Home loan commission activation and premium tier upsell drive expansion revenue by Month 3</td>
          </tr>

          {/* KPI 10: Developer Client Churn */}
          <tr style={{ height: '72px' }}>
            <td style={s15}>Developer Client Churn</td>
            <td style={s29}>Commercial</td>
            <td style={s35}>% of live developer clients who do not renew. In Year 1, measured as 'at-risk signal' , any developer disengagement is a warning sign to address immediately.</td>
            <td style={s31}>0% target , all Year 1 clients must renew. Any churn is fatal to ARR story and investor narrative.</td>
            <td style={s25}>0% at 3 months</td>
            <td style={s35}>0 churned clients at 3 months = healthy</td>
            <td style={s32}>0%</td>
            <td style={s27}>0%</td>
            <td style={s33}>Home loan rev-share and referral ROI dashboard make value measurable , renewal is a numbers conversation, not a relationship conversation</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default PostSalesMetricsTab;
