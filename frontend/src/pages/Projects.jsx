function Projects() {
  return (
    <div className="min-h-screen bg-[#03120e] text-white p-8">
      <h1 className="text-3xl font-bold">Projects</h1>

      <p className="text-gray-400 mt-2">
        Manage and track all your team projects.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold">Website Development</h2>
          <p className="text-gray-400 mt-3">Team website project</p>
          <p className="text-emerald-400 mt-4">In Progress</p>
        </div>

        <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold">Mobile App</h2>
          <p className="text-gray-400 mt-3">Mobile application project</p>
          <p className="text-yellow-400 mt-4">Pending</p>
        </div>

        <div className="bg-[#10251e] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold">AI Integration</h2>
          <p className="text-gray-400 mt-3">AI-powered features</p>
          <p className="text-emerald-400 mt-4">Completed</p>
        </div>

      </div>
    </div>
  );
}

export default Projects;