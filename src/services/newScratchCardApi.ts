import baseClient from "@/utils/withoutTokenBase";

// Error interface for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Generate random voucher code
const generateVoucherCode = (length: number = 12): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Prize interface based on API structure
export interface Prize {
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
  total_quantity: number | null;
  claimed_quantity: number;
  per_user_limit: number | null;
  position: number;
  active: boolean;
}

// Contest interface based on API structure
export interface ScratchContest {
  id: number;
  name: string;
  description: string | null;
  terms_and_conditions: string | null;
  content_type: string;
  active: boolean;
  start_at: string;
  end_at: string;
  user_caps: number | null;
  attemp_required: number | null;
  prizes: Prize[];
}

// User contest reward interface
export interface UserContestReward {
  id: number;
  contest_id: number;
  prize_id: number;
  reward_type: "points" | "coupon";
  points_value: number | null;
  coupon_code: string | null;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Play result interface
export interface ScratchPlayResult {
  success: boolean;
  contest_type: string;
  user_contest_reward?: UserContestReward;
  prize?: Prize;
  message?: string;
}

// Dummy data for local testing
const dummyScratchContests: ScratchContest[] = [
  {
    id: 3,
    name: "New Test Contest",
    description: "Contest Description one",
    terms_and_conditions: "Terms and conditions apply",
    content_type: "scratch",
    active: true,
    start_at: "2026-02-01T06:06:00.000+05:30",
    end_at: "2026-03-04T23:59:59.999+05:30",
    user_caps: 8,
    attemp_required: 3,
    prizes: [
      {
        id: 4,
        title: "Offer Title 1",
        display_name: "10% Discount",
        reward_type: "coupon",
        coupon_code: "COUPONNEW88",
        partner_name: "Partner",
        points_value: null,
        probability_value: 8,
        probability_out_of: 80,
        icon_url: null,
        total_quantity: 100,
        claimed_quantity: 0,
        per_user_limit: 1,
        position: 1,
        active: true,
      },
      {
        id: 5,
        title: "Offer Title 2",
        display_name: "Free Shipping",
        reward_type: "coupon",
        coupon_code: "FREESHIP2024",
        partner_name: "Partner Store",
        points_value: null,
        probability_value: 5,
        probability_out_of: 80,
        icon_url: null,
        total_quantity: 50,
        claimed_quantity: 0,
        per_user_limit: 1,
        position: 2,
        active: true,
      },
    ],
  },
  {
    id: 4,
    name: "Valentine's Special",
    description: "Win exciting prizes this Valentine's Day",
    terms_and_conditions: null,
    content_type: "scratch",
    active: true,
    start_at: "2026-02-10T00:00:00.000+05:30",
    end_at: "2026-02-20T23:59:59.999+05:30",
    user_caps: 5,
    attemp_required: 2,
    prizes: [
      {
        id: 6,
        title: "Gift Voucher",
        display_name: "₹1000 Gift Card",
        reward_type: "coupon",
        coupon_code: generateVoucherCode(),
        partner_name: "Lifestyle",
        points_value: null,
        probability_value: 10,
        probability_out_of: 100,
        icon_url: null,
        total_quantity: 20,
        claimed_quantity: 0,
        per_user_limit: 1,
        position: 1,
        active: true,
      },
    ],
  },
];

class NewScratchCardApi {
  private orgId: string = "";
  private token: string = "";
  private useLocalData: boolean = false; // Set to false to use actual API

  /**
   * Initialize the API with org_id and token (let baseClient handle URL)
   */
  initialize(orgId?: string, token?: string) {
    // If parameters provided, use them
    if (orgId && token) {
      this.orgId = orgId;
      this.token = token;
      console.warn(
        "🔧 ScratchCard API Initialize - org_id:",
        orgId,
        "token:",
        token ? "✓" : "✗"
      );
      return;
    }

    // Otherwise try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlOrgId = urlParams.get("org_id");
    const urlToken = urlParams.get("token");

    console.warn(
      "🔧 ScratchCard API Initialize from URL - org_id:",
      urlOrgId,
      "token:",
      urlToken ? "✓" : "✗"
    );

    // Set org_id and token
    if (urlOrgId) {
      this.orgId = urlOrgId;
    }
    if (urlToken) {
      this.token = urlToken;
    }
  }

