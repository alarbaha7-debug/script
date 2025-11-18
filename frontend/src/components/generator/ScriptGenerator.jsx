import React, { useState, useEffect } from 'react';
import { scriptAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Sparkles, Zap, Film, Save, Wand2, Play, Download, Copy, Trash2, CheckCircle } from 'lucide-react';

// Categories with emojis and colors
const CATEGORIES = [
  { id: 'emotional', name: '❤️ Emotional', emoji: '❤️', color: 'from-pink-500 via-rose-500 to-red-500', bgColor: 'bg-pink-500/10', description: 'Deep feelings, empathy, inspiration' },
  { id: 'horror', name: '👻 Horror', emoji: '👻', color: 'from-purple-600 via-violet-600 to-indigo-700', bgColor: 'bg-purple-500/10', description: 'Creepy, unsettling, suspenseful' },
  { id: 'mystery', name: '🔍 Mystery', emoji: '🔍', color: 'from-blue-500 via-cyan-500 to-teal-600', bgColor: 'bg-blue-500/10', description: 'Unsolved, strange, curious' },
  { id: 'adventure', name: '🗺️ Adventure', emoji: '🗺️', color: 'from-green-500 via-emerald-500 to-teal-600', bgColor: 'bg-green-500/10', description: 'Journey, exploration, discovery' },
  { id: 'educational', name: '📚 Educational', emoji: '📚', color: 'from-orange-500 via-amber-500 to-yellow-600', bgColor: 'bg-orange-500/10', description: 'Facts, lessons, knowledge' }
];

// Niches by category
const NICHES_BY_CATEGORY = {
  emotional: ['Personal Stories', 'Survival Stories', 'Inspirational', 'Tragic Events', 'Heroic Acts'],
  horror: ['True Crime', 'Paranormal', 'Urban Legends', 'Unsolved Mysteries', 'Creepy Encounters'],
  mystery: ['Missing Persons', 'Conspiracy Theories', 'Unexplained Events', 'Cold Cases', 'Strange Phenomena'],
  adventure: ['Exploration', 'Survival', 'Travel', 'Extreme Sports', 'Wilderness'],
  educational: ['History', 'Science', 'Technology', 'Psychology', 'Philosophy']
};

// LocalStorage keys
const TEMPLATES_STORAGE_KEY = 'facelessscriptpro_templates';

// Template storage functions
const saveTemplateToStorage = (template) => {
  try {
    const templates = JSON.parse(localStorage.getItem(TEMPLATES_STORAGE_KEY) || '[]');
    templates.push(template);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('Failed to save template:', error);
    return false;
  }
};

const getTemplatesFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Failed to load templates:', error);
    return [];
  }
};

const deleteTemplateFromStorage = (templateId) => {
  try {
    const templates = JSON.parse(localStorage.getItem(TEMPLATES_STORAGE_KEY) || '[]');
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete template:', error);
    return false;
  }
};

