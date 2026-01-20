'use client';

import { useState } from 'react';

interface FormData {
  khoanChi: string;
  diaDiem: string;
  soTien: string; // lưu dạng số (chỉ digits) để submit: "300000"
  ngayThang: string;
}

function formatVndInput(digitsOnly: string) {
  const n = Number(digitsOnly || '0');
  if (!Number.isFinite(n) || n <= 0) return '';
  // 300000 -> "300.000"
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n);
}

function digitsFromAnyInput(value: string) {
  // nhận "300.000 đ" -> "300000"
  return value.replace(/[^\d]/g, '');
}

export default function FormNhapLieu({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    khoanChi: '',
    diaDiem: '',
    soTien: '',
    ngayThang: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const soTienNumber = Number(formData.soTien || '0');
      if (!Number.isFinite(soTienNumber) || soTienNumber <= 0) {
        setMessage('Số tiền không hợp lệ');
        return;
      }

      const response = await fetch('/api/chi-phi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          khoanChi: formData.khoanChi,
          diaDiem: formData.diaDiem,
          soTien: soTienNumber,
          ngayThang: formData.ngayThang,
        }),
      });

      if (response.ok) {
        setMessage('Thêm chi phí thành công!');
        setFormData({
          khoanChi: '',
          diaDiem: '',
          soTien: '',
          ngayThang: new Date().toISOString().split('T')[0],
        });
        onSuccess();
      } else {
        setMessage('Có lỗi xảy ra khi thêm chi phí');
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm chi phí');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nhập Chi Phí</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="khoanChi" className="block text-sm font-medium text-gray-700 mb-1">
            Khoản Chi *
          </label>
          <input
            type="text"
            id="khoanChi"
            list="khoanChiOptions"
            required
            value={formData.khoanChi}
            onChange={(e) => setFormData({ ...formData, khoanChi: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập khoản chi"
          />
          <datalist id="khoanChiOptions">
            <option value="Ăn" />
            <option value="Nhà nghỉ" />
            <option value="ETC" />
            <option value="Xăng" />
          </datalist>
        </div>

        <div>
          <label htmlFor="diaDiem" className="block text-sm font-medium text-gray-700 mb-1">
            Địa điểm *
          </label>
          <input
            type="text"
            id="diaDiem"
            list="diaDiemOptions"
            required
            value={formData.diaDiem}
            onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập địa điểm"
          />
          <datalist id="diaDiemOptions">
            <option value="HCM" />
            <option value="Cà mau" />
            <option value="Bạc liêu" />
            <option value="Kiên giang" />
            <option value="An giang" />
            <option value="Đồng tháp" />
            <option value="Vũng tàu" />
            <option value="Đông nai" />
            <option value="Đắk Lắk" />
          </datalist>
        </div>

        <div>
          <label htmlFor="soTien" className="block text-sm font-medium text-gray-700 mb-1">
            Số Tiền *
          </label>
          <input
            type="text"
            id="soTien"
            required
            inputMode="numeric"
            value={formData.soTien ? `${formatVndInput(formData.soTien)} đ` : ''}
            onChange={(e) => {
              const digits = digitsFromAnyInput(e.target.value);
              setFormData({ ...formData, soTien: digits });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập số tiền"
          />
        </div>

        <div>
          <label htmlFor="ngayThang" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày tháng *
          </label>
          <input
            type="date"
            id="ngayThang"
            required
            value={formData.ngayThang}
            onChange={(e) => setFormData({ ...formData, ngayThang: e.target.value })}
            className="w-[180px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

