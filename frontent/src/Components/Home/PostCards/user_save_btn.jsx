import { useContext, useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { UserContext } from "../../../Context/context";
import { save_post_API, unsave_post_API } from "../../../API layer/user_post_api";

const User_Save_Btn = ({ postId, isSaved: initialSaved = false, onSavedChange, variant = "action" }) => {
  const { setAllPosts } = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(Boolean(initialSaved));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsSaved(Boolean(initialSaved));
  }, [initialSaved, postId]);

  const handleToggleSaved = async () => {
    if (saving) return;
    setSaving(true);
    const result = isSaved ? await unsave_post_API(postId) : await save_post_API(postId);

    if (result?.success) {
      const nextSavedState = !isSaved;
      setIsSaved(nextSavedState);
      setAllPosts((posts) => posts.map((post) =>
        post._id === postId ? { ...post, isSaved: nextSavedState } : post,
      ));
      onSavedChange?.(nextSavedState);
    }
    setSaving(false);
  };

  if (variant === "menu") {
    return (
      <button
        type="button"
        role="menuitem"
        aria-pressed={isSaved}
        disabled={saving}
        onClick={handleToggleSaved}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-amber-50 focus-visible:bg-amber-50 focus-visible:outline-none disabled:opacity-60"
      >
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isSaved ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
          <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-slate-800">{isSaved ? "Remove from Saved" : "Save post"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove post from Saved" : "Save post"}
      disabled={saving}
      onClick={handleToggleSaved}
      className={`flex min-w-20 flex-col items-center gap-1.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-60 ${isSaved ? "text-amber-700" : "text-slate-500"}`}
    >
      <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
      <span className="text-xs">{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default User_Save_Btn;
