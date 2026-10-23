import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaHome,
  FaPlusSquare,
} from "react-icons/fa";
import { UserContext } from "../../../Context/context";

import { respond_user_follow_click } from "../../../API layer/user_follow_api";

import SearchBar from "../../Search_bar/nav_seach_bar";
import { Name } from "./name";

import { Nav_Actions } from "./nav_action_btn";
import { Nav_User_Profile_Btn } from "./user_profile_btn";

const Navbar = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const [request, setRequest] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  //
  const {
    UserInfo,
    // function
    UserInfofetch,
  } = useContext(UserContext);

  useEffect(() => {
    UserInfofetch();
  }, []);


    useEffect(() => {
      console.log(UserInfo)
    } , [UserInfo])

  // functions -------------------------

  const respondFollowReq = async (targetId, action) => {
    const { success, response, status } = await respond_user_follow_click(
      targetId,
      action,
    );
    if (success) {
      setRemovingId(targetId);

      setTimeout(() => {
        setRequest((prev) =>
          prev.filter((req) => req.loginUser._id !== targetId),
        );
        setRemovingId(null);
      }, 300);
    }
  };

  return (
    <nav className="bg-[#fbba00] shadow-md sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-16 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left 50% */}

          <Name />
            <SearchBar />

          {/* Right 50% */}
          <div className="flex w-1/2 items-center justify-center space-x-6">
          <Nav_Actions />

            <Nav_User_Profile_Btn UserInfo={UserInfo} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
