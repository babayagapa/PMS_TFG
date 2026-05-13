// Misma fórmula que el backend: precio_noche * noches * 1.10
export function calcularPrecio(precioNoche, fechaEntrada, fechaSalida) {
  const noches = Math.floor((new Date(fechaSalida) - new Date(fechaEntrada)) / 86400000)
  if (noches <= 0) return { noches: 0, base: 0, iva: 0, total: 0 }
  const base  = precioNoche * noches
  const iva   = base * 0.1
  const total = Math.round((base + iva) * 100) / 100
  return { noches, base, iva, total }
}