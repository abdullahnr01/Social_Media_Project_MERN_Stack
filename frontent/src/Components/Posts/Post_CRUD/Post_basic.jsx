import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";

import { postValidationSchema } from "./Validation/post_validation";

function PostBasic({
  initialValues,
  onSubmit,
  buttonText,
  existingMedia = [],
  isEditingMode,
}) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (existingMedia.length > 0) {
      const formatted = existingMedia.map((url) => ({
        url: url,
        type: url.includes(".mp4") ? "video" : "image",
      }));

      setPreviews(formatted);
    }
  }, [existingMedia]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={postValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize={isEditingMode}
      >
        {({ setFieldValue, handleSubmit, isSubmitting, values }) => (
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

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Media Upload:
              </label>

              {/* File Input */}
              <input
                type="file"
                id="fileUpload"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                  const files = Array.from(event.target.files);

                  setFieldValue("image", [...values.image, ...files]);

                  const previewUrls = files.map((file) => ({
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith("video") ? "video" : "image",
                  }));

                  setPreviews((prev) => [...prev, ...previewUrls]);
                }}
              />

              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#fbba00] hover:bg-yellow-50 transition"
              >
                <span className="text-gray-500">
                  Click to upload or drag & drop
                </span>
                <span className="text-sm text-gray-400 mt-1">
                  PNG, JPG, MP4 (Multiple allowed)
                </span>
              </label>

              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm mt-1"
              />

              {previews.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {previews.length} file(s) selected
                </p>
              )}

              {/* Preview */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previews.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      {/* Delete Icon */}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                        onClick={() => {
                          // Remove from previews
                          setPreviews((prev) =>
                            prev.filter((_, i) => i !== index),
                          );

                          // Remove from Formik field
                          setFieldValue(
                            "image",
                            values.image.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        ✕
                      </button>

                      {/* Preview */}
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt={`preview-${index}`}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <video
                          src={file.url}
                          className="w-full h-32 object-cover"
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              {isSubmitting ? "Processing..." : buttonText}
            </button>
          </form>
        )}
      </Formik>
    </>
  );
}

export default PostBasic;
