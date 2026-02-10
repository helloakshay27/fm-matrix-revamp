import baseClient from "@/utils/withoutTokenBase";

// Prize interface based on new API structure
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

// Contest interface based on new API structure
export interface Contest {
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

// Play result interface
export interface PlayResult {
  success: boolean;
  prize?: Prize;
  message?: string;
}

// Color palette for wheel segments
const SEGMENT_COLORS = [
  "#FFB3BA", // Light pink
  "#FFDFBA", // Light orange
  "#FFFFBA", // Light yellow
  "#BAFFC9", // Light green
  "#BAE1FF", // Light blue
  "#E0BBE4", // Light purple
  "#FFD1DC", // Light rose
  "#FFDAB9", // Peach
];

class NewSpinnerContestApi {
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
        "🔧 Spinner API Initialize - org_id:",
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
      "🔧 Spinner API Initialize from URL - org_id:",
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
   * Get contest by ID
   */
  async getContestById(contestId: string | number): Promise<Contest> {
    try {
      this.initialize();

      const url = `/contests/${contestId}`;
      const params: any = {};
      if (this.token) params.token = this.token;
      if (this.orgId) params.org_id = this.orgId;

      console.warn("🌐 API Call - URL:", url);
      console.warn("🔑 API Call - Params:", params);
      console.warn("📋 Contest ID:", contestId);

      const response = await baseClient.get<Contest>(url, { params });

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
   * Play/spin the contest wheel
   */
  async playContest(contestId: string | number): Promise<PlayResult> {
    try {
      this.initialize();

      const url = `/contests/${contestId}/play`;
      const params: any = {};
      if (this.token) params.token = this.token;
      // if (this.orgId) params.org_id = this.orgId;

      console.warn("🎲 Playing contest at:", url);
      console.warn("🔑 API Call - Params:", params);

      const response = await baseClient.post<PlayResult>(url, {}, { params });

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
   * Convert prizes to wheel segments with colors
   */
  convertPrizesToSegments(prizes: Prize[]) {
    return prizes
      .filter((prize) => prize.active)
      .map((prize, index) => ({
        id: prize.id,
        label: prize.title,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
        prize,
      }));
  }
}

export const newSpinnerContestApi = new NewSpinnerContestApi();
export default newSpinnerContestApi;
