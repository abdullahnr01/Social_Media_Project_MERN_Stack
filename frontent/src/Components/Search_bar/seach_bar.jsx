import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner, FaTimes } from "react-icons/fa";
import { getSearchUserProfile } from "../../API layer/user_search_api";
import { useLocation, useNavigate } from "react-router-dom";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await getSearchUserProfile(searchTerm);
        if (response?.success) {
          setResults(response.response.data.Users_Ids || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const HandleGoToUserProfile = (id) => {
    navigate(`/user_profile_posts?id=${id}`);
  };

  return (
    <>
      <div ref={searchRef} className="relative max-w-lg flex-1">
        {/* Search Input Box */}
        <div className="relative flex items-center">
          {/* Left Search Icon */}
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim() && setIsOpen(true)}
            placeholder="Search users..."
            className="w-full rounded-full px-4 py-2 pl-10 pr-16 border border-white bg-white bg-opacity-20 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white focus:border-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />

          {/* Right Side Icons Flex Box */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {/* 1. Loader (Close Icon ke Left Side Par Dikhega) */}
            {loading && (
              <FaSpinner className="animate-spin text-[#d9a000] text-base" />
            )}

            {/* 2. Close/Clear Icon (Full End Right Par Dikhega) */}
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setResults([]);
                  setIsOpen(false);
                }}
                className="text-black hover:opacity-70 focus:outline-none flex items-center"
              >
                <FaTimes className="text-base" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Results Dropdown UI */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50">
            {results.length > 0 ? (
              results.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setIsOpen(false);
                    HandleGoToUserProfile(user._id);
                    setSearchTerm("")
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-none"
                >
                  <img
                    src={user.image || "https://via.placeholder.com/40"}
                    alt={user.firstname}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {user.firstname} {user.lastname}
                    </h4>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No users found.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;

{
  /* <div className="relative max-w-lg flex-1">
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-full px-4 py-2 pl-10 border border-white bg-white bg-opacity-20 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black opacity-80" />
      </div> */
}
