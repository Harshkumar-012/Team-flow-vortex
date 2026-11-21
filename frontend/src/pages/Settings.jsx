function Settings() {
  return (
    <div className="min-h-screen bg-[#03120e] text-white p-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <p className="mt-2 text-gray-400">
        Manage your account preferences.
      </p>

      <div className="mt-8 max-w-2xl space-y-6">

        <div className="bg-[#10251e] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <label className="block text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full bg-[#03120e] border border-white/10 p-3 rounded-lg"
          />

          <label className="block text-gray-400 mt-4 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-[#03120e] border border-white/10 p-3 rounded-lg"
          />
        </div>

        <div className="bg-[#10251e] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            Receive task notifications
          </label>
        </div>

        <button className="bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg">
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default Settings;