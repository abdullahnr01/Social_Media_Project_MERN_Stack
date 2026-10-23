import React, { createContext, useState, useEffect } from "react";
import { get_user_login_info } from "../API layer/user_profile_api";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  // UseStates ------------------------------------------

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [AllPosts, setAllPosts] = useState([]);
  const [userPostsProfile, setUserPostsProfile] = useState({});
  const [UserInfo, setUserInfo] = useState({});
  const [followStatus, setFollowStatus] = useState({});
  const [singlePost_data, setSinglePost_data] = useState({});



 
  //

  const [AllPostsAgain, setAllPostsAgain] = useState(false);
  //

  // Functions -----------------------------------------

  const UserInfofetch = async () => {
    const { response, success, status } = await get_user_login_info();

    if (success) {
      setUserInfo(response?.data?.data);
    }
  };

  //

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

        followStatus,
        setFollowStatus,
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
