"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthNav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setEmail(data.user?.email ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    setEmail(null);
    router.refresh();
  }

  // Before we know the auth state, render nothing to avoid a flash.
  if (!ready) return null;

  if (email) {
    return (
      <>
        <Link
          href="/dashboard"
          className="hidden px-3 text-sm text-muted transition-colors hover:text-paper sm:inline"
        >
          แดชบอร์ด
        </Link>
        <Link
          href="/account"
          className="hidden px-3 text-sm text-muted transition-colors hover:text-paper sm:inline"
        >
          บัญชี
        </Link>
        <button
          onClick={signOut}
          className="hidden px-3 text-sm text-muted transition-colors hover:text-paper sm:inline"
          title={email}
        >
          ออกจากระบบ
        </button>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden px-3 text-sm text-muted transition-colors hover:text-paper sm:inline"
    >
      เข้าสู่ระบบ
    </Link>
  );
}
