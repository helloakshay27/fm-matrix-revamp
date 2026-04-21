import React, { useMemo } from "react";
import { ProductData } from "./BaseProductPage";
import { buildSummarySheetRows } from "./helpers";

interface PostSalesSummaryTabProps {
  productData: ProductData;
}

const PostSalesSummaryTab: React.FC<PostSalesSummaryTabProps> = ({ productData }) => {
  const perspectives = productData.extendedContent?.productSummaryNew?.perspectives || [];

  // Group all sections into one flat list or multiple tables
  // The user said "show all this tab in table 1 by 1 down"
  // This implies separate tables for each perspective or one big table. 
  // Let's go with a separate table for each perspective to keep the header rows clean as per the HTML.

  return (
    <div className="space-y-12 animate-fade-in font-poppins pb-20 w-full">
      {/* Header for the whole page */}
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h1 className="text-3xl font-bold tracking-tight text-center uppercase">
          {productData.name} &middot; FULL PRODUCT SUMMARY
        </h1>
        {productData.extendedContent?.productSummaryNew?.summarySubtitle && (
          <p className="text-xs opacity-70 italic mt-2 font-medium text-center">
            {productData.extendedContent.productSummaryNew.summarySubtitle}
          </p>
        )}
      </div>

      <div className="space-y-16 w-full">
        {perspectives.map((perspective, pIdx) => {
          // Get rows for this specific perspective
          const rows = buildSummarySheetRows(productData, pIdx);

          return (
            <div key={pIdx} className="bg-white border border-[#cccccc] shadow-sm rounded-sm overflow-hidden w-full">
              {/* Perspective Header Row */}
              <div className="bg-[#1a2744] text-white px-6 py-3 font-black text-xs uppercase tracking-[0.3em] border-b border-[#cccccc]">
                {perspective.title}
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse border-spacing-0">
                  <tbody>
                    {rows.map((row, index) => {
                      if (row.kind === "section") {
                        return (
                          <tr key={`section-${pIdx}-${index}`} className="h-[25px]">
                            <td
                              className="bg-[#1a2744] text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#cccccc]"
                              colSpan={2}
                            >
                              {row.label}
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr
                          key={`data-${pIdx}-${index}`}
                          className="group transition-colors align-top"
                        >
                          {/* Field Label */}
                          <td className="w-1/4 md:w-[20%] bg-[#eef2ff] border-b border-r border-[#cccccc] px-6 py-5 text-[13px] font-bold text-[#2e4a7a] leading-tight">
                            {row.label}
                          </td>
                          {/* Detail Content */}
                          <td className="bg-white border-b border-[#cccccc] px-6 py-5 text-[14px] text-[#1a1a1a] font-medium leading-relaxed whitespace-pre-line group-hover:bg-[#fafafa]">
                            {row.detail}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostSalesSummaryTab;
