/**
 * AdminUsers – User management page (CRUD) for the Administrador role.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - Data table uses proper <caption>, <th scope="col">.
 *  - Action buttons include aria-label with the user's name.
 */
export default function AdminUsers() {
  // TODO: Fetch users from GET /api/users and implement create/edit/delete UI
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-4 text-2xl font-bold text-hotel-night">Gestión de Usuarios</h1>
      <p className="text-gray-500">Implementación pendiente.</p>
    </main>
  );
}
