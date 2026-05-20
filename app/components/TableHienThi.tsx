'use client';

import { deleteChiPhi, type ChiPhi } from '@/lib/steinSheets';
import IconButton, { IconPrint, IconRefresh } from './IconButton';

interface TableHienThiProps {
  data: ChiPhi[];
  currentDot: string;
  loading: boolean;
  error: string;
  onRefresh: () => void;
}

export default function TableHienThi({
  data,
  currentDot,
  loading,
  error,
  onRefresh,
}: TableHienThiProps) {
  const total = data.reduce((sum, item) => sum + item.soTien, 0);

  const formatMoney = (amount: number, compact = false) => {
    const n = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount);
    return compact ? n : `${n} đ`;
  };

  const formatDate = (dateString: string, forPrint = false) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (forPrint) {
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return d.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    });
  };

  const handlePrint = () => window.print();

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa chi phí này?')) return;
    try {
      await deleteChiPhi(id, currentDot);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Không thể xóa');
    }
  };

  return (
    <div className="print-report max-w-6xl mx-auto px-2 py-3 sm:px-4 sm:py-4 bg-white rounded-lg shadow-sm sm:shadow-md">
      <h2
        className="print-title hidden text-center font-bold text-gray-800"
        aria-hidden
      >
        Báo Cáo Chi Phí
      </h2>

      <div className="no-print flex items-center justify-between gap-2 mb-2">
        <h2 className="text-base font-bold text-gray-800">Báo Cáo Chi Phí</h2>
        <div className="flex shrink-0 gap-1.5">
          <IconButton label="In báo cáo" onClick={handlePrint} variant="light">
            <IconPrint className="w-[18px] h-[18px] text-emerald-700" />
          </IconButton>
          <IconButton
            label="Làm mới dữ liệu"
            onClick={onRefresh}
            disabled={loading}
            variant="light"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <IconRefresh className="w-[18px] h-[18px] text-blue-700" />
            )}
          </IconButton>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6 no-print">Đang tải...</p>
      ) : error && data.length === 0 ? (
        <p className="text-sm text-red-600 px-2 py-4 no-print">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6 no-print">Chưa có dữ liệu</p>
      ) : (
        <>
          <div className="overflow-x-auto -mx-0.5">
            <table className="report-table">
              <thead>
                <tr>
                  <th className="col-stt">#</th>
                  <th className="col-khoan">Khoản chi</th>
                  <th className="col-dia">Địa điểm</th>
                  <th className="col-money">Tiền</th>
                  <th className="col-date">Ngày</th>
                  <th className="col-action no-print" aria-label="Thao tác" />
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="col-stt text-slate-500">{item.id}</td>
                    <td className="col-khoan font-medium truncate">{item.khoanChi}</td>
                    <td className="col-dia truncate text-slate-600">{item.diaDiem}</td>
                    <td className="col-money">{formatMoney(item.soTien)}</td>
                    <td className="col-date">
                      <span className="screen-date">{formatDate(item.ngayThang)}</span>
                      <span className="print-date">{formatDate(item.ngayThang, true)}</span>
                    </td>
                    <td className="col-action no-print">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id!)}
                        className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded active:bg-red-100"
                        aria-label="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold">
                  <td colSpan={3} className="text-xs sm:text-sm">
                    Tổng ({data.length} khoản)
                  </td>
                  <td className="col-money text-sm">{formatMoney(total)}</td>
                  <td className="col-date" />
                  <td className="no-print" />
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="no-print mt-2 text-right text-sm font-bold text-gray-800 sm:hidden">
            Tổng: {formatMoney(total)}
          </p>
        </>
      )}
    </div>
  );
}
