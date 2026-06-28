"use client";

import { useState, useEffect } from "react";
import { redeemPromoCode, syncMining } from "../../lib/api";

export default function PromoCodesPage() {
  const [code, setCode] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    const user = await syncMining();
    if (user) setBalance(user.free_balance);
  }

  async function redeemCode() {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a promo code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await redeemPromoCode(code);

    if (result) {
      setBalance(prev => prev + result.reward);
      setMessage({ type: 'success', text: `Redeemed! +${result.reward} ${result.type}` });
      setCode('');
      await loadBalance();
    } else {
      setMessage({ type: 'error', text: 'Invalid or expired promo code' });
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
        <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
        
        <div className="space-y-3 text-zinc-400 text-sm">
          <p>• Enter a promo code above to redeem rewards</p>
          <p>• Promo codes give FREE tokens, mining boosts, or discounts</p>
          <p>• Each code can only be used once per user</p>
          <p>• Follow our social media for exclusive codes</p>
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
