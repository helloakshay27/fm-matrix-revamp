import baseClient from "@/utils/withoutTokenBase";

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
export interface FlipContest {
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

// Card interface for flip cards
export interface FlipCard {
  id: number;
  prize: Prize;
  is_flipped: boolean;
}

// Game data interface
export interface FlipGameData {
  contest: FlipContest;
  cards: FlipCard[];
  remaining_attempts: number;
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
export interface FlipPlayResult {
  success: boolean;
  contest_type: string;
  user_contest_reward?: UserContestReward;
  prize?: Prize;
  message?: string;
}

class NewFlipCardApi {
  private orgId: string = "";
  private token: string = "";

  /**
   * Initialize the API with org_id and token (let baseClient handle URL)
   */
  initialize(orgId?: string, token?: string) {
    // If parameters provided, use them
    if (orgId && token) {
      this.orgId = orgId;
      this.token = token;
      console.warn(
        "🔧 FlipCard API Initialize - org_id:",
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
      "🔧 FlipCard API Initialize from URL - org_id:",
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
   * Get all contests (filtered by content_type=flip on client side)
   */
  async getContests(): Promise<FlipContest[]> {
    try {
      this.initialize();

      const url = `/contests`;
      const params: any = {};
      if (this.token) params.token = this.token;
      if (this.orgId) params.org_id = this.orgId;

      console.warn("🌐 API Call - URL:", url);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.get<FlipContest[]>(url, { params });

      console.warn("✅ API Response:", response.data);

      // Filter only flip contests
      const flipContests = Array.isArray(response.data)
        ? response.data.filter((c) => c.content_type === "flip")
        : [];

      return flipContests;
    } catch (error) {
      console.error("❌ Error fetching contests:", error);
      if (baseClient.isAxiosError && baseClient.isAxiosError(error)) {
        console.error("❌ Response status:", error.response?.status);
        console.error("❌ Response data:", error.response?.data);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch contests"
        );
      }
      throw new Error("Failed to fetch contests");
    }
  }

  /**
   * Get contest by ID
   */
  async getContestById(contestId: string | number): Promise<FlipContest> {
    try {
      this.initialize();

      const url = `/contests/${contestId}`;
      const params: any = {};
      if (this.token) params.token = this.token;
      if (this.orgId) params.org_id = this.orgId;

      console.warn("🌐 API Call - URL:", url);
      console.warn("📋 Contest ID:", contestId);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.get<FlipContest>(url, { params });

      console.warn("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching contest:", error);
      if (baseClient.isAxiosError && baseClient.isAxiosError(error)) {
        console.error("❌ Response status:", error.response?.status);
        console.error("❌ Response data:", error.response?.data);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch contest"
        );
      }
      throw new Error("Failed to fetch contest");
    }
  }

  /**
   * Play/flip a card in the contest
   */
  async playContest(contestId: string | number): Promise<FlipPlayResult> {
    try {
      this.initialize();

      const url = `/contests/${contestId}/play`;
      const params: any = {};
      if (this.token) params.token = this.token;
      // if (this.orgId) params.org_id = this.orgId;

      console.warn("🎲 Playing contest at:", url);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.post<FlipPlayResult>(
        url,
        {},
        { params }
      );

      console.warn("✅ Play Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error playing contest:", error);
      if (baseClient.isAxiosError && baseClient.isAxiosError(error)) {
        console.error("❌ Response status:", error.response?.status);
        console.error("❌ Response data:", error.response?.data);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Failed to play contest"
        );
      }
      throw new Error("Failed to play contest");
    }
  }

  /**
   * Convert prizes to flip cards
   */
  convertPrizesToCards(prizes: Prize[], attemptsRequired: number): FlipCard[] {
    // Create cards based on attempts required
    const cards: FlipCard[] = [];

    for (let i = 0; i < attemptsRequired; i++) {
      // Assign prizes based on probability
      const prize = prizes[i % prizes.length];
      cards.push({
        id: i + 1,
        prize,
        is_flipped: false,
      });
    }

    return cards;
  }
}

export const newFlipCardApi = new NewFlipCardApi();
export default newFlipCardApi;
