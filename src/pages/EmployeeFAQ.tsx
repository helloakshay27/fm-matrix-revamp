import React, { useState } from "react";
import { ArrowLeft, Search, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  "General Information",
  "HR & People Policies",
  "IT & Systems",
  "Documents & Knowledge",
  "Performance & Recognition",
  "Products & Projects",
  "Communication & Engagement",
  "Requests & Support",
  "Onboarding & Access",
  "Exit & Transitions",
];

const faqs = [
  {
    id: "1",
    question: "What does the company do?",
    answer:
      "A brief overview of the company's purpose, products, and services. A brief overview of the company's purpose, products, and services.",
  },
  {
    id: "2",
    question: "What is our company's vision and long-term goal?",
    answer:
      "Our vision is to be the global leader in our industry, driving innovation and sustainability.",
  },
  {
    id: "3",
    question: "What is our company's vision and long-term goal?",
    answer: "Detailed explanation of long-term strategic goals...",
  },
  {
    id: "4",
    question: "What is our company's vision and long-term goal?",
    answer: "Another duplicate for UI demonstration...",
  },
  {
    id: "5",
    question: "What is our company's vision and long-term goal?",
    answer: "Another duplicate for UI demonstration...",
  },
  {
    id: "6",
    question: "What is our company's vision and long-term goal?",
    answer: "Another duplicate for UI demonstration...",
  },
  {
    id: "7",
    question: "What is our company's vision and long-term goal?",
    answer: "Another duplicate for UI demonstration...",
  },
];

const EmployeeFAQ: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("General Information");
  const [openQuestion, setOpenQuestion] = useState<string | null>("1");

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-8 lg:p-12 font-sans text-gray-800">
      {/* Header Navigation */}
      <div className="max-w-[1400px] mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg">Back</span>
        </button>
      </div>

      {/* Title Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Employee FAQ's</h1>
        <p className="text-gray-700 text-sm leading-relaxed mb-8 px-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search with your question"
            className="w-full bg-[#EAE6DB] bg-opacity-50 text-gray-800 placeholder-gray-400 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-300 border-none shadow-sm"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Categories */}
        <div className="lg:col-span-3">
          <h2 className="text-red-500 font-semibold mb-6 text-lg">
            Categories
          </h2>
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-left py-3 px-4 border-l-[3px] transition-all duration-200 ${
                  activeCategory === category
                    ? "border-[#C72030] font-bold text-gray-900 bg-white bg-opacity-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {faqs.map((faq) => {
            const isOpen = openQuestion === faq.id;
            return (
              <div
                key={faq.id}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen
                    ? "border border-[#F5B1B1] bg-white"
                    : "bg-[#F3F1EB] hover:bg-[#eae8e2]"
                }`}
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className={`text-lg font-medium pr-8 ${isOpen ? "text-black" : "text-gray-800"}`}
                  >
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 flex-shrink-0 text-gray-700" />
                  ) : (
                    <Plus className="w-5 h-5 flex-shrink-0 text-gray-500" />
                  )}
                </button>

                {/* Content - Using max-height transition styling concept primarily, but simple conditional rendering here for cleaner code given standard react structure */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-transparent animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeFAQ;
