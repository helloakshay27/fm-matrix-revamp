import React from "react";

export interface ProductData {
  name: string;
  description: string;
  brief: string;
  tabOrder?: (
    | "summary"
    | "features"
    | "usecases"
    | "market"
    | "pricing"
    | "swot"
    | "roadmap"
    | "enhancements"
    | "metrics"
    | "business"
    | "gtm"
    | "assets"
  )[];
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
  modernSummary?: boolean;
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
    rawSummaryTable?: React.ReactNode | null;
    rawFeaturesTable?: React.ReactNode | null;
    rawUseCasesTable?: React.ReactNode | null;
    rawMarketTable?: React.ReactNode | null;
    rawPricingTable?: React.ReactNode | null;
    rawPricingSections?: {
      title: string;
      subtitle?: string;
      sections: {
        title: string;
        columns: string[];
        rows: string[][];
      }[];
    };
    featureSummary?: string | React.ReactNode;
    productSummaryNew: {
      summarySubtitle?: string;
      identity: { field: string; detail: string }[];
      problemSolves: { painPoint: string; solution: string }[];
      whoItIsFor: {
        role: string;
        useCase: string;
        frustration: string;
        gain: string;
      }[];
      today: { dimension: string; state: string }[];
      featureSummary?: {
        modules: {
          module: string;
          description: string;
          isUSP?: boolean;
        }[];
      };
      summaryFeatureModules?: { label: string; detail: string }[];
      summaryUsps?: { label: string; detail: string }[];
      tractionMilestones?: { label: string; detail: string }[];
      perspectives?: {
        title: string;
        featureSummary?: string | React.ReactNode;
        identity: { field: string; detail: string }[];
        problemSolves: { painPoint: string; solution: string }[];
        whoItIsFor: {
          role: string;
          useCase: string;
          frustration: string;
          gain: string;
        }[];
        today: { dimension: string; state: string }[];
        summaryFeatureModules?: { label: string; detail: string }[];
        summaryUsps?: { label: string; detail: string }[];
        tractionMilestones?: { label: string; detail: string }[];
      }[];
    };
    detailedFeatures: {
      module: string;
      feature: string;
      subFeatures: string;
      description?: string;
      works: string;
      userType: string;
      usp: boolean;
      status?: string;
      priority?: string;
      notes?: string;
    }[];
    featureBenchmark?: {
      featureArea: string;
      marketStandard: string;
      ourProduct: string;
      status: string;
      whereWeStand: string;
      dealImpact: string;
    }[];
    valuePropositions?: {
      num: string;
      current: string;
      communicates: string;
      weakness: string;
      sharpened: string;
      proofPoint: string;
    }[];
    pricingData?: {
      label: string;
      detail: string;
      highlight?: "info" | "now" | "future" | "risk";
    }[];
    positioningData?: {
      question: string;
      answer: string;
    }[];
    detailedMarketAnalysis?: {
      isClubMarket?: boolean;
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
      globalMarketSize?: {
        metric: string;
        value: string;
        source: string;
      }[];
      industries?: {
        rank: string | number;
        segment: string;
        indicator: string;
        whyMatters: string;
        painPoints: string;
        revenuePotential: string;
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
        rank: number;
        industry: string;
        buyReason: string;
        scale: string;
        decisionMaker: string;
        dealSize: string;
        indiaRelevance?: string;
        vendorComplexity?: string;
        keyVmsUseCase?: string;
        approxVendorCount?: string;
        complianceNeed?: string;
        growthDriver2026?: string;
      }[];
      targetAudience?: {
        segment: string;
        painPoints: string;
        notSolved: string;
        goodEnough: string;
        revenueOpportunity?: string;
        urgencySignal?: string;
        triggerToSwitch?: string;
        demographics?: string;
        geography?: string;
        industry?: string;
        urgency?: string;
        primaryBuyer?: string;
      }[];
      companyPainPoints?: {
        companyType: string;
        pain1: string;
        pain2: string;
        pain3: string;
        goodEnough?: string;
        willingToPay?: string;
        costRisk?: string;
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
        pricingRisk?: string;
        threatLevel?: string;
        isPrimary?: boolean;
        location?: string;
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
        indiaPresence?: string;
        targetSegment?: string;
        differentiator2026?: string;
      }[];
      competitorSummary?: string;
    };
    detailedPricing?: {
      isClubPricing?: boolean;
      isSnagPricing?: boolean;
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
        marketStandard?: string;
        ourProduct?: string;
        summary?: string;
        status?: string;
        liveStatus?: string;
        whereWeStand?: string;
        dealImpact?: string;
        vmsStatus?: string;
        competitors?: {
          name: string;
          status: string;
        }[];
      }[];
      pricingLandscape?: {
        tier: string;
        model: string;
        india: string;
        global: string;
        included: string;
        target: string;
        vendorCount?: string;
        orgSize?: string;
        price?: string;
        modules?: string;
      }[];
      snagFeatureComparison?: {
        feature: string;
        snag360?: string;
        snag?: string;
        falconBrick?: string;
        falcon?: string;
        procore: string;
        novade: string;
        snagR: string;
        safetyCulture?: string;
        safety?: string;
        status: string;
      }[];
      pricingLandscapeRows?: {
        tier: string;
        model: string;
        indiaPrice?: string;
        india?: string;
        globalPrice?: string;
        global?: string;
        included: string;
        segment?: string;
        target?: string;
      }[];
      competitivePositioningStatement?: string;
      competitorMatrix?: {
        competitors: string[];
        rows: {
          feature: string;
          vms: string;
          statuses: string[];
        }[];
      };
      competitivePositionSummary?: {
        advantage: string[];
        threat: string[];
        atPar: string[];
      };
      currentPricingMarket?: { category: string; description: string }[];
      positioningStatement?: string;
      positioning?: { category: string; description: string }[];
      comparisonSummary?: {
        ahead: string;
        atPar: string;
        gaps: string;
        advantageAreas?: string[];
        threatAreas?: string[];
      };
      valueProps?: {
        role: string;
        prop: string;
        outcome: string;
        feature: string;
      }[];
      clubFeatureComparison?: {
        feature: string;
        lockated: string;
        shawman: string;
        mindbody: string;
        glofox: string;
        omnify: string;
      }[];
      clubPricingLandscapeRows?: {
        competitor: string;
        entryPrice: string;
        midPrice: string;
        enterprisePrice: string;
        model: string;
        segment: string;
      }[];
      clubPositioning?: {
        dimension: string;
        statement: string;
      }[];
      priceCompetitiveness?: string;
      valuePropositions?: {
        currentProp: string;
        segment: string;
        weakness: string;
        sharpened: string;
        role?: string;
        prop?: string;
        outcome?: string;
        feature?: string;
        objection?: string;
        rank?: string;
        communicatesToday?: string;
        proofPoint?: string;
        proposition?: string;
        quantifiedBenefit?: string;
        targetBuyer?: string;
      }[];
    };
    detailedUseCases?: {
      industryUseCases: {
        rank: string | number;
        industry: string;
        features: string;
        useCase?: string;
        corePainPoint?: string;
        workflow?: string;
        profile?: string;
        currentTool?: string;
        outcome?: string;
        urgency?: string;
        primaryBuyer?: string;
        primaryUser?: string;
        companyProfile?: string;
      }[];
      internalTeamUseCases: {
        team: string;
        features: string;
        process?: string;
        benefit?: string;
        howTheyUse?: string;
        frequency?: string;
        modules?: string;
        relevantFeatures?: string;
        keyPainWithoutTool?: string;
        collaborationWith?: string;
        successMetric?: string;
        usage?: string;
        problem?: string;
        gain?: string;
      }[];
    };
    detailedRoadmap?: {
      roadmapTableVariant?: "html";
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
        colorContext: "red" | "yellow" | "green" | "blue" | "purple";
        phaseDescription?: string;
        summary?: string;
        items: {
          phaseLabel?: string;
          theme?: string;
          featureName?: string;
          whatItIs: string;
          whyItMatters: string;
          unlockedSegment: string;
          successMetric?: string;
          effort: string;
          owner: string;
          impact?: string;
          priority?: string;
          dealRisk?: string;
          estTimeline?: string;
          revenueImpact?: string;
        }[];
      }[];
      enhancementRoadmap?: {
        rowId?: string;
        module?: string;
        featureName: string;
        category?: string;
        description?: string;
        targetUser?: string;
        competitorLeapfrogged?: string;
        currentStatus: string;
        enhancedVersion: string;
        integrationType: string;
        effort?: string;
        impact?: string;
        outcome?: string;
        priority?: string;
        owner?: string;
      }[];
    };
    detailedBusinessPlan?: {
      isClubBusinessPlan?: boolean;
      planQuestions: {
        id?: string;
        question: string;
        answer: string;
        source?: string;
        flag: string;
        colorContext?:
          | "blue"
          | "red"
          | "green"
          | "purple"
          | "teal"
          | "yellow"
          | "orange";
      }[];
      checklist?: {
        reference: string;
        action: string;
      }[];
      founderChecklist?: {
        id?: string;
        item: string;
        verify: string;
        status: string;
      }[];
    };
    detailedGTM?: {
      isClubGTM?: boolean;
      targetGroups: {
        id?: string;
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
      isClubSWOT?: boolean;
      strengths: { headline: string; explanation: string }[];
      weaknesses: { headline: string; explanation: string }[];
      opportunities: { headline: string; explanation: string }[];
      threats: { headline: string; explanation: string }[];
    };
    detailedEnhancementRoadmap?: {
      isClubEnhancement?: boolean;
      innovations: {
        id: string | number;
        enhancement: string;
        type: string;
        description: string;
        segment: string;
        impact: string;
      }[];
      top5: {
        enhancement: string;
        type: string;
        whyItMatters: string;
        competitor: string;
        timeline: string;
      }[];
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
    pricing?: {
      plan: string;
      price: string;
      description: string;
      features: string[];
      highlighted: boolean;
      cta: string;
    }[];
    swot?: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    roadmap?: {
      quarter: string;
      phase: string;
      items: string[];
      status: string;
    }[];
    businessPlan?: {
      vision: string;
      mission: string;
      targetRevenue: string;
      keyMilestones: {
        milestone: string;
        targetDate: string;
        status: string;
      }[];
    };
    gtmStrategy?: {
      phase: string;
      description: string;
      tactics: string[];
      timeline: string;
    }[];
    metrics?: {
      name: string;
      current: string;
      target: string;
      unit: string;
      trend: string;
    }[];
    postPossessionJourney?: {
      stage: string;
      description: string;
      touchpoints: string[];
      tools: string[];
    }[];
  };
}

