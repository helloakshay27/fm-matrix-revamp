import React from "react";
import {
  Mountain,
  Building2,
  Warehouse,
  Car,
  Armchair,
  Monitor,
  Settings,
  Wrench,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export const ASSET_CATEGORIES: { name: string; icon: LucideIcon }[] = [
  { name: "Land", icon: Mountain },
  { name: "Building", icon: Building2 },
  { name: "Leasehold Improvement", icon: Warehouse },
  { name: "Vehicle", icon: Car },
  { name: "Furniture & Fixtures", icon: Armchair },
  { name: "IT Equipment", icon: Monitor },
  { name: "Machinery & Equipment", icon: Settings },
  { name: "Tools & Instruments", icon: Wrench },
  { name: "Meter", icon: Gauge },
];

interface AssetCategorySelectorProps {
  value: string;
  onChange?: (category: string) => void;
  disabled?: boolean;
}

export const AssetCategorySelector: React.FC<AssetCategorySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => (
  <div
    role="group"
    aria-label="Asset Category"
    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-[10px]"
  >
    {ASSET_CATEGORIES.map(({ name, icon: Icon }) => {
      const selected = value === name;
      return (
        <button
          key={name}
          type="button"
          aria-pressed={selected}
          disabled={disabled}
          onClick={() => onChange?.(name)}
          className={`flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-xl border text-[11.5px] text-center leading-[1.35] transition-colors ${
            selected
              ? "border-[#1A1A18] bg-[#EDEBE5] text-[#1A1A18] font-semibold"
              : "border-[rgba(26,26,24,0.12)] bg-white text-[rgba(26,26,24,0.68)] font-medium hover:border-[rgba(26,26,24,0.28)] hover:text-[#1A1A18]"
          } ${disabled ? "cursor-default" : "cursor-pointer"}`}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
          <span>{name}</span>
        </button>
      );
    })}
  </div>
);
