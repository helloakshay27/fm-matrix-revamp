import React from "react";
import { SurveyMapping } from "./types";

interface InactiveSurveyViewProps {
    surveyData: SurveyMapping;
    getFormattedLocation: () => string;
}

export const InactiveSurveyView: React.FC<InactiveSurveyViewProps> = ({
    surveyData,
    getFormattedLocation,
}) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header with Logo */}
            <div className="bg-gray-50 py-4 px-4 text-center">
                <div className="flex justify-center items-center">
                    <div className="w-20 h-20 sm:w-32 sm:h-28 flex items-center justify-center overflow-hidden">
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
                        ) : (
                            <img
                                src="/gophygital-logo-min.jpg"
                                alt="gophygital Logo"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto">
                <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full min-h-full">
                    <div className="text-center mb-2">
                        <img
                            src="/9019830 1.png"
                            alt="Survey Illustration"
                            className="w-60 h-60 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain mx-auto mb-2"
                        />
                    </div>

                    <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-black mb-4 text-center leading-tight">
                        {surveyData.survey_title}
                    </h1>

                    <div className="w-full space-y-4 text-center">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <div className="flex items-center justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-orange-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <h3 className="text-lg font-semibold text-orange-800 mb-2">
                                Not Active Survey
                            </h3>

                            <p className="text-sm text-orange-700 mb-4">
                                {surveyData.message ||
                                    "This survey is currently inactive and not accepting responses."}
                            </p>

                            <div className="bg-white rounded-lg p-4 border border-orange-100">
                                <p className="text-xs text-gray-600 font-medium mb-1">
                                    Location:
                                </p>
                                <p className="text-sm text-gray-800 break-words">
                                    {surveyData.location || getFormattedLocation()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 py-3 px-4 text-center">
                <div className="text-xs sm:text-sm text-gray-500">
                    Please contact the administrator if you believe this is an error
                </div>
            </div>
        </div>
    );
};
