import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Key, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react';

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
    <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-purple-500/20 p-8 mb-8 border border-purple-500/30 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-8 h-8 text-purple-400 animate-pulse-slow" />
        <h2 className="text-3xl font-bold text-white">API Key Settings</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-purple-500/30 shadow-xl animate-slide-in-up">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white text-lg">Why do I need a Gemini API key?</h3>
        </div>
        <p className="text-sm text-gray-200 mb-4">
          FacelessScriptPro uses Google's <span className="font-bold text-purple-300">Gemini 2.5 Flash</span> to generate scripts. You need your own API key to use the service.
        </p>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-purple-500/20">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-cyan-400">📋</span>
            How to get a free API key:
          </h4>
          <ol className="text-sm text-gray-200 space-y-2 list-decimal list-inside">
            <li className="animate-fade-in delay-100">
              Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-pink-300 underline font-bold transition-colors">Google AI Studio</a>
            </li>
            <li className="animate-fade-in delay-200">Sign in with your Google account</li>
            <li className="animate-fade-in delay-300">Click "Get API key" or "Create API key"</li>
            <li className="animate-fade-in delay-400">Copy the key and paste it below</li>
          </ol>
        </div>
      </div>

      <div className="mb-6 animate-slide-in-up delay-200">
        <label className="block text-white font-bold mb-3 text-lg flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-400" />
          Gemini API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key here..."
            className="w-full px-5 py-4 pr-28 bg-slate-900/50 border-2 border-purple-500/40 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none font-mono text-sm text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-500/60"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 text-sm text-purple-300 hover:text-pink-300 font-semibold flex items-center gap-2 transition-colors duration-300"
          >
            {showKey ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-4 animate-slide-in-up delay-300">
        <button
          onClick={handleSave}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <Key className="w-5 h-5" />
          Save API Key
        </button>

        {geminiApiKey && (
          <button
            onClick={handleClear}
            className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-gray-200 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-purple-500/30 hover:border-purple-500/60"
          >
            Clear Key
          </button>
        )}
      </div>

      {geminiApiKey && (
        <div className="mt-6 flex items-center gap-3 text-green-400 bg-green-900/20 border border-green-500/30 rounded-xl p-4 animate-fade-in">
          <CheckCircle className="w-6 h-6 animate-pulse" />
          <span className="text-sm font-bold">API key is configured and ready to use!</span>
        </div>
      )}

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
      `}</style>
    </div>
  );
}
