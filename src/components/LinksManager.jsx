export default function LinksManager({ profile, setProfile }) {
  function addSocial(type) {
    setProfile({
      ...profile,
      socials: [...profile.socials, { type, url: "" }]
    });
  }
  function updateSocial(idx, url) {
    const newSocials = profile.socials.slice();
    newSocials[idx].url = url;
    setProfile({ ...profile, socials: newSocials });
  }
  return (
    <div className="bg-gray-900/75 rounded-xl p-8 shadow-xl max-w-2xl mx-auto">
      <h2 className="font-bold text-xl mb-4 text-white">Social Links</h2>
      {profile.socials.map((social, idx) => (
        <div key={idx} className="flex items-center gap-4 mb-3">
          <i className={\`ri-\${social.type}-fill text-2xl text-violet-300\`}></i>
          <input
            className="bg-gray-800 text-white px-3 py-1 rounded w-2/3"
            value={social.url}
            onChange={e => updateSocial(idx, e.target.value)}
            placeholder={\`Paste \${social.type} URL...\`}
          />
        </div>
      ))}
      <div className="mt-5">
        <button className="bg-violet-700 px-4 py-2 rounded text-white" onClick={() => addSocial("discord")}>
          + Add Discord
        </button>
        <button className="bg-yellow-700 ml-3 px-4 py-2 rounded text-white" onClick={() => addSocial("bitcoin")}>
          + Add Bitcoin
        </button>
      </div>
    </div>
  );
}
