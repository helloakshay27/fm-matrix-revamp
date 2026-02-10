import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import {
  ArrowLeft,
  Monitor,
  FileText,
  Video,
  PlayCircle,
  Globe,
  Smartphone,
  Presentation,
  Camera,
  ShieldAlert,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface UserStory {
  title: string;
  items: string[];
}

interface Asset {
  type: string;
  title: string;
  url: string;
  icon: React.ReactNode;
}

interface Credential {
  title: string;
  url: string;
  id: string;
  pass: string;
  icon: React.ReactNode;
}

interface ProductInfo {
  name: string;
  description: string;
  brief: string;
  userStories: UserStory[];
  industries: string;
  usps: string[];
  includes: string[];
  upSelling: string[];
  integrations: string[];
  decisionMakers: string[];
  keyPoints: string[];
  roi: string[];
  assets: Asset[];
  credentials: Credential[];
  owner?: string;
  ownerImage?: string;
}

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId || "1";

  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [isBlurred, setIsBlurred] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [isDeviceDetected, setIsDeviceDetected] = useState(false);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("AI Model failed to load:", err);
      }
    };

    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraPermission("granted");
        loadModel();
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraPermission("denied");
      }
    };

    requestCamera();

    // AI Detection Loop
    let detectionInterval: ReturnType<typeof setInterval> | undefined;
    const currentVideo = videoRef.current;

    if (model && cameraPermission === "granted") {
      detectionInterval = setInterval(async () => {
        if (currentVideo && currentVideo.readyState === 4) {
          // Detect more objects with a lower confidence threshold for maximum safety
          const predictions = await model.detect(currentVideo, 12, 0.15);

          // 1. Check for person (must be clearly identified)
          const personPresent = predictions.some(
            (p) => p.class === "person" && p.score > 0.4
          );

          // 2. Identify forbidden objects (especially phones, but also any non-human objects)
          // We lower the threshold for phones specifically to catch them even in shadows
          const forbiddenLabels = [
            "cell phone",
            "camera",
            "laptop",
            "tv",
            "remote",
            "book",
            "bottle",
          ];
          const deviceDetected = predictions.some(
            (p) => forbiddenLabels.includes(p.class) && p.score > 0.18
          );

          // 3. General Anti-Object Rule: If anything else is detected near you, block it.
          const anyOtherObject = predictions.some(
            (p) => p.class !== "person" && p.score > 0.25
          );

          if (!personPresent || deviceDetected || anyOtherObject) {
            setIsDeviceDetected(true);
            setIsBlurred(true);
            // Hide information aggressively
            document.body.style.filter = "blur(100px)";
            document.body.style.transition = "filter 0.1s ease-in-out";
          } else {
            setIsDeviceDetected(false);
            document.body.style.filter = "none";
          }
        }
      }, 10); // Faster checks
    }

    // Prevent Screenshots & Screen Recording deterrents
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("Unauthorized: Data copying is disabled for security.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.key === "s" && e.metaKey && e.shiftKey) ||
        (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
        e.keyCode === 44
      ) {
        setShowBlackout(true);
        setIsBlurred(true);
        navigator.clipboard
          .writeText("SECURITY ALERT: Screenshot prohibited.")
          .catch(() => {});

        setTimeout(() => {
          alert(
            "Security Alert: Screen capture is strictly prohibited. This action has been logged."
          );
          setShowBlackout(false);
        }, 100);

        e.preventDefault();
        return false;
      }
    };

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyDown);
    document.addEventListener("copy", handleCopy as unknown as EventListener);
    document.addEventListener("cut", handleCopy as unknown as EventListener);

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyDown);
      document.removeEventListener(
        "copy",
        handleCopy as unknown as EventListener
      );
      document.removeEventListener(
        "cut",
        handleCopy as unknown as EventListener
      );
      if (currentVideo?.srcObject) {
        const stream = currentVideo.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [model, cameraPermission]);

  const allProductsData: { [key: string]: ProductInfo } = {
    "1": {
      name: "Loyalty (Post Sales to Post Possession)",
      description:
        "Loyalty serves from (Booking to Handover) journey of a customers in Real Estate and can be extended to Community/ society Management by integrating with Hi society.",
      brief:
        "A customer Lifecycle Management Mobile App being used by Real Estate Developers to manage their Customers across the Entire cycle from Booking to Handover and can be extended until Community Management.",
      userStories: [
        {
          title: "1. CRM",
          items: [
            "a. SSO user registration",
            "b. Gives a buyer complete details of their purchase across units with the developers",
            "c. Receive real time Demand notes, construction updates, etc",
            "d. Smart NCF form acceptance before registration",
            "e. Registration scheduling",
            "f. TDS Tutorials",
            "g. Rule Engine gamification for early collection & handedover",
          ],
        },
        {
          title: "2. Loyalty",
          items: [
            "a. Referral Sales",
            "b. Rule Engine gamification for Referral, site visit & booking",
            "c. Offers for existing customers for new purchase",
            "d. Redemption Market Place",
          ],
        },
        {
          title: "3. Post Possession",
          items: [
            "a. Club, Visitor & Helpdesk",
            "b. Referral & Marketing for new launches",
          ],
        },
      ],
      industries: "1. Real Estate Developers",
      usps: [
        "1. Experience of working with 20+ large Real Estate players in the market",
        "2. Integrated platform across the journey, eliminates the risk of multiple systems",
        "3. Data security as database is in Companies ownership",
        "4. Customized Look & feel as per own brand guidelines",
        "5. Product based approach makes the entry point lower and helps the companies avail the long term benefit of availing the new innovations at the subscription cost.",
      ],
      includes: ["1. White Labeled Mobile App", "2. CMS"],
      upSelling: [
        "1. Loyalty Rule Engine",
        "2. Redemption Market Place",
        "3. Appointments (Handover Scheduling)",
        "4. Hi Society (Community Management)",
      ],
      integrations: [
        "1. SFDC (CRM)",
        "2. SAP (ERP)",
        "3. Internal Upselling Modules (Loyalty Rule Engine, Redemption Market Place)",
        "4. Website",
        "5. Payment portals",
      ],
      decisionMakers: ["1. CRM", "2. Sales", "3. Loyalty", "4. IT"],
      keyPoints: [
        "1. Customization of Look & Feel",
        "2. Data security",
        "3. Partner experience",
        "4. Referral Journey & Payout",
      ],
      roi: [
        "1. 4 Sales/ year is all you need for the platform to be free",
        "2. Reduce CP cost by 50%",
        "3. Reduce support cost by 20%",
        "4. Make your customers your brand advocates",
      ],
      owner: "Kshitij Rasal",
      ownerImage: "/assets/product_owner/kshitij_rasal.jpeg",
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "https://docs.google.com/spreadsheets/d/1OKiPeGtxJrqmr6Eo6swvSjR0YMdQ3Qc6ASSYBW8Hn2Q/edit?gid=158265630#gid=158265630",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX (Link)",
          url: "https://www.figma.com/proto/OknmpA5Mbtklh2Idf75kXG/Kalpataru?page-id=0%3A1&node-id=2188-1927&viewport=-863%2C5209%2C0.17&t=oGwsVmrtuhylp4Hi-1&scaling=min-zoom&content-scaling=fixed",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager (Link)",
          url: "https://www.canva.com/design/DAGKb5frjWw/lVjVzJpdosLQE3KRY_FDjg/watch?utm_content=DAGKb5frjWw&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha02a3a6ce3",
          icon: <FileText className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Live Product CMS Login Credentials",
          url: "https://ui-kalpataru.lockated.com/login",
          id: "demo@lockated.com",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "Live Product App Login Credentials",
          url: "App Store / Play Store",
          id: "9987676203",
          pass: "999999 (OTP)",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
    },
    "2": {
      name: "Hi Society (Society Community Management)",
      description:
        "Lockated is an integrated Residential Property management Solution which manages all aspects of a residential property.",
      brief:
        "The White Label Residential App is a mobile-based solution designed for residents living in gated communities. It helps manage helpdesk, club, fitout, digital documents, security, and communication.",
      userStories: [
        {
          title: "1. Helpdesk",
          items: [
            "1. Resident Raises a Complaint",
            "2. Select Issue Category",
            "3. Track Complaint Status",
            "4. Management Views & Assigns Complaints",
            "5. Analytics for Management",
          ],
        },
        {
          title: "2. Communications",
          items: [
            "1. Community Announcements",
            "2. Targeted Communication & Push Notifications",
            "3. Poll Creation & Voting",
            "4. Emergency Alerts",
          ],
        },
        {
          title: "3. Visitor & Staff",
          items: [
            "1. Pre-Registration & Digital Invitation",
            "2. OTP/QR Code Access",
            "3. Visitor History & Notification of Arrival",
            "4. Exit Logging",
          ],
        },
        {
          title: "4. Key Modules",
          items: [
            "Digital Safe, Parking Management, Club Management, Fitout Management, Accounting Management, F&B Management",
          ],
        },
      ],
      industries: "1. Real Estate Developers, 2. RWAs",
      usps: [
        "1. Fully Customizable Branding (Logo, Colors, Themes)",
        "2. End-to-End Community Management (Consolidates multiple tools)",
        "3. Analytics & Insights for management data-driven decisions",
        "4. Seamless Payment & Billing Integration (Maintenance, Guest charges)",
        "5. White-Label Advantage (No third-party branding)",
      ],
      includes: ["1. White Labeled Mobile App", "2. Community Management CMS"],
      upSelling: ["1. Loyalty wallet"],
      integrations: ["1. SFDC (CRM)", "2. SAP (ERP)"],
      decisionMakers: ["1. Developers", "2. RWA", "3. IT/Digital Teams"],
      keyPoints: [
        "1. Customization & Branding",
        "2. Cost & ROI",
        "3. Security & Compliance",
        "4. Resident Engagement",
      ],
      roi: [
        "1. Operational Efficiency (Automates visitor/maintenance/billing)",
        "2. Revenue Generation (Monetize facilities, vendor partnerships)",
        "3. Resident Retention (Convenience, higher satisfaction)",
        "4. Risk Management (Digital logs, smart access)",
      ],
      assets: [
        {
          type: "Link",
          title: "Demo Video Link",
          url: "https://rb.gy/iuymv",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Lockated Web URL Login",
          url: "www.lockated.com/login",
          id: "godrejliving@lockated.com",
          pass: "Godrej@4321",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "Godrej Living App Login (Android)",
          url: "https://rb.gy/qq45q",
          id: "godrejliving@lockated.com",
          pass: "Godrej@4321",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Deepak Gupta",
    },
    "3": {
      name: "Snag 360",
      description:
        "Snag 360 is a Mobile based QC Application specially designed and developed for the Real Estate industry. Its objective is to deliver a zero defect product to the End consumer.",
      brief:
        "Ensures reduction in follow up on complaints from customers. Dynamic Workflow Management validates checkpoints across functions before final delivery.",
      userStories: [
        {
          title: "Roles",
          items: [
            "Inspector: Raises and closes Snags",
            "Reviewer: Repair work on Snags",
            "Repairer: Verifying work (Supervisor)",
            "Management: Oversees activity and quality",
          ],
        },
      ],
      industries: "1. Real Estate Developer, 2. FM Company",
      usps: [
        "1. Photo Annotation + Multistage Configuration",
        "2. Real Time Dashboard and Stage Tracking",
        "3. Helps Save Time & Improve Productivity",
      ],
      includes: ["Standard QC Solution"],
      upSelling: ["Cleaning, Appointment, HOTO, Hi-Society, FM Matrix"],
      integrations: ["SFDC, SAP"],
      decisionMakers: ["Project Head, Quality Head, FM Head"],
      keyPoints: [
        "1. Real Time Visibility & Progress Tracking",
        "2. Time Saved & Enhanced Productivity",
        "3. Transparency & Accountability",
      ],
      roi: [
        "Strong ROI by reducing rework, inspection effort, and handover delays.",
      ],
      assets: [
        {
          type: "Link",
          title: "Presentation",
          url: "#",
          icon: <Presentation className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "#",
          id: "master@demo.com",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Sagar Singh",
      ownerImage: "/assets/product_owner/sagar_singh.jpeg",
    },
    "4": {
      name: "QC (Quality Control)",
      description:
        "A QC App is a mobile-based quality control solution designed for the real estate and construction industry to ensure defect-free execution.",
      brief:
        "Enables stage-wise inspections, standardized checklists, real-time issue tracking, and compliance monitoring to ensure construction work meets specifications.",
      userStories: [
        {
          title: "Process Workflow",
          items: [
            "Initiator: Initiating the work",
            "Inspector: Raising and closing Snags",
            "Reviewer: Repair work",
            "Repairer: Verifying work",
            "Management: Overseeing construction quality",
          ],
        },
      ],
      industries: "1. Real Estate Developer, 2. Contractor",
      usps: [
        "1. Digital QC & Snagging in One Unified Platform",
        "2. Configure Checklist & Stage Wise Work Flow",
        "3. Real Time Issue Tracking & Closure Monitoring",
      ],
      includes: ["Standard QC Package"],
      upSelling: ["Unit Snagging, Common Area, Cleaning, Appointment, HOTO"],
      integrations: ["SFDC, SAP"],
      decisionMakers: ["Developer, Contractor"],
      keyPoints: [
        "1. Real Time Visibility & Progress Tracking",
        "2. Ease of Adoption & Practical Utility",
        "3. Transparency & Collaboration",
      ],
      roi: ["Strong ROI by reducing rework and inspection effort."],
      assets: [
        {
          type: "Link",
          title: "Presentation",
          url: "#",
          icon: <Presentation className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "#",
          id: "qc@admin.com",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Sagar Singh",
    },
    "5": {
      name: "RHB (Rajasthan Housing Board Monitoring)",
      description:
        "Sajag helps the entire RHB team to track the progress of all their projects in Rajasthan at the click of a button.",
      brief:
        "Periodically monitor project progress, quality, and financials across multiple locations. Provides a mobile-based real-time tool for updates and reporting.",
      userStories: [
        {
          title: "Tracking Points",
          items: [
            "1. Completion Time & Financials",
            "2. QC Reports & Inspections",
            "3. Hindrances & ATR Status",
            "4. Periodic Project Progress Monitoring",
          ],
        },
        {
          title: "Submission Types",
          items: [
            "QC Proforma, RE Inspection, TPI Proforma, Financial Proforma, Image Uploads",
          ],
        },
      ],
      industries: "Government Entities",
      usps: [
        "1. Real Time Visibility & Progress Tracking",
        "2. Time Saved & Enhanced Productivity",
        "3. Ease of Adoption",
      ],
      includes: ["Standard Monitoring System"],
      upSelling: ["Snag 360, Community App"],
      integrations: ["N.A"],
      decisionMakers: ["Housing Commissioner, Chief Engineer"],
      keyPoints: [
        "1. Transparency & Accountability",
        "2. Real Time Visibility",
        "3. Documented Progress",
      ],
      roi: [
        "Documented progress and smooth operation leading to cost-effectiveness.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "#",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video Link",
          url: "NA",
          icon: <Video className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "WEB Login",
          url: "#",
          id: "7303434567",
          pass: "11111 (OTP)",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Sagar Singh",
    },
    "6": {
      name: "Brokers (CP Management)",
      description:
        "A Channel Partner Lifecycle Management mobile app used by Real Estate Developers to manage Channel Partners end-to-end.",
      brief:
        "A mobile-based solution for CP onboarding, project access, lead submission, booking conversion, and brokerage tracking.",
      userStories: [
        {
          title: "Core Modules",
          items: [
            "1. Authentication and Profile",
            "2. Dashboard & Performance Tracking",
            "3. Lead Management & Follow-ups",
            "4. Referrals & Network Management",
            "5. Content Management System (CMS)",
          ],
        },
      ],
      industries:
        "1. Real Estate Channel Partners, 2. CP Agencies, 3. Developer Sales/Marketing, 4. Referral Partners",
      usps: [
        "1. End-to-End Sales Enablement",
        "2. Real-Time Lead Allocation & Tracking",
        "3. Transparent Commission & Payout System",
        "4. Rule-Based Incentive Engine",
        "5. Project & Inventory Intelligence",
        "6. Mobile-First Productivity",
        "7. Developer + CP Alignment Platform",
        "8. Zero Manual Dependency",
      ],
      includes: ["1. White labeled application", "2. CMS"],
      upSelling: ["NA"],
      integrations: ["1. CRM", "2. Internal CMS"],
      decisionMakers: ["1. CRM Head", "2. Sales Head"],
      keyPoints: [
        "1. Customisation of Look & Feel",
        "2. Data security",
        "3. Partner experience",
      ],
      roi: [
        "1. Revenue Growth",
        "2. Cost Reduction",
        "3. Productivity",
        "4. Data & Control",
        "5. Brand & Relationship",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "https://www.figma.com/proto/HN9KNLtzbOSJwlsJGc7tqA/Runwal-Channel-Partner-App?page-id=268%3A287&node-id=285-290&viewport=129%2C99%2C0.18&t=oZepFU857NFXXhe6-1&scaling=scale-down-width&content-scaling=fixed",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX",
          url: "https://www.figma.com/proto/HN9KNLtzbOSJwlsJGc7tqA/Runwal-Channel-Partner-App?page-id=2329%3A3776&node-id=2329-3987&viewport=-7953%2C-669%2C0.29&t=wlmSW1W3vVwNjeHC-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2329%3A3791&show-proto-sidebar=1",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo",
          url: "https://www.figma.com/proto/HN9KNLtzbOSJwlsJGc7tqA/Runwal-Channel-Partner-App?page-id=2329%3A3776&node-id=2329-11719&viewport=-5234%2C-343%2C0.2&t=PQMNNGyyqZEEtVRE-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2329%3A3791",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video Link",
          url: "NA",
          icon: <Video className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "App Login (Permanent)",
          url: "App Store / Play Store",
          id: "permanent1@gmail.com",
          pass: "Test@1234",
          icon: <Smartphone className="w-5 h-5" />,
        },
        {
          title: "App Login (Temp)",
          url: "App Store / Play Store",
          id: "temp1@gmail.com",
          pass: "Test@1234",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Kshitij Rasal",
    },
    "7": {
      name: "FM Matrix",
      description:
        "FM Matrix is a unified Facility Management platform that digitizes and manages Maintenance, Security, Safety, Procurement, and community operations in one system.",
      brief:
        "Unified platform providing real-time visibility, automated workflows, MIS dashboards, and seamless integrations to improve operational efficiency, compliance, and customer experience.",
      userStories: [
        {
          title: "Facility Manager (Operations Control)",
          items: [
            "1. Manage assets, maintenance, tickets, and vendors from a single platform.",
            "2. Real-time dashboards and MIS to track performance, compliance, and costs.",
            "3. Preventive maintenance schedules and AMC tracking to reduce breakdowns.",
          ],
        },
        {
          title: "Operations Head / Admin (Governance)",
          items: [
            "1. Configurable workflows for tasks, tickets, audits, and PTW (Permit to Work).",
            "2. Visual layouts (parking, spaces, assets) for quick and intuitive monitoring.",
            "3. Vendor performance and SLA tracking to maintain service quality.",
          ],
        },
        {
          title: "Technician / Supervisor (Field Execution)",
          items: [
            "1. Mobile checklists and task assignments for efficient on-site execution.",
            "2. Real-time verification of tasks, audits, and incidents for compliance.",
            "3. Offline capability to ensure work is not disrupted in low-network areas.",
          ],
        },
        {
          title: "Finance & Procurement",
          items: [
            "1. End-to-end visibility from PR to PO, GRN, invoice, and budgeting.",
            "2. Inventory and vendor data linked to maintenance for optimized purchasing.",
            "3. Site-wise and cost center-wise expense tracking for budget enforcement.",
          ],
        },
        {
          title: "Safety & Compliance Officer",
          items: [
            "1. Digital PTW, incident reporting, and safety checklists.",
            "2. Audit trails and document repositories for statutory and internal audits.",
            "3. Emergency preparedness checklists for effective incident response.",
          ],
        },
        {
          title: "CXO / Management (Strategic Oversight)",
          items: [
            "1. Single dashboard showing operational, financial, and compliance health.",
            "2. Data-driven insights and trends for planning improvements and investments.",
            "3. Scalable and standardized processes for enterprise-wide rollout.",
          ],
        },
      ],
      industries:
        "Commercial RE, Corporate Offices, Retail & Malls, Educational Institutes, Manufacturing, Hospitality, Data Centers, Logistics, Banking & Finance, Telecom.",
      usps: [
        "1. Unified FM + Business Operations Platform (All-in-one system).",
        "2. Industry-Aware & Module-Based Architecture (Highly adaptable).",
        "3. End-to-End Operational & Financial Control (Request to Invoice).",
        "4. Visual, Data-Driven Execution (Floor layouts & color tagging).",
        "5. Field-to-Management Connectivity (Mobile-first for all roles).",
      ],
      includes: [
        "Real-time dashboards, MIS & reports",
        "Mobile app, role-based access & integrations",
        "Alerts & Reminders (SMS, Email, App Notification)",
      ],
      upSelling: [
        "Snag 360, Visitor Management, Cloud Telephony, HOTO, Gophygital, Loyalty, WhiteLabel, Lease Management",
      ],
      integrations: [
        "Sap Hana, ID Cube, Salesforce, Active Directory/SSO, XOXO, MyHQ, Gupsup, CCavenue, Immense, Kalera",
      ],
      decisionMakers: ["Admin, Procurement, IT, Management"],
      keyPoints: [
        "1. Single View of Enterprise Operations",
        "2. Measurable Cost Reduction & ROI (OPEX optimization)",
        "3. Risk & Compliance Assurance (Built-in PTW & Audit trails)",
        "4. Scalability & Lower Total Cost of Ownership (TCO)",
        "5. Future-Ready Digital Foundation",
      ],
      roi: [
        "Commercial: Operational optimization, extended asset life, improved productivity, tenant-wise visibility.",
        "Warehouse: Equipment lifecycle extension, manpower throughput, safety compliance, reduced downtime.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "https://docs.google.com/spreadsheets/d/1KRjm22UqjFqvJuAwmzcxydzQIPIgNcWDY5Xdt--1Ngw/edit?gid=1521600348#gid=1521600348",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation Folder",
          url: "https://drive.google.com/drive/folders/1sXhg_s0tRaKT4kihtX_cKZ8PEG6gdRDh?usp=sharing_eil&ts=6954b64c&sh=_R2GZHDMzBhNhZYs&ca=1",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Videos Folder",
          url: "https://drive.google.com/drive/folders/1sXhg_s0tRaKT4kihtX_cKZ8PEG6gdRDh?usp=sharing_eil&ts=6954b64c&sh=_R2GZHDMzBhNhZYs&ca=1",
          icon: <Video className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo: Maintenance",
          url: "https://app.supademo.com/showcase/cmceeoigd01agrp0i8t2c5z2y?utm_source=link",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo: Finance",
          url: "https://app.supademo.com/showcase/cmceekzlm01a8rp0ikp7xesgm?utm_source=link",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo: Utility",
          url: "https://app.supademo.com/showcase/cmcedg8gn016ksa0iw09pltlm?utm_source=link",
          icon: <Monitor className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login (New UI)",
          url: "https://Web.gophygital.work",
          id: "Psipl@gophygital.work",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "App Login (Android/iOS)",
          url: "Mobile Store",
          id: "psipl@gophygital.work",
          pass: "123456",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Abdul Ghaffar",
    },
    "8": {
      name: "GoPhygital.work (Corporate)",
      description:
        "GoPhygital.work is a unified digital workplace platform designed to seamlessly bridge physical and digital operations for modern enterprises.",
      brief:
        "A modular and scalable digital workplace ecosystem empowering organizations to manage employees, assets, access, and compliance from a single secure platform accessible anytime, anywhere.",
      userStories: [
        {
          title: "Employee (Self-Service & Experience)",
          items: [
            "1. Reserve meeting rooms or desks from mobile app for planned workspace usage.",
            "2. Check in visitors quickly and securely for seamless guest office entry.",
            "3. Access announcements, internal chat, and wellness resources in a single app.",
          ],
        },
        {
          title: "Facility / Building Manager (Operational Control)",
          items: [
            "1. Track assets, inventories, and utility meters centrally to optimize cost.",
            "2. Use digital checklists and automated workflows for consistent compliance tasks.",
          ],
        },
        {
          title: "Administrator / Enterprise (Governance)",
          items: [
            "1. Manage user roles and permissions globally to enforce security.",
            "2. Access dashboards with analytics on workspace usage and attendance for data-driven decisions.",
          ],
        },
      ],
      industries:
        "Large Enterprises, IT Technology Firms, Co-working Providers, CRE & Facility Management, Retail, Healthcare, Manufacturing.",
      usps: [
        "1. True End-to-End Digital Workplace (Identity to Facilities).",
        "2. Modular Yet Unified Architecture (Scale as you grow).",
        "3. Mobile-First Adoption at Scale (Intuitive iOS & Android apps).",
        "4. Built for Physical + Digital Operations (Visitors, Safety, Audits).",
        "5. Enterprise-Grade Control with Consumer-Grade Experience.",
      ],
      includes: [
        "Mobile apps (Android & iOS) for employees",
        "Book Seat & Facility (Desks, Rooms, Shared spaces)",
        "Safety, Security & Compliance (MSafe, Visitors)",
        "Mobility & Transport (Parking, Fleet, Routes)",
        "Real-time Analytics Dashboards",
      ],
      upSelling: [
        "Hybrid/On-site workflow suite, Engagement tools (Intranet/Social), Gophygital + FM Matrix, Quikgate integration.",
      ],
      integrations: [
        "Sap Hana, ID Cube, Salesforce, Active Directory/SSO, XOXO, Gupshup, Immense, Kaleyra.",
      ],
      decisionMakers: ["Admin, HR, Procurement, IT, Management"],
      keyPoints: [
        "1. All-in-One Digital Workplace (Consolidated platform).",
        "2. Proven ROI & Cost Savings (Operational efficiency).",
        "3. Productivity & Experience Boost (Mobile self-service).",
        "4. Built-in Safety & Compliance (Governance & Audit trails).",
      ],
      roi: [
        "1. 15–30% reduction in operational costs.",
        "2. 20–40% improvement in workforce productivity.",
        "3. Significant reduction in compliance and audit risks.",
        "4. Higher employee satisfaction and retention.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "https://docs.google.com/spreadsheets/d/1DAMXI3uMsHGcbDcY6w-BiW1blEnECXNpwnrgKWkuh2g/edit?usp=sharing",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "https://drive.google.com/file/d/1Ls-tmZg5VcoBTFYVdSNzY5AOVpyrtvvK/view?usp=sharing",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Videos Folder",
          url: "https://app.supademo.com/share/folder/cmbbsgoih00tr2g0i53ua4omv",
          icon: <Video className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo Link",
          url: "https://drive.google.com/file/d/1EV4yukmn_UO2NQmPGvNro4-SN3weLUvo/view?usp=sharing",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA / UX (Coming Soon)",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login (Super Admin)",
          url: "https://web.gophygital.work/login",
          id: "techsupportgp@lockated.com",
          pass: "1123456",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "App Login (Occupant)",
          url: "App Store / Play Store",
          id: "Sohail.a@gophygital.work",
          pass: "123456",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Sohail Ansari",
    },
    "9": {
      name: "GoPhygital.work (Co working Space)",
      description:
        "A unified tenant experience platform designed to bridge the gap between physical workspace operations and digital community engagement.",
      brief:
        "Built specifically for coworking spaces, it automates friction points like desk booking and visitor entry while fostering a connected community. Empowers operators to monetize space efficiently.",
      userStories: [
        {
          title: "Meeting Room & Hot Desk Booking",
          items: [
            "1. Real-time availability view for meeting rooms to avoid booking conflicts.",
            "2. Scan-to-Book QR feature for instant daily Hot Desk security.",
            "3. Multi-tier membership credit management for correct usage monetization.",
          ],
        },
        {
          title: "Ticket (Helpdesk)",
          items: [
            "1. Raise support tickets with photo attachments for clear issue communication.",
            "2. Real-time push notifications for status updates (e.g., 'Resolved').",
            "3. Admin dashboard for efficient ticket viewing and staff assignment.",
          ],
        },
        {
          title: "Visitor Management",
          items: [
            "1. Digital pre-invitation/QR entry passes for seamless guest arrival.",
            "2. Instant check-in notifications for members when guests arrive.",
            "3. Reception-based QR scanning for secure and efficient check-in.",
          ],
        },
        {
          title: "Mail Room & Community",
          items: [
            "1. Automatic member notification for arrived packages via label scanning.",
            "2. Community feed for networking, introductions, and 'Help Needed' requests.",
            "3. Admin capability to pin critical community announcements.",
          ],
        },
      ],
      industries: "Coworking Space, Corporate Offices.",
      usps: [
        "1. All-in-One Workspace Platform (Spaces, Bookings, Services, Parking).",
        "2. Real-Time Space Utilization (Live visibility into occupancy).",
        "3. Seamless Member Experience (Self-service digital access).",
        "4. Cost & Operations Optimization (Preventive maintenance & utility monitoring).",
        "5. Scalable Multi-Location Management (Standardized operations).",
      ],
      includes: [
        "Real-time dashboards, MIS & reports",
        "Mobile app, role-based access & integrations",
        "Alerts & Reminders (Sms, Email, App Notification)",
      ],
      upSelling: ["FM Matrix, Visitor management, Loyalty"],
      integrations: ["CC Avenue, Cisco Meraki, Access Card, My Hq, Zoho Book"],
      decisionMakers: ["Admin, IT, Management"],
      keyPoints: [
        "1. Operational Efficiency (One platform for everything).",
        "2. Revenue & Space Optimization (Maximize utilization).",
        "3. Scalability (Grow multi-location without overhead).",
        "4. Visibility & Control (Real-time leadership dashboards).",
      ],
      roi: [
        "1. Optimized Space Utilization (Higher revenue per sqft).",
        "2. Operational Cost Control (Reduced leakage & manual overhead).",
        "3. Enhanced Member Experience (Higher retention).",
        "4. Improved Staff Productivity (Automated workflows).",
      ],
      assets: [
        {
          type: "Link",
          title: "IA/ UX (Figma)",
          url: "https://www.figma.com/design/uRLSIapEv2vE8yYnNoRJ5N/UrbanWrk-White-Labelling?node-id=5615-4995&t=eLxGL5TFnTP6F65C-1",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "https://web.gophygital.work",
          id: "abdul.ghaffar@lockated.com",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "App Download / Login",
          url: "https://cloud.lockated.com/index.php/s/JxcGLyw74Xcy5fM",
          id: "Abdul.ghaffar@lockated.com",
          pass: "123456",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Abdul Ghaffar",
    },
    "10": {
      name: "Project and Task Manager",
      description:
        "Project and Task Manager is an end-to-end work management solution designed to help teams plan, track, and execute projects efficiently. It centralizes tasks, timelines, ownership, and progress tracking into a single platform.",
      brief:
        "A centralized platform enabling transparency, accountability, and faster delivery across teams by managing work efficiently from planning to execution.",
      userStories: [
        {
          title: "Project Management & Delivery",
          items: [
            "1. Create projects with tasks, milestones, and deadlines for easy progress tracking.",
            "2. High-level dashboards and reports for stakeholders to monitor delivery without micro-managing.",
            "3. Real-time visibility into task status and blockers for team leads to take corrective action early.",
          ],
        },
        {
          title: "Team Productivity",
          items: [
            "1. Personalized task views for team members to manage daily work and priorities efficiently.",
            "2. Collaboration through comments, mentions, and file attachments on specific tasks.",
            "3. Progress updates (To Do / In Progress / Done) for transparent team coordination.",
          ],
        },
        {
          title: "Administration & Security",
          items: [
            "1. Manage users, roles, and permissions to maintain data security and operational control.",
            "2. Detailed activity logs and audit trails for accountability across the project lifecycle.",
          ],
        },
      ],
      industries: "All (Generic Work Management)",
      usps: [
        "1. Simple, intuitive UI with minimal learning curve.",
        "2. Real-time visibility across projects and teams.",
        "3. Highly configurable workflows without heavy customization.",
        "4. Scales from small teams to enterprise use cases.",
        "5. Cost-effective compared to heavyweight PM tools.",
      ],
      includes: [
        "Project & task creation",
        "Task assignment, priorities, and due dates",
        "Status tracking, comments, and mentions",
        "Activity logs and audit trail",
        "Basic dashboards and reports",
        "Role-based access control",
      ],
      upSelling: [
        "Advanced analytics & custom reports, Workflow automation, Mobile app access, Time tracking & AI prioritization.",
      ],
      integrations: [
        "Google/Outlook Calendar, Jira, GitHub/GitLab, Zoom/Meet, HRMS & Accounting tools.",
      ],
      decisionMakers: [
        "Head of Engineering/Operations, PMOs, Founders, CFO, COO",
      ],
      keyPoints: [
        "1. Ease of use & Fast onboarding.",
        "2. Visibility & control over delivery timelines.",
        "3. Team productivity improvement through transparency.",
        "4. Integration readiness & Scalability.",
      ],
      roi: [
        "1. Reduced project delays & improved on-time delivery.",
        "2. Higher team productivity & lower coordination overhead.",
        "3. Reduced dependency on spreadsheets.",
        "4. Faster, data-driven decision-making.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "NA",
          id: "NA",
          pass: "NA",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Sadanand Gupta",
    },
    "11": {
      name: "Vendor Management",
      description:
        "End-to-end Vendor Management solution covering the complete vendor lifecycle from onboarding, KYC, empanelment, contract management, and compliance tracking to performance evaluation.",
      brief:
        "Complete vendor lifecycle management, including onboarding, KYC, empanelment, contract administration, compliance monitoring, performance assessment, and payment processing.",
      userStories: [
        {
          title: "Initiator / Admin",
          items: [
            "1. Send vendor invitations by capturing GST, PAN, contact details, mobile number, and email.",
            "2. Track vendor invitation status for efficient follow-ups and escalations.",
            "3. Initiate Re-KYC requests to ensure vendor data remains current and compliant.",
          ],
        },
        {
          title: "Vendor (Self-Service Registration)",
          items: [
            "1. Securely start registration via invitation link received on email.",
            "2. Submit comprehensive form (Bank, MSME, Turnover, Statutory docs) without manual intervention.",
            "3. Save, edit, and update profile for Re-KYC ensuring active compliance status.",
          ],
        },
        {
          title: "Approver & System Validation",
          items: [
            "1. Review registration details (Bank, MSME, Statutory docs) for compliant onboarding.",
            "2. Automated validation of GST, PAN, and Bank details to avoid duplicates.",
            "3. Automated notifications for invitations, approvals, and Re-KYC requests.",
          ],
        },
      ],
      industries:
        "Real Estate, Corporate Offices, Retail, Manufacturing, Government, Telecom, Contractors.",
      usps: [
        "1. End-to-End Vendor Lifecycle (Onboarding to Payment).",
        "2. Eliminates dependency on multiple systems and manual tracking.",
        "3. Supports role-based, multi-level approvals.",
        "4. Automated GST/PAN/Bank validation.",
      ],
      includes: [
        "Vendor Onboarding & Master Data",
        "Vendor Performance Management",
        "Vendor Self-Service Portal",
        "Reports & Dashboards",
      ],
      upSelling: ["Loyalty Rule Engine", "ERP Integration"],
      integrations: ["SAP", "Salesforce (SFDC)"],
      decisionMakers: [
        "Procurement Head",
        "Accounts Payable Team",
        "Vendor Relationship Managers",
      ],
      keyPoints: [
        "1. Real-Time Vendor Performance Scoring.",
        "2. Configurable Workflows & Multi-level Approvals.",
        "3. Built-in Compliance & Re-KYC Management.",
      ],
      roi: [
        "1. Reduced manual overhead in onboarding.",
        "2. Improved statutory compliance & audit readiness.",
        "3. Better vendor selection via performance scoring.",
      ],
      assets: [
        {
          type: "Link",
          title: "Product Portfolio (Feature List/Presentation/One Pager)",
          url: "https://cloud.lockated.com/index.php/apps/files/files/148140?dir=/Lockated%20Product%20Portfolio/Vendor%20Management",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video & Interactive Demo",
          url: "https://app.supademo.com/showcase/cmb53n9t60158zi0ixtn1flw2?utm_source=link&demo=1&step=1",
          icon: <Video className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA / UX (Under Revamp)",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Vendor Portal Login",
          url: "https://vendors.lockated.com/users/sign_in",
          id: "aslockated@gmail.com",
          pass: "Welcome@123",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Ajay Ghenand",
    },
    "12": {
      name: "Procurement/Contracts",
      description:
        "Complete management of the procurement and contract lifecycle, including vendor onboarding, RFQ, bid comparison, negotiation, PO issuance, approvals, compliance, and performance monitoring.",
      brief:
        "Product enables seamless management of vendors, tenders, contracts, work orders, and material procurement, ensuring cost control, compliance, and transparency across projects.",
      userStories: [
        {
          title: "Site Operations (Indents & Raising)",
          items: [
            "1. Site Engineer: Create material indents with specifications, quantity, and timelines accurately.",
            "2. Approver: Visibility of indent details and justifications for informed approval decisions.",
            "3. Audit trails and history maintained for full accountability and compliance.",
          ],
        },
        {
          title: "MOR & Procurement (Bidding & Conversion)",
          items: [
            "1. Create RFQs against approved indents to invite competitive vendor quotations.",
            "2. Side-by-side comparison of vendor bids for data-driven procurement decisions.",
            "3. Recommend winning vendors and convert RFQs into Purchase Orders seamlessly.",
          ],
        },
        {
          title: "Vendor Engagement (Participating & Fulfilling)",
          items: [
            "1. Receive RFQ notifications and submit quotations with terms and conditions digitally.",
            "2. Accept or reject POs digitally for clear, documented order confirmation.",
            "3. Real-time visibility of delivery schedules and quantities for accurate supply.",
          ],
        },
        {
          title: "Inventory & Warehouse (Verification & Updates)",
          items: [
            "1. Security: Create gate entries against POs to trace authorized material movement.",
            "2. Store: Create GRN against PO and gate entry to accurately record received materials.",
            "3. Automatic stock updates after GRN for real-time accurate inventory levels.",
          ],
        },
      ],
      industries: "Real Estate Developer, Manufacturing Plants",
      usps: [
        "1. End-To-End Process Integration (Indent to Payment).",
        "2. Real-Time Visibility & Reporting across all stages.",
        "3. Improved Operational Efficiency & Transparency.",
        "4. Reduces dependency on individuals through automated workflows.",
      ],
      includes: [
        "Indent / Purchase Requisition Management",
        "RFQ / Tender Management",
        "Procurement / Purchase Management",
        "Inventory & Warehouse Management",
      ],
      upSelling: ["Loyalty Rule Engine", "Vendor Management"],
      integrations: ["SAP", "Salesforce (SFDC)", "Web"],
      decisionMakers: ["Procurement Head, Contractors, Real estate developer"],
      keyPoints: [
        "1. Time Saved & Enhanced Productivity.",
        "2. User-friendly interface with role-based access.",
        "3. Transparency, Accountability & Collaboration.",
      ],
      roi: [
        "1. Direct cost savings via bid comparison.",
        "2. Reduced turnaround time for procurement.",
        "3. Minimal data entry errors via seamless conversion.",
      ],
      assets: [
        {
          type: "Link",
          title: "Product Portfolio (Feature List / IA / One Pager)",
          url: "https://cloud.lockated.com/index.php/apps/files/files/148141?dir=/Lockated%20Product%20Portfolio/Procurement%20or%20Contracts",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "https://procurement.lockated.com/",
          id: "aslockated@gmail.com",
          pass: "Welcome@123",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Mangal Sahu",
    },
    "13": {
      name: "Loyalty Engine",
      description:
        "A Loyalty Rule Engine is a configurable system designed to automatically apply loyalty rewards, points, or benefits to users based on predefined business rules, without requiring code changes.",
      brief:
        "Evaluates user actions such as payments, referrals, app downloads, or bookings using common operatives (equals, greater than, etc.) to trigger automated rewards and logic.",
      userStories: [
        {
          title: "Core Rule Capabilities",
          items: [
            "1. Commission calculation based on performance rules.",
            "2. Incentive eligibility verification for partners and employees.",
            "3. Lead routing automation based on predefined logic.",
            "4. Partner tier upgrades triggered by achievement milestones.",
          ],
        },
        {
          title: "Operational Workflows",
          items: [
            "1. Access control logic for feature gating.",
            "2. Campaign targeting based on user behavior and segment rules.",
            "3. Automated approval workflows for internal processes.",
            "4. Penalty and risk rules for compliance monitoring.",
          ],
        },
      ],
      industries: "CRM, Referral & Loyalty Programs",
      usps: [
        "1. Automation of Complex Business Logic (No code required).",
        "2. High Flexibility and Scalability for evolving rules.",
        "3. Built-in Compliance & Risk Management.",
        "4. Enhanced Reporting & Real-time Analytics.",
      ],
      includes: ["Configurable Rule Engine Core"],
      upSelling: ["Loyalty (Wallet) App"],
      integrations: ["CRM Systems", "Store / POS Systems"],
      decisionMakers: ["Business, Sales, Finance, Operations, Legal"],
      keyPoints: [
        "1. Consistency in decision-making across the platform.",
        "2. Transparency and auditability of applied rules.",
        "3. Ability to adapt rules quickly to market changes.",
        "4. Enhanced stakeholder trust through data-driven logic.",
      ],
      roi: [
        "1. Reduced dependency on developers for rule changes.",
        "2. Improved accuracy in payouts and rewards.",
        "3. Faster time-to-market for new campaigns.",
        "4. Audit-ready logs for all logical decisions.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "NA",
          id: "NA",
          pass: "NA",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Duhita",
    },
    "14": {
      name: "MSafe",
      description:
        "MSafe is a Health, Safety & Wellbeing (HSW) compliance module in the Vi My Workspace app that helps users stay compliant with workplace safety requirements.",
      brief:
        "Enables stakeholders to monitor HSW Compliances, perform Key Risk Compliance checks (KRCC), and record engagement tours to ensure safety and prevent accidents.",
      userStories: [
        {
          title: "Compliance & Risk Management",
          items: [
            "1. Line Managers: Perform Key Risk Compliance checks (KRCC) for @risk population.",
            "2. Stakeholders: Monitor various HSW Compliances of their team members.",
            "3. Safety Teams: Ensure mandatory training records and Mode of Transport changes are tracked.",
          ],
        },
        {
          title: "Leadership Engagement",
          items: [
            "1. Senior Management: Record HSW engagement and observations during premises tours.",
            "2. Leadership: Drive safety culture through visible engagement and compliance health visibility.",
          ],
        },
        {
          title: "On-ground Safety",
          items: [
            "1. Personnel: Prevent accidents during high-risk tasks through systematic safety policies.",
            "2. Workforce: Receive real-time alerts for pending or failed compliance actions.",
          ],
        },
      ],
      industries:
        "Manufacturing, Construction, Oil & Gas, Mining, Logistics, Healthcare, Utilities, Aviation, FMCG.",
      usps: [
        "1. Centralized HSW Compliance Control (Track KRCC, tours, and trainings).",
        "2. Proactive Risk & Incident Prevention (Identify non-compliance early).",
        "3. Role-Based Safety Accountability (Clear demarcation of responsibilities).",
        "4. Leadership-Driven Safety Culture (Reinforces top-down commitment).",
        "5. Anytime, Anywhere Compliance Execution (Mobile-first on-ground checks).",
      ],
      includes: [
        "HSW compliance status visibility",
        "Real-time alerts for pending actions",
        "Access control based on compliance status",
        "Mandatory policy acknowledgement",
      ],
      upSelling: ["MSafe + PTW", "MSafe + Incident", "MSafe + Snag 360"],
      integrations: [
        "Sap Hana, ID Cube, Salesforce, Active Directory/SSO, XOXO, 1 Kosmos, Kaleyra, Gupshup",
      ],
      decisionMakers: [
        "HSW / EHS Head, Operations Head, IT Team, Senior Management",
      ],
      keyPoints: [
        "1. Criticality of HSW Compliance for @risk workforce.",
        "2. Regulatory & Audit Assurance with digital traceability.",
        "3. Operational Efficiency through automated safety workflows.",
        "4. Leadership Visibility & Governance across locations.",
      ],
      roi: [
        "1. Reduced incidents & downtime caused by accidents.",
        "2. Lower penalties, legal exposure, and insurance costs.",
        "3. Faster compliance audits via digital records.",
        "4. Stronger corporate responsibility posture.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "https://docs.google.com/spreadsheets/d/1DAMXI3uMsHGcbDcY6w-BiW1blEnECXNpwnrgKWkuh2g/edit?usp=sharing",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "https://docs.google.com/presentation/d/1czao4bZz-62VCGOXiWLk2HSF-y7OleEY/edit?usp=drive_link&ouid=110368399620616741760&rtpof=true&sd=true",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Interactive Demo",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "https://web.gophygital.work/login",
          id: "Vodafone@lockated.com",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "App Login (Vi My Workspace)",
          url: "App Store / Play Store",
          id: "testuser@vodafoneidea.com",
          pass: "123456",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Sohail Ansari",
    },
    "15": {
      name: "Incident Management",
      description:
        "The Incident Management product is a structured, end-to-end solution designed to help organizations effectively identify, report, investigate, and resolve incidents across facilities and operations.",
      brief:
        "Enables timely incident reporting with detailed context followed by systematic investigation, root cause analysis, and Corrective and Preventive Action (CAPA) tracking.",
      userStories: [
        {
          title: "Incident Reporting & Tracking",
          items: [
            "1. Reporting: Simple form for any employee to report incidents immediately with photos and context.",
            "2. Visibility: Track real-time status of reported incidents to ensure actions are taken.",
            "3. Supervisor View: Dashboard to prioritize critical cases and maintain a clear incident timeline.",
          ],
        },
        {
          title: "Investigation & Action Stage",
          items: [
            "1. Investigation: Review Injury/Property damage details and record findings for root cause analysis.",
            "2. Collaboration: Assign cross-functional committees for review and compliance requirements.",
            "3. CAPA: Define corrective actions to resolve immediate issues and preventive actions to avoid recurrence.",
          ],
        },
        {
          title: "Governance & Review",
          items: [
            "1. Closure: Senior management review and approval/rejection of closure after proper verification.",
            "2. Monitoring: Schedule follow-up tasks to verify compliance with defined CAPA protocols.",
            "3. Audit: Assess long-term safety improvements by linking task outcomes back to original incidents.",
          ],
        },
      ],
      industries:
        "Construction, Oil & Gas, Manufacturing, Real Estate, Mining, Warehousing, Healthcare, Power Plants.",
      usps: [
        "1. Schedule functionality for future audit of CAPA (Verification tasks).",
        "2. Integrated Corrective & Preventive Actions (Full lifecycle).",
        "3. Specialized Body Charts for injury tracking.",
        "4. Built-in Loss Time Injury Reporting (LTIR).",
      ],
      includes: [
        "Incident reporting forms with multimedia support",
        "Systematic investigation & Root Cause Analysis portal",
        "Corrective & Preventive Action (CAPA) tracking",
        "Multi-level approval workflows for closure",
        "Injury body charts & LTIR dashboards",
      ],
      upSelling: ["Operational Audit, HSE, PTW, Asset & Maintenance packages."],
      integrations: [
        "IVR Systems, Permit to Work (PTW), Asset & Maintenance Management, SMS/Email/App Notifications, ERP/Finance.",
      ],
      decisionMakers: [
        "EHS Head/Director, Operation Director, Project Manager, Safety Officer, Chief Safety Officer",
      ],
      keyPoints: [
        "1. Risk Reduction & Regulatory Compliance.",
        "2. Incident Reporting Accessibility for non-technical users.",
        "3. Management Visibility, Accountability & Control.",
        "4. Audit Readiness & Legal Defensibility.",
      ],
      roi: [
        "1. Lower downtime & operational losses.",
        "2. Reduced incident-related costs & penalties.",
        "3. Improved audit scores and compliance ratings.",
        "4. Optimized administrative costs through automation.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "https://fm-matrix.lockated.com",
          id: "abdul.ghaffar@lockated.com",
          pass: "123456",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "App Login",
          url: "FM Matrix Mobile App",
          id: "abdul.ghaffar@lockated.com",
          pass: "123456",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Shahab Anwar",
    },
    "16": {
      name: "Appointments",
      description:
        "The Appointment Module streamlines the unit handover process by enabling customers to book, reschedule, and confirm handover appointments digitally. It aligns buyers, site teams, and facility staff on a single schedule, reduces manual coordination, and ensures timely, well-organized handovers.",
      brief:
        "A digital solution that allows customers and site teams to schedule, manage, and property handover appointments, ensuring a smooth, timely, and well-coordinated possession process.",
      userStories: [
        {
          title: "Relationship Manager (RM)",
          items: [
            "1. Coordinate and complete the flat handover process efficiently.",
            "2. Ensure smooth transfer of the unit from the developer to the flat owner.",
            "3. Digital visit tracking and schedule management for multiple clients.",
          ],
        },
        {
          title: "Unit Owner / Buyer",
          items: [
            "1. Book, reschedule, and confirm handover appointments digitally via app.",
            "2. Receive automated notifications and reminders for scheduled visits.",
            "3. Access document readiness checks to ensure a hassle-free possession experience.",
          ],
        },
      ],
      industries: "Real Estate",
      usps: [
        "1. Hassle-Free Handover Scheduling.",
        "2. Optimized Time Slot Management.",
        "3. Automated Notification & Reminder.",
        "4. Single-Point Coordination.",
        "5. Faster & Organized Possession Process.",
      ],
      includes: [
        "White Label App support",
        "Time-slot management system",
        "Automated notifications & reminders",
        "Document readiness checks",
        "Digital visit tracking",
      ],
      upSelling: ["Snag 360"],
      integrations: ["SFDC", "SAP"],
      decisionMakers: ["Relationship Manager", "CRM Head"],
      keyPoints: [
        "1. Hassle-Free Handover Scheduling.",
        "2. Optimized Time Slot Management.",
        "3. Real-time alignment between buyers and site teams.",
        "4. Reduction in manual coordination overhead.",
      ],
      roi: [
        "1. Faster flat handovers with optimized resource utilization.",
        "2. Reduced scheduling conflicts and manual errors.",
        "3. Enhanced customer satisfaction through a professional possession experience.",
        "4. Timely handovers leading to reduced carrying costs.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "IA/ UX",
          url: "NA",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "NA",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "NA",
          id: "NA",
          pass: "NA",
          icon: <Globe className="w-5 h-5" />,
        },
      ],
      owner: "Sagar Singh",
    },
    "17": {
      name: "HSE App",
      description:
        "The HSE App is a unified digital solution that enhances workplace safety by streamlining the management of incidents, audits, checklists, observations, and safety violations.",
      brief:
        "Centralizing safety operations into a single platform that empowers employees, safety officers, and management to collaborate effectively, reduce response times, and identify risks proactively.",
      userStories: [
        {
          title: "Area Manager (Oversight & Governance)",
          items: [
            "1. Incident: View all reported incidents across sites to monitor and escalate safety issues.",
            "2. Audit & Checklist: Schedule audits and review completed reports to identify compliance gaps.",
            "3. Observation & Violation: Real-time tracking of safety violations with trend analytics for risk mitigation.",
          ],
        },
        {
          title: "Contractor (Execution & Reporting)",
          items: [
            "1. Incident: Report on-site incidents with photos and severity for immediate logging.",
            "2. Audit & Checklist: Complete assigned checklists digitally to ensure accurate, paperless records.",
            "3. Observation: Report and track status of safety observations and acknowledge assigned violations.",
          ],
        },
      ],
      industries:
        "Construction, Oil & Gas, Pharmaceutical, Real Estate, Warehousing, Healthcare, Power Plants, Mining.",
      usps: [
        "1. Unified Safety Platform (Incidents, Audits, Checklists, Observations in one).",
        "2. End-to-End Traceability (Link violations to corrective actions and audits).",
        "3. Mobile-First, On-Ground Ready (Image capture and updates in low-connectivity).",
        "4. Standardized Yet Flexible Workflows (Configurable approval hierarchies).",
        "5. Compliance & Audit Ready (Centralized recordkeeping and audit trails).",
      ],
      includes: [
        "Incident Management (Reporting, RCA, CAPA tracking)",
        "Audit & Checklist Management (Scheduling, Digital Completion)",
        "Observation & Safety Violation Tracking (Real-time tracking, Trends)",
        "Role-Based Access & Dashboards (Area Manager & Contractor flows)",
        "Analytics & Compliance Reporting (Trend analysis, Site-wise insights)",
      ],
      upSelling: [
        "Snag 360",
        "FM Help desk",
        "Project & Task",
        "Chat",
        "FM Patrolling",
      ],
      integrations: [
        "Access Control, PTW Systems, Asset Management, CCTV, DMS, BMS, ERP & Finance.",
      ],
      decisionMakers: [
        "Project Manager, Safety Officer, Operation Directors, EHS Director/Head",
      ],
      keyPoints: [
        "1. Enterprise safety risk reduction through unified oversight.",
        "2. Regulatory Compliance & Audit Readiness with digital evidence.",
        "3. Single Integrated Safety Platform eliminating fragmented tools.",
        "4. Enhanced Accountability & Ownership across role-based workflows.",
      ],
      roi: [
        "1. Reduced Incidents and Safety Risks via structured reporting.",
        "2. Lower Operational Downtime due to faster response times.",
        "3. Improved Audit Efficiency saving time and administrative costs.",
        "4. Data-Driven Safety Improvements optimizing safety spend.",
      ],
      assets: [
        {
          type: "Link",
          title: "Design (Figma)",
          url: "https://www.figma.com/design/o0KITKNatLLU6Djpbyh7ui/FM-Matrix?node-id=14349-6945&t=78Pnp8TGwFNAzNPR-1",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Prototype (Figma)",
          url: "https://www.figma.com/proto/o0KITKNatLLU6Djpbyh7ui/FM-Matrix?node-id=18262-10144&t=78Pnp8TGwFNAzNPR-1",
          icon: <Monitor className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "NA",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "NA",
          icon: <Presentation className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "App Login",
          url: "HSE App Store",
          id: "9326633098",
          pass: "9999 (OTP)",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Shahab Anwar",
    },
    "18": {
      name: "Club Management",
      description:
        "The Club Management Solution is a comprehensive digital platform designed to help commercial clubs efficiently manage bookings, memberships, and daily operations. Built for sports clubs, fitness centers, and social clubs, the solution streamlines administrative tasks and enhances member experience.",
      brief:
        "A unified digital solution enabling clubs to manage memberships, bookings, and payments through integrated web and mobile platforms. It automates club operations and supports self-service for members.",
      userStories: [
        {
          title: "Club Administrator",
          items: [
            "1. Membership Management: Centralized control over member records, tiers, and renewals.",
            "2. Revenue Control: Track payments, financial logs, and monetize premium services.",
            "3. Operational Insights: Use the analytics dashboard to track facility usage and activity patterns.",
          ],
        },
        {
          title: "Club Member",
          items: [
            "1. Self-Service Bookings: Book facility slots and event tickets directly via the mobile app.",
            "2. Digital Convenience: Make payments and request services without manual intervention.",
            "3. Engagement: Receive timely announcements and stay connected with community activities.",
          ],
        },
      ],
      industries:
        "Sports & Recreation, Fitness & Wellness, Social & Private Clubs",
      usps: [
        "1. White-Label & Brand Control (Full custom branding).",
        "2. True All-in-One Platform (Admin web + Member mobile).",
        "3. Dual Experience System (Seamless flow between admin and user).",
        "4. Flexible Membership & Pricing Engine (Tailored to club needs).",
      ],
      includes: [
        "White Labeled Mobile App",
        "Club Management Admin Web Portal",
        "Membership Lifecycle Management",
        "Digital Payments & Financial logs",
      ],
      upSelling: ["Residential and Commercial FM packages"],
      integrations: ["SFDC (CRM)", "SAP (ERP)"],
      decisionMakers: [
        "Real Estate Developers",
        "Property Management Companies",
      ],
      keyPoints: [
        "1. Membership & Booking Flexibility.",
        "2. Payments & Financial Control.",
        "3. Integration & Technology scalability.",
        "4. Business Fit & Use Case Coverage.",
      ],
      roi: [
        "1. Operational Efficiency: Reduced manual work and man-power costs.",
        "2. Revenue Generation: Monetization of premium services and vendor partnerships.",
        "3. Resident Retention: Higher satisfaction and community loyalty.",
        "4. Security: Digital visitor logs and smart access integration.",
        "5. Data-Driven Decisions: Better resource allocation through analytics.",
      ],
      assets: [
        {
          type: "Link",
          title: "Detailed Feature List",
          url: "https://docs.google.com/spreadsheets/d/1OKiPeGtxJrqmr6Eo6swvSjR0YMdQ3Qc6ASSYBW8Hn2Q/edit?gid=158265630#gid=158265630",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "One Pager",
          url: "https://rb.gy/iuymv",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Presentation",
          url: "https://rb.gy/iuymv",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          type: "Link",
          title: "Demo Video",
          url: "https://rb.gy/iuymv",
          icon: <PlayCircle className="w-5 h-5" />,
        },
      ],
      credentials: [
        {
          title: "Web Login",
          url: "https://recess-club.panchshil.com/club-management/membership/groups",
          id: "godrejliving@lockated.com",
          pass: "Godrej@4321",
          icon: <Globe className="w-5 h-5" />,
        },
        {
          title: "App Login (Godrej Living)",
          url: "https://rb.gy/qq45q",
          id: "godrejliving@lockated.com",
          pass: "Godrej@4321",
          icon: <Smartphone className="w-5 h-5" />,
        },
      ],
      owner: "Deepak Gupta",
    },
  };

  const productIds = Object.keys(allProductsData).sort(
    (a, b) => Number(a) - Number(b)
  );
  const currentIndex = productIds.indexOf(productId);
  const prevProductId = currentIndex > 0 ? productIds[currentIndex - 1] : null;
  const nextProductId =
    currentIndex < productIds.length - 1 ? productIds[currentIndex + 1] : null;

  const productData = allProductsData[productId] || allProductsData["1"];

  const teamMembers = [
    {
      name: productData.owner || "Team Lockated",
      role: "Product Owner",
      image:
        productData.ownerImage ||
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  const assets = productData.assets || [];
  const credentials = productData.credentials || [];

  if (isDeviceDetected || cameraPermission === "denied") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] p-10 text-center border border-zinc-800">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">
            Access Suspended
          </h1>

          <div className="space-y-4 mb-10 text-left">
            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
              <p className="text-red-400 text-xs font-bold uppercase mb-2">
                Security Violation Details:
              </p>
              <ul className="text-gray-400 text-xs space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>
                    <strong>AI Status:</strong> Authorized Human (Face) not
                    detected or obscured.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>
                    <strong>Object Detection:</strong> Unauthorized items
                    (Phone, Recording devices, or background objects) detected
                    in view.
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed italic text-center">
              Guideline: Ensure you are centered in frame with NO other objects
              visible. Content is visible ONLY when your face is recognized
              alone.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setIsDeviceDetected(false);
                setIsBlurred(false);
                document.body.style.filter = "none";
                // Re-trigger face check logic via state update or simple reload if preferred
                window.location.reload();
              }}
              className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest shadow-xl"
            >
              <Camera className="w-5 h-5" />
              Re-Verify Face Only
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-zinc-800 text-gray-400 font-bold py-4 rounded-2xl hover:bg-zinc-700 transition-colors uppercase text-sm tracking-widest"
            >
              Exit Secure Zone
            </button>
          </div>
          <div className="mt-10 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-center gap-2 text-red-500/50 mb-3">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Extreme Security Mode Active
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cameraPermission === "pending") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-500 italic">
            Initiating Secure Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-white p-6 lg:p-10 font-sans select-none relative transition-all duration-300 ${isBlurred ? "blur-2xl" : ""}`}
      style={
        {
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none",
        } as React.CSSProperties
      }
    >
      {/* Security Monitoring Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="fixed top-4 right-4 w-32 h-24 rounded-lg border-2 border-green-500 shadow-2xl object-cover z-50 opacity-40 pointer-events-none grayscale"
      />

      {/* Forensic Watermark */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.03] overflow-hidden flex flex-wrap gap-24 p-20 select-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="text-4xl font-black -rotate-45 whitespace-nowrap"
          >
            CONFIDENTIAL PROPERTY - DO NOT RECORD
          </div>
        ))}
      </div>

      {/* Extreme Blackout Overlay for PrtSc Tooling */}
      {showBlackout && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white p-10 text-center">
          <ShieldAlert className="w-20 h-20 text-red-500 mb-6 animate-bounce" />
          <h1 className="text-4xl font-black mb-4">
            SECURITY VIOLATION DETECTED
          </h1>
          <p className="text-xl">
            Screen capture is strictly prohibited. This attempt has been logged
            to the security server.
          </p>
        </div>
      )}
      {/* Header */}
      <div className="relative mb-12 flex flex-col items-center">
        <div className="w-full mb-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 px-3 py-1.5 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="text-center w-full max-w-5xl">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full mb-4 tracking-[0.2em] uppercase border border-blue-100 animate-fade-in">
            {productData.industries.split(",")[0].replace(/^\d+\.\s*/, "")}
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase lg:text-5xl">
            {productData.name}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mx-auto text-center font-medium italic opacity-80">
            {productData.description}
          </p>
        </div>
      </div>

      {/* Product Overview Section */}
      <section className="mb-12 border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-[#F8F6F1] px-6 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#D4CFBC]"></div>
          <h2 className="text-sm font-bold text-gray-800">Product Overview</h2>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Product Brief
              </h3>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                {productData.brief}
              </p>
            </div>

            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Product Description/ User Stories
              </h3>
              <div className="text-[11px] text-gray-700 leading-relaxed space-y-3">
                {productData.userStories.map((section, idx) => (
                  <div key={idx}>
                    <p className="font-semibold mb-1">{section.title}</p>
                    <ul className="pl-2 space-y-0.5">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Applicable TG Industries
              </h3>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                {productData.industries}
              </p>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                USP/Differentiators (1-5)
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.usps.map((usp, i) => (
                  <li key={i}>{usp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Inclusions
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.includes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Up Selling
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.upSelling.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Integrations
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.integrations.map((item, i) => (
                  <li key={i} className="whitespace-pre-wrap">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Decision Makers
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.decisionMakers.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Key points for Decision Making/ Purchase Decision
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.keyPoints.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                ROI
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.roi.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The People Section */}
      <section className="mb-12 border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-[#F8F6F1] px-6 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#D4CFBC]"></div>
          <h2 className="text-sm font-bold text-gray-800">
            Meet The People Behind The Product
          </h2>
        </div>
        <div className="p-8">
          <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 relative rounded-xl overflow-hidden group"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white text-sm font-bold">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 text-[10px]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Assets Section */}
      <section className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-[#F8F6F1] px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <h2 className="text-sm font-bold text-gray-800">Product Assets</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100 ml-2">
              <Lock className="w-3 h-3" />
              VIEW ONLY
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium italic">
            Downloads are strictly restricted per internal policy
          </span>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                  {asset.icon}
                </div>
                <span
                  className={`text-xs font-semibold underline cursor-pointer transition-colors ${
                    !asset.url || asset.url === "NA" || asset.url === "#"
                      ? "text-gray-400 hover:text-gray-300 pointer-events-none"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() =>
                    asset.url &&
                    asset.url !== "NA" &&
                    asset.url !== "#" &&
                    window.open(asset.url, "_blank")
                  }
                >
                  {asset.title}
                </span>
              </div>
            ))}

            {credentials.map((cred, index) => (
              <div
                key={`cred-${index}`}
                className="border border-gray-100 rounded-md p-4 flex gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600 h-fit">
                  {cred.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">
                    {cred.title}
                  </h4>
                  <div className="text-[10px] text-gray-500 space-y-0.5">
                    <p
                      className={`transition-colors ${
                        !cred.url ||
                        cred.url === "NA" ||
                        cred.url === "#" ||
                        !cred.url.startsWith("http")
                          ? "text-gray-400 hover:text-gray-300 cursor-default"
                          : "cursor-pointer hover:text-blue-500 hover:underline text-gray-500"
                      }`}
                      onClick={() =>
                        cred.url &&
                        cred.url.startsWith("http") &&
                        window.open(cred.url, "_blank")
                      }
                    >
                      URL : {cred.url}
                    </p>
                    <p>
                      ID : {cred.id} | Password : {cred.pass}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Related Products */}
      <div className="mt-20 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-8 tracking-tight uppercase">
          Explore Other Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productIds
            .filter((id) => id !== productId)
            .slice(0, 3)
            .map((id) => {
              const p = allProductsData[id];
              if (!p) return null;
              return (
                <div
                  key={id}
                  onClick={() => {
                    navigate("/product-details", { state: { productId: id } });
                    window.scrollTo(0, 0);
                  }}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {p.industries
                      ? p.industries.split(",")[0].replace(/^\d+\.\s*/, "")
                      : "Solution"}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">
                    {p.name}
                  </h3>
                  <div className="mt-4 flex items-center text-[10px] font-black text-gray-400 group-hover:text-blue-500 uppercase tracking-widest gap-2">
                    View Details
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
