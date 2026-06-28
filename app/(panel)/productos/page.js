import Link from 'next/link';
import { getAllProducts } from '@/lib/data';
import ProductsTable from '@/components/ProductsTable';
import { FlashMessage, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Productos · Taluna Admin' };

export default async function ProductosPage({ searchParams }) {
  const products = await getAllProducts();

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        intro={`${products.length} en total`}
        action={
          <Link
            href="/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal bg-charcoal px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e1b17]"
          >
            + Nuevo producto
          </Link>
        }
      />

      <FlashMessage ok={searchParams?.ok} error={searchParams?.error} />

      <ProductsTable products={products} />
    </div>
  );
}
