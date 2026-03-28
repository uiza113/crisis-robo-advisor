"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SEED_AUDIT_LOG } from "@/lib/seed-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Database, FileText, Activity, Users } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [logs, setLogs] = useState(SEED_AUDIT_LOG);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any).role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [session, router]);

  if (!session) return <div className="p-8 text-center text-surface-400 animate-pulse">Loading audit logs...</div>;

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(search.toLowerCase()) || 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.detail.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile-change': return <Users className="h-4 w-4 text-blue-400" />;
      case 'recommendation': return <FileText className="h-4 w-4 text-emerald-400" />;
      case 'escalation': return <ShieldCheck className="h-4 w-4 text-amber-400" />;
      case 'crisis': return <Activity className="h-4 w-4 text-red-400" />;
      default: return <Database className="h-4 w-4 text-surface-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-400 flex items-center gap-3">
             <ShieldCheck className="h-8 w-8" /> Compliance Audit Trail
          </h1>
          <p className="text-surface-400 mt-1">Immutable ledger of system decisions, crisis state changes, and adviser overrides.</p>
        </div>
      </div>

      <Card className="border-white/5 bg-surface-100 overflow-hidden">
        <CardHeader className="bg-surface-200/30 border-b border-white/5">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <CardTitle>System Activity Logs</CardTitle>
               <CardDescription>Filtering {filteredLogs.length} of {logs.length} records</CardDescription>
             </div>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                <Input 
                  placeholder="Search by user or event..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
             </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-surface-300/30 border-b border-white/10 text-surface-400">
                <tr>
                  <th className="px-6 py-4 font-semibold w-56">Timestamp</th>
                  <th className="px-6 py-4 font-semibold w-48">Actor</th>
                  <th className="px-6 py-4 font-semibold">Event Detail</th>
                  <th className="px-6 py-4 font-semibold text-right w-40">System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-200/50 transition-colors">
                    <td className="px-6 py-4 text-surface-400 whitespace-nowrap">
                       {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-white font-sans font-medium">
                       {log.userName}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 mb-1">
                         {getCategoryIcon(log.category)}
                         <span className="font-bold text-surface-200">{log.action}</span>
                       </div>
                       <span className="text-surface-400 max-w-2xl block">{log.detail}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Badge variant="outline" className="border-surface-400 text-surface-400 text-[10px] px-1.5 font-mono bg-transparent">
                          {log.performedBy.toUpperCase()}
                       </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-surface-500 font-sans">
                 No audit logs match your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
