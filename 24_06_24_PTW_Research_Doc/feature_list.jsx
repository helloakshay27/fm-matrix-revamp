export default function PTWFeatureListContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle no-grid" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr"></th>
              <th
                id="1360696289C0"
                style={{ width: 181 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="1360696289C1"
                style={{ width: 209 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="1360696289C2"
                style={{ width: 209 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="1360696289C3"
                style={{ width: 279 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="1360696289C4"
                style={{ width: 384 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="1360696289C5"
                style={{ width: 195 }}
                className="column-headers-background"
              >
                F
              </th>
              <th
                id="1360696289C6"
                style={{ width: 69 }}
                className="column-headers-background"
              >
                G
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 41 }}>
              <th
                id="1360696289R0"
                style={{ height: 41 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 41 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan="7">
                FEATURE LIST - FM MATRIX PERMIT TO WORK (PTW) PLATFORM
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="1360696289R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan="7">
                All modules, features, sub-features, USP flags, user types, and
                how they currently work | Star = USP Feature
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R2"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  3
                </div>
              </th>
              <td className="s2">Module</td>
              <td className="s3">Feature Name</td>
              <td className="s3">Sub-Feature</td>
              <td className="s3">Description</td>
              <td className="s3">How It Currently Works</td>
              <td className="s3">User Type</td>
              <td className="s3">USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R3"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  4
                </div>
              </th>
              <td className="s4">Permit Request and Creation</td>
              <td className="s5">Request capture</td>
              <td className="s5">
                Auto-capture requestor details from logged-in user
              </td>
              <td className="s5">
                Requestor information is populated automatically, reducing
                manual entry and keeping ownership visible.
              </td>
              <td className="s5">
                When a user logs in and initiates a new permit, the system reads
                their profile from the user master and auto-fills the requestor
                name, designation, department, and contact. This removes
                duplicate entry and ensures every permit has a traceable owner
                from the moment of creation. The requestor field is locked for
                editing to prevent spoofing.
              </td>
              <td className="s5">Permit Requestor, Initiator</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R4"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  5
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Site, location, and reason-of-work capture</td>
              <td className="s6"></td>
              <td className="s6">
                The permit records where the work will happen and why it is
                being raised.
              </td>
              <td className="s6">
                The requestor selects the site from a pre-configured list, then
                picks the location and zone within that site. A free-text or
                dropdown reason-for-work field captures the work purpose. These
                fields drive downstream routing, validity rules, and geo-fencing
                constraints. Site and location data is tagged to every permit
                record for dashboard filtering and audit.
              </td>
              <td className="s6">Permit Requestor, Initiator</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R5"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  6
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Permit definition</td>
              <td className="s5">Select predefined permit type</td>
              <td className="s5">
                Users choose the work category before proceeding so the right
                workflow, controls, and validations are applied.
              </td>
              <td className="s5">
                The system presents a list of pre-configured permit types (Hot
                Work, Confined Space, Electrical, Working at Height, Cold Work,
                General Maintenance, Chemical Handling). On selection, the
                relevant template, mandatory fields, hazard categories, required
                JSA, and approval chain load automatically. Permit type cannot
                be changed after submission to prevent downstream
                misconfiguration.
              </td>
              <td className="s5">Permit Requestor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R6"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  7
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Permit definition</td>
              <td className="s6">
                Select activity, sub-activity, hazard category, and risk
              </td>
              <td className="s6">
                The permit description is built from structured work and hazard
                selections to ensure completeness and consistency.
              </td>
              <td className="s6">
                From the permit type context, the requestor selects the primary
                activity (e.g., welding, electrical isolation, confined space
                entry), then sub-activities and associated hazard categories.
                Each hazard selection triggers a risk level assignment from the
                master. This structured capture drives the safety equipment
                requirements and JSA content pre-population, removing free-text
                ambiguity.
              </td>
              <td className="s6">Permit Requestor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R7"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  8
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Permit definition</td>
              <td className="s5">Add multiple activities under one permit</td>
              <td className="s5">
                One permit can cover more than one related activity when the
                work scope requires it.
              </td>
              <td className="s5">
                Requestors can add additional activity rows under a single
                permit using an Add Activity control. Each additional activity
                carries its own sub-activity, hazard category, and risk profile.
                All activities are visible in the permit summary and carry
                through to the JSA and field checklist stages. Permit complexity
                and duration validation considers the combined activity set.
              </td>
              <td className="s5">Permit Requestor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R8"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  9
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Vendor assignment</td>
              <td className="s6">Vendor selection from vendor master</td>
              <td className="s6">
                The relevant vendor is assigned directly from the master list.
              </td>
              <td className="s6">
                A searchable vendor dropdown pulls from the centrally maintained
                vendor master. On selection, vendor details including registered
                company name, contact, and compliance status are attached to the
                permit. If a vendor is not in the master, the admin must add
                them before assignment. This prevents ad-hoc vendor assignment
                and maintains a clean contractor record.
              </td>
              <td className="s6">Permit Requestor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R9"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  10
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Collaboration</td>
              <td className="s5">
                Copy or collaborate on permits across teams, sites, or client
                contexts
              </td>
              <td className="s5">
                Users can reuse or collaborate on permit creation so common
                permit creation is faster and easier to coordinate.
              </td>
              <td className="s5">
                A Collaborate or Copy option lets requestors duplicate a
                completed permit as a template for a new one, retaining permit
                type, activity, hazard, and vendor selections. Permissions
                govern who can initiate a collaborative permit. This feature
                reduces creation time for repeat works like monthly maintenance
                permits or recurring contractor activities. The collaboration
                log captures who contributed and when.
              </td>
              <td className="s5">Permit Requestor, Site Incharge</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R10"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  11
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Attachments</td>
              <td className="s6">
                Supporting document attachment at request stage
              </td>
              <td className="s6">
                Files can be attached during creation so the permit starts with
                the required evidence.
              </td>
              <td className="s6">
                An attachment panel at the permit creation stage allows the
                requestor to upload method statements, SOPs, work orders, risk
                assessments, and contractor certificates. Accepted file types
                include PDF, JPG, PNG, and DOCX. Attachment file names and
                upload timestamps are recorded in the permit audit trail.
                Documents are linked to the permit record and available through
                the permit detail view throughout the lifecycle.
              </td>
              <td className="s6">Permit Requestor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R11"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  12
                </div>
              </th>
              <td className="s7"></td>
              <td className="s5">Submission</td>
              <td className="s5">
                Raise request and send intimation to vendor
              </td>
              <td className="s5">
                Once submitted, the request is sent forward and the vendor is
                notified to complete their part.
              </td>
              <td className="s5">
                On submission, the system validates that all mandatory fields
                and permit type requirements are met before allowing the permit
                to proceed. On successful submission, a permit ID is assigned
                and a notification is dispatched to the assigned vendor with a
                direct link to the vendor completion form. The permit status
                moves from Draft to Pending Vendor and is visible in the permit
                list.
              </td>
              <td className="s5">Permit Requestor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R12"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  13
                </div>
              </th>
              <td className="s4">Vendor Completion and Supporting Documents</td>
              <td className="s6">Vendor visibility</td>
              <td className="s6">View requested permit from permit inbox</td>
              <td className="s6">
                Vendors can open permits assigned to them and complete the next
                steps from the request queue.
              </td>
              <td className="s6">
                The vendor user logs in to a dedicated vendor-role view that
                shows only permits assigned to them. Each permit in the inbox
                displays the permit ID, type, site, work description, and
                submission deadline. The vendor can open a permit to view the
                full request context before starting their completion. Permits
                move out of the vendor inbox once submitted.
              </td>
              <td className="s6">Vendor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R13"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  14
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Form completion</td>
              <td className="s5">Auto-populated vendor form fields</td>
              <td className="s5">
                The vendor-facing permit form is prefilled with available permit
                data so the vendor completes only the remaining inputs.
              </td>
              <td className="s5">
                Permit type, work location, activity, hazard profile, and
                requestor details are pre-loaded into the vendor form. The
                vendor sees read-only context fields and editable completion
                fields. Pre-population reduces entry errors and keeps vendor
                input focused on their specific responsibilities: supervisor
                details, manpower, document uploads, and checkpoint responses.
              </td>
              <td className="s5">Vendor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R14"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  15
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Form completion</td>
              <td className="s6">Fill checkpoints and required responses</td>
              <td className="s6">
                Vendors complete the assigned checkpoints and required safety
                responses as part of the permit submission.
              </td>
              <td className="s6">
                The vendor-side checkpoint list is driven by the permit type and
                hazard configuration. Each checkpoint presents a Yes/No/NA
                response with an optional comment field. All mandatory
                checkpoints must be answered before submission. Checkpoint
                responses are time-stamped and attributed to the vendor user in
                the audit log.
              </td>
              <td className="s6">Vendor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R15"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  16
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Form completion</td>
              <td className="s5">Supervisor details capture</td>
              <td className="s5">
                Supervisor name and contact number are captured for on-ground
                coordination.
              </td>
              <td className="s5">
                A dedicated supervisor section in the vendor form collects the
                name, mobile number, and designation of the on-site supervisor.
                This creates an accountable on-ground contact record for every
                permit. Supervisor data is displayed in the permit detail view
                and is available in the safety officer&#39;s dashboard for
                direct escalation if issues arise in the field.
              </td>
              <td className="s5">Vendor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R16"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  17
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Form completion</td>
              <td className="s6">
                Manpower capture and multiple manpower support
              </td>
              <td className="s6">
                The permit records the workers assigned to the job and allows
                more than one manpower entry.
              </td>
              <td className="s6">
                Vendors add worker names, IDs, and trade/skill designations in a
                repeating manpower table. An Add Manpower control allows
                multiple rows. Manpower count is summarized on the permit header
                and used in extension scoping. The manpower list is visible to
                the safety officer for field verification during QR scanning and
                checklist completion.
              </td>
              <td className="s6">Vendor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R17"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  18
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Documentation</td>
              <td className="s5">
                Upload required documents against document names
              </td>
              <td className="s5">
                Vendor-side supporting documents can be attached against the
                defined document placeholders.
              </td>
              <td className="s5">
                Document placeholders are configured by the admin against each
                permit type. During vendor form completion, these placeholders
                are presented as mandatory or optional upload fields. The vendor
                uploads the corresponding files (method statement, insurance
                certificate, workers&#39; competency proof) against each named
                slot. Unfilled mandatory placeholders block submission. Uploaded
                documents are labelled by placeholder name in the permit record.
              </td>
              <td className="s5">Vendor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R18"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  19
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Submission handoff</td>
              <td className="s6">Save and send back to initiator</td>
              <td className="s6">
                After the vendor completes the form, the permit is returned to
                the initiating team for review and completion.
              </td>
              <td className="s6">
                A Save and Submit control sends the completed vendor form back
                to the internal team. The system validates all mandatory
                checkpoint responses and document uploads before allowing
                submission. On handoff, the permit status updates to Pending
                Internal Review and the internal team receives a notification
                with the permit link. The vendor&#39;s submission is locked from
                further edit at this stage.
              </td>
              <td className="s6">Vendor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R19"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  20
                </div>
              </th>
              <td className="s7"></td>
              <td className="s5">Verification</td>
              <td className="s5">Verify vendor details and attachments</td>
              <td className="s5">
                Internal users can inspect the vendor-submitted information
                before proceeding to approval.
              </td>
              <td className="s5">
                An internal verification step lets the site incharge or safety
                officer review the vendor-submitted checkpoints, uploaded
                documents, supervisor details, and manpower list side by side
                with the original permit request. Reviewers can flag
                discrepancies with a comment. Verified and flagged items are
                recorded in the audit log before the permit moves to the
                internal completion and approval stage.
              </td>
              <td className="s5">Site Incharge, Safety Officer</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R20"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  21
                </div>
              </th>
              <td className="s4">Permit Review, Approval and Sign-off</td>
              <td className="s6">Internal completion</td>
              <td className="s6">Review and edit vendor-submitted details</td>
              <td className="s6">
                The internal team can correct vendor-entered details where
                needed before moving the permit forward.
              </td>
              <td className="s6">
                The internal review screen shows vendor-completed fields with an
                edit option for designated roles. Edits are logged with the
                editor&#39;s name, timestamp, and original value. Only fields
                configured as internally editable can be changed. This preserves
                vendor accountability while allowing correction of minor errors
                before the permit enters the formal approval chain.
              </td>
              <td className="s6">Site Incharge, Safety Officer</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R21"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  22
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Internal completion</td>
              <td className="s5">
                Fill remaining permit details and checkpoints
              </td>
              <td className="s5">
                Any missing internal fields, validations, or control checkpoints
                are completed by the approving team.
              </td>
              <td className="s5">
                The internal completion form presents fields specific to the
                internal team&#39;s responsibility: PPE requirements, isolation
                confirmation, area clearance status, and additional safety
                controls. Internal checkpoints are separate from vendor
                checkpoints and are configured per permit type by the admin. All
                internal mandatory fields must be completed before the permit
                can route to the safety officer for approval.
              </td>
              <td className="s5">Site Incharge, Safety Officer</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R22"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  23
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Safety validation</td>
              <td className="s6">Safety check section</td>
              <td className="s6">
                Safety-specific validations are completed before the permit is
                approved for execution.
              </td>
              <td className="s6">
                The safety check section is a structured form that the safety
                officer completes as part of the pre-approval review. It covers
                site readiness, equipment condition, worker briefing
                confirmation, and emergency preparedness. Each item has a
                Pass/Fail/NA response. A failed safety check blocks approval and
                routes a notification to the initiator and site incharge with
                the reason. Passed safety checks are recorded as evidence in the
                permit audit log.
              </td>
              <td className="s6">Safety Officer</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R23"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  24
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Digital sign-off</td>
              <td className="s5">Digital signature support</td>
              <td className="s5">
                Signatures are captured digitally to support controlled approval
                and traceability.
              </td>
              <td className="s5">
                Each approval step in the configured chain requires the approver
                to enter a digital signature using a touch-enabled signature pad
                on web or mobile. The signature image is stored against the
                approval record with the approver&#39;s name, role, and
                timestamp. Approvals can be completed from the web browser or
                the FM Matrix mobile app. Digital signatures replace wet
                signatures on paper permit forms and are admissible as audit
                evidence.
              </td>
              <td className="s5">Safety Officer, Site Incharge, Approvers</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R24"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  25
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">JSA processing</td>
              <td className="s6">Fill digital JSA</td>
              <td className="s6">
                The permit flow supports completion of the job safety analysis
                within the workflow.
              </td>
              <td className="s6">
                When the permit type requires a JSA, a JSA template pre-mapped
                to that permit type loads within the permit form. The safety
                officer or internal team fills in the JSA steps, hazards,
                controls, and responsible parties using the digital template.
                Completed JSA data is stored inside the permit record. JSA
                templates can be configured per permit type by the admin and are
                version-controlled.
              </td>
              <td className="s6">Safety Officer, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R25"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  26
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Output handling</td>
              <td className="s5">Print and download permit form and JSA</td>
              <td className="s5">
                Users can generate printable or downloadable permit and JSA
                copies for site execution and recordkeeping.
              </td>
              <td className="s5">
                A Print or Download button on the permit detail page generates a
                formatted PDF of the permit form including all filled sections,
                checkpoints, vendor details, JSA, and approval chain status. The
                JSA can also be downloaded as a standalone document. Both
                outputs carry the permit ID, site, date, and approval status as
                a header. Downloaded files are logged against the permit.
              </td>
              <td className="s5">Safety Officer, Site Incharge, Approvers</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R26"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  27
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Output handling</td>
              <td className="s6">
                Upload signed JSA/form back into the system
              </td>
              <td className="s6">
                The finalized documents can be reattached so the permit record
                stays complete.
              </td>
              <td className="s6">
                If a physical signature is required on the printed form in
                addition to the digital signature (as per client policy), the
                signed document can be scanned and uploaded back into the permit
                record against a designated upload slot. This keeps the full
                permit dossier in one place without requiring a separate
                document management system.
              </td>
              <td className="s6">Safety Officer, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R27"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  28
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Approval routing</td>
              <td className="s5">
                Route permit to safety officer for approval
              </td>
              <td className="s5">
                Once the required documents are uploaded, the permit is routed
                into the next approval stage.
              </td>
              <td className="s5">
                The approval rule engine determines which roles and individuals
                must approve based on permit type, site, risk level, and
                configured rule sets. The permit is routed sequentially or in
                parallel as configured. Each approver receives a notification
                with permit details and an Approve or Reject action. Rejected
                permits return to the initiator with the rejection reason and
                comments. The routing log shows every transition.
              </td>
              <td className="s5">Safety Officer, Site Incharge, Approvers</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R28"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  29
                </div>
              </th>
              <td className="s7"></td>
              <td className="s6">Tracking</td>
              <td className="s6">
                Level-wise approval tracking and approval logs
              </td>
              <td className="s6">
                The permit shows which approval stage it is in and retains an
                approval record for audit purposes.
              </td>
              <td className="s6">
                A visual approval chain tracker on the permit detail page shows
                each approval level, the assigned approver name and role, the
                current status (pending, approved, rejected), and the timestamp
                of each action. Completed approvals with digital signatures are
                accessible from the permit history panel. The full approval log
                can be exported as a PDF for audit submission.
              </td>
              <td className="s6">Management, Auditor, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R29"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  30
                </div>
              </th>
              <td className="s4">QR, Field Execution and Safety Checks</td>
              <td className="s8">* QR generation</td>
              <td className="s8">
                Unique QR code generated after final approval
              </td>
              <td className="s8">
                Each approved permit receives a unique QR code so field teams
                can access the permit directly at the worksite.
              </td>
              <td className="s8">
                After the final approval step is completed and digitally signed,
                the system automatically generates a unique QR code tied to that
                permit ID. The QR encodes the permit reference, site, and
                validity window. The QR cannot be generated before final
                approval, preventing unauthorized field access. The QR is
                displayed on the permit detail page and available for download.
                The QR can be printed and posted at the work zone.
              </td>
              <td className="s8">Safety Officer, Site Incharge, Field Teams</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R30"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  31
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">* QR generation</td>
              <td className="s6">Downloadable QR format</td>
              <td className="s6">
                The QR output is available in a downloadable form for on-site
                use.
              </td>
              <td className="s6">
                A dedicated Download QR button generates the QR code as a
                high-resolution PNG file that can be printed on A4 or label
                format for posting at the work zone. The downloaded file
                includes the permit ID, type, and validity dates as readable
                text below the QR image. Download events are logged against the
                permit.
              </td>
              <td className="s6">Safety Officer, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R31"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  32
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* QR scanning via FM Matrix app</td>
              <td className="s8">
                QR scanning through FM Matrix mobile application
              </td>
              <td className="s8">
                Site users can scan the permit QR code in the mobile app to open
                the field checklist and permit context.
              </td>
              <td className="s8">
                The FM Matrix mobile app includes a QR scanner that reads the
                permit QR at the worksite. On scan, the app calls the platform
                API to verify the permit status in real time: approved, active,
                held, suspended, expired, or closed. If the permit is active,
                the field safety checklist loads for completion. If the permit
                is in any other status, the scan returns the current status with
                a reason. Scan events with user ID and GPS coordinates are
                logged.
              </td>
              <td className="s8">Safety Officer, Field Teams, Supervisors</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R32"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  33
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Location-based permit activation</td>
              <td className="s8">
                Location-based permit activation and work-zone validation
              </td>
              <td className="s8">
                Permits can be activated only within the approved work zone to
                prevent misuse outside the designated area.
              </td>
              <td className="s8">
                GPS coordinates are captured at scan time and validated against
                the geo-fenced work zone configured for the permit site and
                location. If the scanning user is outside the permitted zone
                boundary, the checklist does not load and a location mismatch
                error is returned. This prevents permits from being used for
                work at wrong locations and creates a tamper-resistant
                activation record. Zone boundaries are set by the admin per
                site.
              </td>
              <td className="s8">Safety Officer, Field Teams</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R33"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  34
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Real-time checklist completion</td>
              <td className="s8">
                Real-time checklist completion after each scan
              </td>
              <td className="s8">
                The checklist is completed in the field and reflected
                immediately against the permit record.
              </td>
              <td className="s8">
                After a valid scan and location check, the field safety
                checklist loads on the mobile device. Checklist items are
                configured per permit type and may include visual inspection
                questions, PPE confirmation, area clearance checks, and
                equipment readiness items. Each response is submitted in real
                time to the platform and immediately visible in the permit
                detail view. The checklist supports photo attachment per item
                for visual evidence capture.
              </td>
              <td className="s8">Safety Officer, Field Teams, Supervisors</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R34"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  35
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Live safety check data on permit</td>
              <td className="s8">
                Live safety check data available on the permit detail page
              </td>
              <td className="s8">
                Each submitted safety check is visible in the permit record for
                monitoring and review.
              </td>
              <td className="s8">
                All field checklist responses are streamed to the permit detail
                page in near real time. The safety officer can monitor ongoing
                field activity from the web dashboard without being on site.
                Each checklist submission shows responder name, GPS location,
                timestamp, and individual item responses. Negative responses are
                flagged visually with a red indicator. The permit status updates
                based on checklist outcomes without manual intervention.
              </td>
              <td className="s8">Safety Officer, Site Incharge, Management</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R35"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  36
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Safety checklist</td>
              <td className="s5">Safety check data available for download</td>
              <td className="s5">
                Safety validation records can be exported or downloaded for
                compliance use.
              </td>
              <td className="s5">
                A Download Safety Checks button on the permit detail page
                exports all completed checklist records for that permit as a
                structured PDF or Excel file. The export includes responder
                details, timestamps, GPS coordinates, item-level responses, and
                any attached photos. This export is used as compliance evidence
                in audits, incident investigations, and contractor performance
                reviews.
              </td>
              <td className="s5">Safety Officer, Management, Auditor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R36"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  37
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Photo/video evidence capture</td>
              <td className="s6">
                Photo/video evidence capture before, during, and after work
              </td>
              <td className="s6">
                Mandatory visual proof can be attached to support
                accountability, compliance, and audit readiness.
              </td>
              <td className="s6">
                Configured per permit type, the platform can require photo or
                video uploads at defined workflow stages: before work commences
                (site condition), during work (activity in progress), and after
                work (site restoration). Mobile app capture or file upload from
                device gallery is supported. Evidence files are stored against
                the permit with stage label, uploader name, and timestamp.
                Mandatory evidence uploads block stage progression if not
                provided.
              </td>
              <td className="s6">Safety Officer, Field Teams, Supervisors</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R37"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  38
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Negative checklist response auto-hold</td>
              <td className="s8">
                Negative checklist response places permit on hold
              </td>
              <td className="s8">
                If a checklist item is marked unsafe or negative, the permit is
                stopped immediately.
              </td>
              <td className="s8">
                The platform is configured to treat specified checklist items as
                safety-critical. If a safety-critical item receives a negative
                or unsafe response during field completion, the system
                immediately changes the permit status to On Hold. The field user
                sees a Hold notification on the mobile app and cannot proceed.
                The hold action is logged with the item, the response given, the
                user, GPS, and timestamp. Only the designated site safety
                officer can resume the permit.
              </td>
              <td className="s8">Safety Officer, Field Teams</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R38"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  39
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Notifications</td>
              <td className="s6">
                Immediate email notification on negative remark
              </td>
              <td className="s6">
                Relevant stakeholders are alerted when a negative field response
                occurs.
              </td>
              <td className="s6">
                A negative field checklist response triggers an automated email
                to the configured notification group: the site safety officer,
                site incharge, permit requestor, and safety manager. The email
                contains the permit ID, site, work description, checklist item,
                response given, responder name, and timestamp. Notification
                dispatch is logged. Escalation emails are sent to the next level
                if the hold is not addressed within the configured escalation
                window.
              </td>
              <td className="s6">Safety Officer, Site Incharge, Management</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R39"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  40
                </div>
              </th>
              <td className="s7"></td>
              <td className="s5">Notifications</td>
              <td className="s5">
                Hold notification sent to vendor and other stakeholders
              </td>
              <td className="s5">
                The platform distributes the hold status to the participants
                connected to the permit.
              </td>
              <td className="s5">
                When a permit is placed on hold (by field response or manual
                safety officer action), the vendor assigned to the permit
                receives a hold notification by email with the hold reason and
                any attached comments. Other stakeholders configured in the
                notification group are also notified. The hold reason is visible
                in the permit list view for all users with access to that
                permit. Hold history is retained in the permit timeline.
              </td>
              <td className="s5">Vendor, Safety Officer, Site Incharge</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R40"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  41
                </div>
              </th>
              <td className="s4">Permit Monitoring and List Management</td>
              <td className="s6">Central register</td>
              <td className="s6">Centralized permit list</td>
              <td className="s6">
                All permits are visible from one list so teams can monitor the
                permit portfolio in one place.
              </td>
              <td className="s6">
                The permit list page shows all permits accessible to the
                logged-in user based on their role and site access permissions.
                Each row displays the permit ID, type, site, location,
                requestor, current status, created date, and validity end date.
                The list supports pagination for high-volume sites. Site cluster
                heads and management can toggle between sites to view a
                consolidated permit register. Status badges use color coding for
                immediate recognition.
              </td>
              <td className="s6">All roles</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R41"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  42
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Central register</td>
              <td className="s5">Real-time permit progress tracker</td>
              <td className="s5">
                Status changes are reflected live so teams can see where each
                permit stands.
              </td>
              <td className="s5">
                Permit status updates driven by workflow actions (vendor
                submission, approval, QR activation, hold, resume, extension,
                closure) are reflected in the permit list and detail view in
                near real time without manual refresh. A status timeline on the
                permit detail page shows the chronological sequence of all
                status transitions with the user and timestamp of each change.
                This gives safety and operations teams live situational
                awareness.
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R42"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  43
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Central register</td>
              <td className="s6">
                Multi-status visibility (draft, pending, approved, active,
                on-hold, closed)
              </td>
              <td className="s6">
                The list supports the end-to-end permit lifecycle across all key
                states.
              </td>
              <td className="s6">
                Six primary permit states are tracked: Draft (created, not
                submitted), Pending (in vendor or internal review/approval),
                Approved (final approval complete, QR generated), Active (field
                execution in progress), On Hold (stopped by safety breach or
                safety officer action), and Closed (formally closed with
                evidence). Suspended and Cancelled statuses are also tracked.
                Filter chips on the list page allow instant toggle between
                status views.
              </td>
              <td className="s6">All roles</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R43"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  44
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Filters and sorting</td>
              <td className="s5">Intuitive filtering and sorting</td>
              <td className="s5">
                Users can quickly narrow down permits by relevant criteria.
              </td>
              <td className="s5">
                The permit list supports multi-criteria filtering: by permit
                type, status, site, location, requestor, vendor, date range, and
                risk level. Filters are combinable. Sort controls on each column
                allow ascending or descending ordering. Active filter selections
                are shown as tags above the list for clarity. Filters can be
                saved as named views for frequent monitoring scenarios (e.g.,
                All Active Hot Work Permits - Site A).
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R44"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  45
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Filters and sorting</td>
              <td className="s6">Vendor name sorting</td>
              <td className="s6">
                Vendor name is available as a sortable field to make list
                handling easier.
              </td>
              <td className="s6">
                The vendor name column in the permit list is sortable in
                ascending or descending order. This allows operations and safety
                teams to quickly group all permits assigned to a specific
                contractor for contractor performance review, hold management,
                or renewal planning.
              </td>
              <td className="s6">Site Incharge, Safety Officer</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R45"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  46
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Metadata display</td>
              <td className="s5">
                Permit ID, type, location, designation, and created by/on
              </td>
              <td className="s5">
                The list page exposes key permit metadata for quick
                identification and follow-up.
              </td>
              <td className="s5">
                Each permit row in the list displays: a system-generated permit
                ID, reference number, permit type name, the subject of the work
                (permit for), created by (requestor name), created on (date),
                work description (truncated), site, location, and current
                designation/role in the workflow. Hovering over truncated fields
                shows the full value. These fields are available as column
                exports when the list is downloaded.
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R46"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  47
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Validity monitoring</td>
              <td className="s6">
                Permit validity tracker and expiry tracking
              </td>
              <td className="s6">
                Users can see whether a permit is approaching expiry or needs
                action.
              </td>
              <td className="s6">
                Permit validity is auto-calculated from the time of final
                approval and the validity duration configured for the permit
                type. The permit list shows each permit&#39;s validity end
                datetime. Permits approaching expiry within a configurable
                warning window (e.g., 4 hours, 24 hours) are highlighted with an
                amber indicator. Expired permits that were not extended or
                closed are flagged red. Upcoming scheduled permits are visible
                in a separate view for proactive planning.
              </td>
              <td className="s6">Safety Officer, Site Incharge, Management</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R47"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  48
                </div>
              </th>
              <td className="s7"></td>
              <td className="s5">Actions</td>
              <td className="s5">Quick action access from the list page</td>
              <td className="s5">
                Core permit actions can be initiated directly from the list
                view.
              </td>
              <td className="s5">
                A contextual actions menu on each permit row in the list exposes
                the permitted actions for that user&#39;s role and the
                permit&#39;s current status. Actions include: View Details,
                Complete (vendor or internal), Approve, Hold, Resume, Extend,
                Close, Download, and View QR. This eliminates navigating into
                the permit detail page for routine actions and speeds up bulk
                permit management.
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R48"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  49
                </div>
              </th>
              <td className="s4">Permit Control Actions</td>
              <td className="s6">Extension management</td>
              <td className="s6">Request permit extension before expiry</td>
              <td className="s6">
                A live permit can be extended when the work scope continues
                beyond the current validity window.
              </td>
              <td className="s6">
                An Extend Permit option is available on active permits before
                their validity ends. The requestor specifies the extended end
                date and a reason for extension. The extension request routes
                through a configured approval step (typically safety officer or
                site incharge). On approval, the permit validity is updated and
                a revised QR validity window is applied. Extension history is
                logged with requester, approver, original validity, and new
                validity.
              </td>
              <td className="s6">Permit Requestor, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R49"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  50
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Extension management</td>
              <td className="s5">
                Select assignees for extension or include all manpower
              </td>
              <td className="s5">
                The extension request can be scoped to selected workers or the
                full manpower list.
              </td>
              <td className="s5">
                During extension request creation, the requestor can choose to
                apply the extension to all manpower listed on the permit or
                select specific workers from the manpower table. This allows
                partial team continuations (e.g., only certified workers remain
                on site for overtime work) to be captured accurately in the
                permit record.
              </td>
              <td className="s5">Permit Requestor</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R50"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  51
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Extension management</td>
              <td className="s6">Repeat extension until permit expiry limit</td>
              <td className="s6">
                Multiple extensions are possible as long as the permit remains
                within its valid time window.
              </td>
              <td className="s6">
                The system allows multiple sequential extensions provided the
                cumulative extended end date does not exceed the maximum
                validity limit configured for the permit type. Each extension is
                a separate logged event. The permit detail page shows a timeline
                of all original and extended validity windows for full
                traceability.
              </td>
              <td className="s6">Permit Requestor, Safety Officer</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R51"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  52
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Extension management</td>
              <td className="s5">Block extension after expiry</td>
              <td className="s5">
                Once the permit has expired, it cannot be extended further.
              </td>
              <td className="s5">
                The Extend option is programmatically disabled on permits that
                have reached their validity end datetime. An expired permit must
                be closed and a new permit raised for any continuation of the
                work. This business rule prevents unauthorized extension of
                lapsed permits and enforces a controlled re-approval cycle for
                expired work.
              </td>
              <td className="s5">System-enforced</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R52"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  53
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Hold and resume</td>
              <td className="s6">
                Place permit on hold for deviations or unsafe conditions
              </td>
              <td className="s6">
                The permit can be paused if execution conditions change or a
                safety issue is identified.
              </td>
              <td className="s6">
                A Hold Permit action is available to designated safety officer
                and site incharge roles on any active permit. The user must
                enter a hold reason before the hold is confirmed. On hold, the
                permit status changes to On Hold, the QR becomes inactive
                (scanning returns a Hold status), and notifications are
                dispatched to vendor, requestor, and safety stakeholders. Hold
                timestamp and reason are recorded in the permit timeline.
              </td>
              <td className="s6">Safety Officer, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R53"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  54
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">Hold and resume</td>
              <td className="s8">
                * Resume held permit without a fresh approval cycle
              </td>
              <td className="s8">
                Designated site safety officers can restart a held permit
                without raising a completely new permit.
              </td>
              <td className="s8">
                The Resume Permit action is restricted to the site safety
                officer role. On initiating resume, the safety officer must
                complete an undertaking step confirming that the unsafe
                condition has been resolved and that work can safely restart.
                The undertaking is digitally signed and stored against the
                permit. On completion, the permit status reverts to Active and
                the QR reactivates. A resume notification is sent to all
                stakeholders. No new approval cycle is required unless
                configured otherwise.
              </td>
              <td className="s8">Site Safety Officer</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R54"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  55
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Hold and resume</td>
              <td className="s6">
                Undertaking/signing requirement before resume
              </td>
              <td className="s6">
                Resumption is controlled by an undertaking step so the
                responsibility is recorded.
              </td>
              <td className="s6">
                Before a held permit can be resumed, the site safety officer
                must complete a structured undertaking form. The undertaking
                captures: confirmation that the hazard has been addressed, the
                corrective action taken, the safety officer&#39;s digital
                signature, and the datetime of sign-off. This undertaking record
                is appended to the permit&#39;s hold/resume log and is available
                as audit evidence. Without this step, the Resume action does not
                complete.
              </td>
              <td className="s6">Site Safety Officer</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R55"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  56
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Hold and resume</td>
              <td className="s5">Auto permit suspension on safety violation</td>
              <td className="s5">
                Active permits can be suspended automatically when
                non-compliance is detected, with reason and corrective action
                required.
              </td>
              <td className="s5">
                Integration with the safety breach alert engine allows the
                platform to automatically move an active permit to Suspended
                status when a configured safety violation event is received
                (e.g., critical checklist failure, breach of geo-fence,
                integration with incident management system). On suspension, all
                permit actions are locked, a suspension reason is recorded, and
                escalation notifications are sent to site and management
                stakeholders. Reinstatement requires a formal corrective action
                review and safety officer approval.
              </td>
              <td className="s5">System-enforced, Safety Officer</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R56"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  57
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Closure</td>
              <td className="s6">Complete permit / close permit</td>
              <td className="s6">
                The permit can be formally closed once the work is finished and
                approved for closure.
              </td>
              <td className="s6">
                A Close Permit option is available on active permits. The
                initiating user selects Close and is presented with the closure
                form. The closure action requires a mandatory completion comment
                and at least one supporting attachment (site restoration photo,
                completion certificate, or sign-off document). These
                requirements are enforced by the system and cannot be bypassed.
                On completion of the closure form, the closure request routes to
                the final approver for sign-off.
              </td>
              <td className="s6">Permit Requestor, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R57"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  58
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Closure</td>
              <td className="s5">
                Mandatory completion comment and closure attachments
              </td>
              <td className="s5">
                Closure cannot be submitted without the required comment and
                supporting evidence.
              </td>
              <td className="s5">
                The closure form has a mandatory text field for the completion
                comment (minimum character count enforced) and a document upload
                field that requires at least one attachment. Both fields are
                validated on submission. If either is missing, an error is
                returned and the closure cannot proceed. The comment and
                attachments are stored as part of the permit&#39;s closure
                record in the audit trail.
              </td>
              <td className="s5">Permit Requestor, Site Incharge</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R58"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  59
                </div>
              </th>
              <td className="s7"></td>
              <td className="s6">Closure</td>
              <td className="s6">
                Final approval to set permit status to closed
              </td>
              <td className="s6">
                The permit moves to closed only after the closure request has
                been approved.
              </td>
              <td className="s6">
                The closure request routes to the designated final approver
                (typically safety officer or site incharge) for review of the
                completion comment and attached evidence. The approver can
                approve or reject the closure. On approval, the permit status is
                set to Closed and the closure timestamp is recorded. The permit
                is moved to the closed permits register and is no longer
                editable. All historical data remains accessible for audit.
              </td>
              <td className="s6">Safety Officer, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R59"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  60
                </div>
              </th>
              <td className="s4">Communication and Collaboration</td>
              <td className="s5">Comments</td>
              <td className="s5">Add comments during work or after closure</td>
              <td className="s5">
                Users can leave ongoing remarks against the permit at any point
                in its lifecycle.
              </td>
              <td className="s5">
                A Comments section is available on every permit detail page. Any
                user with permit access can add a comment at any lifecycle stage
                including after closure. Comments support plain text and file
                attachment. Each comment shows the commenter&#39;s name, role,
                and timestamp. Comments are threaded in chronological order and
                cannot be deleted, preserving the full communication record.
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R60"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  61
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Comments</td>
              <td className="s6">
                Comment log for internal communication and tracking
              </td>
              <td className="s6">
                Every comment is retained so the permit history stays visible
                and searchable.
              </td>
              <td className="s6">
                All comments added to a permit form a persistent, immutable
                comment log that is part of the permit&#39;s audit trail. The
                comment log is downloadable as part of the full permit export.
                Safety officers can reference the comment log during incident
                investigations to reconstruct the sequence of decisions and
                communications around a specific permit.
              </td>
              <td className="s6">All roles, Auditor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R61"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  62
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Notifications</td>
              <td className="s5">
                Post-creation intimation emails to stakeholders
              </td>
              <td className="s5">
                Stakeholders are informed when the permit moves to the next
                stage.
              </td>
              <td className="s5">
                Automated email notifications are configured per permit workflow
                event: vendor assignment after creation, internal review trigger
                after vendor submission, approval requests, hold alerts, resume
                confirmations, extension approvals, and closure confirmations.
                Each notification includes the permit ID, type, site, current
                status, and a direct link to the permit. Notification recipients
                are configured per event type in the master setup.
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R62"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  63
                </div>
              </th>
              <td className="s7"></td>
              <td className="s6">Notifications</td>
              <td className="s6">
                Escalation emails for negative comments and hold status
              </td>
              <td className="s6">
                Higher-level safety and site stakeholders receive notifications
                when a permit is flagged or held.
              </td>
              <td className="s6">
                A configurable escalation matrix defines who should receive
                escalation notifications and after what time threshold if a hold
                is not addressed or a negative safety comment is not resolved.
                Escalation levels can include site cluster heads, EHS managers,
                and facility directors. Escalation events are logged in the
                permit audit trail. Repeated escalations within a permit
                lifecycle are visible in the management dashboard.
              </td>
              <td className="s6">Safety Officer, Management, EHS Leaders</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R63"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  64
                </div>
              </th>
              <td className="s4">Master Setup and Configuration</td>
              <td className="s8">* Permit taxonomy setup</td>
              <td className="s8">
                Configurable permit types, activities, sub-activities, hazard
                categories, risk levels
              </td>
              <td className="s8">
                Admin can define the permit structure by work type, hazard
                profile, and control requirements so the workflow stays standard
                across all permit requests.
              </td>
              <td className="s8">
                The admin interface provides a structured setup wizard for
                defining permit types. For each permit type, the admin
                configures: display name, applicable activity and sub-activity
                tree, associated hazard categories, risk level thresholds,
                required safety equipment list, mandatory JSA requirement,
                approval chain, validity duration, and notification group.
                Changes to the taxonomy trigger a version record so historical
                permits retain their original configuration context.
              </td>
              <td className="s8">Admin, Master Data Owner</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R64"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  65
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Preloaded permit templates</td>
              <td className="s8">
                Preloaded permit templates with customizable fields
              </td>
              <td className="s8">
                Permit templates can be preconfigured and edited to match
                site-specific or permit-type-specific data requirements.
              </td>
              <td className="s8">
                The platform ships with standard permit templates for common
                permit types (Hot Work, Confined Space Entry, Electrical
                Isolation, Working at Height, Cold Work, Chemical Handling).
                Each template defines the section layout, field types, mandatory
                indicators, and default content. Admins can duplicate a template
                and customize field labels, add site-specific fields, reorder
                sections, and configure conditional field visibility. Templates
                are versioned and can be assigned to specific permit types and
                sites.
              </td>
              <td className="s8">Admin, Master Data Owner</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R65"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  66
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Preloaded JSA templates</td>
              <td className="s8">Preloaded JSA templates by permit type</td>
              <td className="s8">
                Job safety analysis templates can be mapped to permit types so
                the safety content is aligned with the work category.
              </td>
              <td className="s8">
                JSA templates are maintained as a separate library in the master
                setup. Each JSA template defines the activity steps, hazard
                descriptions, control measures, and responsible role columns.
                Templates are mapped to one or more permit types so that when a
                relevant permit type is selected during permit creation, the
                corresponding JSA template pre-loads within the permit workflow.
                JSA templates are version-controlled and can be exported as PDF.
              </td>
              <td className="s8">Admin, Safety Officer</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R66"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  67
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Role-based access control</td>
              <td className="s8">
                Role-based access control for creators, approvers, and reviewers
              </td>
              <td className="s8">
                System access is controlled by role so each user sees and acts
                only on the permits and actions relevant to them.
              </td>
              <td className="s8">
                RBAC is configured in the user management module. Roles include:
                Permit Requestor, Vendor, Supervisor, Safety Officer, Site
                Safety Officer, Site Incharge, Approver, Admin, and
                Management/Auditor. Each role has a defined set of permitted
                actions (create, edit, approve, hold, resume, extend, close,
                view, configure). Site-level access scoping ensures users see
                only permits for their assigned sites and locations. Role
                assignments are logged and auditable.
              </td>
              <td className="s8">Admin</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R67"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  68
                </div>
              </th>
              <td className="s4"></td>
              <td className="s8">* Approval rule engine</td>
              <td className="s8">Approval rule engine</td>
              <td className="s8">
                Approval logic can be configured so permits route correctly
                based on role, site, permit type, or risk conditions.
              </td>
              <td className="s8">
                The approval rule engine allows admins to define multi-level
                approval chains. Configuration parameters include: permit type,
                risk level, site, location, and manpower count thresholds. Rules
                can define sequential or parallel approvals, time-based
                escalation, substitute approver assignment, and bypass rules for
                low-risk permit types. Changes to approval rules are versioned
                and apply only to new permits, not in-progress ones.
              </td>
              <td className="s8">Admin, Master Data Owner</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R68"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  69
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Vendor master</td>
              <td className="s6">Vendor master preload and maintenance</td>
              <td className="s6">
                Vendor records can be maintained centrally and selected from a
                standard list during permit creation.
              </td>
              <td className="s6">
                The vendor master stores company name, registration number,
                category, approved service types, primary contact, compliance
                status, and document expiry dates. Admins can bulk upload
                vendors via CSV or add them individually. Vendor compliance
                status (active, suspended, expired documents) is visible in the
                permit creation form and blocks assignment of non-compliant
                vendors. Vendor records are version-tracked.
              </td>
              <td className="s6">Admin, Master Data Owner</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R69"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  70
                </div>
              </th>
              <td className="s7"></td>
              <td className="s8">* Auto-calculated permit validity</td>
              <td className="s8">
                Auto-calculated validity by permit type and final approval time
              </td>
              <td className="s8">
                Permit expiry is determined by the permit type and the time of
                final approval, removing manual expiry entry.
              </td>
              <td className="s8">
                The validity duration for each permit type is defined in the
                master setup (e.g., Hot Work: 8 hours, General Maintenance: 24
                hours, Confined Space: 4 hours). When the final approval is
                completed and the digital signature is captured, the system
                calculates the permit expiry timestamp by adding the configured
                duration to the approval timestamp. The calculated expiry is
                displayed in the permit header and drives the validity tracker,
                QR status, and extension logic.
              </td>
              <td className="s8">System-enforced</td>
              <td className="s8">* USP</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R70"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  71
                </div>
              </th>
              <td className="s4">Dashboard, Reporting and Analytics</td>
              <td className="s6">Dashboard view</td>
              <td className="s6">
                Real-time graphical permit status dashboard
              </td>
              <td className="s6">
                The platform summarizes permit volumes and status in a visual
                dashboard.
              </td>
              <td className="s6">
                The operations and safety dashboard provides graphical widgets
                showing: total active permits, permits on hold, permits expiring
                within 24 hours, permits closed today, permits by type, permits
                by site, and approval turnaround time. Charts update in near
                real time as permits move through the workflow. Dashboard access
                is role-filtered: safety officers see safety metrics; management
                sees site comparison and trend data.
              </td>
              <td className="s6">Safety Officer, Site Incharge, Management</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R71"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  72
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Dashboard view</td>
              <td className="s5">Site-wise comparison</td>
              <td className="s5">
                Teams can compare permit activity across sites or locations.
              </td>
              <td className="s5">
                A multi-site comparison widget on the management dashboard shows
                permit volume, hold rate, average approval time, and closure
                rate by site for the selected date range. Site performance can
                be benchmarked side by side. Cluster heads with access to
                multiple sites can identify outlier sites with high hold rates
                or low closure compliance. Data can be exported as a report.
              </td>
              <td className="s5">Management, EHS Leaders</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R72"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  73
                </div>
              </th>
              <td className="s7"></td>
              <td className="s6">Reporting</td>
              <td className="s6">Approval metrics and status reporting</td>
              <td className="s6">
                The solution surfaces operational metrics that help with
                oversight and management review.
              </td>
              <td className="s6">
                Preconfigured reports include: Permit Activity Summary (by date,
                site, type), Approval Turnaround Report (average time per
                approval level), Hold and Resume Analysis (frequency, reasons,
                resolution time), Vendor Compliance Report (document expiry,
                hold frequency per vendor), and Safety Check Compliance Report
                (checklist completion rate, negative response frequency).
                Reports are exportable as PDF or Excel and can be scheduled for
                email delivery.
              </td>
              <td className="s6">Management, EHS Leaders, Auditor</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R73"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  74
                </div>
              </th>
              <td className="s4">Audit Trail, Compliance and Integrations</td>
              <td className="s5">Audit trail</td>
              <td className="s5">
                End-to-end approval, attachment, comment, and action logs
              </td>
              <td className="s5">
                The system keeps a traceable record of the entire permit history
                for audits and investigations.
              </td>
              <td className="s5">
                Every action taken on a permit from creation to closure is
                recorded in an immutable audit log: field edits (before/after
                values), approval actions, digital signatures, attachment
                uploads, comments, hold/resume events, extension requests,
                safety check submissions, QR scan events, and closure evidence.
                The audit log is accessible from the permit detail page and can
                be exported as a timestamped PDF for regulatory audit
                submission.
              </td>
              <td className="s5">Auditor, Management, Safety Officer</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R74"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  75
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Compliance evidence</td>
              <td className="s6">
                Traceability for safety and compliance reviews
              </td>
              <td className="s6">
                The permit record supports compliance review by storing
                approvals, safety checks, documents, and closures together.
              </td>
              <td className="s6">
                All compliance-relevant artifacts (approval chain with digital
                signatures, JSA, safety check responses with GPS and photo
                evidence, vendor documents, closure comment and attachments) are
                stored together under the permit record and retrievable by
                permit ID. Compliance officers can pull the full dossier for any
                permit in seconds for ISO 45001, OSHA, Factory Act, or client
                EHS audit requirements.
              </td>
              <td className="s6">Auditor, EHS Leaders, Management</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R75"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  76
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Integrations</td>
              <td className="s5">Incident management integration</td>
              <td className="s5">
                The permit system can connect to incident workflows where
                needed.
              </td>
              <td className="s5">
                When a safety breach, hold event, or permit suspension occurs,
                the platform can push a notification or event record to the
                connected incident management system. Permit ID, type, site,
                hold reason, and involved parties are included in the
                integration payload. This links the permit record to any
                incident case raised as a result, creating a connected safety
                evidence chain for investigation and root cause analysis.
              </td>
              <td className="s5">Safety Officer, EHS Leaders</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R76"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  77
                </div>
              </th>
              <td className="s4"></td>
              <td className="s6">Integrations</td>
              <td className="s6">Asset management integration</td>
              <td className="s6">
                The platform can share or receive data from asset-related
                systems.
              </td>
              <td className="s6">
                Permit creation can reference asset IDs from a connected asset
                management or CMMS system. When an asset-tagged permit is
                created, the asset&#39;s maintenance history and current status
                can be pulled as context. Completed permit records can be pushed
                back to the asset management system to update the asset&#39;s
                maintenance log. This integration is configured via REST API and
                supports major CMMS platforms.
              </td>
              <td className="s6">Admin, Site Incharge</td>
              <td className="s6"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R77"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  78
                </div>
              </th>
              <td className="s4"></td>
              <td className="s5">Integrations</td>
              <td className="s5">Notification tool integration</td>
              <td className="s5">
                The system supports notification workflows through connected
                communication tools.
              </td>
              <td className="s5">
                In addition to email, the notification engine can be configured
                to push permit alerts to connected communication platforms (MS
                Teams, Slack, or WhatsApp Business API). Notification type,
                recipient group, and channel are configurable per event type in
                the master setup. This ensures permit alerts reach site teams
                through the channels they actively monitor.
              </td>
              <td className="s5">All roles</td>
              <td className="s5"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1360696289R78"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  79
                </div>
              </th>
              <td className="s7"></td>
              <td className="s6">Integrations</td>
              <td className="s6">FM Matrix mobile application integration</td>
              <td className="s6">
                The mobile app supports scanning, checklist capture, and permit
                field actions.
              </td>
              <td className="s6">
                The FM Matrix Android and iOS mobile application is fully
                integrated with the PTW platform. The app supports: user login
                with role-based view, permit inbox access, QR scanning for field
                execution, GPS-enabled location validation, real-time checklist
                completion, photo and video upload, hold notifications, and
                permit status viewing. The app functions in low-connectivity
                environments by caching data locally and syncing on
                reconnection.
              </td>
              <td className="s6">
                Safety Officer, Field Teams, Supervisors, Vendor
              </td>
              <td className="s6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
