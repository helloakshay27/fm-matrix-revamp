// No backend API exists for Package Setup yet - this in-memory store stands in for one so
// the list/add/edit/details pages can be reviewed end-to-end. Swap these functions for
// real apiClient calls once a package-setup endpoint exists; the page components only
// depend on this module's exported functions, not on how the data is stored.

export interface PricingTier {
  id: string;
  label: string;
  credits: number;
  price: number;
  gstPercent: number;
}

export interface PackageSetup {
  id: string;
  name: string;
  classActivity: string;
  packageType: "Member" | "Non-Member";
  sessions: number;
  price: number;
  validity: string;
  status: "Active" | "Inactive";
  tiers: PricingTier[];
}

const defaultTiers = (): PricingTier[] => [
  { id: "tier-1", label: "Single session", credits: 1, price: 1000, gstPercent: 18 },
  { id: "tier-2", label: "4-class bundle", credits: 4, price: 3600, gstPercent: 18 },
  { id: "tier-3", label: "8-class bundle", credits: 8, price: 6800, gstPercent: 18 },
  { id: "tier-4", label: "12-class bundle", credits: 12, price: 9600, gstPercent: 18 },
  { id: "tier-5", label: "16-class bundle", credits: 16, price: 12200, gstPercent: 18 },
];

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
    tiers: defaultTiers(),
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
    tiers: defaultTiers(),
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
    tiers: defaultTiers(),
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
    tiers: defaultTiers(),
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
    tiers: defaultTiers(),
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
    tiers: defaultTiers(),
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
    tiers: defaultTiers(),
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
  return { id: `tier-${Date.now()}`, label: "", credits: 0, price: 0, gstPercent: 18 };
}

// Fresh copy of the standard bundle tiers with unique ids, for pre-filling the Add form.
export function defaultTiersForNew(): PricingTier[] {
  return defaultTiers().map((t, i) => ({ ...t, id: `tier-new-${Date.now()}-${i}` }));
}

export function gstAmount(tier: PricingTier): number {
  return Math.round((tier.price * tier.gstPercent) / 100);
}

export function tierTotal(tier: PricingTier): number {
  return tier.price + gstAmount(tier);
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
