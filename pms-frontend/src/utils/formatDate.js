export const formatDate = (d) =>
  new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const formatEuros = (n) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)

export const hoy = () => new Date().toISOString().split('T')[0]