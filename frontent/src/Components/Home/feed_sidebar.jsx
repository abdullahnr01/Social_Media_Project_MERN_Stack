import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ImagePlus, Settings, UserRound } from "lucide-react";
import { UserContext } from "../../Context/context";

const FeedSidebar = ({ activeItem = "" }) => {
  const navigate = useNavigate();
  const { UserInfo } = useContext(UserContext);
  const fullName = `${UserInfo?.firstname || ""} ${UserInfo?.lastname || ""}`.trim() || "Your profile";
  const profilePath = UserInfo?._id ? `/user_profile_posts?id=${UserInfo._id}` : "/home";
  const items = [
    { id: "saved", label: "Saved", path: "/saved", icon: Bookmark },
    { id: "settings", label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden space-y-4 xl:sticky xl:top-24 xl:block">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
        <div className="flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-amber-50 text-amber-600 ring-1 ring-slate-200">
            {UserInfo?.image ? (
              <img src={UserInfo.image} alt={fullName} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            ) : (
              <UserRound size={22} aria-hidden="true" />
            )}
          </span>
        </div>
        <h2 className="mt-3 truncate text-base font-bold text-slate-900">{fullName}</h2>
        <button type="button" onClick={() => navigate(profilePath)} className="mt-1 text-sm font-medium text-slate-500 transition hover:text-amber-700 focus-visible:outline-none focus-visible:underline">
          View your profile
        </button>
        <button type="button" onClick={() => navigate("/create-post")} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#fbba00] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e0a600] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200">
          <ImagePlus size={17} aria-hidden="true" /> Create a post
        </button>
      </section>

      <nav aria-label="Main navigation" className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {items.map(({ id, label, path, icon: Icon }) => (
          <button key={id} type="button" onClick={() => navigate(path)} aria-current={activeItem === id ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${activeItem === id ? "bg-amber-50 text-amber-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
            <Icon size={18} aria-hidden="true" />
            <span className="flex-1">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default FeedSidebar;
