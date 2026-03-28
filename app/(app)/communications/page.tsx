"use client";

import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertTriangle, Info, BellRing, Lock } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function CommunicationsPage() {
  const { messages, markMessageRead } = useAppStore();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high': return <BellRing className="h-5 w-5 text-amber-500" />;
      case 'medium': return <Info className="h-5 w-5 text-blue-400" />;
      default: return <Info className="h-5 w-5 text-surface-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return "bg-red-500/10 border-red-500/20 text-red-400";
      case 'high': return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case 'medium': return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      default: return "bg-surface-200 border-white/5 text-surface-400";
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message Center</h1>
          <p className="text-surface-400 mt-1">Review your personalized updates, educational content, and alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="text-sm px-3 py-1 animate-pulse">
            {unreadCount} unread message{unreadCount !== 1 && 's'}
          </Badge>
        )}
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card className="bg-surface-100 border-white/5 p-12 text-center">
            <Mail className="h-12 w-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No messages</h3>
            <p className="text-surface-400">You're all caught up on your communications.</p>
          </Card>
        ) : (
          messages.map(msg => (
            <Card 
              key={msg.id} 
              className={`border transition-all duration-300 ${msg.read ? 'border-white/5 opacity-80' : 'border-brand-500/30 bg-surface-100/90 shadow-[0_0_20px_rgba(99,102,241,0.1)]'}`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Status Indicator Bar */}
                <div className={`w-1 shrink-0 ${!msg.read && msg.priority === 'urgent' ? 'bg-red-500' : !msg.read ? 'bg-brand-500' : 'bg-transparent'}`} />
                
                <CardContent className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-surface-200 h-10 w-10 shrink-0 rounded-full flex items-center justify-center">
                    {msg.type === 'fraud-warning' ? <Lock className="h-5 w-5 text-red-400" /> : getPriorityIcon(msg.priority)}
                  </div>
                  
                  <div className="flex-1 space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`text-lg font-bold ${!msg.read ? 'text-white' : 'text-surface-300'}`}>{msg.title}</h3>
                          {!msg.read && <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                           <Badge variant="glass" className={`text-xs px-2 py-0 border ${getPriorityColor(msg.priority)}`}>
                             {msg.priority.toUpperCase()}
                           </Badge>
                           <span className="text-xs text-surface-500 capitalize">{msg.type.replace('-', ' ')}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-surface-500 shrink-0">{timeAgo(msg.timestamp)}</span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${!msg.read ? 'text-surface-100' : 'text-surface-400'}`}>
                      {msg.content}
                    </p>
                    
                    {!msg.read && (
                      <div className="pt-4 flex justify-end">
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="text-xs border-brand-500/30 text-brand-400 hover:bg-brand-500/10"
                           onClick={() => markMessageRead(msg.id)}
                         >
                           <CheckCircle className="mr-2 h-4 w-4" /> Mark as Read
                         </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
