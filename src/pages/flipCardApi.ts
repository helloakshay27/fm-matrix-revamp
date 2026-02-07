import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

export interface FlipCardReward {
  title: string;
  value: string;
  description: string;
  voucher_code: string;
}

export interface FlipCardData {
  id: number;
  title: string;
  description: string;
  card_count: number;
  cards: FlipCard[];
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface FlipCard {
  id: number;
  position: number;
  is_flipped: boolean;
  reward: FlipCardReward;
  details: string[];
  terms_conditions: string[];
}

export interface FlipResponse {
  success: boolean;
  message: string;
  card: FlipCard;
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

// Dummy data for flip cards
const dummyFlipCardData: FlipCardData = {
  id: 1,
  title: "Move In Celebration",
  description: "Tap on the card to reveal the rewards",
  card_count: 3,
  active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  cards: [
    {
      id: 1,
      position: 1,
      is_flipped: false,
      reward: {
        title: "Shopping Voucher",
        value: "₹500",
        description: "Use this voucher for your next purchase",
        voucher_code: "SHOP2988NEW",
      },
      details: [
        "Valid till 31st March, 2026",
        "This reward can be used only once per flat.",
        "Applicable for new residents only",
        "₹2000 minimum spend",
        "No additional charges apply",
      ],
      terms_conditions: [
        "Voucher valid till mentioned expiry date",
        "Can be redeemed only once per user",
        "Cannot be clubbed with other offers",
        "Non-refundable & non-exchangeable",
        "Company reserves right to modify or withdraw offer",
        "Applicable at select partner stores only",
        "ID proof required at the time of redemption",
      ],
    },
    {
      id: 2,
      position: 2,
      is_flipped: false,
      reward: {
        title: "Discount Voucher",
        value: "₹300",
        description: "Save on your shopping",
        voucher_code: generateVoucherCode(),
      },
      details: [
        "Valid till 31st March, 2026",
        "One time use only",
        "Applicable for new residents",
        "₹1500 minimum spend",
        "No delivery charges",
      ],
      terms_conditions: [
        "Valid till expiry date",
        "Single use per customer",
        "Cannot combine with other offers",
        "Non-transferable",
        "Subject to availability",
      ],
    },
    {
      id: 3,
      position: 3,
      is_flipped: false,
      reward: {
        title: "Cashback Offer",
        value: "₹200",
        description: "Get cashback on your purchase",
        voucher_code: generateVoucherCode(),
      },
      details: [
        "Valid till 31st March, 2026",
        "Cashback credited in 48 hours",
        "Minimum purchase ₹1000",
        "New users only",
        "One time offer",
      ],
      terms_conditions: [
        "Cashback validity: 90 days",
        "Cannot be withdrawn as cash",
        "Subject to terms and conditions",
        "Offer may be modified or withdrawn",
      ],
    },
  ],
};

export const flipCardApi = {
  /**
   * Get flip card game data
   */
  async getFlipCardGame(gameId?: number | string): Promise<FlipCardData> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(
      //   getFullUrl(gameId ? `/api/flip_cards/${gameId}.json` : '/api/flip_cards.json'),
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Authorization': getAuthHeader(),
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      // const data = await response.json();
      // return data.flip_card_game;

      // Return dummy data
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyFlipCardData;
    } catch (error) {
      console.error("Error fetching flip card game:", error);
      throw new Error("Failed to fetch flip card game");
    }
  },

  /**
   * Flip a specific card
   */
  async flipCard(gameId: number, cardId: number): Promise<FlipResponse> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(getFullUrl('/api/flip_cards/flip.json'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     game_id: gameId,
      //     card_id: cardId
      //   })
      // });
      // const data = await response.json();
      // return data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const card = dummyFlipCardData.cards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error("Card not found");
      }

      // Mark as flipped
      card.is_flipped = true;

      return {
        success: true,
        message: "Card flipped successfully!",
        card: card,
      };
    } catch (error) {
      console.error("Error flipping card:", error);
      throw new Error("Failed to flip card");
    }
  },

  /**
   * Get specific card details
   */
  async getCardDetails(gameId: number, cardId: number): Promise<FlipCard> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(
      //   getFullUrl(`/api/flip_cards/${gameId}/cards/${cardId}.json`),
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Authorization': getAuthHeader(),
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      // const data = await response.json();
      // return data.card;

      // Return dummy data
      await new Promise((resolve) => setTimeout(resolve, 300));

      const card = dummyFlipCardData.cards.find((c) => c.id === cardId);
      if (!card) {
        throw new Error("Card not found");
      }

      return card;
    } catch (error) {
      console.error("Error fetching card details:", error);
      throw new Error("Failed to fetch card details");
    }
  },
};

export default flipCardApi;
