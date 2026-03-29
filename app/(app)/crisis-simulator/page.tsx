"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { runCrisisEngine } from "@/lib/crisis-engine";
import { MARKET_SCENARIOS, getProfileByUserId, getPortfolioByUserId } from "@/lib/seed-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert, ActivitySquare, AlertTriangle, Info, CheckCircle2, RefreshCw, LineChart } from "lucide-react";
import { severityColor, severityBg, actionColor, actionLabel } from "@/lib/utils";
import { MarketScenario } from "@/types";

export default function CrisisSimulatorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const { 
    currentUser, 
    riskProfile, 
    portfolio, 
    activeScenario, 
    setActiveScenario,
    crisisAssessment,
    setCrisisAssessment
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [anxietyLevel, setAnxietyLevel] = useState([0]); // 0-10
  const [needsLiquidity, setNeedsLiquidity] = useState(false);

  const handleLiveFetch = () => {
    setIsFetchingLive(true);
    
    // Simulate API request to Wall Street feeds
    setTimeout(() => {
      // Generate realistic daily jitter
      const isPositive = Math.random() > 0.4; // 60% chance of up day
      const randomDrawdown = +(Math.random() * 2).toFixed(2) * (isPositive ? -1 : 1); // e.g., +1.50 or -0.80. Note: negative drawdown = positive return
      const randomVix = Math.floor(Math.random() * 8) + 12; // 12 to 19

      const liveScenario: MarketScenario = {
        id: 'scenario-live',
        name: `Live Market (${new Date().toLocaleDateString()})`,
        description: 'Dynamically generated data reflecting real-time Wall Street volatility feeds.',
        severity: randomVix > 18 ? 'mild' : 'normal',
        drawdown: randomDrawdown,
        volatilityLevel: randomVix,
        bondEquityCorrelation: -0.2,
        bidAskSpreadStress: 0.15,
        isCustom: true
      };
      
      setActiveScenario(liveScenario);
      setIsFetchingLive(false);
    }, 1500);
  };

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any).role !== "investor") {
        router.push("/adviser-console");
        return;
      }
      setIsLoading(false);
    }
  }, [session, router]);

  useEffect(() => {
    if (riskProfile && portfolio) {
      const output = runCrisisEngine({
        scenario: activeScenario,
        userProfile: riskProfile,
        portfolio: portfolio,
        anxietySignal: anxietyLevel[0],
        withdrawalRequested: needsLiquidity,
        questionnaireAgeMonths: 5 
      });
      setCrisisAssessment({
        ...output,
        id: "temp-sim-id",
        userId: currentUser?.id || "temp-user",
        scenarioId: activeScenario.id,
        timestamp: new Date().toISOString()
      });
    }
  }, [activeScenario, anxietyLevel, needsLiquidity, riskProfile, portfolio, currentUser, setCrisisAssessment]);

  if (isLoading || !currentUser || !riskProfile || !portfolio || !crisisAssessment) {
    return <div className="p-8 text-center text-surface-400 animate-pulse">Loading Simulator...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tighter flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-brand-500 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center">
            <ActivitySquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-gradient">Crisis Engine Simulator</span>
        </h1>
        <p className="text-surface-400 mt-2 max-w-3xl leading-relaxed font-medium">
          Observe how the transparent, rule-based crisis engine protects investors with sophisticated, elegant wealth management guardrails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-brand-500/20 bg-surface-100">
             <CardHeader className="pb-4">
               <CardTitle className="text-base flex items-center gap-2">
                 <ActivitySquare className="text-brand-400 h-4 w-4" />
                 Market Environment
               </CardTitle>
               <CardDescription>Select a mock global scenario to stress test the portfolio.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
               {MARKET_SCENARIOS.map((scenario) => (
                 <Button
                   key={scenario.id}
                   variant={activeScenario.id === scenario.id ? "default" : "outline"}
                   className={`w-full justify-start text-left h-auto py-3 ${
                     activeScenario.id === scenario.id 
                    ? "bg-brand-500 border-transparent shadow-[0_0_20px_rgba(212,175,55,0.4)] glow-primary text-white scale-105" 
                    : "border-surface-300 hover:bg-surface-200"
                }`}
                   onClick={() => setActiveScenario(scenario)}
                 >
                   <div className="flex flex-col gap-1 items-start w-full">
                     <span className="font-semibold">{scenario.name}</span>
                     <span className={`text-xs ${activeScenario.id === scenario.id ? "text-brand-100" : "text-surface-400"}`}>
                       Drawdown: {scenario.drawdown}% | VIX: {scenario.volatilityLevel}
                     </span>
                   </div>
                 </Button>
               ))}
                
                <div className="pt-4 mt-2 border-t border-white/5">
                  <Button 
                    variant="outline"
                    onClick={handleLiveFetch} 
                    disabled={isFetchingLive}
                    className="w-full bg-surface-200/50 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    {isFetchingLive ? (
                      <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Polling NY Feeds...</>
                    ) : (
                      <><LineChart className="mr-2 h-4 w-4" /> Fetch Live Market Data</>
                    )}
                  </Button>
                  <p className="text-xs text-center text-surface-500 mt-2">
                    Simulates pinging external S&P 500 & VIX APIs securely.
                  </p>
                </div>
             </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-surface-100">
             <CardHeader className="pb-4">
               <CardTitle className="text-base flex items-center gap-2">
                 <AlertTriangle className="text-amber-400 h-4 w-4" />
                 User Behavioral Signals
               </CardTitle>
               <CardDescription>Inject simulated user traits to see how the engine adapts.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Detected Anxiety Signal</span>
                    <span className="text-brand-400 font-mono">{anxietyLevel[0]}/10</span>
                  </div>
                  <Slider 
                    value={anxietyLevel} 
                    onValueChange={setAnxietyLevel} 
                    max={10} 
                    step={1}
                  />
                  <p className="text-xs text-surface-500">
                    Simulated metric based on high-velocity logins, erratic navigation, or rapid portfolio views.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Simulate Withdrawal Request</span>
                    <Button 
                      variant={needsLiquidity ? "destructive" : "secondary"} 
                      size="sm"
                      onClick={() => setNeedsLiquidity(!needsLiquidity)}
                    >
                      {needsLiquidity ? "Cancel Request" : "Request Cash"}
                    </Button>
                  </div>
                  <p className="text-xs text-surface-500">
                    Creates a strong liquidity constraint during stress periods.
                  </p>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Engine Output */}
        <div className="lg:col-span-8 space-y-6">
          <Card className={`overflow-hidden border-2 ${severityBg(crisisAssessment.severityClass)} shadow-2xl transition-colors duration-500`}>
              <div className="bg-surface-0/40 p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-surface-400 font-semibold mb-1 block">Live Assessment</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="glass" className="text-sm px-3 py-1">
                      Severity: <span className={`ml-1 font-bold ${severityColor(crisisAssessment.severityClass).split(' ')[0]}`}>{crisisAssessment.severityClass.toUpperCase()}</span>
                    </Badge>
                    <Badge variant="glass" className="text-sm px-3 py-1">
                      Vulnerability: <span className="ml-1 font-bold">{crisisAssessment.vulnerabilityClass.split('-').join(' ').toUpperCase()}</span>
                    </Badge>
                  </div>
                </div>
                <div className="text-right w-full md:w-auto mt-2 md:mt-0 p-4 rounded-xl bg-surface-100/60 backdrop-blur-3xl border border-white/10 shrink-0 shadow-2xl glow-primary">
                  <span className="text-[10px] uppercase text-brand-500 font-black tracking-widest block mb-1">Engine Consensus</span>
                  <span className={`text-2xl font-black tracking-tighter ${actionColor(crisisAssessment.actionRecommendation).split(' ')[0]}`}>
                    {actionLabel(crisisAssessment.actionRecommendation)}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-0">
                 {/* Explainability Timeline */}
                 <div className="p-6">
                   <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-400 mb-4 flex items-center gap-2">
                     <Info className="h-4 w-4" /> Explainability Log
                   </h3>
                   
                   <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                      {crisisAssessment.explanations.map((expl, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                           <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-surface-100 text-brand-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow sm:ml-0 -translate-x-[50%] z-10 transition-colors">
                             <CheckCircle2 className="h-5 w-5" />
                           </div>
                           <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-surface-100 border border-white/5 shadow">
                             <div className="flex items-center justify-between space-x-2 mb-1">
                               <div className="font-mono text-xs font-bold text-surface-500 whitespace-nowrap">
                                  Rule Fired: {crisisAssessment.rulesFired[idx]?.split(':')[0] || 'Rule'}
                               </div>
                             </div>
                             <div className="text-surface-300 leading-relaxed text-sm">
                               {expl}
                             </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   {crisisAssessment.actionRecommendation === 'escalate' && (
                     <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                        <ShieldAlert className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <h4 className="font-semibold text-red-200">Guardrail Triggered: Human Override Required</h4>
                        <p className="text-red-300 text-sm mt-1 max-w-xl mx-auto">
                          The system has blocked automated execution of portfolio changes and queued this session for human adviser review.
                        </p>
                     </div>
                   )}
                 </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
