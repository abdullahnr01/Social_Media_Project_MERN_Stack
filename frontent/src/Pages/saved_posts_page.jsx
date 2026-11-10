import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { get_saved_posts_API } from "../API layer/user_post_api";
import { WhiteScreenLoader } from "../Loader/white_bg_loader";
import PostCards from "../Components/Home/PostCards/PostCards_parent";
import FeedSidebar from "../Components/Home/feed_sidebar";

const SavedPostsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const fetchSavedPosts = async () => {
      const result = await get_saved_posts_API();
      if (!isCurrent) return;

      if (result?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (result?.success) {
        setPosts(result.response?.data?.data || []);
      } else {
        setLoadError(result?.message || "Unable to load saved posts.");
      }
      setLoading(false);
    };

    fetchSavedPosts();
    return () => {
      isCurrent = false;
    };
  }, [navigate]);

  if (loading) return <WhiteScreenLoader message="Loading saved posts..." />;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_250px] xl:grid-cols-[220px_minmax(0,660px)_280px] xl:gap-7">
          <FeedSidebar activeItem="saved" />
          <section className="mx-auto w-full min-w-0 max-w-2xl lg:max-w-none">
            <header className="mb-5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Saved</h1>
              <p className="mt-1 text-sm text-slate-500">Posts you have saved for later.</p>
            </header>

        {loadError ? (
          <section role="alert" className="rounded-2xl border border-red-200 bg-white px-5 py-8 text-center text-sm text-red-700">
            {loadError}
          </section>
        ) : posts.length > 0 ? (
          <div className="space-y-5">
            {posts.map((post) => (
              <article key={post._id} className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
                <PostCards
                  post={post}
                  showComments={false}
                  showFollowButton={false}
                  onSavedChange={(isSaved) => {
                    if (!isSaved) setPosts((previous) => previous.filter((item) => item._id !== post._id));
                  }}
                />
              </article>
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Bookmark size={24} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">No saved posts yet</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">Save posts from your feed and they will appear here.</p>
          </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default SavedPostsPage;
