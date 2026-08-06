import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { dailyAiToneStyles } from "../constants";
import { useDailyReport } from "../context/DailyReportContext";

export const AiSuggestionsCard = () => {
  const { dailyAiSuggestions } = useDailyReport();

  return (
    <>
      <style>{`
        @keyframes aiSuggestionColorMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes aiSuggestionBorderFlow {
          0%, 100% { border-color: rgba(218, 119, 86, 0.55); }
          33%      { border-color: rgba(129, 106, 229, 0.55); }
          66%      { border-color: rgba(49, 130, 206, 0.55); }
        }
        .daily-ai-suggestions-card {
          background-image: linear-gradient(120deg, #ffffff 0%, #fff4ef 22%, #f2ecff 45%, #ebf4ff 68%, #ffffff 100%);
          background-size: 220% 220%;
          animation: aiSuggestionColorMove 7s ease-in-out infinite, aiSuggestionBorderFlow 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .daily-ai-suggestions-card { animation: none; }
        }
      `}</style>
      <div
        className="daily-ai-suggestions-card overflow-hidden rounded-[16px] border border-[#e9ddf6]"
        style={{
          boxShadow:
            "-10px 12px 24px rgba(218,119,86,0.16), 8px 10px 24px rgba(129,106,229,0.13)",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-[#DA7756] text-white">
              <Sparkles size={12} />
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <span className="whitespace-nowrap text-[12px] font-bold leading-none text-[#1f1f1f]">
                AI Suggestions
              </span>
              <span className="truncate text-[10px] font-medium text-[#57545f]">
                - Focus areas to improve your daily report
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#e8e3ff] px-3 py-1 text-[9px] font-bold leading-none text-[#6b5eca]">
            4 insights
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 px-4 pb-4 sm:grid-cols-2 xl:grid-cols-4">
          {dailyAiSuggestions.map((suggestion) => {
            const tone = dailyAiToneStyles[suggestion.tone];
            const SuggestionIcon = suggestion.Icon;

            return (
              <div
                key={suggestion.title}
                className="min-h-[90px] rounded-[10px] border border-[#eceef4] bg-white px-3 py-3.5"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        tone.iconBg,
                        tone.icon
                      )}
                    >
                      <SuggestionIcon size={10} />
                    </span>
                    <span className="truncate text-[10px] font-bold leading-none text-[#2f2c34]">
                      {suggestion.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={suggestion.action}
                    className={cn(
                      "shrink-0 text-[9px] font-medium leading-none hover:underline",
                      tone.action
                    )}
                  >
                    {suggestion.actionLabel} &gt;
                  </button>
                </div>
                <p className="line-clamp-2 text-[10px] font-medium leading-[1.35] text-[#706d78]">
                  {suggestion.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
