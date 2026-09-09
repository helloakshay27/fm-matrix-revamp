/**
 * RULE ENGINE — SHARED UI BITS
 * ----------------------------
 * Chhote presentational helpers jo module ke ek se zyada tab me chahiye.
 * Tokens ke liye `ruleEngineTheme.ts` dekhein.
 */
import { ChevronDown } from "lucide-react";
import { T } from "./ruleEngineTheme";

/**
 * Har select ka common look.
 *
 * `appearance-none` isliye ki native arrow har OS/browser me alag dikhta hai —
 * uski jagah SelectShell apna brand chevron overlay karta hai. `pr-9` us
 * chevron ke liye jagah chhodta hai.
 */
export const selectClass =
  "w-full cursor-pointer appearance-none rounded-xl border px-3 py-2 pr-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#DA7756]/30 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * `<select>` ko wrap karke uske upar brand chevron dikhata hai.
 *
 * Chevron `pointer-events-none` hai, isliye uspar click bhi select tak hi
 * jaata hai — dropdown ka behaviour bilkul native rehta hai.
 *
 * Width yahan se control karein (`className="w-full sm:max-w-sm"`), select
 * hamesha apne shell ki poori width leta hai.
 */
export const SelectShell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {children}
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
      style={{ color: T.textMuted }}
    />
  </div>
);
