import { GoogleGenAI, Type } from '@google/genai';
import { 
  BoardTier, 
  Subject, 
  ResolutionMode, 
  DoubtSolutionResponse 
} from '../types';
import { AXIOM_SYSTEM_INSTRUCTION, MODEL_CONFIG } from '../constants';

export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  if (!apiKey || apiKey.trim() === '') {
    return { valid: false, error: 'API key cannot be empty.' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL_CONFIG.FAST,
      contents: 'Respond with OK if active.',
    });

    if (response && response.text) {
      return { valid: true };
    }
    return { valid: false, error: 'Empty response received from Gemini API.' };
  } catch (err: any) {
    console.error('API Key Validation Error:', err);
    let message = err?.message || 'Invalid API key or network error.';
    if (message.includes('403') || message.includes('API_KEY_INVALID')) {
      message = 'Invalid Gemini API key. Please check key permissions.';
    } else if (message.includes('429')) {
      message = 'Rate limit exceeded for this API key.';
    }
    return { valid: false, error: message };
  }
}

interface SolveParams {
  apiKey: string;
  query: string;
  imageDataUrl?: string | null;
  board: BoardTier;
  subject: Subject;
  mode: ResolutionMode;
  modelId?: string;
}

export async function solveDoubt({
  apiKey,
  query,
  imageDataUrl,
  board,
  subject,
  mode,
  modelId = MODEL_CONFIG.FAST,
}: SolveParams): Promise<DoubtSolutionResponse> {
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please click "API Key: Missing" in the top bar.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const promptText = `
STUDENT PROFILE:
- Target Board / Academic Tier: ${board}
- Subject: ${subject}
- Requested Resolution Mode: ${mode}

STUDENT QUESTION / DOUBT:
${query || 'Please solve the problem presented in the attached image.'}

Instruction:
Resolve this doubt with maximum accuracy. Match the depth of your explanation to the complexity of the question asked. Adapt the tone for ${board} ${subject}. Use $...$ for inline math and $$...$$ for block math, and never chain $$ blocks inline.
`;

  const contentsArray: any[] = [promptText];

  if (imageDataUrl) {
    const match = imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      contentsArray.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: contentsArray,
      config: {
        systemInstruction: AXIOM_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedTopic: { type: Type.STRING },
            coreConcept: { type: Type.STRING },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  mathLatex: { type: Type.STRING },
                  examMarksAllocated: { type: Type.STRING },
                },
                required: ['stepNumber', 'title', 'explanation'],
              },
            },
            socraticHints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            commonMistakes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            practiceChallenge: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                mathLatex: { type: Type.STRING },
                hint: { type: Type.STRING },
                answer: { type: Type.STRING },
              },
              required: ['question', 'hint', 'answer'],
            },
          },
          required: [
            'identifiedTopic',
            'coreConcept',
            'prerequisites',
            'steps',
            'commonMistakes',
            'practiceChallenge',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No content returned from Gemini model.');
    }

    try {
      const parsed: DoubtSolutionResponse = JSON.parse(responseText);
      return parsed;
    } catch (parseErr) {
      console.warn('JSON schema parse failure, attempting fallback regex extract:', parseErr);
      // Fallback if raw text returned inside markdown block
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      throw new Error('Failed to parse structured response from Gemini API.');
    }
  } catch (err: any) {
    console.error('Gemini API Solve Error:', err);
    let msg = err?.message || 'An error occurred while resolving the doubt.';
    if (msg.includes('403') || msg.includes('API_KEY_INVALID')) {
      msg = 'API Key is invalid or permissions were denied. Check your key in top bar.';
    } else if (msg.includes('429')) {
      msg = 'Gemini API Rate limit hit. Please wait a moment or switch model tier.';
    }
    throw new Error(msg);
  }
}
