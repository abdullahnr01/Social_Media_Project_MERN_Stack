import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { user_post_data } from "../API layer/api";
import { useContext } from "react";
import { UserContext } from "../Context/context";
import { useNavigate } from "react-router-dom";

function CreatePosts() {
  const navigate = useNavigate();
  const { setAllPostsAgain } = useContext(UserContext);
  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .required("Title is required")
      .min(3, "Must be at least 3 characters")
      .max(50, "Title cannot be longer than 50 characters"),
    description: Yup.string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(250, "Description cannot be longer than 250 characters")
      .required("Description is required"),

    image: Yup.mixed().required("Image is required"),
    hashtags: Yup.string().required("At least one hashtag is required"),
  });

  const CreatePostSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      //
      const postformdata = new FormData();
      postformdata.append("title", values.title);
      postformdata.append("description", values.description);
      postformdata.append("hashtags", values.hashtags);
      if (values.image) {
        postformdata.append("image", values.image);
      }
      //

      const { success, status, response } = await user_post_data(postformdata);

      if (status === 401) {
        navigate("/login");
        return;
      }
      if (success) {
        resetForm();
        setAllPostsAgain((prev) => !prev);
        navigate("/home");
      }
    } catch (err) {
      console.error("Runtime error:", err);
      toast.error("Internal error.Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.25)] p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Create Post
      </h2>

      <Formik
        initialValues={{ title: "", description: "", image: "", hashtags: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          console.log("Form Data:", values);
          CreatePostSubmit(values, actions);
        }}
      >
        {({ setFieldValue, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Title:
              </label>
              <Field
                type="text"
                name="title"
                placeholder="Enter post title"
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === " ") return;
                  value = value.replace(/\s{2,}/g, " ");
                  setFieldValue("title", value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fbba00]
outline-none"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Description:
              </label>
              <Field
                as="textarea"
                name="description"
                rows="4"
                placeholder="Write something..."
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === " ") return;
                  value = value.replace(/\s{2,}/g, " ");
                  setFieldValue("description", value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fbba00] outline-none resize-none"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Upload Image:
              </label>
              <input
                type="file"
                name="image"
                onChange={(event) =>
                  setFieldValue("image", event.target.files[0])
                }
                className="w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer 
                file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg 
                file:bg-[#fbba00] file:text-white"
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Hashtags */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Hashtags:
              </label>
              <Field
                type="text"
                name="hashtags"
                placeholder="Enter hashtags"
                onChange={(e) => {
                  let value = e.target.value;
                  if (value === " ") return;
                  value = value.replace(/\s{2,}/g, " ");
                  setFieldValue("hashtags", value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fbba00] outline-none"
              />
              <ErrorMessage
                name="hashtags"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-lg font-medium transition-colors cursor-pointer
    ${
      isSubmitting
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : "bg-[#fbba00] text-white hover:bg-[#e6a700]"
    }
  `}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePosts;
