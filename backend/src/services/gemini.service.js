const axios = require('axios');

/**
 * Determines the optimal chunk configuration based on target length
 * OPTIMIZED FOR GEMINI 2.5 FLASH FREE TIER LIMITS:
 * - Max output tokens: 8192 tokens (~32K characters per request)
 * - Rate limits: 15 requests/minute, 1500 requests/day
 * - Strategy: Smart chunking with context passing for coherence
 *
 * @param {number} targetLength - Target character count
 * @returns {Object} Chunk configuration
 */
function getChunkConfig(targetLength) {
  // Chunk planning: balance between API efficiency and output quality

  if (targetLength <= 10000) {
    // Very short scripts - 2 chunks for safety
    return { chunks: 2, charsPerChunk: 6000, buffer: 2000 };
  }
  if (targetLength <= 30000) {
    // Medium scripts - 2 chunks (each ~15K, well under 32K limit)
    return { chunks: 2, charsPerChunk: 15000, buffer: 5000 };
  }
  if (targetLength <= 60000) {
    // Long scripts - 3 chunks (each ~20K, safe zone)
    return { chunks: 3, charsPerChunk: 20000, buffer: 10000 };
  }
  if (targetLength <= 70000) {
    // Very long scripts - 3 chunks (each ~25K, still safe)
    return { chunks: 3, charsPerChunk: 25000, buffer: 15000 };
  }
  // Extremely long scripts - 3 chunks max (each ~35K, near limit but safe)
  // Note: 35K chars ≈ 7K tokens, leaves headroom under 8192 token limit
  return { chunks: 3, charsPerChunk: 35000, buffer: 20000 };
}

/**
 * Extracts the last portion of text for context continuity
 * OPTIMIZED: Keep context short to save input tokens for Gemini free tier
 * @param {string} previousChunk - The previous chunk text
 * @returns {string} Context snippet for next chunk
 */
function extractTailContext(previousChunk) {
  // Extract last 5-6 sentences or ~300 characters max (save input tokens)
  const sentences = previousChunk
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0);

  const lastSentences = sentences
    .slice(-6)
    .join('. ') + '.';

  // Limit to ~300 chars to save input tokens for free tier
  return lastSentences.length > 300
    ? '...' + lastSentences.slice(-300)
    : lastSentences;
}

/**
 * Gets category-specific hook instructions
 * @param {string} category - Category type
 * @returns {string} Hook instructions for the category
 */
function getCategoryHookInstructions(category) {
  const hookMap = {
    emotional: 'Start with a DEEP EMOTIONAL HOOK that triggers empathy, sadness, or inspiration. Make the audience FEEL something immediately.',
    horror: 'Start with a CREEPY, UNSETTLING HOOK that creates curiosity about danger or the unknown. Build dread from the first line.',
    mystery: 'Start with a BIG QUESTION, strange detail, or unsolved event. Create immediate curiosity that demands answers.',
    adventure: 'Start with a sense of JOURNEY, RISK, or entering a new world. Make the audience feel the thrill of discovery.',
    educational: 'Start with a SHOCKING FACT, surprising lesson, or mind-blowing statistic. Challenge what the audience thinks they know.'
  };

  return hookMap[category.toLowerCase()] || hookMap.educational;
}

/**
 * Generates a script using Gemini 2.5 Flash with intelligent chunking
 * NOW WITH CATEGORY + NICHE AWARENESS
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Generated script and stats
 */
