export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst';
  avatar?: string;
}

export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'twitter';
  accountName: string;
  accountId: string;
  isActive: boolean;
  lastSync: Date;
  followersCount: number;
}

export interface Comment {
  id: string;
  platform: 'facebook' | 'twitter';
  accountId: string;
  postId: string;
  content: string;
  author: string;
  timestamp: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  hateSpeechRisk: 'none' | 'low' | 'medium' | 'high';
  confidence: number;
}

export interface Alert {
  id: string;
  type: 'high_hate_speech' | 'sentiment_spike' | 'volume_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  accountId: string;
  comments: Comment[];
  isRead: boolean;
  isResolved: boolean;
}

export interface Analytics {
  totalComments: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  hateSpeechRisk: {
    none: number;
    low: number;
    medium: number;
    high: number;
  };
  trends: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}

export interface NotificationSettings {
  lineNotify: {
    enabled: boolean;
    token?: string;
  };
  email: {
    enabled: boolean;
    addresses: string[];
  };
  discord: {
    enabled: boolean;
    webhookUrl?: string;
  };
  alertThresholds: {
    hateSpeechRisk: 'medium' | 'high';
    sentimentThreshold: number;
  };
}