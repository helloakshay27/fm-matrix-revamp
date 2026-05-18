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
      className="min-h-[calc(100vh-5rem)] w-full px-4 py-6 sm:px-6"
      style={{ background: T.pageBg, fontFamily: T.font }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); .team-dashboard-wrap, .team-dashboard-wrap * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <div className="team-dashboard-wrap mx-auto max-w-7xl space-y-4">
        <div
          className="flex flex-col gap-4 rounded-[20px] border p-5 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between"
          style={{
            background: T.cardBg,
            borderColor: T.primaryBord,
            boxShadow: "0 10px 24px rgba(26,26,26,0.05)",
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-sm"
              style={{ borderColor: T.primaryBord, background: T.primaryBg }}
            >
              <LineChart className="h-6 w-6" style={{ color: T.primary }} />
            </div>
            <div>
              <h1
                className="text-2xl font-semibold tracking-tight"
                style={{ color: T.textMain }}
              >
                Team Dashboard
              </h1>
              <p className="mt-1 text-sm font-normal" style={{ color: T.textMuted }}>
                Performance overview and feedback analytics
              </p>
            </div>
          </div>
          <div
            className="w-fit rounded-xl border px-4 py-2.5 text-sm font-medium"
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
