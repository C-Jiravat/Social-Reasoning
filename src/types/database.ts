export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'manager' | 'analyst';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'manager' | 'analyst';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'manager' | 'analyst';
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      social_accounts: {
        Row: {
          id: string;
          user_id: string;
          platform: 'facebook' | 'twitter';
          account_name: string;
          account_id: string;
          access_token: string;
          is_active: boolean;
          last_sync: string;
          followers_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: 'facebook' | 'twitter';
          account_name: string;
          account_id: string;
          access_token: string;
          is_active?: boolean;
          last_sync?: string;
          followers_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: 'facebook' | 'twitter';
          account_name?: string;
          account_id?: string;
          access_token?: string;
          is_active?: boolean;
          last_sync?: string;
          followers_count?: number;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          social_account_id: string;
          platform: 'facebook' | 'twitter';
          post_id: string;
          content: string;
          author: string;
          author_id: string;
          timestamp: string;
          sentiment: 'positive' | 'neutral' | 'negative';
          hate_speech_risk: 'none' | 'low' | 'medium' | 'high';
          confidence: number;
          gemini_analysis: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          social_account_id: string;
          platform: 'facebook' | 'twitter';
          post_id: string;
          content: string;
          author: string;
          author_id: string;
          timestamp: string;
          sentiment: 'positive' | 'neutral' | 'negative';
          hate_speech_risk: 'none' | 'low' | 'medium' | 'high';
          confidence: number;
          gemini_analysis?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          social_account_id?: string;
          platform?: 'facebook' | 'twitter';
          post_id?: string;
          content?: string;
          author?: string;
          author_id?: string;
          timestamp?: string;
          sentiment?: 'positive' | 'neutral' | 'negative';
          hate_speech_risk?: 'none' | 'low' | 'medium' | 'high';
          confidence?: number;
          gemini_analysis?: any;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          type: 'high_hate_speech' | 'sentiment_spike' | 'volume_spike';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          social_account_id: string;
          related_comments: string[];
          is_read: boolean;
          is_resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'high_hate_speech' | 'sentiment_spike' | 'volume_spike';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          social_account_id: string;
          related_comments?: string[];
          is_read?: boolean;
          is_resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'high_hate_speech' | 'sentiment_spike' | 'volume_spike';
          severity?: 'low' | 'medium' | 'high' | 'critical';
          title?: string;
          description?: string;
          social_account_id?: string;
          related_comments?: string[];
          is_read?: boolean;
          is_resolved?: boolean;
          updated_at?: string;
        };
      };
      notification_settings: {
        Row: {
          id: string;
          user_id: string;
          email_enabled: boolean;
          line_enabled: boolean;
          line_token: string | null;
          discord_enabled: boolean;
          discord_webhook_url: string | null;
          real_time_alerts: boolean;
          daily_summary: boolean;
          hate_speech_threshold: 'low' | 'medium' | 'high';
          sentiment_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_enabled?: boolean;
          line_enabled?: boolean;
          line_token?: string | null;
          discord_enabled?: boolean;
          discord_webhook_url?: string | null;
          real_time_alerts?: boolean;
          daily_summary?: boolean;
          hate_speech_threshold?: 'low' | 'medium' | 'high';
          sentiment_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_enabled?: boolean;
          line_enabled?: boolean;
          line_token?: string | null;
          discord_enabled?: boolean;
          discord_webhook_url?: string | null;
          real_time_alerts?: boolean;
          daily_summary?: boolean;
          hate_speech_threshold?: 'low' | 'medium' | 'high';
          sentiment_threshold?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}