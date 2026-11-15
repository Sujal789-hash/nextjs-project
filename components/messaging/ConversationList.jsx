'use client';
import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function ConversationList({
  conversations = [],
  activeId,
  onSelect,
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-sage/60">
        <MessageSquare className="w-8 h-8 text-forest mx-auto mb-2 opacity-40" />
        <p className="text-sm font-semibold text-charcoal">No active messages</p>
        <p className="text-xs text-charcoal-muted mt-1">
          When you connect or request meetings, direct conversation threads will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-sage/60 overflow-hidden shadow-card">
      <div className="p-4 border-b border-sage/40 bg-ivory-light">
        <h3 className="text-sm font-bold text-charcoal">Active Conversations</h3>
        <p className="text-xs text-charcoal-muted">Encrypted Direct Venture Messaging</p>
      </div>

      <div className="divide-y divide-sage/40 max-h-[550px] overflow-y-auto">
        {conversations.map((conv) => {
          const isActive = conv._id === activeId;
          const counterpart = conv.counterpart || {};

          return (
            <button
              key={conv._id}
              onClick={() => onSelect(conv._id)}
              className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                isActive ? 'bg-sage-light' : 'hover:bg-ivory/60'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm shrink-0 border border-emerald/30 shadow-xs">
                {counterpart.fullName?.charAt(0) || 'U'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-charcoal truncate">
                    {counterpart.fullName || 'Venture Partner'}
                  </h4>
                  <span className="text-[10px] text-charcoal-muted shrink-0">
                    {conv.lastMessage?.createdAt
                      ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>

                <span className="text-[10px] font-semibold text-emerald uppercase tracking-wider block">
                  {counterpart.role}
                </span>

                <p className="text-xs text-charcoal-muted truncate mt-1">
                  {conv.lastMessage?.text || 'Started a conversation'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

