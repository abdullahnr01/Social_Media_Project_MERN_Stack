import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";

const Main_Media = ({ post }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!post?.image || post.image.length === 0) {
    return null;
  }

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div>
      <p className="text-gray-700 text-sm leading-relaxed mb-4 max-h-32 overflow-y-auto pl-5">
        {post.description}
      </p>

      {/* <img
        src={`${post.image[0]}`}
        alt={"Main Image"}
        className="w-full h-74 object-cover mb-1"
      /> */}

      <div className="w-full relative">
        {post.image.length > 1 && (
          <div
            className="absolute top-3 right-3 z-20 flex items-center justify-center 
                bg-black/60 text-white text-sm font-medium 
                px-3 py-1 rounded-full shadow-md select-none"
          >
            {activeIndex + 1}/{post.image.length}
          </div>
        )}

        <Swiper
          modules={post.image.length > 1 ? [Pagination] : []}
          pagination={post.image.length > 1 ? { clickable: true } : false}
          spaceBetween={10}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full"
        >
          {post.image.map((media, index) => (
            <SwiperSlide key={index}>
              {isVideo(media) ? (
                <video
                  src={media}
                  controls
                  className="w-full max-h-[400px] object-cover"
                />
              ) : (
                <img
                  src={media}
                  alt={`media-${index}`}
                  className="w-full max-h-[400px] object-cover"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Main_Media;
