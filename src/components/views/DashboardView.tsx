import React from 'react';
import { TrendingUp, Users, AlertTriangle, MessageSquare, Facebook, Twitter } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';
import { SentimentChart } from '../dashboard/SentimentChart';
import { AlertsList } from '../dashboard/AlertsList';
import { RecentComments } from '../dashboard/RecentComments';
import { mockAnalytics, mockAlerts, mockComments, mockSocialAccounts } from '../../data/mockData';

export const DashboardView: React.FC = () => {
  const handleMarkRead = (alertId: string) => {
    console.log('Mark alert as read:', alertId);
  };

  const handleResolve = (alertId: string) => {
    console.log('Resolve alert:', alertId);
  };

  const activeAccounts = mockSocialAccounts.filter(account => account.isActive);
  const totalFollowers = activeAccounts.reduce((sum, account) => sum + account.followersCount, 0);
  
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Comments"
          value={mockAnalytics.totalComments.toLocaleString()}
          change={{ value: 12, type: 'increase' }}
          icon={MessageSquare}
          color="blue"
        />
        <StatsCard
          title="Active Alerts"
          value={mockAlerts.filter(alert => !alert.isResolved).length}
          change={{ value: 5, type: 'decrease' }}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Monitored Accounts"
          value={activeAccounts.length}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Total Reach"
          value={`${Math.round(totalFollowers / 1000)}K`}
          change={{ value: 8, type: 'increase' }}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart data={mockAnalytics.trends} />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium">Positive</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{mockAnalytics.sentimentDistribution.positive}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((mockAnalytics.sentimentDistribution.positive / mockAnalytics.totalComments) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm font-medium">Neutral</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{mockAnalytics.sentimentDistribution.neutral}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((mockAnalytics.sentimentDistribution.neutral / mockAnalytics.totalComments) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm font-medium">Negative</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{mockAnalytics.sentimentDistribution.negative}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((mockAnalytics.sentimentDistribution.negative / mockAnalytics.totalComments) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">Active Platforms</h4>
            <div className="flex items-center space-x-4">
              {activeAccounts.map((account) => (
                <div key={account.id} className="flex items-center space-x-2">
                  {account.platform === 'facebook' ? (
                    <Facebook className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Twitter className="h-5 w-5 text-blue-400" />
                  )}
                  <span className="text-sm font-medium">{account.accountName}</span>
                  <span className="text-xs text-green-500">●</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList 
          alerts={mockAlerts} 
          onMarkRead={handleMarkRead}
          onResolve={handleResolve}
        />
        <RecentComments comments={mockComments} />
      </div>
    </div>
  );
};