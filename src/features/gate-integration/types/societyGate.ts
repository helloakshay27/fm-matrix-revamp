// Confirmed via real response from GET /admin/society_gates.json.
export interface SocietyGateRef {
  id: number | null;
  name: string | null;
}

export interface SocietyGateApiItem {
  id: number;
  society_id: number | null;
  gate_name: string;
  gate_device: string;
  active: number; // 1/0, not a real boolean
  approve: number;
  approved_by: number | null;
  society_block_id: number | null;
  resource_type: string;
  resource_id: number;
  user_id: number | null;
  building_id: number | null;
  created_at: string;
  updated_at: string;
  resource: { type: string; id: number; name: string } | null;
  society: SocietyGateRef | null;
  user: SocietyGateRef | null;
  created_by: SocietyGateRef | null;
  society_block: SocietyGateRef | null;
  building: SocietyGateRef | null;
  qr_image_url: string | null;
}

export interface SocietyGatesPagination {
  current_page: number;
  total_entries: number;
  total_pages: number;
}

export interface SocietyGatesResponse {
  quikgate_society_gates: SocietyGateApiItem[];
  quikgate_pagination: SocietyGatesPagination;
}
