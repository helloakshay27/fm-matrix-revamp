import { LineChart } from "lucide-react";
import { TeamPerformance } from "./TeamPerformance";

const T = {
  primary: "#DA7756",
  primaryBg: "#fdf9f7",
  primaryBord: "#e8e3de",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  font: "'Poppins', sans-serif",
};

const TeamDashboard = () => {
  return (
    <div
      className="min-h-[calc(100vh-5rem)] w-full px-3 py-4 sm:px-6 sm:py-6"
      style={{ background: T.pageBg, fontFamily: T.font }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); .team-dashboard-wrap, .team-dashboard-wrap * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <div className="team-dashboard-wrap mx-auto max-w-7xl space-y-4">
        <div
          className="flex flex-col gap-3 rounded-[20px] border p-4 shadow-sm sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between"
          style={{
            background: T.cardBg,
            borderColor: T.primaryBord,
            boxShadow: "0 10px 24px rgba(26,26,26,0.05)",
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:h-12 sm:w-12"
              style={{ borderColor: T.primaryBord, background: T.primaryBg }}
            >
              <LineChart className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: T.primary }} />
            </div>
            <div>
              <h1
                className="text-xl font-semibold tracking-tight sm:text-2xl"
                style={{ color: T.textMain }}
              >
                Team Dashboard
              </h1>
              <p className="mt-1 text-xs font-normal sm:text-sm" style={{ color: T.textMuted }}>
                Performance overview and feedback analytics
              </p>
            </div>
          </div>
          <div
            className="w-full rounded-xl border px-3 py-2 text-center text-xs font-medium sm:w-fit sm:px-4 sm:py-2.5 sm:text-sm"
            style={{
              borderColor: T.primaryBord,
              background: T.primaryBg,
              color: T.textMuted,
            }}
          >
            Team performance
          </div>
        </div>
        <TeamPerformance />
      </div>
    </div>
  );
};

export default TeamDashboard;
