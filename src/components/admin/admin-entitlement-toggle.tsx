"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Key = "income_blueprint" | "route_kit";

const LABELS: Record<Key, string> = {
  income_blueprint: "Blueprint",
  route_kit: "Route Kit",
};

export default function AdminEntitlementToggle({
  userId,
  entitlementKey,
  active,
}: {
  userId: string;
  entitlementKey: Key;
  active: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const working = pending || busy;

  async function toggle() {
    setBusy(true);
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          entitlementKey,
          action: active ? "revoke" : "grant",
        }),
      });
      startTransition(() => router.refresh());
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={working}
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
        active
          ? "border-gold/60 bg-gold/15 text-gold hover:bg-gold/25"
          : "border-border text-muted hover:border-gold/40 hover:text-paper",
      ].join(" ")}
      title={active ? "คลิกเพื่อถอนสิทธิ์" : "คลิกเพื่อให้สิทธิ์"}
    >
      {working ? "…" : `${active ? "✓" : "+"} ${LABELS[entitlementKey]}`}
    </button>
  );
}
