const express = require('express');
const router = express.Router();
const { generateScript } = require('../services/gemini.service');
const { analyzeTemplate } = require('../services/template.service');

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
    const { templateId, template, title, niche, plotDetails, targetCharacters, userApiKey } = req.body;

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

    // Use provided niche or fallback to template's niche
    const finalNiche = niche && niche.trim() ? niche.trim() : templateData.niche;

    // Use provided plot or auto-generate from title
    const finalPlot = plotDetails && plotDetails.trim()
      ? plotDetails.trim()
      : `A ${templateData.category} story about: ${title}`;

    console.log(`\n📥 Script generation from template: "${templateData.name}"`);
    console.log(`   Title: "${title}"`);
    console.log(`   Category: ${templateData.category}`);
    console.log(`   Niche: ${finalNiche}`);
    console.log(`   Target: ${targetCharacters || 30000} characters`);

    const result = await generateScript({
      styleProfile: templateData.styleProfile,
      category: templateData.category,
      niche: finalNiche,
      title: title.trim(),
      plotDetails: finalPlot,
      targetCharacters: targetCharacters || 30000,
      userApiKey
    });

    res.json({
      success: true,
      script: result.script,
      stats: result.stats,
      timeline: result.timeline
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
      createTemplate: 'POST /api/create-template',
      generateFromTemplate: 'POST /api/generate-from-template',
      getTemplates: 'GET /api/templates',
      health: 'GET /health'
    }
  });
});

module.exports = router;
