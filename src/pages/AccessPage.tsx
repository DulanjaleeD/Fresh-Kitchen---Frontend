import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import type { UserRole } from '../type/types';
import { useSession } from '../state/auth/useSession';

export function AccessPage({ mode }: { mode: 'login' | 'register' }) {
  const { login, register, isAuthenticated, loading } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';

  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    if (!email.trim() || !password.trim()) return 'Email and password are required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (isRegister && password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      if (isRegister) {
        await register({ email, password, role });
        navigate('/login');
      } else {
        await login({ email, password });
        navigate('/');
      }
    } catch {
      setError(isRegister ? 'Unable to register account.' : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <section className="w-full max-w-sm border border-gray-200 rounded-2xl bg-white py-10 px-8">
        <h1 className="mt-3">Fresh Kitchen</h1>
        <p className="mb-8 mt-1.5 mb-4">{isRegister ? 'Create your workspace account' : 'Sign in to continue ordering'}</p>

        {error && <div className="border border-red-200 bg-red-50 text-red-900 rounded-2xl p-3">{error}</div>}

        <form onSubmit={submit} className="grid gap-3.5">
          <label className="grid gap-2 text-sm">
            Email
            <input className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="grid gap-1.5 text-sm">
            Password
            <input className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {isRegister && (
            <>
              <label className="grid gap-1.5 text-sm">
                Confirm password
                <input
                  className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                Role
                <select className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
            </>
          )}

          <button className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-7" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <small>
          {isRegister ? 'Already registered?' : 'Need an account?'}{' '}
          <Link className="text-indigo-500" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </small>
      </section>
    </div>
  );
}
