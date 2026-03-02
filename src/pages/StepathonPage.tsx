import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const genderData = [
  { name: "Male", value: 3200, color: "#c4b99d" },
  { name: "Female", value: 1850, color: "#8b7355" },
];

const achieversData = [
  { rank: 1, circleName: "Mumbai Circle", userCount: 482 },
  { rank: 2, circleName: "Delhi Circle", userCount: 375 },
  { rank: 3, circleName: "Bangalore Circle", userCount: 310 },
  { rank: 4, circleName: "Chennai Circle", userCount: 290 },
  { rank: 5, circleName: "Hyderabad Circle", userCount: 245 },
  { rank: 6, circleName: "Kolkata Circle", userCount: 198 },
  { rank: 7, circleName: "Pune Circle", userCount: 172 },
  { rank: 8, circleName: "Ahmedabad Circle", userCount: 143 },
  { rank: 9, circleName: "Jaipur Circle", userCount: 121 },
  { rank: 10, circleName: "Lucknow Circle", userCount: 98 },
];

const topCircleRankData = [
  { rank: 1, circleName: "Mumbai Circle", avgSteps: 18750 },
  { rank: 2, circleName: "Bangalore Circle", avgSteps: 17600 },
  { rank: 3, circleName: "Hyderabad Circle", avgSteps: 16980 },
  { rank: 4, circleName: "Delhi Circle", avgSteps: 16200 },
  { rank: 5, circleName: "Pune Circle", avgSteps: 15430 },
  { rank: 6, circleName: "Chennai Circle", avgSteps: 14800 },
  { rank: 7, circleName: "Kolkata Circle", avgSteps: 14100 },
  { rank: 8, circleName: "Ahmedabad Circle", avgSteps: 13600 },
  { rank: 9, circleName: "Jaipur Circle", avgSteps: 12900 },
  { rank: 10, circleName: "Lucknow Circle", avgSteps: 11800 },
];

const dailyStepCount = 18942;

// ─── Function Statistics (Site-wise) ─────────────────────────────────────────

const topFunctionRankData = [
  { rank: 1, function: "IT", avgSteps: 17800 },
  { rank: 2, function: "Operations", avgSteps: 16500 },
  { rank: 3, function: "HR", avgSteps: 15200 },
  { rank: 4, function: "Finance", avgSteps: 14800 },
  { rank: 5, function: "Sales", avgSteps: 14100 },
  { rank: 6, function: "Marketing", avgSteps: 13500 },
  { rank: 7, function: "Legal", avgSteps: 12900 },
  { rank: 8, function: "Admin", avgSteps: 12100 },
  { rank: 9, function: "Security", avgSteps: 11400 },
  { rank: 10, function: "Facilities", avgSteps: 10800 },
];

const functionChartData = [
  { name: "IT", avgSteps: 17800 },
  { name: "Operations", avgSteps: 16500 },
  { name: "HR", avgSteps: 15200 },
  { name: "Finance", avgSteps: 14800 },
  { name: "Sales", avgSteps: 14100 },
  { name: "Marketing", avgSteps: 13500 },
  { name: "Legal", avgSteps: 12900 },
  { name: "Admin", avgSteps: 12100 },
  { name: "Security", avgSteps: 11400 },
  { name: "Facilities", avgSteps: 10800 },
];

// ─── Cluster Statistics (Company-wise) ───────────────────────────────────────

const topClusterRankData = [
  { rank: 1, cluster: "Vi Corporate", avgSteps: 19200 },
  { rank: 2, cluster: "Vi Enterprise", avgSteps: 17800 },
  { rank: 3, cluster: "Vi SMB", avgSteps: 16400 },
  { rank: 4, cluster: "Vi Retail", avgSteps: 15900 },
  { rank: 5, cluster: "Vi Tech", avgSteps: 14700 },
  { rank: 6, cluster: "Vi Consumer", avgSteps: 13600 },
  { rank: 7, cluster: "Vi Wholesale", avgSteps: 12800 },
  { rank: 8, cluster: "Vi Cloud", avgSteps: 11900 },
  { rank: 9, cluster: "Vi Digital", avgSteps: 11200 },
  { rank: 10, cluster: "Vi Infra", avgSteps: 10500 },
];

const clusterChartData = [
  { name: "Vi Corporate", avgSteps: 19200 },
  { name: "Vi Enterprise", avgSteps: 17800 },
  { name: "Vi SMB", avgSteps: 16400 },
  { name: "Vi Retail", avgSteps: 15900 },
  { name: "Vi Tech", avgSteps: 14700 },
  { name: "Vi Consumer", avgSteps: 13600 },
  { name: "Vi Wholesale", avgSteps: 12800 },
  { name: "Vi Cloud", avgSteps: 11900 },
  { name: "Vi Digital", avgSteps: 11200 },
  { name: "Vi Infra", avgSteps: 10500 },
];

// ─── Reusable Components ──────────────────────────────────────────────────────

interface RankingTableProps {
  title: string;
  columns: { key: string; label: string }[];
  data: Record<string, string | number>[];
}

