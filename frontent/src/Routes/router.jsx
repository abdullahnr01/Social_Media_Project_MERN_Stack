import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
//
import CreatePosts from "../Components/Post_CRUD/create_posts";
import Home from "../Pages/home";
import Login from "../Pages/login";
import SignUp from "../Pages/signup";
import Navbar from "../Components/Home/Navbar/navbar";
import EditProfile from "../Pages/edit_profile";
import EditPost from "../Components/Post_CRUD/edit_posts";
import User_Profile_Posts from "../Components/User_Posts/user_profile_posts";

//
import ProtectedRoute from "./Protected Route/protected";
import PublicRoute from "./Protected Route/public_route";

//

function AllRouters() {
  const location = useLocation();

  const hidenavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/create-post" element={<CreatePosts />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route
              path="/user_profile_posts"
              element={<User_Profile_Posts />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />

          {/* <Route path="/test" element={<Livechat_modal />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default AllRouters;

{
  /* <Route element={<ProtectedRoute />}>
          {!hidenavbar && <Navbar />}
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          ></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-post" element={<CreatePosts />} />
          <Route path="/my-posts" element={<MyPost />} />
        </Route> */
}
