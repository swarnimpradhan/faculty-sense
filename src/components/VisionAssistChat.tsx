import React, { useState } from 'react';
import { MessageSquare, X, ScanFace, Send, Sparkles, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

interface VisionAssistChatProps {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  onToggleExternal?: () => void;
}

export const VisionAssistChat: React.FC<VisionAssistChatProps> = ({
  isOpenExternal,
  onCloseExternal,
  onToggleExternal,
}) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  
  const handleToggle = () => {
    if (onToggleExternal) {
      onToggleExternal();
    } else if (onCloseExternal && isOpen) {
      onCloseExternal();
    } else {
      setInternalOpen(prev => !prev);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I'm Vision Assist, your AIML & Biometrics helper. How can I assist you with RetinaFace, ArcFace 512-d embeddings, liveness anti-spoofing, or faculty enrollment?"
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const SUGGESTIONS = [
    "How does ArcFace 512-d embedding work?",
    "Explain liveness anti-spoofing checks",
    "How do I enrol a new faculty member?",
    "Why does lighting affect cosine similarity?"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Knowledge Engine Response Generator
    setTimeout(() => {
      let replyText = "RetinaFace detects facial landmarks, then ArcFace computes a 512-dimensional vector. FAISS compares cosine distance against enrolled faculty embeddings to verify identity.";
      
      const lower = text.toLowerCase();
      if (lower.includes('arcface') || lower.includes('512') || lower.includes('embedding')) {
        replyText = "ArcFace (Additive Angular Margin Loss) projects 112x112 aligned face crops onto a hyper-spherical feature space with an angular margin penalty (m=0.5). It extracts a deterministic 512-dimensional vector where cosine distance direct measures identity similarity.";
      } else if (lower.includes('liveness') || lower.includes('anti-spoof') || lower.includes('spoof')) {
        replyText = "Liveness anti-spoofing uses MobileNet texture analysis combined with micro-expression jitter and reflection screening to ensure a live human face is in front of the camera rather than a printed photo or digital screen.";
      } else if (lower.includes('enrol') || lower.includes('register') || lower.includes('add')) {
        replyText = "Click the '+ Enrol Faculty' button in the header bar. Fill in the faculty member's name, department, designation, and upload or provide a face photo URL. The system will extract their 512-d ArcFace vector and register them instantly!";
      } else if (lower.includes('lighting') || lower.includes('similarity') || lower.includes('confidence')) {
        replyText = "Low lighting alters pixel intensity grids and shadow landmark alignments. RetinaFace affine transformation normalizes alignment, but extreme shadows reduce cosine score. We recommend keeping matching threshold set to 60%-75%.";
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {isOpen && (
        <div className="panel animate-rise flex h-[520px] w-[380px] flex-col overflow-hidden backdrop-blur-xl border border-border/80 shadow-glow">
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-border/70 bg-secondary/40 px-4 py-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Bot className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-display truncate text-sm font-bold">Vision Assist AI</p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AIML · Deep Learning Helper
              </p>
            </div>
            <button
              onClick={handleToggle}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </header>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <ScanFace className="size-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-br-none'
                      : 'bg-secondary/70 border border-border/70 text-foreground font-sans rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 text-xs text-muted-foreground font-mono items-center pt-1">
                <Sparkles className="size-3.5 text-primary animate-spin" />
                <span>Vision Assist is analyzing...</span>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length < 3 && (
            <div className="px-3 py-2 border-t border-border/60 bg-secondary/20 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-left text-[11px] text-muted-foreground transition-all hover:border-primary hover:text-foreground hover:bg-secondary cursor-pointer truncate max-w-full"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Prompt Input Bar */}
          <div className="border-t border-border/70 p-3 bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Vision Assist..."
                className="flex-1 rounded-full border border-border bg-secondary/30 px-3.5 py-2 text-xs outline-none focus:border-primary focus:bg-background transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleToggle}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-all hover:scale-105 active:scale-95 cursor-pointer relative"
      >
        {isOpen ? <X className="size-6" /> : <MessageSquare className="size-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white border-2 border-background">
            AI
          </span>
        )}
      </button>
    </div>
  );
};
