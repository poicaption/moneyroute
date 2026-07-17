"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Mobile-only navigation. The desktop header hides its links below `sm`, so
 * this hamburger menu keeps every destination (and sign-in/out) reachable on
 * small screens.
 */
export function MobileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    setEmail(null);
    setOpen(false);
    router.refresh();
  }

  const linkClass =
    "block rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-paper";

  return (
    <div className="relative sm:hidden" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="เมนู"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-paper"
      >
        <span className="sr-only">เปิดเมนู</span>
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        )}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-lg border border-border bg-bg/95 p-2 shadow-xl backdrop-blur-md">
          <Link href="/" className={linkClass} onClick={() => setOpen(false)}>
            หน้าแรก
          </Link>
          <Link href="/pricing" className={linkClass} onClick={() => setOpen(false)}>
            ราคา
          </Link>
          <Link
            href="/opportunities"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            โอกาสสร้างรายได้
          </Link>
          {email ? (
            <>
              <div className="my-1 border-t border-border" />
              <Link
                href="/dashboard"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                แดชบอร์ด
              </Link>
              <Link
                href="/account"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                จัดการบัญชี
              </Link>
              <Link
                href="/billing"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                การเรียกเก็บเงิน
              </Link>
              <button
                type="button"
                onClick={signOut}
                className={`${linkClass} w-full text-left`}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <div className="my-1 border-t border-border" />
              <Link
                href="/login"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
