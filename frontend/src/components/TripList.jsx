import MapPlaceholder from './MapPlaceholder';

const statusColors = {
  requested: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

const TripList = ({ trips = [], emptyMessage, actionSlot }) => {
  if (!trips.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <article key={trip.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Origen</p>
              <p className="text-lg font-medium text-slate-900">{trip.origin}</p>
              <p className="text-sm font-semibold text-slate-500">Destino</p>
              <p className="text-lg font-medium text-slate-900">{trip.destination}</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[trip.status] ?? 'bg-slate-100 text-slate-700'
                }`}
              >
                {trip.status.replace(/_/g, ' ')}
              </span>
              <p className="text-slate-500">
                Precio estimado:{' '}
                <span className="font-semibold text-slate-900">
                  S/ {typeof trip.price === 'number' ? trip.price.toFixed(2) : trip.price}
                </span>
              </p>
              {trip.passenger && (
                <p className="text-slate-500">
                  Pasajero: <span className="font-semibold text-slate-900">{trip.passenger.name}</span>
                </p>
              )}
              {trip.driver && (
                <p className="text-slate-500">
                  Conductor: <span className="font-semibold text-slate-900">{trip.driver.name}</span>
                </p>
              )}
              {trip.rating != null && (
                <p className="text-sm text-amber-500">Calificacion: {trip.rating} *</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <MapPlaceholder origin={trip.origin} destination={trip.destination} />
            {actionSlot && <div className="flex flex-col gap-2">{actionSlot(trip)}</div>}
          </div>
        </article>
      ))}
    </div>
  );
};

export default TripList;
