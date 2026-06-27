"use client";

import { useState } from "react";
import { formatLastSeen, getOnlineStatus, type Friend, type FriendRequest, type Message } from "../../lib/friends";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');
  const [friends, setFriends] = useState<Friend[]>([
    {
      telegram_id: '1',
      username: 'crypto_king',
      first_name: 'Alex',
      status: 'online',
      last_seen: new Date().toISOString(),
      added_at: '2024-01-01'
    },
    {
      telegram_id: '2',
      username: 'miner_pro',
      first_name: 'John',
      status: 'mining',
      last_seen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      added_at: '2024-01-15'
    }
  ]);
  const [requests, setRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      from_telegram_id: '3',
      to_telegram_id: 'me',
      from_username: 'newbie_miner',
      from_first_name: 'Mike',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function sendFriendRequest(username: string) {
    // Simulate API call
    alert(`Friend request sent to ${username}`);
  }

  async function acceptRequest(requestId: string) {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    // Add to friends in real app
  }

  async function rejectRequest(requestId: string) {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      from_telegram_id: 'me',
      to_telegram_id: selectedChat.telegram_id,
      content: newMessage,
      type: 'text',
      read: false,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  }

  if (selectedChat) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedChat(null)}
            className="text-zinc-400 hover:text-white"
          >
            ← Back
          </button>
          <div className="text-3xl">💬</div>
          <div>
            <h2 className="text-xl font-bold">{selectedChat.first_name}</h2>
            <p className="text-zinc-500 text-sm">@{selectedChat.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from_telegram_id === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl p-3 ${
                      msg.from_telegram_id === 'me'
                        ? 'bg-green-600 text-white'
                        : 'bg-zinc-800 text-white'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-500 rounded-xl px-6 font-bold"
          >
            Send
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-blue-400 mb-6">👥 Friends</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'friends' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'requests' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          Requests ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          Add Friend
        </button>
      </div>

      {activeTab === 'friends' && (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6 text-white"
          />

          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <div
                key={friend.telegram_id}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${
                        friend.status === 'online' ? 'bg-green-500' :
                        friend.status === 'mining' ? 'bg-yellow-500' : 'bg-zinc-500'
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-white">{friend.first_name}</h3>
                    <p className="text-zinc-500 text-sm">@{friend.username}</p>
                    <p className="text-zinc-600 text-xs">{formatLastSeen(friend.last_seen)}</p>
                  </div>

                  <button
                    onClick={() => setSelectedChat(friend)}
                    className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-2 font-bold"
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}

            {filteredFriends.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-500">No friends found</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.filter(r => r.status === 'pending').map((request) => (
            <div
              key={request.id}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-white">{request.from_first_name}</h3>
                  <p className="text-zinc-500 text-sm">@{request.from_username}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(request.id)}
                    className="bg-green-600 hover:bg-green-500 rounded-xl px-4 py-2 font-bold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(request.id)}
                    className="bg-red-600 hover:bg-red-500 rounded-xl px-4 py-2 font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          {requests.filter(r => r.status === 'pending').length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500">No pending requests</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Add Friend</h2>
          
          <input
            type="text"
            placeholder="Enter username or Telegram ID"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 text-white"
          />

          <button
            onClick={() => sendFriendRequest('username')}
            className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-bold"
          >
            Send Request
          </button>
        </div>
      )}
    </main>
  );
}
