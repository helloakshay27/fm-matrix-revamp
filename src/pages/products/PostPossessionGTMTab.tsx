import React from "react";

type TableSection = {
  title: string;
  columns: string[];
  rows: string[][];
};

type GTMComponent = {
  title: string;
  sections: TableSection[];
};

type SummaryCard = {
  label: string;
  value: string;
};

type TargetGroup = {
  title: string;
  profile: string;
  components: GTMComponent[];
  summaryCards: SummaryCard[];
  summaryText: string;
};

const gtmMeta = {
  title: "Post Possession - Go-To-Market Strategy",
  subtitle:
    "3 Target Groups | 4 Components each: Sales Motion, Marketing Channels, 90-Day Launch Sequence, Partnership Strategy | TG Summary at end of each TG",
};

const targetGroups: TargetGroup[] = [
  {
    title:
      "TARGET GROUP 1 - Enterprise Real Estate Developer (DPDP Act Compliance Lead)",
    profile:
      "Company size: 200-5,000 employees | Industry: Residential real estate development | Geography: Bengaluru, Mumbai, Hyderabad, Pune, Chennai, Delhi NCR | Buyer: VP Customer Experience / Head of Post Sales / CXO | Budget: INR 15-75 lakh per project per year | Current stack: MyGate + WhatsApp + Excel billing + email communication",
    components: [
      {
        title: "COMPONENT 1 - SALES MOTION | TARGET GROUP 1",
        sections: [
          {
            title: "",
            columns: ["Sales Element", "Details"],
            rows: [
              [
                "ICP Definition",
                "Enterprise residential developer with 500+ unit project in Tier 1 India city. Has used MyGate, ApnaComplex, or NoBrokerHood for at least 6 months. Has a dedicated VP Customer Experience or Head of Post Sales as a named role. Developer is either listed, or has institutional PE backing, or has CREDAI enterprise membership.",
              ],
              [
                "Lead Source",
                "CREDAI and NAREDCO annual conference delegate lists. LinkedIn Sales Navigator targeting 'VP Customer Experience', 'Head of Post Sales', 'VP CRM' at developer companies with 200+ employees. Referrals from deployed clients. DPDP Act consultant networks who advise developers on compliance.",
              ],
              [
                "Outreach Approach",
                "Cold outreach opening line: 'Under DPDP Act 2023, your company is the data fiduciary for every resident's personal data stored on MyGate or ApnaComplex servers. We are the only platform where your data stays on your servers. Can we show you what that means in practice in 20 minutes?' This creates urgency before a product demo.",
              ],
              [
                "First Meeting Agenda",
                "15 minutes: DPDP Act compliance audit - show the developer exactly which resident data types are currently stored on third-party servers and what the regulatory exposure is. 10 minutes: White-label demonstration - show their brand on the app, not ours. 5 minutes: Migration commitment - how we move their data from the current platform to self-hosted without losing historical records.",
              ],
              [
                "Demo Flow",
                "Open with a branded app mockup using the developer's actual logo and colour palette (prep this before the call). Show visitor approval flow from resident's perspective. Show CAM billing invoice generation. Show the community health score dashboard. End with 'Your brand, your data, your control' closing frame.",
              ],
              [
                "Deal Velocity Target",
                "60-90 day average sales cycle. Enterprise developers require legal review of data storage contracts (2-3 weeks), technical review of self-hosted architecture (1-2 weeks), and procurement committee approval (2-4 weeks). Budget for 3-4 meetings before contract signature.",
              ],
              [
                "Primary Sales Motion",
                "DPDP Act compliance displacement of MyGate. Lead with regulatory risk. Follow with brand equity argument. Close with a data migration guarantee that removes switching cost anxiety.",
              ],
              [
                "Why this motion",
                "DPDP Act enforcement is the single biggest externally driven urgency in the enterprise developer market in 2025-2026. It converts a 'nice to have' platform conversation into a 'legal obligation' conversation. No competitor can address the DPDP Act risk because they are the source of the risk.",
              ],
              [
                "Recommended opening hook",
                "'Your residents' names, contact numbers, gate entry logs, and billing history are currently on servers owned by a company you did not choose as your data partner. The DPDP Act 2023 makes you legally responsible for that data. We can show you a 15-minute audit of exactly what's at risk.'",
              ],
              [
                "Economic buyer (how to identify)",
                "The VP Customer Experience or CXO who owns the developer-resident relationship budget. Identify by checking LinkedIn for 'Head of Post Sales' or 'VP CRM' titles at the target developer. If the role does not exist, the CFO or COO owns the decision.",
              ],
              [
                "Champion (Internal Advocate)",
                "VP Customer Experience or Head of Post Sales who is measured on NPS scores and referral lead volume. They benefit directly from a branded resident channel and a referral capture module. Build the business case around their KPIs.",
              ],
              [
                "Co-Champion",
                "CTO or Head of IT who approves the self-hosted architecture. Give them the technical architecture document early. Their sign-off is required before legal review begins.",
              ],
              [
                "Blocker to anticipate",
                "IT team blocking on self-hosting infrastructure cost and setup effort. Prepare a pre-scoped cloud hosting setup guide showing exact Azure or AWS configuration required and estimated monthly hosting cost (typically INR 15,000-40,000 per month for a 500-unit deployment).",
              ],
              [
                "What closes this TG",
                "A reference client call with a peer developer who has already migrated from MyGate to our platform. Peer validation removes the last risk perception barrier. The second closing tool is a DPDP Act data architecture attestation letter from our legal team confirming self-hosted data handling.",
              ],
            ],
          },
        ],
      },
      {
        title: "COMPONENT 2 - MARKETING CHANNELS | TARGET GROUP 1",
        sections: [
          {
            title: "",
            columns: [
              "Channel",
              "Relevant?",
              "Execution approach",
              "Priority rank",
              "Expected output",
              "Budget / Timeline",
            ],
            rows: [
              [
                "LinkedIn Sales Navigator",
                "Yes",
                "Target VP Customer Experience, Head of Post Sales, CTO at CREDAI-member developer companies with 200+ employees. Send DPDP Act compliance audit as lead magnet. Connect request + InMail sequence over 3 weeks.",
                "30-50 qualified conversations per quarter",
                "INR 1.5-2 lakh per quarter for Sales Navigator + SDR time",
              ],
              [
                "CREDAI / NAREDCO Events",
                "Yes",
                "Book exhibition stand at CREDAI Natcon and NAREDCO annual conferences. Sponsor 1-2 developer CX-focused sessions with a DPDP Act compliance topic. Invite 10-15 target accounts to a private roundtable dinner alongside the conference.",
                "50-100 warm enterprise leads per conference",
                "INR 8-15 lakh per event including stand, sponsorship, and dinner",
              ],
              [
                "Content / SEO",
                "Medium",
                "Publish 2 DPDP Act and post-possession content pieces per month targeting developer decision-makers. Keywords: 'DPDP Act community management', 'post possession platform India', 'white label resident app developer'. Long-tail developer-specific search traffic.",
                "500-1,000 organic monthly visitors from developer audience in 6 months",
                "INR 50-80K per month for content writer + SEO tools",
              ],
              [
                "Email Outbound",
                "Yes",
                "Build developer contact list from CREDAI member directory and LinkedIn. Send 3-email sequence anchored on DPDP Act audit offer. Personalise with developer project name and specific data sovereignty risk.",
                "5-8% reply rate, 2-3 qualified meetings per 100 contacts",
                "INR 30-50K per month for tooling and list building",
              ],
              [
                "Developer Conference Speaking",
                "Yes",
                "Submit speaker proposals to PropTech India, CREDAI CX Summit, and NAREDCO annual conference on the topic of DPDP Act compliance in post-possession management. Position as thought leadership, not product pitch.",
                "Brand credibility elevation + 20-40 warm leads per speaking slot",
                "INR 0-2 lakh (speaking fee sometimes paid; nominal preparation cost)",
              ],
              [
                "Partner Referrals",
                "Yes",
                "Deployed developer clients refer peer developers. Introduce a formal referral program with INR 1-3 lakh referral credit per signed enterprise deal. Developer networks are highly interconnected - peer recommendation is the strongest trust signal.",
                "3-5 referral leads per quarter per deployed enterprise client",
                "INR 1-3 lakh referral credit per signed deal",
              ],
              [
                "Google Search Ads",
                "Medium",
                "Bid on high-intent keywords: 'post possession management software', 'resident management app developer India', 'DPDP compliant community app'. Limited search volume but high intent.",
                "50-100 developer-qualified leads per month at INR 200-400 per click",
                "INR 1-1.5 lakh per month",
              ],
              [
                "YouTube / Video Content",
                "Low",
                "Demo videos and DPDP Act explainer content for YouTube. Lower priority than direct enterprise sales for this TG.",
                "Brand awareness and inbound from developer research phase",
                "INR 30-50K per video production",
              ],
              [
                "Industry Associations",
                "Yes",
                "Join CREDAI and NAREDCO as a PropTech partner. Participate in PropTech India forum. Sponsor CREDAI Knowledge Hub. Access to member directory and event speaking opportunities.",
                "Direct access to 500+ developer member contacts",
                "INR 3-5 lakh annual association membership and sponsorship",
              ],
              [
                "Cold Calling / SDR",
                "Medium",
                "SDR team calling CREDAI member list. Works best when anchored on DPDP Act compliance audit offer as opening. Warmer than generic product pitches.",
                "5-10% connect rate from warm list, 2-3% to meeting",
                "INR 50-80K per month per SDR",
              ],
            ],
          },
        ],
      },
      {
        title: "COMPONENT 3 - 90-DAY LAUNCH SEQUENCE | TARGET GROUP 1",
        sections: [
          {
            title: "DAYS 1-30 - FOUNDATION AND PIPELINE BUILD",
            columns: [
              "Week",
              "Sales Action",
              "Marketing Action",
              "Key Product Milestone",
              "Success Metric",
            ],
            rows: [
              [
                "Week 1-2",
                "Build target account list of 50 enterprise developers from CREDAI directory. Research each for current platform (MyGate/ApnaComplex) via App Store search and LinkedIn.",
                "Create DPDP Act compliance audit one-pager. Design branded app mockup template using target developer's logo for demo prep.",
                "Prepare demo environment with 3 sample projects pre-loaded",
                "50 target accounts researched and prioritised",
              ],
              [
                "Week 3",
                "Begin LinkedIn outreach to 20 VP Customer Experience contacts with DPDP Act compliance audit offer. Aim for 5 meeting bookings.",
                "Publish first DPDP Act and post-possession content piece on LinkedIn and company blog.",
                "Complete developer dashboard mockup for demo",
                "5 discovery calls booked",
              ],
              [
                "Week 4",
                "Run first 5 discovery calls. Qualify for data sovereignty need, white-label requirement, and platform switching readiness.",
                "Launch Google Search Ads for DPDP compliant community management keywords.",
                "Production environment ready for pilot deployment",
                "3 qualified opportunities identified for pilot proposal",
              ],
              [
                "Week 5-8 followup",
                "Send pilot proposals to 3 qualified accounts. Proposal covers 60-day pilot at 1 project, full migration guarantee, and DPDP Act architecture attestation.",
                "Invite pilot prospects to a private DPDP Act roundtable with a compliance lawyer and 1 deployed reference client.",
                "Pilot onboarding playbook finalised",
                "1 signed pilot agreement",
              ],
              [
                "Biggest risk",
                "Enterprise developers have long procurement cycles. 30-day target of 1 pilot signed is aggressive. Risk: Discovery calls qualify but budget approval takes 45-60 days.",
                "Mitigation: Anchor on DPDP Act regulatory deadline to create urgency that bypasses normal procurement timelines.",
              ],
            ],
          },
          {
            title: "DAYS 31-60 - PILOT DELIVERY AND EXPANSION",
            columns: [
              "Week",
              "Sales Action",
              "Marketing Action",
              "Key Product Milestone",
              "Success Metric",
            ],
            rows: [
              [
                "Week 5-6",
                "Deploy first pilot at 1 enterprise developer project (500+ units). On-site implementation with FM team training.",
                "Document pilot deployment as a case study in progress. Capture before/after metrics on complaint resolution time and billing collection.",
                "Analytics dashboard Phase 1 delivered during pilot",
                "Pilot go-live within 7 days of contract signature",
              ],
              [
                "Week 7-8",
                "Begin 2 new enterprise sales conversations from CREDAI event leads. Use pilot progress data as social proof.",
                "Publish DPDP Act compliance comparison article (MyGate vs Post Possession data architecture). Target developer LinkedIn audience.",
                "ANPR integration Phase 1 scoped and in development",
                "2 new qualified enterprise conversations active",
              ],
              [
                "Week 9-10",
                "Conduct 30-day pilot review with developer client. Present community health score, MAR%, billing collection improvement, and resident app adoption data.",
                "Request video testimonial from pilot client. Use in next 5 enterprise demos.",
                "Pilot metrics baseline established for case study",
                "30-day MAR% at pilot site exceeds 50%",
              ],
              [
                "Week 11-12",
                "Convert pilot to full contract. Propose expansion to 2-3 additional projects in developer portfolio.",
                "Announce first referenceable deployment (with developer consent) on LinkedIn.",
                "Community health dashboard live at pilot site",
                "1 full contract signed, 2 expansion conversations started",
              ],
              [
                "Biggest risk",
                "Pilot fails to achieve 50% MAR by Day 30 due to low resident download rate. Risk of pilot-to-contract conversion failure.",
                "Mitigation: Assign dedicated customer success resource to pilot. Run WhatsApp-based resident activation campaign during pilot week 1-2.",
              ],
            ],
          },
          {
            title: "DAYS 61-90 - SCALE AND REFERENCE CLIENT BUILD",
            columns: [
              "Week",
              "Sales Action",
              "Marketing Action",
              "Key Product Milestone",
              "Success Metric",
            ],
            rows: [
              [
                "Week 13-14",
                "Deploy at 2 additional enterprise developer projects. Use first signed client as reference in all new enterprise demos.",
                "Submit speaker application for CREDAI Natcon with 'DPDP Act and post-possession data sovereignty' topic.",
                "ANPR integration Phase 1 in beta testing",
                "3 enterprise clients live on platform",
              ],
              [
                "Week 15-16",
                "Run IFM partnership conversation with 2 national IFM companies. Present platform as a reseller opportunity for their developer client base.",
                "Publish first case study showing before/after metrics: billing collection cycle, ticket resolution time, resident app adoption.",
                "Case study metrics verified and published",
                "2 IFM partnership conversations active",
              ],
              [
                "Week 17-18",
                "Close 2nd and 3rd enterprise deals. Begin 90-day target review against KPIs.",
                "Host a private DPDP Act compliance webinar for 20 target developer accounts with a compliance lawyer as co-presenter.",
                "AI predictive maintenance Phase 1 roadmap confirmed",
                "3 signed enterprise contracts, 1 IFM partnership in LOI",
              ],
              [
                "Closeout",
                "Review: Units under contract, pipeline quality, top 3 deal-loss reasons by competitor and objection type.",
                "Review: LinkedIn engagement rate, content leads generated, CREDAI event ROI vs target.",
                "Review: MAR% at all live sites, support ticket volume trend, NPS proxy score",
                "90-day target: 3 signed enterprise contracts, 15,000+ units under management",
              ],
              [
                "Biggest risk",
                "Only 1 enterprise deal closed vs 3-deal target. Risk of pipeline-to-close conversion being slower than projected.",
                "Mitigation: Add 1 mid-market developer segment (200-500 units) as a parallel pipeline to offset enterprise sales cycle delays.",
              ],
            ],
          },
        ],
      },
      {
        title:
          "COMPONENT 4 - PARTNERSHIP AND RESELLER STRATEGY | TARGET GROUP 1",
        sections: [
          {
            title: "",
            columns: ["Partnership Element", "Details"],
            rows: [
              [
                "Timing for partnerships",
                "Month 3-6 after first 2-3 enterprise reference clients are deployed and producing case study data. Partnership conversations require proof of deployment quality.",
              ],
              [
                "Partner Type 1 - DPDP Act Compliance Consultants",
                "Who: Legal and compliance advisory firms advising developers on DPDP Act obligations (KPMG India Legal, Nishith Desai Associates, Cyril Amarchand Mangaldas PropTech practice). What we offer: Certified compliant platform they can recommend to clients. India profile: Developers paying INR 20-50 lakh for DPDP Act compliance audits are pre-warmed for a platform solution. Global profile: Not applicable - DPDP Act is India-specific. Red flag to avoid: Consultants who also advise competing platforms - creates conflict of interest.",
              ],
              [
                "Partner Type 2 - Developer CRM and Sales Tech Vendors",
                "Who: Real estate CRM vendors like Sell.Do, Salesforce India PropTech practice, and 99acres developer tools. What we offer: Post-possession layer that integrates with their pre-sales CRM, giving their developer clients a full resident lifecycle platform. India profile: 500+ developers using Sell.Do or similar CRM are pre-qualified prospects for Post Possession. Global profile: Salesforce partner ecosystem provides global developer group access. Red flag to avoid: Partners who are building their own post-possession module (Sell.Do has post-possession ambitions).",
              ],
              [
                "Year 1 Partnership Structure",
                "2-3 signed IFM company reseller agreements (CBRE India FM, Jones Lang LaSalle India, Knight Frank India FM preferred targets). Commission structure: 15-20% of first-year ACV per property deployed through partner. Platform co-branding: IFM partner name on admin console, our white-label app retains developer brand. Contract: 2-year reseller agreement with minimum deployment commitments.",
              ],
            ],
          },
        ],
      },
    ],
    summaryCards: [
      {
        label: "Best sales motion",
        value:
          "DPDP Act compliance displacement of MyGate. Lead with regulatory risk before product features.",
      },
      {
        label: "Most important Week 1 action",
        value:
          "Build DPDP Act compliance audit one-pager and branded demo mockup template. Without these two assets, no enterprise sales motion can begin.",
      },
      {
        label: "Top 2 marketing channels",
        value:
          "1. LinkedIn Sales Navigator targeting VP Customer Experience / Head of Post Sales. 2. CREDAI and NAREDCO annual conference presence.",
      },
      {
        label: "Biggest risk to watch",
        value:
          "Enterprise procurement cycles extending beyond 90 days. Mitigation: Always have 3x the pipeline needed to hit quarterly targets.",
      },
      {
        label: "90-day goal",
        value:
          "3 signed enterprise contracts covering 15,000+ apartment units.",
      },
      {
        label: "What closes this TG",
        value:
          "A peer developer reference call + a DPDP Act data architecture attestation letter from our legal team.",
      },
      {
        label: "Key partner type",
        value:
          "DPDP Act compliance consultants (KPMG, Nishith Desai) and developer CRM vendors (Sell.Do).",
      },
      {
        label: "Primary buyer",
        value:
          "VP Customer Experience / Head of Post Sales. Economic approver: CFO or COO. Technical approver: CTO.",
      },
    ],
    summaryText:
      "TG 1 SUMMARY: Enterprise developers are the highest-value segment and the most urgency-driven by external regulatory pressure (DPDP Act 2023). The sales motion is compliance-led, not features-led. Every conversation begins with a 15-minute DPDP Act audit showing the developer exactly what data is currently at risk on third-party servers. The key assumption is that DPDP Act enforcement creates enough urgency to shorten procurement cycles from 6-12 months to 60-90 days. The one metric that tells us this motion is working: pilot-to-contract conversion rate above 70% within 30 days of pilot go-live.",
  },
  {
    title:
      "TARGET GROUP 2 - IFM / Property Management Company (Tool Consolidation Lead)",
    profile:
      "Company size: 200-2,000 FM staff | Industry: Integrated Facility Management | Geography: Pan-India (Bengaluru, Mumbai, Delhi NCR primarily) | Buyer: Operations Director / VP FM Operations | Budget: INR 5-30 lakh per year for 10+ property portfolio | Current stack: 1 FM ticketing software + Excel billing + WhatsApp + paper attendance + physical visitor books",
    components: [
      {
        title: "COMPONENT 1 - SALES MOTION | TARGET GROUP 2",
        sections: [
          {
            title: "",
            columns: ["Sales Element", "Details"],
            rows: [
              [
                "ICP Definition",
                "IFM company managing 10+ residential properties in India. Has a dedicated operations team using at least 3 different tools simultaneously. Has active conversations with developer clients about digital platform capability.",
              ],
              [
                "Lead Source",
                "IFM industry associations (IFMA India, BIFM India). LinkedIn targeting 'Operations Director', 'VP FM Operations', 'Head of Property Management' at IFM companies with 200+ employees. Referrals from developer clients who use our platform and recommend it to their IFM partner.",
              ],
              [
                "Outreach Approach",
                "Opening: 'Your team currently manages 3-5 disconnected tools per property. We consolidate ticketing, gate management, CAM billing, staff attendance, and compliance tracking into one platform. We can show you a 20-minute demo comparing your current tool count to our single console.' ROI-led, not compliance-led.",
              ],
              [
                "First Meeting Agenda",
                "Tool audit: ask the operations director to list every tool their team uses per property. Map each to a Post Possession module. Present the unified dashboard showing all 6-10 replaced tools in one view. Present SLA reporting capability as the primary value for their developer client relationships.",
              ],
              [
                "Demo Flow",
                "Show the FM operations console - not the resident app. Focus on ticket management with SLA tracking, checklist module replacing paper inspection forms, gate management replacing the paper visitor register, and the billing module replacing Excel. End with the multi-property portfolio dashboard.",
              ],
              [
                "Deal Velocity Target",
                "30-50 day average sales cycle for IFM companies. Decision made by operations director with CFO sign-off for multi-property contracts. Budget is recurring operational expense - no capital approval required. Faster cycle than enterprise developer deals.",
              ],
              [
                "Primary Sales Motion",
                "Tool consolidation ROI demonstration. Present the cost of 6-10 disconnected tools + manual coordination effort in time vs. our consolidated platform fee. ROI is typically positive within 3-6 months of deployment.",
              ],
              [
                "Why this motion",
                "IFM companies are motivated by operational efficiency and contract renewal risk. Developer clients increasingly require digital platform capability in IFM RFPs. Our platform becomes the IFM company's differentiated capability in their own client proposals.",
              ],
              [
                "Recommended opening hook",
                "'Your team is managing 3 separate tools just for one property - and none of them talk to each other. We replace all of them with one console and give your developer client a branded app that makes them look like they planned post-possession from day one.'",
              ],
              [
                "Economic buyer",
                "Operations Director is the buyer. CFO signs off on multi-property contracts above INR 10 lakh per year. Identify the Operations Director through LinkedIn; CFO is usually not reachable until final contract stage.",
              ],
              [
                "Champion (Internal Advocate)",
                "The FM manager at a specific property who has the most acute tool sprawl pain. Identify through the operations director's team. Get the FM manager to demo the platform operationally - their endorsement moves the operations director.",
              ],
              [
                "Co-Champion",
                "Business Development Director at the IFM company who wants to use our platform as a differentiator in their own client RFP responses. Platform capability becomes their win story.",
              ],
              [
                "Blocker to anticipate",
                "IT or security team concerned about integrating a new platform with existing building systems. Prepare integration architecture document showing how Post Possession integrates with access control, RFID, and boom barrier systems they already have.",
              ],
              [
                "What closes this TG",
                "A 30-day pilot at 1-2 properties showing measurable SLA improvement and tool consolidation. IFM companies want to see the numbers before committing to a multi-property agreement.",
              ],
            ],
          },
        ],
      },
    ],
    summaryCards: [
      {
        label: "Best sales motion",
        value:
          "Tool consolidation ROI demonstration. Count their current tools per property and replace all with one console.",
      },
      {
        label: "Most important Week 1 action",
        value:
          "Build IFM-specific ROI calculator showing annual cost of tool sprawl vs. Post Possession consolidated fee.",
      },
      {
        label: "Top 2 marketing channels",
        value:
          "1. IFMA India and BIFM India events. 2. Developer client referrals - when a developer uses our platform, introduce to their IFM partner.",
      },
      {
        label: "Biggest risk to watch",
        value:
          "IFM company delays multi-property roll-out due to developer client approval requirement. Each property they manage requires the developer client's consent to change platform.",
      },
      {
        label: "90-day goal",
        value:
          "1 signed IFM multi-property agreement covering 5,000+ apartment units.",
      },
      {
        label: "What closes this TG",
        value:
          "30-day pilot at 1-2 properties with measurable SLA improvement and verified tool count reduction.",
      },
    ],
    summaryText:
      "TG 2 SUMMARY: IFM companies are the most efficient channel for scale because one IFM partnership deploys across their entire client portfolio simultaneously. The motion is ROI-led - show the tool consolidation saving and the SLA improvement in a 30-day pilot before asking for a multi-property commitment. The key assumption is that developer clients of the IFM company will consent to platform change - this is why developer TG1 wins must come before IFM TG2 pitches where possible. The one metric that tells us this motion is working: pilot-to-multi-property conversion rate above 80%.",
  },
  {
    title:
      "TARGET GROUP 3 - RWA / Apartment Owners Association (Billing Automation Lead)",
    profile:
      "Organisation size: Volunteer committee of 5-15 members | Industry: Residential community self-management | Geography: Tier 1 India cities, premium communities of 500+ units | Buyer: RWA President / Secretary / Treasurer | Budget: INR 3-15 lakh per year from community corpus | Current stack: Bank transfer for billing + WhatsApp for communication + paper visitor register + physical notice board",
    components: [
      {
        title: "COMPONENT 1 - SALES MOTION | TARGET GROUP 3",
        sections: [
          {
            title: "",
            columns: ["Sales Element", "Details"],
            rows: [
              [
                "ICP Definition",
                "RWA managing 500+ units in a premium Tier 1 India residential community. Formed at least 12 months ago. Has experienced at least 1 collection default dispute or security incident that manual processes could not resolve. Has at least 2 committee members with corporate backgrounds who can evaluate technology solutions.",
              ],
              [
                "Lead Source",
                "Resident forums and RWA community groups on Facebook, WhatsApp, and LinkedIn. Housing society management groups. Developer client referrals - when a developer hands over to RWA, introduce Post Possession as the recommended platform. Google Search targeting 'housing society management software India'.",
              ],
              [
                "Outreach Approach",
                "Opening: 'Your maintenance collection is probably running at 60-75% because payment is by bank transfer and reminders go to WhatsApp groups. We automate invoice generation, UPI payment, and defaulter flagging so collection goes to 90%+ in 60 days. Can we show you a 20-minute demo?' Collection efficiency is the primary pain.",
              ],
              [
                "First Meeting Agenda",
                "Show the billing module - automated invoice generation, UPI payment button, payment reminder sequence, and defaulter flagging with service restriction. Show the visitor management module replacing the paper register. Show the notice board replacing WhatsApp broadcasts. Let the RWA treasurer run a demo invoice themselves.",
              ],
              [
                "Demo Flow",
                "Let the committee treasurer or secretary interact with the platform directly during the demo. Hands-on demos convert 3x better than passive presentation for RWA audiences. Show a billing report showing 90%+ collection rate at a reference community.",
              ],
              [
                "Deal Velocity Target",
                "45-60 day cycle from first meeting to signed contract for premium RWAs with strong committee. Requires committee vote (usually 2/3 majority) and corpus fund approval. Procurement decision is collective, not individual - allow time for committee discussion between meetings.",
              ],
              [
                "Primary Sales Motion",
                "Billing automation lead with security digitalisation as second driver. Lead with collection efficiency improvement. Follow with visitor management digital audit trail. Close with 60-day pilot offer.",
              ],
              [
                "Why this motion",
                "RWA committees are volunteers managing community finances. Billing collection is their most visible and most stressful operational responsibility. A platform that solves billing collection automatically becomes a committee champion's biggest win.",
              ],
              [
                "Recommended opening hook",
                "'Your RWA is probably collecting 65-75% of maintenance dues each month because bank transfer reminders don't work. In the communities we've deployed in, collection goes above 90% in 60 days because residents pay with one UPI tap from their phone.'",
              ],
              [
                "Economic buyer",
                "RWA Treasurer approves expense. President provides final sign-off. Both must be in the same demo or a follow-up call. Never proceed to proposal stage without both treasurer and president having seen the platform.",
              ],
              [
                "Champion (Internal Advocate)",
                "RWA Secretary who manages day-to-day complaints and communication. Their workload is most directly reduced by the helpdesk and communication modules. Build the case around their personal time saving.",
              ],
              [
                "Co-Champion",
                "1-2 tech-savvy committee members who have used similar tools in their corporate lives. They become internal advocates in the committee vote.",
              ],
              [
                "Blocker to anticipate",
                "Committee members resistant to technology change, particularly older residents. Offer a 60-day pilot with a 100% reversal guarantee - if the committee is not satisfied, no charge and full data return. Remove all adoption risk.",
              ],
              [
                "What closes this TG",
                "A reference call with a peer RWA committee president from a similar-sized community showing the before/after collection rate and the committee workload reduction. Peer RWA endorsement is the strongest closing tool for committee decision-making.",
              ],
            ],
          },
        ],
      },
    ],
    summaryCards: [
      {
        label: "Best sales motion",
        value:
          "Billing automation demo + collection efficiency case study + 60-day pilot with reversal guarantee.",
      },
      {
        label: "Most important Week 1 action",
        value:
          "Build a committee presentation kit (5-slide deck) that the RWA champion can present to their committee independently after the first demo.",
      },
      {
        label: "Top 2 marketing channels",
        value:
          "1. Google Search Ads for 'housing society management software'. 2. Developer client referrals at possession handover - highest quality RWA leads.",
      },
      {
        label: "Biggest risk to watch",
        value:
          "Committee vote fails due to 1-2 vocal opponents. Mitigation: Get committee champion to share reference RWA contact before the vote.",
      },
      {
        label: "90-day goal",
        value: "5 signed RWA contracts covering 5,000+ apartment units.",
      },
      {
        label: "What closes this TG",
        value:
          "Peer RWA president reference call showing 90%+ collection rate within 60 days.",
      },
    ],
    summaryText:
      "TG 3 SUMMARY: RWAs are the highest-volume segment with shorter sales cycles but smaller deal sizes. The motion is collection-led because billing automation is the committee's most visible operational problem. The 60-day pilot with a reversal guarantee removes adoption risk and makes the decision easy for a volunteer committee. The key assumption is that the committee has at least 1-2 tech-savvy members who can champion the platform internally. The one metric that tells us this motion is working: 60-day collection rate at pilot communities exceeds 85%, which becomes the primary proof point in all RWA sales conversations.",
  },
];

