import { ProductShelf } from "@/components/product/product-shelf";
import type { Section } from "@/lib/api/types";

export function HomeSection({ section }: { section: Section }) {
  const products = section.items.flatMap((item) => (item.productId ? [item.productId] : []));
  return <ProductShelf title={section.title} products={products} href={`/sections/${section._id}`} />;
}
