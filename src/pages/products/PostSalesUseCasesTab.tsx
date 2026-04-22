import React from 'react';

const PostSalesUseCasesTab: React.FC = () => {
  // ── Style objects mapped from HTML CSS classes ──────────────────────────────
  const s0: React.CSSProperties = { borderBottom: '1px solid transparent', borderRight: '1px solid transparent', backgroundColor: '#DA7756', textAlign: 'center', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Poppins, sans-serif', fontSize: '16pt', verticalAlign: 'bottom', wordWrap: 'break-word', padding: '0px 3px' };
  const s1: React.CSSProperties = { borderBottom: '1px solid transparent', borderRight: '1px solid transparent', backgroundColor: '#F6F4EE', textAlign: 'center', fontStyle: 'italic', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'bottom', wordWrap: 'break-word', padding: '0px 3px' };
  const s2: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid transparent', backgroundColor: '#DA7756', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Poppins, sans-serif', fontSize: '11pt', verticalAlign: 'bottom', wordWrap: 'break-word', padding: '0px 3px' };
  const s3: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'center', fontWeight: 'bold', color: '#DA7756', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'bottom', wordWrap: 'break-word', padding: '0px 3px' };
  const s4: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s5: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s6: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s7: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s8: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s9: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s10: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s11: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s12: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s13: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'center', fontWeight: 'bold', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s14: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'left', fontWeight: 'bold', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s15: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s16: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s17: React.CSSProperties = { borderBottom: '1px solid transparent', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '11pt', verticalAlign: 'bottom', wordWrap: 'break-word', padding: '0px 3px' };
  const s18: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#F6F4EE', textAlign: 'left', fontWeight: 'bold', color: '#DA7756', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s19: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '8pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s20: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };
  const s21: React.CSSProperties = { borderBottom: '1px solid #C4B89D', borderRight: '1px solid #C4B89D', backgroundColor: '#ffffff', textAlign: 'left', color: '#2C2C2C', fontFamily: 'Poppins, sans-serif', fontSize: '9pt', verticalAlign: 'top', wordWrap: 'break-word', padding: '0px 3px' };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] text-xl font-bold mb-4">
        Post Sales  ·  Use Cases
      </div>
      <table
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', minWidth: '1200px', backgroundColor: 'white' }}
        cellSpacing={0}
        cellPadding={0}
      >
        <colgroup>
          <col style={{ width: '100px' }} />
          <col style={{ width: '152px' }} />
          <col style={{ width: '417px' }} />
          <col style={{ width: '183px' }} />
          <col style={{ width: '143px' }} />
          <col style={{ width: '150px' }} />
          <col style={{ width: '149px' }} />
          <col style={{ width: '131px' }} />
          <col style={{ width: '139px' }} />
        </colgroup>
        <tbody>

          {/* ── Row 2: Subtitle ─────────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s1} colSpan={9}>Part 1: Industry-level (10 industries ranked by referral &amp; loyalty relevance)  |  Part 2: Internal team-level (developer teams that use this platform daily)</td>
          </tr>

          {/* ── Row 3: Part 1 Section Header ────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s2} colSpan={9}>&nbsp; PART 1 — INDUSTRY-LEVEL USE CASES&nbsp; (Ranked by referral + loyalty relevance to the developer)</td>
          </tr>

          {/* ── Row 4: Column Headers ────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s3}>#</td>
            <td style={s3}>Industry</td>
            <td style={s3}>How Post Sales Creates Value (Referral + Loyalty + Home Loan lens)</td>
            <td style={s3}>Ideal Company Profile &amp; Current Tool</td>
            <td style={s3}>Urgency</td>
            <td style={s3}>Primary Buyer &amp; What They're Measured On</td>
            <td style={s3}>Primary User &amp; Daily Frustration</td>
            <td style={s3}>Key Features &amp; Teams Used</td>
            <td style={s3}>Referral / Revenue Opportunity</td>
          </tr>

          {/* ── Row 5: Industry 1 ───────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s4}>1</td>
            <td style={s5}>Real Estate Developers &amp; Housing Companies<br />(Primary — Core Buyer) <span style={{ fontWeight: 'bold' }}>(Residential)</span></td>
            <td style={s6}>This is the product's home. The developer's Loyalty Team uses the Referral Hub and Campaign Studio to drive referral bookings. The Home Loans Team tracks commission revenue through the home loan dashboard. The Sales Team watches referral bookings reduce broker cost. Marketing runs gamified referral bonus campaigns. The developer moves from broker-dependent to advocate-powered.</td>
            <td style={s7}>Mid-to-large Indian residential developers · 500–5,000 active homebuyers · Mumbai, Pune, Bengaluru, Hyderabad, NCR · Luxury and premium segments · Currently: WhatsApp + Salesforce + Excel for post-sales</td>
            <td style={s8}>HIGH<br />Core buyer. No structured referral + loyalty + home loan platform exists for this segment in India.</td>
            <td style={s9}>VP Sales / Head of Loyalty / Head of Home Loans<br />Measured on: referral booking %, cost of sales %, home loan commission revenue, buyer NPS</td>
            <td style={s10}>Loyalty Team Manager<br />Daily frustration: Running referral campaigns manually on WhatsApp with no tracking, no gamification, no data on who referred whom and what reward was earned.</td>
            <td style={s11}>Referral Hub · Loyalty Tier System · Campaign Studio · Home Loan Commission Dashboard · Developer Analytics · Push Notifications</td>
            <td style={s12}>Primary revenue opportunity. Referral bookings reduce broker cost by ₹50L–₹5Cr/year. Home loan commissions add ₹80L–₹3Cr/year. ROI payback in Month 3.</td>
          </tr>

          {/* ── Row 6: Industry 2 ───────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s13}>2</td>
            <td style={s14}>Luxury Real Estate Developers<br />(₹2Cr+ Average Unit Value) <span style={{ fontWeight: 'bold' }}>(Residential)</span></td>
            <td style={s15}>Luxury buyers are high-net-worth individuals with social networks of similar wealth. One referred luxury buyer = ₹2–10Cr in sales. The loyalty program must match the brand — exclusive tiers, premium rewards, invitation-only early access. The developer's ambassador program is a brand asset as much as a sales channel. NRI buyers in this segment are the highest-value referral network globally.</td>
            <td style={s7}>Luxury residential developers · 200–2,000 active buyers (smaller base, higher value) · Mumbai, Bengaluru, Hyderabad, Delhi NCR, Dubai · Currently: CRM + concierge teams + WhatsApp groups for VIP buyers</td>
            <td style={s8}>HIGH<br />Highest referral ticket value. Fastest ROI demonstration. Brand equity investment is highest.</td>
            <td style={s16}>MD / CEO / VP Sales<br />Measured on: brand NPS, new launch sellout velocity, NRI referral rate, repeat investment buyer %</td>
            <td style={s10}>Head of Customer Experience / Brand Manager<br />Daily frustration: Managing 'VIP buyer' relationships manually. No systematic way to recognize, reward, and activate the developer's most loyal buyers as brand ambassadors.</td>
            <td style={s11}>Loyalty Tier (branded ambassador program) · Referral Hub with luxury reward catalog · Home Loan NRI module · Personalization engine · Developer Analytics</td>
            <td style={s12}>Luxury referral bookings convert at 25–40%. A 10-buyer referral program yielding 3 bookings at ₹5Cr avg = ₹15Cr in referral-sourced sales at near-zero cost.</td>
          </tr>

          {/* ── Row 7: Industry 3 ───────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s4}>3</td>
            <td style={s5}>GCC Freehold Developers<br />(UAE, Saudi Arabia — NRI buyer base) <span style={{ fontWeight: 'bold' }}>(Real Estate Development)</span></td>
            <td style={s6}>GCC developers with South Asian buyer bases are sitting on the world's most powerful real estate referral network. NRI buyers from UK, US, Canada, and GCC who purchase Indian or UAE property have concentrated social networks with similar income and investment profiles. RERA-Dubai compliance + premium buyer expectations + NRI referral velocity = highest ACV opportunity globally.</td>
            <td style={s7}>Freehold residential developers · Dubai primary, Abu Dhabi secondary · 200–2,000 active buyers (mix of NRI and local) · Currently: bilingual WhatsApp + email + CRM for buyer management</td>
            <td style={s8}>&nbsp;HIGH<br />RERA compliance pressure + NRI referral network + ACV 2–3× India. Greenfield — no dominant loyalty+referral platform in UAE real estate.</td>
            <td style={s9}>GM Customer Experience / VP Sales / MD<br />Measured on: RERA SPA compliance, buyer satisfaction (Google reviews), NRI referral conversion, home loan partnerships</td>
            <td style={s10}>Post-Sales Manager / CRM Team<br />Daily frustration: Managing multilingual (English + Arabic) buyer communications manually. No structured way to capture and track NRI referrals from UK/US/Canada buyers.</td>
            <td style={s11}>NRI Referral Module · Multi-language support (Arabic + English) · Home Loan GCC Bank integration · RERA compliance documentation · Loyalty Tier · Campaign Studio</td>
            <td style={s12}>NRI referral bookings in luxury real estate convert at 30–40%. GCC ACV ₹90–200L/year. Single NRI buyer referral = ₹4–10Cr in sales.</td>
          </tr>

          {/* ── Row 8: Industry 4 ───────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s13}>4</td>
            <td style={s14}>Housing Finance Companies (HFCs) &amp; Banks <span style={{ fontWeight: 'bold' }}>(BFSI)</span></td>
            <td style={s15}>Post Sales creates a structured, in-app home loan enquiry pipeline from verified homebuyers — the highest-intent home loan prospects that exist. Banks and NBFCs pay ₹8,000–30,000+ per disbursed loan to structured referral partners. This is a revenue share partnership opportunity, not a sales opportunity. Banks become co-beneficiaries of Post Sales' buyer base.</td>
            <td style={s7}>Mid-to-large HFCs and private banks with retail home loan books · HDFC, ICICI, Axis, SBI, Bajaj Housing Finance (India) · Mashreq, Emirates NBD, FAB (GCC) · Currently: DSA networks and developer referral calls for pipeline</td>
            <td style={s8}>&nbsp; MEDIUM-HIGH<br />High strategic value as revenue share partner. Bank partnerships are a prerequisite for activating the home loan commission module — negotiate early.</td>
            <td style={s16}>Head of Retail Home Loans / Digital Partnerships Head<br />Measured on: disbursement volume, qualified lead pipeline, cost per acquisition, DSA network efficiency</td>
            <td style={s10}>Home Loan DSA / Branch Manager<br />Daily frustration: Sourcing qualified home loan leads. Existing DSA network brings high-volume but low-quality leads. Developer-referred buyers close at 3× the rate but no structured digital channel exists.</td>
            <td style={s11}>Home Loan Enquiry module · Commission tracking dashboard · Bank API integration · Buyer verification data feed (consent-based)</td>
            <td style={s12}>Revenue share: ₹8,000–30,000+ per disbursed loan. At 1,000 buyers/developer × 60% uptake × 10 developer clients = potentially ₹50Cr+ in annual loan disbursals flowing through the platform.</td>
          </tr>

          {/* ── Row 9: Industry 5 ───────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s4}>5</td>
            <td style={s5}>PropTech Platforms &amp; Real Estate Portals<br />(MagicBricks, 99acres, NoBroker type) <span style={{ fontWeight: 'bold' }}>(Real Estate Development)</span></td>
            <td style={s6}>PropTech platforms want to expand beyond listing to own the post-purchase buyer relationship. Post Sales' loyalty + referral + home loan engine can be white-labeled as their 'developer post-sales product' — giving them a new developer retention tool without building it internally. API licensing creates a new B2B revenue stream for the platform and exponential distribution for Post Sales.</td>
            <td style={s7}>Series B–D PropTech platforms or established portals · MagicBricks, 99acres, Housing.com, NoBroker (India) · Bayut, Property Finder (GCC) · Currently: listing + lead generation model with no post-purchase product</td>
            <td style={s8}>&nbsp; MEDIUM<br />High leverage but requires 10+ direct developer clients as proof base first. Platform deals have 20–32 week cycles.</td>
            <td style={s9}>CPO / VP Product / VP Partnerships<br />Measured on: developer retention rate, developer platform GMV, new feature velocity, differentiation vs. competitors</td>
            <td style={s10}>Head of Developer Relations / BD Manager<br />Daily frustration: Developers churn from platform after listing ends. No tool to keep developers on the platform post-sale. Competitor platforms offering more post-sales value.</td>
            <td style={s11}>API licensing: Referral Hub + Loyalty Engine + Home Loan Module · White-label deployment under platform brand · Developer analytics feed</td>
            <td style={s12}>API licensing: ₹40–80L/year per platform or GMV revenue share. One platform deal = access to 100–1,000 developer clients instantly.</td>
          </tr>

          {/* ── Row 10: Industry 6 ──────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s13}>6</td>
            <td style={s14}>Real Estate Investment &amp; Portfolio Management Firms <span style={{ fontWeight: 'bold' }}>(Asset Management)</span></td>
            <td style={s15}>Investors who own multiple units in the same project (common in luxury and commercial real estate) are high-frequency referral sources. They know other investors. Post Sales' loyalty tier system with investor-specific early-access benefits and portfolio management tools creates a structured retention and upsell engine for developers targeting repeat investors.</td>
            <td style={s7}>HNI real estate investors, family offices, NRI investor groups · 5–100 units owned across developer portfolios · India (Mumbai, Bengaluru, Hyderabad) and UAE · Currently: managed via dedicated RM calls and WhatsApp groups</td>
            <td style={s8}>&nbsp; MEDIUM<br />High referral value (investor networks are dense and high-trust). Natural fit for early-access loyalty tier benefits. Unlocked when Post Sales has luxury developer client base.</td>
            <td style={s16}>Head of Investor Relations / VP Sales (Investor Division)<br />Measured on: repeat purchase rate, NPS among investors, referral bookings from investor network</td>
            <td style={s10}>Senior RM / Investor Relations Manager<br />Daily frustration: Managing 50–200 HNI investors manually. No digital tool to give them portfolio visibility, early access, or structured referral rewards.</td>
            <td style={s11}>Investor Loyalty Tier (early access + exclusive benefits) · Portfolio view (multi-unit) · Referral Hub with high-value reward catalog · Developer Analytics</td>
            <td style={s12}>Investor referrals convert at 35–50%. An investor referring 2 fellow HNIs can generate ₹10–30Cr in bookings. Investor loyalty programs have the highest ROI per buyer in the entire referral ecosystem.</td>
          </tr>

          {/* ── Row 11: Industry 7 ──────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s4}>7</td>
            <td style={s5}>Construction &amp; Project Delivery Companies <span style={{ fontWeight: 'bold' }}>(EPCE)</span></td>
            <td style={s6}>Construction companies use Post Sales as the structured buyer communication channel for their development clients. The Construction Progress module gives site teams a digital publishing tool that builds buyer trust, reduces inbound calls, and creates engagement moments that the developer's loyalty team converts into referral triggers.</td>
            <td style={s7}>EPC contractors and construction management firms · 10–50 active projects · Pan-India · Currently: PDF reports emailed monthly + WhatsApp photos to developer RM teams</td>
            <td style={s8}>&nbsp;MEDIUM<br />Supporting use case — they use the platform as an operations tool when engaged by the developer. Not a direct buyer.</td>
            <td style={s9}>Project Director / Construction Head<br />Measured on: delivery timelines, snag rates, buyer satisfaction at possession</td>
            <td style={s10}>Site Engineer / Project Manager<br />Daily frustration: Buyer queries about construction status flood the developer's RM team. No structured channel to publish verified construction updates — leading to escalations and developer-client friction.</td>
            <td style={s11}>Construction Progress module · Milestone scheduling · Media upload (images + video) · Notification triggers to buyers</td>
            <td style={s12}>Construction transparency is a referral trigger. Buyers who trust the developer refer earlier — before possession. Structured updates reduce post-possession snag complaints by 40–60%.</td>
          </tr>

          {/* ── Row 12: Industry 8 ──────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s13}>8</td>
            <td style={s14}>Interior Design ( Home Improvement )</td>
            <td style={s15}>Interior designers are a natural post-possession marketplace partner. Post Sales surfaces their services to buyers at the exact moment of maximum relevance — 30–60 days before possession. AI-curated recommendations by unit size and style create conversion rates far higher than cold outreach. Developers earn GMV commission from marketplace transactions.</td>
            <td style={s7}>Organized interior design chains and D2C home improvement brands · 50–2,000 employees · India metro cities and GCC · Currently: developer referrals via WhatsApp, brochures at site office, or word-of-mouth</td>
            <td style={s8}>&nbsp;MEDIUM<br />High-value marketplace partner. Urgency tied to marketplace go-live and possession timeline activation.</td>
            <td style={s16}>Head of Partnerships / Marketing Director<br />Measured on: lead-to-project conversion rate, average project value, referral source quality</td>
            <td style={s10}>Business Development Manager<br />Daily frustration: Reaching buyers at the right moment (pre-possession) is difficult. Brochure drops at site office yield 1–2% conversion. No direct digital channel to verified, motivated buyers.</td>
            <td style={s11}>Services Marketplace · Possession Timeline trigger · AI recommendation engine · In-app booking and inquiry</td>
            <td style={s12}>Interior firms that join the marketplace get verified buyer leads at possession moment — highest conversion window in home improvement. Developer earns 5–15% GMV commission on marketplace transactions.</td>
          </tr>

          {/* ── Row 13: Industry 9 ──────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s4}>9</td>
            <td style={s5}>Moving &amp; Relocation Services <span style={{ fontWeight: 'bold' }}>(Home Improvements)</span></td>
            <td style={s6}>Moving companies benefit from the possession scheduling module — it gives them a verified window of buyer move-in dates. Post Sales surfaces relocation services to buyers in the possession countdown period. Automated reminders 30–15 days before possession with in-app booking create a high-conversion pipeline for organized movers.</td>
            <td style={s7}>Organized moving companies and app-based relocation platforms · 10–500 employees · India major metros · Currently: listings on Google, JustDial, word-of-mouth, or social media</td>
            <td style={s8}>&nbsp;LOW-MEDIUM<br />Marketplace partnership value is high but contingent on marketplace GMV activation and possession volumes.</td>
            <td style={s9}>BD Head / Partnerships Manager<br />Measured on: bookings from platform, cost per acquisition, seasonal capacity management</td>
            <td style={s10}>Operations Manager<br />Daily frustration: Peak demand unpredictability around possession months. No forward visibility on how many homes are being handed over in which areas — making capacity planning impossible.</td>
            <td style={s11}>Services Marketplace · Possession Scheduling · Push Notification at possession countdown</td>
            <td style={s12}>Verified possession-date leads are worth 5–10× the value of cold leads for moving companies. Developer earns GMV commission.</td>
          </tr>

          {/* ── Row 14: Industry 10 ─────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s13}>10</td>
            <td style={s14}>Smart Home &amp; Home Automation Companies <span style={{ fontWeight: 'bold' }}>(Home Improvements)</span></td>
            <td style={s15}>Smart home vendors benefit from placement in the marketplace at the possession stage — when buyers are making decisions about their new home setup. Unit details and floor plans in the platform inform product recommendations (automation for that specific layout). AI recommendation at possession creates a high-quality buyer pipeline that smart home brands cannot reach through any other channel.</td>
            <td style={s7}>Smart home product companies and installation firms · 20–500 employees · India tier-1 cities and GCC (UAE high-penetration) · Currently: builder partnerships, word-of-mouth, Google Ads</td>
            <td style={s8}>&nbsp;LOW-MEDIUM<br />High strategic value for GCC (where smart home penetration is highest). Unlocked when marketplace is live and possession volumes scale.</td>
            <td style={s16}>Channel Sales Head / Enterprise BD<br />Measured on: developer partnership count, units installed per project, referral conversion from developer buyers</td>
            <td style={s10}>Enterprise Sales Manager<br />Daily frustration: Reaching buyers who just took possession. They are already engaged with their new home — but there's no structured channel to reach them with product recommendations at the right moment.</td>
            <td style={s11}>Services Marketplace · Unit Details &amp; Floor Plans for product recommendations · Possession trigger · AI recommendation</td>
            <td style={s12}>Smart home installation per unit in India: ₹50,000–5,00,000. GCC: AED 5,000–50,000. Developer earns marketplace commission on all marketplace-initiated installations.</td>
          </tr>

          {/* ── Row 15: Spacer ──────────────────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
            <td style={s17}></td>
          </tr>

          {/* ── Row 16: Part 2 Section Header ───────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s2} colSpan={9}>&nbsp; PART 2 — INTERNAL TEAM USE CASES&nbsp; (Developer's own teams that use Post Sales daily)</td>
          </tr>

          {/* ── Row 17: Part 2 Column Headers ───────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s3}>Team</td>
            <td style={s3}>Why Post Sales is Their Platform</td>
            <td style={s3}>Key Features &amp; Processes They Run</td>
            <td style={s3}>Primary Goal the Team Achieves</td>
            <td style={s3} colSpan={5}>Why They Champion Post Sales Internally</td>
          </tr>

          {/* ── Row 18: Team 1 — Loyalty & CX ───────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s18}>🏆 Loyalty &amp; CX Team<br />(Primary power user — owns the platform)</td>
            <td style={s6}>This team's entire job is Post Sales. They run referral bonus campaigns, manage tier upgrades, track buyer engagement, send milestone celebrations, and measure referral conversion. Post Sales is their operating system.</td>
            <td style={s19}>Campaign Studio (segments, campaigns, A/B tests) · Loyalty Tier management · Referral Hub oversight · Developer Analytics Dashboard · Push notification rules · Event management</td>
            <td style={s20}>Increase referral booking rate from 2–5% baseline to 8–15%. Reduce dependency on paid marketing for new launch activation. Build a compounding buyer advocacy base.</td>
            <td style={s21} colSpan={5}>They are the internal champion. Without Post Sales, they run referral programs via WhatsApp manually with no tracking and no data. Post Sales gives them a professional platform, metrics they can present at leadership reviews, and campaigns they can launch independently.</td>
          </tr>

          {/* ── Row 19: Team 2 — Home Loans ─────────────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s18}>💰 Home Loans Team<br />(Revenue co-owner — earns commission)</td>
            <td style={s15}>The Home Loans Team accesses the in-app enquiry pipeline and the commission dashboard. They see which buyers have expressed home loan interest, track application status with partner banks, and monitor monthly commission earned. For the first time, they have a measurable P&amp;L line tied to their efforts.</td>
            <td style={s19}>Home Loan Commission Dashboard · Bank partner API integration · Buyer enquiry pipeline · Monthly commission reconciliation · Notification to buyers on loan status</td>
            <td style={s20}>Generate ₹80L–₹3Cr in annual home loan commission revenue for the developer. Build structured bank/NBFC partnerships. Track home loan team performance against targets.</td>
            <td style={s21} colSpan={5}>They earn directly through the platform. No other tool gives them commission visibility. Post Sales becomes their revenue-tracking system — they will fight to keep it at renewal.</td>
          </tr>

          {/* ── Row 20: Team 3 — Sales & Marketing ─────────────── */}
          <tr style={{ height: '19px' }}>
            <td style={s18}>📊 Sales &amp; Marketing Team<br />(Referral campaign activation)</td>
            <td style={s6}>Sales team benefits from referral-sourced leads — the highest quality, lowest cost leads in the developer's pipeline. Marketing team uses the Campaign Studio to run referral bonus campaigns, loyalty tier promotions, and event activations. Both teams see referral pipeline in real time.</td>
            <td style={s19}>Referral pipeline view · Campaign Studio for referral bonus campaigns · Analytics Dashboard (referral source tracking) · Event management · Dynamic banners · Launch roadblock screens</td>
            <td style={s20}>Reduce broker dependency for new launch activation. Increase referral sourced booking % from existing buyer base. Activate buyer community before a new launch.</td>
            <td style={s21} colSpan={5}>Referral leads close at 3× the rate of broker leads with no commission cost. Sales team champions the platform because it delivers warmer, cheaper leads.</td>
          </tr>

          {/* ── Row 21: Team 4 — Construction & Delivery ────────── */}
          <tr style={{ height: '20px' }}>
            <td style={s18}>🏗️ Construction &amp; Delivery Team<br />(Transparency engine — trust builder)</td>
            <td style={s15}>Construction team publishes verified milestone updates (photos, videos, reports) through the platform — replacing the chaos of WhatsApp groups and email forwards. Structured publication reduces buyer query calls and creates engagement content that the Loyalty Team converts into referral triggers.</td>
            <td style={s19}>Construction Progress module · Milestone scheduling · Media upload · Notification triggers · Possession Scheduling · Pre-possession checklist</td>
            <td style={s20}>Reduce buyer inbound calls about construction status by 40–60%. Build buyer trust during the construction phase — the highest-anxiety period — through verified, timestamped updates.</td>
            <td style={s21} colSpan={5}>Fewer buyer complaints to the RM team. Site managers who publish good updates see buyer satisfaction scores go up. The platform reduces the friction between construction reality and buyer expectation.</td>
          </tr>

          {/* ── Row 22: Team 5 — Leadership / CXO ──────────────── */}
          <tr style={{ height: '20px' }}>
            <td style={s18}>👨‍💼 Leadership / CXO<br />(Oversight + ROI visibility)</td>
            <td style={s6}>CEO, MD, and VP-level leadership use the Developer Analytics Dashboard to see referral velocity, loyalty tier distribution, home loan commission revenue, buyer NPS trend, and payment adherence — in real time. Monthly AI-generated digest provides a board-ready summary without manual extraction.</td>
            <td style={s19}>Developer Analytics Dashboard · AI weekly digest · Referral pipeline summary · Home loan commission P&amp;L view · NPS trend · Payment adherence heatmap</td>
            <td style={s20}>Visible, measurable ROI from the Post Sales platform investment. Monthly board-level metric: referral bookings sourced, broker cost saved, home loan commission earned.</td>
            <td style={s21} colSpan={5}>They approved the budget. The dashboard shows them the return. When referral booking data appears in the monthly P&amp;L presentation, the renewal conversation is automatic.</td>
          </tr>

          {/* ── Row 23: Team 6 — IT / Technology ───────────────── */}
          <tr style={{ height: '20px' }}>
            <td style={s18}>⚙️ IT / Technology Team<br />(Integration owner)</td>
            <td style={s15}>IT team manages the CRM integration (Salesforce), payment gateway configuration, and data security compliance. Post Sales provides a read-only API integration model that does not alter existing CRM data structure — minimizing IT risk and implementation complexity.</td>
            <td style={s19}>Salesforce CRM integration (read-only API) · OTP authentication · Payment gateway (PCI-DSS compliant) · Data residency configuration · Push notification infrastructure</td>
            <td style={s20}>Ensure secure, compliant integration without disrupting existing systems. Maintain DPDPA (India) and PDPL (GCC) compliance for buyer PII handling.</td>
            <td style={s21} colSpan={5}>Post Sales does not compete with or replace their existing stack. It adds a buyer-facing layer on top of existing CRM infrastructure. IT teams typically approve it quickly when the integration complexity is framed correctly.</td>
          </tr>

          {/* ── Row 24: Team 7 — Legal & Compliance ─────────────── */}
          <tr style={{ height: '20px' }}>
            <td style={s18}>📋 Legal &amp; Compliance Team<br />(Documentation + regulatory assurance)</td>
            <td style={s6}>Legal team relies on Post Sales' document repository and digital acceptance workflows to maintain audit trails for NCF, stamp duty, sales deed, and possession documentation. The platform's timestamped digital acceptance records protect the developer in any buyer dispute or regulatory review.</td>
            <td style={s19}>Document Repository (legal vault) · NCF Management · Stamp Duty tracking · Sales Deed digital acceptance · Architect certificate access · KYC verification audit trail</td>
            <td style={s20}>Maintain legally defensible audit trails for all buyer-developer documentation. Reduce document-related disputes and RERA compliance risk.</td>
            <td style={s21} colSpan={5}>Digital document acceptance with timestamps protects the developer legally. Every dispute that avoids litigation is a six-figure saving. Legal teams become vocal Post Sales advocates after the first dispute that the platform's audit trail resolves.</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default PostSalesUseCasesTab;
