/**
 * Shapes returned by the Node backend (imagination-store).
 * The backend answers in camelCase with `_id` as the id key. Keep in sync with
 * its `core/serialize.js`.
 */

export type ProductImage = {
  id: string;
  public_id: string;
  url: string;
};

export type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  images: ProductImage[];
  minPrice: number | null;
  maxPrice: number | null;
  totalStock: number;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  oddness?: string;
  shortDescription?: string;
  visualId?: string;
  originalPrice?: number;
  isLimited?: boolean;
  scarcityNote?: string;
  specifications?: Record<string, string>;
  whatsIncluded?: string[];
  frequentlyBoughtTogether?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Variant = {
  _id: string;
  productId: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  name?: string;
  sku?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductDetail = {
  product: Product;
  variants: Variant[];
  /** How many lines buyers can receive (the lines themselves stay secret). */
  lineCount?: number;
};

/**
 * What a shopper receives: a quote or line written for the product. This is the
 * admin's view of one entry in a product's pool; `variantId` null = any variant.
 */
export type ProductLine = {
  _id: string;
  productId: string;
  variantId: string | null;
  text: string;
  attribution?: string;
};

/** A line a buyer received. Only present once the order is delivered. */
export type DeliveredLine = { text: string; attribution?: string };

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Paginated<K extends string, T> = { [P in K]: T[] } & {
  pagination: Pagination;
};

export type PriceBreakup = {
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
};

/** A cart line as returned by GET /cart (already priced by the backend). */
export type CartLine = {
  variantId: string;
  productId: string;
  productImage: string | null;
  /** Artwork id to draw when `productImage` is missing or fails to load. */
  visualId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  items: CartLine[];
  savedForLater?: CartLine[];
  priceBreakup: PriceBreakup;
  couponCode?: string | null;
  appliedCoupon?: { code: string; description: string } | null;
};

/** A cart as listed by the admin endpoints. */
export type CartRecord = {
  _id: string;
  /** The owner: a user's id, or the browser's guest id when `isGuest`. */
  userId: string;
  isGuest?: boolean;
  items: { variantId: string; name?: string; quantity: number }[];
  createdAt?: string;
  updatedAt?: string;
};

export type OrderStatus = "pending" | "confirmed" | "failed" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed";
export type TrackingStatus =
  | "Ordered"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

export type TrackingTimelineEvent = {
  status: TrackingStatus;
  label: string;
  desc: string;
  timestamp: string;
};

export type DeliveryAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  addressType: string;
};

export type OrderItem = {
  variantId: string;
  productId: string;
  productImage?: string | null;
  visualId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
  /** One per unit; empty (sealed) until the order is Delivered. */
  lines?: DeliveredLine[];
};

export type Order = {
  _id: string;
  orderNumber?: string;
  userId: string;
  items: OrderItem[];
  priceBreakup: PriceBreakup;
  deliveryAddress?: DeliveryAddress;
  deliveryOption?: "standard" | "express" | "temporal";
  paymentMethod?: "card" | "upi" | "cod" | "temporal_credit";
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingStatus?: TrackingStatus;
  trackingTimeline?: TrackingTimelineEvent[];
  estimatedDelivery?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Role = "user" | "admin";

export type UserAddress = DeliveryAddress & {
  _id?: string;
  isDefault?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  doubtPoints?: number;
  addresses?: UserAddress[];
  wishlist?: (string | Product)[];
  createdAt?: string;
};

export type Review = {
  _id: string;
  productId: string | { _id: string; name: string; slug?: string; visualId?: string };
  userId?: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
};

export type ReviewsResponse = {
  reviews: Review[];
  summary: {
    averageRating: number;
    totalReviews: number;
    ratingCounts: Record<number, number>;
  };
  pagination: Pagination;
};

export type Subscriber = { _id: string; email: string; createdAt: string };

/** A user as the admin and `/users/me` endpoints return it (`_id`, not `id`). */
export type UserRecord = Omit<User, "id"> & { _id: string };

export type Banner = {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  link?: string | null;
};

export type Category = {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  path: string;
};

export type SectionItem = {
  _id?: string;
  /** Populated by the backend; `null` when the product was deleted. */
  productId: Product | null;
  order: number;
};

export type Section = {
  _id: string;
  title: string;
  order: number;
  items: SectionItem[];
};

export type AuthResult = {
  user: User;
  token: string;
};
