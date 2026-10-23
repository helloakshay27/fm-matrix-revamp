import type { ParkingSlotData } from '../../services/parkingConfigurationsAPI';

export type SlotType = 'nonStack' | 'stack' | 'reserved';

// Every slot is stored with its real name. Counts are derived from the list lengths, so
// removing "P81" removes exactly that slot instead of shrinking the count (which would drop
// the last slot and renumber the rest).
// `stack` holds one entry per physical slot (A and B of a pair are separate entries).
export interface CategorySlots {
  nonStack: string[];
  stack: string[];
  reserved: string[];
}

export const emptyCategorySlots = (): CategorySlots => ({ nonStack: [], stack: [], reserved: [] });

export const totalSlotCount = (slots: CategorySlots) =>
  slots.nonStack.length + slots.stack.length + slots.reserved.length;

const SLOT_PREFIX = 'P';

// Highest number used by a "P<number>[A|B]" name across the whole category.
const highestSlotNumber = (slots: CategorySlots) =>
  [...slots.nonStack, ...slots.stack, ...slots.reserved].reduce((max, name) => {
    const match = /^P(\d+)[AB]?$/i.exec(name.trim());
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);

// Grows or shrinks one slot list to `targetLength`. New slots continue the numbering after the
// highest existing number, so a name is never reused; shrinking drops slots from the end.
export const resizeSlots = (slots: CategorySlots, type: SlotType, targetLength: number): CategorySlots => {
  const target = Math.max(0, Math.floor(targetLength));
  const next = [...slots[type]];

  if (target <= next.length) {
    return { ...slots, [type]: next.slice(0, target) };
  }

  const used = new Set([...slots.nonStack, ...slots.stack, ...slots.reserved].map((name) => name.trim().toLowerCase()));
  let number = highestSlotNumber(slots);

  while (next.length < target) {
    number += 1;
    if (type === 'stack') {
      const pair = [`${SLOT_PREFIX}${number}A`, `${SLOT_PREFIX}${number}B`];
      if (pair.some((name) => used.has(name.toLowerCase()))) continue;
      pair.forEach((name) => {
        next.push(name);
        used.add(name.toLowerCase());
      });
    } else {
      const name = `${SLOT_PREFIX}${number}`;
      if (used.has(name.toLowerCase())) continue;
      next.push(name);
      used.add(name.toLowerCase());
    }
  }

  return { ...slots, [type]: next.slice(0, target) };
};

export const removeSlotAt = (slots: CategorySlots, type: SlotType, index: number): CategorySlots => ({
  ...slots,
  [type]: slots[type].filter((_, i) => i !== index),
});

export const renameSlotAt = (slots: CategorySlots, type: SlotType, index: number, name: string): CategorySlots => ({
  ...slots,
  [type]: slots[type].map((current, i) => (i === index ? name : current)),
});

// Returns a user-facing message when the category's slot names would be rejected or miscounted
// by the API (blank names, or the same name used twice), otherwise null.
export const validateCategorySlots = (categoryName: string, slots: CategorySlots): string | null => {
  const seen = new Set<string>();
  for (const name of [...slots.nonStack, ...slots.stack, ...slots.reserved]) {
    const key = name.trim().toLowerCase();
    if (!key) return `${categoryName}: slot names cannot be empty`;
    if (seen.has(key)) return `${categoryName}: slot name "${name.trim()}" is used more than once`;
    seen.add(key);
  }
  return null;
};

export const buildParkingSlotsData = (slots: CategorySlots): ParkingSlotData[] => [
  ...slots.nonStack.map((name) => ({ parking_name: name.trim(), reserved: false })),
  ...slots.stack.map((name) => ({ parking_name: name.trim(), reserved: false, stacked: true })),
  ...slots.reserved.map((name) => ({ parking_name: name.trim(), reserved: true })),
];
