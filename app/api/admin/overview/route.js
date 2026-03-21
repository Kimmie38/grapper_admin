import sql from "../../utils/sql";
import { requireAdmin } from "../../utils/requireAdmin";

export async function GET(request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return adminCheck.response;
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    let transactionResult;
    try {
      transactionResult = await sql.transaction((txn) => [
        txn`SELECT COUNT(*)::int AS count FROM auth_users`,
        txn`SELECT COUNT(*)::int AS count FROM profiles`,
        txn`SELECT COUNT(*)::int AS count FROM posts`,
        txn`SELECT COUNT(*)::int AS count FROM comments`,
        txn`SELECT COUNT(*)::int AS count FROM services`,
        txn`SELECT COUNT(*)::int AS count FROM ads`,
        txn`SELECT COUNT(*)::int AS count FROM bookings`,
        txn`SELECT COUNT(*)::int AS count FROM auth_sessions WHERE expires > now()`,
        txn`SELECT COUNT(*)::int AS count FROM profiles WHERE status IN ('flagged', 'shadow_ban')`,
        txn`
          WITH days AS (
            SELECT generate_series(current_date - interval '13 days', current_date, interval '1 day')::date AS day
          )
          SELECT
            to_char(days.day, 'YYYY-MM-DD') AS day,
            COALESCE(COUNT(p.id), 0)::int AS count
          FROM days
          LEFT JOIN posts p ON p.created_at::date = days.day
          GROUP BY days.day
          ORDER BY days.day ASC
        `,
        txn`
          WITH days AS (
            SELECT generate_series(current_date - interval '13 days', current_date, interval '1 day')::date AS day
          )
          SELECT
            to_char(days.day, 'YYYY-MM-DD') AS day,
            COALESCE(COUNT(c.id), 0)::int AS count
          FROM days
          LEFT JOIN comments c ON c.created_at::date = days.day
          GROUP BY days.day
          ORDER BY days.day ASC
        `,
        txn`
          WITH days AS (
            SELECT generate_series(current_date - interval '13 days', current_date, interval '1 day')::date AS day
          )
          SELECT
            to_char(days.day, 'YYYY-MM-DD') AS day,
            COALESCE(SUM(m.spend), 0)::numeric(10,2) AS spend
          FROM days
          LEFT JOIN ad_metrics m ON m.date = days.day
          GROUP BY days.day
          ORDER BY days.day ASC
        `,
        txn`
          SELECT
            COALESCE(university, 'Unknown') AS university,
            COUNT(*)::int AS count
          FROM profiles
          GROUP BY COALESCE(university, 'Unknown')
          ORDER BY count DESC
          LIMIT 8
        `,
        // Revenue metrics
        txn`
          SELECT 
            COUNT(*)::int as total_bookings,
            COALESCE(SUM(total_price), 0)::numeric(10,2) as gmv,
            COALESCE(SUM(commission_amount), 0)::numeric(10,2) as total_commissions,
            COALESCE(SUM(CASE WHEN commission_paid = true THEN commission_amount ELSE 0 END), 0)::numeric(10,2) as paid_commissions,
            COALESCE(SUM(CASE WHEN commission_paid = false AND status = 'completed' THEN commission_amount ELSE 0 END), 0)::numeric(10,2) as pending_commissions,
            COALESCE(AVG(total_price), 0)::numeric(10,2) as avg_transaction_value
          FROM bookings
          WHERE status != 'cancelled'
        `,
        txn`
          WITH days AS (
            SELECT generate_series(current_date - interval '29 days', current_date, interval '1 day')::date AS day
          )
          SELECT 
            to_char(days.day, 'YYYY-MM-DD') as date,
            COALESCE(COUNT(b.id), 0)::int as bookings_count,
            COALESCE(SUM(b.total_price), 0)::numeric(10,2) as daily_gmv,
            COALESCE(SUM(b.commission_amount), 0)::numeric(10,2) as daily_commission
          FROM days
          LEFT JOIN bookings b ON b.created_at::date = days.day AND b.status != 'cancelled'
          GROUP BY days.day
          ORDER BY days.day ASC
        `,
        txn`
          SELECT 
            CASE 
              WHEN currency = 'NGN' THEN 'paystack'
              ELSE 'stripe'
            END as provider,
            COUNT(*)::int as bookings_count,
            COALESCE(SUM(total_price), 0)::numeric(10,2) as total_revenue,
            COALESCE(SUM(commission_amount), 0)::numeric(10,2) as total_commission
          FROM bookings
          WHERE status != 'cancelled'
          GROUP BY provider
        `,
        // Booking statistics
        txn`
          SELECT 
            COUNT(*)::int as total_bookings,
            COUNT(CASE WHEN status = 'pending' THEN 1 END)::int as pending_count,
            COUNT(CASE WHEN status = 'confirmed' THEN 1 END)::int as confirmed_count,
            COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::int as in_progress_count,
            COUNT(CASE WHEN status = 'completed' THEN 1 END)::int as completed_count,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::int as cancelled_count,
            COUNT(CASE WHEN status = 'rejected' THEN 1 END)::int as rejected_count,
            CASE 
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 2)
              ELSE 0
            END as completion_rate,
            CASE 
              WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 2)
              ELSE 0
            END as cancellation_rate
          FROM bookings
        `,
        txn`
          WITH days AS (
            SELECT generate_series(current_date - interval '29 days', current_date, interval '1 day')::date AS day
          )
          SELECT 
            to_char(days.day, 'YYYY-MM-DD') as date,
            COALESCE(COUNT(b.id), 0)::int as total,
            COALESCE(COUNT(CASE WHEN b.status = 'completed' THEN 1 END), 0)::int as completed,
            COALESCE(COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END), 0)::int as cancelled
          FROM days
          LEFT JOIN bookings b ON b.created_at::date = days.day
          GROUP BY days.day
          ORDER BY days.day ASC
        `,
        txn`
          SELECT 
            COALESCE(cancellation_reason, 'Not specified') as reason,
            COUNT(*)::int as count
          FROM bookings
          WHERE status = 'cancelled' AND cancellation_reason IS NOT NULL
          GROUP BY cancellation_reason
          ORDER BY count DESC
          LIMIT 5
        `,
        // Provider statistics
        txn`
          SELECT 
            COUNT(CASE WHEN account_type IN ('provider', 'worker', 'both', 'organization', 'mixed') THEN 1 END)::int as total_providers,
            COUNT(CASE WHEN account_type IN ('provider', 'worker', 'both', 'organization', 'mixed') AND status = 'active' THEN 1 END)::int as active_providers,
            COUNT(CASE WHEN account_type IN ('provider', 'worker', 'both', 'organization', 'mixed') AND verified = true THEN 1 END)::int as verified_providers
          FROM profiles
        `,
        txn`
          SELECT 
            COUNT(*)::int as total_services,
            COALESCE(AVG(price), 0)::numeric(10,2) as avg_service_price,
            COUNT(CASE WHEN is_featured = true THEN 1 END)::int as featured_services
          FROM services
        `,
        txn`
          SELECT 
            COALESCE(category, 'Uncategorized') as category,
            COUNT(*)::int as count
          FROM services
          GROUP BY category
          ORDER BY count DESC
          LIMIT 10
        `,
        txn`
          SELECT 
            p.id,
            p.full_name,
            p.avatar_url,
            COUNT(b.id)::int as total_bookings,
            COALESCE(SUM(b.total_price), 0)::numeric(10,2) as total_revenue,
            COALESCE(AVG(sr.rating), 0)::numeric(3,2) as avg_rating
          FROM profiles p
          JOIN services s ON p.id = s.profile_id
          LEFT JOIN bookings b ON s.id = b.service_id AND b.status = 'completed'
          LEFT JOIN service_reviews sr ON b.id = sr.booking_id
          WHERE p.account_type IN ('provider', 'worker', 'both', 'organization', 'mixed')
          GROUP BY p.id, p.full_name, p.avatar_url
          ORDER BY total_bookings DESC
          LIMIT 10
        `,
        // Payment analytics
        txn`
          SELECT 
            COUNT(*)::int as total_payments,
            COUNT(CASE WHEN deposit_paid = true THEN 1 END)::int as successful_deposits,
            COUNT(CASE WHEN final_payment_paid = true THEN 1 END)::int as successful_final_payments,
            COUNT(CASE WHEN deposit_paid = false AND status != 'cancelled' THEN 1 END)::int as failed_deposits,
            CASE 
              WHEN COUNT(*) > 0 THEN ROUND(((COUNT(CASE WHEN deposit_paid = true THEN 1 END)::numeric + COUNT(CASE WHEN final_payment_paid = true THEN 1 END)::numeric) / (COUNT(*) * 2)::numeric) * 100, 2)
              ELSE 0
            END as payment_success_rate
          FROM bookings
          WHERE status != 'cancelled'
        `,
        txn`
          SELECT 
            CASE 
              WHEN currency = 'NGN' THEN 'Paystack'
              ELSE 'Stripe'
            END as payment_method,
            COUNT(*)::int as count,
            COALESCE(SUM(total_price), 0)::numeric(10,2) as total_amount
          FROM bookings
          WHERE status != 'cancelled'
          GROUP BY payment_method
        `,
        // Engagement metrics
        txn`
          SELECT COUNT(DISTINCT "userId")::int as count
          FROM auth_sessions
          WHERE expires > NOW()
          AND "sessionToken" IN (
            SELECT "sessionToken" FROM auth_sessions WHERE expires > ${todayStart}
          )
        `,
        txn`
          SELECT COUNT(DISTINCT "userId")::int as count
          FROM auth_sessions
          WHERE expires > ${thirtyDaysAgo}
        `,
        txn`
          WITH days AS (
            SELECT generate_series(current_date - interval '29 days', current_date, interval '1 day')::date AS day
          )
          SELECT 
            to_char(days.day, 'YYYY-MM-DD') as date,
            COALESCE(COUNT(p.id), 0)::int as signups
          FROM days
          LEFT JOIN profiles p ON p.created_at::date = days.day
          GROUP BY days.day
          ORDER BY days.day ASC
        `,
        txn`SELECT COUNT(*)::int as count FROM profiles WHERE created_at < ${thirtyDaysAgo}`,
        txn`
          SELECT 
            COUNT(DISTINCT user_id)::int as users_with_multiple_bookings,
            (SELECT COUNT(DISTINCT user_id)::int FROM bookings) as total_users_with_bookings
          FROM bookings
          GROUP BY user_id
          HAVING COUNT(*) > 1
        `,
        // Marketplace health
        txn`
          SELECT 
            COALESCE(AVG(rating), 0)::numeric(3,2) as avg_rating,
            COUNT(*)::int as total_reviews,
            COUNT(CASE WHEN rating >= 4 THEN 1 END)::int as positive_reviews
          FROM service_reviews
        `,
      ]);
    } catch (txError) {
      console.error("Transaction error in admin overview:", txError);
      return Response.json(
        { error: "Database query failed. Please try again." },
        { status: 500 },
      );
    }

    if (!transactionResult || !Array.isArray(transactionResult)) {
      console.error("Invalid transaction result");
      return Response.json(
        { error: "Invalid data received from database" },
        { status: 500 },
      );
    }

    const [
      userCountRows,
      profileCountRows,
      postCountRows,
      commentCountRows,
      serviceCountRows,
      adCountRows,
      bookingCountRows,
      activeSessionsRows,
      flaggedCountRows,
      postsByDayRows,
      commentsByDayRows,
      spendByDayRows,
      topUniversitiesRows,
      revenueMetrics,
      revenueTrends,
      revenueByProvider,
      bookingStats,
      bookingTrends,
      cancellationReasons,
      providerStats,
      serviceStats,
      servicesByCategory,
      topProviders,
      paymentStats,
      paymentMethodDistribution,
      dauRows,
      mauRows,
      signupTrends,
      usersLastMonth,
      repeatBookingData,
      ratingStats,
    ] = transactionResult;

    const totals = {
      users: userCountRows?.[0]?.count || 0,
      profiles: profileCountRows?.[0]?.count || 0,
      posts: postCountRows?.[0]?.count || 0,
      comments: commentCountRows?.[0]?.count || 0,
      services: serviceCountRows?.[0]?.count || 0,
      ads: adCountRows?.[0]?.count || 0,
      bookings: bookingCountRows?.[0]?.count || 0,
      activeSessions: activeSessionsRows?.[0]?.count || 0,
      flagged: flaggedCountRows?.[0]?.count || 0,
    };

    // Calculate derived metrics
    const totalUsers = profileCountRows?.[0]?.count || 0;
    const usersLastMonthCount = usersLastMonth?.[0]?.count || 0;
    const userGrowthRate =
      usersLastMonthCount > 0
        ? (
            ((totalUsers - usersLastMonthCount) / usersLastMonthCount) *
            100
          ).toFixed(2)
        : 0;

    const totalUsersWithBookings =
      repeatBookingData?.[0]?.total_users_with_bookings || 0;
    const usersWithMultiple = repeatBookingData?.length || 0;
    const repeatBookingRate =
      totalUsersWithBookings > 0
        ? ((usersWithMultiple / totalUsersWithBookings) * 100).toFixed(2)
        : 0;

    const totalReviews = ratingStats?.[0]?.total_reviews || 0;
    const positiveReviews = ratingStats?.[0]?.positive_reviews || 0;
    const customerSatisfactionScore =
      totalReviews > 0
        ? ((positiveReviews / totalReviews) * 100).toFixed(2)
        : 0;

    return Response.json({
      totals,
      revenue: {
        gmv: parseFloat(revenueMetrics?.[0]?.gmv || 0),
        totalCommissions: parseFloat(
          revenueMetrics?.[0]?.total_commissions || 0,
        ),
        paidCommissions: parseFloat(revenueMetrics?.[0]?.paid_commissions || 0),
        pendingCommissions: parseFloat(
          revenueMetrics?.[0]?.pending_commissions || 0,
        ),
        avgTransactionValue: parseFloat(
          revenueMetrics?.[0]?.avg_transaction_value || 0,
        ),
        trends: (revenueTrends || []).map((t) => ({
          date: t.date,
          bookings: parseInt(t.bookings_count),
          gmv: parseFloat(t.daily_gmv),
          commission: parseFloat(t.daily_commission),
        })),
        byProvider: (revenueByProvider || []).map((p) => ({
          provider: p.provider,
          bookings: parseInt(p.bookings_count),
          revenue: parseFloat(p.total_revenue),
          commission: parseFloat(p.total_commission),
        })),
      },
      bookings: {
        total: parseInt(bookingStats?.[0]?.total_bookings || 0),
        byStatus: {
          pending: parseInt(bookingStats?.[0]?.pending_count || 0),
          confirmed: parseInt(bookingStats?.[0]?.confirmed_count || 0),
          inProgress: parseInt(bookingStats?.[0]?.in_progress_count || 0),
          completed: parseInt(bookingStats?.[0]?.completed_count || 0),
          cancelled: parseInt(bookingStats?.[0]?.cancelled_count || 0),
          rejected: parseInt(bookingStats?.[0]?.rejected_count || 0),
        },
        completionRate: parseFloat(bookingStats?.[0]?.completion_rate || 0),
        cancellationRate: parseFloat(bookingStats?.[0]?.cancellation_rate || 0),
        trends: (bookingTrends || []).map((t) => ({
          date: t.date,
          total: parseInt(t.total),
          completed: parseInt(t.completed),
          cancelled: parseInt(t.cancelled),
        })),
        cancellationReasons: (cancellationReasons || []).map((r) => ({
          reason: r.reason,
          count: parseInt(r.count),
        })),
      },
      providers: {
        total: parseInt(providerStats?.[0]?.total_providers || 0),
        active: parseInt(providerStats?.[0]?.active_providers || 0),
        verified: parseInt(providerStats?.[0]?.verified_providers || 0),
        services: {
          total: parseInt(serviceStats?.[0]?.total_services || 0),
          avgPrice: parseFloat(serviceStats?.[0]?.avg_service_price || 0),
          featured: parseInt(serviceStats?.[0]?.featured_services || 0),
        },
        byCategory: (servicesByCategory || []).map((c) => ({
          category: c.category,
          count: parseInt(c.count),
        })),
        topPerformers: (topProviders || []).map((p) => ({
          id: p.id,
          name: p.full_name,
          avatar: p.avatar_url,
          bookings: parseInt(p.total_bookings),
          revenue: parseFloat(p.total_revenue),
          rating: parseFloat(p.avg_rating),
        })),
      },
      payments: {
        total: parseInt(paymentStats?.[0]?.total_payments || 0),
        successful:
          parseInt(paymentStats?.[0]?.successful_deposits || 0) +
          parseInt(paymentStats?.[0]?.successful_final_payments || 0),
        failed: parseInt(paymentStats?.[0]?.failed_deposits || 0),
        successRate: parseFloat(paymentStats?.[0]?.payment_success_rate || 0),
        byMethod: (paymentMethodDistribution || []).map((m) => ({
          method: m.payment_method,
          count: parseInt(m.count),
          amount: parseFloat(m.total_amount),
        })),
      },
      engagement: {
        dau: parseInt(dauRows?.[0]?.count || 0),
        mau: parseInt(mauRows?.[0]?.count || 0),
        totalUsers: totalUsers,
        userGrowthRate: parseFloat(userGrowthRate),
        repeatBookingRate: parseFloat(repeatBookingRate),
        signupTrends: (signupTrends || []).map((s) => ({
          date: s.date,
          signups: parseInt(s.signups),
        })),
      },
      marketplace: {
        avgRating: parseFloat(ratingStats?.[0]?.avg_rating || 0),
        totalReviews: parseInt(ratingStats?.[0]?.total_reviews || 0),
        customerSatisfaction: parseFloat(customerSatisfactionScore),
      },
      postsByDay: postsByDayRows || [],
      commentsByDay: commentsByDayRows || [],
      spendByDay: spendByDayRows || [],
      topUniversities: topUniversitiesRows || [],
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /api/admin/overview error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
