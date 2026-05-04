export default function PTWUseCasesContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle no-grid" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr"></th>
              <th
                id="287968638C0"
                style={{ width: 195 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="287968638C1"
                style={{ width: 269 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="287968638C2"
                style={{ width: 716 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="287968638C3"
                style={{ width: 314 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="287968638C4"
                style={{ width: 314 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="287968638C5"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                F
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 41 }}>
              <th
                id="287968638R0"
                style={{ height: 41 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 41 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan="6">
                USE CASES - FM MATRIX PERMIT TO WORK (PTW) PLATFORM
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="287968638R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan="6">
                Industry use cases (same 10 industries as Market Analysis) +
                Internal team use cases
              </td>
            </tr>
            <tr style={{ height: 31 }}>
              <th
                id="287968638R2"
                style={{ height: 31 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 31 }}>
                  3
                </div>
              </th>
              <td className="s2" colSpan="6">
                PART 1: INDUSTRY USE CASES
              </td>
            </tr>
            <tr style={{ height: 59 }}>
              <th
                id="287968638R3"
                style={{ height: 59 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 59 }}>
                  4
                </div>
              </th>
              <td className="s3">Industry</td>
              <td className="s3">Typical Permit Scenario</td>
              <td className="s3">
                How FM Matrix PTW Features Are Used (Specific Workflow)
              </td>
              <td className="s3">Key Features Used</td>
              <td className="s3">Business Outcome</td>
              <td className="s3">Buyer Type</td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R4"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  5
                </div>
              </th>
              <td className="s4">Manufacturing (Automobiles, FMCG, General)</td>
              <td className="s5">
                Annual planned maintenance shutdown: 200+ contractors performing
                electrical isolation, confined space entry, hot work, and
                mechanical work simultaneously across the plant
              </td>
              <td className="s5">
                1. Admin configures permit types (Electrical Isolation, Hot
                Work, Confined Space) with specific activity trees, hazard
                categories, and JSA templates per type. 2. Permit Requestors
                (maintenance planners) create permits selecting site, location,
                permit type, and multiple activities under one permit. Vendor
                assignment from vendor master notifies contractors instantly. 3.
                Each contractor logs into vendor inbox, fills supervisor and
                manpower details, uploads LOTO certificate and method statement
                against pre-defined document placeholders. 4. Safety Officer
                completes safety validation section, fills digital JSA from the
                pre-mapped JSA template, and routes for digital sign-off. 5.
                After final approval, unique QR is generated and printed for
                posting at each work zone. 6. Field supervisor scans QR via FM
                Matrix mobile app; GPS validates they are within the approved
                work zone. Real-time checklist loads. Any negative response
                auto-holds the permit. 7. Electrical team completes work;
                requestor submits closure with site restoration photo. Safety
                Officer approves closure.
              </td>
              <td className="s5">
                Permit taxonomy setup, Vendor inbox, Document placeholders, JSA
                templates mapped per permit type, Digital signatures, QR
                generation, Geo-fenced activation, Real-time checklist,
                Auto-hold on negative response, Auto-calculated validity,
                Mandatory closure attachments
              </td>
              <td className="s5">
                Zero unauthorized work commencements. Full contractor
                accountability record. Audit-ready permit dossier for Factory
                Act and ISO 45001 compliance review.
              </td>
              <td className="s5">Head EHS, Plant Safety Manager</td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R5"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  6
                </div>
              </th>
              <td className="s6">Pharma and Chemicals</td>
              <td className="s7">
                Monthly GMP area maintenance: contractors performing HVAC filter
                replacement, electrical works in controlled areas, and chemical
                storage maintenance requiring strict PTW and JSA evidence for
                FDA audit
              </td>
              <td className="s7">
                1. Admin configures Clean Room Entry and Chemical Handling
                permit types with GMP-specific JSA templates and mandatory photo
                evidence at work commencement and completion. 2. Requestor
                creates permit with specific clean room zone location and
                multi-activity scope. Vendor assigned from pre-qualified vendor
                master (vendors with expired compliance documents blocked from
                assignment). 3. Vendor completes form with qualified supervisor
                details and competency certificates uploaded against named
                document placeholders. 4. Safety Officer reviews, completes
                safety validation, fills digital JSA and routes to Area Quality
                and Site Safety Officer for sequential digital sign-off. 5. QR
                generated; field team activates at clean room anteroom (GPS
                geo-fence covers anteroom and work zone). Before-work photo
                uploaded via mobile app as mandatory evidence. 6. Any negative
                checklist item (contamination risk, PPE failure) auto-holds
                permit; GMP Manager notified. 7. After-work photo evidence
                uploaded at closure. Full dossier (permit, JSA, photos,
                signatures) available for FDA audit query in under 30 seconds.
              </td>
              <td className="s7">
                Vendor master compliance status check, Document placeholders,
                Preloaded JSA templates per permit type, Multi-level sequential
                digital signatures, Photo/video evidence at stages, QR
                geo-fenced activation, Auto-hold notification, End-to-end audit
                trail
              </td>
              <td className="s7">
                FDA audit-ready documentation produced without manual
                compilation. Zero unauthorized access to clean rooms. JSA
                evidence linked directly to permit record.
              </td>
              <td className="s7">Head EHS, Plant Manager, QA Head</td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R6"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  7
                </div>
              </th>
              <td className="s4">
                Industrial and Logistics Parks, Warehousing
              </td>
              <td className="s5">
                Multi-tenant logistics park: 50+ contractor teams performing
                racking installation, fire system maintenance, loading dock
                modifications, and roof work across 15 tenants simultaneously
              </td>
              <td className="s5">
                1. Park FM team configures site-wise permit access so each
                tenant&#39;s contractor permits are visible only to their
                respective operations team while the park safety head sees all.
                2. Contractors raise permits per tenant location with hot work,
                working at height, and civil excavation types pre-configured. 3.
                Vendor inbox directs each contractor to complete their specific
                sections. Park safety officer reviews all pending permits from
                one dashboard. 4. Quick action from permit list allows bulk
                review of same-type permits. 5. Field safety check via QR
                ensures contractor is at the correct bay or zone before work
                commences (prevents cross-bay permit misuse). 6. Site comparison
                dashboard shows which tenants have the most active or held
                permits for proactive intervention.
              </td>
              <td className="s5">
                Site-wise RBAC, Centralized permit list with site filter, QR
                geo-fencing by tenant zone, Quick actions from list, Site
                comparison dashboard, Multi-status visibility
              </td>
              <td className="s5">
                Reduced insurance claim exposure from unauthorized work. Single
                audit trail across all tenant contractors for DPIIT and
                insurance compliance.
              </td>
              <td className="s5">
                Park Facility Manager, Head EHS, Tenant Operations Head
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R7"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  8
                </div>
              </th>
              <td className="s6">Data Centers</td>
              <td className="s7">
                Routine MEP maintenance and UPS replacement in live data center:
                electrical contractors performing work in powered environments
                requiring absolute PTW traceability to prevent downtime
              </td>
              <td className="s7">
                1. Data center ops team configures Electrical Isolation and Cold
                Work permit types with mandatory LOTO checklist steps and 4-hour
                validity (matching maintenance windows). 2. Electrical
                contractor receives permit via vendor inbox, fills manpower
                (qualified engineers only), uploads electrical isolation
                certificates and single-line diagrams against document
                placeholders. 3. Data center shift engineer reviews and provides
                digital sign-off; site safety officer provides second-level
                sign-off. 4. QR activation required before any cable or panel
                work begins. GPS geo-fence covers the specific hall or row. 5.
                Hourly checklist scan during long maintenance windows keeps the
                permit active with fresh field evidence. Auto-calculated 4-hour
                validity creates a hard stop. 6. Extension can be requested
                before expiry if work is running over. After completion, site
                photo evidence uploaded and permit closed.
              </td>
              <td className="s7">
                Auto-calculated validity, Permit extension management, Document
                placeholders for LOTO certificates, Multi-level digital
                signatures, QR geo-fenced to data hall, Periodic checklist
                completion, Photo evidence at closure
              </td>
              <td className="s7">
                Zero uncontrolled electrical work in live data halls.
                Maintenance window overruns tracked and extended with full
                approval chain. Uptime SLA compliance evidence available.
              </td>
              <td className="s7">
                Data Center Facility Manager, Operations Head, Safety Officer
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R8"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  9
                </div>
              </th>
              <td className="s4">
                Commercial and Mixed-Use Real Estate, Offices
              </td>
              <td className="s5">
                Tenant fit-out in occupied Grade-A office building: multiple
                contractor teams performing MEP, civil, and flooring work on
                different floors while building is occupied by other tenants
              </td>
              <td className="s5">
                1. Building management team configures location-level permit
                scoping so contractors are permissioned only to their specific
                floor and zone. 2. Permit requestors (fit-out project managers)
                raise permits per floor, type, and contractor. 3. Hot work on
                one floor cannot be initiated without a separate approved hot
                work permit even if contractor holds a general access permit. 4.
                Building safety officer approves permits per floor; building
                manager sees all active permits via site dashboard. 5. QR
                geo-fence restricts field activation to permitted floor zone,
                preventing a contractor from activating a floor 3 permit while
                standing on floor 7. 6. Fire drill or building emergency: safety
                officer places all active permits on hold simultaneously via
                bulk hold action. 7. Escalation email sent to all stakeholders
                when holds are not resolved within 2 hours.
              </td>
              <td className="s5">
                Location-level site scoping, Separate permit per type and
                location, QR geo-fencing per floor zone, Site dashboard for
                building manager, Bulk hold action, Escalation email timers
              </td>
              <td className="s5">
                Zero unauthorized hot work or high-risk activity in occupied
                floors. IGBC/LEED building safety audit documentation produced
                from permit records.
              </td>
              <td className="s5">
                Building Manager, Head Facilities, REIT Safety Head
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R9"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  10
                </div>
              </th>
              <td className="s6">
                Facility Management and Property Management
              </td>
              <td className="s7">
                Multi-client FM company managing 80+ client sites: standardized
                PTW governance for all contractor activities across all clients
                without customizing a separate system per client
              </td>
              <td className="s7">
                1. FM company admin uses the configurable permit taxonomy to
                create client-specific permit templates (some clients require
                3-level approvals, others require 2). Approval rule engine
                handles different rules per site/client without code changes. 2.
                Each client&#39;s site data is isolated by RBAC so Client
                A&#39;s contractors and permits are invisible to Client B&#39;s
                teams. 3. FM cluster safety manager has a cross-site dashboard
                showing permit volumes, hold rates, and approval performance for
                all their client sites. 4. Monthly vendor compliance report from
                Dashboard tab shows each contractor&#39;s document expiry status
                and hold history across all client sites. 5. Escalation matrix
                routes unresolved holds to the FM account head and client safety
                contact simultaneously.
              </td>
              <td className="s7">
                Multi-site RBAC, Client-specific permit templates, Approval rule
                engine per site, Cross-site dashboard, Vendor compliance report,
                Escalation matrix configuration
              </td>
              <td className="s7">
                FM company can demonstrate standardized safety governance to all
                clients from one platform. Client retention improved through
                transparent permit audit reporting. Cluster safety manager
                productivity improved 3x.
              </td>
              <td className="s7">
                FM Account Head, Cluster Safety Manager, Client EHS Head
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R10"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  11
                </div>
              </th>
              <td className="s4">EPCE, SEZ, Real Estate Development</td>
              <td className="s5">
                SEZ construction phase: 1,000+ contractor workers from 30+
                companies performing simultaneous civil, structural, MEP, and
                finishing works across 50 hectare development site
              </td>
              <td className="s5">
                1. Project EHS manager configures site zones (Zone A to Zone Z)
                with distinct geo-fences. Each zone has specific permit types
                applicable (Zone A - civil excavation; Zone C - structural hot
                work). 2. Contractors cannot activate permits outside their
                assigned zone. QR geo-fencing prevents a civil contractor from
                activating an electrical permit in the MEP zone. 3. Daily permit
                volume dashboard shows active permits by zone, contractor, and
                type for morning safety briefing. 4. Site comparison view
                compares permit compliance rates across zones to identify
                high-risk zones for safety officer patrol prioritization. 5. All
                permits, JSAs, and safety check records are exported monthly for
                BOCW Act compliance submission and DPIIT audit.
              </td>
              <td className="s5">
                Multi-zone geo-fencing, Zone-specific permit type configuration,
                Daily permit volume dashboard, Site comparison by zone, Bulk
                export for regulatory submission, Approval rule engine by zone
                type
              </td>
              <td className="s5">
                BOCW Act compliance documentation automated. Unauthorized zone
                access eliminated. Daily safety briefing data available in
                seconds from dashboard.
              </td>
              <td className="s5">
                Project EHS Manager, Site Safety Officer, Project Manager
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R11"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  12
                </div>
              </th>
              <td className="s6">IT/ITES, Banking/BFSI, Co-working</td>
              <td className="s7">
                Large IT campus: data center room and UPS maintenance,
                electrical switchgear work, and civil modifications in occupied
                office building requiring PTW with minimal disruption to
                business operations
              </td>
              <td className="s7">
                1. Campus facility team uses permit validity auto-calculation to
                ensure all maintenance work is scoped to off-business-hours
                windows (e.g., 11 PM to 5 AM, 6-hour validity auto-set for
                electrical permit type). 2. Permits expiring before work
                completion trigger automatic extension request to the campus
                safety officer. 3. BFSI branch: branch manager (approver)
                receives digital signature request on mobile for hot work in
                server room. Approves from phone in under 2 minutes. 4.
                Real-time permit status visible on facility management dashboard
                during work. 5. Audit trail exported as PDF for RBI building
                safety audit or SEBI compliance review.
              </td>
              <td className="s7">
                Auto-calculated validity, Pre-expiry extension alerts, Mobile
                digital signature approval, Real-time dashboard during work,
                Audit trail PDF export, RBAC for branch vs campus scope
              </td>
              <td className="s7">
                Zero compliance findings in RBI building safety audit. Off-hours
                maintenance windows controlled and enforced by permit validity
                logic. Branch manager approvals completed remotely.
              </td>
              <td className="s7">
                Campus Facility Manager, Branch Operations Head, Head IT
                Infrastructure
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R12"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  13
                </div>
              </th>
              <td className="s4">
                Healthcare, Hospitals, Malls, Retail Chains
              </td>
              <td className="s5">
                Hospital MEP maintenance: electrical and HVAC contractor work in
                operating wing corridors and basement MEP rooms requiring
                infection control and patient safety protections during work
              </td>
              <td className="s5">
                1. Hospital facilities head configures permit types for
                active-clinical-area work with mandatory infection control
                checklist steps (plastic sheeting, negative pressure
                confirmation, foot traffic controls). 2. Vendor inlet includes
                hospital-specific document placeholder (infection control
                training certificate, hospital induction completion). 3. Any
                contractor checklist failure in clinical area auto-holds permit
                and notifies infection control nurse and facilities head. 4.
                Mall use case: Hot work permit in food court area requires FSSAI
                compliance checkpoint and automatic notification to mall food
                safety officer. 5. Closure requires photo of area restoration
                and NABH inspection checklist completion.
              </td>
              <td className="s5">
                Hospital-specific permit taxonomy and checklist steps, Document
                placeholders for infection control training, Auto-hold with
                stakeholder notification, NABH-aligned checklist templates,
                Photo evidence at closure, Role-specific notification groups
              </td>
              <td className="s5">
                Zero hospital-acquired infection events linked to contractor
                work. NABH accreditation audit evidence produced without manual
                document collection.
              </td>
              <td className="s5">
                Head Facilities, Hospital Safety Officer, Infection Control
                Nurse
              </td>
            </tr>
            <tr style={{ height: 166 }}>
              <th
                id="287968638R13"
                style={{ height: 166 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 166 }}>
                  14
                </div>
              </th>
              <td className="s6">
                F&amp;B, Education, Co-living, Home Improvements, Telecom,
                Professional Services
              </td>
              <td className="s7">
                Telecom tower maintenance: contractor team performing battery
                replacement and antenna alignment on rooftop towers at multiple
                sites requiring height work PTW and electrical isolation permits
              </td>
              <td className="s7">
                1. Telecom ops team configures Working at Height and Electrical
                Isolation permit types with TRAI-compliant JSA templates and
                mandatory equipment inspection checklist. 2. Contractor
                supervisor receives permit via vendor inbox, uploads tower
                access authorization and qualified climber certificates against
                named document placeholders. 3. QR geo-fence set for tower
                access point; climbers activate permit by scanning at tower
                base. GPS confirms location. 4. Safety officer receives
                real-time checklist data from field. Any negative harness check
                item triggers auto-hold and prevents work at height from
                proceeding. 5. After work, all permits exported for TRAI
                compliance submission and insurance renewal.
              </td>
              <td className="s7">
                Working at Height permit type, Equipment checklist, Document
                placeholders for climber certificates, QR geo-fencing at tower
                site, Auto-hold on harness failure, Export for regulatory
                submission
              </td>
              <td className="s7">
                Zero height-work incidents from equipment failure. TRAI
                compliance documentation automated. Contractor accountability
                documented per tower visit.
              </td>
              <td className="s7">
                Telecom Facility Manager, Network Operations Head, Safety
                Officer
              </td>
            </tr>
            <tr style={{ height: 33 }}>
              <th
                id="287968638R14"
                style={{ height: 33 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 33 }}>
                  15
                </div>
              </th>
              <td className="s8"></td>
              <td className="s8"></td>
              <td className="s8"></td>
              <td className="s8"></td>
              <td className="s8"></td>
              <td className="s8"></td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R15"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  16
                </div>
              </th>
              <td className="s2" colSpan="6">
                PART 2: INTERNAL TEAM USE CASES
              </td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R16"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  17
                </div>
              </th>
              <td className="s3">Internal Team</td>
              <td className="s3">How They Use FM Matrix PTW</td>
              <td className="s3">Key Features Used</td>
              <td className="s3">Before (Without PTW Platform)</td>
              <td className="s3">After (With FM Matrix PTW)</td>
              <td className="s3">Frequency of Use</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="287968638R17"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  18
                </div>
              </th>
              <td className="s5">
                EHS / Safety Team (Safety Officers, Site Safety Officers, EHS
                Managers)
              </td>
              <td className="s5">
                Manages the full permit governance process: configures permit
                taxonomy and templates, reviews and approves permits, monitors
                real-time field safety check data, manages holds and resumes,
                runs compliance reports, and responds to breach escalations.
                Primary power user of the platform.
              </td>
              <td className="s5">
                Permit taxonomy setup, JSA template management, Approval
                routing, Real-time dashboard, Auto-hold monitoring, Escalation
                notifications, Audit trail export, Safety check data download
              </td>
              <td className="s5">
                Manual paper permit review. WhatsApp or phone-based hold/resume
                decisions. Safety check records on paper registers that take
                days to compile for audit. No real-time visibility into field
                activity.
              </td>
              <td className="s5">
                Real-time permit status across all sites from one dashboard.
                Instant notification on negative field response. Digital
                evidence trail available in seconds. Audit preparation time
                reduced from 3 days to under 4 hours.
              </td>
              <td className="s5">Daily - multiple times per shift</td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R18"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  19
                </div>
              </th>
              <td className="s7">
                Operations and Maintenance Team (Maintenance Planners, Site
                Incharge, Operations Managers)
              </td>
              <td className="s7">
                Creates permit requests for planned and reactive maintenance
                activities, tracks permits through the approval chain, reviews
                vendor submissions, coordinates field teams, manages extensions,
                and submits permit closures with evidence.
              </td>
              <td className="s7">
                Permit creation, Vendor assignment, Multi-activity permit,
                Permit list with filters, Extension management, Quick actions
                from list, Closure with mandatory evidence
              </td>
              <td className="s7">
                Maintenance permits raised by email or paper. Vendor
                coordination by phone. Extension requests communicated
                informally with no digital record. Closure files stored in
                shared drives without linkage to the permit record.
              </td>
              <td className="s7">
                All permit actions from one interface. Vendor automatically
                notified. Extension history fully tracked. Closure evidence
                stored against the permit record. No manual file management.
              </td>
              <td className="s7">
                Daily - permit creation, tracking, extension, and closure
              </td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R19"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  20
                </div>
              </th>
              <td className="s5">
                Vendor / Contractor Team (Assigned Contractors, Vendor
                Supervisors)
              </td>
              <td className="s5">
                Views assigned permits from the vendor inbox, fills the vendor
                completion form (supervisor details, manpower, checkpoints,
                document uploads), and submits the form back to the internal
                team for review.
              </td>
              <td className="s5">
                Vendor inbox, Auto-populated vendor form, Supervisor and
                manpower capture, Document placeholder upload, Submission
                handoff
              </td>
              <td className="s5">
                Received permit assignments by phone or email. Filled paper
                forms or PDF attachments. Submitted documents via email leading
                to version confusion and missing attachments.
              </td>
              <td className="s5">
                Structured digital form with pre-filled context fields. Named
                document placeholders prevent missed uploads. Digital submission
                with automatic notification to internal team. Vendor
                accountability recorded.
              </td>
              <td className="s5">
                Per permit assignment - typically daily to weekly depending on
                work volume
              </td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R20"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  21
                </div>
              </th>
              <td className="s7">
                Field Safety Team (Site Workers, Field Supervisors doing safety
                checks)
              </td>
              <td className="s7">
                Activates permits at the worksite by scanning QR via FM Matrix
                mobile app, completes field safety checklists with GPS location
                capture and photo evidence, and monitors permit status during
                execution.
              </td>
              <td className="s7">
                QR scan via mobile app, Geo-fenced activation, Real-time
                checklist completion, Photo and video evidence capture, Hold
                notification receipt on mobile
              </td>
              <td className="s7">
                Paper safety checklist completed at start of shift with no
                real-time visibility. No geo-fencing; contractors could start
                work anywhere. Photos taken on personal phones with no link to
                permit record.
              </td>
              <td className="s7">
                Digital checklist on mobile with GPS validation. Auto-hold
                immediately stops unsafe work. Photos linked to permit record.
                Safety officer sees field activity in real time from web
                dashboard.
              </td>
              <td className="s7">
                Per permit scan - each field activation and checklist event
              </td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R21"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  22
                </div>
              </th>
              <td className="s5">
                Management and Audit Team (EHS Directors, Cluster Heads,
                Auditors, Compliance Managers)
              </td>
              <td className="s5">
                Reviews permit activity reports, site comparison dashboards, and
                approval performance metrics. Pulls permit dossiers for
                regulatory audit submission. Monitors contractor compliance
                trends and escalation history.
              </td>
              <td className="s5">
                Real-time graphical dashboard, Site-wise comparison, Approval
                metrics report, Vendor compliance report, Audit trail PDF
                export, Safety check compliance report
              </td>
              <td className="s5">
                Relied on manual monthly reports compiled by safety teams from
                paper registers. No cross-site comparison. Audit evidence
                compilation required days of manual work.
              </td>
              <td className="s5">
                On-demand reports available in seconds. Site comparison
                identifies outlier sites for proactive intervention. Audit
                evidence package generated as PDF without manual compilation.
                Monthly board reporting automated.
              </td>
              <td className="s5">Weekly reporting and ad-hoc audit queries</td>
            </tr>
            <tr style={{ height: 105 }}>
              <th
                id="287968638R22"
                style={{ height: 105 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 105 }}>
                  23
                </div>
              </th>
              <td className="s7">
                Admin and Master Data Team (System Admins, Master Data Owners)
              </td>
              <td className="s7">
                Configures and maintains the permit taxonomy (types, activities,
                hazards, risk levels), manages permit templates and JSA
                templates, maintains the vendor master, manages user roles and
                site access, and configures the approval rule engine.
              </td>
              <td className="s7">
                Permit taxonomy setup, Preloaded permit templates, JSA template
                library, Approval rule engine configuration, Vendor master
                maintenance, RBAC user management, Validity rule configuration
              </td>
              <td className="s7">
                Safety templates maintained in Word documents or Excel. Approval
                rules communicated verbally or via SOPs that are not enforced by
                any system. Vendor compliance status manually tracked in
                spreadsheets.
              </td>
              <td className="s7">
                Single configuration interface for all permit governance rules.
                Template changes versioned and applied to new permits
                automatically. Vendor compliance status visible in permit
                creation preventing non-compliant vendor assignment.
              </td>
              <td className="s7">
                Setup phase intensive; ongoing monthly for template updates and
                new user onboarding
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
