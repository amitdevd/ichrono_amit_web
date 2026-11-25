import { Platform } from 'react-native';

/**
 * Admin "Export" buttons: download the rows currently shown in a table as a CSV file.
 * Web only (front-end demo); on native it returns false so the caller can say so.
 */
export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return false;
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
