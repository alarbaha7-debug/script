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
  "master_prompt": "A comprehensive 500-1000 word prompt that incorporates ALL the analysis above. This prompt will be used to generate the new script. Include specific instructions about: How to open the script (hook style), Tone and pacing to maintain, Sentence structure patterns, How to build tension/interest, Narrative techniques to use, How to close the script, Any unique stylistic elements from the example. Make this prompt extremely detailed and actionable for generating a ${niche} script about '${title}'."
}

CRITICAL RULES FOR JSON:
1. Return ONLY valid JSON - no markdown, no code blocks, no extra text
2. All string values must escape special characters (newlines as \\n, tabs as \\t, quotes as \\")
3. Do NOT include literal line breaks inside string values - use \\n instead
4. Do NOT include control characters (tabs, carriage returns) - use \\t and \\r
5. Make sure all quotes inside strings are escaped with backslash`;

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

    // Step 1: Remove problematic control characters
    // These are characters that shouldn't appear in JSON at all
    cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Step 2: Try to parse
    let analysis;
    try {
      analysis = JSON.parse(cleaned);
      console.log('✅ JSON parsed successfully on first attempt');
    } catch (parseError) {
      console.log('⚠️ First parse attempt failed. Error:', parseError.message);
      console.log('Attempting to repair JSON...');

      // Advanced JSON repair strategy
      try {
        // Save the original for comparison
        const beforeRepair = cleaned;

        // Strategy: Find and fix unescaped characters inside string values
        // This regex-based approach looks for patterns like: "key": "value with\nnewline"
        // and fixes them to: "key": "value with\\nnewline"

        let inString = false;
        let escaped = false;
        let repaired = '';

        for (let i = 0; i < cleaned.length; i++) {
          const char = cleaned[i];
          const prevChar = i > 0 ? cleaned[i - 1] : '';

          // Track if we're inside a string value
          if (char === '"' && !escaped) {
            inString = !inString;
            repaired += char;
          }
          // If we're in a string and find a newline/tab/carriage return, escape it
          else if (inString && !escaped) {
            if (char === '\n') {
              repaired += '\\n';
            } else if (char === '\r') {
              repaired += '\\r';
            } else if (char === '\t') {
              repaired += '\\t';
            } else if (char === '\\') {
              repaired += char;
              escaped = true;
            } else {
              repaired += char;
            }
          } else {
            repaired += char;
            escaped = false;
          }

          // Handle escape sequences
          if (char === '\\' && !escaped) {
            escaped = true;
          } else if (escaped && char !== '\\') {
            escaped = false;
          }
        }

        cleaned = repaired;
        analysis = JSON.parse(cleaned);
        console.log('✅ JSON repaired and parsed successfully');

      } catch (secondError) {
        console.error('❌ JSON repair failed:', secondError.message);
        console.error('Problematic JSON snippet:', cleaned.substring(0, 500));
        throw new Error('Failed to parse analysis response. The AI returned malformed JSON. Please try again.');
      }
    }

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

/**
 * Generates plot details based on title and niche
 * @param {Object} params - Generation parameters
 * @param {string} params.title - The video title
 * @param {string} params.niche - The niche category
 * @param {string} params.styleType - The style type
 * @returns {Promise<string>} Generated plot details
 */
async function generatePlot({ title, niche, styleType }) {
  try {
    const prompt = `You are an expert content creator for ${styleType} videos.

Given this video title: "${title}"
For the niche: ${niche}

Generate a compelling and detailed plot outline for this video. The plot should be engaging, well-structured, and suitable for a faceless YouTube video.

Your plot should include:
1. Opening hook/introduction
2. Main storyline or key points
3. Rising action and key events
4. Climax or main revelation
5. Conclusion or takeaway

Write a comprehensive plot description (200-400 words) that a script writer can use to create the full script. Be creative and make it captivating for the ${niche} audience.

Return ONLY the plot description, no additional formatting or explanations.`;

    console.log('🎬 Generating plot details with DeepSeek R1...');

    const response = await axios.post(
      DEEPSEEK_URL,
      {
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert content creator who writes compelling plot outlines for YouTube videos. Always provide detailed, engaging plots.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://facelessscriptpro.com',
          'X-Title': 'FacelessScriptPro'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    const plotText = response.data.choices[0].message.content.trim();

    console.log('✅ Plot generation complete!');

    return plotText;

  } catch (error) {
    console.error('❌ DeepSeek Plot Generation Error:', error.message);

    if (error.response) {
      console.error('Response error:', error.response.data);
      throw new Error(`DeepSeek API error: ${error.response.data.error?.message || error.message}`);
    }

    throw new Error(`Plot generation failed: ${error.message}`);
  }
}

module.exports = { analyzeScript, generatePlot };
