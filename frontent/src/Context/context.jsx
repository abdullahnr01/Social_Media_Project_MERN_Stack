import React, { createContext, useState, useEffect } from "react";
import { get_user_profile_img, get_user_login_info } from "../API layer/api";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [AllPosts, setAllPosts] = useState([]);
  const [AllPostsAgain, setAllPostsAgain] = useState(false);
  const [UserInfo, setUserInfo] = useState({});
  const [UserInfoAgain, setUserInfoAgain] = useState({});
  const [profileImage, setProfileImage] = useState(null);
 
  const fetchProfileImage = async () => {
    const { success, response } = await get_user_profile_img();
    if (success) {
      setProfileImage(response?.data?.image);
    } else {
      setProfileImage(null);
    }
  };

  const UserInfofetch = async () => {
    const { response, success, status } = await get_user_login_info();

    if (success) {
      setUserInfo(response?.data);
    }
  };

  return (
    <UserContext.Provider
      value={{
        credentials,
        setCredentials,
        AllPosts,
        setAllPosts,
        setAllPostsAgain,
        AllPostsAgain,
        UserInfo,
        setUserInfo,
        UserInfoAgain,
        setUserInfoAgain,
        profileImage,
        setProfileImage,
        fetchProfileImage,
        UserInfofetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
