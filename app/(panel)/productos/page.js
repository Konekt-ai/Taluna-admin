import Link from 'next/link';
import { getAllProducts } from '@/lib/data';
import ProductsTable from '@/components/ProductsTable';
import { FlashMessage } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Productos · Taluna Admin' };

export default async function ProductosPage({ searchParams }) {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Productos</h1>
          <p className="text-sm text-muted">{products.length} en total</p>
        </div>
        <Link
          href="/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-wine px-4 py-2 text-sm font-medium text-cream transition hover:bg-wineSoft"
        >
          + Nuevo producto
        </Link>
      </div>

      <FlashMessage ok={searchParams?.ok} error={searchParams?.error} />

      <ProductsTable products={products} />
    </div>
  );
}
