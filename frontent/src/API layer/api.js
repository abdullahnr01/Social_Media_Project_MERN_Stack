import axios from "axios";
import { toast } from "react-toastify";

// Get APIs-------------------------------

export const all_data = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getpostdata",

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Get All Post data error ${err}`);
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

export const get_All_My_Posts = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getAllMyPosts",
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );

    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Get All My Posts error ${err}`);
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

export const get_user_login_info = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getuserinfo_data",
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Login info error ${err}`);
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

export const get_user_profile_img = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getuserprofileimage",
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );

    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Get User Profile Image error ${err}`);
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

export const All_CommentGets = async (postId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getAllcomments",

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
          "Post-Id": postId,
        },
      }
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
      "http://localhost:9090/user/getAllCommentreplies",

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
          "Comment-Id": commentId,
        },
      }
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
      }
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


export const getAllFollowStatus = async () => {
   try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:9090/user/getAllFollowStatus",
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
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
}
// Post APIs-------------------------------

export const user_post_data = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:9090/user/postdata",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`Post data error ${err}`);
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
      "http://localhost:9090/user/signup",
      data
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
    const response = await axios.post("http://localhost:9090/user/login", data);

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
      "http://localhost:9090/user/comment",
      data,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
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
      "http://localhost:9090/user/comment_reply_post",
      data,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
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

export const user_follow_click = async (targetUserId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:9090/user/follow",
      { userId: targetUserId },

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User following error ${err}`);
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

export const respond_user_follow_click = async (targetUserId, action) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      "http://localhost:9090/user/res_follow",
      { targetId: targetUserId, action: action },

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );

    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User following error ${err}`);
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

// Delete APIs--------------------------------

export const delete_post_data = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.delete(
      "http://localhost:9090/user/deletepostdata",

      {
        params: { userId: data },
        headers: { Authorization: `Bearer ${Usertoken}` },
      }
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
      "http://localhost:9090/user/UpdateUserinfo_data",
      data,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      }
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

export const user_profile_upload = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      "http://localhost:9090/user/uploadprofile",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Usertoken}`,
        },
      }
    );
    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Profile Upload error ${err}`);
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
      }
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
