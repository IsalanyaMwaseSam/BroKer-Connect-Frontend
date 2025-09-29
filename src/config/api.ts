const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://brokerconnectug.netlify.app/api'
  : 'http://localhost:3001/api';

// For direct fetch calls
export const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://brokerconnectug.netlify.app'
    : 'http://localhost:3001';
  return `${baseUrl}${endpoint}`;
};

export { API_BASE_URL };