"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/profile-selector"); // 🔥 mejor que push
    }
  }, [isLoggedIn, router]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/app.png')",
      }}
    >
      <div className="min-h-screen bg-black/70 backdrop-blur-md flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}