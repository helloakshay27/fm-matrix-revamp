export default function SurveyFeatureListContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle no-grid" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr"></th>
              <th
                id="604628010C0"
                style={{ width: 34 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="604628010C1"
                style={{ width: 153 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="604628010C2"
                style={{ width: 195 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="604628010C3"
                style={{ width: 757 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="604628010C4"
                style={{ width: 97 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="604628010C5"
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
                id="604628010R0"
                style={{ height: 36 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 36 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan="6">
                Complete Feature List
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="604628010R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan="6">
                Star USP features are highlighted in blue across all columns.
                All other features on alternating white/light background.
              </td>
            </tr>
            <tr style={{ height: 52 }}>
              <th
                id="604628010R2"
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
            <tr style={{ height: 19 }}>
              <th
                id="604628010R3"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  4
                </div>
              </th>
              <td className="s3">1</td>
              <td className="s4">Question Setup</td>
              <td className="s4">Emoji Rating</td>
              <td className="s4">
                The survey administrator opens the question creation screen and
                selects Emoji Rating as the answer type. Four or five emoji
                icons representing a satisfaction scale (very unhappy to very
                happy) are displayed to the respondent on the survey interface.
                The system records which emoji was selected and maps it to a
                numeric score for aggregation in the response analytics
                dashboard. Emoji ratings are commonly used for fast sentiment
                capture at high-footfall points where respondents have limited
                time.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator, Respondent</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R4"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  5
                </div>
              </th>
              <td className="s5" dir="ltr">
                2
              </td>
              <td className="s6"></td>
              <td className="s7">
                * * Negative Response Trigger (Auto Ticket)
              </td>
              <td className="s7">
                When a respondent selects a negative answer option - defined as
                an emoji representing dissatisfaction, a star rating of 1 or 2,
                or a specific multiple-choice option flagged as negative - the
                system automatically creates a ticket in the backend. The ticket
                is linked to the response record, populated with the survey
                question, location, respondent input, and a timestamp. The
                ticket appears in the ticket panel within the response detail
                view with status, category, subcategory, assigned team, TAT, and
                escalation level fields. No manual intervention is required to
                create or route the ticket.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">
                Survey Administrator, Helpdesk Manager, Operations Manager
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R5"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  6
                </div>
              </th>
              <td className="s5" dir="ltr">
                3
              </td>
              <td className="s6"></td>
              <td className="s7" dir="ltr">
                * * Auto Functional Ticket Capture via Additional Field
              </td>
              <td className="s7">
                When a negative option is selected, an additional input field
                appears on the survey interface prompting the respondent to
                select or describe the exact reason for their dissatisfaction -
                for example, selecting from a list of predefined complaint
                categories such as cleanliness, wait time, staff behavior, or
                equipment fault. This additional data is captured within the
                same response record and attached to the ticket, giving the
                helpdesk team a pre-triaged complaint with a root cause
                identified before human review.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">
                Survey Administrator, Respondent, Helpdesk Manager
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R6"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  7
                </div>
              </th>
              <td className="s8" dir="ltr">
                4
              </td>
              <td className="s4"></td>
              <td className="s9">Reusable Question Bank</td>
              <td className="s9">
                Administrators access the question bank section and browse
                prebuilt question templates or previously saved questions. A
                question can be selected and added directly to a new survey
                mapping without re-entering the answer type, response options,
                or ticket trigger configuration. The bank reduces setup time for
                multi-location rollouts where the same question set needs to be
                deployed across 50 to 200 locations.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R7"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  8
                </div>
              </th>
              <td className="s3" dir="ltr">
                5
              </td>
              <td className="s4"></td>
              <td className="s4">Star Rating</td>
              <td className="s4">
                The administrator selects Star Rating as the answer type.
                Respondents see a row of stars (typically 1 to 5) and tap or
                click to select their satisfaction level. The system records the
                star value and includes it in the CSAT calculation visible on
                the survey info dashboard. Star ratings are used when
                organizations want a familiar and standardized measurement scale
                that maps directly to industry CSAT benchmarks.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator, Respondent</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R8"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  9
                </div>
              </th>
              <td className="s8" dir="ltr">
                6
              </td>
              <td className="s4"></td>
              <td className="s9">Text Input</td>
              <td className="s9">
                The administrator adds a text input field to the survey.
                Respondents see a free-text box and can enter open-ended
                comments of any length. The system stores the text response
                alongside the associated question, location, and timestamp. Text
                responses appear in the tabular response view and can be
                exported to Excel. They are commonly paired with rating
                questions to capture qualitative context behind low scores.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator, Respondent, Analyst</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R9"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  10
                </div>
              </th>
              <td className="s3" dir="ltr">
                7
              </td>
              <td className="s4"></td>
              <td className="s4">Multiple Choice</td>
              <td className="s4">
                The administrator defines a question with two or more predefined
                answer options. Respondents select one option from the list. The
                system records the selected option and aggregates response
                counts per option in the question distribution section of the
                analytics dashboard. Multiple choice is used for structured data
                collection where organizations need to track which specific
                service area or product category is associated with positive or
                negative feedback.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator, Respondent</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R10"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  11
                </div>
              </th>
              <td className="s8">8</td>
              <td className="s4"></td>
              <td className="s9">Enable Form Mode</td>
              <td className="s9">
                The administrator toggles Form Mode on for a survey mapping. In
                form mode, all survey questions configured for that mapping are
                displayed on a single scrollable page instead of the default
                one-question-per-screen layout. Respondents scroll through and
                answer all questions before submitting. Form mode is preferred
                for longer surveys deployed in seated or low-footfall
                environments such as waiting rooms, meeting rooms, or tenant
                lounges where respondents have more time.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator, Respondent</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R11"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  12
                </div>
              </th>
              <td className="s3">9</td>
              <td className="s4"></td>
              <td className="s4">Mobile Background Image</td>
              <td className="s4">
                The administrator uploads a branded background image in the
                survey configuration settings. When a respondent accesses the
                survey through the QR code on a mobile device, the configured
                image is displayed behind the survey questions, giving the
                survey a branded and visually consistent appearance. This is
                used by retail chains, hospitality brands, and corporate
                campuses that want the survey interface to match their visual
                identity.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R12"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  13
                </div>
              </th>
              <td className="s8">10</td>
              <td className="s4"></td>
              <td className="s9">Details Page</td>
              <td className="s9">
                The administrator accesses any survey question from the question
                list and opens its details page. The page shows the full
                question configuration including the question text, answer type,
                ticket category, negative trigger setting, active status,
                created-by details, and creation timestamp. The details page is
                read-only and is used for audit and review purposes before
                making edits.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R13"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  14
                </div>
              </th>
              <td className="s3">11</td>
              <td className="s4"></td>
              <td className="s4">Edit Page</td>
              <td className="s4">
                The administrator opens a question from the list or details view
                and navigates to the edit page. All configurable fields -
                question text, answer type, negative trigger toggle, ticket
                category, and active status - are editable. Changes are saved
                immediately and reflected in any active survey mapping using
                that question. Inactive questions do not display to respondents
                regardless of the mapping status.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R14"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  15
                </div>
              </th>
              <td className="s8">12</td>
              <td className="s4"></td>
              <td className="s9">List Page</td>
              <td className="s9">
                The administrator opens the question setup list screen which
                shows all configured survey questions in a tabular format. Key
                columns include question text, check type, question count,
                ticket category, active status, and last modified date. The list
                supports sorting by column and is the primary navigation point
                for managing the question library.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R15"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  16
                </div>
              </th>
              <td className="s3">13</td>
              <td className="s4"></td>
              <td className="s4">Export Questions to Excel</td>
              <td className="s4">
                From the question list page, the administrator selects one or
                more records and triggers an Excel export. The exported file
                contains all visible list columns and is formatted for immediate
                review or sharing with operations or IT teams. Export is used
                during audits, system migrations, and configuration reviews.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator, Analyst</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R16"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  17
                </div>
              </th>
              <td className="s8">14</td>
              <td className="s4"></td>
              <td className="s9">Filter Questions</td>
              <td className="s9">
                The question list supports filter and sort controls that allow
                the administrator to narrow records by check type, active
                status, ticket category, or creation date range. Filters are
                applied in real time and persist during the session, making it
                easier to manage large question libraries across multiple survey
                programs.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R17"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  18
                </div>
              </th>
              <td className="s5">15</td>
              <td className="s6">Survey Mapping</td>
              <td className="s7">* * Question to Location Mapping</td>
              <td className="s7">
                The administrator creates a mapping by selecting a survey
                question or question set and assigning it to a specific physical
                location from the location list. Each unique survey-location
                combination becomes a distinct mapping record with its own QR
                code, status controls, and response history. This means a single
                shopping mall with 20 zones can have 20 separate mappings, each
                with its own QR, each tracking responses independently. The
                mapping architecture is the core differentiator that enables
                location-level analytics.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">Survey Administrator, Operations Manager</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R18"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  19
                </div>
              </th>
              <td className="s5">16</td>
              <td className="s6"></td>
              <td className="s7">* * Unique QR Code Generation</td>
              <td className="s7">
                For every survey-location mapping created, the system generates
                a unique QR code that is tied exclusively to that mapping.
                Respondents scan the QR code using Google Lens or any QR reader
                and are taken directly to the assigned survey. Because the QR is
                mapping-specific, responses are automatically tagged with the
                correct location and question set without respondent input. The
                QR can be printed, displayed on a screen, or embedded in a
                physical sign.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">Survey Administrator, Respondent</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R19"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  20
                </div>
              </th>
              <td className="s3">17</td>
              <td className="s4"></td>
              <td className="s4">Bulk Location Import</td>
              <td className="s4">
                The administrator downloads a location import template, fills in
                the location names, address fields, and any custom tags, and
                uploads the file. The system creates all location records in one
                batch operation. Bulk import is critical for onboarding
                customers with 50 to 500 locations who would otherwise need to
                create each location record manually.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R20"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  21
                </div>
              </th>
              <td className="s8">18</td>
              <td className="s4"></td>
              <td className="s9">Mapping Details Page</td>
              <td className="s9">
                Each mapping record has a dedicated details page showing the
                location name, address, assigned survey questions, QR code
                image, active status, ticket category, created-by, and creation
                timestamp. The QR code image can be downloaded directly from the
                details page for printing or digital display.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator, Operations Manager</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R21"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  22
                </div>
              </th>
              <td className="s3">19</td>
              <td className="s4"></td>
              <td className="s4">Question Level Active/Inactive</td>
              <td className="s4">
                Within a mapping record, each assigned question can be toggled
                between active and inactive without affecting other questions in
                the same mapping. Inactive questions are not displayed to
                respondents when they scan the QR code. This allows
                administrators to temporarily remove a question (for example,
                during a seasonal change or service modification) without
                deleting the question or reconfiguring the mapping.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R22"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  23
                </div>
              </th>
              <td className="s8">20</td>
              <td className="s4"></td>
              <td className="s9">Location Level Active/Inactive</td>
              <td className="s9">
                An entire location and all its associated survey mappings can be
                toggled inactive from the mapping controls. When a location is
                inactive, its QR codes return no survey to respondents. This is
                used during store closures, renovations, or periods when
                feedback collection is paused at specific sites.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator, Operations Manager</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R23"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  24
                </div>
              </th>
              <td className="s3">21</td>
              <td className="s4"></td>
              <td className="s4">Mapping List Page</td>
              <td className="s4">
                The mapping list shows all created survey-location combinations
                with columns for location name, ticket category, number of
                questions, created-by, creation date, and active status. The
                list is the primary screen for managing the full mapping
                portfolio across all locations.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator, Operations Manager</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R24"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  25
                </div>
              </th>
              <td className="s8">22</td>
              <td className="s4"></td>
              <td className="s9">Export Mappings to Excel</td>
              <td className="s9">
                From the mapping list, the administrator exports all or filtered
                mapping records to Excel. The export is used for operations
                reporting, QR code tracking, and handover documentation for
                field teams responsible for displaying QR codes at each
                location.
              </td>
              <td className="s9"></td>
              <td className="s9">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R25"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  26
                </div>
              </th>
              <td className="s3">23</td>
              <td className="s4"></td>
              <td className="s4">Filter Mappings</td>
              <td className="s4">
                The mapping list supports filtering by location name, survey
                title, active status, and ticket category. Filters allow
                administrators managing hundreds of mappings to quickly find and
                update specific location-survey combinations.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R26"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  27
                </div>
              </th>
              <td className="s5">24</td>
              <td className="s6">Survey Response</td>
              <td className="s7">* * Survey Info Dashboard</td>
              <td className="s7">
                The Survey Info Dashboard is the primary analytics view for each
                survey or survey set. It displays total response count,
                per-question response distribution (how many respondents
                selected each answer option), the aggregated CSAT score, and a
                heat-map-style visualization showing response volume and
                sentiment patterns across locations. The dashboard refreshes
                with new response data in near-real-time and is the primary
                screen used by operations managers during daily or weekly
                service reviews.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">Operations Manager, Analyst</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R27"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  28
                </div>
              </th>
              <td className="s5">25</td>
              <td className="s6"></td>
              <td className="s7">* * Trend and Pattern View</td>
              <td className="s7">
                The trend view shows how response volume and satisfaction scores
                have changed over a configurable time period. It plots response
                counts and CSAT scores by date, question, and location, allowing
                analysts to identify seasonal patterns, detect sudden drops in
                satisfaction after a service change, and compare current
                performance against prior-period baselines. The pattern view
                surfaces recurring issues across locations by aggregating
                negative response reasons.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">Operations Manager, Analyst</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R28"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  29
                </div>
              </th>
              <td className="s8">26</td>
              <td className="s4"></td>
              <td className="s9">Tabular Response View</td>
              <td className="s9">
                All submitted responses are listed in a paginated table with
                columns for question text, location, selected answer (icon or
                value), any open-text comments entered by the respondent, and
                the ticket ID if a ticket was raised. The tabular view supports
                column-level filtering and is the primary screen used for
                individual response review and complaint follow-up.
              </td>
              <td className="s9"></td>
              <td className="s9">
                Survey Administrator, Helpdesk Manager, Analyst
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R29"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  30
                </div>
              </th>
              <td className="s3">27</td>
              <td className="s4"></td>
              <td className="s4">Tabular Response Export</td>
              <td className="s4">
                The response table can be exported to Excel. The export includes
                all visible columns and covers the full date range or a filtered
                subset. Exports are used for weekly operations reviews, SLA
                reporting to clients, and audit documentation.
              </td>
              <td className="s4"></td>
              <td className="s4">Survey Administrator, Analyst</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R30"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  31
                </div>
              </th>
              <td className="s5">28</td>
              <td className="s6"></td>
              <td className="s7">* * Ticket Panel on Response Detail</td>
              <td className="s7">
                Within each individual response detail view, a dedicated ticket
                panel shows the full ticket raised from that response. Columns
                include ticket ID, heading, created-by, assigned-to, status,
                category, subcategory, priority, site, created-at timestamp,
                ticket type, complaint mode, asset and service name, task ID,
                proactive/reactive flag, review date, response escalation
                status, response time, response TAT, resolution escalation
                status, resolution time, resolution TAT, and escalation level.
                Column-level filtering is supported within the ticket panel,
                allowing the helpdesk manager to review full lifecycle data for
                any complaint from within the survey platform.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">Helpdesk Manager, Operations Manager</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R31"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  32
                </div>
              </th>
              <td className="s5">29</td>
              <td className="s7">Dashboard and Analytics</td>
              <td className="s7">* * Trend Analysis</td>
              <td className="s7">
                The insights section surfaces feedback trends for the full
                survey program across all locations. It uses response volume,
                satisfaction scores, and negative reason codes to identify
                recurring service failures, measure the impact of operational
                changes on customer satisfaction, and highlight locations with
                sustained underperformance. Trend analysis is the primary tool
                used by CX teams and senior operations managers to make
                location-level service investment decisions.
              </td>
              <td className="s7">* USP</td>
              <td className="s7">Operations Manager, Analyst</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R32"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  33
                </div>
              </th>
              <td className="s8">30</td>
              <td className="s9">Admin Portal</td>
              <td className="s9">Team Assignment</td>
              <td className="s9">
                The helpdesk administrator accesses the admin portal and maps
                internal teams to complaint categories or ticket types. For
                example, the Facilities team is assigned to the Cleanliness
                category, and the F&amp;B team is assigned to the Food Quality
                category. When a negative response triggers a ticket in one of
                these categories, the assigned team is automatically populated
                in the ticket record, reducing manual routing.
              </td>
              <td className="s9"></td>
              <td className="s9">Helpdesk Manager, Survey Administrator</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="604628010R33"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  34
                </div>
              </th>
              <td className="s3">31</td>
              <td className="s9"></td>
              <td className="s4">Complaint Channels</td>
              <td className="s4">
                The helpdesk administrator configures the channels through which
                complaints or ticket inputs are accepted - for example, QR
                survey, walk-in desk, email, or call. Channel configuration
                determines how tickets are categorized by source, enabling the
                operations team to track which channel drives the most complaint
                volume and adjust staffing or feedback touchpoint placement
                accordingly.
              </td>
              <td className="s4"></td>
              <td className="s4">Helpdesk Manager, Survey Administrator</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
