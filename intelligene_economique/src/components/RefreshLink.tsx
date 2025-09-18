"use client";
import { useRouter } from "next/navigation";

export default function RefreshLink({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className={"text-neutral-500 hover:text-neutral-900 " + className}
      aria-label="Actualiser la page"
      title="Actualiser la page"
    >
      Actualiser
    </button>
  );
}
