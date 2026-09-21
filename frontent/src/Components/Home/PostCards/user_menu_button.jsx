import React from "react";
import { useState, useContext } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/context";
import { delete_post_data } from "../../../API layer/api";

const User_menu_button = ({ index, post }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();
  const { setSinglePost_data, UserInfo, setAllPosts } = useContext(UserContext);

  const handlePostEdit = (post) => {
    setSinglePost_data(post);
    navigate(`/edit-post/${post._id}`);
  };

  const deletedata = async (data) => {
    const { success, status } = await delete_post_data(data);

    if (status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (success) {
      setAllPosts((prev) => prev.filter((p) => p._id !== data));
    }
  };

  return (
    <div>
      {" "}
      {UserInfo._id === post.user_id && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMenuOpen(menuOpen === index ? null : index)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <FaEllipsisV />
          </button>

          {menuOpen === index && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  handlePostEdit(post);
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                onClick={() => {
                  deletedata(post._id);
                  setMenuOpen(null);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User_menu_button;
