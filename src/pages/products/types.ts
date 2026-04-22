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
        marketStandard: string;
        ourProduct: string;
        summary: string;
        status: string;
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
      valuePropositions?: {
        currentProp: string;
        segment: string;
        weakness: string;
        sharpened: string;
        role?: string;
        prop?: string;
        outcome?: string;
        feature?: string;
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
      founderChecklist?: {
        id?: string;
        item: string;
        verify: string;
        status: string;
      }[];
    };
    detailedGTM?: {
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
