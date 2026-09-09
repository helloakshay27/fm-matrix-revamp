import React from "react";
import { KPI_INFO } from "../../data/sampleData";

interface InfoPopoverProps {
  label: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({ label }) => {
  const info = KPI_INFO[label] || {
    f: "Definition not yet finalized for this metric.",
    m: "Business meaning to be confirmed with product team."
  };

  return (
    <span className="info-wrap">
      <button className="info-btn" type="button" tabIndex={-1}>i</button>
      <div className="info-pop">
        <b>Formula</b>
        {info.f}
        <div className="sep">
          <b>Business meaning</b>
          {info.m}
        </div>
      </div>
    </span>
  );
};
