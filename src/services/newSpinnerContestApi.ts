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
    private baseURL: string = "";
    private token: string = "";

    /**
     * Initialize the API with dynamic base URL and token from URL parameters
     */
    initialize() {
        const urlParams = new URLSearchParams(window.location.search);
        const orgId = urlParams.get("org_id");
        const token = urlParams.get("token");

        console.warn("🔧 API Initialize - org_id:", orgId, "token:", token ? "✓" : "✗");

        // Set token
        if (token) {
            this.token = token;
        }

        // Set base URL based on org_id or use default
        if (orgId) {
            // You can add logic here to determine base URL based on org_id
            // For now, using runwal-api.lockated.com as default
            this.baseURL = "https://runwal-api.lockated.com";
        } else {
            // Default base URL
            this.baseURL = "https://runwal-api.lockated.com";
        }
    }

    /**
     * Get contest by ID
     */
    async getContestById(contestId: string | number): Promise<Contest> {
        try {
            this.initialize();

            const url = `${this.baseURL}/contests/${contestId}`;
            const params = this.token ? { token: this.token } : {};

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
                    error.response?.data?.message || error.message || "Failed to fetch contest"
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

            const url = `${this.baseURL}/contests/${contestId}/play`;
            const params = this.token ? { token: this.token } : {};

            const response = await baseClient.post<PlayResult>(url, {}, { params });

            console.warn("✅ Play Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error playing contest:", error);
            if (baseClient.isAxiosError && baseClient.isAxiosError(error)) {
                console.error("❌ Response status:", error.response?.status);
                console.error("❌ Response data:", error.response?.data);
                throw new Error(
                    error.response?.data?.message || error.message || "Failed to play contest"
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
