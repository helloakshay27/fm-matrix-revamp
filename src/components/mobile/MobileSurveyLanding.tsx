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
  const [description, setDescription] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<GenericTag[]>([]);

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

  // Get static image based on category name
  const getStaticImageForCategory = (categoryName: string): string => {
    const lowerCaseName = categoryName.toLowerCase();
    
    if (lowerCaseName.includes('menu') || lowerCaseName.includes('variety')) {
      return '/menu.png';
    } else if (lowerCaseName.includes('quality')) {
      return '/quality.png';
    } else if (lowerCaseName.includes('taste')) {
      return '/taste.png';
    } else {
      // Default fallback
      return '/menu.png';
    }
  };

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

  // Handle generic tag selection (toggle selection, don't auto-submit)
  const handleGenericTagClick = (tag: GenericTag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(selectedTag => selectedTag.id === tag.id);
      if (isSelected) {
        // Remove tag if already selected
        return prev.filter(selectedTag => selectedTag.id !== tag.id);
      } else {
        // Add tag if not selected
        return [...prev, tag];
      }
    });
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
          <h1 className="text-2xl font-medium text-black">{surveyData.survey_title}</h1>
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
              {selectedTags.length > 0 && (
                <p className="text-sm text-blue-600 mb-4">
                  {selectedTags.length} item{selectedTags.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {isSubmitting && (
              <div className="text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Submitting...</p>
              </div>
            )}

            {/* Generic Tags Grid */}
            <div className="w-full max-w-sm mt-2">
              <div className="grid grid-cols-2 gap-4 px-4 mb-6">
                {genericTags.map((tag) => {
                  const isSelected = selectedTags.some(selectedTag => selectedTag.id === tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleGenericTagClick(tag)}
                      disabled={isSubmitting}
                      className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-2">
                          {tag.icons && tag.icons.length > 0 ? (
                            <img
                              src={decodeURIComponent(tag.icons[0].url)}
                              alt={tag.category_name}
                              className="w-8 h-8 mx-auto object-contain"
                              onError={(e) => {
                                // Fallback to static image if API image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = getStaticImageForCategory(tag.category_name);
                              }}
                            />
                          ) : (
                            <img
                              src={getStaticImageForCategory(tag.category_name)}
                              alt={tag.category_name}
                              className="w-8 h-8 mx-auto object-contain"
                            />
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {tag.category_name}
                        </div>
                        {isSelected && (
                          <div className="mt-2">
                            <div className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Description Field */}
              <div className="px-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe any specific issues or suggestions..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <div className="px-4 mb-4">
                <button
                  onClick={() => {
                    // Submit with selected tags and/or description
                    const submitData = async () => {
                      setIsSubmitting(true);
                      try {
                        const issues = selectedTags.map(tag => tag.category_name);
                        
                        await surveyApi.submitSurveyResponse({
                          survey_response: {
                            mapping_id: mappingId!,
                            rating: selectedRating!,
                            emoji: selectedEmoji,
                            label: selectedLabel,
                            issues: issues,
                            description: description.trim() || undefined
                          },
                        });

                        navigate(`/mobile/survey/${mappingId}/thank-you`, {
                          state: {
                            rating: selectedRating!,
                            emoji: selectedEmoji,
                            label: selectedLabel,
                            submittedFeedback: true,
                            selectedTags: issues,
                            hasDescription: !!description.trim()
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
                            selectedTags: selectedTags.map(tag => tag.category_name),
                            hasDescription: !!description.trim()
                          },
                        });
                      } finally {
                        setIsSubmitting(false);
                      }
                    };
                    submitData();
                  }}
                  disabled={isSubmitting || (selectedTags.length === 0 && !description.trim())}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
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
                  setSelectedTags([]);
                  setDescription('');
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
        {/* <div>Survey ID: {mappingId}</div> */}
      </div>
    </div>
  );
};
