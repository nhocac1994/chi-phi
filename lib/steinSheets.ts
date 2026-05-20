export interface ChiPhi {
  id?: number;
  dot: string;
  khoanChi: string;
  diaDiem: string;
  soTien: number;
  ngayThang: string;
}

type SteinRow = Record<string, string>;

export const DOT_COLUMN = 'Đợt';
export const DEFAULT_DOT = '1';
const STORAGE_KEY = 'chi-phi-current-dot';

function getApiUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_STEIN_API_URL ||
    process.env.STEIN_API_URL;
  if (!url) {
    throw new Error('STEIN_API_URL hoặc NEXT_PUBLIC_STEIN_API_URL chưa được cấu hình');
  }
  return url;
}

export function normalizeDot(value?: string): string {
  const v = (value || '').trim();
  return v || DEFAULT_DOT;
}

export function formatDotLabel(dot: string): string {
  const n = normalizeDot(dot);
  return n.startsWith('Đợt') ? n : `Đợt ${n}`;
}

export function getDotsFromData(data: ChiPhi[]): string[] {
  const dots = new Set(data.map((item) => normalizeDot(item.dot)));
  return Array.from(dots).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return na - nb || a.localeCompare(b, 'vi');
  });
}

export function getNextDot(existing: string[]): string {
  const nums = existing.map((d) => parseInt(d.replace(/\D/g, ''), 10) || 0);
  return String(Math.max(0, ...nums, 0) + 1);
}

export function loadStoredDot(): string {
  if (typeof window === 'undefined') return DEFAULT_DOT;
  return normalizeDot(localStorage.getItem(STORAGE_KEY) || DEFAULT_DOT);
}

export function saveStoredDot(dot: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, normalizeDot(dot));
}

function rowToChiPhi(row: SteinRow): ChiPhi {
  return {
    id: parseInt(row['#'] || '0', 10),
    dot: normalizeDot(row[DOT_COLUMN]),
    khoanChi: row['Khoan Chi'] || '',
    diaDiem: row['Địa điểm'] || '',
    soTien: parseFloat(row['Sô Tiền'] || '0'),
    ngayThang: row['Ngày tháng'] || '',
  };
}

function chiPhiToRow(id: number, data: Omit<ChiPhi, 'id'>): SteinRow {
  return {
    '#': id.toString(),
    [DOT_COLUMN]: normalizeDot(data.dot),
    'Khoan Chi': data.khoanChi,
    'Địa điểm': data.diaDiem,
    'Sô Tiền': data.soTien.toString(),
    'Ngày tháng': data.ngayThang,
  };
}

async function fetchRows(): Promise<SteinRow[]> {
  const response = await fetch(getApiUrl(), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Không thể đọc dữ liệu: ${response.status}`);
  }
  return response.json();
}

async function steinDelete(body: { condition: SteinRow; limit?: number }) {
  const response = await fetch(getApiUrl(), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Không thể xóa dữ liệu: ${response.status}`);
  }
  const result = await response.json();
  return result.clearedRowsCount as number;
}

async function steinPut(body: { condition: SteinRow; set: SteinRow; limit?: number }) {
  const response = await fetch(getApiUrl(), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Không thể cập nhật dữ liệu: ${response.status}`);
  }
}

async function reindexDot(dot: string): Promise<void> {
  const all = await getChiPhi();
  const dotData = all.filter((item) => normalizeDot(item.dot) === normalizeDot(dot));
  const updates = dotData
    .map((item, index) => ({ item, expectedId: index + 1 }))
    .filter(({ item, expectedId }) => item.id !== expectedId)
    .sort((a, b) => (b.item.id ?? 0) - (a.item.id ?? 0));

  for (const { item, expectedId } of updates) {
    await steinPut({
      condition: { '#': String(item.id), [DOT_COLUMN]: normalizeDot(dot) },
      set: { '#': String(expectedId) },
      limit: 1,
    });
  }
}

export async function getChiPhi(): Promise<ChiPhi[]> {
  try {
    const rows = await fetchRows();
    return rows.map(rowToChiPhi).filter((item) => item.id && item.id > 0);
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ Stein API:', error);
    throw error;
  }
}

export async function addChiPhi(data: Omit<ChiPhi, 'id'>): Promise<void> {
  try {
    const rows = await fetchRows();
    const dot = normalizeDot(data.dot);
    const dotRows = rows.filter((r) => normalizeDot(r[DOT_COLUMN]) === dot);
    const newId =
      dotRows.length === 0
        ? 1
        : Math.max(...dotRows.map((r) => parseInt(r['#'] || '0', 10))) + 1;

    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([chiPhiToRow(newId, { ...data, dot })]),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Không thể thêm dữ liệu: ${response.status}`);
    }
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào Stein API:', error);
    throw error;
  }
}

export async function deleteChiPhi(id: number, dot: string): Promise<void> {
  try {
    await steinDelete({
      condition: { '#': id.toString(), [DOT_COLUMN]: normalizeDot(dot) },
      limit: 1,
    });
    await reindexDot(dot);
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu từ Stein API:', error);
    throw error;
  }
}

/** Xóa toàn bộ chi phí của một đợt */
export async function deleteAllDot(dot: string): Promise<number> {
  const normalized = normalizeDot(dot);
  let total = 0;
  let cleared = 1;

  while (cleared > 0) {
    cleared = await steinDelete({
      condition: { [DOT_COLUMN]: normalized },
      limit: 50,
    });
    total += cleared;
  }

  return total;
}

export async function initSheet(): Promise<void> {
  await fetchRows();
}
