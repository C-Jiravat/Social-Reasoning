interface GeminiAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  hateSpeechRisk: 'none' | 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string;
  keyPhrases: string[];
}

interface CommentData {
  content: string;
  author: string;
  platform: 'facebook' | 'twitter';
  language?: 'en' | 'th';
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeComment(comment: CommentData): Promise<GeminiAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(comment);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      
      return this.parseGeminiResponse(analysisText);
    } catch (error) {
      console.error('Error analyzing comment with Gemini:', error);
      // Fallback analysis
      return this.getFallbackAnalysis(comment);
    }
  }

  private buildAnalysisPrompt(comment: CommentData): string {
    const languageInstruction = comment.language === 'th' 
      ? 'This comment is in Thai language. Please analyze accordingly.'
      : 'This comment is in English language.';

    return `
Analyze the following social media comment for sentiment and hate speech risk.

${languageInstruction}

Platform: ${comment.platform}
Author: ${comment.author}
Comment: "${comment.content}"

Please provide analysis in the following JSON format:
{
  "sentiment": "positive|neutral|negative",
  "hateSpeechRisk": "none|low|medium|high",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of the analysis",
  "keyPhrases": ["phrase1", "phrase2", "phrase3"]
}

Sentiment Guidelines:
- Positive: Expresses satisfaction, praise, or positive emotions
- Neutral: Factual, informational, or balanced tone
- Negative: Expresses dissatisfaction, criticism, or negative emotions

Hate Speech Risk Guidelines:
- None: No offensive language or targeting
- Low: Mild criticism or frustration without targeting groups
- Medium: Strong negative language, personal attacks, or mild discriminatory language
- High: Clear hate speech, threats, severe discriminatory language, or incitement to violence

Consider cultural context for Thai language comments, including local expressions and cultural nuances.
`;
  }

  private parseGeminiResponse(responseText: string): GeminiAnalysisResult {
    try {
      // Extract JSON from response (Gemini might include extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        sentiment: parsed.sentiment || 'neutral',
        hateSpeechRisk: parsed.hateSpeechRisk || 'none',
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || 'Analysis completed',
        keyPhrases: parsed.keyPhrases || []
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.getFallbackAnalysis({ content: responseText } as CommentData);
    }
  }

  private getFallbackAnalysis(comment: CommentData): GeminiAnalysisResult {
    // Simple fallback analysis based on keywords
    const content = comment.content.toLowerCase();
    const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'stupid', 'idiot', 'แย่', 'เกลียด', 'โง่'];
    const positiveWords = ['love', 'great', 'awesome', 'excellent', 'good', 'ดี', 'เยี่ยม', 'รัก'];
    
    const hasNegative = negativeWords.some(word => content.includes(word));
    const hasPositive = positiveWords.some(word => content.includes(word));
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let hateSpeechRisk: 'none' | 'low' | 'medium' | 'high' = 'none';
    
    if (hasNegative && !hasPositive) {
      sentiment = 'negative';
      hateSpeechRisk = 'low';
    } else if (hasPositive && !hasNegative) {
      sentiment = 'positive';
    }
    
    return {
      sentiment,
      hateSpeechRisk,
      confidence: 0.6,
      reasoning: 'Fallback keyword-based analysis',
      keyPhrases: []
    };
  }

  async analyzeBatch(comments: CommentData[]): Promise<GeminiAnalysisResult[]> {
    const results: GeminiAnalysisResult[] = [];
    
    // Process comments in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < comments.length; i += batchSize) {
      const batch = comments.slice(i, i + batchSize);
      const batchPromises = batch.map(comment => this.analyzeComment(comment));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < comments.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const geminiService = new GeminiService(
  import.meta.env.VITE_GEMINI_API_KEY || ''
);