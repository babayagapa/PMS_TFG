import Badge from './Badge'
import { useNavigate } from 'react-router-dom'
import { formatEuros } from '../utils/formatDate'

export default function HabitacionCard({ habitacion }) {
  const nav = useNavigate()
  const disponible = !habitacion.ocupada

  return (
    <div className="glass" style={{ overflow: 'hidden', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.05)'}
    >
      <div style={{ background: '#2ECC71', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'white', fontSize: '3rem', fontWeight: 800 }}>{habitacion.numero}</span>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#2C3E50' }}>Habitación {habitacion.numero}</p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#999' }}>{habitacion.tipo}</p>
          </div>
          <Badge estado={disponible ? 'disponible' : 'ocupada'} />
        </div>

        <p style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, color: '#2ECC71' }}>
          {formatEuros(habitacion.precio_noche)}
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#aaa' }}> / noche</span>
        </p>

        <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#aaa' }}>
          Hasta {habitacion.capacidad} {habitacion.capacidad === 1 ? 'persona' : 'personas'}
        </p>

        {habitacion.amenidades && habitacion.amenidades.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {habitacion.amenidades.slice(0, 3).map(a => (
              <span key={a} style={{ fontSize: '11px', background: 'rgba(46,204,113,0.1)', color: '#27AE60', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.2)' }}>
                {a}
              </span>
            ))}
            {habitacion.amenidades.length > 3 && (
              <span style={{ fontSize: '11px', color: '#aaa' }}>+{habitacion.amenidades.length - 3}</span>
            )}
          </div>
        )}

        <button
          disabled={!disponible}
          onClick={() => nav(`/reservas/nueva?id_habitacion=${habitacion._id}`)}
          className={disponible ? 'btn-primary' : ''}
          style={disponible
            ? { width: '100%', padding: '12px', fontSize: '14px' }
            : { width: '100%', padding: '12px', fontSize: '14px', background: '#f0f0f0', color: '#aaa', border: 'none', borderRadius: '10px', cursor: 'not-allowed', fontWeight: 600 }
          }
        >
          {disponible ? 'Reservar' : 'No disponible'}
        </button>
      </div>
    </div>
  )
}