import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Settings } from "lucide-react";

export interface AnalyticsOption {
  id: string;
  label: string;
  description?: string;
}

interface AssetAnalyticsSelectorProps {
  onSelectionChange: (selectedOptions: string[]) => void;
  dateRange?: { startDate: Date; endDate: Date };
  selectedOptions?: string[];
  options?: AnalyticsOption[];
  title?: string;
  buttonLabel?: string;
}

// Default fallback options
const defaultAnalyticsOptions: AnalyticsOption[] = [
  {
    id: "assetStatistics",
    label: "Asset Statistics",
    description: "Key asset metrics and statistics overview",
  },
  {
    id: "groupWise",
    label: "Group-wise Assets",
    description: "Assets distribution by groups",
  },
  {
    id: "categoryWise",
    label: "Category-wise Assets",
    description: "Assets distribution by categories",
  },
  {
    id: "statusDistribution",
    label: "Status Distribution",
    description: "Assets by status (In Use, Breakdown, etc.)",
  },
  {
    id: "assetDistributions",
    label: "IT vs Non-IT Assets",
    description: "Distribution between IT and Non-IT assets",
  },
];

export const AssetAnalyticsSelector: React.FC<AssetAnalyticsSelectorProps> = ({
  onSelectionChange,
  dateRange,
  selectedOptions: propSelectedOptions = [],
  options,
  title = "Select Analytics Reports",
  buttonLabel = "Analytics",
}) => {
  const displayOptions = options || defaultAnalyticsOptions;

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    propSelectedOptions.length > 0
      ? propSelectedOptions
      : displayOptions.map((opt) => opt.id)
  );
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propSelectedOptions.length > 0) {
      setSelectedOptions(propSelectedOptions);
    }
  }, [propSelectedOptions]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelectionChange = (optionId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedOptions, optionId]
      : selectedOptions.filter((id) => id !== optionId);
    setSelectedOptions(newSelection);
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = displayOptions.map((o) => o.id);
    setSelectedOptions(allIds);
    onSelectionChange(allIds);
  };

  const handleSelectNone = () => {
    setSelectedOptions([]);
    onSelectionChange([]);
  };

  const formatToDDMMYYYY = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${date.getFullYear()}`;
  };

  const buttonLabel_ =
    selectedOptions.length === 0
      ? `Select ${buttonLabel}`
      : selectedOptions.length === displayOptions.length
        ? `All ${buttonLabel} Selected`
        : `${selectedOptions.length} ${buttonLabel} Selected`;

  return (
    // ── KEY FIX: position:relative wrapper so dropdown stays IN the page flow
    // and is NOT teleported to body (no Radix portal).
    // z-index here is intentionally low so header/navbar always wins.
    <div ref={wrapperRef} className="relative w-full sm:w-auto">
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 min-w-[250px] justify-between text-gray-700 border-gray-300"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>{buttonLabel_}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {/* Dropdown Panel — rendered INSIDE the wrapper, NOT in body portal */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg"
          // z-index intentionally below header/navbar (which should be z-50).
          // Change this value only if your header has a different z-index.
          style={{ zIndex: 10 }}
        >
          <div className="p-4 space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{title}</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-7 px-2"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectNone}
                  className="text-xs h-7 px-2"
                >
                  None
                </Button>
              </div>
            </div>

            {/* Options list */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {displayOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleSelectionChange(option.id, checked as boolean)
                    }
                    className="mt-0.5 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option.label}
                    </label>
                    {option.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Date range footer */}
            {dateRange && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground font-medium">
                  Date Range:{" "}
                  <span className="font-normal">
                    {formatToDDMMYYYY(dateRange.startDate)} -{" "}
                    {formatToDDMMYYYY(dateRange.endDate)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
