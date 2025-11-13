import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(form);
      navigate(user.role === 'driver' ? '/conductor' : '/pasajero', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'No pudimos iniciar sesion, verifica tus datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Inicia sesion"
      description="Continua gestionando tus viajes como pasajero o conductor."
      actions={
        <Link to="/register" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          No tienes cuenta? Registrate
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-600" htmlFor="email">
            Correo electronico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-600" htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </PageLayout>
  );
};

export default Login;
