import axios from "axios";
import { toast } from "react-toastify";

let API_Url = "http://localhost:9090";

export const get_all_message_API = async (targetuserId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_live/user_all_messages`,

      {
        params: { targetUserId: targetuserId },
        headers: { Authorization: `Bearer ${Usertoken}` },
      },
    );
    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Get All Message Error ${err}`);
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

export const user_get_or_create_conversion = async (targetUserId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_live/user_all_conversion/${targetUserId}`,

      {
        headers: { Authorization: `Bearer ${Usertoken}` },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Get All Message Error ${err}`);
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

export const user_get_all_conversion_API = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_live/user_get_all_conversion`,
      {
        headers: { Authorization: `Bearer ${Usertoken}` },
      },
    );
    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Get All Message Error ${err}`);
    if (err.response) {
      toast.error(err.response.data?.message);
      return {
        success: false,
        status: err.response.status,
        response: err.response,
      };
    }

    toast.error("Network error: Please check your internet connection.");
    return {
      success: false,
      message: "Network error: Please check your internet connection.",
    };
  }
};


export const mark_read_conversation_patch_API = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_Url}/user_live/mark_as_read/${conversationId}`, // <--- Params in URL
      {}, // Empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
   return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error("Mark as read API error:", err);
  }
};




export const user_live_chat_Post_API = async (receiverId, message) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(
      `${API_Url}/user_live/userlivechat`,
      {
        receiverId,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );
    toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Live chat post error: ${err}`);
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
