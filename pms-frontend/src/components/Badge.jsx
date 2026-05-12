// Etiqueta de color para mostrar estados de habitaciones y reservas
const colores = {
  disponible:    'bg-green-100 text-green-800',
  ocupada:       'bg-red-100 text-red-800',
  mantenimiento: 'bg-yellow-100 text-yellow-800',
  pendiente:     'bg-blue-100 text-blue-800',
  confirmada:    'bg-green-100 text-green-800',
  cancelada:     'bg-gray-100 text-gray-600',
}

export default function Badge({ estado }) {
  return (
    <span className={px-2 py-0.5 rounded-full text-xs font-medium }>
      {estado}
    </span>
  )
}