  /**
   * Get all contests (filtered by content_type=scratch on client side)
   */
  async getContests(): Promise<ScratchContest[]> {
    try {
      // Use local dummy data for testing
      if (this.useLocalData) {
        console.warn("🏠 Using LOCAL dummy data for contests");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
        return dummyScratchContests;
      }

      // Use actual API - let baseClient interceptor handle URL
      this.initialize();

      const url = `/contests`;
      const params: any = {};
      if (this.token) params.token = this.token;
      //   if (this.orgId) params.org_id = this.orgId;

      console.warn("🌐 API Call - URL:", url);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.get<ScratchContest[]>(url, { params });

      console.warn("✅ API Response:", response.data);

      // Filter only scratch contests
      const scratchContests = Array.isArray(response.data)
        ? response.data.filter((c) => c.content_type === "scratch")
        : [];

      return scratchContests;
    } catch (error: unknown) {
      console.error("❌ Error fetching contests:", error);
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch contests";
      throw new Error(message);
    }
  }

  /**
   * Get contest by ID
   */
  async getContestById(contestId: string | number): Promise<ScratchContest> {
    try {
      // Use local dummy data for testing
      if (this.useLocalData) {
        console.warn("🏠 Using LOCAL dummy data for contest:", contestId);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

        const contest = dummyScratchContests.find(
          (c) => c.id === Number(contestId)
        );
        if (!contest) {
          throw new Error("Contest not found");
        }
        return contest;
      }

      // Use actual API - let baseClient interceptor handle URL
      this.initialize();

      const url = `/contests/${contestId}`;
      const params: any = {};
      if (this.token) params.token = this.token;
      //   if (this.orgId) params.org_id = this.orgId;

      console.warn("🌐 API Call - URL:", url);
      console.warn("📋 Contest ID:", contestId);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.get<ScratchContest>(url, { params });

      console.warn("✅ API Response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Error fetching contest:", error);
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch contest";
      throw new Error(message);
    }
  }

  /**
   * Play/scratch the contest
   */
  async playContest(contestId: string | number): Promise<ScratchPlayResult> {
    try {
      // Use local dummy data for testing
      if (this.useLocalData) {
        console.warn("🏠 Using LOCAL dummy data for play:", contestId);
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

        const contest = dummyScratchContests.find(
          (c) => c.id === Number(contestId)
        );
        if (!contest || !contest.prizes || contest.prizes.length === 0) {
          throw new Error("Contest or prizes not found");
        }

        // Randomly select a prize based on probability
        const totalProbability = contest.prizes.reduce(
          (sum, p) => sum + p.probability_value,
          0
        );
        let random = Math.random() * totalProbability;
        let selectedPrize = contest.prizes[0];

        for (const prize of contest.prizes) {
          random -= prize.probability_value;
          if (random <= 0) {
            selectedPrize = prize;
            break;
          }
        }

        // Generate mock user_contest_reward
        const mockReward: UserContestReward = {
          id: Math.floor(Math.random() * 10000),
          contest_id: Number(contestId),
          prize_id: selectedPrize.id,
          reward_type: selectedPrize.reward_type,
          points_value: selectedPrize.points_value,
          coupon_code: selectedPrize.coupon_code || generateVoucherCode(),
          user_id: 1,
          status: "claimed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return {
          success: true,
          contest_type: "scratch",
          user_contest_reward: mockReward,
          prize: selectedPrize,
          message: "Congratulations! You won!",
        };
      }

      // Use actual API - let baseClient interceptor handle URL
      this.initialize();

      const url = `/contests/${contestId}/play`;
      const params: any = {};
      if (this.token) params.token = this.token;
      // if (this.orgId) params.org_id = this.orgId;

      console.warn("🎲 Playing contest at:", url);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.post<ScratchPlayResult>(
        url,
        {},
        { params }
      );

      console.warn("✅ Play Response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("❌ Error playing contest:", error);
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to play contest";
      throw new Error(message);
    }
  }
}

export const newScratchCardApi = new NewScratchCardApi();
export default newScratchCardApi;
