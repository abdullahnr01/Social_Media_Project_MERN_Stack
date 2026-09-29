import React from "react";
import { MoreVertical, Phone, Video, Image as ImageIcon } from "lucide-react";
export const Action_Header = () => {
  return (
    <div className="flex items-center gap-1 text-slate-600">
      <button className="p-2 hover:bg-slate-100 rounded-full transition">
        <Phone size={18} />
      </button>
      <button className="p-2 hover:bg-slate-100 rounded-full transition">
        <Video size={18} />
      </button>
      <button className="p-2 hover:bg-slate-100 rounded-full transition">
        <MoreVertical size={18} />
      </button>
    </div>
  );
};
