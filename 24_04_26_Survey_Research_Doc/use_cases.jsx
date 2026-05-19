export default function SurveyUseCasesContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr"></th>
              <th
                id="2031125896C0"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="2031125896C1"
                style={{ width: 195 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="2031125896C2"
                style={{ width: 411 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="2031125896C3"
                style={{ width: 244 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="2031125896C4"
                style={{ width: 197 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="2031125896C5"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                F
              </th>
              <th
                id="2031125896C6"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                G
              </th>
              <th
                id="2031125896C7"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                H
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 36 }}>
              <th
                id="2031125896R0"
                style={{ height: 36 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 36 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan="8">
                Use Cases
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="2031125896R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan="8">
                Part 1: Industry use cases (10 industries, same as Market
                Analysis) | Part 2: Internal team use cases
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R2"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  3
                </div>
              </th>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
            </tr>
            <tr style={{ height: 28 }}>
              <th
                id="2031125896R3"
                style={{ height: 28 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 28 }}>
                  4
                </div>
              </th>
              <td className="s3" colSpan="8">
                PART 1 - INDUSTRY USE CASES (10 Industries)
              </td>
            </tr>
            <tr style={{ height: 52 }}>
              <th
                id="2031125896R4"
                style={{ height: 52 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 52 }}>
                  5
                </div>
              </th>
              <td className="s4">Industry</td>
              <td className="s4">Primary Use Case</td>
              <td className="s4">
                How relevant Survey features are used (step-by-step)
              </td>
              <td className="s4">What the team gets</td>
              <td className="s4">Key Survey feature used</td>
              <td className="s4">Volume indicators</td>
              <td className="s4">Decision maker</td>
              <td className="s4">Sales complexity</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R5"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  6
                </div>
              </th>
              <td className="s5">Retail Chains (Apparel, QSR, Electronics)</td>
              <td className="s5">
                In-store experience feedback at each store location, tied to
                ticket resolution for service failures
              </td>
              <td className="s5">
                1. Survey Administrator maps a star rating and emoji question to
                each of 80 store locations, using Bulk Location Import to upload
                all locations in one file. 2. Each store displays its unique QR
                code at the checkout counter. 3. Customer scans QR via Google
                Lens after purchase. 4. If 1 or 2 stars selected, Additional
                Field on Negative Selection appears - customer selects from
                options: long wait, staff behavior, billing error, product
                unavailability. 5. System creates ticket with pre-filled
                category and assigns to Store Manager team via Team Assignment
                in Admin Portal. 6. Operations Manager reviews Survey Info
                Dashboard daily to compare CSAT scores across all 80 stores.
              </td>
              <td className="s5">
                Real-time location-level CSAT comparison. Auto-raised tickets
                for every negative response with root cause pre-filled. Trend
                view shows which stores are improving and which are declining.
              </td>
              <td className="s5">
                * Location Mapping with Unique QR, * Negative Response Trigger,
                Additional Field on Negative Selection, Survey Info Dashboard
              </td>
              <td className="s5">
                50 to 500 stores, 200 to 5,000 daily responses across portfolio
              </td>
              <td className="s5">VP Operations / Head of CX</td>
              <td className="s5">
                Medium - Operations team decides, IT may need to approve data
                hosting
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R6"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  7
                </div>
              </th>
              <td className="s6">Integrated Facility Management (IFM)</td>
              <td className="s6">
                Occupant satisfaction measurement across client sites with
                SLA-linked ticket routing
              </td>
              <td className="s6">
                1. FM company&#39;s Survey Administrator creates question sets
                for each service type: housekeeping, HVAC, F&amp;B, security. 2.
                Each question set is mapped to specific zones within a client
                campus (lobby, gym, cafeteria, workfloor). 3. QR codes are
                displayed at the zone entry or exit point. 4. Occupants scan and
                rate. 5. Negative responses auto-create tickets assigned to the
                relevant FM service team via Team Assignment. 6. Operations
                Manager exports response data and ticket resolution records to
                Excel monthly for client SLA reporting.
              </td>
              <td className="s6">
                Documented proof of occupant satisfaction for SLA compliance.
                Location and zone-level breakdown showing which service areas
                underperform. Monthly Excel export ready for client reporting.
              </td>
              <td className="s6">
                * Unique QR Generation, * Ticket Panel on Response Page, Team
                Assignment, Mapping List Export
              </td>
              <td className="s6">
                20 to 300 client sites, 100 to 2,000 responses per site per
                month
              </td>
              <td className="s6">Head of Operations / Account Manager</td>
              <td className="s6">
                Medium - FM company decides; enterprise client may need to
                approve interface used at their site
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R7"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  8
                </div>
              </th>
              <td className="s5">
                Hospitality (Hotels and Serviced Apartments)
              </td>
              <td className="s5">
                In-stay feedback at key touchpoints to enable same-stay recovery
                before checkout
              </td>
              <td className="s5">
                1. Hotel maps questions to physical touchpoints: restaurant
                entry, pool area, gym, room floor corridor, front desk. 2. QR
                codes displayed on table cards, mirrors, and signage. 3. Guest
                scans and rates. 4. If negative (1-2 stars on food quality or
                room cleanliness), ticket auto-created and assigned to F&amp;B
                Manager or Housekeeping team. 5. Ticket TAT is set to 30 minutes
                for in-stay recovery. 6. Trend Analysis shows which touchpoints
                generate the most negative responses across properties, enabling
                shift scheduling decisions.
              </td>
              <td className="s5">
                In-stay recovery capability. Location-level satisfaction scores
                by touchpoint. Trend view showing peak dissatisfaction times
                that inform staffing decisions.
              </td>
              <td className="s5">
                * Location Mapping, * Negative Response Trigger, Trend Analysis,
                Ticket Panel on Response Page
              </td>
              <td className="s5">
                5 to 100 properties, 50 to 500 responses per property per day
              </td>
              <td className="s5">General Manager / Guest Relations Manager</td>
              <td className="s5">
                Low-Medium - Single decision-maker, short sales cycle, high
                urgency
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R8"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  9
                </div>
              </th>
              <td className="s6">Healthcare (OPD and Diagnostic Centres)</td>
              <td className="s6">
                Patient satisfaction collection at each centre for NABH
                accreditation compliance and service improvement
              </td>
              <td className="s6">
                1. Administrator maps a star rating question (How satisfied were
                you with your visit today?) and a multiple-choice question
                (Which department did you visit?) to each OPD centre. 2. QR
                displayed at discharge desk or waiting area. 3. Patient scans
                after appointment. 4. Negative response triggers ticket assigned
                to the centre&#39;s Admin team. 5. Monthly export of response
                records provided to Quality Manager as NABH audit documentation.
                6. Trend view shows satisfaction trends for each centre and
                identifies recurring complaint categories.
              </td>
              <td className="s6">
                NABH-compliant patient feedback documentation. Centre-level
                comparison for chain operators. Early identification of
                recurring patient complaints before they escalate to formal
                grievances.
              </td>
              <td className="s6">
                * Location Mapping, Export, Trend Analysis, * Ticket Panel on
                Response Page
              </td>
              <td className="s6">
                10 to 100 centres, 50 to 500 patients surveyed per centre per
                day
              </td>
              <td className="s6">Hospital Administrator / Head of Quality</td>
              <td className="s6">
                Medium - Quality and operations team decide; IT approval needed
                for data storage
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R9"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  10
                </div>
              </th>
              <td className="s5">
                Educational Institutions (Universities and Colleges)
              </td>
              <td className="s5">
                Student experience feedback for canteen, library, hostel,
                administration, and class experience
              </td>
              <td className="s5">
                1. Survey Administrator maps separate question sets to each
                department or facility: canteen, library, hostel, registration
                office. 2. QR codes displayed at each location. 3. Students scan
                and rate. 4. Negative responses on canteen or hostel quality
                auto-create tickets for the Facilities team. 5. Administration
                reviews Survey Info Dashboard to monitor student satisfaction
                trends. 6. Academic leadership uses Trend Analysis before
                semester end to identify facilities requiring urgent
                intervention.
              </td>
              <td className="s5">
                Department-level satisfaction visibility. Automatic complaint
                routing for hostel and canteen issues. Trend data for
                accreditation reports (NAAC, NBA).
              </td>
              <td className="s5">
                Question to Location Mapping, Trend Analysis, * Negative
                Response Trigger
              </td>
              <td className="s5">
                1 to 5 campuses, 200 to 2,000 students surveyed per day
              </td>
              <td className="s5">Registrar / Head of Administration</td>
              <td className="s5">
                Low - Single decision-maker in private institutions, longer
                cycle in government institutions
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R10"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  11
                </div>
              </th>
              <td className="s6">Corporate Offices and GCC Campuses</td>
              <td className="s6">
                Employee experience feedback on workplace services (cafeteria,
                housekeeping, IT support, transport)
              </td>
              <td className="s6">
                1. Facility Manager maps questions to cafeteria, parking,
                helpdesk, and washroom zones. 2. QR codes on standees and table
                cards. 3. Employees scan during or after using the service. 4.
                Negative feedback on cafeteria or IT support auto-creates ticket
                for the respective vendor team. 5. HR and FM teams review Survey
                Info Dashboard for weekly service quality reporting. 6.
                Complaint channel configuration used to tag tickets by source
                (QR survey vs walk-in) for vendor SLA tracking.
              </td>
              <td className="s6">
                Real-time workplace satisfaction data for FM vendor management.
                Ticket records for vendor SLA audits. Trend view identifying
                recurring workplace issues.
              </td>
              <td className="s6">
                * Location Mapping, Complaint Channels, Team Assignment, Survey
                Info Dashboard
              </td>
              <td className="s6">
                1 to 50 campuses, 100 to 1,000 daily responses
              </td>
              <td className="s6">Head of FM / HR Operations Manager</td>
              <td className="s6">
                Low - FM Manager decides. Often bundled with FM service renewal
                discussions
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R11"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  12
                </div>
              </th>
              <td className="s5">Public Utilities and Government Services</td>
              <td className="s5">
                Citizen feedback on service quality at government offices,
                public toilets, parks, and transit points
              </td>
              <td className="s5">
                1. Government body or service provider maps survey to each
                service location: tax office counter, park entry, public toilet
                block, bus terminal. 2. QR codes displayed at each point. 3.
                Citizens scan and rate cleanliness, wait time, or staff
                behavior. 4. Negative responses create tickets assigned to
                maintenance or administration teams. 5. District or municipality
                management reviews location-level data on Survey Info Dashboard
                for monthly performance reporting to senior government.
              </td>
              <td className="s5">
                Documented citizen feedback for public accountability reporting.
                Location-level data for resource allocation decisions. Ticket
                records for maintenance team performance tracking.
              </td>
              <td className="s5">
                * Unique QR Generation, * Negative Response Trigger, Survey Info
                Dashboard, Export
              </td>
              <td className="s5">
                50 to 5,000 service points, variable response volume
              </td>
              <td className="s5">District Administrator / IT Head</td>
              <td className="s5">
                High - Government procurement process, long cycle, committee
                decision
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R12"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  13
                </div>
              </th>
              <td className="s6">
                Banking and Financial Services (Branch Network)
              </td>
              <td className="s6">
                Customer feedback at bank branches and ATM lobbies
                post-transaction
              </td>
              <td className="s6">
                1. Bank Survey Administrator maps a 5-question survey to each
                branch: overall experience, wait time, staff helpfulness, branch
                cleanliness, issue resolution. 2. QR displayed at teller desk or
                exit. 3. Customer scans after transaction. 4. Negative responses
                on wait time or issue resolution trigger ticket assigned to
                Branch Manager team. 5. Head of Retail Banking reviews Trend
                Analysis dashboard for monthly branch performance ranking. 6.
                Compliance team uses export for RBI customer grievance
                documentation.
              </td>
              <td className="s6">
                Branch-level CSAT ranking. Automated complaint routing for
                teller experience issues. Monthly data export for RBI compliance
                reporting.
              </td>
              <td className="s6">
                * Location Mapping, Trend Analysis, Export, * Ticket Panel on
                Response Page
              </td>
              <td className="s6">
                50 to 5,000 branches, 10 to 200 daily responses per branch
              </td>
              <td className="s6">
                Head of Retail Banking / Branch Operations Head
              </td>
              <td className="s6">
                High - Bank IT security approval required. Procurement cycle 3
                to 6 months
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R13"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  14
                </div>
              </th>
              <td className="s5">Airports and Transit Hubs</td>
              <td className="s5">
                Passenger experience feedback at security, lounge, F&amp;B,
                baggage, and retail zones
              </td>
              <td className="s5">
                1. Airport operator maps questions to each terminal zone:
                security checkpoint, food court, baggage carousel, retail zone,
                departure gate. 2. QR codes on zone signage and seat-back cards.
                3. Passengers scan between flights or during transit. 4.
                Negative feedback at food court or security auto-creates ticket
                for the relevant concession operator or CISF team. 5. Airport
                CEO dashboard shows zone-level satisfaction scores updated
                hourly.
              </td>
              <td className="s5">
                Zone-level satisfaction tracking in real time. Auto-created
                tickets for concession operators with TAT tracking. Aggregate
                data for AAI quality reporting.
              </td>
              <td className="s5">
                * Location Mapping, * Survey Info Dashboard with Heat Map, Trend
                Analysis, Ticket Panel
              </td>
              <td className="s5">
                1 to 5 terminals per airport, 500 to 10,000 responses per
                terminal per day
              </td>
              <td className="s5">Head of Customer Experience / Airport CEO</td>
              <td className="s5">
                High - Multi-stakeholder approval, long procurement cycle, high
                revenue opportunity
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R14"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  15
                </div>
              </th>
              <td className="s6">
                Logistics and Last-Mile Delivery (Warehouses and Collection
                Points)
              </td>
              <td className="s6">
                Shipper and recipient feedback at warehouse dispatch, collection
                points, and delivery hubs
              </td>
              <td className="s6">
                1. Logistics company maps questions to each hub and collection
                point: receiving dock, sorting area, customer pickup counter. 2.
                QR displayed at customer-facing desks. 3. Customer scans after
                collecting parcel or receiving shipment. 4. Negative response on
                delivery experience or hub cleanliness creates ticket for Hub
                Manager. 5. Regional Operations Manager reviews Survey Info
                Dashboard for hub-level comparison. 6. Trend view identifies
                hubs with sustained low scores for targeted retraining.
              </td>
              <td className="s6">
                Hub-level satisfaction comparison across the delivery network.
                Automated ticket routing for customer complaints. Trend data for
                hub manager performance reviews.
              </td>
              <td className="s6">
                Question to Location Mapping, * Negative Response Trigger,
                Survey Info Dashboard
              </td>
              <td className="s6">
                50 to 5,000 hubs, 20 to 500 daily responses per hub
              </td>
              <td className="s6">Regional Operations Manager / VP Logistics</td>
              <td className="s6">
                Medium - Operations team decides, integration with WMS may be
                discussed
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R15"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  16
                </div>
              </th>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
              <td className="s2"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R16"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  17
                </div>
              </th>
              <td className="s3" colSpan="8">
                PART 2 - INTERNAL TEAM USE CASES
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R17"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  18
                </div>
              </th>
              <td className="s4">Internal Team</td>
              <td className="s4">What they do with Survey</td>
              <td className="s4">Feature they rely on most</td>
              <td className="s4">What changes for them after using Survey</td>
              <td className="s4">Time saved or risk reduced</td>
              <td className="s4"></td>
              <td className="s4"></td>
              <td className="s4"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R18"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  19
                </div>
              </th>
              <td className="s5">Operations Team</td>
              <td className="s5">
                Monitors daily CSAT scores by location. Identifies locations
                with sudden satisfaction drops. Reviews negative response volume
                trends and compares current-week performance to last-month
                baseline.
              </td>
              <td className="s5">
                * Survey Info Dashboard with Heat Map, Trend Analysis
              </td>
              <td className="s5">
                Moves from weekly manual aggregation of feedback reports to a
                live dashboard that shows today&#39;s scores. Can identify a
                problem location the same day it occurs rather than 3 weeks
                later in a monthly report.
              </td>
              <td className="s5">
                Saves 5 to 10 hours per week of manual report aggregation.
                Reduces average time to detect a location-level service failure
                from 14 days to same-day.
              </td>
              <td className="s7" colSpan="3" rowSpan="22"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R19"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  20
                </div>
              </th>
              <td className="s6">Helpdesk / Complaint Resolution Team</td>
              <td className="s6">
                Receives pre-filled tickets from negative survey responses.
                Reviews ticket status, TAT, escalation level, and resolution
                progress from within the response detail view. Manages team
                assignment and complaint channel configuration.
              </td>
              <td className="s6">
                * Ticket Panel on Response Page, Team Assignment, Complaint
                Channels
              </td>
              <td className="s6">
                Moves from receiving complaints via WhatsApp or verbal
                escalation to a structured ticket queue with category, priority,
                and TAT pre-filled from the survey response. No more missed
                complaints.
              </td>
              <td className="s6">
                Reduces manual ticket entry by 80% for survey-sourced
                complaints. TAT compliance improves because no ticket is missed
                and escalation is automatic.
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R20"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  21
                </div>
              </th>
              <td className="s5">Survey Administration Team</td>
              <td className="s5">
                Creates question banks, maps surveys to locations, generates QR
                codes, manages active/inactive status, and exports data for
                operations reviews.
              </td>
              <td className="s5">
                Question to Location Mapping, Bulk Location Import, Unique QR
                Generation
              </td>
              <td className="s5">
                Moves from manual QR creation and individual location
                configuration to a bulk-import-and-auto-generate workflow. A new
                location is live with a QR in under 5 minutes.
              </td>
              <td className="s5">
                Reduces new location setup time from 30 minutes per location to
                under 5 minutes. Bulk import of 100 locations reduces
                configuration week to a single afternoon.
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R21"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  22
                </div>
              </th>
              <td className="s6">Analytics / CX Insights Team</td>
              <td className="s6">
                Tracks satisfaction trends across locations and time periods.
                Builds before/after analysis of service interventions.
                Identifies recurring complaint patterns across question,
                location, and time.
              </td>
              <td className="s6">
                Trend and Pattern View, Tabular Response Export
              </td>
              <td className="s6">
                Moves from exporting raw responses to Excel and building pivot
                tables to a built-in trend view that plots CSAT and response
                volume by location and date range without manual analysis.
              </td>
              <td className="s6">
                Reduces monthly insights report build time from 8 to 12 hours to
                under 2 hours. Pattern view reduces time to identify recurring
                issues from ad-hoc analysis to real-time surfacing.
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="2031125896R22"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  23
                </div>
              </th>
              <td className="s5">Senior Leadership / C-Suite</td>
              <td className="s5">
                Reviews portfolio-level satisfaction performance during weekly
                or monthly operations reviews. Uses Survey Info Dashboard as a
                live KPI screen for location network performance.
              </td>
              <td className="s5">* Survey Info Dashboard, Trend Analysis</td>
              <td className="s5">
                Moves from waiting for a monthly analyst-prepared report to
                reviewing a live dashboard that shows current-week CSAT across
                all locations. Can ask operations questions in real time.
              </td>
              <td className="s5">
                Reduces decision latency on location-level service investment
                from monthly cycle to daily. Enables evidence-based conversation
                with location managers during reviews.
              </td>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R23"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  24
                </div>
              </th>
              <td className="s7" colSpan="5" rowSpan="17"></td>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R24"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  25
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R25"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  26
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R26"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  27
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R27"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  28
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R28"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  29
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R29"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  30
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R30"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  31
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R31"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  32
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R32"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  33
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R33"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  34
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R34"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  35
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R35"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  36
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R36"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  37
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R37"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  38
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R38"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  39
                </div>
              </th>
            </tr>
            <tr style={{ height: 20 }}>
              <th
                id="2031125896R39"
                style={{ height: 20 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 20 }}>
                  40
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
