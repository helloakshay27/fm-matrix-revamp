import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

export interface SpinnerSegment {
  id: number;
  label: string;
  icon: string;
  color: string;
  active: boolean;
  discount_percentage?: number;
  voucher_prefix?: string;
}

export interface SpinnerContest {
  id: number;
  title: string;
  description: string;
  segments: SpinnerSegment[];
  terms_conditions: string;
  active: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface SpinResult {
  success: boolean;
  message: string;
  voucher: {
    voucher_code: string;
    discount_text: string;
    discount_percentage: number;
    segment_label: string;
    segment_id: number;
    valid_until: string;
    minimum_purchase: number;
    currency: string;
  };
  spin_id: number;
}

export interface SpinHistoryItem {
  id: number;
  user_id: number;
  contest_id: number;
  segment_id: number;
  voucher_code: string;
  discount_text: string;
  spun_at: string;
  used: boolean;
  used_at: string | null;
}

// Dummy data generator
const generateVoucherCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 11; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Dummy JSON data
const dummyContestData: SpinnerContest = {
  id: 1,
  title: "Spin to win",
  description: "Spin the wheel and try your luck on a special discount!",
  terms_conditions:
    "*Voucher is applied on a minimum purchase of AED987 and is valid until 31 jan 2026.\nScreenshot or save the code to use it later.",
  active: true,
  start_date: "2026-01-01T00:00:00Z",
  end_date: "2026-01-31T23:59:59Z",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  segments: [
    {
      id: 1,
      label: "Pastel 💜🔷",
      icon: "💜🔷",
      color: "#FFB3BA",
      active: true,
      discount_percentage: 5,
      voucher_prefix: "PASTEL",
    },
    {
      id: 2,
      label: "Cottagecore 🌻❤️",
      icon: "🌻❤️",
      color: "#FFDFBA",
      active: true,
      discount_percentage: 10,
      voucher_prefix: "COTTAGE",
    },
    {
      id: 3,
      label: "Fairycore 🧚🎀",
      icon: "🧚🎀",
      color: "#FFFFBA",
      active: true,
      discount_percentage: 15,
      voucher_prefix: "FAIRY",
    },
    {
      id: 4,
      label: "Spacecore 📺💫",
      icon: "📺💫",
      color: "#BAFFC9",
      active: true,
      discount_percentage: 20,
      voucher_prefix: "SPACE",
    },
    {
      id: 5,
      label: "Retro",
      icon: "",
      color: "#BAE1FF",
      active: true,
      discount_percentage: 25,
      voucher_prefix: "RETRO",
    },
    {
      id: 6,
      label: "Vintage",
      icon: "",
      color: "#E0BBE4",
      active: true,
      discount_percentage: 10,
      voucher_prefix: "VINTAGE",
    },
    {
      id: 7,
      label: "Girly/Softie",
      icon: "",
      color: "#FFDFD3",
      active: true,
      discount_percentage: 15,
      voucher_prefix: "GIRLY",
    },
    {
      id: 8,
      label: "VSCO 🌈",
      icon: "🌈",
      color: "#C7CEEA",
      active: true,
      discount_percentage: 5,
      voucher_prefix: "VSCO",
    },
    {
      id: 9,
      label: "Eco/Eco Girl 🌿",
      icon: "🌿",
      color: "#B5EAD7",
      active: true,
      discount_percentage: 20,
      voucher_prefix: "ECO",
    },
    {
      id: 10,
      label: "Boho",
      icon: "",
      color: "#FFD7BA",
      active: true,
      discount_percentage: 10,
      voucher_prefix: "BOHO",
    },
    {
      id: 11,
      label: "Goth",
      icon: "",
      color: "#C9C9C9",
      active: true,
      discount_percentage: 15,
      voucher_prefix: "GOTH",
    },
    {
      id: 12,
      label: "Beach Aesthetic 🏝️",
      icon: "🏝️",
      color: "#87CEEB",
      active: true,
      discount_percentage: 25,
      voucher_prefix: "BEACH",
    },
    {
      id: 13,
      label: "Y2K",
      icon: "",
      color: "#FFB3DE",
      active: true,
      discount_percentage: 20,
      voucher_prefix: "Y2K",
    },
    {
      id: 14,
      label: "Baddie 💋",
      icon: "💋",
      color: "#FF69B4",
      active: true,
      discount_percentage: 10,
      voucher_prefix: "BADDIE",
    },
    {
      id: 15,
      label: "Rock 'n roll 🎸",
      icon: "🎸",
      color: "#8B4513",
      active: true,
      discount_percentage: 5,
      voucher_prefix: "ROCK",
    },
    {
      id: 16,
      label: "Western 🤠",
      icon: "🤠",
      color: "#D2B48C",
      active: true,
      discount_percentage: 15,
      voucher_prefix: "WESTERN",
    },
    {
      id: 17,
      label: "Minimalist",
      icon: "",
      color: "#F5F5DC",
      active: true,
      discount_percentage: 20,
      voucher_prefix: "MINIMAL",
    },
    {
      id: 18,
      label: "Indie/Artsy-ist 🎨",
      icon: "🎨",
      color: "#DDA0DD",
      active: true,
      discount_percentage: 10,
      voucher_prefix: "INDIE",
    },
    {
      id: 19,
      label: "Cozy/Gaming 🎮",
      icon: "🎮",
      color: "#BC8F8F",
      active: true,
      discount_percentage: 25,
      voucher_prefix: "COZY",
    },
    {
      id: 20,
      label: "Royalcore 👑🦋",
      icon: "👑🦋",
      color: "#4682B4",
      active: true,
      discount_percentage: 15,
      voucher_prefix: "ROYAL",
    },
    {
      id: 21,
      label: "Fancy 🎉",
      icon: "🎉",
      color: "#FFD700",
      active: true,
      discount_percentage: 5,
      voucher_prefix: "FANCY",
    },
    {
      id: 22,
      label: "Kawaii 🥺🎀",
      icon: "🥺🎀",
      color: "#FFB6C1",
      active: true,
      discount_percentage: 20,
      voucher_prefix: "KAWAII",
    },
    {
      id: 23,
      label: "Angelcore ethereal 🕊️",
      icon: "🕊️",
      color: "#F0E68C",
      active: true,
      discount_percentage: 10,
      voucher_prefix: "ANGEL",
    },
    {
      id: 24,
      label: "Mystical 🔮✨",
      icon: "🔮✨",
      color: "#9370DB",
      active: true,
      discount_percentage: 15,
      voucher_prefix: "MYSTIC",
    },
    {
      id: 25,
      label: "Grunge 🎸⛓️",
      icon: "🎸⛓️",
      color: "#556B2F",
      active: true,
      discount_percentage: 25,
      voucher_prefix: "GRUNGE",
    },
    {
      id: 26,
      label: "Kidcore 🧸🌈",
      icon: "🧸🌈",
      color: "#FF6347",
      active: true,
      discount_percentage: 20,
      voucher_prefix: "KIDCORE",
    },
  ],
};

export const spinnerContestApi = {
  /**
   * Get all active spinner contests
   */
  async getActiveContests(): Promise<SpinnerContest[]> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/spinner_contests.json'), {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // return data.contests || [];

      // Return dummy data for now
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      return [dummyContestData];
    } catch (error) {
      console.error("Error fetching active contests:", error);
      throw new Error("Failed to fetch active contests");
    }
  },

  /**
   * Get a specific spinner contest by ID
   */
  async getContestById(contestId: number | string): Promise<SpinnerContest> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl(`/api/spinner_contests/${contestId}.json`), {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // return data.contest;

      // Return dummy data for now
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      return dummyContestData;
    } catch (error) {
      console.error("Error fetching contest:", error);
      throw new Error("Failed to fetch contest");
    }
  },

  /**
   * Spin the wheel and get a result
   */
  async spinWheel(contestId: number, segmentId: number): Promise<SpinResult> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/spinner_contests/spin.json'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     contest_id: contestId,
      //     segment_id: segmentId
      //   })
      // });
      // const data = await response.json();
      // return data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the segment
      const segment = dummyContestData.segments.find((s) => s.id === segmentId);
      if (!segment) {
        throw new Error("Invalid segment");
      }

      // Generate result
      const voucherCode = generateVoucherCode();
      const discountPercentage = segment.discount_percentage || 10;

      const result: SpinResult = {
        success: true,
        message: "Congratulations! You've won a voucher!",
        voucher: {
          voucher_code: voucherCode,
          discount_text: `Extra ${discountPercentage}% OFF`,
          discount_percentage: discountPercentage,
          segment_label: segment.label,
          segment_id: segmentId,
          valid_until: "2026-01-31T23:59:59Z",
          minimum_purchase: 987,
          currency: "AED",
        },
        spin_id: Math.floor(Math.random() * 10000),
      };

      return result;
    } catch (error) {
      console.error("Error spinning wheel:", error);
      throw new Error("Failed to spin wheel");
    }
  },

  /**
   * Get spin history for the current user
   */
  async getSpinHistory(contestId?: number): Promise<SpinHistoryItem[]> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const url = contestId
      //   ? getFullUrl(`/api/spinner_contests/${contestId}/history.json`)
      //   : getFullUrl('/api/spinner_contests/history.json');
      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // return data.history || [];

      // Return dummy data for now
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      const dummyHistory: SpinHistoryItem[] = [
        {
          id: 1,
          user_id: 1,
          contest_id: 1,
          segment_id: 5,
          voucher_code: "RETRO123ABC",
          discount_text: "Extra 25% OFF",
          spun_at: "2026-01-15T10:30:00Z",
          used: false,
          used_at: null,
        },
        {
          id: 2,
          user_id: 1,
          contest_id: 1,
          segment_id: 12,
          voucher_code: "BEACH456XYZ",
          discount_text: "Extra 25% OFF",
          spun_at: "2026-01-10T14:20:00Z",
          used: true,
          used_at: "2026-01-12T16:45:00Z",
        },
      ];

      return contestId
        ? dummyHistory.filter((h) => h.contest_id === contestId)
        : dummyHistory;
    } catch (error) {
      console.error("Error fetching spin history:", error);
      throw new Error("Failed to fetch spin history");
    }
  },

  /**
   * Mark a voucher as used
   */
  async useVoucher(
    spinId: number,
    voucherCode: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/spinner_contests/use_voucher.json'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     spin_id: spinId,
      //     voucher_code: voucherCode
      //   })
      // });
      // const data = await response.json();
      // return data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Voucher marked as used successfully",
      };
    } catch (error) {
      console.error("Error using voucher:", error);
      throw new Error("Failed to mark voucher as used");
    }
  },
};

export default spinnerContestApi;
