import React from "react"
import { useLanguage } from "@/context/LanguageContext"
import { useGetProfileQuery } from "@/store/api/authApi"

const WelcomeSection = ({ allowConnect, setAllowConnect }) => {
  const { t } = useLanguage()
  const { welcome } = t.rooms
  const { data: userData } = useGetProfileQuery()
  const user = userData?.data

  return (
    <div className="relative pl-6 h-full">
      {/* Decorative connecting lines with rounded corners */}
      <div className="absolute left-2 top-4 h-0.5 w-20 bg-[#990011] rounded-r-full" />
      <div className="absolute left-2 top-4 h-[220px] w-0.5 bg-[#990011] rounded-b-full" />

      <p className="text-3xl font-bold mb-1 ml-20">
        {welcome.greeting.replace("{{name}}", user?.username || "Friend")}
      </p>
      <h2 className="text-3xl font-bold text-[#990011] drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
        {welcome.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-gray-800">
        {welcome.description.part1}
        <span className="font-semibold text-[#990011]">
          {welcome.description.highlight1}
        </span>{" "}
        {welcome.description.part2}
        <span className="font-semibold text-[#990011]">
          {welcome.description.highlight2}
        </span>{" "}
        {welcome.description.part3}
      </p>
      <p className="mt-3 text-sm italic text-gray-600">
        {welcome.trickOrTreat}
      </p>

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
        {welcome.allowConnect}
      </div>
    </div>
  )
}

export default WelcomeSection
