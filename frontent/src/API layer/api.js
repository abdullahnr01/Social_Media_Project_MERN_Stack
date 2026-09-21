import axios from "axios";
import { toast } from "react-toastify";

let API_Url = "http://localhost:9090";

import { useNavigate } from "react-router-dom";

// Get APIs-------------------------------



// export const get_All_My_Posts = async () => {
//   try {
//     const Usertoken = localStorage.getItem("token");
//     const response = await axios.get(
//       "http://localhost:9090/user/getAllMyPosts",
//       {
//         headers: {
//           Authorization: `Bearer ${Usertoken}`,
//         },
//       },
//     );

//     // toast.success(response.data?.message);
//     return { success: true, response: response, status: response.status };
//   } catch (err) {
//     console.error(`Get All My Posts error ${err}`);
//     if (err.response) {
//       // toast.error(err.response.data?.message);
//       return {
//         success: false,
//         status: err.response.status,
//         response: err.response,
//       };
//     }

//     toast.error("Network error: Please check your internet connection.");
//   }
// };



// export const get_user_profile_img = async () => {
//   try {
//     const Usertoken = localStorage.getItem("token");
//     const response = await axios.get(
//       "http://localhost:9090/user_info/getuserprofileimage",
//       {
//         headers: {
//           Authorization: `Bearer ${Usertoken}`,
//         },
//       },
//     );

//     console.log(response?.data)

//     // toast.success(response.data?.message);
//     return { success: true, response: response, status: response.status };
//   } catch (err) {
//     console.error(`Get User Profile Image error ${err}`);
//     if (err.response) {
//       // toast.error(err.response.data?.message);
//       return {
//         success: false,
//         status: err.response.status,
//         response: err.response,
//       };
//     }

//     toast.error("Network error: Please check your internet connection.");
//   }
// };

export const All_CommentGets = async (postId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user_comment/getAllcomments",

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
          "Post-Id": postId,
        },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Get All Comments error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        response: err.response,
        status: err.response.status,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

export const All_Comment_Reply_Gets = async (commentId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user_comment/getAllCommentreplies",

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
          "Comment-Id": commentId,
        },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Get All Comments Replies error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        response: err.response,
        status: err.response.status,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

export const get_user_notification = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getAllNotification",
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );

    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Login info error ${err}`);
    if (err.response) {
      // toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};


// Post APIs-------------------------------

export const GoogleCredential_Login_API = async (datatoken) => {
  try {
    const googleToken = datatoken.credential;

    const response = await axios.post(`${API_Url}/user_info/auth/google`, {
      token: googleToken,
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Google Login Auth Error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};



export const user_sign_up = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:9090/user_info/signup",
      data,
    );

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Sign Up error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

export const user_login_in = async (data) => {
  try {
    const response = await axios.post("http://localhost:9090/user_info/login", data);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Login error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

export const user_comment_post = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:9090/user_comment/comment",
      data,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Comment post error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

export const user_comment_reply_post = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:9090/user_comment/comment_reply_post",
      data,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Comment reply post error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

// export const user_follow_click = async (targetUserId) => {
//   try {
//     const Usertoken = localStorage.getItem("token");
//     const response = await axios.post(
//       "http://localhost:9090/user/follow",
//       { userId: targetUserId },

//       {
//         headers: {
//           Authorization: `Bearer ${Usertoken}`,
//         },
//       },
//     );

//     console.log("heavy");

//     toast.success(response.data?.message);
//     return { success: true, response: response, status: response.status };
//   } catch (err) {
//     console.error(`User following error ${err}`);
//     if (err.response) {
//       // toast.error(err.response.data?.message);
//       return {
//         success: false,
//         status: err.response.status,
//         response: err.response,
//       };
//     }

//     toast.error("Network error: Please check your internet connection.");
//   }
// };

// export const respond_user_follow_click = async (targetUserId, action) => {
//   try {
//     const Usertoken = localStorage.getItem("token");
//     const response = await axios.patch(
//       "http://localhost:9090/user/res_follow",
//       { targetId: targetUserId, action: action },

//       {
//         headers: {
//           Authorization: `Bearer ${Usertoken}`,
//         },
//       },
//     );

//     toast.success(response.data?.message);
//     return { success: true, response: response, status: response.status };
//   } catch (err) {
//     console.error(`User following error ${err}`);
//     if (err.response) {
//       toast.error(err.response.data?.message);
//       return {
//         success: false,
//         status: err.response.status,
//         response: err.response,
//       };
//     }

//     toast.error("Network error: Please check your internet connection.");
//   }
// };

// Delete APIs--------------------------------

export const delete_post_data = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.delete(
      "http://localhost:9090/user_post/deletepostdata",

      {
        params: { userId: data },
        headers: { Authorization: `Bearer ${Usertoken}` },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response };
  } catch (err) {
    console.error(`Delete data error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

// Update APIs-----------------------------------

export const user_update_all_info = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      "http://localhost:9090/user_info/UpdateUserinfo_data",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Info Update error.${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};

// export const user_profile_update = async (data) => {
//   try {
//     const Usertoken = localStorage.getItem("token");
//     const response = await axios.patch(
//       "http://localhost:9090/user/uploadprofile",
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${Usertoken}`,
//         },
//       }
//     );
//     // toast.success(response.data?.message);
//     return { success: true, response: response, status: response.status };
//   } catch (err) {
//     console.error(`User Profile Upload error ${err}`);
//     if (err.response) {
//       // toast.error(err.response.data?.message);
//       return {
//         success: false,
//         status: err.response.status,
//         response: err.response,
//       };
//     }

//     toast.error("Network error: Please check your internet connection.");
//   }
// };

// export const user_profile_upload = async (data) => {
//   try {
//     const Usertoken = localStorage.getItem("token");
//     const response = await axios.patch(
//       "http://localhost:9090/user_info/uploadprofile",
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${Usertoken}`,
//         },
//       },
//     );
//     // toast.success(response.data?.message);
//     return { success: true, response: response, status: response.status };
//   } catch (err) {
//     console.error(`User Profile Upload error ${err}`);
//     if (err.response) {
//       // toast.error(err.response.data?.message);
//       return {
//         success: false,
//         status: err.response.status,
//         response: err.response,
//       };
//     }

//     toast.error("Network error: Please check your internet connection.");
//   }
// };

export const user_post_likes = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      "http://localhost:9090/user/like",
      {},
      {
        params: {
          postId: data,
        },
        headers: { Authorization: `Bearer ${Usertoken}` },
      },
    );

    return { success: true, response: response };
  } catch (err) {
    console.error(`Post Like error ${err}`);
    if (err.response) {
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
  }
};
