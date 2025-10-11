import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import baseClient from "@/utils/withoutTokenBase";

interface LocationState {
  rating: number;
  emoji: string;
  label: string;
  submitted?: boolean;
  skipForm?: boolean;
}

interface SurveyData {
  id: number;
  survey_id: number;
  survey_title: string;
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string | null;
  snag_checklist: {
    id: number;
    name: string;
    questions_count: number;
    survey_attachment?: Array<{
      id: string;
      url: string;
    }>;
  };
}

export const MobileSurveyThankYou: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mappingId } = useParams<{ mappingId: string }>();
  const state = location.state as LocationState;

  const [countdown, setCountdown] = useState(5);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch survey data for dynamic background
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!mappingId) return;

      try {
        setIsLoading(true);
        const response = await baseClient.get(
          `survey_mappings/${mappingId}/survey.json`
        );
        const data = response.data;
        console.log("Survey data fetched for thank you page:", data);
        setSurveyData(data);
      } catch (error) {
        console.error("Failed to fetch survey data for thank you page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [mappingId]);

  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setCountdown((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(timer);
  //           // Redirect back to survey landing page
  //           navigate(`/mobile/survey/${mappingId}`, { replace: true });
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 5000);

  //     return () => clearInterval(timer);
  //   }, [navigate, mappingId]);

  const getThankYouMessage = () => {
    if (state?.rating >= 3) {
      return {
        title: "Thank You!",
        message: "We're glad you had a positive experience!",
        emoji: "🎉",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      };
    } else {
      return {
        title: "Thank You for Your Feedback!",
        // message: state?.submitted
        //   ? "Your feedback has been submitted successfully. We'll work on improving your experience."
        //   : "We appreciate your honesty and will work to improve.",
        emoji: "🙏",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      };
    }
  };

  const thankYouData = getThankYouMessage();

  // Show loading state while fetching survey data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        backgroundImage: `url(${
          surveyData?.snag_checklist?.survey_attachment?.url || "/9019830 1.png"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.85)",
      }}
    >
      {/* Logo */}
      <div className="absolute top-4  mt-10 right-4">
      <div className="flex justify-between">
        <div className="flex justify-end item-end">
          <div className="w-20 h-20 sm:w-32 sm:h-28 flex items-center justify-center overflow-hidden">
            {window.location.origin === "https://oig.gophygital.work" ? (
              <img
                src="/gophygital-logo-min.jpg"
                alt="Gophygital Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src="/Without bkg.svg"
                alt="OIG Logo"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Thank You Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[0.20rem] p-8 text-center max-w-sm w-full shadow-xl border-4 border-gray-100">
        {/* Stylized Thank You Text */}
        <div className="p-3">
          <h1
            className="text-lg sm:text-lg font-work-sans font-semibold text-black"
            // style={{ fontFamily: "cursive" }}
          >
          Thank you 
          </h1>
          {/* <h1
            className="text-5xl sm:text-6xl font-bold text-black -mt-4"
            style={{ fontFamily: "cursive" }}
          >
          </h1> */}
        </div>

        {/* Subtitle */}
        <p className="text-xs p-2 text-gray-700 font-medium">
          For helping us improve!
        </p>
      </div>
    </div>
  );
};
