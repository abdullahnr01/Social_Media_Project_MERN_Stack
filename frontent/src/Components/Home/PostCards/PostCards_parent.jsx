import { useContext } from "react";
import { MessageCircle } from "lucide-react";
import { UserContext } from "../../../Context/context";
import Main_Media from "./user_main_Media";
import User_menu_info from "./user_menu_info";
import Follow_button from "./user_follow_button";
import User_menu_button from "./user_menu_button";
import User_like_Btn from "./user_like";
import User_Share_Btn from "./user_share_btn";

function PostCards({ post, index, onCommentClick, commentsOpen }) {
  const { UserInfo } = useContext(UserContext);
  const isOwnPost = String(UserInfo?._id) === String(post?.user_id);

  return (
    <div className="relative">
      <User_menu_button post={post} index={index} />
      <div className={`flex items-center justify-between gap-3 px-4 pb-2 pt-5 sm:px-5 ${isOwnPost ? "pr-16 sm:pr-16" : "pr-4 sm:pr-5"}`}>
        <User_menu_info post={post} />
        <Follow_button target_userId={post.user_id} />
      </div>

      <Main_Media post={post} />

      <div className="mx-4 h-px bg-slate-100 sm:mx-5" />
      <div className="flex items-center justify-around px-3 py-3 text-slate-600 sm:px-4">
        <User_like_Btn
          postId={post._id}
          likeCounts={post.likeCount}
          postLiked={post.isLiked}
        />
        <button
          type="button"
          aria-expanded={commentsOpen}
          onClick={onCommentClick}
          className={`flex min-w-20 flex-col items-center gap-1.5 rounded-lg py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${commentsOpen ? "text-amber-700" : "text-slate-500"}`}
        >
          <MessageCircle size={17} aria-hidden="true" />
          <span className="text-xs">Comments</span>
        </button>
        <User_Share_Btn />
      </div>
    </div>
  );
}

export default PostCards;
