import Dashboard from '../ui/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Huynh Analytics
        </h1>
        <Dashboard />
      </div>
    </main>
  );
} 