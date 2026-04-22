import React from "react";
import { ProductData } from "./BaseProductPage";

interface PostSalesFeaturesTabProps {
  productData: ProductData;
}

const PostSalesFeaturesTab: React.FC<PostSalesFeaturesTabProps> = ({ productData }) => {
  const features = productData.extendedContent?.detailedFeatures || [];

  return (
    <div className="animate-fade-in font-poppins pb-20 w-full overflow-hidden">
      {/* Title & Subtitle */}
      <div className="w-full mb-0">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756] text-xl font-semibold mb-4">
          Post Sales · Complete Feature List
        </div>
        <div className="bg-[#F6F4EE] text-[#DA7756] p-2 text-center text-[9pt] border-b border-[#C4B89D]/50">
          ★ USP features highlighted in orange  |  All {features.length} features listed  |  One row per feature
        </div>
      </div>

      {/* Feature Table */}
      <div className="overflow-x-auto w-full border-x border-[#C4B89D]/50">
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-[#DA7756] text-white font-bold text-[11pt] border-b border-[#C4B89D]/50">
              <th className="p-3 border-r border-[#C4B89D]/50 w-[40px] text-center">#</th>
              <th className="p-3 border-r border-[#C4B89D]/50 w-[200px] text-center">Module / Section</th>
              <th className="p-3 border-r border-[#C4B89D]/50 w-[250px] text-center">Feature Name</th>
              <th className="p-3 border-r border-[#C4B89D]/50 text-center">Description</th>
              <th className="p-3 w-[80px] text-center">USP?</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f: any, index: number) => {
              const isUSP = f.usp === true || (typeof f.usp === 'string' && f.usp.includes('USP'));

              // CSS Classes based on USP status
              const baseCellClass = "p-3 border-r border-[#C4B89D]/50 text-[10pt] align-middle overflow-hidden break-words";
              const indexClass = `${baseCellClass} bg-[#F6F4EE] text-[#212121] text-center`;
              const moduleClass = `${baseCellClass} ${isUSP ? 'bg-[#DA7756]/10 text-[#DA7756]' : 'bg-[#F6F4EE] text-[#006064]'} font-bold`;
              const featureClass = `${baseCellClass} ${isUSP ? 'bg-[#DA7756]/10 text-[#212121]' : 'bg-[#F6F4EE] text-[#212121]'} font-bold`;
              const descriptionClass = `${baseCellClass} ${isUSP ? 'bg-[#DA7756]/10 text-[#DA7756]' : 'bg-[#ffffff] text-[#212121]'} leading-relaxed`;
              const uspClass = `p-3 border-b border-[#C4B89D]/50 text-[10pt] align-middle text-center font-bold ${isUSP ? 'bg-[#e8f5e9] text-[#1b5e20]' : 'bg-[#ffebee] text-[#b71c1c]'}`;

              return (
                <tr key={index} className="border-b border-[#C4B89D]/50 min-h-[68px]">
                  <td className={indexClass}>{index + 1}</td>
                  <td className={moduleClass}>{f.module}</td>
                  <td className={featureClass}>{f.feature}</td>
                  <td className={descriptionClass}>{f.works || f.detail || f.description || ''}</td>
                  <td className={uspClass}>{isUSP ? "★ USP" : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostSalesFeaturesTab;
