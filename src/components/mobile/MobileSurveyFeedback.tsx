import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { surveyApi } from '@/services/surveyApi';

interface LocationState {
  rating: number;
  emoji: string;
  label: string;
}

export const MobileSurveyFeedback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mappingId } = useParams<{ mappingId: string }>();
  const state = location.state as LocationState;
  
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueOptions = [
    { id: 'Tap Faulty', icon: '🚰', label: 'Tap Faulty' },
    { id: 'Wc Choked', icon: '🚽', label: 'Wc Choked' },
    { id: 'Foul Smell', icon: '👃', label: 'Foul Smell' },
    { id: 'Soap Missing', icon: '🧼', label: 'Soap Missing' },
    { id: 'Hand Dryer Faulty', icon: '🌬️', label: 'Hand Dryer Faulty' },
    { id: 'Tissue Paper Missing', icon: '🧻', label: 'Tissue Paper Missing' },
    { id: 'Dirty Floor', icon: '🧽', label: 'Dirty Floor' },
    { id: 'Toilet Paper Missing', icon: '🧻', label: 'Toilet Paper Missing' }
  ];

  const handleIssueToggle = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = async () => {
    if (selectedIssues.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await surveyApi.submitSurveyResponse({
        survey_response: {
          mapping_id: mappingId!,
          rating: location.state.rating,
          emoji: location.state.emoji,
          label: location.state.label,
          issues: selectedIssues,
          description: description.trim() || undefined
        }
      });
      
      navigate(`/mobile/survey/${mappingId}/thank-you`, { 
        state: { 
          ...location.state,
          submittedFeedback: true 
        } 
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // For now, still navigate to thank you page
      navigate(`/mobile/survey/${mappingId}/thank-you`, { 
        state: { 
          ...location.state,
          submittedFeedback: false 
        } 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-teal-600">Survey</h1>
          <button 
            onClick={() => navigate(`/mobile/survey/${mappingId}`)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Washroom Cleanliness</h2>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Feedback</span>
              <div className="flex items-center">
                <span className="text-lg mr-1">{state?.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{state?.label}</span>
              </div>
            </div>
          </div>

          {/* Issues Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {issueOptions.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => handleIssueToggle(issue.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedIssues.includes(issue.id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{issue.icon}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {issue.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Other Issues Text Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other (describe)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe any other issues..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (selectedIssues.length === 0 && !description.trim())}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Complete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
