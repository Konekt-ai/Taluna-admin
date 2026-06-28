import Link from 'next/link';
import { getAllCategories } from '@/lib/data';
import { createProduct } from '@/app/actions/productos';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Nuevo producto · Taluna Admin' };

export default async function NuevoProductoPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/productos" className="text-sm font-semibold text-accent hover:underline">
          ← Volver a productos
        </Link>
        <h1 className="mt-2 font-display text-[clamp(1.6rem,4vw,2.1rem)] leading-tight text-charcoal">
          Nuevo producto
        </h1>
        <p className="mt-1 text-sm text-muted">
          Después de crearlo podrás agregar variantes (colores y stock) y fotos.
        </p>
      </div>

      <ProductForm action={createProduct} categories={categories} submitLabel="Crear producto" />
    </div>
  );
}
