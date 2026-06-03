// Formatea precio en pesos (o la moneda que venga). Mismo criterio que el
// sitio público para que todo se vea igual.
export function formatPrice(value, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-MX').format(Number(value) || 0);
}