async function generateScript({
  styleProfile,
  category,
  niche,
  title,
  plotDetails,
  targetCharacters,
  userApiKey
}) {
  try {
    if (!userApiKey) {
      throw new Error('Gemini API key is required. Please add your API key in Settings.');
    }

    const config = getChunkConfig(targetCharacters);
    const chunks = [];

    console.log(`🎬 Generating ${category} / ${niche} script in ${config.chunks} chunk(s)...`);
    console.log(`📊 Target: ${targetCharacters} characters (${Math.round(targetCharacters / 5)} words)`);

    // Get category-specific hook instructions
    const hookInstructions = getCategoryHookInstructions(category);

    const startTime = Date.now();

    for (let i = 0; i < config.chunks; i++) {
      const partNum = i + 1;
      let prompt = '';

      if (i === 0) {
        // FIRST CHUNK: Category-aware with style profile
        prompt = `Write PART ${partNum}/${config.chunks} of a long YouTube narration script.

CATEGORY: ${category.toUpperCase()}
NICHE: ${niche}

YOUTUBE STYLE PROFILE:
${styleProfile}

SCRIPT DETAILS:
Title: ${title}
Plot: ${plotDetails}

TASK (Part ${partNum}/${config.chunks}, ${config.charsPerChunk} chars):
${config.chunks === 1
  ? `Write the COMPLETE script from beginning to end.`
  : `Write the OPENING section.`}

RULES FOR ${category.toUpperCase()} CATEGORY:
${hookInstructions}

Use short, spoken-style sentences.
Add suspense/curiosity every few lines.
Mix visual description with emotional reactions.
No rambling; every line should move the story or teach something.
Use cliffhangers or teaser lines to keep viewers watching.
Sound like a narrator talking to the audience.

LENGTH: ${config.charsPerChunk}±${Math.floor(config.buffer/2)} characters.

Output only the narration text (no headings, no meta-text).`;

      } else {
        // CONTINUATION CHUNKS: Category-aware with context
        const previousContext = extractTailContext(chunks[i - 1]);

        prompt = `Continue ${category} / ${niche} YouTube script. Previous part ended:
"${previousContext}"

CATEGORY: ${category.toUpperCase()}
NICHE: ${niche}

TASK (Part ${partNum}/${config.chunks}, ${config.charsPerChunk} chars):
${partNum === config.chunks
  ? `This is the FINAL part. Build to climax, resolve conflict, provide satisfying ${category} conclusion.`
  : `This is a MIDDLE section. Continue building tension, develop story, natural transition.`}

RULES:
Continue DIRECTLY where previous part ended (no gap, no repetition).
Maintain SAME ${category} tone and style.
NO meta phrases like "meanwhile" or "as we saw".
${config.charsPerChunk}±${Math.floor(config.buffer/2)} characters.
Output only narration text.`;
      }

      console.log(`📝 Generating part ${partNum}/${config.chunks}...`);

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${userApiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            candidateCount: 1
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 2 minutes timeout per chunk
        }
      );

      if (!response.data.candidates || response.data.candidates.length === 0) {
        throw new Error('No content generated by Gemini. Please try again.');
      }

      const chunkText = response.data.candidates[0].content.parts[0].text;
      chunks.push(chunkText);

      console.log(`✅ Part ${partNum} complete (${chunkText.length} characters)`);

      // Delay between chunks to avoid rate limiting (free tier: 15 RPM)
      if (i < config.chunks - 1) {
        const delaySeconds = 5; // 5 seconds = safe for free tier
        console.log(`⏳ Waiting ${delaySeconds}s before next part (rate limit protection)...`);
        await new Promise(r => setTimeout(r, delaySeconds * 1000));
      }
    }

    // Combine all chunks with seamless joining
    const finalScript = chunks.join('\n\n');

    const endTime = Date.now();
    const generationTime = Math.round((endTime - startTime) / 1000);

    console.log(`🎉 Script generation complete!`);
    console.log(`📏 Final length: ${finalScript.length} characters`);
    console.log(`⏱️  Generation time: ${generationTime} seconds`);

    return {
      script: finalScript,
      stats: {
        characterCount: finalScript.length,
        wordCount: Math.round(finalScript.length / 5),
        chunkCount: chunks.length,
        generationTimeSeconds: generationTime
      }
    };

  } catch (error) {
    console.error('❌ Gemini Generation Error:', error.message);

    if (error.response) {
      console.error('Response error:', error.response.data);
      const errorMsg = error.response.data.error?.message || error.message;
      throw new Error(`Gemini API error: ${errorMsg}`);
    }

    throw new Error(`Script generation failed: ${error.message}`);
  }
}

module.exports = { generateScript };
