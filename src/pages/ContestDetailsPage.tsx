import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trophy,
  Gift,
  FileText,
  Calendar,
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

interface ContestDetails {
  id: number;
  name: string;
  description: string | null;
  terms_and_conditions: string | null;
  content_type: string;
  active: boolean;
  start_at: string;           // ISO string
  end_at: string;             // ISO string
  user_caps: number | null;
  attemp_required: number | null;
  prizes: Prize[];
}

// Removed hardcoded constants - will use localStorage instead

export const ContestDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<ContestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchContest = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
// const baseUrl =  "https://uat-hi-society.lockated.com";
//     const token = "O08MAh4ADTSweyKwK8zwR5CDVlzKYKLcu825jhnvEjI"

        if (!baseUrl || !token) {
          throw new Error("Base URL or token not set in localStorage");
        }

        // Ensure protocol is present
        const url = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;

        const res = await fetch(`${url}/contests/${id}.json`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data: ContestDetails = await res.json();
        setContest(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load contest details");
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
    return `${prize.probability_value}/${prize.probability_out_of}`;
  };

  const handleEdit = (section: string) => {
    toast.info(`Editing ${section} section (not implemented yet)`);
    // You can later navigate to /contests/${id}/edit?section=basic etc.
  };

  const handleBack = () => {
    navigate("/contests");
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
              {contest.content_type.charAt(0).toUpperCase() + contest.content_type.slice(1)} Contest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleEdit("all")}
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
            <Button
              onClick={() => handleEdit("basic")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Contest Name</p>
                <p className="text-base text-[#1A1A1A]">{contest.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Contest Type</p>
                <p className="text-base text-[#1A1A1A]">
                  {contest.content_type.charAt(0).toUpperCase() + contest.content_type.slice(1)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base text-[#1A1A1A]">
                  {contest.description || "—"}
                </p>
              </div>
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
                className={`px-3 py-1 rounded-md text-sm font-medium ${contest.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
              >
                {contest.active ? "Active" : "Inactive"}
              </span>
              <Button
                onClick={() => handleEdit("validity")}
                variant="outline"
                size="sm"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-base text-[#1A1A1A]">{formatDate(contest.start_at)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="text-base text-[#1A1A1A]">{formatTime(contest.start_at)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-base text-[#1A1A1A]">{formatDate(contest.end_at)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="text-base text-[#1A1A1A]">{formatTime(contest.end_at)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Users Cap</p>
                <p className="text-base text-[#1A1A1A]">{contest.user_caps ?? "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Attempts Required</p>
                <p className="text-base text-[#1A1A1A]">{contest.attemp_required ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers & Media (Prizes) */}
        <Card className="w-full bg-transparent shadow-[0px_1px_8px_rgba(45,45,45,0.05)] border-none">
          <div className="bg-[#F6F4EE] px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#C4B89D54] p-2 rounded-lg">
                <Gift className="w-5 h-5 text-[#C72030]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Prizes / Offers</h3>
            </div>
            <Button
              onClick={() => handleEdit("prizes")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            {contest.prizes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No prizes defined yet</p>
            ) : (
              contest.prizes.map((prize, index) => (
                <div key={prize.id} className="mb-8 last:mb-0 border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-[#C72030] font-semibold text-lg">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6">
                        {/* Row 1 */}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Prize Title</p>
                          <p className="text-sm font-medium text-[#1A1A1A]">{prize.title}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500"> Reward Type</p>
                          <p className="text-sm text-[#1A1A1A]">
                            {/* {prize.reward_type === "points" ? "Loyalty Points" : "Coupon/Voucher"} */}
                            {prize.reward_type === "points"
  ? "Points"
  : prize.reward_type === "coupon"
  ? "Coupon Code"
  : ""}

                          </p>
                        </div>

                        <div className="md:row-span-4 flex items-start justify-end">
                          <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                            {prize.image?.url || prize.icon_url ? (
                              <img
                                src={prize.image?.url || prize.icon_url || ""}
                                alt={prize.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <p className="text-xs text-gray-500 text-center p-3">
                                No banner / icon
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Row 2 */}
                        {/* <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Coupon Code</p>
                          <p className="text-sm text-[#1A1A1A]">
                            {prize.reward_type === "points"
                              ? `${prize.points_value ?? 0} Points`
                              : prize.coupon_code ?? "—"}
                          </p>
                        </div> */}
                        <div className="space-y-1">
  <p className="text-xs font-medium text-gray-500">
    {prize.reward_type === "points" ? "Points" : "Coupon Code"}
  </p>

  <p className="text-sm text-[#1A1A1A]">
    {prize.reward_type === "points"
      ? `${prize.points_value ?? 0} Points`
      : prize.coupon_code ?? "—"}
  </p>
</div>


                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Partner</p>
                          <p className="text-sm text-[#1A1A1A]">{prize.partner_name ?? "—"}</p>
                        </div>

                        {/* Row 3 */}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">Probability</p>
                          <p className="text-sm text-[#1A1A1A]">{getProbability(prize)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Terms & Conditions</h3>
            </div>
            <Button
              onClick={() => handleEdit("terms")}
              variant="outline"
              size="sm"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <CardContent className="bg-white p-6 rounded-b-lg">
            <div className="prose max-w-none text-sm quill-content">
              {/* {contest.terms_and_conditions ? (
                <p>{contest.terms_and_conditions}</p>
              ) : (
                <p className="text-gray-500 italic">No terms and conditions provided.</p>
              )} */}
              <div dangerouslySetInnerHTML={{ __html:contest.terms_and_conditions || "<p className='text-gray-500'>No terms and conditions provided</p>" }}/>

              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestDetailsPage;