"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { useStore } from "@/lib/client/store";
import { YC_PRODUCTS } from "@/lib/data/products";
import { cn, formatPrice } from "@/lib/utils";
import {
    CreditCard,
    Heart,
    History,
    MapPin,
    Package,
    Settings,
    Shield,
    Sparkles,
    User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Tab =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "payments"
  | "recent"
  | "settings";

export function AccountDashboard({
  userName = "Arthur Dent",
  userEmail = "arthur@questionable.market",
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { orders, wishlist, recentlyViewed, savedForLater } = useStore();

  const recentProducts = recentlyViewed
    .map((id) => YC_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof YC_PRODUCTS)[0] => Boolean(p));

  const wishProducts = wishlist
    .map((id) => YC_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof YC_PRODUCTS)[0] => Boolean(p));

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Settings updated.", {
      description: "Temporal synchronization preferences recorded.",
    });
  }

  return (
    <div className="mx-auto max-w-5xl py-6">
      {/* Welcome Banner (Section 21) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-neutral-900 text-xl font-bold text-white">
            {userName[0]}
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold text-neutral-950">
              Welcome back, {userName}.
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Your questionable activity across the marketplace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-200/80 px-3 py-1.5 text-xs font-mono text-neutral-600">
          <Sparkles className="size-3.5 text-indigo-600" />
          <span>Doubt Points: 412</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3">
          <nav className="rounded-xl border border-neutral-200 bg-white p-2 shadow-xs space-y-1 text-xs sm:text-sm font-medium">
            {[
              { id: "overview", label: "Overview", icon: User },
              {
                id: "orders",
                label: `Orders (${orders.length})`,
                icon: Package,
              },
              {
                id: "wishlist",
                label: `Wishlist (${wishlist.length})`,
                icon: Heart,
              },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "payments", label: "Payment Methods", icon: CreditCard },
              { id: "recent", label: "Recently Viewed", icon: History },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isCurrent
                      ? "bg-neutral-900 text-white font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tab Content (9 cols) */}
        <div className="lg:col-span-9">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase text-neutral-400 block">
                    Orders
                  </span>
                  <span className="font-sans text-2xl font-bold text-neutral-950 mt-1 block">
                    {orders.length}
                  </span>
                  <Link
                    href="/orders"
                    className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
                  >
                    View orders →
                  </Link>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase text-neutral-400 block">
                    Wishlist
                  </span>
                  <span className="font-sans text-2xl font-bold text-neutral-950 mt-1 block">
                    {wishlist.length}
                  </span>
                  <Link
                    href="/wishlist"
                    className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
                  >
                    Contemplate →
                  </Link>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase text-neutral-400 block">
                    Saved Items
                  </span>
                  <span className="font-sans text-2xl font-bold text-neutral-950 mt-1 block">
                    {savedForLater.length}
                  </span>
                  <Link
                    href="/cart"
                    className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
                  >
                    Review cart →
                  </Link>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
                  <span className="text-[11px] font-bold uppercase text-neutral-400 block">
                    Integrity
                  </span>
                  <span className="font-sans text-2xl font-bold text-emerald-600 mt-1 block">
                    97.4%
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-2 block">
                    Normal status
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                  <h3 className="font-sans text-base font-bold text-neutral-950">
                    Latest Active Manifestation
                  </h3>
                  <Link
                    href="/orders"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View all ({orders.length})
                  </Link>
                </div>

                {orders[0] ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-neutral-50/70 border border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="size-14 rounded border border-neutral-200 bg-white overflow-hidden shrink-0">
                        <ProductVisual
                          visualId={orders[0].items[0]?.visualId || "generic"}
                          showStudioLighting={false}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 text-sm">
                          {orders[0].items[0]?.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Order #{orders[0].orderNumber} • {orders[0].date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-blue-100 text-blue-900 px-2.5 py-0.5 text-xs font-semibold">
                        {orders[0].status}
                      </span>
                      <p className="text-[11px] text-neutral-500 italic mt-1">
                        &ldquo;{orders[0].statusDescription}&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500">
                    No orders placed yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === "orders" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Your Orders
              </h2>
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-lg border border-neutral-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-bold text-sm text-neutral-900">
                        Order #{o.orderNumber}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {o.items.length} items • {formatPrice(o.total)}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${o.id}`}
                      className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                    >
                      Track
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Wishlist Items ({wishProducts.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
                  >
                    <div className="size-14 rounded border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                      <ProductVisual
                        visualId={p.visualId}
                        showStudioLighting={false}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-neutral-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs font-bold text-neutral-950 mt-0.5">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sans text-lg font-bold text-neutral-950">
                  Saved Addresses
                </h2>
                <button
                  type="button"
                  onClick={() => toast.message("New address slot created.")}
                  className="rounded border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  + Add Address
                </button>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 text-xs space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900">
                    Default Address (Home)
                  </span>
                  <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[10px] font-semibold">
                    Primary
                  </span>
                </div>
                <p className="font-semibold text-neutral-900">Arthur Dent</p>
                <p className="text-neutral-600">
                  42 Sub-Etha Expressway, Apt 7B
                </p>
                <p className="text-neutral-600">Islington, London — WC1N 3AX</p>
                <p className="text-neutral-400 mt-2">
                  Phone: +1 (555) 019-2834
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT METHODS */}
          {activeTab === "payments" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Saved Payment Methods
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-indigo-600" />
                    <div>
                      <p className="font-bold text-neutral-900">
                        Visa ending in 4242
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Expires 12/28 • Default
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-neutral-600" />
                    <div>
                      <p className="font-bold text-neutral-900">
                        UPI ID: arthur@okicici
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Instant settlement
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RECENTLY VIEWED */}
          {activeTab === "recent" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Recently Viewed Items
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="flex flex-col rounded-lg border border-neutral-200 p-3 hover:border-neutral-300 transition-all text-xs"
                  >
                    <div className="aspect-square w-full rounded bg-neutral-50 overflow-hidden mb-2">
                      <ProductVisual
                        visualId={p.visualId}
                        showStudioLighting={false}
                      />
                    </div>
                    <span className="font-semibold text-neutral-900 truncate">
                      {p.name}
                    </span>
                    <span className="font-bold text-neutral-950 mt-1">
                      {formatPrice(p.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === "settings" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Account Settings
              </h2>
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={userName}
                    className="h-9 w-full sm:w-80 rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={userEmail}
                    className="h-9 w-full sm:w-80 rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-indigo-600"
                    />
                    <span>
                      Receive temporal timeline discrepancy alerts via email
                    </span>
                  </label>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="rounded bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
