import React from 'react';
import { Play, Pause, Settings, RefreshCw, Facebook, Twitter } from 'lucide-react';
import { mockSocialAccounts } from '../../data/mockData';
import { Badge } from '../ui/Badge';

export const MonitoringView: React.FC = () => {
  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h2>
        <p className="text-gray-600">Real-time monitoring status of your connected social media accounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Monitoring Status</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Active</span>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mockSocialAccounts.filter(acc => acc.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
              <div className="text-sm text-gray-600">Sync Interval</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockSocialAccounts.map((account) => (
            <div key={account.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {account.platform === 'facebook' ? (
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Facebook className="h-6 w-6 text-blue-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Twitter className="h-6 w-6 text-blue-400" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{account.accountName}</h4>
                    <p className="text-sm text-gray-500">@{account.accountId}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {account.followersCount.toLocaleString()} followers
                      </span>
                      <span className="text-sm text-gray-500">
                        Last sync: {formatLastSync(account.lastSync)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {account.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="danger">Inactive</Badge>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                    
                    {account.isActive ? (
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors">
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition-colors">
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">247</div>
                  <div className="text-xs text-gray-500">Comments Today</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">89%</div>
                  <div className="text-xs text-gray-500">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-600">8%</div>
                  <div className="text-xs text-gray-500">Neutral</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">3%</div>
                  <div className="text-xs text-gray-500">Negative</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};