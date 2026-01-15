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
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-black bg-opacity-50 px-4 py-2 rounded-lg z-10 shadow-lg"
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
            <h2 className="text-red-600 text-sm font-bold mb-2 tracking-wide">
              THE LOCKATED MANIFESTO —
            </h2>
            <h1
              className="text-gray-900 mb-12"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "40px",
                fontWeight: 600,
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              <span style={{ fontWeight: 400 }}>"We Are Here to Make an </span>
              <span style={{ fontWeight: 600 }}>IMPACT</span>
              <span style={{ fontWeight: 400 }}>."</span>
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
              className="text-gray-700 mb-4"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              Real estate shapes how people live, work, and dream — yet the
              journey is often complex, disconnected, and filled with
              challenges.
            </p>
            <p
              className="text-gray-700 mb-4"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontWeight: 400,
                fontSize: "24px",
                lineHeight: "100%",
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
                fontSize: "24px",
                lineHeight: "100%",
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
              {/* Left Side - Text Content */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Meet Our Team
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    At Lockated, we exist to make an IMPACT through our
                    <br />
                    PropTech solutions. Our core values guide how we
                    <br />
                    operate, make decisions, and interact with our
                    <br />
                    stakeholders in the real estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our
                    <br />
                    PropTech solutions. Our core values guide how we
                    <br />
                    operate, make decisions, and interact with our
                    <br />
                    stakeholders in the real estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our
                    <br />
                    PropTech solutions. Our core values guide how we
                    <br />
                    operate, make decisions, and interact with our
                    <br />
                    stakeholders in the real estate ecosystem.
                  </p>
                </div>
              </div>

              {/* Right Side - Scrolling Team Photos */}
              <div className="relative w-full min-w-0 pl-0 lg:pl-12 flex gap-6">
                {/* Static Active Card - Stable Frame */}
                {(() => {
                  const activeMember = [
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
                      name: "Chetan Bafna",
                      role: "CEO - Lockated",
                      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
                    },
                    {
                      name: "Sarah Johnson",
                      role: "CTO",
                      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
                    },
                  ][activeIndex || 0];

                  return activeMember ? (
                    <div className="flex-shrink-0">
                      <div className="bg-white border border-gray-400 rounded-lg p-3 shadow-none h-fit flex flex-col w-[220px]">
                        <img
                          src={activeMember.img}
                          alt={activeMember.name}
                          className="w-full aspect-square object-cover grayscale rounded-md"
                        />
                        <div className="pt-4 pb-1 text-left">
                          <h3 className="font-bold text-lg text-black leading-tight">
                            {activeMember.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {activeMember.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                <div className="flex-grow min-w-0 pt-3">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={12}
                    slidesPerView={1.5}
                    breakpoints={{
                      640: { slidesPerView: 2.5 },
                      1024: { slidesPerView: 2.8 },
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    pagination={{
                      el: ".custom-swiper-pagination-team",
                      clickable: true,
                    }}
                    navigation={{
                      nextEl: ".team-next-btn",
                      prevEl: ".team-prev-btn",
                    }}
                    className="w-full"
                  >
                    {[
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
                        name: "Chetan Bafna",
                        role: "CEO - Lockated",
                        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
                      },
                      {
                        name: "Sarah Johnson",
                        role: "CTO",
                        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
                      },
                    ].map((member, index) => (
                      <SwiperSlide
                        key={index}
                        className="!h-auto flex flex-col items-center !w-auto"
                      >
                        <div className="w-[180px] aspect-square overflow-hidden rounded-lg">
                          <img
                            src={member.img}
                            alt={member.name}
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Controls - Aligned Right under images */}
                  <div className="flex items-center justify-end gap-6 mt-8 w-full mr-auto pr-4">
                    <button className="team-prev-btn w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <div className="custom-swiper-pagination-team flex items-center gap-3"></div>
                    <button className="team-next-btn w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <style>{`
                  /* Hide the active slide in the swiper so it doesn't duplicate the static card */
                  .swiper-slide-active {
                    width: 0 !important;
                    margin-right: 0 !important;
                    opacity: 0;
                    overflow: hidden;
                  }
                  .custom-swiper-pagination-team .swiper-pagination-bullet {
                    background: transparent;
                    border: 1px solid #000;
                    opacity: 1;
                    width: 10px;
                    height: 10px;
                    margin: 0 !important;
                    transition: all 0.2s;
                  }
                  .custom-swiper-pagination-team .swiper-pagination-bullet-active {
                    background: #dc2626; /* red-600 */
                    border-color: #dc2626;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 - Long-term partnerships */}
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
                    At Lockated, we exist to make an IMPACT through our
                    <br />
                    PropTech solutions. Our core values guide how we
                    <br />
                    operate, make decisions, and interact with our
                    <br />
                    stakeholders in the real estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our
                    <br />
                    PropTech solutions. Our core values guide how we
                    <br />
                    operate, make decisions, and interact with our
                    <br />
                    stakeholders in the real estate ecosystem.
                  </p>
                  <p>
                    At Lockated, we exist to make an IMPACT through our
                    <br />
                    PropTech solutions. Our core values guide how we
                    <br />
                    operate, make decisions, and interact with our
                    <br />
                    stakeholders in the real estate ecosystem.
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
