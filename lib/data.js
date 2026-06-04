import 'server-only';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { LOW_STOCK_THRESHOLD } from '@/lib/slug';

// =====================================================================
//  LECTURAS DEL PANEL (servidor, con service_role).
//  A diferencia del sitio público, aquí vemos TODO: publicado o no.
// =====================================================================

// Precio efectivo de una variante (usa price_override si existe).
function variantPrice(variant, product) {
  const override = variant.price_override;
  if (override !== null && override !== undefined) return Number(override);
  return Number(product.price) || 0;
}

function totalStock(variants = []) {
  return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
}

// Todos los productos con su categoría y variantes (para tablas y métricas).
export async function getAllProducts() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from('products')
    .select(
      'id, slug, name, short_desc, price, currency, is_published, is_featured, updated_at, category_id, categories ( id, name, slug ), product_variants ( id, name, sku, stock, price_override, is_active )'
    )
    .order('updated_at', { ascending: false });

  if (error) throw new Error('No se pudieron cargar los productos: ' + error.message);

  return (data || []).map((p) => ({
    ...p,
    category_name: p.categories?.name || 'Sin categoría',
    category_slug: p.categories?.slug || null,
    total_stock: totalStock(p.product_variants),
  }));
}

// Un producto completo para la pantalla de edición.
export async function getProductById(id) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from('products')
    .select(
      'id, slug, name, short_desc, story, materials, dimensions, price, currency, is_published, is_featured, category_id, product_variants ( id, name, sku, stock, price_override, is_active ), product_images ( id, url, alt, position )'
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error('No se pudo cargar el producto: ' + error.message);
  if (!data) return null;

  // Ordena variantes e imágenes de forma estable.
  data.product_variants = (data.product_variants || []).sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );
  data.product_images = (data.product_images || []).sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );
  return data;
}

// Categorías (todas, activas o no) para selects y para el CRUD.
export async function getAllCategories() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from('categories')
    .select('id, slug, name, description, position, is_active')
    .order('position', { ascending: true });
  if (error) throw new Error('No se pudieron cargar las categorías: ' + error.message);
  return data || [];
}

// Métricas del dashboard.
export async function getDashboard() {
  const products = await getAllProducts();

  let stockTotal = 0;
  let inventoryValue = 0;
  const lowStock = [];
  const byCategory = new Map(); // category_name -> { stock, value, products }

  for (const p of products) {
    stockTotal += p.total_stock;

    let productValue = 0;
    for (const v of p.product_variants || []) {
      productValue += variantPrice(v, p) * (Number(v.stock) || 0);
    }
    inventoryValue += productValue;

    const key = p.category_name || 'Sin categoría';
    const cat = byCategory.get(key) || { name: key, stock: 0, value: 0, products: 0 };
    cat.stock += p.total_stock;
    cat.value += productValue;
    cat.products += 1;
    byCategory.set(key, cat);

    if (p.total_stock <= LOW_STOCK_THRESHOLD) {
      lowStock.push({
        id: p.id,
        name: p.name,
        slug: p.slug,
        total_stock: p.total_stock,
        is_published: p.is_published,
      });
    }
  }

  lowStock.sort((a, b) => a.total_stock - b.total_stock);

  // Stock por categoría, ordenado de mayor a menor (para la gráfica de barras).
  const stockByCategory = [...byCategory.values()].sort((a, b) => b.stock - a.stock);

  const publishedProducts = products.filter((p) => p.is_published).length;

  // -------------------------------------------------------------------------
  //  DATOS DE EJEMPLO (DEMO) — NO son ventas reales.
  //  El sistema todavía no registra pedidos/ventas, así que estas cifras se
  //  generan para que las gráficas luzcan completas en la demostración.
  //  Cuando exista una tabla de pedidos, reemplazar esta sección por la
  //  lectura real (ver getDemoSales más abajo).
  // -------------------------------------------------------------------------
  const demo = getDemoSales(products);

  return {
    totalProducts: products.length,
    publishedProducts,
    draftProducts: products.length - publishedProducts,
    stockTotal,
    inventoryValue,
    lowStockCount: lowStock.length,
    lowStock,
    threshold: LOW_STOCK_THRESHOLD,
    stockByCategory,
    weeklySales: demo.weeklySales,
    topSold: demo.topSold,
    isDemoSales: true,
  };
}

// Hash determinista de un texto -> entero estable (para que los datos demo
// no cambien en cada recarga y se vean "reales").
function hashStr(s = '') {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Genera ventas de ejemplo a partir de los productos reales (usa sus nombres
// para que la demo se sienta coherente con el catálogo).
function getDemoSales(products) {
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  // Curva semanal con forma orgánica (fin de semana más alto).
  const pattern = [5, 7, 6, 9, 13, 11, 4];
  const weeklySales = weekDays.map((label, i) => ({ label, value: pattern[i] }));

  const topSold = products
    .map((p) => ({ name: p.name, units: (hashStr(p.name) % 34) + 6 }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 6);

  return { weeklySales, topSold };
}
