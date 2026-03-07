import React, { useEffect, useState } from "react";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper } from "swiper/react";

export default function AppSwiper({
  children,
  speed,
  direction = "horizontal",
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "horizontal" | "vertical";
}) {
  const [slidesPerView, setSlidesPerView] = useState(1.2);

  useEffect(() => {
    function handleResize() {
      if (direction == "horizontal") {
        if (window.innerWidth > 1200) setSlidesPerView(3.4);
        else if (window.innerWidth > 600) setSlidesPerView(1.8);
        else setSlidesPerView(1.2);
      } else {
        if (window.innerWidth > 1200) setSlidesPerView(2.4);
        else if (window.innerWidth > 600) setSlidesPerView(2.3);
        else setSlidesPerView(1.3);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [direction]);

  return (
    <Swiper
      modules={[Autoplay, FreeMode]}
      slidesPerView={slidesPerView}
      spaceBetween={20}
      direction={direction}
      speed={speed ?? 6000}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      freeMode={{
        enabled: true,
        momentum: false,
      }}
      allowTouchMove={true}
      style={
        {
          "--swiper-wrapper-transition-timing-function": "linear",
          height: "100%",
        } as React.CSSProperties
      }
      loop={direction == "horizontal"}
    >
      {children}
    </Swiper>
  );
}
