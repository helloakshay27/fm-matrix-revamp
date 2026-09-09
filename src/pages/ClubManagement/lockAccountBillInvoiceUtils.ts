import axios from "axios";

// Shape returned by GET /lock_account_bills.json and GET /lock_account_bills/:id.json?show=true
// (see app/views/lock_account_bills/_lock_account_bill.json.jbuilder in the API repo) — only the
// fields this feature actually reads are declared here, the API returns many more.
export interface LockAccountBillRecord {
  id: number;
  bill_number?: string | null;
  status?: string | null;
  bill_date?: string | null;
  due_date?: string | null;
  total_amount?: number | null;
  balance_amount?: number | null;
  charged_amount?: number | null;
  resource_type?: string | null;
  resource_id?: number | null;
  // The FacilityBooking/ClubMemberAllocation resource_type+resource_id link is a manual pair,
  // not a real DB association — the referenced row can be deleted after the bill was raised,
  // leaving the id/type "dangling". null when resource_type/resource_id aren't set at all.
  resource_exists?: boolean | null;
  // The linked FacilityBooking's own current_status (Confirmed / Cancelled / Pending) — distinct
  // from this bill's own `status`. null for non-FacilityBooking bills or a deleted booking.
  facility_booking_status?: string | null;
  [key: string]: unknown;
}

// The three resource types shown on the Lock Account Bills list: two real linked resources
// (see app/pdfs/facility_booking_invoice_pdf.rb and app/pdfs/club_allocation_invoice_pdf.rb),
// plus "Other" — a manually-created Invoice (bill_bookings) or Credit Note with no picked
// facility/membership/event line item, so resource_id is always blank for these.
export const LOCK_ACCOUNT_BILL_RESOURCE_TYPES = ["FacilityBooking", "ClubMemberAllocation", "Other"] as const;
export type LockAccountBillResourceType = (typeof LOCK_ACCOUNT_BILL_RESOURCE_TYPES)[number];

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  FacilityBooking: "Facility Booking",
  ClubMemberAllocation: "Club Member Allocation",
  Other: "Other (Invoice)",
};

// Facility Booking invoices are generated off the booking's own id via a dedicated endpoint;
// ClubMemberAllocation goes through the club_member_allocations "show_pdf" endpoint, keyed by
// the LockAccountBill's own id; "Other" bills are plain bill_booking invoices, which have their
// own pdf endpoint keyed by the bill's own id (not a resource_id — there isn't one).
export const getLockAccountBillInvoiceUrl = (baseUrl: string, bill: LockAccountBillRecord): string => {
  if (bill.resource_type === "FacilityBooking" && bill.resource_id) {
    return `https://${baseUrl}/pms/admin/facility_bookings/${bill.resource_id}/invoice.json`;
  }
  if (bill.resource_type === "Other") {
    const lockAccountId = localStorage.getItem("lock_account_id");
    return `https://${baseUrl}/lock_accounts/${lockAccountId}/bill_bookings/${bill.id}/pdf`;
  }
  return `https://${baseUrl}/club_member_allocations/show_pdf?lock_account_bill_id=${bill.id}`;
};

export const downloadLockAccountBillInvoice = async (bill: LockAccountBillRecord): Promise<void> => {
  if (bill.resource_exists === false) {
    const label = (bill.resource_type && RESOURCE_TYPE_LABELS[bill.resource_type]) || bill.resource_type;
    throw new Error(`${label || "Linked resource"} #${bill.resource_id} was deleted — invoice can't be generated`);
  }

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  if (!baseUrl) {
    throw new Error("Missing base URL — please log in again");
  }

  const url = getLockAccountBillInvoiceUrl(baseUrl, bill);
  const response = await axios.get(url, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${bill.bill_number || `lock-account-bill-${bill.id}`}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export interface MarkPaymentInput {
  paymentMode: string;
  paymentMethod: string;
  pgTransactionId?: string;
  // "YYYY-MM" (HTML <input type="month"> value) — backdates the minted bill number to that
  // month instead of whenever the payment happens to be recorded. Omit to use the current month.
  billingMonth?: string;
  sendMail: boolean;
}

// Facility Booking and Club Member Allocation bills are marked paid through two entirely
// separate endpoints (different controllers, different payload shapes — see the curl samples
// this feature was built from), each of which mints the bill_number as a side effect once the
// bill's status flips to paid.
export const markLockAccountBillPayment = async (
  bill: LockAccountBillRecord,
  input: MarkPaymentInput
): Promise<void> => {
  if ((bill.total_amount ?? 0) <= 0) {
    throw new Error("This bill has no billable amount — nothing to mark as paid");
  }
  if (bill.resource_exists === false) {
    const label = (bill.resource_type && RESOURCE_TYPE_LABELS[bill.resource_type]) || bill.resource_type;
    throw new Error(`${label || "Linked resource"} #${bill.resource_id} was deleted — can't record payment`);
  }
  if (!bill.resource_id || !bill.resource_type) {
    throw new Error("This bill isn't linked to a Facility Booking or Club Member Allocation");
  }

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  if (!baseUrl) {
    throw new Error("Missing base URL — please log in again");
  }
  const headers = { Authorization: token ? `Bearer ${token}` : undefined };

  if (bill.resource_type === "FacilityBooking") {
    await axios.post(
      `https://${baseUrl}/pms/admin/facility_bookings/${bill.resource_id}/payment`,
      {
        lock_payment: {
          payment_mode: input.paymentMode,
          payment_method: input.paymentMethod,
          pg_transaction_id: input.pgTransactionId || "",
        },
        billing_month: input.billingMonth || undefined,
        send_mail: input.sendMail,
      },
      { headers }
    );
    return;
  }

  await axios.post(
    `https://${baseUrl}/club_member_allocations/${bill.resource_id}/payment.json`,
    {
      bill_id: bill.id,
      payment: {
        payment_mode: input.paymentMode,
        payment_method: input.paymentMethod,
        pg_transaction_id: input.pgTransactionId || "",
      },
      billing_month: input.billingMonth || undefined,
      send_mail: input.sendMail,
    },
    { headers }
  );
};
