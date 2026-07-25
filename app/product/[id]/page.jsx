import { getProducts } from "@/lib/supabase";
import PDPClient from "./PDPClient";

export const revalidate = 60;

export default async function ProductPage({ params }) {
  const products = await getProducts();
  const product = products.find(p => p.id === params.id);
  if (!product) return <main className="pt-40 text-center text-mutedwarm">Bag not found. <a href="/shop" className="underline">Back to the collection</a></main>;
  return <PDPClient product={product} allProducts={products} />;
}
