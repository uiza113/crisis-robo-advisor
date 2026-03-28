"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEED_USERS } from "@/lib/seed-data";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDirectSubmit = async (selectedEmail: string) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: selectedEmail,
        password: "demo",
      });

      if (result?.error) {
        setError("Invalid demo login");
        setLoading(false);
      } else {
        const user = SEED_USERS.find(u => u.email === selectedEmail);
        if (user?.role === "adviser") {
            router.push("/adviser-console");
        } else if (user?.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="absolute top-0 w-full z-10 p-6 flex items-center justify-between">
         <Link href="/" className="inline-flex items-center gap-2 text-surface-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back home
         </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-[440px] flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-brand-500 flex items-center justify-center mb-2 shadow-lg shadow-brand-500/20">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to demo</h1>
            <p className="text-surface-400 text-sm">
              Select a seeded persona to explore the app.
            </p>
          </div>

          <Card className="border-white/10 shadow-2xl bg-surface-100/80 backdrop-blur-xl">
            <CardHeader className="pb-4">
               {error && (
                 <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-4">
                   {error}
                 </div>
               )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-surface-400 uppercase tracking-widest mb-1">Investors</div>
                <Button variant="outline" onClick={() => handleDirectSubmit("alex@demo.com")} className="justify-start border-white/10 bg-surface-200 hover:bg-surface-300" disabled={loading}>
                  👤 Alex Chen (Stable, Moderate)
                </Button>
                <Button variant="outline" onClick={() => handleDirectSubmit("jordan@demo.com")} className="justify-start border-white/10 bg-surface-200 hover:bg-surface-300" disabled={loading}>
                  👤 Jordan Lee (Anxious, Mild Stress)
                </Button>
                <Button variant="outline" onClick={() => handleDirectSubmit("sam@demo.com")} className="justify-start border-white/10 bg-surface-200 hover:bg-surface-300" disabled={loading}>
                  👤 Sam Rivera (Liquidity Need)
                </Button>

                <div className="text-sm font-semibold text-surface-400 uppercase tracking-widest mt-2 mb-1">Staff</div>
                <Button variant="outline" onClick={() => handleDirectSubmit("morgan@demo.com")} className="justify-start border-white/10 bg-surface-200 hover:bg-surface-300" disabled={loading}>
                  ⚖️ Morgan Taylor (Human Adviser)
                </Button>
                <Button variant="outline" onClick={() => handleDirectSubmit("casey@demo.com")} className="justify-start border-white/10 bg-surface-200 hover:bg-surface-300" disabled={loading}>
                  📋 Casey Admin (Compliance Reviewer)
                </Button>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col items-center">
                <p className="text-xs text-surface-500 text-center">
                    All data is seeded locally. No real users.
                </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
