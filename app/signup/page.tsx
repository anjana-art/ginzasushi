// app/signup/page.tsx
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-ginza-black mb-3">
            Create Account
          </h1>
          <div className="gold-divider w-20 mx-auto mb-4" />
          <p className="text-ginza-grey">
            Join Ginza and start earning rewards
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}