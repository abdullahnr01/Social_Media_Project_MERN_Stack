import { useCallback, useEffect, useState } from "react";
import { LockKeyhole, UserRound, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSuggestedUsers } from "../../API layer/user_search_api";
import Follow_button from "./PostCards/user_follow_button";

const SuggestedUsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const result = await getSuggestedUsers();
    if (result?.success) {
      setUsers(result.response?.data?.users || []);
    } else {
      setLoadError(result?.message || "Unable to load people to discover.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSuggestionStatusChange = (userId, status, { action } = {}) => {
    if (status === "Following" || status === "Pending..." || action === "accepted") {
      setUsers((previous) => previous.filter((user) => user._id !== userId));
      return;
    }
    if (["rejected", "unfollow", "withdraw"].includes(action)) {
      loadUsers();
    }
  };

  return (
    <aside className="sticky top-24 hidden lg:block">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-4 pb-3 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <UsersRound size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-slate-900">People to discover</h2>
              <p className="mt-0.5 text-xs text-slate-500">Find your next connection</p>
            </div>
          </div>
        </header>

        <div className="max-h-[calc(100vh-13rem)] min-h-24 divide-y divide-slate-100 overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="space-y-4 p-4" aria-label="Loading people">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex animate-pulse items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-slate-100" />
                  <span className="h-3 flex-1 rounded bg-slate-100" />
                  <span className="h-8 w-16 rounded-lg bg-slate-100" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="px-4 py-7 text-center">
              <p role="alert" className="text-sm leading-5 text-slate-600">{loadError}</p>
              <button
                type="button"
                onClick={loadUsers}
                className="mt-3 rounded-lg px-3 py-1.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
              >
                Try again
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <UsersRound size={20} aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-800">You’re all caught up</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">New members will appear here.</p>
            </div>
          ) : (
            users.map((user) => {
              const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "SocialFirst member";
              return (
                <article key={user._id} className="flex items-center gap-2.5 px-3 py-3 transition hover:bg-slate-50/80">
                  <button
                    type="button"
                    onClick={() => navigate(`/user_profile_posts?id=${user._id}`)}
                    aria-label={`Open ${fullName}'s profile`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50 text-amber-700 ring-1 ring-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {user.image ? (
                      <img src={user.image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={18} aria-hidden="true" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/user_profile_posts?id=${user._id}`)}
                      className="block max-w-full truncate text-left text-xs font-semibold text-slate-800 transition hover:text-amber-800 focus-visible:outline-none focus-visible:underline"
                    >
                      {fullName}
                    </button>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                      {user.isPrivate ? (
                        <><LockKeyhole size={11} aria-hidden="true" /> Private account</>
                      ) : (
                        "SocialFirst member"
                      )}
                    </p>
                  </div>

                  <Follow_button
                    target_userId={user._id}
                    initialStatus={user.followStatus}
                    variant="suggestion"
                    onStatusChange={(status, details) => handleSuggestionStatusChange(user._id, status, details)}
                  />
                </article>
              );
            })
          )}
        </div>

      </section>
    </aside>
  );
};

export default SuggestedUsersPanel;
