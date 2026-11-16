// components/auth/SignupForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, AlertCircle } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto-login after signup
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but auto-login failed. Please log in.");
        setLoading(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
          Full Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-ginza-grey mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full px-4 py-3 border-2 border-ginza-grey-light focus:border-ginza-gold outline-none text-sm"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-ginza-black text-white border-2 border-ginza-black hover:bg-ginza-gold hover:border-ginza-gold hover:text-ginza-black transition-all font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-ginza-grey">
        Already have an account?{" "}
        <Link href="/login" className="text-ginza-gold hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}