import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ApiKeyManager() {
  const { geminiApiKey, saveApiKey } = useAuth();
  const [apiKey, setApiKey] = useState(geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (!apiKey || apiKey.length < 10) {
      toast.error('Please enter a valid API key');
      return;
    }

    saveApiKey(apiKey);
    toast.success('API key saved successfully!');
  };

  const handleClear = () => {
    setApiKey('');
    saveApiKey('');
    toast.success('API key cleared');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">🔑 API Key Settings</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">Why do I need a Gemini API key?</h3>
        <p className="text-xs sm:text-sm text-blue-800 mb-2 sm:mb-3">
          FacelessScriptPro uses Google's Gemini 2.5 Flash to generate scripts. You need your own API key to use the service.
        </p>
        <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">How to get a free API key:</h4>
        <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold break-all">Google AI Studio</a></li>
          <li>Sign in with your Google account</li>
          <li>Click "Get API key" or "Create API key"</li>
          <li>Copy the key and paste it below</li>
        </ol>
      </div>

      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          Gemini API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key here..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-16 sm:pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleSave}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold transition-colors"
        >
          Save API Key
        </button>

        {geminiApiKey && (
          <button
            onClick={handleClear}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-semibold transition-colors"
          >
            Clear Key
          </button>
        )}
      </div>

      {geminiApiKey && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-green-700">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs sm:text-sm font-semibold">API key is configured</span>
        </div>
      )}
    </div>
  );
}
