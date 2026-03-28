"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Dialog container */}
      <div className="relative z-50 w-full max-w-lg transform overflow-hidden rounded-xl border border-white/10 bg-surface-100 p-6 text-left align-middle shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 border border-white/5 bg-surface-200 text-surface-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4">
          <h3 className="text-xl font-bold leading-6 text-white flex items-center gap-2">
            {title}
          </h3>
          {description && (
            <div className="mt-2 text-sm text-surface-400 leading-relaxed">
              {description}
            </div>
          )}
        </div>

        <div className="my-6">
          {children}
        </div>

        {footer && (
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-white/5 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
