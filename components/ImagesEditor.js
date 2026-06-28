import SubmitButton from '@/components/SubmitButton';
import { Input } from '@/components/ui';
import { uploadImage, updateImagePosition, deleteImage } from '@/app/actions/imagenes';

export default function ImagesEditor({ productId, productSlug, images = [] }) {
  return (
    <div>
      {images.length === 0 ? (
        <p className="mb-4 text-sm text-muted">Aún no hay fotos para este producto.</p>
      ) : (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-card border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ''}
                className="aspect-[4/5] w-full object-cover"
              />
              <form className="flex items-center gap-1.5 p-2">
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="product_id" value={productId} />
                <input type="hidden" name="url" value={img.url} />
                <label className="flex items-center gap-1 text-xs text-muted">
                  Orden
                  <Input
                    name="position"
                    type="number"
                    step="1"
                    defaultValue={img.position ?? 0}
                    className="w-14 px-2 py-1"
                  />
                </label>
                <SubmitButton
                  formAction={updateImagePosition}
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  pendingText="…"
                >
                  ✓
                </SubmitButton>
                <SubmitButton
                  formAction={deleteImage}
                  variant="danger"
                  className="ml-auto px-2 py-1 text-xs"
                  pendingText="…"
                >
                  ✕
                </SubmitButton>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* Subir nueva foto */}
      <form className="rounded-card border border-dashed border-line bg-cream p-4">
        <input type="hidden" name="product_id" value={productId} />
        <input type="hidden" name="product_slug" value={productSlug} />
        <p className="mb-2 font-display text-sm font-semibold text-charcoal">Subir foto</p>
        <p className="mb-3 text-xs text-muted">
          Recomendado: proporción <strong>4:5 vertical</strong>, mínimo <strong>900px</strong> de ancho. JPG o PNG.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-camel file:px-3 file:py-1.5 file:text-white"
          />
          <Input name="alt" placeholder="Texto alternativo (opcional)" className="max-w-xs" />
          <SubmitButton pendingText="Subiendo…">Subir</SubmitButton>
        </div>
      </form>
    </div>
  );
}