export default function ScriptGenerator() {
  const { geminiApiKey } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [exampleScript, setExampleScript] = useState('');
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  // Template management
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Generation state
  const [genNiche, setGenNiche] = useState('');
  const [title, setTitle] = useState('');
  const [plotDetails, setPlotDetails] = useState('');
  const [targetLength, setTargetLength] = useState(30000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [generationTimeline, setGenerationTimeline] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  // Load templates on mount
  useEffect(() => {
    const templates = getTemplatesFromStorage();
    setSavedTemplates(templates);
  }, []);

  const finalNiche = customNiche || selectedNiche;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedNiche('');
    setCustomNiche('');
  };

  const handleCreateTemplate = async () => {
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
    const toastId = toast.loading('Analyzing script with Gemini 2.5 Flash...');

    try {
      const response = await scriptAPI.createTemplate({
        templateName: templateName.trim(),
        category: selectedCategory,
        niche: finalNiche.trim(),
        exampleScript: exampleScript.trim(),
        userApiKey: geminiApiKey
      });

      // Save template to localStorage
      const saved = saveTemplateToStorage(response.template);
      if (saved) {
        // Reload templates
        const templates = getTemplatesFromStorage();
        setSavedTemplates(templates);
        toast.success('✨ Template created and saved!', { id: toastId });
      } else {
        toast.success('✨ Template created!', { id: toastId });
      }

      // Reset form
      setTemplateName('');
      setExampleScript('');
      setSelectedCategory('');
      setSelectedNiche('');
      setCustomNiche('');

      // Switch to generate tab
      setTimeout(() => setActiveTab('generate'), 500);

    } catch (error) {
      console.error('Template creation error:', error);
      toast.error(error.response?.data?.error || 'Failed to create template', { id: toastId });
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const deleted = deleteTemplateFromStorage(templateId);
      if (deleted) {
        const templates = getTemplatesFromStorage();
        setSavedTemplates(templates);
        if (selectedTemplate?.id === templateId) {
          setSelectedTemplate(null);
        }
        toast.success('Template deleted');
      } else {
        toast.error('Failed to delete template');
      }
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setGenNiche(template.niche);
    toast.success(`Template "${template.name}" selected`);
  };

  const handleGenerateScript = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a video title');
      return;
    }
    if (!geminiApiKey) {
      toast.error('Please add your Gemini API key in settings');
      return;
    }

    setIsGenerating(true);
    setGeneratedScript(''); // Clear previous script
    setGenerationTimeline([]);
    setCurrentProgress(10);
    setCurrentMessage('🎬 Starting script generation...');

    const toastId = toast.loading('Generating your script with Gemini 2.5 Flash...');

    // Estimate chunk count based on target length
    const estimateChunks = () => {
      if (targetLength <= 12000) return 2;
      if (targetLength <= 25000) return 3;
      if (targetLength <= 40000) return 4;
      if (targetLength <= 60000) return 5;
      if (targetLength <= 80000) return 7;
      return 10;
    };

    const estimatedChunks = estimateChunks();
    const progressPerChunk = 80 / estimatedChunks; // 80% divided by chunks (10% start, 10% end)

    // Fun cooking messages
    const cookingMessages = [
      '🔥 Firing up the AI engines...',
      '🧠 Teaching AI about your story...',
      '✨ Sprinkling some creative magic...',
      '📝 Writing the first lines...',
      '🎨 Crafting the narrative flow...',
      '⚡ Boosting creativity levels...',
      '🎬 Building suspense and tension...',
      '💫 Adding emotional depth...',
      '🌟 Polishing the masterpiece...',
      '🚀 Almost there, finalizing...'
    ];

    let messageIndex = 0;
    let currentChunk = 0;

    // Simulate progress updates every 8 seconds (average chunk generation time)
    const progressInterval = setInterval(() => {
      if (currentChunk < estimatedChunks) {
        currentChunk++;
        const newProgress = Math.min(10 + (currentChunk * progressPerChunk), 90);
        setCurrentProgress(Math.round(newProgress));
        setCurrentMessage(cookingMessages[Math.min(messageIndex, cookingMessages.length - 1)]);
        messageIndex++;
      }
    }, 8000); // Update every 8 seconds

    try {
      const response = await scriptAPI.generateFromTemplate({
        template: selectedTemplate,
        title: title.trim(),
        niche: genNiche.trim() || selectedTemplate.niche,
        plotDetails: plotDetails.trim() || `A ${selectedTemplate.category} story about: ${title}`,
        targetCharacters: targetLength,
        userApiKey: geminiApiKey
      });

      clearInterval(progressInterval);
      setCurrentProgress(100);
      setCurrentMessage('🎉 Script generation complete!');

      setGeneratedScript(response.script);
      setGenerationTimeline(response.timeline || []);
      toast.success(`🎉 Script generated! ${response.stats.characterCount} characters`, { id: toastId });

    } catch (error) {
      clearInterval(progressInterval);
      setCurrentProgress(0);
      setCurrentMessage('');
      console.error('Generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate script', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success('Script copied to clipboard!');
  };

  const downloadAsTextFile = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.trim() || 'script'}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Script downloaded as TXT file!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* AMAZING ANIMATED BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl -top-48 -left-48 animate-float"></div>
        <div className="absolute w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl top-1/4 -right-64 animate-float-slow"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-500/25 rounded-full blur-3xl bottom-0 left-1/3 animate-float-slower"></div>
        <div className="absolute w-[350px] h-[350px] bg-cyan-400/20 rounded-full blur-3xl top-1/2 right-1/4 animate-pulse-slow"></div>
        <div className="absolute w-[450px] h-[450px] bg-violet-600/20 rounded-full blur-3xl -bottom-32 -right-32 animate-float"></div>

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>

        {/* Animated particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-40 left-60 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-2000"></div>
        <div className="absolute top-60 right-80 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-3000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 z-10">
        {/* HEADER WITH AMAZING ANIMATION */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sparkles className="w-14 h-14 text-purple-400 animate-spin-slow" />
            <h1 className="text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              FacelessScriptPro
            </h1>
            <Sparkles className="w-14 h-14 text-pink-400 animate-spin-slow-reverse" />
          </div>
          <p className="text-2xl text-gray-300 font-medium mb-2 animate-fade-in">
            AI-Powered YouTube Script Generator
          </p>
          <p className="text-sm text-purple-300 animate-pulse-slow">
            Powered by Gemini 2.5 Flash with Template System
          </p>
        </div>

        {/* ANIMATED TAB SWITCHER */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <div className="bg-slate-800/60 backdrop-blur-2xl p-2 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-xl shadow-purple-500/50 scale-105 animate-gradient-x'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Save className={`w-6 h-6 ${activeTab === 'create' ? 'animate-bounce-slow' : ''}`} />
              Create Template
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center gap-3 ${
                activeTab === 'generate'
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white shadow-xl shadow-blue-500/50 scale-105 animate-gradient-x'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Wand2 className={`w-6 h-6 ${activeTab === 'generate' ? 'animate-bounce-slow' : ''}`} />
              Generate Script
            </button>
          </div>
        </div>

        {/* CREATE TEMPLATE TAB */}
        {activeTab === 'create' && (
          <div className="animate-slide-in-right">
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-10 border border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-500">
              <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4 animate-fade-in">
                <Film className="w-10 h-10 text-purple-400 animate-pulse-slow" />
                Create Your Template
              </h2>

              {/* Template Name */}
              <div className="mb-8 animate-fade-in delay-100">
                <label className="block text-white font-bold mb-3 text-lg">✨ Template Name *</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Horror Style, Crime Documentary Style"
                  className="w-full bg-slate-900/50 border-2 border-purple-500/40 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 hover:border-purple-500/60"
                />
              </div>

              {/* Category Selector */}
              <div className="mb-8 animate-fade-in delay-200">
                <label className="block text-white font-bold mb-5 text-2xl">🎯 Select Category *</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                  {CATEGORIES.map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 transform hover:scale-110 hover:-rotate-2 animate-fade-in-up ${
                        selectedCategory === cat.id
                          ? `bg-gradient-to-br ${cat.color} shadow-2xl scale-105 animate-pulse-glow`
                          : `bg-slate-700/50 hover:bg-slate-700 border-2 border-purple-500/30 hover:border-purple-500/60`
                      }`}
                    >
                      {/* Animated glow effect when selected */}
                      {selectedCategory === cat.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      )}

                      <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-300">{cat.emoji}</div>
                      <div className="font-bold text-white text-xl mb-3">{cat.name.replace(/^.+\s/, '')}</div>
                      <div className="text-xs text-gray-200">{cat.description}</div>

                      {selectedCategory === cat.id && (
                        <div className="absolute top-3 right-3">
                          <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche Selector */}
              {selectedCategory && (
                <div className="mb-8 animate-slide-in-up">
                  <label className="block text-white font-bold mb-5 text-2xl">🎬 Select Niche *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                    {NICHES_BY_CATEGORY[selectedCategory].map((niche, idx) => (
                      <button
                        key={niche}
                        onClick={() => {
                          setSelectedNiche(niche);
                          setCustomNiche('');
                        }}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 animate-fade-in-up ${
                          selectedNiche === niche
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/50 scale-105'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border-2 border-purple-500/30 hover:border-purple-500/60 hover:scale-105'
                        }`}
                      >
                        {niche}
                      </button>
                    ))}
                  </div>
                  <div className="animate-fade-in">
                    <label className="block text-gray-300 font-medium mb-3 text-lg">💡 Or enter custom niche:</label>
                    <input
                      type="text"
                      value={customNiche}
                      onChange={(e) => {
                        setCustomNiche(e.target.value);
                        if (e.target.value) setSelectedNiche('');
                      }}
                      placeholder="e.g., Ghost Stories, Serial Killers, etc."
                      className="w-full bg-slate-900/50 border-2 border-purple-500/40 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Example Script */}
              <div className="mb-8 animate-fade-in delay-300">
                <label className="block text-white font-bold mb-3 text-lg">📝 Example Script *</label>
                <p className="text-gray-400 text-sm mb-4">
                  Paste your best script here (500+ characters). Gemini 2.5 Flash will analyze it to create your template.
                </p>
                <textarea
                  value={exampleScript}
                  onChange={(e) => setExampleScript(e.target.value)}
                  placeholder="Paste your example script here..."
                  rows={14}
                  className="w-full bg-slate-900/50 border-2 border-purple-500/40 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none resize-none font-mono text-base transition-all duration-300"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className={`text-sm font-medium ${exampleScript.length >= 500 ? 'text-green-400' : 'text-gray-400'}`}>
                    {exampleScript.length} characters {exampleScript.length >= 500 ? '✓' : `(need ${500 - exampleScript.length} more)`}
                  </div>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateTemplate}
                disabled={isCreatingTemplate}
                className={`w-full py-6 rounded-3xl font-bold text-2xl transition-all duration-500 flex items-center justify-center gap-4 ${
                  isCreatingTemplate
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white shadow-2xl hover:shadow-purple-500/60 transform hover:scale-105 active:scale-95 animate-gradient-x'
                }`}
              >
                {isCreatingTemplate ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Template...
                  </>
                ) : (
                  <>
                    <Save className="w-8 h-8 animate-bounce-slow" />
                    Create Template with Gemini 2.5 Flash
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* GENERATE SCRIPT TAB */}
        {activeTab === 'generate' && (
          <div className="animate-slide-in-left">
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-10 border border-blue-500/30 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-500">
              <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
                <Wand2 className="w-10 h-10 text-blue-400 animate-pulse-slow" />
                Generate Script from Template
              </h2>

              {savedTemplates.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <Film className="w-24 h-24 text-gray-500 mx-auto mb-6 animate-pulse" />
                  <p className="text-xl text-gray-400 mb-4">No templates saved yet</p>
                  <p className="text-gray-500 mb-8">Create a template first to start generating scripts</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300"
                  >
                    Create Template
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Template Selection */}
                  <div className="animate-fade-in">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      📚 Your Templates ({savedTemplates.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {savedTemplates.map((template, idx) => {
                        const categoryData = CATEGORIES.find(c => c.id === template.category);
                        const isSelected = selectedTemplate?.id === template.id;
                        return (
                          <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 cursor-pointer animate-fade-in-up ${
                              isSelected
                                ? `bg-gradient-to-br ${categoryData?.color || 'from-blue-500 to-cyan-500'} shadow-2xl scale-105 border-4 border-white/20`
                                : 'bg-slate-700/50 hover:bg-slate-700 border-2 border-blue-500/30 hover:border-blue-500/60 hover:scale-105'
                            }`}
                          >
                            {/* Shimmer effect when selected */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="text-4xl">{categoryData?.emoji || '📄'}</div>
                                <div>
                                  <h4 className="text-xl font-bold text-white mb-1">{template.name}</h4>
                                  <p className="text-sm text-gray-200 capitalize">{template.category} • {template.niche}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {isSelected && (
                                  <CheckCircle className="w-8 h-8 text-green-300 animate-pulse" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTemplate(template.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg"
                                >
                                  <Trash2 className="w-5 h-5 text-red-300" />
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-300">
                              Created: {new Date(template.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generation Form (only show if template selected) */}
                  {selectedTemplate && (
                    <div className="space-y-6 animate-slide-in-up">
                      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                      {/* Niche Input (Optional) */}
                      <div className="animate-fade-in delay-100">
                        <label className="block text-white font-bold mb-3 text-lg">🎯 Niche (Optional)</label>
                        <input
                          type="text"
                          value={genNiche}
                          onChange={(e) => setGenNiche(e.target.value)}
                          placeholder={`Default: ${selectedTemplate.niche}`}
                          className="w-full bg-slate-900/50 border-2 border-blue-500/40 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        />
                        <p className="text-sm text-gray-400 mt-2">Leave empty to use template's niche: {selectedTemplate.niche}</p>
                      </div>

                      {/* Title Input */}
                      <div className="animate-fade-in delay-200">
                        <label className="block text-white font-bold mb-3 text-lg">🎬 Video Title *</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., The Haunting of Hill House: True Story"
                          className="w-full bg-slate-900/50 border-2 border-blue-500/40 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                        />
                      </div>

                      {/* Plot Details (Optional) */}
                      <div className="animate-fade-in delay-300">
                        <label className="block text-white font-bold mb-3 text-lg">📖 Plot Details (Optional)</label>
                        <textarea
                          value={plotDetails}
                          onChange={(e) => setPlotDetails(e.target.value)}
                          placeholder="Describe the main plot, key events, and story arc... (Optional)"
                          rows={6}
                          className="w-full bg-slate-900/50 border-2 border-blue-500/40 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none resize-none transition-all duration-300"
                        />
                        <p className="text-sm text-gray-400 mt-2">Leave empty for auto-generated plot based on title</p>
                      </div>

                      {/* Target Length */}
                      <div className="animate-fade-in delay-400">
                        <label className="block text-white font-bold mb-3 text-lg">📏 Target Length: {targetLength.toLocaleString()} characters</label>
                        <input
                          type="range"
                          min="10000"
                          max="100000"
                          step="5000"
                          value={targetLength}
                          onChange={(e) => setTargetLength(parseInt(e.target.value))}
                          className="w-full h-3 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                          <span>10K (short)</span>
                          <span>55K (medium)</span>
                          <span>100K (long)</span>
                        </div>
                      </div>

                      {/* Generate Button */}
                      <button
                        onClick={handleGenerateScript}
                        disabled={isGenerating}
                        className={`w-full py-6 rounded-3xl font-bold text-2xl transition-all duration-500 flex items-center justify-center gap-4 ${
                          isGenerating
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white shadow-2xl hover:shadow-blue-500/60 transform hover:scale-105 active:scale-95 animate-gradient-x'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating Script...
                          </>
                        ) : (
                          <>
                            <Play className="w-8 h-8 animate-bounce-slow" />
                            Generate Script with Gemini 2.5 Flash
                          </>
                        )}
                      </button>

                      {/* LIVE Progress Bar (shown during generation OR after completion) */}
                      {(isGenerating || generationTimeline.length > 0) && (
                        <div className="mt-8 animate-slide-in-up space-y-4">
                          {/* Animated Progress Card */}
                          <div className="bg-gradient-to-br from-slate-800/60 via-purple-900/40 to-slate-800/60 backdrop-blur-xl rounded-3xl border-2 border-cyan-400/40 p-8 shadow-2xl shadow-cyan-500/20">
                            {/* Progress Header */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-white font-black text-2xl flex items-center gap-3">
                                <span className="text-3xl animate-bounce">🍳</span>
                                Cooking Your Script
                              </span>
                              <span className="text-cyan-400 font-black text-4xl tabular-nums">
                                {isGenerating ? currentProgress : (generationTimeline[generationTimeline.length - 1]?.progress || 100)}%
                              </span>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="relative w-full h-8 bg-slate-900/70 rounded-full overflow-hidden border-2 border-slate-700/50 shadow-inner">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out rounded-full shadow-lg"
                                style={{ width: `${isGenerating ? currentProgress : (generationTimeline[generationTimeline.length - 1]?.progress || 100)}%` }}
                              >
                                {/* Animated shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                {/* Pulsing glow */}
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>

                            {/* Animated Message */}
                            <div className="mt-4 text-center">
                              <div className="text-lg font-bold text-white animate-pulse bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                                {isGenerating ? currentMessage : (generationTimeline[generationTimeline.length - 1]?.event || '✅ Complete!')}
                              </div>
                              {!isGenerating && generationTimeline.length > 0 && (
                                <div className="text-sm text-gray-300 mt-2">
                                  {generationTimeline[generationTimeline.length - 1]?.details}
                                </div>
                              )}
                            </div>

                            {/* Fun animated dots while generating */}
                            {isGenerating && (
                              <div className="flex justify-center gap-2 mt-4">
                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                              </div>
                            )}
                          </div>

                          {/* Timeline Details (Collapsible) */}
                          <details className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden">
                            <summary className="cursor-pointer p-4 font-bold text-white hover:bg-slate-700/30 transition-all flex items-center gap-3">
                              <span className="text-2xl">📊</span>
                              <span className="text-lg">Detailed Timeline</span>
                              <span className="text-sm text-cyan-400 ml-auto">Click to expand</span>
                            </summary>
                            <div className="p-6 space-y-3 bg-slate-900/30">
                              {generationTimeline.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                                >
                                  <span className="text-cyan-400 font-mono text-sm font-bold min-w-[80px]">
                                    {item.timestamp}
                                  </span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-semibold">{item.event}</span>
                                      {item.progress !== null && item.progress !== undefined && (
                                        <span className="text-cyan-400 text-xs font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">
                                          {item.progress}%
                                        </span>
                                      )}
                                    </div>
                                    {item.details && (
                                      <div className="text-gray-400 text-sm mt-1">{item.details}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* Generated Script Output */}
                      {generatedScript && (
                        <div className="mt-8 animate-slide-in-up">
                          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                            <h3 className="text-2xl font-bold text-white">✨ Your Generated Script</h3>
                            <div className="flex gap-3">
                              <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
                              >
                                <Copy className="w-5 h-5" />
                                Copy
                              </button>
                              <button
                                onClick={downloadAsTextFile}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
                              >
                                <Download className="w-5 h-5" />
                                Download TXT
                              </button>
                            </div>
                          </div>
                          <div className="bg-slate-900/50 border-2 border-green-500/40 rounded-2xl p-6 max-h-96 overflow-y-auto">
                            <pre className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                              {generatedScript}
                            </pre>
                          </div>
                          <div className="mt-4 text-center text-sm text-gray-400">
                            {generatedScript.length.toLocaleString()} characters • {Math.round(generatedScript.length / 5).toLocaleString()} words
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -40px) scale(1.1); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(40px, -20px) rotate(10deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 25s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 30s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 8s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-2000 { animation-delay: 2000ms; }
        .delay-3000 { animation-delay: 3000ms; }
      `}</style>
    </div>
  );
}
