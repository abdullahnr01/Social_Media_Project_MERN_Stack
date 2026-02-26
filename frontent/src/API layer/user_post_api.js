import axios from "axios";
import { toast } from "react-toastify";

let API_Url = "http://localhost:9090";

export const get_single_post_API = async (id) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_post/getsinglepost_data/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
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

export const get_user_Profile_OR_Posts_API = async (id) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_post/userprofilewithposts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Profile with Posts data error ${err}`);
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

export const user_post_API = async (data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(`${API_Url}/user_post/postdata`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${Usertoken}`,
      },
    });
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

export const user_edit_post_API = async (postId, data) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_Url}/user_post/${postId}/edit_post`,
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
    console.error(`Post Edit error ${err}`);
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
