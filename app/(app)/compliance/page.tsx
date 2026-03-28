"use client";

import { COMPLIANCE_DISCLOSURES } from "@/lib/seed-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileBadge, ShieldAlert } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-16 w-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-4">
          <FileBadge className="h-8 w-8 text-brand-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Legal & Compliance Disclosures</h1>
        <p className="text-surface-400">Important information about the limitations and nature of this demonstration.</p>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-start gap-4 mb-12">
        <ShieldAlert className="h-6 w-6 text-red-400 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-bold text-red-200 mb-2">Critical Demo Notice</h2>
          <p className="text-sm text-red-300/90 leading-relaxed">
            This application is a conceptual **educational demonstration only**. It does not constitute investment advice, is not registered with any regulatory body (such as the SEC or FINRA), and does not manage actual funds. The portfolios, risk assessments, and crisis response mechanisms shown are simplified illustrations designed to explore robo-advisory architectures. Do not use this application to make personal financial decisions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {COMPLIANCE_DISCLOSURES.map((disc) => (
          <Card key={disc.id} className="border-white/10 bg-surface-100">
            <CardHeader className="pb-3 border-b border-white/5 bg-surface-200/50">
               <CardTitle className="text-lg flex justify-between items-center text-white">
                 {disc.title}
                 <span className="text-xs font-mono text-surface-500 font-normal">v{disc.version} • {disc.effectiveDate}</span>
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
               <div className="text-sm text-surface-300 leading-relaxed space-y-4">
                 {disc.content.split('\n\n').map((para, i) => (
                   <p key={i}>{para}</p>
                 ))}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-surface-500 max-w-2xl mx-auto leading-relaxed">
         By using this demonstration, you acknowledge that you understand its educational nature and limitations. The creators of this demo assume no liability for any investment decisions made by users.
      </div>
    </div>
  );
}
