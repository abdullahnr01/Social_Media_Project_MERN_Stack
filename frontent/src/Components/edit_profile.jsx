// EditProfile.jsx
import React, { useContext, useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FaUserCircle, FaTrashAlt } from "react-icons/fa";
import { UserContext } from "../Context/context";

import {
  user_update_all_info,
  user_profile_upload,
  get_user_profile_img,
} from "../API layer/api";

function EditProfile() {
  // States
  const {
    UserInfo,
    setUserInfo,
    //function
    UserInfofetch,
  } = useContext(UserContext);

  const [previewImage, setpreviewImage] = useState(null);

  useEffect(() => {
    if (UserInfo?.image) {
      setpreviewImage(UserInfo.image);
    }
  }, [UserInfo]);

  const navigate = useNavigate();

  const IntailValues = {
    firstname: UserInfo?.firstname || "",
    lastname: UserInfo?.lastname || "",
    email: UserInfo?.email || "",

    date_of_birth: UserInfo?.date_of_birth
      ? new Date(UserInfo.date_of_birth).toISOString().split("T")[0]
      : "",
    gender: UserInfo?.gender || "",
    image: UserInfo?.image || null,
  };

  const validationSchema = Yup.object({
    firstname: Yup.string()
      .trim()
      .required("First name must be required")
      .min(3, "Must be at least 3 characters")
      .matches(/^[A-Za-z]+( [A-Za-z]+)*$/, "Only alphabets allowed"),
    lastname: Yup.string()
      .trim()
      .required("Last name must be required")
      .min(3, "Must be at least 3 characters")
      .matches(/^[A-Za-z]+( [A-Za-z]+)*$/, "Only alphabets allowed"),

    email: Yup.string()
      .trim()
      .test(
        "no-leading-trailing-spaces",
        "No leading or trailing spaces allowed",
        (value) => {
          if (!value) return true;
          return value === value.trim();
        },
      )
      .required("Email must be required")
      .email("Invalid email address")
      .matches(/@gmail\.com$/, "Only @gmail.com addresses are allowed"),
    date_of_birth: Yup.date()
      .required("Date of Birth is required")
      .min(new Date(1900, 0, 1), "Date cannot be before Jan 1, 1900")
      .max(new Date(), "Date cannot be in the future"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("Select gender"),
    image: Yup.mixed()
      .nullable() // allow null
      .test(
        "fileType",
        "Only image files are allowed (jpeg, png, jpg, gif)",
        (value) => {
          if (!value) return true;

          if (typeof value === "string") return true;
          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
          ];
          return allowedTypes.includes(value.type);
        },
      )
      .test("fileSize", "Image must be less than 2MB", (value) => {
        if (!value) return true;
        if (typeof value === "string") return true;
        return value.size <= 2 * 1024 * 1024;
      }),
  });

  const handleUpdateSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log(values);

      const formData = new FormData();

      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("date_of_birth", values.date_of_birth);
      formData.append("gender", values.gender);

      if (values.image instanceof File) {
        formData.append("image", values.image);
      } else if (values.image === null) {
        formData.append("image", "delete");
      }
      const { success, response, status } =
        await user_update_all_info(formData);
      if (status === 401) {
        navigate("/login");
        return;
      }

      if (success) {
        console.log(response?.data.user_updateInfo);
        setUserInfo(response?.data.user_updateInfo);
      }
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Profile
        </h1>

        {/* Form */}
        <Formik
          initialValues={IntailValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values, action) => {
            handleUpdateSubmit(values, action);
          }}
        >
          {({ isSubmitting, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group w-32 h-32">
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-sm"
                      />

                      {/* Delete icon (hover par) */}
                      <button
                        type="button"
                        onClick={() => {
                          setpreviewImage(null);
                          setFieldValue("image", null);
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white 
                   w-7 h-7 rounded-full flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition"
                        title="Remove image"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </>
                  ) : (
                    <FaUserCircle className="w-32 h-32 text-[#a7a8a8] border border-gray-300 shadow-sm rounded-full" />
                  )}

                  {/* Camera icon */}
                  <label
                    htmlFor="fileInput"
                    className="absolute bottom-0 right-0 bg-white border border-gray-500 
               text-gray-700 w-9 h-9 rounded-full cursor-pointer 
               hover:bg-gray-100 flex items-center justify-center shadow"
                  >
                    📷
                  </label>

                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (!file.type.startsWith("image/")) return;

                      setFieldValue("image", file);
                      setpreviewImage(URL.createObjectURL(file));
                    }}
                  />
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Click the camera to change photo
                </p>
              </div>

              {/* First & Last name row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <Field
                    name="firstname"
                    placeholder="Enter first name"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#fbba00]"
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value === " ") return;
                      value = value.replace(/\s{2,}/g, " ");
                      setFieldValue("firstname", value);
                    }}
                  />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <Field
                    name="lastname"
                    placeholder="Enter last name"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#fbba00]"
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value === " ") return;
                      value = value.replace(/\s{2,}/g, " ");
                      setFieldValue("lastname", value);
                    }}
                  />
                  <ErrorMessage
                    name="lastname"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  disabled
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of birth
                </label>
                <Field
                  name="date_of_birth"
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#fbba00]"
                />
                <ErrorMessage
                  name="date_of_birth"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Gender radios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Field
                      type="radio"
                      name="gender"
                      value="male"
                      className="h-4 w-4 accent-[#fbba00]"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Field
                      type="radio"
                      name="gender"
                      value="female"
                      className="h-4 w-4 accent-[#fbba00]"
                    />
                    Female
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Field
                      type="radio"
                      name="gender"
                      value="other"
                      className="h-4 w-4 accent-[#fbba00]"
                    />
                    Other
                  </label>
                </div>

                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-sm text-red-500 mt-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-4 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md font-semibold transition ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#fbba00] opacity-100 hover:opacity-90 cursor-pointer text-white"
                  }`}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="py-2 px-4 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditProfile;
