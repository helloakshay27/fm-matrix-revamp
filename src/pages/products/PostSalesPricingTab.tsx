import React from 'react';

const PostSalesPricingTab: React.FC = () => {
  // --- Shared style objects extracted from the HTML CSS classes ---
  const s0: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '16pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s1: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#F6F4EE', textAlign: 'center', fontStyle: 'italic', color: '#666666', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s2: React.CSSProperties = { borderBottom: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '10pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s3: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s4: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s5: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s6: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s7: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s8: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff8f0', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s9: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#f0fff4', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s10: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s11: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s12: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s13: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s14: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s15: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fddede', textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s16: React.CSSProperties = { borderBottom: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '11pt', verticalAlign: 'bottom', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s17: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s18: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#d4edda', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s19: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fff3cd', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s20: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fddede', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s21: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '11pt', verticalAlign: 'bottom', whiteSpace: 'nowrap', padding: '0px 3px' };
  const s22: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', fontWeight: 'bold', color: '#DA7756', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s23: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s24: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'left', color: '#000000', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s25: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#fffde7', textAlign: 'left', fontStyle: 'italic', color: '#5c3a00', fontFamily: 'Arial, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s26: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#ffffff', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'middle', wordWrap: 'break-word', padding: '0px 3px' };
  const s27: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s28: React.CSSProperties = { borderBottom: '1px solid #cccccc', borderRight: '1px solid #cccccc', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] text-xl font-bold mb-4">
        Post Sales  ·  Features &amp; Pricing
      </div>

      <table
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', minWidth: '1000px', backgroundColor: 'white' }}
        cellSpacing={0}
        cellPadding={0}
      >
        <colgroup>
          <col style={{ width: '209px' }} />
          <col style={{ width: '20px' }} />
          <col style={{ width: '244px' }} />
          <col style={{ width: '20px' }} />
          <col style={{ width: '363px' }} />
          <col style={{ width: '83px' }} />
          <col style={{ width: '231px' }} />
          <col style={{ width: '20px' }} />
        </colgroup>
        <tbody>
          {/* Row 2 – Subtitle */}
          <tr style={{ height: '23px' }}>
            <td style={s1} colSpan={8}>Section 1: Feature comparison vs market  |  Section 2: Pricing landscape  |  Section 3: Positioning  |  Section 4: Value propositions</td>
          </tr>
          {/* Row 3 – Section 1 header */}
          <tr style={{ height: '28px' }}>
            <td style={s2} colSpan={8}>&nbsp; SECTION 1 , CURRENT FEATURES VS MARKET STANDARD&nbsp; (Referral + Loyalty + Home Loan lens first)</td>
          </tr>
          {/* Row 4 – Column headers */}
          <tr style={{ height: '36px' }}>
            <td style={s3} colSpan={2}>Feature Area</td>
            <td style={s4}>Market Standard<br />What competitors offer today</td>
            <td style={s4}></td>
            <td style={s5}>Post Sales<br />What we offer</td>
            <td style={s3}>Status</td>
            <td style={s3} colSpan={2}>Why it matters to developer's revenue / relationship strategy</td>
          </tr>
          {/* Rows 5–19 – Feature comparison */}
          <tr style={{ height: '73px' }}>
            <td style={s6}>&nbsp; Referral Program<br />(Core USP #1)</td>
            <td style={s7}></td>
            <td style={s8}>Manual referral form on website. WhatsApp-based referral tracking. No gamification. No reward automation. Average referral share rate: 2–3%.</td>
            <td style={s8}></td>
            <td style={s9}>Gamified referral hub with tier-based rewards, AI propensity scoring, shareable social cards, auto-disbursement. Average referral share rate target: 8–15%.</td>
            <td style={s10}>&nbsp;AHEAD</td>
            <td style={s11} colSpan={2}>This is the primary ROI driver. Every 1% increase in referral share rate on a 1,000-buyer base = 10 additional qualified leads at near-zero cost. Reloy claims 80% cost-of-sales reduction , our AI propensity layer is the sharper answer.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>&nbsp; Loyalty Tier Program<br />(Core USP #2)</td>
            <td style={s13}></td>
            <td style={s8}>Basic points system or discount vouchers. No tier gamification. No progressive engagement mechanics. Some developers have no loyalty program at all.</td>
            <td style={s8}></td>
            <td style={s9}>Gamified tier progression (Silver/Gold/Platinum or branded equivalent), animated upgrade celebrations, milestone-triggered point multipliers, AI-powered personalized reward recommendations.</td>
            <td style={s10}>&nbsp;AHEAD</td>
            <td style={s14} colSpan={2}>Tier-engaged buyers refer 3× more than non-engaged buyers. Loyalty tiers create status psychology , buyers don't just earn points, they want to maintain their tier. This is the engagement engine that feeds the referral flywheel.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>&nbsp; Home Loan Commission Module<br />(Core USP #3)</td>
            <td style={s7}></td>
            <td style={s8}>No platform offers a structured in-app home loan commission tracking workflow for developers. Informal referrals to bank DSAs with no revenue share tracking.</td>
            <td style={s8}></td>
            <td style={s9}>In-app home loan enquiry funnel + bank partner matching + application status tracking + commission dashboard for developer's Home Loans team + monthly automated reconciliation.</td>
            <td style={s10}>&nbsp;AHEAD<br />Unique</td>
            <td style={s11} colSpan={2}>Net-new P&amp;L line for the developer. ₹80L–₹3Cr/year in commission revenue from existing buyer base. This feature alone justifies the platform cost in the CFO conversation. No competitor offers this.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>&nbsp; Developer Campaign Studio<br />(Core USP #4)</td>
            <td style={s13}></td>
            <td style={s8}>Developers depend on the vendor to run every loyalty and referral campaign. No self-serve tool. Campaign velocity is 1–2 per month at best.</td>
            <td style={s8}></td>
            <td style={s9}>Self-serve campaign management: buyer segmentation, referral bonus campaigns, tier-upgrade communications, event activations, A/B testing, real-time performance dashboard.</td>
            <td style={s10}>&nbsp;AHEAD<br />Unique</td>
            <td style={s14} colSpan={2}>Team adoption drives platform stickiness and renewal certainty. Loyalty teams who own their campaigns don't let the platform get cancelled. Self-serve also means campaign velocity goes from 1–2/month to 6–10/month , directly increasing referral output.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>&nbsp; AI Referral Propensity Engine<br />(Competitive Moat)</td>
            <td style={s7}></td>
            <td style={s8}>No competitor uses ML to predict which buyer is most likely to refer and when. Referral activation is uniform , same message to all buyers.</td>
            <td style={s8}></td>
            <td style={s9}>ML model scores every buyer on referral likelihood based on engagement signals, milestone completion, payment behavior, and lifecycle stage. Auto-nudges the right buyer at the peak readiness moment.</td>
            <td style={s10}>&nbsp;AHEAD<br />Roadmap</td>
            <td style={s11} colSpan={2}>Industry average referral rate: 2–3%. With propensity scoring, target rate: 8–15%. The difference on a 1,000-buyer base = 50–120 additional referral submissions per month. This is the gap that makes our referral engine measurably better than passive programs.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>Developer Analytics Dashboard</td>
            <td style={s13}></td>
            <td style={s8}>Vendor-provided manual reports. No self-serve dashboard. Referral pipeline and home loan conversion not visible in real time.</td>
            <td style={s8}></td>
            <td style={s9}>Real-time self-serve analytics: referral pipeline, loyalty tier distribution, home loan funnel conversion, NPS trend, payment adherence. AI-generated weekly digest.</td>
            <td style={s10}>&nbsp;AHEAD<br />Live</td>
            <td style={s14} colSpan={2}>Developers who see their referral ROI and home loan commission in real time renew at 95%+ rate. The dashboard converts Post Sales from a 'cost centre' to a 'revenue centre' in every board presentation.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>Full Lifecycle Coverage<br />(Booking → Possession)</td>
            <td style={s7}></td>
            <td style={s8}>Reloy and most competitors focus post-possession. Pre-possession buyer experience (legal, construction, financials) is managed via CRM + email.</td>
            <td style={s8}></td>
            <td style={s9}>Complete lifecycle: booking details, NCF, stamp duty, sales deed acceptance, construction updates, financial management, possession scheduling , all in-app from Day 1 of booking.</td>
            <td style={s10}>&nbsp;AHEAD</td>
            <td style={s11} colSpan={2}>Relationship starts from Day 1 of booking. Buyers who trust the developer during construction (the highest-anxiety period) are the ones who refer during possession , the highest-delight moment. Full lifecycle = more referral trigger points.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>Document Repository &amp; Legal Workflow</td>
            <td style={s13}></td>
            <td style={s8}>Documents emailed individually. Physical signing for agreements. No centralized buyer vault. Document disputes common.</td>
            <td style={s8}></td>
            <td style={s9}>Centralized digital vault with all legal and financial documents. Digital acceptance with timestamps creates audit trail for RERA compliance and dispute resolution.</td>
            <td style={s10}>&nbsp;AHEAD</td>
            <td style={s14} colSpan={2}>Legally defensible audit trails protect the developer. Digital acceptance reduces registration disputes , buyers who have smooth legal experiences become advocates, not complainants.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>Construction Progress Updates</td>
            <td style={s7}></td>
            <td style={s8}>Monthly PDF reports emailed. WhatsApp photos. No verified media pipeline. Buyer trust during construction is at the lowest point in the lifecycle.</td>
            <td style={s8}></td>
            <td style={s9}>Developer-published milestone updates with verified images and videos. Buyer engagement layer (reactions, comments). Loyalty point triggers for engagement. Referral CTA at engagement moments.</td>
            <td style={s10}>&nbsp;AHEAD</td>
            <td style={s11} colSpan={2}>Construction transparency is a referral trigger , buyers who trust the developer refer before possession. The engagement layer creates shareable moments that become organic social proof.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>Financial Management Suite</td>
            <td style={s13}></td>
            <td style={s8}>Payment receipts emailed on request. Demand letters via post. No real-time account statement. Buyers chase RMs for basic financial information.</td>
            <td style={s8}></td>
            <td style={s9}>Full suite: payment schedule, demand letters, account statement, receipts, cost sheet, EMI calculator, online payment gateway , all real-time, in-app.</td>
            <td style={s10}>&nbsp;AHEAD</td>
            <td style={s14} colSpan={2}>Financial transparency reduces buyer anxiety during the construction phase , the single biggest predictor of NPS at possession. Happy buyers at possession = referrals at possession.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>Native Mobile App (iOS + Android)</td>
            <td style={s7}></td>
            <td style={s8}>Many developer portals are web-only or have basic hybrid apps. Reloy and most direct competitors have native apps.</td>
            <td style={s8}></td>
            <td style={s9}>Production-ready iOS and Android native apps. Live.</td>
            <td style={s10}>✅ AT PAR<br />Live</td>
            <td style={s11} colSpan={2}>Table stakes for enterprise demos. App is live , no gap here.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>Multi-Language Support</td>
            <td style={s13}></td>
            <td style={s8}>English-only common in Indian developer apps. GCC players have Arabic but limited. Reloy is English-primary.</td>
            <td style={s8}></td>
            <td style={s9}>Multi-language support live. Arabic UI and RTL layout for GCC market deployment.</td>
            <td style={s10}>✅ AT PAR<br />Live</td>
            <td style={s14} colSpan={2}>GCC entry requirement. Arabic support is live , no gap.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>Push Notification Automation</td>
            <td style={s7}></td>
            <td style={s8}>Manual scheduling of notifications. No behavioral trigger automation. Same message to all buyers regardless of lifecycle stage.</td>
            <td style={s8}></td>
            <td style={s9}>Automated notification rules based on lifecycle triggers (payment due, milestone completion, referral reward earned). Live.</td>
            <td style={s10}>✅ AT PAR<br />Live</td>
            <td style={s11} colSpan={2}>Notification automation drives DAU and removes manual effort from developer ops team.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s12}>Channel Partner / Broker Management</td>
            <td style={s13}></td>
            <td style={s8}>Reloy's WinnRE app covers channel partner loyalty and performance management , a dedicated product for the broker ecosystem.</td>
            <td style={s8}></td>
            <td style={s9}>Not in current scope. Post Sales is homebuyer-first. Broker management is deliberately excluded , we are the referral alternative to the broker, not a broker management tool.</td>
            <td style={s15}>⚠️ GAP<br />(by design)</td>
            <td style={s14} colSpan={2}>This is a deliberate positioning choice. Competing with Reloy on broker management would dilute our buyer-advocacy narrative. Developers who want to manage brokers AND activate buyers will need both products , but our pitch is the buyer side exclusively.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s6}>Post-Possession Community / Society Management</td>
            <td style={s7}></td>
            <td style={s8}>NoBrokerHood and MyGate own this layer (visitor management, maintenance payments, community board) post-possession.</td>
            <td style={s8}></td>
            <td style={s9}>Community board for project residents as a medium-term roadmap item. Not in current feature set.</td>
            <td style={s15}>⚠️ GAP<br />Roadmap</td>
            <td style={s11} colSpan={2}>Post-possession community is the loyalty layer after possession. Without it, buyers disengage after handover. Community board is a roadmap priority , the sooner it ships, the longer Post Sales retains buyer engagement and referral surface area.</td>
          </tr>
          {/* Spacer */}
          <tr style={{ height: '9px' }}>
            <td style={s16} colSpan={8}></td>
          </tr>
          {/* Summary rows */}
          <tr style={{ height: '45px' }}>
            <td style={s17}>WHERE WE ARE AHEAD</td>
            <td style={s18} colSpan={7}>&nbsp; Referral Program ·&nbsp; Loyalty Tier Program ·&nbsp; Home Loan Commission Module ·&nbsp; Developer Campaign Studio ·&nbsp; AI Referral Propensity Engine · Developer Analytics Dashboard · Full Lifecycle Coverage · Document Repository &amp; Legal Workflow · Construction Progress Updates · Financial Management Suite</td>
          </tr>
          <tr style={{ height: '39px' }}>
            <td style={s17}>WHERE WE ARE AT PAR</td>
            <td style={s19} colSpan={7}>Native Mobile App (iOS + Android) · Multi-Language Support · Push Notification Automation</td>
          </tr>
          <tr style={{ height: '28px' }}>
            <td style={s17}>GAPS TO MONITOR (strategic or roadmap)</td>
            <td style={s20} colSpan={7}>Channel Partner / Broker Management · Post-Possession Community / Society Management</td>
          </tr>
          {/* Spacer */}
          <tr style={{ height: '9px' }}>
            <td style={s21} colSpan={8}></td>
          </tr>

          {/* ── SECTION 2 ── */}
          <tr style={{ height: '28px' }}>
            <td style={s2} colSpan={8}>&nbsp; SECTION 2 , PRICING LANDSCAPE&nbsp; |&nbsp; India&nbsp; |&nbsp; What to charge now, at 6M, at 18M</td>
          </tr>
          <tr style={{ height: '57px' }}>
            <td style={s22}>Standard Pricing Models in Market</td>
            <td style={s23} colSpan={7}>Per-developer annual SaaS license (most common) · Per-buyer-volume bands (scales with client growth) · White-label API licensing for PropTech platforms · Revenue share on marketplace GMV · Home loan commission revenue share (unique to Post Sales)</td>
          </tr>
          <tr style={{ height: '57px' }}>
            <td style={s22}>India , Entry Tier<br />(100–500 active buyers)</td>
            <td style={s24} colSpan={7}>Market: ₹5–15L/year for basic web portals with payment status and document download. Reloy estimated: ₹10–20L/year for loyalty + referral features. Our position: ₹12–20L/year for full platform , price slightly above basic entry to signal quality, below Reloy mid-tier.</td>
          </tr>
          <tr style={{ height: '57px' }}>
            <td style={s22}>India , Mid Market<br />(500–3,000 active buyers)</td>
            <td style={s23} colSpan={7}>Market: ₹20–60L/year. Reloy estimated mid-tier: ₹20–35L/year. Our position: ₹20–40L/year with home loan commission rev-share as a value-add that makes the total package demonstrably ROI-positive vs. broker cost.</td>
          </tr>
          <tr style={{ height: '41px' }}>
            <td style={s22}>India , Enterprise<br />(3,000+ buyers, multi-project)</td>
            <td style={s24} colSpan={7}>Market: ₹60L–2Cr+/year. Our position: ₹50L–1.5Cr/year (competitive vs. market) + marketplace GMV commission (5–12%) + analytics premium tier + API licensing add-on.</td>
          </tr>
          <tr style={{ height: '57px' }}>
            <td style={s22}>What to Charge NOW<br />(Year 1 pilot pricing)</td>
            <td style={s23} colSpan={7}>India: ₹15–25L/year. Rationale: Early-adopter pricing to close 5–8 reference clients. Full feature set included to maximize ROI proof in first 90 days. Primary goal is generating case studies, not maximizing ACV. Frame as: 'Pilot pricing , full platform, first-mover rate.'</td>
          </tr>
          <tr style={{ height: '57px' }}>
            <td style={s22}>What to Charge at 6 Months</td>
            <td style={s24} colSpan={7}>India: ₹25–45L/year. Add: tiered packaging (core vs. home loan commission module as add-on vs. analytics premium). Rationale: 3+ case studies with measurable referral and home loan ROI enable value-based pricing uplift.</td>
          </tr>
          <tr style={{ height: '57px' }}>
            <td style={s22}>What to Charge at 18 Months</td>
            <td style={s23} colSpan={7}>India: ₹40–1.2Cr/year (buyer volume bands).  Add: marketplace GMV commission (5–12%) + API licensing revenue (₹40–80L/platform). Rationale: Platform effect + proven ROI + home loan rev-share income justifies enterprise tier.</td>
          </tr>
          <tr style={{ height: '70px' }}>
            <td style={s22}>How to Package Features in Tiers</td>
            <td style={s24} colSpan={7}>
              CORE TIER: Full lifecycle management (booking → possession) + document repository + financial management + construction progress + push notifications.<br />
              GROWTH TIER (adds): Referral hub + loyalty tier system + campaign studio + gamification layer + developer analytics dashboard.<br />
              REVENUE TIER (adds): Home loan commission module + bank partner API + marketplace GMV tracking + AI referral propensity engine.<br />
              Framing: 'Core makes the developer operational. Growth makes the developer competitive. Revenue makes the developer money.'
            </td>
          </tr>
          <tr style={{ height: '87px' }}>
            <td style={s22}>One Pricing Risk to Watch</td>
            <td style={s23} colSpan={7}>Reloy's aggressive growth (targeting ₹45–50Cr FY26) may compress mid-market pricing expectations. They are likely to add features and justify higher pricing , or discount to defend Godrej/Piramal relationships. Our defense: the home loan commission revenue module creates an ROI story that is structurally impossible for Reloy to match without banking partnerships. Price-compete on value, not on discount.</td>
          </tr>
          {/* Spacer */}
          <tr style={{ height: '9px' }}>
            <td style={s21} colSpan={8}></td>
          </tr>

          {/* ── SECTION 3 ── */}
          <tr style={{ height: '28px' }}>
            <td style={s2} colSpan={8}>&nbsp; SECTION 3 , POSITIONING&nbsp; |&nbsp; Our defensible place in the market</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s22}>Our Single Most Defensible Position</td>
            <td style={s23} colSpan={5}>The only homebuyer platform in Indian real estate that manages the full buyer lifecycle (booking to possession to post-possession), generates referral sales from the existing buyer base, and creates a direct home loan commission revenue stream for the developer , in one platform. This is not homebuying reimagined. It is real estate reimagined , from transactional to relationship-driven.</td>
            <td style={s25} colSpan={2}>📌 HOLD THIS. It covers all three revenue streams (referrals, home loan commission, marketplace) and positions against the status quo AND Reloy simultaneously.</td>
          </tr>
          <tr style={{ height: '98px' }}>
            <td style={s22}>Top 2–3 Customer Segments to Prioritise This Year</td>
            <td style={s24} colSpan={5}>
              1. Mid-to-large Indian residential developers (500–3,000 active buyers): Highest urgency + referral pain point is acute + Salesforce infrastructure exists for integration + RERA creates compliance tailwind. ACV ₹20–40L.<br />
              2. Luxury Indian developers (₹2Cr+ unit value): Highest referral ticket value + NRI network is untapped gold + home loan commission per unit is highest. ACV ₹30–60L.<br />
              3. GCC (opportunistic Year 1): After 5 India reference clients. Dubai-first for NRI referral market + RERA-Dubai compliance pressure. ACV AED 200–500K.
            </td>
            <td style={s25} colSpan={2}>📌 Start with India mid-market for volume and case studies. Pursue luxury developers for reference value and highest ROI demonstration. Activate GCC once India proof base is established.</td>
          </tr>
          <tr style={{ height: '73px' }}>
            <td style={s22}>One Competitor to Displace Aggressively</td>
            <td style={s23} colSpan={5}>Reloy (Loyalie). Not the Salesforce + WhatsApp status quo , that is a longer-term displacement. Reloy is the immediate named competitor in every mid-market developer conversation. The displacement narrative: 'Reloy gives you loyalty and referrals. Post Sales gives you loyalty, referrals, home loan commission revenue, and AI-powered referral intelligence. Same category, completely different revenue story.'</td>
            <td style={s25} colSpan={2}>📌 Have a slide in every enterprise demo that directly compares Post Sales vs. Reloy on: (1) lifecycle coverage, (2) home loan module, (3) AI referral engine, (4) developer campaign studio. Make the comparison , don't avoid it.</td>
          </tr>
          <tr style={{ height: '119px' }}>
            <td style={s22}>What to Stop Saying</td>
            <td style={s24} colSpan={5}>
              Stop: 'Post Sales helps developers improve buyer experience.' , This is a cost-centre frame. Nobody is buying on buyer experience alone.<br />
              Stop: 'Reduce RM calls by 60%.' , This was the old positioning. RM deflection is a feature benefit, not a product promise.<br />
              Stop: Competing on post-sales support or CRM integration as primary positioning , that's table stakes.<br />
              Start: 'Make your customers your brand advocates. Reduce cost of sales by 75%. Create a home loan commission revenue stream you've never tracked before.'
            </td>
            <td style={s25} colSpan={2}>📌 Revenue-centric framing wins in every sales conversation. Cost savings are secondary proof points. Referral economics and home loan revenue are the openers.</td>
          </tr>
          <tr style={{ height: '111px' }}>
            <td style={s22}>Recommended GTM Motion , Year 1</td>
            <td style={s23} colSpan={5}>
              Direct enterprise sales: founder-led → 1 enterprise AE (India) by Month 4 → 1 GCC sales head or local partner by Month 8.<br />
              Target: VP Sales + Head of Loyalty + Head of Home Loans in one meeting. Three buyers, one pitch, three ROI stories.<br />
              Support channels: LinkedIn referral ROI thought leadership + CREDAI/NAREDCO event presence + bank/NBFC partnership announcements (creates PR and credibility simultaneously).<br />
              No PLG in Year 1. No self-serve. Enterprise relationships require founder-level credibility.
            </td>
            <td style={s25} colSpan={2}>📌 Year 1 is about reference clients and case studies. Price to win, onboard with white-glove, measure obsessively, publish results.</td>
          </tr>
          {/* Spacer */}
          <tr style={{ height: '9px' }}>
            <td style={s21} colSpan={8}></td>
          </tr>

          {/* ── SECTION 4 ── */}
          <tr style={{ height: '28px' }}>
            <td style={s2} colSpan={8}>&nbsp; SECTION 4 , VALUE PROPOSITIONS &amp; SUGGESTED IMPROVEMENTS</td>
          </tr>
          {/* Section 4 column headers */}
          <tr style={{ height: '33px' }}>
            <td style={s3}>Value Proposition</td>
            <td style={s3}></td>
            <td style={s4}>Current Framing</td>
            <td style={s4}></td>
            <td style={s5} colSpan={2}>Improved Framing (Revenue-Centric)</td>
            <td style={s3}>Who It Resonates With Most</td>
            <td style={s26}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>Make Your Customers Your Brand Advocates</td>
            <td style={s27}></td>
            <td style={s8}>Loyalty and rewards layer drives referrals and repeat engagement.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Your satisfied homebuyers are your cheapest and most effective sales channel. Post Sales gives them a reason to refer, a tool to do it, and a reward for following through , systematically, measurably, and at scale. Your next launch can activate before the first broker call.</td>
            <td style={s28}>VP Sales, MD, CFO , anyone measured on cost of sales %</td>
            <td style={s13}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>Reduce Cost of Sales by up to 75% Through Referrals</td>
            <td style={s27}></td>
            <td style={s8}>Referral tracking and gamified hub activates buyer-sourced leads.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Indian developers spend ₹3–7Cr per ₹100Cr project in broker commissions. With a 10% referral booking rate from your existing buyer base, you recover ₹30–70L per launch in saved commissions , on a platform that costs ₹15–40L/year. The math is simple.</td>
            <td style={s13}>CFO, VP Sales, Business Head , anyone who has reviewed the cost-of-sales P&amp;L</td>
            <td style={s13}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>Create a Home Loan Commission Revenue Stream</td>
            <td style={s27}></td>
            <td style={s8}>Home loan enquiry module captures buyer interest and links to banking partners.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Your buyers are already taking home loans. You're just not earning on them. Post Sales connects your buyers to partner banks, tracks every application, and deposits commission directly to your Home Loans team's dashboard , turning an uncaptured revenue flow into a measurable P&amp;L line worth ₹80L–₹3Cr/year.</td>
            <td style={s28}>Head of Home Loans, CFO, MD , the people who can immediately see the uncaptured revenue</td>
            <td style={s13}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>From Transactional to Relationship-Driven Real Estate</td>
            <td style={s27}></td>
            <td style={s8}>End-to-end homebuyer lifecycle management in one platform.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Every other developer in your market closes a deal and moves on to the next lead. Post Sales means you stay in your buyer's life from booking to possession to post-possession , building loyalty, earning referrals, and growing a community that sells your next launch before it opens.</td>
            <td style={s13}>MD, CEO, Brand Heads , anyone building long-term developer brand equity</td>
            <td style={s13}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>Empower Your Loyalty Team with a Real Tool</td>
            <td style={s27}></td>
            <td style={s8}>Developer analytics dashboard and campaign studio for internal teams.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Your loyalty team currently runs referral programs on WhatsApp with no data, no automation, and no credit. Post Sales gives them a self-serve campaign studio, real-time referral analytics, and the metrics to present at every leadership review. They stop being a cost centre and start being a revenue function.</td>
            <td style={s28}>Head of Loyalty, CX Head, Team managers who need performance visibility</td>
            <td style={s13}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>Full Lifecycle Coverage , Relationship Starts at Booking, Not Possession</td>
            <td style={s27}></td>
            <td style={s8}>Booking to possession journey management covers all legal, financial, and construction stages.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Most loyalty platforms start at possession. By then, the relationship window has already been defined by the construction anxiety your buyer lived through. Post Sales starts the relationship at booking , when trust is being built , so that by possession day, your buyer is already an advocate, not a first-time customer.</td>
            <td style={s13}>VP Post-Sales, CX Head , anyone who manages buyer feedback during the construction phase</td>
            <td style={s13}></td>
          </tr>
          <tr style={{ height: '65px' }}>
            <td style={s22}>Revenue-Positive from Month 3</td>
            <td style={s27}></td>
            <td style={s8}>Platform ROI demonstrated through referral savings and engagement metrics.</td>
            <td style={s8}></td>
            <td style={s9} colSpan={2}>Home loan commissions alone cover the platform cost at 200 buyers. Referral bookings from Month 1 create measurable broker commission savings. This is not a buyer experience investment , it is a revenue-generating infrastructure decision that pays back in 90 days.</td>
            <td style={s28}>CFO, Investment Committee, MD , the final approval layer in any enterprise budget decision</td>
            <td style={s13}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PostSalesPricingTab;
