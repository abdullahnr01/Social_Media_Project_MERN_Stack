import React, { createContext, useState, useEffect } from "react";
import { get_user_profile_img, get_user_login_info } from "../API layer/api";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  // UseStates ------------------------------------------

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [AllPosts, setAllPosts] = useState([]);
  const [singlePost_data, setSinglePost_data] = useState({});
  const [AllPostsAgain, setAllPostsAgain] = useState(false);
  const [userPostsProfile, setUserPostsProfile] = useState({});
  //
  const [UserInfo, setUserInfo] = useState({});

  //

  // Functions -----------------------------------------

  const UserInfofetch = async () => {
    const { response, success, status } = await get_user_login_info();

    console.log(response?.data.data);
    if (success) {
      setUserInfo(response?.data?.data);
    }
  };

  //  JSX ------------------------------------------

  return (
    <UserContext.Provider
      value={{
        credentials,
        setCredentials,
        AllPosts,
        setAllPosts,
        //
        UserInfo,
        setUserInfo,
        //
        singlePost_data,
        setSinglePost_data,
        userPostsProfile,
        setUserPostsProfile,
        //
        setAllPostsAgain,
        AllPostsAgain,
        // function
        UserInfofetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
