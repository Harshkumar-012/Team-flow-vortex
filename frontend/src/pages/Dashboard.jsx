import {NavLink} from 'react-router-dom';
function Dashboard() {
  return (
    <div className="min-h-screen bg-[#03120e] text-white flex">

      {/* Sidebar */}
      

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">

        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome back! Here's your team overview.
            </p>
          </div>

          <button className="bg-emerald-400 text-black px-5 py-2 rounded-lg font-semibold">
            + New Project
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">Total Projects</p>
            <h2 className="text-3xl font-bold mt-3">24</h2>
            <p className="text-emerald-400 text-sm mt-2">+12% this month</p>
          </div>

          <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">Active Tasks</p>
            <h2 className="text-3xl font-bold mt-3">18</h2>
            <p className="text-emerald-400 text-sm mt-2">8 tasks in progress</p>
          </div>

          <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">Completed</p>
            <h2 className="text-3xl font-bold mt-3">42</h2>
            <p className="text-emerald-400 text-sm mt-2">Great progress!</p>
          </div>

          <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">Team Members</p>
            <h2 className="text-3xl font-bold mt-3">12</h2>
            <p className="text-emerald-400 text-sm mt-2">Working together</p>
          </div>

        </div>

        {/* Recent Tasks */}
        <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-5">Recent Tasks</h2>

          <div className="space-y-5">
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span>Finalize landing page design</span>
              <span className="text-emerald-400">Completed</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-4">
              <span>Review API integration</span>
              <span className="text-yellow-400">In Progress</span>
            </div>

            <div className="flex justify-between">
              <span>Prepare sprint roadmap</span>
              <span className="text-blue-400">Pending</span>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-5">Team Members</h2>

          <div className="flex flex-wrap gap-4">
            <div className="bg-[#1b382d] px-5 py-3 rounded-xl">A - Alex</div>
            <div className="bg-[#1b382d] px-5 py-3 rounded-xl">B - Ben</div>
            <div className="bg-[#1b382d] px-5 py-3 rounded-xl">C - Chris</div>
            <div className="bg-[#1b382d] px-5 py-3 rounded-xl">D - David</div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;