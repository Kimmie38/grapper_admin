"use client";

import React, { useMemo, useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { Toaster } from "sonner";
import AdminReportsPage from "./reports/page";
import { Search } from "lucide-react";
import { getAdminUIState } from "@/utils/adminUIState";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAdminPosts } from "@/hooks/useAdminPosts";
import { useAdminAds } from "@/hooks/useAdminAds";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import { useAdminFlagged } from "@/hooks/useAdminFlagged";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import {
  useUnflagMutation,
  useRecountMutation,
} from "@/hooks/useAdminMutations";
import { ErrorPanel } from "@/components/Admin/ErrorPanel";
import { TabNavigation } from "@/components/Admin/TabNavigation";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { SearchInput } from "@/components/Admin/SearchInput";
import { OverviewStats } from "@/components/Admin/Overview/OverviewStats";
import { PostsChart } from "@/components/Admin/Overview/PostsChart";
import { CommentsChart } from "@/components/Admin/Overview/CommentsChart";
import { AdSpendChart } from "@/components/Admin/Overview/AdSpendChart";
import { TopUniversities } from "@/components/Admin/Overview/TopUniversities";
import { UsersTable } from "@/components/Admin/Users/UsersTable";
import { PostsList } from "@/components/Admin/Posts/PostsList";
import { AdsStats } from "@/components/Admin/Ads/AdsStats";
import { AdsPerformanceChart } from "@/components/Admin/Ads/AdsPerformanceChart";
import { TopCampaignsTable } from "@/components/Admin/Ads/TopCampaignsTable";
import { FlaggedAccountsTable } from "@/components/Admin/Flagged/FlaggedAccountsTable";
import { LogsTable } from "@/components/Admin/Logs/LogsTable";
import { BookingsTable } from "@/components/Admin/Bookings/BookingsTable";

// New metric components
import RevenueStats from "@/components/Admin/Revenue/RevenueStats";
import RevenueTrendsChart from "@/components/Admin/Revenue/RevenueTrendsChart";
import RevenueByProvider from "@/components/Admin/Revenue/RevenueByProvider";
import BookingStats from "@/components/Admin/Bookings/BookingStats";
import BookingStatusBreakdown from "@/components/Admin/Bookings/BookingStatusBreakdown";
import BookingTrendsChart from "@/components/Admin/Bookings/BookingTrendsChart";
import ProviderStats from "@/components/Admin/Providers/ProviderStats";
import ServicesCategoryChart from "@/components/Admin/Providers/ServicesCategoryChart";
import TopProvidersTable from "@/components/Admin/Providers/TopProvidersTable";
import PaymentStats from "@/components/Admin/Payments/PaymentStats";
import PaymentMethodsChart from "@/components/Admin/Payments/PaymentMethodsChart";
import EngagementStats from "@/components/Admin/Engagement/EngagementStats";
import SignupTrendsChart from "@/components/Admin/Engagement/SignupTrendsChart";
import MarketplaceHealthStats from "@/components/Admin/Marketplace/MarketplaceHealthStats";

