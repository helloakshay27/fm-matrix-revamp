import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Trophy,
  Gift,
  X,
  Loader2,
  FlaskConical,
  Mail,
  Tag,
  User,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const RunContestPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [contestName, setContestName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [dryRunError, setDryRunError] = useState<string | null>(null);
  const [dryRunChecked, setDryRunChecked] = useState<Record<number, boolean>>({});
  const [distributing, setDistributing] = useState(false);
  const [showDistributeConfirm, setShowDistributeConfirm] = useState(false);

  const fetchDryRun = async () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) {
      toast.error("Missing credentials");
      return;
    }
    setLoading(true);
    setDryRunResult(null);
    setDryRunError(null);
    setDryRunChecked({});
    try {
      const response = await axios.get(
        `https://${baseUrl}/contests/${id}/preview_random.json`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      setDryRunResult(data);
      if (Array.isArray(data?.distribution)) {
        const allChecked: Record<number, boolean> = {};
        data.distribution.forEach((_: any, i: number) => { allChecked[i] = true; });
        setDryRunChecked(allChecked);
      }
    } catch (err: any) {
      setDryRunError(err.response?.data?.message || err.message || "Run failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (baseUrl && token && id) {
      axios
        .get(`https://${baseUrl}/contests/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setContestName(res.data?.name ?? ""))
        .catch(() => {});
    }
    fetchDryRun();
  }, [id]);

  const handleDistribute = async () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) { toast.error("Missing credentials"); return; }

    const checkedItems = (dryRunResult?.distribution ?? []).filter(
      (e: any, i: number) => !e.prize_won && dryRunChecked[i] !== false
    );
    if (checkedItems.length === 0) {
      toast.error("Select at least one winner to distribute.");
      return;
    }

    setDistributing(true);
    try {
      await axios.post(
        `https://${baseUrl}/contests/${id}/distribute_random.json`,
        {
          distributions: checkedItems.map((e: any) => ({
            user_id: e.user_id,
            prize_id: e.prize_id,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Rewards distributed successfully!");
      navigate(`/pulse/contests/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Distribution failed");
    } finally {
      setDistributing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/pulse/contests/${id}`)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contest
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C72030]/10 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-[#C72030]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a1a1a]">Run Result</h1>
              {contestName && (
                <p className="text-sm text-gray-500">{contestName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchDryRun}
              disabled={loading}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              onClick={() => setShowDistributeConfirm(true)}
              disabled={distributing || loading || !dryRunResult}
              className="bg-[#C72030] hover:bg-[#a81c28] text-white font-semibold px-5 disabled:opacity-50"
            >
              {distributing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Distributing…
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Distribute
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="w-full shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-[#C72030] animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Running simulation…</p>
            </div>
          ) : dryRunError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm font-semibold text-red-600">Run failed</p>
              <p className="text-xs text-gray-500 text-center max-w-sm">{dryRunError}</p>
            </div>
          ) : dryRunResult ? (
            <div className="space-y-4">
              {/* Summary bar */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#C72030]/5 border border-[#C72030]/20">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#C72030] shrink-0" />
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    Total Rewards Distributed:&nbsp;
                    <span className="text-[#C72030]">{dryRunResult.total_rewards ?? 0}</span>
                  </p>
                </div>
                {Array.isArray(dryRunResult.distribution) && dryRunResult.distribution.some((e: any) => !e.prize_won) && (() => {
                  const selectableIndices = dryRunResult.distribution
                    .map((_: any, i: number) => i)
                    .filter((i: number) => !dryRunResult.distribution[i].prize_won);
                  const allSelected = selectableIndices.every((i: number) => dryRunChecked[i] !== false);
                  return (
                    <button
                      onClick={() => {
                        const updated: Record<number, boolean> = {};
                        dryRunResult.distribution.forEach((_: any, i: number) => { updated[i] = !allSelected; });
                        setDryRunChecked(updated);
                      }}
                      className="px-3 py-1 text-xs font-semibold text-[#C72030] bg-white border border-[#C72030]/30 rounded-lg hover:bg-[#C72030]/5 transition-colors"
                    >
                      {allSelected ? "Unselect All" : "Select All"}
                    </button>
                  );
                })()}
              </div>

              {/* Distribution cards */}
              {Array.isArray(dryRunResult.distribution) && dryRunResult.distribution.length > 0 ? (
                dryRunResult.distribution.map((entry: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-xl border overflow-hidden ${entry.prize_won ? "border-gray-200 bg-gray-50 opacity-70" : "border-gray-200 bg-white"}`}
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#F6F4EE] border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#C72030] uppercase tracking-wide">
                          Winner #{i + 1}
                        </span>
                        {entry.prize_won && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                            Already Won
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={entry.prize_won ? false : (dryRunChecked[i] ?? true)}
                        disabled={entry.prize_won}
                        onChange={(e) =>
                          setDryRunChecked((prev) => ({ ...prev, [i]: e.target.checked }))
                        }
                        className="w-4 h-4 accent-[#C72030] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* User info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#C72030]/10 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-[#C72030]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">User</p>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{entry.user_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Email</p>
                            <p className="text-sm text-[#1a1a1a] break-all">{entry.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Prize info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Gift className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Prize</p>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{entry.prize_title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              {entry.reward_type === "points" ? "Points" : "Coupon Code"}
                            </p>
                            <p className="text-sm font-semibold text-[#1a1a1a]">
                              {entry.reward_type === "points"
                                ? `${entry.points_value ?? 0} pts`
                                : (entry.coupon_code ?? "—")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No distribution data returned.</p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Distribute Confirmation Modal */}
      {showDistributeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[#C72030]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Are you sure?</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  This will distribute prizes to the selected winners.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDistributeConfirm(false)}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDistributeConfirm(false); handleDistribute(); }}
                className="px-4 py-1.5 text-sm font-medium text-white bg-[#C72030] hover:bg-[#a81c28] rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunContestPage;
