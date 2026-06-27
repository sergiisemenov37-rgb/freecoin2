export interface VoteProposal {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'balance' | 'event' | 'rule';
  proposer_id: string;
  proposer_name: string;
  created_at: string;
  ends_at: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votes_for: number;
  votes_against: number;
  total_votes: number;
  min_votes_required: number;
}

export interface Vote {
  id: string;
  proposal_id: string;
  voter_id: string;
  choice: 'for' | 'against';
  created_at: string;
}

export const VOTING_DURATION_DAYS = 7;
export const MIN_VOTES_REQUIRED = 10;
export const PASS_THRESHOLD = 0.6; // 60% to pass

export function createProposal(
  title: string,
  description: string,
  type: VoteProposal['type'],
  proposerId: string,
  proposerName: string
): VoteProposal {
  const now = new Date();
  const endsAt = new Date(now);
  endsAt.setDate(now.getDate() + VOTING_DURATION_DAYS);
  
  return {
    id: `proposal-${Date.now()}`,
    title,
    description,
    type,
    proposer_id: proposerId,
    proposer_name: proposerName,
    created_at: now.toISOString(),
    ends_at: endsAt.toISOString(),
    status: 'active',
    votes_for: 0,
    votes_against: 0,
    total_votes: 0,
    min_votes_required: MIN_VOTES_REQUIRED
  };
}

export function castVote(proposal: VoteProposal, choice: 'for' | 'against'): VoteProposal {
  if (choice === 'for') {
    proposal.votes_for++;
  } else {
    proposal.votes_against++;
  }
  
  proposal.total_votes++;
  proposal = checkProposalStatus(proposal);
  
  return proposal;
}

export function checkProposalStatus(proposal: VoteProposal): VoteProposal {
  const now = new Date();
  const endsAt = new Date(proposal.ends_at);
  
  // Check if expired
  if (now > endsAt && proposal.status === 'active') {
    proposal.status = 'expired';
    return proposal;
  }
  
  // Check if passed/rejected
  if (proposal.total_votes >= proposal.min_votes_required) {
    const forPercentage = proposal.votes_for / proposal.total_votes;
    
    if (forPercentage >= PASS_THRESHOLD) {
      proposal.status = 'passed';
    } else if (proposal.total_votes >= proposal.min_votes_required * 2) {
      proposal.status = 'rejected';
    }
  }
  
  return proposal;
}

export function getVotePercentage(proposal: VoteProposal, choice: 'for' | 'against'): number {
  if (proposal.total_votes === 0) return 0;
  
  const votes = choice === 'for' ? proposal.votes_for : proposal.votes_against;
  return (votes / proposal.total_votes) * 100;
}

export function getTimeUntilVotingEnd(endsAt: string): string {
  const now = new Date();
  const endDate = new Date(endsAt);
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function canVote(proposal: VoteProposal, lastVotedTime: string | null): boolean {
  if (proposal.status !== 'active') return false;
  
  const now = new Date();
  const endsAt = new Date(proposal.ends_at);
  
  if (now > endsAt) return false;
  
  // Check if already voted (in real app, check database)
  if (lastVotedTime) return false;
  
  return true;
}

export function getProposalTypeIcon(type: VoteProposal['type']): string {
  const icons = {
    feature: '✨',
    balance: '⚖️',
    event: '🎉',
    rule: '📜'
  };
  return icons[type];
}

export function getProposalTypeColor(type: VoteProposal['type']): string {
  const colors = {
    feature: 'text-blue-400',
    balance: 'text-yellow-400',
    event: 'text-green-400',
    rule: 'text-purple-400'
  };
  return colors[type];
}
