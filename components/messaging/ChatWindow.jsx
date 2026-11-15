'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, Sparkles, CheckCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ChatWindow({
  conversation,
  messages = [],
  currentUserId,
  onSendMessage,
}) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(content.trim());
      setContent('');
    } finally {
      setSending(false);
    }
  };

  const counterpart = conversation?.counterpart || {};

  return (
    <div className="bg-white rounded-3xl border border-sage/60 overflow-hidden shadow-card flex flex-col h-[600px]">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-sage/40 bg-ivory-light flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm shadow-sm border border-emerald/40">
            {counterpart.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-charcoal">{counterpart.fullName}</h4>
            <span className="text-[11px] text-emerald font-semibold uppercase tracking-wider">
              {counterpart.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted bg-white px-3 py-1 rounded-full border border-sage/60">
          <Shield className="w-3.5 h-3.5 text-forest" />
          <span>Encrypted Channel</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-ivory/20">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-xs text-charcoal-muted">
            <Sparkles className="w-6 h-6 text-emerald mx-auto mb-2" />
            <p className="font-semibold text-charcoal">Beginning of direct thread</p>
            <p>Send a message below to coordinate pitch documents, diligence, or agenda.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?.toString() === currentUserId?.toString();

            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-semibold text-charcoal-muted">
                    {msg.senderName}
                  </span>
                  <span className="text-[9px] text-charcoal-muted/70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-forest text-white rounded-br-none'
                      : 'bg-white text-charcoal border border-sage/60 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-sage/40 flex items-center gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message ${counterpart.fullName || 'partner'}...`}
          className="flex-1 bg-ivory/60 border border-sage-dark/60 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder-charcoal-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={sending}
          disabled={!content.trim()}
          className="rounded-2xl px-5"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

