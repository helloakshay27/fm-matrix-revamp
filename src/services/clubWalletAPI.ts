import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

export interface ClubWalletListItem {
  user_id: number;
  user_name: string;
  wallet_id: string;
  user_type: string;
  masked_email: string;
  masked_mobile: string;
}

export interface ClubWalletListResponse {
  wallets: ClubWalletListItem[];
  total_pages: number;
  current_page: number;
  total_count: number;
}

export interface ClubWalletOtpRequestResponse {
  otp_sent: boolean;
  mobile_otp_sent: boolean;
  email_otp_sent: boolean;
}

export interface ClubWalletOtpVerifyResponse {
  otp_valid: boolean;
  verification_token: string;
  expires_in: number;
}

export interface ClubWalletTransaction {
  id: number;
  transaction_type: "credit" | "debit";
  remarks: string | null;
  created_at: string | null;
  amount: number | null;
  expires_at: string | null;
  is_expired: boolean;
  point_type: string | null;
  resource_type: string | null;
  resource_id: string | number | null;
}

export interface ClubWalletDetailResponse {
  wallet_id: number;
  user: { id: number; name: string; email: string; mobile: string };
  balance: number | null;
  total_credited: number | null;
  total_debited: number | null;
  wallet_transactions: ClubWalletTransaction[];
  total_pages: number;
  current_page: number;
}

const jsonHeaders = () => ({
  Authorization: getAuthHeader(),
  "Content-Type": "application/json",
});

export const fetchClubWallets = async (params: {
  search?: string;
  page?: number;
  per_page?: number;
  verificationToken: string;
}): Promise<ClubWalletListResponse> => {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.per_page ?? 20));
  query.set("verification_token", params.verificationToken);

  const response = await fetch(
    `${getFullUrl("/club_wallets")}?${query.toString()}`,
    { headers: jsonHeaders() }
  );
  if (response.status === 401) {
    // { code: 401, error: "OTP verification required or expired" }
    throw new Error("EXPIRED_TOKEN");
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch club wallets: ${response.status}`);
  }
  return response.json();
};

export const requestClubWalletOtp =
  async (): Promise<ClubWalletOtpRequestResponse> => {
    const response = await fetch(getFullUrl("/club_wallets/request_otp"), {
      method: "POST",
      headers: jsonHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to request OTP: ${response.status}`);
    }
    return response.json();
  };

export const verifyClubWalletOtp = async (params: {
  mobile_otp?: string;
  email_otp?: string;
}): Promise<ClubWalletOtpVerifyResponse> => {
  // Only one of mobile/email OTP is required - send whichever was actually filled.
  const body: { mobile_otp?: string; email_otp?: string } = {};
  if (params.mobile_otp) body.mobile_otp = params.mobile_otp;
  if (params.email_otp) body.email_otp = params.email_otp;

  const response = await fetch(getFullUrl("/club_wallets/verify_otp"), {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  });
  if (response.status === 422) {
    throw new Error("The codes you entered don't match. Please try again.");
  }
  if (!response.ok) {
    throw new Error(`Failed to verify OTP: ${response.status}`);
  }
  return response.json();
};

export const fetchClubWalletDetail = async (params: {
  walletId: string | number;
  page?: number;
  per_page?: number;
}): Promise<ClubWalletDetailResponse> => {
  // No verification_token required anymore - only the wallet list is OTP-gated.
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("per_page", String(params.per_page ?? 20));

  const response = await fetch(
    `${getFullUrl(`/club_wallets/${params.walletId}`)}?${query.toString()}`,
    { headers: jsonHeaders() }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch wallet detail: ${response.status}`);
  }
  return response.json();
};
