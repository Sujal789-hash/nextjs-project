'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/dashboard/layout';
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';
import { MessageSquare, Shield, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load conversations
  const loadConversations = async () => {
    try {
      const [meRes, convRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/messages'),
      ]);

      const me = meRes.ok ? await meRes.json() : {};
      const convData = convRes.ok ? await convRes.json() : { conversations: [] };

      setUser(me.user || null);
      setConversations(convData.conversations || []);

      if (convData.conversations?.length > 0 && !activeConvId) {
        setActiveConvId(convData.conversations[0]._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${activeConvId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessages();
  }, [activeConvId]);

  const handleSendMessage = async (text) => {
    if (!activeConvId) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvId,
          content: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        loadConversations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeConv = conversations.find((c) => c._id === activeConvId);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2">
              <span>Direct In-App Venture Messaging</span>
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              End-to-end coordinated communications between verified startup founders and accredited partners.
            </p>
          </div>

          <Badge variant="gold">
            <Shield className="w-3.5 h-3.5 text-gold-dark" />
            Confidential Venture Channel
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations}
              activeId={activeConvId}
              onSelect={(id) => setActiveConvId(id)}
            />
          </div>

          <div className="lg:col-span-2">
            {activeConv ? (
              <ChatWindow
                conversation={activeConv}
                messages={messages}
                currentUserId={user?.id}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="h-[600px] bg-white rounded-3xl border border-sage/60 flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="w-12 h-12 text-forest opacity-40 mb-3" />
                <h4 className="text-base font-bold text-charcoal">Select a conversation thread</h4>
                <p className="text-xs text-charcoal-muted max-w-sm mt-1">
                  Choose a founder or investor contact from the left list to review message history and collaborate on diligence.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

