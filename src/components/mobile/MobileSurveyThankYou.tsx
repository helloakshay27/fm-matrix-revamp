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
    survey_attachment?: {
      id: number;
      url: string;
    };
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-gray-50 overflow-hidden">
      {/* Background Image Layer with Filter */}
      {surveyData?.snag_checklist?.survey_attachment?.url && (
        <div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url('${surveyData?.snag_checklist?.survey_attachment?.url}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.85)",
          }}
        />
      )}
      <div className="absolute top-8 right-6 z-10">
        <div className="w-32 h-32 sm:w-48 sm:h-32 flex items-center justify-center overflow-hidden   p-2">
          {window.location.origin === "https://oig.gophygital.work" ? (
            <img
              src="/Without bkg.svg"
              alt="OIG Logo"
              className="w-full h-full object-contain"
            />
          ) : window.location.origin === "https://web.gophygital.work" ? (
            <img
              src="/PSIPL-logo (1).png"
              alt="PSIPL Logo"
              className="w-full h-full object-contain"
            />
          ) : window.location.origin === "https://fm-matrix.lockated.com" ? (
              <img
              src="/gophygital-logo-min.jpg"
              alt="gophygital Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src="/gophygital-logo-min.jpg"
              alt="gophygital Logo"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Thank You Card */}
      <div className="bg-white backdrop-blur-sm rounded-[0.20rem] p-8 text-center max-w-sm w-full shadow-xl relative z-10">
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
          {state?.rating && state.rating < 4
            ? "Thank you for taking the time to share your feedback."
            : "Helping us to improve!"}
        </p>
      </div>
    </div>
  );
};
