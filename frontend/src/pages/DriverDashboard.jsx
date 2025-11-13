import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import TripList from '../components/TripList';
import { useAuth } from '../context/AuthContext';
import {
  toggleAvailability,
  fetchAvailableTrips,
  fetchAssignedTrips,
  acceptTrip,
  rejectTrip,
  startTrip,
  completeTrip,
} from '../api/driver';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(Boolean(user?.is_available));
  const [availableTrips, setAvailableTrips] = useState([]);
  const [assignedTrips, setAssignedTrips] = useState([]);
  const [error, setError] = useState('');
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [loadingAssigned, setLoadingAssigned] = useState(true);

  useEffect(() => {
    setIsAvailable(Boolean(user?.is_available));
  }, [user]);

  const refreshAvailable = async () => {
    try {
      if (!isAvailable) {
        setAvailableTrips([]);
        return;
      }
      setLoadingAvailable(true);
      const data = await fetchAvailableTrips();
      setAvailableTrips(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos obtener los viajes disponibles.');
    } finally {
      setLoadingAvailable(false);
    }
  };

  const refreshAssigned = async () => {
    try {
      setLoadingAssigned(true);
      const data = await fetchAssignedTrips();
      setAssignedTrips(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos obtener tus viajes asignados.');
    } finally {
      setLoadingAssigned(false);
    }
  };

  const refreshAll = () => {
    refreshAssigned();
    refreshAvailable();
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 5000);
    return () => clearInterval(interval);
  }, [isAvailable]);

  const handleAvailabilityChange = async () => {
    try {
      const updatedUser = await toggleAvailability(!isAvailable);
      setIsAvailable(Boolean(updatedUser.is_available));
      refreshAvailable();
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos actualizar tu estado.');
    }
  };

  const handleTripAction = async (callback) => {
    setError('');
    try {
      await callback();
      refreshAll();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Ocurrio un error. Intentalo otra vez.');
    }
  };

  const activeTrips = useMemo(
    () => assignedTrips.filter((trip) => ['accepted', 'in_progress'].includes(trip.status)),
    [assignedTrips],
  );

  const historyTrips = useMemo(
    () => assignedTrips.filter((trip) => trip.status === 'completed'),
    [assignedTrips],
  );

  const actions = (
    <div className="flex flex-col gap-3 md:flex-row">
      <button
        type="button"
        onClick={handleAvailabilityChange}
        className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
          isAvailable ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-400 hover:bg-slate-500'
        }`}
      >
        {isAvailable ? 'Disponible' : 'Inactivo'}
      </button>
      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white"
      >
        Cerrar sesion
      </button>
    </div>
  );

  return (
    <PageLayout
      title={`Bienvenido ${user?.name}`}
      description="Gestiona tus viajes, acepta solicitudes y finalizalas."
      actions={actions}
    >
      {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Viajes disponibles</h2>
          {!isAvailable && <p className="mt-2 text-sm text-slate-500">Activa tu disponibilidad para ver solicitudes.</p>}
          {isAvailable && (loadingAvailable ? (
            <p className="mt-4 text-slate-500">Cargando viajes pendientes...</p>
          ) : (
            <TripList
              trips={availableTrips}
              emptyMessage="No hay viajes solicitados por ahora."
              actionSlot={(trip) => (
                <>
                  <button
                    type="button"
                    onClick={() => handleTripAction(() => acceptTrip(trip.id))}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTripAction(() => rejectTrip(trip.id))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Rechazar
                  </button>
                </>
              )}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Mis viajes</h2>
          {loadingAssigned ? (
            <p className="mt-4 text-slate-500">Cargando tus viajes asignados...</p>
          ) : (
            <TripList
              trips={activeTrips}
              emptyMessage="Todavia no aceptas viajes."
              actionSlot={(trip) =>
                trip.status === 'accepted' ? (
                  <button
                    type="button"
                    onClick={() => handleTripAction(() => startTrip(trip.id))}
                    className="w-full rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                  >
                    Iniciar viaje
                  </button>
                ) : trip.status === 'in_progress' ? (
                  <button
                    type="button"
                    onClick={() => handleTripAction(() => completeTrip(trip.id))}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
                  >
                    Finalizar viaje
                  </button>
                ) : null
              }
            />
          )}
        </div>
      </section>

      {!!historyTrips.length && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Historial completado</h2>
          <TripList trips={historyTrips} emptyMessage="Aun no completas viajes." />
        </section>
      )}
    </PageLayout>
  );
};

export default DriverDashboard;
