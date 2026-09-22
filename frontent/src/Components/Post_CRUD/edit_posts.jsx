import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/context";
import {
  user_edit_post_API,
  get_single_post_API,
} from "../../API layer/user_post_api";
import PostBasic from "./Post_basic";

function EditPost() {
  const navigate = useNavigate();
  const { singlePost_data = {}, setSinglePost_data } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchSinglePost = async () => {
      if (!singlePost_data || Object.keys(singlePost_data).length === 0) {
        const { success, response, status } = await get_single_post_API(id);
        if (success) {
          setSinglePost_data(response?.data?.data);
        }
      }
    };

    fetchSinglePost();
  }, [id]);

  const EditPostSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log(values);
      const Editformdata = new FormData();
      Editformdata.append("title", values.title);
      Editformdata.append("description", values.description);
      Editformdata.append("hashtags", values.hashtags);
      if (values.image && values.image.length > 0) {
        values.image.forEach((img) => {
          if (img instanceof File) {
            Editformdata.append("image", img);
          }
        });
      }

      const existingImages = values.image.filter(
        (img) => typeof img === "string",
      );

      Editformdata.append("existingImages", JSON.stringify(existingImages));

      //

      console.log(Editformdata);

      const { success, status, response } = await user_edit_post_API(
        id,
        Editformdata,
      );

      if (status === 401) {
        navigate("/login");
        return;
      }
      if (success) {
        resetForm();
        // setAllPostsAgain((prev) => !prev);
        navigate("/home");
      }
    } catch (err) {
      console.error("Runtime error:", err);
      toast.error("Internal server error.Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
            Edit Post
          </h2>
          {singlePost_data && Object.keys(singlePost_data).length > 0 && (
            <PostBasic
              initialValues={{
                title: singlePost_data.title || "",
                description: singlePost_data.description || "",
                image: singlePost_data.image || [],
                hashtags: singlePost_data.hashtags || "",
              }}
              isEditingMode={true}
              onSubmit={EditPostSubmit}
              buttonText="Update Post"
              existingMedia={singlePost_data?.image || []}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default EditPost;
