'use client';

import React, { useEffect, useState } from 'react';
import ABTesting from '../core/abTesting';
import AnalyticsTracker from '../core/analyticsTracker';
import { MetricsData, ABTestResult, AnalyticsEvent } from '../types';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [activeTests, setActiveTests] = useState<ABTestResult[]>([]);
  const [eventLog, setEventLog] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const abTesting = ABTesting.getInstance();
    const analyticsTracker = AnalyticsTracker.getInstance();

    const interval = setInterval(() => {
      // Fetch active A/B tests
      const tests = abTesting.getAllTestResults();
      setActiveTests(tests);

      // Fetch event log
      const events = analyticsTracker.getEventQueue();
      setEventLog(events);

      // You might want to add a method to fetch metrics in your AnalyticsTracker
      // For now, we'll simulate metrics
      const latestMetrics: MetricsData = {
        timestamp: Date.now(),
        errorRate: Math.random() * 10, // Simulated error rate
        performanceScore: Math.random() * 100,
        userEngagement: Math.random() * 100
      };
      setMetrics(prev => [...prev, latestMetrics].slice(-10)); // Keep last 10 metrics
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">System Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Active A/B Tests</h2>
          <p className="text-3xl font-bold text-blue-600">{activeTests.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Events</h2>
          <p className="text-3xl font-bold text-green-600">{eventLog.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Error Rate</h2>
          <p className="text-3xl font-bold text-red-600">
            {metrics.length > 0 ? `${metrics[metrics.length - 1].errorRate.toFixed(2)}%` : '0%'}
          </p>
        </div>
      </div>

      {/* Active Tests Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Active A/B Tests</h2>
        <div className="space-y-4">
          {activeTests.length === 0 ? (
            <p className="text-gray-500">No active A/B tests</p>
          ) : (
            activeTests.map((test) => (
              <div key={test.testId} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">{test.testId}</h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {test.variant}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Impressions: {test.metrics.impressions}</div>
                  <div>Conversions: {test.metrics.conversions}</div>
                  <div>CTR: {(test.metrics.clickThroughRate * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Event Log Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Event Log</h2>
        <div className="overflow-x-auto">
          {eventLog.length === 0 ? (
            <p className="text-gray-500">No recent events</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {eventLog.slice(-10).reverse().map((event, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="py-2">{new Date(event.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2 font-medium text-purple-600">{event.eventName}</td>
                    <td className="py-2 text-gray-600">
                      {JSON.stringify(event.properties, null, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 