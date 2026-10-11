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
      <div className="border-b border-[#DED5C8]/10 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A95239] uppercase block mb-1 font-mono">
            Personal AI Concierge
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#F4EFE6] tracking-tight">
            Ask VAYN Stylist
          </h1>
          <p className="text-xs text-[#6D6961] mt-1">
            Private style advisory analyzing proportion, color theory, and your cataloged wardrobe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-[#A95239]/10 text-[#A95239] border border-[#A95239]/30 rounded">
            Context: {userItems.length} Garments • {profileArchetype}
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 text-xs bg-red-950/40 border border-red-800 text-red-200 flex items-center gap-2 rounded">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Chat Grid (Sidebar Sessions + Chat View) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[580px]">
        {/* Sessions Sidebar */}
        <VestraCard variant="bordered" padding="md" className="md:col-span-1 flex flex-col justify-between space-y-4 border-[#DED5C8]/15 bg-[#24231F]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DED5C8]/10">
              <span className="text-[10px] font-mono uppercase text-[#A95239] tracking-wider font-semibold">
                Consultations
              </span>
              <button
                type="button"
                onClick={handleCreateNewSession}
                className="p-1 text-[#6D6961] hover:text-[#F4EFE6] transition-colors"
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
                  className={`w-full text-left p-2.5 rounded border transition-all text-xs flex items-center justify-between ${
                    activeSessionId === sess.id
                      ? 'border-[#A95239] bg-[#A95239]/12 text-[#F4EFE6]'
                      : 'border-transparent text-[#6D6961] hover:bg-white/5 hover:text-[#F4EFE6]'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate font-medium">{sess.title}</span>
                    <span className="text-[10px] text-[#6D6961] font-mono block">
                      {new Date(sess.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#DED5C8]/10 text-[10px] text-[#6D6961] font-mono">
            VAYN Encrypted Advisory
          </div>
        </VestraCard>

        {/* Active Conversation Window */}
        <VestraCard variant="bordered" padding="md" className="md:col-span-3 flex flex-col justify-between h-[600px] border-[#DED5C8]/15 bg-[#24231F]">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* System Intro Card */}
            <div className="p-3.5 bg-[#1C1B18] border border-[#A95239]/30 rounded flex items-start gap-3">
              <Bot className="h-5 w-5 text-[#A95239] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-[#F4EFE6] uppercase tracking-wider block text-[10px] font-mono">
                  VAYN Stylist Active
                </span>
                <p className="text-[#6D6961] leading-relaxed">
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
                      <div className="h-7 w-7 rounded-full bg-[#1C1B18] border border-[#A95239]/40 flex items-center justify-center shrink-0 text-[#A95239]">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded p-3.5 space-y-2 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#A95239]/15 border border-[#A95239]/40 text-[#F4EFE6]'
                          : 'bg-[#24231F] border border-[#DED5C8]/15 text-[#E9E1D6]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Referenced Wardrobe Item Chips */}
                      {!isUser && referenced.length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[10px] text-[#A95239] font-mono uppercase tracking-wider block">
                            Referenced Wardrobe Pieces:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {referenced.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center gap-2 p-1.5 bg-black/50 border border-[#DED5C8]/10 rounded"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={it.imageUrl}
                                  alt={it.name}
                                  className="h-7 w-7 object-cover rounded"
                                />
                                <div className="text-[10px]">
                                  <span className="text-[#F4EFE6] font-medium block truncate max-w-[120px]">
                                    {it.name}
                                  </span>
                                  <span className="text-[#6D6961] font-mono block">
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
                      <div className="h-7 w-7 rounded-full bg-[#24231F] border border-[#DED5C8]/20 flex items-center justify-center shrink-0 text-[#6D6961]">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isSending && (
              <div className="flex items-center gap-3 text-xs text-[#6D6961] font-mono py-2">
                <Bot className="h-4 w-4 text-[#A95239] animate-pulse" />
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" /> VAYN Stylist is analyzing tailoring vectors...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Consultation Chips & Message Input */}
          <div className="pt-3 border-t border-[#DED5C8]/10 space-y-3">
            {/* Quick Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 text-[10px] font-mono rounded border border-[#DED5C8]/15 bg-[#24231F] text-[#6D6961] hover:text-[#A95239] hover:border-[#A95239]/40 shrink-0 transition-colors"
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
                className="flex-1 bg-[#1C1B18] border border-[#DED5C8]/20 rounded px-3 py-2 text-xs text-[#F4EFE6] placeholder-[#6D6961]/60 focus:border-[#A95239] focus:outline-none"
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
