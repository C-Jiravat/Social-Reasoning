import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, MessageSquare } from 'lucide-react';
import { mockAnalytics } from '../../data/mockData';
import { StatsCard } from '../dashboard/StatsCard';

export const AnalyticsView: React.FC = () => {
  const pieData = [
    { name: 'Positive', value: mockAnalytics.sentimentDistribution.positive, color: '#10b981' },
    { name: 'Neutral', value: mockAnalytics.sentimentDistribution.neutral, color: '#6b7280' },
    { name: 'Negative', value: mockAnalytics.sentimentDistribution.negative, color: '#ef4444' }
  ];

  const riskData = [
    { name: 'None', value: mockAnalytics.hateSpeechRisk.none, color: '#10b981' },
    { name: 'Low', value: mockAnalytics.hateSpeechRisk.low, color: '#f59e0b' },
    { name: 'Medium', value: mockAnalytics.hateSpeechRisk.medium, color: '#ef4444' },
    { name: 'High', value: mockAnalytics.hateSpeechRisk.high, color: '#dc2626' }
  ];

  const weeklyData = mockAnalytics.trends.map(trend => ({
    ...trend,
    total: trend.positive + trend.neutral + trend.negative
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive insights into your social media sentiment and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Comments"
          value={mockAnalytics.totalComments.toLocaleString()}
          change={{ value: 15, type: 'increase' }}
          icon={MessageSquare}
          color="blue"
        />
        <StatsCard
          title="Positive Rate"
          value={`${Math.round((mockAnalytics.sentimentDistribution.positive / mockAnalytics.totalComments) * 100)}%`}
          change={{ value: 8, type: 'increase' }}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Negative Rate"
          value={`${Math.round((mockAnalytics.sentimentDistribution.negative / mockAnalytics.totalComments) * 100)}%`}
          change={{ value: 3, type: 'decrease' }}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="High Risk Comments"
          value={mockAnalytics.hateSpeechRisk.high}
          change={{ value: 50, type: 'decrease' }}
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Comment Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hate Speech Risk Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sentiment Breakdown</h3>
          <div className="space-y-4">
            {mockAnalytics.trends.slice(-3).map((day, index) => (
              <div key={day.date} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-sm text-gray-500">
                    {day.positive + day.neutral + day.negative} total
                  </span>
                </div>
                <div className="flex space-x-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${(day.positive / (day.positive + day.neutral + day.negative)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-gray-400" 
                    style={{ width: `${(day.neutral / (day.positive + day.neutral + day.negative)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(day.negative / (day.positive + day.neutral + day.negative)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Positive: {day.positive}</span>
                  <span>Neutral: {day.neutral}</span>
                  <span>Negative: {day.negative}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};