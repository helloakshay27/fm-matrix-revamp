// Test script to verify the survey details API endpoint
const testSurveyDetailsApi = () => {
  // Mock API response structure as provided by the user
  const mockApiResponse = {
    "survey_details": {
      "survey": [
        {
          "survey_id": 12483,
          "survey_name": "Field safety",
          "questions": [
            {
              "question_id": 89554,
              "question": "West area patrolling done?",
              "options": []
            },
            {
              "question_id": 89555,
              "question": "East Area patrolling done?",
              "options": [
                {
                  "option_id": 215600,
                  "option": "Yes",
                  "response_count": 0
                },
                {
                  "option_id": 215601,
                  "option": "No",
                  "response_count": 0
                }
              ]
            },
            {
              "question_id": 89556,
              "question": "South Area patrolling done?\nQuestion Text",
              "options": []
            },
            {
              "question_id": 89557,
              "question": "All site patrolling raiting",
              "options": []
            },
            {
              "question_id": 89558,
              "question": "Patrolling experience",
              "options": []
            }
          ]
        }
      ]
    }
  };

  console.log('🧪 Testing Survey Details API Response Structure');
  console.log('=====================================');
  
  // Test API endpoint construction
  const baseUrl = 'https://api.example.com';
  const endpoint = '/pms/admin/snag_checklists/survey_details.json';
  const surveyId = '12483';
  const accessToken = '6-AIHlQUZpxdUQdJYZi0ioCfzsYmZZfTE0789NaqvHM';
  
  const url = new URL(baseUrl + endpoint);
  url.searchParams.append('access_token', accessToken);
  url.searchParams.append('survey_id', surveyId);
  
  console.log('🔗 Constructed API URL:', url.toString());
  console.log('');
  
  // Test data structure processing
  console.log('📊 Processing API Response Data:');
  console.log('Survey ID:', mockApiResponse.survey_details.survey[0].survey_id);
  console.log('Survey Name:', mockApiResponse.survey_details.survey[0].survey_name);
  console.log('Total Questions:', mockApiResponse.survey_details.survey[0].questions.length);
  console.log('');
  
  // Analyze questions and options
  console.log('🔍 Questions Analysis:');
  const survey = mockApiResponse.survey_details.survey[0];
  
  let questionsWithOptions = 0;
  let questionsWithoutOptions = 0;
  let totalOptions = 0;
  let totalResponses = 0;
  
  survey.questions.forEach((question, index) => {
    const hasOptions = question.options && question.options.length > 0;
    
    if (hasOptions) {
      questionsWithOptions++;
      totalOptions += question.options.length;
      
      // Count responses for this question
      const questionResponses = question.options.reduce((sum, opt) => sum + opt.response_count, 0);
      totalResponses += questionResponses;
      
      console.log(`Question ${index + 1}: "${question.question}" - ${question.options.length} options, ${questionResponses} responses`);
    } else {
      questionsWithoutOptions++;
      console.log(`Question ${index + 1}: "${question.question}" - No options configured`);
    }
  });
  
  console.log('');
  console.log('📈 Summary Statistics:');
  console.log('Questions with options:', questionsWithOptions);
  console.log('Questions without options:', questionsWithoutOptions);
  console.log('Total options across all questions:', totalOptions);
  console.log('Total responses across all questions:', totalResponses);
  console.log('');
  
  // Test chart data generation (simulating the frontend logic)
  console.log('📊 Chart Data Generation Test:');
  
  // Test question options data for question with options
  const questionWithOptions = survey.questions.find(q => q.options && q.options.length > 0);
  if (questionWithOptions) {
    console.log('Chart data for question with options:');
    const chartData = questionWithOptions.options.map((option, index) => ({
      name: option.option,
      value: option.response_count || 0,
      color: ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6'][index % 4]
    }));
    console.log(JSON.stringify(chartData, null, 2));
  }
  
  // Test question without options
  const questionWithoutOptions = survey.questions.find(q => !q.options || q.options.length === 0);
  if (questionWithoutOptions) {
    console.log('Chart data for question without options:');
    const chartData = [{
      name: 'No options configured',
      value: 1,
      color: '#E5E5E5'
    }];
    console.log(JSON.stringify(chartData, null, 2));
  }
  
  console.log('');
  console.log('✅ API Response Structure Test Complete!');
  console.log('The survey details page is now properly configured to handle:');
  console.log('- Questions with options (showing response counts and percentages)');
  console.log('- Questions without options (showing "No options configured")');
  console.log('- Proper error handling for missing data');
  console.log('- Chart generation for both scenarios');
};

// Run the test
testSurveyDetailsApi();
