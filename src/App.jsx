import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfoCard from "./components/ProfileInfoCard";
import Customizer from "./components/Customizer";
import LinksManager from "./components/LinksManager";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

export default function App() {
  const [section, setSection] = useState("account");

  const [profile, setProfile] = useState({
    username: "valfx",
    avatar: "/assets/avatar.webp",
    desc: "Buy at Fluxy!",
    location: "At Fluxy",
    socials: [
      { type: "discord", url: "https://discord.gg/fluxy" },
      { type: "bitcoin", url: "" },
    ],
    views: 227,
    accent: "#fff",
    background: "/assets/background.mp4",
  });

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar setSection={setSection} activeSection={section} />
      <div className="flex-1 ml-56 relative overflow-x-hidden min-h-screen">
        <video
          src={profile.background}
          autoPlay
          loop
          muted
          className="fixed top-0 left-0 w-full h-full object-cover z-0 blur-md brightness-50"
        />
        <div className="fixed inset-0 bg-black/60 z-0" />
        <div className="relative z-10 px-8 py-12">
          {section === "account" && (
            <>
              <ProfileHeader profile={profile} />
              <ProfileInfoCard profile={profile} setProfile={setProfile} />
            </>
          )}
          {section === "customize" && (
            <Customizer profile={profile} setProfile={setProfile} />
          )}
          {section === "links" && (
            <LinksManager profile={profile} setProfile={setProfile} />
          )}
          {section === "account-analytics" && (
            <AnalyticsDashboard profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
