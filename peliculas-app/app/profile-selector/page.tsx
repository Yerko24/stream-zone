"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileSelector from "../../components/ProfileSelector";

export default function ProfileSelectorPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleProfileSelected = () => {
    router.push("/");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/app.png')",
      }}
    >
      <div className="min-h-screen bg-black/60 backdrop-blur-sm">
        <ProfileSelector onProfileSelected={handleProfileSelected} />
      </div>
    </div>
  );
}
