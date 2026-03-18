/**
 * ClientReservations – Reservation list and booking for the Cliente role.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - Date pickers include descriptive labels and aria attributes.
 *  - Confirmation dialogs are announced via role="dialog" and aria-modal.
 */
export default function ClientReservations() {
  // TODO: Fetch from GET /api/reservations (filtered by client) and allow new booking
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-4 text-2xl font-bold text-hotel-night">Mis Reservas</h1>
      <p className="text-gray-500">Implementación pendiente.</p>
    </main>
  );
}
