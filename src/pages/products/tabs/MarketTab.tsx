import React from "react";
import { ProductData } from "../types";

interface MarketTabProps {
  productData: ProductData;
}

const MarketTab: React.FC<MarketTabProps> = ({ productData }) => {
  const detailedMarketAnalysis =
    productData.extendedContent?.detailedMarketAnalysis;
  const hasCpMarketSheet =
    productData.name === "CP Management" &&
    (!!detailedMarketAnalysis?.targetAudience?.length ||
      !!detailedMarketAnalysis?.competitorMapping?.length);

  return (
    <>
      <div className="bg-white text-gray-900 border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold uppercase tracking-tight font-poppins">
          {productData.name} - Market Analysis
        </h2>
      </div>
      {hasCpMarketSheet ? (
        <div className="space-y-6">
          <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-[16px] font-semibold uppercase tracking-wide font-poppins text-center">
            {productData.name} - Market Analysis
          </div>
          <div className="bg-white border border-[#D3D1C7] px-4 py-2 text-[12px] text-gray-600 font-medium italic font-poppins text-center">
            Part A: Target Audience - India and GCC only | Part B: Competitor
            Mapping
          </div>

          {!!detailedMarketAnalysis?.targetAudience?.length && (
            <div className="space-y-3">
              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                Part A - Target Audience (India and GCC Only)
              </div>
              <div className="border border-[#D3D1C7] bg-white">
                <table className="w-full table-fixed border-collapse text-[12px] leading-[1.55] font-poppins">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-gray-800 font-semibold uppercase">
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[16%]">
                        Audience Segment
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[18%]">
                        Demographics
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[10%]">
                        Industry
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[20%]">
                        Pain Points (3 per segment)
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[18%]">
                        What Happens If NOT Solved
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[18%]">
                        What 'Good Enough' Looks Like Today
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedMarketAnalysis.targetAudience.map((row, index) => (
                      <tr
                        key={index}
                        className={`align-top ${index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                      >
                        <td className="border border-[#D3D1C7] px-3 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">
                          {row.segment}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                          {row.demographics}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                          {row.industry}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                          {row.painPoints}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                          {row.notSolved}
                        </td>
                        <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                          {row.goodEnough}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!!detailedMarketAnalysis?.competitorMapping?.length && (
            <div className="space-y-3">
              <div className="bg-white text-gray-800 border border-[#D3D1C7] px-4 py-3 text-[13px] font-semibold uppercase tracking-wide font-poppins">
                Part B - Competitor Mapping (India and GCC)
              </div>
              <div className="border border-[#D3D1C7] bg-white">
                <table className="w-full table-fixed border-collapse text-[12px] leading-[1.55] font-poppins">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-gray-800 font-semibold uppercase">
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[12%]">
                        Competitor Name / Type
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[12%]">
                        Primary Target Customer
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[11%]">
                        Pricing Model & Approx. Price Point
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[11%]">
                        How Buyers Discover Them
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[14%]">
                        Strongest Features & USPs
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[12%]">
                        Weaknesses
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[16%]">
                        Market Gaps They Leave & How We Exploit Them
                      </th>
                      <th className="border border-[#D3D1C7] px-3 py-3 text-left w-[12%]">
                        Their Innovations That Threaten Us
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedMarketAnalysis.competitorMapping.map(
                      (row, index) => (
                        <tr
                          key={index}
                          className={`align-top ${index % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                        >
                          <td className="border border-[#D3D1C7] px-3 py-3 font-semibold text-[#2C2C2C] whitespace-pre-line break-words">
                            {row.name}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.targetCustomer}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.pricing}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.discovery}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.strongestFeatures}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.weakness}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.marketGaps}
                          </td>
                          <td className="border border-[#D3D1C7] px-3 py-3 text-[#2C2C2C] font-medium whitespace-pre-line break-words">
                            {row.threats}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : productData.excelLikeMarket &&
        productData.extendedContent?.detailedMarketAnalysis
          ?.marketMatrixRows ? (
        <div
          className="overflow-x-auto border border-[#E5E7EB] bg-transparent p-2"
          style={{}}
        >
          <table className="w-[1280px] border-collapse bg-transparent text-[9px] leading-[1.2] font-poppins">
            <thead>
              <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                <th
                  className="px-2 py-1.5 text-center font-semibold"
                  colSpan={12}
                >
                  Post Sales - Market Analysis
                </th>
              </tr>
              <tr className="bg-white text-gray-700 border-b border-[#D3D1C7]">
                <th
                  className="px-2 py-1 text-left text-[8px] font-semibold"
                  colSpan={12}
                >
                  {productData.extendedContent.detailedMarketAnalysis
                    .marketMatrixSubtitle ||
                    "Behavior / price sensitivity / trust barrier / incumbent intensity / strategic fit"}
                </th>
              </tr>
              <tr className="bg-white text-gray-800 border-b border-[#D3D1C7]">
                <th
                  className="px-1.5 py-1 text-left font-semibold uppercase"
                  colSpan={12}
                >
                  Section 1: Target Audience | Who we sell to, what pains them,
                  and what shifts them to us
                </th>
              </tr>
              <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Who Is This Today
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Who We Sell To
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Sub-Sector
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  What Budget They Have
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  How They Buy
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Who They Use Today
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  How Ready They Are
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  What Makes Them Switch
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  What Win Looks Like
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Big Risk
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Entry Wedge
                </th>
                <th className="border border-[#E5E7EB] bg-white text-gray-800 px-1.5 py-1 text-left">
                  Opportunity
                </th>
              </tr>
            </thead>
            <tbody>
              {productData.extendedContent.detailedMarketAnalysis.marketMatrixRows.map(
                (r, i) => (
                  <tr key={i} className="align-top">
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 font-bold text-[#2C2C2C]">
                      {r.segment}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]">
                      {r.whoToday}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.subsector}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.budget}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.purchasePattern}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.incumbents}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.readiness}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.trigger}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 font-semibold text-[#4B5563]">
                      {r.payoff}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.risk}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 text-[#2C2C2C]/80">
                      {r.entryWedge}
                    </td>
                    <td className="border border-[#E5E7EB] bg-white px-1.5 py-1 font-semibold text-[#798C5E]">
                      {r.opportunity}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : productData.excelLikeMarket &&
        productData.extendedContent?.detailedMarketAnalysis &&
        (productData.extendedContent.detailedMarketAnalysis.targetAudience
          ?.length ||
          productData.extendedContent.detailedMarketAnalysis.competitorMapping
            ?.length) ? (
        <div className="border border-[#E5E7EB] bg-transparent p-2" style={{}}>
          <div className="w-full bg-transparent">
            {/* Main Header */}
            <div className="bg-white text-gray-800 border-b border-[#D3D1C7] px-4 py-3 text-2xl font-bold uppercase tracking-widest font-poppins text-center border-x border-t">
              {productData.name} · Market Analysis
            </div>
            <div className="bg-transparent border-x border-gray-300 px-3 py-1 text-[10px] text-gray-700 italic font-medium flex justify-center gap-10">
              <span>Geography: India (primary) · GCC (secondary)</span>
              <span>|</span>
              <span>Section 1: Target Audience & Pain Points</span>
              <span>|</span>
              <span>Section 2: Competitor Mapping</span>
            </div>

            {/* Section 1 Header */}
            <div className="bg-white text-gray-800 border-b border-[#D3D1C7] px-4 py-2 text-xs font-bold uppercase tracking-wider font-poppins border-x">
              SECTION 1 , TARGET AUDIENCE | Who we sell to, what pains them, and
              what it costs them to do nothing
            </div>

            <div className="mt-0 space-y-0">
              {/* 1A. Industry-Level Pain Points */}
              {!!productData.extendedContent.detailedMarketAnalysis
                .targetAudience?.length && (
                <div className="border-x border-gray-400">
                  <div className="bg-white text-gray-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide font-poppins border-b border-[#D3D1C7]">
                    1A , INDUSTRY-LEVEL PAIN POINTS (Developer's perspective ,
                    India & Global)
                  </div>
                  <div className="bg-transparent">
                    <table className="w-full border-collapse text-[9px] leading-[1.2] table-fixed font-poppins">
                      <thead>
                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-bold uppercase text-center">
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[16%]">
                            Industry & Company Profile
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[22%]">
                            Key Pain Points
                            <br />
                            (Referral + Loyalty + Home Loan lens)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[18%]">
                            What Happens If NOT Solved
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[16%]">
                            'Good Enough' Today
                            <br />
                            (Status quo they live with)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[18%]">
                            Revenue Opportunity for Post Sales
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[10%]">
                            Urgency Signal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent.detailedMarketAnalysis.targetAudience.map(
                          (t, i) => (
                            <tr key={i} className="align-top">
                              <td className="border border-[#D3D1C7] p-2 font-bold text-[#2C2C2C] bg-white whitespace-pre-line">
                                {t.segment}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-semibold whitespace-pre-line">
                                {t.painPoints}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-medium whitespace-pre-line">
                                {t.notSolved}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C]/80 font-medium whitespace-pre-line italic">
                                {t.goodEnough}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#374151] font-bold whitespace-pre-line">
                                {t.revenueOpportunity}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#b91c1c] font-bold text-center text-[8px] whitespace-pre-line">
                                {t.urgencySignal}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 1B. Company-Level Pain Points */}
              {!!productData.extendedContent.detailedMarketAnalysis
                .companyPainPoints?.length && (
                <div className="border-x border-gray-400 border-t">
                  <div className="bg-white text-gray-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide font-poppins border-b border-[#D3D1C7]">
                    1B , COMPANY-LEVEL PAIN POINTS (Specific developer profiles
                    , India)
                  </div>
                  <div className="bg-transparent">
                    <table className="w-full border-collapse text-[9px] leading-[1.2] table-fixed font-poppins">
                      <thead>
                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-bold uppercase text-center">
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[16%]">
                            Company Type & Profile
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[18%]">
                            Pain 1 (Referral / Sales Cost)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[18%]">
                            Pain 2 (Loyalty / Retention)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[16%]">
                            Pain 3 (Home Loan Revenue)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[16%]">
                            What 'Good Enough' Looks Like Now
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[16%]">
                            What They're Willing to Pay
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent.detailedMarketAnalysis.companyPainPoints.map(
                          (c, i) => (
                            <tr key={i} className="align-top">
                              <td className="border border-[#D3D1C7] p-2 font-bold text-[#2C2C2C] bg-white whitespace-pre-line">
                                {c.companyType}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-semibold whitespace-pre-line">
                                {c.pain1}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-semibold whitespace-pre-line">
                                {c.pain2}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-semibold whitespace-pre-line">
                                {c.pain3}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C]/80 font-medium whitespace-pre-line italic">
                                {c.goodEnough}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#374151] font-bold whitespace-pre-line">
                                {c.willingToPay}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Section 2 Header */}
              <div className="bg-white text-gray-800 border-y border-[#D3D1C7] px-4 py-2 text-xs font-bold uppercase tracking-wider font-poppins border-x">
                SECTION 2 , COMPETITOR MAPPING | India | Reloy is the primary
                named competitor
              </div>

              {/* Section 2 Content */}
              {!!productData.extendedContent.detailedMarketAnalysis
                .competitorMapping?.length && (
                <div className="border-x border-gray-400">
                  <div className="bg-transparent">
                    <table className="w-full border-collapse text-[8px] leading-[1.1] table-fixed font-poppins">
                      <thead>
                        <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-bold uppercase text-center">
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[10%]">
                            Competitor
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[11%]">
                            Primary Target
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[11%]">
                            Pricing Model
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[11%]">
                            How Buyers Find Them
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[11%]">
                            Strongest Features & USPs
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[10%]">
                            Their Weakness
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[11%]">
                            The Gap They Leave (Our Opportunity)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[10%]">
                            Their Innovations (Our Threat)
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[8%]">
                            Pricing Risk to Us
                          </th>
                          <th className="border border-[#C4B89D] px-1.5 py-2 w-[7%]">
                            Overall Threat Level
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.extendedContent.detailedMarketAnalysis.competitorMapping.map(
                          (c, i) => (
                            <tr key={i} className="align-top">
                              <td className="border border-[#D3D1C7] p-2 font-bold text-[#2C2C2C] bg-white">
                                {c.name}
                                {c.isPrimary && (
                                  <div className="text-[7px] text-red-600 mt-1 uppercase font-black">
                                    ★ Primary Direct Competitor
                                  </div>
                                )}
                                {c.location && (
                                  <div className="text-[7px] text-gray-400 font-medium mt-1 uppercase italic">
                                    📍 {c.location}
                                  </div>
                                )}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-semibold whitespace-pre-line">
                                {c.targetCustomer}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-medium whitespace-pre-line italic">
                                {c.pricing}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C]/80 font-medium whitespace-pre-line">
                                {c.discovery}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#798C5E] font-bold whitespace-pre-line">
                                • {c.strongestFeatures}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#b91c1c] font-bold whitespace-pre-line">
                                • {c.weakness}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#4B5563] font-bold whitespace-pre-line">
                                {c.marketGaps}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#D97706] font-bold whitespace-pre-line">
                                {c.threats}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#2C2C2C] font-semibold text-center">
                                {c.pricingRisk || "MEDIUM"}
                              </td>
                              <td className="border border-[#D3D1C7] p-2 text-[#b91c1c] font-black text-center text-[9px] uppercase leading-tight">
                                {c.threatLevel || "HIGH"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : productData.extendedContent?.detailedMarketAnalysis ? (
        <>
          <div className="bg-transparent p-2 border-x border-[#C4B89D]">
            <p className="text-[10px] text-gray-700 font-semibold italic font-poppins">
              India Primary | Global Secondary | Data as of Q1 2026 | All
              pricing verified from public sources
            </p>
          </div>

          {productData.extendedContent?.detailedMarketAnalysis
            ?.targetAudience && (
            <div className="space-y-4">
              <div className="bg-white text-gray-800 border-y border-[#D3D1C7] px-4 py-2 font-semibold text-sm uppercase font-poppins">
                PART A — TARGET AUDIENCE (India and GCC Only)
              </div>
              <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                      <th className="border border-[#C4B89D] p-3 w-[15%]">
                        Audience Segment
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[15%]">
                        Demographics
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[15%]">
                        Industry
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[20%]">
                        Pain Points (3 per segment)
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[15%]">
                        What Happens If NOT Solved
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[15%]">
                        What 'Good Enough' Looks Like Today
                      </th>
                      {productData.extendedContent.detailedMarketAnalysis
                        .targetAudience[0]?.urgency && (
                        <th className="border border-[#C4B89D] p-3 w-[5%]">
                          Urgency
                        </th>
                      )}
                      {productData.extendedContent.detailedMarketAnalysis
                        .targetAudience[0]?.primaryBuyer && (
                        <th className="border border-[#C4B89D] p-3 w-[10%]">
                          Primary Buyer
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent.detailedMarketAnalysis.targetAudience.map(
                      (t, i) => (
                        <tr key={i} className="border-b border-[#E5E7EB]">
                          <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700">
                            {t.segment}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed">
                            {t.demographics}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] font-semibold">
                            {t.industry}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                            {t.painPoints}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#C72030] font-medium leading-relaxed">
                            {t.notSolved}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/60 font-medium">
                            {t.goodEnough}
                          </td>
                          {t.urgency && (
                            <td
                              className={`border border-[#C4B89D] p-3 font-semibold text-center ${t.urgency === "HIGH" ? "text-[#798C5E] bg-[#F6F4EE]" : "text-[#2C2C2C]/80"}`}
                            >
                              {t.urgency}
                            </td>
                          )}
                          {t.primaryBuyer && (
                            <td className="border border-[#C4B89D] p-3 text-gray-700 font-semibold">
                              {t.primaryBuyer}
                            </td>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {productData.extendedContent?.detailedMarketAnalysis
            ?.companyPainPoints && (
            <div className="space-y-4">
              <div className="bg-white text-gray-800 border-y border-[#D3D1C7] px-4 py-2 font-semibold text-sm uppercase font-poppins">
                PART A.2 — COMPANY-LEVEL PAIN POINTS (India and GCC)
              </div>
              <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                      <th className="border border-[#C4B89D] p-3 w-[20%]">
                        Company Type
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[20%]">
                        Pain 1
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[20%]">
                        Pain 2
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[20%]">
                        Pain 3
                      </th>
                      <th className="border border-[#C4B89D] p-3 w-[20%]">
                        Cost / Risk if unsolved
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent.detailedMarketAnalysis.companyPainPoints.map(
                      (c, i) => (
                        <tr key={i} className="">
                          <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700 bg-white">
                            {c.companyType}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                            {c.pain1}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                            {c.pain2}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                            {c.pain3}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#C72030] font-semibold leading-relaxed">
                            {c.costRisk}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {productData.extendedContent?.detailedMarketAnalysis
            ?.competitorMapping && (
            <div className="space-y-4">
              <div className="bg-white text-gray-800 border-y border-[#D3D1C7] px-4 py-2 font-semibold text-sm uppercase font-poppins">
                PART B — COMPETITOR MAPPING (India and GCC)
              </div>
              <div className="overflow-x-auto border border-[#C4B89D] rounded-xl ">
                <table className="w-full border-collapse text-[10px] bg-transparent text-left font-poppins">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                      <th className="border border-[#C4B89D] p-3">
                        Competitor Name / Type
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        Primary Target Customer
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        Pricing Model & Price
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        How Buyers Discover Them
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        Strongest Features & USPs
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        Weaknesses
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        Market Gaps & How We Exploit
                      </th>
                      <th className="border border-[#C4B89D] p-3">
                        Their Innovations That Threaten Us
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent.detailedMarketAnalysis.competitorMapping.map(
                      (c, i) => (
                        <tr key={i} className="">
                          <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700 bg-transparent">
                            {c.name}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium leading-relaxed bg-transparent">
                            {c.targetCustomer}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] italic bg-transparent">
                            {c.pricing}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed bg-transparent">
                            {c.discovery}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#798C5E] font-semibold leading-relaxed bg-transparent">
                            {c.strongestFeatures}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-red-700 font-semibold leading-relaxed bg-transparent">
                            {c.weakness}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#4B5563] font-semibold leading-relaxed bg-transparent">
                            {c.marketGaps}
                          </td>
                          <td className="border border-[#C4B89D] p-3 text-[#6B7280] font-medium italic bg-transparent">
                            {c.threats}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legacy schema fallbacks with Enhanced Excel-Style UI */}
          {productData.extendedContent?.detailedMarketAnalysis?.marketSize &&
            !productData.extendedContent?.detailedMarketAnalysis
              ?.targetAudience && (
              <div className="space-y-6">
                <div className="bg-white text-gray-900 border border-[#D3D1C7] px-4 py-3 font-semibold text-base uppercase tracking-wider font-poppins rounded-t-xl border-x">
                  1. Market Size and Growth Analysis
                </div>
                <div className="overflow-x-auto border border-[#C4B89D] bg-transparent p-3  rounded-b-xl">
                  <table
                    className="w-full border-collapse text-[10px] bg-transparent text-center font-poppins rounded-lg overflow-hidden border border-[#D3D1C7]"
                    style={{}}
                  >
                    <thead>
                      <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                        <th className="border border-[#C4B89D] p-3 w-[15%]">
                          Segment
                        </th>
                        <th className="border border-[#C4B89D] p-3 w-[10%] text-center">
                          2024/25 Val
                        </th>
                        <th className="border border-[#C4B89D] p-3 w-[10%] text-center">
                          2026 Val
                        </th>
                        <th className="border border-[#C4B89D] p-3 w-[15%] text-center">
                          Forecast
                        </th>
                        <th className="border border-[#C4B89D] p-3 w-[8%] text-center">
                          CAGR
                        </th>
                        <th className="border border-[#C4B89D] p-3 w-[20%] text-left">
                          Key Driver
                        </th>
                        <th className="border border-[#C4B89D] p-3 w-[22%] text-left">
                          India Relevance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedMarketAnalysis.marketSize.map(
                        (m, i) => (
                          <tr key={i} className="">
                            <td className="border border-[#C4B89D] p-3 font-semibold text-gray-700 uppercase bg-transparent/50">
                              {m.segment}
                            </td>
                            <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium">
                              {m.val2425}
                            </td>
                            <td className="border border-[#C4B89D] p-3 text-[#2C2C2C] font-semibold">
                              {m.val26}
                            </td>
                            <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 font-medium italic">
                              {m.forecast}
                            </td>
                            <td className="border border-[#C4B89D] p-3 text-center font-semibold text-[#4B5563]">
                              {m.cagr}
                            </td>
                            <td className="border border-[#C4B89D] p-3 text-[#2C2C2C]/80 leading-relaxed font-medium text-left">
                              {m.driver}
                            </td>
                            <td className="border border-[#C4B89D] p-3 text-[#4B5563] leading-relaxed font-semibold text-left">
                              {m.india}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* ── Part 1: Competitor Landscape ────────────────────────────── */}
          {productData.extendedContent?.detailedMarketAnalysis?.competitors &&
            !productData.extendedContent?.detailedMarketAnalysis
              ?.competitorMapping && (
              <div className="space-y-0 mt-6">
                <div className="bg-white text-gray-900 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                  Part 1 — Competitor Landscape (India Primary, Global
                  Secondary)
                </div>
                <div className="overflow-x-auto border border-[#D3D1C7] border-t-0">
                  <table className="w-full border-collapse text-[9px] bg-transparent font-poppins leading-[1.25]">
                    <thead>
                      <tr className="bg-[#F6F4EE] text-gray-800 font-semibold uppercase">
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[9%] text-left">
                          Competitor
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[7%] text-center">
                          HQ
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[8%] text-center">
                          India Pricing (INR/yr)
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[9%] text-center">
                          Global Pricing (USD/yr)
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 text-left">
                          Key Strength
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 text-left">
                          Key Gap vs VMS
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[9%] text-left">
                          India Presence
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[9%] text-left">
                          Target Segment
                        </th>
                        <th className="border border-[#D3D1C7] px-2 py-2 w-[12%] text-left">
                          2026 Differentiator
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.extendedContent.detailedMarketAnalysis.competitors.map(
                        (comp, i) => (
                          <tr
                            key={i}
                            className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                          >
                            <td className="border border-[#D3D1C7] px-2 py-2 font-bold text-[#2C2C2C]">
                              {comp.name}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-[#2C2C2C]/70 font-medium text-center">
                              {comp.hq}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-gray-700 font-semibold text-center">
                              {comp.indiaPrice}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-[#2C2C2C]/70 font-medium text-center italic">
                              {comp.globalPrice}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-[#374151] font-semibold leading-snug">
                              {comp.strength}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-red-700 font-semibold leading-snug">
                              {comp.weakness}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-[#2C2C2C]/80 font-medium leading-snug">
                              {comp.indiaPresence ?? ""}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-[#4B5563] font-semibold leading-snug">
                              {comp.targetSegment ?? ""}
                            </td>
                            <td className="border border-[#D3D1C7] px-2 py-2 text-[#374151] font-medium leading-snug italic">
                              {comp.differentiator2026 ?? ""}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                {productData.extendedContent.detailedMarketAnalysis
                  .competitorSummary && (
                  <div className="bg-[#F6F4EE] text-gray-800 border border-[#D3D1C7] border-t-0 px-4 py-3 text-[9px] font-medium leading-relaxed font-poppins">
                    <span className="font-bold uppercase text-gray-500 mr-2">
                      COMPETITOR SUMMARY —
                    </span>
                    {
                      productData.extendedContent.detailedMarketAnalysis
                        .competitorSummary
                    }
                  </div>
                )}
              </div>
            )}

          {/* ── Part 2: Top 10 Industries by VMS Relevance ─────────────── */}
          {productData.extendedContent?.detailedMarketAnalysis
            ?.topIndustries && (
            <div className="space-y-0 mt-6">
              <div className="bg-white text-gray-900 border border-[#D3D1C7] px-4 py-3 font-semibold text-sm uppercase tracking-wider font-poppins">
                Part 2 — Top 10 Industries by VMS Relevance (India)
              </div>
              <div className="overflow-x-auto border border-[#D3D1C7] border-t-0">
                <table className="w-full border-collapse text-[9px] bg-transparent font-poppins leading-[1.25]">
                  <thead>
                    <tr className="bg-[#F6F4EE] text-gray-800 font-semibold uppercase">
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[4%] text-center">
                        Rank
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[9%] text-left">
                        Industry
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[8%] text-center">
                        India Market Relevance
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[12%] text-left">
                        Vendor Complexity
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 text-left">
                        Key VMS Use Case
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[8%] text-center">
                        Approx Vendor Count (Org)
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[10%] text-left">
                        Compliance Need
                      </th>
                      <th className="border border-[#D3D1C7] px-2 py-2 w-[14%] text-left">
                        Growth Driver 2026
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.extendedContent.detailedMarketAnalysis.topIndustries.map(
                      (ind, i) => (
                        <tr
                          key={i}
                          className={`align-top ${i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"}`}
                        >
                          <td className="border border-[#D3D1C7] px-2 py-2 font-bold text-gray-600 text-center">
                            {ind.rank ?? i + 1}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 font-semibold text-[#2C2C2C]">
                            {ind.industry}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 text-center font-semibold text-[#374151]">
                            {ind.indiaRelevance ?? ""}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 text-[#2C2C2C]/80 font-medium">
                            {ind.vendorComplexity ?? ""}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 text-[#2C2C2C]/80 font-medium leading-snug">
                            {ind.keyVmsUseCase ?? ind.buyReason}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 text-center font-semibold text-[#374151]">
                            {ind.approxVendorCount ?? ""}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 text-[#2C2C2C]/80 font-medium leading-snug">
                            {ind.complianceNeed ?? ""}
                          </td>
                          <td className="border border-[#D3D1C7] px-2 py-2 text-[#4B5563] font-semibold leading-snug">
                            {ind.growthDriver2026 ?? ""}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-20 text-center text-[#2C2C2C]/60 font-semibold uppercase text-xl border-4 border-dashed rounded-[3rem]">
          Market Analysis Data Coming Soon
        </div>
      )}
    </>
  );
};

export default MarketTab;
