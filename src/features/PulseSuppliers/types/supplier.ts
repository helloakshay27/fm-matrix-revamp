export interface SupplierFinancialSummary {
  po_total_amount: number;
  po_paid_amount: number;
  po_outstanding_amount: number;
  grn_total_amount: number;
  grn_paid_amount: number;
  grn_outstanding_amount: number;
  wo_total_amount: number;
  wo_paid_amount: number;
  wo_outstanding_amount: number;
  wo_invoice_total_amount: number;
  wo_invoice_paid_amount: number;
  wo_invoice_outstanding_amount: number;
  bills_total_amount: number;
  bills_paid_amount: number;
  bills_outstanding_amount: number;
  total_amount_all: number;
  total_paid_amount_all: number;
  total_outstanding_amount_all: number;
}

export interface SupplierApprovalInfo {
  applicable_approval_present: boolean;
  all_level_approved: boolean;
}

// GET /pms/suppliers.json — confirmed via curl (2026-08-28).
export interface Supplier {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
  gstin_number: string | null;
  pan_number: string | null;
  address: string | null;
  address2: string | null;
  mobile1: string | null;
  mobile2: string | null;
  secondary_phone: string | null;
  secondary_emails: string | null;
  website_url: string | null;
  country: string | null;
  country_key: string | null;
  state: string | null;
  city: string | null;
  district: string | null;
  pincode: string | null;
  society_id: number | null;
  account_name: string | null;
  account_number: string | null;
  bank_branch_name: string | null;
  ifsc_code: string | null;
  service_description: string | null;
  signed_on_contract: boolean;
  category: string | null;
  active: boolean;
  ext_business_partner_code: string | null;
  purchase_organization_code: string | null;
  snag_project_id: number | null;
  re_kyc_date: string | null;
  re_kyc_in: string | null;
  cin_no: string | null;
  supplier_type: string[];
  average_rating: number | null;
  audit_scores: unknown[];
  attachments: unknown[];
  tan_attachments: unknown[];
  pan_attachments: unknown[];
  gst_attachments: unknown[];
  kyc_attachments: unknown[];
  other_attachments: unknown[];
  compliance_attachments: unknown[];
  cancle_checque: unknown[];
  financial_summary: SupplierFinancialSummary;
  approval_info: SupplierApprovalInfo;
}

export interface SuppliersPagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface SuppliersResponse {
  pms_suppliers: Supplier[];
  pagination: SuppliersPagination;
}

export interface SuppliersQueryParams {
  page?: number;
  per_page?: number;
}

// POST /pms/suppliers.json — request confirmed via curl.
export interface CreateSupplierPayload {
  pms_supplier: {
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
    mobile1: string;
    mobile2?: string;
    gstin_number?: string;
    pan_number?: string;
    address?: string;
    address2?: string;
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
    category: string;
    active: boolean;
    supplier_type: string[];
  };
}

// Confirmed via actual response (2026-08-28) — returns the created supplier
// flat, with no `pms_supplier` wrapper (same shape as the detail endpoint).
export type CreateSupplierResponse = Supplier;

// PUT /pms/suppliers/:id.json — unconfirmed; assumed to accept the same
// `{ pms_supplier: {...} }` body as create and return the same flat shape.
export type UpdateSupplierPayload = CreateSupplierPayload;

export type UpdateSupplierResponse = Supplier;

// The subset of pms_supplier fields actually collected by the Add/Edit form —
// supplier_type is hardcoded to ["AMC"] by the pages, not user-editable, and
// active is only toggled from the list page's Status column.
export type SupplierFormFields = Omit<
  CreateSupplierPayload["pms_supplier"],
  "supplier_type" | "active"
>;
