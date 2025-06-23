import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Analytics } from '../../types';

interface SentimentChartProps {
  data: Analytics['trends'];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends (7 Days)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Area
              type="monotone"
              dataKey="positive"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stackId="1"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="negative"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};