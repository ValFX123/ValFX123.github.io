const navLinks = [
  { label: "Account", children: ["Overview", "Analytics", "Badges", "Settings"] },
  { label: "Customize" },
  { label: "Links" },
  { label: "Premium" },
  { label: "Image Host" },
  { label: "Templates" },
];

export default function Sidebar({ setSection, activeSection }) {
  return (
    <aside className="fixed top-0 left-0 w-56 h-full bg-[#17161d] flex flex-col px-4 py-7 z-20 shadow-2xl">
      <div className="font-bold text-2xl text-violet-400 mb-10">guns.lol</div>
      <nav className="flex-1 space-y-2">
        {navLinks.map((nav, idx) => (
          <div key={idx}>
            <button
              className={\`w-full text-left px-3 py-2 rounded-lg \${activeSection === nav.label.toLowerCase()
                  ? "bg-violet-700 text-white"
                  : "hover:bg-violet-900/70 text-gray-200"
                }\`}
              onClick={() => setSection(nav.label.toLowerCase())}
            >
              {nav.label}
            </button>
            {nav.children && activeSection === nav.label.toLowerCase() && (
              <ul className="ml-3 mt-1 text-sm text-gray-300 space-y-1">
                {nav.children.map((sub) => (
                  <li key={sub}>
                    <button
                      className="hover:underline"
                      onClick={() => setSection(\`\${nav.label.toLowerCase()}-\${sub.toLowerCase()}\`)}
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
      <div className="mt-8 flex items-center gap-3">
        <img src="/assets/avatar.webp" className="w-10 h-10 rounded-full border-2 border-violet-500" />
        <div>
          <div className="font-semibold text-white">.valfx</div>
          <div className="text-xs text-gray-400">UID 248,013</div>
        </div>
      </div>
    </aside>
  );
}
