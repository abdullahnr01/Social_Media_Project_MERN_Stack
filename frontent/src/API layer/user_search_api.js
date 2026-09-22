import axios from "axios";
import { toast } from "react-toastify";

let API_Url = "http://localhost:9090";

export const getSearchUserProfile = async (query = "") => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(`${API_Url}/user_search/search`, {
      headers: {
        Authorization: `Bearer ${Usertoken}`,
      },
      params: {
        query: query,
      },
    });

    // toast.success(response.data?.message);
    return { success: true, response: response, status: response.status };
  } catch (err) {
    console.error(`User Profile Searching Error ${err}`);
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
