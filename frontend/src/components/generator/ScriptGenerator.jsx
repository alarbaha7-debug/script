import React, { useState, useEffect } from 'react';
import { scriptAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Sparkles, Zap, Film, Save, Wand2 } from 'lucide-react';

// Categories with emojis and colors
const CATEGORIES = [
  { id: 'emotional', name: '❤️ Emotional', emoji: '❤️', color: 'from-pink-500 to-rose-500', description: 'Deep feelings, empathy, inspiration' },
  { id: 'horror', name: '👻 Horror', emoji: '👻', color: 'from-purple-600 to-indigo-700', description: 'Creepy, unsettling, suspenseful' },
  { id: 'mystery', name: '🔍 Mystery', emoji: '🔍', color: 'from-blue-500 to-cyan-600', description: 'Unsolved, strange, curious' },
  { id: 'adventure', name: '🗺️ Adventure', emoji: '🗺️', color: 'from-green-500 to-emerald-600', description: 'Journey, exploration, discovery' },
  { id: 'educational', name: '📚 Educational', emoji: '📚', color: 'from-orange-500 to-amber-600', description: 'Facts, lessons, knowledge' }
];

// Niches by category
const NICHES_BY_CATEGORY = {
  emotional: ['Personal Stories', 'Survival Stories', 'Inspirational', 'Tragic Events', 'Heroic Acts'],
  horror: ['True Crime', 'Paranormal', 'Urban Legends', 'Unsolved Mysteries', 'Creepy Encounters'],
  mystery: ['Missing Persons', 'Conspiracy Theories', 'Unexplained Events', 'Cold Cases', 'Strange Phenomena'],
  adventure: ['Exploration', 'Survival', 'Travel', 'Extreme Sports', 'Wilderness'],
  educational: ['History', 'Science', 'Technology', 'Psychology', 'Philosophy']
};

export default function ScriptGenerator() {
  const { geminiApiKey } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'generate'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [exampleScript, setExampleScript] = useState('');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  // Generation state
  const [title, setTitle] = useState('');
  const [plotDetails, setPlotDetails] = useState('');
  const [targetLength, setTargetLength] = useState(30000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const finalNiche = customNiche || selectedNiche;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedNiche(''); // Reset niche when category changes
    setCustomNiche('');
  };

  const handleCreateTemplate = async () => {
    // Validation
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!finalNiche.trim()) {
      toast.error('Please select or enter a niche');
      return;
    }
    if (!exampleScript.trim() || exampleScript.length < 500) {
      toast.error('Please paste an example script (at least 500 characters)');
      return;
    }
    if (!geminiApiKey) {
      toast.error('Please add your Gemini API key in settings');
      return;
    }

    setIsCreatingTemplate(true);
    const toastId = toast.loading('Analyzing script and creating template...');

    try {
      const response = await scriptAPI.createTemplate({
        templateName: templateName.trim(),
        category: selectedCategory,
        niche: finalNiche.trim(),
        exampleScript: exampleScript.trim(),
        userApiKey: geminiApiKey
      });

      toast.success('Template created successfully!', { id: toastId });

      // Reset form
      setTemplateName('');
      setExampleScript('');
      setSelectedCategory('');
      setSelectedNiche('');
      setCustomNiche('');

      // Switch to generate tab
      setActiveTab('generate');

    } catch (error) {
      console.error('Template creation error:', error);
      toast.error(error.response?.data?.error || 'Failed to create template', { id: toastId });
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  const handleGenerateScript = async () => {
    // Validation
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a video title');
      return;
    }
    if (!plotDetails.trim()) {
      toast.error('Please enter plot details');
      return;
    }
    if (!geminiApiKey) {
      toast.error('Please add your Gemini API key in settings');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating your script...');

    try {
      const response = await scriptAPI.generateFromTemplate({
        templateId: selectedTemplate.id,
        title: title.trim(),
        plotDetails: plotDetails.trim(),
        targetCharacters: targetLength,
        userApiKey: geminiApiKey
      });

      setGeneratedScript(response.script);
      toast.success(`Script generated! ${response.stats.characterCount} characters`, { id: toastId });

    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate script', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-1/2 -right-48 animate-pulse delay-1000"></div>
        <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -bottom-48 left-1/2 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              FacelessScriptPro
            </h1>
            <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 font-medium">
            AI-Powered YouTube Script Generator with Template System
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl p-2 rounded-2xl border border-purple-500/20 shadow-2xl">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Save className="w-5 h-5" />
              Create Template
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'generate'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-5 h-5" />
              Generate Script
            </button>
          </div>
        </div>

        {/* CREATE TEMPLATE TAB */}
        {activeTab === 'create' && (
          <div className="animate-slide-in">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Film className="w-8 h-8 text-purple-400" />
                Create Your Template
              </h2>

              {/* Template Name */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Template Name *</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Horror Style, Crime Documentary Style"
                  className="w-full bg-slate-700/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>

              {/* Category Selector */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-4 text-xl">Select Category *</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === cat.id
                          ? `bg-gradient-to-br ${cat.color} shadow-2xl scale-105`
                          : 'bg-slate-700/50 hover:bg-slate-700 border-2 border-purple-500/20'
                      }`}
                    >
                      <div className="text-5xl mb-3">{cat.emoji}</div>
                      <div className="font-bold text-white text-lg mb-2">{cat.name.replace(/^.+\s/, '')}</div>
                      <div className="text-xs text-gray-300">{cat.description}</div>

                      {selectedCategory === cat.id && (
                        <div className="absolute top-2 right-2">
                          <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche Selector */}
              {selectedCategory && (
                <div className="mb-6 animate-fade-in">
                  <label className="block text-white font-bold mb-4 text-xl">Select Niche *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {NICHES_BY_CATEGORY[selectedCategory].map((niche) => (
                      <button
                        key={niche}
                        onClick={() => {
                          setSelectedNiche(niche);
                          setCustomNiche('');
                        }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          selectedNiche === niche
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-purple-500/20'
                        }`}
                      >
                        {niche}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Or enter custom niche:</label>
                    <input
                      type="text"
                      value={customNiche}
                      onChange={(e) => {
                        setCustomNiche(e.target.value);
                        if (e.target.value) setSelectedNiche('');
                      }}
                      placeholder="e.g., Ghost Stories, Serial Killers, etc."
                      className="w-full bg-slate-700/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Example Script */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Example Script *</label>
                <p className="text-gray-400 text-sm mb-3">
                  Paste your best script here (500+ characters). This will be analyzed to create your template.
                </p>
                <textarea
                  value={exampleScript}
                  onChange={(e) => setExampleScript(e.target.value)}
                  placeholder="Paste your example script here..."
                  rows={12}
                  className="w-full bg-slate-700/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none font-mono text-sm"
                />
                <div className="text-right text-sm mt-2 text-gray-400">
                  {exampleScript.length} characters
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateTemplate}
                disabled={isCreatingTemplate}
                className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isCreatingTemplate
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105'
                }`}
              >
                {isCreatingTemplate ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Template...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Create Template
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* GENERATE SCRIPT TAB */}
        {activeTab === 'generate' && (
          <div className="animate-slide-in">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-blue-400" />
                Generate Script from Template
              </h2>

              <div className="text-center text-gray-400 py-12">
                <p>Template selection and script generation UI will be added here</p>
                <p className="text-sm mt-2">Coming in next update...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
