


PMS_TFG/
├── pms-backend/           # Servidor API desarrollado con Laravel
├── pms-frontend/          # Cliente Web desarrollado con React + Vite
├── docker-compose.yml     # Orquestador de contenedores (App, DB, Servidor)
├── .gitignore             # Archivos excluidos del control de versiones
└── README.md              # Documentación técnica inicial del proyecto



pms-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/   # Lógica: AuthController, HabitacionController, ReservaController
│   │   └── Middleware/    # Filtro de seguridad: JwtMiddleware.php
│   └── Models/            # Esquemas MongoDB: Habitacion.php, Reserva.php, User.php
├── database/seeders/      # Datos de prueba: UserSeeder, HabitacionSeeder
├── routes/api.php         # Definición de todos los puntos de acceso (Endpoints)
├── .env.example           # Plantilla de variables de entorno (BBDD, Secretos)
└── Dockerfile             # Configuración de imagen para el contenedor PHP





pms-frontend/
├── src/
│   ├── components/        # UI: Badge, HabitacionCard, ReservaForm, Spinner
│   ├── context/           # Estado global: AuthContext.jsx
│   ├── hooks/             # Lógica reutilizable: useHabitaciones, useReservas
│   ├── layouts/           # Estructuras: Navbar.jsx, Sidebar.jsx
│   ├── pages/             # Vistas: LandingPage, PanelPage, LoginPage, ReservasPage
│   ├── services/          # API: auth.service, habitaciones.service, axios.js
│   └── utils/             # Ayudas: calcularPrecio.js, formatDate.js
├── tailwind.config.js     # Configuración de estilos y colores verdes
├── vite.config.js         # Configuración del empaquetador Vite
└── package.json           # Dependencias del proyecto (React, Axios, Tailwind)
