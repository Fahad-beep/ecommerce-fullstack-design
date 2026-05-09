import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@shop.dev');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      navigate((location.state as { from?: string } | null)?.from ?? '/admin', {
        replace: true,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_0.9fr] lg:p-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#0d6efd] to-[#1556b3] p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Admin access
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Sign in to manage products, metadata, and featured content.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/80">
            The project uses a simple JWT flow with access and refresh tokens so the admin
            panel behaves like a real protected dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-[2rem] bg-white p-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-[#2C7CF1]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-[#2C7CF1]"
            />
          </div>
          {error ? (
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <Button type="submit" variant="primary" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
