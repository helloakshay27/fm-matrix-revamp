import React, { useState } from "react";
import "../styles/style.css";

import { Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";

const TierSetting = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selectedTimeframe) {
      setError("Please select a timeframe option before proceeding.");
      return;
    }

    // Store the selected timeframe in sessionStorage or pass it to the next component
    sessionStorage.setItem("selectedTimeframe", selectedTimeframe);
    window.location.href = "/setup-member/new-tier";
  };

  return (
    <>
      <div className="w-100">
        {/* <SubHeader /> */}
        <div className="module-data-section mt-2 flex-grow-1">
          {/* Add breadcrumb navigation */}
          <p className="pointer mb-3">
            <span>Home</span> &gt; <span>Tiers</span> &gt;{" "}
            <span>Tier Setting</span>
          </p>

          {/* Tier setting */}
          <div className="mx-3 border-bottom">
            <h5 className="d-flex">
              <span className="title mt-3">TIER SETTING</span>
            </h5>
            <p className="mt-5 ms-4 fw-semibold">
              Point Accumulation Timeframe
            </p>
            <p className="ms-4 text-muted">
              Establish how members enter into higher tiers on points earning
              and time frame.
            </p>
          </div>
          <RoundRadioButtonCard
            onSelectionChange={setSelectedTimeframe}
            error={error}
          />
        </div>

        <div className="row mt-2 justify-content-center">
          <div className="col-md-2">
            <button
              className="purple-btn1 w-100"
              onClick={handleNext}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                minHeight: "40px",
              }}
            >
              Next
            </button>
          </div>

          <div className="col-md-2">
            <button
              className="purple-btn2 w-100"
              onClick={() => window.history.back()}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                minHeight: "40px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const RoundRadioButtonCard = ({ onSelectionChange, error }) => {
  const [selected, setSelected] = useState(null);

  // Define options with descriptions
  const options = [
    {
      value: "option1",
      label: "Lifetime",
      description: "Lifetime points will help members advance to higher tiers.",
    },
    {
      value: "option2",
      label: "Rolling Year",
      description:
        "Tier upgrades by earned points from current month to pretending month the following year.",
    },
  ];

  const handleClick = (value) => {
    setSelected(value);
    onSelectionChange(value === "option1" ? "lifetime" : "yearly");
  };

  return (
    <div className="container">
      {error && (
        <div className="alert alert-danger mx-4" role="alert">
          {error}
        </div>
      )}

      {options.map((option) => (
        <div className="card m-4 tier-setting-card" key={option.value}>
          <div className="card-body">
            <div className="d-flex flex-column align-items-start">
              <div
                onClick={() => handleClick(option.value)}
                className="d-flex align-items-center m-2"
              >
                <svg width="30" height="30">
                  {/* Outer circle (button) */}
                  <circle
                    cx="15"
                    cy="15"
                    r="10"
                    fill="none"
                    stroke="#e95420"
                    strokeWidth="2"
                  />
                  {/* Inner circle (selected) */}
                  {selected === option.value && (
                    <circle cx="15" cy="15" r="7" fill="#e95420" />
                  )}
                </svg>
                <h5 className="card-title mb-0 ps-3 fw-bold">{option.label}</h5>
              </div>
              {/* Always display the description for the selected option */}
              <p className="text-muted ms-3">{option.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierSetting;
