import React, { useState } from 'react';
import { CommunityIdea } from '../types';

interface CommunityIdeasCardProps {
  idea: CommunityIdea;
  onSelectSymbol?: (symbol: string) => void;
}

export const CommunityIdeasCard: React.FC<CommunityIdeasCardProps> = ({
  idea,
  onSelectSymbol
}) => {
  const [likes, setLikes] = useState(idea.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState(idea.comments);
  const [newCommentText, setNewCommentText] = useState('');

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newC = {
      id: `c-${Date.now()}`,
      author: 'You (Trader)',
      time: 'Just now',
      text: newCommentText.trim(),
      likes: 1
    };
    setComments([newC, ...comments]);
    setNewCommentText('');
  };

  return (
    <>
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Community Ideas</h2>
          <span className="text-[10px] text-[#2962ff] font-semibold bg-[#2962ff]/10 border border-[#2962ff]/30 px-2 py-0.5 rounded">
            Editors&apos; Pick
          </span>
        </div>

        {/* Idea Card */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-[#131722] border border-[#2a2e39] rounded p-3 group cursor-pointer hover:border-[#363a45] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2962ff] text-white text-[10px] flex items-center justify-center font-bold">
                {idea.authorInitials}
              </div>
              <span className="text-xs text-[#d1d4dc] font-medium">{idea.author}</span>
            </div>
            <span className="bg-[#089981]/15 text-[#22ab94] border border-[#089981]/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
              {idea.badgeText}
            </span>
          </div>

          <h4 className="text-xs text-white font-medium mb-2 leading-tight group-hover:text-[#2962ff] transition-colors">
            {idea.title}
          </h4>

          <div className="w-full h-28 rounded bg-[#1b1f2b] overflow-hidden relative mb-2 border border-[#2a2e39]">
            <img
              referrerPolicy="no-referrer"
              src={idea.imageUrl}
              alt={idea.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#787b86]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1 transition-colors ${
                  hasLiked ? 'text-[#2962ff] font-bold' : 'hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xs">thumb_up</span>
                <span>{likes}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xs">chat</span>
                <span>{comments.length}</span>
              </button>
            </div>
            <span>{idea.timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Community Idea Full Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1e222d] border border-[#363a45] rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#787b86] hover:text-white p-1 rounded-full bg-[#131722] hover:bg-[#2a2e39] transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2962ff] text-white text-xs flex items-center justify-center font-bold">
                  {idea.authorInitials}
                </div>
                <div>
                  <div className="text-sm text-white font-semibold">{idea.author}</div>
                  <div className="text-[11px] text-[#787b86]">{idea.timeAgo} • Pro Trader</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectSymbol) onSelectSymbol('NVDA');
                    setShowModal(false);
                  }}
                  className="bg-[#089981]/15 text-[#22ab94] border border-[#089981]/30 text-xs font-bold px-2 py-1 rounded hover:bg-[#089981]/25 transition-colors"
                >
                  {idea.badgeText}
                </button>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-3">
              {idea.title}
            </h3>

            <div className="w-full h-64 rounded-lg overflow-hidden mb-4 border border-[#2a2e39]">
              <img
                referrerPolicy="no-referrer"
                src={idea.imageUrl}
                alt={idea.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-[#d1d4dc] leading-relaxed mb-6">
              {idea.description}
            </p>

            {/* Like and Action rail */}
            <div className="flex items-center justify-between py-3 border-y border-[#2a2e39] mb-4">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
                  hasLiked
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'bg-[#131722] text-[#d1d4dc] hover:bg-[#2a2e39]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">thumb_up</span>
                <span>{likes} Agree</span>
              </button>

              <span className="text-xs text-[#787b86]">
                {comments.length} Discussion Comments
              </span>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Join the analysis discussion..."
                className="flex-1 bg-[#131722] border border-[#2a2e39] focus:border-[#2962ff] rounded px-3 py-1.5 text-xs text-white placeholder:text-[#50535e] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#2962ff] hover:bg-[#1e53e5] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shrink-0"
              >
                Post
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5">
              {comments.map((c) => (
                <div key={c.id} className="p-2.5 bg-[#131722] border border-[#2a2e39] rounded text-xs">
                  <div className="flex justify-between items-center text-[10px] text-[#787b86] mb-1">
                    <span className="font-semibold text-white">{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-[#d1d4dc]">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
