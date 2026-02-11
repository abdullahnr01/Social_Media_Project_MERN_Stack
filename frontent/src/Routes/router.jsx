import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
//
import CreatePosts from "../Components/create_posts";
import Home from "../Components/Home";
import Login from "../Components/auth/login";
import SignUp from "../Components/auth/signup";
import Navbar from "../Components/Navbar";
import EditProfile from "../Components/edit_profile";
import MyPost from "../Components/my_posts";

//
import ProtectedRoute from "../Protected Route/protected";
import PublicRoute from "../Protected Route/public_route";
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

        {/* <Route element={<ProtectedRoute />}>
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
        </Route> */}

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
            <Route path="/my-posts" element={<MyPost />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default AllRouters;
