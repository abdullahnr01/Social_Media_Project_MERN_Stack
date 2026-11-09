import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";

const Main_Media = ({ post }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaItems = Array.isArray(post?.image) ? post.image : [];

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || "");
  };

  return (
    <div>
      {post?.description && (
        <div className="px-4 pb-3 pt-2 sm:px-5">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.description}</p>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className="relative w-full overflow-hidden bg-slate-100">
          {mediaItems.length > 1 && (
            <div className="absolute right-3 top-3 z-20 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
              {activeIndex + 1} / {mediaItems.length}
            </div>
          )}

          <Swiper
            modules={mediaItems.length > 1 ? [Pagination] : []}
            pagination={mediaItems.length > 1 ? { clickable: true } : false}
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full"
          >
            {mediaItems.map((media, index) => (
              <SwiperSlide key={`${media}-${index}`}>
                {isVideo(media) ? (
                  <video
                    src={media}
                    controls
                    className="max-h-[560px] w-full bg-black object-contain"
                  />
                ) : (
                  <img
                    src={media}
                    alt={`${post?.title || "Post"} media ${index + 1}`}
                    className="max-h-[560px] w-full object-contain"
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      </div>
  );
};

export default Main_Media;
