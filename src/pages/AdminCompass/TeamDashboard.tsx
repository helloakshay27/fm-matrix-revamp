import { TeamPerformance } from "./TeamPerformance";

const TeamDashboard = () => {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#f6f4ee", fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <div className="px-4 md:px-8 py-6 max-w-[1600px] mx-auto space-y-5">
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(218,119,86,0.10)",
            borderColor: "#e8e3de",
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-1"
            style={{ color: "#6b7280" }}
          >
            Performance overview and feedback analytics
          </p>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "#1a1a1a" }}
          >
            Team Dashboard
          </h1>
        </div>
        <TeamPerformance />
      </div>
    </div>
  );
};

export default TeamDashboard;
