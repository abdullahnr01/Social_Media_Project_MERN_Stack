import { useContext } from "react";
import Main_Media from "./user_main_Media";
import User_menu_info from "./user_menu_info";
import { UserContext } from "../../../Context/context";
import Follow_button from "./user_follow_button";
import User_menu_button from "./user_menu_button";
import User_like_Btn from "./user_like";
import User_Share_Btn from "./user_share_btn";

function PostCards({ post, index }) {

  console.log(post)

  return (
    <>
      <User_menu_button post={post} index={index} />
      <div className="flex items-start justify-between mb-2 pt-5 px-5 bg-white ">
        <User_menu_info post={post} />
        <Follow_button target_userId={post.user_id} />
      </div>

      <Main_Media post={post} />

      <div className="flex justify-around items-center pt-3 text-gray-600 pb-5 ">
        <User_like_Btn
          postId={post._id}
          likeCounts={post.likeCount}
          postLiked={post.isLiked}
        />
        <User_Share_Btn />
      </div>
    </>
  );
}

export default PostCards;
