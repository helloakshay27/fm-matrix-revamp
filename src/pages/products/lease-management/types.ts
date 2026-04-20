// Lease Management Page Types - Isolated from other products

export interface ProductIdentity {
  field: string;
  detail: string;
}

export interface PainPoint {
  painPoint: string;
  solution: string;
}

export interface TargetUser {
  role: string;
  useCase: string;
  frustration: string;
  benefit: string;
}

export interface CurrentState {
  dimension: string;
  state: string;
}

export interface Feature {
  id: number;
  module: string;
  feature: string;
  description?: string;
  howItWorks: string;
  userType: string;
  isUSP: boolean;
}

export interface TargetAudience {
  segment: string;
  profile?: string;
  need?: string;
  hook?: string;
  priceSensitivity?: string;
  demographics?: string;
  industryProfile?: string;
  painPoints?: string[];
  unsolved?: string;
  goodEnough?: string;
  urgency?: string;
  buyerTitle?: string;
}

export interface FeatureComparison {
  feature?: string;
  starter?: string | boolean;
  professional?: string | boolean;
  enterprise?: string | boolean;
  area?: string;
  marketStandard?: string;
  ourProduct?: string;
  status?: "AHEAD" | "AT PAR" | "GAP";
  whyMatters?: string;
}

export interface UseCase {
  rank: number;
  industry: string;
  leaseType?: string;
  useCase?: string;
  keyNeed?: string;
  howRelevant?: string;
  idealProfile?: string;
  urgency?: string;
  primaryBuyer?: string;
  primaryUser?: string;
}

export interface LesseeTeamUseCase {
  team: string;
  howRelevant: string;
  specificModules: string;
  keyBenefit: string;
  dayToDay: string;
  frequencyOfUse: string;
}

export interface LessorIndustryUseCase {
  rank: number;
  industry: string;
  howRelevant: string;
  idealProfile: string;
  decisionMaker: string;
  currentToolReplaced: string;
  estimatedDealSize: string;
}

export interface LessorTeamUseCase {
  teamRole: string;
  primaryUseCase: string;
  keyActions: string;
  frequencyOfUse: string;
  metricsTracked: string;
}

export interface RoadmapItem {
  item?: string;
  feature?: string;
  description: string;
  status?: "completed" | "in-progress" | "planned";
  whyMatters?: string;
  segmentUnlocked?: string;
  dealRisk?: string;
  priority?: string;
  marketSignal?: string;
}

export interface RoadmapPhase {
  phase: string;
  timeline: string;
  focus?: string;
  items: RoadmapItem[];
}

export interface BusinessPlanQuestion {
  question: string;
  answer?: string;
  suggestedAnswer?: string;
  source?: string;
  founderNote?: string;
}

export interface GTMSalesElement {
  element: string;
  details: string;
}

export interface GTMTargetGroup {
  targetGroup?: string;
  painPoint?: string;
  messaging?: string;
  channel?: string;
  closingTactic?: string;
  name?: string;
  elements?: GTMSalesElement[];
}

export interface ClientMetric {
  id: number;
  metric?: string;
  target?: string;
  description?: string;
  name?: string;
  whatMeasures?: string;
  impactRange?: string;
  featureDriving?: string;
  howCaused?: string;
  landingClaim?: string;
}

export interface SWOTItem {
  item: string;
  description: string;
}

export interface SWOTAnalysis {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface Enhancement {
  id: number;
  module: string;
  feature: string;
  currentBehavior: string;
  enhancedBehavior: string;
  integrationType: string;
  impactLevel: string;
  revenueImpact: string;
  isAI: boolean;
  isMCP: boolean;
  effort: string;
  priority: string;
}

export interface Asset {
  name: string;
  type: string;
  url: string;
  description: string;
  category?: string;
}

export interface Credential {
  platform: string;
  username: string;
  accessLevel: string;
  environment?: string;
  url?: string;
  password?: string;
  notes?: string;
}

export interface ProductMetadata {
  name: string;
  version: string;
  owner: string;
  industries: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  billing?: string;
  features: string[];
  target?: string;
  bestFor?: string;
  recommended?: boolean;
}

// Features and Pricing - Extended Types
export interface CompetitiveSummaryItem {
  category: string;
  detail: string;
  implication: string;
}

export interface StandardPricingModel {
  question: string;
  answer: string;
}

export interface TypicalPriceRange {
  tier: string;
  indiaPrice: string;
  indiaWho: string;
  globalPrice: string;
  globalWho: string;
}

export interface CompetitorFeaturePlan {
  feature: string;
  freeStarter: string;
  professionalGrowth: string;
  enterprise: string;
}

export interface RecommendedPricingLessee {
  pricingStage: string;
  indiaEntryTier: string;
  indiaMidMarket: string;
  globalEntryTier: string;
  globalMidMarket: string;
  notes: string;
}

export interface PositioningItem {
  label: string;
  description: string;
}

export interface ValueProposition {
  currentValue: string;
  whoResonates: string;
  whatsWeak: string;
  improvedValue: string;
}

// Lessor Perspective Types
export interface LessorFeatureComparison {
  area: string;
  marketStandard: string;
  ourProduct: string;
  status: "AHEAD" | "AT PAR" | "GAP";
}

export interface LessorCompetitiveSummaryItem {
  category: string;
  detail: string;
}

export interface LessorPricingModel {
  model: string;
  howItWorks: string;
  whoUsesIt: string;
  indiaApplicability: string;
}

export interface RecommendedPricingLessor {
  segment: string;
  now: string;
  sixMonths: string;
  eighteenMonths: string;
}

export interface LessorPositioning {
  level: string;
  description: string;
}

export interface LessorValueProposition {
  title: string;
  currentState: string;
  improvedValue: string;
}

export interface TopEnhancement {
  rank: number;
  feature: string;
  module: string;
  reason?: string;
  why?: string;
  isAI: boolean;
  isMCP: boolean;
}

// Market Analysis Types
export interface CompanyPainPoint {
  companyType: string;
  painPoint1: string;
  painPoint2: string;
  painPoint3: string;
  costRisk: string;
}

export interface MarketCompetitor {
  competitor: string;
  primaryTargetCustomer: string;
  pricingModel: string;
  howBuyersDiscover: string;
  strongestFeatures: string;
  keyWeaknesses: string;
  marketGap: string;
  recentInnovation: string;
}

export interface LessorTargetAudience {
  segment: string;
  whoTheyAre: string;
  sizeOfSegment: string;
  primaryPainPoint: string;
  whatTheyNeedMost: string;
  decisionMaker: string;
  budgetRange: string;
  priority: string;
}

export interface LessorCompetitor {
  competitor: string;
  lessorUseCaseCoverage: string;
  keyLessorFeatures: string;
  pricing: string;
  lessorMarketPosition: string;
  indiaLessorFit: string;
  ourAdvantage: string;
  threatLevel: string;
}
