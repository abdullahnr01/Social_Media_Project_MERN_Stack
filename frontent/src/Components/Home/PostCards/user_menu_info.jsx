import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";

const User_menu_info = ({ post }) => {
  const navigate = useNavigate();
  const fullName = `${post?.userInfo?.firstname || ""} ${post?.userInfo?.lastname || ""}`.trim() || "SocialFirst user";
  const createdAt = post?.createdAt ? new Date(post.createdAt) : null;

  return (
    <button
      type="button"
      onClick={() => navigate(`/user_profile_posts?id=${post?.userInfo?._id}`)}
      className="flex min-w-0 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50 text-amber-600 ring-1 ring-slate-200">
        {post?.userInfo?.image ? (
          <img
            src={post.userInfo.image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound size={20} aria-hidden="true" />
        )}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900">{fullName}</span>
        <span className="mt-0.5 block text-xs text-slate-500">
          {createdAt && !Number.isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
            : "Recently"}
        </span>
      </span>
    </button>
  );
};

export default User_menu_info;
