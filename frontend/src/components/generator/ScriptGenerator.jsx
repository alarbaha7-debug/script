import React, { useState } from 'react';
import { scriptAPI } from '../../services/api';
import { NICHES, TARGET_LENGTHS, CATEGORIES, NICHES_BY_CATEGORY } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ScriptGenerator() {
  const { geminiApiKey } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    niche: '',
    styleType: '',
    scriptExample: '',
    plotDetails: '',
    extraInstructions: '',
    targetCharacters: 30000
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPlot, setIsGeneratingPlot] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [finalScript, setFinalScript] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleNicheSelect = (niche) => {
    setFormData({
      ...formData,
      niche: niche.name,
      styleType: niche.styleType
    });
  };

  const handleAutoGeneratePlot = async () => {
    // Validation
    if (!formData.title) {
      toast.error('Please enter a video title first');
      return;
    }

    if (!formData.niche) {
      toast.error('Please select a niche first');
      return;
    }

    setIsGeneratingPlot(true);

    try {
      toast.loading('Generating plot details...', { id: 'plot-gen' });

      const plotRes = await scriptAPI.generatePlot({
        title: formData.title,
        niche: formData.niche,
        styleType: formData.styleType
      });

      setFormData({
        ...formData,
        plotDetails: plotRes.plot
      });

      toast.success('Plot details generated!', { id: 'plot-gen' });

    } catch (error) {
      console.error('Plot generation error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to generate plot', { id: 'plot-gen' });
    } finally {
      setIsGeneratingPlot(false);
    }
  };

  const handleGenerate = async () => {
    // Validation
    if (!formData.title) {
      toast.error('Please enter a script title');
      return;
    }

    if (!formData.niche) {
      toast.error('Please select a niche');
      return;
    }

    if (!formData.scriptExample || formData.scriptExample.length < 500) {
      toast.error('Script example must be at least 500 characters');
      return;
    }

    if (!formData.plotDetails) {
      toast.error('Please describe your plot');
      return;
    }

    if (!geminiApiKey) {
      toast.error('Please add your Gemini API key in the settings below');
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setStatusMessage('Analyzing your script example...');
    setFinalScript(null);

    try {
      // STEP 1: Analyze with DeepSeek
      setProgress(20);
      const analysisRes = await scriptAPI.analyzeScript({
        scriptExample: formData.scriptExample,
        niche: formData.niche,
        styleType: formData.styleType,
        title: formData.title,
        plotDetails: formData.plotDetails
      });

      setAnalysis(analysisRes.analysis);
      setProgress(40);
      setStatusMessage('Analysis complete! Generating your script...');

      toast.success('Script analysis complete!');

      // STEP 2: Generate with Gemini
      const generateRes = await scriptAPI.generateScript({
        analysis: analysisRes.analysis,
        title: formData.title,
        niche: formData.niche,
        styleType: formData.styleType,
        plotDetails: formData.plotDetails,
        extraInstructions: formData.extraInstructions,
        targetCharacters: formData.targetCharacters,
        geminiApiKey: geminiApiKey
      });

      setProgress(100);
      setStatusMessage('Complete!');
      setFinalScript(generateRes.script);

      toast.success(`Script generated! ${generateRes.stats.characterCount} characters`);

      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to generate script');
      setStatusMessage('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([finalScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/[^a-z0-9]/gi, '_')}_script.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Script downloaded!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalScript);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Script Generator</h1>
        <p className="text-gray-600">Create high-quality scripts for faceless YouTube videos</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Script Title *
          </label>
          <input
            type="text"
            placeholder="e.g., The Mystery of the Bermuda Triangle"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Category *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Niche Selector */}
        {selectedCategory && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Niche *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {NICHES_BY_CATEGORY[selectedCategory].map(niche => (
                <button
                  key={niche.id}
                  onClick={() => handleNicheSelect(niche)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.niche === niche.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{niche.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{niche.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{niche.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auto-Generate Plot Section */}
        {formData.niche && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    🎬 Auto-Generate Plot
                  </h3>
                  <p className="text-sm text-gray-600">
                    Let AI create a detailed plot outline based on your title and niche
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoGeneratePlot}
                disabled={isGeneratingPlot || !formData.title || !formData.niche}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-base font-bold transition-all ${
                  isGeneratingPlot || !formData.title || !formData.niche
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isGeneratingPlot ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Plot with AI...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Plot Automatically
                  </>
                )}
              </button>

              {!formData.title || !formData.niche ? (
                <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  💡 Enter a title and select a niche above to enable auto-generation
                </div>
              ) : (
                <div className="mt-3 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg p-3">
                  ✨ Ready! Click to generate a plot for: <strong>{formData.title}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Script Example */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Script Example * (min 500 characters)
          </label>
          <textarea
            placeholder="Paste an example script that matches the style you want. The AI will analyze its writing patterns..."
            value={formData.scriptExample}
            onChange={e => setFormData({ ...formData, scriptExample: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 font-mono text-sm"
          />
          <div className="text-sm text-gray-500 mt-1">
            {formData.scriptExample.length} / 500 characters minimum
          </div>
        </div>

        {/* Plot Details */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Plot Details *
          </label>
          <textarea
            placeholder="Your plot will appear here after clicking 'Generate Plot Automatically' above, or you can write your own plot manually..."
            value={formData.plotDetails}
            onChange={e => setFormData({ ...formData, plotDetails: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
          />
        </div>

        {/* Extra Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Instructions (Optional)
          </label>
          <textarea
            placeholder="Any specific requirements or stylistic preferences..."
            value={formData.extraInstructions}
            onChange={e => setFormData({ ...formData, extraInstructions: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          />
        </div>

        {/* Target Length */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target Script Length *
          </label>
          <select
            value={formData.targetCharacters}
            onChange={e => setFormData({ ...formData, targetCharacters: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TARGET_LENGTHS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.recommended}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? 'Generating...' : '🚀 Generate Script'}
        </button>
      </div>

      {/* Progress Indicator */}
      {isGenerating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">{statusMessage}</span>
              <span className="text-sm font-semibold text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            This may take a few moments. Please don't close this page.
          </p>
        </div>
      )}

      {/* Result */}
      {finalScript && (
        <div id="result-section" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Script Generated!</h2>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto border border-gray-200">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {finalScript}
            </pre>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Script
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
