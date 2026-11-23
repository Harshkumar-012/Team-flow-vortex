import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-8xl font-bold text-emerald-400">
        404
      </h1>

      <h2 className="text-2xl font-bold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 bg-emerald-400 text-black px-6 py-3 rounded-lg font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;