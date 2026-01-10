import { LeadPriority, LeadStatus } from '@/types/crm.types';

export const getPriorityColor = (priority: LeadPriority | string) => {
  switch (priority) {
    case 'HOT':
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    case 'WARM':
      return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    case 'COLD':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
  }
};

export const getStatusColor = (status: LeadStatus | string) => {
  switch (status) {
    case 'NEW':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    case 'CONTACTED':
      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    case 'INTERESTED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    case 'QUOTED':
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    case 'NEGOTIATING':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
    case 'FOLLOW_UP_SCHEDULED':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100';
    case 'CONFIRMED':
      return 'bg-green-600 text-white border-green-700 hover:bg-green-700';
    case 'CLOSED_WON':
      return 'bg-green-600 text-white border-green-700 hover:bg-green-700';
    case 'CLOSED_LOST':
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    case 'NOT_INTERESTED':
      return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
  }
};

export const formatDate = (date: Date | string | null, includeTime = false) => {
  if (!date) return '-';
  const d = new Date(date);
  if (includeTime) {
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return '-';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString()}`;
};
