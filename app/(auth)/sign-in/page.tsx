"use client";
export const runtime = "edge";

import { signInAction } from "@/app/(auth)/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimatedGrid from "@/components/shared/bento/AnimatedGrid";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true);
    setMessage({});

    try {
      const emailValue = formData.get("email") as string;
      const password = formData.get("password") as string;

      const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

      if (!BACKEND_API_URL) {
        setMessage({ error: "Backend API URL is not configured." });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && !data.emailVerified) {
          setMessage({
            error: "Email not verified. Redirecting to verification...",
          });

          setTimeout(() => {
            router.push(
              `/sign-up?email=${encodeURIComponent(emailValue)}&verify=true`,
            );
          }, 2000);
          return;
        }

        setMessage({ error: data.error || "Login failed" });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", data.email);

      setMessage({ success: "Login successful! Redirecting..." });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage({ error: "An error occurred. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    /* ✅ FIX 1: min-h-screen instead of h-screen (mobile safe) */
    <div className="min-h-screen w-screen overflow-hidden flex items-center justify-center">
      {/* ✅ FIX 6: mobile-friendly brightness */}
      <Image
        src="/auth-frames/full_background.png"
        alt="Paycasso Platform"
        fill
        priority
        className="absolute inset-0 h-full w-full object-cover brightness-[0.25] md:brightness-[0.15]"
      />

      <div className="absolute z-20 grid w-full max-w-7xl lg:grid-cols-2 items-center justify-center gap-10">
        {/* ✅ FIX 2: Hide animated grid on mobile only */}
        <div className="hidden lg:flex items-center justify-center bg-transparent">
          <div className="flex items-center justify-center rounded-4xl">
            <div className="max-w-lg">
              <AnimatedGrid />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        {/* ✅ FIX 3: Mobile padding without affecting desktop */}
        <div className="flex flex-col min-h-screen bg-transparent px-4 md:pl-5">
          {/* ✅ FIX 4: Mobile logo spacing */}
          <div className="shrink-0 px-4 pt-6 pb-4 md:p-8 md:pb-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              <Image
                src="/logo.png"
                alt="Paycasso Logo"
                width={160}
                height={32}
                priority
                className="h-8 w-40 object-contain"
              />
            </Link>
          </div>

          {/* ✅ FIX 5: Better vertical alignment on mobile */}
          <div className="flex-1 flex items-start md:items-center justify-center pt-6 md:pt-0">
            <div className="w-full max-w-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  Login to your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>

              {/* ✅ Optional polish: mobile card feel */}
              <form className="space-y-4 bg-black/10 rounded-xl p-4 md:p-0">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Message */}
                {message && Object.keys(message).length > 0 && (
                  <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                    <FormMessage message={message} />
                  </div>
                )}

                <SubmitButton
                  formAction={handleSignIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Login"}
                </SubmitButton>

                {/* Divider */}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-border">
                  <span className="relative bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                {/* Web3 buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-full"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      className="h-5 w-5 mr-2"
                    />
                    Login with MetaMask
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-full"
                  >
                    <img
                      src="https://avatars.githubusercontent.com/u/18060234?s=200&v=4"
                      alt="Coinbase"
                      className="h-5 w-5 mr-2 rounded-sm"
                    />
                    Login with Coinbase
                  </Button>
                </div>

                {/* Signup */}
                <div className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
