// built In
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useContext, useEffect } from "react";

// local
import { UserContext } from "../Context/context";
import { user_login_in, GoogleCredential_Login_API } from "../API layer/api";

// 473953610284-4e4ksvrtu7iurv7rqv7qu0oq3g9fted8.apps.googleusercontent.com

function Login() {
  // Global States
  const { credentials, setCredentials, UserInfofetch } =
    useContext(UserContext);

  // Local States
  const [showPassword, setShowPassword] = useState(false);

  // Other
  const navigate = useNavigate();

  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "473953610284-4e4ksvrtu7iurv7rqv7qu0oq3g9fted8.apps.googleusercontent.com",
      callback: handle_GoogleCredential_Login,
    });

    google.accounts.id.renderButton(document.getElementById("googleBtn"), {
      theme: "outline",
      size: "large",
      text: "continue_with",
    });
  }, []);

  const handle_GoogleCredential_Login = async (data) => {
    console.log("Response Token", data);

    const { success, response, status } =
      await GoogleCredential_Login_API(data);

    if (success) {
      setTimeout(() => navigate("/home"), 500);
    }
  };

  const validationSchema = Yup.object({
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
    password: Yup.string()
      .trim()
      .required("Password must be required")
      .min(6, "Minimum 6 characters")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter"),
    // role: Yup.string().required("Please select a role"),
  });

  // functions
  const handleLoginSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const { success, response, status } = await user_login_in(values);
      if (success) {
        resetForm();
        setCredentials({ email: "", password: "" });
        setTimeout(() => navigate("/home"), 500);
      
      }
    } catch (err) {
      console.error("Runtime error:", err);
      toast.error(err.response?.data?.message);
    } finally {
      setTimeout(() => setSubmitting(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section (75%) */}
      <div className="w-[60%]  bg-[#fbba00] flex flex-col justify-center items-center text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Connect with SocialFirst</h1>
        <p className="text-lg max-w-md text-center">
          Join the community, connect with friends, and explore new
          possibilities with our platform.
        </p>
        {/* Extra professional touch: illustration or icon */}
        <div className="mt-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="Community"
            className="w-32 h-32 invert brightness-0"
          />
        </div>
      </div>

      {/* Right Section (25%) */}
      <div className="w-[40%] flex items-center justify-center bg-white shadow-lg">
        <div className="w-full max-w-[410px] p-8 border border-gray-300 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.15)]">
          <h2 className="text-[#fbba00] text-2xl font-semibold text-center mb-6">
            Login SocialFirst
          </h2>

          <Formik
            initialValues={{
              email: credentials?.email || "",
              password: credentials?.password || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, action) => {
              handleLoginSubmit(values, action);
            }}
          >
            {({ isSubmitting, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <label className="block mb-1 text-sm font-bold text-[#fbba00]">
                  Email:
                </label>
                <Field
                  name="email"
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#fbba00] mb-2"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />

                {/* Password */}
                <label className="block mt-5 mb-1 text-sm font-bold text-[#fbba00]">
                  Password:
                </label>
                <div className="relative w-full">
                  <Field
                    name="password"
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#fbba00] mb-2"
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s+/g, "");
                      setFieldValue("password", value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-[#fbba00] text-lg"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />

                {/* Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-6 rounded-md mt-3 font-medium 
                  ${
                    isSubmitting
                      ? "bg-gray-500 text-white cursor-not-allowed opacity-70"
                      : "bg-[#fbba00] text-white cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Login..." : "Login"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">OR</span>
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>

                {/* Google Button */}
                <div className="w-full flex justify-center">
                  <div id="googleBtn" className="w-full max-w-[330px]"></div>
                </div>

                {/* Footer */}
                <p className="text-black text-sm mt-4 text-center">
                  Do not have an account?{" "}
                  <Link
                    to="/signup"
                    onClick={() => setCredentials({ email: "", password: "" })}
                    className="underline text-[#fbba00]"
                  >
                    SignUp
                  </Link>
                </p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
