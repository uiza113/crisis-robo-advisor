"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  PieChart, 
  ActivitySquare, 
  MessageSquare, 
  ShieldAlert,
  FileBadge,
  LogOut,
  Settings,
  Presentation
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FinGuidePanel } from "@/components/finguide/FinGuidePanel";
import { useAppStore } from "@/store/app-store";

const INVESTOR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio Details", icon: PieChart },
  { href: "/forecast", label: "Forecaster", icon: Presentation },
  { href: "/crisis-simulator", label: "Crisis Simulator", icon: ActivitySquare },
  { href: "/communications", label: "Message Center", icon: MessageSquare },
];

const ADVISER_LINKS = [
  { href: "/adviser-console", label: "Adviser Console", icon: ShieldAlert },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Audit Logs", icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleFinGuide } = useAppStore();

  const user = session?.user as any;
  const role = user?.role || "investor";

  const links = [
    ...(role === "investor" ? INVESTOR_LINKS : []),
    ...(role === "adviser" ? ADVISER_LINKS : []),
    ...(role === "admin" ? ADMIN_LINKS : []),
    { href: "/compliance", label: "Disclosures", icon: FileBadge },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-surface-0/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Crisis-Aware</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-1 ml-6">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-surface-200",
                      isActive ? "bg-surface-200 text-white" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {role === "investor" && (
                <Button variant="outline" size="sm" onClick={toggleFinGuide}>
                  ✨ FinGuide
                </Button>
              )}
              
              <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                </div>
                <div 
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                  style={{ backgroundColor: user.avatarColor || "#6366f1" }}
                >
                  {user.name.charAt(0)}
                </div>
                <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/compliance" className="text-sm text-muted-foreground hover:text-white">
                Disclosures
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Demo Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  // We include FinGuidePanel here so it's globally available
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      
      <footer className="border-t border-white/5 py-8 mt-auto text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="mb-2 uppercase tracking-wide text-xs">Educational Demo Only</p>
          <p className="max-w-2xl mx-auto">
            This application is an educational fintech demonstration. It does not provide real investment advice, manage money, or connect to brokerage accounts. All conceptual portfolios shown are for illustrative purposes only.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/compliance" className="hover:text-white underline underline-offset-4">Read Full Disclosures</Link>
          </div>
        </div>
      </footer>
      
      <FinGuidePanel />
    </div>
  );
}
