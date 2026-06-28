import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getAllCategories } from '@/lib/data';
import { updateProduct, deleteProduct } from '@/app/actions/productos';
import ProductForm from '@/components/ProductForm';
import VariantsEditor from '@/components/VariantsEditor';
import ImagesEditor from '@/components/ImagesEditor';
import SubmitButton from '@/components/SubmitButton';
import { Card } from '@/components/ui';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  return { title: `${product?.name || 'Producto'} · Taluna Admin` };
}

export default async function EditarProductoPage({ params }) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <Link href="/productos" className="text-sm font-semibold text-accent hover:underline">
            ← Volver a productos
          </Link>
          <h1 className="mt-2 font-display text-2xl text-charcoal">{product.name}</h1>
          <p className="text-sm text-muted">/{product.slug}</p>
        </div>
      </div>

      {/* Datos generales */}
      <ProductForm
        action={updateProduct}
        categories={categories}
        product={product}
        submitLabel="Guardar cambios"
      />

      {/* Variantes y stock */}
      <section className="mt-8">
        <h2 className="mb-1 font-display text-xl text-charcoal">Variantes y stock</h2>
        <p className="mb-3 text-sm text-muted">
          Colores u opciones del producto. Aquí controlas las existencias.
        </p>
        <Card>
          <VariantsEditor productId={product.id} variants={product.product_variants} />
        </Card>
      </section>

      {/* Imágenes */}
      <section className="mt-8">
        <h2 className="mb-1 font-display text-xl text-charcoal">Fotos</h2>
        <p className="mb-3 text-sm text-muted">
          La primera (orden más bajo) es la principal en el catálogo.
        </p>
        <Card>
          <ImagesEditor
            productId={product.id}
            productSlug={product.slug}
            images={product.product_images}
          />
        </Card>
      </section>

      {/* Zona peligrosa */}
      <section className="mt-8">
        <Card className="border-dangerBg bg-dangerBg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg text-danger">Eliminar producto</p>
              <p className="text-sm text-[#8a3a43]">
                Se borran también sus variantes e imágenes. Esta acción no se puede deshacer.
              </p>
            </div>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={product.id} />
              <SubmitButton variant="danger" pendingText="Eliminando…">
                Eliminar
              </SubmitButton>
            </form>
          </div>
        </Card>
      </section>
    </div>
  );
}
