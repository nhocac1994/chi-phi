'use client';

import { formatDotLabel } from '@/lib/steinSheets';
import IconButton, { IconChevronDown, IconPlus, IconTrash } from './IconButton';

interface DotChonProps {
  dots: string[];
  currentDot: string;
  onChangeDot: (dot: string) => void;
  onNewDot: () => void;
  onDeleteDot: () => void;
  deleting?: boolean;
}

export default function DotChon({
  dots,
  currentDot,
  onChangeDot,
  onNewDot,
  onDeleteDot,
  deleting = false,
}: DotChonProps) {
  return (
    <div className="flex items-center gap-2 relative z-30">
      <div className="relative flex-1 min-w-0">
        <select
          id="dot-select"
          value={currentDot}
          onChange={(e) => onChangeDot(e.target.value)}
          className="dot-select w-full h-9 pl-3 pr-9 text-sm font-semibold text-white bg-slate-700 border border-slate-500 rounded-lg appearance-none cursor-pointer relative z-10"
        >
          {dots.map((dot) => (
            <option key={dot} value={dot} className="text-slate-900 bg-white">
              {formatDotLabel(dot)}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 z-0"
          aria-hidden
        >
          <IconChevronDown />
        </span>
      </div>

      <IconButton label="Tạo đợt mới" onClick={onNewDot} variant="primary">
        <IconPlus className="w-5 h-5" />
      </IconButton>

      <IconButton
        label="Xóa hết đợt này"
        onClick={onDeleteDot}
        disabled={deleting}
        variant="danger"
      >
        {deleting ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <IconTrash className="w-[18px] h-[18px]" />
        )}
      </IconButton>
    </div>
  );
}
