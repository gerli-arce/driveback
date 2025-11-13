# MotoGo API (Laravel)

Back-end unificado para gestionar el flujo tipo Uber entre pasajeros y conductores. Expone únicamente endpoints REST bajo `/api`, listos para ser consumidos por clientes web, móviles o una SPA externa.

## Requisitos

- PHP 8.2+ y Composer
- MySQL 8+ (configurable en `.env`)

## Instalación

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan jwt:secret
# crea la base `drive` (o la que definas) en MySQL y ajusta las variables DB_*
php artisan migrate --seed
```

Arranca el servidor de desarrollo:

```bash
php artisan serve   # http://localhost:8000
```

El endpoint raíz (`GET /`) responde un JSON con la versión del API y un mensaje de bienvenida.

## Dominio y roles

| Rol       | Descripción                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `viewer`  | Usuario público (solo ve /).                                                |
| `passenger` | Cliente que crea solicitudes de viaje bajo `/api/passenger/...`.         |
| `driver`  | Conductor que gestiona disponibilidad y viajes bajo `/api/driver/...`.     |
| `admin`   | Operador que controla choferes, clientes, rutas y viajes desde `/api/admin`.|

### Modelos principales

- `User` (roles, disponibilidad, teléfono).
- `Trip` (pasajero, conductor, origen/destino, precio, estados `requested/accepted/in_progress/completed/cancelled`).  
- `TransportRoute` (catálogo de rutas con precios/distancias).

## Endpoints clave

### Autenticación (`/api/auth/...`)

| Método | Ruta        | Descripción                                      |
| ------ | ----------- | ------------------------------------------------ |
| POST   | `/register` | Alta de pasajero o conductor (retorna JWT).      |
| POST   | `/login`    | Inicio de sesión (retorna JWT).                  |
| POST   | `/logout`   | Invalida el token en curso.                      |
| GET    | `/me`       | Perfil del usuario autenticado.                  |

### Pasajeros (`role:passenger`)

- `GET /api/passenger/trips` – listado/historial.
- `POST /api/passenger/trips` – crea una solicitud.
- `POST /api/passenger/trips/{trip}/rate` – califica viajes completados.

### Conductores (`role:driver`)

- `POST /api/driver/availability` – cambia disponibilidad.
- `GET /api/driver/trips/available` – solicitudes pendientes (excluye rechazadas).
- `GET /api/driver/trips/assigned` – viajes aceptados/en progreso/completados.
- `POST /api/driver/trips/{trip}/accept|reject|start|complete` – flujo completo.

### Administración (`role:admin`)

- `GET /api/admin/dashboard` – métricas de usuarios, viajes y rutas.
- `GET /api/admin/users?role=driver|passenger` – listado filtrado de usuarios.
- `PATCH /api/admin/users/{user}` – actualiza rol/disponibilidad/datos.
- `GET /api/admin/trips?status=...` – viajes filtrables.
- `PATCH /api/admin/trips/{trip}` – fuerza estado, precio o chofer asignado.
- `GET /api/admin/routes` – catálogo de rutas operativas.
- `POST/PUT/DELETE /api/admin/routes/{id}` – CRUD completo de rutas.

## Datos seed

Después de `php artisan migrate --seed` tendrás:

- Pasajero demo: `pasajero@example.com / password`
- Conductor demo: `conductor@example.com / password`
- Administrador: `admin@conorld.com / asucar123YON`

Use estos usuarios para probar los endpoints protegidos indicando `Authorization: Bearer <token>`.

## Extra

- Tests básicos disponibles (`php artisan test`).
- El proyecto ya incluye middleware `role` y recursos (`UserResource`, `TripResource`, `TransportRouteResource`) para respuestas consistentes.
- Para cualquier cliente (React, React Native, etc.) basta con consumir las rutas anteriores. No hay frontend empaquetado dentro de este repositorio.*** End Patch
