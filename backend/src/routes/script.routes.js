const express = require('express');
const router = express.Router();
const { analyzeScript, generatePlot } = require('../services/deepseek.service');
const { generateScript } = require('../services/gemini.service');
const { analyzeTemplate } = require('../services/template.service');

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
 * POST /api/create-template
 * Creates a template from example script using Gemini 2.5 Flash
 */
router.post('/create-template', async (req, res) => {
  try {
    const { templateName, category, niche, exampleScript, userApiKey } = req.body;

    // Validation
    if (!templateName || !templateName.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Template name is required'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }

    if (!niche || !niche.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Niche is required'
      });
    }

    if (!exampleScript || exampleScript.length < 500) {
      return res.status(400).json({
        success: false,
        error: 'Example script must be at least 500 characters long'
      });
    }

    if (!userApiKey) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API key is required'
      });
    }

    console.log(`\n📥 Template creation request: "${templateName}"`);
    console.log(`   Category: ${category}`);
    console.log(`   Niche: ${niche}`);
    console.log(`   Script length: ${exampleScript.length} characters`);

    const result = await analyzeTemplate({
      exampleScript,
      category,
      niche,
      userApiKey
    });

    // In a real app, save to database here
    // For now, return the template data
    const template = {
      id: Date.now().toString(),
      name: templateName.trim(),
      category: result.category,
      niche: result.niche,
      styleProfile: result.styleProfile,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Template creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/generate-from-template
 * Generates a script from a saved template
 */
router.post('/generate-from-template', async (req, res) => {
  try {
    const { templateId, template, title, plotDetails, targetCharacters, userApiKey } = req.body;

    // Validation
    if (!template && !templateId) {
      return res.status(400).json({
        success: false,
        error: 'Template or templateId is required'
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Video title is required'
      });
    }

    if (!plotDetails || !plotDetails.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Plot details are required'
      });
    }

    if (!userApiKey) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API key is required'
      });
    }

    // In a real app, fetch template from database by templateId
    // For now, use the template passed from frontend
    const templateData = template; // || await getTemplateById(templateId);

    if (!templateData) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    console.log(`\n📥 Script generation from template: "${templateData.name}"`);
    console.log(`   Title: "${title}"`);
    console.log(`   Category: ${templateData.category}`);
    console.log(`   Niche: ${templateData.niche}`);
    console.log(`   Target: ${targetCharacters || 30000} characters`);

    const result = await generateScript({
      styleProfile: templateData.styleProfile,
      category: templateData.category,
      niche: templateData.niche,
      title: title.trim(),
      plotDetails: plotDetails.trim(),
      targetCharacters: targetCharacters || 30000,
      userApiKey
    });

    res.json({
      success: true,
      script: result.script,
      stats: result.stats
    });

  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/templates
 * Gets user's saved templates (placeholder)
 */
router.get('/templates', async (req, res) => {
  try {
    // In a real app, fetch from database
    // For now, return empty array
    res.json({
      success: true,
      templates: []
    });
  } catch (error) {
    console.error('Get templates error:', error);
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
      createTemplate: 'POST /api/create-template',
      generateFromTemplate: 'POST /api/generate-from-template',
      getTemplates: 'GET /api/templates',
      health: 'GET /health'
    }
  });
});

module.exports = router;
