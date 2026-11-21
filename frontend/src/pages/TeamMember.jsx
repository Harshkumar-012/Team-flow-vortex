function TeamMembers() {
  const members = [
    ["A", "Alex Johnson", "Frontend Developer"],
    ["B", "Ben Smith", "Backend Developer"],
    ["C", "Chris Lee", "UI/UX Designer"],
    ["D", "David Kim", "Project Manager"],
  ];

  return (
    <div className="min-h-screen bg-[#03120e] text-white p-8">
      <h1 className="text-3xl font-bold">Team Members</h1>
      <p className="mt-2 text-gray-400">
        Meet and manage your team members.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {members.map(([initial, name, role]) => (
          <div
            key={name}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#10251e] p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              {initial}
            </div>

            <div>
              <h2 className="font-semibold">{name}</h2>
              <p className="text-sm text-gray-400">{role}</p>
            </div>

            <span className="ml-auto text-sm text-emerald-400">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamMembers;