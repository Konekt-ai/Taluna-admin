import { getAllCategories } from '@/lib/data';
import CategoriesManager from '@/components/CategoriesManager';
import { Card, FlashMessage } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Categorías · Taluna Admin' };

export default async function CategoriasPage({ searchParams }) {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5">
        <h1 className="font-display text-2xl text-ink">Categorías</h1>
        <p className="text-sm text-muted">
          Organizan el catálogo (Bolsas, Straps, …). El orden controla cómo se listan.
        </p>
      </div>

      <FlashMessage ok={searchParams?.ok} error={searchParams?.error} />

      <Card>
        <CategoriesManager categories={categories} />
      </Card>
    </div>
  );
}
