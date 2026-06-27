"use client";

import { useState } from "react";
import { createProposal, castVote, getVotePercentage, getTimeUntilVotingEnd, getProposalTypeIcon, getProposalTypeColor, type VoteProposal } from "../../lib/voting";

export default function VotingPage() {
  const [proposals, setProposals] = useState<VoteProposal[]>([
    createProposal(
      'Add daily bonus for VIP users',
      'Give VIP users an extra daily bonus based on their level',
      'feature',
      'admin',
      'Admin'
    ),
    createProposal(
      'Increase mining rewards on weekends',
      'Double mining rewards during weekends to encourage activity',
      'event',
      'community',
      'Community Member'
    )
  ]);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', type: 'feature' as VoteProposal['type'] });

  async function vote(proposalId: string, choice: 'for' | 'against') {
    if (myVotes.has(proposalId)) {
      alert('You already voted on this proposal');
      return;
    }

    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return castVote(p, choice);
      }
      return p;
    }));

    setMyVotes(prev => new Set([...prev, proposalId]));
  }

  async function createNewProposal() {
    if (!newProposal.title || !newProposal.description) {
      alert('Please fill in all fields');
      return;
    }

    const proposal = createProposal(
      newProposal.title,
      newProposal.description,
      newProposal.type,
      'me',
      'You'
    );

    setProposals(prev => [proposal, ...prev]);
    setShowCreate(false);
    setNewProposal({ title: '', description: '', type: 'feature' });
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-cyan-400 mb-6">🗳️ Voting</h1>

      {/* Create Proposal Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-3xl py-4 font-bold text-xl mb-6 transition"
      >
        Create Proposal
      </button>

      {/* Create Proposal Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-950 border border-cyan-700 rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create Proposal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 text-sm">Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
                  placeholder="Enter proposal title"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
                  placeholder="Describe your proposal"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm">Type</label>
                <select
                  value={newProposal.type}
                  onChange={(e) => setNewProposal({ ...newProposal, type: e.target.value as VoteProposal['type'] })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1 text-white"
                >
                  <option value="feature">Feature Request</option>
                  <option value="balance">Balance Change</option>
                  <option value="event">Event Proposal</option>
                  <option value="rule">Rule Change</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-xl py-3 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewProposal}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 rounded-xl py-3 font-bold transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Active Proposals</h2>
        
        {proposals.map((proposal) => {
          const hasVoted = myVotes.has(proposal.id);
          const forPercentage = getVotePercentage(proposal, 'for');
          const againstPercentage = getVotePercentage(proposal, 'against');
          const timeLeft = getTimeUntilVotingEnd(proposal.ends_at);
          
          return (
            <div
              key={proposal.id}
              className={`bg-zinc-950 border rounded-3xl p-6 ${
                proposal.status === 'passed' ? 'border-green-700' :
                proposal.status === 'rejected' ? 'border-red-700' :
                proposal.status === 'expired' ? 'border-zinc-700' : 'border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{getProposalTypeIcon(proposal.type)}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getProposalTypeColor(proposal.type)}`}>
                      {proposal.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      proposal.status === 'active' ? 'bg-green-600' :
                      proposal.status === 'passed' ? 'bg-blue-600' :
                      proposal.status === 'rejected' ? 'bg-red-600' : 'bg-zinc-600'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  
                  <p className="text-zinc-500 text-sm mb-2">{proposal.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>By {proposal.proposer_name}</span>
                    <span>•</span>
                    <span>Ends in {timeLeft}</span>
                  </div>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-400">For: {proposal.votes_for} ({forPercentage.toFixed(0)}%)</span>
                  <span className="text-red-400">Against: {proposal.votes_against} ({againstPercentage.toFixed(0)}%)</span>
                </div>
                
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 transition-all"
                    style={{ width: `${forPercentage}%` }}
                  />
                  <div 
                    className="bg-red-500 transition-all"
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>
                
                <p className="text-zinc-500 text-xs mt-1">
                  {proposal.total_votes}/{proposal.min_votes_required} votes required
                </p>
              </div>

              {/* Vote Buttons */}
              {proposal.status === 'active' && !hasVoted && (
                <div className="flex gap-3">
                  <button
                    onClick={() => vote(proposal.id, 'for')}
                    className="flex-1 bg-green-600 hover:bg-green-500 rounded-xl py-3 font-bold transition"
                  >
                    👍 For
                  </button>
                  <button
                    onClick={() => vote(proposal.id, 'against')}
                    className="flex-1 bg-red-600 hover:bg-red-500 rounded-xl py-3 font-bold transition"
                  >
                    👎 Against
                  </button>
                </div>
              )}

              {hasVoted && (
                <div className="bg-zinc-900 rounded-xl p-3 text-center">
                  <p className="text-zinc-400 text-sm">✓ You voted</p>
                </div>
              )}
            </div>
          );
        })}

        {proposals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No active proposals</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-950 border border-blue-700 rounded-3xl p-6">
        <h3 className="font-bold text-blue-400 mb-2">ℹ️ How Voting Works</h3>
        <ul className="text-zinc-400 text-sm space-y-1">
          <li>• Proposals need minimum votes to be valid</li>
          <li>• 60% "For" votes needed to pass</li>
          <li>• Active for 7 days</li>
          <li>• One vote per proposal</li>
        </ul>
      </div>
    </main>
  );
}
