import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useContext } from "react";

// local
import { UserContext } from "../../Context/context";
import { user_sign_up } from "../../API layer/api";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const navigate = useNavigate();
  const { setCredentials } = useContext(UserContext);

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

    date_of_birth: Yup.date()
      .required("Date of Birth is required")
      .min(new Date(1900, 0, 1), "Date cannot be before Jan 1, 1900")
      .max(new Date(), "Date cannot be in the future"),

    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("Select gender"),
    email: Yup.string()
      .trim()
      .test(
        "no-leading-trailing-spaces",
        "No leading or trailing spaces allowed",
        (value) => {
          if (!value) return true;
          return value === value.trim();
        }
      )
      .required("Email must be required")
      .email("Invalid email address")
      .matches(/@gmail\.com$/, "Only @gmail.com addresses are allowed"),
    password: Yup.string()
      .trim()
      .required("Password must be required")
      .min(6, "Minimum 6 characters")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter"),

    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password do not match")
      .required("Confirm password is required"),
  });

  const handleSignUpSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const { success, status, response } = await user_sign_up(values);

      if (status === 401) {
        navigate("/login");
        return;
      }
      if (success) {
        resetForm();
        navigate("/login");
      }
      // catch handling
    } catch (err) {
      console.error("Runtime error:", err);
      toast.error("Internal error. Please try again");
      // ye toast taab chalee ga jaab na koi server or network me koi b issue ni hai
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col  bg-[#fbba00]">
        <div className="w-full p-6">
          <h1 className="text-3xl font-bold text-white">SocialFirst</h1>
        </div>

        <div className="flex-grow flex items-center justify-center mb-10">
          <div className="w-full max-w-[420px] mx-auto mt-8 p-6 border border-gray-300 rounded-lg font-sans bg-white">
            <h2 className="text-[#fbba00] mt-0 mb-8 text-center text-2xl font-bold">
              SignUp
            </h2>
            <Formik
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
                date_of_birth: "",
                gender: "",
                password: "",
                confirmpassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, action) => {
                setCredentials({
                  email: values.email,
                  password: values.password,
                });
                handleSignUpSubmit(values, action);
              }}
            >
              {({ isSubmitting, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  {/* First Name */}
                  <label className="block mb-1 mt-2 text-sm font-bold text-[#fbba00]">
                    First Name:
                  </label>
                  <Field
                    name="firstname"
                    placeholder="Enter first name"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2 focus:outline-none focus:border-[#fbba00]"
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value === " ") return;
                      value = value.replace(/\s{2,}/g, " ");
                      setFieldValue("firstname", value);
                    }}
                  />
                  <ErrorMessage
                    name="firstname"
                    component="p"
                    className="text-red-500 text-sm "
                  />

                  {/* Last Name */}
                  <label className="block mb-1 mt-3 text-sm font-bold text-[#fbba00]">
                    Last Name:
                  </label>
                  <Field
                    name="lastname"
                    placeholder="Enter last name"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2 focus:outline-none focus:border-[#fbba00]"
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value === " ") return;
                      value = value.replace(/\s{2,}/g, " ");
                      setFieldValue("lastname", value);
                    }}
                  />
                  <ErrorMessage
                    name="lastname"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  <label className="block mb-1 mt-3 text-sm font-bold text-[#fbba00]">
                    Date of Birth:
                  </label>
                  <Field
                    name="date_of_birth"
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-4 focus:outline-none focus:border-[#fbba00]"
                  />
                  <ErrorMessage
                    name="date_of_birth"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  <label className="block mb-1 text-sm mt-3 font-bold text-[#fbba00]">
                    Gender:
                  </label>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                      <Field
                        type="radio"
                        name="gender"
                        value="male"
                        className="accent-[#fbba00]"
                      />
                      Male
                    </label>

                    <label className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                      <Field
                        type="radio"
                        name="gender"
                        value="female"
                        className="accent-[#fbba00]"
                      />
                      Female
                    </label>

                    <label className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                      <Field
                        type="radio"
                        name="gender"
                        value="other"
                        className="accent-[#fbba00]"
                      />
                      Other
                    </label>
                  </div>
                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                  {/* Email */}
                  <label className="block mb-1 mt-3  text-sm font-bold text-[#fbba00]">
                    Email:
                  </label>
                  <Field
                    name="email"
                    placeholder="Enter email"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2 focus:outline-none focus:border-[#fbba00]"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  {/* Password */}
                  <label className="block mb-1 text-sm font-bold text-[#fbba00] mt-3">
                    Password:
                  </label>
                  <div className="relative w-full">
                    <Field
                      name="password"
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2 focus:outline-none focus:border-[#fbba00]"
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/\s+/g, "");
                        setFieldValue("password", value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 hover:text-[#fbba00]"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  {/* Confirm Password */}
                  <label className="block mb-1 text-sm font-bold text-[#fbba00] mt-3">
                    Confirm Password:
                  </label>
                  <div className="relative w-full ">
                    <Field
                      name="confirmpassword"
                      placeholder="Enter confirm password"
                      type={showPassword2 ? "text" : "password"}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#fbba00] mb-2"
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/\s+/g, "");
                        setFieldValue("confirmpassword", value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2((prev) => !prev)}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 hover:text-[#fbba00]"
                    >
                      {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmpassword"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#fbba00] text-white py-2 px-6 rounded-md mt-3 hover:border hover:border-white cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </Formik>

            {/* Already have an account */}
            <p className="text-black mt-4 text-center">
              Already have an account ?{" "}
              <Link to="/login" className="underline text-[#fbba00]">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
