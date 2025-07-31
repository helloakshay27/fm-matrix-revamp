import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { surveyApi } from "@/services/surveyApi";
import baseClient from "@/utils/withoutTokenBase";

interface SurveyQuestion {
  id: number;
  qtype: string;
  descr: string;
  checklist_id: number;
  img_mandatory: boolean;
  quest_mandatory: boolean;
  snag_quest_options: SurveyOption[];
}

interface SurveyOption {
  id: number;
  qname: string;
  option_type: string;
}

interface SurveyMapping {
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
    snag_questions: SurveyQuestion[];
  };
}

export const MobileSurveyLanding: React.FC = () => {
  const navigate = useNavigate();
  const { mappingId } = useParams<{ mappingId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<SurveyMapping | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion | null>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!mappingId) return;
      
      try {
        setIsLoading(true);
        const response = await baseClient.get(`survey_mappings/${mappingId}/survey.json`);
        const data = response.data;
        setSurveyData(data);
        
        // Set the first smiley question as current question
        const smileyQuestion = data.snag_checklist.snag_questions.find(
          (q: SurveyQuestion) => q.qtype === 'smiley'
        );
        setCurrentQuestion(smileyQuestion || null);
      } catch (error) {
        console.error('Failed to fetch survey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [mappingId]);
  // Function to get emoji and label for rating
  const getEmojiForRating = (rating: string) => {
    const ratingNum = parseInt(rating);
    switch (ratingNum) {
      case 5: return { emoji: "😄", label: "Amazing" };
      case 4: return { emoji: "😊", label: "Good" };
      case 3: return { emoji: "😐", label: "Okay" };
      case 2: return { emoji: "😞", label: "Bad" };
      case 1: return { emoji: "😠", label: "Terrible" };
      default: return { emoji: "😐", label: "Okay" };
    }
  };

  const handleRatingClick = async (optionId: number, rating: string) => {
    const emojiData = getEmojiForRating(rating);
    const ratingState = {
      optionId,
      rating: parseInt(rating),
      emoji: emojiData.emoji,
      label: emojiData.label,
    };

    // If rating is 4 or 5 (positive), submit directly and go to thank you
    if (parseInt(rating) >= 3) {
      setIsSubmitting(true);
      try {
        await surveyApi.submitSurveyResponse({
          survey_response: {
            mapping_id: mappingId!,
            rating: parseInt(rating),
            emoji: emojiData.emoji,
            label: emojiData.label,
            issues: [],
            description: undefined,
            option_id: optionId,
            question_id: currentQuestion?.id
          },
        });

        navigate(`/mobile/survey/${mappingId}/thank-you`, {
          state: {
            ...ratingState,
            submittedFeedback: true,
          },
        });
      } catch (error) {
        console.error("Failed to submit rating:", error);
        // Still navigate to thank you page even if API fails
        navigate(`/mobile/survey/${mappingId}/thank-you`, {
          state: {
            ...ratingState,
            submittedFeedback: false,
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For negative ratings (1-2), go to feedback page
      navigate(`/mobile/survey/${mappingId}/feedback`, {
        state: ratingState,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!surveyData || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Survey not found or no questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Lockated Logo */}
      <div className="bg-white py-8 px-4 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="/Without bkg.svg"
              alt="OIG Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
        {/* <h1 className="text-2xl font-bold text-black mb-2">OIG</h1> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            We would love to see your
            <br />
            feedback!
          </h2>
        </div>

        {/* Illustration */}
        <div className="mb-5 px-4">
          <div className="w-24 h-42 mx-auto relative">
            {/* Phone illustration with feedback bubbles */}
            {/* <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <div className="text-sm text-gray-600">Feedback System</div>
              </div>
            </div> */}

            {/* Floating feedback elements */}
            {/* <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-2">
              <div className="flex">
                <span className="text-orange-400 text-sm">⭐⭐⭐⭐</span>
              </div>
            </div> */}

            {/* <div className="absolute -bottom-2 -left-4 bg-white rounded-lg shadow-lg p-2">
              <div className="flex">
                <span className="text-orange-400 text-sm">⭐⭐⭐</span>
              </div>
            </div> */}

            {/* Character illustration */}
            {/* <div className="absolute -right-8 bottom-0">
              <div className="w-12 h-16 bg-orange-400 rounded-full"></div>
            </div> */}
          </div>
        </div>
        <div>{surveyData.survey_title}</div>


        {/* Rating Question */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-black mb-2">
            {currentQuestion.descr}
          </h3>
        </div>

        {isSubmitting && (
          <div className="text-center mb-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">Submitting...</p>
          </div>
        )}

        {/* Rating Options */}
        <div className="w-full max-w-sm mt-2">
          <div className="grid grid-cols-5 gap-4 px-4">
            {currentQuestion.snag_quest_options
              .sort((a, b) => parseInt(b.qname) - parseInt(a.qname)) // Sort in descending order (5 to 1)
              .map((option) => {
                const emojiData = getEmojiForRating(option.qname);
                return (
                  <button
                    key={option.id}
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleRatingClick(option.id, option.qname)}
                    disabled={isSubmitting}
                  >
                    <div className="text-4xl mb-2">{emojiData.emoji}</div>
                    <div className="text-xs text-gray-600 text-center leading-tight">
                      {emojiData.label}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm space-y-1">
        <div>{surveyData.site_name} - {surveyData.area_name}</div>
        <div>Survey ID: {mappingId}</div>
      </div>
    </div>
  );
};
