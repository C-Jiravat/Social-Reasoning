import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Eye, ExternalLink } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';
import { Badge } from '../ui/Badge';

export const AlertsView: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Alerts</h2>
        <p className="text-gray-600">Monitor and manage crisis alerts across your social media accounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Alerts</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="danger">{mockAlerts.filter(a => a.severity === 'critical').length} Critical</Badge>
              <Badge variant="warning">{mockAlerts.filter(a => a.severity === 'high').length} High</Badge>
              <Badge variant="info">{mockAlerts.filter(a => !a.isResolved).length} Active</Badge>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-500' : 
                    alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    {alert.isResolved && <Badge variant="success">Resolved</Badge>}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{alert.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(alert.timestamp)}</span>
                    </div>
                    <span>{alert.comments.length} related comments</span>
                    <span>Account: {alert.accountId}</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Related Comments:</h5>
                    <div className="space-y-2">
                      {alert.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-red-300">
                          <p className="font-medium">{comment.author}:</p>
                          <p>"{comment.content}"</p>
                        </div>
                      ))}
                      {alert.comments.length > 2 && (
                        <p className="text-sm text-gray-500">+{alert.comments.length - 2} more comments</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="flex flex-col space-y-2">
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span>Go to Post</span>
                    </button>
                    {!alert.isResolved && (
                      <button className="px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition-colors">
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};