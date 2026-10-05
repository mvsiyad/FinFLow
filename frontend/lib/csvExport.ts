import { Transaction } from './api';

/**
 * Escapes a cell value for standard CSV formatting (RFC 4180)
 */
function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports an array of transactions to a CSV file and triggers browser download
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  fileNamePrefix: string = 'finflow-transactions'
): void {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const headers = ['Transaction ID', 'Title', 'Type', 'Category', 'Amount ($)', 'Date'];

  const rows = transactions.map((tx) => [
    escapeCsvCell(tx.id),
    escapeCsvCell(tx.title),
    escapeCsvCell(tx.type),
    escapeCsvCell(tx.category),
    escapeCsvCell(tx.type === 'EXPENSE' ? `-${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)),
    escapeCsvCell(new Date(tx.date).toISOString().split('T')[0]),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const dateStamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileNamePrefix}-${dateStamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
