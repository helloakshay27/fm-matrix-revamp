import React from "react";

type PlanQuestion = {
  id: string;
  question: string;
  answer: string;
  source: string;
  review: string;
};

type ChecklistItem = {
  checkbox: string;
  question: string;
  verify: string;
};

const businessPlanMeta = {
  title: "Business Plan Builder",
  subtitle:
    "Pre-filled answers to all 10 business plan questions, written in first-person as the founder, grounded in data from Tabs 1-6. India primary, Global secondary.",
};

const planQuestions: PlanQuestion[] = [
  {
    id: "Q1",
    question: "Why does your company exist? What impact are you here to make?",
    answer:
      "We exist because the relationship between a developer and a homebuyer should not end on possession day. In India today, over 4.2 million apartment units delivered in the last five years have no structured digital channel between the developer who built the home and the resident who lives in it. Resident data is held by third-party platforms the developer does not own or control. Under the DPDP Act 2023, the developer is legally the data fiduciary - but they have zero visibility into how that data is used. We are here to fix that. We give real estate developers a fully branded, data-sovereign platform that keeps them connected to residents for the entire lifetime of the property - not just during the sales cycle.",
    source: "Tab 1: Product Summary - Core Mission and The Problem It Solves",
    review:
      "Ready to use as-is. Personalise with founder origin story if available.",
  },
  {
    id: "Q2",
    question:
      "What 4-5 values or behaviours best represent your team or culture?",
    answer:
      "1. Data sovereignty first: We believe that the developer, not us, should own every byte of resident data. This shapes every architectural decision we make. 2. Build for the FM team, not just the resident: Our platform works for the person who manages the building, not just the person who lives in it. 3. Replace tools, not add them: Every feature we build must replace a disconnected tool, not add another one. 3. Earn trust with evidence, not claims: We do not use vague claims like 'trusted by thousands'. We connect every prospect with a deployed client reference before asking for a signature. 4. India-first, globally relevant: We build for Indian gated community norms, Indian billing compliance, and Indian security workflows - not adapted global products.",
    source:
      "Tab 2: Feature List philosophy, Tab 4: Positioning - What we should stop saying",
    review:
      "Requires founder input - verify that these 5 values reflect actual team culture and founder beliefs before using in investor presentations.",
  },
  {
    id: "Q3",
    question: "What are the USPs that make you stand out from competitors?",
    answer:
      "We have three absolute moats that no competitor can replicate without rebuilding their architecture. First, data sovereignty: every byte of resident data is stored on the client's own servers. MyGate, ApnaComplex, and NoBrokerHood all store data on their own servers - making every developer who uses them legally exposed under the DPDP Act 2023. Second, white-label delivery: our app carries the developer's brand, not ours. No India competitor offers genuine white-label at equivalent feature depth. Third, end-to-end coverage: we cover gate management, visitor management, CAM billing with full accounting, helpdesk with SLA tracking, club booking, concierge services, asset management, permit-to-work, compliance tracking, and community communication in one integrated platform. Replacing all of this requires 6-10 separate tools from any competitor.",
    source:
      "Tab 4: Features and Pricing - AHEAD items; Tab 2: USP features marked with star",
    review:
      "Ready to use as-is. Add 1-2 specific client proof points when available for investor presentations.",
  },
  {
    id: "Q4",
    question:
      "What bold outcome do you want to achieve in the next 10-15 years? (BHAG)",
    answer:
      "In 10-15 years, every apartment unit delivered in India - and in every market where India's data sovereignty expectations have set the global standard - will have been lived in within a platform where the developer controls the data, the brand, and the resident relationship. Post Possession will be the infrastructure layer of the Indian residential experience: the way every Indian homebuyer interacts with their community, pays their bills, manages their security, and refers their next home purchase. We will have made the post-possession engagement gap a historical problem - not a current one.",
    source:
      "Tab 1: The investor and partner case; Tab 6: Phase 3 roadmap - Global Edition",
    review:
      "Requires founder input - verify that this BHAG reflects the founder's personal ambition and company vision. Adjust scale and geography specifics if needed.",
  },
  {
    id: "Q5",
    question:
      "What do you want to achieve in the next 3-5 years? (revenue, territories, scale)",
    answer:
      "In 3 years, we will have Post Possession deployed in 500,000+ apartment units across India's top 10 residential markets - Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Delhi NCR, Ahmedabad, Kolkata, Jaipur, and Kochi. By Year 5, we will have expanded into UAE and UK with PDPL and GDPR-compliant editions serving Indian developer groups with cross-border portfolios. Revenue target: INR 50-75 crore ARR at Year 3, INR 150-200 crore ARR at Year 5. By Year 5, Post Possession will be the mandatory post-possession platform standard in all CREDAI-registered enterprise developer RFPs.",
    source:
      "Tab 3: Market Analysis - Key markets; Tab 6: Phase 3 - Global Edition; Tab 9: Metrics",
    review:
      "Requires founder input - verify revenue targets against actual current MRR and realistic growth trajectory. Replace 500,000 unit figure with actual contracted units + pipeline if available.",
  },
  {
    id: "Q6",
    question: "What are your main business goals for this financial year?",
    answer:
      "Goal 1: Sign 10 enterprise developer contracts (each covering 500+ units) generating INR 3-6 crore in new ARR. Goal 2: Sign 3 IFM company channel partnerships that add 50,000+ units to platform reach within 12 months. Goal 3: Deliver Phase 1 roadmap - community health score dashboard, ANPR integration, and AI predictive maintenance alerting - to close the 3 primary deal-blocking gaps identified in current pipeline. Goal 4: Build a referenceable client base of 5 developers who will participate in case studies, conference presentations, and prospect reference calls. Goal 5: Launch in UAE with the first 2 cross-border Indian developer clients.",
    source:
      "Tab 6: Phase 1 Roadmap; Tab 8: GTM Strategy - 90-day goals; Tab 3: Competitor Summary",
    review:
      "Requires founder input - validate goal numbers against current pipeline and engineering capacity. Replace targets with board-approved FY figures if available.",
  },
  {
    id: "Q7",
    question:
      "Which customer segments or geographies will you focus on this year?",
    answer:
      "Primary segment: Enterprise real estate developers in Tier 1 India cities with active post-possession portfolios of 500+ units per project. Acquisition motion: DPDP Act compliance-led enterprise sales displacing MyGate. Target accounts: Top 100 CREDAI-registered residential developers with projects in Mumbai, Bengaluru, and Hyderabad. Secondary segment: IFM companies managing 10+ residential properties who can become resellers and deploy our platform across their entire client base in one enterprise agreement. Tertiary: RWAs in premium communities (1,000+ units) where committee members have corporate decision-making backgrounds and shorter procurement cycles.",
    source:
      "Tab 8: GTM Strategy - 3 Target Groups; Tab 3: Market Analysis - Target Audience segments",
    review:
      "Ready to use as-is. Personalise with 3-5 named target accounts from actual prospecting list.",
  },
  {
    id: "Q8",
    question:
      "What 3 key actions or projects will help you achieve this year goals?",
    answer:
      "Action 1: Deliver Phase 1 product roadmap (community health dashboard, ANPR integration, AI predictive maintenance) in Q1-Q2. These three features are blocking 40-60% of enterprise deals in current pipeline. Action 2: Hire 2-3 enterprise sales reps with developer or IFM sector relationships and deploy them at CREDAI and NAREDCO annual events in H1. The developer conference circuit is where enterprise post-possession deals are won. Action 3: Establish 3 IFM company partnerships (Jones Lang LaSalle India, CBRE India FM, Knight Frank India FM) as channel resellers with commission-based incentives for each property they deploy on our platform. IFM channel multiplies reach without proportional sales headcount increase.",
    source:
      "Tab 6: Phase 1 Roadmap; Tab 8: GTM Strategy - Sales Motion and Partnership Strategy",
    review:
      "Requires founder input - verify that named IFM companies are active in discussions. Adjust hiring plan based on actual budget and timeline.",
  },
  {
    id: "Q9",
    question:
      "What are the key numbers and metrics you should regularly track?",
    answer:
      "Monthly Active Residents per Deployed Community (MAR%) - North Star. Target: 65%+ by Day 90 post go-live. Platform health: Ticket SLA compliance rate (target 85%+), billing collection cycle (target under 7 days), visitor approval response time (target under 2 minutes). Business metrics: New ARR per quarter, units under contract, IFM channel partner-attributed units, referral leads generated per 1,000 residents per quarter. Quality metrics: Post-ticket resident CSAT score (target 4.0/5+), app store rating (target 4.2+), monthly churn rate (target under 1.5%). Deal metrics: Pipeline by stage (leads, demos, pilots, closed), average deal velocity by segment, top 3 deal-loss reasons by quarter.",
    source: "Tab 9: Metrics - North Star and Launch Tracking Metrics",
    review:
      "Ready to use as-is. Add internal financial metrics (burn rate, CAC, LTV) when presenting to investors.",
  },
  {
    id: "Q10",
    question:
      "What improvements do you need in your people or processes to succeed?",
    answer:
      "People: We need 2-3 enterprise sales reps with developer or IFM sector relationships. Current team strength is product and implementation. Sales capacity is the primary growth constraint. We also need a dedicated customer success manager whose sole role is monitoring MAR% and platform health at deployed clients and triggering re-engagement before churn. Process: We need a structured enterprise RFP response library covering the 20 most common RFP questions (data sovereignty architecture, DPDP Act compliance, white-label process, SLA guarantees). Currently each RFP is answered from scratch. We also need a 90-day onboarding playbook that guarantees 65%+ MAR by Day 90 - this becomes the core retention guarantee in all enterprise contracts.",
    source:
      "Tab 8: GTM Strategy - Sales Motion; Tab 9: Metrics - North Star and onboarding targets",
    review:
      "Requires founder input - verify current team size and actual capability gaps. Adjust hiring priorities based on budget available.",
  },
];

