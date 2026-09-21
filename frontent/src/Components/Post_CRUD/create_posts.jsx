import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/context";
import { user_post_API } from "../../API layer/user_post_api";
import PostBasic from "./Post_basic";

function CreatePosts() {
 
  const navigate = useNavigate();
  const { setAllPostsAgain } = useContext(UserContext);

 

  const CreatePostSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      //
      console.log(values)
      const postformdata = new FormData();
      postformdata.append("title", values.title);
      postformdata.append("description", values.description);
      postformdata.append("hashtags", values.hashtags);
      if (values.image && values.image.length > 0) {
        values.image.forEach((file) => {
          postformdata.append("image", file);
        });
      }

      //

      const { success, status, response } = await user_post_API(postformdata);

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
      toast.error("Internal error.Please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Create Post
        </h2>

        <PostBasic
          initialValues={{
            title: "",
            description: "",
            image: [],
            hashtags: "",
          }}
          onSubmit={CreatePostSubmit}
          buttonText="Upload Post"
        />
      </div>
    </div>
  );

  //   return (
  //     <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.25)] p-6 mb-16">
  //       <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
  //         Create Post
  //       </h2>

  //       <Formik
  //         initialValues={{ title: "", description: "", image: [], hashtags: "" }}
  //         validationSchema={postValidationSchema}
  //         onSubmit={(values, actions) => {
  //           console.log("Form Data:", values);
  //           CreatePostSubmit(values, actions);
  //         }}
  //       >
  //         {({ setFieldValue, handleSubmit, isSubmitting, values }) => (
  //           <form onSubmit={handleSubmit}>
  //             {/* Title */}
  //             <div className="mb-4">
  //               <label className="block text-gray-700 font-medium mb-1">
  //                 Title:
  //               </label>
  //               <Field
  //                 type="text"
  //                 name="title"
  //                 placeholder="Enter post title"
  //                 onChange={(e) => {
  //                   let value = e.target.value;
  //                   if (value === " ") return;
  //                   value = value.replace(/\s{2,}/g, " ");
  //                   setFieldValue("title", value);
  //                 }}
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fbba00]
  // outline-none"
  //               />
  //               <ErrorMessage
  //                 name="title"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-2"
  //               />
  //             </div>

  //             {/* Description */}
  //             <div className="mb-4">
  //               <label className="block text-gray-700 font-medium mb-1">
  //                 Description:
  //               </label>
  //               <Field
  //                 as="textarea"
  //                 name="description"
  //                 rows="4"
  //                 placeholder="Write something..."
  //                 onChange={(e) => {
  //                   let value = e.target.value;
  //                   if (value === " ") return;
  //                   value = value.replace(/\s{2,}/g, " ");
  //                   setFieldValue("description", value);
  //                 }}
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fbba00] outline-none resize-none"
  //               />
  //               <ErrorMessage
  //                 name="description"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-1"
  //               />
  //             </div>

  //             {/* Image Upload */}
  //             {/* <div className="mb-4">
  //               <label className="block text-gray-700 font-medium mb-1">
  //                 Upload Image:
  //               </label>
  //               <input
  //                 type="file"
  //                 name="image"
  //                 onChange={(event) =>
  //                   setFieldValue("image", event.target.files[0])
  //                 }
  //                 className="w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer
  //                 file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg
  //                 file:bg-[#fbba00] file:text-white"
  //               />
  //               <ErrorMessage
  //                 name="image"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-1"
  //               />
  //             </div> */}

  //             <div className="mb-4">
  //               <label className="block text-gray-700 font-medium mb-1">
  //                 Media Upload:
  //               </label>

  //               {/* File Input */}
  //               <input
  //                 type="file"
  //                 id="fileUpload"
  //                 multiple
  //                 accept="image/*,video/*"
  //                 className="hidden"
  //                 onChange={(event) => {
  //                   const files = Array.from(event.target.files);

  //                   setFieldValue("image", [...values.image, ...files]);

  //                   const previewUrls = files.map((file) => ({
  //                     url: URL.createObjectURL(file),
  //                     type: file.type.startsWith("video") ? "video" : "image",
  //                   }));

  //                   setPreviews((prev) => [...prev, ...previewUrls]);
  //                 }}
  //               />

  //               <label
  //                 htmlFor="fileUpload"
  //                 className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#fbba00] hover:bg-yellow-50 transition"
  //               >
  //                 <span className="text-gray-500">
  //                   Click to upload or drag & drop
  //                 </span>
  //                 <span className="text-sm text-gray-400 mt-1">
  //                   PNG, JPG, MP4 (Multiple allowed)
  //                 </span>
  //               </label>

  //               <ErrorMessage
  //                 name="image"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-1"
  //               />

  //               {previews.length > 0 && (
  //                 <p className="text-sm text-green-600 mt-2">
  //                   {previews.length} file(s) selected
  //                 </p>
  //               )}

  //               {/* Preview */}
  //               {previews.length > 0 && (
  //                 <div className="mt-4 grid grid-cols-3 gap-4">
  //                   {previews.map((file, index) => (
  //                     <div
  //                       key={index}
  //                       className="border rounded-lg overflow-hidden"
  //                     >
  //                       {file.type === "image" ? (
  //                         <img
  //                           src={file.url}
  //                           alt={`preview-${index}`}
  //                           className="w-full h-32 object-cover"
  //                         />
  //                       ) : (
  //                         <video
  //                           src={file.url}
  //                           className="w-full h-32 object-cover"
  //                           controls
  //                         />
  //                       )}
  //                     </div>
  //                   ))}
  //                 </div>
  //               )}
  //             </div>

  //             {/* Hashtags */}
  //             <div className="mb-4">
  //               <label className="block text-gray-700 font-medium mb-1">
  //                 Hashtags:
  //               </label>
  //               <Field
  //                 type="text"
  //                 name="hashtags"
  //                 placeholder="Enter hashtags"
  //                 onChange={(e) => {
  //                   let value = e.target.value;
  //                   if (value === " ") return;
  //                   value = value.replace(/\s{2,}/g, " ");
  //                   setFieldValue("hashtags", value);
  //                 }}
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fbba00] outline-none"
  //               />
  //               <ErrorMessage
  //                 name="hashtags"
  //                 component="div"
  //                 className="text-red-500 text-sm mt-1"
  //               />
  //             </div>

  //             {/* Submit Button */}
  //             <button
  //               type="submit"
  //               disabled={isSubmitting}
  //               className={`w-full py-2 rounded-lg font-medium transition-colors cursor-pointer
  //     ${
  //       isSubmitting
  //         ? "bg-gray-400 text-gray-200 cursor-not-allowed"
  //         : "bg-[#fbba00] text-white hover:bg-[#e6a700]"
  //     }
  //   `}
  //             >
  //               {isSubmitting ? "Posting..." : "Post"}
  //             </button>
  //           </form>
  //         )}
  //       </Formik>
  //     </div>
  //   );
}

export default CreatePosts;
