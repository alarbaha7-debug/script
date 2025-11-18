const axios = require('axios');

/**
 * Determines the optimal chunk configuration based on target length
 * @param {number} targetLength - Target character count
 * @returns {Object} Chunk configuration
 */
function getChunkConfig(targetLength) {
  if (targetLength <= 15000) {
    return { chunks: 1, charsPerChunk: targetLength };
  }
  if (targetLength <= 45000) {
    return { chunks: 3, charsPerChunk: Math.ceil(targetLength / 3) };
  }
  if (targetLength <= 75000) {
    return { chunks: 5, charsPerChunk: Math.ceil(targetLength / 5) };
  }
  // For very long scripts
  return { chunks: 8, charsPerChunk: Math.ceil(targetLength / 8) };
}

/**
 * Generates a script using Gemini 2.5 Flash with intelligent chunking
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Generated script and stats
 */
async function generateScript({
  analysis,
  title,
  niche,
  styleType,
  plotDetails,
  extraInstructions,
  targetCharacters,
  userApiKey
}) {
  try {
    if (!userApiKey) {
      throw new Error('Gemini API key is required. Please add your API key in Settings.');
    }

    const config = getChunkConfig(targetCharacters);
    const chunks = [];
    const masterPrompt = analysis.master_prompt;

    console.log(`🎬 Generating script in ${config.chunks} chunk(s)...`);
    console.log(`📊 Target: ${targetCharacters} characters (${Math.round(targetCharacters / 5)} words)`);

    const startTime = Date.now();

    for (let i = 0; i < config.chunks; i++) {
      const chunkNum = i + 1;
      let prompt = '';

      if (i === 0) {
        // First chunk: Use full master prompt
        prompt = `${masterPrompt}

SCRIPT DETAILS:
- Title: ${title}
- Niche: ${niche}
- Style: ${styleType}
- Plot: ${plotDetails}
${extraInstructions ? `- Additional Instructions: ${extraInstructions}` : ''}

CHUNKING INSTRUCTIONS:
This is chunk ${chunkNum} of ${config.chunks}.
Target length for THIS chunk: ${config.charsPerChunk} characters.

${config.chunks === 1 ? 'Write the COMPLETE script from beginning to end.' : 'Write the OPENING section of the script. This should include:\n- A powerful hook following the analyzed pattern\n- The setup and introduction\n- Build initial tension/interest\n- End at a natural transition point that flows into the next section'}

IMPORTANT:
- Follow the writing style patterns from the analysis exactly
- Match the tone, pacing, and structure
- Aim for approximately ${config.charsPerChunk} characters
- Make it engaging and true to the ${styleType} style`;

      } else {
        // Subsequent chunks: Provide context and continuation instructions
        const previousChunk = chunks[i - 1];
        const lastSentences = previousChunk
          .split(/[.!?]/)
          .filter(s => s.trim().length > 0)
          .slice(-8)
          .join('. ') + '.';

        prompt = `Continue this ${styleType} script seamlessly. Maintain the exact same tone, style, and pacing.

PREVIOUS SECTION ENDED WITH:
"${lastSentences}"

CONTINUATION INSTRUCTIONS:
This is chunk ${chunkNum} of ${config.chunks}.
Target length for THIS chunk: ${config.charsPerChunk} characters.

${chunkNum === config.chunks ?
  'This is the FINAL chunk. Build to a strong climax and provide a satisfying conclusion.' :
  `This is the MIDDLE section. Continue building tension and developing the story. End at a natural transition point.`}

IMPORTANT:
- Continue EXACTLY where the previous section left off
- Maintain the same writing style, tone, and voice
- NO introductory phrases like "continuing from..." or "as we saw..."
- Start directly with the next part of the story
- Aim for approximately ${config.charsPerChunk} characters
- Keep the ${styleType} style consistent`;
      }

      console.log(`📝 Generating chunk ${chunkNum}/${config.chunks}...`);

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

      console.log(`✅ Chunk ${chunkNum} complete (${chunkText.length} characters)`);

      // Delay between chunks to avoid rate limiting
      if (i < config.chunks - 1) {
        console.log('⏳ Waiting before next chunk...');
        await new Promise(r => setTimeout(r, 2000)); // 2 second delay
      }
    }

    // Combine all chunks
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
