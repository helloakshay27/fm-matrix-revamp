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

export interface TopEnhancement {
  rank: number;
  feature: string;
  module: string;
  reason?: string;
  why?: string;
  isAI: boolean;
  isMCP: boolean;
}
