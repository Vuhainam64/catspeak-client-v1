import React from "react"

const WelcomeSection = ({ allowConnect, setAllowConnect }) => {
  return (
    <div className="relative pl-6 h-full">
      {/* Decorative connecting lines */}
      <div className="absolute left-2 top-4 h-0.5 w-20 bg-[#990011]" />
      <div className="absolute left-2 top-4 h-[220px] w-0.5 bg-[#990011]" />

      <p className="text-3xl font-bold mb-1 ml-20">Hi Quỳnh,</p>
      <h2 className="text-3xl font-bold text-[#990011] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
        Happy Halloween
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-gray-800">
        Halloween is nominally a{" "}
        <span className="font-semibold text-[#990011]">Christian holiday</span>{" "}
        honoring the souls of saints and other souls who have been blessed. It
        descends from an{" "}
        <span className="font-semibold text-[#990011]">
          ancient Celtic festival
        </span>{" "}
        of the dead that marked the official end of the growing season.
      </p>
      <p className="mt-3 text-sm italic text-gray-600">Trick or Treat</p>

      <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-gray-50 px-4 py-2 text-sm text-[#990011] shadow">
        <button
          type="button"
          onClick={() => setAllowConnect((v) => !v)}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition",
            allowConnect ? "bg-yellow-500" : "bg-gray-300",
          ].join(" ")}
          aria-pressed={allowConnect}
        >
          <span
            className={[
              "h-5 w-5 transform rounded-full bg-white shadow transition",
              allowConnect ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>
        Cho phép kết nối với bạn bè quốc tế
      </div>
    </div>
  )
}

export default WelcomeSection