// Sample SWOT table data extracted from provided HTML (Procurement Management ERP)
export const procurementManagementDetailedSWOTTable = {
  strengths: {
    columns: ["#", "Strength", "Explanation"],
    rows: [
      [
        "1",
        "Native India Compliance",
        "Built-in GST, TDS, and e-invoicing support eliminates need for expensive localization unlike SAP or Oracle",
      ],
      [
        "2",
        "BOQ-Linked Procurement",
        "Unique construction-grade feature that validates every MOR against project BOQ, preventing material leakage",
      ],
      [
        "3",
        "Auto-Trigger MOR",
        "Threshold-based automatic replenishment eliminates stockouts and reduces emergency purchases by 45%",
      ],
      [
        "4",
        "RFID/QR Material Tracking",
        "End-to-end material lifecycle tracking from warehouse to site, a feature competitors lack natively",
      ],
      [
        "5",
        "Competitive Pricing",
        "INR 2,500-15,000/user/month vs INR 15,000-55,000 for global players, targeting underserved mid-market",
      ],
      [
        "6",
        "Construction Project Hierarchy",
        "INR 2,500-15,000/user/month versus INR 15,000-55,000 for global platforms, with superior India-specific functionality including GST/TDS compliance, BOQ integration, Gate Management, and service contract modules that global tools require expensive customization to deliver.",
      ],
      [
        "7",
        "AI-Powered Bid Analytics",
        "L1/L2/L3 ranking with landed cost calculation for objective vendor selection",
      ],
      [
        "8",
        "Comprehensive Module Coverage",
        "14 integrated modules covering entire P2P lifecycle from MOR demand creation through tendering, purchase order management, gate management, GRN and QC, inventory control, billing and payment, audit and control, plus P0 roadmap for MTO and service contract modules.",
      ],
      [
        "9",
        "Mobile-First Design",
        "Full MOR creation and approval workflows on mobile for field teams and site engineers",
      ],
      [
        "10",
        "Quick Implementation",
        "4-6 week deployment vs 12-18 months for enterprise solutions like SAP Ariba",
      ],
    ],
  },
  weaknesses: {
    columns: ["#", "Weakness", "Explanation"],
    rows: [
      [
        "1",
        "Limited AI Maturity",
        "Predictive analytics and AI spend intelligence lag behind Coupa Navi and Zycus Merlin capabilities",
      ],
      [
        "2",
        "No Multi-Language Support",
        "Currently English-only interface limits adoption in regional markets and Tier-2/3 cities",
      ],
      [
        "3",
        "Offline Mode Absent",
        "No offline-first mobile capability for remote construction sites with poor connectivity",
      ],
      [
        "4",
        "Brand Recognition",
        "New entrant competing against established players with 20+ years of market presence",
      ],
      [
        "5",
        "Limited Integration Ecosystem",
        "Fewer pre-built connectors compared to SAP or Oracle ecosystem today. Tally integration in Phase 1 roadmap. Power BI connector and 50+ API connectors in Phase 3. Currently requires custom integration for finance platforms other than Tally.",
      ],
      [
        "6",
        "Small Customer Base",
        "Early-stage traction limits reference customers and case studies for enterprise sales",
      ],
      [
        "7",
        "No Global Compliance",
        "India-focused compliance engine not ready for international expansion (UAE, US, UK)",
      ],
      [
        "8",
        "Basic Analytics",
        "Dashboard and reporting capabilities behind enterprise BI expectations",
      ],
      [
        "9",
        "Single Geography Focus",
        "No local support or data centers outside India currently",
      ],
      [
        "10",
        "Limited SI Partnerships",
        "No established relationships with major system integrators for enterprise deals",
      ],
    ],
  },
  opportunities: {
    columns: ["#", "Opportunity", "Explanation"],
    rows: [
      [
        "1",
        "Low Enterprise Adoption",
        "Less than 15% of Indian enterprises use procurement software, massive greenfield opportunity",
      ],
      [
        "2",
        "Infrastructure Push",
        "INR 10 lakh crore government infrastructure spend (PM Gati Shakti) driving digitization",
      ],
      [
        "3",
        "Construction Tech Boom",
        "Real estate sector recovering with focus on operational efficiency and cost control",
      ],
      [
        "4",
        "GST Compliance Mandate",
        "E-invoicing requirements pushing companies toward integrated procurement solutions",
      ],
      [
        "5",
        "Remote Work Acceleration",
        "Post-pandemic distributed teams need cloud-based procurement with mobile access",
      ],
      [
        "6",
        "GeM Integration Potential",
        "Government e-Marketplace integration (Phase 3 roadmap) can unlock INR 3+ lakh crore PSU procurement market. Internal Fulfilment/MTO module (P0) addresses government and PSU multi-site transfer requirements, positioning for GeM and defense procurement opportunities.",
      ],
      [
        "7",
        "AI Wave in Procurement",
        "80% of CPOs planning GenAI adoption, positioning for AI-native procurement platform",
      ],
      [
        "8",
        "Mid-Market Gap",
        "No dominant player in INR 50 Cr - 500 Cr revenue segment, underserved by expensive enterprise tools",
      ],
      [
        "9",
        "SI Partnership Opportunity",
        "System integrators seeking India-focused procurement solutions to complement ERP implementations",
      ],
      [
        "10",
        "Regional Language Demand",
        "First mover advantage for Hindi, Tamil, Telugu language support in procurement software",
      ],
    ],
  },
  threats: {
    columns: ["#", "Threat", "Explanation"],
    rows: [
      [
        "1",
        "SAP/Oracle Price Cuts",
        "Global giants may reduce India pricing to defend market share against local competitors",
      ],
      [
        "2",
        "Zycus Expansion",
        "Indian enterprise leader expanding into mid-market with localized offerings",
      ],
      [
        "3",
        "Moglix/Cognilix Growth",
        "Well-funded unicorns expanding from marketplace to full procurement platform",
      ],
      [
        "4",
        "ERP Vendor Bundling",
        "Tally, Zoho, Oracle NetSuite may bundle procurement modules at marginal cost",
      ],
      [
        "5",
        "Economic Slowdown",
        "Construction and infrastructure spending cuts during economic downturns delay purchases",
      ],
      [
        "6",
        "Talent Competition",
        "Difficulty hiring experienced procurement domain experts and enterprise sales talent",
      ],
      [
        "7",
        "Data Security Concerns",
        "Enterprise customers may hesitate with cloud solutions due to data sovereignty fears",
      ],
      [
        "8",
        "Regulatory Changes",
        "GST/TDS rule changes require continuous compliance updates and engineering investment",
      ],
      [
        "9",
        "Customer Concentration Risk",
        "Early-stage dependence on few large customers creates revenue volatility",
      ],
      [
        "10",
        "Technology Obsolescence",
        "Rapid AI advancement may require continuous re-platforming to stay competitive",
      ],
    ],
  },
};

