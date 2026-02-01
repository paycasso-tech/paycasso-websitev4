"use client";
export const runtime = "edge";

import { signUpAction } from "@/app/(auth)/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { OTPInput } from "@/components/auth/otp-input";
import AnimatedGrid from "@/components/shared/bento/AnimatedGrid";
import Image from "next/image";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type SignUpStep = "details" | "verify-otp";

export default function Signup({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<SignUpStep>("details");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    searchParams.then(setMessage);
  }, [searchParams]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true);
    setMessage({});

    try {
      const emailValue = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("full-name") as string;

      const response = await fetch(`${BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ error: data.error || "Registration failed" });
        setIsLoading(false);
        return;
      }

      setEmail(emailValue);
      setStep("verify-otp");
      setResendTimer(60);
      setMessage({ success: "Verification code sent to your email!" });
    } catch (error) {
      console.error("Sign up error:", error);
      setMessage({ error: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage({ error: "Please enter a valid 6-digit code" });
      return;
    }

    setIsLoading(true);
    setMessage({});

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ error: data.error || "Invalid verification code" });
        setIsLoading(false);
        return;
      }

      setMessage({ success: "Email verified successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/sign-in?verified=true");
      }, 1500);
    } catch (error) {
      console.error("Verify OTP error:", error);
      setMessage({ error: "Verification failed. Please try again." });
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setMessage({});

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/user/resend-verification-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage({ error: data.error || "Failed to resend code" });
        setIsLoading(false);
        return;
      }

      setMessage({ success: "New verification code sent!" });
      setResendTimer(60);
      setOtp("");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage({ error: "Failed to resend code" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* ✅ Mobile-safe height */
    <div className="min-h-screen w-screen overflow-hidden flex items-center justify-center">
      {/* ✅ Mobile-friendly background brightness */}
      <Image
        src="/auth-frames/full_background.png"
        alt="Paycasso Platform"
        fill
        priority
        className="object-cover object-center lg:object-right brightness-[0.25] md:brightness-[0.15]"
      />

      <div className="absolute z-20 grid w-full max-w-7xl lg:grid-cols-2 items-center justify-center gap-10">
        {/* ✅ Hide animated grid on mobile only */}
        <div className="hidden lg:flex items-center justify-center bg-transparent">
          <div className="max-w-lg">
            <AnimatedGrid />
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <div className="flex flex-col min-h-screen bg-transparent px-4 md:pl-5">
          {/* Logo */}
          <div className="shrink-0 px-4 pt-6 pb-4 md:p-8 md:pb-0">
            <Link href="/" className="flex items-center gap-2 font-semibold">
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

          {/* Form container */}
          <div className="flex-1 flex items-start md:items-center justify-center pt-6 md:pt-0">
            <div className="w-full max-w-sm space-y-6">
              {step === "details" ? (
                <>
                  {/* STEP 1 */}
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                      Enter your details to get started
                    </p>
                  </div>

                  <form
                    className="space-y-4 bg-black/10 rounded-xl p-4 md:p-0"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSignUp(new FormData(e.currentTarget));
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        name="full-name"
                        placeholder="John Doe"
                        required
                        disabled={isLoading}
                      />
                    </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          minLength={6}
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

                    {message && Object.keys(message).length > 0 && (
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          message.error
                            ? "bg-destructive/15 text-destructive"
                            : "bg-green-500/15 text-green-600"
                        }`}
                      >
                        <FormMessage message={message} />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Creating account..." : "Continue"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/sign-in"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Sign in
                      </Link>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* STEP 2 */}
                  <div className="text-center space-y-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Verify your email</h1>
                    <p className="text-sm text-muted-foreground">
                      We sent a 6-digit code to <strong>{email}</strong>
                    </p>
                  </div>

                  <div className="space-y-6 bg-black/10 rounded-xl p-4 md:p-0">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      disabled={isLoading}
                    />

                    {message && Object.keys(message).length > 0 && (
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          message.error
                            ? "bg-destructive/15 text-destructive"
                            : "bg-green-500/15 text-green-600"
                        }`}
                      >
                        <FormMessage message={message} />
                      </div>
                    )}

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full"
                    >
                      Verify Email
                    </Button>

                    <div className="text-center text-sm">
                      {resendTimer > 0 ? (
                        <p className="text-muted-foreground">
                          Resend code in {resendTimer}s
                        </p>
                      ) : (
                        <button
                          onClick={handleResendOTP}
                          disabled={isLoading}
                          className="text-primary hover:underline"
                        >
                          Resend verification code
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setStep("details")}
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Back to signup
                    </button>
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-border">
                <span className="relative bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Web3 buttons */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    alt="MetaMask"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Login with MetaMask
                </Button>

                <Button variant="outline" className="w-full">
                  <Image
                    src="https://avatars.githubusercontent.com/u/18060234?s=200&v=4"
                    alt="Coinbase"
                    width={20}
                    height={20}
                    className="mr-2 rounded-sm"
                  />
                  Login with Coinbase
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
