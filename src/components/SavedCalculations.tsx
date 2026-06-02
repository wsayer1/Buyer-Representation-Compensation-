import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Calculation } from '../App';

interface Props {
  calculations: Calculation[];
  onLoad: (calcs: Calculation[]) => void;
  refreshKey: number;
}

function SavedCalculations({ calculations, onLoad, refreshKey }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalculations();
  }, [refreshKey]);

  const fetchCalculations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('calculations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      onLoad(data);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Recent Calculations
        </h2>
        <button
          onClick={fetchCalculations}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 mt-2">Loading...</p>
          </div>
        ) : calculations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No saved calculations yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Use the calculator to create your first one
            </p>
          </div>
        ) : (
          calculations.map((calc) => (
            <div
              key={calc.id}
              className="px-5 py-4 hover:bg-slate-50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {formatCurrency(calc.sale_price)} sale
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {calc.commission_rate}% commission &middot;{' '}
                    {calc.buyer_agent_split}% split
                  </p>
                  {calc.notes && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {calc.notes}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-primary-700">
                    {formatCurrency(calc.total_compensation)}
                  </p>
                  {calc.created_at && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDate(calc.created_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedCalculations;
