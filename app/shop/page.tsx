"use client";

import { useState } from "react";
import { shopItems, getRarityColor, getRarityLabel, filterShopByType, type ShopItem } from "../../lib/shop";

export default function ShopPage() {
  const [filter, setFilter] = useState<'all' | 'skin' | 'badge' | 'effect'>('all');
  const [balance, setBalance] = useState(10000);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredItems = filter === 'all' 
    ? shopItems 
    : filterShopByType(shopItems, filter);

  async function purchaseItem(item: ShopItem) {
    if (balance < item.price) {
      alert(`Not enough FREE! Need ${item.price} FREE`);
      return;
    }

    if (ownedItems.includes(item.id)) {
      alert('You already own this item!');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setBalance(prev => prev - item.price);
    setOwnedItems(prev => [...prev, item.id]);
    setLoading(false);

    alert(`Purchased ${item.name}!`);
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
          const isOwned = ownedItems.includes(item.id);
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
                        onClick={() => purchaseItem(item)}
                        disabled={!canAfford || loading}
                        className={`px-4 py-2 rounded-xl font-bold transition ${
                          canAfford
                            ? 'bg-purple-600 hover:bg-purple-500'
                            : 'bg-zinc-700 cursor-not-allowed'
                        }`}
                      >
                        Buy
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
