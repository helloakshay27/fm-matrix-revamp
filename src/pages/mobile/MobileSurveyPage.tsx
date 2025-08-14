import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MobileSurveyLanding } from '@/components/mobile/MobileSurveyLanding';
import { MobileSurveyFeedback } from '@/components/mobile/MobileSurveyFeedback';
import { MobileSurveyThankYou } from '@/components/mobile/MobileSurveyThankYou';

export const MobileSurveyPage: React.FC = () => {
  const { mappingId, action } = useParams<{ 
    mappingId: string; 
    action?: string; 
  }>();
  const location = useLocation();

  // Extract mappingId from different route patterns
  const surveyMappingId = mappingId;
  
  console.log("🔍 SURVEY PAGE PARAMS:", { 
    mappingId: surveyMappingId, 
    action, 
    pathname: location.pathname 
  });

  // Route to different components based on action
  switch (action) {
    case 'feedback':
      return <MobileSurveyFeedback />;
    
    case 'thank-you':
      return <MobileSurveyThankYou />;
    
    default:
      // Default to landing page
      return <MobileSurveyLanding />;
  }
};
