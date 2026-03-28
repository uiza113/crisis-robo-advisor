"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SEED_ESCALATIONS } from "@/lib/seed-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, CheckCircle2, AlertOctagon, User, Clock, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdviserConsolePage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [cases, setCases] = useState(SEED_ESCALATIONS);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any).role !== "adviser") {
        router.push("/dashboard");
      }
    }
  }, [session, router]);

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-surface-300 text-surface-400 border-white/10';
    }
  };

  if (!session) return <div className="p-8 text-center text-surface-400 animate-pulse">Loading console...</div>;

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adviser Escalation Console</h1>
        <p className="text-surface-400 mt-1">Review flagged investor behaviors and liquidity constraints during market stress.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Queue List */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
          {cases.map(c => (
            <Card 
              key={c.id} 
              className={`cursor-pointer transition-colors ${selectedCaseId === c.id ? 'border-brand-500 bg-surface-200 shadow-xl shadow-brand-500/10' : 'border-white/5 hover:bg-surface-200'}`}
              onClick={() => setSelectedCaseId(c.id)}
            >
               <CardContent className="p-4 flex flex-col gap-3">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                     <User className="h-4 w-4 text-surface-400" />
                     <span className="font-semibold">{c.userName}</span>
                   </div>
                   <Badge variant="outline" className={`text-[10px] px-2 py-0 uppercase ${getStatusColor(c.status)}`}>
                     {c.status.replace('-', ' ')}
                   </Badge>
                 </div>
                 
                 <p className="text-xs text-surface-400 line-clamp-2 leading-relaxed">
                   {c.reason}
                 </p>
                 
                 <div className="flex justify-between items-center text-[10px] text-surface-500 font-mono mt-1 pt-3 border-t border-white/5">
                   <span>ID: {c.id}</span>
                   <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                 </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail View */}
        <div className="w-2/3 flex flex-col">
          {selectedCase ? (
            <Card className="flex-1 border-white/10 bg-surface-100 flex flex-col overflow-hidden">
               <CardHeader className="bg-surface-200/50 border-b border-white/5 pb-4">
                 <div className="flex justify-between items-start">
                   <div>
                     <CardTitle className="text-2xl font-bold mb-2">{selectedCase.userName}</CardTitle>
                     <div className="flex items-center gap-4 text-sm">
                       <span className="flex items-center gap-1 text-surface-400 font-mono">
                         <span className="text-white">Profile Score:</span> {selectedCase.riskScore}
                       </span>
                       <span className="flex items-center gap-1 text-surface-400">
                         <Clock className="h-3 w-3" /> QA Age: <span className="text-white">{selectedCase.questionnaireAge} mo</span>
                       </span>
                     </div>
                   </div>
                   <div className="flex gap-2">
                      <Button size="sm" variant={selectedCase.status === 'in-progress' ? "default" : "outline"} className={selectedCase.status === 'in-progress' ? "bg-amber-600 hover:bg-amber-500" : ""}>
                        {selectedCase.status === 'in-progress' ? "Resume Review" : "Start Review"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve
                      </Button>
                   </div>
                 </div>
               </CardHeader>
               
               <CardContent className="p-6 overflow-y-auto space-y-6 flex-1">
                 {/* Escalation Reason */}
                 <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500 flex items-center gap-2 mb-3">
                      <AlertOctagon className="h-4 w-4 text-red-400" /> Escalation Reason
                    </h3>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm leading-relaxed">
                      {selectedCase.reason}
                    </div>
                 </div>

                 {/* Behavioral Context */}
                 <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500">Recent Behavior</h3>
                      <ul className="space-y-2">
                        {selectedCase.recentBehavior.map((b, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                             <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5" />
                             {b}
                           </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 pl-6 border-l border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500">Flags</h3>
                      <div className="flex flex-col gap-2">
                        {selectedCase.panicSellSignal && (
                          <Badge variant="destructive" className="w-fit flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" /> Panic Sell Signal
                          </Badge>
                        )}
                        {selectedCase.liquidityRiskFlag && (
                          <Badge variant="default" className="w-fit flex items-center gap-2 bg-amber-500 hover:bg-amber-400">
                            <ShieldAlert className="h-3 w-3" /> Liquidity Risk
                          </Badge>
                        )}
                      </div>
                    </div>
                 </div>

                 {/* Compliance Notes */}
                 <div className="space-y-3 pt-6 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500">System Activity Log</h3>
                    <div className="bg-surface-200/50 p-4 rounded-lg font-mono text-xs text-surface-400 space-y-2">
                       {selectedCase.notes.concat(selectedCase.complianceNotes).map((n, i) => (
                         <div key={i}>[{formatDateTime(selectedCase.createdAt)}] {n}</div>
                       ))}
                    </div>
                 </div>

                 {/* Resolution Notes Input */}
                 <div className="space-y-2 pt-6 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-500">Adviser Notes</h3>
                    <Textarea 
                      placeholder="Document client interaction, changed circumstances, or rationale for overrides here..." 
                      className="min-h-[120px] bg-surface-200 border-white/10 resize-none text-sm placeholder:text-surface-500"
                    />
                 </div>
               </CardContent>
            </Card>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-surface-100/50 text-surface-500">
              <ShieldAlert className="h-12 w-12 text-surface-600 mb-4 opacity-50" />
              <p>Select a case from the queue to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
