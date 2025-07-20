export default function Customizer({ profile, setProfile }) {
  return (
    <div className="bg-gray-900/75 rounded-xl p-8 shadow-xl max-w-2xl mx-auto">
      <h2 className="font-bold text-xl mb-4 text-white">General Customization</h2>
      <div className="mb-4">
        <label className="text-white mr-4">Username:</label>
        <input
          className="bg-gray-800 text-white px-3 py-1 rounded"
          value={profile.username}
          onChange={e => setProfile({ ...profile, username: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="text-white mr-4">Profile Description:</label>
        <input
          className="bg-gray-800 text-white px-3 py-1 rounded w-2/3"
          value={profile.desc}
          onChange={e => setProfile({ ...profile, desc: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="text-white mr-4">Accent Color:</label>
        <input
          type="color"
          value={profile.accent}
          onChange={e => setProfile({ ...profile, accent: e.target.value })}
        />
      </div>
    </div>
  );
}
