export default function GateFeatureListContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle no-grid" cellSpacing={0} cellPadding={0}>
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr" />
              <th
                id="136088962C0"
                style={{ width: 34 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="136088962C1"
                style={{ width: 181 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="136088962C2"
                style={{ width: 195 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="136088962C3"
                style={{ width: 536 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="136088962C4"
                style={{ width: 97 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="136088962C5"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                F
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 36 }}>
              <th
                id="136088962R0"
                style={{ height: 36 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 36 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan={6}>
                Gate Management Platform - Complete Feature List
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="136088962R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan={6}>
                Star USP features are highlighted in blue across all columns.
                All other features on alternating white/light background.
              </td>
            </tr>
            <tr style={{ height: 52 }}>
              <th
                id="136088962R2"
                style={{ height: 52 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 52 }}>
                  3
                </div>
              </th>
              <td className="s2">#</td>
              <td className="s2">Module / Section</td>
              <td className="s2">Feature Name</td>
              <td className="s2">How It Currently Works</td>
              <td className="s2">USP</td>
              <td className="s2">User Type</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R3"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  4
                </div>
              </th>
              <td className="s3">1</td>
              <td className="s3">Visitor Control &amp; Exceptions</td>
              <td className="s3">* Rejected Entry Log</td>
              <td className="s3">
                When a visitor is denied entry, the guard selects 'Rejected
                Entry' from the waiting queue. The system captures the visitor's
                name, mobile number, category (guest, vendor, delivery, etc.),
                vehicle number if present, and the reason for rejection. The
                rejecting guard's user ID, date, and timestamp are stored
                automatically. A ticket can be raised from this log for
                follow-up. Security managers can filter rejected entries by
                category, date range, and rejecting officer for pattern
                analysis.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R4"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  5
                </div>
              </th>
              <td className="s3">2</td>
              <td className="s3">Visitor Control &amp; Exceptions</td>
              <td className="s3">* Overstay Management</td>
              <td className="s3">
                The system tracks the approved duration for each visitor entry.
                When a visitor's actual time inside exceeds the approved period,
                the system automatically creates an overstay record showing the
                allowed time, actual time, and delta (overstay duration). The
                guard sees an overstay flag in the active entry list and can
                trigger a mark-out action or escalate. Overstay records are
                retained in full history with all original approval data intact.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R5"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  6
                </div>
              </th>
              <td className="s3">3</td>
              <td className="s3">Visitor Control &amp; Exceptions</td>
              <td className="s3">* Notification Queue - Approved Entries</td>
              <td className="s3">
                This screen shows all visitors who have received host approval
                and are cleared to enter. Each row displays the source of
                approval, visitor details, vehicle number if applicable,
                approval and notification timestamps, and a one-tap mark-in
                button. Guards can also call the visitor's number directly from
                this queue. The screen auto-refreshes when new approvals arrive.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R6"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  7
                </div>
              </th>
              <td className="s3">4</td>
              <td className="s3">Visitor Control &amp; Exceptions</td>
              <td className="s3">* Waiting Queue</td>
              <td className="s3">
                Visitors who arrive without pre-approval appear in the waiting
                queue. The guard can see the visitor's details and send a
                notification to the relevant host. The host can respond in real
                time with Approve, Reject, or Partially Approve. Guards also
                have the ability to allow entry or deny entry manually from this
                screen when a decision is needed urgently.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Host, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R7"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  8
                </div>
              </th>
              <td className="s4">5</td>
              <td className="s4">Visitor Control &amp; Exceptions</td>
              <td className="s4">Approval Status Views</td>
              <td className="s4">
                The system provides split list views for Approved, Rejected, and
                History states so guards can quickly navigate between active
                work and historical records without mixing views. Each status
                view has its own filter controls for date, category, and host.
              </td>
              <td className="s4" />
              <td className="s4">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R8"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  9
                </div>
              </th>
              <td className="s5">6</td>
              <td className="s5">Visitor Control &amp; Exceptions</td>
              <td className="s5">Contact Actions</td>
              <td className="s5">
                From any visitor queue or history screen, the guard can tap to
                call the visitor's registered mobile number or share visitor
                details with a host. This reduces the need to manually copy
                numbers or switch between apps during high-traffic gate periods.
              </td>
              <td className="s5" />
              <td className="s5">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R9"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  10
                </div>
              </th>
              <td className="s3">7</td>
              <td className="s3">Visitor Control &amp; Exceptions</td>
              <td className="s3">* Validity Tracking</td>
              <td className="s3">
                Vendor and service-provider entries are assigned a validity
                window (Valid From and Valid Till). The system enforces this
                window at entry validation and flags any attempt to enter
                outside the permitted period. Validity records are visible to
                both the guard and the facility admin.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Admin, Vendor</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R10"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  11
                </div>
              </th>
              <td className="s3">8</td>
              <td className="s3">Delivery &amp; Courier Management</td>
              <td className="s3">* Delivery Entry Creation</td>
              <td className="s3">
                The guard captures the delivery person's mobile number, name,
                and photo at the gate. The service provider (BigBasket, Blinkit,
                Zomato, Swiggy, D-Mart, or other) is selected from a
                preconfigured master list. This creates an audit-ready record
                before any approval is triggered, ensuring no delivery enters
                without a logged entry.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R11"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  12
                </div>
              </th>
              <td className="s4">9</td>
              <td className="s4">Delivery &amp; Courier Management</td>
              <td className="s4">Delivery Recipient Selection</td>
              <td className="s4">
                The guard selects the target tower and flat from the property
                master. The system shows which members are linked to that flat
                and eligible to receive the notification. This ensures the right
                host receives the delivery alert rather than a generic
                building-level notification.
              </td>
              <td className="s4" />
              <td className="s4">Security Guard, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R12"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  13
                </div>
              </th>
              <td className="s3">10</td>
              <td className="s3">Delivery &amp; Courier Management</td>
              <td className="s3">* Host Approval Workflow</td>
              <td className="s3">
                After capturing delivery details, the guard either sends the
                request for host approval (which triggers a push notification
                and in-app approval request to the resident) or skips approval
                for predefined delivery types. The host receives a notification
                with delivery person details and can approve or reject from the
                mobile app in real time.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident, Host</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R13"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  14
                </div>
              </th>
              <td className="s3">11</td>
              <td className="s3">Delivery &amp; Courier Management</td>
              <td className="s3">* Goods-in Gate Pass</td>
              <td className="s3">
                For delivery entries that require a formal pass, the system
                generates a digital goods-in gate pass that the delivery person
                can present at secondary checkpoints or during parcel handover.
                This pass is linked to the original entry record.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Delivery Person</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R14"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  15
                </div>
              </th>
              <td className="s5">12</td>
              <td className="s5">Delivery &amp; Courier Management</td>
              <td className="s5">Delivery History</td>
              <td className="s5">
                All delivery-related entries, approvals, rejections, and
                handover events are stored in a searchable delivery log. Guards
                and facility admins can filter by service provider, flat, host,
                or date range. This log is exportable for vendor reconciliation
                and compliance audits.
              </td>
              <td className="s5" />
              <td className="s5">Facility Admin, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R15"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  16
                </div>
              </th>
              <td className="s4">13</td>
              <td className="s4">Guest Management</td>
              <td className="s4">Guest Entry Creation</td>
              <td className="s4">
                The guard captures the guest's name, mobile number, and photo
                before initiating any approval workflow. Photo capture creates a
                visual identity record that is stored alongside the entry log,
                enabling later identification during incident investigations.
              </td>
              <td className="s4" />
              <td className="s4">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R16"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  17
                </div>
              </th>
              <td className="s5">14</td>
              <td className="s5">Guest Management</td>
              <td className="s5">Guest Allocation</td>
              <td className="s5">
                The guard maps the guest to the receiving flat, wing, and host.
                The system validates that the selected host is an active
                registered resident of the specified flat. This prevents
                mismapping and ensures the correct host receives the approval
                notification.
              </td>
              <td className="s5" />
              <td className="s5">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R17"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  18
                </div>
              </th>
              <td className="s3">15</td>
              <td className="s3">Guest Management</td>
              <td className="s3">* Guest Approval Workflow</td>
              <td className="s3">
                A push notification is sent to the host with the guest's name,
                photo, and entry time. The host can approve, reject, or request
                additional information. On approval, the system generates a
                digital gate pass and marks the guest as cleared for entry. The
                guard sees the approval update in real time on the waiting queue
                screen.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident/Host</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R18"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  19
                </div>
              </th>
              <td className="s5">16</td>
              <td className="s5">Guest Management</td>
              <td className="s5">Guest Activity - Mark In / Call</td>
              <td className="s5">
                Once approved, the guard uses the mark-in action to record the
                guest's actual entry time. The guard can also call the guest
                from the same screen if the guest is delayed or needs
                directions. The mark-in timestamp is captured against the
                guard's user ID for accountability.
              </td>
              <td className="s5" />
              <td className="s5">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R19"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  20
                </div>
              </th>
              <td className="s4">17</td>
              <td className="s4">Guest Management</td>
              <td className="s4">Guest History</td>
              <td className="s4">
                A full log of past guest entries is searchable by guest name,
                mobile number, flat, host, date, and entry status. The history
                screen shows approved, rejected, and overstay entries. Hosts can
                review their own guest history from the resident app.
              </td>
              <td className="s4" />
              <td className="s4">Facility Admin, Resident/Host</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R20"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  21
                </div>
              </th>
              <td className="s3">18</td>
              <td className="s3">
                Other Visitor &amp; Service Provider Management
              </td>
              <td className="s3">* Visitor Type Classification</td>
              <td className="s3">
                Service provider visitors are classified into specific
                categories: Home Repair, Applicant Repair, Internet Repair, Car
                Washer, Tutor, Carpenter, Cab Driver, Gardener, Pest Control,
                Beautician, Repair Maintenance, or Other Vendors. This
                classification drives policy controls, such as which types
                require host approval and which can enter with guard-level
                clearance, and is used for analytics and reporting.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R21"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  22
                </div>
              </th>
              <td className="s3">19</td>
              <td className="s3">
                Other Visitor &amp; Service Provider Management
              </td>
              <td className="s3">* Recurring Visit Flag</td>
              <td className="s3">
                The guard can mark a service provider or domestic visitor as
                'Frequently Visiting' during entry creation. On subsequent
                visits, the system surfaces the pre-filled profile for faster
                processing. The recurring flag also affects the approval
                routing, allowing pre-approved recurring visitors to enter with
                a lighter workflow.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R22"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  23
                </div>
              </th>
              <td className="s3">20</td>
              <td className="s3">
                Other Visitor &amp; Service Provider Management
              </td>
              <td className="s3">* Domestic Help Handling</td>
              <td className="s3">
                Maids, drivers, cooks, and other household helpers are handled
                through a dedicated domestic visitor flow. This flow supports
                recurring access, validity-based entry controls, and host-linked
                approval. Daily help entries are tracked separately from general
                visitors in attendance and history reports.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R23"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  24
                </div>
              </th>
              <td className="s3">21</td>
              <td className="s3">
                Other Visitor &amp; Service Provider Management
              </td>
              <td className="s3">* Favorite Visitor Handling</td>
              <td className="s3">
                Residents or admins can mark specific service providers or
                visitors as favorites. Favorited visitors appear in a shortlist
                during entry creation, reducing the need to re-enter details on
                repeat visits. This feature is especially useful for recurring
                vendors, regular maintenance staff, and known cab drivers.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Resident, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R24"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  25
                </div>
              </th>
              <td className="s3">22</td>
              <td className="s3">Expected Visitor Management</td>
              <td className="s3">* Pre-Approved Visitor Register</td>
              <td className="s3">
                The expected visitor section shows all pre-registered entries
                separated into three tabs: Visitor, Delivery, and Cab. This
                separation allows guards to quickly identify the nature of the
                incoming movement and apply the relevant validation flow without
                navigating through a combined list.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R25"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  26
                </div>
              </th>
              <td className="s3">23</td>
              <td className="s3">Expected Visitor Management</td>
              <td className="s3">* Visitor Tab</td>
              <td className="s3">
                Pre-approved guest entries appear in the Visitor tab with
                expected arrival time and mark-in button. The guard can track
                the expected time out, call the guest if they are overdue, and
                mark the guest in when they arrive. Entries that expire without
                a mark-in are automatically flagged.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R26"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  27
                </div>
              </th>
              <td className="s3">24</td>
              <td className="s3">Expected Visitor Management</td>
              <td className="s3">* Delivery Tab</td>
              <td className="s3">
                Pre-approved delivery entries show the company name, delivery
                purpose, and expected arrival time. The guard can confirm the
                delivery against the pre-approval record and complete the entry
                in two taps. This eliminates re-notification for deliveries the
                host already approved in advance.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R27"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  28
                </div>
              </th>
              <td className="s3">25</td>
              <td className="s3">Expected Visitor Management</td>
              <td className="s3">* Cab Tab</td>
              <td className="s3">
                Pre-approved cab movements show the vehicle number, host name,
                company, flat, and expected arrival time. This is used for
                ride-hailing services and corporate cab providers. The guard can
                validate the vehicle number against the pre-approval before
                allowing entry.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Employee/Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R28"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  29
                </div>
              </th>
              <td className="s3">26</td>
              <td className="s3">Expected Visitor Management</td>
              <td className="s3">* Pre-Authorization Controls</td>
              <td className="s3">
                Residents and hosts can create expected entries for cabs and
                known vehicles directly from the resident app. This
                pre-authorization is time-bound and linked to the host's flat.
                The guard sees the pre-authorization in the expected visitor
                queue and can process it in one tap.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Resident, Host, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R29"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  30
                </div>
              </th>
              <td className="s3">27</td>
              <td className="s3">Parcel Management</td>
              <td className="s3">* QR Authentication for Parcel Handover</td>
              <td className="s3">
                When a delivery person arrives with a parcel, the guard scans a
                QR code to authenticate the handover workflow. The QR links the
                parcel to the correct recipient record and ensures that only
                authorized handover actions are recorded against the correct
                recipient and flat.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Delivery Person</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R30"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  31
                </div>
              </th>
              <td className="s3">28</td>
              <td className="s3">Parcel Management</td>
              <td className="s3">* Receipt Confirmation with Host OTP</td>
              <td className="s3">
                Before the parcel handover is marked as complete, the system
                requires an OTP from the host. The host receives an OTP
                notification on their mobile. The delivery person or guard
                enters this OTP to confirm that the recipient authorized the
                handover. This prevents unauthorized parcel collection.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident, Delivery Person</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R31"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  32
                </div>
              </th>
              <td className="s3">29</td>
              <td className="s3">Parcel Management</td>
              <td className="s3">* Re-Notification</td>
              <td className="s3">
                If the host does not respond to the initial parcel notification
                within the configured time window, the system automatically
                triggers a re-notification. The guard can also manually
                re-trigger the notification from the parcel queue. Each
                notification attempt is logged with a timestamp.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R32"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  33
                </div>
              </th>
              <td className="s3">30</td>
              <td className="s3">Parcel Management</td>
              <td className="s3">* Smart Locker Option</td>
              <td className="s3">
                For properties with smart parcel locker hardware, the platform
                supports contactless locker assignment. The delivery person
                drops the parcel into an assigned locker without requiring host
                presence. The host receives a locker access OTP and can collect
                the parcel at their convenience.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Resident, Delivery Person</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R33"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  34
                </div>
              </th>
              <td className="s3">31</td>
              <td className="s3">Staff &amp; Daily Help Management</td>
              <td className="s3">* Staff Check-In</td>
              <td className="s3">
                The guard captures staff mobile number, ID, type, role, and
                validity before marking the staff member in. The check-in
                creates a time-stamped record linked to the staff profile.
                Multiple check-in methods are supported: manual entry, QR scan,
                or biometric/face scan where hardware is available.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R34"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  35
                </div>
              </th>
              <td className="s3">32</td>
              <td className="s3">Staff &amp; Daily Help Management</td>
              <td className="s3">* Staff Validity Tracking</td>
              <td className="s3">
                Each staff record stores a validity period (Valid Till), the
                number of remaining days, and the flats or units the staff
                member is authorized to visit. The system blocks entry or raises
                a flag when a staff member's validity has expired. Facility
                admins can renew validity from the admin panel.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R35"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  36
                </div>
              </th>
              <td className="s3">33</td>
              <td className="s3">Staff &amp; Daily Help Management</td>
              <td className="s3">* Staff Attendance</td>
              <td className="s3">
                Daily attendance is tracked per staff member across all
                check-ins and check-outs. The attendance view shows total staff
                count, present, absent, and historical logs. This data is
                exportable for property-level workforce management and payroll
                cross-referencing.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R36"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  37
                </div>
              </th>
              <td className="s3">34</td>
              <td className="s3">Staff &amp; Daily Help Management</td>
              <td className="s3">* Pre-Approved Staff Entry</td>
              <td className="s3">
                Regular staff such as housekeeping, security, and maintenance
                personnel can be configured for recurring access. On arrival,
                the guard sees the pre-approved profile and processes entry in a
                single tap without re-entering details or triggering a new host
                approval.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R37"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  38
                </div>
              </th>
              <td className="s3">35</td>
              <td className="s3">Staff &amp; Daily Help Management</td>
              <td className="s3">* Staff Blacklisting</td>
              <td className="s3">
                Facility admins can blacklist staff members due to policy
                violations, complaints, or misconduct. Blacklisted staff are
                flagged during check-in validation. The guard is shown a
                blacklist alert and must escalate to a supervisor rather than
                allowing entry. Blacklist records include the reason and the
                admin who actioned it.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R38"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  39
                </div>
              </th>
              <td className="s3">36</td>
              <td className="s3">Vehicle Management</td>
              <td className="s3">* Vehicle and Driver Verification</td>
              <td className="s3">
                Before a vehicle is marked in, the system validates both the
                vehicle number plate and the driver's ID against registered
                records. For visitor vehicles, the guard cross-checks the
                pre-approval record. This dual verification prevents
                unauthorized vehicle entry even when a known vehicle number is
                presented.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R39"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  40
                </div>
              </th>
              <td className="s3">37</td>
              <td className="s3">Vehicle Management</td>
              <td className="s3">* Defaulter Tagging</td>
              <td className="s3">
                Vehicles flagged for violations (wrong parking, overspeeding,
                honking, misbehaving) are tagged as defaulters in the vehicle
                list. Guards can filter the vehicle screen to show only
                defaulters, enabling targeted intervention. Defaulter reasons
                are stored with the flagging officer's ID and timestamp.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R40"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  41
                </div>
              </th>
              <td className="s3">38</td>
              <td className="s3">Vehicle Management</td>
              <td className="s3">* Vehicle Audit</td>
              <td className="s3">
                The vehicle audit view provides a full historical log of all
                vehicle entries and exits across a property. It is filterable by
                date, vehicle type, number plate, and entry point. This log is
                used for insurance claims, incident investigations, and
                compliance audits.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R41"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  42
                </div>
              </th>
              <td className="s3">39</td>
              <td className="s3">Vehicle Management</td>
              <td className="s3">* Pre-Approved Vehicle Access</td>
              <td className="s3">
                Vehicles registered to residents or authorized users are
                pre-approved for smooth access. The guard sees a green indicator
                and the registered owner's details when a pre-approved number
                plate is scanned or entered. Entry is processed faster than for
                visitor vehicles.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R42"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  43
                </div>
              </th>
              <td className="s3">40</td>
              <td className="s3">Vehicle Management</td>
              <td className="s3">* Parking Intelligence</td>
              <td className="s3">
                The system supports guest parking slot allocation, resident
                parking assignment, and time-stamped parking tokens. The parking
                token records the entry time and assigns a specific slot. This
                data feeds into parking occupancy reports and helps facility
                teams manage overflow.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R43"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  44
                </div>
              </th>
              <td className="s3">41</td>
              <td className="s3">Vehicle Management</td>
              <td className="s3">
                * ANPR - Automatic Number Plate Recognition
              </td>
              <td className="s3">
                The platform supports integration with ANPR camera systems for
                automatic vehicle number plate capture. When a vehicle
                approaches the gate, the camera reads the plate and the system
                automatically looks up the vehicle record, logs the entry, and
                triggers the appropriate approval workflow without guard manual
                input.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R44"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  45
                </div>
              </th>
              <td className="s3">42</td>
              <td className="s3">Valet Parking</td>
              <td className="s3">* Request Status Lifecycle</td>
              <td className="s3">
                Valet requests pass through a structured lifecycle: Requested
                (vehicle handed over to valet), In Progress (vehicle being moved
                to parking), Pending (awaiting retrieval request), and Completed
                (vehicle returned to owner). Each status transition is logged
                with a timestamp and the valet attendant's user ID.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Valet Attendant, Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R45"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  46
                </div>
              </th>
              <td className="s3">43</td>
              <td className="s3">Valet Parking</td>
              <td className="s3">* Host Coordination</td>
              <td className="s3">
                The valet team can initiate a host call from within the valet
                screen when confirming vehicle delivery. The Delivered button
                marks the handover complete and creates a final record in the
                valet log. This ensures accountability for vehicle condition at
                handover.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Valet Attendant, Security Guard, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R46"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  47
                </div>
              </th>
              <td className="s3">44</td>
              <td className="s3">Guard Patrolling</td>
              <td className="s3">* Patrol Scheduling and Status</td>
              <td className="s3">
                Patrols are scheduled with assigned guards, routes, and time
                windows. The patrol screen shows all scheduled patrols
                categorized as Completed, Missed, or Rejected with timestamps.
                Missed and rejected patrols trigger alerts to the duty
                supervisor. Guards can see their own patrol schedule from the
                guard-facing app.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R47"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  48
                </div>
              </th>
              <td className="s3">45</td>
              <td className="s3">Guard Patrolling</td>
              <td className="s3">* Patrol Checkpoints</td>
              <td className="s3">
                Each patrol route has defined checkpoints (Checkpoint A, B, C).
                The guard must check in at each checkpoint during the patrol.
                The system validates the checkpoint sequence and records the
                actual arrival time against the scheduled time. Missed
                checkpoints are flagged automatically.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R48"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  49
                </div>
              </th>
              <td className="s3">46</td>
              <td className="s3">Guard Patrolling</td>
              <td className="s3">* Checkpoint Evidence Capture</td>
              <td className="s3">
                At each checkpoint, the guard captures the building name,
                scheduled and actual arrival time, incident category,
                subcategory, and any relevant past incident references. Property
                condition checks require the guard to confirm whether
                infrastructure is in good condition and the area is clean and
                secure, with mandatory attachment upload for negative responses.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R49"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  50
                </div>
              </th>
              <td className="s3">47</td>
              <td className="s3">Guard Patrolling</td>
              <td className="s3">* Patrol Incident Capture</td>
              <td className="s3">
                During a patrol, the guard can raise an incident report directly
                from the patrol screen. The incident is linked to the patrol
                record for traceability. QR scan support allows guards to link
                the incident to a specific location marker on the property.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R50"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  51
                </div>
              </th>
              <td className="s3">48</td>
              <td className="s3">Incident Management</td>
              <td className="s3">* Severity and Classification</td>
              <td className="s3">
                Incidents are classified using a four-level category hierarchy:
                Primary Category, Secondary Category, Third-Level Category, and
                Severity Level (Level 1 to Level 4). This structured
                classification ensures that escalation rules, reporting filters,
                and SLA tracking are applied correctly based on incident type.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">
                Security Guard, Security Manager, Facility Admin
              </td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R51"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  52
                </div>
              </th>
              <td className="s3">49</td>
              <td className="s3">Incident Management</td>
              <td className="s3">* Investigation Module</td>
              <td className="s3">
                The investigation section captures root cause using a structured
                taxonomy: Human Error, Business Failure, or Equipment Failure.
                Each root cause type has sub-fields to document what
                specifically failed, who was involved, and what the contributing
                factors were. This feeds into the corrective and preventive
                action sections.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R52"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  53
                </div>
              </th>
              <td className="s3">50</td>
              <td className="s3">Incident Management</td>
              <td className="s3">* Corrective Action</td>
              <td className="s3">
                The corrective action section captures step-by-step actions
                taken to resolve the incident. Three action steps are supported
                with a detailed response field. The corrective action is linked
                to the incident record and the responsible staff member.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R53"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  54
                </div>
              </th>
              <td className="s3">51</td>
              <td className="s3">Incident Management</td>
              <td className="s3">* Preventive Action</td>
              <td className="s3">
                Preventive actions include a responsible person assignment,
                target completion date, and specific action steps. The incident
                status field tracks whether the preventive action has been
                initiated, is in progress, or is completed. This creates a
                closed-loop accountability workflow for recurring issues.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R54"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  55
                </div>
              </th>
              <td className="s3">52</td>
              <td className="s3">Goods Movement</td>
              <td className="s3">
                * Outward Log - Returnable vs Non-Returnable
              </td>
              <td className="s3">
                Outward goods movements are split into two tracked categories:
                Returnable and Non-Returnable. Non-returnable items are logged
                and closed. Returnable items remain in a Pending Returns list
                until they are checked back in. This prevents asset leakage from
                industrial, warehouse, and commercial sites.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Logistics Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R55"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  56
                </div>
              </th>
              <td className="s3">53</td>
              <td className="s3">Goods Movement</td>
              <td className="s3">* Returnable Tracking</td>
              <td className="s3">
                Items marked as returnable remain in an open pending-returns
                list. When the item is returned, the guard closes the record
                against the original outward movement. Overdue returns are
                flagged based on a configured expected return date. This is
                critical for warehouse and industrial environments where
                equipment is frequently loaned.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R56"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  57
                </div>
              </th>
              <td className="s3">54</td>
              <td className="s3">Goods Movement</td>
              <td className="s3">* Movement Creation via QR or Manual</td>
              <td className="s3">
                Goods inward or outward movements can be initiated by scanning a
                QR code on the goods or by manual entry. The QR scan links the
                movement to a preconfigured item record. Manual entry captures
                item type, category, name, quantity, unit, and description. Both
                paths produce the same structured audit record.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Logistics Staff</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R57"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  58
                </div>
              </th>
              <td className="s3">55</td>
              <td className="s3">Notifications &amp; Alerts</td>
              <td className="s3">* Real-Time Approval Notifications</td>
              <td className="s3">
                Every visitor approval, rejection, and entry update triggers a
                real-time push notification to the relevant host or resident.
                Notifications include the visitor's name, photo (where
                captured), and action taken. The notification queue in the guard
                app shows pending approvals that have not yet been actioned.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Resident, Host, Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R58"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  59
                </div>
              </th>
              <td className="s3">56</td>
              <td className="s3">Notifications &amp; Alerts</td>
              <td className="s3">* Security Exception Alerts</td>
              <td className="s3">
                When a wrong entry, overstay, or suspicious visitor event is
                recorded, the system sends a real-time alert to the duty guard,
                facility manager, and any configured escalation contacts. Alerts
                include the event type, visitor details, gate location, and
                timestamp.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Facility Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R59"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  60
                </div>
              </th>
              <td className="s3">57</td>
              <td className="s3">Notifications &amp; Alerts</td>
              <td className="s3">* Re-Notify Flow</td>
              <td className="s3">
                If a host does not respond to an approval request within the
                configured timeout window, the guard can re-trigger the
                notification manually from the waiting queue. The system also
                supports automatic re-notification at a configurable interval.
                Each re-notification attempt is logged with the guard's ID.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R60"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  61
                </div>
              </th>
              <td className="s3">58</td>
              <td className="s3">Notifications &amp; Alerts</td>
              <td className="s3">* Emergency Alerts</td>
              <td className="s3">
                Any guard, resident, or admin can trigger an emergency alert
                from the platform. The alert is broadcast to all configured
                emergency contacts and security personnel with the alert type,
                location, and time. Emergency events are logged separately from
                standard incident records.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, Resident, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R61"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  62
                </div>
              </th>
              <td className="s3">59</td>
              <td className="s3">History &amp; Audit Trail</td>
              <td className="s3">* Visitor History Log</td>
              <td className="s3">
                All entry types - guests, delivery, other visitors, staff,
                vehicles, and parcels - are consolidated in a single searchable
                visitor history log. Each record shows visitor name, mobile,
                category, approval status, mark-in and mark-out times, duration,
                and creation timestamp. Facility admins can export the log for
                compliance, insurance, or investigations.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R62"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  63
                </div>
              </th>
              <td className="s3">60</td>
              <td className="s3">Dashboard &amp; Operations Summary</td>
              <td className="s3">* Live Operations Card</td>
              <td className="s3">
                The home screen of the guard app shows a real-time count of
                visitors currently marked in, marked out, and the total movement
                for the day. This card refreshes automatically and gives the
                duty guard an instant situational awareness view without opening
                detailed logs.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R63"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  64
                </div>
              </th>
              <td className="s3">61</td>
              <td className="s3">Dashboard &amp; Operations Summary</td>
              <td className="s3">* QR Entry Access from Home Screen</td>
              <td className="s3">
                Guards can initiate a QR scan or OTP entry validation directly
                from the home screen without navigating into individual module
                screens. This shortcut is designed for high-traffic gate periods
                where speed matters more than full workflow navigation.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R64"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  65
                </div>
              </th>
              <td className="s3">62</td>
              <td className="s3">Reporting &amp; Analytics</td>
              <td className="s3">* Daily and Weekly Visitor Reports</td>
              <td className="s3">
                The analytics module generates visitor movement reports for a
                selected date range, broken down by category, gate, and entry
                status. Reports show total visitors, approved vs. rejected
                ratio, and average processing time. Reports are exportable to
                PDF or Excel.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R65"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  66
                </div>
              </th>
              <td className="s3">63</td>
              <td className="s3">Reporting &amp; Analytics</td>
              <td className="s3">* Peak Hour Analysis</td>
              <td className="s3">
                The system identifies peak gate traffic hours based on
                historical entry data. Peak hour charts are generated for any
                selected date range, segmented by day of week. Facility teams
                use this to plan guard shifts, staffing, and gate equipment
                deployment.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R66"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  67
                </div>
              </th>
              <td className="s3">64</td>
              <td className="s3">Reporting &amp; Analytics</td>
              <td className="s3">* Guard Performance Tracking</td>
              <td className="s3">
                Each guard's activity is measured by number of entries
                processed, response time to waiting queue items, patrol
                completion rate, and incident reports filed. Guard performance
                dashboards are visible to security managers and can be used for
                shift evaluation and HR reviews.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R67"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  68
                </div>
              </th>
              <td className="s3">65</td>
              <td className="s3">Reporting &amp; Analytics</td>
              <td className="s3">* Parking Occupancy Reports</td>
              <td className="s3">
                Parking slot usage is tracked over time and reported as
                occupancy percentage by time of day, day of week, and zone. The
                report identifies consistently over-utilized and under-utilized
                zones. Facility teams use this for parking policy enforcement
                and expansion planning.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R68"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  69
                </div>
              </th>
              <td className="s3">66</td>
              <td className="s3">Reporting &amp; Analytics</td>
              <td className="s3">* Incident Summary Reports</td>
              <td className="s3">
                Incident reports are aggregated by category, severity level,
                location, and resolution status. Security managers can see open
                incidents, average resolution time, and repeat incident
                patterns. Reports are shareable with building owners, insurers,
                and compliance teams.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R69"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  70
                </div>
              </th>
              <td className="s3">67</td>
              <td className="s3">Platform &amp; System Capabilities</td>
              <td className="s3">
                * Administration - User and Flat Management
              </td>
              <td className="s3">
                Admins manage the resident master, employee directory,
                flat-to-resident mapping, and role assignments from a central
                admin panel. New residents, employees, or vendors can be added
                individually or via bulk upload. The admin panel also supports
                de-activation of users who have vacated or left.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R70"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  71
                </div>
              </th>
              <td className="s3">68</td>
              <td className="s3">Platform &amp; System Capabilities</td>
              <td className="s3">* Offline Sync Queue</td>
              <td className="s3">
                When the gate device loses connectivity, all guard actions
                (mark-in, mark-out, rejection, parcel handover) are stored in a
                local sync queue. Once connectivity is restored, the sync queue
                is pushed to the server in order. Guards receive a sync
                confirmation and any conflicts are flagged for manual review.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard, IT Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R71"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  72
                </div>
              </th>
              <td className="s3">69</td>
              <td className="s3">Platform &amp; System Capabilities</td>
              <td className="s3">* Geo-Fencing</td>
              <td className="s3">
                Location-based rules restrict certain platform actions to users
                who are physically within the property boundary. For example, a
                resident can only approve a visitor if their device is within
                the geo-fence, preventing remote approvals for high-security
                zones.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin, Resident</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R72"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  73
                </div>
              </th>
              <td className="s3">70</td>
              <td className="s3">Platform &amp; System Capabilities</td>
              <td className="s3">* Behavior Analytics</td>
              <td className="s3">
                The platform analyses recurring patterns in visitor movement,
                vehicle entries, and staff attendance. Anomalies such as a
                vendor visiting at unusual hours, a vehicle entering multiple
                times in a day, or a staff member clocking in from an
                unregistered device are surfaced as alerts or analytical
                insights.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Manager, Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R73"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  74
                </div>
              </th>
              <td className="s3">71</td>
              <td className="s3">Platform &amp; System Capabilities</td>
              <td className="s3">* Multi-Site Central Dashboard</td>
              <td className="s3">
                Property management companies operating multiple sites can
                access a central dashboard showing movement volumes, active
                incidents, patrol compliance, and exception counts across all
                connected properties. Drill-down to site-level data is available
                from the same dashboard.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">
                Property Management Company, Real Estate Developer
              </td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R74"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  75
                </div>
              </th>
              <td className="s3">72</td>
              <td className="s3">Admin &amp; Configuration</td>
              <td className="s3">* Role and Permission Management</td>
              <td className="s3">
                Admins assign roles (Security Guard, Facility Admin, Resident,
                Valet Attendant, Management Reviewer) to users and configure
                which modules and actions each role can access. Permissions are
                enforced at the API level. Role changes take effect immediately
                across all devices linked to the user.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R75"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  76
                </div>
              </th>
              <td className="s3">73</td>
              <td className="s3">Admin &amp; Configuration</td>
              <td className="s3">* Gate and Entry Point Configuration</td>
              <td className="s3">
                Each property's gates are configured individually with entry
                timing rules, default approval policies, active modules, and
                linked guard assignments. Multiple gates can be configured per
                property, each with independent settings. This supports
                multi-gate campuses, industrial parks with separate entry and
                exit lanes, and residential societies with service gates.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R76"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  77
                </div>
              </th>
              <td className="s3">74</td>
              <td className="s3">Platform Utilities</td>
              <td className="s3">* Digital Gate Pass</td>
              <td className="s3">
                A digital gate pass is generated for pre-approved visitors,
                staff, and vendors. The pass includes a QR code that the guard
                scans for one-tap validation. The pass can be shared via
                WhatsApp or SMS and downloaded as a PDF. Passes have an expiry
                time configured at the property level.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Resident, Host, Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R77"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  78
                </div>
              </th>
              <td className="s3">75</td>
              <td className="s3">Platform Utilities</td>
              <td className="s3">* Manual Override</td>
              <td className="s3">
                When QR or OTP validation is not possible (device failure,
                connectivity loss, visitor unable to receive OTP), the guard can
                perform a manual lookup and create a manual entry with a
                mandatory reason field. Manual entries are flagged in the audit
                log for supervisor review.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Security Guard</td>
            </tr>
            <tr style={{ height: 139 }}>
              <th
                id="136088962R78"
                style={{ height: 139 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 139 }}>
                  79
                </div>
              </th>
              <td className="s3">76</td>
              <td className="s3">Platform Utilities</td>
              <td className="s3">* Whitelist and Blacklist Controls</td>
              <td className="s3">
                Admins can whitelist trusted visitors, vehicles, or staff for
                automatic entry clearance without guard intervention.
                Blacklisted entries trigger a mandatory guard escalation and are
                logged with the blacklisting admin's details. Blacklist and
                whitelist records are visible across all gates at the property.
              </td>
              <td className="s3">* USP</td>
              <td className="s3">Facility Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
