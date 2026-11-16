// app/login/page.tsx
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-ginza-black mb-3">
            Welcome Back
          </h1>
          <div className="gold-divider w-20 mx-auto mb-4" />
          <p className="text-ginza-grey">
            Sign in to order and earn loyalty points
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}