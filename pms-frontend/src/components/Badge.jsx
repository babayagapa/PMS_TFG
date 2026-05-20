const colores = {
  Limpia: 'bg-green-100 text-green-800',
  Sucia: 'bg-red-100 text-red-800',
  'En mantenimiento': 'bg-yellow-100 text-yellow-800',
  Pendiente: 'bg-blue-100 text-blue-800',
  Confirmada: 'bg-green-100 text-green-800',
  Cancelada: 'bg-gray-100 text-gray-600',
  ocupada: 'bg-red-100 text-red-800',
  disponible: 'bg-green-100 text-green-800',
  pagado: 'bg-green-100 text-green-800',
  pendiente: 'bg-yellow-100 text-yellow-800',
  reembolsado: 'bg-red-100 text-red-800',
}

export default function Badge({ estado }) {
  const color = colores[estado] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {estado}
    </span>
  )
}