import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import {
  ClipboardList,
  CheckSquare,
  MessageSquare,
  Calendar,
  Lightbulb,
  Bell,
  ShieldCheck,
  FileText, 
  Monitor,
  Presentation,
  PlayCircle,
  TrendingUp
} from "lucide-react";

/**
 * Project and Task Manager Product Data
 * ID: 10
 */
const taskManagerData: ProductData = {
  name: "Project and Task Manager",
  description: "An end-to-end work management solution designed to help teams plan, track, and execute projects efficiently. Centralizes tasks, timelines, ownership, and progress tracking.",
  brief: "A centralized platform enabling transparency, accountability, and faster delivery across teams by managing work efficiently from planning to execution.",
  userStories: [
    {
      title: "Project Management & Delivery",
      items: [
        "Create projects with tasks, milestones, and deadlines for easy progress tracking.",
        "High-level dashboards and reports for stakeholders to monitor delivery without micro-managing.",
        "Real-time visibility into task status and blockers for team leads to take corrective action early.",
      ],
    },
    {
      title: "Team Productivity",
      items: [
        "Personalized task views for team members to manage daily work and priorities efficiently.",
        "Collaboration through comments, mentions, and file attachments on specific tasks.",
        "Progress updates (To Do / In Progress / Done) for transparent team coordination.",
      ],
    },
    {
      title: "Administration & Security",
      items: [
        "Manage users, roles, and permissions to maintain data security and operational control.",
        "Detailed activity logs and audit trails for accountability across the project lifecycle.",
      ],
    },
  ],
  industries: "All (Generic Work Management)",
  usps: [
    "Simple, intuitive UI with minimal learning curve.",
    "Real-time visibility across projects and teams.",
    "Highly configurable workflows without heavy customization.",
    "Scales from small teams to enterprise use cases.",
    "Cost-effective compared to heavyweight PM tools.",
  ],
  includes: [
    "Project & task creation",
    "Task assignment, priorities, and due dates",
    "Status tracking, comments, and mentions",
    "Activity logs and audit trail",
    "Role-based access control",
  ],
  upSelling: [
    "Advanced analytics, Workflow automation, Mobile app access, AI prioritization.",
  ],
  integrations: [
    "Google/Outlook Calendar, Jira, GitHub/GitLab, Zoom/Meet, HRMS & Accounting tools.",
  ],
  decisionMakers: ["Head of Engineering/Operations, PMOs, Founders, CFO, COO"],
  keyPoints: [
    "Ease of use & Fast onboarding.",
    "Visibility & control over delivery timelines.",
    "Team productivity improvement through transparency.",
    "Reduced dependency on spreadsheets.",
  ],
  roi: [
    "Reduced project delays & improved on-time delivery.",
    "Higher team productivity & lower coordination overhead.",
    "Faster, data-driven decision-making.",
  ],
  assets: [
    {
      type: "Link",
      title: "Platform Overview",
      url: "#",
      icon: <Presentation className="w-5 h-5" />,
    },
  ],
  credentials: [
    {
      title: "Internal Sandbox Access",
      url: "https://tasks.lockated.com",
      id: "demo.pm@lockated.com",
      pass: "Task#Master",
      icon: <Monitor className="w-5 h-5" />,
    },
  ],
  owner: "Sadanand Gupta",
  ownerImage: "/assets/product_owner/sadanand_gupta.jpeg",
  extendedContent: {
    featureSummary: (
      <div className="-m-4 overflow-x-auto">
        <table className="w-full border-collapse text-xs bg-white">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <ClipboardList className="w-4 h-4 text-orange-500" /> Projects & Task Engine
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Projects with milestones, tasks, subtasks · Projects dashboard (8 chart types) · Task table with 15 columns · Issues register (client-raised) · Sprint management · Task vs To-Do logic (30-min rule)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <CheckSquare className="w-4 h-4 text-green-500" /> Todo
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Personal To-Do list · Kanban board (To Do / In Progress / On Hold / Done) · Eisenhower matrix (urgency-importance prioritisation)</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <FileText className="w-4 h-4 text-gray-400" /> Documents (MS Office Replacement)
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Create Word docs, Excel sheets, PPTs, PDFs inside the platform · Real-time collaborative editing · Export as official .docx / .xlsx / .pptx / .pdf · Data stored only on client's server</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Communication
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Direct messages · Group channels · Inline task creation from chat messages</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Calendar className="w-4 h-4 text-red-400" /> Minutes of Meeting
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Structured MoM with 9 data fields · Direct conversion of action points to tasks · Meeting type, mode, internal/client flag</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Lightbulb className="w-4 h-4 text-yellow-500" /> Opportunity Register
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Public forum for employee and external suggestions · Department tagging · Convert suggestion to task</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Bell className="w-4 h-4 text-orange-400" /> Notifications
                </div>
              </td>
              <td className="w-3/4 p-3 text-gray-700 leading-relaxed font-medium">Push notifications for task assignments, deadline reminders, MoM action points</td>
            </tr>
            <tr className="bg-blue-50/30">
              <td className="w-1/4 p-3 border-r border-gray-200 bg-blue-50/50">
                <div className="flex items-center gap-2 font-bold text-blue-700">
                  <ShieldCheck className="w-4 h-4 text-orange-400" /> Data Sovereignty (USP)
                </div>
              </td>
              <td className="w-3/4 p-3 text-blue-700 font-bold leading-relaxed">All data, documents, tasks, chats, MoMs, stored exclusively on the client's own database. No data ever leaves the client's environment.</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    productSummaryNew: {
      identity: [
        { field: "Product Name", detail: "Project & Task Manager by Lockated (GoPhygital.work)" },
        { field: "One-line Description", detail: "A focused project and task management platform, with documents, channels, MoM, and a public suggestion forum, where every piece of company data is stored exclusively on the client's own servers." },
        { field: "Category", detail: "Project Management Platform / Team Collaboration Tool" },
        { field: "Current Modules (Live)", detail: "Projects (Dashboard + Overview) · Tasks · Issues · Sprints · Channels (DMs + Groups) · Minutes of Meeting · Opportunity Register · Documents · Todo (Kanban + Eisenhower Matrix) · Notifications" },
        { field: "What Has Been Removed", detail: "Out of current scope (intentionally excluded): Company/Intranet layer · Home Dashboard · Tickets module · Employee Digital Pass · Performance Wallet · Desk Booking · Parking Management · Cafeteria Ordering · Calendar Sync · AI Assistant. Focused scope keeps onboarding fast and positioning clear." },
        { field: "Product Owner", detail: "Yash & Sadanand Gupta" }
      ],
      problemSolves: [
        {
          painPoint: "Core Pain Point",
          solution: "Organisations manage projects, client issues, team communication, and documents across 4–6 fragmented tools — Jira for tasks, Slack for chat, Google Docs for writing, email for MoMs. Every tool stores company data on vendor infrastructure. PTM consolidates project management, documents, communication, and idea capture in one platform, on infrastructure the client owns."
        },
        {
          painPoint: "The Data Sovereignty Gap",
          solution: "Every PM competitor (Asana, Monday, Notion, ClickUp, Jira) stores company data on their own cloud. PTM is the only platform in this price range where all data — project tasks, documents, channel messages, MoM records — stays on the client's own servers. This is a compliance differentiator for regulated industries and an IP protection advantage for all companies."
        }
      ],
      whoItIsFor: [
        {
          role: "Project Manager",
          useCase: "Creates projects, milestones, tasks. Tracks delivery. Reviews Issues.",
          frustration: "Chasing status updates across WhatsApp and email; MoM action items falling through the cracks.",
          gain: "One live dashboard; MoM auto-converts to tasks; nothing falls through the cracks."
        },
        {
          role: "Developer / Engineer",
          useCase: "Runs sprints, updates task status, raises issues, uses Channels for team sync.",
          frustration: "Context-switching between Jira, Slack, and email for one sprint cycle.",
          gain: "Sprint + task + channel + issue in one place; all project data on company servers."
        },
        {
          role: "Team Member (All Functions)",
          useCase: "Executes tasks, updates status, collaborates on documents, raises MoM.",
          frustration: "6 tools open simultaneously to complete one piece of work.",
          gain: "Tasks, docs, messages, and to-dos in one login."
        },
        {
          role: "Department Head / CXO",
          useCase: "Views project completion, assignee performance, milestone status across teams.",
          frustration: "No real-time visibility without asking; manual status updates.",
          gain: "Live project and milestone dashboard; cross-team task visibility."
        },
        {
          role: "IT / Admin Head",
          useCase: "Manages user roles, document permissions, data governance.",
          frustration: "Company data spread across Google, Atlassian, Slack — no unified control.",
          gain: "Full data sovereignty; one platform; RBAC across all modules."
        }
      ],
      today: [
        {
          dimension: "Single Most Defensible Position",
          state: "The only project management platform at SMB pricing where 100% of company data stays on infrastructure the client owns and controls. Documents export as real MS Office files. MoM auto-converts to tasks. All in one sovereign environment."
        },
        {
          dimension: "Key USPs vs Competitors",
          state: "1. Data sovereignty — no PM competitor at this price offers client-hosted data.\n2. MS Office document creation and export — eliminates MS 365 subscription for docs.\n3. MoM-to-task auto-conversion — unique workflow no competitor has.\n4. Opportunity Register — public innovation forum built into PM workflow.\n5. Kanban + Eisenhower dual view — rare in enterprise PM tools."
        },
        {
          dimension: "What We Are NOT (Scope Clarity)",
          state: "PTM is a focused project, task, and document management platform. It does not include HRMS features, intranet/social layer, desk booking, parking, F&B, or calendar sync in its current scope. This focus makes it fast to onboard, easy to position, and immediately valuable to any knowledge-working team."
        },
        {
          dimension: "Target Markets",
          state: "India (primary): Tech/SaaS, Professional Services, Real Estate, Manufacturing (50–500 employees, metro cities). GCC (secondary): UAE, Saudi Arabia, Qatar — regulated industries where data localisation is a compliance requirement."
        }
      ]
    },
    detailedFeatures: [
      { module: "Projects", feature: "Projects Dashboard (Analytics)", subFeatures: "", works: "Visual analytics for each project: project completion chart, milestone completion, assignee-wise milestone progress, task completion, assignee-wise task status, task dependencies map, project-wise issue breakdown, and assignee-wise issues.", userType: "All", usp: false },
      { module: "Projects", feature: "Projects Overview Table", subFeatures: "", works: "Table view of all projects with columns: Actions, ID, Code, Title, Status, Type, Manager, Completion %, Milestone Completion %, Task & Subtask Completion %, Task count, Subtask count, Milestone count, Issues, Start Date, End Date, Priority.", userType: "All", usp: false },
      { module: "Projects", feature: "Tasks Table", subFeatures: "", works: "Comprehensive task management table with columns: Actions, ID, Project, Milestone, Feature Name, Workflow Status, Responsible Person, Created By, Started Time, Time Left, Efforts/Duration, Predecessor, Successor, Completion %, Tag.", userType: "All", usp: false },
      { module: "Projects", feature: "Milestones as Modules", subFeatures: "", works: "All modules within a project are structured as Milestones. Each milestone contains Tasks and Subtasks, creating a clear three-tier hierarchy: Project → Milestone → Task → Subtask.", userType: "All", usp: false },
      { module: "Projects", feature: "Task vs To-Do Logic", subFeatures: "", works: "Any work item estimated at more than 30 minutes is classified as a Task. Items under 30 minutes are classified as To-Dos ,ensuring the right level of tracking for every type of work.", userType: "All", usp: false },
      { module: "Projects", feature: "Issues Register (Client Issues)", subFeatures: "", works: "Tracks issues raised by clients (not internal bugs) with full detail: Actions, ID, Project Name, Milestone, Task, Subtask, Title, Type, Priority, Status, Responsible Person, Raised By, Start Date, End Date, Comments.", userType: "All", usp: false },
      { module: "Projects", feature: "Sprints", subFeatures: "", works: "Connects sprints to their associated tasks in a table view. Includes sprint planning details, sprint scope, start/end dates, and task-level linkage for agile teams.", userType: "All", usp: false },
      { module: "Channels", feature: "Direct Messages", subFeatures: "", works: "1-on-1 messaging between employees within the platform ,keeps project communication in context without switching to WhatsApp or email.", userType: "All", usp: false },
      { module: "Channels", feature: "Group Channels", subFeatures: "", works: "Team or project-specific group chats for async collaboration ,all conversations are searchable and tied to the work context.", userType: "All", usp: false },
      { module: "Minutes of Meeting", feature: "Minutes of Meeting", subFeatures: "", works: "Structured MoM creation with fields: Meeting Title, Type, Mode, Date, Time, Internal/Client flag, Attendees, Points with Description, Raised By, Responsible Person, Due Date, Tags, Document Attachment. Each point can be converted into a Task directly.", userType: "All", usp: true },
      { module: "Opportunity Register", feature: "Public Suggestion Forum", subFeatures: "", works: "An open forum where any employee ,or even external visitors ,can post suggestions, ideas, or feedback for any team or the company. Public to all, encouraging a culture of open innovation.", userType: "All", usp: true },
      { module: "Documents", feature: "In-Platform Document Creation", subFeatures: "", works: "Create Word documents, Excel sheets, PowerPoint presentations, and PDFs directly within the platform ,no Microsoft 365 subscription required.", userType: "All", usp: true },
      { module: "Documents", feature: "Real-Time Collaboration", subFeatures: "", works: "Multiple team members can co-edit documents simultaneously within the platform ,similar to Google Docs but with data stored on the company's own servers.", userType: "All", usp: true },
      { module: "Documents", feature: "Export as Official MS Office Files", subFeatures: "", works: "When a document is shared externally, it is automatically converted and exported as a proper .docx, .xlsx, .pptx, or .pdf file ,maintaining full compatibility.", userType: "All", usp: true },
      { module: "Documents", feature: "Data Sovereignty", subFeatures: "", works: "All documents and data are stored on the company's own database infrastructure ,not on any third-party creator's servers. The company retains full ownership and control of its data.", userType: "All", usp: true },
      { module: "Documents", feature: "Document Sharing within Teams", subFeatures: "", works: "Share documents directly with colleagues or teams inside the platform ,no email attachments needed, with version control and access management.", userType: "All", usp: false },
      { module: "Todo", feature: "Personal To-Do Manager", subFeatures: "", works: "Personal task list for sub-30-minute items, displayed in both Kanban board and Eisenhower Matrix views ,ensuring lightweight tasks don't get lost in the project system.", userType: "All", usp: false },
      { module: "Todo", feature: "Kanban Board", subFeatures: "", works: "Drag-and-drop visual board showing tasks across status columns (To Do / In Progress / On Hold / Done) ,enables teams to manage workflow visually.", userType: "All", usp: true },
      { module: "Todo", feature: "Eisenhower Matrix", subFeatures: "", works: "A 2x2 urgency-importance matrix view of all personal To-Do items ,helps employees prioritize what to do now, schedule, delegate, or drop.", userType: "All", usp: true },
      { module: "Notifications", feature: "Real-Time Notifications", subFeatures: "", works: "Push notifications for task assignments, deadline reminders, MoM action points, and approval requests.", userType: "All", usp: false }
    ],
    detailedMarketAnalysis: {
      targetAudience: [
        {
          segment: "Technology / SaaS",
          demographics: "50–300 employees | Bengaluru, Pune, Hyderabad, Dubai | Growth-stage companies",
          industry: "Technology",
          painPoints: "1. Dev, PM, and ops teams run on 4+ tools (Jira, Slack, Confluence, Google Docs), no single source of truth for projects and tasks. 2. Sprint tracking, issue management, and MoMs happen in separate systems; action items from meetings are never formally tracked. 3. Company source code, roadmaps, and client data live on Atlassian/Google servers, no data ownership.",
          notSolved: "Sprint delays cascade into revenue delays. Meeting action items are lost, work discussed is not executed. One data breach on vendor infrastructure = regulatory exposure and client trust loss.",
          goodEnough: "Jira + Slack + Confluence + Google Docs. Team knows it's fragmented and expensive. 'Good enough' = WhatsApp for quick decisions + Jira for formal tracking + Google Docs for MoMs that nobody follows up on.",
          urgency: "HIGH",
          primaryBuyer: "CTO / VP Engineering"
        },
        {
          segment: "Real Estate & Construction",
          demographics: "5–50 active projects | Pan-India + UAE, Saudi | Mid-to-large developers",
          industry: "Real Estate & Construction",
          painPoints: "1. Project milestone tracking done entirely on WhatsApp and Excel, no formal task assignment, no deadline visibility. 2. Client complaints and snags tracked in email threads with no structured resolution or audit trail. 3. MoMs from site review meetings are typed in Word documents that nobody follows up on.",
          notSolved: "Construction delays cost ₹5–25L per day in penalty clauses. Client escalations go unresolved for weeks. MoM action items are forgotten, causing rework and blame cycles.",
          goodEnough: "MS Project for formal milestones (rarely updated). WhatsApp for daily coordination. Word documents for MoMs. Excel for client issues. Everyone knows this is broken.",
          urgency: "HIGH",
          primaryBuyer: "Project Director / COO"
        },
        {
          segment: "Professional Services (Consulting, Legal, Audit)",
          demographics: "20–150 professionals | Mumbai, Delhi, Bengaluru + Dubai DIFC",
          industry: "Professional Services",
          painPoints: "1. Client project deliverable tracking happens in email, no shared, auditable task system. 2. MoMs from client meetings are written in Word and emailed, action items are never formally tracked or assigned. 3. Client-sensitive documents stored on Google/Microsoft servers, confidentiality and compliance risk.",
          notSolved: "Missed client deadlines damage retainer relationships. Meeting action items are forgotten, clients complain 'nothing moved after the call.' Data on Google/Microsoft servers violates professional confidentiality obligations in DIFC and SEBI-regulated contexts.",
          goodEnough: "Monday.com or Asana for projects + Google Docs for documents + email for MoMs. 3 tools, 3 places to check. 'Good enough' is a well-managed Google Drive folder.",
          urgency: "HIGH",
          primaryBuyer: "Managing Partner / Practice Head"
        }
      ],
      companyPainPoints: [
        {
          companyType: "Indian SMB (50–300 employees)\nAll industries\nAnnual SaaS budget: ₹10–40L",
          pain1: "Project data spread across Jira, Asana, or Excel, no unified task and milestone view.",
          pain2: "MoM action items tracked in Word docs or email; follow-up is manual and inconsistent.",
          pain3: "Documents created in Google Docs/MS 365, client-sensitive content on vendor servers.",
          costRisk: "₹10–30L/yr on fragmented SaaS. 15–20 hrs/month management time lost to manual reporting. Data sovereignty exposure for regulated clients."
        },
        {
          companyType: "GCC Mid-Market (100–1000 employees)\nTech, Professional Services, BFSI\nDubai, Riyadh, Abu Dhabi",
          pain1: "UAE PDPL and Saudi NDMO data residency regulations require data to stay in-country, most SaaS PM tools cannot guarantee this.",
          pain2: "Sprint and project tracking tools (Jira/Asana) do not integrate with how Arabic-language teams communicate, dual system problem.",
          pain3: "MoM action tracking is entirely manual, decisions made in Arabic are typed in English in a different tool, creating gaps.",
          costRisk: "PDPL non-compliance fines up to AED 5M. Operational inefficiency from tool fragmentation adds 15–20% overhead to project timelines."
        },
        {
          companyType: "Indian Enterprise (500+ employees)\nManufacturing, BFSI, Real Estate\nMultiple city offices",
          pain1: "Project status consolidation requires manual effort, ops heads build status PPTs from Excel inputs every Monday.",
          pain2: "Client issue tracking (snags, complaints, escalations) is done in email, no structured register, no audit trail.",
          pain3: "SaaS contracts with foreign vendors trigger RBI/SEBI data localisation scrutiny.",
          costRisk: "10–15% of senior management time lost to status-update cycles. Client issue escalations damage retention. Data localisation risk growing."
        }
      ],
      competitorMapping: [
        {
          name: "Jira (Atlassian)",
          targetCustomer: "Developer-first, 50–5000 employees. Tech companies, product orgs. India metros + GCC.",
          pricing: "Free to 10 users. Standard ~$650/user/month. Premium ~$1,260/user/month.",
          discovery: "Developer communities, Atlassian Marketplace, Google search for 'bug tracking'.",
          strongestFeatures: "Industry standard in software dev. Deep sprint/agile tooling. 3000+ integrations. Strong India enterprise trust.",
          weakness: "Complex UI, non-technical teams abandon it. No native document creation. No MoM module. No data sovereignty. Expensive at scale.",
          marketGaps: "Non-dev teams at Jira companies (marketing, ops, legal) use Excel or Monday because Jira is too complex. PTM serves the 'rest of the company' alongside Jira. Pitch: 'Keep Jira for engineering. Use PTM for everyone else, with your data on your servers.'",
          threats: "Jira AI (auto-triage, intelligent sprint suggestions) is raising baseline AI expectations. Atlassian Intelligence will make their platform smarter."
        },
        {
          name: "Asana",
          targetCustomer: "Mid-market, 50–1000 employees. Marketing, ops, cross-functional teams. India and GCC growing.",
          pricing: "Free (10 users). Premium ~$915/user/month. Business ~$2,080/user/month.",
          discovery: "SEO (#1 for 'project management software'). Google Workspace Marketplace. Peer recommendations.",
          strongestFeatures: "Clean UI, low learning curve. Strong task + milestone + timeline. Good automation. Deep Google Workspace integration. Best brand recognition in category.",
          weakness: "No native document creation. No MoM module, action items live in Google Docs separately. No data sovereignty, all on Asana's AWS. Per-seat pricing escalates fast.",
          marketGaps: "Asana is the most common 'good enough' tool our prospects use. Displacement pitch: PTM replaces Asana + Google Docs in one platform, with your documents on your servers, not Asana's. The MoM-to-task workflow is a direct answer to Asana's biggest gap.",
          threats: "Asana AI (auto-assign, auto-status, smart goals) is live and aggressively marketed. AI features are ahead of most competitors."
        },
        {
          name: "Monday.com",
          targetCustomer: "Ops, marketing, project teams. 10–5000 employees. Strong GCC presence (UAE, Saudi offices).",
          pricing: "Basic ~$750/seat/month. Standard ~$1,000. Pro ~$1,580. Minimum 3 seats.",
          discovery: "Heavy digital advertising. SEO dominance. GCC sales team. Sports sponsorships.",
          strongestFeatures: "Highly visual and flexible. Strong automations. 200+ integrations. GCC local support. Good no-code customisation.",
          weakness: "Expensive at scale. No native document creation. No MoM module. No data sovereignty. No Opportunity Register.",
          marketGaps: "Monday is our biggest visual competitor in GCC marketing agencies. PTM pitch: same project visibility as Monday, plus documents, channels, and MoM, all on your servers. Significantly cheaper at 50+ seats.",
          threats: "Monday WorkOS rebranding targets full enterprise work platform. Their AI block and docs play is moving in our direction, watch if they ship a serious document module."
        },
        {
          name: "Notion",
          targetCustomer: "Startups, 1–200 employees. Very popular in India startup ecosystem. Growing in GCC tech.",
          pricing: "Free tier (powerful). Plus $8/user/month. Business $15/user/month. Enterprise custom.",
          discovery: "Viral word-of-mouth. Social media. App Store. Developer/designer community.",
          strongestFeatures: "Flexible wiki + database + task tool. Beautiful design. Free tier is genuinely useful. Notion AI is strong. Near-zero onboarding friction.",
          weakness: "Not a real PM tool, no sprints, no sprint velocity, no milestone hierarchy, no issues register, no RBAC. No MS Office export. Documents stay in Notion ecosystem. No MoM module.",
          marketGaps: "Notion is the default that startups drift to because it's free. PTM displacement: 'Notion is great for individuals. PTM is for teams that need sprint tracking, issues register, MoM-to-task, and data they actually own.' Document export as real .docx is a killer differentiator, Notion cannot do this.",
          threats: "Notion AI (auto-fill databases, summarise pages, generate from templates) is genuinely powerful and further ahead than most competitors."
        },
        {
          name: "ClickUp",
          targetCustomer: "All-in-one seekers. 10–1000 employees. Ops, PM, engineering. Growing in India and UAE.",
          pricing: "Free tier. Unlimited $7/user/month. Business $12/user/month.",
          discovery: "SEO targeting competitor keywords ('Asana alternative'). G2/Capterra. Referral program.",
          strongestFeatures: "Widest feature set, tasks, docs, goals, chat, sprints, dashboards. Very competitive pricing. 'Alternative to everything' positioning.",
          weakness: "Extremely complex UI, high churn from feature overwhelm. No data sovereignty. Documents are ClickUp-native, not exportable as real MS Office files. Weak enterprise credibility.",
          marketGaps: "ClickUp users frequently cite 'too overwhelming' as their reason to leave. PTM's cleaner structure (Project → Milestone → Task → Subtask) is a feature, not a limitation. Data sovereignty and real MS Office export are features ClickUp will not build.",
          threats: "ClickUp AI (auto-task creation, natural language commands) is expanding rapidly. Their roadmap explicitly targets replacing every PM and collaboration tool."
        },
        {
          name: "Microsoft 365 + Teams + Planner",
          targetCustomer: "Enterprise, 500+ employees. IT-standardised organisations. BFSI, manufacturing, government in India and GCC.",
          pricing: "MS 365 Business Standard ~$750/user/month. Teams included. Planner included but basic.",
          discovery: "Enterprise IT procurement. Microsoft Enterprise Agreements. SI partners (TCS, Infosys). Azure/Teams as Trojan horse.",
          strongestFeatures: "Deep enterprise trust. Data can be hosted on Azure India/UAE regions. SharePoint for documents. Teams for communication. Outlook calendar seamless.",
          weakness: "MS Planner is primitive, no milestones, no sprints, no issues register. No MoM module. No Opportunity Register. Expensive for SMBs. SharePoint collaboration is clunky vs modern tools.",
          marketGaps: "Mid-size Indian companies pay for MS 365 but still run projects on WhatsApp and Excel because Planner is too basic. PTM fills the project management gap without displacing Teams or Outlook. Position as 'the project layer on top of your Microsoft setup.'",
          threats: "Microsoft Copilot across Teams, Word, and Excel is Microsoft's biggest move. If Copilot becomes the standard AI layer across MS 365, the bar for any work tool rises significantly."
        }
      ],
      detailedPricing: {
        featuresVsMarket: [
          { area: "Task & Project Management", standard: "Create projects, assign tasks, set deadlines, track status. Basic hierarchy: Project → Task.", ourProduct: "Project → Milestone → Task → Subtask with 15-column task table, sprint management.", status: "AHEAD", notes: "Four-tier hierarchy is deeper than Asana or Monday. Only ClickUp matches this depth." },
          { area: "Project Dashboards & Analytics", standard: "Basic completion charts, assignee workload.", ourProduct: "8-chart project dashboard: completion, milestone, assignee-wise milestone, task status, task dependencies, issue.", status: "AHEAD", notes: "Dashboard depth matches Jira Premium. Most SMB tools offer 2–3 chart types maximum." },
          { area: "Issues Register (Client-Raised)", standard: "Most PM tools mix internal bugs with client issues or have no structured issue register.", ourProduct: "Dedicated client issues register separate from internal tasks: ID, project, milestone, task, type, priority, status, responsible", status: "AHEAD", notes: "Separate client issue register is rare. Competitors either mix bugs with client issues or rely on email." },
          { area: "Sprint / Agile Management", standard: "Jira: comprehensive. Asana, Monday: basic. ClickUp: moderate.", ourProduct: "Sprint module with task linking, sprint details, sprint-to-task association.", status: "AT PAR", notes: "Functional sprint management. Lacks velocity tracking and burndown charts — roadmap gap vs Jira." },
          { area: "Document Creation & Editing", standard: "External only (Google Docs, Notion, SharePoint). Almost no PM tool includes native doc creation.", ourProduct: "Full in-platform creation: Word, Excel, PPT, PDF. Real-time collaborative editing. Exports as official MS Office files.", status: "AHEAD (UNIQUE)", notes: "No PM competitor offers MS Office-compatible document creation and export. Replaces Google Workspace or MS 365 for document needs." },
          { area: "Data Sovereignty", standard: "All competitors store data on their own cloud. No SMB PM tool offers client-hosted data.", ourProduct: "All data (documents, tasks, chats, MoMs) stored exclusively on the client's own database.", status: "AHEAD (UNIQUE)", notes: "Structural differentiator that competitors cannot easily copy without rebuilding their architecture." },
          { area: "Minutes of Meeting (MoM)", standard: "Rarely built into PM tools. Usually Google Docs or a separate tool.", ourProduct: "Structured MoM with 9 data fields including direct conversion of action points to tasks.", status: "AHEAD (UNIQUE)", notes: "Auto-convert MoM action points to tasks saves 30+ minutes per meeting cycle. No PM competitor has this natively." },
          { area: "Opportunity Register", standard: "Not present in any PM competitor. Closest: Aha! for product feedback (B2B SaaS only).", ourProduct: "Public suggestion forum — employees or external visitors post ideas, tagged by module. Can be upvoted and auto-converted to tasks.", status: "AHEAD (UNIQUE)", notes: "Innovation capture built into the PM workflow. No direct competitor has this as a native PM feature." },
          { area: "Team Communication (Chat)", standard: "Most require Slack/Teams separately. ClickUp has basic chat.", ourProduct: "Direct messages + group channels. Inline task creation from chat messages.", status: "AT PAR with ClickUp", notes: "Functional. Not as mature as Slack threading — roadmap item." },
          { area: "Todo with Kanban + Eisenhower", standard: "Kanban is common. Eisenhower matrix is rare in enterprise PM tools.", ourProduct: "Personal to-do list with both Kanban board view and Eisenhower matrix (urgency × importance) view.", status: "AHEAD", notes: "Eisenhower matrix differentiation is rare. Most tools offer kanban only for personal tasks." },
          { area: "Mobile App", standard: "All major competitors have polished mobile apps (Jira, Asana, Monday, Notion, ClickUp).", ourProduct: "Not yet available.", status: "GAP", notes: "Critical gap for field teams, real estate site managers, any user away from a desk." },
          { area: "Third-party Integrations", standard: "Jira: 3000+. Asana: 200+. Monday: 200+.", ourProduct: "No third-party integrations currently. Roadmap: Jira, GitHub, Slack, accounting tools (Tally, Zoho Books).", status: "GAP", notes: "Will cost deals in tech companies where GitHub/Jira sync is expected." },
          { area: "Gantt / Timeline View", standard: "Industry standard for PM (Asana, Monday, MS Project).", ourProduct: "Native Gantt view not available. Relying on task list and dashboards.", status: "GAP", notes: "Losing head-to-head battles with Monday.com in construction/infrastructure planning sectors." },
          { area: "Workflow Automation", standard: "No-code automation (If this then that) in ClickUp, Monday, and Jira.", ourProduct: "Minimal. Currently relying on hardcoded status flows.", status: "GAP", notes: "Serious limitation for operations-heavy enterprise buyers who want custom triggers." },
          { area: "AI Assistant", standard: "Jira AI, Asana Intelligence, Monday AI, Notion AI.", ourProduct: "Not yet available.", status: "GAP", notes: "Roadmap: Must grounded on sovereign data to remain ahead on security while offering AI features." }
        ],
        comparisonSummary: {
          ahead: "Data sovereignty (unique) - MS Office document creation & export (unique) - MoM-to-task auto-conversion (unique) - Opportunity Register (unique) - 8-chart project dashboard (ahead) - 4-tier project hierarchy (deeper than most) - Client issues register (separate from internal bugs) - Eisenhower matrix for todos (rare)",
          atPar: "Team chat and channels (functional, not as mature as Slack) - Sprint management (functional, lacks burndown/velocity charts)",
          gaps: "Mobile app (losing every deal with field teams or mobile-first users) - Gantt/timeline view (losing head-to-head vs Asana/Monday) - Workflow automation (ops-heavy buyers expect this) - Third-party integrations (tech companies expect GitHub/Jira sync) - AI assistant (not in current scope; when added, must be grounded on sovereign data to differentiate)"
        },
        pricingLandscape: [
          { category: "Our India / GCC Recommended Pricing", details: "₹599–799 / AED 28–35 per user / month (min 50 users).\nPremium of 30% justified exclusively for Data Sovereignty + MS Office Edit module." },
          { category: "Market Standard (Asana / Monday / Jira)", details: "₹800–1,800 / user / month. PTM is undercuting them by 20–40% while offering more modules but less polish." },
          { category: "6-Month Pricing Roadmap", details: "Maintain ₹799 price point until Mobile App is released. Once Mobile App is Live, move to ₹999 / user / month." },
          { category: "18-Month Pricing Outlook", details: "Move to Tiered Pricing: Starter (₹799), Pro (₹1299), Enterprise (₹1999 + Sovereign Hosting Fee)." },
          { category: "Pricing Risk Advisory", details: "Do NOT compete on price with Notion or ClickUp (who offer ₹0–400 tiers). If we do, we lose the 'Enterprise Trust' positioning." }
        ],
        positioning: [
          { category: "Single most defensible position", details: "The only project management platform where 100% of your company's data (tasks, documents, MoMs, communications) stays on infrastructure you own. With MS Office document creation built in." },
          { category: "Segments to prioritise this year", details: "1. Tech/SaaS companies (50–300 employees, India metros) — highest urgency, fastest cycle, engineering teams drive adoption\n2. Professional Services (consulting, legal, audit) in India + GCC — data sovereignty is a compliance requirement, MoM-to-task is immediately compelling\n3. Lockated existing clients (all industries) — zero CAC, warm relationships, cross-sell motion" },
          { category: "Competitor to displace most aggressively", details: "Asana. It is the most common 'good enough' tool in target segments. Has no document creation, no MoM module, no sovereign storage. Displacement message: 'Replace Asana + Google Docs with one platform where your data never leaves your building.'" },
          { category: "What to STOP doing or saying", details: "STOP: Pitching as 'just another PM tool' — leads with feature list instead of sovereignty story\nSTOP: Saying 'we replace Jira' — instead say 'keep Jira for engineering, use PTM for everyone else'\nSTOP: Discounting to compete with Notion/ClickUp pricing\nSTOP: Mentioning removed features (wallet, desk/space booking features, F&B, AI) in sales decks — creates expectation confusion" },
          { category: "Recommended GTM motion Year 1", details: "Founder-led direct sales (first 20 accounts). India-first outbound to CTOs, VPs Engineering, Managing Partners. Lockated existing clients as cross-sell pipeline. 2–3 invite-only roundtables on 'data sovereignty in work management'. GITEX (Dubai) for GCC presence." }
        ]
      },
      detailedUseCases: {
        industryUseCases: [
          {
            rank: "1",
            industry: "Technology & SaaS Companies",
            features: "Dev teams use Sprints + Issues + Kanban for engineering workflows. PM teams run project dashboards with milestone tracking. Product managers create MoMs from client calls and auto-convert to tasks. Leadership monitors assignee-level completion and burn rates. All teams use Channels + DMs for collaboration. Data sovereignty is critical as code and product roadmaps are IP.",
            useCase: "Technology companies require sovereign task management to protect IP and meet government compliance while reducing their SaaS footprint (replacing Jira + Slack + Google Docs).",
            urgency: "HIGH. Jira/Atlassian pricing increases and data residency mandates for government SaaS contracts are live pain.",
            primaryBuyer: "CTO / VP Engineering (measured on sprint velocity, release frequency, engineering headcount efficiency).",
            primaryUser: "Developer / PM (frustrated by context-switching between Jira, Slack, Confluence, email).",
            profile: "50-500 employees. India metro cities (Bengaluru, Pune, Hyderabad, Mumbai) or GCC (Dubai, Abu Dhabi). Growth-stage or scaling.",
            currentTool: "Jira + Confluence + Slack + Google Workspace (4 separate bills)"
          },
          {
            rank: "2",
            industry: "Real Estate Developers & Construction",
            features: "Project tracking across multiple site construction milestones. Client issue register to track snags, requests, and complaints post-handover. MoM for weekly site reviews auto-converted to site tasks. Attendance tracking for site staff. Document drive for BOQs, drawings, and reports (replacing Google Drive + WhatsApp).",
            useCase: "Replacing chaotic WhatsApp groups and isolated Excel trackers with a single source of truth for site progress and client issues.",
            urgency: "HIGH. Construction delays cost crores per day; no structured digital task tracking exists at most mid-size developers.",
            primaryBuyer: "Project Director / COO (measured on on-time project delivery, cost overrun %, client satisfaction scores).",
            primaryUser: "Site Manager / Project Engineer (frustrated that WhatsApp messages become the task system and nothing is auditable).",
            profile: "Mid-to-large developers with 5-50 ongoing projects. Pan-India or GCC (UAE, Saudi).",
            currentTool: "Excel + WhatsApp + MS Project (chaotic, no single truth). FM Matrix clients are warm leads."
          },
          {
            rank: "3",
            industry: "Professional Services (Consulting, Law, Audit Firms)",
            features: "Client project tracking with milestone and task ownership across teams. Client issue register for tracking deliverable queries. MoM for every client engagement meeting, action items auto-converted to tasks. Document drive for proposals, reports, and contracts; data sovereignty is essential for client confidentiality. Channels for cross-team collaboration on deals. Opportunity Register for internal innovation pitches.",
            useCase: "Ensuring absolute client confidentiality through on-premise task/document management while standardizing deliverable tracking.",
            urgency: "HIGH. Client confidentiality and data sovereignty are regulatory requirements, not preferences, in legal and audit contexts.",
            primaryBuyer: "Managing Partner / Practice Head (measured on billable utilisation, client retention, project margin).",
            primaryUser: "Consultant / Associate (frustrated that deliverable tracking happens in email threads and Excel, making accountability invisible).",
            profile: "20-200 professionals. Metro India (Mumbai, Delhi, Bengaluru) or GCC. Mid-size firms.",
            currentTool: "Monday.com or Asana + Google Docs + email"
          },
          {
            rank: "4",
            industry: "Manufacturing & Industrial",
            features: "Production milestone tracking across plant locations. Maintenance task assignment to technicians. Shift roster management. Attendance and punch-in/out for shop floor staff. Document drive for SOPs, safety manuals, and compliance docs. Kanban board for production line task flow. Issues register for client-raised quality complaints.",
            useCase: "Bridging the gap between heavy ERPs (SAP) and daily shop-floor coordination tasks.",
            urgency: "MEDIUM. Pain is real but SAP dependency creates switching inertia; PTM complements rather than replaces ERP.",
            primaryBuyer: "Plant GM / Operations Director (measured on OEE, downtime, on-time delivery).",
            primaryUser: "Shift Supervisor / Production Lead (frustrated that task handovers between shifts are verbal and undocumented).",
            profile: "100-2000 employees. Industrial corridors: Pune, Surat, Chennai, Ahmedabad in India; Jubail, KIZAD in GCC.",
            currentTool: "SAP for ERP, Excel for tasks, WhatsApp for coordination"
          },
          {
            rank: "5",
            industry: "BFSI (Banking, Financial Services & Insurance)",
            features: "Regulatory project tracking across compliance, IT, and operations teams. Document drive for policy documents and audit reports (data localisation mandated by RBI/SEBI). Attendance and roster for branch and back-office staff. MoM for board and committee meetings auto-converted to action items. Issues register for internal audit findings. Role-based access and audit trails for compliance.",
            useCase: "Meeting strict RBI/SEBI data localisation mandates while tracking compliance and core operations safely.",
            urgency: "HIGH. RBI's data localisation circular and SEBI's cloud guidelines create a regulatory mandate for sovereign data storage that PTM directly addresses.",
            primaryBuyer: "CIO / CISO / Head of Compliance (measured on zero data-breach incidents, audit pass rates, system uptime).",
            primaryUser: "Project Manager / Compliance Officer (frustrated that action items from audit committee meetings are lost in email and never systematically tracked).",
            profile: "Mid-size NBFCs, insurance companies, and fintech firms. 200-5000 employees. India (Mumbai, Delhi) or GCC (DIFC-regulated entities).",
            currentTool: "SharePoint + Jira + email for project tracking"
          },
          {
            rank: "6",
            industry: "Co-working Spaces & Managed Offices",
            features: "Facility project tracking using Projects and Tasks (fit-out timelines, maintenance projects). Client issue register for tenant complaints and facility requests. MoM for tenant and team meetings with auto-task conversion. Document drive for lease agreements and compliance documents. Channels for internal team communication. Opportunity Register for community improvement suggestions from members.",
            useCase: "Provide a dedicated project tracking layer natively integrated with community operations that standard facility tools lack.",
            urgency: "HIGH. Strong overlap with GoPhygital.work co-working product; PTM adds the project/team layer that pure booking tools lack.",
            primaryBuyer: "Community Manager / Operations Head (measured on member NPS, occupancy rate, renewal rate).",
            primaryUser: "Member company's team lead (frustrated that their team still uses Notion or Trello inside a co-working space while the space itself has zero project visibility).",
            profile: "Independent co-working operators and managed office providers. 5-50 locations. Metro India or UAE/KSA.",
            currentTool: "Mix of proprietary booking tools, Excel, and WhatsApp"
          },
          {
            rank: "7",
            industry: "Educational Institutions, Universities & EdTech",
            features: "Academic project tracking for research, curriculum development, and administrative projects. MoM for faculty committee meetings auto-converted to action items. Document drive for course materials and research papers (data sovereignty matters for institution IP). Attendance for staff and faculty. Opportunity register for student/faculty innovation ideas. Recognition feed for academic achievements.",
            useCase: "Organize administrative and academic committees while keeping institutional IP (research & courseware) securely on-premise.",
            urgency: "MEDIUM. Digital transformation budgets are growing but procurement cycles are long in institutions.",
            primaryBuyer: "Registrar / COO (Admin) (measured on administrative efficiency, compliance audit results, faculty satisfaction).",
            primaryUser: "Academic coordinator / Admin manager (frustrated that committee decisions and follow-up actions disappear into email and are never tracked).",
            profile: "Private universities, institutes, and EdTech companies. 200-5000 staff. India (NCR, Pune, Bengaluru) or GCC (UAE education hubs).",
            currentTool: "Google Workspace + Excel + email"
          },
          {
            rank: "8",
            industry: "Healthcare & Hospitals",
            features: "Operational project tracking for hospital expansion, accreditation, and compliance projects. Document drive for clinical protocols, SOPs, and NABH/JCI documents. MoM for clinical committee meetings. Issues register for patient complaints or quality non-conformances. Attendance for nursing and administrative staff. Roster management for shift planning.",
            useCase: "To track compliance milestones and action items without exposing sensitive clinical or operational data.",
            urgency: "MEDIUM. Strong fit for admin and compliance teams but clinical teams are harder to change; project starts with a non-clinical use case.",
            primaryBuyer: "COO / Hospital Administrator (measured on accreditation scores (NABH/JCI), patient satisfaction, operational cost per bed).",
            primaryUser: "Quality Manager / Admin Project Lead (frustrated that NABH action plans are tracked in Excel with no accountability or deadline visibility).",
            profile: "Mid-to-large private hospital groups and healthcare chains. 500-10,000 employees. India (metros + Tier 1 cities) or GCC (Saudi Arabia, UAE).",
            currentTool: "Excel + email for project management"
          },
          {
            rank: "9",
            industry: "Retail Chains & D2C Brands",
            features: "New store rollout project tracking with milestones (site, fit-out, hiring, launch). Marketing campaign task management via kanban and MoM. Document drive for vendor contracts and brand guidelines. Opportunity register for store manager innovation ideas. Channels for cross-store communication. Recognition feed for top-performing store or team.",
            useCase: "Centralizing store launch milestones and marketing campaign assets away from fragmented WhatsApp groups.",
            urgency: "MEDIUM. Buying is marketing/ops led but IT approval needed for data tools; cycle is manageable.",
            primaryBuyer: "VP Retail / Operations Head (measured on new store launch timelines, same-store sales growth, operational cost).",
            primaryUser: "Store Operations Manager / Brand Manager (frustrated that new store launch checklists exist in WhatsApp groups with no formal tracking).",
            profile: "Organised retail chains and growing D2C brands. 100-2000 employees. Pan-India metros or GCC (Dubai retail hubs).",
            currentTool: "WhatsApp + Google Sheets for project coordination"
          },
          {
            rank: "10",
            industry: "Government & PSUs",
            features: "Project tracking for government schemes and infrastructure projects. Document drive for government orders and compliance files (data sovereignty is a statutory requirement, must stay on government infrastructure). MoM for inter-departmental meetings. Attendance for government employees. Issues register for citizen complaints or audit observations.",
            useCase: "Mandatory compliance with local sovereign storage regulations for all departmental project tracking and communications.",
            urgency: "LOW-MEDIUM. Strong regulatory alignment for data sovereignty, but procurement is slow and requires tender process.",
            primaryBuyer: "Project Director / IAS Officer (measured on scheme completion %, expenditure against budget, audit compliance).",
            primaryUser: "Section Officer / Junior Project Manager (frustrated that follow-up on committee decisions is verbal and non-systematic).",
            profile: "Central and state government departments, PSUs, and government-run institutions. India-focused.",
            currentTool: "NIC tools or Excel + email"
          }
        ],
        internalTeamUseCases: [
          {
            team: "Engineering / Dev Team",
            features: "Runs sprint planning using the Sprints module, connecting sprint goals to milestone tasks. Uses Issues register to log client-reported bugs with priority and assignee. Kanban board shows sprint task status in real time. Channels used for code review discussions and quick decisions. MoM for sprint retrospectives auto-converts action items to tasks. Documents module stores technical specs and API docs, with data sovereignty protecting IP.",
            process: "Manages entire development lifecycle tracking natively instead of disjointed tools.",
            modules: "Sprints - Issues - Kanban - Channels - MoM - Documents - To-Do",
            benefit: "No more Jira + Confluence + Slack stack. Dev workflow, documentation, and communication unified in one sovereign environment.",
            frequency: "Daily"
          },
          {
            team: "Product Management",
            features: "Manages product roadmap as a project with milestones per release. Creates and prioritises tasks for upcoming sprints. Documents PRDs, user stories, and feature specs in Document Drive. Uses MoM to record product council decisions and auto-converts to engineering tasks. Opportunity Register captures user feedback and feature requests from external stakeholders. Dashboard tracks milestone completion and assignee workload.",
            process: "Consolidates feature requests, specs, and delivery timelines into a single trackable system.",
            modules: "Projects - Milestones - Documents - MoM - Opportunity Register - Dashboard",
            benefit: "Full product lifecycle, from idea capture (Opportunity Register) to delivery (sprint tasks), in one place.",
            frequency: "Daily"
          },
          {
            team: "Marketing Team",
            features: "Runs campaign projects with milestones (brief → creative → review → launch). Kanban board for campaign task status. MoM for client or agency review meetings, auto-converting feedback into tasks. Document Drive for campaign briefs, brand guidelines, and creative assets. Channels for cross-team campaign coordination. Issues register for client feedback on deliverables. Opportunity Register for campaign ideas.",
            process: "Tracks marketing campaigns and assets from conception through multi-stage approval to launch.",
            modules: "Projects - Kanban - MoM - Documents - Channels - Issues - Opportunity Register",
            benefit: "Replaces Monday.com and Google Docs combo. Campaign tracking and client comms managed without switching tools.",
            frequency: "Daily"
          },
          {
            team: "Sales Team",
            features: "Uses Opportunity Register to log leads and expansion ideas. MoM for client discovery and proposal meetings, auto-converting next steps to tasks. Issues register to track client complaints or post-sale escalations. Channels for deal collaboration with pre-sales and technical teams. Document Drive for proposals and contracts (sovereign, client data stays internal).",
            process: "Connects client meetings seamlessly to actionable post-call follow-ups.",
            modules: "Opportunity Register - MoM - Issues - Channels - Documents",
            benefit: "Client-facing meeting notes become tracked tasks instantly. Proposal documents stay on company servers, not Google Drive.",
            frequency: "Daily"
          },
          {
            team: "Operations / Admin Team",
            features: "Manages cross-functional operational projects with milestones. Document drive for SOPs, vendor contracts, and compliance files, version-controlled and sovereign. MoM for weekly ops reviews with auto-task conversion. Channels for inter-team coordination. Issues register for operational complaints or escalations. Opportunity Register for process improvement ideas.",
            process: "Coordinates back-office initiatives and policy management effectively.",
            modules: "Projects - Tasks - Documents - Channels - MoM",
            benefit: "Replaces 4-5 separate admin tools. SOPs, vendor docs, and project tracking unified. Ops review action items formally tracked.",
            frequency: "Daily"
          },
          {
            team: "HR Team",
            features: "Manages HR projects (appraisal cycles, policy rollouts, hiring drives) as milestones with task assignment. MoM for HR committee and policy review meetings, action items auto-tracked. Document drive for HR documentation, version-controlled and on company servers. Channels for HR team communication. Issues register for formal HR escalations. Opportunity Register for employee-raised improvement suggestions.",
            process: "Run confidential hiring/admin workflows entirely in-house.",
            modules: "Projects - MoM - Documents - Channels",
            benefit: "HR projects, policy docs, and committee decisions tracked in one platform. Policy documents version-controlled on company servers. Employee improvement suggestions formally captured.",
            frequency: "Daily"
          },
          {
            team: "Finance Team",
            features: "Tracks finance-specific projects (audit, compliance, system rollouts) with milestone deadlines. Document drive for financial reports, board presentations, and audit files, data sovereignty ensures financial data stays on company infrastructure. MoM for board and finance committee meetings with auto-task conversion. Issues register for audit observations and non-conformances.",
            process: "Securely organizes audits and financial schedules away from public clouds.",
            modules: "Projects - Projects Dashboard - Documents - MoM",
            benefit: "Board-level financial documents stored on company servers. Audit committee action items auto-converted to tasks. Audit observations formally tracked with accountability.",
            frequency: "Daily"
          },
          {
            team: "IT / System Admin",
            features: "Manages IT projects (infrastructure upgrades, system rollouts, security audits) with full milestone tracking. Role-Based Access Control (RBAC) for user provisioning. Document Drive administration, manages permissions, shared drives, folder structure. Monitors platform usage and adoption analytics. Issues register for internal IT helpdesk tickets. Data sovereignty configuration ensures all data stays on client infrastructure.",
            process: "Maintains absolute administrative control across all employee digital interactions.",
            modules: "Projects - RBAC - Documents (admin) - Issues - Dashboard",
            benefit: "One platform to manage, not six. Data sovereignty means IT controls the environment entirely, no vendor dependency on data location.",
            frequency: "Daily"
          },
          {
            team: "Leadership / CXO",
            features: "Projects Overview dashboard for real-time visibility: project completion rates, milestone status, assignee performance across teams. Projects Dashboard with 8 chart types, no status report preparation needed. Opportunity Register to stay connected to team innovation without another meeting. MoM records for key strategic meetings.",
            process: "High-level visualization of OKRs and strategic milestones without manual reporting.",
            modules: "Projects Dashboard - Projects Overview - MoM - Opportunity Register",
            benefit: "Five minutes on the platform shows more than a weekly status report. No need to ask, the data is live.",
            frequency: "Daily"
          },
          {
            team: "All Teams, Cross-functional Collaboration",
            features: "Every team uses Channels (DMs + group channels) for real-time communication, with the ability to turn any message into a task with one click. This removes WhatsApp-to-email-to-task friction. The Opportunity Register keeps innovation visible across all teams. Documents are shared within the platform, no email attachments, no version confusion.",
            process: "Unified collaboration eliminating disjointed internal communication.",
            modules: "Channels - DMs - Group Channels - To-Do from Chat - Todo - Opportunity Register",
            benefit: "Communication, tasks, and documents stop living in three different places. One conversation = one task = one record.",
            frequency: "Daily"
          }
        ]
      }

    }
  }
};

const TaskManagerPage: React.FC = () => {
  return <BaseProductPage productData={taskManagerData} />;
};

export default TaskManagerPage;
