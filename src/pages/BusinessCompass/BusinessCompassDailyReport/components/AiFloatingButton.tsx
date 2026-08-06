import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AiSparkleIcon } from "../utils";
import { useDailyReport } from "../context/DailyReportContext";

export const AiFloatingButton = () => {
  const {
    activeTab,
    isAiPopupOpen,
    setIsAiPopupOpen,
    aiPopupTab,
    setAiPopupTab,
    aiPromptText,
    setAiPromptText,
    accomplishmentsSectionRef,
    addAccomplishment,
    planningSectionRef,
  } = useDailyReport();

  if (activeTab !== "submit") return null;

  return createPortal(
    <>
      {isAiPopupOpen && (
        <div className="bc-ai-glass-modal">
          <div className="bc-ai-glass-tabs">
            <button
              type="button"
              className={cn(
                "bc-ai-glass-tab",
                aiPopupTab === "accomplishments" && "bc-ai-glass-tab-active"
              )}
              onClick={() => setAiPopupTab("accomplishments")}
            >
              Fill my accomplishments
            </button>
            <button
              type="button"
              className={cn(
                "bc-ai-glass-tab",
                aiPopupTab === "plan" && "bc-ai-glass-tab-active"
              )}
              onClick={() => setAiPopupTab("plan")}
            >
              Plan for next day
            </button>
          </div>
          <div className="bc-ai-glass-input-wrap">
            <textarea
              value={aiPromptText}
              onChange={(e) => setAiPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setIsAiPopupOpen(false);
                  setAiPromptText("");
                  if (aiPopupTab === "accomplishments") {
                    accomplishmentsSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                    addAccomplishment();
                  } else {
                    planningSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }
              }}
              placeholder="Ask anything..."
              className="bc-ai-glass-input"
              autoFocus
            />
          </div>
        </div>
      )}
      <button
        type="button"
        className="bc-ai-fab"
        title="AI Suggestions"
        aria-label="AI Suggestions"
        onClick={() => setIsAiPopupOpen((open) => !open)}
      >
        <AiSparkleIcon className="bc-ai-fab-icon" />
      </button>
    </>,
    document.body
  );
};
