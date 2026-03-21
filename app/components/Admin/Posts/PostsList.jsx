import { ErrorPanel } from "../ErrorPanel";

export function PostsList({ data, isLoading, isError, error }) {
  if (isLoading) {
    return <div className="mt-4 text-gray-700">Loading posts…</div>;
  }

  if (isError) {
    return (
      <div className="mt-4">
        <ErrorPanel
          title="Could not load posts"
          message={error?.message || "Please try again."}
        />
      </div>
    );
  }

  if (!data?.rows) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      {data.rows.map((p) => {
        const key = `p-${p.id}`;
        const created = p.created_at
          ? new Date(p.created_at).toLocaleString()
          : "";

        const hasMedia = Boolean(p.image_url || p.audio_url || p.video_url);
        const mediaText = hasMedia ? "Media" : "Text";

        return (
          <div
            key={key}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-semibold text-gray-900">
                {p.user_name || "Student"} • {p.user_university || "University"}
              </div>
              <div className="text-xs text-gray-500">{created}</div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              {p.content || "(no text)"}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="rounded-full bg-gray-100 px-2 py-1">
                {mediaText}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1">
                Likes: {p.likes_count}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1">
                Comments: {p.comments_count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
