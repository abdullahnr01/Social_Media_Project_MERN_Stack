import { useContext } from "react";
import Main_Media from "./user_main_Media";
import User_menu_info from "./user_menu_info";
import { UserContext } from "../../../Context/context";
import Follow_button from "./user_follow_button";
import User_menu_button from "./user_menu_button";

function PostCards({ post, index }) {
  return (
    <>
      <User_menu_button post={post} index={index} />
      <div className="flex items-start justify-between mb-2 pt-5 px-5 bg-white ">
        <User_menu_info post={post} />
        <Follow_button post_userId={post.user_id} />
      </div>

      <Main_Media post={post} />
    </>
  );
}

export default PostCards;
