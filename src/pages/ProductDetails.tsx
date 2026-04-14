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
  Settings,
  CreditCard,
  TrendingUp,
  User,
  UserCheck,
  MapPin,
  Target,
  List,
  BarChart3,
  DollarSign,
  Briefcase,
  Map,
  Building2,
  Megaphone,
  LineChart,
  Compass,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

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

// Extended content interfaces for new tab structure
interface FeatureCategory {
  category: string;
  features: string[];
}

interface MarketSegment {
  segment: string;
  details: string[];
}

interface PricingTier {
  tier: string;
  price: string;
  features: string[];
}

interface UseCase {
  title: string;
  scenario: string;
  benefits: string[];
}

interface RoadmapItem {
  phase: string;
  timeline: string;
  items: string[];
}

interface BusinessPlanSection {
  title: string;
  content: string[];
}

interface GTMStrategy {
  channel: string;
  tactics: string[];
}

interface MetricItem {
  metric: string;
  value: string;
  description: string;
}

interface SWOTCategory {
  type: "strength" | "weakness" | "opportunity" | "threat";
  items: string[];
}

interface EnhancementItem {
  priority: string;
  title: string;
  description: string;
  timeline: string;
}

interface ExtendedProductContent {
  productSummary: {
    vision: string;
    mission: string;
    targetMarket: string;
    valueProposition: string;
    competitiveAdvantage: string[];
  };
  featureList: FeatureCategory[];
  marketAnalysis: {
    marketSize: string;
    growthRate: string;
    segments: MarketSegment[];
    competitors: string[];
    trends: string[];
  };
  featuresAndPricing: {
    overview: string;
    tiers: PricingTier[];
    addOns: string[];
  };
  useCases: UseCase[];
  productRoadmap: RoadmapItem[];
  businessPlanBuilder: BusinessPlanSection[];
  gtmStrategy: GTMStrategy[];
  metrics: {
    kpis: MetricItem[];
    benchmarks: string[];
  };
  swotAnalysis: SWOTCategory[];
  enhancementRoadmap: EnhancementItem[];
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
  // Extended content for new tab structure (optional - only for specific products)
  extendedContent?: ExtendedProductContent;
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
      extendedContent: {
        productSummary: {
          vision:
            "To be the leading quality control solution for real estate, ensuring zero-defect property handovers worldwide.",
          mission:
            "Empower real estate developers and FM companies with digital tools to track, manage, and resolve construction defects efficiently.",
          targetMarket:
            "Real Estate Developers, Facility Management Companies, Construction Contractors, Property Management Firms",
          valueProposition:
            "End-to-end digital snagging solution that reduces rework costs by 40%, accelerates handover timelines, and ensures customer satisfaction through transparent defect management.",
          competitiveAdvantage: [
            "Mobile-first design with offline capability",
            "Photo annotation with AI-powered defect detection",
            "Multi-stage workflow configuration",
            "Real-time dashboards and analytics",
            "Seamless integration with CRM and ERP systems",
          ],
        },
        featureList: [
          {
            category: "Defect Management",
            features: [
              "Photo annotation with markup tools",
              "Voice-to-text defect description",
              "Defect categorization and tagging",
              "Severity level assignment",
              "Location-based defect mapping",
            ],
          },
          {
            category: "Workflow Management",
            features: [
              "Configurable multi-stage workflows",
              "Role-based task assignment",
              "Auto-escalation rules",
              "SLA tracking and alerts",
              "Approval hierarchies",
            ],
          },
          {
            category: "Reporting & Analytics",
            features: [
              "Real-time dashboard",
              "Defect trend analysis",
              "Contractor performance reports",
              "Handover readiness score",
              "Export to PDF/Excel",
            ],
          },
          {
            category: "Mobile App Features",
            features: [
              "Offline mode with sync",
              "Push notifications",
              "QR code scanning",
              "GPS location tracking",
              "Camera integration with filters",
            ],
          },
        ],
        marketAnalysis: {
          marketSize:
            "$2.5 Billion (Global Construction Quality Management Software Market)",
          growthRate: "12.5% CAGR (2024-2030)",
          segments: [
            {
              segment: "Real Estate Developers",
              details: [
                "Large developers with 500+ units annually",
                "Mid-size developers with 100-500 units",
                "Boutique developers focusing on premium properties",
              ],
            },
            {
              segment: "Facility Management",
              details: [
                "Corporate FM companies",
                "Residential property managers",
                "Commercial building operators",
              ],
            },
            {
              segment: "Construction Contractors",
              details: [
                "General contractors",
                "Specialty subcontractors",
                "MEP contractors",
              ],
            },
          ],
          competitors: [
            "PlanGrid (Autodesk)",
            "Fieldwire",
            "Procore",
            "BIM 360",
            "Buildertrend",
          ],
          trends: [
            "Increased adoption of mobile-first solutions",
            "AI and ML for defect prediction",
            "Integration with BIM models",
            "Sustainability and green building compliance",
            "Remote inspection capabilities post-pandemic",
          ],
        },
        featuresAndPricing: {
          overview:
            "Flexible pricing models designed to scale with your project needs, from single projects to enterprise deployments.",
          tiers: [
            {
              tier: "Starter",
              price: "₹25,000/project",
              features: [
                "Up to 100 units",
                "Basic defect management",
                "Standard reports",
                "Email support",
                "3 user licenses",
              ],
            },
            {
              tier: "Professional",
              price: "₹75,000/project",
              features: [
                "Up to 500 units",
                "Advanced workflow configuration",
                "Custom dashboards",
                "Priority support",
                "10 user licenses",
                "API access",
              ],
            },
            {
              tier: "Enterprise",
              price: "Custom Pricing",
              features: [
                "Unlimited units",
                "White-label option",
                "Dedicated account manager",
                "Custom integrations",
                "Unlimited users",
                "SLA guarantees",
                "On-premise deployment option",
              ],
            },
          ],
          addOns: [
            "Additional user licenses - ₹2,000/user/month",
            "Custom report builder - ₹15,000 one-time",
            "API integration support - ₹25,000",
            "Training sessions - ₹10,000/session",
            "Dedicated support - ₹20,000/month",
          ],
        },
        useCases: [
          {
            title: "Pre-Handover Quality Inspection",
            scenario:
              "A real estate developer needs to inspect 200 residential units before handover to customers within a tight 30-day deadline.",
            benefits: [
              "Reduced inspection time by 50% using mobile app",
              "Real-time visibility for management",
              "Automated contractor assignment",
              "Customer-ready handover reports",
            ],
          },
          {
            title: "Ongoing Facility Maintenance",
            scenario:
              "FM company managing a commercial complex needs to track and resolve maintenance issues reported by tenants.",
            benefits: [
              "Centralized issue tracking",
              "SLA compliance monitoring",
              "Vendor performance analytics",
              "Tenant satisfaction improvement",
            ],
          },
          {
            title: "Construction Stage QC",
            scenario:
              "Contractor performing stage-wise quality checks during construction to prevent defects before completion.",
            benefits: [
              "Early defect detection",
              "Reduced rework costs",
              "Compliance documentation",
              "Progress tracking",
            ],
          },
          {
            title: "Post-Possession Warranty Management",
            scenario:
              "Developer managing warranty claims from homeowners within the defect liability period.",
            benefits: [
              "Systematic warranty tracking",
              "Cost allocation to contractors",
              "Customer communication trail",
              "Analytics on common defects",
            ],
          },
        ],
        productRoadmap: [
          {
            phase: "Phase 1 - Foundation",
            timeline: "Q1-Q2 2024",
            items: [
              "Core defect management module",
              "Mobile app for iOS and Android",
              "Basic reporting dashboard",
              "User management and roles",
            ],
          },
          {
            phase: "Phase 2 - Enhancement",
            timeline: "Q3-Q4 2024",
            items: [
              "Advanced workflow engine",
              "Integration with SFDC and SAP",
              "Custom report builder",
              "Offline mode improvements",
            ],
          },
          {
            phase: "Phase 3 - Intelligence",
            timeline: "Q1-Q2 2025",
            items: [
              "AI-powered defect categorization",
              "Predictive analytics dashboard",
              "BIM model integration",
              "Voice command support",
            ],
          },
          {
            phase: "Phase 4 - Scale",
            timeline: "Q3-Q4 2025",
            items: [
              "Multi-tenant architecture",
              "White-label platform",
              "Marketplace for third-party integrations",
              "Global language support",
            ],
          },
        ],
        businessPlanBuilder: [
          {
            title: "Executive Summary",
            content: [
              "Snag 360 addresses the $2.5B construction quality management market",
              "Mobile-first approach differentiates from legacy desktop solutions",
              "Target 100 enterprise clients in Year 1 with ₹5Cr ARR",
              "Expansion into international markets by Year 3",
            ],
          },
          {
            title: "Revenue Model",
            content: [
              "SaaS subscription - 70% of revenue",
              "Implementation and customization - 20% of revenue",
              "Training and support services - 10% of revenue",
              "Average deal size: ₹3-5 Lakhs annually",
            ],
          },
          {
            title: "Go-to-Market Strategy",
            content: [
              "Direct sales to top 50 developers",
              "Partner channel with FM companies",
              "Digital marketing and content strategy",
              "Industry events and conferences",
            ],
          },
          {
            title: "Investment Requirements",
            content: [
              "Product development: ₹1.5 Cr",
              "Sales & Marketing: ₹1 Cr",
              "Operations & Support: ₹50 Lakhs",
              "Total funding needed: ₹3 Cr",
            ],
          },
        ],
        gtmStrategy: [
          {
            channel: "Direct Sales",
            tactics: [
              "Dedicated enterprise sales team",
              "C-level relationship building",
              "Pilot programs with top developers",
              "Reference customer program",
            ],
          },
          {
            channel: "Partner Network",
            tactics: [
              "FM company partnerships",
              "System integrator alliances",
              "Reseller program",
              "Technology partner ecosystem",
            ],
          },
          {
            channel: "Digital Marketing",
            tactics: [
              "SEO and content marketing",
              "LinkedIn targeted campaigns",
              "Webinars and virtual demos",
              "Case study publications",
            ],
          },
          {
            channel: "Industry Events",
            tactics: [
              "Real estate conferences sponsorship",
              "Construction tech exhibitions",
              "Developer association presentations",
              "Thought leadership articles",
            ],
          },
        ],
        metrics: {
          kpis: [
            {
              metric: "Defect Resolution Time",
              value: "48 hours",
              description:
                "Average time from defect identification to resolution",
            },
            {
              metric: "User Adoption Rate",
              value: "85%",
              description:
                "Percentage of assigned users actively using the platform",
            },
            {
              metric: "Customer Satisfaction Score",
              value: "4.5/5",
              description:
                "Average rating from end customers on handover quality",
            },
            {
              metric: "Rework Cost Reduction",
              value: "40%",
              description:
                "Average reduction in rework costs after implementation",
            },
            {
              metric: "Handover Time Reduction",
              value: "30%",
              description:
                "Faster project handovers compared to manual processes",
            },
          ],
          benchmarks: [
            "Industry average defect resolution: 7 days",
            "Competitor user adoption: 60-70%",
            "Market standard rework cost: 5-8% of project value",
            "Traditional handover delay: 15-30 days",
          ],
        },
        swotAnalysis: [
          {
            type: "strength",
            items: [
              "Mobile-first architecture with offline capability",
              "Deep domain expertise in real estate QC",
              "Proven track record with leading developers",
              "Flexible and configurable workflow engine",
              "Strong integration capabilities with CRM/ERP",
            ],
          },
          {
            type: "weakness",
            items: [
              "Limited brand awareness compared to global players",
              "Smaller sales and support team",
              "Geographic concentration in India",
              "Dependency on mobile app adoption",
            ],
          },
          {
            type: "opportunity",
            items: [
              "Growing real estate market in India",
              "Digital transformation in construction industry",
              "Expansion to Middle East and Southeast Asia",
              "AI and ML integration for predictive quality",
              "Partnership with BIM software providers",
            ],
          },
          {
            type: "threat",
            items: [
              "Entry of global construction tech giants",
              "Economic downturn affecting real estate sector",
              "Resistance to technology adoption by contractors",
              "Data security and privacy regulations",
            ],
          },
        ],
        enhancementRoadmap: [
          {
            priority: "High",
            title: "AI-Powered Defect Detection",
            description:
              "Implement computer vision to automatically identify and categorize defects from photos",
            timeline: "Q2 2025",
          },
          {
            priority: "High",
            title: "BIM Integration",
            description:
              "Connect defects to BIM models for spatial visualization and clash detection",
            timeline: "Q3 2025",
          },
          {
            priority: "Medium",
            title: "Voice-Enabled Reporting",
            description:
              "Allow inspectors to report defects using voice commands for hands-free operation",
            timeline: "Q4 2025",
          },
          {
            priority: "Medium",
            title: "Predictive Analytics",
            description:
              "Use historical data to predict likely defects and recommend preventive measures",
            timeline: "Q1 2026",
          },
          {
            priority: "Low",
            title: "AR Visualization",
            description:
              "Augmented reality overlay to visualize defects in real-world context",
            timeline: "Q2 2026",
          },
          {
            priority: "Low",
            title: "Drone Integration",
            description:
              "Connect with drone footage for large-scale exterior inspections",
            timeline: "Q3 2026",
          },
        ],
      },
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
      extendedContent: {
        productSummary: {
          vision:
            "To revolutionize channel partner management in real estate by creating a transparent, efficient, and rewarding ecosystem for all stakeholders.",
          mission:
            "Enable real estate developers to build stronger, more productive relationships with channel partners through digital transformation and automation.",
          targetMarket:
            "Real Estate Developers, Channel Partner Agencies, Individual Brokers, Referral Network Partners",
          valueProposition:
            "Complete channel partner lifecycle management platform that increases sales velocity by 35%, reduces brokerage disputes by 90%, and improves CP engagement through gamification.",
          competitiveAdvantage: [
            "White-labeled mobile app for brand consistency",
            "Real-time inventory and pricing access",
            "Automated commission calculation and tracking",
            "Rule-based incentive engine",
            "Comprehensive analytics and reporting",
          ],
        },
        featureList: [
          {
            category: "CP Onboarding & Profile",
            features: [
              "Digital KYC and document verification",
              "Multi-tier partner registration",
              "Profile management and preferences",
              "Team hierarchy setup",
              "Certification and training records",
            ],
          },
          {
            category: "Lead Management",
            features: [
              "Lead submission with customer details",
              "Lead status tracking and updates",
              "Follow-up reminders and scheduling",
              "Lead assignment and routing rules",
              "Duplicate lead detection",
            ],
          },
          {
            category: "Commission & Incentives",
            features: [
              "Automated brokerage calculation",
              "Multi-slab commission structures",
              "Real-time payout tracking",
              "Incentive scheme management",
              "Tax deduction handling",
            ],
          },
          {
            category: "Project & Inventory",
            features: [
              "Real-time inventory availability",
              "Project collateral and media",
              "Price list and payment plans",
              "Unit comparison tools",
              "Virtual tour integration",
            ],
          },
          {
            category: "Analytics & Reports",
            features: [
              "Performance dashboards",
              "Commission forecasting",
              "Leaderboards and rankings",
              "Conversion funnel analysis",
              "Custom report builder",
            ],
          },
        ],
        marketAnalysis: {
          marketSize:
            "$1.8 Billion (Real Estate Channel Partner Management Software - India)",
          growthRate: "15% CAGR (2024-2030)",
          segments: [
            {
              segment: "Large Developers",
              details: [
                "Pan-India developers with 1000+ CP network",
                "Multiple project launches per year",
                "Complex commission structures",
              ],
            },
            {
              segment: "Regional Developers",
              details: [
                "City-specific developers with 100-500 CPs",
                "Focus on residential projects",
                "Growing digital adoption",
              ],
            },
            {
              segment: "CP Agencies",
              details: [
                "Large broker networks",
                "Multi-developer partnerships",
                "Team management needs",
              ],
            },
          ],
          competitors: [
            "Sell.Do",
            "PropTiger Enterprise",
            "Anarock CP Portal",
            "Custom CRM solutions",
            "Manual Excel-based tracking",
          ],
          trends: [
            "Mobile-first CP engagement",
            "Real-time inventory sharing",
            "Automated commission disbursement",
            "Gamification for CP motivation",
            "Integration with PropTech ecosystem",
          ],
        },
        featuresAndPricing: {
          overview:
            "Scalable pricing based on CP network size and feature requirements, with options for white-labeling and customization.",
          tiers: [
            {
              tier: "Basic",
              price: "₹50,000/month",
              features: [
                "Up to 200 CPs",
                "Lead management",
                "Basic commission tracking",
                "Standard reports",
                "Email support",
              ],
            },
            {
              tier: "Growth",
              price: "₹1,25,000/month",
              features: [
                "Up to 1000 CPs",
                "White-labeled app",
                "Advanced commission rules",
                "Incentive management",
                "API integrations",
                "Priority support",
              ],
            },
            {
              tier: "Enterprise",
              price: "Custom Pricing",
              features: [
                "Unlimited CPs",
                "Custom branding",
                "Dedicated account manager",
                "Custom integrations",
                "SLA guarantees",
                "On-premise option",
                "Advanced analytics",
              ],
            },
          ],
          addOns: [
            "Additional projects - ₹10,000/project/month",
            "Custom mobile app development - ₹5,00,000 one-time",
            "CRM integration - ₹50,000",
            "Payment gateway integration - ₹25,000",
            "Training program - ₹15,000/session",
          ],
        },
        useCases: [
          {
            title: "Large Developer CP Network Management",
            scenario:
              "A pan-India developer with 2000+ channel partners across 10 cities needs to streamline CP engagement, lead tracking, and commission management.",
            benefits: [
              "Single platform for all CP interactions",
              "Reduced commission disputes by 90%",
              "Real-time performance visibility",
              "Faster lead-to-booking conversion",
            ],
          },
          {
            title: "New Project Launch",
            scenario:
              "Developer launching a new project needs to quickly onboard CPs, share project details, and track initial leads.",
            benefits: [
              "Rapid CP onboarding within days",
              "Instant project collateral distribution",
              "Real-time lead submission",
              "Launch incentive tracking",
            ],
          },
          {
            title: "Commission Reconciliation",
            scenario:
              "Finance team needs to process monthly commission payouts for 500 CPs with varying slab rates and incentives.",
            benefits: [
              "Automated calculation with audit trail",
              "TDS deduction handling",
              "Payout approval workflow",
              "Dispute resolution records",
            ],
          },
          {
            title: "CP Performance Management",
            scenario:
              "Sales head wants to identify top performers, motivate underperformers, and run targeted incentive campaigns.",
            benefits: [
              "Real-time leaderboards",
              "Performance analytics",
              "Targeted push notifications",
              "Gamification features",
            ],
          },
        ],
        productRoadmap: [
          {
            phase: "Phase 1 - Core Platform",
            timeline: "Q1-Q2 2024",
            items: [
              "CP registration and KYC",
              "Lead management module",
              "Basic commission tracking",
              "Mobile app (Android & iOS)",
            ],
          },
          {
            phase: "Phase 2 - Advanced Features",
            timeline: "Q3-Q4 2024",
            items: [
              "Rule-based incentive engine",
              "White-label customization",
              "CRM integration (SFDC, SAP)",
              "Advanced reporting dashboard",
            ],
          },
          {
            phase: "Phase 3 - Intelligence",
            timeline: "Q1-Q2 2025",
            items: [
              "AI-powered lead scoring",
              "Predictive commission forecasting",
              "CP recommendation engine",
              "Chatbot for CP support",
            ],
          },
          {
            phase: "Phase 4 - Ecosystem",
            timeline: "Q3-Q4 2025",
            items: [
              "Marketplace for CP services",
              "Training and certification platform",
              "Cross-developer CP network",
              "International expansion",
            ],
          },
        ],
        businessPlanBuilder: [
          {
            title: "Executive Summary",
            content: [
              "CP Management addresses the fragmented channel partner ecosystem in Indian real estate",
              "Platform connects 50,000+ brokers with leading developers",
              "Target ₹10Cr ARR by Year 2 with 50 enterprise clients",
              "Expansion to UAE and Southeast Asia by Year 3",
            ],
          },
          {
            title: "Revenue Model",
            content: [
              "Platform subscription - 60% of revenue",
              "White-label app development - 25% of revenue",
              "Transaction fees on commissions - 10% of revenue",
              "Training and support - 5% of revenue",
            ],
          },
          {
            title: "Key Partnerships",
            content: [
              "Real estate associations (CREDAI, NAREDCO)",
              "Banking partners for CP financing",
              "PropTech ecosystem integrations",
              "Training institutes for certification",
            ],
          },
          {
            title: "Investment & Returns",
            content: [
              "Total investment needed: ₹5 Cr",
              "Product development: ₹2 Cr",
              "Sales & Marketing: ₹2 Cr",
              "Expected ROI: 40% by Year 2",
            ],
          },
        ],
        gtmStrategy: [
          {
            channel: "Enterprise Sales",
            tactics: [
              "Direct outreach to top 100 developers",
              "Executive presentations and demos",
              "Pilot programs with success guarantees",
              "Reference customer testimonials",
            ],
          },
          {
            channel: "Association Partnerships",
            tactics: [
              "CREDAI chapter partnerships",
              "Sponsorship of developer events",
              "Co-branded webinars",
              "Member exclusive offers",
            ],
          },
          {
            channel: "Digital Marketing",
            tactics: [
              "LinkedIn campaigns targeting CRM/Sales heads",
              "Google Ads for relevant keywords",
              "Content marketing on PropTech blogs",
              "YouTube tutorials and demos",
            ],
          },
          {
            channel: "CP Network Expansion",
            tactics: [
              "Broker association tie-ups",
              "Referral incentives for CPs",
              "Free tier for individual brokers",
              "CP community events",
            ],
          },
        ],
        metrics: {
          kpis: [
            {
              metric: "Lead Conversion Rate",
              value: "12%",
              description:
                "Percentage of leads converted to bookings through platform",
            },
            {
              metric: "CP Engagement Rate",
              value: "75%",
              description: "Weekly active CPs as percentage of registered CPs",
            },
            {
              metric: "Commission Processing Time",
              value: "3 days",
              description:
                "Average time from booking to commission calculation",
            },
            {
              metric: "App Adoption Rate",
              value: "90%",
              description: "CPs actively using mobile app for transactions",
            },
            {
              metric: "Dispute Resolution Rate",
              value: "95%",
              description: "Commission disputes resolved within 7 days",
            },
          ],
          benchmarks: [
            "Industry average lead conversion: 5-7%",
            "Traditional CP engagement: 40-50%",
            "Manual commission processing: 15-30 days",
            "Excel-based tracking disputes: 20-30%",
          ],
        },
        swotAnalysis: [
          {
            type: "strength",
            items: [
              "Comprehensive end-to-end CP lifecycle management",
              "White-label capability for brand consistency",
              "Real-time inventory and commission visibility",
              "Strong integration with popular CRMs",
              "Mobile-first design for field sales",
            ],
          },
          {
            type: "weakness",
            items: [
              "Requires developer buy-in for full effectiveness",
              "Learning curve for traditional brokers",
              "Dependency on CRM data quality",
              "Limited international presence",
            ],
          },
          {
            type: "opportunity",
            items: [
              "Growing organized real estate market",
              "Increasing digital adoption by CPs",
              "Expansion to commercial and retail real estate",
              "Cross-selling to existing developer relationships",
              "International markets with similar CP models",
            ],
          },
          {
            type: "threat",
            items: [
              "CRM vendors adding CP modules",
              "Developers building in-house solutions",
              "Economic slowdown affecting real estate",
              "Regulatory changes in brokerage structure",
            ],
          },
        ],
        enhancementRoadmap: [
          {
            priority: "High",
            title: "AI-Powered Lead Scoring",
            description:
              "Implement machine learning to score leads and prioritize high-potential opportunities for CPs",
            timeline: "Q1 2025",
          },
          {
            priority: "High",
            title: "Instant Commission Payout",
            description:
              "Integration with banking partners for same-day commission credit upon booking confirmation",
            timeline: "Q2 2025",
          },
          {
            priority: "Medium",
            title: "Virtual Site Tours",
            description:
              "Embedded 360° virtual tours and AR visualization within the CP app",
            timeline: "Q3 2025",
          },
          {
            priority: "Medium",
            title: "CP Financing Module",
            description:
              "Working capital financing for CPs based on pending commissions and performance history",
            timeline: "Q4 2025",
          },
          {
            priority: "Low",
            title: "Cross-Developer Platform",
            description:
              "Network effect by allowing CPs to access multiple developers through single platform",
            timeline: "Q1 2026",
          },
          {
            priority: "Low",
            title: "Blockchain Commission Tracking",
            description:
              "Immutable ledger for commission transactions ensuring complete transparency",
            timeline: "Q2 2026",
          },
        ],
      },
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
      className={`min-h-screen bg-white font-sans select-none relative transition-all duration-300 ${isBlurred ? "blur-2xl" : ""}`}
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
      <div className="relative mb-8 flex flex-col items-center bg-white">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-6">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 px-3 py-1.5 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
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

