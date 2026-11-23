function MyTasks() {
  const tasks = [
    ["Complete homepage design", "Completed"],
    ["Review API integration", "In Progress"],
    ["Prepare sprint roadmap", "Pending"],
  ];

  return (
    <div className="min-h-screen bg-[#03120e] text-white p-8">
      <h1 className="text-3xl font-bold">My Tasks</h1>
      <p className="mt-2 text-gray-400">
        Manage and track your daily tasks.
      </p>

      <div className="mt-8 space-y-4">
        {tasks.map(([task, status]) => (
          <div
            key={task}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#10251e] p-5"
          >
            <h2 className="font-semibold">{task}</h2>
            <span className="text-emerald-400">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTasks;