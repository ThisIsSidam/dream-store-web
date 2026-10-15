"use client";

import { signOut } from "@/app/actions/auth";
import { ProductVisual } from "@/components/ui/product-visual";
import { api, swrFetcher } from "@/lib/client/api";
import { useStore } from "@/lib/client/store";
import { cn, formatPrice } from "@/lib/utils";
import {
  CreditCard,
  Heart,
  History,
  LogOut,
  MapPin,
  Package,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

type Tab =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "payments"
  | "recent"
  | "settings";

interface AccountDashboardProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export function AccountDashboard({
  userName = "",
  userEmail = "",
  userRole = "user",
}: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const {
    orders,
    wishlist,
    wishlistProducts,
    recentlyViewed,
    recentlyViewedProducts,
    savedForLater,
  } = useStore();

  const { data: me, mutate: mutateMe } = useSWR<{
    _id: string;
    name: string;
    email: string;
    role?: string;
    doubtPoints?: number;
    addresses?: Array<{
      _id?: string;
      fullName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pin: string;
      addressType: string;
      isDefault?: boolean;
    }>;
  }>("users/me", swrFetcher, { shouldRetryOnError: false });

  const displayName = me?.name || userName || "Traveler";
  const displayEmail = me?.email || userEmail || "";
  const doubtPoints = me?.doubtPoints ?? 0;
  const addresses = me?.addresses || [];

  // Profile edit state
  const [profileName, setProfileName] = useState(displayName);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (me?.name) setProfileName(me.name);
  }, [me?.name]);

  // Address add state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    addressType: "Home",
    isDefault: true,
  });

  useEffect(() => {
    setAddressForm((prev) => ({
      ...prev,
      fullName: prev.fullName || displayName,
    }));
  }, [displayName]);

  const recentProducts = recentlyViewedProducts || [];
  const wishProducts = wishlistProducts || [];

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }
    setIsSavingProfile(true);
    try {
      await api("users/me", {
        method: "PUT",
        body: { name: profileName.trim() },
      });
      await mutateMe();
      toast.success("Account preferences updated.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (
      !addressForm.fullName ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.pin
    ) {
      toast.error("Please fill in all required address fields.");
      return;
    }
    setIsSavingAddress(true);
    try {
      await api("users/addresses", {
        method: "POST",
        body: addressForm,
      });
      await mutateMe();
      setShowAddAddress(false);
      setAddressForm({
        fullName: displayName,
        phone: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        addressType: "Home",
        isDefault: false,
      });
      toast.success("New address saved.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save address.");
    } finally {
      setIsSavingAddress(false);
    }
  }

  async function handleDeleteAddress(addressId: string) {
    try {
      await api(`users/addresses/${addressId}`, {
        method: "DELETE",
      });
      await mutateMe();
      toast.success("Address deleted.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete address.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl py-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-neutral-900 text-xl font-bold text-white shrink-0">
            {displayName[0] ? displayName[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="font-sans text-2xl font-bold text-neutral-950">
              Welcome back, {displayName}.
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Logged in as {displayEmail || "authenticated user"}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-200/80 px-3 py-1.5 text-xs font-mono text-neutral-700">
            <Sparkles className="size-3.5 text-indigo-600" />
            <span>Doubt Points: {doubtPoints}</span>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-2xs"
            >
              <LogOut className="size-3.5" />
              <span>Log Out</span>
            </button>
          </form>
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
              {
                id: "addresses",
                label: `Addresses (${addresses.length})`,
                icon: MapPin,
              },
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

            <div className="pt-2 mt-2 border-t border-neutral-100">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </form>
            </div>
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
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-indigo-600 hover:underline mt-2 inline-block text-left"
                  >
                    View orders →
                  </button>
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
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View all ({orders.length})
                  </button>
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
                  <div className="py-6 text-center text-xs text-neutral-500">
                    <p>No active orders in this timeline.</p>
                    <Link
                      href="/products"
                      className="mt-2 inline-block font-semibold text-indigo-600 hover:underline"
                    >
                      Browse questionable catalog →
                    </Link>
                  </div>
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
              {orders.length > 0 ? (
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
                          {o.items.length} items • {formatPrice(o.total)} •{" "}
                          <span className="font-medium text-neutral-700">
                            {o.status}
                          </span>
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
              ) : (
                <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
                  <Package className="mx-auto size-8 text-neutral-400 mb-2" />
                  <p className="font-semibold text-neutral-800 text-sm">
                    No orders placed yet
                  </p>
                  <p className="mt-1">
                    When you order objects, they will be logged here.
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block rounded bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    Explore Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Wishlist Items ({wishProducts.length})
              </h2>
              {wishProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishProducts.map((p) => {
                    const pid = p._id || p.slug;
                    const price =
                      typeof p.minPrice === "number" ? p.minPrice : 0;
                    return (
                      <Link
                        key={pid}
                        href={`/product/${p.slug || p._id || pid}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all"
                      >
                        <div className="size-14 rounded border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                          <ProductVisual
                            visualId={p.visualId || p.slug || ""}
                            showStudioLighting={false}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-neutral-900 truncate">
                            {p.name}
                          </p>
                          <p className="text-xs font-bold text-neutral-950 mt-0.5">
                            {formatPrice(price)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
                  <Heart className="mx-auto size-8 text-neutral-400 mb-2" />
                  <p className="font-semibold text-neutral-800 text-sm">
                    Your wishlist is empty
                  </p>
                  <p className="mt-1">
                    Save suspicious artifacts to review or contemplate later.
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block rounded bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-sans text-lg font-bold text-neutral-950">
                    Saved Addresses
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Delivery destinations on record for this account.
                  </p>
                </div>
                {!showAddAddress && (
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(true)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {/* Add Address Form Modal/Card */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-4 text-xs"
                >
                  <h3 className="font-sans font-bold text-neutral-900 text-sm">
                    Add New Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            fullName: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-3 outline-none focus:border-indigo-600"
                        placeholder="Recipient name"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-3 outline-none focus:border-indigo-600"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            address: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-3 outline-none focus:border-indigo-600"
                        placeholder="House / Flat / Street address"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            city: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-3 outline-none focus:border-indigo-600"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            state: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-3 outline-none focus:border-indigo-600"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Postal Code / PIN *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.pin}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            pin: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-3 outline-none focus:border-indigo-600"
                        placeholder="Postal Code"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Address Type
                      </label>
                      <select
                        value={addressForm.addressType}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressType: e.target.value,
                          })
                        }
                        className="h-9 w-full rounded border border-neutral-300 bg-white px-2 outline-none focus:border-indigo-600"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Nexus">Spacetime Nexus</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          isDefault: e.target.checked,
                        })
                      }
                      className="accent-indigo-600 size-4"
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-neutral-700 font-medium cursor-pointer"
                    >
                      Set as primary default address
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-indigo-100">
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="rounded bg-neutral-900 px-4 py-2 font-semibold text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
                    >
                      {isSavingAddress ? "Saving..." : "Save Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="rounded border border-neutral-300 bg-white px-4 py-2 font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((a, idx) => (
                    <div
                      key={a._id || idx}
                      className="rounded-lg border border-neutral-200 bg-white p-4 text-xs space-y-1.5 shadow-2xs relative group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-900">
                          {a.addressType || "Delivery Address"}
                        </span>
                        {a.isDefault && (
                          <span className="rounded bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[10px] font-semibold">
                            Primary Default
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-neutral-900 text-sm">
                        {a.fullName}
                      </p>
                      <p className="text-neutral-600">{a.address}</p>
                      <p className="text-neutral-600">
                        {a.city}
                        {a.state ? `, ${a.state}` : ""} — {a.pin}
                      </p>
                      {a.phone && (
                        <p className="text-neutral-400 mt-1">Phone: {a.phone}</p>
                      )}

                      {a._id && (
                        <div className="pt-2 border-t border-neutral-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(a._id!)}
                            className="text-[11px] font-medium text-red-600 hover:text-red-800 hover:underline inline-flex items-center gap-1"
                          >
                            <Trash2 className="size-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
                  <MapPin className="mx-auto size-8 text-neutral-400 mb-2" />
                  <p className="font-semibold text-neutral-800 text-sm">
                    No delivery addresses saved
                  </p>
                  <p className="mt-1">
                    Add your delivery coordinates for one-click checkout.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(true)}
                    className="mt-4 rounded bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    Add Address Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAYMENT METHODS */}
          {activeTab === "payments" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-1">
                Accepted Payment Gateways
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Secure checkout gateways supported on this store.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-indigo-600" />
                    <div>
                      <p className="font-bold text-neutral-900">
                        Credit & Debit Cards
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Visa, Mastercard, RuPay, Amex • 256-bit encrypted
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Active for Checkout
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-indigo-600" />
                    <div>
                      <p className="font-bold text-neutral-900">
                        UPI / Instant Payment
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Zero-delay transaction settlement
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Active for Checkout
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-5 text-indigo-600" />
                    <div>
                      <p className="font-bold text-neutral-900">
                        Temporal Credit & COD
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Pay on delivery or defer payment to timeline B
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Active for Checkout
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RECENTLY VIEWED */}
          {activeTab === "recent" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="font-sans text-lg font-bold text-neutral-950 mb-4">
                Recently Viewed Items ({recentProducts.length})
              </h2>
              {recentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recentProducts.map((p) => {
                    const pid = p._id || p.slug;
                    const price =
                      typeof p.minPrice === "number" ? p.minPrice : 0;
                    return (
                      <Link
                        key={pid}
                        href={`/product/${p.slug || p._id || pid}`}
                        className="flex flex-col rounded-lg border border-neutral-200 p-3 hover:border-neutral-300 transition-all text-xs"
                      >
                        <div className="aspect-square w-full rounded bg-neutral-50 overflow-hidden mb-2">
                          <ProductVisual
                            visualId={p.visualId || p.slug || ""}
                            showStudioLighting={false}
                          />
                        </div>
                        <span className="font-semibold text-neutral-900 truncate">
                          {p.name}
                        </span>
                        <span className="font-bold text-neutral-950 mt-1">
                          {formatPrice(price)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
                  <History className="mx-auto size-8 text-neutral-400 mb-2" />
                  <p className="font-semibold text-neutral-800 text-sm">
                    No recently viewed artifacts
                  </p>
                  <p className="mt-1">
                    Products you inspect while browsing will appear here.
                  </p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block rounded bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === "settings" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-8">
              <div>
                <h2 className="font-sans text-lg font-bold text-neutral-950 mb-1">
                  Account Settings
                </h2>
                <p className="text-xs text-neutral-500 mb-4">
                  Update your account credentials and personal preferences.
                </p>
                <form
                  onSubmit={handleSaveSettings}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="h-9 w-full sm:w-80 rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={displayEmail}
                      className="h-9 w-full sm:w-80 rounded border border-neutral-200 bg-neutral-100 px-3 text-neutral-600 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Email address is tied to your primary authentication
                      record.
                    </p>
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
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="rounded bg-neutral-900 px-5 py-2 font-semibold text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
                    >
                      {isSavingProfile ? "Saving..." : "Save Preferences"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Session Security / Sign Out */}
              <div className="pt-6 border-t border-neutral-200">
                <h3 className="font-sans text-sm font-bold text-neutral-950 mb-1">
                  Session Security
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Sign out of your active session on this device.
                </p>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors inline-flex items-center gap-2"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out of Account</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
