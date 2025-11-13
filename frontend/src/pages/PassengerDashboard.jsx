import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import TripList from '../components/TripList';
import { requestTrip, fetchPassengerTrips, rateTrip } from '../api/passenger';
import { useAuth } from '../context/AuthContext';

const initialTripForm = {
  origin: '',
  destination: '',
  price: '',
  origin_lat: '',
  origin_lng: '',
  destination_lat: '',
  destination_lng: '',
};

const PassengerDashboard = () => {
  const { user, logout } = useAuth();
  const [tripForm, setTripForm] = useState(initialTripForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trips, setTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [error, setError] = useState('');

  const completedTrips = useMemo(() => trips.filter((trip) => trip.status === 'completed'), [trips]);

  const loadTrips = async () => {
    try {
      setIsLoadingTrips(true);
      const data = await fetchPassengerTrips();
      setTrips(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos obtener tus viajes.');
    } finally {
      setIsLoadingTrips(false);
    }
  };

  useEffect(() => {
    loadTrips();
    const interval = setInterval(loadTrips, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormChange = (event) => {
    setTripForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreateTrip = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await requestTrip({
        ...tripForm,
        price: tripForm.price ? parseFloat(tripForm.price) : undefined,
        origin_lat: tripForm.origin_lat || undefined,
        origin_lng: tripForm.origin_lng || undefined,
        destination_lat: tripForm.destination_lat || undefined,
        destination_lng: tripForm.destination_lng || undefined,
      });
      setTripForm(initialTripForm);
      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos solicitar el viaje.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRateTrip = async (tripId, rating) => {
    setError('');
    try {
      await rateTrip(tripId, rating);
      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos guardar tu calificacion.');
    }
  };

  const requestActions = (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white"
    >
      Cerrar sesion
    </button>
  );

  return (
    <PageLayout
      title={`Hola ${user?.name}, a donde vamos hoy?`}
      description="Solicita un viaje y sigue su estado en tiempo real."
      actions={requestActions}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateTrip} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Solicitar viaje</h2>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-500" htmlFor="origin">
              Origen
            </label>
            <input
              id="origin"
              name="origin"
              required
              value={tripForm.origin}
              onChange={handleFormChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-500" htmlFor="destination">
              Destino
            </label>
            <input
              id="destination"
              name="destination"
              required
              value={tripForm.destination}
              onChange={handleFormChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-500" htmlFor="price">
                Precio estimado (S/)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.1"
                min="0"
                value={tripForm.price}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-500" htmlFor="destination_lat">
                Latitud destino (opcional)
              </label>
              <input
                id="destination_lat"
                name="destination_lat"
                value={tripForm.destination_lat}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-500" htmlFor="destination_lng">
                Longitud destino (opcional)
              </label>
              <input
                id="destination_lng"
                name="destination_lng"
                value={tripForm.destination_lng}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-500" htmlFor="origin_lat">
                Latitud origen (opcional)
              </label>
              <input
                id="origin_lat"
                name="origin_lat"
                value={tripForm.origin_lat}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-500" htmlFor="origin_lng">
                Longitud origen (opcional)
              </label>
              <input
                id="origin_lng"
                name="origin_lng"
                value={tripForm.origin_lng}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isSubmitting ? 'Solicitando...' : 'Solicitar viaje'}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Estado de viajes</h2>
          {isLoadingTrips ? (
            <p className="mt-4 text-slate-500">Cargando tus viajes...</p>
          ) : (
            <TripList
              trips={trips}
              emptyMessage="Aun no tienes viajes. Solicita uno para comenzar."
              actionSlot={(trip) =>
                trip.status === 'completed' && !trip.rating ? (
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                    <label className="text-sm font-semibold text-emerald-700">Califica:</label>
                    <select
                      className="rounded-lg border border-emerald-200 px-3 py-2"
                      defaultValue=""
                      onChange={(event) => handleRateTrip(trip.id, Number(event.target.value))}
                    >
                      <option value="" disabled>
                        Selecciona
                      </option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value} *
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null
              }
            />
          )}
        </div>
      </section>

      {!!completedTrips.length && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Historial</h2>
          <TripList trips={completedTrips} emptyMessage="Aun no completas viajes." />
        </section>
      )}
    </PageLayout>
  );
};

export default PassengerDashboard;
