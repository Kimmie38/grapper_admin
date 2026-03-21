export function getAdminUIState(loading, user, overviewQuery) {
  if (loading) {
    return { state: "loading" };
  }
  if (!user) {
    return { state: "signed_out" };
  }
  if (overviewQuery.isError) {
    const status = overviewQuery.error?.status;
    if (status === 401) {
      return { state: "signed_out" };
    }
    if (status === 403) {
      return { state: "forbidden" };
    }
    return { state: "error" };
  }
  return { state: "ready" };
}
