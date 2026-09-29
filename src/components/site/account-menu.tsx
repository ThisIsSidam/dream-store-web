"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Package, User as UserIcon } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { User } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const item =
  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-on-surface hover:bg-surface-container-low";

/** "Login" for guests; a hover/click dropdown (account, orders, admin, logout) once signed in. */
export function AccountMenu({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/signin"
        className="grid h-9 place-items-center rounded-sm bg-white px-8 text-sm font-semibold text-primary shadow-soft hover:bg-surface"
      >
        Login
      </Link>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-sm px-3 text-sm font-semibold text-white hover:bg-white/10"
      >
        <UserIcon className="size-5" aria-hidden />
        <span className="max-w-24 truncate">{firstName}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 w-56 pt-1">
          <div className="overflow-hidden rounded-sm bg-white py-1 shadow-float">
            <Link role="menuitem" href="/account" className={item} onClick={() => setOpen(false)}>
              <UserIcon className="size-4 text-primary" aria-hidden /> My account
            </Link>
            <Link role="menuitem" href="/orders" className={item} onClick={() => setOpen(false)}>
              <Package className="size-4 text-primary" aria-hidden /> Orders
            </Link>
            {user.role === "admin" && (
              <Link role="menuitem" href="/admin" className={item} onClick={() => setOpen(false)}>
                <LayoutDashboard className="size-4 text-primary" aria-hidden /> Admin dashboard
              </Link>
            )}
            <form action={signOut} className="border-t border-outline-variant/40">
              <button type="submit" role="menuitem" className={item}>
                <LogOut className="size-4 text-primary" aria-hidden /> Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
