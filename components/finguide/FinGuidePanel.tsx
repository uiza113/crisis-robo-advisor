"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { getFinGuideResponse } from "@/lib/finguide";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Bot, User, Send, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FinGuidePanel() {
  const { finGuideOpen, toggleFinGuide, finGuideMessages, addFinGuideMessage } = useAppStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (finGuideMessages.length === 0) {
      addFinGuideMessage({
        id: "initial",
        role: "assistant",
        content: "Hi! I'm FinGuide, your educational assistant. I can help explain concepts like ETFs, diversification, rebalancing, and how crisis mode works. What would you like to know?",
        timestamp: new Date().toISOString()
      });
    }
  }, [addFinGuideMessage, finGuideMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [finGuideMessages, finGuideOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addFinGuideMessage({
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    });

    setInput("");

    // Simulate network delay
    setTimeout(() => {
      const response = getFinGuideResponse(input);
      addFinGuideMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toISOString()
      });
    }, 600);
  };

  return (
    <AnimatePresence>
      {finGuideOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 w-[380px] sm:w-[420px]"
        >
          <Card className="h-[600px] flex flex-col shadow-2xl border-brand-500/20 bg-surface-100/95 backdrop-blur-xl">
            <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">FinGuide</CardTitle>
                  <p className="text-xs text-muted-foreground">Educational Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleFinGuide}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col gap-4">
                {finGuideMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                        msg.role === "user"
                          ? "bg-surface-300 text-white"
                          : "bg-brand-500 text-white"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                        msg.role === "user"
                          ? "bg-surface-300 text-white"
                          : "bg-surface-200 border border-white/5 text-foreground"
                      }`}
                    >
                      {/* Very basic markdown rendering for the demo */}
                      {msg.content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <strong key={i} className="block mb-2 font-semibold text-white">{line.replace(/\*\*/g, '')}</strong>;
                        }
                        if (line.startsWith('•')) {
                          return <div key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 mb-1">{line.substring(2)}</div>;
                        }
                        if (line.includes('⚠️')) {
                            return <div key={i} className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-200/90 rounded text-xs">{line}</div>;
                        }
                        if (line === '') return <div key={i} className="h-2" />;
                        return <p key={i} className="mb-1 leading-relaxed">{line}</p>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="p-3 border-t border-white/5 bg-surface-50">
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input
                  className="flex-1 bg-surface-200 border-white/10"
                  placeholder="Ask about ETFs, risk..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
