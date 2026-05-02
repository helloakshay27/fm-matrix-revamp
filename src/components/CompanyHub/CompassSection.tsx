import React from "react";
import {
  Activity,
  TrendingUp,
  AlertCircle,
  Award,
  BookOpen,
  Heart,
  Flame,
  Trophy,
} from "lucide-react";
import GlassCard from "./GlassCard";
import { LifeCompassStats } from "./types";

interface CompassSectionProps {
  lifeCompassStats: LifeCompassStats;
}

const CompassSection: React.FC<CompassSectionProps> = ({
  lifeCompassStats,
}) => {
  return (
    <div className="pt-6">
      <GlassCard className="!bg-white shadow-sm !border-gray-100/50 !rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* BUSINESS COMPASS (Left Side) */}
          <div className="flex-1 p-8 lg:border-r border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                Bussiness workspace
              </h3>
              <button className="text-[11px] text-[#E67E5F] font-bold uppercase tracking-widest">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Business Health Score",
                  val: "33 / 100",
                  icon: <Activity className="w-4 h-4" />,
                },
                {
                  label: "KPI Progress",
                  val: "2 / 6 KPIs Achieved",
                  icon: <TrendingUp className="w-4 h-4" />,
                },
                {
                  label: "Top Stuck Issue",
                  val: "Lead Conversion KPI - 4 days",
                  icon: <AlertCircle className="w-4 h-4" />,
                },
                {
                  label: "Best Department Performance",
                  val: "Design – 82%",
                  icon: <Award className="w-4 h-4" />,
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-[#FAF9F6] border border-[#D9D1BD]/20 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-tight">
                    <span className="opacity-60">{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </div>
                  <p className="text-[15px] font-bold text-gray-700 leading-tight">
                    {c.val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* LIFE COMPASS (Right Side) */}
          <div className="flex-1 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                Personal workspace
              </h3>
              <button className="text-[11px] text-[#E67E5F] font-bold uppercase tracking-widest hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Journaling Consistency",
                  val: `${lifeCompassStats.journaling_consistency}%`,
                  icon: <BookOpen className="w-4 h-4" />,
                },
                {
                  label: "Life Balance Score",
                  val: `${lifeCompassStats.life_balance_score}%`,
                  icon: <Heart className="w-4 h-4" />,
                },
                {
                  label: "Current Streak",
                  val: `${lifeCompassStats.current_streak} Days`,
                  icon: <Flame className="w-4 h-4" />,
                },
                {
                  label: "Leaderboard Rank",
                  val: `#${lifeCompassStats.leaderboard_rank}`,
                  icon: <Trophy className="w-4 h-4" />,
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100/50 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-tight">
                    <span className="opacity-60">{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </div>
                  <p className="text-[15px] font-bold text-gray-700 leading-tight">
                    {c.val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default CompassSection;
