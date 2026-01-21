import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
//
import CreatePosts from "../Components/create_posts";
import Home from "../Components/Home";
import Login from "../Components/login";
import SignUp from "../Components/signup";
import Navbar from "../Components/Navbar";
import EditProfile from "../Components/edit_profile";
import MyPost from "../Components/my_posts";

//
import ProtectedRoute from "../Protected Route/protected";
import PublicRoute from "../Protected Route/public_route";
//
import { useContext } from "react";
import { UserContext } from "../Context/context";
import { useEffect } from "react";

function AllRouters() {
  const location = useLocation();

  const hidenavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hidenavbar && <Navbar />}
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-post" element={<CreatePosts />} />
          <Route path="/my-posts" element={<MyPost/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default AllRouters;
