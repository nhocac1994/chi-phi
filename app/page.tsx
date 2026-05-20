'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import FormNhapLieu from './components/FormNhapLieu';
import TableHienThi from './components/TableHienThi';
import DotChon from './components/DotChon';
import {
  getChiPhi,
  deleteAllDot,
  getDotsFromData,
  getNextDot,
  loadStoredDot,
  saveStoredDot,
  normalizeDot,
  formatDotLabel,
  DEFAULT_DOT,
  type ChiPhi,
} from '@/lib/steinSheets';

export default function Home() {
  const [currentView, setCurrentView] = useState<'form' | 'table'>('form');
  const [data, setData] = useState<ChiPhi[]>([]);
  const [currentDot, setCurrentDot] = useState(DEFAULT_DOT);
  const [loading, setLoading] = useState(true);
  const [deletingDot, setDeletingDot] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentDot(loadStoredDot());
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getChiPhi();
      setData(result);
      setError('');

      const dots = getDotsFromData(result);
      setCurrentDot((prev) => {
        const stored = normalizeDot(prev);
        if (dots.includes(stored)) return stored;
        const fallback = dots[dots.length - 1] || DEFAULT_DOT;
        saveStoredDot(fallback);
        return fallback;
      });
    } catch {
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dots = useMemo(() => {
    const list = getDotsFromData(data);
    if (!list.includes(currentDot)) {
      return [...list, currentDot].sort((a, b) => {
        const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return na - nb;
      });
    }
    return list.length > 0 ? list : [currentDot];
  }, [data, currentDot]);

  const filteredData = useMemo(
    () => data.filter((item) => normalizeDot(item.dot) === normalizeDot(currentDot)),
    [data, currentDot]
  );

  const handleChangeDot = (dot: string) => {
    const n = normalizeDot(dot);
    setCurrentDot(n);
    saveStoredDot(n);
  };

  const handleNewDot = () => {
    const next = getNextDot(dots);
    setCurrentDot(next);
    saveStoredDot(next);
    alert(`Đã chuyển sang ${formatDotLabel(next)}. Chi phí mới sẽ lưu vào đợt này.`);
  };

  const handleDeleteDot = async () => {
    if (!confirm(`Xóa TOÀN BỘ chi phí ${formatDotLabel(currentDot)}?`)) return;

    try {
      setDeletingDot(true);
      const count = await deleteAllDot(currentDot);
      await loadData();
      alert(count > 0 ? `Đã xóa ${count} dòng.` : 'Đợt này chưa có dữ liệu.');
    } catch {
      alert('Không thể xóa dữ liệu đợt này');
    } finally {
      setDeletingDot(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 pb-6">
      <header className="sticky top-0 z-30 bg-slate-800 text-white shadow-md overflow-visible">
        <div className="px-3 pt-2.5 pb-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight truncate">Chi Phí Đi Lại</h1>
            <p className="text-[11px] text-slate-400 truncate">
              {loading ? 'Đang tải...' : `${filteredData.length} khoản`}
            </p>
          </div>
        </div>

        <div className="px-3 pb-2.5 relative z-40">
          <DotChon
            dots={dots}
            currentDot={currentDot}
            onChangeDot={handleChangeDot}
            onNewDot={handleNewDot}
            onDeleteDot={handleDeleteDot}
            deleting={deletingDot}
          />
        </div>

        <nav className="flex border-t border-slate-700">
          <button
            type="button"
            onClick={() => setCurrentView('form')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              currentView === 'form'
                ? 'bg-white text-slate-800'
                : 'text-slate-300 active:bg-slate-700'
            }`}
          >
            Nhập
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('table')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              currentView === 'table'
                ? 'bg-white text-slate-800'
                : 'text-slate-300 active:bg-slate-700'
            }`}
          >
            Báo cáo
          </button>
        </nav>
      </header>

      <div className="px-2 py-3 max-w-lg mx-auto sm:max-w-2xl">
        {currentView === 'form' ? (
          <FormNhapLieu dot={currentDot} onSuccess={loadData} />
        ) : (
          <TableHienThi
            data={filteredData}
            loading={loading}
            error={error}
            currentDot={currentDot}
            onRefresh={loadData}
          />
        )}
      </div>
    </main>
  );
}
