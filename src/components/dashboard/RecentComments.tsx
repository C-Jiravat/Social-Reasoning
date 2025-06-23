import React from 'react';
import { Facebook, Twitter, Clock } from 'lucide-react';
import { Comment } from '../../types';
import { Badge } from '../ui/Badge';

interface RecentCommentsProps {
  comments: Comment[];
}

export const RecentComments: React.FC<RecentCommentsProps> = ({ comments }) => {
  const getPlatformIcon = (platform: Comment['platform']) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'twitter': return <Twitter className="h-4 w-4 text-blue-400" />;
    }
  };

  const getSentimentBadge = (sentiment: Comment['sentiment']) => {
    switch (sentiment) {
      case 'positive': return <Badge variant="success">Positive</Badge>;
      case 'neutral': return <Badge variant="secondary">Neutral</Badge>;
      case 'negative': return <Badge variant="danger">Negative</Badge>;
    }
  };

  const getRiskBadge = (risk: Comment['hateSpeechRisk']) => {
    switch (risk) {
      case 'high': return <Badge variant="danger">High Risk</Badge>;
      case 'medium': return <Badge variant="warning">Medium Risk</Badge>;
      case 'low': return <Badge variant="warning">Low Risk</Badge>;
      case 'none': return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Comments</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {comments.slice(0, 10).map((comment) => (
          <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getPlatformIcon(comment.platform)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(comment.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{comment.content}</p>
                
                <div className="flex items-center space-x-2">
                  {getSentimentBadge(comment.sentiment)}
                  {getRiskBadge(comment.hateSpeechRisk)}
                  <span className="text-xs text-gray-500">
                    {Math.round(comment.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};