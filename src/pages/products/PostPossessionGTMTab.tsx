import React from "react";

const postPossessionGTM = {
  targetGroups: [
    {
      title: "TARGET GROUP 1 — LARGE INDIAN RESIDENTIAL DEVELOPERS (Top 50, Tier-1 Cities, 1,000+ Units/Project)",
      salesMotion: {
        title: "COMPONENT 1 — SALES MOTION",
        columns: ["Sales Element", "Details"],
        rows: [
          ["ICP Definition", "Real estate developer headquartered in India. 1,000+ units delivered per project. Active projects in Mumbai, Bengaluru, Pune, Delhi-NCR, or Hyderabad. Has a dedicated CRM or Customer Experience function. Annual CP commission spend exceeding ₹25 Cr. Uses at least 2–3 separate tools today."],
          ["Lead Source", "1. REFERENCE SELLS from Godrej / Piramal / Runwal. 2. CREDAI / NAREDCO events. 3. LinkedIn outreach to VP-CRM, Head of CX, and COO. 4. PropTech consultancies (JLL, CBRE, Knight Frank). 5. Inbound from ROI calculator and case study content."],
          ["Outreach Approach", "Persona-specific messaging: CRM Head ('Turn residents into referral agents'), FM Head ('Replace 7 FM tools with one'), CFO/COO ('Reduce CP acquisition cost by 50%'). LinkedIn DM → personalised email → direct call within 48 hours."],
          ["First Meeting Agenda", "15 min: Discovery (pain points). 10 min: ROI story (Godrej/Piramal numbers). 10 min: 3-minute overview video. 10 min: Scope discovery (units, tools, budget). 5 min: Next steps (full demo)."],
          ["Demo Flow", "Security & Gate (3 min) → Helpdesk (3 min) → Billing (2 min) → Referral engine (5 min) → Architecture (3 min) → BI dashboard (2 min) → Roadmap (2 min). Total: 20 min demo + 20 min Q&A. Start with what matters to the buyer persona."],
          ["Objection Handling", "OBJ 1: 'Already use MyGate.' -> Post Possession is a developer's branded platform, not just a resident app. OBJ 2: 'Build in-house.' -> Show TCO comparison (₹5-15 Cr / 18-24 months vs 45 days go-live). OBJ 3: 'Tight budget.' -> It's a sales investment, not IT cost (Referral ROI pays for it)."],
          ["Deal Velocity Target", "60–90 days from first meeting to signed contract. Milestones: Discovery → Full stakeholder demo → Commercial proposal + IT review → Signature."],
          ["Win Condition", "CRM Head/VP-CX champion + CFO approval (ROI) + IT Head clearance (Data Sovereignty) + FM Head confirmation (PPM depth)."],
        ],
      },
      marketingChannels: {
        title: "COMPONENT 2 — MARKETING CHANNELS",
        columns: ["Channel", "Tactic", "Expected Output", "Budget / Timeline"],
        rows: [
          ["SEO / Content", "2 long-form articles/month on CP cost reduction and CX advantage. Keywords: 'community management app India', 'white label society app'.", "500–1,000 organic visits/month; 5–10 inbound demo requests/month", "₹1.5L/month; 3–6 month lag"],
          ["LinkedIn", "Founder thought leadership (3 posts/week) + Targeted InMail + Retargeting ads.", "50–100 MQL/month; 10–15 demo requests/month", "₹2L/month; 4–6 weeks results"],
          ["Events / Webinars", "Speaking slots at CREDAI/NAREDCO. Monthly webinars for CRM teams on referral activation.", "2–4 enterprise meetings per event; 50–100 webinar registrants", "₹3–5L/event; webinar ₹50K/month"],
          ["Partnerships", "JLL/CBRE/CBRE FM and CX arm referrals. 5–8% first-year revenue share.", "2–5 qualified referrals/month per partner", "Revenue share only; 2–4 months to activate"],
          ["PR / Media", "Feature articles in Moneycontrol, Economic Times Real Estate. Analyst briefings.", "Brand credibility; 1–2 major media features/quarter", "₹1.5L/month; 3-month ramp"],
          ["Reference Sells", "Structured reference program: existing clients presenting ROI at 'developer showcase' events.", "60–80% demo-to-deal conversion from warm intro", "Low cash cost; start Month 3"],
        ],
      },
      launchSequence: {
        title: "COMPONENT 3 — 90-DAY LAUNCH SEQUENCE",
        columns: ["Week", "Sales Action", "Marketing Action", "Product Milestone", "Success Metric"],
        rows: [
          ["Wk 1–2", "Map top 50 accounts. LinkedIn profile mapping. Warm intro requests.", "Publish Godrej/Piramal case study on website. Launch ROI calculator. Founder article.", "ROI calculator live. Case study PDF ready.", "10 intro emails. 3 demo requests."],
          ["Wk 3–4", "5–8 first meetings. Run discovery. Qualify for full demo.", "LinkedIn retargeting live. First webinar invitation.", "Demo env updated with latest UI. Demo script finalised.", "5 meetings held. 3 qualified for demo."],
          ["Wk 5–6", "Full-stakeholder demos. Proactive IT documentation. Commercial proposals.", "Publish 'How to calculate CP savings'. LinkedIn InMail sequence.", "API documentation published. Arabic language beta ready.", "3 proposals sent. 2 IT security reviews. 50+ InMails."],
          ["Wk 7–8", "Follow up on proposals. IT review calls. Negotiate commercials.", "Case study #2 published. Email nurture sequence.", "CS onboarding playbook finalised. Client checklist ready.", "1 signed contract. 2 final negotiations. 10 demo requests."],
          ["Wk 9–10", "Onboard signed client (45-day activation). Continue pipeline (5 new meetings).", "LinkedIn case study post. PropTech media/press feature outreach.", "Go-live with first client. Health score dashboard ready.", "Client live within 45 days. 2 additional contracts in pipeline."],
          ["Wk 11–12", "Developer showcase event. signed client presents ROI. Fast-track 3 accounts.", "Monthly webinar: '3 Developers ROI Data'. Record content.", "Referral payout automation shipped. Feature for new client activation.", "6+ attendees at showcase. 3 new demo requests."],
        ],
      },
      partnershipStrategy: {
        title: "COMPONENT 4 — PARTNERSHIP STRATEGY",
        columns: ["Partner Type", "What They Bring", "What We Offer", "Activation Approach", "Revenue Share Model"],
        rows: [
          ["FM Consultancies (JLL, CBRE)", "Access to FM decision-makers; trusted advisor status; top 50 developer relationships", "Co-branded PropTech advisory; referral fees; training; leads for their FM services", "Executive briefing; pilot referral on shared client; 90-day review", "8% of Year 1 ACV; no royalty"],
          ["Developer Associations (CREDAI, NAREDCO)", "Access to 10,000+ members; speaking slots; credibility as approved solution", "Member discounts; speaking slots; co-branded research reports", "Sponsor event; propose co-research; listed in resource directory", "5% Year 1 ACV introducion; ₹1L sponsor fee/event"],
          ["System Integrators (TCS, SI)", "Implementation capability; IT/Procurement relationships; bundle in digital transformation", "Reseller margin (15–20%); technical integration support; ERP connectors", "Identify SIs at target developers; joint proposal for 3 accounts", "15–20% reseller margin; SI owns implementation rev"],
          ["PropTech Investors", "Warm intros; LP access; credibility signal; co-marketing", "Deal flow signal; thought leadership at LP events; ecosystem intros", "Co-marketing intro; LP event speaking slot exchange", "No cash fee; quid-pro-quo"],
        ],
      },
      summary: {
        motion: "Lead with reference sells → target VP-CRM + FM Head simultaneously → sell on referral ROI before features → close with data sovereignty as the IT/Legal unlock. Marketing amplifies sales; partnerships (JLL, CBRE) are the fastest path to warm intros.",
        assumption: "Godrej and Piramal case studies can be published with quantified data. synthetic benchmark as fallback.",
        metric: "Referral transactions processed (₹ value of property enquiries attributed to platform referrals) growing month-on-month.",
      },
    },
    {
      title: "TARGET GROUP 2 — GCC DEVELOPERS & PROPERTY MANAGERS (UAE + Saudi Arabia, Luxury & Mid-Market)",
      salesMotion: {
        title: "COMPONENT 1 — SALES MOTION",
        columns: ["Sales Element", "Details"],
        rows: [
          ["ICP Definition", "Real estate developer or PM company in UAE/Saudi. 500+ units managed. Compliance obligations (RERA UAE, DLD, Vision 2030). Currently managing via email/WhatsApp. High-value properties (AED 800K+)."],
          ["Lead Source", "1. UAE-based Indian developer offices. 2. Cityscape Global / Saudi Real Estate Expo. 3. LinkedIn targeting (Property/Community Manager). 4. Dubai-based PropTech consultancy. 5. GITEX PropTech track."],
          ["Outreach Approach", "Lead with RERA compliance ('Are your records audit-ready?') + brand experience ('App should match AED 2M home') + data sovereignty. Arabic-translated collateral from Month 2."],
          ["First Meeting Agenda", "10 min: Pain points (security/billing/complaints). 10 min: India reference story (Godrej). 10 min: GCC demo (Arabic, UAE VAT, ANPR). 10 min: Discovery. 5 min: Next steps."],
          ["Objection Handling", "OBJ 1: 'Need Arabic-first.' -> Architecture is global; Arabic UI and UAE VAT configured. OBJ 2: 'Data residency.' -> Data stays on your servers in UAE/Saudi. OBJ 3: 'Budget head office.' -> Set up joint call with HQ team."],
          ["Deal Velocity Target", "90–120 days. IT architecture review (UAE data residency) is the biggest blocker — involve local SI early."],
          ["Win Condition", "Community Manager/VP Ops champion + IT clearance (Residency) + Finance (VAT) + Asset Management (DLD). UAE-based reference deployment often required."],
        ],
      },
      marketingChannels: {
        title: "COMPONENT 2 — MARKETING CHANNELS",
        columns: ["Channel", "Tactic", "Expected Output", "Budget / Timeline"],
        rows: [
          ["Events", "Cityscape Global, Saudi RE Expo, GITEX. Stand + speaking on brand building.", "15–25 qualified meetings/event; 3–5 proposals in 60 days", "AED 80K–150K per major event"],
          ["LinkedIn (Bilingual)", "English for C-suite, Arabic for ops. Target UAE/Saudi roles. Sponsored posts on RERA/Experience.", "100–200 ICP profile views/month; 10–15 connections converting at 20%", "AED 15K–25K/month"],
          ["Local UAE SI Partner", "Partner with Emitac, Avertra, Mindware. Co-sell hardware (ANPR/CCTV) + software.", "4–8 qualified referrals/quarter; faster IT approval", "Revenue share 15%"],
          ["UAE PropTech Media", "Arabian Business, The National. Press releases on GCC deployment guest columns.", "Brand credibility; 1–2 media features/quarter", "AED 20K–30K/month"],
          ["WhatsApp Business", "Targeted campaigns to RICS GCC / AREIM lists. Short video demo + appointment booking.", "5–10% response rate on qualified lists", "AED 5K–8K/month"],
        ],
      },
      launchSequence: {
        title: "COMPONENT 3 — 90-DAY LAUNCH SEQUENCE",
        columns: ["Week", "Sales Action", "Marketing Action", "Product Milestone", "Success Metric"],
        rows: [
          ["Wk 1–2", "Warm intros via India developer HQ. Map 20 accounts. Contact 2–3 UAE SIs.", "Register for Cityscape. GCC framing for case studies. UAE LinkedIn campaign.", "Arabic UI beta live. UAE VAT config ready in demo.", "3 introductions. 2 SI conversations. LinkedIn impressions > 5,000."],
          ["Wk 3–4", "5 first meetings. Discovery. Qualify for full demo. Identify IT lead.", "Publish 'RERA Compliance' article. LinkedIn InMail sequence (50).", "GCC demo environment ready. IT architecture deck finalised.", "5 meetings held. 2 qualified for demo. 1 SI MOU."],
          ["Wk 5–6", "Full-stakeholder demos. Proactive IT architecture documentation submission. Commercial proposal in AED.", "Cityscape Global — stand + networking. WhatsApp follow-up.", "RERA compliance checklist feature live. UAE bank/ENBD gateway ready.", "2 proposals sent in AED. 8–10 event leads. 1 IT review initiated."],
          ["Wk 7–8", "Proposal follow-up. Facilitate IT Architecture call (CTO-IT Head). Negotiate. Signed contract.", "First GCC LinkedIn case study post. Arabian Business PR outreach.", "GCC data residency configuration tested (UAE cloud server).", "1 signed contract. 3 IT reviews in progress. 1 media feature."],
          ["Wk 9–12", "Deploy first GCC community (45-day activation). Invite 3 peer developers to GCC PropTech Roundtable.", "Monthly LinkedIn content: 'GCC Community Management 2025'. Saudi outreach.", "Go-live with first GCC client. full Arabic UI live. GCC onboarding playbook.", "First client live. 2 Saudi accounts in pipeline. 3 demo requests."],
        ],
      },
      partnershipStrategy: {
        title: "COMPONENT 4 — PARTNERSHIP STRATEGY",
        columns: ["Partner Type", "What They Bring", "What We Offer", "Activation Approach", "Revenue Share Model"],
        rows: [
          ["UAE IT SIs (Emitac, Mindware)", "Relationships in UAE; hardware+software bundling; local procurement credibility", "Software licence resale rights; 15% margin; integration training; co-sell ANPR", "Approach at GITEX; joint pilot; 60-day trial", "15% reseller margin on first-year ACV"],
          ["GCC RE Consultancies (Savills, JLL MENA)", "Advise on FM and resident tech; trusted by asset managers/institutional landlords", "Advisory framework; referral fees; co-branded research report", "Executive briefing MENA; propose co-research on GCC tech gap", "8% of Year 1 ACV; co-branding"],
          ["Indian Developer Groups in GCC", "Trust in India accelerates UAE trust; same IT framework; portfolio expansion", "Priority support; India-GCC unified contract/pricing; joint case study", "Leverage India relationship: CXO intro. Unified India+GCC story.", "Expansion pricing: 20% discount on GCC ACV"],
          ["UAE PropTech Ecosystem (Hub71, NEOM)", "Credibility signal; government-backed projects; media/event amplification", "Integration with smart city; PropTech showcase; innovation credentials", "Apply to Hub71 cohort. Register for Dubai Future Accelerators.", "Equity-free support; anonymised data sharing exchange"],
        ],
      },
      summary: {
        motion: "Enter GCC via warm intros from India clients → lead with RERA compliance and data sovereignty (unlocks IT/Legal) → establish reference deployment within 90 days → unlock Saudi Arabia. Cityscape/GITEX for meetings; LinkedIn for nurture.",
        assumption: "Arabic UI live within 60 days. If late, GCC sales motion stalls.",
        metric: "Number of GCC communities live and activated.",
      },
    },
    {
      title: "TARGET GROUP 3 — UK BUILD-TO-RENT (BTR) OPERATORS (Greater London, Manchester, Birmingham, 200–5,000 Units)",
      salesMotion: {
        title: "COMPONENT 1 — SALES MOTION",
        columns: ["Sales Element", "Details"],
        rows: [
          ["ICP Definition", "UK BTR operator managing 200–5,000 units. Using Fixflo + Spike/Arthur as separate tools. GDPR DPO has security concerns. Institutionally owned (L&G, Greystar UK)."],
          ["Lead Source", "1. British Property Federation (BPF) BTR committee. 2. UKAA Trade Body. 3. LinkedIn targeting (Head of CX/Ops). 4. Fixflo dissatisfaction signals. 5. UK PropTech media content."],
          ["Outreach Approach", "Lead with GDPR compliance ('Is data on US servers?') + consolidation ('Pay one platform instead of 3') + ESG reporting (sustainability dashboard)."],
          ["First Meeting Agenda", "10 min: GDPR framing and DPO concerns. 10 min: Consolidation pitch (cost comparison). 10 min: Demo resident app (Maintenance+Community+Billing). 10 min: Discovery. 5 min: Next steps."],
          ["Objection Handling", "OBJ 1: 'Locked in Fixflo.' -> Implementation takes 8 weeks; go-live when contract expires. OBJ 2: 'Indian company.' -> Data on UK servers; UK-hours support; UK CS contact. OBJ 3: 'Residents used to Fixflo.' -> switch to one white-label app for everything; migration guide provided."],
          ["Deal Velocity Target", "90–120 days. Propose 90-day paid pilot (1 building) first to reduce friction. Pilot converts at 70%+ if CS is strong."],
          ["Win Condition", "Head of CX/Ops champion + DPO clearance (GDPR) + CFO approval (consolidation) + IT confirmation (UK server deployment)."],
        ],
      },
      marketingChannels: {
        title: "COMPONENT 2 — MARKETING CHANNELS",
        columns: ["Channel", "Tactic", "Expected Output", "Budget / Timeline"],
        rows: [
          ["UK BTR Events", "UKAA Conference, BPF BTR Summit. speaking on GDPR-compliant resident tech.", "10–20 qualified meetings/event; highest-quality leads", "£8,000–20,000 per major event"],
          ["UK Media + SEO", "Guest articles in Property Week: 'True cost of GDPR non-compliance'. Keywords: 'BTR resident app UK', 'GDPR compliant property app'.", "50–150 organic visits/month; 3–5 inbound demo requests/month", "£2,000–3,000/month"],
          ["LinkedIn (UK-targeted)", "Thought leadership by UK lead: GDPR, Retention, Consolidation. InMail to Ops/Property Manager/DPO.", "50–100 UK BTR engagements/month; 5–10 demo requests/month", "£3,000–5,000/month"],
          ["BPF / UKAA Member", "Recommended resource listing. Co-author 'BTR Technology Benchmark Report 2025' with UKAA.", "Access to 200+ members; 10–20 referrals from report", "£5,000–10,000 sponsorship cost"],
          ["UK SI Partners", "Partner with UK FM software implementers (Savills UK, JLL Residential).", "2–5 referrals/quarter; shortens sales cycle", "10% referral fee"],
        ],
      },
      launchSequence: {
        title: "COMPONENT 3 — 90-DAY LAUNCH SEQUENCE",
        columns: ["Week", "Sales Action", "Marketing Action", "Product Milestone", "Success Metric"],
        rows: [
          ["Wk 1–2", "Hire/appoint UK-based CS/Sales contact. Map 30 accounts. Research Fixflo renewals.", "Publish 'GDPR + BTR PropTech' article. Register for UKAA. LinkedIn campaign.", "UK data residency docs ready. Faster Payments scoped. UK date/currency formatting live.", "30 accounts mapped. 1 article. LinkedIn impressions > 3,000."],
          ["Wk 3–4", "5 first meetings. Discovery. Qualify (Renewals/GDPR). Identify DPO.", "BPF PropTech intro. Pitch co-authorship of Benchmark Report. LinkedIn InMail (50).", "UK-branded demo env live. Fixflo migration guide drafted. GDPR DPA ready.", "5 meetings held. 2 qualified for full demo. BPF intro confirmed."],
          ["Wk 5–6", "Full-stakeholder demo. Submit GDPR DPA proactively. Propose 90-day paid pilot.", "UKAA Annual Conference stand/presentation. WhatsApp follow-up.", "UK pilot pricing agreed. UK server deployment deck finalised. Section 20 guide ready.", "2 pilot proposals sent. 10–15 event leads. 1 DPO review initiated."],
          ["Wk 7–8", "Close first UK pilot. Negotiate scope (Success criteria). Onboard DPO via Architecture review.", "Benchmark Report submitted to UKAA. LinkedIn case study: 'Rethink PropTech stack'.", "UK pilot env provisioned (AWS London). UK BTR onboarding playbook ready.", "1 UK pilot signed. 2 additional proposals. BTR Report distributed."],
          ["Wk 9–12", "Execute UK pilot (Weekly check-ins). Track KPIs (Activation %). Prep case study data.", "UK media outreach: 'First BTR operator deploys GDPR-compliant app' press release.", "Pilot go-live. Activation dashboard live. Weekly health report auto-generated.", "Resident activation > 60%. 2 additional accounts in pipeline. 1 media feature."],
        ],
      },
      partnershipStrategy: {
        title: "COMPONENT 4 — PARTNERSHIP STRATEGY",
        columns: ["Partner Type", "What They Bring", "What We Offer", "Activation Approach", "Revenue Share Model"],
        rows: [
          ["UK Property Management (Savills, JLL)", "Institutional client advice; trusted advisor Status; residential portfolio management", "Referral fees; co-branded ResidentialTech assessment; recommended tool list", "Executive briefing UK; joint pilot at shared client", "10% of Year 1 ACV"],
          ["Fixflo Dissatisfied Customers", "Customers looking for alternatives (G2/LinkedIn); proven budget and intent", "Migration support package; 3-month transition pricing; parallel running", "Monitor dissatisfaction signals; target with UK-specific migration ads", "No fee; direct displacement"],
          ["UKAA / BPF", "400+ BTR member organisations; research publication credibility", "Association sponsorship; speaking slots; co-authored research; member discounts", "Sponsorship pitch to CEO; co-author 'BTR Technology Benchmark 2025'", "£10,000–20,000 annual sponsorship; 10% discount for members"],
          ["UK Cloud Providers (AWS/Azure UK)", "UK data residency centres; co-sell and marketplace listing", "Marketplace listing; co-sell motion via enterprise teams", "Register for ISV Accelerator; apply for Marketplace listing", "No fee; co-sell leads; joint marketing"],
        ],
      },
      summary: {
        motion: "Lead with GDPR + consolidation → propose 90-day paid pilot → use UKAA as access channel → close pilot-to-contract at 70%+. Local UK presence (even part-time) is required.",
        assumption: "UK data hosting provisioned within 4 weeks of contract. window closes if late.",
        metric: "Pilot-to-full-portfolio conversion rate.",
      },
    },
  ],
};

const PostPossessionGTMTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins">
      {/* Header */}
      <div className="bg-[#1f3864] text-white p-4 rounded-t-xl shadow-sm">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — GTM Strategy
        </h2>
      </div>

      <div className="space-y-16 mt-8">
        {postPossessionGTM.targetGroups.map((tg, idx) => {
          const isIndia = tg.title.includes("INDIAN");
          const isGCC = tg.title.includes("GCC");
          
          const groupColor = isIndia 
            ? "border-l-[#1a237e]" 
            : isGCC 
              ? "border-l-[#1b5e20]" 
              : "border-l-[#b71c1c]";

          const groupHeaderBg = isIndia 
            ? "bg-[#1a237e]" 
            : isGCC 
              ? "bg-[#1b5e20]" 
              : "bg-[#b71c1c]";

          return (
            <div key={idx} className={`border-l-4 ${groupColor} bg-white rounded-r-xl shadow-sm overflow-hidden`}>
              <div className={`${groupHeaderBg} text-white px-6 py-4`}>
                <h3 className="text-lg font-bold tracking-wide uppercase">{tg.title}</h3>
              </div>

              <div className="p-6 space-y-10">
                {/* Sales Motion */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {tg.salesMotion.title}
                  </h4>
                  <div className="overflow-hidden border border-gray-100 rounded-lg">
                    <table className="w-full text-[12px] leading-relaxed">
                      <thead>
                        <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[10px] border-b border-gray-100 italic">
                          <th className="p-3 text-left border-r border-[#D3D1C7] w-[20%]">Sales Element</th>
                          <th className="p-3 text-left w-[80%]">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tg.salesMotion.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="w-[20%] p-3 font-bold text-gray-700 border-r border-gray-100 bg-[#f8f9fa]">{row[0]}</td>
                            <td className="w-[80%] p-3 text-gray-600 whitespace-pre-line">{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Marketing Channels */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {tg.marketingChannels.title}
                  </h4>
                  <div className="overflow-hidden border border-gray-100 rounded-lg">
                    <table className="w-full text-[12px] leading-relaxed">
                      <thead>
                        <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[10px] border-b border-gray-100">
                          {tg.marketingChannels.columns.map((col, cIdx) => (
                            <th key={cIdx} className="p-3 text-left border-r border-gray-100 last:border-0">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tg.marketingChannels.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-gray-100 last:border-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-3 text-gray-600 border-r border-gray-100 last:border-0 ${cIdx === 0 ? "font-bold text-gray-700" : ""}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 90-Day Sequence */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    {tg.launchSequence.title}
                  </h4>
                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-[11px] leading-relaxed min-w-[800px]">
                      <thead>
                        <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-gray-100 italic">
                          {tg.launchSequence.columns.map((col, cIdx) => (
                            <th key={cIdx} className="p-2 text-left border-r border-[#D3D1C7] last:border-0">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tg.launchSequence.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-gray-100 last:border-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-2 text-gray-600 border-r border-gray-100 last:border-0 ${cIdx === 0 ? "font-bold text-gray-700" : ""}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Partnership Strategy */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    {tg.partnershipStrategy.title}
                  </h4>
                  <div className="overflow-hidden border border-gray-100 rounded-lg">
                    <table className="w-full text-[11px] leading-relaxed">
                      <thead>
                        <tr className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-gray-100 italic">
                          {tg.partnershipStrategy.columns.map((col, cIdx) => (
                            <th key={cIdx} className="p-2 text-left border-r border-[#D3D1C7] last:border-0">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tg.partnershipStrategy.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-gray-100 last:border-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-2 text-gray-600 border-r border-gray-100 last:border-0 ${cIdx === 0 ? "font-bold text-gray-700" : ""}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-2">The Complete Motion</h5>
                      <p className="text-[12px] text-gray-700 font-medium leading-relaxed">{tg.summary.motion}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-2">Key Assumption</h5>
                      <p className="text-[12px] text-gray-700 font-medium leading-relaxed italic">{tg.summary.assumption}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-2">North Star Metric</h5>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 inline-block">
                      <p className="text-[13px] font-bold text-gray-800">{tg.summary.metric}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Note */}
      <div className="bg-white border border-[#D3D1C7] rounded-xl p-4 shadow-sm border-l-4 border-l-[#DA7756]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#DA7756] mb-2">GTM Execution Note</h4>
        <p className="text-[11px] text-[#666] leading-relaxed italic">
          The GTM strategy prioritises Indian Enterprise sales to build a reference base for GCC entry in Year 2. 
          UK BTR is a strategic priority due to GDPR compliance tailwinds. 
          All motions lead with ROI quantification (Referral Revenue) rather than operational features to accelerate procurement.
        </p>
      </div>
    </div>
  );
};

export default PostPossessionGTMTab;
