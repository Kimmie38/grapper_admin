import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Ban, CheckCircle, RefreshCw, Trash2 } from "lucide-react";

export default function AdminUserDetailPage({ params }) {
  const { id } = params;
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error("Failed to load user details");
      return res.json();
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ action, ...data }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      if (!res.ok) throw new Error("Action failed");
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["admin", "user", id]);
      toast.success(`Action '${variables.action}' successful`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "user", id]);
      toast.success("Post deleted");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (userQuery.isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading user details...
      </div>
    );
  if (userQuery.isError)
    return (
      <div className="p-8 text-center text-red-500">
        Error: {userQuery.error.message}
      </div>
    );

  const { profile, posts, comments, reports } = userQuery.data;
  const isBanned = profile.status === "banned";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="mx-auto max-w-5xl">
        <button
          onClick={goBack}
          className="mb-6 flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </button>

        {/* Header / Profile Card */}
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar_url || "https://github.com/shadcn.png"}
                  className="h-20 w-20 rounded-full border border-gray-200 bg-gray-100 object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.full_name || "Unknown User"}
                  </h1>
                  <div className="text-sm text-gray-500">{profile.email}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {profile.university || "No University"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                    >
                      {profile.status || "active"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Role: {profile.account_type || "user"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {isBanned ? (
                  <button
                    onClick={() => actionMutation.mutate({ action: "unban" })}
                    className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Unban User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const reason = prompt("Reason for banning?");
                      if (reason)
                        actionMutation.mutate({ action: "ban", reason });
                    }}
                    className="flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </button>
                )}

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to reset this profile? This will clear name, avatar, bio.",
                      )
                    ) {
                      actionMutation.mutate({ action: "reset_profile" });
                    }
                  }}
                  className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Profile
                </button>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Bio:</span>{" "}
                {profile.bio}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Reports Column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">
                  Reports ({reports.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {reports.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No reports found
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            Report against {report.target_type}
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {report.reason || "No reason provided"}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {new Date(report.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">
                  Recent Comments ({comments.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {comments.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No comments found
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 hover:bg-gray-50">
                      <div className="text-sm text-gray-800">
                        {comment.content}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        On post:{" "}
                        {comment.post_content
                          ? comment.post_content.substring(0, 30) + "..."
                          : "Unknown"}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Posts Column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900">
                  Recent Posts ({posts.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
                {posts.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No posts found
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="p-4 hover:bg-gray-50 group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {post.content}
                          </p>
                          {(post.image_url ||
                            post.video_url ||
                            post.audio_url) && (
                            <div className="mt-2 flex gap-2">
                              {post.image_url && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  Image
                                </span>
                              )}
                              {post.video_url && (
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                  Video
                                </span>
                              )}
                              {post.audio_url && (
                                <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                  Audio
                                </span>
                              )}
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(post.created_at).toLocaleString()}
                            </span>
                            <span>❤️ {post.likes_count}</span>
                            <span>💬 {post.comments_count}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("Delete this post?"))
                              deletePostMutation.mutate(post.id);
                          }}
                          className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
