export default function SurveyEnhancementRoadmapContent() {
  return (
    <>
      <div className="ritz grid-container" dir="ltr">
        <table className="waffle no-grid" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="row-header freezebar-origin-ltr"></th>
              <th
                id="1492894105C0"
                style={{ width: 34 }}
                className="column-headers-background"
              >
                A
              </th>
              <th
                id="1492894105C1"
                style={{ width: 139 }}
                className="column-headers-background"
              >
                B
              </th>
              <th
                id="1492894105C2"
                style={{ width: 265 }}
                className="column-headers-background"
              >
                C
              </th>
              <th
                id="1492894105C3"
                style={{ width: 257 }}
                className="column-headers-background"
              >
                D
              </th>
              <th
                id="1492894105C4"
                style={{ width: 269 }}
                className="column-headers-background"
              >
                E
              </th>
              <th
                id="1492894105C5"
                style={{ width: 139 }}
                className="column-headers-background"
              >
                F
              </th>
              <th
                id="1492894105C6"
                style={{ width: 83 }}
                className="column-headers-background"
              >
                G
              </th>
              <th
                id="1492894105C7"
                style={{ width: 254 }}
                className="column-headers-background"
              >
                H
              </th>
              <th
                id="1492894105C8"
                style={{ width: 69 }}
                className="column-headers-background"
              >
                I
              </th>
              <th
                id="1492894105C9"
                style={{ width: 69 }}
                className="column-headers-background"
              >
                J
              </th>
              <th
                id="1492894105C10"
                style={{ width: 69 }}
                className="column-headers-background"
              >
                K
              </th>
              <th
                id="1492894105C11"
                style={{ width: 97 }}
                className="column-headers-background"
              >
                L
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 36 }}>
              <th
                id="1492894105R0"
                style={{ height: 36 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 36 }}>
                  1
                </div>
              </th>
              <td className="s0" colSpan="12">
                Feature Enhancement Roadmap
              </td>
            </tr>
            <tr style={{ height: 23 }}>
              <th
                id="1492894105R1"
                style={{ height: 23 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 23 }}>
                  2
                </div>
              </th>
              <td className="s1" colSpan="12">
                Each row: current behaviour -&gt; enhanced behaviour with
                integration type -&gt; revenue or relationship impact. Min 20
                enhancements. At least 5 AI. At least 3 MCP. High-impact rows in
                blue.
              </td>
            </tr>
            <tr style={{ height: 52 }}>
              <th
                id="1492894105R2"
                style={{ height: 52 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 52 }}>
                  3
                </div>
              </th>
              <td className="s2">#</td>
              <td className="s2">Module</td>
              <td className="s2">Feature</td>
              <td className="s2">How It Currently Works</td>
              <td className="s2">Enhanced Version</td>
              <td className="s2">Integration Type</td>
              <td className="s3">Impact Level</td>
              <td className="s3">Revenue / Relationship Outcome</td>
              <td className="s4">Effort</td>
              <td className="s4">Impact</td>
              <td className="s4">Priority</td>
              <td className="s4">Owner</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R3"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  4
                </div>
              </th>
              <td className="s5">1</td>
              <td className="s6">Question Setup</td>
              <td className="s6">AI Survey Generator</td>
              <td className="s6">
                Administrators manually write each question text and select the
                answer type for every survey question.
              </td>
              <td className="s6">
                Administrator enters a one-line prompt (&#39;generate 5
                questions for a hotel restaurant experience survey&#39;) and the
                AI generates a complete question set with recommended answer
                types and negative trigger configuration.
              </td>
              <td className="s6">AI - LLM</td>
              <td className="s6">High</td>
              <td className="s6">
                Reduces survey setup time from 30 minutes to under 3 minutes.
                Opens Survey to non-expert users who cannot write survey
                questions from scratch. Increases new account activation rate.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P1</td>
              <td className="s6">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R4"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  5
                </div>
              </th>
              <td className="s7">2</td>
              <td className="s8">Survey Mapping</td>
              <td className="s8">Geofence Auto-Activation</td>
              <td className="s8">
                Location active/inactive status is toggled manually by the
                Survey Administrator.
              </td>
              <td className="s8">
                QR codes for a mapped location automatically activate when a
                device enters the geofenced area and deactivate after the
                session. Useful for events, pop-up locations, and temporary
                activations.
              </td>
              <td className="s8">API</td>
              <td className="s8">Medium</td>
              <td className="s8">
                Enables event feedback collection without manual activation
                management. Reduces administrator workload for temporary
                locations by eliminating manual on/off toggling.
              </td>
              <td className="s8">Medium</td>
              <td className="s8">Medium</td>
              <td className="s8">P2</td>
              <td className="s8">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R5"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  6
                </div>
              </th>
              <td className="s5">3</td>
              <td className="s6">Survey Response</td>
              <td className="s6">AI Sentiment Scoring on Text Responses</td>
              <td className="s6">
                Text input responses are stored as raw text. Analysts read them
                manually to identify sentiment and themes.
              </td>
              <td className="s6">
                NLP model processes every text response in real time, assigns a
                sentiment label (positive, neutral, negative), confidence score,
                and up to 3 topic tags (cleanliness, wait time, staff, pricing)
                visible in the response table and dashboard.
              </td>
              <td className="s6">AI - NLP</td>
              <td className="s6">High</td>
              <td className="s6">
                Closes the #1 analytical gap vs Zonka Feedback AI Feedback
                Intelligence. Enables enterprise CX buyers who require automated
                theme detection to adopt Survey. Justifies a premium analytics
                tier at 40% price increase.
              </td>
              <td className="s6">High</td>
              <td className="s6">High</td>
              <td className="s6">P1</td>
              <td className="s6">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R6"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  7
                </div>
              </th>
              <td className="s5">4</td>
              <td className="s6">Admin Portal</td>
              <td className="s6">Multi-Tenant White-Label Portal</td>
              <td className="s6">
                Survey is deployed as a single-brand product. FM companies and
                hospitality operators cannot remove Survey branding from the
                respondent interface.
              </td>
              <td className="s6">
                Enterprise clients can deploy Survey under their own domain,
                brand colors, and logo. Sub-accounts for each client site are
                managed from a single admin panel. The Survey brand is invisible
                to end respondents.
              </td>
              <td className="s6">Native</td>
              <td className="s6">High</td>
              <td className="s6">
                Required for FM companies reselling Survey as their own service
                to enterprise clients. Unlocks the reseller channel estimated at
                20 to 300 locations per FM partner. Increases deal size by 30 to
                50% for white-label accounts.
              </td>
              <td className="s6">High</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">Product</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R7"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  8
                </div>
              </th>
              <td className="s5">5</td>
              <td className="s6">Survey Mapping</td>
              <td className="s6">MCP Integration with Freshdesk</td>
              <td className="s6">
                Tickets created from negative responses are stored within Survey
                only. Helpdesk teams using Freshdesk must check Survey
                separately or use a Zapier bridge.
              </td>
              <td className="s6">
                MCP-based Freshdesk connector pushes auto-raised Survey tickets
                into the Freshdesk queue in real time. Status changes in
                Freshdesk sync back to the Survey ticket panel. No Zapier
                required.
              </td>
              <td className="s6">MCP</td>
              <td className="s6">High</td>
              <td className="s6">
                Closes the enterprise helpdesk integration GAP. 3 of the top 10
                competitor weaknesses cited Freshdesk/Zendesk integration as a
                GAP for Survey. Directly enables enterprise account conversion
                blocked by this requirement.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P1</td>
              <td className="s6">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R8"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  9
                </div>
              </th>
              <td className="s5">6</td>
              <td className="s6">Survey Mapping</td>
              <td className="s6">MCP Integration with Zendesk</td>
              <td className="s6">
                Tickets created from negative responses are stored within Survey
                only. Zendesk users have no native connector.
              </td>
              <td className="s6">
                MCP-based Zendesk connector syncs auto-raised Survey tickets to
                Zendesk. Agent assignments and resolution updates in Zendesk
                reflect in Survey&#39;s ticket panel.
              </td>
              <td className="s6">MCP</td>
              <td className="s6">High</td>
              <td className="s6">
                Closes the second enterprise helpdesk GAP. Required for BFSI and
                large retail chain accounts with mandated Zendesk deployments.
                Estimated 3 to 5 enterprise deals unlocked per quarter.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P1</td>
              <td className="s6">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R9"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  10
                </div>
              </th>
              <td className="s5">7</td>
              <td className="s6">Dashboard and Analytics</td>
              <td className="s6">AI-Powered Insight Narration</td>
              <td className="s6">
                The dashboard shows charts and numbers. Analysts must interpret
                the data themselves and write their own weekly summary for
                leadership.
              </td>
              <td className="s6">
                An AI narrative engine generates a plain-language weekly insight
                summary: &#39;This week, Location 3 had the highest negative
                response volume (34 responses, +22% vs last week). Root cause:
                billing errors mentioned in 18 of 34 text responses. Recommended
                action: audit billing process at Location 3.&#39; Summary
                emailed automatically every Monday.
              </td>
              <td className="s6">AI - LLM</td>
              <td className="s6">High</td>
              <td className="s6">
                Reduces analyst weekly reporting time from 4 to 8 hours to under
                30 minutes. Enables operations managers without analytics skills
                to get actionable insights. Justifies premium pricing tier.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R10"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  11
                </div>
              </th>
              <td className="s5">8</td>
              <td className="s6">Survey Response</td>
              <td className="s6">Predictive Dissatisfaction Scoring</td>
              <td className="s6">
                Survey shows historical negative response counts. Operations
                teams react to problems after they occur.
              </td>
              <td className="s6">
                ML model trained on 6+ months of response data predicts which
                locations are likely to see a satisfaction drop in the next 7
                days, based on response pattern changes, seasonal trends, and
                historical precedent. Red-amber-green prediction badge visible
                per location on dashboard.
              </td>
              <td className="s6">AI - Predictive</td>
              <td className="s6">High</td>
              <td className="s6">
                Transforms Survey from reactive to proactive. Enables operations
                teams to pre-empt service failures before they generate tickets.
                This feature alone justifies a premium pricing tier INR 3,000 to
                8,000/month above base.
              </td>
              <td className="s6">High</td>
              <td className="s6">High</td>
              <td className="s6">P3</td>
              <td className="s6">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R11"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  12
                </div>
              </th>
              <td className="s5">9</td>
              <td className="s6">Admin Portal</td>
              <td className="s6">MCP Integration with Slack</td>
              <td className="s6">
                Ticket creation notifications are not pushed outside Survey.
                Helpdesk managers must log into Survey to see new tickets.
              </td>
              <td className="s6">
                MCP-based Slack connector pushes new ticket notifications to a
                configured Slack channel. Notification includes location,
                question, negative reason, ticket ID, and assigned team. Reply
                in Slack updates ticket status in Survey.
              </td>
              <td className="s6">MCP</td>
              <td className="s6">Medium</td>
              <td className="s6">
                Reduces the time between ticket creation and helpdesk team
                awareness from hours (check-in lag) to minutes (push
                notification). Particularly useful for FM and hospitality where
                the helpdesk manager is mobile.
              </td>
              <td className="s6">Low</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R12"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  13
                </div>
              </th>
              <td className="s7">10</td>
              <td className="s8">Question Setup</td>
              <td className="s8">Dynamic Question Branching</td>
              <td className="s8">
                All questions in a survey are shown regardless of the
                respondent&#39;s prior answer. There is no conditional logic.
              </td>
              <td className="s8">
                Administrator configures branch rules: if the respondent selects
                &#39;Cleanliness&#39; in the negative reason field, the next
                question changes to &#39;Which specific area?&#39;. Conditional
                logic enables deeper root cause capture without lengthening the
                survey for satisfied respondents.
              </td>
              <td className="s8">Native</td>
              <td className="s8">Medium</td>
              <td className="s8">
                Increases the diagnostic value of negative responses by
                capturing specific sub-issue details. Reduces root cause
                analysis time for helpdesk teams. Required for healthcare and
                hospitality buyers with complex complaint taxonomies.
              </td>
              <td className="s8">Medium</td>
              <td className="s8">Medium</td>
              <td className="s8">P2</td>
              <td className="s8">Product</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R13"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  14
                </div>
              </th>
              <td className="s9">11</td>
              <td className="s10">Survey Response</td>
              <td className="s10">Longitudinal Customer Journey Tracking</td>
              <td className="s10">
                Responses are attributed to a location and timestamp but not to
                a returning customer. Each scan is treated as anonymous and
                independent.
              </td>
              <td className="s10">
                Optional customer identifier (loyalty card scan, email entry)
                links multiple responses from the same customer over time,
                showing their satisfaction journey across visits and locations.
              </td>
              <td className="s10">API</td>
              <td className="s10">Medium</td>
              <td className="s10">
                Required for retail loyalty program operators who want to
                correlate survey scores with purchase frequency and churn
                prediction. Enables a premium CRM integration use case.
              </td>
              <td className="s10">High</td>
              <td className="s10">Medium</td>
              <td className="s10">P3</td>
              <td className="s10">Product</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R14"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  15
                </div>
              </th>
              <td className="s5">12</td>
              <td className="s6">Dashboard and Analytics</td>
              <td className="s6">Custom KPI Builder</td>
              <td className="s6">
                The Survey Info Dashboard shows a fixed set of metrics (total
                responses, CSAT, heat map, trend). Customers cannot add custom
                KPIs.
              </td>
              <td className="s6">
                Drag-and-drop custom dashboard builder allows operations and
                analytics teams to add, remove, and rearrange widgets. Custom
                KPI tiles can be created (e.g., average resolution TAT for a
                specific ticket category at specific locations).
              </td>
              <td className="s6">Native</td>
              <td className="s6">High</td>
              <td className="s6">
                Required for enterprise accounts with custom reporting formats.
                Removes the need for customers to export data and build custom
                Excel dashboards. Justifies a premium analytics tier.
              </td>
              <td className="s6">High</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">Product</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R15"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  16
                </div>
              </th>
              <td className="s9">13</td>
              <td className="s10">Survey Mapping</td>
              <td className="s10">Digital Signage QR Integration</td>
              <td className="s10">
                QR codes are downloaded as image files and printed or displayed
                on static screens. They cannot be updated or rotated remotely.
              </td>
              <td className="s10">
                Integration with digital signage platforms (Samsung MagicINFO,
                Scala, Rise Vision) to push Survey QR codes to digital screens
                remotely. Rotating QR codes per time-of-day configurable from
                Survey Admin.
              </td>
              <td className="s10">Third-party</td>
              <td className="s10">Medium</td>
              <td className="s10">
                Enables airport, transit hub, and large retail chain buyers to
                deploy dynamic QR displays without printing. Particularly
                valuable for airport and stadium use cases where static print is
                impractical.
              </td>
              <td className="s10">Medium</td>
              <td className="s10">Medium</td>
              <td className="s10">P2</td>
              <td className="s10">BD</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R16"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  17
                </div>
              </th>
              <td className="s7">14</td>
              <td className="s8">Admin Portal</td>
              <td className="s8">AI-Based Team Auto-Assignment</td>
              <td className="s8">
                Team assignment for ticket categories is configured manually by
                the Helpdesk Manager. New complaint categories require manual
                mapping updates.
              </td>
              <td className="s8">
                AI model learns from historical
                ticket-category-to-team-assignment patterns and automatically
                suggests or applies team assignments for new complaint
                categories it has not seen before.
              </td>
              <td className="s8">AI - LLM</td>
              <td className="s8">Medium</td>
              <td className="s8">
                Reduces configuration overhead for organizations with complex
                team structures. Particularly useful for FM companies adding new
                client sites with different team configurations.
              </td>
              <td className="s8">Low</td>
              <td className="s8">Medium</td>
              <td className="s8">P2</td>
              <td className="s8">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R17"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  18
                </div>
              </th>
              <td className="s9">15</td>
              <td className="s10">Survey Response</td>
              <td className="s10">Voice-to-Text Response Capture</td>
              <td className="s10">
                Text input responses require typed input. Respondents on mobile
                who want to share detailed feedback face keyboard friction.
              </td>
              <td className="s10">
                Voice recording option on the text input question type.
                Respondent taps a microphone icon and speaks their feedback. The
                response is transcribed to text and stored alongside typed
                responses.
              </td>
              <td className="s10">AI - NLP</td>
              <td className="s10">Medium</td>
              <td className="s10">
                Increases completion of text input responses by 20 to 35% in
                mobile environments. Particularly useful for respondents in
                healthcare and transit hub settings where typing is
                inconvenient.
              </td>
              <td className="s10">Medium</td>
              <td className="s10">Medium</td>
              <td className="s10">P2</td>
              <td className="s10">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R18"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  19
                </div>
              </th>
              <td className="s7">16</td>
              <td className="s8">Survey Mapping</td>
              <td className="s8">Satellite QR Validation</td>
              <td className="s8">
                Survey has no way to verify that a printed QR code is physically
                present at the location it is mapped to. QR codes may be
                damaged, removed, or obscured without the administrator knowing.
              </td>
              <td className="s8">
                Field verification app: Survey administrator or facility staff
                scan the location&#39;s QR code on their mobile device to
                confirm it is physically present and resolves correctly.
                Timestamp and GPS coordinates of the scan are recorded.
              </td>
              <td className="s8">Native</td>
              <td className="s8">Medium</td>
              <td className="s8">
                Prevents data gaps caused by QR codes that are missing but not
                reported. Particularly important for FM companies with 100+
                locations who cannot conduct manual QR audits. Reduces support
                tickets from accounts wondering why response volume dropped.
              </td>
              <td className="s8">Low</td>
              <td className="s8">Medium</td>
              <td className="s8">P3</td>
              <td className="s8">Product</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R19"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  20
                </div>
              </th>
              <td className="s5">17</td>
              <td className="s6">Dashboard and Analytics</td>
              <td className="s6">
                Cross-Account Benchmarking (for FM Resellers)
              </td>
              <td className="s6">
                FM company accounts can see their own client site data but
                cannot compare across clients without building a custom report.
              </td>
              <td className="s6">
                Optional opt-in benchmarking feature allows FM companies with
                multiple client accounts to see anonymized benchmark data:
                &#39;Your client portfolio CSAT is 3.8 out of 5. The top
                quartile FM company on Survey has a portfolio CSAT of 4.3.&#39;
              </td>
              <td className="s6">Native</td>
              <td className="s6">High</td>
              <td className="s6">
                Creates a competitive data moat that makes Survey sticky for FM
                company accounts. FM companies who see benchmarking data are
                less likely to churn. Creates a network effect: more FM
                companies on Survey = better benchmark data.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">Product</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R20"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  21
                </div>
              </th>
              <td className="s5">18</td>
              <td className="s6">Survey Response</td>
              <td className="s6">Real-Time Translation of Text Responses</td>
              <td className="s6">
                Text responses in regional languages (Hindi, Tamil, Telugu) are
                stored as-is. Administrators who do not read regional languages
                cannot analyze them.
              </td>
              <td className="s6">
                AI translation layer converts all text responses to a configured
                admin language in real time. Original text is preserved
                alongside the translation. Translation confidence score shown.
              </td>
              <td className="s6">AI - NLP</td>
              <td className="s6">High</td>
              <td className="s6">
                Enables India&#39;s multi-language operational environments to
                use a single Survey account across all regions. Required for
                national retail chains, FM companies, and healthcare networks
                operating across linguistic states.
              </td>
              <td className="s6">Low</td>
              <td className="s6">High</td>
              <td className="s6">P1</td>
              <td className="s6">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R21"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  22
                </div>
              </th>
              <td className="s5">19</td>
              <td className="s6">Admin Portal</td>
              <td className="s6">
                Cross-Platform Automation via Webhook Triggers
              </td>
              <td className="s6">
                Survey events (ticket raised, ticket resolved, TAT breached) are
                only visible within Survey. No external systems are notified
                automatically.
              </td>
              <td className="s6">
                Configurable webhook triggers for any Survey event. When a
                ticket is raised, resolved, or escalates, Survey POSTs the event
                data to any configured URL. Enables integration with Power BI,
                custom dashboards, PMS systems, and proprietary enterprise
                tools.
              </td>
              <td className="s6">Cross-platform automation</td>
              <td className="s6">High</td>
              <td className="s6">
                Required for enterprise accounts with existing business
                intelligence infrastructure. Enables Survey to feed dashboards,
                reporting systems, and operational tools without a native
                connector for each.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R22"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  23
                </div>
              </th>
              <td className="s5">20</td>
              <td className="s6">Survey Mapping</td>
              <td className="s6">API-Based Location Sync with PMS and ERP</td>
              <td className="s6">
                Locations are imported manually via Excel. When a new store
                opens or a hotel property is added to a chain&#39;s PMS, Survey
                must be updated manually.
              </td>
              <td className="s6">
                REST API endpoint for location management. When a new location
                is added to the client&#39;s PMS (Hotelogix, Oracle OPERA) or
                ERP (SAP, Oracle), a webhook automatically creates the location
                in Survey and generates its QR code.
              </td>
              <td className="s6">Cross-platform automation</td>
              <td className="s6">High</td>
              <td className="s6">
                Removes the manual location import step for enterprise accounts
                with 50+ locations. Eliminates the lag between a new location
                opening and Survey being active at that location. Reduces Survey
                Administrator workload by 50% for growing chains.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">Engineering</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R23"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  24
                </div>
              </th>
              <td className="s5">21</td>
              <td className="s6">Dashboard and Analytics</td>
              <td className="s6">Anomaly Detection Alerts</td>
              <td className="s6">
                Response data is shown on the dashboard. Unusual patterns
                (sudden spike in negative responses at one location, complete
                absence of responses at a normally active location) are only
                visible if someone checks the dashboard.
              </td>
              <td className="s6">
                AI model monitors response volume and sentiment patterns
                continuously. When an anomaly is detected (30% increase in
                negative responses at a location vs 7-day average, or zero
                responses for 48 hours at an active location), an alert email or
                SMS is sent to the configured operations contact.
              </td>
              <td className="s6">AI - Predictive</td>
              <td className="s6">High</td>
              <td className="s6">
                Enables operations teams to catch crises before they escalate. A
                sudden spike in negative responses at a retail location during
                peak hours may indicate a service failure, equipment breakdown,
                or staff shortage. Catching this in 2 hours instead of 3 days
                changes the business outcome.
              </td>
              <td className="s6">Medium</td>
              <td className="s6">High</td>
              <td className="s6">P2</td>
              <td className="s6">AI Team</td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R24"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  25
                </div>
              </th>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
              <td className="s11"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R25"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  26
                </div>
              </th>
              <td className="s12" colSpan="12">
                TOP 5 HIGHEST-IMPACT ENHANCEMENTS - SUMMARY
              </td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R26"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  27
                </div>
              </th>
              <td className="s13">Rank</td>
              <td className="s13">Feature</td>
              <td className="s13">Why it matters most</td>
              <td className="s13">Which competitor it leapfrogs</td>
              <td className="s13"></td>
              <td className="s13"></td>
              <td className="s13"></td>
              <td className="s13"></td>
              <td className="s13"></td>
              <td className="s13"></td>
              <td className="s13"></td>
              <td className="s13"></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R27"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  28
                </div>
              </th>
              <td className="s8">1</td>
              <td className="s8">AI Sentiment Scoring on Text Responses</td>
              <td className="s8">
                Closes the single most-cited analytical gap vs Zonka Feedback,
                SurveySensum, and SurveySparrow CogniVue. Without it, Survey
                cannot compete for enterprise CX buyers who require automated
                theme detection on open-text responses. Justifies a 40% pricing
                premium in the analytics tier.
              </td>
              <td className="s8">
                Zonka Feedback (AI Feedback Intelligence), SurveySensum (AI text
                analytics)
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R28"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  29
                </div>
              </th>
              <td className="s10">2</td>
              <td className="s10">
                MCP Integration with Freshdesk and Zendesk
              </td>
              <td className="s10">
                Removes the enterprise procurement blocker. 3 to 5 enterprise
                deals per quarter are estimated to be held back by the absence
                of native helpdesk integration. Combining both connectors in
                Phase 1 is the single highest-ROI engineering investment in the
                roadmap.
              </td>
              <td className="s10">
                Zonka Feedback (native Freshdesk/Zendesk), SurveySensum (Zendesk
                native)
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R29"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  30
                </div>
              </th>
              <td className="s8">3</td>
              <td className="s8">
                AI-Powered Insight Narration (Weekly Summary)
              </td>
              <td className="s8">
                Transforms Survey from a data collection tool into an insight
                delivery platform. Reduces analyst reporting time by 80%.
                Enables non-analytical operations managers to get value without
                building their own reports. This feature alone justifies a
                premium tier.
              </td>
              <td className="s8">
                Qualtrics iQ Center (AI narrative), Medallia Ask Medallia
                (generative AI querying)
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R30"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  31
                </div>
              </th>
              <td className="s10">4</td>
              <td className="s10">Real-Time Translation of Text Responses</td>
              <td className="s10">
                Immediately unlocks the entire India multilingual market.
                National retail chains, FM companies, and healthcare networks
                with operations in non-English regions cannot analyze text
                responses today. This is a Phase 1 AI feature with low
                engineering effort and high business impact.
              </td>
              <td className="s10">
                None of the India-focused competitors have this natively.
                First-mover advantage for multilingual India enterprise
                accounts.
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr style={{ height: 19 }}>
              <th
                id="1492894105R31"
                style={{ height: 19 }}
                className="row-headers-background"
              >
                <div className="row-header-wrapper" style={{ lineHeight: 19 }}>
                  32
                </div>
              </th>
              <td className="s8">5</td>
              <td className="s8">Predictive Dissatisfaction Scoring</td>
              <td className="s8">
                The most defensible moat feature in the Enhancement Roadmap. No
                India-market competitor offers predictive location-level
                satisfaction forecasting. Transforms Survey&#39;s value
                proposition from reactive (shows what happened) to proactive
                (predicts what will happen). Justifies a premium pricing tier
                INR 3,000 to 8,000/month above base.
              </td>
              <td className="s8">
                Qualtrics XM (predictive analytics), Medallia (predictive VoC) -
                both enterprise-only at 10-50x the price of Survey
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
