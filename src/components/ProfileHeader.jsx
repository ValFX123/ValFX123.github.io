export default function ProfileHeader({ profile }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <img src={profile.avatar} alt="" className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-3" />
      <h1 className="text-4xl font-bold text-white drop-shadow-md flex items-center gap-2">
        {profile.username}
        <span className="text-violet-400 text-2xl"><i className="ri-verified-badge-fill"></i></span>
      </h1>
      <div className="mt-2 text-gray-300">
        {profile.desc}{" "}
        <span className="ml-2 px-3 py-1 bg-gray-700/70 rounded-full text-sm">{profile.location}</span>
      </div>
    </div>
  );
}
