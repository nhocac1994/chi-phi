'use client';

import { useState } from 'react';
import FormNhapLieu from './components/FormNhapLieu';
import TableHienThi from './components/TableHienThi';

export default function Home() {
  const [currentView, setCurrentView] = useState<'form' | 'table'>('form');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    // Trigger refresh của table
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Chi Phí Đi Lại
        </h1>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setCurrentView('form')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                currentView === 'form'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nhập Chi Phí
            </button>
            <button
              onClick={() => setCurrentView('table')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                currentView === 'table'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Báo Cáo Chi Phí
            </button>
          </div>
        </div>

        {/* Content */}
        {currentView === 'form' ? (
          <FormNhapLieu onSuccess={handleFormSuccess} />
        ) : (
          <TableHienThi key={refreshKey} />
        )}
      </div>
    </main>
  );
}

