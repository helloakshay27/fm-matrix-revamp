import { gateIntegrationClient } from "./gateIntegrationClient";
import type { EnquiriesResponse, EnquiryApiItem } from "../types/enquiry";

// Confirmed via curl: GET /enquiries.json
// Response body wasn't included in the sample, so this defensively accepts
// a bare array or a { enquiries | data: [...] } wrapper.
export const fetchEnquiries = async (): Promise<EnquiryApiItem[]> => {
  const { data } = await gateIntegrationClient.get<EnquiriesResponse>("/enquiries.json");

  if (Array.isArray(data)) return data;
  if ("enquiries" in data) return data.enquiries;
  if ("data" in data) return data.data;
  return [];
};
