const axios = require('axios');

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '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';
const DEEPSEEK_URL = process.env.DEEPSEEK_URL || 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek/deepseek-r1:free';

/**
 * Analyzes a script example and generates a master prompt
 * @param {Object} params - Analysis parameters
 * @param {string} params.scriptExample - The example script to analyze
 * @param {string} params.niche - The niche category
 * @param {string} params.styleType - The style type
 * @param {string} params.title - The new script title
 * @param {string} params.plotDetails - Plot details for the new script
 * @returns {Promise<Object>} Analysis result with master prompt
 */
async function analyzeScript({ scriptExample, niche, styleType, title, plotDetails }) {
  try {
    const prompt = `You are an expert script analyst for ${styleType} content.

SCRIPT EXAMPLE TO ANALYZE:
${scriptExample}

NEW SCRIPT DETAILS:
- Title: ${title}
- Niche: ${niche}
- Style Type: ${styleType}
- Plot: ${plotDetails}

Your task is to analyze the script example and extract key patterns that will be used to generate a new script.

Analyze this script deeply and return a JSON object with the following structure:
{
  "hook_analysis": {
    "type": "question/statement/story/statistic",
    "emotional_trigger": "curiosity/fear/excitement/surprise",
    "opening_style": "describe the opening technique",
    "example": "quote the actual hook from the example"
  },
  "writing_style": {
    "tone": "casual/formal/dramatic/mysterious",
    "pacing": "fast/moderate/slow",
    "avg_sentence_length": 15,
    "vocabulary_level": "simple/intermediate/advanced",
    "perspective": "first-person/second-person/third-person",
    "tense": "past/present/future"
  },
  "structure_patterns": {
    "uses_subheadings": true/false,
    "paragraph_length": "short/medium/long",
    "transition_style": "describe how sections connect",
    "buildup_technique": "describe how tension/interest builds"
  },
  "narrative_elements": {
    "storytelling_approach": "chronological/flashback/nonlinear",
    "character_development": "describe if/how characters are portrayed",
    "dialogue_usage": "heavy/moderate/minimal/none",
    "sensory_details": "heavy/moderate/minimal"
  },
  "engagement_techniques": {
    "cliffhangers": "describe usage",
    "questions_to_audience": "heavy/moderate/minimal",
    "call_to_action_style": "describe style",
    "emotional_peaks": "describe when and how emotions peak"
  },
  "master_prompt": "A comprehensive 500-1000 word prompt that incorporates ALL the analysis above. This prompt will be used to generate the new script. Include specific instructions about:\n- How to open the script (hook style)\n- Tone and pacing to maintain\n- Sentence structure patterns\n- How to build tension/interest\n- Narrative techniques to use\n- How to close the script\n- Any unique stylistic elements from the example\n\nMake this prompt extremely detailed and actionable for generating a ${niche} script about '${title}'."
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, just pure JSON.`;

    console.log('🔍 Analyzing script with DeepSeek R1...');

    const response = await axios.post(
      DEEPSEEK_URL,
      {
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert script analyst. You analyze scripts and extract patterns to help generate new, similar content. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://facelessscriptpro.com',
          'X-Title': 'FacelessScriptPro'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    const analysisText = response.data.choices[0].message.content;

    console.log('📝 Raw analysis received:', analysisText.substring(0, 200) + '...');

    // Clean the response - remove markdown code blocks if present
    let cleaned = analysisText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Find JSON object boundaries
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    // Parse JSON
    const analysis = JSON.parse(cleaned);

    console.log('✅ Analysis complete!');

    return analysis;

  } catch (error) {
    console.error('❌ DeepSeek Analysis Error:', error.message);

    if (error.response) {
      console.error('Response error:', error.response.data);
      throw new Error(`DeepSeek API error: ${error.response.data.error?.message || error.message}`);
    } else if (error.name === 'SyntaxError') {
      console.error('JSON parsing failed');
      throw new Error('Failed to parse analysis response. Please try again.');
    }

    throw new Error(`Analysis failed: ${error.message}`);
  }
}

module.exports = { analyzeScript };
