import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Send } from "lucide-react";
import {
  request_password_reset_code,
  reset_password,
  verify_password_reset_code,
} from "../API layer/api";

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const result = await request_password_reset_code(normalizedEmail);
      if (!result.success) {
        setError(result.response?.message || "Unable to send a code right now.");
        return;
      }
      setEmail(normalizedEmail);
      setMessage(result.response?.message || "If an account exists for that email, a verification code has been sent.");
      setStep("code");
      setResendSeconds(60);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendSeconds > 0 || isLoading) return;
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      const result = await request_password_reset_code(email);
      if (!result.success) {
        setError(result.response?.message || "Unable to resend the code right now.");
        return;
      }
      setMessage(result.response?.message || "If an account exists for that email, a verification code has been sent.");
      setResendSeconds(60);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      const result = await verify_password_reset_code(email, code);
      if (!result.success) {
        setError(result.response?.message || "That code could not be verified.");
        return;
      }
      setResetToken(result.response.resetToken);
      setMessage(result.response.message || "Email verified. You can now set a new password.");
      setStep("password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await reset_password(email, resetToken, password);
      if (!result.success) {
        setError(result.response?.message || "Unable to reset your password right now.");
        return;
      }
      setStep("complete");
      setMessage(result.response.message || "Your password has been reset. You can now log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitle = {
    email: "Forgot your password?",
    code: "Enter your verification code",
    password: "Create a new password",
    complete: "Password updated",
  }[step];

  return (
    <main className="min-h-screen bg-[#fffaf0] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(89,65,0,0.12)] md:grid md:grid-cols-2">
        <section className="hidden bg-[#fbba00] px-10 py-12 text-white md:flex md:flex-col md:justify-between lg:px-14 lg:py-14">
          <Link to="/login" className="text-2xl font-extrabold tracking-tight">
            SocialFirst
          </Link>
          <div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              {step === "complete" ? <CheckCircle2 size={32} aria-hidden="true" /> : <Mail size={32} aria-hidden="true" />}
            </div>
            <h1 className="max-w-sm text-4xl font-bold leading-tight">Get back into your account.</h1>
            <p className="mt-4 max-w-sm text-lg text-white/90">
              Follow a few simple steps to securely reset your password and get back to your community.
            </p>
          </div>
          <p className="text-sm text-white/80">Your community is waiting for you.</p>
        </section>

        <section className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
          {step !== "complete" ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                if (step === "password") setStep("code");
                else setStep("email");
              }}
              className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-[#b78300] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fbba00]"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              {step === "email" ? "Back to login" : "Go back"}
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 transition hover:text-[#b78300] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fbba00]"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to login
            </Link>
          )}

          <div className="mx-auto mt-10 max-w-md md:mt-14">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3cc] text-[#c28c00] md:hidden">
              {step === "complete" ? <CheckCircle2 size={27} aria-hidden="true" /> : <Mail size={27} aria-hidden="true" />}
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c28c00]">Account recovery</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{stepTitle}</h2>

            {step === "email" && (
              <>
                <p className="mt-3 leading-6 text-gray-600">
                  Enter your account email address. We will send you a verification code to reset your password.
                </p>
                <form onSubmit={handleRequestCode} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="recovery-email" className="mb-2 block text-sm font-semibold text-gray-800">Email address</label>
                    <div className="relative">
                      <Mail size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="recovery-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#e5a900] focus:ring-4 focus:ring-[#fbba00]/15"
                      />
                    </div>
                  </div>
                  <button disabled={isLoading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#fbba00] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#e0a600] disabled:cursor-not-allowed disabled:opacity-70">
                    {isLoading ? "Sending..." : "Send verification code"}
                    {!isLoading && <Send size={17} aria-hidden="true" />}
                  </button>
                </form>
              </>
            )}

            {step === "code" && (
              <>
                <p className="mt-3 leading-6 text-gray-600">
                  Enter the 6-digit code sent to <span className="font-semibold text-gray-800">{email}</span>.
                </p>
                <form onSubmit={handleVerifyCode} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="verification-code" className="mb-2 block text-sm font-semibold text-gray-800">Verification code</label>
                    <input
                      id="verification-code"
                      name="code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      placeholder="000000"
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.6em] text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-[#e5a900] focus:ring-4 focus:ring-[#fbba00]/15"
                    />
                  </div>
                  <button disabled={isLoading || code.length !== 6} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#fbba00] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#e0a600] disabled:cursor-not-allowed disabled:opacity-70">
                    {isLoading ? "Verifying..." : "Verify code"}
                  </button>
                </form>
                <div className="mt-5 text-center text-sm text-gray-600">
                  Did not receive the email?{" "}
                  <button type="button" onClick={handleResendCode} disabled={isLoading || resendSeconds > 0} className="font-semibold text-[#b78300] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline">
                    {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend code"}
                  </button>
                </div>
              </>
            )}

            {step === "password" && (
              <>
                <p className="mt-3 leading-6 text-gray-600">Choose a new password with at least 8 characters.</p>
                <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-gray-800">New password</label>
                    <input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#e5a900] focus:ring-4 focus:ring-[#fbba00]/15" />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-gray-800">Confirm new password</label>
                    <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#e5a900] focus:ring-4 focus:ring-[#fbba00]/15" />
                  </div>
                  <button disabled={isLoading} type="submit" className="w-full rounded-xl bg-[#fbba00] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#e0a600] disabled:cursor-not-allowed disabled:opacity-70">
                    {isLoading ? "Saving password..." : "Save new password"}
                  </button>
                </form>
              </>
            )}

            {step === "complete" && (
              <div className="mt-5">
                <p className="leading-6 text-gray-600">Your password has been updated successfully. You can now log in with your new password.</p>
                <Link to="/login" className="mt-7 block w-full rounded-xl bg-[#fbba00] px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-[#e0a600]">Go to login</Link>
              </div>
            )}

            {message && <p role="status" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900">{message}</p>}
            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</p>}

            {step !== "complete" && (
              <p className="mt-7 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link to="/login" className="font-semibold text-[#b78300] hover:underline">Log in</Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;
