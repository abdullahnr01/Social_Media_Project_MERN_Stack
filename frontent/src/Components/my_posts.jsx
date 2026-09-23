// import React, { use } from "react";
// import { useEffect, useState, useContext } from "react";
// import { get_All_My_Posts } from "../API layer/api";
// import { UserContext } from "../Context/context";
// function MyPost() {
//   const {

//     profileImage,
//     // functions
//     fetchProfileImage,

//   } = useContext(UserContext);

//   const [totalPosts, settotalPost] = useState("");
//   const [totallikes, setTotallikes] = useState("");

//   const user = {
//     totalConnections: 58,
//   };

//   const getMyPostdata = async () => {
//     const { success, response } = await get_All_My_Posts();
//     if (success) {
//       console.log(response);
//       settotalPost(response?.data.response.length);
//       const totalLikes = response?.data?.response.reduce(
//         (sum, post) => sum + post.likes.length,
//         0
//       );
//       setTotallikes(totalLikes);
//     }
//   };

//   useEffect(() => {
//     getMyPostdata();
//   }, []);

//   return (
//     <div className="flex justify-center items-start min-h-screen pt-10 bg-gray-100">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center">
//         {/* Profile Image */}
//         <div className="flex justify-center mb-4">
//           <img
//             src={profileImage}
//             alt="Profile"
//             className="w-24 h-24 rounded-full object-cover border-none"
//           />
//         </div>

//         {/* User Name */}
//         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//           {`${UserInfo.firstname}  ${UserInfo.lastname}  `}
//         </h2>

//         {/* Divider Line */}
//         <div className="w-36 h-1 bg-yellow-400 mx-auto mb-5 mt-5 rounded-full"></div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-3 gap-4 text-gray-700">
//           <div>
//             <h3 className="text-xl font-bold">{totallikes}</h3>
//             <p className="text-sm text-gray-500">Likes</p>
//           </div>
//           <div>
//             <h3 className="text-xl font-bold">{totalPosts}</h3>
//             <p className="text-sm text-gray-500">Posts</p>
//           </div>
//           <div>
//             <h3 className="text-xl font-bold">{user.totalConnections}</h3>
//             <p className="text-sm text-gray-500">Connections</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyPost;
