/**
 * Shapes returned by the Node backend (imagination-store).
 * Keep in sync with its mongoose models.
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
  createdAt?: string;
  updatedAt?: string;
};

export type Variant = {
  _id: string;
  productId: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  sku?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductDetail = {
  product: Product;
  variants: Variant[];
};

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
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  items: CartLine[];
  priceBreakup: PriceBreakup;
};

/** A raw cart document, as listed by the admin endpoints. */
export type CartRecord = {
  _id: string;
  userId: string;
  items: { variantId: string; name?: string; quantity: number }[];
  createdAt?: string;
  updatedAt?: string;
};

export type OrderStatus = "pending" | "confirmed" | "failed" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed";

export type OrderItem = {
  variantId: string;
  productId: string;
  productImage?: string | null;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  priceBreakup: PriceBreakup;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Role = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
};

/** Users listed by the admin endpoints come straight from mongoose (`_id`). */
export type Subscriber = { _id: string; email: string; createdAt: string };

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
  imageUrl: string;
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
