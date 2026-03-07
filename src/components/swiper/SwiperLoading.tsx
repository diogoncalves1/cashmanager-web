import { SwiperSlide } from "swiper/react";
import AppSwiper from "./AppSwiper";

function StockSkeletonSlide() {
  return (
    <div className=" grid grid-cols-12">
      <div className="col-span-6">
        <div className="animate-pulse flex w-full gap-2 flex-col">
          <div className="h-4 bg-gray-200 rounded w-25"></div>
          <div className="h-5 bg-gray-200 rounded w-13"></div>
        </div>
      </div>
      <div className="h-15 w-full col-span-6">
        <div className=" animate-pulse">
          <div className="h-13 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function SwiperLoading({
  direction = "horizontal",
}: {
  direction?: "vertical" | "horizontal";
}) {
  return (
    <AppSwiper speed={0} direction={direction}>
      {[...Array(5)].map((_, idx) => (
        <SwiperSlide
          key={idx}
          className="bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-xl border-1 text-error p-4"
        >
          <StockSkeletonSlide />
        </SwiperSlide>
      ))}
    </AppSwiper>
  );
}
