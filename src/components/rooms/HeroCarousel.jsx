import React from "react"
import { BubbleChevronLeft, BubbleChevronRight } from "@/components/ui/button"

const HeroCarousel = ({ active, setActive, current, next, prev, slides }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
      <div className="relative h-[260px] w-full overflow-hidden rounded-3xl">
        <img
          src={current?.image}
          alt={current?.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]">
          <div className="inline-flex flex-col gap-3 rounded-2xl bg-black/45 px-6 py-4 backdrop-blur-[2px]">
            <p className="text-lg font-semibold uppercase">{current?.title}</p>
            <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5c518] px-5 py-2 text-sm font-semibold text-[#990011] shadow">
              {current?.cta}
            </button>
          </div>
        </div>
        <div className="absolute left-3 top-3">
          <BubbleChevronLeft aria-label="Prev slide" onClick={prev} />
        </div>
        <div className="absolute right-3 bottom-3">
          <BubbleChevronRight aria-label="Next slide" onClick={next} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 py-4">
        {slides?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={[
              "h-3 w-3 rounded-full transition",
              idx === active ? "bg-[#990011]" : "bg-gray-300",
            ].join(" ")}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
