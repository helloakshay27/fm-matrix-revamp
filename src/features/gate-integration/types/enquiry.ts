// Confirmed via real response: GET /enquiries.json
export interface EnquiryApiItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  society_name: string;
  message: string;
  gate_device: string;
}

export type EnquiriesResponse =
  | EnquiryApiItem[]
  | { enquiries: EnquiryApiItem[] }
  | { data: EnquiryApiItem[] };
