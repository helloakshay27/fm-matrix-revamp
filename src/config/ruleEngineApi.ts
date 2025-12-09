import axios from 'axios';
import { API_CONFIG } from './apiConfig';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
});

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: getAuthHeaders(),
});

// Update headers before each request to ensure fresh token
api.interceptors.request.use((config) => {
  Object.assign(config.headers, getAuthHeaders());
  return config;
});

// Fetch Master Attributes with companyId and activeStatus
export const fetchMasterAttributes = async (companyId, activeStatus) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/rule_engine/applicable_models/loyalty_re.json?access_token=${token}&company_id=${companyId}&active=${activeStatus}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching master attributes:', error);
    throw error;
  }
};

// Fetch Sub Attributes based on Master Attribute ID
export const fetchSubAttributes = async (masterAttributeId) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/rule_engine/applicable_models/loyalty_re.json?access_token=${token}&company_id=44&active=true&masterAttributeId=${masterAttributeId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching sub attributes:', error);
    throw error;
  }
};

// Fetch Master Reward Outcomes with companyId and activeStatus
export const fetchMasterRewardOutcomes = async (companyId, activeStatus) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/rule_engine/applicable_models/loyalty_re.json?access_token=${token}&company_id=${companyId}&active=${activeStatus}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching master reward outcomes:', error);
    throw error;
  }
};

// Fetch Sub reward outcome based on Master reward outcome ID
export const fetchSubRewardOutcomes = async (masterRewardOutcomeId) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/rule_engine/applicable_models/loyalty_re.json?access_token=${token}&company_id=44&active=true&masterRewardOutcomeId=${masterRewardOutcomeId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching sub reward outcomes:', error);
    throw error;
  }
};