import Badge from './Badge'
import { useNavigate } from 'react-router-dom'

// TODO: mostrar imagen, nÃºmero, tipo, precio, amenidades y botÃ³n reservar
export default function HabitacionCard({ habitacion }) {
  const nav = useNavigate()
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <p className="font-bold">Hab. {habitacion.numero}</p>
      <Badge estado={habitacion.estado} />
      {/* TODO: completar en mÃ³dulo 4 */}
    </div>
  )
}