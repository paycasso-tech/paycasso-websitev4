export const runtime = "edge";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import InteractiveSidebar from "@/components/dashboard/sidebar/sidebar";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const email = cookieStore.get("user_email")?.value;

  if (!token || !email) {
    redirect("/sign-in");
  }

  return { token, email };
}

export default async function SettingsPage() {
  await checkAuth(); // Check authentication

  return (
    <div className="min-h-screen bg-black">
      <InteractiveSidebar />

      <div className="ml-[88px] p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
        <p className="text-gray-400">Settings page coming soon...</p>
      </div>
    </div>
  );
}
