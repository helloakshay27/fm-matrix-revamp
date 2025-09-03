import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface LocationState {
  rating: number;
  emoji: string;
  label: string;
  submitted?: boolean;
  skipForm?: boolean;
}

export const MobileSurveyThankYou: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mappingId } = useParams<{ mappingId: string }>();
  const state = location.state as LocationState;
  
  const [countdown, setCountdown] = useState(5);

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
        textColor: "text-green-800"
      };
    } else {
      return {
        title: "Thank You for Your Feedback!",
        // message: state?.submitted 
        //   ? "Your feedback has been submitted successfully. We'll work on improving your experience."
        //   : "We appreciate your honesty and will work to improve.",
        emoji: "🙏",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800"
      };
    }
  };

  const thankYouData = getThankYouMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      {/* Thank You Card */}
      <div className={`${thankYouData.bgColor} rounded-2xl p-8 text-center max-w-sm w-full shadow-lg`}>
         <div className="text-center mb-8">
            <img
              src="/8459746 1.png"
              alt="Survey Illustration"
              className="w-full max-w-xs md:max-w-md h-auto object-contain mx-auto"
              style={{ aspectRatio: '1/1.1' }}
            />
          </div>

        {/* Success Image */}
        {/* <div className="mb-6">
          <div className="w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
            <img
              src="/8459746 1.png"
              alt="Thank You"
              className="w-full h-full object-contain"
            />
          </div>
        </div> */}

        {/* Thank You Message */}
        <h2 className={`text-2xl font-bold ${thankYouData.textColor} mb-4`}>
          {thankYouData.title}
        </h2>
        
        {/* <p className={`${thankYouData.textColor} text-sm leading-relaxed mb-6`}>
          {thankYouData.message}
        </p> */}

        {/* Rating Display */}
        {/* {state && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-2xl mr-2">{state.emoji}</span>
              <span className="font-medium text-gray-700">{state.label || "☺️"}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Your Rating</div>
          </div>
        )} */}

        {/* Countdown */}
        {/* <div className="bg-white rounded-lg p-3">
          <div className="text-sm text-gray-600">
            Redirecting in <span className="font-bold text-teal-600">{countdown}</span> seconds
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className="bg-teal-500 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
        </div> */}
      </div>

      {/* Manual Navigation */}
      {/* <button
        onClick={() => navigate(`/mobile/survey/${mappingId}`, { replace: true })}
        className="mt-6 text-teal-600 hover:text-teal-700 text-sm font-medium underline"
      >
        Take Another Survey
      </button> */}

      {/* Survey Info */}
      {/* <div className="mt-8 text-center"> */}
        {/* <div className="text-xs text-gray-500">Survey ID: {mappingId}</div> */}
        {/* <div className="text-xs text-gray-400 mt-1">Powered by Lockated</div> */}
      {/* </div> */}
    </div>
  );
};
