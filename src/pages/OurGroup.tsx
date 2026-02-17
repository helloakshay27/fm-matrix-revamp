import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

const OurGroup: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div
        className="relative w-full h-auto"
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
        }}
      >
        {/* Back Button Overlay */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-8 left-8 flex items-center gap-2 text-black px-4 py-2 rounded-lg z-10 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header Image */}
        <img
          src="/our-group-header.png"
          alt="Our Group Team"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Sections */}
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section 1: The Lockated Manifesto */}
        <div className="flex flex-col lg:flex-row px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16 gap-8 lg:gap-16 xl:gap-24">
          {/* Left Column - Stats */}
          <div className="w-full lg:w-[500px] flex-shrink-0">
            <h1
              className="text-red-600 mb-12"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "32px",
                lineHeight: "120%",
                letterSpacing: "0%",
              }}
            >
              <span style={{ fontWeight: 400 }}>THE LOCKATED MANIFESTO — </span>
              <span style={{ fontWeight: 600 }}>
                "We Are Here to Make an IMPACT."
              </span>
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Stat 1 */}
              <div>
                <div className="text-5xl font-bold text-red-600 mb-2">2015</div>
                <div className="text-gray-700 font-medium">Founded</div>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="text-5xl font-bold text-red-600 mb-2">50+</div>
                <div className="text-gray-700 font-medium">Professionals</div>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="text-5xl font-bold text-red-600 mb-2">22+</div>
                <div className="text-gray-700 font-medium">Products</div>
              </div>

              {/* Stat 4 */}
              <div>
                <div className="text-5xl font-bold text-red-600 mb-2">
                  PAN India
                </div>
                <div className="text-gray-700 font-medium">Support Network</div>
              </div>
            </div>
          </div>

          {/* Right Column - Mission Statement */}
          <div className="w-full lg:w-auto lg:flex-1">
            <p
              className="text-gray-700 mb-6"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0%",
              }}
            >
              Real estate shapes how people live, work, and dream — yet the
              journey is often complex, disconnected, and filled with
              challenges.
            </p>
            <p
              className="text-gray-700 mb-6"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0%",
              }}
            >
              At Lockated, we believe technology has the unique power to
              simplify, connect, and transform every step of the real estate
              experience. From building and buying to managing and living, we
              create technology that brings clarity where there is confusion,
              connection where there are gaps, and opportunity where others see
              barriers.
            </p>
            <p
              className="text-gray-700"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0%",
              }}
            >
              But our purpose goes deeper than products. We are builders of
              solutions — and builders of people. We believe great ideas can
              come from anywhere. That every challenge carries the seed of a new
              innovation. That technology isn't just a tool — it's a
              collaborative platform to create the future of PropTech.
            </p>
          </div>
        </div>

        {/* Section 2 - Our Core Values: IMPACT */}
        <div className="bg-[#f5f5f0] w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16">
          {/* Section Title */}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
            Our Core Values: IMPACT
          </h2>

          {/* Section Description */}
          <p className="text-center text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            At Lockated, we exist to make an IMPACT through our PropTech
            solutions. Our core values guide how we operate, make decisions, and
            interact with our stakeholders in the real estate ecosystem.
          </p>

          {/* Values Grid - 6 Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {/* Value 1: Innovation */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-red-600 font-bold text-lg mb-3">
                Innovation
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>

            {/* Value 2: Mindfulness */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-red-600 font-bold text-lg mb-3">
                Mindfulness
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>

            {/* Value 3: Proactivity */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-red-600 font-bold text-lg mb-3">
                Proactivity
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>

            {/* Value 4: Accountability */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-red-600 font-bold text-lg mb-3">
                Accountability
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>

            {/* Value 5: Collaboration */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-red-600 font-bold text-lg mb-3">
                Collaboration
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>

            {/* Value 6: Trust */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-red-600 font-bold text-lg mb-3">Trust</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 - Meet Our Team */}
        <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-16">
              {/* Left Side - Text Content */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Meet Our Team
                </h2>
                <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
                  <p>
                    At Lockated, we exist to make an IMPACT through our PropTech
                    solutions. Our core values guide how we operate, make
                    decisions, and interact with our stakeholders in the real
                    estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our PropTech
                    solutions. Our core values guide how we operate, make
                    decisions, and interact with our stakeholders in the real
                    estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our PropTech
                    solutions. Our core values guide how we operate, make
                    decisions, and interact with our stakeholders in the real
                    estate ecosystem.
                  </p>
                </div>
              </div>

              {/* Right Side - Team Photos Grid */}
              <div className="relative w-full">
                {(() => {
                  const teamMembers = [
                    {
                      name: "Chetan Bafna",
                      role: "CEO - Lockated",
                      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
                    },
                    {
                      name: "Sarah Johnson",
                      role: "CTO",
                      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
                    },
                    {
                      name: "Michael Chen",
                      role: "Head of Product",
                      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                    },
                    {
                      name: "Emily Davis",
                      role: "Design Lead",
                      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
                    },
                    {
                      name: "David Wilson",
                      role: "VP Marketing",
                      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
                    },
                    {
                      name: "Alex Turner",
                      role: "CFO",
                      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
                    },
                  ];

                  const currentIndex = activeIndex || 0;
                  const visibleMembers = [
                    teamMembers[currentIndex % teamMembers.length],
                    teamMembers[(currentIndex + 1) % teamMembers.length],
                    teamMembers[(currentIndex + 2) % teamMembers.length],
                  ];

                  return (
                    <>
                      <div className="flex items-start gap-4">
                        {/* First Box - Framed Card with Name */}
                        <div className="flex-shrink-0">
                          <div className="bg-white border-2 border-gray-800 rounded-lg p-4 shadow-sm h-fit flex flex-col w-[200px]">
                            <img
                              src={visibleMembers[0].img}
                              alt={visibleMembers[0].name}
                              className="w-full aspect-square object-cover grayscale rounded-md mb-4"
                            />
                            <div className="text-left">
                              <h3 className="font-bold text-base text-black leading-tight">
                                {visibleMembers[0].name}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">
                                {visibleMembers[0].role}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Second and Third Boxes - Regular Images */}
                        <div className="flex gap-4">
                          <div className="w-[200px] aspect-square overflow-hidden rounded-lg flex-shrink-0">
                            <img
                              src={visibleMembers[1].img}
                              alt={visibleMembers[1].name}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                          <div className="w-[200px] aspect-square overflow-hidden rounded-lg flex-shrink-0">
                            <img
                              src={visibleMembers[2].img}
                              alt={visibleMembers[2].name}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Navigation Controls - Centered below images */}
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                          onClick={() =>
                            setActiveIndex(
                              (currentIndex - 1 + teamMembers.length) %
                                teamMembers.length
                            )
                          }
                          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {/* Pagination Dots */}
                        <div className="flex items-center gap-2">
                          {teamMembers.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                  ? "bg-red-600 border-red-600"
                                  : "bg-transparent border border-black"
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setActiveIndex(
                              (currentIndex + 1) % teamMembers.length
                            )
                          }
                          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 - Our Business Verticals */}
        <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white border-t border-gray-100">
          <div className="max-w-[1920px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Business Verticals
            </h2>
            <p className="text-gray-700 max-w-6xl mb-12 leading-relaxed text-sm sm:text-base">
              Lockated is building an integrated PropTech ecosystem—bringing
              together software, services, and smart technologies to connect
              buyers, occupants, developers, and service providers across the
              real estate lifecycle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[#E8E1D5]">
              {/* Column 1: Software */}
              <div className="flex flex-col border-r border-[#E8E1D5] last:border-r-0">
                <div className="bg-[#F8F3EA] p-6 min-h-[100px] flex items-center border-b border-[#E8E1D5]">
                  <h3 className="font-bold text-base text-black">
                    Software (SaaS/ License)
                  </h3>
                </div>
                <div className="bg-[#FEFAF6] p-6 flex-grow border-b md:border-b-0 border-[#E8E1D5]">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        1. Residential
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Loyalty
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Hi Society
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Snag 360
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          QC
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          RHB
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Lead Infinity
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Live In Site
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Brokers
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        2. Commercial
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          FM Matrix
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          GoPhygital.work
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        3. Others
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Project & Task
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Vendor Management
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Procurement/ Contracts
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Loyalty Engine
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          MSafe
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Incident Management
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        4. ERP
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Procurement
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Contracts & RFQ
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Vendor Management
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Product */}
              <div className="flex flex-col border-r border-[#E8E1D5] last:border-r-0">
                <div className="bg-[#F8F3EA] p-6 min-h-[100px] flex items-center border-b border-[#E8E1D5]">
                  <h3 className="font-bold text-base text-black">
                    Product (Material)
                  </h3>
                </div>
                <div className="bg-[#FEFAF6] p-6 flex-grow border-b md:border-b-0 border-[#E8E1D5]">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        1. • L’Decor
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Interior Material
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Home Automation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Service */}
              <div className="flex flex-col border-r border-[#E8E1D5] last:border-r-0">
                <div className="bg-[#F8F3EA] p-6 min-h-[100px] flex items-center border-b border-[#E8E1D5]">
                  <h3 className="font-bold text-base text-black">Service</h3>
                </div>
                <div className="bg-[#FEFAF6] p-6 flex-grow border-b lg:border-b-0 border-[#E8E1D5]">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        1. Brokerage
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Referral CP
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          New Sales
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Rental (Commercial & Residential)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        2. Community Management
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Events/ Engagement
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        3. Alliances
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Travel
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Loyalty Redemption
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          E-Commerce (Product & Service)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        4. Snagging as a Service
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 4: Tech */}
              <div className="flex flex-col border-r border-[#E8E1D5] last:border-r-0">
                <div className="bg-[#F8F3EA] p-6 min-h-[100px] flex items-center border-b border-[#E8E1D5]">
                  <h3 className="font-bold text-base text-black">
                    Tech (Dev & Implementation)
                  </h3>
                </div>
                <div className="bg-[#FEFAF6] p-6 flex-grow">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        1. Tech
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Development as a service
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          AMC
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          On-site Resource
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-black">
                        2. Ops
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Implementation & Go live
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Ops Support
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Ops On-Site Resource (KAM)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section - Product Wise Details */}
        <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white border-t border-gray-100">
          <div className="max-w-[1920px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Wise Details
            </h2>
            <p className="text-gray-700 max-w-6xl mb-12 leading-relaxed text-sm sm:text-base">
              Lockated is building an integrated PropTech ecosystem—bringing
              together software, services, and smart technologies to connect
              buyers, occupants, developers, and service providers across the
              real estate lifecycle.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[#E8E1D5]">
                <thead>
                  <tr className="bg-[#F8F3EA]">
                    <th className="p-4 text-left border-r border-[#E8E1D5] font-bold text-black min-w-[250px]">
                      Product Name
                    </th>
                    <th className="p-4 text-left border-r border-[#E8E1D5] font-bold text-black min-w-[150px]">
                      SPOC
                    </th>
                    <th className="p-4 text-left border-r border-[#E8E1D5] font-bold text-black min-w-[200px]">
                      Industry & Business
                      <br />
                      Case Applicability
                    </th>
                    <th className="p-4 text-left border-r border-[#E8E1D5] font-bold text-black min-w-[100px]">
                      Value
                    </th>
                    <th className="p-4 text-left font-bold text-black min-w-[100px]">
                      View Details
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-[#FEFAF6]">
                  {[
                    {
                      name: "1. Loyalty",
                      desc: "(Post Sales to Post Possession).",
                      spoc: "Kshitij",
                    },
                    {
                      name: "2. Hi Society",
                      desc: "(Society Community Management)",
                      spoc: "Deepak",
                    },
                    { name: "3. Snag 360", desc: "", spoc: "Sagar" },
                    { name: "4. QC", desc: "", spoc: "Sagar" },
                    { name: "4. RHB", desc: "", spoc: "Sagar" },
                    {
                      name: "5. Lead Infinity",
                      desc: "",
                      spoc: "Hold",
                      isRed: true,
                    },
                    {
                      name: "6. Live In Site",
                      desc: "",
                      spoc: "Hold",
                      isRed: true,
                    },
                    {
                      name: "6. Broker Management",
                      desc: "(CP)",
                      spoc: "Kshitij",
                    },
                    { name: "6. FM Matrix", desc: "", spoc: "Abdul Ghaffar" },
                    {
                      name: "6. Gophygital.work",
                      desc: "(Corporate)",
                      spoc: "Aquil",
                    },
                    {
                      name: "6. Gophygital.work",
                      desc: "(Tenants Buildings)",
                      spoc: "Neha",
                    },
                    {
                      name: "6. Project & Task",
                      desc: "",
                      spoc: "Sadanand & Yash",
                    },
                    {
                      name: "6. Vendor Management",
                      desc: "",
                      spoc: "Sadanand & Yash",
                    },
                    {
                      name: "6. Procurement/Contracts",
                      desc: "",
                      spoc: "Dinesh Shindhe",
                    },
                    {
                      name: "6. Loyalty Engine",
                      desc: "",
                      spoc: "Vinayak/Kshitij",
                    },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-[#E8E1D5]">
                      <td className="p-4 border-r border-[#E8E1D5] text-black">
                        <span className="font-bold">{row.name}</span>{" "}
                        {row.desc && <span className="italic">{row.desc}</span>}
                      </td>
                      <td
                        className={`p-4 border-r border-[#E8E1D5] font-bold text-black ${
                          row.isRed ? "text-red-500" : ""
                        }`}
                      >
                        • {row.spoc}
                      </td>
                      <td className="p-4 border-r border-[#E8E1D5]"></td>
                      <td className="p-4 border-r border-[#E8E1D5]"></td>
                      <td className="p-4"></td>
                    </tr>
                  ))}
                  {/* Fill remaining height if necessary */}
                  {[...Array(5)].map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="border-b border-[#E8E1D5]"
                    >
                      <td className="p-4 border-r border-[#E8E1D5]">&nbsp;</td>
                      <td className="p-4 border-r border-[#E8E1D5]">&nbsp;</td>
                      <td className="p-4 border-r border-[#E8E1D5]">&nbsp;</td>
                      <td className="p-4 border-r border-[#E8E1D5]">&nbsp;</td>
                      <td className="p-4">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 6 - Long-term partnerships */}
        <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
              {/* Left Side - Text Content */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Long - term partnerships with leading brands
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm lg:text-base">
                  <p>
                    At Lockated, we exist to make an IMPACT through our PropTech
                    solutions. Our core values guide how we operate, make
                    decisions, and interact with our stakeholders in the real
                    estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our PropTech
                    solutions. Our core values guide how we operate, make
                    decisions, and interact with our stakeholders in the real
                    estate ecosystem.
                  </p>
                </div>
              </div>

              {/* Right Side - Partner Logos Switching Carousel */}
              <div className="w-full bg-white overflow-hidden py-4">
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={true}
                  speed={5000}
                  autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                  }}
                  className="w-full"
                >
                  {/* Slide 1: Original Logo Grid */}
                  <SwiperSlide className="!h-auto flex items-center justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 items-center w-fit mx-auto">
                      {/* Logo 1 - Kalpa Taru */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1">
                            <svg
                              className="w-10 h-10 text-cyan-400"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-gray-900 font-serif font-bold text-xl leading-none">
                              KALPA-TARU
                            </div>
                            <div className="text-[10px] text-gray-500 tracking-wider">
                              LIFESTYLE LIMITED
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logo 2 - Sunteck */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-baseline">
                          <span className="text-gray-900 font-serif font-bold text-4xl tracking-tight">
                            Sunteck
                          </span>
                          <span className="text-orange-500 text-4xl ml-1 font-light italic">
                            )
                          </span>
                        </div>
                      </div>

                      {/* Logo 3 - OiG */}
                      <div className="flex items-center justify-center">
                        <div className="text-center w-full">
                          <div
                            className="text-blue-700 font-bold text-6xl tracking-tighter leading-none"
                            style={{ fontFamily: "sans-serif" }}
                          >
                            OiG
                          </div>
                          <div className="text-[8px] text-blue-400 mt-1 uppercase tracking-widest text-right w-full border-t border-blue-200 pt-1">
                            OMAN INTERNATIONAL GROUP SAOC
                          </div>
                        </div>
                      </div>

                      {/* Logo 4 - OiG (Repeated) */}
                      <div className="flex items-center justify-center">
                        <div className="text-center w-full">
                          <div
                            className="text-blue-700 font-bold text-6xl tracking-tighter leading-none"
                            style={{ fontFamily: "sans-serif" }}
                          >
                            OiG
                          </div>
                          <div className="text-[8px] text-blue-400 mt-1 uppercase tracking-widest text-right w-full border-t border-blue-200 pt-1">
                            OMAN INTERNATIONAL GROUP SAOC
                          </div>
                        </div>
                      </div>

                      {/* Logo 5 - Kalpa Taru (Repeated) */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-cyan-400 p-1.5 rounded-sm">
                            <svg
                              className="w-8 h-8 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2L2 22h20L12 2zm0 3l7 14H5l7-14z" />
                            </svg>
                          </div>
                          <div className="text-left border-2 border-gray-900 px-2 py-1">
                            <div className="text-gray-900 font-serif font-bold text-lg leading-none tracking-widest">
                              KALPA-TARU
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logo 6 - Sunteck (Repeated) */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-baseline">
                          <span className="text-gray-900 font-serif font-bold text-4xl tracking-tight">
                            Sunteck
                          </span>
                          <span className="text-orange-500 text-4xl ml-1 font-light italic">
                            )
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Slide 2: Uploaded Image */}
                  <SwiperSlide className="!h-auto flex items-center justify-center">
                    <img
                      src="/partner-logos.png"
                      alt="Partner Logos"
                      className="h-[200px] w-auto object-contain max-w-none"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurGroup;
