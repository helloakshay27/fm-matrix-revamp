import React from "react";

const postPossessionBusinessPlan = {
  planQuestions: [
    {
      id: "Q1",
      question: "Why does your company exist? What impact are you here to make?",
      answer: "We exist because the relationship between a real estate developer and their homebuyer shouldn't end the moment keys are handed over. For decades, possession was the full stop in the developer–buyer journey — after that, residents were on their own, and developers lost every opportunity to stay relevant in their lives.\n\nPost Possession exists to change that. We built a platform that turns the post-handover period into the most valuable phase of the customer relationship — for both sides. Residents get a single app that manages their home, their community, and their daily life. Developers get a living channel to engage, delight, earn referrals, and build loyalty with every buyer they've ever sold to.\n\nOur deeper impact: we are making India's — and the world's — residential communities safer, more organised, and more connected, while simultaneously making developers more profitable and more trusted as long-term brands in their customers' lives.",
      source: "Tab 1 (Product Summary): What it is, Problem it solves, Key USPs",
      flag: "Ready to use as-is",
      colorContext: "orange",
    },
    {
      id: "Q2",
      question: "What 4–5 values or behaviours best represent your team or culture?",
      answer: "1. RESIDENT FIRST — Every decision starts with one question: does this make a resident's daily life better? If a feature doesn't reduce friction, improve safety, or create delight for the person living in the community, it doesn't belong in the product.\n\n2. DATA SOVEREIGNTY — We believe your data belongs to you, not us. We built our entire architecture around this principle. Client data lives on client servers. We will never compromise this, regardless of commercial pressure.\n\n3. OPERATIONALLY OBSESSED — We don't build features for demos. We build features that actually get used in the field — by guards in underground parking, FM managers in sweltering plant rooms, and residents at 11pm when a pipe bursts. If it doesn't work in the real world, it's not done.\n\n4. LONG-TERM THINKING — We optimise for decade-long client relationships, not annual contract renewals. Our pricing, product decisions, and support model reflect the belief that a developer who trusts us with one project will eventually trust us with all of them.\n\n5. BUILDER'S HONESTY — We tell clients what the product can and can't do today. We don't oversell. We show our roadmap, our gaps, and our plan. This culture of honesty is why Godrej Properties and Piramal Realty are still with us after 5+ years.",
      source: "Inferred from product architecture and market positioning",
      flag: "Requires Founder Review",
      colorContext: "yellow",
    },
    {
      id: "Q3",
      question: "What are the USPs that make you stand out from competitors?",
      answer: "We have five hard-to-replicate advantages:\n\n1. WHITE-LABEL + DATA SOVEREIGNTY — We are the only platform where the app carries the developer's brand AND all resident data lives exclusively on the developer's own servers. No competitor offers both. This is a structural moat, not a feature.\n\n2. THE ONLY FULL POST-POSSESSION LIFECYCLE PLATFORM — We don't just manage a community. We connect daily living (security, helpdesk, billing) to developer commercial goals (referral, loyalty, new project marketing). Every other platform stops at operations. We go further.\n\n3. ENTERPRISE FM DEPTH AT COMMUNITY PRICING — Our FM module (5-layer escalation, PPM checklists with QR/NFC dual control, CAPA, permit-to-work, vendor evaluation) matches standalone FM tools. Bundled with security and community, there's no equivalent anywhere at this price point.\n\n4. PROVEN AT SCALE WITH INDIA'S TOP DEVELOPERS — 5+ years in production with Godrej Properties, Piramal Realty, Runwal Enterprises, and Panchshil. This isn't a pilot. This is a live system managing hundreds of thousands of residents.\n\n5. MEASURABLE ROI — We reduce channel partner acquisition costs by ~50% through our referral engine and reduce helpdesk support overhead by ~20% through automation. We don't just reduce costs — we generate revenue for developers.",
      source: "Tab 1 (Key USPs), Tab 5A (Competitive Position), Tab 4B (Competitor Mapping)",
      flag: "Ready to use (Verify ROI %)",
      colorContext: "teal",
    },
    {
      id: "Q4",
      question: "What bold outcome do you want to achieve in the next 10–15 years? (BHAG)",
      answer: "In 10–15 years, Post Possession will be the operating system for every residential community on earth.\n\nEvery developer who delivers a home — whether in Mumbai, Dubai, London, or Singapore — will use our platform to manage that community, engage their residents, and grow their brand. Every resident in a managed community will live their daily life through an app that their developer built, on a platform we power.\n\nWe will have processed more than 100 million resident interactions, enabled more than 10 million referral transactions worth ₹50,000+ crore in property sales, and made facility management AI-driven and proactive across 5 million+ homes.\n\nOur data sovereignty architecture will have set the global standard for how PropTech platforms handle community data — inspiring regulatory frameworks in India, GCC, UK, and Southeast Asia.\n\nThe BHAG in one sentence: We will be to residential communities what Shopify is to e-commerce — the invisible but indispensable infrastructure that powers the experience.",
      source: "Tab 4A (Target Audience), Tab 7 (Medium-Term Roadmap), Tab 6 (Opportunities)",
      flag: "Requires Founder Calibration",
      colorContext: "purple",
    },
    {
      id: "Q5",
      question: "What do you want to achieve in the next 3–5 years? (Revenue, territories, scale)",
      answer: "Over the next 3–5 years, we have four clear growth objectives:\n\n1. REVENUE — Reach ₹100 Cr ARR (approximately $12M) by Year 3, scaling to ₹300 Cr ARR ($35M) by Year 5.\n\n2. COMMUNITY SCALE — Manage 2,500+ active communities covering 500,000+ units across India and international markets by Year 5. Current India base provides the foundation; international communities at premium price points drive margin expansion.\n\n3. TERRITORY — Active operations in 4 regions by Year 3: India (primary), GCC (UAE + Saudi Arabia), Southeast Asia (Singapore + Malaysia), UK. Each region supported by a local team and at least 3 reference client deployments.\n\n4. PRODUCT MILESTONES — Ship AI-powered FM Copilot, Developer Revenue Intelligence Platform, multi-language support (Arabic, Bahasa, French), and open integration marketplace — all within 18 months.\n\n5. DEVELOPER REFERRAL IMPACT — Process ₹5,000 Cr+ in referral-attributed property transactions through the platform by Year 5, demonstrating the platform's direct commercial ROI.",
      source: "Market analysis and projected capacity",
      flag: "Requires Founder Verification",
      colorContext: "orange",
    },
    {
      id: "Q6",
      question: "What are your main business goals for this financial year?",
      answer: "Our five business goals for this financial year:\n\n1. ENTERPRISE SALES — Sign 10 new enterprise developer agreements (3,000+ units each) in India, adding ₹15–20 Cr in new ARR. Target: Lodha, Brigade, Prestige, Oberoi Realty, Mahindra Lifespaces.\n\n2. GCC LAUNCH — Deploy first 3 live communities in UAE (Dubai/Abu Dhabi) by Q3. Establish one reference deployment with a GCC developer for case study development.\n\n3. STOP LOSING DEALS — Complete UI/UX overhaul, publish Arabic language support, and release public API documentation by Q2. Fixing these three items directly addresses the top reasons we lose international deals.\n\n4. PROVE THE ROI STORY — Publish 2 full case studies with quantified outcomes (Godrej and/or Piramal) by Q1. Build and deploy ROI calculator on website.\n\n5. RETENTION & EXPANSION — Achieve 110%+ net revenue retention by expanding module adoption (referral/loyalty module activation in communities currently using only FM/security). Every existing developer should use at least 5 of the 8 core module groups by year end.",
      source: "Tab 5C (GTM Motion), Tab 7 (Roadmap), Tab 6 (Weaknesses)",
      flag: "Requires Founder Review",
      colorContext: "red",
    },
    {
      id: "Q7",
      question: "Which customer segments or geographies will you focus on this year?",
      answer: "We are focused on three segments in strict priority order:\n\nPRIORITY 1 — LARGE INDIAN RESIDENTIAL DEVELOPERS (India, Tier-1 cities)\nMumbai, Bengaluru, Pune, Delhi-NCR, Hyderabad. Every new logo adds to a reference base that accelerates the next sale. Referral ROI resonates most here as CP costs are highest.\n\nPRIORITY 2 — GCC DEVELOPERS & PROPERTY MANAGERS (UAE, Saudi Arabia)\nNo credible white-label + data-sovereign community platform exists in GCC. RERA UAE compliance demands are creating urgent need for digital maintenance records.\n\nPRIORITY 3 — UK BUILD-TO-RENT OPERATORS (UK, Greater London + Manchester)\nGDPR compliance pressure eliminates US competitors. BTR sector doubling by 2030 means operators are actively evaluating platforms NOW.\n\nNOT THIS YEAR: US market (requires localisation investment not yet complete), SE Asia (prioritised for Year 2), RWA self-managed communities (wrong price point).",
      source: "Tab 5C (Segments to Prioritise), Tab 4A (Target Audience), Tab 3A (Industries)",
      flag: "Ready to use as-is",
      colorContext: "teal",
    },
    {
      id: "Q8",
      question: "What 3 key actions or projects will help you achieve this year's goals?",
      answer: "ACTION 1 — THE ROI MACHINE (Q1–Q2 priority): (a) Two published case studies with quantified outcomes. (b) Interactive ROI calculator on website. (c) Internal sales playbook mapping numbers to personas. Selling outcomes, not features, will shorten sales cycles by an estimated 30–40%.\n\nACTION 2 — STOP LOSING INTERNATIONAL DEALS (Q1–Q2 priority): (a) UI/UX overhaul of resident app and admin console. (b) Arabic + Bahasa multilingual support. (c) Public API documentation and integration catalogue. These fixes unlock existing GCC and UK pipeline.\n\nACTION 3 — REFERRAL ENGINE ACTIVATION AT EXISTING CLIENTS (Q2–Q4 priority): (a) Launch formal referral payout automation (UPI direct credit). (b) Resident referral activation campaign playbook for developer CRM teams. (c) Referral dashboard for developer sales teams. Activating our installed base costs near-zero in sales effort.",
      source: "Tab 7 (Roadmap), Tab 5D (Value Proposition)",
      flag: "Validate timelines (Q1-Q4)",
      colorContext: "green",
    },
    {
      id: "Q9",
      question: "What are the key numbers / metrics you should regularly track?",
      answer: "NORTH STAR METRIC: Referral Transactions Processed (₹ crore of property value attributed annually).\n\nCOMMERCIAL METRICS: ARR/MRR (net new), Net Revenue Retention (target 110%+), ACV (increase as adoption deepens), Sales Cycle Length (<90 days).\n\nENGAGEMENT METRICS: Monthly Active Communities (>50% resident DAU), Ticket Resolution SLA (>85%), CAM Collection Rate, Feature Adoption Breadth (>5/8 module groups).\n\nOPERATIONAL METRICS: Implementation Time (<45 days), Support Ticket Volume per Community (declining), Churn Rate (<5% annually).",
      source: "Tab 11 (Metrics), Tab 5B (Performance Pricing)",
      flag: "Requires Founder Calibration",
      colorContext: "orange",
    },
    {
      id: "Q10",
      question: "What improvements do you need in your people or processes to succeed?",
      answer: "We need five structural improvements:\n\n1. ENTERPRISE SALES HUNTERS — 2–3 senior executives to own ₹3–8 Cr ACV deals and navigate multiple developer stakeholders. Reduces dependence on founder-led sales.\n\n2. CUSTOMER SUCCESS & ENABLEMENT — Team of 3–5 people to own 90-day activation playbooks and developer CRM team training. #1 churn-prevention requirement.\n\n3. INTERNATIONAL REGIONAL LEADS — One lead each for GCC (Dubai) and UK (London) to own local partnerships and reference customer development.\n\n4. AI/ML PRODUCT TEAM — 3–5 dedicated people to build ticket classification, predictive maintenance, and conversational BI. Essential for long-term competitiveness.\n\n5. PRODUCT MARKETING — Function to own case studies, ROI calculator, and persona-specific pitch decks. Reduces sales cycle length and improves demo conversions.",
      source: "Tab 6 (Weaknesses), Tab 7 (Roadmap), Tab 10 (GTM Motion)",
      flag: "Validate Headcounts",
      colorContext: "purple",
    },
  ],
  founderChecklist: [
    { id: "Q1", item: "Personalize 'Why we exist'", verify: "Personalise with your founding story if sharing at investor events; current answer is product-derived.", status: "Pending" },
    { id: "Q2", item: "Verify Culture Values", verify: "Verify these 5 values authentically match your team's lived culture. Replace as needed.", status: "Pending" },
    { id: "Q3", item: "Validate ROI figures", verify: "Validate '50% CP cost' and '20% support cost reduction' against actual client data before publishing.", status: "Pending" },
    { id: "Q4", item: "Calibrate BHAG targets", verify: "The numerical targets (100M interactions, etc.) are illustrative. Replace with your calibrated long-term vision.", status: "Pending" },
    { id: "Q5", item: "Calibrate ARR targets", verify: "Calibrate ₹100-300 Cr ARR targets against your current MRR growth rate and capacity.", status: "Pending" },
    { id: "Q6", item: "Verify Target Accounts", verify: "Verify the named accounts (Lodha, Brigade, etc.) are in your current pipeline. Replace with actual top-10 list.", status: "Pending" },
    { id: "Q7", item: "Confirm UK Priority", verify: "Confirm whether UK BTR is a genuine Year 1 priority based on current team capacity.", status: "Pending" },
    { id: "Q8", item: "Validate Timelines", verify: "Validate the quarterly timelines (Q1-Q4) against your current engineering sprint capacity.", status: "Pending" },
    { id: "Q9", item: "Calibrate Metrics", verify: "These are industry benchmarks. Replace with your actual current baselines once available.", status: "Pending" },
    { id: "Q10", item: "Validate Headcounts", verify: "The recommended headcounts (sales, CS, AI/ML, PM) must be validated against hiring budget.", status: "Pending" },
  ],
};

const PostPossessionBusinessPlanTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins">
      {/* Header */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — Business Plan Builder
        </h2>
      </div>

      <div className="space-y-8 mt-8">
        {postPossessionBusinessPlan.planQuestions.map((q, i) => {
          const headerTone =
            q.colorContext === "red"
              ? "bg-[#A52A1A]"
              : q.colorContext === "green"
                ? "bg-[#0F5B2A]"
                : q.colorContext === "yellow"
                  ? "bg-[#B79000]"
                  : q.colorContext === "orange"
                    ? "bg-[#D97706]"
                    : q.colorContext === "purple"
                      ? "bg-[#6B2D84]"
                      : q.colorContext === "teal"
                        ? "bg-[#006B5E]"
                        : "bg-[#DA7756]";

          return (
            <div key={i} className="border border-[#D3D1C7] bg-white rounded-lg overflow-hidden shadow-sm">
              <div className={`${headerTone} text-white px-4 py-3 text-[14px] font-semibold tracking-wide flex justify-between items-center`}>
                <span>{q.id}. {q.question}</span>
              </div>
              <table className="w-full border-collapse table-fixed text-[13px] leading-relaxed">
                <thead>
                  <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[10px]">
                    <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[60%]">Founder's Suggested Answer</th>
                    <th className="border border-[#D3D1C7] px-4 py-2 text-left w-[20%]">Source / Context</th>
                    <th className="border border-[#D3D1C7] px-4 py-2 text-center w-[20%]">Review Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top bg-white">
                    <td className="border border-[#D3D1C7] px-4 py-4 text-[#2C2C2C] font-medium whitespace-pre-line break-words leading-relaxed">
                      {q.answer}
                    </td>
                    <td className="border border-[#D3D1C7] px-4 py-4 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words italic text-[11px]">
                      {q.source}
                    </td>
                    <td className="border border-[#D3D1C7] px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-sm font-bold text-[9px] uppercase tracking-wider ${q.flag.includes("Ready") ? "bg-green-100 text-green-700 border border-green-200" : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}>
                        {q.flag}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Founder Review Checklist section */}
        <div className="mt-12 border border-[#D3D1C7] bg-white rounded-xl overflow-hidden shadow-md">
          <div className="bg-[#DA7756] text-white px-4 py-4 text-[15px] font-bold tracking-widest uppercase text-center border-b border-[#D3D1C7]">
            Founder Review Checklist
          </div>
          <div className="bg-[#fff2cc] px-4 py-2 text-[11px] text-[#444] font-semibold italic text-center border-b border-[#D3D1C7]">
            Items requiring personal verification before using in a business plan or investor pitch
          </div>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#F6F4EE] text-[#1a1a2e] font-bold uppercase text-[10px]">
                <th className="border border-[#D3D1C7] px-4 py-3 text-center w-[8%]">[ ]</th>
                <th className="border border-[#D3D1C7] px-4 py-3 text-left w-[12%]">Ref</th>
                <th className="border border-[#D3D1C7] px-4 py-3 text-left w-[30%]">Checklist Item</th>
                <th className="border border-[#D3D1C7] px-4 py-3 text-left w-[50%]">Verification Required</th>
              </tr>
            </thead>
            <tbody>
              {postPossessionBusinessPlan.founderChecklist.map((item, idx) => (
                <tr key={idx} className="align-top bg-white border-b border-[#D3D1C7] last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="border border-[#D3D1C7] px-4 py-3 text-center font-bold text-gray-300 text-xl">□</td>
                  <td className="border border-[#D3D1C7] px-4 py-3 font-bold text-[#DA7756]">{item.id}</td>
                  <td className="border border-[#D3D1C7] px-4 py-3 font-semibold text-[#2c2c2c]">{item.item}</td>
                  <td className="border border-[#D3D1C7] px-4 py-3 text-[#555] italic leading-relaxed">{item.verify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Footer */}
      <div className="bg-white border border-[#D3D1C7] rounded-xl p-4 shadow-sm border-l-4 border-l-[#DA7756]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#DA7756] mb-2">Internal Use Only</h4>
        <p className="text-[11px] text-[#666] leading-relaxed italic">
          This business plan builder is a work-in-progress internal tool for the founding team.
          The suggested answers are pre-filled based on current product capabilities and market gaps.
          Please complete the Founder Review Checklist above before using these answers in external conversations.
        </p>
      </div>
    </div>
  );
};

export default PostPossessionBusinessPlanTab;