const RankingTable: React.FC<RankingTableProps> = ({ title, columns, data }) => (
  <Card className="bg-white shadow-sm border border-gray-200 h-full">
    <CardHeader className="pb-3 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-semibold text-gray-800">{title}</CardTitle>
        <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-auto max-h-[340px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left text-xs font-semibold text-[#000000] uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 text-sm text-gray-700">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const StepathonPage: React.FC = () => {
  const [startDate, setStartDate] = useState("2026-02-03");
  const [endDate, setEndDate] = useState("2026-02-03");

  const handleApply = () => {
    // For now just uses dummy data; API integration later
  };

  const totalGenderParticipants = genderData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Pulse Stepathon</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-0.5">Select Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                />
              </div>
              <span className="text-gray-500 font-semibold mt-4">TO</span>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-0.5">Select End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                />
              </div>
            </div>
            <button
              onClick={handleApply}
              className="mt-4 bg-[#F2EEE9] hover:bg-[#F2EEE9] text-[#C72030] px-6 py-1.5 text-sm font-semibold transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* ── Top 3 Cards Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Gender-wise Participants */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-800">Gender-wise Participants</CardTitle>
                <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} (${((value / totalGenderParticipants) * 100).toFixed(1)}%)`,
                        "",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                {genderData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: 20K Steps Achievers Count */}
          <RankingTable
            title="20K Steps Achievers Count"
            columns={[
              { key: "rank", label: "Rank" },
              { key: "circleName", label: "Circle Name" },
              { key: "userCount", label: "User Count" },
            ]}
            data={achieversData}
          />

          {/* Card 3: Top 10 Circle Level Ranking */}
          <RankingTable
            title="Top 10 Circle Level Ranking"
            columns={[
              { key: "rank", label: "Rank" },
              { key: "circleName", label: "Circle Name" },
              { key: "avgSteps", label: "Avg Steps" },
            ]}
            data={topCircleRankData}
          />
        </div>

        {/* ── Daily Step Count Card ───────────────────────────────────────── */}
        <Card className="bg-white shadow-sm border border-gray-200 max-w-xs">
          <CardHeader className="pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e5e0d3] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4 6l2 2-4.41 5H11v3h2v-3h2.5l-2.5-3 1-2L10.5 9H9a2 2 0 0 0-1.94 1.5L6 14h2l1.5-2.5z"
                      fill="#c72030"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-800">{dailyStepCount.toLocaleString()}</span>
              </div>
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <p className="text-sm text-gray-600 font-medium">An Organisation's Daily Step Count</p>
          </CardContent>
        </Card>

        {/* ── Function Statistics (Site-wise) ────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Function Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top 10 Function Level Ranking */}
            <div className="md:col-span-1">
              <RankingTable
                title="Top 10 Function Level Ranking (Site-wise)"
                columns={[
                  { key: "rank", label: "Rank" },
                  { key: "function", label: "Functions" },
                  { key: "avgSteps", label: "Avg Steps" },
                ]}
                data={topFunctionRankData}
              />
            </div>
            {/* Function Wise Average Steps Chart */}
            <div className="md:col-span-2">
              <Card className="bg-white shadow-sm border border-gray-200 h-full">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-sm font-semibold text-gray-800 text-center">
                    Function Wise Average Steps (Site-wise)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={functionChartData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                          dataKey="name"
                          fontSize={11}
                          tick={{ fill: "#6b7280" }}
                          angle={-35}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis
                          fontSize={11}
                          tick={{ fill: "#6b7280" }}
                          label={{
                            value: "Average Steps Taken",
                            angle: -90,
                            position: "insideLeft",
                            offset: -5,
                            style: { textAnchor: "middle", fill: "#6b7280", fontSize: 11 },
                          }}
                          tickFormatter={(v) => v.toLocaleString()}
                          domain={[0, 20000]}
                          ticks={[0, 5000, 10000, 15000, 20000]}
                        />
                        <Tooltip
                          formatter={(value: number) => [value.toLocaleString(), "Avg Steps"]}
                        />
                        <Bar dataKey="avgSteps" fill="#c4b99d" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ── Cluster Statistics (Company-wise) ──────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Cluster Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top 10 Cluster Level Ranking */}
            <div className="md:col-span-1">
              <RankingTable
                title="Top 10 Cluster Level Ranking (Company-wise)"
                columns={[
                  { key: "rank", label: "Rank" },
                  { key: "cluster", label: "Cluster" },
                  { key: "avgSteps", label: "Avg Steps" },
                ]}
                data={topClusterRankData}
              />
            </div>
            {/* Cluster Wise Average Steps Chart */}
            <div className="md:col-span-2">
              <Card className="bg-white shadow-sm border border-gray-200 h-full">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-sm font-semibold text-gray-800 text-center">
                    Cluster Wise Average Steps (Company-wise)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={clusterChartData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                          dataKey="name"
                          fontSize={11}
                          tick={{ fill: "#6b7280" }}
                          angle={-35}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis
                          fontSize={11}
                          tick={{ fill: "#6b7280" }}
                          label={{
                            value: "Average Steps Taken",
                            angle: -90,
                            position: "insideLeft",
                            offset: -5,
                            style: { textAnchor: "middle", fill: "#6b7280", fontSize: 11 },
                          }}
                          tickFormatter={(v) => v.toLocaleString()}
                          domain={[0, 20000]}
                          ticks={[0, 5000, 10000, 15000, 20000]}
                        />
                        <Tooltip
                          formatter={(value: number) => [value.toLocaleString(), "Avg Steps"]}
                        />
                        <Bar dataKey="avgSteps" fill="#c4b99d" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepathonPage;
