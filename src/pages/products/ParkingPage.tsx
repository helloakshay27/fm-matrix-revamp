import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import { Car, BarChart2, Bell, ShieldCheck, Monitor, Presentation } from 'lucide-react';

const parkingData: ProductData = {
  name: 'Parking Management',
  description: 'A parking operations platform for booking, allocation, entry tracking, and utilisation. Optimises parking allocation, booking, and utilisation across workplaces.',
  brief: 'Replace manual parking registers and uncontrolled entry with a smart digital parking system — real-time slot visibility, mobile booking, and revenue reconciliation in one platform.',
  excelLikeSummary: true, excelLikeFeatures: true, excelLikeMarket: true, excelLikePricing: false,
  excelLikeSwot: true, excelLikeRoadmap: true, excelLikeBusinessPlan: true, excelLikeGtm: true,
  excelLikeMetrics: true, excelLikePostPossession: true,
  userStories: [
    { title: 'Slot Booking & Allocation', items: ['Mobile-first parking slot booking', 'Daily / monthly / visitor allocation', 'Reserved vs open bay management', 'Advance booking up to 7 days'] },
    { title: 'Entry & Exit Control', items: ['QR/RFID-based vehicle entry', 'Real-time occupancy dashboard', 'Visitor vehicle pass generation', 'Integration with boom barriers'] },
    { title: 'Revenue & Billing', items: ['Hourly / daily billing engine', 'Online payment integration', 'Monthly pass issuance & renewal', 'Revenue reconciliation reports'] },
    { title: 'Analytics & Reporting', items: ['Daily occupancy trends', 'Peak hour analysis', 'Slot utilisation heatmaps', 'Revenue per bay reports'] },
  ],
  industries: 'Commercial Real Estate, Offices, Retail, Malls, Hospitals, IT Park, Co-working, Residential, Mixed-use Real Estate, Hospitality, SEZ, Industrial & Logistic Parks, Data Centers',
  usps: ['USP 1: Real-time slot visibility eliminates congestion at peak hours.', 'USP 2: Mobile booking reduces front-desk parking queries by 80%.', 'USP 3: Integrated revenue reconciliation eliminates manual billing errors.', 'USP 4: Works with existing boom barriers and RFID hardware.'],
  includes: ['Mobile App (iOS + Android)', 'Admin Web Console', 'Gate Controller Module', 'Revenue Dashboard'],
  upSelling: ['ANPR Camera Integration', 'EV Charging Management', 'Multi-Building Portfolio'],
  integrations: ['Boom Barriers', 'RFID Readers', 'ANPR Cameras', 'Payment Gateways'],
  decisionMakers: ['Facility Manager', 'Building Manager', 'Operations Head', 'CFO'],
  keyPoints: ['Eliminate parking congestion and unauthorised entry', 'Automated billing replaces manual collection', 'Live occupancy data for informed planning'],
  roi: ['Increased parking revenue through better utilisation.', 'Reduced security staff at gates.', 'Improved occupant satisfaction through self-service booking.'],
  assets: [{ type: 'Link', title: 'Product Deck', url: '#', icon: <Presentation className="w-5 h-5" /> }],
  credentials: [{ title: 'Demo', url: 'https://parking.gophygital.work', id: 'demo@parking', pass: 'Park#2024', icon: <Monitor className="w-5 h-5" /> }],
  owner: 'Ubaid / Abdul', ownerImage: '',
  extendedContent: {
    featureSummary: (
      <div className="-m-4 overflow-x-auto"><table className="w-full border-collapse text-xs bg-white"><tbody>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><Car className="w-4 h-4 text-blue-500" /> Slot Booking</div></td><td className="p-3 text-gray-700 font-medium">Mobile booking · Reserved / open bays · Advance booking · Visitor passes</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><ShieldCheck className="w-4 h-4 text-green-500" /> Entry Control</div></td><td className="p-3 text-gray-700 font-medium">QR/RFID entry · Real-time occupancy · Boom barrier integration · Visitor vehicle tracking</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><BarChart2 className="w-4 h-4 text-purple-500" /> Revenue & Billing</div></td><td className="p-3 text-gray-700 font-medium">Hourly/daily billing · Online payment · Monthly pass · Revenue reconciliation</td></tr>
        <tr className="border-b border-gray-200"><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-gray-800"><Bell className="w-4 h-4 text-orange-400" /> Notifications</div></td><td className="p-3 text-gray-700 font-medium">Booking confirmations · Slot availability alerts · Pass expiry reminders · Entry/exit logs</td></tr>
        <tr><td className="w-1/4 p-3 border-r border-[#D3D1C7]"><div className="flex items-center gap-2 font-bold text-blue-700"><BarChart2 className="w-4 h-4 text-orange-400" /> Analytics (USP)</div></td><td className="p-3 text-blue-700 font-bold">Peak hour heatmaps, utilisation trends, and revenue per bay reports enable data-driven parking decisions.</td></tr>
      </tbody></table></div>
    ),
    productSummaryNew: {
      identity: [
        { field: 'Product Name', detail: 'Parking Management by GoPhygital' },
        { field: 'One-line Description', detail: 'A smart digital parking platform for booking, entry control, billing, and utilisation analytics across commercial and residential facilities.' },
        { field: 'Category', detail: 'Smart Parking Management / Facility Operations' },
        { field: 'Current Modules (Live)', detail: '[ To be filled ]' },
        { field: 'Product Owner', detail: 'Ubaid / Abdul' },
      ],
      problemSolves: [{ painPoint: 'Core Pain Point', solution: 'Parking facilities use manual registers, uncontrolled entry, phone-based slot requests, and unreconciled revenue — causing congestion, overbooking, lost revenue, and no utilisation data.' }],
      whoItIsFor: [
        { role: 'Facility Manager', useCase: 'Manages slot allocation, monitors occupancy, reviews revenue.', frustration: 'No real-time visibility into which slots are occupied or available at any given time.', gain: 'Live occupancy dashboard and automated slot allocation.' },
        { role: 'Employee / Tenant', useCase: 'Books parking slot in advance via mobile app.', frustration: 'Arriving to find no parking available, no prior visibility.', gain: 'Advance booking with availability shown in real time.' },
      ],
      today: [{ dimension: 'Single Most Defensible Position', state: '[ To be filled ]' }, { dimension: 'Target Markets', state: 'Commercial Real Estate, Offices, Hospitals, Malls, and Mixed-use Developments in India and GCC.' }],
    },
    detailedFeatures: [
      { module: 'Booking', feature: 'Mobile Slot Booking', subFeatures: '', works: '[ To be filled ]', userType: 'Occupant', usp: false },
      { module: 'Entry', feature: 'QR/RFID Vehicle Entry', subFeatures: '', works: '[ To be filled ]', userType: 'Security / Gate', usp: false },
      { module: 'Billing', feature: 'Automated Revenue Collection', subFeatures: '', works: '[ To be filled ]', userType: 'Finance', usp: true },
      { module: 'Analytics', feature: 'Utilisation Heatmaps', subFeatures: '', works: '[ To be filled ]', userType: 'Admin', usp: true },
      { module: 'Notifications', feature: 'Pass Expiry Alerts', subFeatures: '', works: '[ To be filled ]', userType: 'All', usp: false },
    ],
    detailedMarketAnalysis: {
      targetAudience: [{ segment: 'Commercial Real Estate', demographics: '[ To be filled ]', industry: 'Commercial Real Estate', painPoints: '[ To be filled ]', notSolved: '[ To be filled ]', goodEnough: 'Manual registers + phone calls', urgency: 'HIGH', primaryBuyer: 'Facility Manager' }],
      companyPainPoints: [{ companyType: 'CRE Operator / Mall', pain1: '[ To be filled ]', pain2: '[ To be filled ]', pain3: '[ To be filled ]', costRisk: '[ To be filled ]' }],
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
      detailedUseCases: { industryUseCases: [{ rank: '1', industry: 'Commercial Real Estate', features: '[ To be filled ]', useCase: '[ To be filled ]', urgency: 'HIGH', primaryBuyer: 'Facility Manager', primaryUser: 'Employee / Visitor', profile: '[ To be filled ]', currentTool: 'Manual register + phone' }] },
    },
    pricing: [
      { plan: 'Basic', price: '[ To be filled ]', description: 'Single building up to 200 bays', features: ['Slot booking', 'Entry tracking', 'Basic reports'], highlighted: false, cta: 'Get Started' },
      { plan: 'Pro', price: '[ To be filled ]', description: 'Large facility 200–1000 bays', features: ['Everything in Basic', 'Billing engine', 'RFID integration', 'Analytics'], highlighted: true, cta: 'Start Trial' },
      { plan: 'Enterprise', price: 'Custom', description: 'Multi-site portfolio', features: ['Everything in Pro', 'ANPR integration', 'Revenue management', 'Custom reporting'], highlighted: false, cta: 'Contact Sales' },
    ],
    swot: { strengths: ['[ To be filled ]'], weaknesses: ['[ To be filled ]'], opportunities: ['[ To be filled ]'], threats: ['[ To be filled ]'] },
    roadmap: [{ quarter: 'Q1 2025', phase: 'Core', items: ['[ To be filled ]'], status: 'completed' }, { quarter: 'Q3 2025', phase: 'Expansion', items: ['[ To be filled ]'], status: 'planned' }],
    businessPlan: { vision: '[ To be filled ]', mission: '[ To be filled ]', targetRevenue: '[ To be filled ]', keyMilestones: [{ milestone: '[ To be filled ]', targetDate: 'Q2 2025', status: 'planned' }] },
    gtmStrategy: [{ phase: 'Phase 1', description: '[ To be filled ]', tactics: ['[ To be filled ]'], timeline: 'Q1 2025' }],
    metrics: [{ name: 'Daily Bookings', current: '[ To be filled ]', target: '[ To be filled ]', unit: 'bookings', trend: 'up' }, { name: 'Slot Utilisation Rate', current: '[ To be filled ]', target: '> 85%', unit: '%', trend: 'up' }],
    postPossessionJourney: [{ stage: 'Booking', description: '[ To be filled ]', touchpoints: ['Mobile App'], tools: ['Parking App'] }, { stage: 'Entry', description: '[ To be filled ]', touchpoints: ['QR/RFID'], tools: ['Gate Controller'] }, { stage: 'Payment', description: '[ To be filled ]', touchpoints: ['Online Payment'], tools: ['Billing Engine'] }],
  },
};

const ParkingPage: React.FC = () => <BaseProductPage productData={parkingData} />;
export default ParkingPage;