const founderChecklist: ChecklistItem[] = [
  {
    checkbox: "[ ]",
    question: "Q2: Values and culture",
    verify:
      "Verify that the 5 stated values reflect actual team culture. Replace or reorder based on founder conversation.",
  },
  {
    checkbox: "[ ]",
    question: "Q4: BHAG (10-15 year vision)",
    verify:
      "Verify that the BHAG scale and geography reflect founder's personal ambition. Adjust unit volume and revenue scale.",
  },
  {
    checkbox: "[ ]",
    question: "Q5: 3-5 year revenue targets",
    verify:
      "Replace INR 50-75 crore ARR (Year 3) and INR 150-200 crore ARR (Year 5) with board-approved targets grounded in actual MRR trajectory.",
  },
  {
    checkbox: "[ ]",
    question: "Q6: This financial year goals",
    verify:
      "Validate 10 enterprise deal target, 3 IFM partnerships, and UAE launch against current pipeline and engineering roadmap capacity.",
  },
  {
    checkbox: "[ ]",
    question: "Q8: 3 key actions",
    verify:
      "Verify that the 3 named IFM companies (JLL, CBRE, Knight Frank) are actually in active partnership discussions. Replace with accurate names.",
  },
  {
    checkbox: "[ ]",
    question: "Q10: People and process gaps",
    verify:
      "Replace generic statements with specific current team size and confirmed hiring plan tied to actual FY budget.",
  },
];

