export default function GateProductRoadmapContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle" cellSpacing={0} cellPadding={0}>
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr" />
              <th
                id="741551836C0"
                style={{ width: 34 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="741551836C1"
                style={{ width: 181 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="741551836C2"
                style={{ width: 181 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="741551836C3"
                style={{ width: 279 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="741551836C4"
                style={{ width: 139 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="741551836C5"
                style={{ width: 139 }}
                className="column-headers-background"
              >
                F
              </th>
              <th
                id="741551836C6"
                style={{ width: 139 }}
                className="column-headers-background"
              >
                G
              </th>
              <th
                id="741551836C7"
                style={{ width: 139 }}
                className="column-headers-background"
              >
                H
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 36 }}>
              <th
                id="741551836R0"
                style={{ height: 36 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 36 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan={8}>
                Gate Management Platform - Product Roadmap
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="741551836R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan={8}>
                Three phases. Each phase ends with a summary row showing total
                items, segments unlocked, and estimated revenue impact.
              </td>
            </tr>
            <tr style={{ height: 52 }}>
              <th
                id="741551836R2"
                style={{ height: 52 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 52 }}>
                  3
                </div>
              </th>
              <td className="s2">#</td>
              <td className="s2">Phase</td>
              <td className="s2">Initiative</td>
              <td className="s2">Description and Deliverable</td>
              <td className="s2">Target Segment Unlocked</td>
              <td className="s2">Dependencies</td>
              <td className="s2">Timeline</td>
              <td className="s2">Revenue Impact</td>
            </tr>
            <tr style={{ height: 25 }}>
              <th
                id="741551836R3"
                style={{ height: 25 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 25 }}>
                  4
                </div>
              </th>
              <td className="s3" colSpan={8}>
                Phase 1 - Core Hardening and Integration (Months 1-6)
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R4"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  5
                </div>
              </th>
              <td className="s4">1</td>
              <td className="s4">Phase 1</td>
              <td className="s5">HRMS Bi-Directional Sync</td>
              <td className="s4">
                Enable real-time sync with major Indian HRMS platforms (Keka,
                Darwinbox, greytHR) so staff rosters, contractor deployments,
                and employee directories are automatically reflected in the gate
                system without manual import.
              </td>
              <td className="s4">
                IT/ITES campuses, SEZs, manufacturing plants with large
                contractor populations
              </td>
              <td className="s4">
                API access from HRMS vendors; product engineering effort 6 weeks
              </td>
              <td className="s4">Month 3</td>
              <td className="s4">
                High - unlocks large enterprise IT and manufacturing deals where
                HRMS sync is a procurement requirement
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R5"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  6
                </div>
              </th>
              <td className="s6">2</td>
              <td className="s6">Phase 1</td>
              <td className="s7">ANPR Full Camera Integration</td>
              <td className="s6">
                Expand ANPR support to work with top 5 CCTV and ANPR camera
                brands used in India (Hikvision, Dahua, CP Plus, Bosch, Hanwha).
                Implement automatic plate-to-vehicle record matching and boom
                barrier trigger without guard action.
              </td>
              <td className="s6">
                Industrial parks, corporate campuses, large residential
                townships with CCTV infrastructure
              </td>
              <td className="s6">
                Hardware SDK or RTSP stream access; camera brand certification;
                8-week engineering sprint
              </td>
              <td className="s6">Month 4</td>
              <td className="s6">
                High - ANPR is a key differentiator for industrial and large
                campus deals above INR 10,000/month
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R6"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  7
                </div>
              </th>
              <td className="s4">3</td>
              <td className="s4">Phase 1</td>
              <td className="s5">Meeting Room Integration</td>
              <td className="s4">
                Connect the visitor module to Google Calendar, Microsoft 365,
                and Outlook meeting invites so that a visitor invitation from an
                employee's calendar automatically creates an expected visitor
                entry at the gate.
              </td>
              <td className="s4">
                Corporate offices, IT parks, co-working spaces, co-living
                meeting rooms
              </td>
              <td className="s4">
                OAuth integration with Google and Microsoft; 4-week engineering
                sprint
              </td>
              <td className="s4">Month 3</td>
              <td className="s4">
                Medium - reduces friction for corporate buyers comparing Gate
                Management against Veris and Envoy
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R7"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  8
                </div>
              </th>
              <td className="s6">4</td>
              <td className="s6">Phase 1</td>
              <td className="s7">Payment Gateway Integration</td>
              <td className="s6">
                Enable in-app payment flows for parking fee collection, visitor
                pass charges, and community event access fees. Support UPI, net
                banking, and card payments through Razorpay or PayU integration.
              </td>
              <td className="s6">
                Malls, residential societies with paid parking, co-working
                operators charging day-pass fees
              </td>
              <td className="s6">
                Razorpay or PayU merchant onboarding; 3-week engineering sprint
              </td>
              <td className="s6">Month 2</td>
              <td className="s6">
                Medium - creates a recurring transaction revenue stream
                alongside SaaS subscription
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R8"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  9
                </div>
              </th>
              <td className="s4">5</td>
              <td className="s4">Phase 1</td>
              <td className="s5">
                Bulk Resident and Employee Onboarding via CSV
              </td>
              <td className="s4">
                Streamline property onboarding by supporting CSV upload for
                resident, employee, and vehicle master data. Include validation,
                error reporting, and conflict resolution in the upload workflow.
              </td>
              <td className="s4">
                All segments - reduces deployment time from 2 weeks to 2 days
                for new property onboarding
              </td>
              <td className="s4">
                Product design and engineering; 2-week sprint
              </td>
              <td className="s4">Month 1</td>
              <td className="s4">
                High - reduces customer success cost and shortens time-to-live
                for new properties
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R9"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  10
                </div>
              </th>
              <td className="s6">6</td>
              <td className="s6">Phase 1</td>
              <td className="s7">Mobile App for Management Reviewer Role</td>
              <td className="s6">
                Build a dedicated mobile dashboard for property managers and RWA
                chairpersons showing daily movement counts, open incidents,
                patrol compliance, and exception alerts in a non-operational
                read-only view.
              </td>
              <td className="s6">
                Residential RWA committees, property management companies, REIT
                portfolio managers
              </td>
              <td className="s6">
                Mobile engineering effort; connects to existing API endpoints;
                3-week sprint
              </td>
              <td className="s6">Month 2</td>
              <td className="s6">
                Medium - increases product stickiness with decision-maker
                personas who influence contract renewal
              </td>
            </tr>
            <tr style={{ height: 39 }}>
              <th
                id="741551836R10"
                style={{ height: 39 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 39 }}>
                  11
                </div>
              </th>
              <td className="s8" colSpan={8}>
                Phase 1 Summary: 6 initiatives | Segments unlocked: all
                user-specified industries | Estimated revenue impact: INR
                50L-1.5Cr ARR uplift from new enterprise deals unlocked
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="741551836R11"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  12
                </div>
              </th>
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
            </tr>
            <tr style={{ height: 25 }}>
              <th
                id="741551836R12"
                style={{ height: 25 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 25 }}>
                  13
                </div>
              </th>
              <td className="s3" colSpan={8}>
                Phase 2 - Vertical Depth and Market Expansion (Months 7-12)
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R13"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  14
                </div>
              </th>
              <td className="s4">7</td>
              <td className="s4">Phase 2</td>
              <td className="s5">
                EHS Compliance Pack for Industrial and Manufacturing
              </td>
              <td className="s4">
                Create a preconfigured EHS incident reporting module with
                factory inspector-approved categories, injury classification
                matching the Factories Act format, and one-click compliance
                report generation for ISO 45001 and OHSAS 18001 audits.
              </td>
              <td className="s4">
                Manufacturing, pharma, chemicals, FMCG, automotive, SEZs,
                industrial parks
              </td>
              <td className="s4">
                Legal review of compliance format requirements; product design
                effort 4 weeks; EHS regulation mapping
              </td>
              <td className="s4">Month 8</td>
              <td className="s4">
                High - opens a segment that pays INR 15,000-50,000/month and has
                long contract durations due to regulatory dependency
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R14"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  15
                </div>
              </th>
              <td className="s6">8</td>
              <td className="s6">Phase 2</td>
              <td className="s7">
                NABH-Ready Incident Reporting for Healthcare
              </td>
              <td className="s6">
                Add NABH-specific incident categories, mandatory fields for
                patient safety incidents, and a report template that matches
                NABH accreditation requirements. Include integration with
                hospital HMIS systems for patient identity verification.
              </td>
              <td className="s6">
                Hospitals, healthcare chains, clinics, diagnostic centers
              </td>
              <td className="s6">
                NABH standard review; hospital IT integration specifications;
                4-week sprint
              </td>
              <td className="s6">Month 9</td>
              <td className="s6">
                High - healthcare clients with NABH accreditation have zero
                tolerance for non-compliant incident documentation, creating
                strong lock-in
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R15"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  16
                </div>
              </th>
              <td className="s4">9</td>
              <td className="s4">Phase 2</td>
              <td className="s5">Smart Parcel Locker Integration</td>
              <td className="s4">
                Connect the Parcel Management module to leading smart locker
                hardware vendors (Quadient, Luxer One, Parcel Pending) so
                delivery persons can deposit parcels without requiring resident
                presence.
              </td>
              <td className="s4">
                Premium residential communities, co-living operators, corporate
                campuses with high parcel volumes
              </td>
              <td className="s4">
                Hardware vendor SDK or API; 6-week integration sprint
              </td>
              <td className="s4">Month 10</td>
              <td className="s4">
                Medium - premium residential and co-living operators will pay a
                hardware + SaaS bundled price
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R16"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  17
                </div>
              </th>
              <td className="s6">10</td>
              <td className="s6">Phase 2</td>
              <td className="s7">Visitor Rating and Feedback System</td>
              <td className="s6">
                Enable residents, employees, and hosts to rate staff, vendors,
                and service providers after each visit. Aggregate ratings are
                visible to facility admins and can be used to flag recurring
                issues or recognize reliable vendors.
              </td>
              <td className="s6">
                Residential communities, co-living, corporate campuses with
                large vendor populations
              </td>
              <td className="s6">Product design; 3-week engineering sprint</td>
              <td className="s6">Month 7</td>
              <td className="s6">
                Low-Medium - improves retention by increasing resident and host
                engagement with the platform
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R17"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  18
                </div>
              </th>
              <td className="s4">11</td>
              <td className="s4">Phase 2</td>
              <td className="s5">Regional Language Support</td>
              <td className="s4">
                Add Hindi, Tamil, Telugu, Kannada, and Marathi language support
                for guard-facing screens and resident notifications. Guards in
                tier-2 and tier-3 cities frequently struggle with English-only
                interfaces.
              </td>
              <td className="s4">
                All India segments - especially tier-2 and tier-3 residential
                and industrial markets
              </td>
              <td className="s4">
                Translation and localization; 4-week sprint per language
              </td>
              <td className="s4">Month 8</td>
              <td className="s4">
                Medium - required to win tier-2 and tier-3 deals where guards
                are not English-literate
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R18"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  19
                </div>
              </th>
              <td className="s6">12</td>
              <td className="s6">Phase 2</td>
              <td className="s7">Contractor and Vendor Management Portal</td>
              <td className="s6">
                Build a self-service contractor portal where vendors can upload
                their documents, validity certificates, and vehicle registration
                before their first visit. The portal feeds into the staff master
                for guard-side validation.
              </td>
              <td className="s6">
                Industrial parks, manufacturing, commercial real estate,
                hospitals, pharma with large contractor populations
              </td>
              <td className="s6">Web portal development; 5-week sprint</td>
              <td className="s6">Month 11</td>
              <td className="s6">
                High - removes a major operational burden from facility admins
                who currently collect contractor documents manually
              </td>
            </tr>
            <tr style={{ height: 39 }}>
              <th
                id="741551836R19"
                style={{ height: 39 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 39 }}>
                  20
                </div>
              </th>
              <td className="s8" colSpan={8}>
                Phase 2 Summary: 6 initiatives | Segments unlocked: all
                user-specified industries | Estimated revenue impact: INR
                1.5Cr-4Cr ARR uplift from vertical-specific modules
              </td>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="741551836R20"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  21
                </div>
              </th>
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
              <td className="s9" />
            </tr>
            <tr style={{ height: 25 }}>
              <th
                id="741551836R21"
                style={{ height: 25 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 25 }}>
                  22
                </div>
              </th>
              <td className="s3" colSpan={8}>
                Phase 3 - Intelligence, Scale, and Global (Months 13-24)
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R22"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  23
                </div>
              </th>
              <td className="s4">13</td>
              <td className="s4">Phase 3</td>
              <td className="s5">AI-Powered Behavior Anomaly Detection</td>
              <td className="s4">
                Deploy a machine learning model that identifies unusual access
                patterns: a vendor visiting at 2 AM, a vehicle entering 5 times
                in one day, or a staff member checking in from an unregistered
                device. Anomalies are surfaced as alerts in the security
                dashboard.
              </td>
              <td className="s4">
                Regulated industries: data centers, pharma, BFSI, SEZs,
                high-security commercial campuses
              </td>
              <td className="s4">
                ML model training on 6+ months of historical entry data; AI
                engineering team sprint 8-10 weeks
              </td>
              <td className="s4">Month 16</td>
              <td className="s4">
                High - this feature creates a new premium AI-powered security
                intelligence tier priced at INR 5,000-10,000/month above
                standard subscription
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R23"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  24
                </div>
              </th>
              <td className="s6">14</td>
              <td className="s6">Phase 3</td>
              <td className="s7">NDA and Document E-Signing at Check-In</td>
              <td className="s6">
                Enable visitor NDA or safety induction document signing during
                the check-in flow. Documents are pre-loaded by the facility
                admin. Signed copies are stored in the visitor's entry record
                and exportable for compliance.
              </td>
              <td className="s6">
                Data centers, BFSI offices, pharmaceutical manufacturing,
                defense suppliers, IT parks
              </td>
              <td className="s6">
                Document rendering and e-sign framework; legal review; 4-week
                sprint
              </td>
              <td className="s6">Month 14</td>
              <td className="s6">
                Medium - required for enterprise buyers doing security
                compliance certification who currently print NDAs at reception
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R24"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  25
                </div>
              </th>
              <td className="s4">15</td>
              <td className="s4">Phase 3</td>
              <td className="s5">
                WhatsApp Business Integration for Approvals
              </td>
              <td className="s4">
                Enable host approval and visitor notification through WhatsApp
                Business API, so residents and employees who do not have the app
                installed can still receive and respond to approval requests via
                WhatsApp.
              </td>
              <td className="s4">
                All India segments - especially residential RWAs and industrial
                sites where app adoption is low among residents and employees
              </td>
              <td className="s4">
                WhatsApp Business API onboarding and integration; 3-week sprint
              </td>
              <td className="s4">Month 13</td>
              <td className="s4">
                High - reduces the app-installation barrier to adoption for
                residential and industrial segments where resident app adoption
                is the biggest deployment friction
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R25"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  26
                </div>
              </th>
              <td className="s6">16</td>
              <td className="s6">Phase 3</td>
              <td className="s7">Global Denied-Party Watchlist Screening</td>
              <td className="s6">
                Integrate with international watchlist databases (OFAC, UN
                Sanctions, EU Consolidated List) to screen visitor identities
                against denied-party records before entry is approved. Flag
                matches for manual review.
              </td>
              <td className="s6">
                Data centers, BFSI, global pharma and chemical plants, defense
                suppliers with international operations
              </td>
              <td className="s6">
                Watchlist database API subscription; legal review; 4-week
                integration sprint
              </td>
              <td className="s6">Month 15</td>
              <td className="s6">
                Medium - required for MNC clients with global compliance
                requirements; positions Gate Management as a credible
                alternative to iLobby in regulated global verticals
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R26"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  27
                </div>
              </th>
              <td className="s4">17</td>
              <td className="s4">Phase 3</td>
              <td className="s5">Multi-Currency and Multi-Country Billing</td>
              <td className="s4">
                Enable billing in USD, GBP, EUR, SGD, and AED for international
                property management operators deploying Gate Management in
                global portfolios.
              </td>
              <td className="s4">
                International property management companies, global REITs,
                overseas educational institutions, multinational manufacturing
                operators
              </td>
              <td className="s4">
                Finance and billing engineering; tax and compliance review for
                target countries; 4-week sprint
              </td>
              <td className="s4">Month 18</td>
              <td className="s4">
                Medium - prerequisite for scaling revenue outside India
              </td>
            </tr>
            <tr style={{ height: 99 }}>
              <th
                id="741551836R27"
                style={{ height: 99 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 99 }}>
                  28
                </div>
              </th>
              <td className="s6">18</td>
              <td className="s6">Phase 3</td>
              <td className="s7">Open API and Developer Ecosystem</td>
              <td className="s6">
                Publish a documented REST API with sandbox access for system
                integrators and enterprise IT teams to build custom integrations
                with ERP, HRMS, CMMS, and building management systems.
              </td>
              <td className="s6">
                All enterprise segments - especially IT parks, industrial
                operators, and property management companies with custom stack
                integrations
              </td>
              <td className="s6">
                API documentation, developer portal, sandbox environment; 6-week
                engineering and developer relations sprint
              </td>
              <td className="s6">Month 20</td>
              <td className="s6">
                High - ecosystem integrations create long-term stickiness and
                reduce churn for large enterprise accounts
              </td>
            </tr>
            <tr style={{ height: 39 }}>
              <th
                id="741551836R28"
                style={{ height: 39 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 39 }}>
                  29
                </div>
              </th>
              <td className="s8" colSpan={8}>
                Phase 3 Summary: 6 initiatives | Segments unlocked: all
                user-specified industries | Estimated revenue impact: INR
                5Cr-15Cr ARR uplift from AI tier, global billing, and ecosystem
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
