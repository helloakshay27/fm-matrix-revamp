export default function TenantFeatureListContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle no-grid" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr"></th>
              <th
                id="857362376C0"
                style={{ width: 209 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="857362376C1"
                style={{ width: 174 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="857362376C2"
                style={{ width: 195 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="857362376C3"
                style={{ width: 384 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="857362376C4"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="857362376C5"
                style={{ width: 55 }}
                className="column-headers-background"
              >
                F
              </th>
              <th
                id="857362376C6"
                style={{ width: 265 }}
                className="column-headers-background"
              >
                G
              </th>
              <th
                id="857362376C7"
                style={{ width: 83 }}
                className="column-headers-background"
              >
                H
              </th>
              <th
                id="857362376C8"
                style={{ width: 209 }}
                className="column-headers-background"
              >
                I
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 39 }}>
              <th
                id="857362376R0"
                style={{ height: 39 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 39 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan="9">
                LOCKATED - TENANT MANAGEMENT | Complete Feature List with USP
                Mapping
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="857362376R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan="9">
                All features from BRD. USP rows highlighted in blue. Star
                denotes unique competitive differentiator.
              </td>
            </tr>
            <tr style={{ height: 52 }}>
              <th
                id="857362376R2"
                style={{ height: 52 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 52 }}>
                  3
                </div>
              </th>
              <td className="s2">Module</td>
              <td className="s2">Feature Name</td>
              <td className="s2">Sub-Feature</td>
              <td className="s2">How It Currently Works</td>
              <td className="s2">User Type</td>
              <td className="s2">USP?</td>
              <td className="s2">Competitive Gap Filled</td>
              <td className="s2">Priority Tier</td>
              <td className="s2">Data Sovereignty Impact</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R3"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  4
                </div>
              </th>
              <td className="s3">
                Onboarding, Login &amp; Tech Park Selection
              </td>
              <td className="s3">* User Registration</td>
              <td className="s3">Access Card Mapping &amp; OTP Verification</td>
              <td className="s3">
                User registers with full name, company domain, access card
                number, and official email. System validates the access card
                against the tenant company database, sends OTP to registered
                email, maps the card to the new user, deactivates the previous
                user mapped to that card, and activates the new account. Domain
                restriction prevents unauthorized registrations.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Eliminates shared or lost access cards causing unauthorized app
                access. No competitor in India offers access-card-to-identity
                binding at onboarding.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                All registration data stored on client server only
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R4"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  5
                </div>
              </th>
              <td className="s3">
                Onboarding, Login &amp; Tech Park Selection
              </td>
              <td className="s3">* Login</td>
              <td className="s3">Access Card Based Login</td>
              <td className="s3">
                Login uses company selection, access card number, and official
                email with OTP. System verifies that the access card is still
                mapped to this user and that the domain matches the tenant org.
                Prevents ghost accounts from persisting after employee exits.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Prevents credential sharing and access after employee departure
                without IT intervention.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Login logs retained on client infrastructure
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R5"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  6
                </div>
              </th>
              <td className="s4">
                Onboarding, Login &amp; Tech Park Selection
              </td>
              <td className="s4">Onboarding Experience</td>
              <td className="s4">Walkthrough Screens</td>
              <td className="s4">
                3-5 guided screens shown on first login explaining core
                features: service requests, booking amenities, notices, and
                wallet. Users can skip or step through. Reduces support calls by
                setting expectations upfront.
              </td>
              <td className="s4">Tenant Employee</td>
              <td className="s4"></td>
              <td className="s4">
                Reduces onboarding friction and support ticket volume for
                property managers.
              </td>
              <td className="s4">P2</td>
              <td className="s4">No PII collected in walkthrough</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R6"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  7
                </div>
              </th>
              <td className="s3">
                Onboarding, Login &amp; Tech Park Selection
              </td>
              <td className="s3">* Tech Park Selection</td>
              <td className="s3">Select Tech Park</td>
              <td className="s3">
                During onboarding, user chooses from a list of tech parks they
                are authorized to access. This scopes all subsequent content
                (notices, amenities, events, services) to that specific
                property. Admin configures which tenants can access which parks.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Critical for multi-park developers like Embassy, Prestige, DLF
                who deploy across locations. No manual location assignment
                needed.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Location mapping stored on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R7"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  8
                </div>
              </th>
              <td className="s3">
                Onboarding, Login &amp; Tech Park Selection
              </td>
              <td className="s3">* Tech Park Selection</td>
              <td className="s3">Switch Tech Park</td>
              <td className="s3">
                Users with access to multiple tech parks can switch between them
                post-login without re-authenticating. All content, bookings, and
                history are scoped to the selected park. Ideal for employees of
                multinational tenants who visit multiple campuses.
              </td>
              <td className="s3">Tenant Employee, Tenant Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Enables enterprise tenants with multi-campus presence to use one
                app across all locations.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Cross-park activity data stays on respective client servers
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R8"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  9
                </div>
              </th>
              <td className="s5">
                Onboarding, Login &amp; Tech Park Selection
              </td>
              <td className="s5">Support Access</td>
              <td className="s5">Need Help</td>
              <td className="s5">
                During tech park selection, a help button connects the user to
                property admin support via in-app call or message. Reduces
                drop-off during onboarding when users cannot find their company
                or access card number.
              </td>
              <td className="s5">Tenant Employee</td>
              <td className="s5"></td>
              <td className="s5">
                Reduces drop-off rate during critical onboarding step.
              </td>
              <td className="s5">P3</td>
              <td className="s5">No data sovereignty impact</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R9"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  10
                </div>
              </th>
              <td className="s4">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s4">Notifications</td>
              <td className="s4">Bell Notifications</td>
              <td className="s4">
                Real-time push notifications delivered to the bell icon for all
                service request updates, notice publications, event reminders,
                and booking confirmations. Admin can configure notification
                categories and frequency. Users can view full notification
                history.
              </td>
              <td className="s4">Tenant Employee</td>
              <td className="s4"></td>
              <td className="s4">
                Replaces WhatsApp and email-based property communication.
              </td>
              <td className="s4">P1</td>
              <td className="s4">Notification logs on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R10"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  11
                </div>
              </th>
              <td className="s5">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s5">Personalization</td>
              <td className="s5">Greetings</td>
              <td className="s5">
                Time-aware greetings (Good Morning, Good Afternoon) combined
                with event-based messages (Happy Diwali, Welcome back).
                Configured by admin for property-level personalization.
                Increases daily open rates and reinforces community feeling.
              </td>
              <td className="s5">Tenant Employee</td>
              <td className="s5"></td>
              <td className="s5">
                Reduces app churn by making the home screen feel relevant.
              </td>
              <td className="s5">P3</td>
              <td className="s5">No PII in greeting logic</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R11"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  12
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Marketing</td>
              <td className="s3">Upload Marketing Banners</td>
              <td className="s3">
                Admins upload branded banner images with links, display
                schedules, and target audience selection (all tenants, specific
                companies, or floor-level). Banners auto-expire. Used for new
                restaurant launches, events, safety campaigns, and partner
                offers.
              </td>
              <td className="s3">Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Gives landlords a direct-to-tenant marketing channel they own.
                No dependency on third-party ad platforms.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Banner data and targeting stored on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R12"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  13
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Marketing</td>
              <td className="s3">Active / Inactive Banner Control</td>
              <td className="s3">
                Property admin toggles banners live or off instantly. Supports
                scheduling (activate on date X, deactivate on date Y). Prevents
                stale promotions from appearing. Audit log of all banner changes
                available.
              </td>
              <td className="s3">Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Real-time content control without vendor intervention - critical
                for compliance-driven announcements.
              </td>
              <td className="s3">P1</td>
              <td className="s3">All banner events logged on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R13"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  14
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Quick Actions</td>
              <td className="s3">Shortcut Panel</td>
              <td className="s3">
                Home screen shortcuts to Ticket Creation, Amenity Booking, OSR,
                and SOS. Configurable by admin to add or remove shortcuts.
                Reduces average tap-to-action time for the most used features.
                Critically important for emergency SOS access.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Reduces navigation depth for the 4 highest-frequency actions.
                Emergency SOS reachable in 2 taps from home.
              </td>
              <td className="s3">P1</td>
              <td className="s3">No PII stored</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R14"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  15
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Wallet System</td>
              <td className="s3">Wallet</td>
              <td className="s3">
                Tenants load funds into a digital wallet linked to their
                profile. Wallet is used for F&amp;B orders within campus,
                parking fees, amenity booking deposits, and in-app service
                payments. Payments are processed via integrated payment gateway.
                Wallet balance displays on home screen.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Creates a closed-loop financial ecosystem within the property.
                Enables cashless campus operations and gives landlords
                transaction-level tenant engagement data.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                All financial transactions stored exclusively on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R15"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  16
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Wallet System</td>
              <td className="s3">Transaction History</td>
              <td className="s3">
                Complete chronological history of all wallet credits, debits,
                refunds, and failed transactions. Filterable by date, type, and
                amount. Downloadable as PDF or CSV for expense reporting.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Eliminates disputes on campus payments. Provides tenants with
                expense documentation.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Transaction history on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R16"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  17
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Wallet System</td>
              <td className="s3">Add Balance</td>
              <td className="s3">
                Tenants top up wallet via UPI, credit/debit card, net banking
                through the integrated payment gateway. Minimum and maximum
                top-up amounts configurable by admin. Instant credit
                confirmation with transaction receipt.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                UPI-first design for India&#39;s digital payment behavior.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Payment gateway integration; transaction data on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R17"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  18
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Wallet System</td>
              <td className="s3">My Refunds</td>
              <td className="s3">
                Automatic refund initiation for cancelled amenity bookings,
                failed transactions, and disputed charges. Refund status tracked
                through pending, approved, and credited stages. Users notified
                at each stage. Admin has override capability.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Builds financial trust. Reduces support escalations for payment
                disputes.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Refund logs on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R18"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  19
                </div>
              </th>
              <td className="s3">
                Home Experience, Notifications &amp; Wallet
              </td>
              <td className="s3">* Wallet System</td>
              <td className="s3">Master Wallet (Admin)</td>
              <td className="s3">
                Property admin dashboard showing aggregated wallet activity:
                total loaded value, total spent, category-wise spend breakdown,
                per-tenant spending, and reconciliation reports. Configurable
                alert thresholds for unusual activity.
              </td>
              <td className="s3">Property Admin, Super Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Gives landlords revenue intelligence on on-campus spend
                patterns. Informs new F&amp;B or service investments.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Full financial data sovereignty on client infrastructure
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R19"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  20
                </div>
              </th>
              <td className="s4">Notices, Broadcasts &amp; Offers</td>
              <td className="s4">Notices Management</td>
              <td className="s4">Add New Notice</td>
              <td className="s4">
                Admin creates a notice with title, body text, target audience
                (all tenants, specific company, specific floor), publish date,
                and expiry date. Rich text formatting supported. Notice
                immediately pushed as bell notification to targeted users.
              </td>
              <td className="s4">Property Admin</td>
              <td className="s4"></td>
              <td className="s4">
                Replaces circular WhatsApp messages with a structured, archived
                communication system.
              </td>
              <td className="s4">P1</td>
              <td className="s4">
                Notice content and read receipts on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R20"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  21
                </div>
              </th>
              <td className="s3">Notices, Broadcasts &amp; Offers</td>
              <td className="s3">* Alerts</td>
              <td className="s3">Roadblocks</td>
              <td className="s3">
                Critical fullscreen popup that appears on app open for all
                targeted users. Used for emergency maintenance shutdowns, safety
                alerts, mandatory evacuations, or urgent compliance notices.
                Cannot be dismissed until read. Admin can time-bound and target
                by park or company.
              </td>
              <td className="s3">Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Guaranteed-read emergency channel unavailable in any other India
                CRE platform. Critical for BCP (Business Continuity Planning)
                scenarios.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Alert content and acknowledgment logs on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R21"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  22
                </div>
              </th>
              <td className="s3">Notices, Broadcasts &amp; Offers</td>
              <td className="s3">* Offers Management</td>
              <td className="s3">Offers &amp; Promotions</td>
              <td className="s3">
                Dedicated section for property-level and partner offers:
                restaurant discounts, retail partner deals, and service
                promotions. Admin creates offers with validity periods, usage
                limits, and claim codes. Tenants browse, filter, and redeem
                directly in-app.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Monetizes tenant attention for landlord and creates a value-add
                that competitors charge extra for.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Offer data and redemption logs on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R22"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  23
                </div>
              </th>
              <td className="s3">Notices, Broadcasts &amp; Offers</td>
              <td className="s3">* Offers Management</td>
              <td className="s3">Offer Retargeting</td>
              <td className="s3">
                System identifies tenants who viewed an offer but did not redeem
                it and sends a push reminder within a configured time window.
                Admin sets retargeting rules: days after viewing, maximum
                reminders, and excluded audiences.
              </td>
              <td className="s3">Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Behavioral marketing automation inside a property app -
                typically only available in standalone MarTech tools. First such
                feature in India CRE apps.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Behavioral data entirely on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R23"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  24
                </div>
              </th>
              <td className="s3">Notices, Broadcasts &amp; Offers</td>
              <td className="s3">* Offers Management</td>
              <td className="s3">Filter Offers</td>
              <td className="s3">
                Tenants filter the offers list by upcoming events, expiry month,
                category (F&amp;B, retail, services). Reduces cognitive load in
                properties with 20+ active offers simultaneously.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Scales the offers experience as tenant count and partner count
                grows.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Filter preferences stored locally</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R24"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  25
                </div>
              </th>
              <td className="s3">Notices, Broadcasts &amp; Offers</td>
              <td className="s3">* Offers Management</td>
              <td className="s3">Exclusive Offers</td>
              <td className="s3">
                Admin creates offers visible only to selected tenant companies
                or membership tiers. Used for loyalty program rewards or
                enterprise tenant VIP perks. Tenants without access do not see
                the offer exists.
              </td>
              <td className="s3">Property Admin, Tenant Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Drives differentiated tenant experience and loyalty program
                monetization. Premium enterprise clients expect VIP treatment.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Targeting rules and access logs on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R25"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  26
                </div>
              </th>
              <td className="s4">Events &amp; Calendar</td>
              <td className="s4">Event Management</td>
              <td className="s4">Add Event</td>
              <td className="s4">
                Admin creates events with title, description, venue (linked to
                property map), date and time, registration limit, and RSVP
                requirement toggle. Events appear in Upcoming Events list and on
                My Calendar for users who RSVP.
              </td>
              <td className="s4">Property Admin</td>
              <td className="s4"></td>
              <td className="s4">
                Centralizes event management previously handled via email
                invites and WhatsApp.
              </td>
              <td className="s4">P2</td>
              <td className="s4">Event data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R26"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  27
                </div>
              </th>
              <td className="s3">Events &amp; Calendar</td>
              <td className="s3">* Participation</td>
              <td className="s3">RSVP Counts</td>
              <td className="s3">
                Admins see real-time RSVP counts with breakdown by tenant
                company. Tenant users see general attendance count. System
                triggers reminders to users who RSVP&#39;d 24 hours before
                event. Enables capacity management for venue-restricted events.
              </td>
              <td className="s3">Property Admin, Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Live RSVP analytics enable capacity planning and post-event ROI
                measurement for engagement programs.
              </td>
              <td className="s3">P2</td>
              <td className="s3">RSVP data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R27"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  28
                </div>
              </th>
              <td className="s3">Events &amp; Calendar</td>
              <td className="s3">* Calendar Integration</td>
              <td className="s3">Add to My Calendar</td>
              <td className="s3">
                Single tap to sync event or confirmed booking to personal
                calendar (Google Calendar, Outlook, Apple Calendar). ICS file
                generated automatically. Reminder set at user-configured lead
                time.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Reduces no-shows for booked amenities and RSVP&#39;d events.
                Increases amenity utilization rates.
              </td>
              <td className="s3">P2</td>
              <td className="s3">
                Calendar sync uses device calendar API, no PII leaves client
                infrastructure
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R28"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  29
                </div>
              </th>
              <td className="s3">Brand, Information &amp; Personal Settings</td>
              <td className="s3">* Content</td>
              <td className="s3">News Feed</td>
              <td className="s3">
                Live stream of property-level announcements, press releases, and
                curated content from the landlord organization. Supports images,
                videos, and external links. Chronological and pinned posts.
                Admin-moderated.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Turns the property app into a media channel. Gives landlords a
                branded content platform.
              </td>
              <td className="s3">P2</td>
              <td className="s3">News content on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R29"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  30
                </div>
              </th>
              <td className="s3">Brand, Information &amp; Personal Settings</td>
              <td className="s3">* Calendar</td>
              <td className="s3">My Calendar</td>
              <td className="s3">
                Personal consolidated calendar showing all confirmed amenity
                bookings, RSVP&#39;d events, and admin-pushed property events in
                a single monthly/weekly/daily view. Color-coded by type.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Eliminates the fragmentation of booking confirmations across
                email and SMS.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Calendar data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R30"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  31
                </div>
              </th>
              <td className="s3">Amenities, Space Booking &amp; Calendar</td>
              <td className="s3">* Booking Engine</td>
              <td className="s3">Fixed / Flexible Booking</td>
              <td className="s3">
                Fixed (instant confirm) bookings for low-demand amenities like
                parking slots. Flexible (admin-approval) booking for high-demand
                resources like board rooms, sports courts, event halls. Admin
                configures per amenity. Users see status in real-time. Approval
                workflows include reason fields and rejection with comments.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Handles both walk-up and pre-scheduled booking scenarios in a
                single engine. Eliminates overbooking and conflict for premium
                amenities.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Booking records on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R31"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  32
                </div>
              </th>
              <td className="s3">Amenities, Space Booking &amp; Calendar</td>
              <td className="s3">* Booking Management</td>
              <td className="s3">My Bookings</td>
              <td className="s3">
                Tenant&#39;s personal booking history and upcoming bookings in a
                single view. Shows status (confirmed, pending approval,
                cancelled), booking details, and wallet transaction reference.
                Filter by date, amenity type.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Full self-service transparency. Reduces property manager queries
                about booking status.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Booking history on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R32"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  33
                </div>
              </th>
              <td className="s3">Amenities, Space Booking &amp; Calendar</td>
              <td className="s3">* Booking Management</td>
              <td className="s3">Reschedule Booking</td>
              <td className="s3">
                Tenants reschedule confirmed bookings within the lead time
                configured by admin. System checks new slot availability in
                real-time, releases the original slot, and issues reschedule
                confirmation. Wallet impact handled automatically.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Self-service rescheduling reduces admin load by eliminating
                phone/WhatsApp booking change requests.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                All reschedule events logged on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R33"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  34
                </div>
              </th>
              <td className="s3">Amenities, Space Booking &amp; Calendar</td>
              <td className="s3">* Booking Management</td>
              <td className="s3">Track Refund</td>
              <td className="s3">
                When a booking is cancelled within refund policy window, refund
                is automatically queued. Tenant tracks refund status through
                wallet dashboard. Admin can see all pending refunds and process
                manually if needed.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Removes financial ambiguity from cancellations. Builds tenant
                trust in the platform.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Refund data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R34"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  35
                </div>
              </th>
              <td className="s3">Amenities, Space Booking &amp; Calendar</td>
              <td className="s3">* Calendar View</td>
              <td className="s3">30 Day Calendar View</td>
              <td className="s3">
                Full calendar view showing available, partially-booked, and full
                slots for each amenity across a 30-day window. Color-coded
                availability. Tenants can book directly from calendar view.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Enables forward planning of amenity use. High-demand amenities
                like gyms and boardrooms become manageable.
              </td>
              <td className="s3">P2</td>
              <td className="s3">
                Availability data generated server-side, no PII
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R35"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  36
                </div>
              </th>
              <td className="s3">OSR, Services &amp; Marketplace</td>
              <td className="s3">* Service Requests</td>
              <td className="s3">OSR</td>
              <td className="s3">
                Tenants raise Operational Service Requests (OSR) across
                predefined categories: housekeeping, IT infrastructure,
                electrical, plumbing, HVAC, and custom categories. Each request
                auto-assigned to the relevant facility team based on category
                routing rules. SLA countdown starts at assignment. Status
                updates pushed to tenant in real-time.
              </td>
              <td className="s3">Tenant Employee, Facility Personnel</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Structured SLA-bound ticketing system replacing WhatsApp-based
                maintenance requests. Gives landlords audit-ready service
                delivery records for tenant SLA compliance.
              </td>
              <td className="s3">P1</td>
              <td className="s3">All service ticket data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R36"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  37
                </div>
              </th>
              <td className="s3">OSR, Services &amp; Marketplace</td>
              <td className="s3">* Tracking</td>
              <td className="s3">My Services</td>
              <td className="s3">
                Complete service request history per user and per property.
                Filters by status (open, in progress, resolved, rejected),
                category, and date. Admin view includes all tickets across all
                tenants with SLA breach indicators.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                SLA breach visibility forces accountability in facility teams.
                Reportable for ISO 41001 facility management compliance.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Full ticket history on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R37"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  38
                </div>
              </th>
              <td className="s3">Community, Forums &amp; Channels</td>
              <td className="s3">* Community Feed</td>
              <td className="s3">Posts</td>
              <td className="s3">
                Tenants post text, images, and documents on the community feed.
                Admin moderates. Posts visible to all users in the tech park.
                Supports hashtags and mentions. Admin can pin important posts to
                top.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Turns the property app into a community platform. Differentiates
                from pure-service apps and drives daily active use.
              </td>
              <td className="s3">P2</td>
              <td className="s3">All post content on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R38"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  39
                </div>
              </th>
              <td className="s3">Community, Forums &amp; Channels</td>
              <td className="s3">* Engagement</td>
              <td className="s3">Polls</td>
              <td className="s3">
                Admin or tenant users create polls with 2-10 options. Results
                visible in real-time. Closed polls archived. Used for facility
                planning input (new amenity preferences), event feedback, and
                community decisions.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Gives landlords a structured feedback mechanism. Data from polls
                directly informs facility investment decisions.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Poll data and responses on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R39"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  40
                </div>
              </th>
              <td className="s3">Community, Forums &amp; Channels</td>
              <td className="s3">* Communication</td>
              <td className="s3">Group List</td>
              <td className="s3">
                Organized list of all community groups (topic-based,
                department-based, interest-based). Users see groups they can
                join and groups they belong to. Admin controls group creation
                permissions.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Structured group taxonomy prevents the chaos of unmoderated
                group proliferation.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Group membership data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R40"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  41
                </div>
              </th>
              <td className="s3">Community, Forums &amp; Channels</td>
              <td className="s3">* Communication</td>
              <td className="s3">Create Group</td>
              <td className="s3">
                Admin or authorized tenants create named groups with
                description, category tag, and privacy setting (open or
                invite-only). File sharing, polls, and announcements supported
                within groups.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Enables interest-based communities (running club, book club)
                that drive tenant loyalty and retention.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Group content on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R41"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  42
                </div>
              </th>
              <td className="s3">Community, Forums &amp; Channels</td>
              <td className="s3">* Collaboration</td>
              <td className="s3">Attachments</td>
              <td className="s3">
                File attachments (PDF, images, spreadsheets) supported in
                community channels and group chats. File size limits
                configurable by admin. Attachments stored on client server, not
                external file storage services.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Enables operational document sharing (evacuation plans, parking
                maps, vendor lists) within the platform without email.
              </td>
              <td className="s3">P2</td>
              <td className="s3">
                Attachment files on client server - full data sovereignty
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R42"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  43
                </div>
              </th>
              <td className="s3">SOS, Profile &amp; Support</td>
              <td className="s3">* Profile Management</td>
              <td className="s3">My Profile</td>
              <td className="s3">
                Tenant views and manages their profile including name,
                designation, company, contact details, profile picture, and
                linked access card. Profile completeness indicator. Admin can
                view but not edit tenant profiles.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Self-service profile management reduces property admin workload
                for profile updates.
              </td>
              <td className="s3">P2</td>
              <td className="s3">Profile data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R43"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  44
                </div>
              </th>
              <td className="s3">Admin Dashboard &amp; Operations</td>
              <td className="s3">* Dashboard</td>
              <td className="s3">Admin Dashboard</td>
              <td className="s3">
                Single-screen operational command center for property admin.
                Real-time KPIs: active users today, open service requests, SLA
                breach count, amenity utilization rate, wallet transaction
                volume, and upcoming events. Drill-down to any module from
                dashboard. Configurable widget layout.
              </td>
              <td className="s3">Property Admin, Super Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Real-time portfolio intelligence that replaces daily morning
                report emails. Actionable data at a glance.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                All dashboard data pulled from client server in real-time
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R44"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  45
                </div>
              </th>
              <td className="s3">Admin Dashboard &amp; Operations</td>
              <td className="s3">* Reports</td>
              <td className="s3">Download Report</td>
              <td className="s3">
                Admin generates and downloads reports for service request SLA
                performance, amenity utilization, tenant engagement scores,
                wallet transaction summaries, visitor logs, and event
                attendance. Formats: PDF and Excel. Scheduled report delivery
                via email supported.
              </td>
              <td className="s3">Property Admin, Super Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Audit-ready reporting for ISO, RERA, and enterprise tenant SLA
                reviews.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Report generation from client server data</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R45"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  46
                </div>
              </th>
              <td className="s3">Admin Dashboard &amp; Operations</td>
              <td className="s3">* Alerts</td>
              <td className="s3">Announcements &amp; Alerts</td>
              <td className="s3">
                Admin publishes property-wide announcements with priority levels
                (informational, urgent, critical). Critical alerts trigger push
                and in-app modal. Full delivery and read receipt tracking.
                Announcement history archived.
              </td>
              <td className="s3">Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Multi-channel property communication system with delivery
                guarantee tracking.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Alert delivery data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R46"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  47
                </div>
              </th>
              <td className="s3">Visitor Management</td>
              <td className="s3">* Visitor Logs</td>
              <td className="s3">Visitor Dashboard</td>
              <td className="s3">
                Admin monitors all visitor check-ins and pre-approvals in
                real-time. Dashboard shows pending approvals, active visitors on
                premises, and today&#39;s expected visitors. Filter by tenant
                company, floor, and time window.
              </td>
              <td className="s3">Property Admin, Security</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Replaces manual visitor logbooks with a real-time digital
                system. Generates audit-ready visitor history.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Visitor data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R47"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  48
                </div>
              </th>
              <td className="s3">Visitor Management</td>
              <td className="s3">* Visitor Logs</td>
              <td className="s3">Visitor Management System</td>
              <td className="s3">
                Tenants pre-register visitors from the app. System generates
                QR-code visitor pass. On arrival, security scans pass, system
                auto-logs entry time. Exit logged on departure. Emergency
                mustering reports available for safety managers.
              </td>
              <td className="s3">Tenant Employee, Security</td>
              <td className="s3">* USP</td>
              <td className="s3">
                End-to-end visitor lifecycle management with digital pass
                generation. Critical for BFSI, pharma, and defense tenant
                buildings requiring strict visitor tracking.
              </td>
              <td className="s3">P1</td>
              <td className="s3">All visitor records on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R48"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  49
                </div>
              </th>
              <td className="s3">Mobility &amp; Smart Building</td>
              <td className="s3">* Food Services</td>
              <td className="s3">GoKhana Redirect</td>
              <td className="s3">
                Deep-link integration with GoKhana food ordering platform.
                Tenants access campus food menu, order, and pay via GoKhana
                within a seamless redirect from the Lockated app. Order history
                and wallet balance visible.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Expands platform utility without building F&amp;B
                infrastructure. Cashless food ordering increases wallet usage
                and on-campus engagement.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Redirect integration; transaction data on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R49"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  50
                </div>
              </th>
              <td className="s3">Mobility &amp; Smart Building</td>
              <td className="s3">* Transport</td>
              <td className="s3">Metro Schedule</td>
              <td className="s3">
                Real-time metro schedule for the nearest metro station to the
                tech park. Alerts for last metro timing. Integrates with city
                transit APIs.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Reduces campus departure congestion by enabling commute
                planning. High daily utility drives app open rates.
              </td>
              <td className="s3">P2</td>
              <td className="s3">
                Transit data fetched from public API; no PII
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R50"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  51
                </div>
              </th>
              <td className="s3">Engagement, Loyalty &amp; ESG</td>
              <td className="s3">* Loyalty Programs</td>
              <td className="s3">Rewards System</td>
              <td className="s3">
                Tenants earn points for platform actions: raising service
                requests, booking amenities, attending events, completing
                profile, and redeeming offers. Points redeemable for partner
                vouchers, discounts, or priority access. Admin configures point
                rules and redemption catalog.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Gamification of tenant engagement drives daily active usage and
                retention. Competitive differentiation against utility-only
                property apps.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Loyalty points and redemption data on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R51"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  52
                </div>
              </th>
              <td className="s3">Engagement, Loyalty &amp; ESG</td>
              <td className="s3">* Loyalty Programs</td>
              <td className="s3">Multi-tier Membership</td>
              <td className="s3">
                Tier structure (Silver, Gold, Platinum or custom-named). Tier
                determined by cumulative point balance or engagement score.
                Higher tiers get exclusive amenity slots, VIP event access, and
                partner discounts. Visual tier badge on profile.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Creates aspiration and social signal within the tenant
                community. Drives sustained engagement over months, not just
                post-onboarding.
              </td>
              <td className="s3">P1</td>
              <td className="s3">Membership tier data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R52"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  53
                </div>
              </th>
              <td className="s3">Engagement, Loyalty &amp; ESG</td>
              <td className="s3">* Loyalty Programs</td>
              <td className="s3">Cross-Park Privileges</td>
              <td className="s3">
                Tenants with multi-park access carry their loyalty tier and
                points across all parks under the same landlord group.
                Cross-redemption of points at any park within the network.
                Network effect for landlords with multiple properties.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Creates a sticky multi-property ecosystem. Enterprise tenants
                with offices in multiple cities benefit directly.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Cross-park data federated across client servers
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R53"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  54
                </div>
              </th>
              <td className="s3">Engagement, Loyalty &amp; ESG</td>
              <td className="s3">* ESG</td>
              <td className="s3">CSR Engagement</td>
              <td className="s3">
                Admin creates and publishes CSR and ESG initiatives: tree
                plantation drives, energy saving challenges, donation campaigns.
                Tenants participate and earn bonus loyalty points. Participation
                reports generated for landlord&#39;s ESG reporting.
              </td>
              <td className="s3">Tenant Employee, Property Admin</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Enables landlords to demonstrate ESG commitment to institutional
                investors and enterprise tenants. GRESB and LEED reporting
                requirements met.
              </td>
              <td className="s3">P2</td>
              <td className="s3">CSR participation data on client server</td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R54"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  55
                </div>
              </th>
              <td className="s3">Engagement, Loyalty &amp; ESG</td>
              <td className="s3">* Premium Experience</td>
              <td className="s3">Premium Club</td>
              <td className="s3">
                Curated premium club memberships available to tenants: sports
                club, cultural arts club, wellness club, learning and
                development club. Admin manages club memberships, events, and
                exclusive benefits.
              </td>
              <td className="s3">Tenant Employee</td>
              <td className="s3">* USP</td>
              <td className="s3">
                Elevates property experience beyond utility. Differentiates
                premium commercial properties competing for marquee tenants.
              </td>
              <td className="s3">P1</td>
              <td className="s3">
                Club membership and activity data on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R55"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  56
                </div>
              </th>
              <td className="s4">Integrations</td>
              <td className="s4">Payments</td>
              <td className="s4">Payment Gateway</td>
              <td className="s4">
                Secure payment gateway integration for wallet top-ups and direct
                payments. Supports UPI, credit/debit cards, and net banking.
                PCI-DSS compliant tokenization. Refund processing via same
                gateway. Transaction webhook logs maintained.
              </td>
              <td className="s4">Tenant Employee, Property Admin</td>
              <td className="s4"></td>
              <td className="s4">Foundation for cashless campus operations.</td>
              <td className="s4">P1</td>
              <td className="s4">
                Gateway tokenization; transaction records on client server
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R56"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  57
                </div>
              </th>
              <td className="s5">Integrations</td>
              <td className="s5">CRM</td>
              <td className="s5">CRM System</td>
              <td className="s5">
                Integration with external CRM platforms (Salesforce, Zoho CRM,
                custom). Tenant engagement data, service ticket history, and
                loyalty scores exportable to CRM for lease renewal management
                and relationship intelligence.
              </td>
              <td className="s5">Property Admin, Leasing Team</td>
              <td className="s5"></td>
              <td className="s5">
                Connects operational data to leasing and sales workflows.
              </td>
              <td className="s5">P2</td>
              <td className="s5">
                CRM sync only with landlord&#39;s own CRM; no data to Lockated
                servers
              </td>
            </tr>
            <tr style={{ height: 79 }}>
              <th
                id="857362376R57"
                style={{ height: 79 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 79 }}>
                  58
                </div>
              </th>
              <td className="s4">Integrations</td>
              <td className="s4">Mobility</td>
              <td className="s4">Car Pooling Integration</td>
              <td className="s4">
                Integration with carpooling services for campus commute. Tenants
                find carpool partners within the same tech park community.
                Reduces parking congestion and supports landlord sustainability
                reporting.
              </td>
              <td className="s4">Tenant Employee</td>
              <td className="s4"></td>
              <td className="s4">Sustainability and community value-add.</td>
              <td className="s4">P3</td>
              <td className="s4">Carpool matching data on client server</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
