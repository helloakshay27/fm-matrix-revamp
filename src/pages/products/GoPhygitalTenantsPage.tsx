import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { Building2, Users, Bell, ShieldCheck, BarChart2, FileText, Monitor, Presentation, TrendingUp } from 'lucide-react';

const goPhygitalTenantsData: ProductData = {
  name: 'GoPhygital.work (Tenants Building)',
  description: 'A white-labelled tenant app for building services, access, bookings, and community engagement. Provides occupants a seamless digital interface for daily building interactions.',
  brief: 'Give every tenant a single digital touchpoint for everything in their building — access, bookings, services, and community — without the chaos of phone calls and paper registers.',
  excelLikeSummary: true, excelLikeFeatures: true, excelLikeMarket: true, excelLikePricing: false,
  excelLikeSwot: true, excelLikeRoadmap: true, excelLikeBusinessPlan: true, excelLikeGtm: true,
  excelLikeMetrics: true, excelLikePostPossession: true,
  userStories: [
    { title: 'Tenant Onboarding & Access', items: ['Digital tenant registration', 'QR-based building access', 'Visitor pre-approval from app', 'Vehicle access management'] },
    { title: 'Service Requests', items: ['In-app helpdesk ticket raising', 'Maintenance request tracking', 'SLA-based resolution updates', 'Service rating & feedback'] },
    { title: 'Bookings & Amenities', items: ['Conference room booking', 'Parking slot reservation', 'Common area scheduling', 'Cafeteria/pantry ordering'] },
    { title: 'Community & Communication', items: ['Building announcements', 'Community notice board', 'Emergency broadcast alerts', 'Tenant-to-management messaging'] },
  ],
  industries: 'Commercial Real Estate, Offices, IT Park, Co-working, Tenants, Retail, Malls, Hospitals, BFSI, IT/ITES, Retail Chain, SEZ, Warehousing',
  usps: ['USP 1: White-labelled — fully branded as the building/developer app.', 'USP 2: Single app for access, bookings, services, and community.', 'USP 3: Real-time SLA tracking for every tenant service request.', 'USP 4: Data stays on client-owned infrastructure.'],
  includes: ['Tenant Mobile App (iOS + Android)', 'Admin Web Dashboard', 'Building Management Console'],
  upSelling: ['Car Park Integration', 'Cafeteria POS', 'Energy Monitoring Module'],
  integrations: ['CCTV', 'Access Control Hardware', 'WhatsApp Business API'],
  decisionMakers: ['Building Manager', 'Facility Head', 'CRE Operations Head'],
  keyPoints: ['Reduce tenant helpdesk calls by 60%', 'Digital audit trail for all service requests', 'Improve tenant NPS through self-service'],
  roi: ['Faster service request resolution.', 'Reduced front-desk staffing costs.', 'Higher tenant retention through improved experience.'],
  assets: [{ type: 'Link', title: 'Product Deck', url: '#', icon: <Presentation className="w-5 h-5" /> }],
  credentials: [{ title: 'Demo', url: 'https://tenants.gophygital.work', id: 'demo@gophygital.work', pass: 'Tenant#2024', icon: <Monitor className="w-5 h-5" /> }],
  owner: 'Anjali / Ubaid', ownerImage: '',
  extendedContent: {
    featureSummary: (
      <div className="-m-4 overflow-x-auto"><table className="w-full border-collapse text-xs bg-white"><tbody>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><Building2 className="w-4 h-4 text-blue-500" /> Access & Visitor</div></td><td className="p-3 text-gray-700 font-medium">QR building access · Visitor pre-approval · Vehicle management · Contractor access passes</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><FileText className="w-4 h-4 text-green-500" /> Service Requests</div></td><td className="p-3 text-gray-700 font-medium">Helpdesk ticketing · Maintenance tracking · SLA management · Resolution rating</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><BarChart2 className="w-4 h-4 text-purple-500" /> Bookings</div></td><td className="p-3 text-gray-700 font-medium">Conference room · Parking · Common areas · Cafeteria</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><Bell className="w-4 h-4 text-orange-400" /> Communication</div></td><td className="p-3 text-gray-700 font-medium">Announcements · Notice board · Emergency alerts · Messaging</td></tr>
        <tr><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-blue-700"><ShieldCheck className="w-4 h-4 text-orange-400" /> Data Sovereignty (USP)</div></td><td className="p-3 text-blue-700 font-bold">All tenant data stays on client-owned infrastructure. No third-party cloud exposure.</td></tr>
      </tbody></table></div>
    ),
    productSummaryNew: {
      identity: [
        { field: 'Product Name', detail: 'GoPhygital.work — Tenants Building App' },
        { field: 'One-line Description', detail: 'A white-labelled tenant experience app for building access, service requests, bookings, and community engagement.' },
        { field: 'Category', detail: 'Tenant Experience Platform / Building Management App' },
        { field: 'Current Modules (Live)', detail: '[ To be filled ]' },
        { field: 'Product Owner', detail: 'Anjali / Ubaid' },
      ],
      problemSolves: [{ painPoint: 'Core Pain Point', solution: '[ To be filled ]' }],
      whoItIsFor: [
        { role: 'Building/Facility Manager', useCase: 'Manages tenant requests, bookings, and communications.', frustration: 'Managing tenant queries via phone calls and email with no tracking.', gain: 'Unified dashboard with SLA visibility and digital audit trail.' },
        { role: 'Tenant (Company Employee)', useCase: 'Books rooms, raises requests, checks visitor status.', frustration: 'Calling the front desk for every small request.', gain: 'Self-service app for everything in the building.' },
      ],
      today: [{ dimension: 'Single Most Defensible Position', state: '[ To be filled ]' }, { dimension: 'Target Markets', state: 'Commercial Real Estate developers and building operators in India and GCC.' }],
    },
    detailedFeatures: [
      { module: 'Access', feature: 'QR Building Entry', subFeatures: '', works: '[ To be filled ]', userType: 'All', usp: false },
      { module: 'Access', feature: 'Visitor Pre-Approval', subFeatures: '', works: '[ To be filled ]', userType: 'Tenant', usp: false },
      { module: 'Service', feature: 'Helpdesk Ticketing', subFeatures: '', works: '[ To be filled ]', userType: 'Tenant', usp: false },
      { module: 'Booking', feature: 'Conference Room Booking', subFeatures: '', works: '[ To be filled ]', userType: 'Tenant', usp: false },
      { module: 'Communication', feature: 'Announcements', subFeatures: '', works: '[ To be filled ]', userType: 'Admin', usp: false },
    ],
    detailedMarketAnalysis: {
      targetAudience: [{ segment: 'Commercial Real Estate Operators', demographics: '[ To be filled ]', industry: 'Commercial Real Estate', painPoints: '[ To be filled ]', notSolved: '[ To be filled ]', goodEnough: 'Phone + email + paper registers', urgency: 'HIGH', primaryBuyer: 'Building Manager / Facility Head' }],
      companyPainPoints: [{ companyType: 'CRE Developer / Operator', pain1: '[ To be filled ]', pain2: '[ To be filled ]', pain3: '[ To be filled ]', costRisk: '[ To be filled ]' }],
      competitorMapping: [{ name: '[ To be filled ]', targetCustomer: '', pricing: '', discovery: '', strongestFeatures: '', weakness: '', marketGaps: '', threats: '' }],
      detailedPricing: {
        pricingMatrixSubtitle: '[ To be filled ]', pricingFeatureRows: [{ capability: '[ To be filled ]', currentState: '', marketNeed: '', impact: '', status: 'AHEAD', recommendation: '' }],
        pricingSummaryRows: [{ label: '[ To be filled ]', detail: '', tone: 'green' }], pricingCurrentRows: [{ label: 'India Price', detail: '[ To be filled ]' }],
        pricingPositioningRows: [{ question: '[ To be filled ]', answer: '', note: '' }], pricingImprovementRows: [{ currentProp: '', suggestedFix: '', improvedFraming: '', whyItWins: '' }],
        featuresVsMarket: [{ featureArea: '[ To be filled ]', marketStandard: '', ourProduct: '', status: 'AHEAD', summary: '' }],
        comparisonSummary: { ahead: '[ To be filled ]', atPar: '[ To be filled ]', gaps: '[ To be filled ]' },
        pricingLandscape: [{ tier: '[ To be filled ]', model: '', india: '', global: '', included: '', target: '' }],
        positioning: [{ category: 'Key Position', description: '[ To be filled ]' }],
        valuePropositions: [{ currentProp: '[ To be filled ]', segment: '', weakness: '', sharpened: '' }],
      },
      detailedUseCases: { industryUseCases: [{ rank: '1', industry: 'Commercial Real Estate', features: '[ To be filled ]', useCase: '[ To be filled ]', urgency: 'HIGH', primaryBuyer: 'Building Manager', primaryUser: 'Tenant', profile: '[ To be filled ]', currentTool: 'Phone + Email' }] },
    },
    pricing: [
      { plan: 'Basic', price: '[ To be filled ]', description: 'Small buildings up to 500 occupants', features: ['Tenant app', 'Service request module', 'Announcements'], highlighted: false, cta: 'Get Started' },
      { plan: 'Pro', price: '[ To be filled ]', description: 'Mid-size buildings 500–2000 occupants', features: ['Everything in Basic', 'Room bookings', 'Visitor management', 'Analytics'], highlighted: true, cta: 'Start Trial' },
      { plan: 'Enterprise', price: 'Custom', description: 'Large campuses and multi-building portfolios', features: ['Everything in Pro', 'White-label branding', 'Custom integrations', 'SLA management'], highlighted: false, cta: 'Contact Sales' },
    ],
    swot: { strengths: ['[ To be filled ]'], weaknesses: ['[ To be filled ]'], opportunities: ['[ To be filled ]'], threats: ['[ To be filled ]'] },
    roadmap: [{ quarter: 'Q1 2025', phase: 'Foundation', items: ['[ To be filled ]'], status: 'completed' }, { quarter: 'Q2 2025', phase: 'Growth', items: ['[ To be filled ]'], status: 'planned' }],
    businessPlan: { vision: '[ To be filled ]', mission: '[ To be filled ]', targetRevenue: '[ To be filled ]', keyMilestones: [{ milestone: '[ To be filled ]', targetDate: 'Q1 2025', status: 'planned' }] },
    gtmStrategy: [{ phase: 'Phase 1', description: '[ To be filled ]', tactics: ['[ To be filled ]'], timeline: 'Q1 2025' }],
    metrics: [{ name: 'Active Tenant Users', current: '[ To be filled ]', target: '[ To be filled ]', unit: 'users', trend: 'up' }, { name: 'Service Request Resolution Time', current: '[ To be filled ]', target: '< 4 hrs', unit: 'hrs', trend: 'down' }],
    postPossessionJourney: [{ stage: 'Tenant Onboarding', description: '[ To be filled ]', touchpoints: ['App download'], tools: ['Tenant App'] }, { stage: 'Daily Interactions', description: '[ To be filled ]', touchpoints: ['Bookings', 'Requests'], tools: ['App', 'Admin Dashboard'] }],
  },
};

const GoPhygitalTenantsPage: React.FC = () => <BaseProductPage productData={goPhygitalTenantsData} />;
export default GoPhygitalTenantsPage;
