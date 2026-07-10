import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../../types';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard }) => {
  const [animatingRows, setAnimatingRows] = useState<Set<number>>(new Set());
  const [highlightedRanks, setHighlightedRanks] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Trigger animation for all rows on load/update
    const animationSet = new Set(leaderboard.map((_, idx) => idx));
    setAnimatingRows(animationSet);

    // Highlight top 3 ranks for special glow effect
    const ranks = new Set(leaderboard.filter((entry) => entry.rank! <= 3).map((entry) => entry.rank!));
    setHighlightedRanks(ranks);

    // Remove animation class after completion to allow re-animation
    const timer = setTimeout(() => {
      setAnimatingRows(new Set());
    }, 600);

    return () => clearTimeout(timer);
  }, [leaderboard]);

  const getMedalIcon = (rank?: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500 animate-medal-spin" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400 animate-medal-spin" size={24} style={{ animationDelay: '100ms' }} />;
    if (rank === 3) return <Medal className="text-orange-600 animate-medal-spin" size={24} style={{ animationDelay: '200ms' }} />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <table className="w-full">
        <thead style={{ backgroundColor: '#E8F5E9' }} className="border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Score (Points)</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Avg Response Time (ms)</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leaderboard.map((entry, index) => {
            const isAnimating = animatingRows.has(index);
            const isTopRank = highlightedRanks.has(entry.rank!);
            // Cap the staggered entrance delay so large leaderboards don't take 5+ seconds to fully appear.
            const animationDelay = `${Math.min(index, 5) * 100}ms`;

            return (
              <tr
                key={entry.participant_id}
                className={`hover:bg-gray-50 transition-all ${isAnimating ? 'animate-leaderboard-row' : ''} ${isTopRank ? 'animate-top-rank-glow' : ''}`}
                style={{
                  animationDelay: isAnimating ? animationDelay : 'unset',
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getMedalIcon(entry.rank)}
                    <span className="text-lg font-bold text-gray-900">{entry.rank}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm font-medium ${isAnimating ? 'animate-name-fade' : 'text-gray-900'}`}
                    style={{ animationDelay: isAnimating ? animationDelay : 'unset' }}>
                  {entry.name}
                </td>
                <td className={`px-6 py-4 text-right text-lg font-bold text-success ${isAnimating ? 'animate-score-counter' : ''}`}
                    style={{
                      animationDelay: isAnimating ? animationDelay : 'unset'
                    }}>
                  {entry.score}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-600">
                  {entry.questions_answered > 0
                    ? Math.round(entry.total_time_ms / entry.questions_answered)
                    : 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
