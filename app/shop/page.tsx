"use client";

import { useState, useEffect } from "react";
import { purchaseItem as purchaseItemApi, getMyPurchases, syncMining } from "../../lib/api";
import { shopItems, getRarityColor, getRarityLabel, filterShopByType } from "../../lib/shop";

export default function ShopPage() {
  const [filter, setFilter] = useState<'all' | 'skin' | 'badge' | 'effect'>('all');
  const [balance, setBalance] = useState(0);
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [user, purchases] = await Promise.all([
      syncMining(),
      getMyPurchases()
    ]);
    if (user) setBalance(user.free_balance);
    setOwnedItems(purchases);
    setLoading(false);
  }

  const filteredItems = filter === 'all' 
    ? shopItems 
    : filterShopByType(shopItems, filter);

  async function purchaseItem(itemId: string, price: number) {
    if (balance < price) {
      alert(`Not enough FREE! Need ${price} FREE`);
      return;
    }

    setPurchasing(itemId);
    const result = await purchaseItemApi(itemId);
    
    if (result) {
      await loadData();
      alert('Purchase successful!');
    }
    
    setPurchasing(null);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-purple-400 mb-4">🛒 Shop</h1>

      {/* Balance */}
      <div className="bg-zinc-950 border border-green-700 rounded-3xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Your Balance</span>
          <span className="text-2xl font-bold text-green-400">{balance.toLocaleString()} FREE</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'skin', 'badge', 'effect'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              filter === type
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Shop Items */}
      <div className="grid gap-4">
        {filteredItems.map((item) => {
          const isOwned = ownedItems.some((owned: any) => owned.item_id === item.id);
          const canAfford = balance >= item.price;
          
          return (
            <div
              key={item.id}
              className={`bg-zinc-950 border rounded-3xl p-6 ${getRarityColor(item.rarity).split(' ')[1]}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{item.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(item.rarity)}`}>
                      {getRarityLabel(item.rarity)}
                    </span>
                  </div>
                  
                  <p className="text-zinc-500 text-sm mb-3">{item.description}</p>
                  
                  {item.duration && (
                    <p className="text-zinc-400 text-xs mb-2">Duration: {item.duration} days</p>
                  )}
                  
                  {item.effect && (
                    <div className="bg-zinc-900 rounded-xl p-2 mb-3">
                      <p className="text-green-400 text-xs">
                        {item.effect.type === 'mining_bonus' && `+${(item.effect.value * 100).toFixed(0)}% Mining`}
                        {item.effect.type === 'referral_bonus' && `+${(item.effect.value * 100).toFixed(0)}% Referrals`}
                        {item.effect.type === 'task_bonus' && `+${(item.effect.value * 100).toFixed(0)}% Tasks`}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-green-400">{item.price.toLocaleString()} FREE</p>
                    
                    {isOwned ? (
                      <div className="bg-green-950 border border-green-700 rounded-xl px-4 py-2">
                        <p className="text-green-400 font-bold">✓ Owned</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => purchaseItem(item.id, item.price)}
                        disabled={!canAfford || purchasing === item.id}
                        className={`px-4 py-2 rounded-xl font-bold transition ${
                          canAfford
                            ? 'bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700'
                            : 'bg-zinc-700 cursor-not-allowed'
                        }`}
                      >
                        {purchasing === item.id ? 'Buying...' : 'Buy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No items in this category</p>
        </div>
      )}
    </main>
  );
}
