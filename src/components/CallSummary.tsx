import React from 'react';
import { FileText, Clock, Tag, TrendingUp, User, AlertCircle } from 'lucide-react';
import { CallSummary as CallSummaryType } from '../types';

interface CallSummaryProps {
  summary: CallSummaryType;
}

export const CallSummary: React.FC<CallSummaryProps> = ({ summary }) => {
  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'bg-green-100 text-green-800 border-green-200',
      neutral: 'bg-blue-100 text-blue-800 border-blue-200',
      negative: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[sentiment as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      resolved: 'bg-blue-100 text-blue-800',
      escalated: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Call Summary</h2>
        <div className="ml-auto">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(summary.status)}`}>
            {summary.status}
          </span>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* Customer Info */}
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <User className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">{summary.customerName}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Duration: {summary.duration}</span>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-900">Issue Description</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed pl-6">
            {summary.issue}
          </p>
        </div>

        {/* Resolution */}
        {summary.resolution && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-medium text-gray-900">Resolution</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-6">
              {summary.resolution}
            </p>
          </div>
        )}

        {/* Sentiment */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Customer Sentiment</h3>
          </div>
          <div className="pl-6">
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getSentimentColor(summary.sentiment)}`}>
              {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-900">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2 pl-6">
            {summary.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-update indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Auto-updating based on conversation</span>
        </p>
      </div>
    </div>
  );
};