import Navbar from '../layouts/Navbar'
import ReservaForm from '../components/ReservaForm'

export default function ReservaFormPage() {
  return (
    <div className="page">
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '1.8rem', fontWeight: 700 }}>Nueva reserva</h2>
        <div className="glass" style={{ padding: '40px' }}>
          <ReservaForm />
        </div>
      </div>
    </div>
  )
}