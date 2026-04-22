import React from "react";

const metricsData = {
  clientImpact: [
    {
      id: 1,
      name: "Referral Lead Conversion Rate",
      measures: "% of resident referrals that convert to a site visit or booking at a new developer project",
      impact: "3–8% conversion (vs 1–2% for cold marketing); 2–4x improvement vs non-referral channels",
      feature: "Referral Marketing module; Loyalty Program; Resident engagement score",
      how: "Engaged residents receive personalised referral prompts via app; one-click WhatsApp share with tracked UTM; payout automation closes the loop, motivating repeat referrals",
      claim: "Developers using Post Possession generate 3–4x more qualified leads per resident than traditional channel partners — at zero commission cost.",
    },
    {
      id: 2,
      name: "Channel Partner (CP) Cost Reduction",
      measures: "Reduction in % of property value paid as CP commission due to shift to referral-sourced leads",
      impact: "30–50% reduction in CP-sourced deal % within 18 months of platform deployment",
      feature: "Referral engine, lead tracking dashboard, developer sales integration",
      how: "Platform formalises and incentivises resident referrals, creating a warm inbound pipeline that displaces CP-sourced leads over time; developer sales team prioritises referral leads due to higher close rate",
      claim: "Post Possession clients reduce channel partner acquisition costs by up to 50%, saving ₹3–10 lakh per converted referral sale.",
    },
    {
      id: 3,
      name: "Helpdesk Ticket Resolution Time (TAT)",
      measures: "Average time from ticket creation to verified resolution across all complaint categories",
      impact: "30–50% reduction in average TAT within 90 days of full FM module activation",
      feature: "5-layer escalation matrix, auto ticket routing, PPM checklists, TAT configuration",
      how: "Auto-routing eliminates wrong-assignment delays; escalation matrix prevents tickets from sitting idle; TAT dashboard creates visible accountability for FM team",
      claim: "Communities on Post Possession resolve maintenance complaints 40% faster — with automated escalation ensuring no ticket goes unanswered beyond defined SLA.",
    },
    {
      id: 4,
      name: "CAM Collection Rate",
      measures: "% of total billed Common Area Maintenance charges collected within 30 days of billing",
      impact: "Improvement from industry baseline 60–75% to 85–92% within 6 months",
      feature: "Auto invoice generation, WhatsApp payment reminders, in-app payment gateway, defaulter blocking",
      how: "Automated reminders sent at defined intervals; multiple payment options reduce friction; defaulter blocking creates social/functional incentive to pay on time",
      claim: "CAM collection rates on Post Possession communities reach 88%+ — up from an industry average of 65%, reducing FM budget shortfalls by millions annually.",
    },
    {
      id: 5,
      name: "Resident App Monthly Active Rate",
      measures: "% of registered residents who open and use the app at least once in a calendar month",
      impact: "Target: 55–75% MAR; industry baseline for society apps: 25–35% MAR",
      feature: "Visitor management (daily driver), notifications, helpdesk, F&B, facility booking, offers",
      how: "Visitor approval push notifications force daily app opens even for passive users; helpdesk and billing provide non-negotiable utility; F&B and services drive habitual use",
      claim: "Residents on Post Possession communities open their app 3.2x per week on average — making it the most-used community app in its category.",
    },
    {
      id: 6,
      name: "Security Incident Response Time",
      measures: "Average time from security event trigger (panic button, child safety alert, overstay alert) to guard acknowledgement",
      impact: "Target: <90 seconds for P0 alerts; industry baseline: 3–8 minutes via radio/phone",
      feature: "Panic button, child safety alert, guard app push notification, 2-tier security alert system",
      how: "Digital alerts reach all guards simultaneously vs radio chains; guard app shows exact alert type and location; GPS-linked patrol logs show which guard is nearest",
      claim: "Security response time in Post Possession communities averages under 90 seconds for critical alerts — 4x faster than radio-based security protocols.",
    },
    {
      id: 7,
      name: "FM Compliance Score",
      measures: "% of scheduled PPM tasks, AMC deadlines, and compliance checkpoints completed on time within a reporting period",
      impact: "Target: >90% compliance score; baseline in manual FM environments: 55–70%",
      feature: "PPM digital checklists, compliance tracker, automated AMC alerts, permit-to-work, vendor evaluation",
      how: "Digital checklists eliminate 'completed on paper, not in reality' gaps; automated alerts prevent missed deadlines; QR/NFC dual-control verifies physical task completion",
      claim: "FM teams on Post Possession achieve 91%+ scheduled compliance scores — audit-ready, with full digital trail for every task executed.",
    },
    {
      id: 8,
      name: "Resident NPS (Net Promoter Score)",
      measures: "Likelihood of resident to recommend their community to friends/family, linked to platform engagement",
      impact: "Expected improvement of +15–25 NPS points within 12 months of active platform use vs baseline",
      feature: "Helpdesk (fast resolution), community engagement, visitor management (convenience), billing (transparency)",
      how: "Faster issue resolution, transparent billing, and frictionless daily living drive resident satisfaction; in-app survey triggered post-ticket resolution and post-event captures real-time NPS signal",
      claim: "Communities managed on Post Possession report NPS scores 20+ points higher than industry average — driven by faster maintenance resolution and transparent billing.",
    },
    {
      id: 9,
      name: "Visitor Processing Time at Gate",
      measures: "Average time from visitor arrival at gate to entry approval and gate open",
      impact: "Target: <45 seconds for pre-authorised visitors; <120 seconds for unexpected visitors",
      feature: "Pre-authorised visitor flow, OTP authentication, IVR/push approval, digital gate pass, offline guard mode",
      how: "Pre-authorised visitors enter with a single QR scan (no phone call to resident needed); unexpected visitor push/IVR approval is resolved by resident in real time from anywhere",
      claim: "Gate entry time for pre-approved visitors drops to under 45 seconds on Post Possession — eliminating peak-hour queues and improving resident experience from the moment they arrive home.",
    },
    {
      id: 10,
      name: "FM Labour Cost per Ticket",
      measures: "Average cost of FM staff time to resolve one helpdesk ticket, including dispatch, travel, and resolution time",
      impact: "15–25% reduction within 12 months via auto-routing, staff roster optimisation, and vendor assignment",
      feature: "Rule-based auto ticket assignment, staff roster management, vendor assignment, mobile ticket update",
      how: "Auto-routing eliminates manual dispatch overhead; technicians update ticket status from mobile app eliminating admin rework; vendor assignment concentrates repeat-category work to specialists improving speed",
      claim: "Post Possession reduces per-ticket FM resolution cost by 20% through automated dispatch and mobile-first technician workflows — freeing FM budgets for planned maintenance.",
    },
  ],
  launchTracking: {
    thirtyDay: [
      {
        metric: "New Community Sign-Ups",
        definition: "Contracts signed (not just demos given) in first 30 days of GTM launch",
        withoutPhase1: "3–5 new contracts (India only; slower due to longer sales cycle without ROI proof)",
        withPhase1: "6–10 new contracts (India + GCC early pipeline; ROI calculator shortens cycle by est. 30%)",
        why: "ROI calculator + case study = faster CFO sign-off; Arabic UI = GCC deals unblocked",
      },
      {
        metric: "Activated Users (Residents)",
        definition: "% of residents in newly onboarded communities who complete profile + perform action",
        withoutPhase1: "35–45% activation (without guided onboarding playbook)",
        withPhase1: "55–65% activation (with 90-day CS onboarding playbook + developer CRM activation campaign)",
        why: "Structured onboarding drives 20–30% higher activation; referral payout visibility motivates registration",
      },
      {
        metric: "Paid Conversions (Pilot to Full)",
        definition: "% of pilot/trial communities that convert to paid full contract within 30 days",
        withoutPhase1: "40–50% (without strong CS and ROI proof)",
        withPhase1: "65–75% (with published case study + ROI calculator + proactive CS)",
        why: "Buyers who see their own ROI numbers convert faster; CS reduces post-pilot churn risk",
      },
      {
        metric: "Feature Adoption % — Core Modules",
        definition: "% of activated communities actively using 3+ core module groups within 30 days",
        withoutPhase1: "50–60% (training-heavy onboarding needed without playbook)",
        withPhase1: "70–80% (guided activation playbook drives structured module-by-module adoption)",
        why: "Playbook ensures FM team and resident app are both activated in Week 1; not left to chance",
      },
      {
        metric: "NPS Proxy — Developer Satisfaction",
        definition: "Post-go-live survey to developer admin team on a 0–10 scale",
        withoutPhase1: "NPS 30–40 (without polished UI; admin console friction creates early frustration)",
        withPhase1: "NPS 50–65 (with UI overhaul; cleaner admin console reduces implementation friction)",
        why: "UI quality directly correlates with early admin NPS; poor UI causes implementation complaints",
      },
      {
        metric: "Support Ticket Volume per Community",
        definition: "Average number of support tickets raised by FM/admin team to Lockated support",
        withoutPhase1: "8–12 tickets/community (without streamlined onboarding)",
        withPhase1: "3–5 tickets/community (with onboarding playbook + in-app help guides)",
        why: "Structured onboarding pre-empts the top 10 configuration questions",
      },
      {
        metric: "Churn Rate (30-day)",
        definition: "% of signed communities that request to exit or pause within first 30 days",
        withoutPhase1: "5–8% (high without proactive CS; implementation issues cause early exits)",
        withPhase1: "1–2% (with dedicated CS + 45-day go-live guarantee + implementation playbook)",
        why: "Early churn is almost always an implementation failure, not product failure",
      },
      {
        metric: "North Star Metric: Visitor Transactions",
        definition: "Total visitor approvals processed — proxy for platform engagement depth",
        withoutPhase1: "500–1,000 visitor transactions in Month 1",
        withPhase1: "1,500–3,000 visitor transactions (higher activation drives more transactions)",
        why: "Visitor management is the daily-driver feature and direct measure of resident adoption",
      },
    ],
    threeMonth: [
      {
        metric: "Cumulative New Community Sign-Ups",
        definition: "Total contracted communities by end of Month 3",
        withoutPhase1: "8–12 communities (India only; no GCC or UK without upgrade)",
        withPhase1: "18–25 communities (India enterprise + GCC early + UK pilot underway)",
        why: "Phase 1 features (Arabic, UI, API docs) unlock 2 international market tracks simultaneously",
      },
      {
        metric: "Resident Monthly Active Rate (MAR)",
        definition: "% of all registered residents who use app ≥1 time in Month 3",
        withoutPhase1: "38–48% MAR (declining from Month 1 activation if no engagement features active)",
        withPhase1: "58–68% MAR (referral payout + wellness + offers drive habitual return)",
        why: "Referral payout automation gives residents a financial reason to stay engaged",
      },
      {
        metric: "Paid Conversion Rate (Pilot to Annual)",
        definition: "% of all trial/pilot communities converted by end of Month 3",
        withoutPhase1: "45–55% (without ROI proof + CS playbook)",
        withPhase1: "70–80% (with ROI calculator + published case studies + proactive CS QBR at Day 60)",
        why: "Day 60 QBR with ROI data presented to CFO is the single highest-leverage conversion action",
      },
      {
        metric: "Feature Adoption % — Developer Engagement",
        definition: "% of communities where developer activated referral and/or loyalty by Month 3",
        withoutPhase1: "25–35% (without referral payout automation)",
        withPhase1: "55–65% (with automated UPI payout; confidence is higher)",
        why: "Referral module activation is blocked by payout friction more than any other factor",
      },
      {
        metric: "NPS Proxy — Developer + Resident",
        definition: "Developer admin NPS + resident NPS sampled via in-app survey",
        withoutPhase1: "Developer NPS: 35–45; Resident NPS: 20–30 (UI friction drags both down)",
        withPhase1: "Developer NPS: 55–65; Resident NPS: 40–55 (UI overhaul removes top friction point)",
        why: "UI/UX quality is the #1 NPS driver in months 1–3",
      },
      {
        metric: "Support Ticket Volume Trend",
        definition: "Week-on-week change in support tickets per community",
        withoutPhase1: "Flat or slightly declining (without self-serve help)",
        withPhase1: "Declining 15–20% per month (in-app help guides + onboarding playbook)",
        why: "In-app contextual help reduces repeat queries; playbook pre-empts questions",
      },
      {
        metric: "Churn Rate (3-month cohort)",
        definition: "% of signed communities churned or paused by end of Month 3",
        withoutPhase1: "8–12% churn (without strong CS)",
        withPhase1: "2–4% churn (with proactive CS + monthly health score)",
        why: "Month 2 is peak churn risk; proactive CS intervention at Day 45 prevents 70% of churn",
      },
      {
        metric: "North Star Metric: Referral Value",
        definition: "₹ property value attributed to referrals across all clients by end of Month 3",
        withoutPhase1: "₹0–5 Cr attributed referral value (module inactive or untracked)",
        withPhase1: "₹20–50 Cr attributed referral value (payout active + average ₹1–2 Cr property)",
        why: "This is the headline commercial metric. Phase 1 referral payout automation is the unlock.",
      },
    ],
  },
  summary: {
    northStar: "Referral Transactions Processed (₹ property value attributed to Post Possession referrals annually). This proves value to CFO, CRM Head, and Sales Director simultaneously.",
    keyIndicators: [
      { label: "Resident MAR > 55%", detail: "Below this, residents aren't using the app daily and the referral engine has no fuel." },
      { label: "Module Adoption > 5/8", detail: "If lower, the platform is under-deployed and vulnerable to cheaper single-purpose tools." },
      { label: "FM Compliance Score > 85%", detail: "Below this, the operations head is dissatisfied regardless of CRM outcomes." }
    ],
    paybackLogic: "Phase 1 investment (₹1.5–2.5 Cr) pays back within 12 months through 10 additional enterprise contracts unblocked by UI/Arabic/ROI proof."
  }
};

const PostPossessionMetricsTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins">
      {/* Header */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — Performance & Impact Metrics
        </h2>
      </div>

      {/* Section 1: Client Impact Metrics */}
      <div className="space-y-4">
        <div className="bg-[#DA7756] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Section 1 — Client Impact Metrics (Proof Points)
        </div>

        <div className="overflow-hidden border border-[#D3D1C7] rounded-xl shadow-sm bg-white">
          <table className="w-full border-collapse table-fixed text-[12px] leading-relaxed">
            <thead>
              <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[10px]">
                <th className="border border-[#D3D1C7] px-3 py-3 text-center w-[4%]">#</th>
                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[14%]">Metric Name</th>
                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[18%]">Expected Impact</th>
                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[18%]">Feature Driver</th>
                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[21%]">How Impact is Caused</th>
                <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[25%] font-bold text-[#DA7756] bg-blue-50/50">Landing Page Claim</th>
              </tr>
            </thead>
            <tbody>
              {metricsData.clientImpact.map((m) => (
                <tr key={m.id} className="align-top hover:bg-gray-50/50 transition-colors">
                  <td className="border border-[#D3D1C7] px-3 py-4 text-center font-bold text-gray-400">{m.id}</td>
                  <td className="border border-[#D3D1C7] px-3 py-4 font-bold text-[#DA7756]">{m.name}</td>
                  <td className="border border-[#D3D1C7] px-3 py-4 text-[#2C2C2C] font-medium italic">{m.impact}</td>
                  <td className="border border-[#D3D1C7] px-3 py-4 text-[#2C2C2C]/80 text-[11px]">{m.feature}</td>
                  <td className="border border-[#D3D1C7] px-3 py-4 text-gray-600 text-[11px] leading-relaxed">{m.how}</td>
                  <td className="border border-[#D3D1C7] px-3 py-4 text-[#1a1a2e] font-semibold text-[11px] bg-blue-50/20 leading-relaxed italic">
                    "{m.claim}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Launch Tracking */}
      <div className="space-y-8 mt-12">
        <div className="bg-[#DA7756] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Section 2 — Product Launch Tracking (Speed-to-Value)
        </div>

        {/* 30-Day Targets */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#A52A1A] uppercase tracking-[0.2em] border-b border-red-100 pb-2">
            30-Day Post-Launch Targets
          </h3>
          <div className="overflow-hidden border border-[#D3D1C7] rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse table-fixed text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-[#D3D1C7] italic">
                  <th className="p-3 text-left w-[15%]">Metric</th>
                  <th className="p-3 text-left w-[20%]">Without Phase 1</th>
                  <th className="p-3 text-left w-[20%] bg-[#fce4d6]/30 text-red-900">WITH Phase 1 Upgrade</th>
                  <th className="p-3 text-left w-[45%]">Why the Difference (The Unlock)</th>
                </tr>
              </thead>
              <tbody>
                {metricsData.launchTracking.thirtyDay.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#D3D1C7] last:border-0 hover:bg-gray-50/30">
                    <td className="p-3 font-bold text-[#DA7756]">{row.metric}</td>
                    <td className="p-3 text-gray-500 italic">{row.withoutPhase1}</td>
                    <td className="p-3 font-semibold text-green-700 bg-green-50/10">{row.withPhase1}</td>
                    <td className="p-3 text-gray-600 leading-relaxed font-medium">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Month Targets */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#DA7756] uppercase tracking-[0.2em] border-b border-blue-100 pb-2">
            3-Month Post-Launch Targets
          </h3>
          <div className="overflow-hidden border border-[#D3D1C7] rounded-xl bg-white shadow-sm">
            <table className="w-full border-collapse table-fixed text-[11px] leading-relaxed">
              <thead>
                <tr className="bg-[#F6F4EE] text-[#2C2C2C] font-bold uppercase text-[9px] border-b border-[#D3D1C7] italic">
                  <th className="p-3 text-left w-[15%]">Metric</th>
                  <th className="p-3 text-left w-[20%]">Without Phase 1</th>
                  <th className="p-3 text-left w-[20%] bg-[#F6F4EE]/30 text-[#DA7756]">WITH Phase 1 Upgrade</th>
                  <th className="p-3 text-left w-[45%]">Why the Difference (The Unlock)</th>
                </tr>
              </thead>
              <tbody>
                {metricsData.launchTracking.threeMonth.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#D3D1C7] last:border-0 hover:bg-gray-50/30">
                    <td className="p-3 font-bold text-[#DA7756]">{row.metric}</td>
                    <td className="p-3 text-gray-500 italic">{row.withoutPhase1}</td>
                    <td className="p-3 font-semibold text-blue-700 bg-blue-50/10">{row.withPhase1}</td>
                    <td className="p-3 text-gray-600 leading-relaxed font-medium">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-[#DA7756] text-white rounded-2xl p-8 shadow-xl mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 sm:block hidden"></div>
        <div className="relative z-10 space-y-8">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300 mb-4 px-2 border-l-2 border-blue-400">
              North Star Metric
            </h4>
            <p className="text-xl sm:text-2xl font-bold leading-tight">
              {metricsData.summary.northStar}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metricsData.summary.keyIndicators.map((indicator, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                <span className="text-sm font-black text-blue-200 block mb-1">{indicator.label}</span>
                <p className="text-[11px] text-gray-300 leading-relaxed italic">{indicator.detail}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300 mb-2">Investment Payback Logic</h4>
            <p className="text-[12px] text-gray-300 leading-relaxed font-medium">
              {metricsData.summary.paybackLogic}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPossessionMetricsTab;

