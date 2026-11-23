import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen bg-[#03120e] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#142620] p-8 rounded-2xl border border-white/10">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to your TeamFlow account
        </p>

        <form className="space-y-5">

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-[#03120e] border border-white/10 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-[#03120e] border border-white/10 outline-none"
            />
          </div>

          <button
            type="button"
            className="w-full bg-emerald-400 text-black font-bold py-3 rounded-lg"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Back to <Link to="/" className="text-emerald-400">Home</Link>
        </p>

      </div>
    </div>
  )
}

export default Login