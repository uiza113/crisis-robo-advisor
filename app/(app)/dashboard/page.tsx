"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { 
  getProfileByUserId, 
  getPortfolioByUserId, 
  getMessagesForUser,
  MARKET_SCENARIOS
} from "@/lib/seed-data";
import { runCrisisEngine } from "@/lib/crisis-engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldAlert, AlertTriangle, TrendingDown, BookOpen, ActivitySquare } from "lucide-react";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { formatCurrency, formatPercent, severityColor, severityBg, actionLabel, actionColor } from "@/lib/utils";
import Link from "next/link";
import { generateCrisisMessages } from "@/lib/messaging-engine";
import { Modal } from "@/components/ui/modal";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const { 
    currentUser, setCurrentUser,
    riskProfile, setRiskProfile,
    portfolio, setPortfolio,
    activeScenario, setActiveScenario,
    crisisAssessment, setCrisisAssessment,
    messages, setMessages,
    onboardingComplete
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showFrictionModal, setShowFrictionModal] = useState(false);

  const handleWithdrawClick = () => {
    if (crisisAssessment?.severityClass === 'severe' || crisisAssessment?.severityClass === 'dislocation') {
      setShowFrictionModal(true);
    } else {
      alert("Demo Mode: In a real application, this would begin the standard withdrawal flow.");
    }
  };

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      if (u.role !== "investor") {
        router.push(u.role === "adviser" ? "/adviser-console" : "/admin");
        return;
      }

      setCurrentUser(u);
      
      const p = getProfileByUserId(u.id);
      const port = getPortfolioByUserId(u.id);
      
      if (!p || !port) {
        // Redirect to onboarding if they don't have seed data
        // For this demo, let's pretend everyone has seed data unless we want to demo onboarding
        // router.push("/onboarding");
      } else {
        setRiskProfile(p);
        setPortfolio(port);
        
        // Initial setup for messages if empty
        if (messages.length === 0) {
          const msgs = getMessagesForUser(u.id);
          setMessages(msgs);
        }

        // Run crisis engine on load
        const output = runCrisisEngine({
          scenario: activeScenario,
          userProfile: p,
          portfolio: port,
          anxietySignal: 0,
          withdrawalRequested: false,
          questionnaireAgeMonths: 5 // mock value
        });
        
        setCrisisAssessment({
           ...output,
           id: "temp-id",
           userId: u.id,
           scenarioId: activeScenario.id,
           timestamp: new Date().toISOString()
        });
      }
      setIsLoading(false);
    }
  }, [session, router]);

  if (isLoading || !portfolio || !riskProfile || !crisisAssessment) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];
  const sortedHoldings = [...portfolio.holdings].sort((a, b) => b.currentWeight - a.currentWeight);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.name?.split(' ')[0]}</h1>
          <p className="text-surface-400 mt-1">Here's your conceptual portfolio performance summary.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-100 border border-white/5 p-2 rounded-lg backdrop-blur-md">
          <Badge variant="glass" className="font-mono">{activeScenario.name}</Badge>
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs px-2">
            <Link href="/crisis-simulator">Change Scenario</Link>
          </Button>
        </div>
      </div>

      {/* Hero Banner based on Crisis Assessment */}
      {crisisAssessment.severityClass !== 'normal' && (
        <Card className={`border ${severityBg(crisisAssessment.severityClass)} overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {crisisAssessment.severityClass === 'dislocation' ? <ShieldAlert size={120} /> : <AlertTriangle size={120} />}
          </div>
          <CardHeader>
            <CardTitle className={`flex items-center ${severityColor(crisisAssessment.severityClass)}`}>
              <ActivitySquare className="mr-2 h-5 w-5" />
              {activeScenario.name}
            </CardTitle>
            <CardDescription className="text-white/80 max-w-3xl leading-relaxed mt-2 text-base">
              {activeScenario.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-surface-0/40 p-4 rounded-lg border border-white/5">
                <p className="text-xs uppercase tracking-wider text-surface-400 font-semibold mb-1">Our Recommendation</p>
                <div className={`text-lg font-bold flex items-center ${actionColor(crisisAssessment.actionRecommendation).split(' ')[0]}`}>
                  {actionLabel(crisisAssessment.actionRecommendation)}
                </div>
                <p className="text-sm mt-2 text-surface-300">
                  {crisisAssessment.explanations[crisisAssessment.explanations.length - 1]}
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                <Button asChild className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg">
                  <Link href="/portfolio">Review Portfolio Details</Link>
                </Button>
                {crisisAssessment.actionRecommendation === 'escalate' && (
                  <Button variant="outline" className="w-full border-red-500/30 text-red-200 hover:bg-red-500/10 hover:text-red-100">
                    Connect with Human Adviser
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Portfolio Summary */}
        <Card className="col-span-1 md:col-span-2 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Portfolio Balance</CardTitle>
              <CardDescription>Illustrative total value</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tabular-nums tracking-tight text-white glow-text">
                {formatCurrency(portfolio.totalValue)}
              </div>
              <div className="flex items-center justify-end text-sm text-red-400 mt-1 font-mono">
                <TrendingDown className="h-3 w-3 mr-1" />
                {activeScenario.drawdown}% simulated
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2">
              <AllocationChart holdings={portfolio.holdings} />
            </div>
            <div className="w-full md:w-1/2 mt-6 md:mt-0 pl-0 md:pl-6">
              <h4 className="text-sm font-semibold mb-3 text-surface-300">Target vs Current</h4>
              <div className="space-y-3">
                {sortedHoldings.slice(0, 4).map((holding, i) => (
                  <div key={holding.ticker} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="font-medium">{holding.ticker}</span>
                      <span className="text-surface-500 text-xs hidden sm:inline truncate max-w-[100px]">{holding.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums">{holding.currentWeight}%</span>
                      <span className={`text-xs w-10 text-right tabular-nums ${Math.abs(holding.drift) > 4 ? 'text-amber-400 font-bold' : 'text-surface-500'}`}>
                        {holding.drift > 0 ? '+' : ''}{holding.drift}%
                      </span>
                    </div>
                  </div>
                ))}
                {sortedHoldings.length > 4 && (
                  <div className="text-xs text-surface-500 flex justify-between pt-2 border-t border-white/5">
                    <span>Others ({sortedHoldings.length - 4})</span>
                    <span>View all &rarr;</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-surface-200/50 border-t border-white/5 rounded-b-xl py-3 flex gap-4">
            <Button variant="ghost" className="flex-1 justify-center hover:bg-surface-300 px-0" asChild>
              <Link href="/portfolio">
                View detailed analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors" onClick={handleWithdrawClick}>
              Withdraw Funds
            </Button>
          </CardFooter>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6 flex flex-col">
          {/* Risk Profile Snippet */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-surface-400">{riskProfile.score}</span>
                  <span className="text-sm font-medium uppercase tracking-wider text-brand-400">{riskProfile.category}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-300 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full" 
                    style={{ width: `${riskProfile.score}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm text-surface-400 mt-4">
                <div className="flex justify-between">
                  <span>Horizon</span>
                  <span className="text-white">{riskProfile.timeHorizon} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidity Need</span>
                  <span className="text-white capitalize">{riskProfile.liquidityNeed}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
               <Button variant="outline" size="sm" className="w-full">Retake Quiz</Button>
            </CardFooter>
          </Card>

          {/* Education Snippet */}
          <Card className="bg-gradient-to-br from-brand-900/40 to-surface-100 border-brand-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-400" />
                Educational Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-surface-300 leading-relaxed">
                Rebalancing involves periodically buying or selling assets to maintain your original desired level of asset allocation. It's a disciplined way to manage risk, especially during volatile markets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Behavioral Friction Modal */}
      <Modal 
        isOpen={showFrictionModal} 
        onClose={() => setShowFrictionModal(false)}
        title={<><AlertTriangle className="h-6 w-6 text-red-500" /> Behavioral Checkpoint</>}
      >
        <div className="space-y-4 text-surface-200 leading-relaxed text-sm">
           <p>
             <strong>Wait! The market is currently experiencing a {activeScenario.drawdown}% simulated drawdown.</strong>
           </p>
           <p>
             By withdrawing your funds today, you are permanently locking in a paper loss. Selling during peak volatility historically destroys wealth faster than any other behavioral mistake. 
           </p>
           {activeScenario.historicalAnalogue && (
             <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
               <span className="font-bold text-red-400 block mb-1">Historical Context: {activeScenario.historicalAnalogue.event}</span>
               {activeScenario.historicalAnalogue.description} This event caused a {activeScenario.historicalAnalogue.historicalDrawdown}% drop, but the S&P 500 recovered your losses within {activeScenario.historicalAnalogue.recoveryMonths} months. Long-term investors who stayed the course were made whole.
             </div>
           )}
           <p className="text-surface-400 border-l-2 border-brand-500 pl-3">
             Our recommendation engine strongly advises against liquidation right now. Would you like to schedule an emergency call with a human adviser to discuss your liquidity needs instead?
           </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="default" className="w-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg" onClick={() => router.push('/adviser-console')}>
            Speak to an Adviser First
          </Button>
          <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => setShowFrictionModal(false)}>
            I Understand, Proceed to Sell
          </Button>
        </div>
      </Modal>

    </div>
  );
}
