import axios from "axios";
import { toast } from "react-toastify";

let API_Url = "http://localhost:9090";


// getUserInfoDataController ----- Get , name + image main

export const get_user_login_info = async () => {
  try {
    const Usertoken = localStorage.getItem("token");
    const response = await axios.get(
      `${API_Url}/user_info/getuserinfo_data`,
      {
        headers: {
          Authorization: `Bearer ${Usertoken}`,
        },
      },
    );

    toast.success(response.data?.message);
    // console.log(response?.data)
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