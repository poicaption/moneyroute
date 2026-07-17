import Link from "next/link";

/** Simple top navigation shared across admin pages. */
export default function AdminNav({ active }: { active: "overview" | "users" }) {
  const items: { href: string; label: string; key: "overview" | "users" }[] = [
    { href: "/admin", label: "ภาพรวม", key: "overview" },
    { href: "/admin/users", label: "จัดการบัญชีลูกค้า", key: "users" },
  ];
  return (
    <nav className="flex gap-2">
      {items.map((it) => (
        <Link
          key={it.key}
          href={it.href}
          className={[
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            it.key === active
              ? "bg-gold/15 text-gold"
              : "text-muted hover:text-paper",
          ].join(" ")}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
