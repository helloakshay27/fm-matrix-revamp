import React from "react";

const PostSalesMarketAnalysisTab: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto font-sans">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] text-xl font-bold mb-4">
        Post Sales · Market Analysis
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          width: "100%",
          minWidth: "1000px",
          backgroundColor: "white",
        }}
        cellSpacing="0"
        cellPadding="0"
      >
        <colgroup>
          <col width="150" />
          <col width="150" />
          <col width="150" />
          <col width="150" />
          <col width="150" />
          <col width="150" />
          <col width="200" />
          <col width="150" />
          <col width="120" />
          <col width="120" />
        </colgroup>
        <tbody>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid transparent",
                backgroundColor: "#F6F4EE",
                textAlign: "center",
                fontStyle: "italic",
                color: "#666666",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              Geography: India (primary) · GCC (secondary) | Section 1: Target
              Audience &amp; Pain Points | Section 2: Competitor Mapping
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid transparent",
                backgroundColor: "#DA7756",
                textAlign: "left",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "10pt",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              {" "}
              SECTION 1 ,TARGET AUDIENCE | Who we sell to, what pains them, and
              what it costs them to do nothing
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "left",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "10pt",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              {" "}
              1A ,INDUSTRY-LEVEL PAIN POINTS (Developer&#39;s perspective ,India
              &amp; Global)
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Industry &amp; Company Profile
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Key Pain Points
              <br />
              (Referral + Loyalty + Home Loan lens)
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              What Happens if NOT Solved
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              &#39;Good Enough&#39; Today
              <br />
              (Status quo they live with)
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Revenue Opportunity for Post Sales
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Urgency Signal
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Real Estate Developer ,India
              <br />
              500–5,000 active homebuyers
              <br />
              Mid-to-large residential developers
              <br />
              Mumbai, Pune, Bengaluru, Hyderabad, NCR
              <br />
              Annual sales budget: ₹10–100Cr
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              1. Cost of sales is 3–7% of revenue ,largely broker and channel
              partner commissions ,with no structured, measurable alternative.
              Every new launch resets the outbound spend.
              <br />
              2. No digital referral or loyalty infrastructure. Satisfied buyers
              refer informally, but the developer has no tool to track, reward,
              amplify, or time these referrals systematically.
              <br />
              3. Home loan commissions are uncaptured. Developers refer buyers
              to banks informally and receive no structured revenue share
              ,leaving ₹50L–2Cr/year per developer on the table.
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffebee",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Broker cost remains fixed or increases as competition for channel
              partner attention grows. Referral potential compounds negatively
              ,buyers never activated become detractors over time. Home loan
              commission revenue opportunity disappears as bank DSA networks
              disintermediate the developer entirely.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fffde7",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              WhatsApp groups for buyer communication + Salesforce CRM for
              backend tracking + Excel for referral tracking + phone calls for
              home loan referrals. &#39;It works well enough&#39; ,until they
              run a quantitative cost-of-sales analysis.
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Platform ACV ₹20–50L/year. Home loan commission rev-share
              ₹10–30L/year. Referral-sourced bookings reducing broker cost
              ₹50L–5Cr/year. Developer ROI positive in Month 3.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fddede",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              HIGH ,RERA market maturation + increasing broker commission costs
              + luxury segment growth creating urgency for structured referral
              infrastructure.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Luxury Developer ,India
              <br />
              ₹2Cr+ average unit value
              <br />
              200–2,000 active buyers
              <br />
              Mumbai, Bengaluru, Delhi NCR, Hyderabad
              <br />
              NRI buyer base significant (20–40% of sales)
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              1. NRI referral network is the most valuable sales asset
              ,untapped. NRI buyers have concentrated networks of similar-income
              individuals across UK, US, UAE, Singapore. No digital tool to
              activate this network systematically.
              <br />
              2. Loyalty program is either absent or a WhatsApp group.
              High-net-worth buyers expect a brand experience ,not a generic
              rewards app. The gap between their expectation and reality damages
              brand equity.
              <br />
              3. Broker commissions at ₹2Cr+ unit values are enormous (2–5% =
              ₹4L–10L per booking). 10 referral bookings replacing 10 broker
              bookings = ₹40L–1Cr in commission saved.
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffebee",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Luxury brand perception erodes if post-purchase experience is
              generic. NRI buyers who feel under-engaged refer competitors to
              their networks ,turning the developer&#39;s most valuable
              marketing asset into a competitor advantage.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fffde7",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Dedicated concierge RM team for VIP buyers + WhatsApp groups for
              NRI investors + periodic events without a structured loyalty
              framework.
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Platform ACV ₹30–60L/year. NRI referral bookings: ₹10–50Cr in
              revenue with ₹0 broker cost per referral. Home loan NRI module:
              ₹20,000–50,000 commission per GCC bank NRI loan disbursal.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fddede",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              HIGH ,NRI buyer segment growing + luxury market expanding + brand
              differentiation pressure increasing.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Real Estate Developer ,GCC
              <br />
              200–2,000 active buyers (NRI + GCC locals)
              <br />
              Dubai primary, Abu Dhabi, Riyadh secondary
              <br />
              Freehold residential projects ≥ AED 1M/unit
              <br />
              NRI buyers (South Asian) = 40–60% of base
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              1. RERA-Dubai mandates structured buyer communication and SPA
              milestone documentation. Non-compliance risk is real (penalties up
              to AED 1M per project) ,but manual compliance management is
              error-prone.
              <br />
              2. NRI referral network (UK, US, Canada, India diaspora in GCC) is
              globally the highest-value referral source for Indian and UAE
              property. No platform systematically activates this network.
              <br />
              3. Multilingual buyer experience (Arabic + English) is expected by
              premium buyers. Most developer portals are English-only with
              Arabic as an afterthought.
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffebee",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              RERA penalties, buyer disputes over documentation gaps, and NRI
              referrals going to competitors who offer a better buyer
              experience. Once an NRI buyer recommends a competitor to their
              network, the developer has lost not one but five to ten potential
              buyers.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fffde7",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Bilingual WhatsApp group + PDF milestones emailed to buyers + RM
              phone calls for NRI communication + informal bank referrals to
              Mashreq or Emirates NBD.
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Platform ACV AED 250K–700K/year (₹55–155L). NRI referral bookings
              at AED 1M+ unit values: AED 500K–5M+ in referral-sourced sales per
              90-day campaign. GCC bank home loan commission: AED 2,000–8,000
              per disbursal.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fddede",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              HIGH ,RERA compliance pressure + premium NRI buyer expectations +
              greenfield market (no dominant loyalty+referral platform in UAE
              real estate).
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid transparent",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                fontSize: "11pt",
                verticalAlign: "bottom",
                whiteSpace: "nowrap",
              }}
            ></td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "left",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "10pt",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              {" "}
              1B ,COMPANY-LEVEL PAIN POINTS (Specific developer profiles ,India
              )
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Company Type &amp; Profile
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Pain 1 (Referral / Sales Cost)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Pain 2 (Loyalty / Retention)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Pain 3 (Home Loan Revenue)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              What &#39;Good Enough&#39; Looks Like Now
            </td>
            <td
              colSpan={5}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              What They&#39;re Willing to Pay
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Mid-Market Indian Developer
              <br />
              500–2,000 active buyers/year
              <br />
              All India metros
              <br />
              Annual CX budget: ₹30–80L
              <br />
              2–5 active projects
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Broker commission: 2–4% of unit value. On ₹60Cr annual sales,
              that&#39;s ₹1.2–2.4Cr/year going to brokers. No structured
              referral alternative. Channel partner activation cost for every
              new launch.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff8e1",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Buyer communication is WhatsApp groups managed by RMs. No loyalty
              program. No structured engagement between booking and possession.
              Buyers who should be advocates are becoming detractors by
              possession day.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Home loan enquiries handled by RM via phone. No structured bank
              partnership. No commission tracking. ₹30–60L/year in home loan
              commissions informally lost.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fffde7",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Salesforce CRM for backend + WhatsApp for buyer communication +
              Excel for referral tracking. &#39;Works fine&#39; until a
              quantitative cost-of-sales review is done.
            </td>
            <td
              colSpan={5}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              ₹20–35L/year for a platform that demonstrably reduces cost of
              sales and adds home loan revenue. ROI case must be clear in the
              first 90 days.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Luxury Indian Developer
              <br />
              ₹2Cr+ unit value, 200–1,000 active buyers
              <br />
              Mumbai, Bengaluru, Hyderabad
              <br />
              Annual CX budget: ₹50–1.5Cr
              <br />
              NRI buyer base 20–40%
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Broker commissions at ₹2Cr+ units = ₹4L–10L per booking. 50 broker
              bookings/year = ₹2–5Cr in commissions. 10 referral bookings
              replacing 10 broker bookings = instant ₹40L–1Cr cost saving.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff8e1",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              No premium loyalty program that matches the brand. VIP buyers
              receive the same generic treatment as standard buyers. NPS among
              high-value buyers is lower than it should be ,these are the buyers
              whose networks are worth the most.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              NRI buyers refer to bank DSAs outside the developer&#39;s
              ecosystem. Developer receives zero revenue share. At ₹20,000+
              commission per NRI loan disbursal, this is a significant lost
              revenue stream.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fffde7",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Dedicated RM team + WhatsApp VIP group + periodic investor events.
              &#39;Premium experience&#39; delivered via people, not platform.
              Unscalable and undifferentiated.
            </td>
            <td
              colSpan={5}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              ₹30–60L/year. Will pay more for a white-label, brand-matched
              loyalty program that makes VIP buyers feel exclusive ,not like
              they&#39;re using the same app as everyone else.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              GCC Freehold Developer
              <br />
              200–1,000 active buyers (NRI + local)
              <br />
              Dubai primary, Abu Dhabi secondary
              <br />
              AED CX budget: 500K–2M/year
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Broker commissions: 2–4% AED on off-plan properties. AED 1M unit
              with 4% commission = AED 40,000/booking. 50 bookings/year = AED 2M
              in broker cost. 10 referral bookings from NRI network = AED 400K
              saved.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff8e1",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              No Arabic-native loyalty program. Multilingual buyer base (Arabic,
              English, Hindi) expects a culturally appropriate digital
              experience. Generic English-only apps create a perceived quality
              gap in the premium GCC market.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              GCC bank home loan partnerships (Mashreq, Emirates NBD, FAB) pay
              AED 2,000–8,000 per disbursal to structured referral partners. No
              developer in GCC has a structured in-app home loan referral
              workflow yet.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fffde7",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Bilingual WhatsApp + PDF reports + RM calls + periodic site
              visits. RERA compliance managed manually. &#39;Good enough&#39;
              until a RERA audit or a buyer dispute exposes the documentation
              gaps.
            </td>
            <td
              colSpan={5}
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                fontSize: "9pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              AED 250K–500K/year (₹55–110L). Value framing: RERA compliance +
              NRI referral activation + home loan commission revenue. Will pay
              significantly more if UAE data residency and Arabic interface are
              production-ready.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid transparent",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#000000",
                fontFamily: "Arial, sans-serif",
                fontSize: "11pt",
                verticalAlign: "bottom",
                whiteSpace: "nowrap",
              }}
            ></td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              colSpan={10}
              style={{
                borderBottom: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "left",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "10pt",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              {" "}
              SECTION 2 ,COMPETITOR MAPPING | India | Reloy is the primary named
              competitor
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Competitor
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Primary Target
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Pricing Model
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              How Buyers Find Them
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Strongest Features &amp; USPs
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Their Weakness
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              The Gap They Leave (Our Opportunity)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Their Innovations (Our Threat)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Pricing Risk to Us
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#DA7756",
                textAlign: "center",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "middle",
                whiteSpace: "pre-wrap",
              }}
            >
              Overall Threat Level
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Reloy (formerly Loyalie)
              <br />★ Primary Direct Competitor
              <br />
              📍 Mumbai, India
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Mid-to-large Indian residential developers · Godrej, Piramal,
              Mahindra, K Raheja, Shapoorji as named clients · 14 cities · India
              primary
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Annual SaaS license per developer. Not publicly disclosed.
              Estimated ₹15–40L/year based on buyer base size and features.
              Performance-linked pilot structures available.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Developer industry events (CREDAI, PropTech India) · Founder-led
              direct sales · Word-of-mouth from Godrej/Piramal reference clients
              · PropTech media coverage
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • Established referral sales track record (6% → 16% referral rate
              for one client in 10 months)
              <br />• ConnectRE (buyer loyalty) + WinnRE (channel partner)
              dual-product ,covers both sides of sales ecosystem
              <br />• ₹28.5Cr revenue (FY25), targeting ₹45–50Cr FY26
              <br />• HDFC Capital-backed (credibility signal)
              <br />• Named case studies with Tier-1 developers
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • No home loan commission module or structured bank partnership
              revenue
              <br />• No full lifecycle coverage (primarily post-possession;
              does not own booking → registration journey)
              <br />• No developer campaign studio for loyalty team self-serve
              <br />• No AI referral propensity engine ,referral activation is
              manual/passive
              <br />• Channel partner app (WinnRE) creates dilution of focus
              between buyer and broker
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f0fe",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Post Sales covers the full buyer lifecycle from booking Day 1 ,not
              just post-possession. We add home loan commission revenue as a
              direct P&amp;L line. Our AI propensity engine makes referrals
              proactive, not passive. We are the first platform to give the
              loyalty team a self-serve campaign studio.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff3cd",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Reloy&#39;s dual-product strategy (buyer + channel partner) could
              evolve into a full sales CRM replacement ,threat if they add
              booking-to-possession lifecycle coverage. Their HDFC Capital
              backing gives them capital to build fast.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              They are the benchmark. Enterprise developers will compare us to
              Reloy directly. Our pricing must be defensible against their
              existing pricing ,and our differentiation on home loan revenue +
              full lifecycle must be concretely demonstrated.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              HIGH ,Primary incumbent to displace. Know their pitch. Know their
              case studies. Know every gap.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              NoBrokerHood / MyGate
              <br />
              📍 India (post-possession community apps)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Housing societies and gated community residents · RWAs (Resident
              Welfare Associations) · India urban metros · Post-possession only
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Free for residents. Freemium/paid for society management features.
              Developer API integrations as paid add-ons. No developer SaaS
              pricing.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              App store organic · Housing society committee referrals ·
              Word-of-mouth in gated communities
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • Dominant post-possession community engagement: visitor
              management, maintenance payments, community board
              <br />• Large installed base (500,000+ societies claimed)
              <br />• Brand recognition among residents
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • No pre-possession coverage (booking → construction → possession
              is a gap they don&#39;t own)
              <br />• No loyalty + referral engine for developers
              <br />• No home loan module
              <br />• Developer relationship is transactional/API-level ,not a
              developer revenue story
              <br />• No developer campaign studio
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f0fe",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Post Sales owns the pre-possession journey that NoBrokerHood
              ignores. By the time possession happens, our buyers are already
              loyal advocates who have referred friends. We extend into
              post-possession with the community layer ,NoBrokerHood encroaching
              backward is our primary medium-term threat to defend against.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff3cd",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              NoBrokerHood could add a developer-facing loyalty + referral
              module and push backward into pre-possession. Well-funded
              (NoBroker raised $500M+). This is the most likely copycat threat
              in 12–24 months.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              They own the post-possession mindshare. Developers who already use
              NoBrokerHood for society management may resist adding another
              post-possession app.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              MEDIUM ,Not competing now, but a credible future threat if they
              move pre-possession.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Salesforce CRM
              <br />
              (+ WhatsApp + Email)
              <br />
              📍 Global (used by Indian developers as status quo)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Enterprise real estate developers with existing Salesforce
              licenses · CRM-managed post-sales workflows · India and GCC
              mid-to-large developers
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Salesforce: ₹3,500–12,000/user/month + implementation ₹10–50L+ ·
              Total cost of Salesforce + WhatsApp + Excel + manual workflows:
              ₹20–60L/year equivalent
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Already embedded in developer IT infrastructure · Not a
              &#39;competitor&#39; in the traditional sense ,it is the incumbent
              status quo we are displacing
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • Deep CRM functionality
              <br />• Executive familiarity and existing licences
              <br />• Integration with finance and ERP systems
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • No buyer-facing mobile app
              <br />• No referral or loyalty program
              <br />• No home loan commission tracking
              <br />• No gamification or engagement layer
              <br />• Developer teams operate it; buyers are completely excluded
              from the experience
              <br />• WhatsApp + Excel layer is unscalable and unmeasurable
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f0fe",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              The displacement pitch: &#39;You already pay for Salesforce. Post
              Sales sits on top of it ,we connect your buyers to your CRM data
              and add a referral and loyalty layer that Salesforce can never
              provide.&#39; Integration, not replacement.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff3cd",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Salesforce adding a homebuyer-facing module through a PropTech ISV
              partner is possible. Their App Exchange ecosystem could
              theoretically produce a competing product.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              IT Head objection: &#39;We already have Salesforce ,why do we need
              another platform?&#39; Counter: Post Sales adds buyer-facing
              capability (loyalty + referral + home loans) that Salesforce will
              never build. It is additive, not duplicative.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              LOW-MEDIUM ,Not a direct competitor but the conversation anchor
              for every enterprise IT objection.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              BuilderSoft / PropSoft
              <br />
              (India Real Estate ERP)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Indian residential developers managing inventory, payments, and
              sales · Small-to-mid developers (50–500 buyers/year) · One-time
              license model
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              One-time license ₹5–25L + AMC ₹1–5L/year. SaaS pricing not
              standard. No per-buyer-volume pricing.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Real estate developer conferences (CREDAI, NAREDCO) · Builder
              community referrals · Regional sales teams
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • Deep ERP functionality (inventory, payment tracking,
              construction cost management)
              <br />• Long-standing developer relationships in smaller developer
              market
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • No buyer-facing app or mobile experience
              <br />• No loyalty, referral, or advocacy features
              <br />• No home loan commission module
              <br />• Backend-only ,buyers are completely invisible to this
              product
              <br />• Technology stack is dated
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f0fe",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Small developer market (50–500 buyers) is an addressable expansion
              target for Post Sales once mid-market case studies are
              established. BuilderSoft&#39;s ERP-only positioning creates a
              complete gap in buyer experience, loyalty, and referral ,the exact
              value Post Sales delivers.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff3cd",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Unlikely to evolve rapidly. Technology and capital constraints
              limit their ability to build a modern buyer-facing product.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#ffffff",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              They compete only in the small developer segment. Risk is low
              unless they partner with a consumer-facing app builder.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              LOW ,Not a direct competitive threat. Potential adjacent
              displacement opportunity in Tier-2 developer market.
            </td>
          </tr>
          <tr style={{ height: "" }}>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Bayut / Property Finder
              <br />
              (GCC Real Estate Portals)
              <br />
              📍 UAE, Saudi Arabia, Qatar
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Property buyers and sellers in GCC markets · Real estate agencies
              and developers for lead generation · Dubai primary
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Lead generation model (pay-per-lead or subscription). No
              post-sales product revenue. Developer developer listings as
              primary product.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Google search dominance for UAE property keywords · Social media
              (Instagram, LinkedIn) · Developer-agency relationships
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f5e9",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • Dominant buyer discovery platforms in GCC
              <br />• Arabic-first user experience
              <br />• Deep developer and agency relationships
              <br />• Bayut: backed by Emerging Markets Property Group (OLX
              parent)
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff1f0",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              • No post-sales homebuyer experience ,listing ends at enquiry
              <br />• No loyalty or referral program for developers
              <br />• No home loan commission module
              <br />• Post-purchase buyer engagement is completely absent
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#e8f0fe",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              GCC portal market is entirely pre-purchase. There is no
              post-purchase loyalty + referral platform in UAE real estate ,Post
              Sales is the first. Bayut and Property Finder could become
              white-label API partners for our developer tools.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#fff3cd",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              Bayut could add a post-sales module to their developer dashboard.
              Given their developer relationships and Arabic-native UX, they
              would be a credible white-label platform competitor if they moved
              into this space.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              GCC entry price must be competitive vs. manual/informal status
              quo. AED 200–350K/year is the target pilot range ,below the cost
              of a dedicated post-sales RM team.
            </td>
            <td
              style={{
                borderBottom: "1px solid #cccccc",
                borderRight: "1px solid #cccccc",
                backgroundColor: "#F6F4EE",
                textAlign: "left",
                fontWeight: "bold",
                color: "#1a1a1a",
                fontFamily: "Arial, sans-serif",
                fontSize: "8pt",
                verticalAlign: "top",
                whiteSpace: "pre-wrap",
              }}
            >
              {" "}
              MEDIUM (GCC) ,Not a current competitor but a potential threat if
              they add post-purchase features. Also a potential partner.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PostSalesMarketAnalysisTab;
