"use client";

import { ProductVisual } from "@/components/ui/product-visual";
import { useStore, type PlacedOrder } from "@/lib/client/store";
import { cn, formatPrice } from "@/lib/utils";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CreditCard,
    Lock,
    MapPin,
    Truck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    placeOrder,
    clearCart,
  } = useStore();

  const [step, setStep] = useState<Step>(1);

  // Step 1: Address State
  const [address, setAddress] = useState({
    fullName: "Arthur Dent",
    phone: "+1 (555) 019-2834",
    address: "42 Sub-Etha Expressway, Apt 7B",
    city: "Islington",
    state: "London",
    pin: "WC1N 3AX",
    addressType: "Home",
  });

  // Step 2: Delivery Option
  const [deliveryOption, setDeliveryOption] =
    useState<PlacedOrder["deliveryOption"]>("standard");

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] =
    useState<PlacedOrder["paymentMethod"]>("card");
  const [upiId, setUpiId] = useState("arthur@okicici");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");

  const [isPlacing, setIsPlacing] = useState(false);

  // If cart is empty and not currently placing, show fallback redirect
  if (cart.length === 0 && !isPlacing) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          You need at least one questionable object in your cart to proceed with
          checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-600"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !address.fullName ||
      !address.address ||
      !address.city ||
      !address.pin
    ) {
      toast.error("Please fill in all delivery address fields.");
      return;
    }
    setStep(2);
  }

  function handleDeliverySubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep(3);
  }

  function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep(4);
  }

  function handlePlaceOrder() {
    setIsPlacing(true);
    try {
      const order = placeOrder({
        address,
        deliveryOption,
        paymentMethod,
      });
      toast.success("Order Placed Successfully!", {
        description: `Order #${order.orderNumber} is now officially registered.`,
      });
      router.push(`/orders/success?orderId=${order.id}`);
    } catch {
      toast.error("Could not register order.");
      setIsPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      {/* Checkout Progress Stepper (Section 19: 1. Address → 2. Delivery → 3. Payment → 4. Review) */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: "Address" },
            { num: 2, label: "Delivery" },
            { num: 3, label: "Payment" },
            { num: 4, label: "Review" },
          ].map((st, i) => {
            const isCompleted = step > st.num;
            const isCurrent = step === st.num;
            return (
              <div key={st.num} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={st.num > step}
                  onClick={() => setStep(st.num as Step)}
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-xs font-bold transition-all",
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                        ? "bg-neutral-900 text-white ring-4 ring-neutral-200"
                        : "bg-neutral-200 text-neutral-500",
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : st.num}
                </button>
                <span
                  className={cn(
                    "text-xs font-semibold hidden sm:inline",
                    isCurrent
                      ? "text-neutral-950 font-bold"
                      : "text-neutral-500",
                  )}
                >
                  {st.label}
                </span>
                {i < 3 && (
                  <div className="h-px w-6 sm:w-16 bg-neutral-200 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form Area (8 cols) */}
        <div className="lg:col-span-8">
          {/* STEP 1: DELIVERY ADDRESS */}
          {step === 1 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
                <MapPin className="size-5 text-indigo-600" />
                <h2 className="font-sans text-lg font-bold text-neutral-950">
                  1. Delivery Address
                </h2>
              </div>

              <form
                onSubmit={handleAddressSubmit}
                className="space-y-4 text-xs sm:text-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                      }
                      className="h-10 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="h-10 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Street Address / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.address}
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                    className="h-10 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="h-10 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="h-10 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Postal PIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pin}
                      onChange={(e) =>
                        setAddress({ ...address, pin: e.target.value })
                      }
                      className="h-10 w-full rounded border border-neutral-300 px-3 outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-2">
                    Address Type
                  </label>
                  <div className="flex gap-4">
                    {["Home", "Office", "Liminal Space"].map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <input
                          type="radio"
                          name="addrType"
                          value={t}
                          checked={address.addressType === t}
                          onChange={() =>
                            setAddress({ ...address, addressType: t })
                          }
                          className="accent-indigo-600"
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    <span>Proceed to Delivery Options</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: DELIVERY OPTIONS */}
          {step === 2 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
                <Truck className="size-5 text-indigo-600" />
                <h2 className="font-sans text-lg font-bold text-neutral-950">
                  2. Delivery Options
                </h2>
              </div>

              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                {[
                  {
                    id: "standard",
                    name: "Standard Ground Delivery",
                    time: "2–4 Business Days",
                    desc: "Delivered in plain, bewildered cardboard by local courier.",
                    cost: "FREE",
                  },
                  {
                    id: "express",
                    name: "Express Courier Delivery",
                    time: "Next Business Day",
                    desc: "Handled with priority caution and minimal questioning.",
                    cost: "$25.00",
                  },
                  {
                    id: "temporal",
                    name: "Temporal Priority Dispatch",
                    time: "Arrived Yesterday (±0.00s)",
                    desc: "Synchronized with backward timeline buffer. Check your doorstep yesterday.",
                    cost: "$120.00",
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex items-start justify-between rounded-lg border p-4 cursor-pointer transition-all",
                      deliveryOption === opt.id
                        ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
                        : "border-neutral-200 hover:bg-neutral-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="delOption"
                        value={opt.id}
                        checked={deliveryOption === opt.id}
                        onChange={() =>
                          setDeliveryOption(
                            opt.id as PlacedOrder["deliveryOption"],
                          )
                        }
                        className="mt-1 accent-indigo-600"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">
                          {opt.name}
                        </p>
                        <p className="text-xs text-indigo-700 font-medium">
                          {opt.time}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-neutral-900">
                      {opt.cost}
                    </span>
                  </label>
                ))}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Address</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
                <CreditCard className="size-5 text-indigo-600" />
                <h2 className="font-sans text-lg font-bold text-neutral-950">
                  3. Payment Method
                </h2>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {[
                  {
                    id: "upi",
                    label: "UPI (Google Pay, PhonePe, Paytm, BHIM)",
                  },
                  {
                    id: "card",
                    label: "Credit / Debit Card (Visa, MasterCard, Amex)",
                  },
                  {
                    id: "netbanking",
                    label: "Net Banking (All Major Financial Institutions)",
                  },
                  { id: "wallet", label: "Digital Wallet" },
                  {
                    id: "cod",
                    label:
                      "Cash on Delivery (Questionable exchange upon receipt)",
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer text-xs sm:text-sm font-medium transition-all",
                      paymentMethod === pm.id
                        ? "border-indigo-600 bg-indigo-50/40 text-neutral-950 font-semibold"
                        : "border-neutral-200 text-neutral-700 hover:bg-neutral-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() =>
                        setPaymentMethod(pm.id as PlacedOrder["paymentMethod"])
                      }
                      className="accent-indigo-600"
                    />
                    <span>{pm.label}</span>
                  </label>
                ))}

                {/* Sub-inputs according to payment selection */}
                {paymentMethod === "upi" && (
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs">
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Enter UPI ID (e.g. yourname@okaxis)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="h-9 w-full sm:w-72 rounded border border-neutral-300 px-3 bg-white outline-none focus:border-indigo-600"
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs space-y-3">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-9 w-full sm:w-72 rounded border border-neutral-300 px-3 bg-white outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <label className="block font-semibold text-neutral-800 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="h-9 w-24 rounded border border-neutral-300 px-3 bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-neutral-800 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          defaultValue="420"
                          className="h-9 w-20 rounded border border-neutral-300 px-3 bg-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Delivery</span>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: ORDER REVIEW */}
          {step === 4 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h2 className="font-sans text-lg font-bold text-neutral-950">
                  4. Review &amp; Confirm Order
                </h2>
                <span className="text-xs text-neutral-400 font-mono">
                  FINAL TRANSACTION STEP
                </span>
              </div>

              {/* Review Shipping & Delivery summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neutral-900 uppercase tracking-wide">
                      Deliver To
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="font-semibold text-neutral-900">
                    {address.fullName}
                  </p>
                  <p className="text-neutral-600">{address.address}</p>
                  <p className="text-neutral-600">
                    {address.city}, {address.state} — {address.pin}
                  </p>
                  <p className="text-neutral-500 mt-1">
                    Phone: {address.phone}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neutral-900 uppercase tracking-wide">
                      Payment &amp; Speed
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="font-semibold text-neutral-900 capitalize">
                    Method: {paymentMethod.toUpperCase()}
                  </p>
                  <p className="text-neutral-600 capitalize">
                    Delivery: {deliveryOption} priority
                  </p>
                  <p className="text-emerald-700 font-medium mt-1">
                    ✓ Verified Encrypted Handshake
                  </p>
                </div>
              </div>

              {/* Items in order */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Items to be Manifested
                </h3>
                <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                  {cart.map((item) => (
                    <li
                      key={item.variantId}
                      className="flex items-center gap-3 p-3 text-xs"
                    >
                      <div className="size-12 rounded border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                        <ProductVisual
                          visualId={item.visualId}
                          name={item.name}
                          showStudioLighting={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Place Order CTA */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Payment</span>
                </button>

                <button
                  type="button"
                  disabled={isPlacing}
                  onClick={handlePlaceOrder}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 disabled:bg-neutral-300 shadow-md active:scale-98"
                >
                  <Lock className="size-4" />
                  <span>Place Order ({formatPrice(total)})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs sticky top-20">
            <h3 className="font-sans text-base font-bold text-neutral-950 pb-3 border-b border-neutral-100">
              Order Summary
            </h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Questionable Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium text-neutral-900">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Taxes (8%)</span>
                <span className="font-medium text-neutral-900">
                  {formatPrice(tax)}
                </span>
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between font-sans text-base font-bold text-neutral-950">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-neutral-50 p-3 text-[11px] text-neutral-500 leading-relaxed border border-neutral-200/60">
              <span className="font-bold text-neutral-700 block mb-0.5">
                Discreet Packaging Notice:
              </span>
              Your shipment will arrive sealed in heavy non-descript packaging.
              Couriers are legally prohibited from inspecting or comprehending
              the payload.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
