import React, { useEffect, useState } from 'react';
import ABTesting from '../core/abTesting';
import AnalyticsTracker from '../core/analyticsTracker';
const Dashboard = () => {
    const [metrics, setMetrics] = useState([]);
    const [activeTests, setActiveTests] = useState([]);
    const [eventLog, setEventLog] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTests(ABTesting.getInstance().getAllTestResults());
            setEventLog(AnalyticsTracker.getInstance().getEventQueue());
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    return (React.createElement("div", { className: "min-h-screen bg-gray-100 p-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-8 text-gray-800" }, "System Dashboard"),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
            React.createElement("div", { className: "bg-white p-6 rounded-lg shadow-sm" },
                React.createElement("h2", { className: "text-lg font-semibold mb-2 text-gray-700" }, "Active A/B Tests"),
                React.createElement("p", { className: "text-3xl font-bold text-blue-600" }, activeTests.length)),
            React.createElement("div", { className: "bg-white p-6 rounded-lg shadow-sm" },
                React.createElement("h2", { className: "text-lg font-semibold mb-2 text-gray-700" }, "Total Events"),
                React.createElement("p", { className: "text-3xl font-bold text-green-600" }, eventLog.length)),
            React.createElement("div", { className: "bg-white p-6 rounded-lg shadow-sm" },
                React.createElement("h2", { className: "text-lg font-semibold mb-2 text-gray-700" }, "Error Rate"),
                React.createElement("p", { className: "text-3xl font-bold text-red-600" }, metrics.length > 0 ? `${metrics[metrics.length - 1].errorRate}%` : '0%'))),
        React.createElement("div", { className: "bg-white rounded-lg shadow-sm p-6 mb-8" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4 text-gray-800" }, "Active A/B Tests"),
            React.createElement("div", { className: "space-y-4" }, activeTests.map((test) => (React.createElement("div", { key: test.testId, className: "border-b pb-4" },
                React.createElement("div", { className: "flex justify-between items-center mb-2" },
                    React.createElement("h3", { className: "font-medium text-gray-700" }, test.testId),
                    React.createElement("span", { className: "text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded" }, test.variant)),
                React.createElement("div", { className: "grid grid-cols-3 gap-4 text-sm" },
                    React.createElement("div", null,
                        "Impressions: ",
                        test.metrics.impressions),
                    React.createElement("div", null,
                        "Conversions: ",
                        test.metrics.conversions),
                    React.createElement("div", null,
                        "CTR: ",
                        (test.metrics.clickThroughRate * 100).toFixed(1),
                        "%"))))))),
        React.createElement("div", { className: "bg-white rounded-lg shadow-sm p-6" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4 text-gray-800" }, "Event Log"),
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-sm text-gray-600 border-b" },
                            React.createElement("th", { className: "pb-2" }, "Timestamp"),
                            React.createElement("th", { className: "pb-2" }, "Event"),
                            React.createElement("th", { className: "pb-2" }, "Details"))),
                    React.createElement("tbody", { className: "text-sm" }, eventLog.slice(-10).reverse().map((event, i) => (React.createElement("tr", { key: i, className: "border-b last:border-b-0" },
                        React.createElement("td", { className: "py-2" }, new Date(event.timestamp).toLocaleTimeString()),
                        React.createElement("td", { className: "py-2 font-medium text-purple-600" }, event.eventName),
                        React.createElement("td", { className: "py-2 text-gray-600" }, JSON.stringify(event.properties, null, 2)))))))))));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map