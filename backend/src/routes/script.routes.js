const express = require('express');
const router = express.Router();
const { analyzeScript, generatePlot } = require('../services/deepseek.service');
const { generateScript } = require('../services/gemini.service');

/**
 * POST /api/analyze-script
 * Analyzes a script example using DeepSeek R1
 */
router.post('/analyze-script', async (req, res) => {
  try {
    const { scriptExample, niche, styleType, title, plotDetails } = req.body;

    // Validation
    if (!scriptExample || scriptExample.length < 500) {
      return res.status(400).json({
        success: false,
        error: 'Script example must be at least 500 characters long'
      });
    }

    if (!niche || !styleType || !title || !plotDetails) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: niche, styleType, title, or plotDetails'
      });
    }

    console.log(`\n📥 Analysis request received for: "${title}"`);
    console.log(`   Niche: ${niche}`);
    console.log(`   Style: ${styleType}`);

    const analysis = await analyzeScript({
      scriptExample,
      niche,
      styleType,
      title,
      plotDetails
    });

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Analysis route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/generate-plot
 * Generates plot details based on title and niche
 */
router.post('/generate-plot', async (req, res) => {
  try {
    const { title, niche, styleType } = req.body;

    // Validation
    if (!title || !niche || !styleType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, niche, or styleType'
      });
    }

    console.log(`\n🎬 Plot generation request for: "${title}"`);
    console.log(`   Niche: ${niche}`);

    const plot = await generatePlot({
      title,
      niche,
      styleType
    });

    res.json({
      success: true,
      plot
    });

  } catch (error) {
    console.error('Plot generation route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/generate-script
 * Generates a script using Gemini 2.5 Flash with chunking
 */
router.post('/generate-script', async (req, res) => {
  try {
    const {
      analysis,
      title,
      niche,
      styleType,
      plotDetails,
      extraInstructions,
      targetCharacters,
      geminiApiKey
    } = req.body;

    // Validation
    if (!analysis || !analysis.master_prompt) {
      return res.status(400).json({
        success: false,
        error: 'Valid analysis object with master_prompt is required'
      });
    }

    if (!title || !niche || !styleType || !plotDetails) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, niche, styleType, or plotDetails'
      });
    }

    if (!targetCharacters || targetCharacters < 1000) {
      return res.status(400).json({
        success: false,
        error: 'Target characters must be at least 1000'
      });
    }

    // Use provided API key or test key from environment
    const userApiKey = geminiApiKey || process.env.TEST_GEMINI_KEY;

    if (!userApiKey) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API key is required. Please provide your API key.'
      });
    }

    console.log(`\n📥 Generation request received for: "${title}"`);
    console.log(`   Target: ${targetCharacters} characters`);

    const result = await generateScript({
      analysis,
      title,
      niche,
      styleType,
      plotDetails,
      extraInstructions,
      targetCharacters,
      userApiKey
    });

    res.json({
      success: true,
      script: result.script,
      stats: result.stats
    });

  } catch (error) {
    console.error('Generation route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/test
 * Simple test endpoint
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'FacelessScriptPro API is working!',
    endpoints: {
      analyze: 'POST /api/analyze-script',
      generatePlot: 'POST /api/generate-plot',
      generate: 'POST /api/generate-script',
      health: 'GET /health'
    }
  });
});

module.exports = router;
