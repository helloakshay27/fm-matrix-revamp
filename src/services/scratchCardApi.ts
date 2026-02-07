import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

export interface RewardData {
  title: string;
  description: string;
  value: string;
  image_url?: string;
  product_link?: string;
}

export interface ScratchCardData {
  id: number;
  title: string;
  description: string;
  reward: RewardData;
  voucher_code: string;
  is_scratched: boolean;
  valid_from: string;
  valid_until: string;
  active: boolean;
  details: string[];
  redemption_steps: string[];
  terms_conditions: string[];
  created_at: string;
  updated_at: string;
}

export interface ScratchCardListItem {
  id: number;
  title: string;
  reward_title: string;
  is_scratched: boolean;
  valid_until: string;
  thumbnail_url?: string;
}

export interface ScratchResponse {
  success: boolean;
  message: string;
  scratch_card: ScratchCardData;
}

// Generate random voucher code
const generateVoucherCode = (length: number = 15): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Dummy data for scratch cards
const dummyScratchCards: ScratchCardData[] = [
  {
    id: 1,
    title: "Festive Surprise Voucher",
    description: "Scratch to reveal your special reward!",
    reward: {
      title: "₹1 Home Fragrance Kit",
      description: "Worth ₹499 | Festive Special For Homeowners",
      value: "₹499",
      image_url: "https://via.placeholder.com/400x300",
      product_link: "https://example.com/product",
    },
    voucher_code: generateVoucherCode(),
    is_scratched: false,
    valid_from: "2026-01-01T00:00:00Z",
    valid_until: "2026-03-24T23:59:59Z",
    active: true,
    details: [
      "Expires on 24 March 2026",
      "This reward can be used only once per flat.",
      "Applicable for booked customers only",
      "No minimum spend",
      "₹229 (paid by customer) Shipping Charges Applied.",
    ],
    redemption_steps: [
      "Tap Get Code",
      "Copy the voucher code",
      "Visit partner website via the link",
      "Select the product",
      "Apply the voucher code at checkout",
      "Pay applicable shipping charges",
      "Enjoy your festive gift at home 🎁",
    ],
    terms_conditions: [
      "Voucher valid till mentioned expiry date",
      "Can be redeemed only once per user",
      "Cannot be clubbed with other offers",
      "Non-refundable & non-exchangeable",
      "Company reserves right to modify or withdraw offer",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Winner Winner Chicken Dinner",
    description: "You've won a special prize!",
    reward: {
      title: "₹500 Restaurant Voucher",
      description: "Valid at select restaurants",
      value: "₹500",
      image_url: "https://via.placeholder.com/400x300",
    },
    voucher_code: generateVoucherCode(),
    is_scratched: false,
    valid_from: "2026-01-01T00:00:00Z",
    valid_until: "2026-02-28T23:59:59Z",
    active: true,
    details: [
      "Valid till 28 February 2026",
      "Minimum order value ₹1000",
      "Valid at participating restaurants only",
      "One voucher per bill",
    ],
    redemption_steps: [
      "Show voucher code at the restaurant",
      "Place your order",
      "Present code before billing",
      "Discount will be applied",
      "Pay remaining amount",
    ],
    terms_conditions: [
      "Valid at select locations only",
      "Cannot be combined with other offers",
      "Not valid on public holidays",
      "Subject to restaurant availability",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3,
    title: "Lucky Draw Winner",
    description: "Congratulations on your win!",
    reward: {
      title: "25% OFF on Fashion",
      description: "Up to ₹2000 discount",
      value: "25%",
      image_url: "https://via.placeholder.com/400x300",
    },
    voucher_code: generateVoucherCode(),
    is_scratched: false,
    valid_from: "2026-01-01T00:00:00Z",
    valid_until: "2026-03-31T23:59:59Z",
    active: true,
    details: [
      "Valid until 31 March 2026",
      "Maximum discount ₹2000",
      "Minimum purchase ₹5000",
      "Valid on fashion and accessories",
    ],
    redemption_steps: [
      "Visit our online store",
      "Add items to cart",
      "Apply coupon code at checkout",
      "Get instant discount",
      "Complete your purchase",
    ],
    terms_conditions: [
      "Valid on select categories only",
      "Cannot be used with sale items",
      "One time use per customer",
      "Non-transferable",
    ],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

export const scratchCardApi = {
  /**
   * Get all active scratch cards for the user
   */
  async getActiveScratchCards(): Promise<ScratchCardData[]> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/scratch_cards.json'), {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // return data.scratch_cards || [];

      // Return dummy data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyScratchCards.filter((card) => card.active);
    } catch (error) {
      console.error("Error fetching active scratch cards:", error);
      throw new Error("Failed to fetch scratch cards");
    }
  },

  /**
   * Get a specific scratch card by ID
   */
  async getScratchCardById(cardId: number | string): Promise<ScratchCardData> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl(`/api/scratch_cards/${cardId}.json`), {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // return data.scratch_card;

      // Return dummy data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      const card = dummyScratchCards.find((c) => c.id === Number(cardId));
      if (!card) {
        throw new Error("Scratch card not found");
      }
      return card;
    } catch (error) {
      console.error("Error fetching scratch card:", error);
      throw new Error("Failed to fetch scratch card");
    }
  },

  /**
   * Mark a scratch card as scratched
   */
  async scratchCard(cardId: number): Promise<ScratchResponse> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/scratch_cards/scratch.json'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ card_id: cardId })
      // });
      // const data = await response.json();
      // return data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const card = dummyScratchCards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error("Scratch card not found");
      }

      // Update scratched status
      card.is_scratched = true;

      return {
        success: true,
        message: "Scratch card revealed successfully!",
        scratch_card: card,
      };
    } catch (error) {
      console.error("Error scratching card:", error);
      throw new Error("Failed to scratch card");
    }
  },

  /**
   * Get user's scratch card history
   */
  async getScratchCardHistory(): Promise<ScratchCardListItem[]> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/scratch_cards/history.json'), {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();
      // return data.history || [];

      // Return dummy data for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      return dummyScratchCards.map((card) => ({
        id: card.id,
        title: card.title,
        reward_title: card.reward.title,
        is_scratched: card.is_scratched,
        valid_until: card.valid_until,
        thumbnail_url: card.reward.image_url,
      }));
    } catch (error) {
      console.error("Error fetching scratch card history:", error);
      throw new Error("Failed to fetch history");
    }
  },

  /**
   * Redeem a voucher code
   */
  async redeemVoucher(
    cardId: number,
    voucherCode: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(getFullUrl('/api/scratch_cards/redeem.json'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     card_id: cardId,
      //     voucher_code: voucherCode
      //   })
      // });
      // const data = await response.json();
      // return data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Voucher redeemed successfully!",
      };
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      throw new Error("Failed to redeem voucher");
    }
  },
};

export default scratchCardApi;
