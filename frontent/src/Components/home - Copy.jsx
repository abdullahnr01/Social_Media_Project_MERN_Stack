// local
import {
  all_data,
  delete_post_data,
  user_post_likes,
  user_comment_post,
  All_CommentGets,
  user_comment_reply_post,
  All_Comment_Reply_Gets,
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
  const [menuOpen, setMenuOpen] = useState(null);
  //
  const [AllCommentGets, setAllCommentGets] = useState([]);
  const [commentReplies, setCommentReplies] = useState([]);

  //
  const [commentbox, setCommentbox] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  //
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

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

  useEffect(() => {
    socket.on("newCommentAdded", (data) => {
      setAllCommentGets((prev) => [data?.comment, ...prev]);
    });

    return () => socket.off("newCommentAdded");
  });

  useEffect(() => {
    socket.on("commentReplyAdded", (data) => {
      setCommentReplies((prev) => [data?.data, ...prev]);
    });

    return () => socket.off("commentReplyAdded");
  });

  //

  const { AllPostsAgain, profileImage, setAllPostsAgain } =
    useContext(UserContext);

  // functions

  const fetchData = async () => {
    const { success, response, status } = await all_data();
    if (status === 401) {
      navigate("/login");
      return;
    }
    if (!success) return;

    setAllPosts(response?.data || []);
  };

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

  const handleGetAllComments = async (data) => {
    try {
      const { success, response, status } = await All_CommentGets(data);
      if (status === 401) {
        navigate("/login");
        return;
      }

      if (success) {
        console.log("Hello World");
        setAllCommentGets(response?.data || []);
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
        setCommentReplies(response?.data || []);
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

      if (success) {
        resetForm();
        // setCommentReplies((prev) => [response?.data?.data, ...prev]);
        setShowReplyInput(false);
        setShowReplies(true);
      }
    } catch (err) {
      console.error("Post Comments Replies Error", err);
    }
  };

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

            {/* Profile Image + Post Image   section----2 */}
            {post && (
              <>
                <div className="flex items-center mb-2 pt-5 pl-5">
                  {/* Profile Image */}
                  {post?.user_id?.image ? (
                    <img
                      src={`http://localhost:9090/${post.user_id.image}`}
                      alt="Profile Image"
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                  )}

                  {/* Name + Date */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
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

                <p className="text-gray-700 text-sm leading-relaxed mb-4 max-h-32 overflow-y-auto pl-5">
                  {post.description}
                </p>

                <img
                  src={`http://localhost:9090/${post.image}`}
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
                  setCommentbox(!commentbox);
                  handleGetAllComments(post._id);
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
                commentbox ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
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
            {commentbox && (
              <div className="px-6 space-y-3 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pb-5 mb-5">
                {AllCommentGets.length > 0 ? (
                  AllCommentGets.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex flex-col gap-2 bg-gray-100 p-2 rounded-lg shadow-sm"
                    >
                      {/* Comment Main */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex-shrink-0">
                          {comment?.userId?.image ? (
                            <img
                              src={`http://localhost:9090/${comment.userId.image}`}
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
                                setShowReplies(!showReplies);
                                handleGetCommentReplys(comment._id);
                              }}
                            >
                              {showReplies
                                ? "Close Replies |"
                                : "View Replies |"}
                            </button>
                            <button
                              className="hover:text-blue-500 hover:underline"
                              onClick={() => setShowReplyInput(!showReplyInput)}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Static Reply Input (UI only) */}
                      {showReplyInput && (
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

                      {showReplies && (
                        <div className="ml-10 mt-2 space-y-2">
                          {commentReplies.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">
                              No comment replies yet
                            </p>
                          ) : (
                            commentReplies.map((reply, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-2 rounded-md text-sm mb-2 flex gap-2"
                              >
                                <div className="w-8 h-8 rounded-full flex-shrink-0">
                                  {reply?.userId?.image ? (
                                    <img
                                      src={`http://localhost:9090/${reply?.userId.image}`}
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

// import { useContext, useEffect, useState } from "react";
// import { all_data, delete_post_data, user_post_likes } from "../API layer/api";
// import { FaHeart, FaComment, FaShare, FaEllipsisV } from "react-icons/fa";
// import { UserContext } from "../Context/context";
// import { useNavigate } from "react-router-dom";
// import { IoClose } from "react-icons/io5";
// import {
//   FaUserCircle,

// } from "react-icons/fa";
// function Home() {
//   const [menuOpen, setMenuOpen] = useState(null);
//   const [showComments, setShowComments] = useState(false);
//   const navigate = useNavigate();

//   const { AllPostsAgain, profileImage, setAllPostsAgain } =
//     useContext(UserContext);
//   const [AllPosts, setAllPosts] = useState([]);

//   //
//   const fetchData = async () => {
//     const { success, response, status } = await all_data();
//     if (status === 401) {
//       navigate("/login");
//       return;
//     }
//     if (!success) return;

//     const serverPosts = response?.data || []; // axios response payload

//     const postsWithMeta = serverPosts.map((post) => ({
//       ...post,
//       // ensure frontend always uses `likesCount` and `isLiked`
//       likesCount: post.likesCount ?? post.likeCount ?? post.likes?.length ?? 0,
//       isLiked:
//         typeof post.isLiked === "boolean"
//           ? post.isLiked
//           : !!(post.likes?.length && false), // fallback false
//     }));

//     setAllPosts(postsWithMeta);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const deletedata = async (data) => {
//     const { success, status } = await delete_post_data(data);

//     if (status === 401) {
//       navigate("/login");
//       return;
//     }
//     if (success) {
//       // best: remove locally instead of fetch (optional)
//       setAllPosts((prev) => prev.filter((p) => p._id !== data));
//     }
//   };

//   // LIKE / UNLIKE handler — robustly read axios data and update only clicked post
//   // LIKE/UNLIKE - robust payload handling, update only clicked post
//   const handlePostLikes = async (postId) => {
//     try {
//       const { success, response } = await user_post_likes(postId);
//       if (!success) return;

//       // axios response payload usually lives at response.data
//       const payload = response?.data ?? response ?? {};

//       // Accept several possible names from backend:
//       const newCount = payload.likesCount ?? payload.likes ?? payload.likeCount;
//       const newIsLiked =
//         typeof payload.isLiked === "boolean" ? payload.isLiked : undefined;

//       setAllPosts((prev) =>
//         prev.map((p) =>
//           p._id === postId
//             ? {
//                 ...p,
//                 likesCount: newCount ?? p.likesCount ?? 0,
//                 isLiked: newIsLiked ?? p.isLiked ?? false,
//               }
//             : p
//         )
//       );

//       // DEBUG: inspect what came from the server (only for debugging; remove later)
//       console.log("like payload:", payload);
//     } catch (err) {
//       console.error("Like error:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-8">
//       <div className="w-full max-w-lg space-y-4">
//         {AllPosts.map((post, index) => (
//           <div
//             key={index}
//             className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//           >
//             {/* 3 Dots Menu */}
//             <div className="absolute top-4 right-4">
//               <button
//                 onClick={() => setMenuOpen(menuOpen === index ? null : index)}
//                 className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
//               >
//                 <FaEllipsisV />
//               </button>

//               {menuOpen === index && (
//                 <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
//                   <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
//                     ✏️ Edit
//                   </button>
//                   <button
//                     className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
//                     onClick={() => deletedata(post._id)}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Image */}
//             {post.image && (
//               <>
//                 <div className="flex items-center mb-2 pt-5 pl-5">
//                   {/* Profile Image */}
//                   {post?.user_id?.image ? (
//                     <img
//                       src={`http://localhost:9090/${post.user_id.image}`}
//                       alt="Profile Image"
//                       className="w-10 h-10 rounded-full object-cover mr-3"
//                     />
//                   ) : (
//                     <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
//                   )}

//                   {/* Name + Date */}
//                   <div className="flex flex-col">
//                     <span className="font-semibold text-gray-800">
//                       {`${post?.user_id?.firstname} ${post?.user_id?.lastname}`}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {new Date(post.createdAt).toLocaleDateString("en-US", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                 </div>

//                 <p className="text-gray-700 text-sm leading-relaxed mb-4 max-h-32 overflow-y-auto pl-5">
//                   {post.description}
//                 </p>

//                 <img
//                   src={`http://localhost:9090/${post.image}`}
//                   alt={"Main Image"}
//                   className="w-full h-74 object-cover mb-1"
//                 />
//               </>
//             )}

//             <div className="flex justify-around items-center pt-3 text-gray-600 pb-5 mb-5">
//               {/* Like */}
//               <button className="flex flex-col items-center group">
//                 <div className="flex items-center gap-2 group-hover:text-red-500 transition-colors">
//                   <FaHeart
//                     className={`text-lg cursor-pointer ${
//                       post.isLiked ? "text-red-500" : "text-gray-500"
//                     }`}
//                     onClick={() => handlePostLikes(post._id)}
//                   />
//                   {/* <span className="text-sm font-medium">Like</span> */}
//                 </div>
//                 <span className="text-xs text-gray-400 mt-1">
//                   {post.likesCount ?? 0} Likes
//                 </span>
//               </button>

//               {/* Comment */}
//               <button className="flex flex-col items-center group">
//                 <div className="flex items-center gap-2 group-hover:text-blue-500 transition-colors">
//                   <FaComment className="text-lg" />
//                   {/* <span className="text-sm font-medium">Comment</span> */}
//                 </div>
//                 <span className="text-xs text-gray-400 mt-1"> Comments</span>
//               </button>

//               {/* Share */}
//               <button className="flex flex-col items-center group">
//                 <div className="flex items-center gap-2 group-hover:text-green-500 transition-colors">
//                   <FaShare className="text-lg" />
//                   {/* <span className="text-sm font-medium">Share</span> */}
//                 </div>
//                 <span className="text-xs text-gray-400 mt-1">Shares</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Home;

{
  /* 
                      <div className="flex-1">
                     
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold">
                            {`${comment?.userId?.firstname}`}
                          </p>
                          <span className="text-[11px] text-gray-400">
                            {format(comment.createdAt)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mt-1">
                          {comment.comment}
                        </p>
                      </div> */
}

{
  /* <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <button
                          className="hover:text-blue-500 hover:underline focus:outline-none"
                          onClick={() => handleViewReplies(comment._id)}
                        >
                          View replies
                        </button>

                        <span className="text-gray-400">|</span>

                        <button
                          className="hover:text-blue-500 hover:underline focus:outline-none"
                          onClick={() => handleReply(comment._id)}
                        >
                          Reply
                        </button>
                      </div> */
}

// const handlePostLikes = async (data) => {
//   try {
//     console.log(data);
//     const { success, response } = await user_post_likes(data);
//     if (!success) return;

//     const resdata = response?.data;
//     const likedata = resdata?.likeCount;
//     const colordata = resdata?.isLiked;

//     setAllPosts((prev) =>
//       prev.map((p) =>
//         p._id === data
//           ? {
//               ...p,
//               likeCount: likedata,
//               isLiked: colordata,
//             }
//           : p
//       )
//     );
//   } catch (err) {
//     console.error("Like error:", err);
//   }
// };
