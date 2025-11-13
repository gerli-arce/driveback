# Plataforma de Mototaxis - Pichanaki

Repositorio con backend Laravel y frontend React para iniciar un flujo tipo Uber entre pasajeros y conductores de mototaxi en Pichanaki, Peru.

## Backend (Laravel API)

Ubicacion: `backend/`

1. Instalar dependencias y llaves:

   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   ```

2. Por defecto se usa SQLite. Puedes dejarlo asi o configurar MySQL/PostgreSQL en `.env`.

3. Migrar y sembrar datos demo (pasajero y conductor):

   ```bash
   php artisan migrate --seed
   ```

4. Levantar la API en `http://localhost:8000`:

   ```bash
   php artisan serve
   ```

### Endpoints clave

| Ruta | Metodo | Descripcion |
| --- | --- | --- |
| `/api/auth/register` | POST | Registro con rol pasajero o conductor |
| `/api/auth/login` | POST | Inicio de sesion (retorna JWT) |
| `/api/passenger/trips` | GET/POST | Listar y crear viajes |
| `/api/passenger/trips/{trip}/rate` | POST | Calificar conductor |
| `/api/driver/availability` | POST | Estado disponible del conductor |
| `/api/driver/trips/available` | GET | Viajes pendientes |
| `/api/driver/trips/{trip}/accept|reject|start|complete` | POST | Flujo completo del viaje |

El middleware `role` asegura permisos por tipo de usuario y todos los endpoints requieren `Authorization: Bearer <token>`.

## Frontend (React SPA)

Ubicacion: `frontend/`

1. Copia las variables y ajusta la URL de la API si aplica:

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Instala dependencias y levanta Vite:

   ```bash
   npm install
   npm run dev
   ```

3. La SPA integra:
   - Landing page.
   - Formularios de registro e inicio de sesion (conservan JWT y perfil).
   - Panel pasajero: solicitudes, seguimiento y calificacion.
   - Panel conductor: disponibilidad, aceptacion/rechazo, inicio y cierre del viaje.
   - Contenedor listo para mapas (Leaflet, Google Maps, etc.).

## Flujo sugerido

1. Abre `http://localhost:5173`.
2. Registrate como pasajero y crea un viaje (o usa `pasajero@example.com / password`).
3. En otra pestana inicia sesion como conductor (`conductor@example.com / password`), ponte disponible y acepta el viaje.
4. Completa el recorrido y califica para cerrar el flujo basico.

Listo: tienes la base para sumar pagos, mapas reales y reglas de asignacion mas avanzadas.
