// local
import {
  user_comment_post,
  All_CommentGets,
  user_comment_reply_post,
  All_Comment_Reply_Gets,
} from "../API layer/api";

import { all_data } from "../API layer/user_post_api";

import { UserContext } from "../Context/context";

// built in
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComment, FaUserCircle } from "react-icons/fa";
import { format } from "timeago.js";

//
import io from "socket.io-client";
const socket = io("http://localhost:9090");

import PostCards from "../Components/Home/PostCards/PostCards_parent";

//
function Home() {
  const { UserInfo, setSinglePost_data, AllPosts, setAllPosts } =
    useContext(UserContext);
  // states
 

  //
  const [AllCommentGets, setAllCommentGets] = useState({});
  const [commentReplies, setCommentReplies] = useState({});

  //
  const [commentbox, setCommentbox] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [showReplies, setShowReplies] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);


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

  

  const fetchData = async () => {
    const { success, response, status } = await all_data();
    if (status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (!success) return;

    setAllPosts(response?.data?.data || []);
  };

 

  // Comment Section ----------------

  const handleGetAllComments = async (PostId) => {
    try {
      const { success, response, status } = await All_CommentGets(PostId);
      if (status === 401) {
        localStorage.removeItem("token");
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
        localStorage.removeItem("token");
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
      const { success, response, status } =
        await All_Comment_Reply_Gets(commentId);
      if (status === 401) {
        localStorage.removeItem("token");
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
      const { success, response, status } =
        await user_comment_reply_post(payLoad);
      if (status === 401) {
        localStorage.removeItem("token");
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

 

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-8">
        <div className="w-full max-w-lg space-y-4">
          {AllPosts.map((post, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
             
              {/* Profile Image + Post Image   section----2 */}

              <PostCards post={post} index={index} />

              {/* Like , comment , share  section----3 */}
              <div className="flex justify-around items-center pt-3 text-gray-600 pb-5 ">
                {/* Like */}
              

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
                              <p
                                className="text-sm font-semibold cursor-pointer"
                             
                              >
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
                                  "Reply cannot be empty",
                                ),
                              })}
                              onSubmit={(values, action) =>
                                handleCommentReplyInput(
                                  values,
                                  action,
                                  comment._id,
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
                              commentReplies[comment._id]?.map(
                                (reply, index) => (
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
                                        <p className="text-sm font-semibold cursor-pointer">
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
                                ),
                              )
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

      

    
    </>
  );
}

export default Home;
