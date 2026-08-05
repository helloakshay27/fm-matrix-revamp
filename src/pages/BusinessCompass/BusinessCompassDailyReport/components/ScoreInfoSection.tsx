import {
  HelpCircle,
  ChevronDown,
  TrendingUp,
  CheckCircle2,
  ListTodo,
  CheckSquare,
  Calendar,
  Star,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDailyReport } from "../context/DailyReportContext";

export const ScoreInfoSection = () => {
  const { isAbsent, isScoreInfoExpanded, setIsScoreInfoExpanded } =
    useDailyReport();

  if (isAbsent) return null;

  return (
    <>
      <div
        className="bc-score-info-bar"
        onClick={() => setIsScoreInfoExpanded(!isScoreInfoExpanded)}
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-[#DA7756]" />
          <span className="text-sm font-medium text-gray-600">
            How is the Automated Daily score calculated?{" "}
            <span className="text-[#DA7756] font-semibold">
              Expand to know more
            </span>
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-gray-400 transition-transform",
            isScoreInfoExpanded && "rotate-180"
          )}
        />
      </div>

      {isScoreInfoExpanded && (
        <div className="mt-4">
          <div className="bg-[#DA7756]/5 border border-[#DA7756]/20 rounded-[14px] overflow-hidden shadow-sm">
            <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    icon: (
                      <TrendingUp size={20} className="text-[#DA7756]" />
                    ),
                    bg: "bg-[#DA7756]/10 border-[#DA7756]/20",
                    title: "1. Daily KPI Achievement (Max 20 points)",
                    titleColor: "text-[#1a1a1a]",
                    desc: (
                      <>
                        Calculated as:{" "}
                        <span className="font-bold text-slate-700">
                          Max Points Ã— (Average Achievement % Ã· 100)
                        </span>
                      </>
                    ),
                    items: [
                      "100% achievement: 20 points",
                      "90% achievement: 18 points",
                      "75% achievement: 15 points",
                      "50% achievement: 10 points",
                    ],
                    note: "* If a KPI has target 0 but actual is positive, it's counted as 100% achievement.",
                  },
                  {
                    icon: (
                      <CheckCircle2 size={20} className="text-[#10b981]" />
                    ),
                    bg: "bg-[#ecfdf5] border-green-100",
                    title: "2. Daily Checklist Achievement (Max 10 points)",
                    titleColor: "text-[#065f46]",
                    desc: "Points awarded proportionally based on percentage of daily KRA items completed.",
                  },
                  {
                    icon: <ListTodo size={20} className="text-[#DA7756]" />,
                    bg: "bg-[#DA7756]/10 border-[#DA7756]/20",
                    title: "3. Accomplishments (Max 10 points)",
                    titleColor: "text-[#1a1a1a]",
                    desc: "Points awarded proportionally based on percentage of accomplishments marked as completed.",
                  },
                ].map(({ icon, bg, title, titleColor, desc, items, note }, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border",
                        bg
                      )}
                    >
                      {icon}
                    </div>
                    <div className="space-y-1">
                      <h4
                        className={cn(
                          "text-sm font-bold tracking-tight",
                          titleColor
                        )}
                      >
                        {title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                        {desc}
                      </p>
                      {items && (
                        <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4">
                          {items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {note && (
                        <p className="text-[11px] text-[#DA7756] font-bold italic opacity-70">
                          {note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <div className="bg-[#fff7ed] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-orange-100">
                    <CheckSquare size={20} className="text-[#ea580c]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#9a3412] tracking-tight">
                      4. Tasks & Issues (Max 20 points)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4 leading-relaxed">
                      <li>
                        Task/issue closed on report day (within target date):{" "}
                        <span className="text-green-600 font-bold">
                          +5 points each
                        </span>
                      </li>
                      <li>
                        Task/issue closed on report day (after target date):{" "}
                        <span className="text-blue-600 font-bold">
                          +2 points each
                        </span>
                      </li>
                      <li>
                        New issue reported on report day:{" "}
                        <span className="text-blue-600 font-bold">
                          +2 points each (max 10 points)
                        </span>
                      </li>
                      <li>
                        Overdue tasks/issues:{" "}
                        <span className="text-red-600 font-bold">
                          -5 points each (max -15 deduction)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#ecfeff] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-cyan-100">
                    <Calendar size={20} className="text-cyan-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#164e63] tracking-tight">
                      5. Items Planned for Coming Day (Max 20 points)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4 leading-relaxed">
                      <li>
                        Regular items:{" "}
                        <span className="text-slate-900 font-bold">
                          +2 points each
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center gap-1">
                          <Star
                            size={12}
                            className="text-[#eab308] fill-[#eab308]"
                          />{" "}
                          Starred items:
                        </span>{" "}
                        <span className="text-slate-900 font-bold">
                          +1 extra point each (max 3 stars)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#fffbeb] h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 border border-yellow-100">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-900 tracking-tight">
                      6. Report Timing (Max 20 points)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium list-disc pl-4">
                      {[
                        "Submitted by 7pm same day: 20 points",
                        "Submitted by 11:59pm same day: 15 points",
                        "Submitted 12am-7am next day: 10 points",
                        "Submitted 7am-9am next day: 5 points",
                        "Submitted after 9am next day: 0 points",
                      ].map((t, i) => (
                        <li key={i}>
                          <span className="text-slate-900 font-bold">
                            {t}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#DA7756]/5 border border-[#DA7756]/20 rounded-[14px] p-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white p-1 rounded-md shadow-sm">
                    <BarChart3 size={16} className="text-[#DA7756]" />
                  </div>
                  <span className="text-sm font-black text-[#1a1a1a] uppercase tracking-widest">
                    Dynamic Point Allocation
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-[#1a1a1a]/70 font-medium leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#DA7756]">•</span>
                    <span>
                      <span className="font-black text-[#1a1a1a]">
                        No Checklist Items:
                      </span>{" "}
                      Accomplishments get +10 bonus points (max 20)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#DA7756]">•</span>
                    <span>
                      <span className="font-black text-[#1a1a1a]">
                        No Daily KPIs:
                      </span>{" "}
                      Accomplishments, Tasks, Planning, and Timing each get +5
                      bonus points
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
