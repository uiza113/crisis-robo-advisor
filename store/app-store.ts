// ============================================================
// Zustand Store — Global application state
// ============================================================
import { create } from 'zustand';
import { AppState, Message, AuditLogEntry, FinGuideMessage } from '@/types';
import { MARKET_SCENARIOS } from '@/lib/seed-data';

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  riskProfile: null,
  portfolio: null,
  activeScenario: MARKET_SCENARIOS[0],
  crisisAssessment: null,
  messages: [],
  escalationCases: [],
  auditLog: [],
  finGuideMessages: [],
  finGuideOpen: false,
  onboardingComplete: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setRiskProfile: (profile) => set({ riskProfile: profile }),
  setPortfolio: (portfolio) => set({ portfolio: portfolio }),
  setActiveScenario: (scenario) => set({ activeScenario: scenario }),
  setCrisisAssessment: (assessment) => set({ crisisAssessment: assessment }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message: Message) =>
    set((state) => ({ messages: [message, ...state.messages] })),
  markMessageRead: (id: string) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, read: true } : m
      ),
    })),
  setEscalationCases: (cases) => set({ escalationCases: cases }),
  addAuditEntry: (entry: AuditLogEntry) =>
    set((state) => ({ auditLog: [entry, ...state.auditLog] })),
  setAuditLog: (log) => set({ auditLog: log }),
  addFinGuideMessage: (msg: FinGuideMessage) =>
    set((state) => ({ finGuideMessages: [...state.finGuideMessages, msg] })),
  toggleFinGuide: () =>
    set((state) => ({ finGuideOpen: !state.finGuideOpen })),
  setOnboardingComplete: (val) => set({ onboardingComplete: val }),
}));
