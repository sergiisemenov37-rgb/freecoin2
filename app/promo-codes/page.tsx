"use client";

import { useState } from "react";
import { validatePromoCode, applyPromoCode, samplePromoCodes } from "../../lib/promoCodes";

export default function PromoCodesPage() {
  const [code, setCode] = useState('');
  const [balance, setBalance] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function redeemCode() {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a promo code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const promo = validatePromoCode(code, samplePromoCodes);

    if (!promo) {
      setMessage({ type: 'error', text: 'Invalid or expired promo code' });
      setLoading(false);
      return;
    }

    const result = applyPromoCode(promo, 'user_id');

    if (result.success) {
      setBalance(prev => prev + result.reward);
      setMessage({ type: 'success', text: result.message });
      setCode('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-green-400 mb-8">🎁 Promo Codes</h1>

      {/* Balance */}
      <div className="bg-zinc-950 border border-green-700 rounded-3xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Your Balance</span>
          <span className="text-2xl font-bold text-green-400">{balance.toLocaleString()} FREE</span>
        </div>
      </div>

      {/* Promo Code Input */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Redeem Promo Code</h2>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white uppercase"
          />
          
          <button
            onClick={redeemCode}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-xl px-6 font-bold transition"
          >
            {loading ? '...' : 'Redeem'}
          </button>
        </div>

        {message && (
          <div className={`rounded-xl p-3 text-center ${
            message.type === 'success' 
              ? 'bg-green-950 border border-green-700 text-green-400' 
              : 'bg-red-950 border border-red-700 text-red-400'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Active Promo Codes */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Active Promo Codes</h2>
        
        <div className="space-y-3">
          {samplePromoCodes.filter(p => p.active).map((promo) => (
            <div key={promo.code} className="bg-zinc-900 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg">{promo.code}</h3>
                  <p className="text-zinc-500 text-sm">
                    {promo.type === 'balance' && `+${promo.reward} FREE`}
                    {promo.type === 'mining_boost' && `+${promo.reward}% Mining Boost (${promo.duration} days)`}
                    {promo.type === 'ticket_discount' && `${promo.reward}% Lottery Discount`}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-zinc-500 text-xs">
                    {promo.currentUses}/{promo.maxUses} uses
                  </p>
                  <p className="text-zinc-500 text-xs">
                    Expires: {new Date(promo.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {promo.currentUses >= promo.maxUses && (
                <div className="bg-red-950 border border-red-700 rounded-lg p-2 text-center">
                  <p className="text-red-400 text-sm">Max uses reached</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-950 border border-blue-700 rounded-3xl p-6">
        <h3 className="font-bold text-blue-400 mb-2">💡 Tips</h3>
        <ul className="text-zinc-400 text-sm space-y-1">
          <li>• Follow our social media for exclusive promo codes</li>
          <li>• Promo codes are case-insensitive</li>
          <li>• Each promo code has limited uses</li>
          <li>• Check back regularly for new codes</li>
        </ul>
      </div>
    </main>
  );
}
