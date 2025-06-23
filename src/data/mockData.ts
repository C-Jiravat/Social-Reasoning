import { SocialAccount, Comment, Alert, Analytics } from '../types';

export const mockSocialAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'facebook',
    accountName: 'TechCorp Official',
    accountId: 'techcorp_official',
    isActive: true,
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    followersCount: 125000
  },
  {
    id: '2',
    platform: 'twitter',
    accountName: '@TechCorpHQ',
    accountId: 'techcorpHQ',
    isActive: true,
    lastSync: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    followersCount: 89000
  },
  {
    id: '3',
    platform: 'facebook',
    accountName: 'TechCorp Support',
    accountId: 'techcorp_support',
    isActive: false,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    followersCount: 45000
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    platform: 'facebook',
    accountId: '1',
    postId: 'post_123',
    content: 'This is absolutely terrible service! I hate this company and their stupid products!',
    author: 'angry_customer_2024',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    sentiment: 'negative',
    hateSpeechRisk: 'medium',
    confidence: 0.87
  },
  {
    id: '2',
    platform: 'twitter',
    accountId: '2',
    postId: 'tweet_456',
    content: 'Love the new update! Great work team! 🎉',
    author: 'happy_user',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    sentiment: 'positive',
    hateSpeechRisk: 'none',
    confidence: 0.95
  },
  {
    id: '3',
    platform: 'facebook',
    accountId: '1',
    postId: 'post_789',
    content: 'These idiots don\'t know what they\'re doing. Worst company ever! Should be shut down!',
    author: 'frustrated_user',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    sentiment: 'negative',
    hateSpeechRisk: 'high',
    confidence: 0.92
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'high_hate_speech',
    severity: 'critical',
    title: 'High Hate Speech Detected',
    description: 'Multiple comments with high hate speech risk detected on TechCorp Official Facebook page',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    accountId: '1',
    comments: [mockComments[0], mockComments[2]],
    isRead: false,
    isResolved: false
  },
  {
    id: '2',
    type: 'sentiment_spike',
    severity: 'medium',
    title: 'Negative Sentiment Spike',
    description: 'Unusual increase in negative sentiment detected',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    accountId: '2',
    comments: [mockComments[0]],
    isRead: true,
    isResolved: false
  }
];

export const mockAnalytics: Analytics = {
  totalComments: 1247,
  sentimentDistribution: {
    positive: 652,
    neutral: 398,
    negative: 197
  },
  hateSpeechRisk: {
    none: 1089,
    low: 142,
    medium: 14,
    high: 2
  },
  trends: [
    { date: '2024-01-20', positive: 45, neutral: 32, negative: 8 },
    { date: '2024-01-21', positive: 52, neutral: 28, negative: 12 },
    { date: '2024-01-22', positive: 38, neutral: 35, negative: 15 },
    { date: '2024-01-23', positive: 41, neutral: 31, negative: 9 },
    { date: '2024-01-24', positive: 48, neutral: 29, negative: 7 },
    { date: '2024-01-25', positive: 55, neutral: 33, negative: 11 },
    { date: '2024-01-26', positive: 49, neutral: 27, negative: 13 }
  ]
};