import Badge from './Badge'
import { useNavigate } from 'react-router-dom'
import { formatEuros } from '../utils/formatDate'

export default function HabitacionCard({ habitacion }) {
  const nav = useNavigate()
  const disponible = !habitacion.ocupada && habitacion.estado_limpieza === 'Limpia'

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="bg-primary h-32 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">{habitacion.numero}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-bold text-gray-800">Hab. {habitacion.numero}</p>
            <p className="text-sm text-gray-500">{habitacion.tipo}</p>
          </div>
          <Badge estado={disponible ? 'disponible' : 'ocupada'} />
        </div>
        <p className="text-lg font-bold text-secondary mb-1">
          {formatEuros(habitacion.precio_noche)}<span className="text-xs text-gray-500"> / noche</span>
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Capacidad: {habitacion.capacidad} personas
        </p>
        {habitacion.amenidades && (
          <div className="flex flex-wrap gap-1 mb-3">
            {habitacion.amenidades.slice(0, 3).map((a) => (
              <span key={a} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{a}</span>
            ))}
          </div>
        )}
        <button
          disabled={!disponible}
          onClick={() => nav(`/reservas/nueva?id_habitacion=${habitacion._id}`)}
          className={`w-full py-2 rounded text-sm font-medium transition-colors ${
            disponible
              ? 'bg-secondary text-white hover:bg-yellow-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {disponible ? 'Reservar' : 'No disponible'}
        </button>
      </div>
    </div>
  )
}
