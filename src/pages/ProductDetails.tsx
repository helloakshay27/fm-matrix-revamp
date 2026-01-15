import React from "react";
import {
  ArrowLeft,
  Monitor,
  FileText,
  Video,
  PlayCircle,
  Globe,
  Smartphone,
  Presentation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();

  const productData = {
    name: "Loyalty Management",
    description:
      "Loyalty serves from (Booking to Handover) journey of a customers in Real Estate and can be extended to Community/ society Management by integrating with Hi society. Can also drive referral points gratification and redemption by integrating Rule Engine & Redemption Market place.",

    // Left Column Data
    brief:
      "A customer Lifecycle Management Mobile App being used by Real Estate Developers to manage their Customers across the Entire cycle from Booking to Handover and can be extended until Community Management.",
    userStories: [
      {
        title: "1. CRM",
        items: [
          "a. S&M user registration",
          "b. Gives a buyer complete details of their purchase across units with the developers",
          "c. Receive real time Demand notes, construction updates, etc",
          "d. Smart NCF form acceptance before registration",
          "e. Registration scheduling",
          "f. TDS Tutorials",
          "g. Rule Engine gamification for early collection & handedover",
        ],
      },
      {
        title: "2. Loyalty",
        items: [
          "a. Referral Sales",
          "b. Rule Engine gamification for Referral, site visit & booking",
          "c. Offers for existing customers for new purchase",
          "d. Redemption Market Place",
        ],
      },
      {
        title: "3. Transitioning into Post Possession (Community Management)",
        items: [
          "a. Club, Visitor & Helpdesk",
          "b. Referral & Marketing for new launches",
        ],
      },
    ],
    industries: "1. Real Estate Developers",
    usps: [
      "1. Experience of working with 16+ large Real Estate players in the market",
      "2. Integrated platform across the journey, eliminates the risk of multiple systems",
      "3. Data security as data base is in Companies ownership",
      "4. Customized Look & feel as per own brand guidelines",
      "5. Product based approach makes the entry point lower and helps the companies avail the long term benefit of availing the new innovations at the subscription cost.",
    ],

    // Right Column Data
    includes: ["1. White Labeled Mobile App", "2. CMS"],
    upSelling: [
      "1. Loyalty Rule Engine",
      "2. Redemption Market Place",
      "3. Appointments (Handover Scheduling)",
      "4. Hi Society (Community Management)",
    ],
    integrations: [
      "1. SFDC (CRM)",
      "2. SAP (ERP)",
      "3. Internal Sporting Modules",
      "   a. Loyalty Rule Engine",
      "   c. Redemption Market Place",
      "4. Website",
    ],
    decisionMakers: ["1. CMO", "2. Sales", "3. CRM/CS", "4. IT"],
    keyPoints: [
      "1. Customization of Look & Feel",
      "2. Data security",
      "3. Partner experience",
      "4. Referral Journey & Payout",
    ],
    roi: [
      "1. 4 Sales/ year is all you need for the platform to be free",
      "2. Reduce CP cost by 50%",
      "3. Reduce support cost by 20%",
      "4. Make your customers your brand advocates",
    ],
  };

  const teamMembers = [
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/men/86.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Kshitij Rasal",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/men/90.jpg",
    },
  ];

  const assets = [
    {
      type: "Link",
      title: "Detailed Feature List (Link)",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "UI/UX (Link)",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "One Pager (Link)",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Presentation (Link)",
      icon: <Presentation className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Demo Video Link (Link)",
      icon: <PlayCircle className="w-5 h-5" />,
    },
    {
      type: "Link",
      title: "Interaction Demo Link (Link)",
      icon: <Monitor className="w-5 h-5" />,
    },
  ];

  const credentials = [
    {
      title: "Live Product Web Login Credentials",
      url: "www.example.com/login",
      id: "admin@example.com",
      pass: "admin123",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      title: "Live Product Web Login Credentials",
      url: "www.example.com/login",
      id: "admin@example.com",
      pass: "admin123",
      icon: <Smartphone className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="relative mb-10">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="text-center w-full max-w-5xl mx-auto pt-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {productData.name}
          </h1>
          <p className="text-xs text-gray-600 leading-relaxed max-w-4xl mx-auto text-center">
            {productData.description}
          </p>
        </div>
      </div>

      {/* Product Overview Section */}
      <section className="mb-12 border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-[#F8F6F1] px-6 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#D4CFBC]"></div>
          <h2 className="text-sm font-bold text-gray-800">Product Overview</h2>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Product Brief
              </h3>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                {productData.brief}
              </p>
            </div>

            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Product Description/ User Stories
              </h3>
              <div className="text-[11px] text-gray-700 leading-relaxed space-y-3">
                {productData.userStories.map((section, idx) => (
                  <div key={idx}>
                    <p className="font-semibold mb-1">{section.title}</p>
                    <ul className="pl-2 space-y-0.5">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Applicable TG Industries
              </h3>
              <p className="text-[11px] text-gray-700 leading-relaxed">
                {productData.industries}
              </p>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                USP/Differentiators (1-5)
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.usps.map((usp, i) => (
                  <li key={i}>{usp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Inclusions
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.includes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Up Selling
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.upSelling.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Integrations
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.integrations.map((item, i) => (
                  <li key={i} className="whitespace-pre-wrap">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Decision Makers
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.decisionMakers.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                Key points for Decision Making/ Purchase Decision
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.keyPoints.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <h3 className="text-[11px] font-semibold text-gray-400 w-32 shrink-0">
                ROI
              </h3>
              <ul className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                {productData.roi.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The People Section */}
      <section className="mb-12 border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-[#F8F6F1] px-6 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#D4CFBC]"></div>
          <h2 className="text-sm font-bold text-gray-800">
            Meet The People Behind The Product
          </h2>
        </div>
        <div className="p-8">
          <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 relative rounded-xl overflow-hidden group"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white text-sm font-bold">
                    {member.name}
                  </h3>
                  <p className="text-gray-300 text-[10px]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Assets Section */}
      <section className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-[#F8F6F1] px-6 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#D4CFBC]"></div>
          <h2 className="text-sm font-bold text-gray-800">Product Assets</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-md p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                  {asset.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 underline cursor-pointer">
                  {asset.title}
                </span>
              </div>
            ))}

            {credentials.map((cred, index) => (
              <div
                key={`cred-${index}`}
                className="border border-gray-100 rounded-md p-4 flex gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600 h-fit">
                  {cred.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">
                    {cred.title}
                  </h4>
                  <div className="text-[10px] text-gray-500 space-y-0.5">
                    <p>URL : {cred.url}</p>
                    <p>
                      ID : {cred.id} | Password : {cred.pass}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
