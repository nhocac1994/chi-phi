'use client';

import { useState, useEffect } from 'react';

interface ChiPhi {
  id: number;
  khoanChi: string;
  diaDiem: string;
  soTien: number;
  ngayThang: string;
}

export default function TableHienThi() {
  const [data, setData] = useState<ChiPhi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chi-phi');
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setError('');
      } else {
        setError('Không thể tải dữ liệu từ Google Sheets');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-container,
          .print-container * {
            visibility: visible;
          }
          
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 0;
            margin: 0;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Ẩn card view khi in */
          .mobile-card-view {
            display: none !important;
          }
          
          /* Đảm bảo table view hiển thị khi in */
          .desktop-table-view {
            display: block !important;
          }
          
          .print-container table {
            border-collapse: collapse;
            width: 100%;
            font-size: 12px;
            margin: 0;
          }
          
          .print-container th,
          .print-container td {
            border: 1px solid #d1d5db;
            padding: 8px 12px;
            text-align: left;
          }
          
          .print-container th {
            background-color: #f3f4f6 !important;
            font-weight: bold;
            color: #374151;
            text-transform: uppercase;
            font-size: 11px;
          }
          
          .print-container tbody tr {
            page-break-inside: avoid;
          }
          
          .print-container tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .print-container tfoot {
            background-color: #f3f4f6 !important;
            font-weight: bold;
          }
          
          .print-container .print-title {
            display: block !important;
            margin-bottom: 20px;
            text-align: center;
            font-size: 20px;
          }
        }
      `}</style>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-800">Báo Cáo Chi Phí</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              In
            </button>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Làm mới
            </button>
          </div>
        </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Chưa có dữ liệu chi phí nào</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="mobile-card-view md:hidden space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        #{item.id}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.khoanChi}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {item.diaDiem}
                    </p>
                    <p className="text-xs text-gray-500">
                      📅 {formatDate(item.ngayThang)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.soTien)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Total Card for Mobile */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(data.reduce((sum, item) => sum + item.soTien, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="print-container desktop-table-view hidden md:block">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 print-title" style={{ display: 'none' }}>
              Báo Cáo Chi Phí
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khoản Chi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa điểm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số Tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tháng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.khoanChi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.diaDiem}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(item.soTien)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.ngayThang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                      Tổng cộng:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {formatCurrency(data.reduce((sum, item) => sum + item.soTien, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
}

