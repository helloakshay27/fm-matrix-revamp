import React, { useState } from "react";

export default function RoundedRadioButtonCard({ onChange }) {
  const [selected, setSelected] = useState(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [circleHovered, setCircleHovered] = React.useState(false);

  const options = [
    {
      value: "lifetime",
      label: "Lifetime",
      description: "Lifetime points will help members advance to higher tiers.",
    },
    {
      value: "yearly",
      label: "Rolling Year",
      description:
        "Tier upgrades by earned points from current month to pretending month the following year.",
    },
  ];

  const handleClick = (value) => {
    setSelected(value);
    onChange(value); // Call onChange with the selected value
    console.log("selected :-----", value); // Log the selected value
  };

  return (
    <div style={{ padding: "0 10px" }}>
      {options.map((option) => (
        <div
          className="card m-3 tier-setting-card"
          style={{
            backgroundColor: isHovered ? "#f8f9fa" : "#ffffff", // Neutral hover effect
            border: "1px solid #dee2e6",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 4px rgba(0,0,0,0.1)",
          }}
          key={option.value}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="card-body">
            <div className="d-flex flex-column align-items-start">
              <div
                onClick={() => handleClick(option.value)}
                className="d-flex align-items-center m-2"
                style={{
                  cursor: "pointer",
                }}
                onMouseEnter={() => setCircleHovered(true)}
                onMouseLeave={() => setCircleHovered(false)}
              >
                <svg width="30" height="30">
                  <circle
                    cx="15"
                    cy="15"
                    r="10"
                    fill="none"
                    stroke={selected === option.value ? "var(--red, #de7008)" : (circleHovered ? "var(--lightred, #de7008)" : "#dee2e6")}
                    strokeWidth="2"
                    style={{
                      transition: "stroke 0.3s ease",
                    }}
                  />
                  {selected === option.value && (
                    <circle cx="15" cy="15" r="7" fill="var(--red, #de7008)" />
                  )}
                </svg>
                <h5 className="card-title mb-0 ps-3 fw-bold" style={{ color: selected === option.value ? "var(--red, #de7008)" : "#495057" }}>{option.label}</h5>
              </div>
              <p className="text-muted ms-3" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                {option.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