const columnGridTemplate = (columnCount: number) => {
  if (columnCount <= 2) return "minmax(180px, 240px) minmax(520px, 1fr)";
  return `repeat(${columnCount}, minmax(180px, 1fr))`;
};

const columnGridMinWidth = (columnCount: number) => {
  if (columnCount <= 2) return "920px";
  if (columnCount <= 5) return "1120px";
  return "1280px";
};

const PostPossessionGTMTab: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in font-poppins text-[#2C2C2C]">
      <section className="rounded-t-xl border border-[#C4B89D] border-l-4 border-l-[#DA7756] bg-white p-6">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          {gtmMeta.title}
        </h2>
        <p className="mt-2 text-sm italic leading-relaxed text-[#4f4a43]">
          {gtmMeta.subtitle}
        </p>
      </section>

      <section className="space-y-12">
        {targetGroups.map((group, groupIndex) => (
          <article
            key={group.title}
            className="overflow-hidden rounded-xl border border-[#D3D1C7] bg-white shadow-sm"
          >
            <header className="border-b border-[#D3D1C7] bg-[#DA7756] px-5 py-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                Target Group {groupIndex + 1}
              </p>
              <h3 className="mt-1 text-base font-bold leading-relaxed">
                {group.title.replace(/^TARGET GROUP \d+ - /, "")}
              </h3>
            </header>

            <div className="border-b border-[#D3D1C7] bg-[#FFF7F1] p-4">
              <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
                <div className="border border-[#D3D1C7] bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7A3A20]">
                  Profile
                </div>
                <div className="border border-[#D3D1C7] bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-[#1A1A2E]">
                  {group.profile}
                </div>
              </div>
            </div>

            <div className="space-y-8 p-4 md:p-6">
              {group.components.map((componentItem) => (
                <div key={componentItem.title} className="space-y-3">
                  <h4 className="rounded-t-lg border border-[#D3D1C7] bg-[#A24A2A] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
                    {componentItem.title}
                  </h4>

                  <div className="space-y-5">
                    {componentItem.sections.map((section, sectionIndex) => {
                      const columns =
                        section.columns.length > 0
                          ? section.columns
                          : ["Element", "Details"];
                      return (
                        <div
                          key={
                            componentItem.title +
                            "-" +
                            (section.title || sectionIndex)
                          }
                          className="space-y-2"
                        >
                          {section.title ? (
                            <div className="border border-[#D3D1C7] bg-[#F4D4C3] px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-[#7A3A20]">
                              {section.title}
                            </div>
                          ) : null}

                          <div className="overflow-x-auto rounded border border-[#D3D1C7]">
                            <div
                              className="text-[12px] leading-relaxed"
                              style={{
                                minWidth: columnGridMinWidth(columns.length),
                              }}
                            >
                              <div
                                className="grid bg-[#DA7756] text-left text-[11px] font-bold uppercase tracking-wide text-white"
                                style={{
                                  gridTemplateColumns: columnGridTemplate(
                                    columns.length
                                  ),
                                }}
                              >
                                {columns.map((column) => (
                                  <div
                                    key={column}
                                    className="border border-[#D3D1C7] px-3 py-3"
                                  >
                                    {column}
                                  </div>
                                ))}
                              </div>

                              {section.rows.map((row, rowIndex) => (
                                <div
                                  key={row[0] + "-" + rowIndex}
                                  className={
                                    "grid " +
                                    (rowIndex % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#FFF7F1]")
                                  }
                                  style={{
                                    gridTemplateColumns: columnGridTemplate(
                                      columns.length
                                    ),
                                  }}
                                >
                                  {columns.map((_, cellIndex) => (
                                    <div
                                      key={cellIndex}
                                      className={
                                        "border border-[#D3D1C7] px-3 py-3 text-[#1A1A2E] " +
                                        (cellIndex === 0
                                          ? "font-bold text-[#7A3A20]"
                                          : "")
                                      }
                                    >
                                      {row[cellIndex] ?? ""}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <section className="overflow-hidden rounded-lg border border-[#D3D1C7] bg-white">
                <h4 className="border-b border-[#D3D1C7] bg-[#A24A2A] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
                  One-Page Summary
                </h4>
                <div className="grid gap-0 md:grid-cols-2">
                  {group.summaryCards.map((card, cardIndex) => (
                    <div
                      key={card.label + "-" + cardIndex}
                      className="grid grid-cols-[170px_minmax(0,1fr)] border-b border-[#D3D1C7] md:border-r md:[&:nth-child(even)]:border-r-0"
                    >
                      <div className="border-r border-[#D3D1C7] bg-[#FFF7F1] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A3A20]">
                        {card.label}
                      </div>
                      <div className="px-4 py-3 text-[12px] font-medium leading-relaxed text-[#1A1A2E]">
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#A24A2A] px-4 py-4 text-[13px] font-semibold leading-relaxed text-white">
                  {group.summaryText}
                </div>
              </section>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default PostPossessionGTMTab;
