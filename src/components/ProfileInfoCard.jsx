export default function ProfileInfoCard({ profile }) {
  return (
    <div className="bg-gray-900/85 rounded-2xl shadow-xl p-8 flex items-center gap-8 max-w-lg mx-auto mb-8">
      <img src={profile.avatar} className="w-16 h-16 rounded-full border-2 border-violet-400" />
      <div>
        <div className="text-lg font-bold text-white">{profile.username}</div>
        <div className="italic text-pink-400 text-sm">I hate the fake</div>
        <div className="flex gap-2 mt-2">
          {profile.socials.map(social => (
            <a
              key={social.type}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-violet-300 hover:text-violet-500"
            >
              <i className={\`ri-\${social.type}-fill\`}></i>
            </a>
          ))}
        </div>
      </div>
      <div className="ml-auto text-gray-300 flex items-center gap-2">
        <i className="ri-eye-fill"></i> {profile.views}
      </div>
    </div>
  );
}
