'use client';

import { useState } from 'react';
import { addChiPhi } from '@/lib/steinSheets';

interface FormData {
  khoanChi: string;
  diaDiem: string;
  soTien: string;
  ngayThang: string;
}

function formatVndInput(digitsOnly: string) {
  const n = Number(digitsOnly || '0');
  if (!Number.isFinite(n) || n <= 0) return '';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n);
}

function digitsFromAnyInput(value: string) {
  return value.replace(/[^\d]/g, '');
}

export default function FormNhapLieu({
  dot,
  onSuccess,
}: {
  dot: string;
  onSuccess: () => void;
}) {
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

      await addChiPhi({
        dot,
        khoanChi: formData.khoanChi,
        diaDiem: formData.diaDiem,
        soTien: soTienNumber,
        ngayThang: formData.ngayThang,
      });

      setMessage('Đã lưu!');
      setFormData({
        khoanChi: '',
        diaDiem: '',
        soTien: '',
        ngayThang: new Date().toISOString().split('T')[0],
      });
      onSuccess();
    } catch (error) {
      setMessage('Lỗi khi lưu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full h-9 px-2.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-3">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label htmlFor="khoanChi" className="block text-xs font-medium text-slate-600 mb-0.5">
            Khoản chi
          </label>
          <input
            type="text"
            id="khoanChi"
            list="khoanChiOptions"
            required
            value={formData.khoanChi}
            onChange={(e) => setFormData({ ...formData, khoanChi: e.target.value })}
            className={inputClass}
            placeholder="Ăn, Xăng..."
          />
          <datalist id="khoanChiOptions">
            <option value="Ăn" />
            <option value="Nhà nghỉ" />
            <option value="ETC" />
            <option value="Xăng" />
          </datalist>
        </div>

        <div>
          <label htmlFor="diaDiem" className="block text-xs font-medium text-slate-600 mb-0.5">
            Địa điểm
          </label>
          <input
            type="text"
            id="diaDiem"
            list="diaDiemOptions"
            required
            value={formData.diaDiem}
            onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })}
            className={inputClass}
            placeholder="HCM, Châu đốc..."
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
          <label htmlFor="soTien" className="block text-xs font-medium text-slate-600 mb-0.5">
            Số tiền
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
            className={inputClass}
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="ngayThang" className="block text-xs font-medium text-slate-600 mb-0.5">
            Ngày
          </label>
          <input
            type="date"
            id="ngayThang"
            required
            value={formData.ngayThang}
            onChange={(e) => setFormData({ ...formData, ngayThang: e.target.value })}
            className={`${inputClass} date-input-compact max-w-[10.5rem] w-full`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 text-sm font-semibold bg-blue-600 text-white rounded-md active:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : 'Lưu chi phí'}
        </button>

        {message && (
          <p
            className={`text-center text-xs py-1.5 rounded ${
              message.includes('lưu') || message.includes('Lưu') || message === 'Đã lưu!'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