// Individual THREATS table (kept minimal to match provided image exactly)
export const procurementManagementThreatsTable = {
  columns: ["#", "Threat", "Explanation"],
  rows: [
    [
      "1",
      "SAP/Oracle Price Cuts",
      "Global giants may reduce India pricing to defend market share against local competitors",
    ],
    [
      "2",
      "Zycus Expansion",
      "Indian enterprise leader expanding into mid-market with localized offerings",
    ],
    [
      "3",
      "Moglix/Cognilix Growth",
      "Well-funded unicorns expanding from marketplace to full procurement platform",
    ],
    [
      "4",
      "ERP Vendor Bundling",
      "Tally, Zoho, Oracle NetSuite may bundle procurement modules at marginal cost",
    ],
    [
      "5",
      "Economic Slowdown",
      "Construction and infrastructure spending cuts during economic downturns delay purchases",
    ],
    [
      "6",
      "Talent Competition",
      "Difficulty hiring experienced procurement domain experts and enterprise sales talent",
    ],
    [
      "7",
      "Data Security Concerns",
      "Enterprise customers may hesitate with cloud solutions due to data sovereignty fears",
    ],
    [
      "8",
      "Regulatory Changes",
      "GST/TDS rule changes require continuous compliance updates and engineering investment",
    ],
    [
      "9",
      "Customer Concentration Risk",
      "Early-stage dependence on few large customers creates revenue volatility",
    ],
    [
      "10",
      "Technology Obsolescence",
      "Rapid AI advancement may require continuous re-platforming to stay competitive",
    ],
  ],
};

