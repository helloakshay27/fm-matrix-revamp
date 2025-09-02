import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { surveyApi } from "@/services/surveyApi";
import baseClient from "@/utils/withoutTokenBase";

interface GenericTag {
  id: number;
  category_name: string;
  category_type: string;
  tag_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  icons: {
    id: number;
    file_name: string;
    content_type: string;
    file_size: number;
    updated_at: string;
    url: string;
  }[];
}

interface SurveyQuestion {
  id: number;
  qtype: string;
  descr: string;
  checklist_id: number;
  img_mandatory: boolean;
  quest_mandatory: boolean;
  snag_quest_options: SurveyOption[];
  generic_tags?: GenericTag[];
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
  const [showEmojiRating, setShowEmojiRating] = useState(true);
  const [showGenericTags, setShowGenericTags] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [genericTags, setGenericTags] = useState<GenericTag[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SurveyOption>>({});

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!mappingId) return;
      
      try {
        setIsLoading(true);
        const response = await baseClient.get(`survey_mappings/${mappingId}/survey.json`);
        const data = response.data;
        setSurveyData(data);
        
        // Find the emoji question and extract generic_tags
        const emojiQuestion = data.snag_checklist.snag_questions.find(
          (q: SurveyQuestion) => q.qtype === 'emoji'
        );
        
        if (emojiQuestion && emojiQuestion.generic_tags) {
          setGenericTags(emojiQuestion.generic_tags);
        }
        
        // Set the first question as current question (support all question types)
        const firstQuestion = data.snag_checklist.snag_questions[0];
        setCurrentQuestion(firstQuestion || null);
        setCurrentQuestionIndex(0);
      } catch (error) {
        console.error('Failed to fetch survey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [mappingId]);
  // Static emoji options for initial selection
  const getStaticEmojiOptions = () => [
    { rating: 5, emoji: "😄", label: "Amazing" },
    { rating: 4, emoji: "😊", label: "Good" },
    { rating: 3, emoji: "😐", label: "Okay" },
    { rating: 2, emoji: "😞", label: "Bad" },
    { rating: 1, emoji: "😠", label: "Terrible" }
  ];

  // Handle emoji rating click
  const handleEmojiRatingClick = async (rating: number, emoji: string, label: string) => {
    setSelectedRating(rating);
    setSelectedEmoji(emoji);
    setSelectedLabel(label);
    
    // If rating is good (4-5), submit directly
    if (rating >= 4) {
      setIsSubmitting(true);
      try {
        await surveyApi.submitSurveyResponse({
          survey_response: {
            mapping_id: mappingId!,
            rating: rating,
            emoji: emoji,
            label: label,
            issues: [],
            description: undefined
          },
        });

        navigate(`/mobile/survey/${mappingId}/thank-you`, {
          state: {
            rating: rating,
            emoji: emoji,
            label: label,
            submittedFeedback: true
          },
        });
      } catch (error) {
        console.error("Failed to submit survey:", error);
        navigate(`/mobile/survey/${mappingId}/thank-you`, {
          state: {
            rating: rating,
            emoji: emoji,
            label: label,
            submittedFeedback: false
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For bad ratings (1-3), show generic tags if available
      if (genericTags.length > 0) {
        setShowEmojiRating(false);
        setShowGenericTags(true);
      } else {
        // No generic tags available, submit directly
        setIsSubmitting(true);
        try {
          await surveyApi.submitSurveyResponse({
            survey_response: {
              mapping_id: mappingId!,
              rating: rating,
              emoji: emoji,
              label: label,
              issues: [],
              description: undefined
            },
          });

          navigate(`/mobile/survey/${mappingId}/thank-you`, {
            state: {
              rating: rating,
              emoji: emoji,
              label: label,
              submittedFeedback: true
            },
          });
        } catch (error) {
          console.error("Failed to submit survey:", error);
          navigate(`/mobile/survey/${mappingId}/thank-you`, {
            state: {
              rating: rating,
              emoji: emoji,
              label: label,
              submittedFeedback: false
            },
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  // Handle generic tag selection
  const handleGenericTagClick = async (tag: GenericTag) => {
    setIsSubmitting(true);
    try {
      await surveyApi.submitSurveyResponse({
        survey_response: {
          mapping_id: mappingId!,
          rating: selectedRating!,
          emoji: selectedEmoji,
          label: selectedLabel,
          issues: [tag.category_name],
          description: undefined
        },
      });

      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          rating: selectedRating!,
          emoji: selectedEmoji,
          label: selectedLabel,
          submittedFeedback: true,
          selectedTag: tag.category_name
        },
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          rating: selectedRating!,
          emoji: selectedEmoji,
          label: selectedLabel,
          submittedFeedback: false,
          selectedTag: tag.category_name
        },
      });
    } finally {
      setIsSubmitting(false);
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

  if (!surveyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Survey not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Lockated Logo */}
      <div className="bg-white py-8 px-4 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <img
              src="/Without bkg.svg"
              alt="OIG Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
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

        <div className="mb-5 px-4">
          <div className="w-24 h-42 mx-auto relative"></div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-black">{surveyData.survey_title}</h3>
        </div>

        {/* Show emoji rating or generic tags based on state */}
        {showEmojiRating && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-black mb-2">
                Rate your experience
              </h3>
            </div>

            {isSubmitting && (
              <div className="text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Submitting...</p>
              </div>
            )}

            {/* Static Emoji Options */}
            <div className="w-full max-w-sm mt-2">
              <div className="grid grid-cols-5 gap-4 px-4">
                {getStaticEmojiOptions().map((option) => (
                  <button
                    key={option.rating}
                    onClick={() => handleEmojiRatingClick(option.rating, option.emoji, option.label)}
                    disabled={isSubmitting}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-3xl mb-1">{option.emoji}</span>
                    <span className="text-xs text-gray-600 text-center">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Generic Tags Selection for Bad Ratings */}
        {showGenericTags && (
          <>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">{selectedEmoji}</span>
                <span className="text-lg font-medium text-gray-700">{selectedLabel}</span>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                What specifically needs improvement?
              </h3>
            </div>

            {isSubmitting && (
              <div className="text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Submitting...</p>
              </div>
            )}

            {/* Generic Tags Grid */}
            <div className="w-full max-w-sm mt-2">
              <div className="grid grid-cols-2 gap-4 px-4">
                {genericTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleGenericTagClick(tag)}
                    disabled={isSubmitting}
                    className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      {tag.icons.length > 0 && (
                        <div className="mb-2">
                          <img
                            src={decodeURIComponent(tag.icons[0].url)}
                            alt={tag.category_name}
                            className="w-8 h-8 mx-auto object-contain"
                            onError={(e) => {
                              // Fallback to emoji if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling!.textContent = '📋';
                            }}
                          />
                          <div className="text-2xl hidden">📋</div>
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-700">
                        {tag.category_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="w-full max-w-sm mt-8 px-4">
              <button
                onClick={() => {
                  setShowGenericTags(false);
                  setShowEmojiRating(true);
                  setSelectedRating(null);
                  setSelectedEmoji('');
                  setSelectedLabel('');
                }}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Rating</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm space-y-1">
        <div>{surveyData.site_name} - {surveyData.area_name}</div>
        <div>Survey ID: {mappingId}</div>
      </div>
    </div>
  );

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setCurrentQuestion(surveyData!.snag_checklist.snag_questions[prevIndex]);
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
    return (    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            <div className="w-24 h-24 flex items-center justify-center">
            <img
              src="/Without bkg.svg"
              alt="OIG Logo"
              className="w-24 h-24 object-contain"
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

        {/* Progress Indicator */}
        <div className="w-full max-w-sm mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {surveyData.snag_checklist.snag_questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / surveyData.snag_checklist.snag_questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / surveyData.snag_checklist.snag_questions.length) * 100}%`
              }}
            ></div>
          </div>
        </div>


        {/* Rating Question */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-black mb-2">
            {currentQuestion.descr}
          </h3>
          {currentQuestion.quest_mandatory && (
            <p className="text-sm text-red-500">* Required</p>
          )}
        </div>

        {isSubmitting && (
          <div className="text-center mb-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">Submitting...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm space-y-1">
        <div>{surveyData.site_name} - {surveyData.area_name}</div>
        <div>Survey ID: {mappingId}</div>
      </div>
    </div>
  );
};
