import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { UserContext } from "../../../Context/context";
import { delete_post_data } from "../../../API layer/api";
import User_Save_Btn from "./user_save_btn";

const User_menu_button = ({ post, onSavedChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { setSinglePost_data, UserInfo, setAllPosts } = useContext(UserContext);
  const ownsPost = String(UserInfo?._id) === String(post?.user_id);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      if (deleteDialogOpen && !isDeleting) setDeleteDialogOpen(false);
      else setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [deleteDialogOpen, isDeleting]);

  const handlePostEdit = () => {
    setSinglePost_data(post);
    setMenuOpen(false);
    navigate(`/edit-post/${post._id}`);
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await delete_post_data(post._id);
      if (result?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (result?.success) {
        setAllPosts((previous) => previous.filter((item) => item._id !== post._id));
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Delete post error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div ref={menuRef} className="relative z-30 shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open post options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 ${
            menuOpen
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200/80 bg-white/95 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
          }`}
        >
          <MoreHorizontal size={21} strokeWidth={2.4} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            aria-label="Post options"
            className="absolute right-0 top-12 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.18)] ring-1 ring-black/5"
          >
            {ownsPost && (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handlePostEdit}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-amber-50 focus-visible:bg-amber-50 focus-visible:outline-none"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Pencil size={17} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">Edit post</span>
                </button>
                <div className="mx-3 my-1 h-px bg-slate-100" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setDeleteDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <Trash2 size={17} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-red-700">Delete post</span>
                </button>
                <div className="mx-3 my-1 h-px bg-slate-100" />
              </>
            )}
            <User_Save_Btn
              postId={post._id}
              isSaved={post.isSaved}
              variant="menu"
              onSavedChange={(saved) => {
                setMenuOpen(false);
                onSavedChange?.(saved);
              }}
            />
          </div>
        )}
      </div>

      {deleteDialogOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setDeleteDialogOpen(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-post-title"
            aria-describedby="delete-post-description"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex items-start justify-between px-6 pb-2 pt-6 sm:px-7 sm:pt-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
                <Trash2 size={22} aria-hidden="true" />
              </div>
              <button
                type="button"
                aria-label="Close confirmation"
                disabled={isDeleting}
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 pb-6 sm:px-7 sm:pb-7">
              <h2 id="delete-post-title" className="text-xl font-bold tracking-tight text-slate-900">Delete this post?</h2>
              <p id="delete-post-description" className="mt-2 text-sm leading-6 text-slate-600">
                This will remove the post from your feed and profile. This action cannot be undone.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteDialogOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeletePost}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:cursor-wait disabled:opacity-70"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    "Delete post"
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default User_menu_button;
