import { NavLink, Outlet, useNavigate } from 'react-router';
import { useSession } from '../../state/auth/useSession';
import { useBasket } from '../../state/basket/useBasket';

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useSession();
  const { basket } = useBasket();

  if (!isAuthenticated) return <Outlet />;

  const quantity = basket?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const links = [
    { label: 'Menu Lab', to: '/' },
    { label: `Basket${quantity > 0 ? ` (${quantity})` : ''}`, to: '/cart' },
    { label: 'Orders', to: '/orders' },
    ...(user?.role === 'ADMIN' ? [{ label: 'Control', to: '/admin' }] : []),
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-gray-200 backdrop-blur-[10px] bg-white/86 z-10">
        <button className="border-0 bg-transparent font-bold text-lg text-left cursor-pointer" onClick={() => navigate('/')}>
          Fresh Kitchen
        </button>
        <nav className="flex gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => isActive ? 'no-underline border border-indigo-500 rounded-lg px-3 py-1.5 text-white bg-indigo-500 transition-all' : 'no-underline border border-gray-200 rounded-full px-3 py-1.5 text-gray-900 transition-all'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="justify-self-end md:justify-self-start flex gap-3 items-center text-sm">
          <button
            className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 pb-8 pt-6">
        <Outlet />
      </main>
    </div>
  );
}
