"use client";

import React, { useState } from "react";
import useUser from "@/utils/useUser";

export default function AdminBootstrapPage() {
  const { data: user, loading } = useUser();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const onMakeAdmin = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/bootstrap", { method: "POST" });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to set admin");
      }
      setDone(true);
    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-10">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-2xl font-semibold text-gray-900">
              Admin setup
            </div>
            <div className="mt-2 text-gray-600">
              Please sign in first, then come back here.
            </div>
            <div className="mt-6">
              <a
                href="/account/signin?callbackUrl=/admin/bootstrap"
                className="rounded-lg bg-[#0F4241] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3534]"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-2xl font-semibold text-gray-900">
            One-time admin setup
          </div>
          <div className="mt-2 text-gray-700">
            This will mark your account as an admin so you can access the admin
            dashboard.
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <div className="font-semibold">Important</div>
            <div className="mt-1 text-sm">
              After you have your first admin, delete this page and the backend
              route <span className="font-mono">/api/admin/bootstrap</span>.
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {done ? (
            <div className="mt-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                You’re now an admin.
              </div>
              <div className="mt-4">
                <a
                  href="/admin"
                  className="rounded-lg bg-[#0F4241] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3534]"
                >
                  Go to dashboard
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex gap-2">
              <button
                onClick={onMakeAdmin}
                disabled={saving}
                className="rounded-lg bg-[#0F4241] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3534] disabled:opacity-60"
              >
                {saving ? "Working…" : "Make me admin"}
              </button>
              <a
                href="/admin"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Back
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
