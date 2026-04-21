import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { ShieldCheck, FileText, Bell, BarChart2, Monitor, Presentation } from 'lucide-react';

const ptwData: ProductData = {
  name: 'Permit to Work (PTW)',
  description: 'A digital permit system for approvals, field execution, compliance, and closure. Controls high-risk work through structured permits, approvals, and compliance tracking.',
  brief: 'Eliminate paper permit workflows. PTW ensures every high-risk work order is approved, tracked, and closed with a full digital audit trail — reducing safety incidents and regulatory risk.',
  excelLikeSummary: true, excelLikeFeatures: true, excelLikeMarket: true, excelLikePricing: false,
  excelLikeSwot: true, excelLikeRoadmap: true, excelLikeBusinessPlan: true, excelLikeGtm: true,
  excelLikeMetrics: true, excelLikePostPossession: true,
  userStories: [
    { title: 'Permit Issuance', items: ['Digital permit creation by work supervisor', 'Multi-level approval workflow (HOD, Safety Officer, Site Manager)', 'Risk assessment checklist attachment', 'Time-bound permit validity with auto-expiry'] },
    { title: 'Field Execution & Monitoring', items: ['QR-based permit scan at worksite entry', 'Real-time status tracking (Pending / Active / Closed)', 'Field officer sign-off at work start and completion', 'Deviation or incident linkage from active permit'] },
    { title: 'Compliance & Audit', items: ['Full digital audit trail per permit', 'CAPA (Corrective & Preventive Action) linkage', 'Regulatory compliance reports', 'Export to PDF for audit submissions'] },
    { title: 'Notifications & Escalations', items: ['Approval pending alerts', 'Permit expiry warnings', 'Work completion confirmation notifications', 'Escalation for overdue closures'] },
  ],
  industries: 'Manufacturing, EPCE, Industrial & Logistic Parks, Facility Management, Data Centers, IT Park, Pharma, Chemicals, Warehousing, SEZ',
  usps: ['USP 1: Multi-level digital approval replaces paper permit books.', 'USP 2: QR-based field execution verification ensures on-site compliance.', 'USP 3: Full audit trail for every permit, closure, and deviation.', 'USP 4: Integrated CAPA linkage from permit deviations.'],
  includes: ['Web Admin Console', 'Mobile Field App', 'Approver Dashboard', 'Compliance Reports'],
  upSelling: ['Incident Management Module', 'HSE Integration', 'IoT Sensor Link'],
  integrations: ['Incident Management', 'HSE App', 'ERP Systems'],
  decisionMakers: ['Safety Head', 'Plant GM', 'Facility Manager', 'Compliance Officer'],
  keyPoints: ['Eliminate unauthorised work starting without approval', 'Digital proof for safety audits', 'Reduce permit processing time by 70%'],
  roi: ['Reduced LTIR (Lost Time Injury Rate).', 'Audit readiness without manual paperwork.', 'Faster permit approval cycle reducing operational downtime.'],
  assets: [{ type: 'Link', title: 'Product Overview', url: '#', icon: <Presentation className="w-5 h-5" /> }],
  credentials: [{ title: 'Demo', url: 'https://ptw.gophygital.work', id: 'demo@gophygital.work', pass: 'PTW#2024', icon: <Monitor className="w-5 h-5" /> }],
  owner: 'Abdul / Vinayak', ownerImage: '',
  extendedContent: {
    featureSummary: (
      <div className="-m-4 overflow-x-auto"><table className="w-full border-collapse text-xs bg-white"><tbody>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><FileText className="w-4 h-4 text-blue-500" /> Permit Creation</div></td><td className="p-3 text-gray-700 font-medium">Digital permit forms · Risk assessment attachment · Permit type classification · Time-bound validity</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><ShieldCheck className="w-4 h-4 text-green-500" /> Multi-level Approval</div></td><td className="p-3 text-gray-700 font-medium">Configurable approval hierarchy · Sequential and parallel approval flows · Mobile approvals · Rejection with reason</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><BarChart2 className="w-4 h-4 text-purple-500" /> Field Execution</div></td><td className="p-3 text-gray-700 font-medium">QR scan at worksite · Field sign-off · Real-time status · Incident linkage</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><Bell className="w-4 h-4 text-orange-400" /> Notifications</div></td><td className="p-3 text-gray-700 font-medium">Approval pending alerts · Expiry warnings · Completion confirmations · Escalations</td></tr>
        <tr><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-blue-700"><ShieldCheck className="w-4 h-4 text-orange-400" /> Audit Trail (USP)</div></td><td className="p-3 text-blue-700 font-bold">Complete digital record of every permit — creation, approval, execution, and closure — exportable for regulatory audits.</td></tr>
      </tbody></table></div>
    ),
    productSummaryNew: {
      identity: [
        { field: 'Product Name', detail: 'Permit to Work (PTW) by GoPhygital' },
        { field: 'One-line Description', detail: 'A digital permit workflow platform that replaces paper-based high-risk work authorization with multi-level approvals, QR field execution, and full audit trails.' },
        { field: 'Category', detail: 'Safety & Compliance Platform / EHS Module' },
        { field: 'Current Modules (Live)', detail: '[ To be filled ]' },
        { field: 'Product Owner', detail: 'Abdul / Vinayak' },
      ],
      problemSolves: [{ painPoint: 'Core Pain Point', solution: 'Paper PTW books allow high-risk work to proceed with bypassed approvals and no field-level compliance tracking, making safety audits impossible and regulatory proof difficult.' }],
      whoItIsFor: [
        { role: 'Safety Officer', useCase: 'Issues, approves, and closes permits. Monitors active worksites.', frustration: 'Cannot track which permits are active in the field at any given time.', gain: 'Live dashboard of all active, pending, and expired permits.' },
        { role: 'Plant / Facility Manager', useCase: 'Approves high-risk work orders and reviews compliance reports.', frustration: 'Audit preparation requires collecting paper permits from multiple locations.', gain: 'One-click audit export with complete permit history.' },
      ],
      today: [{ dimension: 'Single Most Defensible Position', state: '[ To be filled ]' }, { dimension: 'Target Markets', state: 'Manufacturing, Industrial Parks, Pharma, Chemical plants in India and GCC.' }],
    },
    detailedFeatures: [
      { module: 'Permit', feature: 'Digital Permit Creation', subFeatures: '', works: '[ To be filled ]', userType: 'Supervisor', usp: false },
      { module: 'Approval', feature: 'Multi-level Approval Workflow', subFeatures: '', works: '[ To be filled ]', userType: 'Safety Officer / HOD', usp: true },
      { module: 'Field', feature: 'QR-based Field Execution', subFeatures: '', works: '[ To be filled ]', userType: 'Field Officer', usp: true },
      { module: 'Compliance', feature: 'Audit Trail & Reports', subFeatures: '', works: '[ To be filled ]', userType: 'Compliance Officer', usp: true },
      { module: 'Notifications', feature: 'Escalation Alerts', subFeatures: '', works: '[ To be filled ]', userType: 'All', usp: false },
    ],
    detailedMarketAnalysis: {
      targetAudience: [{ segment: 'Manufacturing Plants', demographics: '[ To be filled ]', industry: 'Manufacturing', painPoints: '[ To be filled ]', notSolved: '[ To be filled ]', goodEnough: 'Paper permit books', urgency: 'HIGH', primaryBuyer: 'Safety Head / Plant GM' }],
      companyPainPoints: [{ companyType: 'Industrial Facility', pain1: '[ To be filled ]', pain2: '[ To be filled ]', pain3: '[ To be filled ]', costRisk: '[ To be filled ]' }],
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
      detailedUseCases: { industryUseCases: [{ rank: '1', industry: 'Manufacturing', features: '[ To be filled ]', useCase: '[ To be filled ]', urgency: 'HIGH', primaryBuyer: 'Safety Head', primaryUser: 'Field Supervisor', profile: '[ To be filled ]', currentTool: 'Paper permit books' }] },
    },
    pricing: [
      { plan: 'Starter', price: '[ To be filled ]', description: 'Single facility, up to 50 permits/month', features: ['Digital permits', 'Basic approval workflow', 'PDF export'], highlighted: false, cta: 'Get Started' },
      { plan: 'Pro', price: '[ To be filled ]', description: 'Multi-site industrial operations', features: ['Everything in Starter', 'QR field execution', 'CAPA linkage', 'Compliance reports', 'Analytics dashboard'], highlighted: true, cta: 'Start Trial' },
      { plan: 'Enterprise', price: 'Custom', description: 'Large industrial groups', features: ['Everything in Pro', 'ERP integration', 'Custom permit types', 'Dedicated support'], highlighted: false, cta: 'Contact Sales' },
    ],
    swot: { strengths: ['[ To be filled ]'], weaknesses: ['[ To be filled ]'], opportunities: ['[ To be filled ]'], threats: ['[ To be filled ]'] },
    roadmap: [{ quarter: 'Q1 2025', phase: 'Foundation', items: ['[ To be filled ]'], status: 'completed' }, { quarter: 'Q3 2025', phase: 'Expansion', items: ['[ To be filled ]'], status: 'planned' }],
    businessPlan: { vision: '[ To be filled ]', mission: '[ To be filled ]', targetRevenue: '[ To be filled ]', keyMilestones: [{ milestone: '[ To be filled ]', targetDate: 'Q2 2025', status: 'planned' }] },
    gtmStrategy: [{ phase: 'Phase 1', description: '[ To be filled ]', tactics: ['[ To be filled ]'], timeline: 'Q1 2025' }],
    metrics: [{ name: 'Active Permits/Month', current: '[ To be filled ]', target: '[ To be filled ]', unit: 'permits', trend: 'up' }, { name: 'Permit Approval Time', current: '[ To be filled ]', target: '< 2 hrs', unit: 'hrs', trend: 'down' }],
    postPossessionJourney: [{ stage: 'Permit Request', description: '[ To be filled ]', touchpoints: ['Web/Mobile'], tools: ['PTW App'] }, { stage: 'Approval', description: '[ To be filled ]', touchpoints: ['Approver Alert'], tools: ['Dashboard'] }, { stage: 'Field Execution', description: '[ To be filled ]', touchpoints: ['QR Scan'], tools: ['Mobile App'] }],
  },
};

const PTWPage: React.FC = () => <BaseProductPage productData={ptwData} />;
export default PTWPage;
