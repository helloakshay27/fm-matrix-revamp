import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessPlan = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(2022);

  const years = [2015, 2018, 2022, 2025, 2027, 2028, 2029, 2030, 2031];

  // Map years to horizontal positions (approximate pixels)
  // Total width roughly 2000px
  const yearPositions: Record<number, number> = {
    2015: 100,
    2018: 400,
    2022: 750,
    2025: 1000,
    2027: 1250,
    2028: 1400,
    2029: 1600,
    2030: 1800,
    2031: 2000,
  };

  const handleYearClick = (year: number) => {
    setActiveYear(year);
    const position = yearPositions[year];
    if (scrollContainerRef.current && position !== undefined) {
      // Scroll to center the position
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollLeft = position - containerWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Optional: Update active year on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const center = container.scrollLeft + container.clientWidth / 2;
      // Find closest year
      let closestYear = years[0];
      let minDiff = Infinity;

      years.forEach((year) => {
        const pos = yearPositions[year];
        const diff = Math.abs(pos - center);
        if (diff < minDiff) {
          minDiff = diff;
          closestYear = year;
        }
      });
      // specific logic could be added here if we want auto-highlight on scroll
      // for now, let's keep click-to-activate as primary interaction to avoid jumps
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 md:px-8 border-b border-gray-100 flex-shrink-0 z-10 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-bold text-gray-900">
            Business Plan & Target 2030
          </h1>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Main Graph Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative bg-white no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="relative h-full w-[2200px]">
          {/* Info Cards */}
          {/* Card 2015 */}
          <div className="absolute top-[180px] left-[50px] w-[280px] bg-white p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 z-10 transition-transform hover:scale-105">
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 shadow-[2px_2px_2px_rgba(0,0,0,0.03)]"></div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          {/* Connector 2015 */}
          <div className="absolute top-[280px] left-[100px] w-[1px] h-[160px] bg-[#C1272D]"></div>
          <div className="absolute top-[280px] left-[96px] w-2.5 h-2.5 bg-[#C1272D] rounded-full"></div>

          {/* Card 2018 */}
          <div className="absolute top-[180px] left-[350px] w-[280px] bg-white p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 z-10 transition-transform hover:scale-105">
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 shadow-[2px_2px_2px_rgba(0,0,0,0.03)]"></div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          {/* Connector 2018 */}
          <div className="absolute top-[270px] left-[400px] w-[1px] h-[190px] bg-[#C1272D]"></div>
          <div className="absolute top-[270px] left-[396px] w-2.5 h-2.5 bg-[#C1272D] rounded-full"></div>

          {/* Card 2030 */}
          <div className="absolute top-[250px] left-[1650px] w-[280px] bg-white p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 z-10 transition-transform hover:scale-105">
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 shadow-[2px_2px_2px_rgba(0,0,0,0.03)]"></div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
              dolor sit amet.
            </p>
          </div>
          {/* Connector 2030 */}
          <div className="absolute top-[350px] left-[1700px] w-[1px] h-[180px] bg-[#C1272D]"></div>
          <div className="absolute top-[350px] left-[1696px] w-2.5 h-2.5 bg-[#C1272D] rounded-full"></div>

          {/* SVG Graph */}
          <svg
            className="absolute bottom-[0px] left-0 w-full h-[350px]"
            viewBox="0 0 2200 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* 
              path breakdown approx:
              Start (0, 200)
              2015 (100, 180) -> slightly up
              2018 (400, 50) -> Peak
              2022 (750, 250) -> Deep Trough
              2025 (1000, 150) -> Small Peak
              2027 (1250, 200) -> Dip
              2028 (1400, 150) -> up
              2029 (1600, 100) -> Peak
              2030 (1800, 150) -> Dip
              2031 (2000, 50) -> up high
             */}
            <path
              d="M0 250 
                 C 100 200, 300 100, 400 150 
                 C 550 220, 650 350, 750 300 
                 C 850 250, 950 200, 1000 220 
                 C 1100 250, 1200 300, 1250 280
                 C 1350 250, 1500 150, 1600 200
                 C 1700 250, 1750 280, 1800 250
                 C 1900 150, 2000 50, 2200 150
                 V 500 H 0 Z"
              fill="#C1272D"
            />
          </svg>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="h-20 bg-white border-t border-gray-100 flex-shrink-0 flex items-center justify-center gap-8 md:gap-16 px-4 overflow-x-auto no-scrollbar z-20">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className={`relative flex flex-col items-center gap-1 min-w-[40px] transition-colors duration-300 ${
              activeYear === year
                ? "text-gray-900 font-bold text-xl"
                : "text-gray-400 font-medium text-lg hover:text-gray-600"
            }`}
          >
            <span>{year}</span>
            {activeYear === year && (
              <div className="absolute -bottom-4 w-full h-[3px] bg-[#C1272D]"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusinessPlan;
