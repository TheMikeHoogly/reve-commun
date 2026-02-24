import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Heart, MessageCircle, Lightbulb, Map, Scroll, LogOut, Sparkles
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/matches', icon: Heart, label: 'Résonances' },
  { to: '/map', icon: Map, label: 'Constellation' },
  { to: '/circles', icon: MessageCircle, label: 'Cercles' },
  { to: '/projects', icon: Lightbulb, label: 'Pépinière' },
  { to: '/pact', icon: Scroll, label: 'Pacte' },
  { to: '/profile', icon: Users, label: 'Mon profil' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-sm border-r border-dream-100 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-dream-100">
          <div className="flex items-center gap-2">
            <Sparkles className="text-dream-500" size={24} />
            <span className="font-display text-xl gradient-text font-bold">Le Rêve Commun</span>
          </div>
          <p className="text-xs text-dream-400 mt-1">Bâtisseurs d'un nouveau monde</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-dream-100 text-dream-700 shadow-sm'
                    : 'text-dream-500 hover:bg-dream-50 hover:text-dream-700'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-dream-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-dream-200 flex items-center justify-center text-dream-600 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dream-800 truncate">{user?.name}</p>
              <p className="text-xs text-dream-400 truncate">{user?.location || 'Quelque part dans le monde'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dream-400 hover:text-dream-700 hover:bg-dream-50 rounded-lg transition-all">
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
