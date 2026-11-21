function Tasks() {
  return (
    <div className="min-h-screen bg-[#03120e] text-white p-8">
      <h1 className="text-3xl font-bold">My Tasks</h1>

      <p className="text-gray-400 mt-2">
        Track and manage your daily tasks.
      </p>

      <div className="mt-8 space-y-4">

        <div className="bg-[#10251e] p-5 rounded-xl border border-white/10 flex justify-between">
          <span>Finalize landing page design</span>
          <span className="text-emerald-400">Completed</span>
        </div>

        <div className="bg-[#10251e] p-5 rounded-xl border border-white/10 flex justify-between">
          <span>Review API integration</span>
          <span className="text-yellow-400">In Progress</span>
        </div>

        <div className="bg-[#10251e] p-5 rounded-xl border border-white/10 flex justify-between">
          <span>Prepare sprint roadmap</span>
          <span className="text-blue-400">Pending</span>
        </div>

      </div>
    </div>
  );
}

export default Tasks;