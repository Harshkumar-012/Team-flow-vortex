import { NavLink } from 'react-router-dom';

function Sidebar() {
  const links = [
    { name: '📊 Dashboard', path: '/dashboard' },
    { name: '📁 Projects', path: '/projects' },
    { name: '✔ My Tasks', path: '/tasks' },
    { name: '👥 Team Members', path: '/team' },
    { name: '⚙ Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 p-6">
      <h2 className="text-2xl font-bold text-white mb-8">
        TeamFlow
      </h2>

      <nav className="space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;