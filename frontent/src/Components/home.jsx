// local
import {
  all_data,
  delete_post_data,
  user_post_likes,
  user_comment_post,
  All_CommentGets,
  user_comment_reply_post,
  All_Comment_Reply_Gets,
  user_follow_click,
  getAllFollowStatus,
} from "../API layer/api";
import { UserContext } from "../Context/context";

// built in
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaEllipsisV,
  FaUserCircle,
} from "react-icons/fa";
import { format } from "timeago.js";

//
import io from "socket.io-client";
const socket = io("http://localhost:9090");

//
function Home() {
  // states
  const [AllPosts, setAllPosts] = useState([]);

  //
  const [menuOpen, setMenuOpen] = useState(null);
  //
  const [AllCommentGets, setAllCommentGets] = useState({});
  const [commentReplies, setCommentReplies] = useState({});

  //
  const [commentbox, setCommentbox] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [showReplies, setShowReplies] = useState(null);

  //
  const [followStatus, setFollowStatus] = useState({});
  const [getfollowStatus, setfollowStatus] = useState({});
  const { UserInfo, resfollowstatus } = useContext(UserContext);

  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // like useeffect
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket Connected", socket.id);
    });

    socket.on("likeUpdated", (data) => {
      setAllPosts((prev) =>
        prev.map((p) =>
          p._id === data.postId ? { ...p, likeCount: data.likeCount } : p
        )
      );
    });

    return () => {
      socket.off("likeUpdated");
    };
  }, []);
  // comment useeffect
  useEffect(() => {
    socket.on("newCommentAdded", (data) => {
      const postId = data?.comment?.postId;
      const comment = data?.comment;

      setAllCommentGets((prev) => ({
        [postId]: [comment, ...(prev[postId] || [])],
      }));
    });

    return () => socket.off("newCommentAdded");
  }, []);
  // comment reply useeffect
  useEffect(() => {
    socket.on("commentReplyAdded", (data) => {
      const commentreply = data?.data || [];
      const commentIdKey = data?.data.commentId;

      setCommentReplies((prev) => ({
        [commentIdKey]: [commentreply, ...(prev[commentIdKey] || [])],
      }));
    });

    return () => socket.off("commentReplyAdded");
  });

  // follow status useeffect
  useEffect(() => {
    socket.on(
      "followStatusUpdated",
      ({ targetId, loginUserId, follow_Status }) => {
        setFollowStatus((prev) => ({
          ...prev,
          [loginUserId]: { status: follow_Status },
        }));
      }
    );
    return () => socket.off("followStatusUpdated");
  }, []);

  // functions data fetch

  const fetchData = async () => {
    const { success, response, status } = await all_data();
    if (status === 401) {
      navigate("/login");
      return;
    }
    if (!success) return;

    setAllPosts(response?.data || []);
  };

  // functions delete post

  const deletedata = async (data) => {
    const { success, status } = await delete_post_data(data);

    if (status === 401) {
      navigate("/login");
      return;
    }
    if (success) {
      setAllPosts((prev) => prev.filter((p) => p._id !== data));
    }
  };

  // function like post

  const handlePostLikes = async (data) => {
    try {
      const { success, response } = await user_post_likes(data);
      if (!success) return;

      const resdata = response?.data;
      const colordata = resdata?.isLiked;

      setAllPosts((prev) =>
        prev.map((p) => (p._id === data ? { ...p, isLiked: colordata } : p))
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Comment Section ----------------

  const handleGetAllComments = async (PostId) => {
    try {
      const { success, response, status } = await All_CommentGets(PostId);
      if (status === 401) {
        navigate("/login");
        return;
      }

      if (success) {
        const comments = response?.data || [];
        const key = comments[0]?.postId;
        setAllCommentGets({
          [key]: comments,
        });
      }
    } catch (err) {
      console.error("Get All Comments Error", err);
    }
  };

  const handlePostComment = async (data, { resetForm }, PostId) => {
    try {
      const payload = { ...data, PostId };

      const { success, response, status } = await user_comment_post(payload);

      if (status === 401) {
        navigate("/login");
        return;
      }

      if (success) {
        resetForm();
        // setAllCommentGets((prev) => [response.data.comment, ...prev]);
      }
    } catch (err) {
      console.error("Post Comment Error", err);
    }
  };

  const handleGetCommentReplys = async (commentId) => {
    try {
      const { success, response, status } = await All_Comment_Reply_Gets(
        commentId
      );
      if (status === 401) {
        navigate("/login");
        return;
      }

      if (success) {
        const commentReplys = response?.data || [];
        const key = commentReplys[0]?.commentId;

        // if (!commentReplys || !key) return;

        setCommentReplies({
          [key]: commentReplys,
        });
        console.log(commentReplies);
      }
    } catch (err) {
      console.error("Get All Comments Replies Error", err);
    }
  };

  const handleCommentReplyInput = async (data, { resetForm }, commentId) => {
    try {
      const payLoad = { ...data, commentId };
      const { success, response, status } = await user_comment_reply_post(
        payLoad
      );
      if (status === 401) {
        navigate("/login");
        return;
      }

      const CommentId = response?.data.data.commentId;

      if (success) {
        resetForm();
        setShowReplyInput(null);
        setShowReplies(CommentId);
      }
    } catch (err) {
      console.error("Post Comments Replies Error", err);
    }
  };

  //  Handle follow

  const handleFollow = async (targetUserId) => {
    const { success, response } = await user_follow_click(targetUserId);

    if (success) {
      setFollowStatus((prev) => ({
        ...prev,
        [targetUserId]: { status: response.data.follow.status },
      }));
    }
    console.log(followStatus);
  };

  const handleAllGetFollowStatus = async () => {
    const { success, response } = await getAllFollowStatus();
  };

  useEffect(() => {
    handleAllGetFollowStatus();
  }, []);
  // ------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-8">
      <div className="w-full max-w-lg space-y-4">
        {AllPosts.map((post, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* 3 Dots Menu  section-----1 */}

            {UserInfo._id === post.user_id._id && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMenuOpen(menuOpen === index ? null : index)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <FaEllipsisV />
                </button>

                {menuOpen === index && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                      ✏️ Edit
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                      onClick={() => {
                        deletedata(post._id);
                        setMenuOpen(null);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Profile Image + Post Image   section----2 */}
            {post && (
              <>
                <div className="flex items-start justify-between mb-2 pt-5 px-5 bg-white ">
                  {/* <div className="flex items-center mb-2 pt-5 pl-5"> */}
                  {/* Left side: Profile Image + Name/Date */}
                  <div className="flex items-start space-x-3">
                    {post?.user_id?.image ? (
                      <img
                        src={post.user_id.image}
                        alt="Profile Image"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-gray-400" />
                    )}

                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm">
                        {`${post?.user_id?.firstname} ${post?.user_id?.lastname}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Follow button */}
                  {UserInfo._id !== post.user_id._id && (
                    <button
                      className="px-5 py-2 bg-[#fbba00] text-white text-sm font-medium rounded-full hover:bg-[#e0a800] transition-colors duration-200 cursor-pointer"
                      onClick={() => handleFollow(post.user_id._id)}
                    >
                      {followStatus[post.user_id._id]?.status || "Follow"}
                    </button>
                  )}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4 max-h-32 overflow-y-auto pl-5">
                  {post.description}
                </p>

                <img
                  src={`${post.image}`}
                  alt={"Main Image"}
                  className="w-full h-74 object-cover mb-1"
                />
              </>
            )}

            {/* Like , comment , share  section----3 */}
            <div className="flex justify-around items-center pt-3 text-gray-600 pb-5 ">
              {/* Like */}
              <button className="flex flex-col items-center group">
                <div className="flex items-center gap-2 group-hover:text-red-500 transition-colors">
                  <FaHeart
                    className={`text-lg cursor-pointer ${
                      post.isLiked ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={() => handlePostLikes(post._id)}
                  />
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {post.likeCount} Likes
                </span>
              </button>

              {/* Comment */}
              <button
                onClick={() => {
                  if (commentbox === post._id) {
                    setCommentbox(null);
                  } else {
                    setCommentbox(post._id);
                    handleGetAllComments(post._id);
                  }
                }}
                className="flex flex-col items-center group"
              >
                <div className="flex items-center gap-2 group-hover:text-[#fbba00] transition-colors">
                  <FaComment className="text-lg" />
                </div>
                <span className="text-xs text-gray-400 mt-1">Comments</span>
              </button>

              {/* Share */}
              <button className="flex flex-col items-center group">
                <div className="flex items-center gap-2  group-hover:text-[#fbba00] transition-colors">
                  <FaShare className="text-lg" />
                </div>
                <span className="text-xs text-gray-400 mt-1">Shares</span>
              </button>
            </div>

            {/* Comment Input field    section----4  */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden  mb-2 ${
                commentbox === post._id
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Formik
                initialValues={{ comment: "" }}
                validationSchema={Yup.object({
                  comment: Yup.string().required("Comment cannot be empty"),
                })}
                onSubmit={(values, action) => {
                  handlePostComment(values, action, post._id);
                }}
              >
                {({ isSubmitting, handleSubmit, setFieldValue }) => (
                  <Form
                    className="flex items-start gap-3 mt-2 px-4 pb-2"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex-1 flex flex-col">
                      <Field
                        name="comment"
                        type="text"
                        placeholder="Write a comment..."
                        className="flex-1 border border-gray-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fbba00] focus:border-none mb-2"
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value === " ") return;
                          value = value.replace(/\s{2,}/g, " ");
                          setFieldValue("comment", value);
                        }}
                      />
                      <ErrorMessage
                        name="comment"
                        component="p"
                        className="text-red-500 text-xs ml-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#fbba00] text-white px-4 py-2 rounded-full text-sm transition cursor-pointer"
                    >
                      Comment
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Comment message and comment replays  section---5  */}
            {commentbox === post._id && (
              <div className="px-6 space-y-3 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pb-5 mb-5">
                {AllCommentGets[post._id]?.length > 0 ? (
                  AllCommentGets[post._id]?.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex flex-col gap-2 bg-gray-100 p-2 rounded-lg shadow-sm"
                    >
                      {/* Comment Main */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex-shrink-0">
                          {comment?.userId?.image ? (
                            <img
                              src={`${comment.userId.image}`}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">
                              {comment?.userId?.firstname}
                            </p>
                            <span className="text-[11px] text-gray-400">
                              {format(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {comment.comment}
                          </p>

                          {/* Actions */}
                          <div className="mt-2 flex gap-2 text-xs text-gray-500">
                            <button
                              className="hover:text-blue-500 hover:underline"
                              onClick={() => {
                                if (showReplies === comment._id) {
                                  setShowReplies(null);
                                } else {
                                  setShowReplies(comment._id);
                                  handleGetCommentReplys(comment._id);
                                }
                              }}
                            >
                              {showReplies === comment._id
                                ? "Close Replies |"
                                : "View Replies |"}
                            </button>
                            <button
                              className="hover:text-blue-500 hover:underline"
                              onClick={() => {
                                if (showReplyInput === comment._id) {
                                  setShowReplyInput(null);
                                } else {
                                  setShowReplyInput(comment._id);
                                }
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Static Reply Input (UI only) */}
                      {showReplyInput === comment._id && (
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden `}
                        >
                          <Formik
                            initialValues={{ reply: "" }}
                            validationSchema={Yup.object({
                              reply: Yup.string().required(
                                "Reply cannot be empty"
                              ),
                            })}
                            onSubmit={(values, action) =>
                              handleCommentReplyInput(
                                values,
                                action,
                                comment._id
                              )
                            }
                          >
                            {({
                              isSubmitting,
                              handleSubmit,
                              setFieldValue,
                            }) => (
                              <Form
                                className="ml-11 mt-2 flex items-start gap-2"
                                onSubmit={handleSubmit}
                              >
                                <div className="flex-1 flex flex-col">
                                  <Field
                                    name="reply"
                                    type="text"
                                    placeholder="Write a reply..."
                                    className="flex-1 p-2 px-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-none mb-2"
                                    onChange={(e) => {
                                      let value = e.target.value;
                                      if (value === " ") return;
                                      value = value.replace(/\s{2,}/g, " ");
                                      setFieldValue("reply", value);
                                    }}
                                  />
                                  <ErrorMessage
                                    name="reply"
                                    component="p"
                                    className="text-red-500 text-xs ml-2"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="px-4 py-2 mb-2 bg-[#fbba00] text-white rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors duration-200"
                                >
                                  Reply
                                </button>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      )}

                      {/* Static Replies List */}

                      {showReplies === comment._id && (
                        <div className="ml-10 mt-2 space-y-2">
                          {commentReplies[comment._id]?.length > 0 ? (
                            commentReplies[comment._id]?.map((reply, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-2 rounded-md text-sm mb-2 flex gap-2"
                              >
                                <div className="w-8 h-8 rounded-full flex-shrink-0">
                                  {reply?.userId?.image ? (
                                    <img
                                      src={`${reply?.userId.image}`}
                                      alt="Profile"
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold">
                                      {reply?.userId?.firstname ||
                                        "Unknown User"}
                                    </p>
                                    <span className="text-[11px] text-gray-400">
                                      {format(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {reply?.commentReply}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm italic">
                              No comment replies yet
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center">
                    No comments yet
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
