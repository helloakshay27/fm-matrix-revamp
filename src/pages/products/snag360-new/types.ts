// Snag360 New Page Types - Isolated from other products
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
  module: string;
  feature: string;
  subFeatures: string;
  howItWorks: string;
  userType: string;
  isUSP: boolean;
}

export interface MarketIndustry {
  industry: string;
  description: string;
  opportunity: string;
}

export interface Competitor {
  name: string;
  category: string;
  coverage: string;
  keyStrength: string;
  keyWeakness: string;
  snag360Advantage: string;
}

export interface PricingTier {
  name: string;
  target: string;
  price: string;
  billing: string;
  features: string[];
  bestFor: string;
  recommended?: boolean;
}

export interface CompetitivePositioning {
  factor: string;
  snag360: string;
  enterpriseERP: string;
  pointSolutions: string;
}

export interface BuyerValueProp {
  buyer: string;
  valueProps: string[];
}

export interface UseCase {
  industry: string;
  scenario: string;
  challenge: string;
  solution: string;
  outcome: string;
  impact: string;
  keyFeatures: string[];
}

export interface RoadmapPhase {
  phase: string;
  timeline: string;
  focus: string;
  status: string;
  deliverables: string[];
}

export interface BusinessPlanQuestion {
  question: string;
  answer: string;
  category: string;
}

export interface GTMTargetGroup {
  segment: string;
  characteristics: string;
  painPoints: string[];
  messaging: string[];
  channels: string[];
  successMetrics: string[];
}

export interface ClientMetric {
  metric: string;
  description: string;
  before: string;
  after: string;
  improvement: string;
}

export interface BusinessMetric {
  metric: string;
  description: string;
  target: string;
  current: string;
  timeline: string;
  priority: string;
}

export interface SWOTItem {
  item: string;
  description: string;
}

export interface Enhancement {
  title: string;
  description: string;
  category: string;
  priority: string;
  timeline: string;
  benefit: string;
}

export interface Asset {
  name: string;
  type: string;
  url: string;
  description: string;
}

export interface Credential {
  environment: string;
  role: string;
  username: string;
  password: string;
}

export interface MarketStats {
  globalMarket: string;
  globalCAGR: string;
  indiaMarket: string;
  indiaConstructionMarket: string;
  indiaConstructionCAGR: string;
  asiaPacificCAGR: string;
}

export type TabKey =
  | "summary"
  | "features"
  | "market"
  | "pricing"
  | "usecases"
  | "roadmap"
  | "business"
  | "gtm"
  | "metrics"
  | "swot"
  | "enhancements"
  | "assets";

export interface TabConfig {
  key: TabKey;
  label: string;
  icon?: React.ReactNode;
}
