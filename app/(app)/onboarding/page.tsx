"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ONBOARDING_QUESTIONS } from "@/lib/seed-data";
import { calculateRiskScore, classifyRisk } from "@/lib/risk-calculator";
import { QuestionnaireAnswer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Info, ArrowRight, ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const question = ONBOARDING_QUESTIONS[currentStep];
  const progress = ((currentStep) / ONBOARDING_QUESTIONS.length) * 100;

  const handleSelect = (optionValue: string, optionScore: number) => {
    const newAnswers = [...answers];
    const existing = newAnswers.findIndex(a => a.questionId === question.id);
    
    const ans = {
      questionId: question.id,
      question: question.question,
      answer: optionValue,
      score: optionScore
    };

    if (existing >= 0) {
      newAnswers[existing] = ans;
    } else {
      newAnswers.push(ans);
    }
    
    setAnswers(newAnswers);
    
    // Auto advance after short delay
    setTimeout(() => {
       if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
          setCurrentStep(currentStep + 1);
       }
    }, 300);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    // In a real app, save to DB. For demo, we just route them.
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const getSelectedValue = () => {
    return answers.find(a => a.questionId === question?.id)?.answer;
  };

  if (currentStep >= ONBOARDING_QUESTIONS.length) {
    const score = calculateRiskScore(answers);
    const category = classifyRisk(score);
    
    return (
       <div className="max-w-2xl mx-auto space-y-6 pt-12">
          <div className="text-center mb-12">
             <div className="h-20 w-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-10 w-10 text-emerald-400" />
             </div>
             <h1 className="text-3xl font-bold tracking-tight mb-3">Profile Assessment Complete</h1>
             <p className="text-surface-400">We've generated a conceptual educational portfolio based on your responses.</p>
          </div>
          
          <Card className="border-brand-500/30 bg-surface-100 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="h-32 w-32 text-brand-500" />
             </div>
             <CardContent className="p-8 pb-10 relative z-10">
                <div className="flex flex-col items-center">
                   <div className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-2">Simulated Risk Score</div>
                   <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-surface-500 mb-2">
                      {score}
                   </div>
                   <div className="text-xl font-medium text-brand-400 capitalize mb-8">{category} Investor</div>
                   
                   <p className="text-center text-surface-300 leading-relaxed mb-10 max-w-lg">
                     Based on your indicated time horizon and liquidity needs, your answers suggest a <strong>{category}</strong> approach. Your conceptual portfolio will balance growth potential with downside protection.
                   </p>
                   
                   <Button 
                     size="lg" 
                     className="w-full sm:w-auto px-12 h-14 text-lg bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25 transition-all"
                     onClick={handleFinish}
                     disabled={submitting}
                   >
                     {submitting ? "Building demo portfolio..." : "Go to Dashboard"}
                     {!submitting && <ArrowRight className="ml-2 h-5 w-5" />}
                   </Button>
                </div>
             </CardContent>
          </Card>
       </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-4 md:pt-12">
      <div className="mb-8">
        <Progress value={progress} className="h-1 mb-4" />
        <div className="flex justify-between items-center text-sm font-mono text-surface-400">
           <span>Step {currentStep + 1} of {ONBOARDING_QUESTIONS.length}</span>
           <span>Risk Assessment</span>
        </div>
      </div>

      <Card className="border-white/10 shadow-xl bg-surface-100/80 backdrop-blur-xl">
        <CardHeader className="pb-6">
           <CardTitle className="text-2xl leading-tight text-white mb-2">
             {question.question}
           </CardTitle>
           <CardDescription className="flex items-start gap-2 text-surface-300 bg-brand-500/5 p-3 rounded-lg border border-brand-500/10">
              <Info className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">{question.explanation}</span>
           </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-3">
              {question.options.map((option) => {
                 const isSelected = getSelectedValue() === option.value;
                 return (
                   <button
                     key={option.value}
                     className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                        isSelected 
                          ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                          : 'border-white/10 bg-surface-200/50 hover:bg-surface-200 hover:border-white/20'
                     }`}
                     onClick={() => handleSelect(option.value, option.score)}
                   >
                     <span className={`font-medium ${isSelected ? 'text-white' : 'text-surface-200 group-hover:text-white'}`}>
                        {option.label}
                     </span>
                     <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-brand-500 bg-brand-500' : 'border-surface-400'
                     }`}>
                        {isSelected && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                     </div>
                   </button>
                 );
              })}
           </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-surface-200/30">
           <Button 
             variant="ghost" 
             onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
             disabled={currentStep === 0}
             className="text-surface-400 hover:text-white"
           >
             <ArrowLeft className="mr-2 h-4 w-4" /> Back
           </Button>
           <Button 
             variant="outline"
             onClick={() => setCurrentStep(currentStep + 1)}
             disabled={!getSelectedValue() || currentStep >= ONBOARDING_QUESTIONS.length}
             className="border-white/10 bg-surface-200 hover:bg-surface-300"
           >
             Continue <ArrowRight className="ml-2 h-4 w-4" />
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
