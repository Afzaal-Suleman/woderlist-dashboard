"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/components/providers/SessionProvider";
import {
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const { user, loading: authLoading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && user) {
      router.replace("/dashboard");
    }
  }, [mounted, authLoading, user, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.refresh();
    }
    setLoading(false);
  };

  if (authLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="bg-background-light dark:bg-background-dark p-8 rounded-xl w-full max-w-[400px] shadow-2xl">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h2 className="text-[#191210] dark:text-white text-sm font-bold leading-tight tracking-[0.3em] mb-2">
            WONDERLIST
          </h2>

          <p className="text-[#191210]/60 dark:text-white/60 text-sm font-normal mt-2">
            Enter your admin credentials
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <p className="text-[#191210] dark:text-white text-sm font-medium leading-normal mb-2">
            Email Address
          </p>
          <input
            className="w-full rounded-xl text-[#191210] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-input-bg dark:bg-[#2d2422] h-12 placeholder:text-[#8b655b]/60 px-4 text-base font-normal"
            placeholder="admin@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full mb-3 p-3 pr-10 rounded-xl bg-input-bg dark:bg-[#1e1614] text-[#191210] dark:text-white placeholder:text-[#8b655b]/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[#8b655b]"
          >
            {showPassword ? (
              <IconEyeOff className="w-5 h-5" />
            ) : (
              <IconEye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Forgot Password Link */}
        {/* <div className="flex justify-end mb-4">
          <a className="text-neutral-link dark:text-neutral-400 text-xs font-medium hover:text-primary transition-colors" href="#">
            Forgot Password?
          </a>
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-6 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-700 dark:text-yellow-300 text-xs text-center">
            <span className="material-symbols-outlined align-middle text-xs mr-1">
              security
            </span>
            Restricted access. Authorized personnel only.
          </p>
        </div>

        {/* Support Link */}
        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
          <p className="text-center text-[#191210]/60 dark:text-white/60 text-xs">
            Need help?{' '}
            <a className="text-primary font-medium hover:underline" href="mailto:support@wonderlist.com">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
