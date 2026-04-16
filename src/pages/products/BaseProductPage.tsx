import React, { useState, useEffect, useRef } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
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
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export interface ProductData {
  name: string;
  description: string;
  brief: string;
  excelLikeSummary?: boolean;
  excelLikeFeatures?: boolean;
  excelLikeUseCases?: boolean;
  excelLikeMarket?: boolean;
  excelLikePricing?: boolean;
  excelLikeSwot?: boolean;
  excelLikeRoadmap?: boolean;
  excelLikeBusinessPlan?: boolean;
  excelLikeGtm?: boolean;
  excelLikeMetrics?: boolean;
  excelLikePostPossession?: boolean;
  excelFeatureRowStart?: number;
  userStories: {
    title: string;
    items: string[];
  }[];
  industries: string;
  usps: string[];
  includes: string[];
  upSelling: string[];
  integrations: string[];
  decisionMakers: string[];
  keyPoints: string[];
  roi: string[];
  assets: {
    type: string;
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
  credentials: {
    title: string;
    url: string;
    id: string;
    pass: string;
    icon: React.ReactNode;
  }[];
  owner: string;
  ownerImage: string;
  extendedContent: {
    featureSummary?: string | React.ReactNode;
    productSummaryNew: {
      identity: { field: string; detail: string }[];
      problemSolves: { painPoint: string; solution: string }[];
      whoItIsFor: {
        role: string;
        useCase: string;
        frustration: string;
        gain: string;
      }[];
      today: { dimension: string; state: string }[];
    };
    detailedFeatures: {
      module: string;
      feature: string;
      subFeatures: string;
      works: string;
      userType: string;
      usp: boolean;
    }[];
    detailedMarketAnalysis?: {
      marketMatrixSubtitle?: string;
      marketMatrixRows?: {
        segment: string;
        whoToday: string;
        subsector: string;
        budget: string;
        purchasePattern: string;
        incumbents: string;
        readiness: string;
        trigger: string;
        payoff: string;
        risk: string;
        entryWedge: string;
        opportunity: string;
      }[];
      marketSize?: {
        segment: string;
        val2425: string;
        val26: string;
        forecast: string;
        cagr: string;
        driver: string;
        india: string;
      }[];
      topIndustries?: {
        rank: string;
        industry: string;
        buyReason: string;
        scale: string;
        decisionMaker: string;
        dealSize: string;
      }[];
      competitors?: {
        name: string;
        hq: string;
        indiaPrice: string;
        globalPrice: string;
        strength: string;
        weakness: string;
        sovereignty: string;
        segment: string;
      }[];
      competitorSummary?: string;
      targetAudience?: {
        segment: string;
        demographics: string;
        industry: string;
        painPoints: string;
        notSolved: string;
        goodEnough: string;
        urgency?: string;
        primaryBuyer?: string;
      }[];
      companyPainPoints?: {
        companyType: string;
        pain1: string;
        pain2: string;
        pain3: string;
        costRisk: string;
      }[];
      competitorMapping?: {
        name: string;
        targetCustomer: string;
        pricing: string;
        discovery: string;
        strongestFeatures: string;
        weakness: string;
        marketGaps: string;
        threats: string;
      }[];
    };
    detailedPricing?: {
      pricingMatrixSubtitle?: string;
      pricingFeatureRows?: {
        capability: string;
        currentState: string;
        marketNeed: string;
        impact: string;
        status: string;
        recommendation: string;
      }[];
      pricingSummaryRows?: {
        label: string;
        detail: string;
        tone: "green" | "yellow" | "red";
      }[];
      pricingCurrentRows?: {
        label: string;
        detail: string;
      }[];
      pricingPositioningRows?: {
        question: string;
        answer: string;
        note: string;
      }[];
      pricingImprovementRows?: {
        currentProp: string;
        suggestedFix: string;
        improvedFraming: string;
        whyItWins: string;
      }[];
      featureComparison?: {
        feature: string;
        snag: string;
        falcon: string;
        procore: string;
        novade: string;
        snagR: string;
        safety: string;
        status: string;
      }[];
      featuresVsMarket?: {
        featureArea: string;
        marketStandard: string;
        ourProduct: string;
        summary: string;
        status: string;
      }[];
      pricingLandscape?: {
        tier: string;
        model: string;
        india: string;
        global: string;
        included: string;
        target: string;
      }[];
      currentPricingMarket?: { category: string; description: string }[];
      positioningStatement?: string;
      positioning?: { category: string; description: string }[];
      comparisonSummary?: { ahead: string; atPar: string; gaps: string };
      valueProps?: {
        role: string;
        prop: string;
        outcome: string;
        feature: string;
      }[];
      valuePropositions?: {
        currentProp: string;
        segment: string;
        weakness: string;
        sharpened: string;
      }[];
    };
    detailedUseCases?: {
      industryUseCases: {
        rank: string;
        industry: string;
        features: string;
        useCase: string;
        profile: string;
        currentTool: string;
        outcome?: string;
      }[];
      internalTeamUseCases: {
        team: string;
        features: string;
        process: string;
        benefit: string;
        frequency: string;
      }[];
    };
    detailedRoadmap?: {
      phases?: {
        title: string;
        initiatives: {
          initiative: string;
          feature: string;
          segment: string;
          impact: string;
          timeline: string;
        }[];
        summary: string;
      }[];
      top5Impact?: {
        rank: string | number;
        name: string;
        logic: string;
        leapfrog: string;
      }[];
      innovationLayer?: {
        id: string | number;
        name: string;
        category: string;
        description: string;
        value: string;
        leapfrog: string;
        priority: string;
      }[];
      structuredRoadmap?: {
        timeframe: string;
        headline: string;
        colorContext: "red" | "yellow" | "green" | "blue";
        items: {
          whatItIs: string;
          whyItMatters: string;
          unlockedSegment: string;
          effort: string;
          owner: string;
          impact?: string;
          priority?: string;
        }[];
      }[];
      enhancementRoadmap?: {
        featureName: string;
        currentStatus: string;
        enhancedVersion: string;
        integrationType: string;
        effort: string;
        impact: string;
        priority: string;
        owner: string;
      }[];
    };
    detailedBusinessPlan?: {
      planQuestions: { question: string; answer: string; flag: string }[];
    };
    detailedGTM?: {
      targetGroups: {
        title: string;
        components: { component: string; detail: string }[];
        summaryBox: string;
      }[];
      sheet?: {
        title: string;
        targetGroups: {
          title: string;
          sections: {
            title: string;
            columns: string[];
            rows: string[][];
          }[];
          summary?: string;
          keyAssumptions?: string;
        }[];
      };
    };
    detailedMetrics?: {
      clientImpact: {
        metric: string;
        baseline: string;
        withSnag: string;
        claim: string;
      }[];
      businessTargets: {
        metric: string;
        definition: string;
        d30Current: string;
        d30Phase1: string;
        m3Current: string;
        m3Phase1: string;
      }[];
      sheet?: {
        title: string;
        sections: {
          title: string;
          columns: string[];
          rows: string[][];
          tone?: "blue" | "red" | "green";
        }[];
      };
    };
    detailedPostPossession?: {
      title?: string;
      sections: {
        title: string;
        tone: "blue" | "green" | "red";
        columns: string[];
        rows: string[][];
      }[];
    };
    detailedSWOT?: {
      strengths: { headline: string; explanation: string }[];
      weaknesses: { headline: string; explanation: string }[];
      opportunities: { headline: string; explanation: string }[];
      threats: { headline: string; explanation: string }[];
    };
    detailedEnhancements?: {
      roadmap: {
        period: string;
        focus: string;
        features: string;
        logic: string;
        risk: string;
      }[];
    };
  };
}

interface BaseProductPageProps {
  productData: ProductData;
  backPath?: string;
  tabsVariant?: "scroll" | "wrap" | "snag360";
}

// Global level cache to persist the model across page navigations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedModel: any = null;

const BaseProductPage: React.FC<BaseProductPageProps> = ({
  productData,
  backPath = "/products",
  tabsVariant = "scroll",
}) => {
  const navigate = useNavigate();
  const snagTabsScrollRef = useRef<HTMLDivElement | null>(null);

  // ─── Security Global Cache (Module Level) ──────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = useState<any>(cachedModel);
  const [modelLoading, setModelLoading] = useState(!cachedModel);
  const [faceDetected, setFaceDetected] = useState(true); // Start as true, will be updated by detection

  // Reset scroll position to 0 on mount so first tab (Product Summary) is always visible
  useEffect(() => {
    if (snagTabsScrollRef.current) snagTabsScrollRef.current.scrollLeft = 0;
  }, []);

  // ─── Security State ──────────────────────────────────────────────────
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [isBlurred, setIsBlurred] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [blackoutReason, setBlackoutReason] =
    useState<string>("Security Violation");
  const [blackoutSubtitle, setBlackoutSubtitle] = useState<string>(
    "Unauthorized activity detected. Attempt logged."
  );
  const [incidentTime, setIncidentTime] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(5);
  const [screenshotBlank, setScreenshotBlank] = useState(false);
  // const [model, setModel] = useState<any>(null); // Removed in favor of cached version above
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  // Session watermark ID
  const sessionId = React.useMemo(() => {
    const id = `SID-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    return id;
  }, []);

  const triggerBlackout = React.useCallback(
    (reason: string, subtitle: string) => {
      setBlackoutReason(reason);
      setBlackoutSubtitle(subtitle);
      setIncidentTime(new Date().toLocaleString());
      setCountdown(5);
      setIsBlurred(true);
      setShowBlackout(true);
    },
    []
  );

  const dismissBlackout = React.useCallback(() => {
    setShowBlackout(false);
    setIsBlurred(false);
  }, []);
  const excelFeatureCols = ["A", "B", "C", "D", "E", "F"];
  const excelFeatureRowStart = productData.excelFeatureRowStart ?? 1;
  const getTagPillClasses = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (t.includes("core"))
      return "border-[#6B9BCC] text-[#6B9BCC] bg-[#6B9BCC]/10";
    if (t.includes("today"))
      return "border-[#0E7490] text-[#0E7490] bg-[#CFFAFE]";
    if (t.includes("economics"))
      return "border-[#CECBF6] text-[#CECBF6] bg-[#CECBF6]/20";
    if (t.includes("module"))
      return "border-[#798C5E] text-[#798C5E] bg-[#9EC8BA]/20";
    if (t.includes("usp"))
      return "border-[#DA7756] text-[#DA7756] bg-[#DA7756]/10";
    return "border-[#D3D1C7] text-[#2C2C2C] bg-[#F6F4EE]";
  };
  const moduleIndexMap = React.useMemo(() => {
    const map = new globalThis.Map<string, number>();
    let currentIndex = 1;
    productData.extendedContent?.detailedFeatures?.forEach((item) => {
      const key = item.module.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, currentIndex);
        currentIndex += 1;
      }
    });
    return map;
  }, [productData.extendedContent?.detailedFeatures]);

  const getDisplayModule = (moduleName: string) => {
    if (/^\d+[.)\s-]/.test(moduleName.trim())) {
      return moduleName;
    }
    const index = moduleIndexMap.get(moduleName.trim().toLowerCase());
    return index ? `${index}. ${moduleName}` : moduleName;
  };
  const getModuleTone = (moduleName: string) => {
    const name = moduleName.toLowerCase();
    if (name.includes("crm") || name.includes("support"))
      return "bg-[#6B9BCC]/15 text-[#6B9BCC]";
    if (name.includes("activit")) return "bg-[#DFF6FB] text-[#0E7490]";
    if (name.includes("discover") || name.includes("search"))
      return "bg-[#6B9BCC]/10 text-[#6B9BCC]";
    if (
      name.includes("engag") ||
      name.includes("brand") ||
      name.includes("media")
    )
      return "bg-[#9EC8BA]/20 text-[#798C5E]";
    if (name.includes("service") || name.includes("value"))
      return "bg-[#CECBF6]/20 text-[#CECBF6]";
    if (name.includes("loyal")) return "bg-[#DA7756]/10 text-[#DA7756]";
    return "bg-[#F6F4EE] text-[#2C2C2C]";
  };
  const summarySheetRows = React.useMemo(() => {
    const rows: {
      kind: "section" | "data";
      label: string;
      detail: string;
      tag?: string;
    }[] = [];

    rows.push({
      kind: "section",
      label: "POST SALES - PRODUCT SUMMARY",
      detail: "",
      tag: "",
    });

    productData.extendedContent?.productSummaryNew?.identity?.forEach(
      (item) => {
        rows.push({
          kind: "data",
          label: item.field,
          detail: item.detail,
          tag: "Core",
        });
      }
    );

    rows.push({
      kind: "section",
      label: "WE'RE IN IT TODAY",
      detail: "",
      tag: "",
    });
    productData.extendedContent?.productSummaryNew?.today?.forEach((item) => {
      rows.push({
        kind: "data",
        label: item.dimension,
        detail: item.state,
        tag: "Today",
      });
    });

    rows.push({
      kind: "section",
      label: "THE REFERRAL ECONOMICS",
      detail: "",
      tag: "",
    });
    productData.extendedContent?.productSummaryNew?.problemSolves?.forEach(
      (item) => {
        rows.push({
          kind: "data",
          label: item.painPoint,
          detail: item.solution,
          tag: "Economics",
        });
      }
    );

    rows.push({
      kind: "section",
      label: "FEATURE SUMMARY BY MODULE",
      detail: "",
      tag: "",
    });
    productData.userStories?.forEach((story) => {
      rows.push({
        kind: "data",
        label: story.title,
        detail: story.items.join(" | "),
        tag: "Module",
      });
    });

    rows.push({
      kind: "section",
      label: "KEY USP - WHAT MAKES THIS PRODUCT HARD TO IGNORE",
      detail: "",
      tag: "",
    });
    productData.usps?.forEach((usp) => {
      rows.push({ kind: "data", label: "USP", detail: usp, tag: "USP" });
    });

    return rows;
  }, [productData]);

  // ─── 1. Camera + AI face detection ──────────────────────────
  useEffect(() => {
    let timeoutId: number | undefined;

    const initModel = async () => {
      if (cachedModel) {
        setModel(cachedModel);
        setModelLoading(false);
        return;
      }

      // Set a timeout - if model doesn't load in 10 seconds, proceed without it
      timeoutId = window.setTimeout(() => {
        console.warn(
          "Face detection model loading timed out - proceeding without security"
        );
        setModelLoading(false);
      }, 10000);

      try {
        await tf.ready();
        if (tf.getBackend() !== "webgl") {
          await tf.setBackend("webgl");
        }
        const detector = await blazeface.load({
          maxFaces: 3,
          scoreThreshold: 0.75,
        });
        cachedModel = detector;
        setModel(detector);
        setModelLoading(false);
        if (timeoutId) window.clearTimeout(timeoutId);
      } catch (err) {
        console.error("Face detection model failed to load:", err);
        setModelLoading(false);
        if (timeoutId) window.clearTimeout(timeoutId);
      }
    };

    const setupCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraPermission("denied");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 320, height: 240 },
        });
        mediaStreamRef.current = stream;
        setCameraPermission("granted");
      } catch (err) {
        console.error("Camera access denied:", err);
        setCameraPermission("denied");
      }
    };

    initModel();
    setupCamera();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (cameraPermission === "granted" && mediaStreamRef.current) {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStreamRef.current;
      }
      if (previewVideoRef.current && !previewVideoRef.current.srcObject) {
        previewVideoRef.current.srcObject = mediaStreamRef.current;
      }
    }
  }, [cameraPermission]);

  // Face detection interval - USE CASE 1 & 2:
  // When user is in front of camera = show content
  // When user is NOT in front of camera = blank screen
  useEffect(() => {
    let detectionInterval: number | undefined;
    let noFaceCount = 0; // Count consecutive no-face detections

    if (model && cameraPermission === "granted") {
      detectionInterval = window.setInterval(async () => {
        const video = videoRef.current;
        if (
          !video ||
          video.readyState < 2 ||
          video.videoWidth === 0 ||
          video.paused
        )
          return;

        try {
          const predictions = await model.estimateFaces(video, false);
          const detected = predictions.length > 0;

          if (!detected) {
            noFaceCount++;
            // Only trigger blackout after 2 consecutive no-face detections (to avoid flicker)
            if (noFaceCount >= 2) {
              setFaceDetected(false);
              setIsBlurred(true);
            }
          } else {
            noFaceCount = 0;
            setFaceDetected(true);
            setIsBlurred(false);
            setShowBlackout(false);
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }
      }, 800); // Check every 800ms for faster response
    }

    return () => {
      if (detectionInterval) window.clearInterval(detectionInterval);
    };
  }, [model, cameraPermission]);

  // ─── 2. Blackout countdowntimer ───────────────────────────────────────
  useEffect(() => {
    if (!showBlackout) return;
    setCountdown(5);
    const tick = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(tick);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [showBlackout]);

  // ─── 3. Keyboard shortcut blocking ───────────────────────────────────
  useEffect(() => {
    // Flash a pure white blank overlay so any screenshot captures nothing
    const flashBlank = () => {
      setScreenshotBlank(true);
      setTimeout(() => setScreenshotBlank(false), 800);
    };

    const screenshotKeys = [
      (e: KeyboardEvent) => e.key === "PrintScreen",
      // Windows Snipping Tool: Win+Shift+S (shows as Meta+Shift+s in some browsers)
      (e: KeyboardEvent) =>
        e.metaKey && e.shiftKey && e.key.toLowerCase() === "s",
      // Mac screenshot shortcuts
      (e: KeyboardEvent) =>
        e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key),
    ];

    const blockedCombos = [
      // Print
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "p",
      // Save page
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "s",
      // View source
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "u",
      // Select all
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "a",
      // Copy
      (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "c",
      // DevTools
      (e: KeyboardEvent) => e.key === "F12",
      (e: KeyboardEvent) =>
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["i", "j", "c"].includes(e.key.toLowerCase()),
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Screenshot keys: block event AND immediately blank the screen
      if (screenshotKeys.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        flashBlank();
        return;
      }
      // Other prohibited shortcuts: block + show blackout
      if (blockedCombos.some((check) => check(e))) {
        e.preventDefault();
        e.stopPropagation();
        triggerBlackout(
          "Prohibited Action",
          "Screenshot, recording, and developer tools are strictly prohibited on this page."
        );
      }
    };

    // Also blank on keyup for PrintScreen (some OSes fire on keyup)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        flashBlank();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [triggerBlackout]);

  // ─── 4. Right-click & context menu disable ────────────────────────────
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", block);
    return () => window.removeEventListener("contextmenu", block);
  }, []);

  // ─── 5. Visibility change – blur when tab loses focus ────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ─── 6. Window blur (alt+tab, window switch) ─────────────────────────
  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // ─── 7. DevTools open detection (window size delta) ──────────────────
  useEffect(() => {
    const THRESHOLD = 160;
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) {
        triggerBlackout(
          "Developer Tools Detected",
          "Developer tools are not permitted while viewing proprietary product data."
        );
      }
    };
    const interval = window.setInterval(checkDevTools, 1500);
    return () => window.clearInterval(interval);
  }, [triggerBlackout]);

  // ─── 8. CSS print / @media print blackout (injected style) ───────────
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "fm-print-block";
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        body::after {
          content: '🔒 CONFIDENTIAL — PRINTING PROHIBITED';
          visibility: visible !important;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          font-weight: 900;
          color: #FF0000;
          text-align: center;
          white-space: pre-line;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById("fm-print-block")?.remove();
    };
  }, []);

  // ─── 9. Drag-start prevention (drag-to-copy images/text) ─────────────
  useEffect(() => {
    const block = (e: DragEvent) => e.preventDefault();
    document.addEventListener("dragstart", block);
    return () => document.removeEventListener("dragstart", block);
  }, []);

  // Camera permission gate — must grant before seeing content
  if (cameraPermission === "pending") {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
        <div className="w-20 h-20 rounded-full bg-[#DA7756]/10 border border-[#DA7756]/30 flex items-center justify-center mb-6 animate-pulse">
          <Camera className="w-10 h-10 text-[#DA7756]" />
        </div>
        <h1 className="text-3xl font-semibold mb-3 tracking-tight">
          Camera Access Required
        </h1>
        <p className="text-white/60 max-w-md text-sm leading-relaxed mb-8">
          This page contains proprietary product intelligence. To view it, you
          must grant camera access so our security system can verify your
          identity and detect unauthorized recording devices.
        </p>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-xs text-white/40">
          <Lock className="w-3.5 h-3.5" />
          Waiting for camera permission…
        </div>
      </div>
    );
  }

  if (cameraPermission === "denied") {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-semibold mb-3 tracking-tight">
          Access Denied
        </h1>
        <p className="text-white/60 max-w-md text-sm leading-relaxed mb-8">
          Camera permission is required to access this proprietary content.
          Please enable camera access in your browser settings and refresh the
          page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-[#DA7756] hover:bg-[#c5644a] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all"
        >
          <Camera className="w-4 h-4" /> Retry Camera Access
        </button>
      </div>
    );
  }

  // Show loading screen while model is loading (camera permission checks are above)
  if (modelLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
        <div className="w-20 h-20 rounded-full bg-[#DA7756]/10 border border-[#DA7756]/30 flex items-center justify-center mb-6 animate-pulse">
          <Lock className="w-10 h-10 text-[#DA7756]" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">
          Initializing Security...
        </h1>
        <p className="text-white/50 text-sm">
          Loading face detection. Please wait.
        </p>
      </div>
    );
  }

  // USE CASE 2: When user is NOT in front of camera, show blank screen
  const showBlankScreen =
    !faceDetected && model && cameraPermission === "granted";

  return (
    <div
      className={`min-h-screen bg-[#FAF9F6] pb-20 select-none font-poppins transition-all duration-300 ${showBlankScreen ? "blur-3xl brightness-50 pointer-events-none" : ""}`}
    >
      {/* USE CASE 2: Blank screen when no face detected */}
      {showBlankScreen && (
        <div className="fixed inset-0 z-[9998] bg-[#1a1a1a] flex flex-col items-center justify-center text-white text-center px-8">
          <div className="w-20 h-20 rounded-full bg-[#DA7756]/10 border border-[#DA7756]/30 flex items-center justify-center mb-6">
            <Camera className="w-10 h-10 text-[#DA7756]" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">User Not Detected</h1>
          <p className="text-white/50 text-sm max-w-md">
            Please position yourself in front of the camera to view this
            content.
          </p>
        </div>
      )}

      {/* USE CASE 3: Screenshot blank overlay - flashes on screenshot attempt */}
      {screenshotBlank && (
        <div
          className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <Lock className="w-10 h-10 text-[#DA7756] mb-3 opacity-30" />
          <p className="text-[#DA7756]/30 text-xs font-mono tracking-widest">
            CONFIDENTIAL · FM MATRIX
          </p>
        </div>
      )}

      {/* Hidden camera feed for AI detection — must have real dimensions */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={320}
        height={240}
        className="fixed top-0 left-0 opacity-0 pointer-events-none"
        style={{ width: 320, height: 240 }} // ✅ real size, still invisible
      />

      {/* ── Live camera preview badge (top-right) ──────────────────────── */}
      <div className="fixed top-4 right-4 z-[9992] flex flex-col items-center gap-1.5 select-none">
        {/* Circular camera feed */}
        <div className="relative">
          {/* Pulsing ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: isBlurred
                ? "rgba(239,68,68,0.35)"
                : "rgba(74,222,128,0.3)",
              animationDuration: "2s",
            }}
          />
          {/* Border circle */}
          <div
            className="relative rounded-full p-[2px] shadow-xl"
            style={{
              background: isBlurred
                ? "linear-gradient(135deg,#ef4444,#b91c1c)"
                : "linear-gradient(135deg,#4ade80,#16a34a)",
            }}
          >
            <div
              className="rounded-full overflow-hidden bg-black"
              style={{ width: 56, height: 56 }}
            >
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: 56,
                  height: 56,
                  objectFit: "cover",
                  transform: "scaleX(-1)", // mirror front cam
                  display: "block",
                }}
              />
            </div>
          </div>
          {/* Status dot */}
          <div
            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
            style={{ background: isBlurred ? "#ef4444" : "#4ade80" }}
          />
        </div>
        {/* Label */}
        <div className="bg-black/90 border border-white/10 rounded-full px-2.5 py-0.5 flex flex-col items-center gap-0">
          <span className="text-[9px] font-mono text-white/80 tracking-widest uppercase">
            {isBlurred ? "⚠ NO FACE" : "✓ SECURE"}
          </span>
          <span className="text-[7px] font-mono text-white/30 tracking-wider">
            {sessionId}
          </span>
        </div>
      </div>

      {/* Session watermark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden select-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 120px,
            rgba(218,119,86,0.04) 120px,
            rgba(218,119,86,0.04) 121px
          )`,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute whitespace-nowrap text-[#DA7756]/[0.06] font-mono text-xs font-bold tracking-widest"
            style={{
              top: `${10 + i * 12}%`,
              left: "-10%",
              transform: "rotate(-20deg)",
              letterSpacing: "0.3em",
              fontSize: "11px",
            }}
          >
            CONFIDENTIAL · FM MATRIX · {sessionId} · CONFIDENTIAL · FM MATRIX ·{" "}
            {sessionId} · CONFIDENTIAL · FM MATRIX ·
          </div>
        ))}
      </div>

      {/* Blackout Security Overlay */}
      {showBlackout && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white text-center p-10 animate-in fade-in duration-200">
          {/* Animated background grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,#ff000022 0,#ff000022 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#ff000022 0,#ff000022 1px,transparent 1px,transparent 40px)",
            }}
          />
          <ShieldAlert className="w-20 h-20 text-red-500 mb-6 animate-pulse relative z-10" />
          <div className="relative z-10 space-y-3 mb-8">
            <div className="text-red-400 text-xs font-mono tracking-[0.3em] uppercase mb-2">
              ⚠ Security Alert
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-wider">
              {blackoutReason}
            </h1>
            <p className="text-white/60 max-w-lg text-sm leading-relaxed">
              {blackoutSubtitle}
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="text-white/30 font-mono text-xs">
              Session: {sessionId} · Incident logged at {incidentTime}
            </div>
            {countdown > 0 ? (
              <div className="text-white/40 text-xs">
                Dismiss available in {countdown}s…
              </div>
            ) : (
              <button
                onClick={dismissBlackout}
                className="mt-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-all"
              >
                I Understand — Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative mb-8 flex flex-col items-center bg-[#FAF9F6] pt-8">
        <div className="w-full max-w-7xl px-6 lg:px-10 mb-6">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-[#DA7756] border border-[#DA7756]/30 px-3 py-1.5 rounded-full hover:bg-[#DA7756]/10 transition-all font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="text-center w-full max-w-7xl px-6 lg:px-10">
          <div className="inline-block px-4 py-1.5 bg-[#DA7756]/10 text-[#DA7756] text-[10px] font-semibold rounded-full mb-4 tracking-[0.15em] uppercase border border-[#DA7756]/20">
            {productData.industries}
          </div>
          <h1 className="text-4xl font-semibold text-[#2C2C2C] mb-6 tracking-tight lg:text-5xl font-poppins">
            {productData.name}
          </h1>
          <p className="text-sm text-[#2C2C2C]/70 leading-relaxed max-w-3xl mx-auto font-poppins">
            {productData.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl px-6 lg:px-10 mx-auto">
        <Tabs defaultValue="summary" className="w-full">
          {tabsVariant === "snag360" ? (
            <div
              ref={snagTabsScrollRef}
              className="overflow-x-auto no-scrollbar mb-8"
            >
              <div className="flex justify-start pb-2 px-1">
                <TabsList className="inline-flex gap-1 bg-[#E8E5DC] border-[1.31px] border-[#D3D1C7] rounded-full p-1.5 shadow-sm h-auto items-center justify-start">
                  {[
                    { id: "summary", label: "Product Summary" },
                    { id: "features", label: "Features" },
                    { id: "usecases", label: "Use Cases" },
                    { id: "market", label: "Market Analysis" },
                    { id: "pricing", label: "Pricing" },
                    ...(productData.excelLikePostPossession ||
                    productData.extendedContent?.detailedPostPossession
                      ? [{ id: "post-possession", label: "Post Possession" }]
                      : []),
                    { id: "swot", label: "SWOT" },
                    { id: "roadmap", label: "Roadmap" },
                    { id: "enhancements", label: "Enhancements" },
                    { id: "business", label: "Business Plan" },
                    { id: "gtm", label: "GTM Strategy" },
                    { id: "metrics", label: "Metrics" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 whitespace-nowrap flex-shrink-0 bg-transparent"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          ) : (
            /* Default: simple scrollable pill tabs, left-aligned so Product Summary is always visible */
            <div className="overflow-x-auto no-scrollbar mb-8">
              <div className="flex justify-start pb-2 px-1">
                <TabsList className="inline-flex gap-1 bg-[#E8E5DC] border-[1.31px] border-[#D3D1C7] rounded-full p-1.5 shadow-sm h-auto items-center justify-start">
                  {[
                    { id: "summary", label: "Product Summary" },
                    { id: "features", label: "Features" },
                    { id: "market", label: "Market Analysis" },
                    { id: "pricing", label: "Pricing" },
                    { id: "usecases", label: "Use Cases" },
                    { id: "roadmap", label: "Roadmap" },
                    { id: "business", label: "Business Plan" },
                    { id: "gtm", label: "GTM Strategy" },
                    { id: "metrics", label: "Metrics" },
                    { id: "swot", label: "SWOT" },
                    { id: "enhancements", label: "Enhancements" },
                    { id: "assets", label: "Assets" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wider transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 whitespace-nowrap flex-shrink-0 bg-transparent"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          )}

          {/* 1. Summary */}
          <TabsContent value="summary" className="space-y-6">
            {productData.excelLikeSummary ? (
              <div className="animate-fade-in overflow-x-auto rounded-xl border border-[#D3D1C7] bg-[#F6F4EE] p-3 shadow-xl">
                <div
                  className="min-w-[1600px] rounded-md border border-[#D3D1C7] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 py-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border border-[#DA7756]">
                      Post Sales - Product Summary
                    </div>

                    {/* Sheet-style: narrow table on left + blank grid area on right */}
                    <div className="mt-3 flex gap-6">
                      <div className="w-[720px] shrink-0">
                        <table className="w-full border-collapse font-poppins text-[9px] leading-[1.25] bg-white">
                          <thead>
                            <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                              <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-2 py-2 w-[38%] text-left">
                                Field / Section
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-2 py-2 text-left">
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {summarySheetRows.map((row, index) => {
                              if (row.kind === "section") {
                                return (
                                  <tr key={`section-${index}`}>
                                    <td
                                      className="border border-[#DA7756] bg-[#DA7756] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                                      colSpan={2}
                                    >
                                      {row.label}
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr
                                  key={`data-${index}`}
                                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] transition-colors align-top`}
                                >
                                  <td className="border border-[#E5E7EB] bg-[#F6F4EE]/30 px-2 py-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                                    {row.label}
                                  </td>
                                  <td className="border border-[#E5E7EB] bg-white px-2 py-2 text-[#2C2C2C] font-medium whitespace-pre-line">
                                    {row.detail}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Blank grid area (like the sheet) */}
                      <div
                        className="flex-1 min-w-[760px] rounded-sm border border-[#D3D1C7] bg-white"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(212,219,219,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.22) 1px, transparent 1px)",
                          backgroundSize: "34px 24px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in overflow-x-auto">
                <div className="bg-[#DA7756] text-white p-6 rounded-xl">
                  <h2 className="text-2xl font-semibold tracking-tight font-poppins">
                    {productData.name} - Identity
                  </h2>
                  <p className="text-[10px] font-medium opacity-80 tracking-widest mt-1">
                    LOCKATED / GOPHYGITAL | INTERNAL CONFIDENTIAL
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-sm">
                    <tbody>
                      {productData.extendedContent?.productSummaryNew?.identity?.map(
                        (r, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#F6F4EE]/50 transition-colors"
                          >
                            <td className="border-b border-[#E5E7EB] p-4 font-semibold text-[#2C2C2C] w-1/4 bg-[#F6F4EE] font-poppins">
                              {r.field}
                            </td>
                            <td className="border-b border-[#E5E7EB] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins">
                              {r.detail}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#798C5E] text-white p-4 font-semibold text-sm rounded-t-xl font-poppins">
                  The Problem It Solves
                </div>
                <div className="bg-white rounded-b-xl border border-t-0 border-[#D3D1C7] overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#9EC8BA] text-[#2C2C2C] font-semibold">
                        <th className="border-b border-[#E5E7EB] p-4 text-left w-1/4 font-poppins">
                          Pain Point
                        </th>
                        <th className="border-b border-[#E5E7EB] p-4 text-left font-poppins">
                          Our Solution
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent?.productSummaryNew?.problemSolves?.map(
                        (r, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#F6F4EE]/50 transition-colors"
                          >
                            <td className="border-b border-[#E5E7EB] p-4 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                              {r.painPoint}
                            </td>
                            <td className="border-b border-[#E5E7EB] p-4 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins">
                              {r.solution}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#6B9BCC] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
                  Who It Is For
                </div>
                <div className="bg-white rounded-b-xl border border-t-0 border-[#D3D1C7] overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#CECBF6] text-[#2C2C2C] font-semibold">
                        <th className="border-b border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">
                          Role
                        </th>
                        <th className="border-b border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">
                          What They Use It For
                        </th>
                        <th className="border-b border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">
                          Key Frustration Today
                        </th>
                        <th className="border-b border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">
                          What They Gain
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent?.productSummaryNew?.whoItIsFor?.map(
                        (r, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#F6F4EE]/50 transition-colors"
                          >
                            <td className="border-b border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                              {r.role}
                            </td>
                            <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins">
                              {r.useCase}
                            </td>
                            <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-medium leading-relaxed italic font-poppins">
                              {r.frustration}
                            </td>
                            <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold leading-relaxed font-poppins">
                              {r.gain}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
                  Feature Summary
                </div>
                <div className="border border-t-0 border-[#D3D1C7] p-4 text-sm text-[#2C2C2C]/80 bg-white font-medium leading-relaxed rounded-b-xl font-poppins">
                  {productData.extendedContent?.featureSummary ||
                    productData.brief}
                </div>

                <div className="bg-[#798C5E] text-white px-4 py-3 font-semibold text-sm rounded-t-xl font-poppins">
                  Where We Are Today
                </div>
                <div className="bg-white rounded-b-xl border border-t-0 border-[#D3D1C7] overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#9EC8BA] text-[#2C2C2C] font-semibold">
                        <th className="border-b border-[#E5E7EB] p-3 text-center w-1/4 font-poppins">
                          Dimension
                        </th>
                        <th className="border-b border-[#E5E7EB] p-3 text-center w-3/4 font-poppins">
                          Current State
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent?.productSummaryNew?.today?.map(
                        (r, i) => (
                          <tr
                            key={i}
                            className="hover:bg-[#F6F4EE]/50 transition-colors"
                          >
                            <td className="border-b border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE] font-poppins">
                              {r.dimension}
                            </td>
                            <td className="border-b border-[#E5E7EB] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed font-poppins">
                              {r.state}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Post Possession (Excel-style full table) */}
          <TabsContent
            value="post-possession"
            className="space-y-6 animate-fade-in"
          >
            {productData.excelLikePostPossession ? (
              <div className="overflow-x-auto rounded-xl border border-[#D3D1C7] bg-[#F6F4EE] p-3 shadow-xl">
                <div
                  className="min-w-[1400px] rounded-md border border-[#D3D1C7] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="mx-auto w-full max-w-[1200px] pt-4 pb-6">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold uppercase tracking-tight text-[11px] text-center border border-[#DA7756] font-poppins">
                      {productData.extendedContent?.detailedPostPossession
                        ?.title || "Post Possession - Full Table"}
                    </div>

                    {productData.extendedContent?.detailedPostPossession
                      ?.sections?.length ? (
                      <div className="space-y-6 p-4">
                        {productData.extendedContent.detailedPostPossession.sections.map(
                          (section, sIdx) => {
                            const tone =
                              section.tone === "green"
                                ? {
                                    bar: "bg-[#798C5E]",
                                    head: "bg-[#9EC8BA]/20",
                                  }
                                : section.tone === "red"
                                  ? {
                                      bar: "bg-[#E49191]",
                                      head: "bg-[#E49191]/10",
                                    }
                                  : {
                                      bar: "bg-[#DA7756]",
                                      head: "bg-[#CECBF6]/20",
                                    };

                            return (
                              <div
                                key={sIdx}
                                className="border border-[#D3D1C7] bg-white"
                              >
                                <div
                                  className={`border border-[#D3D1C7] ${tone.bar} px-3 py-1.5 text-[10px] font-semibold font-poppins uppercase tracking-wide text-white`}
                                >
                                  {section.title}
                                </div>
                                <table className="w-full border-collapse font-poppins text-[9px] leading-[1.25] text-left">
                                  <thead>
                                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                      {section.columns.map((c, cIdx) => (
                                        <th
                                          key={cIdx}
                                          className={`border border-[#E5E7EB] ${tone.head} px-2 py-2`}
                                        >
                                          {c}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {section.rows.map((row, rIdx) => (
                                      <tr
                                        key={rIdx}
                                        className={`${rIdx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} align-top hover:bg-[#F6F4EE] transition-colors`}
                                      >
                                        {row.map((cell, cellIdx) => (
                                          <td
                                            key={cellIdx}
                                            className="border border-[#E5E7EB] px-2 py-2 whitespace-pre-line"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                        Post Possession Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                Post Possession UI Coming Soon
              </div>
            )}
          </TabsContent>

          {/* 2. Features */}
          <TabsContent value="features" className="space-y-6">
            <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-semibold font-poppins uppercase tracking-tight">
                {productData.name} - Feature List
              </h2>
            </div>
            <div className="bg-[#F6F4EE] p-3 border-x border-[#D3D1C7]">
              <p className="text-[10px] text-[#2C2C2C]/60 font-medium leading-relaxed font-poppins">
                {productData.excelLikeFeatures
                  ? "Feature list shown in spreadsheet layout with module bands and USP markers."
                  : "All features from product brief. USP rows highlighted in blue. Star (*) denotes unique competitive advantage."}
              </p>
            </div>

            {productData.excelLikeFeatures ? (
              <div
                className="overflow-x-auto border border-[#D3D1C7] bg-[#F6F4EE] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <div className="min-w-[1700px] bg-transparent">
                  <div className="bg-[#DA7756] text-white border border-[#DA7756] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                    Feature Summary by Module — What’s in the platform
                  </div>

                  <div className="mt-2 flex gap-6">
                    {/* Left: sheet table */}
                    <div className="w-[980px] shrink-0 bg-white border border-[#E5E7EB]">
                      <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                        <thead>
                          <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                            <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[6%]">
                              #
                            </th>
                            <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                              Module
                            </th>
                            <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                              Feature
                            </th>
                            <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                              Sub Feature
                            </th>
                            <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[28%]">
                              Description
                            </th>
                            <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[5%]">
                              User
                            </th>
                            <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[3%]">
                              USP
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const items =
                              productData.extendedContent?.detailedFeatures ??
                              [];
                            type Group = {
                              moduleKey: string;
                              moduleLabel: string;
                              items: typeof items;
                            };
                            const groups: Group[] = [];

                            items.forEach((it) => {
                              const key = it.module.trim().toLowerCase();
                              const last = groups[groups.length - 1];
                              if (!last || last.moduleKey !== key) {
                                groups.push({
                                  moduleKey: key,
                                  moduleLabel: getDisplayModule(it.module),
                                  items: [it],
                                });
                              } else {
                                last.items.push(it);
                              }
                            });

                            let globalRowIdx = 0;
                            return groups.map((g) =>
                              g.items.map((f, localIdx) => {
                                const i = globalRowIdx++;
                                const zebra =
                                  i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50";
                                const showModuleCell = localIdx === 0;
                                const rowSpan = g.items.length;

                                return (
                                  <tr
                                    key={`${g.moduleKey}-${localIdx}-${f.feature}`}
                                    className={`${zebra} hover:bg-[#F6F4EE] align-top`}
                                  >
                                    <td className="border border-[#E5E7EB] px-1 py-1 text-center font-bold text-[#2C2C2C]/60">
                                      {excelFeatureRowStart + i}
                                    </td>

                                    {showModuleCell && (
                                      <td
                                        rowSpan={rowSpan}
                                        className={`border border-[#E5E7EB] px-1.5 py-1 font-semibold align-top ${getModuleTone(f.module)}`}
                                      >
                                        {g.moduleLabel}
                                      </td>
                                    )}

                                    <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                      {f.feature}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {f.subFeatures}
                                    </td>
                                    <td
                                      className={`border border-[#E5E7EB] px-1.5 py-1 whitespace-pre-line break-words ${
                                        f.usp
                                          ? "text-[#6B9BCC] font-semibold"
                                          : "text-[#2C2C2C]/80"
                                      }`}
                                    >
                                      {f.works || ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] px-1 py-1 text-center font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                      {f.userType}
                                    </td>
                                    <td
                                      className={`border border-[#E5E7EB] px-1 py-1 text-center font-semibold uppercase text-[8px] ${
                                        f.usp
                                          ? "bg-[#9EC8BA]/30 text-[#798C5E]"
                                          : "bg-white text-[#D3D1C7]"
                                      }`}
                                    >
                                      {f.usp ? "YES" : "-"}
                                    </td>
                                  </tr>
                                );
                              })
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Right: blank grid area (like the sheet) */}
                    <div
                      className="flex-1 min-w-[620px] rounded-sm border border-[#D3D1C7] bg-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(212,219,219,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.22) 1px, transparent 1px)",
                        backgroundSize: "34px 24px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#F6F4EE] p-3 border-x border-[#D3D1C7]">
                  <p className="text-[10px] text-[#2C2C2C]/60 font-semibold italic leading-relaxed">
                    <span className="text-[#DA7756]">
                      ★ USP features highlighted in orange
                    </span>{" "}
                    | Current scope: Projects - Tasks - Issues - Sprints -
                    Channels - MoM - Opportunity Register - Documents - Todo -
                    Notifications
                  </p>
                </div>
                <div className="overflow-x-auto border border-[#D3D1C7] rounded-b-xl shadow-lg">
                  <table className="w-full border-collapse text-[10px] bg-white font-poppins">
                    <thead>
                      <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center">
                        <th className="border border-[#D3D1C7] p-3 w-[5%]">
                          #
                        </th>
                        <th className="border border-[#D3D1C7] p-3 w-[15%] text-left">
                          Module / Section
                        </th>
                        <th className="border border-[#D3D1C7] p-3 w-[15%] text-left">
                          Feature Name
                        </th>
                        {productData.extendedContent?.detailedFeatures?.some(
                          (f) => f.subFeatures !== ""
                        ) && (
                          <th className="border border-[#D3D1C7] p-3 w-[20%] text-left">
                            Sub-Features
                          </th>
                        )}
                        <th className="border border-[#D3D1C7] p-3 text-left">
                          How It Currently Works
                        </th>
                        {productData.extendedContent?.detailedFeatures?.some(
                          (f) => f.userType !== "All" && f.userType !== ""
                        ) && (
                          <th className="border border-[#D3D1C7] p-3 w-[10%]">
                            User Type
                          </th>
                        )}
                        <th className="border border-[#D3D1C7] p-3 w-[8%]">
                          USP?
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent?.detailedFeatures?.map(
                        (f, i) => (
                          <tr
                            key={i}
                            className={`hover:bg-[#F6F4EE] transition-colors ${f.usp ? "bg-[#F6F4EE]/50 font-semibold" : ""}`}
                          >
                            <td className="border border-[#D3D1C7] p-3 text-center font-semibold text-[#2C2C2C]/60">
                              {i + 1}
                            </td>
                            <td className="border border-[#D3D1C7] p-3 font-semibold text-[#DA7756] uppercase bg-[#F6F4EE]/30">
                              {f.module}
                            </td>
                            <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-semibold">
                              {f.feature}
                            </td>
                            {productData.extendedContent?.detailedFeatures?.some(
                              (ft) => ft.subFeatures !== ""
                            ) && (
                              <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C]/80 leading-relaxed font-medium">
                                {f.subFeatures}
                              </td>
                            )}
                            <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                              {f.works}
                            </td>
                            {productData.extendedContent?.detailedFeatures?.some(
                              (ft) =>
                                ft.userType !== "All" && ft.userType !== ""
                            ) && (
                              <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C]/60 font-semibold text-center uppercase tracking-tighter">
                                {f.userType}
                              </td>
                            )}
                            <td className="border border-[#D3D1C7] p-3 text-center">
                              {f.usp && (
                                <div className="flex items-center justify-center text-[#DA7756] text-sm">
                                  <span>★</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>
          {/* 3. Market */}
          <TabsContent value="market" className="space-y-8">
            <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                {productData.name} - Market Analysis
              </h2>
            </div>
            {productData.excelLikeMarket &&
            productData.extendedContent?.detailedMarketAnalysis
              ?.marketMatrixRows ? (
              <div
                className="overflow-x-auto border border-[#E5E7EB] bg-[#F6F4EE] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <table className="w-[1280px] border-collapse bg-white text-[9px] leading-[1.2] font-poppins">
                  <thead>
                    <tr className="bg-[#DA7756] text-white">
                      <th
                        className="border border-[#DA7756] px-2 py-1.5 text-center font-semibold"
                        colSpan={12}
                      >
                        Post Sales - Market Analysis
                      </th>
                    </tr>
                    <tr className="bg-[#DA7756]/80 text-white/90">
                      <th
                        className="border border-[#DA7756] px-2 py-1 text-left text-[8px] font-semibold"
                        colSpan={12}
                      >
                        {productData.extendedContent.detailedMarketAnalysis
                          .marketMatrixSubtitle ||
                          "Behavior / price sensitivity / trust barrier / incumbent intensity / strategic fit"}
                      </th>
                    </tr>
                    <tr className="bg-[#DA7756]/90 text-white">
                      <th
                        className="border border-[#DA7756] px-1.5 py-1 text-left font-semibold uppercase"
                        colSpan={12}
                      >
                        Section 1: Target Audience | Who we sell to, what pains
                        them, and what shifts them to us
                      </th>
                    </tr>
                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                      <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1.5 py-1 text-left">
                        Who Is This Today
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#CECBF6]/15 px-1.5 py-1 text-left">
                        Who We Sell To
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-left">
                        Sub-Sector
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left">
                        What Budget They Have
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#9EC8BA]/20 px-1.5 py-1 text-left">
                        How They Buy
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#CECBF6]/15 px-1.5 py-1 text-left">
                        Who They Use Today
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left">
                        How Ready They Are
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#DA7756]/10 px-1.5 py-1 text-left">
                        What Makes Them Switch
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left">
                        What Win Looks Like
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left">
                        Big Risk
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left">
                        Entry Wedge
                      </th>
                      <th className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-left">
                        Opportunity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent.detailedMarketAnalysis.marketMatrixRows.map(
                      (r, i) => (
                        <tr key={i} className="hover:bg-[#F6F4EE] align-top">
                          <td className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 font-bold text-[#2C2C2C]">
                            {r.segment}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#F6F4EE]/50 px-1.5 py-1 text-[#2C2C2C]">
                            {r.whoToday}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#F6F4EE]/30 px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.subsector}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.budget}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#9EC8BA]/15 px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.purchasePattern}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.incumbents}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.readiness}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#DA7756]/10 px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.trigger}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 font-semibold text-[#6B9BCC]">
                            {r.payoff}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.risk}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-[#2C2C2C]/80">
                            {r.entryWedge}
                          </td>
                          <td className="border border-[#E5E7EB] bg-[#CECBF6]/15 px-1.5 py-1 font-semibold text-[#798C5E]">
                            {r.opportunity}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : productData.excelLikeMarket &&
              productData.extendedContent?.detailedMarketAnalysis &&
              (productData.extendedContent.detailedMarketAnalysis.targetAudience
                ?.length ||
                productData.extendedContent.detailedMarketAnalysis
                  .competitorMapping?.length) ? (
              <div
                className="overflow-x-auto border border-[#E5E7EB] bg-[#F6F4EE] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <div className="min-w-[1850px] bg-transparent">
                  <div className="bg-[#DA7756] text-white border border-[#DA7756] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                    Post Possession — Market Analysis
                  </div>

                  <div className="mt-2 flex gap-6">
                    <div className="w-[1120px] shrink-0 space-y-4">
                      {!!productData.extendedContent.detailedMarketAnalysis
                        .targetAudience?.length && (
                        <>
                          <div className="bg-[#DA7756]/90 text-white border border-[#DA7756] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                            Part A — Customer segments and buying context
                          </div>
                          <div className="bg-white border border-[#E5E7EB]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                              <thead>
                                <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                    Segment
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[16%]">
                                    Decision maker
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                    Pain points
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                    What happens if not solved
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                    Good enough today
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedMarketAnalysis.targetAudience!.map(
                                  (t, i) => (
                                    <tr
                                      key={i}
                                      className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] align-top`}
                                    >
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                        {t.segment}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-semibold break-words">
                                        {t.industry}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {t.painPoints}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {t.notSolved}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {t.goodEnough}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {!!productData.extendedContent.detailedMarketAnalysis
                        .competitorMapping?.length && (
                        <>
                          <div className="bg-[#DA7756]/90 text-white border border-[#DA7756] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                            Part B — Competitor mapping
                          </div>
                          <div className="bg-white border border-[#E5E7EB]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                              <thead>
                                <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[14%]">
                                    Competitor
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[14%]">
                                    Target customer
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[12%]">
                                    Pricing
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[14%]">
                                    Discovery
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                    Strongest features
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[14%]">
                                    Weakness
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[14%]">
                                    Market gaps
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedMarketAnalysis.competitorMapping!.map(
                                  (c, i) => (
                                    <tr
                                      key={i}
                                      className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] align-top`}
                                    >
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                        {c.name}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {c.targetCustomer}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {c.pricing}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {c.discovery}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#798C5E] font-semibold whitespace-pre-line break-words">
                                        {c.strongestFeatures}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#b91c1c] font-semibold whitespace-pre-line break-words">
                                        {c.weakness}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#6B9BCC] font-semibold whitespace-pre-line break-words">
                                        {c.marketGaps}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(212,219,219,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.22) 1px, transparent 1px)",
                        backgroundSize: "34px 24px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : productData.extendedContent?.detailedMarketAnalysis ? (
              <>
                <div className="bg-[#F6F4EE] p-2 border-x border-[#C4B89D]">
                  <p className="text-[10px] text-[#DA7756] font-semibold italic font-poppins">
                    India Primary | Global Secondary | Data as of Q1 2026 | All
                    pricing verified from public sources
                  </p>
                </div>

                {productData.extendedContent?.detailedMarketAnalysis
                  ?.targetAudience && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase font-poppins">
                      PART A — TARGET AUDIENCE (India and GCC Only)
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                            <th className="border border-[#C4B89D] p-3 w-[15%]">
                              Audience Segment
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[15%]">
                              Demographics
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[15%]">
                              Industry
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[20%]">
                              Pain Points (3 per segment)
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[15%]">
                              What Happens If NOT Solved
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[15%]">
                              What 'Good Enough' Looks Like Today
                            </th>
                            {productData.extendedContent.detailedMarketAnalysis
                              .targetAudience[0]?.urgency && (
                              <th className="border border-[#C4B89D] p-3 w-[5%]">
                                Urgency
                              </th>
                            )}
                            {productData.extendedContent.detailedMarketAnalysis
                              .targetAudience[0]?.primaryBuyer && (
                              <th className="border border-[#C4B89D] p-3 w-[10%]">
                                Primary Buyer
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.targetAudience.map(
                            (t, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors"
                              >
                                <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756]">
                                  {t.segment}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                  {t.demographics}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] font-semibold">
                                  {t.industry}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                                  {t.painPoints}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#C72030] font-medium leading-relaxed">
                                  {t.notSolved}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-medium">
                                  {t.goodEnough}
                                </td>
                                {t.urgency && (
                                  <td
                                    className={`border border-[#C4B89D] p-3 font-semibold text-center ${t.urgency === "HIGH" ? "text-[#798C5E] bg-[#9EC8BA]/20" : "text-[#2C2C2C]/80"}`}
                                  >
                                    {t.urgency}
                                  </td>
                                )}
                                {t.primaryBuyer && (
                                  <td className="border border-[#C4B89D] p-3 text-[#DA7756] font-semibold">
                                    {t.primaryBuyer}
                                  </td>
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedMarketAnalysis
                  ?.companyPainPoints && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase font-poppins">
                      PART A.2 — COMPANY-LEVEL PAIN POINTS (India and GCC)
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                            <th className="border border-[#C4B89D] p-3 w-[20%]">
                              Company Type
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[20%]">
                              Pain 1
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[20%]">
                              Pain 2
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[20%]">
                              Pain 3
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[20%]">
                              Cost / Risk if unsolved
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.companyPainPoints.map(
                            (c, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors"
                              >
                                <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] bg-[#CECBF6]/10">
                                  {c.companyType}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                                  {c.pain1}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                                  {c.pain2}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                                  {c.pain3}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#C72030] font-semibold leading-relaxed">
                                  {c.costRisk}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedMarketAnalysis
                  ?.competitorMapping && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase font-poppins">
                      PART B — COMPETITOR MAPPING (India and GCC)
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                            <th className="border border-[#C4B89D] p-3">
                              Competitor Name / Type
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              Primary Target Customer
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              Pricing Model & Price
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              How Buyers Discover Them
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              Strongest Features & USPs
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              Weaknesses
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              Market Gaps & How We Exploit
                            </th>
                            <th className="border border-[#C4B89D] p-3">
                              Their Innovations That Threaten Us
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedMarketAnalysis.competitorMapping.map(
                            (c, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors"
                              >
                                <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] bg-[#F6F4EE]">
                                  {c.name}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed bg-[#F6F4EE]">
                                  {c.targetCustomer}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] italic bg-[#F6F4EE]">
                                  {c.pricing}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed bg-[#F6F4EE]">
                                  {c.discovery}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#798C5E] font-semibold leading-relaxed bg-[#F6F4EE]">
                                  {c.strongestFeatures}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-red-700 font-semibold leading-relaxed bg-[#F6F4EE]">
                                  {c.weakness}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#6B9BCC] font-semibold leading-relaxed bg-[#F6F4EE]">
                                  {c.marketGaps}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#CECBF6] font-medium italic bg-[#F6F4EE]">
                                  {c.threats}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Legacy schema fallbacks */}
                {productData.extendedContent?.detailedMarketAnalysis
                  ?.marketSize &&
                  !productData.extendedContent?.detailedMarketAnalysis
                    ?.targetAudience && (
                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase font-poppins">
                        Market Size and Growth
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-center font-poppins">
                          <thead>
                            <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Segment
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[10%] text-center">
                                2024/25 Val
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[10%] text-center">
                                2026 Val
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[15%] text-center">
                                Forecast
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[8%] text-center">
                                CAGR
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%] text-left">
                                Key Driver
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[22%] text-left">
                                India Relevance
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedMarketAnalysis.marketSize.map(
                              (m, i) => (
                                <tr
                                  key={i}
                                  className="hover:bg-[#F6F4EE] transition-colors"
                                >
                                  <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] uppercase bg-[#F6F4EE]/50">
                                    {m.segment}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium">
                                    {m.val2425}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] font-semibold">
                                    {m.val26}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium italic">
                                    {m.forecast}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-center font-semibold text-[#6B9BCC]">
                                    {m.cagr}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed font-medium text-left">
                                    {m.driver}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#6B9BCC] leading-relaxed font-semibold text-left">
                                    {m.india}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {productData.extendedContent?.detailedMarketAnalysis
                  ?.competitors &&
                  !productData.extendedContent?.detailedMarketAnalysis
                    ?.competitorMapping && (
                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase font-poppins">
                        Competitor Analysis - Top 10
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[9px] bg-white font-poppins">
                          <thead>
                            <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center">
                              <th className="border border-[#C4B89D] p-3">
                                Competitor
                              </th>
                              <th className="border border-[#C4B89D] p-3">
                                HQ / Focus
                              </th>
                              <th className="border border-[#C4B89D] p-3">
                                India Pricing
                              </th>
                              <th className="border border-[#C4B89D] p-3">
                                Global Pricing
                              </th>
                              <th className="border border-[#C4B89D] p-3 text-left">
                                Key Strength
                              </th>
                              <th className="border border-[#C4B89D] p-3 text-left">
                                Key Weakness
                              </th>
                              <th className="border border-[#C4B89D] p-3">
                                Sovereignty
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedMarketAnalysis.competitors.map(
                              (comp, i) => (
                                <tr
                                  key={i}
                                  className="hover:bg-[#F6F4EE] transition-colors"
                                >
                                  <td className="border border-[#C4B89D] p-2 text-[#2C2C2C] font-semibold">
                                    {comp.name}
                                  </td>
                                  <td className="border border-[#C4B89D] p-2 text-[#2C2C2C]/60 font-medium text-center">
                                    {comp.hq}
                                  </td>
                                  <td className="border border-[#C4B89D] p-2 text-[#DA7756] font-semibold text-center">
                                    {comp.indiaPrice}
                                  </td>
                                  <td className="border border-[#C4B89D] p-2 text-[#2C2C2C]/80 font-medium text-center italic">
                                    {comp.globalPrice}
                                  </td>
                                  <td className="border border-[#C4B89D] p-2 text-[#798C5E] font-semibold leading-tight">
                                    {comp.strength}
                                  </td>
                                  <td className="border border-[#C4B89D] p-2 text-red-700 font-semibold leading-tight">
                                    {comp.weakness}
                                  </td>
                                  <td className="border border-[#C4B89D] p-2 text-center font-semibold uppercase text-[8px]">
                                    {comp.sovereignty}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                      {productData.extendedContent.detailedMarketAnalysis
                        .competitorSummary && (
                        <div className="bg-[#DA7756] text-white p-3 text-[10px] font-semibold uppercase tracking-tight rounded-b-xl font-poppins">
                          <span className="text-white/80">SUMMARY:</span>{" "}
                          {
                            productData.extendedContent.detailedMarketAnalysis
                              .competitorSummary
                          }
                        </div>
                      )}
                    </div>
                  )}
              </>
            ) : (
              <div className="p-20 text-center text-[#2C2C2C]/60 font-semibold uppercase text-xl border-4 border-dashed rounded-[3rem]">
                Market Analysis Data Coming Soon
              </div>
            )}
          </TabsContent>

          {/* 4. Pricing */}
          <TabsContent value="pricing" className="space-y-10">
            <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                {productData.name} — Features & Pricing
              </h2>
            </div>
            {productData.excelLikePricing &&
            productData.extendedContent?.detailedPricing ? (
              <div
                className="overflow-x-auto border border-[#E5E7EB] bg-[#F6F4EE] p-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                  backgroundSize: "34px 24px",
                }}
              >
                <div className="min-w-[1850px] bg-transparent">
                  <div className="mt-2 flex gap-6">
                    <div className="w-[1180px] shrink-0 space-y-3">
                      <table className="w-full border-collapse bg-white text-[9px] leading-[1.2] font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756] text-white">
                            <th
                              className="border border-[#DA7756] px-2 py-1.5 text-center font-semibold"
                              colSpan={6}
                            >
                              Post Sales - Features & Pricing
                            </th>
                          </tr>
                          <tr className="bg-[#DA7756]/80 text-white/90">
                            <th
                              className="border border-[#DA7756] px-2 py-1 text-left text-[8px] font-semibold"
                              colSpan={6}
                            >
                              {productData.extendedContent.detailedPricing
                                .pricingMatrixSubtitle ||
                                "Section 1 compares current feature depth vs market expectations and highlights where positioning is strongest or vulnerable."}
                            </th>
                          </tr>
                          <tr className="bg-[#DA7756]/90 text-white">
                            <th
                              className="border border-[#DA7756] px-1.5 py-1 text-left font-semibold uppercase"
                              colSpan={6}
                            >
                              Section 1: Current features vs market standard |
                              Where we are strong, where we are weak
                            </th>
                          </tr>
                          <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                            <th className="border border-[#E5E7EB] bg-[#CECBF6]/15 px-1.5 py-1 text-left w-[18%]">
                              Feature / Capability
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-left w-[18%]">
                              Current State
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#9EC8BA]/15 px-1.5 py-1 text-left w-[18%]">
                              What Market Expects
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left w-[18%]">
                              How This Helps / Hurts Us
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-center w-[8%]">
                              Status
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#DA7756]/10 px-1.5 py-1 text-left w-[20%]">
                              Recommended Move
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.pricingFeatureRows?.map(
                            (row, index) => {
                              const tone = row.status.toUpperCase();
                              const statusClass =
                                tone.includes("AHEAD") ||
                                tone.includes("STRONG")
                                  ? "bg-[#9EC8BA]/30 text-[#798C5E]"
                                  : tone.includes("PAR") || tone.includes("OK")
                                    ? "bg-[#F6F4EE] text-[#92400e]"
                                    : "bg-[#fde2ec] text-[#be123c]";

                              return (
                                <tr
                                  key={index}
                                  className="align-top hover:bg-[#F6F4EE]"
                                >
                                  <td className="border border-[#E5E7EB] bg-[#F6F4EE]/50 px-1.5 py-1 font-bold text-[#2C2C2C]">
                                    {row.capability}
                                  </td>
                                  <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                                    {row.currentState}
                                  </td>
                                  <td className="border border-[#E5E7EB] bg-[#9EC8BA]/10 px-1.5 py-1 text-[#2C2C2C]/80">
                                    {row.marketNeed}
                                  </td>
                                  <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-[#2C2C2C]/80">
                                    {row.impact}
                                  </td>
                                  <td
                                    className={`border border-[#E5E7EB] px-1 py-1 text-center font-semibold uppercase ${statusClass}`}
                                  >
                                    {row.status}
                                  </td>
                                  <td className="border border-[#E5E7EB] bg-[#DA7756]/10 px-1.5 py-1 text-[#DA7756]">
                                    {row.recommendation}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>

                      {!!productData.extendedContent.detailedPricing
                        .pricingSummaryRows?.length && (
                        <table className="w-full border-collapse bg-white text-[9px] leading-[1.2] font-poppins">
                          <tbody>
                            {productData.extendedContent.detailedPricing.pricingSummaryRows.map(
                              (row, index) => {
                                const toneClass =
                                  row.tone === "green"
                                    ? "bg-[#9EC8BA]/20 text-[#798C5E]"
                                    : row.tone === "yellow"
                                      ? "bg-[#F6F4EE] text-[#92400e]"
                                      : "bg-[#fef2f2] text-[#b91c1c]";
                                return (
                                  <tr key={index}>
                                    <td
                                      className={`w-[26%] border border-[#E5E7EB] px-2 py-1 font-semibold uppercase ${toneClass}`}
                                    >
                                      {row.label}
                                    </td>
                                    <td
                                      className={`border border-[#E5E7EB] px-2 py-1 ${toneClass}`}
                                    >
                                      {row.detail}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      )}

                      <table className="w-full border-collapse bg-white text-[9px] leading-[1.2] font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756]/90 text-white">
                            <th
                              className="border border-[#DA7756] px-1.5 py-1 text-left font-semibold uppercase"
                              colSpan={2}
                            >
                              Section 2: Current pricing and plans | What we
                              charge and how it lands
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.pricingCurrentRows?.map(
                            (row, index) => (
                              <tr key={index}>
                                <td className="w-[24%] border border-[#E5E7EB] bg-[#CECBF6]/10 px-2 py-1 font-bold text-[#2C2C2C]">
                                  {row.label}
                                </td>
                                <td className="border border-[#E5E7EB] bg-white px-2 py-1 text-[#2C2C2C]/80">
                                  {row.detail}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                      <table className="w-full border-collapse bg-white text-[9px] leading-[1.2] font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756]/90 text-white">
                            <th
                              className="border border-[#DA7756] px-1.5 py-1 text-left font-semibold uppercase"
                              colSpan={3}
                            >
                              Section 3: Positioning | Why this offer is hard to
                              ignore
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.pricingPositioningRows?.map(
                            (row, index) => (
                              <tr key={index} className="align-top">
                                <td className="w-[22%] border border-[#E5E7EB] bg-[#F6F4EE]/50 px-2 py-1 font-bold text-[#2C2C2C]">
                                  {row.question}
                                </td>
                                <td className="border border-[#E5E7EB] bg-white px-2 py-1 text-[#2C2C2C]/80">
                                  {row.answer}
                                </td>
                                <td className="w-[22%] border border-[#E5E7EB] bg-[#DA7756]/10 px-2 py-1 text-[#DA7756]">
                                  {row.note}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                      <table className="w-full border-collapse bg-white text-[9px] leading-[1.2] font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756]/90 text-white">
                            <th
                              className="border border-[#DA7756] px-1.5 py-1 text-left font-semibold uppercase"
                              colSpan={4}
                            >
                              Section 4: Value proposition and suggested
                              improvements
                            </th>
                          </tr>
                          <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                            <th className="border border-[#E5E7EB] bg-[#CECBF6]/15 px-1.5 py-1 text-left w-[25%]">
                              Current Prop
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-1.5 py-1 text-left w-[22%]">
                              Suggested Fix
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#9EC8BA]/15 px-1.5 py-1 text-left w-[28%]">
                              Improved Framing
                            </th>
                            <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 text-left w-[25%]">
                              Why It Matters
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.pricingImprovementRows?.map(
                            (row, index) => (
                              <tr key={index} className="align-top">
                                <td className="border border-[#E5E7EB] bg-[#F6F4EE]/50 px-2 py-1 text-[#2C2C2C] font-bold">
                                  {row.currentProp}
                                </td>
                                <td className="border border-[#E5E7EB] bg-[#CECBF6]/10 px-2 py-1 text-[#6B9BCC]">
                                  {row.suggestedFix}
                                </td>
                                <td className="border border-[#E5E7EB] bg-[#9EC8BA]/10 px-2 py-1 text-[#798C5E]">
                                  {row.improvedFraming}
                                </td>
                                <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-2 py-1 text-[#DA7756]">
                                  {row.whyItWins}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Right: blank grid area like the sheet */}
                    <div
                      className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(212,219,219,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.22) 1px, transparent 1px)",
                        backgroundSize: "34px 24px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : productData.extendedContent?.detailedPricing ? (
              <>
                <div className="bg-[#F6F4EE] p-2 border-x border-[#C4B89D]">
                  <p className="text-[10px] text-[#DA7756] font-semibold italic uppercase tracking-tighter font-poppins">
                    AHEAD = Leader | AT PAR = Equal | GAP = Lagging | Q1 2026
                    data
                  </p>
                </div>

                {productData.extendedContent?.detailedPricing
                  ?.featuresVsMarket && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase italic tracking-wider font-poppins">
                      SECTION 1 — CURRENT FEATURES VS MARKET STANDARD
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center">
                            <th className="border border-[#C4B89D] p-3 w-[15%] text-left">
                              Feature Area
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[25%] text-left">
                              Market Standard
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[25%] text-left">
                              Our Product
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[10%] text-center">
                              Status
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[25%] text-left">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.featuresVsMarket.map(
                            (f, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors"
                              >
                                <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] leading-relaxed">
                                  {f.featureArea}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed font-medium">
                                  {f.marketStandard}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#6B9BCC] font-medium leading-relaxed bg-[#6B9BCC]/10 whitespace-pre-line">
                                  {f.ourProduct}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-center">
                                  <span
                                    className={`px-2 py-1.5 rounded font-semibold text-[9px] uppercase tracking-tighter block text-white shadow-sm
                                  ${f.status.includes("AHEAD") ? "bg-[#798C5E]" : f.status.includes("AT PAR") ? "bg-[#C4B89D] text-[#2C2C2C]" : "bg-red-600"}`}
                                  >
                                    {f.status}
                                  </span>
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                                  {f.summary}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing
                  ?.comparisonSummary && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-semibold font-poppins">
                        <tbody>
                          <tr className="hover:bg-[#F6F4EE] transition-colors">
                            <td className="border border-[#C4B89D] p-4 w-[20%] font-semibold text-green-700 bg-green-50 uppercase">
                              WHERE WE ARE AHEAD
                            </td>
                            <td className="border border-[#C4B89D] p-4 text-green-800 leading-relaxed bg-green-50/30 whitespace-pre-line">
                              {
                                productData.extendedContent.detailedPricing
                                  .comparisonSummary.ahead
                              }
                            </td>
                          </tr>
                          <tr className="hover:bg-[#F6F4EE] transition-colors">
                            <td className="border border-[#C4B89D] p-4 w-[20%] font-semibold text-yellow-700 bg-yellow-50 uppercase">
                              AT PAR
                            </td>
                            <td className="border border-[#C4B89D] p-4 text-yellow-800 leading-relaxed bg-yellow-50/30 whitespace-pre-line">
                              {
                                productData.extendedContent.detailedPricing
                                  .comparisonSummary.atPar
                              }
                            </td>
                          </tr>
                          <tr className="hover:bg-[#F6F4EE] transition-colors">
                            <td className="border border-[#C4B89D] p-4 w-[20%] font-semibold text-red-700 bg-red-50 uppercase tracking-tighter leading-tight italic">
                              GAPS THAT WILL COST DEALS
                            </td>
                            <td className="border border-[#C4B89D] p-4 text-red-800 leading-relaxed bg-red-50/30 whitespace-pre-line">
                              {
                                productData.extendedContent.detailedPricing
                                  .comparisonSummary.gaps
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing
                  ?.pricingLandscape && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase italic tracking-wider">
                      SECTION 2 — PRICING LANDSCAPE
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <tbody>
                          {productData.extendedContent.detailedPricing.pricingLandscape.map(
                            (p, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors border-b border-[#C4B89D] last:border-0 font-medium"
                              >
                                <td className="p-4 font-semibold text-[#DA7756] bg-[#F6F4EE]/30 w-[20%] border-r border-[#C4B89D] uppercase italic tracking-tight">
                                  {p.tier}
                                </td>
                                <td className="p-4 text-[#2C2C2C] leading-relaxed bg-white w-[80%] whitespace-pre-line">
                                  {p.model}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing?.positioning && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase italic tracking-wider">
                      SECTION 3 — HOW TO POSITION OURSELVES
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <tbody>
                          {productData.extendedContent.detailedPricing.positioning.map(
                            (p, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors border-b border-[#C4B89D] last:border-0 font-medium"
                              >
                                <td className="p-4 font-semibold text-[#DA7756] bg-[#F6F4EE]/30 w-[20%] border-r border-[#C4B89D] uppercase italic tracking-tight">
                                  {p.category}
                                </td>
                                <td className="p-4 text-[#2C2C2C] leading-relaxed bg-white w-[80%] whitespace-pre-line">
                                  {p.description}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {productData.extendedContent?.detailedPricing
                  ?.valuePropositions && (
                  <div className="space-y-4">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                      PART D — VALUE PROPOSITIONS & IMPROVEMENTS
                    </div>
                    <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                      <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                        <thead>
                          <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center">
                            <th className="border border-[#C4B89D] p-3 w-[25%] text-left">
                              Current Value Proposition
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[20%] text-left">
                              Segment It Addresses
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[25%] text-left">
                              Weakness in Current Framing
                            </th>
                            <th className="border border-[#C4B89D] p-3 w-[30%] text-left">
                              Sharpened or Expanded Version
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.extendedContent.detailedPricing.valuePropositions.map(
                            (v, i) => (
                              <tr
                                key={i}
                                className="hover:bg-[#F6F4EE] transition-colors"
                              >
                                <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] leading-relaxed">
                                  {v.currentProp}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed font-medium">
                                  {v.segment}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-red-800 font-medium leading-relaxed bg-red-50/50">
                                  {v.weakness}
                                </td>
                                <td className="border border-[#C4B89D] p-3 text-[#2E7D32] font-medium leading-relaxed bg-green-50/30 whitespace-pre-line">
                                  {v.sharpened}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Legacy fallback */}
                {productData.extendedContent?.detailedPricing
                  ?.pricingLandscape &&
                  !productData.extendedContent?.detailedPricing
                    ?.currentPricingMarket && (
                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold text-sm uppercase italic">
                        Pricing & Target Segments
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white font-poppins">
                          <thead>
                            <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center">
                              <th className="border border-[#C4B89D] p-3">
                                Tier
                              </th>
                              <th className="border border-[#C4B89D] p-3 text-left">
                                Pricing Model
                              </th>
                              <th className="border border-[#C4B89D] p-3">
                                India Price
                              </th>
                              <th className="border border-[#C4B89D] p-3">
                                Global Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedPricing.pricingLandscape.map(
                              (p, i) => (
                                <tr
                                  key={i}
                                  className={`hover:bg-[#F6F4EE] transition-colors ${p.tier.includes("Our") ? "bg-[#F6F4EE]/50" : ""}`}
                                >
                                  <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] uppercase">
                                    {p.tier}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-medium leading-relaxed italic">
                                    {p.model}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#DA7756] font-semibold text-center">
                                    {p.india}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-semibold text-center italic">
                                    {p.global}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="p-20 text-center text-[#2C2C2C]/60 font-semibold uppercase text-xl border-4 border-dashed rounded-[3rem]">
                Pricing and Plans Data Coming Soon
              </div>
            )}
          </TabsContent>

          {/* 5. Use Cases */}
          <TabsContent value="usecases" className="space-y-10">
            <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
              <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                {productData.name} - Use Cases
              </h2>
            </div>
            {productData.extendedContent?.detailedUseCases && (
              <div className="space-y-8">
                {productData.excelLikeUseCases ? (
                  <div
                    className="overflow-x-auto border border-[#C4B89D] bg-[#F6F4EE] p-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                      backgroundSize: "34px 24px",
                    }}
                  >
                    <div className="min-w-[1700px] bg-transparent">
                      <div className="bg-[#DA7756] text-white border border-[#DA7756] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                        Post Possession — Use Cases
                      </div>

                      <div className="mt-2 flex gap-6">
                        <div className="w-[1080px] shrink-0 space-y-4">
                          {/* PART A */}
                          <div className="bg-[#DA7756] text-white border border-[#DA7756] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                            Part A — Industry level use cases
                          </div>
                          <div className="bg-white border border-[#E5E7EB]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                              <thead>
                                <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                  <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[6%]">
                                    #
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                    Target Segment
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                    Use Case
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                    How they do it today
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">
                                    How we solve it
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[16%]">
                                    How to sell
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedUseCases.industryUseCases?.map(
                                  (u, i) => (
                                    <tr
                                      key={i}
                                      className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] align-top`}
                                    >
                                      <td className="border border-[#E5E7EB] px-1 py-1 text-center font-bold text-[#2C2C2C]/60">
                                        {u.rank}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#DA7756] break-words">
                                        {u.industry}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-semibold whitespace-pre-line break-words">
                                        {u.useCase}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                        {u.currentTool}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {u.features}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {u.profile}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* PART B */}
                          <div className="bg-[#DA7756] text-white border border-[#DA7756] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide font-poppins">
                            Part B — Internal team use cases
                          </div>
                          <div className="bg-white border border-[#E5E7EB]">
                            <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                              <thead>
                                <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                    Team
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[22%]">
                                    Relevant features
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[34%]">
                                    How they use it day-to-day
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                    Benefit
                                  </th>
                                  <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[8%]">
                                    Freq
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.extendedContent.detailedUseCases.internalTeamUseCases?.map(
                                  (t, i) => (
                                    <tr
                                      key={i}
                                      className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] align-top`}
                                    >
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#DA7756] uppercase break-words">
                                        {t.team}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {t.features}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {t.process}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                        {t.benefit}
                                      </td>
                                      <td className="border border-[#E5E7EB] px-1 py-1 text-center font-semibold uppercase text-[8px] text-[#2C2C2C]/80">
                                        {t.frequency}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right: blank grid area */}
                        <div
                          className="flex-1 min-w-[560px] rounded-sm border border-[#C4B89D] bg-white"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(212,219,219,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.22) 1px, transparent 1px)",
                            backgroundSize: "34px 24px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                        PART A — INDUSTRY LEVEL USE CASES (Ranked)
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                          <thead>
                            <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Industry (Ranked)
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Relevant Features & Teams
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[30%]">
                                How They Use It
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Ideal Company Profile
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Current Tool Used
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedUseCases.industryUseCases?.map(
                              (u, i) => (
                                <tr
                                  key={i}
                                  className="hover:bg-[#F6F4EE] transition-colors"
                                >
                                  <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756]">
                                    {u.rank}. {u.industry}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {u.features}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] leading-relaxed">
                                    {u.useCase}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/70 font-medium italic">
                                    {u.profile}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-medium">
                                    {u.currentTool}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                        PART B — INTERNAL TEAMS: HOW EACH TEAM USES IT
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse text-[10px] bg-white text-left font-poppins">
                          <thead>
                            <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                              <th className="border border-[#C4B89D] p-3 w-[15%]">
                                Team Name
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Relevant Features & Processes
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[35%]">
                                How They Use It Day-to-Day
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[20%]">
                                Primary Benefit to This Team
                              </th>
                              <th className="border border-[#C4B89D] p-3 w-[10%]">
                                Frequency of Use
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedUseCases.internalTeamUseCases?.map(
                              (t, i) => (
                                <tr
                                  key={i}
                                  className="hover:bg-[#F6F4EE] transition-colors"
                                >
                                  <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] uppercase bg-[#F6F4EE]/50">
                                    {t.team}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {t.features}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] leading-relaxed">
                                    {t.process}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/70 font-medium italic">
                                    {t.benefit}
                                  </td>
                                  <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-bold text-center">
                                    {t.frequency}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {!productData.extendedContent?.detailedUseCases && (
              <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                Use Cases Data Coming Soon
              </div>
            )}
          </TabsContent>
          {/* 8. GTM Strategy */}
          <TabsContent value="gtm" className="space-y-10">
            {productData.excelLikeGtm ? (
              <div className="overflow-x-auto rounded-xl border border-[#C4B89D] bg-[#F6F4EE] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#C4B89D] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border border-[#DA7756]">
                      {productData.extendedContent?.detailedGTM?.sheet?.title ||
                        "Post Possession — Go-to-market Strategy"}
                    </div>

                    {productData.extendedContent?.detailedGTM?.sheet
                      ?.targetGroups?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: sheet tables */}
                        <div className="w-[1180px] shrink-0 space-y-4">
                          {productData.extendedContent.detailedGTM.sheet.targetGroups.map(
                            (tg, tgIdx) => (
                              <div key={tgIdx} className="space-y-3">
                                <div className="border border-[#DA7756] bg-[#DA7756] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white font-poppins">
                                  {tg.title}
                                </div>

                                {tg.sections.map((sec, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="bg-white border border-[#E5E7EB]"
                                  >
                                    <div className="border-b border-[#E5E7EB] bg-[#F6F4EE] px-3 py-1.5 text-[9px] font-semibold uppercase text-[#DA7756] font-poppins">
                                      {sec.title}
                                    </div>
                                    <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                                      <thead>
                                        <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                          {sec.columns.map((c, i) => (
                                            <th
                                              key={i}
                                              className="border border-[#E5E7EB] px-1.5 py-1 text-left"
                                            >
                                              {c}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sec.rows.map((row, rIdx) => (
                                          <tr
                                            key={rIdx}
                                            className={`${rIdx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] align-top`}
                                          >
                                            {row.map((cell, cIdx) => (
                                              <td
                                                key={cIdx}
                                                className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words"
                                              >
                                                {cell}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}

                                {(tg.summary || tg.keyAssumptions) && (
                                  <div className="bg-white border border-[#E5E7EB]">
                                    <div className="bg-[#DA7756] text-white px-3 py-1.5 text-[9px] font-semibold uppercase font-poppins">
                                      TG Summary
                                    </div>
                                    <div className="p-3 text-[9px] text-[#2C2C2C] font-medium whitespace-pre-line font-poppins">
                                      {tg.summary
                                        ? `SUMMARY:\n${tg.summary}\n\n`
                                        : ""}
                                      {tg.keyAssumptions
                                        ? `KEY ASSUMPTIONS:\n${tg.keyAssumptions}`
                                        : ""}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>

                        {/* Right: blank grid area */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                        GTM Strategy Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
                  <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                    {productData.name} - GTM Strategy
                  </h2>
                </div>
                {productData.extendedContent?.detailedGTM && (
                  <div className="space-y-8">
                    {productData.extendedContent?.detailedGTM?.targetGroups?.map(
                      (group, idx) => (
                        <div key={idx} className="space-y-4">
                          <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase italic">
                            {group.title}
                          </div>
                          <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                            <table className="w-full border-collapse text-[10px] bg-white text-center font-poppins">
                              <thead>
                                <tr className="bg-[#DA7756] text-white font-semibold uppercase">
                                  <th className="border border-[#C4B89D] p-3 w-[25%]">
                                    Component
                                  </th>
                                  <th className="border border-[#C4B89D] p-3 text-left">
                                    Strategy/Detail
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.components.map((comp, cIdx) => (
                                  <tr
                                    key={cIdx}
                                    className="hover:bg-[#F6F4EE] transition-colors"
                                  >
                                    <td className="border border-[#C4B89D] p-3 font-semibold text-[#DA7756] uppercase bg-[#F6F4EE]/30">
                                      {comp.component}
                                    </td>
                                    <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed italic text-left">
                                      {comp.detail}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-[#DA7756] text-white p-3 text-[10px] font-semibold font-poppins uppercase tracking-tight rounded-b-xl border border-t-0 border-[#C4B89D] shadow-sm">
                            <span className="text-yellow-400">SUMMARY:</span>{" "}
                            {group.summaryBox}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
                {!productData.extendedContent?.detailedGTM && (
                  <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                    GTM Strategy Data Coming Soon
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* 9. Metrics */}
          <TabsContent value="metrics" className="space-y-10">
            {productData.excelLikeMetrics ? (
              <div className="overflow-x-auto rounded-xl border border-[#C4B89D] bg-[#F6F4EE] p-3 shadow-sm">
                <div
                  className="min-w-[1850px] rounded-xl border border-[#C4B89D] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,209,199,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,209,199,0.15) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#DA7756] text-white px-4 py-3 font-semibold tracking-tight text-sm text-center rounded-xl font-poppins">
                      {productData.extendedContent?.detailedMetrics?.sheet
                        ?.title || `${productData.name} — Performance Metrics`}
                    </div>

                    {productData.extendedContent?.detailedMetrics?.sheet
                      ?.sections?.length ? (
                      <div className="mt-4 flex gap-6">
                        {/* Left: sheet tables */}
                        <div className="w-[1180px] shrink-0 space-y-6">
                          {productData.extendedContent.detailedMetrics.sheet.sections.map(
                            (sec, sIdx) => {
                              const bar =
                                sec.tone === "red"
                                  ? "bg-[#E49191]"
                                  : sec.tone === "green"
                                    ? "bg-[#798C5E]"
                                    : "bg-[#6B9BCC]";
                              return (
                                <div
                                  key={sIdx}
                                  className="bg-white rounded-xl border border-[#C4B89D] overflow-hidden shadow-sm"
                                >
                                  <div
                                    className={`${bar} px-4 py-3 text-sm font-semibold tracking-wide text-white font-poppins`}
                                  >
                                    {sec.title}
                                  </div>
                                  <table className="w-full border-collapse text-sm leading-relaxed table-fixed font-poppins">
                                    <thead>
                                      <tr className="bg-[#CECBF6] text-[#2C2C2C] font-semibold">
                                        {sec.columns.map((c, i) => (
                                          <th
                                            key={i}
                                            className="border-b border-[#E5E7EB] px-4 py-3 text-left"
                                          >
                                            {c}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sec.rows.map((row, rIdx) => (
                                        <tr
                                          key={rIdx}
                                          className={`${rIdx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} hover:bg-[#F6F4EE] transition-colors align-top`}
                                        >
                                          {row.map((cell, cIdx) => (
                                            <td
                                              key={cIdx}
                                              className={`border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words ${cIdx === 0 ? "font-semibold text-[#2C2C2C] bg-[#F6F4EE]" : ""} ${cIdx === 1 ? "text-[#E49191] text-center" : ""} ${cIdx === 2 ? "text-[#108C72] font-semibold text-center" : ""}`}
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            }
                          )}
                        </div>

                        {/* Right: blank grid */}
                        <div className="flex-1 min-w-[650px] rounded-xl border border-[#C4B89D] bg-white" />
                      </div>
                    ) : productData.extendedContent?.detailedMetrics ? (
                      <div className="space-y-6 p-4">
                        {/* Section 1 */}
                        <div className="rounded-xl border border-[#C4B89D] bg-white overflow-hidden shadow-sm">
                          <div className="bg-[#6B9BCC] px-4 py-3 text-sm font-semibold tracking-wide text-white font-poppins">
                            Quantifiable Impact (Efficiency / Savings)
                          </div>
                          <table className="w-full border-collapse text-sm leading-relaxed font-poppins">
                            <thead>
                              <tr className="font-semibold text-[#2C2C2C]">
                                <th className="border-b border-[#E5E7EB] bg-[#F6F4EE] px-4 py-3 w-[22%] text-left">
                                  Metric Domain
                                </th>
                                <th className="border-b border-[#E5E7EB] bg-[#CECBF6]/30 px-4 py-3 w-[18%] text-center">
                                  Baseline (Traditional)
                                </th>
                                <th className="border-b border-[#E5E7EB] bg-[#9EC8BA]/30 px-4 py-3 w-[18%] text-center">
                                  Digital Impact (Our System)
                                </th>
                                <th className="border-b border-[#E5E7EB] bg-[#DA7756]/10 px-4 py-3 text-left">
                                  Primary Claim
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {productData.extendedContent.detailedMetrics.clientImpact?.map(
                                (m, i) => (
                                  <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/30"} align-top hover:bg-[#F6F4EE]/50 transition-colors`}
                                  >
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE]">
                                      {m.metric}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#E49191] font-medium italic">
                                      {m.baseline}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#108C72] font-semibold">
                                      {m.withSnag}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/80 font-medium whitespace-pre-line italic">
                                      {m.claim}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Section 2 */}
                        <div className="rounded-xl border border-[#C4B89D] bg-white overflow-hidden shadow-sm">
                          <div className="bg-[#798C5E] px-4 py-3 text-sm font-semibold tracking-wide text-white font-poppins">
                            Business Growth Targets (Internal Projection)
                          </div>
                          <table className="w-full border-collapse text-sm leading-relaxed font-poppins">
                            <thead>
                              <tr className="font-semibold text-[#2C2C2C] bg-[#9EC8BA]/30">
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[20%] text-left">
                                  Metric
                                </th>
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[26%] text-left">
                                  Definition
                                </th>
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                                  D30 Current
                                </th>
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                                  D30 Phase 1
                                </th>
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                                  M3 Current
                                </th>
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[10%] text-center">
                                  M3 Phase 1
                                </th>
                                <th className="border-b border-[#E5E7EB] px-4 py-3 w-[14%] text-left">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {productData.extendedContent.detailedMetrics.businessTargets?.map(
                                (t, i) => (
                                  <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/30"} align-top hover:bg-[#F6F4EE]/50 transition-colors`}
                                  >
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 font-semibold text-[#2C2C2C] bg-[#F6F4EE]">
                                      {t.metric}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/80 font-medium">
                                      {t.definition}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#2C2C2C] font-semibold">
                                      {t.d30Current}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#DA7756] font-semibold bg-[#DA7756]/10">
                                      {t.d30Phase1}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#2C2C2C] font-semibold">
                                      {t.m3Current}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-center text-[#DA7756] font-semibold bg-[#DA7756]/10">
                                      {t.m3Phase1}
                                    </td>
                                    <td className="border-b border-[#E5E7EB] px-4 py-3 text-[#2C2C2C]/60 font-medium italic">
                                      —
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="p-10 text-center text-[#D3D1C7] font-semibold text-lg border-2 border-dashed border-[#D3D1C7] rounded-xl m-4 font-poppins">
                        Performance Metrics Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#DA7756] text-white p-5 rounded-xl mb-0 flex justify-between items-center">
                  <h2 className="text-xl font-semibold tracking-tight font-poppins">
                    {productData.name} — Performance Metrics
                  </h2>
                </div>
                {productData.extendedContent?.detailedMetrics && (
                  <div className="space-y-8 mt-6">
                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase">
                        Quantifiable Impact (Efficiency / Savings)
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse font-poppins text-sm leading-relaxed bg-white text-center">
                          <thead>
                            <tr className="bg-[#CECBF6]/30 font-semibold uppercase text-[#2C2C2C]">
                              <th className="border border-[#E5E7EB] p-3 w-[25%] text-left">
                                Metric Domain
                              </th>
                              <th className="border border-[#E5E7EB] p-3">
                                Baseline (Traditional)
                              </th>
                              <th className="border border-[#E5E7EB] p-3 bg-[#9EC8BA]/20 text-[#2C2C2C] font-semibold">
                                Digital Impact (Our System)
                              </th>
                              <th className="border border-[#E5E7EB] p-3 text-left">
                                Primary Claim
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent?.detailedMetrics?.clientImpact?.map(
                              (metric, i) => (
                                <tr
                                  key={i}
                                  className={`hover:bg-[#F6F4EE]/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/30"}`}
                                >
                                  <td className="border border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] uppercase text-left">
                                    {metric.metric}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#E49191] font-medium line-through decoration-[#E49191]/30">
                                    {metric.baseline}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#108C72] font-semibold bg-[#9EC8BA]/10">
                                    {metric.withSnag}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-medium leading-tight text-left">
                                    {metric.claim}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-sm uppercase">
                        Business Growth Targets (Internal Projection)
                      </div>
                      <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                        <table className="w-full border-collapse font-poppins text-sm leading-relaxed bg-white text-center">
                          <thead>
                            <tr className="bg-[#9EC8BA]/30 font-semibold uppercase text-[#2C2C2C]">
                              <th className="border border-[#E5E7EB] p-3 text-left">
                                Product Metric
                              </th>
                              <th className="border border-[#E5E7EB] p-3">
                                D30 Current
                              </th>
                              <th className="border border-[#E5E7EB] p-3 font-semibold text-[#DA7756] bg-[#DA7756]/5">
                                D30 Phase 1
                              </th>
                              <th className="border border-[#E5E7EB] p-3">
                                M3 Current
                              </th>
                              <th className="border border-[#E5E7EB] p-3 font-semibold text-[#DA7756] bg-[#DA7756]/5">
                                M3 Phase 1
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent?.detailedMetrics?.businessTargets?.map(
                              (target, i) => (
                                <tr
                                  key={i}
                                  className={`hover:bg-[#F6F4EE]/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/30"}`}
                                >
                                  <td className="border border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] uppercase text-left">
                                    {target.metric}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/60 font-medium">
                                    {target.d30Current}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#DA7756] font-semibold bg-[#DA7756]/5">
                                    {target.d30Phase1}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/60 font-medium">
                                    {target.m3Current}
                                  </td>
                                  <td className="border border-[#E5E7EB] p-3 text-[#DA7756] font-semibold bg-[#DA7756]/5">
                                    {target.m3Phase1}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {!productData.extendedContent?.detailedMetrics && (
                  <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                    Performance Metrics Data Coming Soon
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* 10. SWOT Analysis */}
          <TabsContent value="swot" className="space-y-6 animate-fade-in">
            {productData.excelLikeSwot ? (
              <div className="overflow-x-auto rounded-xl border border-[#C4B89D] bg-[#F6F4EE] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#C4B89D] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border border-[#DA7756]">
                      Post Sales - SWOT Analysis
                    </div>

                    {productData.extendedContent?.detailedSWOT ? (
                      <div
                        className="mt-3 flex gap-6"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(212,219,219,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.22) 1px, transparent 1px)",
                          backgroundSize: "34px 24px",
                        }}
                      >
                        {/* Left: SWOT sheet (matches screenshot layout) */}
                        <div className="w-[980px] shrink-0 bg-white border border-[#C4B89D]">
                          <table className="w-full border-collapse font-poppins text-[9px] leading-[1.15] table-fixed">
                            <thead>
                              <tr className="bg-[#DA7756] text-white">
                                <th
                                  className="border border-[#C4B89D] px-2 py-1.5 text-left font-semibold uppercase"
                                  colSpan={6}
                                >
                                  Post Possession — SWOT Analysis
                                </th>
                              </tr>
                              <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                <th
                                  className="border border-[#C4B89D] bg-[#9EC8BA]/30 px-2 py-1 text-left"
                                  colSpan={3}
                                >
                                  Strengths (Internal / Positive)
                                </th>
                                <th
                                  className="border border-[#C4B89D] bg-[#CECBF6]/30 px-2 py-1 text-left"
                                  colSpan={3}
                                >
                                  Weaknesses (Internal / Negative)
                                </th>
                              </tr>
                              <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center w-[6%]">
                                  ID
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#9EC8BA]/30 px-1.5 py-1 text-left w-[20%]">
                                  Strength
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#9EC8BA]/30 px-1.5 py-1 text-left w-[24%]">
                                  Detail at market
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center w-[6%]">
                                  ID
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#CECBF6]/30 px-1.5 py-1 text-left w-[20%]">
                                  Weakness
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#CECBF6]/30 px-1.5 py-1 text-left w-[24%]">
                                  Detail at market
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from(
                                {
                                  length: Math.max(
                                    productData.extendedContent.detailedSWOT
                                      .strengths.length,
                                    productData.extendedContent.detailedSWOT
                                      .weaknesses.length
                                  ),
                                },
                                (_, i) => i
                              ).map((i) => {
                                const s =
                                  productData.extendedContent.detailedSWOT
                                    .strengths[i];
                                const w =
                                  productData.extendedContent.detailedSWOT
                                    .weaknesses[i];
                                const zebra =
                                  i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50";
                                return (
                                  <tr
                                    key={`sw-${i}`}
                                    className={`align-top ${zebra} hover:bg-[#F6F4EE] transition-colors`}
                                  >
                                    <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-semibold text-[8px] text-[#2C2C2C]/70">
                                      {s ? `S${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#9EC8BA]/20 px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                      {s?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#9EC8BA]/20 px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {s?.explanation ?? ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-semibold text-[8px] text-[#2C2C2C]/70">
                                      {w ? `W${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                      {w?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {w?.explanation ?? ""}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          <table className="w-full border-collapse font-poppins text-[9px] leading-[1.15] table-fixed mt-3">
                            <thead>
                              <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                <th
                                  className="border border-[#C4B89D] bg-[#6B9BCC]/20 px-2 py-1 text-left"
                                  colSpan={3}
                                >
                                  Opportunities (External / Positive)
                                </th>
                                <th
                                  className="border border-[#C4B89D] bg-[#DA7756]/20 px-2 py-1 text-left"
                                  colSpan={3}
                                >
                                  Threats (External / Negative)
                                </th>
                              </tr>
                              <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center w-[6%]">
                                  ID
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#6B9BCC]/20 px-1.5 py-1 text-left w-[20%]">
                                  Opportunity
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#6B9BCC]/20 px-1.5 py-1 text-left w-[24%]">
                                  Detail & how to
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center w-[6%]">
                                  ID
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#DA7756]/20 px-1.5 py-1 text-left w-[20%]">
                                  Threat
                                </th>
                                <th className="border border-[#E5E7EB] bg-[#DA7756]/20 px-1.5 py-1 text-left w-[24%]">
                                  Detail & mitigation
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from(
                                {
                                  length: Math.max(
                                    productData.extendedContent.detailedSWOT
                                      .opportunities.length,
                                    productData.extendedContent.detailedSWOT
                                      .threats.length
                                  ),
                                },
                                (_, i) => i
                              ).map((i) => {
                                const o =
                                  productData.extendedContent.detailedSWOT
                                    .opportunities[i];
                                const t =
                                  productData.extendedContent.detailedSWOT
                                    .threats[i];
                                const zebra =
                                  i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50";
                                return (
                                  <tr
                                    key={`ot-${i}`}
                                    className={`align-top ${zebra} hover:bg-[#F6F4EE] transition-colors`}
                                  >
                                    <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-semibold text-[8px] text-[#2C2C2C]/70">
                                      {o ? `O${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#6B9BCC]/15 px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                      {o?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#6B9BCC]/15 px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {o?.explanation ?? ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-semibold text-[8px] text-[#2C2C2C]/70">
                                      {t ? `T${i + 1}` : ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#DA7756]/15 px-1.5 py-1 font-semibold text-[#2C2C2C] break-words">
                                      {t?.headline ?? ""}
                                    </td>
                                    <td className="border border-[#E5E7EB] bg-[#DA7756]/15 px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                      {t?.explanation ?? ""}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Right: blank grid area like the sheet */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                        SWOT Analysis Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 shadow-2xl p-4 bg-white border border-[#C4B89D] rounded-xl">
                <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center shadow-md">
                  <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
                    Strategic SWOT Analysis Matrix
                  </h2>
                </div>
                {productData.extendedContent?.detailedSWOT && (
                  <div className="border border-[#C4B89D] rounded-b-xl overflow-hidden bg-white">
                    <div className="bg-[#F6F4EE] text-center text-[11px] p-2 border-b border-[#E5E7EB] text-[#2C2C2C]/70 font-medium font-poppins">
                      Grounded in product features, market context, and
                      competitor landscape. Not generic.
                    </div>

                    <div className="flex flex-col md:flex-row border-b border-[#E5E7EB]">
                      <div className="w-full md:w-1/2 flex flex-col bg-[#9EC8BA]/20 border-b md:border-b-0 md:border-r border-[#E5E7EB]">
                        <div className="text-center font-semibold text-[#798C5E] p-3 text-lg tracking-widest border-b border-white/50 uppercase font-poppins">
                          STRENGTHS
                        </div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.strengths.map(
                            (item, i) => (
                              <div key={i} className="text-[11px] font-poppins">
                                <span className="font-semibold text-[#2C2C2C] block mb-1">
                                  S{i + 1} {item.headline}
                                </span>
                                <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                                  {item.explanation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col bg-[#CECBF6]/20">
                        <div className="text-center font-semibold text-[#DA7756] p-3 text-lg tracking-widest border-b border-white/50 uppercase font-poppins">
                          WEAKNESSES
                        </div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.weaknesses.map(
                            (item, i) => (
                              <div key={i} className="text-[11px] font-poppins">
                                <span className="font-semibold text-[#2C2C2C] block mb-1">
                                  W{i + 1} {item.headline}
                                </span>
                                <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                                  {item.explanation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/2 flex flex-col bg-[#6B9BCC]/15 border-b md:border-b-0 md:border-r border-[#E5E7EB]">
                        <div className="text-center font-semibold text-[#6B9BCC] p-3 text-lg tracking-widest border-b border-white/50 uppercase font-poppins">
                          OPPORTUNITIES
                        </div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.opportunities.map(
                            (item, i) => (
                              <div key={i} className="text-[11px] font-poppins">
                                <span className="font-semibold text-[#2C2C2C] block mb-1">
                                  O{i + 1} {item.headline}
                                </span>
                                <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                                  {item.explanation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col bg-[#DA7756]/15">
                        <div className="text-center font-semibold text-[#E49191] p-3 text-lg tracking-widest border-b border-white/50 uppercase font-poppins">
                          THREATS
                        </div>
                        <div className="p-4 space-y-6">
                          {productData.extendedContent.detailedSWOT.threats.map(
                            (item, i) => (
                              <div key={i} className="text-[11px] font-poppins">
                                <span className="font-semibold text-[#2C2C2C] block mb-1">
                                  T{i + 1} {item.headline}
                                </span>
                                <p className="text-[#2C2C2C]/70 leading-relaxed font-medium">
                                  {item.explanation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!productData.extendedContent?.detailedSWOT && (
                  <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                    SWOT Analysis Data Coming Soon
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* 6. Roadmap */}
          <TabsContent value="roadmap" className="space-y-12 animate-fade-in">
            {productData.excelLikeRoadmap ? (
              <div className="overflow-x-auto rounded-xl border border-[#C4B89D] bg-[#F6F4EE] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#C4B89D] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border border-[#DA7756]">
                      Post Possession — Product Roadmap (Prioritized by Market
                      Gap, Competitive Weakness & Product Goals)
                    </div>

                    {productData.extendedContent?.detailedRoadmap
                      ?.structuredRoadmap?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: Roadmap sheet table */}
                        <div className="w-[1180px] shrink-0 bg-white border border-[#C4B89D]">
                          {(() => {
                            const sections =
                              productData.extendedContent!.detailedRoadmap!
                                .structuredRoadmap!;
                            const hasPriority = sections.some((s) =>
                              s.items.some((it) => it.priority || it.impact)
                            );

                            // Default to the screenshot-style table when priority/impact are present
                            if (hasPriority) {
                              let rowNo = 1;
                              return (
                                <table className="w-full border-collapse font-poppins text-[9px] leading-[1.15] table-fixed">
                                  <thead>
                                    <tr className="bg-[#DA7756] text-white">
                                      <th
                                        className="border border-[#C4B89D] px-2 py-1.5 text-left font-semibold uppercase"
                                        colSpan={7}
                                      >
                                        Post Possession — Product Roadmap
                                      </th>
                                    </tr>
                                    <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[4%]">
                                        #
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[20%]">
                                        Initiative
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[28%]">
                                        Stop losing deals we should be winning
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[18%]">
                                        Customer segment unlocked
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[12%]">
                                        Effort estimate
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[10%]">
                                        Impact
                                      </th>
                                      <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[8%]">
                                        Priority
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sections.flatMap((section, sIdx) => {
                                      const band =
                                        section.colorContext === "red"
                                          ? {
                                              bar: "bg-[#E49191]",
                                              row: "bg-[#E49191]/10",
                                            }
                                          : section.colorContext === "yellow"
                                            ? {
                                                bar: "bg-[#DA7756]",
                                                row: "bg-[#DA7756]/10",
                                              }
                                            : section.colorContext === "blue"
                                              ? {
                                                  bar: "bg-[#6B9BCC]",
                                                  row: "bg-[#6B9BCC]/10",
                                                }
                                              : {
                                                  bar: "bg-[#798C5E]",
                                                  row: "bg-[#9EC8BA]/20",
                                                };

                                      const headerRow = (
                                        <tr key={`band-${sIdx}`}>
                                          <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-semibold text-[8px] text-[#2C2C2C]/70">
                                            {rowNo++}
                                          </td>
                                          <td
                                            className={`border border-[#E5E7EB] ${band.bar} text-white px-2 py-1 font-semibold uppercase text-[8px] tracking-wide`}
                                            colSpan={6}
                                          >
                                            {section.timeframe} —{" "}
                                            {section.headline}
                                          </td>
                                        </tr>
                                      );

                                      const rows = section.items.map(
                                        (item, iIdx) => {
                                          const zebra =
                                            iIdx % 2 === 0
                                              ? "bg-white"
                                              : "bg-[#F6F4EE]/50";
                                          return (
                                            <tr
                                              key={`r-${sIdx}-${iIdx}`}
                                              className={`align-top hover:bg-[#F6F4EE] transition-colors ${zebra}`}
                                            >
                                              <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-semibold text-[#2C2C2C]/60">
                                                {rowNo++}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] ${band.row} px-1.5 py-1 font-semibold text-[#2C2C2C] break-words`}
                                              >
                                                {item.whatItIs}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] ${band.row} px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words`}
                                              >
                                                {item.whyItMatters}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] ${band.row} px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words`}
                                              >
                                                {item.unlockedSegment}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] ${band.row} px-1 py-1 text-center font-semibold text-[#2C2C2C] whitespace-pre-line`}
                                              >
                                                {item.effort}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] ${band.row} px-1 py-1 text-center font-semibold text-[#2C2C2C]`}
                                              >
                                                {item.impact ?? item.owner}
                                              </td>
                                              <td
                                                className={`border border-[#E5E7EB] ${band.row} px-1 py-1 text-center font-semibold text-[#2C2C2C]`}
                                              >
                                                {item.priority ?? ""}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      );

                                      return [headerRow, ...rows];
                                    })}
                                  </tbody>
                                </table>
                              );
                            }

                            // Fallback to original structured table
                            return (
                              <div className="p-4">
                                <table className="w-full border-collapse font-poppins text-[9px] leading-[1.25] text-left">
                                  <thead>
                                    <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                                      <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-2 py-2 w-[8%]">
                                        Phase / Timeline
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-2 py-2 w-[18%]">
                                        What It Is
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-[#9EC8BA]/15 px-2 py-2 w-[22%]">
                                        Why It Matters
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-2 py-2 w-[22%]">
                                        Unlocked Segment
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-[#DA7756]/10 px-2 py-2 w-[12%] text-center">
                                        Effort
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-[#6B9BCC]/10 px-2 py-2 w-[10%] text-center">
                                        Owner
                                      </th>
                                      <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-2 py-2 w-[8%] text-center">
                                        Theme
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sections.flatMap((section, sIdx) => {
                                      const tone =
                                        section.colorContext === "red"
                                          ? {
                                              bg: "bg-[#E49191]/10",
                                              badge:
                                                "bg-[#E49191]/10 text-[#E49191] border-[#E49191]/30",
                                            }
                                          : section.colorContext === "yellow"
                                            ? {
                                                bg: "bg-[#DA7756]/10",
                                                badge:
                                                  "bg-[#DA7756]/10 text-[#DA7756] border-[#DA7756]/30",
                                              }
                                            : section.colorContext === "blue"
                                              ? {
                                                  bg: "bg-[#6B9BCC]/10",
                                                  badge:
                                                    "bg-[#6B9BCC]/10 text-[#6B9BCC] border-[#6B9BCC]/30",
                                                }
                                              : {
                                                  bg: "bg-[#9EC8BA]/15",
                                                  badge:
                                                    "bg-[#798C5E]/10 text-[#798C5E] border-[#798C5E]/30",
                                                };

                                      return section.items.map((item, iIdx) => (
                                        <tr
                                          key={`${sIdx}-${iIdx}`}
                                          className={`align-top hover:bg-[#F6F4EE] transition-colors ${iIdx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"}`}
                                        >
                                          <td
                                            className={`border border-[#E5E7EB] px-2 py-2 font-semibold text-[#2C2C2C] ${tone.bg}`}
                                          >
                                            <div className="text-[8px] uppercase">
                                              {section.timeframe}
                                            </div>
                                            <div className="text-[9px] font-semibold">
                                              {section.headline}
                                            </div>
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 font-semibold text-[#2C2C2C] whitespace-pre-line">
                                            {item.whatItIs}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 font-medium text-[#2C2C2C] whitespace-pre-line">
                                            {item.whyItMatters}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 font-medium text-[#2C2C2C] whitespace-pre-line">
                                            {item.unlockedSegment}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#DA7756] whitespace-pre-line">
                                            {item.effort}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 text-center font-semibold text-[#2C2C2C] whitespace-pre-line">
                                            {item.owner}
                                          </td>
                                          <td className="border border-[#E5E7EB] px-2 py-2 text-center">
                                            <span
                                              className={`inline-block px-2 py-0.5 text-[8px] font-semibold uppercase border ${tone.badge}`}
                                            >
                                              {section.colorContext}
                                            </span>
                                          </td>
                                        </tr>
                                      ));
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Right: blank grid area like the sheet */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                        Product Roadmap Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#DA7756] text-white p-6 rounded-t-xl mb-0 flex flex-col justify-start items-start gap-2 shadow-inner border border-white/10">
                <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
                  {productData.name} - Strategic Roadmap
                </h2>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80">
                  Future Evolution Matrix | FY 2026-28
                </div>
              </div>
            )}

            {/* 1. Structured Timeline Roadmap */}
            {productData.extendedContent?.detailedRoadmap
              ?.structuredRoadmap && (
              <div className="space-y-8">
                {productData.extendedContent.detailedRoadmap.structuredRoadmap.map(
                  (section, idx) => {
                    const bgHeader =
                      section.colorContext === "red"
                        ? "bg-[#E49191]"
                        : section.colorContext === "yellow"
                          ? "bg-[#DA7756]"
                          : "bg-[#798C5E]";
                    const bgRow =
                      section.colorContext === "red"
                        ? "bg-[#E49191]/10"
                        : section.colorContext === "yellow"
                          ? "bg-[#DA7756]/10"
                          : "bg-[#9EC8BA]/15";
                    const textHeader = "text-white";
                    return (
                      <div
                        key={idx}
                        className="border border-[#C4B89D] shadow-xl overflow-hidden rounded-md"
                      >
                        <div
                          className={`${bgHeader} ${textHeader} px-4 py-2 font-semibold font-poppins text-sm uppercase tracking-wider`}
                        >
                          {section.timeframe} — {section.headline}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse font-poppins text-[11px] bg-white text-left">
                            <thead>
                              <tr
                                className={`${bgHeader} ${textHeader} font-semibold text-xs uppercase text-left`}
                              >
                                <th className="border-t border-b border-white/30 p-3 w-[15%]">
                                  What It Is
                                </th>
                                <th className="border-t border-b border-white/30 p-3 w-[25%]">
                                  Why It Matters
                                </th>
                                <th className="border-t border-b border-white/30 p-3 w-[25%]">
                                  Which Customer Segment It Unlocks
                                </th>
                                <th className="border-t border-b border-white/30 p-3 w-[20%]">
                                  Effort Estimate
                                </th>
                                <th className="border-t border-b border-white/30 p-3 w-[15%]">
                                  Owner
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.items.map((item, i) => (
                                <tr
                                  key={i}
                                  className={`${bgRow} border-b border-[#E5E7EB] last:border-0 hover:brightness-95 transition-all`}
                                >
                                  <td className="p-3 text-[#2C2C2C] font-semibold leading-relaxed">
                                    {item.whatItIs}
                                  </td>
                                  <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {item.whyItMatters}
                                  </td>
                                  <td className="p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                    {item.unlockedSegment}
                                  </td>
                                  <td className="p-3 text-[#2C2C2C]/70 leading-relaxed">
                                    {item.effort}
                                  </td>
                                  <td className="p-3 text-[#2C2C2C] font-semibold">
                                    {item.owner}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* 2. Legacy Phases Roadmap */}
            {productData.extendedContent?.detailedRoadmap?.phases && (
              <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                <table className="w-full border-collapse font-poppins text-[10px] bg-white">
                  <thead>
                    <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase text-center">
                      <th className="border border-[#E5E7EB] p-3 w-[15%]">
                        Phase
                      </th>
                      <th className="border border-[#E5E7EB] p-3 w-[15%] text-left">
                        Initiative
                      </th>
                      <th className="border border-[#E5E7EB] p-3 w-[25%] text-left">
                        Feature / Capability
                      </th>
                      <th className="border border-[#E5E7EB] p-3 w-[15%] text-left">
                        Target Segment Unlocked
                      </th>
                      <th className="border border-[#E5E7EB] p-3 w-[20%] text-left">
                        Business Impact
                      </th>
                      <th className="border border-[#E5E7EB] p-3 w-[10%]">
                        Est. Timeline
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent?.detailedRoadmap?.phases?.map(
                      (phase, pIdx) => (
                        <React.Fragment key={pIdx}>
                          {phase.initiatives.map((item, iIdx) => (
                            <tr
                              key={iIdx}
                              className="hover:bg-[#F6F4EE] transition-colors"
                            >
                              {iIdx === 0 && (
                                <td
                                  className="border border-[#E5E7EB] p-4 font-semibold text-[#2C2C2C] uppercase bg-[#F6F4EE]/50 align-top"
                                  rowSpan={phase.initiatives.length}
                                >
                                  {phase.title}
                                </td>
                              )}
                              <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold uppercase">
                                {item.initiative}
                              </td>
                              <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-medium leading-relaxed">
                                {item.feature || "-"}
                              </td>
                              <td className="border border-[#E5E7EB] p-3 text-[#6B9BCC] font-semibold tracking-tight">
                                {item.segment || "-"}
                              </td>
                              <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold leading-tight">
                                {item.impact}
                              </td>
                              <td className="border border-[#E5E7EB] p-3 text-center font-semibold text-[#DA7756] bg-[#F6F4EE]/20">
                                {item.timeline}
                              </td>
                            </tr>
                          ))}
                          {phase.summary && (
                            <tr className="bg-[#DA7756] text-white font-semibold tracking-tighter uppercase">
                              <td
                                colSpan={6}
                                className="p-3 text-[9px] border border-[#DA7756]"
                              >
                                {phase.summary}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. Innovation Layer Detail */}
            {productData.extendedContent?.detailedRoadmap?.innovationLayer && (
              <div className="space-y-4">
                <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-xs uppercase tracking-wider">
                  Full Innovation Roadmap Detail
                </div>
                <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                  <table className="w-full border-collapse font-poppins text-[9px] bg-white">
                    <thead>
                      <tr className="bg-[#9EC8BA]/30 text-[#2C2C2C] font-semibold uppercase text-center">
                        <th className="border border-[#E5E7EB] p-2 w-[3%]">
                          #
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[15%] text-left">
                          Enhancement Name
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[10%] text-left">
                          Category
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                          Description
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                          Business Value
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[12%] text-left">
                          Competitor Leapfrogged
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[10%]">
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedRoadmap.innovationLayer.map(
                        (item, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-[#F6F4EE] transition-colors ${item.priority === "High Impact" ? "bg-[#6B9BCC]/10" : ""}`}
                          >
                            <td className="border border-[#E5E7EB] p-2 font-semibold text-[#2C2C2C] text-center bg-[#F6F4EE]/50">
                              {item.id}
                            </td>
                            <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C] font-semibold uppercase">
                              {item.name}
                            </td>
                            <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C]/60 font-semibold uppercase tracking-tighter">
                              {item.category}
                            </td>
                            <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C]/70 font-medium leading-tight">
                              {item.description}
                            </td>
                            <td className="border border-[#E5E7EB] p-2 text-[#2C2C2C] font-semibold leading-tight">
                              {item.value}
                            </td>
                            <td className="border border-[#E5E7EB] p-2 text-[#6B9BCC] font-semibold uppercase tracking-tighter">
                              {item.leapfrog}
                            </td>
                            <td className="border border-[#E5E7EB] p-2 text-center">
                              <span
                                className={`px-2 py-1 rounded-full font-semibold uppercase text-[7px] ${item.priority === "High Impact" ? "bg-[#E49191]/15 text-[#E49191]" : "bg-[#6B9BCC]/15 text-[#6B9BCC]"}`}
                              >
                                {item.priority}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!productData.extendedContent?.detailedRoadmap && (
              <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                Product Roadmap Data Coming Soon
              </div>
            )}
          </TabsContent>

          {/* 11. Enhancement Matrix */}
          <TabsContent
            value="enhancements"
            className="space-y-12 animate-fade-in"
          >
            <div className="bg-[#DA7756] text-white p-6 rounded-t-xl mb-0 flex flex-col justify-start items-start gap-2 shadow-inner border border-white/10">
              <h2 className="text-2xl font-semibold font-poppins uppercase tracking-tight">
                {productData.name} - Enhancement Matrix
              </h2>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80">
                Legacy to AI Transformation | FY 2026-28
              </div>
            </div>

            {/* 1. High-Impact Enhancements Matrix */}
            {productData.extendedContent?.detailedRoadmap
              ?.enhancementRoadmap && (
              <div className="space-y-4">
                <div
                  className="overflow-x-auto border border-[#C4B89D] bg-[#F6F4EE] p-2 rounded-xl shadow-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="min-w-[1850px] bg-transparent">
                    <div className="mt-2 flex gap-6">
                      <div className="w-[1180px] shrink-0 bg-white border border-[#C4B89D]">
                        <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border-b border-[#DA7756]">
                          Post Possession — Enhancement Roadmap (Features,
                          Status, Tech, Effort, Impact, Priority, Owner)
                        </div>
                        <table className="w-full border-collapse font-poppins text-[9px] leading-[1.15] text-left table-fixed">
                          <thead>
                            <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                              <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1 py-1 w-[4%] text-center">
                                #
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1.5 py-1 w-[16%]">
                                Feature name
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1.5 py-1 w-[18%]">
                                What it’s currently like
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1.5 py-1 w-[22%]">
                                Enhanced version
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 w-[10%] text-center">
                                Integration type
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#fefce8] px-1 py-1 w-[7%] text-center">
                                Effort
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#fff7ed] px-1 py-1 w-[7%] text-center">
                                Impact
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#CECBF6]/20 px-1 py-1 w-[6%] text-center">
                                Priority
                              </th>
                              <th className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 w-[10%] text-center">
                                Owner
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productData.extendedContent.detailedRoadmap.enhancementRoadmap.map(
                              (item, idx) => (
                                <tr
                                  key={idx}
                                  className={`${idx % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]/50"} align-top hover:bg-[#F6F4EE] transition-colors`}
                                >
                                  <td className="border border-[#E5E7EB] px-1 py-1 font-semibold text-center text-[#DA7756]">
                                    {idx + 1}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1.5 py-1 font-semibold text-[#DA7756] break-words">
                                    {item.featureName}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                    {item.currentStatus}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1.5 py-1 text-[#2C2C2C] font-semibold whitespace-pre-line break-words">
                                    {item.enhancedVersion}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1 py-1 text-center text-[#2C2C2C]/80 font-bold text-[8px] uppercase whitespace-pre-line break-words">
                                    {item.integrationType}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1 py-1 text-center font-semibold text-[#92400e]">
                                    {item.effort}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1 py-1 text-center font-semibold text-[#7c2d12]">
                                    {item.impact}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1 py-1 text-center font-semibold text-[#2C2C2C]">
                                    {item.priority}
                                  </td>
                                  <td className="border border-[#E5E7EB] px-1 py-1 text-center font-bold text-[#2C2C2C] whitespace-pre-line break-words">
                                    {item.owner}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Top 5 Summary */}
            {productData.extendedContent?.detailedRoadmap?.top5Impact && (
              <div className="space-y-4">
                <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins text-xs uppercase tracking-wider">
                  Top 5 Highest-Impact Enhancements Summary
                </div>
                <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                  <table className="w-full border-collapse font-poppins text-[10px] bg-white">
                    <thead>
                      <tr className="bg-[#9EC8BA]/30 text-[#2C2C2C] font-semibold uppercase text-center">
                        <th className="border border-[#E5E7EB] p-2 w-[5%]">
                          Rank
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                          Enhancement
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[45%] text-left">
                          Why It Matters Most
                        </th>
                        <th className="border border-[#E5E7EB] p-2 w-[25%] text-left">
                          Competitor It Leapfrogs
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedRoadmap.top5Impact.map(
                        (item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-[#F6F4EE] transition-colors"
                          >
                            <td className="border border-[#E5E7EB] p-3 font-semibold text-[#2C2C2C] text-center bg-[#F6F4EE]/50">
                              {item.rank}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C] font-semibold uppercase">
                              {item.name}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#2C2C2C]/70 font-semibold leading-relaxed">
                              {item.logic}
                            </td>
                            <td className="border border-[#E5E7EB] p-3 text-[#6B9BCC] font-semibold uppercase tracking-tighter">
                              {item.leapfrog}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Strategic Enhancements (Alternative Format) */}
            {productData.extendedContent?.detailedEnhancements && (
              <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-2xl">
                <table className="w-full border-collapse font-poppins text-[10px] bg-white text-center">
                  <thead>
                    <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center border-b border-white/10">
                      <th className="border border-[#E5E7EB]/50 p-4 w-[12%]">
                        Timeline
                      </th>
                      <th className="border border-[#E5E7EB]/50 p-4 w-[18%]">
                        Strategic Focus
                      </th>
                      <th className="border border-[#E5E7EB]/50 p-4 w-[40%] text-left">
                        Key Features / Innovation
                      </th>
                      <th className="border border-[#E5E7EB]/50 p-4 w-[15%]">
                        Business Logic
                      </th>
                      <th className="border border-[#E5E7EB]/50 p-4 w-[15%]">
                        Core Benefit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent?.detailedEnhancements?.roadmap?.map(
                      (row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#F6F4EE]/50 transition-all border-b border-[#E5E7EB] last:border-0"
                        >
                          <td className="border border-[#E5E7EB]/50 p-4 font-semibold text-[#DA7756] bg-[#F6F4EE]/50 uppercase tracking-tighter">
                            {row.period}
                          </td>
                          <td className="border border-[#E5E7EB]/50 p-4 text-[#2C2C2C] font-semibold uppercase text-[9px] leading-tight">
                            {row.focus}
                          </td>
                          <td className="border border-[#E5E7EB]/50 p-4 text-[#2C2C2C]/70 font-semibold leading-relaxed text-left">
                            <div className="bg-[#F6F4EE] p-3 rounded-lg border-l-4 border-[#6B9BCC] shadow-sm font-medium">
                              {row.features}
                            </div>
                          </td>
                          <td className="border border-[#E5E7EB]/50 p-4 text-[#2C2C2C]/60 font-semibold uppercase text-[8px] leading-tight bg-[#F6F4EE]/30">
                            {row.logic}
                          </td>
                          <td className="border border-[#E5E7EB]/50 p-4 text-[#798C5E] font-semibold uppercase text-[9px] tracking-tight">
                            {row.risk}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {!productData.extendedContent?.detailedRoadmap
              ?.enhancementRoadmap &&
              !productData.extendedContent?.detailedEnhancements && (
                <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                  Enhancement Matrix Data Coming Soon
                </div>
              )}
          </TabsContent>

          {/* 7. Business Plan */}
          <TabsContent value="business" className="space-y-10">
            {productData.excelLikeBusinessPlan ? (
              <div className="overflow-x-auto rounded-xl border border-[#C4B89D] bg-[#F6F4EE] p-3 shadow-xl">
                <div
                  className="min-w-[1850px] rounded-md border border-[#C4B89D] bg-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(212,219,219,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,219,219,0.2) 1px, transparent 1px)",
                    backgroundSize: "34px 24px",
                  }}
                >
                  <div className="px-4 pt-4 pb-6">
                    <div className="bg-[#DA7756] text-white px-4 py-2 font-semibold font-poppins uppercase tracking-tight text-[11px] text-center border border-[#DA7756]">
                      Post Possession — Business Plan Builder (Pre-filled)
                    </div>

                    {productData.extendedContent?.detailedBusinessPlan
                      ?.planQuestions?.length ? (
                      <div className="mt-3 flex gap-6">
                        {/* Left: sheet table */}
                        <div className="w-[1180px] shrink-0 bg-white border border-[#E5E7EB]">
                          <table className="w-full border-collapse text-[9px] leading-[1.15] table-fixed font-poppins">
                            <thead>
                              <tr className="bg-[#CECBF6]/30 text-[#2C2C2C] font-semibold uppercase">
                                <th className="border border-[#E5E7EB] px-1 py-1 text-center w-[5%]">
                                  #
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[23%]">
                                  Business plan question
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[46%]">
                                  Suggested answer
                                </th>
                                <th className="border border-[#E5E7EB] px-1 py-1 text-left w-[12%]">
                                  Sources
                                </th>
                                <th className="border border-[#E5E7EB] px-1.5 py-1 text-left w-[14%]">
                                  Founder review
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {productData.extendedContent.detailedBusinessPlan.planQuestions.map(
                                (q, i) => {
                                  const statusTone = q.flag
                                    ?.toLowerCase()
                                    .includes("ready")
                                    ? "bg-green-50 text-green-800 border-green-200"
                                    : "bg-yellow-50 text-yellow-900 border-yellow-200";

                                  const toneBg =
                                    i % 5 === 0
                                      ? "bg-[#E9F3D8]"
                                      : i % 5 === 1
                                        ? "bg-[#FAE5CC]"
                                        : i % 5 === 2
                                          ? "bg-[#DFEDFA]"
                                          : i % 5 === 3
                                            ? "bg-[#EDE9FE]"
                                            : "bg-[#FFF3C5]";

                                  return (
                                    <tr
                                      key={i}
                                      className="align-top hover:bg-[#F6F4EE] transition-colors"
                                    >
                                      <td className="border border-[#E5E7EB] bg-[#F6F4EE] px-1 py-1 text-center font-bold text-[#2C2C2C]/60">
                                        {i + 1}
                                      </td>
                                      <td
                                        className={`border border-[#E5E7EB] ${toneBg} px-1.5 py-1 font-semibold text-[#2C2C2C] whitespace-pre-line break-words`}
                                      >
                                        {q.question}
                                        {q.flag ? (
                                          <div className="mt-1">
                                            <span
                                              className={`inline-block px-1.5 py-0.5 text-[8px] font-semibold uppercase border ${statusTone}`}
                                            >
                                              {q.flag}
                                            </span>
                                          </div>
                                        ) : null}
                                      </td>
                                      <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                                        {q.answer}
                                      </td>
                                      <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80 font-medium whitespace-pre-line break-words">
                                        {"-"}
                                      </td>
                                      <td className="border border-[#E5E7EB] bg-[#f0fdf4] px-1.5 py-1 text-[#166534] font-medium whitespace-pre-line break-words">
                                        {"-"}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Right: blank grid */}
                        <div className="flex-1 min-w-[650px] rounded-sm border border-[#C4B89D] bg-white" />
                      </div>
                    ) : (
                      <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                        Business Plan Data Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#DA7756] text-white p-4 rounded-t-xl mb-0 flex justify-between items-center">
                  <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
                    {productData.name} - Business Plan
                  </h2>
                </div>
                {productData.extendedContent?.detailedBusinessPlan && (
                  <div className="overflow-x-auto border border-[#C4B89D] rounded-xl shadow-lg">
                    <table className="w-full border-collapse text-[10px] bg-white font-poppins">
                      <thead>
                        <tr className="bg-[#DA7756] text-white font-semibold uppercase text-center">
                          <th className="border border-[#C4B89D] p-3 w-[25%] text-left">
                            Question
                          </th>
                          <th className="border border-[#C4B89D] p-3 w-[60%] text-left">
                            Suggested Answer
                          </th>
                          <th className="border border-[#C4B89D] p-3 w-[15%]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent?.detailedBusinessPlan?.planQuestions?.map(
                          (q, i) => (
                            <tr
                              key={i}
                              className="hover:bg-[#F6F4EE] transition-colors"
                            >
                              <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] font-semibold uppercase leading-tight">
                                {q.question}
                              </td>
                              <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                                {q.answer}
                              </td>
                              <td className="border border-[#C4B89D] p-3 text-center">
                                <span
                                  className={`px-2 py-1 rounded-sm font-semibold text-[8px] uppercase tracking-tighter block text-center shadow-sm
                                ${q.flag.includes("Ready") ? "bg-[#4CAF50] text-white" : "bg-[#FFC107] text-black"}`}
                                >
                                  {q.flag}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {!productData.extendedContent?.detailedBusinessPlan && (
                  <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
                    Business Plan Data Coming Soon
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="assets" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productData.assets.map((asset, index) => (
                <div
                  key={index}
                  className="border border-[#C4B89D] rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all bg-white cursor-pointer group"
                  onClick={() =>
                    asset.url !== "#" && window.open(asset.url, "_blank")
                  }
                >
                  <div className="p-3 bg-[#F6F4EE] rounded-xl text-[#2C2C2C]/60 group-hover:text-[#DA7756] transition-colors">
                    {asset.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#2C2C2C]/80 uppercase tracking-tight group-hover:text-[#DA7756] group-hover:underline transition-all">
                    {asset.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl border border-[#C4B89D] shadow-2xl overflow-hidden mt-10">
              <div className="bg-[#F6F4EE] p-8 border-b border-[#C4B89D] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <UserCheck className="w-7 h-7 text-[#C72030]" />
                  </div>
                  <h3 className="text-2xl font-semibold uppercase text-[#2C2C2C] tracking-tighter">
                    Login Credentials
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-semibold uppercase">
                  <Lock className="w-3 h-3" /> Secure Access
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F6F4EE]/50">
                {productData.credentials.map((cred, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl border border-[#C4B89D] shadow-sm hover:shadow-md transition-all"
                  >
                    <h4 className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-widest mb-4 border-b pb-2">
                      {cred.title}
                    </h4>
                    <div className="space-y-3">
                      <div
                        className="flex items-center gap-3 text-[10px] font-semibold text-[#6B9BCC] hover:underline cursor-pointer"
                        onClick={() =>
                          cred.url !== "#" && window.open(cred.url, "_blank")
                        }
                      >
                        <Globe className="w-3 h-3" /> {cred.url}
                      </div>
                      <div className="bg-[#F6F4EE] p-3 rounded-lg flex justify-between items-center text-[10px] font-semibold text-[#2C2C2C]/60 uppercase tracking-tighter">
                        <span>ID: {cred.id}</span>
                        <span>PASS: {cred.pass}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Section */}
            <div className="mt-16 flex flex-col md:flex-row items-center gap-10 bg-[#DA7756] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-5">
                <User className="w-64 h-64" />
              </div>
              <div className="w-48 h-56 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl relative z-10 flex-shrink-0">
                <img
                  src={productData.ownerImage}
                  alt={productData.owner}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-5xl font-semibold font-poppins tracking-tighter uppercase mb-2">
                  {productData.owner}
                </h3>
                <p className="text-white/80 font-semibold font-poppins uppercase tracking-[0.2em] text-sm mb-6 underline decoration-wavy underline-offset-8">
                  Product Champion
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-semibold uppercase border border-white/10 tracking-widest font-poppins">
                    Industry Expert
                  </span>
                  <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-semibold uppercase border border-white/10 tracking-widest font-poppins">
                    Domain Specialist
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BaseProductPage;
