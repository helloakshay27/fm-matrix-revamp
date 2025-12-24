import React from 'react';

interface SurveyHeaderProps {
    showBackButton: boolean;
    onBack: () => void;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({ showBackButton, onBack }) => {
    return (
        <div className="bg-transparent py-4 px-4 mt-2 relative z-10">
            <div className="flex justify-between">
                <div className="flex justify-start mt-2 items-start">
                    {showBackButton && (
                        <div className="w-full flex justify-start mb-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center text-black/100 hover:text-black/100 text-lg font-medium transition-colors"
                            >
                                <svg
                                    className="w-4 h-4 mr-1 text-black/80"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex justify-end item-end">
                    <div className="w-20 h-20 sm:w-32 sm:h-28 flex items-center justify-center overflow-hidden">
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
            </div>
        </div>
    );
};
