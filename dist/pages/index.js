import React from 'react';
import Link from 'next/link';
export default function HomePage() {
    return (React.createElement("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center" },
        React.createElement("div", { className: "bg-white p-8 rounded-lg shadow-md" },
            React.createElement("h1", { className: "text-3xl font-bold mb-4" }, "Welcome to Huynh Analytics"),
            React.createElement(Link, { href: "/dashboard", className: "inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors" }, "Go to Dashboard"))));
}
//# sourceMappingURL=index.js.map