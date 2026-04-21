import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
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
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

/**
 * Project and Task Manager Product Data
 * ID: 10
 */
const productData = {
  name: "Project and Task Manager",
  description:
    "An enterprise-grade work management solution designed for total data sovereignty and execution speed. Centralizes tasks, native MS Office documents, and meeting management into one secure platform.",
  brief:
    "Eliminate tool sprawl and reclaim data ownership. Project & Task Manager integrates task hierarchy, collaborative doc creation, and MoM automation on client-owned infrastructure.",
  industries: "Technology, Professional Services, Real Estate",
  tabOrder: [
    "summary",
    "features",
    "market",
    "pricing",
    "usecases",
    "roadmap",
    "business",
    "gtm",
    "metrics",
    "swot",
    "enhancements",
    "assets",
  ],
  userStories: [
    {
      title: "Task & Project Management",
      items: [
        "Project → Milestone → Task → Subtask hierarchy (4 levels deep)",
        "Sprint management with task linking",
        "Kanban, Eisenhower Matrix, and List views",
        "Auto-escalation for delayed tasks",
      ],
    },
    {
      title: "Document Creation & Collaboration",
      items: [
        "Native Word, Excel, PPT, PDF creation in-platform",
        "Real-time collaborative editing",
        "Export as official MS Office files",
      ],
    },
    {
      title: "Meeting Management (MoM)",
      items: [
        "Structured MoM with 9 data fields",
        "Auto-convert action points to tasks in one click",
        "Linked project and milestone association",
      ],
    },
    {
      title: "Data Sovereignty & Security",
      items: [
        "On-premise / Client-owned database storage",
        "No third-party cloud exposure",
        "Full audit trail for all data modifications",
      ],
    },
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
    productSummaryNew: {
      identity: [
        {
          field: "Product Name",
          detail: "Project & Task Manager by Lockated (GoPhygital.work)",
        },
        {
          field: "One-line Description",
          detail:
            "A focused project and task management platform, with documents, channels, MoM, and a public suggestion forum, where every piece of company data is stored exclusively on the client's own servers.",
        },
        {
          field: "Category",
          detail: "Project Management Platform / Team Collaboration Tool",
        },
        {
          field: "Current Modules (Live)",
          detail:
            "Projects (Dashboard + Overview) · Tasks · Issues · Sprints · Channels (DMs + Groups) · Minutes of Meeting · Opportunity Register · Documents · Todo (Kanban + Eisenhower Matrix) · Notifications",
        },
        {
          field: "What Has Been Removed",
          detail:
            "Out of current scope (intentionally excluded): Company/Intranet layer · Home Dashboard · Tickets module · Employee Digital Pass · Performance Wallet · Desk Booking · Parking Management · Cafeteria Ordering · Calendar Sync · AI Assistant. Focused scope keeps onboarding fast and positioning clear.",
        },
        { field: "Product Owner", detail: "Yash & Sadanand Gupta" },
      ],
      problemSolves: [
        {
          painPoint: "Core Pain Point",
          solution:
            "Organisations manage projects, client issues, team communication, and documents across 4–6 fragmented tools — Jira for tasks, Slack for chat, Google Docs for writing, email for MoMs. Every tool stores company data on vendor infrastructure. PTM consolidates project management, documents, communication, and idea capture in one platform, on infrastructure the client owns.",
        },
        {
          painPoint: "The Data Sovereignty Gap",
          solution:
            "Every PM competitor (Asana, Monday, Notion, ClickUp, Jira) stores company data on their own cloud. PTM is the only platform in this price range where all data — project tasks, documents, channel messages, MoM records — stays on the client's own servers. This is a compliance differentiator for regulated industries and an IP protection advantage for all companies.",
        },
      ],
      whoItIsFor: [
        {
          role: "Project Manager",
          useCase:
            "Creates projects, milestones, tasks. Tracks delivery. Reviews Issues.",
          frustration:
            "Chasing status updates across WhatsApp and email; MoM action items falling through the cracks.",
          gain: "One live dashboard; MoM auto-converts to tasks; nothing falls through the cracks.",
        },
        {
          role: "Developer / Engineer",
          useCase:
            "Runs sprints, updates task status, raises issues, uses Channels for team sync.",
          frustration:
            "Context-switching between Jira, Slack, and email for one sprint cycle.",
          gain: "Sprint + task + channel + issue in one place; all project data on company servers.",
        },
        {
          role: "Team Member (All Functions)",
          useCase:
            "Executes tasks, updates status, collaborates on documents, raises MoM.",
          frustration:
            "6 tools open simultaneously to complete one piece of work.",
          gain: "Tasks, docs, messages, and to-dos in one login.",
        },
        {
          role: "Department Head / CXO",
          useCase:
            "Views project completion, assignee performance, milestone status across teams.",
          frustration:
            "No real-time visibility without asking; manual status updates.",
          gain: "Live project and milestone dashboard; cross-team task visibility.",
        },
        {
          role: "IT / Admin Head",
          useCase: "Manages user roles, document permissions, data governance.",
          frustration:
            "Company data spread across Google, Atlassian, Slack — no unified control.",
          gain: "Full data sovereignty; one platform; RBAC across all modules.",
        },
      ],
      today: [
        {
          dimension: "Single Most Defensible Position",
          state:
            "The only project management platform at SMB pricing where 100% of company data stays on infrastructure the client owns and controls. Documents export as real MS Office files. MoM auto-converts to tasks. All in one sovereign environment.",
        },
        {
          dimension: "Key USPs vs Competitors",
          state:
            "1. Data sovereignty — no PM competitor at this price offers client-hosted data.\n2. MS Office document creation and export — eliminates MS 365 subscription for docs.\n3. MoM-to-task auto-conversion — unique workflow no competitor has.\n4. Opportunity Register — public innovation forum built into PM workflow.\n5. Kanban + Eisenhower dual view — rare in enterprise PM tools.",
        },
        {
          dimension: "What We Are NOT (Scope Clarity)",
          state:
            "PTM is a focused project, task, and document management platform. It does not include HRMS features, intranet/social layer, desk booking, parking, F&B, or calendar sync in its current scope. This focus makes it fast to onboard, easy to position, and immediately valuable to any knowledge-working team.",
        },
        {
          dimension: "Target Markets",
          state:
            "India (primary): Tech/SaaS, Professional Services, Real Estate, Manufacturing (50–500 employees, metro cities). GCC (secondary): UAE, Saudi Arabia, Qatar — regulated industries where data localisation is a compliance requirement.",
        },
      ],
      featureSummaryModules: [
        {
          module: "Task & Project Management",
          description:
            "Project -> Milestone -> Task -> Subtask with 15-column task table, sprint management.",
          icon: "Layout",
        },
        {
          module: "Project Dashboards & Analytics",
          description:
            "8-chart project dashboard: completion, milestone, assignee-wise milestone, task status, task dependencies, issue tracker.",
          icon: "BarChart",
        },
        {
          module: "Issues Register (Client-Raised)",
          description:
            "Dedicated client issues register separate from internal tasks: ID, project, milestone, task, type, priority, status, responsible.",
          icon: "AlertCircle",
        },
        {
          module: "Sprint / Agile Management",
          description:
            "Sprint module with task linking, sprint details, sprint-to-task association.",
          icon: "RefreshCw",
        },
        {
          module: "Document Creation & Editing",
          description:
            "Full in-platform creation: Word, Excel, PPT, PDF. Real-time collaborative editing. Exports as official MS Office files.",
          icon: "FileText",
        },
        {
          module: "Data Sovereignty (USP)",
          description:
            "All data, documents, tasks, chats, MoMs, stored exclusively on the client's own database. No data leaves the client's environment.",
          icon: "Lock",
          isUSP: true,
        },
        {
          module: "Minutes of Meeting (MoM)",
          description:
            "Structured MoM with 9 data fields including direct conversion of action points to tasks.",
          icon: "Clipboard",
        },
        {
          module: "Opportunity Register",
          description:
            "Public suggestion forum, employees or external visitors post ideas, tagged by department, convertible to tasks.",
          icon: "Lightbulb",
        },
        {
          module: "Team Communication (Chat)",
          description:
            "Direct messages + group channels. Inline task creation from chat messages.",
          icon: "MessageSquare",
        },
        {
          module: "Todo with Kanban + Eisenhower",
          description:
            "Personal to-do list with both Kanban board view and Eisenhower matrix (urgency x importance) view.",
          icon: "CheckSquare",
        },
        {
          module: "Mobile App",
          description:
            "Not yet available. Roadmap item for field teams and site managers.",
          icon: "Smartphone",
        },
        {
          module: "Third-party Integrations",
          description:
            "No third-party integrations currently. Roadmap: Jira, GitHub, Slack, Tally, Zoho Books.",
          icon: "Layers",
        },
        {
          module: "Gantt / Timeline View",
          description:
            "Not currently available. Roadmap item for project timeline visualization.",
          icon: "Trello",
        },
        {
          module: "Workflow Automation",
          description:
            "Not currently available. Roadmap: No-code automation triggers for task state changes.",
          icon: "Zap",
        },
        {
          module: "AI Assistant",
          description:
            "Not in current scope. Future addition will be grounded on sovereign data.",
          icon: "Cpu",
        },
      ],
      competitivePositionUSP: {
        singlePosition:
          "The only project management platform at SMB pricing where 100% of company data stays on infrastructure the client owns and controls. Documents export as real MS Office files. MoM auto-converts to tasks. All in one sovereign environment.",
        keyUSPs: [
          "1. Data sovereignty — on-premise deployment. All client data stays on company servers, zero third-party cloud exposure.",
          "2. MS Office document replacement — Create, edit, and export Word docs, Excel sheets, PowerPoint presentations as real .docx/.xlsx/.pptx files inside the platform.",
          "3. MoM-to-task auto-conversion — structured meeting management with one-click action point conversion to tasks. No competitor has this.",
          "4. Opportunity Register — Public innovation forum built into PM workflow. Capture suggestions from entire org, department tag, convert to tasks.",
          "5. Kanban + Eisenhower dual view — rare in enterprise PM tools. Visual task prioritization by urgency-importance matrix.",
        ],
        whatWeAreNot:
          "PTM is a focused project, task, and document management platform. It does not include HRMS features, intranet/social layer, desk booking, parking, F&B, or calendar sync in its current scope. This focus makes it fast to onboard, easy to position, and immediately valuable to any knowledge-working team.",
        targetMarkets:
          "India (primary): Tech/SaaS (50–300 employees, metro cities). Professional Services (consulting, legal, audit firms). Real Estate (5–50 active projects). GCC (secondary): UAE, Saudi Arabia — regulated industries where data localisation is compliance requirement.",
      },
      featureComparison: [
        {
          feature: "Task & Project Management",
          competitorInfo:
            "Create projects, assign tasks, set deadlines, track status. Basic hierarchy: Project -> Task.",
          productDetail:
            "Project -> Milestone -> Task -> Subtask with 15-column task table, sprint management.",
          snag360Status: "AHEAD",
          notes:
            "Four-tier hierarchy is deeper than Asana or Monday. Only ClickUp matches this depth.",
        },
        {
          feature: "Project Dashboards & Analytics",
          competitorInfo: "Basic completion charts, assignee workload.",
          productDetail:
            "8-chart project dashboard: completion, milestone, assignee-wise milestone, task status, task dependencies, issue",
          snag360Status: "AHEAD",
          notes:
            "Dashboard depth matches Jira Premium. Most SMB tools offer 2-3 chart types maximum.",
        },
        {
          feature: "Issues Register (Client-Raised)",
          competitorInfo:
            "Most PM tools mix internal bugs with client issues or have no structured issue register.",
          productDetail:
            "Dedicated client issues register separate from internal tasks: ID, project, milestone, task, type, priority, status, responsible",
          snag360Status: "AHEAD",
          notes:
            "Separate client issue register is rare. Competitors either mix bugs with client issues or rely on email.",
        },
        {
          feature: "Sprint / Agile Management",
          competitorInfo:
            "Jira: comprehensive. Asana, Monday: basic. ClickUp: moderate.",
          productDetail:
            "Sprint module with task linking, sprint details, sprint-to-task association.",
          snag360Status: "AT PAR",
          notes:
            "Functional sprint management. Lacks velocity tracking and burndown charts ,roadmap gap vs Jira.",
        },
        {
          feature: "Document Creation & Editing",
          competitorInfo:
            "External only (Google Docs, Notion, SharePoint). Almost no PM tool includes native doc creation.",
          productDetail:
            "Full in-platform creation: Word, Excel, PPT, PDF. Real-time collaborative editing. Exports as official MS Office files.",
          snag360Status: "AHEAD, UNIQUE",
          notes:
            "No PM competitor offers MS Office-compatible document creation and export. Replaces Google Workspace or MS 365 for document needs.",
        },
        {
          feature: "Data Sovereignty",
          competitorInfo:
            "All competitors store data on their own cloud. No SMB PM tool offers client-hosted data.",
          productDetail:
            "All data, documents, tasks, chats, MoMs, stored exclusively on the client's own database.",
          snag360Status: "AHEAD, UNIQUE",
          notes:
            "Structural differentiator that competitors cannot easily copy without rebuilding their architecture.",
        },
        {
          feature: "Minutes of Meeting (MoM)",
          competitorInfo:
            "Rarely built into PM tools. Usually Google Docs or a separate tool.",
          productDetail:
            "Structured MoM with 9 data fields including direct conversion of action points to tasks.",
          snag360Status: "AHEAD, UNIQUE",
          notes:
            "Auto-convert MoM action points to tasks saves 30+ minutes per meeting cycle. No PM competitor has this natively.",
        },
        {
          feature: "Opportunity Register",
          competitorInfo:
            "Not present in any PM competitor. Closest: Aha! for product feedback (B2B SaaS only).",
          productDetail:
            "Public suggestion forum ,employees or external visitors post ideas, tagged by department, convertible to",
          snag360Status: "AHEAD, UNIQUE",
          notes:
            "Innovation capture built into the PM workflow. No direct competitor has this as a native PM feature.",
        },
        {
          feature: "Team Communication (Chat)",
          competitorInfo:
            "Most require Slack/Teams separately. ClickUp has basic chat.",
          productDetail:
            "Direct messages + group channels. Inline task creation from chat messages.",
          snag360Status: "AT PAR with ClickUp",
          notes: "Functional. Not as mature as Slack threading ,roadmap item.",
        },
        {
          feature: "Todo with Kanban + Eisenhower",
          competitorInfo:
            "Kanban is common. Eisenhower matrix is rare in enterprise PM tools.",
          productDetail:
            "Personal to-do list with both Kanban board view and Eisenhower matrix (urgency x importance) view.",
          snag360Status: "AHEAD",
          notes:
            "Eisenhower matrix differentiation is rare. Most tools offer kanban only for personal tasks.",
        },
        {
          feature: "Mobile App",
          competitorInfo:
            "All major competitors have polished mobile apps (Jira, Asana, Monday, Notion, ClickUp).",
          productDetail: "Not yet available.",
          snag360Status: "GAP",
          notes:
            "Critical gap for field teams, real estate site managers, any user away from a desk.",
        },
        {
          feature: "Third-party Integrations",
          competitorInfo: "Jira: 3000+. Asana: 200+. Monday: 200+.",
          productDetail:
            "No third-party integrations currently. Roadmap: Jira, GitHub, Slack, accounting tools (Tally, Zoho Books).",
          snag360Status: "GAP",
          notes:
            "Will cost deals in tech companies where GitHub/Jira sync is expected.",
        },
        {
          feature: "Gantt / Timeline View",
          competitorInfo:
            "Standard in Asana (Premium+), Monday, MS Project, ClickUp.",
          productDetail: "Not available.",
          snag360Status: "GAP",
          notes:
            "Will cost deals vs Asana and Monday when buyers ask for timeline view.",
        },
        {
          feature: "Workflow Automation",
          competitorInfo:
            "Asana, Monday, ClickUp all have strong no-code automation.",
          productDetail: "Not available.",
          snag360Status: "GAP",
          notes:
            "Buyers in ops-heavy companies expect 'when task moves to Done -> notify manager' automation.",
        },
        {
          feature: "AI Assistant",
          competitorInfo:
            "Notion AI, ClickUp AI, Jira AI (beta), Asana AI ,all in market.",
          productDetail: "Not in current scope.",
          snag360Status: "GAP",
          notes:
            "Out of current scope. When added, should be grounded on sovereign data ,the key differentiator.",
        },
      ],
    },
    detailedFeatures: [
      {
        module: "Projects",
        feature: "Projects Dashboard (8-Chart Depth)",
        subFeatures: "",
        works:
          "Visual analytics for each project: project completion chart, milestone completion, assignee-wise milestone progress, task completion, assignee-wise task status, task dependencies map, project-wise issue breakdown, and assignee-wise issues. Depth matches Jira Premium.",
        userType: "All",
        usp: false,
      },
      {
        module: "Projects",
        feature: "Projects Overview Table",
        subFeatures: "",
        works:
          "Table view of all projects with columns: Actions, ID, Code, Title, Status, Type, Manager, Completion %, Milestone Completion %, Task & Subtask Completion %, Task count, Subtask count, Milestone count, Issues, Start Date, End Date, Priority.",
        userType: "All",
        usp: false,
      },
      {
        module: "Projects",
        feature: "Tasks Table",
        subFeatures: "",
        works:
          "Comprehensive task management table with columns: Actions, ID, Project, Milestone, Feature Name, Workflow Status, Responsible Person, Created By, Started Time, Time Left, Efforts/Duration, Predecessor, Successor, Completion %, Tag.",
        userType: "All",
        usp: false,
      },
      {
        module: "Projects",
        feature: "Milestones as Modules",
        subFeatures: "",
        works:
          "All modules within a project are structured as Milestones. Each milestone contains Tasks and Subtasks, creating a clear three-tier hierarchy: Project → Milestone → Task → Subtask.",
        userType: "All",
        usp: false,
      },
      {
        module: "Projects",
        feature: "Task vs To-Do Logic",
        subFeatures: "",
        works:
          "Any work item estimated at more than 30 minutes is classified as a Task. Items under 30 minutes are classified as To-Dos ,ensuring the right level of tracking for every type of work.",
        userType: "All",
        usp: false,
      },
      {
        module: "Projects",
        feature: "Dedicated Issues Register (Client-Raised)",
        subFeatures: "",
        works:
          "Tracks issues raised by clients separate from internal tasks (rare in PM tools). Includes: ID, Project Name, Milestone, Task, Subtask, Title, Type, Priority, Status, Responsible Person, Raised By, Start Date, End Date, Comments.",
        userType: "All",
        usp: false,
      },
      {
        module: "Projects",
        feature: "Sprints",
        subFeatures: "",
        works:
          "Connects sprints to their associated tasks in a table view. Includes sprint planning details, sprint scope, start/end dates, and task-level linkage for agile teams.",
        userType: "All",
        usp: false,
      },
      {
        module: "Channels",
        feature: "Direct Messages",
        subFeatures: "",
        works:
          "1-on-1 messaging between employees within the platform ,keeps project communication in context without switching to WhatsApp or email.",
        userType: "All",
        usp: false,
      },
      {
        module: "Channels",
        feature: "Group Channels",
        subFeatures: "",
        works:
          "Team or project-specific group chats for async collaboration ,all conversations are searchable and tied to the work context.",
        userType: "All",
        usp: false,
      },
      {
        module: "Minutes of Meeting",
        feature: "MoM-to-Task Automation",
        subFeatures: "",
        works:
          "Structured MoM creation with fields: Meeting Title, Type, Mode, Date, Time, Internal/Client flag. Each point can be converted into a Task directly, saving 30+ minutes per meeting cycle. No competitor has this natively.",
        userType: "All",
        usp: true,
      },
      {
        module: "Opportunity Register",
        feature: "Public Suggestion Forum",
        subFeatures: "",
        works:
          "An open forum where any employee ,or even external visitors ,can post suggestions, ideas, or feedback for any team or the company. Public to all, encouraging a culture of open innovation.",
        userType: "All",
        usp: true,
      },
      {
        module: "Documents",
        feature: "In-Platform Document Creation",
        subFeatures: "",
        works:
          "Create Word documents, Excel sheets, PowerPoint presentations, and PDFs directly within the platform ,no Microsoft 365 subscription required.",
        userType: "All",
        usp: true,
      },
      {
        module: "Documents",
        feature: "Real-Time Collaboration",
        subFeatures: "",
        works:
          "Multiple team members can co-edit documents simultaneously within the platform ,similar to Google Docs but with data stored on the company's own servers.",
        userType: "All",
        usp: true,
      },
      {
        module: "Documents",
        feature: "Export as Official MS Office Files",
        subFeatures: "",
        works:
          "When a document is shared externally, it is automatically converted and exported as a proper .docx, .xlsx, .pptx, or .pdf file ,maintaining full compatibility.",
        userType: "All",
        usp: true,
      },
      {
        module: "Documents",
        feature: "Data Sovereignty",
        subFeatures: "",
        works:
          "All documents and data are stored on the company's own database infrastructure ,not on any third-party creator's servers. The company retains full ownership and control of its data.",
        userType: "All",
        usp: true,
      },
      {
        module: "Documents",
        feature: "Document Sharing within Teams",
        subFeatures: "",
        works:
          "Share documents directly with colleagues or teams inside the platform ,no email attachments needed, with version control and access management.",
        userType: "All",
        usp: false,
      },
      {
        module: "Todo",
        feature: "Personal To-Do Manager",
        subFeatures: "",
        works:
          "Personal task list for sub-30-minute items, displayed in both Kanban board and Eisenhower Matrix views ,ensuring lightweight tasks don't get lost in the project system.",
        userType: "All",
        usp: false,
      },
      {
        module: "Todo",
        feature: "Kanban Board",
        subFeatures: "",
        works:
          "Drag-and-drop visual board showing tasks across status columns (To Do / In Progress / On Hold / Done) ,enables teams to manage workflow visually.",
        userType: "All",
        usp: true,
      },
      {
        module: "Todo",
        feature: "Eisenhower Matrix",
        subFeatures: "",
        works:
          "A 2x2 urgency-importance matrix view of all personal To-Do items ,helps employees prioritize what to do now, schedule, delegate, or drop.",
        userType: "All",
        usp: true,
      },
      {
        module: "Notifications",
        feature: "Real-Time Notifications",
        subFeatures: "",
        works:
          "Push notifications for task assignments, deadline reminders, MoM action points, and approval requests.",
        userType: "All",
        usp: false,
      },
    ],
    detailedMarketAnalysis: {
      targetAudience: [
        {
          segment: "Technology / SaaS",
          demographics:
            "50–300 employees | Bengaluru, Pune, Hyderabad, Dubai | Growth-stage companies",
          industry: "Technology",
          painPoints:
            "1. Dev, PM, and ops teams run on 4+ tools (Jira, Slack, Confluence, Google Docs), no single source of truth for projects and tasks. 2. Sprint tracking, issue management, and MoMs happen in separate systems; action items from meetings are never formally tracked. 3. Company source code, roadmaps, and client data live on Atlassian/Google servers, no data ownership.",
          notSolved:
            "Sprint delays cascade into revenue delays. Meeting action items are lost, work discussed is not executed. One data breach on vendor infrastructure = regulatory exposure and client trust loss.",
          goodEnough:
            "Jira + Slack + Confluence + Google Docs. Team knows it's fragmented and expensive. 'Good enough' = WhatsApp for quick decisions + Jira for formal tracking + Google Docs for MoMs that nobody follows up on.",
          urgency: "HIGH",
          primaryBuyer: "CTO / VP Engineering",
        },
        {
          segment: "Real Estate & Construction",
          demographics:
            "5–50 active projects | Pan-India + UAE, Saudi | Mid-to-large developers",
          industry: "Real Estate & Construction",
          painPoints:
            "1. Project milestone tracking done entirely on WhatsApp and Excel, no formal task assignment, no deadline visibility. 2. Client complaints and snags tracked in email threads with no structured resolution or audit trail. 3. MoMs from site review meetings are typed in Word documents that nobody follows up on.",
          notSolved:
            "Construction delays cost ₹5–25L per day in penalty clauses. Client escalations go unresolved for weeks. MoM action items are forgotten, causing rework and blame cycles.",
          goodEnough:
            "MS Project for formal milestones (rarely updated). WhatsApp for daily coordination. Word documents for MoMs. Excel for client issues. Everyone knows this is broken.",
          urgency: "HIGH",
          primaryBuyer: "Project Director / COO",
        },
        {
          segment: "Professional Services (Consulting, Legal, Audit)",
          demographics:
            "20–150 professionals | Mumbai, Delhi, Bengaluru + Dubai DIFC",
          industry: "Professional Services",
          painPoints:
            "1. Client project deliverable tracking happens in email, no shared, auditable task system. 2. MoMs from client meetings are written in Word and emailed, action items are never formally tracked or assigned. 3. Client-sensitive documents stored on Google/Microsoft servers, confidentiality and compliance risk.",
          notSolved:
            "Missed client deadlines damage retainer relationships. Meeting action items are forgotten, clients complain 'nothing moved after the call.' Data on Google/Microsoft servers violates professional confidentiality obligations in DIFC and SEBI-regulated contexts.",
          goodEnough:
            "Monday.com or Asana for projects + Google Docs for documents + email for MoMs. 3 tools, 3 places to check. 'Good enough' is a well-managed Google Drive folder.",
          urgency: "HIGH",
          primaryBuyer: "Managing Partner / Practice Head",
        },
      ],
      companyPainPoints: [
        {
          companyType:
            "Indian SMB (50–300 employees)\nAll industries\nAnnual SaaS budget: ₹10–40L",
          pain1:
            "Project data spread across Jira, Asana, or Excel, no unified task and milestone view.",
          pain2:
            "MoM action items tracked in Word docs or email; follow-up is manual and inconsistent.",
          pain3:
            "Documents created in Google Docs/MS 365, client-sensitive content on vendor servers.",
          costRisk:
            "₹10–30L/yr on fragmented SaaS. 15–20 hrs/month management time lost to manual reporting. Data sovereignty exposure for regulated clients.",
        },
        {
          companyType:
            "GCC Mid-Market (100–1000 employees)\nTech, Professional Services, BFSI\nDubai, Riyadh, Abu Dhabi",
          pain1:
            "UAE PDPL and Saudi NDMO data residency regulations require data to stay in-country, most SaaS PM tools cannot guarantee this.",
          pain2:
            "Sprint and project tracking tools (Jira/Asana) do not integrate with how Arabic-language teams communicate, dual system problem.",
          pain3:
            "MoM action tracking is entirely manual, decisions made in Arabic are typed in English in a different tool, creating gaps.",
          costRisk:
            "PDPL non-compliance fines up to AED 5M. Operational inefficiency from tool fragmentation adds 15–20% overhead to project timelines.",
        },
        {
          companyType:
            "Indian Enterprise (500+ employees)\nManufacturing, BFSI, Real Estate\nMultiple city offices",
          pain1:
            "Project status consolidation requires manual effort, ops heads build status PPTs from Excel inputs every Monday.",
          pain2:
            "Client issue tracking (snags, complaints, escalations) is done in email, no structured register, no audit trail.",
          pain3:
            "SaaS contracts with foreign vendors trigger RBI/SEBI data localisation scrutiny.",
          costRisk:
            "10–15% of senior management time lost to status-update cycles. Client issue escalations damage retention. Data localisation risk growing.",
        },
      ],
      competitorMapping: [
        {
          name: "Jira (Atlassian)",
          targetCustomer:
            "Developer-first, 50–5000 employees. Tech companies, product orgs. India metros + GCC.",
          pricing:
            "Free to 10 users. Standard ~$650/user/month. Premium ~$1,260/user/month.",
          discovery:
            "Developer communities, Atlassian Marketplace, Google search for 'bug tracking'.",
          strongestFeatures:
            "Industry standard in software dev. Deep sprint/agile tooling. 3000+ integrations. Strong India enterprise trust.",
          weakness:
            "Complex UI, non-technical teams abandon it. No native document creation. No MoM module. No data sovereignty. Expensive at scale.",
          marketGaps:
            "Non-dev teams at Jira companies (marketing, ops, legal) use Excel or Monday because Jira is too complex. PTM serves the 'rest of the company' alongside Jira. Pitch: 'Keep Jira for engineering. Use PTM for everyone else, with your data on your servers.'",
          threats:
            "Jira AI (auto-triage, intelligent sprint suggestions) is raising baseline AI expectations. Atlassian Intelligence will make their platform smarter.",
        },
        {
          name: "Asana",
          targetCustomer:
            "Mid-market, 50–1000 employees. Marketing, ops, cross-functional teams. India and GCC growing.",
          pricing:
            "Free (10 users). Premium ~$915/user/month. Business ~$2,080/user/month.",
          discovery:
            "SEO (#1 for 'project management software'). Google Workspace Marketplace. Peer recommendations.",
          strongestFeatures:
            "Clean UI, low learning curve. Strong task + milestone + timeline. Good automation. Deep Google Workspace integration. Best brand recognition in category.",
          weakness:
            "No native document creation. No MoM module, action items live in Google Docs separately. No data sovereignty, all on Asana's AWS. Per-seat pricing escalates fast.",
          marketGaps:
            "Asana is the most common 'good enough' tool our prospects use. Displacement pitch: PTM replaces Asana + Google Docs in one platform, with your documents on your servers, not Asana's. The MoM-to-task workflow is a direct answer to Asana's biggest gap.",
          threats:
            "Asana AI (auto-assign, auto-status, smart goals) is live and aggressively marketed. AI features are ahead of most competitors.",
        },
        {
          name: "Monday.com",
          targetCustomer:
            "Ops, marketing, project teams. 10–5000 employees. Strong GCC presence (UAE, Saudi offices).",
          pricing:
            "Basic ~$750/seat/month. Standard ~$1,000. Pro ~$1,580. Minimum 3 seats.",
          discovery:
            "Heavy digital advertising. SEO dominance. GCC sales team. Sports sponsorships.",
          strongestFeatures:
            "Highly visual and flexible. Strong automations. 200+ integrations. GCC local support. Good no-code customisation.",
          weakness:
            "Expensive at scale. No native document creation. No MoM module. No data sovereignty. No Opportunity Register.",
          marketGaps:
            "Monday is our biggest visual competitor in GCC marketing agencies. PTM pitch: same project visibility as Monday, plus documents, channels, and MoM, all on your servers. Significantly cheaper at 50+ seats.",
          threats:
            "Monday WorkOS rebranding targets full enterprise work platform. Their AI block and docs play is moving in our direction, watch if they ship a serious document module.",
        },
        {
          name: "Notion",
          targetCustomer:
            "Startups, 1–200 employees. Very popular in India startup ecosystem. Growing in GCC tech.",
          pricing:
            "Free tier (powerful). Plus $8/user/month. Business $15/user/month. Enterprise custom.",
          discovery:
            "Viral word-of-mouth. Social media. App Store. Developer/designer community.",
          strongestFeatures:
            "Flexible wiki + database + task tool. Beautiful design. Free tier is genuinely useful. Notion AI is strong. Near-zero onboarding friction.",
          weakness:
            "Not a real PM tool, no sprints, no sprint velocity, no milestone hierarchy, no issues register, no RBAC. No MS Office export. Documents stay in Notion ecosystem. No MoM module.",
          marketGaps:
            "Notion is the default that startups drift to because it's free. PTM displacement: 'Notion is great for individuals. PTM is for teams that need sprint tracking, issues register, MoM-to-task, and data they actually own.' Document export as real .docx is a killer differentiator, Notion cannot do this.",
          threats:
            "Notion AI (auto-fill databases, summarise pages, generate from templates) is genuinely powerful and further ahead than most competitors.",
        },
        {
          name: "ClickUp",
          targetCustomer:
            "All-in-one seekers. 10–1000 employees. Ops, PM, engineering. Growing in India and UAE.",
          pricing:
            "Free tier. Unlimited $7/user/month. Business $12/user/month.",
          discovery:
            "SEO targeting competitor keywords ('Asana alternative'). G2/Capterra. Referral program.",
          strongestFeatures:
            "Widest feature set, tasks, docs, goals, chat, sprints, dashboards. Very competitive pricing. 'Alternative to everything' positioning.",
          weakness:
            "Extremely complex UI, high churn from feature overwhelm. No data sovereignty. Documents are ClickUp-native, not exportable as real MS Office files. Weak enterprise credibility.",
          marketGaps:
            "ClickUp users frequently cite 'too overwhelming' as their reason to leave. PTM's cleaner structure (Project → Milestone → Task → Subtask) is a feature, not a limitation. Data sovereignty and real MS Office export are features ClickUp will not build.",
          threats:
            "ClickUp AI (auto-task creation, natural language commands) is expanding rapidly. Their roadmap explicitly targets replacing every PM and collaboration tool.",
        },
        {
          name: "Microsoft 365 + Teams + Planner",
          targetCustomer:
            "Enterprise, 500+ employees. IT-standardised organisations. BFSI, manufacturing, government in India and GCC.",
          pricing:
            "MS 365 Business Standard ~$750/user/month. Teams included. Planner included but basic.",
          discovery:
            "Enterprise IT procurement. Microsoft Enterprise Agreements. SI partners (TCS, Infosys). Azure/Teams as Trojan horse.",
          strongestFeatures:
            "Deep enterprise trust. Data can be hosted on Azure India/UAE regions. SharePoint for documents. Teams for communication. Outlook calendar seamless.",
          weakness:
            "MS Planner is primitive, no milestones, no sprints, no issues register. No MoM module. No Opportunity Register. Expensive for SMBs. SharePoint collaboration is clunky vs modern tools.",
          marketGaps:
            "Mid-size Indian companies pay for MS 365 but still run projects on WhatsApp and Excel because Planner is too basic. PTM fills the project management gap without displacing Teams or Outlook. Position as 'the project layer on top of your Microsoft setup.'",
          threats:
            "Microsoft Copilot across Teams, Word, and Excel is Microsoft's biggest move. If Copilot becomes the standard AI layer across MS 365, the bar for any work tool rises significantly.",
        },
      ],
    },
    detailedPricing: {
      pricingMatrixSubtitle:
        "Section 1: Feature comparison | Section 2: Pricing landscape | Section 3: Positioning | Section 4: Value propositions",
      pricingFeatureRows: [
        {
          capability: "Task & Project Management",
          currentState:
            "Project -> Milestone -> Task -> Subtask with 15-column task table, sprint management.",
          marketNeed:
            "Create projects, assign tasks, set deadlines, track status. Basic hierarchy: Project -> Task.",
          status: "AHEAD",
          impact:
            "Four-tier hierarchy is deeper than Asana or Monday. Only ClickUp matches this depth.",
          recommendation:
            "Four-tier hierarchy is deeper than Asana or Monday. Only ClickUp matches this depth.",
        },
        {
          capability: "Project Dashboards & Analytics",
          currentState:
            "8-chart project dashboard: completion, milestone, assignee-wise milestone, task status, task dependencies, issue",
          marketNeed: "Basic completion charts, assignee workload.",
          status: "AHEAD",
          impact:
            "Dashboard depth matches Jira Premium. Most SMB tools offer 2-3 chart types maximum.",
          recommendation:
            "Dashboard depth matches Jira Premium. Most SMB tools offer 2-3 chart types maximum.",
        },
        {
          capability: "Issues Register (Client-Raised)",
          currentState:
            "Dedicated client issues register separate from internal tasks: ID, project, milestone, task, type, priority, status, responsible",
          marketNeed:
            "Most PM tools mix internal bugs with client issues or have no structured issue register.",
          status: "AHEAD",
          impact:
            "Separate client issue register is rare. Competitors either mix bugs with client issues or rely on email.",
          recommendation:
            "Separate client issue register is rare. Competitors either mix bugs with client issues or rely on email.",
        },
        {
          capability: "Sprint / Agile Management",
          currentState:
            "Sprint module with task linking, sprint details, sprint-to-task association.",
          marketNeed:
            "Jira: comprehensive. Asana, Monday: basic. ClickUp: moderate.",
          status: "AT PAR",
          impact:
            "Functional sprint management. Lacks velocity tracking and burndown charts ,roadmap gap vs Jira.",
          recommendation:
            "Functional sprint management. Lacks velocity tracking and burndown charts ,roadmap gap vs Jira.",
        },
        {
          capability: "Document Creation & Editing",
          currentState:
            "Full in-platform creation: Word, Excel, PPT, PDF. Real-time collaborative editing. Exports as official MS Office files.",
          marketNeed:
            "External only (Google Docs, Notion, SharePoint). Almost no PM tool includes native doc creation.",
          status: "AHEAD, UNIQUE",
          impact:
            "No PM competitor offers MS Office-compatible document creation and export. Replaces Google Workspace or MS 365 for document needs.",
          recommendation:
            "No PM competitor offers MS Office-compatible document creation and export. Replaces Google Workspace or MS 365 for document needs.",
        },
        {
          capability: "Data Sovereignty",
          currentState:
            "All data, documents, tasks, chats, MoMs, stored exclusively on the client's own database.",
          marketNeed:
            "All competitors store data on their own cloud. No SMB PM tool offers client-hosted data.",
          status: "AHEAD, UNIQUE",
          impact:
            "Structural differentiator that competitors cannot easily copy without rebuilding their architecture.",
          recommendation:
            "Structural differentiator that competitors cannot easily copy without rebuilding their architecture.",
        },
        {
          capability: "Minutes of Meeting (MoM)",
          currentState:
            "Structured MoM with 9 data fields including direct conversion of action points to tasks.",
          marketNeed:
            "Rarely built into PM tools. Usually Google Docs or a separate tool.",
          status: "AHEAD, UNIQUE",
          impact:
            "Auto-convert MoM action points to tasks saves 30+ minutes per meeting cycle. No PM competitor has this natively.",
          recommendation:
            "Auto-convert MoM action points to tasks saves 30+ minutes per meeting cycle. No PM competitor has this natively.",
        },
        {
          capability: "Opportunity Register",
          currentState:
            "Public suggestion forum ,employees or external visitors post ideas, tagged by department, convertible to",
          marketNeed:
            "Not present in any PM competitor. Closest: Aha! for product feedback (B2B SaaS only).",
          status: "AHEAD, UNIQUE",
          impact:
            "Innovation capture built into the PM workflow. No direct competitor has this as a native PM feature.",
          recommendation:
            "Innovation capture built into the PM workflow. No direct competitor has this as a native PM feature.",
        },
        {
          capability: "Team Communication (Chat)",
          currentState:
            "Direct messages + group channels. Inline task creation from chat messages.",
          marketNeed:
            "Most require Slack/Teams separately. ClickUp has basic chat.",
          status: "AT PAR with ClickUp",
          impact: "Functional. Not as mature as Slack threading ,roadmap item.",
          recommendation:
            "Functional. Not as mature as Slack threading ,roadmap item.",
        },
        {
          capability: "Todo with Kanban + Eisenhower",
          currentState:
            "Personal to-do list with both Kanban board view and Eisenhower matrix (urgency x importance) view.",
          marketNeed:
            "Kanban is common. Eisenhower matrix is rare in enterprise PM tools.",
          status: "AHEAD",
          impact:
            "Eisenhower matrix differentiation is rare. Most tools offer kanban only for personal tasks.",
          recommendation:
            "Eisenhower matrix differentiation is rare. Most tools offer kanban only for personal tasks.",
        },
        {
          capability: "Mobile App",
          currentState: "Not yet available.",
          marketNeed:
            "All major competitors have polished mobile apps (Jira, Asana, Monday, Notion, ClickUp).",
          status: "GAP",
          impact:
            "Critical gap for field teams, real estate site managers, any user away from a desk.",
          recommendation:
            "Critical gap for field teams, real estate site managers, any user away from a desk.",
        },
        {
          capability: "Third-party Integrations",
          currentState:
            "No third-party integrations currently. Roadmap: Jira, GitHub, Slack, accounting tools (Tally, Zoho Books).",
          marketNeed: "Jira: 3000+. Asana: 200+. Monday: 200+.",
          status: "GAP",
          impact:
            "Will cost deals in tech companies where GitHub/Jira sync is expected.",
          recommendation:
            "Will cost deals in tech companies where GitHub/Jira sync is expected.",
        },
        {
          capability: "Gantt / Timeline View",
          currentState: "Not available.",
          marketNeed:
            "Standard in Asana (Premium+), Monday, MS Project, ClickUp.",
          status: "GAP",
          impact:
            "Will cost deals vs Asana and Monday when buyers ask for timeline view.",
          recommendation:
            "Will cost deals vs Asana and Monday when buyers ask for timeline view.",
        },
        {
          capability: "Workflow Automation",
          currentState: "Not available.",
          marketNeed:
            "Asana, Monday, ClickUp all have strong no-code automation.",
          status: "GAP",
          impact:
            "Buyers in ops-heavy companies expect 'when task moves to Done -> notify manager' automation.",
          recommendation:
            "Buyers in ops-heavy companies expect 'when task moves to Done -> notify manager' automation.",
        },
        {
          capability: "AI Assistant",
          currentState: "Not in current scope.",
          marketNeed:
            "Notion AI, ClickUp AI, Jira AI (beta), Asana AI ,all in market.",
          status: "GAP",
          impact:
            "Out of current scope. When added, should be grounded on sovereign data ,the key differentiator.",
          recommendation:
            "Out of current scope. When added, should be grounded on sovereign data ,the key differentiator.",
        },
      ],
      pricingSummaryRows: [
        {
          label: "Where we are head",
          detail:
            "Data sovereignty (unique) · MS Office document creation & export (unique) · MoM-to-task auto-conversion (unique) · Opportunity Register (unique) · 8-chart project dashboard (ahead) · 4-tier project hierarchy (deeper than most) · Client issues register (separate from internal bugs) · Eisenhower matrix for todos (rare).",
          tone: "green",
        },
        {
          label: "At Par",
          detail:
            "Team chat and channels (functional, not as mature as Slack) · Sprint management (functional, lacks burndown/velocity charts)					",
          tone: "green",
        },
        {
          label: "gaps that will cost deals",
          detail:
            "Mobile app ,losing every deal with field teams or mobile-first users · Gantt/timeline view ,losing head-to-head vs Asana/Monday · Workflow automation ,ops-heavy buyers expect this · Third-party integrations ,tech companies expect GitHub/Jira sync · AI assistant ,not in current scope; when added, must be grounded on sovereign data to differentiate",
          tone: "yellow",
        },
      ],
      pricingCurrentRows: [
        {
          label: "Standard pricing models",
          detail: "Per-seat SaaS (annual billing) is the category standard. Freemium (free up to 10 users) drives viral adoption ,Notion, ClickUp, Asana all use it. Module add-ons create upsell revenue. Enterprise custom contracts with 20–30% discounts for 500+ seats.",
        },
        {
          label: "India price ranges",
          detail: "Entry/Starter: ₹400-800/user/month. Mid/Professional: ₹900-1,500/user/month. Enterprise: ₹1,500-3,000/user/month (custom). Competitors: Asana Personal ~₹880, Jira Standard ~₹650, Monday Standard ~₹1,000, ClickUp Unlimited ~₹580.",
        },
        {
          label: "GCC price ranges",
          detail: "Entry: $5–10/user/month (AED 18–37). Mid: $10–20/user/month (AED 37–73). Enterprise: $20–40+/user/month (custom, annual). GCC pricing carries a premium justified by data residency compliance value.",
        },
        {
          label: "Recommended pricing now",
          detail: "₹599–799/user/month (India) | AED 28–35/user/month (GCC). Free 14-day trial. Starter: up to 20 users at ₹499. Growth: 21–200 users at ₹699 (adds advanced dashboards and MoM features). Do not go below ₹499, too cheap signals 'not enterprise-ready'.",
        },
        {
          label: "At 6 months (post mobile + integrations)",
          detail: "Raise Growth tier to ₹899–999. Introduce Workplace add-on at ₹150/user (when those features are built). Add freemium entry tier (5 users free, forever) to drive viral SMB adoption.",
        },
        {
          label: "At 18 months",
          detail: "Enterprise tier: ₹1,499–1,999/user/month with on-premise deployment option (₹2–5L setup fee). GCC Enterprise: AED 50–70/user/month for full data sovereignty compliance stack.",
        },
        {
          label: "Pricing risk to watch",
          detail: "Do not compete on price alone against ClickUp ($7) or Notion ($8). Data sovereignty and MoM-to-task are worth a premium. Never discount below ₹499. Instead of discounting: offer extended trial (30–45 days), free onboarding session, or 2 months free on annual contract.",
        },
      ],
      pricingPositioningRows: [
        {
          label: "Single most defensible position",
          detail: "The only project management platform where 100% of your company's data ,tasks, documents, MoMs, communications ,stays on infrastructure you own. With MS Office document creation built in.",
        },
        {
          label: "Segments to prioritise this year",
          detail: "1. Tech/SaaS companies (50–300 employees, India metros) ,highest urgency, fastest cycle, engineering teams drive adoption\n2. Professional Services (consulting, legal, audit) in India + GCC ,data sovereignty is a compliance requirement, MoM-to-task is immediately compelling\n3. Lockated existing clients (all industries) ,zero CAC, warm relationships, cross-sell motion",
        },
        {
          label: "Competitor to displace most aggressively",
          detail: "Asana. It is the most common 'good enough' tool in target segments. Has no document creation, no MoM module, no sovereign storage. Displacement message: 'Replace Asana + Google Docs with one platform where your data never leaves your building.'",
        },
        {
          label: "What to STOP doing or saying",
          detail: "STOP: Pitching as 'just another PM tool' ,leads with feature list instead of sovereignty story\nSTOP: Saying 'we replace Jira' ,instead say 'keep Jira for engineering, use PTM for everyone else'\nSTOP: Discounting to compete with Notion/ClickUp pricing\nSTOP: Mentioning removed features (wallet, desk/space booking features, F&B, AI) in sales decks ,creates expectation confusion",
        },
        {
          label: "Recommended GTM motion Year 1",
          detail: "Founder-led direct sales (first 20 accounts). India-first outbound to CTOs, VPs Engineering, Managing Partners. Lockated existing clients as cross-sell pipeline. 2–3 invite-only roundtables on 'data sovereignty in work management'. GITEX (Dubai) for GCC presence.",
        },
      ],
      pricingImprovementRows: [
        {
          currentVP: "'All-in-one platform ,replace multiple tools'",
          whoResonates: "IT heads, cost-conscious COOs",
          improvedVersion: "'Stop paying for Asana, Google Docs, and a separate MoM tool. PTM does all three ,and your data stays on your servers.'",
          whyStronger: "Names the specific tools being replaced (Asana + Google Docs + MoM tool). More concrete than 'all-in-one'. Sovereignty angle makes the status quo feel uncomfortable.",
        },
        {
          currentVP: "'Data sovereignty ,your data stays on your servers'",
          whoResonates: "CIOs, CISOs, compliance teams, BFSI, Legal",
          improvedVersion: "'Your project plans, client deliverables, and meeting records shouldn't live on Asana's servers in Oregon. PTM keeps every byte on infrastructure you own ,period.'",
          whyStronger: "Names what data is at risk and where it currently lives. Sovereignty becomes visceral rather than abstract.",
        },
        {
          currentVP: "'Document creation with MS Office export'",
          whoResonates: "IT heads replacing MS 365, ops and finance teams",
          improvedVersion: "'Write proposals and reports inside PTM. Share with anyone as a real Word or Excel file. Stop paying ₹750/user/month for MS 365 to create documents that live on Microsoft's servers.'",
          whyStronger: "Names the financial saving and the sovereignty problem together. Choice becomes explicit.",
        },
        {
          currentVP: "'MoM to task in one click'",
          whoResonates: "Project managers, ops leads, consulting teams",
          improvedVersion: "'Every action item from every meeting becomes a tracked task, assigned to a person, with a deadline ,automatically. No more Word documents nobody follows up on.'",
          whyStronger: "Frames the outcome ('no more Word documents nobody follows up on') rather than the feature. Addresses the specific frustration the buyer has already felt.",
        },
        {
          currentVP: "'Replace Jira, Slack, and Asana'",
          whoResonates: "Founders and CXOs frustrated with tool sprawl",
          improvedVersion: "'Let engineering keep Jira. Give everyone else PTM ,one login, one bill, one place where your data lives on your terms.'",
          whyStronger: "Original sounds arrogant. Improved version acknowledges Jira's entrenchment, positions PTM for the majority, and leads with simplicity.",
        },
      ],
      featuresVsMarket: [
        {
          featureArea: "Task & Project Management",
          marketStandard:
            "Create projects, assign tasks, set deadlines, track status. Basic hierarchy: Project → Task.",
          ourProduct:
            "Project → Milestone → Task → Subtask with 15-column task table, sprint management.",
          status: "AHEAD",
          summary:
            "Four-tier hierarchy is deeper than Asana or Monday. Only ClickUp matches this depth.",
        },
        {
          featureArea: "Project Dashboards & Analytics",
          marketStandard: "Basic completion charts, assignee workload.",
          ourProduct:
            "8-chart project dashboard: completion, milestone, assignee-wise milestone progress, task completion, assignee-wise task status, task dependencies, issue breakdown.",
          status: "AHEAD",
          summary:
            "Dashboard depth matches Jira Premium. Most SMB tools offer 2–3 chart types maximum.",
        },
        {
          featureArea: "Issues Register (Client-Raised)",
          marketStandard:
            "Most PM tools mix internal bugs with client issues or have no structured issue register.",
          ourProduct:
            "Dedicated client issues register separate from internal tasks: ID, project, milestone, task, type, priority, status, responsible person.",
          status: "AHEAD",
          summary:
            "Separate client issue register is rare. Competitors either mix bugs with client issues or rely on email.",
        },
        {
          featureArea: "Sprint / Agile Management",
          marketStandard:
            "Jira: comprehensive. Asana, Monday: basic. ClickUp: moderate.",
          ourProduct:
            "Sprint module with task linking, sprint details, sprint-to-task association.",
          status: "AT PAR with ClickUp",
          summary:
            "Functional sprint management. Lacks velocity tracking and burndown charts ,roadmap gap vs Jira.",
        },
        {
          featureArea: "Document Creation & Editing",
          marketStandard:
            "External only (Google Docs, Notion, SharePoint). Almost no PM tool includes native doc creation.",
          ourProduct:
            "Full in-platform creation: Word, Excel, PPT, PDF. Real-time collaborative editing. Exports as official MS Office files.",
          status: "AHEAD ,UNIQUE",
          summary:
            "No PM competitor offers MS Office-compatible document creation and export. Replaces Google Workspace or MS 365 for document needs.",
        },
        {
          featureArea: "Data Sovereignty",
          marketStandard:
            "All competitors store data on their own cloud. No SMB PM tool offers client-hosted data.",
          ourProduct:
            "All data ,documents, tasks, chats, MoMs ,stored exclusively on the client's own database.",
          status: "AHEAD ,UNIQUE",
          summary:
            "Structural differentiator that competitors cannot easily copy without rebuilding their architecture.",
        },
        {
          featureArea: "Minutes of Meeting (MoM)",
          marketStandard:
            "Rarely built into PM tools. Usually Google Docs or a separate tool.",
          ourProduct:
            "Structured MoM with 9 data fields including direct conversion of action points to tasks.",
          status: "AHEAD ,UNIQUE",
          summary:
            "Auto-convert MoM action points to tasks saves 30+ minutes per meeting cycle. No PM competitor has this natively.",
        },
        {
          featureArea: "Opportunity Register",
          marketStandard:
            "Not present in any PM competitor. Closest: Aha! for product feedback (B2B SaaS only).",
          ourProduct:
            "Public suggestion forum ,employees or external visitors post ideas, tagged by department, convertible to tasks.",
          status: "AHEAD ,UNIQUE",
          summary:
            "Innovation capture built into the PM workflow. No direct competitor has this as a native PM feature.",
        },
        {
          featureArea: "Team Communication (Chat)",
          marketStandard:
            "Most require Slack/Teams separately. ClickUp has basic chat.",
          ourProduct:
            "Direct messages + group channels. Inline task creation from chat messages.",
          status: "AT PAR with ClickUp",
          summary:
            "Functional. Not as mature as Slack threading ,roadmap item.",
        },
        {
          featureArea: "Todo with Kanban + Eisenhower",
          marketStandard:
            "Kanban is common. Eisenhower matrix is rare in enterprise PM tools.",
          ourProduct:
            "Personal to-do list with both Kanban board view and Eisenhower matrix (urgency × importance) view.",
          status: "AHEAD",
          summary:
            "Eisenhower matrix differentiation is rare. Most tools offer kanban only for personal tasks.",
        },
        {
          featureArea: "Mobile App",
          marketStandard:
            "All major competitors have polished mobile apps (Jira, Asana, Monday, Notion, ClickUp).",
          ourProduct: "Not yet available.",
          status: "GAP",
          summary:
            "Critical gap for field teams, real estate site managers, any user away from a desk.",
        },
        {
          featureArea: "Third-party Integrations",
          marketStandard: "Jira: 3000+. Asana: 200+. Monday: 200+.",
          ourProduct:
            "No third-party integrations currently. Roadmap: Jira, GitHub, Slack, accounting tools (Tally, Zoho Books).",
          status: "GAP",
          summary:
            "Will cost deals in tech companies where GitHub/Jira sync is expected.",
        },
        {
          featureArea: "Gantt / Timeline View",
          marketStandard:
            "Standard in Asana (Premium+), Monday, MS Project, ClickUp.",
          ourProduct: "Not available.",
          status: "GAP",
          summary:
            "Will cost deals vs Asana and Monday when buyers ask for timeline view.",
        },
        {
          featureArea: "Workflow Automation",
          marketStandard:
            "Asana, Monday, ClickUp all have strong no-code automation.",
          ourProduct: "Not available.",
          status: "GAP",
          summary:
            "Buyers in ops-heavy companies expect 'when task moves to Done → notify manager' automation.",
        },
        {
          featureArea: "AI Assistant",
          marketStandard:
            "Notion AI, ClickUp AI, Jira AI (beta), Asana AI ,all in market.",
          ourProduct: "Not in current scope.",
          status: "GAP",
          summary:
            "Out of current scope. When added, should be grounded on sovereign data ,the key differentiator.",
        },
      ],
      comparisonSummary: {
        ahead:
          "Data sovereignty (unique) · MS Office document creation & export (unique) · MoM-to-task auto-conversion (unique) · Opportunity Register (unique) · 8-chart project dashboard (ahead) · 4-tier project hierarchy (deeper than most) · Client issues register (separate from internal bugs) · Eisenhower matrix for todos (rare)",
        atPar:
          "Team chat and channels (functional, not as mature as Slack) · Sprint management (functional, lacks burndown/velocity charts)",
        gaps: "Mobile app ,losing every deal with field teams or mobile-first users · Gantt/timeline view ,losing head-to-head vs Asana/Monday · Workflow automation ,ops-heavy buyers expect this · Third-party integrations ,tech companies expect GitHub/Jira sync · AI assistant ,not in current scope; when added, must be grounded on sovereign data to differentiate",
      },
      pricingLandscape: [
        {
          tier: "Standard pricing models",
          model:
            "Per-seat SaaS (annual billing) is the category standard. Freemium (free up to 10 users) drives viral adoption ,Notion, ClickUp, Asana all use it. Module add-ons create upsell revenue. Enterprise custom contracts with 20–30% discounts for 500+ seats.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
        {
          tier: "India price ranges",
          model:
            "Entry/Starter: ₹400–800/user/month. Mid/Professional: ₹900–1,500/user/month. Enterprise: ₹1,500–3,000/user/month (custom). Competitors: Asana Personal ~₹880, Jira Standard ~₹650, Monday Standard ~₹1,000, ClickUp Unlimited ~₹580.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
        {
          tier: "GCC price ranges",
          model:
            "Entry: $5–10/user/month (AED 18–37). Mid: $10–20/user/month (AED 37–73). Enterprise: $20–40+/user/month (custom, annual). GCC pricing carries a premium justified by data residency compliance value.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
        {
          tier: "Recommended pricing now",
          model:
            "₹599–799/user/month (India) | AED 28–35/user/month (GCC). Free 14-day trial. Starter: up to 20 users at ₹499. Growth: 21–200 users at ₹699 (adds advanced dashboards and MoM features). Do not go below ₹499 ,too cheap signals 'not enterprise-ready'.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
        {
          tier: "At 6 months (post mobile + integrations)",
          model:
            "Raise Growth tier to ₹899–999. Introduce Workplace add-on at ₹150/user (when those features are built). Add freemium entry tier (5 users free, forever) to drive viral SMB adoption.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
        {
          tier: "At 18 months",
          model:
            "Enterprise tier: ₹1,499–1,999/user/month with on-premise deployment option (₹2–5L setup fee). GCC Enterprise: AED 50–70/user/month for full data sovereignty compliance stack.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
        {
          tier: "Pricing risk to watch",
          model:
            "Do not compete on price alone against ClickUp ($7) or Notion ($8). Data sovereignty and MoM-to-task are worth a premium. Never discount below ₹499. Instead of discounting: offer extended trial (30–45 days), free onboarding session, or 2 months free on annual contract.",
          india: "",
          global: "",
          included: "",
          target: "",
        },
      ],
      positioning: [
        {
          category: "Single most defensible position",
          description:
            "The only project management platform where 100% of your company's data ,tasks, documents, MoMs, communications ,stays on infrastructure you own. With MS Office document creation built in.",
        },
        {
          category: "Segments to prioritise this year",
          description:
            "1. Tech/SaaS companies (50–300 employees, India metros) ,highest urgency, fastest cycle, engineering teams drive adoption\n2. Professional Services (consulting, legal, audit) in India + GCC ,data sovereignty is a compliance requirement, MoM-to-task is immediately compelling\n3. Lockated existing clients (all industries) ,zero CAC, warm relationships, cross-sell motion",
        },
        {
          category: "Competitor to displace most aggressively",
          description:
            "Asana. It is the most common 'good enough' tool in target segments. Has no document creation, no MoM module, no sovereign storage.\nDisplacement message: 'Replace Asana + Google Docs with one platform where your data never leaves your building.'",
        },
        {
          category: "What to STOP doing or saying",
          description:
            "STOP: Pitching as 'just another PM tool' ,leads with feature list instead of sovereignty story\nSTOP: Saying 'we replace Jira' ,instead say 'keep Jira for engineering, use PTM for everyone else'\nSTOP: Discounting to compete with Notion/ClickUp pricing\nSTOP: Mentioning removed features (wallet, desk/space booking features, F&B, AI) in sales decks ,creates expectation confusion",
        },
        {
          category: "Recommended GTM motion Year 1",
          description:
            "Founder-led direct sales (first 20 accounts), India-first outbound to CTOs, VPs Engineering, Managing Partners. Lockated existing clients as cross-sell pipeline. 2–3 invite-only roundtables on 'data sovereignty in work management'. GITEX (Dubai) for GCC presence.",
        },
      ],
      valuePropositions: [
        {
          currentProp: "'All-in-one platform ,replace multiple tools'",
          segment: "IT heads, cost-conscious COOs",
          weakness:
            "Stop paying for Asana, Google Docs, and a separate MoM tool. PTM does all three ,and your data stays on your servers.",
          sharpened:
            "Names the specific tools being replaced (Asana + Google Docs + MoM tool). More concrete than 'all-in-one'. Sovereignty angle makes the status quo feel uncomfortable.",
        },
        {
          currentProp: "Data sovereignty ,your data stays on your servers'",
          segment: "CIOs, CISOs, compliance teams, BFSI, Legal",
          weakness:
            "Your project plans, client deliverables, and meeting records shouldn't live on Asana's servers in Oregon. PTM keeps every byte on infrastructure you own ,period.'",
          sharpened:
            "Names what data is at risk and where it currently lives. Sovereignty becomes visceral rather than abstract.",
        },
        {
          currentProp: "'Document creation with MS Office export'",
          segment: "IT heads replacing MS 365, ops and finance teams",
          weakness:
            "'Write proposals and reports inside PTM. Share with anyone as a real Word or Excel file. Stop paying ₹750/user/month for MS 365 to create documents that live on Microsoft's servers.'",
          sharpened:
            "Names the financial saving and the sovereignty problem together. Choice becomes explicit.",
        },
        {
          currentProp: "'MoM to task in one click'",
          segment: "Project managers, ops leads, consulting teams",
          weakness:
            "'Every action item from every meeting becomes a tracked task, assigned to a person, with a deadline ,automatically. No more Word documents nobody follows up on.'",
          sharpened:
            "Frames the outcome ('no more Word documents nobody follows up on') rather than the feature. Addresses the specific frustration the buyer has already felt.",
        },
        {
          currentProp: "'Replace Jira, Slack, and Asana'",
          segment: "Founders and CXOs frustrated with tool sprawl",
          weakness:
            "Let engineering keep Jira. Give everyone else PTM ,one login, one bill, one place where your data lives on your terms.'",
          sharpened:
            "Original sounds arrogant. Improved version acknowledges Jira's entrenchment, positions PTM for the majority, and leads with simplicity.",
        },
      ],
    },
    detailedUseCases: {
      industryUseCases: [
        {
          rank: "1",
          industry: "Technology & SaaS Companies",
          features:
            "Dev teams use Sprints + Issues + Kanban for engineering workflows. PM teams run project dashboards with milestone tracking. Product managers create MoMs from client calls and auto-convert to tasks. Leadership monitors assignee-level completion and burn rates. All teams use Channels + DMs for collaboration. Data sovereignty is critical as code and product roadmaps are IP.",
          useCase:
            "Technology companies require sovereign task management to protect IP and meet government compliance while reducing their SaaS footprint (replacing Jira + Slack + Google Docs).",
          urgency:
            "HIGH. Jira/Atlassian pricing increases and data residency mandates for government SaaS contracts are live pain.",
          primaryBuyer:
            "CTO / VP Engineering (measured on sprint velocity, release frequency, engineering headcount efficiency).",
          primaryUser:
            "Developer / PM (frustrated by context-switching between Jira, Slack, Confluence, email).",
          profile:
            "50-500 employees. India metro cities (Bengaluru, Pune, Hyderabad, Mumbai) or GCC (Dubai, Abu Dhabi). Growth-stage or scaling.",
          currentTool:
            "Jira + Confluence + Slack + Google Workspace (4 separate bills)",
        },
        {
          rank: "2",
          industry: "Real Estate Developers & Construction",
          features:
            "Project tracking across multiple site construction milestones. Client issue register to track snags, requests, and complaints post-handover. MoM for weekly site reviews auto-converted to site tasks. Attendance tracking for site staff. Document drive for BOQs, drawings, and reports (replacing Google Drive + WhatsApp).",
          useCase:
            "Replacing chaotic WhatsApp groups and isolated Excel trackers with a single source of truth for site progress and client issues.",
          urgency:
            "HIGH. Construction delays cost crores per day; no structured digital task tracking exists at most mid-size developers.",
          primaryBuyer:
            "Project Director / COO (measured on on-time project delivery, cost overrun %, client satisfaction scores).",
          primaryUser:
            "Site Manager / Project Engineer (frustrated that WhatsApp messages become the task system and nothing is auditable).",
          profile:
            "Mid-to-large developers with 5-50 ongoing projects. Pan-India or GCC (UAE, Saudi).",
          currentTool:
            "Excel + WhatsApp + MS Project (chaotic, no single truth). FM Matrix clients are warm leads.",
        },
        {
          rank: "3",
          industry: "Professional Services (Consulting, Law, Audit Firms)",
          features:
            "Client project tracking with milestone and task ownership across teams. Client issue register for tracking deliverable queries. MoM for every client engagement meeting, action items auto-converted to tasks. Document drive for proposals, reports, and contracts; data sovereignty is essential for client confidentiality. Channels for cross-team collaboration on deals. Opportunity Register for internal innovation pitches.",
          useCase:
            "Ensuring absolute client confidentiality through on-premise task/document management while standardizing deliverable tracking.",
          urgency:
            "HIGH. Client confidentiality and data sovereignty are regulatory requirements, not preferences, in legal and audit contexts.",
          primaryBuyer:
            "Managing Partner / Practice Head (measured on billable utilisation, client retention, project margin).",
          primaryUser:
            "Consultant / Associate (frustrated that deliverable tracking happens in email threads and Excel, making accountability invisible).",
          profile:
            "20-200 professionals. Metro India (Mumbai, Delhi, Bengaluru) or GCC. Mid-size firms.",
          currentTool: "Monday.com or Asana + Google Docs + email",
        },
        {
          rank: "4",
          industry: "Manufacturing & Industrial",
          features:
            "Production milestone tracking across plant locations. Maintenance task assignment to technicians. Shift roster management. Attendance and punch-in/out for shop floor staff. Document drive for SOPs, safety manuals, and compliance docs. Kanban board for production line task flow. Issues register for client-raised quality complaints.",
          useCase:
            "Bridging the gap between heavy ERPs (SAP) and daily shop-floor coordination tasks.",
          urgency:
            "MEDIUM. Pain is real but SAP dependency creates switching inertia; PTM complements rather than replaces ERP.",
          primaryBuyer:
            "Plant GM / Operations Director (measured on OEE, downtime, on-time delivery).",
          primaryUser:
            "Shift Supervisor / Production Lead (frustrated that task handovers between shifts are verbal and undocumented).",
          profile:
            "100-2000 employees. Industrial corridors: Pune, Surat, Chennai, Ahmedabad in India; Jubail, KIZAD in GCC.",
          currentTool:
            "SAP for ERP, Excel for tasks, WhatsApp for coordination",
        },
        {
          rank: "5",
          industry: "BFSI (Banking, Financial Services & Insurance)",
          features:
            "Regulatory project tracking across compliance, IT, and operations teams. Document drive for policy documents and audit reports (data localisation mandated by RBI/SEBI). Attendance and roster for branch and back-office staff. MoM for board and committee meetings auto-converted to action items. Issues register for internal audit findings. Role-based access and audit trails for compliance.",
          useCase:
            "Meeting strict RBI/SEBI data localisation mandates while tracking compliance and core operations safely.",
          urgency:
            "HIGH. RBI's data localisation circular and SEBI's cloud guidelines create a regulatory mandate for sovereign data storage that PTM directly addresses.",
          primaryBuyer:
            "CIO / CISO / Head of Compliance (measured on zero data-breach incidents, audit pass rates, system uptime).",
          primaryUser:
            "Project Manager / Compliance Officer (frustrated that action items from audit committee meetings are lost in email and never systematically tracked).",
          profile:
            "Mid-size NBFCs, insurance companies, and fintech firms. 200-5000 employees. India (Mumbai, Delhi) or GCC (DIFC-regulated entities).",
          currentTool: "SharePoint + Jira + email for project tracking",
        },
        {
          rank: "6",
          industry: "Co-working Spaces & Managed Offices",
          features:
            "Facility project tracking using Projects and Tasks (fit-out timelines, maintenance projects). Client issue register for tenant complaints and facility requests. MoM for tenant and team meetings with auto-task conversion. Document drive for lease agreements and compliance documents. Channels for internal team communication. Opportunity Register for community improvement suggestions from members.",
          useCase:
            "Provide a dedicated project tracking layer natively integrated with community operations that standard facility tools lack.",
          urgency:
            "HIGH. Strong overlap with GoPhygital.work co-working product; PTM adds the project/team layer that pure booking tools lack.",
          primaryBuyer:
            "Community Manager / Operations Head (measured on member NPS, occupancy rate, renewal rate).",
          primaryUser:
            "Member company's team lead (frustrated that their team still uses Notion or Trello inside a co-working space while the space itself has zero project visibility).",
          profile:
            "Independent co-working operators and managed office providers. 5-50 locations. Metro India or UAE/KSA.",
          currentTool: "Mix of proprietary booking tools, Excel, and WhatsApp",
        },
        {
          rank: "7",
          industry: "Educational Institutions, Universities & EdTech",
          features:
            "Academic project tracking for research, curriculum development, and administrative projects. MoM for faculty committee meetings auto-converted to action items. Document drive for course materials and research papers (data sovereignty matters for institution IP). Attendance for staff and faculty. Opportunity register for student/faculty innovation ideas. Recognition feed for academic achievements.",
          useCase:
            "Organize administrative and academic committees while keeping institutional IP (research & courseware) securely on-premise.",
          urgency:
            "MEDIUM. Digital transformation budgets are growing but procurement cycles are long in institutions.",
          primaryBuyer:
            "Registrar / COO (Admin) (measured on administrative efficiency, compliance audit results, faculty satisfaction).",
          primaryUser:
            "Academic coordinator / Admin manager (frustrated that committee decisions and follow-up actions disappear into email and are never tracked).",
          profile:
            "Private universities, institutes, and EdTech companies. 200-5000 staff. India (NCR, Pune, Bengaluru) or GCC (UAE education hubs).",
          currentTool: "Google Workspace + Excel + email",
        },
        {
          rank: "8",
          industry: "Healthcare & Hospitals",
          features:
            "Operational project tracking for hospital expansion, accreditation, and compliance projects. Document drive for clinical protocols, SOPs, and NABH/JCI documents. MoM for clinical committee meetings. Issues register for patient complaints or quality non-conformances. Attendance for nursing and administrative staff. Roster management for shift planning.",
          useCase:
            "To track compliance milestones and action items without exposing sensitive clinical or operational data.",
          urgency:
            "MEDIUM. Strong fit for admin and compliance teams but clinical teams are harder to change; project starts with a non-clinical use case.",
          primaryBuyer:
            "COO / Hospital Administrator (measured on accreditation scores (NABH/JCI), patient satisfaction, operational cost per bed).",
          primaryUser:
            "Quality Manager / Admin Project Lead (frustrated that NABH action plans are tracked in Excel with no accountability or deadline visibility).",
          profile:
            "Mid-to-large private hospital groups and healthcare chains. 500-10,000 employees. India (metros + Tier 1 cities) or GCC (Saudi Arabia, UAE).",
          currentTool: "Excel + email for project management",
        },
        {
          rank: "9",
          industry: "Retail Chains & D2C Brands",
          features:
            "New store rollout project tracking with milestones (site, fit-out, hiring, launch). Marketing campaign task management via kanban and MoM. Document drive for vendor contracts and brand guidelines. Opportunity register for store manager innovation ideas. Channels for cross-store communication. Recognition feed for top-performing store or team.",
          useCase:
            "Centralizing store launch milestones and marketing campaign assets away from fragmented WhatsApp groups.",
          urgency:
            "MEDIUM. Buying is marketing/ops led but IT approval needed for data tools; cycle is manageable.",
          primaryBuyer:
            "VP Retail / Operations Head (measured on new store launch timelines, same-store sales growth, operational cost).",
          primaryUser:
            "Store Operations Manager / Brand Manager (frustrated that new store launch checklists exist in WhatsApp groups with no formal tracking).",
          profile:
            "Organised retail chains and growing D2C brands. 100-2000 employees. Pan-India metros or GCC (Dubai retail hubs).",
          currentTool: "WhatsApp + Google Sheets for project coordination",
        },
        {
          rank: "10",
          industry: "Government & PSUs",
          features:
            "Project tracking for government schemes and infrastructure projects. Document drive for government orders and compliance files (data sovereignty is a statutory requirement, must stay on government infrastructure). MoM for inter-departmental meetings. Attendance for government employees. Issues register for citizen complaints or audit observations.",
          useCase:
            "Mandatory compliance with local sovereign storage regulations for all departmental project tracking and communications.",
          urgency:
            "LOW-MEDIUM. Strong regulatory alignment for data sovereignty, but procurement is slow and requires tender process.",
          primaryBuyer:
            "Project Director / IAS Officer (measured on scheme completion %, expenditure against budget, audit compliance).",
          primaryUser:
            "Section Officer / Junior Project Manager (frustrated that follow-up on committee decisions is verbal and non-systematic).",
          profile:
            "Central and state government departments, PSUs, and government-run institutions. India-focused.",
          currentTool: "NIC tools or Excel + email",
        },
      ],
      internalTeamUseCases: [
        {
          team: "Engineering / Dev Team",
          features:
            "Runs sprint planning using the Sprints module, connecting sprint goals to milestone tasks. Uses Issues register to log client-reported bugs with priority and assignee. Kanban board shows sprint task status in real time. Channels used for code review discussions and quick decisions. MoM for sprint retrospectives auto-converts action items to tasks. Documents module stores technical specs and API docs, with data sovereignty protecting IP.",
          process:
            "Manages entire development lifecycle tracking natively instead of disjointed tools.",
          modules:
            "Sprints - Issues - Kanban - Channels - MoM - Documents - To-Do",
          benefit:
            "No more Jira + Confluence + Slack stack. Dev workflow, documentation, and communication unified in one sovereign environment.",
          frequency: "Daily",
        },
        {
          team: "Product Management",
          features:
            "Manages product roadmap as a project with milestones per release. Creates and prioritises tasks for upcoming sprints. Documents PRDs, user stories, and feature specs in Document Drive. Uses MoM to record product council decisions and auto-converts to engineering tasks. Opportunity Register captures user feedback and feature requests from external stakeholders. Dashboard tracks milestone completion and assignee workload.",
          process:
            "Consolidates feature requests, specs, and delivery timelines into a single trackable system.",
          modules:
            "Projects - Milestones - Documents - MoM - Opportunity Register - Dashboard",
          benefit:
            "Full product lifecycle, from idea capture (Opportunity Register) to delivery (sprint tasks), in one place.",
          frequency: "Daily",
        },
        {
          team: "Marketing Team",
          features:
            "Runs campaign projects with milestones (brief → creative → review → launch). Kanban board for campaign task status. MoM for client or agency review meetings, auto-converting feedback into tasks. Document Drive for campaign briefs, brand guidelines, and creative assets. Channels for cross-team campaign coordination. Issues register for client feedback on deliverables. Opportunity Register for campaign ideas.",
          process:
            "Tracks marketing campaigns and assets from conception through multi-stage approval to launch.",
          modules:
            "Projects - Kanban - MoM - Documents - Channels - Issues - Opportunity Register",
          benefit:
            "Replaces Monday.com and Google Docs combo. Campaign tracking and client comms managed without switching tools.",
          frequency: "Daily",
        },
        {
          team: "Sales Team",
          features:
            "Uses Opportunity Register to log leads and expansion ideas. MoM for client discovery and proposal meetings, auto-converting next steps to tasks. Issues register to track client complaints or post-sale escalations. Channels for deal collaboration with pre-sales and technical teams. Document Drive for proposals and contracts (sovereign, client data stays internal).",
          process:
            "Connects client meetings seamlessly to actionable post-call follow-ups.",
          modules: "Opportunity Register - MoM - Issues - Channels - Documents",
          benefit:
            "Client-facing meeting notes become tracked tasks instantly. Proposal documents stay on company servers, not Google Drive.",
          frequency: "Daily",
        },
        {
          team: "Operations / Admin Team",
          features:
            "Manages cross-functional operational projects with milestones. Document drive for SOPs, vendor contracts, and compliance files, version-controlled and sovereign. MoM for weekly ops reviews with auto-task conversion. Channels for inter-team coordination. Issues register for operational complaints or escalations. Opportunity Register for process improvement ideas.",
          process:
            "Coordinates back-office initiatives and policy management effectively.",
          modules: "Projects - Tasks - Documents - Channels - MoM",
          benefit:
            "Replaces 4-5 separate admin tools. SOPs, vendor docs, and project tracking unified. Ops review action items formally tracked.",
          frequency: "Daily",
        },
        {
          team: "HR Team",
          features:
            "Manages HR projects (appraisal cycles, policy rollouts, hiring drives) as milestones with task assignment. MoM for HR committee and policy review meetings, action items auto-tracked. Document drive for HR documentation, version-controlled and on company servers. Channels for HR team communication. Issues register for formal HR escalations. Opportunity Register for employee-raised improvement suggestions.",
          process: "Run confidential hiring/admin workflows entirely in-house.",
          modules: "Projects - MoM - Documents - Channels",
          benefit:
            "HR projects, policy docs, and committee decisions tracked in one platform. Policy documents version-controlled on company servers. Employee improvement suggestions formally captured.",
          frequency: "Daily",
        },
        {
          team: "Finance Team",
          features:
            "Tracks finance-specific projects (audit, compliance, system rollouts) with milestone deadlines. Document drive for financial reports, board presentations, and audit files, data sovereignty ensures financial data stays on company infrastructure. MoM for board and finance committee meetings with auto-task conversion. Issues register for audit observations and non-conformances.",
          process:
            "Securely organizes audits and financial schedules away from public clouds.",
          modules: "Projects - Projects Dashboard - Documents - MoM",
          benefit:
            "Board-level financial documents stored on company servers. Audit committee action items auto-converted to tasks. Audit observations formally tracked with accountability.",
          frequency: "Daily",
        },
        {
          team: "IT / System Admin",
          features:
            "Manages IT projects (infrastructure upgrades, system rollouts, security audits) with full milestone tracking. Role-Based Access Control (RBAC) for user provisioning. Document Drive administration, manages permissions, shared drives, folder structure. Monitors platform usage and adoption analytics. Issues register for internal IT helpdesk tickets. Data sovereignty configuration ensures all data stays on client infrastructure.",
          process:
            "Maintains absolute administrative control across all employee digital interactions.",
          modules: "Projects - RBAC - Documents (admin) - Issues - Dashboard",
          benefit:
            "One platform to manage, not six. Data sovereignty means IT controls the environment entirely, no vendor dependency on data location.",
          frequency: "Daily",
        },
        {
          team: "Leadership / CXO",
          features:
            "Projects Overview dashboard for real-time visibility: project completion rates, milestone status, assignee performance across teams. Projects Dashboard with 8 chart types, no status report preparation needed. Opportunity Register to stay connected to team innovation without another meeting. MoM records for key strategic meetings.",
          process:
            "High-level visualization of OKRs and strategic milestones without manual reporting.",
          modules:
            "Projects Dashboard - Projects Overview - MoM - Opportunity Register",
          benefit:
            "Five minutes on the platform shows more than a weekly status report. No need to ask, the data is live.",
          frequency: "Daily",
        },
        {
          team: "All Teams, Cross-functional Collaboration",
          features:
            "Every team uses Channels (DMs + group channels) for real-time communication, with the ability to turn any message into a task with one click. This removes WhatsApp-to-email-to-task friction. The Opportunity Register keeps innovation visible across all teams. Documents are shared within the platform, no email attachments, no version confusion.",
          process:
            "Unified collaboration eliminating disjointed internal communication.",
          modules:
            "Channels - DMs - Group Channels - To-Do from Chat - Todo - Opportunity Register",
          benefit:
            "Communication, tasks, and documents stop living in three different places. One conversation = one task = one record.",
          frequency: "Daily",
        },
      ],
    },
    detailedRoadmap: {
      structuredRoadmap: [
        {
          timeframe: "PHASE 1 , IMMEDIATE (0–3 MONTHS)",
          headline: "Stop losing deals we should be winning",
          colorContext: "red",
          phaseDescription:
            "These are features/fixes needed RIGHT NOW. Each one is actively costing us deals in current pipeline.",
          items: [
            {
              featureName: "Mobile App (iOS + Android)",
              whatItIs:
                "A fully functional mobile version of PTM covering tasks, to-dos, approvals, notifications, MoM, channels, and the task performance tracking. Field teams and executives make decisions on their phones.",
              whyItMatters:
                "The #1 objection in every enterprise demo. Real estate site managers, healthcare admins, and any CXO will not adopt a desktop-only tool. Currently losing every deal where the primary user is away from a desk.",
              unlockedSegment:
                "Real Estate site teams · Healthcare ops · All field-facing industries · Any CXO who checks status on the go",
              dealRisk:
                "CRITICAL , actively losing deals. Every competitor (Jira, Asana, Monday, Notion) has a polished mobile app. This is table-stakes, not a differentiator.",
              priority: "P0 , Highest",
              effort: "",
              owner: "",
            },
            {
              featureName: "Live Demo Environment",
              whatItIs:
                "A publicly accessible, pre-seeded demo instance showing a fully configured PTM account with sample projects, tasks, milestones, MoM, kanban board, issues, documents, and dashboards , accessible without sales involvement.",
              whyItMatters:
                "Prospects cannot evaluate a product they cannot see. Currently every prospect requires a founder-led demo, creating a bottleneck that limits how many deals can run in parallel. A self-serve demo environment also qualifies inbound leads before sales time is spent.",
              unlockedSegment:
                "All segments , but especially Tech/SaaS (who self-evaluate tools before contacting sales) and Professional Services (who want to explore before committing a meeting).",
              dealRisk:
                "HIGH , currently every conversation requires a live demo call. Without a sandbox, the sales cycle is bottlenecked on founder availability.",
              priority: "P0 , Highest",
              effort: "",
              owner: "",
            },
            {
              featureName: "GitHub / GitLab Integration",
              whatItIs:
                "Two-way sync between GitHub/GitLab and PTM. Commits and PRs link to PTM sprint tasks. When a PR is merged, linked task auto-moves to Done. Sprint boards reflect real code progress without manual updates.",
              whyItMatters:
                "Tech/SaaS companies use GitHub or GitLab for code. Without this, dev teams won't adopt PTM for sprint tracking ,they'll stay in Jira. This is the bridge that makes PTM credible for engineering teams at tech companies.",
              unlockedSegment:
                "Tech / SaaS companies ,engineering and product teams",
              dealRisk:
                "HIGH for Tech segment ,engineering adoption blocked without code integration",
              priority: "P1 ,High",
              effort: "",
              owner: "",
            },
            {
              featureName: "Velocity Tracking & Burndown Charts for Sprints",
              whatItIs:
                "Auto-calculated sprint velocity (story points completed per sprint), burndown chart showing remaining work vs time, and a 'sprint health score' updated in real time during the sprint.",
              whyItMatters:
                "Tech/SaaS companies using PTM for engineering sprint management will benchmark sprint tooling against Jira. Without velocity and burndown, PTM loses every head-to-head evaluation against Jira for dev teams.",
              unlockedSegment:
                "Tech / SaaS companies (Engineering and Product teams) · Any org running agile methodology",
              dealRisk:
                "HIGH for Tech segment , without this, engineering teams will keep Jira and PTM never gets adopted by the most influential users in tech companies.",
              priority: "P1 , High",
              effort: "",
              owner: "",
            },
          ],
        },
        {
          timeframe: "PHASE 2 , SHORT-TERM (3–6 MONTHS)",
          headline: "Expand addressable market & move up-market",
          colorContext: "green",
          phaseDescription:
            "These features open new segments, increase ACV, and move PTM from SMB to mid-market.",
          items: [
            {
              featureName: "No-Code Workflow Automation",
              whatItIs:
                "Visual rule builder: 'When [trigger] happens → do [action]'. E.g.: When task moves to Done → notify assignee's manager + create follow-up task. When sprint ends → auto-generate retrospective MoM. No engineering required to configure.",
              whyItMatters:
                "Automations are now table-stakes in the PM category. Asana and Monday both lead with this. Without automation, ops-heavy buyers (operations, marketing, HR) find the tool too manual. Automation also drives daily active usage , automated notifications keep users returning to the platform.",
              unlockedSegment:
                "Operations teams · Marketing teams · HR teams · Any company with repetitive workflow patterns · Mid-market buyers comparing to Monday or Asana",
              dealRisk:
                "Medium-HIGH , will begin losing to Asana and Monday in ops-buyer evaluations as deal sizes grow.",
              priority: "P1 , High",
              effort: "",
              owner: "",
            },
            {
              featureName: "GitHub / GitLab + Jira Integration",
              whatItIs:
                "Two-way sync: GitHub/GitLab commits and PRs linked to PTM tasks. When a PR is merged, the linked task auto-moves to Done. Jira issues can be imported as PTM tasks. Allows engineering teams to stay in their existing dev tools while their work surfaces in PTM. Keep Jira for engineering, use PTM for everything else. Rollout pitch also needs Jira sync to stay credible.",
              whyItMatters:
                "Tech companies almost universally use GitHub or GitLab for code. Without integration, PTM cannot win engineering adoption , and engineering teams are the most influential internal advocates for any PM tool. The 'Keep Jira for engineering, use PTM for everything else' pitch also needs Jira sync to stay credible.",
              unlockedSegment:
                "Tech / SaaS companies (specifically Engineering teams) · Product companies using agile with existing GitHub workflows",
              dealRisk:
                "HIGH for Tech segment , without this, engineering adoption is blocked and the cross-company rollout pitch fails.",
              priority: "P1 , High",
              effort: "",
              owner: "",
            },
            {
              featureName: "Advanced Analytics & Custom Reports",
              whatItIs:
                "Drag-and-drop report builder: select dimensions (project, assignee, milestone, time period, tag) and metrics (completion rate, delay rate, hours logged, MoM action completion rate). Schedule automated email reports. Export to PDF or CSV. Role-based report sharing.",
              whyItMatters:
                "CXOs and PMOs need reports they can present to boards. Mid-market companies that have outgrown basic dashboards want to build their own views. This feature moves PTM from an operational tool to a strategic reporting layer, dramatically increasing ACV and stickiness.",
              unlockedSegment:
                "CXOs and PMOs at 100+ employee companies · BFSI (compliance reports) · Real Estate (investor reporting) · Any company where project data feeds into board-level decisions",
              dealRisk:
                "MEDIUM , current dashboards serve SMBs. Custom reports are required to win enterprise and 200+ employee accounts.",
              priority: "P2 , Medium-High",
              effort: "",
              owner: "",
            },
            {
              featureName: "Freemium Entry Tier (5 users, forever free)",
              whatItIs:
                "A genuinely useful free tier for up to 5 users , includes core project management, tasks, kanban, channels, and to-do. Excludes: advanced dashboards, custom reports, sprint velocity charts, and full export. No time limit , free forever.",
              whyItMatters:
                "Notion's dominance in Indian startups is built on a free tier that creates viral adoption. Individual users adopt, drag their team in, team grows → paid plan. PTM needs bottom-up viral adoption to reduce CAC. A free tier also provides market intelligence , which features free users hit limits on first reveals the upgrade path.",
              unlockedSegment:
                "Indian startup ecosystem (Bengaluru, Mumbai) · Individual contributors at SMBs · Teams currently on Notion or Trello who have outgrown it · GCC free-zone micro-businesses",
              dealRisk:
                "MEDIUM , without a free tier, PTM is invisible to the viral adoption engine that drives PM tool growth.",
              priority: "P2 , Medium-High",
              effort: "",
              owner: "",
            },
            {
              featureName: "AI , MoM Auto-Extraction from Transcripts",
              whatItIs:
                "User uploads or pastes a meeting transcript (or audio recording via Zoom/Meet integration). AI reads it, identifies action items, suggests responsible persons based on who was mentioned, and generates a draft MoM with tasks pre-filled. User reviews and approves in one click.",
              whyItMatters:
                "MoM creation is the most time-consuming meeting admin task. This feature saves 20–40 minutes per meeting and is the kind of 'magic moment' that gets people to recommend PTM to a colleague. It also strengthens the MoM-to-task workflow , the single most unique process in the platform.",
              unlockedSegment:
                "All knowledge-worker teams · Consulting and professional services (who live in client meetings) · Any team with more than 5 meetings per week",
              dealRisk:
                "MEDIUM , not a deal-closer but a powerful activation and retention feature. Will drive NPS uplift.",
              priority: "P2 , Medium",
              effort: "",
              owner: "",
            },
            {
              featureName: "Workflow Automation (No-code)",
              whatItIs:
                "Visual no-code rule builder , 'When [trigger] → do [action]'. E.g.: task moves to Done → notify manager + create follow-up. Sprint ends → auto-generate retrospective MoM stub. Issue raised → assign by category rule. Configurable without engineering.",
              whyItMatters:
                "Automations are table-stakes in PM. Asana and Monday lead with this. Without it, ops-heavy buyers find PTM too manual. Automation also drives DAU , automated notifications pull users back into the platform daily.",
              unlockedSegment:
                "Operations teams · Marketing teams · All companies with repetitive workflow patterns",
              dealRisk:
                "Medium-HIGH ,losing ops-buyer evaluations to Asana and Monday",
              priority: "P1 , High",
              effort: "",
              owner: "",
            },
          ],
        },
        {
          timeframe: "PHASE 3 , MEDIUM-TERM (6–18 MONTHS)",
          headline: "Build the long-term moat",
          colorContext: "purple",
          phaseDescription:
            "These capabilities become structural advantages that are hard to copy. Build the moat here.",
          items: [
            {
              featureName: "AI Copilot , Grounded on Sovereign Data (RAG)",
              whatItIs:
                "An AI assistant (not in current scope) that answers questions using the company's own PTM data , not generic knowledge. 'Which projects are at risk of delay this quarter?' 'Summarize all action items from last month's client meetings.' 'Draft a project status email for Project Alpha based on current task completion.' All answers drawn from real company data, never hallucinated.",
              whyItMatters:
                "This is the moat. Every competitor's AI is generic. PTM's AI is the only one trained on your sovereign data , meaning it gives answers that are accurate, contextual, and company-specific. This moves PTM from a 'tool' to an 'intelligence layer' , a category shift that dramatically increases switching cost and ACV.",
              unlockedSegment:
                "All segments , but especially Enterprise accounts (200+ employees) where the volume of projects, tasks, and documents is large enough for AI to deliver obvious value. BFSI and Legal where AI grounded in their own data is safer than generic LLM output",
              dealRisk:
                "MEDIUM now , HIGH in 12 months as AI-native work tools become the new baseline expectation.",
              priority: "Strategic Moat",
              effort: "",
              owner: "",
            },
            {
              featureName: "On-Premise / Private Cloud Deployment Option",
              whatItIs:
                "A fully supported on-premise deployment package: PTM running entirely within the client's own data centre or private cloud (AWS India region, Azure India, or dedicated server). Includes installation scripts, monitoring, update management, and a professional services setup fee (₹2–5L one-time).",
              whyItMatters:
                "Data sovereignty is our #1 USP , but currently it's a claim, not a product capability. On-premise deployment makes the claim provable. BFSI, Government, and large manufacturing clients require on-premise for regulatory compliance. This feature converts 'interested but can't approve' deals in regulated industries into signed contracts.",
              unlockedSegment:
                "BFSI (RBI/SEBI data localisation) · Government and PSUs · Large manufacturing (sensitive production data) · Healthcare (HIPAA-equivalent requirements in GCC) · Any GCC entity under PDPL or Saudi NDMO regulation",
              dealRisk:
                "HIGH for regulated industries , currently losing every BFSI and Government deal where 'cloud-only' is a disqualifier.",
              priority: "Strategic Moat",
              effort: "",
              owner: "",
            },
            {
              featureName: "Time Tracking & Billable Hours",
              whatItIs:
                "Built-in time tracking per task: start/stop timer or manual entry. Billable vs non-billable classification. Client-level billing rate configuration. Automated timesheet generation. Export to invoice format. Integration with accounting tools.",
              whyItMatters:
                "Professional services firms (consulting, law, audit, agencies) bill clients by the hour. Without time tracking, PTM cannot displace their current tool stack. This feature unlocks the entire billable-hours segment , consulting, legal, creative agencies, IT services , which are high-ACV clients with strong retention.",
              unlockedSegment:
                "Consulting firms · Law firms · Audit firms · Creative and marketing agencies · IT services and outsourcing companies · Any professional services firm billing clients by the hour",
              dealRisk:
                "HIGH for Professional Services segment , without time tracking, this entire high-ACV segment will not migrate off their current tools.",
              priority: "P1 for Professional Services segment",
              effort: "",
              owner: "",
            },
            {
              featureName:
                "Marketplace / Integration Ecosystem (50+ integrations)",
              whatItIs:
                "A curated integration marketplace: Slack (message sync), Salesforce (opportunity → project), SAP (approval sync), Zoom/Meet (meeting → MoM), WhatsApp Business (task notifications), Accounting tools (Tally, Zoho Books, QuickBooks), and 40+ more. Open API + webhook framework for custom integrations.",
              whyItMatters:
                "Enterprise buyers evaluate integration catalogues. Jira's 3,000+ integration marketplace is a moat , everything connects to it. PTM needs a credible integration story (not 3,000 , but the 20 integrations that matter to Indian and GCC enterprise buyers). An open API also enables partners and SIs to build integrations, creating an ecosystem flywheel.",
              unlockedSegment:
                "All enterprise segments (200+ employees) · Tech companies (GitHub, Slack, Zoom) · Real Estate (SAP) · BFSI (Salesforce, Tally) · Professional Services (Zoom, QuickBooks)",
              dealRisk:
                "HIGH for enterprise , without integrations, PTM stays in the SMB segment and cannot compete for 200+ employee accounts.",
              priority: "Strategic , Ecosystem",
              effort: "",
              owner: "",
            },
            {
              featureName: "PTM for External Clients (Client Portal)",
              whatItIs:
                "A limited-access portal for external clients to view project status, raise issues (client issue register), review and approve deliverables, and communicate with the team , all without a PTM login or seat. Client sees only what they're permitted to see.",
              whyItMatters:
                "Professional services firms, agencies, and real estate developers need to share project status with clients without giving them full system access. Currently requires email, PDF reports, or a separate client-facing tool. A built-in client portal eliminates external reporting overhead and makes PTM sticky for the vendor (can't switch without losing client visibility).",
              unlockedSegment:
                "Professional services (consulting, agencies, IT services) · Real estate developers sharing project progress with investors and buyers · Any B2B company managing client projects",
              dealRisk:
                "MEDIUM now , HIGH once PTM has traction in professional services segment.",
              priority: "P2 , Medium",
              effort: "",
              owner: "",
            },
            {
              featureName:
                "Task Performance Tracking (Roadmap) → Full Payroll Integration",
              whatItIs:
                "Extend the task performance tracking into a full payroll integration layer: connect project milestone completion calculations to payroll software (Darwinbox, Keka, Razorpay Payroll). Auto-generate salary disbursement instructions based on project task tracking balances. Full audit trail from task completion → performance score → salary credit.",
              whyItMatters:
                "Professional services firms and agencies need to share project progress with clients without granting full system access. A built-in client portal eliminates the weekly status email and PDF report. The vendor cannot switch without losing client visibility ,this creates high switching cost.",
              unlockedSegment:
                "Companies with project milestone completion structures (sales teams, consulting, gig-adjacent workforces) · HR and finance heads who currently reconcile bonuses manually in Excel · Mid-market companies in India where Darwinbox / Keka are the payroll backbone",
              dealRisk:
                "MEDIUM , the project task tracking is unique now. Full payroll integration makes it irreplaceable.",
              priority: "Strategic Moat",
              effort: "",
              owner: "",
            },
          ],
        },
      ],
      enhancementRoadmap: [
        {
          rowId: "1",
          module: "Projects Dashboard",
          featureName: "Smart Anomaly Alerts",
          currentStatus:
            "Dashboard shows charts for project completion, milestone progress, and assignee performance, user must manually read and interpret trends.",
          enhancedVersion:
            "AI layer auto-scans dashboards daily and surfaces proactive alerts like 'Project Alpha has 3 tasks at risk of missing deadline', 2 assignees haven't updated status in 4 days.' Sends digest to PM every morning with recommended actions.",
          integrationType: "AI (LLM + rule engine)",
        },
        {
          rowId: "2",
          module: "Tasks Table",
          featureName: "Natural Language Task Creation",
          currentStatus:
            "User opens the task form, fills in title, assigns person, sets deadline, selects priority manually.",
          enhancedVersion:
            "User types or voice-inputs: 'Assign the landing page redesign to Priya, due next Friday, high priority, linked to Q2 sprint.' AI parses the sentence and auto-fills the entire task form, user just confirms.",
          integrationType: "AI (NLP / voice)",
        },
        {
          rowId: "3",
          module: "MoM , Convert to Task",
          featureName: "Auto MoM Extraction",
          currentStatus:
            "User manually types each MoM point, assigns responsible person, and sets due date one by one. Option to convert to task is a manual click.",
          enhancedVersion:
            "User uploads or pastes meeting transcript / audio recording. AI reads it, identifies action items automatically, suggests responsible persons based on who was mentioned, and generates a draft MoM with tasks pre-filled. User reviews and approves.",
          integrationType:
            "AI (transcript analysis) + MCP (calendar / meeting bot)",
        },
        {
          rowId: "7",
          module: "Issues Register",
          featureName: "Smart Issue Routing & Triage",
          currentStatus:
            "Client raises an issue manually. It is assigned to a responsible person by the project manager after reviewing the details.",
          enhancedVersion:
            "AI reads the issue description on submission and auto-assigns it to the most relevant person based on past issue resolution history and category patterns. Flags if a similar issue was raised before ('This matches Issue #34, resolved by X') and suggests Y. Drafts a first-response message for the assignee to review and send. Issue routing time drops from hours to seconds.",
          integrationType: "AI (classification + routing + entity matching)",
        },
        {
          rowId: "5",
          module: "Document Sharing & Export",
          featureName: "Manual Export",
          currentStatus:
            "When ready to share externally, user clicks export and downloads the file, then emails or shares it separately.",
          enhancedVersion:
            "User types recipient's email in the share panel. System auto-converts the document to the right format (.docx / .pdf), attaches it, and sends directly, with a read-receipt back in the platform. Recipient gets a clean MS Office file. No extra steps.",
          integrationType: "MCP (email / SMTP integration)",
        },
        {
          rowId: "6",
          module: "Opportunity Register",
          featureName: "Static Suggestion Board",
          currentStatus:
            "Anyone posts a suggestion. It sits in a list. Managers review when they remember to.",
          enhancedVersion:
            "AI reads every new suggestion and auto-tags it by department, effort level, and strategic theme. Weekly digest is sent to relevant department heads. High-voted suggestions auto-generate a task proposal that manager can approve with one click.",
          integrationType: "AI (classification + summarization)",
        },
        {
          rowId: "7",
          module: "Sprints",
          featureName: "Manual Sprint Planning",
          currentStatus:
            "Team lead manually selects tasks for each sprint based on rough capacity estimates. Effort and velocity data from past sprints is not used systematically.",
          enhancedVersion:
            "AI analyses past sprint velocity (tasks/story points completed per sprint), current team availability, and task complexity. Recommends optimal sprint scope and shows a predicted completion % before the sprint starts. Flags tasks too large for the sprint window.",
          integrationType: "AI (velocity prediction + capacity modelling)",
        },
        {
          rowId: "8",
          module: "To-Do , Eisenhower Matrix",
          featureName: "Manual Quadrant Sorting",
          currentStatus:
            "User drags To-Do items into the four quadrants (Urgent/Important, Not Urgent/Important, Urgent/Not Important, Neither) manually.",
          enhancedVersion:
            "AI auto-suggests quadrant placement based on deadline proximity, task tags, project priority, and the user's historical patterns. Shows why it placed an item in a quadrant: 'This is Urgent/Important because the deadline is tomorrow and it's tagged to a client-facing milestone.'",
          integrationType: "AI (classification)",
        },
        {
          rowId: "12",
          module: "Issues Register",
          featureName: "Predictive Issue Escalation",
          currentStatus:
            "Issues are escalated manually when someone remembers to follow up. TAT breaches are noticed after the fact.",
          enhancedVersion:
            "AI monitors all open issues and predicts which ones are at risk of breaching their TAT based on assignee workload, issue age, and historical patterns for similar issues. Sends a proactive alert to the project manager 24 hours before predicted breach. Suggests reassignment if the current assignee is overloaded.",
          integrationType: "AI (predictive analytics + workload monitoring)",
        },
        {
          rowId: "13",
          module: "Sprints",
          featureName: "Sprint Scope Recommendation",
          currentStatus:
            "Team lead manually selects which tasks to include in a sprint based on rough estimates and memory of team capacity.",
          enhancedVersion:
            "AI analyses past sprint velocity (how many tasks/story points the team actually completed per sprint), current team availability, and task complexity tags. Automatically recommends an optimal sprint scope and flags tasks that are too large for the sprint window. Shows a 'predicted completion %' before the sprint starts.",
          integrationType: "AI (velocity prediction + capacity modelling)",
        },
        {
          rowId: "14",
          module: "Documents",
          featureName: "Smart Document Templates",
          currentStatus:
            "User creates a new document from a blank page and structures it manually. Every proposal, MoM, or report starts from scratch.",
          enhancedVersion:
            "When user clicks 'New Document', AI asks: 'What are you writing?', user selects from smart templates (client proposal, project brief, MoM summary, status report, SOW) pre-filled with company branding, project context from PTM, and placeholder sections. A 30-minute document creation task becomes a 5-minute review-and-personalise task.",
          integrationType:
            "AI (generative + context injection) + MCP (company brand assets)",
        },
        {
          rowId: "15",
          module: "Channels",
          featureName: "Smart Thread Summarisation",
          currentStatus:
            "Team messages each other in group channels. Long threads lose context, important decisions are buried in scroll.",
          enhancedVersion:
            "Any user can type '/summarise' in any channel or thread. AI produces a 3-bullet-point summary of the discussion, highlights any action items or decisions mentioned, and offers to convert them to MoM points or tasks with one click. Also auto-surfaces threads that mention deadlines or unresolved questions to the relevant project manager.",
          integrationType:
            "AI (summarisation + entity linking) + MCP (notification)",
        },
        {
          rowId: "17",
          module: "Opportunity Register",
          featureName: "AI-Powered Idea Intelligence",
          currentStatus:
            "Anyone posts a suggestion. It sits in a list. Managers review when they remember to. No prioritisation or follow-through system.",
          enhancedVersion:
            "AI reads every new suggestion and auto-tags it by department, effort level, strategic theme, and feasibility. Sends a weekly digest to relevant department heads with the top 3 ideas by upvote and impact score. High-voted suggestions auto-generate a task proposal that the relevant manager can approve with one click, turning ideas into action in 24 hours.",
          integrationType:
            "AI (classification + summarisation + task generation)",
        },
        {
          rowId: "18",
          module: "Projects Dashboard",
          featureName: "Cross-Project Dependency Alerts",
          currentStatus:
            "Project managers view dashboards per project. If a delay in Project A will impact Project B, this is spotted manually, if at all.",
          enhancedVersion:
            "AI maps task dependencies across projects and alerts the project manager when a delay in one project is predicted to cascade into another. Example: 'Task X in Project A (delayed by 3 days) is a predecessor of Task Y in Project B. Project B's milestone is now at risk.' Surfaces the ripple before it becomes a missed deadline.",
          integrationType: "AI (dependency graph + predictive delay modelling)",
        },
        {
          rowId: "16",
          module: "Opportunity Register",
          featureName: "Idea Prioritisation & Routing",
          currentStatus:
            "Suggestions are submitted and sit in a chronological list. No automatic prioritisation or routing to the relevant team or decision-maker.",
          enhancedVersion:
            "AI reads each new suggestion and auto-tags it by department, effort level, and strategic theme. Sends weekly digest to relevant department heads with top ideas ranked by upvote score and AI-assessed feasibility. High-voted items generate a one-click task proposal for the manager to approve.",
          integrationType: "AI (classification + routing + summarisation)",
        },
        {
          rowId: "18",
          module: "Issues Register",
          featureName: "Issue Pattern Detection & Knowledge Base",
          currentStatus:
            "Each client issue is treated as a standalone record. Patterns across recurring issues are spotted manually, if at all.",
          enhancedVersion:
            "AI identifies recurring issue patterns across the register (e.g., 'Waterproofing complaints spike in monsoon projects'). Builds a searchable resolution knowledge base. When a new issue is raised, AI surfaces similar past issues and their solutions. Reduces repeat escalations and resolution time for known issue types.",
          integrationType:
            "AI (pattern recognition + knowledge base generation)",
        },
      ],
    },
    detailedBusinessPlan: {
      planQuestions: [
        {
          id: "Q1",
          question:
            "Why does your company exist? What impact are you here to make?",
          answer:
            "We exist because every company in the world is haemorrhaging productivity, money, and intellectual property through the same broken pattern: 4–6 separate tools, none of which talk to each other, and all of which store your company's most sensitive data on servers you will never control. We built Project & Task Manager to give organisations , from a 50-person startup in Bengaluru to a 2,000-person enterprise in Dubai , a single platform where their teams plan, execute, communicate, and get paid, with every byte of data stored exclusively on infrastructure they own.\n\nThe impact we are here to make is simple: make data sovereignty the default expectation in work management, not a luxury. Every organisation we onboard stops paying rent on their own intellectual property and starts owning the infrastructure of their daily work.",
          source:
            "Output 1 , Product Summary / Output 3 , Market Analysis (Pain Points)",
          flag: "Ready",
          colorContext: "blue",
        },
        {
          id: "Q2",
          question:
            "What 4–5 values or behaviours best represent your team or culture?",
          answer:
            "Value 1: Ownership over access , we build for founders and leaders who want to own their data, not rent it. This is not just a product feature; it is how we operate internally. We own our decisions and our mistakes.\n\nValue 2: Clarity over complexity , in a category full of tools that overwhelm users with features, we are obsessed with making things simpler. Every decision we make , product, communication, pricing , must reduce complexity, not add to it.\n\nValue 3: Velocity with integrity , we move fast, but we ship what we promise. Speed without quality costs us the trust of the companies that have entrusted their data to our platform.\n\nValue 4: Sovereign mindset , we believe organisations have a right to control their own data, their own workflows, and their own productivity infrastructure. We advocate for this in product decisions, in sales conversations, and in the market.\n\nValue 5: Customer obsession over product ego , we listen more than we pitch. A feature that solves a real customer problem beats a technically elegant feature that no one asked for.",
          source:
            "Output 8 , Positioning / Founder input required , please replace any values that don't reflect your actual team",
          flag: "Founder Review",
          colorContext: "red",
        },
        {
          id: "Q3",
          question: "What USPs make you stand out from competitors?",
          answer:
            "USP 1 ,Data sovereignty (for IT Heads, CISOs, and compliance teams): We are the only work management platform at SMB pricing where 100% of company data ,tasks, documents, communications, MoMs ,stays on infrastructure the client owns and controls. No competitor offers this without an enterprise contract. This directly addresses RBI/SEBI data localisation requirements in India and PDPL/NDMO regulations in the GCC.\n\nUSP 2 ,MS Office document creation and export (for IT heads replacing MS 365, ops and finance teams): Teams can create Word documents, Excel sheets, PowerPoint presentations, and PDFs inside PTM and export them as official Microsoft Office files. No other PM tool in our price range does this. We replace a ₹750+/user/month MS 365 subscription for document creation.\n\nUSP 3 ,MoM-to-task auto-conversion (for project managers, ops leads, and consulting teams): Every meeting action item is automatically converted into an assigned task with a deadline and responsible person ,in one click. No more Word documents with action points nobody follows up on. No PM competitor has this as a native, structured workflow.\n\nUSP 4 ,Opportunity Register (for leadership and product teams): A public suggestion forum where any employee or external stakeholder can post ideas that are tagged, prioritised, and converted to tasks. No PM competitor has this built natively into the project management workflow. PTM becomes an innovation management layer.\n\nUSP 5 ,All-in-one consolidation at mid-market price (for cost-conscious COOs and founders): PTM replaces Jira/Asana + Slack + Google Docs + a MoM/notes tool ,typically 4 separate subscriptions ,with one platform at ₹599–799/user/month. All on infrastructure the client owns.",
          source:
            "Output 4 , Competitor Mapping / Output 5 , Feature Comparison (Features & Pricing sheet)",
          flag: "Ready",
          colorContext: "green",
        },
        {
          id: "Q4",
          question:
            "What bold outcome do you want to achieve in the next 10–15 years? Your BHAG.",
          answer:
            "In 15 years, data sovereignty in work management will be the global default , not a premium feature , and Project & Task Manager will be the platform that made it so.\n\nSpecifically: by 2038, PTM will be the work OS of choice for 100,000 companies across India and the GCC , the region where data sovereignty regulation, rapid digital adoption, and affordable enterprise software are converging into the largest greenfield opportunity in the work management category. We will have built the first work management platform that also functions as the financial accountability layer for an organisation , where every task completed flows directly into payroll, and where every piece of company data lives permanently on infrastructure the company owns.\n\nThe transformation we are driving: organisations stop being tenants on vendor infrastructure and become owners of their own digital operations.",
          source:
            "Output 2 , Market Fit Analysis / Output 8 , Strategic Positioning , Adjust ambition level to match your personal conviction",
          flag: "Founder Review",
          colorContext: "purple",
        },
        {
          id: "Q5",
          question: "What do you want to achieve in the next 3–5 years?",
          answer:
            "Revenue and scale targets:\n, Year 2: ₹2–3 crore ARR. 150–200 paying companies. Average contract value of ₹12–18L/year. India-first with initial GCC accounts.\n, Year 3: ₹8–12 crore ARR. 500+ companies. Expand to UAE and Saudi Arabia as primary GCC markets. Launch partner/reseller channel in GCC with 5–10 SI partners contributing 20–30% of new ARR.\n, Year 4–5: ₹25–40 crore ARR. 1,500+ companies. Mobile app fully mature. On-premise enterprise tier available. HRMS and payroll integrations live. AI Copilot grounded on sovereign data launched and positioned as category leader.\n\nGeographies: India metros (Bengaluru, Mumbai, Delhi, Pune, Hyderabad) → GCC (Dubai, Abu Dhabi, Riyadh, Doha) → Southeast Asia exploratory (Singapore, Indonesia) by Year 5.\n\nProduct milestones: Mobile app (Year 1), Gantt + automations (Year 1), GitHub/Jira integration (Year 2), on-premise deployment (Year 2), AI Copilot on sovereign data (Year 3), payroll integration (Year 3).\n\nCategory leadership: Be the brand that defines 'data sovereign work management' , the way Notion defined 'flexible wiki-meets-tasks'.",
          source:
            "Output 6 , Pricing Evolution / Output 8 , Strategic Positioning , Adjust revenue numbers to match your actual financial model",
          flag: "Founder Review",
          colorContext: "teal",
        },
        {
          id: "Q6",
          question:
            "What are your main business goals for this financial year?",
          answer:
            "Goal 1 , Revenue: Reach ₹75L–1.2 crore ARR by end of financial year. Requires 8–12 paid accounts at ₹8–12L ACV each, plus a long tail of 40–60 smaller accounts at ₹1–3L ACV.\n\nGoal 2 , Customer acquisition: Sign 50–75 paying companies. Priority segments: Tech/SaaS companies (25 accounts), Real Estate developers (15 accounts), Professional Services firms (15 accounts). At least 5 GCC accounts to validate international pricing.\n\nGoal 3 , Product milestone: Ship mobile app (iOS + Android) by Month 3 and live demo environment by Month 2. These are the two highest-priority deal blockers in current pipeline.\n\nGoal 4 , Market entry: Establish PTM brand in the 'data sovereign work management' category in India. Target: 3 published case studies with named customers, 1 speaking slot at a relevant industry event (NASSCOM Product Conclave, TechSparks, or equivalent), 500+ LinkedIn followers on PTM product page.\n\nGoal 5 , Team: Hire 1 dedicated sales person (SDR or AE with PM software experience) by Month 4. Hire 1 customer success manager by Month 6 to manage onboarding and reduce early churn.",
          source:
            "Output 6 , Current Pricing / Output 7 , Product Roadmap (0–3 months) , Adjust revenue numbers to your actual plan",
          flag: "Founder Review",
          colorContext: "red",
        },
        {
          id: "Q7",
          question:
            "Which customer segments or geographies will you focus on this year?",
          answer:
            "Segment 1 , Tech / SaaS companies, India metros (Bengaluru, Pune, Hyderabad, Mumbai), 50–300 employees:\nChosen because: highest urgency (Jira + Slack + Google Docs fragmentation is a daily pain they can articulate), fastest sales cycle (product-literate buyers self-evaluate quickly), and highest internal advocacy potential (engineering teams who adopt PTM drag the rest of the company in). Entry point: pitch to CTO or VP Engineering on the sovereignty + sprint consolidation story.\n\nSegment 2 , Professional Services (consulting, legal, audit), India metros + Dubai/Abu Dhabi, 20–150 professionals:\nChosen because: data sovereignty is a compliance obligation in this segment (DIFC-regulated entities in Dubai, SEBI-regulated advisors in India). High ACV (₹10–20L per account). MoM-to-task and document creation features are immediately compelling. Decision cycle is 4–8 weeks , manageable. Entry point: the 'your client data should not live on Google's servers' pitch to Managing Partner or Practice Head.\n\nSegment 3 , Locksted FM Matrix and Loyalty existing clients (cross-sell), all geographies:\nChosen because: zero CAC. Trust already established. PTM is a natural extension of the Locksted platform relationship. Positioning: 'You already use Locksted for FM and customer experience , now use it for the work management layer that connects your teams.' Fastest path to first 10–15 accounts with short sales cycles.",
          source:
            "Output 2 , Market Fit Analysis / Output 8 , Strategic Positioning",
          flag: "Ready",
          colorContext: "blue",
        },
        {
          id: "Q8",
          question:
            "What 3 key actions or projects will help achieve this year's goals?",
          answer:
            "Initiative 1 , Build a direct outbound sales motion targeting CTOs and VP Engineering at Tech/SaaS companies with 50–300 employees in Bengaluru, Pune, and Hyderabad.\nExecution: Founder-led for first 3 months. Build a list of 300 target companies from LinkedIn Sales Navigator. Outbound sequence: LinkedIn connection + personalised note on data sovereignty → 3-touch email sequence → phone call. Aim for 5 qualified demo calls per week. Message: 'your engineering team's sprint data, product roadmap, and client communications are on Atlassian's servers in the US , let's fix that.' Hire 1 SDR by Month 4 to take over outbound as founder moves to closing.\n\nInitiative 2 , Launch the 'Data Sovereign Work Management' category through a hosted roundtable series and LinkedIn content engine.\nExecution: Host 3 invite-only roundtables (40–60 attendees each) in Bengaluru, Mumbai, and Dubai on the topic of data sovereignty in enterprise tools. Position PTM as the convener, not the pitch. Follow up every attendee with a personalised case for PTM within 48 hours. Simultaneously, publish 2 pieces of long-form content per month on LinkedIn (Founder account + PTM company page) on topics: data localisation regulations, SaaS data risk, tool consolidation ROI. Goal: 10 inbound demo requests per month by Month 6.\n\nInitiative 3 , Execute a zero-CAC cross-sell campaign through Locksted's existing FM Matrix and Loyalty client base.\nExecution: Map all current Locksted clients with 50+ employees who do not yet use PTM. Build a personalised outreach sequence for each account manager relationship. Offer existing clients a 90-day free trial of PTM with dedicated onboarding. Target: 15 converted accounts from existing client base by Month 6. Case studies from these accounts become the proof-of-concept material for new segment outbound.",
          source:
            "Output 7 , Product Roadmap / Output 8 , GTM Recommendation , Confirm these initiatives match your team's actual resourcing",
          flag: "Founder Review",
          colorContext: "green",
        },
        {
          id: "Q9",
          question: "What are the key numbers or metrics to track regularly?",
          answer:
            "COMMERCIAL KPIs:\n1. Monthly Recurring Revenue (MRR) and MRR growth rate (%) month-on-month , primary health metric\n2. New logo count per month , number of new paying companies (not seats)\n3. Average Contract Value (ACV), target ₹8–12L for mid-market accounts; track separately for India vs GCC\n4. Sales cycle length , days from first demo to signed contract; target under 45 days for SMB, 60–90 for mid-market\n5. Customer Acquisition Cost (CAC) , total sales + marketing spend ÷ new logos. Target CAC payback under 12 months\n6. Net Revenue Retention (NRR) , if existing customers expand (add seats), NRR > 100% means growth even without new logos\n\nPRODUCT KPIs:\n1. Week-1 activation rate , % of new accounts that complete their first full project setup (project + milestone + 3 tasks + 1 MoM) within 7 days of signup. Target: 60%+\n2. Daily Active Users / Monthly Active Users (DAU/MAU ratio) , measures habit formation. Target: 40%+ ratio (40 daily users for every 100 monthly users)\n3. Feature adoption by module , % of accounts using each core module (kanban, MoM, wallet, docs). Flags which features drive retention vs which are underused\n4. Time-to-value , how many days from account creation to first completed milestone. Target: under 14 days\n5. Support ticket volume per account , leading indicator of onboarding friction or UX gaps. Spike = intervention needed\n6. NPS / CSAT , quarterly pulse. Target NPS 40+ in Year 1. Below 30 = product-market fit is not solid yet",
          source:
            "Output 2 , Buyer Priorities / Output 6 , Pricing & Market Metrics",
          flag: "Ready",
          colorContext: "teal",
        },
        {
          id: "Q10",
          question:
            "What improvements do you need in your people or processes to succeed?",
          answer:
            "Gap 1 , Mobile app engineering capability: We do not have a mobile app. Every deal involving field teams, real estate site managers, or CXOs who check status on their phones is currently at risk. We need to either hire 1–2 mobile engineers (React Native or Flutter) or engage a specialist mobile development partner in the next 60 days. This is the single highest-priority people/capability gap.\n\nGap 2 , Sales function (first hire): Currently running on founder-led sales, which caps how many deals can run in parallel. By Month 4, we need a first sales hire , ideally an SDR with SaaS PM software experience who can run outbound sequences and qualify inbound leads, freeing the founder for closing and strategy. Without this, growth above ₹50L ARR is bottlenecked.\n\nGap 3 , Customer success and onboarding: We have no formal onboarding process. Activation rates will suffer without a structured 30-day onboarding playbook and a dedicated person (even part-time initially) to walk new accounts through their first project, first MoM, and first MoM-to-task conversion. A single Customer Success hire by Month 6 can protect the first 50 accounts from churn.\n\nGap 4 , Integration engineering: The roadmap requires calendar integration (Month 1–3), GitHub/GitLab sync (Month 3–6), and HRMS connections (Month 6+). These are not trivial builds. We need a dedicated integrations engineer or a structured partnership with an SI who can build and maintain these integrations. Without integrations, enterprise accounts are out of reach.\n\nGap 5 , Brand and content function: Data sovereignty is a positioning story that needs to be told consistently , on LinkedIn, at events, in sales decks, in case studies. Currently there is no content or brand function. A part-time content marketer or a founder-facing ghostwriting arrangement is needed in Month 3–4 to maintain visibility.",
          source: "Output 5 , Feature Gaps / Output 8 , Winning Capabilities",
          flag: "Founder Review",
          colorContext: "red",
        },
      ],
      founderChecklist: [
        {
          id: "Q2",
          item: "Values",
          verify:
            "Claude has suggested 5 values based on product positioning and category research. Replace any that don't reflect your actual team culture. These are yours to own , not derived from market data.",
          status: "PENDING",
        },
        {
          id: "Q4",
          item: "BHAG (10–15 year goal)",
          verify:
            "The suggested BHAG is grounded in market trajectory and product vision. Adjust the ambition level, geography, or transformation statement to match your personal conviction. A BHAG you don't believe is useless in a planning session.",
          status: "PENDING",
        },
        {
          id: "Q5",
          item: "3–5 year targets",
          verify:
            "Revenue ranges and seat counts are benchmarked against realistic growth rates in this category. Adjust to match your actual financial model and fundraising assumptions.",
          status: "PENDING",
        },
        {
          id: "Q6",
          item: "This year's goals",
          verify:
            "Revenue targets and hiring timelines must be adjusted to match your actual financial plan, runway, and team capacity. These are suggested anchors, not commitments.",
          status: "PENDING",
        },
        {
          id: "Q8",
          item: "3 key initiatives",
          verify:
            "Confirm these three initiatives match what your team is actually resourced to execute this year. Initiative 1 (outbound sales) requires founder time. Initiative 2 (roundtables) requires budget and organising capacity. Initiative 3 (cross-sell) requires coordination with account management. Resource-check before committing.",
          status: "PENDING",
        },
        {
          id: "Q10",
          item: "People & process gaps",
          verify:
            "The 5 gaps identified are based on product roadmap requirements and common deal-loss patterns. Prioritise based on your current burn rate and hiring runway. Gap 1 (mobile) and Gap 2 (sales hire) are non-negotiable for Year 1 growth.",
          status: "PENDING",
        },
      ],
    },
    detailedGTM: {
      targetGroups: [
        {
          id: "TG1",
          name: "TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
          sections: [
            {
              title: "COMPONENT 1 , SALES MOTION | TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
              columns: ["Sales element", "Details"],
              rows: [
                {
                  label: "Primary sales motion",
                  detail: "Founder-led direct outbound for first 20 accounts. Transition to SDR + AE model at Month 4. Deal size (₹6–15L/year) justifies high-touch sales; product complexity (sovereignty story) requires a human in the room for the first call.",
                },
                {
                  label: "Avg. sales cycle",
                  detail: "4–8 weeks for SMB tech companies (50–150 employees). 8–14 weeks for mid-market (150–500 employees). Flag: this is longer than typical for a tool-level SaaS purchase , driven by IT approval for data migration and procurement sign-off. Pre-empt by engaging IT Head in Week 1, not Week 6.",
                },
                {
                  label: "Economic buyer (signs)",
                  detail: "CTO or VP Engineering for companies under 200 employees. COO or CFO for companies over 200 employees where the purchase spans multiple departments.",
                },
                {
                  label: "Champion (internal advocate)",
                  detail: "VP Engineering or Head of Product , they feel the Jira + Slack + Confluence fragmentation pain daily. Engineering managers who have been complaining about data security are natural champions.",
                },
                {
                  label: "Blocker to anticipate",
                  detail: "IT/Security Head who will demand a security audit and data flow documentation before approving any new platform. Pre-empt with a one-pager on PTM's data architecture and sovereignty compliance before the IT conversation begins.",
                  textColor: "#C62828",
                  bgColor: "#FFEBEE",
                },
                {
                  label: "What closes this TG",
                  detail: "A live demo showing the full project → sprint → MoM → task → documents → issues flow, followed by a 14-day sandbox trial where their actual team sets up one real project. Reference customer in a similar-stage tech company seals it. Sovereignty architecture documentation closes the IT objection.",
                  textColor: "#2E7D32",
                  bgColor: "#E8F5E9",
                },
              ],
            },
            {
              title: "COMPONENT 2 , MARKETING CHANNELS | TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
              columns: ["Channel", "Relevant?", "Execution approach", "Priority rank"],
              rows: [
                {
                  col1: "LinkedIn (organic + paid)",
                  col2: "Yes",
                  col3: "Organic: 2 posts/week from Founder account , topics: data sovereignty in SaaS, Jira alternatives, sprint productivity. Target personas: CTOs, VPs Engineering, Product Managers. Paid: LinkedIn Sponsored Content targeting 'Software Engineering' + 'Product Management' job titles at companies 50–500 employees in Bengaluru, Pune, Hyderabad. Budget: ₹50–80k/month. Start organic for 60 days, layer paid after first 3 case studies.",
                  col4: "#1 , Start immediately",
                },
                {
                  col1: "Cold outreach (email + LinkedIn DM)",
                  col2: "Yes",
                  col3: "Sequence: Day 1 , LinkedIn connection request with note referencing a specific pain ('noticed your team uses Jira + Confluence , have 10 min to show you something interesting?'). Day 4 , email with 1-line data sovereignty hook + 30-second Loom video of PTM sprint view. Day 8 , follow-up with a relevant case study or stat. Day 14 , final breakup email. Best day/time: Tuesday–Thursday, 9–11am IST. List size target: 50 personalised outreaches per week.",
                  col4: "#1 , Start immediately",
                },
                {
                  col1: "Events & conferences",
                  col2: "Yes",
                  col3: "India: NASSCOM Product Conclave (Bengaluru, annual), TechSparks by YourStory (Bengaluru), SaaS Insider events. Host a 40-person invite-only roundtable: 'Data sovereignty in the SaaS stack , what engineering leaders need to know.' GCC: GITEX Technology Week (Dubai, October) for enterprise tech audience.",
                  col4: "#2 , Month 2 onward",
                },
                {
                  col1: "SEO & content marketing",
                  col2: "Yes",
                  col3: "Top 3 search topics this TG looks for: 'Jira alternatives India', 'best project management software for startups', 'data localisation SaaS India'. Content format: long-form blog posts (2,000+ words) targeting comparison keywords. Timeline: 90+ days to see SEO results , start now but don't count on it for Month 1.",
                  col4: "#3 , Medium-term",
                },
                {
                  col1: "Referral & word of mouth",
                  col2: "Yes",
                  col3: "Trigger: when a team completes their first sprint fully in PTM and reports velocity improvement. Engineer the referral: at Day 30 check-in, ask satisfied users to intro PTM to 1 peer at another company. Offer: free 30-day seat extension for each successful referral that converts to a trial.",
                  col4: "#2 , Month 2",
                },
                {
                  col1: "Community & associations",
                  col2: "Yes",
                  col3: "LinkedIn groups: SaaS India, Product Management India. Slack communities: SaaSBoomi, The Hustle (India SaaS community), Product Folks. YourStory and Inc42 founder communities. Engage authentically , answer questions about PM tools, sovereignty, sprint management , don't pitch directly.",
                  col4: "#3 , Medium-term",
                },
              ],
            },
            {
              title: "COMPONENT 3 , 90-DAY LAUNCH SEQUENCE | TG 1: Tech / SaaS Companies",
              columns: ["Phase", "Goals & Actions", "Milestone / Risk"],
              rows: [
                {
                  col1: "Days 1–30 Foundation",
                  col2: "Build 300-company target list. Launch 50 personalised outreaches/week. Create 5-min demo video.",
                  col3: "Milestone: 5 qualified demo calls booked. Risk: generic messaging (needs 10 min research/lead).",
                },
                {
                  col1: "Days 31–60 Traction",
                  col2: "Run 5+ live demos. Setup pre-loaded sandbox trials. Proactively engage IT Heads on data architecture.",
                  col3: "Milestone: 3 active trials running. Risk: trial inactivity (needs Day 2 check-in).",
                },
                {
                  col1: "Days 61–90 Conversion",
                  col2: "Week 9 usage review (show ROI). Present cost saving vs MS 365/Asana. Request peer references.",
                  col3: "Milestone: 2 signed contracts + 1 case study. Risk: procurement delays (offer early-pay discount).",
                },
              ],
            },
            {
              title: "COMPONENT 4 , PARTNERSHIP & RESELLER STRATEGY | TG 1: Tech / SaaS Companies",
              columns: ["Partnership element", "Details"],
              rows: [
                {
                  label: "Timing for partnerships",
                  detail: "Yes , but only after first 10 direct customers. Build direct sales motion first.",
                },
                {
                  label: "Partner type 1",
                  detail: "Indian SaaS consultants / implementation partners. Referral commission on Year 1 ARR.",
                },
              ],
            },
          ],
          summaryBox:
            "Founder-led direct outbound → SDR + AE by Month 4. LinkedIn organic + personalised cold outreach. 5 demo calls → 3 trials → 2 signed contracts + 1 case study. Indian SaaS consultants (referral-only). CTO / VP Engineering (50–200 employees) | COO / CFO (200+ employees).",
        },
        {
          id: "TG2",
          name: "TG 2: Professional Services, Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
          sections: [
            {
              title: "COMPONENT 1 , SALES MOTION | TG 2: Professional Services",
              columns: ["Sales element", "Details"],
              rows: [
                {
                  label: "Primary sales motion",
                  detail: "Founder-led direct + field sales. This TG buys on relationships. Lunch meeting with MP is worth more than 20 cold emails.",
                },
                {
                  label: "Avg. sales cycle",
                  detail: "6–10 weeks. Requires partner approval and compliance review. GCC legal audit adds 3–4 weeks.",
                },
                {
                  label: "Economic buyer",
                  detail: "Managing Partner (small firms) or COO / Practice Head (larger firms). GCC: GM or Regional Director.",
                },
                {
                  label: "Champion",
                  detail: "Senior Manager or Associate Director managing client delivery. They feel the MoM pain.",
                },
                {
                  label: "Blocker to anticipate",
                  detail: "Legal/compliance partner asking 'where does client data go?'. Our 'your servers' answer closes it.",
                  textColor: "#C62828",
                  bgColor: "#FFEBEE",
                },
                {
                  label: "What closes this TG",
                  detail: "Demo of MoM-to-task + data sovereignty explanation. Reference from similarly regulated firm.",
                  textColor: "#2E7D32",
                  bgColor: "#E8F5E9",
                },
              ],
            },
            {
              title: "COMPONENT 2 , MARKETING CHANNELS | TG 2: Professional Services",
              columns: ["Channel", "Relevant?", "Execution approach", "Priority rank"],
              rows: [
                {
                  col1: "LinkedIn (organic + paid)",
                  col2: "Yes",
                  col3: "Content targeting Practice Heads: client data security, billable hour optimisation, DIFC/SEBI compliance.",
                  col4: "#1 , High priority",
                },
                {
                  col1: "Cold outreach",
                  col2: "Yes",
                  col3: "Hook: 'Your client contracts live on Google's servers. Here's an alternative.' Personalise Heavily.",
                  col4: "#1 , High priority",
                },
                {
                  col1: "Events & conferences",
                  col2: "Yes",
                  col3: "FICCI/CII/DIFC events. Host breakfast roundtables: 'confidentiality in a SaaS world'.",
                  col4: "#2 , Month 2 onward",
                },
              ],
            },
            {
              title: "COMPONENT 3 , 90-DAY LAUNCH SEQUENCE | TG 2: Professional Services",
              columns: ["Phase", "Goals & Actions", "Milestone / Risk"],
              rows: [
                {
                  col1: "Days 1–30 Foundation",
                  col2: "Map 50 target firms. Request warm intros from Lockated network. Draft PS-specific sovereignty PDF.",
                  col3: "Milestone: 3 qualified meetings. Risk: warm intros lag (need cold parallel).",
                },
                {
                  col1: "Days 31–60 Traction",
                  col2: "Run 3+ demos. Set up pilot on LIVE client project. Send DIFC-specific compliance brief.",
                  col3: "Milestone: 2 paid pilots. Risk: low activation (must bind to specific MoM).",
                },
                {
                  col1: "Days 61–90 Conversion",
                  col2: "Present pilot data (time saved). Show ROI on billing rate vs cost. Request case study.",
                  col3: "Milestone: 2 signed contracts. Risk: partnership approval cycle.",
                },
              ],
            },
            {
              title: "COMPONENT 4 , PARTNERSHIP & RESELLER STRATEGY | TG 2: Professional Services",
              columns: ["Partnership element", "Details"],
              rows: [
                {
                  label: "GCC Partners",
                  detail: "GCC RegTech vendors (co-marketing). Relationship based.",
                },
                {
                  label: "Boutique consultants",
                  detail: "Ex-Big4 boutique consultants (referral). High trust networks.",
                },
              ],
            },
          ],
          summaryBox:
            "Founder-led field sales + warm introductions. LinkedIn organic (compliance + data security content) + hosted roundtables. 3 warm meetings → 2 paid pilots → 2 signed contracts + 1 case study. Ex-Big4 boutique consultants. Managing Partner (small firms) | COO / Practice Head (large firms).",
        },
      ],
      sheet: {
        title: "Project & Task Manager , Go-To-Market Strategy",
        targetGroups: [
          {
            title:
              "TARGET GROUP 1 , Tech / SaaS Companies (50–300 employees, India metros)",
            sections: [
              {
                title:
                  "Profile: Company size: 50–300 employees · Industry: Technology, SaaS, Product companies · Geography: Bengaluru, Pune, Hyderabad, Mumbai (India primary); Dubai, Abu Dhabi (GCC secondary) · Buyer: CTO / VP Engineering / COO · Budget: ₹6–18L/year · Current stack: Jira + Slack + Confluence + Google Workspace",
                columns: [],
                rows: [],
              },
              {
                title:
                  "COMPONENT 1 , SALES MOTION | TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
                columns: ["Sales element", "Details"],
                rows: [
                  [
                    "Primary sales motion",
                    "Founder-led direct outbound for first 20 accounts. Transition to SDR + AE model at Month 4. Deal size (₹6–15L/year) justifies high-touch sales; product complexity (sovereignty story) requires a human in the room for the first call.",
                  ],
                  [
                    "Avg. sales cycle",
                    "4–8 weeks for SMB tech companies (50–150 employees). 8–14 weeks for mid-market (150–500 employees). Flag: this is longer than typical for a tool-level SaaS purchase , driven by IT approval for data migration and procurement sign-off. Pre-empt by engaging IT Head in Week 1, not Week 6.",
                  ],
                  [
                    "Economic buyer (signs)",
                    "CTO or VP Engineering for companies under 200 employees. COO or CFO for companies over 200 employees where the purchase spans multiple departments.",
                  ],
                  [
                    "Champion (internal advocate)",
                    "VP Engineering or Head of Product , they feel the Jira + Slack + Confluence fragmentation pain daily. Engineering managers who have been complaining about data security are natural champions.",
                  ],
                  [
                    "Blocker to anticipate",
                    "IT/Security Head who will demand a security audit and data flow documentation before approving any new platform. Pre-empt with a one-pager on PTM's data architecture and sovereignty compliance before the IT conversation begins.",
                  ],
                  [
                    "What closes this TG",
                    "A live demo showing the full project → sprint → MoM → task → documents → issues flow, followed by a 14-day sandbox trial where their actual team sets up one real project. Reference customer in a similar-stage tech company seals it. Sovereignty architecture documentation closes the IT objection.",
                  ],
                ],
              },
              {
                title:
                  "COMPONENT 2 , MARKETING CHANNELS | TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
                columns: [
                  "Channel",
                  "Relevant?",
                  "Execution approach",
                  "Priority rank",
                ],
                rows: [
                  [
                    "LinkedIn (organic + paid)",
                    "Yes",
                    "Organic: 2 posts/week from Founder account , topics: data sovereignty in SaaS, Jira alternatives, sprint productivity. Target personas: CTOs, VPs Engineering, Product Managers. Paid: LinkedIn Sponsored Content targeting 'Software Engineering' + 'Product Management' job titles at companies 50–500 employees in Bengaluru, Pune, Hyderabad. Budget: ₹50–80k/month. Start organic for 60 days, layer paid after first 3 case studies.",
                    "#1 , Start immediately",
                  ],
                  [
                    "Cold outreach (email + LinkedIn DM)",
                    "Yes",
                    "Sequence: Day 1 , LinkedIn connection request with note referencing a specific pain ('noticed your team uses Jira + Confluence , have 10 min to show you something interesting?'). Day 4 , email with 1-line data sovereignty hook + 30-second Loom video of PTM sprint view. Day 8 , follow-up with a relevant case study or stat. Day 14 , final breakup email. Best day/time: Tuesday–Thursday, 9–11am IST. List size target: 50 personalised outreaches per week.",
                    "#1 , Start immediately",
                  ],
                  [
                    "Events & conferences",
                    "Yes",
                    "India: NASSCOM Product Conclave (Bengaluru, annual), TechSparks by YourStory (Bengaluru), SaaS Insider events. Host a 40-person invite-only roundtable: 'Data sovereignty in the SaaS stack , what engineering leaders need to know.' GCC: GITEX Technology Week (Dubai, October) for enterprise tech audience.",
                    "#2 , Month 2 onward",
                  ],
                  [
                    "SEO & content marketing",
                    "Yes",
                    "Top 3 search topics this TG looks for: 'Jira alternatives India', 'best project management software for startups', 'data localisation SaaS India'. Content format: long-form blog posts (2,000+ words) targeting comparison keywords. Timeline: 90+ days to see SEO results , start now but don't count on it for Month 1.",
                    "#3 , Medium-term",
                  ],
                  [
                    "Referral & word of mouth",
                    "Yes",
                    "Trigger: when a team completes their first sprint fully in PTM and reports velocity improvement. Engineer the referral: at Day 30 check-in, ask satisfied users to intro PTM to 1 peer at another company. Offer: free 30-day seat extension for each successful referral that converts to a trial.",
                    "#2 , Month 2",
                  ],
                  [
                    "Community & associations",
                    "Yes",
                    "LinkedIn groups: SaaS India, Product Management India. Slack communities: SaaSBoomi, The Hustle (India SaaS community), Product Folks, YourStory and Inc42 founder communities. Engage authentically , answer questions about PM tools, sovereignty, sprint management , don't pitch directly.",
                    "#3 , Medium-term",
                  ],
                ],
              },
              {
                title:
                  "COMPONENT 3 , 90-DAY LAUNCH SEQUENCE | TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
                columns: [],
                rows: [],
              },
              {
                title:
                  "DAYS 1–30 , FOUNDATION: Get first 5 qualified conversations with CTOs/VPs Engineering",
                columns: ["", "", ""],
                rows: [
                  [
                    "Goal",
                    "Get 5 qualified demo calls booked with CTOs or VP Engineering at tech companies with 50–300 employees in Bengaluru/Pune/Hyderabad.",
                    "",
                  ],
                  [
                    "Action 1: Build a 300-company target list from LinkedIn Sales Navigator",
                    "Owner: Founder",
                    "Output: Segmented list: company size 50–300, tech/SaaS industry, Bengaluru/Pune/Hyderabad HQ. 300 names with decision-maker contacts.",
                  ],
                  [
                    "Action 2: Launch 50 personalised outreach sequences per week (LinkedIn + email)",
                    "Owner: Founder",
                    "Output: 5% response rate target = 15 replies per week. 3 qualified demo calls from first 300 outreaches.",
                  ],
                  [
                    "Action 3: Create a 5-minute sovereignty demo video + 1-page architecture doc",
                    "Owner: Founder + Product",
                    "Output: A self-serve asset that qualifies leads before the live demo , reduces time spent on non-ICP prospects.",
                  ],
                  [
                    "Key milestone",
                    "5 qualified demo calls booked with ICP tech companies.",
                    "",
                  ],
                  [
                    "Biggest risk",
                    "Outreach personalisation falls flat , generic 'we replace Jira' messaging gets ignored. Pre-empt: invest 10 minutes in researching each company before outreach. Reference their actual tech stack, team size, or a recent engineering blog post.",
                    "",
                  ],
                ],
              },
              {
                title:
                  "DAYS 31–60 , TRACTION: Convert conversations to demos and trials",
                columns: ["", "", ""],
                rows: [
                  [
                    "Goal",
                    "Run 5+ live demos, convert minimum 3 to 14-day sandbox trials with their actual team.",
                    "",
                  ],
                  [
                    "Action 1: Run live demo: project → sprint → MoM → task → documents → issues flow in 30 minutes",
                    "Owner: Founder",
                    "Output: Demo-to-trial conversion target: 60%. Each demo ends with a specific next step , not 'let us know', but 'let's set up your trial environment on Thursday'.",
                  ],
                  [
                    "Action 2: Set up personalised trial environments pre-loaded with their team structure",
                    "Owner: Product",
                    "Output: Sandbox that mirrors their actual project structure reduces time-to-value from 7 days to 2 days.",
                  ],
                  [
                    "Action 3: Engage IT Head at each trial account with architecture documentation",
                    "Owner: Founder",
                    "Output: IT objection handled proactively , sovereignty architecture doc + security Q&A pre-sent. Removes the 6-week IT review delay.",
                  ],
                  [
                    "Key milestone",
                    "3 active 14-day trials running with real teams at tech companies.",
                    "",
                  ],
                  [
                    "Biggest risk",
                    "Trial accounts go quiet after Day 3 because onboarding is self-serve. Pre-empt: assign a dedicated 30-minute onboarding call per account within 48 hours of trial start. Identify 1 champion per account who owns the trial internally.",
                    "",
                  ],
                ],
              },
              {
                title:
                  "DAYS 61–90 , CONVERSION: Close first paying customer or committed pilot",
                columns: ["", "", ""],
                rows: [
                  [
                    "Goal",
                    "Sign first 2–3 paying tech company accounts. Minimum: 1 signed contract + 1 committed pilot with a start date.",
                    "",
                  ],
                  [
                    "Action 1: Week 9 check-in call: review trial usage data, surface wins and friction points",
                    "Owner: Founder + CS",
                    "Output: Data-driven closing conversation , show them their own usage metrics (tasks created, MoMs converted, MoM-to-task conversions and issue closures). Make the ROI tangible.",
                  ],
                  [
                    "Action 2: Present a custom ROI summary: tool consolidation savings + sovereignty compliance value",
                    "Owner: Founder",
                    "Output: Quantify: X seats × ₹750/month MS 365 savings + Jira/Confluence licence offset + 0 SaaS data risk = ₹Y saved. Make the number specific to their company.",
                  ],
                  [
                    "Action 3: Request a reference introduction: 'Who else in your network has this problem?'",
                    "Owner: Founder",
                    "Output: Every signed account should generate 1–2 warm intros to peer companies. This becomes the referral engine for Month 4+.",
                  ],
                  [
                    "Key milestone",
                    "2 signed contracts from tech companies. 1 published case study (anonymised or named).",
                    "",
                  ],
                  [
                    "Biggest risk",
                    "Procurement delays the signed contract even after verbal commitment. Pre-empt: get a PO number or payment intent confirmed in the closing call. Offer an early payment discount (1 free month on annual) to accelerate the paper process.",
                    "",
                  ],
                ],
              },
              {
                title:
                  "COMPONENT 4 , PARTNERSHIP & RESELLER STRATEGY | TG 1: Tech / SaaS Companies (50–300 employees, India metros)",
                columns: ["Partnership element", "Details"],
                rows: [
                  [
                    "Timing for partnerships",
                    "Yes , but only after first 10 direct customers. Build direct sales motion first to understand the buyer deeply before training partners to sell it.",
                  ],
                  [
                    "Partner type 1: Indian SaaS consultants / implementation partners",
                    "Who: boutique IT consulting firms that help tech companies set up their SaaS stack (Notion consultants, Atlassian partners, productivity consultants). Why they have access: they are already in procurement conversations about PM tools. What we offer: 20% referral commission on Year 1 ARR + co-marketing. India profile: SaaS implementation firms in Bengaluru (example: productivity-focused boutiques in Koramangala). Red flag to avoid: large SIs who will over-promise and under-deliver for a ₹8L deal.",
                  ],
                  [
                    "Partner type 2: Talent platforms & HRMS vendors (cross-sell)",
                    "Who: Darwinbox, Keka, or GreytHR , once PTM has HRMS integration built (Month 6+), these platforms have direct access to the same HR and IT heads we target. What we offer: joint webinars, co-marketing content, integration badge on their marketplace. What they offer: reach into their client base without a cold outreach. Red flag: do not position PTM as an HRMS replacement , we complement them.",
                  ],
                  [
                    "Year 1 partnership structure",
                    "Referral-only for Year 1. No reseller margin, no white-label. A referred deal that closes earns the partner 20% of Year 1 ARR, paid 30 days after client payment clears. Reason: at our current stage, reseller complexity (training, support, margin management) will slow us down more than the incremental deals are worth. Direct sales builds the muscle first.",
                  ],
                ],
              },
              {
                title:
                  "◆ TG 1 ONE-PAGE SUMMARY , Tech / SaaS Companies (50–300 employees, India metros)",
                columns: ["Element", "Answer", "Element", "Answer"],
                rows: [
                  [
                    "Best sales motion",
                    "Founder-led direct outbound (Month 1–4) → SDR + AE by Month 4",
                    "Single most important Week 1 action",
                    "Build 300-company target list + send first 50 personalised outreach sequences",
                  ],
                  [
                    "Top 2 marketing channels",
                    "LinkedIn organic (founder content) + personalised cold outreach",
                    "Biggest risk to watch",
                    "IT security review delays , engage IT Head in Week 1, not Week 6",
                  ],
                  [
                    "90-day goal",
                    "5 demo calls → 3 trials → 2 signed contracts + 1 case study",
                    "What closes this TG",
                    "14-day sandbox trial + sovereignty architecture doc + peer reference customer",
                  ],
                  [
                    "Key partner type",
                    "Indian SaaS consultants (referral-only, post 10 direct customers)",
                    "Primary buyer",
                    "CTO / VP Engineering (50–200 employees) | COO / CFO (200+ employees)",
                  ],
                ],
              },
            ],
            summary:
              "Founder-led direct outbound → SDR + AE by Month 4. LinkedIn organic + personalised cold outreach. 5 demo calls → 3 trials → 2 signed contracts + 1 case study. Indian SaaS consultants (referral-only). CTO / VP Engineering (50–200) | COO / CFO (200+).",
          },
          {
            title:
              "TARGET GROUP 2 , Professional Services , Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
            sections: [
              {
                title:
                  "Profile: Company size: 20–200 professionals · Industry: Management consulting, legal, audit · Geography: Mumbai, Delhi, Bengaluru (India); Dubai (GCC), Abu Dhabi (GCC) · Buyer: Managing Partner / COO / Practice Head · Budget: ₹4–12L/year",
                columns: [],
                rows: [],
              },
              {
                title:
                  "COMPONENT 1 , SALES MOTION | TG 2: Professional Services , Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
                columns: ["Sales element", "Details"],
                rows: [
                  [
                    "Primary sales motion",
                    "Founder-led direct + field sales (in-person meetings). This TG buys on relationships and trust , not self-serve trials. A lunch meeting with a Managing Partner is worth more than 20 cold emails. Average deal size (₹10–20L) justifies in-person investment.",
                  ],
                  [
                    "Avg. sales cycle",
                    "6–10 weeks. Slower than tech , requires partner approval and often a legal/compliance review of the data architecture. Flag: in DIFC-regulated Dubai entities, legal team review can add 3–4 weeks. Engage the compliance team in Week 2.",
                  ],
                  [
                    "Economic buyer (signs)",
                    "Managing Partner (small firms) or COO / Practice Head (larger firms). In GCC: General Manager or Regional Director with P&L authority.",
                  ],
                  [
                    "Champion (internal advocate)",
                    "Senior Manager or Associate Director who manages client project delivery , they feel the MoM + task tracking pain daily. Engineering managers who have been complaining about data security are natural champions. They will champion PTM internally once they see the MoM-to-task demo.",
                  ],
                  [
                    "Blocker to anticipate",
                    "Legal/compliance partner who will ask: 'Where does our client data go?' This is our strongest moment , the answer ('your servers, not ours') closes the objection immediately. Pre-arm the champion with a one-pager on data sovereignty before the compliance conversation.",
                  ],
                  [
                    "What closes this TG",
                    "A single compelling demo of MoM-to-task auto-conversion + document creation with data sovereignty explanation. Followed by a reference from a similarly regulated firm (or a DIFC/SEBI compliance note). This TG buys on 'I trust this is safe and it solves my meeting-to-action problem.'",
                  ],
                ],
              },
              {
                title:
                  "COMPONENT 2 , MARKETING CHANNELS | TG 2: Professional Services , Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
                columns: [
                  "Channel",
                  "Relevant?",
                  "Execution approach",
                  "Priority rank",
                ],
                rows: [
                  [
                    "LinkedIn (organic + paid)",
                    "Yes",
                    "Organic: content targeting Practice Heads and Managing Partners , topics: client data security, meeting productivity, billable hour optimisation, DIFC/SEBI compliance for SaaS. Paid: LinkedIn targeting 'Management Consulting', 'Legal Services', 'Audit' industries + 'Managing Partner', 'Practice Head' titles. Mumbai, Delhi, Dubai, Abu Dhabi. Budget: ₹40–60k/month.",
                    "#1 , High priority",
                  ],
                  [
                    "Cold outreach (email + LinkedIn DM)",
                    "Yes",
                    "Hook: 'Your client contracts and project plans live on Google's servers in Singapore. Here's an alternative.' 5-touch sequence over 21 days. Best timing: Monday–Wednesday, 8–10am IST / GST. Personalise heavily , reference their practice area, recent client industry (from LinkedIn/website).",
                    "#1 , High priority",
                  ],
                  [
                    "Events & conferences",
                    "Yes",
                    "India: FICCI conferences, CII conferences, Big4 alumni roundtables, Bar Council events for legal firms. GCC: DIFC events, LEAP (Riyadh), Arabian Business Summit (Dubai). Recommended: Host a breakfast roundtable , 'Protecting client confidentiality in a SaaS world' , 20 invitees, a thought leadership talk, and then PTM demo. Strong conversion environment.",
                    "#2 , Start Month 2",
                  ],
                  [
                    "SEO & content marketing",
                    "Yes",
                    "Top 3 search topics this TG looks for: 'client data security project management', 'DIFC compliance software', 'data localisation consulting firms India'. Long-form content: 'How consulting firms are violating client confidentiality without knowing it' (pillar article). Case study format works best for this TG , they trust peers.",
                    "#3 , Medium-term",
                  ],
                  [
                    "Referral & word of mouth",
                    "Yes",
                    "This TG's referral network is tight , a Managing Partner's recommendation to a peer carries 10x the weight of any ad. Engineer it: at Month 2, ask your first consulting client to make 2 warm introductions over coffee. Offer a joint webinar co-branded with them.",
                    "#2 , Very high value when triggered",
                  ],
                  [
                    "Community & associations",
                    "Yes",
                    "India: ICAI (chartered accountants), IBA India (legal), MCA alumni networks, NASSCOM for consulting. GCC: DIFC Authority events, UAE Chartered Accountants group, ACCA Middle East. WhatsApp groups: boutique consulting firm founder networks in Mumbai/Delhi.",
                    "#3 , Medium-term",
                  ],
                ],
              },
              {
                title:
                  "COMPONENT 3 , 90-DAY LAUNCH SEQUENCE | TG 2: Professional Services , Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
                columns: [],
                rows: [],
              },
              {
                title:
                  "DAYS 1–30 , FOUNDATION: Map the segment and get first 3 warm conversations",
                columns: ["", "", ""],
                rows: [
                  [
                    "Goal",
                    "Get 3 qualified conversations with Managing Partners or Practice Heads at professional services firms through warm introductions.",
                    "",
                  ],
                  [
                    "Action 1: Map target firms: 50 consulting/legal/audit firms in Mumbai, Delhi, Dubai , identify 1 contact per firm",
                    "Owner: Founder",
                    "Output: Prioritised hit list of 50 firms with decision-maker LinkedIn profiles and email addresses.",
                  ],
                  [
                    "Action 2: Request warm introductions from Lockated's existing network (investors, advisors, existing clients)",
                    "Owner: Founder",
                    "Output: 5 warm intros from existing network. Warm intro → meeting conversion rate is 40–60% vs 3–5% for cold.",
                  ],
                  [
                    "Action 3: Draft a sovereign data one-pager specifically for professional services: 'Where does your client data live?'",
                    "Owner: Founder + Marketing",
                    "Output: A 1-page PDF that the champion can forward to their compliance partner before the meeting.",
                  ],
                  [
                    "Key milestone",
                    "3 qualified meetings booked with Managing Partners or Practice Heads.",
                    "",
                  ],
                  [
                    "Biggest risk",
                    "Warm intros don't materialise quickly enough. Pre-empt: run cold outreach in parallel , 30 personalised emails per week with the hook 'your client data is on Google's servers.'",
                    "",
                  ],
                ],
              },
              {
                title: "DAYS 31–60 , TRACTION: Demo and build trust",
                columns: ["", "", ""],
                rows: [
                  [
                    "Goal",
                    "Run 3+ demos. Convert minimum 2 to paid pilots or extended trials. At least 1 GCC (Dubai/Abu Dhabi) account in conversation.",
                    "",
                  ],
                  [
                    "Action 1: In-person demo: MoM-to-task flow + document creation + sovereignty walkthrough , 45 minutes max",
                    "Owner: Founder",
                    "Output: Demo conversion target: 70%. End with: 'Which upcoming client project can we set up in PTM this week?'",
                  ],
                  [
                    "Action 2: Set up a pilot for 1 practice team on a live client project (not internal admin , real work)",
                    "Owner: Founder + Product",
                    "Output: Real-work pilot creates stickiness that an internal demo never achieves. The team using it for a live project won't want to switch back.",
                  ],
                  [
                    "Action 3: Send a DIFC/SEBI compliance brief to all GCC prospects covering PTM's data architecture",
                    "Owner: Founder",
                    "Output: Pre-removes the legal/compliance objection in GCC accounts , saves 3 weeks of review time.",
                  ],
                  [
                    "Key milestone",
                    "2 paid pilots underway. At least 1 demo with a GCC-based professional services firm.",
                    "",
                  ],
                  [
                    "Biggest risk",
                    "Pilots run but no one uses them because 'we're busy with client work.' Pre-empt: set up the pilot around one specific MoM they have scheduled. Low activation = low conversion.",
                    "",
                  ],
                ],
              },
              {
                title:
                  "DAYS 61–90 , CONVERSION: First signed contracts and case study",
                columns: ["", "", ""],
                rows: [
                  [
                    "Goal",
                    "Sign 2 paying accounts. Get permission to write 1 anonymised case study on efficiency gains from MoM-to-task.",
                    "",
                  ],
                  [
                    "Action 1: Pilot review: show them their own data , MoMs created, tasks auto-converted, docs created",
                    "Owner: Founder + CS",
                    "Output: Present: 'In 30 days, your team auto-converted X meeting action points into tasks. Here's how many were completed on time vs your old process.'",
                  ],
                  [
                    "Action 2: ROI presentation: time saved on MoM creation + document creation cost offset vs Google Workspace",
                    "Owner: Founder",
                    "Output: Quantified: X hours/week saved on MoM × ₹Y hourly billing rate = ₹Z/month saved. Plus ₹750/user MS 365 offset. Make the ROI tangible.",
                  ],
                  [
                    "Action 3: Request anonymised case study permission + 1 warm introduction to a peer firm",
                    "Owner: Founder",
                    "Output: 1 case study + 1 referral. This is the compound interest of professional services sales.",
                  ],
                  [
                    "Key milestone",
                    "2 signed contracts. 1 anonymised case study. 1 warm referral to a peer firm.",
                    "",
                  ],
                  [
                    "Biggest risk",
                    "Contract negotiation drags on because procurement is slow in professional services. Pre-empt: offer a 'start now, invoice in 30 days' arrangement for first 3 clients to bypass the procurement delay.",
                    "",
                  ],
                ],
              },
              {
                title:
                  "COMPONENT 4 , PARTNERSHIP & RESELLER STRATEGY | TG 2: Professional Services , Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
                columns: ["Partnership element", "Details"],
                rows: [
                  [
                    "Timing for partnerships",
                    "Yes , after 5 direct customers. Professional services referral networks are high-trust; a premature partnership with the wrong firm can damage brand credibility more than no partnership.",
                  ],
                  [
                    "Partner type 1: Big4 and mid-tier consulting alumni networks",
                    "Who: Former Big4 (Deloitte, EY, KPMG, PwC) partners who have set up boutique consulting or advisory practices. Why they have access: direct relationships with the exact buyers we target (Managing Partners at peer firms). What we offer: 20% referral fee on Year 1 ARR + 'recommended by' co-branding. India profile: boutique strategy consulting firms run by ex-Big4 partners in Mumbai/Delhi. GCC profile: former Big4 Gulf partners who have set up independent advisory practices in DIFC.",
                  ],
                  [
                    "Partner type 2: Legal tech / RegTech vendors (GCC)",
                    "Who: Vendors selling DIFC/PDPL compliance tools to professional services firms , they are calling the same CIO and compliance heads we need to reach. What we offer: joint co-marketing content on data sovereignty + referral agreement. What they offer: warm access to compliance-minded buyers who have already acknowledged the data risk problem. GCC profile: RegTech firms operating in DIFC or ADGM (Abu Dhabi Global Market).",
                  ],
                  [
                    "Year 1 partnership structure",
                    "Referral-only. 20% of Year 1 ARR paid to referring partner within 30 days of client payment. No white-label, no reseller complexity. Keep it clean and fast.",
                  ],
                ],
              },
              {
                title:
                  "◆ TG 2 ONE-PAGE SUMMARY , Professional Services , Consulting, Legal, Audit (20–200 professionals, India metros + GCC)",
                columns: ["Element", "Answer", "Element", "Answer"],
                rows: [
                  [
                    "Best sales motion",
                    "Founder-led field sales + warm introductions (relationship-first)",
                    "Single most important Week 1 action",
                    "Map 50 target firms + request 5 warm intros from existing Lockated network",
                  ],
                  [
                    "Top 2 marketing channels",
                    "LinkedIn organic (compliance + data security content) + hosted roundtables",
                    "Biggest risk to watch",
                    "Compliance review delays , arm champion with sovereignty one-pager before internal review",
                  ],
                  [
                    "90-day goal",
                    "3 warm meetings → 2 paid pilots → 2 signed contracts + 1 case study",
                    "What closes this TG",
                    "In-person demo + real-work pilot + DIFC/SEBI compliance documentation",
                  ],
                  [
                    "Key partner type",
                    "Ex-Big4 boutique consultants (referral) + GCC RegTech vendors (co-marketing)",
                    "Primary buyer",
                    "Managing Partner (small firms) | COO / Practice Head (large firms)",
                  ],
                ],
              },
            ],
            summary:
              "Founder-led field sales + warm introductions. LinkedIn organic + hosted roundtables. 3 warm meetings → 2 paid pilots → 2 signed contracts + 1 case study. Ex-Big4 boutique consultants + GCC RegTech vendors. Managing Partner (small firms) | COO / Practice Head (large firms).",
          },
        ],
      },
    },
    detailedMetrics: {
      northStarMetric: {
        title: "Weekly Active Teams",
        definition: "Number of companies (teams) that have at least 3 active users who created or updated a task, MoM, or document in the past 7 days. This metric captures genuine habitual usage , not just accounts created. A team that uses PTM every week has embedded it into their workflow. A team that logs in once a month has not. Everything else follows from this: revenue, retention, referrals, and NPS all correlate with weekly active team count.",
        whyItIsNorthStar: "Weekly active teams predict MRR growth (teams that are active expand seats). They predict NPS (teams that use PTM weekly are the ones who recommend it). They predict churn prevention (teams that go quiet for 2+ weeks are at-risk accounts to intervene on). A stagnant Weekly Active Teams count , even with rising new signups , is an early warning of a product-market fit problem."
      },
      clientImpact: [
        {
          metric: "Sprint Velocity Improvement",
          baseline:
            "% increase in story points or tasks completed per sprint cycle after adopting PTM vs baseline",
          withSnag: "15–30% increase",
          claim:
            "Engineering teams using PTM completed 22% more sprint tasks in the first quarter vs their Jira baseline.",
        },
        {
          metric: "MoM Action Completion Rate",
          baseline:
            "% of action items raised in meetings that are formally completed and closed within their due date",
          withSnag: "2x–4x improvement (from ~30% to 70–90%)",
          claim:
            "After using PTM's MoM module, action item follow-through improved from 28% to 87% within 60 days.",
        },
        {
          metric: "SaaS Subscription Cost Reduction",
          baseline:
            "Annual ₹ or $ savings achieved by consolidating fragmented SaaS tools into PTM",
          withSnag: "₹750–1,200/user/month saved (₹9,000–14,400/user/year)",
          claim:
            "A 120-person consulting firm saved ₹1.8 crore/year by replacing MS 365, Asana, and their notes tool with PTM, with all documents on their own servers.",
        },
        {
          metric: "Client Issue Resolution Speed",
          baseline:
            "Average time (days) from client issue being raised to formal resolution in the Issues Register",
          withSnag:
            "30–50% reduction in resolution time (10–15 days → 5–8 days)",
          claim:
            "Client-raised issues resolved 42% faster at PTM client companies, with a full audit trail and zero issues lost in email.",
        },
        {
          metric: "Employee Daily Tool Switching Reduction",
          baseline:
            "Number of different tools an employee switches between in a workday to complete their tasks",
          withSnag: "From 6–8 tools to 1–2 (60–75% reduction)",
          claim:
            "Employees at PTM client companies reduced daily app-switching by 60%+, saving approximately 60 minutes per person per day.",
        },
        {
          metric: "Project On-Time Delivery Rate",
          baseline:
            "% of project milestones delivered on or before the agreed deadline",
          withSnag:
            "15–25 percentage point improvement (e.g., 55% → 75% on-time)",
          claim:
            "Real estate project teams using PTM improved on-time milestone delivery from 54% to 79% within one quarter.",
        },
        {
          metric: "Client Issue Resolution Time",
          baseline:
            "Average time (days) from a client issue being raised to formal resolution and closure",
          withSnag: "30–50% reduction in resolution time",
          claim:
            "Client-raised issues resolved 42% faster after implementing PTM's structured issue register, with full audit trail per issue.",
        },
        {
          metric: "Onboarding Time for New Employees",
          baseline:
            "Days from a new employee's first day to full operational productivity (first task assigned + completed + first MoM attended)",
          withSnag: "3–5 days faster vs traditional onboarding",
          claim:
            "New team members contribute to active projects 3 days faster, all project context, docs, and past MoMs accessible from Day 1.",
        },
        {
          metric: "Document Turnaround Time",
          baseline:
            "Hours saved per document cycle (creation → collaborative review → client-ready export)",
          withSnag:
            "2–4 hours saved per cycle (40–60% reduction in turnaround time)",
          claim:
            "Teams using PTM reduced proposal and report turnaround time by 52%, from first draft to client-ready file in half the time.",
        },
        {
          metric: "Management Reporting Time",
          baseline:
            "Hours per week saved by senior leaders and department heads who previously built manual status reports from Excel/email",
          withSnag: "5–12 hours/week saved per senior manager",
          claim:
            "Department heads using PTM reclaimed an average of 8 hours/week previously spent on manual status reporting, equivalent to 1 full working day.",
        },
      ],
      businessTargets: [
        {
          metric: "Monthly Recurring Revenue (MRR)",
          definition: "Total monthly revenue from active paying clients",
          d30Current: "₹2–5L MRR (3–6 paying accounts at ₹50–80k/month)",
          d30Phase1:
            "₹4–8L MRR (Demo env removes biggest friction; 5–10 accounts possible)",
          m3Current: "₹15–30L MRR (15–25 accounts; mix of SMB + mid-market)",
          m3Phase1:
            "₹25–50L MRR (Mobile app + integrations unlock tech companies fully; 25–40 accounts)",
        },
        {
          metric: "New Logo Count",
          definition: "Number of new paying companies onboarded (not seats)",
          d30Current: "3–6 new logos (founder-led, warm leads and cross-sell)",
          d30Phase1:
            "5–10 new logos (demo env enables self-qualify → faster pipeline)",
          m3Current: "15–25 new logos (3-segment motion in full flight)",
          m3Phase1:
            "25–40 new logos (mobile unlocks field-team industries; broader addressable market)",
        },
        {
          metric: "Week-1 Activation Rate",
          definition:
            "% of new accounts where 3+ users create/update tasks within 7 days of signup",
          d30Current:
            "35–50% (self-serve onboarding, no structured playbook yet)",
          d30Phase1:
            "45–60% (demo env pre-qualifies better-fit accounts and activate faster)",
          m3Current:
            "50–65% (onboarding playbook refined through first 15 accounts)",
          m3Phase1:
            "65–80% (mobile app means users activate from their phone on Day 1, removes desktop-only friction)",
        },
        {
          metric: "DAU/MAU Ratio (Habit Score)",
          definition:
            "Daily Active Users ÷ Monthly Active Users. Measures daily habit formation.",
          d30Current: "25–35% (desktop-only tool limits daily check-in habit)",
          d30Phase1:
            "30–40% (better-fit accounts from qualified demo pipeline)",
          m3Current:
            "35–45% (habit forming as teams embed PTM in weekly rhythms)",
          m3Phase1:
            "50–65% (mobile app transforms PTM into a daily-open tool like Slack, habit score jumps significantly)",
        },
        {
          metric: "Customer Acquisition Cost (CAC)",
          definition:
            "Total sales + marketing spend ÷ new logos acquired in the period",
          d30Current:
            "₹80,000–1,50,000/logo (founder time + outreach costs, no paid marketing)",
          d30Phase1:
            "₹60,000–1,20,000/logo (demo env reduces sales cycle duration → lower cost per close)",
          m3Current:
            "₹60,000–1,20,000/logo (as referral engine starts, CAC begins to fall)",
          m3Phase1:
            "₹40,000–80,000/logo (freemium tier in Phase 1 creates self-serve inbound → CAC drops significantly)",
        },
        {
          metric: "Net Revenue Retention (NRR)",
          definition:
            "MRR from existing accounts at end of period ÷ MRR from same accounts at start. >100% = expansion exceeds churn.",
          d30Current:
            "90–100% (early accounts, churn risk is real if onboarding is weak)",
          d30Phase1:
            "95–105% (better-fit accounts churn less; some early expansions possible)",
          m3Current:
            "100–115% (seat expansions as teams grow; first upsell from SMB to Growth tier)",
          m3Phase1:
            "110–125% (automation and Gantt features trigger upsell from Starter to Professional; strong NRR signal)",
        },
        {
          metric: "Sales Cycle Length",
          definition: "Average days from first demo to signed contract",
          d30Current:
            "35–55 days (founder-led, warm + cross-sell accounts close faster)",
          d30Phase1:
            "25–45 days (demo env allows self-evaluation before first call → shorter qualification)",
          m3Current:
            "30–50 days (playbook refined; SDR hired by Month 4 speeds pipeline)",
          m3Phase1:
            "20–35 days (freemium entry tier means tech companies start a trial before first talk to sales → cycle starts later but closes faster)",
        },
        {
          metric: "Churn Rate (Monthly)",
          definition: "% of paying accounts that cancel in a given month",
          d30Current:
            "0–5% (early accounts are high-touch; churn is survivable if must be understood)",
          d30Phase1:
            "0–3% (qualified accounts churn less; demo env filters out mis-fit buyers)",
          m3Current:
            "0–3% (structured onboarding reduces churn from activation failure)",
          m3Phase1:
            "0–2% (mobile app increases daily engagement → reduces passive churn from disengagement)",
        },
        {
          metric: "Demo-to-Trial Conversion Rate",
          definition: "% of demos that convert to a free trial or paid pilot",
          d30Current:
            "30–45% (founder-led demo with a strong data sovereignty story, some drop-off on 'no mobile app prospect objection')",
          d30Phase1:
            "45–60% (demo env allows pre-demo self-exploration; prospects arrive at the call already partially activated)",
          m3Current:
            "45–60% (consistent demo playbook; objection handling refined)",
          m3Phase1:
            "55–70% (mobile app removes the biggest objection; Gantt view becomes the second biggest; conversion improves significantly)",
        },
        {
          metric: "Net Promoter Score (NPS)",
          definition:
            "Standard 0–10 likelihood-to-recommend score. Above 40 = strong. Above 70 = exceptional.",
          d30Current:
            "NPS: 25–40 (early accounts are enthusiasts but product gaps create detractors)",
          d30Phase1:
            "NPS: 35–50 (better-fit accounts have fewer friction points → fewer detractors)",
          m3Current:
            "NPS: 40–55 (first wave of case studies signals product confidence; onboarding polish improves passives → promoters)",
          m3Phase1:
            "NPS: 55–70 (mobile app is the single biggest NPS driver in PM tools; its absence is the #1 complaint in early accounts)",
        },
      ],
      sheet: {
        title: "Project & Task Manager , Metrics",
        sections: [
          {
            title:
              "Section 1: Client impact metrics (landing page proof points) | Section 2: Product launch tracking (30-day & 3-month, with and without Phase 1 roadmap)",
            columns: [],
            rows: [],
          },
          {
            title:
              "SECTION 1, CLIENT IMPACT METRICS (What to track after go-live · Landing page proof points)",
            columns: [],
            rows: [],
          },
          {
            title:
              "These 10 metrics measure the real-world business impact PTM creates in client companies. Track these with every client from Day 30. Use the best results as landing page social proof.",
            columns: [],
            rows: [],
          },
          {
            title: "",
            columns: [
              "#",
              "Metric Name",
              "What it measures",
              "Impact range",
              "Feature driving the impact",
              "How the impact is caused",
              "Example landing page claim",
            ],
            rows: [
              [
                "1",
                "Sprint Velocity Improvement",
                "% increase in story points or tasks completed per sprint cycle after adopting PTM vs baseline",
                "15–30% increase",
                "Sprints module + Kanban board",
                "Sprint tasks are visible in real time on the kanban board. Blockers surface automatically when tasks stay in 'In Progress' past estimated time. Team leads no longer chase status via WhatsApp, the board is the single source of truth, reducing coordination overhead.",
                "Engineering teams using PTM completed 22% more sprint tasks in the first quarter vs their Jira baseline.",
              ],
              [
                "2",
                "MoM Action Completion Rate",
                "% of action items raised in meetings that are formally completed and closed within their due date",
                "2x–4x improvement (from ~30% to 70–90%)",
                "MoM module → auto-convert to Task",
                "In a traditional workflow, meeting action items written in a Word doc or email have no owner, no deadline enforcement, and no visibility. PTM's MoM auto-convert action points to assigned tasks with deadlines. The responsible person receives a task notification. Progress is tracked on the dashboard. Nothing falls through the cracks.",
                "After using PTM's MoM module, action item follow-through improved from 28% to 87% within 60 days.",
              ],
              [
                "3",
                "SaaS Subscription Cost Reduction",
                "Annual ₹ or $ savings achieved by consolidating fragmented SaaS tools into PTM",
                "₹750–1,200/user/month saved (₹9,000–14,400/user/year)",
                "Documents · Channels · Projects · MoM",
                "PTM replaces: MS 365 (₹750/user/month for Word/Excel/PPT) + a PM tool like Asana (₹900/user/month) + separate notes/MoM tool. For a 100-person company, this saves ₹1.65–2.4 crore per year in SaaS spend. Documents export as official MS Office files, no compatibility friction with external parties.",
                "A 120-person consulting firm saved ₹1.8 crore/year by replacing MS 365, Asana, and their notes tool with PTM, with all documents on their own servers.",
              ],
              [
                "4",
                "Client Issue Resolution Speed",
                "Average time (days) from client issue being raised to formal resolution in the Issues Register",
                "30–50% reduction in resolution time (10–15 days → 5–8 days)",
                "Issues Register module",
                "Before PTM: client issues raised via email → forwarded manually → assigned via WhatsApp → closed when someone remembers. After PTM: structured register with deadline, responsible person, escalation, and formal closure, full audit trail.",
                "Client-raised issues resolved 42% faster at PTM client companies, with a full audit trail and zero issues lost in email.",
              ],
              [
                "5",
                "Employee Daily Tool Switching Reduction",
                "Number of different tools an employee switches between in a workday to complete their tasks",
                "From 6–8 tools to 1–2 (60–75% reduction)",
                "Projects · Documents · Channels · MoM · Todo",
                "Before PTM: a typical employee checks Jira for tasks, Slack for messages, Google Docs for writing, Excel for tracking, and WhatsApp for quick decisions, 4+ context switches per day. After PTM: tasks, documents, channels, MoMs, and to-dos all live in one platform. Context switching drops to PTM + email (external only). Estimated time saving: 45–90 minutes per employee per day.",
                "Employees at PTM client companies reduced daily app-switching by 60%+, saving approximately 60 minutes per person per day.",
              ],
              [
                "6",
                "Project On-Time Delivery Rate",
                "% of project milestones delivered on or before the agreed deadline",
                "15–25 percentage point improvement (e.g., 55% → 75% on-time)",
                "Projects dashboard · Milestone tracking · 5-level escalation",
                "PTM's project dashboard shows milestone completion % in real time. When a milestone falls behind, the system flags it for the project manager before the deadline passes. The 5-level escalation ensures no blocker stays invisible for more than a defined TAT. Assignee-wise completion tracking identifies chronic delay patterns at the individual level.",
                "Real estate project teams using PTM improved on-time milestone delivery from 54% to 79% within one quarter.",
              ],
              [
                "7",
                "Client Issue Resolution Time",
                "Average time (days) from a client issue being raised to formal resolution and closure",
                "30–50% reduction in resolution time",
                "Issues register module",
                "Before PTM: client issues are raised via email → forwarded internally → assigned manually → followed up manually → closed when someone remembers to reply. Average resolution: 10–15 days. After PTM: client raises an issue in the register → auto-assigned to responsible person → deadline set → escalation triggered if breached → closure requires formal acknowledgement. Average resolution: 5–8 days.",
                "Client-raised issues resolved 42% faster after implementing PTM's structured issue register, with full audit trail per issue.",
              ],
              [
                "8",
                "Onboarding Time for New Employees",
                "Days from a new employee's first day to full operational productivity (first task assigned + completed + first MoM attended)",
                "3–5 days faster vs traditional onboarding",
                "Projects · Documents · MoM · Opportunity Register",
                "Before PTM: new employees spend Days 1–5 asking colleagues for project context, document access, and task assignments via email and WhatsApp. After PTM: on Day 1, new member is added to relevant projects, assigned tasks, and can access all project documents and past MoMs immediately. Reduction in unproductive onboarding time: 2–4 days per employee.",
                "New team members contribute to active projects 3 days faster, all project context, docs, and past MoMs accessible from Day 1.",
              ],
              [
                "9",
                "Document Turnaround Time",
                "Hours saved per document cycle (creation → collaborative review → client-ready export)",
                "2–4 hours saved per cycle (40–60% reduction in turnaround time)",
                "Documents module · in-platform creation, live collaboration, MS Office export",
                "Before PTM: write in Google Docs → share link → collect comments → download → format in Word → email to client. After PTM: create in PTM → collaborators edit live → one-click export as .docx → share directly from platform. No reformatting. No 'which version is final?' confusion.",
                "Teams using PTM reduced proposal and report turnaround time by 52%, from first draft to client-ready file in half the time.",
              ],
              [
                "10",
                "Management Reporting Time",
                "Hours per week saved by senior leaders and department heads who previously built manual status reports from Excel/email",
                "5–12 hours/week saved per senior manager",
                "Projects Dashboard · Assignee analytics · Profile analytics",
                "Before PTM: every Monday, a project manager collects WhatsApp updates, formats a PPT, and presents it in a status call. 3–5 hours of management time wasted per week. After PTM: the dashboard shows project completion %, milestone status, assignee workload, and issue counts in real time. The Monday PPT becomes a 5-minute dashboard review instead of a 3-hour preparation exercise.",
                "Department heads using PTM reclaimed an average of 8 hours/week previously spent on manual status reporting, equivalent to 1 full working day.",
              ],
            ],
          },
          {
            title:
              "SECTION 2, PRODUCT LAUNCH TRACKING METRICS (North Star + Top 10, with Phase 1 roadmap comparison)",
            columns: [],
            rows: [],
          },
          {
            title:
              "These metrics track the health of PTM's own product launch. North Star metric identified first. Then top 10 split by 30-day and 3-month windows, with expected ranges with and without Phase 1 roadmap improvements.",
            columns: [],
            rows: [],
          },
          {
            title: "★ NORTH STAR METRIC",
            columns: [],
            rows: [],
          },
          {
            title: "",
            columns: ["Metric", "Definition"],
            rows: [
              [
                "Weekly Active Teams",
                "Number of companies (teams) that have at least 3 active users who created or updated a task, MoM, or document in the past 7 days. This metric captures genuine habitual usage, not just accounts created. A team that uses PTM every week has embedded it into their workflow. A team that logs in once a month has not. Everything else follows from this: revenue, retention, referrals, and NPS all correlate with Weekly active team count.",
              ],
              [
                "Why this is the North Star",
                "Weekly active teams predict MRR growth (teams that are active expand seats). They predict NRR (teams that use PTM weekly are the ones who recommend it). They predict churn prevention (teams that go quiet for 2+ weeks are at-risk accounts to intervene on). A stagnant Weekly Active Teams count, even with rising new signups, is an early warning of a product-market fit problem.",
              ],
            ],
          },
          {
            title: "",
            columns: [
              "#",
              "Metric",
              "What it measures",
              "30-day target\n(current product)",
              "30-day target\n(with Phase 1 roadmap)\n★ Phase 1: Mobile app · Gantt view · Sprint velocity charts · Live demo env",
              "3-month target\n(current product)",
              "3-month target\n(with Phase 1 roadmap)\n★ Phase 1 delivered + addressable market expands significantly",
              "Why it matters",
            ],
            rows: [
              [
                "1",
                "Monthly Recurring Revenue (MRR)",
                "Total monthly revenue from active paying clients",
                "₹2–5L MRR\n(3–6 paying accounts at ₹50–80k/month)",
                "₹4–8L MRR\n(Demo env removes biggest friction; 5–10 accounts possible)",
                "₹15–30L MRR\n(15–25 accounts; mix of SMB + mid-market)",
                "₹25–50L MRR\n(Mobile app + integrations unlock tech companies fully; 25–40 accounts)",
                "Primary revenue health metric. Everything else e.g. hiring, product investment, marketing spend, should be proportional to MRR trajectory.",
              ],
              [
                "2",
                "New Logo Count",
                "Number of new paying companies onboarded (not seats)",
                "3–6 new logos\n(founder-led, warm leads and cross-sell)",
                "5–10 new logos\n(demo env enables self-qualify → faster pipeline)",
                "15–25 new logos\n(3-segment motion in full flight)",
                "25–40 new logos\n(mobile unlocks field-team industries; broader addressable market)",
                "Tracks market penetration speed. MRR without new logos = expansion only. New logos = market share gain.",
              ],
              [
                "3",
                "Week-1 Activation Rate",
                "% of new accounts where 3+ users create/update tasks within 7 days of signup",
                "35–50%\n(self-serve onboarding, no structured playbook yet)",
                "45–60%\n(demo env pre-qualifies better-fit accounts and activate faster)",
                "50–65%\n(onboarding playbook refined through first 15 accounts)",
                "65–80%\n(mobile app means users activate from their phone on Day 1, removes desktop-only friction)",
                "The single most important early retention signal. Below 40% = onboarding is broken. Below 30% = product-market fit problem. Intervene personally on every account below threshold.",
              ],
              [
                "4",
                "DAU/MAU Ratio (Habit Score)",
                "Daily Active Users ÷ Monthly Active Users. Measures daily habit formation.",
                "25–35%\n(desktop-only tool limits daily check-in habit)",
                "30–40%\n(better-fit accounts from qualified demo pipeline)",
                "35–45%\n(habit forming as teams embed PTM in weekly rhythms)",
                "50–65%\n(mobile app transforms PTM into a daily-open tool like Slack, habit score jumps significantly)",
                "Below 20% = the tool is used occasionally, not habitually. Below 20% at Month 3 is an early churn warning. Mobile app is the single biggest lever for this metric.",
              ],
              [
                "5",
                "Customer Acquisition Cost (CAC)",
                "Total sales + marketing spend ÷ new logos acquired in the period",
                "₹80,000–1,50,000/logo\n(founder time + outreach costs, no paid marketing)",
                "₹60,000–1,20,000/logo\n(demo env reduces sales cycle duration → lower cost per close)",
                "₹60,000–1,20,000/logo\n(as referral engine starts, CAC begins to fall)",
                "₹40,000–80,000/logo\n(freemium tier in Phase 1 creates self-serve inbound → CAC drops significantly)",
                "CAC payback target: under 12 months. At ₹80k CAC and ₹8L ACV, payback is ~1.2 months, excellent. Monitor CAC vs ACV ratio monthly.",
              ],
              [
                "6",
                "Net Revenue Retention (NRR)",
                "MRR from existing accounts at end of period ÷ MRR from same accounts at start. >100% = expansion exceeds churn.",
                "90–100%\n(early accounts, churn risk is real if onboarding is weak)",
                "95–105%\n(better-fit accounts churn less; some early expansions possible)",
                "100–115%\n(seat expansions as teams grow; first upsell from SMB to Growth tier)",
                "110–125%\n(automation and Gantt features trigger upsell from Starter to Professional; strong NRR signal)",
                "NRR >100% means the business grows even without new customers. NRR <90% at Month 3 = retention crisis. NRR is the compound interest of SaaS.",
              ],
              [
                "7",
                "Sales Cycle Length",
                "Average days from first demo to signed contract",
                "35–55 days\n(founder-led, warm + cross-sell accounts close faster)",
                "25–45 days\n(demo env allows self-evaluation before first call → shorter qualification)",
                "30–50 days\n(playbook refined; SDR hired by Month 4 speeds pipeline)",
                "20–35 days\n(freemium entry tier means tech companies start a trial before first talk to sales → cycle starts later but closes faster)",
                "Below 45 days is healthy for this ACV. Above 60 days = friction in the process (usually IT approval or procurement). Monitor where deals stall.",
              ],
              [
                "8",
                "Churn Rate (Monthly)",
                "% of paying accounts that cancel in a given month",
                "0–5%\n(early accounts are high-touch; churn is survivable if must be understood)",
                "0–3%\n(qualified accounts churn less; demo env filters out mis-fit buyers)",
                "0–3%\n(structured onboarding reduces churn from activation failure)",
                "0–2%\n(mobile app increases daily engagement → reduces passive churn from disengagement)",
                "Above 5% monthly churn is an existential risk for SaaS. The number one cause of early churn is activation failure, the team signed up but never embedded the tool in their workflow. Intervene aggressively.",
              ],
              [
                "9",
                "Demo-to-Trial Conversion Rate",
                "% of demos that convert to a free trial or paid pilot",
                "30–45%\n(founder-led demo with a strong data sovereignty story, some drop-off on 'no mobile app prospect objection')",
                "45–60%\n(demo env allows pre-demo self-exploration; prospects arrive at the call already partially activated)",
                "45–60%\n(consistent demo playbook; objection handling refined)",
                "55–70%\n(mobile app removes the biggest objection; Gantt view becomes the second biggest; conversion improves significantly)",
                "Below 30% = demo is not landing the value proposition. Below 30% for 3+ consecutive weeks = revisit the demo script. Track which specific objection kills the conversion ('no mobile' vs 'no gantt' vs 'price').",
              ],
              [
                "10",
                "Net Promoter Score (NPS)",
                "Standard 0–10 likelihood-to-recommend score. Above 40 = strong. Above 70 = exceptional.",
                "NPS: 25–40\n(early accounts are enthusiasts but product gaps create detractors)",
                "NPS: 35–50\n(better-fit accounts have fewer friction points → fewer detractors)",
                "NPS: 40–55\n(first wave of case studies signals product confidence; onboarding polish improves passives → promoters)",
                "NPS: 55–70\n(mobile app is the single biggest NPS driver in PM tools; its absence is the #1 complaint in early accounts)",
                "NPS below 30 at Month 3 = something is fundamentally wrong. Survey every account at Day 30 and Day 90. Listen specifically to the 6s and 7s (passives), they will tell you exactly what would make them a 9 or 10.",
              ],
            ],
          },
          {
            title:
              "LEGEND: White columns = current product, no Phase 1 roadmap changes | Green columns = projections with Phase 1 roadmap (Mobile app, Live demo env, Gantt, Calendar sync, Sprint velocity charts) | All ranges are realistic targets, not guarantees, calibrate against your actual sales cycle and onboarding playbook as data emerges",
            columns: [],
            rows: [],
          },
        ],
      },
    },
    detailedSWOT: {
      strengths: [
        {
          headline: "Data sovereignty",
          explanation:
            "the single strongest differentiator; no competitor offers this in the SMB space",
        },
        {
          headline: "All-in-one platform",
          explanation:
            "replacing 4–5 separate tools (PM, documents, channels, MoM, opportunity tracking) at one price",
        },
        {
          headline: "Document creation with MS Office export",
          explanation: "eliminates need for MS 365 subscription",
        },
        {
          headline: "MoM-to-task auto-conversion and Opportunity Register",
          explanation:
            "unique productivity workflows no competitor offers natively",
        },
        {
          headline: "Simple, low-learning-curve UI",
          explanation: "faster adoption vs Jira or Monday",
        },
        {
          headline: "Document creation with MS Office export and MoM-to-task",
          explanation:
            "provide strong daily workflow hooks that drive habitual use",
        },
        {
          headline: "Eisenhower Matrix + Kanban dual view",
          explanation:
            "for personal task management is rare in enterprise tools",
        },
        {
          headline: "Cross-sell opportunity",
          explanation:
            "within existing Lockated FM Matrix and Loyalty client base",
        },
        {
          headline: "MoM module with direct task conversion",
          explanation: "reduces meeting-to-action drop-off",
        },
        {
          headline: "Opportunity Register",
          explanation: "enables bottom-up innovation capture",
        },
      ],
      weaknesses: [
        {
          headline: "Currently no live demo environment",
          explanation:
            "limits sales conversations and proof-of-concept velocity",
        },
        {
          headline: "No mobile app yet",
          explanation: "field teams and executives rely on mobile-first tools",
        },
        {
          headline: "Extremely crowded category",
          explanation:
            "with well-funded, mature competitors (Jira, Asana, Monday, ClickUp)",
        },
        {
          headline: "Missing advanced features",
          explanation:
            "Gantt chart, time tracking, automation rules, AI task suggestions",
        },
        {
          headline: "No third-party integrations yet",
          explanation:
            "(GitHub, Jira, Slack), limits adoption in dev-heavy teams and enterprise accounts",
        },
        {
          headline: "Brand visibility is low vs Asana and Monday",
          explanation:
            "requires consistent content marketing and event presence to build awareness",
        },
        {
          headline: "Data sovereignty USP",
          explanation:
            "requires client IT buy-in, longer sales cycle for procurement",
        },
        {
          headline: "Some UX redundancy",
          explanation:
            "(MoM and To-Do appear in both top nav and projects sidebar)",
        },
        {
          headline: "No mobile app",
          explanation:
            "is the most critical deal-blocker, affects all segments, especially real estate, manufacturing, and any field-based team",
        },
        {
          headline: "Document collaboration quality",
          explanation:
            "will be benchmarked against Google Docs, hard bar to clear",
        },
      ],
      opportunities: [
        {
          headline: "Rising enterprise backlash against SaaS data practices",
          explanation: "data sovereignty is a growing C-suite concern",
        },
        {
          headline: "Indian SMB market",
          explanation: "is underserved by affordable, locally-hosted PM tools",
        },
        {
          headline: "Post-COVID distributed work",
          explanation:
            "has accelerated demand for unified project coordination tools that work across teams without WhatsApp or email",
        },
        {
          headline: "MS 365 and Google Workspace pricing increases",
          explanation: "have made organisations open to alternatives",
        },
        {
          headline: "Government and BFSI sectors in India",
          explanation: "have regulatory mandates around data localization",
        },
        {
          headline: "Existing Lockated clients",
          explanation:
            "(FM Matrix, Loyalty) are warm leads with established trust",
        },
        {
          headline: "Opportunity to build vertical-specific templates",
          explanation:
            "(Real Estate PM, Facility Project Tracker) on top of core",
        },
        {
          headline: "AI integration",
          explanation:
            "(document drafting, smart task prioritization, MoM auto-summary) is a near-term differentiator",
        },
        {
          headline: "MoM module",
          explanation:
            "can expand into AI-powered meeting intelligence (auto-transcription, action item extraction), natural upsell for professional services firms",
        },
        {
          headline: "Open-source document layer",
          explanation:
            "could attract developer communities and build ecosystem moat",
        },
      ],
      threats: [
        {
          headline: "Notion, Linear, ClickUp",
          explanation:
            "all offer free tiers, user acquisition cost is near-zero for competitors",
        },
        {
          headline: "Microsoft Teams + Project bundle",
          explanation: "is sticky in enterprise already in the MS ecosystem",
        },
        {
          headline: "Google Workspace",
          explanation:
            "deeply embedded in Indian startups and SMBs, high switching cost",
        },
        {
          headline: "Jira/Confluence combo",
          explanation:
            "dominates tech companies, changing PM tools mid-flight is painful",
        },
        {
          headline: "AI-native PM tools",
          explanation:
            "(Notion AI, Linear's AI features) are raising the baseline feature expectation",
        },
        {
          headline: "Buyers",
          explanation:
            "may prefer best-of-breed point solutions over an all-in-one if individual tools are stronger",
        },
        {
          headline: "If document collaboration quality lags",
          explanation:
            "users will revert to Google Docs while 'using' the platform",
        },
        {
          headline: "Platform complexity risk",
          explanation:
            "trying to replace 7 tools means 7 things that could be done better elsewhere",
        },
        {
          headline: "Large enterprise clients",
          explanation:
            "may have pre-existing SaaS contracts that are hard to displace",
        },
        {
          headline: "Data sovereignty hosting requirements",
          explanation:
            "increase infra cost and implementation complexity for clients",
        },
      ],
    },
  },
};

// ============== TAB LABELS ==============
const ptmTabLabels: Record<string, string> = {
  summary: "Product Summary",
  features: "Feature List",
  market: "Market Analysis",
  pricing: "Features and Pricing",
  usecases: "Use Cases",
  roadmap: "Product Roadmap",
  business: "Business Plan Builder",
  gtm: "GTM Strategy",
  metrics: "Metrics",
  swot: "SWOT Analysis",
  enhancements: "Enhancement Roadmap",
  assets: "Assets",
};

// ============== PTM CUSTOM TABS ==============

// Summary Tab for PTM
const PTMSummaryTab: React.FC = () => {
  const identity =
    productData.extendedContent?.productSummaryNew?.identity || [];
  const problemSolves =
    productData.extendedContent?.productSummaryNew?.problemSolves || [];
  const whoItIsFor =
    productData.extendedContent?.productSummaryNew?.whoItIsFor || [];
  const featureSummaryModules =
    productData.extendedContent?.productSummaryNew?.featureSummaryModules || [];
  const today = productData.extendedContent?.productSummaryNew?.today || [];

  return (
    <div className="space-y-8 animate-fade-in overflow-x-auto">
      {/* Identity Section */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-2xl font-semibold tracking-tight font-poppins">
          {productData.name} - Product Identity
        </h2>
        <p className="text-[10px] font-medium text-[#2C2C2C]/40 tracking-widest mt-1">
          LOCKATED / GOPHYGITAL.WORK | ENTERPRISE WORK MANAGEMENT PLATFORM |
          INDIA PRIMARY, GCC SECONDARY
        </p>
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-4 text-center w-1/4 font-poppins">
                Field
              </th>
              <th className="border border-[#b8cce4] p-4 text-center font-poppins">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {identity.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.field}
                </td>
                <td className="border border-[#b8cce4] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Problem Solves Section */}
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-4 font-semibold text-sm rounded-t-xl font-poppins">
        The Problem It Solves
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-4 text-center w-1/3 font-poppins">
                Pain Point
              </th>
              <th className="border border-[#b8cce4] p-4 text-center font-poppins">
                How PTM Solves It
              </th>
            </tr>
          </thead>
          <tbody>
            {problemSolves.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.painPoint}
                </td>
                <td className="border border-[#b8cce4] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.solution}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Who It Is For Section */}
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
        Who It Is For
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-3 text-center w-1/5 font-poppins">
                Role
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-1/4 font-poppins">
                What They Use It For
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-1/4 font-poppins">
                Key Frustration Today
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-1/4 font-poppins">
                What They Gain
              </th>
            </tr>
          </thead>
          <tbody>
            {whoItIsFor.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.role}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.useCase}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/70 font-medium leading-relaxed italic font-poppins bg-white">
                  {r.frustration}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white">
                  {r.gain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature Summary (Live Modules) Section */}
      <div className="bg-[#1565C0] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] text-center">
        FEATURE SUMMARY (LIVE MODULES)
      </div>
      <div className="bg-white overflow-hidden border border-[#b8cce4]">
        <table className="w-full border-collapse text-sm">
          <tbody className="divide-y divide-gray-300">
            {featureSummaryModules.map((module, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#FAF9F6]" : "bg-white"}>
                <td
                  className={`p-4 w-1/4 font-semibold border-r border-[#b8cce4] align-top ${
                    module.isUSP
                      ? "bg-[#E3F2FD] text-[#1f3a5f]"
                      : "text-[#2C2C2C]"
                  }`}
                >
                  {module.module}
                </td>
                <td
                  className={`p-4 text-[#2C2C2C] align-top font-poppins leading-relaxed ${
                    module.isUSP ? "bg-[#E3F2FD] text-blue-900" : ""
                  }`}
                >
                  {module.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Where We Are Today Section */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins border border-[#C4B89D] mt-8">
        Competititve Position & USP
      </div>
      <div className="bg-[#F6F4EE] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-3 text-center w-1/4 font-poppins">
                Dimension
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-3/4 font-poppins">
                Current State
              </th>
            </tr>
          </thead>
          <tbody>
            {today.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                  {r.dimension}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins bg-white whitespace-pre-line">
                  {r.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Features Tab for PTM
const PTMFeaturesTab: React.FC = () => {
  const features = productData.extendedContent?.detailedFeatures || [];
  const featureComparison =
    productData.extendedContent?.productSummaryNew?.featureComparison || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl flex justify-between items-center">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Feature List
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        All features from product brief. USP rows highlighted in blue. Star
        denotes unique competitive advantage.
      </p>

      {/* Feature Comparison (brief) */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
        SECTION 1, CURRENT FEATURES VS MARKET STANDARD
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-left">
                Feature Area
              </th>
              <th className="border border-[#b8cce4] p-2 text-left">
                Market Standard
              </th>
              <th className="border border-[#b8cce4] p-2 text-left bg-[#DA7756]">
                Our Product
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Status
              </th>
              <th className="border border-[#b8cce4] p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((fc, idx) => {
              const status = fc.snag360Status || "";
              const getStatusColor = (s: string) => {
                const upperS = s.toUpperCase();
                if (upperS.includes("AHEAD, UNIQUE"))
                  return { bg: "#1f4a7c", text: "white" }; // Dark blue as in image
                if (upperS.includes("AHEAD"))
                  return { bg: "#e2efda", text: "#2E7D32" };
                if (upperS.includes("AT PAR"))
                  return { bg: "#F5F5F5", text: "#666" };
                if (upperS.includes("PARITY"))
                  return { bg: "#FFF9C4", text: "#F57F17" };
                if (upperS.includes("GAP"))
                  return { bg: "#FFEBEE", text: "#C62828" };
                return { bg: "#F5F5F5", text: "#666" };
              };

              const color = getStatusColor(status);

              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}
                >
                  <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                    {fc.feature}
                  </td>
                  <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                    {fc.competitorInfo}
                  </td>
                  <td className="border border-[#b8cce4] p-2 text-[#2C2C2C] font-medium bg-[#DA7756]/5">
                    {fc.productDetail}
                  </td>
                  <td className="border border-[#b8cce4] p-2 text-center">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                    {fc.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-3 text-center">
                Module
              </th>
              <th className="border border-[#b8cce4] p-3 text-center">
                Feature
              </th>
              <th className="border border-[#b8cce4] p-3 text-center">
                Sub-Features
              </th>
              <th className="border border-[#b8cce4] p-3 text-center">
                How It Currently Works
              </th>
              <th className="border border-[#b8cce4] p-3 text-center">
                User Type
              </th>
              <th className="border border-[#b8cce4] p-3 text-center">USP</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr
                key={i}
                className={
                  f.usp
                    ? "bg-[#d9e1f2]"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C] font-medium">
                  {f.module}
                </td>
                <td
                  className={`border border-[#b8cce4] p-3 ${f.usp ? "font-semibold text-[#1f3a5f]" : "text-[#2C2C2C]"}`}
                >
                  {f.feature}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80">
                  {f.subFeatures}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80">
                  {f.works}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80">
                  {f.userType}
                </td>
                <td className="border border-[#b8cce4] p-3 text-center font-semibold text-[#DA7756]">
                  {f.usp ? "* USP" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Market Tab for PTM
const PTMMarketTab: React.FC = () => {
  const targetAudience =
    productData.extendedContent?.detailedMarketAnalysis?.targetAudience || [];
  const companyPainPoints =
    productData.extendedContent?.detailedMarketAnalysis?.companyPainPoints ||
    [];
  const competitorMapping =
    productData.extendedContent?.detailedMarketAnalysis?.competitorMapping ||
    [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Market Analysis
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Target Audience | Section 2: Company Pain Points | Section 3:
        Competitor Mapping
      </p>

      {/* Target Audience Table */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Target Audience Segments
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">
                Segment
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Demographics
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Pain Points
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Problem Not Solved
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                "Good Enough" Today
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Urgency
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Primary Buyer
              </th>
            </tr>
          </thead>
          <tbody>
            {targetAudience.map((ta, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {ta.segment}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {ta.demographics}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {ta.painPoints}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {ta.notSolved}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {ta.goodEnough}
                </td>
                <td
                  className={`border border-[#b8cce4] p-2 text-center font-semibold ${ta.urgency === "HIGH" ? "text-red-600" : "text-orange-600"}`}
                >
                  {ta.urgency}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {ta.primaryBuyer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Company Pain Points Table */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 2: Company Pain Points by Type
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">
                Company Type
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Pain Point 1
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Pain Point 2
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Pain Point 3
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Cost / Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {companyPainPoints.map((cp, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                  {cp.companyType}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {cp.pain1}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {cp.pain2}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {cp.pain3}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {cp.costRisk}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitors Table */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 3: Competitor Mapping
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">
                Competitor
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Target Customer
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Pricing
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Strengths
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Weaknesses
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Market Gaps
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Threats
              </th>
            </tr>
          </thead>
          <tbody>
            {competitorMapping.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {c.name}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.targetCustomer}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.pricing}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.strongestFeatures}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.weakness}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.marketGaps}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.threats}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Pricing Tab for PTM
const PTMPricingTab: React.FC = () => {
  const pricing = productData.extendedContent?.detailedPricing;
  const featureRows = pricing?.pricingFeatureRows || [];
  const summaryRows = pricing?.pricingSummaryRows || [];
  const currentRows = pricing?.pricingCurrentRows || [];
  const positioningRows = pricing?.pricingPositioningRows || [];
  const improvementRows = pricing?.pricingImprovementRows || [];
  const featureComparison =
    productData.extendedContent?.productSummaryNew?.featureComparison || [];

  const mergedFeatureRows = [
    ...featureRows,
    ...featureComparison.map((fc: any) => ({
      capability: fc.feature,
      currentState: fc.productDetail,
      marketNeed: fc.competitorInfo,
      impact: "",
      status:
        fc.snag360Status === "AHEAD_UNIQUE"
          ? "AHEAD, UNIQUE"
          : fc.snag360Status,
      recommendation: fc.notes,
    })),
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Features and Pricing
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        {pricing?.pricingMatrixSubtitle ||
          "Section 1: Feature comparison | Section 2: Pricing landscape | Section 3: Positioning | Section 4: Value propositions"}
      </p>

      {/* Feature Comparison Table */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
        SECTION 1, CURRENT FEATURES VS MARKET STANDARD
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">
                Feature Area
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Market Standard
              </th>
              <th className="border border-[#b8cce4] p-2 text-center bg-[#DA7756]">
                Our Product
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Status
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">Notes</th>
            </tr>
          </thead>
          <tbody>
            {featureRows.map((f, i) => (
              <tr
                key={i}
                className={
                  f.status === "AHEAD, UNIQUE" || f.status === "AHEAD"
                    ? "bg-[#e2efda]"
                    : f.status === "GAP"
                      ? "bg-[#fce4d6]"
                      : i % 2 === 0
                        ? "bg-white"
                        : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {f.capability}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {f.marketNeed}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C] font-medium bg-[#DA7756]/10">
                  {f.currentState}
                </td>
                <td
                  className={`border border-[#b8cce4] p-2 text-center font-semibold ${f.status.includes("AHEAD") ? "text-green-600" : f.status === "GAP" ? "text-red-600" : "text-[#2C2C2C]"}`}
                >
                  {f.status}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {f.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Rows */}
      {summaryRows.length > 0 && (
        <div className="space-y-2 mt-6">
          {summaryRows.map((s, i) => (
            <div
              key={i}
              className={`border border-[#b8cce4] p-4 text-sm font-medium leading-relaxed font-poppins ${s.tone === "green" ? "bg-[#e2efda]" : s.tone === "yellow" ? "bg-[#fff2cc]" : "bg-[#d9e1f2]"}`}
            >
              <strong>{s.label}:</strong> {s.detail}
            </div>
          ))}
        </div>
      )}

      {/* Current Pricing */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        SECTION 2 ,PRICING LANDSCAPE
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-3 text-left w-1/4">
                Pricing Layer
              </th>
              <th className="border border-[#b8cce4] p-3 text-left w-3/4">
                Details & Benchmarking
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-3 font-semibold text-[#1f3a5f]">
                  {c.label}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 leading-relaxed">
                  {c.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Positioning */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        SECTION 3 ,HOW TO POSITION OURSELVES
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-3 text-left w-1/4">
                Dimension
              </th>
              <th className="border border-[#b8cce4] p-3 text-left w-3/4">
                Strategic Narrative
              </th>
            </tr>
          </thead>
          <tbody>
            {positioningRows.map((p: any, i: number) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-3 font-semibold text-[#1f3a5f]">
                  {p.label}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line">
                  {p.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Value Proposition Improvements */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        SECTION 4 ,VALUE PROPOSITIONS & IMPROVEMENTS
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-3 text-center w-1/5">
                Current VP
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-1/5">
                Who it resonates with
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-2/5">
                Improved version
              </th>
              <th className="border border-[#b8cce4] p-3 text-center w-2/5">
                Why stronger
              </th>
            </tr>
          </thead>
          <tbody>
            {improvementRows.map((imp: any, i: number) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-3 font-semibold text-[#2C2C2C]">
                  {imp.currentVP}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#DA7756] font-medium">
                  {imp.whoResonates}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 leading-relaxed">
                  {imp.improvedVersion}
                </td>
                <td className="border border-[#b8cce4] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                  {imp.whyStronger}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Use Cases Tab for PTM
const PTMUseCasesTab: React.FC = () => {
  const industryUseCases =
    productData.extendedContent?.detailedUseCases?.industryUseCases || [];
  const internalTeamUseCases =
    productData.extendedContent?.detailedUseCases?.internalTeamUseCases || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Use Cases
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Industry Use Cases | Section 2: Internal Team Use Cases
      </p>

      {/* Industry Use Cases */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Industry Use Cases (10 Industries)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">#</th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Industry
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Key Features Used
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Use Case
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Urgency
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Primary Buyer
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Profile
              </th>
            </tr>
          </thead>
          <tbody>
            {industryUseCases.map((uc, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {uc.rank}
                </td>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {uc.industry}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {uc.features}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {uc.useCase}
                </td>
                <td
                  className={`border border-[#b8cce4] p-2 text-center font-semibold ${uc.urgency?.includes("HIGH") ? "text-red-600" : "text-orange-600"}`}
                >
                  {uc.urgency}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {uc.primaryBuyer}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {uc.profile}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal Team Use Cases */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Section 2: Internal Team Use Cases (10 Teams)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">#</th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Team / Function
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Process
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Modules Used
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Key Benefit
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Frequency
              </th>
            </tr>
          </thead>
          <tbody>
            {internalTeamUseCases.map((uc, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {i + 1}
                </td>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {uc.team}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {uc.process}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {uc.modules}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#DA7756] font-semibold">
                  {uc.benefit}
                </td>
                <td className="border border-[#b8cce4] p-2 text-center text-[#2C2C2C]/80">
                  {uc.frequency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Roadmap Tab for PTM
const PTMRoadmapTab: React.FC = () => {
  const structuredRoadmap =
    productData.extendedContent?.detailedRoadmap?.structuredRoadmap || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Product Roadmap
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        3 phases | P0: 0–3 months | P1: 3–6 months | P2: 6–18 months
      </p>

      {structuredRoadmap.map((phase, phaseIdx) => (
        <div key={phaseIdx} className="space-y-4">
          <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
            {phase.timeframe} — {phase.headline}
          </div>
          <div className="bg-[#d9e1f2] border border-[#b8cce4] p-3 text-[11px] text-[#2C2C2C] font-medium leading-relaxed font-poppins italic">
            {phase.phaseDescription}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] font-poppins">
              <thead>
                <tr className="bg-[#4f81bd] text-white font-semibold">
                  <th className="border border-[#b8cce4] p-2 text-center">
                    Feature Name
                  </th>
                  <th className="border border-[#b8cce4] p-2 text-center">
                    What It Is
                  </th>
                  <th className="border border-[#b8cce4] p-2 text-center">
                    Why It Matters
                  </th>
                  <th className="border border-[#b8cce4] p-2 text-center">
                    Unlocked Segment
                  </th>
                  <th className="border border-[#b8cce4] p-2 text-center">
                    Deal Risk
                  </th>
                  <th className="border border-[#b8cce4] p-2 text-center">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {phase.items.map((item, i) => (
                  <tr
                    key={i}
                    className={
                      item.priority?.includes("P0")
                        ? "bg-[#fce4d6]"
                        : i % 2 === 0
                          ? "bg-white"
                          : "bg-[#F6F4EE]"
                    }
                  >
                    <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                      {item.featureName}
                    </td>
                    <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                      {item.whatItIs}
                    </td>
                    <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                      {item.whyItMatters}
                    </td>
                    <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                      {item.unlockedSegment}
                    </td>
                    <td
                      className={`border border-[#b8cce4] p-2 ${item.dealRisk?.includes("CRITICAL") ? "text-red-600 font-semibold" : "text-[#2C2C2C]/80"}`}
                    >
                      {item.dealRisk}
                    </td>
                    <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#DA7756]">
                      {item.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

// Business Plan Tab for PTM
const PTMBusinessPlanTab: React.FC = () => {
  const planQuestions =
    productData.extendedContent?.detailedBusinessPlan?.planQuestions || [];
  const founderChecklist =
    productData.extendedContent?.detailedBusinessPlan?.founderChecklist || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Business Plan Builder
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        10 investor-ready Q&A blocks + Founder checklist for data validation
      </p>

      {/* Q&A Table */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Investor Q&A Framework
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center w-[5%]">
                #
              </th>
              <th className="border border-[#b8cce4] p-2 text-center w-[20%]">
                Question
              </th>
              <th className="border border-[#b8cce4] p-2 text-center w-[55%]">
                Answer
              </th>
              <th className="border border-[#b8cce4] p-2 text-center w-[10%]">
                Source
              </th>
              <th className="border border-[#b8cce4] p-2 text-center w-[10%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {planQuestions.map((q, i) => (
              <tr
                key={i}
                className={
                  q.flag?.includes("Founder")
                    ? "bg-[#fff2cc]"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {q.id}
                </td>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {q.question}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line">
                  {q.answer}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/60 text-center">
                  {q.source}
                </td>
                <td
                  className={`border border-[#b8cce4] p-2 text-center text-[10px] ${q.flag?.includes("Ready") ? "text-green-600" : "text-orange-600"}`}
                >
                  {q.flag}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Founder Checklist */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        Founder Checklist - Data to Validate
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">
                Linked Q
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Item to Verify
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                How to Verify
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {founderChecklist.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {c.id}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.item}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {c.verify}
                </td>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-orange-600">
                  {c.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// GTM Tab for PTM
const PTMGTMTab: React.FC = () => {
  const targetGroups =
    productData.extendedContent?.detailedGTM?.targetGroups || [];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - GTM Strategy
        </h2>
      </div>

      {targetGroups.map((tg: any, tgIdx) => (
        <div key={tgIdx} className="space-y-8 mb-12">
          <div className="border-l-4 border-[#1f3a5f] pl-4 text-2xl font-bold text-[#1f3a5f] font-poppins mb-6">
            {tg.name}
          </div>

          {tg.sections.map((section: any, sIdx: number) => (
            <div key={sIdx} className="space-y-4">
              <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
                {section.title}
              </div>
              <div className="overflow-x-auto shadow-sm border border-[#b8cce4] rounded-lg">
                <table className="w-full border-collapse text-[11px] font-poppins">
                  <thead>
                    <tr className="bg-[#4f81bd] text-white font-semibold">
                      {section.columns.map((col: string, cIdx: number) => (
                        <th 
                          key={cIdx} 
                          className={`border border-[#b8cce4] p-3 text-left ${cIdx === 0 ? "w-[15%]" : ""}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row: any, rIdx: number) => {
                      const textColor = row.textColor || "#2C2C2C";
                      const bgColor = row.bgColor || (rIdx % 2 === 0 ? "white" : "#F6F4EE");
                      
                      return (
                        <tr key={rIdx} style={{ backgroundColor: bgColor }}>
                          {section.columns.map((_, colIdx: number) => {
                            const cellValue = colIdx === 0 ? (row.label || row.col1) : 
                                              colIdx === 1 ? (row.detail || row.col2) : 
                                              colIdx === 2 ? row.col3 : 
                                              row.col4;
                            
                            const isYes = cellValue === "Yes";
                            
                            return (
                              <td 
                                key={colIdx}
                                className={`border border-[#b8cce4] p-3 ${colIdx === 0 ? "font-semibold text-[#1f3a5f] bg-[#f0f4ff]" : "text-[#2C2C2C]/80"} ${isYes ? "text-green-700 font-bold text-center bg-green-50/30" : ""}`}
                                style={{ 
                                  color: colIdx === 0 ? (textColor === "#2C2C2C" ? "#1f3a5f" : textColor) : textColor,
                                  backgroundColor: colIdx === 0 ? "" : (isYes ? "" : bgColor)
                                }}
                              >
                                {cellValue}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {tg.summaryBox && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-sm text-blue-900 leading-relaxed font-poppins shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <strong className="uppercase tracking-wider">Target Group Summary</strong>
              </div>
              {tg.summaryBox}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Metrics Tab for PTM
const PTMMetricsTab: React.FC = () => {
  const clientImpact =
    productData.extendedContent?.detailedMetrics?.clientImpact || [];
  const businessTargets =
    productData.extendedContent?.detailedMetrics?.businessTargets || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Key Metrics and Targets
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Section 1: Client Impact Metrics for Landing Page | Section 2: Product
        and Business Metrics with targets
      </p>

      {/* Client Impact Metrics */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins">
        Section 1: Client Impact Metrics (for Landing Page and Sales Deck)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">#</th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Metric
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Current Baseline
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                With PTM
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Landing Page Claim
              </th>
            </tr>
          </thead>
          <tbody>
            {clientImpact.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {i + 1}
                </td>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {m.metric}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {m.baseline}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {m.withSnag}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#DA7756] font-semibold">
                  {m.claim}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Business Targets */}
      <div className="bg-[#1f3a5f] text-white px-4 py-3 font-semibold text-sm font-poppins mt-8">
        SECTION 2 , PRODUCT LAUNCH TRACKING METRICS (North Star + Top 10, with Phase 1 roadmap comparison)
      </div>
      <p className="text-[11px] text-[#2C2C2C]/70 italic font-medium font-poppins px-2 py-2 bg-[#f0f4ff] border-l-4 border-[#1f3a5f]">
        These metrics track the health of PTM's own product launch. North Star metric identified first. Then top 10 split by 30-day and 3-month windows, with expected ranges with and without Phase 1 roadmap improvements.
      </p>

      {/* North Star Metric Box */}
      <div className="border border-[#b8cce4] mt-4 overflow-hidden rounded-lg">
        <div className="bg-[#1f3a5f] text-white px-4 py-2 font-bold text-center text-xs flex items-center justify-center gap-2">
          ★ NORTH STAR METRIC
        </div>
        <table className="w-full border-collapse text-[11px] font-poppins">
          <tbody>
            <tr>
              <td className="w-[30%] bg-[#1f3a5f] text-white p-4 font-bold text-center border border-[#b8cce4] align-middle">
                Weekly Active Teams
              </td>
              <td className="w-[70%] bg-[#f0f4ff] p-4 text-[#2C2C2C] border border-[#b8cce4]">
                {productData.extendedContent?.detailedMetrics?.northStarMetric?.definition}
              </td>
            </tr>
            <tr>
              <td className="w-[30%] bg-[#f0f4ff] text-[#1f3a5f] p-4 font-bold border border-[#b8cce4]">
                Why this is the North Star
              </td>
              <td className="w-[70%] bg-[#f0f4ff] p-4 text-[#2C2C2C] border border-[#b8cce4]">
                {productData.extendedContent?.detailedMetrics?.northStarMetric?.whyItIsNorthStar}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse text-[11px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">#</th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Metric
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                What it measures
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                30-day target (current product)
              </th>
              <th className="border border-[#b8cce4] p-2 text-center bg-[#e2efda] text-[#2E7D32]">
                30-day target (with Phase 1 roadmap)
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                3-month target (current product)
              </th>
              <th className="border border-[#b8cce4] p-2 text-center bg-[#e2efda] text-[#2E7D32]">
                3-month target (with Phase 1 roadmap)
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Why it matters
              </th>
            </tr>
          </thead>
          <tbody>
            {businessTargets.map((t: any, i: number) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {i + 1}
                </td>
                <td className="border border-[#b8cce4] p-2 font-semibold text-[#2C2C2C]">
                  {t.metric}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {t.definition}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.d30Current}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2E7D32] bg-[#e2efda]/30 whitespace-pre-line">
                  {t.d30Phase1}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80 whitespace-pre-line">
                  {t.m3Current}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2E7D32] bg-[#e2efda]/30 whitespace-pre-line">
                  {t.m3Phase1}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80 text-[10px]">
                  {t.whyItMatters || "TBD"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SWOT Tab for PTM
const PTMSWOTTab: React.FC = () => {
  const swot = productData.extendedContent?.detailedSWOT;
  const strengths = swot?.strengths || [];
  const weaknesses = swot?.weaknesses || [];
  const opportunities = swot?.opportunities || [];
  const threats = swot?.threats || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - SWOT Analysis
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        10 items per quadrant. Bold headline + one-sentence explanation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div>
          <div className="bg-[#4f81bd] text-white px-4 py-3 font-semibold text-center font-poppins">
            STRENGTHS
          </div>
          <div className="border border-[#b8cce4]">
            {strengths.map((s, i) => (
              <div
                key={i}
                className="bg-[#e2efda] border-b border-[#b8cce4] p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {s.headline}:
                </strong>{" "}
                {s.explanation}
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div>
          <div className="bg-[#4f81bd] text-white px-4 py-3 font-semibold text-center font-poppins">
            WEAKNESSES
          </div>
          <div className="border border-[#b8cce4]">
            {weaknesses.map((w, i) => (
              <div
                key={i}
                className="bg-[#fce4d6] border-b border-[#b8cce4] p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {w.headline}:
                </strong>{" "}
                {w.explanation}
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <div className="bg-[#4f81bd] text-white px-4 py-3 font-semibold text-center font-poppins">
            OPPORTUNITIES
          </div>
          <div className="border border-[#b8cce4]">
            {opportunities.map((o, i) => (
              <div
                key={i}
                className="bg-[#deeaf1] border-b border-[#b8cce4] p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {o.headline}:
                </strong>{" "}
                {o.explanation}
              </div>
            ))}
          </div>
        </div>

        {/* Threats */}
        <div>
          <div className="bg-[#4f81bd] text-white px-4 py-3 font-semibold text-center font-poppins">
            THREATS
          </div>
          <div className="border border-[#b8cce4]">
            {threats.map((t, i) => (
              <div
                key={i}
                className="bg-[#fff2cc] border-b border-[#b8cce4] p-3 text-[11px] font-poppins"
              >
                <strong>
                  {i + 1}. {t.headline}:
                </strong>{" "}
                {t.explanation}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhancements Tab for PTM
const PTMEnhancementsTab: React.FC = () => {
  const enhancementRoadmap =
    productData.extendedContent?.detailedRoadmap?.enhancementRoadmap || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Future Enhancement Roadmap (AI/MCP Layer)
        </h2>
      </div>
      <p className="text-[12px] text-[#2C2C2C]/60 italic font-medium font-poppins px-2">
        Future-state innovations only. AI/LLM features + MCP/automation
        features. High-impact rows highlighted.
      </p>

      {/* Enhancement Roadmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[10px] font-poppins">
          <thead>
            <tr className="bg-[#4f81bd] text-white font-semibold">
              <th className="border border-[#b8cce4] p-2 text-center">#</th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Module
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Feature Name
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Current Status
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Enhanced Version
              </th>
              <th className="border border-[#b8cce4] p-2 text-center">
                Integration Type
              </th>
            </tr>
          </thead>
          <tbody>
            {enhancementRoadmap.map((item, i) => (
              <tr
                key={i}
                className={
                  item.integrationType?.includes("AI")
                    ? "bg-[#d9e1f2]"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#F6F4EE]"
                }
              >
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#2C2C2C]">
                  {item.rowId || i + 1}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C] font-medium">
                  {item.module}
                </td>
                <td
                  className={`border border-[#b8cce4] p-2 ${item.integrationType?.includes("AI") ? "font-semibold text-[#1f3a5f]" : "text-[#2C2C2C]"}`}
                >
                  {item.featureName}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {item.currentStatus}
                </td>
                <td className="border border-[#b8cce4] p-2 text-[#2C2C2C]/80">
                  {item.enhancedVersion}
                </td>
                <td className="border border-[#b8cce4] p-2 text-center font-semibold text-[#DA7756]">
                  {item.integrationType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Assets Tab for PTM
const PTMAssetsTab: React.FC = () => {
  const assets = productData.assets || [];
  const credentials = productData.credentials || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1f3a5f] text-white border border-[#C4B89D] p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold font-poppins">
          PROJECT & TASK MANAGER - Assets & Credentials
        </h2>
      </div>

      {/* Assets Section */}
      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Sales & Marketing Assets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset, i) => (
            <a
              key={i}
              href={asset.url}
              className="flex items-center gap-3 p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D] hover:border-[#DA7756] hover:bg-[#DA7756]/5 transition-all"
            >
              <div className="p-2 bg-[#DA7756]/10 rounded-lg text-[#DA7756]">
                {asset.icon}
              </div>
              <div>
                <p className="font-medium text-[#2C2C2C] font-poppins">
                  {asset.title}
                </p>
                <p className="text-xs text-[#2C2C2C]/60 font-poppins">
                  {asset.type}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Credentials Section */}
      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Demo Credentials
        </h3>
        <div className="space-y-4">
          {credentials.map((cred, i) => (
            <div
              key={i}
              className="p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#DA7756]/10 rounded-lg text-[#DA7756]">
                  {cred.icon}
                </div>
                <p className="font-semibold text-[#2C2C2C] font-poppins">
                  {cred.title}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-[#2C2C2C]/60 font-poppins">URL: </span>
                  <a
                    href={cred.url}
                    className="text-[#DA7756] hover:underline font-poppins"
                  >
                    {cred.url}
                  </a>
                </div>
                <div>
                  <span className="text-[#2C2C2C]/60 font-poppins">ID: </span>
                  <span className="text-[#2C2C2C] font-medium font-poppins">
                    {cred.id}
                  </span>
                </div>
                <div>
                  <span className="text-[#2C2C2C]/60 font-poppins">
                    Password:{" "}
                  </span>
                  <span className="text-[#2C2C2C] font-medium font-poppins">
                    {cred.pass}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Owner */}
      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Product Owner
        </h3>
        <div className="flex items-center gap-4">
          {productData.ownerImage && (
            <img
              src={productData.ownerImage}
              alt={productData.owner}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#DA7756]"
            />
          )}
          <div>
            <p className="font-semibold text-[#2C2C2C] font-poppins">
              {productData.owner}
            </p>
            <p className="text-sm text-[#2C2C2C]/60 font-poppins">
              Product Owner - {productData.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== MAIN PTM PAGE COMPONENT ==============
const TaskManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const ptmTabsScrollRef = useRef<HTMLDivElement>(null);

  const tabOrder = productData.tabOrder;

  return (
    <div className="min-h-screen bg-[#F6F4EE] pb-20 select-none font-poppins transition-all duration-300">
      {/* Header */}
      <div className="relative mb-4 flex flex-col items-center bg-[#F6F4EE] pt-4">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-4">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-[#2C2C2C] border border-[#C4B89D]/50 px-3 py-1.5 rounded-full hover:bg-[#DA7756]/8 hover:border-[#DA7756]/30 hover:text-[#DA7756] transition-all font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
          <div className="inline-block px-4 py-1.5 bg-[#DA7756]/10 text-[#DA7756] text-[10px] font-semibold rounded-full mb-3 tracking-[0.15em] uppercase border border-[#DA7756]/20">
            {productData.industries}
          </div>
          <h1 className="text-4xl font-semibold text-[#2C2C2C] mb-4 tracking-tight lg:text-5xl font-poppins">
            {productData.name}
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            {productData.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          <div
            ref={ptmTabsScrollRef}
            className="overflow-x-auto no-scrollbar mb-8"
          >
            <div className="flex justify-start pb-2 px-1">
              <TabsList className="inline-flex gap-1 bg-[#F6F4EE] border-[1.31px] border-[#C4B89D] rounded-full p-1.5 h-auto items-center justify-start">
                {tabOrder.map((tabId) => (
                  <TabsTrigger
                    key={tabId}
                    value={tabId}
                    className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:font-semibold data-[state=inactive]:text-[#2C2C2C]/50 data-[state=inactive]:hover:text-[#DA7756]/70 whitespace-nowrap flex-shrink-0 bg-transparent"
                  >
                    {ptmTabLabels[tabId]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6 animate-fade-in">
            <PTMSummaryTab />
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6 animate-fade-in">
            <PTMFeaturesTab />
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-6 animate-fade-in">
            <PTMMarketTab />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6 animate-fade-in">
            <PTMPricingTab />
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="usecases" className="space-y-6 animate-fade-in">
            <PTMUseCasesTab />
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-12 animate-fade-in">
            <PTMRoadmapTab />
          </TabsContent>

          {/* Business Plan Tab */}
          <TabsContent value="business" className="space-y-10">
            <PTMBusinessPlanTab />
          </TabsContent>

          {/* GTM Tab */}
          <TabsContent value="gtm" className="space-y-6 animate-fade-in">
            <PTMGTMTab />
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6 animate-fade-in">
            <PTMMetricsTab />
          </TabsContent>

          {/* SWOT Tab */}
          <TabsContent value="swot" className="space-y-6 animate-fade-in">
            <PTMSWOTTab />
          </TabsContent>

          {/* Enhancements Tab */}
          <TabsContent
            value="enhancements"
            className="space-y-12 animate-fade-in"
          >
            <PTMEnhancementsTab />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-8">
            <PTMAssetsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskManagerPage;
