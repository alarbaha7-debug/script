import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 180000 // 3 minutes timeout for long operations
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Methods
export const scriptAPI = {
  /**
   * Analyze a script example
   * @param {Object} data - Analysis data
   * @returns {Promise}
   */
  analyzeScript: async (data) => {
    const response = await api.post('/analyze-script', data);
    return response.data;
  },

  /**
   * Generate plot details from title
   * @param {Object} data - Plot generation data
   * @returns {Promise}
   */
  generatePlot: async (data) => {
    const response = await api.post('/generate-plot', data);
    return response.data;
  },

  /**
   * Generate a script
   * @param {Object} data - Generation data
   * @returns {Promise}
   */
  generateScript: async (data) => {
    const response = await api.post('/generate-script', data);
    return response.data;
  },

  /**
   * Create a template from example script
   * @param {Object} data - Template creation data (templateName, category, niche, exampleScript, userApiKey)
   * @returns {Promise}
   */
  createTemplate: async (data) => {
    const response = await api.post('/create-template', data);
    return response.data;
  },

  /**
   * Generate script from template
   * @param {Object} data - Generation data (templateId, title, plotDetails, targetCharacters, userApiKey)
   * @returns {Promise}
   */
  generateFromTemplate: async (data) => {
    const response = await api.post('/generate-from-template', data);
    return response.data;
  },

  /**
   * Get user's templates
   * @returns {Promise}
   */
  getTemplates: async () => {
    const response = await api.get('/templates');
    return response.data;
  },

  /**
   * Test API connection
   * @returns {Promise}
   */
  test: async () => {
    const response = await api.get('/test');
    return response.data;
  }
};

export default api;
