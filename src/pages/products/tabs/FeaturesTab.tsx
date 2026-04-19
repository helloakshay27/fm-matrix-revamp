import React, { useMemo } from "react";
import { ProductData } from "../types";
import {
  getDisplayModule,
  getModuleTone,
  buildModuleIndexMap,
} from "../helpers";

interface FeaturesTabProps {
  productData: ProductData;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({ productData }) => {
  const excelFeatureRowStart = productData.excelFeatureRowStart ?? 1;
  const featureItems = useMemo(
    () => productData.extendedContent?.detailedFeatures ?? [],
    [productData.extendedContent?.detailedFeatures]
  );
  const moduleIndexMap = useMemo(
    () => buildModuleIndexMap(featureItems),
    [featureItems]
  );
  const hasDetailedFeatureSheet = featureItems.some(
    (item) => item.status?.trim() || item.priority?.trim() || item.notes?.trim()
  );

  return (
    <>
      <div className="bg-white text-gray-900 border border-[#C4B89D] border-l-4 border-l-[#DA7756] p-4 rounded-t-xl mb-0 flex justify-between items-center">
        <h2 className="text-xl font-semibold font-poppins uppercase tracking-tight">
          {productData.name} - Feature List
        </h2>
      </div>
      <div className="bg-transparent p-3 border-x border-[#D3D1C7]">
        <p className="text-[10px] text-[#2C2C2C]/60 font-medium leading-relaxed font-poppins">
          {productData.excelLikeFeatures
            ? hasDetailedFeatureSheet
              ? "All features listed. USP rows highlighted in gray. No omissions."
              : "Feature list shown in spreadsheet layout with module bands and USP markers."
            : "All features from product brief. USP rows highlighted in blue. Star (*) denotes unique competitive advantage."}
        </p>
      </div>

      {productData.excelLikeFeatures ? (
        <div className="border border-[#D3D1C7] bg-white">
          <div className="bg-white text-gray-800 border-b border-[#D3D1C7] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide font-poppins">
            {productData.name} - Full Feature List
          </div>
          <div className="w-full">
            {hasDetailedFeatureSheet ? (
              <table className="w-full table-fixed border-collapse text-[12px] leading-[1.55] font-poppins">
                <thead>
                  <tr className="bg-[#F6F4EE] text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                    <th className="border border-[#E5E7EB] px-2 py-3 text-left w-[16%]">
                      Feature Name
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-left w-[30%]">
                      Description
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-center w-[6%]">
                      USP?
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-left w-[12%]">
                      Module / Page
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-left w-[12%]">
                      User Type
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-center w-[8%]">
                      Status
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-center w-[8%]">
                      Priority
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-3 text-left w-[18%]">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureItems.map((f, i) => (
                    <tr
                      key={`${f.module}-${f.feature}-${i}`}
                      className={`${f.usp ? "bg-[#DA7756]/10" : i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]"} align-top`}
                    >
                      <td className="border border-[#E5E7EB] px-2 py-3 font-semibold text-[#2C2C2C] break-words whitespace-pre-line">
                        {f.feature}
                      </td>
                      <td
                        className={`border border-[#E5E7EB] px-2 py-3 whitespace-pre-line break-words ${f.usp ? "text-[#DA7756] font-semibold" : "text-[#2C2C2C] font-medium"}`}
                      >
                        {f.works}
                      </td>
                      <td
                        className={`border border-[#E5E7EB] px-2 py-3 text-center font-bold ${f.usp ? "text-[#DA7756]" : "text-[#9CA3AF]"}`}
                      >
                        {f.usp ? "Yes" : "No"}
                      </td>
                      <td className="border border-[#E5E7EB] px-2 py-3 text-[#2C2C2C] font-medium break-words whitespace-pre-line">
                        {f.module}
                      </td>
                      <td className="border border-[#E5E7EB] px-2 py-3 text-[#2C2C2C] font-medium break-words whitespace-pre-line">
                        {f.userType}
                      </td>
                      <td className="border border-[#E5E7EB] px-2 py-3 text-center text-[#2C2C2C] font-medium break-words whitespace-pre-line">
                        {f.status}
                      </td>
                      <td className="border border-[#E5E7EB] px-2 py-3 text-center text-[#2C2C2C] font-medium break-words whitespace-pre-line">
                        {f.priority}
                      </td>
                      <td className="border border-[#E5E7EB] px-2 py-3 text-[#2C2C2C] font-medium break-words whitespace-pre-line">
                        {f.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse text-[9px] leading-[1.25] font-poppins">
                <thead>
                  <tr className="bg-[#F6F4EE] text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase">
                    <th className="border border-[#E5E7EB] px-1 py-1.5 text-center w-[4%]">
                      #
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-1.5 text-left w-[13%]">
                      Module
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-1.5 text-left w-[14%]">
                      Feature
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-1.5 text-left w-[16%]">
                      Sub Feature
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-1.5 text-left">
                      How It Currently Works
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-1.5 text-center w-[9%]">
                      User Type
                    </th>
                    <th className="border border-[#E5E7EB] px-2 py-1.5 text-center w-[4%]">
                      USP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    type Group = {
                      moduleKey: string;
                      moduleLabel: string;
                      items: typeof featureItems;
                    };
                    const groups: Group[] = [];
                    featureItems.forEach((it) => {
                      const key = it.module.trim().toLowerCase();
                      const last = groups[groups.length - 1];
                      if (!last || last.moduleKey !== key) {
                        groups.push({
                          moduleKey: key,
                          moduleLabel: getDisplayModule(
                            it.module,
                            moduleIndexMap
                          ),
                          items: [it],
                        });
                      } else {
                        last.items.push(it);
                      }
                    });
                    let globalRowIdx = 0;
                    return groups.map((g) =>
                      g.items.map((f, localIdx) => {
                        const i = globalRowIdx++;
                        const zebra = i % 2 === 0 ? "bg-white" : "bg-[#F6F4EE]";
                        const showModuleCell = localIdx === 0;
                        const rowSpan = g.items.length;
                        return (
                          <tr
                            key={`${g.moduleKey}-${localIdx}-${f.feature}`}
                            className={`${zebra} align-top`}
                          >
                            <td className="border border-[#E5E7EB] px-1 py-1.5 text-center font-bold text-[#2C2C2C]/50 text-[8px]">
                              {excelFeatureRowStart + i}
                            </td>
                            {showModuleCell && (
                              <td
                                rowSpan={rowSpan}
                                className="border border-[#E5E7EB] px-2 py-1.5 font-semibold align-top bg-[#F6F4EE] text-[#2C2C2C] text-[9px] break-words"
                              >
                                {g.moduleLabel}
                              </td>
                            )}
                            <td className="border border-[#E5E7EB] px-2 py-1.5 font-semibold text-[#2C2C2C] text-[9px] break-words">
                              {f.feature}
                            </td>
                            <td className="border border-[#E5E7EB] px-2 py-1.5 text-[#2C2C2C] font-medium text-[9px] whitespace-pre-line break-words">
                              {f.subFeatures}
                            </td>
                            <td
                              className={`border border-[#E5E7EB] px-2 py-1.5 text-[9px] whitespace-pre-line break-words leading-relaxed ${f.usp ? "text-[#DA7756] font-semibold" : "text-[#2C2C2C]/80 font-medium"}`}
                            >
                              {f.works || ""}
                            </td>
                            <td className="border border-[#E5E7EB] px-1 py-1.5 text-center font-medium text-[8px] text-[#2C2C2C]/70 leading-snug break-words">
                              {f.userType}
                            </td>
                            <td
                              className={`border border-[#E5E7EB] px-1 py-1.5 text-center font-bold text-[8px] ${f.usp ? "bg-[#F6F4EE] text-[#DA7756]" : "bg-white text-[#D3D1C7]"}`}
                            >
                              {f.usp ? "★" : "—"}
                            </td>
                          </tr>
                        );
                      })
                    );
                  })()}
                </tbody>
              </table>
            )}
          </div>
          {hasDetailedFeatureSheet && (
            <div className="border-t border-[#D3D1C7] px-3 py-2 text-[11px] text-[#4B5563] font-medium font-poppins bg-white">
              Legend: gray rows are USP features that should appear in sales and
              marketing materials.
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-transparent p-3 border-x border-[#D3D1C7]">
            <p className="text-[10px] text-[#2C2C2C]/60 font-semibold italic leading-relaxed">
              <span className="text-gray-700">
                ★ USP features highlighted in orange
              </span>{" "}
              | Current scope: Projects - Tasks - Issues - Sprints - Channels -
              MoM - Opportunity Register - Documents - Todo - Notifications
            </p>
          </div>
          <div className="overflow-x-auto border border-[#D3D1C7] rounded-b-xl ">
            <table className="w-full border-collapse text-[10px] bg-transparent font-poppins">
              <thead>
                <tr className="bg-white text-gray-800 border-b border-[#D3D1C7] font-semibold uppercase text-center">
                  <th className="border border-[#D3D1C7] p-3 w-[5%]">#</th>
                  <th className="border border-[#D3D1C7] p-3 w-[15%] text-left">
                    Module / Section
                  </th>
                  <th className="border border-[#D3D1C7] p-3 w-[15%] text-left">
                    Feature Name
                  </th>
                  {productData.extendedContent?.detailedFeatures?.some(
                    (f) => f.subFeatures !== ""
                  ) && (
                    <th className="border border-[#D3D1C7] p-3 w-[20%] text-left">
                      Sub-Features
                    </th>
                  )}
                  <th className="border border-[#D3D1C7] p-3 text-left">
                    How It Currently Works
                  </th>
                  {productData.extendedContent?.detailedFeatures?.some(
                    (f) => f.userType !== "All" && f.userType !== ""
                  ) && (
                    <th className="border border-[#D3D1C7] p-3 w-[10%]">
                      User Type
                    </th>
                  )}
                  <th className="border border-[#D3D1C7] p-3 w-[8%]">USP?</th>
                </tr>
              </thead>
              <tbody>
                {productData.extendedContent?.detailedFeatures?.map((f, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[#E5E7EB] ${f.usp ? "bg-white font-semibold" : ""}`}
                  >
                    <td className="border border-[#D3D1C7] p-3 text-center font-semibold text-[#2C2C2C]/60">
                      {i + 1}
                    </td>
                    <td className="border border-[#D3D1C7] p-3 font-semibold text-gray-700 uppercase bg-white">
                      {f.module}
                    </td>
                    <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C] font-semibold">
                      {f.feature}
                    </td>
                    {productData.extendedContent?.detailedFeatures?.some(
                      (ft) => ft.subFeatures !== ""
                    ) && (
                      <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C]/80 leading-relaxed font-medium">
                        {f.subFeatures}
                      </td>
                    )}
                    <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C]/80 leading-relaxed italic">
                      {f.works}
                    </td>
                    {productData.extendedContent?.detailedFeatures?.some(
                      (ft) => ft.userType !== "All" && ft.userType !== ""
                    ) && (
                      <td className="border border-[#D3D1C7] p-3 text-[#2C2C2C]/60 font-semibold text-center uppercase tracking-tighter">
                        {f.userType}
                      </td>
                    )}
                    <td className="border border-[#D3D1C7] p-3 text-center">
                      {f.usp && (
                        <div className="flex items-center justify-center text-gray-700 text-sm">
                          <span>★</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default FeaturesTab;
