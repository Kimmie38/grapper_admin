"use client";

import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const onSignOut = async () => {
    const callbackUrl = "/";

    try {
      // Keep it inside the embedded preview:
      // - don't let auth helper redirect to an absolute host
      // - we will navigate locally after cookies are cleared
      await signOut({
        callbackUrl,
        redirect: false,
      });

      if (typeof window !== "undefined") {
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.error(error);
      if (typeof window !== "undefined") {
        window.location.href = callbackUrl;
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Sign out
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          You’ll be signed out from the admin web view.
        </p>
        <button
          onClick={onSignOut}
          className="mt-8 w-full rounded-lg bg-[#0F4241] px-4 py-3 text-base font-semibold text-white hover:bg-[#0c3534]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
