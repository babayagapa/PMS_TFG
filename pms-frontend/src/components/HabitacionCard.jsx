import Badge from './Badge'
import { useNavigate } from 'react-router-dom'
import { formatEuros } from '../utils/formatDate'

export default function HabitacionCard({ habitacion }) {
  const nav       = useNavigate()
  const disponible = !habitacion.ocupada && habitacion.estado_limpieza === 'Limpia'

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Cabecera con numero de habitacion */}
      <div className="bg-primary h-28 flex items-center justify-center">
        <span className="text-white text-5xl font-extrabold">{habitacion.numero}</span>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-bold text-dark">Habitacion {habitacion.numero}</p>
            <p className="text-sm text-gray-500">{habitacion.tipo}</p>
          </div>
          <Badge estado={disponible ? 'disponible' : 'ocupada'} />
        </div>

        <p className="text-2xl font-bold text-primary mb-1">
          {formatEuros(habitacion.precio_noche)}
          <span className="text-xs text-gray-400 font-normal"> / noche</span>
        </p>

        <p className="text-xs text-gray-500 mb-3">
          Hasta {habitacion.capacidad} {habitacion.capacidad === 1 ? 'persona' : 'personas'}
        </p>

        {habitacion.amenidades && habitacion.amenidades.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {habitacion.amenidades.slice(0, 3).map(a => (
              <span key={a} className="text-xs bg-surface text-dark px-2 py-1 rounded-full border border-green-200">
                {a}
              </span>
            ))}
            {habitacion.amenidades.length > 3 && (
              <span className="text-xs text-gray-400 px-1 py-1">
                +{habitacion.amenidades.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          disabled={!disponible}
          onClick={() => nav(`/reservas/nueva?id_habitacion=${habitacion._id}`)}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            disponible
              ? 'bg-primary text-white hover:bg-primary-dark shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {disponible ? 'Reservar' : 'No disponible'}
        </button>
      </div>

    </div>
  )
}
