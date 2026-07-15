import React, { useState } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantPopupProps {
  defaultTab?: "accomplishments" | "plan";
}

const AIAssistantPopup: React.FC<AIAssistantPopupProps> = ({
  defaultTab = "accomplishments",
}) => {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatTab, setAiChatTab] = useState<"accomplishments" | "plan">(
    defaultTab
  );
  const [aiMessage, setAiMessage] = useState("");

  return (
    <>
      {/* ══ AI CHAT – Glass Morphism Panel ══════════════════════════════════ */}
      {aiChatOpen && (
        <div
          className="fixed z-50 ai-chat-enter"
          style={{
            bottom: "68px",
            right: "16px",
            width: "min(420px, calc(100vw - 32px))",
          }}
        >
          <div
            style={{
              padding: "1.5px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(218,119,86,0.70) 0%, rgba(251,200,170,0.40) 40%, rgba(190,185,235,0.60) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                borderRadius: "18.5px",
                background: "#ffffff",
                overflow: "hidden",
              }}
            >
              <div
                className="flex items-center justify-between px-5 pt-4 pb-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.45)" }}
              >
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                  {(["accomplishments", "plan"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAiChatTab(tab)}
                      className={cn(
                        "px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap",
                        aiChatTab === tab
                          ? "bg-[#DA7756] text-white shadow-sm"
                          : "text-gray-600 bg-white/40 hover:bg-white/60"
                      )}
                    >
                      {tab === "accomplishments"
                        ? "Fill my accomplishments"
                        : "Plan for next day"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setAiChatOpen(false)}
                  className="ml-2 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="h-36 sm:h-40 px-4 sm:px-5 py-4 flex items-center justify-center">
                <p className="text-[12px] sm:text-[13px] text-gray-400 italic text-center">
                  {aiChatTab === "accomplishments"
                    ? "AI will help you fill your accomplishments..."
                    : "AI will help you plan for tomorrow..."}
                </p>
              </div>
              <div className="px-4 sm:px-5 pb-5 pt-1">
                <div
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(255,255,255,0.80)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <Sparkles size={13} className="text-[#DA7756] flex-shrink-0" />
                  <input
                    type="text"
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setAiMessage("");
                    }}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent text-[12px] sm:text-[13px] text-gray-700 placeholder-gray-400 outline-none min-w-0"
                  />
                  {aiMessage && (
                    <button
                      onClick={() => setAiMessage("")}
                      className="text-[#DA7756] hover:text-[#c9673f] flex-shrink-0 transition-colors"
                    >
                      <Send size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI trigger – glassmorphism button */}
      {!aiChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-18px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 42% 38%, rgba(218,119,86,0.38) 0%, rgba(249,170,130,0.16) 50%, transparent 72%)",
              filter: "blur(10px)",
            }}
          />
          <div className="ai-btn-glow-outer">
            <div className="ai-btn-glow-spinner" />
            <button
              onClick={() => setAiChatOpen(true)}
              title="AI Assistant"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                position: "relative",
                zIndex: 1,
                width: "52px",
                height: "52px",
                borderRadius: "17.5px",
                background:
                  "linear-gradient(148deg, rgba(255,255,255,0.97) 10%, rgba(253,218,196,0.84) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                outline: "none",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,1), 0 4px 14px rgba(218,119,86,0.15)",
                transition: "transform 0.2s ease",
              }}
            >
              <Sparkles size={24} color="#DA7756" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantPopup;