const reviewTone = (review: string) =>
  review.toLowerCase().startsWith("ready")
    ? "border-[#E8B69D] bg-[#FFF7F1] text-[#A24A2A]"
    : "border-[#F0C38B] bg-[#FFF3DD] text-[#8A4F00]";

const PostPossessionBusinessPlanTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in font-poppins text-[#2C2C2C]">
      <section className="rounded-t-xl border border-[#C4B89D] border-l-4 border-l-[#DA7756] bg-white p-6">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          {businessPlanMeta.title}
        </h2>
        <p className="mt-2 text-sm italic leading-relaxed text-[#4f4a43]">
          {businessPlanMeta.subtitle}
        </p>
      </section>

      <section className="space-y-6">
        {planQuestions.map((item, index) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-lg border border-[#D3D1C7] bg-white shadow-sm"
          >
            <table className="w-full border-collapse table-fixed text-[13px]">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    className="border border-[#D3D1C7] bg-[#DA7756] px-4 py-3 text-left align-top text-sm font-bold leading-relaxed text-white"
                  >
                    <span className="mr-2 inline-flex min-w-10 justify-center rounded border border-white/40 bg-white/15 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em]">
                      {item.id}
                    </span>
                    {item.question}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={index % 2 === 0 ? "bg-[#FFF7F1]" : "bg-white"}>
                  <td className="w-48 border border-[#D3D1C7] bg-white px-4 py-4 align-top text-[11px] font-bold uppercase tracking-[0.14em] text-[#7A3A20]">
                    Suggested Answer
                  </td>
                  <td className="border border-[#D3D1C7] px-4 py-4 align-top text-[13px] font-medium leading-relaxed text-[#1A1A2E]">
                    {item.answer}
                  </td>
                </tr>
                <tr className={index % 2 === 0 ? "bg-white" : "bg-[#FFF7F1]"}>
                  <td className="w-48 border border-[#D3D1C7] bg-[#F4D4C3] px-4 py-3 align-top text-[11px] font-bold uppercase tracking-[0.14em] text-[#7A3A20]">
                    Source
                  </td>
                  <td className="border border-[#D3D1C7] px-4 py-3 align-top text-[12px] italic leading-relaxed text-[#4F4A43]">
                    {item.source}
                  </td>
                </tr>
                <tr className={index % 2 === 0 ? "bg-[#FFF7F1]" : "bg-white"}>
                  <td className="w-48 border border-[#D3D1C7] bg-[#F4D4C3] px-4 py-3 align-top text-[11px] font-bold uppercase tracking-[0.14em] text-[#7A3A20]">
                    Founder Review
                  </td>
                  <td className="border border-[#D3D1C7] px-4 py-3 align-top">
                    <span
                      className={`inline-block rounded border px-3 py-2 text-[12px] font-semibold leading-relaxed ${reviewTone(item.review)}`}
                    >
                      {item.review}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-[#D3D1C7] bg-white shadow-sm">
        <div className="bg-[#DA7756] px-4 py-3 text-white">
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Founder Review Checklist
          </h3>
          <p className="mt-1 text-xs text-white/85">
            Items requiring personal founder input before use in investor or
            partner meetings.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#A24A2A] text-left text-[11px] font-bold uppercase tracking-wide text-white">
                <th className="w-20 border border-[#D3D1C7] px-4 py-3 text-center">
                  Checkbox
                </th>
                <th className="w-64 border border-[#D3D1C7] px-4 py-3">
                  Question
                </th>
                <th className="border border-[#D3D1C7] px-4 py-3">
                  What to Verify or Personalise
                </th>
              </tr>
            </thead>
            <tbody>
              {founderChecklist.map((item, index) => (
                <tr
                  key={item.question}
                  className={index % 2 === 0 ? "bg-[#FFF7F1]" : "bg-white"}
                >
                  <td className="border border-[#D3D1C7] px-4 py-3 text-center font-bold text-[#1a1a2e]">
                    {item.checkbox}
                  </td>
                  <td className="border border-[#D3D1C7] px-4 py-3 font-semibold text-[#1a1a2e]">
                    {item.question}
                  </td>
                  <td className="border border-[#D3D1C7] px-4 py-3 leading-relaxed text-[#1a1a2e]">
                    {item.verify}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PostPossessionBusinessPlanTab;