      <div className="max-w-7xl px-6 lg:px-10">
        {/* Conditional Tab Rendering based on extendedContent availability */}
        {productData.extendedContent ? (
          /* Extended Tabs for Snag 360 and CP Management */
          <Tabs defaultValue="summary" style={{ width: "100%" }}>
            <TabsList className="w-full mb-8 flex-wrap h-auto gap-1">
              <TabsTrigger
                value="summary"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Target className="w-4 h-4 mr-1" />
                Product Summary
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <List className="w-4 h-4 mr-1" />
                Feature List
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Market Analysis
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Features & Pricing
              </TabsTrigger>
              <TabsTrigger
                value="usecases"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Use Cases
              </TabsTrigger>
              <TabsTrigger
                value="roadmap"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Map className="w-4 h-4 mr-1" />
                Product Roadmap
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Building2 className="w-4 h-4 mr-1" />
                Business Plan
              </TabsTrigger>
              <TabsTrigger
                value="gtm"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Megaphone className="w-4 h-4 mr-1" />
                GTM Strategy
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <LineChart className="w-4 h-4 mr-1" />
                Metrics
              </TabsTrigger>
              <TabsTrigger
                value="swot"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Compass className="w-4 h-4 mr-1" />
                SWOT Analysis
              </TabsTrigger>
              <TabsTrigger
                value="enhancements"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <Rocket className="w-4 h-4 mr-1" />
                Enhancement Roadmap
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="flex-1 min-w-[120px] data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black text-xs"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Assets & Credentials
              </TabsTrigger>
            </TabsList>

            {/* Product Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Target className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Product Summary
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#C72030]" /> Vision
                      </h4>
                      <p className="text-sm text-gray-600">
                        {productData.extendedContent.productSummary.vision}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#C72030]" /> Mission
                      </h4>
                      <p className="text-sm text-gray-600">
                        {productData.extendedContent.productSummary.mission}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Target Market
                    </h4>
                    <p className="text-sm text-gray-600">
                      {productData.extendedContent.productSummary.targetMarket}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Value Proposition
                    </h4>
                    <p className="text-sm text-gray-600">
                      {
                        productData.extendedContent.productSummary
                          .valueProposition
                      }
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Competitive Advantages
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {productData.extendedContent.productSummary.competitiveAdvantage.map(
                        (item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Feature List Tab */}
            <TabsContent value="features" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <List className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Feature List
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productData.extendedContent.featureList.map(
                      (category, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <h4 className="font-semibold mb-3 text-[#C72030]">
                            {category.category}
                          </h4>
                          <ul className="space-y-2">
                            {category.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Market Analysis Tab */}
            <TabsContent value="market" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <BarChart3
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Market Analysis
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Market Size
                      </h4>
                      <p className="text-2xl font-bold text-[#C72030]">
                        {productData.extendedContent.marketAnalysis.marketSize}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Growth Rate
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        {productData.extendedContent.marketAnalysis.growthRate}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Market Segments
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productData.extendedContent.marketAnalysis.segments.map(
                        (segment, idx) => (
                          <div key={idx} className="border rounded-lg p-3">
                            <h5 className="font-medium text-[#C72030] mb-2">
                              {segment.segment}
                            </h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {segment.details.map((detail, i) => (
                                <li key={i}>• {detail}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Key Competitors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {productData.extendedContent.marketAnalysis.competitors.map(
                          (comp, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                            >
                              {comp}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Market Trends
                      </h4>
                      <ul className="space-y-1">
                        {productData.extendedContent.marketAnalysis.trends.map(
                          (trend, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{trend}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Features & Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <DollarSign
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Features & Pricing
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-6">
                  <p className="text-sm text-gray-600 italic">
                    {productData.extendedContent.featuresAndPricing.overview}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {productData.extendedContent.featuresAndPricing.tiers.map(
                      (tier, idx) => (
                        <div
                          key={idx}
                          className={`bg-white p-5 rounded-lg border-2 ${idx === 1 ? "border-[#C72030] shadow-lg" : "border-gray-200"}`}
                        >
                          <h4 className="font-bold text-lg text-gray-800">
                            {tier.tier}
                          </h4>
                          <p className="text-2xl font-bold text-[#C72030] mt-2 mb-4">
                            {tier.price}
                          </p>
                          <ul className="space-y-2">
                            {tier.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Add-On Services
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {productData.extendedContent.featuresAndPricing.addOns.map(
                        (addon, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
                          >
                            <DollarSign className="w-4 h-4 text-[#C72030]" />
                            <span>{addon}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Use Cases Tab */}
            <TabsContent value="usecases" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Briefcase
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Use Cases
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productData.extendedContent.useCases.map(
                      (useCase, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-5 rounded-lg border"
                        >
                          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#C72030]" />
                            {useCase.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 italic border-l-2 border-[#C72030] pl-3">
                            {useCase.scenario}
                          </p>
                          <h5 className="font-medium text-gray-700 mb-2">
                            Key Benefits:
                          </h5>
                          <ul className="space-y-1">
                            {useCase.benefits.map((benefit, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Product Roadmap Tab */}
            <TabsContent value="roadmap" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Map className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Product Roadmap
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="space-y-4">
                    {productData.extendedContent.productRoadmap.map(
                      (phase, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-5 rounded-lg border relative"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030] rounded-l-lg"></div>
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-gray-800">
                              {phase.phase}
                            </h4>
                            <span className="px-3 py-1 bg-[#C72030] text-white text-xs rounded-full">
                              {phase.timeline}
                            </span>
                          </div>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {phase.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Business Plan Tab */}
            <TabsContent value="business" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Building2
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Business Plan Builder
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productData.extendedContent.businessPlanBuilder.map(
                      (section, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-5 rounded-lg border"
                        >
                          <h4 className="font-bold text-[#C72030] mb-3">
                            {section.title}
                          </h4>
                          <ul className="space-y-2">
                            {section.content.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <ChevronRight className="w-4 h-4 text-[#C72030] mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* GTM Strategy Tab */}
            <TabsContent value="gtm" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Megaphone
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    GTM Strategy
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productData.extendedContent.gtmStrategy.map(
                      (channel, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-5 rounded-lg border"
                        >
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-[#C72030]" />
                            {channel.channel}
                          </h4>
                          <ul className="space-y-2">
                            {channel.tactics.map((tactic, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{tactic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <LineChart
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Metrics & KPIs
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {productData.extendedContent.metrics.kpis.map(
                      (kpi, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border text-center"
                        >
                          <p className="text-3xl font-bold text-[#C72030]">
                            {kpi.value}
                          </p>
                          <h4 className="font-semibold text-gray-800 mt-2 text-sm">
                            {kpi.metric}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {kpi.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Industry Benchmarks
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {productData.extendedContent.metrics.benchmarks.map(
                        (benchmark, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
                          >
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            <span>{benchmark}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SWOT Analysis Tab */}
            <TabsContent value="swot" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Compass className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    SWOT Analysis
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productData.extendedContent.swotAnalysis.map(
                      (category, idx) => (
                        <div
                          key={idx}
                          className={`p-5 rounded-lg border-2 ${
                            category.type === "strength"
                              ? "bg-green-50 border-green-200"
                              : category.type === "weakness"
                                ? "bg-red-50 border-red-200"
                                : category.type === "opportunity"
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <h4
                            className={`font-bold mb-3 flex items-center gap-2 ${
                              category.type === "strength"
                                ? "text-green-700"
                                : category.type === "weakness"
                                  ? "text-red-700"
                                  : category.type === "opportunity"
                                    ? "text-blue-700"
                                    : "text-yellow-700"
                            }`}
                          >
                            {category.type === "strength" && (
                              <CheckCircle className="w-5 h-5" />
                            )}
                            {category.type === "weakness" && (
                              <AlertTriangle className="w-5 h-5" />
                            )}
                            {category.type === "opportunity" && (
                              <Lightbulb className="w-5 h-5" />
                            )}
                            {category.type === "threat" && (
                              <XCircle className="w-5 h-5" />
                            )}
                            {category.type.charAt(0).toUpperCase() +
                              category.type.slice(1)}
                            s
                          </h4>
                          <ul className="space-y-2">
                            {category.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-700"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                    category.type === "strength"
                                      ? "bg-green-500"
                                      : category.type === "weakness"
                                        ? "bg-red-500"
                                        : category.type === "opportunity"
                                          ? "bg-blue-500"
                                          : "bg-yellow-500"
                                  }`}
                                ></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Enhancement Roadmap Tab */}
            <TabsContent value="enhancements" className="space-y-6">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Rocket className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Enhancement Roadmap
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="space-y-4">
                    {productData.extendedContent.enhancementRoadmap.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-5 rounded-lg border flex gap-4"
                        >
                          <div
                            className={`w-2 rounded-full flex-shrink-0 ${
                              item.priority === "High"
                                ? "bg-red-500"
                                : item.priority === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 text-xs rounded ${
                                    item.priority === "High"
                                      ? "bg-red-100 text-red-700"
                                      : item.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {item.priority}
                                </span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                  {item.timeline}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Assets & Credentials Tab (Extended Version) */}
            <TabsContent value="assets" className="space-y-8">
              {/* Product Assets Section */}
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9] justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <CreditCard
                        className="w-6 h-6"
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      Product Assets
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">
                    <Lock className="w-3 h-3" />
                    VIEW ONLY
                  </span>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assets.map((asset, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-md p-4 flex items-center gap-4 hover:shadow-sm transition-shadow bg-white"
                      >
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                          {asset.icon}
                        </div>
                        <span
                          className={`text-xs font-semibold underline cursor-pointer transition-colors ${!asset.url || asset.url === "NA" || asset.url === "#" ? "text-gray-400 hover:text-gray-300 pointer-events-none" : "text-gray-700 hover:text-blue-600"}`}
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
                  </div>
                </div>
              </div>

              {/* Credentials Section */}
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <UserCheck
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Login Credentials
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {credentials.map((cred, index) => (
                      <div
                        key={`cred-${index}`}
                        className="border border-gray-100 rounded-md p-4 flex gap-4 hover:shadow-sm transition-shadow bg-white"
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
                              className={`transition-colors ${!cred.url || cred.url === "NA" || cred.url === "#" || !cred.url.startsWith("http") ? "text-gray-400 hover:text-gray-300 cursor-default" : "cursor-pointer hover:text-blue-500 hover:underline text-gray-500"}`}
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
              </div>

              {/* Meet The People Section */}
              <div className="w-full bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <User className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Meet The People Behind The Product
                  </h3>
                </div>
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
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
                          <p className="text-gray-300 text-[10px]">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          /* Standard Tabs for other products */
          <Tabs defaultValue="overview" style={{ width: "100%" }}>
            <TabsList className="w-full mb-8">
              <TabsTrigger
                value="overview"
                className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
              >
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                    fill="#currentColor"
                  />
                </svg>
                Product Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Detailed Information
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
              >
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                    fill="#currentColor"
                  />
                </svg>
                Assets & Credentials
              </TabsTrigger>
            </TabsList>

            {/* Product Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Settings
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Product Overview
                  </h3>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Left Section - Product Info */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                      <div className="flex items-start">
                        <span className="w-32 text-gray-500 text-sm">
                          Product Brief
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {productData.brief}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="w-32 text-gray-500 text-sm">
                          Industries
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {productData.industries}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="w-32 text-gray-500 text-sm">
                          Inclusions
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {productData.includes.join(", ")}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="w-32 text-gray-500 text-sm">
                          Up Selling
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {productData.upSelling.join(", ")}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="w-32 text-gray-500 text-sm">
                          Integrations
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {productData.integrations.join(", ")}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="w-32 text-gray-500 text-sm">
                          Decision Makers
                        </span>
                        <span className="mx-2 text-gray-500">:</span>
                        <span className="font-semibold text-black">
                          {productData.decisionMakers.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Right Section - Product Owner */}
                    <div className="lg:col-span-1 flex justify-end">
                      <div className="w-64 h-48 border border-gray-300 rounded-lg bg-white flex items-center justify-center overflow-hidden relative">
                        {productData.ownerImage ? (
                          <img
                            src={productData.ownerImage}
                            alt={productData.owner || "Product Owner"}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}

                        {/* Fallback when image is not available */}
                        <div
                          className={`absolute inset-0 ${
                            productData.ownerImage ? "hidden" : "flex"
                          } flex-col items-center justify-center text-gray-400 text-sm`}
                        >
                          <User className="w-12 h-12 mb-2" />
                          <span>{productData.owner || "Product Owner"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Detailed Information Tab */}
            <TabsContent value="details" className="space-y-8">
              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <FileText
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    User Stories & Features
                  </h3>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Stories */}
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-4">
                        User Stories
                      </h4>
                      <div className="space-y-4">
                        {productData.userStories.map((section, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border"
                          >
                            <h5 className="font-semibold text-gray-800 mb-2">
                              {section.title}
                            </h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {section.items.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-black mb-4">
                          USPs & Differentiators
                        </h4>
                        <div className="space-y-2">
                          {productData.usps.map((usp, i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg border text-sm text-gray-700"
                            >
                              {usp}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-black mb-4">
                          Key Decision Points
                        </h4>
                        <div className="space-y-2">
                          {productData.keyPoints.map((point, i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg border text-sm text-gray-700"
                            >
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-black mb-4">
                          ROI Benefits
                        </h4>
                        <div className="space-y-2">
                          {productData.roi.map((roi, i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg border text-sm text-gray-700"
                            >
                              {roi}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Assets & Credentials Tab */}
            <TabsContent value="assets" className="space-y-8">
              {/* Product Assets Section */}
              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9] justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <CreditCard
                        className="w-6 h-6"
                        style={{ color: "#C72030" }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                      Product Assets
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">
                    <Lock className="w-3 h-3" />
                    VIEW ONLY
                  </span>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assets.map((asset, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-md p-4 flex items-center gap-4 hover:shadow-sm transition-shadow bg-white"
                      >
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                          {asset.icon}
                        </div>
                        <span
                          className={`text-xs font-semibold underline cursor-pointer transition-colors ${
                            !asset.url ||
                            asset.url === "NA" ||
                            asset.url === "#"
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
                  </div>
                </div>
              </div>

              {/* Credentials Section */}
              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <UserCheck
                      className="w-6 h-6"
                      style={{ color: "#C72030" }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Login Credentials
                  </h3>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {credentials.map((cred, index) => (
                      <div
                        key={`cred-${index}`}
                        className="border border-gray-100 rounded-md p-4 flex gap-4 hover:shadow-sm transition-shadow bg-white"
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
              </div>

              {/* Meet The People Section */}
              <div className="w-full bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center gap-3 bg-[#F6F4EE] p-6 border border-[#D9D9D9]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <User className="w-6 h-6" style={{ color: "#C72030" }} />
                  </div>
                  <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
                    Meet The People Behind The Product
                  </h3>
                </div>

                {/* Body */}
                <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-6">
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
                          <p className="text-gray-300 text-[10px]">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      {/* Related Products */}
      <div className="mt-20 mb-8 pt-10 border-t border-gray-100 max-w-7xl px-6 lg:px-10">
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
