import React from 'react';
import { Phone, PhoneOff, Pause, Play, BarChart3, Settings } from 'lucide-react';
import { AgentMetrics } from '../types';

interface AgentControlsProps {
  isCallActive: boolean;
  onToggleCall: () => void;
  metrics: AgentMetrics;
}

export const AgentControls: React.FC<AgentControlsProps> = ({
  isCallActive,
  onToggleCall,
  metrics
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Agent Controls</h2>
        <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
      </div>

      {/* Call Controls */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={onToggleCall}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isCallActive
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isCallActive ? (
            <>
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </>
          ) : (
            <>
              <Phone className="w-4 h-4" />
              <span>Start Call</span>
            </>
          )}
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          {isCallActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isCallActive ? 'Pause' : 'Resume'}</span>
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900">Today's Performance</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{metrics.callsToday}</div>
            <div className="text-xs text-blue-700">Calls Handled</div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{metrics.avgCallTime}</div>
            <div className="text-xs text-green-700">Avg Call Time</div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{metrics.resolutionRate}%</div>
            <div className="text-xs text-purple-700">Resolution Rate</div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{metrics.customerSatisfaction}</div>
            <div className="text-xs text-orange-700">Satisfaction Score</div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-700">
            {isCallActive ? 'Call in Progress' : 'Ready for Next Call'}
          </span>
        </div>
      </div>
    </div>
  );
};