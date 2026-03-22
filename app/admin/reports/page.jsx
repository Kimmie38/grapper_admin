"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ExternalLink,
  MessageSquare,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const mockReports = [
  {
    id: "report_001",
    reporter_id: "user_001",
    reporter_name: "John Doe",
    reporter_avatar: null,
    target_id: "user_003",
    target_type: "user",
    reason: "Inappropriate language and harassment in comments",
    status: "pending",
    created_at: "2024-01-21T10:30:00Z",
    claimed_at: null,
    claimed_by_name: null,
    resolved_at: null,
    resolved_by_name: null,
  },
  {
    id: "report_002",
    reporter_id: "user_002",
    reporter_name: "Jane Smith",
    reporter_avatar: null,
    target_id: "post_003",
    target_type: "post",
    reason: "Spam and promotional content not allowed on platform",
    status: "claimed",
    created_at: "2024-01-20T14:15:00Z",
    claimed_at: "2024-01-21T09:00:00Z",
    claimed_by_name: "Moderator Admin",
    resolved_at: null,
    resolved_by_name: null,
  },
  {
    id: "report_003",
    reporter_id: "user_004",
    reporter_name: "Mike Johnson",
    reporter_avatar: null,
    target_id: "user_005",
    target_type: "user",
    reason: "Suspicious booking patterns and potential fraud",
    status: "resolved",
    created_at: "2024-01-19T12:45:00Z",
    claimed_at: "2024-01-19T13:00:00Z",
    claimed_by_name: "Moderator Admin",
    resolved_at: "2024-01-19T15:30:00Z",
    resolved_by_name: "Moderator Admin",
  },
];

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports", statusFilter],
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (statusFilter === "all") {
        return mockReports;
      }

      return mockReports.filter((report) => report.status === statusFilter);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update report");
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "claimed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      case "dismissed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            Reports & Moderation
          </h1>
          <p className="text-gray-500">
            Manage user reports and maintain community standards.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          {["all", "pending", "claimed", "resolved", "dismissed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No reports found
          </h3>
          <p className="text-gray-500">
            Everything looks clean in the {statusFilter} category.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}
                    >
                      {report.status.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(report.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {report.status === "pending" && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: report.id,
                            status: "claimed",
                          })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Claim
                      </button>
                    )}
                    {(report.status === "pending" ||
                      report.status === "claimed") && (
                      <>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: report.id,
                              status: "resolved",
                            })
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolve
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: report.id,
                              status: "dismissed",
                            })
                          }
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Reporter
                    </h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          report.reporter_avatar ||
                          "https://github.com/shadcn.png"
                        }
                        alt={report.reporter_name}
                        className="w-10 h-10 rounded-full bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {report.reporter_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {report.reporter_id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Target ({report.target_type})
                    </h4>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-gray-900">
                          ID: {report.target_id}
                        </span>
                      </div>
                      <a
                        href={`/admin/users/${report.target_id}`} // Assuming target_id might be a user id for some types
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                      >
                        View Target
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Reason / Details
                  </h4>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {report.reason}
                    </p>
                  </div>
                </div>

                {report.status === "claimed" && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Claimed by:{" "}
                      <span className="font-medium text-gray-900">
                        {report.claimed_by_name || "Admin"}
                      </span>
                    </div>
                    <div>
                      Claimed at: {new Date(report.claimed_at).toLocaleString()}
                    </div>
                  </div>
                )}

                {report.status !== "pending" && report.status !== "claimed" && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Resolved by:{" "}
                      <span className="font-medium text-gray-900">
                        {report.resolved_by_name || "System"}
                      </span>
                    </div>
                    <div>
                      Resolved at:{" "}
                      {new Date(report.resolved_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
