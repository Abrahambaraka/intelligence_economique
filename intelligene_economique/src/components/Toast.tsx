"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; message: string; timeout: number };

type ToastContextValue = {
  show: (message: string, opts?: { kind?: ToastKind; timeout?: number }) => void;
  success: (message: string, timeout?: number) => void;
  error: (message: string, timeout?: number) => void;
  info: (message: string, timeout?: number) => void;
};

const ToastCtx = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(1);

  const remove = useCallback((id: number) => {
    setItems((arr) => arr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastContextValue["show"]>((message, opts) => {
    const id = idRef.current++;
    const timeout = opts?.timeout ?? 4000;
    const kind = opts?.kind ?? "info";
    setItems((arr) => [...arr, { id, kind, message, timeout }]);
    window.setTimeout(() => remove(id), timeout);
  }, [remove]);

  const api = useMemo<ToastContextValue>(() => ({
    show,
    success: (m, t) => show(m, { kind: "success", timeout: t }),
    error: (m, t) => show(m, { kind: "error", timeout: t }),
    info: (m, t) => show(m, { kind: "info", timeout: t }),
  }), [show]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
  {/* Zone d’affichage */}
      <div className="pointer-events-none fixed inset-x-0 top-2 z-[70] flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {items.map((t) => (
            t.kind === "error" ? (
              <div
                key={t.id}
                role="alert"
                aria-live="assertive"
                className={
                  "pointer-events-auto rounded-md border px-3 py-2 text-sm shadow-sm bg-white border-red-300 text-red-900"
                }
              >
                {t.message}
              </div>
            ) : (
              <div
                key={t.id}
                role="status"
                aria-live="polite"
                className={
                  "pointer-events-auto rounded-md border px-3 py-2 text-sm shadow-sm bg-white " +
                  (t.kind === "success" ? "border-emerald-300 text-emerald-900" : "border-neutral-200 text-neutral-900")
                }
              >
                {t.message}
              </div>
            )
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}
