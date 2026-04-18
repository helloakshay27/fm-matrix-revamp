import React from "react";
import { ProductData } from "../types";

interface PostPossessionTabProps {
  productData: ProductData;
}

const PostPossessionTab: React.FC<PostPossessionTabProps> = ({ productData }) => {
  if (productData.excelLikePostPossession) {
    return (
      <div className="overflow-x-auto rounded-xl border border-[#D3D1C7] bg-transparent p-3 ">
        <div className="min-w-[1400px] rounded-md bg-transparent" style={{}}>
          <div className="mx-auto w-full max-w-[1200px] pt-4 pb-6">
            <div className="bg-white text-gray-900 border border-[#D3D1C7] px-4 py-2 font-semibold uppercase tracking-tight text-[11px] text-center font-poppins">
              {productData.extendedContent?.detailedPostPossession?.title || "Post Possession - Full Table"}
            </div>

            {productData.extendedContent?.detailedPostPossession?.sections?.length ? (
              <div className="space-y-6 p-4">
                {productData.extendedContent.detailedPostPossession.sections.map((section, sIdx) => {
                  const tone = section.tone === "green"
                    ? { bar: "bg-white text-gray-800 border-b border-[#D3D1C7]", head: "bg-white" }
                    : section.tone === "red"
                      ? { bar: "bg-[#E49191]", head: "bg-[#E49191]/10" }
                      : { bar: "bg-white text-gray-800 border-b border-[#D3D1C7]", head: "bg-white" };

                  return (
                    <div key={sIdx} className="border border-[#D3D1C7] bg-transparent">
                      <div className={`${tone.bar} px-3 py-1.5 text-[10px] font-semibold font-poppins uppercase tracking-wide text-gray-800`}>
                        {section.title}
                      </div>
                      <table className="w-full border-collapse font-poppins text-[9px] leading-[1.25] text-left">
                        <thead>
                          <tr className="font-semibold uppercase text-[8px] text-[#2C2C2C]">
                            {section.columns.map((c, cIdx) => (
                              <th key={cIdx} className={`border border-[#E5E7EB] ${tone.head} px-2 py-2`}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows.map((row, rIdx) => (
                            <tr key={rIdx} className={`${rIdx % 2 === 0 ? "bg-transparent" : "bg-transparent/50"} align-top transition-colors`}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="border border-[#E5E7EB] px-2 py-2 whitespace-pre-line">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[2rem] m-4">
                Post Possession Data Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-20 text-center text-[#D3D1C7] font-semibold uppercase text-xl border-4 border-dashed border-[#D3D1C7] rounded-[3rem]">
      Post Possession UI Coming Soon
    </div>
  );
};

export default PostPossessionTab;
