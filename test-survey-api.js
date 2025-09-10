// Test script to verify survey API URL construction
console.log('Testing Survey API URL Construction with access_token');

// Simulate the URL construction
const testUrlConstruction = () => {
  const baseUrl = 'https://api.example.com';
  const endpoint = '/survey_mappings/response_list.json';
  const accessToken = '6-AIHlQUZpxdUQdJYZi0ioCfzsYmZZfTE0789NaqvHM';
  const page = 4;
  const surveyId = '12511';
  
  const url = new URL(baseUrl + endpoint);
  
  // Add parameters in order
  url.searchParams.append('access_token', accessToken);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('survey_id', surveyId);
  
  console.log('✅ Constructed URL:', url.toString());
  console.log('📝 Expected format: access_token=6-AIHlQUZpxdUQdJYZi0ioCfzsYmZZfTE0789NaqvHM&page=4&survey_id=12511');
  
  // Verify parameters
  const params = url.searchParams;
  console.log('🔍 Parameters extracted:');
  console.log('  - access_token:', params.get('access_token'));
  console.log('  - page:', params.get('page'));
  console.log('  - survey_id:', params.get('survey_id'));
  
  return url.toString();
};

testUrlConstruction();
