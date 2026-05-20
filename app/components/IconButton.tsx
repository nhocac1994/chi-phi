'use client';

import type { ReactNode } from 'react';

type IconButtonVariant = 'default' | 'primary' | 'danger' | 'success' | 'light';

interface IconButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: IconButtonVariant;
  children: ReactNode;
}

const variants: Record<IconButtonVariant, string> = {
  default: 'bg-slate-600 text-white active:bg-slate-500 border-slate-500',
  primary: 'bg-indigo-500 text-white active:bg-indigo-400 border-indigo-400',
  danger: 'bg-red-500 text-white active:bg-red-400 border-red-400',
  success: 'bg-emerald-600 text-white active:bg-emerald-500 border-emerald-500',
  light: 'bg-slate-100 text-slate-700 active:bg-slate-200 border-slate-200',
};

export default function IconButton({
  label,
  onClick,
  disabled,
  variant = 'default',
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-lg border transition-colors disabled:opacity-40 disabled:pointer-events-none ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function IconPlus({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function IconTrash({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export function IconPrint({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );
}

export function IconRefresh({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

export function IconChevronDown({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
