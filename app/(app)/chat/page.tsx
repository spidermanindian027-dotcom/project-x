'use client';

import * as React from 'react';
import {
  Send,
  Plus,
  MessageSquare,
  Bot,
  User,
  AlertCircle,
} from 'lucide-react';
import { VestraButton } from '@/components/ui/vestra-button';
import { VestraCard } from '@/components/ui/vestra-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Session {
  id: string;
  title: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface Message {
  id: string;
  role: string;
  content: string;
  referencedItemIds: string[];
  createdAt: string;
}

interface WardrobeItem {
  id: string;
  name: string;
  dominantColor: string;
  imageUrl: string;
  category: string;
}

const QUICK_PROMPTS = [
  'Suggest an outfit from my wardrobe',
  'What should I wear to a wedding?',
  'What colors suit my profile?',
  'How should I style oversized tailoring?',
];

export default function StylistChatPage() {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState<string>('');
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = React.useState<boolean>(false);
  const [userItems, setUserItems] = React.useState<WardrobeItem[]>([]);
  const [profileArchetype, setProfileArchetype] = React.useState<string>('Quiet Luxury');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Initial load: fetch wardrobe items, profile, and sessions
  React.useEffect(() => {
    async function init() {
      try {
        const [sessRes, itemsRes, profRes] = await Promise.all([
          fetch('/api/stylist/sessions'),
          fetch('/api/wardrobe'),
          fetch('/api/profile'),
        ]);

        if (itemsRes.ok) {
          const iData = await itemsRes.json();
          setUserItems(iData.items || []);
        }

        if (profRes.ok) {
          const pData = await profRes.json();
          if (pData.profile?.primaryArchetype) {
            setProfileArchetype(pData.profile.primaryArchetype.replace(/_/g, ' '));
          }
        }

        if (sessRes.ok) {
          const sData = await sessRes.json();
          const list = sData.sessions || [];
          setSessions(list);
          if (list.length > 0) {
            setActiveSessionId(list[0].id);
          } else {
            // Auto create first session
            const newSess = await fetch('/api/stylist/sessions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'Atelier Consultation' }),
            });
            if (newSess.ok) {
              const created = await newSess.json();
              setSessions([created.session]);
              setActiveSessionId(created.session.id);
            }
          }
        }
      } catch {
        // silent
      }
    }
    init();
  }, []);

  // Fetch messages when activeSessionId changes
  React.useEffect(() => {
    if (!activeSessionId) return;
    let active = true;

    async function loadChat() {
      try {
        const res = await fetch(`/api/stylist/chat?sessionId=${activeSessionId}`);
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch {
        // silent
      } finally {
        if (active) {
          setLoadingHistory(false);
        }
      }
    }

    loadChat();

    return () => {
      active = false;
    };
  }, [activeSessionId]);

  const handleCreateNewSession = async () => {
    try {
      const res = await fetch('/api/stylist/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Atelier Consultation' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions((prev) => [data.session, ...prev]);
        setActiveSessionId(data.session.id);
        setMessages([]);
      }
    } catch {
      setFeedback('Failed to start a new consultation session.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeSessionId || isSending) return;

    setInputMessage('');
    setIsSending(true);
    setFeedback(null);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: `temp_${messages.length + 1}`,
      role: 'user',
      content: text,
      referencedItemIds: [],
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/stylist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          content: text,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to receive styling advice');
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setFeedback((err as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-[#9ca3af]/15 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#e8c547] uppercase block mb-1">
            Personal Concierge
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#f5f0e8] tracking-tight">
            Ask VESTRA Stylist
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Private couture advisory analyzing proportion, color theory, and your cataloged inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#e8c547]/10 text-[#e8c547] border border-[#e8c547]/30 rounded-sm">
            Context: {userItems.length} Garments • {profileArchetype}
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 text-xs bg-red-950/40 border border-red-800 text-red-200 flex items-center gap-2 rounded-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Chat Grid (Sidebar Sessions + Chat View) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[580px]">
        {/* Sessions Sidebar */}
        <VestraCard variant="bordered" padding="md" className="md:col-span-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#9ca3af]/15">
              <span className="text-[10px] font-mono uppercase text-[#e8c547] tracking-wider">
                Consultations
              </span>
              <button
                type="button"
                onClick={handleCreateNewSession}
                className="p-1 text-[#9ca3af] hover:text-[#f5f0e8] transition-colors"
                title="New Consultation"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {sessions.map((sess) => (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => setActiveSessionId(sess.id)}
                  className={`w-full text-left p-2.5 rounded-sm border transition-all text-xs flex items-center justify-between ${
                    activeSessionId === sess.id
                      ? 'border-[#e8c547] bg-[#e8c547]/10 text-[#f5f0e8]'
                      : 'border-transparent text-[#9ca3af] hover:bg-white/5 hover:text-[#f5f0e8]'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate font-medium">{sess.title}</span>
                    <span className="text-[10px] text-[#9ca3af] font-mono block">
                      {new Date(sess.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#9ca3af]/10 text-[10px] text-[#9ca3af] font-mono">
            Encrypted End-to-End
          </div>
        </VestraCard>

        {/* Active Conversation Window */}
        <VestraCard variant="bordered" padding="md" className="md:col-span-3 flex flex-col justify-between h-[600px]">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* System Intro Card */}
            <div className="p-3.5 bg-[#262626]/50 border border-[#e8c547]/30 rounded-sm flex items-start gap-3">
              <Bot className="h-5 w-5 text-[#e8c547] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-[#f5f0e8] uppercase tracking-wider block text-[10px]">
                  VESTRA Atelier Stylist Active
                </span>
                <p className="text-[#9ca3af] leading-relaxed">
                  Calibrated to your {profileArchetype} compass with access to your {userItems.length} cataloged wardrobe pieces. Inquire about color pairings, proportion balancing, or occasion dressing.
                </p>
              </div>
            </div>

            {loadingHistory ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                const referenced = userItems.filter((i) => msg.referencedItemIds?.includes(i.id));

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="h-7 w-7 rounded-full bg-[#1a1a1a] border border-[#e8c547]/40 flex items-center justify-center shrink-0 text-[#e8c547]">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-sm p-3.5 space-y-2 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#e8c547]/15 border border-[#e8c547]/40 text-[#f5f0e8]'
                          : 'bg-[#262626]/70 border border-[#9ca3af]/20 text-[#d4cfc7]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Referenced Wardrobe Item Chips */}
                      {!isUser && referenced.length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[10px] text-[#e8c547] font-mono uppercase tracking-wider block">
                            Referenced Wardrobe Pieces:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {referenced.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center gap-2 p-1.5 bg-black/50 border border-white/10 rounded-sm"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={it.imageUrl}
                                  alt={it.name}
                                  className="h-7 w-7 object-cover rounded-sm"
                                />
                                <div className="text-[10px]">
                                  <span className="text-[#f5f0e8] font-medium block truncate max-w-[120px]">
                                    {it.name}
                                  </span>
                                  <span className="text-[#9ca3af] font-mono block">
                                    {it.dominantColor}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="h-7 w-7 rounded-full bg-[#262626] border border-[#9ca3af]/30 flex items-center justify-center shrink-0 text-[#9ca3af]">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isSending && (
              <div className="flex items-center gap-3 text-xs text-[#9ca3af] font-mono py-2">
                <Bot className="h-4 w-4 text-[#e8c547] animate-pulse" />
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" /> Atelier Stylist is analyzing tailoring vectors...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Consultation Chips & Message Input */}
          <div className="pt-3 border-t border-[#9ca3af]/15 space-y-3">
            {/* Quick Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 text-[10px] font-mono rounded-sm border border-[#9ca3af]/25 bg-[#262626]/40 text-[#9ca3af] hover:text-[#e8c547] hover:border-[#e8c547]/40 shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask your stylist: 'What shoes pair with these trousers?' or 'Suggest an outfit'..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending}
                className="flex-1 bg-[#262626] border border-[#9ca3af]/30 rounded-sm px-3 py-2 text-xs text-[#f5f0e8] placeholder-[#9ca3af]/50 focus:border-[#e8c547] focus:outline-none"
              />
              <VestraButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSending || !inputMessage.trim()}
                leftIcon={<Send className="h-3.5 w-3.5" />}
              >
                Send
              </VestraButton>
            </form>
          </div>
        </VestraCard>
      </div>
    </div>
  );
}
