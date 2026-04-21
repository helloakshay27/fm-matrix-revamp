import React from "react";

const PostPossessionPricingTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in font-poppins pb-10">
      {/* Header */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Post Possession — Features & Pricing
        </h2>
      </div>

      {/* Part A: Competitive Features vs Market */}
      <section className="space-y-4">
        <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part A — Current Features vs Market Standard
        </div>
        <div className="overflow-x-auto border border-[#D3D1C7] rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-[11px] leading-relaxed border-collapse">
            <thead className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border border-[#E5E7EB] w-[20%]">Feature Area</th>
                <th className="p-3 border border-[#E5E7EB] w-[25%]">Market Standard (Most Products Offer)</th>
                <th className="p-3 border border-[#E5E7EB] w-[30%]">Our Product (Have / Roadmap / Gap)</th>
                <th className="p-3 border border-[#E5E7EB] w-[25%]">Verdict: Ahead / At Par / Gap</th>
              </tr>
            </thead>
            <tbody>
              {[
                { area: "Visitor Management", market: "Basic guest log, digital gate pass, OTP entry; limited to 3–5 features", ours: "HAVE: 25+ visitor features including IVR/push approval, child safety, panic button, overstay alerts, offline guard mode, voice command, e-intercom, group entry, cab pre-auth", verdict: "✅ AHEAD — depth of visitor management is best-in-class globally; offline mode is unique", tone: "bg-[#ddebf7]" },
                { area: "Security & Access Control", market: "Basic CCTV integration; boom barrier API in premium tiers; RFID support in enterprise", ours: "HAVE: Boom barrier/flap barrier API, ANPR, computer vision (tailgating, face mask, heat mapping, social distancing), guard patrolling with QR checkpoints", verdict: "✅ AHEAD — Computer vision and ANPR at this price point is rare; most competitors offer it only at 3–5x price", tone: "bg-[#ddebf7]" },
                { area: "Helpdesk / Ticket Management", market: "Ticket raise + status tracking; basic escalation (1–2 levels); vendor assignment", ours: "HAVE: 5-layer escalation matrix, CAPA reporting, root cause analysis, Golden Ticket (vulnerable residents), TAT calculation by operational hours, rule-based auto-assignment, multi-mode ticket raising", verdict: "✅ AHEAD — 5-layer escalation and CAPA are enterprise-grade; competitors offer max 2–3 level escalation", tone: "bg-[#ddebf7]" },
                { area: "Accounting & Billing", market: "CAM invoice generation, payment gateway, basic ledger; ERP export in enterprise tier", ours: "HAVE: Full accounting module — GST/tax config, chart of accounts, part/full payment, offline reconciliation, ERP export, defaulter blocking, prepaid meter integration, assets & liabilities", verdict: "✅ AHEAD in India context — full accounting module at community level is rare; most charge extra for it", tone: "bg-[#ddebf7]" },
                { area: "FM Operations (PPM, Asset, Checklists)", market: "Basic work order; limited asset register; no PPM checklists in most community apps", ours: "HAVE: Full FM suite — PPM/AMC digital checklists with QR/NFC dual-control, asset tagging, warranty alerts, soft services scheduling, compliance tracker, permit to work, operational audit, vendor evaluation", verdict: "✅ AHEAD — FM operations depth exceeds most community apps; competitive with standalone FM tools", tone: "bg-[#ddebf7]" },
                { area: "Developer / Owner Engagement", market: "Not offered by any community management app; entirely absent from market", ours: "HAVE: White-label app, referral marketing, loyalty program, new project updates, lead generation, rolling banners, marketing analytics", verdict: "✅ STRONGLY AHEAD — Unique category; no competitor offers developer-side engagement + community + FM in one platform", tone: "bg-[#e2efda]" },
                { area: "Community Engagement", market: "Notices, events, polls; basic gallery; some apps offer chat", ours: "HAVE: All standard features + wellness programs, collaboration (chat + video), MoM with auto tasks, offers/coupons, QR-based survey, community news", verdict: "✅ AHEAD — MoM-to-task automation and wellness programs are differentiators", tone: "bg-[#ddebf7]" },
                { area: "Facility Booking", market: "Slot-based booking; basic payment; some apps offer sub-facility management", ours: "HAVE: Bookable vs requestable config, sub-facility management, club membership with expiry alerts, automated usage-based charges, unique resident QR code for access", verdict: "✅ AHEAD — Automated usage-based billing and membership lifecycle management are not standard", tone: "bg-[#ddebf7]" },
                { area: "Resident Convenience / Marketplace", market: "Basic directory; some apps offer third-party grocery integration; food ordering in premium", ours: "HAVE: On-premise services marketplace, F&B module, hyper-local directory, e-commerce integration, B2B health/grocery partnerships", verdict: "⚠️ AT PAR — marketplace is solid but not differentiated; third-party integration depth could be stronger", tone: "bg-[#fff2cc]" },
                { area: "White-Label Capability", market: "Very few offer white-label; those that do charge significant premium; most are SaaS multi-tenant", ours: "HAVE: Full white-label Android + iOS + rolling banners; data on client's own servers (not Lockated's)", verdict: "✅ STRONGLY AHEAD — Data sovereignty + white-label is unique globally; no direct competitor offers both", tone: "bg-[#e2efda]" },
                { area: "BI Reporting & Analytics", market: "Basic operational dashboards; underlying data export in enterprise tier only", ours: "HAVE: Detailed BI reports per module; underlying data view/download in multiple formats; multi-format chart views", verdict: "✅ AHEAD — Module-level BI for every function is not standard; most offer only summary dashboards", tone: "bg-[#ddebf7]" },
                { area: "IoT / IT Integration", market: "API-based integrations for boom barriers and RFID; some offer BMS integration", ours: "HAVE: API/ERP/OPC/Historian integration; customised IoT on project basis; ANPR; computer vision", verdict: "✅ AHEAD — OPC and Historian integration (industrial IoT) is unique; positions well for smart building segment", tone: "bg-[#ddebf7]" },
                { area: "Mobile App (Resident-Facing)", market: "iOS and Android apps; push notifications; basic profile management", ours: "HAVE: Full resident app with all modules; QR code for amenity access; switch-flat feature; family/tenant member addition; in-app calling", verdict: "✅ AHEAD — Switch-flat and in-app calling (resident-to-resident without sharing numbers) are notable differentiators", tone: "bg-[#ddebf7]" },
                { area: "Inventory Management", market: "Basic stock tracking; PO management in enterprise FM tools only", ours: "HAVE: PO/WO management, GRN/GDN tracking, spares/consumables, insufficient stock alerts, procurement approval workflow", verdict: "✅ AHEAD vs community apps; AT PAR vs dedicated FM/CMMS tools", tone: "bg-[#ddebf7]" },
                { area: "Lease Management", market: "Not offered by community management apps; available in enterprise PM tools (Yardi, AppFolio)", ours: "HAVE: Full lease module — analytics, operations, accounting, management, data management", verdict: "⚠️ AT PAR vs enterprise PM tools; AHEAD vs community app competitors", tone: "bg-[#ddebf7]" },
                { area: "Space & Transport Management", market: "Rarely offered in community apps; co-working/office-focused products offer seat management", ours: "HAVE: Full space management (floor plan, seat booking, colleague finder) and transport management (booking, tracking, billing, policies)", verdict: "⚠️ AT PAR vs specialised tools; relevant for mixed-use or co-living only", tone: "bg-[#fff2cc]" },
                { area: "GDPR / Data Compliance", market: "US/UK platforms typically host data on their own cloud; GDPR compliance claimed but data leaves client control", ours: "HAVE: Data hosted exclusively on client's own servers — Lockated holds zero client data", verdict: "✅ STRONGLY AHEAD — Unique architecture; critical differentiator for UK, Europe, and GCC regulatory contexts", tone: "bg-[#e2efda]" },
                { area: "UI/UX & Mobile Design", market: "Newer US/UK competitors (Spike Living, Engrain) have consumer-grade UI; Indian apps lag on design polish", ours: "GAP: UI/UX requires investment to match consumer-grade design standards expected in UK/US/GCC luxury markets", verdict: "❌ GAP — Design quality is functional but below consumer-grade standard; this will cost deals in UK/US luxury segment", tone: "bg-[#fce4d6]" },
                { area: "API / Integration Marketplace", market: "Leading PM tools (Yardi, AppFolio) offer 100+ third-party integrations via marketplace", ours: "GAP: Integrations are available but not published as a formal marketplace; discovery requires custom scoping", verdict: "❌ GAP — No public integration marketplace; reduces perception of openness and scalability for enterprise buyers", tone: "bg-[#fce4d6]" },
                { area: "Multi-Language Support", market: "English + regional language in most Indian apps; Arabic in GCC-specific tools", ours: "GAP: Full multi-language support (Arabic, Bahasa, Thai, French) not yet confirmed as standard feature", verdict: "❌ GAP — Critical for GCC (Arabic) and SE Asia (Bahasa, Thai) expansion; will cost deals in those geographies", tone: "bg-[#fce4d6]" },
              ].map((item, idx) => (
                <tr key={idx} className={item.tone}>
                  <td className="p-3 border border-gray-200 font-bold">{item.area}</td>
                  <td className="p-3 border border-gray-200 text-gray-700">{item.market}</td>
                  <td className="p-3 border border-gray-200 font-medium text-[#1f3864]">{item.ours}</td>
                  <td className="p-3 border border-gray-200 font-semibold">{item.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary Section */}
      <section className="space-y-4">
        <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Summary: Competitive Position & Pricing Model Impact
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#e2efda] p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 text-xs mb-2 uppercase tracking-tighter italic border-b border-green-300 pb-1">Where We Are Ahead</h3>
            <p className="text-[10px] leading-relaxed text-gray-800">
              Visitor management depth, FM operations completeness (PPM/CAPA/vendor eval), developer-side engagement (referral/loyalty), white-label + data sovereignty, 5-layer escalation, computer vision at accessible price point, IoT/OPC integration.
            </p>
            <div className="mt-3 text-[10px] bg-white/50 p-2 rounded">
              <span className="font-bold">Implication:</span> These are the features to lead with in every demo and proposal. They justify premium pricing vs MyGate/NoBrokerHood.
            </div>
          </div>

          <div className="bg-[#ddebf7] p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 text-xs mb-2 uppercase tracking-tighter italic border-b border-blue-300 pb-1">Where We Are At Par</h3>
            <p className="text-[10px] leading-relaxed text-gray-800">
              Resident convenience marketplace, lease management, space/transport management, BI reporting.
            </p>
            <div className="mt-3 text-[10px] bg-white/50 p-2 rounded">
              <span className="font-bold">Implication:</span> Solid parity — these should not be the reason we lose deals. Ensure demos cover these adequately to remove doubt.
            </div>
          </div>

          <div className="bg-[#fce4d6] p-4 rounded-lg border border-orange-200">
            <h3 className="font-bold text-orange-800 text-xs mb-2 uppercase tracking-tighter italic border-b border-orange-300 pb-1">Gaps That Will Cost Us Deals</h3>
            <p className="text-[10px] leading-relaxed text-gray-800">
              1. UI/UX polish — will cost deals in UK, US, Dubai luxury segment.<br />
              2. Multi-language (Arabic, Bahasa, Thai) — will block GCC and SE Asia expansion.<br />
              3. No public integration marketplace — enterprise buyers expect published API docs and a connector library.
            </p>
            <div className="mt-3 text-[10px] bg-white/50 p-2 rounded">
              <span className="font-bold">Action:</span> Prioritise for 6–12 month roadmap to protect international expansion. These are table-stakes for the UK and US markets.
            </div>
          </div>

          <div className="bg-[#fff2cc] p-4 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-800 text-xs mb-2 uppercase tracking-tighter italic border-b border-yellow-300 pb-1">Pricing Model Impact</h3>
            <p className="text-[10px] leading-relaxed text-gray-800 italic">Currently: Likely per-unit/per-month SaaS model.</p>
            <div className="mt-2 text-[10px] space-y-2">
              <p><strong>Usage-based:</strong> Charge per active visitor scan, per ticket raised, per transaction. Benefit: Aligns cost to value.</p>
              <p><strong>Performance-based:</strong> Base fee + success fee on referrals/collection. Benefit: ROI-demonstrable investment.</p>
              <p className="font-bold text-yellow-900 border-t border-yellow-300 pt-1">Recommend: Hybrid Model (Base + Performance Uplift)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Part B: Market Pricing */}
      <section className="space-y-4">
        <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part B — Current Pricing Market
        </div>
        <div className="overflow-x-auto border border-[#D3D1C7] rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-[11px] leading-relaxed border-collapse">
            <thead className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border border-[#E5E7EB] w-[20%]">Pricing Dimension</th>
                <th className="p-3 border border-[#E5E7EB] w-[25%]">India</th>
                <th className="p-3 border border-[#E5E7EB] w-[25%]">GCC (UAE/Saudi/Qatar)</th>
                <th className="p-3 border border-[#E5E7EB] w-[30%]">Notes / Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#f2f2f2]">
                <td className="p-3 border border-gray-200 font-bold">Standard Models</td>
                <td className="p-3 border border-gray-200">SaaS per unit/month; Setup + AMC; Per-project licence</td>
                <td className="p-3 border border-gray-200">SaaS per unit/month; Annual licence for portfolios</td>
                <td className="p-3 border border-gray-200 font-medium">Usage/Performance models are emerging; first-mover advantage available</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 font-bold">Entry Tier</td>
                <td className="p-3 border border-gray-200">₹2–5/unit/month; ₹15–25K/project/month</td>
                <td className="p-3 border border-gray-200">AED 3–8/unit/month</td>
                <td className="p-3 border border-gray-200">Do not compete here; it commoditises the product.</td>
              </tr>
              <tr className="bg-[#f2f2f2]">
                <td className="p-3 border border-gray-200 font-bold">Mid Tier</td>
                <td className="p-3 border border-gray-200">₹8–15/unit/month; ₹50–120K/project/month</td>
                <td className="p-3 border border-gray-200">AED 12–20/unit/month</td>
                <td className="p-3 border border-gray-200 font-medium italic">Likely current positioning. Justify via FM depth.</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 font-bold">Enterprise Tier</td>
                <td className="p-3 border border-gray-200">₹18–35/unit/month; ₹2–8L/project/month</td>
                <td className="p-3 border border-gray-200">AED 25–50/unit/month</td>
                <td className="p-3 border border-gray-200">White-label + loyalty + data sovereignty justifies this.</td>
              </tr>
              <tr className="bg-[#f2f2f2]">
                <td className="p-3 border border-gray-200 font-bold">Competitor Tiering</td>
                <td className="p-3 border border-gray-200">Security → Paid (Accounting, Messaging, Staff)</td>
                <td className="p-3 border border-gray-200">Yardi: Voyager + RENTCafé sold separately</td>
                <td className="p-3 border border-gray-200 font-medium italic">Recommend 4th tier: Developer Engagement (Unique)</td>
              </tr>
              <tr className="bg-[#e2efda]">
                <td className="p-3 border border-gray-200 font-bold">Recommended: NOW</td>
                <td className="p-3 border border-gray-200 font-bold">₹12–18/unit (mid); ₹25–35 (enterprise)</td>
                <td className="p-3 border border-gray-200 font-bold">AED 18–25 (std); AED 35–55 (enterprise)</td>
                <td className="p-3 border border-gray-200">Onboarding fee: ₹1-2.5L / AED 15-40K per project.</td>
              </tr>
              <tr className="bg-[#ddebf7]">
                <td className="p-3 border border-gray-200 font-bold">Recommended: 6MO</td>
                <td className="p-3 border border-gray-200">Add referral performance tier: + ₹500-1,500 per lead</td>
                <td className="p-3 border border-gray-200">Introduce module add-ons (CV, IoT) @ AED 3-8/unit</td>
                <td className="p-3 border border-gray-200">Performance tier unlocks developer sales budget.</td>
              </tr>
              <tr className="bg-[#fff2cc]">
                <td className="p-3 border border-gray-200 font-bold">Recommended: 18MO</td>
                <td className="p-3 border border-gray-200 font-black">Starter / Pro / Enterprise + Marketplace share</td>
                <td className="p-3 border border-gray-200 font-black">AED 15 / 28 / 50 per unit + Compliance add-on</td>
                <td className="p-3 border border-gray-200 italic leading-tight">Marketplace GMV revenue creates non-SaaS stream.</td>
              </tr>
              <tr className="bg-[#fce4d6]">
                <td className="p-3 border border-gray-200 font-bold uppercase text-[9px]">The Risks</td>
                <td className="p-3 border border-gray-200 leading-tight">MyGate freemium erodes willingness to pay; mid-market pressure</td>
                <td className="p-3 border border-gray-200 leading-tight">Benchmark vs Yardi enterprise; scope creep on contracts</td>
                <td className="p-3 border border-gray-200 font-bold text-red-800 uppercase italic">Mitigation: Feature fencing & ROI Calculators</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Part C: Positioning */}
      <section className="space-y-4">
        <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part C — Positioning
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#e2efda] p-6 rounded-xl border-l-8 border-l-green-600 shadow-sm">
            <h3 className="text-[#1f3864] font-black text-sm uppercase mb-3">Single Most Defensible Position (NOW)</h3>
            <p className="text-sm font-medium italic text-gray-800 leading-relaxed max-w-4xl">
              "The only white-label, data-sovereign community management platform that covers the entire resident lifecycle — from post-possession daily living through FM operations to developer referral and loyalty — in a single app, on the developer's own servers."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#ddebf7] p-5 rounded-xl border-l-8 border-l-blue-600">
              <h3 className="text-blue-900 font-bold text-[10px] uppercase mb-2">Priority Segments</h3>
              <ul className="text-[11px] space-y-2 text-gray-700">
                <li><span className="font-bold">INDIA:</span> Large/Mid-market residential (Tier-1). godrej/piramal validated.</li>
                <li><span className="font-bold">GCC:</span> UAE (Dubai/Abu Dhabi). High ROI on referral + data sovereignty.</li>
                <li><span className="font-bold">UK:</span> Build-to-Rent (BTR) operators. GDPR pressure + no white-label alternative.</li>
              </ul>
            </div>
            <div className="bg-[#fce9d5] p-5 rounded-xl border-l-8 border-l-orange-400">
              <h3 className="text-orange-900 font-bold text-[10px] uppercase mb-2 italic">Competitive Displacement</h3>
              <p className="text-[11px] font-bold text-orange-950 mb-1 inline-block border-b border-orange-300 pb-0.5">Target: MyGate</p>
              <p className="text-[11px] leading-relaxed text-gray-800 mt-1">
                Attack at developer procurement level. Messaging: 'MyGate is a resident's app. Post Possession is a developer's platform. One makes your community safe. The other makes your brand immortal.'
              </p>
            </div>
          </div>

          <div className="bg-[#fce4d6] p-5 rounded-xl border border-red-100 border-dashed">
            <h3 className="text-red-900 font-bold text-[10px] uppercase mb-2">What To Stop Doing / Saying</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "No Feature Lists", desc: "Don't drown buyers in 130 features. Lead with outcomes." },
                { title: "No 'Society App'", desc: "Don't call it that; it commoditises to MyGate level." },
                { title: "No Small RWAs", desc: "Too complex/expensive for them; dilutes enterprise value." },
                { title: "Don't sell to IT", desc: "Target CRM/Sales Heads who own referral budget." },
              ].map((stop, i) => (
                <div key={i}>
                  <p className="text-[9px] font-black text-red-700 uppercase mb-1">{stop.title}</p>
                  <p className="text-[10px] text-gray-600 leading-tight">{stop.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Part D: Value Props */}
      <section className="space-y-4">
        <div className="bg-[#2e4057] text-white px-4 py-2 font-bold text-sm uppercase tracking-wide">
          Part D — Value Propositions & Improvements
        </div>
        <div className="overflow-x-auto border border-[#D3D1C7] rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-[11px] leading-relaxed border-collapse">
            <thead className="bg-[#bdd7ee] text-[#2C2C2C] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border border-[#E5E7EB] w-[20%]">Current Value Proposition</th>
                <th className="p-3 border border-[#E5E7EB] w-[15%]">Who Resonates</th>
                <th className="p-3 border border-[#E5E7EB] w-[35%]">Sharpened / Expanded Version</th>
                <th className="p-3 border border-[#E5E7EB] w-[30%]">Why This Works Better</th>
              </tr>
            </thead>
            <tbody>
              {[
                { current: "White-labelled community app", who: "Marketing/Branding", sharp: "'Your brand. Your data. Your community.' — Only platform where residents see your name/logo.", reason: "Shifts from feature to emotional outcome (brand ownership).", tone: "bg-white" },
                { current: "Integrated Platform", who: "FM Head, Ops Director", sharp: "'Replace 7 apps with 1. Run entire community from a single screen.'", reason: "The '7 to 1' framing makes the pain tangible.", tone: "bg-[#f2f2f2]" },
                { current: "Reduce CP cost by 50%", who: "Sales Director, CFO", sharp: "'Turn residents into salespeople. Every referral saves ₹3–10L in fees.'", reason: "Anchors value in specific rupee amount. Must-have for CFOs.", tone: "bg-white" },
                { current: "Reduce support cost by 20%", who: "FM Head, Ops Director", sharp: "'Cut maintenance overhead in half. Automated ticket routing + 5-layer escalation.'", reason: "Quantified and specific. Supported by reference data.", tone: "bg-[#f2f2f2]" },
                { current: "Lifecycle management", who: "CRM Head, CEO", sharp: "'Relationship doesn't end at possession. It starts there. Keep every referral tracked.'", reason: "Reframes from 'ops tool' to 'long-term commercial asset'.", tone: "bg-white" },
                { current: "Zero unauthorised vendors", who: "Legal/Risk, FM Head", sharp: "'Curated marketplace. Every provider vetted by you. Your ecosystem, your revenue.'", reason: "Adds safety AND revenue angle.", tone: "bg-[#f2f2f2]" },
                { current: "Data sovereignty", who: "CIO, Legal, CFO", sharp: "'Residents' data never leaves your servers. Full sovereignty — GDPR/PDPA compliant.'", reason: "Critical differentiator for international regulatory contexts.", tone: "bg-white" },
                { current: "Operational efficiency", who: "FM Head, FM Team", sharp: "'From reactive to proactive. PPM, digital audits, compliance alerts — stop chasing paperwork.'", reason: "Speaks directly to daily frustration of FM managers.", tone: "bg-[#f2f2f2]" },
              ].map((row, r) => (
                <tr key={r} className={`${row.tone} hover:bg-gray-100 transition-colors`}>
                  <td className="p-3 border border-gray-100 font-bold">{row.current}</td>
                  <td className="p-3 border border-gray-100 text-gray-500 font-medium">{row.who}</td>
                  <td className="p-3 border border-gray-100 font-bold text-[#1f3864]">{row.sharp}</td>
                  <td className="p-3 border border-gray-100 italic">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PostPossessionPricingTab;
