import { Link } from 'react-router-dom';
import MapPlaceholder from '../components/MapPlaceholder';

const Landing = () => (
  <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
      <div className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          MotoGo Pichanaki
        </span>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Mototaxis on-demand para Pichanaki</h1>
        <p className="text-lg text-slate-600">
          Conecta pasajeros y conductores en segundos. Solicita viajes, monitorea el estado en tiempo real y manten el
          control del viaje hasta la calificacion final.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/register"
            className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
          >
            Crear cuenta
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-white"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Estructura lista para mapas</h2>
        <p className="text-sm text-slate-500">
          Integra facilmente Leaflet, Google Maps u otro proveedor usando el contenedor que dejamos listo.
        </p>
        <div className="mt-6">
          <MapPlaceholder origin="Plaza Pichanaki" destination="Av. Peru" />
        </div>
      </div>
    </div>
  </div>
);

export default Landing;
