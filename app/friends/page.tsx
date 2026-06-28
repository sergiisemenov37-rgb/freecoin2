"use client";

import { useState, useEffect } from "react";
import { getFriends, getFriendRequests, addFriend, acceptFriendRequest, rejectFriendRequest, sendMessage as sendApiMessage, getMessages } from "../../lib/api";
import { formatLastSeen, type Friend, type FriendRequest, type Message } from "../../lib/friends";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [friendsData, requestsData] = await Promise.all([
      getFriends(),
      getFriendRequests()
    ]);
    setFriends(friendsData);
    setRequests(requestsData);
    setLoading(false);
  }

  const filteredFriends = friends.filter(f => 
    f.users?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.users?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function sendFriendRequest(identifier: string) {
    const result = await addFriend(identifier);
    if (result) {
      alert('Friend request sent!');
    }
  }

  async function acceptRequest(requestId: string) {
    const result = await acceptFriendRequest(requestId);
    if (result) {
      setRequests(prev => prev.filter(r => r.id !== requestId));
      await loadData();
    }
  }

  async function rejectRequest(requestId: string) {
    const result = await rejectFriendRequest(requestId);
    if (result) {
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  }

  async function loadMessages(friendId: string) {
    const messagesData = await getMessages(friendId);
    setMessages(messagesData);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    const result = await sendMessage(selectedChat.friend_telegram_id, newMessage);
    
    if (result) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        from_telegram_id: 'me',
        to_telegram_id: selectedChat.friend_telegram_id,
        content: newMessage,
        type: 'text',
        read: false,
        created_at: new Date().toISOString()
      }]);
      setNewMessage('');
    }
    
    setSending(false);
  }

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.friend_telegram_id);
    }
  }, [selectedChat]);

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
            <h2 className="text-xl font-bold">{selectedChat.users?.first_name || 'Friend'}</h2>
            <p className="text-zinc-500 text-sm">@{selectedChat.users?.username || 'user'}</p>
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
            onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-xl px-6 font-bold"
          >
            {sending ? 'Sending...' : 'Send'}
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
                  <h3 className="font-bold text-white">{request.users?.first_name || 'User'}</h3>
                  <p className="text-zinc-500 text-sm">@{request.users?.username || 'user'}</p>
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
            id="friendInput"
            placeholder="Enter Telegram ID"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4 text-white"
          />

          <button
            onClick={() => {
              const input = document.getElementById('friendInput') as HTMLInputElement;
              if (input.value) sendFriendRequest(input.value);
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-4 font-bold"
          >
            Send Request
          </button>
        </div>
      )}
    </main>
  );
}
