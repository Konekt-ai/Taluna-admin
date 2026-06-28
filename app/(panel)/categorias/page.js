import { getAllCategories } from '@/lib/data';
import CategoriesManager from '@/components/CategoriesManager';
import { Card, FlashMessage, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Categorías · Taluna Admin' };

export default async function CategoriasPage({ searchParams }) {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Catálogo"
        title="Categorías"
        intro="Organizan el catálogo (Bolsas, Straps, …). El orden controla cómo se listan."
      />

      <FlashMessage ok={searchParams?.ok} error={searchParams?.error} />

      <Card>
        <CategoriesManager categories={categories} />
      </Card>
    </div>
  );
}
