import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldAlert, BrainCircuit, ActivitySquare, Scale } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-0">
      <header className="absolute top-0 w-full z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">Crisis-Aware</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/compliance" className="text-sm text-surface-400 hover:text-white transition-colors">Disclosures</Link>
          <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Link href="/login">Demo Login</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 to-surface-0 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                Educational Fintech Demonstration
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                A robo-advisor <br className="hidden md:block" />
                built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">behavioral resilience.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-400 max-w-2xl leading-relaxed">
                Traditional robo-advisors break down when markets do. Explore how a transparent, rule-based crisis engine can protect vulnerable investors, provide explainable guidance, and seamlessly escalate to human advisers.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto gap-2 bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 text-base h-12 px-8">
                  <Link href="/login">
                    Start Assessment Demo <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-surface-500 max-w-[200px] sm:max-w-none text-center sm:text-left">
                  No real money involved. Not financial advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-surface-50 border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">How crisis awareness protects decision quality.</h2>
              <p className="text-surface-400 text-lg">
                During market dislocations, automated advice often fails to account for changing liquidity constraints and heightened user anxiety.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-surface-100 border border-white/5 p-8 rounded-2xl">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                  <ActivitySquare className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Crisis Simulator Engine</h3>
                <p className="text-surface-400 leading-relaxed">
                  Toggle between normal markets and severe dislocations. Watch how the rules engine dynamically adjusts its recommendations based on drawdown, volatility, and bid-ask spread stress.
                </p>
              </div>
              
              <div className="bg-surface-100 border border-white/5 p-8 rounded-2xl">
                <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                  <BrainCircuit className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Vulnerability Assessment</h3>
                <p className="text-surface-400 leading-relaxed">
                  Go beyond the static risk questionnaire. The engine detects behaviorally vulnerable users, panic sell signals, and potential liquidity crunches to pause high-friction actions.
                </p>
              </div>

              <div className="bg-surface-100 border border-white/5 p-8 rounded-2xl">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Scale className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Responsible Human Escalation</h3>
                <p className="text-surface-400 leading-relaxed">
                  AI shouldn't advise anxious humans in a crisis. The platform automatically flags vulnerable users and escalates them to a human adviser workflow, complete with behavioral context.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-surface-0">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-surface-400" />
            <span className="font-medium text-surface-400 tracking-tight">Crisis-Aware Robo-Advisor</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <Link href="/compliance" className="hover:text-surface-300 transition-colors">Educational Disclaimer</Link>
            <Link href="/compliance" className="hover:text-surface-300 transition-colors">AI Limitations</Link>
            <span className="text-surface-600">English Interface Demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
