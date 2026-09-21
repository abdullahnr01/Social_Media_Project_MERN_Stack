import axios from "axios";
import { toast } from "react-toastify";

let API_Url = "http://localhost:9090";

export const getAllFollowStatus = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_follow/getAllFollowStatus`,
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


//  followUserController ---------------
export const user_follow_click = async (targetUserId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.post(
      `${API_Url}/user_follow/follow`,
      { userId: targetUserId },

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
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
      `${API_Url}/user_follow/res_follow`,
      { targetId: targetUserId, action: action },

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );

    console.log(response)

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

    toast.error("Network error: Please check your internet connection...yaha masla hai");
  }
};

export const withdrawFollow = async (selectedUserId) => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_Url}/user_follow/withdraw`,
      { userId: selectedUserId },

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
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

export const unfollowUser = async (selectedUserId) => {
  console.log(`ider b dyan do ${selectedUserId}`)
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_Url}/user_follow/unfollow`,
      { userId: selectedUserId },

      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );

    console.log(response?.data);

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

    toast.error("Network error: Please check your internet connection.ider");
  }
};
