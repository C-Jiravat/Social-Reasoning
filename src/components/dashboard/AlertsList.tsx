import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';
import { Badge } from '../ui/Badge';

interface AlertsListProps {
  alerts: Alert[];
  onMarkRead: (alertId: string) => void;
  onResolve: (alertId: string) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts, onMarkRead, onResolve }) => {
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
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
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="font-medium">All clear!</p>
            <p className="text-sm">No active alerts at the moment.</p>
          </div>
        ) : (
          alerts.slice(0, 5).map((alert) => (
            <div 
              key={alert.id} 
              className={`p-6 hover:bg-gray-50 transition-colors ${!alert.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {alert.title}
                      </p>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatTime(alert.timestamp)}</span>
                      <span>•</span>
                      <span>{alert.comments.length} comments</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.isRead && (
                    <button
                      onClick={() => onMarkRead(alert.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark Read
                    </button>
                  )}
                  {!alert.isResolved && (
                    <button
                      onClick={() => onResolve(alert.id)}
                      className="text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};