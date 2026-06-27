"use client";

import { getCurrentEvent, getActiveBonusMultiplier, formatEventDuration } from "../lib/events";

export default function EventCard() {
  const event = getCurrentEvent();
  const bonusMultiplier = getActiveBonusMultiplier();

  if (!event || !event.active) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-950 to-pink-950 border border-purple-500 rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{event.icon}</div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{event.name}</h2>
          <p className="text-purple-300 text-sm mt-1">{event.description}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="bg-purple-900/50 rounded-xl px-3 py-1">
              <span className="text-purple-300 text-sm">Bonus: </span>
              <span className="text-white font-bold">{bonusMultiplier}x</span>
            </div>
            
            <div className="bg-purple-900/50 rounded-xl px-3 py-1">
              <span className="text-purple-300 text-sm">Ends in: </span>
              <span className="text-white font-bold">{formatEventDuration(event)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
