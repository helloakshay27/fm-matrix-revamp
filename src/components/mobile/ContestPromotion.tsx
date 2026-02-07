import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy } from "lucide-react";

interface ContestItem {
  id: string;
  type: "spin" | "scratch" | "flip";
  title: string;
  description: string;
  attemptsLeft: number;
  totalAttempts: number;
  icon: string;
  route: string;
  status?: string;
}

export const ContestPromotion: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<ContestItem[]>([]);

  useEffect(() => {
    // Load contests data
    // TODO: Replace with actual API call
    const dummyContests: ContestItem[] = [
      {
        id: "1",
        type: "spin",
        title: "Spin Wheel",
        description: "Pay Your Maintenance",
        attemptsLeft: 1,
        totalAttempts: 1,
        icon: "spin",
        route: "/spinnercontest",
      },
      {
        id: "2",
        type: "scratch",
        title: "Scratch",
        description: "Festive Surprises",
        attemptsLeft: 1,
        totalAttempts: 1,
        icon: "scratch",
        route: "/scratchcard",
        status: "YOU WON\n$10",
      },
      {
        id: "3",
        type: "flip",
        title: "Flip",
        description: "Move-In Celebration",
        attemptsLeft: 1,
        totalAttempts: 1,
        icon: "flip",
        route: "/flipcard",
      },
    ];
    setContests(dummyContests);
  }, []);

  const handleContestClick = (contest: ContestItem) => {
    navigate(contest.route);
  };

  const handleMyRewards = () => {
    navigate("/my-rewards");
  };

  const renderIcon = (contest: ContestItem) => {
    switch (contest.type) {
      case "spin":
        return (
          <div className="relative w-20 h-20">
            {/* Target/Gift box icon for Spin Wheel */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Red target circle */}
              <div className="w-16 h-16 rounded-t-lg bg-[#D32F2F] flex items-center justify-center relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#D32F2F] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
                {/* Target text */}
                <div className="absolute top-1 left-0 right-0 text-center">
                  <span className="text-white text-[8px] font-bold">
                    TARGET
                  </span>
                </div>
              </div>
              {/* Colorful gift base */}
              <div className="absolute bottom-0 w-16 h-8 flex">
                <div className="flex-1 bg-[#9C27B0]" />
                <div className="flex-1 bg-[#FFA726]" />
                <div className="flex-1 bg-[#9C27B0]" />
              </div>
            </div>
          </div>
        );

      case "scratch":
        return (
          <div className="relative w-20 h-20">
            {/* Blue circle with gift box */}
            <div className="w-20 h-20 rounded-full bg-[#5470B8] flex items-center justify-center relative">
              {/* Gift box */}
              <div className="text-3xl">🎁</div>
              {/* Status badge */}
              {contest.status && (
                <div className="absolute bottom-0 right-0 bg-white rounded px-1.5 py-0.5 shadow-sm">
                  <div className="text-[8px] font-semibold text-center leading-tight whitespace-pre-line text-gray-800">
                    {contest.status}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "flip":
        return (
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Two envelopes */}
            <div className="relative">
              {/* Red envelope */}
              <div className="absolute -left-2 top-2 w-12 h-10 bg-[#E57373] rounded transform -rotate-12 border-2 border-[#D32F2F]">
                <div
                  className="absolute top-0 left-0 right-0 h-5 bg-[#D32F2F] rounded-t"
                  style={{ clipPath: "polygon(0 0, 50% 60%, 100% 0)" }}
                />
              </div>
              {/* Blue envelope */}
              <div className="relative left-2 w-12 h-10 bg-[#64B5F6] rounded transform rotate-12 border-2 border-[#1976D2]">
                <div
                  className="absolute top-0 left-0 right-0 h-5 bg-[#1976D2] rounded-t"
                  style={{ clipPath: "polygon(0 0, 50% 60%, 100% 0)" }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-sm font-medium tracking-wider text-gray-900 uppercase pr-10">
            Contest & Promotion
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* My Rewards Section */}
        <button
          onClick={handleMyRewards}
          className="w-full bg-[#F5E6D3] rounded-xl p-4 flex items-center justify-between hover:bg-[#EDD9C3] transition-colors"
        >
          <span className="text-lg font-semibold text-gray-900">
            My Rewards
          </span>
          <Trophy className="w-6 h-6 text-[#B88B15]" />
        </button>

        {/* Contest Cards */}
        <div className="space-y-4">
          {contests.map((contest) => (
            <button
              key={contest.id}
              onClick={() => handleContestClick(contest)}
              className="w-full bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              {/* Left side - Text content */}
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {contest.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {contest.description}
                </p>
                <p className="text-xs text-gray-500">
                  {contest.attemptsLeft}/{contest.totalAttempts} attempts left
                </p>
              </div>

              {/* Right side - Icon */}
              <div className="ml-4">{renderIcon(contest)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestPromotion;
