export default function AnalyticsDashboard({ profile }) {
  return (
    <div className="bg-gray-900/85 rounded-2xl shadow-xl p-8 max-w-xl mx-auto text-white">
      <h2 className="font-bold text-xl mb-4">Profile Analytics</h2>
      <div className="mb-2">Profile Views: <span className="font-semibold">{profile.views}</span></div>
      <div className="mb-2">Completion: <span className="font-semibold">80%</span></div>
      <div className="mb-2">Recent Devices: <span className="text-gray-400">Windows, Mobile</span></div>
    </div>
  );
}
