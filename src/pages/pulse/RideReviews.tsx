import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

interface ApiReview {
  id: number;
  ratings: number;
  reviews: string;
  created_at: string;
  created_by: number;
}

interface DriverDetailResponse {
  id: number;
  firstname: string;
  lastname: string;
  reviews_count: number;
  reviews: ApiReview[];
}

/** Renders N filled + (5-N) empty stars */
const StarRow: React.FC<{ rating: number; size?: string }> = ({
  rating,
  size = "w-4 h-4",
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`${size} ${
          i <= rating
            ? "fill-[#C4A96A] text-[#C4A96A]"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ))}
  </div>
);

export const RideReviews: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("id");
  const userId = searchParams.get("userId");

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [driverData, setDriverData] = useState<DriverDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    if (!userId || !baseUrl || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get<DriverDetailResponse>(`https://${baseUrl}/api/users/${userId}/driver_detail.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDriverData(res.data))
      .catch((err: unknown) => {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Failed to load reviews";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [userId, baseUrl, token]);

  const reviews = useMemo(() => driverData?.reviews ?? [], [driverData]);
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.ratings, 0) / totalReviews
    : 0;
  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { counts[r.ratings] = (counts[r.ratings] || 0) + 1; });
    return counts;
  }, [reviews]);
  const positiveReviews = reviews.filter((r) => r.ratings >= 4).length;

  const filteredReviews = activeFilter === 0
    ? reviews
    : reviews.filter((r) => r.ratings === activeFilter);

  const FILTER_OPTIONS = [
    { label: `All Reviews (${totalReviews})`, value: 0 },
    { label: "5", value: 5 },
    { label: "4", value: 4 },
    { label: "3", value: 3 },
    { label: "2", value: 2 },
    { label: "1", value: 1 },
  ];

  const fmtDate = (ds: string) => {
    const d = new Date(ds);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="bg-[#F5F5F0] min-h-screen px-6 py-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span
          className="cursor-pointer hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          Carpool
        </span>{" "}
        &gt;{" "}
        <span
          className="cursor-pointer hover:text-gray-700"
          onClick={() => navigate(`/pulse/carpool/ride-detail?id=${rideId}`)}
        >
          Ride Detail
        </span>{" "}
        &gt; <span className="text-gray-700">Reviews</span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}

      {/* Error */}
      {error && !driverData && (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="w-10 h-10 text-[#C72030] mb-3" />
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      )}

      {!loading && driverData && (
        <>
          {/* Top cards row */}
          <div className="flex gap-4 mb-4">
            {/* Average rating card */}
            <div className="bg-white border border-gray-200 rounded p-6 flex flex-col items-center justify-center w-48 shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Star className="w-7 h-7 fill-[#C4A96A] text-[#C4A96A]" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {totalReviews > 0 ? averageRating.toFixed(1) : "—"}
              </p>
              <StarRow rating={Math.round(averageRating)} />
              <p className="text-xs text-gray-400 mt-2">
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating distribution card */}
            <div className="bg-white border border-gray-200 rounded p-6 flex-1">
              <p className="font-semibold text-base mb-4">Rating Distribution</p>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-3 text-right text-gray-600">{star}</span>
                      <Star className="w-4 h-4 fill-[#C4A96A] text-[#C4A96A] shrink-0" />
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C4A96A] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-gray-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Total Reviews */}
            <div className="bg-white border border-gray-200 rounded p-5 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {driverData.firstname} {driverData.lastname}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
                </svg>
              </div>
            </div>

            {/* Positive Reviews */}
            <div className="bg-white border border-gray-200 rounded p-5 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Positive Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{positiveReviews}</p>
                <p className="text-xs text-gray-400 mt-1">4+ stars</p>
              </div>
              <div className="w-10 h-10 rounded-sm bg-[#E8F5E9] flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium border transition-colors ${
                  activeFilter === opt.value
                    ? "bg-[#C72030] text-white border-[#C72030]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {opt.label}
                {opt.value !== 0 && (
                  <Star
                    className={`w-3.5 h-3.5 ${
                      activeFilter === opt.value
                        ? "fill-white text-white"
                        : "fill-[#C4A96A] text-[#C4A96A]"
                    }`}
                  />
                )}
                {opt.value !== 0 && (
                  <span className={`text-xs ${activeFilter === opt.value ? "text-white/80" : "text-gray-400"}`}>
                    ({ratingCounts[opt.value] || 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Review cards */}
          <div className="space-y-3">
            {filteredReviews.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded p-10 text-center text-gray-400">
                No reviews for this rating.
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRow rating={review.ratings} />
                        <span className="text-sm font-semibold text-gray-800">{review.ratings}/5</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{fmtDate(review.created_at)}</p>
                      <p className="text-sm text-gray-700 mt-3">{review.reviews}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* No userId fallback */}
      {!loading && !error && !driverData && (
        <div className="flex flex-col items-center justify-center py-16">
          <Star className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No review data available.</p>
        </div>
      )}
    </div>
  );
};
