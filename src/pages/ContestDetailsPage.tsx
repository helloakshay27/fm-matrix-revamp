import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Edit,
  Trophy,
  Gift,
  FileText,
  Calendar,
  MapPin,
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

interface Prize {
  id: number;
  title: string;
  display_name: string | null;
  reward_type: "points" | "coupon";
  coupon_code: string | null;
  partner_name: string | null;
  points_value: number | null;
  probability_value: number;
  probability_out_of: number;
  icon_url: string | null;
  image: {
    id: number;
    url: string;
  } | null;
  // other fields omitted if not used in UI
}

interface ContestSite {
  id: number;
  site_id: number;
  site_name: string;
}

interface ContestDetails {
  id: number;
  name: string;
  description: string | null;
  terms_and_conditions: string | null;
  redemption_guide: string | null;
  content_type: string;
  active: boolean;
  start_at: string;
  end_at: string;
  user_caps: number | null;
  user_attemp_remaining: number | null;
  attemp_required: number | null;
  usage_type: string | null;
  access_type: string | null;
  prizes: Prize[];
  contest_sites: ContestSite[];
}

// Removed hardcoded constants - will use localStorage instead

export const ContestDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<ContestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dryRunModalOpen, setDryRunModalOpen] = useState(false);
  const [dryRunLoading, setDryRunLoading] = useState(false);
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [dryRunError, setDryRunError] = useState<string | null>(null);
  const [dryRunChecked, setDryRunChecked] = useState<Record<number, boolean>>({});
  const [distributing, setDistributing] = useState(false);
  const [showDistributeConfirm, setShowDistributeConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchContest = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");

        if (!baseUrl || !token) {
          throw new Error("Base URL or token not set in localStorage");
        }

        // Ensure protocol is present
        const url = `https://${baseUrl}`;

        const response = await axios.get(`${url}/contests/${id}.json`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data: ContestDetails = response.data;
        setContest(data);
      } catch (err: any) {
        console.error(err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load contest details";
        setError(errorMessage);
        toast.error("Could not load contest details");
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [id]);

  const formatDate = (iso: string): string => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString("en-GB"); // 07/02/2026
    } catch {
      return iso;
    }
  };

  const formatTime = (iso: string): string => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }); // 2:00 PM
    } catch {
      return iso;
    }
  };

  const getProbability = (prize: Prize) => {
    return `${prize.probability_value}`;
  };

  const handleDryRun = async () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) {
      toast.error("Missing credentials");
      return;
    }
    setDryRunModalOpen(true);
    setDryRunLoading(true);
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
      setDryRunError(
        err.response?.data?.message || err.message || "Run failed"
      );
    } finally {
      setDryRunLoading(false);
    }
  };

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
      setDryRunModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Distribution failed");
    } finally {
      setDistributing(false);
    }
  };

  const handleEdit = () => {
    navigate(`/pulse/contests/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/pulse/contests");
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#C72030] animate-spin" />
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Contest not found"}</p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contest List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">
                {contest.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${contest.active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
                  }`}
              >
                {contest.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {contest.content_type.charAt(0).toUpperCase() +
                contest.content_type.slice(1)}{" "}
              Contest
            </p>
          </div>

          <div className="flex items-center gap-3">
            {
              contest.content_type === "random" && (
                <Button
                  onClick={handleDryRun}
                  variant="outline"
                  className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 px-4 py-2"
                >
                  <FlaskConical className="w-4 h-4 mr-2" />
                  Run Contest
                </Button>
              )
            }

            <Button
              onClick={() => handleEdit()}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 px-4 py-2"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Contest
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Basic Contest Info */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Trophy className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Basic Contest Info
              </h3>
            </div>
            {/* <Button
              onClick={() => handleEdit("basic")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button> */}
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Contest Name
                </p>
                <p className="text-base text-[#1A1A1A]">{contest.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Contest Type
                </p>
                <p className="text-base text-[#1A1A1A]">
                  {contest.content_type.charAt(0).toUpperCase() +
                    contest.content_type.slice(1)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base text-[#1A1A1A]">
                  {contest.description || "—"}
                </p>
              </div>
              {contest.content_type === "random" && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Usage Type</p>
                  <p className="text-base text-[#1A1A1A]">
                    {contest.usage_type
                      ? contest.usage_type.charAt(0).toUpperCase() + contest.usage_type.slice(1)
                      : "—"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validity & Status */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Validity & Status
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${contest.active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
                  }`}
              >
                {contest.active ? "Active" : "Inactive"}
              </span>
              {/* <Button
                onClick={() => handleEdit("validity")}
                variant="outline"
                size="sm"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button> */}
            </div>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-base text-[#1A1A1A]">
                  {formatDate(contest.start_at)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="text-base text-[#1A1A1A]">
                  {formatTime(contest.start_at)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-base text-[#1A1A1A]">
                  {formatDate(contest.end_at)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="text-base text-[#1A1A1A]">
                  {formatTime(contest.end_at)}
                </p>
              </div>
              {contest.content_type === "spin" && (
                <>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Users Cap</p>
                    <p className="text-base text-[#1A1A1A]">
                      {contest.user_caps ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Attempts Allowed
                    </p>
                    <p className="text-base text-[#1A1A1A]">
                      {contest.attemp_required ?? contest.user_attemp_remaining ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Winning Probability (%)
                    </p>
                    <p className="text-base text-[#1A1A1A]">
                      {contest.prizes.length > 0
                        ? contest.prizes
                            .filter((p) => p.title !== "Better luck next time!")
                            .reduce((sum, p) => sum + (Number(p.probability_value) || 0), 0)
                        : "—"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contest Sites */}
        {contest.contest_sites && contest.contest_sites.length > 0 && (
          <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
            <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#C4B89D54] p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#C72030]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  Contest Sites
                </h3>
              </div>
              {/* {contest.access_type && (
                <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {contest.access_type.replace(/_/g, " ")}
                </span>
              )} */}
            </div>
            <CardContent className="bg-white p-6 rounded-b-lg">
              <div className="flex flex-wrap gap-2">
                {contest.contest_sites.map((site) => (
                  <span
                    key={site.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-[#F6F4EE] text-[#1A1A1A] border border-[#E5E0D3]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C72030]" />
                    {site.site_name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offers & Media (Prizes) */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Gift className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Prizes / Offers
              </h3>
            </div>
            {/* <Button
              onClick={() => handleEdit("prizes")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button> */}
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            {contest.prizes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No prizes defined yet
              </p>
            ) : (
              (() => {
                // Group by reward_type, then by title within each group
                const byRewardType = contest.prizes.reduce((acc, prize) => {
                  const key = prize.reward_type;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(prize);
                  return acc;
                }, {} as Record<string, Prize[]>);

                const rewardTypeLabel = (type: string) =>
                  type === "points" ? "Points" : type === "coupon" ? "Coupon Code" : type;

                return Object.entries(byRewardType).map(([rewardType, typePrizes], groupIndex) => {
                  // Sub-group by title — prizes with the same title get coupon codes merged
                  const byTitle = typePrizes.reduce((acc, prize) => {
                    const key = prize.title;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(prize);
                    return acc;
                  }, {} as Record<string, Prize[]>);

                  return (
                    <div key={rewardType} className={groupIndex > 0 ? "mt-8 pt-6 border-t border-gray-200" : ""}>
                      {/* Reward type badge */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className="px-3 py-1 bg-[#C72030]/10 text-[#C72030] text-xs font-semibold rounded-full">
                          {rewardTypeLabel(rewardType)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {Object.keys(byTitle).length} offer{Object.keys(byTitle).length > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="space-y-6">
                        {Object.entries(byTitle).map(([title, prizes], index) => {
                          const rep = prizes[0];
                          const couponCodes = prizes
                            .map((p) => p.coupon_code)
                            .filter(Boolean)
                            .join(", ");
                          const totalProb = prizes.reduce(
                            (sum, p) => sum + (Number(p.probability_value) || 0), 0
                          );

                          return (
                            <div key={title} className="border-b pb-6 last:border-b-0 last:pb-0">
                              <div className="flex items-start gap-3">
                                <span className="text-[#C72030] font-semibold text-lg shrink-0">
                                  {index + 1}.
                                </span>
                                <div className="flex-1">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6">
                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500">Prize Title</p>
                                      <p className="text-sm font-medium text-[#1A1A1A]">{title}</p>
                                    </div>

                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500">
                                        {rewardType === "points" ? "Points" : "Coupon Code"}
                                      </p>
                                      <p className="text-sm text-[#1A1A1A]">
                                        {rewardType === "points"
                                          ? `${rep.points_value ?? 0} Points`
                                          : (couponCodes || "—")}
                                      </p>
                                    </div>

                                    <div className="md:row-span-3 flex items-start justify-end">
                                      <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                        {rep.image?.url || rep.icon_url ? (
                                          <img
                                            src={rep.image?.url || rep.icon_url || ""}
                                            alt={title}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <p className="text-xs text-gray-500 text-center p-3">
                                            No banner / icon
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500">Partner</p>
                                      <p className="text-sm text-[#1A1A1A]">{rep.partner_name ?? "—"}</p>
                                    </div>

                                    <div className="space-y-1">
                                      <p className="text-xs font-medium text-gray-500">Probability</p>
                                      <p className="text-sm text-[#1A1A1A]">{totalProb || "—"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <FileText className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Terms & Conditions
              </h3>
            </div>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="prose max-w-none text-sm quill-content">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    contest.terms_and_conditions ||
                    "<p class='text-gray-500'>No terms and conditions provided</p>",
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Redemption Guide */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <FileText className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                Redemption Guide
              </h3>
            </div>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="prose max-w-none text-sm quill-content">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    contest.redemption_guide ||
                    "<p class='text-gray-500'>No redemption guide provided</p>",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dry Run Modal */}
      {dryRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C72030]/10 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4 text-[#C72030]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1a1a1a] leading-tight">Run Result</h2>
                  {contest && (
                    <p className="text-xs text-gray-400 font-medium leading-tight">{contest.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDryRunResult(null);
                    setDryRunError(null);
                    handleDryRun();
                  }}
                  disabled={dryRunLoading}
                  title="Refresh"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#C72030] bg-[#C72030]/5 hover:bg-[#C72030]/10 border border-[#C72030]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dryRunLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setDryRunModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {dryRunLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 text-[#C72030] animate-spin" />
                  <p className="text-sm text-gray-500 font-medium">Running simulation…</p>
                </div>
              ) : dryRunError ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-sm font-semibold text-red-600">Dry run failed</p>
                  <p className="text-xs text-gray-500 text-center max-w-sm">{dryRunError}</p>
                </div>
              ) : dryRunResult ? (
                <div className="space-y-4">
                  {/* Summary bar */}
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#C72030]/5 border border-[#C72030]/20">
                    <Trophy className="w-4 h-4 text-[#C72030] shrink-0" />
                    <p className="text-sm font-semibold text-[#1a1a1a]">
                      Total Rewards Distributed:&nbsp;
                      <span className="text-[#C72030]">{dryRunResult.total_rewards ?? 0}</span>
                    </p>
                  </div>

                  {/* Distribution cards */}
                  {Array.isArray(dryRunResult.distribution) && dryRunResult.distribution.length > 0 ? (
                    dryRunResult.distribution.map((entry: any, i: number) => (
                      <div
                        key={i}
                        className={`rounded-xl border overflow-hidden ${entry.prize_won ? "border-gray-200 bg-gray-50 opacity-70" : "border-gray-200 bg-white"}`}
                      >
                        {/* Card header — winner number + already-won tag + checkbox */}
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
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <Button
                onClick={() => setDryRunModalOpen(false)}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Close
              </Button>
              <Button
                onClick={() => setShowDistributeConfirm(true)}
                disabled={distributing || dryRunLoading || !dryRunResult}
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
      )}

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

export default ContestDetailsPage;
