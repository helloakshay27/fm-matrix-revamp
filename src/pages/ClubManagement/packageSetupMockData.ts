// No backend API exists for Package Setup yet - this in-memory store stands in for one so
// the list/add/edit/details pages can be reviewed end-to-end. Swap these functions for
// real apiClient calls once a package-setup endpoint exists; the page components only
// depend on this module's exported functions, not on how the data is stored.

export interface PricingTier {
  id: string;
  label: string;
  packageType: string;
  credits: number;
  // Days the credits stay valid for, counted from the purchase date.
  validityDays: number;
  price: number;
  gstPercent: number;
  priceMember: number;
  priceHotelGuest: number;
  priceNonMember: number;
  cgstRate: number;
  sgstRate: number;
  hsnCode: string;
}

export interface PackageSetup {
  id: string;
  name: string;
  classActivity: string;
  // Which tier group currently drives the list/details summary fields below
  // (sessions/price) - a package can carry both member and non-member pricing at once.
  packageType: "Member" | "Non-Member";
  sessions: number;
  price: number;
  validity: string;
  status: "Active" | "Inactive";
  memberTiers: PricingTier[];
  nonMemberTiers: PricingTier[];
}

const defaultMemberTiers = (): PricingTier[] => [
  createTier("tier-m1", "Single session", "single_session", 1, 45, 1000, 1250, 1500),
  createTier("tier-m2", "4-class bundle", "4_class_bundle", 4, 90, 3600, 4500, 5400),
  createTier("tier-m3", "8-class bundle", "8_class_bundle", 8, 120, 6800, 8500, 10200),
  createTier("tier-m4", "12-class bundle", "12_class_bundle", 12, 240, 9600, 12000, 14400),
  createTier("tier-m5", "16-class bundle", "16_class_bundle", 16, 365, 12200, 15250, 18300),
];

const defaultNonMemberTiers = (): PricingTier[] => [
  createTier("tier-n1", "Single session", "single_session", 1, 45, 1000, 1250, 2000),
  createTier("tier-n2", "4-class bundle", "4_class_bundle", 4, 90, 3600, 4500, 4000),
  createTier("tier-n3", "8-class bundle", "8_class_bundle", 8, 100, 6800, 8500, 7500),
  createTier("tier-n4", "12-class bundle", "12_class_bundle", 12, 120, 9600, 12000, 10000),
  createTier("tier-n5", "16-class bundle", "16_class_bundle", 16, 150, 12200, 15250, 12500),
];

function createTier(
  id: string,
  label: string,
  packageType: string,
  credits: number,
  validityDays: number,
  priceMember: number,
  priceHotelGuest: number,
  priceNonMember: number
): PricingTier {
  return {
    id,
    label,
    packageType,
    credits,
    validityDays,
    price: priceMember,
    gstPercent: 18,
    priceMember,
    priceHotelGuest,
    priceNonMember,
    cgstRate: 9,
    sgstRate: 9,
    hsnCode: "999723",
  };
}

let packages: PackageSetup[] = [
  {
    id: "1",
    name: "Starter Pilates",
    classActivity: "Reformer Pilates",
    packageType: "Member",
    sessions: 3,
    price: 3999,
    validity: "1 Month",
    status: "Active",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  },
  {
    id: "2",
    name: "Yoga Essentials",
    classActivity: "Yoga",
    packageType: "Non-Member",
    sessions: 5,
    price: 4499,
    validity: "1 Month",
    status: "Active",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  },
  {
    id: "3",
    name: "HIIT Power Pack",
    classActivity: "HIIT",
    packageType: "Member",
    sessions: 10,
    price: 8499,
    validity: "2 Months",
    status: "Active",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  },
  {
    id: "4",
    name: "Cadillac Intro",
    classActivity: "Cadillac",
    packageType: "Non-Member",
    sessions: 3,
    price: 5999,
    validity: "1 Month",
    status: "Inactive",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  },
  {
    id: "5",
    name: "CrossFit Unlimited",
    classActivity: "CrossFit",
    packageType: "Member",
    sessions: 15,
    price: 11999,
    validity: "3 Months",
    status: "Active",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  },
  {
    id: "6",
    name: "Private Pilates Premium",
    classActivity: "Private Pilates",
    packageType: "Member",
    sessions: 8,
    price: 15999,
    validity: "2 Months",
    status: "Active",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  },
];

