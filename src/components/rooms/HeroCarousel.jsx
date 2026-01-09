import React, { useRef } from "react"
import { Carousel, ConfigProvider } from "antd"
import { BubbleChevronLeft, BubbleChevronRight } from "@/components/ui/button"

const HeroCarousel = ({ slides }) => {
  const carouselRef = useRef(null)

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const handleNext = () => {
    carouselRef.current?.next()
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            dotWidth: 8,
            dotHeight: 8,
            dotActiveWidth: 24, // Elongated active dot
          },
        },
      }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group">
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={5000}
          effect="fade"
          dots={{ className: "carousel-dots" }}
          className="rounded-3xl overflow-hidden"
        >
          {slides?.map((slide, idx) => (
            <div key={idx} className="relative h-[260px] w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]">
                <div className="inline-flex flex-col gap-3 rounded-2xl bg-black/45 px-6 py-4 backdrop-blur-[2px] w-fit">
                  <p className="text-lg font-semibold uppercase">
                    {slide.title}
                  </p>
                  <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5c518] px-5 py-2 text-sm font-semibold text-[#990011] shadow hover:bg-[#ffe066] transition-colors">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Custom Navigation Buttons - Overlaid */}
        <div className="absolute left-3 top-3 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <BubbleChevronLeft aria-label="Prev slide" onClick={handlePrev} />
        </div>
        <div className="absolute right-3 bottom-10 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <BubbleChevronRight aria-label="Next slide" onClick={handleNext} />
        </div>

        <style jsx global>{`
          .carousel-dots li button {
            background-color: #fff !important;
            opacity: 0.5;
            border-radius: 999px !important;
          }
          .carousel-dots li.slick-active button {
            background-color: #990011 !important;
            opacity: 1;
            width: 24px !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  )
}

export default HeroCarousel
