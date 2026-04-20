"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import SignupForm from "../../components/SignupForm";

export default function RegisterPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen text-white p-6 flex flex-col items-center justify-center">
      <SignupForm />
    </div>
  );
}
