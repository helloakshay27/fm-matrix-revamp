# Lock Account Bills — Feature Spec

Club Management > **Lock Account Bills**: a List page and a Detail page over `LockAccountBill`
records that are linked to a **Facility Booking** or a **Club Member Allocation**
(`resource_type`/`resource_id` present), each with a **Download Invoice** action.

- List page: `/club-management/lock-account-bills`
- Detail page: `/club-management/lock-account-bills/details/:id`

## Download Invoice endpoints

| Resource type | Endpoint | id used |
|---|---|---|
| Facility Booking | `GET /pms/admin/facility_bookings/:id/invoice.json` | `resource_id` (the FacilityBooking's own id) |
| Club Member Allocation | `GET /club_member_allocations/show_pdf?lock_account_bill_id=:id` | the LockAccountBill's own `id` |

Both return a raw `application/pdf` blob (not JSON), which the frontend turns into a
downloadable file via `downloadLockAccountBillInvoice()` in
`src/pages/ClubManagement/lockAccountBillInvoiceUtils.ts`.

## Backend changes made to support this

- `app/views/lock_account_bills/_lock_account_bill.json.jbuilder` — now also exposes
  `resource_type`, `resource_id`, `balance_amount`, `billed_to`, `billed_to_type` (already on the
  model/table, previously not serialized).
- `LockAccountBillsController#index` — sets an `X-Total-Count` response header for pagination.
- `config/initializers/cors.rb` — exposes `X-Total-Count` so browser JS can read it.
- No new routes were needed — `GET /lock_account_bills.json` (ransack-filterable, supports
  `q[resource_type_in][]=...`) and `GET /lock_account_bills/:id.json?show=true` (rich detail via
  the same jbuilder partial) already existed.

---

## List page

### User Story

As a Club Management admin/finance user, I want to see a list of all Lock Account Bills raised
against Facility Bookings and Club Member Allocations, so that I can review, filter, and download
their invoices without opening each Facility Booking or Membership record individually.

### Acceptance Criteria

1. Navigating to Club Management > Lock Account Bills shows a paginated table of `LockAccountBill`
   records whose `resource_type` is either `FacilityBooking` or `ClubMemberAllocation` only — bills
   with no resource, or any other resource type, are excluded.
2. Each row shows: Bill Number, Resource Type, Bill Date, Due Date, Total Amount, Balance Amount,
   Status.
3. The Resource Type filter narrows the table to just "Facility Booking" or just "Club Member
   Allocation"; "All Resource Types" shows both.
4. The Status filter narrows the table to bills matching the selected status.
5. Typing in the search box (debounced) filters the table to bills whose bill number matches.
6. Clicking a row's Download action fetches the correct invoice PDF (per the endpoint table above,
   branching on that row's `resource_type`) and downloads it as `<bill_number>.pdf`.
7. A download in progress shows a loading indicator/toast; success and failure are both
   communicated via toast.
8. Clicking the View action (or the row) navigates to that bill's Detail page.
9. When there are more results than fit on one page, pagination controls (page number + per-page)
   are shown and work correctly.
10. If the list API call fails, an error toast is shown and the table falls back to its empty
    state instead of crashing.

---

## Detail page

### User Story

As a Club Management admin/finance user, I want to open a single Lock Account Bill and see its
full details — amounts, linked resource, line items, and attachments — so that I can verify the
bill before downloading or sharing its invoice.

### Acceptance Criteria

1. Navigating to a bill's Detail page fetches and displays: bill number, status, resource type &
   resource id, bill date, due date, order number, subject, vendor.
2. Sub Total, Discount, Total Amount, and Balance Amount are shown, formatted as currency.
3. If the bill has item details (charges), each line item's name, quantity, rate, and amount are
   listed in a table; if there are none, an empty-state message is shown instead.
4. If the bill has attachments, each is listed with its file name and, when a URL is present, a way
   to open/download it directly; if there are none, an empty-state message is shown.
5. Clicking Download Invoice runs the same resource-type-aware download logic as the List page,
   with loading/success/error toasts.
6. If the bill id in the URL doesn't exist or the fetch fails, a "not found" state is shown with a
   way to go back to the list.
7. Clicking the back arrow returns to the Lock Account Bills list page.

## Non-functional notes

- Both pages reuse the existing Club Management auth context (`baseUrl` / `token` /
  `lock_account_id` in `localStorage`) — no new login/session flow.
- No manual create/edit/delete on this page — bills originate from the Facility Booking / Club
  Member Allocation flows; this module is read + download only.
