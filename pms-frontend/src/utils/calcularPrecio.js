// Calcula desglose de precio con servicios incluidos
export function calcularPrecio(precioNoche, fechaEntrada, fechaSalida, serviciosSel = []) {
  const noches = Math.floor((new Date(fechaSalida) - new Date(fechaEntrada)) / 86400000)
  if (noches <= 0) return { noches: 0, base: 0, servicios: 0, iva: 0, total: 0 }

  const base = precioNoche * noches
  const servicios = serviciosSel.reduce((sum, s) => sum + (s.precio || 0) * (s.cantidad || 1), 0)
  const subtotal = base + servicios
  const iva   = subtotal * 0.1
  const total = Math.round((subtotal + iva) * 100) / 100

  return { noches, base, servicios, iva, total }
}