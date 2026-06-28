import SubmitButton from '@/components/SubmitButton';
import { Input } from '@/components/ui';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categorias';

function CategoryRow({ category }) {
  return (
    <form className="grid grid-cols-2 items-end gap-2 border-b border-lineSoft py-3 sm:grid-cols-12">
      <input type="hidden" name="id" value={category.id} />

      <label className="col-span-1 sm:col-span-3">
        <span className="mb-1 block text-xs text-muted">Nombre</span>
        <Input name="name" defaultValue={category.name || ''} required />
      </label>
      <label className="col-span-1 sm:col-span-2">
        <span className="mb-1 block text-xs text-muted">Slug</span>
        <Input name="slug" defaultValue={category.slug || ''} />
      </label>
      <label className="col-span-2 sm:col-span-4">
        <span className="mb-1 block text-xs text-muted">Descripción</span>
        <Input name="description" defaultValue={category.description || ''} />
      </label>
      <label className="col-span-1 sm:col-span-1">
        <span className="mb-1 block text-xs text-muted">Orden</span>
        <Input name="position" type="number" step="1" defaultValue={category.position ?? 0} />
      </label>
      <label className="col-span-1 flex items-center gap-2 pb-2 sm:col-span-1">
        <input type="checkbox" name="is_active" defaultChecked={category.is_active ?? true} className="h-4 w-4 accent-camel" />
        <span className="text-xs text-muted">Activa</span>
      </label>
      <div className="col-span-2 flex gap-2 sm:col-span-1">
        <SubmitButton formAction={updateCategory} className="px-3 py-1.5" pendingText="…">
          Guardar
        </SubmitButton>
        <SubmitButton formAction={deleteCategory} variant="danger" className="px-2.5 py-1.5" pendingText="…">
          ✕
        </SubmitButton>
      </div>
    </form>
  );
}

export default function CategoriesManager({ categories = [] }) {
  return (
    <div>
      {categories.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-cream p-10 text-center text-muted">
          Aún no hay categorías.
        </div>
      ) : (
        categories.map((c) => <CategoryRow key={c.id} category={c} />)
      )}

      {/* Crear nueva categoría */}
      <form className="mt-4 grid grid-cols-2 items-end gap-2 rounded-card border border-lineSoft bg-cream p-3 sm:grid-cols-12">
        <label className="col-span-1 sm:col-span-3">
          <span className="mb-1 block text-xs text-muted">Nombre</span>
          <Input name="name" placeholder="Nueva categoría" required />
        </label>
        <label className="col-span-1 sm:col-span-2">
          <span className="mb-1 block text-xs text-muted">Slug</span>
          <Input name="slug" placeholder="se genera solo" />
        </label>
        <label className="col-span-2 sm:col-span-4">
          <span className="mb-1 block text-xs text-muted">Descripción</span>
          <Input name="description" placeholder="opcional" />
        </label>
        <label className="col-span-1 sm:col-span-1">
          <span className="mb-1 block text-xs text-muted">Orden</span>
          <Input name="position" type="number" step="1" defaultValue={0} />
        </label>
        <label className="col-span-1 flex items-center gap-2 pb-2 sm:col-span-1">
          <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-camel" />
          <span className="text-xs text-muted">Activa</span>
        </label>
        <div className="col-span-2 sm:col-span-1">
          <SubmitButton formAction={createCategory} variant="camel" className="px-3 py-1.5" pendingText="…">
            Agregar
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
