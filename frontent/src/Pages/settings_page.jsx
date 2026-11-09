import { useEffect, useState } from "react";
import {
  Check,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../Context/context";
import { update_account_privacy } from "../API layer/user_profile_api";

const SettingsPage = () => {
  const {
    UserInfo,
    setUserInfo,
    theme,
    setTheme,
  } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("theme");
  const [isPrivate, setIsPrivate] = useState(Boolean(UserInfo?.isPrivate));
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [privacyMessage, setPrivacyMessage] = useState("");
  const [privacyError, setPrivacyError] = useState("");

  useEffect(() => {
    setIsPrivate(Boolean(UserInfo?.isPrivate));
  }, [UserInfo?.isPrivate]);

  const handlePrivacyChange = async () => {
    if (savingPrivacy) return;
    const nextValue = !isPrivate;
    setSavingPrivacy(true);
    setPrivacyError("");
    setPrivacyMessage("");

    const result = await update_account_privacy(nextValue);
    if (result?.success) {
      setIsPrivate(nextValue);
      setUserInfo((previous) => ({ ...previous, isPrivate: nextValue }));
      setPrivacyMessage(nextValue ? "Your account is now private." : "Your account is now public.");
    } else {
      setPrivacyError(result?.message || "Unable to update this setting. Please try again.");
    }
    setSavingPrivacy(false);
  };

  const tabs = [
    { id: "theme", label: "Theme", icon: Sun },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7">
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-2 text-sm text-slate-600">Personalize your experience and manage who can see your posts.</p>
        </header>

        <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-7">
          <nav aria-label="Settings sections" className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:flex-col md:self-start">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={`flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition md:flex-none ${
                  activeTab === id
                    ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {activeTab === "theme" ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Choose your theme</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Select how SocialFirst looks on this device. Your choice is saved automatically.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    aria-pressed={theme === "light"}
                    onClick={() => setTheme("light")}
                    className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 ${
                      theme === "light"
                        ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-200"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-5 flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-100">
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                        <Sun size={22} className="text-amber-500" aria-hidden="true" />
                        <span className="text-sm font-semibold text-slate-700">Light</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-semibold text-slate-900">Light theme</span>
                        <span className="mt-1 block text-xs text-slate-500">Bright and clear</span>
                      </div>
                      {theme === "light" && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white"><Check size={15} aria-hidden="true" /></span>}
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-pressed={theme === "dark"}
                    onClick={() => setTheme("dark")}
                    className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 ${
                      theme === "dark"
                        ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-200"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-5 flex h-28 items-center justify-center rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-700">
                      <div className="flex items-center gap-3 rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 shadow-sm">
                        <Moon size={21} className="text-amber-300" aria-hidden="true" />
                        <span className="text-sm font-semibold text-slate-100">Dark</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-semibold text-slate-900">Dark theme</span>
                        <span className="mt-1 block text-xs text-slate-500">Comfortable in low light</span>
                      </div>
                      {theme === "dark" && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white"><Check size={15} aria-hidden="true" /></span>}
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Security</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Manage account privacy and security options.</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isPrivate ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"}`}>
                      <LockKeyhole size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-900">Private account</h3>
                      <p className="mt-0.5 text-xs leading-5 text-slate-600 sm:text-sm">
                        Only you and accepted followers can see your posts. Existing approved followers keep access.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isPrivate}
                      aria-label="Private account"
                      disabled={savingPrivacy}
                      onClick={handlePrivacyChange}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 disabled:cursor-wait disabled:opacity-60 ${isPrivate ? "bg-amber-500" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${isPrivate ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </div>

                {privacyMessage && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{privacyMessage}</p>}
                {privacyError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{privacyError}</p>}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
