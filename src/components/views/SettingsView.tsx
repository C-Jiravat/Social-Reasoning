import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Shield, Save } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const SettingsView: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    line: false,
    discord: false,
    realTime: true,
    dailySummary: true
  });

  const [thresholds, setThresholds] = useState({
    hateSpeechRisk: 'medium',
    sentimentThreshold: 70
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleThresholdChange = (key: string, value: any) => {
    setThresholds(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Configure your notification preferences and alert thresholds</p>
      </div>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Channels</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts via email</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={notifications.email ? 'success' : 'secondary'}>
                  {notifications.email ? 'Enabled' : 'Disabled'}
                </Badge>
                <button
                  onClick={() => handleNotificationChange('email', !notifications.email)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">LINE Notify</p>
                  <p className="text-sm text-gray-500">Send alerts to LINE chat</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={notifications.line ? 'success' : 'secondary'}>
                  {notifications.line ? 'Connected' : 'Not Connected'}
                </Badge>
                <button
                  onClick={() => handleNotificationChange('line', !notifications.line)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.line ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.line ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">D</div>
                <div>
                  <p className="font-medium text-gray-900">Discord Webhook</p>
                  <p className="text-sm text-gray-500">Post alerts to Discord channel</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={notifications.discord ? 'success' : 'secondary'}>
                  {notifications.discord ? 'Connected' : 'Not Connected'}
                </Badge>
                <button
                  onClick={() => handleNotificationChange('discord', !notifications.discord)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.discord ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.discord ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Alert Preferences</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Real-time Alerts</p>
                <p className="text-sm text-gray-500">Immediate notifications for critical issues</p>
              </div>
              <button
                onClick={() => handleNotificationChange('realTime', !notifications.realTime)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.realTime ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.realTime ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Daily Summary</p>
                <p className="text-sm text-gray-500">Daily digest of all activity</p>
              </div>
              <button
                onClick={() => handleNotificationChange('dailySummary', !notifications.dailySummary)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.dailySummary ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.dailySummary ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hate Speech Risk Threshold
                </label>
                <select
                  value={thresholds.hateSpeechRisk}
                  onChange={(e) => handleThresholdChange('hateSpeechRisk', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low - Alert on any risk detected</option>
                  <option value="medium">Medium - Alert on medium or high risk</option>
                  <option value="high">High - Alert only on high risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Negative Sentiment Threshold ({thresholds.sentimentThreshold}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={thresholds.sentimentThreshold}
                  onChange={(e) => handleThresholdChange('sentimentThreshold', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10% (Very Sensitive)</span>
                  <span>90% (Less Sensitive)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};