export default function AdminDashboardPage() {
  const { data: user, loading } = useUser();

  const [tab, setTab] = useState("overview");
  const [userQuery, setUserQuery] = useState("");
  const [postQuery, setPostQuery] = useState("");
  const [flaggedQuery, setFlaggedQuery] = useState("");
  const [bookingQuery, setBookingQuery] = useState("");

  // Clear search queries when switching tabs
  useEffect(() => {
    setUserQuery("");
    setPostQuery("");
    setFlaggedQuery("");
    setBookingQuery("");
  }, [tab]);

  const overviewQuery = useAdminOverview();
  const usersQuery = useAdminUsers(userQuery, tab === "users");
  const postsQuery = useAdminPosts(postQuery, tab === "posts");
  const adsQuery = useAdminAds(tab === "ads");
  const logsQuery = useAdminLogs(tab === "logs");
  const flaggedAccountsQuery = useAdminFlagged(flaggedQuery, tab === "flagged");
  const bookingsQuery = useAdminBookings(bookingQuery, tab === "bookings");

  const unflagMutation = useUnflagMutation();
  const recountMutation = useRecountMutation();

  // Show previous data while refetching to prevent flashing
  const isInitialLoading = overviewQuery.isLoading && !overviewQuery.data;
  const showError = overviewQuery.isError && !overviewQuery.data;

  const uiState = useMemo(() => {
    // If still loading user data, show loading state
    if (loading) {
      return { state: "loading" };
    }
    // If no user after loading completes, show sign out
    if (!user) {
      return { state: "signed_out" };
    }
    // Check if user has admin access - user.account_type comes from the merged profile data
    if (user.account_type !== "admin") {
      return { state: "forbidden" };
    }
    // If we're loading the overview data initially
    if (isInitialLoading) {
      return { state: "loading" };
    }
    // If there's an error and no cached data
    if (showError) {
      return { state: "error" };
    }
    return { state: "ready" };
  }, [loading, user, isInitialLoading, showError]);

  const totals = overviewQuery.data?.totals;
  const postsByDay = overviewQuery.data?.postsByDay || [];
  const commentsByDay = overviewQuery.data?.commentsByDay || [];
  const spendByDay = overviewQuery.data?.spendByDay || [];
  const topUniversities = overviewQuery.data?.topUniversities || [];
  const generatedAt = overviewQuery.data?.generatedAt;

  // New data sections
  const revenue = overviewQuery.data?.revenue;
  const bookings = overviewQuery.data?.bookings;
  const providers = overviewQuery.data?.providers;
  const payments = overviewQuery.data?.payments;
  const engagement = overviewQuery.data?.engagement;
  const marketplace = overviewQuery.data?.marketplace;

  if (uiState.state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-gray-700">Loading…</div>
        </div>
      </div>
    );
  }

  if (uiState.state === "signed_out") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </div>
            <div className="mt-2 text-gray-600">
              Please sign in to access the admin dashboard.
            </div>
            <div className="mt-6 flex gap-2">
              <a
                href="/account/signin?callbackUrl=/admin"
                className="rounded-lg bg-[#0F4241] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3534]"
              >
                Sign in
              </a>
              <a
                href="/account/signup?callbackUrl=/admin"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Create account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uiState.state === "forbidden") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <ErrorPanel
            title="No admin access"
            message="You're signed in, but your account is not marked as an admin yet."
            action={
              <div className="flex flex-wrap gap-2">
                <a
                  href="/admin/bootstrap"
                  className="rounded-lg bg-[#0F4241] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3534]"
                >
                  Make me admin (one-time setup)
                </a>
                <a
                  href="/account/logout"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Sign out
                </a>
              </div>
            }
          />
          <div className="mt-4 text-sm text-gray-600">
            Tip: after you've created your first admin, you should remove the
            bootstrap page/route.
          </div>
        </div>
      </div>
    );
  }

  if (uiState.state === "error") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <ErrorPanel
            title="Dashboard error"
            message={
              overviewQuery.error?.message ||
              "Something went wrong loading the admin dashboard."
            }
            action={
              <button
                className="rounded-lg bg-[#0F4241] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3534]"
                onClick={() => overviewQuery.refetch()}
              >
                Try again
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "users", label: "Users" },
    { key: "bookings", label: "Bookings" },
    { key: "posts", label: "Posts" },
    { key: "ads", label: "Ads" },
    { key: "reports", label: "Reports" },
    { key: "flagged", label: "Flagged" },
    { key: "logs", label: "Activity Logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader generatedAt={generatedAt} />
      <Toaster />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <TabNavigation tabs={tabs} activeTab={tab} onTabChange={setTab} />

        {tab === "overview" ? (
          <div className="mt-6 space-y-8">
            <OverviewStats
              totals={totals}
              onRecount={() => recountMutation.mutate()}
              isRecounting={recountMutation.isPending}
            />

            {/* Revenue Dashboard */}
            {revenue && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  💰 Revenue & Financial Metrics
                </h2>
                <RevenueStats revenue={revenue} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueTrendsChart trends={revenue.trends || []} />
                  <RevenueByProvider byProvider={revenue.byProvider || []} />
                </div>
              </div>
            )}

            {/* Booking Statistics */}
            {bookings && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📊 Booking Statistics
                </h2>
                <BookingStats bookings={bookings} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BookingTrendsChart trends={bookings.trends || []} />
                  <BookingStatusBreakdown byStatus={bookings.byStatus} />
                </div>
              </div>
            )}

            {/* Service Provider Overview */}
            {providers && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  👥 Service Provider Overview
                </h2>
                <ProviderStats providers={providers} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ServicesCategoryChart
                    byCategory={providers.byCategory || []}
                  />
                  <div className="lg:col-span-2">
                    <TopProvidersTable
                      topPerformers={providers.topPerformers || []}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Analytics */}
            {payments && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  💳 Payment Analytics
                </h2>
                <PaymentStats payments={payments} />
                <PaymentMethodsChart byMethod={payments.byMethod || []} />
              </div>
            )}

            {/* User Engagement Metrics */}
            {engagement && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📈 User Engagement Metrics
                </h2>
                <EngagementStats engagement={engagement} />
                <SignupTrendsChart
                  signupTrends={engagement.signupTrends || []}
                />
              </div>
            )}

            {/* Marketplace Health Indicators */}
            {marketplace && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ⭐ Marketplace Health
                </h2>
                <MarketplaceHealthStats marketplace={marketplace} />
              </div>
            )}

            {/* Original charts */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📉 Platform Activity
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PostsChart data={postsByDay} />
                <CommentsChart data={commentsByDay} />
                <AdSpendChart data={spendByDay} />
                <TopUniversities universities={topUniversities} />
              </div>
            </div>
          </div>
        ) : null}

        {tab === "users" ? (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">Users</div>
                <div className="text-sm text-gray-600">
                  Search by email, name, full name, or university.
                </div>
              </div>
              <SearchInput
                value={userQuery}
                onChange={setUserQuery}
                placeholder="Search users…"
              />
            </div>

            <UsersTable
              data={usersQuery.data}
              isLoading={usersQuery.isLoading}
              isError={usersQuery.isError}
              error={usersQuery.error}
            />
          </div>
        ) : null}

        {tab === "bookings" ? (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Bookings
                </div>
                <div className="text-sm text-gray-600">
                  View and manage all bookings on the platform.
                </div>
              </div>
              <SearchInput
                value={bookingQuery}
                onChange={setBookingQuery}
                placeholder="Search bookings..."
              />
            </div>

            <BookingsTable
              data={bookingsQuery.data}
              isLoading={bookingsQuery.isLoading}
              isError={bookingsQuery.isError}
              error={bookingsQuery.error}
            />
          </div>
        ) : null}

        {tab === "posts" ? (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">Posts</div>
                <div className="text-sm text-gray-600">
                  Latest posts, with quick search.
                </div>
              </div>
              <SearchInput
                value={postQuery}
                onChange={setPostQuery}
                placeholder="Search posts…"
              />
            </div>

            <PostsList
              data={postsQuery.data}
              isLoading={postsQuery.isLoading}
              isError={postsQuery.isError}
              error={postsQuery.error}
            />
          </div>
        ) : null}

        {tab === "ads" ? (
          <div className="mt-6 space-y-6">
            {adsQuery.isLoading && <div>Loading ads data...</div>}
            {adsQuery.data && (
              <>
                <AdsStats counts={adsQuery.data.counts} />
                <AdsPerformanceChart data={adsQuery.data.history} />
                <TopCampaignsTable campaigns={adsQuery.data.top_campaigns} />
              </>
            )}
          </div>
        ) : null}

        {tab === "reports" ? (
          <div className="mt-6">
            <AdminReportsPage />
          </div>
        ) : null}

        {tab === "flagged" ? (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-red-600" />
                  Flagged Accounts
                </div>
                <div className="text-sm text-gray-600">
                  Accounts automatically flagged by the Strike System.
                </div>
              </div>
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm outline-none"
                  placeholder="Search flagged accounts…"
                  value={flaggedQuery}
                  onChange={(e) => setFlaggedQuery(e.target.value)}
                />
              </div>
            </div>

            <FlaggedAccountsTable
              data={flaggedAccountsQuery.data}
              isLoading={flaggedAccountsQuery.isLoading}
              isError={flaggedAccountsQuery.isError}
              error={flaggedAccountsQuery.error}
              onUnflag={(profileId) => unflagMutation.mutate(profileId)}
              isUnflagging={unflagMutation.isPending}
            />
          </div>
        ) : null}

        {tab === "logs" ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Audit Logs</h3>
            <LogsTable data={logsQuery.data} isLoading={logsQuery.isLoading} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
