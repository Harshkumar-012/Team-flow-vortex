import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;