// Pad out to 18 total rows so the list page's pagination (10 per page, page 1 of 2) matches.
const extra = [
  "Barre Basics",
  "Spin Starter",
  "Aqua Flex",
  "Kids Move Pack",
  "Senior Fit Pack",
  "Recovery Bundle",
  "Dance Cardio Pack",
  "Meditation Series",
  "Power Yoga Pack",
  "Strength Bundle",
  "Mobility Series",
  "Bootcamp Pack",
];
extra.forEach((name, i) => {
  packages.push({
    id: String(7 + i),
    name,
    classActivity: name.replace(/ (Pack|Bundle|Series|Basics|Starter)$/i, ""),
    packageType: i % 2 === 0 ? "Member" : "Non-Member",
    sessions: 4 + (i % 8),
    price: 2999 + i * 500,
    validity: `${1 + (i % 3)} Month${i % 3 === 0 ? "" : "s"}`,
    status: i % 5 === 0 ? "Inactive" : "Active",
    memberTiers: defaultMemberTiers(),
    nonMemberTiers: defaultNonMemberTiers(),
  });
});
packages = packages.slice(0, 18);

export function getPackages(): PackageSetup[] {
  return packages;
}

export function getPackageById(id: string): PackageSetup | undefined {
  return packages.find((p) => p.id === id);
}

export function addPackage(data: Omit<PackageSetup, "id">): PackageSetup {
  const newPackage: PackageSetup = { ...data, id: String(Date.now()) };
  packages = [newPackage, ...packages];
  return newPackage;
}

export function updatePackage(id: string, data: Omit<PackageSetup, "id">): PackageSetup | undefined {
  const idx = packages.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  packages[idx] = { ...packages[idx], ...data, id };
  return packages[idx];
}

export function deletePackage(id: string): void {
  packages = packages.filter((p) => p.id !== id);
}

export function newTier(): PricingTier {
  return {
    id: `tier-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: "8-Class Bundle",
    packageType: "8_class_bundle",
    credits: 8,
    validityDays: 60,
    price: 6400,
    gstPercent: 18,
    priceMember: 6400,
    priceHotelGuest: 8000,
    priceNonMember: 9600,
    cgstRate: 9,
    sgstRate: 9,
    hsnCode: "999723",
  };
}

// Blank starting point for the Add form - no sample values, only field placeholders.
export function blankTier(): PricingTier {
  return {
    id: `tier-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: "",
    packageType: "",
    credits: 0,
    validityDays: 0,
    price: 0,
    gstPercent: 0,
    priceMember: 0,
    priceHotelGuest: 0,
    priceNonMember: 0,
    cgstRate: 0,
    sgstRate: 0,
    hsnCode: "",
  };
}

export function tierBasePrice(tier: PricingTier): number {
  return tier.priceMember ?? tier.price ?? 0;
}

export function gstAmount(tier: PricingTier): number {
  const taxRate = (tier.cgstRate ?? 0) + (tier.sgstRate ?? 0) || tier.gstPercent || 0;
  return Math.round((tierBasePrice(tier) * taxRate) / 100);
}

export function tierTotal(tier: PricingTier): number {
  return tierBasePrice(tier) + gstAmount(tier);
}

// Classes a package can be attached to - mirrors classSetupMockData's names.
export const PACKAGE_CLASSES = [
  "Reformer Pilates",
  "Yoga",
  "HIIT",
  "Cadillac",
  "CrossFit",
  "Private Pilates",
  "Pickleball",
];

export const PACKAGE_TYPES: PackageSetup["packageType"][] = ["Member", "Non-Member"];
export const PACKAGE_VALIDITIES = ["1 Month", "2 Months", "3 Months", "6 Months", "12 Months"];

export const PACKAGE_TIER_TYPES = [
  { value: "single_session", label: "Single Session" },
  { value: "4_class_bundle", label: "4-Class Bundle" },
  { value: "8_class_bundle", label: "8-Class Bundle" },
  { value: "12_class_bundle", label: "12-Class Bundle" },
  { value: "16_class_bundle", label: "16-Class Bundle" },
];
