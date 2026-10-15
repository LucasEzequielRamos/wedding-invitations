"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "warning";

type ToastData = {
  id: number;
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const dismissToast = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "error") => {
      if (timer.current) clearTimeout(timer.current);

      setToast({
        id: ++nextId.current,
        message,
        type,
      });

      timer.current = setTimeout(() => setToast(null), 4000);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { toast, showToast, dismissToast };
}

export function ToastViewport({
  toast,
  onClose,
}: {
  toast: ToastData | null;
  onClose: () => void;
}) {
  if (!toast) return null;

  const styles: Record<ToastType, string> = {
    success: "border-green-200 bg-green-50 text-green-950",
    error: "border-red-200 bg-red-50 text-red-950",
    warning: "border-amber-200 bg-amber-50 text-amber-950",
  };

  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "!",
    warning: "⚠",
  };

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-100 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ${styles[toast.type]}`}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/80 font-bold">
        {icons[toast.type]}
      </span>

      <p className="flex-1 pt-1 text-sm font-medium">{toast.message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="rounded px-2 text-lg opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}