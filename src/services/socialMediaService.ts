import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

interface FacebookComment {
  id: string;
  message: string;
  from: {
    name: string;
    id: string;
  };
  created_time: string;
}

interface TwitterComment {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
}

export class SocialMediaService {
  async fetchFacebookComments(pageId: string, accessToken: string, postId?: string): Promise<FacebookComment[]> {
    try {
      const endpoint = postId 
        ? `https://graph.facebook.com/v18.0/${postId}/comments`
        : `https://graph.facebook.com/v18.0/${pageId}/feed`;
      
      const response = await fetch(
        `${endpoint}?access_token=${accessToken}&fields=id,message,from,created_time&limit=100`
      );
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Facebook comments:', error);
      return [];
    }
  }

  async fetchTwitterComments(userId: string, bearerToken: string): Promise<TwitterComment[]> {
    try {
      const response = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at,public_metrics&max_results=100`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Twitter comments:', error);
      return [];
    }
  }

  async processAndStoreComments(socialAccountId: string, platform: 'facebook' | 'twitter') {
    try {
      // Get social account details
      const { data: account, error: accountError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('id', socialAccountId)
        .single();

      if (accountError || !account) {
        throw new Error('Social account not found');
      }

      let rawComments: any[] = [];

      // Fetch comments based on platform
      if (platform === 'facebook') {
        rawComments = await this.fetchFacebookComments(
          account.account_id,
          account.access_token
        );
      } else if (platform === 'twitter') {
        rawComments = await this.fetchTwitterComments(
          account.account_id,
          account.access_token
        );
      }

      // Process comments with Gemini AI
      const processedComments = [];
      
      for (const rawComment of rawComments) {
        try {
          // Check if comment already exists
          const { data: existingComment } = await supabase
            .from('comments')
            .select('id')
            .eq('post_id', rawComment.id)
            .single();

          if (existingComment) {
            continue; // Skip if already processed
          }

          // Prepare comment data for analysis
          const commentData = {
            content: platform === 'facebook' ? rawComment.message : rawComment.text,
            author: platform === 'facebook' ? rawComment.from.name : rawComment.author_id,
            platform,
            language: this.detectLanguage(
              platform === 'facebook' ? rawComment.message : rawComment.text
            )
          };

          // Analyze with Gemini
          const analysis = await geminiService.analyzeComment(commentData);

          // Prepare comment for database
          const comment = {
            social_account_id: socialAccountId,
            platform,
            post_id: rawComment.id,
            content: commentData.content,
            author: commentData.author,
            author_id: platform === 'facebook' ? rawComment.from.id : rawComment.author_id,
            timestamp: platform === 'facebook' ? rawComment.created_time : rawComment.created_at,
            sentiment: analysis.sentiment,
            hate_speech_risk: analysis.hateSpeechRisk,
            confidence: analysis.confidence,
            gemini_analysis: {
              reasoning: analysis.reasoning,
              keyPhrases: analysis.keyPhrases,
              originalResponse: analysis
            }
          };

          processedComments.push(comment);
        } catch (error) {
          console.error('Error processing individual comment:', error);
        }
      }

      // Bulk insert comments
      if (processedComments.length > 0) {
        const { error: insertError } = await supabase
          .from('comments')
          .insert(processedComments);

        if (insertError) {
          throw insertError;
        }

        // Check for alerts
        await this.checkForAlerts(socialAccountId, processedComments);
      }

      // Update last sync time
      await supabase
        .from('social_accounts')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', socialAccountId);

      return processedComments.length;
    } catch (error) {
      console.error('Error processing comments:', error);
      throw error;
    }
  }

  private detectLanguage(text: string): 'en' | 'th' {
    // Simple Thai language detection
    const thaiPattern = /[\u0E00-\u0E7F]/;
    return thaiPattern.test(text) ? 'th' : 'en';
  }

  private async checkForAlerts(socialAccountId: string, comments: any[]) {
    try {
      // Get user ID from social account
      const { data: account } = await supabase
        .from('social_accounts')
        .select('user_id')
        .eq('id', socialAccountId)
        .single();

      if (!account) return;

      // Check for high hate speech risk
      const highRiskComments = comments.filter(c => c.hate_speech_risk === 'high');
      if (highRiskComments.length > 0) {
        await this.createAlert({
          user_id: account.user_id,
          type: 'high_hate_speech',
          severity: 'critical',
          title: 'High Hate Speech Detected',
          description: `${highRiskComments.length} comments with high hate speech risk detected`,
          social_account_id: socialAccountId,
          related_comments: highRiskComments.map(c => c.post_id)
        });
      }

      // Check for negative sentiment spike
      const negativeComments = comments.filter(c => c.sentiment === 'negative');
      const negativePercentage = (negativeComments.length / comments.length) * 100;
      
      if (negativePercentage > 50 && comments.length >= 10) {
        await this.createAlert({
          user_id: account.user_id,
          type: 'sentiment_spike',
          severity: 'high',
          title: 'Negative Sentiment Spike',
          description: `${negativePercentage.toFixed(1)}% of recent comments are negative`,
          social_account_id: socialAccountId,
          related_comments: negativeComments.map(c => c.post_id)
        });
      }
    } catch (error) {
      console.error('Error checking for alerts:', error);
    }
  }

  private async createAlert(alertData: any) {
    const { error } = await supabase
      .from('alerts')
      .insert(alertData);

    if (error) {
      console.error('Error creating alert:', error);
    }
  }

  async syncAllActiveAccounts() {
    try {
      const { data: accounts, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      const results = [];
      for (const account of accounts || []) {
        try {
          const commentCount = await this.processAndStoreComments(
            account.id,
            account.platform
          );
          results.push({
            accountId: account.id,
            platform: account.platform,
            commentCount,
            success: true
          });
        } catch (error) {
          results.push({
            accountId: account.id,
            platform: account.platform,
            error: error.message,
            success: false
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error syncing accounts:', error);
      throw error;
    }
  }
}

export const socialMediaService = new SocialMediaService();