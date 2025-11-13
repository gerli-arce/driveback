const MapPlaceholder = ({ origin, destination }) => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
    <p className="font-medium">Mapa en construccion</p>
    <p className="text-sm text-slate-400">
      Aqui podras integrar Leaflet, Google Maps u otro proveedor.
    </p>
    {origin && destination && (
      <p className="mt-3 text-sm">
        <span className="font-semibold">Recorrido:</span> {origin}
        {' -> '}
        {destination}
      </p>
    )}
  </div>
);

export default MapPlaceholder;
