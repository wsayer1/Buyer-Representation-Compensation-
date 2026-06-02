import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Calculation } from '../App';

interface Props {
  onSaved: () => void;
}

function CompensationCalculator({ onSaved }: Props) {
  const [salePrice, setSalePrice] = useState('');
  const [commissionRate, setCommissionRate] = useState('3.0');
  const [buyerAgentSplit, setBuyerAgentSplit] = useState('50');
  const [sellerConcession, setSellerConcession] = useState('0');
  const [buyerCredit, setBuyerCredit] = useState('0');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const price = parseFloat(salePrice) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const split = parseFloat(buyerAgentSplit) || 0;
  const concession = parseFloat(sellerConcession) || 0;
  const credit = parseFloat(buyerCredit) || 0;

  const totalCommission = price * (rate / 100);
  const buyerAgentCommission = totalCommission * (split / 100);
  const sellerConcessionAmount = price * (concession / 100);
  const totalCompensation = buyerAgentCommission + sellerConcessionAmount + credit;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSave = async () => {
    if (!price) return;
    setSaving(true);

    const calculation: Omit<Calculation, 'id' | 'created_at'> = {
      sale_price: price,
      commission_rate: rate,
      buyer_agent_split: split,
      seller_concession: concession,
      buyer_credit: credit,
      total_compensation: totalCompensation,
      notes,
    };

    const { error } = await supabase
      .from('calculations')
      .insert([calculation]);

    setSaving(false);

    if (!error) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onSaved();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-white">
        <h2 className="text-lg font-semibold text-slate-900">
          Compensation Calculator
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Calculate buyer agent compensation based on transaction details
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Sale Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="450,000"
                className="w-full pl-7 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Total Commission Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Buyer Agent Split (%)
            </label>
            <input
              type="number"
              step="1"
              value={buyerAgentSplit}
              onChange={(e) => setBuyerAgentSplit(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Seller Concession (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={sellerConcession}
              onChange={(e) => setSellerConcession(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional Buyer Credit ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={buyerCredit}
                onChange={(e) => setBuyerCredit(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Additional details about the compensation agreement..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none resize-none"
          />
        </div>

        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Compensation Breakdown
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Commission</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(totalCommission)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Buyer Agent Commission ({split}%)
              </span>
              <span className="font-medium text-slate-900">
                {formatCurrency(buyerAgentCommission)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Seller Concession</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(sellerConcessionAmount)}
              </span>
            </div>
            {credit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Additional Buyer Credit</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(credit)}
                </span>
              </div>
            )}
            <div className="border-t border-slate-300 pt-2.5 mt-2.5">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Total Buyer Agent Compensation
                </span>
                <span className="text-lg font-bold text-primary-700">
                  {formatCurrency(totalCompensation)}
                </span>
              </div>
              {price > 0 && (
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {((totalCompensation / price) * 100).toFixed(2)}% of sale
                  price
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!price || saving}
            className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {saving ? 'Saving...' : 'Save Calculation'}
          </button>
          {showSuccess && (
            <span className="text-sm text-success-600 font-medium animate-fade-in">
              Calculation saved successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompensationCalculator;
